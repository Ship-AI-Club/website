import { notFound } from "next/navigation";
import { BookOpen, Download, FileCode2, Package, Presentation, Terminal } from "lucide-react";
import { siDiscord, siGithub } from "simple-icons";
import { JsonLd } from "../../../../components/article";
import { deckFor } from "../../../../lib/decks";
import { guideFor } from "../../../../lib/guides";
import { PROGRAMS, programBySlug, sessionDateLabel } from "../../../../lib/programs";
import { DISCORD } from "../../../../lib/hackathon";
import registry from "../../../../lib/skills.generated.json";

const SITE = "https://www.shipai.club";
const byName = new Map(registry.skills.map((s) => [s.name, s]));

export function generateStaticParams() {
  return PROGRAMS.filter((program) => registry.manifest.programs?.[program.slug]).map((program) => ({
    program: program.slug,
  }));
}

export async function generateMetadata({ params }) {
  const { program: programSlug } = await params;
  const program = programBySlug(programSlug);
  const manifest = registry.manifest.programs?.[programSlug];
  if (!program || !manifest) return {};
  const title = `${program.name} Skills — Ship AI`;
  const description = `The full set of skill files from the ${program.name} program, free to download. Plain markdown for Claude Code, the Codex extension, or anything that reads a skills directory.`;
  const url = `${SITE}/programs/${program.slug}/skills`;
  return {
    title,
    description,
    alternates: { canonical: url },
    openGraph: { title, description, url, siteName: "Ship AI", images: [{ url: "/og-image.jpg", width: 1200, height: 630 }] },
  };
}

