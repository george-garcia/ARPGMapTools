# Act I Gaea tile, pass 2: benches, a dead-flat pan, and acid pits that shout

13 Nov 2026 · for George · project: `act1.terrain` beside this file (a copy; the repo's `tools/gaea/act1.terrain` is untouched) · checker: `check_heights.py` beside it.

## What this pass does, in one paragraph

The saved graph today is: Azgaar heights, one default erosion pass, the pan and lakes put back, a satellite colour,
and the 2D map's colours painted over the acid field at 85%. This pass keeps that spine and adds five things, each
driven by a mask the map exports, so the map still decides where everything is (Azgaar places, Gaea details; GA1):

1. **Rain kept off the pan and lakes**, and a shorter, broader erosion pass.
2. **The escarpment gets fault benches, tilted strata and talus aprons**, only where the escarpment biome is
   actually steep, and never across the upper-city shelf or the falls.
3. **The salt pan stays dead flat and lowest**: no rain, no relief added, its exported heights put back exactly;
   the halite crust is colour only (a white polygon pattern), because no crust relief can show at 125 m per pixel.
4. **The acid dome gets small stepped terraces**: three or four rimstone tiers about 17 m high (33 m as shown at 2×).
5. **The acid field gets its own colour branch** at full strength: the map's own pool colours, a white salt rim,
   sulfur yellow, orange, the map's burnt orange, then rust; everything outside the acid field is muted slightly, so
   the pits become the loudest thing on the tile without being over-saturated.

Nothing here changes the map, the masks or the export. Where the tile shows a map problem, it is listed in
"Map problems the tile shows" for a map pass, not hidden in Gaea (GA4).

## Pre-flight (done on the 6 Nov export, numbers from `check_heights.py`)

| Check | Result |
|---|---|
| Files match `gaea.json` | 25 masks listed, all present, none empty, no stale extras |
| Terrain Height = 2 × `heightMetres` | 8,546 m = 2 × 4,273 m ✓; Width 128,000 m ✓; Ratio unchanged (0.0667656) |
| Heightfield | 1024², 4.0 m to 4,272.8 m (4.0 m is the tile's floor) |
| Graph inputs | the new project reads 9 files, all from this export |
| `.terrain` committed | Please commit `tools/gaea/act1.terrain` before you copy this one over it (GA §2.4) |

## Map problems the tile shows (for a map pass, not for Gaea)

Measured on the export; none of these is fixed or hidden by the new graph.

1. **The pan is not dead flat in the export.** Its flat core (10,151 px, about 159 km²) runs 4.0 m to 25 m (median
   9.5 m), with flat plateaus at 4, 9 and 16 m (the pool levels) and slopes up to about 1.5–2° real. A real playa
   varies by well under a metre per kilometre. At 2× this shows as faint shelves, not a slope. Fix in the map: one
   `sculpt` smooth (or set) over the pan polygon at the brine level, then finalize. The Gaea graph only keeps what the
   map gives.
2. **Two acid pools sit at the brine level, not on the dome.** The pools at tile pixels (792, 602) and (822, 650) have
   their level at 9.0 m and 7.8 m and floors down to 4 m, with 7–12 m of spread inside them; the other five sit flat
   at 16 m on the dome. The approved fix says the pan and brine pools are the lowest ground and the acid field sits on
   a low dome (P19), so these two should come up to the dome's 16 m (or be called pan-edge pools on purpose).
3. **257 px of land outside the pan tie with the pan's lowest point** (4.0 m: gypsum dunes, sulfur crust and gravel
   cells next to the pan). Ties, not lower, so the pan is still the lowest land; worth lifting a metre when the pan
   is smoothed.
4. **The upper-city shelf isn't a shelf in the bake**: its core has a median real slope of 7.5° and spans 411–1,079 m.
   The graph keeps benches off it (below), but a flat shelf has to come from the map (the shelf op's `set 50` is being
   softened by noise and the erosion bake).
5. **Known:** the summit lava lake bakes as a ~2 km deep pit (F1.8); a lake at (417, 657) sits at 9 m with 23 m of
   spread inside it. Both are left as the map has them.

## The changes

All values are starting points at this tile's scale: 125 m per pixel, heights stored at 2× (so a real slope θ is
seen by Gaea as atan(2·tan θ): 2° → 4°, 5° → 10°, 10° → 19°, 34° → 53°; GA12). Tune at 1024, the build resolution.

### The graph

