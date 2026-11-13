# Track A: physical geography rules for a plausible map

Scope: the rules a continent map with ~2.3 km Azgaar cells and a ~100 km rift basin (Act I) has to obey to look plausible.
They cover tectonics, water, arid landforms, climate and biomes, human geography, and what can be shown at map scale.
George's rule still applies: gameplay and aesthetics come first and realism second. These rules say what is plausible
and how to check it. They do not decide canon.

All sources were read on 2026-11-13. Source numbers [n] point to the list at the end. Tags follow the shared brief:
SCIENCE, OBSERVED, SOURCE (Azgaar or repo code), INFERRED (our own reasoning, labelled as such). There are 58 rules
plus 5 toolbox facts (T1–T5).

---

## 0. Azgaar checking toolbox (SOURCE)

The checks below use these facts about Azgaar v1.156.0 (pinned) and this repo's MCP server.

| # | Fact | Source |
|---|---|---|
| T1 | Heights run 0–100. Land is 20 or more; anything below 20 is water. Metres = (h − 18)^exponent. The default exponent is 2, and `world/config.json` does not override it. So h21 ≈ 9 m, h26 ≈ 64 m, h33 ≈ 225 m, h40 ≈ 484 m, h50 ≈ 1,024 m, h58 ≈ 1,600 m, h66 ≈ 2,300 m. **Azgaar cannot show land below sea level**: the Danakil's −120 m floor has to be h≈21 plus a label or note. | [46] `lakes.ts` L59, `temperature-generator.ts` L41-44, `options-model.ts` L79 |
| T2 | No height-profile tool exists. To take a **transect**, run `query_cells` with a thin polygon strip in frame coordinates and `include_cells`, or render `screenshot_3d` with the `low` camera. | [47] `index.ts` |
| T3 | Rivers: each cell drains to one downhill cell, so rivers only **merge** (a confluence) and **never split**. Depressions are filled so that flow passes through lakes. A river needs a flux of at least 30. There is no `list rivers` tool, so check rivers with `screenshot` layers `["heightmap","rivers","lakes"]`. | [46] `river-generator.ts` L17, L300-331, L540 |
| T4 | Lakes: a lake is `closed` if no lower water can be reached within 20 height units. It gets an outlet only if inflow > evaporation. Its subtype is `salt` if it has no outlet and evaporation > inflow, and `dry` if evaporation > 4 × inflow (when it also has no inlets). `list kind:"features"` returns each lake's subtype. | [46] `lakes.ts` L67-121, `features-generator.ts` L392-401 |
| T5 | Climate: winds cross the grid along rows and columns. Rain increases on uphill steps (orographic rain), and a cell above h85 blocks the wind entirely. Temperature drops 6.5 °C per km. Biomes come from a moisture × temperature matrix. Hot desert = temperature ≥25 °C, no river and moisture <8. A river adds moisture to its cells. The layers `precipitation`, `temperature` and `biomes` show the result. | [46] `precipitation-generator.ts` L24-90, `biomes-generator.ts` L113-213 |

---

## 1. Tectonics and landforms

**A1.1 A rift floor is a block dropped between normal faults.** It sits in a "horst and graben" landscape, where down-dropped
basins alternate with raised blocks. [SCIENCE 3, 4]
*Mistake:* the basin is a smooth bowl with even slopes on every side, like a crater.
*Check:* take transects (T2) across each rim. A faulted side shows a step of several height units within 1–2 cells.

**A1.2 Rift basins are usually asymmetric (half-grabens).** One master border fault makes a steep, narrow footwall scarp.
The opposite side is a gentler, broader dip slope. Footwall uplift is about 10% of hanging-wall subsidence. [SCIENCE 8]
Death Valley is the observed case: the floor tilts toward the Black Mountains front. [OBSERVED/SCIENCE 31]
*Mistake:* two identical escarpments facing each other with no reason given.
*Check:* compare west and east transects. If both rims are steep, say why. The Danakil's east side is a separate
fault-bounded horst [16], so a steep east rim can be justified.

**A1.3 Rift shoulders stand above the land around them.** Rift flanks are raised by flexural rebound when the faults
unload the crust. Examples: about 545 m above the Rhine graben, and about 1,500–2,000 m at Broken Ridge. [SCIENCE 9]
*Mistake:* the land behind the lip is lower than the lip only by noise, or falls straight into a lowland.
*Check:* a transect outward from the lip should peak at or near the lip and then decline gradually.
`act1.shoulders` and `act1.highlands` already do this.

**A1.4 Real numbers for the Act I analogue (the Western Afar Margin).** Plateau 2,500–3,500 m. Afar floor about 500 m,
going below sea level in the north. Relief between plateau and graben floors is 1,500–2,000 m. Marginal grabens are
10–20 km wide and tens of km long, with floors at about 500–1,500 m. Tilted fault blocks are 1–5 km wide. [SCIENCE 10]
Act I's lip (h58, about 1,600 m in Azgaar metres) above the floor (h33, about 225 m) falls within this range.
*Check:* `query_cells` on the lip and on the floor, then convert with T1.

**A1.5 An escarpment is a stepped fault system, not one cliff.** In the Western Afar Margin, large early escarpment faults
were followed by antithetic faults and marginal grabens, so the margin has benches. [SCIENCE 10, 11]
This is the real-world basis for a city shelf part-way down the escarpment: Act I's upper-city shelf is h50, about
540 m above the Slums terrace at h40. [INFERRED]
*Mistake:* a single ramp of even slope from plateau to floor.
*Check:* `screenshot_3d` low camera; a transect through the city should show steps.

