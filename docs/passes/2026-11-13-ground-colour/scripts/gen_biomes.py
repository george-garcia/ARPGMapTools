"""Writes world/eras/now/30-biomes.json and world/eras/before/30-biomes.json for the ground-and-colour pass."""
import json, copy
REPO = "/home/claude/arpgmaptools"
RIM = json.load(open("rim_polys.json"))
def load(p): return json.load(open(f"{REPO}/{p}"))
def byid(ops): return {o["id"]: o for o in ops}
NOW0 = byid(json.load(open("pass1-30-biomes.json")))
BEF0 = byid(json.load(open("pass1-before-30-biomes.json")))
VOLC = [o for o in load("world/base/10-act1-terrain.json") if o["id"] == "act1.volcano"][0]["args"]["polygon"]
COL = {"esc": "#A4532F", "rim": "#B98552", "fans": "#C9A07A", "mud": "#D4C5B3", "washes": "#8C2F1E", "terraces": "#F3E8C8",
       "palms": "#7F8A45", "dryland": "#A9A061", "gravel": "#D5BB88", "salt": "#F6F3EC", "gypsum": "#C4CAC6", "dunes": "#E9C77F",
       "basalt-old": "#4A403A", "basalt-recent": "#222425", "dead": "#9C9883"}
def op(id, note, name, polygon, heights=None, color=None, hab=None):
    a = {"frame": "act1", "name": name}
    if color: a["color"] = color
    if hab is not None: a["habitability"] = hab
    a["polygon"] = polygon
    if heights: a["heights"] = heights
    return {"id": id, "tool": "paint_biome", "note": note, "args": a}

def rock(era):
    """Rim rock that follows the crests and fades out into the continent (C1); the same geology in both eras (E1)"""
    out = []
    fade = "an outer ring that keeps only the higher ground, so the rock thins out into the continent's own ground instead of ending on a straight line (C1, P17)"
    for side, name, hab, col, lo in [("rim", "Rim Hills", 3, COL["rim"], (50, 47)), ("esc", "Rift Escarpment", 4, COL["esc"], (60, 58))]:
        what = ("Duller brown basement rock of the east horst, the south rim and the Caravan pass's south-east face (older than the escarpment's red beds)" if side == "rim"
                else "Red-brown rock of the master fault: the west escarpment, the Caravan pass's north-west face and the whole raised north block (P29), so the north reads as one fault wall")
        for ring, (h, tag) in zip(["ring3", "ring2"], [(lo[0], "outermost"), (lo[1], "middle")]):
            for n, poly in enumerate(RIM[ring][side]):
                out.append(op(f"{era}.biome.{'rim-hills' if side == 'rim' else 'escarpment'}.{'fade-2' if ring == 'ring3' else 'fade-1'}" + (f".{n}" if n else ""),
                              f"{what}: {tag} fade ring, {fade}", name, poly, [h, 100], col, hab))
        for n, poly in enumerate(RIM["core"][side]):
            out.append(op(f"{era}.biome.{'rim-hills' if side == 'rim' else 'escarpment'}" + (f".{n}" if n else ""),
                          f"{what}. Every cell at 44 or more within a few km of the rift floor; the outline follows the crest at a varying distance (deeper over the north block), not a frame (C1)", name, poly, [44, 100], col, hab))
    return out

def basalt(era):
    old = copy.deepcopy(NOW0["now.biome.basalt.old"]); old["id"] = f"{era}.biome.basalt.old"
    old["args"]["heights"] = [33, 43]
    old["note"] = ("Weathered outer basalt lobes on the floor below the north wall (heights up to 43, so the wall above stays fault-scarp rock, C1)"
                   + ("" if era == "now" else "; already old before the catastrophe"))
    flows = {"id": f"{era}.biome.basalt.recent", "tool": "paint_biome",
             "note": "Fresh charcoal flows from the volcano down its south side onto the floor and the apron" + ("" if era == "now" else " (the volcano was already there)"),
             "args": {"frame": "act1", "name": "Recent Basalt", "color": "#2D2F2F", "habitability": 0,
                      "polygon": [[0.74, 0.1], [0.775, 0.1], [0.80, 0.16], [0.84, 0.19], [0.88, 0.18], [0.905, 0.13], [0.93, 0.15], [0.93, 0.21], [0.88, 0.235], [0.82, 0.24], [0.79, 0.215], [0.75, 0.2], [0.735, 0.15]],
                      "heights": [33, 55]}}
    cone = {"id": f"{era}.biome.basalt.cone", "tool": "paint_biome",
            "note": "The cone itself (58 and up inside its foot) in fresh charcoal basalt, standing on the north block's red fault rock, so it reads as a cone and not a dark massif (C1, G4)",
            "args": {"frame": "act1", "name": "Recent Basalt", "polygon": VOLC, "heights": [58, 100]}}
    return [old, flows, cone]

