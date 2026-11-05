# world/

The world map's source of truth. Generated `.map` files and screenshots are build outputs in `build/` (git-ignored).

| Path | Holds |
| --- | --- |
| `config.json` | Canvas size, point count, seed and distance units for new maps |
| `frames.json` | Named regions. `center` is a fraction of the canvas; `sizeKm` is width and height in km |
| `base/` | Terrain ops shared by both eras (coastline, escarpment, rift, basalt, terraces) |
| `eras/common/` | Ops every era shares that must run after an era's climate, such as Act I's water styling |
| `eras/before/` | Pre-catastrophe water, biomes, settlements, routes and notes |
| `eras/now/` | Present-day water, biomes, settlements, routes and notes |
| `reference/act1-overview.jpg` | The canonical Act I regional overview (4K, map only). Passes from water onward trace and review against it; the terrain pass was traced from an earlier, smaller crop that agrees within one to two cells |
| `build/` | Generated `before.map`, `now.map`, screenshots and the `run_js` log |

## Ops and builds

Each op file is a JSON array of `{ "id", "tool", "args", "note" }`, replayed through the azgaar MCP server in file-name order:
`base/*.json` first, then `eras/common/*.json` and `eras/<era>/*.json` interleaved by file name (on a tie, `common` first). So
`now/00-climate.json` runs before `common/10-water.json`, and an era's `20-*.json` can override the shared water. `id` is a stable name (such as `act1.city`) so an op is edited in place rather than
appended again. The first op must be `new_map`, and `run_js` is never allowed in an op.

```
npm run world          # rebuilds world/build/now.map and its screenshots
npm run world before   # the pre-catastrophe map
```

`base/10-act1-terrain.json` sculpts Act I's rift basin into the continent and ends with `finalize_terrain`. Later ops in a file overwrite earlier ones where they overlap, so lay broad ground first and the features that must survive (rims, floors) after.

Water: lakes form wherever `finalize_terrain` finds enclosed ground below height 20, so Act I's pools (brine, acid, the teal
mineral pool, the Dead Spring and the summit lava lake) are sculpted as small pits at the end of `base/10-act1-terrain.json`.
`finalize_terrain` and `set_climate` reset every lake's look, so `eras/common/10-water.json` styles them afterwards with
`define_style_group` and `set_lakes`, draws the falls stream with `add_river` and the seasonal mineral washes as dashed lines
with `add_route`. A cell is about 2.3 km across, so a pool needs a radius of about 2 km to show, and pools closer than a cell
merge into one lake.

`eras/now/00-climate.json` applies the present-day drought with `set_climate`; the before era keeps the natural climate from `config.json`.

`base/00-continent.json` holds the continent as a custom Azgaar heightmap template. Template steps draw random positions from the seed,
so changing one step reshapes the whole continent: review the screenshots after every edit.
