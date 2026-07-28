/* Why this exists: separate certificate issuance from revocation and show the result of each operation in place. */

"use client";

import { useActionState } from "react";
import { useFormStatus } from "react-dom";

import { issueCertificatesAction, revokeCertificateAction } from "./actions";

function Feedback({ state }) {
  return (
    <>
      {state?.error && (
        <p className="ac-error" role="alert">
          {state.error}
        </p>
      )}
      {state?.ok && <p className="ac-ok">{state.ok}</p>}
    </>
  );
}

function IssueButton() {
  const { pending } = useFormStatus();
  return (
    <button type="submit" className="btn btn-solid ac-btn-sm" disabled={pending}>
      {pending ? "Issuing…" : "Issue certificates"}
    </button>
  );
}

export function IssueCertificatesForm() {
  const [state, action] = useActionState(issueCertificatesAction, {});

  return (
    <form action={action} className="ac-form is-tight">
      <Feedback state={state} />
      <p className="ac-hint">
        Issues a credential for every submitted team. Existing credentials get their award wording updated. Email is sent only for new credentials.
      </p>
      <label className="ac-choice" htmlFor="notify-certificates">
        <input id="notify-certificates" name="notify" type="checkbox" />
        <span>Email holders of new certificates</span>
      </label>
      <div className="ac-actions">
        <IssueButton />
      </div>
    </form>
  );
}

function RevokeButton() {
  const { pending } = useFormStatus();
  return (
    <button type="submit" className="ac-btn-link ac-btn-danger ac-btn-sm" disabled={pending}>
      {pending ? "Revoking…" : "Revoke"}
    </button>
  );
}

export function RevokeCertificateForm({ certificateId }) {
  const [state, action] = useActionState(revokeCertificateAction, {});

  return (
    <form action={action} className="ac-form is-tight">
      <Feedback state={state} />
      <input type="hidden" name="certificate_id" value={certificateId} />
      <div className="ac-actions">
        <RevokeButton />
      </div>
    </form>
  );
}
