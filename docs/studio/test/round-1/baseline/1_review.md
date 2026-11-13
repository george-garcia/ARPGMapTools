# Act I map review: present day (and the before map where it matters)

Reviewed 13 Nov 2026 against the story vault (README "Map decisions" and "Map direction", the Act I notes including the
13 Nov spine, the geological blueprint) and the studio's level-design and environment-art skills. Nothing on the map was
changed. Evidence comes from the ops in `world/`, the last build's screenshots, the Gaea tile, and read-only queries of
`world/build/now.map` and `before.map`. I loaded them in the repo's own Azgaar session and read cell heights, biomes,
lakes, rivers and routes. The scripts and extra screenshots are in `_work/` next to this file.

**How to read the numbers.** Frame coordinates are `act1` frame-local (u west→east, v north→south, 0–1 = 100 × 64 km).
Heights are Azgaar's 0–100 with metres = (h − 18)², Azgaar's default exponent. Examples: h33 = 225 m (basin floor),
h41 = 529 m (Slums), h49 = 961 m (upper city), h58 = 1,600 m (escarpment top), h66 = 2,304 m (volcano). One cell is
about 2.2 km across (4.7 km²). "Grade" is the average slope between neighbouring cells, so a real road would steepen
locally.

## Verdict

The map holds together as a Danakil-style basin. The locked layout is all there: escarpment west and north-west, Slums
and upper city at its foot, ruin and washes mid-basin, basalt and volcano north, terraces and gypsum stepping east to the
salt, acid on the pan's southern edge, Dead Spring south. Drainage is right. The salt pan is the lowest land (h21, 9 m),
and the basin's spill point is the Caravan Approach pass at h38 (400 m), so the basin is properly endorheic. Four
problems matter most:

1. the escarpment isn't the gate the story now needs;
2. Act I still reads as a rectangle;
3. the acid field has eaten the salt flats and shares its colour with the washes;
4. a third of the floor is one undifferentiated gravel sheet.

## Ranked findings

### 1. The basin's north end leaks onto the plateau, so the escarpment road is not the only way up (story and plausibility). Needs George.

- **Problem.** The confirmed 13 Nov spine says the way forward is through the city, and the narrative skill now wants
  the road past the upper city to be the act's exit (task 2). The west escarpment really is a wall. The north-west
  corner of the basin isn't: the north rim (`act1.rim.north`, set 45 = 729 m) meets the plateau's gentle eastern flank,
  and a cart-grade route runs round the end of the escarpment.
- **Evidence.**
  - The west wall is a single-cell cliff of about 1,000 m. For example, at v 0.60 the height drops from h58 to h40
    between u 0.10 and 0.15, and at v 0.70 from h60 to h38. The shelf (h48–50) and the ravine behind it are the only
    intermediate step on the west side.
  - Shortest routes from the Slums onto the plateau, keeping every cell-to-cell grade under a limit:

    | Max grade | Through the upper city | Avoiding the shelf |
    | --- | --- | --- |
    | 8–10 % | 13–20 km | 76–79 km, via (0.55, 0.29) → (0.52, 0.13) → (0.51, 0.01) → (0.48, −0.07) |
    | 10 % | | about 111 km the other way: out through the Caravan Approach and up the plateau's south-west back slope near u −0.35 |

  - Raising the north-west corner into a wall only moves the bypass about 20 km east, round the volcano's west flank
    (83–98 km in a simulated test). Only a barrier across the whole north-rim saddle closes it. With that barrier, the
    detour is the 130 km south-west way round.
- **Fix.** Two options, both written out exactly in `2_change_request.md`:
  - **A (soft, no terrain change).** The city road is the only road-grade climb within a day's travel. The alternatives
    are 4–6 times longer, waterless, and run through the slavers' own lowland.
  - **B (hard).** Fresh flows from the active volcano fill the north-rim saddle. This is a `paint_biome` of Recent Basalt
    over the saddle plus a light `roughen`. It closes the north end and leaves only the 130 km way round.

  B quietly answers the vault's open question "why (or whether) the city controls onward passage", and the Slaver
  Faction's Q5, "What prevents people from using safer routes around the city?". That makes it George's call.
- **Who.** George chooses A or B. I implement either. No geography can make "the only way out" literally true: the pass
  is a way out, and a 100 km+ plateau always has a back slope.

### 2. Act I still reads as a rectangle cut into the continent (author direction 6 Nov unmet). Mine.

