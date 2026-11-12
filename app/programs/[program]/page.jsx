import { notFound } from "next/navigation";
import { siDiscord, siGithub } from "simple-icons";
import { JsonLd } from "../../../components/article";
import Scene from "../../../components/scene";
import SiteFooter from "../../../components/site-footer";
import SiteHeader from "../../../components/site-header";
import WorkshopNotify from "../../../components/workshop-notify";
import { PROGRAM_DETAILS } from "../../../components/program-details";
import { hasDb } from "../../../lib/db";
import { deckFor } from "../../../lib/decks";
import { guideFor } from "../../../lib/guides";
import registry from "../../../lib/skills.generated.json";
import { PROGRAMS, programBySlug, programVenueNames, sessionDateLabel, sessionNights, sessionScheduled } from "../../../lib/programs";
import "../../../components/departure-board.css";
import "../program.css";
import "../../hub.css";
import "../voyage.css";
import {
  DISCORD,
  MEETUP,
  venueOf,
} from "../../../lib/hackathon";
import { ogImage } from "../../../lib/og";

const SITE = "https://www.shipai.club";

const SCENES = {
  "day-zero": { scene: "workbench", alt: "Dithered chart table with dividers, a ruler and a laptop. Hands-on." },
  "the-first-build": { scene: "slipway", alt: "Dithered night scene: a hull on the slipway with scaffolding and two builders at work." },
  "zero-to-launch": { scene: "launch", alt: "Dithered night scene: a finished boat sliding down the ways into the water." },
  "growth-loops": { scene: "fleet", alt: "Dithered fleet of boats under way together." },
};

const WORDS = ["Zero", "One", "Two", "Three", "Four", "Five", "Six", "Seven", "Eight", "Nine", "Ten"];

function KeyHeadline({ text, keyPhrase }) {
  const at = keyPhrase ? text.lastIndexOf(keyPhrase) : -1;
  if (at < 0) return text;
  return (
    <>
      {text.slice(0, at)}
      <span className="key">{keyPhrase}</span>
      {text.slice(at + keyPhrase.length)}
    </>
  );
}

export function generateStaticParams() {
  return PROGRAMS.map((program) => ({ program: program.slug }));
}

export async function generateMetadata({ params }) {
  const { program: programSlug } = await params;
  const program = programBySlug(programSlug);
  if (!program) return {};
  const title = `${program.name} — Ship AI Program`;
  const url = `${SITE}/programs/${program.slug}`;
  return {
    title,
    description: program.description,
    alternates: { canonical: url },
    openGraph: { title, description: program.description, url, siteName: "Ship AI", images: [ogImage({ kicker: `${program.name} · Program`, title: program.headline, key: program.headlineKey, meta: program.datesLabel || "Phoenix, Arizona", alt: `${program.name}: ${program.headline}` })] },
  };
}

function seriesSchema(program) {
  const offerings = program.sessions.flatMap((w) =>
    sessionNights(w).map((night) => ({ session: w, night }))
  );
  if (offerings.length === 0) return null;
  const start = program.startISO || `${offerings[0].night.iso}T18:00:00-07:00`;
  const end = program.endISO || `${offerings[offerings.length - 1].night.iso}T21:00:00-07:00`;
  return {
    "@context": "https://schema.org",
    "@type": "EventSeries",
    name: `${program.name} workshops`,
    description: program.description,
    startDate: start,
    endDate: end,
    eventAttendanceMode: "https://schema.org/OfflineEventAttendanceMode",
    organizer: { "@type": "Organization", name: "Ship AI", url: SITE },
    isAccessibleForFree: true,
    subEvent: offerings.map(({ session: w, night }) => {
      const venue = venueOf({ venue: night.venue || w.venue || program.defaultVenue });
      return {
        "@type": "Event",
        name: w.title,
        startDate: `${night.iso}T18:00:00-07:00`,
        url: `${SITE}/programs/${program.slug}/${w.slug}`,
        eventAttendanceMode: "https://schema.org/OfflineEventAttendanceMode",
        location: { "@type": "Place", name: venue.name, address: venue.address },
        isAccessibleForFree: true,
      };
    }),
  };
}

const lowerFirst = (text) => text.charAt(0).toLowerCase() + text.slice(1);

