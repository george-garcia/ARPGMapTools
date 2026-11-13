# Physical geography: the rules a region must obey to read as real

Load for reviews, new regions, terrain and water passes, settlements and routes, and every geography change request.
Evidence: `docs/studio/research/cartography/A_physical_geography.md` (A1.1…A6.4, sources A[1]…A[47]). Every rule here is
bent only for a stated play or look reason (P8), and the bend is written down.

Each rule: the instruction, its origin, what the mistake looks like, and the check (tools: `azgaar-ops.md`).

## 1. Landforms and tectonics

- **G1. A rift basin is a dropped block between faults, usually lopsided:** one steep master fault scarp, the other side
  a gentler slope or a horst. *SCIENCE A1.1–A1.2.* Mistake: a symmetric bowl or a box of equal rims. Check: height
  transects across the basin (`query_cells` strips, or `screenshot_3d` low camera): one side steep, one gentle.
- **G2. Rift shoulders stand above the land around them,** and the escarpment is a stepped fault system with benches
  (marginal grabens 10–20 km wide), not one cliff. *SCIENCE A1.3–A1.5.* This is what allows a city on a shelf above its
  Slums. Check: the plateau beyond the lip is higher than the land outside the rift; benches show on a transect.
- **G3. Basins are long along the rift axis, and their margins are segmented** (fault segments ~60 km, stepping en
  echelon, with low gaps where passes and big fans form). Together with G1: **a region is never a rectangle.**
  *SCIENCE A1.6–A1.8.* Check: the outline on the heightmap screenshot; rims offset, not ruler-straight.
- **G4. Rift volcanoes sit on the axis, in ranges; young lava is darkest.** A tall lone stratovolcano is allowed as a
  recorded play/look choice. *SCIENCE A1.9–A1.10.* Check: volcano and basalt position relative to the basin's long axis.
- **G5. Rift floors are flat because they are filled** with sediment and salt, and faults keep cutting young surfaces.
  *SCIENCE A1.11–A1.12.* Check: floor heights vary by a few units, not tens.
- **G6. Big plateau rivers often drain away from the rift;** short steep streams fall into it. *SCIENCE A1.13.*

## 2. Water

- **G7. Water runs downhill to one outlet per watershed; rivers join, they don't split** (except on fans, braided
  reaches and deltas, which Azgaar can't draw). *SCIENCE A2.1–A2.2; SOURCE M7.* Check: rivers layer over heightmap.
- **G8. Every river ends at a sea, a lake or a closed basin's sink.** Mistake: a river that stops on open land (except
  where it soaks into a fan, said in a note). *SCIENCE A2.3.* Check: every river's mouth on the screenshot; `list features`.
- **G9. A closed lake exists only where evaporation beats inflow, and it is salty.** A fresh lake with no outlet is
  wrong. *SCIENCE A2.4.* Check: `list kind:"features"` subtypes; any freshwater lake without an outlet is a finding.
- **G10. The lowest ground of a closed basin is its playa or salt pan,** as close to the deepest subsidence as the small fans
  off the master (footwall) scarp allow. *SCIENCE A2.5–A2.6; PROJECT P19.* Check: no land cell below the pan; no lake surface below the pan's
  pools (TG1 for surfaces).
- **G11. A desert basin's perennial water comes from outside it** (exotic streams from a wetter highland); most channels
  are dry washes that flood in bursts. *SCIENCE A2.7–A2.8.* Check: each permanent river has its source on the plateau.
- **G12. Springs appear where groundwater meets the surface:** fault lines, escarpment feet, fan toes and pan margins.
  *SCIENCE A2.9.* Mistake: a spring in the middle of a fan or on a ridge with no reason.
- **G13. Waterfalls sit where a stream crosses a scarp, cut a notch back into it, and need a real catchment above.**
  *SCIENCE A2.10.* Check: the falls' river starts on the plateau with enough length to feed it.
- **G14. A closed basin's lake grows a lot in wet times and shrinks to a playa in dry ones.** A wetter era means a larger
  terminal lake, or one that overflows the rim. *SCIENCE A2.12, A4.5.* This decides the before era's water (P24).
- **G15. Pans flood briefly even in dry times;** seasonal water goes in notes and dashed styles, not permanent lakes.
  *SCIENCE A4.8; SOURCE A6.4.*

## 3. Arid ground, downslope

