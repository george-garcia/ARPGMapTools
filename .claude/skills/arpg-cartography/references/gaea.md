# Gaea 2: turning the map's geology into 3D terrain

Load for any Gaea pass (shaping a tile, a close-up tile, colour, checks) and whenever an export or mask name changes.
Evidence: `docs/studio/research/cartography/F_gaea.md` (F1.1…F6.4; sources there; QuadSpinner's own Gaea 2 docs from
`github.com/QuadSpinner/Gaea2-Docs`). The recipes are **untested starting points** built from the node docs plus the
geology in `geography.md`: tune them in Gaea, and record what worked in §8. Rule IDs here are GA1…

## 1. The contract

- **GA1. Azgaar places, Gaea details.** Every Gaea change is driven by an exported mask or by a selector on the exported
  heights. A Gaea change that would move a landform, a water body or a drainage line is a **map** change: make it in
  Azgaar as an op (P1, P3), re-export, reopen. Never run Gaea's Rivers or Lake nodes on the regional tile: they invent
  drainage the map doesn't have. *DEV F2.8; PROJECT.*
- **GA2. The tile** (`export_gaea`, `docs/gaea.md`): `heightfield.r32` (32-bit, 0–1 = 0–`heightMetres`), `colormap.png`,
  `mask-water`, `mask-lakes-acid`, `mask-lakes-other`, `mask-rivers`, `mask-roads`, `mask-washes`, one
  `mask-biome-<slug>` per biome, and the two graph masks `mask-gaea-protect` and `mask-gaea-colour`; ~125 m/px for Act I.
  Only the two graph masks are feathered; the biome and lake masks are hard-edged cell masks. *SOURCE F1.1–F1.2.*
- **GA3. Gaea output never ships** and never goes into the game (P2). The saved projects live in `tools/gaea/`.
- **GA4. Flag map problems seen through Gaea; don't hide them in Gaea** — e.g. the summit lava lake bakes as a ~2 km
  deep pit, and some salt-flat cells sit on steep ground. *OBSERVED F1.7–F1.8.*

## 2. Pre-flight (before touching the graph)

1. The tile folder matches `gaea.json`'s file list; delete nothing, but ignore stale masks it doesn't list (the export
   never deletes old files). *SOURCE F1.4.*
