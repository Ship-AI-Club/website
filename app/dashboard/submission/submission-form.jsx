"use client";

import { useActionState } from "react";
import { useFormStatus } from "react-dom";

import { SUBMISSION_FIELDS } from "../../../lib/submissions";
import { saveSubmissionAction } from "../actions";

// Drafts and submitted entries remain editable until the deadline.

function Buttons({ submitted, open }) {
  const { pending } = useFormStatus();
  if (!open) return null;

  return (
    <div className="ac-actions">
      <button
        type="submit"
        name="intent"
        value="submit"
        className="btn btn-solid"
        disabled={pending}
      >
        {pending ? "Saving…" : submitted ? "Save changes" : "Submit the project"}
      </button>
      {!submitted && (
        <button
          type="submit"
          name="intent"
          value="draft"
          className="btn btn-ghost"
          disabled={pending}
        >
          Save as draft
        </button>
      )}
    </div>
  );
}

export default function SubmissionForm({ submission, deadline, open }) {
  const [state, action] = useActionState(saveSubmissionAction, {});
  const value = (key) => state[key] ?? submission?.[key] ?? "";
  const submitted = submission?.status === "submitted";

  return (
    <form action={action} className="ac-form">
      {state.error && (
        <p className="ac-error" role="alert">
          {state.error}
        </p>
      )}
      {state.ok && <p className="ac-ok">{state.ok}</p>}

      {!open && (
        <p className="ac-note">
          Submissions closed at {deadline}. This is your entry as it stood — it can&apos;t be
          edited now.
        </p>
      )}

      <fieldset disabled={!open} style={{ border: 0, display: "grid", gap: "2rem" }}>
        {SUBMISSION_FIELDS.map((field) => (
          <div className="ac-field" key={field.key}>
            <label className="ac-label" htmlFor={field.key}>
              {field.name}{" "}
              <span className={field.required ? "ac-req" : "ac-opt"}>
                {field.required ? "Required" : "optional"}
              </span>
            </label>
            <p className="ac-hint">{field.copy}</p>
            {field.rows ? (
              <textarea id={field.key} name={field.key} rows={field.rows}
                maxLength={field.limit} defaultValue={value(field.key)} />
            ) : (
              <input id={field.key} name={field.key} type="text"
                inputMode={field.url ? "url" : undefined} placeholder={field.placeholder}
                maxLength={field.limit} defaultValue={value(field.key)} />
            )}
          </div>
        ))}
      </fieldset>

      <Buttons submitted={submitted} open={open} />
    </form>
  );
}
