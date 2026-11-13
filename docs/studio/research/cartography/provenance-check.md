# arpg-cartography provenance spot check

Date: 2026-11-13. Skill: `/home/claude/arpgmaptools/.claude/skills/arpg-cartography/`. Research:
`/home/claude/arpgmaptools/docs/studio/research/cartography/`. No skill or research file was edited.

**Sample.** `random.seed(7)`, then `random.sample(pool, 20)` over G1–G37, K1–K34, H1–H24 and M1–M11 (106 rules), redrawn
until every file had at least 3. The 5th draw passed: G 6, K 6, H 4, M 4.

**Underlying sources opened (15 of 20 rules):** GSA Today Blue Nile paper (G6), Leeder & Gawthorpe 1987 (G10), Eos "Reading
history in Afar" (G20), Azgaar `features-generator.ts` (G37), the studio's own video notes LD-F and EA-F (H3, H15),
O'Leary mewo2 (K4, K7), the CEDEC gist (K17), the Kotaku pieces on Tost and Howard (K21), Azgaar's 2017 biome blog and
Destructoid GDC 2019 (K26), Turner 2019 (K29), and the Azgaar and MCP code for M2, M3, M7 and M10.

**Result:** 12 PASS, 8 FIX, 0 RETAG-INFERRED. None of the eight cites a source that says the opposite or doesn't exist.
Two contradict their source in wording (G10, K17). The other six cite the wrong finding or give a reasoned threshold or
conclusion a stronger origin tag than it has.

