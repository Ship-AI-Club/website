"use server";

import { redirect } from "next/navigation";

import { requireUser } from "../../lib/auth";
import { sql, one } from "../../lib/db";
import {
  GOAL_IDS,
  INTEREST_IDS,
  LIMITS,
  SPONSOR_CHOICE_IDS,
  handleAvailableShape,
  pickIds,
  safeUrl,
  suggestHandle,
  text,
} from "../../lib/accounts";
import { safeNext } from "../../lib/nav";

/* ------------------------------------------------------------------
   Onboarding, one step at a time.

   Each step writes as it completes rather than holding four screens
   of answers in the browser and posting them at the end. It costs a
   round trip per step and buys the thing that matters: closing the
   tab on step three doesn't throw away steps one and two.

   `onboarded_at` is only set by the last step, so a half-finished
   account is still routed back here rather than into a dashboard it
   has no name for.
------------------------------------------------------------------ */

/* Not exported: a "use server" module may only export async
   functions, and Next enforces that at runtime rather than at build,
   so an exported constant here is a 500 that a green build won't
   warn you about. The wizard keeps its own copy of the order for
   the progress dots. */
const STEPS = ["identity", "profile", "interests", "details", "done"];

/**
 * Move to another step, dropping whatever the last one complained
 * about. Spreading `prev` wholesale carried the error forward, so a
 * rejected handle stayed on screen through the next two screens after
 * it had been fixed — the banner outliving the problem is worse than
 * never showing one.
 */
function go(prev, step, extra = {}) {
  const { error, ...rest } = prev ?? {};
  return { ...rest, step, ...extra };
}

/** Free the handle for someone else if the taker abandons it. */
async function claimHandle(userId, wanted) {
  const shape = handleAvailableShape(wanted);
  if (shape.error) return shape;

  const taken = one(await sql`
    select id from users where handle = ${shape.handle} and id <> ${userId}`);
  if (taken) return { error: "That handle is taken. Try another." };

  return shape;
}

export async function saveStepAction(prev, formData) {
  const user = await requireUser("/onboarding");
  const next = safeNext(formData.get("next"));
  const step = text(formData.get("step"), 20);
  const back = String(formData.get("intent")) === "back";

  const at = STEPS.indexOf(step);
  if (at < 0) return go(prev, "identity", { next });

  if (back) return go(prev, STEPS[Math.max(0, at - 1)], { next });

  /* ---------- 1. who you are ---------- */

  if (step === "identity") {
    const name = text(formData.get("name"), LIMITS.name);
    if (!name) {
      return { ...prev, step, next, error: "We need a name to put on your certificate." };
    }

    const claimed = await claimHandle(user.id, formData.get("handle") || suggestHandle(name));
    if (claimed.error) {
      return { ...prev, step, next, name, error: claimed.error };
    }

    try {
      await sql`
        update users set name = ${name}, handle = ${claimed.handle} where id = ${user.id}`;
    } catch {
      /* The unique index is the real arbiter — two people can claim
         the same handle between the check above and this write. */
      return { ...prev, step, next, name, error: "That handle just went. Try another." };
    }

    return go(prev, "profile", { next, name, handle: claimed.handle });
  }

  /* ---------- 2. your profile (all optional) ---------- */

  if (step === "profile") {
    await sql`
      update users set
        title    = ${text(formData.get("title"), LIMITS.title)},
        company  = ${text(formData.get("company"), LIMITS.company)},
        phone    = ${text(formData.get("phone"), LIMITS.phone)},
        discord  = ${text(formData.get("discord"), LIMITS.handle)},
        github   = ${text(formData.get("github"), LIMITS.handle)},
        x_handle = ${text(formData.get("x_handle"), LIMITS.handle)},
        linkedin = ${text(formData.get("linkedin"), LIMITS.handle)},
        website  = ${safeUrl(formData.get("website"))},
        bio      = ${text(formData.get("bio"), LIMITS.bio)},
        public_profile = ${formData.get("public_profile") === "on"}
      where id = ${user.id}`;

    return go(prev, "interests", { next });
  }

  /* ---------- 3. what brings you here ---------- */

  if (step === "interests") {
    const interests = pickIds(formData.getAll("interests"), INTEREST_IDS);
    if (!interests.length) {
      return { ...prev, step, next, error: "Pick at least one — you can change it later." };
    }

    await sql`update users set interests = ${interests}::text[] where id = ${user.id}`;
    return go(prev, "details", { next, interests });
  }

  /* ---------- 4. the follow-ups those answers earned ---------- */

  if (step === "details") {
    const goals = pickIds(formData.getAll("goals"), GOAL_IDS);
    const tierRaw = text(formData.get("sponsor_tier"), 40);

    await sql`
      update users set
        goals        = ${goals}::text[],
        goal_note    = ${text(formData.get("goal_note"), LIMITS.goalNote)},
        bio          = coalesce(nullif(${text(formData.get("expertise"), LIMITS.bio)}, ''), bio),
        sponsor_tier = ${SPONSOR_CHOICE_IDS.includes(tierRaw) ? tierRaw : null},
        onboarded_at = coalesce(onboarded_at, now())
      where id = ${user.id}`;

    return go(prev, "done", { next });
  }

  /* ---------- 5. done ---------- */

  redirect(next);
}

/** Live availability check for the handle field. */
export async function checkHandleAction(prev, formData) {
  const user = await requireUser("/onboarding");
  const claimed = await claimHandle(user.id, formData.get("handle"));
  return claimed.error ? { error: claimed.error } : { ok: `${claimed.handle} is free.` };
}
