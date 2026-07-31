import {
  ArrowRight,
  BadgeCheck,
  Scale,
  CalendarDays,
  Gem,
  Globe,
  GraduationCap,
  Hammer,
  MapPin,
  MonitorPlay,
  Rocket,
  Ticket,
  Users,
  Zap,
} from "lucide-react";
import { siDiscord, siGithub, siMeetup, siX } from "simple-icons";
import { getUpcomingEvents } from "../lib/meetup";
import { JsonLd } from "../components/article";
import { EVENT, venueOf } from "../lib/hackathon";
import { PROGRAMS } from "../lib/programs";

export const metadata = {
  title: "Ship AI — free AI programs in Phoenix",
  description:
    "Free AI programs, workshops and demo nights for builders in Phoenix and Tempe. Sessions get built live on screen, then 5-minute demos. No tickets, no tiers.",
  alternates: { canonical: "https://www.shipai.club" },
  openGraph: {
    title: "Ship AI — free AI programs in Phoenix",
    description:
      "Free AI programs and workshops for builders in Phoenix and Tempe. Built live on screen, then 5-minute demos. Demos over memos.",
    url: "https://www.shipai.club",
    siteName: "Ship AI",
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
  { href: LUMA, label: "Luma", glyph: <CalendarDays size={18} strokeWidth={1.75} aria-hidden="true" /> },
  { href: X_URL, label: "X", glyph: <BrandGlyph icon={siX} /> },
  { href: GITHUB, label: "GitHub", glyph: <BrandGlyph icon={siGithub} /> },
];

/* Hero facts are org-level and derived from the registry, so adding a
   program or a session updates the line instead of dating it. */
const SESSION_COUNT = PROGRAMS.reduce((n, p) => n + p.sessions.length, 0);
const PROGRAM_VENUES = [
  ...new Set(
    PROGRAMS.flatMap((p) =>
      p.sessions.map((s) => venueOf({ ...s, venue: s.venue || p.defaultVenue }).name)
    )
  ),
];

const SPONSORS = [
  { href: "https://www.workuity.com/", name: "Workuity", img: "/sponsor-workuity.png" },
  { href: "https://www.ceigateway.com/", name: "CEI Gateway", img: "/sponsor-cei.png" },
  { href: "https://www.desic.xyz/", name: "desic", img: "/sponsor-desic.svg", wordmark: true },
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

const values = [
  {
    title: "Free and open",
    icon: GraduationCap,
    copy: "Every session is free and public. You pay by teaching what you know back to the room. No tickets, no tiers, no gatekeeping.",
  },
  {
    title: "Demos over memos",
    icon: MonitorPlay,
    copy: "Show the build, the workflow, the decision you'd make differently next time. Founders too — demo the product, skip the hard sell. If it ships, it speaks.",
  },
  {
    title: "Craft over hype",
    icon: Hammer,
    copy: "The toolchain, the tradeoffs, the parts that hurt — the discipline that separates something shipped from something great.",
  },
  {
    title: "Taste",
    icon: Gem,
    copy: "We hold opinions about design, architecture, and what's worth shipping at all. Curated over cranked out.",
  },
  {
    title: "Living on the bleeding edge",
    icon: Zap,
    copy: "We push models past the defaults and past the docs, then turn what we find into product experiences nobody's shipped yet.",
  },
  {
    title: "Honest starting points",
    icon: Scale,
    copy: "Say where you actually are, not where you'd like to sound. Half-built, no users, revenue flat, six months in with nothing shipped — all fine, and all workable. We can't help you from a position you're pretending to be in, and nothing solid gets built on an inflated baseline.",
  },
  {
    title: "Proof of work",
    icon: BadgeCheck,
    copy: "Show the work and prove it. Screenshots, commits, the dashboard, the number that didn't go up. We'd rather see a small real result than hear a big vague one — claims are cheap and everyone has them.",
  },
  {
    title: "Community-driven",
    icon: Users,
    copy: "The room shows its work. Every session ends in 5-minute demos, and what people are stuck on between them is what the next one gets built around.",
  },
];

function PixelTrail() {
  // easter egg: the signal leads somewhere
  return (
    <a href="/standby" className="trail" aria-label="Standby screen">
      {[0, 1, 2, 3, 4, 5, 6, 7].map((i) => (
        <span key={i} className="px" style={{ animationDelay: `${i * 0.35}s` }} />
      ))}
    </a>
  );
}

const ORG_SCHEMA = {
  "@context": "https://schema.org",
  "@type": "Organization",
  name: "Ship AI",
  url: "https://www.shipai.club",
  logo: "https://www.shipai.club/logo-icon.png",
  description:
    "Free, public AI education in Phoenix and Tempe, Arizona. A community-run space for open sessions, workshops, and knowledge-sharing where builders show their work. Demos over memos.",
  sameAs: [DISCORD, MEETUP, LUMA, GITHUB],
  areaServed: ["Phoenix, AZ", "Tempe, AZ"],
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
          <a href="/hackathon">Hackathon</a>
          <a href={GITHUB} target="_blank" rel="noreferrer">GitHub</a>
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
            phx · free ai programs
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
            Ship AI runs free, multi-session programs for AI builders in Phoenix. Every
            session gets built live on screen, every file we make is published, and you
            demo what you shipped. Day One takes you from a blank chat box to something
            running. Zero to Launch takes the thing you built and finds it customers.
          </p>
          {/* Two buttons, not three. The programs are the front door; the
              hackathon is how one of them ends and has its own strip below. */}
          <div className="cta-row reveal" style={{ "--d": "380ms" }}>
            <a className="btn btn-solid" href="/programs">
              See the programs
              <ArrowRight size={15} strokeWidth={1.75} aria-hidden="true" />
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
              {PROGRAM_VENUES.join(" & ")}, Phoenix
            </span>
            <span>
              <Ticket size={13} strokeWidth={1.75} aria-hidden="true" />
              Free · open to all
            </span>
          </div>
          <div className="hero-foot reveal" style={{ "--d": "560ms" }}>
            <PixelTrail />
          </div>
        </section>

        {/* The programs are the main event now, so they run in the site's
            section rhythm with a real heading. The cards keep the promo
            markup; .hk-promo-inner carries all of its own styling. */}
        <section id="programs" className="section">
          <p className="kicker">The programs</p>
          <h2>Pick your on-ramp.</h2>
          {PROGRAMS.map((program) => {
            const venueNames = [...new Set(program.sessions.map((w) => venueOf({ ...w, venue: w.venue || program.defaultVenue }).name))];
            const statusLabel = program.status === "running"
              ? "Running now — our current program"
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
                </div>
              </div>
            );
          })}
        </section>

        {/* Slim strip, not a section: the hackathon is how one program ends,
            so it reuses the promo card at one line and a ghost CTA. */}
        <section className="hk-promo" aria-label="Zero to Launch hackathon">
          <div className="hk-promo-inner">
            <div>
              <p className="hk-promo-tag">
                <Rocket size={14} strokeWidth={1.75} aria-hidden="true" />
                {EVENT.dates} · {EVENT.venue}
              </p>
              <p className="hk-promo-copy">
                Zero to Launch ends in a hackathon where you don&apos;t build — you launch.
              </p>
              <p className="hk-promo-meta">
                <span>
                  <CalendarDays size={13} strokeWidth={1.75} aria-hidden="true" />
                  Submissions close {EVENT.deadline}
                </span>
                <span>
                  <Ticket size={13} strokeWidth={1.75} aria-hidden="true" />
                  Free · {EVENT.teams} · no application
                </span>
              </p>
            </div>
            <div className="hk-promo-cta">
              <a className="btn btn-ghost" href="/hackathon">
                The hackathon
              </a>
            </div>
          </div>
        </section>

        <section className="sponsor-strip reveal" style={{ "--d": "660ms" }} aria-label="Sponsors">
          <p className="strip-label">proudly sponsored by</p>
          <div className="sponsor-row">
            {SPONSORS.map((s) => (
            <a
              key={s.name}
              href={s.href}
              target="_blank"
              rel="noreferrer"
              aria-label={s.name}
              title={s.name}
              className="sponsor"
            >
              <img src={s.img} alt={s.name} className="sponsor-logo" />
              {s.wordmark && <span className="sponsor-name">{s.name}</span>}
            </a>
            ))}
          </div>
          <p className="strip-cta">
            Seeking corporate sponsors — help keep the programs free and public.{" "}
            <a href="/hackathon/sponsor">See what&apos;s fundable</a>
          </p>
        </section>

        <section className="section">
          <p className="kicker">What we're about</p>
          <p className="section-lede">
            Ship AI is a free, community-run AI education project. The premise is simple: the
            best AI education isn't behind a paywall or on a stage — it's builders showing each
            other the work, in the open, for free.
          </p>
          <div className="values">
            {values.map((v) => (
              <div key={v.title} className="value">
                <h3>
                  <v.icon className="icon" size={18} strokeWidth={1.75} aria-hidden="true" />
                  {v.title}
                </h3>
                <p>{v.copy}</p>
              </div>
            ))}
          </div>
        </section>

        <section id="who" className="section">
          <p className="kicker">Who it's for</p>
          <h2>Come as you are, if you build.</h2>
          <div className="audience">
            <div className="aud-col aud-for">
              <p className="aud-head">This is for you if</p>
              {/* Routes rather than filters. The old bullets sorted people
                  into in and out; there are two programs now, so the
                  honest answer to "am I ready" is "start here". */}
              <ul>
                <li>
                  You&apos;re new to this. Start at{" "}
                  <a href="/programs/day-one">Day One</a> — four sessions from a blank chat
                  box to something running.
                </li>
                <li>
                  You&apos;ve shipped something and nobody&apos;s using it yet. That&apos;s{" "}
                  <a href="/programs/zero-to-launch">Zero to Launch</a> — six sessions on
                  finding customers, then a hackathon.
                </li>
                <li>You&apos;d rather watch a real demo — even one that breaks — than a canned sales pitch.</li>
                <li>You want a room that argues about tradeoffs, not definitions.</li>
              </ul>
            </div>
            <div className="aud-col aud-not">
              <p className="aud-head">Maybe not yet if</p>
              <ul>
                <li>You're here to hard-sell or fill a lead list.</li>
                <li>"AI-powered" is the whole pitch and there's no build behind it.</li>
              </ul>
            </div>
          </div>
        </section>

        <section id="host" className="section">
          <p className="kicker">Your host</p>
          <div className="host">
            <img
              src="/santos.jpg"
              alt="Santos Hernandez, founder and host of Ship AI"
              width={140}
              height={140}
              className="host-photo"
            />
            <div className="host-body">
              <h2>Santos Hernandez</h2>
              <p className="host-role">Founder &amp; host</p>
              <p>
                Santos is a founder and Lead Product Engineer who builds agentic AI systems,
                works on the models underneath them, and shapes the product experiences on
                top. Before this he was the founding product hire at ZBD — the money layer
                for games — taking the product from $0 to $12M ARR and helping secure the
                EU's first MiCAR license approval plus money transmitter licenses across 26
                states and D.C. He started Ship AI to give Phoenix and Tempe builders a room
                where you show the work, not talk about it.
              </p>
              <p className="host-links">
                <a href="https://santos.lol" target="_blank" rel="noreferrer" aria-label="santos.lol" title="santos.lol">
                  <Globe size={18} strokeWidth={1.75} aria-hidden="true" />
                </a>
                <a href="https://x.com/5antoshernandez" target="_blank" rel="noreferrer" aria-label="X" title="X">
                  <BrandGlyph icon={siX} />
                </a>
                <a href="https://github.com/5antoshernandez" target="_blank" rel="noreferrer" aria-label="GitHub" title="GitHub">
                  <BrandGlyph icon={siGithub} />
                </a>
              </p>
            </div>
          </div>
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
            The rest of the calendar lives on{" "}
            <a href={LUMA} target="_blank" rel="noreferrer">Luma</a> and{" "}
            <a href={MEETUP} target="_blank" rel="noreferrer">Meetup</a> — or see the{" "}
            <a href="/programs/zero-to-launch">full curriculum</a>.
          </p>
        </section>

      </main>

      <footer className="footer">
        <div className="brand">
          <img src="/logo-icon.png" alt="" width={22} height={22} />
          <span>Ship AI</span>
        </div>
        <p>Phoenix &amp; Tempe, Arizona</p>
        <nav>
          <a href="/programs">Programs</a>
          <a href="/ai-meetup-phoenix">Phoenix</a>
          <a href="/ai-meetup-tempe">Tempe</a>
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
