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
import { DECKS } from "../../../lib/decks";
import { GUIDES } from "../../../lib/guides";
import registry from "../../../lib/skills.generated.json";
import {
  EVENT,
  WORKSHOPS,
  ACTS,
  DISCORD,
  MEETUP,
  LUMA,
  LINKEDIN,
  GTM_DECK,
  TEMPLATE_REPO,
  VENUES,
  venueOf,
} from "../../../lib/hackathon";

const TITLE = "The workshops — Zero to Launch";
const DESCRIPTION =
  "Six free go-to-market workshops at Workuity Biltmore, Phoenix, every other Wednesday from August 5 to October 14, 2026. B2C and B2B case studies, positioning, agentic analytics, marketing sites and pricing — leading into the Zero to Launch hackathon.";

export const metadata = {
  title: `${TITLE} — Ship AI`,
  description: DESCRIPTION,
  alternates: { canonical: "https://www.shipai.club/hackathon/workshops" },
  openGraph: {
    title: TITLE,
    description: DESCRIPTION,
    url: "https://www.shipai.club/hackathon/workshops",
    siteName: "Ship AI",
  },
};

const SERIES_SCHEMA = {
  "@context": "https://schema.org",
  "@type": "EventSeries",
  name: "Zero to Launch workshops",
  description: DESCRIPTION,
  startDate: "2026-08-05T18:00:00-07:00",
  endDate: "2026-10-14T21:00:00-07:00",
  eventAttendanceMode: "https://schema.org/OfflineEventAttendanceMode",
  location: { "@type": "Place", name: VENUES.workuity.name, address: VENUES.workuity.address },
  organizer: { "@type": "Organization", name: "Ship AI", url: "https://www.shipai.club" },
  isAccessibleForFree: true,
  subEvent: WORKSHOPS.map((w) => ({
    "@type": "Event",
    name: w.title,
    startDate: `${w.iso}T18:00:00-07:00`,
    url: `https://www.shipai.club/hackathon/workshops/${w.slug}`,
    eventAttendanceMode: "https://schema.org/OfflineEventAttendanceMode",
    location: { "@type": "Place", name: venueOf(w).name, address: venueOf(w).address },
    isAccessibleForFree: true,
  })),
};

