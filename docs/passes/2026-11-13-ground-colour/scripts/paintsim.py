"""Offline replay of an era's paint_biome ops over the staged (climate-only) cells, exactly as the tool does:
cell centre inside the polygon (map px), land (h>=20), within heights. Renders a PNG and reports shares."""
import json, sys, glob, os
import numpy as np
from scipy.spatial import cKDTree
from PIL import Image, ImageDraw
REPO = "/home/claude/arpgmaptools"
X0, Y0, FW, FH = 668, 616.4, 200, 128
AZ = {"Marine": "#466eab", "Hot desert": "#fbe79f", "Cold desert": "#b5b887", "Savanna": "#d2d082", "Grassland": "#c8d68f",
      "Tropical seasonal forest": "#b6d95d", "Temperate deciduous forest": "#29bc56", "Tropical rainforest": "#7dcb35",
      "Temperate rainforest": "#409c43", "Taiga": "#4b6b32", "Tundra": "#96784b", "Glacier": "#d5e7eb", "Wetland": "#0b9131"}

def to_map(p): return (X0 + p[0] * FW, Y0 + p[1] * FH)

def inside_mask(poly, xs, ys):
    hit = np.zeros(len(xs), bool)
    n = len(poly)
    for i in range(n):
        xi, yi = poly[i]; xj, yj = poly[i - 1]
        cond = ((yi > ys) != (yj > ys))
        with np.errstate(divide='ignore', invalid='ignore'):
            xint = (xj - xi) * (ys - yi) / (yj - yi) + xi
        hit ^= cond & (xs < xint)
    return hit

class Sim:
    def __init__(self, era, files=None):
        self.era = era
        cells = json.load(open(os.path.join(os.path.dirname(__file__), f"{era}-stage-cells.json")))
        self.cells = cells
        self.x = np.array([c["x"] for c in cells]); self.y = np.array([c["y"] for c in cells])
        self.h = np.array([c["h"] for c in cells]); self.i = np.array([c["i"] for c in cells])
        self.biome = np.array([c["biome"] for c in cells], dtype=object)
        self.u = (self.x - X0) / FW; self.v = (self.y - Y0) / FH
        self.colors = dict(AZ)
        self.ops = []
        files = files or sorted(glob.glob(f"{REPO}/world/eras/{era}/3*.json"))
        for f in files:
            for op in json.load(open(f)):
                if op["tool"] == "paint_biome": self.apply(op)
        self.tree = cKDTree(np.c_[self.x, self.y])

    def apply(self, op):
        a = op["args"]
        poly = [to_map(p) for p in a["polygon"]] if a.get("frame") else a["polygon"]
        lo, hi = a.get("heights", [20, 100])
        m = inside_mask(poly, self.x, self.y) & (self.h >= 20) & (self.h >= lo) & (self.h <= hi)
        if a.get("color"): self.colors[a["name"]] = a["color"]
        elif a["name"] not in self.colors: raise SystemExit(f"new biome without colour {a['name']}")
        self.biome[m] = a["name"]
        self.ops.append((op["id"], int(m.sum())))
        if not m.sum(): print("WARNING: no cells for", op["id"])

    def render(self, out, box=(-0.35, -0.4, 1.35, 1.3), scale=4, polys=(), lines=(), points=()):
        u0, v0, u1, v1 = box
        W = int((u1 - u0) * FW * scale); H = int((v1 - v0) * FH * scale)
        gx, gy = np.meshgrid(np.arange(W), np.arange(H))
        mx = X0 + (u0 + gx / scale / FW * 1.0) * FW if False else X0 + u0 * FW + gx / scale
        my = Y0 + v0 * FH + gy / scale
        _, idx = self.tree.query(np.c_[mx.ravel(), my.ravel()])
        col = {}
        def hexrgb(hx): hx = hx.lstrip('#'); return tuple(int(hx[k:k + 2], 16) for k in (0, 2, 4))
        rgb = np.zeros((len(self.cells), 3), np.uint8)
        for k in range(len(self.cells)):
            b = self.biome[k]
            rgb[k] = (70, 110, 171) if self.h[k] < 20 else hexrgb(self.colors.get(b, "#ff00ff"))
        img = Image.fromarray(rgb[idx].reshape(H, W, 3))
        d = ImageDraw.Draw(img)
        tp = lambda p: ((to_map(p)[0] - X0 - u0 * FW) * scale, (to_map(p)[1] - Y0 - v0 * FH) * scale)
        # frame
        d.rectangle([tp((0, 0)), tp((1, 1))], outline=(0, 0, 0))
        for poly, c in polys: d.line([tp(p) for p in poly] + [tp(poly[0])], fill=c, width=1)
        for pts, c in lines: d.line([tp(p) for p in pts], fill=c, width=2)
        for p, c in points: x, y = tp(p); d.ellipse([x - 4, y - 4, x + 4, y + 4], outline=c, width=2)
        img.save(out)

    def shares(self, poly):
        m = inside_mask([to_map(p) for p in poly], self.x, self.y)
        from collections import Counter
        cnt = Counter("water" if self.h[k] < 20 else self.biome[k] for k in np.where(m)[0])
        return int(m.sum()), cnt

if __name__ == "__main__":
    era = sys.argv[1]
    s = Sim(era)
    for i, n in s.ops: print(f"{i:40s} {n}")
    basin = [p for op in json.load(open(f"{REPO}/world/base/10-act1-terrain.json")) if op["id"] == "act1.basin" for p in [op["args"]["polygon"]]][0]
    n, cnt = s.shares(basin)
    print("basin", n, [(k, v, round(100 * v / n, 1)) for k, v in cnt.most_common()])
    s.render(sys.argv[2] if len(sys.argv) > 2 else f"sim-{era}.png")
