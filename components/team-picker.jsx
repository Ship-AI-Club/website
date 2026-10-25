export default function TeamPicker({ teams, selectedId, href }) {
  if (teams.length < 2) return null;
  return (
    <nav aria-label="Choose your team" className="ac-card">
      <h2>Your teams</h2>
      <div className="ac-actions">
        {teams.map((team) => (
          <a key={team.id} className={`btn ${team.id === selectedId ? "btn-solid" : "btn-ghost"} ac-btn-sm`}
            href={`${href}?team=${team.id}`} aria-current={team.id === selectedId ? "page" : undefined}>
            {team.name}
          </a>
        ))}
      </div>
    </nav>
  );
}
