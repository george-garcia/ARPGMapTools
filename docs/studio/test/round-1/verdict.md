# Verdict: run X vs run Y (Act I cartographer tasks)

Judged blind against `TASKS.md`, `judge/rubric.md`, the vault, the repo ops (`world/`, HEAD clean, no `world/` change
since the commit Y cites), the build screenshots and the cell dumps `judge/data/now.json` and `before.json`. The dumps use
map pixels, and I converted them to `act1` frame coordinates with `frames.json` and `config.json`: u = (x − 668)/200,
v = (y − 616.4)/128. Heights are Azgaar units, metres = (h − 18)². My scripts are in
`/tmp/claude-0/-home-claude/7caafd89-0678-50ce-9389-72eb5e6ae44d/scratchpad/judgework/` (`q.py`, `prof.py`, `path.py`).

## Scores

| Task | Run | Geography /3 | Fidelity /3 | Usefulness /3 | Craft /1 | Total /10 |
|---|---|---|---|---|---|---|
| 1 Review | X | 1 | 3 | 2 | 1 | **7** |
| 1 Review | Y | 3 | 3 | 2.5 | 1 | **9.5** |
| 2 Change request | X | 2.5 | 3 | 2.5 | 1 | **9** |
| 2 Change request | Y | 2.5 (the ramp op overlaps the shelf, gap Y-9) | 3 | 3 | 1 | **9.5** |
| 3 Handoff | X | 2 | 2 | 2.5 | 1 | **7.5** |
| 3 Handoff | Y | 3 | 3 | 2.5 | 1 | **9.5** |
| **Overall** | X | 1.5 | 2.5 | 2.5 | 1 | **7.5** |
| **Overall** | Y | 3 | 3 | 2.5 | 1 | **9.5** |

**Y is better overall and on all three tasks.** Task 1 shows the biggest difference: Y found four BLOCKING physical
errors, and X missed all of them while stating that drainage was correct. Task 2 is close. Both runs push back on "the
only way out" for the same reason, and on the same evidence. Task 3 favours Y for level design (graph checks, return
bearings, a machine-readable zone file). X is stronger for environment art: photo hooks, palette, sun angles and skyline
angles.

## 1. Fact checks

### Run X

| # | Claim | Verdict | Evidence |
|---|---|---|---|
| X1 | "Drainage is right"; "the salt pan is the lowest land (h21)" (review verdict and "Checked and fine") | **WRONG** | The falls stream climbs to h61 before it falls (Y1). The main wash climbs from h26/27 to h33 (Y4). One land cell is h20 at (0.912, 0.744), below the pan. The Dead Spring's lowest shore is h21, the same level as the pan. |
| X2 | The acid complex covers 21 % of the 735 basin-floor cells (Acid Pits 74, Sulfur 37, ~43 lake cells) against 7 % salt (49); gravel is 270 (37 %) | **CONFIRMED** exactly | Point-in-polygon on the `act1.basin` op gives 735 cells: Gravel 270, Acid Pits 74, Salt 49, Sulfur 37 and 66 lake cells. |
| X3 | Washes `#B85D23` and acid ground `#C8661E` are nearly the same colour | **CONFIRMED** | `now.biome.washes` and `now.biome.acid` ops. In `now-act1-biomes.png` they touch at the teal pool. |
| X4 | The north end leaks onto the plateau via (0.55, 0.29) → (0.52, 0.13) → (0.51, 0.01) → (0.48, −0.07) | **CONFIRMED** (substance) | Heights along that line are 32 → 43 → 44 → 56. My grade-limited shortest path (≤ 13 %, shelf banned) reaches the plateau at exactly (0.48, −0.07), at 54 km. X's 76–79 km is not reproduced, but the order of magnitude matches. |
| X5 | Through the upper city, "keeping every step under 10 %", the route onto the plateau is 13–20 km | **WRONG** (not reproducible) | Cell to cell, the climb from the Slums terrace (h40, 484 m) to the shelf (h50, 1,024 m) exceeds 10 % even via the falls slot (h46). At a 10 % limit every route goes round the north (56 km). The city route appears only at 13 % (24 km). X then argues from a 4–6× advantage that rests on this number. |
| X6 | Ravine ramp: (0.31, 0.30) h50, (0.31, 0.25) h53, (0.31, 0.20) h55, (0.32, 0.16) h55, (0.32, 0.12) h57; ~560 m over 14 km | **CONFIRMED** | `near()` lookups give exactly these values, and 961 → 1,521 m is 560 m. |
| X7 | The west wall is a single-cell cliff, h58 → h40 at v 0.60 | **CONFIRMED** | v 0.60: u 0.12 is h58 and u 0.13 is h40. |
| X8 | The volcano is a flat h66–67 table with one h18 cell for its lava lake | **CONFIRMED** | Within 8 km of (0.84, 0.07), 19 cells are h66–67 and one is h18. |
| X9 | Acid pools a and d merged into one 19-cell lake | **CONFIRMED** | Feature 81, "Wetheidielkis", 19 cells. |
| X10 | The Slums are 432 m below the upper city | **CONFIRMED** | Burg cells are h41 (529 m) and h49 (961 m). |
| X11 | Stray Hot-desert cells at (0.17, 0.40), (0.34, 0.32), (0.43, 0.30) and (0.50, 0.21) | **CONFIRMED** | All four are present. |
| X12 | Upper city → escarpment top bearing 9° | **WRONG** by 2° | From X's own anchors, (0.29, 0.32) → (0.315, 0.12), the bearing is 11.0°. This is within level design's 45° tolerance, so it is harmless. |
| X13 | Before era: the washes are drawn in both eras and the rivers end in the dome's hot-spring pits | **CONFIRMED** | `before.json` routes are 3 wash routes. The dome lakes are `freshwater`/`hot-spring`. See `before-act1-biomes.png`. |

