"use client";

import { useActionState } from "react";
import { useFormStatus } from "react-dom";

import { TRACKS } from "../../../lib/accounts";
import { saveSubmissionAction } from "../actions";

/* ------------------------------------------------------------------
   The submission.

   Same nine fields the /hackathon/submit page has always described,
   now filed against the team's account instead of a GitHub issue.
   Two buttons: save a draft, or file it. Filing is not final — the
   entry stays editable until the deadline, which is deliberate,
   because the alternative is teams sitting on a finished submission
   until 11:58 in case they think of something better.
------------------------------------------------------------------ */

function Buttons({ submitted, open }) {
  const { pending } = useFormStatus();
  if (!open) return null;

  return (
    <div className="ac-actions">
      <button
        type="submit"
        name="intent"
        value="submit"
        className="btn btn-solid"
        disabled={pending}
      >
        {pending ? "Saving…" : submitted ? "Save changes" : "Submit the project"}
      </button>
      {!submitted && (
        <button
          type="submit"
          name="intent"
          value="draft"
          className="btn btn-ghost"
          disabled={pending}
        >
          Save as draft
        </button>
      )}
    </div>
  );
}

export default function SubmissionForm({ submission, categories, deadline, open }) {
  const [state, action] = useActionState(saveSubmissionAction, {});
  const value = (key) => state[key] ?? submission?.[key] ?? "";
  const submitted = submission?.status === "submitted";

  return (
    <form action={action} className="ac-form">
      {state.error && (
        <p className="ac-error" role="alert">
          {state.error}
        </p>
      )}
      {state.ok && <p className="ac-ok">{state.ok}</p>}

      {!open && (
        <p className="ac-note">
          Submissions closed at {deadline}. This is your entry as it stood — it can&apos;t be
          edited now.
        </p>
      )}

      <fieldset disabled={!open} style={{ border: 0, display: "grid", gap: "2rem" }}>
        <div className="ac-field">
          <label className="ac-label" htmlFor="project">
            Project name <span className="ac-req">required</span>
          </label>
          <p className="ac-hint">What it&apos;s called.</p>
          <input id="project" name="project" type="text" defaultValue={value("project")} />
        </div>

        <div className="ac-row">
          <div className="ac-field">
            <label className="ac-label" htmlFor="track">
              Track
            </label>
            <select id="track" name="track" defaultValue={value("track") || "undecided"}>
              {TRACKS.map((t) => (
                <option key={t.id} value={t.id}>
                  {t.label}
                </option>
              ))}
            </select>
          </div>

          <div className="ac-field">
            <label className="ac-label" htmlFor="category">
              Category <span className="ac-req">required</span>
            </label>
            <p className="ac-hint">
              One per team. Win it and you&apos;re out of the running for the others.
            </p>
            <select id="category" name="category" defaultValue={value("category")}>
              <option value="">Pick one…</option>
              {categories.map((c) => (
                <option key={c.name} value={c.name}>
                  {c.name}
                </option>
              ))}
            </select>
          </div>
        </div>

        <div className="ac-field">
          <label className="ac-label" htmlFor="live_url">
            Live URL <span className="ac-req">required</span>
          </label>
          <p className="ac-hint">
            Publicly reachable, working, not behind a login. This is the one field with no
            substitute — an entry without a live URL cannot place. Open it in a private window
            before you file.
          </p>
          <input
            id="live_url"
            name="live_url"
            type="text"
            inputMode="url"
            placeholder="https://"
            defaultValue={value("live_url")}
          />
        </div>

        <div className="ac-field">
          <label className="ac-label" htmlFor="summary">
            What it does
          </label>
          <p className="ac-hint">Two or three sentences. What it is and who it&apos;s for.</p>
          <textarea id="summary" name="summary" rows={3} defaultValue={value("summary")} />
        </div>

        <div className="ac-field">
          <label className="ac-label" htmlFor="launch">
            What you launched this weekend
          </label>
          <p className="ac-hint">
            The launch itself — where, to whom, when. Link the post, the listing, the email,
            the thread. Whatever the launch actually was.
          </p>
          <textarea id="launch" name="launch" rows={4} defaultValue={value("launch")} />
        </div>

        <div className="ac-field">
          <label className="ac-label" htmlFor="receipts">
            Receipts <span className="ac-req">required</span>
          </label>
          <p className="ac-hint">
            Numbers with evidence you can put on screen Sunday: visitors, signups, revenue,
            replies, conversion. Small and true beats big and vague — and zero is a real
            answer if you can say what you learned from it.
          </p>
          <textarea id="receipts" name="receipts" rows={5} defaultValue={value("receipts")} />
        </div>

        <div className="ac-field">
          <label className="ac-label" htmlFor="growth">
            Growth engine
          </label>
          <p className="ac-hint">
            The one channel you&apos;d run again next month. How it works, what it produced
            this weekend, and why it repeats without a hero effort.
          </p>
          <textarea id="growth" name="growth" rows={4} defaultValue={value("growth")} />
        </div>

        <div className="ac-field">
          <label className="ac-label" htmlFor="repo_url">
            Repo <span className="ac-opt">optional</span>
          </label>
          <p className="ac-hint">
            Open source is welcome but not required — you keep 100% of your IP.
          </p>
          <input
            id="repo_url"
            name="repo_url"
            type="text"
            inputMode="url"
            placeholder="https://github.com/…"
            defaultValue={value("repo_url")}
          />
        </div>
      </fieldset>

      <Buttons submitted={submitted} open={open} />
    </form>
  );
}
