import MobileNav from "../../../../components/mobile-nav";
import { notFound } from "next/navigation";
import { CalendarDays, Coins, MapPin, Ticket } from "lucide-react";
import { JsonLd } from "../../../../components/article";
import HackathonJudges from "../../../../components/hackathon-judges";
import HackathonRoster from "../../../../components/hackathon-roster";
import HackathonTeams from "../../../../components/hackathon-teams";
import HackathonSponsors from "../../../../components/hackathon-sponsors";
import { PROGRAMS, programBySlug } from "../../../../lib/programs";
import { EVENT, DISCORD, HACKATHON_PRIZES, HACKATHON_MAX_PRIZE_VALUE } from "../../../../lib/hackathon";
import { BREAKOUTS, OPENING_DECK, SATURDAY_AGENDA } from "../../../../lib/hackathon-opening";
import "../../../../app/hackathon-opening.css";

const FACTS = [
  { icon: Coins, label: "Prize pool", value: `Up to $${HACKATHON_MAX_PRIZE_VALUE.toLocaleString('en-US')} total value` },
  { icon: CalendarDays, label: "When", value: EVENT.dates },
  { icon: MapPin, label: "Where", value: `${EVENT.venue} · ${EVENT.city}` },
  { icon: Ticket, label: "Entry", value: "Free · teams of 1–4" },
];

const FOCUS = [
  { name: "Design", copy: "Make your site clear, useful, and easy to navigate." },
  { name: "Craft", copy: "Polish the details. Make it work well on every screen." },
  { name: "Receipts", copy: "Show the amount you shipped: live pages, working features, and a real URL." },
];

const BENEFITS = [
  "Employers and business professionals attending",
  "Certifications for everyone who submits",
  "Launch your site and product",
  "Networking and team building",
  "On-site sessions on Saturday",
  "Recorded pitch and content for your project",
];

const EVENT_SCHEMA = {
  "@context": "https://schema.org",
  "@type": "Event",
  name: EVENT.name,
  description: EVENT.description,
  startDate: EVENT.startISO,
  endDate: EVENT.endISO,
  eventAttendanceMode: "https://schema.org/OfflineEventAttendanceMode",
  eventStatus: "https://schema.org/EventScheduled",
  location: { "@type": "Place", name: EVENT.venue, address: EVENT.address },
  organizer: { "@type": "Organization", name: "Ship AI", url: "https://www.shipai.club" },
  url: "https://www.shipai.club/programs/zero-to-launch/hackathon",
  isAccessibleForFree: true,
  offers: {
    "@type": "Offer",
    price: "0",
    priceCurrency: "USD",
    availability: "https://schema.org/InStock",
    url: EVENT.meetup,
  },
};

export const metadata = {
  title: EVENT.name,
  description: EVENT.description,
  alternates: { canonical: "https://www.shipai.club/programs/zero-to-launch/hackathon" },
  openGraph: {
    title: 'Zero to Launch Hackathon — Build Your AI Organization | Ship AI',
    description: 'Build your AI organization and launch a useful site in Phoenix. Four guided breakouts connect positioning, product design, engineering and marketing.',
    url: "https://www.shipai.club/programs/zero-to-launch/hackathon",
    siteName: "Ship AI",
    images: [{ url: "/ship-ai-social.jpg", width: 1280, height: 730 }],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Zero to Launch Hackathon — Build Your AI Organization | Ship AI',
    description: 'Build your AI organization and launch a useful site in Phoenix. Four guided breakouts connect positioning, product design, engineering and marketing.',
    images: ['/ship-ai-social.jpg'],
  },
};

// Keep the public judge and sponsor lists current as accounts are updated.
export const revalidate = 30;

export function generateStaticParams() {
  return PROGRAMS.filter((program) => program.hasHackathon).map((program) => ({
    program: program.slug,
  }));
}

