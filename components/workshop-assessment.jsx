"use client";
import { useRef, useState } from "react";
import { ArrowLeft, ArrowRight, Sparkles } from "lucide-react";
import { ASSESSMENT_OPTIONS } from "../lib/workshop-assessment";
import WorkshopRecommendation from "./workshop-recommendation";
const QUESTIONS = [["experience","How Familiar Are You With AI?"],["role","What’s Your Role?"],["focus","What Do You Want To Improve?"]];
export default function WorkshopAssessment() {
  const [step,setStep] = useState(0),[answers,setAnswers] = useState({experience:"",role:"",focus:"",goal:"",email:"",consent:false,website:""});
  const [busy,setBusy] = useState(false),[error,setError] = useState(""),[response,setResponse] = useState(null);
  const requestId = useRef(null), heading = useRef(null);
  function focusHeading() { requestAnimationFrame(()=>{heading.current?.focus({preventScroll:true});heading.current?.scrollIntoView({block:"start"});}); }
  function move(next) {setStep(next);setError(""); focusHeading();}
  async function submit(event) {
    event.preventDefault(); if (busy) return; setBusy(true);setError("");
    requestId.current ||= crypto.randomUUID();
    try {
      const res = await fetch("/api/workshop-assessment",{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({...answers,requestId:requestId.current})});
      const data = await res.json(); if (!res.ok) throw Error(data.error || "Please try again.");
      setResponse(data); focusHeading();
    } catch(e) {setError(e.message || "Couldn’t connect. Try again.");} finally {setBusy(false);}
  }
  if (response) return <section className="wa-shell" aria-label="Workshop recommendation"><WorkshopRecommendation {...response} headingRef={heading} /><button className="wa-reset" type="button" onClick={()=>{setResponse(null);requestId.current=null;move(0);}}>Start a new assessment</button></section>;
  const question = QUESTIONS[step];
  return <section className="wa-shell" aria-labelledby="assessment-heading">
    <div className="wa-progress" aria-label={`Step ${step+1} of 4`}>{[0,1,2,3].map(i=><span key={i} className={i<=step ? "active" : ""} />)}<small>{step+1} / 4</small></div>
    <p className="kicker">Your Workshop Match · About A Minute</p>
    <h1 id="assessment-heading" ref={heading} tabIndex={-1}>{question ? question[1] : "Where Should We Save Your Match?"}</h1>
    {question ? <>
      <p className="wa-intro">{step===0 ? "We’ll find a practical first workshop for where you are today." : "Choose the closest fit."}</p>
      <div className="wa-options" role="group" aria-label={question[1]}>{ASSESSMENT_OPTIONS[question[0]].map(([id,label])=><button type="button" key={id} aria-pressed={answers[question[0]]===id} onClick={()=>{requestId.current=null;setAnswers({...answers,[question[0]]:id});}}>{label}<span aria-hidden="true">{answers[question[0]]===id ? "✓" : ""}</span></button>)}</div>
      {step===2 && <label className="wa-field">One Goal <small>Optional</small><input maxLength={240} value={answers.goal} onChange={e=>{requestId.current=null;setAnswers({...answers,goal:e.target.value});}} placeholder="e.g. qualify inbound leads for my agency" /><span>One sentence is plenty. Keep private details out.</span></label>}
      <div className="wa-actions">{step>0 && <button type="button" className="wa-back" onClick={()=>move(step-1)}><ArrowLeft size={16} aria-hidden="true" />Back</button>}<button type="button" className="btn btn-solid" disabled={!answers[question[0]]} onClick={()=>move(step+1)}>Continue <ArrowRight size={17} aria-hidden="true" /></button></div>
    </> : <form onSubmit={submit}>
      <p className="wa-intro">Enter your email to unlock your AI recommendation and a link you can share.</p>
      <label className="wa-field">Email<input required disabled={busy} type="email" autoComplete="email" maxLength={254} value={answers.email} onChange={e=>{requestId.current=null;setAnswers({...answers,email:e.target.value});}} placeholder="you@company.com" /></label>
      <label className="wa-consent"><input type="checkbox" disabled={busy} required checked={answers.consent} onChange={e=>setAnswers({...answers,consent:e.target.checked})} /><span>Save my email and answers with my recommendation. No newsletter signup.</span></label>
      <div className="wa-trap" aria-hidden="true"><label>Website<input tabIndex={-1} autoComplete="off" value={answers.website} onChange={e=>setAnswers({...answers,website:e.target.value})} /></label></div>
      <p className="wa-note">AI reviews your experience, role, focus, and goal. Your email is kept on Ship AI and is not sent to the AI model.</p>
      <div className="wa-actions"><button type="button" disabled={busy} className="wa-back" onClick={()=>move(2)}><ArrowLeft size={16} aria-hidden="true" />Back</button><button type="submit" className="btn btn-solid" disabled={busy}>{busy ? "Finding your workshop…" : "Find my first workshop"}<Sparkles size={17} aria-hidden="true" /></button></div>
      {error && <div role="alert" className="wa-error"><p>{error}</p><button type="button" onClick={()=>{requestId.current=null;setError("");}}>Start a fresh attempt</button></div>}
      <p role="status" aria-live="polite" className="wa-note">{busy ? "Comparing workshops against your goals. This can take a few seconds." : "Free assessment. No payment or seat reservation."}</p>
    </form>}
  </section>;
}
