import 'server-only';
import { WORKSHOP_MATERIALS as INTRO } from './workshop-materials/intro.js';
import { WORKSHOP_MATERIALS as BUSINESS } from './workshop-materials/business.js';
import { WORKSHOP_MATERIALS as LABS } from './workshop-materials/labs.js';
import { WORKSHOP_MATERIALS as EVENTS } from './workshop-materials/events.js';
import { WEBSITE_MARKETING_MATERIAL } from './workshop-materials/website-marketing.js';
const materials={...INTRO,...BUSINESS,...LABS,...EVENTS,'vibe-coding-gtm':WEBSITE_MARKETING_MATERIAL};
export function workshopMaterialsFor(slug) { return Object.hasOwn(materials,slug)?materials[slug]:null; }