```
HEIGHTS
Azgaar Heights ─► Erosion (rain off pan) ─► Esc: Fault Benches ─► Esc: Strata ─► Esc: Talus ─► Esc: Apply under mask
     ▲ Precipitation ◄─ Rain Mask = Invert(Protect Mask)                                           (In2 = Erosion)
                                                                                                      │
Heights (export "Heights") ◄─ Acid: Apply on dome only (In2 = escarpment result) ◄─ Acid: Rimstone Terraces ◄┘
     Input2 = Azgaar Heights, Mask = Protect: shrunk × flat

MASKS
Escarpment = Blur(escarpment biome) × Slope(> 10° stored) − Blur(City Shelf Keep-out disc)
Acid dome  = acid-pits biome × Height(> 20 m)
Restore    = Dilate-shrink(gaea-protect, ~1.5 px) × Slope(< 4° stored)

COLOUR
Heights ─► SatMap 399 ─► Biome Tint 35% ─► Map Colours 85% ─► Mute (HSL) ─► Keep full colour in acid zone
   ─► Salt Crust (Cracks → CLUTer, 90% on flat salt) ─► Acid rings (Distance from pools → CLUTer, 100% on acid zone)
   ─► Sulfur Crust Colour (map yellow, 45%) ─► Colour (the map's pool colours +20% saturation, 100%) ═► export "Colour"
```

49 nodes (9 original, 40 new). The original nine keep their ids and ports; the "Colour" export moved from the old
85% Combine (renamed "Map Colours") to the new last node and keeps the file name `Colour`, and "Heights" keeps its
export. Every new node's name says what it does, so the graph reads without this plan.

### 1. Erosion: rain off the pan and lakes (all ground)

| | |
|---|---|
| Drives it | `mask-gaea-protect` (water, every lake, the salt flats), inverted, into Erosion2's **Precipitation** input |
| Chain | Protect Mask → **Invert** → Erosion.Precipitation |
| Erosion2 | Duration 8 (was default 10), Downcutting 0.12 (was 0.25), Erosion Scale 4,000 (was 1,000), Shape Detail Scale 0.15 (was 0.25), Seed kept 48978 |
| Why | One macro pass: broad, short and shallow, so gullies are hundreds of metres to kilometres wide (the size that reads at 125 m/px) and the drawn landforms aren't cut through. No rain starts on the pan or the pools (F2.5, F4.0). |
| To undo | delete those four properties from the node (Gaea omits defaults) |

### 2. Escarpment: fault benches, strata and talus

