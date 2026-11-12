"use client";

import { useToastActionState } from "../../../components/toast-provider";
import { announceWorkshopDate } from "./actions";

/* One per workshop list. It only renders while somebody is still
   waiting for the date, so a finished list has nothing to press. */
export default function AnnounceForm({ slug, name, pending, notified }) {
  const [, action, sending] = useToastActionState(announceWorkshopDate, {});
  return (
    <form action={action} className="ac-form is-tight" style={{ padding: "1.25rem 1.5rem" }}>
      <input type="hidden" name="slug" value={slug} />
      <p className="ac-fine">
        {pending} {pending === 1 ? "person is" : "people are"} waiting for the date{notified ? `; ${notified} already have it` : ""}. Each gets one email with the date, the place and a link to the workshop page.
      </p>
      <label className="ac-field">
        <span className="ac-label">Date and time</span>
        <input type="text" name="when" maxLength={120} placeholder="Saturday, March 6, 2027, 9 AM to 1 PM MST" required />
      </label>
      <label className="ac-field">
        <span className="ac-label">Where</span>
        <input type="text" name="where" maxLength={160} defaultValue="Workuity Biltmore, 2390 E Camelback Rd, Suite 130, Phoenix" required />
      </label>
      <label><input type="checkbox" name="confirm" required /> The date for {name} is final and its page shows it</label>
      <div>
        <button className="btn btn-solid" disabled={sending}>{sending ? "Sending" : `Email the date to ${pending}`}</button>
      </div>
    </form>
  );
}
