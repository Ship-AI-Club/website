"use client";

import { useActionState, useState } from "react";
import { useFormStatus } from "react-dom";

import { AREAS, LEVELS, summarize } from "../../../lib/mentee-assessment";
import { deleteMenteeAssessmentAction, saveMenteeAssessmentAction } from "./actions";

function Submit({ label }) {
  const { pending } = useFormStatus();
  return <button type="submit" className="btn btn-solid" disabled={pending}>{pending ? "Saving…" : label}</button>;
}

function Level({ name, levels, value, onChange }) {
  return (
    <>
      <input type="hidden" name={name} value={value ?? ""} />
      <fieldset className="mx-levels" key={`${name}-${value}`}>
        <legend className="ac-hint">Pick the level that matches what you heard.</legend>
        {levels.map((description, i) => (
          <label key={i} className={value === i + 1 ? "is-on" : undefined}>
            <input type="radio" name={`pick-${name}`} value={i + 1} checked={value === i + 1} onChange={() => onChange(i + 1)} />
            <strong>{i + 1} · {LEVELS[i]}</strong>
            <span>{description}</span>
          </label>
        ))}
      </fieldset>
      {value != null && <button type="button" className="ac-btn-link mx-clear" onClick={() => onChange(null)}>Clear</button>}
    </>
  );
}

export default function AssessmentForm({ record }) {
  const [state, action] = useActionState(saveMenteeAssessmentAction, {});
  const [scores, setScores] = useState(() => record?.scores ?? {});
  const [notes, setNotes] = useState(() => record?.notes ?? {});
  const [fields, setFields] = useState(() => ({
    mentee_name: record?.mentee_name ?? "",
    venture: record?.venture ?? "",
    email: record?.email ?? "",
    session_date: record ? record.session_date ?? "" : new Date().toLocaleDateString("en-CA", { timeZone: "America/Phoenix" }),
    next_steps: record?.next_steps ?? "",
  }));
  const [open, setOpen] = useState(() => AREAS[0].key);
  const summary = summarize(scores);
  const field = (key) => ({ name: key, value: fields[key], onChange: (e) => setFields((prev) => ({ ...prev, [key]: e.target.value })) });
  const setScore = (key) => (n) => setScores((prev) => { const copy = { ...prev }; if (n == null) delete copy[key]; else copy[key] = n; return copy; });

  return (
    <form action={action} className="ac-form">
      {record?.id && <input type="hidden" name="id" value={record.id} />}

      <section className="ac-card">
        <div className="ac-card-head"><h2>Mentee</h2></div>
        <div className="mx-grid">
          <label className="ac-field"><span className="ac-label">Name <span className="ac-req">Required</span></span><input type="text" required maxLength={120} {...field("mentee_name")} /></label>
          <label className="ac-field"><span className="ac-label">Venture</span><input type="text" maxLength={160} {...field("venture")} /></label>
          <label className="ac-field"><span className="ac-label">Email</span><input type="email" maxLength={160} {...field("email")} /></label>
          <label className="ac-field"><span className="ac-label">Session date</span><input type="date" {...field("session_date")} /></label>
        </div>
      </section>

      {AREAS.map((area) => {
        const areaSummary = summary.areas.find((a) => a.key === area.key);
        const isOpen = open === area.key;
        return (
          <section className="ac-card mx-area" key={area.key}>
            <button type="button" className="mx-area-head" aria-expanded={isOpen} onClick={() => setOpen(isOpen ? null : area.key)}>
              <span><strong>{area.title}</strong><small>{area.question}</small></span>
              <em>{areaSummary.score == null ? "Not assessed" : `${areaSummary.score} · ${areaSummary.label}`}<small>{areaSummary.scored}/{areaSummary.total}</small></em>
            </button>
            <div hidden={!isOpen}>
              {area.criteria.map((c) => {
                const key = `${area.key}.${c.key}`;
                return (
                  <div className="ac-axis" key={key}>
                    <div className="ac-axis-head"><span className="ac-axis-name">{c.title}</span></div>
                    <Level name={`score:${key}`} levels={c.levels} value={scores[key] ?? null} onChange={setScore(key)} />
                  </div>
                );
              })}
              <label className="ac-field"><span className="ac-label">Notes</span>
                <textarea name={`note:${area.key}`} rows={3} maxLength={4000} value={notes[area.key] ?? ""} onChange={(e) => setNotes((prev) => ({ ...prev, [area.key]: e.target.value }))} />
              </label>
            </div>
          </section>
        );
      })}

      <section className="ac-card">
        <div className="ac-card-head"><h2>Summary</h2><span className="ac-pill">{summary.overall == null ? "Not assessed" : `${summary.overall} · ${summary.label}`}</span></div>
        {summary.focus.length > 0 ? (
          <ul className="mx-focus">
            {summary.focus.map((f) => <li key={f.key}><strong>{f.title}</strong> <span className="ac-fine">{f.area}</span><p>Next level: {f.next}</p></li>)}
          </ul>
        ) : <p className="ac-fine">Score a few criteria to see where to focus.</p>}
        <label className="ac-field"><span className="ac-label">Next steps for the mentee</span>
          <textarea rows={4} maxLength={4000} {...field("next_steps")} placeholder="What they'll do before the next session." />
        </label>
        <div className="ac-actions"><Submit label={record?.id ? "Save changes" : "Save assessment"} /></div>
        {state?.error && <p className="ac-error" role="alert">{state.error}</p>}
        {state?.ok && <p className="ac-ok" role="status">{state.ok}</p>}
      </section>
    </form>
  );
}

export function DeleteAssessment({ id }) {
  const [state, action] = useActionState(deleteMenteeAssessmentAction, {});
  return (
    <form action={action} onSubmit={(e) => { if (!confirm("Delete this assessment? This can't be undone.")) e.preventDefault(); }}>
      <input type="hidden" name="id" value={id} />
      <button type="submit" className="btn btn-ghost ac-btn-danger ac-btn-sm">Delete assessment</button>
      {state?.error && <p className="ac-error" role="alert">{state.error}</p>}
    </form>
  );
}
