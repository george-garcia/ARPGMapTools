#!/usr/bin/env python3
"""Check a Gaea build of an Azgaar tile against the tile it was built from.

What it answers (the GA15 numbers check in the arpg-cartography skill):
  * Did protected ground move?  The salt pan, the brine and acid pools and other standing water must
    come out of Gaea at the heights Azgaar exported (Azgaar places, Gaea details).
  * Is every lake still flat at its own level?
  * Is the salt pan still the lowest land, with nothing new dug below it or below the brine pools?
  * How much did Gaea change the rest (escarpment benches, acid-dome terraces, erosion)?

Usage (Windows, from the ARPGMapTools folder):
  py .claude\\skills\\arpg-cartography\\scripts\\gaea_check_heights.py --export world\\build\\gaea\\now-act1
      Pre-flight and a baseline report on the exported tile alone (no Gaea build needed).
  py .claude\\skills\\arpg-cartography\\scripts\\gaea_check_heights.py --export world\\build\\gaea\\now-act1 --built "<Gaea build folder>\\Heights.exr"
      Compares the build's Heights output with the exported heightfield.
  Add --terrain tools\\gaea\\act1.terrain to also check the project's Terrain Height and the masks its File nodes read.
  Add --colour "<build>\\Colour.png" to check that the acid pits are the loudest ground on the tile.
  Add --json report.json to keep the numbers.

Needs numpy and Pillow. Reading EXR needs one of: OpenEXR (pip install OpenEXR), imageio with an EXR
plugin, or opencv-python. If none is installed, mark the Heights node for export as 32-bit TIFF or raw
float32 instead; .tif, .r32/.raw, .npy and 16-bit .png are read without extras.

Exit code: 0 = every check passed, 1 = a check failed, 2 = the inputs could not be read.
"""
from __future__ import annotations

import argparse
import json
import math
import os
import sys

try:
    import numpy as np
except ImportError:  # pragma: no cover
    sys.exit("check_heights.py needs numpy: pip install numpy pillow")
try:
    from PIL import Image
except ImportError:  # pragma: no cover
    sys.exit("check_heights.py needs Pillow: pip install numpy pillow")

PASS, FAIL, WARN, INFO = "PASS", "FAIL", "WARN", "INFO"


# ----------------------------------------------------------------------------- reading

def read_export(folder: str):
    """The exported tile: heights in real metres (top row north), metres per pixel and the masks."""
    meta_path = os.path.join(folder, "gaea.json")
    with open(meta_path, encoding="utf-8") as f:
        meta = json.load(f)
    hm = float(meta["terrainDefinition"]["heightMetres"])
    size = int(str(meta.get("size", "1024x1024")).split("x")[0])
    raw = np.fromfile(os.path.join(folder, "heightfield.r32"), dtype="<f4")
    if raw.size != size * size:
        side = int(round(math.sqrt(raw.size)))
        if side * side != raw.size:
            raise ValueError(f"heightfield.r32 has {raw.size} values, not a square")
        size = side
    h01 = raw.reshape(size, size).astype(np.float64)
    return meta, hm, h01


def read_mask(folder: str, name: str, size: int):
    path = os.path.join(folder, name)
    if not os.path.exists(path):
        return None
    im = Image.open(path)
    if im.mode in ("RGBA", "RGB", "LA", "P"):
        im = im.convert("RGBA")
        a = np.asarray(im, dtype=np.float64)[..., 0]
    else:
        a = np.asarray(im.convert("L"), dtype=np.float64)
    if a.shape != (size, size):
        raise ValueError(f"{name} is {a.shape}, the heightfield is {size}x{size}")
    return a / 255.0


