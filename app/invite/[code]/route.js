import { NextResponse } from "next/server";

import { currentUser } from "../../../lib/auth";
import { hasDb } from "../../../lib/db";
import {
  rememberInvite,
  redeemPendingInvite,
  usableInvite,
} from "../../../lib/invites";

/* ------------------------------------------------------------------
   /invite/<code>

   The link an admin hands over. It doesn't grant anything by itself —
   it parks the code in a short-lived cookie and sends you to sign in,
   and the roles land once there's an account to attach them to.

   A route handler rather than a page because it writes a cookie, and
   because granting a role during a render would be a write in a place
   React is free to run twice.

   Someone already signed in skips the detour and redeems on the spot.
------------------------------------------------------------------ */

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function GET(request, { params }) {
  const { code } = await params;

  if (!hasDb()) {
    return NextResponse.redirect(new URL("/login", request.url));
  }

  const invite = await usableInvite(code);

  if (!invite) {
    /* Deliberately one message for expired, spent, revoked and never
       existed. Which of those it is tells a stranger whether a code
       they guessed was real. */
    const url = new URL("/login", request.url);
    url.searchParams.set(
      "error",
      "That invite link isn't valid any more. Ask whoever sent it for a new one.",
    );
    return NextResponse.redirect(url);
  }

  await rememberInvite(invite.code);

  const user = await currentUser();
  if (user) {
    const granted = await redeemPendingInvite(user);
    const url = new URL(user.onboarded_at ? "/dashboard" : "/onboarding", request.url);
    if (granted.length) url.searchParams.set("welcomed", granted.join(","));
    return NextResponse.redirect(url);
  }

  const url = new URL("/login", request.url);
  url.searchParams.set("next", "/dashboard");
  url.searchParams.set("invited", invite.label || "1");
  return NextResponse.redirect(url);
}