| Rule | File | Cited finding | Verdict | Note |
|---|---|---|---|---|
| G6 | geography.md | SCIENCE A1.13 [39] | PASS | A1.13 says it. **Source checked:** Gani et al. 2007 (GSA Today) puts the deepest incision at the western margin, "where the Blue Nile and the Tekeze River leave the plateau". It gives the 1.6 km gorge and a 2.5 km mean elevation for the north-western plateau. "Short steep streams fall into it" comes from A1.13's [35] (Awash), which I didn't open. |
| G10 | geography.md | SCIENCE A2.5–A2.6 [8]; PROJECT P19 | **FIX** | **Source checked:** Leeder & Gawthorpe 1987 says playas form "as close to the locus of maximum subsidence as the **footwall-sourced** fans will allow", and its footwall scarp "sources **small** alluvial fans". The rule's "pushed off it by the big fans" gets this backwards. Change it to "pushed off it by the fans off the master (footwall) scarp" or just "by the fans". The tags and P19 ("pan and brine pools are the lowest ground") are right. A2.6's own check ("plausible if the western fans are large") has the same slip, so fix it there too. |
| G16 | geography.md | SCIENCE A3.1–A3.2 | **FIX** (citation) | A3.1 ends at "fine flats → playa or pan". The rule's "mudflat → gypsum → halite pan" comes from A3.4 (solubility zoning, with "pan outward: halite, gypsum, carbonate/mudflat, gravel"). Change the citation to *SCIENCE A3.1–A3.2, A3.4.* |
| G20 | geography.md | SCIENCE A3.7–A3.8 [16][17] | PASS | A3.7–A3.8 say it, and A3.8 calls it a canon question. **Source checked:** Eos [16] supports "at least four superimposed coralgal units" and the region "covered by the Red Sea" (dated 230–24 ka). "Following the paleoshoreline" isn't in Eos, so it must come from [17] (PAGES), which I didn't open. |
| G22 | geography.md | INFERRED A3.10 | PASS | A3.10 is tagged INFERRED in the research, and the lists match. |
| G37 | geography.md | SOURCE A6.4 [46] | PASS | **Source checked:** `model/physical/features-generator.ts` `defineLakeSubtype` gives frozen, lava, dry, sinkhole, salt or freshwater from temperature, inlets, outlet and evaporation. Nothing in it is seasonal. A6.4 says the same for below sea level (T1) and river splits (T3). |
| H1 | world-to-zones.md | OBSERVED W1–W2; W34–W37; PROJECT P5 | **FIX** (wording) | W1 is about "a **PoE-style** act map". It notes that Diablo III's map was abstract but D4 shows places "where they actually are" (DEV, C6). "An ARPG act map is…" overgeneralises. Change it to "A PoE-style act map (our model) is…". The tag is right (OBSERVED, with DEV support in W1). |
| H3 | world-to-zones.md | DEV W4 | **FIX** (tag) | W4's DEV facts check out. **Source checked:** LD-F 18:16 has "every character gets their own personalized randomized road map" and "we no longer canonically say that the manor is to the north". But "keep one fixed map, one bearing per connection" is the research's INFERRED conclusion (W3 and W4 *INFERRED*). Change the tag to *DEV W4 (GGG moved from random to fixed act maps); INFERRED W3–W4.* |
| H7 | world-to-zones.md | level design T6; OBSERVED W15 | **FIX** (tag) | The D2 behaviour is OBSERVED (LD S37), but PoE2's "exit on the opposite wall" is COMMUNITY in W15. The **≥ 90°** threshold is W15's "*INFERRED map consequence*". Change the check row to *level design T6; OBSERVED W15 (D2 exits never share the entrance's edge; PoE2 per COMMUNITY); threshold INFERRED W15.* |
| H15 | world-to-zones.md | DEV W21; EA Z7 | PASS | **Source checked:** EA-F 28:00–29:50 has Olofsson saying Clearfell "is a little bit more open… more build-up towards it". The quote and the DEV tag match. |
| K4 | cartography-craft.md | COMMUNITY B8 | PASS | **Source checked:** O'Leary smooths the coastline and says a few small islands look fine but too many look messy, which supports the rule. Research nit (no change to K4): B8 says Turner "lists many small islands as a fault". Turner calls them "not particularly realistic" but says they make "an interesting map". |
| K7 | cartography-craft.md | COMMUNITY B13 [5] | PASS | **Source checked:** O'Leary says noise's "large-scale structure always looks a bit off", so he builds a "proto-landscape" from geometric primitives and then erodes it. The source is one practitioner. B13 says so, and COMMUNITY fits. |
| K17 | cartography-craft.md | DEV, second-hand B P1 [19] | **FIX** (wording) | **Source checked:** the CEDEC gist says the smallest triangles "serve the **tempo**" (B P1 has "set the pace"). The rule's "small shapes that set the **path**" doesn't match. Change "path" to "tempo". Also, "One big landmark per act, visible from most of its zones; medium relief between zones" is B P1's "For our map" application, so tag that sentence INFERRED. |
| K21 | cartography-craft.md | DEV B P7–P8 [25][28] | PASS | **Source checked:** Tost (Kotaku) says "the quest content dictated the size of the world, not the other way around". Howard (Kotaku) says "We needed to have something [there]". Research nit: B P7 credits the resizing to Tost and CDPR, but in the article Kuba Szamałek says it. |
| K26 | cartography-craft.md | DEV/DEV-practitioner B X3–X4; PROJECT P8 | **FIX** (tag) | **Sources checked:** Azgaar's 2017 blog has "focused mostly on colors than on correct biomes" and doubling peaks so as not to "break the basic laws of nature". Destructoid has Spider-Man's night "departed the most from reality". Both support the wording. But "DEV-practitioner" isn't a key in sources.md, and Azgaar is a map-tool author, not a game developer. Change the tag to *DEV B X4; COMMUNITY (one practitioner) B X3; PROJECT P8.* Optionally note that X4's example is about lighting, not geography. |
| K29 | cartography-craft.md | COMMUNITY B X8 [6] | PASS | **Source checked:** Turner, "In practice, I do some of both but should probably work harder on the tuning." It's one practitioner, which X8 states. |
| M2 | azgaar-ops.md | SOURCE D §0.1, §3 | PASS | **Source checked:** `model/graph/pack-generator.ts:30-50` drops deep ocean and inner lake points and splits coast cells. `grid-generator.ts:172-173` has spacing = sqrt(W·H/N). That gives 2.28 km at 1920×1080 px, 0.5 km/px and 100k points (D §3). |
| M3 | azgaar-ops.md | SOURCE D §1 | PASS | **Source checked:** `world/frames.json` act1 `sizeKm: [100, 64]`. `tools/azgaar-mcp/src/world.ts:79-81` `toMap` scales u by width and v by height separately. |
| M7 | azgaar-ops.md | SOURCE + OBSERVED D §2.2 | **FIX** (citation) | D §2.2 is OBSERVED only. "Only lakes are sinks" is D §2.1 (SOURCE). **Source checked:** `river-generator.ts:445-448` calls `resolveDepressions`, and `540+` is the "depression filling algorithm". Change the tag to *SOURCE D §2.1; OBSERVED D §2.2.* |
| M10 | azgaar-ops.md | SOURCE + OBSERVED D §2.7 | PASS | **Source checked:** `temperature-generator.ts:20-57` has sea-level temperature by latitude row minus 6.5 °C/km, and `world/config.json` has latitude 29.4 (Act I near 35.4° N). The 0–16 °C and 11.5 °C mean are D's OBSERVED measurement [S8], which I didn't re-run. |

## FIX items (exact changes)

1. **G10:** change "pushed off it by the big fans" to "pushed off it by the fans off the master (footwall) scarp". The source says footwall-sourced fans, which are the small ones. Make the same fix in research A2.6's check.
2. **G16:** change the citation to *SCIENCE A3.1–A3.2, A3.4.*
3. **H1:** change "An ARPG act map is…" to "A PoE-style act map (our model) is…".
4. **H3:** change the tag to *DEV W4; INFERRED W3–W4.*
5. **H7:** change the tag to *OBSERVED W15 (D2); PoE2 COMMUNITY; the ≥ 90° threshold INFERRED W15.*
6. **K17:** change "small shapes that set the path" to "small shapes that set the tempo", and tag the "one big landmark per act…" sentence INFERRED.
7. **K26:** change "DEV/DEV-practitioner" to *DEV B X4; COMMUNITY (one practitioner) B X3; PROJECT P8.* Either define DEV-practitioner in sources.md or stop using it.
8. **M7:** change the citation to *SOURCE D §2.1; OBSERVED D §2.2.*

Research-file nits (rules unaffected): B8 overstates what Turner says about islands, and B P7 credits Szamałek's resizing quote to Tost and CDPR.
