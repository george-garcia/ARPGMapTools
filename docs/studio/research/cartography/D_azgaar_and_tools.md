# D. Azgaar's mechanics and this repo's MCP tools

Track D of the `arpg-cartography` research. Read 13 Nov 2026. Azgaar is pinned at **v1.156.0** (commit `67d555b`,
`tools/azgaar/azgaar.lock.json`); its source is in `tools/azgaar/source`.

**How to read the citations.** Azgaar paths are relative to `tools/azgaar/source/src/`; repo paths are relative to the
repo root. Every SOURCE finding gives file:line. The OBSERVED findings here were **measured on our own Azgaar maps**
(`world/build/now.map` and `before.map`, built 6 Nov 2026 from the current ops). They were loaded headless through the
MCP server's own session class, read-only, with nothing written to the repo [S8]. In this file, "a real map" means our
Azgaar map, not a satellite image. INFERRED means it's our reasoning, and the reasoning is given.

---

## 0. The model in six facts (read this before any map change)

| # | Fact | Tag | Source |
|---|---|---|---|
| 0.1 | **There are two graphs.** The `grid` holds about 100k jittered-lattice Voronoi cells. Heights live there (`grid.cells.h`, integers 0–100), and so do climate values (`grid.cells.temp`, `grid.cells.prec`). The `pack` is rebuilt from the grid on every finalize: it drops deep ocean and inner lake cells and splits coast and lake-shore cells in two. Lakes, rivers, biomes, burgs, routes and markers all live on the pack. `sculpt` writes the grid. The `.map` file saves the grid's heights, temperature and precipitation, and rebuilds the pack's heights from them on load. | SOURCE | [S1] model/graph/pack-generator.ts:30-50; services/io/save.ts:161-167; [S2] session.ts:212 |
| 0.2 | **Water is any cell below 20; land is 20 or more.** A connected patch of water that touches the map edge is ocean. Any other patch is a lake. Azgaar has no other notion of a lake. | SOURCE | [S1] model/physical/features-generator.ts:118, 138; utils/height-utils.ts:2-10 |
| 0.3 | **`finalize_terrain` runs Azgaar's "Erase" regeneration with erosion off.** It rebuilds features, climate, rivers and biomes, and then cultures, burgs, states and routes from scratch. It does **not** turn deep land depressions into lakes, because that step only runs with erosion on. | SOURCE | [S2] session.ts:287-304; [S1] model/generation-pipeline.ts:88-121 (lines 90-91) |
| 0.4 | **`set_climate` re-runs climate, rivers (keeping locked ones), biomes, lake groups and names. It keeps the terrain and every entity.** | SOURCE | [S2] session.ts:310-332 |
| 0.5 | **Styles are not data.** A lake's *group* only sets how it's drawn; its *subtype* (freshwater, salt, dry, sinkhole, frozen, lava) has meaning for generators and for Azgaar's 3D view. Style groups (in `styles`) survive every regeneration, but a lake's assignment to a group does not. | SOURCE | [S1] features-generator.ts:347-352, 412-418; [S6] wiki "Geographical Features Overview" |
| 0.6 | **The op order is the dependency order.** Ops replay as `base/*.json`, then `eras/common` and `eras/<era>` interleaved by file name (on a tie, `common` runs first). The first op must be `new_map`, op ids must be unique, and `run_js` is refused. | SOURCE | [S5] scripts/build-world.mjs:16-39; [S3] world/README.md |

### What each regeneration resets (the table everyone needs)

| Map content | `finalize_terrain` | `set_climate` | Source |
|---|---|---|---|
| Grid heights | Kept (it reads them) | Kept: the session puts back the heights that the river pass erodes | [S2] session.ts:320-324 |
| Coastlines, lake extent, lake features | Rebuilt from h < 20; lake **names and notes are lost** (new random culture names) | Kept (same features); names kept, because `defineNames` only fills in missing ones | [S1] features-generator.ts:433-439 |
| Lake subtype and group | Reset to the computed subtype, with group = subtype | **Reset the same way** | [S1] features-generator.ts:412-430 |
| Generated rivers | Regenerated | Regenerated across the **whole map**, including any that `remove_rivers` deleted | [S2] session.ts:321 |
| Locked rivers (`add_river`) | **Dropped**: the Erase pipeline passes no locked list, and `defineRivers` clears `pack.rivers` | Kept, and new rivers end where they reach them | [S1] generation-pipeline.ts:96; model/physical/river-generator.ts:214, 357, 450, 463-512 |
| Temperature and precipitation | Recomputed from the current options (a set_climate already applied stays in force) | Recomputed with the new values | [S1] generation-pipeline.ts:92-93 |
| Biomes | Every cell recomputed: the custom biome catalogue stays, the **painted cells are lost** | Same | [S1] model/physical/biomes-generator.ts:105-129 |
| Burgs | **All removed** | Kept | [S2] session.ts:292-297 |
| Routes (locked ones too) | **All removed**: `Routes.generate()` runs with no locked routes | Kept (`Routes.sync`) | [S1] generation-pipeline.ts:106; model/economy/routes-generator.ts:229-239 |
| Markers (locked ones too) | **All removed**, because config turns procedural markers off | Kept | [S2] session.ts:299; [S3] world/config.json `generation.markers: 0` |
| Added labels and their notes | Kept (not in the Erase pipeline) | Kept | [S1] generation-pipeline.ts:88-121; [S7] generation-pipeline.md:164-165 |
| Style groups (lakes, routes, labels) and label zoom ranges | Kept | Kept | [S2] session.ts:335-373 |

