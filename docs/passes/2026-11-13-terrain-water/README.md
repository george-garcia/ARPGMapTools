# Map pass: Act I terrain and water (the city's climb, the raised north rim, water that runs downhill)

**Date:** 2026-11-13 · **Era(s):** both (one shared terrain; before-era water designed) · **Frame:** act1 · **Branch:** `map-pass-terrain-water`
**Asked by:** George's decisions of 13 Nov 2026 (P28, P29) and the geography review's terrain-and-water findings
(W1, W3, W4, W5, W7, A1, A3, A5, G-a, K-a, P-b), under standing autonomy (P7) where they settle no canon.

Heights below are Azgaar units (land 20–100; metres = (h − 18)²: 21 = 9 m, 38 = 400 m, 50 = 1,024 m, 55 = 1,369 m,
69 = 2,601 m). Points are `act1` frame-local (x west → east, y north → south; 1 x unit = 100 km, 1 y unit = 64 km).

## 1. What changed and why

**The city's climb (P28, W1).** The falls stream used to climb 710 m on the plateau before it fell. It now runs in a graded
valley from its source (57) to a notch in the escarpment's lip (54), then down a stepped gorge (52, 50, 47, 44) to the
Slums (38): 38 cells with no uphill step. The gorge replaces the old flat falls slot; the upper city's shelf (50) sits beside
it at the city's water intake. This gorge-and-valley is the graded climb: from the Slums onto the plateau in 12.8 km at a pack
grade of 13 % or less (14.8 km at 10 %). The falls themselves are the drop from the gorge mouth to the Slums; at map scale
they read as cascades, and the real falls is zone-scale (a 2 km cell can't hold it).

**The north rim raised (P29).** The north rim between the plateau and the volcano was a 43–50 saddle that gave the
gentlest climb in the act (22 km at 13 %, nowhere near the city). It is now one fault block at 56 (1,444 m) running from the
plateau's east edge past the volcano to the east horst, with a sharp scarp on its south face. To make the city's ramp the
only practical climb, three more things were needed, found by repeated grade-limited searches: the east horst has a sharp
inner face (its north end is a lower block, so it can't ramp up onto the north block); the volcano stands on the north
block with a steep foot, so the cone is no stair onto the rim; and the escarpment's steep face runs on south-west along the
Caravan pass to its mouth, so the pass is a defile and not a way up. Ops that keep a scarp sharp are drawn after the floor is
carved, with a near-zero feather and clamped roughness. *Bent for play (P8):* a real horst would have canyons a party could
climb; here the basin is closed except for the pass and the city, which is what the story needs (captives, the city's
control of the way out).

**Water that runs downhill and ends where it should (W3, W4, W5, W7).** The washes run in cut channels (a graded head off
the basalt, the southern limb and its braid, the terrace branch now ending on the pan). The pools were re-cut so the pan's
brine pools are the lowest water (20.9) and every other surface is at least one unit higher: acid pools f and c set back on
the dome; the Dead Spring hollow raised to 30 so its pools sit at 28.9 and 27.9. Acid pools a and d are separate lakes again,
and every lake has a `[placeholder]` name. In the before era the generated rivers that all ended on the acid dome are removed
and the water is drawn: the falls stream runs on as Spring Brook to the Spring, which drains through its lower pool and an
outflow channel to the pan's south-west arm (a small playa arm cut for it). The dome's hot springs are salt, not fresh. The
size of the old salt lake on the pan is still George's (P24) and is not drawn.

**Landforms (A1, A3, A5, G-a, K-a, P-b).** The south rim is two offset (en-echelon) segments, the east one stepped back
about 4 km, with a relay saddle (42) between them that stays above the pass; the east horst's inner face has two re-entrants
with fans and a spur. The volcano is a stacked cone drawn in km (summit about 2,600 m) with a fan apron down to the pan; the
1-cell lava-lake shaft is gone and the summit lava lake lives in the volcano marker's note (a sub-cell crater can't read).
Two benches step the escarpment south of the Slums and along the pass. The salt pan reaches west into an arm between the
basalt and the terraces and into the east re-entrants' mouths, without touching the dome or the gypsum; the basalt lobe
there was trimmed to meet it. The Caravan pass is a col at 38 (400 m) with a limb at 36 falling each way.

**Era ops moved because the ground moved.** The wash routes' points (W3); the `set_lakes` boxes for acid pools c, d and f in
both eras; the brine and Dead Spring `set_lakes` split one box per lake; the present-day `Salt Flats` and `Gravel Flats` paint
polygons widened to cover the new pan arm, the re-entrants and the floor south of the dome (forced: the terrain under them
changed). No pass-2 item (biome colours, before-era rock paint, labels, notes, roads) was touched. Every burg and marker still
lands on sensible ground (upper city h49 on its shelf, Slums h39 on the terrace, the volcano marker on the cone at h66).

## 2. Ops

| Op id | File | Tool | What it does |
|---|---|---|---|
| `act1.falls-valley.1`–`.4` | `world/base/10-act1-terrain.json` | sculpt set 57→54 | Graded valley along the falls stream (corridors 4.6 km wide along the river line) |
| `act1.falls-gorge.1`–`.4` | same | sculpt set 52, 50, 47, 44 | Stepped gorge from the notch to the Slums; replaces `act1.falls-slot` |
| `act1.rim.north`, `act1.roughen.north` | same | sculpt set 56 (feather 0.3) + clamped roughen | The north fault block and its scarp, drawn after the floor (P29) |
| `act1.highlands` | same | sculpt set 58 | Polygon extended south-west along the Caravan pass to its mouth |
| `act1.rim.east`, `.crest-north`, `.crest-south` | same | sculpt | Horst with re-entrants and a spur; segment crests vary |
| `act1.rim.east.face-*`, `act1.roughen.east-face-*` | same | sculpt set 45/47/48 + clamped roughen | Sharp inner face of the horst, drawn after the floor |
| `act1.rim.south.west`, `.east`, `.relay` | same | sculpt set 50 / 45 / 42 | En-echelon south rim; replaces `act1.rim.south` |
| `act1.basin` | same | sculpt set 33 | South and east edges follow the new rims |
| `act1.caravan-pass`, `.inner`, `.outer` | same | sculpt set 38 / 36 / 36 | Col and limbs |
| `act1.bench.south-1`, `-2` | same | sculpt set 47 | Escarpment benches |
| `act1.volcano`, `.flank`, `.upper`, `.summit`, `.peak`, `.smooth` | same | sculpt set 54→71, smooth | Stacked cone on the north block; replaces `act1.volcano`/`.crater` |
| `act1.fans.volcano.*`, `act1.fans.east.1`–`.2` | same | sculpt set 36/28, 27/26 | Fans between steep ground and the pan |
| `act1.salt-pan`, `act1.salt-pan.south-west`, `act1.basalt.a` | same | sculpt | Wider pan (north-east arm, re-entrant mouths), the outflow's playa arm; basalt lobe trimmed |
| `act1.washes.head`, `.south.1`, `.braid`, `.south.2` | same | sculpt set 28/26/26/25 | Wash channels |
| `act1.spring-brook.1`–`.3`, `act1.spring-outflow.0`–`.3` | same | sculpt | Channels for the before era's streams (dry today) |
| `act1.dead-spring`, `act1.water.acid.c/d/f`, `act1.water.spring.*` | same | sculpt | Hollow raised to 30; pools moved or re-cut; `act1.water.lava-lake` removed |
| `act1.wash.braid`, `act1.wash.terraces` | `world/eras/common/10-water.json` | add_route | Points moved into the channels |
| `act1.lakes.brine.west/.east`, `act1.lakes.mineral` | same | set_lakes | One box and a `[placeholder]` name per lake; `act1.lakes.lava` removed |
| `now.lakes.*` | `world/eras/now/20-water.json` | set_lakes | Boxes for c, d, f; names; Dead Spring split into its two pools |
| `before.lakes.*` | `world/eras/before/20-water.json` | set_lakes | Same boxes; hot springs `salt`; names |
| `before.act1.rivers.clear` | `world/eras/before/05-rivers.json` (new) | remove_rivers | Drops the generated rivers draining into Act I (14) |
| `before.river.spring-brook`, `.spring-outlet`, `.spring-outflow` | `world/eras/before/20-water.json` | add_river | The before era's designed streams |
| `now.biome.salt`, `now.biome.basin-ground` | `world/eras/now/30-biomes.json` | paint_biome | Polygons widened to the new pan and floor (colours unchanged) |

Drawing order kept (P10): terrain and its finalize all in `base/`; nothing after an era's water touches terrain. The
`base/` file went from 47 to 88 ops. `tools/gaea/act1.terrain`: Terrain Height 8,546 → 6,158 m (= 2 × the new export's
3,079 m) and its Ratio; George, please reopen it in Gaea.

## 3. Evidence

All images are in this folder: `before/` is the review build of 13 Nov (ops at `25bda7c`), `after/` this pass's build.
They are resized to 1,280 px where larger and colour-quantized.

| View | Before | After |
|---|---|---|
| 2D heightmap with rivers, lakes, routes (now) | `before/review-now-act1-rivers-height.png` | `after/review-now-act1-rivers-height.png` |
| 2D biomes, frame (now) | `before/now-act1-biomes.png` | `after/now-act1-biomes.png` |
| 2D heightmap, frame (now) | `before/now-act1-heightmap.png` | `after/now-act1-heightmap.png` |
| 3D overview / low (terrain viewer, now) | `before/now-act1-3d-overview.png`, `before/now-act1-3d-low.png` | `after/now-act1-3d-overview.png`, `after/now-act1-3d-low.png` |
| Before era: rivers over heights / biomes / 3D | `before/review-before-act1-rivers-height.png`, `before/before-act1-biomes.png`, `before/before-act1-3d-overview.png` | same names in `after/` |
| Continent: heightmap / Azgaar 3D | `before/now-heightmap.png`, `before/now-3d.png` | `after/now-heightmap.png`, `after/now-3d.png` |

Compared with `world/reference/act1-overview.jpg`: the salt flats now take the eastern floor and its north-east arm as the
overview shows; the north wall is continuous; the escarpment, Slums, outpost, washes, dome and Dead Spring sit where they did.

**Checks run** (`references/review.md` §2), all on the built `.map` files:

1. **Builds:** `npm run world` 157 ops ok, `npm run world before` 121 ops ok; no failed op, no `pageErrors`. Heights are
   identical in the two eras (0 of 44,639 cells differ).
2. **Lakes:** 13 in the frame in each era, as intended: brine west and east, acid a–i (a and d separate: 8 and 5 cells),
   the teal mineral pool, the Dead Spring's main and lower pools (the lava lake is deliberately no longer a lake). One name
   each, all `[placeholder]`. Before the pass: 13 lakes where 14 were intended, 10 with random names.
3. **Lowest ground:** lowest land h21 (73 cells, all pan); no land below it (before: one h20 cell). Brine pools 20.9; the
   next water is 21.9 (acid d, e, f, h, i), then 22.9 (b, c), 23.9 (a, teal pool), 27.9 and 28.9 (Dead Spring). Before:
   acid f 19.9, acid c and the Dead Spring 20.9.
4. **Drainage, every drawn line read cell by cell:** falls stream 57 → 38, no uphill step (before: 16 uphill steps, +9
   units); main wash 28 → pool, braid 26 → 25, terrace branch 26 → pan 21, none uphill (before: +8 and +4). Before era:
   Spring Brook 38 → The Spring, outlet 31 → lower pool, outflow 28 → 21 on the pan; no generated river left in the frame.
   Present day: only the falls stream (designed to end at the Slums).
5. **The climb onto the plateau** (the review's `paths.py`: shortest path over cells with every leg under the grade,
   "plateau" = h ≥ 55 west of x 0.75; the city = 9 km round (0.27, 0.37)), then repeated with the crux of each bypass
   banned to list every distinct bypass:

   | Grade | From the Slums | Any floor cell | Avoiding the city |
   |---|---|---|---|
   | ≤ 13 % | 12.8 km, up the gorge (39, 46, 50, 52, 55) | 18.3 km, same way | 106.5 km: out through the Caravan pass, 13 km west along the outer lowland, up the plateau's back slope |
   | ≤ 10 % | 14.8 km, same way | 21.8 km, same way | 106.8 km, the same outside route |
   | before the pass, ≤ 13 % | 24.2 km | 22.4 km (north rim) | 22.4 km by the north rim |

   All five bypasses found at each grade leave the rift: four by the pass and the outer lowland (106–143 km), one over the
   east horst and round by the north-east foothills (149 km, at 10 %). None stays inside the rift, and none climbs from
   the pass corridor itself. At 20 % (not a pack-route grade) the escarpment south of the Slums can be climbed (22 km).
6. **Edge scan of the rims** (first cell ≥ 42 from inside): east margin spread 3.3 km, x 0.943–1.066 (before 1.2 km);
   south margin 2.6 km, y 0.896–1.055 (before 1.1 km).
7. **Ground shares:** Salt Flats 92 of 795 cells in the basin polygon, 11.6 % (before 6.7 %); acid complex 113 (14 %).
   Salt cells within 3.4 km of ground ≥ 40: 11 of 92 (before 20 of 62).
8. **Volcano form:** north–south transect through it 55, 54, 59, 64, 64, 69, 69, 69, 66, 66, 59, 59, 55, then 28 (apron),
   24, 21 (pan); before: a 66–67 table round one h18 shaft.
9. **Zone graph** (`zone_graph.mjs` on a copy of the review's `act1.json`): exit 0, output identical to the review's (no
   anchor moved; the volcano anchor now lands on the summit instead of the lava pit). H7–H11 results are unchanged from the
   review.
10. **Gaea pre-flight** (`gaea_check_heights.py --export world/build/gaea/now-act1 --terrain tools/gaea/act1.terrain`):
    4 passed, 0 failed after the Terrain Height update (it failed first, as it should when the relief changes). No acid pool
    at or below the brine level in the export (before: two); no land outside the pan below it. The before-era export also
    passes (its warnings, no salt mask and empty acid/road masks, are pass-2 paint, finding E1).
11. **`npm run smoke`:** not run; no tool changed.

**How the heights were read.** Lake surfaces, river cells and route heights have no named tool yet (gaps TG1, TG2): they
came from the review's read-only dump client (`open_map`, `list`, `query_cells` tiles, and four logged read-only `run_js`
reads per era), run on this pass's builds. The terrain was designed against an offline copy of the `sculpt` tool's
arithmetic on the grid dumped after `new_map`; it reproduced the review build's heights exactly (0 of 100,014 grid cells
differ) before it was used.