**A1.6 Rift basins are long along the rift axis.** The Danakil depression trends NNW, and Erta Ale's caldera is elongated
NNW–SSE, "the main tectonic direction". [SCIENCE 14, 18] For scale: the Rhine graben is 35–45 km wide and about 300 km
long [9]; Main Ethiopian Rift magmatic segments are about 20 × 60 km [12]; marginal grabens are 10–20 km × tens of km
[10]. The axial ratios run from about 3:1 to 8:1. [INFERRED from these figures]
*Mistake:* a square basin, or rims running parallel to the frame edges.
*Check:* `screenshot` layer `heightmap` of `act1` plus a margin. Does the basin's long axis follow a structural trend,
and do its edges avoid the frame's straight lines?

**A1.7 Margins are segmented, not ruler-straight.** Border faults are about 60 km long and step en echelon.
[SCIENCE 12] Between segments, transfer zones form topographic lows [SCIENCE 13], and large drainages concentrate at
these overlaps [SCIENCE 8].
*Mistake:* one unbroken straight escarpment across the whole region.
*Check:* the escarpment line in a heightmap screenshot should be offset every few tens of km. Passes, big fans and river
gaps should sit at the offsets.

**A1.8 "Why a region isn't a rectangle": put A1.2, A1.6 and A1.7 together.** The outline follows fault segments, the
rims vary in height, and the gaps sit at transfer zones. [INFERRED synthesis]
*Check:* no straight rim longer than about 10 cells (about 23 km) unless a single fault segment is meant.

**A1.9 Volcanoes in a rift sit on the axis, in axial volcanic ranges.** The Erta Ale range belongs to NW–SE axial ranges
"up to 80km long and 700m high" [SCIENCE 13]. Erta Ale is a basaltic shield about 500 m high with a base about 50 km
across [SCIENCE 14]. Dallol sits on the Erta Ale axial segment [SCIENCE 15]. Some off-axis volcanic zones sit near the
rift flanks [SCIENCE 12].
*Mistake:* a big volcano on the plateau far from any fault, or a lone cone with no line of related vents.
*Note:* Act I's volcano (h66, about 2,300 m) is far taller than the Danakil's axial shields. A stratovolcano like Alid,
which rises about 700 m above its graben floor [SCIENCE 46a], is closer. The volcano's height is a gameplay choice to
record, not an error.
*Check:* the volcano's cell heights against the floor, and its position against the basin axis.

**A1.10 Young lava is darker.** Basalt flows read as dark tones, and the youngest are the darkest. [SCIENCE/OBSERVED 1, 2]
*Check:* in the biome paint, the basalt lobes nearest the active vent should be darkest (Act I already does this).

**A1.11 Rift floors are flat because they are filled.** More than 11,000 ft of sediment and salt lies under Badwater [SCIENCE 5].
The Danakil centre holds evaporite sequences 1,000 m thick [SCIENCE 16]. Danakil salt gets thicker eastward from the
western margin [SCIENCE 18].
*Mistake:* a lumpy floor with internal ridges that are not volcanic or a fault block.
*Check:* `query_cells` over the floor away from the volcano and terraces. Expect a small min–max spread (a few units).

**A1.12 Faults keep moving and cut the young surface.** Holocene fault scarps step the fans south of Badwater, and the
basin drops in large earthquakes every couple of thousand years [SCIENCE 6]. These scarps are metres high, so they belong
to zone detail (§6).

**A1.13 Big plateau rivers often drain away from the rift.** The Blue Nile and Tekeze drain west off the Ethiopian
Plateau and have cut a gorge up to 1.6 km deep. The plateau's mean elevation is 2.5 km. [SCIENCE 39]
Only short, steep streams and a few through-going rivers enter the rift: the Awash reaches Lake Abhe [SCIENCE 35].
*Mistake:* many large rivers pouring over the escarpment.
*Check:* count the rivers crossing the escarpment line (T3 screenshot). Expect one or two, at gaps.

**A1.14 Neighbouring regions can repeat the extensional pattern.** In the Basin and Range, ranges and basins alternate,
the crust is stretched by up to 100%, and in the Great Basin "virtually no ground water escapes to the oceans" [SCIENCE 32].
This gives a plausible template for land beyond Act I if more closed basins are wanted. [INFERRED]

---

## 2. Hydrology

**A2.1 Water flows down-gradient to one outlet per watershed.** Divides follow ridges, and basins nest inside basins.
[SCIENCE 20]
*Mistake:* a river crossing a ridge, or running along a crest.
*Check:* the `heightmap` and `rivers` layers together. Hand-drawn `add_river` paths need a transect, because Azgaar does
not check that a hand-drawn river runs downhill. [INFERRED from 47]

**A2.2 Rivers join; they rarely split.** Bifurcations happen on alluvial fans, braided rivers, lowland plains and deltas,
and they are "generally unstable" [SCIENCE 21]. Azgaar never splits a river (T3).
*Mistake:* a river forking into two branches that reach different basins or seas.
*Check:* screenshot. Draw any split only on a fan or delta, and draw it as dashed washes (`add_route`), not as rivers.

**A2.3 Every river ends at a sea, a lake or a closed basin's sink.** Endorheic basins cover about one fifth of the
land surface [SCIENCE 22]. In deserts, rivers may also die out at a fan toe or playa through infiltration and
evaporation [SCIENCE 25, 26].
*Mistake:* a perennial river ending in the middle of a plain in a wet climate.
*Check:* follow each river to its last cell. It should end at an ocean, a lake feature (`list features`), or the pan.

