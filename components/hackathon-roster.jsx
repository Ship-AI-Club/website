import { programStats, publicRoster } from "../lib/stats";

const ROSTER_LIMIT = 60;

const STAT_ITEMS = [
  { key: "participants", label: "Participants" },
  { key: "teams", label: "Teams" },
  { key: "submitted", label: "Submitted" },
];

function monogram(name) {
  return Array.from(String(name || "").trim())[0]?.toUpperCase() || "?";
}

function memberMeta(member) {
  return [member.title, member.company]
    .map((value) => String(value || "").trim())
    .filter(Boolean)
    .join(" · ");
}

export default async function HackathonRoster() {
  const stats = await programStats();
  if (stats.participants === 0) return null;

  const roster = await publicRoster(stats.participants);
  const visibleStats = STAT_ITEMS.filter(({ key }) => Number(stats[key]) > 0);
  const visibleRoster = roster.slice(0, ROSTER_LIMIT);
  const more = Math.max(roster.length - visibleRoster.length, 0);

  return (
    <section className="hk-roster-section" aria-labelledby="hk-roster-heading">
      <div className="hk-roster-head">
        <p className="hk-roster-kicker">The room</p>
        <h2 className="hk-roster-heading" id="hk-roster-heading">
          Registered builders
        </h2>
      </div>

      <div className="hk-stat-band" aria-label="Program stats">
        {visibleStats.map(({ key, label }) => (
          <div className="hk-stat-item" key={key}>
            <p className="hk-stat-value">{Number(stats[key]).toLocaleString("en-US")}</p>
            <p className="hk-stat-label">{label}</p>
          </div>
        ))}
      </div>

      {visibleRoster.length > 0 ? (
        <div className="hk-roster-grid" role="list" aria-label="Public participant roster">
          {visibleRoster.map((member, index) => {
            const meta = memberMeta(member);

            return (
              <article
                className="hk-roster-card"
                key={`${member.handle || member.name}-${index}`}
                role="listitem"
              >
                <span className="hk-roster-avatar">
                  {member.avatar_url ? (
                    <img src={member.avatar_url} alt="" width="48" height="48" loading="lazy" />
                  ) : (
                    <span aria-hidden="true">{monogram(member.name)}</span>
                  )}
                </span>
                <div className="hk-roster-body">
                  <h3 className="hk-roster-name">{member.name}</h3>
                  {meta && <p className="hk-roster-meta">{meta}</p>}
                </div>
              </article>
            );
          })}
        </div>
      ) : (
        <p className="hk-roster-empty">Public profiles will fill this list as registered builders opt in.</p>
      )}

      {more > 0 && <p className="hk-roster-more">and {more} more</p>}
    </section>
  );
}
