#!/usr/bin/env node
import { appendFileSync, mkdirSync, writeFileSync } from "node:fs";
import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import { z } from "zod";
import { AzgaarSession, screenshotPath } from "./session.js";
import { buildDir, getFrame, loadConfig, loadFrames, type Point, resolvePath, toMap } from "./world.js";

const headed = process.argv.includes("--headed") || process.env.AZGAAR_HEADED === "1";
const session = new AzgaarSession(loadConfig().canvas, headed);
const server = new McpServer({ name: "azgaar", version: "0.1.0" });

type Content = { type: "text"; text: string } | { type: "image"; data: string; mimeType: string };

/** Runs a tool body in the session queue and reports page errors alongside the result */
async function respond(work: () => Promise<unknown>, extra: Content[] = []) {
  try {
    const result = await session.exclusive(work);
    const pageErrors = session.takeErrors();
    const body = pageErrors.length ? { result, pageErrors } : result;
    return { content: [{ type: "text" as const, text: JSON.stringify(body, null, 2) }, ...extra] };
  } catch (error) {
    const message = error instanceof Error ? error.message : String(error);
    const pageErrors = session.takeErrors();
    const text = pageErrors.length ? `${message}\n\nPage errors:\n${pageErrors.join("\n")}` : message;
    return { content: [{ type: "text" as const, text }], isError: true };
  }
}

const point = z.tuple([z.number(), z.number()]);

server.registerTool(
  "new_map",
  {
    title: "Generate a new map",
    description:
      "Replaces the current map with a newly generated one. Canvas, points, units, globe position, winds, temperatures and procedural-content caps come from world/config.json. The terrain comes from a built-in template, from custom template_steps, or is random. Seeds are reproducible only with the same Azgaar version and settings.",
    inputSchema: {
      seed: z.string().optional().describe("Map seed; defaults to world/config.json"),
      template: z.string().optional().describe("Azgaar built-in heightmap template id, e.g. 'continents', 'pangea'"),
      template_steps: z
        .array(z.string())
        .optional()
        .describe(
          "Custom heightmap template, one Azgaar step per entry: 'Tool count height x% y%', e.g. 'Hill 1 80-85 40-60 40-60'. Tools: Hill, Pit, Range, Trough, Strait, Mask, Invert, Add, Multiply, Smooth"
        ),
      points: z.number().int().optional().describe("Cell count, one of Azgaar's steps (1000 to 100000)")
    }
  },
  ({ seed, template, template_steps, points }) =>
    respond(async () => {
      const config = loadConfig();
      return session.newMap({
        ...config,
        seed: seed ?? config.seed,
        points: points ?? config.points,
        template,
        templateSteps: template_steps
      });
    })
);

server.registerTool(
  "open_map",
  {
    title: "Open a .map file",
    description: "Loads a .map file (absolute, or relative to the repository root) into the session.",
    inputSchema: { path: z.string() }
  },
  ({ path }) => respond(() => session.openMap(path))
);

server.registerTool(
  "save_map",
  {
    title: "Save the map",
    description:
      "Writes the current map as a .map file, byte-for-byte what Azgaar's own Save produces, so the desktop app can open it. Defaults to world/build/<seed>.map.",
    inputSchema: { path: z.string().optional() }
  },
  ({ path }) =>
    respond(async () => {
      const target = path ?? `world/build/${(await session.info()).seed}.map`;
      return session.saveMap(target);
    })
);

server.registerTool(
  "set_climate",
  {
    title: "Change the climate",
    description:
      "Changes precipitation (Azgaar's %, 100 is Earth-like) and/or temperatures (degrees C at the equator and poles) on the current map, then re-derives temperature, precipitation, rivers and biomes. Terrain is untouched. Use in an era's ops to make that era wetter or drier than the shared base.",
    inputSchema: {
      precipitation: z.number().min(0).max(500).optional(),
      temperature: z
        .object({ equator: z.number().optional(), northPole: z.number().optional(), southPole: z.number().optional() })
        .optional()
    }
  },
  ({ precipitation, temperature }) => respond(() => session.setClimate({ precipitation, temperature }))
);

