"use client";

import { useActionState, useState } from "react";
import { useFormStatus } from "react-dom";

import {
  REQUESTABLE_ROLES,
  SPONSOR_CHOICES,
  VOLUNTEER_JOBS,
  roleLabel,
} from "../../../lib/accounts";
import { requestRoleAction, withdrawRequestAction } from "../actions";

/* ------------------------------------------------------------------
   The contact form, gated.

   Sponsoring, mentoring and judging used to be "email Santos", then
   "ask in the Discord". Both lose things. This is the same
   conversation with an account behind it: one request per role, it
   can't be filed twice, and its status is visible to the person who
   sent it instead of vanishing into an inbox.
------------------------------------------------------------------ */

const PROMPTS = {
  sponsor: {
    lede: "What you'd want your name on, and roughly what you're thinking. The menu is itemised and the prices are published, so you can point at a line if you already know.",
    placeholder:
      "We'd want to fund the Saturday late-night block and put two engineers in the mentor rotation…",
    expertise: null,
  },
  mentor: {
    lede: "Saturday's 1:1 rotations. Teams book time with you and turn up with a specific problem, so the useful thing to tell us is what you can unblock.",
    placeholder: "Happy to take Saturday afternoon. I've shipped three B2B products in this space…",
    expertise: {
      label: "What can you help with?",
      hint: "Pricing, cold outbound, infra, design, fundraising, hiring — whatever teams should come to you for.",
      placeholder: "Paid acquisition and unit economics. Some React and Postgres.",
    },
  },
  judge: {
    lede: "Sunday's pitches. Five minutes each, live product on screen, scored against the four published criteria. You'll also present an award.",
    placeholder: "I've judged at two accelerators and I invest at pre-seed…",
    expertise: {
      label: "Your background",
      hint: "How you want to be introduced from stage, and what you'd be judging from — operator, investor, engineer.",
      placeholder: "Ten years in growth at two marketplaces. Angel investor since 2021.",
    },
  },
  volunteer: {
    lede: "A few hours makes the weekend work. Tell us which days you can be there and roughly when — we'll build the rota around what people actually offer.",
    placeholder: "Around all day Saturday, and Friday from about 6…",
    expertise: null,
  },
};

function Submit({ label }) {
  const { pending } = useFormStatus();
  return (
    <button type="submit" className="btn btn-solid ac-btn-sm" disabled={pending}>
      {pending ? "Sending…" : label}
    </button>
  );
}

export function RequestForm({ available, sponsorTier }) {
  const [state, action] = useActionState(requestRoleAction, {});
  const [role, setRole] = useState(available[0] ?? REQUESTABLE_ROLES[0]);
  const prompt = PROMPTS[role] ?? PROMPTS.mentor;

  return (
    <form action={action} className="ac-form">
      {state.error && (
        <p className="ac-error" role="alert">
          {state.error}
        </p>
      )}
      {state.ok && <p className="ac-ok">{state.ok}</p>}

      {available.length > 1 && (
        <fieldset className="ac-choices is-row">
          <legend className="ac-label">What are you offering?</legend>
          {available.map((r) => (
            <label key={r} className={`ac-tick${role === r ? " is-on" : ""}`}>
              <input
                type="radio"
                name="role"
                value={r}
                checked={role === r}
                onChange={() => setRole(r)}
              />
              {roleLabel(r)}
            </label>
          ))}
        </fieldset>
      )}
      {available.length === 1 && <input type="hidden" name="role" value={role} />}

      {role === "volunteer" && (
        <fieldset className="ac-choices">
          <legend className="ac-label">
            What can you cover? <span className="ac-req">required</span>
          </legend>
          <p className="ac-hint">
            Pick as many as you like. Each one says roughly what it asks of you, so nobody
            agrees to a job and then discovers it was the whole weekend.
          </p>
          {VOLUNTEER_JOBS.map((j) => (
            <label key={j.id} className="ac-choice">
              <input type="checkbox" name="jobs" value={j.id} />
              <span className="ac-choice-body">
                <strong>
                  {j.label} <span className="ac-opt">{j.hours}</span>
                </strong>
                <span>{j.blurb}</span>
              </span>
            </label>
          ))}
        </fieldset>
      )}

      <div className="ac-field">
        <label className="ac-label" htmlFor="message">
          {role === "volunteer" ? "When are you around?" : "What do you have in mind?"}{" "}
          <span className="ac-req">required</span>
        </label>
        <p className="ac-hint">{prompt.lede}</p>
        <textarea
          id="message"
          name="message"
          rows={5}
          required
          placeholder={prompt.placeholder}
        />
      </div>

      {prompt.expertise && (
        <div className="ac-field">
          <label className="ac-label" htmlFor="expertise">
            {prompt.expertise.label}
          </label>
          <p className="ac-hint">{prompt.expertise.hint}</p>
          <textarea
            id="expertise"
            name="expertise"
            rows={3}
            placeholder={prompt.expertise.placeholder}
          />
        </div>
      )}

      {role === "sponsor" && (
        <div className="ac-field">
          <label className="ac-label" htmlFor="sponsor_tier">
            Package you&apos;re looking at
          </label>
          <p className="ac-hint">
            Not a commitment — it tells us which conversation to have. The full menu is on the{" "}
            <a href="/hackathon/sponsor" target="_blank" rel="noreferrer">
              sponsorship page
            </a>
            .
          </p>
          <select id="sponsor_tier" name="sponsor_tier" defaultValue={sponsorTier || "undecided"}>
            {SPONSOR_CHOICES.map((c) => (
              <option key={c.id} value={c.id}>
                {c.label}
              </option>
            ))}
          </select>
        </div>
      )}

      <div className="ac-actions">
        <Submit label={`Send the ${roleLabel(role).toLowerCase()} request`} />
        <span className="ac-fine">Goes straight to Santos. He answers every one himself.</span>
      </div>
    </form>
  );
}

export function WithdrawForm({ id }) {
  const [state, action] = useActionState(withdrawRequestAction, {});
  return (
    <>
      <form action={action} className="ac-inline-form">
        <input type="hidden" name="request_id" value={id} />
        <button type="submit" className="ac-btn-link ac-btn-danger">
          Withdraw
        </button>
      </form>
      {state.error && <span className="ac-fine">{state.error}</span>}
    </>
  );
}
