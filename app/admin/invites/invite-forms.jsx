"use client";

import { useActionState, useState } from "react";
import { useFormStatus } from "react-dom";

import { roleLabel } from "../../../lib/accounts";
import { createInviteAction, revokeInviteAction } from "./actions";

/* The point of this form is the roles checklist: one invite can carry
   several, which is what turns "you're mentoring and sponsoring" into
   a single link instead of two approvals. */

function Submit({ label, busy }) {
  const { pending } = useFormStatus();
  return (
    <button type="submit" className="btn btn-solid ac-btn-sm" disabled={pending}>
      {pending ? busy : label}
    </button>
  );
}

export function CreateInviteForm({ roles, origin }) {
  const [state, action] = useActionState(createInviteAction, {});
  const [picked, setPicked] = useState(new Set());

  const toggle = (id, on) =>
    setPicked((prev) => {
      const copy = new Set(prev);
      if (on) copy.add(id);
      else copy.delete(id);
      return copy;
    });

  return (
    <form action={action} className="ac-form">
      {state.error && (
        <p className="ac-error" role="alert">
          {state.error}
        </p>
      )}
      {state.ok && (
        <div className="ac-ok">
          <p>{state.ok}</p>
          {state.code && (
            <p className="ac-mono" style={{ marginTop: ".4rem", wordBreak: "break-all" }}>
              {origin}/invite/{state.code}
            </p>
          )}
        </div>
      )}

      <fieldset className="ac-choices">
        <legend className="ac-label">
          Grants <span className="ac-req">required</span>
        </legend>
        <p className="ac-hint">
          Tick everything this link should hand over. More than one is the point — a package
          that includes mentoring and sponsoring is one link, not two approvals. Admin can
          never be granted this way.
        </p>
        <div className="ac-choices is-row">
          {roles.map((r) => (
            <label key={r} className={`ac-tick${picked.has(r) ? " is-on" : ""}`}>
              <input
                type="checkbox"
                name="roles"
                value={r}
                checked={picked.has(r)}
                onChange={(e) => toggle(r, e.target.checked)}
              />
              {roleLabel(r)}
            </label>
          ))}
        </div>
      </fieldset>

      <div className="ac-row">
        <div className="ac-field">
          <label className="ac-label" htmlFor="label">
            Label <span className="ac-opt">optional</span>
          </label>
          <p className="ac-hint">For you, in this list. Not shown to them.</p>
          <input id="label" name="label" type="text" placeholder="Acme — mentor + sponsor" />
        </div>

        <div className="ac-field">
          <label className="ac-label" htmlFor="email">
            Lock to an email <span className="ac-opt">optional</span>
          </label>
          <p className="ac-hint">
            Set it and only that address can redeem, so a forwarded link grants nothing.
          </p>
          <input id="email" name="email" type="email" placeholder="them@company.com" />
        </div>
      </div>

      <div className="ac-row">
        <div className="ac-field">
          <label className="ac-label" htmlFor="max_uses">
            Uses
          </label>
          <p className="ac-hint">1 for a person, more for a team.</p>
          <input id="max_uses" name="max_uses" type="number" min={1} max={200} defaultValue={1} />
        </div>

        <div className="ac-field">
          <label className="ac-label" htmlFor="expires_days">
            Expires in (days)
          </label>
          <p className="ac-hint">0 for no expiry.</p>
          <input
            id="expires_days"
            name="expires_days"
            type="number"
            min={0}
            max={365}
            defaultValue={30}
          />
        </div>
      </div>

      <div className="ac-actions">
        <Submit label="Create invite" busy="Creating…" />
      </div>
    </form>
  );
}

export function RevokeInviteForm({ id }) {
  const [state, action] = useActionState(revokeInviteAction, {});
  return (
    <>
      <form action={action} className="ac-inline-form">
        <input type="hidden" name="invite_id" value={id} />
        <button type="submit" className="ac-btn-link ac-btn-danger">
          Revoke
        </button>
      </form>
      {state.ok && <span className="ac-fine"> {state.ok}</span>}
    </>
  );
}
