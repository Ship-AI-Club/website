import { publicJudges } from "../lib/stats";

export default async function HackathonJudges() {
  const judges = await publicJudges();
  if (!judges.length) return null;

  return (
    <section className="section" id="judges" aria-labelledby="judges-title">
      <h2 id="judges-title">Judges</h2>
      <ul className="hk-judge-list">
        {judges.map((judge) => (
          <li key={judge.id}>
            <h3>{judge.name}</h3>
            <p>{[judge.title, judge.company].filter(Boolean).join(" · ")}</p>
          </li>
        ))}
      </ul>
    </section>
  );
}
