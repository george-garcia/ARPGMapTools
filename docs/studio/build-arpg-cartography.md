# Build brief: the `arpg-cartography` skill

**For:** a Claude session in the ARPGMapTools repo (cloud or George's desktop).
**Read first:** `CLAUDE.md`; `world/README.md`; this brief; then the research in `docs/studio/research/cartography/`.
**Decided by George (13 Nov 2026):** the skill lives in ARPGMapTools; the studio's roster (ARPG
`Docs/Studio/ROSTER.md`) gets an entry, and its one file in the ARPG repo is the act's zone-graph handoff doc; it is
built by the studio method (STUDIO_PLAN §6: research, this brief, the build, a blind test against a baseline, George
approves the rules, roster registration).

**Goal:** a skill that makes Claude work as the studio's **cartographer**: it draws and changes the world map, keeps it
geographically plausible while putting gameplay and looks first, answers the narrative skill's geography change requests,
and hands the studio what the map decides (the act's zone graph with compass bearings, and per-zone geography). It is
built from real geography, the cartography and worldbuilding craft, what GGG and Blizzard say about act maps and zones,
Azgaar's own code and George's decisions — not from generic map advice.

---

## 1. Inputs

| Input | Where | Notes |
|---|---|---|
| Research A: physical geography | `research/cartography/A_physical_geography.md` | Rifts, hydrology, arid landforms, climate and biomes, human geography, what reads at 2 km cells |
| Research B: worldbuilding cartography | `research/cartography/B_worldbuilding_cartography.md` | Fantasy-map mistakes, readability, open-world geography for play, realism vs play, before/after |
| Research C: world to zones | `research/cartography/C_world_to_zones.md` | PoE2 and D4 act and region maps, what level design and environment art need, the handoff format |
| Research D: Azgaar and our tools | `research/cartography/D_azgaar_and_tools.md` | How to make each change with the MCP tools, pitfalls, verification, gaps |
| Research F: Gaea 2 | `research/cartography/F_gaea.md` | Added 13 Nov 2026 at George's request: Gaea nodes, landform-to-node recipes driven by the map's masks, the project file, command-line builds, Community limits, checks |
| Research E: George's decisions | `research/cartography/E_project_decisions.md` | P1–P26, cited by ID; the vault wins where they differ |
| The story authority | `ARPGStoryBible` (README "Map decisions", "Map direction"; Act I notes; the geological blueprint) | Read-only. The skill never edits the vault |
| The consumers | ARPG `.claude/skills/arpg-level-design` (T6 and the brief inputs), `arpg-environment-art` (Z1–Z7), `Docs/Studio/PIPELINE.md` (pass 0 brief), ARPG `.agents/skills/arpg-narrative` (its geography change request template) | Read their input sections; never write in them |
| The map itself | `world/` ops, `world/build/` screenshots, 3D and Gaea exports | The current state to review and change |

## 2. The role

**Owns:** the world map and every op under `world/`; the eras (before and now); geographic plausibility of the continent
and act regions; the answers to geography change requests; the act's zone-graph handoff doc (the only file it writes in
the ARPG repo); the map's 3D and Gaea visual checks; the Gaea projects that turn the map's geology into 3D terrain (Azgaar places, Gaea
details); proposals for new named MCP tools when an intent can't be expressed.

