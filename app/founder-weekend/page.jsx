import MobileNav from "../../components/mobile-nav";
import { CalendarDays, Coins, MapPin, Ticket, Users } from "lucide-react";
import { JsonLd, faqSchema } from "../../components/article";
import { Lockup } from "../../components/seal";
import { DISCORD } from "../../lib/hackathon";
import {
  FOUNDER_WEEKEND as FW,
  FW_BENEFITS,
  FW_CRITERIA,
  FW_FAQS,
  FW_HOSTS,
  FW_WEEKEND,
} from "../../lib/founder-weekend";
import { founderWeekendStats, founderWeekendTeams } from "../../lib/founder-weekend-stats";
import "./founder-weekend.css";

const REGISTER = `${FW.path}/register`;
const ROLE_REQUEST = "/login?next=/dashboard/requests";
const PRIZE = FW.prizePool ? `$${FW.prizePool.toLocaleString("en-US")} prize pool` : "Cash prizes and awards";

const FACTS = [
  { icon: CalendarDays, label: "When", value: FW.dates },
  { icon: MapPin, label: "Where", value: "Phoenix, Arizona" },
  { icon: Ticket, label: "Entry", value: `${FW.cost} · ${FW.teams.toLowerCase()}` },
  { icon: Coins, label: "Prizes", value: PRIZE },
];

const ROLES = [
  {
    name: "Mentor",
    copy: "Spend a few hours on the floor with teams. Founders, engineers, designers, marketers and operators all have something a team needs by Saturday afternoon.",
    cta: "Apply to mentor",
  },
  {
    name: "Volunteer",
    copy: "Run check-in, shoot photos and video, or keep the pitch schedule on time. You get a front-row seat to every pitch.",
    cta: "Apply to volunteer",
  },
];

const EVENT_SCHEMA = {
  "@context": "https://schema.org",
  "@type": "Event",
  name: `${FW.name}: Arizona AI Hackathon`,
  description: FW.description,
  startDate: FW.startISO,
  endDate: FW.endISO,
  eventAttendanceMode: "https://schema.org/OfflineEventAttendanceMode",
  eventStatus: "https://schema.org/EventScheduled",
  location: {
    "@type": "Place",
    name: "Phoenix, Arizona",
    address: { "@type": "PostalAddress", addressLocality: "Phoenix", addressRegion: "AZ", addressCountry: "US" },
  },
  organizer: { "@type": "Organization", name: "Ship AI", url: "https://www.shipai.club" },
  performer: FW_HOSTS.map((host) => ({ "@type": "Person", name: host.name })),
  url: FW.url,
  image: ["https://www.shipai.club/og-community.png"],
  isAccessibleForFree: true,
  offers: {
    "@type": "Offer",
    price: "0",
    priceCurrency: "USD",
    availability: "https://schema.org/InStock",
    url: `https://www.shipai.club${REGISTER}`,
    validFrom: "2026-10-28T00:00:00-07:00",
  },
};

export const metadata = {
  title: FW.seoTitle,
  description: FW.description,
  keywords: [
    "AI hackathon Arizona",
    "AZ AI hackathon",
    "Phoenix hackathon",
    "AI hackathon Phoenix",
    "startup weekend Phoenix",
    "Arizona startup hackathon",
    "build an AI company",
  ],
  alternates: { canonical: FW.url },
  openGraph: {
    title: `${FW.name} · Arizona AI Hackathon`,
    description: `${FW.tagline} Free in Phoenix, ${FW.datesShort}. Teams of 1–4.`,
    url: FW.url,
    siteName: "Ship AI",
    images: [{ url: "/og-community.png", width: 1200, height: 630 }],
  },
  twitter: {
    card: "summary_large_image",
    title: `${FW.name} · Arizona AI Hackathon`,
    description: `${FW.tagline} Free in Phoenix, ${FW.datesShort}.`,
    images: ["/og-community.png"],
  },
};

export const revalidate = 30;

function initial(name) {
  return Array.from(String(name || "").trim())[0]?.toUpperCase() || "?";
}

