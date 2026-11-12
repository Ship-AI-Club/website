import Scene from "./scene";
import "./departure-board.css";
import "./event-page.css";

/* The event page: the weekend board. One template for every event, and
   it reads the date. Before the weekend the board under the headline is
   the departure board (date, days left, the RSVP). Afterwards the same
   board holds the podium. Under it each section appears once, in ruled
   columns and rows: no cards, no entry numbers, no eyebrows.

   The two event routes compose these pieces with their own data:
   app/hackathons/founder-weekend and app/programs/[program]/hackathon. */

export function EventHero({ name, crumb, title, keyPhrase, lede }) {
  return (
    <section className="hero ev-hero" aria-labelledby="ev-title">
      {crumb && <p className="ev-crumb"><a href={crumb.href}>← {crumb.label}</a></p>}
      <h1 className="hero-h1" id="ev-title">
        {name && <span className="ev-name">{name}</span>}
        {title} <span className="key">{keyPhrase}</span>
      </h1>
      <p className="hero-lede">{lede}</p>
    </section>
  );
}

/* The stage and the board docked to its lower edge. */
export function EventBoard({ scene, alt, label, bar, children, foot }) {
  return (
    <div className="ev-board-wrap">
      <div className="stage dboard-stage ev-stage"><Scene scene={scene} alt={alt} /></div>
      <aside className="window dboard ev-board" aria-label={label}>
        <div className="window-bar"><b>{bar[0]}</b><span>{bar[1]}</span></div>
        {children}
        {foot && <div className="dboard-foot">{foot}</div>}
      </aside>
    </div>
  );
}

/* Before: the date, the place, the days left and the one action. */
export function BoardDeparture({ date, dateNote, place, placeNote, days, action }) {
  return (
    <div className="dboard-row">
      <p className="dboard-date"><b>{date}</b><span>{dateNote}</span></p>
      <div className="dboard-main"><h2>{place}</h2><p className="meta">{placeNote}</p></div>
      {days > 0 && <p className="dboard-count"><b>{days}</b><span>{days === 1 ? "day to go" : "days to go"}</span></p>}
      <div className="dboard-act">{action}</div>
    </div>
  );
}

/* After: the podium, one cell per place. */
export function BoardPodium({ podium, prizes = [] }) {
  return (
    <ol className="ev-podium">
      {podium.map((entry, index) => (
        <li key={entry.project}>
          <a href={entry.pitch}>
            <span className="ev-label">{[entry.place, prizes[index]].filter(Boolean).join(" · ")}</span>
            <b>{entry.project}</b>
            <span className="ev-line">{entry.line}</span>
            <span className="ev-go">Watch the pitch <i aria-hidden="true">→</i></span>
          </a>
        </li>
      ))}
    </ol>
  );
}

export function EventSection({ id, title, keyPhrase, lede, children }) {
  return (
    <section className="section ev-section" id={id} aria-labelledby={`${id}-title`}>
      <div className="section-head">
        <h2 id={`${id}-title`}>{title}{keyPhrase && <> <span className="key">{keyPhrase}</span></>}</h2>
        {lede && <p className="section-lede">{lede}</p>}
      </div>
      {children}
    </section>
  );
}

/* Ruled columns: three across, as many rows as it takes. */
export function RuledGrid({ items, columns = 3 }) {
  return (
    <ul className="ev-grid" style={{ "--ev-cols": columns }}>
      {items.map(([title, text]) => <li key={title}><h3>{title}</h3><p>{text}</p></li>)}
    </ul>
  );
}

/* Ruled rows: a name on the left, what it means on the right. */
export function RuledRows({ items }) {
  return (
    <ul className="ev-rows">
      {items.map(([title, text]) => <li key={title}><h3>{title}</h3><p>{text}</p></li>)}
    </ul>
  );
}

export function EventDays({ days }) {
  return (
    <div className="ev-days">
      {days.map((day) => (
        <article key={day.title}>
          <span className="ev-label">{day.label}</span>
          <h3>{day.title}</h3>
          <dl>
            {day.rows.map(([time, what]) => <div key={time + what}><dt>{time}</dt><dd>{what}</dd></div>)}
          </dl>
        </article>
      ))}
    </div>
  );
}

export function PeopleRow({ people }) {
  return (
    <ul className="ev-people" style={{ "--ev-cols": Math.min(people.length, 4) }}>
      {people.map((person) => (
        <li key={person.name}>
          {person.photo
            ? <img src={person.photo} alt="" width="56" height="56" loading="lazy" />
            : <span className="ev-initials" aria-hidden="true">{person.name.split(" ").map((word) => word[0]).join("").slice(0, 2)}</span>}
          <div><h3>{person.name}</h3><p>{person.role}</p></div>
        </li>
      ))}
    </ul>
  );
}

/* Proof from the last finished hackathon: the figure and the podium. */
export function ProofLedger({ shipped, results, children }) {
  return (
    <div className="home-ledger ev-ledger">
      <div className="home-figure">
        <b aria-hidden="true">{shipped.teams}</b>
        <h2><span className="sr-only">{shipped.teams} </span>teams launched a live product <span className="key">in one weekend.</span></h2>
        <p className="meta">{[shipped.event, shipped.held].join(" · ")}</p>
        {children}
      </div>
      <ol className="home-podium">
        {shipped.podium.map((entry) => (
          <li key={entry.project} className="home-pod">
            <span className="meta">{entry.place}</span>
            <div>
              <h3><a href={results}>{entry.project}</a></h3>
              <p>{entry.line}</p>
            </div>
            <span className="home-arrow" aria-hidden="true">→</span>
          </li>
        ))}
      </ol>
    </div>
  );
}
