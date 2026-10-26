import { ImageResponse } from "next/og";
import { readFile } from "node:fs/promises";
import path from "node:path";

import { EDITION, fromCertificate, previewEntrants, winners, sortedEntrants } from "../../../../../lib/results";
import { publishedCertificates } from "../../../../../lib/store";
import { getSetting } from "../../../../../lib/settings";

export const alt = `Winners of the ${EDITION.name}`;
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";
export const revalidate = 60;

const font = (file) => readFile(path.join(process.cwd(), "public", "fonts", file));

async function podium() {
  try {
    const preview = previewEntrants();
    const rows = await publishedCertificates();
    const all = [...rows.map(fromCertificate), ...preview];
    const live = preview.length > 0 || (all.length > 0 && (await getSetting("results_published")));
    if (!live) return [];
    return winners(sortedEntrants(all))
      .filter((w) => !w.category.voted)
      .map((w) => ({ place: w.category.name, name: w.entrant.project || w.entrant.team }));
  } catch {
    return [];
  }
}

export default async function Image() {
  const [besley, besleyItalic, franklin, places] = await Promise.all([
    font("besley-400.ttf"),
    font("besley-italic-400.ttf"),
    font("libre-franklin-600.ttf"),
    podium(),
  ]);

  return new ImageResponse(
    (
      <div style={{ width: "100%", height: "100%", display: "flex", background: "#F3EFE3", color: "#0D241E" }}>
        <div style={{ display: "flex", flexDirection: "column", justifyContent: "space-between", width: 600, padding: "64px 56px 56px 72px" }}>
          <div style={{ display: "flex", fontFamily: "Besley", fontSize: 40 }}>Ship AI</div>
          <div style={{ display: "flex", flexDirection: "column" }}>
            <div style={{ display: "flex", fontFamily: "Besley", fontSize: 108, lineHeight: 1, letterSpacing: -3 }}>
              The
            </div>
            <div style={{ display: "flex", fontFamily: "BesleyItalic", fontSize: 108, lineHeight: 1, letterSpacing: -3 }}>
              winners
            </div>
            <div style={{ display: "flex", fontFamily: "Franklin", fontSize: 26, marginTop: 28, color: "#4B5B53" }}>
              {EDITION.name}
            </div>
          </div>
          <div style={{ display: "flex", fontFamily: "Franklin", fontSize: 24, color: "#4B5B53" }}>shipai.club</div>
        </div>
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
            flex: 1,
            background: "#0D241E",
            color: "#F3EFE3",
            padding: "0 64px",
            gap: 34,
          }}
        >
          {(places.length ? places : [{ place: "First place", name: "" }]).map((p, i) => (
            <div key={p.place} style={{ display: "flex", flexDirection: "column" }}>
              <div style={{ display: "flex", fontFamily: "Franklin", fontSize: 22, color: "#A9B8AE" }}>{p.place}</div>
              {p.name && (
                <div
                  style={{
                    display: "flex",
                    fontFamily: "Besley",
                    fontSize: i === 0 ? 68 : 50,
                    lineHeight: 1.05,
                    marginTop: 4,
                  }}
                >
                  {p.name}
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    ),
    {
      ...size,
      fonts: [
        { name: "Besley", data: besley, style: "normal", weight: 400 },
        { name: "BesleyItalic", data: besleyItalic, style: "italic", weight: 400 },
        { name: "Franklin", data: franklin, style: "normal", weight: 600 },
      ],
    },
  );
}
