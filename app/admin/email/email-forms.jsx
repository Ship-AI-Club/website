"use client";

import { useActionState, useState } from "react";
import { useFormStatus } from "react-dom";

import { archiveAction, backfillAction, markReadAction, replyAction } from "./actions";

/* The write half of /admin/email. Reply is the one that matters:
   inbound mail arrives as a webhook rather than in a mailbox, so
   without this there is nowhere to answer it from. */

function Feedback({ state }) {
  if (state.error) {
    return (
      <p className="ac-error" role="alert">
        {state.error}
      </p>
    );
  }
  if (state.ok) return <p className="ac-ok">{state.ok}</p>;
  return null;
}

function Submit({ label, busy, ghost, small = true }) {
  const { pending } = useFormStatus();
  return (
    <button
      type="submit"
      className={`btn ${ghost ? "btn-ghost" : "btn-solid"}${small ? " ac-btn-sm" : ""}`}
      disabled={pending}
    >
      {pending ? busy : label}
    </button>
  );
}

export function ReplyForm({ id, to, subject }) {
  const [state, action] = useActionState(replyAction, {});
  const [open, setOpen] = useState(false);

  if (!open) {
    return (
      <div className="ac-actions">
        <button type="button" className="btn btn-ghost ac-btn-sm" onClick={() => setOpen(true)}>
          Reply
        </button>
      </div>
    );
  }

  return (
    <form action={action} className="ac-form is-tight">
      <Feedback state={state} />
      <input type="hidden" name="inbound_id" value={id} />

      <div className="ac-field">
        <label className="ac-label" htmlFor={`reply-${id}`}>
          Reply to {to}
        </label>
        <p className="ac-hint">
          Sent from noreply@shipai.club with the original message id attached, so it lands in
          the same thread on their side. Re: {subject || "(no subject)"}
        </p>
        <textarea id={`reply-${id}`} name="body" rows={6} required autoFocus />
      </div>

      <div className="ac-actions">
        <Submit label="Send reply" busy="Sending…" />
        <button type="button" className="ac-btn-link" onClick={() => setOpen(false)}>
          Cancel
        </button>
      </div>
    </form>
  );
}

export function ReadForm({ id, unread }) {
  const [, action] = useActionState(markReadAction, {});
  return (
    <form action={action} className="ac-inline-form">
      <input type="hidden" name="inbound_id" value={id} />
      <input type="hidden" name="unread" value={unread ? "false" : "true"} />
      <button type="submit" className="ac-btn-link">
        {unread ? "Mark read" : "Mark unread"}
      </button>
    </form>
  );
}

export function ArchiveForm({ id }) {
  const [, action] = useActionState(archiveAction, {});
  return (
    <form action={action} className="ac-inline-form">
      <input type="hidden" name="inbound_id" value={id} />
      <button type="submit" className="ac-btn-link ac-btn-danger">
        Archive
      </button>
    </form>
  );
}

export function BackfillForm() {
  const [state, action] = useActionState(backfillAction, {});
  return (
    <form action={action} className="ac-form is-tight">
      <Feedback state={state} />
      <div className="ac-actions">
        <Submit label="Retry missing bodies" busy="Fetching…" ghost />
      </div>
    </form>
  );
}
