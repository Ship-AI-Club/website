import { WORKSHOPS } from "../lib/hackathon";

/* ------------------------------------------------------------------
   Deck artwork — the visual system.

   All SVG, no raster. A deck gets projected at whatever resolution the
   room's HDMI cable feels like, so vector is the only honest answer; it
   also means the art inherits the accent from CSS and can be animated
   and stepped like the rest of the site.

   Everything here is built from three primitives taken off the Ship AI
   mark: a BEAM (hairline), a NODE (a dot, sometimes lit) and a RAY (an
   accent line). Funnel, flow, loop, timeline, chart and scorecard are
   those three in different arrangements. Holding to that is what makes
   six diagrams read as one system instead of six clip-art choices.

   Accent budget: at most one lit node per slide.
------------------------------------------------------------------ */

/* ---------- the globe ---------- */

/* Latitudes are ellipses squashed toward the poles; meridians are
   ellipses whose width is the cosine of their angle — the actual
   projection of a sphere's great circles onto a plane. Nothing about
   the sphere animates; only the signal arcs travel. */
export function Globe({ className = "" }) {
  const R = 80;
  const meridians = [0, 30, 60, 90, 120, 150].map((deg) => ({
    deg,
    rx: Math.abs(Math.cos((deg * Math.PI) / 180)) * R,
  }));
  const latitudes = [26, 52, 74];

  return (
    <svg
      viewBox="0 0 200 200"
      className={`dk-art dk-globe ${className}`}
      role="img"
      aria-label="A wireframe globe with signal arcs travelling between lit nodes"
    >
      <circle className="dk-globe-rim" cx="100" cy="100" r={R} />

      {latitudes.map((ry) => (
        <ellipse key={ry} className="dk-wire" cx="100" cy="100" rx={R} ry={ry} />
      ))}

      <g className="dk-globe-spin">
        {meridians.map((m) => (
          <ellipse
            key={m.deg}
            className="dk-wire"
            cx="100"
            cy="100"
            rx={m.rx.toFixed(2)}
            ry={R}
            transform={`rotate(${m.deg} 100 100)`}
          />
        ))}
      </g>

      <g className="dk-globe-nodes">
        <path className="dk-arc" d="M46 68 Q100 26 152 78" />
        <path className="dk-arc dk-arc-2" d="M60 138 Q114 150 150 96" />
        <circle className="dk-node" cx="46" cy="68" r="3.5" />
        <circle className="dk-node" cx="60" cy="138" r="3.5" />
        <circle className="dk-node dk-node-lit" cx="152" cy="78" r="4.5" />
        <circle className="dk-node" cx="150" cy="96" r="3" />
      </g>
    </svg>
  );
}

/* ---------- the sail as a prism ---------- */

/* The mark's sail is already a triangle. Pointing a beam at it and
   letting it fan out into channels is the one metaphor in this program
   that's both accurate and free: one product, many routes to market. */
export function Prism({ rays = 4, className = "" }) {
  const spread = [-16, -5, 6, 17].slice(0, rays);

  return (
    <svg
      viewBox="0 0 260 180"
      className={`dk-art dk-prism ${className}`}
      role="img"
      aria-label="A beam entering a prism and splitting into separate channels"
    >
      {/* the beam runs into the sail's face, not up to a gap beside it */}
      <line className="dk-beam" x1="0" y1="90" x2="96" y2="90" />
      <circle className="dk-node" cx="14" cy="90" r="3" />

      <path className="dk-prism-body" d="M96 26 L96 154 L150 90 Z" />

      {spread.map((dy, i) => (
        <g key={dy} className="dk-ray-g" style={{ "--i": i }}>
          <line className="dk-ray" x1="150" y1="90" x2="244" y2={90 + dy * 3.4} />
          <circle className="dk-node dk-node-lit" cx="244" cy={90 + dy * 3.4} r="3.5" />
        </g>
      ))}
    </svg>
  );
}

/* ---------- funnel ---------- */

/* Stage widths are proportional to share, so a leaky funnel looks leaky
   — the shape is the argument. The drop between stages is labelled
   beside it, because that number is the actual finding.

   Each stage is one grid row containing its own band, rather than a
   single tall SVG sitting next to an independent list. Two separate
   flows drift out of registration as soon as a label wraps, and a
   diagram whose whole job is mapping a name to a width cannot afford
   that. One row, one band, one label — alignment by construction. */
