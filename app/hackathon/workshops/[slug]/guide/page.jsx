import { notFound } from "next/navigation";
import { ArrowLeft, Clock, Download, Package, Presentation, Target } from "lucide-react";
import { siDiscord, siGithub } from "simple-icons";
import { JsonLd } from "../../../../../components/article";
import { GUIDES, SETUP } from "../../../../../lib/guides";
import { DISCORD, TEMPLATE_REPO, WORKSHOPS, venueOf, workshopBySlug } from "../../../../../lib/hackathon";
import registry from "../../../../../lib/skills.generated.json";

export function generateStaticParams() {
  return WORKSHOPS.filter((w) => GUIDES[w.slug]).map((w) => ({ slug: w.slug }));
}

export async function generateMetadata({ params }) {
  const { slug } = await params;
  const w = workshopBySlug(slug);
  const g = GUIDES[slug];
  if (!w || !g) return {};
  const title = `${w.eventTitle} — follow-along guide`;
  return {
    title: `${title} — Ship AI`,
    description: g.lede.slice(0, 300),
    alternates: { canonical: `https://www.shipai.club/hackathon/workshops/${w.slug}/guide` },
    openGraph: {
      title,
      description: g.lede.slice(0, 200),
      url: `https://www.shipai.club/hackathon/workshops/${w.slug}/guide`,
      siteName: "Ship AI",
    },
  };
}

export default async function Page({ params }) {
  const { slug } = await params;
  const w = workshopBySlug(slug);
  const g = GUIDES[slug];
  if (!w || !g) notFound();

  const kit = registry.manifest.sessions[slug];
  const venue = venueOf(w);

  const schema = {
    "@context": "https://schema.org",
    "@type": "HowTo",
    name: `${w.eventTitle} — Zero to Launch follow-along guide`,
    description: g.lede,
    totalTime: `PT${parseInt(g.minutes, 10)}M`,
    step: g.steps.map((s, i) => ({
      "@type": "HowToStep",
      position: i + 1,
      name: s.t,
      text: s.c,
    })),
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
        <div className="nav-ctas">
          <a className="btn btn-ghost" href={DISCORD} target="_blank" rel="noreferrer">
            Discord
          </a>
          <a className="btn btn-solid" href="/dashboard">
            Register
          </a>
        </div>
      </header>

      <main className="hk-ws gd">
        <p className="hk-ws-crumb">
          <a href={`/hackathon/workshops/${w.slug}`}>
            <ArrowLeft size={13} strokeWidth={1.75} aria-hidden="true" />
            {w.eventTitle}
          </a>
        </p>

        <div className="hk-ws-hero">
          <span className="hk-ws-bignum">{w.n}</span>
          <div>
            <p className="hk-ws-meta">
              <span className="hk-ws-act">Guide</span>
              <span>
                <Clock size={12} strokeWidth={1.75} aria-hidden="true" /> {g.minutes}
              </span>
              <span>{w.date}, 2026</span>
              <span className="hk-ws-venue">{venue.name}</span>
            </p>
            <h1>{w.eventTitle}</h1>
            <p className="hk-ws-sub">Follow along</p>
          </div>
        </div>

        <p className="article-lede">{g.lede}</p>

        <div className="gd-actions">
          {kit?.guide && (
            <a className="btn btn-ghost" href={`/guides/${kit.guide}`} download>
              <Download size={15} strokeWidth={1.75} aria-hidden="true" />
              Guide as markdown
            </a>
          )}
          {kit?.file && (
            <a className="btn btn-ghost" href={`/skills/${kit.file}`} download>
              <Package size={15} strokeWidth={1.75} aria-hidden="true" />
              Skills ({kit.count})
            </a>
          )}
          <a className="btn btn-ghost" href={`/hackathon/workshops/${w.slug}/deck`}>
            <Presentation size={15} strokeWidth={1.75} aria-hidden="true" />
            Slides
          </a>
        </div>

        <h2 className="hk-subhead">{SETUP.title}</h2>
        <p>{SETUP.note}</p>
        <ol className="gd-setup">
          {SETUP.steps.map((s) => (
            <li key={s.t}>
              <p className="gd-setup-t">{s.t}</p>
              <p>{s.c}</p>
              {s.run && kit?.file && (
                <pre className="gd-cmd">
                  <code>{s.run.replace("{BUNDLE}", kit.file)}</code>
                </pre>
              )}
            </li>
          ))}
        </ol>

        <h2 className="hk-subhead">The steps</h2>
        <ol className="gd-steps">
          {g.steps.map((s, i) => (
            <li key={s.t}>
              <span className="gd-step-n">{String(i + 1).padStart(2, "0")}</span>
              <div>
                <p className="gd-step-t">{s.t}</p>
                {s.run && (
                  <p className="gd-step-run">
                    <code>{s.run}</code>
                  </p>
                )}
                <p>{s.c}</p>
                {s.good && (
                  <p className="gd-good">
                    <Target size={13} strokeWidth={1.75} aria-hidden="true" />
                    <span>
                      <strong>Done looks like:</strong> {s.good}
                    </span>
                  </p>
                )}
              </div>
            </li>
          ))}
        </ol>

        <h2 className="hk-subhead">What you leave with</h2>
        <p className="hk-commit">
          <code>{g.output}</code>
        </p>

        <h2 className="hk-subhead">If you get stuck</h2>
        <p>{g.stuck}</p>
        <p className="hk-note">
          Or ask in <a href={DISCORD} target="_blank" rel="noreferrer">Discord</a> — mentors are
          in there between Wednesdays, and everyone else&apos;s work in progress is too.
        </p>

        <div className="hk-discord">
          <svg viewBox="0 0 24 24" width={22} height={22} fill="currentColor" aria-hidden="true">
            <path d={siDiscord.path} />
          </svg>
          <div>
            <h3>Missed the session?</h3>
            <p>
              Every session is archived in Discord and this guide works without it. Nothing here
              expires — take it and run the process whenever.
            </p>
          </div>
          <a className="btn btn-solid" href={DISCORD} target="_blank" rel="noreferrer">
            Join the Discord
          </a>
        </div>
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