export default async function Page() {
  const [stats, teams] = await Promise.all([founderWeekendStats(), founderWeekendTeams()]);
  const counts = [
    { label: "Teams registered", value: stats.teams },
    { label: "Participants", value: stats.participants },
    { label: "Projects submitted", value: stats.projects },
  ];

  return (
    <>
      <JsonLd data={EVENT_SCHEMA} />
      <JsonLd data={faqSchema(FW_FAQS)} />
      <header className="nav">
        <Lockup />
        <nav>
          <a href="#why">Why</a>
          <a href="#judging">Judging</a>
          <a href="#weekend">Weekend</a>
          <a href="#faq">FAQ</a>
        </nav>
        <a className="btn btn-solid nav-cta" href={REGISTER}>Register your team</a>
        <MobileNav extraLinks={[{ href: REGISTER, label: "Register your team" }]} />
      </header>

      <main id="top" className="hk-simple fw">
        <section className="hero hk-hero">
          <p className="eyebrow">Arizona AI hackathon · Phoenix · {FW.datesShort}</p>
          <h1 className="hero-h1">
            Founder <span className="hero-accent">Weekend</span>
          </h1>
          <p className="lede">
            Build an AI company in one weekend. Ship it by Sunday, then pitch it to judges, employers and investors.
          </p>
          <div className="cta-row">
            <a className="btn btn-solid" href={REGISTER}>Register your team</a>
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

        <section className="section" id="why">
          <div className="fw-why">
            <div>
              <h2>Why a weekend</h2>
              <p className="section-lede">
                You&apos;ve had the idea for months. AI made building it cheap. What&apos;s missing is a deadline, a team and a room that expects you to ship.
              </p>
              <p className="section-lede">
                Founder Weekend gives you all three, and puts the people who hire and invest in the front row.
              </p>
            </div>
            {FW.whyVideo && (
              <video className="fw-video" src={FW.whyVideo} poster={FW.whyPoster || undefined} controls playsInline preload="metadata" />
            )}
          </div>
        </section>

        <section className="section" id="benefits">
          <h2>What you leave with</h2>
          <div className="hk-focus-grid">
            {FW_BENEFITS.map((benefit) => (
              <div key={benefit.name}>
                <h3>{benefit.name}</h3>
                <p>{benefit.copy}</p>
              </div>
            ))}
          </div>
        </section>

        <section className="section" id="judging">
          <h2>How teams are judged</h2>
          <p className="section-lede">Six criteria, each scored from 1 to 10. Pitches run five minutes.</p>
          <ol className="fw-criteria">
            {FW_CRITERIA.map((criterion, index) => (
              <li key={criterion.name}>
                <span className="fw-criteria-n">{String(index + 1).padStart(2, "0")}</span>
                <h3>{criterion.name}</h3>
                <p>{criterion.parts.join(" · ")}</p>
                <span className="fw-criteria-scale">1–10</span>
              </li>
            ))}
          </ol>
        </section>

        <section className="section" id="weekend">
          <h2>The weekend</h2>
          <div className="hk-weekend-grid">
            {FW_WEEKEND.map((day) => (
              <div key={day.day}>
                <h3>{day.day}</h3>
                <p className="hk-hours">{day.hours}</p>
                <p>{day.copy}</p>
              </div>
            ))}
          </div>
          <p className="hk-note">Arizona time. Submissions close at {FW.deadline}.</p>
        </section>

        <section className="section" id="teams" aria-labelledby="fw-teams-title">
          <h2 id="fw-teams-title">Who&apos;s building</h2>
          <div className="hk-stat-band" aria-label="Registration counts">
            {counts.map((count) => (
              <div className="hk-stat-item" key={count.label}>
                <p className="hk-stat-value">{count.value.toLocaleString("en-US")}</p>
                <p className="hk-stat-label">{count.label}</p>
              </div>
            ))}
          </div>
          {teams.length > 0 ? (
            <ul className="fw-teams">
              {teams.map((team) => (
                <li key={team.slug}>
                  <span className="fw-team-mark" aria-hidden="true">{initial(team.name)}</span>
                  <span className="fw-team-name">{team.name}</span>
                  <span className="fw-team-size"><Users size={13} aria-hidden="true" /> {team.member_count}</span>
                </li>
              ))}
            </ul>
          ) : (
            <p className="section-lede">Register now and your team is the first one on this list.</p>
          )}
          <div className="cta-row">
            <a className="btn btn-solid" href={REGISTER}>Register your team</a>
          </div>
        </section>

        <section className="section" id="hosts">
          <h2>Hosts and judges</h2>
          <ul className="hk-judge-list">
            {FW_HOSTS.map((host) => (
              <li className="hk-judge" key={host.name}>
                <span className="hk-roster-avatar hk-judge-avatar">
                  <img src={host.photo} alt="" width="64" height="64" loading="lazy" />
                </span>
                <div className="hk-roster-body">
                  <h3>{host.name}</h3>
                  <p>{host.role}</p>
                </div>
              </li>
            ))}
          </ul>
        </section>

        <section className="section" id="help">
          <h2>Mentors and volunteers</h2>
          <div className="hk-roles">
            {ROLES.map((role) => (
              <div className="hk-role" key={role.name}>
                <h3>{role.name}</h3>
                <p>{role.copy}</p>
                <p className="hk-role-cta"><a href={ROLE_REQUEST}>{role.cta} →</a></p>
              </div>
            ))}
          </div>
        </section>

        <section className="section" id="faq">
          <h2>FAQ</h2>
          <div className="hk-faq">
            {FW_FAQS.map((faq) => (
              <details className="hk-faq-item" key={faq.q}>
                <summary>
                  <h3>{faq.q}</h3>
                  <span className="hk-faq-chevron" aria-hidden="true" />
                </summary>
                <p>{faq.a}</p>
              </details>
            ))}
          </div>
        </section>

        <section className="section hk-close">
          <h2>{FW.tagline}</h2>
          <p className="section-lede">Free. {FW.teams}. Phoenix, {FW.dates}.</p>
          <div className="cta-row">
            <a className="btn btn-solid" href={REGISTER}>Register your team</a>
            <a className="btn btn-ghost" href={DISCORD} target="_blank" rel="noopener noreferrer">Join Discord</a>
          </div>
        </section>
      </main>

      <footer className="footer">
        <Lockup compact />
        <nav>
          <a href="/">Home</a>
          <a href="/programs">Programs</a>
          <a href={REGISTER}>Register</a>
        </nav>
        <p className="fine">© 2026 Ship AI</p>
      </footer>
    </>
  );
}
