"use client";

import { useFormStatus } from "react-dom";
import { useToastActionState } from "../../../components/toast-provider";
import { createFounderTeamAction, joinFounderTeamAction } from "./actions";

function Submit({ label, busy, ghost }) {
  const { pending } = useFormStatus();
  return (
    <button type="submit" className={`btn ${ghost ? "btn-ghost" : "btn-solid"} ac-btn-sm`} disabled={pending}>
      {pending ? busy : label}
    </button>
  );
}

export function CreateTeamForm() {
  const [, action] = useToastActionState(createFounderTeamAction, {});
  return (
    <form action={action} className="ac-form is-tight">
      <div className="ac-field">
        <label className="ac-label" htmlFor="fw-team-name">Team name</label>
        <p className="ac-hint">Use your company name. Team names are listed publicly on the event page.</p>
        <input id="fw-team-name" name="name" type="text" required maxLength={80} />
      </div>
      <div className="ac-actions">
        <Submit label="Register the team" busy="Registering…" />
      </div>
    </form>
  );
}

export function JoinTeamForm() {
  const [, action] = useToastActionState(joinFounderTeamAction, {});
  return (
    <form action={action} className="ac-form is-tight">
      <div className="ac-field">
        <label className="ac-label" htmlFor="fw-team-code">Invite code</label>
        <p className="ac-hint">Eight characters, from whoever registered the team.</p>
        <input
          id="fw-team-code"
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
        <Submit label="Join the team" busy="Joining…" ghost />
      </div>
    </form>
  );
}
