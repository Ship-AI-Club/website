/* Why this exists: expose the returned leaderboard and every submitted judge card for audit before awards. */

import { BarChart3, BadgeCheck } from "lucide-react";

import { requireAdmin } from "../../../lib/auth";
import { RUBRIC } from "../../../lib/accounts";
import { allCertificates, leaderboard } from "../../../lib/store";
import { EDITION, certPath, credentialName } from "../../../lib/results";
import { IssueCertificatesForm, RevokeCertificateForm } from "../certificate-form";

export const metadata = {
  title: "Leaderboard — Ship AI",
  robots: { index: false, follow: false },
};

export const dynamic = "force-dynamic";

function scoreValue(value) {
  return value === null || value === undefined ? "—" : value.toFixed ? value.toFixed(1) : value;
}

function formatDate(value) {
  if (!value) return "—";
  return new Date(value).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" });
}

export default async function Page() {
  const admin = await requireAdmin();
  void admin;

  const [entries, certificates] = await Promise.all([leaderboard(), allCertificates()]);

  return (
    <>
      <div className="ac-head">
        <p className="ac-kicker">Admin / judging</p>
        <h1>Scores</h1>
        <p>
          Ordered by weighted average, ties broken by crowd votes. Spread is the gap between
          the highest and lowest judge — anything wide is flagged, because a mean can hide two
          judges who disagreed completely. Cards shows returned against assigned, since an
          average of one card isn&apos;t comparable to an average of three.
        </p>
      </div>

      <section className="ac-card">
        <div className="ac-card-head">
          <BarChart3 size={18} strokeWidth={1.75} aria-hidden="true" />
          <h2>Leaderboard</h2>
          <span className="ac-pill is-live">{entries.length}</span>
        </div>
        {entries.length ? (
          <div className="ac-table-wrap">
            <table className="ac-table">
              <thead>
                <tr>
                  <th className="ac-num">Rank</th>
                  <th>Project</th>
                  <th>Team</th>
                  <th className="ac-num">Average</th>
                  {RUBRIC.map((axis) => <th key={axis.key} className="ac-num">{axis.name}</th>)}
                  <th className="ac-num">Spread</th>
                  <th className="ac-num">Votes</th>
                  <th className="ac-num">Cards</th>
                </tr>
              </thead>
              <tbody>
                {entries.map((entry, index) => (
                  <tr key={entry.id}>
                    <td className="ac-num">{index + 1}</td>
                    <td>
                      <strong>{entry.project || "Untitled project"}</strong>
                    </td>
                    <td>{entry.team_name || "Unnamed team"}</td>
                    <td className="ac-num">{scoreValue(entry.average)}</td>
                    {RUBRIC.map((axis) => {
                      const value = entry.perAxis?.[axis.key];
                      return (
                        <td key={axis.key} className="ac-num">
                          {scoreValue(value)}
                          <span
                            className="ac-bar"
                            style={{ "--pct": `${((value ?? 0) / 10) * 100}%` }}
                          >
                            <i />
                          </span>
                        </td>
                      );
                    })}
                    {/* How far apart the judges were. A wide spread
                        means the mean above it is hiding an argument,
                        and that is worth seeing before an award is
                        decided off it. */}
                    <td className="ac-num">
                      {entry.spread === null ? (
                        "—"
                      ) : (
                        <span className={entry.spread >= 3 ? "ac-spread is-wide" : undefined}>
                          {entry.spread.toFixed(1)}
                          {entry.returned > 1 && (
                            <span className="ac-sub">
                              {entry.low.toFixed(1)}–{entry.high.toFixed(1)}
                            </span>
                          )}
                        </span>
                      )}
                    </td>
                    <td className="ac-num">{entry.votes ?? 0}</td>
                    {/* Returned vs asked. Comparing a mean of one card
                        against a mean of three is comparing different
                        things. */}
                    <td className="ac-num">
                      <span
                        className={
                          entry.returned < entry.assigned ? "ac-spread is-wide" : undefined
                        }
                      >
                        {entry.returned} / {entry.assigned}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="ac-empty">
            <strong>No scored entries</strong>
            Submitted entries will appear here once judge cards are returned.
          </div>
        )}
      </section>

      {entries.length ? (
        entries.map((entry) => (
          <section key={entry.id} className="ac-card">
            <div className="ac-card-head">
              <h2>{entry.project || "Untitled project"}</h2>
              <span className="ac-pill is-live">{entry.cards.length} cards</span>
            </div>
            <p className="ac-fine">{entry.team_name || "Unnamed team"} · average {scoreValue(entry.average)}</p>
            {entry.cards.length ? (
              <div className="ac-table-wrap">
                <table className="ac-table">
                  <thead>
                    <tr>
                      <th>Judge</th>
                      {RUBRIC.map((axis) => <th key={axis.key} className="ac-num">{axis.name}</th>)}
                      <th>Notes</th>
                    </tr>
                  </thead>
                  <tbody>
                    {entry.cards.map((card) => (
                      <tr key={`${entry.id}:${card.judge_id}`}>
                        <td><strong>{card.judge}</strong></td>
                        {RUBRIC.map((axis) => <td key={axis.key} className="ac-num">{card[axis.key] ?? "—"}</td>)}
                        <td>{card.notes || "—"}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ) : (
              <div className="ac-empty">
                <strong>No submitted cards</strong>
                Judges are assigned, but no completed scorecard has been returned.
              </div>
            )}
          </section>
        ))
      ) : (
        <div className="ac-empty">
          <strong>Nothing to review</strong>
          The score details will appear after submitted entries have judge cards.
        </div>
      )}

      <section className="ac-card">
        <div className="ac-card-head">
          <BadgeCheck size={18} strokeWidth={1.75} aria-hidden="true" />
          <h2>Certificates</h2>
          <span className="ac-pill is-live">{certificates.length}</span>
        </div>
        <p>
          Issue {EDITION.name} credentials to every submitted team. Running this again keeps
          each public id and updates its award wording.
        </p>
        <IssueCertificatesForm />
        {certificates.length ? (
          <div className="ac-table-wrap">
            <table className="ac-table">
              <thead>
                <tr>
                  <th>Credential</th>
                  <th>Team / project</th>
                  <th>Holders</th>
                  <th>Issued / revoked</th>
                  <th>Public</th>
                  <th>Action</th>
                </tr>
              </thead>
              <tbody>
                {certificates.map((certificate) => (
                  <tr key={certificate.id}>
                    <td><strong>{credentialName(certificate)}</strong><span className="ac-sub ac-mono">{certificate.id}</span></td>
                    <td>{certificate.team || "—"}<span className="ac-sub">{certificate.project || "—"}</span></td>
                    <td>{certificate.holder_names?.length ? certificate.holder_names.join(", ") : "—"}</td>
                    <td>
                      <span className={`ac-pill ${certificate.revoked_at ? "is-warn" : "is-ok"}`}>
                        {certificate.revoked_at ? "revoked" : "issued"}
                      </span>
                      <span className="ac-sub">{formatDate(certificate.revoked_at || certificate.issued_at)}</span>
                    </td>
                    <td><a href={certPath({ id: certificate.id })}>View certificate</a></td>
                    <td>{certificate.revoked_at ? "—" : <RevokeCertificateForm certificateId={certificate.id} />}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="ac-empty">
            <strong>No certificates issued</strong>
            Issue certificates after the submitted teams and awards are settled.
          </div>
        )}
      </section>
    </>
  );
}
