/* Why this exists: keep judge and mentor assignment mutations small, explicit, and reusable. */

"use client";

import { useActionState } from "react";
import { useFormStatus } from "react-dom";

import {
  assignJudgeAction,
  assignMentorAction,
  autoAssignJudgesAction,
  notifyJudgesAction,
  unassignJudgeAction,
  unassignMentorAction,
} from "./actions";

function Feedback({ state }) {
  return (
    <>
      {state?.error && (
        <p className="ac-error" role="alert">
          {state.error}
        </p>
      )}
      {state?.ok && <p className="ac-ok">{state.ok}</p>}
    </>
  );
}

function Submit({ label, pendingLabel = "Saving…", danger = false }) {
  const { pending } = useFormStatus();
  return (
    <button
      type="submit"
      className={danger ? "ac-btn-link ac-btn-danger ac-btn-sm" : "btn btn-solid ac-btn-sm"}
      disabled={pending}
    >
      {pending ? pendingLabel : label}
    </button>
  );
}

export function AutoAssignJudgesForm() {
  const [state, action] = useActionState(autoAssignJudgesAction, {});

  return (
    <form action={action} className="ac-form is-tight">
      <Feedback state={state} />
      <div className="ac-field">
        <label className="ac-label" htmlFor="per_entry">
          Judges per entry
        </label>
        <p className="ac-hint">Top up each submitted entry to this many judges. Existing assignments stay in place.</p>
        <input id="per_entry" name="per_entry" type="number" defaultValue={3} min={1} max={5} />
      </div>
      <div className="ac-actions">
        <Submit label="Run auto-assign" pendingLabel="Assigning…" />
      </div>
    </form>
  );
}

export function NotifyJudgesForm() {
  const [state, action] = useActionState(notifyJudgesAction, {});

  return (
    <form action={action} className="ac-form is-tight">
      <Feedback state={state} />
      <p className="ac-hint">Email every judge with their current assignment count.</p>
      <div className="ac-actions">
        <Submit label="Notify judges" pendingLabel="Sending…" />
      </div>
    </form>
  );
}

export function AssignJudgeForm({ submissionId, judges }) {
  const [state, action] = useActionState(assignJudgeAction, {});

  return (
    <form action={action} className="ac-form is-tight">
      <Feedback state={state} />
      <input type="hidden" name="submission_id" value={submissionId} />
      <div className="ac-field">
        <label className="ac-label" htmlFor={`judge-${submissionId}`}>
          Assign judge
        </label>
        <select id={`judge-${submissionId}`} name="judge_id" defaultValue="" disabled={!judges.length}>
          <option value="">{judges.length ? "Select a judge" : "No judges available"}</option>
          {judges.map((judge) => (
            <option key={judge.id} value={judge.id}>
              {judge.name || judge.email}
            </option>
          ))}
        </select>
      </div>
      <div className="ac-actions">
        <Submit label="Assign" pendingLabel="Assigning…" />
      </div>
    </form>
  );
}

export function UnassignJudgeForm({ submissionId, judgeId }) {
  const [state, action] = useActionState(unassignJudgeAction, {});

  return (
    <form action={action} className="ac-form is-tight">
      <Feedback state={state} />
      <input type="hidden" name="submission_id" value={submissionId} />
      <input type="hidden" name="judge_id" value={judgeId} />
      <div className="ac-actions">
        <Submit label="Remove" pendingLabel="Removing…" danger />
      </div>
    </form>
  );
}

export function AssignMentorForm({ teamId, mentors }) {
  const [state, action] = useActionState(assignMentorAction, {});

  return (
    <form action={action} className="ac-form is-tight">
      <Feedback state={state} />
      <input type="hidden" name="team_id" value={teamId} />
      <div className="ac-field">
        <label className="ac-label" htmlFor={`mentor-${teamId}`}>
          Assign mentor
        </label>
        <select id={`mentor-${teamId}`} name="mentor_id" defaultValue="" disabled={!mentors.length}>
          <option value="">{mentors.length ? "Select a mentor" : "No mentors available"}</option>
          {mentors.map((mentor) => (
            <option key={mentor.id} value={mentor.id}>
              {mentor.name || mentor.email}
            </option>
          ))}
        </select>
      </div>
      <div className="ac-field">
        <label className="ac-label" htmlFor={`slot-${teamId}`}>
          Slot <span className="ac-fine">optional</span>
        </label>
        <input id={`slot-${teamId}`} name="slot" type="text" placeholder="Saturday 1:00 PM" />
      </div>
      <div className="ac-actions">
        <Submit label="Assign" pendingLabel="Assigning…" />
      </div>
    </form>
  );
}

export function UnassignMentorForm({ teamId, mentorId }) {
  const [state, action] = useActionState(unassignMentorAction, {});

  return (
    <form action={action} className="ac-form is-tight">
      <Feedback state={state} />
      <input type="hidden" name="team_id" value={teamId} />
      <input type="hidden" name="mentor_id" value={mentorId} />
      <div className="ac-actions">
        <Submit label="Remove" pendingLabel="Removing…" danger />
      </div>
    </form>
  );
}
