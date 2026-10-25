"use client";

import { useToastActionState } from "../../../components/toast-provider";

import { useState } from "react";
import { useFormStatus } from "react-dom";

import { SUBMISSION_FIELDS, PITCH_FIELDS, PITCH_OPTIONS, PITCH_DECK_FIELD, submissionPitchMode } from "../../../lib/submissions";
import { safeUrl } from "../../../lib/accounts";
import { PITCH_PATH } from "../../../lib/hackathon-pitch";
import WebsitePitchPrefill from "../../../components/website-pitch-prefill";
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

export default function SubmissionForm({ teamId, submission, deadline, open }) {
  const [state, action] = useToastActionState(saveSubmissionAction, {});
  const [values, setValues] = useState(() => Object.fromEntries([
    ...SUBMISSION_FIELDS.map(field => [field.key, submission?.[field.key] || ""]),
    ...PITCH_FIELDS.map(field => [field.key, submission?.pitch?.[field.key] || ""]),
    ["brand",submission?.pitch?.brand || null],
    ["pitch_deck_url",submission?.pitch?.deck_url || ""],
  ]));
  const [pitchMode, setPitchMode] = useState(() => submissionPitchMode(submission?.pitch));
  const submitted = (state.status || submission?.status) === "submitted";
  const [dirty, setDirty] = useState(false);

  function fieldInput(field) {
    const props = { id: field.key, name: field.key, maxLength: field.limit,
      value: values[field.key], onChange: event => { setValues(prev => ({ ...prev, [field.key]: event.target.value })); setDirty(true); },
      "aria-describedby": `${field.key}-hint` };
    return <div className="ac-field" key={field.key}>
      <label className="ac-label" htmlFor={field.key}>{field.name} <span className={field.required ? "ac-req" : "ac-opt"}>{field.required ? "Required" : "optional"}</span></label>
      <p className="ac-hint" id={`${field.key}-hint`}>{field.copy}</p>
      {field.rows ? <textarea {...props} rows={field.rows}/> : <input {...props} type="text" inputMode={field.url ? "url" : undefined} placeholder={field.placeholder}/>}
    </div>;
  }

  return (
    <form action={data => { setDirty(false); action(data); }} className="ac-form">
      <input type="hidden" name="team_id" value={teamId} />
      <input type="hidden" name="pitch_brand" value={JSON.stringify(values.brand || {})} />

      {!open && (
        <p className="ac-note">
          Submissions closed at {deadline}. This is your entry as it stood — it can&apos;t be
          edited now.
        </p>
      )}

      <fieldset disabled={!open} style={{ border: 0, display: "grid", gap: "2rem" }}>
        {SUBMISSION_FIELDS.filter(field => ["project", "live_url"].includes(field.key)).map(fieldInput)}
        {SUBMISSION_FIELDS.filter(field => ["summary", "receipts"].includes(field.key)).map(fieldInput)}
        <fieldset className="ac-pitch-choice">
          <legend className="ac-label">Your pitch deck <span className="ac-opt">optional</span></legend>
          <p className="ac-hint">Use your own slides or our generator for your five-minute pitch. You can submit without a deck and change this choice until the deadline.</p>
          <div className="ac-choices">
            {PITCH_OPTIONS.map(option => <label key={option.value} className={`ac-choice${pitchMode === option.value ? " is-on" : ""}`}>
              <input type="radio" name="pitch_mode" value={option.value} checked={pitchMode === option.value}
                onChange={() => {setPitchMode(option.value); setDirty(true);}}/>
              <span className="ac-choice-body"><strong>{option.label}</strong><span>{option.copy}</span></span>
            </label>)}
          </div>
          {pitchMode === "custom" ? <div className="ac-pitch-fields">{fieldInput(PITCH_DECK_FIELD)}</div>
            : <input type="hidden" name="pitch_deck_url" value={values.pitch_deck_url}/>}
          {pitchMode === "generated" ? <div className="ac-pitch-fields">
            <WebsitePitchPrefill teamId={teamId} url={values.live_url} values={values} onApply={changes => { setValues(prev => ({...prev,...changes})); setDirty(true); }}/>
            {values.brand && <div className="ac-brand-applied"><span>Website branding applied · {values.brand.headingFont || "Site palette"}</span><button type="button" onClick={()=>{setValues(prev=>({...prev,brand:null}));setDirty(true);}}>Use Ship AI styling</button></div>}
            <p className="ac-hint">Three short answers turn your entry into a four-slide draft. Your team names and business description fill the opening slide. Each answer is optional.</p>
            {PITCH_FIELDS.map(fieldInput)}
          </div> : PITCH_FIELDS.map(field => <input key={field.key} type="hidden" name={field.key} value={values[field.key]}/>)}
        </fieldset>
        <details><summary className="ac-label">Build details and code <span className="ac-opt">optional</span></summary><div className="ac-pitch-fields">{SUBMISSION_FIELDS.filter(field => ["launch", "repo_url"].includes(field.key)).map(fieldInput)}</div></details>
      </fieldset>

      <Buttons submitted={submitted} open={open} />
      <div className="ac-pitch-links">
        {pitchMode === "generated" && <a href={`/dashboard/submission/pitch?team=${teamId}`} target="_blank" rel="noopener noreferrer">Open generated pitch draft ↗</a>}
        {pitchMode === "custom" && safeUrl(values.pitch_deck_url) && <a href={safeUrl(values.pitch_deck_url)} target="_blank" rel="noopener noreferrer">Open your deck ↗</a>}
        <a href={PITCH_PATH} target="_blank" rel="noopener noreferrer">View the five-minute reference ↗</a>
        <a href={`${PITCH_PATH}/demo?view=all`} target="_blank" rel="noopener noreferrer">See all four demo slides ↗</a>
        <p className="ac-hint">{dirty ? "Save your changes to keep your deck choice and answers." : pitchMode === "generated" ? "Your generated pitch uses your last saved answers. It stays available after submissions close." : "The reference is available whether you use your own deck or generate one."}</p>
      </div>
    </form>
  );
}
