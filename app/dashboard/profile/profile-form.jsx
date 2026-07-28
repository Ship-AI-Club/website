"use client";

import { useActionState, useState } from "react";
import { useFormStatus } from "react-dom";

import {
  BUILDER_GOALS,
  COMMUNITY_GOALS,
  INTERESTS,
  SPONSOR_CHOICES,
} from "../../../lib/accounts";
import { updateProfileAction } from "../actions";

/* Everything from onboarding, plus the handles that go next to your
   name if you end up on the site. Same conditional shape: the sponsor
   tier only appears if you say you're interested in sponsoring. */

function Submit() {
  const { pending } = useFormStatus();
  return (
    <button type="submit" className="btn btn-solid" disabled={pending}>
      {pending ? "Saving…" : "Save"}
    </button>
  );
}

export default function ProfileForm({ user }) {
  const [state, action] = useActionState(updateProfileAction, {});
  const [interests, setInterests] = useState(() => new Set(user.interests ?? []));
  const [goals, setGoals] = useState(() => new Set(user.goals ?? []));

  const toggle = (setter) => (value, on) =>
    setter((prev) => {
      const copy = new Set(prev);
      if (on) copy.add(value);
      else copy.delete(value);
      return copy;
    });

  const competing = interests.has("participating");

  return (
    <form action={action} className="ac-form">
      {state.error && (
        <p className="ac-error" role="alert">
          {state.error}
        </p>
      )}
      {state.ok && <p className="ac-ok">{state.ok}</p>}

      <div className="ac-row">
        <div className="ac-field">
          <label className="ac-label" htmlFor="name">
            Name <span className="ac-req">required</span>
          </label>
          <input id="name" name="name" type="text" defaultValue={user.name} required />
        </div>
        <div className="ac-field">
          <label className="ac-label" htmlFor="pronouns">
            Pronouns
          </label>
          <input id="pronouns" name="pronouns" type="text" defaultValue={user.pronouns} />
        </div>
      </div>

      <div className="ac-row">
        <div className="ac-field">
          <label className="ac-label" htmlFor="title">
            Title
          </label>
          <input id="title" name="title" type="text" defaultValue={user.title} />
        </div>
        <div className="ac-field">
          <label className="ac-label" htmlFor="company">
            Company
          </label>
          <input id="company" name="company" type="text" defaultValue={user.company} />
        </div>
      </div>

      <div className="ac-field">
        <label className="ac-label" htmlFor="bio">
          Short bio
        </label>
        <p className="ac-hint">
          Used if you end up listed on the site as a mentor, judge or sponsor. Two sentences.
        </p>
        <textarea id="bio" name="bio" rows={3} defaultValue={user.bio} />
      </div>

      <div className="ac-row">
        <div className="ac-field">
          <label className="ac-label" htmlFor="discord">
            Discord
          </label>
          <input id="discord" name="discord" type="text" defaultValue={user.discord} />
        </div>
        <div className="ac-field">
          <label className="ac-label" htmlFor="github">
            GitHub
          </label>
          <input id="github" name="github" type="text" defaultValue={user.github} />
        </div>
        <div className="ac-field">
          <label className="ac-label" htmlFor="x_handle">
            X
          </label>
          <input id="x_handle" name="x_handle" type="text" defaultValue={user.x_handle} />
        </div>
      </div>

      <div className="ac-field">
        <label className="ac-label" htmlFor="website">
          Website
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

      <hr className="ac-divider" />

      <fieldset className="ac-choices">
        <legend className="ac-label">What brings you here?</legend>
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

      {interests.has("sponsoring") && (
        <div className="ac-field">
          <label className="ac-label" htmlFor="sponsor_tier">
            Package you&apos;re looking at
          </label>
          <select id="sponsor_tier" name="sponsor_tier" defaultValue={user.sponsor_tier || ""}>
            <option value="">No preference</option>
            {SPONSOR_CHOICES.map((c) => (
              <option key={c.id} value={c.id}>
                {c.label}
              </option>
            ))}
          </select>
        </div>
      )}

      <fieldset className="ac-choices">
        <legend className="ac-label">What you want out of it</legend>
        <div className="ac-choices is-row">
          {[...(competing ? BUILDER_GOALS : []), ...COMMUNITY_GOALS].map((g) => {
            const on = goals.has(g.id);
            return (
              <label key={g.id} className={`ac-tick${on ? " is-on" : ""}`}>
                <input
                  type="checkbox"
                  name="goals"
                  value={g.id}
                  checked={on}
                  onChange={(e) => toggle(setGoals)(g.id, e.target.checked)}
                />
                {g.label}
              </label>
            );
          })}
        </div>
      </fieldset>

      <div className="ac-field">
        <label className="ac-label" htmlFor="goal_note">
          In your own words
        </label>
        <textarea id="goal_note" name="goal_note" rows={4} defaultValue={user.goal_note} />
      </div>

      <div className="ac-actions">
        <Submit />
      </div>
    </form>
  );
}
