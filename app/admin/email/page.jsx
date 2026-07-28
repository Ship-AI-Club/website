import { AlertTriangle, Inbox, Send } from "lucide-react";

import { requireAdmin } from "../../../lib/auth";
import { sql } from "../../../lib/db";
import { INBOX_ADDRESSES, inboundReadConfigured } from "../../../lib/inbound";
import { webhookConfigured } from "../../../lib/webhook";
import { mailConfigured, FROM, INBOX } from "../../../lib/email";
import { ArchiveForm, BackfillForm, ReadForm, ReplyForm } from "./email-forms";

export const dynamic = "force-dynamic";

export const metadata = {
  title: "Email — Ship AI",
  robots: { index: false, follow: false },
};

/* ------------------------------------------------------------------
   /admin/email

   Two questions this page exists to answer:

     · did the mail we sent arrive? "I never got my code" is the
       single most likely support request for a passwordless login,
       and without a delivery log the only honest answer is a shrug.
     · what has anyone sent us? Mail to shipai.club is received as a
       webhook rather than into a mailbox, so this is the inbox.
------------------------------------------------------------------ */

/* Types worth calling out in red. A bounce or a complaint is a
   deliverability problem that compounds if nobody looks. */
const BAD = new Set(["email.bounced", "email.complained", "email.failed", "email.suppressed"]);
const GOOD = new Set(["email.delivered", "email.opened", "email.clicked"]);

function when(value) {
  return new Date(value).toLocaleString("en-US", {
    month: "short",
    day: "numeric",
    hour: "numeric",
    minute: "2-digit",
  });
}

function pillFor(type) {
  if (BAD.has(type)) return "is-warn";
  if (GOOD.has(type)) return "is-ok";
  return "";
}

