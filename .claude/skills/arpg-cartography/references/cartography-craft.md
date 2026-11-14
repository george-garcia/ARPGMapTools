# Cartography craft: believable, readable, playable maps

Load for reviews, new regions, labels and styling, before/after work, and any decision to bend geography for play.
Evidence: `docs/studio/research/cartography/B_worldbuilding_cartography.md` (B1–B19 mistakes, R1–R13 readability, P1–P13
play geography, X1–X8 realism vs play, E1–E7 before/after; sources B[1]…B[41]). Rule IDs here are K1…; the physical
rules they lean on are in `geography.md`.

## 1. The classic mistakes (check after every terrain or water change)

- **K1. Rivers rise high and end lower** (sea, lake, river, or a closed basin's pan); they merge, never split except in
  declared fans and deltas; no channel joins two seas or two basins. *COMMUNITY B1–B3, strong consensus; SOURCE B[16].*
  Note: hand-drawn `add_river` lines aren't held to this by Azgaar — you are (azgaar-ops).
- **K2. A river's look matches its slope:** steep and straight on the scarp, meandering on flats. *COMMUNITY B4.*
- **K3. Swamps and wetlands sit on flat, low, wet ground, never on slopes.** *COMMUNITY B7.*
- **K4. Clean coasts and shores:** no specks of islands or one-cell lakes that just look messy. *COMMUNITY B8.*
- **K5. Mountains form belts with a cause** (plates, rifts), not blobs, crosses or odd branches; the lee side is dry.
  *COMMUNITY B9–B10.*
- **K6. Biomes are continuous zones, not salt-and-pepper speckle,** and the layers agree (no forest label on a desert,
  no oasis without water). *COMMUNITY B11–B12, B19.* Check: biome screenshot squinted; `query_cells` biome counts.
- **K7. Big shapes first, then detail.** *COMMUNITY B13.* Matches the drawing order (P10).
- **K8. Settlements and roads have reasons:** fresh water, shelter, crossings; roads take low passes, valleys and banks,
  not straight lines over ridges. *COMMUNITY B14–B15; with G28–G31.*
- **K9. Natural borders are ridges, escarpments, deserts and wastes;** rivers more often join regions than divide them.
  The edge of the known world has a reason (a range, a desert, the sea). *COMMUNITY B16–B17.*
- **K10. Don't fill every corner or flag every secret:** markers for what the studio needs, secrets as notes.
  *COMMUNITY/DEV B18.*

## 2. Readability

- **K11. The hierarchy follows the map's purpose;** lightness contrast does most of the work. Run a squint and greyscale
  test on every visual pass: does the act's signature (the acid pits) still pop, do regions separate? *COMMUNITY R1–R2.*
- **K12. Distinct line styles for rivers, roads, trails and seasonal channels, with a legend.** Act I's mineral washes are
  dashed routes that can read as trails: give them their own style and a legend entry. *COMMUNITY R4.*
- **K13. Labels:** point labels upper-right first; area labels inside the area, letter-spaced across it, one orientation
  rule; serif italic for natural features, sans for settlements, blue for water; halos only where text crosses detail;
  label only what matters. *COMMUNITY R5–R9 (Ordnance Survey conventions).*
- **K14. Names:** consistent language patterns with an English generic word ("… Flats", "… Mountains"); names come from
  the vault, placeholders stay tagged (P12). *COMMUNITY R10.*
- **K15. Colour carries meaning:** wetter is more saturated, arid paler, taken from satellite colour. *COMMUNITY R11.*
- **K16. Region identity:** limit materials and vegetation per region and give each a bold signature; neighbouring zones
  differ; don't repeat one set piece in every zone ("a volcano in every zone"). *DEV R12–R13.* Check: list each zone's
  dominant material, colour and signature; neighbours must differ.

## 3. Geography for play

- **K17. Triangles at three scales:** big landmarks, medium relief that hides the next thing, small shapes that set the
  tempo. *DEV, second-hand B P1.* Application (INFERRED): one big landmark per act, visible from most of its zones; medium
  relief between zones.
- **K18. Spread points of interest unevenly ("gravity") and reveal them in sequence** — one feature leads to the next.
  *DEV, second-hand B P2–P3.*
- **K19. Something calls every ~30 seconds;** tall flags (smoke, plumes, a lone tower) work at range. *DEV B P4.* For the
  map: list the tall flags each zone can see (H17).
- **K20. Design each place around the route the player arrives by** — its silhouette from the road. *DEV B P6; with H17.*
- **K21. Content sets the world's size, not the reverse;** a far view must hold something. *DEV B P7–P8; with H1–H2.*
- **K22. Regions have distinct identity, danger and purpose; zone edges sit at natural barriers; chokepoints at passes,
  gorges, ramps and fords.** *DEV/COMMUNITY B P9–P10.* Every zone-graph edge crosses a real feature on the map (a pass, a
  scarp ramp, a terrace step, a causeway), and every zone boundary follows a height break, water or a biome change.
- **K23. Water links neighbouring regions** and makes adjacency believable. *DEV B P11; with H19.*
- **K24. Mix open ground with dense, built-up or dungeon-like places;** inside a zone, a tileset change follows a physical
  change. *DEV B P12–P13; with H15.*

## 4. Realism versus play

- **K25. Adapt real places, don't copy them;** start from a mostly believable base and add the exotic on top. *DEV
  B X1–X2.* Dallol is the analogue, not the blueprint.
- **K26. Depart from reality where readability or play needs it, and nowhere else** — even Azgaar bends physics for
  colour. *DEV B X4; COMMUNITY (one practitioner) B X3; PROJECT P8.*
- **K26b. Story and theme first, then gameplay and beauty, then geography** (P8 refined by P31–P33). Zones are reached
  through the zone graph, so the land never has to wall a route off; aim for beauty (the strange beauty of a dying
  place), and make grit (mud, rust, dreariness) a deliberate narrative choice. Every colour carries a stated story or
  beauty reason in the pass report. *PROJECT P31–P33.*
- **K27. Say what was bent:** every op that departs from a G- or K-rule carries a note naming its reason (gameplay, look,
  story), so "what did we fake and why" is one list. *INFERRED B X7.*
- **K28. Keep a place's soul when you change it;** compress, but keep the landmarks people remember. *DEV B X5–X6.*
- **K29. Fix the system when the same fault keeps coming back** (a tool, an op pattern); post-edit only one-offs.
  *COMMUNITY B X8.*

## 5. Before and after

- **K30. Same frame, same base; only time-dependent layers change** (water, biomes, settlements, routes, notes). Landform
  changes between eras are named catastrophe ops tied to the vault, never drift. *OBSERVED/SOURCE B E1, INFERRED E7;
  PROJECT P14.* Check: diff height summaries (`query_cells`) between the two builds.
- **K31. Water changes first and most visibly:** lakes shrink into lobes, shorelines retreat, the exposed bed shows pale;
  "now" water sits inside the "before" outlines. *OBSERVED B E2 (the Aral Sea).*
- **K32. Rivers and their towns move:** abandoned channels, towns left dry. *COMMUNITY B E3.*
- **K33. Keep the landform skeleton identical** so the change is what players notice; a changed region shows the
  catastrophe, not just a refresh. *DEV B E4–E5.*
- **K34. The "now" map carries traces of the "before":** every before settlement and route leaves a ruin or a track
  unless the story erased it; some places stay untouched and beautiful (P13). *DEV B E6.*
