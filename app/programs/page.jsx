import { ArrowRight, CalendarDays, MapPin } from "lucide-react";
import { JsonLd } from "../../components/article";
import { PROGRAMS } from "../../lib/programs";
import { DISCORD, venueOf } from "../../lib/hackathon";

const SITE = "https://www.shipai.club";

const STATUS_LABELS = {
  running: "Running now",
  upcoming: "Upcoming",
  tbd: "Dates TBD",
  past: "Past program",
};

/* Venues alternate inside a program, so the card reads them off the
   sessions rather than the default — Zero to Launch is two rooms, not
   one. */
function venueNames(program) {
  return [
    ...new Set(
      program.sessions.map((w) => venueOf({ ...w, venue: w.venue || program.defaultVenue }).name)
    ),
  ];
}

const LIST_SCHEMA = {
  "@context": "https://schema.org",
  "@type": "ItemList",
  name: "Ship AI programs",
  itemListElement: PROGRAMS.map((program, i) => ({
    "@type": "ListItem",
    position: i + 1,
    item: {
      "@type": "EducationalOccupationalProgram",
      name: program.name,
      description: program.description,
      url: `${SITE}/programs/${program.slug}`,
      numberOfCredits: program.sessions.length,
      provider: { "@type": "Organization", name: "Ship AI", url: SITE },
      isAccessibleForFree: true,
      ...(program.startISO ? { startDate: program.startISO } : {}),
      ...(program.endISO ? { endDate: program.endISO } : {}),
    },
  })),
};

export const metadata = {
  title: "Programs — Ship AI",
  description: "Multi-session Ship AI programs for builders in Phoenix and Tempe, free and open to all.",
  alternates: { canonical: "https://www.shipai.club/programs" },
  openGraph: {
    title: "Programs — Ship AI",
    description: "Multi-session Ship AI programs for builders, free and open to all.",
    url: "https://www.shipai.club/programs",
    siteName: "Ship AI",
    images: [{ url: "/og-image.jpg", width: 1200, height: 630 }],
  },
};

export default function Page() {
  return (
    <>
      <JsonLd data={LIST_SCHEMA} />
      <header className="nav">
        <a href="/" className="brand">
          <img src="/logo-icon.png" alt="" width={26} height={26} />
          <span>Ship AI</span>
        </a>
        <nav>
          <a href="/programs">Programs</a>
          <a href="/programs/zero-to-launch/hackathon">Hackathon</a>
        </nav>
        <div className="nav-ctas">
          <a className="btn btn-ghost" href={DISCORD} target="_blank" rel="noreferrer">Discord</a>
          <a className="btn btn-solid" href="/dashboard">Register</a>
        </div>
      </header>

      <main className="hk-wsi">
        <p className="kicker">Ship AI programs</p>
        <h1>Learn in public. Ship something real.</h1>
        <p className="article-lede">
          Each program is a focused run of free sessions for builders in Phoenix. Drop into one,
          follow the full series, or take the published materials and run it on your own schedule.
        </p>

        <ol className="hk-ws-list">
          {PROGRAMS.map((program) => {
            const venues = venueNames(program);
            const status = STATUS_LABELS[program.status];
            /* "Dates TBD Dates TBD" — the chip and the status say the same
               thing for an unscheduled program, so only one of them runs. */
            const dates = program.datesLabel && program.datesLabel !== status ? program.datesLabel : null;
            return (
              <li key={program.slug}>
                <a href={`/programs/${program.slug}`}>
                  <div className="hk-ws-head">
                    <span className={`hk-ws-act${program.startISO ? "" : " is-tbd"}`}>{status}</span>
                    {dates && <span className="hk-ws-date">{dates}</span>}
                    <span className="hk-ws-venue">{venues.join(" & ")}</span>
                  </div>
                  <h3>{program.name}</h3>
                  <p className="hk-ws-sub">{program.headline}</p>
                  <p className="hk-ws-copy">{program.tagline}</p>
                  <p className="hk-ws-take">
                    <CalendarDays size={13} strokeWidth={1.75} aria-hidden="true" /> {program.sessions.length} sessions
                    <span> · </span><MapPin size={13} strokeWidth={1.75} aria-hidden="true" /> Phoenix
                  </p>
                  <span className="hk-ws-more">View the program <ArrowRight size={14} strokeWidth={1.75} aria-hidden="true" /></span>
                </a>
              </li>
            );
          })}
        </ol>
      </main>

      <footer className="footer">
        <div className="brand">
          <img src="/logo-icon.png" alt="" width={22} height={22} />
          <span>Ship AI</span>
        </div>
        <p>Phoenix &amp; Tempe, Arizona</p>
        <nav><a href="/">Home</a><a href="/programs">Programs</a><a href="/programs/zero-to-launch/hackathon">Hackathon</a></nav>
        <p className="fine">© 2026 Ship AI</p>
      </footer>
    </>
  );
}