export default async function Page() {
  await requireAdmin();

  const [inbound, events, stats] = await Promise.all([
    sql`
      select * from inbound_emails
       where archived_at is null
       order by received_at desc limit 50`,
    sql`
      select * from email_events order by occurred_at desc limit 120`,
    sql`
      select
        (select count(*)::int from email_events where type = 'email.delivered')  as delivered,
        (select count(*)::int from email_events where type = 'email.bounced')    as bounced,
        (select count(*)::int from email_events where type = 'email.complained') as complained,
        (select count(*)::int from email_events where type = 'email.opened')     as opened,
        (select count(*)::int from email_events where type = 'email.clicked')    as clicked,
        (select count(*)::int from inbound_emails where read_at is null and archived_at is null) as unread,
        (select count(*)::int from inbound_emails) as received`,
  ]);

  const counts = stats[0];
  const missingBodies = inbound.filter((m) => !m.has_body).length;

  return (
    <>
      <div className="ac-head">
        <p className="ac-kicker">Admin · Email</p>
        <h1>Email</h1>
        <p>
          Everything the club sends and everything it receives. Sent from{" "}
          <span className="ac-mono">{FROM}</span>, replies land at{" "}
          <span className="ac-mono">{INBOX}</span>.
        </p>
      </div>

      {!webhookConfigured() && (
        <p className="ac-error">
          <AlertTriangle
            size={15}
            strokeWidth={1.75}
            aria-hidden="true"
            style={{ verticalAlign: "-2px", marginRight: ".5rem" }}
          />
          RESEND_WEBHOOK_SECRET isn&apos;t set, so the webhook endpoint refuses every delivery.
          Nothing below will update until it is.
        </p>
      )}
      {!mailConfigured() && (
        <p className="ac-note">
          RESEND_API_KEY isn&apos;t set on this environment — mail is logged to the server
          console instead of sent.
        </p>
      )}

      <section className="ac-card">
        <h2>Delivery</h2>
        <div className="ac-stats">
          <div className="ac-stat">
            <b>{counts.delivered}</b>
            <span>delivered</span>
          </div>
          <div className="ac-stat">
            <b>{counts.bounced}</b>
            <span>bounced</span>
          </div>
          <div className="ac-stat">
            <b>{counts.complained}</b>
            <span>complained</span>
          </div>
          <div className="ac-stat">
            <b>{counts.opened}</b>
            <span>opened</span>
          </div>
          <div className="ac-stat">
            <b>{counts.clicked}</b>
            <span>clicked</span>
          </div>
          <div className="ac-stat">
            <b>{counts.received}</b>
            <span>received</span>
          </div>
        </div>
        {(counts.bounced > 0 || counts.complained > 0) && (
          <p className="ac-fine">
            A bounce means the address doesn&apos;t exist or refused us; a complaint means
            somebody marked us as spam. Both hurt deliverability for everyone else, so they
            are worth clearing rather than ignoring.
          </p>
        )}
      </section>

      {/* ---------- inbox ---------- */}

      <section className="ac-card">
        <div className="ac-card-head">
          <Inbox size={18} strokeWidth={1.75} aria-hidden="true" />
          <h2>Inbox</h2>
          {counts.unread > 0 && <span className="ac-pill is-ok">{counts.unread} unread</span>}
        </div>
        <p>
          Mail to {INBOX_ADDRESSES.join(" and ")} — receiving is catch-all, so anything
          @shipai.club arrives here. Replies go out with the original message id attached, so
          they thread properly on the other side.
        </p>

        {!inboundReadConfigured() && (
          <p className="ac-note">
            RESEND_READ_API_KEY isn&apos;t set, so message bodies can&apos;t be fetched — you
            will see who wrote and about what, but not what they said.
          </p>
        )}
        {missingBodies > 0 && inboundReadConfigured() && (
          <>
            <p className="ac-note">
              {missingBodies} message{missingBodies === 1 ? "" : "s"} arrived without a body —
              usually a hiccup fetching it right after delivery.
            </p>
            <BackfillForm />
          </>
        )}

        {inbound.length === 0 ? (
          <div className="ac-empty">
            <strong>Nothing yet.</strong>
            Anything sent to {INBOX_ADDRESSES.join(" or ")} shows up here within a second or
            two of arriving.
          </div>
        ) : (
          inbound.map((mail) => (
            <div key={mail.id} className="ac-card" style={{ marginTop: "1rem" }}>
              <div className="ac-card-head">
                <h3>{mail.subject || "(no subject)"}</h3>
                {!mail.read_at && <span className="ac-pill is-ok">new</span>}
                {mail.replied_at && <span className="ac-pill">replied</span>}
                {mail.spam && <span className="ac-pill is-warn">spam</span>}
              </div>

              <dl className="ac-dl">
                <div>
                  <dt>From</dt>
                  <dd>{mail.from_addr}</dd>
                </div>
                <div>
                  <dt>To</dt>
                  <dd>{(mail.to_addrs || []).join(", ")}</dd>
                </div>
                <div>
                  <dt>Received</dt>
                  <dd>{when(mail.received_at)}</dd>
                </div>
                <div>
                  <dt>Message</dt>
                  <dd>
                    {mail.has_body
                      ? mail.body_text || "(no plain-text part)"
                      : "Body not fetched."}
                  </dd>
                </div>
                {Array.isArray(mail.attachments) && mail.attachments.length > 0 && (
                  <div>
                    <dt>Attachments</dt>
                    <dd>
                      {mail.attachments
                        .map((a) => a.filename || a.name || "file")
                        .join(", ")}
                    </dd>
                  </div>
                )}
              </dl>

              <ReplyForm id={mail.id} to={mail.from_addr} subject={mail.subject} />

              <div className="ac-actions">
                <ReadForm id={mail.id} unread={!mail.read_at} />
                <ArchiveForm id={mail.id} />
              </div>
            </div>
          ))
        )}
      </section>

      {/* ---------- outbound log ---------- */}

      <section className="ac-card">
        <div className="ac-card-head">
          <Send size={18} strokeWidth={1.75} aria-hidden="true" />
          <h2>Sent</h2>
        </div>
        <p>
          The last 120 events. When somebody says a login code never arrived, this is where
          you find out whether it left, landed, or bounced.
        </p>

        {events.length === 0 ? (
          <div className="ac-empty">
            <strong>No events yet.</strong>
            Delivery events appear as soon as the first email goes out.
          </div>
        ) : (
          <div className="ac-table-wrap">
            <table className="ac-table">
              <thead>
                <tr>
                  <th>When</th>
                  <th>Event</th>
                  <th>To</th>
                  <th>Subject</th>
                </tr>
              </thead>
              <tbody>
                {events.map((e) => (
                  <tr key={e.id}>
                    <td className="ac-mono">{when(e.occurred_at)}</td>
                    <td>
                      <span className={`ac-pill ${pillFor(e.type)}`}>
                        {e.type.replace("email.", "")}
                      </span>
                    </td>
                    <td>{(e.to_addrs || []).join(", ") || "—"}</td>
                    <td>{e.subject || "—"}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </section>
    </>
  );
}
