import { ImageResponse } from "next/og";
import { readFile } from "node:fs/promises";
import { join } from "node:path";

export const runtime = "nodejs";

const BG = "#0D241E";
const INK = "#ECE6D3";
const DIM = "#B7C0B1";
const RULE = "rgba(236,230,211,0.16)";
const BRASS = "#C9AD72";

const asset = (file) => readFile(join(process.cwd(), "public", file));
const clip = (value, max) => String(value ?? "").trim().slice(0, max);

function titleSize(text, wide) {
  const n = text.length;
  if (n <= 22) return wide ? 104 : 92;
  if (n <= 36) return wide ? 88 : 74;
  if (n <= 56) return wide ? 72 : 60;
  return wide ? 60 : 50;
}

function Title({ text, keyPhrase, size }) {
  const at = keyPhrase ? text.lastIndexOf(keyPhrase) : -1;
  const parts = at < 0
    ? [{ s: text, italic: false }]
    : [
        { s: text.slice(0, at), italic: false },
        { s: keyPhrase, italic: true },
        { s: text.slice(at + keyPhrase.length), italic: false },
      ];
  const words = parts.flatMap((p) => p.s.split(/\s+/).filter(Boolean).map((w) => ({ w, italic: p.italic })));
  return (
    <div style={{ display: "flex", flexWrap: "wrap", fontSize: size, lineHeight: 1.04, letterSpacing: -1.5 }}>
      {words.map((word, i) => (
        <span key={i} style={{ fontFamily: word.italic ? "BesleyItalic" : "Besley", marginRight: size * 0.24, wordBreak: "break-word" }}>
          {word.w}
        </span>
      ))}
    </div>
  );
}

export async function GET(request) {
  const q = new URL(request.url).searchParams;
  const kicker = clip(q.get("k") || "Ship AI Community", 44);
  const title = clip(q.get("t") || "Practical AI, Built Together", 90);
  const keyPhrase = clip(q.get("i"), 60);
  const tagline = clip(q.get("d"), 110);
  const meta = clip(q.get("m") || "Phoenix, Arizona", 40);

  const [besley, besleyItalic, franklin, mono, lockup] = await Promise.all([
    asset("fonts/besley-400.ttf"),
    asset("fonts/besley-italic-400.ttf"),
    asset("fonts/libre-franklin-400.ttf"),
    asset("fonts/fragment-mono-400.ttf"),
    asset("brand/lockup-community-horizontal-bone.svg"),
  ]);
  const logo = `data:image/svg+xml;base64,${lockup.toString("base64")}`;
  const wide = !tagline;

  return new ImageResponse(
    (
      <div style={{ width: "100%", height: "100%", display: "flex", flexDirection: "column", background: BG, color: INK, padding: "0 64px" }}>
        <div style={{ display: "flex", justifyContent: "center", alignItems: "center", height: 112, borderBottom: `1px solid ${RULE}` }}>
          <img src={logo} width={310} height={44} alt="" />
        </div>
        <div style={{ display: "flex", flex: 1, alignItems: "center" }}>
          <div style={{ display: "flex", flexDirection: "column", flex: wide ? 1 : 1.35, paddingRight: wide ? 0 : 44 }}>
            <div style={{ display: "flex", fontFamily: "Mono", fontSize: 22, letterSpacing: 1, color: DIM, textTransform: "uppercase", marginBottom: 18 }}>
              {kicker}
            </div>
            <Title text={title} keyPhrase={keyPhrase} size={titleSize(title, wide)} />
          </div>
          {!wide && (
            <div style={{ display: "flex", alignItems: "center", flex: 1, height: 240, paddingLeft: 44, borderLeft: `1px solid ${RULE}` }}>
              <div style={{ display: "flex", fontFamily: "Franklin", fontSize: 34, lineHeight: 1.3, color: INK }}>{tagline}</div>
            </div>
          )}
        </div>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", height: 88, borderTop: `1px solid ${RULE}`, fontFamily: "Mono", fontSize: 20, letterSpacing: 1, textTransform: "uppercase" }}>
          <span style={{ color: DIM }}>shipai.club</span>
          <span style={{ color: BRASS }}>{meta}</span>
        </div>
      </div>
    ),
    {
      width: 1200,
      height: 630,
      fonts: [
        { name: "Besley", data: besley, weight: 400, style: "normal" },
        { name: "BesleyItalic", data: besleyItalic, weight: 400, style: "italic" },
        { name: "Franklin", data: franklin, weight: 400, style: "normal" },
        { name: "Mono", data: mono, weight: 400, style: "normal" },
      ],
      headers: { "Cache-Control": "public, max-age=86400, s-maxage=31536000, stale-while-revalidate=86400" },
    },
  );
}
