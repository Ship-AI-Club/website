import { ArrowRight, Scale } from "lucide-react";

import { requireRole } from "../../lib/auth";
import { judgeQueue } from "../../lib/store";
import { FOUNDER_WEEKEND as FW } from "../../lib/founder-weekend";
import { CURRENT_HACKATHON_ID, hackathonById } from "../../lib/hackathons";

export const metadata = {
  title: "Judging — Ship AI",
  robots: { index: false, follow: false },
};

export default async function Page() {
  const user = await requireRole("judge", "/judge");
  const queue = await judgeQueue(user.id);

  const done = queue.filter((q) => q.scored_at).length;
  const current = hackathonById(CURRENT_HACKATHON_ID);

  return (
    <>
      <div className="ac-head">
        <p className="ac-kicker">{FW.name} · {FW.datesShort}</p>
        <h1>Your queue</h1>
        <p>
          Open the live product, watch the five-minute pitch, and score six criteria
          equally, from {current.scoreMin} to {current.scoreMax}.
        </p>
      </div>

      <section className="ac-card">
        <h2>Review every submitted project</h2>
        <p className="ac-fine">The shared presentation order is ready for all judges. No assignments needed.</p>
        <a className="btn btn-solid" href={`/judge/presentations?event=${current.id}`}>Open presentation order</a>
      </section>

      <section className="ac-card">
        <div className="ac-card-head">
          <Scale size={18} strokeWidth={1.75} aria-hidden="true" />
          <h2>How it&apos;s scored</h2>
        </div>
        <ul className="ac-list">
          {current.rubric.map((c) => (
            <li key={c.key}>
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
          Score from the presentation order. Entries assigned to you by the organisers
          show up here.
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
