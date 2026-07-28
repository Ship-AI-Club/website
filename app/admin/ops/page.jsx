import {
  AlertTriangle,
  CalendarClock,
  ClipboardCheck,
  Download,
  Megaphone,
  Settings2,
  Utensils,
  Users,
} from "lucide-react";

import { requireAdmin } from "../../../lib/auth";
import { EVENT } from "../../../lib/hackathon";
import { eventDay, opsAttention, opsCounters, runOfShowState } from "../../../lib/ops";
import { allSettings, SETTINGS } from "../../../lib/settings";
import DeadlineClockForm from "./deadline-clock-form";
import LiveRefreshForm from "./live-refresh-form";
import SettingsForm from "./settings-form";

export const dynamic = "force-dynamic";

export const metadata = {
  title: "Operations — Ship AI",
  robots: { index: false, follow: false },
};

const DAY_LABELS = { friday: "Friday", saturday: "Saturday", sunday: "Sunday" };
const EXPORT_TYPES = ["attendees", "teams", "submissions", "scores", "dietary", "checkins"];

function Slot({ label, slot }) {
  return (
    <section className="ac-card">
      <div className="ac-card-head">
        <CalendarClock size={18} strokeWidth={1.75} aria-hidden="true" />
        <h2>{label}</h2>
      </div>
      {slot ? (
        <>
          <p className="ac-kicker">
            {slot.day} · {slot.time}
          </p>
          <h3>{slot.name}</h3>
          {slot.copy && <p>{slot.copy}</p>}
        </>
      ) : (
        <div className="ac-empty">
          <strong>No scheduled item.</strong>
          <p>The weekend run of show will fill this card.</p>
        </div>
      )}
    </section>
  );
}

function AttentionList({ title, rows, empty, children }) {
  return (
    <section className="ac-card">
      <div className="ac-card-head">
        <AlertTriangle size={18} strokeWidth={1.75} aria-hidden="true" />
        <h2>{title}</h2>
        <span className={`ac-pill ${rows.length ? "is-warn" : "is-ok"}`}>{rows.length}</span>
      </div>
      {rows.length ? (
        <ul className="ac-list">{rows.map(children)}</ul>
      ) : (
        <div className="ac-empty">
          <strong>Clear.</strong>
          <p>{empty}</p>
        </div>
      )}
    </section>
  );
}

