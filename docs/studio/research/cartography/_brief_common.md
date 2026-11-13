# Research brief, common to every track: the `arpg-cartography` skill

**What the skill is for.** George is a solo developer making a PoE2-style isometric ARPG in Unity, with a "studio" of Claude
skills (level design, environment art, lighting, technical art, game design, producer). The world map is built in
Azgaar's Fantasy Map Generator, driven by an MCP server in this repo (ARPGMapTools). The new skill, `arpg-cartography`,
makes Claude work as the studio's **cartographer**:
- it draws and changes the world map (Azgaar) through the repo's MCP tools, as replayable ops, for a "before" and a
  "now" era;
- it keeps the world geographically plausible (geology, water, climate, biomes, settlements, routes), while George's
  rule is that **gameplay and aesthetics come first, realism second**;
- it takes "geography change requests" from the narrative skill (story needs a place changed) and implements or
  pushes back with reasons;
- it hands the studio what the map decides: the act's zone graph (which zone connects to which, in what compass
  direction: level design's rule T6 says a zone's exits face the next zone's direction on the act's world map, as in
  PoE2), and per-zone geography facts (what the ground is, what water there is, what happened here before and now) that
  environment art needs.

The map is a dev tool: it never ships, and the Azgaar map, 3D views and Gaea output never go into the game.

**The world today.** Act I is an inland, closed (endorheic) rift basin modelled on the Danakil Depression / Dallol
(Ethiopia): escarpment on the west/north-west with a city on a shelf above its Slums at the foot of a waterfall, mineral
washes, a ruined outpost, basalt fields under an active volcano to the north-east, fossil reef terraces and gypsum
stepping east to salt flats and brine pools, localized acid pools on a hydrothermal dome, a dead spring. Hazardous
wasteland overall (drier, Kenshi-like); untouched places are "absolutely beautiful and otherworldly" (Expedition 33).
The continent is ~960 x 540 km; Azgaar cells are ~2 km across (100k cells); Act I is ~100 km rim to rim. ARPG zones are
abstract tile slices (~250–350 m main routes, 3–5.5 minute runs), not a literal scale of the map.

**Rules for every track.**
- Every finding is an instruction-shaped rule or fact with: an **origin tag**, a **numbered source** and, where it
  applies, **how to check it on an Azgaar map** (a screenshot, a height query, a list of rivers…).
- Origin tags: **DEV** (a game developer said it, with the talk/post), **OBSERVED** (seen in a shipped game or on a real
  map/satellite image), **SCIENCE** (peer-reviewed paper, textbook, or a government/institutional scientific source:
  USGS, NPS, NASA, ESA, BGS…), **COMMUNITY** (cartography/worldbuilding community consensus: Cartographers' Guild,
  Worldbuilding Stack Exchange, well-known blogs), **SOURCE** (read in Azgaar's code or this repo's code), **INFERRED**
  (our reasoning; say so). Never attribute a claim to a studio or scientist unless the source says it.
- Prefer primary sources: developer talks and posts, original papers, institutional pages, the actual code. Say when you
  only had an abstract, a snippet or a summary. Don't pad with generic web listicles.
- Quote briefly (under 15 words per quote) and paraphrase the rest. Record the URL and the date you read it.
- End the file with **Recommendations for the skill** (the rules you'd put in it, ranked) and **Open questions for
  George** (things only he can decide).
- Write in plain, direct English. No marketing tone. Short paragraphs or tables.
- Write only your own file in `docs/studio/research/cartography/`. Don't edit anything else in the repo.
