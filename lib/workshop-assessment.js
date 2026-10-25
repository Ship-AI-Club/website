import { titleCase } from "./title-case.js";
import { UPCOMING_WORKSHOPS } from "./workshops.js";
import { VIBE_GTM, workshopPrice } from "./vibe-gtm-workshop.js";
import { WORKSHOP_PRESENTATION } from "./workshop-presentation.js";

export const ASSESSMENT_OPTIONS = {
  experience: [ ["new", "Just getting started"], ["ai-user", "I use AI tools regularly"], ["vibe-coder", "I’ve built with AI coding tools"], ["developer", "I ship software professionally"] ],
  role: [ ["founder", "Founder / business owner"], ["marketing", "Marketing / creative"], ["sales", "Sales / GTM"], ["engineering", "Engineering / product"], ["operations", "Operations / leadership"], ["support", "Customer support"], ["consultant", "Consultant / agency"] ],
  focus: [ ["agents", "My first useful agent"], ["engineering", "Build and ship software"], ["brand", "Brand and marketing site"], ["content", "Content and social media"], ["sales", "Leads and sales"], ["support", "Customer support"], ["operations", "Knowledge and operations"], ["intelligence", "Reporting and decisions"] ],
};
export function validateAssessment(body) {
  if (!body || typeof body !== "object" || Array.isArray(body)) return "Choose your experience, role, and focus.";
  for (const field of Object.keys(ASSESSMENT_OPTIONS)) {
    if (!ASSESSMENT_OPTIONS[field].some(([id]) => id === body[field])) return "Choose your experience, role, and focus.";
  }
  if (typeof body.goal !== "string" || body.goal.length > 240) return "Keep your goal under 240 characters.";
  if (typeof body.requestId !== "string" || !/^[a-f0-9]{8}-[a-f0-9]{4}-[a-f0-9]{4}-[a-f0-9]{4}-[a-f0-9]{12}$/i.test(body.requestId)) return "Refresh the assessment and try again.";
  return null;
}
export function assessmentCatalogue(now = Date.now()) {
  const upcoming = UPCOMING_WORKSHOPS.map(w => ({slug:w.slug,name:titleCase(WORKSHOP_PRESENTATION[w.slug]?.title || w.name),price:w.price,format:w.duration || "Hands-On Workshop",schedule:"Date TBD · Free waitlist",summary:w.promise,prerequisite:w.prerequisite}));
  if (now < new Date(VIBE_GTM.end).getTime()) upcoming.push({slug:"vibe-coding-gtm",name:VIBE_GTM.name,price:workshopPrice(now).amount,format:"In-Person Workshop",schedule:"October 10, 2026 · Phoenix · 9 AM–1 PM MST",summary:VIBE_GTM.description,prerequisite:"Light vibe coding experience is ideal. Attend in person in Phoenix."});
  return upcoming;
}
export function eligibleFirstWorkshops(experience, catalogue) {
  const coding = ["build-your-first-agentic-workflow", "agentic-engineering", "ai-prototype-to-production", "build-your-ai-software-factory"];
  return catalogue.filter(w => experience === "developer" || (!coding.includes(w.slug) || (experience === "vibe-coder" && !["ai-prototype-to-production","build-your-ai-software-factory"].includes(w.slug))));
}
export function publicRecommendation(output, catalogue) {
  const first = catalogue.find(w => w.slug === output?.first);
  const next = catalogue.find(w => w.slug === output?.next);
  if (!first || !next || first.slug === next.slug) throw Error("Invalid workshop selection");
  for (const [field, cap] of [["reason",320],["prepare",220]]) {
    if (typeof output[field] !== "string" || !output[field].trim() || output[field].length > cap) throw Error("Invalid recommendation text");
  }
  const card = w => ({slug:w.slug,name:w.name,price:w.price,format:w.format,schedule:w.schedule,path:`/workshops/${w.slug}`});
  return {first:card(first),next:card(next),reason:output.reason.trim(),prepare:output.prepare.trim()};
}
