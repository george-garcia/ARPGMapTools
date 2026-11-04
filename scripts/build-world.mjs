// Rebuilds a world map from the recorded ops: world/base/*.json, then world/eras/<era>/*.json, in file-name order.
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

function opFiles(dir) {
  const full = join(root, dir);
  if (!existsSync(full)) return [];
  return readdirSync(full)
    .filter(f => f.endsWith(".json"))
    .sort()
    .map(f => join(dir, f));
}

const files = [...opFiles("world/base"), ...opFiles(`world/eras/${era}`)];
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
    await call(op.tool, op.args ?? {});
    console.log(`ok  ${op.id} (${op.tool}, ${op.file}) ${Date.now() - started} ms`);
  }
  console.log(await call("save_map", { path: `world/build/${era}.map` }));
  for (const [name, layers] of [
    ["heightmap", ["heightmap", "rivers", "lakes"]],
    ["biomes", ["biomes", "rivers", "lakes"]]
  ]) {
    await call("screenshot", { name: `${era}-${name}`, layers });
    await call("screenshot", { name: `${era}-act1-${name}`, frame: "act1", layers });
  }
  console.log(`Screenshots in world/build/screenshots/${era}-*.png`);
} finally {
  await client.close();
}