def _read_exr(path: str):
    errors = []
    try:  # OpenEXR 3.3+ API
        import OpenEXR  # type: ignore
        if hasattr(OpenEXR, "File"):
            with OpenEXR.File(path) as f:
                chans = f.channels()
                for key in ("Y", "R", "RGB", "RGBA", "Z", "H"):
                    if key in chans:
                        px = np.asarray(chans[key].pixels, dtype=np.float64)
                        return px[..., 0] if px.ndim == 3 else px
                key = next(iter(chans))
                px = np.asarray(chans[key].pixels, dtype=np.float64)
                return px[..., 0] if px.ndim == 3 else px
        import Imath  # type: ignore  # older API
        f = OpenEXR.InputFile(path)
        dw = f.header()["dataWindow"]
        w, h = dw.max.x - dw.min.x + 1, dw.max.y - dw.min.y + 1
        names = list(f.header()["channels"].keys())
        key = next((k for k in ("Y", "R", "Z", "H") if k in names), names[0])
        buf = f.channel(key, Imath.PixelType(Imath.PixelType.FLOAT))
        return np.frombuffer(buf, dtype=np.float32).reshape(h, w).astype(np.float64)
    except Exception as e:  # noqa: BLE001
        errors.append(f"OpenEXR: {e}")
    try:
        import imageio.v3 as iio  # type: ignore
        a = np.asarray(iio.imread(path), dtype=np.float64)
        return a[..., 0] if a.ndim == 3 else a
    except Exception as e:  # noqa: BLE001
        errors.append(f"imageio: {e}")
    try:
        os.environ.setdefault("OPENCV_IO_ENABLE_OPENEXR", "1")
        import cv2  # type: ignore
        a = cv2.imread(path, cv2.IMREAD_UNCHANGED | cv2.IMREAD_ANYDEPTH)
        if a is None:
            raise ValueError("cv2.imread returned nothing")
        a = np.asarray(a, dtype=np.float64)
        return a[..., -1] if a.ndim == 3 else a  # BGR: take R
    except Exception as e:  # noqa: BLE001
        errors.append(f"opencv: {e}")
    raise RuntimeError("Could not read the EXR. Install one reader (pip install OpenEXR), or export the Heights "
                       "node as 32-bit TIFF or raw float32. Tried: " + " | ".join(errors))


def read_built(path: str):
    ext = os.path.splitext(path)[1].lower()
    if ext == ".exr":
        a = _read_exr(path)
    elif ext in (".r32", ".raw", ".f32"):
        raw = np.fromfile(path, dtype="<f4")
        side = int(round(math.sqrt(raw.size)))
        if side * side != raw.size:
            raise ValueError(f"{path}: {raw.size} float32 values is not a square")
        a = raw.reshape(side, side).astype(np.float64)
    elif ext == ".npy":
        a = np.load(path).astype(np.float64)
    elif ext in (".tif", ".tiff"):
        try:
            import tifffile  # type: ignore
            a = np.asarray(tifffile.imread(path), dtype=np.float64)
        except ImportError:
            a = np.asarray(Image.open(path), dtype=np.float64)
        if a.ndim == 3:
            a = a[..., 0]
    elif ext == ".png":
        im = Image.open(path)
        a = np.asarray(im, dtype=np.float64)
        if a.ndim == 3:
            a = a[..., 0]
        a = a / (65535.0 if im.mode.startswith("I") else 255.0)
    else:
        raise ValueError(f"Unknown height file type: {ext}")
    if a.ndim != 2 or a.shape[0] != a.shape[1]:
        raise ValueError(f"{path}: expected a square single-channel heightfield, got shape {a.shape}")
    return a


def resample(a, size):
    n = a.shape[0]
    if n == size:
        return a
    if n % size == 0:  # block mean (e.g. a 2048 bake to 1024)
        k = n // size
        return a.reshape(size, k, size, k).mean(axis=(1, 3))
    idx = (np.arange(size) + 0.5) * n / size
    idx = np.clip(idx.astype(int), 0, n - 1)
    return a[np.ix_(idx, idx)]


# ----------------------------------------------------------------------------- mask helpers

def shrink(mask, px):
    """Binary erosion by px pixels (8-neighbour), numpy only."""
    m = mask.copy()
    for _ in range(int(px)):
        p = np.pad(m, 1, constant_values=False)
        out = p[1:-1, 1:-1].copy()
        for dy in (-1, 0, 1):
            for dx in (-1, 0, 1):
                out &= p[1 + dy:p.shape[0] - 1 + dy, 1 + dx:p.shape[1] - 1 + dx]
        m = out
    return m


