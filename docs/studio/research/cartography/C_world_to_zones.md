# C. World and act maps to playable zones: what the cartographer hands level design and environment art

Track C of the `arpg-cartography` research (brief: `_brief_common.md`). Written 13 Nov 2026. Every web source was read
on 13 Nov 2026.

**Scope.** How ARPGs draw an act or region as a map, how the map's directions and regions line up with the 3D zones,
and what a cartographer must therefore hand the level designer (`arpg-level-design`) and the environment artist
(`arpg-environment-art`). It ends with a proposed handoff format.

**Access notes.**
- poe2wiki.net and Fextralife block automated readers (as the level-design research found). poe2db.tw was read only
  through a summarising fetch: its tables and token lists below are what that fetch returned, not a raw copy.
- No video was re-watched for this track. Video findings come from the studio's own caption-and-frame notes (LD-F,
  EA-F), cited with their timestamps.
- The GDC Vault was not reached. Blizzard's D4 GDC 2024 level-art material is known only through the slide captions
  the env-art research read (EA-C S1).
- Diablo IV's region and zone structure has no developer write-up at the level of PoE2's tile talks. The D4 findings
  are statements of intent (quarterly updates, BlizzCon, a marketing video), not methods.

## Sources

**Studio research reused (read-only copies under `/mnt/user-data/uploads/ARPG/`).** Cited by file, then by that file's
own source number or timestamp:

| Key | File | Its source numbers |
|---|---|---|
| LD-A | `Docs/Studio/research/level-design/A_ggg_dev_statements.md` | finding IDs (N3, N10, N11…) |
| LD-C | `Docs/Studio/research/level-design/C_reference_zones.md` | its own S1–S74 (S2 = poe2db Act 1, S23 = Definitiv Clearfell, S58 = Gamepressure ExileCon 2023 interview) |
| LD-F | `Docs/Studio/research/level-design/F_video_notes.md` | the level-design skill's `sources.md` numbers: S1 Steven (lead level designer, 2025), S2 Rhys Abraham (ExileCon 2019), S3 "Streamlining the Campaign" (2026), S7 Endgame reveal (2024), S8 Return of the Ancients reveal (2026), S9 Rogers, "Trials of Game Engineering" (2021), S10 Blake and Fabian (2025), S34 D4 "Inside the Game" (2023) |
| LD skill | `.claude/skills/arpg-level-design/` SKILL.md, `references/layout-topology.md` (T-rules), `navigation.md` (N-rules), `sources.md` | rule IDs |
| EA-B | `Docs/Studio/research/environment-art/B_poe2_breakdowns_and_zones.md` | its S-numbers (S6 = Lioneye's Watch rework) |
| EA-C | `Docs/Studio/research/environment-art/C_blizzard_d4_env_art.md` | its S1 (Fatima GDC 2024), S2 (Gao GDC 2024), S4 (D4 Quarterly Update Mar 2022) |
| EA-F | `Docs/Studio/research/environment-art/F_video_notes.md` | by section and timestamp (Olofsson, ExileCon 2019, `uPy74M9FNpY`) |
| EA skill | `.claude/skills/arpg-environment-art/` SKILL.md, `references/lookdev.md` (Z1–Z7, L1–L10) | rule IDs |
| PIPE | `Docs/Studio/PIPELINE.md` (§2 passes, §3 zone folder) and `Docs/ArtStandards.md` §1 | sections |
| NARR | `.agents/skills/arpg-narrative/references/studio-integration.md`, `templates/geo-change-request.md` | — |
| P# | `docs/studio/research/cartography/E_project_decisions.md` (George's decisions P1–P26) | decision IDs |
| WORLD | this repo: `world/README.md`, `world/frames.json`, `world/eras/now/*.json` | op IDs |

**New sources (this track).**

| # | Source | Kind | Access | URL |
|---|---|---|---|---|
| C1 | poe2db.tw, "Act 1" page: the area table and the `G1_WorldMap` topology field (data-mined, 0.5 era) | OBSERVED (data) | summarised fetch | https://poe2db.tw/us/Act_1 |
| C2 | PoE2 0.5.0 "Return of the Ancients" patch notes, full mirror (Kami-labs), 22 May 2026 | DEV (patch notes) | text, first 100k of 124k characters | https://kami-labs.fr/en/path-of-exile-2/poe2-patch-0-5-return-of-the-ancients-notes-complet-en/ |
| C3 | Wes Fenlon, "Path of Exile: The Fall of Oriath expansion…", PC Gamer, 14 Feb 2017 | DEV (reported) | full text | https://pcgamer.com/path-of-exile-the-fall-of-oriath-expansion-adds-five-acts-and-a-whole-lot-of-deicide |
| C4 | Luis Barriga, "Diablo IV Quarterly Update – June 2020", Blizzard | DEV | full text | https://news.blizzard.com/en-us/article/23463858/diablo-iv-quarterly-updatejune-2020 |
| C5 | "Diablo IV Quarterly Update – March 2022" (Ryder, McDaid, Fletcher, Hutchings, Head), Blizzard (= EA-C S4) | DEV | full text, re-read for regions | https://news.blizzard.com/en-us/article/23788294/diablo-iv-quarterly-updatemarch-2022 |
| C6 | BlizzCon 2019 "Diablo IV World and Lore" panel transcript, page 4 (Blizzplanet); the speaker is given only as "Jesse" | DEV (transcript) | full text | https://diablo.blizzplanet.com/blog/comments/blizzcon-2019-diablo-iv-world-and-lore-panel-transcript/4 |
| C7 | Same panel, page 5 (Harrison Pink, quest designer) | DEV (transcript) | full text | https://diablo.blizzplanet.com/blog/comments/blizzcon-2019-diablo-iv-world-and-lore-panel-transcript/5 |
| C8 | David Craddock, "How Diablo 2 Evolved from Gothic Horror to Epic Fantasy", Shacknews, 29 Jun 2018 (book excerpt quoting Blizzard North staff) | DEV (reported) | full text | https://shacknews.com/article/105720/how-diablo-2-evolved-from-gothic-horror-to-epic-fantasy |
| C9 | Erich Schaefer, "Postmortem: Blizzard's Diablo II", Gamasutra, 2000 (university mirror) | DEV | full text | https://www.cs.hmc.edu/~markk/SWE_copies/postmortem__diablo_ii.html |
| C10 | Teo1904, "Diablo II: Resurrected Map Reading", Maxroll, updated 24 May 2023 | COMMUNITY / OBSERVED | full text | https://maxroll.gg/d2/resources/map-reading |
| C11 | medierra (Crate), "Level Paths and Dynamic Barriers", Grim Dawn development forum, 12 May 2012 | DEV | full text | https://forums.crateentertainment.com/t/level-paths-and-dynamic-barriers/27701 |
| C12 | "Level Design Changes | Coming in Convergence", Last Epoch forum news, 2 Mar 2023 (= LD skill S41) | DEV | full text | https://forum.lastepoch.com/t/level-design-changes-coming-in-convergence/52235 |
| C13 | captain_deathbeard (Kenshi's developer account), "World plans", ModDB, 10 Nov 2012 | DEV (plans, not shipped facts) | full text | https://www.moddb.com/news/world-plans |
| C14 | "Diablo 4 map – how big is it?", Gfinity, 26 May 2023 (measurements by Guided News) | COMMUNITY (measured) | full text | https://www.gfinityesports.com/guides/diablo-4-map-size |
| C15 | Maxroll, "PoE2 Campaign Story Overview", 21 Dec 2024 | COMMUNITY / OBSERVED | full text | https://maxroll.gg/poe2/resources/path-of-exile-2-campaign-overview |
| C16 | "The quest map UI in act 2/3 is cool in concept but needlessly confusing", PoE forum, 13 Dec 2024 (player thread, no staff reply) | COMMUNITY | full text | https://www.pathofexile.com/forum/view-thread/3631744 |

---

## Findings

Each finding: the rule or fact, its origin tag and source, and **Map check:** how the cartographer checks it on our
Azgaar map (tool names from `README.md`: `list`, `query_cells`, `screenshot`, `get_map_info`).

### 1. How ARPG acts are drawn as maps

**W1. A PoE-style act map is an abstract node-and-line map over a painted region, not a scale map.** PoE2's act
screens show nodes joined by lines over a painted, monochrome map (OBSERVED, EA-F Olofsson 8:05–8:11; LD-F S2 18:10:
"~13–15 nodes, branching"). Diablo III's Adventure map was abstract ("things weren't exactly where they were"), while
D4 shows places "where they actually are" because its world is one contiguous space (DEV, C6).
*Map check:* the handoff is a graph with bearings, never a cropped Azgaar image (P2, P6).

**W2. In PoE2 the act map itself is assembled from region tiles with variants.** poe2db lists six topologies for
`G1_WorldMap`, 14 tokens each, built from region tokens (`Clearfell_1/1F/2/2F/3/3F`, `OldForest_1/2`, `Graveyard_1/2`,
`Village_1/2`, `Canopy`), one `Underground_<NE|NW|SN|SE|SW|WE>` token per variant, plus `Label`, `Compass`, `source_1`,
`source_2`, `sink_1` and `end` (OBSERVED, C1). The six Clearfell tokens match Definitiv's "3 world-map configurations
with 2 variants each" for Clearfell (COMMUNITY, LD-C S23). *INFERRED:* the act is drawn as five or six regional
clusters; `F` is probably a flipped variant; the `Underground` suffix probably sets which way an underground connection
runs on the map; `source`/`sink` probably place a river. None of these readings is confirmed by GGG.
*Map check:* our act's clusters are its painted biome zones (WORLD `30-biomes.json`); list them with `query_cells`.

**W3. Each zone's layout variants are keyed to the act map's variant.** Clearfell's topology tokens carry compass
prefixes (`Sexit`, `Ebridge`, `Esource`, `Nbridge`, `Nsource`), and its Grelwood and Mud Burrow entrances "line up with
their world-map positions" (OBSERVED, LD-C S5; COMMUNITY, LD-C S23). Grelwood's tokens name its neighbours
(`clearfell`, `redvale`, `grimtangle`) (OBSERVED, LD-C S6).
*INFERRED:* GGG meets the map–layout contract by authoring a zone graph per act-map orientation. With one fixed act
map, we need only one bearing per connection.

**W4. PoE2's act maps began per-character random and were then fixed.** In 2019 "every character gets their own
personalized randomized road map" and GGG "no longer canonically say[s] that the manor is to the north of the
village" (DEV, LD-F S2 18:16); Olofsson called it "another layer of randomization" where "the layout of the entire act
can change" (DEV, EA-F Olofsson 7:00). The world-layout seed later became per league, partly because per-character
layouts broke party play (DEV, LD-C S58), and reveal-era chapter maps became static around ExileCon 2023 (OBSERVED,
LD-C S19).
*INFERRED:* randomising the act's geography costs canon ("which way is the manor?") and co-op. Keep our act map fixed.

**W5. The 3D zones must match the map's directions, and GGG had to fix drift.** "The direction of the connections
that you see on your world map match what you find in the 3d world"; other characters "need to physically walk to a
different place in town", and wrong exits are "blocked by boxes" (DEV, LD-F S2 18:36–18:56; 33:38–34:00). In 0.5
(May 2026) the Act 1–3 world maps "have been made to more accurately reflect the in-game directionality of area
layouts" (DEV, C2). Our level-design rule T6 makes this a check: the exit bearing within 45° of the world-map direction
(LD skill T6).
*INFERRED:* in PoE2 the map was redrawn to match layouts that had drifted. In our studio the map comes first and the
layout must comply, but drift can still happen. The cartographer re-reads each approved `level_spec.md` exit bearing
and flags mismatches.
*Map check:* recompute the bearings after every map pass that moves a zone anchor, and diff them against the last
handoff.

**W6. Regions on a world map carry biome identity, and content is restricted by it.** "Most maps are restricted to
certain biomes" on PoE2's Atlas (DEV, LD-F S7 0:51:20); PoE2's endgame Riverside carries "biome Forest" in its data
(OBSERVED, LD-C S17). D4 has five regions, each with a construction style and materials that reflect "its culture and
climate" (DEV, EA-C S2), and "each region has its main city" (DEV, LD-F S34 05:53).
*Map check:* every zone in the handoff names exactly one primary biome from the painted biomes (`query_cells` majority
biome in the zone's footprint).

**W7. Region adjacency is stated in compass terms even in marketing.** Blizzard placed the Fractured Peaks "east of"
the Dry Steppes and the Dry Steppes south of Scosglen (DEV, C7); D2's manual map drew a dotted route from the Rogue
Encampment to Lut Gholein (DEV, C7, Pink, recalling D2). D4's world is "contiguous … from coast to coast" (DEV, C5,
McDaid).
*INFERRED:* players and writers navigate the world by compass words. The handoff gives both a bearing in degrees
(for T6's check) and an 8-point compass word (for writers and briefs).

### 2. Zones per act, hubs and branching

**W8. A PoE2 act has about 15–18 areas, one town, and level rising about one per zone.** poe2db's Act 1 table lists
18 areas: one town (Clearfell Encampment), area levels 1–15 along the chain, and waypoints in most zones (none in the
Riverbank or Mud Burrow) (OBSERVED, C1; LD-C S2–S12). George's Act I plan is "about 15–20 playable maps in all"
(PROJECT, P23).
*Map check:* count the zone anchors in the handoff; 15–20 is the plan.

**W9. PoE2 Act 1 is a main chain with hubs and dead-end spurs.** Connection counts (OBSERVED, LD-C §D, C1):
Riverbank 1 (town), Clearfell 3, Mud Burrow 1, Grelwood 4 (Clearfell, Red Vale, Grim Tangle, Lost Catacombs), Red Vale
1, Grim Tangle 2, Cemetery 4 (Grim Tangle, Tomb, Mausoleum, Hunting Grounds), Hunting Grounds 3 (with Freythorn),
Farmlands 2, Village 2, Ramparts 2. Spurs with one connection: Mud Burrow, Red Vale, Freythorn, Tomb, Mausoleum.
*INFERRED:* the act graph has 3–4 junction zones of degree 3–4, a spine of degree-2 transit zones, and about 5
single-link spurs. That is the graph shape to expect from the story, not one the map should impose.

**W10. Hubs anchor clusters, and a hub zone is "large, sparse … multiple entrances and landmark encounters".** GGG
called the Hunting Grounds "the template for a hub zone" (DEV, LD-F S8 1:08:26). Hub zones of degree 3–4 hold the
waypoint at a central landmark (the Grelwood's Tree of Souls) (OBSERVED, LD-C §D; INFERRED, LD-C implication 11).
*Map check:* a degree-3+ zone sits where several landforms meet (a confluence, a pass mouth, a terrace junction):
`query_cells` its footprint shows two or more neighbouring biomes on different sides.

**W11. Towns are hubs and safe havens, and a town can be exited in several directions.** "The cities and towns are
designed to be hubs … havens" (DEV, LD-F S34 05:53). In PoE2 "for the first time a town can be exited in different
directions" (DEV, EA-F Olofsson 7:00). Towns take longest to build and need spare room (DEV, LD-F S10 0:32:48–0:36:13).
D2 went from one town to four, one per act, and a reload puts you in the last town visited (DEV, C9).
Our Slums are the locked safe hub (PROJECT, P23).
*Map check:* the hub's connections leave it on different sides. If two leave on the same side (bearings within 45°),
flag it: level design's T6 cannot then give each its own wall.

**W12. Optional areas exist to be found, and the act map shows them.** PoE2 marks "the many optional encounters"
on the map, some with permanent boosts, and one spirit boss per act (DEV, LD-F S7 0:26:18–0:26:39). D4 camps "turn
into friendly outposts with NPCs and a waypoint" once cleared, and "quests don't directly send you to them" (DEV, C4).
D4's detours come from what you pass "along the road to your destination" (DEV, LD-F S34 06:26–06:42). Grim Dawn gives
"multiple different paths you can take" to each of three destinations out of its first area (DEV, C11).
*INFERRED:* optional zones sit beside the main chain, not at its far end. Geographically they are side valleys, caves,
and features just off the route the story walks.

**W13. Waypoints sit at entrances, landmarks or required features, never at random for the map's sake.** D2 waypoints
are fixed near an entrance (Cold Plains), random within an area (Stony Field), or tied to a feature (City of the
Damned, beside the stairs down) (COMMUNITY, C10). Grim Dawn made riftgates "far more frequent than in Titan Quest"
(DEV, C11). Every new PoE2 0.5 entrance sits beside a checkpoint, waypoint or lamp (OBSERVED, LD-F S3 02:50–03:13).
*Map check:* waypoints are a level-design and game-design decision. The handoff lists them only "if decided" (build
brief §3.4) and never invents them.

### 3. The direction contract (level-design T6)

**W14. T6 needs one bearing per connection, measured on the act map.** Level design checks `exit_bearing_deg` within
45° of "the world-map direction written in `level_spec.md`", and asks George when the brief lacks it (LD skill T6).
*Map check:* compute, don't eyeball (build brief §3.4). See Recommendation R2 for the method.

**W15. Exits never share a border with the entrance (D2 and PoE2).** D2 wilderness exits never share an edge with each
other or the entrance (OBSERVED, LD skill S37), with per-area rules such as "the exit can NEVER be on the bottom left
edge" (COMMUNITY, C10). PoE2's Farmlands exit is always on the wall opposite the entrance (COMMUNITY, LD-C S1, S27).
*INFERRED map consequence:* for a degree-2 zone, the bearing to its entrance neighbour and the bearing to its exit
neighbour should differ by at least 90°, ideally about 180°. A zone whose two neighbours lie on the same side cannot
meet T4–T6.
*Map check:* for every zone, the angle between the bearings to its predecessor and its successor; flag < 90°.

**W16. Up-screen is north-east under our camera, and the act's direction of travel should mostly run that way.** The
game camera looks north-east: it shows 8.4 m ahead and 5.1 m behind, and T7 wants the main route to trend up-screen
or across, with `downscreen_share` ≤ 0.25 (PROJECT/DEV, LD skill T7; Last Epoch maps "extend up and to the right",
DEV, C12). Screen angle = compass bearing − 45°. Bearings of 180–270° (south through west) point down-screen.
*INFERRED:* a zone whose exit bearing lies between S and W runs its route down-screen. T6's 45° tolerance lets level
design push it to the S or W edge of that range, but no further.
*Map check:* label each connection with its screen direction; flag any successor bearing within 180–270°.

**W17. The camera side (south and west) must be low; tall landforms belong north and east of the walk.** Tall masses
go north and east; the camera side is ≤ 1 m, cut away or fading (LD skill N9; DEV, LD-F S2 19:38: tiles facing
up-screen "are much shorter"; EA-F Olofsson: walls facing the bottom of the screen made much shorter).
*INFERRED:* a cliff or escarpment on a zone's west or south side lands on the camera side. Our escarpment lies west
and north-west of the Slums and the city (PROJECT, P18), so the zones at its foot have their tallest landform on the
camera side. GGG flipped its Act 3 town because it "just felt better" against the fixed camera (DEV, LD-F S10
0:33:28). The handoff must therefore list, per zone, the tall landforms by compass side.
*Map check:* `query_cells` heights in four quadrants around each zone anchor; flag a quadrant on the S/W side that is
much higher than the anchor (for example 8+ Azgaar height units).

**W18. Water flow is a free compass, and level design wants it.** "If you happen to find the river, you can follow it
upstream and it will always lead you to the Red Vale" (DEV, LD-F S3 00:17); GGG's tiles carry `source`/`sink`/`join`
tokens (OBSERVED, LD-C S6). N3 makes water "a directional spine" that flows one way along the route (LD skill N3).
*SCIENCE-lite / INFERRED for our act:* in an endorheic basin every wash and stream drains toward the lowest ground, the
salt pan (P19). So "downstream leads to the pan" is a true rule across the whole act.
*Map check:* `list` rivers and routes (washes) in frame `act1`, with each one's flow bearing (source to mouth) per zone.

**W19. A road pulls the player and belongs on the main route.** "You introduce a road, someone's bound to follow it
immediately" (DEV, LD-F S1 09:25; LD skill N4); GGG added a signpost "Follow the Grain Road" (DEV, LD-F S8 1:09:06).
Our routes show only real traffic and never join zone to zone (PROJECT, P16; WORLD `README` "Routes").
*INFERRED:* the handoff says which zones a real road crosses, and on which bearing. Level design decides whether that
road becomes the zone's loud cue (N1, N4); the cartographer never draws a road just to link zones.
*Map check:* `list` routes inside each zone's footprint; record the entry and exit bearing of each.

### 4. The act as a journey

**W20. The act's arc comes from story; level design suggests cadence changes.** In PoE2 the player's arc comes from
"Mark or Jonathan directly or perhaps the story team", and level designers suggest changes such as "we need another
side area" (DEV, LD-F S1 06:35). The map never decides canon (PROJECT, P1).
*INFERRED:* the cartographer places the arc on the ground. It doesn't author the arc.

**W21. Zone order builds dread, with an open zone before the closed one.** GGG put the player on the Riverbank, then
the "little bit more open" Clearfell, "to give a little bit of time and more impact when you actually get into the
proper forest area" (DEV, EA-F Olofsson 28:00–29:50). Our environment art places each zone on that curve (EA skill
Z7). PoE2 Act 1 alternates open and narrow zones (OBSERVED/INFERRED, LD-C implication 11).
*Map check:* give each zone's geographic openness (wide pan or plateau vs canyon, wash or tube) as a fact. Environment
art and level design set the dread curve from it.

**W22. Acts are journeys across regions, each with its own environment.** D2 planned four acts as Irish countryside,
desert, jungle and hell, and Act I ends with a caravan "heading east" to the next region (DEV reported, C8). A Blizzard
North artist wanted to "show that there's a world beyond just the dungeon" (DEV reported, C8, Okamura). PoE2's acts
are a forest region, a desert with a moving caravan base, a jungle and city with a past/present split, then islands
reached by ferry, each island with its own biome (OBSERVED/COMMUNITY, C15).
*INFERRED:* inside one act the journey is told by crossing landforms (down the escarpment, across the washes, onto the
pan), the way acts cross regions.

**W23. Vertical direction tells the story: descend toward the threat, ascend to the climax.** PoE2 Act 1 ends in the
Manor's "lowest level" (COMMUNITY, C15), Act 3 ascends a temple to its apex (C15), and Geonor's arena is a hole dug down
(DEV, LD-F S10 0:21:44). Height changes in our zones happen only by ramps and stairs (PIPE, ArtStandards §1).
*SCIENCE-lite / INFERRED for our act:* the basin floor drops from the escarpment shelf to the pan, the lowest ground (P19),
so the act's main journey is a descent into a hostile sink. Its finale (4–6 upper-city maps, P23) is a climb back up.
*Map check:* the handoff gives each zone's Azgaar height band and the height step across each connection (ascends,
level, descends). Azgaar heights are relative units, not metres.

**W24. Revisiting a place in a later state is a proven ARPG structure, done mostly by material and tileset swaps.**
PoE1's Acts 6–10 "take players back through the places they visited in Acts 1-4 with new paths, stories, and bosses";
the Fetid Pool "changed tilesets into a lush forest" (DEV reported, C3). Lioneye's Watch's Act 6 version differs mainly
in materials, dark and rainy turned sunny and dry (DEV, EA-B S6). PoE2 Act 3 sends the player to the same city "at the
height of its power" (OBSERVED, C15), and a player found PoE2's past/present map confusing (COMMUNITY, C16). D4
strongholds stay changed once cleared, so a place has two art states (DEV, LD-F S34 05:16).
*Map check:* our before and now eras (P14) give, per zone, a list of physical differences: water present or gone,
biome repainted, settlement founded or ruined. Build both eras and diff `query_cells` per zone footprint.

### 5. Regions, transitions and what belongs where

**W25. Region-to-region transitions must be "geologically true", and they are set pieces.** "Making sure that it felt
sort of geologically true was really important": snowmelt from the Fractured Peaks falls as waterfalls into the
Hawezar basin (DEV, LD-F S34 01:32–01:56; EA-F D4 Inside the Game §4).
*Map check:* every connection that crosses a biome boundary names the physical reason for the change (a drop, a
water source lost, a lava front, a salt line). If it has none, it is a geography finding.

**W26. A location's look is "regional weather … local biomes, and a sense of history".** (DEV, C5 and EA-C S4,
Ryder.) Our environment art starts every zone from "what happened here" (EA skill Z1) and gives every kind of decay a
stated cause (Z3).
*INFERRED:* the cartographer can supply weather and climate (from `set_climate` and the vault), biome and ground (from
the painted biomes) and the physical half of history (the era diff). The human history comes from the vault.

**W27. Dungeons and side caves take the theme of the region above them.** D4 dungeons in Scosglen are "flooded … moss
everywhere"; in Kehjistan "dungeons filled with sand"; "all the dungeons are particularly placed to make sure that
they feel like this is a thing that could be in this part of the world" (DEV, LD-F S34 01:56–02:17). D4 reskins one
tunnel tileset per biome (OBSERVED from filenames, EA-C S19).
*SCIENCE-lite / INFERRED for our act:* an underground zone's kind follows the rock above it: lava tubes under basalt,
solution caves under gypsum, salt caverns under the pan.
*Map check:* for any underground zone, `query_cells` the biome and rock at its entrance; the handoff names the rock.

**W28. Open-world space is POIs and the wilderness between them, and transitions are polished last.** D4's level art
classifies space as POIs or wilderness, locks the terrain palette and road-to-wilderness transitions at "presentable",
and refines terrain-material transitions at "shippable" (DEV, EA-C S1). Environment art asks for transition tiles
wherever two tilesets meet (INFERRED, EA-C implication 4; ArtStandards EA5).
*INFERRED:* where a biome boundary runs through a zone's footprint, that zone needs two ground families and a
transition. Where it coincides with a zone border, the change happens at the area transition.
*Map check:* `query_cells` per zone footprint: list each biome above about 10% of the footprint, with its side.

**W29. Ground and material sets are per zone.** Stan Brown made one material set per Act 2 area, eight sets for eight
areas (DEV, EA-B S3). Environment art builds one named material set of 5–8 base materials per zone (EA skill M1;
ArtStandards EA5). D4 terrain sets are made per zone (DEV, EA-C S17).
*INFERRED:* the cartographer's "ground and rock" list per zone is the starting point for that set, as physical
substrates (basalt, gypsum pavement, halite crust, sulfur, alluvial gravel), never as materials or colours.

**W30. A settlement's approach is staged from outside it.** Kyovashad is reached through "a gradual buildup of smaller
defense structures" that "hints to you that something greater lies ahead", then steep walls and a deep moat (DEV, C5,
McDaid).
*INFERRED:* the zones before a hub carry its outworks: roads converge, the hub's walls show at the zone's edge. That
needs the hub's direction and what of it is visible from each neighbour.