## 4. Rules applied

| Rule | How this pass meets it |
|---|---|
| Water runs downhill (G7) | Every drawn river and wash read cell by cell: no uphill step |
| Every river ends at a sea, a lake or the sink (G8, M7) | Before era: Brook → Spring → lower pool → pan; generated rivers removed |
| Closed lakes are salty (G9) | Dome pools salt in both eras; the Spring is fresh because it drains |
| The pan is the lowest ground, land and water (G10, P19) | Land min h21 = pan; brine 20.9, every other surface ≥ 21.9 |
| A falls needs a graded catchment and cuts back into the scarp (G13) | Graded valley, notch at 54, gorge below |
| Lopsided, segmented margins; never a box (G1–G3, P17) | En-echelon south rim, re-entrants and spur on the east; edge spread 2.6–3.3 km |
| Benches on the escarpment (G2) | Two benches south of the Slums and on the pass wall |
| Coarse to fine downslope; fans off scarps (G16, G17) | Fans in the re-entrants and below the volcano |
| Passes at a low point with ground falling both ways (G29) | Pass col 38 with limbs at 36; relay saddle 42 stays above it |
| Pack routes under ~13 % (G28) | The city's climb is graded at cell scale (≤ 10 %); every other way onto the plateau is steeper |
| Landmark forms read (G4, G34) | Stacked cone; no sub-cell crater or shaft |
| Name every lake (M11); placeholders tagged (P12) | 13 lakes, 13 `[placeholder]` names |
| One terrain, two eras (P14) | 0 height differences between the eras |

