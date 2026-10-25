import 'server-only';
import { FACILITATOR_GUIDES as INTRO } from './workshop-facilitators/intro.js';
import { FACILITATOR_GUIDES as BUSINESS } from './workshop-facilitators/business.js';
import { FACILITATOR_GUIDES as LABS } from './workshop-facilitators/labs.js';
import { FACILITATOR_GUIDES as EVENTS } from './workshop-facilitators/events.js';
import { WEBSITE_MARKETING_FACILITATOR } from './workshop-facilitators/website-marketing.js';
const notes={...INTRO,...BUSINESS,...LABS,...EVENTS,'vibe-coding-gtm':WEBSITE_MARKETING_FACILITATOR};
export function facilitatorGuideFor(slug) { return Object.hasOwn(notes,slug)?notes[slug]:null; }
