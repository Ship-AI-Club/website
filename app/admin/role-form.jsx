/* Why: make direct role changes small, explicit and protected by the existing server actions. */

"use client";

import { useToastActionState } from "../../components/toast-provider";

import { useFormStatus } from "react-dom";

import { ROLE_IDS, roleLabel } from "../../lib/accounts";
import { grantRoleAction, revokeRoleAction } from "./actions";

function Submit({ label, pendingLabel, ghost = false }) {
  const { pending } = useFormStatus();

  return (
    <button
      type="submit"
      className={ghost ? "btn btn-ghost ac-btn-sm" : "btn btn-solid ac-btn-sm"}
      disabled={pending}
    >
      {pending ? pendingLabel : label}
    </button>
  );
}

export function GrantRoleForm({ userId }) {
  const [state, action] = useToastActionState(grantRoleAction, {});
  const selectId = `grant-role-${userId}`;

  return (
    <form action={action} className="ac-form is-tight">
      <input type="hidden" name="user_id" value={userId} />

      <div className="ac-field">
        <label className="ac-label" htmlFor={selectId}>
          Grant role
        </label>
        <select id={selectId} name="role" defaultValue="" required>
          <option value="">Select role</option>
          {ROLE_IDS.map((id) => (
            <option key={id} value={id}>
              {roleLabel(id)}
            </option>
          ))}
        </select>
      </div>

      <div className="ac-actions">
        <Submit label="Grant role" pendingLabel="Granting role…" />
      </div>
    </form>
  );
}

export function RevokeRoleForm({ userId, role }) {
  const [state, action] = useToastActionState(revokeRoleAction, {});
  const label = `Remove ${roleLabel(role)}`;

  return (
    <form action={action} className="ac-form is-tight">
      <input type="hidden" name="user_id" value={userId} />
      <input type="hidden" name="role" value={role} />
      <Submit label={label} pendingLabel={`Removing ${roleLabel(role)}…`} ghost />
    </form>
  );
}
