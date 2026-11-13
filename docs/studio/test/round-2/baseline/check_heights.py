#!/usr/bin/env python3
"""check_heights.py - verify the Act I Gaea tile's protected ground.

Checks a build's heights against the Azgaar heights the tile was exported from:

  * lakes (brine, acid and other pools) are exactly as drawn,
  * the salt pan floor did not move (filling interpolation holes up to the pan level is allowed) and is dead flat,
  * the salt pan and the brine pools are the lowest ground: nothing else is lower, and the acid field,
    the other pools and the Dead Spring stand above the pan floor,
  * optionally, that the acid field is the loudest colour on the tile (--colour).

Usage (from the repo root; Python 3.9+ with numpy and Pillow):

  python check_heights.py world/build/gaea/now-act1
      checks the exported Azgaar heights themselves (map sanity: is the pan the lowest ground?)
  python check_heights.py world/build/gaea/now-act1 --heights "<Gaea build folder>/Heights.exr"
      checks a Gaea build of tools/gaea/act1.terrain against the tile it read
  python check_heights.py world/build/gaea/now-act1 --heights old-build/now-act1/heightfield.r32
      checks that protected ground did not move between two map builds
  python check_heights.py world/build/gaea/now-act1 --colour "<Gaea build folder>/Colour.exr"
      also checks that the acid field is the most saturated, most contrasting thing on the tile

Heights files: .r32 (float32, 0-1), .raw (uint16, 0-65535), .png/.tif (16-bit or float), .exr (needs
`pip install OpenEXR`, or imageio, or opencv-python). Values are 0-1 of heightMetres in gaea.json unless
--heights-metres says otherwise. Exit code: 0 all checks pass, 1 warnings, 2 failures.
"""
import argparse
import json
import os
import sys
from collections import deque

import numpy as np
from PIL import Image

PASS, WARN, FAIL = 'PASS', 'WARN', 'FAIL'


# ----------------------------------------------------------------------------------------------- loading
def load_exr(path):
    try:
        import OpenEXR  # OpenEXR >= 3.3 has File(); older has InputFile()
        if hasattr(OpenEXR, 'File'):
            with OpenEXR.File(path) as f:
                ch = f.channels()
                for name in ('Y', 'R', 'G', 'B') + tuple(ch):
                    if name in ch:
                        return np.asarray(ch[name].pixels, dtype=np.float64), str(ch[name].pixels.dtype)
        import Imath
        f = OpenEXR.InputFile(path)
        hdr = f.header()
        dw = hdr['dataWindow']
        w, h = dw.max.x - dw.min.x + 1, dw.max.y - dw.min.y + 1
        names = list(hdr['channels'])
        name = next((n for n in ('Y', 'R', 'G', 'B') if n in names), names[0])
        ptype = hdr['channels'][name].type
        half = ptype == Imath.PixelType(Imath.PixelType.HALF)
        raw = f.channel(name, Imath.PixelType(Imath.PixelType.FLOAT))
        return np.frombuffer(raw, dtype=np.float32).reshape(h, w).astype(np.float64), 'float16' if half else 'float32'
    except ImportError:
        pass
    try:
        import imageio.v3 as iio
        a = iio.imread(path)
        return (a[..., 0] if a.ndim == 3 else a).astype(np.float64), str(a.dtype)
    except Exception:
        pass
    try:
        os.environ.setdefault('OPENCV_IO_ENABLE_OPENEXR', '1')
        import cv2
        a = cv2.imread(path, cv2.IMREAD_ANYDEPTH | cv2.IMREAD_ANYCOLOR)
        if a is not None:
            return (a[..., 2] if a.ndim == 3 else a).astype(np.float64), str(a.dtype)
    except ImportError:
        pass
    sys.exit(f'Cannot read {path}: install one of `pip install OpenEXR`, `pip install imageio`, '
             '`pip install opencv-python`, or export the heights as R32/TIFF32 instead.')


