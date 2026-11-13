# Track B: making fantasy and game world maps believable and readable

Research for the `arpg-cartography` skill. Every source below was read on **13 Nov 2026**. The sources are worldbuilding
and cartography practitioners, Azgaar's own writing and code, and developers who designed open worlds. Track A covers
the earth science, so this file only touches it where the community has turned it into a rule of thumb.

How to read a rule: **Rule.** *Origin [source numbers].* The mistake as it looks on a map. **Check:** how to test for it on
our Azgaar map, using the repo's MCP tools (`screenshot`, `query_cells`, `list`, `get_map_info`) or an op file.

Corrections to the track brief:
- The BotW "triangle rule" comes from Nintendo's **CEDEC 2017** field-design talk in Japan. It is not from the GDC 2017 talk
  "Change and Constant" (Fujibayashi, Takizawa, Dohta), which is about breaking series conventions. I only had
  second-hand write-ups of the CEDEC talk, not a transcript [19][20][21].
- Kenshi: I found no primary statement from Chris Hunt or Lo-Fi Games about regions, biomes or hazards (acid, wind). The only
  primary world-design post is a 2012 dev log [29]. Kenshi's hazards are not cited as DEV here.

---

## 1. Common fantasy-map mistakes and their fixes

### Water

**B1. Rivers rise on high ground and end in something bigger and lower: the sea, a lake, another river, or (in a closed
basin) a salt pan or sink.** *COMMUNITY [1][3]; SOURCE [16].* The mistake is a river that starts or stops "out of nowhere",
or one that runs along the floor between two ranges without a source [1]. Azgaar's generator sends each land cell's water to
its lowest neighbour, so the rivers it generates obey this rule. Rivers drawn by hand with `add_river` do not have to [16].
**Check:** for every river, its source cell must be higher than its mouth cell (`query_cells` at both ends), and its mouth
must touch the ocean, a lake or another river. In Act I every river must end in the salt pan or in a pool.

**B2. Rivers merge downstream. They do not split, except in deltas, braided reaches and short channel islands.**
*COMMUNITY, strong consensus [1][2][3].* The mistake is a river that forks into two lasting rivers on its way downhill.
Splits that last are rare: they need hard rock at the fork and strong flow in both branches, and one branch usually
captures the other in the end [2][3]. The Casiquiare (Orinoco to Amazon) is the textbook exception [2][3]. Azgaar cannot
generate a split, because each cell has only one downhill cell [16]. **Check:** no river has two mouths. A split, if
wanted, is drawn as a delta or a fan of distributaries, and its op note says so. In Act I that means the mineral washes
fanning out at the foot of the escarpment (the physics belongs to Track A).

**B3. A channel never joins two oceans or two separate basins. If it does, it is a strait (at sea level) or a canal.**
*COMMUNITY [3].* **Check:** no river or route-styled water line links two water bodies that sit at different heights.

**B4. A river's look matches its slope.** *COMMUNITY [3], citing a Colorado State University figure.* Steep "youthful"
streams are narrow and straight with few tributaries. Lowland "old" rivers are wide and meander over floodplains. The
mistake is lazy meanders drawn on an escarpment, or a straight canal-like river crossing a flat basin floor. **Check:** look
at the heights along the river path. In Act I the falls stream should be short and nearly straight down the scarp, and it
should only wander once it reaches the basin floor.

**B5. Rivers and shorelines move over time: meanders, oxbows, abandoned channels, and old river towns left dry.**
*COMMUNITY [3].* This is the main tool for a before/after pair (see section 5).

**B6. Whether a lake is fresh, salt or dry follows its water balance.** *SOURCE [16].* In Azgaar, a lake whose inflow beats
evaporation and which has an outlet drains on as a river and is freshwater. Where evaporation beats inflow the lake is
saline, and where it wins by a lot the lake is dry. Lakes in deep depressions are "closed" and get no outlet. Burgs cannot be
ports on dry, frozen or lava lakes [16]. The mistake is a freshwater lake with no outlet in a hot closed basin. **Check:**
`list` the lakes in the Act I frame. Brine pools should have the salt subtype or style, and only a spring-fed pool (such as the
Dead Spring in the before era) may be fresh. Remember that `finalize_terrain` and `set_climate` reset lake looks
(world/README [41]).

**B7. Swamps sit on flat, low, wet ground (coasts, floodplains, lake edges), never on slopes.** *COMMUNITY [1].*
**Check:** no marsh or wetland biome on cells whose neighbours differ by more than a few height units.

