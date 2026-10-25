import MobileNav from "../../components/mobile-nav";
import { ArrowRight, BookOpen, MapPin } from "lucide-react";
import ProgramAssessment from "../../components/program-assessment";
import ProgramExplorer from "../../components/program-explorer";
import "./programs.css";
import { JsonLd } from "../../components/article";
import { PROGRAMS, programVenueNames } from "../../lib/programs";
import { DISCORD } from "../../lib/hackathon";
import { Lockup } from "../../components/seal";

const SITE = "https://www.shipai.club";

const LIST_SCHEMA = {
  "@context": "https://schema.org",
  "@type": "ItemList",
  name: "Ship AI programs",
  itemListElement: PROGRAMS.map((program, i) => ({
    "@type": "ListItem",
    position: i + 1,
    item: {
      "@type": "EducationalOccupationalProgram",
      name: program.name,
      description: program.description,
      url: `${SITE}/programs/${program.slug}`,
      numberOfCredits: program.sessions.length,
      provider: { "@type": "Organization", name: "Ship AI", url: SITE },
      ...(program.status === "running" ? { isAccessibleForFree: true } : {}),
      ...(program.startISO ? { startDate: program.startISO } : {}),
      ...(program.endISO ? { endDate: program.endISO } : {}),
    },
  })),
};

export const metadata = {
  title: "Programs — Ship AI",
  description: "Multi-session Ship AI programs for builders in Phoenix. Learn the tools, build real projects, and develop practical AI skills.",
  alternates: { canonical: "https://www.shipai.club/programs" },
  openGraph: {
    title: "Programs — Ship AI",
    description: "Multi-session Ship AI programs for builders in Phoenix. Learn by building.",
    url: "https://www.shipai.club/programs",
    siteName: "Ship AI",
    images: [{ url: "/og-community.png", width: 1200, height: 630 }],
  },
};

export default function Page() {
  return (
    <>
      <JsonLd data={LIST_SCHEMA} />
      <header className="nav">
        <Lockup />
        <nav>
          <a href="/workshops">Workshops</a>
          <a href="/programs" aria-current="page">Programs</a>
          <a href="/programs/zero-to-launch/hackathon">Hackathon</a>
        </nav>
        <div className="nav-ctas">
          <a className="btn btn-ghost" href={DISCORD} target="_blank" rel="noreferrer">Discord</a>
          <a className="btn btn-solid" href="/dashboard">Register</a>
        </div>
      <MobileNav /></header>

      <main className="programs-page">
        <section className="programs-hero" aria-labelledby="programs-title">
          <div className="programs-intro">
            <p className="programs-eyebrow">Ship AI / Programs</p>
            <h1 id="programs-title">From first prompt<br />to <span>real progress.</span></h1>
            <p className="programs-lede">Learn in public. Ship something real. Hands-on programs that help you use AI, build a product, and take it further.</p>
            <a className="programs-primary" href="#explore-programs">Find your program <ArrowRight size={18} aria-hidden="true" /></a>
            <div className="programs-hero-meta"><span><MapPin size={15} aria-hidden="true" /> Built together in Phoenix</span><span><BookOpen size={15} aria-hidden="true" /> Published session materials</span></div>
          </div>
          <div className="programs-path">
            <p className="programs-eyebrow">A path from learning to shipping</p>
            <ol>
              {PROGRAMS.map((program, i) => <li key={program.slug}>
                <a href={`/programs/${program.slug}`}>
                  <span className="programs-path-number">0{i + 1}</span>
                  <div><span className="programs-path-stage">{["Learn the tools", "Build the product", "Take it to market", "Keep people coming back"][i]}</span><strong>{program.name}</strong></div>
                  <ArrowRight size={18} aria-hidden="true" />
                </a>
              </li>)}
            </ol>
            <p className="programs-path-note">Start where you are. You don’t need to take every program.</p>
          </div>
        </section>

        <ProgramAssessment programs={PROGRAMS.map(program => ({
          slug: program.slug, name: program.name, sessions: program.sessions.length, datesLabel: program.datesLabel,
        }))} />

        <ProgramExplorer programs={PROGRAMS.map(program => ({
          slug: program.slug, name: program.name, status: program.status,
          datesLabel: program.datesLabel,
          sessions: program.sessions.length, venues: programVenueNames(program),
        }))} />

        <aside className="programs-help">
          <div><p className="programs-eyebrow">Build with the community</p><h2>A little guidance goes a long way.</h2><p>Find your next session, ask a question, or share what you’re building with Ship AI.</p></div>
          <a className="programs-primary" href={DISCORD} target="_blank" rel="noreferrer">Join us on Discord <ArrowRight size={18} aria-hidden="true" /></a>
        </aside>
      </main>

      <footer className="footer programs-footer">
        <Lockup compact />
        <nav><a href="/">Home</a><a href="/workshops">Workshops</a>
          <a href="/programs">Programs</a><a href="/programs/zero-to-launch/hackathon">Hackathon</a></nav>
        <p className="fine">© 2026 Ship AI</p>
      </footer>
    </>
  );
}
