import { notFound } from "next/navigation";
import { ArrowRight, BookOpen, Download, Play, Presentation } from "lucide-react";
import { siGithub } from "simple-icons";
import { JsonLd } from "../../../components/article";
import Scene from "../../../components/scene";
import SiteFooter from "../../../components/site-footer";
import SiteHeader from "../../../components/site-header";
import { hasDb } from "../../../lib/db";
import { deckFor } from "../../../lib/decks";
import { guideFor } from "../../../lib/guides";
import registry from "../../../lib/skills.generated.json";
import { PROGRAMS, programBySlug, programVenueNames, sessionDateLabel, sessionNights, sessionScheduled, sessionVenues } from "../../../lib/programs";
import WaitlistForm from "./waitlist-form";
import "../program.css";
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

const STATUS = {
  past: { label: "Finished", className: "tag tag-tbd" },
  running: { label: "RSVPs open", className: "tag tag-go" },
  tbd: { label: "Dates TBD", className: "tag tag-tbd" },
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

export default async function Page({ params }) {
  const { program: programSlug } = await params;
  const program = programBySlug(programSlug);
  if (!program) notFound();

  const manifest = registry.manifest.programs[program.slug];
  const nextProgram = program.nextProgram ? programBySlug(program.nextProgram) : null;
  const schema = seriesSchema(program);
  const venueNames = programVenueNames(program);
  const someScheduled = program.sessions.some(sessionScheduled);
  const waitlistOpen = !program.startISO && hasDb();
  const past = program.status === "past";
  const status = STATUS[program.status] || STATUS.tbd;
  const art = SCENES[program.slug] || SCENES["the-first-build"];
  const count = program.sessions.length;
  const countWord = WORDS[count] || String(count);

  const primary = program.hasHackathon && past
    ? { href: `${program.hackathonHref}/results`, label: "See the results" }
    : past
      ? { href: "#sessions", label: "Browse the sessions", internal: true }
      : program.hasHackathon
        ? { href: "/dashboard", label: "Register", internal: true }
        : waitlistOpen
          ? { href: "#waitlist", label: "Join the waitlist", internal: true }
          : program.startISO
            ? { href: MEETUP, label: "RSVP on Meetup" }
            : { href: DISCORD, label: "Get notified in Discord" };
  const ext = (link) => (link.internal || link.href.startsWith("/") ? {} : { target: "_blank", rel: "noreferrer" });

  const navLinks = [
    { href: "/programs", label: "Programs" },
    { href: "#sessions", label: "Sessions" },
    ...(manifest ? [{ href: `/programs/${program.slug}/skills`, label: "Skills" }] : []),
    ...(program.hasHackathon ? [{ href: program.hackathonHref, label: "Hackathon" }] : []),
  ];

  const place = venueNames.length > 1 ? "Phoenix area" : "Phoenix";
  const cost = past ? "Free" : program.status === "running" ? "See registration" : "TBD";
  const costLabel = past ? "Every session" : program.status === "running" ? "See session registration" : "Announced with registration";
  const facts = [
    { value: program.datesLabel || "Dates TBD", label: past ? "When it ran" : "When" },
    { value: place, label: "Where" },
    { value: String(count), label: "Sessions" },
    { value: cost, label: costLabel },
  ];

  const nextStep = program.hasHackathon
    ? { href: program.hackathonHref, label: "The hackathon weekend" }
    : nextProgram
      ? { href: `/programs/${nextProgram.slug}`, label: `Next up: ${nextProgram.name}` }
      : null;

  return (
    <>
      {schema && <JsonLd data={schema} />}
      <SiteHeader
        links={navLinks}
        cta={<a className="btn btn-solid btn-sm nav-cta" href={primary.href} {...ext(primary)}>{primary.label}</a>}
        extraLinks={[...navLinks, { href: primary.href, label: primary.label }]}
      />

      <main className="pg">
        <section className="hero pg-hero" aria-labelledby="pg-title">
          <p className="pg-hero-meta">
            <span className={status.className}>{status.label}</span>
            <span>{program.name}{" ·"} {countWord} sessions{" ·"} {place}</span>
          </p>
          <h1 className="hero-h1" id="pg-title">
            <span className="sr-only">{program.name}: </span>
            <KeyHeadline text={program.headline} keyPhrase={program.headlineKey} />
          </h1>
          <p className="hero-lede">{program.tagline}</p>
          <div className="cta-row">
            <a className="btn btn-solid" href={primary.href} {...ext(primary)}>{primary.label}</a>
            {primary.href !== DISCORD && <a className="btn btn-ghost" href={DISCORD} target="_blank" rel="noreferrer">Join the Discord</a>}
          </div>

          <div className="stage pg-stage">
            <Scene scene={art.scene} alt={art.alt} />
            <aside className="window pg-hero-window" aria-label={`${program.name} sessions`}>
              <div className="window-bar"><b>{program.name}{" ·"} Sessions</b><span>{count} total</span></div>
              <ol className="pg-run">
                {program.sessions.map((w) => (
                  <li key={w.slug}>
                    <span className="k">{w.n}</span>
                    <a href={`/programs/${program.slug}/${w.slug}`}>{w.eventTitle}</a>
                    <span className={past ? "pg-pill is-done" : sessionScheduled(w) ? "pg-pill is-live" : "pg-pill"}>
                      {past ? "Done" : sessionScheduled(w) ? sessionNights(w)[0].date : "TBD"}
                    </span>
                  </li>
                ))}
              </ol>
            </aside>
            {manifest && (
              <p className="pg-toast" aria-hidden="true">
                <Download size={14} strokeWidth={1.75} />
                {manifest.all.count} skill files{" ·"} free to download
              </p>
            )}
          </div>
        </section>

        <section className="pg-facts-wrap hero-after-stage" aria-label="Program details">
          <dl className="facts pg-facts">
            {facts.map((fact) => (
              <div key={fact.label}>
                <dt>{fact.label}</dt>
                <dd>{fact.value}</dd>
              </div>
            ))}
          </dl>
          {!past && !waitlistOpen && program.datesCopy && <p className="pg-venue-note">{program.datesCopy}</p>}
          <p className="pg-venue-note">
            {program.venueNote || (
              <>
                Every session is at{" "}
                <a href="https://www.workuity.com/" target="_blank" rel="noreferrer">Workuity Biltmore</a>, the venue sponsor.
              </>
            )}
          </p>
        </section>

        {!past && waitlistOpen && (
          <section className="section pg-split" id="waitlist" aria-labelledby="pg-waitlist-title">
            <div className="pg-split-copy">
              <p className="k">Waitlist</p>
              <h2 id="pg-waitlist-title">
                {someScheduled ? <>Get the rest of <span className="key">the dates.</span></> : <>Get the dates <span className="key">first.</span></>}
              </h2>
              <p className="section-lede">
                {someScheduled
                  ? "Put your name down for the nights not on the calendar yet. Tell us what you want working by the end, and that's what gets built on screen."
                  : "Put your name down and get the dates the day they're set. Tell us what you want working by the end, and that's what gets built on screen."}
              </p>
              {program.datesCopy && <p className="pg-note">{program.datesCopy}</p>}
            </div>
            <div className="window pg-form-window">
              <div className="window-bar"><b>Waitlist{" ·"} {program.name}</b><span>{program.datesLabel || "Dates TBD"}</span></div>
              <div className="pg-form-body">
                <WaitlistForm program={program.slug} programName={program.name} discord={DISCORD} />
              </div>
            </div>
          </section>
        )}

        {program.acts && (
          <section className="section" id="how" aria-labelledby="pg-how-title">
            <div className="section-head">
              <p className="k">How it runs</p>
              <h2 id="pg-how-title">{countWord} sessions, <span className="key">one path.</span></h2>
              <p className="section-lede">Sessions run in order, and each one stands on its own. Follow along on a laptop, or just watch the live build.</p>
            </div>
            <ol className={`pg-acts pg-acts-${Math.min(program.acts.length, 4)}`}>
              {program.acts.map((a) => (
                <li className="card pg-act" key={a.name}>
                  <div className="card-body">
                    <p className="pg-act-top">
                      <span className="k">{a.range}</span>
                    </p>
                    <h3>{a.name}</h3>
                    <p>{a.copy}</p>
                  </div>
                </li>
              ))}
            </ol>
          </section>
        )}

        <section className="section" id="sessions" aria-labelledby="pg-sessions-title">
          <div className="section-head">
            <p className="k">The sessions</p>
            <h2 id="pg-sessions-title">What you <span className="key">leave with.</span></h2>
            <p className="section-lede">{past ? "The program has finished. Every session's materials stay published." : "Every session has a take-home: the thing you leave with."}</p>
          </div>
          <ol className="pg-sessions">
            {program.sessions.map((w) => {
              const kit = manifest?.sessions[w.slug];
              const deck = deckFor(program.slug, w.slug);
              const guide = guideFor(program.slug, w.slug);
              const href = `/programs/${program.slug}/${w.slug}`;
              return (
                <li key={w.slug} className="card pg-session">
                  <div className="pg-session-side">
                    <span className="pg-session-n">{w.n}</span>
                    <p className="k">{sessionDateLabel(w)}</p>
                    <p className="k">{sessionVenues(w, program).map((venue) => venue.name).join(" & ")}</p>
                    {w.act && <span className="tag">{w.act}</span>}
                  </div>
                  <div className="pg-session-main">
                    <h3><a className="pg-session-link" href={href}>{w.eventTitle}</a></h3>
                    <p className="pg-session-sub">{w.title}</p>
                    <p className="pg-session-copy">{w.copy}</p>
                    <p className="pg-session-take"><span className="k">You leave with</span>{w.take}</p>
                    <p className="pg-session-kit">
                      <span className="pg-session-more">Session details <ArrowRight size={14} strokeWidth={1.75} aria-hidden="true" /></span>
                      {deck && <a href={`${href}/deck`}><Presentation size={13} strokeWidth={1.75} aria-hidden="true" />Slides</a>}
                      {guide && <a href={`${href}/guide`}><BookOpen size={13} strokeWidth={1.75} aria-hidden="true" />Guide</a>}
                      {kit && <a href={`/skills/${kit.file}`} download><Download size={13} strokeWidth={1.75} aria-hidden="true" />{kit.count} skill{kit.count === 1 ? "" : "s"}</a>}
                    </p>
                  </div>
                  {w.media?.poster && (
                    <div className="pg-session-media">
                      <img src={w.media.poster} alt="" loading="lazy" />
                      <span className="pg-play"><Play size={14} strokeWidth={2} aria-hidden="true" />Recording</span>
                    </div>
                  )}
                </li>
              );
            })}
          </ol>
        </section>

        {manifest && (
          <section className="section pg-split pg-split-flip" id="materials" aria-labelledby="pg-materials-title">
            <div className="pg-split-copy">
              <p className="k">Open source</p>
              <h2 id="pg-materials-title">Take the materials <span className="key">home.</span></h2>
              <p className="section-lede">Slides, follow-along guides and {manifest.all.count} skill files, published free to take and run any time.</p>
              <div className="cta-row">
                <a className="btn btn-solid" href={`/programs/${program.slug}/skills`}>All {manifest.all.count} skills</a>
                <a className="btn btn-ghost" href={`/skills/${manifest.all.file}`} download>Download the zip</a>
              </div>
            </div>
            <div className="pg-panel">
              <Scene scene="swell" alt="" />
              <div className="window pg-files">
                <div className="window-bar"><b>skills/{program.kitPrefix || program.slug}</b><span>{manifest.all.count} files</span></div>
                <ul>
                  {program.sessions.map((w) => {
                    const kit = manifest.sessions[w.slug];
                    if (!kit) return null;
                    return (
                      <li key={w.slug}>
                        <span className="k">{w.n}</span>
                        <span className="pg-file">{kit.file}</span>
                        <span className="k">{kit.count} skill{kit.count === 1 ? "" : "s"}</span>
                      </li>
                    );
                  })}
                  <li className="pg-files-all">
                    <span className="k">All</span>
                    <span className="pg-file">{manifest.all.file}</span>
                    <a className="k" href={`/skills/${manifest.all.file}`} download>Download</a>
                  </li>
                </ul>
              </div>
            </div>
          </section>
        )}

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
            <ul className="final-checks">
              <li>In person, {place}</li>
              <li>{countWord} sessions</li>
              {manifest && <li>Materials published free</li>}
            </ul>
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
