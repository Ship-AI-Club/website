import {
  ArrowRight,
  CalendarDays,
  Gem,
  Globe,
  GraduationCap,
  Hammer,
  MapPin,
  MessageSquarePlus,
  MessagesSquare,
  MonitorPlay,
  Presentation,
  Radio,
  Users,
  Zap,
} from "lucide-react";
import { siDiscord, siGithub, siMeetup, siX } from "simple-icons";
import { getUpcomingEvents } from "../lib/meetup";
import { JsonLd } from "../components/article";

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
const SUBMIT_TOPIC = "https://github.com/Ship-AI-Club/events/issues/new?title=Topic%3A%20";

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

const format = [
  {
    n: "01",
    icon: Radio,
    time: "first 20 min",
    title: "AI News Briefing",
    copy: "What changed this week and why it matters for what you're building. Signal only.",
  },
  {
    n: "02",
    icon: MessagesSquare,
    time: "main session",
    title: "Socratic Rounds",
    copy: "The topics you voted for, argued out as a room. Questions first, hot takes welcome, receipts required.",
  },
  {
    n: "03",
    icon: Presentation,
    time: "closing",
    title: "5-Minute Demos",
    copy: "Five minutes, your build, live. What it does, how it's made, what broke along the way.",
  },
];

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
    title: "Community-driven",
    icon: Users,
    copy: "Members set the agenda. Every topic is submitted and voted on before it hits the floor — the room decides what's worth debating.",
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
  const events = await getUpcomingEvents(4);

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
          <a href="#format">Format</a>
          <a href="#events">Events</a>
          <a href={GITHUB} target="_blank" rel="noreferrer">GitHub</a>
        </nav>
        <a className="btn btn-solid nav-cta" href={DISCORD} target="_blank" rel="noreferrer">
          Join the Discord
        </a>
      </header>

      <main id="top">
        <section className="hero">
          <p className="eyebrow reveal" style={{ "--d": "0ms" }}>
            <a href="/standby" className="node" aria-label="Standby screen" />
            phx · tpe — ai craftspeople
          </p>
          <h1 className="sr-only">Demos over memos.</h1>
          <div className="hero-title" aria-hidden="true">
            <div className="reveal" style={{ "--d": "80ms" }}>
              <pre className="ascii">{ASCII_DEMOS}</pre>
            </div>
            <div className="reveal" style={{ "--d": "160ms" }}>
              <pre className="ascii">{ASCII_OVER}</pre>
            </div>
            <div className="reveal memos" style={{ "--d": "240ms" }}>
              <pre className="ascii ascii-memos">{ASCII_MEMOS}</pre>
              <span className="strike" />
            </div>
          </div>
          <p className="lede reveal" style={{ "--d": "280ms" }}>
            Free, public AI education in Phoenix &amp; Tempe — open sessions, workshops, and
            knowledge-sharing for builders who've shipped and want to go deeper. We learn by
            showing the work: the build, the workflow, the decisions behind it. No slideware,
            no hard sell. If it ships, it speaks.
          </p>
          <div className="cta-row reveal" style={{ "--d": "380ms" }}>
            <a className="btn btn-solid" href={DISCORD} target="_blank" rel="noreferrer">
              Join the Discord
            </a>
            <a className="btn btn-ghost" href={MEETUP} target="_blank" rel="noreferrer">
              RSVP on Meetup
            </a>
          </div>
          <div className="hero-foot reveal" style={{ "--d": "500ms" }}>
            <PixelTrail />
          </div>
        </section>

        <section className="sponsor-strip reveal" style={{ "--d": "600ms" }} aria-label="Sponsors">
          <span className="strip-label">sponsors</span>
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
        </section>

        <section id="format" className="section">
          <p className="kicker">The Socratic Night</p>
          <h2>Every session runs the same spine.</h2>
          <ol className="format-list">
            {format.map((f) => (
              <li key={f.n}>
                <div className="format-head">
                  <span className="format-n">{f.n}</span>
                  <span className="format-time">{f.time}</span>
                </div>
                <h3>
                  <f.icon className="icon" size={18} strokeWidth={1.75} aria-hidden="true" />
                  {f.title}
                </h3>
                <p>{f.copy}</p>
              </li>
            ))}
          </ol>
          <p className="rule-line">questions first · hot takes welcome · receipts required</p>
          <p className="submit-topic">
            <MessageSquarePlus size={16} strokeWidth={1.75} aria-hidden="true" />
            Got a topic or a hot take?{" "}
            <a href={SUBMIT_TOPIC} target="_blank" rel="noreferrer">Submit it on GitHub</a>
            {" "}— the community votes it into a session.
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
              <ul>
                <li>You've shipped with AI — or at least tinkered your way to a working app.</li>
                <li>You're a founder, engineer, designer, or researcher who's past the tutorials.</li>
                <li>You'd rather watch a real demo — even one that breaks — than a canned sales pitch.</li>
                <li>You want a room that argues about tradeoffs, not definitions.</li>
              </ul>
            </div>
            <div className="aud-col aud-not">
              <p className="aud-head">Maybe not yet if</p>
              <ul>
                <li>You're brand new to AI and haven't built anything yet — get the fundamentals down, then come.</li>
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
          <p className="kicker">Upcoming</p>
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
            Full calendar on <a href={LUMA} target="_blank" rel="noreferrer">Luma</a> and{" "}
            <a href={MEETUP} target="_blank" rel="noreferrer">Meetup</a>.
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
          <a href="/socratic-night">Socratic Night</a>
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
