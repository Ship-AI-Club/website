"use client";

import { useId, useState } from "react";
import "./workshop-notify.css";

/* A workshop or program with no date can't be booked, so it offers the
   one honest thing: an email when a date is set. Email only; it posts
   to the same waitlist the detail pages use, keyed by slug.

   With `askGoal`, the confirmation offers one optional question: what
   they want working by the end. It is never required and never shown
   before the email is saved. */
export default function WorkshopNotify({ slug, name, button = "Get notified", prompt = "Email me when a date is set", startOpen = false, askGoal = false }) {
  const id = useId();
  const [open, setOpen] = useState(startOpen);
  const [email, setEmail] = useState("");
  const [trap, setTrap] = useState("");
  const [goal, setGoal] = useState("");
  const [status, setStatus] = useState("idle"); // idle | sending | done | noting | noted
  const [error, setError] = useState("");

  async function post(extra) {
    const response = await fetch("/api/waitlist", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ program: slug, email, notify: true, website: trap, ...extra }),
    });
    const payload = await response.json().catch(() => ({}));
    if (!response.ok) throw new Error(payload.error || "That didn't go through.");
  }

  async function send(event) {
    event.preventDefault();
    if (status === "sending") return;
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim())) {
      setError("Enter the email you want the date sent to.");
      return;
    }
    setError("");
    setStatus("sending");
    try {
      await post();
      setStatus("done");
    } catch (err) {
      setStatus("idle");
      setError(err?.message || "That didn't go through. Try again in a moment.");
    }
  }

  async function sendGoal(event) {
    event.preventDefault();
    if (status === "noting" || !goal.trim()) return;
    setError("");
    setStatus("noting");
    try {
      await post({ goal: goal.trim() });
      setStatus("noted");
    } catch (err) {
      setStatus("done");
      setError(err?.message || "That didn't go through. Try again in a moment.");
    }
  }

  if (status === "noted") {
    return <p className="wn wn-done" role="status">You&apos;re on the list, and we have your note. Thank you.</p>;
  }

  if (status === "done" || status === "noting") {
    return (
      <div className="wn">
        <p className="wn-done" role="status">You&apos;re on the list. We&apos;ll email you when {name} has a date.</p>
        {askGoal && (
          <form className="wn-form wn-goal" onSubmit={sendGoal} noValidate>
            <label htmlFor={`${id}-goal`}>Optional: what do you want working by the end?</label>
            <div className="wn-row">
              <input id={`${id}-goal`} type="text" maxLength={600} placeholder="One line is plenty" value={goal} onChange={(e) => setGoal(e.target.value)} disabled={status === "noting"} />
              <button type="submit" className="btn btn-ghost btn-sm" disabled={status === "noting" || !goal.trim()}>{status === "noting" ? "Saving" : "Send"}</button>
            </div>
            {error && <p className="wn-error" role="alert">{error}</p>}
          </form>
        )}
      </div>
    );
  }

  if (!open) {
    return (
      <div className="wn">
        <button type="button" className="btn btn-ghost btn-sm wn-open" onClick={() => setOpen(true)} aria-label={`Get notified when ${name} has a date`}>
          {button}
        </button>
      </div>
    );
  }

  return (
    <form className="wn wn-form" onSubmit={send} noValidate>
      <label htmlFor={id}>{prompt}</label>
      <div className="wn-row">
        <input id={id} type="email" inputMode="email" autoComplete="email" placeholder="you@example.com" value={email} onChange={(e) => setEmail(e.target.value)} disabled={status === "sending"} aria-describedby={error ? `${id}-error` : undefined} aria-invalid={error ? true : undefined} autoFocus={!startOpen} required />
        <button type="submit" className="btn btn-solid btn-sm" disabled={status === "sending"}>{status === "sending" ? "Saving" : "Notify me"}</button>
      </div>
      <input className="wn-trap" type="text" name="website" tabIndex={-1} autoComplete="off" aria-hidden="true" value={trap} onChange={(e) => setTrap(e.target.value)} />
      {error && <p className="wn-error" id={`${id}-error`} role="alert">{error}</p>}
    </form>
  );
}
