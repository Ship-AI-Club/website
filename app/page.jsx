import { getUpcomingEvents } from "../lib/meetup";

const DISCORD = "https://discord.gg/kZSJMNveYM";
const MEETUP = "https://www.meetup.com/shipai/";
const LUMA = "https://luma.com/shipai";
const GITHUB = "https://github.com/Ship-AI-Club";

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
    time: "first 20 min",
    title: "AI News Briefing",
    copy: "A tight rundown of what matters for builders right now. Signal only.",
  },
  {
    n: "02",
    time: "main session",
    title: "Socratic Rounds",
    copy: "Community-submitted topics, dug into as a group. Questions first, hot takes welcome, receipts required.",
  },
  {
    n: "03",
    time: "closing",
    title: "5-Minute Demos",
    copy: "Show what you shipped. No hard selling — just what it does and what you learned building it.",
  },
];

const values = [
  {
    title: "Demos over memos",
    copy: "Show the build, the workflow, the decisions behind it. No slideware, no pitch decks. If it ships, it speaks.",
  },
  {
    title: "Craft over hype",
    copy: "The toolchain, the design decisions, the tradeoffs — the discipline that separates something shipped from something great.",
  },
  {
    title: "Taste",
    copy: "We have opinions — about design, architecture, and what makes an experience worth shipping. Curated over cranked out.",
  },
  {
    title: "Community-driven",
    copy: "Members set the agenda. Topics and demo requests are submitted, voted on, and shape every session.",
  },
];

function PixelTrail() {
  return (
    <span className="trail" aria-hidden="true">
      {[0, 1, 2, 3, 4, 5, 6, 7].map((i) => (
        <span key={i} className="px" style={{ animationDelay: `${i * 0.35}s` }} />
      ))}
    </span>
  );
}

export default async function Page() {
  const events = await getUpcomingEvents(4);

  return (
    <>
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
            <span className="node" aria-hidden="true" />
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
            A high-signal community for technical founders and builders pushing the bleeding
            edge of AI. Show the build, the workflow, the decisions behind it. No slideware,
            no hard selling. If it ships, it speaks.
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
                <h3>{f.title}</h3>
                <p>{f.copy}</p>
              </li>
            ))}
          </ol>
          <p className="rule-line">questions first · hot takes welcome · receipts required</p>
        </section>

        <section className="section">
          <p className="kicker">What we're about</p>
          <div className="values">
            {values.map((v) => (
              <div key={v.title} className="value">
                <h3>{v.title}</h3>
                <p>{v.copy}</p>
              </div>
            ))}
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
                    <p className="event-venue">{e.place}</p>
                  </div>
                  <span className="event-arrow" aria-hidden="true">→</span>
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
          <a href={DISCORD} target="_blank" rel="noreferrer">Discord</a>
          <a href={MEETUP} target="_blank" rel="noreferrer">Meetup</a>
          <a href={LUMA} target="_blank" rel="noreferrer">Luma</a>
          <a href={GITHUB} target="_blank" rel="noreferrer">GitHub</a>
        </nav>
        <p className="fine">© 2026 Ship AI</p>
      </footer>
    </>
  );
}
