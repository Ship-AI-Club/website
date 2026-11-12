import { notFound } from "next/navigation";
import { siDiscord } from "simple-icons";
import { JsonLd } from "../../../../components/article";
import Scene from "../../../../components/scene";
import SiteFooter from "../../../../components/site-footer";
import SiteHeader from "../../../../components/site-header";
import SkillManifest, { CopyButton } from "../../../../components/skill-manifest";
import { deckFor } from "../../../../lib/decks";
import { guideFor } from "../../../../lib/guides";
import { PROGRAMS, programBySlug } from "../../../../lib/programs";
import { DISCORD } from "../../../../lib/hackathon";
import registry from "../../../../lib/skills.generated.json";
import { ogImage } from "../../../../lib/og";
import "../../program.css";
import "../../voyage.css";
import "../../skills.css";

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
    openGraph: { title, description, url, siteName: "Ship AI", images: [ogImage({ kicker: `${program.name} · Skills`, title: `${program.name} skills`, key: "skills", tagline: "Every skill file from the program, free to download and run." })] },
  };
}

const QUESTIONS = [
  ["Do I have to attend to use these?", "No. They're published so anyone can run the process, now or years from now."],
  ["Do they only work in Claude Code?", "No. They're markdown with frontmatter — anything that reads a skills directory runs them."],
  ["Can I change them?", "Yes, and you should. They're opinionated on purpose — edit them to fit your product and workflow."],
  ["What's the catch?", "These published skill files are free to download. Ship AI also runs hands-on workshops and programs in Phoenix."],
];

/* "What it does. Use when…": the second sentence is the finding aid, so
   it stays in view on the row and the first opens with it. */
function splitDescription(description) {
  const at = description.indexOf(" Use ");
  return at > 0 ? { what: description.slice(0, at), when: description.slice(at + 1) } : { what: description, when: "" };
}

export default async function Page({ params }) {
  const { program: programSlug } = await params;
  const program = programBySlug(programSlug);
  const manifest = registry.manifest.programs?.[programSlug];
  if (!program || !manifest) notFound();

  const total = manifest.all.count;
  const programHref = `/programs/${program.slug}`;
  const description = `Every skill file from the ${program.name} program, free to download and run.`;
  const install = `curl -fsSLO ${SITE}/skills/${manifest.all.file}\nunzip -o ${manifest.all.file} -d .\nrm ${manifest.all.file}`;
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

  const sessions = program.sessions
    .filter((w) => manifest.sessions[w.slug])
    .map((w) => {
      const kit = manifest.sessions[w.slug];
      const href = `${programHref}/${w.slug}`;
      return {
        slug: w.slug,
        title: w.eventTitle,
        href,
        guideHref: guideFor(program.slug, w.slug) ? `${href}/guide` : null,
        deckHref: deckFor(program.slug, w.slug) ? `${href}/deck` : null,
        bundleHref: `/skills/${kit.file}`,
        count: kit.count,
        skills: (w.skills || [])
          .map((name) => byName.get(name))
          .filter(Boolean)
          .map((skill) => ({ name: skill.name, ...splitDescription(skill.description) })),
      };
    });

  return (
    <>
      <JsonLd data={schema} />
      <SiteHeader current="/programs" cta={<a className="btn btn-solid btn-sm nav-cta" href={DISCORD} target="_blank" rel="noreferrer"><svg viewBox="0 0 24 24" width={18} height={18} fill="currentColor" aria-hidden="true" focusable="false"><path d={siDiscord.path} /></svg>Join the Discord</a>} />

      <main>
        <section className="hero vy-hero kx-hero" aria-labelledby="kx-title">
          <p className="vy-crumb"><a href={programHref}>← {program.name}</a></p>
          <h1 className="hero-h1" id="kx-title">
            <span className="vy-name">{program.name}</span>
            {total} skills, <span className="key">free to take.</span>
          </h1>
          <p className="hero-lede">
            Every mechanical piece of the {program.sessions.length}-session program, as skill files.
            Plain markdown with frontmatter — run them in Claude Code, the Codex extension, or anything
            that reads a skills directory. No account, no signup, no expiry.
          </p>
        </section>

        <div className="kx-board-wrap">
          <aside className="window kx-board" aria-label="Download and install">
            <div className="window-bar"><b>{manifest.all.file}</b><span>{total} skills · {sessions.length} sessions</span></div>
            <div className="kx-row">
              <div className="kx-act">
                <a className="btn btn-solid" href={`/skills/${manifest.all.file}`} download>Download all {total}</a>
                {program.templateRepo && <a className="link" href={program.templateRepo} target="_blank" rel="noreferrer">Template repo</a>}
              </div>
              <div>
                <div className="kx-cmd">
                  <pre><code>{install}</code></pre>
                  <CopyButton text={install} />
                </div>
                <p className="kx-note">The archive is a <code>.claude/skills/</code> directory and nothing else, so it drops into an existing project without touching anything already there.</p>
              </div>
            </div>
          </aside>
        </div>

        <SkillManifest total={total} sessions={sessions} />

        <section className="section kx-faq" aria-labelledby="kx-faq-title">
          <div className="section-head"><h2 id="kx-faq-title">Questions people ask</h2></div>
          <ul>
            {QUESTIONS.map(([question, answer]) => <li key={question}><h3>{question}</h3><p>{answer}</p></li>)}
          </ul>
        </section>

        <section className="band" aria-labelledby="kx-final-title">
          <Scene scene="stars" mode="ascii" band className="band-bg" />
          <div className="final">
            <h2 id="kx-final-title">Ran one and it did <span className="key">something odd?</span></h2>
            <p className="lede">Say so in Discord. These files improve on what people hit running them for real.</p>
            <div className="cta-row">
              <a className="btn btn-solid" href={DISCORD} target="_blank" rel="noreferrer">Join the Discord</a>
              <a className="btn btn-ghost" href={programHref}>All {program.name} sessions</a>
            </div>
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