2. The graph's masks aren't empty (renamed biomes or groups empty them silently: azgaar-ops M9).
3. **Terrain Height = 2 × `heightMetres`** (the project's fixed 2× exaggeration). `heightMetres` is recomputed per export,
   so a new export can make the project's relief jump: re-check it every time. *SOURCE F1.3.*
4. Commit the `.terrain` before editing it.

## 3. Driving Gaea

- **GA5. The `.terrain` file** is Newtonsoft JSON with `$id`/`$ref` identity. Nodes are in
  `Assets.$values[0].Terrain.Nodes`, keyed by integer id; each has `$type` (`QuadSpinner.Gaea.Nodes.<Node>, Gaea.Nodes`),
  `Id`, `Name`, `Position`, `Ports.$values` (input ports carry `Record {From, To, FromPort, ToPort, IsValid}`),
  `Modifiers`, and an export as `SaveDefinition {Node, Filename, Format, IsEnabled}`. **Properties at their default are
  omitted.** Keep `$id`s unique (renumber after inserting), keep each node's `Version`, set enums by their exact text,
  keep the terrain `Ratio` = Height / Width. *OBSERVED/DEV F5.1, F5.3.*
- **GA6. Learn a property name by saving it:** change the one value in the UI, save, diff against git, record the name in
  §7. UI labels are not file names; documented names are candidates until a save confirms them. *PROJECT F5.2.* After a
  JSON edit, ask George to open the copy and **Save As without changing anything**, then diff: a property that vanished
  was a wrong name or a default value. *INFERRED, round 2.*
- **GA6b. Write only what you can justify, safest first:** names confirmed by George's saves (§7) first; then names seen
  in real Gaea 2 saves on GitHub; then names from QuadSpinner's `Gaea2-Docs` property lists or a schema read out of the
  node library (e.g. the `gaea2-mcp` project) — each marked in the plan with its confidence and link. **Leave unconfirmed
  Float2, Color, gradient and list values unset** (a wrong shape can stop the file loading) and never write an enum as
  a number. *OBSERVED round 2; COMMUNITY reports.*
- **GA7. The working loop is edit the JSON → George reopens (Ctrl+O) → File nodes re-read their inputs** (F5 refreshes a
  node; right-click for "Refresh all nodes"). UI clicking is for learning names and looking, not for building graphs.
  *PROJECT F5.4.*
- **GA8. Computer-use rules** (from George's sessions): never launch Gaea with the computer-use open-application tool
  (it spawns extra instances) — work only in the instance George has open; clicks work only while the main Gaea window
  is in front (the `Gaea.viewport` process can't be granted); the Claude window can cover the properties panel (ask
  George to move it); right-click or Tab on empty graph space opens the node search. Release the computer-use lock at the
  end of each turn. *PROJECT/OBSERVED F5.8.*
- **GA9. Community edition limits:** builds max out at 1024²; no Regions, no automation, variables or macros (those are
  Professional / Indie). Whether `Gaea.Swarm.exe --Filename` builds a Community file is untested: don't depend on the
  command line. **Licence:** Community is for non-commercial use (EULA §1.4.1; the FAQ: commercial use isn't allowed);
  George's call (13 Nov 2026, P27): our use is non-commercial — dev visualization that never ships. *DEV F5.5–F5.7; PROJECT P27.*
- **GA10. Pin Gaea 2.3.1.0** like Azgaar (P4); the project records its version. Builds go to a predictable folder
  ("maintain a static folder with the latest copy"; copy the `.terrain` into the build). *DEV F5.9–F5.10.*
- **GA11. Eras:** one project per era, or one scripted path switch; paths are absolute today
  (`C:\Users\jorge\ARPGMapTools\world\build\gaea\<era>-act1\`). *F5.9.*

## 4. Scale

- **GA12. Fix the exaggeration once and convert every angle.** At 2×, a real slope θ is stored as atan(2·tan θ):

  | Real slope | 2° | 5° | 10° | 20° | 24° | 30° | 35° |
  |---|---|---|---|---|---|---|---|
  | Seen by Gaea at 2× | 4.0° | 9.9° | 19.4° | 36.1° | 41.7° | 49.1° | 54.5° |

  Slope selectors, Thermal talus angles and erosion discharge angles all see the stored slope: a 35° talus setting
  flattens slopes that are really ~19°. *INFERRED F3.3.*
- **GA13. What reads:** at 125 m/px a feature needs ~2 px (250 m) to show and ~4 px (500 m) to read as a shape; tune at
  1024, the build resolution (erosion results change with resolution). Keep heights 32-bit end to end (r32 / EXR).
  *F3.4, F3.7, F3.9.*
- **GA14. Close-ups come from the map, not Gaea:** a new small Azgaar frame (e.g. 16 km) exported at 1024 gives ~15 m/px.
  Its masks have straight polygon sides ~150 px long: blur, warp and intersect them with selectors. *F3.5–F3.6.*

## 5. The skeleton every recipe hangs on (F4.0)

1. Inputs: `File` heights; `File` per mask used.
2. Clean the heights lightly (Blur 1 px or Denoise) so facets don't drive gullies. *F1.9.*
2b. **Structural branches before erosion:** fault benches and strata on the escarpment (Terraces / Stratify under its
   mask) go in here, so erosion breaks the ledges up the way weathering does; surface detail comes after erosion.
   *INFERRED from round 2 (the baseline did this well); DEV F2.7 for surface-after.*
3. One macro **Erosion2**: large Erosion Scale, short Duration, low Downcutting; its **Precipitation** input fed with the
   inverse of `gaea-protect`, so no rain starts on the pan or lakes. *DEV F2.3, F2.5.*
4. Landform branches in drawing order (basalt → fans and washes → terraces and gypsum → pan → acid dome →
   volcano → city and roads), each as `effect → Mask node (second input = the branch input) with its prepared mask`.
   Prefer Mask nodes to mask ports. Use Surface nodes, not more erosion, to add detail. *DEV F2.6–F2.7.*
5. A light Thermal2 and small-scale Erosion2 to unify.
6. **Restore protected ground:** the Heights Combine with a **shrunk** `gaea-protect` × Slope < ~2° real.
7. Colour: SatMap base → per-landform CLUTer/Tint under the same masks → Weathering → the map-colour Combine → export.

**Mask preparation:** shrink lake masks 1–2 px (their edge pixels climb hundreds of metres — mask and heights don't
line up at the edges), limit the salt-pan mask to near-flat ground, blur 2–4 px and Warp hard cell masks, and multiply
by Height/Slope selectors. *OBSERVED F1.7; DEV F6.4.*

## 6. Recipes (starting points; tune and record)

| Landform | Driving mask (× selector) | Node chain, in order | At 125 m/px | At ~15 m/px | Main risk |
|---|---|---|---|---|---|
| Escarpment benches and strata | `biome-rift-escarpment` × Slope (real 8–40°) | Terraces (few, low Uniformity) or FractalTerraces (Tilt) → Stratify (tilt away from the rift) → Sandstone/Shear → Crumble on the lip → Thermal2 talus | Benches every 1–5 km (8–40 px) | + fine Stratify, Outcrops | Rice-paddy steps; benches ringing the volcano if the mask leaks; notches through the city shelf |
| Young / old basalt | `biome-recent-basalt` (× Height below the cone), `biome-old-basalt` | Rugged/Craggy → Roughen → dark Tint / Thermal2 → Weathering → rust CLUTer for the old | Tone and roughness | + flow lobes, pressure ridges | Both ages look the same |
| Salt pan, crust, pools | `biome-salt-flats` × Slope < 1–2°; lakes shrunk | Protect → Cracks ×3 (Warp) → Subtract (tiny) → pools flattened at their level → white CLUTer + WaterColor | Colour only, dead flat | Polygons 50–150 m, 0.5–2 m rims | Pan no longer lowest; erosion in the cracks |
| Gypsum dunes | `biome-gypsum-dunes` (blurred) | Sand (Direction downwind, Warp by Terrain) → Mask → pale CLUTer | Colour only | Dunes a few 100 m apart | Wrong wind; dunes on the pan |
| Fossil reef terraces | `biome-fossil-terraces` | Terraces (4–6) → Sandstone (Chipped) → Thermal2 → cream CLUTer + Weathering | Steps ≥ 2–4 px | + Outcrops as reef heads | Terraces crossing contours |
| Fans and bajada | `biome-gravel-flats` ∪ escarpment-foot band | Erosion2 (Coarse + Bed Load) → Deposits → gravel CLUTer | One belt | + Anastomosis distributaries | Fans everywhere; the Slums buried |
| Mineral washes | `mask-washes` (dilated) ∪ `biome-mineral-washes` | Anastomosis (Flows / Flooding) or shallow Subtract → Sediments (Fine) → streak colour | Shallow corridor | Braided threads | Channels cut uphill (fix the map's gradient first) |
| **Acid dome, terraces, pools** | `biome-acid-pits`, `biome-sulfur-crust`, `lakes-acid`; ring masks = Distance from the pools, banded with Threshold | Terraces (many small) only on acid-pits × Slope > 0.3° → shrunk pools Combined back flat at their own levels → **own colour branch:** saturated emerald / turquoise / yellow-green pools, white salt then sulfur yellow nearest, orange and ochre iron outer rings (Dallol's white → green → yellow → orange → ochre); acid Combine at Ratio 1.0; **slightly desaturate everything outside the acid masks** rather than oversaturating the pits | Rings and pools | Steps of 30–60 m (exaggerated) | Flat paint bleeding over the dome (today's 85% map-colour Combine does exactly that); pool edges in cracks |
| Volcano, crater, lava lake | `biome-recent-basalt` × Height; the lava-lake component | Erosion2 (rain on the cone) → Thermal2 → (Crater) → Combine Max flat lake → glowing Tint | Cone, gullies, crater | Rim detail, spatter | The ~2 km pit (a map issue, GA4); a second cone |
| City shelf and roads | Height band × Shape (no burg mask yet); `mask-roads` | Combine to a Constant level (feathered) → Stratify off-shelf; Blur(roads) → Subtract 1–5 m + local blur | Roads as colour only | Cuts and benches | Shelf step through the falls |
| Waterfall slot | `mask-rivers` × `biome-rift-escarpment` | Dilate → Distance → Subtract 50–150 m → plunge pool → Crumble | Notch ≥ 2 px | Slot gorge | Slot on a straight lip |

*The acid pits are the act's signature (P20): judge the tile at one exposure and confirm they are the loudest thing in it.
Before era: the same masks with white travertine and clear blue-green pools.*

**Export additions to ask for** (a tool change in ARPGMapTools, proposed like the TG gaps): a settlement-footprint mask,
a marker mask (falls, springs, vents), one mask per named lake, clearing stale files on export, soft biome masks, mask
names from config. *F rec. 9.*

## 7. Property names confirmed by saving (Gaea 2.3.1.0)

| Node | UI label | File name | Confirmed |
|---|---|---|---|
| File | File / Relative Path / Is RGB | `FileName` / `RelativePath` / `IsRGB` | 6 Nov 2026 |
| Combine | Mode / Ratio | `Mode` (text, e.g. `"Max"`; Blend omitted) / `Ratio` | 6 Nov 2026 |
| Combine (colour) | — | `RenderIntentOverride: "Color"` (set by Gaea when the first input is colour) | 6 Nov 2026 |
| SatMap | Library item | `LibraryItem` (399 = pale desert rock) | 6 Nov 2026 |
| Erosion2 | Seed | `Seed`, `Version: 2` (others omitted at default) | 6 Nov 2026 |
| any exported node | Mark for Export | `SaveDefinition {Node, Filename, Format: "EXR", IsEnabled}` | 6 Nov 2026 |
| Terrain | Width / Height (Build Settings > Terrain) | `Width`, `Height`, `Ratio` | 6 Nov 2026 |

Add a row for every new name, with the date (GA6).

**Candidates, not yet confirmed by George's save** (seen in real Gaea 2 saves or schemas during round 2; confirm before
relying on them): the Mask node's second input is `In2`; Slope's range is saved as `{X, Y}` in degrees while Height's
range is 0–1; Combine's Output is saved as `Clamp`; Terraces' step count as `NumTerraces`.

## 8. Checks

- **GA15. Numbers first:** run `scripts/gaea_check_heights.py --export world/build/gaea/<era>-act1 --built <Heights
  output> --terrain tools/gaea/<tile>.terrain [--colour <Colour output>]` (exit 0 pass, 1 fail, 2 unreadable). It compares
  the build **with the export** (so today's map faults don't bury new damage), and computes per mask: |Δh| inside the shrunk protect mask (≈ 0), height spread inside each shrunk lake (≈ 0), the pan
  minimum (still the lowest land, P19), the maximum cut on the escarpment and shelf, the share of pixels changed by more
  than a threshold. *INFERRED F6.2.*
- **GA15b. Colours separate:** neighbouring zones' colours differ (a colour-difference test, e.g. ΔE > 15) and the acid
  field has the highest chroma on the tile; today the washes (#B85D23) and acid ground (#C8661E) are near twins (ΔE ≈ 8).
  *OBSERVED round 2.*
- **GA16. Then eyes:** the same view in the repo's terrain viewer and Azgaar's 3D, and a top-down Shade against the map
  screenshot of the same box; before and after, both eras (P9). The reference overview is mood only (P6). *F6.3.*
- **GA17. Failure modes** (F6.4): erosion eating protected ground (rain mask + restore with shrunk masks); pools with
  walls (shrink masks, slope selector); polygon edges along biome borders (blur, warp, selectors); banding (32-bit
  heights, blurred masks); over-erosion at 128 km (short passes, low Downcutting); flat-topped peaks (Combine Add past
  1.0); invented rivers (don't use Rivers regionally); tile-edge walls (Edge node); a CG look from the Flow output; acid
  as flat paint; stale inputs; relief jumps after an export (pre-flight 3).
- **GA18. Say what's exaggerated:** the acid field is ~60× Dallol, the pools and lava lake are oversized; environment art
  must not read Gaea sizes as literal. *OBSERVED F1.10; G36.*
