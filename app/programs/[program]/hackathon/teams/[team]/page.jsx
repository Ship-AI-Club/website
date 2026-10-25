import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, ExternalLink } from "lucide-react";
import MobileNav from "../../../../../../components/mobile-nav";
import { publicTeam, publicTeamPath, HACKATHON_PATH } from "../../../../../../lib/public-teams";
import { EVENT } from "../../../../../../lib/hackathon";
import { safeUrl } from "../../../../../../lib/accounts";
import { PITCH_FIELDS, customPitchDeckUrl, submissionPitchMode } from "../../../../../../lib/submissions";
import "../../../../../../components/hackathon-teams.css";
import { Lockup } from "../../../../../../components/seal";

export const dynamic = "force-dynamic";

export async function generateMetadata({ params }) {
  const { program, team: slug } = await params;
  const team = program === "zero-to-launch" ? await publicTeam(slug) : null;
  if (!team) return { title: "Team not found — Ship AI", robots: { index: false, follow: false } };
  return {
    title: `${team.name} — ${EVENT.name}`,
    description: team.summary?.slice(0, 160) || `Meet ${team.name} at ${EVENT.name}. View their team and project.`,
    alternates: { canonical: `https://www.shipai.club${publicTeamPath(team)}` },
  };
}

export default async function Page({ params }) {
  const { program, team: slug } = await params;
  if (program !== "zero-to-launch") notFound();
  const team = await publicTeam(slug);
  if (!team) notFound();
  const deck = customPitchDeckUrl(team.pitch) || (team.submitted && submissionPitchMode(team.pitch) === "generated" ? `${publicTeamPath(team)}/deck` : "");
  const logo = safeUrl(team.logo_url);
  return <>
    <header className="nav">
      <Lockup />
      <nav><Link href={HACKATHON_PATH}>Hackathon</Link><Link href={`${HACKATHON_PATH}#teams`}>All teams</Link></nav>
      <Link href="/dashboard" className="btn btn-ghost nav-cta">Your dashboard</Link><MobileNav />
    </header>
    <main className="ht-detail">
      <Link className="ht-back" href={`${HACKATHON_PATH}#teams`}><ArrowLeft size={15} aria-hidden="true" /> All teams</Link>
      <header className="ht-detail-header">
        <p className="eyebrow">{EVENT.name} · {EVENT.datesShort}</p>
        <div className="ht-detail-title"><span className="ht-team-mark" aria-hidden="true">{logo ? <img src={logo} alt="" /> : team.name.charAt(0).toUpperCase()}</span><h1>{team.name}</h1></div>
        {team.tagline && <p className="ht-detail-tagline">{team.tagline}</p>}
      </header>

      <section className="ht-detail-section" aria-labelledby="ht-project-title">
        <span className={`ht-status${team.submitted ? " is-submitted" : ""}`}>{team.submitted ? "Submitted project" : "Building"}</span>
        <h2 id="ht-project-title">{team.submitted ? team.project || "The project" : "Project coming soon"}</h2>
        {team.submitted ? <>
          {team.summary && <p className="ht-detail-copy">{team.summary}</p>}
          <div className="ht-project-links">
            {safeUrl(team.live_url) && <a className="btn btn-solid" href={safeUrl(team.live_url)} target="_blank" rel="noreferrer">Open site <ExternalLink size={14} aria-hidden="true" /></a>}
            {deck && <a className="btn btn-ghost" href={deck} target="_blank" rel="noreferrer">Open pitch deck <ExternalLink size={14} aria-hidden="true" /></a>}
            {safeUrl(team.repo_url) && <a className="btn btn-ghost" href={safeUrl(team.repo_url)} target="_blank" rel="noreferrer">View code <ExternalLink size={14} aria-hidden="true" /></a>}
          </div>
          {[["What they shipped", team.launch], ["Receipts", team.receipts], ...PITCH_FIELDS.map(field => [field.name, team.pitch?.[field.key]])].filter(([, value]) => value).map(([label, value]) => <div key={label}><h3>{label}</h3><p className="ht-detail-copy">{value}</p></div>)}
        </> : <p className="ht-detail-copy">This team has registered and is still preparing its submission.</p>}
      </section>

      <section className="ht-detail-section" aria-labelledby="ht-members-title">
        <h2 id="ht-members-title">The team</h2>
        <p className="ht-detail-count">{team.member_count} member{team.member_count === 1 ? "" : "s"}</p>
        {team.members.length ? <ul className="ht-member-list">{team.members.map((member, index) => <li key={index}>
          <span className="ht-member-avatar" aria-hidden="true">{safeUrl(member.avatar_url) ? <img src={safeUrl(member.avatar_url)} alt="" loading="lazy" /> : member.name.charAt(0).toUpperCase()}</span>
          <div><strong>{member.name}</strong>{(member.title || member.company) && <p>{[member.title, member.company].filter(Boolean).join(" · ")}</p>}</div>
        </li>)}</ul> : <p className="ht-detail-copy">Team members have not shared public profiles.</p>}
      </section>
    </main>
    <footer className="footer"><span className="fine">{EVENT.name} · Phoenix</span><Link href={`${HACKATHON_PATH}#teams`}>All teams</Link><span className="fine">© 2026 Ship AI</span></footer>
  </>;
}
