import { notFound } from "next/navigation";
import { siDiscord, siGithub, siMeetup } from "simple-icons";
import { JsonLd } from "../../../../components/article";
import Scene from "../../../../components/scene";
import SiteFooter from "../../../../components/site-footer";
import SiteHeader from "../../../../components/site-header";
import WorkshopNotify from "../../../../components/workshop-notify";
import { SheetAccordion, SheetColumns } from "../../../../components/workshop-sheet";
import { PROGRAM_SCENES } from "../../../../components/program-details";
import { hasDb } from "../../../../lib/db";
import { deckFor } from "../../../../lib/decks";
import { guideFor } from "../../../../lib/guides";
import registry from "../../../../lib/skills.generated.json";
import {
  PROGRAMS,
  programBySlug,
  sessionBySlug,
  sessionDateLabel,
  sessionNights,
  sessionScheduled,
  sessionState,
  sessionVenues,
} from "../../../../lib/programs";
import { DISCORD, GTM_DECK, rsvpLinks, venueOf } from "../../../../lib/hackathon";
import { ogImage } from "../../../../lib/og";
import "../../../../components/departure-board.css";
import "../../program.css";
import "../../../hub.css";
import "../../voyage.css";
import "../../session.css";

const SITE = "https://www.shipai.club";
const skillsByName = new Map(registry.skills.map((s) => [s.name, s]));

function sessionEventSchema(program, w, programHref) {
  const nights = sessionNights(w);
  if (nights.length === 0) return null;
  const events = nights.map((night) => {
    const venue = venueOf({ venue: night.venue || w.venue || program.defaultVenue });
    return {
      "@type": "Event",
      name: `${w.title} — ${program.name} session ${w.n}`,
      description: w.copy,
      startDate: `${night.iso}T18:00:00-07:00`,
      endDate: `${night.iso}T21:00:00-07:00`,
      eventAttendanceMode: "https://schema.org/OfflineEventAttendanceMode",
      eventStatus: "https://schema.org/EventScheduled",
      location: {
        "@type": "Place",
        name: venue.name,
        address: {
          "@type": "PostalAddress",
          streetAddress: venue.street,
          addressLocality: venue.city,
          addressRegion: venue.region,
          postalCode: venue.zip,
        },
      },
      organizer: { "@type": "Organization", name: "Ship AI", url: SITE },
      url: `${SITE}${programHref}/${w.slug}`,
      isAccessibleForFree: true,
      superEvent: { "@type": "EventSeries", name: `${program.name} workshops`, url: `${SITE}${programHref}` },
    };
  });
  if (events.length === 1) {
    return { "@context": "https://schema.org", ...events[0] };
  }
  return {
    "@context": "https://schema.org",
    "@type": "EventSeries",
    name: `${w.title} — ${program.name} session ${w.n}`,
    description: w.copy,
    startDate: events[0].startDate,
    endDate: events[events.length - 1].endDate,
    url: `${SITE}${programHref}/${w.slug}`,
    organizer: { "@type": "Organization", name: "Ship AI", url: SITE },
    isAccessibleForFree: true,
    subEvent: events,
  };
}

export function generateStaticParams() {
  return PROGRAMS.flatMap((program) =>
    program.sessions.map((session) => ({ program: program.slug, slug: session.slug }))
  );
}

export async function generateMetadata({ params }) {
  const { program: programSlug, slug } = await params;
  const program = programBySlug(programSlug);
  const w = sessionBySlug(program, slug);
  if (!program || !w) return {};
  const title = `${w.title} — ${program.name} Session ${w.n}`;
  const when = sessionDateLabel(w);
  const description = `${when} in Phoenix. ${w.copy}`.slice(0, 300);
  const url = `${SITE}/programs/${program.slug}/${w.slug}`;
  return {
    title: `${title} — Ship AI`,
    description,
    alternates: { canonical: url },
    openGraph: { title, description, url, siteName: "Ship AI", images: [ogImage({ kicker: `${program.name} · Session ${w.n}`, title: w.title, meta: when })] },
  };
}

function Section({ id, title, wide, children }) {
  return (
    <section className={wide ? "section sx-section sx-route" : "section sx-section"} aria-labelledby={`${id}-title`}>
      <div className="section-head"><h2 id={`${id}-title`}>{title}</h2></div>
      {children}
    </section>
  );
}

