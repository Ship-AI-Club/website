"use client";

import { useState } from "react";
import "./departure-board.css";
import "./event-page.css";
import "./workshop-assessment.css";

/* The recommendation: the same board as the questions, now holding the
   workshop. One action per reader.

   For the person who took the assessment: "Email me the date" adds the
   email they already gave to that workshop's date list. It happens on
   the click and not before, so "no newsletter signup" stays true. A
   workshop that already has a date links to its page instead.

   For someone opening a shared link (`shared`): "Get your own
   recommendation". */

const UNDATED = /^date tbd/i;

export default function WorkshopRecommendation({ result, sharePath, email, shared = false, headingRef, onRestart }) {
  const [message, setMessage] = useState("");
  const [listing, setListing] = useState("idle"); // idle | sending | done | failed
  const first = result.first;
  const undated = UNDATED.test(first.schedule || "");

  async function share() {
    const url = new URL(sharePath, window.location.origin).href;
    const note = "Anyone with the link can view this recommendation. Your email and answers stay private.";
    try {
      if (navigator.share) {
        await navigator.share({ title: "My Ship AI Workshop Recommendation", text: `My first workshop: ${first.name}`, url });
        setMessage(note);
      } else {
        await navigator.clipboard.writeText(url);
        setMessage(`Recommendation link copied. ${note}`);
      }
    } catch (error) {
      if (error.name !== "AbortError") setMessage("Copy the page link from your browser to share.");
    }
  }

  async function emailDate() {
    if (listing === "sending") return;
    setListing("sending");
    try {
      const response = await fetch("/api/waitlist", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ program: first.slug, email, notify: true, website: "" }),
      });
      if (!response.ok) throw new Error();
      setListing("done");
    } catch {
      setListing("failed");
    }
  }

  let action;
  if (shared) {
    action = <a className="btn btn-solid" href="/workshops/assessment">Get your own recommendation</a>;
  } else if (!undated || !email || !first.slug || listing === "failed") {
    action = <a className="btn btn-solid" href={first.path}>{undated ? "Get the date on its page" : "See the workshop"}</a>;
  } else if (listing === "done") {
    action = <p className="as-done" role="status">We’ll email you the date</p>;
  } else {
    action = <button type="button" className="btn btn-solid" onClick={emailDate} disabled={listing === "sending"}>{listing === "sending" ? "Saving" : "Email me the date"}</button>;
  }

  return (
    <>
      <section className="hero ev-hero as-hero" aria-labelledby="recommendation-heading">
        <p className="ev-crumb"><a href="/workshops">← All workshops</a></p>
        <h1 className="hero-h1" id="recommendation-heading" ref={headingRef} tabIndex={-1}>
          <span className="ev-name">{shared ? "A shared Ship AI recommendation" : "Your starting point"}</span>
          {first.name}
        </h1>
        <p className="hero-lede">{result.reason}</p>
      </section>

      <div className="as-wrap">
        <section className="window as-board" aria-label={shared ? "Their first workshop" : "Your first workshop"}>
          <div className="window-bar">
            <b>{shared ? "Their first workshop" : "Your first workshop"}</b>
            <span>{undated ? "Date to be announced" : first.schedule}</span>
          </div>
          <div className="as-result">
            <p className="as-price">${first.price.toLocaleString("en-US")}</p>
            <div>
              <h2>{first.format}</h2>
              {undated && !shared && <p>One email when the date is set.</p>}
            </div>
            <div className="as-act">{action}</div>
          </div>
          {listing === "failed" && <p className="as-error" role="alert">That didn’t go through. The workshop’s page takes your email for the date.</p>}
          <div className="dboard-foot">
            <a href={first.path}>See the workshop</a>
            {shared && <span>About a minute, three questions</span>}
          </div>
        </section>
      </div>

      <div className="as-after">
        <ul className="ev-rows">
          {!shared && <li><h3>Come prepared</h3><p>{result.prepare}</p></li>}
          <li><h3>Then, when {shared ? "they’re" : "you’re"} ready</h3><p><a href={result.next.path}>{result.next.name}</a></p></li>
        </ul>
        {!shared && (
          <>
            <p className="as-tail">
              <span>A suggested path, with separate tickets.</span>
              <span>
                <button type="button" onClick={share}>Share this recommendation</button>
                {onRestart && <button type="button" onClick={onRestart}>Start again</button>}
              </span>
            </p>
            <p className="as-share-note" role="status">{message}</p>
          </>
        )}
      </div>
    </>
  );
}
