# Verdict: Gaea task (Act I tile), runs X and Y

**Scores: X 9.0 / 10, Y 6.5 / 10. X is the better run.**

| Criterion | X | Y |
|---|---|---|
| Geography and fidelity to the map (0–3) | 3 | 1.5 |
| Will it work in Gaea (0–3) | 2.5 | 2.5 |
| Usefulness to George (0–3) | 2.5 | 2 |
| Craft (0–1) | 1 | 0.5 |
| **Total** | **9.0** | **6.5** |

My scripts and test builds are in `/tmp/claude-0/-home-claude/7caafd89-0678-50ce-9389-72eb5e6ae44d/scratchpad/judge2work/`
(`structcheck.py`, `dump.py`, `verify.py`, `index.py`, `mkbuilds.py`, `builds/`, copies of both checkers in `runX/` and `runY/`).
I edited nothing else.

---

## 1. Structural check (my own script)

| Check | Original | X | Y |
|---|---|---|---|
| Valid JSON, CRLF, no BOM | yes | yes | yes |
| `$id`s unique / every `$ref` resolves | 102 / yes | 446 / yes | 337 / yes |
| Nodes (node key = `Id`, every port's Parent = own node) | 9 | 49 (9 + 40), all OK | 37 (9 + 28), all OK |
| Every Record's To/ToPort matches its port; From/FromPort exists and is an output | 10 edges, OK | 64 edges, OK | 48 edges, OK |
| Required inputs connected | yes | yes | yes |
| Cycles | none | none | none |
| Dead-end nodes (no consumer, not exported) | none | none | none |
| Width / Height / Ratio | 128000 / 8546 / 0.06676562 | unchanged | unchanged |
| Exports | 104 `Heights`, 109 `Colour` (EXR) | 104 `Heights` kept; `Colour` moved to 157. `SaveDefinition.Node` matches | `Heights` moved to 125, `Colour` to 131. `SaveDefinition.Node` matches |
| BuildDefinition, State, Automation | — | unchanged | unchanged |

**What changed on the original nine nodes. All changes are deliberate and documented in the plans.**

- **X:**
  - Erosion (102) gets `Duration 8`, `Downcutting 0.12`, `ErosionScale 4000` and `ShapeDetailScale 0.15`. Its `Precipitation` input is wired from a new Invert of the protect mask. Seed and Version are kept.
  - Heights (104) now takes `In` from the acid-terrace Mask node and `Mask` from a prepared mask (protect, shrunk × flat).
  - The `Colour` SaveDefinition moved off 109.
  - Four nodes were renamed: 102, 103, 104 and 109.
  - Settings of 101, 105, 106, 107 and 108 are unchanged.
- **Y:**
  - Erosion `In` is now 114 (the escarpment steps).
  - Heights (104) `In` is now 121 (the dome steps).
  - Satellite Colour `In` is now 125 (the final heights).
  - Both SaveDefinitions moved to new end nodes.
  - Names and settings are otherwise unchanged.
- **Both:** positions were re-laid, the viewport was moved and a Metadata description was added. Y's description points to `out2-b/4_gaea_plan.md`, which is a stray path.

Both files are structurally valid Gaea 2 project JSON. Neither has a structural fault.

## 2. Name check

**Sources used:**
- QuadSpinner's Gaea2-Docs: `source/.flubs/*.json` (property lists) and `reference/nodes/*`.
- Real Gaea saves in trentpolack/GaeaSandbox (Gaea 2.0.6 to 2.2.9).
- danemadsen/nerthus example files, stamped 2.2.9 to 2.3.1. Their origin is unclear.
- Theorist100/gaea2-mcp's schema extracted from Gaea.Nodes.dll 2.3.0.1 (types, ranges, enums, ports).

**Grades:** CONFIRMED means seen in a real save, or in the docs plus the DLL schema. PLAUSIBLE means seen only in the schema or in examples of unclear origin. UNSUPPORTED means no evidence.

### X (17 sampled)

| Name | Grade | Evidence |
|---|---|---|
| `Terraces` node, `NumTerraces` (max 256), `Uniformity`, `Steepness`, `Intensity` | CONFIRMED | GaeaSandbox valley_01 (2.2.1.0); DLL range 3–256, so X's "256 is the maximum" is correct |
| `Mask` node, ports `In` / `In2` / `Mask` | CONFIRMED | GaeaSandbox saves; docs (utility/mask) |
| Erosion2 `Duration`, `Downcutting`, `ErosionScale`, `ShapeDetailScale` | CONFIRMED | GaeaSandbox; DLL defaults 10 / 0.25 / 1000 / 0.25 match X's "was" values |
| Thermal2 `Angle`, `Strength`, `FeatureScale` (≤ 300), `Duration`; ports `AreaMask`, `SedimentRemoval` | CONFIRMED | GaeaSandbox |
| Slope `Range {X,Y}` in degrees, `Falloff` | CONFIRMED | GaeaSandbox (`{"Y": 5.99}`, `{"X": 15, "Y": 60}`) |
| Height `Range {X,Y}` 0–1, `Falloff` | CONFIRMED | GaeaSandbox |
| Shape `X`, `Y`, `Scale` | CONFIRMED | GaeaSandbox 2.2.1.0 |
| Dilate `Size`, `Invert` | CONFIRMED | GaeaSandbox 2.1.2.0 |
| HSL `Saturation`, `Lightness` | CONFIRMED | GaeaSandbox; DLL range −1..1, neutral 0 |
| Stratify `Spacing`, `Octaves`, `Shape`, `TiltAmount`, `Direction`; port `Layers` | CONFIRMED | Docs flubs plus nerthus |
| Combine `Mode` "Multiply" / "Subtract" / "Max" | CONFIRMED | GaeaSandbox saves |
| Cracks `Style` (key) | CONFIRMED | GaeaSandbox (`"Classic"`) |
| Cracks value `"Normal"` | PLAUSIBLE | DLL enum CrackStyle |
| CLUTer `GradientData` as `{$values:[{X,Y,Z,W}]}` | PLAUSIBLE | nerthus 2.3.1.0-stamped examples; DLL type `List<Float4>` |
| Constant `Output: "Color"`, `Color {R,G,B}` | PLAUSIBLE | nerthus examples; DLL `ConstantType` {Height, Color} |
| Distance `Mode: "Pyramid"`, `Directions 24` | PLAUSIBLE | DLL enum `DistanceRTStyle`. X did not set `Method: "RT"`, so the Mode may be inert |
| `Invert` as a standalone **node** (`QuadSpinner.Gaea.Nodes.Invert`) | PLAUSIBLE | Listed as an Adjust node in the DLL schema. Every real save has only `Nodes.Modifiers.Invert`, and the docs have no Invert node page |

- **UNSUPPORTED:** none.
- **Honesty:** X's three-tier table matches what I found, including flagging the schema and the unclear-origin examples as the source for the riskier formats.

### Y (11 sampled)

| Name | Grade | Evidence |
|---|---|---|
| `FractalTerraces` `Spacing`, `Octaves`, `Intensity`, `Shape`, `Seed` | CONFIRMED | GaeaSandbox saves (2.0.6 to 2.2.0.3) |
| FractalTerraces ports `Modulation`, `Layers` | CONFIRMED | GaeaSandbox |
| Stratify `Spacing`, `Octaves`, `Intensity`, `Shape`, `Seed`; port `Layers` | CONFIRMED | Docs flubs plus nerthus |
| Blur `Radius` | CONFIRMED | Docs flubs; nerthus 2.3.0.1 |
| HSL `Saturation`, `Lightness` | CONFIRMED | GaeaSandbox. Neutral is 0, as Y assumed |
| Constant `Height` (0–1) | CONFIRMED | Docs; DLL; nerthus 2.2.9.0 |
| Constant ports `In` / `Out` | CONFIRMED | DLL ports |
| Combine `Mode` "Max" / "Add" / "Subtract" / "Screen" | CONFIRMED | GaeaSandbox saves (Add and Screen with a Ratio < 1 exist) |
| Combine `Ratio` used as Add strength | PLAUSIBLE | Real saves use Add with Ratio 0.29, but the semantics are undocumented |
| `RenderIntentOverride: "Color"` on HSL | PLAUSIBLE | The property is seen on other node types |

- **UNSUPPORTED:** none.
- **Honesty:** Y is honest and slightly under-confident. It rates real-save-confirmed names as "Likely" because it never consulted saves. Its deliberate choice to set no Float2, Color or list values is the safest loading strategy of the two.

## 3. The check scripts on the real export

Both run with numpy and Pillow on Python 3.13. I also ran each against synthetic builds made from the export: the export itself, escarpment benches plus dome terraces, the pan lowered 3 m, a north-south flip, lakes cut 5 m, a 100-px hole at 1 m, the export scaled ×0.5, the export normalised to its own min/max, pan holes filled to 9 m, and a 16-bit PNG copy.

| Test | X `check_heights.py` | Y `check_heights.py` |
|---|---|---|
| Baseline (export only) | Exit 0. Lists the map problems as WARN | **Exit 2 (FAIL)**: "lowest point" and "nothing lower than the pan" fail on the map as it is |
| Identical build | PASS, exit 0 | Same two FAILs (absolute checks, not compared with the baseline) |
| Benches plus terraces | PASS. Reports escarpment cut 210 m and dome ±8 m | Same baseline FAILs. No change report |
| Pan lowered 3 m | FAIL "protected ground unchanged" | FAIL "pan floor did not move" |
| Flipped N-S | Detected, undone, PASS | Detected (FAIL orientation), undone |
| Lakes cut 5 m | FAIL per lake | FAIL per pool class, but first misreports it as a "height scale 0.687×" problem |
| New hole at 1 m | FAIL "pan still lowest" and "nothing new below brine" | Only visible as a count change (2157 → 2257) inside an already-failing check |
| Scaled ×0.5 or normalised to min/max | FAIL with metre deltas (no diagnosis) | FAIL with a "rerun with `--heights-metres N`" hint |
| 16-bit PNG of the export | **False FAIL**: "nothing new below brine" 1444 → 1449 px from quantisation | Baseline FAILs plus a 7-px count drift |
| Colour (`colormap.png`) | WARN: acid chroma 1.1× the mineral washes (wants 1.5×) | PASS rank and ring contrast; WARN acid-ground and wash twin, dE 8. Includes a useful dE uniqueness test |

**Verdict:** both work. X's is the better gate, because it checks what Gaea changed against the export's baseline. Y's always exits 2 until the map is fixed, so new damage is hard to see.

## 4. Factual claims verified against `heightfield.r32` and the masks

### X

| Claim | My numbers | Verdict |
|---|---|---|
| Heights 4.0 m to 4,272.8 m | 4.000 to 4272.78 | True |
| Two acid pools at (792,602) and (822,650) at the brine level, floors to 4 m; the other five flat at 16 m | Pools at (792,603) and (823,651): mode 9.0, min 4.0. The other five have mode and min 16.0 | True (X's "7.8 m" for one is a core-level metric; the mode is 9.0) |
| Escarpment p5–p95 660–1,970 m; mean downslope bearing 114°; p95 stored slope 56° | 657–1,967 m; 113.3°; 55.9° | True |
| Escarpment 783 km², acid pits 280 km², protect mask 488 km² at > 50% | 782.6 / 279.8 / 487.6 | True |
| Dome p95 63 m, median slope 0.6° | 63.2 m, 0.58° | True |
| Pan has plateaus at 4, 9 and 16 m, so it is not dead flat | 300 / 2,310 / 765 salt px at those levels | True |
| 257 px of land outside the pan tie at 4.0 m | 202 px by my mask definition | Approximately true |
| City shelf median slope 7.5° | 8.4° over the shelf bounding box | Approximately true |

### Y

| Claim | My numbers | Verdict |
|---|---|---|
| Azgaar h maps to (h − 18)² m | Plateaus at 4, 9, 16, 36 and 121 m | True |
| Two pools reach 4 m at local (0.78,0.61) and (0.81,0.63) | (0.77,0.59) and (0.80,0.64), min 4.0 | True |
| Pan holes to 4 m, about 2,700 px, along local x 0.79–0.84 | 2,943 px below 9 m; x p5–p95 0.79–0.84 | True |
| Pan "floor flat at 9.0 m, 6,053 px" | 6,053 is salt ≤ 9.5 m, of which 2,943 are below 9 m and only 2,310 exactly at 9 m | Misleading label |
| Gypsum dunes 4–9 m at (0.82,0.48), 1,088 px | Low dune centroid (0.82,0.48); 1,659 dune px below 9 m; the dunes overall run 4–129 m | Location true; overstated as "the dunes" |
| Dead Spring pool at 9.0 m at (0.41,0.64) | Lake (418,658), min and mode 9.0 | True |
| Acid ground median 34 m, 34 × 22 km | 32.8 m; 34.4 × 22.4 km | True |
| Escarpment median slope 10°, p90 30° | 10.2°, 29.7° | True |
| Only half the lake pixels fully protected | 50.2% at protect ≥ 0.999 | True |
| Acid ground and washes dE 8; desert chroma 38 | dE76 8.1; C* 37.7 | True |

Both runs measured the export carefully. X's description of the pan (not flat, with shelves) is the more accurate one.

## 5. Judging the plans

### Mask-driven

- **X:** every height and colour effect goes through an exported mask (escarpment, acid-pits, sulfur, acid lakes, salt-flats, protect), refined by Slope and Height selectors taken from the export. The one exception is the city-shelf keep-out disc. It is hand-placed from the map's burg coordinates, and X says so, gives the source pixels and asks for an exporter settlement mask (Q7).
- **Y:** effects are mask-driven too, but the escarpment has no slope selector and no settlement keep-out. Its benches cover the whole biome, including the upper-city shelf and the falls that `40-settlements.json` places there. Y never mentions the city.

### Map problems flagged, not hidden

- **X:** keeps the pan and pools exactly as the map has them ("the graph only keeps what the map gives"). It lists five map problems with evidence and fixes for the map. This is the rubric's top cell.
- **Y:** also flags the problems well, with locations, causes and a proposed fix in `10-act1-terrain.json`. But it then fixes two of them in Gaea:
  1. **Pan Floor** is an unmasked `Combine Max` with a 9 m Constant. It fills the pan holes and lifts **2,370 px of land outside the pan and water** (dunes, gravel flats, acid ground, sulfur crust) to 9 m. That hides the map's lowest-ground problem in 3D.
  2. **Dome Lift** adds +50 m in Gaea, taking the acid field to 60–100 m above the pan. The world README specifies a low dome at Azgaar 24–26 (36–64 m). Restoring the pools on a hard binary water mask then cuts 1–2 px "crater" walls up to ~80 m real. Y asks George about the lift (Q3), but ships it as the default.

  Both are the "silently fixed or raised in Gaea" fidelity problem.

### Geology

- **X** is well argued:
  - four benches of ~356 m at 1–2 km spacing, sized to real tilted fault blocks;
  - strata dipping into the footwall, the half-graben geometry, using the measured 114° facing;
  - Thermal2 at the angle of repose (34° real = 53° stored), touching only the steepest 5%;
  - halite crust as colour only, because polygons are under a pixel;
  - Dallol's vent-outward colour sequence.
- **Y** is also sound: a Trap-basalt staircase, benches run before erosion so gullies cut the risers (arguably the better ordering), and the honest note that height-based terraces read as contour bands. The dome lift and crater pits go beyond the map.

### Will the acid pits be the loudest thing?

- **X:** yes, convincingly. A dedicated branch puts Dallol-sequence rings from a Distance field of the pool mask at 100%, keeps the map's own pool colours (+20% saturation) and sulfur, and mutes everything else by 25%. Its check targets ≥ 1.5× chroma.
- **Y:** probably. +35% saturation inside the acid zone and −20% outside raises contrast, and the lifted dome adds relief. But the colour is still the map's flat paint, and the acid-ground and wash twin is left to the art palette.

### Parameters at ~125 m/px and 2×

Both convert real to stored heights and slopes explicitly. X is more thorough: slope thresholds in stored degrees, the repose angle, step heights in real and as shown, Terraces at its true maximum. X's three Blur radii of 0.05 contradict its own "2–4 px" aim if Radius is a fraction of the tile (≈ 51 px ≈ 6 km). Y states its unit assumption for every radius.

### Questions

Both sets are sharp: X has 7, Y has 8. Y's close-up-tile and Gaea-written-file questions are good.

## 6. Gaps, ranked

### X

1. **Riskiest load guesses in the colour branch.** The CLUTer `GradientData` and Constant `Color` formats are known only from examples of unclear origin. `Invert` as a standalone node is seen only in the DLL schema; every real save has it as a modifier. X flags all three and gives a fallback (delete the three nodes, or File > Repair).
2. **Blur `Radius 0.05` is inconsistent with its stated 2–4 px aim.** If Radius is a fraction of the tile, it smears the escarpment mask and bleeds acid colour about 6 km past the dome.
3. **Distance `Mode: "Pyramid"` without `Method: "RT"`.** The ring style may be ignored.
4. **Checker robustness:**
   - A 16-bit PNG of an identical export gives a false FAIL ("1444 → 1449" from quantisation). There is no tolerance on that count.
   - A build normalised to its own min/max fails with 4 m "moves" and no diagnosis.
5. **The city keep-out disc is placed by hand**, not from a mask. It is flagged, and Q7 proposes the proper fix.
6. **Not flagged:** the acid dome (median 33 m) sits below the world README's Azgaar 24–26 spec. Y missed this too.
7. **Unverifiable tests.** The numpy stand-in tests are described but not delivered.

### Y

1. **Global `Pan Floor` (Combine Max, no mask).** It lifts 2,370 px of non-pan land and fills pan holes in Gaea. That hides map problems it had correctly flagged.
2. **`Dome Lift` +50 m in Gaea** raises a mapped landform beyond the map's own spec. The hard water-mask restore then creates 1–2 px crater cliffs.
3. **The escarpment effect is unconfined:** no slope selector, and no keep-out for the upper-city shelf or the falls, which are on the map.
4. **The checker's lowest-ground checks are absolute.** An identical or good build exits 2, so Gaea-made damage is buried in an existing FAIL. Two smaller problems:
   - its "pan floor at 9.00 m" counts 2,943 px that are below 9 m;
   - it misreports lowered lakes as a height-scale problem.
5. **The acid colour is only an HSL boost** of the existing flat map paint. It adds no structure, such as rings or a vent sequence.
6. **Craft:**
   - sources are not linked;
   - names that real saves confirm are rated "Likely";
   - the plan references a `_work/` folder (mock images, validate.py) that is not in the deliverable;
   - the metadata names `out2-b/`.
7. **Erosion is left at its defaults.** Rain still falls on the pan; Y relies on the two later restores to undo it.

## 7. Which is better, and why

**X is better.** Both projects are structurally valid and both runs measured the export accurately. The differences:

- **Fidelity:** X never moves or invents ground in Gaea. Every map problem goes back to the map, with evidence and a question. Y flags the same problems, then papers over them (Pan Floor) and raises the dome in Gaea.
- **Confinement:** X confines its effects with slope and height selectors, a rain mask and a settlement keep-out.
- **Acid branch:** X's actually structures the pits so they read as the loudest thing.
- **Checker:** X's compares with the baseline, so it is a usable gate today.
- **Sources:** X's names are traced to real saves with links.

Y's advantages are real but smaller:

- a safer property strategy (no Float2, Color or list values);
- a colour-uniqueness (dE) test and the `--heights-metres` hint;
- benches placed before erosion.

## 8. What Y should learn from X

1. **Leave map problems in the map.** Don't `Max`-fill holes or lift a landform in Gaea, even to fix a known error. Restore the map's heights, flag the issue with numbers, and ask.
2. **Check against the baseline, not absolutely.** "Newly below the pan" and "changed by Gaea" tell George whether the build broke something. An absolute FAIL that is always on teaches him to ignore the checker.
3. **Confine every effect with selectors drawn from the export:**
   - Slope for the scarp faces;
   - Height above the pool level for the dome;
   - an inverted protect mask on Erosion's Precipitation;
   - a keep-out for settlement sites.
4. **Source names from real saves and link them.** Use a confidence tier per name (confirmed by George's save, by other real saves, by the schema, or units unknown).
5. **Give the hero feature its own structured colour branch.** For example, rings from a Distance of the pool mask in Dallol's order, with the rest of the tile muted. A blanket saturation boost is not enough.

**What X could borrow from Y:**
- Y's no-Float2/Color/list policy, or a staged first save without the colour branch.
- Y's dE colour-uniqueness test and scale-mismatch hint in the checker.
- Y's ordering of benches before erosion.