export function Funnel({ stages, className = "" }) {
  const W = 320;
  const H = 100; /* per-band user units; preserveAspectRatio="none" stretches it */
  const pct = (a, b) => `${Math.round((b / a) * 100)}%`;

  return (
    <ol className={`dk-funnel ${className}`} aria-label={`Funnel: ${stages.map((s) => s.t).join(" → ")}`}>
      {stages.map((s, i) => {
        const wTop = W * s.w;
        const wBot = W * (stages[i + 1]?.w ?? s.w * 0.8);
        const x1 = (W - wTop) / 2;
        const x2 = (W - wBot) / 2;
        return (
          <li key={s.t} className={s.lit ? "is-lit" : undefined} style={{ "--i": i }}>
            <svg
              className="dk-funnel-band"
              viewBox={`0 0 ${W} ${H}`}
              preserveAspectRatio="none"
              aria-hidden="true"
            >
              <path d={`M${x1} 0 L${x1 + wTop} 0 L${x2 + wBot} ${H} L${x2} ${H} Z`} />
            </svg>
            <span className="dk-funnel-t">{s.t}</span>
            {s.c && <span className="dk-funnel-c">{s.c}</span>}
            {i > 0 && <span className="dk-funnel-drop">{pct(stages[i - 1].w, s.w)}</span>}
          </li>
        );
      })}
    </ol>
  );
}

/* ---------- flow ---------- */

export function Flow({ steps, className = "" }) {
  return (
    <ol className={`dk-flow ${className}`}>
      {steps.map((s, i) => (
        <li key={s.t} className={s.lit ? "is-lit" : undefined} style={{ "--i": i }}>
          <span className="dk-flow-dot" aria-hidden="true" />
          <span className="dk-flow-t">{s.t}</span>
          {s.c && <span className="dk-flow-c">{s.c}</span>}
        </li>
      ))}
    </ol>
  );
}

/* ---------- timeline ---------- */

/* The program spine, in the same position in all six decks. Sessions
   already run are dimmed, tonight is lit. It answers "where are we" in
   a ten-week course without spending a slide on it, and it's what makes
   six separate decks feel like one course. */
export function Timeline({ now, className = "" }) {
  const stops = [
    ...WORKSHOPS.map((w) => ({ n: w.n, date: w.date.replace("Wed ", ""), t: w.eventTitle })),
    { n: "—", date: "Oct 16", t: "Hackathon" },
  ];
  const nowIndex = stops.findIndex((s) => s.n === now);

  return (
    <ol className={`dk-time ${className}`} aria-label="Program timeline">
      {stops.map((s, i) => (
        <li
          key={s.n}
          className={i === nowIndex ? "is-now" : i < nowIndex ? "is-past" : undefined}
          style={{ "--i": i }}
          aria-current={i === nowIndex ? "step" : undefined}
        >
          <span className="dk-time-date">{s.date}</span>
          <span className="dk-time-t">{s.t}</span>
        </li>
      ))}
    </ol>
  );
}

/* ---------- loop ---------- */

export function Loop({ steps, label, className = "" }) {
  const R = 74;
  const C = 100;
  const pos = steps.map((_, i) => {
    const a = (i / steps.length) * Math.PI * 2 - Math.PI / 2;
    return { x: C + R * Math.cos(a), y: C + R * Math.sin(a) };
  });

  return (
    <div className={`dk-loop ${className}`}>
      <svg viewBox="0 0 200 200" role="img" aria-label={`Loop: ${steps.map((s) => s.t).join(" → ")}`}>
        <circle className="dk-loop-ring" cx={C} cy={C} r={R} />
        <circle className="dk-loop-run" cx={C} cy={C} r={R} />
        {pos.map((p, i) => (
          <circle key={i} className={`dk-node${i === 0 ? " dk-node-lit" : ""}`} cx={p.x} cy={p.y} r="5" />
        ))}
      </svg>
      {label && <span className="dk-loop-label">{label}</span>}
      <ol className="dk-loop-steps">
        {steps.map((s, i) => (
          <li key={s.t} style={{ "--i": i }}>
            <span className="dk-loop-n">{String(i + 1).padStart(2, "0")}</span>
            {s.t}
          </li>
        ))}
      </ol>
    </div>
  );
}

