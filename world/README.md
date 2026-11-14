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
| `build/` | Generated `before.map`, `now.map`, 2D and 3D screenshots, 3D region exports (`build/3d/`) and the `run_js` log |

## Ops and builds

Each op file is a JSON array of `{ "id", "tool", "args", "note" }`, replayed through the azgaar MCP server in file-name order:
`base/*.json` first, then `eras/common/*.json` and `eras/<era>/*.json` interleaved by file name (on a tie, `common` first). So
`now/00-climate.json` runs before `common/10-water.json`, and an era's `20-*.json` can override the shared water. `id` is a stable name (such as `act1.city`) so an op is edited in place rather than
appended again. The first op must be `new_map`, and `run_js` is never allowed in an op.

```
npm run world          # rebuilds world/build/now.map and its screenshots
npm run world before   # the pre-catastrophe map
```

`base/10-act1-terrain.json` sculpts Act I's rift basin into the continent and ends with `finalize_terrain`. It works outward-in:
rift shoulders and the highland plateau are raised over the existing continent (so they keep natural relief and fade out, with
no frame-shaped edges), then the escarpment lip and the irregular rims, then the basin floor is carved, then the features inside
it. Later ops overwrite earlier ones where they overlap. Frame-local coordinates may run outside 0-1 to reach beyond the frame.

The basin drains to the salt pan, its lowest land (height 21) with the brine pools in it; the acid field sits on a low dome (24-26)
at the pan's southern edge, with its pools as small craters. Since the 13 Nov 2026 terrain-and-water pass
(`docs/passes/2026-11-13-terrain-water/`) the basin is closed on every side but two: the Caravan pass (a col at 400 m with a
limb falling each way) to the lowland, and the city's climb. That climb runs up the falls stream's graded gorge past the
upper-city shelf and on up its valley onto the plateau, and it is the only graded caravan road (legs at or under 13%) from
the floor onto the plateau (P28, P29). Players reach zones through the act's zone graph, which the story sets, so the land
doesn't have to wall anything off (George, 13 Nov 2026): rugged foot routes elsewhere are fine, and no terrain is added only to
block a route. The north rim is one raised fault block with a sharp scarp from the plateau past the volcano to the east horst,
the east horst has a sharp inner face (with two re-entrants and their fans), and the escarpment's steep face runs on along
the Caravan pass to its mouth. Ops that keep a scarp sharp (`act1.rim.north`, `act1.rim.east.face-*`, the volcano's foot)
come after the floor is carved and use a near-zero feather, with their relief added by clamped `roughen`: a wide feather
or later carving next to them would leave a graded ramp up the scarp. The south rim is two offset (en-echelon) segments
with a relay saddle at 42, the volcano is a stacked cone on the north block with a fan apron down to the pan, and the pan
reaches west into an arm between the basalt and the terraces. Re-check the climb with the review's `paths.py` (grade-limited
search) after any change to the rims.

Water: lakes form wherever `finalize_terrain` finds enclosed ground below height 20, so Act I's pools (two brine pools, eight
acid pools, the teal mineral pool and the Dead Spring's two pools: 13 lakes) are sculpted as small pits at the end of
`base/10-act1-terrain.json`. The summit lava lake is no longer a pit (it was a one-cell, 2 km shaft); it is the volcano
marker's note. `finalize_terrain` and `set_climate` reset every lake's look and name, so `eras/common/10-water.json` and the
eras' `20-water.json` style and name them afterwards with `define_style_group` and `set_lakes` (one `set_lakes` box per
lake, every name tagged `[placeholder]`). `common/10-water.json` also draws the falls stream with `add_river` and the seasonal
mineral washes as dashed lines with `add_route`. Every drawn river and wash runs in a carved channel, so its heights never
rise downstream: `add_river` and `add_route` don't check that, so read the heights along each line after a terrain change.
The salt pan's brine pools are the lowest water (surface 20.9); every other pool is at least one unit higher. A cell is about
2.3 km across, so a pool needs a radius of about 2 km to show, and pools closer than a cell merge into one lake.

The before era removes the generated rivers draining into Act I (`eras/before/05-rivers.json`) and draws its water instead:
the falls stream runs on as Spring Brook from the Slums to the Spring, which drains through its lower pool and an outflow
channel to the pan's south-west arm (`eras/before/20-water.json`). The channels are carved in the shared terrain, so today
they are dry. How large the old salt lake on the pan was is still open (P24), so no lake is drawn there.

Biomes: `finalize_terrain` and `set_climate` repaint every biome from climate, so Act I's zones are painted afterwards with
`paint_biome`, in `eras/<era>/30-biomes.json`. Each paint goes over the ones before it, and `heights` lets an edge follow the
terrain. Since the 13 Nov 2026 ground-and-colour pass (`docs/passes/2026-11-13-ground-colour/`):