def evaporites(era):
    salt = copy.deepcopy(NOW0["now.biome.salt"]); salt["id"] = f"{era}.biome.salt"
    gyp = copy.deepcopy(NOW0["now.biome.gypsum"]); gyp["id"] = f"{era}.biome.gypsum"
    dunes = copy.deepcopy(NOW0["now.biome.dunes"]); dunes["id"] = f"{era}.biome.dunes"
    dunes["args"]["heights"] = [22, 27]
    dunes["args"]["polygon"] = [[0.843, 0.385], [0.885, 0.395], [0.89, 0.59], [0.85, 0.595], [0.84, 0.5]]
    dunes["note"] = "Small gypsum dune field on the lee (ENE) edge of the gypsum bench, between the pavement and the pan, and not on the pan's floor: the pan-level cells stay salt (G19, G-c)"
    if era == "before":
        salt["note"] = "Halite crust on the pan, the lowest ground: the salt predates the catastrophe, so it is salt in both eras (E1, P14). How large the old salt lake was is still open (P24); no lake or shore is drawn"
        gyp["note"] = "Gypsum pavement east of the terraces: an evaporite older than the catastrophe (E1)"
        dunes["note"] = "Gypsum dunes downwind (ENE) of the pavement, as today (E1, G19)"
    return [salt, gyp, dunes]

def terraces(era):
    t = copy.deepcopy(NOW0["now.biome.terraces"]); t["id"] = f"{era}.biome.terraces"
    t["args"]["heights"] = [27, 100]; t["args"]["color"] = COL["terraces"]
    t["note"] = ("Ivory fossil-reef benches (heights 27 and up, so the h27 belt reads as terrace, not gravel); lighter than the gravel and gypsum around them (K-c)"
                 + ("" if era == "now" else "; bedrock in every era"))
    return t

def now():
    O = NOW0
    out = [O["now.biome.basin-ground"]]
    out.append(op("now.biome.fans.west", "Boulder fans and colluvium at the escarpment's foot: the Slums terrace and the falls' fan, the benches' toes and the floor below the wall, coarser and darker than the mid-basin gravel (G16, G17, G-b)",
                  "Boulder Fans", [[0.08, 0.40], [0.20, 0.36], [0.28, 0.40], [0.33, 0.43], [0.34, 0.5], [0.30, 0.56], [0.26, 0.64], [0.22, 0.74], [0.20, 0.80], [0.12, 0.80], [0.08, 0.6]], [36, 43], COL["fans"], 4))
    out.append(op("now.biome.fans.pass", "The Caravan pass's defile: talus and boulder fans off both walls, from the basin side to the pass mouth (G-b; the pass was unpainted desert)",
                  "Boulder Fans", [[0.22, 0.70], [0.16, 0.74], [0.08, 0.76], [0.0, 0.80], [-0.14, 0.87], [-0.33, 0.96], [-0.36, 1.04], [-0.12, 0.96], [0.05, 0.88], [0.18, 0.86], [0.25, 0.80]], [33, 43]))
    out.append(op("now.biome.fans.south", "Fans off the south rim's two segments and its relay saddle (G16, G17)",
                  "Boulder Fans", [[0.2, 0.84], [0.32, 0.86], [0.42, 0.86], [0.46, 0.92], [0.6, 0.94], [0.62, 1.0], [0.2, 1.0]], [35, 43]))
    out.append(op("now.biome.fans.east", "Small steep fans in the east horst's re-entrants and at its foot, between the scarp and the pan (G-a, G17)",
                  "Boulder Fans", [[0.93, 0.27], [0.99, 0.27], [1.02, 0.33], [0.96, 0.36], [0.93, 0.34]], [24, 43]))
    out.append(op("now.biome.fans.east-2", "Fan in the east horst's southern re-entrant (G-a, G17)",
                  "Boulder Fans", [[0.935, 0.57], [0.99, 0.58], [1.02, 0.64], [0.97, 0.68], [0.94, 0.65]], [23, 43]))
    out.append(op("now.biome.mud", "Playa mud: the fine, lower ground between the gravel and the evaporites, west of the washes and round the dome's west and south foot (the downslope order gravel, mud, gypsum, salt; G16, G-b)",
                  "Playa Mud", [[0.36, 0.36], [0.47, 0.33], [0.6, 0.36], [0.64, 0.5], [0.62, 0.6], [0.6, 0.72], [0.62, 0.8], [0.66, 0.9], [0.7, 0.95], [0.5, 0.97], [0.44, 0.9], [0.4, 0.84], [0.38, 0.72], [0.36, 0.55]], [27, 31], COL["mud"], 2))
    out += rock("now")
    out += basalt("now")
    w = copy.deepcopy(O["now.biome.washes"]); w["args"]["color"] = COL["washes"]
    w["note"] = "Oxidised wash floors: the main corridor south to the mineral pool and the gaps between the terrace benches, in a deeper iron rust than the acid ground so the acid field stays the act's loudest colour (K-b, P20)"
    out.append(w)
    out.append(terraces("now"))
    out += evaporites("now")
    ds = copy.deepcopy(O["now.biome.dead-spring"])
    ds["note"] = "The dying spring's ground: muddy, salt-stained grey-olive round its stagnant pools and dead scrub, deliberately the dreariest colour in the act (the story's failed oasis)"
    out += [O["now.biome.acid"], O["now.biome.sulfur"], ds]
    out.append(op("now.biome.date-palms", "A thin line of date palms along the falls' last cascade and the Slums, watered by the stream (P28); dun green, not oasis green: the present-day map stays a dying desert (P13, P28). Replaces the green Spring Oasis strip, which now belongs to the before map",
                  "Date Palms", [[0.215, 0.395], [0.235, 0.39], [0.262, 0.42], [0.27, 0.455], [0.252, 0.47], [0.232, 0.45], [0.212, 0.42]], [36, 46], COL["palms"], 12))
    for n, (poly, where) in enumerate([
            ([[0.115, 0.14], [0.15, 0.135], [0.175, 0.19], [0.165, 0.235], [0.135, 0.22], [0.12, 0.18]], "at the head of the gorge, the city's nearest fields"),
            ([[0.02, 0.05], [0.07, 0.085], [0.075, 0.13], [0.04, 0.13], [0.0, 0.1]], "mid-valley"),
            ([[-0.14, -0.075], [-0.1, -0.06], [-0.095, 0.02], [-0.125, 0.02], [-0.15, -0.03]], "upstream, toward the stream's head")]):
        out.append(op(f"now.biome.dryland-terraces.{n + 1}", f"Dryland terraces {where}: small stone-terraced fields along the falls stream's valley on the plateau (sorghum, millet, barley, teff and chickpeas, watered by check dams, flood farming and channels off the stream), failing as the stream shrinks (P28). Dun-olive and low habitability: arid farming, not green land",
                      "Dryland Terraces", poly, [53, 58], COL["dryland"] if n == 0 else None, 8 if n == 0 else None))
    return out

