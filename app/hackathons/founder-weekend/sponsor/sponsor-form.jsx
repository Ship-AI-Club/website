"use client";

import { useState } from "react";
import { CheckCircle2 } from "lucide-react";

import "../../../forms.css";

const EMPTY = { name: "", email: "", company: "", site: "", message: "", website: "" };

export default function SponsorForm({ tiers, initial }) {
  const options = [
    ...tiers.map((t) => ({ id: t.id, label: `${t.name} · $${t.price.toLocaleString("en-US")}` })),
    { id: "undecided", label: "Not sure yet" },
  ];
  const [fields, setFields] = useState(EMPTY);
  const [pick, setPick] = useState(initial || tiers[0]?.id || "undecided");
  const [status, setStatus] = useState("idle");
  const [error, setError] = useState("");

  const sending = status === "sending";
  const set = (key) => (e) => setFields((f) => ({ ...f, [key]: e.target.value }));

  async function send(event) {
    event.preventDefault();
    if (sending) return;
    if (!fields.name.trim() || !fields.email.trim() || !fields.company.trim()) {
      setError("Name, email and company are required.");
      return;
    }
    setError("");
    setStatus("sending");
    try {
      const response = await fetch("/api/founder-weekend/sponsor", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...fields, package: pick }),
      });
      const payload = await response.json().catch(() => ({}));
      if (!response.ok) throw new Error(payload.error || "That didn't go through.");
      setStatus("sent");
    } catch (err) {
      setStatus("idle");
      setError(err?.message || "That didn't go through. Try again in a moment.");
    }
  }

  if (status === "sent") {
    return (
      <div className="ik-done fw-sponsor-done">
        <CheckCircle2 size={22} strokeWidth={1.75} aria-hidden="true" />
        <h2>Thanks. We&apos;ll be in touch.</h2>
        <p>We&apos;ll reply by email to confirm the package and placements in writing.</p>
      </div>
    );
  }

  return (
    <form className="ik-form fw-sponsor-form" onSubmit={send} noValidate>
      <fieldset className="ik-roles">
        <legend className="ik-label">Package</legend>
        <div className="ik-role-row">
          {options.map((o) => (
            <label key={o.id} className={`ik-role${pick === o.id ? " is-on" : ""}`}>
              <input
                className="sr-only"
                type="radio"
                name="package"
                value={o.id}
                checked={pick === o.id}
                onChange={() => setPick(o.id)}
                disabled={sending}
              />
              {o.label}
            </label>
          ))}
        </div>
      </fieldset>

      <div className="fw-sponsor-pair">
        <div className="ik-field">
          <label className="ik-label" htmlFor="sp-name">
            Name <span className="ik-req">Required</span>
          </label>
          <input id="sp-name" type="text" autoComplete="name" maxLength={120} value={fields.name} onChange={set("name")} disabled={sending} required />
        </div>
        <div className="ik-field">
          <label className="ik-label" htmlFor="sp-email">
            Email <span className="ik-req">Required</span>
          </label>
          <input id="sp-email" type="email" autoComplete="email" maxLength={160} value={fields.email} onChange={set("email")} disabled={sending} required />
        </div>
      </div>

      <div className="fw-sponsor-pair">
        <div className="ik-field">
          <label className="ik-label" htmlFor="sp-company">
            Company <span className="ik-req">Required</span>
          </label>
          <input id="sp-company" type="text" autoComplete="organization" maxLength={160} value={fields.company} onChange={set("company")} disabled={sending} required />
        </div>
        <div className="ik-field">
          <label className="ik-label" htmlFor="sp-site">Website</label>
          <input id="sp-site" type="text" inputMode="url" autoComplete="url" maxLength={400} value={fields.site} onChange={set("site")} disabled={sending} placeholder="example.com" />
        </div>
      </div>

      <div className="ik-field">
        <label className="ik-label" htmlFor="sp-message">Anything we should know?</label>
        <textarea id="sp-message" rows={3} maxLength={800} value={fields.message} onChange={set("message")} disabled={sending} />
      </div>

      <div className="ik-hp" aria-hidden="true">
        <label htmlFor="sp-website">Website</label>
        <input id="sp-website" type="text" tabIndex={-1} autoComplete="off" value={fields.website} onChange={set("website")} />
      </div>

      {error && <p className="ik-error" role="alert">{error}</p>}

      <div className="ik-submit">
        <button type="submit" className="btn btn-solid" disabled={sending}>
          {sending ? "Sending…" : "Send sponsor inquiry"}
        </button>
        <p className="ik-status">We reply by email and confirm placements in writing.</p>
      </div>
    </form>
  );
}
