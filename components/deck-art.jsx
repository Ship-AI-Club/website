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

/* One beam in, many channels out — drawn as the pixel sail with
   circuit traces leaving its right edge at different heights, routed
   at right angles like the logo's own lines. No single spray point:
   each channel gets its own exit. */
const PRISM_EXITS = [
  { y: 52, out: 34, elbow: 196 },
  { y: 82, out: 78, elbow: 208 },
  { y: 112, out: 122, elbow: 208 },
  { y: 142, out: 166, elbow: 196 },
];

export function Prism({ rays = 4, className = "" }) {
  const exits = PRISM_EXITS.slice(0, rays);

  return (
    <svg
      viewBox="0 0 260 200"
      className={`dk-art dk-prism ${className}`}
      role="img"
      aria-label="One beam entering the pixel sail and leaving as separate routed channels"
    >
      <line className="dk-eng-rail" x1="0" y1="90" x2="100" y2="90" />
      <path className="dk-arc" d="M0 90 L100 90" />

      {exits.map((e, i) => (
        <g key={e.y} className="dk-ray-g" style={{ "--i": i }}>
          <path
            className="dk-ray"
            d={`M150 ${e.y} L${e.elbow} ${e.y} L${e.elbow} ${e.out} L236 ${e.out}`}
            fill="none"
          />
          <circle className="dk-node" cx={e.elbow} cy={e.out} r="2.5" />
          <circle className="dk-node dk-node-lit" cx="236" cy={e.out} r="3.5" />
        </g>
      ))}

      {/* the sail sits over the rails, so traces emerge from behind it */}
      <g transform="translate(64 22) scale(8.6)">
        <path className="dk-eng-core" d={px([...SAIL_BODY, ...SAIL_STREAKS])} />
      </g>
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
export function Timeline({ sessions, now, hasHackathon = false, className = "" }) {
  const stops = [
    ...sessions.map((w) => ({
      n: w.n,
      /* Four stops all reading "TBD" is a timeline with no line in it —
         an unscheduled program numbers its sessions instead. */
      date: Array.isArray(w.nights) && w.nights.length > 1
        ? w.nights.map((night) => night.date.replace(/^[A-Za-z]+ /, "")).join(" / ")
        : w.iso
          ? w.date.replace(/^[A-Za-z]+ /, "")
          : `Session ${w.n}`,
      t: w.eventTitle,
    })),
    ...(hasHackathon ? [{ n: "—", date: "Weekend", t: "Hackathon" }] : []),
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
export function Chart({ points, peak, peakLabel, projValue, projLabel, wide = false, className = "" }) {
  /* A wider viewBox, not a shorter one: the wide variant needs a flatter
     plot, and spending the extra aspect on user units (rather than on
     squashing the plot) keeps the tick text the same rendered size as the
     two-column chart, so the pair reads as one typographic system. */
  const W = wide ? 680 : 420;
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

  /* a trailing point marked proj is a forecast, not a reading: the run of
     actuals stays solid and the last leg goes dashed, so the slide can't
     be read as if we already banked it */
  const firstProj = xy.findIndex((p) => p.proj);
  const solid = firstProj === -1 ? xy : xy.slice(0, firstProj);
  const dashed = firstProj === -1 ? [] : xy.slice(firstProj - 1);

  const draw = (pts) => pts.map((p, i) => `${i ? "L" : "M"}${p.x.toFixed(1)} ${p.y.toFixed(1)}`).join(" ");
  const line = draw(solid);
  const projLine = dashed.length ? draw(dashed) : null;
  const area = `${line} L${solid.at(-1).x.toFixed(1)} ${PLOT - PAD} L${xy[0].x.toFixed(1)} ${PLOT - PAD} Z`;
  const last = solid.at(-1);
  const proj = firstProj === -1 ? null : xy.at(-1);

  const figs = peak || projValue;

  return (
    <div className={`dk-chart${figs ? "" : " is-bare"}${wide ? " is-wide" : ""} ${className}`}>
      <svg viewBox={`0 0 ${W} ${H}`} role="img" aria-label={`Chart rising to ${peak || points.at(-1).l}`}>
        <line className="dk-chart-axis" x1={PAD} y1={PLOT - PAD} x2={W - PAD} y2={PLOT - PAD} />
        <line className="dk-chart-axis" x1={PAD} y1={PAD} x2={PAD} y2={PLOT - PAD} />
        <path className="dk-chart-fill" d={area} />
        {/* normalised so one stroke-dasharray in the CSS reveals the whole
            line at any viewBox width — a fixed dash length leaves a gap in
            the wide variant */}
        <path className="dk-chart-line" d={line} pathLength="100" />
        {projLine ? <path className="dk-chart-proj" d={projLine} /> : null}
        <circle className="dk-node dk-node-lit" cx={last.x} cy={last.y} r="4" />
        {proj ? <circle className="dk-chart-proj-node" cx={proj.x} cy={proj.y} r="4" /> : null}
        {/* ticks are sized in user units — a cqw here would be scaled again
            by the viewBox and land three times too big */}
        {xy.map((p, i) => (
          <text
            key={p.l}
            className={`dk-chart-tick${p.proj ? " is-proj" : ""}`}
            x={p.x}
            y={PLOT + 12}
            textAnchor={i === 0 ? "start" : i === xy.length - 1 ? "end" : "middle"}
          >
            {p.l}
          </text>
        ))}
      </svg>
      {figs ? (
        <div className="dk-chart-figs">
          <div className="dk-chart-fig">
            <p className="dk-chart-peak">{peak}</p>
            {peakLabel ? <p className="dk-chart-fig-l">{peakLabel}</p> : null}
          </div>
          {projValue ? (
            <div className="dk-chart-fig is-proj">
              <p className="dk-chart-proj-v">{projValue}</p>
              <p className="dk-chart-fig-l is-proj">{projLabel}</p>
            </div>
          ) : null}
        </div>
      ) : null}
    </div>
  );
}

/* ---------- cohort retention curves ----------
   Several weekly cohorts on one D1..D7 axis. The most recent COMPLETED
   cohort is drawn lit; a cohort still inside its own D7 window is drawn
   dashed and labelled, so a partial read can never be mistaken for a
   finished one. */

export function Cohorts({ series = [], days = 7, className = "" }) {
  const W = 440;
  const PLOT = 200;
  const LABELS = 26;
  const H = PLOT + LABELS;
  const PAD = 26;
  const max = Math.max(...series.flatMap((c) => c.v)) || 1;

  const xOf = (i) => PAD + (i / (days - 1)) * (W - PAD - 12);
  const yOf = (v) => PLOT - PAD - (v / max) * (PLOT - PAD * 1.4);

  return (
    <div className={`dk-cohorts ${className}`}>
      <svg viewBox={`0 0 ${W} ${H}`} role="img" aria-label="Retention by weekly cohort, day one to day seven">
        <line className="dk-curve-axis" x1={PAD} y1={PLOT - PAD} x2={W - 12} y2={PLOT - PAD} />
        <line className="dk-curve-axis" x1={PAD} y1={16} x2={PAD} y2={PLOT - PAD} />
        {series.map((c, ci) => {
          const d = c.v.map((v, i) => `${i ? "L" : "M"}${xOf(i).toFixed(1)} ${yOf(v).toFixed(1)}`).join(" ");
          const cls = c.partial ? "dk-cohort-line is-partial" : c.lit ? "dk-cohort-line is-lit" : "dk-cohort-line";
          return (
            <g key={c.t} style={{ "--i": ci }}>
              <path className={cls} d={d} pathLength="100" />
              {c.lit || c.partial ? (
                <circle className={c.partial ? "dk-cohort-node is-partial" : "dk-cohort-node is-lit"} cx={xOf(c.v.length - 1)} cy={yOf(c.v.at(-1))} r="3" />
              ) : null}
            </g>
          );
        })}
        {Array.from({ length: days }, (_, i) => (
          <text key={i} className="dk-chart-tick" x={xOf(i)} y={PLOT + 12} textAnchor="middle">{`d${i + 1}`}</text>
        ))}
        <text className="dk-chart-tick" x={PAD - 6} y={yOf(max)} textAnchor="end">{`${Math.round(max)}%`}</text>
      </svg>
      <ul className="dk-cohort-key">
        {series.map((c) => (
          <li key={c.t} className={c.partial ? "is-partial" : c.lit ? "is-lit" : undefined}>
            <span className="dk-cohort-swatch" aria-hidden="true" />
            <span className="dk-cohort-t">{c.t}</span>
            <span className="dk-cohort-n">{c.n}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}

/* ---------- the startup curve ----------
   The canonical shape (Paul Graham's "The Process", and every chalkboard
   redraw of it since), rebuilt in the deck's own hand rather than pasted
   in as somebody's screenshot. Geometry lives here; the five annotations
   come from the slide so the copy stays in decks.js. */

const CURVE_MARKS = [
  { px: 108, py: 50, tx: 92, ty: 38, lx1: 95, ly1: 43, lx2: 103, ly2: 48, anchor: "end" },
  { px: 132, py: 150, tx: 150, ty: 134, lx1: 136, ly1: 148, lx2: 147, ly2: 140, anchor: "start" },
  { px: 215, py: 202, tx: 215, ty: 226, lx1: 215, ly1: 208, lx2: 215, ly2: 216, anchor: "middle" },
  { px: 365, py: 190, tx: 344, ty: 164, lx1: 362, ly1: 186, lx2: 348, ly2: 172, anchor: "end" },
  { px: 424, py: 94, tx: 408, ty: 62, lx1: 413, ly1: 68, lx2: 420, ly2: 86, anchor: "end" },
];

/* x is spent roughly in proportion to the real calendar: Feb is three
   weeks of a seven-month graph, Mar–Jun is four months of it. The trough
   is meant to feel long, because it was. */
const CURVE_PATH = [
  "M42 118", "L78 118",
  "C88 118 92 50 108 50",
  "C124 50 122 196 136 199",
  "C170 202 240 202 300 201",
  "C316 201 322 210 330 205",
  "C340 198 348 204 356 194",
  "C366 184 374 192 384 176",
  "C400 150 420 100 452 34",
].join(" ");

export function Curve({ marks = [], className = "" }) {
  const W = 480;
  const H = 250;

  return (
    <div className={`dk-curve ${className}`}>
      <svg viewBox={`0 0 ${W} ${H}`} role="img" aria-label="The startup curve: a spike, a long trough, then the climb">
        <line className="dk-curve-axis" x1="38" y1="20" x2="38" y2="232" />
        <line className="dk-curve-axis" x1="38" y1="232" x2="462" y2="232" />
        <path className="dk-curve-line" d={CURVE_PATH} />
        {marks.map((m, i) => {
          const g = CURVE_MARKS[i];
          if (!g) return null;
          return (
            <g key={m.t} className="dk-curve-mark" style={{ "--i": i }}>
              <line className="dk-curve-lead" x1={g.lx1} y1={g.ly1} x2={g.lx2} y2={g.ly2} />
              <circle className={`dk-node${m.lit ? " dk-node-lit" : ""}`} cx={g.px} cy={g.py} r="3" />
              <text className="dk-curve-t" x={g.tx} y={g.ty} textAnchor={g.anchor}>{m.t}</text>
              <text className="dk-curve-c" x={g.tx} y={g.ty + 12} textAnchor={g.anchor}>{m.c}</text>
            </g>
          );
        })}
        <text className="dk-curve-axis-label" x="458" y="245" textAnchor="end">time →</text>
      </svg>
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

/* ---------- bolt ---------- */

/* Lightning, the deck's shorthand for automation: energy that fires
   without a hand on the switch. Drawn as pixel cells — the same block
   language as the ASCII wordmark — with a hard-stepped flicker, because
   electricity doesn't ease. Detached spark cells flicker on their own
   clock so the two never sync visibly. */
const BOLT_CELLS = [
  [5, 0], [6, 0], [7, 0],
  [4, 1], [5, 1], [6, 1],
  [4, 2], [5, 2], [6, 2],
  [3, 3], [4, 3], [5, 3],
  [2, 4], [3, 4], [4, 4],
  [2, 5], [3, 5], [4, 5], [5, 5], [6, 5], [7, 5],
  [4, 6], [5, 6], [6, 6],
  [4, 7], [5, 7],
  [3, 8], [4, 8],
  [3, 9], [4, 9],
  [2, 10], [3, 10],
  [2, 11],
  [1, 12],
];
const BOLT_SPARKS = [
  [0, 6], [8, 3], [0, 10], [4, 12], [7, 7],
];
const px = (cells) => cells.map(([c, r]) => `M${c} ${r}h1v1h-1z`).join("");

export function Bolt({ className = "" }) {
  const bolt = px(BOLT_CELLS);
  return (
    <svg
      viewBox="0 0 10 14"
      className={`dk-art dk-bolt ${className}`}
      role="img"
      aria-label="A pixel-art lightning bolt pulsing with electricity"
    >
      <path className="dk-bolt-base" d={bolt} />
      <path className="dk-bolt-glow" d={bolt} />
      <path className="dk-bolt-spark" d={px(BOLT_SPARKS)} />
    </svg>
  );
}

/* ---------- sail (the logo, scaled up, pixel-drawn) ---------- */

/* The Ship AI mark: an upward sail with wind slashes cut through it,
   and three circuit lines running out the right to ringed nodes — the
   top node the only lit element. Cells, not curves, so it sits in the
   same block language as the wordmark. */
/* Slashes cut in from the left and stop short of the right edge, so
   the sail stays one shape with wind through it, not a stack of tiers. */
const SAIL_CUTS = { 8: 8, 12: 9, 15: 10 }; /* row → last column removed */
const SAIL_BODY = (() => {
  const cells = [];
  for (let r = 1; r <= 17; r++) {
    const half = Math.floor((r - 1) * 0.35);
    for (let c = 7 - half; c <= 8 + half; c++) {
      if (SAIL_CUTS[r] !== undefined && c <= SAIL_CUTS[r]) continue;
      cells.push([c, r]);
    }
  }
  return cells;
})();
/* the slashes trail off past the left edge */
const SAIL_STREAKS = [
  [2, 8], [3, 8],
  [1, 12], [2, 12],
  [0, 15], [1, 15],
];
/* three circuit lines climbing off the right edge, longest on top */
const SAIL_LINES = [
  [10, 6], [11, 5], [12, 5], [13, 4], [14, 4], [15, 3], [16, 3],
  [11, 9], [12, 8], [13, 8], [14, 7], [15, 7], [16, 6],
  [12, 12], [13, 11], [14, 11], [15, 10],
];
/* 3×3 ring, hollow centre — the big lit node */
const SAIL_RING = [
  [17, 1], [18, 1], [19, 1],
  [17, 2], [19, 2],
  [17, 3], [18, 3], [19, 3],
];
const SAIL_NODE_MID = [
  [17, 5], [18, 5], [17, 6], [18, 6],
];
const SAIL_NODE_LOW = [[16, 9], [16, 10]];

export function Sail({ className = "" }) {
  return (
    <svg
      viewBox="0 0 21 19"
      className={`dk-art dk-sail ${className}`}
      role="img"
      aria-label="The Ship AI logo in pixel blocks: an upward sail with three circuit lines ending in nodes"
    >
      <path className="dk-sail-body" d={px([...SAIL_BODY, ...SAIL_STREAKS])} />
      <path className="dk-sail-line" d={px(SAIL_LINES)} />
      <path className="dk-sail-node" d={px([...SAIL_NODE_MID, ...SAIL_NODE_LOW])} />
      <path className="dk-sail-ring" d={px(SAIL_RING)} />
    </svg>
  );
}

/* ---------- engine (the distribution machine) ---------- */

/* One piece of content enters the mark and leaves as three surfaces —
   drawn as a schematic: Manhattan-routed traces with junction dots,
   labelled surface chips, and an attribution rail returning along the
   bottom, because the loop closing IS the argument. The engine core is
   the pixel sail itself. */
const ENG_TRACES = [
  { d: "M226 70 L252 70 L252 40 L300 40", chipY: 27, dotY: 40, label: "Marketing site", bend: [252, 70, 252, 40] },
  { d: "M232 100 L300 100", chipY: 87, dotY: 100, label: "Socials" },
  { d: "M226 130 L252 130 L252 160 L300 160", chipY: 147, dotY: 160, label: "Paid ads", bend: [252, 130, 252, 160] },
];
const ENG_RETURN = "M412 52 L436 52 L436 198 L39 198 L39 130";

export function Engine({ className = "" }) {
  return (
    <svg
      viewBox="0 0 470 224"
      className={`dk-art dk-engine ${className}`}
      role="img"
      aria-label="Schematic: one piece of content enters the Ship AI sail and is routed to the marketing site, socials, and paid ads, with attribution reporting back"
    >
      {/* the one piece of content */}
      <rect className="dk-eng-doc" x="20" y="78" width="38" height="52" />
      <line className="dk-wire" x1="27" y1="92" x2="51" y2="92" />
      <line className="dk-wire" x1="27" y1="104" x2="51" y2="104" />
      <line className="dk-wire" x1="27" y1="116" x2="45" y2="116" />
      <text className="dk-eng-label" x="39" y="150" textAnchor="middle">
        One piece
      </text>
      <text className="dk-eng-label" x="39" y="164" textAnchor="middle">
        of content
      </text>

      {/* in-rail, running under the sail's left edge */}
      <line className="dk-eng-rail" x1="58" y1="104" x2="170" y2="104" />
      <path className="dk-arc" d="M58 104 L170 104" />

      {/* out-traces, Manhattan-routed like the logo's circuit lines */}
      {ENG_TRACES.map((t) => (
        <g key={t.label}>
          <path className="dk-eng-rail" d={t.d} fill="none" />
          <path className="dk-arc" d={t.d} />
          {t.bend ? <circle className="dk-node" cx={t.bend[2]} cy={t.bend[3]} r="2.5" /> : null}
          <circle className="dk-node dk-node-lit dk-eng-node" cx="300" cy={t.dotY} r="4.5" />
          <rect className="dk-eng-chip" x="300" y={t.chipY} width="112" height="26" />
          <text className="dk-eng-label dk-eng-chip-t" x="316" y={t.chipY + 17}>
            {t.label}
          </text>
        </g>
      ))}

      {/* the engine core: the sail itself, pixel-drawn, over the rails */}
      <g transform="translate(150 46) scale(6)">
        <path className="dk-eng-core" d={px([...SAIL_BODY, ...SAIL_STREAKS])} />
      </g>

      {/* attribution returns along the bottom — the loop closing */}
      <path className="dk-eng-return" d={ENG_RETURN} fill="none" />
      <circle className="dk-node" cx="436" cy="198" r="2.5" />
      <circle className="dk-node" cx="39" cy="198" r="2.5" />
      <text className="dk-eng-label" x="237" y="212" textAnchor="middle">
        attribution
      </text>
    </svg>
  );
}

/* ---------- dome ---------- */

/* A geodesic dome — desic's namesake. Concentric arcs, radial struts,
   and the zigzag diagonals that make triangles out of both: strength
   from many small identical members, which is also the pitch. */
export function Dome({ className = "" }) {
  const C = { x: 100, y: 158 };
  const rings = [80, 53, 27];
  const step = 30;
  const angles = [];
  for (let a = 0; a <= 180; a += step) angles.push(a);
  const pt = (r, deg) => {
    const rad = (deg * Math.PI) / 180;
    return { x: C.x + r * Math.cos(rad), y: C.y - r * Math.sin(rad) };
  };
  const d = (p, q) => `M${p.x.toFixed(1)} ${p.y.toFixed(1)} L${q.x.toFixed(1)} ${q.y.toFixed(1)}`;

  const struts = [];
  for (const a of angles) {
    /* radials, ring to ring */
    for (let k = 0; k < rings.length - 1; k++) struts.push(d(pt(rings[k], a), pt(rings[k + 1], a)));
    /* diagonals, one step around — the triangulation */
    if (a + step <= 180) {
      for (let k = 0; k < rings.length - 1; k++) struts.push(d(pt(rings[k], a), pt(rings[k + 1], a + step)));
    }
  }

  return (
    <svg
      viewBox="0 0 200 200"
      className={`dk-art dk-dome ${className}`}
      role="img"
      aria-label="A wireframe geodesic dome"
    >
      {rings.map((r) => (
        <path
          key={r}
          className="dk-wire"
          d={`M${C.x - r} ${C.y} A${r} ${r} 0 0 1 ${C.x + r} ${C.y}`}
        />
      ))}
      <line className="dk-wire" x1={C.x - rings[0]} y1={C.y} x2={C.x + rings[0]} y2={C.y} />
      {struts.map((s) => (
        <path key={s} className="dk-wire" d={s} />
      ))}
      {angles.map((a) => {
        const p = pt(rings[0], a);
        return <circle key={a} className="dk-node" cx={p.x.toFixed(1)} cy={p.y.toFixed(1)} r="2.5" />;
      })}
      <circle className="dk-node dk-node-lit" cx={C.x} cy={C.y - rings[0]} r="4" />
    </svg>
  );
}

/* ---------- mark ---------- */

/* Connect the dots — literally. Six numbered dots trace the sail;
   the first segments are already drawn, the current one is drawing
   itself, the rest wait as faint dashes. Finish the puzzle and the
   logo appears, which is the whole talk in one picture. */
const DOTS = [
  { x: 104, y: 22 },  /* 1 — apex */
  { x: 126, y: 86 },  /* 2 — right edge */
  { x: 148, y: 150 }, /* 3 — right base */
  { x: 104, y: 124 }, /* 4 — the notch */
  { x: 58, y: 152 },  /* 5 — left base */
  { x: 81, y: 87 },   /* 6 — left edge */
];
const seg = (a, b) => `M${DOTS[a].x} ${DOTS[a].y} L${DOTS[b].x} ${DOTS[b].y}`;

export function Mark({ className = "" }) {
  return (
    <svg
      viewBox="0 0 200 200"
      className={`dk-art dk-mark ${className}`}
      role="img"
      aria-label="A connect-the-dots puzzle mid-solve: numbered dots tracing the Ship AI sail"
    >
      {/* the completed outline */}
      <path className="dk-mark-done" d={`${seg(0, 1)} ${seg(1, 2)} ${seg(2, 3)} ${seg(3, 4)} ${seg(4, 5)} ${seg(5, 0)}`} />
      {/* a signal running the loop the dots just made */}
      <path
        className="dk-arc"
        d={`M${DOTS[0].x} ${DOTS[0].y} ${DOTS.slice(1)
          .map((p) => `L${p.x} ${p.y}`)
          .join(" ")} Z`}
      />
      {DOTS.map((p, i) => (
        <g key={i}>
          <circle className={`dk-node${i === 4 ? " dk-node-lit" : ""}`} cx={p.x} cy={p.y} r={i === 4 ? 4.5 : 3.5} />
          <text
            className="dk-mark-n"
            x={p.x + (p.x >= 104 ? 9 : -9)}
            y={p.y + (p.y < 100 ? -7 : 13)}
            textAnchor={p.x >= 104 ? "start" : "end"}
          >
            {i + 1}
          </text>
        </g>
      ))}
    </svg>
  );
}

/* ---------- net ---------- */

/* The network — nodes and hairline edges, with signal travelling two
   of them. The internet as the deck actually thinks of it: not a cloud,
   a graph you can put things into. */
export function Net({ className = "" }) {
  const nodes = [
    { x: 30, y: 60 },
    { x: 86, y: 24 },
    { x: 158, y: 44 },
    { x: 178, y: 112 },
    { x: 128, y: 168 },
    { x: 52, y: 152 },
    { x: 100, y: 96 },
  ];
  const edges = [
    [0, 1], [1, 2], [2, 3], [3, 4], [4, 5], [5, 0],
    [0, 6], [1, 6], [3, 6], [4, 6], [2, 6],
  ];

  return (
    <svg
      viewBox="0 0 200 200"
      className={`dk-art dk-net ${className}`}
      role="img"
      aria-label="A network graph of connected nodes with signals travelling between them"
    >
      {edges.map(([a, b]) => (
        <line
          key={`${a}-${b}`}
          className="dk-wire"
          x1={nodes[a].x}
          y1={nodes[a].y}
          x2={nodes[b].x}
          y2={nodes[b].y}
        />
      ))}
      <path className="dk-arc" d={`M${nodes[0].x} ${nodes[0].y} Q60 70 ${nodes[6].x} ${nodes[6].y}`} />
      <path className="dk-arc dk-arc-2" d={`M${nodes[6].x} ${nodes[6].y} Q150 80 ${nodes[3].x} ${nodes[3].y}`} />
      {nodes.map((n, i) => (
        <circle key={i} className={`dk-node${i === 6 ? " dk-node-lit" : ""}`} cx={n.x} cy={n.y} r={i === 6 ? 4.5 : 3.5} />
      ))}
    </svg>
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
