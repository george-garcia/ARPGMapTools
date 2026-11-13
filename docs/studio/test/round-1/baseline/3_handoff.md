# Act I map handoff: what the world map decides for the zones

**For:** the level-design and environment-art passes (and the producer drafting each zone's `00_brief.md` from
`Docs/Act1Zones.md`).
**From:** the cartographer, 13 Nov 2026, from the present-day and before maps in ARPGMapTools and the story vault.
**Status:** draft for George. The map is a dev tool and never ships. It decides geography: where things are, what the
ground is made of, how high, what you can see, what changed. It doesn't decide story. Every name is a placeholder.

**Tags used below:**

- **[vault]**: the author's decision in the story vault (locked or confirmed unless marked otherwise).
- **[map]**: the map's provisional implementation, which may move.
- **[open]**: undecided; don't fill it in.
- **[pending]**: a fix proposed in `1_review.md` or `2_change_request.md`, not built yet. The fact will change if George
  approves it.

## 0. Read this first: what not to take from the map

- **No sizes or distances as tile sizes.** A zone on the map covers 10–40 km. A zone in the game is a tileset with a
  250–350 m main route (ArtStandards §1). Use the map for direction, neighbours, ground, height relations and skyline,
  never for metres of layout. Distances in Notion-era notes are void (vault, 6 Nov).
- **Pool sizes are symbols.** One acid "pool" on the map is about 90 km². Real Dallol pools are metres to tens of
  metres across. The map says *many vivid pools on salt, some large enough to block*; it doesn't say how big.
- **Heights:** metres = (h − 18)², from Azgaar. The 3D views and the Gaea tile are a separate eroded bake with heights
  exaggerated ×2 in the views (the volcano bakes about 1,000 m higher than its cell value). Quote metres from this
  document, not from the renders.
- **No paths between zones.** The routes drawn are real traffic (the main road, the old caravan road's fragments, the
  dry washes). The overview's dotted lines meant nothing (vault, 5 Nov).

## 1. The act at a glance

**Camera mapping.** The camera is fixed facing north-east, so "up-screen" = NE on the world map, "right" = SE,
"left" = NW, "down" = SW. This assumes in-game north = map north, which level design's T6 relies on. Bearings are
measured from each zone's centre on the map.

| Zone | Status | Map centre (u, v) | Bearing / distance from the Slums | Ground height | Ground (map) |
| --- | --- | --- | --- | --- | --- |
| 01 Caravan Approach | **locked** tutorial, combat [vault] | (0.06, 0.80) | SW, 31 km | ≈400 m pass floor, walls to ≈1,700 m | dry valley floor between cliffs; no ground decided yet [pending: "Wadi Gravel"] |
| 02 Slums | **locked** safe hub, no combat [vault] | (0.265, 0.43) | — | 440–530 m terrace | fan gravel at the escarpment's foot, green strip along the falls |
| Ruined Outpost | anchor (destroyed ruin) [vault] | (0.41, 0.51) | E (109°), 15 km | ≈290 m | gravel flats |
| Mineral Washes | proposed zone [vault scaffold 05–06] | (0.55, 0.45) | E, 29 km | 60–260 m | iron-stained wash floors and channels |
| Dead Spring | proposed zone [vault scaffold] | (0.40, 0.80) | SE (150°), 27 km | ≈170 m hollow, pools near 0–120 m | grey dried-pool floor, dead scrub, stagnant mineral pools |
| Acid Pits | **anchor**, the act's signature [vault] | (0.76, 0.74) | ESE, 53 km | 0–80 m low dome | amber crust, yellow sulfur crest, acid pools |
| Salt Flats | anchor [vault] | (0.90, 0.45) | E, 64 km | 0–25 m (the lowest land) | white-pink halite, pink brine pools in the north-east, white gypsum dunes |
| Fossil Terraces (+ gypsum) | proposed [vault scaffold 09–10] | (0.70, 0.44) | E, 44 km | 60–260 m benches | ivory reef-limestone benches; grey gypsum pavement east of them |
| Basalt Fields | proposed [vault scaffold 07–08] | (0.68, 0.22) | ENE, 44 km | 250–440 m tableland | dark brown-grey old basalt; charcoal fresh flows near the volcano |
| Volcano (maybe) | **active**, confirmed [vault] | (0.84, 0.07) | ENE, 62 km | rises to ≈2,300 m | fresh charcoal flows, summit lava lake |
| Upper city (finale, 4–6 zones) | **locked** anchor [vault] | (0.29, 0.32) | N (20°), 7 km, 430 m above | 900–1,020 m shelf | a bench cut into red-brown escarpment rock |
| Escarpment top (act exit) | [pending] change request | (0.315, 0.12) | N, 20 km | ≈1,520 m | plateau edge, cold desert |