def components(mask):
    """Connected components (4-neighbour) without scipy. Returns a label array and the count."""
    try:
        from scipy import ndimage  # type: ignore
        lab, n = ndimage.label(mask)
        return lab, n
    except ImportError:
        pass
    lab = np.zeros(mask.shape, dtype=np.int32)
    n = 0
    h, w = mask.shape
    for y0, x0 in zip(*np.nonzero(mask)):
        if lab[y0, x0]:
            continue
        n += 1
        stack = [(y0, x0)]
        lab[y0, x0] = n
        while stack:
            y, x = stack.pop()
            for yy, xx in ((y - 1, x), (y + 1, x), (y, x - 1), (y, x + 1)):
                if 0 <= yy < h and 0 <= xx < w and mask[yy, xx] and not lab[yy, xx]:
                    lab[yy, xx] = n
                    stack.append((yy, xx))
    return lab, n


def slope_deg(h_m, mpp):
    gy, gx = np.gradient(h_m, mpp)
    return np.degrees(np.arctan(np.hypot(gx, gy)))


# ----------------------------------------------------------------------------- report

class Report:
    def __init__(self):
        self.rows = []

    def add(self, status, check, detail, **numbers):
        self.rows.append({"status": status, "check": check, "detail": detail, **numbers})

    @property
    def failed(self):
        return any(r["status"] == FAIL for r in self.rows)

    def print(self):
        for r in self.rows:
            print(f"[{r['status']}] {r['check']}: {r['detail']}")
        n = {s: sum(r["status"] == s for r in self.rows) for s in (PASS, FAIL, WARN, INFO)}
        print(f"\n{n[PASS]} passed, {n[FAIL]} failed, {n[WARN]} warnings, {n[INFO]} notes")


def where(yx, size, mpp):
    y, x = yx
    return f"pixel ({x}, {y}) = {x * mpp / 1000:.1f} km east, {y * mpp / 1000:.1f} km south of the tile's NW corner"


# ----------------------------------------------------------------------------- checks

def preflight(rep, folder, meta, hm, size, terrain_path):
    listed = set(meta.get("masks", []))
    on_disk = {f for f in os.listdir(folder) if f.startswith("mask-") and f.endswith(".png")}
    missing = sorted(listed - on_disk)
    stale = sorted(on_disk - listed)
    rep.add(FAIL if missing else PASS, "Export files",
            f"{len(listed)} masks listed in gaea.json" + (f"; missing on disk: {', '.join(missing)}" if missing else ", all present"))
    if stale:
        rep.add(WARN, "Stale masks", "on disk but not in gaea.json (an old export left them; a File node reading "
                f"one reads old data): {', '.join(stale)}")
    empty = []
    for name in sorted(listed & on_disk):
        m = read_mask(folder, name, size)
        if m is not None and m.max() == 0:
            empty.append(name)
    if empty:
        rep.add(WARN, "Empty masks", f"all black (a renamed biome or group empties a mask): {', '.join(empty)}")
    if terrain_path:
        with open(terrain_path, encoding="utf-8-sig") as f:
            proj = json.load(f)
        terr = proj["Assets"]["$values"][0]["Terrain"]
        th, tw = float(terr["Height"]), float(terr["Width"])
        want = 2 * hm
        ok = abs(th - want) < 0.5
        rep.add(PASS if ok else FAIL, "Terrain Height",
                f"project {th:.0f} m vs 2 x heightMetres = {want:.0f} m" + ("" if ok else
                " - set Build Settings > Terrain > Height, or the relief has silently changed"))
        scale = float(meta["terrainDefinition"]["scaleMetres"])
        rep.add(PASS if abs(tw - scale) < 0.5 else FAIL, "Terrain Width", f"project {tw:.0f} m vs export {scale:.0f} m")
        reads = []
        for k, node in terr["Nodes"].items():
            if k == "$id" or not str(node.get("$type", "")).startswith("QuadSpinner.Gaea.Nodes.File,"):
                continue
            fn = str(node.get("FileName", "")).replace("\\", "/").split("/")[-1]
            reads.append(fn)
        bad = [fn for fn in reads if fn not in listed and fn not in ("heightfield.r32", "colormap.png")]
        empty_read = [fn for fn in reads if fn in empty]
        rep.add(FAIL if bad or empty_read else PASS, "Graph inputs",
                f"File nodes read {len(reads)} files" + (f"; not in this export: {', '.join(bad)}" if bad else "") +
                (f"; empty: {', '.join(empty_read)}" if empty_read else ""))


