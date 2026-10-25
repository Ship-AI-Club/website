"use client";

import { useEffect, useRef, useState } from "react";
import DeckControls from "../app/programs/[program]/[slug]/deck/deck-controls";
import { pitchMarkdown, pitchAnswerParts, PITCH_PATH } from "../lib/hackathon-pitch";
import { pitchBrandStyle } from "../lib/pitch-brand";

function Answer({ item, className = "" }) {
  const suggested=/^Suggested\b/i.test(item.answer);
  const answer=suggested?item.answer.replace(/^Suggested(?:\s+(?:draft|positioning|customer profile))?\s*[:\n]?\s*/i,""):item.answer;
  const parts = pitchAnswerParts(answer);
  if (!parts.length) return <p className="hp-prompt">{item.prompt}</p>;
  return <div className="hp-answer-block">{suggested&&<p className="hp-suggested">Suggested from the website · review before presenting</p>}<div className={`hp-points ${parts.length === 1 ? "hp-single" : ""} ${className}`}>
    {parts.map((part, index) => <article key={index}>{part.label && <h3>{part.label}</h3>}<p>{part.body}</p></article>)}
  </div></div>;
}

export default function HackathonPitchDeck({ deck, reference = false, demo = false, preview, backHref, backLabel, initialOverview = false }) {
  const [notes, setNotes] = useState(false);
  const [overview, setOverview] = useState(initialOverview);
  const [current, setCurrent] = useState(0);
  const trackRef = useRef(null);
  useEffect(() => {
    const track = trackRef.current;
    const update = () => {
      if (!overview) setCurrent(Math.min(3, Math.max(0, Math.round(track.scrollTop / track.clientHeight))));
    };
    track.addEventListener("scroll", update, { passive: true });
    return () => track.removeEventListener("scroll", update);
  }, [overview]);

  function toggleOverview() {
    setOverview(!overview); setNotes(false); setCurrent(0);
    trackRef.current?.scrollTo({ top: 0 });
  }
  function download() {
    const url = URL.createObjectURL(new Blob([pitchMarkdown(deck)], { type: "text/markdown;charset=utf-8" }));
    const link = document.createElement("a"); link.href = url; link.download = "zero-to-launch-pitch.md"; link.click();
    setTimeout(() => URL.revokeObjectURL(url), 1000);
  }

  const slide = deck.slides[current];
  return <div style={pitchBrandStyle(deck.brand)} className={`dk-page hp-deck${notes ? " hp-with-notes" : ""}${overview ? " hp-overview" : ""}`}>
    {deck.brand && <style>{[
      deck.brand.headingFontUrl ? `@font-face{font-family:PitchWebsiteHeading;src:url(${JSON.stringify(deck.brand.headingFontUrl)});font-style:normal;font-weight:100 900;font-display:swap}` : "",
      deck.brand.bodyFontUrl ? `@font-face{font-family:PitchWebsiteBody;src:url(${JSON.stringify(deck.brand.bodyFontUrl)});font-style:normal;font-weight:100 900;font-display:swap}` : "",
    ].join("\n")}</style>}
    <header className="dk-bar hp-bar">
      <a href={backHref}>{backLabel ? `← ${backLabel}` : demo ? "← Pitch reference" : reference ? "← Hackathon" : "← Your submission"}</a>
      <span>{demo ? "Porchlight · Fictional demo" : reference ? "Pitch reference" : "Your pitch draft"} · 5 minutes</span>
      <div className="hp-tools">
        <button type="button" onClick={toggleOverview} aria-pressed={overview}>{overview ? "Present slides" : "All four slides"}</button>
        {!overview && <button type="button" onClick={() => setNotes(!notes)} aria-expanded={notes} aria-controls="pitch-notes">{notes ? "Hide notes" : "Speaker notes"}</button>}
        <button type="button" onClick={download}>Download outline</button>
        <button type="button" onClick={() => window.print()}>Print / PDF</button>
      </div>
    </header>
    <main className="dk-track" ref={trackRef} tabIndex={0} aria-label="Five-minute pitch deck">
      {deck.slides.map((item, index) => <section className="dk-slide dk-marketing-slide" id={`slide-${index + 1}`} key={item.id} aria-label={`Slide ${index + 1}: ${item.title}`}>
        <div className={`dk-frame hp-frame hp-${item.id}`}>
          <header className="hp-heading">
            <p className="hp-section">Zero to Launch · {index === 0 ? "The business" : index === 1 ? "Strategic positioning" : index === 2 ? "Ideal customer" : "Website and design"} <span>{item.window}</span></p>
            <div className="hp-title-row">{deck.brand?.logoUrl && <img className="hp-brand-logo" src={deck.brand.logoUrl} alt={`${deck.name} logo`} referrerPolicy="no-referrer"/>}{index === 0 ? <h1 className={deck.name.length > 55 ? "hp-name-long" : undefined}>{reference ? "Who you are and what you do" : deck.name}</h1> : <h2>{index === 1 ? "Why customers choose us" : index === 2 ? "Who we built this for" : "Our website and design choices"}</h2>}</div>
          </header>
          <div className="hp-body">
            {index === 0 ? <div className="hp-intro">
              {deck.brand?.imageUrl ? <div className="hp-brand-visual"><img src={deck.brand.imageUrl} alt={deck.brand.imageAlt} referrerPolicy="no-referrer"/></div> : <div className="hp-monogram" aria-hidden="true"><span>{reference ? "Aa" : deck.name.charAt(0).toUpperCase()}</span></div>}
              <div><Answer item={item}/><div className="hp-team"><span>Presented by</span><p>{reference ? "Your name and team" : deck.team}</p></div></div>
            </div> : index === 3 ? <div className="hp-site-layout">
              <div className="hp-site-preview">
                {preview ? <a href={preview} target="_blank" rel="noopener noreferrer"><img src={preview} alt="Porchlight Plant Care workshop website with a plant care introduction and trip care planner" width="1440" height="4691"/><span>Porchlight workshop website · View full page ↗</span></a>
                  : <div className="hp-site-link"><span>Live marketing website</span><strong>{deck.liveUrl ? new URL(deck.liveUrl).hostname : "Your website"}</strong><p>The first impression.<br/>The main visitor action.<br/>The work you shipped.</p>{deck.brand && <div className="hp-palette" aria-label="Website palette">{[deck.brand.accent,deck.brand.background,deck.brand.ink].map((color,i)=><span key={i} style={{background:color}} title={color}/>)}</div>}{deck.liveUrl && <a href={deck.liveUrl} target="_blank" rel="noopener noreferrer">Open live site ↗</a>}</div>}
              </div>
              <Answer item={item} className="hp-design-points"/>
            </div> : <Answer item={item} className={index === 2 ? "hp-customer-points" : "hp-position-points"}/>}
          </div>
          <footer className="dk-chrome hp-footer"><span className="dk-chrome-brand"><svg className="dk-chrome-mark" viewBox="0 0 16 16" aria-hidden="true"><path fill="currentColor" d="M4 1 12 8 4 15Z"/></svg>Ship AI</span><span className="dk-chrome-mid">{demo ? "Porchlight · Demo pitch" : "Zero to Launch · Five-minute pitch"}</span><span>{String(index + 1).padStart(2, "0")}/04</span></footer>
        </div>
      </section>)}
    </main>
    {notes && <aside className="hp-notes" id="pitch-notes" aria-label="Speaker notes">
      <div><strong>{current + 1}. {slide.title}</strong><span>{slide.window}</span></div><p>{slide.cue}</p>
      {reference && <p>Use your own deck or generate an optional draft from <a href="/dashboard/submission">your submission answers</a>. You can also <a href={`${PITCH_PATH}/demo?view=all`}>see the complete demo pitch</a>. A deck is not required to submit your project.</p>}
      {!reference && !slide.answer && <p>This section still needs your answer. Add it in <a href={backHref}>your submission</a>, save, then reopen your pitch.</p>}
      {current === 3 && <>{deck.launch && <><h3>What you shipped</h3><p>{deck.launch}</p></>}{deck.receipts && <><h3>Your evidence</h3><p>{deck.receipts}</p></>}</>}
    </aside>}
    {!overview && <DeckControls total={4}/>}
  </div>;
}
