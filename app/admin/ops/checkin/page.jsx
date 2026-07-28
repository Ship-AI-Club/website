import { ClipboardCheck } from "lucide-react";

import { requireAdmin } from "../../../../lib/auth";
import { CHECKIN_DAYS, checkinRoster, eventDay } from "../../../../lib/ops";
import CheckinForm from "../checkin-form";

export const dynamic = "force-dynamic";

export const metadata = {
  title: "Check-in — Ship AI",
  robots: { index: false, follow: false },
};

const DAY_LABELS = { friday: "Friday", saturday: "Saturday", sunday: "Sunday" };

function requestedDay(searchParams) {
  const raw = Array.isArray(searchParams?.day) ? searchParams.day[0] : searchParams?.day;
  const value = String(raw ?? "").trim().toLowerCase();
  return CHECKIN_DAYS.includes(value) ? value : eventDay();
}

export default async function Page({ searchParams }) {
  const admin = await requireAdmin();
  const params = (await searchParams) || {};
  const day = requestedDay(params);
  const roster = await checkinRoster(day);
  const checkedIn = roster.filter((row) => row.checked_in_at).length;

  return (
    <>
      <div className="ac-head">
        <p className="ac-kicker">Administration · Operations</p>
        <h1>Check-in</h1>
        <p>
          {admin.name || admin.email}. {DAY_LABELS[day]} active registration roster.
        </p>
      </div>

      <nav className="ac-actions" aria-label="Event day">
        {CHECKIN_DAYS.map((option) => (
          <a
            key={option}
            className={`btn ${option === day ? "btn-solid" : "btn-ghost"}`}
            href={`/admin/ops/checkin?day=${option}`}
            aria-current={option === day ? "page" : undefined}
          >
            {DAY_LABELS[option]}
          </a>
        ))}
      </nav>

      <section className="ac-card">
        <div className="ac-card-head">
          <ClipboardCheck size={18} strokeWidth={1.75} aria-hidden="true" />
          <h2>{DAY_LABELS[day]} check-in</h2>
          <span className="ac-pill">{roster.length} registered</span>
        </div>
        <div className="ac-total">
          <b>{checkedIn} of {roster.length}</b>
          <span>checked in</span>
        </div>
        <CheckinForm day={day} roster={roster} />
      </section>
    </>
  );
}