def build_regions(folder, h_m, size, mpp):
    def m(name, thr=0.5):
        a = read_mask(folder, name, size)
        return None if a is None else a > thr

    slope = slope_deg(h_m, mpp)
    protect_raw = read_mask(folder, "mask-gaea-protect.png", size)
    water = m("mask-water.png")
    salt = m("mask-biome-salt-flats.png")
    lakes_acid = m("mask-lakes-acid.png")
    lakes_other = m("mask-lakes-other.png")
    esc = m("mask-biome-rift-escarpment.png")
    acid = m("mask-biome-acid-pits.png")
    flat = slope < 2.0  # real degrees; edge slivers of lakes and pan climb the escarpment (F1.7)
    z = np.zeros((size, size), bool)
    water = z if water is None else water
    # Protected ground: fully white in the feathered protect mask, shrunk 2 px, on flat ground.
    protect = shrink(protect_raw >= 0.999, 2) & flat if protect_raw is not None else z
    pan = shrink(salt, 2) & flat & ~water if salt is not None else z
    return {"slope": slope, "water": water, "protect": protect, "pan": pan,
            "salt": z if salt is None else salt, "lakes_acid": z if lakes_acid is None else lakes_acid,
            "lakes_other": z if lakes_other is None else lakes_other,
            "esc": z if esc is None else esc, "acid": z if acid is None else acid}


def lake_levels(R, h):
    out = []
    for kind in ("lakes_other", "lakes_acid"):
        lab, n = components(R[kind])
        for i in range(1, n + 1):
            comp = lab == i
            core = shrink(comp, 2) & (R["slope"] < 2.0)
            if core.sum() < 20:
                continue
            ys, xs = np.nonzero(comp)
            out.append({"kind": "brine/other lake" if kind == "lakes_other" else "acid pool", "core": core,
                        "centre": (int(ys.mean()), int(xs.mean())), "level": float(np.median(h[core])),
                        "spread": float(np.percentile(h[core], 99) - np.percentile(h[core], 1))})
    return out


def baseline(rep, R, h, size, mpp):
    pan, water = R["pan"], R["water"]
    if not pan.any():
        rep.add(WARN, "Salt pan", "no salt-flats mask, or no flat salt-flat pixels: pan checks skipped")
        return {}
    land = ~water
    pan_min = float(h[pan].min())
    outside = land & ~R["salt"]
    low_out = float(h[outside].min()) if outside.any() else float("inf")
    rep.add(INFO, "Pan (map)", f"flat salt-pan core {pan.sum()} px; heights min {pan_min:.1f} m, "
            f"median {np.median(h[pan]):.1f} m, p95 {np.percentile(h[pan], 95):.1f} m, max slope "
            f"{R['slope'][pan].max():.2f} deg real")
    ties = int((outside & (h <= pan_min + 0.5)).sum())
    if low_out < pan_min - 0.5:
        yx = np.unravel_index(np.argmin(np.where(outside, h, np.inf)), h.shape)
        rep.add(WARN, "Lowest land (map)", f"land outside the pan reaches {low_out:.1f} m, below the pan's "
                f"{pan_min:.1f} m, at {where(yx, size, mpp)} - a map issue (P19), fix it as an op")
    else:
        rep.add(INFO, "Lowest land (map)", f"no land outside the pan is below it; {ties} px tie with the pan's "
                f"lowest {pan_min:.1f} m (the tile's floor)")
    lakes = lake_levels(R, h)
    near_pan = ~shrink(~R["salt"], 3)  # the salt flats grown by 3 px: brine pools sit in or beside the pan
    brine = [l for l in lakes if l["kind"] == "brine/other lake" and near_pan[l["core"]].any()]
    brine_level = min((l["level"] for l in brine), default=None)
    for l in lakes:
        y, x = l["centre"]
        msg = f"{l['kind']} at ({x}, {y}): level {l['level']:.1f} m, spread {l['spread']:.1f} m inside its core"
        status = INFO
        if l["spread"] > 3.0:
            status, msg = WARN, msg + " (not flat in the export: the map's lake is not one level)"
        if brine_level is not None and l["kind"] == "acid pool" and l["level"] < brine_level + 0.5:
            status, msg = WARN, msg + f" (at or below the brine level {brine_level:.1f} m: P19)"
        rep.add(status, "Lake (map)", msg)
    return {"pan_min": pan_min, "brine_level": brine_level, "lakes": lakes}


