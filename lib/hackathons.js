import { EVENT } from "./hackathon";
import { FOUNDER_WEEKEND, FW_CRITERIA } from "./founder-weekend";
import { RUBRIC, SCORE_MAX, SCORE_MIN, slugify, weightedScore, averageScore } from "./accounts";

export const FW_RUBRIC = FW_CRITERIA.map((c) => ({
  key: slugify(c.name).replace(/-/g, "_"),
  weight: 1,
  name: c.name,
  copy: `${c.parts.join(". ")}.`,
  guide: "1 = missing or not shown. 5 = solid with clear gaps. 10 = best in the room.",
}));

export const HACKATHONS = [
  {
    id: EVENT.id,
    name: EVENT.name,
    hub: "/programs/zero-to-launch/hackathon",
    deadline: EVENT.deadline,
    deadlineISO: EVENT.deadlineISO,
    rubric: RUBRIC,
    scoreMin: SCORE_MIN,
    scoreMax: SCORE_MAX,
    criteriaColumn: false,
  },
  {
    id: FOUNDER_WEEKEND.id,
    name: FOUNDER_WEEKEND.name,
    hub: FOUNDER_WEEKEND.path,
    deadline: FOUNDER_WEEKEND.deadline,
    deadlineISO: "2027-02-07T12:00:00-07:00",
    rubric: FW_RUBRIC,
    scoreMin: 1,
    scoreMax: 10,
    criteriaColumn: true,
  },
];

export const CURRENT_HACKATHON_ID = FOUNDER_WEEKEND.id;

export function hackathonById(id) {
  return HACKATHONS.find((h) => h.id === id) ?? null;
}

export function judgingRubric(hackathon) {
  const { rubric, scoreMin, scoreMax } = hackathon;
  return { rubric: rubric.map(({ key, name, copy, guide, weight }) => ({ key, name, copy, guide, weight })), scoreMin, scoreMax };
}

export function scoreValues(hackathon, row) {
  if (!row) return null;
  const source = hackathon.criteriaColumn ? row.criteria ?? {} : row;
  return Object.fromEntries(hackathon.rubric.map((c) => [c.key, source[c.key] ?? null]));
}

export function cardTotal(hackathon, row) {
  return weightedScore(scoreValues(hackathon, row), hackathon.rubric, hackathon.scoreMin, hackathon.scoreMax);
}

export function cardsAverage(hackathon, rows) {
  return averageScore(rows.map((row) => scoreValues(hackathon, row)), hackathon.rubric, hackathon.scoreMin, hackathon.scoreMax);
}
