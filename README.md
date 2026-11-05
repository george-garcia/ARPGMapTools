# ARPGMapTools

An MCP server that lets Claude (or any MCP client) drive [Azgaar's Fantasy Map Generator](https://github.com/Azgaar/Fantasy-Map-Generator) to build the ARPG's world map. It runs a pinned, unmodified Azgaar build in a headless Chromium and calls Azgaar's own `window.FMG` console API, so there is no fork and no UI clicking.

## Setup (Windows, macOS or Linux)

Needs Node.js 22+ and git.

```
npm install
npm run setup    # fetches and builds the pinned Azgaar release, installs Playwright's Chromium
npm run build    # compiles the MCP server
npm run smoke    # optional: end-to-end check over MCP, about 40 seconds
npm run world    # rebuilds the world map from the ops in world/ into world/build/now.map
```

Open this folder in Claude Code and approve the `azgaar` server from `.mcp.json`. To watch the browser while it works, add `"--headed"` to the server's `args` in `.mcp.json`.

## Tools

| Tool | What it does |
| --- | --- |
| `new_map` | Generates a new map with the canvas, points, units, globe position, winds, temperatures and content caps from `world/config.json`; terrain from a built-in template or custom `template_steps` |
| `sculpt` | Edits terrain heights inside a polygon: set, raise, lower, smooth or roughen, with a soft edge and optional natural outline noise |
| `finalize_terrain` | Rebuilds coastlines, lakes, rivers and biomes from the edited heightmap, like Azgaar's heightmap editor |
| `set_climate` | Changes precipitation and temperatures and re-derives rivers and biomes, keeping the terrain (used for the present-day drought) |
| `set_lakes` | Sets the subtype (freshwater, salt, dry, lava…), style group and name of the lakes inside a polygon |
| `define_style_group` | Adds or updates a lake or route style group (fill, stroke, dashes…), checked against Azgaar's style schema and saved in the `.map` |
| `remove_rivers` | Removes the generated (unlocked) rivers draining into a polygon |
| `add_river` | Draws a locked, named river along a polyline |
| `add_route` | Draws a locked line in any route group, such as a road or a dashed seasonal wash |
| `open_map` | Loads a `.map` file |
| `save_map` | Saves exactly what Azgaar's own Save writes, so the desktop app opens it (default `world/build/<seed>.map`) |
| `get_map_info` | Seed, version, canvas, units, cell and entity counts, and the named frames in map pixels |
| `query_cells` | Heights, biomes, features and burgs inside a polygon, in map pixels or frame-local 0-1 coordinates |
| `list` | Features, burgs, markers or routes, optionally only inside a frame |
| `screenshot` | PNG of the whole map or a named frame, UI hidden, optional layer set; saved to `world/build/screenshots/` |
| `run_js` | Dev-only escape hatch with `FMG` in scope; logged to `world/build/run-js.jsonl` |
| `close_session` | Closes the browser |

The session keeps one browser page alive, so map state persists between calls. Calls run one at a time.

## Azgaar version

`tools/azgaar/azgaar.lock.json` pins the release tag and its commit; setup refuses to build anything else. Keep it on the same release as your desktop Azgaar app. To update, change both `tag` and `commit`, run `npm run setup`, then `npm run smoke`.

## Known Azgaar behaviour

- A 100K-point map takes about 5-15 seconds to generate and saves to 9-16 MB.
- Saving, loading and saving again changes one record, `pack.cells.conf` (river confluence counts): Azgaar loads it into an 8-bit array, so counts above 255 wrap. Its desktop app does the same.