## 2. The zone graph (direction for level design's T6 and T7)

The likely start order is author direction (vault, 5 Nov): caravan approach → Slums → Ruined Outpost → Slums → Dead
Spring → Acid Pits → undecided. The confirmed end (vault, 13 Nov) is Slums → (betrayal) abandoned upper-city district
→ upper-city zones → Act I boss → passage to Act II.

| Leg | World-map bearing | Distance | On screen | Note |
| --- | --- | --- | --- | --- |
| Caravan Approach → Slums | 41° NE | 31 km | **up** | The pass itself runs WSW→ENE (≈63°), so the whole opening climbs up-screen. |
| Slums → Ruined Outpost | 109° E | 15 km | up-right / right | Along the old caravan road. |
| Ruined Outpost → Slums | 289° W | 15 km | down-left | A return: T3 says no walk-back, so use a waypoint or portal. |
| Slums → Dead Spring | 150° SSE | 27 km | right | |
| Dead Spring → Acid Pits | 84° E | 36 km | up-right | The Mineral Washes' southern end lies between them. |
| Slums → upper city | 20° NNE | 7 km | up / up-left | Switchback up 430 m. |
| Upper city → escarpment top | 9° N | 13 km | up-left | [pending] The road climbs a ravine ramp 560 m. |

Other neighbours, if quests join them:

| Leg | Bearing | Distance |
| --- | --- | --- |
| Ruined Outpost → Mineral Washes | 75° ENE | 15 km |
| Mineral Washes → Fossil Terraces | 88° E | 15 km |
| Mineral Washes → Basalt Fields | 41° NE | 20 km |
| Fossil Terraces → Salt Flats | 92° E | 20 km |
| Salt Flats → Acid Pits | 217° SW | 23 km |
| Acid Pits → Fossil Terraces | 343° N | 20 km |
| Dead Spring → Mineral Washes | 34° NE | 27 km |
| Basalt Fields → volcano | 59° NE | 19 km |

Read from the map: going outward from the Slums trends east and north-east, which is up-screen or across. The act
climbs north at the end. Only returns run down-screen.

## 3. Whole-act facts (both disciplines and lighting)

- **What it is [vault].** A closed (endorheic) rift basin modelled on the Danakil Depression and Dallol, about 100 km
  rim to rim.
  - The escarpment rises 1,000–1,400 m on the west and north-west.
  - The basin floor is 200–260 m; the salt pan is the lowest ground at about 9 m.
  - The present day is a drought: precipitation is 25 % of natural [map].
- **The basin's one low exit [map].** The Caravan Approach pass (400 m) is the spill point. Every other edge is cliff
  or rim hills.
- **Wind [map].** The prevailing wind comes from the south-west (the map's climate settings for this latitude).
  - Dust and sand drift north-east. The gypsum dunes lie east-north-east of their source.
  - The volcano's plume leans north-east, away from the basin (inferred from the wind).
  - The basin sits in the rain shadow of the western plateau. Storms build over the escarpment, which is why the Slums,
    at its foot, can get the rare thunderstorm of the arrival scene. The vault calls it "an unusual storm".
- **Latitude [map]:** about 35° N. Noon sun is about 78° up in midsummer and about 31° in midwinter. The basin floor is
  hyperarid and hot; the plateau is about 8–9 °C cooler.
- **Landmarks on every skyline** (direction and angle above the horizon from each zone are given in section 4):
  - The **escarpment wall** fills the west and north-west from everywhere.
  - The **volcano** stands to the north-east or north of every zone, 1–6° up, with a plume.
  - The **upper city** shows only from the west half of the basin, as a lit bench in the cliff.
- **Before → now in one line [vault + map].** Before the machine's extraction:
  - the basin was green;
  - the Spring was a living oasis;
  - the acid field was clear hot springs on white travertine;
  - streams ran down the washes.

  The present-day decay is drought (the extraction), and its chemistry is **[open]**. Rocks are the same in both eras.
  Water, plants and colour changed.

## 4. Zone cards

### 01 Caravan Approach: tutorial, combat (locked)

- **Ground and shape [map].** A 4–6 km wide valley at about 400 m through the south-west rim, running WSW→ENE.
  - North side: the plateau's edge rises about 1,200 m within 1.5 km. It's red-brown escarpment rock, a true canyon
    wall.
  - South side: lower, duller brown rim hills (about 840 m).
  - The floor has no designed ground yet; it shows the continent's default desert. [pending: "Wadi Gravel", a dry
    valley floor.]
