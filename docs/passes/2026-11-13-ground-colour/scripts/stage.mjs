// replays base + era ops whose file name sorts before "30" (everything up to the biome paint), saves a stage map
// and dumps every cell's climate biome. Usage: node stage.mjs <era>
import { writeFileSync } from "node:fs";
import { connect, opFiles, ops, dumpCells } from "./mcp.mjs";
const era = process.argv[2];
const { client, call } = await connect();
try {
  const list = ops(opFiles(era).filter(f => f.dir === "world/base" || f.name < "30"));
  for (const op of list) await call(op.tool, op.args ?? {});
  console.log("replayed", list.length);
  await call("save_map", { path: `world/build/stage-${era}.map` });
  const cells = await dumpCells(call);
  writeFileSync(`${era}-stage-cells.json`, JSON.stringify(cells));
  console.log("cells", cells.length);
} finally { await client.close(); }
