# Geography review: Act I (Rift Basin), present day, with the before era where it matters

**Date:** 2026-11-13 · **Map at:** ARPGMapTools `d9872f9` (ops). Builds read: `world/build/now.map` (2026-11-06 01:17)
and `world/build/before.map` (2026-11-06 00:15), opened read-only through the azgaar MCP server (`open_map`,
`get_map_info`, `query_cells` over 9,990 cells around the frame, `list`), plus the last build's 2D, 3D and Gaea views.
**Eras reviewed:** now, and before for water, ground and settlements · **Vault read at:** test copy of 2026-11-13
(README "Map decisions" 2026-11-03, "Act I present-day map" 2026-11-05, "Map direction" 2026-11-06, Act I spine
2026-11-13, Geological Blueprint) · **Scope:** the whole region against `references/review.md` §1.

Heights are Azgaar units (land 20–100); metres are (h − 18)² (M1). Coordinates are `act1` frame-local (x west to east,
y north to south; 1 x unit = 100 km, 1 y unit = 64 km). All query scripts and their raw output are in
`out-a/work/` (`dump.mjs`, `an.py`, `now.json`, `before.json`).

## Verdict

The region's big form holds: a closed basin (its lowest exit is the south-west pass at h 38, above a floor of 30–35 and
a pan of 21), a high west/north-west escarpment (1,600–1,760 m) against a lower east horst (800–960 m), the pan pushed
east by the big western fans as in the real Danakil, the city on a bench with its Slums on the fan below, both eras on
one identical terrain, and an acid field that dominates the frame. But the water, the thing the city exists for, does
not work: **the falls stream that feeds the upper city and the Slums runs uphill across the plateau and over the
escarpment lip** (it climbs 1,225 → 1,849 m before it falls), the mineral washes climb over the mid-basin, and two
pools sit at or below the pan, against the approved lowest-ground fix. The before era paints the salt pan as grassland
and forest, which the locked geology forbids. **The single most important fix is a graded valley for the falls stream
through the plateau and the lip** (finding 1): one terrain op group that also gives the act's exit road a physical
reason (see `2_change_request.md`).

For the studio the map is usable today for bearings and landform order, but the west half of the basin is one gravel
field (four zones share it), the south and east margins are still ruler-straight, and the before era has almost no
facts yet (no settlements, routes or designed water), so most before → now lines in the handoff are OPEN.

## Findings, most important first