**Rule:** terrain and its `finalize_terrain` come before every water, biome, settlement, route, marker and lake-style
op. A climate change comes before `remove_rivers` and all styling and painting. Any terrain change made later means
replaying everything after it. **SOURCE**, from the table above.

---

## 1. How to do X correctly

Coordinates: with `frame: "act1"`, a point is frame-local 0–1 (x from west to east, y from north to south) and may go
outside 0–1. **Frame-local units are not square:** one x unit is 100 km and one y unit is 64 km, so a "circle" drawn
in frame units is an ellipse on the map. Draw shapes in km and convert them. SOURCE [S2] world.ts:79-81; [S3]
frames.json. `sculpt`'s `feather_km`, `noise_km` and `edge_noise_km` are converted at 0.5 km per map pixel. SOURCE
[S2] index.ts:108-118.

### 1a. Terrain and water

| Intent | Tools, arguments, order | Pitfalls | Check |
|---|---|---|---|
| **Raise an escarpment or plateau lip** | In `base/10-*.json`, work from the outside in: `sculpt op:"raise"` for the shoulders and plateau (value 7–16, feather 14 km, edge_noise 10, clamp [20, 50–60]), then `roughen` 4–5, then `sculpt op:"set"` for the lip (58, feather 5, edge_noise 4), then carve the basin against it with `set` 33, **feather ≤ 2.5 km on the escarpment side**. Finish with `finalize_terrain`. This is the repo's pattern (`act1.shoulders` … `act1.basin`). | The steepest slope Azgaar can show is a one-cell step of about 2.3 km [S1 grid-generator.ts:172-173; S8]. A feather below about half a cell (~1.1 km) does almost nothing, because few grid points fall inside it (INFERRED from the spacing). `raise` builds on the continent underneath, which changes whenever the template steps change [S3 world/README.md]. Heights are integers: 58 and 60 are 1,600 m and 1,764 m. | A `query_cells` strip across the face (min and max); `screenshot` with layers `["heightmap","rivers","lakes"]`; `screenshot_3d` frame with the `low` camera |
| **Carve a basin or rift trough** | `sculpt set` the floor at 31–34 (feather 2.5, edge_noise 3.5), then the features inside it, then `roughen` 2 with **`clamp: [28, 100]`** (or at least [21, 100]). | A land basin is **not a sink**: Azgaar fills depressions so that water can flow, and it leaves over the lowest rim cell [S1 river-generator.ts:540-598; S6 wiki Heightmap-customization:98]. Only a lake (h < 20) holds water. Roughen or lower near 20 without a clamp can punch through to water and create stray lakes. | `list kind:"features" frame:"act1"`: count the lakes against the ones you meant to make |
| **Make a closed salt pan the lowest ground** | `sculpt set 21` for the pan after the floor (21 is the lowest land, 9 m), then sink pits to 17 inside it so the pan holds the basin's sinks, then put any higher ground (a dome at 24–26) after it. | Land can't go below +4 m (h 20). A real below-sea-level floor can't be drawn, so the pan is lowest only *relative* to the basin [S1 model/units.ts:50-54]. A lake's surface is its lowest shore cell − 0.1, so a pool elsewhere whose shore drops to 20 sits **lower than the pan's pools**. On today's map, acid pool f's surface is 19.9 against 20.9 for the brine pools, and the Dead Spring's main pool ties them at 20.9 (OBSERVED [S8]). | Lake surface heights (only reachable with `run_js` today; see gap G1). `query_cells` over the pan and the rest of the basin: compare land minimums using `include_cells` |
| **Place a lake or pool (brine, acid, mineral)** | At the **end** of the terrain file: `sculpt set 17–18` in a polygon that contains at least one grid point (radius ≥ ~2 km; the repo uses 6 × 4.5 km ellipses), feather 0.5, edge_noise ≤ 0.8. Then `finalize_terrain`. In the era files, **after any `set_climate`**: `define_style_group layer:"lakes"`, then `set_lakes polygon subtype group name`. | **Pools merge** if their water cells touch: acid pools a and d are 0.82 km apart, became one 19-cell lake, and pool d's style went onto a without any warning (OBSERVED [S8]). Keep outlines at least one cell (2.3 km) plus 2 × edge_noise apart. `set_lakes` hits **every** lake with any cell centre inside the polygon [S2 session.ts:500-503]. The group must exist first [S1 features-generator.ts:351]. A pit's depth never shows: the surface is the lowest shore − 0.1 [S1 lakes.ts:10-14], and 3D flattens water to that surface [S7 3d-view.md]. Climate never changes a lake's extent, only its subtype and outlet. | `list kind:"features" frame:"act1"` (one row per intended pool, with the right group); `screenshot` frame with the lakes layer; `export_gaea`, then look at `mask-lakes-acid.png` |
| **Crater and lava lake** | Cone `sculpt set 66` (feather 6), crater `set 58` (feather 0.6), lava pit `set 18` (it hit one grid cell), `finalize_terrain`, then `set_lakes subtype:"lava" group:"lava" name`. | The crater and the lava pit each hit exactly **one grid cell** (OBSERVED [S8]). Azgaar picks `lava` only pseudo-randomly (h > 60, < 10 cells, `firstCell % 10 == 0`), so always set it [S1 features-generator.ts:394]. Lava lakes are non-navigable [S1 features-generator.ts:60]. | `list features`: one 1-cell lava lake |
| **Volcano** | The terrain as above; `paint_biome` "Recent Basalt" with `heights:[33,100]` over the flows; `add_marker type:"volcanoes"` **with a name and a note**. | Without a name and note, a configured type rolls a random name and a random "Dormant/Active/Erupting" note [S1 story/markers-generator.ts:274-291, 753-760]. Azgaar's own volcano test is h ≥ 70 [S1 markers-generator.ts:749-751], so the 66 cone is below it. That's harmless with procedural markers off. | `list kind:"markers"`; `screenshot` with the markers layer |
| **Waterfall** | Terrain: notch a slot into the lip (`set 46`, ~3 km wide) above a terrace (40). `finalize_terrain`. Then `add_river` with a polyline from a source on the plateau through the slot to the foot, `type:"Falls"`, `source_width:0.05`, `width_factor:0.6`. Optional: `add_marker type:"waterfalls"` with a name and note. | Azgaar's own waterfall test is a river cell at h ≥ 50 next to a river cell below 40, i.e. a drop of ≥ 10 units (~1,100 m → 480 m) in one cell [S1 markers-generator.ts:916-920]. Its 3D view churns white water where the drop along the course is ≥ 0.6 units per map pixel, and it is a sheer fall at 3.0 [S1 renderers/draw-satellite-texture.ts:619-623]. The 2D map has no waterfall symbol beyond the marker and the river type. The river is drawn through **cell centres**, not along your polyline [S1 river-generator.ts:775-810]. Any later `finalize_terrain` drops it. | `screenshot_3d` frame with the `low` camera; the heights of the river's cells (gap G1) |
| **River that ends in a sink** | *Generated:* put a lake (pit < 20) at the sink and let Azgaar route the flux into it; you don't control the course. *Hand-drawn:* `remove_rivers frame` (after `set_climate`), then `add_river` with the last point inside the lake, or on land (allowed: the falls ends at the Slums). | `add_river` can't start in water, and if its last cell already has a river it joins that river [S1 river-generator.ts:782-789]. `remove_rivers` removes each unlocked river whose mouth is inside the polygon **together with its whole basin**, even parts that lie outside the polygon [S1 river-generator.ts:843-857; S2 session.ts:534-544]. A later `set_climate` brings the generated rivers back. | Rivers in the frame (gap G2; `run_js` today); `screenshot` with layers `["rivers","lakes"]` |
| **A closed (endorheic) basin** | Rim cells all well above the pools, with at least one lake in the floor; nothing else. | A lake counts as closed only if flooding from its lowest shore, below lake height + 20 (`lakeElevationLimit`), reaches neither the ocean nor a lower lake [S1 lakes.ts:83-122; model/options/options-model.ts:97]. Act I's pools (~21) give a limit of ~41, and the Caravan pass is at 36–38. Today the basin tests closed (OBSERVED [S8]: the terminal pool has no outlet even at flux 931 against evaporation 9 in the before era). Lowering the pass or the outer lowland could open it, and Azgaar would then spill the basin out through an outlet river (INFERRED from the mechanism). | Lakes in the frame: the terminal lake has no `outlet` (gap G2) |
| **Wash (seasonal channel)** | Terrain: `sculpt set 26` channels (feather 1). After it: `define_style_group layer:"routes" group:"washes"` dashed, then `add_route group:"washes"` polylines, then `paint_biome` "Mineral Washes" with `heights:[20,34]`. | A route is only a line. It isn't hydrology (no flux and no moisture) and it doesn't carve terrain in Azgaar's 3D bake or before Gaea erosion. `export_gaea`'s washes mask reads the group named **exactly** `washes` [S2 session.ts:977]. If the wash must carry water in the model, use `add_river` instead: it's locked and carves in the 3D bake [S1 renderers/erosion-bake.ts:816-824]. Routes keep their exact points, so detail below cell size is fine. | `list kind:"routes" frame:"act1"`; `mask-washes.png` |
| **Oasis or spring (living)** | A pit at 18, then `set_lakes subtype:"freshwater" group:"freshwater" name`, then `paint_biome` "Spring Oasis" (habitability 60) around it. Optional: `add_river` from the spring as its stream; `add_marker type:"water-sources"` or `"hot-springs"`. | Azgaar has no groundwater or spring source. Rivers start from rainfall flux, and there is **no tool to make one area wetter**, so the oasis exists only as paint, and a `set_climate` or finalize repaints it. In the before map, a generated river runs *into and through* The Spring (it has an outlet), which makes it a through-flow lake, not a spring (OBSERVED [S8]). | `list features` (subtype and group); `screenshot` biomes |
| **Dead spring** | The same pit, then `set_lakes subtype:"salt"` (or `"dry"`) `group:"mineral"`, then `paint_biome` "Dead Spring". | Two pools under one polygon get the same name (today there are two lakes named "Dead Spring"; OBSERVED [S8]). `dry` renders as cracked clay in Azgaar's 3D view [S1 draw-satellite-texture.ts:402-406]. | `list features` |
| **Change the climate for an era** | Put `set_climate` (precipitation %, temperature) **first** in `eras/<era>/00-*.json`, then `remove_rivers` if needed, then all water styling, biomes and the rest. | It regenerates unlocked rivers on the whole map, plus biomes and lake subtypes and groups [S2 session.ts:318-327]. It changes no lake's extent. Winds, latitude and map size can only be set at `new_map` (config). Precipitation is an integer per cell (1 = 100 mm/yr) [S1 units.ts:63-65], so deserts quantise hard: Act I averages 0.2 now and 1.9 before (OBSERVED [S8]). | `get_map_info` (climate, landBiomes); `screenshot` with layers `["precipitation"]` or `["temperature"]` |
| **Era-specific terrain** (e.g. a larger before-era salt lake) | Put `sculpt` … `finalize_terrain` in `eras/<era>/0x-terrain.json`, sorted before `10-water`. A `set_climate` earlier in the same era survives it, because finalize recomputes climate from the options. | Finalize wipes everything downstream (see the table in §0), so the file must come before every water op. This breaks P14 ("one terrain base") [S10]. Ask George. | Both eras built; `list features` in each |