### Run Y

| # | Claim | Verdict | Evidence |
|---|---|---|---|
| Y1 | The falls stream runs uphill across the plateau and lip: 1,225 → 1,521, 1,296 → 1,521 and 1,521 → 1,849 m (h53 → 61) | **CONFIRMED** | Profile along `act1.river.falls`: 58, 56, 57, 60, 55, 58, 57, 56, **53** (14.7 km), 57, 58, 59, 57, 58, 59, 55, **54** (32 km), 57, 59, 60, 59, 60, **61** (41 km), 60, 58, 59, 59, 56 → 46 at the slot. The stream climbs about 550 m. |
| Y2 | Before era: the 88 cells that are Salt, Gypsum or Dunes now are 74 Grassland and 14 Temperate deciduous forest | **CONFIRMED** exactly | Same cell ids in both dumps. This contradicts vault LOCKED 2026-11-02 #5 (the quote is accurate). |
| Y3 | A land cell at h20 sits beside acid pool f at (0.912, 0.744); the Dead Spring's lowest shore is h21 at (0.356, 0.77) and (0.356, 0.798) | **CONFIRMED** exactly | Shore scan: Dolanen (86) has a minimum shore of 20 at (0.912, 0.744). Dead Spring (84) has a minimum of 21 at both quoted points. |
| Y4 | The main wash climbs 64 → 225 m between (0.535, 0.45) and (0.55, 0.52); the braid climbs 64 → 144 m; the terraces branch crosses the h30 bench | **CONFIRMED** | Main wash: h27 → **33** → 30. Braid: 26 → 30. Terraces branch: 26 → **30, 30** → 26. |
| Y5 | Heights are identical in both eras (0 of 9,990 cells differ) | **CONFIRMED** | Diff is 0. |
| Y6 | The pan meets the horst in one cell at y 0.6 (21 → 42 → 47) | **CONFIRMED** | 21 at u 0.93, 42 at 0.94, 47 at 0.96. |
| Y7 | The east and south margins are near-straight (std 1.4 km and 0.85 km) | **CONFIRMED** (substance) | My edge scan gives 1.2 km and 1.7 km. Both are under one cell. |
| Y8 | Gravel is 356 of 1,350 frame cells (26 %); Fossil Terraces are 28 cells; the h27 belt keeps the gravel paint | **CONFIRMED** | Exactly; 12 belt cells at h27 are Gravel Flats. |
| Y9 | Ramp notch at x 0.30–0.32: h53, then 55, with the lip at 58–62 on either side and a stray h60 cell at (0.30, 0.27) | **CONFIRMED** | Rows v 0.26–0.20 read 53/53/53 → 55/55/55, flanked by 59–62 and 58. (0.30, 0.27) is h60. |
| Y10 | Upper city → exit bearing 9.2° | **CONFIRMED** | (0.29, 0.345) → (0.305, 0.20) gives 9.2°. Y's other bearings check too, for example Slums → upper city 28.7°. |
| Y11 | Through the city ≈ 21 km at ≤ 13 %; north corner ≈ 65 km | **CONFIRMED** (approximately) | My figures are 24 km and 54 km. |
| Y12 | The upper city is "~540 m above" the Slums, with the Slums at ~480 m | **WRONG** (minor) | That is the terrace-op value against the shelf-op value. The burg cells are 529 m and 961 m, a 432 m step. Y is inconsistent with its own burg anchors. |
| Y13 | The Slums → upper city switchback's steep leg is 18 % | **UNVERIFIABLE** as stated | The cell-to-cell step is > 10 % (consistent), but I can't reproduce the 3.2 km figure. |
| Y14 | The Ruined Outpost is ~10 km from the before era's nearest stream | **UNVERIFIABLE** (likely overstated) | In `before-act1-biomes.png` a generated stream passes about 5 km north-east. |

