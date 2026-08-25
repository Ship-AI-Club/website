import {
  ArrowRight,
  CalendarDays,
  MapPin,
  Rocket,
  Ticket,
} from "lucide-react";
import { siDiscord, siGithub, siMeetup, siX } from "simple-icons";
import { getUpcomingEvents } from "../lib/meetup";
import { JsonLd } from "../components/article";
import { PROGRAMS, programVenueNames } from "../lib/programs";

export const metadata = {
  title: "Ship AI — Free AI Programs in Phoenix",
  description:
    "Free AI programs, workshops and demo nights for builders in Phoenix. Community-run, craft over hype.",
  alternates: { canonical: "https://www.shipai.club" },
  openGraph: {
    /* Share sheets strip a leading site name from og:title (it duplicates
       siteName), so the title has to stand on its own — lead with the
       thesis, not the brand. */
    title: "Demos over Memos — Free AI Programs in Phoenix",
    description:
      "Community-run, craft over hype. Free and in person, in Phoenix.",
    url: "https://www.shipai.club",
    siteName: "Ship AI",
    images: [{ url: "/og-image.jpg", width: 1200, height: 630 }],
  },
};

const DISCORD = "https://discord.gg/kZSJMNveYM";
const MEETUP = "https://www.meetup.com/shipai/";
const LUMA = "https://luma.com/shipai";
const GITHUB = "https://github.com/Ship-AI-Club";
const X_URL = "https://x.com/shipaiclub";

// simple-icons brand glyphs, rendered monochrome (currentColor) to stay on-brand
function BrandGlyph({ icon, size = 18 }) {
  return (
    <svg viewBox="0 0 24 24" width={size} height={size} fill="currentColor" aria-hidden="true">
      <path d={icon.path} />
    </svg>
  );
}

const SOCIALS = [
  { href: DISCORD, label: "Discord", glyph: <BrandGlyph icon={siDiscord} /> },
  { href: MEETUP, label: "Meetup", glyph: <BrandGlyph icon={siMeetup} /> },
  { href: X_URL, label: "X", glyph: <BrandGlyph icon={siX} /> },
  { href: GITHUB, label: "GitHub", glyph: <BrandGlyph icon={siGithub} /> },
];

/* Hero facts are org-level and derived from the registry, so adding a
   program or a session updates the line instead of dating it. */
const SESSION_COUNT = PROGRAMS.reduce((n, p) => n + p.sessions.length, 0);
const PROGRAM_VENUES = [...new Set(PROGRAMS.flatMap((p) => programVenueNames(p)))];

const SPONSORS = [
  { href: "https://www.workuity.com/", name: "Workuity", img: "/sponsor-workuity.png" },
  { href: "https://www.ceigateway.com/", name: "CEI Gateway", img: "/sponsor-cei.png" },
  /* wide: a one-line wordmark far wider than it is tall — rendered at a
     smaller height so it carries the same optical weight as the others */
  { href: "https://venturecafephoenix.org/", name: "Venture Café Phoenix", img: "/sponsor-venturecafe.png", wide: true },
  { href: "https://www.desic.xyz/", name: "desic", img: "/sponsor-desic.svg", wordmark: true },
  { href: "https://automationinterns.com/", name: "AutomationInterns.com", img: "/sponsor-automationinterns.png", wordmark: true },
];

const ASCII_DEMOS = `██████╗  ███████╗ ███╗   ███╗  ██████╗  ███████╗
██╔══██╗ ██╔════╝ ████╗ ████║ ██╔═══██╗ ██╔════╝
██║  ██║ █████╗   ██╔████╔██║ ██║   ██║ ███████╗
██║  ██║ ██╔══╝   ██║╚██╔╝██║ ██║   ██║ ╚════██║
██████╔╝ ███████╗ ██║ ╚═╝ ██║ ╚██████╔╝ ███████║
╚═════╝  ╚══════╝ ╚═╝     ╚═╝  ╚═════╝  ╚══════╝`;

const ASCII_OVER = ` ██████╗  ██╗   ██╗ ███████╗ ██████╗
██╔═══██╗ ██║   ██║ ██╔════╝ ██╔══██╗
██║   ██║ ██║   ██║ █████╗   ██████╔╝
██║   ██║ ╚██╗ ██╔╝ ██╔══╝   ██╔══██╗
╚██████╔╝  ╚████╔╝  ███████╗ ██║  ██║
 ╚═════╝    ╚═══╝   ╚══════╝ ╚═╝  ╚═╝`;

const ASCII_MEMOS = `███╗   ███╗ ███████╗ ███╗   ███╗  ██████╗  ███████╗
████╗ ████║ ██╔════╝ ████╗ ████║ ██╔═══██╗ ██╔════╝
██╔████╔██║ █████╗   ██╔████╔██║ ██║   ██║ ███████╗
██║╚██╔╝██║ ██╔══╝   ██║╚██╔╝██║ ██║   ██║ ╚════██║
██║ ╚═╝ ██║ ███████╗ ██║ ╚═╝ ██║ ╚██████╔╝ ███████║
╚═╝     ╚═╝ ╚══════╝ ╚═╝     ╚═╝  ╚═════╝  ╚══════╝`;

