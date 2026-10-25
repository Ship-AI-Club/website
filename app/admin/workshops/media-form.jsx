"use client";

import { useToastActionState } from "../../../components/toast-provider";

import { saveWorkshopMedia } from "./actions";
export default function MediaForm({ workshop, media, people }) {
  const [state, action, pending] = useToastActionState(saveWorkshopMedia, {});
  return <form action={action} className="ac-form">
    <input type="hidden" name="slug" value={workshop.slug} />
    <label className="ac-field"><span className="ac-label">Cover And Share Image</span><input type="file" name="cover" accept="image/png,image/jpeg,image/webp" /><span className="ac-fine">Wide image recommended (1200 × 630). PNG, JPEG, or WebP under 3 MB.</span></label>
    {media.coverUrl && <label><input type="checkbox" name="resetCover" /> Use the default branded cover</label>}
    <fieldset style={{border: 0, padding: 0}}><legend className="ac-label">Facilitators</legend><p className="ac-fine">Select confirmed facilitators. Their public profile photos, names, and biographies will appear on the workshop. Default share images include their photos.</p><div className="wm-people">{people.map(person => <label key={person.id}><input type="checkbox" name="facilitator" value={person.id} defaultChecked={media.facilitatorIds.includes(person.id)} />{person.avatar_url && <img src={person.avatar_url} alt="" width={32} height={32} />}{person.name}</label>)}</div></fieldset>

    <button className="btn btn-solid" disabled={pending}>{pending ? "Saving…" : "Save Workshop"}</button>
  </form>;
}