**A2.4 Closed lakes exist only where evaporation beats inflow, and they are salty.** Closed lakes occur only in arid and
semiarid regions. Their salinity runs from under 1% to over 25%, and their area changes far more than an open lake's
[SCIENCE 23]. If inflow rises above evaporation, the lake rises to its lowest rim point, overflows and turns fresh.
[INFERRED from 23] Azgaar models the same balance (T4).
*Mistake:* a fresh, blue, outlet-less lake in a desert; or a wetter "before" era whose terminal lake keeps the
present-day size.
*Check:* `list kind:"features"` with `frame:"act1"`. A terminal lake should be `salt` or `dry`. A `freshwater` lake
with no outlet is a red flag. In the before era, check whether the lake overflowed and where it went.

**A2.5 The lowest ground is the playa or salt pan.** A playa is an ephemeral lake in low ground with closed drainage
[SCIENCE 25]. Death Valley's pan sits at the basin's lowest point, −282 ft [SCIENCE 5, 7].
*Check:* `query_cells` over the frame. The lowest land (h≥20) should be in the pan (h21 in Act I). The pools are water
(h17–18) inside it.

**A2.6 The pan sits close to the deepest subsidence, pushed off it by fans.** Lakes and playas form "as close to the
locus of maximum subsidence as the footwall-sourced fans will allow" [SCIENCE 8]. In the Danakil, salt thickens
eastward away from the western margin [SCIENCE 18].
*Check:* Act I's pan sits east, away from the western escarpment. That is plausible if the western fans are large
or the east rim is a faulted horst. Record which explanation the map uses.

**A2.7 A desert basin's perennial water comes from outside it.** Exotic streams rise in a wetter region and then cross
the desert [SCIENCE 25]. The Awash River comes down from the Ethiopian plateau and ends in Lake Abhe, inside closed
Afar [SCIENCE 35].
*Mistake:* a perennial river rising on the dry basin floor.
*Check:* the river's source cells should lie on the plateau, where the `precipitation` layer is high.

**A2.8 Most desert channels are dry washes that flood in bursts.** Short, intense rain sends flash floods down washes,
arroyos and wadis [SCIENCE 25]. Ephemeral streams from both rims flood Lake Asale seasonally [SCIENCE 18]. Caravans
avoid both flooded and fully dry riverbeds [SCIENCE 40].
*Map rule:* draw washes as dashed seasonal lines (Act I does this) and not as Azgaar rivers, which read as perennial.

**A2.9 Springs appear where groundwater meets the surface.** That happens on hillsides, valley bottoms and lakebeds
[SCIENCE 24]. In Death Valley there are four settings [SCIENCE 7]:
- the largest springs, along high-angle faults;
- springs where groundwater is ponded behind an impervious barrier;
- a ring of springs around the salt pan's edge, where gravel and sand grade into silt;
- small springs at thrust faults in the mountains.
Thermal springs sit in volcanic areas or where deep water rises fast through a crevice [SCIENCE 24].
*Mistake:* a spring on a ridge crest, or in the middle of a gravel fan with no barrier.
*Check:* a spring marker's cell should sit at the escarpment foot or fault line, at a fan toe, or at the pan margin.

**A2.10 Waterfalls sit where a stream crosses a scarp, and they cut back into it.** Falls retreat upstream through
plunge-pool erosion and undercutting, leaving amphitheatre-headed gorges. Streams with small catchments (under about
5 km²) stay "hanging" [SCIENCE 27].
*Mistake:* a waterfall on a straight, un-notched lip, or a big fall fed by a tiny catchment.
*Check:* the notch cells (`act1.falls-slot`, h46) should be lower than the lip on either side (h58). The river above the
falls should have a catchment on the plateau several cells long.

**A2.11 Alluvial-fan channels split, shift and spread.** Fan channels branch and avulse, flow paths are hard to predict,
and the lower fan gets sheetfloods [SCIENCE 26].
*Map rule:* this is the one place where branching water is normal. Show it as dashed washes fanning out from the
canyon mouth.

**A2.12 A closed basin's lake grows a lot in wet times and shrinks to a playa in dry times.**
- Death Valley's Ice Age lakes evaporated about 10,000 years ago, and a smaller lake came and went about 3,000 years
  ago [SCIENCE 5].
- White Sands' Lake Otero covered about 1,600 sq mi before it became playas [SCIENCE 30].
- North African "megalakes" were permanent while supply exceeded evaporation [SCIENCE 33].
*Map rule:* the "before" era's terminal water should be much larger than today's, or the before map has to explain why
it is not.

---

## 3. Arid geomorphology and the downslope sequence

**A3.1 The downslope sequence runs coarse to fine and steep to flat.** Escarpment → canyon mouth → alluvial fan
(bouldery snouts and levees near the apex) → fan toe → bajada → fine flats → playa or pan [SCIENCE 26, 25, 7].
*Mistake:* salt crust against the escarpment foot, or gravel in the pan centre.
*Check:* on the `biomes` layer, walk outward from the pan. The order should hold, except where volcanic rock or
terraces interrupt it.

**A3.2 A bajada is the readable unit at map scale.** Fans along a mountain front merge into a "general accumulation of
overlapping fans" [SCIENCE 26, 25]. Paint the bajada as one belt along the scarp foot.

**A3.3 Fans are sized by the drainage behind them and by the tilt.** In a half-graben the footwall scarp feeds small,
steep fans and the hanging-wall side feeds broad cones. Large cones also form where drainage concentrates at fault
overlaps [SCIENCE 8]. In Death Valley the west-side fans are much larger than the east-side fans because of the tilt
[OBSERVED/SCIENCE 31].
*Check:* the biggest fan should sit below the biggest catchment, such as the falls stream at Act I's Slums.