- **Rim rock follows the crests and fades out.** `Rift Escarpment` (the master fault: the west wall, the Caravan pass's
  north-west face and the whole raised north block) and `Rim Hills` (the east horst, the south rim, the pass's south-east
  face) paint every cell at 44 or more within a few km of the rift floor; the outline sits a varying distance behind the crest
  (deeper over the north block), and two outer rings keep only higher ground, so the rock thins out into the continent instead
  of ending on a frame. The polygons are generated from the floor's distance field (the generator is described in the pass
  report); after a terrain change to the rims, regenerate them rather than nudging vertices.
- **The volcano is a cone:** `Recent Basalt` covers the cone (58 and up inside its foot) and its flows, so it stands black on
  the north block's red rock. `Old Basalt` stops at 43, below the north wall.
- **The floor runs coarse to fine:** `Boulder Fans` at the escarpment's foot (the Slums terrace), through the Caravan pass,
  under the south rim and in the east re-entrants; `Gravel Flats` mid-basin; `Playa Mud` (27-31) toward the washes and the
  dome; then gypsum, dunes (on the bench's lee edge, not on the pan) and salt (12.5% of the basin).
- **Palette:** a deliberate one, the beauty of a dying desert: bright white salt, red-ochre escarpment and rims, deep rust
  washes, cream terraces, near-black basalt, a muddy grey-olive Dead Spring, and the acid field as the most saturated thing
  on the map. Every pair of neighbouring Act I colours is at least ΔE 12 apart (CIE76); check the table after any recolour.
- **Present day (P28):** the green oasis strip is gone; a thin dun-green line of `Date Palms` follows the falls at the Slums,
  and three small dun-olive `Dryland Terraces` patches lie along the falls stream's valley on the plateau. The present day
  stays a dying desert; green belongs to the before map.
- **Before era:** the same rock, basalt, terraces, gypsum, dunes and salt as today (bedrock and evaporites predate the
  catastrophe), so the before Gaea export has a salt mask. Green only where the water is: the falls, Spring Brook, the Spring
  and its outflow; the floor keeps the natural climate's grassland. The hot-spring dome is a provisional draft (P24 open).

Settlements: `eras/now/40-settlements.json` founds the city with `add_burg` (its upper city and its Slums as two burgs: the
Slums at the foot of the falls and the upper city on its shelf directly above, about 7 km and a short switchback apart, P21)
and puts the Ruined Outpost down as a ruins marker with `add_marker`. Names and
populations are placeholders, tagged `[placeholder]` in each note. The burg notes carry P28 (the city's power is the only graded
caravan road and the last water; arid farming; food by caravan for salt) and P30 (fugitives only lay low; not branded). The
before era has no settlements until they are decided.

Routes: `eras/now/50-routes.json` draws only the traffic that the terrain and the story support: the main road into the
city (through the low Caravan Approach pass, across the terrace to the Slums, up the switchbacks beside the gorge onto the
upper-city shelf, every leg at or under about 10%) and on up the graded gorge and the falls valley onto the plateau, the act's
exit (P28); the salt track (its own dotted `salt-road` group) from the salt cuttings on the pan's west arm to the Slums; and
the old caravan road through the Ruined Outpost, in faded fragments that fade out before the washes. Routes do not join zone
to zone: zones are ARPG tilesets, and how the player travels between them is undecided. Each class is its own route group
from `define_style_group`; `add_burg` drops Azgaar's auto-linked trails, so every route is hand-drawn. `export_gaea` draws
`main-road`, `old-road`, `salt-road`, `roads` and `trails` into the roads mask.

Markers, labels and notes: `eras/now/60-markers-labels.json` names the landforms with `add_label` (Azgaar's "added" label
group, restyled and shown from zoom 3 to 40, since Azgaar hides it past 5.5 by default), places markers for the caravan escape
(zone 01), the active volcano (with its recorded departure from the rift axis, G4), the Acid Pits, the Dead Spring (on its
pools), the Plateau road exit, the salt cuttings and the sulfur workings, and hangs the region note (the 13 Nov spine, P28-P30,
what is exaggerated for play, locked anchors, the provisional 19-section scaffold and links to the story bible, ARPGStoryBible)
on the "Rift Basin" label. Every name is tagged `[placeholder]`; anything a note says beyond the vault and P28-P30 is tagged
`[provisional]`. `eras/before/60-markers-labels.json` puts a provisional note on the before era's hot-spring dome.

`eras/now/00-climate.json` applies the present-day drought with `set_climate`; the before era keeps the natural climate from `config.json`.

`base/00-continent.json` holds the continent as a custom Azgaar heightmap template. Template steps draw random positions from the seed,
so changing one step reshapes the whole continent: review the screenshots after every edit.
