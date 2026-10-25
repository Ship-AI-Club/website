import MobileNav from "../components/mobile-nav";
import {
  ArrowRight,
  CalendarDays,
  MapPin,
  Rocket,
  Ticket,
} from "lucide-react";
import SiteFooter from "../components/site-footer";
import { getUpcomingEvents } from "../lib/meetup";
import { JsonLd } from "../components/article";
import { PROGRAMS, programVenueNames } from "../lib/programs";
import { EVENT } from "../lib/hackathon";
import { VIBE_GTM } from "../lib/vibe-gtm-workshop";
import "./workshops/vibe-coding-gtm/workshop.css";
import WorkshopInstructors from "../components/workshop-instructors";
import WorkshopArt from "../components/workshop-art";
import "./workshops/catalogue.css";
import { UPCOMING_WORKSHOPS } from "../lib/workshops";

export const metadata = {
  title: "Ship AI — Hands-on AI Workshops in Phoenix",
  description:
    "Hands-on AI workshops and programs in Phoenix. Build real projects with expert guidance, thoughtful design, and a community of builders.",
  alternates: { canonical: "https://www.shipai.club" },
  openGraph: {
    /* Share sheets strip a leading site name from og:title (it duplicates
       siteName), so the title has to stand on its own — lead with the
       thesis, not the brand. */
    title: "Practical AI, Built Together — Ship AI Phoenix",
    description:
      "Hands-on workshops, expert guidance, and real projects. In person, in Phoenix.",
    url: "https://www.shipai.club",
    siteName: "Ship AI",
    images: [{ url: "/ship-ai-social.jpg", width: 1280, height: 730 }],
  },
};

const DISCORD = "https://discord.gg/kZSJMNveYM";
const MEETUP = "https://www.meetup.com/shipai/";
const LUMA = "https://luma.com/shipai";
const GITHUB = "https://github.com/Ship-AI-Club";
const X_URL = "https://x.com/shipaiclub";

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

