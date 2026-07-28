"use client";

import { Check, Save } from "lucide-react";
import { useActionState } from "react";
import { useFormStatus } from "react-dom";

import { setOpsSettingAction } from "./actions";

function Submit({ children, icon: Icon = Save }) {
  const { pending } = useFormStatus();
  return (
    <button type="submit" className="ac-btn-link ac-btn-sm" disabled={pending}>
      <Icon size={18} strokeWidth={1.75} aria-hidden="true" />
      {pending ? "Saving…" : children}
    </button>
  );
}

export default function SettingsForm({ settingKey, value }) {
  const [state, action] = useActionState(setOpsSettingAction, {});

  return (
    <form action={action} className="ac-form is-tight">
      <input type="hidden" name="key" value={settingKey} />
      <input type="hidden" name="value" value={value ? "false" : "true"} />
      {state.error && <p className="ac-error" role="alert">{state.error}</p>}
      {state.ok && <p className="ac-ok">{state.ok}</p>}
      <Submit icon={value ? Save : Check}>{value ? "Turn off" : "Turn on"}</Submit>
    </form>
  );
}
