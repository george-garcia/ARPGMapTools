# Map pass: Act I ground, colour and notes (rock that fades into the continent, a cone on the fault wall, the city's road and trade)

**Date:** 2026-11-13 · **Era(s):** both (paint, routes, markers, notes; no terrain change) · **Frame:** act1 · **Branch:** `map-pass-ground-colour`
**Asked by:** George's decisions of 13 Nov 2026 (P28 as amended, P29, P30), his directions during the pass (19:55 zones are reached
through the zone graph, so the land walls nothing off; 19:57 and 19:58 beauty first, every colour deliberate), and the geography
review's ground-and-colour findings (C1, E1, E2, G-b, G-c, G-d, K-b to K-f, P-a, W2) under standing autonomy (P7).

Heights are Azgaar units (land 20–100; metres = (h − 18)²). Points are `act1` frame-local (x west → east, y north → south;
1 x unit = 100 km, 1 y unit = 64 km). ΔE is CIE76 (the review's measure); chroma is C\*ab.

## 1. What changed and why

**The rim rock follows the crests and fades into the continent (C1, P17).** Before, the escarpment and rim paint stopped on
the polygons' straight edges, so a brown frame showed round the act at continent scale (`before/now-continent-act1-crop.png`).
The rock paint is now generated from the rift floor's distance field: every cell at 44 or more within a reach of the floor
(7.5 ± 4.5 km on the east and south, 10 ± 3.5 km on the west wall, 14 ± 4 km over the north block, the ± from smooth noise), so
the outline sits a varying distance behind the crest; two outer rings 4 and 8 km further out keep only the higher ground (47+
and 50+ for the rims, 58+ and 60+ on the plateau), so the rock thins into the continent as outcrops. The outermost painted
rock now spreads 3.8 km on the east (was 1.5), 3.1 km on the south (was 1.1), 10.2 km on the west (7.3) and 3.8 km on the north
(2.5). `Rift Escarpment` is the master fault (the west wall, the Caravan pass's north-west face, the whole raised north block);
`Rim Hills` is the east horst, the south rim and the pass's south-east face.

**The north is one fault wall and the volcano is a cone on it (C1, P29).** The raised north block is painted escarpment rock
to the range behind it; `Old Basalt` now stops at 43, so the wall's face above the basalt field is rock, not lava. `Recent
Basalt` covers only the cone (58 and up inside its foot) and its flows down the south side, so the cone stands near-black on
red rock and reads as a cone in the terrain viewer (`after/now-act1-3d-low.png`). Paint was enough: **no terrain changed**
(0 of 44,639 cells differ from pass 1's build, and between the eras), so pass 1's lowest-ground, drainage and climb results
stand and were re-run only to confirm.

**The floor runs coarse to fine and stops being one gravel sheet (G-b, G-c, G16).** `Boulder Fans` lie at the escarpment's
foot (the Slums terrace, 36–43), through the Caravan pass's defile (it was unpainted desert), under the south rim and in the
east horst's re-entrants; `Gravel Flats` keeps the mid-basin (196 basin cells, was 311); `Playa Mud` (27–31) lies between the
gravel and the evaporites, west of the washes and round the dome's west and south foot. The gypsum dunes moved off the pan
floor onto the lee (east-north-east) edge of the gypsum bench (heights 22–27), so the pan-level cells under the old dune
polygon are salt again: **Salt Flats 99 of 795 basin cells, 12.5 %** (pass 1: 92, 11.6 %).

**Colour: the beauty of a dying desert (K-b, K-c, K-d; George 19:57, 19:58).** One deliberate palette, each colour chosen for
a story or a look:

| Biome | Colour | Why |
|---|---|---|
| Salt Flats | `#F6F3EC` | Bright white salt, the act's widest light field and its praised anchor. *Beauty over realism:* real Dallol crust is often grey-brown or stained; white makes the salt read and frames the acid field |
| Rift Escarpment | `#A4532F` | Rich red-ochre fault rock: the wall that holds the city and the north block (was a duller `#8A4A2E`) |
| Rim Hills | `#B98552` | Warm ochre basement rock, a step lighter and yellower than the escarpment so the two rock families separate (ΔE 22) |
| Mineral Washes | `#8C2F1E` | Deep iron rust: grit by intent, the oxidised runoff (K-b). ΔE 30+ from the acid ground and lower chroma, so the acid field stays loudest |
| Fossil Terraces | `#F3E8C8` | Cream reef limestone (K-c), lighter than gravel and gypsum; heights now 27+, so the belt reads as one terrace (40 cells, was 25) |
| Gypsum Pavement / Dunes | `#C4CAC6` / `#E9C77F` | Cool grey pavement and golden dunes. *Beauty over realism:* gypsum dunes are near-white; gold separates them from the salt (ΔE 39) |
| Old / Recent Basalt | `#4A403A` / `#222425` | Near-black young lava, warm dark brown old flows |
| Boulder Fans / Gravel / Playa Mud | `#C9A07A` / `#D5BB88` / `#D4C5B3` | A clean value ramp down the floor, coarse and warm to fine and pale, ending in the white pan (ΔE 12–19 between steps) |
| Dead Spring | `#9C9883` | Muddy, salt-stained grey-olive: deliberately the dreariest ground in the act, the failed oasis (grit by intent) |
| Date Palms / Dryland Terraces | `#7F8A45` / `#A9A061` | Clean dun-green and dun-olive: living but arid (P28), never oasis green |
| Mineral pool (lake style) | `#5E9A9E` | Dull blue-grey teal: saline, not acid (K-d); ΔE 27 from the acid-teal pool (was 10.7). Same in both eras |
| Acid Pits, Sulfur Crust, acid pools | unchanged | The jewel-like signature: the four most saturated colours on the map (chroma 78, 78, 77, 64.5) |

**The city, its road and its trade (P28).** The main road's climb from the Slums (P-a) is re-laid as switchbacks beside the
falls gorge: no leg steeper than 9.6 % (it had an 18 % leg; the review's proposed points gave 24 % on the new ground, so new
ones were measured). The main road goes on from the upper city up the graded gorge and the falls stream's valley onto the
plateau (`now.road.main.plateau`, 34 km, legs ≤ 6.4 %), with a `[placeholder] Plateau road` marker and label where it gains the
plateau: the act's exit. A dotted `salt-road` track (its own route group) runs 46 km from `[placeholder] Salt cuttings` on the
pan's west arm to the Slums (legs ≤ 3.5 %); `[placeholder] Sulfur workings` sit on the sulfur crust at the acid field's west
edge. The green `Spring Oasis` strip of the present day is gone: a thin dun-green `Date Palms` line follows the falls at the
Slums, and three small dun-olive `Dryland Terraces` patches (6, 5 and 7 cells, habitability 8) lie along the falls stream's
valley on the plateau, at the gorge head, mid-valley and toward the stream's head. The present day stays a dying desert.

**Before era (E1, E2).** The before era now paints the same rock, basalt, terraces, gypsum, dunes and salt as today: of the
865 present-day rock and evaporite cells, 6 differ in the before era (escarpment cells in the falls gorge, green there because
the falls run through them), where pass 1's build had 406 of 527. Green stays where the water is: the falls, a new ribbon
along Spring Brook, the Spring, and a ribbon along its outflow that stops at the salt. The natural climate's forest patches on
dry floor (below the north wall, in the pass) are taken back to grassland (1 forest cell left in the frame, beside the falls).
The before Gaea export now has a salt mask. The hot-spring dome's paint and a new before-era marker are tagged
`[provisional, P24 open]` (E2).

**Notes (K-e, K-f, E2, W2, P28–P30).** The region note is rewritten round the 13 Nov spine and P28–P30, in George's 19:55
wording: "the city holds the only graded caravan road onto the plateau and the last reliable water"; arid farming; food by
caravan paid in salt and sulfur; fugitives only lay low and are not branded; the basin is drying; "pools, lava lake and Dead
Spring are exaggerated for play". The upper-city note carries P28 and the falls' source as provisional (a spring line on the
master fault, W2); the Slums note carries P30. Every marker note is tagged `[placeholder]`; the volcano note records its G4
departure (off the rift axis because the vault's layout puts it at the north-east). The Dead Spring marker moved onto its
pools ((0.40, 0.825), between the main and lower pool). Anything beyond the vault and P28–P30 is tagged `[provisional]`: the
city's walls and citadel, the Slums' wells and cisterns, the falls' source, "not the source of the acid pits", the dome.

**Left as they were:** the plateau's unpainted cold desert (G-d) apart from the fields; the east horst (George 19:55); every
lake, river and wash; all terrain.

## 2. Ops

| Op id | File | Tool | What it does |
|---|---|---|---|
| `now.biome.fans.*` (west, pass, south, east, east-2) | `world/eras/now/30-biomes.json` | paint_biome | `Boulder Fans` at the scarp feet and through the pass (G-b) |
| `now.biome.mud` | same | paint_biome | `Playa Mud`, heights 27–31 (G-b) |
| `<era>.biome.rim-hills[.fade-1/.fade-2]`, `<era>.biome.escarpment[.fade-1/.fade-2]` | `world/eras/{now,before}/30-biomes.json` | paint_biome | Crest-following rock with two thinning outer rings (C1, E1); replace the old rectangle-edged polygons |
| `<era>.biome.basalt.old`, `.recent`, `.cone` | same | paint_biome | Old basalt up to 43; flows; the cone at 58+ (C1) |
| `now.biome.washes` | `world/eras/now/30-biomes.json` | paint_biome | Colour `#8C2F1E` (K-b) |
| `<era>.biome.terraces` | both | paint_biome | Heights 27+, `#F3E8C8` (K-c) |
| `<era>.biome.salt`, `.gypsum`, `.dunes` | both | paint_biome | Evaporites in both eras (E1); dunes onto the bench's lee edge (G-c) |
| `now.biome.dead-spring` | now | paint_biome | Muddy salt-stained grey-olive |
| `now.biome.date-palms`, `now.biome.dryland-terraces.1`–`.3` | now | paint_biome | P28 arid farming; replace `now.biome.oasis` |
| `before.biome.floor`, `.oasis.brook`, `.oasis.outflow`, `.travertine` | `world/eras/before/30-biomes.json` | paint_biome | Forest only by water; ribbons along the streams; the dome tagged provisional (E1, E2) |
| `act1.style.mineral`, `act1.river.falls` (note) | `world/eras/common/10-water.json` | define_style_group, add_river | Duller mineral teal (K-d); the falls note (W2, P28) |
| `now.burg.upper-camp`, `now.burg.slums` (notes) | `world/eras/now/40-settlements.json` | add_burg | P28, P30, W2; provisional tags |
| `now.road.main.ascent` | `world/eras/now/50-routes.json` | add_route | Switchbacks beside the gorge, legs ≤ 9.6 % (P-a) |
| `now.road.main.plateau` | same | add_route | Main road onto the plateau (P28) |
| `now.style.salt-road`, `now.road.salt` | same | define_style_group, add_route | The dotted salt track (P28) |
| `now.label.region`, `now.marker.*` (notes), `now.label.escarpment` (moved) | `world/eras/now/60-markers-labels.json` | add_label, add_marker | Region note, tags, G4 note, Dead Spring on its pools (K-e, K-f) |
| `now.marker.plateau-road`, `now.label.plateau-road`, `now.marker.salt-cuttings`, `now.marker.sulfur-workings` | same | add_marker, add_label | The exit and the workings (P28) |
| `before.marker.hot-springs` | `world/eras/before/60-markers-labels.json` (new) | add_marker | Provisional note on the dome (E2) |

Tool change: `export_gaea` draws the new `salt-road` group into the roads mask (`tools/azgaar-mcp/src/session.ts`, one name);
no biome or group name the export reads was renamed (M9). `npm run smoke`: all checks passed, 23 tools registered.

Drawing order kept (P10): all changes are era paint, routes and notes after the eras' water; nothing touches `base/`.

**How the paint was designed.** `scripts/` holds the generator, kept as a record: `stage.mjs` replays every op before the
paint and dumps each cell's climate biome; `paintsim.py` replays `paint_biome` exactly as the tool does (cell centre in the
polygon, land, within heights; it reproduced pass 1's counts exactly before use); `rim.py` builds the crest-following
polygons (`rim_polys.json`); `gen_biomes.py` writes both eras' `30-biomes.json`; `dE.py` and `edges.py` are the colour and edge
checks. After a change to the rims, regenerate the rock polygons rather than nudging vertices.

## 3. Evidence

`before` is pass 1's build: its images are in `docs/passes/2026-11-13-terrain-water/after/`. `after/` here is this build
(resized to 1,280 px, colour-quantized).

| View | Before | After |
|---|---|---|
| Continent round the act, biomes (C1) | `before/now-continent-act1-crop.png` | `after/now-continent-act1-crop.png` |
| 2D biomes, frame (now) | `../2026-11-13-terrain-water/after/now-act1-biomes.png` | `after/now-act1-biomes.png` |
| 3D overview / low (terrain viewer, now) | `../2026-11-13-terrain-water/after/now-act1-3d-overview.png`, `now-act1-3d-low.png` | `after/now-act1-3d-overview.png`, `after/now-act1-3d-low.png` |
| Before era: 2D biomes / 3D overview | `../2026-11-13-terrain-water/after/before-act1-biomes.png`, `before-act1-3d-overview.png` | `after/before-act1-biomes.png`, `after/before-act1-3d-overview.png`; `after/before-continent-act1-crop.png` |
| Continent, Azgaar 3D | `../2026-11-13-terrain-water/after/now-3d.png` | `after/now-3d.png` |

Compared with `world/reference/act1-overview.jpg`: red-ochre walls round the west and north, black basalt and a smoking cone
in the north-east, cream terraces stepping to white salt in the east, the acid field the brightest thing in the south, rust
washes mid-basin. The reference's walls are redder and more continuous on the south side than ours (ours are ochre `Rim
Hills` by the geology: older basement, not the fault's red beds).

**Checks run** (`references/review.md` §2) on the built `.map` files:

1. **Builds:** `npm run world` 178 ops ok, `npm run world before` 135 ops ok; no failed op, no `pageErrors`. Heights identical
   between eras and to pass 1's build (0 of 44,639 cells).
2. **Lakes:** 13 in the frame in each era as intended (brine west and east, acid or hot-spring a–i, the mineral pool, the Dead
   Spring or the Spring and their lower pools), every one with its subtype, group and `[placeholder]` name.
3. **Lowest ground:** lowest land h21 (73 cells, all pan), none below; the brine pools are the lowest water (20.9), every other
   surface ≥ 21.9. Unchanged from pass 1.
4. **Drainage:** falls stream 57 → 38, no uphill step; washes 28 → pool, 26 → 25, 26 → 21; before era Spring Brook 38 → the
   Spring, outlet → lower pool, outflow 28 → 21 on the pan. Unchanged.
5. **The climb** (`paths.py`, grade-limited search; re-run, identical to pass 1 because the terrain is unchanged): the city's
   gorge is the one graded caravan road onto the plateau: 12.8 km from the Slums at ≤ 13 %, 14.8 km at ≤ 10 %; avoiding the
   city, the nearest graded way is 106 km outside the rift through the Caravan pass. At 20 % (a rugged foot route, not a
   caravan road) the escarpment south of the Slums can be climbed in 22 km, which George's 19:55 direction allows.
6. **Routes:** main approach ≤ 3.2 %; the climb ≤ 9.6 %; the plateau road ≤ 6.4 %; the salt track ≤ 3.5 % (heights of the cell
   under each point).
7. **Colour:** 74 neighbouring pairs in the frame; the closest are Boulder Fans–Gravel 12.1, Cold desert–Gravel 12.5, Cold
   desert–Dryland Terraces 12.8, Sulfur Crust–acid-sulfur pool 13.3, Terraces–Mud and Terraces–Salt 13.8, Fans–Rim Hills 13.9;
   every other pair is above 14 (pass 1: washes–acid 8.1 and terraces–gravel 10.7 were the worst). Chroma: acid pool 78.2,
   acid-sulfur pool 78.0, Sulfur Crust 76.7, Acid Pits 64.5, then washes 49.9 and escarpment 47.0: the acid field holds the
   four most saturated colours.
8. **Shares:** Salt Flats 12.5 % of the basin polygon (≥ 12 %); acid complex 113 cells; Boulder Fans 59, Playa Mud 42, Gravel 196.
9. **Era geology:** 6 of 865 present-day rock and evaporite cells differ in the before era (all escarpment under the falls'
   green), against 406 of 527 in pass 1's build.
10. **Zone graph** (`zone_graph.mjs` on a copy of the review's `act1.json`): exit 0, no problems. Only the exit anchor moved,
    from (0.305, 0.20), which had no road, to (0.13, 0.19), where the new road gains the plateau: the upper city → exit bearing
    is now 301.8° WNW (was 9.2° N), 93° from the Slums link, so H7 passes for the upper city. Every other bearing is unchanged.
11. **Gaea pre-flight:** now 4 passed, 0 failed (the same 10 lake-flatness warnings as pass 1; one stale `spring-oasis` mask
    from the old export deleted); before 4 passed, 0 failed, and **the pan checks now run** (flat salt core 20,874 px, no land
    outside the pan below it). Empty before-era masks: acid lakes and roads (none in that era, as intended). Terrain Height is
    unchanged (6,158 m), since `heightMetres` did not change. The roads mask carries the salt track and the plateau road.
12. **`npm run smoke`:** all checks passed (one tool changed).

Dev reads: lake surfaces, river cells, route heights and climate came from the review's read-only dump client (four logged
read-only `run_js` reads per era, TG1, TG2, TG8), as in pass 1.

## 4. Rules applied

| Rule | How this pass meets it |
|---|---|
| A region is never a rectangle; it blends into the continent (G1–G3, P17) | Rock paint follows the crest at a varying reach and thins out; edge spread 3–10 km on every side |
| Coarse to fine downslope (G16, G17) | Fans → gravel → mud → gypsum → salt; fans in the re-entrants and the pass |
| Dunes downwind of the playa, not on it (G19) | Dunes on the gypsum bench's lee edge; the pan stays salt |
| Green needs a named water source (G25) | Date palms on the falls; fields on the stream's valley; before-era green only on the streams and the Spring |
| One terrain, shared geology (K30, P14) | 0 height differences; 6 of 865 rock and salt cells differ, all under the falls |
| Pack routes under ~13 % (G28) | Climb ≤ 9.6 %, plateau road ≤ 6.4 %, salt track ≤ 3.5 % |
| Colours separate; the signature pops (K11, K16, P20) | Every neighbouring pair ≥ ΔE 12.1; the acid field has the four highest chromas |
| Landmark forms read (G4, G34) | Cone painted apart from the block; the G4 departure noted |
| Extraction needs its route out (G33) | Salt track to the Slums and the escarpment road |
| Placeholders tagged; exaggerations labelled (P12, G36) | Every new name `[placeholder]`; the region note lists the exaggerations |
| Never settle canon through geography (P7) | Dome, falls source, walls, wells and "not the acid source" tagged `[provisional]` |

## 5. Open and next

**Decisions for George**

- **The palette.** The colours above are chosen for beauty and story (white salt, red-ochre walls, golden dunes, a dreary Dead
  Spring). Two are knowingly unreal: white salt and golden gypsum dunes. Keep, or pull either toward its real colour?
- **The south walls.** The reference paints the south rim red like the escarpment; the map paints it ochre as older basement
  (by the geology of a lopsided rift). Red on the south would read more like the reference and frame the acid field; say if
  you want it.
- **Where the fields sit.** P28 puts the terraces "at the stream head on the plateau". They are drawn as three small patches
  along the stream's plateau valley, nearest 8 km from the city and farthest about 40 km up toward the source. Closer to the
  city only, or at the source only?
- **The before era's look.** Its floor is the natural climate's pale grassland with olive-green ribbons; P14 asks for a lush,
  beautiful before map. A dedicated before-era palette (richer greens by the water, the old lake's shores once P24 is settled)
  would be its own pass.
- **Still open from earlier:** the old salt lake's extent (P24), what feeds the falls (W2: drawn as a provisional spring line),
  who buys the salt beyond the plateau (P28), the Ruined Outpost's water (P-c).

**Follow-ups**

- The skill's `references/azgaar-ops.md` (M9) lists the route groups `export_gaea` reads; it should now include `salt-road`
  (left for the skill's owner, not edited here).
- Zone graph: the handoff should take the exit anchor at (0.13, 0.19) on the plateau road.
- Gaea: the new biome masks (`boulder-fans`, `playa-mud`, `date-palms`, `dryland-terraces`) can drive recipes; the project
  itself reads only the colour map and the two graph masks, so nothing in it breaks. George, reopen it to pick up the new colours.
- `export_gaea` leaves masks of biomes no longer in the tile on disk; it should clear them (the pre-flight flags them).
