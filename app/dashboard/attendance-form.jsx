"use client";

import { useActionState } from "react";
import { useFormStatus } from "react-dom";

import { saveAttendanceAction } from "./actions";

/* The two questions that matter for someone who'll be in the room but
   isn't entering: what they can eat, and anything we should know.
   Everything else on the participant form — track, what you're
   bringing — would be noise to a judge. */

function Submit() {
  const { pending } = useFormStatus();
  return (
    <button type="submit" className="btn btn-solid ac-btn-sm" disabled={pending}>
      {pending ? "Saving…" : "Save"}
    </button>
  );
}

export default function AttendanceForm({ user }) {
  const [state, action] = useActionState(saveAttendanceAction, {});

  return (
    <form action={action} className="ac-form is-tight">
      {state.error && (
        <p className="ac-error" role="alert">
          {state.error}
        </p>
      )}
      {state.ok && <p className="ac-ok">{state.ok}</p>}

      <div className="ac-row">
        <div className="ac-field">
          <label className="ac-label" htmlFor="dietary">
            Dietary needs <span className="ac-opt">optional</span>
          </label>
          <p className="ac-hint">Seven meals get served across the weekend.</p>
          <input
            id="dietary"
            name="dietary"
            type="text"
            defaultValue={user.dietary || ""}
            placeholder="Vegetarian, no nuts"
          />
        </div>

        <div className="ac-field">
          <label className="ac-label" htmlFor="note">
            Anything we should know? <span className="ac-opt">optional</span>
          </label>
          <p className="ac-hint">Accessibility, arrival time, anything at all.</p>
          <input
            id="note"
            name="note"
            type="text"
            defaultValue={user.access_note || ""}
          />
        </div>
      </div>

      <div className="ac-actions">
        <Submit />
      </div>
    </form>
  );
}
