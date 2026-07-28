import {
  ArrowRight,
  Award,
  BadgeCheck,
  Briefcase,
  CalendarDays,
  Coins,
  Eye,
  Gauge,
  Globe2,
  GraduationCap,
  Handshake,
  LineChart,
  ListOrdered,
  MapPin,
  Megaphone,
  Mic,
  Rocket,
  Scale,
  Target,
  Ticket,
  Trophy,
  Users,
} from "lucide-react";
import { siDiscord, siGithub, siMeetup, siX } from "simple-icons";
import { JsonLd } from "../../components/article";
import HackathonCountdown from "../../components/hackathon-countdown";
import HackathonRoster from "../../components/hackathon-roster";
import HackathonSponsors from "../../components/hackathon-sponsors";
import { TIERS } from "../../lib/sponsors";

import {
  EVENT,
  ASCII_ZERO,
  ASCII_TO,
  ASCII_LAUNCH,
  DISCORD,
  MEETUP,
  LUMA,
  GITHUB,
  X_URL,
  GTM_DECK,
  SPONSOR_MAIL,
  JUDGE_MAIL,
  MENTOR_MAIL,
  WORKSHOPS,
  ACTS,
} from "../../lib/hackathon";
import { CATEGORIES } from "../../lib/results";

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

const FACTS = [
  { icon: GraduationCap, label: "Workshops", value: `${EVENT.seriesCount} sessions, ${EVENT.seriesRange}` },
  { icon: CalendarDays, label: "Hackathon", value: EVENT.dates },
  { icon: MapPin, label: "Where", value: `${EVENT.venue} — ${EVENT.city}` },
  { icon: Ticket, label: "Cost", value: "Free · teams of 1–4" },
];

const DELIVERABLES = [
  {
    icon: Target,
    title: "Positioning that holds up",
    copy: "A one-page brief: who exactly it's for, what they use today instead, your sharp edge, and the outcome in their words. Put through the swap test before anything gets built on top of it.",
  },
  {
    icon: Mic,
    title: "An elevator pitch you've delivered",
    copy: "Sixty seconds, five beats, ending in a real ask — one version for customers, one for investors. Not drafted and filed — said out loud, on the clock, on demo day.",
  },
  {
    icon: Globe2,
    title: "A live marketing site",
    copy: "Real URL, real copy, content and SEO in place. Not a placeholder with a waitlist form on it.",
  },
  {
    icon: Rocket,
    title: "A public launch",
    copy: "Executed during the weekend. A date, a channel, an audience. If nobody outside the room can reach it, it didn't launch.",
  },
  {
    icon: LineChart,
    title: "A growth engine",
    copy: "One repeatable channel with numbers attached. Not a plan for one — a running one.",
  },
  {
    icon: BadgeCheck,
    title: "Receipts",
    copy: "Analytics, signups, revenue, replies. Whatever the truth is. Flat is a valid result if you can show what you learned.",
  },
];

