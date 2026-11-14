# Story and world review — ARPGStoryBible as of 2026-11-13

Read-only review of every note in the vault copy (AGENTS, README, World/ 4, Research/ 2, Factions/ 3, Act I/ 4, Act I/Path A/ 4, indexes and template), with the narrative skill's plausibility gates, the studio pipeline, the level-design skill, environment art's `lookdev.md`, and the map's ops in ARPGMapTools `world/`. Nothing was edited and nothing was built.

**Note keys used below.** README = `README.md`; ActI = `Act I/Act I - Reboot and Captive Caravan Opening.md`; Blueprint = `Act I/Act I Region - Danakil-Dallol Geological Blueprint.md`; PathA = `Act I/Path A/Act I Path A - The Slums Beneath the Walls.md`; FirstRegion, IdeaBank, Scene = the other three Path A notes; PathB, PathC; Slaver = `Factions/The Slaver Faction - Act I City.md`; FacIdeas = `Factions/Faction Ideas and Research…`; HistSpine = `World/Historical Spine…`; Inventor = `World/Ideas - The Inventor…`; Principle = `World/Campaign Principle…`; Themes = `World/Themes…`; ResGeo = `Research/Research - Post-Catastrophe…`. Map = ARPGMapTools `world/` op files. Dates are 2026, written MM-DD.

---

## 1. What is decided

Status words follow AGENTS: **Confirmed/LOCKED** (George chose it), **Provisional** (favoured, may change), **Open**.

| Topic | What stands now | Status | Source (note § date) |
|---|---|---|---|
| Genre and body theme | Dark-fantasy isometric ARPG; mechanical limbs, biological grafts and unmodified bodies are meaningful choices | Confirmed | README §Current creative direction |
| Campaign framing | Not save-the-world; ancient wars centuries ago; switching off the machine restores nothing; meeting the inventor is not the end | Confirmed | Principle §Confirmed framing (10-25); README |
| Campaign size | About six acts; the world is far larger than the campaign; work is focused on Act I | Confirmed (working target) | README §Campaign scale (10-26); §Regional scale (11-02) |
| World look | Drier, Kenshi-like; main theme is hazardous wasteland; some places the corruption hasn't reached yet are otherworldly and beautiful (Expedition 33) | Confirmed direction; where these places are is Open | README §World look (11-05) |
| History | A technological golden age, then wars and catastrophes, then today; magic-extraction power against a synthetic/engineering power | Layers Confirmed (Themes); the two-empire war is Provisional | Themes §Confirmed; HistSpine (10-25/27) |
| Magic and machines today | Both ordinary and often mixed; the old empires are gone as powers | Confirmed | README §Historical and modern technology; HistSpine §Ancient rivalry |
| Grand Machine | Its extraction of the earth's essence is the intended cause of the wasteland and the acid pits; how it works, whether it still runs, and the inventor's fate are Open | Cause: author direction (11-02); the rest Provisional/Open | ActI §Environmental cause (11-02); Blueprint §OVERRIDE; Inventor; Principle §Unresolved |
| Peoples | Probably humans and machines, with no fantasy races | Provisional | Themes §Provisional |
| Factions | One specific organized slaver faction controls the Act I city. Slavery exists more widely than this faction. Name, structure and laws are Open | Confirmed core | Slaver §Confirmed; Factions index |
| Protagonist | Not a chosen hero. Enslaved, escapes, wanted; wants a better life in rumoured beautiful, untouched lands. Whether the rumour is true, and where, is Open | Confirmed motive | README §Campaign motive (10-26); PathA §Updated goal; ActI spine (11-13) |
| Act I spine | Escape captivity → refuge in the Slums → pursue promised passage → betrayal and slaver ambush → route sealed behind → several upper-city zones → Act I boss → passage into Act II | Confirmed | ActI §Act I spine (11-13) |
| Betrayal staging | The Slums leader offers an abandoned route out; it leads into an abandoned upper-city district where he waits with slavers ("the only way I can help our people") | Provisional | ActI §Working betrayal concept (11-13) |
| Hub contact | The old man from the arrival scene is the Slums' informal leader and main hub NPC; name and history Open | Confirmed | ActI spine; Scene §Sheltering figure (11-13) |
| Zone 01 / 02 | 01 = caravan-escape combat tutorial (wake by a toppled caravan, bandits and slavers fighting, take a weapon, tutorial boss). 02 = Slums: safe hub with no combat, quests and vendors | 01/02 LOCKED (11-02); the 01 sequence is working detail (11-13) | ActI §Hub-first (11-02), §Opening sequence (11-13); Blueprint §OVERRIDE |
| Zone count | About 15–20 maps; 4–6 upper-city combat maps; one hub; many are plain traversal maps | Working target | ActI §Hub-first; Blueprint §LOCKED 8 |
| Region | Inland, south-central/SW of the continent's centre; an endorheic (closed) mineral rift basin modelled on Danakil/Dallol | LOCKED | Blueprint §LOCKED (11-02); README |
| Region layout | Escarpment on the W/NW rim; city at its foot; washes and Ruined Outpost mid-basin; basalt N; terraces and gypsum stepping E; salt flats on the E floor; acid pits at the south edge; Dead Spring S. Names are placeholders | LOCKED as a workable layout | README §Map decisions (11-03); Blueprint §OVERRIDE (11-03) |
| Scale | Lore scale: Act I about 100 km rim to rim (floor about 60 km); continent about 800 km. Zones have no km size | Confirmed | README §Map decisions (11-03) |
| Volcano | The north-east volcano is active | Confirmed | README (11-03) |
| The city | A medium-sized city: the Slums plus an upper city of nobles and wealthier civilians. Not a capital. Placeholder population 15,000 (9,000 + 6,000) | Confirmed (supersedes "camp/town") | README (11-03), (11-05); Slaver §(11-03) |
| City form | The upper city is on a shelf in the escarpment directly above the Slums, a short switchback apart, with the falls between | Map implementation, corrected 11-06 | README §Act I present-day map |
| Roads | The main road enters through the low SW pass, crosses the terrace to the Slums and climbs one spur to the upper city. Slavers bring captives along it, and merchants and free people use it too. An old caravan road fades out mid-basin | Author direction (11-03, 11-05) | README §Map decisions; §Act I present-day map |
| Why the city controls passage | — | **Open** ("why (or whether)") | README §Map decisions (11-03) |
| The slavers' rule | Slum residents are free citizens. Slavers take only escaped slaves, the wanted and fugitives. A practice, not a protection law | Confirmed (supersedes 10-26) | README §Map direction (11-06); Slaver §Confirmed |
| Slum economy | Legally free but economically trapped; they sell scavenged material to brokers | LOCKED (10-26) | PathA §Author decisions |
| The salvage site | An ordinary destroyed ruin with picked-over scrap and broken robot parts. Not an organized scrapyard, not an intact facility, not a defining battlefield. Original function Open | Confirmed correction (11-02) | PathA §Approved clarification; ActI §Visual correction |
| Acid pits | A main theme of the act; must stand out beyond what Dallol would justify; localized; sit on a low dome at the pan's south edge; the pan and brine pools are the lowest ground | Confirmed (11-06) | README §Map direction (11-06) |
| Acid chemistry | Linked to extraction; mechanism Open. Whether the field predates the machine: Open | Open | README §Act I present-day map (11-05); ActI §Environmental cause |
| Before/after maps | Built in parallel on one terrain. The before map is lush; the now map applies a drought (precipitation at 25%) | Confirmed; map work Provisional | README (11-03, 11-05, 11-06) |
| Dead Spring | A living freshwater oasis on the before map; today stagnant mineral pools | Map implementation (Provisional) | README §Act I present-day map (11-05) |
| Retired | Flooded Lowlands, Father Aldous and the Drowned Crypt, Silt Crossing and the other old zones; the tldraw board; Notion as the working copy | Retired | README §Retired (10-25); (11-03); (11-13) |

