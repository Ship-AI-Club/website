"use client";

import { useActionState } from "react";
import { useFormStatus } from "react-dom";

import { registerAction } from "./actions";

// Registration captures the project idea and practical attendance needs.

function Submit({ label }) {
  const { pending } = useFormStatus();
  return (
    <button type="submit" className="btn btn-solid" disabled={pending}>
      {pending ? "Saving…" : label}
    </button>
  );
}

export default function RegisterForm({ registration, user }) {
  const [state, action] = useActionState(registerAction, {});
  const editing = Boolean(registration);

  return (
    <form action={action} className="ac-form is-tight">
      {state.error && (
        <p className="ac-error" role="alert">
          {state.error}
        </p>
      )}
      {state.ok && <p className="ac-ok">{state.ok}</p>}

      <div className="ac-field">
        <label className="ac-label" htmlFor="product">
          What are you bringing? <span className="ac-opt">optional</span>
        </label>
        <p className="ac-hint">
          A sentence about the site or product you want to build. Coming without an idea is fine.
        </p>
        <textarea
          id="product"
          name="product"
          rows={3}
          defaultValue={registration?.product || ""}
          placeholder="A marketing site for a scheduling tool for tattoo studios."
        />
      </div>

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
            defaultValue={user?.dietary || ""}
            placeholder="Vegetarian, no nuts"
          />
        </div>
        <div className="ac-field">
          <label className="ac-label" htmlFor="note">
            Anything we should know? <span className="ac-opt">optional</span>
          </label>
          <p className="ac-hint">Accessibility, arrival time, anything at all.</p>
          <input id="note" name="note" type="text" defaultValue={user?.access_note || ""} />
        </div>
      </div>

      <div className="ac-actions">
        <Submit label={editing ? "Save changes" : "Register for the hackathon"} />
        {!editing && <span className="ac-fine">Free. No selection. No deck round.</span>}
      </div>
    </form>
  );
}
