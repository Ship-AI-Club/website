import { notFound } from "next/navigation";

import { requireAdmin } from "../../../../lib/auth";
import { summarize } from "../../../../lib/mentee-assessment";
import { getMenteeAssessment } from "../../../../lib/mentee-assessment-store";
import AssessmentForm, { DeleteAssessment } from "../assessment-form";
import "../mentees.css";

export const metadata = {
  title: "Mentee AI assessment — Ship AI",
  robots: { index: false, follow: false },
};

export const dynamic = "force-dynamic";

export default async function Page({ params }) {
  const { id } = await params;
  await requireAdmin(`/admin/mentees/${id}`);
  const record = await getMenteeAssessment(id);
  if (!record) notFound();
  const summary = summarize(record.scores);

  return (
    <>
      <div className="ac-head">
        <p className="ac-kicker"><a href="/admin/mentees">Mentee AI assessments</a></p>
        <h1>{record.mentee_name}</h1>
        <p>{record.venture || "No venture listed"}{record.email ? ` · ${record.email}` : ""}</p>
      </div>

      <section className="ac-card">
        <div className="ac-card-head"><h2>Where they are</h2><span className="ac-pill">{summary.overall == null ? "Not assessed" : `${summary.overall} · ${summary.label}`}</span></div>
        <div className="mx-bars">
          {summary.areas.map((a) => (
            <div key={a.key}>
              <strong>{a.title}</strong>
              <i aria-hidden="true"><b style={{ width: `${a.score == null ? 0 : (a.score / 4) * 100}%` }} /></i>
              <span>{a.score == null ? "Not assessed" : `${a.score} · ${a.label}`}</span>
            </div>
          ))}
        </div>
      </section>

      <AssessmentForm record={record} />
      <div className="ac-actions"><DeleteAssessment id={record.id} /></div>
    </>
  );
}
