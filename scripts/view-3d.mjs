// Opens an exported 3D region (world/build/3d/<name>) in the interactive terrain viewer.
// Usage: npm run viewer -- [name]   (default now-act1-3d). Builds write these exports; run `npm run world` first.
import { existsSync, readdirSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import { startStaticServer } from "../tools/azgaar-mcp/dist/static-server.js";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");
const exports = join(root, "world/build/3d");
const available = existsSync(exports) ? readdirSync(exports) : [];
const name = process.argv[2] ?? "now-act1-3d";
if (!available.includes(name)) {
  console.error(`No export "${name}" in world/build/3d. Available: ${available.join(", ") || "none (run npm run world)"}`);
  process.exit(1);
}
const server = await startStaticServer(root);
console.log(`Terrain viewer: ${server.url}tools/azgaar-mcp/viewer/terrain.html?data=/world/build/3d/${name}`);
console.log("Drag to orbit, scroll to zoom, right-drag to pan. Ctrl+C to stop.");