- **Road [map].** The main road runs up the valley floor: slave caravans, merchants and free travellers all use it
  [vault]. The zone-01 marker sits on it at (0.06, 0.80).
- **What happened [map, placeholder water].** The before map has a river on this valley floor running into the basin
  to the Spring. Today it's dry, so the caravan road follows a dead riverbed. Use that as the decay cause for the floor:
  old channel banks, cobbles, dead riparian scrub. Who attacks the caravan is **[open]**.
- **Edges.** A cliff on the north (camera-side west and north walls need fades) and rim hills on the south. The exit
  side faces NE, toward the Slums.
- **Skyline.** Escarpment wall immediately west and north (about 12° up). Upper city NE 38 km, barely visible. Volcano
  NE 91 km, a faint plume.
- **Hook to look for [suggestion].** Danakil escarpment caravan descents (the Berahile–Hamed Ela salt road), wadis under
  cliffs.

### 02 Slums: safe hub, no combat (locked)

- **Ground [map].** A flat terrace (440–530 m) on the fan at the escarpment's foot, 200–300 m above the basin floor.
  - The falls come down a slot in the wall just west of it. The stream ends here, "used up".
  - A green strip follows it: the only living green in the act.
- **The city above [vault].** The upper city's walls sit 430 m higher on a shelf about 7 km north, overlooking the
  Slums directly. A switchback road climbs between them. The residents are free citizens.
- **Water [map].** The falls are the city's water. The upper city's intake is upstream; the Slums take what comes
  down, with wells and cisterns as backup. In the vault the water source is **[open]**; the map's answer is
  provisional.
- **What happened.** What stood here before is **[open]**. On the before map the terrace is green and the stream
  carries on south to the Spring.
- **Skyline.**
  - The upper city N, about 3° up and close: the act's dominant landmark from the hub.
  - The escarpment wall W and NW, about 7° up.
  - The volcano E, 62 km, low.
- **For the betrayal [suggestion, needs George].** The falls slot is a second, steeper way up from the terrace to the
  shelf's west end. It's a candidate for the leader's "abandoned route" into a disused district.

### Ruined Outpost: destroyed ruin (anchor)

- **Ground [map].** An open gravel flat at about 290 m, 15 km east of the Slums on the old caravan road. The road shows
  only in faded fragments and fades out before the washes.
- **What it is [vault, provisional].** A former caravan waystation, long abandoned and picked over. Ordinary collapsed
  buildings, rusted parts in the ground, broken robot limbs. **Not** a scrapyard, a factory or an ancient battlefield
  landmark.
- **What happened.** Abandonment, then centuries of salvage. Where the old road once led is **[open]**. On the before
  map a stream passes nearby and the ground is grassland, so it was a watered stage on a living route.
- **Edges.** Open ground. Boundaries are the road's banks, collapsed walls and shallow wash cuts, not cliffs.
- **Skyline.**
  - The upper city NW, 17 km, about 2° up.
  - The escarpment wall NE and N.
  - The volcano NE, 51 km, about 2° up.
- **Hook to look for.** Ruined caravanserais and desert waystations; machine scrap half-buried in gravel.

### Mineral Washes (scaffold 05–06)

- **Ground [map].** Seasonal channels (dashed on the map) running from the basalt's edge south to a teal mineral pool,
  with a branch east through the terrace gaps to the salt.
  - Floors and fans are oxidised orange-red. [pending: recoloured redder, so they no longer match the acid ground.]
  - The channels sit about 60–260 m above sea level. On the map the corridor is a broad trough 150–200 m below the
    gravel flats on either side; real washes would be cut far shallower.
- **Water.** Dry most of the year; flash floods after highland storms [vault blueprint]. They end in a teal mineral
  pool at the north-west edge of the acid dome.
- **What happened.** On the before map perennial streams ran down these channels. Today it's drought plus iron
  staining. The acid-mine-drainage-style chemistry is a reference, and its link to the extraction is **[open]**. Don't
  make every channel toxic [vault "Avoid"].
