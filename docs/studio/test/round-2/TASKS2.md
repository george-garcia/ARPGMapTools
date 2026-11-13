# Test task 4: the Act I Gaea tile

You are acting as the cartographer for George's ARPG studio (see the context below). George views the world map's Act I
region in 3D in **Gaea 2.3.1.0 Community** on his Windows desktop. The repo `/home/claude/arpgmaptools` exports a Gaea
tile for Act I on every build, and a saved Gaea project reads it.

Read first: the repo `README.md`, `CLAUDE.md`, `world/README.md`, `docs/gaea.md` (the handoff and the saved project's
graph), `tools/gaea/act1.terrain` (the saved project: Newtonsoft JSON; nodes File, Erosion2, SatMap, Combine; it was
built by editing this JSON and reopening it in Gaea), and the exported tile in `world/build/gaea/now-act1/`
(`gaea.json`, `heightfield.r32`: float32 little-endian 1024², 0–1 = 0–heightMetres, top row north; `colormap.png`; the
`mask-*.png` files). The story vault (authority on story decisions) is at
`/tmp/claude-0/-home-claude/7caafd89-0678-50ce-9389-72eb5e6ae44d/scratchpad/test/vault/` (README "Map decisions",
"Map direction"; the Act I notes and the geological blueprint). George's rules include: Azgaar is the master map and
decides where things are; the map and its 3D never ship; geography should be realistic but gameplay and looks come
first; **the acid pits are the act's main theme and must REALLY stand out**; the salt pan and brine pools are the lowest
ground.

**Task:** improve the Act I Gaea tile so the land reads as real terrain: the escarpment gets stepped fault benches and
strata, the salt pan stays dead flat and lowest with a halite crust, and the acid dome gets small stepped terraces and
colours that make the pits the loudest thing on the tile. Deliver, in your output folder:

1. **`4_gaea_plan.md`** — the plan: what each change is, which exported mask or selector drives it, the node chain and
   starting parameter values (at this tile's ~125 m/px and 2× height exaggeration), what could go wrong, and how you'd
   check the result (by eye and by numbers).
2. **`act1.terrain`** — the edited project file (a copy; never edit the repo's). It must stay a valid Gaea 2 project:
   keep the structure, ids, ports and records consistent with the original; use only node types and property names you
   can justify (say in the plan which ones you are sure of and which George must confirm by saving once in the UI).
3. **`check_heights.py`** (optional but valued) — a script George can run on a build's exported heights to verify that
   protected ground (pan, lakes) didn't move and the pan is still lowest.
4. Questions for George, at the end of the plan.

Don't write anywhere but your output folder, don't change the map, don't commit, don't ask questions (George is away).
Finish with a short summary.
