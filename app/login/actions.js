"use server";

import { redirect } from "next/navigation";

import {
  requestLoginCode,
  verifyLoginCode,
  endSession,
  currentUser,
  pruneExpired,
} from "../../lib/auth";
import { isEmail, normalizeEmail, text } from "../../lib/accounts";
import { safeNext } from "../../lib/nav";

/* ------------------------------------------------------------------
   Sign in.

   One action drives both steps so the form is a single useActionState
   and the email doesn't have to survive a round trip in component
   state — it comes back in the returned state and goes out again in a
   hidden field.

   Nothing here tells the caller whether an account exists. Signing in
   and signing up are the same act: an unknown address gets a code and
   becomes an account when that code is used.
------------------------------------------------------------------ */

export async function signInAction(prev, formData) {
  const intent = String(formData.get("intent") || "send");
  const next = safeNext(formData.get("next"));
  const email = normalizeEmail(formData.get("email"));

  if (intent === "restart") {
    return { step: "email", email: "", next };
  }

  if (!isEmail(email)) {
    return { step: "email", email, next, error: "That doesn't look like an email address." };
  }

  if (intent === "send") {
    const result = await requestLoginCode(email);
    if (result.error) return { step: "email", email, next, error: result.error };

    /* Housekeeping rides along with the one action that's already
       doing a write, rather than needing a cron. */
    pruneExpired();

    return {
      step: "code",
      email,
      next,
      notice: `Code sent to ${email}. It's good for 10 minutes.`,
      devCode: result.devCode,
    };
  }

  const code = text(formData.get("code"), 12);
  if (!code) {
    return { step: "code", email, next, error: "Enter the six-digit code from the email." };
  }

  const result = await verifyLoginCode(email, code);
  if (result.error) return { step: "code", email, next, error: result.error };

  redirect(result.user.onboarded_at ? next : `/onboarding?next=${encodeURIComponent(next)}`);
}

export async function signOutAction() {
  await endSession();
  redirect("/");
}

/** "Sign out everywhere" — revokes every session, including this one. */
export async function signOutEverywhereAction() {
  const user = await currentUser();
  if (user) {
    const { endAllSessions } = await import("../../lib/auth");
    await endAllSessions(user.id);
  }
  await endSession();
  redirect("/login");
}
