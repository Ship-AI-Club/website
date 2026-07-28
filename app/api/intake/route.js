import { put } from "@vercel/blob";
import {
  FIELD_LIMITS,
  MAX_ASSETS,
  ROLE_IDS,
  isValidSubmissionId,
  parseIntakePath,
  recordPath,
} from "../../../lib/intake";

/* Stores the submission itself. The files are already in the blob store
   by the time this runs (see ./upload) — this writes the record.json
   that names them, which is what /intake/inbox reads back. */

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

function text(value, limit) {
  return String(value ?? "").trim().slice(0, limit);
}

/** A file reference is only accepted if it sits inside this submission's folder. */
function file(ref, { role, id, kind }) {
  if (!ref || typeof ref !== "object") return null;
  const parsed = parseIntakePath(ref.pathname);
  if (!parsed) return null;
  if (parsed.role !== role || parsed.id !== id || parsed.kind !== kind) return null;
  return {
    pathname: ref.pathname,
    name: text(ref.name, 200),
    size: Number(ref.size) || 0,
    contentType: text(ref.contentType, 120),
  };
}

async function notify(record) {
  const key = process.env.RESEND_API_KEY;
  const to = process.env.INTAKE_NOTIFY_EMAIL;
  if (!key || !to) return; // notifications are opt-in; the record is stored either way

  const lines = [
    `Role: ${record.role}`,
    `Name: ${record.name}`,
    `Email: ${record.email}`,
    `Title: ${record.title || "—"}`,
    `Company: ${record.company || "—"}`,
    `Avatar: ${record.avatar ? record.avatar.name : "none"}`,
    `Logo: ${record.logo ? record.logo.name : "none"}`,
    `Other assets: ${record.assets.length}`,
    "",
    record.note || "(no additional information)",
  ];

  try {
    await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${key}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        from: process.env.INTAKE_NOTIFY_FROM || "Ship AI <onboarding@resend.dev>",
        to: [to],
        subject: `${record.role} intake — ${record.name}${record.company ? ` (${record.company})` : ""}`,
        text: lines.join("\n"),
      }),
    });
  } catch {
    // a failed notification must never fail the submission
  }
}

export async function POST(request) {
  let body;
  try {
    body = await request.json();
  } catch {
    return Response.json({ error: "Malformed request." }, { status: 400 });
  }

  // honeypot: a real person never fills a field they can't see
  if (text(body.website, 200)) {
    return Response.json({ ok: true, id: "ignored" });
  }

  const role = String(body.role || "");
  const id = String(body.id || "");
  if (!ROLE_IDS.includes(role)) {
    return Response.json({ error: "Pick sponsor, mentor or judge." }, { status: 400 });
  }
  if (!isValidSubmissionId(id)) {
    return Response.json({ error: "Invalid submission id." }, { status: 400 });
  }

  const name = text(body.name, FIELD_LIMITS.name);
  const email = text(body.email, FIELD_LIMITS.email);
  const title = text(body.title, FIELD_LIMITS.title);

  if (!name) return Response.json({ error: "Name is required." }, { status: 400 });
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    return Response.json({ error: "A reachable email is required." }, { status: 400 });
  }
  if (!title) return Response.json({ error: "Preferred title is required." }, { status: 400 });

  const assets = Array.isArray(body.assets)
    ? body.assets
        .map((a) => file(a, { role, id, kind: "asset" }))
        .filter(Boolean)
        .slice(0, MAX_ASSETS)
    : [];

  const record = {
    role,
    id,
    name,
    email,
    title,
    company: text(body.company, FIELD_LIMITS.company),
    note: text(body.note, FIELD_LIMITS.note),
    avatar: file(body.avatar, { role, id, kind: "avatar" }),
    logo: file(body.logo, { role, id, kind: "logo" }),
    assets,
    receivedAt: new Date().toISOString(),
  };

  try {
    await put(recordPath({ role, id }), JSON.stringify(record, null, 2), {
      access: "private",
      contentType: "application/json",
      addRandomSuffix: false,
      allowOverwrite: true,
    });
  } catch (error) {
    console.error("intake: could not store record", error);
    return Response.json(
      { error: "We couldn't save that. Try again, or tell us in the Discord." },
      { status: 500 },
    );
  }

  await notify(record);

  return Response.json({ ok: true, id });
}
