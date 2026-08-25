import { notFound } from "next/navigation";
import {
  ArrowLeft,
  ArrowRight,
  Backpack,
  BookOpen,
  CalendarDays,
  GitCommitHorizontal,
  ListChecks,
  MapPin,
  Package,
  Presentation,
  Sparkles,
  Wrench,
} from "lucide-react";
import { siDiscord, siGithub, siMeetup } from "simple-icons";
import { JsonLd } from "../../../../components/article";
import { hasDb } from "../../../../lib/db";
import { deckFor } from "../../../../lib/decks";
import { guideFor } from "../../../../lib/guides";
import registry from "../../../../lib/skills.generated.json";
import {
  PROGRAMS,
  programBySlug,
  sessionBySlug,
  sessionDateLabel,
  sessionNeighbours,
  sessionNights,
  sessionScheduled,
  sessionVenues,
} from "../../../../lib/programs";
import { DISCORD, GTM_DECK, rsvpLinks, venueOf } from "../../../../lib/hackathon";

const SITE = "https://www.shipai.club";
const skillsByName = new Map(registry.skills.map((s) => [s.name, s]));

function programVenue(program, session) {
  return venueOf({ ...session, venue: session.venue || program.defaultVenue });
}

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
    openGraph: { title, description, url, siteName: "Ship AI", images: [{ url: "/og-image.jpg", width: 1200, height: 630 }] },
  };
}

