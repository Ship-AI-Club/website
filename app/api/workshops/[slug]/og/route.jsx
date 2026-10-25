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
  const logo = `data:image/png;base64,${(await readFile(join(process.cwd(), "public/logo-mark.png"))).toString("base64")}`;
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
  const fonts = await Promise.all(["regular", "bold"].map(async (weight) => ({ name: "Geist", data: await readFile(join(process.cwd(), `public/fonts/workshop-geist-${weight}.ttf`)), weight: weight === "bold" ? 700 : 400, style: "normal" })));
  return new ImageResponse(
    <div style={{ display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", width: "100%", height: "100%", background: "#fff", color: "#0b0d12", padding: "40px 64px", fontFamily: "Geist" }}>
      <div style={{ display: "flex", alignItems: "center", gap: 14, marginBottom: 36 }}><img src={logo} width={52} height={52} /><span style={{ fontSize: 38, fontWeight: 700 }}>Ship AI</span></div>
      <div style={{ display: "flex", flexDirection: "column", width: "100%", textAlign: "center", alignItems: "center", fontSize: headingSize, fontWeight: 700, lineHeight: 1.08, letterSpacing: -2 }}><span>{heading[0]}</span><span style={{ color: "#2155ed" }}>{heading[1]}</span></div>
      <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 24, marginTop: 32, fontSize: 25 }}><span>{date}</span><span style={{ border: "2px solid #2155ed", color: "#2155ed", padding: "9px 18px", borderRadius: 50, fontSize: 23 }}>{limit}</span></div>
      {people.length > 0 && <div style={{ display: "flex", gap: 28, justifyContent: "center", marginTop: 28 }}>{people.map(person => <div key={person.id} style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 8 }}>{person.ogAvatar && <img src={person.ogAvatar} width={82} height={82} style={{ borderRadius: 50, objectFit: "cover" }} />}<span style={{ fontSize: 20 }}>{person.name}</span></div>)}</div>}
    </div>, { width: 1200, height: 630, headers, fonts },
  );
}
