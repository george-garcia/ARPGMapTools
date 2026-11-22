# Map pass: the history ledger and one test event (the Drained Lake)

**Date:** 2026-11-15 · **Era(s):** both · **Frame:** `history-test` (a grassland plain about 150 km east of Act I) · **Branch:** `history-ledger-test`
**Asked by:** George in chat, 15 Nov 2026: "one before map with dated events, go ahead with the test"

## 1. What changed and why

**The history ledger.** George decided (15 Nov 2026) that the eras may have different terrain (P14 amended), that
history is about 2,000 and 1,000 years old (P31), and that it is sparse and real: scars only where something happened
(P32). `world/history/events.json` now lists dated events, and `scripts/history.mjs` turns each into ops by its kind's
aging rules. The before era shows the place as it was; the now era shows what the event left. The build runs the
compiler first, so the ledger and the ops can't drift. Generated files are `world/eras/<era>/00-, 35-, 65-history.json`
(terrain, ground, notes) and carry a `generated` field: edit the ledger, never them.

**The test event** (`test.drained-lake`, status `test`, not canon). An extraction works drew the ground dry about 2,000
years ago. It is placed on an empty plain away from every story place, so it settles nothing (P7, P32). Its kind,
`extraction-drain`, applies three real processes:

- **Subsidence:** pumping an aquifer makes the ground over it sink (Mexico City, California's Central Valley). The
  drawdown area (44 × 30 km) is lowered 3 height units with an 8 km fade.
- **A lake dies to a playa:** without its water table the lake dries to a flat bed of silt and salt (Owens Lake). The
  living lake (below height 20 in the before era) becomes a dry floor at 26, a shallow hollow below its old shore.
- **Relict gley:** waterlogged marsh soil is gleyed blue-grey, and when it dries the air rusts its iron into orange
  mottles. The before era's marsh ring becomes a grey-blue "Relict Gley" ring around the playa.

Bent for looks (P8): the gley ring is one flat grey-blue on the map. The rust mottles belong in Gaea, on its mask.

`now/00-climate.json` is renamed `now/01-climate.json` so the era's terrain and its finalize run before the drought.

## 2. Ops

| Op id | File | Tool | What it does |
|---|---|---|---|
| `test.drained-lake.before.lake` | `eras/before/00-history.json` | sculpt set 17 | The living lake |
| `history.before.finalize` | same | finalize_terrain | Rebuilds lakes and rivers |
| `test.drained-lake.before.marsh` | `eras/before/35-history.json` | paint_biome Wetland | The marsh ring |
| `test.drained-lake.before.lake-name` | same | set_lakes | Freshwater, named `[test]` |
| `test.drained-lake.before.works` | `eras/before/65-history.json` | add_marker | The works as it stood |
| `test.drained-lake.now.subsidence` | `eras/now/00-history.json` | sculpt lower 3, clamp [21,100] | The sunken drawdown area |
| `test.drained-lake.now.playa` | same | sculpt set 26 | The dry lake bed |
| `history.now.finalize` | same | finalize_terrain | Before the drought (`01-climate`) |
| `test.drained-lake.now.gley` | `eras/now/35-history.json` | paint_biome Relict Gley | The dead marsh |
| `test.drained-lake.now.playa-crust` | same | paint_biome Dry Lakebed | The playa crust |
| `test.drained-lake.now.works` / `.label` | `eras/now/65-history.json` | add_marker ruins, add_label | The ruin and the event note |

Drawing order kept (P10): era terrain and finalize first, then climate, water, biomes, notes.

## 3. Evidence

| View | Before | Now |
|---|---|---|
| 2D biomes | `before-history-test-biomes.png` | `now-history-test-biomes.png` |
| 2D heightmap | `before-history-test-heightmap.png` | `now-history-test-heightmap.png` |
| 3D low / overview | `before-history-test-3d-low.png`, `-overview` | `now-history-test-3d-low.png`, `-overview` |
| Gaea tile | `world/build/gaea/before-history-test/` | `world/build/gaea/now-history-test/` |

Checks run:

- **The lake forms in the before era** (26 cells, freshwater, named), fed from the east and draining south.
- **Heights, now vs the base terrain, matched by cell position** (pack ids shift on every finalize):
  - Playa: −7.1 mean, 21 cells.
  - Gley ring: −3.9 mean, 46 cells.
  - Rest of the drawdown: −2.6 mean, 191 cells.
  - Outside: 412 of 549 cells unchanged; the rest −1 to −3 inside the 8 km fade.
  - No new lake formed: the playa is at 26 and its ring at 27–33.
- **Act I unchanged** after the extra finalize: 13 lakes, all named and styled; both burgs; the same biome set.
- **Gaea masks** are non-empty: `mask-biome-relict-gley` 23,261 px, `mask-biome-dry-lakebed` 11,352 px, and the before
  lake in `mask-lakes-other` 11,065 px.

## 4. Findings

- **The hollow barely shows at map scale.** A 14 km playa about 60 m below its rim is a gentle dish, as real playas are.
  Colour carries it on the map; the relief belongs to Gaea at tile scale.
- **Gaea's erosion was not run.** It needs George's Gaea (GA7–GA9). The tile is exported, with a mask for each new
  ground type.
- **Old drainage is left dry.** The before lake's outlet valley stays carved in the now era with no river in it: a dry
  channel that tells the story by itself.

## 5. Open and next

- **For George:** keep the test site for comparing future kinds, or delete it (remove the event and the frame).
- **Next kinds** (one at a time, each with its real analogue):
  - `battlefield`: craters softened to hollows, ponds or pans.
  - `foundry`: slag terraces, tailings fans, acid red streams.
  - `armoured-road`: inverted relief, a ridge left standing.
  - `irrigation`: salted fields and ghost canal banks.
  - `dam-breach`: flood-scoured channels.
- **A Gaea recipe for relict gley:** blue-grey ground with rust mottles along gully walls, driven by
  `mask-biome-relict-gley`.
- **The story side should update the vault's "centuries removed" wording** to the 2,000 and 1,000 year estimates (P31).
