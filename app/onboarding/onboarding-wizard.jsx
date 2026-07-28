"use client";

import { useActionState, useState } from "react";
import { useFormStatus } from "react-dom";
import { ArrowLeft, ArrowRight, Check } from "lucide-react";

import {
  BUILDER_GOALS,
  COMMUNITY_GOALS,
  INTERESTS,
  SPONSOR_CHOICES,
  suggestHandle,
} from "../../lib/accounts";
import { DISCORD } from "../../lib/hackathon";
import ImageUpload from "../../components/image-upload";
import { saveStepAction } from "./actions";

/* ------------------------------------------------------------------
   Four questions, one at a time.

   The old version was one long scroll that asked a prospective
   sponsor whether they wanted an elevator pitch. This asks who you
   are, then lets you fill in a profile, then what you're here for —
   and only then the follow-ups those answers actually earned.

   Step order is owned by the server: the action returns the step to
   render, having already saved the one before it. A refresh resumes
   rather than restarts, and the browser never holds four screens of
   unsaved answers.
------------------------------------------------------------------ */

const TITLES = {
  identity: ["Start here", "What should we call you?"],
  profile: ["Your profile", "Anything you want on your name badge."],
  interests: ["What brings you here?", "Pick as many as apply."],
  details: ["Almost done", "The last few, based on what you picked."],
  done: ["You're in", "One more thing."],
};

const ORDER = ["identity", "profile", "interests", "details"];

