import { notFound } from "next/navigation";
import {
  ArrowRight,
  BookOpen,
  Briefcase,
  CalendarDays,
  Download,
  GitBranch,
  MapPin,
  Presentation,
  Sparkles,
  Ticket,
} from "lucide-react";
import { siDiscord, siGithub, siMeetup } from "simple-icons";
import { JsonLd } from "../../../components/article";
import { deckFor } from "../../../lib/decks";
import { guideFor } from "../../../lib/guides";
import registry from "../../../lib/skills.generated.json";
import { PROGRAMS, programBySlug, sessionScheduled } from "../../../lib/programs";
import {
  DISCORD,
  EVENT,
  LINKEDIN,
  LUMA,
  MEETUP,
  venueOf,
} from "../../../lib/hackathon";

const SITE = "https://www.shipai.club";

export function generateStaticParams() {
  return PROGRAMS.map((program) => ({ program: program.slug }));
}

function programVenue(program, session) {
  return venueOf({ ...session, venue: session.venue || program.defaultVenue });
}

export async function generateMetadata({ params }) {
  const { program: programSlug } = await params;
  const program = programBySlug(programSlug);
  if (!program) return {};
  const title = `${program.name} — Ship AI program`;
  const url = `${SITE}/programs/${program.slug}`;
  return {
    title,
    description: program.description,
    alternates: { canonical: url },
    openGraph: { title, description: program.description, url, siteName: "Ship AI" },
  };
}

function seriesSchema(program) {
  if (!program.startISO) return null;
  return {
    "@context": "https://schema.org",
    "@type": "EventSeries",
    name: `${program.name} workshops`,
    description: program.description,
    startDate: program.startISO,
    endDate: program.endISO,
    eventAttendanceMode: "https://schema.org/OfflineEventAttendanceMode",
    /* No series-level location: venues alternate, and the subEvents below
       each carry the room they actually happen in. */
    organizer: { "@type": "Organization", name: "Ship AI", url: SITE },
    isAccessibleForFree: true,
    subEvent: program.sessions.filter(sessionScheduled).map((w) => ({
      "@type": "Event",
      name: w.title,
      startDate: `${w.iso}T18:00:00-07:00`,
      url: `${SITE}/programs/${program.slug}/${w.slug}`,
      eventAttendanceMode: "https://schema.org/OfflineEventAttendanceMode",
      location: { "@type": "Place", name: programVenue(program, w).name, address: programVenue(program, w).address },
      isAccessibleForFree: true,
    })),
  };
}

