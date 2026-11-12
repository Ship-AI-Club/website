"use client";

import { useState } from "react";

/* The skill pack as a manifest: one search field, then the skills
   grouped by session, one row each. A row shows the command and its
   "Use when" line and opens in place to the skill file, which is
   fetched from /skills/<name>/SKILL.md the first time it is opened. */

export function CopyButton({ text, label = "Copy", className }) {
  const [copied, setCopied] = useState(false);
  async function copy() {
    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
      setTimeout(() => setCopied(false), 1400);
    } catch {
      /* clipboard blocked: the text is still selectable */
    }
  }
  return (
    <button type="button" className={className} onClick={copy}>
      <span aria-live="polite">{copied ? "Copied" : label}</span>
    </button>
  );
}

function SkillRow({ skill }) {
  const [file, setFile] = useState(null); // null | "loading" | "failed" | text
  const href = `/skills/${skill.name}/SKILL.md`;

  async function onToggle(event) {
    if (!event.currentTarget.open || file !== null) return;
    setFile("loading");
    try {
      const response = await fetch(href);
      if (!response.ok) throw new Error("not found");
      setFile(await response.text());
    } catch {
      setFile("failed");
    }
  }

  const loaded = typeof file === "string" && file !== "loading" && file !== "failed";

  return (
    <details onToggle={onToggle}>
      <summary>
        <h3>/{skill.name}</h3>
        <p>{skill.when || skill.what}</p>
        <span className="kx-mark" aria-hidden="true">+</span>
      </summary>
      <div className="kx-open">
        {skill.when && <p>{skill.what}</p>}
        <div className="kx-file">
          <div className="window-bar"><b>{skill.name}/SKILL.md</b></div>
          {loaded ? (
            <pre tabIndex={0}><code>{file}</code></pre>
          ) : (
            <p className="kx-file-wait" role="status">{file === "failed" ? "The file didn't load. Use the download link." : "Loading the file"}</p>
          )}
        </div>
        <p className="kx-file-acts">
          {loaded && <CopyButton text={file} label="Copy file" className="btn btn-ghost btn-sm" />}
          <a className="btn btn-ghost btn-sm" href={href} download={`${skill.name}-SKILL.md`}>Download SKILL.md</a>
        </p>
      </div>
    </details>
  );
}

export default function SkillManifest({ total, sessions }) {
  const [query, setQuery] = useState("");
  const q = query.trim().toLowerCase();
  const matches = (skill) =>
    !q || skill.name.includes(q) || skill.what.toLowerCase().includes(q) || skill.when.toLowerCase().includes(q);
  const groups = sessions
    .map((session) => ({ ...session, shown: session.skills.filter(matches) }))
    .filter((session) => session.shown.length > 0);
  const showing = groups.reduce((sum, session) => sum + session.shown.length, 0);

  return (
    <div className="kx-col">
      <div className="kx-find">
        <label className="kx-sr" htmlFor="kx-search">Search skills</label>
        <input id="kx-search" type="search" value={query} onChange={(e) => setQuery(e.target.value)} placeholder={`Search ${total} skills`} autoComplete="off" />
        <span role="status">{q ? `${showing} showing` : "Grouped by session"}</span>
      </div>

      {groups.length === 0 && (
        <p className="kx-none">No skill matches &ldquo;{query.trim()}&rdquo;. Try a word from what you are stuck on, such as &ldquo;pricing&rdquo; or &ldquo;traffic&rdquo;.</p>
      )}

      {groups.map((session) => (
        <section key={session.slug} className="kx-group" aria-labelledby={`kx-${session.slug}`}>
          <div className="kx-head">
            <h2 id={`kx-${session.slug}`}><a href={session.href}>{session.title}</a></h2>
            <p className="kx-links">
              {session.guideHref && <a href={session.guideHref}>Guide</a>}
              {session.deckHref && <a href={session.deckHref}>Slides</a>}
              <a href={session.bundleHref} download>{session.count} skill{session.count === 1 ? "" : "s"} <span aria-hidden="true">↓</span></a>
            </p>
          </div>
          {session.shown.map((skill) => <SkillRow key={skill.name} skill={skill} />)}
        </section>
      ))}
    </div>
  );
}