| # | Severity | Finding | Rule (id) | Evidence on the map | Fix (ops) | Who decides |
|---|---|---|---|---|---|---|
| 1 | BLOCKING | **The falls stream runs uphill.** `act1.river.falls` (locked `add_river`) crosses the plateau's roughened relief and the raised escarpment lip: its line rises 1,225 → 1,521 m, 1,296 → 1,521 m and 1,521 → **1,849 m** (h 53 → 61) before it drops into the slot. The plateau has no valley leading to the falls, so the falls has no catchment either. This is the upper city's and the Slums' only named water (burg notes). | G7, G13, K1; G31 (towns on water) | Profile along the op's polyline (`query_cells`): 58, 56, 57, 60, 55, 58, 57, **53**, 57 / 57, 58, 59, 57, 57, 58, 59, 55, **54**, 57 / 57, 59, 59, 60, **61**, 60, 60 / 60, 58, 57, 59 / 59, 59, 56 → 46 at the slot. | `base/10-act1-terrain.json`, after `act1.roughen.shoulders`, before `act1.basin`: four `sculpt set` corridors ~3.6 km wide along the stream, stepping 57 → 56 → 55 → 54 downstream (feather 2 km, edge noise 1): `act1.falls-valley.1`…`.4` (JSON in the appendix). The lip is cut ~500 m deep where the stream leaves the plateau: the notch a falls cuts back into a scarp (G13). The river op stays as it is. Re-check: profile monotonic, `finalize_terrain` builds no lake in the valley. | P7 (fix now) |
| 2 | BLOCKING | **Before era: the salt pan, gypsum and escarpment rock are grassland and forest.** The 88 cells that are Salt Flats, Gypsum Pavement or Dunes today are 74 Grassland and **14 Temperate deciduous forest** in the before build; the escarpment, rim and fan cells are 595 Grassland. Thick evaporites and the rift's rock predate the catastrophe. | Vault LOCKED 2026-11-02 #5 ("do not magically create … thick evaporite sequences in only a few centuries"); G18, G25; K30 | `query_cells` biome per cell, same cell ids in both builds (heights identical: 0 of 9,990 cells differ). Screenshot `before-act1-biomes.png`. | `eras/before/30-biomes.json`: add `before.biome.escarpment`, `before.biome.rim-hills` (copies of the now ops: same names, colours, polygons, heights [44,100]); `before.biome.salt` (`Salt Flats`, pan polygon, heights [20,23]), `before.biome.gypsum`. Keep the floor's grassland (the "lush" direction, P14) but only where the climate and water carry it; no forest on the pan. How wet the pan was (lake, marsh or playa) is finding 7's question. | P7 for rock and evaporite; George for the pan's water |
| 3 | BLOCKING | **Two places sit at or below the pan.** (a) One land cell at **h 20** beside acid pool f at (0.912, 0.744), below the pan's 21; that pool's lowest shore is 20, so its surface (~19.9) is below the brine pools' (~20.9). (b) The Dead Spring hollow reaches **h 21**, pan level, 30 km west of the pan: the main pool's lowest shore is 21, so its surface ties the brine pools'. | P19 (approved fix 2026-11-06), G10 | `query_cells`: min land in the frame = 20 (one cell, Acid Pits); lake shores: brine 75 → 21, acid f (86) → 20, Dead Spring (84) → 21 at (0.356, 0.77) and (0.356, 0.798). Surfaces from the shore rule (lowest shore − 0.1; TG1). | (a) `act1.water.acid.f`: centre (0.895, 0.77) → (0.880, 0.772), radii × 0.85, edge noise 0.8 → 0.5. (b) Replace `act1.dead-spring` (`lower 3`) with `sculpt set 29`, feather 3, on the same circle, so the pools' shores sit at 27–29; add `act1.spring-outflow` (finding 7). Re-check: no land < 21 in the frame; every lake's lowest shore ≥ 21 and only the pan's pools at 21. | P7 |
| 4 | BLOCKING | **The mineral washes run uphill.** `act1.wash.main` leaves the carved wash channel (h 26) and climbs onto the mid-basin, 64 → 225 m over 4.7 km between (0.535, 0.45) and (0.55, 0.52), before dropping to the teal pool; `act1.wash.braid` climbs 64 → 144 m; `act1.wash.terraces` crosses the north terrace bench (h 30). They are dashed routes, but they read as drainage. | G7, K1, K2 | Grades along each op's points (`query_cells`); the `act1.washes` channel polygon covers only the northern limb and the terrace branch. | `base/`: `act1.washes.south`, `sculpt set 25` along the main wash's southern limb from (0.535, 0.45) to the pool's shore (two corridors 2.4 km wide, feather 1, edge noise 0.6; appendix). `eras/common/10-water.json`: move `act1.wash.braid` inside the channel, and `act1.wash.terraces`' second and third points to (0.60, 0.47), (0.67, 0.49) in the bench gap. | P7 |
| 5 | MAJOR | **The south and east margins are still a rectangle.** The east margin stays at x 0.935–0.985 for 40 km (std 1.4 km, under one cell); the south margin at y 0.905–0.955 for 70 km (std 0.85 km); both rims crest at a uniform 47–51. The 3D views show two straight walls. | G3, G1; P17, vault "Map direction" 2026-11-06 ("not a rectangle") | Edge scan: first cell ≥ 42 from inside the basin, per row and column. `now-act1-3d-overview.png`, `-low.png`. | `base/`: replace `act1.rim.south` with two en-echelon segments: the west one keeps today's line (inner face y ≈ 0.90, x 0.12–0.45, crest ~50), the east one steps back ~4 km (inner face y ≈ 0.96, x 0.40–0.95, crest ~45), overlapping at x 0.40–0.48 with a relay low at h ~40 between them; replace `act1.rim.east` with an inner face that has two re-entrants (y ≈ 0.3 and 0.62, 5–8 km deep, where finding 6's fans go) and one spur; vary crest values 44–55 per segment; move `act1.basin`'s south and east vertices to follow. Keep clear: the acid dome (south edge y 0.88), the brine pools, the Dead Spring's lower pool (y 0.865) and the new outflow channel (finding 7). | P7 (outer edge "not set in stone", 2026-11-06) |
| 6 | MAJOR | **Salt at the foot of the east horst.** Along 40 km the pan (h 21) meets the horst (h 42–47) in one cell: no fans or gravel apron between them. | G16, G17 | Transect y = 0.6: 21 at x 0.92, **42** at 0.94, 47 at 0.96. | `base/`: `act1.east-fans.1`…`.3`, small `sculpt set 24–27` fans (6–8 km wide, feather 3) at the re-entrants from finding 5; era `30-biomes`: paint them `Gravel Flats` (heights [22,30]) after the salt paint. | P7 |
| 7 | MAJOR | **Before era: the water ends on the acid dome, not the pan.** Generated rivers (falls → Slums → the Spring → east; down the washes; off the basalt) end in the dome's eight freshwater "hot spring" lakes, which sit above the pan; the pan holds only the same two small brine pools as today. A wetter era should show it in the terminal lake. The Spring's own lowest shore is on its west side (h 21), so it has no designed outlet. | G8–G10, G14, G26, M7 | Before lake list: all dome lakes `freshwater`; pan unchanged. Screenshot `before-act1-biomes.png`. TG2: the river ends can't be listed, only seen. | P7 part: `base/` `act1.spring-outflow` (graded dry channel 29 → 23 east from the Spring to the pan's south-west arm at (0.645, 0.875)); `eras/before/05-rivers.json`: `remove_rivers` in `act1`; `add_river` the designed course (Slums → Spring; Spring outflow → pan). In the present day the channel is an abandoned wash (K32). George: the old lake's extent (P24), options in "For George" 1. | P7 drainage; George lake extent |
| 8 | MAJOR | **One gravel field covers the west half of the basin.** Gravel Flats is the act's largest ground (356 of 1,350 frame cells, 26%): the Slums terrace, the Ruined Outpost, the Dead Spring's surroundings and the floor between them are one tan. The caravan pass is unpainted (46 `Hot desert` cells). There is no fan → gravel → mud order on the west side. | K16, K6, G16; vault 2026-11-02 ("overused repetitive ochre gravel") | `query_cells` biome counts; `now-act1-biomes.png`. | `eras/now/30-biomes.json`, after `now.biome.basin-ground`: `now.biome.fans` (`Boulder Fans`, darker, along the escarpment foot and the pass mouth, heights [35,43]); `now.biome.mud` (`Playa Mud`, heights [28,31], west of the washes and the dome); `now.biome.pass` (`Pass Gravel` over the pass corridor). New names add Gaea masks without touching the hard-coded ones (M9). | P7 |
| 9 | MAJOR | **The easiest ways to the highlands bypass the city.** The north rim between the plateau's east edge and the volcano is the low point of the north wall (h 43–47, 625–840 m), 400–500 m above the floor at about 3% and rising beyond to the northern highland (h 57–60). Outside the south-west pass, the plateau's south-west flank rises from the lowland (h 30–38) at about 9%. Not a geography error: it matters because the vault leaves open why the city controls onward passage (P22) and the narrative now asks for "the only way out". | P22; K9, G28–G30 | Grids north and south-west of the frame (`query_cells`), least-climb routes. | None until George answers ("For George" 2, and `2_change_request.md`). | George |
| 10 | MAJOR | **The Fossil Terraces read as speckle.** Only 28 ivory cells, scattered through tan: the terrace belt (h 27) keeps the gravel paint because `now.biome.terraces` starts at 28. | K6, K16 | `now-act1-biomes.png`; `query_cells`. | `now.biome.terraces` and `before.biome.terraces`: `heights` [28,100] → [27,100] (the wash gaps at 26 keep their colour). | P7 |
| 11 | MINOR | **The Slums → upper city climb is 18% on its steep leg** (441 → 1,024 m in 3.2 km); the whole step is ~580 m. | G28 (≤ ~13%), G35 | Grades along `now.road.main.ascent`. | Add one more zig to `now.road.main.ascent` (points (0.255, 0.445), (0.29, 0.43), (0.268, 0.415), (0.30, 0.402), (0.275, 0.392), (0.30, 0.375), (0.29, 0.345)) and say in its note that the switchbacks are zone-scale (≥ 4.5 km of road at ≤ 13%). | P7 |
| 12 | MINOR | **Acid pools a and d have merged** (one 19-cell lake): 7 acid lakes, not 8. Ten lakes carry random culture names ("Wetheidielkis", "Green"…). | azgaar-ops (touching pools merge), M11 | `list features`: 13 lakes in the frame; intended 14. | `act1.water.acid.d`: centre (0.715, 0.795) → (0.715, 0.84), radii × 0.87. Every `set_lakes` op gets a `name` ("[placeholder] Acid pool a"…). Re-check: 8 acid lakes. | P7 |
| 13 | MINOR | **Tall spires on the escarpment lip in 3D**: single cells at 63–64 left by the roughen noise and unpainted cells at 41–43 at the escarpment foot show as yellow-capped spikes. | K11, K6 | `now-act1-3d-low.png`; column scans (h 64 at (0.12, 0.23)). | `now.biome.escarpment` and `now.biome.rim-hills`: heights [44,100] → [41,100]; a `sculpt smooth` (value 1) over the lip after `act1.roughen.highlands`. | P7 |
| 14 | MINOR | **The pass floor is a flat trench**: h 38 for 30 km (the main road's first 50 km are at exactly 400 m), so the col has no position and the pass drains both ways nowhere. | G29 | Profile along `now.road.main.approach`. | `act1.caravan-pass`: split into a col (38) at the rim crest and two `set 36` limbs falling to the basin and the lowland. | P7 |
| 15 | MINOR | **Notes lag the vault.** The region note predates the 2026-11-13 spine (betrayal, upper-city finale, passage to Act II); no note states the exaggerations (pools, lava lake and Dead Spring 10–100× real size). | G36, G37; P1 | `now.label.region` note text. | Update `now.label.region`'s note: a pointer to the spine, and "pools, lava lake and Dead Spring are exaggerated for play (G36)". | P7 |
| 16 | MINOR | **The Ruined Outpost has no water in either era.** A former caravan waystation sits ~10 km from the before era's nearest stream. | G30, G31 | Marker (0.41, 0.51); before rivers (screenshot). | None on the map until George answers ("For George" 4). | George |

Tool notes (not map findings): `scripts/zone_graph.mjs` rounds before the modulo, so bearings print as
`40.60000000000002°` (fix: take the modulo first, then round); propose TG1 `profile` now, since four of the findings
above came from profiles assembled by hand from `query_cells`.

## What works (checked, no need to re-check)

- **One terrain, two eras:** heights and cell positions are identical in both builds (0 of 9,990 cells differ) (K30, P14).
- **The basin is closed:** the lowest way out is the south-west pass at h 38 (400 m); the floor is 30–35, the pan 21. The
  lowland outside the pass is 26–35, so the pass is a real col (G29, P17).
- **Lopsided rift:** west lip 1,600–1,760 m, east horst 800–960 m; the plateau stands above the land outside it (the
  lowland beyond the pass is 100–300 m) (G1, G2). The pan lies against the east horst, pushed there by the big western
  fans, as in the northern Danakil.
- **The pan is the lowest ground** everywhere else: all other land ≥ 21; the brine pools' shores are 21 (G10, P19 except
  finding 3).
