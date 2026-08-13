"use client";

import { useState } from "react";
import { CheckCircle2 } from "lucide-react";
import { siDiscord } from "simple-icons";

/* The controls are the same primitives as /intake — same labels, same
   hints, same hidden honeypot — so this reuses that stylesheet rather
   than starting a second form namespace. */
import "../../forms.css";
import { FIELD_LIMITS } from "../../../lib/waitlist";

/* A program with no dates has nothing to RSVP to. This is the honest
   version of a CTA for one: say what you want built, get the dates
   when they exist. Small on purpose — five fields, two of them
   optional. Anything longer reads as an application, and nobody is
   being selected here. */

const EMPTY = { name: "", company: "", email: "", goal: "", notes: "", website: "" };

export default function WaitlistForm({ program, programName, discord }) {
  const [fields, setFields] = useState(EMPTY);
  const [status, setStatus] = useState("idle"); // idle | sending | added | already
  const [error, setError] = useState("");

  const sending = status === "sending";
  const set = (key) => (e) => setFields((f) => ({ ...f, [key]: e.target.value }));

  async function send(event) {
    event.preventDefault();
    if (sending) return;

    if (!fields.name.trim() || !fields.email.trim() || !fields.goal.trim()) {
      setError("Name, email and what you want working — the rest is optional.");
      return;
    }

    setError("");
    setStatus("sending");

    try {
      const response = await fetch("/api/waitlist", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ program, ...fields }),
      });
      const payload = await response.json().catch(() => ({}));
      if (!response.ok) throw new Error(payload.error || "That didn't go through.");
      setStatus(payload.status === "already" ? "already" : "added");
    } catch (err) {
      setStatus("idle");
      setError(err?.message || "That didn't go through. Try again in a moment.");
    }
  }

  if (status === "added" || status === "already") {
    return (
      <div className="ik-done">
        <CheckCircle2 size={22} strokeWidth={1.75} aria-hidden="true" />
        <h2>{status === "already" ? "You're already on it." : "You're on the list."}</h2>
        <p>
          {status === "already" ? (
            <>
              That address is already down for {programName}. Nothing else to do — the dates
              come to you the day they&apos;re set.
            </>
          ) : (
            <>
              When the dates land you get one email with all of them, and that is the entire
              reason we asked for the address. No list, no marketing, nothing else sent to it.
            </>
          )}
        </p>
        {discord && (
          <div className="cta-row">
            <a className="btn btn-ghost" href={discord} target="_blank" rel="noreferrer">
              <svg viewBox="0 0 24 24" width={16} height={16} fill="currentColor" aria-hidden="true">
                <path d={siDiscord.path} />
              </svg>
              Join the Discord meanwhile
            </a>
          </div>
        )}
      </div>
    );
  }

  return (
    <form className="ik-form hk-waitlist-form" onSubmit={send} noValidate>
      <div className="ik-field">
        <label className="ik-label" htmlFor="wl-name">
          Name <span className="ik-req">required</span>
        </label>
        <p className="ik-hint" id="wl-name-hint">
          Whatever you go by in a room full of builders.
        </p>
        <input
          id="wl-name"
          type="text"
          autoComplete="name"
          maxLength={FIELD_LIMITS.name}
          value={fields.name}
          onChange={set("name")}
          disabled={sending}
          aria-describedby="wl-name-hint"
          required
        />
      </div>

      <div className="ik-field">
        <label className="ik-label" htmlFor="wl-email">
          Email <span className="ik-req">required</span>
        </label>
        <p className="ik-hint" id="wl-email-hint">
          Where the dates go, and the only thing it gets used for. Never published, never a list.
        </p>
        <input
          id="wl-email"
          type="email"
          autoComplete="email"
          maxLength={FIELD_LIMITS.email}
          value={fields.email}
          onChange={set("email")}
          disabled={sending}
          aria-describedby="wl-email-hint"
          required
        />
      </div>

      <div className="ik-field">
        <label className="ik-label" htmlFor="wl-company">
          Company
        </label>
        <p className="ik-hint" id="wl-company-hint">
          Where you work, if the work is part of why you&apos;re coming. Skip it if you&apos;re
          here as yourself.
        </p>
        <input
          id="wl-company"
          type="text"
          autoComplete="organization"
          maxLength={FIELD_LIMITS.company}
          value={fields.company}
          onChange={set("company")}
          disabled={sending}
          aria-describedby="wl-company-hint"
        />
      </div>

      <div className="ik-field">
        <label className="ik-label" htmlFor="wl-goal">
          What do you want working by the end? <span className="ik-req">required</span>
        </label>
        <p className="ik-hint" id="wl-goal-hint">
          Name the thing, not the skill. &ldquo;A site that answers my customers without
          me&rdquo; tells us what to build on screen; &ldquo;learn AI&rdquo; doesn&apos;t. One
          line is plenty, and &ldquo;no idea yet&rdquo; is an honest answer we can work with.
        </p>
        <textarea
          id="wl-goal"
          rows={3}
          maxLength={FIELD_LIMITS.goal}
          value={fields.goal}
          onChange={set("goal")}
          disabled={sending}
          aria-describedby="wl-goal-hint"
          placeholder="A support agent that handles the twenty questions I answer every week."
          required
        />
      </div>

      <div className="ik-field">
        <label className="ik-label" htmlFor="wl-notes">
          Anything else we should know?
        </label>
        <p className="ik-hint" id="wl-notes-hint">
          Evenings that never work, an accessibility need, a question you want answered on the
          night. Or nothing.
        </p>
        <textarea
          id="wl-notes"
          rows={3}
          maxLength={FIELD_LIMITS.notes}
          value={fields.notes}
          onChange={set("notes")}
          disabled={sending}
          aria-describedby="wl-notes-hint"
        />
      </div>

      {/* honeypot — hidden from people, irresistible to bots */}
      <div className="ik-hp" aria-hidden="true">
        <label htmlFor="wl-website">Website</label>
        <input
          id="wl-website"
          type="text"
          tabIndex={-1}
          autoComplete="off"
          value={fields.website}
          onChange={set("website")}
        />
      </div>

      <div className="ik-submit">
        <button type="submit" className="btn btn-solid" disabled={sending}>
          {sending ? "Adding you…" : "Join the waitlist"}
        </button>
        {discord && (
          <a className="btn btn-ghost" href={discord} target="_blank" rel="noreferrer">
            <svg viewBox="0 0 24 24" width={16} height={16} fill="currentColor" aria-hidden="true">
              <path d={siDiscord.path} />
            </svg>
            Discord
          </a>
        )}
        <p className="ik-status" role="status" aria-live="polite">
          {sending ? "Sending…" : "Free, like every Ship AI session. One email when the next dates land."}
        </p>
      </div>

      {error && (
        <p className="ik-error" role="alert">
          {error}
        </p>
      )}
    </form>
  );
}
