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
  "sculpt",
  {
    title: "Sculpt the heightmap",
    description:
      "Edits terrain heights inside a polygon (Azgaar heights 0-100; 20 is the shoreline, land is 20+). Ops: set (blend toward value), raise/lower (by value), smooth (value 0-1 strength), roughen (value = amplitude, natural noise). Cells inside get the full effect, cells within feather_km outside fade out. With `frame`, polygon points are frame-local 0-1 (x west to east, y north to south). Edits stack; run finalize_terrain afterwards to rebuild coastlines, lakes, rivers and biomes.",
    inputSchema: {
      polygon: z.array(point).min(3),
      frame: z.string().optional(),
      op: z.enum(["set", "raise", "lower", "smooth", "roughen"]),
      value: z.number(),
      feather_km: z.number().min(0).default(2).describe("Soft edge width outside the polygon"),
      noise_km: z.number().positive().default(3).describe("Feature size of the noise used by roughen and edge_noise_km"),
      edge_noise_km: z.number().min(0).default(0).describe("Wobbles the polygon outline by up to this distance for natural, irregular borders"),
      seed: z.number().int().default(1).describe("Noise seed for roughen and edge_noise_km"),
      clamp: z.tuple([z.number(), z.number()]).optional().describe("Keep results within [min, max], e.g. [21, 100] to keep a basin floor above the shoreline")
    }
  },
  ({ polygon, frame, op, value, feather_km, noise_km, edge_noise_km, seed, clamp }) =>
    respond(async () => {
      const config = loadConfig();
      const kmPerPx = config.units.distance.scale;
      const box = frame ? getFrame(frame) : undefined;
      const mapPolygon: Point[] = box ? polygon.map(p => toMap(box, p as Point)) : (polygon as Point[]);
      return session.sculpt({
        polygon: mapPolygon,
        op,
        value,
        featherPx: feather_km / kmPerPx,
        noisePx: noise_km / kmPerPx,
        edgeNoisePx: edge_noise_km / kmPerPx,
        seed,
        clamp: clamp as [number, number] | undefined
      });
    })
);

