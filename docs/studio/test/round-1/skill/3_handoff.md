# Act I: world map handoff (draft)

**Owner:** the cartographer (`arpg-cartography`, ARPGMapTools). **Map at:** ARPGMapTools `d9872f9` ops; builds of
2026-11-06 (`world/build/now.map`, `before.map`), read through the MCP server · **Vault read at:** test copy,
2026-11-13 (README map sections; Act I spine 2026-11-13) · **Updated:** 2026-11-13 · **Status:** draft for George; in
test mode not delivered to the ARPG repo (proposed path, George's call: `Docs/Act 1 scenes/_act1_map.md`).

What the world map decides for Act I, for level design and environment art: which zones connect and in which
direction, and what each zone physically is, before and now. Story, quests and names are the narrative role's (the
vault); layouts, art and light are the specialists'. **OPEN** means not decided: don't build on it as fact, ask George.
Every fact names its source: **[vault …]** a vault decision, **[P…]** George's decisions as numbered in the
cartographer's skill, **[op …]** a map op, **[map]** a measurement on the 2026-11-06 build, **[INFERRED]** my reasoning.

**Read with the review (`1_review.md`).** Four BLOCKING map fixes are pending; three touch zones here (the falls stream
that waters the Slums and the city, the Dead Spring's depth, the washes' flow). Sheets below describe the map **as it
should read after those fixes** where a fix changes a fact, and say so.

## 1. The region in one paragraph

A closed rift basin about 100 km rim to rim, modelled on the Danakil Depression and Dallol **[vault Blueprint
LOCKED 2026-11-02; P17]**. A 1,600–1,850 m escarpment walls the west and north-west **[map]**; the city's upper city sits
on a bench in it (~1,000 m) and its Slums on the fan below (~480 m), beside a falls **[P21; op now.burg.*]**. The floor
steps down eastward, coarse to fine: gravel fans and floor (170–290 m), the iron-stained washes and fossil-reef
terraces (60–150 m), gypsum, then the white salt pan on the east floor at ~10 m, the basin's lowest ground, against a
lower east horst (800–960 m) **[P18, P19; map]**. A low hydrothermal dome at the pan's southern edge carries the acid
pools **[P19, P20]**; an active volcano and its black flows close the north-east **[vault 2026-11-03]**. Present day:
a drought-struck, hazardous wasteland **[vault 2026-11-05; op now.drought]**. The journey **descends** from a pass in
the south-west rim onto the terrace and into the basin, works outward across the floor and back to the hub, and ends
**climbing** through the upper city and up the escarpment toward the plateau **[vault spine 2026-11-13; H14]**.
**The one image:** the falls dropping past the walled upper city on its bench above the Slums, with the acid field's
colours and steam far off on the floor **[vault overview, P6: inspiration only; INFERRED]**.

## 2. The act at a glance

**Journey (vault):** 01 caravan escape (tutorial) → 02 Slums (hub) → regional zones, likely Ruined Outpost → back to the
Slums → Dead Spring → Acid Pits, then unknown **[vault README 2026-11-05, "likely start"]** → the leader's betrayal in an
abandoned upper-city district → several upper-city combat zones → Act I boss → passage beyond into Act II **[vault spine
2026-11-13, confirmed progression; staging provisional]**. How the player moves between zones (walking connections,
waypoints from the hub) is OPEN **[P16]**.

**Height profile along the journey [map]:** pass 400 m → Slums terrace 480 m → floor 170–290 m (outpost, Dead Spring) →
dome 40–80 m (acid) … → upper city 1,000 m → escarpment top 1,230–1,370 m. Down into the basin first, up and out at
the end.

**Clusters (biome regions) [op now.biome.*; map]:**
1. **Escarpment foot:** Caravan Approach pass, Slums, upper city, exit ramp. Red-brown escarpment rock, fan gravel, the
   falls' green strip.
2. **West floor:** Ruined Outpost, Dead Spring. Tan gravel floor; the Dead Spring's grey dried-pool ground.
3. **Mid-basin channels:** Mineral Washes. Rust-orange oxidised wash floors.
4. **East steps:** Fossil Terraces, Salt Flats (gypsum between). Ivory reef limestone, grey gypsum, white-pink halite.
5. **Hydrothermal dome:** Acid Pits. Amber crust, sulfur-yellow crest, acid pools.
6. **Volcanic north:** Basalt Fields, the volcano. Weathered brown basalt, fresh charcoal flows.

