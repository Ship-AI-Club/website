import Scene from "./scene";
import "./departure-board.css";
import "./event-page.css";
import "./event-form.css";

/* The event form pages: register, sponsor and submit. Each has the
   centred event hero (EventHero in event-page.jsx), then one of two
   shapes under it.

   The counter: a board on a slim scene, and the board is the form. It
   holds the one action for the page's state, and a closed board points
   to the next open one. Reference sits under it in ruled rows.

   The passage: a short route where finished steps fold to a line and
   the ship sits at the step that holds the form. Registration uses it,
   because it is the one page with real steps. */

export function FormBoard({ scene, alt, label, bar, children, foot }) {
  return (
    <div className="ef-wrap">
      <div className="stage ef-stage"><Scene scene={scene} alt={alt} /></div>
      <aside className="window ef-board" aria-label={label}>
        <div className="window-bar"><b>{bar[0]}</b><span>{bar[1]}</span></div>
        {children}
        {foot && <div className="dboard-foot">{foot}</div>}
      </aside>
    </div>
  );
}

/* One line and one button. `date` adds the large date cell on the left. */
export function BoardAction({ date, title, line, children }) {
  return (
    <div className={date ? "ef-row has-date" : "ef-row"}>
      {date && <p className="dboard-date"><b>{date[0]}</b><span>{date[1]}</span></p>}
      <div className="ef-main"><h2>{title}</h2>{line && <p>{line}</p>}</div>
      <div className="ef-act">{children}</div>
    </div>
  );
}

/* Ruled rows with an optional tag after the name: "Required", a time. */
export function TaggedRows({ items }) {
  return (
    <ul className="ev-rows ef-rows">
      {items.map(({ name, tag, quiet, copy }) => (
        <li key={name}>
          <h3>{name}{tag && <span className={quiet ? "ef-tag is-quiet" : "ef-tag"}>{tag}</span>}</h3>
          <p>{copy}</p>
        </li>
      ))}
    </ul>
  );
}

/* A row that opens in place, for the record under a closed board. */
export function RecordRow({ title, tag, children }) {
  return (
    <details className="ef-record">
      <summary>
        <h3>{title}</h3>
        {tag && <span className="ev-label">{tag}</span>}
        <span className="ef-mark" aria-hidden="true">+</span>
      </summary>
      <div className="ef-open">{children}</div>
    </details>
  );
}

export function Passage({ children, foot }) {
  return (
    <div className="ef-passage">
      <ol className="vy-route">{children}</ol>
      {foot && <p className="ef-passage-foot">{foot}</p>}
    </div>
  );
}

/* state: "here" (the ship, and the form), "done" or "ahead". */
export function PassageStop({ state = "ahead", label, title, children }) {
  const cls = state === "here" ? "vy-stop has-ship" : `vy-stop is-${state}`;
  return (
    <li className={cls} aria-current={state === "here" ? "step" : undefined}>
      <span className="vy-dot" aria-hidden="true" />
      <div className={state === "here" ? "vy-card ef-step" : "ef-step is-plain"}>
        <div className="ef-step-head">
          <span className="vy-label">{label}</span>
          <h2>{title}</h2>
        </div>
        {children}
      </div>
    </li>
  );
}
