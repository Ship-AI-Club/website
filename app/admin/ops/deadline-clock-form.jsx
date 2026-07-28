"use client";

import { Clock3 } from "lucide-react";
import { useEffect, useState } from "react";

function distanceFromDeadline(deadlineISO, now) {
  const distance = new Date(deadlineISO).getTime() - now;
  const totalSeconds = Math.floor(Math.abs(distance) / 1000);
  return {
    expired: distance < 0,
    days: Math.floor(totalSeconds / 86400),
    hours: Math.floor((totalSeconds % 86400) / 3600),
    minutes: Math.floor((totalSeconds % 3600) / 60),
    seconds: totalSeconds % 60,
  };
}

export default function DeadlineClockForm({ deadlineISO }) {
  const [now, setNow] = useState(null);

  useEffect(() => {
    setNow(Date.now());
    const timer = window.setInterval(() => setNow(Date.now()), 1000);
    return () => window.clearInterval(timer);
  }, []);

  const time = now === null ? null : distanceFromDeadline(deadlineISO, now);
  return (
    <section className="ac-card is-accent" aria-labelledby="deadline-title">
      <div className="ac-card-head">
        <Clock3 size={18} strokeWidth={1.75} aria-hidden="true" />
        <h2 id="deadline-title">Submission deadline</h2>
      </div>
      <div className="ac-total">
        <b>
          {time
            ? `${time.days}d ${String(time.hours).padStart(2, "0")}h ${String(time.minutes).padStart(2, "0")}m ${String(time.seconds).padStart(2, "0")}s`
            : "—"}
        </b>
        <span>{time?.expired ? "past deadline" : "remaining"}</span>
      </div>
      <p className="ac-fine">
        {time?.expired
          ? "Submissions are past the published Arizona deadline."
          : "The clock uses the published Arizona deadline."}
      </p>
    </section>
  );
}
