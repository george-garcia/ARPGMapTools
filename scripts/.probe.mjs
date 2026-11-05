import { Client } from "@modelcontextprotocol/sdk/client/index.js";
import { StdioClientTransport } from "@modelcontextprotocol/sdk/client/stdio.js";
const c = new Client({ name: "probe", version: "1" });
await c.connect(new StdioClientTransport({ command: process.execPath, args: ["tools/azgaar-mcp/dist/index.js"], env: process.env }));
const t = async (name, args) => (await c.callTool({ name, arguments: args })).content[0].text;
await t("open_map", { path: "world/build/now.map" });
console.log(await t("run_js", { code: process.argv[2] }));
await c.close();
