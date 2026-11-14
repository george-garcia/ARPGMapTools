"""Rim paint polygons that follow the crest: distance from the rift interior with a noisy reach, as nested rings
whose outer ones keep only the higher ground (rock outcrops thinning out into the continent). Frame-local output."""
import json, numpy as np
from scipy.spatial import cKDTree
from scipy.ndimage import gaussian_filter
from skimage import measure
from shapely.geometry import Polygon, MultiPolygon
from shapely.ops import unary_union
from paintsim import Sim, inside_mask, to_map
REPO = "/home/claude/arpgmaptools"
S = Sim('now', files=[])
basin = [op for op in json.load(open(f"{REPO}/world/base/10-act1-terrain.json")) if op["id"] == "act1.basin"][0]["args"]["polygon"]
bpoly = Polygon(basin).buffer(0.02)
# rift interior: basin floor (h <= 41) and the Caravan pass corridor up to its mouth (h <= 39)
road = [[-0.3, 1.0], [-0.14, 0.9], [0.0, 0.825], [0.06, 0.775], [0.1, 0.73], [0.14, 0.67]]
from shapely.geometry import LineString, Point
pass_poly = LineString([(u * 100, v * 64) for u, v in road]).buffer(5.0)  # km space
interior = []
for k in range(len(S.h)):
    u, v, h = S.u[k], S.v[k], S.h[k]
    if h < 20: continue
    if (h <= 41 and bpoly.contains(Point(u, v))) or (h <= 39 and u > -0.32 and pass_poly.contains(Point(u * 100, v * 64))):
        interior.append((u * 100, v * 64))
tree = cKDTree(interior)
# grid in km
gu = np.arange(-0.9, 1.6, 0.005); gv = np.arange(-0.8, 1.5, 0.008)
U, V = np.meshgrid(gu, gv)
dist, _ = tree.query(np.c_[U.ravel() * 100, V.ravel() * 64])
dist = dist.reshape(U.shape)
rng = np.random.default_rng(28)
noise = gaussian_filter(rng.standard_normal(U.shape), sigma=(9 / 0.512, 9 / 0.5))  # ~9 km correlation
noise /= np.abs(noise).max(); noise = np.clip(noise * 1.6, -1, 1)
# reach: deeper on the north block (a whole fault block to read as one wall), shallower elsewhere
wn = np.clip((0.16 - V) / 0.1, 0, 1) * np.clip((U - 0.40) / 0.08, 0, 1) * np.clip((1.12 - U) / 0.08, 0, 1)
ww = np.clip((0.35 - U) / 0.15, 0, 1) * np.clip((V - 0.05) / 0.1, 0, 1)  # the west wall: the master fault, a broader band of red rock
base = (7.5 + 4.5 * noise) * (1 - ww) + (10.0 + 3.5 * noise) * ww
reach = base * (1 - wn) + (14.0 + 4.0 * noise) * wn
def contour(extra):
    f = dist - reach - extra
    cs = measure.find_contours(f, 0.0)
    polys = []
    for c in cs:
        pts = [(gu[0] + x * 0.005, gv[0] + y * 0.008) for y, x in c]
        if len(pts) < 4: continue
        p = Polygon(pts)
        if not p.is_valid: p = p.buffer(0)
        polys.append(p)
    # the region inside the outer contour (dist < reach): the big ring around the basin, holes filled
    big = max(polys, key=lambda p: p.area)
    return Polygon(big.exterior)
# escarpment side: the master fault (west wall, the Caravan pass's north-west face) and the north block
ESC = Polygon([(-1.2, -1.0), (1.6, -1.0), (1.6, 0.0), (1.1, 0.07), (1.0, 0.12), (0.955, 0.16), (0.6, 0.5), (0.2, 0.74),
               (0.06, 0.80), (0.0, 0.845), (-0.14, 0.92), (-0.32, 1.02), (-1.2, 1.3)])
def simplify(p, tol=0.004):
    q = p.simplify(tol, preserve_topology=True)
    return [[round(x, 4), round(y, 4)] for x, y in list(q.exterior.coords)[:-1]]
def pieces(p, region, inside=True):
    r = p.intersection(region) if inside else p.difference(region)
    geoms = list(r.geoms) if hasattr(r, 'geoms') else [r]
    geoms = [g for g in geoms if g.area > 0.002]
    return geoms
def build():
    out = {}
    for name, extra in [("core", 0.0), ("ring2", 4.0), ("ring3", 8.0)]:
        P = contour(extra)
        out[name] = {"esc": [simplify(g) for g in pieces(P, ESC)], "rim": [simplify(g) for g in pieces(P, ESC, False)]}
    return out
if __name__ == "__main__":
    out = build()
    for k, v in out.items(): print(k, {s: [len(p) for p in ps] for s, ps in v.items()})
    json.dump(out, open("rim_polys.json", "w"))