**B8. Coasts and lake shores need clean-up. Lots of tiny islands and specks just look messy.** *COMMUNITY: one person each,
O'Leary [5] and Turner [6].* O'Leary filters out points whose neighbours are mostly on the other side of sea level. Turner
lists many small islands as a fault of his own maps. In our map, pools closer than about one cell merge, and a pool needs
a radius of about 2 km to show at all [41]. **Check:** `screenshot` the frame and look for one-cell lakes or islets that no
op meant to make.

### Land and climate

**B9. Mountains form long belts where plates meet. They are not random blobs, crosses or ranges that branch at odd angles.**
*COMMUNITY [1] (two answers agree).* **Check:** a heightmap `screenshot` should show ranges as linear belts with a plausible
cause. Act I is a rift, so the cause there is the opposite of collision. The two shoulders and escarpments should run
roughly parallel to the rift axis (Track A has the geology).

**B10. The lee side of a range is drier (rain shadow), and deserts sit behind mountains relative to the prevailing wind.**
*COMMUNITY [1]; DEV-practitioner [8].* Turner's generator rains out moisture where wind meets rising land, and the land
behind the mountains ends up dry, with small deserts [8]. He also lets a little moisture reach the interior, or a whole
island turns to desert [8]. Azgaar computes precipitation from winds, elevation and distance to the ocean ([14], a mirror
of the FMG wiki). **Check:** turn on the precipitation layer for the climate set by `set_climate`. The wet side of each
range must face the wind. Act I is enclosed by highlands, so its aridity is plausible once the wind comes over a rim.

