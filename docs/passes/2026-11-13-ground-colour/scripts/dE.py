"""ΔE (CIE76) table for every pair of neighbouring Act I colours, counted on the cell graph (Delaunay edges <= 3.4 km),
inside the act (frame-local -0.1..1.1). Lakes use their style group's fill. Usage: dE.py sim <era> | dE.py dump <era> <dir>"""
import sys, json, os
import numpy as np
from scipy.spatial import Delaunay
from collections import Counter
from colour import de76, chroma
REPO = "/home/claude/arpgmaptools"
GROUP_FILL = {}
for f in ["world/eras/common/10-water.json", "world/eras/now/20-water.json", "world/eras/before/20-water.json"]:
    for op in json.load(open(f"{REPO}/{f}")):
        if op["tool"] == "define_style_group" and op["args"]["layer"] == "lakes":
            GROUP_FILL.setdefault(f.split("/")[2], {})[op["args"]["group"]] = op["args"]["attrs"].get("fill")
def table(names, colors, x, y, u, v, label=""):
    sel = np.where((u > -0.1) & (u < 1.1) & (v > -0.1) & (v < 1.1))[0]
    pts = np.c_[x[sel], y[sel]]
    tri = Delaunay(pts)
    pairs = Counter()
    for simplex in tri.simplices:
        for a, b in ((0, 1), (1, 2), (0, 2)):
            i, j = sel[simplex[a]], sel[simplex[b]]
            if np.hypot(x[i] - x[j], y[i] - y[j]) * 0.5 > 3.4: continue
            if names[i] != names[j]: pairs[tuple(sorted((names[i], names[j])))] += 1
    rows = []
    for (a, b), n in pairs.items():
        if a not in colors or b not in colors: continue
        rows.append((de76(colors[a], colors[b]), a, b, n))
    rows.sort()
    print(f"ΔE (CIE76) of neighbouring colours {label}: pairs {len(rows)}")
    for d, a, b, n in rows: print(f"  {d:5.1f}  {a} {colors[a]}  |  {b} {colors[b]}   edges {n}")
    used = Counter(names[k] for k in sel)
    print("chroma (C*ab), most saturated first:")
    for n_, c in sorted(((n_, chroma(colors[n_])) for n_ in used if n_ in colors), key=lambda t: -t[1]): print(f"  {c:5.1f} {n_} {colors[n_]} ({used[n_]} cells)")
    return rows
if __name__ == "__main__":
    mode, era = sys.argv[1], sys.argv[2]
    if mode == "sim":
        from paintsim import Sim
        s = Sim(era)
        names = np.array(["water" if h < 20 else b for h, b in zip(s.h, s.biome)], dtype=object)
        cols = dict(s.colors); cols["water"] = "#466eab"
        table(names, cols, s.x, s.y, s.u, s.v, f"(simulated {era})")
    else:
        d = sys.argv[3]
        cells = json.load(open(os.path.join(d, f"{era}-cells.json")))
        clim = json.load(open(os.path.join(d, f"{era}-climate.json")))
        lakes = {l["i"]: l for l in json.load(open(os.path.join(d, f"{era}-lakes.json")))}
        cols = {b["name"]: b["color"] for b in clim["biomes"] if b}
        fills = {**GROUP_FILL.get("common", {}), **GROUP_FILL.get(era, {})}
        names = []
        for c in cells:
            if c["h"] < 20 and c.get("feature") in lakes:
                g = lakes[c["feature"]]["group"]; n_ = f"lake:{g}"; names.append(n_)
                if fills.get(g): cols[n_] = fills[g]
            elif c["h"] < 20: names.append("Marine")
            else: names.append(c["biome"])
        x = np.array([c["x"] for c in cells]); y = np.array([c["y"] for c in cells])
        table(np.array(names, dtype=object), cols, x, y, (x - 668) / 200, (y - 616.4) / 128, f"(built {era})")
