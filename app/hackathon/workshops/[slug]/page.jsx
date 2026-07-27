import { notFound } from "next/navigation";
import {
  ArrowLeft,
  ArrowRight,
  Backpack,
  BookOpen,
  Briefcase,
  CalendarDays,
  GitCommitHorizontal,
  ListChecks,
  MapPin,
  Package,
  Presentation,
  Sparkles,
  Wrench,
} from "lucide-react";
import { siDiscord, siGithub, siMeetup } from "simple-icons";
import { JsonLd } from "../../../../components/article";
import { deckFor } from "../../../../lib/decks";
import { guideFor } from "../../../../lib/guides";
import registry from "../../../../lib/skills.generated.json";
import {
  EVENT,
  WORKSHOPS,
  DISCORD,
  LUMA,
  MEETUP,
  LINKEDIN,
  GTM_DECK,
  TEMPLATE_REPO,
  rsvpLinks,
  venueOf,
  workshopBySlug,
  workshopNeighbours,
} from "../../../../lib/hackathon";

export function generateStaticParams() {
  return WORKSHOPS.map((w) => ({ slug: w.slug }));
}

/* the skill registry is generated from the vendored SKILL.md files at
   build time, so descriptions on the page can't drift from the download */
const skillsByName = new Map(registry.skills.map((s) => [s.name, s]));

export async function generateMetadata({ params }) {
  const { slug } = await params;
  const w = workshopBySlug(slug);
  if (!w) return {};
  const title = `${w.title} — Zero to Launch workshop ${w.n}`;
  const description = `${w.date}, 2026 at ${venueOf(w).name}, Phoenix. ${w.copy}`.slice(0, 300);
  return {
    title: `${title} — Ship AI`,
    description,
    alternates: { canonical: `https://www.shipai.club/hackathon/workshops/${w.slug}` },
    openGraph: {
      title,
      description,
      url: `https://www.shipai.club/hackathon/workshops/${w.slug}`,
      siteName: "Ship AI",
    },
  };
}

