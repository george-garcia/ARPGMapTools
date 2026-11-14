# Azgaar and the MCP tools: how to make each change, and what goes wrong

Load for every step that writes an op or reads the map. Evidence and full tables: `docs/studio/research/cartography/D_azgaar_and_tools.md`
(D §n, sources D-S1…S10). Tool list and arguments: the repo `README.md`. Azgaar is pinned at v1.156.0 (P4).

## The model (read before any change)

- **M1. Land is height 20–100, water is anything below 20.** A connected water patch touching the map edge is ocean;
  any other is a lake; Azgaar has no other idea of a lake. Metres = (h − 18)²: 21 ≈ 9 m, 26 ≈ 64, 33 ≈ 225, 40 ≈ 484,
  50 ≈ 1,024, 58 ≈ 1,600, 66 ≈ 2,300. Land can't go below +4 m, so a below-sea-level floor is the lowest land (h 21)
  plus a note. *SOURCE D §0, §3.* Check: `query_cells` min/max on the area.
- **M2. Two graphs.** Heights and climate live on the grid (~100k cells, 2.28 km apart, 5.2 km² each); lakes, rivers,
  biomes, burgs, routes and markers live on the pack, rebuilt from the grid on every finalize. *SOURCE D §0.1, §3.*
- **M3. Frame-local units aren't square.** In `act1`, one x unit is 100 km and one y unit is 64 km: draw shapes in km
  and convert (x ÷ 100, y ÷ 64), or a circle becomes an ellipse. *SOURCE D §1.* Check: the shape on a frame screenshot.
- **M4. A feature smaller than one cell doesn't exist on the map.** Every `sculpt` must report `cellsChanged > 0`; one
  cell is the floor; about two cells (4.6 km) is the smallest thing that reliably reads. *SOURCE D §3; SCIENCE A6.1.*

## What each regeneration resets (apply on every op you write)

| Content | `finalize_terrain` | `set_climate` |
|---|---|---|
| Heights | kept | kept |
| Lakes | rebuilt from h < 20; **names and notes lost** | kept, names kept |
| Lake subtype and group | **reset** (group = subtype) | **reset** |
| Generated rivers | regenerated | regenerated **across the whole map**, including removed ones |
| Locked rivers (`add_river`) | **dropped** | kept |
| Biomes | recomputed; **paint lost** (the custom catalogue stays) | recomputed; paint lost |
| Burgs, routes, markers (locked too) | **all removed** | kept |
| Added labels, style groups, label zoom | kept | kept |

*SOURCE D §0 table.* So:
- **M5. Op order is the dependency order:** terrain and its `finalize_terrain` first (all in `base/`), then the era's
  `set_climate` (`eras/<era>/00-*`), then `remove_rivers`, then lake styles and `set_lakes`, then `paint_biome`, burgs,
  routes, markers, labels. Never put `sculpt` or `finalize_terrain` after an era's `10-water`; a later terrain change
  means replaying everything after it. Ops replay `base/`, then `eras/common` and `eras/<era>` interleaved by file name
  (common first on a tie). *SOURCE D §0.6, §1.* Check: the op file names sort in this order; the build log.
- **M6. `run_js` never appears in an op;** anything a build needs becomes a named tool first (P3). *PROJECT.*

## How to make each change

