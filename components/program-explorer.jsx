"use client";

import { useState } from "react";
import { ArrowRight, BookOpen, CalendarDays, MapPin, MessageSquare, Code2, Rocket, Repeat2, Check } from "lucide-react";

const DETAILS = {
  "day-zero": { goal: "learn", stage: "Learn the tools", audience: "For AI beginners", icon: MessageSquare, tone: "blue", description: "Turn a blank chat box into useful skills, scheduled routines, a website, and a support agent.", outcome: "AI workflows you can use every day", steps: ["Skills", "Routines", "Agents"] },
  "the-first-build": { goal: "build", stage: "Build the product", audience: "For first-time product builders", icon: Code2, tone: "violet", description: "Learn the stack, connect interfaces and data, and direct an agent to build and demo a focused product.", outcome: "A working product you can demo", steps: ["Prompt", "Build", "Demo"] },
  "zero-to-launch": { goal: "launch", stage: "Take it to market", audience: "For builders ready to launch", icon: Rocket, tone: "green", description: "Find your audience, sharpen your positioning, and ship a marketing site. Six free sessions lead into the GTM hackathon.", outcome: "A marketing site ready for launch", steps: ["Position", "Market", "Launch"] },
  "growth-loops": { goal: "grow", stage: "Keep people coming back", audience: "For teams with a live product", icon: Repeat2, tone: "amber", description: "Measure the customer journey, improve activation and retention, and ship a growth loop you can track.", outcome: "A measurable growth loop", steps: ["Measure", "Improve", "Repeat"] },
};
const FILTERS = [{ value: "all", label: "All programs" }, { value: "learn", label: "Learn AI" }, { value: "build", label: "Build a product" }, { value: "launch", label: "Launch" }, { value: "grow", label: "Grow" }];
const STATUS = { running: "In progress", upcoming: "Upcoming", tbd: "Dates to be announced", past: "Past program" };

export default function ProgramExplorer({ programs }) {
  const [goal, setGoal] = useState("all");
  const visible = programs.filter(program => goal === "all" || DETAILS[program.slug]?.goal === goal);
  return <section className="programs-explorer" id="explore-programs" aria-labelledby="explore-title">
    <div className="programs-section-heading"><div><p className="programs-eyebrow">Your next step</p><h2 id="explore-title">What do you want to build?</h2></div><p>Choose a goal. Find your starting point.</p></div>
    <div className="programs-filters" role="group" aria-label="Filter programs by goal">{FILTERS.map(filter => <button type="button" key={filter.value} aria-pressed={goal === filter.value} onClick={() => setGoal(filter.value)}>{filter.label}</button>)}</div>
    <p className="programs-results" role="status">{visible.length} {visible.length === 1 ? "program" : "programs"}{goal !== "all" ? ` · ${FILTERS.find(filter => filter.value === goal).label}` : " · Start at any stage"}</p>
    <ul className="programs-grid">
      {visible.map(program => {
        const detail = DETAILS[program.slug];
        const Icon = detail.icon;
        return <li key={program.slug} className={`program-card program-tone-${detail.tone}`}>
          <a className="program-card-link" href={`/programs/${program.slug}`} aria-labelledby={`${program.slug}-title`} aria-describedby={`${program.slug}-description`}>
            <div className="program-card-art" aria-hidden="true"><span className="program-art-icon"><Icon size={30} strokeWidth={1.5} /></span><div className="program-art-flow">{detail.steps.map((step, i) => <span key={step} className="program-art-step"><span>{step}</span>{i < 2 && <ArrowRight size={15} />}</span>)}</div><span className="program-art-stage">{detail.stage}</span></div>
            <div className="program-card-body">
              <div className="program-card-topline"><span className="program-card-audience">{detail.audience}</span><span className={`program-card-status ${program.status === "running" ? "is-running" : ""}`}>{STATUS[program.status]}</span></div>
              <h3 id={`${program.slug}-title`}>{program.name}</h3>
              <p className="program-card-description" id={`${program.slug}-description`}>{detail.description}</p>
              <p className="program-card-outcome"><Check size={16} aria-hidden="true" /><span>{detail.outcome}</span></p>
              <div className="program-card-details"><span><CalendarDays size={15} aria-hidden="true" />{program.sessions} sessions</span><span><MapPin size={15} aria-hidden="true" />Phoenix</span></div>
              <p className="program-card-schedule">{program.status === "tbd" ? "Next cohort dates to be announced" : program.datesLabel}</p>
              <p className="program-card-venue">{program.venues.join(" & ")}</p>
              <div className="program-card-action"><span>Explore {program.name}</span><ArrowRight size={19} aria-hidden="true" /></div>
            </div>
          </a>
        </li>;
      })}
    </ul>
    <p className="programs-material-note"><BookOpen size={17} aria-hidden="true" /> Prefer to learn at your own pace? Explore a program for its published session materials and registration details.</p>
  </section>;
}