function Next({ label = "Continue", done }) {
  const { pending } = useFormStatus();
  return (
    <button type="submit" className="btn btn-solid" disabled={pending}>
      {pending ? "Saving…" : label}
      {!pending && !done && (
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

function Back() {
  const { pending } = useFormStatus();
  return (
    <button
      type="submit"
      name="intent"
      value="back"
      className="ac-btn-link"
      disabled={pending}
      formNoValidate
    >
      <ArrowLeft
        size={13}
        strokeWidth={1.75}
        aria-hidden="true"
        style={{ marginRight: ".3rem", verticalAlign: "-1px" }}
      />
      Back
    </button>
  );
}

function Progress({ step }) {
  const at = ORDER.indexOf(step);
  if (at < 0) return null;
  return (
    <ol className="ac-steps" aria-label="Progress">
      {ORDER.map((name, i) => (
        <li
          key={name}
          className={i < at ? "is-done" : i === at ? "is-on" : undefined}
          aria-current={i === at ? "step" : undefined}
        >
          <span>{i < at ? <Check size={12} strokeWidth={2.5} aria-hidden="true" /> : i + 1}</span>
        </li>
      ))}
    </ol>
  );
}

export default function OnboardingWizard({ user, next }) {
  const [state, action] = useActionState(saveStepAction, {
    step: user.onboarded_at ? "profile" : "identity",
    next,
  });

  const step = state.step ?? "identity";
  const [name, setName] = useState(state.name ?? user.name ?? "");
  const [handle, setHandle] = useState(user.handle ?? "");
  const [handleTouched, setHandleTouched] = useState(Boolean(user.handle));
  const [interests, setInterests] = useState(() => new Set(user.interests ?? []));
  const [goals, setGoals] = useState(() => new Set(user.goals ?? []));

  const chosen = state.interests ? new Set(state.interests) : interests;
  const competing = chosen.has("participating");
  const sponsoring = chosen.has("sponsoring");
  const advising = chosen.has("mentoring") || chosen.has("judging");

  const toggle = (setter) => (value, on) =>
    setter((prev) => {
      const copy = new Set(prev);
      if (on) copy.add(value);
      else copy.delete(value);
      return copy;
    });

  const [kicker, heading] = TITLES[step] ?? TITLES.identity;

  /* ---------- the finish screen ---------- */

  if (step === "done") {
    return (
      <>
        <p className="ac-kicker">{kicker}</p>
        <h1>{heading}</h1>
        <p className="ac-lede">
          Your account is set up. The Discord is where the program actually happens between
          sessions — teammates get found there, questions get answered there, and the
          weekend&apos;s logistics go out there first.
        </p>

        <div className="ac-card is-accent">
          <h2>Join the Discord</h2>
          <p>
            It&apos;s the primary room for Ship AI. Introduce yourself in #introductions and
            say what you&apos;re building — that one message is how most teams form.
          </p>
          <div className="ac-actions">
            <a className="btn btn-solid" href={DISCORD} target="_blank" rel="noreferrer">
              Join the Discord
            </a>
            <form action={action} className="ac-inline-form">
              <input type="hidden" name="step" value="done" />
              <input type="hidden" name="next" value={next} />
              <button type="submit" className="btn btn-ghost">
                Go to my dashboard
              </button>
            </form>
          </div>
        </div>
      </>
    );
  }

  return (
    <>
      <Progress step={step} />
      <p className="ac-kicker">{kicker}</p>
      <h1>{heading}</h1>

      <form action={action} className="ac-form">
        <input type="hidden" name="step" value={step} />
        <input type="hidden" name="next" value={next} />

        {state.error && (
          <p className="ac-error" role="alert">
            {state.error}
          </p>
        )}

        {/* ---------- 1. identity ---------- */}

        {step === "identity" && (
          <>
            <div className="ac-field">
              <label className="ac-label" htmlFor="name">
                Display name <span className="ac-req">required</span>
              </label>
              <p className="ac-hint">
                As it should read on a certificate, a name badge and the site.
              </p>
              <input
                id="name"
                name="name"
                type="text"
                autoComplete="name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
                autoFocus
              />
            </div>

            <div className="ac-field">
              <label className="ac-label" htmlFor="handle">
                Handle <span className="ac-req">required</span>
              </label>
              <p className="ac-hint">
                Your short name in the club — on the attendee list and next to your team.
                Lowercase letters, numbers, hyphen or underscore.
              </p>
              <div className="ac-prefixed">
                <span aria-hidden="true">@</span>
                <input
                  id="handle"
                  name="handle"
                  type="text"
                  autoCapitalize="none"
                  autoCorrect="off"
                  spellCheck={false}
                  value={handleTouched ? handle : suggestHandle(name)}
                  onChange={(e) => {
                    setHandleTouched(true);
                    setHandle(e.target.value);
                  }}
                  required
                />
              </div>
            </div>

            <div className="ac-actions">
              <Next />
            </div>
          </>
        )}

        {/* ---------- 2. profile ---------- */}

        {step === "profile" && (
          <>
            <p className="ac-hint" style={{ marginTop: "-.5rem" }}>
              All optional — skip the lot if you like. It fills in your card on the attendee
              list and how you&apos;re introduced if you end up on stage.
            </p>

            <ImageUpload
              kind="avatar"
              ownerId={user.id}
              currentUrl={user.avatar_url}
              name={name || user.name}
            />

            <div className="ac-row">
              <div className="ac-field">
                <label className="ac-label" htmlFor="title">
                  Title <span className="ac-opt">optional</span>
                </label>
                <input id="title" name="title" type="text" defaultValue={user.title} />
              </div>
              <div className="ac-field">
                <label className="ac-label" htmlFor="company">
                  Company <span className="ac-opt">optional</span>
                </label>
                <input id="company" name="company" type="text" defaultValue={user.company} />
              </div>
            </div>

            <div className="ac-field">
              <label className="ac-label" htmlFor="bio">
                Short bio <span className="ac-opt">optional</span>
              </label>
              <p className="ac-hint">Two sentences. What you build and what you know.</p>
              <textarea id="bio" name="bio" rows={3} defaultValue={user.bio} />
            </div>

            <div className="ac-row">
              <div className="ac-field">
                <label className="ac-label" htmlFor="website">
                  Website <span className="ac-opt">optional</span>
                </label>
                <input
                  id="website"
                  name="website"
                  type="text"
                  inputMode="url"
                  placeholder="https://"
                  defaultValue={user.website}
                />
              </div>
              <div className="ac-field">
                <label className="ac-label" htmlFor="phone">
                  Phone <span className="ac-opt">optional</span>
                </label>
                <p className="ac-hint">Only used for day-of logistics. Never published.</p>
                <input
                  id="phone"
                  name="phone"
                  type="tel"
                  inputMode="tel"
                  autoComplete="tel"
                  defaultValue={user.phone}
                />
              </div>
            </div>

            <fieldset className="ac-choices">
              <legend className="ac-label">
                Socials <span className="ac-opt">optional</span>
              </legend>
              <div className="ac-row">
                {[
                  ["discord", "Discord"],
                  ["github", "GitHub"],
                  ["x_handle", "X"],
                  ["linkedin", "LinkedIn"],
                ].map(([key, label]) => (
                  <div key={key} className="ac-field">
                    <label className="ac-label" htmlFor={key}>
                      {label}
                    </label>
                    <input
                      id={key}
                      name={key}
                      type="text"
                      autoCapitalize="none"
                      spellCheck={false}
                      defaultValue={user[key] ?? ""}
                    />
                  </div>
                ))}
              </div>
            </fieldset>

            <label className={`ac-choice${user.public_profile !== false ? " is-on" : ""}`}>
              <input
                type="checkbox"
                name="public_profile"
                defaultChecked={user.public_profile !== false}
              />
              <span className="ac-choice-body">
                <strong>Show me on the public attendee list</strong>
                <span>
                  Your name, photo and title appear on the hackathon page so people can see
                  who&apos;s coming. Your email and phone never do. Change it any time.
                </span>
              </span>
            </label>

            <div className="ac-actions">
              <Next />
              <Back />
            </div>
          </>
        )}

        {/* ---------- 3. interests ---------- */}

        {step === "interests" && (
          <>
            <p className="ac-hint" style={{ marginTop: "-.5rem" }}>
              This is what you&apos;re interested in — sponsoring, mentoring and judging still
              get confirmed by a human afterwards.
            </p>

            <fieldset className="ac-choices">
              <legend className="ac-label sr-legend">What brings you here?</legend>
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

            <div className="ac-actions">
              <Next />
              <Back />
            </div>
          </>
        )}

        {/* ---------- 4. the follow-ups ---------- */}

        {step === "details" && (
          <>
            {sponsoring && (
              <fieldset className="ac-choices">
                <legend className="ac-label">Which package are you looking at?</legend>
                <p className="ac-hint">
                  Not a commitment — it tells us which conversation to have. The itemised menu
                  is on the{" "}
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
                      defaultChecked={user.sponsor_tier === c.id}
                    />
                    <span className="ac-choice-body">
                      <strong>{c.label}</strong>
                      <span>{c.blurb}</span>
                    </span>
                  </label>
                ))}
              </fieldset>
            )}

            {advising && (
              <div className="ac-field">
                <label className="ac-label" htmlFor="expertise">
                  What can you help with?
                </label>
                <p className="ac-hint">
                  Pricing, cold outbound, infra, design, fundraising, hiring — whatever teams
                  should come to you for.
                </p>
                <textarea id="expertise" name="expertise" rows={3} defaultValue={user.bio} />
              </div>
            )}

            <fieldset className="ac-choices">
              <legend className="ac-label">What do you want out of this?</legend>
              <p className="ac-hint">
                {competing
                  ? "The first six are exactly what the program promises you leave with by Sunday afternoon."
                  : "Pick whatever's true. It shapes who we introduce you to."}
              </p>

              {competing && (
                <>
                  <p className="ac-menu-group" style={{ margin: "0 0 .1rem" }}>
                    What you leave with
                  </p>
                  <div className="ac-choices is-row">
                    {BUILDER_GOALS.map((g) => (
                      <label
                        key={g.id}
                        className={`ac-tick${goals.has(g.id) ? " is-on" : ""}`}
                      >
                        <input
                          type="checkbox"
                          name="goals"
                          value={g.id}
                          checked={goals.has(g.id)}
                          onChange={(e) => toggle(setGoals)(g.id, e.target.checked)}
                        />
                        {g.label}
                      </label>
                    ))}
                  </div>
                </>
              )}

              <p
                className="ac-menu-group"
                style={{ margin: competing ? "1rem 0 .1rem" : "0 0 .1rem" }}
              >
                {competing ? "And beyond the build" : "What you're after"}
              </p>
              <div className="ac-choices is-row">
                {COMMUNITY_GOALS.map((g) => (
                  <label key={g.id} className={`ac-tick${goals.has(g.id) ? " is-on" : ""}`}>
                    <input
                      type="checkbox"
                      name="goals"
                      value={g.id}
                      checked={goals.has(g.id)}
                      onChange={(e) => toggle(setGoals)(g.id, e.target.checked)}
                    />
                    {g.label}
                  </label>
                ))}
              </div>
            </fieldset>

            <div className="ac-field">
              <label className="ac-label" htmlFor="goal_note">
                In your own words <span className="ac-opt">optional</span>
              </label>
              <p className="ac-hint">
                What does a good outcome look like for you? Santos reads these.
              </p>
              <textarea
                id="goal_note"
                name="goal_note"
                rows={4}
                defaultValue={user.goal_note}
                placeholder="I've had this thing built for eight months and never launched it…"
              />
            </div>

            <div className="ac-actions">
              <Next label="Finish" done />
              <Back />
            </div>
          </>
        )}
      </form>
    </>
  );
}