def compare(rep, R, base, h_in, h_out, size, mpp, hm, tol):
    d = h_out - h_in
    prot = R["protect"]
    if prot.any():
        e = np.abs(d[prot])
        st = PASS if e.max() <= tol else FAIL
        msg = f"{prot.sum()} px (protect mask, shrunk 2 px, slope < 2 deg): |change| max {e.max():.2f} m, p99 {np.percentile(e, 99):.2f} m"
        if st == FAIL:
            yx = np.unravel_index(np.argmax(np.where(prot, np.abs(d), -1)), d.shape)
            msg += f"; worst at {where(yx, size, mpp)} (tolerance {tol} m)"
        rep.add(st, "Protected ground unchanged", msg, max_abs_m=float(e.max()))
    for l in base.get("lakes", []):
        core = l["core"]
        e = np.abs(d[core])
        spread_out = float(np.percentile(h_out[core], 99) - np.percentile(h_out[core], 1))
        y, x = l["centre"]
        ok = e.max() <= tol and spread_out <= l["spread"] + tol
        rep.add(PASS if ok else FAIL, "Lake flat and in place",
                f"{l['kind']} at ({x}, {y}): |change| max {e.max():.2f} m, spread {l['spread']:.1f} -> {spread_out:.1f} m")
    pan = R["pan"]
    if pan.any():
        land = ~R["water"]
        outside = land & ~R["salt"]
        pan_min_out = float(h_out[pan].min())
        new_low = outside & (h_out < pan_min_out - tol) & ~(h_in < base["pan_min"] - tol)
        n = int(new_low.sum())
        msg = f"pan lowest {base['pan_min']:.1f} -> {pan_min_out:.1f} m; land outside the pan newly below it: {n} px"
        if n:
            yx = np.unravel_index(np.argmin(np.where(new_low, h_out, np.inf)), d.shape)
            msg += f"; lowest {h_out[yx]:.1f} m at {where(yx, size, mpp)}"
        rep.add(PASS if n == 0 else FAIL, "Pan still the lowest land", msg, new_below_pan_px=n)
        if base.get("brine_level") is not None:
            bl = base["brine_level"]
            before = int((outside & (h_in < bl - tol)).sum())
            after = int((outside & (h_out < bl - tol)).sum())
            px_tol = max(10, int(0.005 * max(before, 1)))  # 16-bit quantisation moves a few pixels across the level (round-2 judge)
            rep.add(PASS if after <= before + px_tol else FAIL, "Nothing new below the brine pools",
                    f"land outside the pan below the brine level {bl:.1f} m: {before} px in the export, {after} px after Gaea")
    changed = np.abs(d)
    rep.add(INFO, "Share changed", ", ".join(f"> {t} m: {100 * (changed > t).mean():.1f}%" for t in (1, 10, 50, 150)))
    for name, region in (("escarpment", R["esc"]), ("acid dome (outside pools)", R["acid"] & ~R["lakes_acid"]),
                         ("everything else", ~(R["esc"] | R["acid"] | R["water"] | R["salt"]))):
        if region.any():
            dr = d[region]
            rep.add(INFO, f"Change on {name}", f"cut max {max(0.0, -dr.min()):.0f} m, fill max {max(0.0, dr.max()):.0f} m, "
                    f"mean |change| {np.abs(dr).mean():.1f} m (real metres; Gaea shows them doubled)")
    if R["esc"].any() and -d[R["esc"]].min() > 300:
        rep.add(WARN, "Escarpment cut", "more than 300 m real removed somewhere on the escarpment: benches this deep "
                "start to move the lip and the foot, which are the map's (lower Terraces Intensity)")
    dome = R["acid"] & ~R["lakes_acid"]
    pools = [l for l in base.get("lakes", []) if l["kind"] == "acid pool"]
    if dome.any() and pools:
        lowest_pool = min(l["level"] for l in pools)
        newly = dome & (h_out < lowest_pool - tol) & ~(h_in < lowest_pool - tol)
        n = int(newly.sum())
        rep.add(PASS if n == 0 else WARN, "Acid dome not dug below its pools",
                f"dome ground newly below the lowest acid pool ({lowest_pool:.1f} m): {n} px; dome lowest "
                f"{h_in[dome].min():.1f} m in the export, {h_out[dome].min():.1f} m after Gaea")


