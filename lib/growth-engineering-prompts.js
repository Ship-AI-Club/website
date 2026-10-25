/* Public workshop templates. Desert Shine is a fictional agency client. */
import { MARKETING_TEAM_PROMPT } from './marketing-team-prompt.js';
const context = `We are a marketing agency serving our first client, Desert Shine, a fictional housecleaning business in Phoenix. Its services are regular, deep, and move-out cleaning. The primary action is “Request a cleaning quote.” Treat these as demo assumptions, not verified business facts. Do not invent prices, reviews, insurance, discounts, customer photos, contact details, or results. Use approved assets or clearly labeled placeholders. Keep this client's data and destinations separate from our agency and Ship AI.`;

export const GROWTH_PROMPTS = {
  team: {
    title: 'Build Your AI Marketing Team',
    text: MARKETING_TEAM_PROMPT,
  },
  site: {
    title: 'Build the client website',
    text: `${context}\n\nUse the Client Website template from the starter kit. Have Design Creator define the visual direction and supply local, licensed imagery; have Site Builder implement the Next.js site; have Social Media Manager independently review the screenshots and quote flow. For Desert Shine, use a sunny blue-and-yellow identity, bold friendly typography, a sun wordmark, and a large sunlit home photograph. Build the hero, three service sections, process, Phoenix service area, FAQs, final CTA, and a complete quote flow. Write for busy Phoenix households. Keep copy, tokens, fonts, and asset references in shared client files. The demo quote form must validate and prepare a request with an honest nothing-sent confirmation. Review desktop and 390px mobile screenshots, fix the concrete design and usability findings, and rerun the production build. Return the usable preview, portable source, asset rights manifest, shared data paths, and the remaining client inputs. Save the tested method as a skill. Do not deploy without a separate instruction.`,
  },
  static: {
    title: 'Turn the website into social graphics',
    text: `${context}\n\nRead the approved website copy, positioning, brand tokens, and assets from Site Builder's handoff. Start with one polished Remotion Still composition for one cleaning service. Export a 1080 × 1350 PNG using renderStill and show the actual image with its caption, alt text, and destination link. Adapt the design to a phone screen. Ask for feedback on the message and design, revise, render a new version, and show it again until I explicitly approve it. Then create the regular, deep, and move-out variants if requested, with optional square versions. Deliver editable compositions and a manifest linking every output to the approved brief version. Keep all output as drafts.`,
  },
  video: {
    title: 'Make a short client video',
    text: `${context}\n\nRead the approved website positioning and static design. Research relevant active ads in Meta Ad Library and current official Meta creative guidance. Start with the dated reference brief at https://www.shipai.club/growth-engineering/facebook-ad-research.md, then verify current examples. Record source links, dates, advertiser names and ad IDs; do not infer performance from an active ad. Propose two original concepts tied to our positioning, recommend one, and show a short storyboard. Ask for feedback and approval before rendering. Build the approved concept as an editable Remotion composition and a finished 15-second, 1080 × 1920, 30 fps H.264 MP4 using renderMedia. Check the selected placement's current specs and safe zones. Use strong imagery, deliberate motion, readable copy, licensed audio if used, and the quote CTA. Show the whole video with its caption and poster, ask for feedback, and revise until I explicitly approve the final version. Deliver the MP4, composition, render command, and source brief version. Keep it as a draft.`,
  },
  workflow: {
    title: 'Run the campaign with our bots',
    text: `${context}\n\nAct as our agency Social Media Manager. Ask Site Builder for the approved website brief and Design Creator for the approved static and Video Creator for the approved 15-second video. Collect one review bundle with exact captions, media, destination account IDs, links, and any proposed schedule. Keep statuses Draft → In review → Approved → Sent to Zernio. Approval must identify the exact bundle version, client, and destinations. Any edit invalidates it. In dry run, save a Zernio request preview locally and make no external write. After explicit approval to send that exact bundle, create Zernio drafts only; scheduling or publishing needs a separate decision. If credentials or the Desert Shine destination are missing, keep the local bundle and report the missing setup. Save this procedure as a reusable skill. Prepare a disabled routine template after a successful manual rehearsal.`,
  },
  engineeringWorkflow: {
    title: 'Build the campaign workflow',
    text: `${context}\n\nUse the Campaign Approval Workflow source template in our Next.js agency app. Use AI SDK for structured drafts and Workflow SDK for durable jobs and approval waits. Read the shared client JSON, render the Remotion assets, and collect one versioned bundle with exact captions, media hashes, client, destinations, and proposed time. Persist draft, review, approval, and handoff states. Approval must bind to the complete bundle; edits invalidate it. Validate roles and client ownership on the server. Prepare local NOT_SENT request previews first. Only after owner review and approval of the exact bundle, use the server-only Zernio adapter to create drafts and persist returned IDs. Verify draft status and reconcile uncertain responses before retries. Leave scheduling and publishing for a separate decision.`,
  },
  stack: {
    title: 'Prepare the engineering stack',
    text: `${context}\n\nExtend the same Next.js marketing-site codebase with a private agency workspace. Use AI SDK for structured campaign drafts, Workflow SDK for durable jobs and approval waits, Remotion for stills and video, Zernio for social delivery, and Vercel for the app and workflow runtime. Keep the model provider configurable; do not hardcode one vendor. Store clients, brief versions, assets, approval records, job status, and Zernio IDs in a database. Use object storage for media. Run long video renders on a dedicated supported render worker, with a local render option for rehearsal. Read current documentation and installed versions before writing APIs. Add authenticated server routes, per-client access checks, retry-safe handoffs, and a dry-run mode. Explain the role of each dependency and return the setup commands and environment variable names without their values.`,
  },
  zernio: {
    title: 'Connect the approved campaign to Zernio',
    text: `${context}\n\nBuild a server-only Zernio adapter in the existing Next.js app. Read https://docs.zernio.com/ and its current schema. Use ZERNIO_API_KEY from server environment only. Resolve the client profile and explicitly selected connected accounts; do not choose the first account returned. Validate each destination belongs to Desert Shine. Upload approved files using the documented media flow or use approved direct HTTPS media URLs. Verify a stored approval for the exact bundle version and destinations before external writes. Create drafts with POST /api/v1/posts on zernio.com, omitting publishNow, scheduledFor, and queue settings; confirm the returned status is draft. Use a stable stored Idempotency-Key per logical draft for retries, persist the post ID, and reconcile ambiguous responses before trying again. With no key or destination, save the request preview locally. Do not schedule or publish. Return the adapter, dry-run example, and missing configuration.`,
  },
  app: {
    title: 'Build our internal campaign app',
    text: `${context}\n\nAdd an authenticated /studio workspace to our agency's Next.js app. Select Desert Shine as the client. Show its approved brief, creative previews, caption editor, destination accounts, and job history. Add Create draft, Request review, Approve this version, and Send approved draft to Zernio. Use Workflow SDK to wait for a verified server-side approval event. Bind approval to a hash of the complete content, media hashes, client, destinations, and schedule; any change resets review. Enforce roles and client scope on the server. Disable Send until the bundle is approved and accounts are configured. Keep dry run on by default. Persist external IDs, expose failed handoffs with safe retry, and never label a draft as published. Give us one simple screen for the first client; make adding a second client a data change.`,
  },
};

export const GROWTH_SOURCES = [
  ['Next.js', 'https://nextjs.org/docs', 'Client site + private agency app'],
  ['AI SDK', 'https://ai-sdk.dev/docs/introduction', 'Draft content with a choice of models'],
  ['Workflow SDK', 'https://workflow-sdk.dev/docs', 'Run steps, wait for approval, retry'],
  ['Remotion', 'https://www.remotion.dev/docs/renderer/render-still', 'Render static graphics + video'],
  ['Zernio', 'https://docs.zernio.com/', 'Hand approved drafts to social accounts'],
  ['Vercel', 'https://vercel.com/docs', 'Host the app + workflow runtime'],
];
