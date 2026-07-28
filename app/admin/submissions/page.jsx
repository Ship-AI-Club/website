/* Why this exists: let admins inspect every entry and make awards from the same evidence teams submitted. */

import { Award, ExternalLink, FileText } from "lucide-react";

import { requireAdmin } from "../../../lib/auth";
import { allSubmissions } from "../../../lib/store";
import { AwardForm } from "../award-form";

export const metadata = {
  title: "Submissions — Ship AI",
  robots: { index: false, follow: false },
};

export const dynamic = "force-dynamic";

function formatDate(value) {
  if (!value) return "—";
  return new Date(value).toLocaleString("en-US", {
    month: "short",
    day: "numeric",
    hour: "numeric",
    minute: "2-digit",
  });
}

function statusClass(status) {
  if (status === "submitted") return "is-ok";
  if (status === "draft") return "is-warn";
  return "is-off";
}

export default async function Page() {
  const admin = await requireAdmin();
  void admin;

  const submissions = await allSubmissions();

  return (
    <>
      <div className="ac-head">
        <p className="ac-kicker">Admin / entries</p>
        <h1>Submissions</h1>
        <p>Read the entry as submitted, then record an award only after the judging work is complete.</p>
      </div>

      <section className="ac-card">
        <div className="ac-card-head">
          <FileText size={18} strokeWidth={1.75} aria-hidden="true" />
          <h2>All entries</h2>
          <span className="ac-pill is-live">{submissions.length}</span>
        </div>
        {submissions.length ? (
          <div className="ac-table-wrap">
            <table className="ac-table">
              <thead>
                <tr>
                  <th>Project</th>
                  <th>Team</th>
                  <th>Category</th>
                  <th>Track</th>
                  <th>Status</th>
                  <th>Live</th>
                  <th className="ac-num">Judges</th>
                  <th className="ac-num">Scored</th>
                  <th>Submitted</th>
                </tr>
              </thead>
              <tbody>
                {submissions.map((submission) => (
                  <tr key={submission.id}>
                    <td>
                      <strong>{submission.project || "Untitled project"}</strong>
                    </td>
                    <td>{submission.team_name || "Unnamed team"}</td>
                    <td>{submission.category || "—"}</td>
                    <td>{submission.track || "—"}</td>
                    <td>
                      <span className={`ac-pill ${statusClass(submission.status)}`}>{submission.status || "unknown"}</span>
                    </td>
                    <td>
                      {submission.live_url ? (
                        <a href={submission.live_url} target="_blank" rel="noreferrer" className="ac-mono">
                          Open <ExternalLink size={18} strokeWidth={1.75} aria-hidden="true" />
                        </a>
                      ) : (
                        "—"
                      )}
                    </td>
                    <td className="ac-num">{submission.judge_count ?? 0}</td>
                    <td className="ac-num">{submission.scored_count ?? 0}</td>
                    <td>{formatDate(submission.submitted_at)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="ac-empty">
            <strong>Nothing submitted yet</strong>
            Entries appear here as teams file them.
          </div>
        )}
      </section>

      {submissions.map((submission) => (
          <section key={submission.id} className="ac-card">
            <div className="ac-card-head">
              <FileText size={18} strokeWidth={1.75} aria-hidden="true" />
              <h2>{submission.project || "Untitled project"}</h2>
              <span className={`ac-pill ${statusClass(submission.status)}`}>{submission.status || "unknown"}</span>
            </div>
            <p className="ac-fine">{submission.team_name || "Unnamed team"}</p>
            <dl className="ac-dl">
              <div>
                <dt>Summary</dt>
                <dd>{submission.summary || "—"}</dd>
              </div>
              <div>
                <dt>Launch</dt>
                <dd>{submission.launch || "—"}</dd>
              </div>
              <div>
                <dt>Receipts</dt>
                <dd>{submission.receipts || "—"}</dd>
              </div>
              <div>
                <dt>Growth</dt>
                <dd>{submission.growth || "—"}</dd>
              </div>
              <div>
                <dt>Repository</dt>
                <dd>
                  {submission.repo_url ? (
                    <a href={submission.repo_url} target="_blank" rel="noreferrer">
                      {submission.repo_url}
                    </a>
                  ) : (
                    "—"
                  )}
                </dd>
              </div>
            </dl>
            {submission.status === "submitted" && (
              <section className="ac-card">
                <div className="ac-card-head">
                  <Award size={18} strokeWidth={1.75} aria-hidden="true" />
                  <h3>Record award</h3>
                </div>
                <AwardForm submissionId={submission.id} award={submission.award} crowd={submission.crowd} />
              </section>
            )}
          </section>
        ))}
    </>
  );
}