def load_heights(path):
    """Returns (array 0-1 as float64, dtype name)."""
    ext = os.path.splitext(path)[1].lower()
    if ext in ('.r32', '.raw', '.r16'):
        n = os.path.getsize(path)
        # .r32 is float32; .raw/.r16 are uint16 (Gaea's RAW16) unless only a float32 square fits
        order = (('<f4', 1.0), ('<u2', 65535.0)) if ext == '.r32' else (('<u2', 65535.0), ('<f4', 1.0))
        for dt, scale in order:
            size = np.dtype(dt).itemsize
            side = int(round((n / size) ** 0.5))
            if side * side * size == n:
                a = np.fromfile(path, dt).reshape(side, side).astype(np.float64) / scale
                return a, 'float32' if dt == '<f4' else 'uint16'
        sys.exit(f'{path}: size {n} is not a square float32 or uint16 grid')
    if ext == '.exr':
        return load_exr(path)
    im = Image.open(path)
    a = np.asarray(im)
    if a.ndim == 3:
        a = a[..., 0]
    if a.dtype == np.uint8:
        return a / 255.0, 'uint8'
    if a.dtype in (np.uint16, np.int32) or im.mode.startswith('I'):
        return a.astype(np.float64) / 65535.0, 'uint16'
    return a.astype(np.float64), str(a.dtype)


def load_mask(tile, name, shape):
    p = os.path.join(tile, name)
    if not os.path.exists(p):
        return None
    im = Image.open(p).convert('L')
    if im.size != (shape[1], shape[0]):
        im = im.resize((shape[1], shape[0]), Image.NEAREST)
    return np.asarray(im) > 127


def load_mask_soft(tile, name, shape):
    im = Image.open(os.path.join(tile, name)).convert('L')
    if im.size != (shape[1], shape[0]):
        im = im.resize((shape[1], shape[0]), Image.BILINEAR)
    return np.asarray(im).astype(np.float64) / 255.0


def resample(a, shape):
    if a.shape == shape:
        return a
    im = Image.fromarray(a.astype(np.float32), 'F').resize((shape[1], shape[0]), Image.BILINEAR)
    return np.asarray(im).astype(np.float64)


# ----------------------------------------------------------------------------------------------- tiny morphology
def shift_or(m, r=1):
    out = m.copy()
    for dy in range(-r, r + 1):
        for dx in range(-r, r + 1):
            if dx or dy:
                s = np.zeros_like(m)
                ys = slice(max(dy, 0), m.shape[0] + min(dy, 0))
                yd = slice(max(-dy, 0), m.shape[0] + min(-dy, 0))
                xs = slice(max(dx, 0), m.shape[1] + min(dx, 0))
                xd = slice(max(-dx, 0), m.shape[1] + min(-dx, 0))
                s[yd, xd] = m[ys, xs]
                out |= s
    return out


def dilate(m, r):
    return shift_or(m, r) if r > 0 else m


def erode(m, r):
    return ~shift_or(~m, r) if r > 0 else m


def components(m):
    """8-connected components of a sparse boolean mask: list of (ys, xs) arrays."""
    seen = np.zeros(m.shape, bool)
    out = []
    H, W = m.shape
    for y0, x0 in zip(*np.nonzero(m)):
        if seen[y0, x0]:
            continue
        q = deque([(y0, x0)])
        seen[y0, x0] = True
        ys, xs = [], []
        while q:
            y, x = q.popleft()
            ys.append(y); xs.append(x)
            for dy in (-1, 0, 1):
                for dx in (-1, 0, 1):
                    yy, xx = y + dy, x + dx
                    if 0 <= yy < H and 0 <= xx < W and m[yy, xx] and not seen[yy, xx]:
                        seen[yy, xx] = True
                        q.append((yy, xx))
        out.append((np.array(ys), np.array(xs)))
    return out


# ----------------------------------------------------------------------------------------------- report
class Report:
    def __init__(self):
        self.rows = []

    def add(self, status, check, detail):
        self.rows.append({'status': status, 'check': check, 'detail': detail})
        print(f'[{status}] {check}: {detail}')

    def worst(self):
        s = {r['status'] for r in self.rows}
        return 2 if FAIL in s else 1 if WARN in s else 0


def where(ys, xs, mpp, shape):
    cy, cx = float(np.mean(ys)), float(np.mean(xs))
    return (f'px ({cx:.0f},{cy:.0f}) = local ({cx / shape[1]:.3f},{cy / shape[0]:.3f}) = '
            f'{cx * mpp / 1000:.1f} km E, {cy * mpp / 1000:.1f} km S of the tile NW corner')


