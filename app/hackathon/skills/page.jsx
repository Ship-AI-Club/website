import { BookOpen, Download, FileCode2, Package, Presentation, Terminal } from "lucide-react";
import { siDiscord, siGithub } from "simple-icons";
import { JsonLd } from "../../../components/article";
import { GUIDES } from "../../../lib/guides";
import { DECKS } from "../../../lib/decks";
import { DISCORD, EVENT, TEMPLATE_REPO, WORKSHOPS } from "../../../lib/hackathon";
import registry from "../../../lib/skills.generated.json";

const SITE = "https://www.shipai.club";

export const metadata = {
  title: "Zero to Launch skills — Ship AI",
  description:
    "The full set of go-to-market skill files from the Zero to Launch program, free to download. Plain markdown for Claude Code, the Codex extension, or anything that reads a skills directory.",
  alternates: { canonical: `${SITE}/hackathon/skills` },
  openGraph: {
    title: "Zero to Launch skills — Ship AI",
    description:
      "Every GTM skill file from the six-session program, free. Positioning, outbound, analytics, site craft, paid, pricing.",
    url: `${SITE}/hackathon/skills`,
    siteName: "Ship AI",
  },
};

const byName = new Map(registry.skills.map((s) => [s.name, s]));

export default function Page() {
  const total = registry.skills.length;

  const schema = {
    "@context": "https://schema.org",
    "@type": "SoftwareApplication",
    name: "Zero to Launch skills",
    applicationCategory: "DeveloperApplication",
    operatingSystem: "Any",
    description: metadata.description,
    url: `${SITE}/hackathon/skills`,
    downloadUrl: `${SITE}/skills/${registry.manifest.all.file}`,
    offers: { "@type": "Offer", price: "0", priceCurrency: "USD" },
    author: { "@type": "Organization", name: "Ship AI", url: SITE },
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
          <a href="/hackathon/workshops">Workshops</a>
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

      <main className="sk">
        <p className="kicker">Zero to Launch · {EVENT.seriesRange}</p>
        <h1 className="sk-h1">
          {total} go-to-market skills,
          <br />
          free to take.
        </h1>
        <p className="article-lede">
          Every mechanical piece of the six-session program, packaged as skill files. Plain
          markdown with frontmatter — they run in Claude Code, the Codex extension, or anything
          else that reads a skills directory. Download the set, unzip at your project root, and
          run them by name. No account, no signup, no expiry.
        </p>

        <div className="sk-top">
          <a className="btn btn-solid" href={`/skills/${registry.manifest.all.file}`} download>
            <Download size={16} strokeWidth={1.75} aria-hidden="true" />
            Download all {total}
          </a>
          <a className="btn btn-ghost" href={TEMPLATE_REPO} target="_blank" rel="noreferrer">
            <svg viewBox="0 0 24 24" width={15} height={15} fill="currentColor" aria-hidden="true">
              <path d={siGithub.path} />
            </svg>
            Template repo
          </a>
          <a className="btn btn-ghost" href="/hackathon/workshops">
            <BookOpen size={15} strokeWidth={1.75} aria-hidden="true" />
            The sessions
          </a>
        </div>

        <h2 className="hk-subhead">
          <Terminal size={18} strokeWidth={1.75} aria-hidden="true" />
          Install
        </h2>
        <p>
          The archive contains a <code>.claude/skills/</code> directory and nothing else, so it
          drops into an existing project without touching anything you already have.
        </p>
        <pre className="sk-install">
          <code>
            {`curl -fsSLO ${SITE}/skills/${registry.manifest.all.file}
unzip -o ${registry.manifest.all.file} -d .
rm ${registry.manifest.all.file}`}
          </code>
        </pre>
        <p className="hk-note">
          Prefer one session&apos;s worth? Every session below has its own bundle. Prefer a single
          file? Each skill links to its raw <code>SKILL.md</code> — save it to{" "}
          <code>.claude/skills/&lt;name&gt;/SKILL.md</code> and it works the same.
        </p>

        <h2 className="hk-subhead">
          <Package size={18} strokeWidth={1.75} aria-hidden="true" />
          By session
        </h2>

        {WORKSHOPS.map((w) => {
          const kit = registry.manifest.sessions[w.slug];
          if (!kit) return null;
          const list = (w.skills || []).map((n) => byName.get(n)).filter(Boolean);
          return (
            <section key={w.slug} className="sk-session">
              <div className="sk-session-head">
                <span className="sk-session-n">{w.n}</span>
                <div>
                  <h3>
                    <a href={`/hackathon/workshops/${w.slug}`}>{w.eventTitle}</a>
                  </h3>
                  <p className="sk-session-meta">
                    {w.date}, 2026 · {w.title}
                  </p>
                </div>
                <div className="sk-session-dl">
                  <a className="btn btn-ghost" href={`/skills/${kit.file}`} download>
                    <Download size={14} strokeWidth={1.75} aria-hidden="true" />
                    {kit.count} skills
                  </a>
                </div>
              </div>

              <ul className="sk-list">
                {list.map((s) => (
                  <li key={s.name}>
                    <p className="sk-name">
                      <code>/{s.name}</code>
                      <a href={`/skills/${s.name}/SKILL.md`} className="sk-raw">
                        <FileCode2 size={12} strokeWidth={1.75} aria-hidden="true" />
                        SKILL.md
                      </a>
                    </p>
                    <p className="sk-desc">{s.description}</p>
                  </li>
                ))}
              </ul>

              <p className="sk-session-links">
                {GUIDES[w.slug] && (
                  <a href={`/hackathon/workshops/${w.slug}/guide`}>
                    <BookOpen size={13} strokeWidth={1.75} aria-hidden="true" />
                    Follow-along guide
                  </a>
                )}
                {DECKS[w.slug] && (
                  <a href={`/hackathon/workshops/${w.slug}/deck`}>
                    <Presentation size={13} strokeWidth={1.75} aria-hidden="true" />
                    Slides
                  </a>
                )}
              </p>
            </section>
          );
        })}

        <h2 className="hk-subhead">Questions people actually ask</h2>
        <div className="hk-faq">
          <div className="hk-faq-item">
            <h3>Do I have to attend to use these?</h3>
            <p>
              No. They&apos;re published so anyone can run the process — during the program, or
              years from now. The sessions add judgement and a room; the skills do the mechanical
              half either way.
            </p>
          </div>
          <div className="hk-faq-item">
            <h3>Do they only work in Claude Code?</h3>
            <p>
              They&apos;re markdown files with a name and a description in frontmatter. Anything
              that reads a skills directory can run them, and worst case you paste one into a chat
              and it still works — it&apos;s a well-written instruction either way.
            </p>
          </div>
          <div className="hk-faq-item">
            <h3>Can I change them?</h3>
            <p>
              Yes, and you should. They&apos;re opinionated on purpose. Fork the{" "}
              <a href={TEMPLATE_REPO} target="_blank" rel="noreferrer">template repo</a>, or just
              edit the files after you unzip them.
            </p>
          </div>
          <div className="hk-faq-item">
            <h3>What&apos;s the catch?</h3>
            <p>
              None. Ship AI is a free community meetup in Phoenix. If they&apos;re useful, come to
              a Wednesday or say so in Discord.
            </p>
          </div>
        </div>

        <div className="hk-discord">
          <svg viewBox="0 0 24 24" width={22} height={22} fill="currentColor" aria-hidden="true">
            <path d={siDiscord.path} />
          </svg>
          <div>
            <h3>Ran one and it did something odd?</h3>
            <p>
              Say so in Discord. These get edited based on what actually happens when people run
              them, and the site rebuilds from the same files.
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
