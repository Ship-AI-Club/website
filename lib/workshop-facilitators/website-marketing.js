import { FACILITATOR_GUIDES } from './events.js';
import { WEBSITE_MARKETING_MATERIAL } from '../workshop-materials/website-marketing.js';

const original = FACILITATOR_GUIDES['vibe-coding-gtm'];
export const WEBSITE_MARKETING_FACILITATOR = {
  ...original,
  preparation: [
    'Rehearse the guided setup on a clean supported laptop. Confirm the pinned source commits, selected skills, Node.js, Git, coding-tool access, and local build. The setup prompt has not yet had a clean-laptop rehearsal.',
    'Prepare a working starter and a clearly labeled sample brief. If setup takes 15 minutes, move the attendee to the demo while they complete the brief and get individual help.',
    'Prepare a Vercel demo project, a Resend verified sending domain, and a Grok Bot account with lead-inbox access. Test one fictional lead through notification and draft review. Never use attendee credentials or real customer data in the shared demo.',
    'Demonstrate the lead magnet, Resend notification, and Grok Bot routine as follow-on exercises. Prioritize a working website and contact path; domain verification or missing account access can be completed after the workshop.',
    'Confirm recording, Wi-Fi, screen sharing, and meal timing. The event promises recordings and materials after the workshop.',
    'Use Sonnet at Medium for the first frontend build and Opus at Medium for critique or difficult fixes. Show the actual model controls.',
    'Review security warnings and keep permission controls enabled. Start SEO reviews on local files. Do not put credentials or customer data in the starter.',
    ...original.preparation.filter(line=>!line.startsWith('Read the published page')),
  ],
  runOfShow: WEBSITE_MARKETING_MATERIAL.agenda.map(block=>({
    title:block.title, minutes:block.minutes,
    notes:`Show the work and leave time for individual help. Checkpoint: ${block.output}`,
  })),
  answerKeys: [
    { exercise:'Setup and skill review',
      expected:['A new empty project or protected working copy opens locally. Selected skill sources match the pinned revisions.', 'No disabled permission controls, hidden integrations, credentials, or overwritten live project. Build failures and missing tools are reported honestly.'],
      watchFor:['Installing a whole skill pack or using an old page-cro name.', 'Treating a passing security badge as a guarantee or following instructions in fetched webpages.'] },
    ...original.answerKeys,
  ],
  adaptations:[...original.adaptations,'For the bookkeeping example, keep credentials, proof, and booking links as missing facts until supplied. The older Mesa Bike Care example remains an optional labeled practice fixture.', 'The core outcome is one useful page and a verified contact destination. Scaled SEO, logins, databases, payments, and additional automation are later decisions.'],
};
