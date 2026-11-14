# Act I full review: story, world and geography (13 Nov 2026)

**By** the cartographer skill (`arpg-cartography`), with a full read of the story vault. **Map:** both eras rebuilt fresh
from the ops today (now 115 ops, before 75, no errors). **Vault:** every note, as of 13 Nov (including George's
uncommitted edits). Evidence: [`2026-11-13/map_evidence.md`](2026-11-13/map_evidence.md) (numbers, screenshots, ops
for every fix) and [`2026-11-13/story_world.md`](2026-11-13/story_world.md) (canon table, contradictions, gates, zone
readiness). Nothing in the map or the vault was changed by this review.

## Verdict

The **foundations are strong**: the world premise is coherent, the 13 Nov act spine (refuge → promised passage →
betrayal → fight up through the city → exit) gives Act I a real turn, and the Dallol basin is a better-than-usual
geological stage — lopsided rift, closed basin, the pan as the low point, a coherent downslope order, a continent whose
rivers, ranges and climate belts all check out.

The **weak point is the join between story and land.** The spine now depends on things neither the vault nor the map
has settled: why the city controls the way out (today the map has an easier climb at the basin's north end), what the
city drinks and eats (its only stream runs uphill and has no rain feeding it), why a wanted fugitive is safe in the
Slums, what the abandoned route is, and what lies beyond the city. One geographic answer fixes most of these at once
(§4). The map also has four physical faults that break its own rules (water running uphill, ground below the pan, the
before era painting salt as grassland), all fixable without changing canon.

## 1. Story and world

**Decided and consistent:** a dark, grounded ARPG where bodies (flesh, grafts, machines) matter; a world not waiting
to be saved; a wanted runaway seeking a better life; the 13 Nov spine with the Slums leader as hub contact and betrayer;
zones 01 (caravan escape) and 02 (the Slums, safe hub) locked; the Dallol basin and its layout; a medium-sized slaver
city with its Slums below the upper city; the acid pits as the act's signature. Full table: `story_world.md` §1.

**Out-of-date text (16 places; newest dated decision wins):** the most misleading are
- the "protected inside the town" law (10-26) still in Path A, the arrival scene and Faction Ideas — replaced on 11-06
  by "free citizens, no protection directive";
- "old battlefield salvage" still in Path A, the Slaver Faction note and Faction Ideas — replaced on 11-02 by an
  ordinary destroyed ruin;
- "small-to-medium camp" in Path A and the scaffold — replaced on 11-03 by "medium-sized city";
- Paths B and C still reading as live alternatives; Notion and tldraw still named as authorities;
- the scaffold's "camp gate / inspection" zones, which the betrayal entry (11-13) no longer uses;
- the map repo's `world/README.md` still saying the Slums and upper city are 30 km apart (they're ~7 km).
Each with its note and section: `story_world.md` §2. **Proposal:** a clean-up pass marking these superseded (George's
permission; the vault is narrative's).

**Story-logic gates** (`story_world.md` §3):

| Gate | Verdict | Smallest repair (options) |
|---|---|---|
| Food for the city | **fails** — no source anywhere | farms on the plateau the city controls; or food by caravan for a basin export (salt, sulfur), the real Afar pattern |
| Why captives come here | weak | labour for that export (salt cutting, sulfur work) — also gives the salt and acid zones present-day people |
| A wanted fugitive safe in the Slums | **fails** under the 11-06 rule | safety is the leader's personal protection, not law — which the betrayal then turns into the trap |
| The city controls passage | **fails** (open, yet the spine needs it) | the city sits at the only graded climb onto the plateau (§4) |
| The abandoned route and district | **fails** (undefined) | an old water stair or tunnel up the falls slot to a district abandoned when the water fell |
| The act's exit | **fails** (open) | up onto the plateau through the city's gate, guarded by the boss |
| Water for the city | weak | the falls stream, fed by a spring line on the master fault (needs the map fix W1/W2) |
| The acid pits' cause | weak (geology fine, story link open) | extraction lowered the groundwater, so volcanic gas now dominates the old hot springs |
| The Dead Spring | weak | the same falling water table — one environmental story for the act |
| Commander rides past; patrol already knows | weak | he can't be sure and the leader's shelter has witnesses; a mounted survivor reached the city first |

**Story craft for an ARPG** (`story_world.md` §6). Strengths: a personal motive, a real midpoint reversal, a hub that is
both refuge and trap, and geography with built-in before/after storytelling. Weaknesses, each with a proposal:
1. **The middle of the act has no quest engine** (~12 combat zones between refuge and betrayal). *Proposal:* the middle
   is the price of passage — the leader's two or three jobs, each a cluster, each reading differently after the betrayal.
2. **The slavers vanish between the arrival scene and the betrayal.** *Proposal:* the arrival commander as the act's
   recurring face (patrols, a bounty notice, an encounter at the acid field), a candidate for the boss.
3. **No hub after the betrayal.** *Proposal:* a temporary refuge inside the city, or the Slums revisited at the end, changed.
4. **Flesh-versus-metal and the promised beauty barely show in Act I; horror is thin.** *Proposal:* put grafts and
   machines in people (the leader, slaver armour, one non-hostile old machine); one earned beauty beat (a surviving clear
   hot spring, or the first sight of the green plateau at the exit); one dread thread — *the basin is drying*.
5. **Too close to PoE2 in places** (the captive opening, the farm-machine quest copied from Treacherous Ground).
   *Proposal:* keep the betrayal and the caravan's social texture as the signature; drop the farm-machine copy.

## 2. Geography: the continent

Coarse checks **pass**: one landmass with ocean all round; ranges in belts (a central east–west spine, ridges NE–SW and
N–S); every trunk river ends in the sea or a lake (the Slums falls ends on land by design); climate belts fit the
latitude and the south-westerlies (wet coasts, dry interior, 69% desert today, 2–4× wetter before). **One finding:**
Act I's paint stops on straight lines, so at continent scale it shows as a brown box set into the map (C1, MAJOR).

## 3. Geography: Act I, ranked

Each with its rule (in words) and, in `map_evidence.md`, the exact numbers and the fix as ops. **P7** = fixable under the
standing autonomy (makes geographic sense, fits the theme, looks good, settles no canon).

| # | Sev | Finding | Rule broken | Fix |
|---|---|---|---|---|
| W1 | **BLOCKING** | **The falls stream — the city's only water — runs uphill** for its first ~70 km (h53 → h62 → h40, 16 uphill steps) | Water runs downhill | Cut a graded valley along it (P7) |
| W3 | **BLOCKING** | **The main mineral wash runs uphill** (26 → 33 → 34) | Water runs downhill | Channel corridors; move the wash routes (P7) |
| W4 | **BLOCKING** | **Water and ground below the pan:** acid pool f's surface is 19.9, below the brine pools (20.9); acid c and the Dead Spring sit level with them; one land cell is at h20 | The pan and brine pools are the lowest ground (approved 11-06) | Raise the pits' shore cells; tighten their edges (P7) |
| E1 | **BLOCKING** | **The before era paints the salt, gypsum and escarpment rock as grassland and forest** (88 + 142 + 135 cells); the before-era Gaea tile then has no salt mask | Bedrock and evaporites predate the catastrophe (vault LOCKED 11-02) | Before-era rock and salt paint (P7) |
| A4 | MAJOR (story) | **The basin's north end is an easier climb onto the plateau than the city's road** (22 km at ≤13% vs 24 km; at ≤10% only the north route exists) | The spine: "the way forward is through the city" | **George** (§4) |
| W2 | MAJOR | **The falls has no catchment:** the plateau gets no rain in either era | Permanent water comes from a wetter source | Note a spring line on the master fault (P7 wording); the cause is **George's** |
| W5 / W6 | MAJOR | Before era: every river ends in a small *freshwater* pool on the acid dome, not the pan; the before lakes are identical to today's | Rivers end at the basin's sink; a lusher era shows larger lakes | Designed before-era rivers into the pan (P7); a larger old lake needs **George** (§4) |
| A1 / C1 | MAJOR | The east and south rims are still straight walls (~1 km spread over 40–75 km); the paint frames the act | Margins are segmented, never a box (George, 11-06) | Offset rim segments; paint that fades into the continent (P7) |
| A2 | MAJOR | The basin is wider across its master fault than along it (80 × 54 km, axis 10° off E–W) | Rift basins are long along the rift | **George**: accept, or extend the rift beyond the frame |
| A3 | MAJOR | The volcano is a flat table with a one-cell shaft, and drops ~2,000 m onto the pan in two cells | A cone reads as a cone; fans between a flank and the pan | A stacked cone with an apron (P7) |
| K-a | MAJOR | The salt flats have shrunk to a sliver (6.7% of the floor vs 21% acid), though the vault praised them | Area shares match the story's weight | Widen the pan into the NE arm (P7) |
| K-b | MAJOR | Washes and acid ground are near-identical orange (ΔE 8) | Colours separate; the signature pops | Washes to a deeper rust `#933A2A` (P7) |
| K-c | MAJOR | Fossil terraces read as speckle and nearly match the gravel (ΔE 11) | Region identity | Height band and a paler cream `#EEE4C8` (P7) |
| G-a / G-b | MAJOR | The pan meets steep ground with no fans (29% of salt cells); one gravel sheet covers 37% of the floor and four zones | Downslope order; neighbouring zones differ | Fans; boulder-fan and playa-mud bands (P7) |
| W7 | MINOR | Acid pools a and d have merged (13 lakes, not 14); 10 lakes have random names | One lake per pool; name what matters | Move pool d; name every pool (P7) |
| A5, G-c, K-d…K-f, P-a, P-b | MINOR | Escarpment benches missing south of the city; gypsum dunes on the pan floor; mineral pool teal too close to acid teal; untagged placeholders; the Dead Spring marker 9 km off; one 18% road leg; a flat pass trench | various | All P7 |
| GA-a | MINOR | The Gaea export takes heights from Azgaar's eroded 3D bake, which cuts ~79 km² of the pan below the brine pools | Flag map problems seen through Gaea | A tool change: `export_gaea` takes protected ground from the map's heights (**George**: approve) |

**What checked out** (no one needs to re-check): the basin is closed and lopsided (west lip 1,600–1,940 m, east horst
790–1,020 m); the plateau stands above the land outside; the pan is the lowest land apart from one cell; the downslope
order on the main transect; gypsum dunes downwind; the acid field is the most saturated thing on the 2D map; the city
on its shelf 432 m above the Slums at the falls; the approach road ≤3%; routes show only traffic; heights identical in
both eras.

## 4. Where story and land meet

The story leans on the land in 31 places (`story_world.md` §4). The checks that matter most:

- **Does the city control the way out?** The land beyond the Caravan Approach pass is **lowland** (h38, ~400 m), so the
  pass leads back down, not up. The only ways onto the plateau are the city's ramp and the basin's north end — and the
  north end is the easier one today. **George's call:** (a) canon only — the city's ramp is the climb with water and a
  graded road, the north end is dry, long and slaver country (no map change); (b) raise the north rim between the
  plateau and the volcano into a continuous scarp so the city's ramp is the only practical climb (a large terrain change);
  (c) law and patrols.
- **One answer that fixes most of the failed gates** (a proposal, not canon): *the upper city sits at the head of the
  only graded climb from the basin onto the highland plateau, along the falls stream; the plateau farms feed it; the
  basin pays in salt (and sulfur), cut by captives.* That gives the city its power over passage, its food, the reason
  captives come, people in the salt and acid zones, the act's exit (up through the gate, past the boss) and Act II's
  direction (the plateau). The map supports it once W1 is fixed and the north end is settled.
- **The abandoned route:** the falls slot is the natural candidate — an old water stair or tunnel to a district
  abandoned when the water fell, tying the betrayal to "the basin is drying".
- **The map states things the vault leaves open** (the before-era hot springs on the acid dome, the volcano not being
  the acid's source, the falls as the city's water, the outpost as a waystation). They're reasonable, but they are the
  cartographer's proposals: pass 2 below marks them as provisional in the map's notes until George decides (E2, K-e).

## 5. Readiness for the studio

The studio builds each zone from a pass-0 brief: purpose, beats, map type, what happened here, the cause of each
decay, its place on the act's dread curve (`story_world.md` §5).
- **Close to ready:** zone 01. **Partial:** the Slums, the washes, basalt, terraces, salt. **Blocked:** the Ruined
  Outpost, the Dead Spring (it has no slot in the 19-zone scaffold), the acid pits, the betrayal route and district, the
  upper city.
- **Act-wide blockers:** no zone order or clusters, no dread curve, no Act I enemy roster, no map type per zone.
- **The studio still reads the retired story** (`Docs/Story.md`, `Docs/Act1.md`, `Docs/Act1Zones.md`, and the
  environment-art skill names retired threads). Until the vault's Act I lands in those docs (or the producer is pointed
  at the vault's briefs), every brief would be drafted from the Flooded Lowlands.
- **Zone graph** (computed): the Salt Flats' entrance and exit are only 63° apart, the Slums' outpost and Dead Spring
  exits 42.5° apart, and Salt → Acid runs down-screen; five zones have high ground on the camera side (the escarpment
  west of the pass, the Slums and the upper city; the south rim at the Dead Spring and the acid pits). Moving the salt
  anchor north-east fixes the first (a P7 map change); the rest are George's call or level design's.

## 6. What happens next

**I can do now under P7** (two map passes, each with before/after 2D, 3D and Gaea evidence and its own PR): (1)
terrain and water — the falls valley, wash channels, pool fixes and names, offset rims, a real volcano cone, fans, a
wider pan, the pass col, designed before-era rivers; (2) ground, colour and notes — before-era rock and salt, washes
and terraces recoloured, fans and playa bands, the rim paint fading into the continent, placeholder tags, the region
note updated to the 13 Nov spine, exaggerations and provisional answers marked in the notes.

**George decides, ranked by what it unblocks:**
1. What lies beyond the city, and what lets it control the way out — including the north end (§4 a/b/c).
2. What the city lives on and why captives come here (the salt-and-plateau proposal, or another).
3. What keeps a wanted fugitive safe in the Slums under the 11-06 rule.
4. What the leader asks for before offering passage (the middle-act quests) and in what cluster order.
5. What the abandoned route is, why that district is abandoned, how the way back is sealed.
6. Who the Act I boss is.
7. The acid pits' cause, and whether the hot springs existed before the machine (the map assumes yes).
8. The Dead Spring's role, and why it died while the falls still run.
9. How wet the basin was before: a real old lake (breaks the one-terrain rule), a seasonal marsh, or a dry playa.
10. What feeds the falls (a fault spring line, central-range meltwater, or the machine).
11. Camera-side relief and the zone-graph failures (bend, fade, or accept).
12. Clean-up permission for the 16 stale passages; pointing the studio at the vault; approving the `export_gaea` fix
    and the profile/river/local-climate tools (TG1–TG3), since four BLOCKING findings needed workarounds to measure.
