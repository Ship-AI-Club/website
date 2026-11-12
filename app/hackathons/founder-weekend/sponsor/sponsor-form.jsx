"use client";

import { useState } from "react";
import { CheckCircle2 } from "lucide-react";

import "../../../forms.css";

const EMPTY = { name: "", email: "", company: "", site: "", message: "", website: "" };

export default function SponsorForm({ tiers, initial }) {
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
      <div className="ik-done">
        <CheckCircle2 size={22} strokeWidth={1.75} aria-hidden="true" />
        <h2>Thanks. We&apos;ll be in touch.</h2>
        <p>We&apos;ll reply by email to confirm the package and placements in writing.</p>
      </div>
    );
  }

  return (
    <form className="ik-form ef-form" onSubmit={send} noValidate>
      <fieldset className="ef-pk">
        <legend className="sr-only">Package</legend>
        <div className="ef-pk-row">
          {tiers.map((t) => (
            <label key={t.id} className={`ef-pk-opt${pick === t.id ? " is-on" : ""}`}>
              <input className="sr-only" type="radio" name="package" value={t.id} checked={pick === t.id} onChange={() => setPick(t.id)} disabled={sending} />
              <span className="ev-label">{t.name}{" · "}{t.slots}</span>
              <span className="ef-pk-sel" aria-hidden="true">{pick === t.id ? "Selected" : "Select"}</span>
              <b>${t.price.toLocaleString("en-US")}</b>
              <ul>{t.perks.map((perk) => <li key={perk}>{perk}</li>)}</ul>
            </label>
          ))}
        </div>
        <label className={`ef-pk-unsure${pick === "undecided" ? " is-on" : ""}`}>
          <input type="radio" name="package" value="undecided" checked={pick === "undecided"} onChange={() => setPick("undecided")} disabled={sending} />
          Not sure yet
        </label>
      </fieldset>

      <div className="ef-fields">
      <div className="ef-pair">
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

      <div className="ef-pair">
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
      </div>
      </div>
    </form>
  );
}
