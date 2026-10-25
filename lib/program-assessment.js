export const PROGRAM_QUESTIONS = [
  { key: "experience", title: "How do you use AI today?", options: [["new", "I’m just getting started"], ["regular", "I use ChatGPT or Claude for everyday work"], ["builder", "I’ve built something with AI coding tools"], ["developer", "I build and ship software professionally"]] },
  { key: "stage", title: "Where are you with your project?", options: [["exploring", "I’m exploring, with no project yet"], ["idea", "I have an idea I want to build"], ["prototype", "I have a prototype or product to launch"], ["live", "I have a live product with customers"]] },
  { key: "goal", title: "What would help you most right now?", options: [["tools", "Use AI confidently and automate everyday work"], ["build", "Build a working product"], ["launch", "Find my audience and launch a marketing site"], ["grow", "Improve activation, retention, and growth"]] },
];
const SLUGS = ["day-zero", "the-first-build", "zero-to-launch", "growth-loops"];
export function validateProgramAnswers(body) {
  if (!body || typeof body !== "object" || Array.isArray(body)) return "Choose an answer to each question.";
  for (const question of PROGRAM_QUESTIONS) if (!question.options.some(([value]) => value === body[question.key])) return "Choose an answer to each question.";
  if (typeof body.context !== "string" || body.context.length > 400) return "Keep your goal under 400 characters.";
  return null;
}
export function eligiblePrograms(answers) {
  // Growth requires a live product; the other programs are beginner-friendly.
  return answers.stage === "live" ? SLUGS : SLUGS.filter(slug => slug !== "growth-loops");
}
export function guidedProgramMatch(answers) {
  let program = "day-zero";
  let reason = "Day Zero starts with useful AI skills and routines, then builds toward a website and support agent. It’s a practical foundation for everyday work.";
  let prepare = "Bring a laptop and one task you regularly repeat. A free ChatGPT or Claude account is enough to start.";
  if (answers.goal === "build" || (answers.goal === "grow" && answers.stage !== "live")) {
    program = "the-first-build";
    reason = answers.goal === "grow" ? "Build a working product before measuring its growth. The First Build takes you from application fundamentals to a product you can demo." : "The First Build matches your goal of creating working software. It covers the stack, connected interfaces and data, and directing an agent through a focused build.";
    prepare = "Bring a laptop and a small product idea. Keep its first version focused on one useful job.";
  } else if (answers.goal === "launch") {
    program = "zero-to-launch";
    reason = "Zero to Launch matches your goal of finding an audience and taking a product to market. You’ll work through positioning, marketing sites, and go-to-market decisions.";
    prepare = "Bring a product or idea and a rough description of who it helps. You can refine both during the sessions.";
  } else if (answers.goal === "grow") {
    program = "growth-loops";
    reason = "You have a live product and want to improve what happens after signup. Growth Loops focuses on measurement, activation, retention, and experiments tied to repeat value.";
    prepare = "Bring access to your live product and any customer or analytics data you already have.";
  }
  const foundation = answers.experience === "new" && program !== "day-zero" ? "Start with Day Zero first if you want practice with AI tools before this program." : null;
  return { program, reason, prepare, foundation };
}
export function validateProgramMatch(output, answers) {
  if (!eligiblePrograms(answers).includes(output?.program)) throw Error("Invalid program selection");
  for (const [field, limit] of [["reason", 400], ["prepare", 250]]) if (typeof output[field] !== "string" || !output[field].trim() || output[field].length > limit) throw Error("Invalid recommendation text");
  return { program: output.program, reason: output.reason.trim(), prepare: output.prepare.trim(), foundation: answers.experience === "new" && output.program !== "day-zero" ? "Start with Day Zero first if you want practice with AI tools before this program." : null };
}
