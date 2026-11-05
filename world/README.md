# world/

The world map's source of truth. Generated `.map` files and screenshots are build outputs in `build/` (git-ignored).

| Path | Holds |
| --- | --- |
| `config.json` | Canvas size, point count, seed and distance units for new maps |
| `frames.json` | Named regions. `center` is a fraction of the canvas; `sizeKm` is width and height in km |
| `base/` | Terrain ops shared by both eras (coastline, escarpment, rift, basalt, terraces) |
| `eras/before/` | Pre-catastrophe water, biomes, settlements, routes and notes |
| `eras/now/` | Present-day water, biomes, settlements, routes and notes |
| `build/` | Generated `before.map`, `now.map`, screenshots and the `run_js` log |

## Ops and builds

Each op file is a JSON array of `{ "id", "tool", "args", "note" }`, replayed through the azgaar MCP server in file-name order:
`base/*.json` first, then `eras/<era>/*.json`. `id` is a stable name (such as `act1.city`) so an op is edited in place rather than
appended again. The first op must be `new_map`, and `run_js` is never allowed in an op.

```
npm run world          # rebuilds world/build/now.map and its screenshots
npm run world before   # the pre-catastrophe map
```

`eras/now/00-climate.json` applies the present-day drought with `set_climate`; the before era keeps the natural climate from `config.json`.

`base/00-continent.json` holds the continent as a custom Azgaar heightmap template. Template steps draw random positions from the seed,
so changing one step reshapes the whole continent: review the screenshots after every edit.
