import { notFound } from "next/navigation";
import {
  ArrowRight,
  Award,
  BadgeCheck,
  Briefcase,
  CalendarDays,
  Coins,
  Camera,
  Gauge,
  Globe2,
  GraduationCap,
  Handshake,
  MapPin,
  Megaphone,
  Mic,
  Rocket,
  Scale,
  Ticket,
  Trophy,
  Users,
} from "lucide-react";
import { siDiscord, siGithub, siMeetup, siX } from "simple-icons";
import { JsonLd } from "../../../../components/article";
import HackathonCountdown from "../../../../components/hackathon-countdown";
import HackathonRoster from "../../../../components/hackathon-roster";
import HackathonSponsors from "../../../../components/hackathon-sponsors";
import { PROGRAMS, programBySlug } from "../../../../lib/programs";
import { TIERS } from "../../../../lib/sponsors";

import {
  EVENT,
  DISCORD,
  MEETUP,
  GITHUB,
  X_URL,
  GTM_DECK,
  WORKSHOPS,
  ACTS,
} from "../../../../lib/hackathon";
import { CATEGORIES } from "../../../../lib/results";
import { VOLUNTEER_JOBS } from "../../../../lib/accounts";

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

const FACTS = [
  { icon: Coins, label: "Prize pool", value: "$1,000" },
  { icon: CalendarDays, label: "Hackathon", value: EVENT.dates },
  { icon: MapPin, label: "Where", value: `${EVENT.venue} — ${EVENT.city}` },
  { icon: Ticket, label: "Cost", value: "Free · teams of 1–4" },
];

const DELIVERABLES = [
  {
    icon: Globe2,
    title: "A live marketing site",
    copy: "Build a site that makes your product clear: who it helps, why it matters, and what to do next. Publish it at a URL you can share.",
  },
  {
    icon: Rocket,
    title: "Your site and product, launched",
    copy: "Put your work in front of people. Bring an existing project or start fresh, then take it public during the weekend.",
  },
  {
    icon: Mic,
    title: "A recorded pitch to share",
    copy: "Show what you shipped and leave with a recorded pitch and content for your project, ready to share after the event.",
  },
];

const SCHEDULE = [
  {
    day: "Saturday",
    date: "Oct 17",
    title: "Kickoff & launch day",
    slots: [
      { time: "9:00 AM", name: "Doors, coffee, check-in" },
      {
        time: "9:30 AM",
        name: "Kickoff — rules, categories, deadline",
        copy: "The framework condensed for anyone joining fresh, plus the rules, the categories and the noon-Sunday deadline.",
        deck: true,
      },
      {
        time: "10:00 AM",
        name: "60-second pitches & team formation",
        copy: "Everyone delivers the pitch they wrote in September. Newcomers get the crash version and pitch anyway. Solo is fine. Teams up to four. Dry run for Sunday.",
      },
      {
        time: "10:30 AM",
        name: "Launch plans locked",
        copy: "Every team writes it down: what goes live, on what channel, to which audience, at what hour. Posted in Discord so the room can hold you to it.",
        hard: true,
      },
      {
        time: "11:00 AM",
        name: "On-site sessions & mentor hours",
        copy: "Build and improve your marketing site with sessions on positioning, copy, design, and launch preparation. Get help from mentors as you put it into practice.",
      },
      { time: "12:00 PM", name: "Lunch" },
      {
        time: "1:00 PM",
        name: "Launches go live",
        copy: "Teams push publicly, with the room as a war room. Copy review, channel help, and the first numbers while there's still time to react.",
        hard: true,
      },
      {
        time: "3:00 PM",
        name: "Iterate on what the channel tells you",
        copy: "The launch is data. The rest of the afternoon is for acting on it.",
      },
      { time: "5:00 PM", name: "Doors close" },
    ],
  },
  {
    day: "Sunday",
    date: "Oct 18",
    title: "Ship & pitch",
    slots: [
      { time: "9:00 AM", name: "Doors, final build block" },
      {
        time: "12:00 PM",
        name: "Submissions close",
        copy: "Hard deadline. Pitches start as soon as the form closes.",
        hard: true,
      },
      {
        time: "12:15 PM",
        name: "Recorded pitches",
        copy: "Five minutes, live site and product on screen. Your pitch is recorded, and the room votes Crowd Favorite.",
      },
      { time: "1:30 PM", name: "Awards & closing" },
      { time: "2:00 PM", name: "Doors close" },
    ],
  },
];

