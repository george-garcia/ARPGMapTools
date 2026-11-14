# E. George's decisions that bind the cartographer (PROJECT)

Compiled 13 Nov 2026 from the story vault (`ARPGStoryBible/README.md`, sections "Map decisions" 2026-11-03,
"World look and climate" 2026-11-05, "Act I present-day map" 2026-11-05, "Map direction" 2026-11-06), the ARPGMapTools
`CLAUDE.md`, and George's instructions in the map-building sessions (Nov 2026). The vault is the authority: if a line here
and the vault disagree, the vault wins and this file is fixed. The skill cites these by ID (P1…) rather than restating
them, and re-reads the vault's README map sections at the start of every task.

## Authority and scope

| ID | Decision | Source |
|---|---|---|
| P1 | Azgaar is the master cartographic source for the continent and every act region. The map never decides canon: story facts come from the vault, and the map implements them. | Vault "Map decisions" 2026-11-03; CLAUDE.md |
| P2 | The map, its 3D views and Gaea output are dev visualization only. They never ship and never go into the game or the ARPG repo (the zone-graph handoff text is design data, not the map). | George, 6 Nov 2026 ("none of it ever touches the ARPG repo"); 13 Nov 2026 (roster + handoff doc only) |
| P3 | Never hand-edit `.map` files; every change is a recorded op under `world/`, replayable for both eras. `run_js` never appears in ops: anything a build needs becomes a named tool first. | CLAUDE.md |
| P4 | The Azgaar version is pinned (`tools/azgaar/azgaar.lock.json`) and must match George's desktop app. | CLAUDE.md |
| P5 | Distance figures written before Azgaar (old Notion pages, illustrations) are untrusted and never ported; Azgaar's scale decides. Lore scale is separate from gameplay scale: ARPG zones are abstract tile slices with no km size. | Vault "Map direction" 2026-11-06; "Map decisions" 2026-11-03 |
| P6 | Illustrations and generated images (the Rift Basin overview, its dotted lines) are visual inspiration, never geometry or canon. | Vault 2026-11-03, 2026-11-05 |

## How to work