# ----------------------------------------------------------------------------------------------- main
def main():
    ap = argparse.ArgumentParser(description=__doc__, formatter_class=argparse.RawDescriptionHelpFormatter)
    ap.add_argument('tile', help='exported tile folder, e.g. world/build/gaea/now-act1')
    ap.add_argument('--heights', help='build heights to check (default: the tile heightfield itself)')
    ap.add_argument('--ref', help='reference heights (default: <tile>/heightfield.r32)')
    ap.add_argument('--heights-metres', type=float,
                    help='metres that 1.0 means in --heights (default: heightMetres from gaea.json). Use 8546 if '
                         'the build exported in rendered (2x) metres-normalised units')
    ap.add_argument('--tol', type=float, default=0.5, help='height tolerance in real metres (default 0.5)')
    ap.add_argument('--flat-tol', type=float, default=1.0, help='allowed range of the pan floor, metres (default 1)')
    ap.add_argument('--above', type=float, default=1.0,
                    help='how far the acid field and other pools must stand above the pan floor, metres (default 1)')
    ap.add_argument('--pan-level', type=float, help='pan floor level in metres (default: the commonest pan height)')
    ap.add_argument('--colour', help='colour build (PNG/TIF/EXR) to check that the acid field is the loudest')
    ap.add_argument('--json', help='also write the report as JSON to this path')
    a = ap.parse_args()

    meta = json.load(open(os.path.join(a.tile, 'gaea.json'), encoding='utf-8'))
    Hm = float(meta['terrainDefinition']['heightMetres'])
    mpp = float(meta.get('metresPerPixel', 125))
    ref, _ = load_heights(a.ref or os.path.join(a.tile, 'heightfield.r32'))
    shape = ref.shape
    ref_m = ref * Hm
    rep = Report()
    print(f'tile {a.tile}: {shape[1]}x{shape[0]} px, {mpp:g} m/px, 1.0 = {Hm:g} m (real)')

    if a.heights:
        cand, dtype = load_heights(a.heights)
        if cand.shape != shape:
            rep.add(WARN, 'resolution', f'{a.heights} is {cand.shape[1]}x{cand.shape[0]}; resampled to the tile grid '
                                        '(bilinear) - edges of small pools will not compare exactly')
            cand = resample(cand, shape)
        cand_m = cand * (a.heights_metres or Hm)
        label = os.path.basename(a.heights)
    else:
        cand_m, dtype, label = ref_m.copy(), 'float32', 'exported Azgaar heights'
    print(f'checking: {label} ({dtype})\n')

    m = lambda n: load_mask(a.tile, n, shape)
    water = m('mask-water.png')
    acid_lakes = m('mask-lakes-acid.png')
    other_lakes = m('mask-lakes-other.png')
    salt = m('mask-biome-salt-flats.png')
    acid_ground = m('mask-biome-acid-pits.png')
    sulfur = m('mask-biome-sulfur-crust.png')
    spring = m('mask-biome-dead-spring.png')
    if any(x is None for x in (water, acid_lakes, other_lakes, salt)):
        sys.exit('tile folder is missing mask-water / mask-lakes-* / mask-biome-salt-flats')

    # brine pools = the non-acid lakes that sit in the salt pan
    near_pan = dilate(salt, 2)
    brine = np.zeros(shape, bool)
    others = []
    for ys, xs in components(other_lakes):
        if near_pan[ys, xs].any():
            brine[ys, xs] = True
        else:
            others.append((ys, xs))
    pan = salt & ~water

    # precision: half-float exports cannot hold heights more exactly than their step
    tol = np.full(shape, a.tol)
    if dtype == 'float16':
        ulp = np.spacing(np.abs(cand_m / Hm).astype(np.float16)).astype(np.float64) * Hm
        tol = np.maximum(tol, ulp)
    if dtype in ('uint16',):
        tol = np.maximum(tol, Hm / 65535.0)

    # ---------------------------------------------------------------- orientation and scale sanity
    if a.heights:
        core = erode(water, 2)
        if core.sum() > 50:
            d_id = np.median(np.abs(cand_m[core] - ref_m[core]))
            flipped = cand_m[::-1]
            d_fl = np.median(np.abs(flipped[core] - ref_m[core]))
            if d_fl < d_id * 0.5:
                rep.add(FAIL, 'orientation', 'the build looks flipped north-south (top row south); fix the export or '
                                             'File node, results below assume it is flipped back')
                cand_m = flipped
            pos = core & (ref_m > 5)
            if pos.sum() > 50:
                ratio = float(np.median(cand_m[pos] / ref_m[pos]))
                if abs(ratio - 1) > 0.02:
                    rep.add(FAIL, 'height scale', f'lake heights in the build are {ratio:.3f}x the drawn ones; if the '
                                                  f'whole build is scaled, rerun with --heights-metres '
                                                  f'{(a.heights_metres or Hm) / ratio:.0f}')

    # ---------------------------------------------------------------- 1. lakes exactly as drawn
    d = cand_m - ref_m
    for name, mk in (('brine pools', brine), ('acid pools', acid_lakes),
                     ('other pools (mineral pool, Dead Spring, lava lake)', other_lakes & ~brine)):
        if not mk.any():
            continue
        core, edge = erode(mk, 2), mk & ~erode(mk, 2)
        bad = core & (np.abs(d) > tol)
        if bad.any():
            ys, xs = np.nonzero(bad)
            rep.add(FAIL, f'{name} as drawn', f'{bad.sum()} of {core.sum()} interior px moved (max {np.abs(d[bad]).max():.1f} m, '
                                             f'mean {d[bad].mean():+.1f} m) near {where(ys, xs, mpp, shape)}')
        else:
            rep.add(PASS, f'{name} as drawn', f'{core.sum()} interior px within {a.tol:g} m')
        e = np.abs(d[edge])
        if e.size and e.max() > max(a.tol, 2.0):
            rep.add(WARN, f'{name} shorelines', f'{(e > 2).sum()} of {edge.sum()} shoreline px moved by more than 2 m '
                                               f'(max {e.max():.1f} m): erosion is reaching the pool edges')

    # ---------------------------------------------------------------- 2. pan floor did not move and is flat
    if a.pan_level is not None:
        level = a.pan_level
    else:
        vals = np.round(ref_m[pan], 2)
        u, c = np.unique(vals, return_counts=True)
        level = float(u[c.argmax()])
    floor = pan & (ref_m <= level + 0.5)            # the flat floor as drawn (incl. interpolation holes)
    holes = floor & (ref_m < level - a.tol)
    margin = pan & ~floor                           # salt crust climbing the basin edge
    ok = (np.abs(d) <= tol) | (holes & (np.abs(cand_m - level) <= tol))
    moved = floor & ~ok
    if moved.any():
        ys, xs = np.nonzero(moved)
        rep.add(FAIL, 'pan floor did not move', f'{moved.sum()} of {floor.sum()} px moved (max {np.abs(d[moved]).max():.1f} m) '
                                                f'near {where(ys, xs, mpp, shape)}')
    else:
        rep.add(PASS, 'pan floor did not move', f'{floor.sum()} px at the drawn level {level:.2f} m'
                                                + (f' ({holes.sum()} hole px filled to the level)' if holes.any()
                                                   and np.all(np.abs(cand_m[holes] - level) <= tol[holes]) else ''))
    fv = cand_m[floor]
    rng = float(fv.max() - fv.min()) if fv.size else 0.0
    if rng > a.flat_tol:
        lo = floor & (cand_m < level - a.tol)
        msg = f'floor spans {fv.min():.2f}-{fv.max():.2f} m (range {rng:.2f} m > {a.flat_tol:g} m)'
        if lo.any():
            for ys, xs in sorted(components(lo), key=lambda c: -len(c[0]))[:5]:
                msg += f'; {len(ys)} px hole down to {cand_m[ys, xs].min():.1f} m at {where(ys, xs, mpp, shape)}'
        rep.add(WARN, 'pan floor dead flat', msg)
    else:
        rep.add(PASS, 'pan floor dead flat', f'range {rng:.2f} m over {floor.sum()} px')
    if margin.any():
        dm = np.abs(d[margin])
        st = WARN if dm.max() > 5 else PASS
        rep.add(st, 'pan margin (salt on the basin edge)', f'{margin.sum()} px, max change {dm.max():.1f} m, '
                                                           f'95th pct {np.percentile(dm, 95):.1f} m')

    # ---------------------------------------------------------------- 3. pan and brine pools are the lowest ground
    lvl = float(np.median(cand_m[floor])) if floor.any() else level
    allowed = pan | brine
    gmin = cand_m.min()
    ys, xs = np.nonzero(cand_m <= gmin + 1e-6)
    in_allowed = allowed[ys, xs].mean()
    rep.add(PASS if in_allowed > 0.5 else FAIL, 'lowest point',
            f'{gmin:.2f} m; {in_allowed * 100:.0f}% of the lowest px are pan or brine pool ({where(ys, xs, mpp, shape)})')
    below = ~allowed & (cand_m < lvl - tol)
    if below.any():
        regions = []
        named = [('acid pool', acid_lakes), ('other pool', other_lakes & ~brine)] + [
            (f[11:-4], m(f)) for f in sorted(os.listdir(a.tile)) if f.startswith('mask-biome-') and f.endswith('.png')]
        for ys, xs in sorted(components(below), key=lambda c: -len(c[0]))[:8]:
            tags = [n for n, mk in named if mk is not None and mk[ys, xs].any()] or ['unpainted ground']
            regions.append(f'{len(ys)} px ({"/".join(tags)}) down to {cand_m[ys, xs].min():.1f} m at {where(ys, xs, mpp, shape)}')
        rep.add(FAIL, 'nothing lower than the pan', f'pan floor {lvl:.2f} m; {below.sum()} px lower: ' + '; '.join(regions))
    else:
        rep.add(PASS, 'nothing lower than the pan', f'pan floor {lvl:.2f} m')
    must_rise = [('acid pools', acid_lakes), ('acid ground', acid_ground), ('sulfur crust', sulfur),
                 ('Dead Spring ground', spring)] + [(f'pool at {where(ys, xs, mpp, shape).split(" = ")[0]}',
                                                     _mk(shape, ys, xs)) for ys, xs in others]
    for name, mk in must_rise:
        if mk is None or not mk.any():
            continue
        v = cand_m[mk]
        mn, p5 = float(v.min()), float(np.percentile(v, 5))
        if mn < lvl + a.above:
            share = float((v < lvl + a.above).mean() * 100)
            rep.add(WARN, f'{name} above the pan', f'min {mn:.1f} m, 5th pct {p5:.1f} m vs pan floor {lvl:.2f} m: '
                                                   f'{share:.1f}% of it is not at least {a.above:g} m above the pan')
        else:
            rep.add(PASS, f'{name} above the pan', f'min {mn:.1f} m ({mn - lvl:+.1f} m over the pan floor)')

    # ---------------------------------------------------------------- 4. colour: the acid field is the loudest
    if a.colour:
        check_colour(a, rep, shape, m, acid_lakes, acid_ground, sulfur)

    worst = rep.worst()
    print(f'\nresult: {["all checks pass", "warnings", "FAILURES"][worst]}')
    if a.json:
        json.dump({'tile': a.tile, 'heights': a.heights, 'pan_level_m': level, 'result': worst, 'checks': rep.rows},
                  open(a.json, 'w', encoding='utf-8'), indent=2)
    return worst


