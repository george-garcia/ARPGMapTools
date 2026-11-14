# Map evidence for the geography review: the continent and Act I, both eras

**Date:** 2026-11-13 · **Ops at:** ARPGMapTools `f21107d` (branch `cartography-skill`; world ops same as `main`), working
tree clean, nothing committed or changed · **Builds:** both eras rebuilt fresh today (see §0) · **Vault:** read-only copy
(README "Map decisions" 2026-11-03, "World look and climate" 2026-11-05, "Act I present-day map" 2026-11-05, "Map
direction" 2026-11-06; Act I spine 2026-11-13; Geological Blueprint) · **Rules:** `arpg-cartography` skill
(`references/review.md` §1–§2, geography, cartography-craft, azgaar-ops, world-to-zones, gaea) and
`docs/studio/research/cartography/E_project_decisions.md` (P1–P27).

Heights are Azgaar units (land 20–100; metres = (h − 18)²: 21 = 9 m, 26 = 64 m, 33 = 225 m, 40 = 484 m, 50 = 1,024 m,
58 = 1,600 m, 66 = 2,304 m). Coordinates are `act1` frame-local (x west → east, y north → south; 1 x unit = 100 km,
1 y unit = 64 km). "Cell" means an Azgaar pack cell (~2.3 km apart). Lake surfaces are Azgaar's own `feature.height`.

## How the evidence was gathered

All reads went through the azgaar MCP server, opening the built `.map` files read-only (nothing saved).
Client: `/tmp/claude-0/-home-claude/7caafd89-0678-50ce-9389-72eb5e6ae44d/scratchpad/review/work/dump.mjs`.

- **Tools:** `open_map`, `get_map_info`, `list` (features, burgs, markers, routes; frame and whole map), `query_cells`
  tiled over the whole canvas (576 tiles of 60 × 60 px, `include_cells`), giving every pack cell (44,650 per era) with
  height, biome and feature; `screenshot` (written to `world/build/screenshots/review-*.png`).
- **Read-only `run_js`, only where no tool reads it** (TG1, TG2, TG8), four calls per era, logged by the server in
  `world/build/run-js.jsonl` and by the client in `.../review/work/now-runjs.log` and `before-runjs.log`:
  1. rivers: course cells, heights, end cell and end feature (TG2: `list` has no rivers);
  2. lakes: surface height, shore heights, inlets, flux, evaporation (TG1: no lake surfaces);
  3. routes: the cell and height under every point (TG1: no profiles);
  4. per-cell temperature, precipitation, river and flux, plus biome colours (TG8).
- **Analysis scripts** (Python over the dumps): `.../review/work/lib.py`, `paths.py` and the one-off queries recorded in
  this session. Raw dumps: `.../review/work/{now,before}-*.json`.

All paths under `.../review/` are in
`/tmp/claude-0/-home-claude/7caafd89-0678-50ce-9389-72eb5e6ae44d/scratchpad/review/`.

---

## 0. Builds (review.md §2 check 1)

| Era | Command | Result | Ops replayed | Errors |
|---|---|---|---|---|
| now | `npm run world` | built in 1 m 50 s; `world/build/now.map` 4,969,176 bytes | 115 ok | none in the build log; no `pageErrors` |
| before | `npm run world before` | built in 1 m 37 s; `world/build/before.map` 5,481,201 bytes | 75 ok | none; no `pageErrors` |

Logs: `.../review/../build-now.log`, `.../build-before.log` (scratchpad root). Both builds wrote their 2D, 3D and Gaea
outputs (`world/build/screenshots/{now,before}-*.png`, `world/build/3d/{now,before}-act1-3d/`,
`world/build/gaea/{now,before}-act1/`). The before-era 2D screenshots are byte-identical to the 6 Nov build
(deterministic replay).

Tool note (not a map finding): reopening `now.map` with `open_map` logs one page console message, "Name is too short!
Random name will be selected". Harmless here, but it means some entity has a name too short for Azgaar and gets a
random one on load.

Heights are identical in the two eras: **0 of 44,650 cells differ** (one shared terrain, P14, K30).

---

## 1. Re-verification of the 13 measurements from today's blind-judged test

| # | Earlier claim (round 1 / round 2) | Verdict today | Numbers |
|---|---|---|---|
| 1 | The falls stream climbs on the plateau before it falls | **CONFIRMED, worse than recorded** | Along the river's own 38 cells (`act1.river.falls`, river 130): 16 uphill steps; from h53 (1,225 m) at 17 km it climbs to **h62 (1,936 m)** at 25.6 km (−0.045, 0.005), and again from h54 (1,296 m) at 39 km to h61 (1,849 m) at 51 km. Largest climb above its running minimum: **9 units (~710 m)**. The earlier profile, sampled along the op polyline, peaked at h61 and missed the h62 cell |
| 2 | The main wash runs uphill | **CONFIRMED** | `act1.wash.main` profile: 33 → 26 (7 km) → 27 → **33** at (0.543, 0.489) → 30 → 31 → **34** at (0.593, 0.603) → pool (17). Climbs 8 units above its running minimum (64 m → 256 m). Braid: 26 → 29 → 30 → 30 → 29 (climbs 4, ends on open ground at h29). Terrace branch: crosses the h30 bench at (0.65–0.66, 0.47) |
| 3 | A land cell sits below the pan | **CONFIRMED** | One land cell at **h20** (4 m), cell 33690 at (0.912, 0.744), Acid Pits biome; every other land cell ≥ 21 |
| 4 | The Dead Spring is level with the pan | **CONFIRMED** | Dead Spring main pool (feature 84): surface **20.9**, the same as both brine pools (20.9); its lowest shore is h21 at (0.356, 0.770) and (0.356, 0.798) |
| 5 | Two acid pools sit at brine level | **CONFIRMED and refined: one at, one below** | Acid c ("Fordis", 6 cells): surface **20.9 = brine**. Acid f ("Dolanen", 3 cells): surface **19.9, below the brine pools**. Gaea export agrees: pool at (792, 602) 9.0 m and (822, 650) 7.8 m vs brine 9.0 m |
| 6 | Acid pools a and d merged | **CONFIRMED** | One 19-cell lake ("Wetheidielkis", feature 81), centre (0.712, 0.757), spanning both op polygons; 7 acid lakes in the frame instead of 8 |
| 7 | Before era: salt and gypsum painted as grassland and forest | **CONFIRMED exactly** | The 88 cells that are Salt Flats, Gypsum Pavement or Gypsum Dunes now are **74 Grassland + 14 Temperate deciduous forest** before (same cell ids, same heights). Also: the 150 Rift Escarpment cells are 135 Grassland, 7 forest, 7 cold desert before |
| 8 | Washes and acid ground near-identical orange | **CONFIRMED** | `#B85D23` vs `#C8661E`: ΔE76 **8.1**. The closest wash cell is 3.5 km from acid ground (across the teal pool). Acid ground chroma 64 vs washes 58: the acid ground is not clearly the loudest ground |
| 9 | Salt flats small vs acid | **CONFIRMED exactly** | Inside the `act1.basin` polygon (735 cells): Salt Flats **49 (6.7 %)** (+ 11 brine-pool cells) vs Acid Pits 74 + Sulfur Crust 37 + 43 acid-lake cells = **154 (21 %)**. Gravel Flats 270 (36.7 %) |
| 10 | The volcano is a flat table | **CONFIRMED** | Within 8 km of (0.84, 0.07): 15 cells at h66 and 4 at h67 (a 66–67 disc ~11 km across) around **one h18 cell** (the lava lake: a 2,300 m shaft in the heights; its surface is 65.9). The crater (`set 58`, r ≈ 1.2 km) is below one cell and absent. South flank: 63 → 41 → 21 within ~4.6 km straight onto the pan |
| 11 | The basin outline is rectangular | **CONFIRMED** | East margin over 40 km (y 0.25–0.875): first rim cell at x 0.935–0.98, **std 1.2 km**; south margin over 75 km (x 0.175–0.925): y 0.875–0.95, **std 1.1 km**. Rim crests uniform: east 46–50, south 45–49. Visible at continent scale in `world/build/screenshots/review-now-full-rivers.png` and `now-biomes.png` |
| 12 | A gentler route onto the plateau at the basin's north end bypasses the city | **CONFIRMED** | Grade-limited shortest path over cells (Dijkstra, `paths.py`). At ≤ 13 %: from the basin floor at (0.54, 0.19) up (0.52, 0.06) → (0.47, −0.03) → (0.48, −0.07) h56: **22.4 km, never within 9 km of the city**; from the Slums through the city: 24.2 km (via the falls slot h46 and the shelf). At ≤ 10 % only the north route exists (24.1 km); from the Slums the shortest ≤ 10 % path goes round by the north end (56 km) |
| 13 | Before-era rivers end in the acid dome | **CONFIRMED** | Every generated river in the frame ends in the dome: Ellyth (SW pass → the Spring → acid a+d), Uthondras (down the washes), Lothin (off the basalt), Adarden (from acid c) and Ladiben (a+d → h) all feed **acid pool h ("Ithagroth"), 2 cells, surface 21.9**, a closed freshwater lake with flux 931 against evaporation 9. The pan's brine pools (20.9, the real low point) receive only one 3-cell creek between themselves |

---

## 2. Findings by checklist area (review.md §1)

Severity: BLOCKING (a physical rule the map visibly breaks: water uphill, a lake not at the low point), MAJOR (wrong for
the region or against a vault decision, reads at map scale), MINOR (local, cosmetic or note-level). "P7" = a fix the
standing autonomy allows; "George" = settles canon, moves a locked anchor or changes a rule.

### 2.1 The continent (coarse)

Evidence: `world/build/screenshots/now-heightmap.png`, `now-biomes.png`, `before-heightmap.png`, `before-biomes.png`,
`review-now-full-rivers.png`, `review-now-full-precipitation.png`, `review-now-full-temperature.png`,
`review-before-full-*.png`, `now-3d.png`, `before-3d.png`.

**Checked and fine**
- **Coastline:** one continent with ocean all round (P15), irregular coasts; 48 islets, mostly fringing the west and
  north-west coast (reads as a drowned coast, not speckle).
- **Ranges:** a central east–west spine (highest point h70, 2,704 m at (2.03, −0.87) frame-local, i.e. map (1074, 505)),
  a NE–SW ridge and a north–south ridge down the eastern peninsula. Belts, not blobs (K5). Act I's plateau (h55–62) is
  the largest high block south of the spine and the volcano (h66–67) ties the spine's next-highest cells (h67), so it is one of the continent's tallest summits.
- **Rivers reach the sea or a lake:** every trunk river ends in the ocean or a lake: now 83 to the ocean + 13
  tributaries; before 224 to the ocean, 216 tributaries, 4 into lakes. **The only trunk that ends on open land in either
  era is the Slums falls stream** (intended: its op note says "it ends at the Slums, used up"; Azgaar can't carry that
  note on a river, TG6) (G8, K1).
- **Climate belts:** at 33.6–38.5° N under south-westerlies the coasts are wet and the interior dry (now precipitation
  index: south coast band 7.6, interior bands 0.9–1.3; west third 5.9, east third 2.4), the south warmer than the north
  (15.8 vs 13.9 °C), the interior cooler with height (11.6 °C). Before is wetter everywhere (×2–4) with the same
  pattern (G23, G24). Present day: 69 % desert (40.8 % hot, 28 % cold), consistent with P13.
- **Big lakes:** the eastern lake (110 cells) has an outlet in both eras; the two north-east lakes (83, 32 cells) are
  salt and closed now, fresh with outlets before (G9, G14 behave correctly there).

| ID | Sev | Finding | Rule | Evidence | Fix (ops) | Who |
|---|---|---|---|---|---|---|
| C1 | MAJOR | **Act I reads as a box set into the continent**, in terrain and paint. The basin's east and south walls are straight (§1 #11), and the custom paint stops on straight lines at the frame's polygon edges: paint's east edge std 3.3 km at x ≈ 0.99; outside it the continent is Azgaar's Cold desert (ΔE 28 against Rim Hills), so a brown frame shows round the act at continent scale. | Realistic outer boundaries that blend into the continent, not a rectangle (P17, vault 2026-11-06); a region is never a rectangle (G1–G3) | `now-biomes.png` (the brown frame at map ~(650–870, 610–740)); `now-heightmap.png`; `now-act1-3d-overview.png` (two straight walls) | Terrain: see A1. Paint: in `eras/now/30-biomes.json` push the outer vertices of `now.biome.rim-hills` and `now.biome.escarpment` out to ~1.25 / −0.25 so their edges follow the `heights [44,100]` band (the rim crest) instead of the polygon, and add `now.biome.rim-fade` (`Rim Hills`, heights [40,43], an irregular ring 0–8 km outside the crest) so the paint grades into the desert. Same in the before era (see E1) | P7 |
| C2 | MINOR | Nine (now) and ten (before) 1–5-cell closed freshwater lakes in the interior and north. | Closed lakes are salty (G9); no one-cell specks (K4) | `.../work/{now,before}-lakes.json` (e.g. "Orarak" 5 cells at (−1.62, −2.15), "Zhazriqed" 4 cells before) | None needed for Act I; if they bother George, a later continent pass sets them `salt` or `dry` with `set_lakes` in a `eras/common` op | P7 (low priority) |
| C3 | — | Act I's computed climate is cool for a Danakil analogue: 0–16 °C, mean 11.5 °C (both eras); the plateau 4.5 °C. Known (M10); not re-litigated here | George's call (M10) | `.../work/now-climate.json` | — | George (unchanged) |

### 2.2 Form (Act I)

| ID | Sev | Finding | Rule | Evidence | Fix (ops) | Who |
|---|---|---|---|---|---|---|
| A1 | MAJOR | **The east and south margins are still a rectangle** (re-verified, §1 #11). | Margins are segmented and offset, never a box (G3, G1); P17 | Edge scans: east std 1.2 km over 40 km, south std 1.1 km over 75 km; crests 45–50 throughout | `base/10-act1-terrain.json`: replace `act1.rim.south` with two en-echelon segments (west: inner face y ≈ 0.90, x 0.12–0.45, crest ~50; east: stepped back ~4 km, inner face y ≈ 0.96, x 0.40–0.95, crest ~45; overlap x 0.40–0.48 with a relay low ~40); replace `act1.rim.east` with an inner face carrying two re-entrants (y ≈ 0.30 and 0.62, 5–8 km deep, for the fans of W3) and one spur; vary crests 44–55; move `act1.basin`'s south and east vertices to follow. Keep clear of the acid dome (y ≤ 0.88), the brine pools and the Dead Spring's lower pool (y 0.865) | P7 |
| A2 | MAJOR | **The basin is longer across its master fault than along it.** The floor (h ≤ 36, 663 cells) has its long axis 10° off east–west with an axis ratio 1.78 (≈ 80 × 54 km), while the master escarpment strikes north–south on the west side. A rift basin is long along its axis, with the master scarp along the long side; here the escarpment forms a short side. Not raised in the earlier rounds. | Basins are long along the rift axis (G3); lopsided across it (G1) | PCA of floor cells (this session); W–E transects at y 0.45 / 0.60 (plateau 55–61 → 40 → floor 26–34 → pan 21 → horst 46–48) vs N–S transects (gentle north end, see A4) | No P7 fix: it would change the act's outline or the frame. Options for George below (G-2) | George |
| A3 | MAJOR | **The volcano is a flat table with a shaft** (re-verified, §1 #10), and its south flank falls ~2,000 m onto the salt pan within two cells. | Landmark forms read; a cone, not a mesa or a one-cell shaft (G4, G34); fans between a steep flank and the pan (G16) | 15 cells at h66, 4 at h67, one h18 cell; N–S transect at x 0.85: 63, 66, 66, 66, 66, 66, 63, **41, 21** | `base/`: replace `act1.volcano` (one `set 66`, feather 6) with stacked concentric sets centred (0.84, 0.07), drawn in km (M3): `set 50` r 10 km feather 4; `set 56` r 7 km; `set 61` r 4.5 km; `set 65` r 2.5 km; `set 67` r 1.2 km; then a `raise 3` apron on the south flank between the cone and the pan (r 6–10 km sector, feather 3) so the flank meets the pan through ~24–30 ground. **Drop the 1-cell lava-lake pit** (`act1.water.lava-lake` and `act1.lakes.lava`): a sub-cell crater can't read (G34). Show the lava lake as a `paint_biome` "Lava Lake" (bright, habitability 0) on the summit cell plus the existing marker note; or keep the pit and say so in the handoff (GA4). Marker name and note stay | P7 |
| A4 | MAJOR (story-bearing) | **The north end is a gentle ramp onto the highlands that bypasses the city** (re-verified, §1 #12): 22.4 km at ≤ 13 % vs 24.2 km through the city; at ≤ 10 % only the north route exists. The vault's spine (2026-11-13) says "the way forward is through the city". | Passes sit at the low points of the rim (G29); routes take gentle slopes (G28); the city's control of passage is open (P22) | `paths.py` output in this session; N–S transect at x 0.60: 59, 54, 49, 53, 43, 47, 46, 44, 41, 39, 35 | None until George answers (G-1) | George |
| A5 | MINOR | Escarpment benches: the west wall has one bench (the Slums terrace, h40, ~10 km wide) north of y 0.5 and none south of it, where it drops h58 → h40 in one cell (1,100 m in ~2.3 km) at y 0.60 and h55 → h38 at y 0.75. | The escarpment is a stepped fault system with benches (G2) | W–E transects at y 0.60 and 0.75 | `base/`: two bench sculpts on the west wall south of the city, `set 47` strips ~4 km wide at the wall's foot, x ≈ 0.10–0.14, y 0.52–0.70 and 0.70–0.86 (feather 1.5, edge noise 2), after `act1.basin`, keeping the caravan pass (`act1.caravan-pass`) at 38 | P7 |
| — | fine | Lopsided rift: west lip 1,600–1,940 m, east horst 790–1,020 m; the plateau stands above the land outside the rift (lowland beyond the pass h38, 400 m) (G1, G2). The basin is closed: lowest exit is the SW pass at h38 above a floor of 26–35 and a pan of 21 (P17, G29). Volcano and basalt sit at the basin's NE, as the vault places them (P18); the off-axis position is a recorded vault layout, though no op note says it departs from G4 (add a phrase to `act1.volcano`'s note, K27) | | transects; anchor reads | | |

### 2.3 Water

| ID | Sev | Finding | Rule | Evidence | Fix (ops) | Who |
|---|---|---|---|---|---|---|
| W1 | BLOCKING | **The falls stream runs uphill** for its first 70 km (re-verified, §1 #1). This is the city's and the Slums' only named water (burg notes). | Water runs downhill (G7, K1); a falls needs a graded catchment above it (G13) | River 130's own cells: 58, 56, 57, 60, 55, 58, 57, 56, **53**, 57, 58, 59, **62**, 57, 57, 58, 59, 55, **54**, 57, 59, 60, 59, 60, **61**, 60, 60, 58, 57, 59, 60, 59, 56, 46, 46, 46, 41, 40 | `base/10-act1-terrain.json`, after `act1.roughen.shoulders` and before `act1.basin`: four graded corridors along the stream, ~3.6 km wide, `set` 57 → 56 → 55 → 54 downstream (feather 2, edge noise 1, noise 2): `act1.falls-valley.1`…`.4`, polygons as in `docs/studio/test/round-1/skill/1_review.md` appendix (still valid: the river op is unchanged). The source cell is h58, so the valley must start at ≤ 57 within ~2 km of the source. The lip notch (`.4`, 54) is the falls' cut-back (G13). Re-check: monotonic profile along the river's cells; `finalize_terrain` makes no lake in the valley | P7 |
| W2 | MAJOR | **The falls has no climatic catchment.** The plateau that feeds it gets precipitation **0.0** now (index; Act I mean 0.2) and 0.5 before (Act I mean 1.9): the plateau is drier than the basin, and no generated river forms on it in either era (the before era's falls stream has no tributaries). A permanent stream in a desert basin needs a wetter source. | Permanent water comes from a wetter highland, springs on faults, or the falls' catchment (G11–G13) | `.../work/{now,before}-climate.json`: plateau cells x < 0.1, y < 0.4 | The map can't make local rain (TG3). P7 part: say what feeds it, in the notes Azgaar can carry: `now.burg.upper-camp`, `now.burg.slums` and the region note gain "the falls is fed by springs where the plateau's groundwater meets the master fault, with recharge from the central range (G12); the plateau itself is dry". Propose TG3 `set_cell_climate` to make the plateau's west wetter. Whether the city's water is a spring line (canon-adjacent) is George's | P7 note; George for the water's canon |
| W3 | BLOCKING | **The mineral washes run uphill** (re-verified, §1 #2). | G7, K1, K2 | Profiles in §1 #2 | `base/`, after `act1.washes`: `act1.washes.south.1` (`set 26`) and `act1.washes.south.2` (`set 25`), corridors 2.4 km wide along the main wash's southern limb from (0.535, 0.45) to the teal pool's shore (polygons in the round-1 appendix; they also cover the h34 cell at (0.593, 0.603)). `eras/common/10-water.json`: move `act1.wash.braid` inside the new channel; move `act1.wash.terraces`' points 2–3 to (0.60, 0.47), (0.67, 0.49) in the bench gap. Re-check every wash profile | P7 |
| W4 | BLOCKING | **Three water surfaces are at or below the pan's pools, and one land cell is below the pan** (re-verified, §1 #3–5): acid f surface 19.9 with a h20 land cell beside it; acid c surface 20.9; Dead Spring surface 20.9 (brine 20.9). Cause: the pits' 0.5 km feather and edge noise leave shore cells at 20–21 where the pit meets the pan (f, c) or the hollow (Dead Spring, west shore). | The salt pan and brine pools are the lowest ground, on land and every water surface (P19 approved 2026-11-06, G10) | Lake shores: f min 20 at (0.912, 0.744); c min 21 at (0.881, 0.626), (0.837, 0.647); Dead Spring min 21 at (0.356, 0.770/0.798) | `act1.water.acid.f`: centre (0.895, 0.77) → (0.880, 0.772), radii × 0.85, edge noise 0.8 → 0.5. `act1.water.acid.c`: centre ~(0.845, 0.69) → (0.840, 0.705), radii × 0.85, edge noise 0.5, so its north shore sits on the dome (≥ 22), not on the pan's edge. `act1.dead-spring`: `lower 3` → `set 30` (feather 3) on the same circle, and the two spring pits' `feather_km` 0.5 → 0.3. Update the matching `set_lakes` boxes in both eras. Re-check: no land < 21; only the brine pools at 20.9; every other lake ≥ 21.9 | P7 |
| W5 | MAJOR | **Before era: all the water ends on the acid dome, not the pan** (re-verified, §1 #13), and the terminal pool is a 2-cell **closed freshwater** lake 1 unit above the pan's brine pools. Two more dome pools (Naggarsodoni, Green) are closed freshwater lakes too. | Every river ends at the basin's sink (G8, M7); closed lakes are salt (G9); the pan is the low point (G10) | `.../work/before-lakes.json`, `before-rivers.json`: Ithagroth inlets [120, 175, 24], flux 931, evaporation 9 | P7 part: `eras/before/05-rivers.json` `before.act1.rivers.clear` (`remove_rivers`, frame act1); `eras/before/20-water.json` designed `add_river`s: Slums → the Spring ([0.25, 0.445] … [0.372, 0.775], round-1 appendix) and the Spring's outflow → the pan's south-west arm, after a graded outflow channel in `base/` (`act1.spring-outflow.1–3`, set 28 → 26 → 24, round-1 appendix); `before.lakes.spring.*`: subtype `freshwater` → `salt` (keep group `hot-spring`, so the look is unchanged) — hot mineral springs on a salt dome are not fresh. The size of the before-era lake on the pan is George's (P24, G-3) | P7 drainage; George lake extent |
| W6 | MAJOR | **The before era's lakes are the now era's lakes:** the same 13 lakes, same cells, same extents; only subtypes and paint change. A lush before needs more water, shown by larger lakes. | A wetter era shows it in its water (G14, G26, K31) | `list features` both eras: identical cell counts per lake | Needs a terrain decision (Azgaar only makes lakes below h20; the pan is h21 in both eras): George (G-3) | George |
| W7 | MINOR | Lake count 13, intended 14 (acid a and d merged, §1 #6). **10 lakes carry random culture names** (Bethyr, Hloilaughello, Lithrrhin, Zirradargamor, Fordis, Wetheidielkis, Ithagroth, Naggarsodoni, Dolanen, Green). | Touching pools merge (azgaar-ops); name every lake that matters (M11) | `list features frame act1`, both eras | `act1.water.acid.d`: centre (0.715, 0.795) → (0.715, 0.840), radii × 0.87; its `set_lakes` boxes in both eras follow. Every `set_lakes` op gets `name: "[placeholder] …"` (e.g. "Acid pool a", "Brine pool west"). Re-check: 8 acid lakes, 14 in the frame | P7 |
| — | fine | The pan's brine pools are salt and closed; the teal mineral pool (23.9) and the Dead Spring's lower pool (28.9) sit above the pan; the lava lake is subtype lava; now-era generated rivers are cleared in the frame, and none enter from outside. The falls stream ending at the Slums is designed ("used up", op note; G8's exception) | G9, M7 | lake and river dumps | | |

### 2.4 Ground and climate

| ID | Sev | Finding | Rule | Evidence | Fix (ops) | Who |
|---|---|---|---|---|---|---|
| G-a | MAJOR | **The salt pan meets steep ground with no fan apron**: 18 of the 62 Salt Flats cells (29 %) sit within one cell of ground ≥ h40 (484 m+), along the east horst (x 0.92–0.95, y 0.18–0.87), the south rim (0.65, 0.86), (0.88, 0.88), and the volcano's flank (0.85, 0.21). E.g. y 0.60: 21 → 42 → 47. | Ground runs coarse to fine downslope; fans off every scarp (G16, G17) | Neighbour scan this session | `base/`: `act1.east-fans.1…3`, small `sculpt set 24–27` fans (6–8 km wide, feather 3) at the east re-entrants of A1 and below the volcano (with A3's apron); `eras/now/30-biomes.json`: paint them `Gravel Flats` (heights [22, 30]) after `now.biome.salt` | P7 |
| G-b | MAJOR | **One gravel field covers the west half of the basin** (re-verified): Gravel Flats 356 of 1,350 frame cells (26 %), 270 of 735 basin cells (37 %); the Slums terrace, the Outpost, the Dead Spring's surroundings and the floor between are one colour; the pass is 38 Hot-desert cells. | Region identity; neighbouring zones differ (K16, K6); downslope order (G16); vault critique 2026-11-02 ("too much brown/gravel") | biome counts; `now-act1-biomes.png` | `eras/now/30-biomes.json` after `now.biome.basin-ground`: `now.biome.fans` ("Boulder Fans", darker, heights [35, 43], along the escarpment foot and the pass mouth); `now.biome.mud` ("Playa Mud", heights [28, 31], west of the washes and the dome); `now.biome.pass` over the pass corridor. New names add Gaea masks without touching the hard-coded ones (M9) | P7 |
| G-c | MINOR | **Gypsum dunes lie on the pan floor**: 8 of the 9 Gypsum Dunes cells are at h21, the pan's level (the dunes sit downwind (ENE) of the pavement, which is right). | Dunes sit on the margin downwind of the playa, not on it (G19); gaea.md "dunes on the pan" risk | cell reads | `now.biome.dunes`: heights [20, 27] → [22, 27]; the h21 cells fall to Salt Flats (helps K-a) | P7 |
| G-d | MINOR | The plateau and outer slopes are Azgaar's unpainted Cold desert; the proposed act exit lands on it. | Unpainted ground reads right under Azgaar's climate (M10) | anchor read: exit (0.305, 0.20) h55 Cold desert | George's choice: keep, or paint a dry highland steppe | George |
| — | fine | Downslope order on the main transect (y 0.45): escarpment rock → Slums terrace gravel → gravel → washes → terrace benches → gypsum → salt (G16). Hydrothermal ground stays local to the dome (P19, G21). The before era's green follows water (the falls, the Spring) (G25) | | transects; biome dumps | | |

### 2.5 People

| ID | Sev | Finding | Rule | Evidence | Fix (ops) | Who |
|---|---|---|---|---|---|---|
| P-a | MINOR | The Slums → upper city road has one 18 % leg: (0.272, 0.41) h39 → (0.302, 0.392) h50, 583 m in 3.2 km. | Pack routes under ~13 %, switchback above it (G28) | `now-routes.json` point heights | `now.road.main.ascent`: one more zig — points (0.255, 0.445), (0.29, 0.43), (0.268, 0.415), (0.30, 0.402), (0.275, 0.392), (0.30, 0.375), (0.29, 0.345); note that the switchbacks are zone-scale | P7 |
| P-b | MINOR | The pass floor is a flat trench: the main road runs 46 km at exactly h38 (400 m), so the col has no position. | Passes sit at a low point with ground falling both ways (G29) | road profile | `act1.caravan-pass`: a col at 38 on the rim crest and two `set 36` limbs | P7 |
| P-c | MINOR | The Ruined Outpost (a former caravan waystation) has no water in either era. | Waystations sit at water (G30, G31) | marker at (0.41, 0.51) h35; nearest before-era stream ~10 km | A note only, if George allows a well/cistern on the marker | George |
| — | fine | Slums: on the falls stream's end (0 km); upper city on a shelf 432 m above them, 4.8 km from the falls slot, drawing water upstream (P21, G31). Main approach road ≤ 3 % (G28). Routes show traffic only, no zone-to-zone lines (P16). The before era has no settlements or roads yet (P24 open) | | burg and route reads | | |

### 2.6 Readability and identity

| ID | Sev | Finding | Rule | Evidence | Fix (ops) | Who |
|---|---|---|---|---|---|---|
| K-a | MAJOR | **The salt flats have shrunk to a sliver** (§1 #9: 6.7 % of the floor vs 21 % acid complex), though the vault praised them as "visually successful" and the reference overview gives them the whole eastern floor. | Area shares match the story's weight (K16, P20) | basin counts; `world/reference/act1-overview.jpg` vs `now-act1-biomes.png` | `base/`: widen `act1.salt-pan` (`set 21`) into the north-east arm between the terraces and the basalt (x 0.75–0.85, y 0.20–0.36) and the eastern trough, keeping clear of the dome and gypsum; plus G-c. Target ≥ 12 % of the basin. Re-check: P19 still holds, acid still dominates in chroma | P7 |
| K-b | MAJOR | **Washes and acid ground are near-twins** (§1 #8, ΔE 8.1), and the acid ground (chroma 64) is barely louder than the washes (58). | Colours separate; the signature pops (K11, K16, GA15b, P20) | colour table | `now.biome.washes` color `#B85D23` → `#933A2A` (deeper iron rust): ΔE 30.9 to acid ground, 51 to gravel, chroma 46, so the acid ground becomes clearly louder. The washes touch the escarpment at one edge only (ΔE 12.2) | P7 |
| K-c | MAJOR | **The Fossil Terraces read as speckle and nearly match the gravel**: 28 cells; the h27 belt keeps gravel paint (the terraces anchor itself, (0.72, 0.44) h27, is Gravel Flats); terraces vs gravel ΔE **10.7** across 44 shared edges (new: not in the earlier rounds). | K6, K16 | biome counts, colour table, anchor read | `now.biome.terraces` and `before.biome.terraces`: heights [28, 100] → [27, 100]; colour `#E3D3A8` → `#EEE4C8` (ΔE 18.8 to gravel, 15.4 to dunes, 12.0 to gypsum pavement) | P7 |
| K-d | MINOR | The non-acid teal mineral pool (`#49b3a8`) and the acid-teal pool (`#1FB7A0`) are ΔE 10.7 apart, and the mineral pool sits at the dome's west foot: "saline is not acidic" doesn't read. | K16; vault Blueprint ("not every wet area is acidic") | lake style ops | `act1.style.mineral` fill → a duller blue-grey (e.g. `#5E9A9E`), or `now.style.acid-teal` → more saturated | P7 |
| K-e | MINOR | Four markers carry no `[placeholder]` tag although their names are overview placeholders (Caravan Approach, Acid Pits, Dead Spring; the volcano is "unnamed"). The region note predates the 2026-11-13 spine and no note states the exaggerations (pools, lava lake and Dead Spring 10–100× real size). | P12; G36, G37 | op notes | Add the tag to the three marker notes; region note: a pointer to the spine and "pools, lava lake and Dead Spring are exaggerated for play" | P7 |
| K-f | MINOR | The Dead Spring marker sits 9 km west of its pools, on gravel (h33). | Markers on what they mark | marker (0.31, 0.80) vs pools' centre (0.40, 0.80); paint centroid (0.41, 0.81) | `now.marker.dead-spring` point → (0.40, 0.83) (land, south of the main pool) | P7 |
| — | fine | The acid field dominates the 2D map: amber crust, sulfur crest (chroma 77, the highest ground colour), eight pool polygons in four acid colours (P20). Basalt reads dark and separate (old vs young ΔE 15.6). Labels name landforms, all tagged `[placeholder]` | | `now-act1-biomes.png`; colour table | | |

### 2.7 Era geology

| ID | Sev | Finding | Rule | Evidence | Fix (ops) | Who |
|---|---|---|---|---|---|---|
| E1 | BLOCKING | **Before era: the pan, gypsum and escarpment rock are painted grassland and forest** (§1 #7): 74 + 14 evaporite cells, 135 + 7 escarpment cells, 135 rim cells. Thick evaporites and the rift's rock predate the catastrophe. Knock-on: the before Gaea export has no salt-flats mask, so the pan is unprotected in a before-era Gaea build (protect mask 1.3 % vs 3.0 % now) and erodes differently from the same terrain. | One terrain base, bedrock and evaporites shared (vault LOCKED 2026-11-02 #5; K30, P14) | cell-by-cell biome table; `gaea_check_heights.py` on `before-act1`: "no salt-flats mask … pan checks skipped" | `eras/before/30-biomes.json`: `before.biome.escarpment`, `before.biome.rim-hills` (copies of the now ops, heights [44, 100]); `before.biome.salt` (Salt Flats, pan polygon, heights [20, 23]), `before.biome.gypsum`, `before.biome.dunes`. Keep the floor's grassland where water carries it (P14) but no forest on the pan. How wet the pan was is G-3 | P7 (rock and evaporites) |
| E2 | MINOR | The before era paints the dome as hot-spring travertine ("Spring Terraces") with eight hot-spring pools: a reasonable draft, but it answers an open question (whether the hydrothermal field predates the machine, P24) without a note. | Never settle canon through geography (P7, P24) | `before.biome.travertine`, `before.lakes.spring.*` | Add `[provisional, P24 open]` to the ops' notes and a marker note on the dome in the before era | P7 (note), George (answer) |
| — | fine | Heights identical in both eras (0 of 44,650 cells); basalt and fossil terraces keep their paint in both eras (K30) | | | | |

### 2.8 Gaea (export pre-flight; review.md §2 check 6)

Command: `python3 .claude/skills/arpg-cartography/scripts/gaea_check_heights.py --export world/build/gaea/now-act1 --terrain tools/gaea/act1.terrain`
(JSON: `.../review/gaea_preflight_now.json`). **Exit 0: 4 passed, 0 failed, 7 warnings, 8 notes.**

- PASS export files (25 masks, all present); PASS Terrain Height 8,546 m = 2 × heightMetres 4,273 m; PASS Terrain
  Width 128,000 m; PASS graph inputs (the File nodes read 4 files).
- Pan: flat salt core 10,151 px; min 4.0 m, median 9.5 m, p95 25 m, max slope 2.0°; "no land outside the pan is below
  it; 257 px tie with the pan's lowest 4.0 m".
- Warnings: two acid pools at or below the brine level 9.0 m: (792, 602) 9.0 m = acid c; (822, 650) 7.8 m = acid f
  (matches W4); lakes not flat in the export: Dead Spring (417, 657) 9.0 m with 23.3 m spread, teal pool (614, 567)
  36 m, Dead Spring lower (474, 690) 121 m, acid pools (715, 585), (728, 620).
- Mask coverage (now-act1): no mask empty; Acid Pits 1.7 %, Salt Flats 1.6 %, acid lakes 0.8 %, washes 0.2 %.
- Same pre-flight on `before-act1` (extra): 4 passed, 2 warnings: `mask-lakes-acid` and `mask-roads` empty (expected:
  no acid groups or roads before), and no salt-flats mask (E1).

| ID | Sev | Finding | Rule | Evidence | Fix | Who |
|---|---|---|---|---|---|---|
| GA-a | MINOR | **The export's heights come from Azgaar's 3D erosion bake, which cuts the pan's east trough below the brine pools:** 5,046 land px (~79 km²) are below the pools' 9 m (2,969 salt-flats, 51 acid-pits, 2,026 other, mostly x 0.88–0.94, y 0.4–0.6), down to 4 m. On the map itself only one cell is below the pan (W4). | Flag map problems seen through Gaea, don't hide them in Gaea (GA4); pan lowest (P19) | numpy read of `heightfield.r32` with `mask-water` and the biome masks (this session); `session.ts` `sampleHeights` uses `View3d.heightAt(…, 82)` | A tool change, not an op: `export_gaea` should take protected ground (water, lakes, salt pan) from the map's own heights, not the bake (propose as a TG gap alongside gaea.md's export additions). In the Gaea graph meanwhile: restore protected ground from a shrunk protect mask (gaea.md §5 step 6) | Proposal for George (new tool behaviour) |

### 2.9 Studio: the zone graph (step 3)

`docs/studio/test/round-1/skill/act1.json` copied to `.../review/act1.json`; run:
`node .claude/skills/arpg-cartography/scripts/zone_graph.mjs <abs path> --md .../review/act1_zone_graph.md --json .../review/act1_zone_graph.json`.
**Exit 0: "No problems: every zone is linked and every anchor is inside the frame."** The round-1 rounding bug
(`40.60000000000002°`) is gone: bearings print as 40.6°.

**Anchors against today's map** (nearest cell):

| Zone | Anchor | Cell now | Check |
|---|---|---|---|
| z01 Caravan Approach | (0.06, 0.80) | h38 400 m, Hot desert (unpainted pass) | = `now.marker.caravan` ✓ |
| z02 Slums | (0.255, 0.445) | h41 529 m, Gravel Flats | = burg ✓ |
| outpost | (0.41, 0.51) | h35 289 m, Gravel Flats | = marker ✓ |
| washes | (0.56, 0.45) | h26, Mineral Washes | paint centroid today (0.576, 0.46) ✓ |
| deadspring | (0.40, 0.80) | h31, Dead Spring | paint centroid (0.41, 0.81) ✓; the marker is 9 km west (K-f) |
| acid | (0.76, 0.73) | **water** (acid pool h) | Acid+Sulfur centroid (0.762, 0.727) ✓; an anchor in a pool is fine for bearings |
| salt | (0.89, 0.52) | h21, Salt Flats | centroid (0.885, 0.513) ✓ |
| terraces | (0.72, 0.44) | **h27, Gravel Flats** | the terrace belt's unpainted h27 (K-c); paint centroid (0.688, 0.435) |
| basalt | (0.69, 0.20) | h38, Old Basalt | centroid (0.692, 0.222) ✓ |
| volcano | (0.84, 0.08) | the lava-lake cell (h18) | marker at (0.84, 0.10) ✓; moves if A3 drops the pit |
| uppercity | (0.29, 0.345) | h49 961 m, Rift Escarpment (the shelf) | = burg ✓ |
| exit | (0.305, 0.20) | h55 1,369 m, Cold desert | proposed only: the road op it cites (`now.road.main.escarpment`) is **not on the map** |

No anchor moved since the file was written; no fix above moves one except A3 (volcano marker only) and K-f (the Dead
Spring marker, not the zone anchor). After W1/W3/A1 the graph should be re-run (H6), but bearings won't change.

**Graph checks (world-to-zones H7–H11)**, from the computed bearings:

| Check | Result | Detail |
|---|---|---|
| H7: a two-link zone's entrance and exit differ by ≥ 90° | **1 FAIL** | Salt Flats: in from the terraces at 286.8° (return bearing), out to the acid pits at 224° → only **62.8°** apart: entrance and exit on the same (west/south-west) side. Passes: outpost 150.6°, Dead Spring 115.4°, acid 141.1°, terraces 160.9°, basalt 156.2°, upper city 160.5° |
| H8: a hub's connections ≥ 45° apart | **1 marginal FAIL** | Slums (4 links: 28.7° upper city, 105° outpost, 147.5° Dead Spring, 220.6° caravan): outpost vs Dead Spring **42.5°**. Mineral Washes (3 links: 39.1°, 87.7°, 255.6°) pass |
| H9: successor bearing in 180–270° is down-screen | **1 flag** (+ returns) | Salt Flats → Acid Pits **224° SW**. Return legs also run down-screen: upper city → Slums 208.7°, Slums → caravan 220.6°, basalt → washes 219.1°. The likely start (caravan → Slums 40.6° → outpost 105° → back 285° → Dead Spring 147.5° → acid 82.9°) has no down-screen forward leg |
| H10: tall landforms on a zone's south or west (camera side) | **5 zones flagged** | Max rise within 12 km: caravan W +1,364 m (plateau), S +561 m; Slums W +840 m (escarpment); upper city W +888 m; Dead Spring S +792 m (south rim), W +560 m; acid pits S +784 m (south rim). Basalt's tall mass (volcano +2,001 m) is E: fine. Known Act I case (world-to-zones) |
| H11: every biome change across a connection has a physical reason | **pass, 1 artefact** | Every change sits on a height break or landform edge (escarpment step, wash channel, gypsum step, dome edge, flow edge). The one without a reason: washes → terraces crosses Fossil Terraces h30–28 then **Gravel Flats h27** inside the belt: the paint threshold, fixed by K-c |

### 2.10 Required checks for a pass (review.md §2)

| # | Check | Status today |
|---|---|---|
| 1 | Both eras built from the ops, no failed op, no `pageErrors` | **PASS** (§0) |
| 2 | Before/after evidence: frame and full-map screenshots, 3D views, vs the reference | **Present** for both eras (`world/build/screenshots/{now,before}-*.png`, `-3d*.png`, `review-*.png`); compared with `world/reference/act1-overview.jpg` (salt share K-a, colours K-b; the reference's long north–south feel vs A2) |
| 3 | Lake count in the frame vs the intended list | **FAIL**: 13 vs 14 (a+d merged), 10 random names (W7) |
| 4 | Lowest ground | **FAIL**: one land cell h20, acid f below the brine, acid c and the Dead Spring level with it (W4); export bake 79 km² below the pools (GA-a) |
| 5 | Drainage, per era | **FAIL**: falls and washes uphill (W1, W3); before era ends in the dome (W5). Now era otherwise designed |
| 6 | Gaea masks not empty | **PASS** now; before has no salt/acid masks by design of its paint (E1) |
| 7 | Zone graph re-run | **Run**: exit 0; H7–H11 results above |
| 8 | `npm run smoke` | Not run: no tool changed |

---

## 3. What checked out fine (one list)

- Both builds replay every op cleanly; heights identical across eras (0 / 44,650 cells).
- Continent: one landmass, ocean all round, ranges in belts, every trunk river ends in the sea or a lake (only the
  Slums falls ends on land, by design), climate belts coherent with latitude and the south-westerlies, desert interior
  now (69 %), wetter before.
- Act I is closed (lowest exit h38 at the SW pass), lopsided (west 1,600–1,940 m vs east 790–1,020 m), the plateau stands
  above the land outside, the pan (h21) is the lowest land apart from one feather cell.
- Brine pools salt and closed; mineral and Dead Spring lower pools above the pan; lava subtype on the lava lake;
  now-era rivers cleared in the frame.
- Downslope order on the main transect; gypsum dunes downwind (ENE) of the pavement; hydrothermal ground local to the
  dome; acid field the most saturated thing in 2D, sulfur crest chroma 77.
- City on a shelf 432 m above the Slums at the falls (P21); Slums on the stream's end; approach road ≤ 3 %; routes show
  traffic only; every label tagged `[placeholder]`.
- Zone graph script: exit 0, no problems; bearings print cleanly; anchors match their ops and paint centroids.
- Gaea pre-flight: files, Terrain Height (2 × 4,273 m) and width pass; no empty mask in the now export.

---

## 4. P7 fixes I'd make without asking vs decisions for George

### Without asking (P7: geographic sense, fits the wasteland theme, looks good, settles no canon)

Two map passes, each built for both eras with before/after 2D, 3D and Gaea evidence:

1. **Terrain and water pass** (all `base/` edits in one PR, since any terrain change replays everything after it, M5):
   W1 falls valley; W3 wash channels and route points; W4 pool and hollow fixes; W7 pool d split and pool names; A1
   en-echelon south rim and east re-entrants; A3 stacked volcano cone, south apron, lava lake as paint; A5 two
   escarpment benches; G-a east and volcano fans; K-a wider salt pan; P-b pass col; W5's drainage part (spring outflow
   channel, before-era `remove_rivers` + designed rivers, dome pools `salt`). Checks: lowest ground, lake count and names,
   river and wash profiles, edge scan, zone graph re-run.
2. **Ground, colour and notes pass** (era ops only): E1 before-era rock and evaporite paint; C1 rim paint following the
   crest with a fade ring; G-b fans, playa mud, pass paint; G-c dunes off the pan; K-b wash colour `#933A2A`; K-c
   terraces [27, 100] and `#EEE4C8`; K-d mineral pool colour; K-e marker tags, region note (spine pointer, exaggeration);
   K-f Dead Spring marker; P-a extra switchback; W2's note on the falls' spring source (wording only, see below); E2
   provisional notes; the volcano's G4 note.

### Decisions for George (plain prose; options and consequences)

- **G-1. Does the city control the way out?** (A4; P22; the 2026-11-13 spine says "the way forward is through the
  city".) Today the north end is the gentlest climb onto the highlands, 22 km at ≤ 13 % and nowhere near the city.
  (a) Canon only: the city's ramp is the route with water and a graded road; the north end is dry, longer from the
  Slums and slaver country. No map change. (b) Terrain: raise the north rim between the plateau and the volcano into a
  continuous scarp (h ≥ 52) so the city's ramp is the only practical climb; a large change to the region's north edge
  and to the basalt zone's surroundings. (c) Law and patrols (canon, no map change).
- **G-2. Should the rift run north–south beyond the act?** (A2.) The basin is wider across its master fault than along
  it. (a) Accept it as a short, wide rift segment and say so in a note (cheapest). (b) Continue the rift as a narrower
  graben north and south outside the frame, so Act I is one basin in a longer north–south rift; it reads at continent
  scale, blends the act into the continent (P17) and could give Act II a direction. (c) Reshape the frame (moves anchors).
- **G-3. How wet was the basin before?** (W5, W6, E1; P24 the old salt lake's extent.) Azgaar makes lakes only below
  h20 and the pan is h21 in both eras. (a) Era-specific terrain lowering the before pan to h19: a real lake, but breaks
  one-terrain (P14). (b) One terrain; paint the before pan as a wet salt marsh with seasonal water, stated in a note
  (G37). (c) A playa in both eras, with the before era's water in the Spring, the falls and the outflow only.
- **G-4. What feeds the falls?** (W2.) The plateau has no rain in either era. Is the city's water a spring line on
  the master fault (P7 wording, my suggestion), meltwater from the central range, or something tied to the machine? Or
  should the world's climate change (M10)?
- **G-5. Camera-side relief** (H10): the escarpment lies west of the caravan pass, the Slums and the upper city; the
  south rim south of the Dead Spring and the acid pits. Bend the walls to read as north walls (P8), cut or fade them
  (level design N9), or enter so they're behind the player?
- **G-6. Graph failures** (H7, H8, H9): Salt Flats' entrance and exit 63° apart; the Slums' outpost and Dead Spring exits
  42.5° apart; Salt → Acid runs down-screen (224°). Options: move the salt anchor north-east (e.g. (0.91, 0.40), a map
  change P7 allows since it settles no canon: H7 then passes); route the acid pits from the Dead Spring only and make salt
  a spur; or accept and let level design mirror or switchback.
- **G-7. Smaller ones:** the Ruined Outpost's water (a well note?) (P-c); paint the plateau or keep Azgaar's cold
  desert (G-d); whether the before era's hot-spring dome stands (E2, P24); approve `export_gaea` taking protected ground
  from map heights (GA-a), and the TG1/TG2/TG3 tools (four BLOCKING findings here came from profiles that need `run_js`).
