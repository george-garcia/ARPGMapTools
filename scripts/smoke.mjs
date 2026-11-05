// End-to-end check of the Azgaar MCP server over stdio, the way an MCP client uses it.
// Run `npm run build` first. Writes its files to world/build/smoke/.
import { readFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import { Client } from "@modelcontextprotocol/sdk/client/index.js";
import { StdioClientTransport } from "@modelcontextprotocol/sdk/client/stdio.js";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");
const client = new Client({ name: "smoke", version: "1.0.0" });
await client.connect(
  new StdioClientTransport({ command: process.execPath, args: [join(root, "tools/azgaar-mcp/dist/index.js")], env: process.env, stderr: "inherit" })
);

let failures = 0;
const check = (label, ok, detail = "") => {
  console.log(`${ok ? "PASS" : "FAIL"}  ${label}${detail ? `  (${detail})` : ""}`);
  if (!ok) failures++;
};
async function call(name, args = {}) {
  const started = Date.now();
  const res = await client.callTool({ name, arguments: args });
  const text = res.content.find(c => c.type === "text")?.text ?? "";
  if (res.isError) throw new Error(`${name} failed: ${text}`);
  let json;
  try {
    json = JSON.parse(text);
  } catch {
    json = text;
  }
  const body = json?.result !== undefined && json?.pageErrors ? json.result : json;
  if (json?.pageErrors) console.log(`      page errors from ${name}:`, json.pageErrors);
  return { body, res, ms: Date.now() - started };
}

try {
  const { tools } = await client.listTools();
  const names = tools.map(t => t.name).sort();
  check(
    "tools registered",
    names.length === 12 && ["set_climate", "sculpt", "finalize_terrain"].every(n => names.includes(n)),
    names.join(", ")
  );

  const gen = await call("new_map", { seed: "smoke-test" });
  check("new_map builds a 100K-point map", gen.body.cells.grid >= 99000 && gen.body.points === 100000, `${gen.body.cells.grid} cells in ${gen.ms} ms`);
  check("new_map uses 0.5 km per pixel", gen.body.units.scale === 0.5 && gen.body.units.unit === "km");
  check("new_map uses the 1920x1080 canvas", gen.body.canvas.width === 1920 && gen.body.canvas.height === 1080);

  const info = await call("get_map_info");
  const act1 = info.body.frames.find(f => f.name === "act1");
  check("act1 frame resolves to map pixels", act1 && act1.width === 200 && act1.height === 128, JSON.stringify(act1));

  const square = [[0.4, 0.4], [0.6, 0.4], [0.6, 0.6], [0.4, 0.6]];
  const sculpted = await call("sculpt", { frame: "act1", polygon: square, op: "set", value: 70, feather_km: 1 });
  check("sculpt edits the heightmap", sculpted.body.cellsChanged > 20, `${sculpted.body.cellsChanged} cells`);
  const pendingSave = await client.callTool({ name: "save_map", arguments: { path: "world/build/smoke/pending.map" } });
  check("save_map refuses while terrain edits are pending", pendingSave.isError === true);
  const finalized = await call("finalize_terrain");
  const peak = await call("query_cells", { frame: "act1", polygon: [[0.45, 0.45], [0.55, 0.45], [0.55, 0.55], [0.45, 0.55]] });
  check("finalize_terrain rebuilds from the edit", !finalized.body.terrainPending && peak.body.height?.min >= 65, JSON.stringify(peak.body.height));

  const saved = await call("save_map", { path: "world/build/smoke/smoke-test.map" });
  check("save_map writes a .map file", saved.body.bytes > 1_000_000, `${(saved.body.bytes / 1e6).toFixed(1)} MB in ${saved.ms} ms`);

  await call("new_map", { seed: "smoke-other", points: 10000 });
  const opened = await call("open_map", { path: "world/build/smoke/smoke-test.map" });
  check("open_map restores the saved map", opened.body.seed === "smoke-test" && opened.body.cells.grid === gen.body.cells.grid, `${opened.ms} ms`);

  const resaved = await call("save_map", { path: "world/build/smoke/smoke-roundtrip.map" });
  const a = readFileSync(join(root, "world/build/smoke/smoke-test.map"), "utf8").split(/\r\n/);
  const b = readFileSync(join(root, "world/build/smoke/smoke-roundtrip.map"), "utf8").split(/\r\n/);
  const differing = a.map((line, i) => (line === b[i] ? null : i)).filter(i => i !== null);
  // record 5 is Azgaar's rendered SVG (draw order can change on reload); 18 is the known pack.cells.conf 8-bit wrap
  const dataDiffs = differing.filter(i => i !== 5 && i !== 18);
  check("save -> open -> save keeps the map data", a.length === b.length && dataDiffs.length === 0, `records ${a.length}; differing records: ${differing.join(",") || "none"}`);

  const query = await call("query_cells", { frame: "act1", polygon: [[0, 0], [1, 0], [1, 1], [0, 1]], include_cells: 3 });
  check("query_cells covers the act1 frame", query.body.cells > 100, `${query.body.cells} cells, ${query.body.landCells} land`);

  const features = await call("list", { kind: "features", limit: 5 });
  check("list returns features", features.body.total > 0, `${features.body.total} features`);
  check("config turns off procedural towns and markers", gen.body.counts.burgs === 0 && gen.body.counts.markers === 0);

  const shot = await call("screenshot", { frame: "act1", name: "smoke-act1" });
  const image = shot.res.content.find(c => c.type === "image");
  const png = image ? Buffer.from(image.data, "base64") : Buffer.alloc(0);
  const width = png.length > 24 ? png.readUInt32BE(16) : 0;
  const height = png.length > 24 ? png.readUInt32BE(20) : 0;
  check("screenshot of act1 returns a framed PNG", image && Math.abs(width / height - 200 / 128) < 0.05, `${width}x${height}`);

  const full = await call("screenshot", { name: "smoke-full", layers: ["heightmap", "rivers", "burgIcons"] });
  check("full-map screenshot with chosen layers", full.res.content.some(c => c.type === "image"));
  const layersAfter = await call("run_js", { code: "return ['heightmap','states','burgIcons'].map(id => FMG.Layers.isOn(id));" });
  check("screenshot restores the previous layers", JSON.stringify(layersAfter.body) === "[false,true,true]", JSON.stringify(layersAfter.body));

  const js = await call("run_js", { code: "return FMG.VERSION;" });
  check("run_js reaches FMG", typeof js.body === "string", js.body);

  await call("close_session");
} catch (error) {
  failures++;
  console.error(`FAIL  ${error.message}`);
} finally {
  await client.close();
}
console.log(failures ? `\n${failures} check(s) failed` : "\nAll checks passed");
process.exit(failures ? 1 : 0);
