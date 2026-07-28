"use client";

import { useActionState, useState } from "react";
import { useFormStatus } from "react-dom";
import { ArrowRight } from "lucide-react";

import {
  BUILDER_GOALS,
  COMMUNITY_GOALS,
  INTERESTS,
  SPONSOR_CHOICES,
} from "../../lib/accounts";
import { saveOnboardingAction } from "./actions";

/* ------------------------------------------------------------------
   Four questions: who you are, what you're here for, what you want
   out of it, and — if you said sponsoring — which package.

   The form grows as you answer it. Tick "participating" and the six
   deliverables from /hackathon appear as goals; tick "sponsoring" and
   the tier list appears. Nobody is asked whether they want an
   elevator pitch when they came to write a cheque.
------------------------------------------------------------------ */

function Submit() {
  const { pending } = useFormStatus();
  return (
    <button type="submit" className="btn btn-solid" disabled={pending}>
      {pending ? "Saving…" : "Finish"}
      {!pending && (
        <ArrowRight
          size={15}
          strokeWidth={1.75}
          aria-hidden="true"
          style={{ marginLeft: ".4rem", verticalAlign: "-2px" }}
        />
      )}
    </button>
  );
}

function Tick({ name, value, label, checked, onChange }) {
  return (
    <label className={`ac-tick${checked ? " is-on" : ""}`}>
      <input
        type="checkbox"
        name={name}
        value={value}
        checked={checked}
        onChange={(e) => onChange(value, e.target.checked)}
      />
      {label}
    </label>
  );
}