const TRACKS = [
  {
    tag: "B2C",
    title: "The ggbucks case study",
    copy: "Santos walks his own launch as a live demo, with the real numbers on screen.",
    points: [
      "$0 → $3,000 in the first 30 days, zero paid ad spend — and what the channels were.",
      "Scaling into paid: $100–200/day, profitable and still growing. Creative, targeting, and the unit economics you need before you spend a dollar.",
      "The community around the product, and how it feeds the funnel: superfans → ambassadors → organic growth.",
      "The parts that didn't work, in the same detail as the parts that did.",
    ],
  },
  {
    tag: "B2B",
    title: "Pipeline and sales cycles",
    copy: "Straight off the deck, for anyone selling to companies rather than people.",
    points: [
      "An ICP defined tightly enough that you can write the email.",
      "Awareness → Interest → Evaluation → Decision → Onboarding → Expansion, and what actually moves a deal between stages.",
      "Outbound that gets replies, and how you get to the first ten customers.",
      "Design partners, pilots, pricing, and champions → advisors → references → pipeline.",
    ],
  },
];

const BENEFITS = [
  {
    icon: Coins,
    title: "$1,000 prize pool",
    copy: "Compete for the prize pool while building and shipping the best marketing site. Entry is free.",
  },
  {
    icon: Briefcase,
    title: "Employers and business professionals",
    copy: "Meet employers and business professionals attending the hackathon. Show them a live project and the work behind it.",
  },
  {
    icon: Award,
    title: "Certifications issued",
    copy: "Everyone who submits a project receives a certification with a public URL to share on LinkedIn or with a hiring manager.",
  },
  {
    icon: Rocket,
    title: "Launch your site & product",
    copy: "Turn your idea or existing product into a public launch. The goal is a live marketing site you can show.",
  },
  {
    icon: Handshake,
    title: "Networking & team building",
    copy: "Bring a teammate or come solo and find one. Meet builders, designers, marketers, and founders while you work together.",
  },
  {
    icon: GraduationCap,
    title: "On-site sessions on Saturday",
    copy: "Work through your marketing site and launch with in-person sessions and mentor support at Workuity Biltmore.",
  },
  {
    icon: Camera,
    title: "Recorded pitch & project content",
    copy: "Leave with a recording of your pitch and content for your project, so the work keeps reaching people after the weekend.",
  },
];

const CRITERIA = [
  { pct: 40, name: "Did you ship it?", copy: "Publicly launched during the weekend, live URL. This gates everything — an unlaunched product cannot place." },
  { pct: 30, name: "Receipts", copy: "Evidence over narrative. Small and true beats big and vague." },
  { pct: 20, name: "Growth engine", copy: "Does the channel run again next month without a hero effort?" },
  { pct: 10, name: "Craft", copy: "The site, the product, the taste." },
];

const RULES = [
  "Teams of 1–4. One team per person. Solo entries are fine.",
  `Bring a product you've already built, or start when the build window opens ${EVENT.buildOpens}. Both are eligible. Build and ship a live marketing site for your project.`,
  "Anyone can compete. No workshop attendance required — turn up on Saturday with something to launch and you're in. The sessions make you better at it; they were never a gate.",
  `Your launch has to go public during the hackathon weekend, ${EVENT.datesShort}. A live, publicly reachable URL is required.`,
  `Submit your project by ${EVENT.deadline}. No late submissions.`,
  "You keep 100% of your IP. Ship AI claims nothing. Open source is welcome, not required.",
  "Any stack, any tools, any language. AI-assisted everything is fine and expected.",
  "Receipts required. Numbers in your pitch need evidence you can put on screen.",
  "One judged category per team. Win one and you're out of the running for the others — Crowd Favorite is the exception, since the room votes it.",
  "Demos over memos. Five minutes, live product. Slides are supporting material, not the pitch.",
  "In person. No remote track this round.",
];

