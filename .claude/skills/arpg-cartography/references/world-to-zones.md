# From the world map to the studio's zones

Load for the act handoff doc, any change to zone anchors or connections, and reviews that touch an act's journey.
Evidence: `docs/studio/research/cartography/C_world_to_zones.md` (W1…W42, sources C1…C16 and the studio's research cited
as LD-x / EA-x). The consumers' own rules are cited by their IDs (level design T/N/G, environment art Z/M); read them
in the ARPG repo, never copy them.

## What an act map is

- **H1. An ARPG act map is an abstract node-and-line map over a painted region, not a scale map.** *OBSERVED W1–W2.*
  The cartographer hands over directions, adjacency, landform order and per-zone facts — never kilometres, walking
  times, zone sizes or layouts. *W34–W37; PROJECT P5.*
- **H2. Zones are not a literal scale of the map.** PoE2 main routes are ~250–350 m; our act is ~100 km; one zone stands
  for a stretch 15–25 times longer than its walk, and one map cell is ~8 zone routes long. Nothing at zone scale can be
  placed from the map. *OBSERVED/INFERRED W34–W37; SOURCE M4.*
- **H3. Keep one fixed act map and one bearing per connection;** variety lives in the zone layouts (level design T8),
  not in the act's geography. *DEV W4.*

## Directions (level design T6)

- **H4. The 3D zones must match the map's directions** — GGG: connections on the world map "match what you find in the
  3d world", and PoE2 0.5 redrew the Act 1–3 maps when layouts drifted. *DEV W5.*
- **H5. Compute every bearing from the map, never eyeball it:** each zone has an anchor (a marker or label op, or the
  act zone file `world/acts/<act>.json`), and `scripts/zone_graph.mjs` gives exit and return bearings (0° north,
  clockwise, from km offsets, M3). Where the crossing point is known (a pass, a ramp, a wash mouth) and differs from the
  node-to-node bearing by more than 45°, the crossing bearing is the T6 value, with a note why. *INFERRED W14, R2.*
- **H6. Re-check after every map pass and after every zone's G1:** recompute bearings when an anchor moves, diff them
  against the last handoff, and compare each zone's `level_spec.md` exit bearing with the handoff's; flag drift.
  *DEV W5; INFERRED R7.*

## Graph checks (run before every handoff; report failures as findings with options, never fix silently)

| Check | Rule | Why |
|---|---|---|
| **H7.** A two-link zone's entrance and exit bearings differ by ≥ 90° | level design T6; *OBSERVED W15* (D2/PoE2 exits never share the entrance's border) | Otherwise the zone's entrance and exit sit on the same side |
| **H8.** A hub's connections are ≥ 45° apart | *OBSERVED W11* | Players read each exit as a different direction |
| **H9.** A successor bearing in 180–270° is **down-screen** | level design T7; *PROJECT camera, W16* (up-screen is north-east) | The camera shows far more ahead (north-east) than behind |
| **H10.** Tall landforms on a zone's south or west side are **camera-side** | level design N9; *W17* | Tall masses must sit north and east of the walk, or be cut/faded |
| **H11.** Every biome change across a connection has a physical reason | *DEV W25* (D4: transitions "geologically true") | Transitions are set pieces, not seams |

A failed check goes to George with options: move an anchor (a map change; P7 if it settles no canon), bend geography
inside the zone (P8, said and why), or accept it and let level design handle it (switchback, mirror, fade).
**Known Act I case:** the escarpment lies west of the Slums and the city — camera side — and legs toward the Dead Spring
(south) or back west to the Slums run down-screen. *W17, R3; open question for George.*

## The act's shape

- **H12. A PoE2 act has ~15–18 areas, one town, levels rising about one per zone; a main chain with 3–4 hubs and ~5
  dead-end spurs.** *OBSERVED W8–W9.* Matches P23's 15–20.
- **H13. Hubs anchor clusters** (large, sparse, several entrances, landmark encounters); towns can be left in several
  directions; optional areas exist to be found and the act map shows them. *DEV/OBSERVED W10–W12.*
- **H14. Acts are journeys across regions,** each region with its own environment; vertical direction tells the story
  (descend toward the threat, climb to the climax). *DEV W22–W23.* For Act I: descend into the basin, climb out at the end.
- **H15. Zone order builds dread,** open before closed. *DEV W21; environment art Z7.* The handoff lists each zone's
  openness in route order.
- **H16. Regions carry biome identity** (D4: weather, biome, history), and dungeons and side caves take the theme of the
  rock above them; spurs hang off the zone the story passes, on the side where the landform is. *DEV W6, W26–W27; R8.*
- **H17. A settlement's approach is staged from outside it,** and the hub's edges show in the zones next to it (a
  skyline, a wall, a falls). *DEV W30–W31.* List what each zone sees.
- **H18. Revisiting a place in a later state is proven ARPG structure, done mostly by material and tileset swaps** — our
  before and now eras give each zone its physical before → now. *DEV/OBSERVED W24.*
- **H19. Water and roads are free compasses:** a river to follow, a road to take; both belong on or along the main
  route. *DEV W18–W19.*
- **H20. With a fixed camera, distant landmarks show only where the terrain allows;** don't promise a view the camera
  can't frame. *DEV W32.*

## The handoff document (the one cartography file in the ARPG repo, P26)

Template: `templates/act-handoff.md`. Where it lives in ARPG is George's call (proposed: `Docs/Act 1 scenes/_act1_map.md`).

- **H21. Act-level sections first:** the journey (start, end, descent and climb), the clusters (biome regions in route
  order), hubs and spurs, the dread facts (openness in route order), the graph-check results, the scale caution.
  *R5.*
- **H22. Then one sheet per zone, one screen long, pasteable into `00_brief.md` under "Geography (from the act map)":**
  ID and placeholder name, role (vault), anchor and height band, connections (neighbour, bearing, compass word, screen
  direction, height step, crossing landform, decided/OPEN), openness (map-type hint for level design), edges by side
  with the camera-side flag, ground and rock in order of extent, water (kind, source, flow, sink, seasonal, hazardous),
  climate and air, landmarks in and seen from it, before → now with each cause, story pointers into the vault, open
  items. *R4, R9; W38–W40.*
- **H23. Every fact names its source** — a vault decision, a P-ID, a map op id, or INFERRED. Anything not settled is
  **OPEN** with its question for George; the handoff never invents lore. *Environment art Z5; W41.*
- **H24. What the consumers need, by rule** (W39–W40): level design — T4–T7 exit placement and bearings, T15/N1 the
  landmark and loud cue, N3–N5 water as a one-way spine, N9 camera side; environment art — Z1 what happened here, Z3 the
  cause of each decay, Z5 asked-not-invented story, Z7 the dread curve, M1 the material set (from ground and rock).