- **G16. The downslope order runs coarse to fine, steep to flat:** escarpment → gorge → alluvial fans (merging into a
  bajada) → gravel plain → mudflat → gypsum → halite pan. *SCIENCE A3.1–A3.2, A3.4.* Mistake: salt at the foot of the cliff,
  gravel in the pan's centre. Check: biome paint order along a transect from the escarpment to the pan.
- **G17. Fans are sized by the drainage behind them and the tilt:** small steep fans off a master scarp, big fans off the
  gentle side. *SCIENCE A3.3.*
- **G18. Evaporites zone by solubility:** halite in the centre, a thin gypsum ring, carbonate outside. A broad gypsum belt
  needs an old sea (marine evaporites). *SCIENCE A3.4–A3.5.*
- **G19. Gypsum dunes sit downwind of a gypsum playa.** *SCIENCE A3.6.* Check: dunes on the lee side for the map's winds.
- **G20. Fossil reef terraces mark old shorelines,** follow contours, and need a past link to a sea: a canon question for
  George. *SCIENCE A3.7–A3.8.*
- **G21. Hydrothermal fields are local, small and changeable** (Dallol ~3 × 1.5 km, ~60 m high). Not every salt flat or
  wet area is acidic; saline is not acidic. *SCIENCE A3.9; PROJECT P20 bends the size for the acid pits' prominence.*
- **G22. Regional versus local:** fans, bajada, gravel plain, terrace and gypsum belts, salt pan, basalt field and
  volcanic range are tens of km (map); hydrothermal fields, springs, pools, salt cones, single reefs and fault scarps are
  a few km or less (markers, or zone detail). *INFERRED A3.10.*

## 4. Climate and biomes

- **G23. Hot deserts lie in the sinking-air belts near 30°;** windward slopes are wet, leeward dry. *SCIENCE A4.1–A4.2.*
  Check: `precipitation` layer against the winds in `world/config.json`.
- **G24. Temperature and precipitation set the biome, then elevation and soil adjust it** (Whittaker); highlands are
  cooler (6.5 °C/km). *SCIENCE A4.3–A4.4.* Check: `temperature` and `biomes` layers.
- **G25. In deserts, green comes in ribbons and spots** along rivers, springs and lake shores, each with a named water
  source. *SCIENCE A4.6.* Mistake: a green patch with no water.
- **G26. A lush "before" needs more water, and the lakes show it** (the Green Sahara's megalakes). *SCIENCE A4.5; PROJECT
  P14.* Check: the before era's lakes are larger, or its rivers longer, not just repainted.
- **G27. Drought shifts are fast but not uniform:** some places hold water longer. *SCIENCE A4.7.*

## 5. People on the land

- **G28. Routes follow gentle slopes and reliable water;** pack routes stay under ~13% and zigzag above it; a 1,500 m
  escarpment needs ~11.5 km of path (switchbacks, a gorge or a spur). *SCIENCE A5.1, A5.5.* Check: grade between route
  points from heights (M1, TG1).
- **G29. Passes sit at low points in the rim,** often between fault segments. *SCIENCE A5.6.* Check: the road's rim
  crossing is the lowest nearby rim cell.
- **G30. The Afar salt trail is the route model:** ~160 km from over 2,000 m to below sea level, camps ~20 km apart at
  water; market towns where the highland and lowland legs meet. *SCIENCE A5.2–A5.3.*
- **G31. Settlements sit on water:** springs, fan toes, the first falls or the break of slope; on fans, away from the
  sheetflood channels. *SCIENCE A5.7–A5.9.* Check: every burg within ~2 cells of a named water source.
- **G32. High ground is chosen for defence and overlook.** *INFERRED A5.10 (no institutional source).*
- **G33. Extraction economies are old and simple** (Afar salt for 2,000+ years); a mine or quarry needs its route out.
  *SCIENCE A5.4.*

## 6. Scale honesty

- **G34. About two cells (~4.6 km) is the smallest feature that reliably reads;** 3–4 cells to recognise a shape.
  *SCIENCE A6.1.*
- **G35. Use the size table** (A6.2): escarpments, benches, volcanic ranges, pans and bajadas are map heights and paint;
  pools, lava lakes, craters, springs, switchbacks and fault scarps are markers or zone detail.
- **G36. Exaggeration is allowed and labelled:** Act I's pools, lava lake and Dead Spring are 10–100 times real size.
  Note it where environment art will read it (the act handoff's per-zone sheet). *INFERRED A6.3.*
- **G37. Some things can't be drawn:** land below sea level, a river split, seasonal versus permanent water. They go in
  labels, notes and dashed styles. *SOURCE A6.4.*