const SCHEDULE = [
  {
    day: "Friday",
    date: "Oct 16",
    title: "Kickoff & launch plans",
    slots: [
      { time: "6:00 PM", name: "Doors, food, check-in" },
      {
        time: "6:30 PM",
        name: "Kickoff — ten weeks, two days left",
        copy: "Where the program has been and what the weekend demands. A condensed run of the framework for anyone joining fresh, plus the rules, the categories and the deadline.",
        deck: true,
      },
      {
        time: "7:00 PM",
        name: "Launch rehearsal",
        copy: "The full pre-flight, run as a room. Site live, analytics firing, tracking that survives a judge's question, assets exported, copy written. Then everyone's plan gets broken on purpose — better to hear it Friday than discover it Sunday.",
      },
      {
        time: "7:45 PM",
        name: "60-second pitches",
        copy: "Everyone delivers the elevator pitch they wrote in September. Newcomers get the crash version and pitch anyway. It's the dry run for Sunday.",
      },
      {
        time: "8:15 PM",
        name: "Team formation",
        copy: "Solo is fine. Teams up to four. If you've been building alone since August, this is where you pick up help.",
      },
      {
        time: "8:45 PM",
        name: "Launch plans locked",
        copy: "Every team writes it down: what goes live, on what channel, to which audience, at what hour. Posted in Discord so the room can hold you to it.",
        hard: true,
      },
      { time: "9:15 PM", name: "Building starts" },
    ],
  },
  {
    day: "Saturday",
    date: "Oct 17",
    title: "Launch day",
    slots: [
      { time: "9:00 AM", name: "Doors, coffee" },
      {
        time: "9:30 AM",
        name: "Launch clinic",
        copy: "The last mile, end to end: site live, analytics wired, tracking that will survive Sunday's questions, and the launch post itself. Forty-five minutes, then you go do it.",
      },
      {
        time: "10:15 AM",
        name: "Build & mentor hours",
        copy: "1:1 rotations running all day. Sites, performance, paid acquisition, B2B sales, content, design.",
      },
      { time: "12:00 PM", name: "Lunch" },
      {
        time: "1:00 PM",
        name: "Launches go live",
        copy: "Teams start pushing publicly, with the room as a war room. Copy review, channel help, and the first numbers coming in while there's still time to react to them.",
        hard: true,
      },
      {
        time: "3:00 PM →",
        name: "Iterate on what the channel tells you",
        copy: "The launch is data. Saturday evening is for acting on it rather than admiring it.",
      },
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
        copy: "Hard deadline. Lunch while the judges read.",
        hard: true,
      },
      {
        time: "1:00 PM",
        name: "Pitches",
        copy: "Five minutes plus three of questions, live product on screen.",
      },
      { time: "3:30 PM", name: "Judging" },
      { time: "4:00 PM", name: "Awards & closing" },
    ],
  },
];