export default async function Page({ params }) {
  const { program: programSlug } = await params;
  if (!programBySlug(programSlug)?.hasHackathon) notFound();

  return (
    <>
      <JsonLd data={EVENT_SCHEMA} />
      <header className="nav">
        <a href="/" className="brand">
          <img src="/logo-mark.png" alt="" width={26} height={26} />
          <span>Ship AI</span>
        </a>
        <nav>
          <a href="#focus">What to build</a>
          <a href="#schedule">Weekend</a>
          <a href="#teams">Teams</a>
          <a href="#judges">Judges</a>
        </nav>
        <a className="btn btn-solid nav-cta" href="/dashboard">Register your team</a>
      <MobileNav /></header>

      <main id="top" className="hk-simple">
        <section className="hero hk-hero">
          <p className="eyebrow">Zero to Launch · {EVENT.datesShort} · Phoenix</p>
          <h1 className="hero-h1">
            Ship AI AZ{" "}<br />
            <span className="hero-accent">GTM Hackathon</span>
          </h1>
          <p className="lede">
            Build and ship the best marketing site. Bring a teammate or come solo and find one.
          </p>
          <div className="cta-row">
            <a className="btn btn-solid" href="/dashboard">Register your team</a>
            <a className="btn btn-ghost" href={EVENT.meetup} target="_blank" rel="noreferrer">RSVP on Meetup</a>
            <a className="btn btn-ghost" href={OPENING_DECK} target="_blank" rel="noopener noreferrer">Open the opening ceremony deck</a>
            <a className="btn btn-ghost" href={DISCORD} target="_blank" rel="noopener noreferrer">Join Discord</a>
          </div>
        </section>

        <section className="hk-facts" aria-label="Event details">
          {FACTS.map((fact) => (
            <div key={fact.label} className="hk-fact">
              <p className="hk-fact-label">
                <fact.icon size={14} strokeWidth={1.75} aria-hidden="true" />
                {fact.label}
              </p>
              <p className="hk-fact-value">{fact.value}</p>
            </div>
          ))}
        </section>

        <section className="section" id="decks">
          <h2>Build your AI organization</h2>
          <div className="hk-live-resources">
            <a href={OPENING_DECK} target="_blank" rel="noopener noreferrer">
              <span>START HERE · SATURDAY, 9:00 AM ↗</span>
              <h3>Opening ceremony</h3>
              <p>Meet the AI organization you’ll build. Get the agenda, team setup, judging, prizes, and Sunday pitch plan.</p>
            </a>
            {BREAKOUTS.map(item => <a key={item.number} href={item.href} target="_blank" rel="noopener noreferrer">
              <span>BREAKOUT {item.number} · {item.time} · 45 MIN ↗</span>
              <h3>{item.title}</h3>
              <p>{item.outcome}</p>
            </a>)}
          </div>
          <p className="hk-note"><a href="/programs/zero-to-launch/hackathon/bots" target="_blank" rel="noopener noreferrer">Open all bot templates ↗</a> · Copy one setup prompt in each breakout and let your assistant guide you.</p>
        </section>

        <section className="section" id="focus">
          <h2>Design, craft, and receipts</h2>
          <div className="hk-focus-grid">
            {FOCUS.map((item) => (
              <div key={item.name}>
                <h3>{item.name}</h3>
                <p>{item.copy}</p>
              </div>
            ))}
          </div>
        </section>

        <section className="section" id="prizes">
          <h2>Prizes for what you ship</h2>
          <div className="hk-focus-grid">
            {HACKATHON_PRIZES.map(prize => <div key={prize.name}>
              <h3>{prize.name} · ${prize.cash}</h3>
              {prize.extra && <p>{prize.extra}.</p>}
            </div>)}
          </div>
        </section>

        <section className="section" id="benefits">
          <h2>What’s in it for you</h2>
          <ul className="hk-benefit-list">
            {BENEFITS.map((benefit) => <li key={benefit}>{benefit}</li>)}
          </ul>
        </section>

        <section className="section" id="schedule">
          <h2>The weekend</h2>
          <div className="hk-weekend-grid">
            <div>
              <h3>Saturday, Oct 17</h3>
              <p className="hk-hours">9 AM–5 PM</p>
              <p>Four guided breakouts with time to work between them. Lunch at noon. Wrap up at 5 PM.</p>
            </div>
            <div>
              <h3>Sunday, Oct 18</h3>
              <p className="hk-hours">9 AM–2 PM</p>
              <p>Start at 9 AM. Submit by 1:00 PM. Awards are planned for 1:30 PM.</p>
            </div>
          </div>
          <ol className="hk-morning-agenda" aria-label="Saturday agenda">
            {SATURDAY_AGENDA.map(item => <li key={item.time}><time>{item.time}</time><span>{item.title}{item.duration ? ` · ${item.duration}` : ''}</span></li>)}
          </ol>
          <p className="hk-note">Arizona time · {EVENT.address}. Please park in the surface lot.</p>
        </section>

        <HackathonTeams />
        <HackathonRoster />
        <HackathonJudges />
        <HackathonSponsors compact />

        <section className="section hk-close">
          <h2>Leave with a live site.</h2>
          <p className="section-lede">
            New and existing projects welcome. Any tools, any stack. You keep your IP.
            Submit your live URL by 1:00 PM on Sunday, October 18.
          </p>
          <div className="cta-row">
            <a className="btn btn-solid" href="/dashboard">Register your team</a>
            <a className="btn btn-ghost" href={DISCORD} target="_blank" rel="noreferrer">Join Discord</a>
          </div>
          <p className="hk-note">
            <a href="/programs/zero-to-launch/hackathon/submit">Submission details</a>
            {" · "}<a href="/programs/zero-to-launch/hackathon/pitch">Five-minute pitch reference</a>
            {" · "}<a href="/programs/zero-to-launch/hackathon/sponsor">Sponsor the event</a>
          </p>
        </section>
      </main>

      <footer className="footer">
        <div className="brand">
          <img src="/logo-mark.png" alt="" width={22} height={22} />
          <span>Ship AI</span>
        </div>
        <nav>
          <a href="/">Home</a>
          <a href="/programs/zero-to-launch">Workshops</a>
          <a href="/programs/zero-to-launch/hackathon/results">Results</a>
        </nav>
        <p className="fine">Sponsored by Workuity · © 2026 Ship AI</p>
      </footer>
    </>
  );
}
