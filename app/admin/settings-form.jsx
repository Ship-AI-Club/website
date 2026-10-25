/* Make each runtime switch a small, server-checked action. */

"use client";

import { useToastActionState } from "../../components/toast-provider";

import { useFormStatus } from "react-dom";

import { setSettingAction } from "./actions";

function Submit({ enabled }) {
  const { pending } = useFormStatus();

  return (
    <button type="submit" className="btn btn-ghost ac-btn-sm" disabled={pending}>
      {pending ? "Saving…" : enabled ? "Turn off" : "Turn on"}
    </button>
  );
}

export default function SettingsForm({ settingKey, value }) {
  const [state, action] = useToastActionState(setSettingAction, {});

  return (
    <form action={action} className="ac-form is-tight">
      <input type="hidden" name="key" value={settingKey} />
      <input type="hidden" name="value" value={value ? "false" : "true"} />

      <Submit enabled={value} />
    </form>
  );
}
