import { notFound } from "next/navigation";
import {
  ArrowRight,
  BadgeCheck,
  Clock,
  Coins,
  Handshake,
  ListOrdered,
  Megaphone,
  ShieldCheck,
  Sparkles,
} from "lucide-react";
import { siDiscord, siGithub, siMeetup, siX } from "simple-icons";

import { EVENT, DISCORD, MEETUP, GITHUB, X_URL } from "../../../../../lib/hackathon";
import { PROGRAMS, programBySlug } from "../../../../../lib/programs";
import {
  TIERS,
  MENU,
  CREDITS,
  HOURS,
  PROCESS,
  PROMISES,
  NOT_SOLD,
  VALUATION,
  YEAR_ROUND,
  SPONSOR_CONTACT,
} from "../../../../../lib/sponsors";

import "./sponsor.css";

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

const TITLE = "Sponsor Zero to Launch — Ship AI";
const DESCRIPTION =
  "Seven events over ten weeks for 30–50 Phoenix builders. Four tiers, an itemized menu with the prices on it, and credits or donated hours count the same as cash.";

export const metadata = {
  title: TITLE,
  description: DESCRIPTION,
  alternates: { canonical: "https://www.shipai.club/programs/zero-to-launch/hackathon/sponsor" },
  openGraph: {
    title: TITLE,
    description: DESCRIPTION,
    url: "https://www.shipai.club/programs/zero-to-launch/hackathon/sponsor",
    siteName: "Ship AI",
    images: [{ url: "/og-image.jpg", width: 1200, height: 630 }],
  },
};

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
      <header className="nav">
        <a href="/" className="brand">
          <img src="/logo-icon.png" alt="" width={26} height={26} />
          <span>Ship AI</span>
        </a>
        <nav>
          <a href="/programs">Programs</a>
          <a href="/programs/zero-to-launch/hackathon">Hackathon</a>
          <a href="#tiers">Tiers</a>
          <a href="#menu">The menu</a>
          <a href="#credits">Credits</a>
          <a href="#hours">Hours</a>
        </nav>
        <a className="btn btn-solid nav-cta" href="/dashboard/requests">
          Talk to us
        </a>
      </header>

      <main id="top" className="sp-page">
        <section className="section sp-hero">
          <p className="kicker">Sponsorship</p>
          <h1>Put your name on the part you actually paid for.</h1>
          <p className="section-lede">
            Seven events over ten weeks — six free Wednesday sessions from{" "}
            {EVENT.seriesStart.replace("Wednesday ", "")}, then a hackathon on{" "}
            {EVENT.datesShort} where 30–50 Phoenix builders don&apos;t build, they ship. All
            free. Sponsorship is what keeps it that way.
          </p>
          <p className="sp-mech">
            <strong>Cash, platform credits and donated hours all count toward the same ladder</strong>
            {" — "}the total you underwrite sets your tier. Two Bronze items make a Silver.
          </p>
          <div className="cta-row">
            <a className="btn btn-solid" href="#tiers">
              See the tiers
            </a>
            <a className="btn btn-ghost" href="#menu">
              Or pick a line item
            </a>
          </div>
        </section>

        <section className="section" id="tiers">
          <p className="kicker">The deal</p>
          <h2>Four tiers, and what they actually buy.</h2>
          <div className="sp-tiers">
            {TIERS.map((t) => (
              <article key={t.id} className={`sp-tier sp-tier-${t.id}`}>
                <div className="sp-tier-head">
                  <h3>
                    {t.name}
                    {t.sub && <span className="sp-tier-sub">{t.sub}</span>}
                  </h3>
                  <span className="sp-tier-price">{t.priceLabel}</span>
                </div>
                <p className="sp-tier-slots">{t.slots}</p>
                <p className="sp-tier-buys">{t.buys}</p>
                <p className="sp-tier-perks">{t.perks}</p>
              </article>
            ))}
          </div>
          <p className="hk-note">
            Every item on the menu carries its own named credit — fund the X account and the
            bio reads &ldquo;powered by ___&rdquo; for the season. &ldquo;We paid for the prize
            pool&rdquo; lands harder than &ldquo;we were a gold sponsor.&rdquo;
          </p>
        </section>

        <section className="section" id="menu">
          <p className="kicker">The menu</p>
          <h2>Underwrite a line item.</h2>
          <p className="section-lede">
            Everything it takes to run seven events for fifty builders, priced at what it
            costs us. The numbers are public so you can decide before you message us. The total
            you take sets your tier.
          </p>

          {MENU.map((group) => (
            <div key={group.id} className="sp-group">
              <h3 className="hk-subhead">
                <Sparkles size={18} strokeWidth={1.75} aria-hidden="true" />
                {group.name}
              </h3>
              {group.note && <p className="sp-group-note">{group.note}</p>}
              <ul className="sp-items">
                {group.items.map((item) => (
                  <li key={item.name} className="sp-item">
                    <div className="sp-item-head">
                      <h4>{item.name}</h4>
                      <span className="sp-item-price">{item.priceLabel}</span>
                    </div>
                    <p className="sp-item-copy">{item.copy}</p>
                    <p className="sp-item-credit">
                      <ArrowRight size={14} strokeWidth={2} aria-hidden="true" />
                      <span>{item.credit}</span>
                    </p>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </section>

        <section className="section sp-credits" id="credits">
          <p className="kicker">The build</p>
          <h2>Credits are the highest-leverage thing on this page.</h2>
          <p className="section-lede">{CREDITS.lede}</p>

          <p className="sp-math">
            <Coins size={20} strokeWidth={1.75} aria-hidden="true" />
            <span>{CREDITS.math}</span>
          </p>
          <p className="sp-group-note">{CREDITS.distribution}</p>

          <ul className="sp-ladder">
            {CREDITS.ladder.map((rung) => (
              <li key={rung.amount}>
                <span className="sp-ladder-amt">{rung.amount}</span>
                <span className="sp-ladder-tier">{rung.tier}</span>
                {rung.note && <span className="sp-ladder-note">{rung.note}</span>}
              </li>
            ))}
          </ul>

          <p className="sp-provider">{CREDITS.provider}</p>

          <h3 className="hk-subhead">
            <BadgeCheck size={18} strokeWidth={1.75} aria-hidden="true" />
            Platforms we&apos;d take credits on today
          </h3>
          <ul className="sp-platforms">
            {CREDITS.platforms.map((p) => (
              <li key={p.group}>
                <span className="sp-plat-group">{p.group}</span>
                <span className="sp-plat-names">{p.names}</span>
              </li>
            ))}
          </ul>
          <p className="hk-note">{CREDITS.openDoor}</p>
          <p className="sp-item-credit sp-credit-standalone">
            <ArrowRight size={14} strokeWidth={2} aria-hidden="true" />
            <span>{CREDITS.credit}</span>
          </p>
        </section>

        <section className="section" id="hours">
          <p className="kicker">No budget line required</p>
          <h2>Sponsor with hours.</h2>
          <p className="section-lede">{HOURS.lede}</p>
          <ul className="sp-items sp-hours">
            {HOURS.roles.map((r) => (
              <li key={r.name} className="sp-item">
                <div className="sp-item-head">
                  <h4>
                    <Clock size={15} strokeWidth={2} aria-hidden="true" />
                    {r.name}
                  </h4>
                  <span className="sp-item-price">
                    {r.commitment}
                    {r.tier && <span className="sp-hours-tier">{r.tier}</span>}
                  </span>
                </div>
                <p className="sp-item-copy">{r.copy}</p>
                <p className="sp-item-credit">
                  <ArrowRight size={14} strokeWidth={2} aria-hidden="true" />
                  <span>{r.credit}</span>
                </p>
              </li>
            ))}
          </ul>
          <p className="hk-note">
            Sunday&apos;s pitches are also open to investors. If you write cheques for early
            products with real numbers, come sit in the room. Nothing to buy.
          </p>
        </section>

        <section className="section" id="process">
          <p className="kicker">How it goes</p>
          <h2>Four steps, and one of them is us doing the work.</h2>
          <ol className="sp-process">
            {PROCESS.map((step, i) => (
              <li key={step.title}>
                <span className="sp-step-n">{String(i + 1).padStart(2, "0")}</span>
                <div>
                  <h3>{step.title}</h3>
                  <p>{step.copy}</p>
                </div>
              </li>
            ))}
          </ol>
        </section>

        <section className="section" id="promise">
          <p className="kicker">The fine print, in plain words</p>
          <h2>What we promise, and what we don&apos;t sell.</h2>
          <ul className="sp-promises">
            {PROMISES.map((p) => (
              <li key={p}>
                <BadgeCheck size={16} strokeWidth={1.75} aria-hidden="true" />
                <span>{p}</span>
              </li>
            ))}
          </ul>
          <div className="sp-callout">
            <h3>
              <ShieldCheck size={18} strokeWidth={1.75} aria-hidden="true" />
              What we don&apos;t sell
            </h3>
            <p>{NOT_SOLD}</p>
          </div>
          <h3 className="hk-subhead">
            <ListOrdered size={18} strokeWidth={1.75} aria-hidden="true" />
            How in-kind is valued
          </h3>
          <p className="sp-group-note">{VALUATION}</p>
        </section>

        <section className="section sp-band" id="talk">
          <Megaphone size={22} strokeWidth={1.75} aria-hidden="true" />
          <h2>Sponsorship closes {EVENT.sponsorDeadline}.</h2>
          <p>
            That&apos;s so prize amounts can go on the page before we push registration.
            Commit before {EVENT.seriesStart.replace("Wednesday ", "").replace(", 2026", "")} and
            your name is on the program from session one. Tell us what you want your name on
            and we&apos;ll be straight about where it lands.
          </p>
          <div className="cta-row">
            <a className="btn btn-solid" href="/dashboard/requests">
              Start a sponsorship request
            </a>
            <a className="btn btn-ghost" href={SPONSOR_CONTACT} target="_blank" rel="noreferrer">
              Or ask in Discord first
            </a>
          </div>
        </section>

        <section className="section" id="year-round">
          <p className="kicker">Beyond the season</p>
          <h2>Year-round.</h2>
          <p className="section-lede">
            Zero to Launch is one season; Ship AI runs free, public events in Phoenix
            year-round. Some sponsors would rather back the room than the program.
          </p>
          <ul className="sp-year">
            {YEAR_ROUND.map((y) => (
              <li key={y.name}>
                <div className="sp-item-head">
                  <h4>{y.name}</h4>
                  <span className="sp-item-price">{y.price}</span>
                </div>
                <p className="sp-item-copy">{y.copy}</p>
              </li>
            ))}
          </ul>
        </section>
      </main>

      <footer className="footer">
        <div className="brand">
          <img src="/logo-icon.png" alt="" width={22} height={22} />
          <span>Ship AI</span>
        </div>
        <nav>
          <a href="/">Home</a>
          <a href="/programs/zero-to-launch/hackathon">Hackathon</a>
          <a href="/programs">Programs</a>
          <a href="/programs/zero-to-launch">Sessions</a>
          <a href="/programs/zero-to-launch/hackathon/results">Results</a>
        </nav>
        <div className="socials">
          {SOCIALS.map((s) => (
            <a
              key={s.label}
              href={s.href}
              target="_blank"
              rel="noreferrer"
              aria-label={s.label}
              title={s.label}
            >
              {s.glyph}
            </a>
          ))}
        </div>
        <p className="fine">© 2026 Ship AI</p>
      </footer>
    </>
  );
}
