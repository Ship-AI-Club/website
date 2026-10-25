import { MARKETING_SITE_DECK } from './marketing-site-deck.js';

const shared = mode => MARKETING_SITE_DECK.filter(s => s.mode === mode);
const growth = (mode, eyebrow, title, lead, takeaway, extra = {}) => ({ kind:'growth', mode, eyebrow, title, lead, takeaway, ...extra });

export const GROWTH_ENGINEERING_DECK = [
  growth('opening','Zero to Launch · Session 06 · Agency growth','Build a client’s marketing with AI','Our agency has its first client: Desert Shine, a Phoenix housecleaning business.','Tonight: one website → reusable creative → a campaign the client can approve.'),
  ...shared('company'),
  ...shared('sponsor'),
  growth('brief','Our first client','Meet Desert Shine','We’re the agency. Desert Shine is the client. The goal is more qualified cleaning inquiries.','Fictional client · Phoenix and the service list are demo assumptions to confirm with a real client.'),
  growth('journey','The workflow','One brief. A repeatable campaign.','The website gives us the message, design, and services for every asset.','Keep the same promise and quote CTA in the website, graphics, and video.'),
  growth('paths','Choose your building path','Vibe Builder or Engineer','Both paths deliver the same client campaign. Choose how much of the system you want to build.','We’ll demo the Vibe Builder path. The Engineer path shows how to own the workflow in code.'),
  growth('team','Vibe Builder · Grok Bot','Build Your AI Marketing Team','Five bots. Website, social, paid ads, design, and video. One shared client brief.','A bot owns a job. A skill saves the method. You approve the result.',{prompt:'team'}),
  growth('templates','Built with our bot team','Start with a working template','Four reusable templates, rehearsed with Desert Shine. Preview the output, then make it yours.','Download the kit. Import the bots. Start with “Use the Desert Shine example in dry run.”'),
  growth('prompt','Client deliverable · Website','Build the client website','Give the bot team one brief. Review a complete site, on desktop and mobile.','Approve the site and shared content before making the campaign.',{prompt:'site',steps:[['Build together','Design Creator directs → Site Builder builds → Social Media Manager reviews'],['Make the handoff reusable','Shared copy, brand, imagery, and a working quote flow']]}),
  growth('prompt','Client deliverable · Social graphics','Make the first static creative','Start with one strong design from the approved website. Use feedback before making variants.','Show it → ask for feedback → revise → approve this version.',{prompt:'static',steps:[['Create','One message + one image + the same quote CTA'],['Refine together','Review the PNG and caption. Repeat until it is right.']]}),
  growth('prompt','Client deliverable · Video','Research, then make a video ad','Use Facebook ad references and the client’s positioning to propose the creative.','Approve the concept. Watch the whole video. Give feedback and refine it.',{prompt:'video',steps:[['Propose','Research → two concepts → a storyboard to approve'],['Produce','A polished 15-second ad → feedback → the final version']],sources:[['Dated ad research','/growth-engineering/facebook-ad-research.md'],['Meta Ad Library','https://www.facebook.com/ads/library/']]}),
  growth('prompt','Vibe Builder · Social Media Manager','Put the handoffs in one workflow','The Social Media Manager collects the assets, requests approval, and prepares the Zernio handoff.','Rehearse manually first. Save a routine after the process works.',{prompt:'workflow',steps:[['Create the review bundle','Exact copy, media, links, client, and destinations'],['After client approval','Send the approved version to Zernio as drafts']]}),
  growth('approval','Client review','Approve the version you will send','A client approves the exact copy, media, and destinations together.','Changes reset approval. A draft in Zernio is ready for a separate scheduling decision.'),
  growth('stack','Engineer · The same Next.js foundation','Build the workflow in your own app','Each tool has one job. Keep the website and agency workspace in the same project.','Model agnostic through AI SDK providers. Verify features when switching models.',{prompt:'stack'}),
  growth('prompt','Engineer · Social delivery','Connect Zernio','Choose Desert Shine’s profile and connected accounts. Send only the approved client bundle.','Keep credentials on the server. Store the returned post ID and confirm its status.',{prompt:'zernio',steps:[['Prepare','Upload approved media and check the selected accounts'],['Create a draft','Use the API’s draft mode; leave scheduling for later']],sources:[['Zernio quickstart','https://docs.zernio.com/'],['Media uploads','https://docs.zernio.com/guides/media-uploads']]}),
  growth('app','Engineer · Agency operations','One internal screen to run it','Review client work in an agency app instead of chasing assets across chats.','Next.js UI + Workflow SDK approval wait + stored jobs. The client website stays the source.',{prompt:'app'}),
  growth('scale','Engineer · Grow when the process works','Repeat the process for the next client','Separate client records and reusable templates let the agency expand the workflow.','Scalability is a design goal: add durable storage, render workers, limits, and monitoring as volume grows.'),
  growth('measure','A simple growth check','Measure inquiries and booked cleans','Connect each campaign link to the quote form, then record which inquiries become customers.','If you test paid ads, set the budget and acceptable customer acquisition cost before spending.'),
  growth('rehearsal','Your presentation run','Show one complete client campaign','Open all five bots. Build a page, create the assets, then review one bundle.','Dry run is the rehearsal default. An approved Zernio draft handoff is the final optional demo step.'),
  ...shared('hackathon-promo'),
  ...shared('follow'),
  ...shared('discord'),
];

export const GROWTH_ENGINEERING_PORTAL = [
  growth('portal','Zero to Launch · Agency growth','Choose your build path','One Desert Shine campaign. Two ways to build it.','Our presentation follows the Grok Bot path. Explore the engineering track in your own time.'),
];

export function growthDeckForTrack(track) {
  if (!['grok-bot','engineer'].includes(track)) return GROWTH_ENGINEERING_PORTAL;
  const excluded = track === 'grok-bot' ? ['paths','stack','app','scale'] : ['paths','team','templates','rehearsal'];
  return GROWTH_ENGINEERING_DECK
    .filter(slide => !excluded.includes(slide.mode) && !(track === 'grok-bot' && slide.prompt === 'zernio'))
    .map(slide => {
      if (track === 'engineer' && slide.prompt === 'workflow') return { ...slide, track, template:'workflow', prompt:'engineeringWorkflow', eyebrow:'Engineer · Campaign workflow', title:'Build the campaign workflow', lead:'Run the creative jobs, collect one review bundle, and wait for approval in your app.', takeaway:'Store the approved version before handing drafts to Zernio.' };
      return { ...slide, track };
    });
}
