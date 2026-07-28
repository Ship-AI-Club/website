"use client";

import { useActionState, useEffect, useState } from "react";
import { useFormStatus } from "react-dom";

import { sendBroadcastAction } from "./actions";

const DAY_LABELS = { friday: "Friday", saturday: "Saturday", sunday: "Sunday" };

function ConfirmButton() {
  const { pending } = useFormStatus();

  return (
    <button type="submit" className="btn btn-solid" disabled={pending}>
      {pending ? "Sending…" : "Confirm and send"}
    </button>
  );
}

export default function BroadcastForm({ segments, recipientCounts, day }) {
  const [state, action] = useActionState(sendBroadcastAction, {});
  const [segment, setSegment] = useState(segments[0]?.id || "");
  const [subject, setSubject] = useState("");
  const [body, setBody] = useState("");
  const [review, setReview] = useState(false);
  const count = Number(recipientCounts?.[segment]) || 0;
  const dayLabel = DAY_LABELS[day] || day;

  useEffect(() => {
    if (!state.ok) return;
    setReview(false);
    setSubject("");
    setBody("");
  }, [state]);

  function submit(event) {
    if (!review) {
      event.preventDefault();
      setReview(true);
    }
  }

  function changeSegment(event) {
    setSegment(event.target.value);
    setReview(false);
  }

  return (
    <form action={action} onSubmit={submit} className="ac-form is-tight">
      <input type="hidden" name="day" value={day} />

      {state.ok && <p className="ac-ok">{state.ok}</p>}
      {state.error && review && (
        <p className="ac-error" role="alert">
          {state.error}
        </p>
      )}

      {!review ? (
        <>
          <div className="ac-field">
            <label className="ac-label" htmlFor="broadcast-segment">
              Recipient segment
            </label>
            <select id="broadcast-segment" name="segment" value={segment} onChange={changeSegment}>
              {segments.map((item) => {
                const resolved = Number(recipientCounts?.[item.id]) || 0;
                return (
                  <option key={item.id} value={item.id}>
                    {item.label} ({resolved})
                  </option>
                );
              })}
            </select>
          </div>

          <div className="ac-field">
            <span className="ac-label">Check-in day</span>
            <p className="ac-hint">
              {dayLabel} is the default event day used when the segment is Checked in.
            </p>
          </div>

          <p className={count > 500 ? "ac-error" : "ac-note"} aria-live="polite">
            {count} resolved recipient{count === 1 ? "" : "s"}. The send is capped at 500
            recipients.
          </p>

          <div className="ac-row">
            <div className="ac-field">
              <label className="ac-label" htmlFor="broadcast-subject">
                Subject
              </label>
              <input
                id="broadcast-subject"
                name="subject"
                type="text"
                value={subject}
                onChange={(event) => setSubject(event.target.value)}
                maxLength={200}
                required
              />
            </div>
          </div>

          <div className="ac-field">
            <label className="ac-label" htmlFor="broadcast-body">
              Message
            </label>
            <textarea
              id="broadcast-body"
              name="body"
              rows={8}
              value={body}
              onChange={(event) => setBody(event.target.value)}
              required
            />
          </div>

          <div className="ac-actions">
            <button type="submit" className="btn btn-solid" disabled={!count || count > 500}>
              Review send
            </button>
            <span className="ac-fine">No message is sent at this step.</span>
          </div>
        </>
      ) : (
        <>
          <input type="hidden" name="segment" value={segment} />
          <input type="hidden" name="subject" value={subject} />
          <input type="hidden" name="body" value={body} />
          <input type="hidden" name="confirm" value="send" />

          <section className="ac-card is-accent">
            <h3>Review send</h3>
            <dl className="ac-dl">
              <div>
                <dt>Segment</dt>
                <dd>{segments.find((item) => item.id === segment)?.label || segment}</dd>
              </div>
              <div>
                <dt>Check-in day</dt>
                <dd>{dayLabel}</dd>
              </div>
              <div>
                <dt>Recipients</dt>
                <dd>
                  {count} resolved recipient{count === 1 ? "" : "s"} · cap 500
                </dd>
              </div>
              <div>
                <dt>Subject</dt>
                <dd>{subject || "(no subject)"}</dd>
              </div>
              <div>
                <dt>Message</dt>
                <dd>{body || "(empty)"}</dd>
              </div>
            </dl>
          </section>

          <div className="ac-actions">
            <button type="button" className="btn ac-btn-link" onClick={() => setReview(false)}>
              Back to edit
            </button>
            <ConfirmButton />
          </div>
        </>
      )}
    </form>
  );
}