export default async function Page({ params }) {
  const { program: programSlug } = await params;
  const program = programBySlug(programSlug);
  if (!program) notFound();

  const manifest = registry.manifest.programs[program.slug];
  const nextProgram = program.nextProgram ? programBySlug(program.nextProgram) : null;
  const schema = seriesSchema(program);
  const venueNames = [...new Set(program.sessions.map((w) => programVenue(program, w).name))];

  return (
    <>
      {schema && <JsonLd data={schema} />}

      <header className="nav">
        <a href="/" className="brand">
          <img src="/logo-icon.png" alt="" width={26} height={26} />
          <span>Ship AI</span>
        </a>
        <nav>
          <a href="/programs">Programs</a>
          {program.hasHackathon && <a href={program.hackathonHref}>Hackathon</a>}
          {manifest && <a href={`/programs/${program.slug}/skills`}>Skills</a>}
        </nav>
        {/* Register is the hackathon's account flow. A program without one
            has nothing to register for, so the CTA is the only thing that
            is actually true: hear about it when dates land. */}
        <div className="nav-ctas">
          {program.hasHackathon ? (
            <>
              <a className="btn btn-ghost" href={DISCORD} target="_blank" rel="noreferrer">Discord</a>
              <a className="btn btn-solid" href="/dashboard">Register</a>
            </>
          ) : (
            <a className="btn btn-solid" href={DISCORD} target="_blank" rel="noreferrer">Get notified</a>
          )}
        </div>
      </header>

      <main className="hk-wsi">
        <p className="kicker">{program.name}</p>
        <h1>{program.headline}</h1>
        <p className="article-lede">{program.tagline}</p>

        <div className={`hk-facts hk-facts-bare${program.hasHackathon ? "" : " hk-facts-3"}`}>
          <div className="hk-fact">
            <p className="hk-fact-label"><CalendarDays size={14} strokeWidth={1.75} aria-hidden="true" />When</p>
            <p className="hk-fact-value">{program.datesLabel || "Dates TBD"}</p>
          </div>
          <div className="hk-fact">
            <p className="hk-fact-label"><MapPin size={14} strokeWidth={1.75} aria-hidden="true" />Where</p>
            <p className="hk-fact-value">{venueNames.join(" & ")}, Phoenix</p>
          </div>
          <div className="hk-fact">
            <p className="hk-fact-label"><Ticket size={14} strokeWidth={1.75} aria-hidden="true" />Cost</p>
            <p className="hk-fact-value">Free, and open to all</p>
          </div>
          {program.hasHackathon && (
            <div className="hk-fact">
              <p className="hk-fact-label"><GitBranch size={14} strokeWidth={1.75} aria-hidden="true" />Build window</p>
              <p className="hk-fact-value">Opens {EVENT.buildOpens}</p>
            </div>
          )}
        </div>

        {/* Nothing is on a calendar until the dates land, so an unscheduled
            program gets the one thing that works: tell me when. */}
        {program.startISO ? (
          <div className="cta-row hk-submit-cta">
            <a className="btn btn-solid" href={LUMA} target="_blank" rel="noreferrer">
              <CalendarDays size={16} strokeWidth={1.75} aria-hidden="true" />Ship AI on Luma
            </a>
            <a className="btn btn-ghost" href={MEETUP} target="_blank" rel="noreferrer">
              <svg viewBox="0 0 24 24" width={16} height={16} fill="currentColor" aria-hidden="true"><path d={siMeetup.path} /></svg>Meetup
            </a>
            <a className="btn btn-ghost" href={LINKEDIN} target="_blank" rel="noreferrer">
              <Briefcase size={16} strokeWidth={1.75} aria-hidden="true" />LinkedIn
            </a>
          </div>
        ) : (
          <>
            {program.datesCopy && <p className="hk-note">{program.datesCopy}</p>}
            <div className="cta-row hk-submit-cta">
              <a className="btn btn-solid" href={DISCORD} target="_blank" rel="noreferrer">
                <svg viewBox="0 0 24 24" width={16} height={16} fill="currentColor" aria-hidden="true"><path d={siDiscord.path} /></svg>Get notified in Discord
              </a>
            </div>
          </>
        )}

        {program.acts && (
          <>
            <h2 className="hk-subhead"><Sparkles size={18} strokeWidth={1.75} aria-hidden="true" />How the program runs</h2>
            <p>
              The curriculum is presented in order, with each session standing on its own. Nothing is
              asked of the room: follow along on a laptop, or simply watch the live build.
            </p>
            <div className="hk-acts">
              {program.acts.map((a) => (
                <div key={a.name} className="hk-act">
                  <span className="hk-act-name">{a.name}</span><span className="hk-act-range">{a.range}</span><p>{a.copy}</p>
                </div>
              ))}
            </div>
          </>
        )}

        {manifest && (
          <>
            <h2 className="hk-subhead"><GitBranch size={18} strokeWidth={1.75} aria-hidden="true" />The materials are open source</h2>
            <p>
              Slides, follow-along guides and {manifest.all.count} skill files are published free to
              take and run during the program or long after it.
            </p>
            <div className="cta-row hk-materials-cta">
              <a className="btn btn-solid" href={`/programs/${program.slug}/skills`}><Download size={15} strokeWidth={1.75} aria-hidden="true" />All {manifest.all.count} skills</a>
              <a className="btn btn-ghost" href={`/skills/${manifest.all.file}`} download>Download the zip</a>
            </div>
          </>
        )}

        <h2 className="hk-subhead">The {program.sessions.length} sessions</h2>
        <ol className="hk-ws-list">
          {program.sessions.map((w) => {
            const kit = manifest?.sessions[w.slug];
            return (
              <li key={w.slug}>
                <a href={`/programs/${program.slug}/${w.slug}`}>
                  <div className="hk-ws-head">
                    <span className="hk-ws-n">{w.n}</span>
                    <span className="hk-ws-date">{sessionScheduled(w) ? w.date : "Dates TBD"}</span>
                    {w.act && <span className="hk-ws-act">{w.act}</span>}
                    {w.audience && <span className="hk-ws-aud">{w.audience}</span>}
                    <span className="hk-ws-venue">{programVenue(program, w).name}</span>
                  </div>
                  <h3>{w.eventTitle}</h3><p className="hk-ws-sub">{w.title}</p><p className="hk-ws-copy">{w.copy}</p>
                  <p className="hk-ws-take"><strong>You leave with:</strong> {w.take}</p>
                  <span className="hk-ws-more">Session details <ArrowRight size={14} strokeWidth={1.75} aria-hidden="true" /></span>
                </a>
                <p className="hk-ws-kit">
                  {deckFor(program.slug, w.slug) && <a href={`/programs/${program.slug}/${w.slug}/deck`}><Presentation size={13} strokeWidth={1.75} aria-hidden="true" />Slides</a>}
                  {guideFor(program.slug, w.slug) && <a href={`/programs/${program.slug}/${w.slug}/guide`}><BookOpen size={13} strokeWidth={1.75} aria-hidden="true" />Guide</a>}
                  {kit && <a href={`/skills/${kit.file}`} download><Download size={13} strokeWidth={1.75} aria-hidden="true" />{kit.count} skills</a>}
                </p>
              </li>
            );
          })}
        </ol>

        <div className="hk-discord">
          <svg viewBox="0 0 24 24" width={22} height={22} fill="currentColor" aria-hidden="true"><path d={siDiscord.path} /></svg>
          <div><h3>The program lives in Discord between sessions</h3><p>Session recaps, archive links, questions and everyone else&apos;s work in progress.</p></div>
          <a className="btn btn-solid" href={DISCORD} target="_blank" rel="noreferrer">Join the Discord</a>
        </div>

        {program.hasHackathon || program.templateRepo ? (
          <div className="cta-row hk-submit-cta">
            {program.hasHackathon && <a className="btn btn-solid" href={program.hackathonHref}>The hackathon weekend <ArrowRight size={15} strokeWidth={1.75} aria-hidden="true" /></a>}
            {program.templateRepo && <a className="btn btn-ghost" href={program.templateRepo} target="_blank" rel="noreferrer"><svg viewBox="0 0 24 24" width={16} height={16} fill="currentColor" aria-hidden="true"><path d={siGithub.path} /></svg>Get the template repo</a>}
          </div>
        ) : nextProgram ? (
          /* No hackathon to point at, so point at what you do next: the
             thing you built here is the thing the next program sells. */
          <>
            <p className="hk-note">Finished the four sessions? {nextProgram.name} is what happens after the thing works — six sessions on finding the people who&apos;ll use it.</p>
            <div className="cta-row hk-submit-cta">
              <a className="btn btn-solid" href={`/programs/${nextProgram.slug}`}>Next up: {nextProgram.name} <ArrowRight size={15} strokeWidth={1.75} aria-hidden="true" /></a>
            </div>
          </>
        ) : null}
      </main>

      <footer className="footer">
        <div className="brand"><img src="/logo-icon.png" alt="" width={22} height={22} /><span>Ship AI</span></div>
        <p>Phoenix &amp; Tempe, Arizona</p>
        <nav><a href="/">Home</a><a href="/programs">Programs</a>{manifest && <a href={`/programs/${program.slug}/skills`}>Skills</a>}{program.hasHackathon && <a href={program.hackathonHref}>Hackathon</a>}</nav>
        <p className="fine">© 2026 Ship AI</p>
      </footer>
    </>
  );
}