**Hub and spurs:** one hub, the Slums **[vault LOCKED]**. Its exits on the map: NNE (upper city), ESE (outpost), SSE
(Dead Spring), SW (back to the pass). Volcano: maybe a zone, a spur off the basalt **[TASKS; not in the vault]**.

**Dread curve (openness in route order) [map; INFERRED; environment art Z7]:** pass corridor between walls (semi-open)
→ Slums under the cliff (built, enclosed, safe) → open gravel floor (outpost) → open floor around a hollow (Dead Spring)
→ open dome cut up by pools (acid) → dense built city on a narrow bench (finale) → the ramp out (narrow, climbing).
Open ground through the middle of the act; the closed, built spaces bracket it.

**Scale caution [H1, H2; P5]:** zones are abstract tile slices. One map cell (2.3 km) is about eight zone routes long.
Nothing here is a zone size, a walking distance or a layout; the lore km in the graph only make bearings.

## 3. Zone graph

Computed by `zone_graph.mjs` from `out-a/act1.json` (full output: `out-a/act1_zone_graph.md`; bearings rounded here).
Screen direction = bearing − 45° (the camera looks north-east). Height step from the median height within 4 km of each
anchor **[map]**.

| From | To | Exit bearing | Screen | Return | Height step | Crossing (landform) | Status · source |
|---|---|---|---|---|---|---|---|
| 01 Caravan Approach | 02 Slums | 41° NE | up | 221° SW | level (400 → 480 m) | out of the pass mouth onto the terrace fan | **decided** · vault LOCKED 2026-11-02 |
| 02 Slums | Ruined Outpost | 105° ESE | up-right | 285° WNW | descends (480 → 260 m) | off the terrace's east edge, along the old road | proposed · vault "likely" 2026-11-05 |
| 02 Slums | Dead Spring | 148° SSE | right | 328° NNW | descends (480 → 170 m) | off the terrace's south-east edge onto the floor | proposed · vault "likely" |
| Dead Spring | Acid Pits | 83° E | up-right | 263° W | descends (170 → 60 m) | gravel floor to the dome's west foot | proposed · vault "likely" |
| Ruined Outpost | Mineral Washes | 76° ENE | up-right | 256° WSW | descends (260 → 60 m) | old road's end into the wash channel | proposed · cartographer (adjacency) |
| Mineral Washes | Basalt Fields | 39° NE | up | 219° SW | ascends (60 → 400 m) | up the main wash to its head at the basalt edge | proposed · cartographer |
| Mineral Washes | Fossil Terraces | 88° E | up-right | 268° W | level | wash branch into the gap between benches | proposed · cartographer |
| Fossil Terraces | Salt Flats | 107° ESE | up-right | 287° WNW | descends (80 → 10 m) | down the gypsum pavement onto the pan | proposed · cartographer |
| Salt Flats | Acid Pits | 224° SW | **down** | 44° NE | ascends (10 → 60 m) | across the pan onto the dome | proposed · cartographer |
| Basalt Fields | Volcano | 63° ENE | up | 243° WSW | ascends (400 → 2,300 m) | up the young flows to the cone | open · TASKS "maybe" |
| 02 Slums | Upper city | 29° NNE | up | 209° SSW | ascends (480 → 1,020 m) | **OPEN**: the leader's "abandoned route" (not the main road's switchback) | **decided** (progression) · vault spine 2026-11-13 |
| Upper city | Exit (escarpment top) | 9° N | up-left | 189° S | ascends (1,020 → 1,370 m) | the ramp through the escarpment lip | proposed · change request answered 2026-11-13 (`2_change_request.md`) |

- **Exit bearings (level design T6):** a zone's exit faces the bearing to the next zone; its entrance faces the return
  bearing. Level design's tolerance is 45°.
- **Crossing bearings (H5):** no known crossing differs from the node-to-node bearing by more than 45°; none overrides.
- **Hub and waypoints:** the Slums is the hub **[vault]**; waypoints and travel mechanics are OPEN **[P16]**.
- Links marked "cartographer" are geographic adjacency only; the vault doesn't order those zones. Don't build them as the
  route until George or the narrative orders them.

### Graph checks (H7–H11)

