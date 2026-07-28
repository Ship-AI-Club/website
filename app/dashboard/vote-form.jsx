"use client";

import { useActionState } from "react";
import { useFormStatus } from "react-dom";

import { castVoteAction } from "./actions";

/* Crowd Favorite. One vote each, changeable while voting is open,
   and never for your own team — the action re-checks both. */

function Submit({ label }) {
  const { pending } = useFormStatus();
  return (
    <button type="submit" className="btn btn-solid ac-btn-sm" disabled={pending}>
      {pending ? "Casting…" : label}
    </button>
  );
}

export default function VoteForm({ entries, current }) {
  const [state, action] = useActionState(castVoteAction, {});

  if (!entries.length) {
    return <p className="ac-fine">Nothing to vote on yet — entries appear as they're submitted.</p>;
  }

  return (
    <form action={action} className="ac-form is-tight">
      {state.error && (
        <p className="ac-error" role="alert">
          {state.error}
        </p>
      )}
      {state.ok && <p className="ac-ok">{state.ok}</p>}

      <div className="ac-field">
        <label className="ac-label" htmlFor="submission_id">
          The build you'd most want to try
        </label>
        <select id="submission_id" name="submission_id" defaultValue={current || ""}>
          <option value="" disabled>
            Pick one…
          </option>
          {entries.map((e) => (
            <option key={e.id} value={e.id}>
              {e.project || e.team_name} — {e.team_name}
            </option>
          ))}
        </select>
      </div>

      <div className="ac-actions">
        <Submit label={current ? "Change my vote" : "Cast my vote"} />
      </div>
    </form>
  );
}
