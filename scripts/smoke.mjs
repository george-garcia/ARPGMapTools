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
    names.length === 21 &&
      ["set_climate", "sculpt", "finalize_terrain", "define_style_group", "set_lakes", "remove_rivers", "add_river", "add_route", "paint_biome", "add_burg", "add_marker", "add_label"].every(n =>
        names.includes(n)
      ),
    names.join(", ")
  );

  const gen = await call("new_map", { seed: "smoke-test" });
  check("new_map builds a 100K-point map", gen.body.cells.grid >= 99000 && gen.body.points === 100000, `${gen.body.cells.grid} cells in ${gen.ms} ms`);
  check("new_map uses 0.5 km per pixel", gen.body.units.scale === 0.5 && gen.body.units.unit === "km");
  check("new_map uses the 1920x1080 canvas", gen.body.canvas.width === 1920 && gen.body.canvas.height === 1080);

  const info = await call("get_map_info");
  const act1 = info.body.frames.find(f => f.name === "act1");
  check("act1 frame resolves to map pixels", act1 && act1.width === 200 && act1.height === 128, JSON.stringify(act1));

  const square = [[0.3, 0.3], [0.7, 0.3], [0.7, 0.7], [0.3, 0.7]];
  const pit = [[0.33, 0.33], [0.42, 0.33], [0.42, 0.45], [0.33, 0.45]];
  const sculpted = await call("sculpt", { frame: "act1", polygon: square, op: "set", value: 70, feather_km: 1 });
  check("sculpt edits the heightmap", sculpted.body.cellsChanged > 20, `${sculpted.body.cellsChanged} cells`);
  await call("sculpt", { frame: "act1", polygon: pit, op: "set", value: 10, feather_km: 0 });
  const pendingSave = await client.callTool({ name: "save_map", arguments: { path: "world/build/smoke/pending.map" } });
  check("save_map refuses while terrain edits are pending", pendingSave.isError === true);
  const finalized = await call("finalize_terrain");
  const peak = await call("query_cells", { frame: "act1", polygon: [[0.45, 0.45], [0.55, 0.45], [0.55, 0.55], [0.45, 0.55]] });
  check("finalize_terrain rebuilds from the edit", !finalized.body.terrainPending && peak.body.height?.min >= 65, JSON.stringify(peak.body.height));

  const lakeStyle = await call("define_style_group", { layer: "lakes", group: "smokeAcid", attrs: { fill: "#98B72C", stroke: "#E1BA29", opacity: 0.9 } });
  check("define_style_group adds a lake group", lakeStyle.body.created && lakeStyle.body.attrs.fill === "#98B72C");
  const badStyle = await client.callTool({ name: "define_style_group", arguments: { layer: "lakes", group: "smokeBad", attrs: { "font-size": 3 } } });
  check("define_style_group rejects attrs outside Azgaar's style schema", badStyle.isError === true);
  const lakes = await call("set_lakes", { frame: "act1", polygon: pit, subtype: "salt", group: "smokeAcid", name: "Smoke Pool" });
  check("set_lakes restyles the lake in a sculpted pit", lakes.body.length >= 1 && lakes.body.every(l => l.group === "smokeAcid" && l.subtype === "salt"), JSON.stringify(lakes.body));
  const river = await call("add_river", { frame: "act1", points: [[0.65, 0.65], [0.55, 0.5], [0.42, 0.4]], name: "Smoke Creek", type: "Creek" });
  check("add_river draws a named river through neighbouring cells", river.body.cells >= 3 && river.body.name === "Smoke Creek", JSON.stringify(river.body));
  const cleared = await call("remove_rivers", { frame: "act1" });
  const kept = await call("run_js", { code: `return FMG.pack.rivers.some(r => r.i === ${river.body.i} && r.lock);` });
  check("remove_rivers keeps hand-placed (locked) rivers", kept.body === true, `${cleared.body.removed} removed`);
  await call("define_style_group", { layer: "routes", group: "smokeWash", attrs: { stroke: "#9a3d17", "stroke-dasharray": "2 1" } });
  const route = await call("add_route", { frame: "act1", points: [[0.35, 0.6], [0.5, 0.65], [0.65, 0.6]], group: "smokeWash", name: "Smoke Wash" });
  check("add_route draws a line in a custom group", route.body.group === "smokeWash" && route.body.points === 3);

  const painted = await call("paint_biome", { frame: "act1", polygon: square, name: "Smoke Basalt", color: "#2D2F2F", habitability: 0, heights: [60, 100] });
  check("paint_biome creates a custom biome and paints land in the height range", painted.body.created && painted.body.cells > 20, JSON.stringify(painted.body));
  const repainted = await call("paint_biome", { frame: "act1", polygon: pit, name: "Smoke Basalt", color: "#333333" });
  const pitBiomes = await call("query_cells", { frame: "act1", polygon: pit });
  check("paint_biome reuses a biome by name and skips water", !repainted.body.created && pitBiomes.body.cells > repainted.body.cells, `${repainted.body.cells} of ${pitBiomes.body.cells} cells`);

  const routesBefore = await call("run_js", { code: "return FMG.pack.routes.length;" });
  const burg = await call("add_burg", {
    frame: "act1", point: [0.6, 0.6], name: "Smoke Keep", population: 15000, group: "city",
    buildings: { walls: true, citadel: true }, note: "<p>[placeholder]</p>"
  });
  const routesAfter = await call("run_js", { code: "return FMG.pack.routes.length;" });
  check(
    "add_burg founds a walled city with its population and leaves routes alone",
    burg.body.name === "Smoke Keep" && burg.body.group === "city" && Math.abs(burg.body.people - 15000) < 2 && burg.body.buildings.walls && burg.body.buildings.citadel && routesAfter.body === routesBefore.body,
    JSON.stringify(burg.body)
  );
  const marker = await call("add_marker", { frame: "act1", point: [0.5, 0.4], type: "ruins", name: "Smoke Ruin", note: "<p>picked over</p>" });
  check("add_marker places a named ruins marker with a note", marker.body.name === "Smoke Ruin" && marker.body.note === "<p>picked over</p>", JSON.stringify(marker.body));

  const labelStyle = await call("define_style_group", { layer: "labels", group: "added", attrs: { "font-size": "5%", fill: "#2a1d14" }, zoom: { min: 3, max: 40 } });
  check("define_style_group restyles a label group and sets its zoom range", labelStyle.body.attrs["font-size"] === "5%" && labelStyle.body.zoom?.max === 40);
  const newLabelGroup = await client.callTool({ name: "define_style_group", arguments: { layer: "labels", group: "smokeNope", attrs: { fill: "#000000" } } });
  check("define_style_group refuses to invent a label group", newLabelGroup.isError === true);
  const label = await call("add_label", { frame: "act1", point: [0.5, 0.5], text: "Smoke Basin", note: "<p>[placeholder]</p>" });
  check("add_label places a region label with a note", label.body.text === "Smoke Basin" && label.body.group === "added" && label.body.note === "<p>[placeholder]</p>", JSON.stringify(label.body));

  const saved = await call("save_map", { path: "world/build/smoke/smoke-test.map" });
  check("save_map writes a .map file", saved.body.bytes > 1_000_000, `${(saved.body.bytes / 1e6).toFixed(1)} MB in ${saved.ms} ms`);

  await call("new_map", { seed: "smoke-other", points: 10000 });
  const opened = await call("open_map", { path: "world/build/smoke/smoke-test.map" });
  check("open_map restores the saved map", opened.body.seed === "smoke-test" && opened.body.cells.grid === gen.body.cells.grid, `${opened.ms} ms`);

  const persisted = await call("run_js", {
    code: `const lake = FMG.pack.features.find(f => f && f.name === "Smoke Pool");
      return { style: FMG.styles.lakes.groups.smokeAcid?.attrs.fill, lakeGroup: lake?.group, wash: FMG.styles.routes.groups.smokeWash?.attrs.stroke,
        route: FMG.pack.routes.find(r => r.name === "Smoke Wash")?.group, river: FMG.pack.rivers.find(r => r.name === "Smoke Creek")?.lock,
        biome: FMG.pack.biomes[${painted.body.i}]?.color, biomeCells: FMG.pack.cells.biome.filter(b => b === ${painted.body.i}).length > 20,
        burg: FMG.pack.burgs[${burg.body.i}]?.name, burgNote: FMG.pack.burgs[${burg.body.i}]?.note, marker: FMG.pack.markers.find(m => m.name === "Smoke Ruin")?.note,
        label: FMG.pack.addedLabels.find(l => l.label.text === "Smoke Basin")?.note,
        labelZoom: FMG.options.map.labels.groups.find(g => g.name === "added")?.zoom.max };`
  });
  check(
    "custom lake/route groups, lakes, rivers, routes, biomes, burgs, markers and labels survive save and open",
    JSON.stringify(persisted.body) ===
      JSON.stringify({ style: "#98B72C", lakeGroup: "smokeAcid", wash: "#9a3d17", route: "smokeWash", river: true, biome: "#333333", biomeCells: true,
        burg: "Smoke Keep", burgNote: "<p>[placeholder]</p>", marker: "<p>picked over</p>", label: "<p>[placeholder]</p>", labelZoom: 40 }),
    JSON.stringify(persisted.body)
  );

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
  check("config turns off procedural towns and markers", gen.body.counts.burgs === 0 && gen.body.counts.markers === 0, JSON.stringify(gen.body.counts));

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