- **Edges.** Channel banks and braided bars, with the gravel flats on both sides. Water is a natural one-way spine
  (level design's N-rules).
- **Skyline.** The volcano NE, 38 km, about 3.5° up. The escarpment wall NW, about 7° up. The upper city W, 27 km.
- **Hook to look for.** Rio Tinto's red channels (Spain), iron-oxide desert washes.

### Dead Spring (scaffold)

- **Ground [map].** A hollow on the south floor (about 170 m) with two small stagnant mineral pools (teal) on a grey
  dried-pool floor with dead scrub.
- **What happened (the clearest before → now in the act) [map + vault].**
  - **Before:** "The Spring", a living freshwater oasis: open water, green, fed by the stream through the Caravan
    Approach and the stream from the Slums terrace (the before map's rivers are placeholders).
  - **Now:** inflow gone, so the water evaporated and salts concentrated in what was left (salinisation). The result is
    dead trees and shrubs standing in bleached ground around stagnant pools.
  - The decay cause is the loss of water, not acid. Keep it distinct from the Acid Pits [vault "salt flats and acid pits
    are not synonymous"].
- **Edges.** The hollow's rim (shallow). The pools act as blockers.
- **Skyline.** The volcano NE, 64 km. The upper city N, 33 km, a speck. The escarpment far west. The most open,
  lonely horizon in the act.
- **Hook to look for.** Deadvlei (Namibia): dead trees on a white pan. Salinised oases with dead palms.

### Acid Pits: the act's signature hazard (anchor)

- **Ground [map].**
  - A low salt dome (36–80 m) on the salt pan's southern edge, pushed up over a hydrothermal system as at Dallol
    [approved fix, 6 Nov].
  - The ground is amber crust, with a bright yellow sulfur crest between the pools.
  - Pools come in four kinds:
    - shallow acid green `#A8CF2A` with sulfur rims;
    - sulfur yellow-green `#D8D52B` with orange rims;
    - turquoise mineral acid `#1FB7A0`;
    - deep dark olive `#2F5A2E`.
  - [pending: the amber ring shrinks to about one cell round the pools, and white salt takes back the outer dome. That
    gives brighter pools on white, as in the reference.]
- **Priority [vault].** "A main theme of the deteriorating world and must really stand out", even beyond real Dallol.
  The field is localised to the dome. It is not the volcano's doing (map note).
- **What happened.** **Before:** clear blue hot springs on white travertine terraces. **Now:** acid, sulfur and amber.
  The cause, the machine's extraction acting on the hydrothermal system, is **[open]** in its mechanism. Show the
  before in the ground: white travertine steps still visible under the crust.
- **Edges.** Pool rims and crusted terrace steps. Medium pools act as blockers (marker note). Salt pan to the north and
  east, gravel and washes to the west.
- **Skyline.** The volcano N, 44 km, about 3° up. The escarpment far NW. Steam plumes on the field itself.
- **Hook to look for.** Dallol hydrothermal field (Ethiopia).

### Salt Flats (anchor)

- **Ground [map].** The lowest land in the basin (0–25 m), where every wash ends.
  - Halite crust with a faint pink tint, `#EBCBCB`.
  - Two pink brine pools in the north-east.
  - A small white gypsum dune field downwind (east-north-east) of the gypsum pavement. On the map it is barely above
    the pan; dune height is art's call.
  - [pending: the flats grow over the acid dome's outer ring.]
- **What happened.** Old evaporites, so the salt predates the catastrophe [vault]. How big the old salt lake was is
  **[open]**. It can't have stood higher than 400 m, the pass's spill height.
- **Edges.** Brine pools, crust ridges, the gypsum dunes, and the east rim hills (a ragged ridge [pending]).
- **Skyline.** The volcano N, 25 km, about 5° up (big). The escarpment far west, a line on the horizon.
- **Hooks to look for.** The Danakil salt pan (Lake Assale) with salt-polygon crust; hypersaline pink lakes; White Sands
  for the gypsum dunes [vault].

### Fossil Terraces and gypsum pavement (scaffold 09–10)

- **Ground [map].**
  - Ivory fossil-reef limestone benches (100–260 m) separated by wash-coloured gaps. Bench risers are about 20–80 m.
  - East of them, grey gypsum pavement steps down to the salt (25–64 m).
  - The benches are bedrock, the same in both eras.
- **What happened.** Deep-time shorelines of an old sea or lake [vault blueprint]. The only change is around them: on
  the before map green ground and streams surround the benches.
- **Edges.** Bench risers (good walls and ramps), and gaps that are dry washes.
- **Skyline.** The volcano NE, 28 km, about 5° up. The escarpment NW, 25 km.
- **Hook to look for.** Raised coral-reef terraces of the Danakil [vault sources]; limestone benches with fossil
  rubble.

### Basalt Fields (scaffold 07–08)

- **Ground [map].**
  - Old basalt: weathered dark brown-grey `#55483E`, raised as tablelands about 150–200 m above the floor (250–440 m).
  - Fresh charcoal flows `#2D2F2F` round the volcano.
  - [pending, option B of the change request: fresh flows also fill the north-rim saddle.]
- **What happened.** Old flows that predate the catastrophe; the volcano was active in both eras [map]. A natural, not
  machine-made, hazard.
- **Edges.** Flow fronts (stack several in the kit; real single flows are 5–30 m) and fissures.
- **Skyline.** The volcano NE, 19 km, about 6° up: dominant. The escarpment W.
- **Hook to look for.** Erta Ale and Afrera lava fields [vault sources]; aa against pahoehoe surfaces.

### Volcano (maybe a zone)

- **Ground [map].** An active cone of about 2,300 m with a small fluctuating summit lava lake, fresh charcoal flows and
  a plume leaning north-east. [pending: rebuilt as a proper cone; today it is a flat table on the map.]
- **What happened.** Active before and now. Not the source of the acid [map note]. No name.

### Upper city: finale, 4–6 combat zones (locked)

- **Ground [map].** A bench about 9 × 6 km at 900–1,020 m, cut into the red-brown escarpment.
  - Walled, with a citadel, a plaza and a temple (Azgaar's flags; placeholders).
  - The falls run along its west side. Its water intake is upstream on the plateau.
  - Placeholder population: 6,000, with 9,000 in the Slums.
- **Routes [map].**
  - In: the switchback up from the Slums.
  - Out: [pending] the main road leaves northward up a ravine ramp to the escarpment top, about 560 m above.
  - The city sits exactly where the only road-grade climb starts, which makes it a natural gate. Whether that is *why*
    it controls passage is **[open]**.
- **Story geography [vault, provisional].** The ambush happens in an abandoned district; the route back is sealed.
  - The map suggests the shelf's west end, by the falls slot, for the abandoned district [needs George].
  - District progression should climb north toward the ramp. Level design: up-screen is NE, so the city's route reads
    as climbing up and slightly left.
- **Skyline.** The cliff right above, N, about 10° up. The whole basin spread south and east below. The volcano E,
  57 km. The only zone that looks *down* on the act.

### Escarpment top: the act exit [pending]

- **Ground [map].** The plateau edge (about 1,500 m), cold desert.
- **What's beyond.** Act II's direction is **[open]**: north toward the central range, or west across the plateau. Level
  design needs it for the exit zone's T6.
- **Skyline.** The basin below to the south; the volcano E, 53 km.

## 5. Palette the map uses

These are the map's colours, a reference for telling zones apart, not the art palette:

- Escarpment `#8A4A2E`
- Rim hills `#9E7752`
- Gravel `#CDB58C`
- Washes `#B85D23` (pending a change to a redder tone, for example `#A0391F`)
- Old basalt `#55483E`
- Fresh basalt `#2D2F2F`
- Terraces `#E3D3A8`
- Gypsum pavement `#CFCBBE`
- Gypsum dunes `#F4F6F4`
- Salt `#EBCBCB`
- Acid ground `#C8661E`
- Sulfur `#F0CF2E`
- Dead Spring `#B1B5A7`
- Falls green `#6E8B3D`
- Brine `#c98aa8`
- Mineral pools `#49b3a8`

Each zone has its own ground family on the map (the author asked for "distinct tile materials"). The two pairs most at
risk of reading alike are the washes and the acid ground (being fixed), and the gravel flats and fans (being split).

## 6. Changes that would alter this handoff, if George approves

From `1_review.md` and `2_change_request.md`:

- The escarpment road and its exit marker (decided by George's "A or B").
- The Caravan Approach gets its own ground.
- The acid ring shrinks and the salt grows.
- The washes get a new colour.
- The floor splits into fans, gravel and silt flats.
- The volcano is rebuilt as a cone.
- The rims become ragged ridges.
- In the before map, the washes become streams and the falls continue to the Spring.

None of these moves a zone or changes a direction in section 2.

## Questions for George that block parts of this

1. Which way does Act II lie from the escarpment top? Level design needs it for the exit zone's direction.
2. May the falls slot and the shelf's west end be marked as the abandoned route and district for the betrayal?
3. A or B for the escarpment road's "only" (see `2_change_request.md`)? B also decides whether the volcano closed the
   north end in recent times.
4. How big was the old salt lake before the catastrophe? That decides how the Salt Flats', Dead Spring's and Washes'
   "before" look.
