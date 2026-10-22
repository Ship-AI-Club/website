import { requireAdmin } from "../../../lib/auth";
import { summarize } from "../../../lib/mentee-assessment";
import { listMenteeAssessments } from "../../../lib/mentee-assessment-store";
import "./mentees.css";

export const metadata = {
  title: "Mentee AI assessments — Ship AI",
  robots: { index: false, follow: false },
};

export const dynamic = "force-dynamic";

function formatDate(value) {
  if (!value) return "—";
  const date = new Date(`${value}T00:00:00Z`);
  if (Number.isNaN(date.getTime())) return "—";
  return new Intl.DateTimeFormat("en-US", { timeZone: "UTC", month: "short", day: "numeric", year: "numeric" }).format(date);
}

export default async function Page() {
  await requireAdmin("/admin/mentees");
  const rows = await listMenteeAssessments();

  return (
    <>
      <div className="ac-head">
        <p className="ac-kicker">Admin · Venture Café Phoenix mentorship</p>
        <h1>Mentee AI assessments</h1>
        <p>Run a mini assessment live with a mentee across AI fluency, their venture, building with AI, and risk and adoption. Score what you can, skip the rest, and come back to it next session.</p>
        <div className="ac-actions"><a href="/admin/mentees/new" className="btn btn-solid">New assessment</a></div>
      </div>

      <section className="ac-card">
        <div className="ac-card-head"><h2>Assessments</h2><span className="ac-pill">{rows.length}</span></div>
        {rows.length > 0 ? (
          <div className="ac-table-wrap">
            <table className="ac-table">
              <thead><tr><th>Mentee</th><th>Session</th><th>Overall</th><th>Fluency</th><th>Venture</th><th>Building</th><th>Risk</th></tr></thead>
              <tbody>
                {rows.map((row) => {
                  const s = summarize(row.scores);
                  return (
                    <tr key={row.id}>
                      <td><a href={`/admin/mentees/${row.id}`}><strong>{row.mentee_name}</strong></a><span className="ac-sub">{row.venture || "No venture listed"}</span></td>
                      <td>{formatDate(row.session_date)}</td>
                      <td>{s.overall == null ? "—" : <span className="ac-pill">{s.overall} · {s.label}</span>}</td>
                      {s.areas.map((a) => <td key={a.key}>{a.score ?? "—"}</td>)}
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        ) : <p className="ac-empty">No assessments yet. Start one in your next mentee session.</p>}
      </section>
    </>
  );
}
