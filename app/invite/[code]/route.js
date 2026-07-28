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

  /* Redeeming is a write, and this is a GET, so it only happens for a
     real top-level navigation. Without this an <img src="/invite/…">
     on any page would burn a use of a shared code and force a role
     onto whoever loaded it. Every current browser sends this header on
     a document navigation; anything that doesn't gets the cookie and
     redeems on its next sign-in instead. */
  const isNavigation = request.headers.get("sec-fetch-dest") === "document";

  await rememberInvite(invite.code);

  const user = await currentUser();
  if (user && isNavigation) {
    const granted = await redeemPendingInvite(user);
    const url = new URL(user.onboarded_at ? "/dashboard" : "/onboarding", request.url);
    /* Say what happened. Landing on an unchanged dashboard after
       clicking an invite reads as a broken link — and so does being
       silently refused one that wasn't meant for you. */
    url.searchParams.set(
      "invite",
      granted.length ? `granted:${granted.join(",")}` : "declined",
    );
    return NextResponse.redirect(url);
  }

  const url = new URL("/login", request.url);
  url.searchParams.set("next", "/dashboard");
  /* A flag, not the label. The label is the admin's private note and
     has no business in a URL, browser history or a Referer header. */
  url.searchParams.set("invited", "1");
  return NextResponse.redirect(url);
}
