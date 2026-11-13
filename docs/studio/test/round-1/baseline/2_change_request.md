# Geography change request: the act's exit up the escarpment. Answer: accept with changes

**Request (from the narrative skill).**

- **Story function:** the act's exit. The main road continues past the upper city, up the escarpment, onto the plateau
  above. It is the only way out of the basin toward the highlands, so the player must pass through the slaver city to
  leave.
- **Feature:** frame act1, the main road from the upper city (op `now.route.*`) to the escarpment top.
- **Era:** now, and before if a road existed.
- **Proposed operations:** extend the main road with `add_route`.

**Answer: accept the road; change the wording of the claim; one choice for George.**

- The road is geologically sound, and the terrain already contains the ramp it needs. I'd draw it as written below.
- The claim "the only way out of the basin toward the highlands" is not true on the current map, and no map can make it
  literally true. The geography supports "the only road up the escarpment from the basin". How hard that "only" should
  be is a story decision (option A or B below), so it goes to George.
- Nothing is built yet. This run was told not to change the map.

## 1. Check against the geology

**The ramp exists.** The upper city sits at h49 (961 m) on its shelf. Directly north of the shelf, a ravine runs up
between ridges of h59–62 to the escarpment top:

| Point | Height | Metres |
| --- | --- | --- |
| (0.31, 0.30) | h50 | 1,024 m |
| (0.31, 0.25) | h53 | 1,225 m |
| (0.31, 0.20) | h55 | 1,369 m |
| (0.32, 0.16) | h55 | 1,369 m |
| (0.32, 0.12) | h57 | 1,521 m |

- That's about 560 m of climb over about 14 km. The steepest stretch is the first 3 km above the walls, at about 6 %.
- Azgaar's eroded bake (the Gaea tile) agrees: city 870 m, ravine 1,274–1,291 m, top 1,434 m.
- A cart road can do this with a few hairpins below the walls.
- In real rifts this is a relay ramp: the place where an escarpment's main fault hands over to the next one and the
  ground steps down in benches instead of one cliff. The shelf is the lower bench and the ravine is the upper one.
- Real salt caravans climb the Danakil's western escarpment through valleys in the same way.

**The city corks the ramp.**

- The west escarpment is a single-cell cliff of about 1,000 m almost everywhere (for example, h58 → h40 between u 0.10
  and 0.15 at v 0.60).
- The only bench on the west side is the shelf. The falls slot (h46) also leads only onto the shelf.
- Keeping every step under 10 %, the route from the Slums onto the plateau through the city is 13–20 km.
- Banning the shelf, there is no route under 10 % anywhere along the west wall.

**But "only way out" fails twice.**

1. **The Caravan Approach is itself a way out of the basin.** It's the basin's spill point (h38, 400 m) and the road the
   caravan came in on. So it's literally false that the city is the only way out of the basin. Only the way up to the
   highlands goes through the city.
2. **The north end leaks.** The north rim (`act1.rim.north`, h45) meets the plateau's gentle eastern flank. Avoiding the
   shelf, there is a cart-grade route (8–10 %) from the Slums east across the floor, past the washes' head and the
   basalt's west edge, up the north rim and onto the plateau at (0.48, −0.07). It's 76–79 km long.
3. **The long way round exists too.** Out through the pass and up the plateau's south-west back slope near u −0.35
   (about 111–135 km). Every plateau has a back slope, so no terrain edit can remove it short of a cliff ring round
   100+ km of highland, which would be implausible.

Even so, the city road wins clearly: about 15 km against 76+ km. That's enough for "the only road", not for "the only
way".

## 2. The changes

### Accepted as asked, with corrected ids (`now` era)

The request names op `now.route.*`, but the main-road ops are `now.road.main.approach` and `now.road.main.ascent`. Add
this to `world/eras/now/50-routes.json`, immediately after `now.road.main.ascent`. The road goes through the city, in at
the switchback gate and out on the north side, not past it.

```json
{
  "id": "now.road.main.escarpment",
  "tool": "add_route",
  "note": "Main road, the escarpment climb and Act I's exit: out of the upper city's north side and up the ravine ramp behind the shelf to the escarpment top, the only road up the escarpment from the basin (narrative change request, 13 Nov 2026). About 560 m of climb over 14 km; the hairpins mark the steepest stretch just above the walls",
  "args": {
    "frame": "act1",
    "group": "main-road",
    "points": [
      [0.29, 0.345],
      [0.305, 0.312],
      [0.296, 0.294],
      [0.314, 0.276],
      [0.304, 0.258],
      [0.311, 0.225],
      [0.305, 0.19],
      [0.318, 0.158],
      [0.315, 0.12]
    ]
  }
}
```

Every vertex sits on a ravine cell (h48–57). The line stays east of the falls stream (u 0.20–0.24) and the upper city's
intake, and crosses only Rift Escarpment ground and then Cold desert on the plateau.

Add this to `world/eras/now/60-markers-labels.json`, after `now.marker.dead-spring`, so the studio has an anchor for the
exit zone:

```json
{
  "id": "now.marker.act-exit",
  "tool": "add_marker",
  "note": "Act I's exit at the escarpment top",
  "args": {
    "frame": "act1",
    "point": [0.315, 0.115],
    "type": "act exit",
    "name": "Escarpment Top",
    "note": "<p>[placeholder] Name not approved.</p><p>Act I's exit: the main road tops the escarpment here after passing through the upper city. Beyond is the highland plateau. Act II's direction, the means of passage and the boss are open.</p>",
    "icon": "⛰️"
  }
}
```