### 1b. Land cover, settlements, routes, annotation

| Intent | Tools, arguments, order | Pitfalls | Check |
|---|---|---|---|
| **Paint a custom biome** | `paint_biome name color habitability polygon\|frame heights:[min,max]` in `eras/<era>/30-*.json`, after every finalize and `set_climate`. Later paints win. | Paint covers land cells only [S2 session.ts:473]. Reusing a name **recolours that biome everywhere** [S2 session.ts:466-467]. Habitability doesn't recompute population [S1 biomes-generator.ts:174]. The cap is 255 biomes [S1 biomes-generator.ts:150]. **Renaming** "Salt Flats", "Sulfur Crust", "Acid Pits" or "Dead Spring" breaks the Gaea protect and colour masks, which match those names in code [S2 session.ts:992-995]. Azgaar's 3D satellite view does use custom biome colours [S1 draw-satellite-texture.ts:27-40]. | `query_cells` (biome counts); `get_map_info` landBiomes; `screenshot` biomes; `export_gaea` `mask-biome-*.png` |
| **Found a city on a shelf** | Terrain: `sculpt set 50` for the shelf (several grid cells: the repo's 9.5 × 6.4 km shelf holds 12; OBSERVED [S8]), in `base/`, before finalize. Era: `add_burg point name population group buildings note` in `40-*.json`. | The burg's cell must be dry land with no burg on it, so two quarters need two cells [S1 political/burgs-generator.ts:793-797]. Any later finalize deletes every burg. Azgaar doesn't check slope, water or access. `Burgs.add` auto-links a trail, which the tool deletes [S2 session.ts:390-392]. `group` must be a configured burg group (capital, city, town, fort, village, hamlet…). | `list kind:"burgs" frame:"act1"`; `query_cells` at the point (height and biome) |
| **Road through a pass; switchback** | Terrain: `sculpt set 38` for the pass (feather 1.5). Era: `define_style_group layer:"routes" group:"main-road"`, then `add_route` with zig-zag points. | Routes are free polylines: Azgaar checks neither grade nor that the line stays on land [S1 routes-generator.ts:913-925]. Check the grade by hand. For example, Slums (h 40, 484 m) to upper city (h 50, 1,024 m) is a 540 m climb along ~7 km of line, about 8% (INFERRED: computed from the ops). Road groups other than `main-road`, `old-road`, `roads` and `trails` don't appear in the Gaea roads mask [S2 session.ts:976]. The group must exist before `add_route` [S1 routes-generator.ts:914]. | `list kind:"routes"`; `screenshot` routes over the heightmap |
| **Remove generated rivers from a region** | `remove_rivers frame` (or polygon), after the last `set_climate`. | It only removes unlocked rivers, and it removes whole basins, so check rivers that start outside the polygon too. | Rivers in the frame (gap G2) |
| **Labels** | `define_style_group layer:"labels" group:"added" attrs zoom:{min:3,max:40}`, then `add_label point text note size`. | Azgaar hides the `added` group past zoom 5.5 by default [S3 world/README.md]. The tool can't create a new label group [S2 session.ts:346-347]. Labels are points, with no curved path along a landform. | `screenshot` frame with layers `["labels"]` |
| **Markers** | `add_marker point type name note icon`. Useful configured types: `volcanoes`, `ruins`, `waterfalls`, `hot-springs`, `water-sources`, `caves`, `rifts`, `mines`. Any other type needs a note. | Markers are locked, but a finalize deletes them [S2 session.ts:299]. | `list kind:"markers"` |
| **Notes** | HTML in `note` on `add_burg`, `add_marker` and `add_label`. Region notes hang on a label (the "Rift Basin" label). | No tool writes notes on lakes, rivers or routes (gap G6). Lake names given by `set_lakes` are lost on finalize. | `run_js` today |

---

## 2. Where Azgaar's simulation contradicts a hand-drawn intent, and how the ops cope

| # | Contradiction | Tag | Source | How the current ops handle it |
|---|---|---|---|---|
| 2.1 | **Water leaves land basins; only lakes hold it.** Depressions are filled so that flow can route, and water exits over the lowest rim. | SOURCE | [S1] river-generator.ts:445-448, 540-598; [S6] Heightmap-customization:98 | The pools are sculpted below 20 so the basin has sinks |
| 2.2 | **The generated drainage doesn't follow the story.** In the before map, the generated rivers off the basalt end in the **dome pools**: mineral pool → acid pool a → acid pool h, and pool h is the terminal sink with no outlet. The pan's brine pools get two short creeks. An un-designed river ("Ellyth") starts outside the frame to the south-west, crosses into the basin and ends at the acid field. world/README.md says the basin drains to the salt pan. | OBSERVED | [S8] before.map rivers 20, 47, 175, 562; lakes 78, 81, 82 | The now era: `remove_rivers` plus a locked falls stream. The before era keeps the generated rivers "until its water is designed" [S3] |
| 2.3 | **Lake surfaces come from their shores, not from the pit.** A lake's surface is its lowest shore cell − 0.1. Pools on the dome sit perched at 21.9–23.9, but pool f's surface is 19.9 (a shore cell at 20) and the Dead Spring's main pool is at 20.9, level with the brine pools. So P19 ("the pan is lowest") holds for land but not strictly for every water surface. | SOURCE + OBSERVED | [S1] lakes.ts:10-14; [S8] lakes 84, 86 | Not handled. This needs a check (G1) |
| 2.4 | **Pools merge.** Touching water cells form one feature with one subtype, group and name. | SOURCE + OBSERVED | [S1] features-generator.ts:121-141; [S8] acid a + d = one 19-cell lake | The README warns about it; the acid a and d ops still merge (harmless today because both are `acid`) |
| 2.5 | **Lake looks are reset.** `defineGroups` recomputes the subtype (frozen if temp < −3; dry if evaporation > 4 × flux with no inlets; salt if evaporation > flux with no outlet) and sets group = subtype on every finalize and `set_climate`. | SOURCE | [S1] features-generator.ts:392-418 | Styling sits in `eras/common/10-water.json` and the era `20-water.json`, after the climate |
| 2.6 | **Biomes are recomputed from climate**, by a moisture band × temperature band matrix: "Hot desert" needs temp ≥ 25 and moisture < 8, or moisture band 0 with temp ≥ 13. | SOURCE | [S1] biomes-generator.ts:85-91, 199-208 | Act I is painted after the climate. Outside the painted polygons, Azgaar's own biome stays |
| 2.7 | **Azgaar's climate is cooler than the Danakil.** Act I's computed temperatures run 0–16 °C (mean 11.5 °C), from a sea level of ~16 °C at 35.4° N with a lapse rate of 6.5 °C/km. That affects any unpainted biome (cold desert, not hot), lake evaporation, a possible `frozen` subtype on high ground, and the 3D satellite fallback colours. | SOURCE + OBSERVED | [S1] temperature-generator.ts:24-57; [S3] config.json; [S8] | Not handled. The paint hides it inside Act I (open question Q1) |
| 2.8 | **`set_climate` brings removed rivers back**, because it regenerates unlocked rivers across the whole map. | SOURCE | [S2] session.ts:321 | `now/05-rivers.json` runs after `now/00-climate.json` |
| 2.9 | **Finalize wipes everything downstream**, locked rivers, routes and markers included (see the §0 table). | SOURCE | [S1] generation-pipeline.ts:88-121; [S2] session.ts:292-299 | All terrain sits in `base/`, ending with `act1.finalize` |
| 2.10 | **Azgaar's own 3D view colours lakes by subtype, not group.** The acid pools (subtype `salt`) render as milky mineral teal in `screenshot_3d` without a frame. The terrain viewer and the Gaea colour map use the 2D map, so they show the group colours. | SOURCE | [S1] erosion-bake.ts:31, 372; draw-satellite-texture.ts:386-411 | Not handled. Judge the acid colour on 2D, the terrain viewer and Gaea, not on Azgaar's 3D |
| 2.11 | **The 3D and Gaea heights are not the drawn heights.** The erosion bake adds gullies and carves river valleys (river depth 10 by default) at ~0.5 km per sample, and flattens water to its surface. | SOURCE | [S7] 3d-view.md; [S1] erosion-bake.ts:816-824; [S2] session.ts:873-900 | Gaea's `mask-gaea-protect` keeps erosion off lakes and the pan [S4] docs/gaea.md |
| 2.12 | **Lake metadata goes stale.** In now.map, lakes still list `inlets` and `outlet` ids for rivers that don't exist (e.g. the Dead Spring's outlet is river 20). | OBSERVED | [S8] | Don't trust `inlets`/`outlet` without checking that the rivers exist |
| 2.13 | **Burgs and features get random culture names** (e.g. "Wetheidielkis"), and one console error, "Name is too short", appears when before.map loads. | OBSERVED | [S8] | Name the lakes that matter with `set_lakes name` |

