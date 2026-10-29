import { Award, BadgeCheck, Briefcase, Clapperboard, Compass, Landmark, Users } from "lucide-react";
import { JsonLd, faqSchema } from "../../../components/article";
import Scene from "../../../components/scene";
import { Seal } from "../../../components/seal";
import SiteFooter from "../../../components/site-footer";
import SiteHeader from "../../../components/site-header";
import {
  FOUNDER_WEEKEND as FW,
  FW_BENEFITS,
  FW_CRITERIA,
  FW_FAQS,
  FW_HOSTS,
  FW_WEEKEND,
} from "../../../lib/founder-weekend";
import { founderWeekendStats, founderWeekendTeams } from "../../../lib/founder-weekend-stats";
import "./founder-weekend.css";

const REGISTER = `${FW.path}/register`;
const RSVP = FW.rsvpUrl || REGISTER;
const RSVP_LINK = FW.rsvpUrl ? { href: RSVP, target: "_blank", rel: "noopener noreferrer" } : { href: RSVP };
const RSVP_LABEL = FW.rsvpUrl ? "RSVP on Luma" : "Register your team";
const ROLE_REQUEST = "/login?next=/dashboard/requests";
const PRIZE = FW.prizePool ? `$${FW.prizePool.toLocaleString("en-US")}` : "Cash";
const NAV = [
  { href: "#why", label: "Why" },
  { href: "#judging", label: "Judging" },
  { href: "#weekend", label: "Weekend" },
  { href: "#faq", label: "FAQ" },
];

const FACTS = [
  { value: "Feb 6–7", label: "Saturday and Sunday, 2027" },
  { value: "Phoenix", label: FW.venue },
  { value: FW.cost, label: FW.teams },
  { value: PRIZE, label: FW.prizePool ? "Prize pool" : "Prizes and awards" },
];

const BENEFIT_ICONS = {
  "Prize pool": Award,
  "Venture capitalists": Landmark,
  "Employer network": Briefcase,
  Certificates: BadgeCheck,
  Mentors: Compass,
  "Your pitch, recorded": Clapperboard,
};

const MISSING = [
  { k: "A deadline", v: "Submissions close Sunday at noon" },
  { k: "A team", v: "Up to four, or find one at kickoff" },
  { k: "A room", v: "Judges, employers and investors watching" },
];

