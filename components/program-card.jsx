import { ArrowRight, CalendarDays, Check, MapPin } from "lucide-react";
import Scene from "./scene";
import { PROGRAM_DETAILS } from "./program-details";
import "./program-card.css";

const STATUS = { running: "In progress", upcoming: "Upcoming", tbd: "Dates to be announced", past: "Past program" };

export default function ProgramCard({ program, heading = "h3" }) {
  const detail = PROGRAM_DETAILS[program.slug];
  const Icon = detail.icon;
  const H = heading;
  return (
    <li className={`program-card pcard program-tone-${detail.tone}`} data-status={program.status}>
      <a className="program-card-link" href={`/programs/${program.slug}`} aria-labelledby={`${program.slug}-title`} aria-describedby={`${program.slug}-description`}>
        <div className="pcard-art" aria-hidden="true">
          <Scene scene={detail.scene} cell={[5, 3]} />
          <span className="pcard-n">{detail.n}</span>
          <span className="pcard-icon"><Icon size={26} strokeWidth={1.5} /></span>
          <span className="pcard-stage">{detail.stage}</span>
        </div>
        <div className="program-card-body">
          <div className="program-card-topline">
            <span className="program-card-audience">{detail.audience}</span>
            <span className={`program-card-status ${program.status === "running" ? "is-running" : ""}`}>{STATUS[program.status]}</span>
          </div>
          <H id={`${program.slug}-title`}>{program.name}</H>
          <p className="program-card-description" id={`${program.slug}-description`}>{detail.description}</p>
          <p className="program-card-outcome"><Check size={16} aria-hidden="true" /><span>{detail.outcome}</span></p>
          <div className="program-card-details">
            <span><CalendarDays size={15} aria-hidden="true" />{program.sessions} sessions</span>
            <span><MapPin size={15} aria-hidden="true" />Phoenix</span>
          </div>
          <p className="program-card-schedule">{program.status === "tbd" ? "Next cohort dates to be announced" : program.status === "past" ? `Ran ${program.datesLabel}` : program.datesLabel}</p>
          <p className="program-card-venue">{program.venues.join(" & ")}</p>
          <div className="program-card-action"><span>Explore {program.name}</span><ArrowRight size={19} aria-hidden="true" /></div>
        </div>
      </a>
    </li>
  );
}
