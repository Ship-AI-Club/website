import MobileNav from "../../components/mobile-nav";
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
import { Lockup } from "../../components/seal";
import { ogImage } from "../../lib/og";

const TITLE = "About — Ship AI";
const DESCRIPTION =
  "Ship AI runs hands-on AI workshops and programs in Phoenix. Expert guidance, practical projects, and a community of builders. Our values and host.";

export const metadata = {
  title: TITLE,
  description: DESCRIPTION,
  alternates: { canonical: "https://www.shipai.club/about" },
  openGraph: {
    title: TITLE,
    description: DESCRIPTION,
    url: "https://www.shipai.club/about",
    siteName: "Ship AI",
    images: [ogImage({ kicker: "About Ship AI", title: "What we're about.", key: "about.", tagline: "Practical AI education for Phoenix builders. Our values and our host." })],
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
    title: "Learn by Building",
    icon: GraduationCap,
    copy: "Focused workshops pair expert guidance with time to work on your own project. Bring a question, build something useful, and share what you learn.",
  },
  {
    title: "Demos Over Memos",
    icon: MonitorPlay,
    copy: "Show the build, the workflow, the call you'd make differently — founders too: demo the product, skip the hard sell.",
  },
  {
    title: "Craft Over Hype",
    icon: Hammer,
    copy: "The toolchain, the tradeoffs, the parts that hurt — what separates shipped from great.",
  },
  {
    title: "Taste",
    icon: Gem,
    copy: "We hold opinions about design, architecture, and what's worth shipping at all — curated over cranked out.",
  },
  {
    title: "Living on the Bleeding Edge",
    icon: Zap,
    copy: "We push models past the defaults and the docs, then ship what we find as products nobody's built yet.",
  },
  {
    title: "Honest Starting Points",
    icon: Scale,
    copy: "Say where you actually are — half-built, no users, revenue flat, six months in with nothing shipped — because nothing solid gets built on an inflated baseline.",
  },
  {
    title: "Proof of Work",
    icon: BadgeCheck,
    copy: "Screenshots, commits, the number that didn't go up — a small real result beats a big vague claim.",
  },
  {
    title: "Community-Driven",
    icon: Users,
    copy: "Every session ends in 5-minute demos, and what you're stuck on is what the next one gets built around.",
  },
];

export default function Page() {
  return (
    <>
      <header className="nav">
        <Lockup />
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

      <main>
        <section className="section">
          <p className="kicker">About</p>
          <h1>What we're about.</h1>
          <p className="section-lede">
            Ship AI brings Phoenix builders together for practical AI education. Our paid
            workshops give you focused time, expert guidance, and feedback on your project.
            Learn the tools, develop your judgment, and ship work you can use.
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
        <Lockup compact />
        <nav>
          <a href="/workshops">Workshops</a>
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