---

## 3. Scale facts

| Fact | Value | Tag | Source |
|---|---|---|---|
| Canvas and scale | 1920 × 1080 px at 0.5 km/px, so 960 × 540 km; 33.6–38.5° N (4.9° of latitude) | SOURCE + OBSERVED | [S3] config.json; [S8] |
| Points | 100,000 (Azgaar's maximum, density 13); the grid is 422 × 237 | SOURCE + OBSERVED | [S1] data/graph-density.ts:3-17; [S8] |
| Cell spacing | sqrt(W·H/N) = 4.55 px = **2.28 km**; ~5.2 km² per cell | SOURCE + OBSERVED | [S1] grid-generator.ts:172-173; [S8] |
| The Act I frame | 100 × 64 km = 200 × 128 px; **1,244 grid cells, 1,350 pack cells** (the pack splits shore cells) | OBSERVED | [S8]; [S1] pack-generator.ts:41-50 |
| Height units to metres | land: m = (h − 18)^2 (exponent 2). So 20 → 4 m, 21 → 9, 26 → 64, 33 → 225, 40 → 484, 46 → 784, 50 → 1,024, 58 → 1,600, 66 → 2,304. Water depth: (h − 20)/h × 50, so 17 → −8.8 m | SOURCE | [S1] units.ts:50-54; options-model.ts:79 |
| Height resolution | Integer units. One unit is 5–15 m near the basin floor and ~80 m at 58 | SOURCE | [S1] heightmap-generator.ts; [S2] session.ts:275 |
| Temperature | Sea level by latitude row, minus 6.5 °C per km of altitude; whole rows, no local edits | SOURCE | [S1] temperature-generator.ts:41-57 |
| Precipitation | Winds cross whole rows and columns; land above h 85 blocks the wind; uplift adds rain on the windward side; integer per cell (1 = 100 mm/yr) | SOURCE | [S1] precipitation-generator.ts:88, 107-112; units.ts:63-65 |
| Rivers | A cell needs flux ≥ 30 to start a river, and rivers under 3 cells (~7 km) are dropped. `add_river` needs ≥ 2 cells | SOURCE | [S1] river-generator.ts:17, 300, 364, 778 |
| 3D and Gaea sampling | The erosion bake is ~0.5 km per sample (1024 detail); the Gaea tile is 128 km at 1024 px, 125 m/px; views exaggerate height 2× | SOURCE | [S2] session.ts:797-817, 847; [S4] docs/gaea.md |
| **Can be represented** | Landforms ≥ 1 cell (pools of radius ≥ ~2 km, a 3 km falls slot, terrace benches 1–2 cells wide); one-cell cliffs; route and label geometry finer than a cell (routes keep their exact points) | INFERRED | from the above |
| **Cannot be represented** | Land below sea level (the real Danakil floor); single cliffs, risers or slot canyons below ~2 km; a pool smaller than a cell; Dallol-scale pools (each map "pool" is a stylised cluster); a river course finer than cell centres; local climate (an oasis's water, a rain shadow drawn by hand); **anything at ARPG-zone scale**, since a 250–350 m main route is about 1/8 of a cell | INFERRED | from the above; [brief] |

---

## 4. Verification

### Per kind of change

| Change | Read check (fast) | Visual check | Tag |
|---|---|---|---|
| Terrain | `get_map_info` (`terrainPending: false`); `query_cells` on strips and patches (min, max, mean; `include_cells` lists cells in **index order**, not spatially [S2 session.ts:685-703]) | `screenshot` frame with layers `["heightmap","rivers","lakes"]`; `screenshot_3d` frame with cameras `["overview","low"]` | SOURCE |
| Water | `list kind:"features" frame:"act1"`: one row per intended pool with the right subtype, group and name; no stray lakes (list filters by the lake's first cell [S2 session.ts:730]) | `screenshot` with lakes; `export_gaea`, then `mask-lakes-acid.png` and `mask-lakes-other.png` | SOURCE |
| Rivers | No read tool (gap G2); `run_js` for now | `screenshot` with layers `["rivers","lakes","heightmap"]` | SOURCE |
| Climate | `get_map_info` (climate, landBiomes) | layers `["temperature"]` or `["precipitation"]` | SOURCE |
| Biomes | `query_cells` biome counts; `get_map_info` landBiomes | layers `["biomes"]`; `mask-biome-*.png` | SOURCE |
| Settlements, routes, markers | `list` with `burgs`, `routes` or `markers` and `frame:"act1"` | layers `["biomes","routes","burgIcons","labels","markers"]` | SOURCE |
| Labels and notes | Only `run_js` (G6) | layers `["labels"]` at the act frame | SOURCE |
| Every call | The response's `pageErrors` field: Azgaar console errors appear there [S2] index.ts:16-27 | | SOURCE |

**Layer ids** that `screenshot` accepts include heightmap, lakes, rivers, biomes, routes, burgIcons, labels, markers,
relief, coastline, temperature, precipitation, cells, grid, coordinates and scaleBar. SOURCE [S1] renderers/layers.ts.

### Checks a pass must run before it's done (ranked)

1. **Build both eras from the ops**: `npm run world` and `npm run world before`. A manual session isn't evidence. Each
   build saves the map and writes full and act screenshots (heightmap and biomes), Azgaar's 3D view, the Act I terrain
   viewer (overview and low) and the Gaea tile. SOURCE [S5] build-world.mjs:62-74.
2. **Compare before and after** screenshots, 2D and 3D, against `world/reference/act1-overview.jpg`. PROJECT P9, P10 [S10].
3. **Count the lakes** in the frame against the intended list (`list features`), with each lake's group and subtype.
   This catches merges, stray water and lost styles. SOURCE + OBSERVED (§2.4).
4. **Check the lowest ground**: no land cell in the basin at or below the pan (21), and no lake surface below the pan's
   pools. Today this needs `run_js` (G1). OBSERVED (§2.3).
5. **Check the drainage**: for the era's climate, where do the rivers end? Today this needs `run_js` (G2). OBSERVED (§2.2).
6. **Check the Gaea masks** if a group or biome name changed: `mask-lakes-acid`, `mask-roads`, `mask-washes`,
   `mask-gaea-protect` and `mask-gaea-colour` must not be empty. SOURCE [S2] session.ts:950-995.
7. **If a tool changed, run `npm run smoke`**, and update its registered-tool count (`names.length === 23`) when you
   add a tool. SOURCE [S5] smoke.mjs:121.

---

## 5. Gaps: intents the tools can't express (they need new named tools, not `run_js` in a build)

| ID | Gap | Why it matters | Proposed named tool | Tag |
|---|---|---|---|---|
| G1 | **No height reading along a line or over a raster**, and no lake surface heights. The dev log shows a `run_js` height-raster dump used during the terrain pass [S9]. | Escarpment profiles, waterfall drops, road grades, and "the pan is lowest" (§2.3) can't be checked with tools | `profile` (polyline: height units, metres and slope per cell) and/or `height_grid` (frame raster); add `height` (water surface) to `list features` | SOURCE + OBSERVED |
| G2 | **`list` has no rivers**, and features lack hydrology fields (closed, outlet, inlets, flux, evaporation) | §2.2 can't be verified; the drainage-to-sink checks are blind | `list kind:"rivers"` (lock, source and mouth in frame coordinates, end feature, length, discharge); add the hydrology fields to `features` | SOURCE |
| G3 | **No local climate.** `set_climate` is global; there's no wetter oasis or spring, no hand-drawn rain shadow, no warmer basin | Oases and springs exist only as paint (§1a) | `set_cell_climate` (polygon: precipitation or temperature, set or scale, written to the grid; re-runs rivers and biomes). It must sort after the era's `set_climate` | SOURCE (precipitation-generator.ts, temperature-generator.ts) |
| G4 | **Finalize wipes locked rivers, routes, burgs and markers**, so era-specific terrain must come early | Era-specific or late terrain fixes force replays and order hacks | `finalize_terrain mode:"risk"`, wrapping Azgaar's `MapRestoration.applyHeights`, which carries burgs, routes, markers, labels and locked rivers over a coastline change [S7 generation-pipeline.md:179-237; S6 Heightmap-customization:57-61] | SOURCE |
| G5 | **The Gaea export hard-codes names**: road groups, the wash group, the `acid*` lake prefix, and four biome names | Renaming a biome or adding a road class silently empties a mask | Read these lists from config (e.g. `world/gaea.json`) and report empty masks | SOURCE [S2] session.ts:951, 976-977, 992-995 |
| G6 | **No edit or remove tools** (burgs, markers, labels, routes, rivers), no notes on lakes, rivers or routes, no curved labels | Builds replay, so removal means deleting the op, but interactive iteration and per-feature notes need `run_js` | `remove`/`move` by id; `set_note target:"lake\|river\|route"`; `add_label path` | SOURCE |
| G7 | **No drainage trace** (where water from a point ends up) | Answers "does this wash reach the pan?" directly | `trace_flow point`, returning the cell path and the end feature, using Azgaar's routing on the current heights | INFERRED |
| G8 | **`query_cells` lacks temperature, precipitation, river and land-only minimum**, and its sample is in index order | Pan and climate checks | Add those fields and a land-only height summary | SOURCE [S2] session.ts:665-717 |

---

## Recommendations for the skill (ranked)

1. **Keep the regeneration table (§0) in the skill and apply it on every op you write.** Terrain and its finalize
   come first, then climate, then `remove_rivers`, then styles, paint, burgs, routes, markers and labels. Never put
   `sculpt` or `finalize_terrain` after an era's `10-water`. SOURCE.
2. **A pool is a pit below 20 that contains a grid point.** Keep pools ≥ 2.3 km plus 2 × edge_noise apart, and
   confirm one lake per pool with `list features` after every water pass. (Today acid pools a and d have merged; that
   is the first fix to propose.) SOURCE + OBSERVED.
3. **Only lakes are sinks.** For any "water ends here" intent, put a lake there, or draw a locked river to it in an
   era where the generated rivers are removed. In the before era, design the drainage so it reaches the pan, and stop
   relying on generated rivers (§2.2). SOURCE + OBSERVED.
4. **Check the lowest ground on land and on water surfaces** (pan 21, brine pools 20.9) after any terrain change.
   Raise pool f's dome edge and the Dead Spring's rim above 21 if P19 must hold strictly. OBSERVED.
5. **Draw shapes in km and convert to frame units** (x ÷ 100, y ÷ 64 for Act I). Check that every sculpt reports
   `cellsChanged > 0`; a one-cell feature is the floor. SOURCE.
6. **Lake look = subtype + group.** Set both, after the climate. Judge colour in 2D, the terrain viewer and Gaea, and
   remember Azgaar's own 3D view uses only the subtype. SOURCE.
7. **Routes are lines, rivers are hydrology.** Use `add_route` for roads and visual washes, `add_river` for water the
   model must carry. Check road grades by hand from the heights. SOURCE.
8. **Treat Gaea mask names as an interface.** Don't rename "Salt Flats", "Sulfur Crust", "Acid Pits", "Dead Spring",
   or the `washes`, `main-road` and `old-road` groups, or the `acid*` lake prefix, without changing `export_gaea` too
   (or doing G5). SOURCE.
9. **Pass the name and note on every configured marker type**, or Azgaar invents them. SOURCE.
10. **A pass is done only when both eras are built and screenshots exist before and after (2D and 3D)**, plus the
    lake-count, lowest-ground and drainage checks in §4. Propose G1 and G2 first, since they make checks 4 and 5
    possible without `run_js`. SOURCE + PROJECT.
11. **Keep in mind what can't be drawn**: anything below a cell, below sea level, or at zone scale. The map gives
    zones bearings and context, never their size. INFERRED.

## Open questions for George

1. **Climate realism.** Act I computes as a cool desert (mean 11.5 °C) at 35.4° N. Should the world's latitude or
   equator temperature move so that Azgaar's own climate reads as a hot rift (this changes the whole continent's
   biomes and evaporation)? Or is paint-over enough, since the map is a dev tool (P2, P8)?
2. **Before-era drainage.** Should the before map's water be designed (generated rivers removed, hand-drawn rivers
   into the old salt lake), and where does the old caravan road's river or water lead (P24)?
3. **Before-era salt lake.** A larger old lake needs different terrain in the before era, which breaks P14 ("one
   terrain base"). Allow an era terrain file, or keep the old lake as paint only?
4. **Strict lowest ground.** Must every water surface also sit above the brine pools (fix pool f and the Dead Spring
   rim), or is "lowest land" enough for P19?
5. **New tools.** Approve building G1 (profile and height grid) and G2 (list rivers, lake hydrology) before the skill
   relies on these checks? G4 (Risk-mode finalize) is the bigger change.
6. **The merged acid pools** (a and d): separate them (move d about 2 km), or accept one larger pool?

---

## Sources

| # | Source | Read |
|---|---|---|
| S1 | Azgaar's Fantasy Map Generator source, v1.156.0 (commit 67d555b), `tools/azgaar/source/src/` (https://github.com/Azgaar/Fantasy-Map-Generator/tree/v1.156.0); file:line given per finding | 13 Nov 2026 |
| S2 | This repo's MCP server: `tools/azgaar-mcp/src/index.ts`, `session.ts`, `world.ts` | 13 Nov 2026 |
| S3 | This repo's world: `world/README.md`, `world/config.json`, `world/frames.json`, `world/base/*.json`, `world/eras/**/*.json`, `CLAUDE.md` | 13 Nov 2026 |
| S4 | This repo's `README.md` (tools table, "Known Azgaar behaviour", 3D views) and `docs/gaea.md` | 13 Nov 2026 |
| S5 | `scripts/build-world.mjs`, `scripts/smoke.mjs` | 13 Nov 2026 |
| S6 | Azgaar wiki, as the local mirror at the pinned tag (`tools/azgaar/source/docs/wiki/`): Heightmap-customization, Geographical-Features-Overview, River-Editor, Scale-and-distance (https://github.com/Azgaar/Fantasy-Map-Generator/wiki) | 13 Nov 2026 |
| S7 | Azgaar's architecture docs at the pinned tag: `docs/architecture/generation-pipeline.md`, `docs/domain/3d-view.md` | 13 Nov 2026 |
| S8 | Probe of `world/build/now.map` and `before.map` (built 6 Nov 2026), loaded headless through `AzgaarSession` with read-only `runJs` queries: lakes, rivers, climate, the cells under each sculpt and set_lakes polygon, and a height raster of Act I. Nothing was written to the repo | 13 Nov 2026 |
| S9 | `world/build/run-js.jsonl` (the dev escape-hatch log) | 13 Nov 2026 |
| S10 | `docs/studio/research/cartography/E_project_decisions.md` (P1–P26) | 13 Nov 2026 |
