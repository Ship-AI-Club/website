"use client";

import { useActionState } from "react";
import { useFormStatus } from "react-dom";

import { TRACKS } from "../../lib/accounts";
import { registerAction } from "./actions";

/* Registering is four questions, three of them optional. The bar to
   entering has to stay at "turn up with something to launch" — rule
   03 — so this form must never feel like an application. */

function Submit({ label }) {
  const { pending } = useFormStatus();
  return (
    <button type="submit" className="btn btn-solid" disabled={pending}>
      {pending ? "Saving…" : label}
    </button>
  );
}

export default function RegisterForm({ registration }) {
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
        <label className="ac-label" htmlFor="track">
          Which track?
        </label>
        <select id="track" name="track" defaultValue={registration?.track || "undecided"}>
          {TRACKS.map((t) => (
            <option key={t.id} value={t.id}>
              {t.label}
            </option>
          ))}
        </select>
      </div>

      <div className="ac-field">
        <label className="ac-label" htmlFor="product">
          What are you bringing? <span className="ac-opt">optional</span>
        </label>
        <p className="ac-hint">
          A sentence is plenty. &quot;Nothing yet&quot; is a real answer — the build window
          opens in August and plenty of people start there.
        </p>
        <textarea
          id="product"
          name="product"
          rows={3}
          defaultValue={registration?.product || ""}
          placeholder="A scheduling tool for tattoo studios. Built, never launched."
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
            defaultValue={registration?.dietary || ""}
            placeholder="Vegetarian, no nuts"
          />
        </div>
        <div className="ac-field">
          <label className="ac-label" htmlFor="note">
            Anything we should know? <span className="ac-opt">optional</span>
          </label>
          <p className="ac-hint">Accessibility, arrival time, anything at all.</p>
          <input id="note" name="note" type="text" defaultValue={registration?.note || ""} />
        </div>
      </div>

      <div className="ac-actions">
        <Submit label={editing ? "Save changes" : "Register for the hackathon"} />
        {!editing && <span className="ac-fine">Free. No selection. No deck round.</span>}
      </div>
    </form>
  );
}
