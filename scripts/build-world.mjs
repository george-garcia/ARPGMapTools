// Rebuilds a world map from the recorded ops: world/base/*.json, then the era's ops, in file-name order.
// The era's ops are world/eras/common/*.json (shared by every era) and world/eras/<era>/*.json, interleaved by
// file name, so now/00-climate.json runs before common/10-water.json and an era's 20-*.json can override it.
// Each op file is a JSON array of { id, tool, args, note } replayed through the azgaar MCP server.
// Usage: node scripts/build-world.mjs [now|before]   (default: now)
import { existsSync, readdirSync, readFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import { Client } from "@modelcontextprotocol/sdk/client/index.js";
import { StdioClientTransport } from "@modelcontextprotocol/sdk/client/stdio.js";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");
const era = process.argv[2] ?? "now";
if (!["now", "before"].includes(era)) throw new Error(`Unknown era "${era}". Use "now" or "before".`);

function opFiles(...dirs) {
  return dirs
    .flatMap(dir => {
      const full = join(root, dir);
      return existsSync(full) ? readdirSync(full).filter(f => f.endsWith(".json")).map(name => ({ dir, name })) : [];
    })
    .sort((a, b) => (a.name === b.name ? a.dir.localeCompare(b.dir) : a.name < b.name ? -1 : 1))
    .map(({ dir, name }) => join(dir, name));
}

const files = [...opFiles("world/base"), ...opFiles("world/eras/common", `world/eras/${era}`)];
const ops = files.flatMap(file => {
  const list = JSON.parse(readFileSync(join(root, file), "utf8"));
  if (!Array.isArray(list)) throw new Error(`${file} must be a JSON array of ops`);
  return list.map(op => ({ ...op, file }));
});
const ids = new Set();
for (const op of ops) {
  if (!op.id || !op.tool) throw new Error(`An op in ${op.file} is missing "id" or "tool"`);
  if (ids.has(op.id)) throw new Error(`Duplicate op id "${op.id}" (in ${op.file})`);
  if (op.tool === "run_js") throw new Error(`Op "${op.id}" uses run_js; promote it to a named tool before a build depends on it`);
  ids.add(op.id);
}
if (ops[0]?.tool !== "new_map") throw new Error("The first op must be new_map (world/base/00-*.json)");

const client = new Client({ name: "build-world", version: "1.0.0" });
await client.connect(
  new StdioClientTransport({ command: process.execPath, args: [join(root, "tools/azgaar-mcp/dist/index.js")], env: process.env, stderr: "inherit" })
);

async function call(name, args) {
  const res = await client.callTool({ name, arguments: args });
  const text = res.content.find(c => c.type === "text")?.text ?? "";
  if (res.isError) throw new Error(`${name} failed: ${text}`);
  return text;
}

try {
  for (const op of ops) {
    const started = Date.now();
    const result = await call(op.tool, op.args ?? {});
    const summary = op.tool === "sculpt" ? "" : `  ${result.replace(/\s+/g, " ").slice(0, 160)}`;
    console.log(`ok  ${op.id} (${op.tool}, ${op.file}) ${Date.now() - started} ms${summary}`);
  }
  console.log(await call("save_map", { path: `world/build/${era}.map` }));
  for (const [name, layers] of [
    ["heightmap", ["heightmap", "rivers", "lakes", "routes", "burgIcons"]],
    ["biomes", ["biomes", "rivers", "lakes", "routes", "burgIcons", "labels", "markers"]]
  ]) {
    await call("screenshot", { name: `${era}-${name}`, layers });
    await call("screenshot", { name: `${era}-act1-${name}`, frame: "act1", layers });
  }
  console.log(`Screenshots in world/build/screenshots/${era}-*.png`);
} finally {
  await client.close();
}
