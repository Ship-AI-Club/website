import { requireAdmin } from "../../../lib/auth";
import { sql } from "../../../lib/db";
import { MANAGED_WORKSHOPS, workshopMedia, workshopOgPath, ensureWorkshopMedia } from "../../../lib/workshop-media";
import MediaForm from "./media-form";
import { workshopMaterialAccess } from "../../../lib/workshop-material-access";
import "./workshops.css";
export const dynamic = "force-dynamic";
export const metadata = { title: "Workshop Covers And Facilitators | Ship AI", robots: { index: false, follow: false } };
export default async function Page({ searchParams }) {
  await requireAdmin("/admin/workshops");
  await ensureWorkshopMedia();
  const requested = (await searchParams)?.workshop;
  const workshop = MANAGED_WORKSHOPS.find(w => w.slug === requested) || MANAGED_WORKSHOPS[0];
  const [media, people] = await Promise.all([workshopMedia(workshop.slug), sql`select id, name, avatar_url from users where public_profile = true and name <> '' order by name`]);
  const materials = await workshopMaterialAccess(workshop.slug);
  return <><div className="ac-head"><p className="ac-kicker">Admin / Workshops</p><h1>Workshop Covers And Facilitators</h1><p>Manage the image shown on each workshop and in link previews. Assign confirmed facilitators from public Ship AI profiles.</p></div><form method="get" className="ac-form"><label className="ac-field"><span className="ac-label">Workshop</span><select name="workshop" defaultValue={workshop.slug}>{MANAGED_WORKSHOPS.map(w => <option key={w.slug} value={w.slug}>{w.name}</option>)}</select></label><button className="btn btn-ghost">Open Workshop</button></form><section className="ac-card"><h2>{workshop.name}</h2><a href={workshopOgPath(workshop.slug, media.version)} target="_blank" rel="noreferrer"><img className="wm-cover" src={workshopOgPath(workshop.slug, media.version)} alt={`${workshop.name} share image`} /></a><p className="ac-fine">Preview the share image above. Uploaded covers appear as supplied. To refresh photos and names automatically, use the default branded cover.</p>{materials.allowed&&<div className="wm-downloads"><a href={`/workshops/${workshop.slug}/materials/deck`}>Workshop slides</a><a href={`/workshops/${workshop.slug}/materials/guide`}>Guide and prompts</a>{(materials.isHost||materials.isAdmin)&&<a href={`/workshops/${workshop.slug}/materials/facilitator`}>Facilitator notes</a>}</div>}<MediaForm key={`${workshop.slug}-${media.version}`} workshop={{slug: workshop.slug}} media={media} people={people} /><p><a href={`/workshops/${workshop.slug}`}>View Workshop →</a></p></section></>;
}