**Never touches:** story canon (the vault, and the ARPG story docs, which are the narrative role's); zone layouts, tiles,
art, lighting or game data (the studio's specialists); the ARPG repo beyond its handoff doc and its roster entry.

**Asks George before:** settling a story question through geography (P7); renaming or approving a placeholder; any
change that moves a locked anchor (P18, P19, P21, P23); a change the build can't show before and after.

## 3. What the skill must produce, per kind of task

1. **A map pass** (a change to terrain, water, biomes, settlements, routes or labels): ops in `world/`, both eras built,
   2D screenshots and 3D views before and after, a short report (what changed, why, which rules, what was bent for play).
2. **A geography review** of a region: ranked findings, each with the rule it breaks, the evidence on the map, and the fix
   as ops; fixes that fall under P7 are made, the rest go to George.
3. **An answer to a geography change request:** accept (with the ops), accept with changes (the physical reason), or push
   back (the rule and an alternative that keeps the story beat).
4. **A Gaea pass:** the saved Gaea project(s) under `tools/gaea/` shaped landform by landform from the map's masks
   (escarpment strata, basalt, salt crust, dunes, acid terraces, the city shelf…), with before/after Gaea renders, and
   close-up zone tiles when asked. Nothing placed in Gaea that the map doesn't place.
5. **The act handoff doc** in ARPG: the act's zones, their adjacency and compass bearings (from the map, computed, not
   eyeballed), hub and waypoints if decided, and per zone: ground and rock, water, landmarks visible from it, climate,
   what it was before and what it is now (from the eras), what decided each fact (vault decision or map). Unsettled
   connections are marked as such, never invented.

## 4. Write the skill

`.claude/skills/arpg-cartography/`:
- `SKILL.md` (under 500 lines): the role, inputs, workflow per task kind, deliverables and definition of done, the rules
  everyone forgets, which reference to load for which step, which rule wins.
- `references/`: `geography.md` (from A), `cartography-craft.md` (from B), `world-to-zones.md` (from C), `azgaar-ops.md`
  (from D), `gaea.md` (from F), `review.md` (the self-check and the judge's rubric), `sources.md` (numbered).
- `templates/`: map-pass report, geography review, change-request answer, act handoff doc.
- `scripts/`: anything that computes rather than eyeballs (the zone bearings).

**Rule format:** an instruction, its origin tag (DEV, OBSERVED, SCIENCE, COMMUNITY, SOURCE, INFERRED, PROJECT), its
source number, and how to check it on the map. No rule is attributed to a studio or scientist unless a source says it.

## 5. Proposed judge rubric (finalise in `review.md`)

| Criterion | Points |
|---|---|
| Geography: the result obeys the physical rules that read at map scale (water downhill to a sink, lowest ground, rift form, settlements by water and routes by slope) | 0–3 |
| Fidelity: follows the vault and P1–P26; invents no canon; marks what's open; bends realism only for a stated play or look reason | 0–3 |
| Usefulness to the studio: findings and handoffs are concrete, ranked and actionable (ops, bearings, per-zone facts), in the consumers' terms | 0–3 |
| Craft and process: ops not hand edits, both eras, before/after evidence, sources cited | 0–1 |

## 6. Test it (blind, against a baseline)

The baseline is a fresh Claude given the same inputs **without** the skill.
1. **Task 1, review:** review the present-day Act I map against the vault and produce ranked fixes.
2. **Task 2, change request:** answer a geography change request: "the main road continues past the upper city up the
   escarpment onto the plateau, as the only way out of the basin" (story function: the act's exit).
3. **Task 3, handoff:** draft the Act I zone-graph handoff doc from the map and the vault.
4. **Task 4, Gaea (added with track F):** plan the changes to `tools/gaea/act1.terrain` that give the Act I tile its
   escarpment benches and strata, a flat salt pan with crust, and stepped acid-dome terraces that make the pits stand
   out, driven by the exported masks: the node chain, parameters, and the JSON edits (or UI steps) to make it.

Both runs write to `docs/studio/test/<run>/`, never to `world/`. A fresh judge, not told which is which, scores both on
the rubric. Where the baseline wins, fix the skill from the research (never by copying the baseline), then re-run. Then a
**provenance spot check**: 20 random rules traced to their sources; any that fail are fixed or re-tagged INFERRED.

## 7. Report to George, then stop

The skill's file tree with one line per file; the test scores and what changed between rounds; the rules that need his
approval (STUDIO_PLAN §6 step 5); the roster entry, ready to commit once he approves.
