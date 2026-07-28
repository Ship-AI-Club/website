import { Utensils } from "lucide-react";

import { requireAdmin } from "../../../../lib/auth";
import { cateringSummary } from "../../../../lib/ops";

export const dynamic = "force-dynamic";

export const metadata = {
  title: "Catering — Ship AI",
  robots: { index: false, follow: false },
};

const DAY_LABELS = { friday: "Friday", saturday: "Saturday", sunday: "Sunday" };
const DAYS = ["friday", "saturday", "sunday"];

export default async function Page() {
  const admin = await requireAdmin("/admin/ops/catering");
  const summary = await cateringSummary();

  return (
    <>
      <div className="ac-head">
        <p className="ac-kicker">Administration · Operations</p>
        <h1>Catering</h1>
        <p>
          {admin.name || admin.email}. Meal counts for everyone expected — entrants and crew — plus daily check-ins.
        </p>
      </div>

      <section className="ac-card">
        <div className="ac-card-head">
          <Utensils size={18} strokeWidth={1.75} aria-hidden="true" />
          <h2>Attendance</h2>
        </div>
        <div className="ac-stats">
          <div className="ac-stat">
            <b>{summary.registered}</b>
            <span>expected</span>
          </div>
          {DAYS.map((day) => (
            <div className="ac-stat" key={day}>
              <b>{summary.dayCounts[day]}</b>
              <span>{DAY_LABELS[day]} check-ins</span>
            </div>
          ))}
        </div>
        <p className="ac-fine">
          Expected is everyone due in the room — entrants plus judges, mentors, sponsors and volunteers. On-site is who has actually checked in that day.
        </p>
      </section>

      <section className="ac-card">
        <div className="ac-card-head">
          <h2>Meals</h2>
          <span className="ac-pill">{summary.meals.length}</span>
        </div>
        <div className="ac-table-wrap">
          <table className="ac-table">
            <thead>
              <tr>
                <th>Day</th>
                <th>Meal</th>
                <th className="ac-num">Expected</th>
                <th className="ac-num">On-site</th>
              </tr>
            </thead>
            <tbody>
              {summary.meals.map((meal) => (
                <tr key={`${meal.day}-${meal.meal}`}>
                  <td>{DAY_LABELS[meal.day]}</td>
                  <td>{meal.meal}</td>
                  <td className="ac-num">{meal.expected}</td>
                  <td className="ac-num">{meal.onSite}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      <section className="ac-card">
        <div className="ac-card-head">
          <h2>Dietary summary</h2>
          <span className="ac-pill">{summary.dietary.length}</span>
        </div>
        <p>Grouped dietary notes for everyone being fed, crew included. Plain text, for reading down a phone to a caterer.</p>
        {summary.dietary.length > 0 ? (
          <ul className="ac-list">
            {summary.dietary.map((item) => (
              <li key={item.dietary}>
                <strong>{item.dietary}</strong>
                <span className="ac-list-end">
                  {item.count} {item.count === 1 ? "person" : "people"}
                </span>
              </li>
            ))}
          </ul>
        ) : (
          <div className="ac-empty">
            <strong>No dietary notes.</strong>
            Dietary notes appear here as people fill them in.
          </div>
        )}
      </section>
    </>
  );
}
