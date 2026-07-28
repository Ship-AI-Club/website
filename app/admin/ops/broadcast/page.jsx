import { requireAdmin } from "../../../../lib/auth";
import {
  BROADCAST_SEGMENTS,
  broadcastHistory,
  broadcastRecipientCounts,
  eventDay,
} from "../../../../lib/ops";
import BroadcastForm from "../broadcast-form";

export const dynamic = "force-dynamic";

export const metadata = {
  title: "Broadcast — Ship AI",
  robots: { index: false, follow: false },
};

const SEGMENT_LABELS = Object.fromEntries(
  BROADCAST_SEGMENTS.map(({ id, label }) => [id, label]),
);

function when(value) {
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "—";
  return new Intl.DateTimeFormat("en-US", {
    dateStyle: "medium",
    timeStyle: "short",
    timeZone: "America/Phoenix",
  }).format(date);
}

export default async function Page() {
  const admin = await requireAdmin("/admin/ops/broadcast");
  const day = eventDay();
  const [recipientCounts, history] = await Promise.all([
    broadcastRecipientCounts(day),
    broadcastHistory(),
  ]);

  return (
    <>
      <div className="ac-head">
        <p className="ac-kicker">Administration · Operations</p>
        <h1>Broadcast</h1>
        <p>
          {admin.name || admin.email}. Recipients are resolved again at send time. The cap is
          500 recipients.
        </p>
      </div>

      <section className="ac-card">
        <h2>New broadcast</h2>
        <BroadcastForm
          segments={BROADCAST_SEGMENTS}
          recipientCounts={recipientCounts}
          day={day}
        />
      </section>

      <section className="ac-card">
        <div className="ac-card-head">
          <h2>Past sends</h2>
          <span className="ac-pill">{history.length}</span>
        </div>

        {history.length === 0 ? (
          <div className="ac-empty">
            <strong>No broadcasts yet.</strong>
            Completed sends will appear here.
          </div>
        ) : (
          <div className="ac-table-wrap">
            <table className="ac-table">
              <thead>
                <tr>
                  <th>Time</th>
                  <th>Segment</th>
                  <th>Subject</th>
                  <th>Recipients</th>
                  <th>Sender</th>
                </tr>
              </thead>
              <tbody>
                {history.map((broadcast) => (
                  <tr key={broadcast.id}>
                    <td className="ac-mono">{when(broadcast.sent_at)}</td>
                    <td>{SEGMENT_LABELS[broadcast.segment] || broadcast.segment}</td>
                    <td>{broadcast.subject || "(no subject)"}</td>
                    <td className="ac-num">{Number(broadcast.recipients) || 0}</td>
                    <td>{broadcast.sent_by_name || "System"}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </section>
    </>
  );
}