const ORG_SCHEMA = {
  "@context": "https://schema.org",
  "@type": "Organization",
  name: "Ship AI",
  url: "https://www.shipai.club",
  logo: "https://www.shipai.club/logo-icon.png",
  description:
    "Hands-on AI education in Phoenix, Arizona. Paid workshops, practical programs, and a community where builders learn together and ship real work.",
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

const FEATURED = PROGRAMS.find((p) => p.status === "running" && p.hasHackathon) || PROGRAMS.find((p) => p.status === "running");

export default async function Page() {
  const events = await getUpcomingEvents(1);
  const nextEvent = events[0];

  return (
    <>
      <JsonLd data={ORG_SCHEMA} />
      {events.length > 0 && <JsonLd data={eventsSchema(events)} />}
      <header className="nav">
        <a href="#top" className="brand">
          <img src="/logo-mark.png" alt="" width={26} height={26} />
          <span>Ship AI</span>
        </a>
        <nav>
          <a href="/workshops">Workshops</a>
          <a href="/programs">Programs</a>
          <a href="/about">About</a>
          <a href="/dashboard">Account</a>
        </nav>
        <a className="btn btn-solid nav-cta" href={DISCORD} target="_blank" rel="noreferrer">
          Join the Discord
        </a>
      <MobileNav /></header>

      <main id="top">
        <section className="hero">
          {FEATURED && (
            <a className="hero-pill reveal" style={{ "--d": "0ms" }} href={FEATURED.hackathonHref || `/programs/${FEATURED.slug}`}>
              <span className="hero-pill-tag">Now running</span>
              <span className="hero-pill-text">
                {FEATURED.hasHackathon
                  ? `${EVENT.name} · ${EVENT.datesShort.replace(/, \d{4}$/, "")}`
                  : FEATURED.name}
              </span>
              <ArrowRight size={14} strokeWidth={2} aria-hidden="true" />
            </a>
          )}
          {/* headline and lede share one measure: the lede is exactly as
              wide as the headline above it */}
          <div className="hero-head">
            <h1 className="hero-h1 reveal" style={{ "--d": "80ms" }}>
              <span className="sr-only">Ship AI: </span>
              Practical AI, <span className="hero-mark">Built Together</span>
            </h1>
            <p className="hero-lede reveal" style={{ "--d": "160ms" }}>
              Hands-on workshops in Phoenix for turning AI tools into real business results.
              Build your project with expert guidance, sharpen your taste, and leave with work you can use.
            </p>
          </div>
          <div className="hero-grid">
            <div className="hero-copy">
              {/* Two buttons, not three. RSVP is the front door; the hackathon
                  is how one of the programs ends and has its own strip below. */}
              <div className="cta-row reveal" style={{ "--d": "240ms" }}>
                <a className="btn btn-solid btn-lg" href="/workshops">
                  <Ticket size={16} aria-hidden="true" />
                  Explore workshops
                </a>
                <a className="btn btn-ghost btn-lg" href="/programs">
                  Explore programs
                  <ArrowRight size={15} strokeWidth={1.75} aria-hidden="true" />
                </a>
              </div>
              <dl className="hero-stats reveal" style={{ "--d": "320ms" }}>
                <div><dt>Programs</dt><dd>{PROGRAMS.length}</dd></div>
                <div><dt>Sessions</dt><dd>{SESSION_COUNT}</dd></div>
                <div><dt>Venues</dt><dd>{PROGRAM_VENUES.length}</dd></div>
                <div><dt>Format</dt><dd>Hands-on</dd></div>
              </dl>
            </div>

            <aside id="events" className="hero-card reveal" style={{ "--d": "200ms" }} aria-label="Next session">
              <div className="hero-card-head">
                <span>Next session</span>
                <a href="/standby" className="hero-live" aria-label="Standby screen">
                  <i aria-hidden="true" />
                  RSVPs open
                </a>
              </div>
              {nextEvent ? (
                <>
                  <p className="hero-card-date">{nextEvent.date}</p>
                  <p className="hero-card-time">{nextEvent.time} · Phoenix, AZ</p>
                  <h2 className="hero-card-title">{nextEvent.title}</h2>
                  {nextEvent.title === VIBE_GTM.name && <p className="vg-seat-limit">Only {VIBE_GTM.capacity} seats · Small-group workshop</p>}
                  <p className="hero-card-venue">
                    <MapPin size={14} strokeWidth={1.75} aria-hidden="true" />
                    {nextEvent.place}
                  </p>
                  <a className="btn btn-solid hero-card-cta" href={nextEvent.url} target="_blank" rel="noreferrer">
                    Reserve a seat
                    <ArrowRight size={15} strokeWidth={1.75} aria-hidden="true" />
                  </a>
                </>
              ) : (
                <>
                  <h2 className="hero-card-title">New sessions post every few weeks.</h2>
                  <a className="btn btn-solid hero-card-cta" href={MEETUP} target="_blank" rel="noreferrer">
                    See the calendar
                    <ArrowRight size={15} strokeWidth={1.75} aria-hidden="true" />
                  </a>
                </>
              )}
              <p className="hero-card-foot">
                <span>See event details for tickets</span>
                <a href={MEETUP} target="_blank" rel="noreferrer">Full calendar</a>
              </p>
            </aside>
          </div>
        </section>

        <section id="workshops" className="section" aria-labelledby="workshops-title">
          <p className="kicker">Workshops</p>
          <h2 id="workshops-title">Make progress in the room.</h2>
          <p className="section-lede">Focused, paid workshops with expert guidance and time to build. Bring your project and work through the decisions that move it forward.</p>
          <p className="section-lede">Blueprints come preloaded with skills and best practices, designed to eliminate 80% of the friction. Recordings and workshop materials are emailed to participants afterward.</p>
          <div className="vg-home-feature vg-section-feature">
            <div><p className="vg-seat-limit">Limited to {VIBE_GTM.capacity} seats</p><p className="kicker">October 10 · 9 AM–1 PM MST</p><h3>{VIBE_GTM.name}</h3><WorkshopInstructors compact /><p>{VIBE_GTM.description}</p><p>{VIBE_GTM.venue}</p></div>
            <a className="btn btn-solid" href={VIBE_GTM.path}>View workshop &amp; tickets <ArrowRight size={16} aria-hidden="true" /></a>
          </div>
          <div className="vg-home-coming">{UPCOMING_WORKSHOPS.slice(0, 4).map((workshop) => <article key={workshop.slug}><a className="wc-art-link" href={`/workshops/${workshop.slug}`} aria-label={`Explore ${workshop.name}`}><WorkshopArt slug={workshop.slug} /></a><div className="wc-home-card-body"><p className="kicker">Date TBD · ${workshop.price.toLocaleString("en-US")}</p><h3><a href={`/workshops/${workshop.slug}`}>{workshop.name}</a></h3><p>{workshop.promise}</p><a href={`/workshops/${workshop.slug}`}>Explore workshop <ArrowRight size={14} aria-hidden="true" /></a></div></article>)}</div>
          <a className="btn btn-ghost" href="/workshops">Explore workshops <ArrowRight size={16} aria-hidden="true" /></a>
        </section>

        <section className="sponsor-strip reveal" style={{ "--d": "620ms" }} aria-label="Community partners">
          <p className="strip-label">Community partners</p>
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
            Workuity is our venue sponsor. Partner with us to support practical AI education and builder programs.{" "}
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
                  <h2>{program.name}</h2>
                  <p className="hk-promo-copy">{program.tagline}</p>
                  <p className="hk-promo-meta">
                    <span><CalendarDays size={13} strokeWidth={1.75} aria-hidden="true" />{program.datesLabel || "Dates TBD"}</span>
                    <span><MapPin size={13} strokeWidth={1.75} aria-hidden="true" />{venueNames.join(" & ")}</span>
                    <span><Ticket size={13} strokeWidth={1.75} aria-hidden="true" />{program.sessions.length} sessions</span>
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


      </main>

      <SiteFooter />
    </>
  );
}