| Check | Result | Options |
|---|---|---|
| **H7** two-link zones: entrance and exit ≥ 90° apart | Pass: Outpost 150°, Dead Spring 115°, Terraces 161°, Basalt 156°, Acid 141°, Upper city 160°. **Fail: Salt Flats**, entered from the terraces (287°) and left to the acid (224°): 63° apart, if that order is used. | (a) leave the pan to the south-east, toward the dome's east side (move the crossing, ~150°); (b) enter the Salt Flats from the north (brine pools) instead; (c) accept, level design bends the route (T6 tolerance). |
| **H8** hub exits ≥ 45° apart | Slums: NNE 29°, ESE 105°, SSE 148°, SW 221°. **Fail (narrowly): Outpost 105° and Dead Spring 148° are 43° apart.** | (a) take the Dead Spring exit off the terrace's south foot (crossing ~165°, a real fan-toe descent; the Dead Spring marker op sits there at (0.31, 0.80)); (b) accept: within 2° of the rule. I'd take (a). |
| **H9** down-screen successors (180–270°) | **Salt Flats → Acid Pits, 224°** (if used). Return legs to the hub (285°, 328°) are left, not down. | Prefer reaching the acid pits from the Dead Spring (83°, up-right), as the vault's likely order already does. |
| **H10** tall landforms on the camera side (S, W) | **Flagged:** Caravan Approach (plateau W, h 60 against 38; also N 63), **Slums** (escarpment W, 58 against 40), **Dead Spring** (south rim S, 46 against 31). Near the threshold: upper city (W/NW 56 against 50) and exit (W 62 against 55). | Bend the wall to read as a north wall inside the zone (P8), cut or fade it (level design N9, technical art), or stage the zone so the wall is behind the player. George's call (review "For George" 3). |
| **H11** every biome change across a link has a physical reason | Pass: each crossing is a landform step (pass mouth to fan, terrace edge to floor, channel to bench, gypsum to halite, salt to hydrothermal dome, wash head to lava edge, old to young basalt, fan to bench to ramp). The Dead Spring's grey ground needs its water story (OPEN, its sheet). | — |

## 4. Zones

One sheet per zone in act order, each pasteable into a zone's `00_brief.md` under "Geography (from the act map)".
Bearings to landmarks are measured from the zone's anchor **[map]**. Height bands are Azgaar units with metres.

### 01 Caravan Approach [placeholder] (caravan escape, combat tutorial; LOCKED)