export default async function Page({ params }) {
  const { program: programSlug } = await params;
  const program = programBySlug(programSlug);
  if (!program) notFound();

  const manifest = registry.manifest.programs[program.slug];
  const nextProgram = program.nextProgram ? programBySlug(program.nextProgram) : null;
  const schema = seriesSchema(program);
  const venueNames = programVenueNames(program);
  const waitlistOpen = !program.startISO && hasDb();
  const past = program.status === "past";
  const running = !past && !!program.startISO;
  const art = SCENES[program.slug] || SCENES["the-first-build"];
  const count = program.sessions.length;
  const countWord = WORDS[count] || String(count);
  const detail = PROGRAM_DETAILS[program.slug];
  const ext = (href) => (href.startsWith("/") || href.startsWith("#") ? {} : { target: "_blank", rel: "noreferrer" });

  /* Each session with the files it has, read once. */
  const sessions = program.sessions.map((w) => ({
    w,
    href: `/programs/${program.slug}/${w.slug}`,
    deck: deckFor(program.slug, w.slug),
    guide: guideFor(program.slug, w.slug),
    kit: manifest?.sessions[w.slug],
    recording: !!w.media?.poster,
  }));
  const counts = [
    ["Decks", sessions.filter((s) => s.deck).length],
    ["Guides", sessions.filter((s) => s.guide).length],
    ["Skill files", manifest?.all.count || 0],
    ["Recordings", sessions.filter((s) => s.recording).length],
  ].filter(([, n]) => n > 0);

  /* Where the ship sits: the last stop once the program has finished,
     the next session while it runs, the first stop before it starts. */
  const today = new Date().toISOString().slice(0, 10);
  const upcoming = sessions.findIndex((s) => sessionNights(s.w).some((night) => night.iso >= today));
  const shipAt = past ? count - 1 : running && upcoming >= 0 ? upcoming : 0;
  const next = running && upcoming >= 0 ? sessions[upcoming] : null;

  const runningAction = program.hasHackathon
    ? { href: "/dashboard", label: "Register" }
    : { href: MEETUP, label: "RSVP on Meetup" };

  const nextStep = program.hasHackathon
    ? { href: program.hackathonHref, label: "The hackathon weekend" }
    : nextProgram
      ? { href: `/programs/${nextProgram.slug}`, label: `Next up: ${nextProgram.name}` }
      : null;

  const firstNight = sessions.flatMap((s) => sessionNights(s.w))[0];

  return (
    <>
      {schema && <JsonLd data={schema} />}
      <SiteHeader current="/programs" cta={<a className="btn btn-solid btn-sm nav-cta" href={DISCORD} target="_blank" rel="noreferrer"><svg viewBox="0 0 24 24" width={18} height={18} fill="currentColor" aria-hidden="true" focusable="false"><path d={siDiscord.path} /></svg>Join the Discord</a>} />

      <main>
        <section className="hero vy-hero" aria-labelledby="pg-title">
          <p className="vy-crumb"><a href="/programs">← All programs</a></p>
          <h1 className="hero-h1" id="pg-title">
            <span className="vy-name">{program.name}</span>
            <KeyHeadline text={program.headline} keyPhrase={program.headlineKey} />
          </h1>
          <p className="hero-lede">{program.tagline}</p>
        </section>

        <div className="hub-board">
          <div className="stage dboard-stage vy-stage"><Scene scene={art.scene} alt={art.alt} /></div>
          <aside className="window dboard vy-board" aria-label={past ? "Program materials" : "Program dates"}>
            <div className="window-bar">
              <b>{past ? "Materials, published free" : running ? "Next session" : "Next cohort"}</b>
              <span>{[past && program.datesLabel ? `Ran ${program.datesLabel}` : null, `${countWord} sessions`, venueNames.join(" & ")].filter(Boolean).join(" · ")}</span>
            </div>
            {past ? (
              <div className="dboard-row vy-row vy-row-past">
                <dl className="vy-counts">{counts.map(([label, n]) => <div key={label}><dt>{label}</dt><dd>{n}</dd></div>)}</dl>
                <div className="vy-act">
                  <a className="btn btn-solid" href="#sessions">Open the materials</a>
                  <p className="vy-links">
                    {manifest && <a className="link" href={`/skills/${manifest.all.file}`} download>Download all {manifest.all.count} skills</a>}
                    {program.hasHackathon && <a className="link" href={`${program.hackathonHref}/results`}>See the hackathon results</a>}
                  </p>
                </div>
              </div>
            ) : running ? (
              <div className="dboard-row vy-row vy-row-past">
                <p className="vy-when"><b>{next ? next.w.eventTitle : program.datesLabel}</b><span>{next ? sessionDateLabel(next.w) : `${countWord} sessions`}</span></p>
                <div className="vy-act"><a className="btn btn-solid" href={runningAction.href} {...ext(runningAction.href)}>{runningAction.label}</a></div>
              </div>
            ) : (
              <div className="dboard-row vy-row">
                <p className="vy-when"><b>Dates to be announced</b><span>One email when they are set</span></p>
                {waitlistOpen ? (
                  <div className="vy-signup">
                    <WorkshopNotify slug={program.slug} name={program.name} prompt="Email me when the dates are set" startOpen askGoal />
                  </div>
                ) : (
                  <div className="vy-act"><a className="btn btn-solid" href={DISCORD} target="_blank" rel="noreferrer">Get notified in Discord</a></div>
                )}
              </div>
            )}
          </aside>
        </div>

        <section className="section vy-log" id="sessions" aria-labelledby="pg-sessions-title">
          <div className="section-head">
            <h2 id="pg-sessions-title">What you <span className="key">leave with.</span></h2>
          </div>
          <div className="vy-voyage">
            <p className="vy-mark vy-mark-start">{past && firstNight ? `Departed ${firstNight.date}, ${firstNight.iso.slice(0, 4)}` : running ? "Under way" : "In harbor"}</p>
            <ol className="vy-route">
              {sessions.map(({ w, href, deck, guide, kit, recording }, index) => (
                <li key={w.slug} className={index === shipAt ? "vy-stop has-ship" : "vy-stop"}>
                  <span className="vy-dot" aria-hidden="true" />
                  <article className="vy-card">
                    <span className="vy-label">{[w.act, sessionScheduled(w) ? sessionDateLabel(w) : null].filter(Boolean).join(" · ") || `Session ${w.n}`}</span>
                    <h3><a href={href}>{w.eventTitle}</a></h3>
                    <p className="vy-sub">{w.title}</p>
                    <p className="vy-take"><span>You leave with</span>{w.take}</p>
                    {(deck || guide || kit || recording) && (
                      <p className="vy-files">
                        {deck && <a href={`${href}/deck`}>Slides</a>}
                        {guide && <a href={`${href}/guide`}>Guide</a>}
                        {kit && <a href={`/skills/${kit.file}`} download>{kit.count} skill{kit.count === 1 ? "" : "s"}</a>}
                        {recording && <a href={href}>Recording</a>}
                      </p>
                    )}
                  </article>
                </li>
              ))}
            </ol>
            <p className="vy-mark vy-mark-end">
              {past && program.hasHackathon
                ? <>Arrived: <a href={`${program.hackathonHref}/results`}>the hackathon weekend</a></>
                : past && nextProgram
                  ? <>Arrived. Next: <a href={`/programs/${nextProgram.slug}`}>{nextProgram.name}</a></>
                  : detail
                    ? `Arrival: ${lowerFirst(detail.outcome)}`
                    : "Arrival"}
            </p>
          </div>
        </section>

        <section className="band" aria-labelledby="pg-final-title">
          <Scene scene="stars" mode="ascii" band className="band-bg" />
          <div className="final">
            <h2 id="pg-final-title">Between sessions, it lives <span className="key">in Discord.</span></h2>
            <p className="lede">Recaps, archive links, questions and everyone&apos;s work in progress.</p>
            <div className="cta-row">
              <a className="btn btn-solid" href={DISCORD} target="_blank" rel="noreferrer">Join the Discord</a>
              {nextStep && <a className="btn btn-ghost" href={nextStep.href}>{nextStep.label}</a>}
            </div>
            {program.templateRepo && (
              <p className="pg-final-link">
                <a href={program.templateRepo} target="_blank" rel="noreferrer">
                  <svg viewBox="0 0 24 24" width={14} height={14} fill="currentColor" aria-hidden="true"><path d={siGithub.path} /></svg>
                  Get the template repo
                </a>
              </p>
            )}
          </div>
          <div className="final-stage">
            <Scene scene="harbor" band alt="Dithered harbor at dusk: many small boats at their moorings with their lights on. The community." />
            <p>Harbor at dusk · Phoenix, Arizona</p>
          </div>
        </section>
      </main>

      <SiteFooter />
    </>
  );
}