- **Problem.** "The rectangular outline came from the generated overview, and the map should have realistic outer
  boundaries that blend into the continent." The continent views (`now-heightmap.png`, `now-biomes.png`, and
  `_work/now-wide-height.png`) still show a rectangle.
- **Evidence.**
  - The basin's east edge is a 38 km straight line (`act1.basin` vertices (0.94, 0.16)…(0.945, 0.76)). The salt pan's
    east edge is another 42 km straight line (`act1.salt-pan`).
  - The east horst and south rim are flat-topped sets of 47. Every cell from u 1.00 to 1.05 and v 0.20 to 0.85 is h44–49,
    and the whole v 0.95 row is h46–48. In 3D they read as a uniform low kerb (`now-act1-3d-low.png`).
  - The escarpment paint (`now.biome.escarpment`, heights 44+) has a 30 km straight west edge at u −0.06 on the plateau.
    It shows as a brown block with a ruler-straight side in `now-biomes.png` and lies inside the Gaea tile (u −0.14…1.14).
  - `now.biome.rim-hills` cuts off along u 1.03 and v 0.97–1.0 in the same way.
- **Fix (terrain in `base/10-act1-terrain.json`, then paint in `eras/now/30-biomes.json`).**
  1. `act1.basin`: give the east side two embayments and raise its edge noise. Replace the four east vertices with
     `[0.95,0.16],[0.975,0.28],[0.945,0.40],[0.965,0.52],[0.93,0.62],[0.96,0.74]` and set `edge_noise_km` 3.5 → 6. Do the
     same to `act1.salt-pan` so the pan follows it.
  2. `act1.rim.east` and `act1.rim.south`: change the value from `set 47` to `set 44` with `edge_noise_km` 10. Then add
     `act1.rim.east.crest` and `act1.rim.south.crest`: `raise` +5…+8 over narrow sinuous crest polygons that leave two
     saddles each, so the rims become ridges with notches rather than kerbs.
  3. `now.biome.escarpment`: move the west edge to a ragged line 4–6 km behind the lip, at about
     `[0.02,0.30],[0.06,0.38],[0.03,0.47],[0.07,0.56],[0.02,0.66],[0.04,0.74]`. Give `now.biome.rim-hills` a ragged
     outer edge 3–5 km beyond the crest.
  4. Check with the continent `screenshot` (heightmap and biomes) and `screenshot_3d` low.
- **Who.** Me (standing direction: geographically sensible, fits the theme, looks better). The pass at h38 must stay
  the lowest exit. Re-run the spill check after the edit.

### 3. The acid field swallows the salt flats, and acid ground and washes are the same orange. Mine.

- **Problem.** The author wants the acid pits to stand out "even beyond what real Dallol would justify". The salt flats
  were one of the two features he praised ("visually successful"), and the overview puts them "on the eastern basin
  floor". At the moment the acid complex covers about 21 % of the basin floor and the salt about 7 %. The orange ring
  round the pools also blends into the orange washes, so the acid field doesn't read as its own thing.
- **Evidence.**
  - Basin-floor cells: Acid Pits ground 74, Sulfur Crust 37, acid lakes about 43, Salt Flats 49 (of 735). On the 2D map
    the salt pan is a thin pink strip along the east edge (`now-act1-biomes.png`).
  - Acid pools a and d merged into one 19-cell lake of about 90 km² (lake 81 at (0.71, 0.76), the big lime pool). The
    gap between their sculpted pits is about 0.7 km, under a cell, which is the merge rule in `world/README.md`.
  - Colours: Mineral Washes `#B85D23` (hue ≈ 23°, lightness 43 %) and Acid Pits ground `#C8661E` (hue ≈ 25°, lightness
    45 %) are nearly identical. They touch where the main wash ends at the mineral pool (0.615, 0.625).
- **Fix.**
  1. New `now.biome.salt.dome`, after `now.biome.salt`: `paint_biome` Salt Flats over the acid-dome circle with heights
     `[20,27]`. Then shrink `now.biome.acid` to a circle about 25 % smaller (outer radius ≈ 12 km), so a one-cell amber
     rim hugs the pools on white salt. That matches the reference: yellow-rimmed pools on salt.
  2. Keep `now.biome.sulfur` and every pool colour. Recolour `now.biome.washes` to a redder, darker iron-oxide such as
     `#A0391F`, and check it in greyscale against `#C8661E` and the escarpment's `#8A4A2E`.
  3. Move `act1.water.acid.d` from (0.715, 0.795) to (0.728, 0.818) so it stops merging with pool a. Update the
     `now.lakes.acid.d` and `before.lakes.spring.d` boxes to match. The field then reads as many pools, like Dallol,
     instead of one lake.
