import { EVENT } from "./hackathon";

/* ------------------------------------------------------------------
   Transactional email, through Resend's REST API.

   No SDK — it's one POST, and the intake route already talks to Resend
   this way. Every message is sent as text *and* html: the code in a
   login email has to be readable in a plain-text client, in a
   notification preview, and in a dark-mode inbox, so the text part is
   the real one and the html is a wrapper around it.

   Env:
     RESEND_API_KEY   required for anything to send
     AUTH_EMAIL_FROM  e.g. "Ship AI <noreply@shipai.club>"
     ADMIN_EMAIL      where role requests and submissions get announced

   With RESEND_API_KEY unset, send() logs the message and reports
   success. That is deliberate: local development shouldn't need a mail
   provider, and the login code is printed to the server console so you
   can still sign in. It never falls back silently in production —
   see the guard in requestLoginCode().
------------------------------------------------------------------ */

const API = "https://api.resend.com/emails";

/* Every link we email is absolute, so this has to be the origin the
   recipient can actually reach. Production is the canonical domain;
   SITE_URL overrides it locally, where a magic link pointing at
   www.shipai.club would sign you into production instead of the
   dev server you were testing. */
export const SITE = (process.env.SITE_URL || "https://www.shipai.club").replace(/\/$/, "");
export const FROM = process.env.AUTH_EMAIL_FROM || "Ship AI <noreply@shipai.club>";

/* Transactional mail goes out from noreply@ because that's what it
   is, but a reply to it has to reach a person — so every message
   carries a Reply-To of the human address. Mail to shipai.club is
   received (catch-all) and shows up in /admin/email, so a reply here
   isn't a black hole. */
export const INBOX = process.env.REPLY_TO_EMAIL || "hi@shipai.club";

export function mailConfigured() {
  return Boolean(process.env.RESEND_API_KEY);
}

export function adminEmail() {
  return process.env.ADMIN_EMAIL || process.env.INTAKE_NOTIFY_EMAIL || "";
}

/* A dark, monospace-leaning wrapper that matches the site without
   trying to be clever. Inline styles only — every layout feature
   invented since 2005 is a coin flip in Outlook. */
function wrap({ heading, body, cta }) {
  const button = cta
    ? `<tr><td style="padding:8px 0 28px">
         <a href="${cta.href}" style="display:inline-block;background:#f8f8fa;color:#000;
            text-decoration:none;font-weight:600;font-size:15px;padding:12px 22px;
            border-radius:8px">${cta.label}</a>
       </td></tr>`
    : "";

  return `<!doctype html>
<html><body style="margin:0;padding:0;background:#000;">
<table role="presentation" width="100%" cellpadding="0" cellspacing="0"
       style="background:#000;padding:40px 20px">
  <tr><td align="center">
    <table role="presentation" width="100%" cellpadding="0" cellspacing="0"
           style="max-width:520px;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',
                  Helvetica,Arial,sans-serif;color:#f8f8fa">
      <tr><td style="padding-bottom:28px;font-size:13px;letter-spacing:.14em;
                     text-transform:uppercase;color:#678ff2;font-weight:600">Ship AI</td></tr>
      <tr><td style="font-size:24px;font-weight:600;letter-spacing:-.02em;
                     padding-bottom:16px;line-height:1.2">${heading}</td></tr>
      <tr><td style="font-size:15px;line-height:1.65;color:#c8ccd4;
                     padding-bottom:24px">${body}</td></tr>
      ${button}
      <tr><td style="border-top:1px solid rgba(248,248,250,.12);padding-top:20px;
                     font-size:12px;line-height:1.6;color:#55585f">
        ${EVENT.name} · ${EVENT.dates} · ${EVENT.city}<br>
        <a href="${SITE}" style="color:#55585f">shipai.club</a>
      </td></tr>
    </table>
  </td></tr>
</table>
</body></html>`;
}

/**
 * Sends one email. Never throws — a failed notification must not fail
 * the action that triggered it. Returns { ok, skipped, error }.
 *
 * Login codes are the exception: requestLoginCode() checks the return
 * value, because "we sent you a code" is a lie if we didn't.
 */
