import { CONSULTING_EXAMPLE } from './marketing-site-visuals.js';

export const FX_DECK_PRESETS = [
  { id: 'copywriting', label: 'Write the hero', prompt: 'Write a headline, subhead, and one CTA for this business. Keep it specific and under 90 words.' },
  { id: 'copy-editing', label: 'Sharpen the copy', prompt: 'Improve this draft: “Unlock your potential. We provide innovative consulting solutions that transform businesses of every size.” Explain the two most useful changes. Stay under 120 words.' },
  { id: 'cro', label: 'Critique the page', prompt: 'Review a consulting page with the vague draft hero, an unsourced “trusted by thousands” claim, and three competing CTAs: Contact, Newsletter, Book a discovery call. Recommend the three most useful changes, under 120 words.' },
];
export const FX_DECK_BRIEF = {
  scenario: 'Fictional operations consulting business for workshop practice. Not a real client or customer result.',
  business: `${CONSULTING_EXAMPLE.name} — ${CONSULTING_EXAMPLE.category}`,
  audience: CONSULTING_EXAMPLE.audience,
  offer: 'Workflow audits, 90-day roadmaps, and implementation support. Find delivery bottlenecks and agree on priorities and owners.',
  primaryAction: CONSULTING_EXAMPLE.primaryAction,
  firstStep: 'Book a discovery call and describe one recurring workflow problem. After discovery, receive a scoped proposal before deciding to engage.',
  sampleWork: 'A sample workflow diagnostic: request → handoff → delivery. A missing handoff owner is the example friction; naming an owner and done criteria is the example first change. No client data or measured outcome.',
  proof: 'No verified customer counts, testimonials, pricing amounts, or performance results supplied',
  voice: 'Plain, specific, confident; no hype or invented claims',
};