| ID | Decision | Source |
|---|---|---|
| P7 | Standing autonomy: where a fix makes sense geographically, fits the hazardous-wasteland theme and looks good, implement it without waiting for approval. Anything that settles a story question (canon) goes to George first. | Vault "Map direction" 2026-11-06 |
| P8 | Priorities: geographically correct and realistic, but gameplay and aesthetics come first. Bending geography for play is allowed; say so and why. | Vault 2026-11-06 |
| P9 | Every map build renders 3D views (the continent in Azgaar's 3D, Act I in the terrain viewer) and George wants before/after views, including 3D, of each change. | Vault 2026-11-06; George, 6 Nov 2026 |
| P10 | Drawing order: terrain, water, biomes, settlements, routes, then markers, labels and notes. Check visual work with `screenshot` against the reference before calling a pass done. | CLAUDE.md |
| P11 | One milestone per PR; George squash-merges. Commits carry the session trailers. | George's practice, Nov 2026 |
| P12 | Placeholder names stay tagged `[placeholder]` until George approves them. | Vault 2026-11-03 |

## The world

| ID | Decision | Source |
|---|---|---|
| P13 | The world is drier overall, Kenshi-like; the major theme is hazardous wasteland. Places the machine's corruption hasn't reached are absolutely beautiful and otherworldly (Expedition 33). Where they are is open. | Vault 2026-11-05 |
| P14 | Before (pre-catastrophe) and now maps share one terrain base and differ in water, biomes, settlements, routes and notes. The before map should be lush and beautiful, to contrast with the deterioration. | Vault 2026-11-03, 2026-11-06 |
| P15 | Continent ≈ 800 km east–west (built 960 x 540 km at 0.5 km/px), ocean all round; Act I is inland, south-central, a region about Kenshi's Swamp in size (~100 km rim to rim). | Vault 2026-11-02, 2026-11-03 |
| P16 | Routes show only real traffic (caravans, people), must make geological sense, and never join zone to zone; zones are ARPG tilesets. How the quest moves the player is undecided. | Vault 2026-11-05 |

## Act I (the Rift Basin)

| ID | Decision | Source |
|---|---|---|
| P17 | An inland endorheic rift basin modelled on Danakil / Dallol, with realistic outer boundaries that blend into the continent (not a rectangle). The outer edge and POIs are not set in stone. | Vault 2026-11-02, 2026-11-06 |
| P18 | Layout (workable, open to iteration): escarpment on the west/north-west rim; city and Slums on a terrace at its foot; mineral washes and the ruined outpost mid-basin; basalt to the north; fossil terraces and gypsum stepping east; salt flats on the eastern floor; localized acid pits at its southern edge; dead spring to the south. The north-east volcano is active. | Vault 2026-11-03 |
| P19 | The salt pan and brine pools are the lowest ground; the acid field sits on a low dome at the pan's southern edge. | Vault 2026-11-06 (approved fix) |
| P20 | The acid pits are a main theme of the deteriorating world and must really stand out, even beyond what real Dallol would justify. | Vault 2026-11-06 |
| P21 | The settlement is a medium-sized city: the Slums are its poor quarter at the foot of the falls, the upper city on a shelf directly above, a short switchback apart. Not a capital. | Vault 2026-11-03, corrected 2026-11-06 |
| P22 | The escarpment road is the main road into the city; whether the city controls onward passage is open. | Vault 2026-11-03 |
| P23 | Locked zone roles: 01 caravan escape (tutorial, combat), 02 the Slums (safe hub, no combat); 4–6 upper-city combat maps for the finale; about 15–20 playable maps in all. Likely start: caravan approach → Slums → ruined outpost → Slums → dead spring → acid pits. | Vault 2026-11-02, 2026-11-05; George, 6 Nov 2026 |
| P24 | Open for the before map: the old salt lake's extent; whether the acid field predates the machine; what stood at the city site; where the old caravan road led. | Vault 2026-11-05 |

## Handoff

| ID | Decision | Source |
|---|---|---|
| P25 | Story-driven map changes may arrive as geography change requests from the narrative skill (`arpg-narrative`, the ChatGPT/Codex skill in ARPG's `.agents/skills`, and the planned Claude Writer role). The cartographer checks each against the geology, then implements it as ops or says why not. | ARPGMapTools CLAUDE.md, 13 Nov 2026 |
| P28 | **Adopted (George, 13 Nov 2026, "I like your proposal, lets implement it"):** the upper city sits at the head of the only graded climb from the basin onto the highland plateau, along the falls stream; its power is the last reliable water (a thin, shrinking stream) and the only climb out, not fertile land. Arid farming only (George, 13 Nov 2026: "this area in particular would be arid … arid crops could still grow"): sorghum, millet, barley, teff and chickpeas on stone terraces at the stream head on the plateau, watered by check dams, flood farming and channels off the stream; date palms along the falls at the Slums; cactus and saltbush as fodder. Never enough: food is topped up by caravan, paid for in salt (and sulfur) cut by captives on the pan and at the acid field and carried up the escarpment road. The now map stays a dying desert (no added rain); green belongs to the before map and to other regions. "The basin is drying" is the act's thread. This answers why the city controls passage, what it lives on, why captives are brought here, and the act's exit (up through the city onto the plateau). Still open: who buys the salt beyond the plateau, and the boss. | George, 13 Nov 2026, adopting the full review's proposal (docs/reviews/2026-11-13-full-review.md §4) |
| P29 | **The north rim is raised** between the plateau and the volcano so the city's ramp is the only practical climb onto the plateau (the review's option b). | George, 13 Nov 2026 |
| P30 | **Nothing keeps a wanted fugitive safe in the Slums except laying low and evading the slavers;** the protagonist is not branded or marked. No protection rule, no leader's guarantee. | George, 13 Nov 2026 |
| P27 | Gaea Community is used non-commercially: the map and its Gaea terrain are dev visualization that never ships. | George, 13 Nov 2026 ("my call is that we aren't using it for commercial use") |
| P26 | The skill lives in ARPGMapTools; the studio's roster (ARPG `Docs/Studio/ROSTER.md`) gets an entry, and its one file in the ARPG repo is the act's zone-graph handoff doc. Built by the studio method (research, build brief, build, blind baseline test, George approves the rules, roster). | George, 13 Nov 2026 |