**B11. Biomes follow temperature (latitude and height) crossed with moisture, as on a Whittaker diagram.**
*DEV-practitioner (Azgaar's blog) [12]; SOURCE [14].* Azgaar uses a lapse rate of about 6.5 °C/km. **Check:** a hand-painted
biome must not contradict height for no reason, such as green forest on the hottest, lowest salt pan. Where it does, the
op note gives the cause (a spring, geothermal heat, a story reason).

**B12. Paint biomes as continuous zones, not salt-and-pepper speckle.** *COMMUNITY: one person [8].* Turner smooths his
biomes because the raw output is "very spotty" and makes a poor fantasy map. **Check:** in a biome-layer `screenshot`, no
isolated single cells of one biome, except deliberate point features (the acid pools, a spring oasis).

**B13. Build the big shapes first, then add detail.** *COMMUNITY: one person [5].* O'Leary moved off pure noise because
its large-scale structure "always looks a bit off". He starts from primitives (slopes, cones, blobs), then erodes. Our
CLAUDE.md drawing order (terrain, water, biomes, settlements, routes, then labels) and the outward-in Act I terrain op
already do this [41].

### People on the land

**B14. Settlements go where geography supports them: fresh water (rivers, springs in dry land), sheltered harbours, river
mouths and heads, trade junctions, passes, resources.** *COMMUNITY [1]; DEV-practitioner [5][11]; SOURCE [14].*
O'Leary's city score rewards high river flux and keeps cities apart [5]. Azgaar ranks cells on habitability, river and
coast bonuses and an elevation penalty, then rewards roads and crossroads when placing towns [11][14]. **Check:** every
burg sits within a cell or two of a water source or a route junction, and its op note names that reason. Act I's city
(shelf above the waterfall, Slums at its foot) passes this test.

**B15. Roads take the cheapest ground: low passes, valleys, river banks, and existing roads. They do not go straight over
ridges.** *DEV-practitioner [11]; COMMUNITY [5].* Azgaar's A* road cost prefers short, low routes and existing roads, and
builds a new road "only if it's really needed" [11]. **Check:** read the heights along a route (`query_cells` along it).
A climb of more than a few height units per cell needs a stated reason. Act I's road through the low Caravan Approach
pass passes this test [41].

**B16. Natural borders are ridges, escarpments, deserts, swamps and wasteland. Rivers more often join regions than divide
them.** *COMMUNITY, contested [1].* One answer in [1] says nations are seldom bounded by rivers, because rivers are trade
routes. Another says rivers make borders because armies find them hard to cross. O'Leary's region growth makes "crossing
a river expensive" and stops regions at ridges [5]. For ARPG zones this argument doesn't matter, because zone edges are
play edges (see P10). **Check:** each zone boundary on the map follows a height break, a water body or a biome change.

**B17. Give the edge of the known world a reason: a range, a desert, the sea.** *COMMUNITY [1].* The mistake is a region
that just stops. Act I has its rims. The continent edge beyond the acts needs the same treatment.

**B18. Don't fill every corner, and don't flag every secret.** *COMMUNITY [1]; DEV [27].* Unknown land leaves room for
later stories [1]. A Witcher 3 designer called the Skellige question-mark icons a "mistake". Caches meant to be found by
circling seagulls were flagged on the map instead [27]. For us: mark what the studio needs (zones, landmarks), and keep
secret locations as notes rather than markers.

**B19. The layers must agree with each other.** *COMMUNITY: one person [6].* Turner found forest labels on his maps with no
forest drawn. **Check:** every label and marker names something that the map draws at that spot (a landform, a lake, a
biome patch, a burg).

---

## 2. Readability: how good maps communicate

**R1. The visual hierarchy follows the map's purpose: the most important thing is where the eye goes first.**
*COMMUNITY (Axis Maps cartography guide) [17].* **Check:** the "squint test": blur the `screenshot` (or shrink it). The
act's zones, its main landmark and its water should still read. Background relief should not.

**R2. Lightness contrast does most of the work. Push supporting layers back and keep figure and ground clear.**
*COMMUNITY [17].* Low contrast gives a weak figure-ground effect [17]. **Check:** convert the screenshot to greyscale. Each
pair of neighbouring zones should still differ in lightness, not only in hue. This matters for Act I's palette, where salt,
gypsum and pale washes are all light.

**R3. Relief symbols must read as relief at the zoom you actually use.** *COMMUNITY: one person [6].* Turner found his
mountain icons too small, so they read as texture. **Check:** at the zoom used for the Act I reference (`world/reference/
act1-overview.jpg`), the escarpment and the volcano must read as high ground.

**R4. Rivers, roads, trails, borders and seasonal channels need different line styles, plus a legend.** *COMMUNITY [1].*
Lines that all look alike are one of the most common faults [1]. **Risk on our map:** Act I draws the seasonal mineral washes
as dashed lines with `add_route` [41], and Azgaar's trails are also dashed. Give washes a water-coloured style group that no
route uses, and add a legend or note.

**R5. Point labels: upper right first, then lower right, upper left, lower left, then above or below. Avoid directly left or
right. Coastal towns put their names in the water. A label stays on its feature's side of a river.** *COMMUNITY,
institutional (Ordnance Survey) [18].* **Check:** inspect each burg and marker label in the screenshot.

**R6. Area labels sit inside the area, letter-spaced across its extent, with one orientation rule used across the whole map.
Line labels run parallel to the feature without touching it, on a gentle stretch, and are repeated on long features.**
*COMMUNITY [18]; one person [9][10].* Turner keeps a region label's centre inside its region, and penalises crossing a coast
or border [9]. Ocean-label arcs bend away from the map centre and stay upright [10]. **Check:** no area label crosses its
own boundary, and no river label sits on a tight bend.

**R7. Type carries meaning: serif (often italic) for natural features, sans for man-made ones, blue for water. Show rank
with size, weight and case, and use bold sparingly.** *COMMUNITY [18].* **Check:** water, landform and settlement labels
each sit in their own label group with one style (`define_style_group`).

**R8. Halo text only where it crosses detail, and keep the halo small.** *COMMUNITY [10][18].*

**R9. Label only what matters.** *COMMUNITY: one person [10].* Turner labels a river only when it is much longer than its
name [10]. For a studio map, the labels that matter are zones, the major landforms, settlements and the water the story
uses.

**R10. Names: keep the language patterns consistent, and add an English generic word ("Point", "Mountains") so nobody has
to decode an invented one. English descriptive names must make sense.** *COMMUNITY: one person [7].* Turner's example is
that "Hazy Mountains" works and "Distinct Mountains" doesn't. Real names come from landforms, people and events, and they
drift over time [7]. **Check:** every placeholder name is tagged `[placeholder]` (already done [41]). Final names come from
the vault, never from the map.

**R11. Colour carries meaning: wetter biomes are more saturated, arid ones paler, and the colours come from satellite
imagery.** *DEV-practitioner [12].* For Act I this argues for desaturated basin tones and saturated colour only where
there is water, life or mineral colour (the springs, the Dallol-style pools).

**R12. Make a region's identity readable: limit the materials and vegetation per region, and give each region its own bold
colour.** *DEV [23][33][34].* Sucker Punch limited foliage types per biome so each area felt fresh, and made bold colour in
nature a central theme [23]. Diablo IV gives each region its own real-world references, several biomes, threats,
element-themed monster families and dungeon tilesets that match the region [33]. **Check:** list Act I's zones with each
one's dominant ground material and colour. No two neighbouring zones should share both.

**R13. Don't repeat one set piece in every zone.** *DEV [35].* Looking back on Cataclysm, Tom Chilton warned against a
"volcano in every zone". **Check:** across acts, each signature landform (volcano, waterfall, salt pan, acid field) appears
once as a headline. Elsewhere it can only be a minor echo.

---

## 3. Planning geography for play (what carries over to a top-down region map that becomes ARPG zones)

**P1. Triangles at three scales: big ones as landmarks, medium ones that hide the next thing, small ones that set the
pace.** *DEV, second-hand [19][20][21].* Nintendo's field designers said a triangle gives a choice, "straight over the
triangle, or around", and hides what lies behind it for a surprise [19]. Rectangles hide things completely [19].
**For our map:** each act needs one big triangle seen from most of the act (Act I: the north-east volcano). It also needs
medium relief between zones (terrace steps, the dome, basalt ridges) that hides the next zone until you crest it.
**Check:** `query_cells` around the landmark. It should stand clearly above everything within ~30–50 km.

**P2. "Gravity": scatter points of interest of different visibility and importance so they pull players in different
directions. Don't space objectives evenly.** *DEV, second-hand [19][20].* Nintendo first spread towers evenly with events
between them. Playtest heatmaps showed paths bunched on a few routes and players feeling "too linear", and redistributing
the objectives spread the routes [19][20]. **For our map:** spread markers unevenly. Mix big, visible sites with small ones,
and put some off the main line.

**P3. Reveal in sequence: one feature leads to the next (hill, then bridge, then tower).** *DEV, second-hand [19][21].*
**For our map:** when the zone graph is handed off, say for each landmark which zone first sees it and from which side.

**P4. Something should call to the player every 30 seconds or less. Tall "flags" (smoke, a lone tree, birds) work at range,
ground "breadcrumbs" at intervals, and anything that blocks a flag is cleared away.** *DEV, reported [24].* This comes from
Parker Hamilton's GDC 2021 talk on Ghost of Tsushima's "weenies". **For our map:** this applies inside zones (level design),
but the map should record tall features, such as fumaroles, the volcano's plume and the waterfall spray, as per-zone facts
for environment art.

**P5. "If you can see it, you can reach it."** *DEV [23].* Sucker Punch's open-world goal, with few exceptions. **For our
map:** anything shown on a zone's horizon that is not reachable in that act gets a note saying why (cliff, acid, story
lock).

