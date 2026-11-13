# Round 2: blind test of the Gaea domain (13 Nov 2026)

- **Task:** `TASKS2.md`. Give the Act I Gaea tile escarpment benches and strata, a flat, lowest salt pan with crust, and
  stepped acid-dome terraces with colours that make the pits the loudest thing on the tile. Deliver a plan, an edited
  copy of `act1.terrain` and a heights check.
- **Runs:** `skill/` (with `arpg-cartography`, including `references/gaea.md`) and `baseline/` (same inputs, no skill or
  research). Neither opened Gaea.
- **Judge:** blind (X = skill, Y = baseline). It validated both projects' structure with its own script, checked the
  names against QuadSpinner's Gaea2-Docs and real saves, and ran both checkers on the real export and on synthetic builds.
- **Result** (`verdict.md`): skill **9.0/10**, baseline **6.5/10**.
  - Both projects are structurally valid and use no invented names.
  - The skill run kept the map's ground and only flagged the map's faults. The baseline patched them in Gaea: it lifted
    2,370 px of non-pan land, raised the acid dome by 50 m, and ran benches through the city shelf.
  - The skill run's checker compares each build with the export. The baseline's fails on today's map even for an
    identical build.
  - The skill run gave the acid field its own colour branch, so the pits are clearly the loudest thing on the tile.
- **Fixed in the skill afterwards, from the evidence:**
  - Structural benches now go before erosion.
  - New property names are written safest-first, unconfirmed Float2, Color and list values are left unset, and the
    project is confirmed with a Save-As diff.
  - A colour-uniqueness check was added.
  - Candidate property names are listed as candidates.
  - The skill run's checker is now the skill's `scripts/gaea_check_heights.py`, with a pixel tolerance so 16-bit
    quantisation doesn't cause a false fail.
- **Not yet done:** neither project has been opened in Gaea. The first real Gaea pass will confirm the names (GA6).