server.registerTool(
  "get_map_info",
  {
    title: "Map summary",
    description: "Seed, version, canvas, units, cell and entity counts of the current map, plus the named frames in map pixels.",
    inputSchema: {}
  },
  () => respond(async () => ({ ...(await session.info()), frames: loadFrames() }))
);

server.registerTool(
  "query_cells",
  {
    title: "Query cells in a polygon",
    description:
      "Summarises the cells whose centres fall inside a polygon: heights (0-100, land starts at 20), biomes, features and burgs. With `frame`, polygon points are frame-local 0-1 coordinates (x west to east, y north to south); otherwise map pixels.",
    inputSchema: {
      polygon: z.array(point).min(3),
      frame: z.string().optional().describe("Named frame from world/frames.json, e.g. 'act1'"),
      include_cells: z.number().int().min(0).max(1000).default(0).describe("How many individual cells to list")
    }
  },
  ({ polygon, frame, include_cells }) =>
    respond(async () => {
      const box = frame ? getFrame(frame) : undefined;
      const mapPolygon: Point[] = box ? polygon.map(p => toMap(box, p as Point)) : (polygon as Point[]);
      return session.queryCells(mapPolygon, include_cells);
    })
);

server.registerTool(
  "list",
  {
    title: "List map entities",
    description: "Lists features (islands, lakes, oceans), burgs, markers or routes, optionally only those inside a named frame.",
    inputSchema: {
      kind: z.enum(["features", "burgs", "markers", "routes"]),
      frame: z.string().optional(),
      limit: z.number().int().min(1).max(2000).default(200)
    }
  },
  ({ kind, frame, limit }) => respond(() => session.list(kind, frame ? getFrame(frame) : undefined, limit))
);

server.registerTool(
  "screenshot",
  {
    title: "Screenshot the map",
    description:
      "PNG of the whole map, or of a named frame zoomed to fill the view, with Azgaar's UI hidden. Saved to world/build/screenshots/ and returned as an image.",
    inputSchema: {
      frame: z.string().optional(),
      layers: z.array(z.string()).optional().describe("Layer ids to show for this capture only, e.g. ['biomes','rivers','burgIcons']"),
      name: z.string().regex(/^[\w.-]+$/).optional().describe("File name without extension")
    }
  },
  async ({ frame, layers, name }) => {
    let image: Buffer | undefined;
    const file = screenshotPath(name ?? `${frame ?? "map"}-${new Date().toISOString().replace(/[:.]/g, "-")}`);
    const result = await respond(async () => {
      image = await session.screenshot(frame ? getFrame(frame) : undefined, layers);
      writeFileSync(resolvePath(file, true), image);
      return { path: resolvePath(file), bytes: image.length };
    });
    if (image && !result.isError) result.content.push({ type: "image", data: image.toString("base64"), mimeType: "image/png" } as never);
    return result;
  }
);

server.registerTool(
  "run_js",
  {
    title: "Run JavaScript in Azgaar (dev only)",
    description:
      "Escape hatch: runs `code` as the body of an async function with `FMG` (Azgaar's console API) in scope and returns its JSON-serialisable result. Logged to world/build/run-js.jsonl; never replayed by builds.",
    inputSchema: { code: z.string() }
  },
  ({ code }) =>
    respond(async () => {
      mkdirSync(buildDir, { recursive: true });
      const log = (entry: object) => appendFileSync(resolvePath("world/build/run-js.jsonl"), `${JSON.stringify(entry)}\n`);
      try {
        const result = await session.runJs(code);
        log({ at: new Date().toISOString(), code, ok: true });
        return result;
      } catch (error) {
        log({ at: new Date().toISOString(), code, ok: false, error: String(error) });
        throw error;
      }
    })
);

server.registerTool(
  "close_session",
  {
    title: "Close the browser",
    description: "Closes the headless browser. The next call starts a fresh session with a new default map.",
    inputSchema: {}
  },
  () => respond(async () => (await session.close(), { closed: true }))
);

const shutdown = async () => {
  await session.close();
  process.exit(0);
};
process.on("SIGINT", shutdown);
process.on("SIGTERM", shutdown);
process.stdin.on("close", shutdown);

await server.connect(new StdioServerTransport());
console.error(`Azgaar MCP server ready${headed ? " (headed)" : ""}`);
