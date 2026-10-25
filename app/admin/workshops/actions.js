"use server";
import { COVER_TYPES, validCoverBytes } from "../../../lib/workshop-media-validation";
import { put } from "@vercel/blob";
import { revalidatePath } from "next/cache";
import { requireAdmin } from "../../../lib/auth";
import { sql } from "../../../lib/db";
import { managedWorkshop, ensureWorkshopMedia } from "../../../lib/workshop-media";

export async function saveWorkshopMedia(previous, form) {
  await requireAdmin("/admin/workshops");
  await ensureWorkshopMedia();
  const slug = String(form.get("slug") || "");
  if (!managedWorkshop(slug)) return { error: "Choose a valid workshop." };
  const ids = [...new Set(form.getAll("facilitator").map(String))];
  if (ids.length > 8 || ids.some(id => !/^[0-9a-f]{8}-(?:[0-9a-f]{4}-){3}[0-9a-f]{12}$/i.test(id))) return { error: "Choose up to eight facilitators." };
  const people = ids.length ? await sql`select id from users where id = any(${ids}::uuid[]) and public_profile = true and name <> ''` : [];
  if (people.length !== ids.length) return { error: "Facilitators need a public Ship AI profile." };
  const file = form.get("cover");
  const types = COVER_TYPES;
  if (file?.size && (!types[file.type] || file.size > 3 * 1024 * 1024)) return { error: "Use a PNG, JPEG, or WebP under 3 MB." };
  if (file?.size && !validCoverBytes(file.type, new Uint8Array(await file.arrayBuffer()))) return { error: "That file is not a valid PNG, JPEG, or WebP image." };
  try {
    const existing = await sql`select cover_url from workshop_media where slug = ${slug}`;
    let cover = form.get("resetCover") ? "" : existing[0]?.cover_url || "";
    if (file?.size) {
      const blob = await put(`workshops/${slug}/cover.${types[file.type]}`, file, { access: "public", addRandomSuffix: true });
      cover = blob.url;
    }
    await sql`insert into workshop_media (slug, cover_url, facilitator_ids) values (${slug}, ${cover}, ${ids}::uuid[]) on conflict (slug) do update set cover_url = excluded.cover_url, facilitator_ids = excluded.facilitator_ids, updated_at = now()`;
    revalidatePath(`/workshops/${slug}`);
    revalidatePath("/admin/workshops");
    revalidatePath(`/api/workshops/${slug}/og`);
    return { ok: "Cover and facilitators saved." };
  } catch (error) {
    console.error("Workshop media save failed", error);
    return { error: "Could not save. Please try again." };
  }
}
