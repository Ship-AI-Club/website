"use client";

import { useToastActionState } from "../../../components/toast-provider";

import { useState } from "react";
import { useFormStatus } from "react-dom";

import { FW_SUBMISSION_FIELDS, founderSubmissionValue } from "../../../lib/founder-weekend-submissions";
import { saveFounderSubmissionAction } from "./actions";

function Buttons({ submitted, open }) {
  const { pending } = useFormStatus();
  if (!open) return null;
  return (
    <div className="ac-actions">
      <button type="submit" name="intent" value="submit" className="btn btn-solid" disabled={pending}>
        {pending ? "Saving…" : submitted ? "Save changes" : "Submit the project"}
      </button>
      {!submitted && (
        <button type="submit" name="intent" value="draft" className="btn btn-ghost" disabled={pending}>
          Save as draft
        </button>
      )}
    </div>
  );
}

export default function FounderSubmissionForm({ teamId, submission, deadline, open }) {
  const [state, action] = useToastActionState(saveFounderSubmissionAction, {});
  const [values, setValues] = useState(() =>
    Object.fromEntries(FW_SUBMISSION_FIELDS.map((f) => [f.key, founderSubmissionValue(submission, f.key)])),
  );
  const submitted = (state.status || submission?.status) === "submitted";

  return (
    <form action={action} className="ac-form">
      <input type="hidden" name="team_id" value={teamId} />

      {!open && (
        <p className="ac-note">
          Submissions closed at {deadline}. This is your entry as it stood. It can&apos;t be edited now.
        </p>
      )}

      <fieldset disabled={!open} style={{ border: 0, display: "grid", gap: "2rem" }}>
        {FW_SUBMISSION_FIELDS.map((field) => {
          const props = {
            id: field.key,
            name: field.key,
            maxLength: field.limit,
            value: values[field.key],
            onChange: (event) => setValues((prev) => ({ ...prev, [field.key]: event.target.value })),
            "aria-describedby": `${field.key}-hint`,
          };
          return (
            <div className="ac-field" key={field.key}>
              <label className="ac-label" htmlFor={field.key}>
                {field.name} <span className={field.required ? "ac-req" : "ac-opt"}>{field.required ? "Required" : "optional"}</span>
              </label>
              <p className="ac-hint" id={`${field.key}-hint`}>{field.copy}</p>
              {field.rows ? (
                <textarea {...props} rows={field.rows} />
              ) : (
                <input {...props} type="text" inputMode={field.url ? "url" : undefined} placeholder={field.placeholder} />
              )}
            </div>
          );
        })}
      </fieldset>

      <Buttons submitted={submitted} open={open} />
    </form>
  );
}