export default function OnboardingForm({ user, next }) {
  const [state, action] = useActionState(saveOnboardingAction, {});

  const [interests, setInterests] = useState(
    () => new Set(state.interests ?? user.interests ?? []),
  );
  const [goals, setGoals] = useState(() => new Set(state.goals ?? user.goals ?? []));

  const toggle = (setter) => (value, on) =>
    setter((prev) => {
      const copy = new Set(prev);
      if (on) copy.add(value);
      else copy.delete(value);
      return copy;
    });

  const competing = interests.has("participating");
  const sponsoring = interests.has("sponsoring");
  /* Company and preferred title matter for anyone whose name ends up
     on the site — a sponsor's logo lockup, a judge's bio line. */
  const publicFacing = sponsoring || interests.has("mentoring") || interests.has("judging");

  return (
    <form action={action} className="ac-form">
      <input type="hidden" name="next" value={next} />

      {state.error && (
        <p className="ac-error" role="alert">
          {state.error}
        </p>
      )}

      {/* ---------- who ---------- */}

      <div className="ac-field">
        <label className="ac-label" htmlFor="name">
          Your name <span className="ac-req">required</span>
        </label>
        <p className="ac-hint">
          As it should read on a certificate, a name badge and the site.
        </p>
        <input
          id="name"
          name="name"
          type="text"
          autoComplete="name"
          defaultValue={state.name ?? user.name ?? ""}
          required
          autoFocus
        />
      </div>

      <div className="ac-row">
        <div className="ac-field">
          <label className="ac-label" htmlFor="pronouns">
            Pronouns <span className="ac-opt">optional</span>
          </label>
          <input
            id="pronouns"
            name="pronouns"
            type="text"
            placeholder="they/them"
            defaultValue={state.pronouns ?? user.pronouns ?? ""}
          />
        </div>
        <div className="ac-field">
          <label className="ac-label" htmlFor="discord">
            Discord handle <span className="ac-opt">optional</span>
          </label>
          <input
            id="discord"
            name="discord"
            type="text"
            placeholder="yourhandle"
            defaultValue={state.discord ?? user.discord ?? ""}
          />
        </div>
      </div>

      {/* ---------- what for ---------- */}

      <fieldset className="ac-choices">
        <legend className="ac-label">
          What brings you here? <span className="ac-req">required</span>
        </legend>
        <p className="ac-hint">
          Pick as many as apply. This is what you&apos;re interested in — sponsoring,
          mentoring and judging still get confirmed by a human afterwards.
        </p>
        {INTERESTS.map((i) => {
          const on = interests.has(i.id);
          return (
            <label key={i.id} className={`ac-choice${on ? " is-on" : ""}`}>
              <input
                type="checkbox"
                name="interests"
                value={i.id}
                checked={on}
                onChange={(e) => toggle(setInterests)(i.id, e.target.checked)}
              />
              <span className="ac-choice-body">
                <strong>{i.label}</strong>
                <span>{i.blurb}</span>
              </span>
            </label>
          );
        })}
      </fieldset>

      {/* ---------- sponsorship ---------- */}

      {sponsoring && (
        <fieldset className="ac-choices">
          <legend className="ac-label">Which package are you looking at?</legend>
          <p className="ac-hint">
            Nothing here is a commitment — it tells us which conversation to have. The full
            itemised menu, with what each line funds, is on the{" "}
            <a href="/hackathon/sponsor" target="_blank" rel="noreferrer">
              sponsorship page
            </a>
            .
          </p>
          {SPONSOR_CHOICES.map((c) => (
            <label key={c.id} className="ac-choice">
              <input
                type="radio"
                name="sponsor_tier"
                value={c.id}
                defaultChecked={(state.sponsorTier ?? user.sponsor_tier) === c.id}
              />
              <span className="ac-choice-body">
                <strong>{c.label}</strong>
                <span>{c.blurb}</span>
              </span>
            </label>
          ))}
        </fieldset>
      )}

      {publicFacing && (
        <div className="ac-row">
          <div className="ac-field">
            <label className="ac-label" htmlFor="company">
              Company <span className="ac-opt">optional</span>
            </label>
            <input
              id="company"
              name="company"
              type="text"
              defaultValue={state.company ?? user.company ?? ""}
            />
          </div>
          <div className="ac-field">
            <label className="ac-label" htmlFor="title">
              Preferred title <span className="ac-opt">optional</span>
            </label>
            <p className="ac-hint">How you want to be introduced from stage.</p>
            <input
              id="title"
              name="title"
              type="text"
              defaultValue={state.title ?? user.title ?? ""}
            />
          </div>
        </div>
      )}

      {/* ---------- outcomes ---------- */}

      <fieldset className="ac-choices">
        <legend className="ac-label">What do you want out of this?</legend>
        <p className="ac-hint">
          {competing
            ? "The first six are exactly what the program promises you leave with by Sunday afternoon. Pick the ones you actually care about — it shapes what we point you at."
            : "Pick whatever's true. It shapes who we introduce you to."}
        </p>

        {competing && (
          <>
            <p className="ac-menu-group" style={{ margin: "0 0 .1rem" }}>
              What you leave with
            </p>
            <div className="ac-choices is-row">
              {BUILDER_GOALS.map((g) => (
                <Tick
                  key={g.id}
                  name="goals"
                  value={g.id}
                  label={g.label}
                  checked={goals.has(g.id)}
                  onChange={toggle(setGoals)}
                />
              ))}
            </div>
          </>
        )}

        <p className="ac-menu-group" style={{ margin: competing ? "1rem 0 .1rem" : "0 0 .1rem" }}>
          {competing ? "And beyond the build" : "What you're after"}
        </p>
        <div className="ac-choices is-row">
          {COMMUNITY_GOALS.map((g) => (
            <Tick
              key={g.id}
              name="goals"
              value={g.id}
              label={g.label}
              checked={goals.has(g.id)}
              onChange={toggle(setGoals)}
            />
          ))}
        </div>
      </fieldset>

      <div className="ac-field">
        <label className="ac-label" htmlFor="goal_note">
          In your own words <span className="ac-opt">optional</span>
        </label>
        <p className="ac-hint">
          What does a good outcome look like for you? Santos reads these — it&apos;s how the
          sessions get pointed at what the room actually needs.
        </p>
        <textarea
          id="goal_note"
          name="goal_note"
          rows={4}
          defaultValue={state.goalNote ?? user.goal_note ?? ""}
          placeholder="I've had this thing built for eight months and never launched it…"
        />
      </div>

      <div className="ac-actions">
        <Submit />
        <span className="ac-fine">You can change any of this later.</span>
      </div>
    </form>
  );
}