In `now.label.region`'s note, add one sentence after the "Locked" paragraph:

```html
<p><b>Act I's exit (provisional, 13 Nov 2026):</b> the main road continues through the upper city and up a ravine ramp
behind its shelf to the escarpment top; it is the only road up the escarpment from the basin. How the city controls
passage is open.</p>
```

The road does not continue onto the plateau. Act II's direction is undecided, so the map stops at the top instead of
inventing a destination.

### The "only" claim: George picks A or B

**A, soft (recommended unless the story needs more).** No terrain change. The map says "the only road up the
escarpment". The alternatives the map shows are:

- the north end: 76+ km over the basalt and the north rim, beside an active volcano, with no water;
- the south-west back slope: 110+ km back out through the pass, along the slavers' own caravan road.

Both are 4–9 times longer and worse for a wanted fugitive. That lets the vault's open question ("why the city controls
passage") stay open, and the plausibility gate ("why is going around the town worse than going through it?") gets
concrete numbers to answer it with.

**B, hard.** Fresh flows from the active volcano fill the north-rim saddle. Lava runs downhill into exactly that low gap
between the volcano and the plateau. Fresh aa lava with open fissures is a real barrier to carts and animals. In a
simulation that treated the flows as impassable, the only detour left was the south-west way round, about 130 km.

Ops for B, to add after `now.biome.basalt.recent` in `world/eras/now/30-biomes.json`:

```json
{
  "id": "now.biome.basalt.recent.north-rim",
  "tool": "paint_biome",
  "note": "Fresh flows from the active volcano filling the north-rim saddle: the north end of the basin is impassable to carts (geography change request, option B)",
  "args": {
    "frame": "act1",
    "name": "Recent Basalt",
    "color": "#2D2F2F",
    "habitability": 0,
    "polygon": [[0.46, -0.3], [0.8, -0.3], [0.82, -0.05], [0.76, 0.04], [0.62, 0.07], [0.55, 0.14], [0.5, 0.16], [0.46, 0.05]],
    "heights": [40, 52]
  }
}
```

Optionally, so the flows also read as rough in 3D, add this to `world/base/10-act1-terrain.json` before
`act1.finalize`. Because it's in the base terrain it affects both eras, but `roughen` 2 is mild:

```json
{
  "id": "act1.north-rim.flows",
  "tool": "sculpt",
  "note": "Blocky, fissured flow surface across the north-rim saddle",
  "args": { "frame": "act1", "polygon": [[0.46, -0.3], [0.8, -0.3], [0.82, -0.05], [0.76, 0.04], [0.62, 0.07], [0.55, 0.14], [0.5, 0.16], [0.46, 0.05]], "op": "roughen", "value": 2, "feather_km": 2, "noise_km": 1.5, "seed": 232, "clamp": [40, 52] }
}
```

B carries a consequence George should choose knowingly. If the flows are recent (present day only), then in the before
era the north end was open, and the volcano is why the city's road became the only road. That would be a canon-level
answer to "why the city controls passage". If the flows are old (both eras), the city's site was always the gate. The map
must not pick either without George.

### Before era: no op yet

The terrain is shared, so the ramp exists in the before map too, and a natural ramp attracts traffic in any era. But the
vault keeps "what stood at the city site" and "where the old caravan road once led" open, and the before map has no
settlements or routes yet. A lone road would imply an answer. When George decides, the op is ready:
`before.road.escarpment`, the same points, in an old-road style.

## 3. What stays unchanged

- The upper city's shelf, the Slums, the switchback, the falls and the water intake.
- The Caravan Approach and the main road's approach leg.
- All terrain, unless option B's optional roughen is chosen.
- Zones stay unjoined (no zone-to-zone paths); this is the real road, as for the approach.

## 4. Validation once built

1. `npm run world` (and `npm run world before` if B touches base terrain).
2. `screenshot` the act1 frame (biomes, routes, burgs) and a close-up of the shelf and ravine. Check against
   `world/reference/act1-overview.jpg`: on the overview the road also climbs from the upper camp toward the top, though
   its dotted lines carry no meaning.
3. `query_cells` along the polyline: every vertex h48–57, no grade above about 8 % between neighbouring cells.
4. `screenshot_3d` act1 low: the road must read as climbing the ravine, not crossing the cliff.
5. Re-open `now.map` in the desktop app.
6. Gaea re-export: `mask-roads.png` gains the climb.
7. If B: re-run the bypass check. The shortest route onto the plateau that avoids the shelf should be about 130 km via
   the pass. Also screenshot the north rim in 2D and 3D.

## 5. Notes for the narrative skill

- The request has no physical reason or evidence (the template's fields).
- "Past the upper city" should be "through": the road enters by the switchback and leaves northward, so the player
  can't skirt the walls.
- The 13 Nov spine's sealed return route and abandoned upper-city district have a candidate geography on the map: the
  falls slot up to the shelf's west end (see `1_review.md`, finding 8). That is not part of this request.

## Questions for George

1. Option A or B for the "only"? If B, are the flows present-day only, or old?
2. Was there a road up the ramp in the before era? That depends on what stood at the city site.
3. Which way does Act II lie from the escarpment top: north toward the central range, west across the plateau, or not
   decided? Level design needs it for the exit zone's direction (their rule T6).