export default async function Page({ params }) {
  const { program: programSlug } = await params;
  const program = programBySlug(programSlug);
  const manifest = registry.manifest.programs?.[programSlug];
  if (!program || !manifest) notFound();

  const total = manifest.all.count;
  const programHref = `/programs/${program.slug}`;
  const description = `Every skill file from the ${program.name} program, free to download and run.`;
  const schema = {
    "@context": "https://schema.org",
    "@type": "SoftwareApplication",
    name: `${program.name} skills`,
    applicationCategory: "DeveloperApplication",
    operatingSystem: "Any",
    description,
    url: `${SITE}${programHref}/skills`,
    downloadUrl: `${SITE}/skills/${manifest.all.file}`,
    offers: { "@type": "Offer", price: "0", priceCurrency: "USD" },
    author: { "@type": "Organization", name: "Ship AI", url: SITE },
  };

  return (
    <>
      <JsonLd data={schema} />
      <header className="nav">
        <a href="/" className="brand"><img src="/logo-icon.png" alt="" width={26} height={26} /><span>Ship AI</span></a>
        <nav><a href="/programs">Programs</a><a href={programHref}>Sessions</a>{program.hasHackathon && <a href={program.hackathonHref}>Hackathon</a>}</nav>
        <div className="nav-ctas">{program.hasHackathon ? <><a className="btn btn-ghost" href={DISCORD} target="_blank" rel="noreferrer">Discord</a><a className="btn btn-solid" href="/dashboard">Register</a></> : <a className="btn btn-solid" href={DISCORD} target="_blank" rel="noreferrer">Get notified</a>}</div>
      </header>

      <main className="sk">
        <p className="kicker">{program.name} · {program.datesLabel || "Dates TBD"}</p>
        <h1 className="sk-h1">{total} skills,<br />free to take.</h1>
        <p className="article-lede">
          Every mechanical piece of the {program.sessions.length}-session program, as skill files.
          Plain markdown with frontmatter — run them in Claude Code, the Codex extension, or anything
          that reads a skills directory. No account, no signup, no expiry.
        </p>

        <div className="sk-top">
          <a className="btn btn-solid" href={`/skills/${manifest.all.file}`} download><Download size={16} strokeWidth={1.75} aria-hidden="true" />Download all {total}</a>
          {program.templateRepo && <a className="btn btn-ghost" href={program.templateRepo} target="_blank" rel="noreferrer"><svg viewBox="0 0 24 24" width={15} height={15} fill="currentColor" aria-hidden="true"><path d={siGithub.path} /></svg>Template repo</a>}
          <a className="btn btn-ghost" href={programHref}><BookOpen size={15} strokeWidth={1.75} aria-hidden="true" />The sessions</a>
        </div>

        <h2 className="hk-subhead"><Terminal size={18} strokeWidth={1.75} aria-hidden="true" />Install</h2>
        <p>The archive is a <code>.claude/skills/</code> directory and nothing else, so it drops into an existing project without touching anything already there.</p>
        <pre className="sk-install"><code>{`curl -fsSLO ${SITE}/skills/${manifest.all.file}\nunzip -o ${manifest.all.file} -d .\nrm ${manifest.all.file}`}</code></pre>
        <p className="hk-note">Want just one session? Each below has its own bundle, and every skill links to its raw <code>SKILL.md</code>.</p>

        <h2 className="hk-subhead"><Package size={18} strokeWidth={1.75} aria-hidden="true" />By session</h2>
        {program.sessions.map((w) => {
          const kit = manifest.sessions[w.slug];
          if (!kit) return null;
          const list = (w.skills || []).map((name) => byName.get(name)).filter(Boolean);
          return (
            <section key={w.slug} className="sk-session">
              <div className="sk-session-head">
                <span className="sk-session-n">{w.n}</span>
                <div><h3><a href={`${programHref}/${w.slug}`}>{w.eventTitle}</a></h3><p className="sk-session-meta">{sessionDateLabel(w)} · {w.title}</p></div>
                <div className="sk-session-dl"><a className="btn btn-ghost" href={`/skills/${kit.file}`} download><Download size={14} strokeWidth={1.75} aria-hidden="true" />{kit.count} skills</a></div>
              </div>
              <ul className="sk-list">
                {list.map((skill) => <li key={skill.name}><p className="sk-name"><code>/{skill.name}</code><a href={`/skills/${skill.name}/SKILL.md`} className="sk-raw"><FileCode2 size={12} strokeWidth={1.75} aria-hidden="true" />SKILL.md</a></p><p className="sk-desc">{skill.description}</p></li>)}
              </ul>
              <p className="sk-session-links">
                {guideFor(program.slug, w.slug) && <a href={`${programHref}/${w.slug}/guide`}><BookOpen size={13} strokeWidth={1.75} aria-hidden="true" />Follow-along guide</a>}
                {deckFor(program.slug, w.slug) && <a href={`${programHref}/${w.slug}/deck`}><Presentation size={13} strokeWidth={1.75} aria-hidden="true" />Slides</a>}
              </p>
            </section>
          );
        })}

        <h2 className="hk-subhead">Questions people ask</h2>
        <div className="hk-faq">
          <div className="hk-faq-item"><h3>Do I have to attend to use these?</h3><p>No. They&apos;re published so anyone can run the process, now or years from now.</p></div>
          <div className="hk-faq-item"><h3>Do they only work in Claude Code?</h3><p>No. They&apos;re markdown with frontmatter — anything that reads a skills directory runs them.</p></div>
          <div className="hk-faq-item"><h3>Can I change them?</h3><p>Yes, and you should. They&apos;re opinionated on purpose — edit them to fit your product and workflow.</p></div>
          <div className="hk-faq-item"><h3>What&apos;s the catch?</h3><p>None. Ship AI is a free community meetup in Phoenix.</p></div>
        </div>

        <div className="hk-discord"><svg viewBox="0 0 24 24" width={22} height={22} fill="currentColor" aria-hidden="true"><path d={siDiscord.path} /></svg><div><h3>Ran one and it did something odd?</h3><p>Say so in Discord. These files improve on what people hit running them for real.</p></div><a className="btn btn-solid" href={DISCORD} target="_blank" rel="noreferrer">Join the Discord</a></div>
      </main>

      <footer className="footer">
        <div className="brand"><img src="/logo-icon.png" alt="" width={22} height={22} /><span>Ship AI</span></div>
        <nav><a href="/">Home</a><a href="/programs">Programs</a><a href={programHref}>{program.name}</a>{program.hasHackathon && <a href={program.hackathonHref}>Hackathon</a>}{program.templateRepo && <a href={program.templateRepo} target="_blank" rel="noreferrer"><svg viewBox="0 0 24 24" width={14} height={14} fill="currentColor" aria-hidden="true"><path d={siGithub.path} /></svg></a>}</nav>
        <p className="fine">© 2026 Ship AI</p>
      </footer>
    </>
  );
}
