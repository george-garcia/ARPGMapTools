# ARPGMapTools

Tooling that builds George's ARPG world map in Azgaar's Fantasy Map Generator through the `azgaar` MCP server.
Story and world authority: the ARPGStoryBible vault (https://github.com/george-garcia/ARPGStoryBible; George's clone is
`C:\Users\jorge\ARPGStoryBible`). Read its `AGENTS.md` and `README.md` first; the map decisions are the README's "Map
decisions" and "Map direction" sections and the Act I notes. Notion is an archive since 13 Nov 2026: don't cite or link it.
Tooling plan and milestones: https://claude.ai/artifact/NrpjN6j3QnuGywgZpwmD4c.

- Azgaar is the master map. Never hand-edit `.map` files; change the map through the MCP tools.
- The Azgaar version is pinned in `tools/azgaar/azgaar.lock.json` and must match George's desktop app, or `.map` files may not open in both.
- `run_js` is a dev escape hatch. Anything a build depends on becomes a named tool before it is used.
- Later milestones record every map change as an op under `world/` so the before and after maps can be rebuilt (see `world/README.md`).
- Drawing order: terrain, then water, biomes, settlements, routes, then markers, labels and notes.
- Check visual work with `screenshot` against the reference (`world/reference/act1-overview.jpg` for Act I) before calling a pass done.
- Story-driven map changes may arrive as geography change requests from the vault's narrative skill (`arpg-narrative`).
  Check each against the geology, then implement it as ops or say why not; the map never decides canon.
