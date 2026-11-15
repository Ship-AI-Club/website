import { talkEnded, talkScheduled } from "../lib/talks";
import "../app/talks/talks.css";

export const SERIES_LEGS = [
  { name: "Start", line: "Form it, test the idea, price it, build it.", parts: [1, 2, 3] },
  { name: "Grow", line: "Add to it and put it in front of people.", parts: [4, 5, 6, 7] },
  { name: "Harden", line: "Make it durable, safe and watched.", parts: [8, 9, 10] },
  { name: "Run", line: "Your business operating system: the console and the team that run it.", parts: [11, 12] },
];

export const STANDALONE_GROUPS = [
  { name: "Operate", line: "Run the business with AI. No code needed.", slugs: ["ai-assistant", "ai-team", "workflow-automation", "business-os"] },
  { name: "Build", line: "Ship software your team or customers use.", slugs: ["internal-tool", "agent-product"] },
];

const pad = (n) => String(n).padStart(2, "0");

function shortDate(talk) {
  if (!talkScheduled(talk)) return "Date TBA";
  return new Date(talk.startISO).toLocaleDateString("en-US", { weekday: "short", month: "short", day: "numeric", timeZone: "America/Phoenix" });
}

function Title({ talk }) {
  const [lead, ...rest] = talk.eventTitle.split(talk.key);
  return <>{lead}<span className="key">{talk.key}</span>{rest.join(talk.key)}</>;
}

export function TalkCard({ talk, next, h = "h3" }) {
  const H = h;
  const ended = talkEnded(talk);
  return <li className={`card tk-card${next ? " is-next" : ""}`}>
    <p className="tk-card-top">
      <span>{talk.series ? `Part ${pad(talk.series)}` : "Any night"}</span>
      <span className={next ? "tk-pill tk-pill-live" : "tk-pill"}>{ended ? "Slides up" : shortDate(talk)}</span>
    </p>
    <H className="tk-card-title"><a className="tk-card-link" href={`/talks/${talk.slug}`}><Title talk={talk} /></a></H>
    <p className="tk-card-sum">{talk.summary}</p>
    <p className="tk-card-foot">
      {talk.example?.file ? <span className="tk-file">{talk.example.file}</span> : <span />}
      <a className="tk-slides" href={`/talks/${talk.slug}/deck`}>Slides <span aria-hidden="true">→</span></a>
    </p>
  </li>;
}

export function TalkGroups({ groups, talks, nextSlug, label }) {
  return <ol className="tk-legs">
    {groups.map((g) => {
      const items = (g.parts ? g.parts.map((n) => talks.find((t) => t.series === n)) : g.slugs.map((s) => talks.find((t) => t.slug === s))).filter(Boolean);
      if (!items.length) return null;
      return <li key={g.name} className="tk-leg">
        <div className="tk-leg-head">
          <span className="tk-leg-n">{label(g, items)}</span>
          <h3>{g.name}</h3>
          <p>{g.line}</p>
        </div>
        <ol className="tk-cards">{items.map((t) => <TalkCard key={t.slug} talk={t} next={nextSlug === t.slug} h="h4" />)}</ol>
      </li>;
    })}
  </ol>;
}