def _mk(shape, ys, xs):
    mk = np.zeros(shape, bool)
    mk[ys, xs] = True
    return mk


def srgb_to_lab_full(rgb):
    c = np.where(rgb <= 0.04045, rgb / 12.92, ((rgb + 0.055) / 1.055) ** 2.4)
    M = np.array([[0.4124, 0.3576, 0.1805], [0.2126, 0.7152, 0.0722], [0.0193, 0.1192, 0.9505]])
    xyz = c @ M.T / np.array([0.95047, 1.0, 1.08883])
    f = np.where(xyz > 216 / 24389, np.cbrt(xyz), (24389 / 27 * xyz + 16) / 116)
    return np.stack([116 * f[..., 1] - 16, 500 * (f[..., 0] - f[..., 1]), 200 * (f[..., 1] - f[..., 2])], -1)


def srgb_to_lab(rgb):
    c = np.where(rgb <= 0.04045, rgb / 12.92, ((rgb + 0.055) / 1.055) ** 2.4)
    M = np.array([[0.4124, 0.3576, 0.1805], [0.2126, 0.7152, 0.0722], [0.0193, 0.1192, 0.9505]])
    xyz = c @ M.T / np.array([0.95047, 1.0, 1.08883])
    f = np.where(xyz > 216 / 24389, np.cbrt(xyz), (24389 / 27 * xyz + 16) / 116)
    L = 116 * f[..., 1] - 16
    A = 500 * (f[..., 0] - f[..., 1])
    B = 200 * (f[..., 1] - f[..., 2])
    return L, np.hypot(A, B)