def before():
    B = BEF0
    basin = [o for o in load("world/base/10-act1-terrain.json") if o["id"] == "act1.basin"][0]["args"]["polygon"]
    out = [op("before.biome.floor", "The basin floor under the before era's natural climate stays grassland, but the climate's forest patches on dry ground (below the north wall, on the volcano's apron) are taken back to grassland: green ribbons and spots belong where the water is (the falls, Spring Brook, the Spring and its outflow; G25, E1)",
              "Grassland", json.load(open("floor_poly.json")), [20, 43])]
    out += rock("before")
    out += basalt("before")
    out.append(terraces("before"))
    out += evaporites("before")
    tr = copy.deepcopy(B["before.biome.travertine"])
    tr["note"] = "[provisional, P24 open] Before the machine: white travertine terraces round clear hot springs on the dome. Whether the hydrothermal field predates the machine is George's open question; this is a cartographer's draft, not canon (E2)"
    out.append(tr)
    out += [B["before.biome.oasis"], B["before.biome.oasis.falls"]]
    out.append(op("before.biome.oasis.brook", "A green ribbon along Spring Brook from the Slums' site to the Spring: green only where the water runs (G25, E1)",
                  "Spring Oasis", [[0.235, 0.44], [0.265, 0.44], [0.29, 0.55], [0.33, 0.65], [0.37, 0.73], [0.35, 0.75], [0.31, 0.67], [0.265, 0.56]]))
    out.append(op("before.biome.oasis.outflow", "A green ribbon along the Spring's outflow to the pan's south-west arm, ending where the water spreads on the salt (G25, E1)",
                  "Spring Oasis", [[0.47, 0.83], [0.55, 0.84], [0.61, 0.85], [0.63, 0.88], [0.61, 0.9], [0.55, 0.885], [0.48, 0.875]], [24, 40]))
    return out

# --- palette: the beauty of a dying desert (George, 13 Nov 19:57); one colour per biome name, applied on the first op that paints it
RECOLOUR = {"Gravel Flats": "gravel", "Salt Flats": "salt", "Gypsum Pavement": "gypsum", "Gypsum Dunes": "dunes", "Old Basalt": "basalt-old",
            "Recent Basalt": "basalt-recent", "Dead Spring": "dead", "Fossil Terraces": "terraces", "Mineral Washes": "washes",
            "Rift Escarpment": "esc", "Rim Hills": "rim", "Boulder Fans": "fans", "Playa Mud": "mud", "Date Palms": "palms", "Dryland Terraces": "dryland"}
def recolour(ops):
    seen = set()
    for o in ops:
        n = o["args"]["name"]
        if n in RECOLOUR:
            if n not in seen: o["args"]["color"] = COL[RECOLOUR[n]]
            else: o["args"].pop("color", None)
            seen.add(n)
    return ops
_now, _before = now, before
now = lambda: recolour(_now())
before = lambda: recolour(_before())

if __name__ == "__main__":
    import sys
    for era, ops in [("now", now()), ("before", before())]:
        ids = [o["id"] for o in ops]; assert len(ids) == len(set(ids)), ids
        path = f"{REPO}/world/eras/{era}/30-biomes.json"
        if "--write" in sys.argv:
            json.dump(ops, open(path, "w"), indent=2, ensure_ascii=False); open(path, "a").write("\n")
        print(era, len(ops), "ops")