def read_colour(path):
    """An RGB colour output as floats 0-1 in display (sRGB) space."""
    ext = os.path.splitext(path)[1].lower()
    if ext == ".exr":
        rgb = None
        try:
            import OpenEXR  # type: ignore
            with OpenEXR.File(path) as f:
                ch = f.channels()
                if "RGB" in ch or "RGBA" in ch:
                    rgb = np.asarray(ch["RGB" if "RGB" in ch else "RGBA"].pixels, dtype=np.float64)[..., :3]
                else:
                    rgb = np.dstack([np.asarray(ch[c].pixels, dtype=np.float64) for c in ("R", "G", "B")])
        except Exception:  # noqa: BLE001
            try:
                import imageio.v3 as iio  # type: ignore
                rgb = np.asarray(iio.imread(path), dtype=np.float64)[..., :3]
            except Exception as e:  # noqa: BLE001
                raise RuntimeError(f"cannot read colour EXR ({e}); export Colour as PNG or TIFF, or pip install OpenEXR")
        rgb = np.clip(rgb, 0, 1)  # EXR colour is linear: encode to sRGB for judging by eye-like numbers
        return np.where(rgb <= 0.0031308, rgb * 12.92, 1.055 * np.power(rgb, 1 / 2.4) - 0.055)
    im = Image.open(path).convert("RGB")
    return np.asarray(im, dtype=np.float64) / 255.0


def colour_check(rep, folder, path, size):
    """Is the acid field the loudest thing on the tile? Chroma (max-min of RGB) and saturation per biome."""
    rgb = read_colour(path)
    if rgb.shape[0] != size:
        idx = np.clip(((np.arange(size) + 0.5) * rgb.shape[0] / size).astype(int), 0, rgb.shape[0] - 1)
        rgb = rgb[np.ix_(idx, idx)]
    chroma = rgb.max(axis=2) - rgb.min(axis=2)
    acid = np.zeros((size, size), bool)
    for name in ("mask-biome-acid-pits.png", "mask-biome-sulfur-crust.png", "mask-lakes-acid.png"):
        m = read_mask(folder, name, size)
        if m is not None:
            acid |= m > 0.5
    if not acid.any():
        rep.add(WARN, "Acid colour", "no acid masks in this export (the before era has none): colour check skipped")
        return
    rows = [("acid field (pits, sulfur, pools)", float(np.median(chroma[acid])), float(np.percentile(chroma[acid], 90)))]
    for name in sorted(f for f in os.listdir(folder) if f.startswith("mask-biome-") and f.endswith(".png")):
        if name in ("mask-biome-acid-pits.png", "mask-biome-sulfur-crust.png"):
            continue
        m = read_mask(folder, name, size)
        if m is None:
            continue
        m = (m > 0.5) & ~acid
        if m.sum() < 200:
            continue
        rows.append((name[len("mask-biome-"):-4], float(np.median(chroma[m])), float(np.percentile(chroma[m], 90))))
    rows.sort(key=lambda r: -r[1])
    top = rows[0][0].startswith("acid")
    runner = next(r for r in rows if not r[0].startswith("acid"))
    ratio = rows[0][1] / max(runner[1], 1e-6) if top else 0.0
    loud = sum(1 for r in rows if r[0].startswith("acid"))
    share = float((chroma[acid] > np.percentile(chroma, 95)).mean())
    st = PASS if top and ratio >= 1.5 else (WARN if top else FAIL)
    rep.add(st, "Acid pits loudest", f"median chroma: acid {[r for r in rows if r[0].startswith('acid')][0][1]:.2f} vs "
            f"loudest other ground '{runner[0]}' {runner[1]:.2f} (ratio {ratio:.1f}, want >= 1.5); "
            f"{100 * share:.0f}% of acid pixels are in the tile's top 5% chroma")
    rep.add(INFO, "Chroma by ground", "; ".join(f"{n} {m:.2f}" for n, m, _ in rows[:8]))


