import { notFound } from "next/navigation";
import { ArrowLeft, Clock, Download, Package, Presentation, Target } from "lucide-react";
import { siDiscord, siGithub } from "simple-icons";
import { JsonLd } from "../../../../../components/article";
import { guideFor, setupFor } from "../../../../../lib/guides";
import { deckFor } from "../../../../../lib/decks";
import { PROGRAMS, programBySlug, sessionBySlug, sessionDateLabel, sessionVenues } from "../../../../../lib/programs";
import { DISCORD } from "../../../../../lib/hackathon";
import registry from "../../../../../lib/skills.generated.json";

const SITE = "https://www.shipai.club";

export function generateStaticParams() {
  return PROGRAMS.flatMap((program) =>
    program.sessions
      .filter((session) => guideFor(program.slug, session.slug))
      .map((session) => ({ program: program.slug, slug: session.slug }))
  );
}

export async function generateMetadata({ params }) {
  const { program: programSlug, slug } = await params;
  const program = programBySlug(programSlug);
  const w = sessionBySlug(program, slug);
  const g = guideFor(programSlug, slug);
  if (!program || !w || !g) return {};
  const title = `${w.eventTitle} — follow-along guide`;
  const url = `${SITE}/programs/${program.slug}/${w.slug}/guide`;
  return {
    title: `${title} — Ship AI`,
    description: g.lede.slice(0, 300),
    alternates: { canonical: url },
    openGraph: { title, description: g.lede.slice(0, 200), url, siteName: "Ship AI", images: [{ url: "/og-image.jpg", width: 1200, height: 630 }] },
  };
}

export default async function Page({ params }) {
  const { program: programSlug, slug } = await params;
  const program = programBySlug(programSlug);
  const w = sessionBySlug(program, slug);
  const g = guideFor(programSlug, slug);
  if (!program || !w || !g) notFound();

  const manifest = registry.manifest.programs[program.slug];
  const kit = manifest?.sessions[slug];
  const setup = setupFor(program);
  const venueLabel = sessionVenues(w, program).map((item) => item.name).join(" & ");
  const programHref = `/programs/${program.slug}`;
  const schema = {
    "@context": "https://schema.org",
    "@type": "HowTo",
    name: `${w.eventTitle} — ${program.name} follow-along guide`,
    description: g.lede,
    totalTime: `PT${parseInt(g.minutes, 10)}M`,
    url: `${SITE}${programHref}/${w.slug}/guide`,
    step: g.steps.map((s, i) => ({ "@type": "HowToStep", position: i + 1, name: s.t, text: s.c })),
  };

  return (
    <>
      <JsonLd data={schema} />
      <header className="nav">
        <a href="/" className="brand"><img src="/logo-icon.png" alt="" width={26} height={26} /><span>Ship AI</span></a>
        <nav><a href="/programs">Programs</a><a href={programHref}>Sessions</a>{manifest && <a href={`${programHref}/skills`}>Skills</a>}{program.hasHackathon && <a href={program.hackathonHref}>Hackathon</a>}</nav>
        <div className="nav-ctas">{program.hasHackathon ? <><a className="btn btn-ghost" href={DISCORD} target="_blank" rel="noreferrer">Discord</a><a className="btn btn-solid" href="/dashboard">Register</a></> : <a className="btn btn-solid" href={DISCORD} target="_blank" rel="noreferrer">Get notified</a>}</div>
      </header>

      <main className="hk-ws gd">
        <p className="hk-ws-crumb"><a href={`${programHref}/${w.slug}`}><ArrowLeft size={13} strokeWidth={1.75} aria-hidden="true" />{w.eventTitle}</a></p>
        <div className="hk-ws-hero">
          <span className="hk-ws-bignum">{w.n}</span>
          <div>
            <p className="hk-ws-meta"><span className="hk-ws-act">Guide</span><span><Clock size={12} strokeWidth={1.75} aria-hidden="true" /> {g.minutes}</span><span>{sessionDateLabel(w)}</span><span className="hk-ws-venue">{venueLabel}</span></p>
            <h1>{w.eventTitle}</h1><p className="hk-ws-sub">Follow along</p>
          </div>
        </div>
        <p className="article-lede">{g.lede}</p>

        <div className="gd-actions">
          {kit?.guide && <a className="btn btn-ghost" href={`/guides/${kit.guide}`} download><Download size={15} strokeWidth={1.75} aria-hidden="true" />Guide as markdown</a>}
          {kit?.file && <a className="btn btn-ghost" href={`/skills/${kit.file}`} download><Package size={15} strokeWidth={1.75} aria-hidden="true" />Skills ({kit.count})</a>}
          {deckFor(program.slug, w.slug) && <a className="btn btn-ghost" href={`${programHref}/${w.slug}/deck`}><Presentation size={15} strokeWidth={1.75} aria-hidden="true" />Slides</a>}
        </div>

        <h2 className="hk-subhead">{setup.title}</h2><p>{setup.note}</p>
        <ol className="gd-setup">
          {setup.steps.map((s) => <li key={s.t}><p className="gd-setup-t">{s.t}</p><p>{s.c}</p>{s.run && kit?.file && <pre className="gd-cmd"><code>{s.run.replace("{BUNDLE}", kit.file)}</code></pre>}</li>)}
        </ol>

        <h2 className="hk-subhead">The steps</h2>
        <ol className="gd-steps">
          {g.steps.map((s, i) => <li key={s.t}><span className="gd-step-n">{String(i + 1).padStart(2, "0")}</span><div><p className="gd-step-t">{s.t}</p>{s.run && <p className="gd-step-run"><code>{s.run}</code></p>}<p>{s.c}</p>{s.good && <p className="gd-good"><Target size={13} strokeWidth={1.75} aria-hidden="true" /><span><strong>Done looks like:</strong> {s.good}</span></p>}</div></li>)}
        </ol>

        <h2 className="hk-subhead">What you leave with</h2><p className="hk-commit"><code>{g.output}</code></p>
        <h2 className="hk-subhead">If you get stuck</h2><p>{g.stuck}</p>
        <p className="hk-note">Or ask in <a href={DISCORD} target="_blank" rel="noreferrer">Discord</a> — mentors and everyone else&apos;s work in progress are there between sessions.</p>

        <div className="hk-discord"><svg viewBox="0 0 24 24" width={22} height={22} fill="currentColor" aria-hidden="true"><path d={siDiscord.path} /></svg><div><h3>Missed the session?</h3><p>The archive lives in Discord and this guide works without it. Nothing here expires.</p></div><a className="btn btn-solid" href={DISCORD} target="_blank" rel="noreferrer">Join the Discord</a></div>
      </main>

      <footer className="footer">
        <div className="brand"><img src="/logo-icon.png" alt="" width={22} height={22} /><span>Ship AI</span></div><p>Phoenix &amp; Tempe, Arizona</p>
        <nav><a href="/">Home</a><a href="/programs">Programs</a><a href={programHref}>{program.name}</a>{manifest && <a href={`${programHref}/skills`}>Skills</a>}{program.templateRepo && <a href={program.templateRepo} target="_blank" rel="noreferrer"><svg viewBox="0 0 24 24" width={14} height={14} fill="currentColor" aria-hidden="true"><path d={siGithub.path} /></svg></a>}</nav>
        <p className="fine">© 2026 Ship AI</p>
      </footer>
    </>
  );
}
