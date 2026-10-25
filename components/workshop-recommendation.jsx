"use client";
import { useState } from "react";
import { ArrowRight, Check, Share2 } from "lucide-react";
export default function WorkshopRecommendation({ result, sharePath, allowShare = true, headingRef }) {
  const [message,setMessage] = useState("");
  async function share() {
    const url = new URL(sharePath,window.location.origin).href;
    try {
      if (navigator.share) await navigator.share({title:"My Ship AI Workshop Recommendation",text:`My first workshop: ${result.first.name}`,url});
      else { await navigator.clipboard.writeText(url); setMessage("Recommendation link copied."); }
    } catch (error) { if (error.name !== "AbortError") setMessage("Copy the page link from your browser to share."); }
  }
  return <div className="wa-result">
    <p className="kicker">Your Starting Point</p><h1 ref={headingRef} tabIndex={-1}>{result.first.name}</h1><p className="wa-reason">{result.reason}</p>
    <div className="wa-result-facts"><strong>${result.first.price.toLocaleString("en-US")} USD</strong><span>{result.first.format}</span><span>{result.first.schedule}</span></div>
    <a className="btn btn-solid" href={result.first.path}>Explore this workshop <ArrowRight size={17} aria-hidden="true" /></a>
    <div className="wa-prepare"><Check size={18} aria-hidden="true" /><div><h3>Come Prepared</h3><p>{result.prepare}</p></div></div>
    <a className="wa-next" href={result.next.path}><span><small>Then, When You’re Ready</small><strong>{result.next.name}</strong></span><ArrowRight size={20} aria-hidden="true" /></a>
    <p className="wa-note">A suggested path, with separate tickets. Check each page for prerequisites, dates, and current pricing.</p>
    {allowShare && <div className="wa-share"><button type="button" className="btn btn-outline" onClick={share}><Share2 size={16} aria-hidden="true" />Share recommendation</button><p>Anyone with the link can view this recommendation. Your email and answers stay private.</p><span role="status">{message}</span></div>}
  </div>;
}
