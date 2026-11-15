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
    d.line((M, y, W - M, y), fill=RULE, width=2)


def fit_h(im, h):
    s = h / im.height
    return im.resize((max(1, round(im.width * s)), h), Image.LANCZOS)


im = Image.new('RGB', (W, H), BG)
d = ImageDraw.Draw(im)

ship = fit_h(Image.open(ASSETS / 'ship-ai-lockup.png').convert('RGBA'), 46)
im.paste(ship, (M, 34), ship)
txt(d, (W - M, 57), 'PHOENIX, ARIZONA', 20, MINT, anchor='rm')
rule(d, 108)

txt(d, (M, 160), 'TALKS', 20, SAGE)
txt(d, (M - 4, 252), 'One night,', 86, BONE, SERIF, limit=600)
txt(d, (M - 4, 338), 'one topic.', 86, BONE, SERIF_I, limit=600)
d.line((640, 190, 640, 340), fill=RULE, width=2)
txt(d, (684, 244), 'Free talks in Phoenix.', 30, BONE, SANS, limit=W - M)
txt(d, (684, 284), 'Take the prompts, the deck', 30, BONE, SANS, limit=W - M)
txt(d, (684, 324), 'and the file home.', 30, BONE, SANS, limit=W - M)
rule(d, 380)

items = [('01', 'Standalone talks'), ('02', 'Socratic Night'), ('03', 'Claude Code Build Night')]
col = (W - 2 * M) / 3
for i, (n, label) in enumerate(items):
    x = M + round(i * col)
    nw = txt(d, (x, 422), n, 20, BRASS, anchor='lm')
    txt(d, (x + nw + 12, 422), label, 23, BONE, SANS_B, anchor='lm', limit=x + col - 8)
rule(d, 464)

txt(d, (M, 514), 'WEDNESDAY NIGHTS', 30, BONE, limit=600)
txt(d, (M, 548), '5:30–7:30 PM MST', 20, SAGE, limit=600)
txt(d, (640, 514), 'Workuity Biltmore · Phoenix', 26, BONE, SANS_B, limit=W - M)
txt(d, (640, 548), 'FREE · OPEN TO ANYONE', 20, BRASS, limit=W - M)
rule(d, 574)
txt(d, (M, 608), 'SHIPAI.CLUB/TALKS', 18, SAGE)
txt(d, (W - M, 608), 'PRACTICAL AI, BUILT TOGETHER', 18, SAGE, anchor='rs', limit=W)

im.save(OUT, quality=90)
print(OUT)
