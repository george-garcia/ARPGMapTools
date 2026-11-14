"""Outer edge of the act's rock paint: per row/column, the outermost Rim Hills / Rift Escarpment cell; spread in km."""
import numpy as np, statistics as st
ROCK = {"Rim Hills", "Rift Escarpment"}
def scan(u, v, names):
    rock = np.array([n in ROCK for n in names])
    out = {}
    e = []
    for vv in np.arange(0.15, 0.86, 0.025):
        m = rock & (np.abs(v - vv) < 0.012) & (u > 0.85) & (u < 1.6)
        if m.any(): e.append(u[m].max())
    s = []
    for uu in np.arange(0.15, 0.91, 0.025):
        m = rock & (np.abs(u - uu) < 0.012) & (v > 0.8) & (v < 1.6)
        if m.any(): s.append(v[m].max())
    w = []
    for vv in np.arange(0.0, 0.70, 0.025):
        m = rock & (np.abs(v - vv) < 0.012) & (u < 0.3) & (u > -1.0)
        if m.any(): w.append(u[m].min())
    n = []
    for uu in np.arange(0.45, 1.0, 0.025):
        m = rock & (np.abs(u - uu) < 0.012) & (v < 0.2) & (v > -1.0)
        if m.any(): n.append(v[m].min())
    return {"east": (st.pstdev(e) * 100, min(e), max(e)), "south": (st.pstdev(s) * 64, min(s), max(s)),
            "west": (st.pstdev(w) * 100, min(w), max(w)), "north": (st.pstdev(n) * 64, min(n), max(n))}
if __name__ == "__main__":
    import sys, json
    from paintsim import Sim
    files = None
    if len(sys.argv) > 1 and sys.argv[1] == "pass1":
        import subprocess
        s = Sim('now', files=["/tmp/claude-0/-home-claude/7caafd89-0678-50ce-9389-72eb5e6ae44d/scratchpad/p2/work/pass1-30-biomes.json"])
    else:
        s = Sim(sys.argv[2] if len(sys.argv) > 2 else 'now')
    for k, (sd, a, b) in scan(s.u, s.v, s.biome).items(): print(f"{k:6s} spread {sd:5.1f} km  range {a:.3f}..{b:.3f}")
