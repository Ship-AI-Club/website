import Scene from "./scene";
import "./departure-board.css";

/* The slim board the catalog hubs use for their one dated item. The
   homepage draws its own taller version with the same classes. */
export default function DepartureBoard({ id, scene, label, status, date, title, meta, figure, action }) {
  return (
    <div className="hub-board">
      <div className="stage dboard-stage dboard-stage-slim"><Scene scene={scene} /></div>
      <aside id={id} className="window dboard dboard-slim" aria-label={label}>
        <div className="window-bar"><b>{label}</b><span>{status}</span></div>
        <div className="dboard-row">
          <p className="dboard-date"><b>{date.big}</b><span>{date.small}</span></p>
          <div className="dboard-main">
            <h2>{title}</h2>
            <p className="meta">{meta}</p>
          </div>
          {figure && <p className="dboard-count"><b>{figure.big}</b><span>{figure.small}</span></p>}
          <div className="dboard-act"><a className="btn btn-solid" href={action.href}>{action.label}</a></div>
        </div>
      </aside>
    </div>
  );
}