def check_colour(a, rep, shape, m, acid_lakes, acid_ground, sulfur):
    ext = os.path.splitext(a.colour)[1].lower()
    if ext == '.exr':
        try:
            import imageio.v3 as iio
            rgb = iio.imread(a.colour)[..., :3].astype(np.float64)
        except Exception:
            rep.add(WARN, 'colour', 'reading a colour EXR needs `pip install imageio` with an EXR plugin; '
                                    'export or screenshot the colour as PNG instead')
            return
        rgb = np.clip(rgb, 0, 1) ** (1 / 2.2)  # linear EXR -> display-ish
    else:
        im = Image.open(a.colour).convert('RGB')
        if im.size != (shape[1], shape[0]):
            im = im.resize((shape[1], shape[0]), Image.BILINEAR)
        rgb = np.asarray(im).astype(np.float64) / 255.0
    L, C = srgb_to_lab(rgb)
    zone = acid_lakes | (acid_ground if acid_ground is not None else False) | (sulfur if sulfur is not None else False)
    ring = dilate(zone, 24) & ~zone
    Lab = srgb_to_lab_full(rgb)
    rows, means = [], {}
    for f in sorted(os.listdir(a.tile)):
        if f.startswith('mask-biome-') and f.endswith('.png') and f[11:-4] not in ('acid-pits', 'sulfur-crust'):
            mk = m(f)
            if mk is not None and mk.sum() > 200:
                rows.append((float(C[mk].mean()), f[11:-4]))
                means[f[11:-4]] = Lab[mk].mean(axis=0)
    FIELD = 'ACID FIELD (pools + ground + sulfur)'
    rows.append((float(C[zone].mean()), FIELD))
    rows.sort(reverse=True)
    rank = [n for _, n in rows].index(FIELD) + 1
    print('  mean chroma (CIELAB C*) by zone: ' + ', '.join(f'{n} {c:.0f}' for c, n in rows[:8]))
    cz, cr = float(C[zone].mean()), float(C[ring].mean())
    pools_c = float(C[acid_lakes].mean()) if acid_lakes.any() else 0
    top_other = max(c for c, n in rows if n != FIELD)
    st = PASS if rank == 1 and cz >= 1.25 * cr and pools_c >= top_other else WARN
    rep.add(st, 'acid field is the loudest colour',
            f'rank {rank} of {len(rows)} by chroma; field {cz:.0f} vs surrounding 3 km ring {cr:.0f} '
            f'(x{cz / max(cr, 1e-6):.2f}, want >= 1.25); pools {pools_c:.0f} vs the most saturated other zone {top_other:.0f}; '
            f'lightness contrast field-ring {float(L[zone].mean() - L[ring].mean()):+.0f}')
    # colour twins: a part of the acid field whose average colour another zone repeats reads as "the same stuff"
    for name, mk in (('acid pools', acid_lakes), ('acid ground', acid_ground), ('sulfur crust', sulfur)):
        if mk is None or not mk.any() or not means:
            continue
        mz = Lab[mk].mean(axis=0)
        other, de = min(((n, float(np.linalg.norm(mz - v))) for n, v in means.items()), key=lambda t: t[1])
        rep.add(PASS if de >= 15 else WARN, f'{name} colour is unique',
                f'nearest other zone is {other} at dE*ab {de:.0f} (want >= 15)')


if __name__ == '__main__':
    sys.exit(main())
