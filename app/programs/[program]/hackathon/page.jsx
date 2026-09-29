import { notFound } from "next/navigation";
import { CalendarDays, Coins, MapPin, Ticket } from "lucide-react";
import { JsonLd } from "../../../../components/article";
import HackathonJudges from "../../../../components/hackathon-judges";
import HackathonRoster from "../../../../components/hackathon-roster";
import HackathonSponsors from "../../../../components/hackathon-sponsors";
import { PROGRAMS, programBySlug } from "../../../../lib/programs";
import { EVENT, DISCORD } from "../../../../lib/hackathon";

const FACTS = [
  { icon: Coins, label: "Prize pool", value: "$1,000" },
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
    title: EVENT.name,
    description: EVENT.description,
    url: "https://www.shipai.club/programs/zero-to-launch/hackathon",
    siteName: "Ship AI",
    images: [{ url: "/og-image.jpg", width: 1200, height: 630 }],
  },
};

// Keep the public judge and sponsor lists current as accounts are updated.
export const revalidate = 300;

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
      </header>

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

        <section className="section" id="focus">
          <h2>Design, craft, and receipts <span className="hk-focus-note">(amount shipped)</span></h2>
          <div className="hk-focus-grid">
            {FOCUS.map((item) => (
              <div key={item.name}>
                <h3>{item.name}</h3>
                <p>{item.copy}</p>
              </div>
            ))}
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
              <p>Meet your team, join on-site sessions, and build and launch your site.</p>
            </div>
            <div>
              <h3>Sunday, Oct 18</h3>
              <p className="hk-hours">9 AM–2 PM</p>
              <p>Finish and submit by noon. Recorded pitches at 12:15 PM, awards at 1:30 PM.</p>
            </div>
          </div>
          <p className="hk-note">Arizona time · {EVENT.address}. Please park in the surface lot.</p>
        </section>

        <HackathonRoster />
        <HackathonJudges />
        <HackathonSponsors compact />

        <section className="section hk-close">
          <h2>Leave with a live site.</h2>
          <p className="section-lede">
            New and existing projects welcome. Any tools, any stack. You keep your IP.
            Submit your live URL by noon on Sunday, October 18.
          </p>
          <div className="cta-row">
            <a className="btn btn-solid" href="/dashboard">Register your team</a>
            <a className="btn btn-ghost" href={DISCORD} target="_blank" rel="noreferrer">Join Discord</a>
          </div>
          <p className="hk-note">
            <a href="/programs/zero-to-launch/hackathon/submit">Submission details</a>
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
