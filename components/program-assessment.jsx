"use client";

import { useEffect, useRef, useState } from "react";
import { ArrowLeft, ArrowRight, Check, Sparkles } from "lucide-react";
import { PROGRAM_QUESTIONS } from "../lib/program-assessment";

export default function ProgramAssessment({ programs }) {
  const [open, setOpen] = useState(false);
  const [step, setStep] = useState(0);
  const [answers, setAnswers] = useState({ experience: "", stage: "", goal: "", context: "" });
  const [response, setResponse] = useState(null);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  const heading = useRef(null);
  const shell = useRef(null);
  useEffect(() => {
    if (!open) return;
    heading.current?.focus({ preventScroll: true });
    shell.current?.scrollIntoView({ block: "start" });
  }, [open, step, response]);
  function move(next) { setStep(next); setError(""); }
  async function submit(event) {
    event.preventDefault();
    if (busy || PROGRAM_QUESTIONS.some(q => !answers[q.key])) return;
    setBusy(true); setError("");
    try {
      const res = await fetch("/api/program-assessment", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(answers), signal: AbortSignal.timeout(30000) });
      const data = await res.json();
      if (!res.ok) throw Error(data.error || "Your match didn’t finish. Please try again.");
      if (!programs.some(p => p.slug === data.result?.program)) throw Error("Your match didn’t finish. Please try again.");
      setResponse(data);
    } catch (e) { setError(e.name === "TimeoutError" ? "This is taking longer than expected. Please try again." : e.message || "Couldn’t connect. Please try again."); }
    finally { setBusy(false); }
  }
  const question = PROGRAM_QUESTIONS[step];
  const match = response && programs.find(p => p.slug === response.result.program);
  return <section ref={shell} id="program-assessment" className={`program-assessment${open ? " is-open" : ""}`} aria-labelledby="program-assessment-title">
    {!open ? <div className="pa-invitation"><div><p className="programs-eyebrow"><Sparkles size={14} aria-hidden="true" /> Find your starting point</p><h2 id="program-assessment-title">Not sure which program fits?</h2><p>Answer three quick questions. Get a recommendation that fits your experience and what you want to build.</p></div><button type="button" className="programs-primary" onClick={() => { setOpen(true); }}>Take the AI assessment <ArrowRight size={18} aria-hidden="true" /></button></div> : <>
      <div className="pa-top"><p className="programs-eyebrow"><Sparkles size={14} aria-hidden="true" /> Your program match</p><button type="button" className="pa-text-button" disabled={busy} onClick={() => setOpen(false)}>Close assessment</button></div>
      {match ? <div className="pa-result">
        <div><p className="pa-result-label">{response.source === "ai" ? "Your AI recommendation" : "Your guided recommendation"}</p><h2 id="program-assessment-title" ref={heading} tabIndex={-1}>{match.name}</h2><p className="pa-reason">{response.result.reason}</p><p className="pa-fit"><Check size={17} aria-hidden="true" />{match.sessions} sessions · {match.datesLabel}</p><p className="pa-note">Check the program page for current registration details.</p><a className="programs-primary" href={`/programs/${match.slug}`}>Explore {match.name}<ArrowRight size={18} aria-hidden="true" /></a></div>
        <div className="pa-preparation"><h3>Before you start</h3><p>{response.result.prepare}</p>{response.result.foundation && <p>{response.result.foundation} <a href="/programs/day-zero">Explore Day Zero <ArrowRight size={13} aria-hidden="true" /></a></p>}<p className="pa-note">{response.source === "ai" ? "AI used your answers and the program curriculum to suggest a starting point." : "AI is unavailable right now. This match uses your selected answers and the program learning path."}</p><button className="pa-text-button" type="button" onClick={() => { setResponse(null); move(0); }}>Change my answers</button></div>
      </div> : <form onSubmit={submit}>
        <div className="pa-progress" aria-label={`Question ${step + 1} of 3`}><span>Question {step + 1} of 3</span><div>{PROGRAM_QUESTIONS.map((q, i) => <span key={q.key} className={i <= step ? "is-active" : ""} />)}</div></div>
        <h2 id="program-assessment-title" ref={heading} tabIndex={-1}>{question.title}</h2><p className="pa-note">Choose the closest fit. You can go back and change your answers.</p>
        <fieldset className="pa-options" disabled={busy}><legend className="pa-sr-only">{question.title}</legend>{question.options.map(([value, label]) => <label key={value} className={answers[question.key] === value ? "is-selected" : ""}><input type="radio" name={question.key} value={value} checked={answers[question.key] === value} onChange={() => setAnswers({ ...answers, [question.key]: value })} /><span>{label}</span></label>)}</fieldset>
        {step === 2 && <label className="pa-context">Anything specific you want to make? <span>Optional</span><textarea maxLength={400} rows={2} disabled={busy} value={answers.context} onChange={event => setAnswers({ ...answers, context: event.target.value })} placeholder="e.g. a scheduling app for my business" /><small>Your answers and optional goal are sent to AI for this recommendation. No email needed. Leave out private details.</small></label>}
        <div className="pa-actions">{step > 0 && <button className="pa-text-button" type="button" disabled={busy} onClick={() => move(step - 1)}><ArrowLeft size={16} aria-hidden="true" />Back</button>}{step < 2 ? <button type="button" className="programs-primary" disabled={!answers[question.key]} onClick={() => move(step + 1)}>Continue <ArrowRight size={18} aria-hidden="true" /></button> : <button type="submit" className="programs-primary" disabled={!answers.goal || busy}>{busy ? "Finding your program…" : "Find my program"}<Sparkles size={17} aria-hidden="true" /></button>}</div>
        {error && <p className="pa-error" role="alert">{error}</p>}<p className="pa-note" role="status">{busy ? "Comparing your goals with the program curriculum…" : "About a minute · No signup required"}</p>
      </form>}
    </>}
  </section>;
}
