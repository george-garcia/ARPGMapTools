# F. Gaea 2: turning the map's geology into 3D terrain

Track F of the `arpg-cartography` research, read 13 Nov 2026. George has **Gaea 2.3.1.0 Community** on Windows (the saved
project's metadata says `"Version": "2.3.1.0", "Edition": "Community"` [S15]). The rule this track serves: **Azgaar places,
Gaea details.** Every landform recipe below is driven by a mask that the map exports, so the map stays the only place
where geography is decided (P1, P3), and Gaea only adds the detail a 2 km Azgaar cell can't hold.

**How to read the tags.** The brief's tags apply, with three local uses:
- **DEV** here means QuadSpinner, Gaea's developer, in its official docs, release notes, blog or licence. Most DEV
  findings come from QuadSpinner's public docs source (`github.com/QuadSpinner/Gaea2-Docs`, commit `dee3608`, 25 Sep 2026),
  which is what `docs.gaea.app` renders [S1]. Paths like `[S1 reference/nodes/surface/sand.md]` point into it. Node
  property names come from the repo's per-node property files (`source/.flubs/<Node>.json`), which list each property's
  UI name, type and enum values. A few findings use the **Gaea 1.3** docs (`docs.quadspinner.com`) where the Gaea 2 docs
  say nothing, and they are marked "Gaea 1".
- **PROJECT** means George's sessions driving Gaea through computer use (Nov 2026), as relayed in this track's brief [S18].
- **OBSERVED** means measured by me on this repo's real export, `world/build/gaea/now-act1/` (built 6 Nov 2026), with
  numpy, read-only [S16].

**What I could not read.** The rendered sites `docs.quadspinner.com` (root) and `docs.gaea.app` (root) were blocked by
the session's permission prompt, and `quadspinner.com` was refused by the egress proxy for direct download; I read the same
content from the docs repo and via WebFetch summaries of single pages. The EULA was read only through a summariser, so
its quotes are short and should be checked against the PDF [S7]. I found **no community recipes** for salt pans, travertine
or acid fields in Gaea, so the recipes in §4 are INFERRED: built from the node docs plus track A's geology. They are
starting points to tune, not tested settings.

There are 57 findings (F1–F6), then recommendations, a proposed `gaea.md` reference outline, a recipe table and open
questions.

---

## 1. What the map hands Gaea today

**F1.1 The tile.** `export_gaea` writes a square tile around the `act1` frame (frame side plus a 14% margin each side), by
default 1024 px, as `heightfield.r32` (32-bit float, 0–1, top row first, little-endian), `colormap.png` (a screenshot of the
biomes, lakes and rivers layers, resampled to the tile) and 8-bit PNG masks. Heights are divided by
`heightMetres = ceil(max height in the tile)`, and anything below 0 is clamped to 0. For Act I that is 128,000 m at 1024 px
= 125 m/px, `heightMetres` 4,273. [SOURCE S14 session.ts:907-1044; S16 gaea.json]
*Check:* `world/build/gaea/<era>-act1/gaea.json` holds `scaleMetres`, `heightMetres`, `metresPerPixel` and the mask list.

**F1.2 The masks are of three kinds, and only two are soft.** [SOURCE S14 session.ts:937-1001]
- **Cell masks** (water, lakes-acid, lakes-other, rivers, every `biome-<slug>`): binary 0/255, built pixel by pixel from
  the Azgaar cell under each pixel. Edges follow Voronoi cell borders, with no anti-aliasing. A biome mask exists only if
  that biome has a land cell (h ≥ 20) in the tile.
- **Line masks** (roads, washes): canvas strokes, anti-aliased, `size/400` px wide for roads (2.6 px ≈ 320 m at 125 m/px)
  and `size/300` px for washes (3.4 px ≈ 430 m). Roads include only the groups `main-road`, `old-road`, `roads`, `trails`.
- **Graph masks** (`gaea-protect`, `gaea-colour`): cell masks blurred by `size/512` px (2 px ≈ 250 m). Protect = water,
  any lake, and the Salt Flats biome. Colour = water, lakes, rivers, and the Salt Flats, Sulfur Crust, Acid Pits and Dead
  Spring biomes.
All PNGs are RGBA (OBSERVED). The names are hard-coded, so renaming a biome or route group silently empties a mask
[track D, G5].
*Check:* in `gaea.json` every mask the graph reads must be listed, and must not be all black.

**F1.3 `heightMetres` is per export, so the project's exaggeration can drift.** The saved project's Terrain Height is
8,546 m = 2 × 4,273. If an op moves the tile's highest point (the volcano summit, or the frame), the new export is
normalised to a new maximum, while the project still says 8,546. The relief then silently changes. [SOURCE S14:1026-1035;
S15 act1.terrain `Terrain.Height`; INFERRED consequence]
*Check:* after every `npm run world`, compare `2 × heightMetres` in `gaea.json` with `Terrain.Height` in `act1.terrain`.

**F1.4 Stale mask files survive.** `exportGaea` creates the folder and overwrites files, but never deletes them. A biome
that leaves the tile keeps its last mask on disk, and a File node will keep reading it. [SOURCE S14:1024-1031]
*Check:* the `masks` list in `gaea.json` is the truth. Compare it with the folder and the file dates.

**F1.5 The saved graph is minimal.** [SOURCE S15 act1.terrain, docs/gaea.md]
`File(heightfield.r32) → Erosion2 (all defaults, only Seed 48978 stored) → Combine "Heights" (In = eroded,
Input2 = original, Mask = gaea-protect, Blend, Ratio 1.0, marked for EXR export) → SatMap (Library Item 399) → Combine
"Biome Tint" (Input2 = colormap, Ratio 0.35, colour) → Combine "Colour" (Input2 = colormap, Mask = gaea-colour,
Ratio 0.85, exported)`. Build settings: 1024 px, destination `<Builds>\[Filename]\[+++]` (a new numbered folder on every
build). No selector, no Surface node and no biome mask is used yet, so all biome character comes from the 2D colours.

**F1.6 Measured mask facts for Act I (now era).** [OBSERVED S16; true height, 125 m/px; slope from central differences]

| Mask | Area | Height p5 / p50 / p95 (m) | Slope p50 / p95 |
|---|---|---|---|
| biome-rift-escarpment | 783 km² | 657 / 1,471 / 1,967 | 10° / 36° |
| biome-recent-basalt (incl. volcano) | 239 km² | 656 / 1,609 / 3,384 | 24° / 58° |
| biome-old-basalt | 373 km² | 289 / 406 / 564 | 1.8° / 12° |
| biome-gravel-flats | 1,780 km² | 65 / 249 / 503 | 1.6° / 13° |
| biome-mineral-washes | 282 km² | 60 / 133 / 231 | 1.4° / 4.8° |
| biome-fossil-terraces | 134 km² | 79 / 128 / 256 | 0.9° / 6.7° |
| biome-gypsum-pavement / -dunes | 92 / 46 km² | 64 / 9 (p50) | 0.4° / 0.1° |
| biome-salt-flats | 268 km² | 6 / 14 / 262 | 0.4° / 18° |
| biome-acid-pits | 280 km² | 16 / 33 / 63 | 0.6° / 1.9° |
| biome-sulfur-crust | 101 km² | 11 / 39 / 68 | 1.3° / 2.9° |
| lakes-acid (7 pools) | 135 km² | 5 / 16 / 23 | 0.0° / 1.3° |
| roads / washes (lines) | — | 431 / 113 (p50) | 2.3° / 1.0° (p50) |

**F1.7 Masks and heights don't line up at the edges.** Every lake is flat at one water level inside its mask (the median
is exact: 9, 16, 36, 121 m…), but edge pixels climb far above it. One lakes-other component spans 1,156–3,215 m. The
largest salt-flats component reaches 1,414 m, although its median is 9 m. The likely cause is that masks come from the
2 km cells, while heights come from Azgaar's ~0.5 km erosion bake, which also moves water to its surface (track D 2.11).
[OBSERVED S16; cause INFERRED]
*Consequence:* a protect or flatten mask used raw also freezes or flattens slivers of escarpment. Shrink lake masks by
1–2 px, and intersect the salt-pan mask with a Slope selector before using them to protect or flatten anything.

