from PIL import Image, ImageDraw, ImageFont
from pathlib import Path

ROOT = Path('/Users/santos/shipai')
ASSETS = ROOT / 'events/arizona-ai-hackathon-2027/assets'
F = ROOT / 'site/public/fonts'
OUT = ROOT / 'site/public/og-talks.jpg'
BG = '#0D241E'; BONE = '#ECE6D3'; SAGE = '#B7C0B1'; MINT = '#9DC7B2'; RULE = '#2A4A40'; BRASS = '#C9AD72'
MONO = 'fragment-mono-400.ttf'; SERIF = 'besley-400.ttf'; SERIF_I = 'besley-italic-400.ttf'
SANS = 'libre-franklin-400.ttf'; SANS_B = 'libre-franklin-600.ttf'
W, H, M = 1200, 630, 84

import math

BAYER = [[(v + 0.5) / 16 for v in r] for r in [[0, 8, 2, 10], [12, 4, 14, 6], [3, 11, 1, 9], [15, 7, 13, 5]]]
ART = '#9DB8AB'
HULL = [(0, 4), (214, -6), (236, 0), (214, 28), (16, 28)]
HOUSE = [(56, -2), (62, -24), (158, -24), (176, -4)]
WHEEL = [(110, -24), (116, -40), (152, -40), (160, -24)]


def hsh(x, y):
    s = math.sin(x * 127.1 + y * 311.7) * 43758.5453
    return s - math.floor(s)


def clamp(v):
    return 0 if v < 0 else 1 if v > 1 else v


def in_poly(x, y, poly):
    c = False
    j = len(poly) - 1
    for i in range(len(poly)):
        xi, yi = poly[i]; xj, yj = poly[j]
        if (yi > y) != (yj > y) and x < (xj - xi) * (y - yi) / (yj - yi) + xi:
            c = not c
        j = i
    return c


def vessel(x, y, ox, oy, s):
    X = (x - ox) / s; Y = (y - oy) / s
    if X < -6 or X > 250 or Y < -70 or Y > 34:
        return False
    return in_poly(X, Y, HULL) or in_poly(X, Y, HOUSE) or in_poly(X, Y, WHEEL) or (132 < X < 136 and -64 < Y < -40) or (122 < X < 146 and -58 < Y < -55)


def harbor(x, y, t, H):
    hz = H * 0.58; mx = 900; my = H * 0.2
    boats = [(120, hz + 46, 0.85), (330, hz + 22, 0.7), (520, hz + 66, 1.1), (700, hz + 12, 0.55), (860, hz + 30, 0.62), (1040, hz + 54, 0.95)]
    for ox, oy, s in boats:
        if vessel(x, y, ox, oy + math.sin(t * 0.8 + ox) * 1.5, s):
            return 1
    for ox, oy, s in boats:
        if math.hypot(x - (ox + 134 * s), y - (oy - 66 * s)) < 5 * s:
            return 1
    if y < hz:
        md = math.hypot(x - mx, y - my)
        if md < 30:
            return 1
        h = hsh(math.floor(x / 6), math.floor(y / 4))
        if h > 0.987:
            return 0.6 + 0.4 * math.sin(t * 1.8 + h * 60)
        return 0.18 - (md / 90) * 0.16 if md < 90 else 0.02
    dz = (y - hz) / (H - hz)
    d = 0.1 + 0.08 * math.sin(x * 0.02 * (1 + dz * 2) + t * 0.8 + 6 / (dz + 0.1))
    if abs(x - mx) < 16 + dz * 140:
        d += 0.35 * (0.6 + 0.4 * math.sin(y * 0.7 + t * 3 + x * 0.05))
    for ox, oy, s in boats:
        lx = ox + 134 * s
        if abs(x - lx) < 4 and oy + 30 * s < y < oy + 30 * s + 70 * s:
            d += 0.6 * (0.5 + 0.5 * math.sin(y * 0.6 + t * 2.5))
    return clamp(d)


def draw_art(d, x0, y0, x1, y1, sx0=430, sx1=1160, t=2.0, cw=6, ch=4):
    w = x1 - x0; h = y1 - y0
    k = (sx1 - sx0) / w
    H = h * k
    j = 0
    for y in range(0, h, ch):
        i = 0
        for x in range(0, w, cw):
            v = harbor(sx0 + (x + cw / 2) * k, (y + ch / 2) * k, t, H)
            if v > BAYER[j & 3][i & 3]:
                d.rectangle((x0 + x, y0 + y + 1, x0 + x + cw - 2, y0 + y + ch - 2), fill=ART)
            i += 1
        j += 1




def font(name, size):
    return ImageFont.truetype(str(F / name), size)


def txt(d, xy, text, size, color=BONE, kind=MONO, anchor='ls', limit=None):
    f = font(kind, size)
    w = d.textlength(text, font=f)
    if limit is not None:
        x = xy[0] - (w if anchor[0] == 'r' else 0)
        assert x + w <= limit, f'{text!r} overflows ({x + w:.0f} > {limit})'
    d.text(xy, text, font=f, fill=color, anchor=anchor)
    return w


def rule(d, y):
    d.line((M, y, 600, y), fill=RULE, width=2)


def fit_h(im, h):
    s = h / im.height
    return im.resize((max(1, round(im.width * s)), h), Image.LANCZOS)


im = Image.new('RGB', (W, H), BG)
d = ImageDraw.Draw(im)

ship = fit_h(Image.open(ASSETS / 'ship-ai-lockup.png').convert('RGBA'), 46)
im.paste(ship, (M, 40), ship)
rule(d, 116)
draw_art(d, 640, 0, W, H, sx0=470, sx1=1130)

txt(d, (M - 6, 300), 'One night,', 104, BONE, SERIF, limit=620)
txt(d, (M - 6, 410), 'one topic.', 104, BONE, SERIF_I, limit=620)
txt(d, (M, 488), 'Free talks in Phoenix.', 32, SAGE, SANS, limit=W - M)

rule(d, 552)
txt(d, (M, 596), 'SHIPAI.CLUB/TALKS', 20, SAGE)

im.save(OUT, quality=90)
print(OUT)
