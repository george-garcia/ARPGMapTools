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
| `mask-gaea-protect.png` | What the saved graph keeps out of erosion: standing water, lakes and the salt pan (edges feathered) |
| `mask-gaea-colour.png` | Where the saved graph uses the 2D map's own colours: lakes, rivers, acid pits, sulfur crust, salt flats, the dead spring |
| `gaea.json` | Terrain Definition values (Scale and Height in metres), metres per pixel, file list |

## The saved project: `tools/gaea/act1.terrain`

The graph is set up once and checked in. Open `tools/gaea/act1.terrain` in Gaea 2.3; it reads the files above from
`C:\Users\jorge\ARPGMapTools\world\build\gaea\now-act1\`, so after a new `npm run world` just reopen the project (or
right-click a File node and choose Refresh) and it rebuilds on the new map. Nothing needs wiring again.

| Node | What it does |
| --- | --- |
| Azgaar Heights (File) | `heightfield.r32` |
| Erosion (Erosion 2) | Gaea's erosion over the drawn landforms |
| Protect Mask (File) + Heights (Combine) | Puts the drawn heights back under `mask-gaea-protect`, so lakes, acid pools and the salt pan keep their shape. Marked for export |
| Satellite Colour (SatMap) | Natural pale desert rock colour from the heights (library item 399) |
| Azgaar Colour (File, RGB) + Biome Tint (Combine, 35%) | Tints the rock toward the 2D map's biomes |
| Colour Mask (File) + Colour (Combine, 85%) | The map's own colours on the acid ground, lakes, salt and sulfur, with a little rock texture left in. Marked for export |

Terrain Definition (Project, then Build Settings, Terrain tab) is 128,000 m wide and 8,546 m high: twice the real relief
(`heightMetres` in `gaea.json` is 4,273 m), the same exaggeration the 3D views use, because at true scale a 128 km tile
reads as flat. Set it to `heightMetres` for real proportions.

The paths are absolute, so on another machine or for the `before-act1` tile, change the four File nodes' paths (or save
a copy of the project pointing at `before-act1`). Tune erosion, the SatMap colours and the two Combine ratios in Gaea and
save; the project file is the record.

The present day is `now-act1`; the pre-catastrophe map is `before-act1` (hot springs on white travertine where the
acid pits are today).
