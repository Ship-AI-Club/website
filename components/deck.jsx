import { sessionDateLabel } from "../lib/programs";
import { ArrowUpRight, Play } from "lucide-react";
import { Bolt, Chart, Cohorts, Curve, Dome, Engine, Flow, Funnel, Globe, Loop, Mark, Matrix, Net, Prism, QR, Sail, Scorecard, Timeline } from "./deck-art";
import codes from "../lib/qr.generated.json";

/* the brand asset library — slides pick one by name via `art` */
const ART = { bolt: Bolt, dome: Dome, globe: Globe, mark: Mark, net: Net, sail: Sail };

function Art({ name, className }) {
  const C = ART[name];
  if (!C) return null;
  return (
    <div className={className} aria-hidden="true">
      <C />
    </div>
  );
}

/* ------------------------------------------------------------------
   Slide renderer.

   One component per slide kind, all server-rendered, and no runtime
   dependency. The frame is a 16:9 container and every size inside it is
   a percentage of the frame's width, so a slide is the same composition
   at 1280×720 and on a 4K projector — just bigger.

   Motion: children carry a --i so the CSS can stagger their entrance
   once DeckControls marks the slide active. Nothing hides by default —
   the animations only arm when the `dk-motion` class is present, so a
   slide is never blank if JS is off or the observer fails.

   Slide kinds
     text     title · act · statement · agenda · bullets · split · quote · end
     data     metric · bignum · funnel · flow · timeline · loop · matrix ·
              chart · scorecard
     motif    prism
     command  terminal
     live     news · break · thanks · contact
------------------------------------------------------------------ */

/* wrap children so each gets a stagger index without every kind having
   to thread style={{"--i": n}} by hand */
function Stagger({ children }) {
  const items = (Array.isArray(children) ? children : [children]).filter(Boolean);
  return (
    <div className="dk-stagger">
      {items.map((child, i) => (
        <div key={i} className="dk-step" style={{ "--i": i }}>
          {child}
        </div>
      ))}
    </div>
  );
}

/* Notes are the speaker's aside, and they vary from a clause to a
   paragraph. A fixed 48ch measure turns the long ones into an eight-line
   column that runs into the chrome, so the measure widens (and the type
   steps down) as the note gets longer. Same block, three densities. */
function Note({ children, className = "" }) {
  if (!children) return null;
  const len = typeof children === "string" ? children.length : 0;
  const size = len > 400 ? " is-max" : len > 230 ? " is-long" : "";
  return <p className={`dk-note${size}${className ? ` ${className}` : ""}`}>{children}</p>;
}

function Heading({ children }) {
  return <h3 className="dk-h">{children}</h3>;
}

function Column({ col, tone }) {
  return (
    <div className={`dk-col dk-col-${tone}`}>
      <p className="dk-col-h">{col.h}</p>
      <ul>
        {col.items.map((i, n) => (
          <li key={i} style={{ "--i": n }}>
            {i}
          </li>
        ))}
      </ul>
    </div>
  );
}

