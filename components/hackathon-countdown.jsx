"use client";

import { useEffect, useState } from "react";

import { EVENT } from "../lib/hackathon";

/* ------------------------------------------------------------------
   Time until the doors open.

   Three states, because a countdown that goes negative is worse than
   no countdown: it counts down to the Friday, says the weekend is
   running while it's running, and points at the results once it's
   over. The page is revalidated every five minutes and this ticks
   every second, so the clock is the one part of it that's genuinely
   live.

   `now` starts null and is only set in an effect. The page is
   prerendered, so rendering a real duration on the server would mean
   shipping HTML that says 82d 04m 28s and hydrating against a client
   that says 27s — a mismatch React would complain about, on the
   busiest page of the site. The dashes are what the first paint
   shows; they last one frame.
------------------------------------------------------------------ */

const CELLS = [
  ["days", "days"],
  ["hours", "hrs"],
  ["minutes", "min"],
  ["seconds", "sec"],
];

function split(target, now) {
  const total = Math.max(0, Math.floor((target - now) / 1000));
  return {
    days: Math.floor(total / 86400),
    hours: Math.floor((total % 86400) / 3600),
    minutes: Math.floor((total % 3600) / 60),
    seconds: total % 60,
  };
}

/* `reveal` goes on the section itself, never on a wrapper around it:
   the helper is display:inline-block, so a wrapper shrink-wraps the
   whole clock and leaves margin:auto nothing to centre. .hk-facts
   takes the same precaution for the same reason. */
export default function HackathonCountdown({ delay = "440ms" }) {
  const [now, setNow] = useState(null);

  useEffect(() => {
    setNow(Date.now());
    const timer = window.setInterval(() => setNow(Date.now()), 1000);
    return () => window.clearInterval(timer);
  }, []);

  const start = new Date(EVENT.startISO).getTime();
  const end = new Date(EVENT.endISO).getTime();
  const deadline = new Date(EVENT.deadlineISO).getTime();

  const started = now !== null && now >= start;
  const closed = now !== null && now >= deadline;
  const finished = now !== null && now >= end;

  /* Four states, because the number that matters keeps changing.
     Before the Friday it's when to turn up; once it's running it's
     how long you've got; after Sunday noon submissions are shut and
     the next thing anyone cares about is the awards. Counting to a
     deadline that has passed would leave the clock frozen at zero for
     the five hours that are, for the teams, the whole point. */
  const target = closed ? end : started ? deadline : start;
  const time = now === null ? null : split(target, now);

  const label = closed
    ? "Awards in"
    : started
      ? "Submissions close in"
      : "Doors open in";

  const foot = closed
    ? "Submissions are closed. Pitches, then the awards."
    : started
      ? `Deadline ${EVENT.deadline}. No late submissions.`
      : `${EVENT.dates} · ${EVENT.venue}, ${EVENT.city} · Arizona time`;

  if (finished) {
    return (
      <section
        className="hk-countdown reveal"
        style={{ "--d": delay }}
        aria-label="Hackathon countdown"
      >
        <p className="hk-countdown-label">{EVENT.datesShort} · that&apos;s a wrap</p>
        <p className="hk-countdown-done">
          Zero to Launch {new Date(EVENT.startISO).getFullYear()} is over.{" "}
          <a href="/hackathon/results">See what shipped</a>.
        </p>
      </section>
    );
  }

  return (
    <section
      className="hk-countdown reveal"
      style={{ "--d": delay }}
      aria-label="Hackathon countdown"
    >
      <p className="hk-countdown-label">{label}</p>

      {/* role="timer" names it, aria-live="off" keeps it quiet: a
          screen reader announcing a new value every second is
          unusable, and the same information is in the copy around
          it. */}
      <div className="hk-countdown-cells" role="timer" aria-live="off">
        {CELLS.map(([key, label]) => (
          <div key={key} className="hk-countdown-cell">
            <b>{time === null ? "––" : String(time[key]).padStart(2, "0")}</b>
            <span>{label}</span>
          </div>
        ))}
      </div>

      <p className="hk-countdown-foot">{foot}</p>
    </section>
  );
}