- **Who.** Me. The amber ground is a provisional implementation choice (README, 5 Nov). It stays, just narrower.

### 4. A third of the basin floor is one gravel sheet; the blueprint's sediment sequence isn't drawn. Mine.

- **Problem.** The author's critique of the old overview was "too much brown/gravel... too many zones from effectively
  the same tile/material family". The blueprint's fan → gravel → mudflat → gypsum → halite sequence isn't on the map
  west of the washes.
- **Evidence.**
  - Gravel Flats are 270 of 735 basin cells (37 %, about 1,280 km²). It's one flat tan from the Slums to the washes and
    down to the Dead Spring.
  - 27 stray "Hot desert" cells (the continent's default cream) sit at the escarpment foot and in the pass:
    (0.17, 0.40), (0.34, 0.32), (0.43, 0.30), (0.50, 0.21) and 18 cells in the pass. They are gaps between the gravel
    polygon and the 44+ rim paints.
- **Fix (after `now.biome.basin-ground` in `eras/now/30-biomes.json`).**
  - `now.biome.fans`: "Boulder Fans" (placeholder), a coarse darker tone such as `#A88A64`, heights `[34,41]`, along the
    escarpment foot from the pass mouth to the basin's north-west corner. The Slums terrace is already "on the fan below
    the falls" (op note).
  - `now.biome.mudflats`: "Silt Flats" (placeholder), pale and cracked, such as `#D9CDB4`, heights `[20,32]`, over the
    south-central floor between the Dead Spring and the washes.
  - Gravel stays as the middle band round the Ruined Outpost, which is the blueprint's "old roadside trace on a gravel
    bench".
- **Who.** Me. The names are placeholders and are tagged that way.

### 5. Zone 01 (Caravan Approach, locked) has no ground of its own. Mine.

- **Problem.** The tutorial zone is painted the continent's default Hot desert, the same cream as the lowland outside.
  The map hasn't decided what the pass is made of.
- **Evidence.**
  - 18 Hot desert cells at h38 in the pass.
  - In the Gaea heights the pass is a 4–6 km wide valley at about 400–500 m. To its north is the plateau edge, rising
    to about 1,700 m within 1.3 km.
  - In the before map, a generated river ("Ellyth") rises on the pass floor and flows through it to the Spring. So
    today it's a dry valley that the road follows.
- **Fix.** `now.biome.pass`: "Wadi Gravel" (placeholder, such as `#BFA27A`), over the `act1.caravan-pass` polygon grown
  by about 2 km, heights `[30,42]`. Optionally, a dashed dry-channel route (new style group `dry-wadi`, not the rust
  `washes`) along the before river's line from the pass to the Dead Spring.
- **Who.** Me.

### 6. The volcano is a flat-topped mesa with a 1–2 km shaft for its lava lake. Mine.

- **Problem.** `act1.volcano` sets a 10 km disc to h66, so the summit is a flat table at h66–67. The lava lake is a
  sculpted pit to h18 (sea level), because Azgaar only makes lakes below h20.
- **Evidence.**
  - Cells in the disc are all h66–67, with one h18 cell at (0.83, 0.06).
  - In the Gaea heightfield the flank reaches 3,410 m and the crater floor is 1,183 m: a 2 km hole.
  - In 3D the cone reads as a jagged block with a red slot (`now-act1-3d-*.png`), not the clean cone of the reference.
- **Fix (base terrain).**
  1. Replace `act1.volcano` with stacked concentric sets: 52 (radius 9 km), 58 (6 km), 63 (3.5 km), 67 (1.5 km,
     feather 1.5). Change `act1.volcano.crater` to set 64 (radius 0.8 km).
  2. Drop `act1.water.lava-lake` and `act1.lakes.lava`. Show the lava lake as a one-cell custom biome, "Lava Lake"
     `#E2531B`, in both eras' biome files, and keep the marker.
- **Who.** Me.

### 7. Shared ops leak present-day features into the lush before map; the before map's water isn't designed. Partly mine, partly George.

- **Problem.** `eras/common/10-water.json` draws the dry "seasonal mineral washes" (dashed rust lines), the pink brine
  and teal mineral styling, and a falls stream that "ends at the Slums, used up" in both eras.
- **Evidence.**
  - In `before-act1-biomes.png` the dashed washes cross green grassland, alongside generated perennial rivers running
    down the same corridors (Chy'at, Uthondras, Doriath).
  - The falls stop at the Slums in a wet climate. Meanwhile a generated river carries on from the terrace to the Spring.
  - The before-era rivers end in the hot-spring pits on the acid dome (h24–26), not in the lowest ground (the pan,
    9 m).
- **Fix.**
  - Mine: move `act1.style.washes` and `act1.wash.*` into `eras/now/20-water.json` (ids `now.wash.*`). Split the falls
    into the common upper course plus a before-only continuation from the Slums to the Spring.
  - George: the old salt lake's extent (open in the vault). Useful numbers:
    - The spill point is the pass at 400 m.
    - A lake at 25 m (h23) covers about 470 km² of the pan.
    - A lake at 64 m (h26) covers about 1,400 km² and reaches the washes.
    - A lake can't rise past 400 m without spilling out of the Caravan Approach.

### 8. The betrayal needs places the map doesn't show yet. Needs George.

- **Problem.** The 13 Nov spine puts the ambush in an abandoned upper-city district, reached by an "abandoned route"
  that the Slums leader offers, after which the way back is sealed. The map has one road (the switchback) and one city
  point.
- **Evidence.**
  - The upper city sits on a bench of about 9 × 6 km (`act1.upper-city-shelf`).
  - The terrain already holds a second, steeper way up from the Slums terrace: the falls slot, (0.24, 0.42) h41 →
    (0.24, 0.36) h46 → (0.25, 0.33) h48. It reaches the shelf's west, falls-side end, away from the switchback. That is
    a natural candidate for an old intake stair or aqueduct path ending in a disused western district.
- **Fix, if George agrees.**
  - `now.road.old.falls-stair` in the `old-road` style along the slot.
  - A label "Abandoned district" (placeholder) at about (0.255, 0.33).
  - A sentence in the upper-city burg note.
- **Who.** George. This is a story choice, and the map shouldn't make it.

### 9. Labels and notes. Mine, low.

- **Problem and evidence.**
  - "Slaver Upper Camp" and "Slums" sit on the falls stream and the green strip (`_work/now-city-height.png`).
  - "Rift Escarpment" (0.14, 0.12) is on the plateau 12 km behind the face.
  - "Mineral Washes" lies over the dashed channels.
  - The region note on the "Rift Basin" label predates the 13 Nov spine (betrayal, upper-city escape, passage to
    Act II) and doesn't mention the act's exit.
- **Fix.**
  - Move `now.label.escarpment` onto the face west of the Slums, at about (0.06, 0.52).
  - Nudge the city and town label offsets in their style groups and check by screenshot.
  - Move `now.label.washes` to (0.60, 0.40).
  - Add one paragraph to `now.label.region`'s note that summarises the 13 Nov spine and links the vault section.

### 10. The green falls strip is wider than a stream would keep in a drought. Mine, low.

- **Problem.** `now.biome.oasis` paints a band 5–8 km wide from 15 km up on the plateau to the Slums.
- **Fix.** Narrow the polygon to the stream's own cells on the plateau, and keep the wider patch only round the intake
  and the Slums.

## Checked and fine

- The escarpment road's ramp. From the shelf north to the escarpment top the climb is about 560 m over 14 km (4–7 %
  per cell), up a natural ravine between ridges at h59–62. The upper city corks it (task 2).
- Drainage and the sink: the pan is the lowest land, and the brine pools sit in it.
- The acid dome sits on the pan's southern edge (approved fix, 6 Nov).
- The dunes lie downwind (ENE) of the gypsum pavement. That matches the map's wind, which comes from the south-west at
  this latitude (`config.json` winds, 30–60° N band).
- The Slums are 432 m below the upper city, and about 7 km away on the map.
- No op cites Notion.

## What I'd do myself, in order

Findings 2 → 3 → 4 → 5 → 6 → the mechanical half of 7 → 9 → 10. Each one is ops only. After each I'd rebuild both eras,
screenshot `act1` (biomes and heightmap) against `world/reference/act1-overview.jpg`, take `screenshot_3d` low, re-run
the spill and route checks, and re-export Gaea for terrain changes.

## Questions for George

1. **Gate (finding 1).** Should the escarpment road be the only practical road (option A), or the only way up apart
   from the 130 km way round (option B, fresh lava choking the north-rim saddle)? B partly answers "why the city
   controls passage". Is that yours to keep open?
2. **Old salt lake (finding 7).** How full was the basin before the catastrophe: a pan lake (about 25 m), up to the
   washes (about 64 m), or higher? It can't pass 400 m.
3. **Abandoned route (finding 8).** May the map show the falls slot as the leader's "abandoned route" into a disused
   western district of the upper city, or should it stay unmarked?
