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

Ops arrive in milestone 3. Each op file will be JSON: an ordered list of `{ "id", "tool", "args", "note" }`, where `id` is a stable name
(such as `act1.city`) so an op is edited in place rather than appended again.
