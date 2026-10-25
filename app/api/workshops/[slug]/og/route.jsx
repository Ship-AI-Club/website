import { ImageResponse } from "next/og";
import { readFile } from "node:fs/promises";
import { join } from "node:path";
import { managedWorkshop, workshopMedia } from "../../../../../lib/workshop-media";
import { loadWorkshopOgImage } from "../../../../../lib/workshop-og-image";
export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function GET(request, { params }) {
  const { slug } = await params;
  const workshop = managedWorkshop(slug);
  if (!workshop) return new Response("Workshop not found", { status: 404 });
  const media = await workshopMedia(slug);
  const headers = { "Cache-Control": "public, max-age=0, must-revalidate" };
  if (media.coverUrl) {
    if (media.coverUrl === "/workshop-art/website-marketing-instructors.png") {
      return new Response(await readFile(join(process.cwd(), "public", media.coverUrl)), { headers: { ...headers, "Content-Type": "image/png" } });
    }
    // Admin cover URLs come only from our authenticated Blob upload action.
    const cover = await loadWorkshopOgImage(media.coverUrl);
    if (cover) return new Response(cover, { headers: { ...headers, "Content-Type": "image/png" } });
  }
  const logo = `data:image/svg+xml;base64,${(await readFile(join(process.cwd(), "public/brand/seal-banknote.svg"))).toString("base64")}`;
  const scheduled = slug === "vibe-coding-gtm";
  const organization = slug === "build-your-ai-organization";
  const date = scheduled ? "October 10 · Phoenix" : organization ? "February 19–20, 2027 · Phoenix" : "Hands-On Workshop · Dates Coming Soon";
  const limit = scheduled ? "Only 10 Seats" : organization ? "50 Attendees" : `Up To ${workshop.capacity} Attendees`;
  const people = await Promise.all(media.facilitators.slice(0,4).map(async person => {
    const image = await loadWorkshopOgImage(person.avatar_url, { width: 164, height: 164 });
    return { ...person, ogAvatar: image ? `data:image/png;base64,${image.toString("base64")}` : null };
  }));
  const heading = workshop.heading || (organization ? ["Build Your Business", "Teams With AI"] : [workshop.name, ""]);
  const headingSize = Math.min(76, 1800 / Math.max(...heading.map(line => line.length)));
  const fonts = await Promise.all([
    ["Libre Franklin", "libre-franklin-400.ttf", 400],
    ["Libre Franklin", "libre-franklin-600.ttf", 600],
    ["Besley", "besley-400.ttf", 400],
    ["Fragment Mono", "fragment-mono-400.ttf", 400],
  ].map(async ([name, file, weight]) => ({ name, data: await readFile(join(process.cwd(), `public/fonts/${file}`)), weight, style: "normal" })));
  return new ImageResponse(
    <div style={{ display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", width: "100%", height: "100%", background: "#F3EFE3", color: "#0D241E", padding: "40px 64px", fontFamily: "Libre Franklin" }}>
      <div style={{ display: "flex", alignItems: "center", gap: 14, marginBottom: 36 }}><img src={logo} width={52} height={52} /><span style={{ fontSize: 34, fontFamily: "Besley" }}>Ship AI</span><span style={{ fontSize: 18, fontFamily: "Fragment Mono", color: "#4B5B53", paddingLeft: 14, borderLeft: "1px solid #D6CFBC" }}>Community</span></div>
      <div style={{ display: "flex", flexDirection: "column", width: "100%", textAlign: "center", alignItems: "center", fontSize: headingSize, fontFamily: "Besley", fontWeight: 400, lineHeight: 1.06, letterSpacing: -1.5 }}><span>{heading[0]}</span><span style={{ color: "#1C5544" }}>{heading[1]}</span></div>
      <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 24, marginTop: 32, fontSize: 24, fontFamily: "Fragment Mono" }}><span>{date}</span><span style={{ border: "1px solid #0D241E", color: "#0D241E", padding: "9px 18px", borderRadius: 0, fontSize: 21 }}>{limit}</span></div>
      {people.length > 0 && <div style={{ display: "flex", gap: 28, justifyContent: "center", marginTop: 28 }}>{people.map(person => <div key={person.id} style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 8 }}>{person.ogAvatar && <img src={person.ogAvatar} width={82} height={82} style={{ borderRadius: 50, objectFit: "cover" }} />}<span style={{ fontSize: 20 }}>{person.name}</span></div>)}</div>}
    </div>, { width: 1200, height: 630, headers, fonts },
  );
}
