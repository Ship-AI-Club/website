"use client";

import { useToastActionState } from "../../components/toast-provider";

import { useState } from "react";
import { useFormStatus } from "react-dom";

import { RUBRIC, SCORE_MIN, SCORE_MAX, weightedScore } from "../../lib/accounts";
import { saveScoreAction } from "./actions";

/* ------------------------------------------------------------------
   The scorecard.

   Three axes, 1–5 each, weighted equally — the same three criteria
   published on /programs/zero-to-launch/hackathon, in the same order, with the same words.
   That's the point: a team can read exactly what they'll be scored on
   months before anybody scores them.

   The running total is computed on the client for feedback and again
   on the server for the leaderboard, from the same weightedScore().
   Nothing is trusted from here.
------------------------------------------------------------------ */

function Buttons({ filed, hasNext }) {
  const { pending } = useFormStatus();
  return (
    <div className="ac-actions">
      {hasNext && (
        <button type="submit" name="intent" value="next" className="btn btn-solid" disabled={pending}>
          {pending ? "Saving…" : "Save & next team"}
        </button>
      )}
      <button
        type="submit"
        name="intent"
        value="submit"
        className={`btn ${hasNext ? "btn-ghost" : "btn-solid"}`}
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

/* ------------------------------------------------------------------
   The radios are the interface; the hidden input is the value.

   They used to be the same element, and that quietly lost scores.
   React 19 resets a form after a form action, which clears `checked`
   in the DOM — but a controlled radio whose `checked={value === n}`
   expression hasn't changed gives React no reason to re-apply it. So
   after "Save draft" the strip still showed 9/10 while the field
   submitted nothing, and filing the card reported an axis the judge
   could see was scored as missing.

   Separating them removes the failure entirely: the radios group
   under their own name (so arrow keys still walk the strip) and never
   submit, and the value the server receives comes from React state,
   which a form reset can't touch.
------------------------------------------------------------------ */
function Scale({ name, value, onChange, min, max }) {
  return (
    <>
      <input type="hidden" name={name} value={value === null ? "" : value} />
      {/* Keyed on the value so the strip remounts in step with it.
          The form reset leaves the DOM `checked` flags stale — which
          no longer affects what's submitted, but does decide where
          arrow keys resume, and a strip that reads 8 while the
          keyboard thinks it's on 6 is its own small trap. */}
      <fieldset className="ac-scale" key={`${name}-${value}`}>
        <legend className="ac-hint" style={{ marginBottom: ".2rem" }}>
          {min} is the lowest score; {max} is the strongest.
        </legend>
        {Array.from({ length: max - min + 1 }, (_, i) => i + min).map(n => (
          <label key={n} className={value === n ? "is-on" : undefined}>
            <input
              type="radio"
              name={`pick-${name}`}
              value={n}
              checked={value === n}
              onChange={() => onChange(n)}
            />
            {n}
          </label>
        ))}
      </fieldset>
    </>
  );
}

export default function Scorecard({ submissionId, card, filed, saveAction = saveScoreAction, hasNext = false, hackathonId = "", rubric = RUBRIC, scoreMin = SCORE_MIN, scoreMax = SCORE_MAX }) {
  const [state, action] = useToastActionState(saveAction, {});
  const [values, setValues] = useState(() =>
    Object.fromEntries(rubric.map((c) => [c.key, card?.[c.key] ?? null])),
  );

  /* Controlled for the same reason the axes are: an uncontrolled
     textarea is reset by the form action, and a changed defaultValue
     doesn't apply to an input that's already mounted — so a judge's
     notes would blank on "Save draft" while the server held them. */
  const [notes, setNotes] = useState(card?.notes ?? "");

  const set = (key) => (n) => setValues((prev) => ({ ...prev, [key]: n }));
  const total = weightedScore(values, rubric, scoreMin, scoreMax);

  return (
    <form action={action} className="ac-form">
      <input type="hidden" name="submission_id" value={submissionId} />
      {hackathonId && <input type="hidden" name="hackathon" value={hackathonId} />}

      <div>
        {rubric.map((c) => (
          <div key={c.key} className="ac-axis">
            <div className="ac-axis-head">
              <span className="ac-axis-name">{c.name}</span>
              <span className="ac-axis-value">
                {values[c.key] === null ? <em>not scored</em> : `${values[c.key]} / ${scoreMax}`}
              </span>
            </div>
            <p>{c.copy}</p>
            <Scale name={c.key} value={values[c.key]} onChange={set(c.key)} min={scoreMin} max={scoreMax} />
            <p className="ac-axis-guide">{c.guide}</p>
          </div>
        ))}
      </div>

      <div className="ac-total">
        <b>{total === null ? "—" : total.toFixed(1)}</b>
        <span>average, out of {scoreMax}</span>
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
          value={notes}
          onChange={(e) => setNotes(e.target.value)}
        />
      </div>

      <Buttons filed={filed} hasNext={hasNext} />
      <p className="ac-fine">
        A filed card can still be changed until the awards. Only complete cards count toward
        an entry&apos;s average.
      </p>
    </form>
  );
}
