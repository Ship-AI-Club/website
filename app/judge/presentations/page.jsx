import Link from "next/link";
import { ArrowLeft, ArrowRight, Check, ExternalLink } from "lucide-react";

import { requireRole, isAdmin } from "../../../lib/auth";
import { presentationQueue } from "../../../lib/presentations";
import { PITCH_FIELDS, customPitchDeckUrl, submissionPitchMode } from "../../../lib/submissions";
import { weightedScore, safeUrl } from "../../../lib/accounts";
import Scorecard from "../scorecard";
import { savePresentationScoreAction } from "../actions";
import TeamSelect from "./team-select";
import "./presentations.css";

export const dynamic = "force-dynamic";
export const metadata = {
  title: "Presentation order — Ship AI",
  robots: { index: false, follow: false },
};

export default async function Page({ searchParams }) {
  const user = await requireRole("judge", "/judge/presentations");
  const [queue, query] = await Promise.all([presentationQueue(user.id), searchParams]);
  const selected = queue.findIndex(entry => entry.id === query?.team);
  const index = selected < 0 ? 0 : selected;
  const entry = queue[index];
  const completed = queue.filter(item => item.scored_at && !item.conflict).length;
  const eligible = queue.filter(item => !item.conflict).length;

  return (
    <>
      <div className="ac-head">
        <p className="ac-kicker">Shared judging lineup</p>
        <h1>Presentation order</h1>
        <p>Submitted projects, in submission order for every judge. Open the site and deck, score the project, then move to the next team.</p>
      </div>

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
            <TeamSelect entries={queue.map(item => ({ id: item.id, team: item.team_name, project: item.project, scored: Boolean(item.scored_at), conflict: item.conflict }))} selected={entry.id} />
            <nav className="pr-navigation" aria-label="Move between teams">
              {index > 0 ? <Link href={`/judge/presentations?team=${queue[index - 1].id}`}><ArrowLeft size={16} aria-hidden="true" /> Previous team</Link> : <span />}
              <span>{index + 1} of {queue.length}</span>
              {index + 1 < queue.length ? <Link href={`/judge/presentations?team=${queue[index + 1].id}`}>Next team <ArrowRight size={16} aria-hidden="true" /></Link> : <span>End of lineup</span>}
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
              {safeUrl(entry.repo_url) && <a className="ac-btn-link" href={safeUrl(entry.repo_url)} target="_blank" rel="noreferrer">Repository <ExternalLink size={14} aria-hidden="true" /></a>}
            </div>
            <details className="pr-evidence">
              <summary>Read submission and evidence</summary>
              <dl className="ac-dl">
                {[...PITCH_FIELDS.map(field => [field.name, entry.pitch?.[field.key]]), ["What they shipped", entry.launch], ["Receipts", entry.receipts]].filter(([, value]) => value).map(([label, value]) => <div key={label}><dt>{label}</dt><dd>{value}</dd></div>)}
              </dl>
            </details>
          </section>

          {entry.conflict ? (
            <p className="ac-error">You are a member of this team, so you cannot score its project. Use Next team to continue.</p>
          ) : (
            <section className="ac-card" aria-labelledby="score-title">
              <div className="ac-card-head">
                <h2 id="score-title">Your score</h2>
                {entry.scored_at && <span className="ac-pill is-ok"><Check size={13} aria-hidden="true" /> Saved · {weightedScore({ design: entry.design, craft: entry.craft, receipts: entry.score_receipts })?.toFixed(1)} / 5</span>}
              </div>
              <Scorecard key={entry.id} submissionId={entry.id} card={{ design: entry.design, craft: entry.craft, receipts: entry.score_receipts, notes: entry.notes }} filed={Boolean(entry.scored_at)} saveAction={savePresentationScoreAction} hasNext={index + 1 < queue.length} />
            </section>
          )}
          {completed === eligible && eligible > 0 && <p className="ac-ok" role="status">You have scored all {eligible} eligible projects. You can still review and update your cards.</p>}
        </>
      )}
      <p className="ac-fine">Scores are saved separately for each judge.{isAdmin(user) && <> <Link href="/admin/scores">View the leaderboard</Link></>}</p>
    </>
  );
}
