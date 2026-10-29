import Link from "next/link";
import { ArrowLeft, ArrowRight, Check, ExternalLink } from "lucide-react";

import { requireRole, isAdmin } from "../../../lib/auth";
import { presentationQueue } from "../../../lib/presentations";
import { PITCH_FIELDS, customPitchDeckUrl, submissionPitchMode } from "../../../lib/submissions";
import { safeUrl } from "../../../lib/accounts";
import { CURRENT_HACKATHON_ID, HACKATHONS, cardTotal, hackathonById, judgingRubric, scoreValues } from "../../../lib/hackathons";
import { FW_SUBMISSION_FIELDS } from "../../../lib/founder-weekend-submissions";
import Scorecard from "../scorecard";
import { savePresentationScoreAction } from "../actions";
import TeamSelect from "./team-select";
import "./presentations.css";

export const dynamic = "force-dynamic";
export const metadata = {
  title: "Presentation order — Ship AI",
  robots: { index: false, follow: false },
};

function card(entry) {
  return { design: entry.design, craft: entry.craft, receipts: entry.score_receipts, criteria: entry.criteria };
}

export default async function Page({ searchParams }) {
  const user = await requireRole("judge", "/judge/presentations");
  const query = await searchParams;
  const hackathon = hackathonById(query?.event) ?? hackathonById(CURRENT_HACKATHON_ID);
  const queue = await presentationQueue(user.id, hackathon.id);
  const link = (team) => `/judge/presentations?event=${hackathon.id}&team=${team}`;
  const scoring = judgingRubric(hackathon);
  const evidence = (item) => hackathon.criteriaColumn
    ? FW_SUBMISSION_FIELDS.filter((f) => f.key === "socials").map((f) => [f.name, item.pitch?.[f.key]])
    : [...PITCH_FIELDS.map(field => [field.name, item.pitch?.[field.key]]), ["What they shipped", item.launch], ["Receipts", item.receipts]];
  const selected = queue.findIndex(entry => entry.id === query?.team);
  const index = selected < 0 ? 0 : selected;
  const entry = queue[index];
  const completed = queue.filter(item => item.scored_at && !item.conflict).length;
  const eligible = queue.filter(item => !item.conflict).length;

  return (
    <>
      <div className="ac-head">
        <p className="ac-kicker">{hackathon.name} · Shared judging lineup</p>
        <h1>Presentation order</h1>
        <p>Submitted projects, in submission order for every judge. Open the site and deck, score the project, then move to the next team.</p>
      </div>

      <nav className="ac-actions" aria-label="Choose a hackathon">
        {HACKATHONS.map((h) => (
          <Link key={h.id} className={`btn ${h.id === hackathon.id ? "btn-solid" : "btn-ghost"} ac-btn-sm`} href={`/judge/presentations?event=${h.id}`} aria-current={h.id === hackathon.id ? "page" : undefined}>{h.name}</Link>
        ))}
      </nav>

      {!entry ? (
        <div className="ac-empty">
          <strong>No submitted projects yet.</strong>
          Projects appear here as soon as their teams submit. Refresh to check for new entries.
        </div>
      ) : (
        <>
          <section className="ac-card pr-lineup" aria-label="Presentation lineup">
            <div className="ac-card-head">
              <h2>{queue.length} submitted project{queue.length === 1 ? "" : "s"}</h2>
              <span className="ac-pill">Your scores: {completed} / {eligible}</span>
            </div>
            <TeamSelect hackathonId={hackathon.id} entries={queue.map(item => ({ id: item.id, team: item.team_name, project: item.project, scored: Boolean(item.scored_at), conflict: item.conflict }))} selected={entry.id} />
            <nav className="pr-navigation" aria-label="Move between teams">
              {index > 0 ? <Link href={link(queue[index - 1].id)}><ArrowLeft size={16} aria-hidden="true" /> Previous team</Link> : <span />}
              <span>{index + 1} of {queue.length}</span>
              {index + 1 < queue.length ? <Link href={link(queue[index + 1].id)}>Next team <ArrowRight size={16} aria-hidden="true" /></Link> : <span>End of lineup</span>}
            </nav>
          </section>

          <section className="ac-card pr-entry" aria-labelledby="project-title">
            <div className="pr-project-heading">
              <span className="pr-number">{String(index + 1).padStart(2, "0")}</span>
              <div>
                <p className="ac-kicker">{entry.team_name}</p>
                <h2 id="project-title">{entry.project || "Untitled project"}</h2>
                {entry.members.length > 0 && <p className="ac-fine">{entry.members.join(", ")}</p>}
              </div>
            </div>
            {entry.summary && <p className="pr-summary">{entry.summary}</p>}
            <div className="ac-actions pr-links">
              {safeUrl(entry.live_url) ? <a className="btn btn-solid" href={safeUrl(entry.live_url)} target="_blank" rel="noreferrer">Open site <ExternalLink size={15} aria-hidden="true" /></a> : <span className="ac-pill is-warn">No site link</span>}
              {customPitchDeckUrl(entry.pitch) ? (
                <a className="btn btn-ghost" href={customPitchDeckUrl(entry.pitch)} target="_blank" rel="noreferrer">Open deck <ExternalLink size={15} aria-hidden="true" /></a>
              ) : submissionPitchMode(entry.pitch) === "generated" ? (
                <a className="btn btn-ghost" href={`/judge/presentations/${entry.id}/deck`} target="_blank" rel="noreferrer">Open deck <ExternalLink size={15} aria-hidden="true" /></a>
              ) : <span className="ac-pill">No deck shared</span>}
              {hackathon.criteriaColumn && safeUrl(entry.pitch?.marketing_url) && <a className="ac-btn-link" href={safeUrl(entry.pitch.marketing_url)} target="_blank" rel="noreferrer">Marketing site <ExternalLink size={14} aria-hidden="true" /></a>}
              {safeUrl(entry.repo_url) && <a className="ac-btn-link" href={safeUrl(entry.repo_url)} target="_blank" rel="noreferrer">Repository <ExternalLink size={14} aria-hidden="true" /></a>}
            </div>
            <details className="pr-evidence">
              <summary>Read submission and evidence</summary>
              <dl className="ac-dl">
                {evidence(entry).filter(([, value]) => value).map(([label, value]) => <div key={label}><dt>{label}</dt><dd>{value}</dd></div>)}
              </dl>
            </details>
          </section>

          {entry.conflict ? (
            <p className="ac-error">You are a member of this team, so you cannot score its project. Use Next team to continue.</p>
          ) : (
            <section className="ac-card" aria-labelledby="score-title">
              <div className="ac-card-head">
                <h2 id="score-title">Your score</h2>
                {entry.scored_at && <span className="ac-pill is-ok"><Check size={13} aria-hidden="true" /> Saved · {cardTotal(hackathon, card(entry))?.toFixed(1)} / {hackathon.scoreMax}</span>}
              </div>
              <Scorecard key={entry.id} submissionId={entry.id} card={{ ...scoreValues(hackathon, card(entry)), notes: entry.notes }} filed={Boolean(entry.scored_at)} saveAction={savePresentationScoreAction} hasNext={index + 1 < queue.length} hackathonId={hackathon.id} {...scoring} />
            </section>
          )}
          {completed === eligible && eligible > 0 && <p className="ac-ok" role="status">You have scored all {eligible} eligible projects. You can still review and update your cards.</p>}
        </>
      )}
      <p className="ac-fine">Scores are saved separately for each judge.{isAdmin(user) && <> <Link href="/admin/scores">View the leaderboard</Link></>}</p>
    </>
  );
}
