"use client";

import { useRef, useState } from "react";
import { ASSESSMENT_OPTIONS } from "../lib/workshop-assessment";
import WorkshopRecommendation from "./workshop-recommendation";
import "./departure-board.css";
import "./event-page.css";
import "./workshop-assessment.css";

/* The workshop assessment: the counter. The question is the page's
   headline and its answers sit on a board under it, two columns wide.
   Picking an answer is answering: it brings the next question. The
   third question keeps a Continue button, because of its optional goal
   field. What was answered so far sits on the board's foot, and any
   answer there can be tapped to change it. The email comes last, and
   the recommendation replaces the board. */

const QUESTIONS = [
  ["experience", "How familiar are you with AI?"],
  ["role", "What’s your role?"],
  ["focus", "What do you want to improve?"],
];
const EMAIL_STEP = QUESTIONS.length;
const INTRO = "We’ll find a practical first workshop for where you are today.";

const labelOf = (field, id) => ASSESSMENT_OPTIONS[field].find(([value]) => value === id)?.[1];

export default function WorkshopAssessment() {
  const [step, setStep] = useState(0);
  const [answers, setAnswers] = useState({ experience: "", role: "", focus: "", goal: "", email: "", consent: false, website: "" });
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  const [response, setResponse] = useState(null);
  const requestId = useRef(null);
  const heading = useRef(null);

  function focusHeading() {
    requestAnimationFrame(() => {
      heading.current?.focus({ preventScroll: true });
      /* every step fits a screen from the top of the page; scrolling
         the heading itself would tuck it under the sticky header */
      window.scrollTo({ top: 0 });
    });
  }

  function move(next) {
    setStep(next);
    setError("");
    focusHeading();
  }

  function change(patch) {
    requestId.current = null;
    setAnswers((current) => ({ ...current, ...patch }));
  }

  function pick(field, id) {
    change({ [field]: id });
    if (step < QUESTIONS.length - 1) move(step + 1);
  }

  async function submit(event) {
    event.preventDefault();
    if (busy) return;
    setBusy(true);
    setError("");
    requestId.current ||= crypto.randomUUID();
    try {
      const res = await fetch("/api/workshop-assessment", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...answers, requestId: requestId.current }),
      });
      const data = await res.json();
      if (!res.ok) throw Error(data.error || "Please try again.");
      setResponse(data);
      focusHeading();
    } catch (e) {
      setError(e.message || "Couldn’t connect. Try again.");
    } finally {
      setBusy(false);
    }
  }

  if (response) {
    return (
      <WorkshopRecommendation
        {...response}
        email={answers.email}
        headingRef={heading}
        onRestart={() => {
          setResponse(null);
          requestId.current = null;
          move(0);
        }}
      />
    );
  }

  const question = QUESTIONS[step];
  const answered = QUESTIONS.slice(0, Math.min(step, QUESTIONS.length)).filter(([field]) => answers[field]);

  return (
    <>
      <section className="hero ev-hero as-hero" aria-labelledby="assessment-heading">
        <p className="ev-crumb"><a href="/workshops">← All workshops</a></p>
        <h1 className="hero-h1" id="assessment-heading" ref={heading} tabIndex={-1}>
          {question ? question[1] : <>Where should we <span className="key">save your match?</span></>}
        </h1>
        {step === 0 && <p className="hero-lede">{INTRO}</p>}
        {!question && <p className="hero-lede">We save your recommendation with this email and give you a link you can share.</p>}
      </section>

      <div className="as-wrap">
        <section className="window as-board" aria-label={question ? `Question ${step + 1} of ${QUESTIONS.length}` : "Last step: your email"}>
          <div className="window-bar">
            <b>{question ? `Question ${step + 1} of ${QUESTIONS.length}` : "Last step"}</b>
            <span>{question ? "About a minute" : "Free"}</span>
          </div>

          {question ? (
            <>
              <div className="as-options" role="group" aria-labelledby="assessment-heading">
                {ASSESSMENT_OPTIONS[question[0]].map(([id, label]) => (
                  <button type="button" key={id} aria-pressed={answers[question[0]] === id} onClick={() => pick(question[0], id)}>
                    {label}
                    <span aria-hidden="true">{answers[question[0]] === id ? "✓" : ""}</span>
                  </button>
                ))}
              </div>
              {step === QUESTIONS.length - 1 && (
                <>
                  <label className="as-field">
                    <span>One goal <small>Optional</small></span>
                    <input type="text" maxLength={240} value={answers.goal} onChange={(e) => change({ goal: e.target.value })} placeholder="e.g. qualify inbound leads for my agency" />
                    <em>One sentence is plenty. Keep private details out.</em>
                  </label>
                  <div className="as-go">
                    <button type="button" className="as-back" onClick={() => move(step - 1)}>Back</button>
                    <button type="button" className="btn btn-solid" disabled={!answers[question[0]]} onClick={() => move(EMAIL_STEP)}>Continue</button>
                  </div>
                </>
              )}
            </>
          ) : (
            <form onSubmit={submit}>
              <label className="as-field">
                <span>Email</span>
                <input required disabled={busy} type="email" autoComplete="email" maxLength={254} value={answers.email} onChange={(e) => change({ email: e.target.value })} placeholder="you@company.com" />
              </label>
              <label className="as-consent">
                <input type="checkbox" disabled={busy} required checked={answers.consent} onChange={(e) => setAnswers((current) => ({ ...current, consent: e.target.checked }))} />
                <span>Save my email and answers with my recommendation. No newsletter signup.</span>
              </label>
              <div className="as-trap" aria-hidden="true">
                <label>Website<input tabIndex={-1} autoComplete="off" value={answers.website} onChange={(e) => setAnswers((current) => ({ ...current, website: e.target.value }))} /></label>
              </div>
              <div className="as-go">
                <p role="status" aria-live="polite">
                  {busy ? "Comparing workshops against your goals. This can take a few seconds." : "Your email is kept on Ship AI and is not sent to the AI model."}
                </p>
                <button type="submit" className="btn btn-solid" disabled={busy}>{busy ? "Finding your workshop…" : "Find my first workshop"}</button>
              </div>
              {error && (
                <div role="alert" className="as-error">
                  <p>{error}</p>
                  <button type="button" className="as-back" onClick={() => { requestId.current = null; setError(""); }}>Start a fresh attempt</button>
                </div>
              )}
            </form>
          )}

          {answered.length > 0 && (
            <div className="dboard-foot as-foot">
              <span className="as-answers">
                {answered.map(([field], index) => (
                  <button type="button" key={field} disabled={busy} onClick={() => move(index)} aria-label={`Change your answer: ${labelOf(field, answers[field])}`}>
                    {labelOf(field, answers[field])}
                  </button>
                ))}
              </span>
              <span>Tap an answer to change it</span>
            </div>
          )}
        </section>
      </div>
    </>
  );
}