## 5. Open and next

**Decisions for George**

- **The way round outside.** From the basin floor the only graded climb onto the plateau is the city's (P28, P29). A party
  that leaves by the Caravan pass can still walk about 13 km west along the outer lowland and climb the plateau's gentle
  back slope (106 km in all), and over the east horst there is a 149 km way round by the north-east foothills. That is how
  any highland is reached from the wider continent. Is that fine (the pass is the slavers' own road, so the city still
  controls it), or should the plateau's outer flanks be walled too (a large change to the continent around the act)?
- **A sealed basin.** The east horst and the north block now have no graded way up from the floor. That suits the story
  (a basin captives can't walk out of), but real horsts have canyons. Keep, or open one canyon in the horst to the eastern
  lowland (it would not reach the plateau)?
- **The volcano on the north block.** To keep it from being a stair onto the rim, the cone stands on the raised block with a
  steep foot; in 3D it reads as a dark massif with a peak rather than a lone cone. Pass 2 could paint the block as escarpment
  and keep Recent Basalt on the cone and its flows so the cone stands out. The lava lake is now only the marker's note.
- **Salt share.** The salt flats are 11.6 % of the basin floor; pass 2's "dunes off the pan" (G-c) would bring it to about
  12.7 %. Enough, or widen further (it would cost basalt or terraces)?
- **Still open from the review:** the before era's old salt lake (P24, not drawn), what feeds the falls (W2), the Ruined
  Outpost's water.

**Follow-ups**

- Pass 2 (ground, colour and notes): before-era rock and salt paint (E1); rim paint following the crest (C1); fans, mud and
  pass paint (G-b); dunes off the pan (G-c); wash and terrace colours (K-b, K-c); marker tags and region note (K-e) — the
  region note should now also say the city's climb is the only graded way onto the plateau; the Dead Spring marker (K-f);
  the extra switchback (P-a).
- Gaea: George to reopen `tools/gaea/act1.terrain` (Terrain Height 6,158 m) and rebuild; the north block and the horst's
  sharp faces are new escarpment strata to shape.
- Tools: propose TG1 (`profile`, lake surface heights) and TG2 (`list kind:"rivers"`); every drainage and climb number here
  needed a dev read. A named grade-limited path tool would make the climb check repeatable without scripts.