const ORG_SCHEMA = {
  "@context": "https://schema.org",
  "@type": "Organization",
  name: "Ship AI",
  url: "https://www.shipai.club",
  logo: "https://www.shipai.club/logo-icon.png",
  description:
    "Free, public AI education in Phoenix, Arizona. A community-run space for open sessions, workshops, and knowledge-sharing where builders show their work. Demos over memos.",
  sameAs: [DISCORD, MEETUP, LUMA, GITHUB],
  areaServed: ["Phoenix, AZ"],
};

function eventsSchema(events) {
  return {
    "@context": "https://schema.org",
    "@type": "ItemList",
    itemListElement: events.map((e, i) => ({
      "@type": "ListItem",
      position: i + 1,
      item: {
        "@type": "Event",
        name: e.title,
        startDate: new Date(e.ts).toISOString(),
        eventAttendanceMode: "https://schema.org/OfflineEventAttendanceMode",
        location: { "@type": "Place", name: e.place, address: e.place },
        organizer: { "@type": "Organization", name: "Ship AI", url: "https://www.shipai.club" },
        url: e.url,
      },
    })),
  };
}

export default async function Page() {
  const events = await getUpcomingEvents(1);

  return (
    <>
      <JsonLd data={ORG_SCHEMA} />
      {events.length > 0 && <JsonLd data={eventsSchema(events)} />}
      <header className="nav">
        <a href="#top" className="brand">
          <img src="/logo-icon.png" alt="" width={26} height={26} />
          <span>Ship AI</span>
        </a>
        <nav>
          <a href="/programs">Programs</a>
          <a href="/about">About</a>
          <a href="/dashboard">Account</a>
        </nav>
        <a className="btn btn-solid nav-cta" href={DISCORD} target="_blank" rel="noreferrer">
          Join the Discord
        </a>
      </header>

      <main id="top">
        <section className="hero">
          <p className="eyebrow reveal" style={{ "--d": "0ms" }}>
            <a href="/standby" className="node" aria-label="Standby screen" />
            phoenix, az
          </p>
          <h1 className="sr-only">Ship AI — free AI programs in Phoenix.</h1>
          <div className="hero-title" aria-hidden="true">
            <div className="reveal" style={{ "--d": "80ms" }}>
              <pre className="ascii">{ASCII_DEMOS}</pre>
            </div>
            <div className="reveal" style={{ "--d": "160ms" }}>
              <pre className="ascii">{ASCII_OVER}</pre>
            </div>
            <div className="memos reveal" style={{ "--d": "240ms" }}>
              <pre className="ascii ascii-memos">{ASCII_MEMOS}</pre>
              <span className="strike" aria-hidden="true" />
            </div>
          </div>
          <p className="lede reveal" style={{ "--d": "280ms" }}>
            Free AI programs for builders in Phoenix — community-run, craft over
            hype.
          </p>
          {/* Two buttons, not three. RSVP is the front door; the hackathon
              is how one of the programs ends and has its own strip below. */}
          <div className="cta-row reveal" style={{ "--d": "380ms" }}>
            <a
              className="btn btn-solid"
              href={MEETUP}
              target="_blank"
              rel="noreferrer"
              style={{ display: "inline-flex", alignItems: "center", gap: "0.5rem" }}
            >
              <svg viewBox="0 0 24 24" width={16} height={16} fill="currentColor" aria-hidden="true"><path d={siMeetup.path} /></svg>
              RSVP on Meetup
            </a>
            <a className="btn btn-ghost" href={DISCORD} target="_blank" rel="noreferrer">
              Join the Discord
            </a>
          </div>
          <div className="hk-hero-facts reveal" style={{ "--d": "460ms" }}>
            <span>
              <Rocket size={13} strokeWidth={1.75} aria-hidden="true" />
              {PROGRAMS.length} programs · {SESSION_COUNT} sessions
            </span>
            <span>
              <MapPin size={13} strokeWidth={1.75} aria-hidden="true" />
              {PROGRAM_VENUES.join(" & ")}
            </span>
            <span>
              <Ticket size={13} strokeWidth={1.75} aria-hidden="true" />
              Free · open to all
            </span>
          </div>
        </section>

        <section className="sponsor-strip reveal" style={{ "--d": "620ms" }} aria-label="Community partners">
          <p className="strip-label">community partners</p>
          {/* A slow ticker: the track holds two identical sets and slides by
              half its own width, so the loop is seamless. The second set is
              decoration — hidden from the tree, unfocusable. */}
          <div className="sponsor-row">
            <div className="sponsor-track">
              {[0, 1].map((dup) => (
                <div key={dup} className="sponsor-set" aria-hidden={dup === 1 || undefined}>
                  {SPONSORS.map((s) => (
                    <a
                      key={s.name}
                      href={s.href}
                      target="_blank"
                      rel="noreferrer"
                      aria-label={dup === 1 ? undefined : s.name}
                      title={s.name}
                      className="sponsor"
                      tabIndex={dup === 1 ? -1 : undefined}
                    >
                      <img src={s.img} alt={dup === 1 ? "" : s.name} className={`sponsor-logo${s.wide ? " sponsor-logo-wide" : ""}`} />
                      {s.wordmark && <span className="sponsor-name">{s.name}</span>}
                    </a>
                  ))}
                </div>
              ))}
            </div>
          </div>
          <p className="strip-cta">
            Workuity is our venue sponsor. Seeking corporate sponsors to keep the programs free and public.{" "}
            <a href="/programs/zero-to-launch/hackathon/sponsor">See what&apos;s fundable</a>
          </p>
        </section>

        {/* The programs are the main event now, so they run in the site's
            section rhythm with a real heading. The cards keep the promo
            markup; .hk-promo-inner carries all of its own styling. */}
        <section id="programs" className="section">
          <p className="kicker">The programs</p>
          <h2>Pick your on-ramp.</h2>
          {PROGRAMS.map((program) => {
            const venueNames = programVenueNames(program);
            const statusLabel = program.status === "running"
              ? "Running now"
              : program.status === "tbd"
                ? "Dates TBD — announcing soon"
                : program.status === "upcoming"
                  ? "Upcoming program"
                  : "Past program";
            return (
              <div key={program.slug} className="hk-promo-inner">
                <div>
                  <p className={`hk-promo-tag${program.status === "tbd" ? " is-tbd" : ""}`}>
                    <Rocket size={14} strokeWidth={1.75} aria-hidden="true" />
                    {statusLabel}
                  </p>
                  <h2>{program.name}.</h2>
                  <p className="hk-promo-copy">{program.tagline}</p>
                  <p className="hk-promo-meta">
                    <span><CalendarDays size={13} strokeWidth={1.75} aria-hidden="true" />{program.datesLabel || "Dates TBD"}</span>
                    <span><MapPin size={13} strokeWidth={1.75} aria-hidden="true" />{venueNames.join(" & ")}</span>
                    <span><Ticket size={13} strokeWidth={1.75} aria-hidden="true" />Free · {program.sessions.length} sessions</span>
                  </p>
                </div>
                <div className="hk-promo-cta">
                  <a className="btn btn-solid" href={`/programs/${program.slug}`}>
                    View the program
                    <ArrowRight size={15} strokeWidth={1.75} aria-hidden="true" />
                  </a>
                  {program.hasHackathon && (
                    <a className="btn btn-ghost" href={program.hackathonHref}>
                      The hackathon
                    </a>
                  )}
                </div>
              </div>
            );
          })}
        </section>

        <section id="events" className="section">
          <p className="kicker">Up next</p>
          <h2>Come see something get shipped.</h2>
          {events.length > 0 ? (
            <div className="events">
              {events.map((e) => (
                <a key={e.url + e.title} className="event" href={e.url} target="_blank" rel="noreferrer">
                  <div className="event-when">
                    <span>{e.date}</span>
                    <span>{e.time}</span>
                  </div>
                  <div className="event-body">
                    <h3>{e.title}</h3>
                    <p className="event-venue">
                      <MapPin size={13} strokeWidth={1.75} aria-hidden="true" />
                      {e.place}
                    </p>
                  </div>
                  <span className="event-arrow" aria-hidden="true">
                    <ArrowRight size={18} strokeWidth={1.75} />
                  </span>
                </a>
              ))}
            </div>
          ) : (
            <p className="events-empty">
              Next sessions are posted on <a href={MEETUP} target="_blank" rel="noreferrer">Meetup</a>.
            </p>
          )}
          <p className="events-more">
            Full calendar on{" "}
            <a href={MEETUP} target="_blank" rel="noreferrer">Meetup</a>, or see the{" "}
            <a href="/programs/zero-to-launch">full curriculum</a>.
          </p>
        </section>

      </main>

      <footer className="footer">
        <div className="brand">
          <img src="/logo-icon.png" alt="" width={22} height={22} />
          <span>Ship AI</span>
        </div>
        <nav>
          <a href="/programs">Programs</a>
          <a href="/about">About</a>
        </nav>
        <div className="socials">
          {SOCIALS.map((s) => (
            <a key={s.label} href={s.href} target="_blank" rel="noreferrer" aria-label={s.label} title={s.label}>
              {s.glyph}
            </a>
          ))}
        </div>
        <p className="fine">© 2026 Ship AI</p>
      </footer>
    </>
  );
}