export default async function Page({ params }) {
  const { program: programSlug, slug } = await params;
  const program = programBySlug(programSlug);
  const w = sessionBySlug(program, slug);
  if (!program || !w) notFound();

  const programHref = `/programs/${program.slug}`;
  const href = `${programHref}/${w.slug}`;
  const count = program.sessions.length;
  const index = program.sessions.findIndex((s) => s.slug === w.slug);
  const programManifest = registry.manifest.programs[program.slug];
  const kit = programManifest?.sessions[slug];
  const slides = deckFor(program.slug, slug);
  const guide = guideFor(program.slug, slug);
  const nextProgram = program.nextProgram ? programBySlug(program.nextProgram) : null;
  const art = PROGRAM_SCENES[program.slug] || PROGRAM_SCENES["the-first-build"];

  /* Three states, one action each. Finished: the recording, then the
     files. Dated and still to come: the RSVP. No date: an email field.
     A session with no date in a finished program reads as finished. */
  const scheduled = sessionScheduled(w);
  const nights = sessionNights(w);
  const state = sessionState(program, w);
  const upcoming = state === "upcoming";
  const finished = state === "finished";
  const waitlistOpen = !program.startISO && hasDb();
  const rsvp = upcoming ? rsvpLinks(w) : null;
  const recording = w.media?.recording;
  const photos = w.media?.photos || [];

  /* The venue and its sponsor, once. */
  const venues = sessionVenues(w, program);
  const venue = venueOf({ ...w, venue: w.venue || program.defaultVenue });
  const venueLabel = venues.map((item) => item.name).join(" & ");
  const hosted = venueLabel.includes(venue.sponsor);
  const where = hosted ? `${venueLabel}, venue sponsor` : `${venueLabel} · Venue sponsor: ${venue.sponsor}`;
  const when = scheduled ? `${sessionDateLabel(w)}${upcoming ? " · 6:00 PM" : ""}` : null;

  const files = [
    slides && { label: "Slides", note: `${slides.length} slides`, href: `${href}/deck` },
    guide && { label: "Follow-along guide", note: `${guide.steps.length} steps, ${guide.minutes}`, href: `${href}/guide` },
    kit && { label: "Skill files", note: `${kit.count} skill${kit.count === 1 ? "" : "s"}, as a zip`, href: `/skills/${kit.file}`, download: true },
  ].filter(Boolean);

  /* The route: every stop of the program, then where it leads. */
  const stops = program.sessions.map((s) => ({
    key: s.slug,
    href: `${programHref}/${s.slug}`,
    label: sessionScheduled(s) ? s.date : s.act || `Session ${Number(s.n)}`,
    title: s.eventTitle,
  }));
  if (program.hasHackathon) stops.push({ key: "hackathon", href: program.hackathonHref, label: "Finally", title: "The hackathon weekend" });
  else if (nextProgram) stops.push({ key: "next", href: `/programs/${nextProgram.slug}`, label: "Next program", title: nextProgram.name });

  const schema = sessionEventSchema(program, w, programHref);

  /* "01-roadmap/gtm-map.md — what goes in it": the path reads as code. */
  const dash = w.commit.indexOf(" — ");
  const commitPath = dash > 0 ? w.commit.slice(0, dash) : w.commit;
  const commitRest = dash > 0 ? w.commit.slice(dash) : "";

  const bar = (
    <div className="window-bar">
      <b>{[`Session ${index + 1} of ${count}`, w.act, w.audience].filter(Boolean).join(" · ")}</b>
      <span>{[when, where].filter(Boolean).join(" · ")}</span>
    </div>
  );

  const fileRow = files.length > 0 && (
    <div className="sx-files" style={{ "--sx-count": files.length }}>
      {files.map((file) => (
        <a key={file.label} className="sx-file" href={file.href} download={file.download || undefined}>
          <b>{file.label}<i aria-hidden="true">{file.download ? "↓" : "→"}</i></b>
          <span>{file.note}</span>
        </a>
      ))}
    </div>
  );

  return (
    <>
      {schema && <JsonLd data={schema} />}
      <SiteHeader current="/programs" cta={<a className="btn btn-solid btn-sm nav-cta" href={DISCORD} target="_blank" rel="noreferrer"><svg viewBox="0 0 24 24" width={18} height={18} fill="currentColor" aria-hidden="true" focusable="false"><path d={siDiscord.path} /></svg>Join the Discord</a>} />

      <main>
        <section className="hero vy-hero sx-hero" aria-labelledby="sx-title">
          <p className="vy-crumb"><a href={programHref}>← {program.name}</a></p>
          <h1 className="hero-h1" id="sx-title">{w.eventTitle}</h1>
          <p className="hero-lede">{w.title}</p>
        </section>

        {recording ? (
          <div className="sx-window">
            {/* preload=none: a session page must not pull the whole file
                until somebody presses play. crossOrigin lets the captions
                track load from the blob origin. */}
            <video className="sx-player" src={recording} aria-label={`${w.media.recordingTitle || w.eventTitle} recording`} controls preload="none" poster={w.media.poster || photos[0]} crossOrigin="anonymous">
              {w.media.captions && <track kind="captions" src={w.media.captions} srcLang="en" label="English" />}
            </video>
            <aside className="window sx-docked" aria-label="Session files">
              {bar}
              {fileRow}
            </aside>
          </div>
        ) : (
          <div className="hub-board">
            <div className="stage dboard-stage sx-stage"><Scene scene={art.scene} alt={art.alt} /></div>
            <aside className="window dboard sx-board" aria-label={finished ? "Session files" : "Session dates"}>
              {bar}
              {upcoming ? (
                <div className="dboard-row sx-row sx-row-act">
                  <p className="vy-when sx-when">
                    <b>{when}</b>
                    <span>
                      {nights.length > 1
                        ? "Same session on each night. Pick a room."
                        : <><a href={venue.url} target="_blank" rel="noreferrer">{venue.name}</a>, {venue.address}</>}
                      {" · "}Bring a laptop or just watch
                    </span>
                  </p>
                  <div className="vy-act">
                    <a className="btn btn-solid" href={rsvp.meetup} target="_blank" rel="noreferrer"><svg viewBox="0 0 24 24" width={16} height={16} fill="currentColor" aria-hidden="true"><path d={siMeetup.path} /></svg>RSVP on Meetup</a>
                  </div>
                </div>
              ) : !finished ? (
                <div className="dboard-row sx-row">
                  <p className="vy-when"><b>Dates to be announced</b><span>Bring a laptop or just watch</span></p>
                  {waitlistOpen ? (
                    <div className="sx-signup">
                      <WorkshopNotify slug={program.slug} name={program.name} prompt="Email me when the dates are set" startOpen askGoal />
                    </div>
                  ) : (
                    <div className="vy-act"><a className="btn btn-solid" href={DISCORD} target="_blank" rel="noreferrer">Get notified in Discord</a></div>
                  )}
                </div>
              ) : null}
              {fileRow}
            </aside>
          </div>
        )}

        <Section id="sx-why" title="Why this session">
          <div className="sx-prose"><p>{w.lede}</p><p>{w.why}</p></div>
        </Section>

        <Section id="sx-cover" title="What we cover">
          <SheetAccordion items={w.agenda.map((item) => [item.t, item.c])} openFirst />
          <div className="sx-takes">
            <SheetColumns items={[["You leave with", w.take], ["To follow along", w.bring]]} />
            <p className="sx-after"><span>Afterward</span><code>{commitPath}</code>{commitRest}</p>
            {w.deck && <p className="sx-more">Working from the GTM deck: <a className="link" href={GTM_DECK} target="_blank" rel="noreferrer">gtm.desic.xyz</a></p>}
          </div>
        </Section>

        {photos.length > 0 && (
          <Section id="sx-night" title="From the night">
            <div className="sx-photos">
              {photos.map((src, i) => (
                <a key={src} href={src} target="_blank" rel="noreferrer">
                  <img src={src} alt={`${w.eventTitle}, photo ${i + 1}`} loading="lazy" />
                </a>
              ))}
            </div>
          </Section>
        )}

        {w.skills?.length > 0 && (
          <Section id="sx-skills" title="The skills">
            <div className="ws-acc sx-skills">
              {w.skills.map((name) => {
                const skill = skillsByName.get(name);
                return (
                  <details key={name}>
                    <summary><h3>/{name}</h3><span className="ws-mark" aria-hidden="true">+</span></summary>
                    <p>{skill?.description} <a href={`/skills/${name}/SKILL.md`}>SKILL.md</a></p>
                  </details>
                );
              })}
            </div>
            {kit && <pre className="sx-install"><code>{`curl -fsSLO ${SITE}/skills/${kit.file}\nunzip -o ${kit.file} -d .`}</code></pre>}
            {programManifest && <p className="sx-more"><a className="link" href={`${programHref}/skills`}>Every {program.name} skill</a></p>}
          </Section>
        )}

        <Section id="sx-route" title="The route" wide>
          <div className="ws-route" aria-hidden="true" style={{ "--ws-stops": stops.length, "--ws-here": index }}>
            <span className="ws-ship" />
          </div>
          <ol className="ws-steps" style={{ "--ws-stops": stops.length }}>
            {stops.map((stop, i) => (
              <li key={stop.key} className={[i === index ? "is-here" : "", Math.abs(i - index) <= 1 ? "is-near" : ""].join(" ").trim() || undefined}>
                <a href={stop.href} aria-current={i === index ? "page" : undefined}>
                  <span>{stop.label}</span>
                  <b>{stop.title}</b>
                </a>
              </li>
            ))}
          </ol>
        </Section>

        <section className="band" aria-labelledby="sx-final-title">
          <Scene scene="stars" mode="ascii" band className="band-bg" />
          <div className="final">
            <h2 id="sx-final-title">Between sessions, it lives <span className="key">in Discord.</span></h2>
            <p className="lede">Recaps, archive links, questions and everyone&apos;s work in progress.</p>
            <div className="cta-row">
              <a className="btn btn-solid" href={DISCORD} target="_blank" rel="noreferrer">Join the Discord</a>
              <a className="btn btn-ghost" href={programHref}>All {program.name} sessions</a>
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
