import { notFound } from "next/navigation";
import { ArrowLeft, ExternalLink } from "lucide-react";

import { requireRole } from "../../../lib/auth";
import { sql, one } from "../../../lib/db";
import { scoreCard, submissionById } from "../../../lib/store";
import Scorecard from "../scorecard";

export const dynamic = "force-dynamic";

export const metadata = {
  title: "Scorecard — Ship AI",
  robots: { index: false, follow: false },
};

/* One entry, everything the team wrote, and the card. The
   assignment is re-checked here rather than trusted from the URL: a
   judge who guesses another entry's id gets a 404, not a scorecard. */

export default async function Page({ params }) {
  const { id } = await params;
  const user = await requireRole("judge", "/judge");

  const assigned = one(await sql`
    select 1 as ok from judge_assignments
     where submission_id = ${id} and judge_id = ${user.id}`);
  if (!assigned) notFound();

  const submission = await submissionById(id);
  if (!submission) notFound();

  const card = await scoreCard(id, user.id);

  const conflict = submission.members.some((m) => m.id === user.id);

  const sections = [
    ["What it does", submission.summary],
    ["What they launched this weekend", submission.launch],
    ["Receipts", submission.receipts],
    ["Growth engine", submission.growth],
  ].filter(([, value]) => value);

  return (
    <>
      <p>
        <a href="/judge" className="ac-btn-link">
          <ArrowLeft
            size={13}
            strokeWidth={1.75}
            aria-hidden="true"
            style={{ marginRight: ".3rem", verticalAlign: "-1px" }}
          />
          Back to your queue
        </a>
      </p>

      <div className="ac-head">
        <p className="ac-kicker">
          {submission.team_name}
          {submission.category ? ` · ${submission.category}` : ""}
        </p>
        <h1>{submission.project || "Untitled"}</h1>
        <p>{submission.members.map((m) => m.name || m.email).join(", ")}</p>
      </div>

      {conflict && (
        <p className="ac-error">
          You&apos;re on this team. Don&apos;t score it — tell the organisers so it comes off
          your queue.
        </p>
      )}

      <section className="ac-card">
        <div className="ac-card-head">
          <h2>The entry</h2>
          <span className={`ac-pill ${submission.live_url ? "is-live" : "is-warn"}`}>
            {submission.live_url ? "live URL filed" : "no live URL"}
          </span>
        </div>

        {submission.live_url && (
          <div className="ac-actions">
            <a
              className="btn btn-solid ac-btn-sm"
              href={submission.live_url}
              target="_blank"
              rel="noreferrer"
            >
              Open the product
              <ExternalLink
                size={13}
                strokeWidth={1.75}
                aria-hidden="true"
                style={{ marginLeft: ".4rem", verticalAlign: "-1px" }}
              />
            </a>
            {submission.repo_url && (
              <a
                className="btn btn-ghost ac-btn-sm"
                href={submission.repo_url}
                target="_blank"
                rel="noreferrer"
              >
                Repo
              </a>
            )}
          </div>
        )}

        <dl className="ac-dl">
          {sections.map(([label, value]) => (
            <div key={label}>
              <dt>{label}</dt>
              <dd>{value}</dd>
            </div>
          ))}
        </dl>
      </section>

      {!conflict && (
        <section className="ac-card">
          <div className="ac-card-head">
            <h2>Your card</h2>
            {card?.submitted_at && <span className="ac-pill is-ok">filed</span>}
          </div>
          <Scorecard submissionId={id} card={card} filed={Boolean(card?.submitted_at)} />
        </section>
      )}
    </>
  );
}