const ROLES = [
  {
    name: "Mentor",
    copy: "Spend a few hours on the floor with teams. Founders, engineers, designers, marketers and operators all have something a team needs by Saturday afternoon.",
    cta: "Apply to mentor",
    tag: "Both days",
  },
  {
    name: "Volunteer",
    copy: "Run check-in, shoot photos and video, or keep the pitch schedule on time. You get a front-row seat to every pitch.",
    cta: "Apply to volunteer",
    tag: "Both days",
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
    name: FW.venue,
    address: { "@type": "PostalAddress", streetAddress: FW.street, addressLocality: "Phoenix", addressRegion: "AZ", postalCode: "85016", addressCountry: "US" },
  },
  organizer: [
    { "@type": "Organization", name: "Ship AI", url: "https://www.shipai.club" },
    { "@type": "Organization", name: FW.partner.name, url: FW.partner.url },
  ],
  performer: FW_HOSTS.filter((host) => host.role !== "Mentor").map((host) => ({ "@type": "Person", name: host.name })),
  url: FW.url,
  image: ["https://www.shipai.club/og-community.png"],
  isAccessibleForFree: true,
  offers: {
    "@type": "Offer",
    price: "0",
    priceCurrency: "USD",
    availability: "https://schema.org/InStock",
    url: FW.rsvpUrl || `https://www.shipai.club${REGISTER}`,
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

function CoHosts() {
  return (
    <div className="fw-cohosts">
      <span className="k">Presented by</span>
      <div className="fw-cohosts-row">
        <span className="fw-cohost">
          <Seal size={34} />
          <span className="fw-cohost-wm">Ship AI</span>
        </span>
        <span className="fw-cohost-x" aria-hidden="true">×</span>
        <a className="fw-cohost fw-cohost-partner" href={FW.partner.url} target="_blank" rel="noopener noreferrer">
          <span className="fw-workuity-logo" role="img" aria-label="Workuity" />
          <span className="fw-cohost-rule" aria-hidden="true" />
          <span className="fw-cohost-sub">AI Exchange</span>
        </a>
      </div>
    </div>
  );
}

const two = (n) => String(n).padStart(2, "0");

export default async function Page() {
  const [stats, teams] = await Promise.all([founderWeekendStats(), founderWeekendTeams()]);
  const tally = stats.teams > 0 ? null : [
    { label: "When", value: "Feb 6–7" },
    { label: "Where", value: "Phoenix" },
    { label: "Entry", value: FW.cost },
  ];
  const counts = [
    { label: "Teams registered", value: stats.teams },
    { label: "Participants", value: stats.participants },
    { label: "Projects submitted", value: stats.projects },
  ];

  return (
    <>
      <JsonLd data={EVENT_SCHEMA} />
      <JsonLd data={faqSchema(FW_FAQS)} />
      <SiteHeader
        links={NAV}
        cta={<a className="btn btn-solid btn-sm nav-cta" {...RSVP_LINK}>{FW.rsvpUrl ? "RSVP" : "Register"}</a>}
        extraLinks={[...NAV, { href: REGISTER, label: "Register your team" }, ...(FW.rsvpUrl ? [{ href: RSVP, label: "RSVP" }] : [])]}
      />

      <main id="top" className="fw">
        <section className="hero fw-hero" aria-labelledby="fw-title">
          <p className="fw-hero-meta">
            <span className="tag tag-go">{FW.rsvpUrl ? "RSVPs open" : "Registration open"}</span>
            <span>{FW.name}{" ·"} Arizona AI hackathon</span>
          </p>
          <h1 className="hero-h1" id="fw-title">
            <span className="sr-only">{FW.name}: </span>
            Build an AI company. <span className="key">Ship it by Sunday.</span>
          </h1>
          <p className="hero-lede">
            One weekend in Phoenix to build an AI company, then pitch it to judges, employers and investors. Free for teams of 1–4.
          </p>
          <div className="cta-row">
            <a className="btn btn-solid" {...RSVP_LINK}>{RSVP_LABEL}</a>
            {FW.rsvpUrl && <a className="btn btn-ghost" href={REGISTER}>Register your team</a>}
          </div>
          <CoHosts />

          <div className="stage fw-stage">
            <Scene scene="launch" alt="Dithered night scene: a finished boat sliding down the ways into the water. You leave with something shipped." />
            <aside className="window fw-hero-window" aria-label="Registration">
              <div className="window-bar"><b>{FW.name} · Registration</b><span>{FW.datesShort}</span></div>
              <dl className="fw-tally">
                {(tally || counts).map((item) => (
                  <div key={item.label}>
                    <dt>{item.label}</dt>
                    <dd>{item.value.toLocaleString("en-US")}</dd>
                  </div>
                ))}
              </dl>
              <div className="fw-hero-window-foot">
                <span className="meta">{FW.venue}{" ·"} Free</span>
                <a className="btn btn-solid btn-sm" {...RSVP_LINK}>{FW.rsvpUrl ? "RSVP" : "Register"}</a>
              </div>
            </aside>
            <p className="fw-toast" aria-hidden="true">
              <span className="fw-toast-dot" />
              Submissions close Sunday, 12:00 PM
            </p>
          </div>
        </section>

        <section className="fw-facts-wrap hero-after-stage" aria-label="Event details">
          <dl className="facts fw-facts">
            {FACTS.map((fact) => (
              <div key={fact.label}>
                <dt>{fact.label}</dt>
                <dd>{fact.value}</dd>
              </div>
            ))}
          </dl>
        </section>

        <section className="section fw-split" id="why" aria-labelledby="fw-why-title">
          <div className="fw-split-copy">
            <p className="k">01{" ·"} Why a weekend</p>
            <h2 id="fw-why-title">You&apos;ve had the idea <span className="key">for months.</span></h2>
            <p className="section-lede">
              AI made building it cheap. What&apos;s missing is a deadline, a team and a room that expects you to ship. Founder Weekend gives you all three, and puts the people who hire and invest in the front row.
            </p>
          </div>
          {FW.whyVideo ? (
            <figure className="window fw-video-window">
              <div className="window-bar"><b>Why we built {FW.name}</b><span>Video</span></div>
              <video className="fw-video" src={FW.whyVideo} poster={FW.whyPoster || undefined} controls playsInline preload="metadata" />
            </figure>
          ) : (
            <div className="fw-panel">
              <Scene scene="workbench" alt="" />
              <div className="window fw-panel-window">
                <div className="window-bar"><b>What&apos;s missing</b><span>3 of 3 included</span></div>
                <ul className="fw-missing">
                  {MISSING.map((item) => (
                    <li key={item.k}>
                      <span className="fw-check" aria-hidden="true" />
                      <b>{item.k}</b>
                      <span>{item.v}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          )}
        </section>

        <section className="section" id="benefits" aria-labelledby="fw-benefits-title">
          <div className="section-head">
            <p className="k">02{" ·"} What you leave with</p>
            <h2 id="fw-benefits-title">More than a demo. <span className="key">A company.</span></h2>
            <p className="section-lede">Every team that submits leaves with a certificate, a recorded pitch and a room full of people who saw it.</p>
          </div>
          <ul className="fw-benefits">
            {FW_BENEFITS.map((benefit, index) => {
              const Icon = BENEFIT_ICONS[benefit.name] || Award;
              return (
                <li className="card fw-benefit" key={benefit.name}>
                  <div className="card-body">
                    <p className="fw-benefit-top">
                      <Icon size={20} strokeWidth={1.5} aria-hidden="true" />
                      <span className="k">{two(index + 1)}</span>
                    </p>
                    <h3>{benefit.name}</h3>
                    <p>{benefit.copy}</p>
                  </div>
                </li>
              );
            })}
          </ul>
        </section>

        <section className="section fw-split fw-split-flip" id="judging" aria-labelledby="fw-judging-title">
          <div className="fw-split-copy">
            <p className="k">03{" ·"} Judging</p>
            <h2 id="fw-judging-title">Six criteria. <span className="key">Scored 1 to 10.</span></h2>
            <p className="section-lede">
              Judges score what your company is by Sunday, not what it could be. Pitches run five minutes, and going over costs points.
            </p>
          </div>
          <div className="fw-panel">
            <Scene scene="swell" alt="" />
            <div className="window" role="group" aria-label="Judge scorecard">
              <div className="window-bar"><b>Judge scorecard</b><span>6 criteria · 1–10 each</span></div>
              <ol className="fw-scorecard">
              {FW_CRITERIA.map((criterion, index) => (
                <li className="fw-score-row" key={criterion.name}>
                  <span className="k">{two(index + 1)}</span>
                  <div>
                    <h3>{criterion.name}</h3>
                    <p>{criterion.parts.join(" · ")}</p>
                  </div>
                  <span className="fw-score">
                    <span className="fw-ticks" aria-hidden="true">
                      {Array.from({ length: 10 }, (_, i) => <i key={i} />)}
                    </span>
                    <span className="k">/10</span>
                  </span>
                </li>
              ))}
            </ol>
            </div>
          </div>
        </section>

        <section className="section" id="weekend" aria-labelledby="fw-weekend-title">
          <div className="section-head">
            <p className="k">04{" ·"} The weekend</p>
            <h2 id="fw-weekend-title">Two days. <span className="key">One company.</span></h2>
            <p className="section-lede">Arizona time. Submissions close at {FW.deadline}.</p>
          </div>
          <div className="fw-days">
            {FW_WEEKEND.map((day, index) => (
              <article className="card fw-day" key={day.day}>
                <div className="fw-day-head">
                  <span className="k">Day {index + 1}</span>
                  <h3>{day.day}</h3>
                  <span className="tag">{day.hours}</span>
                </div>
                <ol className="fw-beats">
                  {day.beats.map((beat) => (
                    <li key={beat.what}>
                      <span className="k">{beat.time}</span>
                      <span>{beat.what}</span>
                    </li>
                  ))}
                </ol>
              </article>
            ))}
          </div>
        </section>

        <section className="band fw-band" id="teams" aria-labelledby="fw-teams-title">
          <Scene scene="stars" mode="ascii" band className="band-bg" />
          <div className="section">
            <div className="section-head">
              <p className="k">05{" ·"} Who&apos;s building</p>
              <h2 id="fw-teams-title">The roster <span className="key">so far.</span></h2>
            </div>
            <dl className="fw-counts">
              {counts.map((count) => (
                <div key={count.label}>
                  <dt>{count.label}</dt>
                  <dd>{count.value.toLocaleString("en-US")}</dd>
                </div>
              ))}
            </dl>
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
              <p className="fw-empty">Register now and your team is the first name on this board.</p>
            )}
            <div className="cta-row fw-center">
              <a className="btn btn-solid" href={REGISTER}>Register your team</a>
            </div>
          </div>
        </section>

        <section className="section" id="hosts" aria-labelledby="fw-hosts-title">
          <div className="section-head">
            <p className="k">06{" ·"} People</p>
            <h2 id="fw-hosts-title">Hosted by builders. <span className="key">Judged by them too.</span></h2>
            <p className="section-lede">
              Founder Weekend is presented by Ship AI and {FW.partner.name}, and held at {FW.venue}.
            </p>
          </div>
          <ul className="fw-hosts">
            {FW_HOSTS.map((host) => (
              <li className="fw-host" key={host.name}>
                {host.photo ? (
                  <img src={host.photo} alt="" width="96" height="96" loading="lazy" />
                ) : (
                  <span className="fw-host-initials" aria-hidden="true">{host.name.split(" ").map((w) => w[0]).join("")}</span>
                )}
                <div>
                  <h3>{host.name}</h3>
                  <p className="k">{host.role}</p>
                </div>
              </li>
            ))}
          </ul>
          <div className="fw-roles" id="help">
            {ROLES.map((role) => (
              <div className="card fw-role" key={role.name}>
                <div className="card-body">
                  <p className="fw-benefit-top">
                    <span className="k">{role.name}</span>
                    <span className="tag">{role.tag}</span>
                  </p>
                  <h3>{role.name === "Mentor" ? "Mentor a team" : "Help run the weekend"}</h3>
                  <p>{role.copy}</p>
                  <a className="btn btn-ghost btn-sm" href={ROLE_REQUEST}>{role.cta}</a>
                </div>
              </div>
            ))}
          </div>
        </section>

        <section className="band fw-band" id="faq" aria-labelledby="fw-faq-title">
          <Scene scene="stars" mode="ascii" band className="band-bg" />
          <div className="section">
            <div className="section-head">
              <h2 id="fw-faq-title">Questions, <span className="key">answered.</span></h2>
            </div>
            <div className="faq">
              {FW_FAQS.map((faq, index) => (
                <details key={faq.q}>
                  <summary>
                    <span className="k">{two(index + 1)}</span>
                    <span>{faq.q}</span>
                  </summary>
                  <p className="faq-a">{faq.a}</p>
                </details>
              ))}
            </div>
          </div>
        </section>

        <section className="band" aria-labelledby="fw-final-title">
          <div className="final">
            <h2 id="fw-final-title">Feel the fear. <span className="key">Ship it anyway.</span></h2>
            <p className="lede">{FW.rsvpUrl ? "RSVP, then register a team" : "Register a team now"}, or come solo and find one at Saturday&apos;s kickoff.</p>
            <div className="cta-row">
              <a className="btn btn-solid" {...RSVP_LINK}>{RSVP_LABEL}</a>
              {FW.rsvpUrl && <a className="btn btn-ghost" href={REGISTER}>Register your team</a>}
            </div>
            <ul className="final-checks">
              <li>Free to enter</li>
              <li>{FW.teams}</li>
              <li>Phoenix, {FW.datesShort.replace(/ /g, " ")}</li>
            </ul>
          </div>
          <div className="final-stage">
            <Scene scene="harbor" band alt="Dithered harbor at dusk: many small boats at their moorings with their lights on. The community." />
            <p>Harbor at dusk · Phoenix, Arizona</p>
          </div>
        </section>
      </main>

      <SiteFooter />
    </>
  );
}
