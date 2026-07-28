"use client";

import { useActionState, useState } from "react";
import { useFormStatus } from "react-dom";

import { RUBRIC, SCORE_MAX, weightedScore } from "../../lib/accounts";
import { saveScoreAction } from "./actions";

/* ------------------------------------------------------------------
   The scorecard.

   Four axes, 0–10 each, weighted 40/30/20/10 — the same four criteria
   published on /hackathon, in the same order, with the same words.
   That's the point: a team can read exactly what they'll be scored on
   months before anybody scores them.

   The running total is computed on the client for feedback and again
   on the server for the leaderboard, from the same weightedScore().
   Nothing is trusted from here.
------------------------------------------------------------------ */

function Buttons({ filed }) {
  const { pending } = useFormStatus();
  return (
    <div className="ac-actions">
      <button
        type="submit"
        name="intent"
        value="submit"
        className="btn btn-solid"
        disabled={pending}
      >
        {pending ? "Saving…" : filed ? "Update the card" : "File the card"}
      </button>
      <button
        type="submit"
        name="intent"
        value="draft"
        className="btn btn-ghost"
        disabled={pending}
      >
        Save draft
      </button>
    </div>
  );
}

function Scale({ name, value, onChange }) {
  return (
    <fieldset className="ac-scale">
      <legend className="ac-hint" style={{ marginBottom: ".2rem" }}>
        0 is nothing, 10 is the best you&apos;d expect to see.
      </legend>
      {Array.from({ length: SCORE_MAX + 1 }, (_, n) => (
        <label key={n} className={value === n ? "is-on" : undefined}>
          <input
            type="radio"
            name={name}
            value={n}
            checked={value === n}
            onChange={() => onChange(n)}
          />
          {n}
        </label>
      ))}
    </fieldset>
  );
}

export default function Scorecard({ submissionId, card, filed }) {
  const [state, action] = useActionState(saveScoreAction, {});
  const [values, setValues] = useState(() =>
    Object.fromEntries(RUBRIC.map((c) => [c.key, card?.[c.key] ?? null])),
  );

  const set = (key) => (n) => setValues((prev) => ({ ...prev, [key]: n }));
  const total = weightedScore(values);

  return (
    <form action={action} className="ac-form">
      <input type="hidden" name="submission_id" value={submissionId} />

      {state.error && (
        <p className="ac-error" role="alert">
          {state.error}
        </p>
      )}
      {state.ok && <p className="ac-ok">{state.ok}</p>}

      <div>
        {RUBRIC.map((c) => (
          <div key={c.key} className="ac-axis">
            <div className="ac-axis-head">
              <span className="ac-axis-pct">{c.pct}%</span>
              <span className="ac-axis-name">{c.name}</span>
              <span className="ac-axis-value">
                {values[c.key] === null ? <em>not scored</em> : `${values[c.key]} / ${SCORE_MAX}`}
              </span>
            </div>
            <p>{c.copy}</p>
            <Scale name={c.key} value={values[c.key]} onChange={set(c.key)} />
            <p className="ac-axis-guide">{c.guide}</p>
          </div>
        ))}
      </div>

      <div className="ac-total">
        <b>{total === null ? "—" : total.toFixed(1)}</b>
        <span>weighted total, out of {SCORE_MAX}</span>
      </div>

      <div className="ac-field">
        <label className="ac-label" htmlFor="notes">
          Notes
        </label>
        <p className="ac-hint">
          For the organisers and the awards conversation, not for the team. Say what you&apos;d
          say out loud in the judges&apos; room.
        </p>
        <textarea
          id="notes"
          name="notes"
          rows={5}
          defaultValue={state.notes ?? card?.notes ?? ""}
        />
      </div>

      <Buttons filed={filed} />
      <p className="ac-fine">
        A filed card can still be changed until the awards. Only complete cards count toward
        an entry&apos;s average.
      </p>
    </form>
  );
}
