# Roster entry for ARPG `Docs/Studio/ROSTER.md` (to commit there once George approves)

The skill lives in ARPGMapTools (P26), so the entry lists only the one ARPG path it writes. Add it under the role
entries, add a summary row with `Tools/studio/roster_check.py --write-table`, and run the validator. The handoff
doc's path is George's call (proposed below).

### arpg-cartography

```yaml
id: arpg-cartography
label: "[arpg-cartography]"
kind: role
status: built-tested            # ARPGMapTools docs/studio/test/round-1/README.md "skill 9.5/10, baseline 7.5/10"; round-2 (Gaea) verdict in docs/studio/test/round-2/
registered: "2026-11-13; built from ARPGMapTools docs/studio/build-arpg-cartography.md"
role: Cartographer (the world map in Azgaar, its geography, its Gaea terrain, the act handoff, zone field guides)
skill: "ARPGMapTools .claude/skills/arpg-cartography (not in this repo)"
invoke:
  skill: "/arpg-cartography <task>"           # SKILL.md description: 'Trigger on "/arpg-cartography" …'
loops: [content]
scope: act
takes:
  - {what: story and world decisions, from: [George, arpg-narrative], path: "ARPGStoryBible README (Map decisions, Map direction) and act notes"}   # SKILL.md §2
  - {what: geography change requests, from: [arpg-narrative], path: ".agents/skills/arpg-narrative/templates/geo-change-request.md format"}       # SKILL.md §3 C
  - {what: the consumers' input rules, from: [arpg-level-design, arpg-environment-art], path: ".claude/skills/arpg-level-design (T4–T8, N1–N9), .claude/skills/arpg-environment-art (Z1–Z7, M1)"}
hands_out:
  - {what: "the act handoff: zone graph with computed exit bearings, per-zone geography (ground, water, landmarks, before → now)", to: [arpg-producer, arpg-level-design, arpg-environment-art], path: "Docs/Act 1 scenes/_act1_map.md (proposed; George's call)"}   # SKILL.md §3 E; world-to-zones.md H21–H25
  - {what: "zone field guides: per-zone walking-scale ground, rock, plants and where they grow, land use, weather and light, asset seeds and side-area ideas, researched from the real place", to: [arpg-environment-art, arpg-level-design, arpg-producer], path: "ARPGStoryBible <Act>/Field Guide/ (status: research; linked from the act handoff)"}   # SKILL.md §3 F; field-guide.md FG1–FG9
  - {what: answers to geography change requests, to: [arpg-narrative, George], path: "ARPGMapTools (answer doc in the PR)"}
writes:
  - "Docs/Act * scenes/_act*_map.md"
writes_shared:
  - "Docs/Studio/ROSTER.md#own-entry"
reviewed_by: []
judge: {agent: judge, rubric: "ARPGMapTools .claude/skills/arpg-cartography/references/review.md §3", pass_score: 8, exit_rules: "PIPELINE §6"}
gate: [{id: pr-merge, decides: George}]
resources: {unity_lock: false, blender: false, docker: false, image_generation: false}
asks_george_before:   # SKILL.md §6
  - settling a story question through geography
  - moving a locked anchor (P18, P19, P21, P23)
  - approving or renaming a placeholder
  - era-specific terrain (breaks the shared base)
  - changing the world's climate model
  - adding a zone-graph link the vault doesn't support
  - building a new MCP tool
```
