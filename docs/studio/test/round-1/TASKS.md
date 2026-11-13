# Test tasks: the studio's cartographer

You are acting as the cartographer for George's ARPG studio. George is making a PoE2-style isometric ARPG; its world map
is built in Azgaar's Fantasy Map Generator through an MCP server in the ARPGMapTools repo (`/home/claude/arpgmaptools`).
The map is a dev tool (it never ships). Story and world decisions live in George's story vault, a copy of which is at
`/tmp/claude-0/-home-claude/7caafd89-0678-50ce-9389-72eb5e6ae44d/scratchpad/test/vault/` (start with `AGENTS.md` and
`README.md`, especially its "Map decisions" and "Map direction" sections, and the Act I notes).

The map's current state:
- the ops that build it: `world/base/*.json`, `world/eras/common`, `world/eras/now`, `world/eras/before` (read
  `world/README.md` and the repo `README.md` / `CLAUDE.md` first);
- the last build's views: `world/build/screenshots/` (now-*, before-*: heightmap, biomes, act1 framed views, 3D), the
  terrain-viewer exports in `world/build/3d/`, the Gaea tile in `world/build/gaea/now-act1/`;
- the saved maps `world/build/now.map` and `world/build/before.map`. You may load them read-only through the MCP server
  (`tools/azgaar-mcp/dist/index.js`, an MCP stdio server; `scripts/smoke.mjs` shows how a client calls it) to query cells,
  list features and take screenshots. Never write to `world/` or any repo file.

The studio that consumes the map's decisions: level design and environment art skills, copied read-only to
`/mnt/user-data/uploads/ARPG/` (`.claude/skills/arpg-level-design/SKILL.md` and `references/layout-topology.md`,
`.claude/skills/arpg-environment-art/SKILL.md` and `references/lookdev.md`, `Docs/Studio/PIPELINE.md`). The narrative
skill's change-request format: `/mnt/user-data/uploads/ARPG/.agents/skills/arpg-narrative/templates/geo-change-request.md`.

Do these three tasks. Write each to its own markdown file in your output folder (given in your instructions), and nothing
anywhere else.

1. **`1_review.md` — Review the present-day Act I map** (and the before map where it matters) for geographic
   plausibility, readability and what the studio needs, against the vault's decisions. Produce ranked findings, each with
   the problem, the evidence on the map, and a concrete fix (as map changes you would make with the repo's tools), and say
   which fixes you'd make yourself and which need George.
2. **`2_change_request.md` — Answer this geography change request** from the narrative skill:
   > **Story function:** the act's exit. The main road continues past the upper city, up the escarpment, onto the
   > plateau above — the only way out of the basin toward the highlands, so the player must pass through the slaver city
   > to leave. **Feature:** frame act1, the main road from the upper city (op `now.route.*`) to the escarpment top.
   > **Era:** now (and before, if a road existed). **Proposed operations:** extend the main road with `add_route`.
   Accept, accept with changes, or push back, with your reasoning and the exact map changes.
3. **`3_handoff.md` — Draft the Act I handoff for the studio:** what the map decides that level design and environment
   art need for Act I's zones (the zones in the vault: caravan approach, Slums hub, ruined outpost, mineral washes, dead
   spring, acid pits, salt flats, fossil terraces, basalt fields, maybe the volcano, and the upper city finale), in
   whatever form you judge most useful to them.

Work carefully and concretely; George will read these. Finish with a short summary of what you produced.