**W31. Hub edges appear inside the neighbouring zones.** GGG's first outdoor graph is "the level right out of town …
the edge of the town tile", pinned as a fixed node (DEV, LD-F S9 0:24:37). Rhys's outdoor graph has a `town_N` node and
"a large room at the bottom is the town entrance" (OBSERVED, LD-F S2 07:35, 08:45). The Riverbank's boss besieges the
camp "just outside the Clearfell Encampment gates" (OBSERVED, LD-C S14, S46).
*INFERRED:* with a fixed iso camera there is no horizon to show a skyline. "Visible from the neighbouring zone"
means the neighbour's edge physically enters this zone (a gate, a wall, the foot of a cliff with the city on it), or it
shows past a zone edge that drops away (a shelf over the basin).

**W32. With a fixed camera, vistas are composed, and distant landmarks show only where the terrain allows.** D4 tunes
"layouts and vistas … because the player's view is known" (DEV, EA-C S4); PoE2 zooms out only "where terrain
supports" it (DEV, LD-F S2 53:35); Titan Valley's heads are visible from the spawn (DEV, LD-F S3 02:03); a 2025 summary
mentions activity visible below the player (DEV as reported, LD-A V3).
*INFERRED:* the handoff lists, per zone, the landmarks that could plausibly be seen (the active volcano's plume or
glow, the falls, the city shelf above, the pan's glare below) and the bearing to each. Level design and lighting decide
whether and how they show (N5, N12).

**W33. Kenshi gives each zone its own factions, danger, creatures and biome, and fills empty space with POIs.**
"The world map will have more distinct zones", with ruins, nests and "natural formations, things to explore", and
"less empty space like the endless dunes" (DEV plans, C13).
*INFERRED:* a hazardous-wasteland act still needs a reason to cross each stretch. The handoff names the natural
features in each zone (fumaroles, fossil benches, a dead spring) as candidate POIs, without placing them in the layout.

### 6. Scale

**W34. ARPG zones are not a literal scale of the world map.** PoE2 zones run about 250–350 m of main route (3–5.5 min
story runs) (PROJECT, ArtStandards §1, from George's PoE2 measurements). George: "zones are abstract tile slices with
no km size", and "atlas distances do not set walking times or tile counts" (PROJECT, P5; NARR). The geography change
request template carries a "scale caution" line (NARR).
*INFERRED arithmetic:* Act I is about 100 km rim to rim (P15). 15–20 zones × about 0.3 km of route is 4.5–7 km of
walked route, so a zone stands for a stretch of country roughly 15–25 times longer than its walk.

**W35. Even "seamless" open worlds compress geography heavily.** D4's whole playable Sanctuary measures about
7.6 × 8 km, roughly 60 km² (COMMUNITY measurement, C14); Blizzard only says "the world of Diablo IV is incredibly
large" (DEV, C5, Fletcher). Five regions with real-world models (Scotland, the Carpathians) fit in that space (DEV,
EA-F D4 Inside the Game §3).
*INFERRED:* no ARPG reference ties walking distance to map distance. The handoff gives directions, adjacency and
landform order, never kilometres or travel times.

**W36. Early zones are constrained in size so progression can be balanced.** GGG reduces random size variance early
in the game, because XP balance breaks if a level "can be like 50% larger for some people" (DEV, LD-F S9 0:23:12).
*INFERRED:* zone size is a game-design number (ArtStandards §1), not something the map's areas may suggest. A large
landform such as the pan gets one zone or several by story need, never by area.

**W37. A map cell is too coarse to place anything inside a zone.** Our Azgaar cells are about 2–2.3 km across
(WORLD `README` "Water"; brief), roughly ten times a zone's whole main route.
*INFERRED:* per-zone facts are qualitative (what landforms, which side, which way the water runs), never positions of
props, rooms or exits.

### 7. What the downstream skills ask for

**W38. The zone brief (pass 0) is where geography enters the pipeline.** `00_brief.md` holds "story, purpose in the
act, map type, reference zones, constraints per discipline", drafted by the producer from the act's zone document and
approved at G0 (PIPE §2–§3). Level design reads it as its first input (LD skill §2); environment art reads it with
the story and act docs (EA skill §2).
*INFERRED:* the cartographer's handoff is an input to every `00_brief.md`, so its per-zone section must be short and
copyable into a brief.

**W39. What level design needs from the map, by rule ID** (LD skill; INFERRED mapping):

| Rule | What it needs | Handoff field |
|---|---|---|
| T6 | world-map direction of each exit (else ask George) | bearing ° + compass word per connection |
| T4–T5 | exit at the far end, elongated zone | angle between entrance and exit bearings (W15) |
| T7 | route trends up-screen or across | screen direction of each connection; down-screen flag (W16) |
| T15 | related side entrances close together | which spur zones hang off which zone, and on which side |
| N1, N3, N4 | a loud cue: river, road, wall-line; water flows one way | water and road per zone with flow / travel bearing (W18, W19) |
| N5 | one landmark with a hook, visible from far | candidate landmarks in or seen from the zone, with bearing (W32) |
| N9 | tall masses north and east | tall landforms by compass side, camera-side flag (W17) |
| §3.1 | map type: narrow path or large open | landform openness (W21); a suggestion, level design decides |

**W40. What environment art needs from the map, by rule ID** (EA skill; INFERRED mapping):

| Rule | What it needs | Handoff field |
|---|---|---|
| Z1 | what happened here, when, who was here and is now | the era diff (physical) + vault links (story); open items marked |
| Z3 | a cause for every kind of decay | physical causes from the map: drought, salt, acid, ash, flood line lost |
| Z5 Q4 | what the ground holds besides soil and stone | substrates and minerals per zone |
| Z5 Q5 | what grows here | biome and vegetation, before and now |
| Z5 Q8 | what changed since: flooded, burnt, abandoned… | before → now per zone |
| Z7 | the zone's place on the dread curve | openness and order along the journey |
| M1, EA5 | one material set per zone; transitions at reasoned joins | substrates; biome boundaries inside or at the zone's border (W28) |
| §2 inputs | the brief, the story and act docs | the handoff feeds the brief, never replaces the vault |

**W41. Environment art must ask George what the docs don't answer and never invent lore** (EA skill Z5). The same
holds for the cartographer (P1, P7: canon goes to George). A per-zone fact the map cannot settle is written as OPEN,
with the question, never filled in.

**W42. Geography change requests come with a fixed set of fields** (NARR template): story function, evidence, feature,
era, physical reason, current implementation, proposed operations (named tools only), what stays unchanged, scale
caution, validation (rebuild before and now, screenshot, re-open the `.map`), approval ("author decides; mapper
implements").
*INFERRED:* the handoff should cite the change request that caused each later change to a zone's facts, so level
design and environment art can see why a fact moved.

---

## Recommendations for the skill (ranked)

**R1. The act handoff is a zone graph with computed bearings plus one geography sheet per zone, and nothing that
belongs to another discipline.** It gives directions, adjacency, landform order, ground, water, climate, landmarks and
before → now. It never gives kilometres, travel times, zone sizes, layouts, waypoints (unless decided), materials or
lore not in the vault. (W1, W34–W37, W41; P1, P5, P16.)

**R2. Compute every bearing from the map, with one method, and print the screen direction beside it.**
- Each zone has an anchor: a marker or label op ID in `world/eras/now/` (as zone 01 already does, op
  `now.marker.caravan`), read with `list` in frame-local 0–1 coordinates (x west→east, y north→south, `frames.json`).
- The bearing from zone A to zone B: `dx = (xB − xA) · 100 km`, `dy = (yB − yA) · 64 km` (Act I `sizeKm`);
  `bearing = (atan2(dx, −dy) in degrees + 360) mod 360`, 0 = north, clockwise.
- Where the connection's crossing point is known (a pass, a ramp down the escarpment, a wash mouth), also give the
  bearing from A's anchor to that point. When the two differ by more than 45°, the crossing bearing is the T6 value,
  and the note says why. This is INFERRED: GGG's map draws node-to-node lines (W1, W5).
- Screen direction = bearing − 45° (up, up-right, right…); flag any successor bearing in 180–270° (W16).
- A script in the skill does this (build brief §4 "scripts"); a named MCP tool is better if bearings are needed inside a
  build. That is for track D to decide.

**R3. Run the graph checks before writing a handoff, and report failures as findings, not silent fixes:**
1. degree-2 zones: the bearings to predecessor and successor differ by ≥ 90° (W15);
2. hubs: no two connections within 45° of each other (W11);
3. successor bearing in 180–270° is flagged as down-screen (W16);
4. tall landforms on a zone's S/W side are flagged as camera-side (W17);
5. every biome change across a connection has a physical reason (W25).
A failed check goes to George with options: move an anchor (a map change, P7 if it settles no canon), bend the
geography locally inside the zone (P8, said and why), or accept and let level design handle it (switchback, mirror).

**R4. Per-zone geography sheet fields** (each fact tagged with where it came from: vault decision, map op ID, or
INFERRED):
1. ID, name `[placeholder]`, role in the act (from the vault), eras present.
2. Anchor op ID and frame-local position; primary biome; Azgaar height band.
3. Connections: neighbour, bearing °, compass word, screen direction, height step (ascends, level, descends), crossing
   landform, decided or OPEN.
4. Openness: open pan or plateau, terrace benches, canyon or wash, underground; a map-type hint for level design.
5. Edges by side (N, E, S, W): what bounds the zone (escarpment face, pan, lava front, dune field), with the
   camera-side flag.
6. Ground and rock: substrates in rough order of extent; biome boundaries inside the zone and on which side.
7. Water: kind (falls stream, seasonal wash, brine pool, acid pool, dead spring); source; flow bearing; sink; seasonal
   or permanent; hazardous or not.
8. Climate and air: drought, heat, wind and its bearing, haze, ash or steam, from `set_climate` and the vault.
9. Landmarks: in the zone; seen from it (with bearing); this zone's features seen from its neighbours.
10. Before → now: physical differences between the eras' builds, with each cause (W24, W26).
11. Story pointers: vault paths that say what happened here; anything missing is OPEN with its question for George.
12. Open items and the change requests that touched this zone.

**R5. Act-level sections above the zone sheets:** the journey (start, end, descent and climb profile, W22–W23); the
clusters (the painted biome zones as the act's regions, W2, W6); hubs and spurs (W9–W12); the dread-curve facts
(openness in route order, W21); a down-screen and camera-side summary (R3); the scale caution (W34).

**R6. Keep one fixed act map and one bearing per connection.** Don't randomise act geography per seed or per
character (W4). Variety lives in the zone layouts (LD skill T8).

**R7. Re-check after every map pass and after every G1.** Recompute bearings when an anchor moves, and diff them
against the last handoff. After a zone's G1, compare `level_spec.md`'s recorded exit bearing with the handoff's and
flag drift (W5).

**R8. Underground and side zones take their kind from the rock above (W27), and spurs hang off the zone the story
passes, on the side where the landform is** (a side valley, a lava tube mouth). Never place them by area.

**R9. Write the per-zone sheet so a producer can paste it into `00_brief.md` under a "Geography (from the act map)"
heading** (W38). Keep it to about one screen per zone.

### Proposed format of the handoff document

File (George's decision P26: the one cartography file in the ARPG repo), for example
`Docs/Act 1 scenes/_act_graph.md`. The path is George's call.

```markdown
# Act I zone graph (from the act map)
Map build: <git sha of world/>, eras: now (+ before). Generated <date> by arpg-cartography. Bearings computed, not drawn.
Scale: zones are abstract slices; no distance here is a walking distance (P5).

## Journey and clusters
<5–8 lines: start → end, descent/climb, clusters (biome regions) in route order, hubs and spurs>

## Connections
| From | To | Bearing ° | Compass | Screen | Height step | Crossing | Status | Source |
|---|---|---|---|---|---|---|---|---|
| 01 Caravan Approach | 02 Slums | 118 | ESE | right | descends | pass road onto terrace | decided | vault P23; op now.marker.caravan |
| 02 Slums | 03 Ruined Outpost | … | … | … | … | … | OPEN: order not locked | … |

## Checks
<the five R3 checks: pass or the flagged connections, each with options for George>

## Zones
### 02 Slums [placeholder]
- Role: safe hub, no combat (vault). Eras: before, now.
- Anchor: op <id>, frame (0.xx, 0.yy). Biome: Spring Oasis / Mineral Washes. Height band: …
- Edges: W escarpment face and falls (camera side: flag) · N … · E terrace drop to washes · S …
- Ground: alluvial gravel, iron-stained wash floor, travertine at the falls' foot …
- Water: falls stream from the upper-city shelf, flows E then … to the pan; permanent.
- Landmarks: falls and upper city above (W, seen from 01 and 03); volcano plume NE …
- Before → now: … (from the era builds)
- Story: <vault links>. OPEN: <questions>.
```

The bearings in the example row are placeholders that show the format, not computed values.

## Open questions for George

1. **Which zone anchors exist?** Only zone 01 has an anchor op today (`now.marker.caravan`), and the 19-section scaffold
   is provisional (WORLD `README`). Should the cartographer place one anchor marker per planned zone in a separate
   `now` op file, tagged provisional, so bearings can be computed? Or should it wait for the vault to list the zones?
2. **How does the player move between zones in Act I:** walking through connections only, or a waypoint or portal
   network from the Slums (P16 says it's undecided)? The "Slums → ruined outpost → Slums" start (P23) implies a hub
   return. The handoff marks such links as "return to hub" and shouldn't guess the mechanism.
3. **The camera-side escarpment.** The escarpment is west of the Slums and the city, the camera side under our
   north-east camera (W17). Should zones at its foot bend the cliff to read as a north wall (bending geography, P8),
   cut it away or fade it (level design N9, technical art), or should the story enter those zones so the cliff is
   behind the player?
4. **Down-screen legs.** Any part of the journey that heads south or west (toward the Dead Spring to the south, or back
   to the Slums from the east) runs down-screen (W16). Is it acceptable to tilt such connections toward SE or NW on
   the map within geology? Or should those zones always be reached from the other side?
5. **Where does the handoff file live** in the ARPG repo, and should the producer copy each zone's sheet into its
   `00_brief.md`, or link to it?
6. **The before era in the handoff.** Should every zone sheet carry a before → now section now, while the before map is
   still mostly open (P24)? Or only once the before era's water and settlements are drawn?
7. **Fixed act map.** Confirm that Act I's geography is the same for every seed and character (R6), unlike PoE2's
   early per-character maps (W4).
