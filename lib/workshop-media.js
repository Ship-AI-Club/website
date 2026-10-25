import { cache } from "react";
import { sql, safeRead } from "./db";
import { UPCOMING_WORKSHOPS } from "./workshops";
import { VIBE_GTM } from "./vibe-gtm-workshop";
import { AI_ORGANIZATION_EVENT } from "./ai-organization-event";

export const MANAGED_WORKSHOPS = [
  { slug: "vibe-coding-gtm", name: VIBE_GTM.name },
  { slug: AI_ORGANIZATION_EVENT.slug, name: AI_ORGANIZATION_EVENT.name },
  ...UPCOMING_WORKSHOPS,
];
export function managedWorkshop(slug) { return MANAGED_WORKSHOPS.find(w => w.slug === slug); }
export const workshopMedia = cache(async (slug) => {
  const rows = await safeRead(() => sql`select cover_url, facilitator_ids, updated_at from workshop_media where slug = ${slug}`, []);
  const row = rows[0];
  const ids = row ? row.facilitator_ids : slug === "vibe-coding-gtm" ? VIBE_GTM.instructorIds : [];
  const people = ids.length ? await safeRead(() => sql`select id, name, avatar_url, title, company, bio, website, linkedin from users where id = any(${ids}::uuid[]) and public_profile = true and name <> ''`, []) : [];
  return { coverUrl: row?.cover_url || (!row && slug === "vibe-coding-gtm" ? "/workshop-art/website-marketing-instructors.png" : ""), facilitatorIds: ids, facilitators: ids.flatMap(id => people.filter(p => p.id === id)), version: row?.updated_at ? new Date(row.updated_at).getTime() : 1 };
});
export function workshopOgPath(slug, version = 1) { return `/api/workshops/${slug}/og?v=${version}`; }

export async function ensureWorkshopMedia() {
  await sql`create table if not exists workshop_media (slug text primary key, cover_url text not null default '', facilitator_ids uuid[] not null default '{}', updated_at timestamptz not null default now())`;
}
