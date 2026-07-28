/* Why this exists: keep sponsorship creation, editing, and deletion auditable and locally understandable. */

"use client";

import { useActionState } from "react";
import { useFormStatus } from "react-dom";

import { TIERS } from "../../lib/sponsors";
import { deleteSponsorshipAction, saveSponsorshipAction } from "./actions";

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

function SaveButton({ editing }) {
  const { pending } = useFormStatus();
  return (
    <button type="submit" className="btn btn-solid ac-btn-sm" disabled={pending}>
      {pending ? "Saving…" : editing ? "Save changes" : "Create sponsorship"}
    </button>
  );
}

function DeleteButton() {
  const { pending } = useFormStatus();
  return (
    <button type="submit" className="ac-btn-link ac-btn-danger ac-btn-sm" disabled={pending}>
      {pending ? "Deleting…" : "Delete"}
    </button>
  );
}

export function SponsorshipForm({ sponsorship = null, users = [] }) {
  const [state, action] = useActionState(saveSponsorshipAction, {});
  const editing = Boolean(sponsorship);
  const idPrefix = sponsorship?.id || "new";

  /* React 19 resets an uncontrolled form after a form action, back to
     the defaults it mounted with. On the edit variant that would blank
     the row you just saved; keying on the server's values remounts the
     fields with the new ones. The create variant has no key — resetting
     to empty is exactly what it should do. */
  const key = editing
    ? [sponsorship.org, sponsorship.tier, sponsorship.amount, sponsorship.status].join("|")
    : undefined;

  return (
    <form key={key} action={action} className="ac-form is-tight">
      <Feedback state={state} />
      {editing && <input type="hidden" name="sponsorship_id" value={sponsorship.id} />}
      {editing ? (
        <input type="hidden" name="user_id" value={sponsorship.user_id} />
      ) : (
        <div className="ac-field">
          <label className="ac-label" htmlFor={`user-${idPrefix}`}>
            Account
          </label>
          <select id={`user-${idPrefix}`} name="user_id" defaultValue="">
            <option value="">Select an account</option>
            {users.map((user) => (
              <option key={user.id} value={user.id}>
                {user.name || user.email} — {user.email}
              </option>
            ))}
          </select>
        </div>
      )}

      <div className="ac-row">
        <div className="ac-field">
          <label className="ac-label" htmlFor={`org-${idPrefix}`}>
            Organization
          </label>
          <input id={`org-${idPrefix}`} name="org" type="text" defaultValue={sponsorship?.org || ""} />
        </div>
        <div className="ac-field">
          <label className="ac-label" htmlFor={`tier-${idPrefix}`}>
            Tier
          </label>
          <select id={`tier-${idPrefix}`} name="tier" defaultValue={sponsorship?.tier || ""}>
            <option value="">Automatic from amount</option>
            {TIERS.map((tier) => (
              <option key={tier.id} value={tier.id}>
                {tier.name} — {tier.priceLabel}
              </option>
            ))}
            <option value="in-kind">In-kind</option>
            <option value="undecided">Not sure yet</option>
          </select>
        </div>
      </div>

      <div className="ac-row">
        <div className="ac-field">
          <label className="ac-label" htmlFor={`amount-${idPrefix}`}>
            Amount
          </label>
          <input id={`amount-${idPrefix}`} name="amount" type="number" min={0} step={1} defaultValue={sponsorship?.amount ?? 0} />
        </div>
        <div className="ac-field">
          <label className="ac-label" htmlFor={`status-${idPrefix}`}>
            Status
          </label>
          <input id={`status-${idPrefix}`} name="status" type="text" defaultValue={sponsorship?.status || "pledged"} />
        </div>
      </div>

      <div className="ac-field">
        <label className="ac-label" htmlFor={`items-${idPrefix}`}>
          Items
        </label>
        <textarea id={`items-${idPrefix}`} name="items" rows={3} defaultValue={sponsorship?.items || ""} />
      </div>

      <div className="ac-row">
        <div className="ac-field">
          <label className="ac-label" htmlFor={`credit-name-${idPrefix}`}>
            Credit name
          </label>
          <input id={`credit-name-${idPrefix}`} name="credit_name" type="text" defaultValue={sponsorship?.credit_name || ""} />
        </div>
        <div className="ac-field">
          <label className="ac-label" htmlFor={`note-${idPrefix}`}>
            Note
          </label>
          <textarea id={`note-${idPrefix}`} name="note" rows={3} defaultValue={sponsorship?.note || ""} />
        </div>
      </div>

      <div className="ac-actions">
        <SaveButton editing={editing} />
      </div>
    </form>
  );
}

export function DeleteSponsorshipForm({ sponsorshipId }) {
  const [state, action] = useActionState(deleteSponsorshipAction, {});

  return (
    <form action={action} className="ac-form is-tight">
      <Feedback state={state} />
      <input type="hidden" name="sponsorship_id" value={sponsorshipId} />
      <div className="ac-actions">
        <DeleteButton />
      </div>
    </form>
  );
}