server.registerTool(
  "finalize_terrain",
  {
    title: "Rebuild from the edited terrain",
    description:
      "After sculpt edits: rebuilds coastlines, lakes, rivers, biomes and everything downstream from the edited heightmap (Azgaar's heightmap-editor Erase finalize, without erosion), then clears procedural markers if world/config.json turns them off.",
    inputSchema: {}
  },
  () => respond(() => session.finalizeTerrain(loadConfig().generation?.markers !== 0))
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

/** Polygon or polyline from the caller, in map pixels: frame-local 0-1 points with `frame`, map pixels otherwise */
const toMapPoints = (points: number[][], frame?: string): Point[] => {
  const box = frame ? getFrame(frame) : undefined;
  return box ? points.map(p => toMap(box, p as Point)) : (points as Point[]);
};
const wholeFrame = [[0, 0], [1, 0], [1, 1], [0, 1]];

server.registerTool(
  "define_style_group",
  {
    title: "Define a lake or route style group",
    description:
      "Adds a style group to the lakes or routes layer, or updates one; or restyles an existing label group (city, town, added, river, …). A new lake group starts from the freshwater look, a new route group from trails; the given SVG attrs are merged over it and checked against Azgaar's style schema. Lakes take opacity, fill, fill-opacity, stroke, stroke-width, stroke-opacity, stroke-dasharray, filter; routes the same minus fill; labels also take font-family, font-size (a percentage such as '5%'), font-style, font-weight, letter-spacing and style. A null value unsets an attr. Styles are saved in the .map.",
    inputSchema: {
      layer: z.enum(["lakes", "routes", "labels"]),
      group: z.string().regex(/^[a-zA-Z][\w-]*$/),
      attrs: z.record(z.string(), z.union([z.string(), z.number(), z.null()])),
      zoom: z
        .object({ min: z.number().min(0), max: z.number().positive() })
        .optional()
        .describe("Labels only: the zoom range the group shows at (1 = whole map; an act-sized frame is about 8)")
    }
  },
  ({ layer, group, attrs, zoom }) => respond(() => session.defineStyleGroup(layer, group, attrs, zoom))
);

const toMapPoint = (p: number[], frame?: string): Point => toMapPoints([p], frame)[0];

server.registerTool(
  "add_burg",
  {
    title: "Found a settlement",
    description:
      "Founds a locked burg (settlement) at a point: name, population in people, burg group (capital, city, town, fort, village, hamlet…) and buildings (walls, citadel, plaza, temple, shanty). The trail Azgaar would auto-link to the nearest route is removed, so roads stay hand-drawn. `note` is HTML for the burg's note, e.g. '[placeholder] name from the overview'. With `frame`, the point is frame-local 0-1. The cell must be dry land without a burg.",
    inputSchema: {
      point,
      frame: z.string().optional(),
      name: z.string().min(1),
      population: z.number().min(0).optional(),
      group: z.string().optional(),
      buildings: z
        .object({ walls: z.boolean(), citadel: z.boolean(), plaza: z.boolean(), temple: z.boolean(), shanty: z.boolean() })
        .partial()
        .optional(),
      note: z.string().optional()
    }
  },
  ({ point: p, frame, name, population, group, buildings, note }) =>
    respond(() => session.addBurg({ point: toMapPoint(p, frame), name, population, group, buildings, note }))
);

server.registerTool(
  "add_label",
  {
    title: "Place a text label",
    description:
      "Places a free text label (a region or landform name) at a point, in an 'added' label group (default: Azgaar's first one, 'added'), with an optional HTML note. Restyle the group with define_style_group on the labels layer. With `frame`, the point is frame-local 0-1.",
    inputSchema: {
      point,
      frame: z.string().optional(),
      text: z.string().min(1),
      group: z.string().optional(),
      note: z.string().optional(),
      size: z.number().min(30).max(300).optional().describe("This label's font size as a percentage of its group's (30-300)")
    }
  },
  ({ point: p, frame, text, group, note, size }) =>
    respond(() => session.addLabel({ point: toMapPoint(p, frame), text, group, note, size }))
);

server.registerTool(
  "add_marker",
  {
    title: "Place a marker",
    description:
      "Places a locked map marker at a point. A type from Azgaar's markers config (volcanoes, ruins, …) brings its own icon and legend, each replaced by the name, note or icon given; any other type needs a note (HTML). `icon` is an emoji or an Azgaar icon id. With `frame`, the point is frame-local 0-1.",
    inputSchema: {
      point,
      frame: z.string().optional(),
      type: z.string().min(1),
      name: z.string().optional(),
      note: z.string().optional(),
      icon: z.string().optional()
    }
  },
  ({ point: p, frame, type, name, note, icon }) =>
    respond(() => session.addMarker({ point: toMapPoint(p, frame), type, name, note, icon }))
);

server.registerTool(
  "paint_biome",
  {
    title: "Paint a biome",
    description:
      "Paints the land cells inside a polygon with a biome. A new name creates a custom biome (color required); an existing one (custom or Azgaar's, e.g. 'Hot desert') is reused, and color/habitability, when given, update it. `heights` [min, max] limits painting to cells in that height range, so edges follow the terrain (e.g. [28, 100] for terrace benches). finalize_terrain and set_climate repaint every biome, so paint after them. With `frame`, points are frame-local 0-1; omit `polygon` to cover the whole frame.",
    inputSchema: {
      name: z.string().min(1),
      color: z.string().optional().describe("Hex colour, e.g. '#D9D1B9'"),
      habitability: z.number().min(0).optional().describe("Percent; drives rural population, 0 is uninhabitable"),
      polygon: z.array(point).min(3).optional(),
      frame: z.string().optional(),
      heights: z.tuple([z.number(), z.number()]).optional()
    }
  },
  ({ name, color, habitability, polygon, frame, heights }) =>
    respond(async () => {
      if (!polygon && !frame) throw new Error("Pass a polygon, a frame, or both");
      return session.paintBiome({ name, color, habitability }, toMapPoints(polygon ?? wholeFrame, frame), heights as [number, number] | undefined);
    })
);

server.registerTool(
  "set_lakes",
  {
    title: "Set lakes' subtype, look and name",
    description:
      "For every lake with a cell inside the polygon: sets its subtype (freshwater, salt, dry, sinkhole, frozen, lava), its style group (from define_style_group or a stock one) and/or its name. Lakes form where finalize_terrain finds enclosed ground below height 20. Run after finalize_terrain and set_climate, which reset lake groups. With `frame`, points are frame-local 0-1; omit `polygon` to cover the whole frame.",
    inputSchema: {
      polygon: z.array(point).min(3).optional(),
      frame: z.string().optional(),
      subtype: z.enum(["freshwater", "salt", "dry", "sinkhole", "frozen", "lava"]).optional(),
      group: z.string().optional(),
      name: z.string().optional()
    }
  },
  ({ polygon, frame, subtype, group, name }) =>
    respond(async () => {
      if (!polygon && !frame) throw new Error("Pass a polygon, a frame, or both");
      return session.setLakes(toMapPoints(polygon ?? wholeFrame, frame), { subtype, group, name });
    })
);

server.registerTool(
  "remove_rivers",
  {
    title: "Remove generated rivers",
    description:
      "Removes every unlocked river whose mouth lies inside the polygon, with its tributaries (rivers from add_river are locked and stay): the generated rivers draining into a region, before hand-placed ones go in with add_river. With `frame`, points are frame-local 0-1; omit `polygon` to cover the whole frame.",
    inputSchema: { polygon: z.array(point).min(3).optional(), frame: z.string().optional() }
  },
  ({ polygon, frame }) =>
    respond(async () => {
      if (!polygon && !frame) throw new Error("Pass a polygon, a frame, or both");
      return session.removeRivers(toMapPoints(polygon ?? wholeFrame, frame));
    })
);

server.registerTool(
  "add_river",
  {
    title: "Draw a river",
    description:
      "Draws a river along a polyline from source to mouth through the cells under it, and locks it so later climate and river regeneration keep its course. It joins a river it ends on. With `frame`, points are frame-local 0-1. Widths are in km: source_width at the source, width_factor how fast it widens.",
    inputSchema: {
      points: z.array(point).min(2),
      frame: z.string().optional(),
      name: z.string().optional(),
      type: z.string().optional().describe("Free label such as River, Creek, Stream, Falls"),
      source_width: z.number().min(0).optional(),
      width_factor: z.number().min(0).optional()
    }
  },
  ({ points, frame, name, type, source_width, width_factor }) =>
    respond(() =>
      session.addRiver(toMapPoints(points, frame), { name, type, sourceWidth: source_width, widthFactor: width_factor })
    )
);

server.registerTool(
  "add_route",
  {
    title: "Draw a route line",
    description:
      "Draws a locked line in a route group (roads, trails, searoutes, or a group from define_style_group, e.g. a dashed seasonal wash) along a polyline. With `frame`, points are frame-local 0-1.",
    inputSchema: {
      points: z.array(point).min(2),
      frame: z.string().optional(),
      group: z.string(),
      name: z.string().optional()
    }
  },
  ({ points, frame, group, name }) => respond(() => session.addRoute(toMapPoints(points, frame), group, name))
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
  "screenshot_3d",
  {
    title: "3D render of the map or a frame",
    description:
      "Without `frame`: Azgaar's own 3D view of the whole map (erosion detail and satellite texture, default isometric camera). With `frame`: exports that frame plus `margin` (a fraction of its size on every side) as eroded heights and a 2D map texture to world/build/3d/<name>/, then renders it in the terrain viewer (tools/azgaar-mcp/viewer) from each camera: overview (from the south, like the regional overview), low (closer, nearer the ground) or top. Images are saved to world/build/screenshots/<name>[-<camera>].png and returned. Dev visualization only.",
    inputSchema: {
      frame: z.string().optional(),
      cameras: z.array(z.enum(["overview", "low", "top"])).default(["overview"]),
      margin: z.number().min(0).max(1).default(0.3),
      exaggeration: z.number().positive().optional().describe("Vertical exaggeration in the terrain viewer (default 2)"),
      layers: z.array(z.string()).default(["biomes", "lakes", "rivers", "routes", "burgIcons"]).describe("2D layers baked into the frame texture"),
      name: z.string().regex(/^[\w.-]+$/)
    }
  },
  async ({ frame, cameras, margin, exaggeration, layers, name }) => {
    const images: Buffer[] = [];
    const result = await respond(async () => {
      if (!frame) {
        const image = await session.render3dMap();
        images.push(image);
        const file = screenshotPath(name);
        writeFileSync(resolvePath(file, true), image);
        return { paths: [resolvePath(file)] };
      }
      session.assertViewerInstalled();
      const f = getFrame(frame);
      const box = { ...f, x: f.x - f.width * margin, y: f.y - f.height * margin, width: f.width * (1 + 2 * margin), height: f.height * (1 + 2 * margin) };
      const kmPerPx = loadConfig().units.distance.scale;
      const dir = `world/build/3d/${name}`;
      const meta = await session.exportRegion(box, dir, {
        perPx: 3,
        layers,
        kmPerPx,
        frameKm: [f.width * kmPerPx, f.height * kmPerPx],
        title: `${name} (${frame})`
      });
      const paths: string[] = [];
      for (const camera of cameras) {
        const image = await session.renderRegion(dir, camera, exaggeration);
        images.push(image);
        const file = screenshotPath(`${name}-${camera}`);
        writeFileSync(resolvePath(file, true), image);
        paths.push(resolvePath(file));
      }
      return { paths, data: resolvePath(dir), grid: `${meta.cols}x${meta.rows}`, maxMetres: meta.maxMetres };
    });
    if (!result.isError) for (const image of images) result.content.push({ type: "image", data: image.toString("base64"), mimeType: "image/png" } as never);
    return result;
  }
);

server.registerTool(
  "export_gaea",
  {
    title: "Export a region for Gaea",
    description:
      "Exports a square region for QuadSpinner Gaea 2 to world/build/gaea/<name>/: heightfield.r32 (32-bit float 0-1, from Azgaar's eroded 3D bake, in metres scaled to the region's highest point), colormap.png, 8-bit grayscale PNG masks (water, lakes-acid, lakes-other, rivers, roads, washes, one per biome) and gaea.json with the Terrain Definition values (Scale and Height in metres). With `frame`, the square is centred on the frame and is its longer side plus `margin` on each side; without, it covers the whole map. Dev visualization only.",
    inputSchema: {
      frame: z.string().optional(),
      size: z.number().int().min(256).max(4096).default(1024).describe("Pixels per side"),
      margin: z.number().min(0).max(1).default(0.14),
      name: z.string().regex(/^[\w.-]+$/)
    }
  },
  ({ frame, size, margin, name }) =>
    respond(async () => {
      const config = loadConfig();
      const kmPerPx = config.units.distance.scale;
      let box;
      if (frame) {
        const f = getFrame(frame);
        const side = Math.max(f.width, f.height) * (1 + 2 * margin);
        box = { ...f, x: f.x + f.width / 2 - side / 2, y: f.y + f.height / 2 - side / 2, width: side, height: side };
      } else {
        const side = Math.max(config.canvas.width, config.canvas.height);
        box = { name: "map", x: config.canvas.width / 2 - side / 2, y: config.canvas.height / 2 - side / 2, width: side, height: side };
      }
      return session.exportGaea(box, `world/build/gaea/${name}`, size, kmPerPx, `${name}${frame ? ` (${frame})` : ""}`);
    })
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