const FAQS = [
  {
    q: "Do I need to already have a product to enter?",
    a: "No. Bring an existing product or start fresh. The focus is building and shipping the best marketing site, with a live URL you can show by Sunday. You can begin before the weekend; the build window opened August 3.",
  },
  {
    q: "What's the difference between the workshops and the hackathon?",
    a: "The workshops are six free sessions on alternating Wednesdays from August 5 to October 14 — the whole go-to-market curriculum, in order, with the work done live on screen. Watch, or follow along on your laptop. The Ship AI AZ GTM Hackathon, October 17–18, is the Zero to Launch finale: build and ship your marketing site, join on-site sessions on Saturday, then pitch what you launched on Sunday.",
  },
  {
    q: "Do I have to attend the workshops to compete?",
    a: "No. Come to all six, one, or none. Turn up on Saturday with something to launch and you're in. The sessions are free and make the launch go better, but they were never a gate.",
  },
  {
    q: "What's the GitHub repo for?",
    a: "Optional, and genuinely useful. It's all open source: a folder per session and 31 skill files that do the mechanical half of the go-to-market work — positioning brief, pricing model, content map, launch checklist. Run the process yourself whenever you like. Nobody is disqualified for not having one.",
  },
  {
    q: "What if I'm not clear on my value prop yet?",
    a: "That's expected, and September 16 is the session for it. Positioning and the elevator pitch: who it's for, what they use today instead, your sharp edge, the outcome in their language, then a sixty-second pitch that ends in a real ask. Written live on screen for a real product, cuts included. It sits before the site session on purpose — a site built on fuzzy positioning is a nicely built page that says nothing.",
  },
  {
    q: "How much does it cost?",
    a: "Nothing. Every Ship AI event is free and public. Sponsors cover the prize pool and the food.",
  },
  {
    q: "What do I get if I don't win?",
    a: "A certification and a permanent listing on this site, same as everyone else who submits. The certification names your project and your placement at a public URL you can link from LinkedIn or a job application; the listing keeps your live URL up after the weekend. You also leave with a live marketing site, a recorded pitch, and content for your project, with opportunities to meet employers and business professionals.",
  },
  {
    q: "Who will I meet?",
    a: "Employers and business professionals are attending alongside builders, designers, marketers, and founders. Bring a teammate or come solo and find one during Saturday's team formation block.",
  },
  {
    q: "Do I need a team?",
    a: "No. Solo entries compete on the same footing. Saturday morning has a 60-second pitch round and a team formation block, so come alone and leave with a team if you want one.",
  },
  {
    q: "Do I need to be a developer?",
    a: "No. Half the weekend is positioning, copy, content, channels and sales — the parts engineering-heavy teams are worst at. Designers, marketers and non-technical founders are genuinely useful here.",
  },
  {
    q: "What counts as launching?",
    a: "A publicly reachable URL a stranger can use, plus an actual launch action — a post, a listing, an email, a thread, a call. Not a private beta, not a waitlist page you never told anyone about.",
  },
  {
    q: "Who owns what I build?",
    a: "You do, entirely. Ship AI takes no equity, no license and no IP. Open sourcing your work is welcome but not required.",
  },
  {
    q: "Can I participate remotely?",
    a: "Not this round. The mentor rotations and the pitch session only work in a room. The Discord stays open all weekend, but entries have to be in person.",
  },
  {
    q: "What if I can't be there both days?",
    a: "Come for what you can. Saturday's kickoff and Sunday's pitches are the two that matter most — the deadline applies to everyone either way.",
  },
  {
    q: "What should I bring?",
    a: "Laptop, charger, whatever you've already built, and a domain you're willing to point at it. Everything else we'll have.",
  },
  {
    q: "How do I sponsor, judge, mentor or volunteer?",
    a: `Make an account and send the request from your dashboard — one short form each, straight to Santos rather than a Discord thread he might miss. Mentoring is Saturday's 1:1 rotations. Volunteering is photography or the check-in booth, a few hours. Judging is an application rather than a sign-up: the panel is small and picked by hand, and a seat also comes with Gold and Platinum sponsorship. Sponsorship closes ${EVENT.sponsorDeadline} to support the prize pool and event.`,
  },
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

const FAQ_SCHEMA = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  mainEntity: FAQS.map((f) => ({
    "@type": "Question",
    name: f.q,
    acceptedAnswer: { "@type": "Answer", text: f.a },
  })),
};

const TITLE = EVENT.name;
const DESCRIPTION = EVENT.description;