- **The city matches P21:** the upper city is 7 km from the Slums and ~540 m above them, on a bench beside the falls slot;
  the Slums sit at the falls stream's end (G31). Approach road grades are ≤ 3% (G28).
- **Gypsum dunes lie downwind:** ENE of the pavement under the map's south-westerlies (G19).
- **The acid field dominates** in 2D and 3D: amber crust, sulfur crest, eight pools in four acid colours (P20); acid colours are judged in
  2D and the terrain viewer, not Azgaar's 3D (M8).
- **Routes show only traffic** (main road, faded old road), never zone-to-zone lines (P16); every name is tagged
  `[placeholder]` (P12).
- **Biomes with water:** the green strip follows the falls stream (G25).

## Made now under P7

Nothing: this was a review in test mode, and the map was not changed. The fixes marked P7 form two map passes, each
built for both eras with before/after 2D, 3D and Gaea evidence (review.md §2):

1. **Terrain and water** (findings 1, 3, 4, 5, 6, 7, 12, 14): all `base/` edits in one PR, since any terrain change
   replays everything after it (M5). Checks: lowest ground, lake count and names, river profile, wash grades, edge scan,
   zone graph re-run (anchors don't move).
2. **Ground and paint** (findings 2, 8, 10, 13, 15, and 11): era biome and route ops only.

## For George

1. **How wet was the basin before the catastrophe?** (P24, the old salt lake's extent.) Azgaar only makes a lake below
   h 20, and the pan is h 21 in both eras, so a large before-era lake needs a choice: (a) era-specific terrain that
   lowers the pan to 19 in the before era only: a real lake in Azgaar, but it breaks the one-terrain rule (P14);
   (b) keep one terrain and paint the before pan as a wet salt marsh with seasonal shallow water, stated in a note (G37):
   no rule broken, but it doesn't show as water; (c) a playa in both eras, with the before era's water in the Spring, the
   falls and the outflow only: the least lush. I'd suggest (b) now and (a) if the before map needs a lake to read.
2. **Does the city control the only way to the highlands?** On today's map it doesn't: the north rim by the volcano and
   the plateau's south-west flank outside the pass are easier climbs (finding 9). Options: (a) the city's ramp is the only
   route with water and a graded climb, and the alternatives are dry, longer and slaver country: no terrain change, but
   it is canon (the reason the city controls passage, open since 2026-11-03); (b) raise the north rim into a continuous
   wall and steepen the plateau's south-west flank, which makes the city's ramp the only practical climb physically:
   a large terrain change to the region's north and south-west edges; (c) leave it to law and patrols (canon, no map
   change). `2_change_request.md` gives the details.
3. **The camera-side escarpment.** The escarpment lies west of the Slums (h 58 against the hub's 41), the caravan pass (60)
   and the upper city; the south rim lies south of the Dead Spring (46 against 31). Should those zones bend the wall to
   read as a north wall (P8), cut or fade it (level design N9), or enter so the wall is behind the player?
4. **The Ruined Outpost's water.** If it was a caravan waystation, it had a well or cistern. May the map say so (a note on
   the marker, no new water), or is the outpost's former use still open?
5. **Unpainted highland.** The plateau and the outer slopes are Azgaar's "Cold desert" under its cool climate (M10). Keep it,
   or paint the plateau (for example a dry highland steppe) now that the act's exit road climbs onto it?

## Appendix: the terrain ops for findings 1, 3, 4 and 7

All in `world/base/10-act1-terrain.json` (in test mode not written there). Placement in the file is part of the op:
later sculpts overwrite earlier ones (M5), and the pits at the end of the file must stay last so they re-carve the pools.
Corridor polygons are 3.6 km (falls) or 2.4 km (washes, outflow) wide, drawn in km and converted (M3).

**After `act1.roughen.shoulders`** (so no later roughen breaks the valley), finding 1:

```json
{ "id": "act1.falls-valley.1", "tool": "sculpt", "note": "Falls stream valley, upper plateau: graded so the stream runs downhill to the falls (G7, G13)",
  "args": { "frame": "act1", "polygon": [[-0.274, -0.108], [-0.092, 0.038], [-0.076, -0.012], [-0.258, -0.158]], "op": "set", "value": 57, "feather_km": 2, "edge_noise_km": 1, "noise_km": 2, "seed": 250 } },
{ "id": "act1.falls-valley.2", "tool": "sculpt", "note": "Falls stream valley, mid plateau",
  "args": { "frame": "act1", "polygon": [[-0.124, 0.015], [0.059, 0.137], [0.074, 0.085], [-0.109, -0.037]], "op": "set", "value": 56, "feather_km": 2, "edge_noise_km": 1, "noise_km": 2, "seed": 251 } },
{ "id": "act1.falls-valley.3", "tool": "sculpt", "note": "Falls stream valley, cut through the escarpment's raised lip",
  "args": { "frame": "act1", "polygon": [[0.025, 0.111], [0.147, 0.218], [0.165, 0.169], [0.043, 0.062]], "op": "set", "value": 55, "feather_km": 2, "edge_noise_km": 1, "noise_km": 2, "seed": 252 } },
{ "id": "act1.falls-valley.4", "tool": "sculpt", "note": "Falls stream valley, the notch above the falls (the falls has cut back into the scarp, G13)",
  "args": { "frame": "act1", "polygon": [[0.115, 0.186], [0.204, 0.289], [0.225, 0.244], [0.136, 0.141]], "op": "set", "value": 54, "feather_km": 1.5, "edge_noise_km": 0.8, "noise_km": 2, "seed": 253 } }
```

**Replacing `act1.dead-spring`** (same place in the file), finding 3b:

```json
{ "id": "act1.dead-spring", "tool": "sculpt", "note": "Dead Spring hollow: a shallow fan-toe hollow well above the pan (P19, G10, G12)",
  "args": { "frame": "act1", "polygon": "<unchanged circle, centre (0.39, 0.76)>", "op": "set", "value": 29, "feather_km": 3 } }
```

**After `act1.washes`**, finding 4, and **after `act1.dead-spring`**, finding 7 (both before the pools):

```json
{ "id": "act1.washes.south.1", "tool": "sculpt", "note": "Main wash's southern limb, graded down to the teal pool (G7)",
  "args": { "frame": "act1", "polygon": [[0.519, 0.441], [0.569, 0.61], [0.591, 0.594], [0.541, 0.425]], "op": "set", "value": 26, "feather_km": 1, "edge_noise_km": 0.6, "noise_km": 2.5, "seed": 254 } },
{ "id": "act1.washes.south.2", "tool": "sculpt", "note": "Main wash's mouth at the teal pool",
  "args": { "frame": "act1", "polygon": [[0.558, 0.591], [0.616, 0.648], [0.629, 0.616], [0.571, 0.559]], "op": "set", "value": 25, "feather_km": 1, "edge_noise_km": 0.6, "noise_km": 2.5, "seed": 255 } },
{ "id": "act1.spring-outflow.1", "tool": "sculpt", "note": "The Spring's old outflow channel east to the pan: a river in the before era, an abandoned wash today (G8, K32)",
  "args": { "frame": "act1", "polygon": [[0.457, 0.867], [0.561, 0.88], [0.563, 0.843], [0.459, 0.83]], "op": "set", "value": 28, "feather_km": 1, "edge_noise_km": 0.6, "noise_km": 2.5, "seed": 256 } },
{ "id": "act1.spring-outflow.2", "tool": "sculpt", "note": "Outflow channel, middle",
  "args": { "frame": "act1", "polygon": [[0.537, 0.878], [0.611, 0.885], [0.613, 0.847], [0.539, 0.84]], "op": "set", "value": 26, "feather_km": 1, "edge_noise_km": 0.6, "noise_km": 2.5, "seed": 257 } },
{ "id": "act1.spring-outflow.3", "tool": "sculpt", "note": "Outflow channel's mouth on the pan's south-west arm",
  "args": { "frame": "act1", "polygon": [[0.586, 0.881], [0.655, 0.896], [0.659, 0.859], [0.59, 0.844]], "op": "set", "value": 24, "feather_km": 1, "edge_noise_km": 0.6, "noise_km": 2.5, "seed": 258 } }
```

**Pools edited in place**, findings 3a and 12 (seeds, values and feathers unchanged except edge noise on f):
`act1.water.acid.f` polygon → centre (0.880, 0.772), radii 0.0204 × 0.0262, `edge_noise_km` 0.5;
`act1.water.acid.d` polygon → centre (0.715, 0.840), radii 0.0261 × 0.0295. Their `set_lakes` boxes follow:
`now.lakes.acid.d` and `before.lakes.spring.d` → [[0.695, 0.81], [0.735, 0.81], [0.735, 0.87], [0.695, 0.87]];
`now.lakes.acid.f` and `before.lakes.spring.f` → [[0.855, 0.745], [0.905, 0.745], [0.905, 0.80], [0.855, 0.80]].

**Before era**, finding 7: `eras/before/05-rivers.json` → `before.act1.rivers.clear` (`remove_rivers`, frame `act1`);
`eras/before/20-water.json` → `before.river.slums-spring` (`add_river`, [[0.25, 0.445], [0.27, 0.55], [0.31, 0.66],
[0.35, 0.74], [0.372, 0.775]], name "[placeholder] Spring Brook", ending in the Spring) and `before.river.spring-outflow`
(`add_river`, [[0.487, 0.852], [0.55, 0.86], [0.60, 0.866], [0.645, 0.875]], ending on the pan; its note says it spreads
onto the playa until the lake question is answered, the G8 exception).