export default async function Page({ params }) {
  const { program: programSlug, slug } = await params;
  const program = programBySlug(programSlug);
  const w = sessionBySlug(program, slug);
  if (!program || !w) notFound();

  const { prev, next } = sessionNeighbours(program, slug);
  const scheduled = sessionScheduled(w);
  const rsvp = scheduled ? rsvpLinks(w) : null;
  const venue = programVenue(program, w);
  const venues = sessionVenues(w, program);
  const venueLabel = venues.map((item) => item.name).join(" & ");
  const slides = deckFor(program.slug, slug);
  const guide = guideFor(program.slug, slug);
  const programManifest = registry.manifest.programs[program.slug];
  const kit = programManifest?.sessions[slug];
  const programHref = `/programs/${program.slug}`;
  /* Matches the program page: an unscheduled program collects names,
     and the CTA points back at the form that lives there. */
  const waitlistOpen = !program.startISO && hasDb();
  /* Where the last session hands off when there's no hackathon to end on. */
  const nextProgram = program.nextProgram ? programBySlug(program.nextProgram) : null;

  const schema = sessionEventSchema(program, w, programHref);

  return (
    <>
      {schema && <JsonLd data={schema} />}

      <header className="nav">
        <a href="/" className="brand"><img src="/logo-icon.png" alt="" width={26} height={26} /><span>Ship AI</span></a>
        <nav>
          <a href="/programs">Programs</a>
          <a href={programHref}>Sessions</a>
          {programManifest && <a href={`${programHref}/skills`}>Skills</a>}
          {program.hasHackathon && <a href={program.hackathonHref}>Hackathon</a>}
        </nav>
        <div className="nav-ctas">
          {program.hasHackathon ? (
            <>
              <a className="btn btn-ghost" href={DISCORD} target="_blank" rel="noreferrer">Discord</a>
              <a className="btn btn-solid" href="/dashboard">Register</a>
            </>
          ) : waitlistOpen ? (
            <>
              <a className="btn btn-ghost" href={DISCORD} target="_blank" rel="noreferrer">Discord</a>
              <a className="btn btn-solid" href={`${programHref}#waitlist`}>Join the waitlist</a>
            </>
          ) : (
            <a className="btn btn-solid" href={DISCORD} target="_blank" rel="noreferrer">Get notified</a>
          )}
        </div>
      </header>

      <main className="hk-ws">
        <p className="hk-ws-crumb">
          <a href={programHref}><ArrowLeft size={13} strokeWidth={1.75} aria-hidden="true" />{program.name} sessions</a>
        </p>

        <div className="hk-ws-hero">
          <span className="hk-ws-bignum">{w.n}</span>
          <div>
            <p className="hk-ws-meta">
              {w.act && <span className="hk-ws-act">{w.act}</span>}
              {w.audience && <span className="hk-ws-aud">{w.audience}</span>}
              <span>{scheduled ? `${sessionDateLabel(w)} · 6:00 PM` : "Dates TBD"}</span>
              <span className="hk-ws-venue">{venueLabel}</span>
            </p>
            <h1>{w.eventTitle}</h1><p className="hk-ws-sub">{w.title}</p>
          </div>
        </div>

        <p className="article-lede">{w.lede}</p>

        {/* a session that already happened leads with the night itself */}
        {w.media && (
          <>
            <h2 className="hk-subhead" id="recap"><CalendarDays size={18} strokeWidth={1.75} aria-hidden="true" />From the night</h2>
            {w.media.recording && (
              <div className="hk-recording">
                {/* preload=none: a session page must not pull the whole
                    file until somebody presses play. crossOrigin lets the
                    captions track load from the blob origin. */}
                <video src={w.media.recording} controls preload="none" poster={w.media.photos?.[0]} crossOrigin="anonymous">
                  {w.media.captions && <track kind="captions" src={w.media.captions} srcLang="en" label="English" />}
                </video>
                <p className="hk-note">The full recording{w.media.captions ? ", with captions" : ""}. Also archived in Discord.</p>
              </div>
            )}
            {w.media.photos?.length > 0 && (
              <div className="hk-photos">
                {w.media.photos.map((src, i) => (
                  <a key={src} href={src} target="_blank" rel="noreferrer">
                    <img src={src} alt={`${w.eventTitle} — photo ${i + 1}`} loading="lazy" />
                  </a>
                ))}
              </div>
            )}
          </>
        )}

        {scheduled ? (
          <>
            <div className="hk-ws-rsvp">
              <a className="btn btn-solid" href={rsvp.meetup} target="_blank" rel="noreferrer"><svg viewBox="0 0 24 24" width={16} height={16} fill="currentColor" aria-hidden="true"><path d={siMeetup.path} /></svg>RSVP on Meetup</a>
            </div>
            {rsvp.pending && (
              <p className="hk-note">
                <MapPin size={13} strokeWidth={1.75} aria-hidden="true" />
                {sessionNights(w).length > 1
                  ? sessionNights(w).map((night, i, list) => {
                      const nightVenue = venueOf({ venue: night.venue || w.venue || program.defaultVenue });
                      return (
                        <span key={night.iso}>
                          {night.date} at <a href={nightVenue.url} target="_blank" rel="noreferrer">{nightVenue.name}</a>
                          {" — "}{nightVenue.address}
                          {i < list.length - 1 ? ". " : ". Same session — pick a room. "}
                        </span>
                      );
                    })
                  : (
                    <>
                      <a href={venue.url} target="_blank" rel="noreferrer">{venue.name}</a> — {venue.address}. {venue.note}{" "}
                    </>
                  )}
                Event links go live closer to the date; these point at the Ship AI calendars.
              </p>
            )}
          </>
        ) : (
          <>
            <p className="hk-note">{program.datesCopy || "Dates go out on Discord and the Ship AI calendars."}</p>
            {/* The calendars above are the passive route. This is the one
                that reaches you without you checking. */}
            {waitlistOpen && (
              <p className="hk-note">
                Or <a href={`${programHref}#waitlist`}>join the waitlist</a> — the dates come to you.
              </p>
            )}
          </>
        )}

        <p className="hk-note">Venue sponsor: <a href={venue.sponsorUrl} target="_blank" rel="noreferrer">{venue.sponsor}</a>. Format: the host builds live on screen. Bring a laptop and work along, or just watch — nobody is put on the spot.</p>

        <h2 className="hk-subhead">Why this session</h2><p>{w.why}</p>
        <h2 className="hk-subhead"><ListChecks size={18} strokeWidth={1.75} aria-hidden="true" />What we cover</h2>
        <ol className="hk-agenda-list">
          {w.agenda.map((a, i) => <li key={a.t}><span className="hk-agenda-n">{String(i + 1).padStart(2, "0")}</span><div><p className="hk-agenda-t">{a.t}</p><p>{a.c}</p></div></li>)}
        </ol>

        <div className="hk-ws-grid">
          <div className="hk-ws-card"><h3><Sparkles size={16} strokeWidth={1.75} aria-hidden="true" />You leave with</h3><p>{w.take}</p></div>
          <div className="hk-ws-card"><h3><Backpack size={16} strokeWidth={1.75} aria-hidden="true" />To follow along</h3><p>{w.bring}</p></div>
        </div>

        <h2 className="hk-subhead"><GitCommitHorizontal size={18} strokeWidth={1.75} aria-hidden="true" />Afterward</h2>
        <p>Nothing is required. It compounds if you run the same work on your own product. The suggested output:</p>
        <p className="hk-commit"><code>{w.commit}</code></p>
        <p className="hk-note">
          Everything is open source.{program.templateRepo && <> The <a href={program.templateRepo} target="_blank" rel="noreferrer">template repo</a> and its skill files are published — take them and run it yourself.</>} Missed the session? It&apos;s archived in Discord.
        </p>

        {(slides || guide || kit) && (
          <>
            <h2 className="hk-subhead" id="kit"><Package size={18} strokeWidth={1.75} aria-hidden="true" />The session kit</h2>
            <p>Slides, a follow-along guide and skill files. Free to download, room or no room.</p>
            <div className="kit-row">
              {slides && <a className="kit-card" href={`${programHref}/${w.slug}/deck`}><Presentation size={17} strokeWidth={1.75} aria-hidden="true" /><span className="kit-card-t">Slides</span><span className="kit-card-c">{slides.length} slides. Arrow keys, fullscreen, print to PDF.</span><span className="kit-card-go">Open the deck →</span></a>}
              {guide && <a className="kit-card" href={`${programHref}/${w.slug}/guide`}><BookOpen size={17} strokeWidth={1.75} aria-hidden="true" /><span className="kit-card-t">Follow-along guide</span><span className="kit-card-c">{guide.steps.length} steps, {guide.minutes}. What to run, what done looks like.</span><span className="kit-card-go">Read the guide →</span></a>}
              {kit && <a className="kit-card" href={`/skills/${kit.file}`} download><Package size={17} strokeWidth={1.75} aria-hidden="true" /><span className="kit-card-t">Skill files</span><span className="kit-card-c">{kit.count} skills as a zip. Unzips into <code>.claude/skills/</code>.</span><span className="kit-card-go">Download ({kit.count}) ↓</span></a>}
            </div>
          </>
        )}

        {slides && <div className="kit-deck"><div className="kit-deck-head"><span>Preview</span><a href={`${programHref}/${w.slug}/deck`}>Open full size →</a></div><div className="kit-deck-frame"><iframe src={`${programHref}/${w.slug}/deck`} title={`${w.eventTitle} slides`} loading="lazy" /></div></div>}

        {kit && <><p className="kit-install-label">Install this session&apos;s skills</p><pre className="sk-install"><code>{`curl -fsSLO ${SITE}/skills/${kit.file}\nunzip -o ${kit.file} -d .`}</code></pre></>}

        {w.skills?.length > 0 && (
          <>
            <h3 className="kit-subhead"><Wrench size={16} strokeWidth={1.75} aria-hidden="true" />What&apos;s in the bundle</h3>
            <ul className="kit-skills">
              {w.skills.map((s) => { const skill = skillsByName.get(s); return <li key={s}><p className="kit-skill-name"><code>/{s}</code><a href={`/skills/${s}/SKILL.md`}>SKILL.md</a></p>{skill && <p className="kit-skill-desc">{skill.description}</p>}</li>; })}
            </ul>
            {programManifest && <p className="hk-note">Every program skill is on the <a href={`${programHref}/skills`}>skills page</a>.</p>}
          </>
        )}

        {w.deck && <p className="hk-note">Working from the GTM deck: <a href={GTM_DECK} target="_blank" rel="noreferrer">gtm.desic.xyz</a></p>}

        <div className="hk-discord">
          <svg viewBox="0 0 24 24" width={22} height={22} fill="currentColor" aria-hidden="true"><path d={siDiscord.path} /></svg>
          <div><h3>The community online</h3><p>Recaps, archive links, questions between sessions, everyone else&apos;s work in progress.</p></div>
          <a className="btn btn-solid" href={DISCORD} target="_blank" rel="noreferrer">Join the Discord</a>
        </div>

        <nav className="hk-ws-nav" aria-label="Session navigation">
          {prev ? <a href={`${programHref}/${prev.slug}`} className="hk-ws-prev"><span><ArrowLeft size={13} strokeWidth={1.75} aria-hidden="true" />Previous · {prev.n}</span><strong>{prev.title}</strong></a> : <span />}
          {next ? <a href={`${programHref}/${next.slug}`} className="hk-ws-next"><span>Next · {next.n}<ArrowRight size={13} strokeWidth={1.75} aria-hidden="true" /></span><strong>{next.title}</strong></a> : program.hasHackathon ? <a href={program.hackathonHref} className="hk-ws-next"><span>Finally<ArrowRight size={13} strokeWidth={1.75} aria-hidden="true" /></span><strong>The hackathon weekend</strong></a> : nextProgram ? <a href={`/programs/${nextProgram.slug}`} className="hk-ws-next"><span>Next<ArrowRight size={13} strokeWidth={1.75} aria-hidden="true" /></span><strong>{nextProgram.name}</strong></a> : <a href={programHref} className="hk-ws-next"><span>Back to the program<ArrowRight size={13} strokeWidth={1.75} aria-hidden="true" /></span><strong>{program.name}</strong></a>}
        </nav>
      </main>

      <footer className="footer">
        <div className="brand"><img src="/logo-icon.png" alt="" width={22} height={22} /><span>Ship AI</span></div>
        <nav><a href="/">Home</a><a href="/programs">Programs</a><a href={programHref}>{program.name}</a>{programManifest && <a href={`${programHref}/skills`}>Skills</a>}{program.templateRepo && <a href={program.templateRepo} target="_blank" rel="noreferrer"><svg viewBox="0 0 24 24" width={14} height={14} fill="currentColor" aria-hidden="true"><path d={siGithub.path} /></svg></a>}</nav>
        <p className="fine">© 2026 Ship AI</p>
      </footer>
    </>
  );
}