**P6. Design each location around the route the player arrives by: silhouette and composition seen from the road.**
*DEV [26].* This is from Miles Tost (The Witcher 3) in an interview [26]. **For our map:** record the arrival direction for each
zone. It ties into level design's rule T6 (exits face the next zone's compass direction).

**P7. Content sets the size of the world, not the other way round.** *DEV [25].* Tost: the quest content "dictated the size of
the world" [25]. CDPR resized areas that felt too big or too small [25]. **For our map:** the act's zone count and run length
decide how much map an act needs. Map kilometres are not zone metres (brief).

**P8. If a high point can see far, the distance must hold something.** *DEV [28].* Todd Howard said Skyrim's tall mountains
looked into neighbouring provinces, so the team "needed to have something" there [28]. **For our map:** from the
escarpment shelf the whole basin is visible, so the map should say what each high zone overlooks. Environment art needs
it for backdrops.

**P9. Regions with distinct identity, danger and purpose. Some regions are for exploring (ruins, nests, natural formations)
rather than towns, and empty running is cut.** *DEV [29].* This is from Kenshi's 2012 "World plans" post: smaller, denser
map, "more distinct zones" with their own factions and danger levels, some "impossible to survive" until strong, less
"uneventful long-distance running" [29]. Only the 2012 plans are primary. How the shipped game turned out is not covered
here.

**P10. Zone edges at natural barriers; chokepoints at passes, gorges, ramps and fords.** *COMMUNITY [1][5]; INFERRED.*
Travel cost rises with slope and river crossings [5], and settlements sit at passes [1]. My inference is that zone
transitions in an ARPG read best where the map already has a constriction. **Check:** every edge of the zone graph should
cross a feature on the map: a pass, a scarp ramp, a terrace step or a causeway between pools.

**P11. Water links neighbouring regions and makes the adjacency believable.** *DEV, reported [33].* In Diablo IV,
meltwater from Fractured Peaks falls into Hawezar's swamps [33]. **For our map:** where Act I meets Act II, the drainage
should say which act is upstream.

**P12. Verticality and layering: mix open ground with dense, built-up or dungeon-like areas.** *DEV [32].* Miyazaki said the
Shadow of the Erdtree map is "not quite open field and not quite legacy dungeon", and that the blend gives better
verticality [32]. **For our map:** mark which zones are open ground (washes, salt flats) and which are dense or layered
(basalt fields, the Slums below the city shelf), so the act alternates them.

