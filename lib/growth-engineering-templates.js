const base = '/growth-engineering/templates';

export const GROWTH_TEMPLATE_KIT = `${base}/ship-ai-agency-templates.zip`;

export const GROWTH_BOT_TEMPLATES = [
  { name:"Site Builder", href:"https://x.ai/bot/ksd6wk5e84h2BvKm7riaq", job:"Website + shared client brief", task:"Build the client website, quote flow, and brief for the marketing team." },
  { name:"Social Media Manager", href:"https://x.ai/bot/5rgMPM-0FpH1ZflzjNDk1", job:"Organic content + approvals", task:"Plan the calendar and hand approved drafts to Zernio." },
  { name:"Performance Marketer", href:"https://x.ai/bot/WQpbnRwh4H-DArkEBQCK5", job:"Paid ads + campaign analysis", task:"Use Meta Ads MCP for reporting and creative recommendations." },
  { name:"Content Creator \u00b7 Design", href:"https://x.ai/bot/js3Rh17IRwiUhXlkySUg5", job:"Content creator \u00b7 Design", task:"Create site imagery and static campaign graphics." },
  { name:"Content Creator \u00b7 Video", href:"https://x.ai/bot/Td8xsp1w2slejHsx62m0y", job:"Content creator \u00b7 Video", task:"Storyboard, render and refine video ads." },
];

export const GROWTH_TEMPLATES = [
  { id:'site', name:'Client Website', shortName:'Website', bot:'Site Builder', summary:'A complete Next.js site, quote flow, and shared client brief.', sourceHref:`${base}/client-website.zip`, previewType:'image', previewHref:`${base}/examples/site-snapshot.png`, liveHref:'/growth-engineering/desert-shine', previewAlt:'Desert Shine website with a cleaning quote call to action', command:'Use the Client Website template for Desert Shine. Have Design Creator supply the visual direction and imagery, Site Builder build the site, and Social Media Manager review desktop, mobile, and the quote flow. Fix the findings and show me the complete site.' },
  { id:'static', name:'Social Graphics', shortName:'Graphics', bot:'Design Creator', summary:'Branded Remotion graphics, refined through feedback.', sourceHref:`${base}/social-graphics.zip`, previewType:'image', previewHref:`${base}/examples/post-1-Social4x5.png`, previewAlt:'Desert Shine regular cleaning social graphic', command:'Use the Social Graphics template with the approved Desert Shine site and positioning. Render one 4:5 creative, show the image and caption, ask for feedback, and revise until I approve this version.' },
  { id:'video', name:'Short Video', shortName:'Video', bot:'Video Creator', summary:'A 15-second Remotion ad from a researched storyboard.', sourceHref:`${base}/short-video.zip`, previewType:'video', previewHref:`${base}/examples/reel.mp4`, command:'Use the Short Video template for Desert Shine. Research Facebook ad references, propose a concept from our positioning, get storyboard approval, then render the video and refine it through feedback.' },
  { id:'workflow', name:'Campaign Approval', shortName:'Workflow', bot:'Social Media Manager', summary:'One review bundle + approval checks + local Zernio requests.', sourceHref:`${base}/campaign-approval-workflow.zip`, previewType:'html', previewHref:`${base}/examples/review/approval-review.html`, command:'Use the Campaign Approval Workflow template for Desert Shine in dry run. Show me the bundle and demonstrate that changing a caption resets approval. Keep all Zernio requests NOT SENT.' },
];