**A3.4 Evaporites are deposited in solubility order.** Calcite precipitates first, then gypsum, then halite
[SCIENCE 29]. The Death Valley pan is zoned the same way in space [SCIENCE 7]:
- chloride centre, about 90 sq mi;
- narrow sulfate ring, about 10 sq mi;
- sandy carbonate edge, about 25 sq mi.
*Mistake:* halite at the margins and gypsum in the centre.
*Check:* paint order from the pan outward: halite, then gypsum, then carbonate/mudflat, then gravel.

**A3.5 A playa's gypsum ring is thin. Thick gypsum belts mean an old sea.** Death Valley's sulfate zone is only about a
twelfth of the pan, which at 2.3 km cells is 0–1 cells wide [SCIENCE 7; INFERRED arithmetic]. The Danakil's gypsum is a
different thing: it records the basin's closure from the Red Sea [SCIENCE 17].
*Map rule:* a broad gypsum belt (like Act I's gypsum pavement) is plausible only with a marine-closure story, which the
fossil reefs supply.

**A3.6 Gypsum dunes sit downwind of a gypsum playa.** At White Sands, selenite crystals grow on Alkali Flat and Lake
Lucero, and floods every 10–14 years recharge them. Wind breaks the crystals into sand and pushes it northeast
[SCIENCE 30].
*Mistake:* gypsum dunes upwind of the pan, or with no gypsum source.
*Check:* compare the dunes' position with the wind angles in `config.json`. Dunes go on the pan's downwind side.

**A3.7 Fossil reef terraces mark old shorelines, so they follow contours.** Danakil reefs grew along the western and
eastern margins, "following the paleoshoreline". There are at least four stacked units, with erosion surfaces between
them [SCIENCE 16, 17]. Death Valley's Lake Manly shorelines sit higher on one side because of tilting [SCIENCE 31].
*Mistake:* terrace patches at random heights, or terraces crossing contours.
*Check:* terrace cells should fall in narrow height bands (Act I: h27–30) and run along the margin. A slight tilt is fine.

**A3.8 Marine reefs need a past link to the sea.** The Danakil was flooded by the Red Sea in the Pleistocene and was
alternately open and closed to it [SCIENCE 16, 17]. The salt depression next to Dallol "was once connected to the Red
Sea" [SCIENCE 15].
*Mistake:* fossil coral in a basin with no possible past sea connection.
*Check:* a past or present low sill toward a coast. This is a canon question (see Open questions).

**A3.9 Hydrothermal fields are local, small and changeable.** Dallol is about 3 × 1.5 km and rises about 60 m above the
salt plain [SCIENCE 15; 19 secondary]. Its acid springs reach pH below 0 and temperatures above 108 °C. Its colours
come from iron oxidation and run from white through green, yellow and orange to ochre. Springs switch on and off
within days [19, secondary, citing Kotopoulou et al. 2019]. It sits on a salt dome on the salt plain [SCIENCE 15].
Act I's acid dome at h24–26 (about 36–64 m) stands 27–55 m above the pan (h21, about 9 m), which matches Dallol.
*Mistake:* acid colours painted over a whole region.
*Check:* `query_cells` biome counts. The acid zone should be a handful of cells on a low dome in or beside the pan.

**A3.10 Regional versus local, summarised.** [INFERRED from A3.1–A3.9]
- Regional, tens of km: fans and bajada, gravel plain, terrace belt, gypsum belt (marine), salt pan, basalt field,
  axial volcanic range.
- Local, a few km or less: hydrothermal field, springs, brine and acid pools, salt cones, individual reefs, fault
  scarps on fans.

---

## 4. Climate to biomes

**A4.1 Subtropical deserts sit in belts of sinking air near 30°.** Hot deserts lie "within the persistent belts of
sinking air" [SCIENCE 36]. Act I sits near 35.4°N (`config.json`), at the poleward edge of that belt, so a present-day
drought there is plausible. [INFERRED]

**A4.2 Windward slopes are wet; leeward slopes are dry.** Rising air drops its rain on the windward slopes. Air that
"crests the mountaintop warms and dries" on the lee side, and drought hits rain-shadowed slopes hardest
[SCIENCE 37]. Azgaar reproduces this (T5).
*Check:* the `precipitation` layer. With winds from the southwest and the escarpment on the west, the plateau edge
should be wetter than the basin. If it is not, the wind or relief is wrong.

**A4.3 Temperature and precipitation set the biome, then elevation and soil adjust it.** This is the Whittaker scheme
[SCIENCE 38]. Azgaar uses the same idea, and a river's flux adds moisture to its cells (T5).
*Mistake:* forest in a low-precipitation cell with no river or spring.
*Check:* the `biomes` and `precipitation` layers side by side. Every green patch in a dry zone should have a water
source (river, spring, lake shore).

**A4.4 Highlands are cooler than the basin.** Azgaar subtracts 6.5 °C per km of altitude (T5). The Danakil floor is one
of the hottest, driest places on Earth, sometimes above 50 °C [SCIENCE 1].
*Check:* the `temperature` layer. The basin should be the hottest area in the region.

**A4.5 A lush "before" needs more water, and more water shows up in the lakes.** During the African Humid Period
(about 11,000–5,000 years ago) the Sahara was "a land covered with vegetation and lakes", with megalakes, more river
runoff and a stronger monsoon [SCIENCE 33]. The Afar lakes recorded large late-Pleistocene climate swings [SCIENCE 34]. A
greener "before" basin therefore needs more precipitation or more exotic river inflow. Its terminal lake should be
larger, and possibly overflowing (A2.4, A2.12).
*Mistake:* green everywhere while the salt pan and pools stay at present-day size.
*Check:* the before map's lake area against the now map's (`list features`). A greener before should have a bigger
lake or an outlet.

**A4.6 In deserts, green comes in ribbons and spots.** Rivers, springs and lake shores make riparian strips and oases,
while the land between them stays dry [SCIENCE 25; INFERRED]. A believable before can be "green along the water" rather
than green everywhere.

**A4.7 Drought shifts can be fast but not uniform.** The end of the humid period took one to two centuries in some
records, and came gradually and at different times elsewhere [SCIENCE 33]. As a drought deepens, closed lakes shrink in
area first [SCIENCE 23]. Spring flow depends on rainfall and the recharge area, and pumping lowers it [SCIENCE 24].
Rivers become washes.
*Map rule:* a "Dead Spring" is plausible after drought, overuse or both.

**A4.8 Pans flood briefly even in the present.** Lake Asale floods seasonally from ephemeral streams on both rims
[SCIENCE 18]. White Sands' playa crystals form mainly in floods every 10–14 years [SCIENCE 30]. A "now" pan with shallow
brine patches is realistic.

---

## 5. Human geography

**A5.1 Routes follow gentle slopes and reliable water.** The Afar salt trail chose the lowest-cost path with "ideal
slopes for pack travel and plentiful water sources" [SCIENCE 40]. Highland trails "followed rivers and streams", with
valleys used for their slopes more than for their water [SCIENCE 40].
*Mistake:* a road going straight across rough ground between two towns.
*Check:* overlay the `routes` and `heightmap` layers. A route should run along valleys, terraces or the bajada, and
cross rims only at gaps.

**A5.2 The Afar salt trail is the direct analogue.** It is about 160 km long and runs from over 2,000 m in the highlands
to below sea level at Lake Asale. Overnight camps are about 20 km apart, next to villages, though not evenly spaced.
Ancient campsites sat on floodplains near rivers and wells [SCIENCE 40]. Highland caravans take 7–10 days each way; in
the lowlands, where "water supplies are very limited", the route has hardly changed [SCIENCE 40].
*Map rule:* a 100 km Act I crossing implies about 4–6 waypoints, each at water. [INFERRED arithmetic]

**A5.3 Market towns sit where the highland and lowland legs meet.** Berahile, Asa Bolo (Sabba) and Hamed Ela are the
meeting points between highland and lowland caravans. Highlanders sell salt at Berahile [SCIENCE 40]. Berahile is two
days by camel from the salt deposits [OBSERVED 41].
*Map rule:* an escarpment-foot city that trades in salt is well supported.

**A5.4 Salt extraction is old and simple.** Afar salt has been mined and sold for at least 2,000 years and was once used
as currency [SCIENCE 2]. The trade goes back to the Aksumite period [SCIENCE 40]. Salt is cut with hoes and axes and
carried by camel caravans [OBSERVED 41].
*Map rule:* a quarry marker on the pan, plus a caravan road from the pan to the trading city.

**A5.5 Pack routes have a critical slope and zigzag above it.** A least-cost model fitted known trade routes best with a
critical slope of 13% and with wet soils avoided [SCIENCE 42]. Above the critical slope, walkers zigzag, so human trails
"exhibit zigzags, or switchbacks" on steep hillsides [SCIENCE 43].
*Arithmetic:* descending 1,500 m at 13% takes at least about 11.5 km of path. An escarpment one or two cells wide
(2–5 km horizontally) therefore needs switchbacks, a gorge or a spur. [INFERRED]
*Check:* for each route segment that climbs a rim, compare the height change (T1) with its length. Steeper than 13%
needs a zigzag or a valley.

**A5.6 Passes sit at low points in the rim.** Transfer zones between fault segments form topographic lows [SCIENCE 13],
and those lows are the natural passes and river gaps [INFERRED]. Act I's Caravan Approach (h38, in a rim at h47) fits.
*Check:* pass cells should be lower than the rim cells on both sides.

**A5.7 Cities gather at the first falls or the break of slope.** Eastern US seaboard cities "from Trenton, N. J., to
Macon, Ga." grew on the Fall Line. The Fall Line is the head of navigation and the last point downstream where rivers
could be forded or easily bridged [SCIENCE 28]. Reasons such as water power or portage are not in that source.
[INFERRED] A city at the foot of a waterfall on an escarpment has the same logic: water, a break in transport, and
a meeting of two terrains.

**A5.8 Springs and fan toes fix village sites.** Springs sit at faults, behind barriers and at pan margins [SCIENCE 7].
Caravan camps sit next to villages at water [SCIENCE 40].
*Map rule:* every settlement or ruin in the basin needs a water source within a cell or two (spring, falls, well or
lake shore), or a story reason why it was abandoned (a dead spring). [INFERRED]

**A5.9 Flood risk shapes where towns sit on fans.** Fan channels avulse and lower fans get sheetfloods [SCIENCE 26].
Caravans avoid riverbeds in flood [SCIENCE 40]. Towns sit on raised terraces or on fan flanks, not in active channels.
[INFERRED]

**A5.10 High ground is chosen for defence and for overlook.** No institutional source was found for this one; it is
standard settlement-geography teaching (site and situation). [INFERRED] Act I's upper city, on a bench above its Slums,
fits the escarpment benches in A1.5.

---

## 6. What reads at map scale and what does not

**A6.1 The smallest feature that reliably shows is about two cells, or ~4.6 km.** Tobler's rule: detectable size is
twice the resolution [SCIENCE 44]. Recognising a shape needs more, perhaps 10–16 contiguous pixels [45, unsourced rule
of thumb], which is 3–4 cells across (about 7–9 km). An Azgaar cell here is about 5.2 km² (1920 × 1080 px at 0.5 km/px
over 100k points). [INFERRED arithmetic; SOURCE 47 README: "a pool needs a radius of about 2 km to show"]

**A6.2 Size table: what goes on the map and what goes in the zone.**

| Feature | Real size | Cells | Where it belongs |
|---|---|---|---|
| Escarpment relief zone | tens of km [10] | 5–20 | Map (heights) |
| Marginal graben or bench | 10–20 km wide [10] | 4–9 | Map (heights) |
| Tilted fault blocks | 1–5 km [10] | 0.5–2 | Zone (Gaea) |
| Axial volcanic range | up to 80 km [13] | ~35 | Map |
| Erta Ale shield | 50 km base [14] | ~22 | Map |
| Caldera or pit crater | 1.6 × 0.7 km [14] | <1 | Marker; zone |
| Lava lake | sub-km [14] | <1 | Marker (Act I's pit is exaggerated) |
| Dallol hydrothermal dome | 3 × 1.5 km [19] | 1–2 | Map as a low dome plus marker |
| Acid and brine pools, salt cones | tens of m [15, 19] | ≪1 | Zone (Act I's pools are exaggerated) |
| Death Valley chloride centre | ~90 sq mi [7] | ~45 | Map |
| Death Valley sulfate ring | ~10 sq mi, narrow [7] | thin ring, 0–1 wide | Mostly zone |
| Bajada belt | several km [26] | 2–4 | Map (biome paint) |
| Fan channels and distributaries | metres to 100s of m [26] | ≪1 | Zone; map shows washes symbolically |
| Fault scarps on fans | metres [6] | ≪1 | Zone |
| Springs, waterfalls | point features [7, 27] | <1 | Marker plus river line |
| Switchbacks | 100s of m [43] | <1 | Stylised zigzag on the route; zone |
| Caravan camps | ~20 km apart [40] | ~9 apart | Map markers |
| Ancient lake (Lake Otero) | ~1,600 sq mi [30] | ~800 | Map |

**A6.3 Map exaggeration is allowed, but it should be labelled.** The README's rule that a pool needs a radius of about
2 km to show makes Act I's acid pools, the lava lake and the Dead Spring 10–100 times their real size. That is fine
under "gameplay first", but environment art must not read map size as literal size. [INFERRED] The 3D view also
exaggerates vertically by 2× by default [47 `index.ts`].

**A6.4 Some things the map cannot show.** It cannot show below-sea-level land (T1), a river split (T3), or a seasonal
lake as distinct from a permanent one (Azgaar's lake subtypes are computed, not seasonal). Below-sea-level ground and
seasonal water go in labels, notes and dashed styles. [SOURCE 46]

---

## Recommendations for the skill (ranked)

1. **The water budget comes first.** Every river ends at a sea, a lake or a sink. Terminal lakes are saline. A wetter
   era means bigger terminal lakes, or an overflow outlet. Check with `list features` subtypes. (A2.3, A2.4, A2.12, A4.5)
2. **Order the basin floor downslope.** Escarpment → gorge → fans and bajada → gravel → mudflat → gypsum → halite pan.
   Use solubility zoning. Hydrothermal colours stay local. (A3.1, A3.4, A3.9)
3. **Faults make the outline.** The basin is elongate along the rift axis, its margins are segmented, at least one
   side is a steep fault scarp, and the other side is gentler unless a horst is intended. No frame-shaped rims.
   (A1.2, A1.6–A1.8)
4. **Every settlement, ruin and route stop has water.** Routes follow valleys and slopes under about 13%. They cross rims
   only at low passes, and use switchbacks or gorges on escarpments. (A5.1, A5.5, A5.6, A5.8)
5. **Springs and falls go where geology puts them.** Springs at fault lines, escarpment feet, fan toes and pan
   margins. Falls in a notch cut back into the scarp, fed by a real plateau catchment. (A2.9, A2.10)
6. **Climate follows the wind.** Wet windward plateau, dry leeward basin. Green patches in dry zones need a named water
   source. Check the `precipitation`, `temperature` and `biomes` layers. (A4.2, A4.3, A4.6)
7. **Volcanoes go on the rift axis, in ranges, with young lava darkest.** A big stratovolcano is a recorded gameplay
   choice. (A1.9, A1.10)
8. **Label scale honestly.** Anything under about 2 cells (4.6 km) is a marker, a zone fact, or a tagged exaggeration.
   Below-sea-level and seasonal water go in notes. (A6.1–A6.4)
9. **Add check tools.** These are proposals. They are not built yet, and `run_js` is not allowed in builds:
   - `profile` (heights along a polyline);
   - `list rivers` (source, mouth, length, mouth feature);
   - a `lint` op that flags freshwater lakes with no outlet, rivers ending on open land, and settlements more than
     2 cells from water.

## Open questions for George

1. **Where did the sea come in?** Fossil reefs need a past link to a sea (A3.8). Which coast was it, and is there a low
   sill toward it on the continent map?
2. **Before-era water:**
   - Was the basin's lake larger and still closed, or did it overflow out of the basin?
   - The current before screenshot shows a river leaving the frame toward the south-west, and pan pools at present-day
     size. Is that intended? [INFERRED from `before-act1-biomes.png`]
3. **Which side is the master fault?** The west escarpment is the big one, but the pan sits east. Is the east rim a
   faulted horst (Danakil style), or do big western fans push the pan east? (A1.2, A2.6)
4. **Volcano height:** keep the tall stratovolcano (about 2,300 m in Azgaar metres), or reshape it as a lower axial
   shield range closer to Erta Ale? (A1.9)
5. **Basin outline:** at present the basin fills its 100 × 64 km frame fairly squarely. Should it be stretched along
   a NNW-type axis, with segmented margins? (A1.6–A1.8)
6. **Exaggeration tagging:** should ops mark exaggerated features (pools, lava lake, spring) as `[exaggerated]` in
   their notes, so the per-zone facts handed to environment art carry real sizes? (A6.3)

## Limits

- **What I could and could not read:**
  - Several key papers were read only as abstracts or publisher pages: Kleinhans 2013, Gasse 1977, Wang 2018 (via a
    ScienceDaily summary), Langbein 1961 and Llobera & Sluckin 2007 (via a university news release).
  - Kotopoulou et al. 2019 (Dallol) was blocked, so its figures come second-hand from Wikipedia [19].
  - Hunt et al. 1966 [7] and Zwaan et al. 2020 [10] were read only in part, through their first 100k characters.
- **Numbers to treat with care:**
  - The axial ratios (A1.6), the waypoint count (A5.2), the switchback arithmetic (A5.5) and all cell counts (§6) are
    our own arithmetic.
  - The Danakil's overall length and width were not confirmed from an institutional source, so none are given.
- **Gaps:**
  - No institutional source was found for "defensible ground" (A5.10). It is tagged INFERRED.
  - No rain-shadow source specific to the Afar was found. A4.2 rests on general sources and on Azgaar's model.
- **Map observations:** the observations about the current Act I map come from three screenshots in
  `world/build/screenshots/` and the op values in `world/base/10-act1-terrain.json`, not from a fresh build.

## Sources (read 2026-11-13)

1. ESA, "Earth from Space: The Danakil Depression" (2025). https://www.esa.int/ESA_Multimedia/Images/2025/11/Earth_from_Space_The_Danakil_Depression
2. NASA Earth Observatory, "Curiosities of the Danakil Depression". https://science.nasa.gov/earth/earth-observatory/curiosities-of-the-danakil-depression-84239
3. Geological Society of London, "East African Rift Valley". https://www.geolsoc.org.uk/science-and-policy/plate-tectonic-stories/east-african-rift-valley
4. NPS, "Tectonic Landforms and Mountain Building". https://www.nps.gov/subjects/geology/tectonic-landforms.htm
5. NPS Death Valley, "Geology". https://www.nps.gov/deva/learn/nature/geology.htm
6. NPS Death Valley, "Faults". https://home.nps.gov/deva/learn/nature/faults.htm
7. Hunt, Robinson, Bowles & Washburn (1966), *Hydrologic basin, Death Valley, California*, USGS PP 494-B (abstract and hydrology sections). https://pubs.usgs.gov/pp/0494b/report.pdf
8. Leeder & Gawthorpe (1987), "Sedimentary models for extensional tilt-block/half-graben basins", Geol. Soc. Spec. Publ. 28. https://pages.uoregon.edu/rdorsey/BasinAnalysis/BasinPapers/Leeder_%26_Gawthorpe_1987.pdf
9. Weissel & Karner (1989), "Flexural uplift of rift flanks due to mechanical unloading of the lithosphere during extension", JGR 94(B10). https://topex.ucsd.edu/pub/class/geodynamics/HW7_papers/H_rift_wessel_karner.pdf
10. Zwaan et al. (2020), review of the Western Afar Margin, J. African Earth Sciences (postprint, partial). https://boris.unibe.ch/142114/7/Zwaan_etal_JAES_2020_postprint.pdf
11. Zwaan, Corti, Keir & Sani (2020), "Analogue modelling of marginal flexure in Afar", Tectonophysics 796 (abstract page). https://eprints.soton.ac.uk/443890
12. Nigussie et al. (2023), "Subsurface structure of magmatic segments during continental breakup", Frontiers in Earth Science 10. https://www.frontiersin.org/journals/earth-science/articles/10.3389/feart.2022.1092759/full
13. University of Leeds Afar pages, "Northern Afar Rift". https://see.leeds.ac.uk/afar/websitepages/structurepages/northernafarrift.htm
14. Smithsonian Global Volcanism Program, Erta Ale. https://volcano.si.edu/volcano.cfm?vn=221080
15. Smithsonian Global Volcanism Program, Dallol. https://volcano.si.edu/volcano.cfm?vn=221041
16. Eos, "Reading history in Afar". https://eos.org/science-updates/reading-history-afar
17. Endeshaw et al. (2024), "From coral reefs toward unveiling the deep geobiosphere… (ADD-ON)", PAGES Magazine 32(2). https://eprints.soton.ac.uk/503448/1/pagesmag_2_2024_122-123.pdf
18. Mège et al. (2023), "Tectonic and hydrothermal activity at the Yellow Lake fissure…", Frontiers in Earth Science 11. https://www.frontiersin.org/journals/earth-science/articles/10.3389/feart.2023.1250702/full
19. Wikipedia, "Dallol (hydrothermal system)" (secondary; cites Kotopoulou et al. 2019 and R. Roscoe). https://en.wikipedia.org/wiki/Dallol_(hydrothermal_system)
20. USGS Water Science School, "Watersheds and Drainage Basins". https://www.usgs.gov/water-science-school/science/watersheds-and-drainage-basins
21. Kleinhans, Ferguson, Lane & Hardy (2013), "Splitting rivers at their seams: bifurcations and avulsion", ESPL 38 (abstract). https://research-portal.uu.nl/en/publications/splitting-rivers-at-their-seams-bifurcations-and-avulsion/
22. Wang et al. (2018), "Recent global decline in endorheic basin water storages", Nature Geoscience 11 (via ScienceDaily). https://www.sciencedaily.com/releases/2018/11/181130153841.htm
23. Langbein (1961), *Salinity and hydrology of closed lakes*, USGS PP 412 (abstract). https://www.usgs.gov/publications/salinity-and-hydrology-closed-lakes
24. USGS Water Science School, "Springs and the Water Cycle". https://www.usgs.gov/water-science-school/science/springs-and-water-cycle
25. Ritter, *The Physical Environment*, 18.6 "Fluvial Processes in Dry Regions" (LibreTexts). https://geo.libretexts.org/Bookshelves/Geography_(Physical)/The_Physical_Environment_(Ritter)/18%3A_Fluvial_Systems/18.06%3A_Fluvial_Processes_in_Dry_Regions
26. National Research Council (1996), *Alluvial Fan Flooding*, ch. 2. https://www.nationalacademies.org/read/5364/chapter/4
27. Lamb, Howard, Dietrich & Perron (2007), "Formation of amphitheater-headed valleys by waterfall erosion…", GSA Bulletin 119. https://lamb.caltech.edu/documents/19593/Lamb_et_al_GSA_2007.pdf
28. USGS, *The River and the Rocks: Great Falls and the Potomac River Gorge*, "The River and the Land". https://www.npshistory.com/publications/geology/inf/great_falls/sec3.htm
29. Wood (2021), *A Conceptual Overview of Surface and Near Surface Brines and Evaporite Minerals*, §4.1, Groundwater Project. https://books.gw-project.org/a-conceptual-overview-of-surface-and-near-surface-brines-and-evaporite-minerals/chapter/chemically-closed-systems/
30. NPS White Sands, "Geology of White Sands". https://nps.gov/whsa/learn/geology-of-white-sands.htm
31. M. Miller (University of Oregon pages), "Views from Dantes View" (cites Hunt & Mabey 1966). https://pages.uoregon.edu/millerm/Dantes.html
32. NPS, "Basin and Range Province". https://home.nps.gov/articles/basinrange.htm
33. deMenocal & Tierney (2012), "Green Sahara: African Humid Periods Paced by Earth's Orbital Changes", Nature Education Knowledge 3(10). https://www.nature.com/scitable/knowledge/library/green-sahara-african-humid-periods-paced-by-82884405/
34. Gasse (1977), "Evolution of Lake Abhé (Ethiopia and TFAI), from 70,000 b.p.", Nature 265 (abstract). https://www.nature.com/articles/265042a0
35. Observatoire de la Côte d'Azur, ANR NILAFAR, "The Afar depression and Lake Abhe basin". https://artemis.oca.eu/fr/anr-nilafar/3361-zone-d-etude
36. Penn State METEO 3, "Subtropical Highs". https://courses.ems.psu.edu/meteo3/node/2048
37. NOAA Climate.gov, "Rain Shadows on the Summits of Hawaii". https://www.climate.gov/news-features/featured-images/rain-shadows-summits-hawaii
38. SERC/EarthLabs (Carleton College), "Climate and Biomes". https://serc.carleton.edu/55043
39. Gani, Gani & Abdelsalam (2007), "Blue Nile incision on the Ethiopian Plateau", GSA Today 17(9). https://rock.geosociety.org/gsatoday/archive/17/9/pdf/gt0709.pdf
40. Woldekiros (2019), "The route most traveled: the Afar salt trail, North Ethiopia", Chungara 51(1). https://www.chungara.cl/Vols/2019/51-1/008-H_WOLDEKIROS.pdf
41. Reuters via VOA (17 May 2013), Ethiopia's salt trade in the Danakil. https://www.voanews.com/a/ethiopia-salt-trade-danakil-depression-afar-mining-extraction-industry/1662972.html
42. Herzog (CAA 2012), "Least-cost networks". https://www.homepages.ucl.ac.uk/~ucakche/agdank/agdankht2012/CAA2012_Least_cost_networks_IHerzog.pdf
43. University of Washington News (2008) on Llobera & Sluckin (2007), "Zigzagging: theoretical insights on climbing strategies", J. Theoretical Biology. https://www.washington.edu/news/2008/02/20/in-the-race-to-the-top-zigzagging-is-more-efficient-than-a-straight-line/
44. Esri ArcGIS Blog, "On map scale and raster resolution" (quotes Tobler 1987). https://www.esri.com/arcgis-blog/products/product/imagery/on-map-scale-and-raster-resolution/
45. Klinkenberg (2004), "Rules of thumb for spatial data" (UBC Geography). https://ibis.geog.ubc.ca/~brian/rules_of_thumb
46. Azgaar Fantasy Map Generator v1.156.0 source in `tools/azgaar/source/src/model/physical/` (`lakes.ts`, `features-generator.ts`, `river-generator.ts`, `precipitation-generator.ts`, `temperature-generator.ts`, `biomes-generator.ts`) and `model/options/options-model.ts`. 46a: Smithsonian GVP, Alid. https://volcano.si.edu/volcano.cfm?vn=221040
47. This repo: `world/README.md`, `world/config.json`, `world/base/10-act1-terrain.json`, `tools/azgaar-mcp/src/index.ts` and `session.ts`, and `world/build/screenshots/{now,before}-act1-*.png`.
