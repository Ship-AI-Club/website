import Link from "next/link";
import { ArrowRight, Users } from "lucide-react";
import { publicTeams, publicTeamPath } from "../lib/public-teams";
import { safeUrl } from "../lib/accounts";
import "./hackathon-teams.css";

export default async function HackathonTeams() {
  const teams = await publicTeams();
  const submitted = teams.filter(team => team.submitted).length;
  return (
    <section className="section ht-directory" id="teams" aria-labelledby="ht-teams-title">
      <div className="ht-directory-head">
        <div><p className="eyebrow">The builders and their projects</p><h2 id="ht-teams-title">Meet the teams</h2></div>
        <p className="ht-directory-count">{teams.length} teams · {submitted} submitted projects</p>
      </div>
      {teams.length ? <ul className="ht-team-grid">
        {teams.map(team => <li key={team.slug}>
          <Link className="ht-team-card" href={publicTeamPath(team)}>
            <div className="ht-team-top">
              <span className="ht-team-mark" aria-hidden="true">{safeUrl(team.logo_url) ? <img src={safeUrl(team.logo_url)} alt="" loading="lazy" /> : team.name.charAt(0).toUpperCase()}</span>
              <span className={`ht-status${team.submitted ? " is-submitted" : ""}`}>{team.submitted ? "Submitted" : "Building"}</span>
            </div>
            <h3>{team.name}</h3>
            <p className="ht-team-project">{team.submitted ? team.project || "Submitted project" : team.tagline || "Project not submitted yet"}</p>
            <div className="ht-team-bottom">
              <span><Users size={14} aria-hidden="true" /> {team.member_count} member{team.member_count === 1 ? "" : "s"}</span>
              <span className="ht-view-team">View team <ArrowRight size={15} aria-hidden="true" /></span>
            </div>
          </Link>
        </li>)}
      </ul> : <p className="section-lede">Teams will appear here as they register.</p>}
    </section>
  );
}
