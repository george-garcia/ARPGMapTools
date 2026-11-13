# Act I Gaea tile, pass 2: escarpment benches, a flat halite pan and a loud acid dome

Status: plan plus a hand-edited project, **not yet opened in Gaea** (I can't run Gaea here). Nothing in the repo or
the map was changed. Deliverables in this folder:

| File | What it is |
| --- | --- |
| `4_gaea_plan.md` | This plan |
| `act1.terrain` | The edited project: the original 9 nodes kept, 28 nodes added, 3 records rewired, the two exports moved to the new last nodes |
| `check_heights.py` | Checks a build's heights (and optionally its colour) against the exported tile. Needs numpy and Pillow; EXR also needs `pip install OpenEXR` |
| `_work/` | Scratch: `make_terrain.py` (generates `act1.terrain` from the repo copy), `validate.py` (checks the project's structure), `mock.py` (a numpy imitation of the graph, **not Gaea**, used to size the effects), preview hillshades `mock_escarpment.png` and `mock_dome.png` (left: today, right: the imitation) and analysis images |

## 1. What the tile looks like today (measured from `world/build/gaea/now-act1/`)

Scale: 1024 px over 128 km = 125 m/px. Heights 0 to 1 = 0 to 4,273 m. The project renders them at 8,546 m (2x).
Azgaar's integer heights come through as (h − 18)² m, so 20 = 4 m, 21 = 9 m, 22 = 16 m, 24 = 36 m.

| Finding | Numbers | Consequence |
| --- | --- | --- |
| Pan floor is flat at 9.0 m (Azgaar 21), brine pools also at 9.0 m | 6,053 floor px | Good: this is the level to hold |
| …but it has holes down to 4 m (Azgaar 20) | 2,700 px, mostly along the rim side of the pan (local x 0.79–0.84) | Not dead flat; dry ground 5 m below the brine pools next to it |
| Gypsum dunes sit at 4–9 m | 1,088 px at local (0.82, 0.48) | Dunes lower than the pan; real gypsum dunes stand above it |
| **Two of the seven acid pools reach 4 m**, below the pan | local (0.78, 0.61) and (0.81, 0.63), on the dome's east edge where it meets the pan | Breaks "the salt pan and brine pools are the lowest ground". This is in Azgaar's heights, so it's a map fix (section 8), not a Gaea one |
| Dead Spring pool is at 9.0 m, the same level as the pan, 50 km away | local (0.41, 0.64) | A tie, not a break; question 2 |
| The acid dome is only 25–55 m above the pan | acid ground median 34 m, 34 × 22 km | At 2x and 125 m/px it reads as flat ground |
| Escarpment: median slope 10° (20° rendered), 90th percentile 30° (49°); half-width median 1.4 km, up to 8 km | `mask-biome-rift-escarpment` | Room for 3–5 benches over 1,000–1,500 m of relief |
| In the old graph only half the lake pixels are fully protected | the 2-px feather of `mask-gaea-protect` covers pool shorelines | Erosion is allowed to reach pool edges |
| Acid ground and mineral washes are colour twins | dE*ab 8 in `colormap.png` (orange #c8661e vs #b85d23) | The acid field's ground doesn't read as unique |
| The desert outside the basin is a strongly saturated yellow (#fbe79f) | chroma 38 | Competes with the sulfur yellow in overview shots |

`python check_heights.py world/build/gaea/now-act1 --colour world/build/gaea/now-act1/colormap.png` reproduces all of this.

## 2. Rules the graph follows

1. **Azgaar decides where everything is.** Gaea adds only detail smaller than an Azgaar cell (about 2.3 km): benches,
   strata, terraces and colour. Every effect is placed by a mask the exporter writes. Nothing is placed by hand in Gaea.
2. **Protected ground is restored exactly at the end.** Lakes come back as drawn (all of them, not only the fully
   protected half). The salt pan comes back as drawn, and its holes are filled up to the pan level. So the pan is the
   floor, and nothing else on land is lower.
3. **Every effect goes through a `Combine` with a `Mask`.** That is the pattern the saved graph already uses
   (node 104). It avoids the per-node mask ports, which Gaea 2 only shows once a connection is made.
4. **Values are given in real metres first**, then normalised: 1.0 = 4,273 m real = 8,546 m rendered.

## 3. The changes

### 3.1 Escarpment: stepped fault benches and strata

**What and why.** The western Afar margin, the model for this escarpment, comes down from the plateau in a staircase
of normal-fault blocks. Each block is a bench, a few hundred metres high and one to a few km wide. Its faces show
the stacked flood-basalt flows of the Trap series as ledges. Two scales, two nodes:

- **Fault benches**: big steps of about 300 m (600 m rendered). These are visible at the tile's scale.
- **Strata**: ledges about 80 m apart (160 m rendered). Real flows are 10–50 m thick; at 125 m/px, 80 m is the
  smallest spacing that still reads, so they stand for packages of flows.

Both run **before** erosion, so Erosion 2 cuts gullies through the risers and the steps look weathered rather than
machined.

**Driver.** `mask-biome-rift-escarpment.png` (every Azgaar cell at 44 or more inside the rim polygon). It is binary,
so it is feathered by `Blur` to about 1.5 km first. Without the feather, the blend would leave cliffs along the
Voronoi cell edges.

**Chain.** `Azgaar Heights (101)` → `Fault Benches (110, FractalTerraces)` → `Basalt Strata (111, Stratify)` →
`Escarpment Steps (114, Combine: In = 101 drawn, Input2 = 111, Mask = Escarpment Feather 113 = Blur(File 112))` →
`Erosion (102)`.

| Node | Parameter | Value | Means |
| --- | --- | --- | --- |
| 110 Fault Benches | Spacing / Octaves / Intensity / Shape / Seed | 0.07 / 2 / 0.6 / 0.35 / 2611 | 300 m real steps plus one sub-bench octave; steep risers, flat-ish treads |
| 111 Basalt Strata | Spacing / Octaves / Intensity / Shape / Seed | 0.019 / 3 / 0.35 / 0.5 / 7340 | 80 m ledges at partial strength, so the benches stay dominant |
| 113 Escarpment Feather | Radius | 0.012 | 1.5 km soft edge, *if* Radius is a fraction of the tile (see 5) |

**Could go wrong.** The terraces are by height, so where the escarpment mask runs along a slope rather than across
it, benches show up as contour bands. That is right for horizontal strata and slightly wrong for real fault
benches, which follow the fault traces. The tilted-block look (FractalTerraces' Apply Tilt) is left off because the
escarpment turns from facing east to facing south (question 5). If Spacing turns out not to be normalised height,
the steps will be the wrong size: tune by eye until about 4 benches sit between the plateau lip and the basin floor.

**Check.** By eye: from a low sun in the west-north-west (about 300°, 20° up), the escarpment should show 3–5 lit treads and shadowed
risers, broken by gullies, with fine ledges on the risers. The plateau and rim hills behind it should be unchanged. Look for straight seams at the mask edge.
By numbers: the escarpment's height histogram should get peaks about 300 m apart (a short snippet is in section 7).

### 3.2 Acid dome: a real dome, small stepped terraces, pools in craters

**What and why.** Dallol is a salt dome a few tens of metres above the salt plain (roughly 40–60 m). Its hot acid
springs build terraces and rimmed pools a few cm to a few m high, coloured white (salt), yellow (sulfur),
green (acid brine with ferrous iron) and orange-brown (oxidised iron on the older terraces). At 125 m/px real
terraces can't exist. What the tile *can* show is a dome you can see, pools sunk in craters, and contour terraces
at about 8 m (16 m rendered), exaggerated for the look as the map direction allows.

**Driver.** `mask-biome-acid-pits.png` ∪ `mask-biome-sulfur-crust.png` (`Dome Mask 117`, Combine Max). It is turned
into two masks:

- **Dome Profile (132)**: a wide Blur (about 3.8 km). This makes the lift rise toward the dome's middle instead of
  being a flat-topped mesa.
- **Dome Feather (118)**: about 1 km, where the terraces blend in.

Both have the pan subtracted (`Pan Feather 134` = Blur of the salt-flats mask; `Dome Off Pan 135`,
`Dome Steps Mask 136`, Combine Subtract). So the dome never lifts or terraces the pan, and it ramps up from the pan
edge over about 0.8 km.

**Chain.** `Erosion (102)` → `Dome Lift (119, Combine Add, Input2 = 135, Ratio 0.0117 = +50 m real at the dome's
middle)` → `Dome Terraces (120, FractalTerraces)` → `Dome Steps (121, Combine: In = 119, Input2 = 120, Mask = 136)` →
`Heights (104, the existing protect combine)`. The pools are restored as drawn afterwards (3.4), so they stay at
their drawn 16 m while the ground around them rises to 60–100 m. That makes them crater pits, as `world/README.md`
describes them, with walls as wide as the protect feather.

| Node | Parameter | Value | Means |
| --- | --- | --- | --- |
| 119 Dome Lift | Mode / Ratio | Add / 0.0117 | +50 m real (+100 m rendered) at the middle, fading to 0 at the dome edge and the pan |
| 120 Dome Terraces | Spacing / Octaves / Intensity / Shape / Seed | 0.0019 / 2 / 0.8 / 0.25 / 1907 | 8 m real steps with flat treads |
| 118 / 132 / 134 | Radius | 0.008 / 0.03 / 0.006 | 1.0 / 3.8 / 0.8 km, *if* Radius is a fraction of the tile |

The numpy imitation (`_work/mock_dome.png`, right half) shows the target: the pools read as rimmed pits and the
dome as stepped contours. In the imitation the acid ground's median goes from 34 m to 66 m.

**Could go wrong.** If Combine's Ratio isn't applied in Add mode, the full mask is added (+4,273 m) and the dome
becomes a mountain. You can't miss it; set the lift in the UI instead. If the 2 px pool feather is too narrow, the
crater walls are 1–2 px cliffs: widen with a Blur on the protect mask, or ask the exporter for a wider feather.
Terraces this fine (0.0019) may be below FractalTerraces' slider minimum. If the UI clamps the value, terrace the
dome as a whole instead: Spacing = (dome relief / 8 m) of whatever range the slider allows.

**Check.** By eye: from the south at a low sun, the dome reads as a raised, stepped mound, the seven pools as sunk
bowls, and the pan beside it stays perfectly flat. By numbers: `check_heights.py` should show acid ground, sulfur
crust and acid pools above the pan (today two pools fail, a map issue, section 8), and acid ground's median about
30 m higher than in the exported tile.

### 3.3 Salt pan: dead flat, the lowest ground, with a halite crust

**What and why.** A playa floor is flat to well under a metre across tens of km. The Danakil pan is a white-grey
halite crust broken into 1–3 m polygons, with dirty patches where floods and dust settle. The polygons are far
below a pixel, so the crust is colour only. **No height is added to the pan.**

**Heights.** After the existing protect combine (104), `Pan As Drawn (137)` puts the drawn heights back on every
salt-flats pixel (hard mask). That undoes any erosion, deposit or dome bleed that the 2 px feather let through.
`Pan Floor (123)` then takes the Max of the terrain and `Pan Level (122, Constant 0.0021054987)`. That constant is
exactly the pan's commonest value (8.997 m), so the floor is unchanged and only the holes and the low dunes are
lifted to it. Nothing on land is left below the pan.

**Colour.** `Halite Crust (127)` = Combine Screen of the colour with `mask-biome-salt-flats.png` at 0.5. Where the
mask is white this pushes the pink salt colour (#ebcbcb) halfway to white; where it is black, Screen leaves the colour
unchanged. 15% of the SatMap's rock texture survives from node 109 as faint mottling.

**Could go wrong.** The salt-flats biome also climbs the rim in places (up to 1,400 m). Those pixels are restored as
drawn too, which is right because the old graph protected them as well, and they are whitened. If you see white
streaks on the rim, that is Azgaar's paint, not Gaea. If `Mode` isn't read (see 5), Pan Floor falls back to Blend
and the whole tile becomes a flat plain at 9 m. Unmissable; set the mode in the UI.

**Check.** By numbers: "pan floor did not move", "pan floor dead flat" (range ≤ 1 m), "nothing lower than the pan".
By eye: with the sun at 10–15°, the pan shows no shading at all apart from the brine pools.

### 3.4 Protected ground is restored last

`Final Heights (125)` = Combine with `Mask = mask-water.png`, `Input2 = Azgaar Heights`. Every lake pixel, the
shorelines included, ends exactly as drawn. **The Heights export moved here** (same file name, `Heights`, EXR).
`Satellite Colour (105)` now reads this node, so the colour follows the final shapes.

### 3.5 Colour: the acid pits are the loudest thing on the tile

The colour chain was `SatMap → 35% biome tint → 85% map colour on the masked zones`. It now continues:

`Colour (109)` → `Halite Crust (127)` → two versions of the whole picture:

- `Acid Vivid (128, HSL: Saturation +0.35, Lightness +0.06)`
- `Basin Quiet (133, HSL: Saturation −0.2)`

These are joined in `Acid Pop (131)` = Combine Blend with `Mask = Acid Zone Mask (130)`, which is the Max of Dome
Feather (118) and `mask-lakes-acid.png`. Inside the acid field you get the vivid version, everywhere else the quiet
one. **The Colour export moved to 131.**

This raises the field's chroma and lowers everything else's. That works on the saturated desert yellow outside the
basin and on the mineral washes, the acid ground's orange twin. The pools stay acid lime green (#a8cf2a, unique: its
nearest other zone is 30 dE away) and get brighter. The sulfur crust stays lemon yellow.

**Could go wrong.** HSL's scale is unconfirmed. If 1.0 is neutral in the UI rather than 0, use 1.35 / 1.06 and 0.8.
A 20% desaturation may make the Kenshi-dry basin look grey; 10% may be enough. The wash/acid-ground twin is
better fixed in the art palette (question 4).

**Check.** By numbers:
`python check_heights.py world/build/gaea/now-act1 --colour <build>/Colour.png` (or `.exr` with imageio). Wanted:
the acid field ranks first by chroma, is at least 1.25× its 3 km surroundings, the pools beat every other zone, and
each part of the field is 15 or more dE from every other zone. On today's 2D colormap the field already ranks first
(chroma 68 vs washes 57; 3.2× its ring), but the acid ground fails the twin test (dE 8). Run it on the Gaea output:
the SatMap and tint mix dilute colour, so that output is the one that matters. By eye: in the overview from the
south, the eye should land on the dome first, before the volcano and the escarpment.

## 4. The graph (ids as in `act1.terrain`)

```
HEIGHTS
101 Azgaar Heights (File r32) ─┬─> 110 Fault Benches (FractalTerraces) ─> 111 Basalt Strata (Stratify) ─┐
                               │   112 Escarpment Mask (File) ─> 113 Escarpment Feather (Blur) ──────Mask─┤
                               ├──────────────────────────────────────────────────────────────── In ─> 114 Escarpment Steps
114 ─> 102 Erosion (Erosion2) ─> 119 Dome Lift (Add) ─> 120 Dome Terraces (FractalTerraces) ─> 121 Dome Steps
       115 Acid Ground Mask + 116 Sulfur Mask ─> 117 Dome Mask (Max) ─┬─> 132 Dome Profile (Blur) ─> 135 Dome Off Pan (Subtract) ─> 119.Input2
                                                                      └─> 118 Dome Feather (Blur) ─> 136 Dome Steps Mask (Subtract) ─> 121.Mask
       126 Salt Mask (File) ─> 134 Pan Feather (Blur) ─> 135.Input2, 136.Input2
121 ─> 104 Heights (protect: Input2 101, Mask 103) ─> 137 Pan As Drawn (Input2 101, Mask 126)
    ─> 123 Pan Floor (Max with 122 Pan Level) ─> 125 Final Heights (Input2 101, Mask 124 Water Mask)   [EXPORT Heights]
COLOUR
125 ─> 105 Satellite Colour (SatMap 399) ─> 107 Biome Tint (35% of 106) ─> 109 Colour (85% of 106 under 108)
    ─> 127 Halite Crust (Screen 126, 0.5) ─┬─> 133 Basin Quiet (HSL) ── In ──┐
                                           └─> 128 Acid Vivid (HSL) ── Input2┴─> 131 Acid Pop (Mask 130)  [EXPORT Colour]
       118 Dome Feather + 129 Acid Lakes Mask (File) ─> 130 Acid Zone Mask (Max)
```

Edits to the original nodes: `102.In` now comes from 114 (was 101), `104.In` from 121 (was 102), `105.In` from 125
(was 104). The SaveDefinitions moved from 104 to 125 (`Heights`) and from 109 to 131 (`Colour`). Positions were
re-laid left to right. Everything else is byte-for-byte the same settings: Erosion seed and version, SatMap 399,
the 35% and 85% ratios, the Terrain Definition (128,000 × 8,546 m), build settings, state and metadata (plus a
one-line Description). `$id`s are renumbered in document order, as Gaea writes them.

The structure was validated by `_work/validate.py`:

- 337 unique `$id`s, every `$ref` resolves
- every port's Parent is its own node
- every Record's `To`/`ToPort` matches the port that holds it, and its `From`/`FromPort` is an existing output
- every Required input is connected and the graph has no cycles
- `$id`/`$type` come first in every object, the file uses CRLF line endings, and there is no BOM, as in the original

## 5. What I'm sure of and what George must confirm by saving once in the UI

| Item | Confidence | Source |
| --- | --- | --- |
| File (`FileName`, `IsRGB`), Erosion2 (ports, `Version: 2`), SatMap (`LibraryItem`), Combine ports (`In`, `Out`, `Input2`, `Mask`), `PortCount`, `Ratio`, `RenderIntentOverride`, SaveDefinition shape, `$id`/`$ref` and Record shape | **Sure** | George's own 2.3.1-saved file |
| The node types `FractalTerraces`, `Stratify`, `Blur`, `HSL`, `Constant` exist in Gaea 2 | **Sure** | QuadSpinner's Gaea2-Docs repository (one property file per node type) |
| Property names `Spacing`, `Octaves`, `Intensity`, `Shape`, `Seed` (FractalTerraces, Stratify), `Radius` (Blur), `Hue`/`Saturation`/`Lightness` (HSL), `Height` (Constant), `Mode` (Combine), and the enum values `Max`, `Add`, `Subtract`, `Screen` | **Likely** | Gaea2-Docs lists these as UI names. JSON names are UI names without spaces (`LibraryItem`, `IsRGB` in the saved file), but `File` → `FileName` shows exceptions exist. `"Mode": "Max"` is also used in a third-party Gaea 2.3 MCP that loads hand-written files |
| Extra ports: FractalTerraces `Modulation` (in) and `Layers` (out), Stratify `Layers` (out), Constant `In`/`Out` | **Likely** | A third-party scan of Gaea 2.0's example files. Gaea 2.3 notes mention fixed secondary outputs for FractalTerrace and Stratify |
| **Units**: Spacing is normalised height (0–1); Blur Radius is a fraction of tile width; HSL is neutral at 0; Constant Height is normalised | **Assumed** | The docs' expression example ties FractalTerraces spacing to a Mountain's 0–1 Height. Radius and HSL are guesses |
| Whether the new node types need a `Version` field (Erosion2 does; a missing one triggers "is old, migrating") | **Unknown** | None of the new nodes carries one |
| Combine applies Ratio in Add mode, and a white mask means "use Input2" | **Likely** | The protect combine 104 relies on the second; `check_heights.py` proves both on the first build |

How a wrong guess fails:

- **Unknown property name**: silently ignored, so the node uses its default.
- **Wrong port name**: the connection is dropped.
- **Wrong value shape for a known property** (for example a Float2 or Color struct): the file refuses to load. So I
  set **no Float2, Color or list properties at all** (no Height or Slope selectors, Range, Constant colours or CLUTer
  gradients).

**Save once (10 minutes):**

1. Copy `act1.terrain` to `tools/gaea/act1-v2.terrain` and keep the old file.
2. Open it in Gaea 2.3.1 and read the log window for "migrating", "failed" or "bad or no data". Fix only the first
   error; the rest are usually downstream of it.
3. Click each of the 28 new nodes and compare its properties and modes with the tables in section 3. Pay most
   attention to Combine modes, Blur radii and HSL.
4. Watch the Blur previews: Escarpment Feather should give a soft edge about 1.5 km wide (12 px). Set each radius by
   eye.
5. Save. Then diff the saved file against this one (`git diff --no-index`). That diff gives the real JSON names,
   units and any `Version` fields. Keep the Gaea-saved copy as the record.
6. Build, then run `check_heights.py` (section 7).

**Fallback** if the file won't load: build the graph in section 4 by hand from the node palette (about 15 minutes),
with the values in section 3, and save. The diff against this file then shows which names differed.

## 6. What could go wrong (in one place)

| Risk | Sign | Fix |
| --- | --- | --- |
| A Combine's `Mode` not read, so it falls back to Blend | The tile turns into a flat plain at 9 m, the colour goes half-black, or the pan lifts | Set the modes in the UI from the tables |
| Blur Radius in other units | Hard seams (radius too small) or effects smeared across the tile (too big) | Set the radius by eye in the Blur preview |
| Spacing not normalised | Benches or terraces far too big or too small | Tune until there are about 4 benches on the escarpment and about 8 m steps on the dome |
| Add ignores Ratio | The dome becomes a 4 km mountain | Set the lift in the UI |
| Benches look machined | Regular straight treads | Lower Intensity to 0.4, raise Shape, or add FractalTerraces warp |
| Erosion smears the benches | No steps visible after erosion | Move 110/111 after Erosion (rewire 114 into 119's input) or raise Intensity |
| Crater walls only 1–2 px wide | Pools look like punched holes | Blur the protect mask a little more, or ask for a wider exporter feather |
| Gaea exports heights normalised to the terrain's own min/max | The checker says "height scale … rerun with --heights-metres N" | Rerun with that value; the checker also detects a north-south flip |
| Half-float EXR | Small height errors | The checker widens its tolerance to the half-float step automatically |
| A future map build changes the pan level (not Azgaar 21) | The pan floor check fails after a rebuild | Change Pan Level (122) to the new level (`check_heights.py` prints it) |
| Gaea Community limits | Build above 1,024 refused | The project builds at 1,024 already |

## 7. How to check the result

**By numbers.** From the repo root, after building the project:

```
python check_heights.py world/build/gaea/now-act1 --heights "<build folder>/Heights.exr" --colour "<build folder>/Colour.png"
python check_heights.py world/build/gaea/now-act1 --heights ../old-build/now-act1/heightfield.r32   # between two map builds
```

It reports PASS, WARN or FAIL for each item below, with locations in pixels, frame-local 0–1 coordinates and km.
The exit code is 0, 1 or 2 for clean, warnings and failures.

- Lakes (brine, acid, other) as drawn: interiors exact, shorelines warned if they move by more than 2 m.
- Pan floor did not move (filling holes up to the level is allowed).
- Pan floor dead flat.
- Pan margin.
- Lowest point.
- Nothing lower than the pan.
- Acid pools, acid ground, sulfur crust, the Dead Spring and every other pool at least 1 m above the pan.
- With `--colour`: chroma rank, contrast against the field's surroundings, and the colour-twin test.

It was tested on:

- **the exported tile itself**: it fails on the two low acid pools, warns on the pan holes, the dunes and the Dead
  Spring tie;
- **the numpy imitation of the new graph**: all protected checks pass and the pan is flat to 0.5 m; it still fails
  on the two acid pools, because they are Azgaar's;
- the imitation as half-float and float EXR;
- three deliberately broken builds (eroded lakes, flipped north-south, scaled by 0.5): each was caught.

Bench spacing, in Python:
`h = np.fromfile(...) ; esc = mask > 127 ; np.histogram(h[esc] * 4273, bins=range(0, 3000, 25))`. Peaks should come
about every 300 m on the benched build, and not on the exported tile.

**By eye**, in Gaea's 3D viewport (Realistic, shadows and AO on, as the project's state already sets):

1. An overview from the south, matching `world/reference/act1-overview.jpg` and
   `world/build/screenshots/now-act1-3d-overview.png`. Nothing has moved, and the eye lands on the acid dome first.
2. A low sun from the west-north-west across the escarpment: stepped treads and ledges, no seam at the mask edge.
3. Close to the dome from the south: rimmed pits, contour terraces, a white flat pan beside them with no shading.
4. Toggle the four "As Drawn"/"Floor" combines off and on to see that each one does exactly one job.

## 8. Map issues found (for Azgaar ops; not done here because the map decides)

1. **Two acid pools below the pan.** Local (0.78, 0.61) and (0.81, 0.63) reach 4 m (Azgaar 20); the other five are
   at 16 m (Azgaar 22). They merge with the pan's edge. Raise these two pits' floors to 22, or move them 1–2 cells
   inward, in `world/base/10-act1-terrain.json`. Until then `check_heights.py` fails "nothing lower than the pan".
2. **Gypsum dunes at 4–9 m.** Dunes are positive relief, typically 5–20 m above their floor. Raising them a step in
   Azgaar (22–23) would be the honest fix. The Gaea Pan Floor already keeps them from being below the pan.
3. **Pan holes at 4 m along the rim side.** They come either from cells at 20 or from the 3D erosion bake that
   `export_gaea` samples (I did not trace which). The Gaea graph fills them. An exporter-side clamp (no land below
   the pan level) would make the tile itself clean.
4. **Exporter improvements that remove the guesswork** (repo change, optional):
   - feathered `mask-gaea-escarpment`, `mask-gaea-dome` (acid ground plus sulfur) and `mask-gaea-pan-floor` (salt
     flats at Azgaar 21), so the graph needs no Blur radius guesses;
   - a 4–6 px feather on pools for crater walls.

## 9. Questions for George

1. **The two low acid pools**: may I raise their pits to Azgaar 22 (16 m) in the terrain ops, so the pan and brine
   pools are strictly the lowest ground?
2. **The Dead Spring pool sits exactly at the pan level** (9 m), in its own depression 50 km away. Is a tie
   acceptable, or should the rule be strict (raise it a step)?
3. **Dome height**: the graph lifts the acid dome by up to 50 m, so it stands 60–100 m above the pan. That is a bit
   above real Dallol, for the look. Keep it, go bigger for gameplay readability, or go back to real proportions?
4. **Acid ground vs mineral washes are the same orange** (dE 8). Change the washes to a darker rust-brown in the art
   palette, or move the acid ground toward ochre-yellow? Gaea can only paper over it.
5. **Tilted fault blocks**: do you want the benches back-tilted toward the highlands, the classic rift-margin
   look? It needs two directions, because the escarpment turns from facing east to facing south.
6. After your first save in Gaea, can the **Gaea-written file replace `tools/gaea/act1.terrain`** (and `docs/gaea.md`'s
   node table be updated to match)? From then on, hand edits start from Gaea's own JSON.
7. Should `export_gaea` gain the **feathered masks in 8.4**? That makes the graph exact rather than tuned by eye.
8. Will the Acid Pits zone get its own **close-up Gaea tile** (1–4 m/px)? That is the only scale where Dallol's real
   terraces and rimmed pools can exist; this 125 m/px tile can only suggest them.
