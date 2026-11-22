# Map pass: the volcano's extractor, the first-era skirmish and the settled blight

**Date:** 2026-11-22 · **Era(s):** both · **Frame:** `volcano-north` (new; north and north-west of the Act I volcano) · **Branch/PR:** `volcano-north-blight`
**Asked by:** George in chat, 22 Nov 2026 ("please make these changes to our geography and note them")

## 1. What changed and why

**The rule behind it (P34-P38).** George decided that every place looks the way it does because of the fictional past,
not because a real place fits. Magic comes from skill stones, each a minor extraction. Calamity-sized power comes only from
extractors at the world's great natural sources. The Act I volcano is one, a well of magmatic power. In the first era,
magic users channelled it through its extractor in a skirmish between the first two powers, magic and machine. Where the
earth weakens and power is extracted, blight scars the land and mutations arise. The principle, approved by George:
extraction drains the source and leaves its residue. None of this is in the story vault yet, so the event is `proposed`.

**One ledger event, `volcano-north.skirmish`, of a new kind `calamity-skirmish`** (`scripts/history.mjs`). The
foundry is ancient, so it is placed on the before map's land and water, then aged (P34).

- **Before era (as it stood):**
  - **Foundry Brook** runs off the volcano's north flank, north down a valley to the lowland, and soaks into a marshy fan.
    A river may end in a fan if a note says so (G8). The valley is carved in both eras, with its floor never rising
    downstream (54 to 39).
  - A ribbon of **Riparian Woodland** follows the water (G25: green only where there is water).
  - **The Foundry** works on the stream; that is why it was built there. **The Extractor** stands on the flank above it.
  - The **Foundry Road** heads north-west, toward the lands of whoever held it (open).
- **Now era (aged ~2,000 years, P31):**
  - **The lava.** Lava conjured in the skirmish fills the valley from the extractor down past the foundry, its surface still
    falling downstream (57 to 53). Real lava fills and dams valleys, and water seeps through it.
  - **The springs.** **Tainted Springs** rise at the lava's toe in the gorge (Idaho's Thousand Springs). They are the only
    water in the blight.
  - **The old channel** below the toe is a dry wash. The now era's drought finishes the rest.
  - **The battle marks** on the road's approach: three craters softened to shallow hollows (two holding **Ash Pans**), and
    **Glassed Ground**.
  - **The foundry** is a ruin: stone footings, rust stains and slag (Wadi Faynan and Timna, ancient copper works whose slag
    still poisons the ground). It is half under the lava.
  - **The extractor** is defunct.
  - **The blight, settled.** **Blight Core** at the extractor is bone-grey and hollowed. **Blighted Ground** has charred
    galls, slime-vein mats and oversized sulfur crystals. **Blight Margin** is half-living land with mutated scrub. Seven
    **blight veins** radiate from the extractor (a new `blight-veins` route group, solid dark red).
  - **The inhabitants.** Only the grafted and the ritualists live here. Markers show two vein shrines, monster pens, a
    ritual ring, graft workshops in the foundry ruins, and their own track. The foundry road survives only as a trace.
- **Act I notes:**
  - The volcano marker now records the well and the extractor; it replaces "[provisional] Not the source of the acid pits".
  - The Acid Pits marker now records the residue, under the approved principle.
  - Neither note shows anything from the north side on the Act I map.

**Bent for looks (P8):**
- The blight is a fantasy ailment and need not follow geography (George).
- The veins are tens of metres wide in the zones but drawn as map lines.
- The blight bands are clipped to ground at 50 and up, so they stop at the rim and never reach the basin. Everything stays
  north of the act1 frame's edge.

## 2. Ops

All generated into `world/eras/<era>/{00,35,65}-history.json` from `world/history/events.json`. Edit the ledger, not
those files.

| Op ids (`volcano-north.skirmish.` …) | Era, slot | Tool | What it does |
|---|---|---|---|
| `before.valley.0-9`, `now.valley.0-9` | both, terrain | sculpt set | Foundry Brook's valley, floor 54 → 39, never rising |
| `now.lava.0-4` | now, terrain | sculpt set | Lava fill, 3 above the old floor, 57 → 53 |
| `now.crater.0-2` | now, terrain | sculpt lower | Softened craters, 2-3 units deep |
| `before.riparian`, `before.fan`, `before.river` | before, ground | paint_biome, add_river | The living stream, its woodland ribbon and marshy fan |
| `now.blight.margin/blighted/core`, `now.glass`, `now.ashpan.*`, `now.lava-paint.*`, `now.lava-toe`, `now.springs-ground`, `now.channel` | now, ground | paint_biome, add_route | The blight bands, glass, ash pans, lava, springs, the dry channel (washes) |
| `before.extractor/foundry/road` | before, notes | add_marker, add_route | The works at work and the road (`roads`) |
| `now.style.veins`, `now.vein.0-6`, `now.road`, `now.track`, `now.extractor` … `now.ring`, `now.label`, `now.label.glass` | now, notes | define_style_group, add_route, add_marker, add_label | Veins, the road trace (`old-road`), the ritualists' track (`trails`), ruins, sites, labels and the event note |
| `now.marker.volcano`, `now.marker.acid` | now, `60-markers-labels.json` | add_marker | Act I notes updated (text only) |