def align(rep, h_in, h_out01, hm, size, units, terrain_height):
    a = resample(h_out01, size)
    if a.shape[0] != h_out01.shape[0]:
        rep.add(INFO, "Resolution", f"build is {h_out01.shape[0]} px; compared at {size} px")
    mx = float(np.nanmax(a))
    if units == "auto":
        units = "normalized" if mx <= 1.5 else "project-metres"
    if units == "normalized":
        out_m = a * hm
    elif units == "project-metres":
        out_m = a / terrain_height * hm
    else:
        out_m = a
    rep.add(INFO, "Units", f"build read as {units} (max value {mx:.4g}); compared in real metres (0-{hm:.0f} m)")
    best, best_c, name = None, -2.0, ""
    for nm, f in (("as is", lambda x: x), ("flipped north-south", np.flipud), ("flipped east-west", np.fliplr),
                  ("rotated 180", lambda x: np.rot90(x, 2)), ("transposed", np.transpose)):
        cand = f(out_m)
        c = np.corrcoef(cand.ravel()[::7], h_in.ravel()[::7])[0, 1]
        if c > best_c:
            best, best_c, name = cand, c, nm
    st = PASS if name == "as is" and best_c > 0.98 else (WARN if best_c > 0.9 else FAIL)
    rep.add(st, "Alignment", f"build matches the export {name} (correlation {best_c:.4f})"
            + ("" if name == "as is" else " - the build is mirrored or rotated; compared after undoing it"))
    return best


def main(argv=None):
    ap = argparse.ArgumentParser(description=__doc__, formatter_class=argparse.RawDescriptionHelpFormatter)
    ap.add_argument("--export", required=True, help="the tile folder from export_gaea (holds gaea.json)")
    ap.add_argument("--built", help="Gaea's Heights output (.exr, .tif, .r32/.raw, .npy or 16-bit .png)")
    ap.add_argument("--terrain", help="the .terrain project, to check Terrain Height and the File inputs")
    ap.add_argument("--units", default="auto", choices=["auto", "normalized", "project-metres", "real-metres"],
                    help="how the build stores heights (auto: 0-1 if max <= 1.5, else project metres)")
    ap.add_argument("--tol", type=float, default=0.5, help="metres a protected pixel may move (default 0.5)")
    ap.add_argument("--colour", help="Gaea's Colour output (.png, .tif or .exr): checks the acid pits are the loudest ground")
    ap.add_argument("--json", help="write the report rows here")
    args = ap.parse_args(argv)

    rep = Report()
    try:
        meta, hm, h01 = read_export(args.export)
    except Exception as e:  # noqa: BLE001
        print(f"Cannot read the export: {e}")
        return 2
    size = h01.shape[0]
    mpp = float(meta.get("metresPerPixel") or meta["terrainDefinition"]["scaleMetres"] / size)
    h_in = h01 * hm
    terrain_height = 2 * hm
    if args.terrain:
        try:
            with open(args.terrain, encoding="utf-8-sig") as f:
                terrain_height = float(json.load(f)["Assets"]["$values"][0]["Terrain"]["Height"])
        except Exception as e:  # noqa: BLE001
            rep.add(WARN, "Terrain file", f"could not read {args.terrain}: {e}")
    print(f"Tile {meta.get('title', '')}: {size} px, {mpp:.0f} m/px, heights 0-{hm:.0f} m\n")
    preflight(rep, args.export, meta, hm, size, args.terrain)
    R = build_regions(args.export, h_in, size, mpp)
    base = baseline(rep, R, h_in, size, mpp)
    if args.built:
        try:
            raw = read_built(args.built)
        except Exception as e:  # noqa: BLE001
            print(f"Cannot read the build: {e}")
            return 2
        h_out = align(rep, h_in, raw, hm, size, args.units, terrain_height)
        compare(rep, R, base, h_in, h_out, size, mpp, hm, args.tol)
    else:
        rep.add(INFO, "Build", "no --built file given: pre-flight and baseline only")
    if args.colour:
        try:
            colour_check(rep, args.export, args.colour, size)
        except Exception as e:  # noqa: BLE001
            rep.add(WARN, "Acid colour", f"could not check {args.colour}: {e}")
    rep.print()
    if args.json:
        with open(args.json, "w", encoding="utf-8") as f:
            json.dump(rep.rows, f, indent=2)
    return 1 if rep.failed else 0


if __name__ == "__main__":
    sys.exit(main())