**P13. Within a zone, a change of tileset should follow a physical change, like a dry upper floor and a flooded lower one.**
*DEV, reported [34].* Blizzard's "tile-set transition" in the Flooded Depths [34]. **For our map:** per-zone facts list what
changes inside a zone (dry to brine, gypsum to salt), not only its main ground.

---

## 4. Realism against gameplay and looks: "believable, not realistic"

**X1. Real places are adapted, not copied.** *DEV [23][38].* Sucker Punch's Tsushima is "not a 1:1 recreation" [23].
Ubisoft had a historian who reined the team in when creativity went "too far" [38]. **For us:** Danakil/Dallol is the
reference, not a template, and the vault plays the historian.

**X2. Start from a mostly believable base and add the exotic later. Outlandish worlds still need consistent internal
rules.** *DEV [39].* World designer Nathan Cheever suggests an 80–90% believable base early on [39]. **For us:** every
impossible feature (acid pools on a dome, a waterfall into a hyper-arid basin) needs one stated cause that the rest of the
map respects.

**X3. Even the generator bends physics for looks, so hand edits that do the same are legitimate.** *DEV-practitioner
[12].* Azgaar doubles peak heights to get snowcaps and exaggerates mountain heights. He says he "was focused mostly on colors"
rather than correct biomes, while not wanting to "break the basic laws of nature" [12]. **For us:** repainting biomes with
`paint_biome` is expected. Faking the drainage or the lake chemistry needs a reason (B1, B6).

**X4. Depart from reality where readability needs it, and nowhere else.** *DEV [38].* In Spider-Man, night "departed the most
from reality" so the city stayed visible [38].

**X5. Keep a place's soul when you change it.** *DEV [35].* Chilton: Cataclysm's Desolace revamp "killed the Desolace
charm" by turning it green. He would have preferred it harsher [35].

**X6. Compress, but keep the landmarks people remember.** *DEV [39].*

**X7. Say what was bent.** *INFERRED, following CLAUDE.md ("the map never decides canon").* Each op that departs from B1–B19
says so in its `note`, with the reason (gameplay, look, story). The skill can then list every bend on request.

**X8. Fix the system when the same fault keeps coming back; post-edit a one-off.** *COMMUNITY: one person [6].* Turner does
both, and says he should tune more [6]. **For us:** a fault that recurs becomes a rule or a named tool, not repeated
hand-fixing.

---

## 5. Before/after maps: the same land in two eras

**E1. Same frame, same projection, same base. Only the time-dependent layers change.** *OBSERVED [37]; SOURCE [41].* NASA
tells the Aral Sea story as a sequence of images of one frame, and its 2009 image shows the shrinkage by comparison with the
lake's past [37]. Our build already splits `base/` (bedrock and landforms, shared) from `eras/before` and `eras/now`
(water, biomes, settlements, routes, notes) [41]. **Check:** both era builds must give identical `query_cells` height
summaries for every frame, except where a catastrophe op says otherwise.

**E2. Water changes first and most visibly: lakes split into lobes, shorelines retreat, and the exposed bed shows as a
pale film that feeds dust.** *OBSERVED [37].* The Aral split first into north and south seas, then the south split into
eastern and western lobes, and the eastern lobe almost vanished [37]. **For Act I:** the "now" salt flats and brine pools
should sit inside the "before" lake or wetland outlines. Pale rings between the two show where the water was.

**E3. Rivers and their towns move: abandoned channels, oxbows, river towns left dry.** *COMMUNITY [3].* **For us:** a
"before" settlement on water can be a "now" ruin away from water (the Ruined Outpost is the obvious candidate).

**E4. Keep the landform skeleton identical, so the change is what players notice.** *DEV [36].* Nintendo kept Breath of the
Wild's Hyrule for Tears of the Kingdom, and said they "wouldn't have been able to" add their new ideas with a new world
[36]. Changes were concentrated (cliff caves, sky islands, the depths) so players "see the world in a different light"
[36]. They also found that too many additions cluttered the sky [36].

**E5. A changed region should show the catastrophe, not just be refreshed.** *DEV [35].* Chilton wished Desolace had shown
Cataclysm's damage [35]. His "one-third" rule: a third old content, a third improved, a third new [35].

