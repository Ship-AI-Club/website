"use server";

import { redirect } from "next/navigation";

import { requireUser } from "../../lib/auth";
import { sql } from "../../lib/db";
import {
  GOAL_IDS,
  INTEREST_IDS,
  LIMITS,
  SPONSOR_CHOICE_IDS,
  pickIds,
  text,
} from "../../lib/accounts";
import { safeNext } from "../../lib/nav";

/* Onboarding writes the declarative half of an account: who you are,
   what you're here for, what you want out of it. It grants no roles —
   saying "I'd like to judge" and being a judge are different facts,
   and only an admin turns the first into the second. */

export async function saveOnboardingAction(prev, formData) {
  const user = await requireUser("/onboarding");
  const next = safeNext(formData.get("next"));

  const name = text(formData.get("name"), LIMITS.name);
  const interests = pickIds(formData.getAll("interests"), INTEREST_IDS);
  const goals = pickIds(formData.getAll("goals"), GOAL_IDS);
  const goalNote = text(formData.get("goal_note"), LIMITS.goalNote);
  const company = text(formData.get("company"), LIMITS.company);
  const title = text(formData.get("title"), LIMITS.title);
  const pronouns = text(formData.get("pronouns"), LIMITS.pronouns);
  const discord = text(formData.get("discord"), LIMITS.handle);

  const tierRaw = text(formData.get("sponsor_tier"), 40);
  const sponsorTier =
    interests.includes("sponsoring") && SPONSOR_CHOICE_IDS.includes(tierRaw) ? tierRaw : null;

  const fields = { name, interests, goals, goalNote, company, title, pronouns, discord, sponsorTier };

  if (!name) {
    return { ...fields, error: "We need a name to put on your certificate." };
  }
  if (!interests.length) {
    return { ...fields, error: "Pick at least one — you can change it later." };
  }

  await sql`
    update users set
      name         = ${name},
      pronouns     = ${pronouns},
      company      = ${company},
      title        = ${title},
      discord      = ${discord},
      /* explicit casts: the driver sends a JS array as a Postgres
         array literal, and an untyped parameter would leave the
         server guessing at the element type */
      interests    = ${interests}::text[],
      goals        = ${goals}::text[],
      goal_note    = ${goalNote},
      sponsor_tier = ${sponsorTier},
      onboarded_at = coalesce(onboarded_at, now())
    where id = ${user.id}`;

  redirect(next);
}