export default function Page() {
  return (
    <>
      <JsonLd data={SERIES_SCHEMA} />

      <header className="nav">
        <a href="/" className="brand">
          <img src="/logo-icon.png" alt="" width={26} height={26} />
          <span>Ship AI</span>
        </a>
        <nav>
          <a href="/hackathon">Hackathon</a>
          <a href="/hackathon#prizes">Prizes</a>
          <a href="/hackathon#rules">Rules</a>
        </nav>
        <a className="btn btn-solid nav-cta" href={DISCORD} target="_blank" rel="noreferrer">
          Join the Discord
        </a>
      </header>

      <main className="hk-wsi">
        <p className="kicker">Zero to Launch</p>
        <h1>Six Wednesdays that end in a launch.</h1>
        <p className="article-lede">
          The whole go-to-market curriculum, presented in order, free and open to anyone who
          turns up. It starts {EVENT.seriesStart} and runs {EVENT.seriesCadence} until{" "}
          {EVENT.dates.replace("October", "the hackathon in October")}. Each session builds on
          the last. Santos walks the material and builds live on screen; you&apos;re welcome to
          follow along on your own laptop, and equally welcome to just watch.
        </p>

        <div className="hk-facts hk-facts-bare">
          <div className="hk-fact">
            <p className="hk-fact-label">
              <CalendarDays size={14} strokeWidth={1.75} aria-hidden="true" />
              When
            </p>
            <p className="hk-fact-value">Wednesdays, {EVENT.seriesRange}</p>
          </div>
          <div className="hk-fact">
            <p className="hk-fact-label">
              <MapPin size={14} strokeWidth={1.75} aria-hidden="true" />
              Where
            </p>
            <p className="hk-fact-value">
              {VENUES.workuity.name} &amp; {VENUES.cei.name}, Phoenix
            </p>
          </div>
          <div className="hk-fact">
            <p className="hk-fact-label">
              <Ticket size={14} strokeWidth={1.75} aria-hidden="true" />
              Cost
            </p>
            <p className="hk-fact-value">Free, and open to all</p>
          </div>
          <div className="hk-fact">
            <p className="hk-fact-label">
              <GitBranch size={14} strokeWidth={1.75} aria-hidden="true" />
              Build window
            </p>
            <p className="hk-fact-value">Opens {EVENT.buildOpens}</p>
          </div>
        </div>

        <div className="cta-row hk-submit-cta">
          <a className="btn btn-solid" href={LUMA} target="_blank" rel="noreferrer">
            <CalendarDays size={16} strokeWidth={1.75} aria-hidden="true" />
            RSVP on Luma
          </a>
          <a className="btn btn-ghost" href={MEETUP} target="_blank" rel="noreferrer">
            <svg viewBox="0 0 24 24" width={16} height={16} fill="currentColor" aria-hidden="true">
              <path d={siMeetup.path} />
            </svg>
            Meetup
          </a>
          <a className="btn btn-ghost" href={LINKEDIN} target="_blank" rel="noreferrer">
            <Briefcase size={16} strokeWidth={1.75} aria-hidden="true" />
            LinkedIn
          </a>
        </div>

        <h2 className="hk-subhead">
          <Sparkles size={18} strokeWidth={1.75} aria-hidden="true" />
          How the program runs
        </h2>
        <p>
          Three acts, straight off{" "}
          <a href={GTM_DECK} target="_blank" rel="noreferrer">the GTM deck</a>. Each night is a
          presentation with a live build — the material walked through, then done on screen
          for a real product. Nothing is asked of the room: no exercises, no going around,
          nobody presenting. You can drop into any single session — they stand alone. Anyone
          can compete in October whether you came to all six or none of them; the sessions
          just make the launch go better.
        </p>
        <div className="hk-acts">
          {ACTS.map((a) => (
            <div key={a.name} className="hk-act">
              <span className="hk-act-name">{a.name}</span>
              <span className="hk-act-range">{a.range}</span>
              <p>{a.copy}</p>
            </div>
          ))}
        </div>

        <h2 className="hk-subhead">
          <GitBranch size={18} strokeWidth={1.75} aria-hidden="true" />
          The materials are open source
        </h2>
        <p>
          Everything we present is published — the slides, a follow-along guide per session,
          and {registry.skills.length} skill files that do the heavy lifting on the go-to-market
          work. Download them here, or generate your own copy of{" "}
          <a href={TEMPLATE_REPO} target="_blank" rel="noreferrer">the Zero to Launch template</a>.
          Take it and run the whole process yourself, on your own schedule, during the program or
          long after it. No attendance, no sign-up, no gate on competing in October.
        </p>
        <div className="cta-row hk-materials-cta">
          <a className="btn btn-solid" href="/hackathon/skills">
            <Download size={15} strokeWidth={1.75} aria-hidden="true" />
            All {registry.skills.length} skills
          </a>
          <a
            className="btn btn-ghost"
            href={`/skills/${registry.manifest.all.file}`}
            download
          >
            Download the zip
          </a>
        </div>
        <p className="hk-note">
          We keep it deliberately light for most of the program — skill files and whatever
          stack you already use. The Next.js boilerplate only arrives at session 05, once you
          know what the site is supposed to say.
        </p>

        <h2 className="hk-subhead">The six sessions</h2>
        <ol className="hk-ws-list">
          {WORKSHOPS.map((w) => (
            <li key={w.slug}>
              <a href={`/hackathon/workshops/${w.slug}`}>
                <div className="hk-ws-head">
                  <span className="hk-ws-n">{w.n}</span>
                  <span className="hk-ws-date">{w.date}</span>
                  <span className="hk-ws-act">{w.act}</span>
                  {w.audience && <span className="hk-ws-aud">{w.audience}</span>}
                  <span className="hk-ws-venue">{venueOf(w).name}</span>
                </div>
                <h3>{w.eventTitle}</h3>
                <p className="hk-ws-sub">{w.title}</p>
                <p className="hk-ws-copy">{w.copy}</p>
                <p className="hk-ws-take">
                  <strong>You leave with:</strong> {w.take}
                </p>
                <span className="hk-ws-more">
                  Session details
                  <ArrowRight size={14} strokeWidth={1.75} aria-hidden="true" />
                </span>
              </a>
              <p className="hk-ws-kit">
                {DECKS[w.slug] && (
                  <a href={`/hackathon/workshops/${w.slug}/deck`}>
                    <Presentation size={13} strokeWidth={1.75} aria-hidden="true" />
                    Slides
                  </a>
                )}
                {GUIDES[w.slug] && (
                  <a href={`/hackathon/workshops/${w.slug}/guide`}>
                    <BookOpen size={13} strokeWidth={1.75} aria-hidden="true" />
                    Guide
                  </a>
                )}
                {registry.manifest.sessions[w.slug] && (
                  <a href={`/skills/${registry.manifest.sessions[w.slug].file}`} download>
                    <Download size={13} strokeWidth={1.75} aria-hidden="true" />
                    {registry.manifest.sessions[w.slug].count} skills
                  </a>
                )}
              </p>
            </li>
          ))}
        </ol>

        <div className="hk-discord">
          <svg viewBox="0 0 24 24" width={22} height={22} fill="currentColor" aria-hidden="true">
            <path d={siDiscord.path} />
          </svg>
          <div>
            <h3>The program lives in Discord between sessions</h3>
            <p>
              Session recaps, the archive if you miss one, mentor questions, and everyone
              else&apos;s work in progress. It&apos;s where you&apos;ll get unstuck at 11pm on a
              Tuesday.
            </p>
          </div>
          <a className="btn btn-solid" href={DISCORD} target="_blank" rel="noreferrer">
            Join the Discord
          </a>
        </div>

        <div className="cta-row hk-submit-cta">
          <a className="btn btn-solid" href="/hackathon">
            The hackathon weekend
            <ArrowRight size={15} strokeWidth={1.75} aria-hidden="true" />
          </a>
          <a className="btn btn-ghost" href={TEMPLATE_REPO} target="_blank" rel="noreferrer">
            <svg viewBox="0 0 24 24" width={16} height={16} fill="currentColor" aria-hidden="true">
              <path d={siGithub.path} />
            </svg>
            Get the template repo
          </a>
        </div>
      </main>

      <footer className="footer">
        <div className="brand">
          <img src="/logo-icon.png" alt="" width={22} height={22} />
          <span>Ship AI</span>
        </div>
        <p>Phoenix &amp; Tempe, Arizona</p>
        <nav>
          <a href="/">Home</a>
          <a href="/hackathon/skills">Skills</a>
          <a href="/hackathon">Hackathon</a>
          <a href="/hackathon/submit">Submit</a>
        </nav>
        <p className="fine">© 2026 Ship AI</p>
      </footer>
    </>
  );
}
