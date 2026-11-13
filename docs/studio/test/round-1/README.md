# Round 1: blind test of `arpg-cartography` against a baseline (13 Nov 2026)

- **Tasks:** `TASKS.md` (review the Act I map; answer the escarpment-road change request; draft the Act I handoff).
- **Runs:** `skill/` (a fresh Claude with the skill) and `baseline/` (a fresh Claude with the same inputs, told not to
  read the skill or its research). Neither changed the map.
- **Judge:** a fresh Claude given only the tasks, the rubric (`rubric.md`), the vault, the map and both runs as **X**
  (baseline) and **Y** (skill), not told which was which. It checked 13–14 factual claims per run against the map.
- **Result** (`verdict.md`): skill **9.5/10**, baseline **7.5/10**; the skill run won all three tasks (review 9.5 vs 7,
  change request 9.5 vs 9, handoff 9.5 vs 7.5) and stated fewer wrong facts (1 minor vs 3).
- **Fixed in the skill after the round, from the evidence:** colour-separation, area-share, landmark-form, river-gradient
  and era-geology checks in `review.md`; environment-art fields in the handoff (palette, real-world hook analogue, light)
  and H25 (rules in words for the studio); clean bearing rounding in `zone_graph.mjs`.
- **Provenance:** `../../research/cartography/provenance-check.md` (20 rules: 12 pass, 8 fixed).
