"use client";

import { useId, useState } from "react";

/* A workshop with no date can't be booked, so the card offers the one
   honest thing: an email when a date is set. Email only; it posts to
   the same waitlist the workshop page uses, keyed by workshop slug. */
export default function WorkshopNotify({ slug, name }) {
  const id = useId();
  const [open, setOpen] = useState(false);
  const [email, setEmail] = useState("");
  const [trap, setTrap] = useState("");
  const [status, setStatus] = useState("idle"); // idle | sending | done
  const [error, setError] = useState("");

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
      const response = await fetch("/api/waitlist", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ program: slug, email, notify: true, website: trap }),
      });
      const payload = await response.json().catch(() => ({}));
      if (!response.ok) throw new Error(payload.error || "That didn't go through.");
      setStatus("done");
    } catch (err) {
      setStatus("idle");
      setError(err?.message || "That didn't go through. Try again in a moment.");
    }
  }

  if (status === "done") {
    return <p className="wn wn-done" role="status">You&apos;re on the list. We&apos;ll email you when {name} has a date.</p>;
  }

  if (!open) {
    return (
      <div className="wn">
        <button type="button" className="btn btn-ghost btn-sm wn-open" onClick={() => setOpen(true)} aria-label={`Get notified when ${name} has a date`}>
          Get notified
        </button>
      </div>
    );
  }

  return (
    <form className="wn wn-form" onSubmit={send} noValidate>
      <label htmlFor={id}>Email me when a date is set</label>
      <div className="wn-row">
        <input id={id} type="email" inputMode="email" autoComplete="email" placeholder="you@example.com" value={email} onChange={(e) => setEmail(e.target.value)} disabled={status === "sending"} aria-describedby={error ? `${id}-error` : undefined} aria-invalid={error ? true : undefined} autoFocus required />
        <button type="submit" className="btn btn-solid btn-sm" disabled={status === "sending"}>{status === "sending" ? "Saving" : "Notify me"}</button>
      </div>
      <input className="wn-trap" type="text" name="website" tabIndex={-1} autoComplete="off" aria-hidden="true" value={trap} onChange={(e) => setTrap(e.target.value)} />
      {error && <p className="wn-error" id={`${id}-error`} role="alert">{error}</p>}
    </form>
  );
}
