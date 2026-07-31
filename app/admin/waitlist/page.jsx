/* Why this exists: a program with no dates can still be measured — this is who wants it. */

import { ClipboardList, Users } from "lucide-react";

import { requireAdmin } from "../../../lib/auth";
import { programBySlug } from "../../../lib/programs";
import { waitlistCounts, waitlistEntries } from "../../../lib/store";

export const metadata = {
  title: "Waitlist — Ship AI",
  robots: { index: false, follow: false },
};

export const dynamic = "force-dynamic";

function programName(slug) {
  return programBySlug(slug)?.name || slug;
}

function formatDate(value) {
  if (!value) return "—";
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "—";
  return date.toLocaleString("en-US", { dateStyle: "medium", timeStyle: "short" });
}

export default async function Page() {
  const admin = await requireAdmin();
  void admin;

  const [counts, entries] = await Promise.all([waitlistCounts(), waitlistEntries()]);

  /* One query, grouped here — a waitlist is small enough to read in a
     single pass, and this keeps the per-program tables in the same
     newest-first order the query already returned. */
  const byProgram = new Map();
  for (const entry of entries) {
    if (!byProgram.has(entry.program)) byProgram.set(entry.program, []);
    byProgram.get(entry.program).push(entry);
  }

  const total = entries.length;

  return (
    <>
      <div className="ac-head">
        <p className="ac-kicker">Admin / demand</p>
        <h1>Waitlist</h1>
        <p>
          Everyone who asked to hear when an unscheduled program gets dates, and what they said
          they want working by the end of it. Read the goals before you set the curriculum.
        </p>
      </div>

      {total > 0 && (
        <div className="ac-stats">
          <div className="ac-stat">
            <b>{total}</b>
            <span>Total signups</span>
          </div>
          {counts.map((row) => (
            <div className="ac-stat" key={row.program}>
              <b>{row.n}</b>
              <span>{programName(row.program)}</span>
            </div>
          ))}
        </div>
      )}

      {total === 0 ? (
        <section className="ac-card">
          <div className="ac-card-head">
            <Users size={18} strokeWidth={1.75} aria-hidden="true" />
            <h2>Signups</h2>
          </div>
          <div className="ac-empty">
            <strong>Nobody on the list yet</strong>
            <p>
              The form is on every program page that has no dates on it. Signups land here the
              moment somebody fills it in.
            </p>
          </div>
        </section>
      ) : (
        [...byProgram.entries()].map(([slug, rows]) => (
          <section className="ac-card" key={slug}>
            <div className="ac-card-head">
              <ClipboardList size={18} strokeWidth={1.75} aria-hidden="true" />
              <h2>{programName(slug)}</h2>
              <span className="ac-pill is-live">{rows.length}</span>
            </div>
            <div className="ac-table-wrap">
              <table className="ac-table">
                <thead>
                  <tr>
                    <th>Name</th>
                    <th>Company</th>
                    <th>Email</th>
                    <th>Wants working</th>
                    <th>Notes</th>
                    <th>Signed up</th>
                  </tr>
                </thead>
                <tbody>
                  {rows.map((row) => (
                    <tr key={row.id}>
                      <td>
                        <strong>{row.name || "—"}</strong>
                      </td>
                      <td>{row.company || "—"}</td>
                      <td>
                        <a href={`mailto:${row.email}`}>{row.email}</a>
                      </td>
                      <td>{row.goal || "—"}</td>
                      <td>{row.notes || "—"}</td>
                      <td>{formatDate(row.created_at)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </section>
        ))
      )}

      <p className="ac-note">
        These addresses were given for one thing: the dates. They are not a marketing list and
        they are not a broadcast segment.
      </p>
    </>
  );
}
