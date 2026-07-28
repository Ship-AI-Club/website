/* Why this exists: give admins one operational view for judge coverage and mentor rotations. */

import { ClipboardList, Gavel, UsersRound } from "lucide-react";

import { requireAdmin } from "../../../lib/auth";
import {
  allMentorAssignments,
  allSubmissions,
  allTeams,
  judgesFor,
  usersWithRole,
} from "../../../lib/store";
import {
  AssignJudgeForm,
  AssignMentorForm,
  AutoAssignJudgesForm,
  NotifyJudgesForm,
  UnassignJudgeForm,
  UnassignMentorForm,
} from "../assignment-form";

export const metadata = {
  title: "Assignments — Ship AI",
  robots: { index: false, follow: false },
};

export const dynamic = "force-dynamic";

export default async function Page() {
  const admin = await requireAdmin();
  void admin;

  const [submissions, judges, teams, mentors, mentorAssignments] = await Promise.all([
    allSubmissions({ status: "submitted" }),
    usersWithRole("judge"),
    allTeams(),
    usersWithRole("mentor"),
    allMentorAssignments(),
  ]);
  const judgeLists = await Promise.all(submissions.map((submission) => judgesFor(submission.id)));

  const mentorsByTeam = new Map();
  for (const assignment of mentorAssignments) {
    const current = mentorsByTeam.get(assignment.team_id) || [];
    current.push(assignment);
    mentorsByTeam.set(assignment.team_id, current);
  }

  return (
    <>
      <div className="ac-head">
        <p className="ac-kicker">Admin / operations</p>
        <h1>Assignments</h1>
        <p>Keep every submitted entry covered and every team’s mentor rotation legible.</p>
      </div>

      <div className="ac-cards">
        <section className="ac-card">
          <div className="ac-card-head">
            <Gavel size={18} strokeWidth={1.75} aria-hidden="true" />
            <h2>Judge operations</h2>
          </div>
          <AutoAssignJudgesForm />
        </section>
        <section className="ac-card">
          <div className="ac-card-head">
            <ClipboardList size={18} strokeWidth={1.75} aria-hidden="true" />
            <h2>Judge notifications</h2>
          </div>
          <NotifyJudgesForm />
        </section>
      </div>

      <section className="ac-card">
        <div className="ac-card-head">
          <Gavel size={18} strokeWidth={1.75} aria-hidden="true" />
          <h2>Submitted entries</h2>
          <span className="ac-pill is-live">{submissions.length}</span>
        </div>
        {submissions.length ? (
          <div className="ac-list">
            {submissions.map((submission, index) => {
              const currentJudges = judgeLists[index];
              return (
                <div key={submission.id} className="ac-card">
                  <div className="ac-card-head">
                    <h3>{submission.project || "Untitled project"}</h3>
                    <span className="ac-pill is-ok">submitted</span>
                  </div>
                  <p className="ac-fine">
                    {submission.team_name || "Unnamed team"} · {currentJudges.length} judge{currentJudges.length === 1 ? "" : "s"}
                  </p>
                  {currentJudges.length ? (
                    <ul className="ac-list">
                      {currentJudges.map((judge) => (
                        <li key={judge.id}>
                          <strong>{judge.name || judge.email}</strong>
                          {judge.email && <span className="ac-sub">{judge.email}</span>}
                          <div className="ac-list-end">
                            <UnassignJudgeForm submissionId={submission.id} judgeId={judge.id} />
                          </div>
                        </li>
                      ))}
                    </ul>
                  ) : (
                    <div className="ac-empty">
                      <strong>No judges assigned</strong>
                      Assign a judge below or run auto-assign to cover submitted entries.
                    </div>
                  )}
                  <AssignJudgeForm submissionId={submission.id} judges={judges} />
                </div>
              );
            })}
          </div>
        ) : (
          <div className="ac-empty">
            <strong>No submitted entries</strong>
            Judge assignments will appear here after teams submit their entries.
          </div>
        )}
      </section>

      <section className="ac-card">
        <div className="ac-card-head">
          <UsersRound size={18} strokeWidth={1.75} aria-hidden="true" />
          <h2>Mentor rotations</h2>
          <span className="ac-pill is-live">{teams.length}</span>
        </div>
        {teams.length ? (
          <div className="ac-list">
            {teams.map((team) => {
              const currentMentors = mentorsByTeam.get(team.id) || [];
              return (
                <div key={team.id} className="ac-card">
                  <div className="ac-card-head">
                    <h3>{team.name}</h3>
                    {team.submission_id ? <span className="ac-pill is-live">has submission</span> : <span className="ac-pill is-off">no submission</span>}
                  </div>
                  <p className="ac-fine">
                    {team.member_count ?? 0} member{team.member_count === 1 ? "" : "s"}
                    {team.project ? ` · ${team.project}` : ""}
                  </p>
                  {currentMentors.length ? (
                    <ul className="ac-list">
                      {currentMentors.map((assignment) => (
                        <li key={`${assignment.team_id}:${assignment.mentor_id}`}>
                          <strong>{assignment.mentor_name}</strong>
                          <span className="ac-sub">{assignment.slot || "No slot set"}</span>
                          <div className="ac-list-end">
                            <UnassignMentorForm teamId={assignment.team_id} mentorId={assignment.mentor_id} />
                          </div>
                        </li>
                      ))}
                    </ul>
                  ) : (
                    <div className="ac-empty">
                      <strong>No mentors assigned</strong>
                      Pick a mentor and an optional rotation slot below.
                    </div>
                  )}
                  <AssignMentorForm teamId={team.id} mentors={mentors} />
                </div>
              );
            })}
          </div>
        ) : (
          <div className="ac-empty">
            <strong>No teams yet</strong>
            Mentor rotations will appear here after teams are formed.
          </div>
        )}
      </section>
    </>
  );
}
