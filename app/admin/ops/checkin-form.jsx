"use client";

import { useActionState, useMemo, useState } from "react";
import { useFormStatus } from "react-dom";

import { toggleCheckinAction } from "./actions";

function displayName(row) {
  return String(row.name || row.email || "Unnamed attendee").trim();
}

function initials(row) {
  const source = displayName(row);
  const letters = source
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0]);
  return letters.join("").toUpperCase() || "?";
}

function searchValue(row) {
  const handle = String(row.handle || "").trim();
  return [row.name, handle, handle ? `@${handle}` : "", row.email]
    .map((value) => String(value || "").toLowerCase())
    .join(" ");
}

function ActionButton({ mode, attendee }) {
  const { pending } = useFormStatus();
  const checkingIn = mode === "checkin";
  const label = checkingIn ? "Check in" : "Undo";

  return (
    <button
      type="submit"
      className={`btn ${checkingIn ? "btn-solid" : "btn-ghost"}`}
      disabled={pending}
      aria-label={`${label} ${displayName(attendee)}`}
    >
      {pending ? (checkingIn ? "Checking in…" : "Undoing…") : label}
    </button>
  );
}

function AttendeeRow({ attendee, day, action }) {
  const checkedIn = Boolean(attendee.checked_in_at);
  const mode = checkedIn ? "undo" : "checkin";

  return (
    <li>
      <div className="ac-upload">
        <div className="ac-avatar">
          {attendee.avatar_url ? (
            <img src={attendee.avatar_url} alt="" />
          ) : (
            <b>{initials(attendee)}</b>
          )}
        </div>
        <div className="ac-upload-body">
          <strong>{displayName(attendee)}</strong>
          <span className="ac-sub">{attendee.handle ? `@${attendee.handle}` : "No handle"}</span>
          <span className="ac-sub">{attendee.email || "No email"}</span>
          <span className="ac-sub">
            Team: {attendee.team_name || "No team recorded"} · Dietary: {attendee.dietary || "No dietary note"}
          </span>
        </div>
      </div>

      <div className="ac-list-end">
        <span className={`ac-pill ${checkedIn ? "is-ok" : "is-off"}`}>
          {checkedIn ? "Checked in" : "Not checked in"}
        </span>
        <form action={action} className="ac-inline-form">
          <input type="hidden" name="user_id" value={attendee.id} />
          <input type="hidden" name="day" value={day} />
          <input type="hidden" name="mode" value={mode} />
          <ActionButton mode={mode} attendee={attendee} />
        </form>
      </div>
    </li>
  );
}

export default function CheckinForm({ day, roster }) {
  const [state, action] = useActionState(toggleCheckinAction, {});
  const [query, setQuery] = useState("");
  const normalizedQuery = query.trim().toLowerCase();
  const visibleRoster = useMemo(
    () =>
      normalizedQuery
        ? roster.filter((attendee) => searchValue(attendee).includes(normalizedQuery))
        : roster,
    [normalizedQuery, roster],
  );

  return (
    <div className="ac-form is-tight">
      {state.error && (
        <p className="ac-error" role="alert">
          {state.error}
        </p>
      )}
      {state.ok && (
        <p className="ac-ok" role="status">
          {state.ok}
        </p>
      )}

      <div className="ac-field">
        <label className="ac-label" htmlFor="checkin-search">
          Find an attendee
        </label>
        <p className="ac-hint">Filters by name, handle or email while you type.</p>
        <input
          id="checkin-search"
          type="text"
          value={query}
          onChange={(event) => setQuery(event.target.value)}
          placeholder="Name, @handle, or email"
          autoComplete="off"
        />
      </div>

      {roster.length === 0 ? (
        <div className="ac-empty">
          <strong>Nobody expected yet.</strong>
          Active registrations fill this day&apos;s check-in roster.
        </div>
      ) : visibleRoster.length === 0 ? (
        <div className="ac-empty">
          <strong>No attendees match this search.</strong>
          Clear the search to see everyone expected.
        </div>
      ) : (
        <ul className="ac-list">
          {visibleRoster.map((attendee) => (
            <AttendeeRow key={attendee.id} attendee={attendee} day={day} action={action} />
          ))}
        </ul>
      )}
    </div>
  );
}