export async function send({ to, subject, text, heading, body, cta, replyTo, headers }) {
  const key = process.env.RESEND_API_KEY;
  const recipients = (Array.isArray(to) ? to : [to]).filter(Boolean);
  if (!recipients.length) return { ok: false, skipped: true, error: "no recipient" };

  if (!key) {
    console.info(
      `\n[email: not sent — RESEND_API_KEY unset]\n  to: ${recipients.join(", ")}\n  subject: ${subject}\n${text
        .split("\n")
        .map((l) => `  ${l}`)
        .join("\n")}\n`,
    );
    return { ok: true, skipped: true };
  }

  try {
    const res = await fetch(API, {
      method: "POST",
      headers: { Authorization: `Bearer ${key}`, "Content-Type": "application/json" },
      body: JSON.stringify({
        from: FROM,
        to: recipients,
        subject,
        text,
        html: wrap({ heading: heading ?? subject, body: body ?? "", cta }),
        reply_to: replyTo || INBOX,
        ...(headers ? { headers } : {}),
      }),
    });
    if (!res.ok) {
      const detail = await res.text().catch(() => "");
      console.error("email: resend rejected the message", res.status, detail);
      return { ok: false, error: `resend ${res.status}` };
    }
    const sent = await res.json().catch(() => ({}));
    return { ok: true, id: sent.id };
  } catch (error) {
    console.error("email: send failed", error);
    return { ok: false, error: "network" };
  }
}

/* ---------- the messages ---------- */

export function loginCodeEmail({ to, code, link, minutes }) {
  return send({
    to,
    subject: `${code} is your Ship AI sign-in code`,
    heading: "Your sign-in code",
    text: [
      `Your Ship AI sign-in code is ${code}`,
      "",
      `It expires in ${minutes} minutes and works once.`,
      "",
      "Or open this link to sign in directly:",
      link,
      "",
      "If you didn't ask for this, ignore it — nobody can sign in without the code.",
    ].join("\n"),
    body: `
      <p style="margin:0 0 20px">Enter this code to sign in. It expires in
        ${minutes} minutes and works once.</p>
      <p style="margin:0 0 20px;font-family:ui-monospace,SFMono-Regular,Menlo,monospace;
                font-size:34px;letter-spacing:.32em;color:#f8f8fa;font-weight:600">${code}</p>
      <p style="margin:0;color:#55585f;font-size:13px">If you didn't ask for this, ignore it —
        nobody can sign in without the code.</p>`,
    cta: { href: link, label: "Sign in" },
  });
}

export function roleRequestReceivedEmail({ to, name, role }) {
  return send({
    to,
    subject: `Your request to ${role === "sponsor" ? "sponsor" : role} Zero to Launch`,
    heading: "Request received",
    text: [
      `${name || "Hi"} —`,
      "",
      `We've got your request to ${role === "sponsor" ? "sponsor" : `${role} at`} ${EVENT.name}.`,
      "Santos reads every one of these himself and comes back with a real answer,",
      "usually within a couple of days.",
      "",
      `Track it at ${SITE}/dashboard/requests`,
    ].join("\n"),
    body: `<p style="margin:0 0 16px">We've got your request to
      ${role === "sponsor" ? "sponsor" : `${role} at`} <strong>${EVENT.name}</strong>.</p>
      <p style="margin:0">Santos reads every one of these himself and comes back with a
      real answer, usually within a couple of days.</p>`,
    cta: { href: `${SITE}/dashboard/requests`, label: "Track your request" },
  });
}

export function roleDecidedEmail({ to, name, role, approved, note }) {
  const verb = { sponsor: "sponsor", mentor: "mentor", judge: "judge" }[role] || role;
  return send({
    to,
    subject: approved
      ? `You're confirmed as a ${verb} for Zero to Launch`
      : `About your ${verb} request`,
    heading: approved ? `You're in — ${verb}, confirmed.` : "About your request",
    text: [
      `${name || "Hi"} —`,
      "",
      approved
        ? `You're confirmed as a ${verb} for ${EVENT.name}, ${EVENT.dates}.`
        : `We can't take you on as a ${verb} this round.`,
      note ? `\n${note}\n` : "",
      approved
        ? `Your dashboard has what happens next: ${SITE}/dashboard`
        : "It's not a no forever — the next season comes around fast.",
    ]
      .filter(Boolean)
      .join("\n"),
    body: approved
      ? `<p style="margin:0 0 16px">You're confirmed as a <strong>${verb}</strong> for
         ${EVENT.name}, ${EVENT.dates}.</p>${note ? `<p style="margin:0 0 16px">${note}</p>` : ""}
         <p style="margin:0">Your dashboard has what happens next.</p>`
      : `<p style="margin:0 0 16px">We can't take you on as a ${verb} this round.</p>
         ${note ? `<p style="margin:0 0 16px">${note}</p>` : ""}
         <p style="margin:0">It's not a no forever — the next season comes around fast.</p>`,
    cta: approved ? { href: `${SITE}/dashboard`, label: "Open your dashboard" } : null,
  });
}

