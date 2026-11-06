# ARPGMapTools

An MCP server that lets Claude (or any MCP client) drive [Azgaar's Fantasy Map Generator](https://github.com/Azgaar/Fantasy-Map-Generator) to build the ARPG's world map. It runs a pinned, unmodified Azgaar build in a headless Chromium and calls Azgaar's own `window.FMG` console API, so there is no fork and no UI clicking.

## Setup (Windows, macOS or Linux)

Needs Node.js 22+ and git.

```
npm install
npm run setup    # fetches and builds the pinned Azgaar release, installs Playwright's Chromium
npm run build    # compiles the MCP server
npm run smoke    # optional: end-to-end check over MCP, about 2 minutes (rebuilds first)
npm run world    # compiles, then rebuilds the world map from the ops in world/ into world/build/now.map, with 2D and 3D screenshots
npm run viewer   # opens the last build's Act I in the interactive 3D terrain viewer (prints a local URL)
```

After a pull that changes `package.json` (a new dependency such as `three` for the 3D views), run `npm install` again before `npm run smoke` or `npm run world`.

Open this folder in Claude Code and approve the `azgaar` server from `.mcp.json`. To watch the browser while it works, add `"--headed"` to the server's `args` in `.mcp.json`.

## Tools

| Tool | What it does |
| --- | --- |
| `new_map` | Generates a new map with the canvas, points, units, globe position, winds, temperatures and content caps from `world/config.json`; terrain from a built-in template or custom `template_steps` |
| `sculpt` | Edits terrain heights inside a polygon: set, raise, lower, smooth or roughen, with a soft edge and optional natural outline noise |
| `finalize_terrain` | Rebuilds coastlines, lakes, rivers and biomes from the edited heightmap, like Azgaar's heightmap editor |
| `set_climate` | Changes precipitation and temperatures and re-derives rivers and biomes, keeping the terrain (used for the present-day drought) |
| `add_burg` | Founds a locked settlement with name, population, group, buildings (walls, citadel…) and a note; no auto-linked trail |
| `add_label` | Places a free text label (a region or landform name) with an optional note |
| `add_marker` | Places a locked marker (a configured type such as ruins or volcanoes, or a custom one with a note) |
| `paint_biome` | Paints land inside a polygon (optionally within a height range) with a biome, creating custom biomes by name |
| `set_lakes` | Sets the subtype (freshwater, salt, dry, lava…), style group and name of the lakes inside a polygon |
| `define_style_group` | Adds or updates a lake or route style group (fill, stroke, dashes…), or restyles a label group and the zoom range it shows at; checked against Azgaar's style schema and saved in the `.map` |
| `remove_rivers` | Removes the generated (unlocked) rivers draining into a polygon |
| `add_river` | Draws a locked, named river along a polyline |
| `add_route` | Draws a locked line in any route group, such as a road or a dashed seasonal wash |
| `open_map` | Loads a `.map` file |
| `save_map` | Saves exactly what Azgaar's own Save writes, so the desktop app opens it (default `world/build/<seed>.map`) |
| `get_map_info` | Seed, version, canvas, units, cell and entity counts, and the named frames in map pixels |
| `query_cells` | Heights, biomes, features and burgs inside a polygon, in map pixels or frame-local 0-1 coordinates |
| `list` | Features, burgs, markers or routes, optionally only inside a frame |
| `screenshot` | PNG of the whole map or a named frame, UI hidden, optional layer set; saved to `world/build/screenshots/` |
| `export_gaea` | Exports a square region for Gaea 2: a 32-bit `.r32` heightfield, a colour map, masks (water, acid pools, rivers, roads, washes, each biome, plus the two the saved Gaea graph uses) and the Terrain Definition values; see `docs/gaea.md` |
| `screenshot_3d` | 3D render: the whole map in Azgaar's own 3D view, or a frame exported (eroded heights plus the 2D map as texture) to `world/build/3d/` and rendered in the terrain viewer from overview, low or top cameras |
| `run_js` | Dev-only escape hatch with `FMG` in scope; logged to `world/build/run-js.jsonl` |
| `close_session` | Closes the browser |

The session keeps one browser page alive, so map state persists between calls. Calls run one at a time.

## Azgaar version

`tools/azgaar/azgaar.lock.json` pins the release tag and its commit; setup refuses to build anything else. Keep it on the same release as your desktop Azgaar app. To update, change both `tag` and `commit`, run `npm run setup`, then `npm run smoke`.

## Known Azgaar behaviour

- A 100K-point map takes about 5-15 seconds to generate and saves to 9-16 MB.
- Saving, loading and saving again changes one record, `pack.cells.conf` (river confluence counts): Azgaar loads it into an 8-bit array, so counts above 255 wrap. Its desktop app does the same.

## 3D views

Every `npm run world` also renders the map in 3D, for visualization only (nothing here ships):

- `world/build/screenshots/<era>-3d.png`: Azgaar's own 3D view of the continent, with its erosion-detail bake and satellite-style texture.
- `world/build/screenshots/<era>-act1-3d-overview.png` and `-low.png`: Act I in the terrain viewer (`tools/azgaar-mcp/viewer/terrain.html`, three.js), from the south like the regional overview. The heights come from Azgaar's erosion bake (about 0.5 km per sample), the colours from the 2D map, with slope shading and ground grain added; heights are exaggerated 2x.
- `world/build/3d/<era>-act1-3d/`: the exported region (`meta.json`, `heights.bin`, `texture.png`). `npm run viewer -- <name>` serves it in the interactive viewer: drag to orbit, scroll to zoom.

Rendering runs on the CPU in headless Chromium, so a build takes a few minutes longer than before.

Builds also write a Gaea 2 handoff for Act I to `world/build/gaea/<era>-act1/`: heightfield, colour map and masks. The Gaea project that reads them is saved in `tools/gaea/act1.terrain`; `docs/gaea.md` describes its graph.
