"use client";

import { useState } from "react";

const FIELDS = [["project","Project name"],["summary","What your business does"],["positioning","Why customers choose you"],["icp","Your ideal customer"],["design","Your approach to design"]];

export default function WebsitePitchPrefill({ teamId, url, values, onApply }) {
  const [busy,setBusy] = useState(false);
  const [error,setError] = useState("");
  const [result,setResult] = useState(null);
  const [selected,setSelected] = useState({});
  const [applied,setApplied] = useState(false);

  async function read() {
    setBusy(true); setError(""); setResult(null); setApplied(false);
    try {
      const response = await fetch("/api/hackathon/pitch-prefill", { method:"POST", headers:{"Content-Type":"application/json"},
        body:JSON.stringify({teamId,url}), signal:AbortSignal.timeout(40000) });
      const data = await response.json();
      if (!response.ok) throw Error(data.error || "The website could not be read. Try again or enter your answers manually.");
      setResult(data);
      setSelected({...Object.fromEntries(FIELDS.map(([key]) => [key,Boolean(data.draft[key]) && !values[key]?.trim()])),brand:Boolean(data.brand)&&!values.brand});
    } catch (cause) { setError(cause.name === "TimeoutError" ? "The website took too long to respond. You can still enter your answers manually." : cause.message); }
    finally { setBusy(false); }
  }
  function apply() {
    const changes = Object.fromEntries(FIELDS.filter(([key]) => selected[key] && result.draft[key]).map(([key]) => [key,result.draft[key]]));
    if(selected.brand&&result.brand)changes.brand=result.brand;
    onApply(changes); setResult(null); setApplied(true);
  }
  return <div className="ac-website-prefill">
    <div className="ac-prefill-heading"><div><strong>Start from your website</strong><p className="ac-hint">Optional. Bring in pitch answers, brand colors, logo, imagery, and typography. Review before using them.</p></div>
      <button type="button" className="btn btn-ghost ac-btn-sm" disabled={busy || !url.trim()} onClick={read}>{busy ? "Reading website…" : "Prefill from website"}</button>
    </div>
    {error && <p className="ac-error" role="alert">{error}</p>}
    {applied && <p className="ac-ok" role="status">Selected answers added. Review them below, then save your entry.</p>}
    {result && <div className="ac-prefill-review" aria-label="Review website suggestions">
      <p className="ac-hint">{result.source === "ai" ? "Suggested from your website. Check the positioning and customer assumptions." : "Found in your page title and description. Other pitch answers need your input."} Existing answers stay unchanged unless you select a replacement.</p>
      <p className="ac-fine">Source: <a href={result.sourceUrl} target="_blank" rel="noopener noreferrer">{result.sourceUrl}</a></p>
      {result.brand && <section className="ac-brand-review" aria-label="Website brand guide">
        <label className="ac-brand-select"><input type="checkbox" checked={Boolean(selected.brand)} onChange={event=>setSelected(prev=>({...prev,brand:event.target.checked}))}/><strong>Use this website branding{values.brand?" · replaces current branding":""}</strong></label>
        <div className="ac-brand-assets">{result.brand.logoUrl&&<img className="ac-brand-logo" src={result.brand.logoUrl} alt="Logo found on your website" referrerPolicy="no-referrer"/>}{result.brand.imageUrl&&<img className="ac-brand-image" src={result.brand.imageUrl} alt={result.brand.imageAlt} referrerPolicy="no-referrer"/>}</div>
        <div className="ac-brand-colors">{[["accent","Brand color"],["background","Background"],["ink","Text"]].map(([key,label])=><label key={key}><input type="color" value={result.brand[key]} onChange={event=>setResult(prev=>({...prev,brand:{...prev.brand,[key]:event.target.value}}))}/><span>{label}<strong>{result.brand[key]}</strong></span></label>)}</div>
        <p className="ac-hint">Headings: {result.brand.headingFont||"Ship AI default"}. Body: {result.brand.bodyFont||"Ship AI default"}. Review the suggested palette and adjust it to match your brand.</p>
      </section>}
      {FIELDS.filter(([key]) => result.draft[key]).map(([key,label]) => <label className="ac-prefill-option" key={key}>
        <input type="checkbox" checked={Boolean(selected[key])} onChange={event => setSelected(prev => ({...prev,[key]:event.target.checked}))}/>
        <span><strong>{label}{values[key]?.trim() ? " · replaces your answer" : ""}</strong><span>{result.draft[key]}</span></span>
      </label>)}
      {!FIELDS.some(([key]) => result.draft[key]) && <p className="ac-hint">This page did not expose enough readable text. Enter your pitch answers below.</p>}
      <div className="ac-actions"><button type="button" className="btn btn-solid ac-btn-sm" disabled={!Object.values(selected).some(Boolean)} onClick={apply}>Use selected answers</button><button type="button" className="btn btn-ghost ac-btn-sm" onClick={() => setResult(null)}>Dismiss</button></div>
    </div>}
  </div>;
}