| | |
|---|---|
| **Anchor** | Marker op `now.marker.caravan`, (0.06, 0.80). Pass floor h 38 (~400 m) **[op act1.caravan-pass; map]**. |
| **Neighbours and directions** | → 02 Slums, 41° NE (screen up), level then a short rise onto the terrace. Entered from outside the act: the main road comes from the lowland to the south-west **[op now.road.main.approach]**. |
| **Landform and openness** | A flat-floored pass through the south-west rim, ~6–10 km wide, between the plateau's flank (NW) and the south rim hills (SE), opening east onto the basin. Semi-open band; map-type hint: narrow-path band **[map; INFERRED]**. |
| **Edges by side** | N: plateau and escarpment rising to 1,850 m. W: plateau flank, 60 against 38 (**camera side, flag**). S: south rim hills (~850 m), camera side but lower. E: opens onto the Slums terrace and the floor. |
| **Ground and rock** | Unpainted today (Azgaar's "Hot desert", pale sand) **[map]**; review finding 8 proposes coarse pass gravel. Rim debris at the walls; red-brown escarpment rock to the north **[op now.biome.escarpment]**. OPEN until that paint pass. |
| **Water** | None in the present day **[op now.act1.rivers.clear]**. Before: a stream ran down the pass into the basin **[before build, generated river; TG2: not listable]**. |
| **Climate and air** | Hot, hyperarid, drought **[vault 2026-11-05; op now.drought]**; prevailing wind from the south-west, blowing up the pass into the basin **[world/config.json winds]**. |
| **Seen from here** | Escarpment wall N–NE; the falls 28° NNE and the upper city 38° NE, both ~35 km: the act's skyline target, straight up-screen **[map]**. Volcano plume 59° ENE (~90 km, may be beyond what the camera frames, H20). |
| **Before** | Grassland pass with a stream **[before build]**. No road on the before map (P24). |
| **Now, and what changed** | Dry pass, no water; the main road and the slavers' caravan traffic **[vault 2026-11-03; P22]**. Cause of drying: the extraction's drought **[vault 2026-11-05]**. |
| **Story pointers** | Act I spine and opening sequence (2026-11-13); README "Map decisions" (road). |
| **Open** | Who attacks the caravan **[marker note]**; the pass's ground material (paint pending). |

### 02 Slums [placeholder] (safe quest hub, no combat; LOCKED)

| | |
|---|---|
| **Anchor** | Burg op `now.burg.slums`, (0.255, 0.445). Terrace h 40 (~480 m) **[op act1.city-terrace]**. |
| **Neighbours and directions** | ← 01, entered from 221° SW. → upper city 29° NNE (up; decided, route OPEN); → Outpost 105° ESE; → Dead Spring 148° SSE (proposed; H8 note: take it off the terrace's south foot, ~165°). |
| **Landform and openness** | A flat fan terrace at the escarpment's foot, below the falls, ~80 m above the floor to the east **[map]**. Built, enclosed by the wall on the west and north. |
| **Edges by side** | W: escarpment face, 58 against 40 (~1,600 m against 480 m) (**camera side, flag**). N: the upper city's bench and the escarpment, ~580 m above. E and S: terrace edge stepping down to the gravel floor. |
| **Ground and rock** | Fan gravel and sand (tan); a green strip along the falls stream through the west of the town **[op now.biome.basin-ground, now.biome.oasis]**; red-brown escarpment rock above. |
| **Water** | The falls stream: rises far back on the plateau, passes the upper city's intake, drops down the falls slot into the Slums and is used up there (soaks into the fan) **[op act1.river.falls]**. Permanent, fresh, not hazardous. Wells and cisterns as backup **[burg note]**. *Review finding 1: the stream's course on the plateau must be fixed to run downhill; the Slums' end of it doesn't change.* |
| **Climate and air** | Hot and dry; rare storms are plausible here, close to the wetter upland rim **[vault Blueprint; Research note]**. The arrival scene's night storm is provisional **[vault Scene Concept]**. |
| **Seen from here** | The falls 341° NNW (~9 km) and the walled upper city 29° NNE (~7 km, ~540 m above): the hub's skyline. The escarpment wall fills the west. Volcano plume 68° ENE (~60 km). |
| **Transitions** | To the upper city: a ~580 m step up the escarpment face (switchback road; the falls slot is the other graded way up) **[op now.road.main.ascent; map]**. To the floor: a terrace edge, fan gravel to floor gravel. |
| **Before** | Green along the stream; the stream continued south across the floor to the Spring **[before build]**. No settlement on the before map; what stood at the city site is OPEN **[P24]**. |
| **Now, and what changed** | A poor quarter of free citizens beneath the upper city **[vault 2026-11-06]**; its green shrunk to the stream's edge and the stream no longer reaches the floor **[map; cause: drought, vault 2026-11-05]**. |
| **Story pointers** | Path A (Slums), Scene Concept (stormy arrival), Slaver Faction, Act I spine. |
| **Open** | Hub access after the betrayal (spine); the camera-side wall (H10). |

### Ruined Outpost [placeholder] (destroyed ruin with old robot scrap; anchor category LOCKED, position provisional)

| | |
|---|---|
| **Anchor** | Marker op `now.marker.ruined-outpost`, (0.41, 0.51). Floor h 34–35 (~260–290 m). |
| **Neighbours and directions** | ← Slums from 285° WNW (exit to the Slums faces WNW, screen left). → Mineral Washes 76° ENE (proposed). |
| **Landform and openness** | Open, nearly level gravel floor below the terrace **[map]**. Map-type hint: large open. |
| **Edges by side** | W: terrace edge (+5 to +6 units) with the escarpment far beyond (camera side, distant). N: floor rising gently to the north escarpment (~20 km). E: floor falling to the washes. S: open floor. |
| **Ground and rock** | Tan gravel floor **[op now.biome.basin-ground]**. Review finding 8 proposes finer ground (mud) toward the east; same gravel as the Slums' terrace and the Dead Spring's floor today. |
| **Water** | None in either era on the map **[map]**. A waystation needs water: OPEN (review "For George" 4). |
| **Climate and air** | Hot, dry, wind from the SW. |
| **Seen from here** | Upper city 311° NW and the falls 305° NW (~16–22 km: behind the player when heading east); volcano 57° ENE (~50 km); acid dome 112° ESE (~40 km, steam). |
| **Transitions** | To the washes: a gentle descent into rust-stained channels. |
| **Before** | Grassland floor **[before build]**; no route or settlement drawn (P24). |
| **Now, and what changed** | Picked-over ruin with scattered old machine parts **[vault 2026-11-02]**; the old caravan road through it fades out before the washes **[op now.road.old.*]**. Former use: "a former caravan waystation (provisional)" **[marker note]**. |
| **Story pointers** | Act I "what 'scrapyard' means" (2026-11-02); Path A "Approved clarification". |
| **Open** | Original purpose and age; where the old road led **[P24]**; its water. |

### Mineral Washes [placeholder] (traversal and combat; scaffold 05–06, provisional)

| | |
|---|---|
| **Anchor** | (0.56, 0.45), the centroid of the washes' paint, beside label op `now.label.washes`. Channel floor h 26 (~65 m). |
| **Neighbours and directions** | ← Outpost from 256° WSW. → Basalt Fields 39° NE (up); → Fossil Terraces 88° E (both proposed). |
| **Landform and openness** | Braided seasonal channels cut into the floor, running from the basalt edge south to a teal mineral pool, with a branch east through the terrace gaps **[op act1.washes; act1.wash.*]**. Map-type hint: narrow-path along channels. |
| **Edges by side** | N: basalt edge (+12 units). W: floor rising to the outpost. E: terrace benches. S: the teal pool and the acid dome beyond. No tall camera-side mass. |
| **Ground and rock** | Rust-orange, iron-oxidised wash floors **[op now.biome.washes]**; gravel banks between channels. |
| **Water** | Seasonal: dry most of the year, flash floods after rare storms **[op act1.style.washes note; G15]**. Source: the north rim and basalt edge; flow south (≈170°) to the teal mineral pool (saline, closed) and east to the salt pan. *Review finding 4: today the main wash runs uphill for 4.7 km; the fix carves its southern limb so it drains to the pool.* Not hazardous except the pool. |
| **Climate and air** | Hot, dry; flash-flood risk after storms **[INFERRED from G15]**. |
| **Seen from here** | Volcano 49° NE (~37 km, up-screen: the zone's tall flag); acid dome 131° SE (~28 km); the city and falls far WNW (~30 km, behind). |
| **Transitions** | To the basalt: wash head climbing onto dark lava. To the terraces: channel into the ivory benches. |
| **Before** | Grassland with generated rivers down the washes **[before build]**; vault: before-era water undesigned (P24). |
| **Now, and what changed** | Dry, iron-stained channels. Cause of the colour: OPEN; a credible chemistry is required **[vault 2026-11-02 plausibility constraints]**. |
| **Story pointers** | Blueprint (iron-stained wash), Idea Bank (rustwater). |
| **Open** | What stains the washes, and whether the stain is new (catastrophe) or old. |

### Dead Spring [placeholder] (combat; likely after the outpost return; provisional)

| | |
|---|---|
| **Anchor** | (0.40, 0.80), the pools' centre (lake features "Dead Spring", two pools). Floor h 31–33 (~170–225 m). Marker op `now.marker.dead-spring` sits 9 km west, at the terrace foot. |
| **Neighbours and directions** | ← Slums from 328° NNW. → Acid Pits 83° E (proposed, vault "likely"). |
| **Landform and openness** | A shallow hollow in the open floor holding two small stagnant pools, ~15 km beyond the terrace's foot **[map]**. Map-type hint: large open around the hollow. *Review finding 3: the hollow is pan-deep today (h 21); the fix makes it shallow (h ~29).* |
| **Edges by side** | S: south rim hills, 46 against 31 (**camera side, flag**). N and W: open floor rising to the terrace. E: floor, then the dome. |
| **Ground and rock** | Grey dried-pool floor and dead scrub **[op now.biome.dead-spring]**, in tan gravel. |
| **Water** | Two stagnant mineral pools, teal, saline **[op now.lakes.dead-spring]**: not drinkable; whether hazardous is OPEN. Source before: the falls stream continuing south from the Slums and a stream down the pass **[before build]**; physically a fan-toe spring **[INFERRED, G12]**. Outlet: none today; the review proposes the old outflow channel east to the pan (a dry wash today, a river before). |
| **Climate and air** | Hot, dry, still air in the hollow **[INFERRED]**. |
| **Seen from here** | Upper city 339° NNW and falls 331° (~31–36 km: a far, up-left skyline); acid dome 84° E (~37 km, up-right: steam); volcano 43° NE (~64 km). |
| **Transitions** | From the Slums: terrace edge down to the floor. To the acid: gravel to the dome's amber crust. |
| **Before** | "The Spring": a living freshwater oasis with green ground around it **[op before.lakes.dead-spring, before.biome.oasis; vault 2026-11-05]**. |
| **Now, and what changed** | Dead trees, stagnant mineral pools **[marker note]**. Cause: the spring failed or salinized after extraction **[vault Blueprint #6, provisional]**; mechanism OPEN. Exaggeration: the pools are far larger than a real spring (G36). |
| **Story pointers** | Blueprint "dead salinized spring pocket"; README 2026-11-05. |
| **Open** | Why it died, and when; whether its pools are toxic. |

### Acid Pits [placeholder] (signature hazard; anchor category LOCKED, position provisional)

| | |
|---|---|
| **Anchor** | (0.76, 0.73), the centroid of the Acid Pits and Sulfur Crust paint. Marker op `now.marker.acid` sits at the dome's west edge (0.665, 0.705). Dome h 24–26 (~35–65 m), pools below. |
| **Neighbours and directions** | ← Dead Spring from 263° W (likely route); ← Salt Flats from 44° NE (proposed; down-screen if entered this way, H9). Exit onward: unknown **[vault]**. |
| **Landform and openness** | A low salt dome pushed up over a hydrothermal system at the pan's southern edge, pitted with eight acid pools **[P19; op act1.acid.*]**. Map-type hint: large open, cut up by pool blockers ("medium pools act as blockers", marker note). |
| **Edges by side** | All sides low; S: south rim beyond (~10 km). No camera-side mass near. |
| **Ground and rock** | Burnt-orange oxidised crust ringing the pools; bright sulfur-yellow crust on the crest; halite pan around the dome **[op now.biome.acid, now.biome.sulfur, now.biome.salt]**. |
| **Water** | Acid pools in four colours: acid green, sulfur yellow-green, turquoise, dark olive **[op now.style.acid*]**. Hazardous. Closed, saline. Exaggerated 10–100× real size for play (G36, P20). |
| **Climate and air** | Hot; steam and gas over the pools **[vault overview, inspiration; INFERRED]**. |
| **Seen from here** | Volcano 11° N (~43 km, up-screen); the city far WNW (~53 km, behind). |
| **Transitions** | From the floor: gravel to amber crust. From the pan: white halite to amber. |
| **Before** | Clear blue hot springs ringed with white travertine **[op before.lakes.spring.*, before.biome.travertine]**. Whether the acid field predates the machine is OPEN **[P24]**. |
| **Now, and what changed** | Acid pools. Cause: ultimately the Grand Machine's extraction **[vault 2026-11-02]**; the chemical mechanism is OPEN. |
| **Story pointers** | Blueprint (acid hydrothermal terraces); Research note (environmental cause). |
| **Open** | The acid's mechanism; the zone after the acid pits. |

### Salt Flats [placeholder] (traversal and combat; scaffold 11–12, provisional)

| | |
|---|---|
| **Anchor** | (0.89, 0.52), the centroid of the Salt Flats paint. Pan h 21 (~10 m): the basin's lowest ground **[P19]**. |
| **Neighbours and directions** | ← Fossil Terraces from 287° WNW. → Acid Pits 224° SW (proposed; **down-screen**, and H7 fails: see the checks). |
| **Landform and openness** | A flat halite pan along the east floor, ~10 km wide, hard against the east horst **[map]**. Map-type hint: large open. |
| **Edges by side** | E: east horst wall, 47 against 21 (~830 m higher, north-east side: not camera side). W: gypsum pavement and terraces. N: brine pools under the basalt. S: the acid dome. |
| **Ground and rock** | White halite crust with a faint pink tint; a small white gypsum dune field (ENE of the pavement, downwind) **[op now.biome.salt, now.biome.dunes]**. *Review finding 6: no fan apron at the horst's foot today; a fix adds gravel fans there.* |
| **Water** | Two pink brine pools in the north of the pan (saline, not acidic) **[op act1.lakes.brine]**; the pan floods briefly in rare storms **[G15]**. |
| **Climate and air** | Hot; glare **[INFERRED]**. |
| **Seen from here** | Volcano 350° N (~29 km); acid dome 221° SW; the escarpment and city far W (~60–80 km, likely beyond the camera, H20). |
| **Transitions** | Gypsum pavement to halite (G18). |
| **Before** | Grassland and some forest on the before build: wrong, review finding 2. How wet the pan was is OPEN **[P24]**. |
| **Now, and what changed** | Dry evaporite pan. The salt itself is old geology, not the catastrophe's **[vault LOCKED 2026-11-02 #5]**. |
| **Story pointers** | Blueprint (halite salt flat, brine-lake shore). |
| **Open** | The before-era lake's extent. |

### Fossil Terraces [placeholder] (traversal and combat; scaffold 09–10, provisional)

| | |
|---|---|
| **Anchor** | (0.72, 0.44), label op `now.label.terraces`. Benches h 28–30 (~100–150 m) above a belt at 27 and wash gaps at 26 **[op act1.terraces.*]**. |
| **Neighbours and directions** | ← Washes from 268° W. → Salt Flats 107° ESE (descends). |
| **Landform and openness** | Three ivory reef-limestone benches stepping down east toward the pan, with wash-cut gaps between them **[map]**. Map-type hint: narrow paths between benches. |
| **Edges by side** | N: basalt edge (+10 units). E: gypsum pavement and pan. S: the teal pool and the acid dome. W: washes. |
| **Ground and rock** | Pale ivory reef limestone on the benches; rust wash floor in the gaps; gravel on the belt (review finding 10 repaints it ivory). |
| **Water** | Dry; the terraces' wash branch carries rare flash floods to the pan. |
| **Climate and air** | Hot, dry. |
| **Seen from here** | Volcano 27° NNE (~27 km, up-screen); acid dome 165° SSE (~20 km). |
| **Transitions** | To the pan: gypsum pavement then halite. |
| **Before** | The same benches (bedrock in every era) **[op before.biome.terraces]**; grassland around them. |
| **Now, and what changed** | Unchanged rock; the wash gaps stained. |
| **Story pointers** | Blueprint (former shoreline terrace). |
| **Open** | A past sea link explains reef terraces; it's optional deep-time geology, not decided **[vault LOCKED 2026-11-02 #3]**. |

### Basalt Fields [placeholder] (traversal and combat; scaffold 07–08, provisional)

| | |
|---|---|
| **Anchor** | (0.69, 0.20), the centroid of the Old Basalt paint. Lava lobes h 36–39 (~325–440 m). |
| **Neighbours and directions** | ← Washes from 219° SW. → Volcano 63° ENE (open). |
| **Landform and openness** | Raised basalt lobes on the north floor, rising to the volcano **[op act1.basalt.*]**. Map-type hint: narrow paths among lava ridges. |
| **Edges by side** | N: north rim (h 43–47) and the escarpment's east end. E: fresh flows and the volcano. S: washes and terraces (lower). W: the washes' head. |
| **Ground and rock** | Weathered dark-brown old basalt; charcoal fresh basalt toward the volcano **[op now.biome.basalt.*]**. |
| **Water** | None. |
| **Climate and air** | Hot; ash and fumes downwind of the volcano (the wind blows from the SW, so the plume drifts north-east, away from the basin) **[config winds; INFERRED]**. |
| **Seen from here** | Volcano 61° ENE (~17 km, the dominant tall flag); acid dome 167° SSE (~35 km). |
| **Transitions** | Old to young basalt toward the cone. |
| **Before** | The same basalt, already old **[op before.biome.basalt.*]**. |
| **Now, and what changed** | Unchanged rock. |
| **Story pointers** | Blueprint (black basalt flows). |
| **Open** | — |

### Volcano (unnamed; maybe a zone; not in the vault scaffold)

| | |
|---|---|
| **Anchor** | Marker op `now.marker.volcano`, (0.84, 0.10); crater (0.84, 0.07). Cone h 66 (~2,300 m), summit lava lake **[op act1.volcano*]**. |
| **Neighbours and directions** | ← Basalt Fields from 243° WSW (open). |
| **Landform and openness** | An active stratovolcano on the north rim at the rift axis's north-east end; tall and lone, a recorded look choice (G4). Map-type hint: narrow climb. |
| **Ground, water, air** | Fresh charcoal flows **[op now.biome.basalt.recent]**; a small fluctuating summit lava lake, not the acid's source **[marker note]**; plume. |
| **Seen from** | Most of the act: up-screen from the Washes, Terraces, Salt Flats and Acid Pits; far off from the Slums (68° ENE). **The act's tall flag** (K17, K19). |
| **Before / now** | Active in both eras **[vault 2026-11-03; before.biome.basalt.recent]**. |
| **Open** | Whether it is a zone at all; its name. |

### Upper city [placeholder: "Slaver Upper Camp"] (finale cluster: 4–6 combat maps, Act I boss; role LOCKED)

| | |
|---|---|
| **Anchor** | Burg op `now.burg.upper-camp`, (0.29, 0.345). Bench h 48–50 (~900–1,020 m), about 9 × 6 km **[op act1.upper-city-shelf; map]**. |
| **Neighbours and directions** | ← Slums from 209° SSW (the abandoned district's route is OPEN). → Exit 9° N (proposed). Entrance and exit 160° apart (H7 passes). |
| **Landform and openness** | A bench in the escarpment ~540 m above the Slums, with the falls slot on its west side and the escarpment rising ~200–800 m behind it; the one low notch in the lip is at its north-east corner **[map]**. Walled, with a citadel **[op now.burg.upper-camp]**. Map-type hint: dense built narrow paths. |
| **Edges by side** | W: the falls slot (240 m below the bench) and the escarpment beyond (camera side; near the flag threshold). N: escarpment lip, 1,230–1,850 m. E: the bench drops to the floor. S: the drop to the Slums. |
| **Ground and rock** | Red-brown escarpment rock **[op now.biome.escarpment]**; the falls' green strip on the west **[op now.biome.oasis]**. |
| **Water** | Draws its water from the falls stream upstream, on the plateau above the falls **[burg note]**; the slot's water is below the bench, so the intake must be above the falls **[map; INFERRED]**. |
| **Climate and air** | Cooler and less dry than the floor (higher, nearer the plateau) **[G24; INFERRED]**. |
| **Seen from here** | The whole basin to the east and south-east: the acid dome 117° ESE (~54 km), the volcano 72° ENE (~58 km); the Slums directly below. |
| **Transitions** | To the Slums: a ~580 m face. To the plateau: the ramp (~350 m at ≤ 8%). |
| **Before** | Nothing drawn; what stood here is OPEN **[P24]**. |
| **Now** | The upper city of a medium-sized slaver city; not a capital **[vault 2026-11-03]**. |
| **Story pointers** | Slaver Faction; Act I spine (betrayal, finale). |
| **Open** | Which districts form the escape; the abandoned district's route in; the boss and the means of passage **[spine]**. |

### Exit: the escarpment top (act exit toward Act II; proposed)

| | |
|---|---|
| **Anchor** | (0.305, 0.20), top of the ramp; proposed road op `now.road.main.escarpment` **[2_change_request.md]**. h 53–55 at the notch, plateau 55–62 around (~1,230–1,850 m). |
| **Neighbours and directions** | ← Upper city from 189° S. Onward: the plateau toward the highlands (W–NW); direction beyond the act OPEN. |
| **Landform and openness** | A ~3 km-wide ramp through the escarpment lip (a relay ramp between the west and north segments), opening onto a rolling plateau **[map; INFERRED geology]**. Map-type hint: narrow climb, then open. |
| **Edges by side** | W and E: the lip standing ~400–600 m above the notch (W is camera side, near the threshold). S: the drop to the city. N: open plateau. |
| **Ground, water, air** | Escarpment rock, then the plateau's unpainted "Cold desert" (an OPEN look; review "For George" 5). The falls stream crosses the plateau a few km west. Cooler, windier **[INFERRED]**. |
| **Seen from here** | The upper city below (189° S), the falls 229° SW (~11 km), the whole basin beyond. |
| **Before / now** | Same ramp in both eras; a before-era road is OPEN (change request question 3). |
| **Open** | Whether this is the only way to the highlands; where Act II lies. |

## 5. Open questions for George

1. Zone order beyond the vault's likely start: the links marked "cartographer" are adjacency only. Which belong to the route?
2. The camera-side escarpment and south rim (H10): bend, cut/fade, or stage around them?
3. H8 at the hub: take the Dead Spring exit off the terrace's south foot (~165°)?
4. H7/H9 at the Salt Flats: if the salt flats lead to the acid pits, should the crossing move to the dome's east side?
5. The act's exit (change request): is the city the only practical way to the highlands, and is Act II toward the
   highlands?
6. Where this file lives in the ARPG repo, and whether producers paste each sheet into `00_brief.md` or link to it.
7. Before-era facts (water, the city site, the old road) are mostly OPEN; should sheets keep a before line now, or wait
   for the before map's water and settlement passes?

## 6. Changes since the last version

| Date | Change | Why |
|---|---|---|
| 2026-11-13 | First version: 12 zones, 12 links, graph checks; exit link added from the change-request answer | Act I handoff (TASKS 3); no earlier version |