export default async function Page() {
  const admin = await requireAdmin();
  const day = eventDay();
  const [counters, attention, settings] = await Promise.all([
    opsCounters(day),
    opsAttention(),
    allSettings(),
  ]);
  const show = runOfShowState();

  return (
    <>
      <div className="ac-head">
        <p className="ac-kicker">Administration · Operations</p>
        <h1>Control room.</h1>
        <p>
          {admin.name || admin.email}. {DAY_LABELS[counters.day]} run state.
        </p>
        <LiveRefreshForm />
      </div>

      <div className="ac-actions">
        <a className="ac-btn-link" href="/admin/ops/checkin">
          <ClipboardCheck size={18} strokeWidth={1.75} aria-hidden="true" />
          Check-in
        </a>
        <a className="ac-btn-link" href="/admin/ops/broadcast">
          <Megaphone size={18} strokeWidth={1.75} aria-hidden="true" />
          Broadcast
        </a>
        <a className="ac-btn-link" href="/admin/ops/catering">
          <Utensils size={18} strokeWidth={1.75} aria-hidden="true" />
          Catering
        </a>
      </div>

      <div className="ac-cards">
        <Slot label="Now" slot={show.current} />
        <Slot label="Next" slot={show.next} />
      </div>

      <DeadlineClockForm deadlineISO={EVENT.deadlineISO} />

      <section className="ac-card">
        <div className="ac-card-head">
          <Users size={18} strokeWidth={1.75} aria-hidden="true" />
          <h2>Live counters</h2>
          <span className="ac-pill">{DAY_LABELS[counters.day]}</span>
        </div>
        <div className="ac-stats">
          <div className="ac-stat">
            <b>{counters.checkedIn} / {counters.registered}</b>
            <span>checked in / registered</span>
          </div>
          <div className="ac-stat">
            <b>{counters.teams}</b>
            <span>teams formed</span>
          </div>
          <div className="ac-stat">
            <b>{counters.submitted} / {counters.teams}</b>
            <span>submissions / teams</span>
          </div>
          <div className="ac-stat">
            <b>{counters.scorecards} / {counters.assignments}</b>
            <span>scorecards / assignments</span>
          </div>
          <div className="ac-stat">
            <b>{counters.votes}</b>
            <span>crowd votes</span>
          </div>
        </div>
      </section>

      <div className="ac-cards">
        <AttentionList
          title="Teamless people"
          rows={attention.teamlessPeople}
          empty="Registered people without a team will appear here."
        >
          {(row) => (
            <li key={row.id}>
              <a href={`/admin/users/${row.id}`}>{row.name || row.email}</a>
              <span className="ac-list-end ac-mono">{row.handle ? `@${row.handle}` : row.email}</span>
            </li>
          )}
        </AttentionList>

        <AttentionList
          title="Teams without a submission"
          rows={attention.teamsWithoutSubmission}
          empty="Teams without a submitted entry will appear here."
        >
          {(row) => (
            <li key={row.id}>
              <a href="/admin/submissions">{row.name}</a>
              <span className="ac-list-end ac-mono">
                {row.member_count} member{row.member_count === 1 ? "" : "s"}
              </span>
            </li>
          )}
        </AttentionList>

        <AttentionList
          title="Submitted entries under three judges"
          rows={attention.underjudgedSubmissions}
          empty="Submitted entries with fewer than three judge assignments will appear here."
        >
          {(row) => (
            <li key={row.id}>
              <a href="/admin/assignments">{row.project || row.team_name}</a>
              <span className="ac-list-end ac-mono">{row.judge_count} / 3 judges</span>
            </li>
          )}
        </AttentionList>

        <AttentionList
          title="Judges with unfiled cards"
          rows={attention.unfiledJudges}
          empty="Judges with assigned, unfiled scorecards will appear here."
        >
          {(row) => (
            <li key={row.id}>
              <a href="/admin/assignments">{row.name || row.email}</a>
              <span className="ac-list-end ac-mono">
                {row.unfiled_count} card{row.unfiled_count === 1 ? "" : "s"}
              </span>
            </li>
          )}
        </AttentionList>

        <AttentionList
          title="Pending role requests"
          rows={attention.pendingRequests}
          empty="Pending role requests will appear here."
        >
          {(row) => (
            <li key={row.id}>
              <a href="/admin/requests">{row.name || row.email}</a>
              <span className="ac-list-end ac-mono">{row.role}</span>
            </li>
          )}
        </AttentionList>
      </div>

      <section className="ac-card">
        <div className="ac-card-head">
          <Settings2 size={18} strokeWidth={1.75} aria-hidden="true" />
          <h2>Runtime switches</h2>
        </div>
        <ul className="ac-list">
          {SETTINGS.map((setting) => {
            const enabled = Boolean(settings[setting.key]);
            return (
              <li key={setting.key}>
                <div>
                  <strong>{setting.label}</strong>
                  <span className="ac-sub">{setting.copy}</span>
                </div>
                <div className="ac-list-end">
                  <span className={`ac-pill ${enabled ? "is-ok" : "is-off"}`}>
                    {enabled ? "On" : "Off"}
                  </span>
                  <SettingsForm settingKey={setting.key} value={enabled} />
                </div>
              </li>
            );
          })}
        </ul>
      </section>

      <section className="ac-card">
        <div className="ac-card-head">
          <Download size={18} strokeWidth={1.75} aria-hidden="true" />
          <h2>CSV exports</h2>
        </div>
        <ul className="ac-list">
          {EXPORT_TYPES.map((type) => (
            <li key={type}>
              <strong>{type[0].toUpperCase() + type.slice(1)}</strong>
              <a className="ac-btn-link ac-list-end" href={`/api/admin/export?type=${type}`}>
                Download CSV
              </a>
            </li>
          ))}
        </ul>
      </section>
    </>
  );
}
