import { handleUpload } from "@vercel/blob/client";

import { currentUser } from "../../../lib/auth";
import { sql, one } from "../../../lib/db";
import {
  AVATAR_TYPES,
  MAX_AVATAR_BYTES,
  parseUploadPath,
} from "../../../lib/accounts";

/* ------------------------------------------------------------------
   Profile avatars and team logos.

   The browser uploads straight to Vercel Blob, so a photo off a phone
   never passes through a serverless function and the 4.5 MB body
   limit never applies. This route only mints the token, and it is the
   security boundary: it refuses to sign a pathname that
   parseUploadPath() rejects, and it checks that the signed-in user
   actually owns the folder they're asking to write to.

   Without that ownership check the path scoping would be decorative —
   any signed-in account could write into any other account's avatar
   folder just by naming it.

   Unlike the sponsor intake, these blobs are public: an avatar is
   rendered on a roster and a team logo on a results page, and both
   want a plain URL rather than a proxied read.
------------------------------------------------------------------ */

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

async function ownsTarget(user, parsed) {
  if (parsed.kind === "avatar") return parsed.ownerId === user.id;

  if (parsed.kind === "team-logo") {
    /* Any member can set the team's logo — the same rule the
       submission follows, because a team is a unit, not a hierarchy. */
    const row = one(await sql`
      select 1 as ok from team_members
       where team_id = ${parsed.ownerId} and user_id = ${user.id}`);
    return Boolean(row);
  }

  return false;
}

export async function POST(request) {
  const user = await currentUser();
  if (!user) return Response.json({ error: "Sign in first." }, { status: 401 });

  const body = await request.json();

  try {
    const result = await handleUpload({
      body,
      request,
      onBeforeGenerateToken: async (pathname) => {
        const parsed = parseUploadPath(pathname);
        if (!parsed) throw new Error("That upload path isn't allowed.");
        if (!(await ownsTarget(user, parsed))) {
          throw new Error("That isn't yours to write to.");
        }

        return {
          allowedContentTypes: AVATAR_TYPES,
          maximumSizeInBytes: MAX_AVATAR_BYTES,
          addRandomSuffix: true,
          /* Public: these render on the roster and the results page. */
          access: "public",
          tokenPayload: JSON.stringify({ userId: user.id, ...parsed }),
        };
      },
      onUploadCompleted: async ({ blob, tokenPayload }) => {
        const meta = JSON.parse(tokenPayload || "{}");

        /* Recording the URL here rather than trusting a follow-up
           form post means the stored avatar is always one this route
           actually signed. */
        if (meta.kind === "avatar") {
          await sql`
            update users set avatar_url = ${blob.url}, avatar_path = ${blob.pathname}
             where id = ${meta.ownerId}`;
        } else if (meta.kind === "team-logo") {
          await sql`
            update teams set logo_url = ${blob.url}, logo_path = ${blob.pathname}
             where id = ${meta.ownerId}`;
        }
      },
    });

    return Response.json(result);
  } catch (error) {
    return Response.json({ error: error.message }, { status: 400 });
  }
}