Drawing order kept (P10): the era terrain and its finalize run before the climate (00-history); paint and water run after
the era's own paint (35); markers and labels come last (65).

## 3. Evidence

| View | Before era | Now era |
|---|---|---|
| 2D biomes, `volcano-north` | `before-volcano-north-biomes.png` | `now-volcano-north-biomes.png` |
| 2D heightmap, `volcano-north` | `before-volcano-north-heightmap.png` | `now-volcano-north-heightmap.png` |
| 3D overview / low | `before-volcano-north-3d-overview.png`, `-3d-low.png` | `now-volcano-north-3d-overview.png`, `-3d-low.png` |
| Act I, unchanged | `before-act1-biomes.png` | `now-act1-biomes.png` |
| Gaea tile | `world/build/gaea/before-volcano-north/` | `world/build/gaea/now-volcano-north/` |

Checks run:

- **Both eras built from the ops** with no failed op. Two first-run faults were fixed in the kind: a duplicate op id, and
  an ash pan smaller than a cell.
- **Water runs downhill.**
  - The valley floor along Foundry Brook (before era, minimum height near each point): 54, 53, 52, 51, 50, 49, 46, 44, 40,
    39, 39.
  - The lava surface (now era): 57, 56, 55, 54, 53, 53, then the dry channel at 46 to 39.
  - The first build stacked the lava where segments overlapped (57 then 59). It now uses `set`, not `raise`.
- **Lakes.**
  - The `volcano-north` frame has none in either era: the springs are paint and a marker, not pits that would show as
    shafts in 3D.
  - Act I still has 13 lakes in each era, all named and styled.
  - Both burgs are present.
- **Act I unchanged.** A pixel diff of `now-act1-biomes` against the 13 Nov pass-2 "after" image differs only where labels
  and marker icons render (fonts and emoji). The ground paint is identical.
- **Colours.** All neighbouring pairs in the new frame are at least ΔE 13 apart (CIE76). The closest pair is Calamity Lava
  `#2B1714` against the cone's Recent Basalt `#222425`, at 13.1.
- **Gaea masks** are non-empty for every new biome, for example `mask-biome-blight-core` 4,118 px,
  `mask-biome-calamity-lava` 12,295 px and `mask-biome-tainted-springs` 1,566 px.
  - The veins have no Gaea mask: `export_gaea` hard-codes its route groups (M9, TG5).

## 4. Rules applied

| Rule | How this pass meets it |
|---|---|
| P34 | The foundry is sited on the before map's stream, then aged. The stream's fate is lava burial plus drought, not left as if alive |
| P35-P37 | Calamity marks only near the extractor that channelled the volcano; everything north and north-west, off the act1 frame |
| G7, G8 | Valley and lava surfaces never rise downstream. The before stream ends in a fan, and its note says so |
| G25 | Before-era green only along Foundry Brook; now-era green only at the tainted springs |
| P31 | Craters softened to hollows; footings outlast walls; metal rusted to stains; the road a trace |
| P32 | One event, one place: the history-test site and Act I untouched |
| K11 / K16 | Neighbouring colours ΔE ≥ 13. The core reads bone-white, the lava oxblood-black, the glass slate |
| G36 | The veins and craters are exaggerated to read at map scale; the notes say so |

## 5. Open and next

- **For George:**
  - **The volcano in Act I.** The story has no Act I beat at the volcano, and it is not one of the 19 scaffold zones. The
    Field Guide has a research zone for it (10 Volcano: summit caldera and lava lake, at dusk and night). If an Act I zone
    reaches the summit, the north side would be in view. Either keep that zone on the south flank and caldera rim, or let
    the summit show the dead land beyond as a deliberate foreshadow.
  - **The two powers.** Their names, who held the extractor and who attacked are open, so the attackers' direction is
    open too. The battle marks sit on the foundry road's approach, which follows only from the road.
  - **What lies further north and north-west.** It's where the foundry road led, and the Act II route itself.
- **Follow-ups:**
  - Record P34-P38 in the story vault, which would let the event move to `canon`.
  - A Gaea mask for `blight-veins` (an `export_gaea` change, TG5).
  - Gaea recipes for the blight layers: hollowed core pits, vein channels and glass crackle.
  - An act handoff once the Act II zones exist.