export default async function Page({ params }) {
  const { slug } = await params;
  const w = workshopBySlug(slug);
  if (!w) notFound();

  const { prev, next } = workshopNeighbours(slug);
  const rsvp = rsvpLinks(w);
  const venue = venueOf(w);
  const slides = deckFor(slug);
  const guide = guideFor(slug);
  const kit = registry.manifest.sessions[slug];

  const schema = {
    "@context": "https://schema.org",
    "@type": "Event",
    name: `${w.title} — Zero to Launch workshop ${w.n}`,
    description: w.copy,
    startDate: `${w.iso}T18:00:00-07:00`,
    endDate: `${w.iso}T21:00:00-07:00`,
    eventAttendanceMode: "https://schema.org/OfflineEventAttendanceMode",
    eventStatus: "https://schema.org/EventScheduled",
    location: {
      "@type": "Place",
      name: venue.name,
      address: {
        "@type": "PostalAddress",
        streetAddress: venue.street,
        addressLocality: venue.city,
        addressRegion: venue.region,
        postalCode: venue.zip,
      },
    },
    organizer: { "@type": "Organization", name: "Ship AI", url: "https://www.shipai.club" },
    url: `https://www.shipai.club/hackathon/workshops/${w.slug}`,
    isAccessibleForFree: true,
    superEvent: {
      "@type": "EventSeries",
      name: "Zero to Launch workshops",
      url: "https://www.shipai.club/hackathon/workshops",
    },
  };

  return (
    <>
      <JsonLd data={schema} />

      <header className="nav">
        <a href="/" className="brand">
          <img src="/logo-icon.png" alt="" width={26} height={26} />
          <span>Ship AI</span>
        </a>
        <nav>
          <a href="/hackathon/workshops">All workshops</a>
          <a href="/hackathon/skills">Skills</a>
          <a href="/hackathon">Hackathon</a>
        </nav>
        <a className="btn btn-solid nav-cta" href={DISCORD} target="_blank" rel="noreferrer">
          Join the Discord
        </a>
      </header>

      <main className="hk-ws">
        <p className="hk-ws-crumb">
          <a href="/hackathon/workshops">
            <ArrowLeft size={13} strokeWidth={1.75} aria-hidden="true" />
            Zero to Launch workshops
          </a>
        </p>

        <div className="hk-ws-hero">
          <span className="hk-ws-bignum">{w.n}</span>
          <div>
            <p className="hk-ws-meta">
              <span className="hk-ws-act">{w.act}</span>
              {w.audience && <span className="hk-ws-aud">{w.audience}</span>}
              <span>{w.date}, 2026 · 6:00 PM</span>
              <span className="hk-ws-venue">{venue.name}</span>
            </p>
            <h1>{w.eventTitle}</h1>
            <p className="hk-ws-sub">{w.title}</p>
          </div>
        </div>

        <p className="article-lede">{w.lede}</p>

        <div className="hk-ws-rsvp">
          <a className="btn btn-solid" href={rsvp.luma} target="_blank" rel="noreferrer">
            <CalendarDays size={16} strokeWidth={1.75} aria-hidden="true" />
            RSVP on Luma
          </a>
          <a className="btn btn-ghost" href={rsvp.meetup} target="_blank" rel="noreferrer">
            <svg viewBox="0 0 24 24" width={16} height={16} fill="currentColor" aria-hidden="true">
              <path d={siMeetup.path} />
            </svg>
            Meetup
          </a>
          <a className="btn btn-ghost" href={rsvp.linkedin} target="_blank" rel="noreferrer">
            <Briefcase size={16} strokeWidth={1.75} aria-hidden="true" />
            LinkedIn
          </a>
        </div>
        {rsvp.pending && (
          <p className="hk-note">
            <MapPin size={13} strokeWidth={1.75} aria-hidden="true" />
            <a href={venue.url} target="_blank" rel="noreferrer">{venue.name}</a> —{" "}
            {venue.address}. {venue.note} Individual event links go live closer to the date;
            these point at the Ship AI calendars, where every session is listed.
          </p>
        )}

        <p className="hk-note">
          Format: Santos presents and builds live on screen. Bring a laptop and work along if
          you want to, or just watch — nobody is put on the spot, asked to share, or made to
          present.
        </p>

        <h2 className="hk-subhead">Why this session exists</h2>
        <p>{w.why}</p>

        <h2 className="hk-subhead">
          <ListChecks size={18} strokeWidth={1.75} aria-hidden="true" />
          What we cover
        </h2>
        <ol className="hk-agenda-list">
          {w.agenda.map((a, i) => (
            <li key={a.t}>
              <span className="hk-agenda-n">{String(i + 1).padStart(2, "0")}</span>
              <div>
                <p className="hk-agenda-t">{a.t}</p>
                <p>{a.c}</p>
              </div>
            </li>
          ))}
        </ol>

        <div className="hk-ws-grid">
          <div className="hk-ws-card">
            <h3>
              <Sparkles size={16} strokeWidth={1.75} aria-hidden="true" />
              You leave with
            </h3>
            <p>{w.take}</p>
          </div>
          <div className="hk-ws-card">
            <h3>
              <Backpack size={16} strokeWidth={1.75} aria-hidden="true" />
              If you want to follow along
            </h3>
            <p>{w.bring}</p>
          </div>
        </div>

        <h2 className="hk-subhead">
          <GitCommitHorizontal size={18} strokeWidth={1.75} aria-hidden="true" />
          What to do afterward
        </h2>
        <p>
          Nothing is required — not to attend, and not to compete in October. But the program
          compounds if you run the same work on your own product. The suggested output for
          this session:
        </p>
        <p className="hk-commit">
          <code>{w.commit}</code>
        </p>
        <p className="hk-note">
          Everything is open source. The{" "}
          <a href={TEMPLATE_REPO} target="_blank" rel="noreferrer">template repo</a> and its
          skill files are published — take them and run the process yourself, during the
          program or years from now. Missed this session? It&apos;s archived in Discord, and
          you can pick the work up whenever.
        </p>

        <h2 className="hk-subhead" id="kit">
          <Package size={18} strokeWidth={1.75} aria-hidden="true" />
          The session kit
        </h2>
        <p>
          Slides, a follow-along guide and the skill files, all free and all downloadable
          whether you make it to the room or not. Nothing expires and nothing needs an
          account.
        </p>

        <div className="kit-row">
          {slides && (
            <a className="kit-card" href={`/hackathon/workshops/${w.slug}/deck`}>
              <Presentation size={17} strokeWidth={1.75} aria-hidden="true" />
              <span className="kit-card-t">Slides</span>
              <span className="kit-card-c">
                {slides.length} slides. Arrow keys, fullscreen, print to PDF.
              </span>
              <span className="kit-card-go">Open the deck →</span>
            </a>
          )}
          {guide && (
            <a className="kit-card" href={`/hackathon/workshops/${w.slug}/guide`}>
              <BookOpen size={17} strokeWidth={1.75} aria-hidden="true" />
              <span className="kit-card-t">Follow-along guide</span>
              <span className="kit-card-c">
                {guide.steps.length} steps, {guide.minutes}. What to run, and what done looks
                like.
              </span>
              <span className="kit-card-go">Read the guide →</span>
            </a>
          )}
          {kit && (
            <a className="kit-card" href={`/skills/${kit.file}`} download>
              <Package size={17} strokeWidth={1.75} aria-hidden="true" />
              <span className="kit-card-t">Skill files</span>
              <span className="kit-card-c">
                {kit.count} skills as a zip. Unzips into <code>.claude/skills/</code>.
              </span>
              <span className="kit-card-go">Download ({kit.count}) ↓</span>
            </a>
          )}
        </div>

        {slides && (
          <div className="kit-deck">
            <div className="kit-deck-head">
              <span>Preview</span>
              <a href={`/hackathon/workshops/${w.slug}/deck`}>Open full size →</a>
            </div>
            <div className="kit-deck-frame">
              <iframe
                src={`/hackathon/workshops/${w.slug}/deck`}
                title={`${w.eventTitle} slides`}
                loading="lazy"
              />
            </div>
          </div>
        )}

        {kit && (
          <>
            <p className="kit-install-label">Install this session&apos;s skills</p>
            <pre className="sk-install">
              <code>
                {`curl -fsSLO https://www.shipai.club/skills/${kit.file}\nunzip -o ${kit.file} -d .`}
              </code>
            </pre>
          </>
        )}

        {w.skills?.length > 0 && (
          <>
            <h3 className="kit-subhead">
              <Wrench size={16} strokeWidth={1.75} aria-hidden="true" />
              What&apos;s in the bundle
            </h3>
            <ul className="kit-skills">
              {w.skills.map((s) => {
                const skill = skillsByName.get(s);
                return (
                  <li key={s}>
                    <p className="kit-skill-name">
                      <code>/{s}</code>
                      <a href={`/skills/${s}/SKILL.md`}>SKILL.md</a>
                    </p>
                    {skill && <p className="kit-skill-desc">{skill.description}</p>}
                  </li>
                );
              })}
            </ul>
            <p className="hk-note">
              They do the mechanical half of the work, so the session can be spent on judgement
              instead of formatting. Every skill from all six sessions is on the{" "}
              <a href="/hackathon/skills">skills page</a>.
            </p>
            {w.boilerplate && (
              <p className="hk-note">
                This is one of the two sessions where the Next.js boilerplate lands. Up to
                here the program runs light — skill files and whatever stack you already use.
              </p>
            )}
          </>
        )}

        {w.deck && (
          <p className="hk-note">
            Working from the GTM deck:{" "}
            <a href={GTM_DECK} target="_blank" rel="noreferrer">gtm.desic.xyz</a>
          </p>
        )}

        <div className="hk-discord">
          <svg viewBox="0 0 24 24" width={22} height={22} fill="currentColor" aria-hidden="true">
            <path d={siDiscord.path} />
          </svg>
          <div>
            <h3>Join the community online</h3>
            <p>
              Session recaps and the archive, mentor questions between Wednesdays, and
              everyone else&apos;s work in progress. Free, and where most of the program
              actually happens.
            </p>
          </div>
          <a className="btn btn-solid" href={DISCORD} target="_blank" rel="noreferrer">
            Join the Discord
          </a>
        </div>

        <nav className="hk-ws-nav" aria-label="Workshop navigation">
          {prev ? (
            <a href={`/hackathon/workshops/${prev.slug}`} className="hk-ws-prev">
              <span>
                <ArrowLeft size={13} strokeWidth={1.75} aria-hidden="true" />
                Previous · {prev.n}
              </span>
              <strong>{prev.title}</strong>
            </a>
          ) : (
            <span />
          )}
          {next ? (
            <a href={`/hackathon/workshops/${next.slug}`} className="hk-ws-next">
              <span>
                Next · {next.n}
                <ArrowRight size={13} strokeWidth={1.75} aria-hidden="true" />
              </span>
              <strong>{next.title}</strong>
            </a>
          ) : (
            <a href="/hackathon" className="hk-ws-next">
              <span>
                Finally
                <ArrowRight size={13} strokeWidth={1.75} aria-hidden="true" />
              </span>
              <strong>The hackathon weekend, {EVENT.datesShort}</strong>
            </a>
          )}
        </nav>
      </main>

      <footer className="footer">
        <div className="brand">
          <img src="/logo-icon.png" alt="" width={22} height={22} />
          <span>Ship AI</span>
        </div>
        <p>Phoenix &amp; Tempe, Arizona</p>
        <nav>
          <a href="/">Home</a>
          <a href="/hackathon/workshops">Workshops</a>
          <a href="/hackathon/skills">Skills</a>
          <a href="/hackathon">Hackathon</a>
          <a href={TEMPLATE_REPO} target="_blank" rel="noreferrer">
            <svg viewBox="0 0 24 24" width={14} height={14} fill="currentColor" aria-hidden="true">
              <path d={siGithub.path} />
            </svg>
          </a>
        </nav>
        <p className="fine">© 2026 Ship AI</p>
      </footer>
    </>
  );
}