export function Slide({ slide, workshop, program, index, total }) {
  const body = (() => {
    switch (slide.kind) {
      case "title":
        return (
          <div className="dk-title">
            <Stagger>
              <p className="dk-eyebrow">
                {program.name} · Session {workshop.n} · {sessionDateLabel(workshop)}
              </p>
              {slide.ascii ? (
                <>
                  <pre className="dk-ascii" aria-hidden="true">
                    {slide.ascii}
                  </pre>
                  <h2 className="dk-sr">{workshop.eventTitle}</h2>
                </>
              ) : (
                <h2>{workshop.eventTitle}</h2>
              )}
              <p className="dk-title-sub">{slide.sub}</p>
              <p className="dk-title-foot">
                <span>Ship AI</span>
                <span>Phoenix, Arizona</span>
                <span className="dk-title-hint">Press → to begin</span>
              </p>
              {/* the homepage's pixel signal, keeping the slide alive
                  while the room settles */}
              <span className="dk-trail" aria-hidden="true">
                {Array.from({ length: 8 }, (_, i) => (
                  <i key={i} style={{ "--i": i }} />
                ))}
              </span>
            </Stagger>
            <Art name={slide.art || "globe"} className="dk-title-art" />
          </div>
        );

      case "act":
        return (
          <div className="dk-act-inner">
            <span className="dk-act-n" aria-hidden="true">
              {slide.n}
            </span>
            {slide.art ? <Art name={slide.art} className="dk-act-art" /> : null}
            <Stagger>
              <p className="dk-eyebrow">{slide.eyebrow || "Act"}</p>
              <h2 className="dk-act-name">{slide.title}</h2>
              <p className="dk-act-copy">{slide.c}</p>
            </Stagger>
          </div>
        );

      case "statement":
        return (
          <div className="dk-statement">
            {slide.art ? <Art name={slide.art} className="dk-statement-art" /> : null}
            <Stagger>
              {slide.title ? <p className="dk-eyebrow">{slide.title}</p> : null}
              {/* text as an array renders each line as its own paragraph with
                  a gap — for a beat that wants more air than one run-on
                  sentence gives it. A plain string still renders as before. */}
              {Array.isArray(slide.text) ? (
                <div className="dk-big-stack">
                  {slide.text.map((line, i) => (
                    <p className="dk-big" key={i}>{line}</p>
                  ))}
                </div>
              ) : (
                <p className="dk-big">{slide.text}</p>
              )}
              {slide.tags?.length ? (
                <ul className="dk-tags">
                  {slide.tags.map((t, i) => (
                    <li key={t} style={{ "--i": i }}>
                      {t}
                    </li>
                  ))}
                </ul>
              ) : null}
              {slide.note ? <Note>{slide.note}</Note> : null}
            </Stagger>
          </div>
        );

      case "agenda":
        return (
          <>
            <Heading>{slide.title}</Heading>
            <ol className="dk-agenda">
              {slide.items.map((i, n) => (
                <li key={i.t ?? i} className={i.lit ? "is-lit" : undefined} style={{ "--i": n }}>
                  <span>{String(n + 1).padStart(2, "0")}</span>
                  {i.t ?? i}
                </li>
              ))}
            </ol>
          </>
        );

      case "timeline":
        return (
          <>
            <Heading>{slide.title}</Heading>
            <Timeline sessions={program.sessions} now={workshop.n} hasHackathon={program.hasHackathon} />
            <Note>{slide.note}</Note>
          </>
        );

      case "bullets":
        return (
          <>
            <Heading>{slide.title}</Heading>
            <ul className={`dk-items${slide.cols === 2 ? " is-two" : ""}`}>
              {slide.items.map((it, i) => (
                <li key={it.t} style={{ "--i": i }}>
                  <span className="dk-item-t">{it.t}</span>
                  <span className="dk-item-c">{it.c}</span>
                </li>
              ))}
            </ul>
            <Note>{slide.note}</Note>
          </>
        );

      case "split":
        return (
          <>
            <Heading>{slide.title}</Heading>
            {/* Two columns are a contrast by default — muted "vs" accent.
                `pair` marks the slide as two of the same thing rather than
                one against the other, so neither column reads as the loser. */}
            <div className={`dk-split${slide.pair ? " is-pair" : ""}`}>
              <Column col={slide.left} tone={slide.pair ? "accent" : "muted"} />
              <span className="dk-split-vs" aria-hidden="true">
                {slide.pair ? "and" : "vs"}
              </span>
              <Column col={slide.right} tone="accent" />
            </div>
            <Note>{slide.note}</Note>
          </>
        );

      case "metric":
        return (
          <>
            <Heading>{slide.title}</Heading>
            <div className="dk-metrics">
              {slide.items.map((m, i) => (
                <div key={m.l} className={m.lit ? "is-lit" : undefined} style={{ "--i": i }}>
                  <p className="dk-metric-v">{m.v}</p>
                  <p className="dk-metric-l">{m.l}</p>
                </div>
              ))}
            </div>
            <Note>{slide.note}</Note>
          </>
        );

      case "bignum":
        return (
          <div className="dk-bignum">
            <Stagger>
              <p className="dk-eyebrow">{slide.label}</p>
              <p className="dk-bignum-v">{slide.v}</p>
              {slide.delta ? <span className="dk-bignum-delta">{slide.delta}</span> : null}
              <p className="dk-bignum-c">{slide.c}</p>
            </Stagger>
          </div>
        );

      case "funnel":
        return (
          <>
            <Heading>{slide.title}</Heading>
            <Funnel stages={slide.stages} />
            <Note>{slide.note}</Note>
          </>
        );

      case "flow":
        return (
          <>
            <Heading>{slide.title}</Heading>
            <Flow steps={slide.steps} />
            <Note>{slide.note}</Note>
          </>
        );

      case "loop":
        return (
          <>
            <Heading>{slide.title}</Heading>
            <Loop steps={slide.steps} label={slide.label} />
            <Note>{slide.note}</Note>
          </>
        );

      case "matrix":
        return (
          <>
            <Heading>{slide.title}</Heading>
            <Matrix
              heads={slide.heads}
              rows={slide.rows}
              className={`${slide.rows.length > 6 ? "is-dense" : ""}${slide.num ? " is-num" : ""}`.trim()}
            />
            <Note>{slide.note}</Note>
          </>
        );

      case "cohorts":
        return (
          <>
            <Heading>{slide.title}</Heading>
            <Cohorts series={slide.series} days={slide.days} />
            <Note>{slide.note}</Note>
          </>
        );

      case "curve":
        return (
          <>
            <Heading>{slide.title}</Heading>
            <Curve marks={slide.marks} />
            <Note>{slide.note}</Note>
          </>
        );

      /* real creative, on screen. The note rides in the header rather than
         under the strip: the images want the height, and a paragraph
         stacked beneath four tiles lands in the chrome. */
      case "gallery":
        return (
          <>
            <div className="dk-gallery-head">
              <Heading>{slide.title}</Heading>
              <Note>{slide.note}</Note>
            </div>
            <ul className="dk-gallery">
              {slide.imgs.map((im, i) => (
                <li key={im.src} className="dk-step" style={{ "--i": i }}>
                  <img src={im.src} alt={im.alt || ""} />
                  {im.cap ? <span className="dk-gallery-cap">{im.cap}</span> : null}
                </li>
              ))}
            </ul>
          </>
        );

      case "shot":
        return (
          <div className="dk-shot">
            <div>
              <Heading>{slide.title}</Heading>
              <ul className="dk-shot-points">
                {slide.points.map((t, i) => (
                  <li key={t} className="dk-step" style={{ "--i": i }}>
                    {t}
                  </li>
                ))}
              </ul>
              <Note>{slide.note}</Note>
            </div>
            <div className="dk-shot-art dk-step" style={{ "--i": 1 }}>
              <img src={slide.img} alt={slide.imgAlt || slide.title} />
            </div>
          </div>
        );

      case "chart":
        return (
          <>
            <Heading>{slide.title}</Heading>
            <Chart
              points={slide.points}
              peak={slide.peak}
              peakLabel={slide.peakLabel}
              projValue={slide.projValue}
              projLabel={slide.projLabel}
              wide={slide.wide}
            />
            <Note>{slide.note}</Note>
          </>
        );

      case "scorecard":
        return (
          <>
            <Heading>{slide.title}</Heading>
            <Scorecard rows={slide.rows} />
            <Note>{slide.note}</Note>
          </>
        );

      case "prism":
        return (
          <div className="dk-prism-slide-inner">
            <div>
              <Heading>{slide.title}</Heading>
              <Note>{slide.note}</Note>
              <ul className="dk-prism-labels">
                {slide.channels.map((c, i) => (
                  <li key={c} style={{ "--i": i }}>
                    {c}
                  </li>
                ))}
              </ul>
            </div>
            <Prism rays={slide.rays} />
          </div>
        );

      /* the distribution engine — one big animated diagram, minimal text */
      case "engine":
        return (
          <>
            <Heading>{slide.title}</Heading>
            <Engine />
            <Note>{slide.note}</Note>
          </>
        );

      /* the "go run this" slide, for a room that lives in a terminal.
         `side` swaps the stack for a two-column composition — the same
         parts, a different silhouette, so two run slides in a row don't
         read as the same slide twice. */
      case "terminal": {
        const term = (
          <div className="dk-term">
            <div className="dk-term-bar">
              <span className="dk-term-dot" />
              <span className="dk-term-dot" />
              <span className="dk-term-dot" />
              <span>{slide.cwd || "~/your-product"}</span>
            </div>
            <div className="dk-term-body">
              <p className="dk-term-cmd">{slide.cmd}</p>
              {slide.out?.length > 0 && (
                <p className="dk-term-out">
                  {slide.out.map((line, i) => (
                    <span key={i}>{line}</span>
                  ))}
                  <span aria-hidden="true">
                    <i className="dk-term-cursor" />
                  </span>
                </p>
              )}
            </div>
          </div>
        );

        if (slide.side) {
          return (
            <div className="dk-run is-side">
              {term}
              <div className="dk-run-aside">
                <p className="dk-run-label">{slide.title}</p>
                <p className="dk-run-c">{slide.c}</p>
                <Note>{slide.note}</Note>
              </div>
            </div>
          );
        }

        return (
          <>
            <p className="dk-run-label">{slide.title}</p>
            {term}
            <p className="dk-run-c">{slide.c}</p>
            <Note>{slide.note}</Note>
          </>
        );
      }

      /* one story from the wire — ghost index numeral, headline, facts,
         and a prompt to argue about. The room talks; the slide listens. */
      case "news": {
        const base = slide.src ? 3 : 2;
        return (
          <div className="dk-news">
            <span className="dk-news-n" aria-hidden="true">
              {slide.n}
            </span>
            <p className="dk-eyebrow dk-step" style={{ "--i": 0 }}>
              {slide.eyebrow || "The brief"} · {slide.n} / {slide.of || "05"}
            </p>
            <h2 className="dk-news-h dk-step" style={{ "--i": 1 }}>
              {slide.title}
            </h2>
            {slide.src ? (
              <p className="dk-news-links dk-step" style={{ "--i": 2 }}>
                {slide.href ? (
                  <a className="dk-news-src" href={slide.href} target="_blank" rel="noreferrer">
                    {slide.src}
                    <ArrowUpRight aria-hidden="true" />
                  </a>
                ) : (
                  <span className="dk-news-src">{slide.src}</span>
                )}
                {slide.video ? (
                  <a className="dk-news-src dk-news-video" href={slide.video} target="_blank" rel="noreferrer">
                    <Play aria-hidden="true" />
                    Watch
                  </a>
                ) : null}
              </p>
            ) : null}
            <ul className="dk-news-facts">
              {slide.facts.map((f, i) => (
                <li key={f} className="dk-step" style={{ "--i": base + i }}>
                  {f}
                </li>
              ))}
            </ul>
            {slide.prompt ? (
              <p className="dk-note dk-step" style={{ "--i": base + slide.facts.length }}>
                {slide.prompt}
              </p>
            ) : null}
          </div>
        );
      }

      /* the countdown starts when the slide scrolls into view, and the
         bar drains in pixel steps — leave it up and it runs the break */
      case "break":
        return (
          <div className="dk-break">
            <Stagger>
              <p className="dk-eyebrow">{slide.eyebrow || "Intermission"}</p>
              <p className="dk-break-clock">{slide.clock || "05:00"}</p>
              <p className="dk-break-c">{slide.c}</p>
            </Stagger>
            <div className="dk-break-bar" style={{ "--secs": slide.secs || 300 }} aria-hidden="true">
              <span />
            </div>
          </div>
        );

      /* the community sponsor wall — every mark, white monochrome, one
         row. `wide` marks a one-line wordmark rendered shorter. */
      case "sponsors":
        return (
          <>
            <Heading>{slide.title}</Heading>
            <div className="dk-sponsors">
              {slide.orgs.map((o, i) => (
                <div key={o.name} className={`dk-sponsor${o.wide ? " is-wide" : ""}${o.color ? " is-color" : ""} dk-step`} style={{ "--i": i }}>
                  <img src={o.img} alt={o.name} />
                  <span className="dk-sponsor-name">{o.name}</span>
                  {o.tag ? <span className="dk-sponsor-tag">{o.tag}</span> : null}
                </div>
              ))}
            </div>
            <Note>{slide.note}</Note>
          </>
        );

      case "thanks":
        return (
          <div className="dk-thanks">
            <div>
              <Stagger>
                <p className="dk-eyebrow">{slide.eyebrow || "Thank you"}</p>
                <h2 className="dk-thanks-h">{slide.title}</h2>
                {slide.tag ? <p className="dk-thanks-tag">{slide.tag}</p> : null}
                <p className="dk-thanks-c">{slide.c}</p>
              </Stagger>
            </div>
            {slide.img ? (
              <div className={`dk-thanks-art dk-step${slide.color ? " is-color" : ""}`} style={{ "--i": 3 }}>
                <img src={slide.img} alt={slide.imgAlt || slide.title} />
              </div>
            ) : null}
          </div>
        );

      case "contact":
        return (
          <>
            {slide.art ? <Art name={slide.art} className="dk-contact-art" /> : null}
            <Heading>{slide.title}</Heading>
            <ul className="dk-contact-rows">
              {slide.rows.map((r, i) => (
                <li key={r.l} className={r.lit ? "is-lit" : undefined} style={{ "--i": i }}>
                  <span className="dk-contact-l">{r.l}</span>
                  <span className="dk-contact-v">{r.v}</span>
                  {r.c ? <span className="dk-contact-c">{r.c}</span> : null}
                </li>
              ))}
            </ul>
            <Note>{slide.note}</Note>
          </>
        );

      /* progressive walkthrough — a stage rail that lights up step by
         step, with the current stage's full explanation beside it.
         DeckControls owns the stepping: → advances the fragment, and
         only moves to the next slide once every stage has been walked.
         Without JS (print, iframe preview) everything is visible. */
      case "walk":
        return (
          <>
            <Heading>{slide.title}</Heading>
            <div className="dk-walk">
              <ol className="dk-walk-rail">
                {slide.steps.map((s, i) => (
                  <li key={s.t} className="dk-frag" data-i={i}>
                    <span className="dk-walk-dot" aria-hidden="true" />
                    <span className="dk-walk-t">{s.t}</span>
                    {s.c ? <span className="dk-walk-c">{s.c}</span> : null}
                  </li>
                ))}
              </ol>
              <div className="dk-walk-details">
                {slide.steps.map((s, i) => (
                  <div key={s.t} className="dk-frag-detail" data-i={i}>
                    <span className="dk-walk-n" aria-hidden="true">
                      {String(i + 1).padStart(2, "0")}
                    </span>
                    <p className="dk-walk-d">{s.d}</p>
                  </div>
                ))}
              </div>
            </div>
            <Note>{slide.note}</Note>
          </>
        );

      case "quote":
        return (
          <div className="dk-quote">
            <p>{slide.text}</p>
          </div>
        );

      case "end":
        return (
          <div className="dk-end">
            <div>
              <Stagger>
                <p className="dk-eyebrow">{slide.eyebrow || "Next"}</p>
                <h3>{slide.next}</h3>
                <p className="dk-end-c">{slide.c}</p>
                <p className="dk-end-foot">shipai.club · Free, always</p>
              </Stagger>
            </div>
            <QR code={codes[slide.qr || "discord"]} label={slide.qrLabel || "Join the Discord"} />
          </div>
        );

      default:
        return null;
    }
  })();

  return (
    <section
      className={`dk-slide dk-${slide.kind}-slide`}
      id={`slide-${index + 1}`}
      data-frags={slide.kind === "walk" ? slide.steps.length : undefined}
    >
      <div className="dk-frame">
        <div className="dk-body">{body}</div>
        <div className="dk-chrome">
          <span className="dk-chrome-brand">
            <svg viewBox="0 0 24 24" className="dk-chrome-mark" aria-hidden="true">
              {/* the sail, reduced to a glyph */}
              <path d="M7 3 L7 21 L17 12 Z" fill="currentColor" />
            </svg>
            Ship AI
          </span>
          <span className="dk-chrome-mid">{workshop.eventTitle}</span>
          <span className="dk-chrome-n">
            {String(index + 1).padStart(2, "0")}
            <span>/{String(total).padStart(2, "0")}</span>
          </span>
        </div>
      </div>
    </section>
  );
}
