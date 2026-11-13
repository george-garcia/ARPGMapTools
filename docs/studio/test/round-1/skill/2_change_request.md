# Answer to geography change request: the act's exit up the escarpment

**Request:** *Story function:* the act's exit. The main road continues past the upper city, up the escarpment, onto the
plateau above: the only way out of the basin toward the highlands, so the player must pass through the slaver city to
leave. *Feature:* frame `act1`, the main road from the upper city (op `now.route.*`) to the escarpment top. *Era:* now
(and before, if a road existed). *Proposed operations:* extend the main road with `add_route`. · **From:** the narrative
skill (`arpg-narrative`) · **Date answered:** 2026-11-13 · **Map read:** builds of 2026-11-06 (`now.map`, `before.map`),
read-only through the MCP server; ops at ARPGMapTools `d9872f9`.

## Decision

**Accepted with changes.** I'll draw the road from the upper city up the escarpment onto the plateau, now era only,
through the one natural ramp in the escarpment lip north of the city's shelf, with a terrain op that makes that ramp
explicit. I won't draw it as **the only way out of the basin toward the highlands**: the map doesn't support that today,
and the reason the city controls onward passage is an open canon question. The story beat that the player must pass
through the city to leave is already confirmed in the vault (the 2026-11-13 spine: "the way forward is through the
city"), and the road serves it. Whether geography makes the city a monopoly is George's call; three options are below.

(The road ops live in `world/eras/now/50-routes.json` with ids `now.road.main.*`; the request's `now.route.*` means
those.)

## Story beat and geography, separated

- **The story's (settled in the vault):** after the betrayal the return is sealed; the player fights through the upper city,
  beats the Act I boss and secures passage into Act II (Act I spine, 2026-11-13, confirmed). The main road through the
  pass into the city is the slavers' and travellers' road (README "Map decisions" 2026-11-03).
- **Not settled, and not mine to settle:** why or whether the city controls onward passage (README 2026-11-03 "still open";
  Slaver Faction open question 5, "What prevents people from using safer routes around the city?"); where Act II lies
  ("Act II and III hubs should not be committed yet"); the means of passage and what seals the return (spine, open).
- **The geography (mine):** whether a road can climb from the city to the plateau, where, at what grade, and what other
  ways out exist.

## Geography check

| Question | Answer | Rule |
|---|---|---|
| Does the land allow it (slope, rock, elevation)? | **Yes, easily, at one place.** Directly north of the city's shelf (h 48–50, ~1,000 m) the escarpment lip has a low notch at x 0.30–0.32: h 53 (1,225 m) at y 0.23–0.26, then 55 (1,370 m) on the plateau edge, against 58–62 (1,520–1,850 m) on either side. A road from the upper city through it climbs ~350 m in ~11 km, steepest leg 8%: under the ~13% pack-route limit with no switchbacks at map scale. Physically it reads as a **relay ramp**: the west escarpment segment (lip above the falls) and the north segment (lip above the mid-basin) step past each other at the city, and the city's shelf is the bench between them (G2–G3: segmented margins with low gaps where passes form). Everywhere else in the west and north wall the lip is a 500–900 m step within one or two cells. | G2, G3, G28, G29; M1 |
| Where does the water come from and go? | The road needs water, and has it: the falls stream crosses the plateau a few km west of the ramp and feeds the city (op `act1.river.falls`). That stream currently runs uphill across the plateau (review finding 1, BLOCKING); its fix (a graded valley) should land before or with this pass. The ramp itself carries no stream; nothing drains through it, so it needs no culvert or ford. | G7, G13, G28, G31 |
| Does it fit the era? | **Now:** yes, an extension of the existing main road (traffic to the plateau: the road the city lives on, G30: market towns where the highland and lowland legs meet). **Before:** the ramp exists in both eras (one terrain, P14), but the before map has no settlements or routes yet, and what stood at the city site and where the old caravan road led are open (P24). Drawing a before-era track would settle that, so I don't draw one; question 3 below. | P14, P24, K34 |
| Does it break a locked anchor or vault decision? | No. The city and Slums stay put (P21), the main road through the pass is unchanged (P22), and the upper-city combat maps keep their shelf. It adds a road; it doesn't say who controls it (P22 stays open). The "only way out" claim would settle an open question, so that part goes to George. | P1, P7, P21, P22 |
| Does it read at map scale, or is it zone-level detail? | The road and the ramp read at map scale (the ramp is ~3 km wide, about two cells: the readability floor, G34; the terrain op widens it to ~3 km of clean corridor). Gates, walls, switchbacks on the bench and the boss's position are zone detail for level design (H1, H2). | G34, G35, H1 |

### Is it the only way out toward the highlands? Not on this map

Measured as the shortest route a caravan could take at no more than 13% (cell-scale paths on the 2026-11-06 build,
`out-a/work/` scripts):

| Route from the Slums to the highland | Length | Steepest | Where it climbs |
|---|---|---|---|
| **Through the city and the ramp** | **~21 km** | ≤ 13% (the Slums-to-shelf step; the ramp itself ≤ 8%) | Up the falls slot or the city switchback to the shelf, then the ramp |
| Without the ramp: the basin's north corner | ~65 km to the plateau, ~75 km to the northern highland | ≤ 13% | Up the north wall at x ≈ 0.50, between the north escarpment and the basalt, where the north rim is only h 43–47 (625–840 m) |
| Without the ramp or the north corner: out the south-west pass | 150 km or more | ≤ 4% | Down to the lowland outside the pass (h 26–35), round and up the plateau's gentle south-west flank |

So the city sits on the **short** way up, by a factor of three, and the way with water. It isn't the only way: the north
corner is a real, gentler alternative, and the pass leads out to the lowland. The vault's own question ("why is going
around the town worse than going through it?", Path A 2026-10-26) is exactly this.

## What I'll draw (or would draw)

| Op id | File | Tool | Era | What it does |
|---|---|---|---|---|
| `act1.city-ramp.lower` | `world/base/10-act1-terrain.json`, right after `act1.falls-slot` | `sculpt` | both (base) | `set 52`, polygon [[0.315, 0.322], [0.329, 0.24], [0.302, 0.228], [0.288, 0.31]], feather 1.5 km, edge noise 1, seed 260. The ramp's lower half, from the shelf's north edge into the notch; replaces the noise-made notch (one stray h 60 cell sits in its mouth at (0.30, 0.27)) with a designed one, so a later roughen or seed change can't close it. Note: "Relay ramp between the west and north escarpment segments: the city's road onto the plateau (G2, G3, G29)". |
| `act1.city-ramp.upper` | same, next | `sculpt` | both (base) | `set 54`, polygon [[0.33, 0.276], [0.318, 0.161], [0.287, 0.169], [0.299, 0.284]], feather 2 km, edge noise 1, seed 261. The upper half, to the plateau edge (55). Runs after the lower one so the joint takes the higher value; heights rise 50 → 52 → 54 → 55 along the road. |
| `now.road.main.escarpment` | `world/eras/now/50-routes.json`, after `now.road.main.ascent` | `add_route` | now | `group: "main-road"`, points [[0.29, 0.345], [0.305, 0.30], [0.313, 0.262], [0.308, 0.225], [0.305, 0.185]]. Starts at the upper city burg so it joins the existing main road visually (there is no tool to extend a route, TG6). Note: "Main road onward from the upper city's north side, up the ramp through the escarpment lip onto the plateau: ~350 m of climb at ≤ 8%. Slaves, merchants and travellers use it. Where it leads beyond the act is open (Act II)." |
| `now.burg.upper-camp` (edit) | `world/eras/now/40-settlements.json` | `add_burg` | now | Add one sentence to the note: "The main road leaves the upper city northward up the escarpment ramp onto the plateau; whether the city controls passage is open." |
| `now.label.region` (edit) | `world/eras/now/60-markers-labels.json` | `add_label` | now | Add a pointer to the 2026-11-13 spine and this answer to the region note (review finding 15). |

Ends on the plateau edge (0.305, 0.185), about 4 km past the lip: it shows the climb and the direction without deciding
where Act II is. Drawing order kept (P10): terrain in `base/`, the road in `50-routes`, notes in `60-*`.

**Validation** (review.md §2): rebuild both eras (`npm run world`, `npm run world before`) with no failed op; profile the
road (heights at each point; no leg over 13%); `query_cells` on the ramp corridor (50–55, monotonic) and on the lip
either side (unchanged); lowest-ground and lake-count checks unchanged; before/after 2D frame shots (heightmap, biomes),
the terrain viewer's overview and low views (the ramp should read as a notch behind the city), Gaea re-export (terrain
changed); `export_gaea`'s `main-road` mask now includes the new line; re-run the zone graph with the exit anchor.