**Consequential findings one run caught and the other missed**

- **Y only:** the falls stream runs uphill (BLOCKING; it is the city's only water). The washes run uphill (BLOCKING).
  Land sits below the pan and the Dead Spring is at pan level (the approved 6 Nov fix is broken). The before-era
  evaporites are painted grassland and forest (locked #5). Y also caught the hub-exit spacing, the down-screen link and
  the camera-side walls in the zone graph, the pan-to-horst step with no apron, the terrace speckle, and the flat pass
  with no col.
- **X only:** the acid ground and the washes share one orange, and the salt pan has shrunk to 7 % of the floor. These
  matter because the author wants the acid to "really stand out" and praised the salt flats as "visually successful"
  (X's quotes are accurate). X also caught the volcano as a flat mesa with a one-cell shaft, and the label placements.
- **Both:** the north-end leak, the rectangle, the gravel monotony, the unpainted pass, the merged pools, the abandoned
  route via the falls slot as George's call, and the before-era washes and river ends.

## 2. Per-task notes

**Task 1, Review.**

- X's findings are concrete and its vault quotes are accurate. However, it certifies "drainage is right" and "the pan is
  the lowest land" when four BLOCKING drainage and lowest-ground faults are on the map. Its readability findings
  (colour clash, salt share, volcano) are good and verified.
- Y profiled every drawn line and scanned every lake shore. Every BLOCKING claim it makes reproduces exactly. It gives
  ready-to-paste JSON for the terrain fixes, and correctly separates P7 fixes from the questions for George.
- Y loses half a point on usefulness for opaque internal rule ids and for missing the readability points the author
  explicitly cares about.

**Task 2, Change request.**

- Both runs accept the road and refuse "only way out" as unsupported geography and open canon (vault 2026-11-03 and
  Slaver Faction Q5). Neither draws a before-era road. Both do this correctly.
- X:
  - Its road vertices sit on the ramp, but the profile wobbles: 49 → 50 → 48 → 50 → 54 → 53 → 55 → 57.
  - Its central quantitative claim, the 10 % city route, isn't reproducible.
  - It doesn't connect the request to the falls water.
  - Its strengths: clean JSON, an exit marker, option B as ready ops with the lava-chronology consequence for canon
    made explicit, and the useful "past" → "through" correction.
- Y:
  - Its road is monotonic (49 → 50 → 53 → 55 → 55).
  - It adds a terrain op that removes the noise cell blocking the notch.
  - It carries the decision downstream: a new graph node and bearing, and the H7 check.
  - Its op `act1.city-ramp.lower` overlaps the shelf's north edge (v 0.295–0.32) and raises it from 50 to 52 there.
    Y doesn't mention this.

**Task 3, Handoff.**

- X:
  - It is environment-art-friendly: photo hooks per zone, palette hex codes, latitude and sun angles, skyline angles,
    and decay causes.
  - It has no graph checks, so it misses hub exits 41° apart and the Salt → Acid link at 217° (down-screen). It gives
    no return bearings or zone file.
  - It repeats the "drainage right" error.
  - It builds decay causes on Azgaar-generated placeholder rivers: the Caravan Approach's "dead riverbed", and the
    Outpost as a "watered stage".
- Y:
  - Each zone sheet covers both disciplines: anchor, neighbours, edges by side, camera-side flags, ground, water, before
    and now, and what is open.
  - It ships the zone graph as computed JSON and markdown with H7–H11 checks, and tags every fact with a source.
  - It lacks environment art's hooks, palette and lighting facts.
  - Its graph markdown ships float-noise bearings (`40.60000000000002°`), even though Y diagnosed that rounding bug
    itself.

## 3. Gaps, ranked (most important first)

### Run X

1. **The falls stream runs uphill and the review missed it.** It climbs from h53/54 to h61 on the plateau before the
   falls, and it is the upper city's and the Slums' only water. Add a graded valley in `base/10-act1-terrain.json`
   after `act1.roughen.shoulders`: stepped `sculpt set` corridors 57 → 54 along `act1.river.falls`. Then re-profile.
2. **The washes run uphill.** `act1.wash.main` goes h27 → 33 at (0.535, 0.45)–(0.542, 0.485). The braid goes
   26 → 30. The terraces branch crosses the h30 bench. Carve the southern limb (`sculpt set 25–26`) down to the teal
   pool, move the braid inside the channel, and route the terraces branch through the bench gap.
3. **The lowest-ground rule is broken and the review certified it.** There is an h20 cell at (0.912, 0.744) beside
   pool f, and the Dead Spring's shore is h21. Move or shrink `act1.water.acid.f`. Replace the `act1.dead-spring`
   `lower 3` with a `set ~29`. Scan every lake's lowest shore before claiming the sink is right.
4. **The before era paints old evaporites as grassland and forest** (88 cells: 74 grassland, 14 forest), against locked
   #5. Add `before.biome.salt`, `.gypsum`, `.escarpment` and `.rim-hills` paints. Leave how wet the pan was to George.
5. **The handoff has no zone-graph checks.** Hub exits to the Outpost (109°) and the Dead Spring (150°) are 41° apart.
   Salt → Acid (217°) runs down-screen. Add return bearings, the H7–H9 checks and a machine-readable `act1.json`.
6. **The grade claim isn't reproducible.** The "under 10 % via the city, 13–20 km" figure can't be reproduced, because
   the Slums → shelf step is > 10 % cell to cell. Re-run it with a stated neighbour rule, report the switchback's
   steep leg as a finding, and restate the 4–6× advantage.
7. **Placeholder rivers are used as canon.** Don't base decay causes or former uses on Azgaar-generated rivers (the
   Caravan Approach's "dead riverbed", the Outpost's "watered stage"). Tag them [generated] or OPEN.
8. **Small factual slips.**
   - Upper → exit is 11°, not 9°, from X's own anchors.
   - The Caravan Approach's "camera-side west and north walls": north is the far side under a north-east camera.
   - "Salt flats … where every wash ends": the main wash ends at the teal pool and the branch ends on gypsum.
9. **Missed minor terrain.**
   - The pan meets the horst in one cell, with no apron.
   - The terrace belt at h27 keeps the gravel paint, so the terraces read as speckle.
   - The pass is a flat h38 trench with no col.
   - The road's escarpment profile dips from 50 to 48 before climbing.

### Run Y

1. **Missed the acid and wash colour clash and the salt's lost share.** `#B85D23` and `#C8661E` touch at the teal
   pool. Salt is 49 of 735 basin cells against 154 for the acid complex. The author wants the acid to "really stand
   out" and praised the salt flats. Y listed "the acid field dominates" as working. Recolour `now.biome.washes` (redder
   and darker), check it in greyscale, and reconsider how far the amber ring reaches.
2. **Missed the volcano's form.** `act1.volcano` sets a flat h66–67 disc with a one-cell shaft, yet the handoff calls
   it a stratovolcano. Rebuild it as stacked concentric sets and show the lava lake as a biome, not a sea-level pit.
3. **Environment art is under-served in the handoff.** Add per zone:
   - one real-world photo hook;
   - the map's palette hex codes, so ground families can be told apart;
   - the latitude and sun angles for lighting;
   - skyline elevation angles to the volcano and the city.
4. **Opaque rule ids.** G7, K1, P7, H10, M5 and TG2 appear throughout, and George and the consumers can't resolve them.
   Gloss them once, or cite the vault date or quote instead.
5. **Float-noise bearings.** `act1_zone_graph.md` prints `40.60000000000002°`. Round before publishing, since Y found
   the bug itself.
6. **Height anchors are inconsistent.** Y says the Slums are ~480 m and the upper city ~540 m above them, while the
   burg cells give 529 m and 432 m. Quote one anchor convention (burg cell or op value) and keep to it.
7. **The handoff describes the map "as it should read after fixes".** Each pending fact must carry [pending] inline, as
   some do, or a level designer may build on unbuilt geography.
8. **Labels aren't reviewed.** "Rift Escarpment" sits on the plateau 12 km behind the face, and "Mineral Washes" lies
   over the dashed channels.
9. **The change request's `act1.city-ramp.lower` overlaps the shelf.** It covers v 0.295–0.32 and raises the bench's
   north edge from 50 to 52. Trim the polygon to start at the shelf's edge, or state the effect.
10. **"Ruined Outpost ~10 km from water" is probably overstated.** It looks about 5 km on the before render. Measure it
    before asking George.

## 4. What X should learn from Y

1. **Profile every drawn water line against the cells before judging drainage.** Do it for rivers and dashed washes
   alike, and never write "drainage is right" without a monotonic profile.
2. **Scan every lake's lowest shore and the frame's minimum land height.** The approved "pan is the lowest ground" fix
   is a hard check, not something to take on trust.
3. **Diff the eras cell by cell against locked geology.** Rock and evaporites can't change between eras, and a biome
   count on the same cell ids finds that at once.
4. **Treat the zone graph as a computed, checked artifact.** Give return bearings, height steps, hub-exit spacing,
   down-screen and entrance/exit separation checks, and camera-side wall flags, in a JSON level design can load.
5. **Source-tag every handoff fact and mark generated content OPEN.** Never turn an Azgaar-generated placeholder into a
   decay cause or a former use.

(Y in turn should take from X: colour and contrast checks against the author's stated priorities, landform shape
checks such as the volcano, and the environment-art layer of the handoff: hooks, palette, light and skyline angles.)
