import { ArrowRight, Scale } from "lucide-react";

import { requireRole } from "../../lib/auth";
import { RUBRIC } from "../../lib/accounts";
import { judgeQueue } from "../../lib/store";
import { EVENT } from "../../lib/hackathon";

export const metadata = {
  title: "Judging — Ship AI",
  robots: { index: false, follow: false },
};

export default async function Page() {
  const user = await requireRole("judge", "/judge");
  const queue = await judgeQueue(user.id);

  const done = queue.filter((q) => q.scored_at).length;

  return (
    <>
      <div className="ac-head">
        <p className="ac-kicker">Sunday · {EVENT.venue}</p>
        <h1>Your queue</h1>
        <p>
          Five minutes each plus three of questions, live product on screen. Score against the
          four published criteria — the same four the teams have been able to read since
          August.
        </p>
      </div>

      <section className="ac-card">
        <div className="ac-card-head">
          <Scale size={18} strokeWidth={1.75} aria-hidden="true" />
          <h2>How it&apos;s scored</h2>
        </div>
        <ul className="ac-list">
          {RUBRIC.map((c) => (
            <li key={c.key}>
              <strong className="ac-mono">{c.pct}%</strong>
              <strong>{c.name}</strong>
              <span>{c.copy}</span>
            </li>
          ))}
        </ul>
        <p className="ac-fine">
          A team&apos;s score is the mean of the completed cards. Half-finished cards
          don&apos;t count, in either direction.
        </p>
      </section>

      {queue.length === 0 ? (
        <div className="ac-empty">
          <strong>Nothing assigned yet.</strong>
          Entries are dealt out once submissions close at {EVENT.deadline}. You&apos;ll get an
          email when your queue is ready.
        </div>
      ) : (
        <section className="ac-card">
          <div className="ac-card-head">
            <h2>
              {queue.length} to judge
            </h2>
            <span className={`ac-pill ${done === queue.length ? "is-ok" : "is-warn"}`}>
              {done} of {queue.length} filed
            </span>
          </div>

          <div className="ac-table-wrap">
            <table className="ac-table">
              <thead>
                <tr>
                  <th>Project</th>
                  <th>Category</th>
                  <th className="ac-num">Your score</th>
                  <th>Status</th>
                  <th />
                </tr>
              </thead>
              <tbody>
                {queue.map((entry) => (
                  <tr key={entry.id}>
                    <td>
                      <strong>{entry.project || "Untitled"}</strong>
                      <span className="ac-sub">{entry.team_name}</span>
                    </td>
                    <td>{entry.category || "—"}</td>
                    <td className="ac-num">
                      {entry.total === null ? "—" : entry.total.toFixed(1)}
                    </td>
                    <td>
                      {entry.conflict ? (
                        <span className="ac-pill is-warn">conflict</span>
                      ) : entry.scored_at ? (
                        <span className="ac-pill is-ok">filed</span>
                      ) : (
                        <span className="ac-pill">to do</span>
                      )}
                    </td>
                    <td className="ac-num">
                      <a href={`/judge/${entry.id}`}>
                        {entry.scored_at ? "Review" : "Score"}
                        <ArrowRight
                          size={13}
                          strokeWidth={1.75}
                          aria-hidden="true"
                          style={{ marginLeft: ".3rem", verticalAlign: "-1px" }}
                        />
                      </a>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>
      )}
    </>
  );
}
