# Act I in Gaea 2

Every `npm run world` writes a Gaea handoff for Act I to `world/build/gaea/<era>-act1/` (git-ignored). It is a square tile
centred on Act I with some of the surrounding plateau and rims, at 1024 x 1024 (about 125 m per pixel). This is for
visualization and look development only; Azgaar stays the master map, so geography changes go through the ops in `world/`.

| File | What it is |
| --- | --- |
| `heightfield.r32` | 32-bit float heights, 0-1, top row first. 1.0 is `terrainDefinition.heightMetres` in `gaea.json` |
| `colormap.png` | The 2D map (biomes, lakes, rivers) over the same square |
| `mask-water.png`, `mask-lakes-acid.png`, `mask-lakes-other.png`, `mask-rivers.png` | Water and lakes (acid pools separate) |
| `mask-roads.png`, `mask-washes.png` | Roads and the dashed seasonal washes, as lines |
| `mask-biome-*.png` | One mask per biome in the tile: escarpment, basalt, salt flats, acid pits, sulfur crust and so on |
| `gaea.json` | Terrain Definition values (Scale and Height in metres), metres per pixel, file list |

## Setting up a project (Gaea 2.3)

1. Keep the project and its builds in your Gaea storage folder, not in this repository.
2. Open **Terrain Definition** in the toolbar and set **Scale** and **Height** to `scaleMetres` and `heightMetres` from
   `gaea.json` (128,000 m wide for Act I; the height is the tile's highest point, around 4,300 m at the volcano).
3. Add a **File** node pointing at `heightfield.r32`. It is square, so Gaea reads its size from the file. If the tile
   looks mirrored top to bottom, add a Flip node after it.
4. Run it through an erosion node (Erosion 2 is a good start) with real scale on, then colour it with SatMap or your own
   colour nodes. The heights are already shaped (escarpment, rims, salt pan, acid dome); Gaea's job is the fine detail.
5. Load masks with more File nodes and use them as node masks: protect `mask-water` and `mask-lakes-acid` from erosion,
   drive the acid colours from `mask-lakes-acid` and `mask-biome-sulfur-crust`, keep `mask-biome-salt-flats` flat and
   pale, and use the escarpment and basalt masks for rockier erosion.
6. After a new `npm run world`, reload the File nodes; the paths stay the same, so the graph rebuilds on the new map.

The present day is `now-act1`; the pre-catastrophe map is `before-act1` (hot springs on white travertine where the
acid pits are today).
