import {
  BadgeCheck,
  Gem,
  Globe,
  GraduationCap,
  Hammer,
  MonitorPlay,
  Scale,
  Users,
  Zap,
} from "lucide-react";
import { siDiscord, siGithub, siMeetup, siX } from "simple-icons";

const TITLE = "About — Ship AI";
const DESCRIPTION =
  "Ship AI is a free, community-run AI education project in Phoenix — community-run, craft over hype. Our values, and the host who runs it.";

export const metadata = {
  title: TITLE,
  description: DESCRIPTION,
  alternates: { canonical: "https://www.shipai.club/about" },
  openGraph: {
    title: TITLE,
    description: DESCRIPTION,
    url: "https://www.shipai.club/about",
    siteName: "Ship AI",
    images: [{ url: "/og-image.jpg", width: 1200, height: 630 }],
  },
};

const DISCORD = "https://discord.gg/kZSJMNveYM";
const MEETUP = "https://www.meetup.com/shipai/";
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

const values = [
  {
    title: "Free and open",
    icon: GraduationCap,
    copy: "Every session is free and public — you pay by teaching the room what you know.",
  },
  {
    title: "Demos over memos",
    icon: MonitorPlay,
    copy: "Show the build, the workflow, the call you'd make differently — founders too: demo the product, skip the hard sell.",
  },
  {
    title: "Craft over hype",
    icon: Hammer,
    copy: "The toolchain, the tradeoffs, the parts that hurt — what separates shipped from great.",
  },
  {
    title: "Taste",
    icon: Gem,
    copy: "We hold opinions about design, architecture, and what's worth shipping at all — curated over cranked out.",
  },
  {
    title: "Living on the bleeding edge",
    icon: Zap,
    copy: "We push models past the defaults and the docs, then ship what we find as products nobody's built yet.",
  },
  {
    title: "Honest starting points",
    icon: Scale,
    copy: "Say where you actually are — half-built, no users, revenue flat, six months in with nothing shipped — because nothing solid gets built on an inflated baseline.",
  },
  {
    title: "Proof of work",
    icon: BadgeCheck,
    copy: "Screenshots, commits, the number that didn't go up — a small real result beats a big vague claim.",
  },
  {
    title: "Community-driven",
    icon: Users,
    copy: "Every session ends in 5-minute demos, and what you're stuck on is what the next one gets built around.",
  },
];

export default function Page() {
  return (
    <>
      <header className="nav">
        <a href="/" className="brand">
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

      <main>
        <section className="section">
          <p className="kicker">About</p>
          <h1>What we're about.</h1>
          <p className="section-lede">
            Ship AI is community-run: the best AI education isn't behind a paywall or on a
            stage, it's builders showing each other the work in the open, for free.
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
                Santos is a founder and Lead Product Engineer building agentic AI systems.
                Before this he was the founding product hire at ZBD, taking it from $0 to
                $12M ARR and helping secure the EU's first MiCAR approval plus money
                transmitter licenses across 26 states and D.C. He started Ship AI so
                Phoenix builders have a room where you show the work.
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
