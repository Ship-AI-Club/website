"use client";

import { useEffect, useState } from "react";

/* The follow-along guide as a passage plan: a board with the count, one
   closed row of setup, then the steps down a route with the ship at the
   next one to do. Ticking a step's "done looks like" folds it away.
   Progress lives in this browser only (localStorage, keyed per guide):
   no account, nothing sent anywhere. */

function Command({ text }) {
  const [copied, setCopied] = useState(false);
  async function copy() {
    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
      setTimeout(() => setCopied(false), 1400);
    } catch {
      /* clipboard blocked: the command is still selectable */
    }
  }
  return (
    <span className="gx-cmd">
      <code>{text}</code>
      <button type="button" onClick={copy} aria-label={`Copy ${text}`}>
        <span aria-live="polite">{copied ? "Copied" : "Copy"}</span>
      </button>
    </span>
  );
}

export default function GuidePlan({ storageKey, summary, context, files, setup, setupOpen, steps, output }) {
  const [done, setDone] = useState([]);

  useEffect(() => {
    try {
      const saved = JSON.parse(localStorage.getItem(storageKey) || "[]");
      if (Array.isArray(saved)) setDone(saved.filter((i) => Number.isInteger(i) && i >= 0 && i < steps.length));
    } catch {
      /* storage blocked or empty: start with nothing ticked */
    }
  }, [storageKey, steps.length]);

  function toggle(index) {
    setDone((current) => {
      const next = current.includes(index) ? current.filter((i) => i !== index) : [...current, index];
      try {
        localStorage.setItem(storageKey, JSON.stringify(next));
      } catch {
        /* storage blocked: the ticks last for this visit */
      }
      return next;
    });
  }

  const here = steps.findIndex((_, index) => !done.includes(index));
  const arrived = here === -1;

  return (
    <>
      <div className="gx-board-wrap">
        <aside className="window gx-board" aria-label="Guide progress and files">
          <div className="window-bar"><b>{summary}</b><span>{context}</span></div>
          <div className="gx-row">
            <p className="gx-count" role="status">
              <b>{done.length} of {steps.length} done</b>
              <span>Saved in this browser</span>
            </p>
            <p className="gx-files">
              {files.map((file) => (
                <a key={file.label} href={file.href} download={file.download || undefined} {...(file.external ? { target: "_blank", rel: "noreferrer" } : {})}>
                  {file.label} <span aria-hidden="true">{file.download ? "↓" : "→"}</span>
                </a>
              ))}
            </p>
          </div>
        </aside>
      </div>

      <div className="gx-col">
        <details className="gx-setup" open={setupOpen || undefined}>
          <summary><h2>Before you start</h2><span className="gx-setup-tag">{setup.title}</span><span className="gx-mark" aria-hidden="true">+</span></summary>
          {setup.note && <p className="gx-setup-note">{setup.note}</p>}
          <ol>
            {setup.steps.map((item) => (
              <li key={item.t}>
                <b>{item.t}</b>
                <p>{item.c}</p>
                {item.run && <Command text={item.run} />}
              </li>
            ))}
          </ol>
        </details>

        <div className="gx-plan">
          <ol className="vy-route">
            {steps.map((step, index) => {
              const ticked = done.includes(index);
              return (
                <li key={step.t} className={["vy-stop", index === here ? "has-ship" : "", ticked ? "is-done" : ""].join(" ").trim()}>
                  <span className="vy-dot" aria-hidden="true" />
                  <article className="vy-card gx-step">
                    <h3>{step.t}</h3>
                    {!ticked && (
                      <div className="gx-body">
                        {step.run && <Command text={step.run} />}
                        <p>{step.c}</p>
                      </div>
                    )}
                    <label className="gx-done">
                      <input type="checkbox" checked={ticked} onChange={() => toggle(index)} />
                      <span className="gx-box" aria-hidden="true" />
                      <span><span className="gx-label">Done looks like</span>{step.good || "This step is finished."}</span>
                    </label>
                  </article>
                </li>
              );
            })}
          </ol>
          <p className={arrived ? "gx-arrive has-ship" : "gx-arrive"}>
            <span className="gx-label">{arrived ? "Arrived. You leave with" : "You leave with"}</span>
            {output.path && <code>{output.path}</code>}{output.rest}
          </p>
        </div>
      </div>
    </>
  );
}
