import { requireAdmin } from "../../../../lib/auth";
import AssessmentForm from "../assessment-form";
import "../mentees.css";

export const metadata = {
  title: "New mentee AI assessment — Ship AI",
  robots: { index: false, follow: false },
};

export const dynamic = "force-dynamic";

export default async function Page() {
  await requireAdmin("/admin/mentees/new");
  return (
    <>
      <div className="ac-head">
        <p className="ac-kicker"><a href="/admin/mentees">Mentee AI assessments</a></p>
        <h1>New assessment</h1>
        <p>Open one area at a time and pick the level that matches what the mentee tells you. Areas you skip stay out of the score.</p>
      </div>
      <AssessmentForm />
    </>
  );
}