export const metadata = {
  title: TITLE,
  description: DESCRIPTION,
  alternates: { canonical: "https://www.shipai.club/programs/zero-to-launch/hackathon" },
  openGraph: {
    title: TITLE,
    description: DESCRIPTION,
    url: "https://www.shipai.club/programs/zero-to-launch/hackathon",
    siteName: "Ship AI",
    images: [{ url: "/og-image.jpg", width: 1200, height: 630 }],
  },
};

/* The roster reads the database, so the page can't be frozen at build
   time any more — but it's still the busiest marketing page on the
   site and shouldn't become a query per visitor. Five minutes is well
   inside how fast a signup list needs to feel live. */
export const revalidate = 300;

export function generateStaticParams() {
  return PROGRAMS.filter((program) => program.hasHackathon).map((program) => ({
    program: program.slug,
  }));
}

export default async function Page({ params }) {
  const { program: programSlug } = await params;
  const program = programBySlug(programSlug);
  if (!program?.hasHackathon) notFound();

  return (
    <>
      <JsonLd data={EVENT_SCHEMA} />
      <JsonLd data={FAQ_SCHEMA} />

      <header className="nav">
        <a href="/" className="brand">
          <img src="/logo-mark.png" alt="" width={26} height={26} />
          <span>Ship AI</span>
        </a>
        {/* Five anchors, not seven. This nav had become a table of
            contents for a very long page, which pushed the brand onto
            two lines and left the actual CTA competing with six
            section links. Benefits and Rules are a scroll away and
            linked from the copy that matters. Programs earns its slot:
            the hackathon is one program's ending, not the whole club. */}
        <nav>
          <a href="/programs">Programs</a>
          <a href="/programs/zero-to-launch">Sessions</a>
          <a href="#schedule">Weekend</a>
          <a href="#prizes">Prizes</a>
          <a href="#sponsor">Sponsor</a>
        </nav>
        {/* A pair, so the hierarchy is legible: registering is what
            this page is for, and the Discord is the thing you do
            instead if you're not ready to. As a nav link among the
            anchors it read as another section. */}
        <div className="nav-ctas">
          <a className="btn btn-ghost" href={DISCORD} target="_blank" rel="noreferrer">
            Discord
          </a>
          <a className="btn btn-solid" href="/dashboard">
            Register
          </a>
        </div>
      </header>

      <main id="top">
        <section className="hero hk-hero">
          <p className="eyebrow reveal" style={{ "--d": "0ms" }}>
            Zero to Launch · {EVENT.datesShort} · Workuity Biltmore, Phoenix
          </p>
          <h1 className="hero-h1 reveal" style={{ "--d": "80ms" }}>
            Ship AI AZ{" "}<br />
            <span className="hero-accent">GTM Hackathon</span>
          </h1>
          <p className="lede reveal" style={{ "--d": "280ms" }}>
            Build and ship the best marketing site. Join Ship AI Club for a free weekend
            with a $1,000 prize pool, employers and business professionals, and a live site
            you can show. Bring a teammate or come solo and find one.
          </p>
          <div className="cta-row reveal" style={{ "--d": "380ms" }}>
            <a className="btn btn-solid" href="/dashboard">
              Register your team
            </a>
            <a className="btn btn-ghost" href={DISCORD} target="_blank" rel="noreferrer">
              Join the Discord
            </a>
            <a className="btn btn-ghost" href={EVENT.meetup} target="_blank" rel="noreferrer">
              RSVP on Meetup
            </a>
          </div>
        </section>

        <HackathonCountdown delay="440ms" />

        <section className="hk-facts reveal" style={{ "--d": "480ms" }} aria-label="Event details">
          {FACTS.map((f) => (
            <div key={f.label} className="hk-fact">
              <p className="hk-fact-label">
                <f.icon size={14} strokeWidth={1.75} aria-hidden="true" />
                {f.label}
              </p>
              <p className="hk-fact-value">{f.value}</p>
            </div>
          ))}
        </section>

        <section className="section" id="benefits">
          <p className="kicker">What’s in it for you</p>
          <h2>Build something worth showing.</h2>
          <p className="section-lede">
            A weekend to launch your work, meet people, and leave with more than a project.
            Here’s what you can take away from the Ship AI AZ GTM Hackathon.
          </p>
          <div className="hk-cats">
            {BENEFITS.map((b) => (
              <div key={b.title} className="hk-cat">
                <b.icon className="icon" size={18} strokeWidth={1.75} aria-hidden="true" />
                <h3>{b.title}</h3>
                <p>{b.copy}</p>
              </div>
            ))}
          </div>
          <p className="hk-note">
            The listing and the certifications live on{" "}
            <a href="/programs/zero-to-launch/hackathon/results">the results page</a>,
            published Sunday, straight after the awards.
          </p>
        </section>

        <section className="section" id="outcomes">
          <p className="kicker">What you leave with</p>
          <h2>A live site you can show.</h2>
          <p className="section-lede">
            By Sunday afternoon, your marketing site is live, your product is in front of
            people, and you have a pitch and content to keep sharing.
          </p>
          <div className="values">
            {DELIVERABLES.map((d) => (
              <div key={d.title} className="value">
                <h3>
                  <d.icon className="icon" size={18} strokeWidth={1.75} aria-hidden="true" />
                  {d.title}
                </h3>
                <p>{d.copy}</p>
              </div>
            ))}
          </div>
        </section>

        {/* Who has actually signed up. Renders nothing until the first
            person registers, so the page reads the same as it always
            has until there's something real to show — an empty roster
            is worse than no roster. */}
        <HackathonRoster />

        <section className="section" id="program">
          <p className="kicker">The program</p>
          <h2>Six Wednesdays, then the weekend.</h2>
          <p className="section-lede">
            A full GTM engineering framework —{" "}
            <a href={GTM_DECK} target="_blank" rel="noreferrer">the deck</a> is session one,
            and each session builds on the last: positioning before the site, the site before
            the channel, the channel before the launch. Every night is a presentation with a
            live build — watch, or follow along on your own laptop. Free, public, open to
            anyone.
          </p>
          <div className="hk-acts">
            {ACTS.map((a) => (
              <div key={a.name} className="hk-act">
                <span className="hk-act-name">{a.name}</span>
                <span className="hk-act-range">{a.range}</span>
                <p>{a.copy}</p>
              </div>
            ))}
          </div>
          <ol className="hk-series">
            {WORKSHOPS.map((w) => (
              <li key={w.n}>
                <a href={`/programs/zero-to-launch/${w.slug}`}>
                  <span className="hk-series-n">{w.n}</span>
                  <span className="hk-series-date">{w.date}</span>
                  <span className="hk-series-title">{w.eventTitle}</span>
                  <ArrowRight size={15} strokeWidth={1.75} aria-hidden="true" />
                </a>
              </li>
            ))}
          </ol>
          <p className="hk-note">
            Each session has its own page: the agenda, what to bring, what to go do
            afterward.{" "}
            <a href="/programs/zero-to-launch">See the whole curriculum</a>.
          </p>
        </section>

        <section className="section" id="schedule">
          <p className="kicker">The weekend</p>
          <h2>Saturday morning to Sunday afternoon.</h2>
          <p className="section-lede">
            Saturday brings team formation, on-site sessions, and time to build and launch
            your marketing site with mentor support. Sunday is for finishing your site,
            recording your pitch, and showing what you shipped. Doors are 9 AM–5 PM Saturday
            and 9 AM–2 PM Sunday. Please park in the surface lot. Sponsored by Workuity.
          </p>
          <div className="hk-days">
            {SCHEDULE.map((d) => (
              <div key={d.day} className="hk-day">
                <div className="hk-day-head">
                  <span className="hk-day-name">{d.day}</span>
                  <span className="hk-day-date">{d.date}</span>
                  <h3>{d.title}</h3>
                </div>
                <ol className="hk-agenda">
                  {d.slots.map((s) => (
                    <li key={s.time + s.name} className={s.hard ? "hk-slot hk-slot-hard" : "hk-slot"}>
                      <span className="hk-slot-time">{s.time}</span>
                      <div className="hk-slot-body">
                        <p className="hk-slot-name">{s.name}</p>
                        {s.copy && <p className="hk-slot-copy">{s.copy}</p>}
                        {s.deck && (
                          <p className="hk-slot-link">
                            <a href={GTM_DECK} target="_blank" rel="noreferrer">
                              gtm.desic.xyz
                              <ArrowRight size={13} strokeWidth={1.75} aria-hidden="true" />
                            </a>
                          </p>
                        )}
                      </div>
                    </li>
                  ))}
                </ol>
              </div>
            ))}
          </div>
        </section>

        <section className="section" id="prizes">
          <p className="kicker">Prizes &amp; judging</p>
          <h2>Five categories. One judged award per team.</h2>
          <p className="section-lede">
            Compete for a $1,000 prize pool. The focus is building and shipping the best
            marketing site, with awards across five categories. Entry is free.
          </p>
          <div className="hk-cats">
            {CATEGORIES.map((c) => (
              <div key={c.name} className={c.wide ? "hk-cat hk-cat-wide" : "hk-cat"}>
                {c.voted ? (
                  <Users className="icon" size={18} strokeWidth={1.75} aria-hidden="true" />
                ) : (
                  <Trophy className="icon" size={18} strokeWidth={1.75} aria-hidden="true" />
                )}
                <h3>
                  {c.name}
                  {c.voted && <span className="hk-cat-tag">Room-voted</span>}
                </h3>
                <p>{c.copy}</p>
              </div>
            ))}
          </div>

          <h3 className="hk-subhead">
            <Scale size={18} strokeWidth={1.75} aria-hidden="true" />
            How it&apos;s scored
          </h3>
          <ul className="hk-criteria">
            {CRITERIA.map((c) => (
              <li key={c.name}>
                <div className="hk-crit-head">
                  <span className="hk-crit-pct">{c.pct}%</span>
                  <span className="hk-crit-name">{c.name}</span>
                </div>
                <span className="hk-crit-bar" style={{ "--pct": `${c.pct}%` }} aria-hidden="true" />
                <p>{c.copy}</p>
              </li>
            ))}
          </ul>
        </section>

        <section className="section" id="rules">
          <p className="kicker">The rules</p>
          <h2>Eleven of them. All of them short.</h2>
          <ol className="hk-rules">
            {RULES.map((r, i) => (
              <li key={r}>
                <span className="hk-rule-n">{String(i + 1).padStart(2, "0")}</span>
                <span>{r}</span>
              </li>
            ))}
          </ol>
        </section>

        <section className="section hk-submit-band" id="submit">
          <Megaphone size={22} strokeWidth={1.75} aria-hidden="true" />
          <h2>Submissions close {EVENT.deadline}.</h2>
          <p>
            One submission per team, filed from your Ship AI account: project, live URL, what
            you launched, the numbers. Draft it whenever, edit until the deadline. The full
            requirements are on the submission page — read them before Saturday, not Sunday morning.
          </p>
          <div className="cta-row">
            <a className="btn btn-solid" href="/dashboard">
              Register your team
            </a>
            <a className="btn btn-ghost" href="/programs/zero-to-launch/hackathon/submit">
              What the form asks for
            </a>
          </div>
        </section>

        {/* Above the pitch to become one: who already did is the most
            persuasive thing on the page, and it renders as nothing
            until somebody has. */}
        <HackathonSponsors />

        <section className="section" id="sponsor">
          <p className="kicker">Sponsorship</p>
          <h2>Help us keep it free and stack the pool.</h2>
          <p className="section-lede">
            Ship AI is free and stays free. Sponsorship funds two things: the prize pool and
            the marketing to fill the room. No lead lists, no attendee data, no hard-sell
            slot. If you want the room&apos;s attention, mentor a team.
          </p>
          <div className="hk-tiers">
            {TIERS.map((t) => (
              <div key={t.name} className="hk-tier">
                <div className="hk-tier-head">
                  <h3>{t.name}</h3>
                  <span className="hk-tier-price">{t.priceLabel}</span>
                </div>
                {t.slots && <p className="hk-tier-slots">{t.slots}</p>}
                <p>{t.buys}</p>
              </div>
            ))}
          </div>

          <h3 className="hk-subhead">
            <Handshake size={18} strokeWidth={1.75} aria-hidden="true" />
            Cash isn&apos;t the only way in
          </h3>
          <p className="hk-note">
            Platform credits and donated hours count toward the same ladder — the total you
            underwrite sets your tier. The menu is itemized with the prices on it: dinner,
            trophies, the X account, and the named credit each one carries.
          </p>
          <div className="cta-row">
            <a className="btn btn-solid" href="/programs/zero-to-launch/hackathon/sponsor">
              See the full sponsorship menu
            </a>
          </div>
          <p className="hk-note">
            Sponsorship closes {EVENT.sponsorDeadline}. Help support the $1,000 prize pool
            and the builders launching their projects.{" "}
            <a href="/dashboard/requests">Start a sponsorship request</a>.
          </p>
        </section>

        <section className="section" id="roles">
          <p className="kicker">We&apos;re also looking for</p>
          <h2>Judges, mentors and volunteers.</h2>
          <div className="hk-roles">
            <div className="hk-role">
              <h3>
                <Gauge className="icon" size={18} strokeWidth={1.75} aria-hidden="true" />
                Judges
              </h3>
              <p className="hk-role-when">Sunday, noon–2:00 PM · 3–5 seats</p>
              <p>
                Founders and operators who have launched something and can tell a real number
                from a vanity one. Score against published criteria, ask hard questions in the
                Q&amp;A, hand out an award.
              </p>
              <p>
                The panel is small and picked by hand, so this is an application, not a
                sign-up. A seat also comes with Gold and Platinum sponsorship — see{" "}
                <a href="/programs/zero-to-launch/hackathon/sponsor">the menu</a>.
              </p>
              <p className="hk-role-cta">
                <a href="/dashboard/requests">Apply to judge</a>
              </p>
            </div>

            <div className="hk-role">
              <h3>
                <Users className="icon" size={18} strokeWidth={1.75} aria-hidden="true" />
                Mentors
              </h3>
              <p className="hk-role-when">Saturday afternoon · 5–8 seats</p>
              <p>
                1:1 rotations with teams that need one thing unstuck: marketing sites and
                performance, paid acquisition, B2B sales, content and SEO, design. Two hours
                is enough — take the block you can make.
              </p>
              <p className="hk-role-cta">
                <a href="/dashboard/requests">Offer to mentor</a>
              </p>
            </div>

            {/* Driven by VOLUNTEER_JOBS so this card and the request
                form can't drift — adding a job next season updates
                both. */}
            <div className="hk-role">
              <h3>
                <Camera className="icon" size={18} strokeWidth={1.75} aria-hidden="true" />
                Volunteers
              </h3>
              <p className="hk-role-when">
                {VOLUNTEER_JOBS.length} jobs · A few hours each
              </p>
              <p>
                The weekend doesn&apos;t run without these. None of them need you to know
                anything about the products in the room.
              </p>
              <ul className="hk-role-jobs">
                {VOLUNTEER_JOBS.map((j) => (
                  <li key={j.id}>
                    <strong>{j.label}</strong> — {j.hours.toLowerCase()}. {j.blurb}
                  </li>
                ))}
              </ul>
              <p className="hk-role-cta">
                <a href="/dashboard/requests">Offer to volunteer</a>
              </p>
            </div>
          </div>
        </section>

        <section className="section" id="faq">
          <p className="kicker">Questions</p>
          <h2>Frequently asked.</h2>
          {/* <details> rather than a state hook: it opens with no
              JavaScript, is keyboard-operable and screen-reader
              announced for free, and survives the page being read
              before hydration. The first one is open so the pattern
              is obvious without anybody having to click to find out
              there's anything behind it.

              The answers stay in the DOM either way, so the FAQPage
              schema above and in-page search still see them. */}
          <div className="hk-faq">
            {FAQS.map((f, i) => (
              <details key={f.q} className="hk-faq-item" open={i === 0}>
                <summary>
                  <h3>{f.q}</h3>
                  <span className="hk-faq-chevron" aria-hidden="true" />
                </summary>
                <p>{f.a}</p>
              </details>
            ))}
          </div>
        </section>

        <section className="section hk-close">
          <h2>Bring a teammate. Leave with a live site.</h2>
          <div className="cta-row">
            <a className="btn btn-solid" href="/dashboard">
              Register your team
            </a>
            <a className="btn btn-ghost" href={DISCORD} target="_blank" rel="noreferrer">
              Join the Discord
            </a>
          </div>
          <p className="rule-line">Just ship it.</p>
        </section>
      </main>

      <footer className="footer">
        <div className="brand">
          <img src="/logo-mark.png" alt="" width={22} height={22} />
          <span>Ship AI</span>
        </div>
        <nav>
          <a href="/">Home</a>
          <a href="/programs/zero-to-launch/hackathon/submit">Submit</a>
          <a href="/programs/zero-to-launch/hackathon/results">Results</a>
          <a href="/programs">Programs</a>
          <a href="/programs/zero-to-launch">Sessions</a>
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