export function judgeAssignedEmail({ to, name, count }) {
  return send({
    to,
    subject: `${count} project${count === 1 ? "" : "s"} assigned to you to judge`,
    heading: "Your judging assignments are up",
    text: [
      `${name || "Hi"} —`,
      "",
      `${count} project${count === 1 ? " has" : "s have"} been assigned to you.`,
      "Each one is scored against the four published criteria: shipped (40%),",
      "receipts (30%), growth engine (20%), craft (10%).",
      "",
      `${SITE}/judge`,
    ].join("\n"),
    body: `<p style="margin:0 0 16px"><strong>${count}</strong> project${count === 1 ? " has" : "s have"}
      been assigned to you.</p>
      <p style="margin:0">Each one is scored against the four published criteria: shipped (40%),
      receipts (30%), growth engine (20%), craft (10%).</p>`,
    cta: { href: `${SITE}/judge`, label: "Open your scorecards" },
  });
}

export function submissionReceiptEmail({ to, project, category, deadline }) {
  return send({
    to,
    subject: `Submitted: ${project}`,
    heading: "Submission received",
    text: [
      `${project} is in, entered for ${category}.`,
      "",
      `You can keep editing it until ${deadline}. After that it locks.`,
      "",
      `${SITE}/dashboard/submission`,
    ].join("\n"),
    body: `<p style="margin:0 0 16px"><strong>${project}</strong> is in, entered for
      ${category}.</p><p style="margin:0">You can keep editing it until ${deadline}.
      After that it locks.</p>`,
    cta: { href: `${SITE}/dashboard/submission`, label: "Review your submission" },
  });
}

export function certificateIssuedEmail({ to, name, credential, url }) {
  return send({
    to,
    subject: `Your ${EVENT.name} certification`,
    heading: "Your certification is live",
    text: [
      `${name || "Hi"} —`,
      "",
      `${credential}`,
      "",
      "It lives at a permanent public URL you can link from LinkedIn or a job",
      "application. The exact fields LinkedIn asks for are on the page.",
      "",
      url,
    ].join("\n"),
    body: `<p style="margin:0 0 16px"><strong>${credential}</strong></p>
      <p style="margin:0">It lives at a permanent public URL you can link from LinkedIn or a
      job application. The exact fields LinkedIn asks for are on the page.</p>`,
    cta: { href: url, label: "View your certificate" },
  });
}

/**
 * Fire-and-forget note to Santos. Skipped when ADMIN_EMAIL is unset.
 *
 * `replyTo` is the point of this one: a role request or a submission
 * notice is about a specific person, so hitting reply in a normal
 * mail client should reach *them*, not noreply@. Without it every
 * one of these is a dead end that has to be answered by hand from
 * somewhere else.
 */
export function adminNotice({ subject, lines, cta, replyTo }) {
  const to = adminEmail();
  if (!to) return Promise.resolve({ ok: true, skipped: true });
  return send({
    to,
    subject,
    heading: subject,
    text: lines.join("\n"),
    body: lines.map((l) => `<p style="margin:0 0 8px">${l || "&nbsp;"}</p>`).join(""),
    cta,
    replyTo,
  });
}

/**
 * A reply to inbound mail, sent from the admin panel.
 *
 * Threading is the whole job. In-Reply-To and References are what
 * make a mail client file this under the original conversation
 * rather than starting a new one — without them the recipient sees an
 * unrelated message from an address they've never written to.
 */
export function replyToInbound({ to, subject, body: text, messageId, from }) {
  const headers = messageId
    ? { "In-Reply-To": messageId, References: messageId }
    : undefined;

  const quoted = text
    .split("\n")
    .map((line) => `<p style="margin:0 0 8px">${line || "&nbsp;"}</p>`)
    .join("");

  return send({
    to,
    subject: /^re:/i.test(subject) ? subject : `Re: ${subject}`,
    heading: "",
    text,
    body: quoted,
    replyTo: from || INBOX,
    headers,
  });
}
