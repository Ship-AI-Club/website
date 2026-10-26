"use client";

import { useState } from "react";
import { BookOpen } from "lucide-react";
import ProgramCard from "./program-card";
import { PROGRAM_DETAILS } from "./program-details";

const FILTERS = [{ value: "all", label: "All programs" }, { value: "learn", label: "Learn AI" }, { value: "build", label: "Build a product" }, { value: "launch", label: "Launch" }, { value: "grow", label: "Grow" }];


export default function ProgramExplorer({ programs }) {
  const [goal, setGoal] = useState("all");
  const visible = programs.filter(program => goal === "all" || PROGRAM_DETAILS[program.slug]?.goal === goal);
  return <section className="programs-explorer" id="explore-programs" aria-labelledby="explore-title">
    <div className="programs-section-heading"><div><p className="programs-eyebrow">Your next step</p><h2 id="explore-title">What do you want to build?</h2></div><p>Choose a goal. Find your starting point.</p></div>
    <div className="programs-filters" role="group" aria-label="Filter programs by goal">{FILTERS.map(filter => <button type="button" key={filter.value} aria-pressed={goal === filter.value} onClick={() => setGoal(filter.value)}>{filter.label}</button>)}</div>
    <p className="programs-results" role="status">{visible.length} {visible.length === 1 ? "program" : "programs"}{goal !== "all" ? ` · ${FILTERS.find(filter => filter.value === goal).label}` : " · Start at any stage"}</p>
    <ul className="programs-grid pcards">
      {visible.map(program => <ProgramCard key={program.slug} program={program} />)}
    </ul>
    <p className="programs-material-note"><BookOpen size={17} aria-hidden="true" /> Prefer to learn at your own pace? Explore a program for its published session materials and registration details.</p>
  </section>;
}