| Intent | Tools and order | Pitfalls |
|---|---|---|
| Escarpment, plateau lip | `base/`: `sculpt raise` shoulders and plateau (feather ~14 km, edge noise ~10, clamp), `roughen`, `sculpt set` the lip, carve the basin against it with a tight feather (≤ 2.5 km) on the escarpment side; `finalize_terrain` | Work outside-in, raising over existing ground rather than setting, or the region reads as a box (the Act I plausibility pass) |
| Basin floor | `sculpt set` 31–34, the features inside it, `roughen` with `clamp [28,100]` | **A land basin isn't a sink**: Azgaar fills depressions and routes water out over the lowest rim. Only a lake (h < 20) holds water (M7) |
| Salt pan as lowest ground | `sculpt set 21` after the floor, pits to 17 inside it, higher ground (a dome at 24–26) after it | The pan is lowest only relative to the basin (M1). A lake's surface is its lowest shore − 0.1, so a pool on a slope can sit below the pan's pools (D §2.3) |
| Pool (brine, acid, mineral) | End of the terrain file: `sculpt set 17–18` in a polygon holding a grid point (≥ ~2 km radius), feather 0.5, edge noise ≤ 0.8; `finalize_terrain`. In the era, after `set_climate`: `define_style_group lakes`, then `set_lakes polygon subtype group name` | **Touching pools merge** into one lake with one name and group: keep pools ≥ 2.3 km + 2 × edge noise apart (acid a and d have merged today). Small pits don't form lakes |
| Crater, lava lake, volcano | Cone `set` ~66, crater `set` lower, lava pit `set 18`; finalize; `set_lakes subtype:"lava"`; `paint_biome` young basalt over the flows; `add_marker type:"volcanoes"` **with name and note** | Without a name and note a configured marker rolls a random name and status |
| Waterfall | Notch the lip (a slot ~3 km wide) above a terrace; finalize; `add_river` polyline plateau → slot → foot, `type:"Falls"` | A falls needs a real catchment on the plateau above it (G-rules) |
| River to a sink | Generated: put a lake at the sink and let flux route. Hand-drawn: `remove_rivers` (after `set_climate`), then `add_river` ending inside the lake | `add_river` can't start in water; it joins an existing river if its last cell has one; it doesn't check that its line runs downhill |
| Wash (seasonal) | `sculpt set` shallow channels; style group `washes` (dashed); `add_route group:"washes"`; `paint_biome` with a height band | A route is only a line: no flux, no moisture, no carving in the 3D bake |
| Living oasis / spring | Pit 18, `set_lakes freshwater`, `paint_biome` around it, optional `add_river` and a `water-sources` / `hot-springs` marker | Azgaar has no groundwater and no local climate: the oasis is paint (gap TG3) |
| Era climate | `set_climate` first in `eras/<era>/00-*.json` | Regenerates every unlocked river on the map, biomes, lake subtypes and groups; never changes a lake's extent. Winds, latitude, map size only at `new_map` |
| Era-specific terrain | `eras/<era>/0x-terrain.json` with sculpt … finalize, sorted before `10-water` | Breaks P14 (one terrain base): George's call |
| Custom biome | `paint_biome name color habitability polygon heights:[min,max]` after every finalize and climate | Paint covers land only; reusing a name **recolours that biome everywhere**; later paints win |
| City on a shelf | `base/`: `sculpt set` the shelf (several cells); era `40-*`: `add_burg` | Each burg needs its own dry cell; any later finalize deletes it |
| Road, switchback, pass | Terrain: a low pass in the rim; era: `define_style_group routes`, `add_route` with a zigzag | Azgaar checks neither grade nor that the line stays on land: check grade by hand (G-rules: pack routes under ~13%) |
| Labels, markers, notes | `define_style_group labels added zoom {3,40}`; `add_label point text note size`; `add_marker point type name note` | `added` labels hide past zoom 5.5 by default; no notes on lakes, rivers or routes; lake names from `set_lakes` die on finalize |

*SOURCE D §1a, §1b.* And:
- **M7. Only lakes are sinks.** For any "water ends here", put a lake there or draw a locked river to it with generated
  rivers removed. Don't rely on generated rivers to tell the story: in the before era today they end in the acid dome,
  not the pan, and a stray river enters from the south-west. *SOURCE D §2.1; OBSERVED D §2.2.*
- **M8. A lake's look is subtype + group;** set both after the climate. Judge acid colours on the 2D map, the terrain
  viewer and Gaea: Azgaar's own 3D view colours lakes by subtype only (the acid pools render teal there). *SOURCE D §2.10.*
- **M9. Gaea mask names are an interface.** `export_gaea` hard-codes the biome names "Salt Flats", "Sulfur Crust",
  "Acid Pits", "Dead Spring", the route groups `main-road`, `old-road`, `roads`, `trails`, `salt-road`, `washes`, and the `acid*`
  lake-group prefix. Renaming any of them silently empties a mask: change the tool too. *SOURCE D §5 TG5.*
- **M10. Azgaar's climate is cooler than the Danakil** (Act I computes 0–16 °C, mean 11.5): unpainted ground becomes cold
  desert, and evaporation is low. Paint covers it inside Act I; whether to change the world's climate is George's call.
  *SOURCE + OBSERVED D §2.7.*
- **M11. Name every lake, burg and marker that matters,** or Azgaar gives it a random culture name. *OBSERVED D §2.13.*

## Gaps: what the tools can't do yet (propose a named tool; never `run_js` in a build)

| ID | Gap | Proposed tool |
|---|---|---|
| TG1 | No height profile or raster; no lake surface heights | `profile` (polyline: heights, metres, slope) and `height_grid`; `height` on `list features` |
| TG2 | `list` has no rivers; lakes lack hydrology fields | `list kind:"rivers"` (source, mouth, end feature, length); `closed`, `outlet`, `inlets`, `flux` on features |
| TG3 | No local climate | `set_cell_climate` (polygon precipitation / temperature) |
| TG4 | Finalize wipes locked rivers, routes, burgs, markers | `finalize_terrain mode:"risk"` wrapping Azgaar's height restoration |
| TG5 | Gaea mask names hard-coded | read them from config; report empty masks |
| TG6 | No edit/remove tools; no notes on lakes, rivers, routes | `remove` / `move` by id; `set_note` |
| TG7 | No drainage trace | `trace_flow point` |
| TG8 | `query_cells` lacks climate, river and land-only fields | extend it |

Until TG1 and TG2 exist, the lowest-ground and drainage checks (review.md §2) need a read-only `run_js` query in a dev
session (logged, never in an op), and the report says so. *SOURCE D §4–5; PROJECT P3.*
