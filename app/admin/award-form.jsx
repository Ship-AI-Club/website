/* Why this exists: make the award decision explicit while preserving the server action as the source of truth. */

"use client";

import { useActionState } from "react";
import { useFormStatus } from "react-dom";

import { CATEGORIES } from "../../lib/results";
import { setAwardAction } from "./actions";

const JUDGED_CATEGORIES = CATEGORIES.filter((category) => !category.voted);

function Submit() {
  const { pending } = useFormStatus();
  return (
    <button type="submit" className="btn btn-solid ac-btn-sm" disabled={pending}>
      {pending ? "Saving…" : "Save award"}
    </button>
  );
}

export function AwardForm({ submissionId, award, crowd }) {
  const [state, action] = useActionState(setAwardAction, {});

  /* React 19 resets an uncontrolled form after a form action, back to
     the defaults it mounted with — so without this key the select
     snaps to "— no award —" the moment you save one, and the screen
     stops telling you what the award actually is. Keying on the
     server's values remounts the fields when those values change. */
  return (
    <form key={`${award ?? ""}|${crowd ? 1 : 0}`} action={action} className="ac-form is-tight">
      {state.error && (
        <p className="ac-error" role="alert">
          {state.error}
        </p>
      )}
      {state.ok && <p className="ac-ok">{state.ok}</p>}
      <input type="hidden" name="submission_id" value={submissionId} />
      <div className="ac-row">
        <div className="ac-field">
          <label className="ac-label" htmlFor={`award-${submissionId}`}>
            Award
          </label>
          <select id={`award-${submissionId}`} name="award" defaultValue={award || ""}>
            <option value="">— no award —</option>
            {JUDGED_CATEGORIES.map((category) => (
              <option key={category.name} value={category.name}>
                {category.name}
              </option>
            ))}
          </select>
        </div>
        <label className="ac-choice" htmlFor={`crowd-${submissionId}`}>
          <input id={`crowd-${submissionId}`} name="crowd" type="checkbox" defaultChecked={crowd} />
          <span>Crowd Favorite</span>
        </label>
      </div>
      <div className="ac-actions">
        <Submit />
      </div>
    </form>
  );
}