/* ---------- matrix ---------- */

export function Matrix({ rows, heads, className = "" }) {
  return (
    <table className={`dk-matrix ${className}`}>
      <thead>
        <tr>
          <th />
          {heads.map((h) => (
            <th key={h}>{h}</th>
          ))}
        </tr>
      </thead>
      <tbody>
        {rows.map((r, i) => (
          <tr key={r.t} style={{ "--i": i }}>
            <th scope="row">{r.t}</th>
            {r.cells.map((c, j) => (
              <td key={j} className={c.lit ? "is-lit" : undefined}>
                {c.v ?? c}
              </td>
            ))}
          </tr>
        ))}
      </tbody>
    </table>
  );
}

/* ---------- chart ---------- */

/* A step plot. Points are [label, value]; the line is drawn rather than
   eased in, using steps() on the dash reveal so it plots in pixel jumps
   like the rest of the site's motion. */
export function Chart({ points, peak, className = "" }) {
  const W = 420;
  const PLOT = 170;
  const LABELS = 26; /* the tick row lives inside the viewBox, not below it */
  const H = PLOT + LABELS;
  const PAD = 8;
  const max = Math.max(...points.map((p) => p.v));
  const xy = points.map((p, i) => ({
    x: PAD + (i / (points.length - 1)) * (W - PAD * 2),
    y: PLOT - PAD - (p.v / max) * (PLOT - PAD * 2),
    ...p,
  }));

  const line = xy.map((p, i) => `${i ? "L" : "M"}${p.x.toFixed(1)} ${p.y.toFixed(1)}`).join(" ");
  const area = `${line} L${xy.at(-1).x.toFixed(1)} ${PLOT - PAD} L${xy[0].x.toFixed(1)} ${PLOT - PAD} Z`;
  const last = xy.at(-1);

  return (
    <div className={`dk-chart ${className}`}>
      <svg viewBox={`0 0 ${W} ${H}`} role="img" aria-label={`Chart rising to ${peak}`}>
        <line className="dk-chart-axis" x1={PAD} y1={PLOT - PAD} x2={W - PAD} y2={PLOT - PAD} />
        <line className="dk-chart-axis" x1={PAD} y1={PAD} x2={PAD} y2={PLOT - PAD} />
        <path className="dk-chart-fill" d={area} />
        <path className="dk-chart-line" d={line} />
        <circle className="dk-node dk-node-lit" cx={last.x} cy={last.y} r="4" />
        {/* ticks are sized in user units — a cqw here would be scaled again
            by the viewBox and land three times too big */}
        {xy.map((p, i) => (
          <text
            key={p.l}
            className="dk-chart-tick"
            x={p.x}
            y={PLOT + 12}
            textAnchor={i === 0 ? "start" : i === xy.length - 1 ? "end" : "middle"}
          >
            {p.l}
          </text>
        ))}
      </svg>
      <p className="dk-chart-peak">{peak}</p>
    </div>
  );
}

/* ---------- scorecard ---------- */

export function Scorecard({ rows, className = "" }) {
  return (
    <ol className={`dk-score ${className}`}>
      {rows.map((r, i) => (
        <li key={r.t} className={r.lit ? "is-lit" : undefined} style={{ "--i": i }}>
          <span className="dk-score-name">{r.t}</span>
          <span className="dk-score-bar">
            <span style={{ "--w": `${r.pct}%` }} />
          </span>
          <span className="dk-score-pct">{r.pct}</span>
        </li>
      ))}
    </ol>
  );
}

/* ---------- QR ---------- */

/* The matrix is encoded at build time (scripts/build-kits.mjs) so there
   is no runtime dependency and no network fetch on a conference wifi.
   Modules are drawn as one path — a few hundred rects would be a lot of
   DOM for a slide that never changes. */
export function QR({ code, label, className = "" }) {
  if (!code) return null;
  return (
    <div className={`dk-qr ${className}`}>
      <svg viewBox={`0 0 ${code.size} ${code.size}`} role="img" aria-label={label || "QR code"}>
        <path d={code.path} fill="#000" />
      </svg>
      {label && <span className="dk-qr-label">{label}</span>}
    </div>
  );
}
