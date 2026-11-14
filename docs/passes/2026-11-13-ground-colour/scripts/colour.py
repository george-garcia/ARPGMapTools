import math
def lab(hx):
    hx = hx.lstrip('#'); r, g, b = [int(hx[i:i+2], 16) / 255 for i in (0, 2, 4)]
    f = lambda c: ((c + 0.055) / 1.055) ** 2.4 if c > 0.04045 else c / 12.92
    r, g, b = f(r), f(g), f(b)
    X = (0.4124*r + 0.3576*g + 0.1805*b) / 0.95047; Y = 0.2126*r + 0.7152*g + 0.0722*b; Z = (0.0193*r + 0.1192*g + 0.9505*b) / 1.08883
    h = lambda t: t ** (1/3) if t > 0.008856 else 7.787*t + 16/116
    return (116*h(Y) - 16, 500*(h(X) - h(Y)), 200*(h(Y) - h(Z)))
def chroma(hx): L, a, b = lab(hx); return math.hypot(a, b)
def de76(a, b): return math.dist(lab(a), lab(b))
def de2000(c1, c2):
    L1, a1, b1 = lab(c1); L2, a2, b2 = lab(c2)
    C1, C2 = math.hypot(a1, b1), math.hypot(a2, b2); Cb = (C1 + C2) / 2
    G = 0.5 * (1 - math.sqrt(Cb**7 / (Cb**7 + 25**7)))
    a1p, a2p = (1+G)*a1, (1+G)*a2
    C1p, C2p = math.hypot(a1p, b1), math.hypot(a2p, b2)
    h1p = math.degrees(math.atan2(b1, a1p)) % 360; h2p = math.degrees(math.atan2(b2, a2p)) % 360
    dLp = L2 - L1; dCp = C2p - C1p
    dh = h2p - h1p
    if C1p*C2p == 0: dh = 0
    elif dh > 180: dh -= 360
    elif dh < -180: dh += 360
    dHp = 2*math.sqrt(C1p*C2p)*math.sin(math.radians(dh/2))
    Lbp = (L1+L2)/2; Cbp = (C1p+C2p)/2
    if C1p*C2p == 0: hbp = h1p+h2p
    elif abs(h1p-h2p) > 180: hbp = (h1p+h2p+360)/2 if h1p+h2p < 360 else (h1p+h2p-360)/2
    else: hbp = (h1p+h2p)/2
    T = 1 - 0.17*math.cos(math.radians(hbp-30)) + 0.24*math.cos(math.radians(2*hbp)) + 0.32*math.cos(math.radians(3*hbp+6)) - 0.20*math.cos(math.radians(4*hbp-63))
    dth = 30*math.exp(-((hbp-275)/25)**2); Rc = 2*math.sqrt(Cbp**7/(Cbp**7+25**7))
    Sl = 1 + 0.015*(Lbp-50)**2/math.sqrt(20+(Lbp-50)**2); Sc = 1+0.045*Cbp; Sh = 1+0.015*Cbp*T
    Rt = -math.sin(math.radians(2*dth))*Rc
    return math.sqrt((dLp/Sl)**2 + (dCp/Sc)**2 + (dHp/Sh)**2 + Rt*(dCp/Sc)*(dHp/Sh))
if __name__ == "__main__":
    for a, b in [("#B85D23", "#C8661E"), ("#933A2A", "#C8661E"), ("#933A2A", "#CDB58C"), ("#E3D3A8", "#CDB58C"), ("#EEE4C8", "#CDB58C"), ("#49b3a8", "#1FB7A0"), ("#9E7752", "#b5b887"), ("#933A2A","#8A4A2E")]:
        print(a, b, round(de76(a, b), 1), round(de2000(a, b), 1))
    for c in ["#C8661E", "#B85D23", "#933A2A", "#F0CF2E"]: print(c, round(chroma(c), 1))
