/* Why: keep each request decision explicit, auditable and tied to the server action. */

"use client";

import { useActionState } from "react";
import { useFormStatus } from "react-dom";

import { decideRequestAction } from "./actions";

function Submit({ decision, label, pendingLabel }) {
  const { pending } = useFormStatus();
  const className = decision === "approve" ? "btn btn-solid" : "btn btn-ghost";

  return (
    <button
      type="submit"
      name="decision"
      value={decision}
      className={className}
      disabled={pending}
    >
      {pending ? pendingLabel : label}
    </button>
  );
}

export default function RequestForm({ requestId }) {
  const [state, action] = useActionState(decideRequestAction, {});

  return (
    <form action={action} className="ac-form is-tight">
      {state.error && (
        <p className="ac-error" role="alert">
          {state.error}
        </p>
      )}
      {state.ok && <p className="ac-ok">{state.ok}</p>}

      <input type="hidden" name="request_id" value={requestId} />

      <div className="ac-field">
        <label className="ac-label" htmlFor={`admin-note-${requestId}`}>
          Admin note (emailed to the person) <span>optional</span>
        </label>
        <p className="ac-hint">Add the context they should receive with the decision.</p>
        <textarea id={`admin-note-${requestId}`} name="admin_note" rows={3} />
      </div>

      <div className="ac-actions">
        <Submit
          decision="approve"
          label="Approve request"
          pendingLabel="Approving request…"
        />
        <Submit
          decision="decline"
          label="Decline request"
          pendingLabel="Declining request…"
        />
      </div>
    </form>
  );
}