What stays unchanged: the city's and the Slums' positions and the shelf (P21); the main road through the pass and up to
the city (`now.road.main.approach`, `.ascent`); the falls slot and the falls stream's course; the escarpment lip on
either side of the ramp; every vault anchor.

## The beat "the only way out": three ways to keep it

The beat (the player must pass through the city to leave) is kept by the story already; these are about whether the
**geography** also makes the city a chokepoint for everyone. Each settles canon, so George chooses:

1. **Short way, and the way with water (no further terrain change).** The ramp is the only short, graded climb out of the
   basin, and the only one with water on its far side (the falls stream). The north corner is three times longer, climbs
   past the basalt fields under an active volcano and has no water on the map in the present day; the south-west pass leads
   back out to the lowland the slave caravans come from. Real escarpment towns hold their routes this way (G30). Cost:
   none on the map; it states why the city controls passage, which has been open since 2026-11-03.
2. **Make it the only practical climb (terrain).** Raise `act1.rim.north` from h 45 to ~55 between x 0.45 and 0.65 so the
   north escarpment runs unbroken to the volcano's flank, and steepen the plateau's south-west flank outside the pass. The
   ramp becomes the only graded climb within ~100 km. Cost: a larger terrain pass; the north rim is no longer a low saddle
   (the volcano's setting changes a little; the basalt and volcano stay where P18 puts them), and the region's outer slopes
   change, which affects how the act blends into the continent (P17). Geologically fine: rift shoulders are often
   continuous for a fault segment's length (~60 km, G3).
3. **Control by law and force (no map change).** The other ways exist; the slavers patrol them or hold the water, and the
   protagonist is wanted. Cost: none on the map; canon about the faction (its open questions 2 and 5).

My suggestion: option 1, since it uses what the map already says, and option 2's north-rim change only if the act's
exploration should never show a northern way up.

## Downstream

- **Zone graph:** one new node and link: `exit` (escarpment top, anchor (0.305, 0.20)) and `uppercity → exit`, bearing
  **9° N**, return 189° S, status *proposed* until George answers. Screen direction: up-screen and slightly left (bearing −
  45° = −36°), so the act ends climbing away from the camera, which suits level design's T7 and the "climb out at the end"
  shape (H14). Graph checks: the upper city's entrance (from the Slums, 209° SSW) and exit (9°) differ by 160° (H7 passes);
  the escarpment lies west and north-west of the city (camera side to the west, H10 flag). File: `out-a/act1.json`;
  table: `out-a/act1_zone_graph.md`.
- **Per-zone geography in the handoff:** the upper-city cluster and the new exit sheet (`3_handoff.md`).
- **The 4–6 upper-city maps** gain a physical direction: entered from the Slums side (south, the abandoned district's
  route is OPEN), left by the ramp to the north. Level design should keep the final exit on the north side of the last
  map (T6) and the escarpment lip tall on the north and east, low on the camera side.
- **Decisions for George:**
  1. Should the geography make the city the only practical way to the highlands? Options 1–3 above.
  2. Is "toward the highlands" (west and north-west, toward the central range behind the plateau) the direction Act II lies
     in? The road shows a direction once drawn; I've ended it 4 km onto the plateau to commit as little as possible.
  3. Did a road climb the ramp before the catastrophe? If the old caravan road (now fading out mid-basin) once climbed
     here, the before map gets a track on the same line (and the now map's old road could be redrawn to lead there), which
     would also answer "where the old caravan road led" (P24). If not, the ramp stays empty in the before era.
  4. Is the leader's "abandoned route" into the upper city a separate way up (an old track, an aqueduct, a mine level),
     and should the map show it? It needs its own physical line; the falls slot (floor h 46, ~780 m, halfway between the
     Slums and the bench, and the only way from the Slums toward the bench at ≤ 13% on today's terrain) is the obvious
     candidate, but that is a story choice.