**F1.8 The summit lava lake bakes as a pit about 2 km deep.** A profile through the lakes-other component at (780, 287)
reads rims of 3,000–3,500 m, a flat floor at about 1,160 m, and a pit 3–4 km across, about 6 km² in area. The summit
(4,273 m) is 3.5 km away. Gaea will faithfully erode that pit as a deep caldera. Erta Ale's real pit is sub-km [track A
A6.2]. [OBSERVED S16]
*Check:* sample a row and a column through the lava lake. Fix it in the map (the skill's call, flagged for track D), or
fill it in Gaea only as a labelled stopgap (§4.9).

**F1.9 The heightfield is partly faceted.** About 19% of pixels are near-planar (|Laplacian| < 0.05 m), which fits a
mesh-interpolated bake. Erosion on facets can pick out triangle edges. [OBSERVED S16; effect INFERRED]
*Check:* view `heightfield.r32` alone in Gaea's 2D view, with Shade, before any erosion.

**F1.10 Act I's acid field is ~60× Dallol.** The acid-pits biome covers 280 km² and the acid pools 135 km², against
Dallol's ~3 × 1.5 km [track A A3.9]. That is allowed (P20, A6.3), but Gaea detail has to be sized to the map's pools,
not to Dallol's centimetre-scale rimstone. [OBSERVED S16; INFERRED]

---

## 2. The Gaea 2.3 node set we need

**F2.1 Use the node names Gaea 2 shows (and saves).** The docs' prose says "Erosion_2", but the node is **Erosion2**
(`$type QuadSpinner.Gaea.Nodes.Erosion2`). Gaea 2 also has **Thermal2**, **Wizard2**, **EasyErosion** and **Edge**,
which was "Zero Borders" in Gaea 1. The **Mask** node is a post-mask; Gaea 1's 2D drawing node is now **Draw**. There
is no Grow or Shrink node: use **Dilate** (its *Invert* option shrinks), Blur plus Threshold, or **Distance**.
[DEV S1 reference/nodes/*, utility/edge.md, utility/mask.md; S15]

**F2.2 The node reference.** Families as the toolbox shows them [DEV S1 reference/index.md]. Property names are UI
labels from the property files [DEV S1 .flubs]; the names in the `.terrain` file can differ (F5.2).

| Need | Node (family) | What it does | Key properties (UI names) |
|---|---|---|---|
| Hydraulic erosion | **Erosion2** (Simulate) | GPU erosion with three sediment classes, deterministic | Duration, Downcutting, Erosion Scale, Seed; Suspended Load / Bed Load / Coarse Sediments, each with a Discharge Angle; Shape, Shape Sharpness, Shape Detail Scale; Orographic: Enable, Directional Precipitation, Direction, Rain Shadow, Slope, Altitude, Reverse; NoErosion; ports Precipitation (in), Flow, Wear, Deposits (out) |
| Classic or quick erosion | Erosion, Wizard, **Wizard2**, **EasyErosion** | The Gaea 1 simulation; preset wrappers | Wizard2: Power, Depth, Scale, Deposits, Flow, Shape, Detail (Low…Ultra). EasyErosion: Style (Simple, Ancient, Alpine, Rocky, Exposed, Flows, Strata, Withered, SoftSoil, **Dessicated**, Thin…), Bias Angle |
| Talus | Thermal, **Thermal2** | Thermal breakdown into talus | Thermal2: Duration, Strength, Anisotropy, Angle (talus), Sediment Removal, **Feature Scale (m)**. Thermal also has Real Scale, Terrain Scale, Verticality |
| Edge collapse | **Crumble** | Collapses terrain from edges and crevices | Duration, Strength, Coverage, Horizontal, Vertical, Rock Hardness, Edge, Downcutting, Depth, Direction |
| Fill | **Sediments** | Thick generic sediment layer | Type (Fine, Bulky, Classic), Passes, Scale, Angle, Style, Grainy Deposits |
| Braided or pitted flow | **Anastomosis** | Interconnected flow-based downcutting | Impact, Width, Depth, Downcutting (Destructive, Pits, **Flows**, Rivers ×1/2/4, **Flooding** ×1/2/4), Quality, Smooth Edges |
| Loose rock | Debris, Scree | Physical debris; scree fields | Debris: amount, Scale, Friction, Shape; Scree: Scale, Height, Density, Spread, Edge |
| Water | **Rivers**, **Lake**, Sea, **HydroFix**, Pond | Rivers carves its own network; Lake fills depressions; HydroFix makes flow unbroken | Rivers: Water, Width, Depth, Downcutting, River Valley Width, Headwaters, Render Surface; Lake: Type (Simple, Advanced), Water Level, Precipitation, Flood Control, Water Floor, Shore Size |
| Strata | **Stratify**, **FractalTerraces**, **Terraces**, **Steps**, **Sandstone**, **Shear** (Surface) | Broken strata; fractal terraces; stepped breaks; sandstone chipping; sheared strata | Stratify: Spacing, Octaves, Intensity, Shape, Tilt Amount, Direction. Terraces: Terraces (count), Uniformity, Steepness, Intensity. FractalTerraces: Spacing, Octaves, Intensity, Shape, Protect Range, Apply Tilt, Tilt Amount… |
| Rock surface | **Rugged** (Terrain), **Craggy**, **Outcrops**, **Shatter**, Stones, Roughen, Distress, GroundTexture, Pockmarks | Rocky surface that keeps the overall shape; cracked rock fields; outcrops | Rugged: Style A–E, Scale. Craggy: Size, Depth, Shape. Shatter: Shatters, Size, Coverage |
| Sand | **Sand** (Surface), **DuneSea** (Terrain) | Sand patterns or dunes on an existing landform; a whole dune-sea landform | Sand: Scale, Direction, Chaos, Softness, Height, Warp by Terrain. DuneSea: Dune Type A–D, Chaos, Undulation, Direction, Height, Sharpness |
| Cracks and patterns | **Cracks** (Primitive), **Pattern** | Crack network on a flat base; repeated patterns | Cracks: Style (Normal, Hard, Classic), Octaves, Scale, Depth, Jitter, Warp Strength/Size, Scale X/Y |
| Landform primitives | **Volcano**, **Crater**, Canyon, Plates, Slump, **Distance** | Cone with mouth; volcanic or impact crater; canyon (has a Slot control); slopes grown from flat shapes | Volcano: Scale, Height, Mouth, Bulk, Surface, X, Y. Crater: Style, Scale, Formation, Height, Rim (Soft, Sharp), X, Y |
| Selectors | **Height**, **Slope**, **Curvature**, Angle, FlowMap, Soil, RockMap, Occlusion, Peaks, TextureBase, Texturizer, **ColorThreshold** (2.3) | Masks from terrain properties or simulations | Height and Slope: Range, Falloff (Slope also has Type, Micro Accent). Curvature: Range, Type (Horizontal, Vertical, Average). ColorThreshold: Start (colour), Falloff |
| Mask ops | **Blur**, **Dilate**, **Threshold**, Clamp, Autolevel, **BlobRemover**, Median, Denoise, Curve, Shaper, **Warp**, Edge, **Heal** | Soften, grow or shrink, binarise, clean, reshape, repair | Dilate: Size, Shape, Iterations, Kernel, Invert. Heal: Reconstruction, Passes |
| Blend | **Combine**, **Mask**, Mixer, Layers, Route, Switch, Chokepoint, Accumulator | Two-input maths; post-mask; up to 15 colour layers | Combine: Mode (24 modes), Ratio, Output (None, Clamp, Extend), Enhance |
| Colour | **SatMap**, **SuperColor**, **CLUTer**, **Tint**, **WaterColor**, ColorErosion, **Weathering**, **Synth**, HSL, Splat, RGBMerge | Satellite palettes; gradient over a mask; two-colour ramp; water palettes; colour transport; age and dirt; palette from a photo | SatMap: Library (New, Rock, Sand, Green, Blue, Color), Library Item, Range, Bias, Rough, Hue, Saturation, Lightness. WaterColor: Palette (Generic, Jungle, **Oasis**, Dirty, **Murky**, **Muddy**, **Custom**…), Shallow, Deep |
| Inputs | **File**, Constant, Shape, Draw, Linear/RadialGradient | Load a heightfield, mask or colour map; flat value; geometric shape; hand drawing | File: File, Relative Path, Is RGB, Enforce Linear Gamma, Allow Unclamped, Crop to Square, Never Cache |
| Outputs | **Export**, Mark for Export (F3), Shade, Cartography, Sunlight, Unity, Mesher | Write files; hillshade; map-style render | Export: Format (EXR, TIFF8/16/32, PNG8/16/64, FloatRaw32, UshortRaw16, GaeaRaw…), Location (BuildFolder, Custom, Explicit) |

**F2.3 How Erosion2 behaves.** [DEV S1 understanding-erosion/erosion_2/index.md, S2]
- Several shorter-Duration passes preserve a given shape better than one long pass; long Duration is for terrain shaped
  mainly by erosion.
- Order passes from large Erosion Scale to small, because "nodes with higher Erosion Scale should usually precede".
- The three sediment classes each do about a third of the deposition. Coarse Sediments settle only near steep slopes,
  from about a 24° discharge angle, and build scree, debris and **alluvial fans**. Bed Load fills gullies and offsets high
  Downcutting.
- Low Shape keeps the original form. Lowering Shape Detail Scale cuts fine detail you will add later with Surface nodes.
- It runs on the GPU and falls back to the CPU when VRAM runs out. 2.2 added orographic controls and a **Selective
  Precipitation** mask input; 2.3 added "Extra Deposits" and a "No Erosion" mode. [DEV S1 history/gaea-2.2/2.2.0.0.md,
  gaea-2.3/2.3.0.0.md]

**F2.4 Erosion2's likely file names, and real value ranges.** The docs' "Erosion_2 in Action" table lists settings by
names that look like the serialised ones: `Duration`, `Downcutting`, `ErosionScale`, `SuspendedLoadDischargeAmount`,
`SuspendedLoadDischargeAngle`, `BedLoadDischargeAmount`, `BedLoadDischargeAngle`, `CoarseSedimentsDischargeAmount`,
`CoarseSedimentsDischargeAngle`, `Shape`, `ShapeSharpness`, `ShapeDetailScale`. Its 24 examples span Duration 57–197,
Downcutting 0–0.71 and ErosionScale 16.7–20,000. [DEV S1 erosion_2-in-action.md]
That these are the `.terrain` names is INFERRED: confirm by saving (F5.2).

**F2.5 The precipitation mask limits where rain falls, not where erosion lands.** In Gaea 1, an Area mask "masks the
processing but not the shape": rain confined to a volcano's top still erodes the slopes below it [DEV Gaea 1, S8]. Gaea
2's Precipitation input is the port of that feature [DEV S13]. A shape mask (the Mask node, or a Combine mask) limits
the **result**. Use the precipitation input to say where water comes from (the plateau and escarpment, not the pan), and
a result mask to protect features.

**F2.6 Prefer the Mask node to mask ports.** It gives identical results as a post-process, so editing the mask does not
re-run the erosion. Its second input picks the "before" node when several nodes form the effect. [DEV S1
utility/mask.md, getting-started/basics/masks.md]
*Project note:* the saved Erosion2 has no Mask port at all (ports In, Out, Precipitation, Flow, Wear, Deposits), so
protection happens downstream in a Combine [S15].

**F2.7 Use Surface nodes, not more erosion, to add detail to Azgaar's shapes.** Surface nodes "add and subtract shapes
at the surface" and preserve the volume [DEV S1 crafting-the-surface/surface-nodes.md].
- Stratify does large-scale strata, tilt and uplift.
- Sandstone adds multi-pass chipping and staggered stair-steps.
- FractalTerraces gives low-level control.
- The chain `Stratify > Sandstone > Stratify > Sandstone` is the documented recipe for layered rock.
- Outcrops, Craggy and Stones grow rock on an existing shape.
QuadSpinner's general advice: macro first, micro later; don't solve a macro problem with micro detail [DEV S1
design-low-first.md, diagnose-terrain-look.md].

**F2.8 Gaea's Rivers node invents drainage.** It makes networks on any terrain, "whether it can sustain rivers or not",
nudging the ground to give unbroken paths. Its only placement control is a Headwaters mask. Lake simulates rainfall to
fill depressions, with Simple (level and position) and Advanced (precipitation) modes. HydroFix makes small adjustments
for unbroken flow and is built into Rivers. [DEV S1 simulate/rivers.md, lake.md, hydrofix.md]
*Rule:* the map owns drainage (P1). Don't run Rivers or Lake on the regional tile. If a close-up needs river detail, feed
Rivers a Headwaters mask taken from `mask-rivers`, and check the result against the map's rivers. [INFERRED]

**F2.9 How Combine works.** [DEV S1 utility/combine.md, .flubs/Combine.json]
- Its 24 modes include Blend, Add, Subtract, Multiply, Max, Min, Difference, Screen and Power.
- The output is clamped to 0..1 by default (Output: Clamp). Adding terrains past 1.0 "will return flat portions".
- It switches to colour blending when the first input is a colour map.
- On masks, the doc says brighter mask areas take "the first input" and darker ones the second. That reads as the
  opposite of how the saved graph uses it: drawn heights in Input2 return where the protect mask is white.
- 2.3 fixed "Combine did not blend with black when secondary ports were unconnected" [S1 2.3.0.0].
*Check:* the docs' wording may simply be loose. Confirm once in the viewport that lakes and the pan come out flat after
the "Heights" Combine. If they don't, swap the inputs (Combine has a Swap Inputs command).

**F2.10 Colour tools.** [DEV S1 colorize/*.md, working-with-satmaps.md, crafting-masks.md]
- **SatMap**: over 1,400 palettes "derived from real satellite data", tuned with Bias, Clip, Rough and HSL.
- **CLUTer**: a gradient mapped over any mask. "All color texture generation" works this way: a ramp through a mask.
- **Tint**: a two-colour CLUT, good for flat material colours and for viewing masks.
- **Synth**: turns a photo into a CLUT, so a real Dallol photo can drive the acid palette.
- **WaterColor**: water palettes, plus Shallow and Deep colours.
- **Weathering**: brightens exposed forms and darkens crevices, "a controlled ageing pass".
- **ColorErosion**: transports colour downslope.
- **Mixer**: layers up to 15 colours by mask.
A Gaea 1 warning still applies: using the erosion Flow output as the main texture driver looks "CG" [DEV Gaea 1, S8].

**F2.11 How outputs are named and placed.** [DEV S1 exporting-nodes.md, build-options/nodes.md, build.md, build-tokens.md,
managing-input-and-output.md]
- **F3** (Mark for Export) writes the node's chosen ports as `<name>_<port>.<ext>`. The `_Out` suffix can be turned off.
- The **Export** node's Location is BuildFolder, Custom or Explicit. Explicit takes a full path without an extension.
- Build destinations take tokens: `<Builds>`, the project folder, `[Filename]`, `[+++]` (increment), `[Date]` and others.
- Options include overwrite or increment, "Maintain a static folder with the latest copy", and "Copy the .terrain file
  to the build folder".

**F2.12 File node properties (UI names).** File, Relative Path, Is RGB, Enforce Linear Gamma, Allow Unclamped, Crop to
Square, and under Caching: Purge Cache and Never Cache. The Raw scale reading suits normal 8-, 16- and 32-bit data. Use
"Normalized" or "Mapped" only for out-of-range data. [DEV S1 primitive/file.md, .flubs/File.json]
*Project note:* in the `.terrain` file these are saved as `FileName`, `IsRGB` and `RelativePath`, not as the UI labels
[PROJECT S18, S15].

---

## 3. Scale: Terrain Definition, resolution and what reads

**F3.1 Terrain Definition sets the metres.** Width (m) and Height (m) live in Build Settings > Terrain. The panel shows
Real Scale (m/px at the build resolution) and the Height-Scale Ratio. Heights are 0–1 times Height, and the ratio is
Height/Width. The default world is 5,000 × 2,500 m (ratio 0.5). [DEV S1 build-options/terrain.md,
dimensions-and-scale.md]
Ours is 128,000 × 8,546 m, ratio 0.0668, saved as `Terrain.Width`, `Height` and `Ratio` [S15].

**F3.2 Set scale before tuning.** QuadSpinner's planning guide says to fix width, height and resolution first, and to
"stop if you are changing Terrain Definition after masks and erosion are finished". [DEV S1
plan-scale-height-resolution.md]
In Gaea 1, terrain scale only changed processing for nodes with Real Scale on (Erosion, Snow, Thermal) [DEV Gaea 1, S9].
In Gaea 2, Thermal still has a Real Scale toggle, and Thermal2's Feature Scale is in metres [DEV S1 .flubs].

**F3.3 2× exaggeration changes every angle the graph uses.** With Height doubled, a real slope θ is stored as
atan(2·tan θ). Slope selectors, Thermal talus angles and Erosion2 discharge angles all see the exaggerated slope.
[INFERRED from F3.1]

| Real slope | 2° | 5° | 10° | 20° | 24° | 30° | 35° |
|---|---|---|---|---|---|---|---|
| Stored at 2× | 4.0° | 9.9° | 19.4° | 36.1° | 41.7° | 49.1° | 54.5° |

So a Thermal2 talus Angle of 35° on the 2× project flattens slopes that are really only ~19°.
*Rule:* tune at one exaggeration and never change it afterwards (F3.2). Convert real angles with the table. Or build at
true Height (`heightMetres`) and exaggerate only for viewing (open question Q4).

**F3.4 What reads at 125 m/px.** Detection needs ~2 px (250 m) and shape recognition ~4 px (500 m) [track A A6.1].
[INFERRED from A6.2 and A1.4]
- **Reads:** escarpment relief, fault benches and tilted blocks (1–5 km = 8–40 px), the bajada belt, the volcano and its
  radial gullies, the dome, terrace belts as bands, large wash corridors.
- **Doesn't read:** dunes, salt polygons, travertine rims, lava-flow fronts (metres to tens of metres), switchbacks, fan
  distributaries.
At this scale erosion features are ravines hundreds of metres to kilometres wide, so set Erosion Scale for that and keep
fine detail out (low Shape Detail Scale).

**F3.5 What reads at a ~15 m/px close-up, and where the data runs out.** A 16 km frame at 1024 px gives 15.6 m/px. There,
dunes (wavelengths of hundreds of metres), exaggerated salt polygons, rimstone steps of 30–60 m, flow fronts, washes and
road cuts all read. But Azgaar's input is far coarser:
- the bake is ~0.5 km per sample, about 32 px per sample;
- a 2.3 km cell is ~150 px, so mask edges become long straight polygon sides.
All close-up detail is procedural. Mask edges must be broken up with a Warp modifier, Blur and selectors, or they read
as polygons. [INFERRED from track D 2.11 and S14]

**F3.6 Community can't zoom inside Gaea, so close-ups come from the map.** The editions page lists Community at 1024 ×
1024 builds, with **no Regions, no split or tiled builds and no automation**. The download page adds that Community can
"create and view terrains up to 4096 x 4096". [DEV S3, S4, S6]
Regions are Gaea's documented way to rebuild part of a terrain at higher density [DEV S1 regions/index.md], and they
are not available to George. A close-up therefore means a new small Azgaar frame exported with `export_gaea`, plus a
copy of the project pointing at it. [INFERRED]

**F3.7 Keep the whole height pipeline 32-bit.** Use r32 or EXR in and EXR out. QuadSpinner traces stair-step banding to
16-bit exports, says 8-bit PNG for real terrain shows "obvious" banding, and puts 8-bit at masks only. Mask banding is
fixed with dithering or blur. [DEV S1 terrain-quality.md, format-gotchas.md, file-formats.md]
`.r32` is a headerless 32-bit float, square, 0–1 [DEV S1 file-formats.md], which matches our export [S14].

**F3.8 Constant + Match pins heights to metres.** QuadSpinner's documented way to make imported data top out at X metres
is `Constant(X m) → File (unclamped) → Autolevel → Match` [DEV S1 match-height.md].
*Use:* a close-up tile is normalised to its own maximum (F1.3). To compare it with the regional tile in the same metres,
set its Terrain Height from its own `gaea.json`, or match it to a Constant. [INFERRED]

**F3.9 Resolution changes results.** Erosion relies on grid size, so the same graph differs between 512 and 1024 px.
Erosion2 is tuned to reduce this. To lock a shape, bake the node at a resolution you like. [DEV S1 non-determinism.md;
Gaea 1 S8: "preserves features across different resolutions"]
*Rule:* preview at the build resolution (1024) before judging; don't tune at 512 and build at 1024.

---

## 4. Recipes: from landform to node chain

Each recipe names its driving mask, the chain in order, starting values at 125 m/px and at ~15 m/px, and what goes wrong.
All are **INFERRED**: node behaviour from DEV docs, geology from track A, mask facts from §1. Values are starting points
to tune in the viewport, not tested settings. "×" means intersect two masks (Combine Multiply), "∪" means union (Combine
Max), and "shrink n" means Dilate with Invert, or Blur followed by Threshold.

**F4.0 The skeleton every recipe hangs on.**
1. Read the inputs: `File heights`, `File <mask>` for each mask.
2. Clean the heights lightly: Blur 1 px or Denoise, so facets don't drive gullies (F1.9).
3. One **macro Erosion2** pass: large Erosion Scale, short Duration, low Downcutting. Feed its Precipitation input with
   the inverse of `gaea-protect`, so no rain starts on the pan or lakes (F2.5).
4. **Landform branches** in drawing order (P10): escarpment → basalt → fans and washes → terraces and gypsum → pan → acid
   dome → volcano → city and roads. Each branch is `effect → Mask node (second input = branch input) with its prepared
   mask`, chained one after the other.
5. A final light Thermal2 and small-scale Erosion2 to unify the surface.
6. **Restore** protected ground: the "Heights" Combine with a shrunk `gaea-protect` × Slope < ~2° real.
7. **Colour branches**: SatMap base → per-landform CLUTer or Tint under the same masks → Weathering → the map-colour
   Combine → export.
Reason: QuadSpinner's order (macro, then erosion, then surface) [DEV S1 design-low-first.md] plus F2.5–F2.7.

**F4.1 Rift escarpment with stepped fault benches and strata.**
- *Mask:* `biome-rift-escarpment` × Slope (real 8–40°, i.e. 16–59° at 2×), warped and blurred 2–4 px.
- *Chain:* Terraces (few steps) or FractalTerraces (Apply Tilt) for fault benches → Stratify (Tilt Amount and Direction
  so strata dip away from the rift, the half-graben footwall [A1.2]) → Sandstone or Shear for exposed layers → Crumble
  on the lip (Edge, Rock Hardness) → Thermal2 for talus aprons at the foot.
- *At 125 m/px:* benches every 1–5 km (8–40 px; real tilted blocks are 1–5 km [A1.4]), 3–5 benches across the relief
  zone. Strata Spacing makes visible bands only where they are ≥ 2–3 px apart.
- *At 15 m/px:* add a second Stratify at finer Spacing, plus Outcrops at the lip.
- *Goes wrong:* even stair-steps read as rice paddies, so keep Uniformity low. Terraces quantise by height, so benches
  ring the volcano too if the mask leaks. Over-erosion cuts notches through the city shelf (F6.5). The segmented
  en-echelon margin [A1.7] must come from the map, not from Gaea.

**F4.2 Dark young basalt and older weathered basalt.**
- *Masks:* `biome-recent-basalt` (it includes the volcano's flanks, F1.6, so add × Height < the cone's base when working
  the plain) and `biome-old-basalt`.
- *Chain, recent:* Rugged or Craggy at low Depth → Roughen → Dilate and Distance on the mask edge to raise lobes a few to
  ~20 m with steep fronts (15 m/px only) → colour with Tint or CLUTer, near-black to dark grey, low saturation.
- *Chain, old:* Thermal2 (rounded) → Weathering (Washed Out, more Creep) → CLUTer, dark brown to rust, a little lighter.
- *125 m/px:* colour and roughness only; flow fronts won't read.
- *15 m/px:* lobes, pressure ridges (Craggy) and Stones.
- *Goes wrong:* old and young basalt look the same if only roughness differs. Contrast in tone carries the age, since
  "young lava is darker" [A1.10]. Rugged on the cone hides its gullies, so mask it off the cone.

**F4.3 Dead-flat salt pan with polygonal halite crust and brine pools kept flat.**
- *Masks:* `biome-salt-flats` × Slope < 1–2° real (removes the steep edge slivers, F1.7); pools from
  `lakes-other`/`lakes-acid` shrunk 1–2 px.
- *Chain:* protect from erosion (precipitation mask + restore Combine) → Cracks × 3 octaves (Style Normal; halve Scale
  each time, the documented "nested patterns" technique) with a Warp modifier → Combine **Subtract** at tiny depth under
  the pan mask → pools flattened back to their median level with the Height Picker or Constant → colour: white/very pale
  CLUTer, crack lines a touch darker or browner from the Cracks output, pools from WaterColor (Custom palette).
- *125 m/px:* no relief at all, colour only. The pan must stay the lowest ground (P19).
- *15 m/px:* polygons exaggerated to ~50–150 m with rims of 0.5–2 m. Real crusts are far smaller (not sourced here).
- *Goes wrong:* subtracting cracks drops the pan below the pools, or lets erosion find the cracks. Always add the cracks
  after the last erosion. Hard binary masks make a terrace at the pan edge, so feather them.

**F4.4 Gypsum dunes.**
- *Mask:* `biome-gypsum-dunes`, Blurred so the dunes ramp down at the edges.
- *Chain:* Sand (Direction = downwind of the gypsum source, from the wind angles in `config.json` [A3.6]; Warp by Terrain
  on; Height kept low) → Mask node → colour near-white to pale cream.
- *125 m/px:* colour only. Sand would alias into noise.
- *15 m/px:* Sand Scale for dune spacing of a few hundred metres. DuneSea is a whole-tile generator, so use it only
  through a Combine Add under the mask.
- *Goes wrong:* dunes facing the wrong way; dunes on slopes because the mask included edge pixels; white dunes merging
  into the white pan with no tone step between gypsum and halite.

**F4.5 Fossil reef limestone terraces and ledges.**
- *Mask:* `biome-fossil-terraces`, which already sits in a narrow height band (79–256 m, F1.6) along the old shore [A3.7].
- *Chain:* Terraces (4–6 steps, matching "at least four stacked units" [A3.7]) or FractalTerraces (Protect Range) →
  Sandstone (Chipped) for ledges → Thermal2 for small talus → colour: cream and buff limestone, with Weathering for dark
  lines under ledges.
- *Why Terraces fits:* it steps by height, so the terraces follow contours, which is the old-shoreline rule.
- *125 m/px:* steps ≥ 2–4 px wide, or they vanish.
- *15 m/px:* add Outcrops (low Density) as reef heads.
- *Goes wrong:* terraces crossing contours because Stratify's Tilt is used here; a stair look from too uniform steps.

**F4.6 Alluvial fans and gravel bajada.**
- *Masks:* `biome-gravel-flats` ∪ a band at the escarpment foot (Dilate of the escarpment mask, minus the escarpment).
  Fan apexes sit where `mask-rivers` and gullies leave the escarpment.
- *Chain:* Erosion2 pass with high Coarse Sediments and Bed Load, at their default discharge angles ("coarse sediments …
  alluvial fans", F2.3), or the 2.3 No Erosion mode with Extra Deposits to deposit without cutting → use the Deposits
  output as the gravel colour mask → CLUTer, tan to grey gravel, darker at apexes.
- *125 m/px:* the bajada reads as one belt [A3.2]; single fans read only below the largest catchments.
- *15 m/px:* Anastomosis (Flows, low Impact) for distributary channels.
- *Goes wrong:* fans everywhere, when the biggest fan belongs under the biggest catchment [A3.3]; deposits burying the
  Slums terrace; colour driven only by Flow, which looks CG (F2.10).

**F4.7 Mineral washes (dry braided channels).**
- *Masks:* `mask-washes` (lines, 3.4 px) ∪ `biome-mineral-washes`.
- *Chain:* Dilate the lines 1–3 px → Anastomosis (Flooding or Flows, low Depth) under the mask, or Combine Subtract of
  the Blurred lines a few metres deep → Sediments (Fine) to fill → colour: pale mineral white with rust and ochre streaks,
  using FlowMap *inside* the mask only.
- *125 m/px:* a shallow corridor, mostly colour.
- *15 m/px:* braided threads from Anastomosis; check they still run downslope to the pan.
- *Goes wrong:* channels cut uphill (the line is the map's, so keep the cut shallow and let gravity read from the map);
  washes ending short of the pan they drain to.

**F4.8 Hydrothermal acid dome with stepped travertine and sulfur terraces and vivid pools.** George's rule: the acid pits
must really stand out (P20).
- *Masks:* `biome-acid-pits`, `biome-sulfur-crust`, `lakes-acid` (7 pools, flat at 4–16 m, F1.6). Also a "ring" mask:
  Distance from `lakes-acid`, banded with Threshold.
- *Relief chain:* the low dome comes from the map (27–55 m, matching Dallol [A3.9]) → Terraces with many small steps,
  only on `acid-pits` × Slope > 0.3° real → shrunk pools Combined back to flat at their own levels. Pools sitting at
  different step levels read as rimstone.
- *Colour chain,* from Dallol's white → green → yellow → orange → ochre [A3.9]:
  - pools: saturated emerald, turquoise and yellow-green (CLUTer, or Synth from a reference photo);
  - rings near the pools: white salt, then sulfur yellow (`sulfur-crust` mask);
  - outer rings: orange and ochre iron (Distance bands);
  - Combine at Ratio 1.0, so the map's flat colour doesn't wash it out.
  - To make it pop, cut saturation slightly on everything *outside* the acid masks (HSL under the inverse mask), rather
    than oversaturating the pits.
- *125 m/px:* colour rings and pools only.
- *15 m/px:* terraces of 2–4 px steps (30–60 m, exaggerated).
- *Before era:* the same masks with white travertine and clear blue-green pools.
- *Goes wrong:* acid colours bleed over the whole dome when the field is painted as one flat colour (the present graph's
  85% map-colour Combine does exactly that); pool edges drop into the cracks of the pan; terraces on the pan.

**F4.9 Volcanic cone with crater and lava lake.**
- *Masks:* `biome-recent-basalt` × Height > the cone's base for the cone, and the lava-lake component of `lakes-other`.
  Isolate it with a Shape or Draw mask at the summit until the export splits lakes (Rec. 9).
- *Chain:* Erosion2 on the cone with Precipitation on the cone (radial gullies) → Thermal2 for cinder talus → crater:
  the map's pit, or a Crater node (Style New, Rim Sharp, placed with the gizmo) combined Min → lava lake: Combine Max with
  a Constant at the chosen lake level under the shrunk lake mask (flat), coloured with Tint black-red → orange-yellow →
  dark basalt colours down the flanks.
- *125 m/px:* cone, gullies and a crater a few px wide.
- *15 m/px:* rim detail, spatter, Stones.
- *Goes wrong:* the present ~2 km deep pit (F1.8) gets eroded into a huge caldera. Decide in the map whether the pit is
  intended. Don't add a second cone (Volcano node) on top of the map's.

**F4.10 City shelf and terraces (flattened platforms) and roads as carved tracks.**
- *Masks:* the export has **no settlement mask**. Until it does, use a Height selector band around the shelf (and the
  Slums terrace) × a hand-placed Shape near the city. Roads use `mask-roads`.
- *Shelf chain:* Combine Blend of the terrain with a Constant at the shelf level (sample it with the Height Picker) under
  a feathered shelf mask, or with a heavily Blurred copy of the terrain (smooths but doesn't flatten) → Stratify Masked
  off the shelf so the cliff behind it keeps its layers.
- *Road chain:* Blur(`mask-roads`) → Combine Subtract of 1–5 m, plus a local Blur of the terrain under the road mask to
  bench the switchbacks → pale dust colour.
- *125 m/px:* roads are 2.6 px (≈ 320 m) wide, so carve nothing and show them as colour only.
- *15 m/px:* the same 2.6 px is ≈ 40 m, a plausible cut-and-fill track zone.
- *Goes wrong:* a shelf flattened at the wrong height cuts a step into the falls; road cuts trench straight up the
  escarpment, because the map's route vertices are kilometres apart at close-up.

**F4.11 Waterfall slot.**
- *Masks:* `mask-rivers` × `biome-rift-escarpment` (the stream where it crosses the scarp [A2.10]). The Slums Falls
  marker isn't exported (Rec. 9).
- *Chain:* Dilate 1 px → Distance (a V or slot profile from the line) → Combine Subtract of 50–150 m at the lip, fading
  downstream → a small flat plunge pool (Constant under a Shape) → Crumble (Edge) on the slot walls.
- *125 m/px:* a notch ≥ 2 px wide.
- *15 m/px:* Canyon's Slot control is an alternative for the gorge, but Canyon is a generator, so mask it hard.
- *Goes wrong:* a slot on a straight un-notched lip ("falls cut back into the scarp" [A2.10]); erosion widening the slot
  into a valley.

---

## 5. Driving Gaea safely

**F5.1 The `.terrain` format.** [OBSERVED S15; DEV S1 file-formats.md]
- It is Newtonsoft JSON with `$id`/`$ref` identity, so `Parent` points back to its node by `$ref`.
- Nodes live in `Assets.$values[0].Terrain.Nodes`, keyed by an integer id as a string. Each has `$type`
  (`QuadSpinner.Gaea.Nodes.<Node>, Gaea.Nodes`), `Id`, `Name`, `Position`, `Ports.$values` and `Modifiers`.
- An input port carries `Record {From, To, FromPort, ToPort, IsValid}`. Port names include `In`, `Out`, `Input2`, `Mask`,
  `Precipitation`, `Flow`, `Wear`, `Deposits`.
- An export sits on the node as `SaveDefinition {Node, Filename, Format, IsEnabled}`.
- **Properties left at their default are omitted.** The saved Erosion2 stores only `Seed` and `Version`, and Combine
  omits `Mode` when it is Blend.
- The file also holds `BuildDefinition` (Resolution 1024, Destination, ColorSpace), `State` and `Metadata`
  (Version, Edition).
- QuadSpinner documents the format only as "the main graph file format".

**F5.2 Learn a property name by saving it.** UI labels are not file names: "File" is saved as `FileName`, "Is RGB" as
`IsRGB`, "Relative Path" as `RelativePath`, a colour Combine as `RenderIntentOverride: "Color"`, and Max mode as
`"Mode": "Max"`. [PROJECT S18; S15]
*Method:*
1. Change the one value in the UI.
2. Save.
3. Diff the `.terrain` against the copy in git.
4. Write the learned name into the skill's name table.
Docs-visible names (F2.4) are candidates only until a save confirms them.

**F5.3 Edit the file conservatively.**
- Add nodes with unique `$id`s and new integer ids, and keep `Version` fields.
- Set enums by their exact text.
- Keep `Ratio` = Height/Width.
- Commit before every edit.
- If a file won't open, use File > Repair, which "re-containerize[s]" the file [DEV S1 common-errors.md].
- QuadSpinner advises backing up `.terrain` files before opening them in a newer version [DEV S1 blog/archive/gaea-2-0-6.md].
- Gaea 2 can import a graph from another `.terrain` and import/export graph fragments (`.tfrag`) [DEV S11]. That may be
  a safer way to add a recipe block than hand-writing JSON, but the fragment format is undocumented (open question Q6).

**F5.4 Reopen the project to apply edits; File nodes re-read their files on reopen or refresh.** [PROJECT S18; DEV S1
graph-toolbar.md, keyboard-shortcuts.md, managing-input-and-output.md]
- The reliable route was: edit the JSON, then reopen with Ctrl+O.
- File nodes re-read their files on reopen, or on Refresh: F5 refreshes a node; right-click "Refresh Node" for "Refresh
  all nodes".
- File-node caching is off by default. If it is on, use Purge Cache or Never Cache.
- 2.2 fixed a File node that showed cached data when its file was missing [DEV S1 2.2.0.0], so a missing mask may not
  error loudly.

**F5.5 Gaea 2's command line differs from Gaea 1's.**
- Builds run through `Gaea.Swarm.exe --Filename "<.terrain>"`, with `-p|--profile`, `-r|--region`, `--seed`,
  `--ignorecache`, `--verbose`, and variables as `-v key=value`. `-v` must come last and repeats for each variable; the
  alternatives are `--va` (all values) and `--vars file.json|.txt`.
- Build Options has **Copy Command Line**, which QuadSpinner says to start from.
- `Gaea.exe` takes `-Path`, `-NoStart`, `-CPUOnly`, `-SafeMode` and `-Verbose`.
- QuadSpinner's automation advice: "do not edit the .terrain file for every build"; use variables. [DEV S1 cli/index.md,
  command-line-automation.md, automation/index.md]
- Gaea 1 used `Gaea.Build.exe` with different switches [DEV Gaea 1, S10]. Don't mix the two.

**F5.6 The Community edition can't use that automation.**
- The editions table marks Automation, Variables + Expressions and Regions as Professional and Enterprise only.
- The Macros page agrees: Professional and Enterprise include "Variables and Expressions, and Automation".
- Indie can only use macros. Community has no macros, no tiled builds, and a 1024 build. [DEV S6, S1 building-macros.md]
- Whether `Gaea.Swarm.exe --Filename` builds a Community file at all (without variables) is **not documented**. The UI
  itself uses the Swarm in the background [DEV S1 build-swarm/index.md].
*Rule:* don't build the skill on CLI builds. Use edit → reopen → build in the UI, and treat a CLI build as an optional
test (Q5).

**F5.7 The licence: the Community edition is non-commercial.** [DEV S5, S7, S6. Not legal advice]
- The EULA (Jul 2025) §1.4.1: the Community Edition may be used "without a license for noncommercial purposes".
  "Noncommercial" is not defined.
- The FAQ: "Commercial use is not allowed with … the Community Edition."
- The user owns the outputs (§2).
- §1.3.3 bars bots and scripts, but excludes automation for "internal production pipelines".
- §1.3.4 bars using the software or its assets to train AI.
- Indie ($99) is capped at under $100K revenue; Professional ($199) adds automation and Regions [S6].
Our use is pre-production visualization that never ships (P2), but that does not by itself make it noncommercial if the
game is a commercial product. That is George's call (Q1).

**F5.8 Computer-use lessons from George's sessions.** [PROJECT/OBSERVED S18]
- **Never launch Gaea** with the computer-use `open_application` tool: it spawned extra instances. Work only in the
  instance George has open.
- The `Gaea.viewport` process can't be granted, so clicks work only while the **main Gaea window is in front**.
- The Claude desktop window can cover the properties panel. Ask George to move it.
- Right-clicking empty graph space opens the node search. Tab does too [DEV S1 toolbox-and-search.md].
- The reliable route is **JSON edit + Ctrl+O reopen**, after learning property names by a UI change and a save (F5.2).
  UI clicking is for learning names and for looking, not for building graphs.

**F5.9 Keeping the project in sync with the map.**
- The graph reads fixed file names at absolute paths (`C:\Users\jorge\ARPGMapTools\world\build\gaea\now-act1\`), so a
  rebuild of the map only needs a reopen or refresh [S15, docs/gaea.md].
- QuadSpinner recommends keeping inputs beside the project, using relative paths, and testing a copied folder [DEV S1
  portable-file-node-paths.md]. File nodes support Relative Path.
- For `before-act1`, keep a copy of the project per era, or switch the paths with one scripted JSON edit; Professional's
  variables would do it from the CLI.
- **Pin Gaea 2.3.1.0** the way Azgaar is pinned (P4). The project records its version. Gaea 2 is supported "through end
  of 2027" [DEV S12], and Gaea 3 is in development.

**F5.10 Make builds land somewhere predictable.** The saved destination `<Builds>\[Filename]\[+++]` makes a new numbered
folder on every build. For checks, turn on "Maintain a static folder with the latest copy", or use a fixed destination.
Turn on "Copy the .terrain file to the build folder", so every build is traceable. [DEV S1 build.md, roundtrip.md;
S15]

---

## 6. Checks and failure modes

**F6.1 Gaea's own viewers.** [DEV S1 measurement-tools.md, visualizing-scale.md, 2.2.0.0; S15 State]
- The 3D viewport (Realistic mode, AO, shadows) and the 2D viewport.
- Viewport mask colour palettes (2.2).
- The **Height Picker**: metres, percent and raw 0–1 at a point. Use it for pool levels, pan flatness and the shelf
  level.
- The **Measurement Tool**: 2D and 3D distance.
- Custom overlays and a 3D scale block (Constant → Transform at e.g. 25 m) to judge size.
- `B` bypasses a node; Lock Preview keeps a downstream view while you edit upstream.
- Render the Shade or Cartography nodes for top-down comparisons.

**F6.2 Check the built heights with numbers, not only by eye.** Load the exported Heights EXR and the input
`heightfield.r32` (both 0–1, both 1024², F1.1) in a Python script and compute per mask:
- |Δh| inside the shrunk protect mask (should be ≈ 0);
- the height standard deviation inside each shrunk lake (≈ 0);
- the pan minimum, which must stay the tile's lowest land (P19);
- the maximum cut depth on the escarpment and shelf;
- the share of pixels changed by more than X m.
[INFERRED; formats DEV S1 file-formats.md]
This catches erosion eating protected ground before anyone looks.

**F6.3 Compare against the same view of the map.** Render the tile in the repo's terrain viewer (`render_region`,
overview, low and top cameras, 2× exaggeration) and Azgaar's `screenshot_3d`, then set Gaea's camera to match. Compare a
Gaea top-down Shade with the Azgaar `screenshot` of the same box. Check against `world/reference/act1-overview.jpg` for
mood only: it is inspiration, never geometry (P6). George wants before and after views, in 3D too (P9).
[PROJECT CLAUDE.md, E P6/P9; INFERRED method]

**F6.4 Failure modes and their fixes.** [Sources per row]

| Failure | Cause | Fix | Source |
|---|---|---|---|
| Erosion eats protected features (pan, pools, shelf) | Erosion runs everywhere; a Combine restores only where the mask is white | Rain mask (Precipitation) plus a restore Combine with shrunk masks; F6.2 Δh check | DEV S8, S13; S15 |
| Escarpment slivers frozen flat, or pools with walls | Mask and heightfield misregistration at the edges | Shrink lake masks 1–2 px; × Slope selector | OBSERVED F1.7 |
| Polygon or stair edges along biome borders | Binary cell masks with Voronoi edges; 150 px straight sides at close-up | Blur 2–4 px, Warp modifier, intersect with Height/Slope selectors | SOURCE F1.2; DEV S1 using-modifiers.md |
| Terracing or banding in heights | 8- or 16-bit heights somewhere in the chain | 32-bit r32/EXR end to end; Heal for damaged data | DEV S1 terrain-quality.md, heal.md |
| Banding in colour blends | 8-bit masks with few grey levels | Blur or dither the mask; feathered masks | DEV S1 format-gotchas.md |
| Over-erosion at 128 km | Long Duration or high Downcutting carves km-wide gullies through drawn landforms | Short passes, large to small scale, low Downcutting, Shape low | DEV S2 |
| Slopes wrong after changing exaggeration | Angles are computed on the exaggerated heights | Fix the exaggeration first; convert angles (F3.3) | INFERRED F3.3 |
| Flat-topped peaks | Combine Add past 1.0, clamped | Output None + Autolevel/Clamp, or Max | DEV S1 combine.md |
| Gaea rivers that don't match the map | Rivers invents networks | Don't use Rivers regionally; Headwaters from `mask-rivers` at close-up | DEV S1 rivers.md |
| Edge walls or seams at the tile border | Effects reading off-tile; per-tile normalisation | Edge node at the border; normalise once, never per tile | DEV S1 edge.md, normalized-output.md |
| A CG look | Flow output used as the main texture | Use data maps and SatMap/CLUTer; Flow only inside wash masks | DEV Gaea 1 S8 |
| Acid field reads as flat paint | 85% map-colour Combine over the whole field | Dedicated acid colour branch (F4.8) | SOURCE S15; PROJECT P20 |
| Silent stale input | Old mask files left on disk; File cache | Check against the `gaea.json` list; Purge Cache | SOURCE F1.4; DEV S1 2.2.0.0 |
| Relief jumps between builds | `heightMetres` changed, Terrain Height didn't | Check `2 × heightMetres` after each export | SOURCE F1.3 |
| Paths break on another machine or era | Absolute File paths | Relative paths or one scripted path switch | DEV S1 portable-file-node-paths.md |

---

## Recommendations for the skill (ranked)

1. **"Azgaar places, Gaea details" as a hard rule.** Every Gaea change is driven by an exported mask or a selector on the
   exported heights. A Gaea change that moves a landform, a water body or a drainage line is a map change, so it goes
   back to Azgaar as an op (P1, P3). Never run Rivers or Lake on the regional tile (F2.8).
2. **Drive Gaea by editing `tools/gaea/*.terrain` and asking George to reopen it** (F5.1–F5.4, F5.8). Learn every new
   property name by one UI change and a save, and record it in a name table in the reference. Never launch Gaea, and work
   only in George's open instance with its main window in front. No CLI dependence on Community (F5.6).
3. **Check the inputs before touching the graph:** the `gaea.json` mask list against the files, non-empty graph masks,
   `2 × heightMetres` = Terrain Height (F1.2–F1.4).
4. **Fix the exaggeration once (2× today) and convert every angle** with the F3.3 table. Tune at 1024, the build
   resolution (F3.9).
5. **Use the F4.0 skeleton and the recipe table below**, chaining branches with Mask nodes, and keep erosion protection
   as rain mask plus restore Combine with shrunk masks (F1.7, F2.5).
6. **Make the acid field the loudest thing in the tile** with its own colour branch (F4.8), and judge it against the
   rest at the same exposure (P20).
7. **Check with numbers, then with eyes:** the F6.2 script after every build, then matched views against the terrain
   viewer and Azgaar (F6.3), with before and after for both eras (P9).
8. **Close-ups come from a new small Azgaar frame exported at 1024** (~15 m/px for a 16 km box), never from Gaea Regions
   on Community (F3.6). Expect polygonal masks there, and break them up (F3.5).
9. **Ask track D / the tool owner for export additions:**
   - a settlement-footprint mask (`mask-burgs`) and a marker mask (falls, springs, vents);
   - one mask per named lake or lake group, so the lava lake and each pool can be levelled separately;
   - clearing stale files on export;
   - soft (anti-aliased) biome masks;
   - mask names read from config instead of hard-coded (D G5).
10. **Flag map issues seen through Gaea** instead of hiding them in Gaea: the ~2 km lava-lake pit (F1.8) and salt-flat
    cells on steep ground (F1.7).
11. **Pin Gaea 2.3.1.0** next to the Azgaar pin, and commit the `.terrain` before every edit (F5.3, F5.9).
12. **Say what's exaggerated.** The acid field is ~60× Dallol (F1.10), and pools and the lava lake are oversized
    (A6.3). Environment art must not read Gaea sizes as literal.

### Proposed `references/gaea.md` outline

1. **Contract.** What the export contains (F1.1–F1.2), what the graph reads, the rule (Rec. 1), the never-ships rule (P2).
2. **Pre-flight checks.** Mask list, empty masks, `heightMetres` vs Terrain Height, stale files, paths for the era.
3. **Driving Gaea.**
   - The `.terrain` anatomy (F5.1).
   - The property-name table: learned names, the date each was confirmed, the version (F5.2).
   - The edit, reopen and refresh loop (F5.4).
   - The computer-use rules (F5.8).
   - What Community can't do (F5.6), and the licence note (F5.7).
4. **Scale card.** Terrain Definition, the exaggeration and angle table (F3.3), what reads at 125 vs 15 m/px (F3.4–F3.5),
   the close-up procedure (F3.6, F3.8).
5. **Node cheat-sheet.** A trimmed version of F2.2: the 30 nodes we use, with exact names and key properties.
6. **Graph skeleton** (F4.0) and **mask preparation** (shrink, feather, warp, × selectors).
7. **Recipe cards** (F4.1–F4.11), each with: mask, chain, values at both scales, failure modes, and a check.
8. **Checks.** The F6.2 script, the matched views (F6.3), the failure table (F6.4).
9. **Changelog of the saved graph.** What each node in `act1.terrain` is for, and why.

### Recipe table (summary of §4)

| Landform | Driving mask (+ selector) | Node chain (in order) | 125 m/px | ~15 m/px | Main risk |
|---|---|---|---|---|---|
| Escarpment benches and strata | rift-escarpment × Slope | Terraces/FractalTerraces → Stratify (tilt) → Sandstone/Shear → Crumble → Thermal2 | Benches 8–40 px apart | + fine Stratify, Outcrops | Rice-paddy steps; leaks onto the cone |
| Young / old basalt | recent-basalt (× Height < cone base), old-basalt | Rugged/Craggy → Roughen → (lobes) → dark Tint / Thermal2 → Weathering → rust CLUTer | Tone and roughness | + lobes, pressure ridges | Same look for both ages |
| Salt pan, crust, pools | salt-flats × Slope < 1–2°; lakes shrunk | Protect → Cracks ×3 (Warp) → Subtract (tiny) → flatten pools → white CLUTer + WaterColor | Colour only, flat | Polygons 50–150 m, 0.5–2 m rims | Pan no longer lowest; erosion in cracks |
| Gypsum dunes | gypsum-dunes (blurred) | Sand (downwind, Warp by Terrain) → Mask → pale CLUTer | Colour only | Dunes a few 100 m apart | Wrong wind; merges into the pan |
| Fossil reef terraces | fossil-terraces | Terraces (4–6) → Sandstone (Chipped) → Thermal2 → cream CLUTer + Weathering | Steps ≥ 2–4 px | + Outcrops as reef heads | Terraces crossing contours |
| Fans and bajada | gravel-flats ∪ escarpment-foot band | Erosion2 (Coarse + Bed Load, or NoErosion + Extra Deposits) → Deposits → gravel CLUTer | One belt | + Anastomosis distributaries | Fans everywhere; buried Slums |
| Mineral washes | washes (dilated) ∪ biome-mineral-washes | Anastomosis (Flows/Flooding) or shallow Subtract → Sediments (Fine) → streak colour | Shallow corridor | Braided threads | Channels cut uphill |
| Acid dome, terraces, pools | acid-pits, sulfur-crust, lakes-acid, Distance rings | Terraces (many, small) → flat pools → CLUTer rings (white, yellow, orange, ochre; emerald pools) → desaturate outside | Rings and pools | Steps 30–60 m | Flat paint; colour bleed |
| Volcano, crater, lava lake | recent-basalt × Height; lava-lake component | Erosion2 (rain on cone) → Thermal2 → (Crater) → Combine Max flat lake → glowing Tint | Cone, gullies, crater | Rim detail, spatter | The ~2 km pit; a second cone |
| City shelf and roads | Height band × Shape (no burg mask yet); roads | Combine to Constant level (feathered) → Stratify off-shelf; Blur(roads) → Subtract 1–5 m + local blur | Colour only for roads | Cuts and benches | Shelf step through the falls |
| Waterfall slot | rivers × rift-escarpment | Dilate → Distance → Subtract 50–150 m → plunge pool → Crumble | Notch ≥ 2 px | Slot gorge (Canyon Slot) | Slot on a straight lip |

---

## Open questions for George

1. **Licence.** The Community edition is "noncommercial" (EULA §1.4.1, FAQ). Is using it for pre-production of a game you
   intend to sell OK by you, or do you want Indie ($99) or Professional ($199, which adds automation, variables and
   Regions)? Only you, or QuadSpinner support, can settle this (F5.7).
2. **Close-ups.** Do you want ~15 m/px close-up tiles at all (a new small frame per place: city shelf, acid dome,
   falls), and which places first (F3.6)?
3. **The lava lake.** Is the ~2 km-deep summit pit intended (a dramatic caldera), or should the map raise the lava lake
   to near the rim (F1.8)?
4. **Exaggeration.** Keep the 2× Terrain Height for both tuning and viewing, or tune at true height and exaggerate only
   in screenshots (F3.3)?
5. **CLI test.** Would you run one test to see whether `Gaea.Swarm.exe --Filename "…\act1.terrain"` builds on Community?
   If it does, builds could run without clicking (F5.6).
6. **Graph fragments.** Should we try `.tfrag` graph fragments (one per recipe) as the way to add recipes, instead of
   hand-written JSON (F5.3)?
7. **Acid look.** Should the acid colours follow real Dallol (white, green, yellow, orange, ochre) pushed brighter, or
   is there an art-direction palette (for example from concept art) the pits should match (F4.8)?
8. **Before era.** Should the before tile get its own saved project, or one project whose paths a script switches
   (F5.9)?

## Limits

- Recipes and parameter values are untested in Gaea. Expect to tune every number.
- Gaea 2.3.1.0's own release notes were not in the docs repo (it stops at 2.3.0.0). The download page dates 2.3.1.0 to
  24 Sep 2026 [S4].
- Defaults and slider ranges for most properties are not documented. Only the Erosion2 example table gives real values.
- The edition table was read through a text extraction, and some checkmarks were lost (Build Swarm and export bit depths
  by edition are "not stated").
- The EULA was read through a summariser (short quotes only).
- No community forum answers or Discord threads were found for our landforms, so nothing here is tagged COMMUNITY.

## Sources (read 2026-11-13)

- **S1** QuadSpinner, *Gaea 2 Docs* source, `github.com/QuadSpinner/Gaea2-Docs`, commit `dee36082` (25 Sep 2026),
  rendered at https://docs.gaea.app/. Pages cited by path under `source/`; node properties from `source/.flubs/*.json`;
  release notes in `source/history/`; blog in `source/blog/`.
- **S2** QuadSpinner, "Erosion_2", https://docs.gaea.app/using/using-gaea/understanding-erosion/erosion_2/index.html
- **S3** QuadSpinner, Compare editions, https://quadspinner.com/Compare
- **S4** QuadSpinner, Download, https://quadspinner.com/download (Community: "create and view terrains up to 4096 x 4096,
  and export up to 1024 x 1024"; 2.3.1.0 dated 9/24/2026)
- **S5** QuadSpinner, FAQ, https://quadspinner.com/support/faq
- **S6** QuadSpinner, Order / editions, https://quadspinner.com/Order/
- **S7** QuadSpinner, Gaea 2 EULA (Jul 2025), https://quadspinner.com/PDF/Gaea2-2025-07.pdf (summariser only)
- **S8** QuadSpinner, Gaea 1.3 docs, "Erosion", https://docs.quadspinner.com/Guide/Using-Gaea/Erosion.html
- **S9** QuadSpinner, Gaea 1.3 docs, "Scale", https://docs.quadspinner.com/Guide/Build/Scale.html
- **S10** QuadSpinner, Gaea 1.3 docs, "Build Swarm", https://docs.quadspinner.com/Guide/Build/Swarm.html
- **S11** QuadSpinner, Gaea 2 early-access change log, https://eadocs.quadspinner.com/change-log
- **S12** QuadSpinner blog, "What happens to Gaea 2.0?" (25 Nov 2025), S1 `blog/11-2025/what-happens-to-gaea-2-0.md`
- **S13** QuadSpinner blog, "Gaea 2.2 released", https://blog.quadspinner.com/gaea-2-2-released/ (S1
  `blog/07-2025/gaea-2-2-released.md`)
- **S14** This repo: `tools/azgaar-mcp/src/session.ts` L902–1044 (`exportGaea`), `tools/azgaar-mcp/src/index.ts`
  L457–485 (`export_gaea`)
- **S15** This repo: `tools/gaea/act1.terrain` (saved by Gaea 2.3.1.0 Community, 6 Nov 2026), `docs/gaea.md`
- **S16** This repo: `world/build/gaea/now-act1/` (export of 6 Nov 2026), measured with numpy/scipy, read-only
- **S17** Tracks A (`A_physical_geography.md` §1, 3, 6), D (`D_azgaar_and_tools.md` 2.11, G5) and E
  (`E_project_decisions.md`, P1–P26)
- **S18** George's computer-use sessions driving Gaea (Nov 2026), as relayed in this track's brief
- Blocked or not read: https://docs.quadspinner.com/ (root) and https://docs.gaea.app/ (root) (permission prompt
  unanswered); a third-party mirror of docs.gaea.app (refused); direct download from quadspinner.com (egress proxy).