| | |
|---|---|
| Drives it | `mask-biome-rift-escarpment` (783 km²), softened, × **Slope** > 10° stored (≈ 5° real, falloff 8°), minus a soft disc over the upper-city shelf and the falls |
| Chain | **Terraces** "Fault Benches" → **Stratify** "Strata" → **Thermal2** "Talus" → **Mask** (In2 = the erosion output, Mask = the escarpment mask) |
| Terraces | Terraces 12 (≈ 356 m real steps), Uniformity 0.3, Steepness 0.45, Intensity 0.6 |
| Stratify | Spacing 0.03 (≈ 128 m real layers if Spacing is a share of the height range), Octaves 6, Intensity 0.35, Shape 0.3, Tilt Amount 0.35, Direction 294 |
| Thermal2 | Angle 53° stored (= 34° real, scree's angle of repose), Duration 0.08, Strength 0.3, Feature Scale 250 m |
| City keep-out | **Shape** (circle) at X 0.336, Y 0.423 of the tile, Scale 0.1, blurred; placed from the map's upper-city burg (tile pixel 344, 433) and the shelf op's polygon (tile pixels 308–384 × 407–458) |

Why these numbers. The escarpment rises from about 660 m to 1,970 m (5th–95th percentile) and faces east-south-east
(mean downslope bearing 114°). Twelve terrace levels over the tile's 4,273 m give steps of about 356 m, so about four
benches across the escarpment, 1–2 km apart on its 10–20° faces (8–16 px), which is the size real tilted fault blocks
have (1–5 km; F4.1) and the size that reads at this scale (≥ 4 px). Low Uniformity keeps them from reading as rice
paddies. A numpy stand-in of this chain (not Gaea) cuts at most about 230 m real off the lip of a bench, 90 m on
average; the checker warns if Gaea cuts more than 300 m. The strata dip away from the rift, into the footwall, which
is the half-graben geometry (west-north-west, compass 294°). Thermal2 at 53° stored only touches the steepest 5% (the
escarpment's 95th-percentile slope is 56° stored), which is where the bench risers are: it turns them into scree
aprons. The slope selector keeps benches off the gentle plateau above the lip and off the basin floor, and the
keep-out disc keeps a step from cutting through the city site or filling the falls notch (the shelf core is only half
excluded by slope, because the bake has it sloping at 7.5°).

### 3. Salt pan: dead flat, lowest, with a halite crust in colour

| | |
|---|---|
| Drives it | `mask-biome-salt-flats` × **Slope** < 4° stored (≈ 2° real) for colour; `mask-gaea-protect` for heights |
| Heights | no rain (change 1); no landform branch touches it; the "Heights" Combine puts the exported heights back under the prepared protect mask: **Dilate** (Size 0.0015, Invert = shrink ≈ 1.5 px) × **Slope** < 4° stored (falloff 2°) |
| Colour | **Cracks** (Style Normal, Octaves 3, Scale 0.02, Depth 0.35, Jitter 0.6, Warp Strength 0.3, Warp Size 0.3) → **CLUTer**: seam grey-tan #968C7C at 0, off-white #E2DED4 at 0.3, white #F7F6F1 at 1 → Combine at 90% under the flat-salt mask |

Why. Real halite polygons are 1–10 m; even exaggerated to 50–150 m they are under one pixel here (F3.4), so any crust
relief would only add noise and risk letting the pan drop below its pools (F4.3). The crust is a pattern in colour,
sized to read as polygons a kilometre or so across: an exaggeration of about 100×, for looks, which the handoff must
say (GA18). The 2D map's faint pink salt (#EBCBCB) becomes halite white here; the pink stays on the brine pools.
The protect mask is shrunk and limited to flat ground because its edge pixels climb hundreds of metres up
the neighbouring slopes (the mask comes from 2 km cells, the heights from a 0.5 km bake; F1.7): used raw, it would
freeze slivers of escarpment and leave walls round the pools. The prepared mask covers about 372 km² at > 50%, of
488 km² raw.

### 4. Acid dome: small stepped terraces

| | |
|---|---|
| Drives it | `mask-biome-acid-pits` (280 km²) × **Height** > 20 m (Range 0.00468–1, falloff 0.0005 ≈ 2 m) |
| Chain | **Terraces** "Rimstone Terraces" → **Mask** (In2 = the escarpment result, Mask = the dome mask) |
| Terraces | Terraces 256 (the node's maximum: steps of 16.7 m real, 33 m as shown), Uniformity 0.7, Steepness 0.7, Intensity 1 |

Why. The dome rises from the 16 m pools to about 63 m (95th percentile) at a median real slope of 0.6°. Steps of
16.7 m give tiers at about 17, 33 and 50 m, 1.5 km apart (about 13 px): three or four rimstone rings that read from
across the basin. Real Dallol rimstone steps are centimetres to metres, so this is about 10–30× exaggerated, on purpose
(P20; label it, GA18). The Height selector starts above the 16 m pool level, so no terrace can drop ground to or below
the pools or the pan (a numpy stand-in without it took dome edges down to 5.5 m). The pools themselves are flat
because the restore puts them back.

The slope selector the recipe mentions (× Slope > 0.3° real) is left out: the Height selector already keeps the steps
off the pan and pools, and on flat ground Terraces only makes broad treads, which is the look wanted.

### 5. Acid colour branch: the loudest thing on the tile

| | |
|---|---|
| Drives it | acid zone = `mask-biome-acid-pits` ∪ `mask-biome-sulfur-crust` ∪ `mask-lakes-acid` (Combine Max ×2, blurred); rings = **Distance** from `mask-lakes-acid` (Mode Pyramid, Directions 24, Falloff 0.05) |
| Mute the rest | **HSL** Saturation −0.25, Lightness −0.03 on everything, then the un-muted colour put back inside the acid zone (Combine 100%) |
| Rings | **CLUTer** on the distance field, from far to near: rust #8C4A20 (0) → the map's burnt orange #C8661E (0.3) → orange #F08A1C (0.55) → sulfur #F0CF2E (0.72) → white salt rim #F6F0D2 (0.86) → acid green #A8CF2A (1) → Combine at **100%** under the acid zone |
| Sulfur crust | the map's sulfur yellow #F0CF2E (**Constant**) at 45% under `mask-biome-sulfur-crust` |
| Pools | the 2D map's own pool colours (acid green #A8CF2A, sulfur #D8D52B, teal #1FB7A0, deep #2F5A2E) from `colormap.png`, +20% saturation (**HSL**), at 100% under the pools shrunk ≈ 1 px (**Dilate** Invert) |

Why. The present graph paints the 2D colours over the whole field at 85%, which makes it flat paint (F4.8). The rings
follow Dallol's real sequence from a vent outward: green pools, white salt, sulfur yellow, then orange and ochre iron
as the deposits age (A3.9); the orange band uses the map's own acid-ground colour, so 2D and Gaea agree. The pool
colours come from the map, which already varies them per pool. Muting everything else a little, rather than
over-saturating the pits, is what makes them pop (F4.8). Measured on the 2D colormap, the acid field already has the
highest median chroma (0.67), but the mineral washes come close (0.58), because both are rust-orange; after the mute
the gap should open to at least 1.5×, which the checker tests. The distance falloff aims at rings reaching about
40–50 px from the pools (the sulfur crust sits 1–16 px from them, the acid ground 2–51 px).

## Which node types and property names are certain

Gaea omits properties at their default and reads them by name, so a wrong name is silently ignored (the value just
doesn't apply) but a wrong type or an enum written as a number stops the node loading. Every enum here is written as
its member name.

| Certainty | What | Evidence |
|---|---|---|
| **Confirmed by your save** (6 Nov) | File `FileName`, `IsRGB`; Combine `PortCount`, `Ratio`, `Mode` as text, `RenderIntentOverride: "Color"`; SatMap `LibraryItem`; Erosion2 `Seed`, `Version`; `SaveDefinition`; ports `In`, `Out`, `Input2`, `Mask`, `Precipitation` | `tools/gaea/act1.terrain` (gaea.md §7) |
| **Seen in other people's Gaea saves** (same file layout as yours, version-stamped) | Erosion2 `Duration`, `Downcutting`, `ErosionScale`, `ShapeDetailScale`; Slope `Range {X, Y}` in degrees and `Falloff`; Height `Range {X, Y}` 0–1; the **Mask** node's ports `In`, `In2`, `Mask`; Stratify `Intensity`, `TiltAmount`, `Seed`, port `Layers`; Thermal2 `Duration`, `Angle`, `FeatureScale`, ports `AreaMask`, `SedimentRemoval`, `Wear`, `Deposits`; Distance `Directions`, `Falloff`; Combine `Mode` "Multiply", "Subtract", "Max" | trentpolack/GaeaSandbox `gaea_wasteland_landscape.terrain` (Gaea 2.2.0.1); danemadsen/nerthus `Fractal Terraces.terrain` (Gaea 2.2.9.0 Enterprise) |
| **From a schema read out of Gaea.Nodes.dll 2.3.0.1** by a third-party tool, plus example files stamped 2.3.1.0 whose origin is unclear | Terraces `NumTerraces` (the UI says "Terraces"), `Uniformity`, `Steepness`, `Intensity`; Stratify `Spacing`, `Octaves`, `Shape`, `Direction`; Thermal2 `Strength`; Blur `Radius`; Dilate `Size`, `Invert`; the **Invert** node; Shape `X`, `Y`, `Scale`; Cracks `Style`, `Octaves`, `Scale`, `Depth`, `Jitter`, `WarpStrength`, `WarpSize`; CLUTer `GradientData` as `{X, Y, Z, W}` = R, G, B, position; HSL `Saturation`, `Lightness`; Constant `Output: "Color"`, `Color {R, G, B}`; Distance `Mode: "Pyramid"` | Theorist100/gaea2-mcp `gaea_schema_generated.rs`; danemadsen/nerthus `Badlands.terrain`, `Height and Slope Masks.terrain` |
| **Units not known: look before you trust the number** | Blur `Radius` (aim: soften by 2–4 px); Dilate `Size` (shipped scenes use 0.0012–0.0025, consistent with a share of the tile width, so 0.0015 ≈ 1.5 px); Shape `Scale` and whether `Y` counts from the top; Distance `Falloff`; Cracks `Scale`; Stratify `Spacing` and the 0° of `Direction`; whether Terraces counts steps over 0–1 or over the input's own range; whether colours are stored linear (assumed: the example files' colours only look right as linear) | — |

**Confirm them all in one go (GA6):** open the copy, then *Save As* `act1-roundtrip.terrain` without touching anything,
and compare the two files (VS Code's compare, or `git diff --no-index act1.terrain act1-roundtrip.terrain`). Gaea writes
back only the properties it recognised that differ from their defaults, so any property of mine that disappears was
either a wrong name or a value equal to the default (the acid Terraces' Intensity 1 and Cracks' Style Normal are
defaults and may vanish; that is fine). Anything else that vanishes is a wrong name: tell me, or set it in the UI. Then
add the confirmed names to `references/gaea.md` §7 with the date.

## How to open it

1. Commit the current `tools/gaea/act1.terrain`.
2. Copy this `act1.terrain` into `tools/gaea/` (as `act1.terrain`, or side by side as `act1-v2.terrain` to compare the
   two in Gaea), close the project in Gaea and reopen it with Ctrl+O (GA7). Don't launch a second Gaea.
3. If Gaea refuses the file, use File > Repair. If it still refuses, the most likely culprit is a colour format (the
   two CLUTers and the Constant): delete those three nodes from the JSON, or tell me the error text.
4. Preview these nodes first, before judging the terrain: *City Shelf Keep-out* (a white disc on the upper city, just
   east of the falls, a little west and north of the tile's centre; if it sits in the south, set Y to 0.577), *Esc Mask: minus city
   shelf* (white along the escarpment faces only), *Acid Dome Mask* (the dome around the pools, pools black), *Protect:
   shrunk × flat* (the pan and pools, without slivers up the slopes) and *Acid: rings* (bands centred on the pools).

## What could go wrong

| Risk | What you'd see | Fix |
|---|---|---|
| A node won't load (guessed format) | Gaea error on open, or a red node | Repair; or remove that node and tell me its name |
| A property name is wrong | That setting silently stays at default (found by the round-trip compare) | Set it in the UI and save; record the name |
| The restore Combine works the other way round (the docs are ambiguous; F2.9) | Pan and pools come out eroded or terraced; checker FAILs "Protected ground unchanged" | Swap Inputs on "Heights" |
| The Precipitation input works the other way round | Erosion's Flow output lights up on the pan and nowhere else | Bypass "Rain Mask" (the Invert) |
| Benches read as rice paddies | Even, sharp steps all along the scarp | Uniformity 0.15–0.2, Intensity 0.4, or Terraces 9 |
| Benches too deep | Lip or foot moves; checker warns over 300 m cut | Intensity down |
| Benches ring the volcano or the rim hills | Steps outside the escarpment | Lower the Blur radius; the escarpment touches the young basalt on 208 px |
| Keep-out disc misplaced | Steps across the upper city or the falls | Move/resize *City Shelf Keep-out* with its gizmo |
| Strata tilt toward the basin | Bands on the scarp face drop toward the basin | Direction + 180 (or try 156, the same bearing if 0° is east, counter-clockwise) |
| Dome terraces too subtle or too many | Rings invisible, or a stair look | Terraces 256 is the finest; for fewer, bigger steps use 128 (33 m real) |
| Acid ground dug below its pools | Checker WARN "Acid dome not dug below its pools" | Raise the Height selector to 25 m |
| Rings star-shaped or the wrong width | Spiky bands, or rings that stop short of the orange ground | Directions up; Distance Falloff up or down until the rust band meets the acid-ground edge |
| Acid colours bleed over the dome edge as a hard disc | Orange spills onto the gravel or the pan | Lower the acid-zone Blur radius |
| The rest looks grey | Everything but the pits dull | HSL Saturation −0.15 |
| Colours too pale or too dark everywhere | Linear/sRGB mix-up in the colour values | Re-pick the hex values in the UI (they're listed above) and save |
| Relief jumps after a new export | `heightMetres` changed | Pre-flight: checker FAILs "Terrain Height" |
| The before era | `before-act1` has no acid-pits, sulfur-crust or salt-flats masks (its dome is "Spring Terraces"), so those File nodes would point at missing files | Keep a separate before copy: swap the acid masks for `mask-biome-spring-terraces`, white travertine rings and clear blue-green pools, no salt crust |

## How to check it

**By numbers** (GA15), after a build:

```
py check_heights.py --export world\build\gaea\now-act1 --terrain tools\gaea\act1.terrain ^
    --built "<build folder>\Heights.exr" --colour "<build folder>\Colour.exr"
```

It needs numpy and Pillow; for EXR also `pip install OpenEXR` (or export Heights as 32-bit TIFF / raw float32 and
Colour as PNG). It undoes a flipped or rotated build, accepts heights stored 0–1 or in project metres, and exits 1 on any
failure. Pass means:

- **Protected ground unchanged:** the pan and every lake (protect mask, shrunk 2 px, real slope < 2°) moved at most
  0.5 m. Expected: 0.0 m.
- **Every lake flat and in place**, and no flatter or rougher than the export.
- **The pan still the lowest land:** no pixel outside the pan newly below it, and no more land below the brine level
  (9 m) than the export had (1,444 px today, all map-made).
- **Acid pits the loudest ground:** the acid field's median chroma at least 1.5× the next biome's (2D colormap today:
  0.67 vs 0.58 for the mineral washes, 1.1×).
- Reported for tuning: share of pixels changed by more than 1/10/50/150 m; the deepest cut and highest fill on the
  escarpment (expect up to ~230 m cut), on the acid dome (expect up to ~17 m) and elsewhere (erosion).

Run it once without `--built` now: it gives the baseline above and the map problems in "Map problems the tile shows".
I tested it against a numpy stand-in of this graph (passes), a mirrored copy (detected and undone), heights in project
metres (detected), a pan lowered 3 m (fails "Protected ground unchanged" and "Nothing new below the brine pools") and a
hole dug below the pan (fails "Pan still the lowest land").

**By eye** (GA16), same exposure and camera for before and after:

1. Gaea 3D, low angle from the south-west (the overview's camera side): the escarpment should show 3–5 bench lines
   with talus aprons, not stairs; layers should dip back into the plateau; the city shelf and the falls notch as before.
2. The pan from above: white, no relief, no erosion channels, crack pattern visible but quiet; the pink brine pools flat.
3. The acid field from across the basin: it should be the first thing the eye lands on. Pools in the map's greens and
   teal, a white rim, then yellow, orange, burnt orange and rust rings; three or four terrace tiers visible in the shading.
4. A top-down Shade of "Heights" against the Azgaar `screenshot` of the act1 frame: every landform in the same place.
5. Before vs after views of the old and new graph, and the terrain viewer's Act I overview for comparison; the
   reference overview is for mood only (P6).

## Questions for George

1. **The two low acid pools.** The pools at the east end of the field, at (792, 602) and (822, 650), sit at the brine
   pools' 9 m with floors at 4 m, while the other five are on the dome at 16 m. Should I raise them to the dome in the
   map (my default), or are they meant as pan-edge pools?
2. **Smoothing the pan in the map.** Its flat core still varies 4–25 m with shelves at the pool levels. May I level it
   to the brine level with one sculpt op (it moves no water and no edge, and makes "dead flat" true in 3D too)?
3. **The city shelf.** It isn't flat in the bake (7.5° median slope). Should the map's shelf op be made flatter so the
   upper city reads as a bench, or is the current slope fine for 3D views?
4. **How strong the benches should be.** I started at about four benches of ~350 m with a ~230 m maximum cut. Do you
   want the escarpment bolder (more, sharper steps, like a staircase of fault blocks) or subtler?
5. **Acid palette.** I used the map's own pool colours and Dallol's ring order with the map's burnt orange. Do you
   have concept art the pits should match instead? (If so, Gaea's Synth node can turn a photo into the palette.)
6. **Mineral washes.** In 2D they are nearly as loud as the acid ground (#B85D23 against #C8661E: the same rust-orange). Is that intended, or should
   the washes go a paler, greyer mineral white so orange belongs to the acid field alone?
7. **A settlement mask in the export.** The keep-out disc is placed by hand from the map's coordinates. Shall I propose
   `export_gaea` writes a settlement-footprint mask (and a marker mask for the falls and vents), so this comes from the
   map automatically?

## Sources

- George's project and export: `tools/gaea/act1.terrain`, `world/build/gaea/now-act1/` (6 Nov 2026); vault README
  "Map decisions" (2026-11-03), "Act I present-day map" and "Map direction" (2026-11-05/06); the Danakil-Dallol
  blueprint; `docs/studio/research/cartography/F_gaea.md`.
- QuadSpinner Gaea 2 docs source, node property lists: https://github.com/QuadSpinner/Gaea2-Docs (`source/.flubs/`).
- Gaea 2.2.0.1 save: https://github.com/trentpolack/GaeaSandbox (`Stamps/Wasteland/gaea_wasteland_landscape.terrain`).
- Gaea 2.2.9.0 and 2.3.1.0-stamped example files: https://github.com/danemadsen/nerthus (`crates/nerthus-app/assets/examples/`).
- Schema extracted from Gaea.Nodes.dll 2.3.0.1: https://github.com/Theorist100/gaea2-mcp (`crates/mcp-gaea2/src/gaea_schema_generated.rs`).