**E6. The "now" map carries visible traces of the "before".** *DEV [31].* Miyazaki wanted the world to suggest "a Golden Age
has passed" [31], and noted that keeping every area dark "would be too oppressive" [31]. **For us:** every "before"
settlement or route appears in "now" as a ruin, a faded road or a dry bed, unless the story erased it. Some untouched places
stay beautiful (the brief's "otherworldly" places).

**E7. Landform changes between eras are catastrophe ops, never drift.** *INFERRED.* If the story needs the ground itself to
change (a collapse, a new crater, a lava flow), it is a named op in `eras/now/` with the vault reference in its note.
Everything else in `base/` stays shared.

Leads I could not read this session (don't cite until verified): the First Age vs Third Age maps of Tolkien's Beleriand
(encyclopedia-of-arda.com, permission timed out), and W. G. Hoskins's idea of landscape as a layered record (*The Making of
the English Landscape*, 1955; the Wikipedia page timed out).

---

## Source quality

| Rank | Source | Kind | Note |
|---|---|---|---|
| 1 | Azgaar source v1.156.0 [16] | SOURCE | The version pinned in the repo; ground truth for what the map can do |
| 1 | Nintendo Ask the Developer [36], Sucker Punch PS Blog [23], Miyazaki interviews [31][32] | DEV, primary | Direct quotes |
| 2 | Chilton GDC 2011 [35], Hamilton GDC 2021 [24], Tost interviews [25][26], Blizzard D4 [33][34] | DEV, reported | Journalists' reports of talks and interviews |
| 2 | CEDEC 2017 BotW field design [19][20][21] | DEV, second-hand | A translated tweet thread plus commentary. No transcript |
| 2 | Ordnance Survey [18], Axis Maps [17] | COMMUNITY (professional cartography) | Textbook conventions |
| 3 | O'Leary [5], Turner [6–10], Azgaar blog [11–13] | One practitioner each | Deep and specific. Azgaar's blog dates from 2017–18 and is older than the current code |
| 3 | K. M. Alexander [3] | One author | Cites geology sources. Agrees with [1][2] |
| 4 | Worldbuilding SE [1][2] | COMMUNITY | Read through a Kiwix mirror (Nov 2024 dump), because the live site was blocked. Vote scores weren't visible, so answers are given in page order |
| 4 | Kenshi [29][30], Cheever [39][40] | DEV | Thin on world geography. The date of [39] is unknown |

Could not read: worldbuilding.stackexchange.com (site blocked), cartographersguild.com (robots disallowed),
Jonathan Roberts' Wired tips (wired.com, permission timed out), NASA "World of Change: Aral Sea" (site error), ModDB Kenshi
"Dev Log: Landscape" (site error), the GDC Vault video "Change and Constant" (not watched). Artifexian is on YouTube and
was not attempted, so nothing here is sourced to him.

## Sources

1. Worldbuilding SE q.233210 "Common and unforgivable mistakes to avoid when drawing a map", Kiwix mirror: https://kwx.liehendr.com/content/worldbuilding.stackexchange.com_en_all_2024-11/questions/233210/common-and-unforgivable-mistakes-to-avoid-when-drawing-a-map
2. Worldbuilding SE q.152 "How (un)likely is a split of one major river into two others?", Kiwix mirror: https://kwx.liehendr.com/content/worldbuilding.stackexchange.com_en_all_2024-11/questions/152/how-un-likely-is-a-split-of-one-major-river-into-two-others
3. K. M. Alexander, "We Need to Talk About Your Rivers", 28 Feb 2024: https://kmalexander.com/2024/02/28/we-need-to-talk-about-your-rivers/
4. Jonathan Crowe, The Map Room, "The 'River Sins' of Fantasy Maps", 8 Mar 2024 (a pointer to [3] only): https://www.maproomblog.com/2024/03/the-river-sins-of-fantasy-maps/
5. Martin O'Leary, "Generating fantasy maps": https://mewo2.com/notes/terrain/
6. Scott Turner, "In which the Author turns a Critical Eye upon his owne Works", Aug 2019: https://heredragonsabound.blogspot.com/2019/08/looking-in-mirror.html
7. Scott Turner, "The Naming of Places (Part 1)", 2 Jun 2018: https://heredragonsabound.blogspot.com/2018/06/the-naming-of-places-part-1.html
8. Scott Turner, "Saving for a rainy day", Mar 2017: https://heredragonsabound.blogspot.com/2017/03/saving-for-rainy-day.html
9. Scott Turner, "Area labels", May 2017: https://heredragonsabound.blogspot.com/2017/05/area-labels.html
10. Amit Patel (Red Blob Games), "Labels on maps", 20 Aug 2024: https://www.redblobgames.com/blog/2024-08-20-labels-on-maps/
11. Azgaar, "Settlements, Regions, Routes and Labels", 21 Nov 2017: https://azgaar.wordpress.com/2017/11/21/settlements/
12. Azgaar, "Biomes generation and rendering", 30 Jun 2017: https://azgaar.wordpress.com/2017/06/30/biomes-generation-and-rendering/
13. Azgaar, "Confluences", 27 May 2017: https://azgaar.wordpress.com/2017/05/27/confluences/
14. FMG wiki "Generation Process" (mirror): https://git.korz.dev/backups/Fantasy-Map-Generator/src/commit/05c53d276aaa1153f8d61c6ab515f79fccd6744f/wiki/Generation-Process.md
15. FMG wiki "Heightmap customization": https://github.com/Azgaar/Fantasy-Map-Generator/wiki/Heightmap-customization
16. Azgaar source, tag v1.156.0 (`tools/azgaar/source`): `src/model/physical/lakes.ts` (evaporation, closed lakes), `river-generator.ts` (downhill routing, lake outlet only if flux > evaporation), `src/controllers/physical/lakes-editor.ts` (fresh/salt/dry tooltips), `features-generator.ts` (lake subtypes)
17. Axis Maps, Cartography Guide, "Visual hierarchy": https://www.axismaps.com/guide/visual-hierarchy
18. Ordnance Survey, Guide to cartography, "Text on maps": https://docs.os.uk/more-than-maps/geographic-data-visualisation/guide-to-cartography/text-on-maps
19. Matt Walker's translation of Nintendo's CEDEC 2017 talks (gist by idbrii): https://gist.github.com/idbrii/e39fe96279aa1670319bfa521d907399
20. Robert Yang, Radiator Blog, 5 Oct 2017: https://www.blog.radiator.debacle.us/2017/10/open-world-level-design-spatial.html
21. GIGAZINE, 4 Oct 2017: https://gigazine.net/gsc_news/en/20171004-breath-of-the-wild-design-secret
22. GDC Vault session "Change and Constant" (page only): https://gdcvault.com/play/1024562/ ; GamesRadar on the Kyoto-scale prototype, 5 Mar 2021 (via DidYouKnowGaming?): https://www.gamesradar.com/breath-of-the-wild-map-started-life-as-a-scale-version-of-kyoto
23. Joanna Wang (Sucker Punch), "Crafting the world of Tsushima", PlayStation Blog, 9 Jul 2020: https://blog.playstation.com/?p=333111
24. Bryant Francis, "A taxonomy of weenies" (on Parker Hamilton, GDC 2021), Game Developer, 22 Jul 2021: https://gamedeveloper.com/design/a-taxonomy-of-weenies-the-landmarks-that-define-i-ghost-of-tsushima-i-
25. Patrick Klepek, Kotaku, 6 Oct 2015 (Miles Tost, Kuba Szamałek): https://kotaku.com/how-the-witcher-3s-developers-ensured-their-open-world-1735034176
26. Tyler Wilde, PC Gamer, 26 Jan 2015 (Miles Tost): https://www.pcgamer.com/the-witcher-3-level-designer-on-the-delay-pc-controls-and-world-building-2
27. Nintendo Life, Jul 2022 (Philipp Weber, CDPR stream via IGN): https://www.nintendolife.com/news/2022/07/witcher-3-dev-admits-he-overcrowded-one-map-with-too-many-points-of-interest
28. Luke Plunkett, Kotaku, 13 Feb 2012 (Todd Howard at DICE): https://kotaku.com/why-you-can-see-morrowind-from-skyrim-30791628
29. Kenshi dev post "World plans", captain_deathbeard, 10 Nov 2012: https://www.moddb.com/news/world-plans
30. GameSkinny, Kenshi developers (Chris Hunt): https://www.gameskinny.com/culture/behind-the-scenes-with-the-developers-of-kenshi/
31. PlayStation Blog, Miyazaki interview, 28 Jan 2022: https://blog.playstation.com/2022/01/28/an-interview-with-fromsoftwares-hidetaka-miyazki/
32. Wes Fenlon, PC Gamer, 12 Jun 2024 (Miyazaki on Shadow of the Erdtree): https://pcgamer.com/games/rpg/with-shadow-of-the-erdtree-fromsoftware-wanted-to-build-a-map-thats-not-quite-open-field-and-not-quite-legacy-dungeon-but-instead-blends-the-two-together
33. Game Informer, 1 Mar 2023, tour of Diablo IV's five regions: https://www.gameinformer.com/2023/03/01/a-guided-tour-through-the-five-regions-of-diablo-4s-sanctuary
34. MP1st, 29 Mar 2022, on Blizzard's Diablo IV quarterly update: https://mp1st.com/news/diablo-4-open-world-dungeons-discussed-in-depth-in-new-dev-update
35. Engadget, 2 Mar 2011, Tom Chilton at GDC 2011: https://www.engadget.com/2011-03-02-gdc-2011-tom-chilton-discusses-cataclysm-design-talent-and-zon.html
36. Nintendo, Ask the Developer: Tears of the Kingdom, part 3: https://www.nintendo.com/sg/interview/totk/03.html
37. NASA Earth Observatory, "Aral Sea Continues to Shrink", 27 Aug 2009: https://science.nasa.gov/earth/earth-observatory/aral-sea-continues-to-shrink-39944/
38. Destructoid, 25 Mar 2019, GDC 2019 talks (Insomniac, Ubisoft): https://destructoid.com/?p=244998
39. 80.lv, "The art of game world maps" (Nathan Cheever), date not shown: https://80.lv/articles/the-art-of-game-world-maps
40. 80.lv, Nathan Cheever, 6 Oct 2026: https://80.lv/articles/veteran-game-world-designer-explains-why-bigger-game-worlds-aren-t-always-better
41. This repo: `world/README.md`, `CLAUDE.md`, `tools/azgaar-mcp` tool list

---

## Recommendations for the skill (ranked)

1. **Run a plausibility pass after every water or terrain change**, as a checklist: B1 (rivers end somewhere lower), B2 (no
   splits except declared fans and deltas), B6 (lake chemistry matches the water balance), B9–B10 (ranges have a cause, the
   wet side faces the wind), B14–B15 (settlements and roads have a reason). Report each failure with a `query_cells` result.
2. **Every bend from realism gets a note naming its reason** (gameplay, look, story) (X7). The skill can then answer
   "what did we fake and why" in one list, and push back on a change request by pointing to the rule it breaks.
3. **Era discipline:** `base/` is shared, and eras change only water, biomes, settlements, routes and notes. A landform change is
   a named catastrophe op tied to the vault (E1, E7). Check it by diffing height summaries between the two builds.
4. **Every zone-graph edge must cross a real feature on the map** (pass, scarp ramp, terrace step, causeway), and every
   zone boundary must follow a height break, water or a biome change (P10, B16).
5. **Region identity test:** list each zone's dominant material, colour and signature feature. Neighbouring zones must differ,
   and no headline set piece repeats across acts (R12, R13).
6. **One big landmark per act, visible from most of its zones, plus medium relief that hides the next zone** (P1, P8). Hand
   off "seen from where" facts to level design and environment art.
7. **Readability pass before calling a visual pass done:** squint and greyscale tests (R1, R2). Distinct line styles for
   washes, rivers and routes, with a legend (R4). Label placement and type conventions (R5–R8). Do this alongside the
   existing `screenshot`-against-reference rule.
8. **Before/after content rules:** "now" water sits inside the "before" water outlines (E2). Every "before" settlement and
   route leaves a trace in "now" unless the story erased it (E3, E6). Keep some places untouched and beautiful (E6).
9. **Don't over-mark:** markers for what the studio needs, and secrets as notes (B18).
10. **Names come from the vault.** The map uses consistent placeholder patterns with English generic terms (R10).
11. **Build named check tools instead of `run_js`** for river source and mouth heights and lake subtypes. `list` covers
    features, burgs, markers and routes, but not rivers [41].

## Open questions for George

1. **How far can physics bend for a look?** For example, a perennial waterfall feeding a hyper-arid basin, or acid pools on a
   dome. Is "one stated cause in the note" enough, or do some features need the vault to explain them?
2. **Who reads the map?** It never ships, so is it for the studio only? Or will a player-facing act map (like PoE2's act
   screens) be drawn from it later? That decides how much effort labels, the legend and typography deserve.
3. **Act I's headline landmark:** is it the north-east volcano, the escarpment waterfall, or both, at different scales
   (P1)?
4. **Does the catastrophe change landforms** (collapse, crater, lava flow, a breached rim), or only water, life and
   settlement? This decides whether any `base/` heights differ between the eras.
5. **Bright and dark balance (Miyazaki's point):** which Act I zones are the "absolutely beautiful, otherworldly" untouched
   ones, and should every act have at least one?
6. **Zone borders:** may a zone straddle a major barrier (for example, half on the shelf and half below the scarp), or must
   the scarp always be a zone edge?
7. **Naming style:** invented-language names with English generic words ("Kessa Flats"), plain English descriptive names
   ("the Gypsum Steps"), or a mix by culture?
8. **The mineral washes:** draw them as seasonal water (dashed blue, river-like), or keep them as a route class with a
   legend entry?
