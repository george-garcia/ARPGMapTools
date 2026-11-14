# <Act N>: world map handoff

**Owner:** the cartographer (`arpg-cartography`, ARPGMapTools). **Map at:** <ARPGMapTools commit> · **Vault read at:**
<commit/date> · **Updated:** <YYYY-MM-DD>

What the world map decides for this act, for the studio: which zones connect and in which direction, and what each zone
physically is, before and now. Story, quests and names are the narrative role's (the vault and the story docs); layouts,
art and light are the specialists'. Anything marked **open** is not decided: don't build on it as fact, ask George.

## 1. The region in one paragraph

Landform, climate, water, how the act's journey reads on the ground (descending into a basin, climbing out…), and the
one image of the region.

## 2. Zone graph

<Paste the table from `scripts/zone_graph.mjs world/acts/<act>.json --md`: zones, anchors, links with exit bearings,
return bearings, link status (decided / proposed / open) and source.>

- **Exit bearings (level design T6):** a zone's exit faces the bearing to the next zone; its entrance faces the return
  bearing. Within 45° is the level designer's tolerance.
- **Hub and waypoints:** <decided / open>.
- **Lore distances** never set a zone's size or walking time (ArtStandards §1 sets zone size).

## 3. Zones

One block per zone, in act order. Every fact names its source: a vault decision, a P-ID, or the map (op id).

### <id> <Name> (<role>, <status>)

| | |
|---|---|
| **Neighbours and directions** | <zone, bearing; …> |
| **Landform** | <escarpment foot / alluvial fan / salt pan / basalt field / gorge…; open or enclosed; height relative to neighbours> |
| **Ground and rock** | <primary and secondary surfaces at map scale: gravel, halite crust, gypsum, basalt, reef limestone…> |
| **Water** | <none / ephemeral wash / spring / brine / acid pools / falls; where it comes from and goes> |
| **Climate and weather** | <hyperarid, storms from…, heat> |
| **Seen from here** | <landmarks visible from this zone: the city on its shelf, the volcano's plume, the escarpment wall…> |
| **Transitions** | <what the ground does at each edge toward each neighbour, geologically> |
| **Before** | <the before era here: water, vegetation, settlement, use> |
| **Now, and what changed** | <the now era; the cause of each kind of change (drought, extraction, acid, abandonment…) as far as the vault says; open causes marked open> |
| **Palette and hook** | <the map's biome hex colours here; a real-world analogue to photograph for the hook (environment art Z2)> |
| **Light** | <latitude, so sun height and direction; haze, steam, ash> |
| **Field guide** | <link to this zone's section of the act's zone field guide (`references/field-guide.md`): walking-scale ground, plants, land use, asset seeds> |
| **Top asset seeds** | <the five to eight things environment art should build first, from the guide> |
| **Side-area ideas** | <the guide's Strong ideas for this zone, marked as ideas, not decisions> |
| **Open** | <what the map can't decide: questions for George / narrative> |

## 4. Changes since the last version

| Date | Change | Why |
|---|---|---|
