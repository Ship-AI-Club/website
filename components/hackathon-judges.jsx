import { publicJudges } from "../lib/stats";

export default async function HackathonJudges() {
  const judges = await publicJudges();
  if (!judges.length) return null;

  return (
    <section className="section" id="judges" aria-labelledby="judges-title">
      <h2 id="judges-title">Judges</h2>
      <ul className="hk-judge-list">
        {judges.map((judge) => (
          <li className="hk-judge" key={judge.id}>
            <span className="hk-roster-avatar hk-judge-avatar">
              {judge.avatar_url ? (
                <img src={judge.avatar_url} alt="" width="64" height="64" loading="lazy" />
              ) : (
                <span aria-hidden="true">{Array.from(judge.name.trim())[0]?.toUpperCase() || "?"}</span>
              )}
            </span>
            <div className="hk-roster-body">
              <h3>{judge.name}</h3>
              <p>{[judge.title, judge.company].filter(Boolean).join(" · ")}</p>
            </div>
          </li>
        ))}
      </ul>
    </section>
  );
}
