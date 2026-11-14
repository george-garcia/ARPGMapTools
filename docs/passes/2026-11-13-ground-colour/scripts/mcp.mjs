// tiny MCP client helper for the azgaar server (read/dev use; ops replayed exactly as build-world.mjs does)
import { existsSync, readdirSync, readFileSync } from "node:fs";
import { join } from "node:path";
import { Client } from "/home/claude/arpgmaptools/node_modules/@modelcontextprotocol/sdk/dist/esm/client/index.js";
import { StdioClientTransport } from "/home/claude/arpgmaptools/node_modules/@modelcontextprotocol/sdk/dist/esm/client/stdio.js";
export const root = "/home/claude/arpgmaptools";
export async function connect() {
  const client = new Client({ name: "p2-dev", version: "1.0.0" });
  await client.connect(new StdioClientTransport({ command: process.execPath, args: [join(root, "tools/azgaar-mcp/dist/index.js")], cwd: root, env: process.env, stderr: "inherit" }));
  const call = async (name, args = {}) => {
    const res = await client.callTool({ name, arguments: args }, undefined, { timeout: 15 * 60_000 });
    const text = res.content.find(c => c.type === "text")?.text ?? "";
    if (res.isError) throw new Error(`${name} failed: ${text}`);
    try { return JSON.parse(text); } catch { return text; }
  };
  return { client, call };
}
export function opFiles(era) {
  const dirs = ["world/base", "world/eras/common", `world/eras/${era}`];
  const f = d => existsSync(join(root, d)) ? readdirSync(join(root, d)).filter(n => n.endsWith(".json")).map(name => ({ dir: d, name })) : [];
  const base = f(dirs[0]).sort((a, b) => a.name < b.name ? -1 : 1);
  const eras = [...f(dirs[1]), ...f(dirs[2])].sort((a, b) => (a.name === b.name ? a.dir.localeCompare(b.dir) : a.name < b.name ? -1 : 1));
  return [...base, ...eras];
}
export function ops(files) {
  return files.flatMap(({ dir, name }) => JSON.parse(readFileSync(join(root, dir, name), "utf8")).map(op => ({ ...op, file: `${dir}/${name}` })));
}
export async function dumpCells(call) {
  const cells = [];
  const T = 60;
  for (let y = 0; y < 1080; y += T)
    for (let x = 0; x < 1920; x += T) {
      const r = await call("query_cells", { polygon: [[x, y], [x + T, y], [x + T, y + T], [x, y + T]], include_cells: 1000 });
      cells.push(...r.sample);
    }
  return cells;
}
