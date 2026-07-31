import { notFound } from "next/navigation";
import {
  ArrowLeft,
  ArrowRight,
  Backpack,
  BookOpen,
  Briefcase,
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
  sessionNeighbours,
  sessionScheduled,
} from "../../../../lib/programs";
import { DISCORD, GTM_DECK, rsvpLinks, venueOf } from "../../../../lib/hackathon";

const SITE = "https://www.shipai.club";
const skillsByName = new Map(registry.skills.map((s) => [s.name, s]));

function programVenue(program, session) {
  return venueOf({ ...session, venue: session.venue || program.defaultVenue });
}

function sessionDateLabel(session) {
  return `${session.date}, ${session.iso.slice(0, 4)}`;
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
  const title = `${w.title} — ${program.name} session ${w.n}`;
  const when = sessionScheduled(w) ? sessionDateLabel(w) : "Dates TBD";
  const description = `${when} in Phoenix. ${w.copy}`.slice(0, 300);
  const url = `${SITE}/programs/${program.slug}/${w.slug}`;
  return {
    title: `${title} — Ship AI`,
    description,
    alternates: { canonical: url },
    openGraph: { title, description, url, siteName: "Ship AI" },
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

  const schema = scheduled
    ? {
        "@context": "https://schema.org",
        "@type": "Event",
        name: `${w.title} — ${program.name} session ${w.n}`,
        description: w.copy,
        startDate: `${w.iso}T18:00:00-07:00`,
        endDate: `${w.iso}T21:00:00-07:00`,
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
      }
    : null;

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
              <span className="hk-ws-venue">{venue.name}</span>
            </p>
            <h1>{w.eventTitle}</h1><p className="hk-ws-sub">{w.title}</p>
          </div>
        </div>

        <p className="article-lede">{w.lede}</p>

        {scheduled ? (
          <>
            <div className="hk-ws-rsvp">
              <a className="btn btn-solid" href={rsvp.luma} target="_blank" rel="noreferrer"><CalendarDays size={16} strokeWidth={1.75} aria-hidden="true" />RSVP on Luma</a>
              <a className="btn btn-ghost" href={rsvp.meetup} target="_blank" rel="noreferrer"><svg viewBox="0 0 24 24" width={16} height={16} fill="currentColor" aria-hidden="true"><path d={siMeetup.path} /></svg>Meetup</a>
              <a className="btn btn-ghost" href={rsvp.linkedin} target="_blank" rel="noreferrer"><Briefcase size={16} strokeWidth={1.75} aria-hidden="true" />LinkedIn</a>
            </div>
            {rsvp.pending && (
              <p className="hk-note"><MapPin size={13} strokeWidth={1.75} aria-hidden="true" /><a href={venue.url} target="_blank" rel="noreferrer">{venue.name}</a> — {venue.address}. {venue.note} Individual event links go live closer to the date; these point at the Ship AI calendars.</p>
            )}
          </>
        ) : (
          <>
            <p className="hk-note">{program.datesCopy || "Dates will be announced on Discord and the Ship AI calendars."}</p>
            {/* The calendars above are the passive route. This is the one
                that reaches you without you checking. */}
            {waitlistOpen && (
              <p className="hk-note">
                Or <a href={`${programHref}#waitlist`}>join the waitlist</a> and the dates come to you.
              </p>
            )}
          </>
        )}

        <p className="hk-note">Format: the host presents and builds live on screen. Bring a laptop and work along if you want to, or just watch — nobody is put on the spot or asked to present.</p>

        <h2 className="hk-subhead">Why this session exists</h2><p>{w.why}</p>
        <h2 className="hk-subhead"><ListChecks size={18} strokeWidth={1.75} aria-hidden="true" />What we cover</h2>
        <ol className="hk-agenda-list">
          {w.agenda.map((a, i) => <li key={a.t}><span className="hk-agenda-n">{String(i + 1).padStart(2, "0")}</span><div><p className="hk-agenda-t">{a.t}</p><p>{a.c}</p></div></li>)}
        </ol>

        <div className="hk-ws-grid">
          <div className="hk-ws-card"><h3><Sparkles size={16} strokeWidth={1.75} aria-hidden="true" />You leave with</h3><p>{w.take}</p></div>
          <div className="hk-ws-card"><h3><Backpack size={16} strokeWidth={1.75} aria-hidden="true" />If you want to follow along</h3><p>{w.bring}</p></div>
        </div>

        <h2 className="hk-subhead"><GitCommitHorizontal size={18} strokeWidth={1.75} aria-hidden="true" />What to do afterward</h2>
        <p>Nothing is required. The program compounds if you run the same work on your own product; this is the suggested output for the session:</p>
        <p className="hk-commit"><code>{w.commit}</code></p>
        <p className="hk-note">
          Everything is open source.{program.templateRepo && <> The <a href={program.templateRepo} target="_blank" rel="noreferrer">template repo</a> and its skill files are published — take them and run the process yourself.</>} Missed the session? It&apos;s archived in Discord.
        </p>

        {(slides || guide || kit) && (
          <>
            <h2 className="hk-subhead" id="kit"><Package size={18} strokeWidth={1.75} aria-hidden="true" />The session kit</h2>
            <p>Slides, a follow-along guide and skill files, free and downloadable whether you make it to the room or not.</p>
            <div className="kit-row">
              {slides && <a className="kit-card" href={`${programHref}/${w.slug}/deck`}><Presentation size={17} strokeWidth={1.75} aria-hidden="true" /><span className="kit-card-t">Slides</span><span className="kit-card-c">{slides.length} slides. Arrow keys, fullscreen, print to PDF.</span><span className="kit-card-go">Open the deck →</span></a>}
              {guide && <a className="kit-card" href={`${programHref}/${w.slug}/guide`}><BookOpen size={17} strokeWidth={1.75} aria-hidden="true" /><span className="kit-card-t">Follow-along guide</span><span className="kit-card-c">{guide.steps.length} steps, {guide.minutes}. What to run, and what done looks like.</span><span className="kit-card-go">Read the guide →</span></a>}
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
            {programManifest && <p className="hk-note">Every skill from the program is on the <a href={`${programHref}/skills`}>skills page</a>.</p>}
          </>
        )}

        {w.deck && <p className="hk-note">Working from the GTM deck: <a href={GTM_DECK} target="_blank" rel="noreferrer">gtm.desic.xyz</a></p>}

        <div className="hk-discord">
          <svg viewBox="0 0 24 24" width={22} height={22} fill="currentColor" aria-hidden="true"><path d={siDiscord.path} /></svg>
          <div><h3>Join the community online</h3><p>Session recaps, archive links, questions between sessions and everyone else&apos;s work in progress.</p></div>
          <a className="btn btn-solid" href={DISCORD} target="_blank" rel="noreferrer">Join the Discord</a>
        </div>

        <nav className="hk-ws-nav" aria-label="Session navigation">
          {prev ? <a href={`${programHref}/${prev.slug}`} className="hk-ws-prev"><span><ArrowLeft size={13} strokeWidth={1.75} aria-hidden="true" />Previous · {prev.n}</span><strong>{prev.title}</strong></a> : <span />}
          {next ? <a href={`${programHref}/${next.slug}`} className="hk-ws-next"><span>Next · {next.n}<ArrowRight size={13} strokeWidth={1.75} aria-hidden="true" /></span><strong>{next.title}</strong></a> : program.hasHackathon ? <a href={program.hackathonHref} className="hk-ws-next"><span>Finally<ArrowRight size={13} strokeWidth={1.75} aria-hidden="true" /></span><strong>The hackathon weekend</strong></a> : nextProgram ? <a href={`/programs/${nextProgram.slug}`} className="hk-ws-next"><span>Next<ArrowRight size={13} strokeWidth={1.75} aria-hidden="true" /></span><strong>{nextProgram.name}</strong></a> : <a href={programHref} className="hk-ws-next"><span>Back to the program<ArrowRight size={13} strokeWidth={1.75} aria-hidden="true" /></span><strong>{program.name}</strong></a>}
        </nav>
      </main>

      <footer className="footer">
        <div className="brand"><img src="/logo-icon.png" alt="" width={22} height={22} /><span>Ship AI</span></div><p>Phoenix &amp; Tempe, Arizona</p>
        <nav><a href="/">Home</a><a href="/programs">Programs</a><a href={programHref}>{program.name}</a>{programManifest && <a href={`${programHref}/skills`}>Skills</a>}{program.templateRepo && <a href={program.templateRepo} target="_blank" rel="noreferrer"><svg viewBox="0 0 24 24" width={14} height={14} fill="currentColor" aria-hidden="true"><path d={siGithub.path} /></svg></a>}</nav>
        <p className="fine">© 2026 Ship AI</p>
      </footer>
    </>
  );
}
