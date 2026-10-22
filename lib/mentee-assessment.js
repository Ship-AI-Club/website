export const LEVELS = ["Not yet", "Exploring", "Practicing", "Leading"];

export const AREAS = [
  {
    key: "fluency",
    title: "AI fluency",
    question: "How well do they use AI day to day?",
    criteria: [
      {
        key: "tools",
        title: "Tool use",
        levels: [
          "Rarely or never uses AI tools.",
          "Uses a chat assistant now and then.",
          "Uses AI every day for real work.",
          "Runs a deliberate toolkit and knows which tool fits which job.",
        ],
      },
      {
        key: "prompting",
        title: "Prompting and context",
        levels: [
          "One-line prompts, takes the first answer.",
          "Rewrites prompts until the answer improves.",
          "Gives context, examples and constraints up front.",
          "Keeps reusable prompts, projects or skills for repeat work.",
        ],
      },
      {
        key: "judgment",
        title: "Judging output",
        levels: [
          "Trusts or dismisses output wholesale.",
          "Spot-checks answers that look off.",
          "Checks facts and knows the common failure modes.",
          "Has a review step and can say where models fail on their work.",
        ],
      },
    ],
  },
  {
    key: "venture",
    title: "AI in their venture",
    question: "Where does AI fit in the business?",
    criteria: [
      {
        key: "opportunity",
        title: "Opportunity clarity",
        levels: [
          "No view on where AI fits.",
          "Vague ideas, like \"add AI\".",
          "Specific use cases tied to a customer problem.",
          "Use cases ranked by expected impact, with a first one chosen.",
        ],
      },
      {
        key: "data",
        title: "Data readiness",
        levels: [
          "Unsure what data they have or where it lives.",
          "Knows where the data lives.",
          "Data is clean and reachable for at least one use case.",
          "Product usage feeds data back that makes the product better.",
        ],
      },
      {
        key: "operations",
        title: "AI in operations",
        levels: [
          "No AI in how the company runs.",
          "A few people use AI on their own.",
          "At least one workflow runs on AI, like support, sales or content.",
          "Several AI workflows, with time or cost saved measured.",
        ],
      },
    ],
  },
  {
    key: "building",
    title: "Building with AI",
    question: "How fast can they ship with AI?",
    criteria: [
      {
        key: "agents",
        title: "Coding agents",
        levels: [
          "Doesn't use AI to write code.",
          "Has pasted code from a chat assistant.",
          "Uses coding agents like Claude Code or Cursor on real code.",
          "Agents are the default workflow, with review and tests in place.",
        ],
      },
      {
        key: "speed",
        title: "Shipping speed",
        levels: [
          "Months between releases.",
          "A release every few weeks.",
          "Ships every week.",
          "Ships daily and prototypes in hours.",
        ],
      },
      {
        key: "stack",
        title: "AI in the product",
        levels: [
          "No technical path yet, no developer or no-code tool.",
          "A no-code or single-API prototype.",
          "An AI feature live with customers.",
          "AI in production with evals, monitoring and cost tracking.",
        ],
      },
    ],
  },
  {
    key: "risk",
    title: "Risk and adoption",
    question: "Can they adopt AI safely and bring the team along?",
    criteria: [
      {
        key: "privacy",
        title: "Privacy and data handling",
        levels: [
          "Hasn't thought about what goes into AI tools.",
          "Aware of the risk, no rules yet.",
          "Clear rules on what data can go where.",
          "Written policy, vendor terms checked, disclosed to customers.",
        ],
      },
      {
        key: "cost",
        title: "Cost and vendors",
        levels: [
          "No idea what AI costs them.",
          "Tracks AI subscriptions.",
          "Knows the cost per use of their AI features.",
          "Has modelled cost at scale and has a fallback vendor.",
        ],
      },
      {
        key: "team",
        title: "Team buy-in",
        levels: [
          "Team is resistant, or there's no plan for the team.",
          "One or two enthusiasts.",
          "The team uses AI with shared practices.",
          "AI is part of how the team hires, trains and measures work.",
        ],
      },
    ],
  },
];

export const CRITERIA = AREAS.flatMap((area) => area.criteria.map((c) => ({ ...c, area: area.key, key: `${area.key}.${c.key}` })));

export function levelLabel(score) {
  if (score == null) return "Not assessed";
  return LEVELS[Math.min(3, Math.max(0, Math.round(score) - 1))];
}

function mean(values) {
  if (!values.length) return null;
  return Math.round((values.reduce((a, b) => a + b, 0) / values.length) * 10) / 10;
}

export function cleanScores(input) {
  const out = {};
  for (const c of CRITERIA) {
    const n = Number(input?.[c.key]);
    if (Number.isInteger(n) && n >= 1 && n <= 4) out[c.key] = n;
  }
  return out;
}

export function summarize(scores) {
  const clean = cleanScores(scores);
  const areas = AREAS.map((area) => {
    const values = area.criteria.map((c) => clean[`${area.key}.${c.key}`]).filter((n) => n != null);
    const score = mean(values);
    return { key: area.key, title: area.title, score, label: levelLabel(score), scored: values.length, total: area.criteria.length };
  });
  const scoredAreas = areas.filter((a) => a.score != null);
  const overall = mean(scoredAreas.map((a) => a.score));
  const focus = CRITERIA.filter((c) => clean[c.key] != null && clean[c.key] < 4)
    .sort((a, b) => clean[a.key] - clean[b.key])
    .slice(0, 3)
    .map((c) => ({ key: c.key, title: c.title, area: AREAS.find((a) => a.key === c.area).title, now: c.levels[clean[c.key] - 1], next: c.levels[clean[c.key]] }));
  return { areas, overall, label: levelLabel(overall), focus, scored: Object.keys(clean).length };
}