const TRACKS = [
  {
    tag: "B2C",
    title: "The ggbucks case study",
    copy: "Santos walks his own launch as a live demo, with the real numbers on screen.",
    points: [
      "$0 → $3,000 in the first 30 days, zero paid ad spend — and what the channels actually were.",
      "Scaling into paid: $100–200/day, profitable and still growing. Creative, targeting, and what the unit economics have to look like before you spend a dollar.",
      "Building the community around the product, and how it feeds the funnel: superfans → ambassadors → organic growth.",
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
    icon: Award,
    title: "A certification, for everyone who enters",
    copy: "Submit a project and you get one — not just the winners. It names what you launched and where you placed, and it's issued as a public, linkable record you can put on LinkedIn or send to a hiring manager. Turning up and shipping is the bar.",
  },
  {
    icon: ListOrdered,
    title: "A permanent listing on this site",
    copy: "Every entrant gets a row: team, project, live URL, category and placement. It stays up after the weekend, so the launch keeps working for you long after the room empties.",
  },
  {
    icon: Coins,
    title: "The prize pool",
    copy: "Cash plus in-kind — API credits, hosting, tools — split across the five categories. It grows with sponsorship and the amounts land on this page as sponsors confirm. Entry stays free either way.",
  },
  {
    icon: Trophy,
    title: "A trophy, for the shelf",
    copy: "Every category winner takes home a physical award, engraved with the category and the year. Cash gets spent and credits get burned — this is the part still on your desk in five years, when somebody asks what it is.",
  },
  {
    icon: Briefcase,
    title: "An internship, as a prize",
    copy: "One of the awards is a seat rather than a payout: a paid internship with a sponsor company, for the builder who earns it. If you're early in your career, this is the fastest route from a weekend project to a job that pays you to build.",
  },
  {
    icon: Eye,
    title: "Visibility to investors",
    copy: "Sunday's pitches are open to the venture capitalists, angels and operators we bring into the room, and the judging panel is drawn from the same pool. Five minutes, live product, real numbers, in front of the people best placed to fund what happens next. No deck round — just the launch you executed.",
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
  `Bring a product you've already built, or start when the build window opens ${EVENT.buildOpens}. Both are eligible — this is a launch hackathon, not a from-scratch hackathon.`,
  "Anyone can compete. You do not have to attend a single workshop — turn up on the Friday with something to launch and you are in. The sessions exist to make you better at it, not to gate you out of it.",
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
    a: "No, but it helps a lot. Most hackathons ban pre-existing projects — this one is built around them. If you've been sitting on something you never launched, this is your run. If you're starting fresh, the build window opens Monday August 3, which gives you ten weeks before the weekend. Either way the score is weighted toward launching, not building.",
  },
  {
    q: "What's the difference between the workshops and the hackathon?",
    a: "The workshops are six free sessions on alternating Wednesdays from August 5 to October 14 — the whole go-to-market curriculum, presented in order, with the work done live on screen. Show up and watch, or follow along on your laptop. The hackathon weekend, October 16 to 18, is the finale: you launch publicly, build the growth engine, and pitch what happened. You build across the ten weeks; you ship at the weekend.",
  },
  {
    q: "Do I have to attend the workshops to compete?",
    a: "No. Anyone can compete, whether you came to all six, one, or none. Turn up on the Friday with something to launch and you are in. The sessions are free and worth attending because they make the launch go better, but they were never a gate. Plenty of people will just be building.",
  },
  {
    q: "What's the GitHub repo for?",
    a: "Optional, and genuinely useful. It's all open source: a folder per session and 25 skill files that do the mechanical half of the go-to-market work — positioning brief, pricing model, content map, launch checklist. Take it and run the process yourself whenever you like, whether or not you make it to a session. Nobody is disqualified for not having one.",
  },
  {
    q: "What if I'm not clear on my value prop yet?",
    a: "That's expected, and September 16 is the session for it. Positioning and the elevator pitch: who it's for, what they use today instead, your sharp edge, the outcome in their language, and then a sixty-second pitch built on top that ends in a real ask. It's written live on screen for a real product, cuts included, so you see what a finished one looks like. It sits deliberately before the site session, because a site built on fuzzy positioning is just a nicely built page that says nothing.",
  },
  {
    q: "How much does it cost?",
    a: "Nothing. Every Ship AI event is free and public. Sponsors cover the prize pool and the food.",
  },
  {
    q: "What do I get if I don't win?",
    a: "A certification and a permanent listing on this site, same as everyone else who submits. The certification names your project and your placement and lives at a public URL you can link from LinkedIn or a job application. The listing keeps your live URL on the site after the weekend. Beyond that: your product is launched, which is the part that was actually missing, and Sunday's pitch happens in front of the judges, investors and operators in the room whether you place or not.",
  },
  {
    q: "How does the internship prize work?",
    a: "One award is a paid internship seat with a sponsor company rather than a cash prize. It's aimed at builders early in their career — the fastest route from a weekend project to being paid to build. The sponsor makes the final call on the offer, and the details go on this page once sponsorship closes October 2.",
  },
  {
    q: "Will there be investors in the room?",
    a: "That's the plan. Sunday's pitches are open to the venture capitalists, angels and operators we bring in, and the judging panel is drawn from the same pool. It isn't a pitch competition and nobody is raising on stage — you show the launch you executed and the numbers it produced, which is a far better signal than a deck anyway.",
  },
  {
    q: "Do I need a team?",
    a: "No. Solo entries compete on the same footing. Friday night has a 60-second pitch round and a team formation block, so come alone and leave with a team if you want one.",
  },
  {
    q: "Do I need to be a developer?",
    a: "No. Half of this weekend is positioning, copy, content, channels and sales — the parts most engineering-heavy teams are worst at. Designers, marketers and non-technical founders are genuinely useful here.",
  },
  {
    q: "What counts as launching?",
    a: "A publicly reachable URL that someone outside the room can use, plus an actual launch action — a post, a listing, an email, a thread, a call. Not a private beta and not a waitlist page you never told anyone about.",
  },
  {
    q: "Who owns what I build?",
    a: "You do, entirely. Ship AI takes no equity, no license and no IP. Open sourcing your work is welcome but not required.",
  },
  {
    q: "Can I participate remotely?",
    a: "Not this round. The mentor rotations and the pitch session only work in a room. The Discord stays open all weekend for questions, but entries have to be in person.",
  },
  {
    q: "What if I can't be there all three days?",
    a: "Come for what you can. Friday's keynote and Sunday's pitches are the two that matter most — the deadline applies to everyone either way.",
  },
  {
    q: "What should I bring?",
    a: "Laptop, charger, whatever you've already built, and a domain you're willing to point at it. Everything else we'll have.",
  },
  {
    q: "How do I sponsor, judge, mentor or volunteer?",
    a: `Make an account and send the request from your dashboard — one short form each, and it lands with Santos directly rather than in a Discord thread he might miss. Mentoring is Saturday's 1:1 rotations. Volunteering is photography or the check-in booth, a few hours. Judging is an application rather than a sign-up: the panel is small and picked by hand, and a seat also comes with Gold and Platinum sponsorship. Sponsorship closes ${EVENT.sponsorDeadline} so prize amounts can go on this page before registration opens up.`,
  },
];

const EVENT_SCHEMA = {
  "@context": "https://schema.org",
  "@type": "Event",
  name: EVENT.name,
  description:
    "A 48-hour hackathon for builders who need to launch. Plan the launch, execute it, and build a growth engine — judged on what actually shipped.",
  startDate: EVENT.startISO,
  endDate: EVENT.endISO,
  eventAttendanceMode: "https://schema.org/OfflineEventAttendanceMode",
  eventStatus: "https://schema.org/EventScheduled",
  location: { "@type": "Place", name: EVENT.venue, address: EVENT.address },
  organizer: { "@type": "Organization", name: "Ship AI", url: "https://www.shipai.club" },
  url: "https://www.shipai.club/hackathon",
  isAccessibleForFree: true,
  offers: {
    "@type": "Offer",
    price: "0",
    priceCurrency: "USD",
    availability: "https://schema.org/InStock",
    url: MEETUP,
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

const TITLE = "Zero to Launch — Ship AI Hackathon";
const DESCRIPTION =
  "A free 48-hour hackathon at Workuity Biltmore, Phoenix, Oct 16–18 2026, for builders who need to launch. Plan the launch, execute it, build a growth engine. Judged on what shipped.";

export const metadata = {
  title: TITLE,
  description: DESCRIPTION,
  alternates: { canonical: "https://www.shipai.club/hackathon" },
  openGraph: {
    title: TITLE,
    description: DESCRIPTION,
    url: "https://www.shipai.club/hackathon",
    siteName: "Ship AI",
  },
};

/* The roster reads the database, so the page can't be frozen at build
   time any more — but it's still the busiest marketing page on the
   site and shouldn't become a query per visitor. Five minutes is well
   inside how fast a signup list needs to feel live. */
export const revalidate = 300;

export default function Page() {
  return (
    <>
      <JsonLd data={EVENT_SCHEMA} />
      <JsonLd data={FAQ_SCHEMA} />

      <header className="nav">
        <a href="/" className="brand">
          <img src="/logo-icon.png" alt="" width={26} height={26} />
          <span>Ship AI</span>
        </a>
        {/* Four anchors, not seven. This nav had become a table of
            contents for a very long page, which pushed the brand onto
            two lines and left the actual CTA competing with six
            section links. Benefits and Rules are a scroll away and
            linked from the copy that matters. */}
        <nav>
          <a href="/hackathon/workshops">Workshops</a>
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
            6 free workshops · hackathon {EVENT.datesShort} · workuity biltmore, phx
          </p>
          <h1 className="sr-only">Zero to Launch — the Ship AI hackathon</h1>
          <div className="hero-title" aria-hidden="true">
            <div className="reveal" style={{ "--d": "80ms" }}>
              <pre className="ascii">{ASCII_ZERO}</pre>
            </div>
            <div className="reveal" style={{ "--d": "160ms" }}>
              <pre className="ascii">{ASCII_TO}</pre>
            </div>
            <div className="reveal" style={{ "--d": "240ms" }}>
              <pre className="ascii ascii-accent">{ASCII_LAUNCH}</pre>
            </div>
          </div>
          <p className="lede reveal" style={{ "--d": "280ms" }}>
            Ten weeks of go-to-market, then a weekend where you don&apos;t build — you launch.
            Six free workshops on alternating Wednesdays from August 5, a build window that opens{" "}
            {EVENT.buildOpensShort}, and a hackathon in October where it all goes public.
            Bring the product you&apos;ve been sitting on. Wherever it stands on the Friday,
            you close it out and put it in front of people. Judged on what shipped, not on
            what you demoed.
          </p>
          <div className="cta-row reveal" style={{ "--d": "380ms" }}>
            <a className="btn btn-solid" href="/dashboard">
              Register for the hackathon
            </a>
            <a className="btn btn-ghost" href={DISCORD} target="_blank" rel="noreferrer">
              Join the Discord
            </a>
            <a className="btn btn-ghost" href={MEETUP} target="_blank" rel="noreferrer">
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

        <section className="section" id="why">
          <p className="kicker">Why this exists</p>
          <h2>Two kinds of builder, stuck in the same place.</h2>
          <div className="audience">
            <div className="aud-col aud-not">
              <p className="aud-head">The perpetual builder</p>
              <ul>
                <li>Shipping code every day, launched nothing.</li>
                <li>Not sure the product is right, so the answer is another feature.</li>
                <li>The product bloats, the launch date slides, and there&apos;s still no customer on the other end of it.</li>
              </ul>
            </div>
            <div className="aud-col aud-not">
              <p className="aud-head">The ready-but-frozen builder</p>
              <ul>
                <li>The product works. The next move doesn&apos;t exist.</li>
                <li>No site, no audience, no channel, no first ten customers.</li>
                <li>No idea which of those to do first.</li>
              </ul>
            </div>
          </div>
          <p className="section-lede hk-thesis">
            This weekend is for both. Most hackathons reward building something new in 48
            hours and it dies on Monday. This one inverts that: the code is the part you
            already have. What you&apos;re missing is a launch, and that&apos;s the whole
            deliverable.
          </p>
          <p className="rule-line">feel the fear and do it anyways</p>
        </section>

        <section className="section" id="outcomes">
          <p className="kicker">What you leave with</p>
          <h2>Six things, by Sunday afternoon.</h2>
          <p className="section-lede">
            The first two are written in August and everything after is built on them. The
            last four are what the judges score at the weekend.
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
            The curriculum is a full GTM engineering framework —{" "}
            <a href={GTM_DECK} target="_blank" rel="noreferrer">the deck</a> is session one,
            and every session after builds on the last: positioning before the site, the site
            before the channel, the channel before the launch. Each night is a presentation
            with a live build — watch, or follow along on your own laptop. Free, public, and
            open to anyone, whether you compete or not.
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
                <a href={`/hackathon/workshops/${w.slug}`}>
                  <span className="hk-series-n">{w.n}</span>
                  <span className="hk-series-date">{w.date}</span>
                  <span className="hk-series-title">{w.eventTitle}</span>
                  <ArrowRight size={15} strokeWidth={1.75} aria-hidden="true" />
                </a>
              </li>
            ))}
          </ol>
          <p className="hk-note">
            Each session has its own page with the full agenda, what to bring if you want to
            follow along, and what to go do afterward.{" "}
            <a href="/hackathon/workshops">See the whole curriculum</a>.
          </p>
        </section>

        <section className="section" id="schedule">
          <p className="kicker">The weekend</p>
          <h2>Friday night to Sunday afternoon.</h2>
          <p className="section-lede">
            No teaching this weekend — that all happened on Wednesdays. Friday you lock a
            launch plan, Saturday you execute it in a room full of people doing the same
            thing, Sunday you show what it produced. The B2C and B2B playbooks were sessions
            two and three — mentors run those 1:1 on Saturday if you need the refresher.
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
            The pool is cash plus in-kind, and it grows with sponsorship — amounts land on
            this page as sponsors confirm. Entry is free either way.
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
                  {c.voted && <span className="hk-cat-tag">room-voted</span>}
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

        <section className="section" id="benefits">
          <p className="kicker">What you get for entering</p>
          <h2>Six things on the table.</h2>
          <p className="section-lede">
            Most hackathons pay out to the top three and everyone else goes home with a
            wristband. Here the floor is worth showing up for on its own — the awards sit on
            top of it.
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
            <a href="/hackathon/results">the results page</a>, published the Sunday of the
            weekend, straight after the awards.
          </p>
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
            One submission per team, filed from your Ship AI account. Project, live URL, what
            you launched, and the numbers. Start it as a draft whenever you like and keep
            editing until the deadline — the full requirements are on the submission page, and
            they&apos;re worth reading Friday rather than Sunday morning.
          </p>
          <div className="cta-row">
            <a className="btn btn-solid" href="/dashboard">
              Register for the hackathon
            </a>
            <a className="btn btn-ghost" href="/hackathon/submit">
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
            Ship AI is free and stays free. Sponsorship funds two things: the prize pool, and
            the marketing to fill the room. No lead lists, no attendee data, no hard-sell
            slot — builders can tell the difference. If you want the room&apos;s attention,
            mentor a team.
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
            underwrite sets your tier. The full menu is itemized with the prices on it: what
            dinner costs, what the trophies cost, what the X account costs, and the named
            credit each one carries.
          </p>
          <div className="cta-row">
            <a className="btn btn-solid" href="/hackathon/sponsor">
              See the full sponsorship menu
            </a>
          </div>
          <p className="hk-note">
            Sponsorship closes {EVENT.sponsorDeadline} so prize amounts can go on this page
            before we push registration.{" "}
            <a href={SPONSOR_MAIL}>Get in touch</a>.
          </p>
        </section>

        <section className="section" id="roles">
          <p className="kicker">We&apos;re also looking for</p>
          <h2>Judges and mentors.</h2>
          <div className="hk-roles">
            <div className="hk-role">
              <h3>
                <Gauge className="icon" size={18} strokeWidth={1.75} aria-hidden="true" />
                Judges
              </h3>
              <p className="hk-role-when">Sunday, roughly 1:00–4:30 PM · 3–5 seats</p>
              <p>
                Founders and operators who have launched something and can tell a real number
                from a vanity one. You&apos;ll score against published criteria, ask hard
                questions in the Q&amp;A, and hand out an award. Gold and Platinum sponsors get
                a seat, and judging earns Bronze placement on its own.
              </p>
              <p className="hk-role-cta">
                <a href={JUDGE_MAIL}>Volunteer to judge</a>
              </p>
            </div>
            <div className="hk-role">
              <h3>
                <Users className="icon" size={18} strokeWidth={1.75} aria-hidden="true" />
                Mentors
              </h3>
              <p className="hk-role-when">Saturday afternoon · 5–8 seats</p>
              <p>
                1:1 rotations with teams that need a specific thing unstuck: marketing sites
                and performance, paid acquisition, B2B sales, content and SEO, design. Two
                hours is enough — show up for the block you can make.
              </p>
              <p className="hk-role-cta">
                <a href={MENTOR_MAIL}>Volunteer to mentor</a>
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
          <h2>Bring the thing you never launched.</h2>
          <div className="cta-row">
            <a className="btn btn-solid" href="/dashboard">
              Register for the hackathon
            </a>
            <a className="btn btn-ghost" href={DISCORD} target="_blank" rel="noreferrer">
              Join the Discord
            </a>
          </div>
          <p className="rule-line">just ship it</p>
        </section>
      </main>

      <footer className="footer">
        <div className="brand">
          <img src="/logo-icon.png" alt="" width={22} height={22} />
          <span>Ship AI</span>
        </div>
        <p>Phoenix &amp; Tempe, Arizona</p>
        <nav>
          <a href="/">Home</a>
          <a href="/hackathon/submit">Submit</a>
          <a href="/hackathon/results">Results</a>
          <a href="/hackathon/workshops">Workshops</a>
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