---

## 2. Contradictions and stale text

Newer dated decisions win (AGENTS §Status labels). "Unmarked" means the older passage hasn't been marked superseded where it stands.

| # | Older or stale text | Newer text | Winner | Marked? |
|---|---|---|---|---|
| C1 | "small-to-medium camp or local town" — PathA §Author correction (11-02); ActI §Wasteland identity (11-02) "small-to-medium camp/town"; Blueprint §Proposed geography, §LOCKED 6 "modest local camp", §OVERRIDE "small/medium outpost"; the scaffold rows 15–19 "camp gate", "stockaded precinct" | "medium-sized city" (README 11-03) | 11-03 | Marked in ActI, Slaver, Blueprint §OVERRIDE 11-03. **Unmarked in PathA §Author correction (11-02)** and in the scaffold table's camp wording. The map still names the burg "Slaver Upper Camp" |
| C2 | "Protected inside town; vulnerable outside … Local law prohibits simply seizing … free people within the town's protected jurisdiction" (PathA §Confirmed local law, 10-26). Echoed in Scene §Story function ("a town whose law ostensibly protects free residents") and §Scene questions; FacIdeas §Confirmed constraints ("outside protected town limits they risk kidnapping"); Slaver §Open questions Q4 | "simply free citizens. There is no protection directive" (Slaver §Confirmed, 11-06; README §Map direction 11-06) | 11-06 | Marked in Slaver only. **Unmarked in PathA, Scene and FacIdeas.** Still unclear: whether residents are at risk outside the city, which was the 10-26 "scavenging is dangerous" engine |
| C3 | "LOCKED DIRECTION … Old battle-salvage site … potentially an old battlefield" (PathA §Author decisions, 10-26); Slaver §Provisional depiction "A historic battlefield / salvage site nearby provides metal"; FacIdeas "salvage old battlefield scrap" | "destroyed, deteriorated ruin … not the relic of a special major ancient battlefield" (PathA §Approved clarification, 11-02). The map's own guess is "a former caravan waystation (provisional)" (Map 40-settlements `now.marker.ruined-outpost`) | 11-02 | **Unmarked** in PathA 10-26, Slaver and FacIdeas. The map's "waystation" appears nowhere in the vault |
| C4 | "Act I branches … Status: all remain open … competing approaches" (ActI §Act I branches 10-25); PathA banner "OPEN STORY BRANCH — not canon … No places, quests … selected"; PathB/PathC `status: branch` | The Slums hub is LOCKED (11-02); the Slums are the city's own slums (11-06); spine (11-13) | Path A is in effect chosen | **Unmarked.** B and C read as live alternatives |
| C5 | ActI banner: "the new playable plot, factions, route and geography have NOT been approved" (line 12); §Current opening pitch "captive … brainstorm, NOT canon"; README "Provisional Act I seed" and "Open: The location and environment for our newly designed Act I; its nearby settlement, captor/slaver faction…"; README §Retired "No replacement map, hub, quest or boss is yet approved" | Region LOCKED 11-02; zones 01/02 LOCKED 11-02; slaver faction confirmed core; spine 11-13 | Newer | ActI adds a one-line pointer (line 14); the README's Current-direction bullets are **unmarked** |
| C6 | "why (or whether) the city controls onward passage" (README §Map decisions 11-03) | "the immediate obstacle is traveling past the … town" (README §Campaign motive, 10-26, Confirmed); spine 11-13: "The way forward is through the city" | "Whether" no longer stands; "why" stays Open | Unmarked |
| C7 | "Lore and approval status still live in Notion" (README §Map decisions 11-03, LOCKED bullet); "Distances in Notion are not to be trusted" (README 11-06); Blueprint §Live editable source "duplicated from the index page in Notion"; `notion:` URLs in every frontmatter | Vault is the authority; Notion is archive (README decision log 11-13; AGENTS) | 11-13 | Unmarked. (The repo's CLAUDE.md also says not to cite Notion) |
| C8 | tldraw instructions: PathA §Author correction "Do not relocate X or redraw shapes" on tldraw; Blueprint §Status "Do not rewrite the larger continental tldraw map"; §Author endorsement "No map edits until user confirms"; README 11-02 "preserve those placements" | Azgaar is the master map and the continent is drawn fresh (README 11-03) | 11-03 | Marked in README only; **unmarked in PathA and Blueprint** |
| C9 | Blueprint first scaffold table: Slums = 06, "slum outskirts" = 05 | Slums = 02 (11-02 OVERRIDE) | 11-02 | Marked in ActI §Hub-first, not inline in Blueprint |
| C10 | "Before creating 10–15 zones…" (ActI §Next authoring work) | 15–20 maps (11-02) | 11-02 | Unmarked |
| C11 | Blueprint §OVERRIDE scaffold arithmetic "only 17 combat-capable … 18 combat? check carefully" | §Count correction: 18 combat + 1 hub | Count correction | Messy text, left in place |
| C12 | Slums and upper city "about 30 km apart" — ARPGMapTools `world/README.md` §Settlements | "directly above … a short switchback road apart"; 30 km retired (README 11-06) | 11-06 | Stale in the map repo README. The ops now place the burgs about 7 km apart (`now.burg.upper-camp` 0.29,0.345; `now.burg.slums` 0.255,0.445) |
| C13 | Scaffold 15–16 "Slaver camp ascent", "Camp gate/inspection area" (Blueprint) | Spine: the player enters the upper city through an abandoned route into an abandoned district, by betrayal, not through the gate (11-13) | 11-13 | Unmarked. The finale's first zones need re-scoping |
| C14 | Status of the machine: HistSpine "whether the grand machine is responsible for the final damage remain open"; README "Provisional: … the machine caused catastrophic environmental damage" | "Acid pits and deteriorated wasteland ultimately reflect the Grand Machine's extraction" (ActI 11-02); "the corruption from the machine has not yet reached" some parts (README 11-05) | 11-02/11-05 for cause | Unmarked. The 11-05 wording also implies the corruption **is still spreading**, which sits uneasily with "might already be inoperative" (HistSpine §Inventor; Principle §Unresolved) and needs a decision |
| C15 | Map states things the vault still has Open: the before map has clear hot springs with travertine where the acid pools are (`before.lakes.spring.*`, `before.biome.travertine`), so the hydrothermal field predates the machine; the volcano is "Not the source of the acid pits" (`now.marker.volcano`); the falls stream is "the city's water source" (`act1.river.falls`); the Ruined Outpost is a waystation (C3) | Vault: whether the field predates the machine is Open, and the water source is Open (README 11-05; Blueprint §LOCKED vs OPEN) | Vault (map decisions follow canon) | These are reasonable cartographer proposals. They should go to George as proposals, not stay as map facts |
| C16 | "the escarpment road is the main road into the city" (README 11-03) | Main road through "the low south-west pass, across the terrace … up the one spur" (README 11-05) | Ambiguous | Is the "escarpment road" the whole road, or only the climb to the upper city? |

---

## 3. Plausibility gates

Verdicts: **pass**, **weak** (works only with an unstated assumption), **fail** (nothing in canon makes it work). Repairs are options for George, not decisions.

| Claim | Verdict | Why | Smallest repairs (options) |
|---|---|---|---|
| **Water for the city** | weak | The vault keeps the source Open (Blueprint §LOCKED vs OPEN). The map adds a perennial stream off the plateau down the falls (`act1.river.falls`), which is enough for 15,000 people if the plateau catchment is real. But the present map runs at 25% precipitation and the Dead Spring died: why did the stream survive? | (a) Adopt the falls stream and say it is fed by highland rain/snow on the central range, outside the drought's worst effects. (b) Add cisterns or qanat-style galleries in the escarpment. (c) Tie it to C14: the stream is shrinking, which explains the abandoned upper-city district |
| **Food for the city** | **fail** | Nothing grows in the basin on the now map apart from the strip along the stream. The farmland idea was dropped (FirstRegion §Reassessment). The south rim slopes into desert. No food source is named anywhere | (a) Farms on the highland plateau above the escarpment, which the upper city overlooks and controls. (b) Food arrives by caravan in exchange for a basin export (salt slabs, sulfur, salvage), the real Afar salt-caravan pattern the Blueprint already cites. (c) Both |
| **Caravan route; why captives come here** | weak | The road is real (Map `now.road.main.approach`), and README 11-03 says slavers bring captives *to* the city. But what captives are *for* here is undefined (ActI §What this opening needs Q2; PathA §Questions "Where are enslaved workers housed and used") | (a) Labour for the basin's export trade: salt cutting on the pan, sulfur or crust work at the acid field, brine. This also gives the salt-flat and acid zones present-day people. (b) A slave market that sends captives on up to the plateau. (c) Household and work-yard labour in the upper city. Option (a) fixes the most other gates at once |
| **The Slums are safe for a wanted fugitive** | **fail as written; weak with a repair** | Under the 11-06 rule the protagonist is exactly the person slavers *may* take from the Slums. Hub safety ("hides from slaver pursuit", ActI §Hub-first) rests on nothing stated. PathA §Risks and §Questions flag this. The 10-26 jurisdiction answer is superseded (C2) | (a) Safety is personal, not legal: the leader hides and vouches for the protagonist ("my nephew"), and the Slums won't inform on someone he protects. Then the betrayal turns the hub's safety into the trap, one mechanism carrying the whole act. (b) Slavers need a claim and a witness to take someone, and the Slums don't give witnesses. (c) The leader's standing deal: residents stay untouched because he hands over outsiders. This is already recorded as an assistant proposal, not approved (ActI §Unresolved) |
| **The commander sees the protagonist and rides on** | weak | Scene §Scene questions calls this "the highest-priority plausibility gate". There is no answer | (a) He isn't sure, and pulling a cloaked man from the leader's shelter in front of witnesses costs more than it's worth tonight. (b) He recognises the leader's shelter and lets the leader deliver later. This ties into the betrayal but the vault explicitly doesn't assume it. (c) The protagonist isn't recognisable yet (caravan clothes, no brand); keep any "wanted" mark mundane (PathA warns against magical collars) |
| **How the patrol already knows** | weak | The ambush is in the SW pass, about 30 km of road from the Slums on the map, and the protagonist walks | A mounted survivor, or a signal relay along the road, reaches the city before the protagonist. The 01 cutscene can show a rider fleeing |
| **Why the city controls passage** | **fail (Open)** | README 11-03 keeps it Open, yet the spine needs it. On the map the main road ends at the upper city; nothing leaves the basin past it | (a) The upper city sits at the head of the only graded climb from the basin onto the highland plateau, the stream valley (`act1.river.falls` runs NW onto the plateau). Its gate or switchback is the way up. (b) A toll-and-papers monopoly on the plateau road. (c) The basin's other exits (SW pass, north rim) are slaver-patrolled or lethal. (a) also explains the city's existence and food |
| **The acid pits' cause** | weak (geology passes; the story link is Open) | A Dallol-style salt dome over a hydrothermal system passes (README 11-06; Blueprint). The map's before era shows neutral hot springs with travertine that turned acid. The vault leaves the machine link Open (ResGeo §Dallol: "specify a plausible secondary mechanism") | (a) Extraction lowered the groundwater that used to dilute the system, so magmatic gas (SO2, H2S) now dominates and makes acid-sulfate pools. As visible proof, the old travertine terraces are etched and dissolving. (b) An undefined essence-residue fantasy process; acceptable, but it gives art nothing to follow. (c) The field is naturally acidic and the machine only amplified it. (a) makes the best before/after story |
| **The Dead Spring** | weak | Before: a freshwater oasis on the floor in the south (Map `act1.dead-spring`, about 0.39,0.76). Blueprint §Analogue 6 asks for "a credible earlier water table … and timeline" and an "upland-fed basin margin". The map places it mid-floor, not at a margin, and the stream survives while the spring died | (a) A separate fossil aquifer that the extraction (or the city's wells) drained, so salt crept in as the water table fell. (b) Move the spring to the foot of the south rim or the escarpment fans, making it upland-fed. (c) Same cause as the acid repair (a), one falling water table: the Act's single environmental story |
| **The ruins** | weak | "Picked-over destroyed ruin" passes the time-and-scavenging test (PathA 11-02; IdeaBank §1). Why robot parts lie at this site, and its original function, are Open. The map guesses a caravan waystation on the old road | (a) The waystation on the old caravan road, abandoned when the road (or the spring) failed; the broken robots were its haulers or guards. (b) A small outlying work site. Either way, decide whether the ruin and the Dead Spring share the old road's story; they are about 19 km apart on the map |
| **Travel between hub and zones** | weak but acceptable | The acid field is about 40+ km of hyperarid floor from the Slums (Map). The README 11-05 likely order (Slums → Outpost → Slums → Dead Spring → Acid Pits) needs repeated returns over long distances. Waypoints are an ARPG convention, but the fiction should nod to it | (a) Accept waypoints as gameplay only. (b) Salt-caravan or scavenger runner schedules give a diegetic way back. (c) Group the far zones (salt, acid) into a cluster done in one outing, with only one return |
| **Escape into the slaver city at all** | weak | The fugitive walks toward the slaver city (PathA §Unresolved Q1, never answered) | The pass and road funnel everything to the only water in reach, which is the falls at the Slums. The 01 exit points there; the old man's shelter is the first help |
| **The abandoned route and the abandoned district** | **fail (unspecified)** | The spine needs (1) a route believable as "out of the region", (2) that physically ends in the upper city, and (3) a reason a district of a living city is abandoned | (a) An old water-intake stair or tunnel up the falls slot (`act1.falls-slot`) that once fed a district now dry. Option C1(c) gives the reason it was abandoned. (b) Old mine galleries in the escarpment. (c) The old caravan road's lost upper leg. Use a hydraulic route with care: PathA §Access I already warns about gravity and pumping |
| **The act's exit** | **fail (Open)** | "Exact means of passage" is Open (ActI spine). Nothing on the map lies beyond the city, and the rumoured lands have no direction | (a) Up onto the plateau along the stream, through the upper city's gate: the boss guards it. (b) A lift or stair in the citadel. (c) Leave the boss guarding passage, but the map then needs a road onward |
| **Storm on the arrival night** | pass | The Slums sit at the escarpment foot under the falls, so an orographic storm is plausible. The vault already frames it as rare (ActI §Environmental cause; ResGeo) | — |

---

## 4. Geography-dependent claims (for the cartographer)

Each line is something the story says about the land. "Map:" gives what the ops currently say, where relevant.

1. Act I is inland, south-central/SW of the continent's centre, and does not touch the coast (Blueprint §LOCKED 1; README 11-02). Map: frame centre 0.40,0.63 (`frames.json`).
2. A closed (endorheic) basin; runoff evaporates or infiltrates; it need not be below sea level (Blueprint §LOCKED 2).
3. The escarpment is on the W/NW rim with highlands behind it (README 11-03). Map: plateau polygon, `act1.highlands`.
4. A Danakil-style horst or ridges on the east (Blueprint §Actual Danakil). Map: `act1.rim.east`.
5. Act I ≈ 100 km rim to rim, floor ≈ 60 km; continent ≈ 800 km E–W (README 11-03). Map frame 100 × 64 km.
6. The upper city is on a shelf in the escarpment directly above the Slums, a short switchback apart, with the falls between (README 11-05, 11-06). Map: burgs about 7 km apart; check that this reads as "directly above".
7. The Slums are on a terrace at the escarpment foot, on the fan below the falls (README 11-03; Map `act1.city-terrace`). The upper city is visible from the hub and much of the act (PathA §Core premise, §Dramatic opportunities): check the sightlines from the mid-basin zones.
8. The settlements need an accessible road and freshwater; the source is Open (Blueprint §LOCKED 6). Map: falls stream "used up" at the Slums. Check that the plateau catchment is large enough, given the 25% drought.
9. The main road comes through the low SW pass, across the terrace to the Slums, up one spur to the upper city (README 11-05). Check: the README calls the ground beyond the pass "lowland", but the plateau polygon reaches (-0.35,1.02). **Is the land beyond the Caravan Approach lowland or highland?** This decides whether the city really is the only way up.
10. "The escarpment road is the main road into the city" (README 11-03): reconcile with item 9 (C16).
11. The caravan ambush (zone 01) happens on the approach road. "Trail navigates reliable slopes across arid land" (Blueprint table 01). Map: marker at 0.06,0.80, about 30 km from the Slums.
12. The patrol "rides toward the exit of town" (Scene beat 8): which exit? On the map, only back down the SW road.
13. The old caravan road runs through the Ruined Outpost and fades mid-basin; where it led is Open (README 11-05). Map: `now.road.old.1–3`.
14. Ruined Outpost and mineral washes are mid-basin (README 11-03). The washes are iron-stained seasonal channels draining to the pan (Blueprint §Analogue 5; Map `act1.wash.*`).
15. Basalt to the north under the active NE volcano (README 11-03). Map: volcano at 0.84,0.10 with a summit lava lake, "not the source of the acid" (map-only claim, C15).
16. Fossil reef terraces and gypsum step down eastward (README 11-03). A former marine connection is optional and belongs to deep time only (Blueprint §LOCKED 3). Gypsum dunes (Blueprint §Analogue 3): Map has a small field ENE of the pavement.
17. Salt flats on the eastern floor. The pan and brine pools are the lowest ground (README 11-06). Map: pan height 21.
18. The acid field is localized, on a low dome at the pan's south edge (README 11-06). Map: dome centred about 0.77,0.74; marker at 0.665,0.705 and label at 0.77,0.875 sit apart from each other. Check that "southern edge" and the label read correctly.
19. The Dead Spring is to the south (README 11-03); before = freshwater oasis (README 11-05). Blueprint §Analogue 6 wants it "near an upland-fed basin margin". Map: hollow about 0.39,0.76 mid-floor, but the marker is at 0.31,0.80, about 6 km from the pool. Also `act1.water.spring.main` says "below the ruins": which ruins?
20. The old salt lake's extent, what stood at the city site before, and where the old road led are all Open (README 11-05, 11-03). The before map has no salt lake yet.
21. Acid field before the machine: Open in the vault; the map's before era shows hot springs with travertine (C15).
22. Rain at the Slums is rare, or the Slums sit nearer a wetter rim (ActI §Environmental cause; ResGeo §Dallol caveats).
23. Afar-style salt-caravan trails link basins, margins, passes and highlands, shaped by water and slope (Blueprint §Actual Danakil): the analogue for any trade road.
24. Sparse acacia, palm and shrub pockets on pan margins and fans (Blueprint §Actual Danakil). Check that the now biomes allow some.
25. Geological order: rim and settlements → mid-slope ruins, basalt, iron runoff → pale terraces and gypsum → halite pan and brine → tightly localized acid springs (Blueprint §Geological ordering rule).
26. Spine: an "abandoned route" believable as leading out of the region, which ends in an abandoned district of the upper city (ActI 11-13). Nothing on the map yet: the falls slot, the escarpment face or the old road are the candidates.
27. Spine: passage beyond the city into Act II (ActI 11-13). Nothing beyond the upper city on the map; the stream valley onto the plateau is the natural line.
28. Rumoured beautiful lands: direction and distance Open (README 10-26). Untouched regions to be painted later (README 11-05).
29. The outer boundary should blend naturally into the continent, not stay rectangular (README 11-06).
30. Placement relative to Kenshi: between the Swamp and the Burning Forest equivalents; four provisional faction areas on the old tldraw sketch (README 11-02/11-03). Not on the Azgaar continent; Open.
31. Only if revived (all superseded as defaults by PathA 11-02): terraced farms, a reservoir or aqueduct, a quarry, a cargo yard (PathA §Candidate economic geography; FirstRegion), and the industrial-valley idea (IdeaBank §Potentially shared geography).

---

## 5. Readiness for the studio

The pass-0 brief (PIPELINE §2–3) feeds level design §3 step 1 (purpose, 5–7 beats, map type) and environment art Z1/Z3/Z7 (what happened here, cause of each decay, place on the act's dread curve). Ratings: **R** ready, **P** partial, **B** blocked.

**Act-wide blockers, true for every zone:**
- No zone order or clusters. The README 11-05 sequence is only "likely".
- No dread curve.
- No Act I enemy roster: bandits, slavers, machines and fauna are all undefined.
- No map type (narrow-path or open) stated for any zone.
- The studio skills still read `Docs/Story.md`, `Docs/Act1.md` and `Docs/Act1Zones.md` (ROSTER fallback rows; level-design §2; lookdev Z5), and lookdev Z6 still names retired threads ("the drowned church, the Chainwright"). Until George points the producer at the vault, or at the narrative skill's seven-section brief, briefs will be drafted from retired canon.
- The narrative SKILL.md links templates (`zone-narrative-brief.md` and others) and references that weren't in the copy I was given. Only `plausibility-gates.md`, `studio-integration.md` and `geo-change-request.md` were present.

| Zone (scaffold) | Purpose | Beats | Map type | What happened here | Decay causes | Dread | Rating | What blocks it |
|---|---|---|---|---|---|---|---|---|
| 01 Caravan escape | Yes: tutorial, escape | Yes: 11-13 working sequence | Not stated (pass road) | Ambush; attackers "bandits", motive Open | Fresh violence; arid pass | Opening | **P (closest to ready)** | Who attacks and why, in one line; tutorial boss identity; time of day leading into the night storm; fellow captives yes or no |
| 02 Slums hub | Yes | Arrival scene beats (Scene) | Hub | Free poor quarter under the upper city | Poverty, makeshift building | Safe | **P** | The fugitive-safety rule (§3); what the Slums live on now that the battlefield is gone; leader's role and occupation; vendor roster; hub state after the betrayal |
| 03–04 Ruined road / Ruined Outpost | No quest | — | — | Open (waystation on the map only) | Centuries of exposure, scavenging | — | **B** | Quest purpose; the ruin's origin; the robot parts' origin |
| Dead Spring (named in the README sequence and on the map, **missing from the 19-section scaffold**) | No | — | — | Oasis → dead (map) | Water-table loss, cause Open | — | **B** | Its slot in the scaffold; its purpose; why it died while the stream lives |
| 05–06 Washes | Traversal | — | — | Seasonal floods | Iron staining, flood scour | — | **P for a traversal brief** | Order and cluster; enemies |
| 07–08 Basalt | Traversal | — | — | Old lava flows, active volcano | Natural; volcanic | — | **P** | Order; enemies; whether anything human is there |
| 09–10 Terraces / gypsum | Traversal | — | — | Deep-time reef | Wind, evaporite | — | **P** | Same |
| 11–12 Salt flat / brine | Traversal | — | — | Evaporation; possibly salt work | Natural | — | **P** | Whether people work the pan (caravan gate); order |
| 13–14 Acid pits | "Main theme" | — | — | Hot springs turned acid (map) | Mechanism Open | Probably the act's peak before the city | **B** | Purpose; the acid mechanism (C15/§3); what the player does there |
| Abandoned route + abandoned upper district (implied by the spine; no scaffold slot) | The betrayal | Ambush; leader withdraws; seal | — | Open | Abandonment cause Open | The turn | **B** | Route form; why the district was abandoned; how the seal works |
| 15–19 Upper city | Escape to the boss and passage | Only "multiple districts" | — | The faction's city; faction undefined | — | Climax | **B** | Boss; district list after C13; faction look and culture (lookdev Z6 "which culture shaped the stone"); the exit |

---

## 6. Story craft, from an ARPG writer's view

**Strengths**
- **The motive is personal and fits the world.** A wanted runaway who wants a better life and is captured partway there keeps the "world not waiting to be saved" promise and needs no chosen-one machinery (README 10-26; Principle).
- **The 11-13 spine gives the act a real turn.** Refuge → promise → betrayal → sealed return → fight upward → boss → exit is a clean act shape with a midpoint reversal and a pressured finale. It is distinct from PoE2's Act 1 (where Geonor's manor is reached by approach, not by betrayal).
- **The hub contact is also the betrayer.** That makes the safest place in the act the source of its biggest wound, which is the tone George asked for: treachery and backstabbing (ActI spine).
- **The geography is unusually strong.** The Dallol basin gives eight or nine real tile families with physical logic, the acid pits as a signature, and the before/after maps as a built-in environmental-storytelling engine (Blueprint; Map).
- **Discipline.** The plausibility gate, the status labels and restraint about landmarks keep Act I grounded (FirstRegion §Mandatory gate; PathA 11-02).

**Most important weaknesses** (each with a proposal, not a decision)
1. **The middle of the act is empty.** Between "refuge" and "promised passage" sit roughly 12 combat zones with no quest engine. The leader's "final quest in the lower/regional portion" is undefined (ActI spine §Unresolved). *Proposal:* make the middle the *price of passage*. The leader sets two or three jobs, each a cluster (salvage at the Outpost; water at the Dead Spring; a route at the acid field), and each later reads differently after the betrayal: you were clearing the slavers' work route, or proving you were worth selling. Two return loops are enough (PathA §Revisiting the hub).
2. **The slavers vanish between the arrival scene and the betrayal.** *Proposal:* make the decorated commander from the arrival scene the act's recurring face. Show him as patrols in outer zones, a bounty notice, an encounter at the acid field. Then the boss can be him, or the person he answers to. That keeps him a candidate, not a decision (Scene §Scene questions).
3. **The hub's safety isn't explained, and fixing it can power the betrayal** (§3). *Proposal:* safety is the leader's personal protection, not law. The Slums keep their residents untouched by never sheltering outsiders, except the ones he chooses. The betrayal is then his deal working as intended ("the only way I can help our people"). Sketch only; the "selling fugitives" version is already marked as an assistant proposal.
4. **No hub after the betrayal.** If the route back is sealed, the upper-city half has no town. *Proposal:* a temporary refuge inside the city (a fellow captive from 01, a servant), or the Slums reachable again by waypoint only at the end, changed: the leader gone, residents avoiding your eyes. A strong environmental-storytelling payoff.
5. **The world premise barely shows in Act I.** Flesh versus metal, everyday magic and machines-as-beings are absent from the act notes apart from "improvised prosthetics" (FirstRegion §Regional map economy). *Proposal:* put them in people, not landmarks. The leader's graft or prosthetic, slaver armour with mechanical limbs, one old machine that isn't hostile.
6. **No beauty beat in the act** (README 11-05 wants Expedition-33 wonder somewhere). *Proposal:* one earned glimpse. A surviving clear hot-spring pool on the acid dome, or the first view of the green plateau from the upper city's exit at the end of the act. It turns the rumour into something seen.
7. **Horror and the dread curve are undesigned.** *Proposal:* a single environmental thread, "the basin is drying". It explains the dead spring, the dissolving travertine, the abandoned upper district and the dead waystation; dread rises as the water fails, and the city's power is the water.
8. **The act sits too close to PoE2 in places.** The captive escape (already flagged, ActI §Current opening pitch); a farm-machine boss copied from "Treacherous Ground" (FirstRegion says it "parallels" it); a hub under a ruler's seat with a noble boss. *Proposal:* keep the betrayal and the caravan's social texture as the signature; drop the farm-machine copy; don't make the boss a decadent noble transformed in his manor.
9. **Classes.** "Each class is a person with their own history and culture" (README) but they share capture, a rumour and an act. *Proposal:* the rumour is common hope; why each was captured and where each came from vary per class, so the caravan's captives are visibly mixed.

**Tone check.** Grounded brutality is well served (slavery as an institution, poverty, betrayal). Horror is thin. Beauty is promised but not yet placed in Act I. "Fallout-like" is an aesthetic only (ActI §Hub-first): no literal radiation, which keeps it consistent.

---

## 7. Open questions for George, ranked by what they unblock

1. **What lies beyond the upper city, and what physically lets the city control the way out?** For example: the only climb onto the highland plateau along the falls stream. Unblocks: the act's exit, why the city controls passage (C6), finale zones 15–19, the map's onward road, and possibly food. Also check map item 9 first: is the land beyond the SW pass lowland or highland?
2. **What does the city live on, and why are captives brought here?** (Food source; export trade such as salt, sulfur or salvage; captive labour.) Unblocks the caravan gate, food, the salt-flat and acid-field zones' present-day people, and the slaver faction's shape.
3. **What keeps a wanted fugitive safe in the Slums under the 11-06 rule?** And does "residents are at risk outside the city" (10-26) still hold? Unblocks the hub brief, the arrival scene's commander, the betrayal logic, and patrols in outer zones.
4. **What does the leader ask for before he offers passage (the middle-act quests), and in what cluster order?** Unblocks briefs for zones 03–14, the dread curve and hub returns.
5. **What is the abandoned route, why is that upper-city district abandoned, and how is the way back sealed?** Unblocks the betrayal zone(s) and rescoping zones 15–16 (C13).
6. **Who is the Act I boss?** (The arrival commander, his superior, or someone else.) Unblocks finale briefs and antagonist pressure.
7. **Acid field: did the hot springs exist before the machine (as the map shows), and what turned them acid?** Unblocks the acid pits brief and its causes of decay; confirms or rejects the map's before era.
8. **Dead Spring: what is it for in the act, and why did it die while the falls still run?** Add it to the scaffold. Unblocks its brief and the water story.
9. **Ruined Outpost: is it a caravan waystation (the map's guess), and is "old battlefield salvage" retired?** Unblocks zones 03–04 and the Slums' economy.
10. **Act I enemy families** (bandits, slavers, old machines, fauna): unblocks every combat brief.
11. **Does the corruption still spread today?** (C14.) Shapes the world premise and whether the machine still runs.
12. **Clean-up permissions:** mark Paths B and C retired; mark the stale passages in C1–C3, C5, C7–C8, C10; point the studio skills at the vault instead of `Docs/Act1*.md`.
13. **Zone 01 details:** who attacks the caravan and why; the tutorial boss; whether fellow captives come along.
