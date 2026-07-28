"use client";

import { useActionState } from "react";
import { useFormStatus } from "react-dom";

import {
  createTeamAction,
  joinTeamAction,
  removeMemberAction,
  updateTeamAction,
} from "../actions";

/* The four things you can do to a team. Each one is its own action
   with its own state, so a failed join doesn't wipe what you typed
   into the create box next to it. */

function Submit({ label, busy, ghost }) {
  const { pending } = useFormStatus();
  return (
    <button
      type="submit"
      className={`btn ${ghost ? "btn-ghost" : "btn-solid"} ac-btn-sm`}
      disabled={pending}
    >
      {pending ? busy : label}
    </button>
  );
}

function Feedback({ state }) {
  if (state.error) {
    return (
      <p className="ac-error" role="alert">
        {state.error}
      </p>
    );
  }
  if (state.ok) return <p className="ac-ok">{state.ok}</p>;
  return null;
}

export function CreateTeamForm() {
  const [state, action] = useActionState(createTeamAction, {});
  return (
    <form action={action} className="ac-form is-tight">
      <Feedback state={state} />
      <div className="ac-field">
        <label className="ac-label" htmlFor="team-name">
          Team name
        </label>
        <p className="ac-hint">
          This goes on the certificate and the results page. Your own name is a fine team
          name if you&apos;re solo.
        </p>
        <input id="team-name" name="name" type="text" required maxLength={80} />
      </div>
      <div className="ac-actions">
        <Submit label="Create the team" busy="Creating…" />
      </div>
    </form>
  );
}

export function JoinTeamForm() {
  const [state, action] = useActionState(joinTeamAction, {});
  return (
    <form action={action} className="ac-form is-tight">
      <Feedback state={state} />
      <div className="ac-field">
        <label className="ac-label" htmlFor="team-code">
          Invite code
        </label>
        <p className="ac-hint">Eight characters, from whoever made the team.</p>
        <input
          id="team-code"
          name="code"
          type="text"
          required
          maxLength={12}
          autoCapitalize="characters"
          spellCheck={false}
          className="ac-mono"
          placeholder="K3F9QA7X"
        />
      </div>
      <div className="ac-actions">
        <Submit label="Join" busy="Joining…" ghost />
      </div>
    </form>
  );
}

export function TeamDetailsForm({ name, tagline }) {
  const [state, action] = useActionState(updateTeamAction, {});
  return (
    <form action={action} className="ac-form is-tight">
      <Feedback state={state} />
      <div className="ac-field">
        <label className="ac-label" htmlFor="rename">
          Team name
        </label>
        <input id="rename" name="name" type="text" defaultValue={name} maxLength={80} required />
      </div>
      <div className="ac-field">
        <label className="ac-label" htmlFor="tagline">
          Tagline <span className="ac-opt">optional</span>
        </label>
        <p className="ac-hint">One line, on the results page next to your project.</p>
        <input
          id="tagline"
          name="tagline"
          type="text"
          defaultValue={tagline}
          maxLength={160}
          placeholder="Rewards infrastructure for game communities."
        />
      </div>
      <div className="ac-actions">
        <Submit label="Save" busy="Saving…" ghost />
      </div>
    </form>
  );
}

export function RemoveMemberForm({ memberId, label }) {
  const [state, action] = useActionState(removeMemberAction, {});
  return (
    <>
      <form action={action} className="ac-inline-form">
        <input type="hidden" name="member_id" value={memberId} />
        <button type="submit" className="ac-btn-link ac-btn-danger">
          {label}
        </button>
      </form>
      {state.error && (
        <span className="ac-fine" style={{ color: "#ff9d9d" }}>
          {state.error}
        </span>
      )}
    </>
  );
}
