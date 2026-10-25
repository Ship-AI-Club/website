import { titleCase } from "./title-case.js";

export const WORKSHOP_BENEFITS = [
  { title: "Build with expert guidance", text: "Work on your own project, ask questions, and get feedback as you build." },
  { title: "Blueprints that clear the way", text: "Start with blueprints: codebases preloaded with skills and best practices, designed to eliminate 80% of the friction so you can focus on building." },
  { title: "Recordings sent afterward", text: "We’ll email participants the workshop recordings so you can revisit the walkthroughs." },
  { title: "Materials to keep building", text: "We’ll send the blueprints, slides, templates, prompts, checklists, and any code or other materials used in the workshop." },
];

// Unscheduled workshops are discoverable, but never create paid bookings.
const WORKSHOP_CATALOG = [
  {
    slug: "ai-ops-team",
    hidden: true,
    name: "Build Your Operations Team With AI",
    "titleClassName": "wd-two-line-title",
    heading: ["Build Your Operations", "Team With AI"],
    level: "For founders & operators",
    price: 1999,
    promise: "Give each AI agent a clear job.",
    description: "Use AI to help with support, sales, and daily tasks. Give each agent a job and connect the tools it needs. Build a small example and review its work before you use it in your business.",
    audience: "Founders, small business owners, and operators who want practical help with repeatable support, sales, and day-to-day work.",
    prerequisite: "Some experience using an AI assistant is helpful. Bring a laptop, access to Grok Bot, and one recurring business workflow. Team features and integrations may require an eligible plan or admin approval.",
    outcomes: ["A support workflow that finds answers in your FAQs, drafts replies, and flags cases for a person.", "A sales workflow that researches leads, prepares meeting briefs, and drafts follow-ups for review.", "A personal operations agent for priorities, meeting preparation, and recurring task summaries.", "Reusable role briefs, a workflow map, and a test checklist for improving your agents after the session."],
    topics: [
      { title: "Design your AI ops team", text: "Map the work you repeat. Give support, sales, and personal agents distinct responsibilities, inputs, tools, and a clear definition of done." },
      { title: "Set up Grok Bot", text: "Configure your workspace, reference files, skills, and supported connections. Build around the accounts and tools your business already uses." },
      { title: "Customer support", text: "Use FAQs and sample requests to build a triage-and-draft workflow. Check answer quality, missing context, and when a person should take over." },
      { title: "Sales", text: "Turn a lead into a research brief and a useful follow-up draft. Keep your offer and customer context consistent across the workflow." },
      { title: "Your personal team", text: "Build an agent that helps you get stuff done: organize priorities, prepare for meetings, and run a recurring brief with supported routines." },
      { title: "Test, improve, and hand off", text: "Run realistic examples, inspect errors, and refine the instructions. Decide what can run on its own and what needs your review before it is sent or changed." },
    ],
    toolAnswer: "This workshop uses xAI’s Grok Bot. Bring access to the product and any accounts you want to connect. Available plugins, team features, and routines depend on your plan and organization settings. We’ll use sample data where a live connection is unavailable.",
  },
  {
    slug: "your-first-agent",
    capacity: 20,
    name: "Build Your First AI Agent",
    "titleClassName": "wd-two-line-title",
    heading: ["Build Your First", "AI Agent"],
    level: "Start here · Beginner friendly",
    price: 299,
    promise: "Give your AI assistant one useful job.",
    description: "Set up your preferred AI tool and connect your email. Build a simple process that reads a message and prepares a response for review. Test it with sample messages and keep instructions you can use again.",
    audience: "People who already use AI chat and want an agent that can help with their actual work. No coding background is required.",
    prerequisite: "Bring a laptop and access to your preferred AI tool and email account. You should be able to sign in and approve connections; a work account may need administrator permission.",
    outcomes: ["Your preferred AI tool configured with useful instructions and context.", "An email connection, or a sample-data workflow if your plan or administrator blocks access.", "A tested workflow that summarizes messages, identifies next steps, and drafts a reply for your review.", "A reusable prompt or skill, a setup checklist, and a simple test log."],
    topics: [
      { title: "Choose and set up your tool", text: "Start with Claude, ChatGPT, or Grok Bot. Understand the difference between chatting, a repeatable workflow, and an agent that can use tools." },
      { title: "Give your agent context", text: "Write a clear job brief: what you need, the information it can use, your writing style, and what a good result looks like." },
      { title: "Connect email and collaboration tools", text: "Connect Gmail or Outlook where supported. Add Microsoft Teams as a separate collaboration connection when useful; Teams is not an email inbox." },
      { title: "Build your email workflow", text: "Have the agent summarize a sample thread, pull out action items, and draft a reply. Review the draft, then test sending with a message to yourself where the tool supports it." },
      { title: "Test the whole workflow", text: "Try a normal message, missing information, and an instruction the agent should not follow. Check sources and output before trusting it with more work." },
      { title: "Make it reusable", text: "Save the instructions as a reusable prompt, skill, or workflow supported by your tool. Leave with a checklist for running it again." },
    ],
    toolAnswer: "You can use Claude, ChatGPT, or xAI’s Grok Bot. Choose one for the hands-on build. Connector access and sending actions vary by tool, subscription, and workplace policy. We’ll guide you through a supported option or use sample messages; you do not need to buy all three tools.",
  },
  {
    slug: "agentic-engineering",
    capacity: 12,
    name: "Build And Test Software With AI",
    "titleClassName": "wd-two-line-title",
    heading: ["Build And Test Software", "With AI"],
    level: "For builders ready to go further",
    price: 999,
    promise: "Build a feature and check that it works.",
    description: "Use AI to build software with a clear process. Keep changes separate, run tests, and check the result in a browser. Start with your own project or a starter project. Learn how to review the work before you release it.",
    audience: "Vibe coders and builders who have made a simple app and want a more reliable way to develop, review, and ship with coding agents.",
    prerequisite: "Some light vibe coding experience is ideal. Bring a laptop, a GitHub account, an AI coding tool, and a small app or use our starter project. We’ll guide you through the Git and terminal basics used in the workshop.",
    outcomes: ["A project with clear repository instructions and a documented tech stack.", "An isolated worktree for an agent-built feature and a reviewable Git diff.", "Tests and a browser check that verify the feature’s real behavior.", "A reusable engineering skill and a checklist for review, merge, and deployment."],
    topics: [
      { title: "Turn an idea into a build brief", text: "Define the feature, acceptance criteria, and constraints before the agent starts. Give it the relevant project context and a clear stopping point." },
      { title: "Choose your tech stack", text: "Work through frontend, backend, database, authentication, and deployment choices. Use a practical web-app starter or apply the same decisions to your own stack." },
      { title: "Worktrees and Git", text: "Create an isolated checkout, assign a bounded task, and inspect the changes. Practice bringing completed work back into your main project without overwriting another task." },
      { title: "Tests that prove behavior", text: "Turn acceptance criteria into useful tests. Reproduce a failure, ask the agent to fix it, and rerun the checks before calling the task done." },
      { title: "Browser automation", text: "Exercise the app in a real browser, inspect the visible result, and debug a failed user flow. Capture evidence for the change you intend to ship." },
      { title: "Skills, review, and shipping", text: "Package a repeatable process into a skill with inputs, steps, and done criteria. Review the diff, resolve a conflict, and prepare a tested deployment." },
    ],
    toolAnswer: "Bring your preferred AI coding environment. We’ll teach transferable workflows for repository instructions, Git worktrees, testing, and browser automation. Specific commands and skill formats vary by tool; the workshop will include a guided starter project.",
  },
  {
    slug: "automate-social-media",
    capacity: 16,
    name: "Automate Your Social Media With AI",
    "titleClassName": "wd-two-line-title",
    heading: ["Automate Your Social", "Media With AI"],
    level: "For founders, creators & operators",
    price: 1999,
    promise: "Plan, draft, and schedule content with a process you can repeat.",
    description: "Use AI to plan and write social media content. Connect your publishing tools and keep your message consistent across channels. Review each post before you schedule it. Build a new process or improve the one you use.",
    audience: "Founders, creators, and small teams who want to show up consistently without rebuilding their content process every week.",
    prerequisite: "Bring a laptop, access to an AI tool, and the social accounts you manage. Have a business, audience, and a few content ideas in mind. Some light vibe coding experience is helpful for the custom automation exercises.",
    outcomes: ["A software stack chosen for your channels, budget, and content workflow.", "A content pipeline from ideas and source material to reviewed, scheduled posts.", "Reusable skills for brand voice, repurposing, platform-specific drafts, and content review.", "A tested publishing workflow, a simple content calendar, and a checklist for failed posts and follow-up."],
    topics: [
      { title: "Software stack", text: "Choose an AI writing tool, an asset library, a content calendar, and a publishing tool. Compare a scheduler such as Buffer with an API platform such as Zernio, based on what you actually need." },
      { title: "Tech stack", text: "Connect the parts with supported APIs, plugins, or an automation tool. Work through authentication, media uploads, scheduled jobs, and how to check whether a post was published." },
      { title: "Reusable skills", text: "Encode your audience, offer, voice, and review criteria. Build skills that turn a source idea into a draft, adapt it for each channel, and check it before publishing." },
      { title: "Build your content pipeline", text: "Take one useful idea through research, drafting, visuals, review, and scheduling. Keep each channel’s format and media requirements in the workflow." },
      { title: "Test before publishing", text: "Preview a post, verify its account, media, links, and scheduled time, and test on an account you control. Handle failed jobs and retries without creating duplicate posts." },
      { title: "Keep improving", text: "Use available performance data to decide what to repeat or change. Leave with a weekly process and a blueprint you can extend as your social presence grows." },
    ],
    toolAnswer: "Bring your preferred AI tool and access to the social accounts you manage. We’ll use supported publishing connections and cover both scheduler and API approaches, including Buffer and Zernio as examples. Platform coverage, subscriptions, and administrator permissions vary; sample data and draft previews are available when live access is blocked.",
  },
{
  "slug": "agentic-lead-generation",
    capacity: 16,
  "name": "Find And Research Sales Leads With AI",
  "heading": [
    "Find And Research",
    "Sales Leads With AI"
  ],
  "titleClassName": "wd-two-line-title",
  "level": "For Founders, Marketers & Sales Teams",
  "price": 1999,
  "promise": "Build a useful list of people your sales team can contact.",
  "description": "Use AI to find the right companies and people to contact. Research each lead, add missing details, and build a clear list for your sales team. Start fresh, improve your current process, or come to learn, with hands-on expert guidance.",
  "audience": "Founders, marketers, agencies, and sales teams who want a repeatable way to find and research sales leads.",
  "prerequisite": "Bring a laptop and a description of your product or service and target customers. Bring access to your preferred AI and lead research tools. A current lead list is useful. Some experience with AI tools is ideal.",
  "outcomes": [
    "A prospecting brief with target accounts, buyer roles, research signals, and clear qualification criteria.",
    "A sourced prospect list with company and contact enrichment, match confidence, and references for researched claims.",
    "A scored, deduplicated list with unknown fields flagged instead of filled with guesses.",
    "A tested handoff to a spreadsheet or supported CRM, plus reusable research skills and an enrichment checklist."
  ],
  "topics": [
    {
      "title": "Define who belongs on your list",
      "text": "Translate your offer into an ideal customer profile, target buyer roles, and signals that suggest a good fit. Specify what to collect and how to recognize a useful lead."
    },
    {
      "title": "Build your sourcing workflow",
      "text": "Use supported prospecting tools and business research sources to find companies and contacts. Start with a small sample you can inspect before expanding the list."
    },
    {
      "title": "Enrich companies and contacts",
      "text": "Build an enrichment workflow using tools such as Clay or Apollo. Match records using names, domains, and available identifiers; check returned confidence and preserve missing data when no match is found."
    },
    {
      "title": "Research and qualify with agents",
      "text": "Give a research agent a clear brief and output format. Gather relevant business context with source links, apply your fit criteria, and review a sample of its classifications."
    },
    {
      "title": "Clean the list and hand it off",
      "text": "Normalize fields, remove duplicates, and preserve the source and freshness of useful data. Map approved records to a spreadsheet or CRM without overwriting existing information blindly."
    },
    {
      "title": "Test quality, cost, and repeatability",
      "text": "Try ambiguous matches, missing fields, duplicate records, and a failed lookup. Set a research or credit budget and save the workflow as reusable skills and a blueprint."
    }
  ],
  "toolAnswer": "We’ll cover AI research alongside prospecting and enrichment tools such as Clay and Apollo. Bring access to a supported option; account plans, API access, and enrichment credits vary. You can use sample records or a spreadsheet if your CRM or provider connection is unavailable.",
  "costAnswer": "Workshop admission does not include prospecting subscriptions, enrichment credits, API usage, or CRM fees. We’ll start with a small test list and show how to control lookup costs."
},
{
  "slug": "creatives-agentic-workflow",
    capacity: 12,
  "name": "Create Images And Short Videos With AI",
  "titleClassName": "wd-two-line-title",
    "heading": ["Create Images And", "Short Videos With AI"],
  "level": "For creatives, marketers & agencies",
  "price": 1999,
  "promise": "Turn one idea into images and short videos.",
  "description": "Use AI to create images and short videos for your business. Start with a clear brief, write a script, and create drafts that match your brand. Build a process for reviewing, saving, and preparing the files to share.",
  "audience": "Creative professionals, marketers, founders, and agencies producing campaign assets who want a repeatable process across images and short-form video.",
  "prerequisite": "Bring a laptop, a campaign or product brief, and brand assets you have permission to use. Have access to your preferred AI image and video tools and an editor. Some experience creating with AI is helpful; sample assets will be available.",
  "outcomes": [
    "A creative brief and reusable skills for your brand, audience, offer, and review criteria.",
    "A small batch of static creative concepts and format variants ready for review.",
    "A short-form video draft built from a script, storyboard, generated shots, and an edit.",
    "A repeatable pipeline with an organized asset library, review checkpoints, export presets, and a production checklist."
  ],
  "topics": [
    {
      "title": "Turn the brief into a production plan",
      "text": "Define the audience, offer, message, visual direction, and deliverable formats. Break the work into concepting, image generation, video, editing, and review."
    },
    {
      "title": "Build your creative skills",
      "text": "Encode brand voice, visual references, shot direction, and quality checks as reusable instructions. Keep the campaign context consistent across tools and outputs."
    },
    {
      "title": "Produce static creative variants",
      "text": "Generate and refine image concepts using your preferred supported tool. Add readable copy, inspect product and brand consistency, and adapt selected concepts to useful formats."
    },
    {
      "title": "Create scripts, storyboards, and shorts",
      "text": "Develop a hook, short script, and shot list. Use approved images or references to generate video shots with tools such as Runway, then assemble an initial short-form edit."
    },
    {
      "title": "Connect the production pipeline",
      "text": "Move briefs and assets between generation, storage, and editing. Where supported, use APIs or automation to track jobs and outputs; keep a guided manual step for tools that need it."
    },
    {
      "title": "Review, export, and improve",
      "text": "Check visuals, claims, text legibility, captions, sound, and format before delivery. Organize approved variants, handle failed generations, and leave with a reusable export and review checklist."
    }
  ],
  "toolAnswer": "Bring your preferred AI assistant, image generator, video generator, and editing tool. Runway is one supported video example; the workflow also covers tool selection and handoffs. Model access, automation features, generation credits, and export options vary. We’ll use sample assets when a live generation or integration is unavailable.",
  "costAnswer": "Image and video subscriptions, generation credits, editing software, and API usage are separate from workshop admission. We’ll use a small creative batch and show how to manage revisions and generation costs."
},
{
  "slug": "ai-sales-gtm-team",
    capacity: 12,
  "name": "Build Your Sales And Marketing Team With AI",
  "titleClassName": "wd-two-line-title",
    "heading": ["Build Your Sales And", "Marketing Team With AI"],
  "level": "For founders, sales teams & revenue operators",
  "price": 1999,
  "promise": "Help your sales team take the next step with each lead.",
  "description": "Use AI to help your team move leads toward a sale. Connect customer records, prepare follow-up messages, and create sales sheets and pitch decks. Build a process for reviewing the work and tracking the next step.",
  "audience": "Founders, sales teams, consultants, and revenue operators who already have leads or opportunities and want a more consistent process for moving them forward.",
  "prerequisite": "Bring a laptop, your offer and sales process, and a sample lead or deal. Access to your CRM and approved sales materials is useful. Some familiarity with AI assistants is ideal; we can work with a sample CRM dataset.",
  "outcomes": [
    "A role map for a qualification agent, sales collateral agent, follow-up agent, and sales operations agent.",
    "A CRM workflow linking contacts, opportunities, deal stages, owners, and next actions.",
    "A draft sales one-pager and pitch deck tailored to a sample opportunity using your approved offer and proof points.",
    "A tested lead-to-next-step workflow with review checkpoints, follow-up drafts, and a deal handoff checklist."
  ],
  "topics": [
    {
      "title": "Design your AI sales team",
      "text": "Map the steps from an interested lead to a clear next action. Give qualification, collateral, follow-up, and sales operations agents distinct jobs and handoff rules."
    },
    {
      "title": "Connect your CRM and deal context",
      "text": "Work with a supported CRM such as HubSpot or a sample dataset. Map contacts, companies, deals, stages, owners, and activity so your agents work from a consistent source of truth."
    },
    {
      "title": "Qualify and prepare the next conversation",
      "text": "Use lead context, discovery notes, and fit criteria to draft a qualification brief. Identify unanswered questions, likely objections, and the next useful conversation."
    },
    {
      "title": "Build sales collateral",
      "text": "Turn your approved offer, evidence, and customer context into a one-pager, pitch deck, and proposal outline. Review every claim and tailor the message to the opportunity."
    },
    {
      "title": "Draft follow-ups and update the pipeline",
      "text": "Generate relevant follow-up drafts and next-step tasks from the deal record or meeting notes. Review external messages and CRM changes before they are sent or applied."
    },
    {
      "title": "Test conversion workflows and handoffs",
      "text": "Run a sample opportunity through the team. Test missing context, stale deal stages, duplicate tasks, and a human handoff. Define a few pipeline measures so you can see where the process needs work."
    }
  ],
  "toolAnswer": "Bring your preferred AI assistant and access to a CRM such as HubSpot, plus a presentation or document tool for collateral. Connectors, API permissions, and automation features vary by account. We’ll use sample deal records when a live CRM connection is unavailable.",
  "costAnswer": "CRM subscriptions, AI tools, presentation software, and API usage are separate from workshop admission. Bring the tools your team already uses; you do not need to purchase every example tool."
},
{
  "slug": "ai-customer-support-team",
    capacity: 12,
  "name": "Build Your Customer Support Team With AI",
  "titleClassName": "wd-two-line-title",
    "heading": ["Build Your Customer", "Support Team With AI"],
  "level": "For support teams, founders & operators",
  "price": 1499,
  "promise": "Help customers get clear answers, with your team in control.",
  "description": "Use AI to answer customer questions from your company information. Connect customer records, build a chat assistant, and prepare responses for your team to review. Track support requests and send difficult questions to a person.",
  "audience": "Support leads, founders, and operators who want a practical foundation for handling questions, drafting replies, and escalating the cases that need a person.",
  "prerequisite": "Bring a laptop, a few anonymized support tickets, and approved help articles or product documentation. Access to Grok Bot and your CRM or help desk is useful. Light vibe coding experience is ideal; sample tickets and a starter codebase will be available.",
  "outcomes": [
    "A support knowledge base and a CRM/ticket context map with clear sources and ownership.",
    "A Grok Bot workflow for triage, grounded response drafts, and escalation to a person.",
    "A customer chat prototype that answers from approved knowledge and creates a ticket when needed.",
    "An admin control panel prototype for reviewing drafts, tracking tickets, and testing the end-to-end support flow."
  ],
  "topics": [
    {
      "title": "Map your support stack and team roles",
      "text": "Choose your CRM, knowledge base, chat, and ticketing connections. Define what the agent can handle, what requires approval, and who owns each escalation."
    },
    {
      "title": "Build a usable knowledge base",
      "text": "Organize approved help articles and product context. Add source references and a process for refreshing content; teach the workflow to acknowledge missing or conflicting information."
    },
    {
      "title": "Connect CRM context and ticketing",
      "text": "Map customer records, ticket status, priority, and conversation history. Use a supported connection or sample dataset, then check that the right context reaches the right ticket."
    },
    {
      "title": "Give Grok Bot a support job",
      "text": "Set up a focused triage and response-drafting workflow with reusable skills. Review proposed replies and sensitive actions such as refunds before applying them."
    },
    {
      "title": "Build customer chat and an admin review panel",
      "text": "Use the workshop codebase to prototype a website chat interface and a separate operator panel. Connect approved answers, ticket creation, draft review, and human handoffs."
    },
    {
      "title": "Test the queue and save your blueprint",
      "text": "Try an unknown question, stale article, angry customer, duplicate ticket, and failed connection. Save your checks, escalation rules, and reusable support workflow."
    }
  ],
  "toolAnswer": "Grok Bot is the focus for internal support work: triage, research, drafts, and ticket operations. Customer-facing chat and the admin panel are separate components in the starter codebase. Bring access to Grok Bot and your preferred CRM or help desk; connector availability and permissions vary. Sample data provides a fallback when a live connection is unavailable.",
  "costAnswer": "Grok Bot, CRM, help desk, hosting, and API usage costs are separate from admission. We build and test a working prototype; production rollout and connection to every system depend on your stack and access."
},
{
  "slug": "ai-lead-magnets",
    capacity: 16,
  "name": "Turn Website Visitors Into Leads With AI",
  "titleClassName": "wd-two-line-title",
    "heading": ["Turn Website Visitors", "Into Leads With AI"],
  "level": "For founders, marketers & growth teams",
  "price": 799,
  "promise": "Give visitors a useful reason to share their email.",
  "description": "Build an AI tool for your website that helps visitors solve a small problem. Create a report, calculator, or other useful result. Collect an email before you share the result. Test the tool and connect it to the next step for your business.",
  "audience": "Founders, marketers, agencies, and growth teams who want a useful website experience that gives visitors a reason to engage with their offer.",
  "prerequisite": "Bring a laptop, your offer and target audience, and access to a website or test project. Light vibe coding experience is ideal. Bring approved examples of the result you want visitors to receive; a starter codebase will be provided.",
  "outcomes": [
    "A lead magnet brief connecting one visitor problem to a useful result and your offer.",
    "One working website prototype with an input form and a personalized results page.",
    "A tested lead capture and result-delivery flow, with clear consent and a CRM or spreadsheet handoff.",
    "Reusable skills, an implementation blueprint, and a checklist for quality, cost, and conversion tracking."
  ],
  "topics": [
    {
      "title": "Choose a useful lead magnet",
      "text": "Start with your audience’s question and choose one format: report, generator, grader, or calculator. Define what the visitor should receive and how it connects to your offer."
    },
    {
      "title": "Design inputs and the result",
      "text": "Keep the form focused on information needed for a useful answer. Sketch the results page, supporting context, and a relevant next step."
    },
    {
      "title": "Build the result engine",
      "text": "Use AI for personalized explanations or generation, with a defined output structure. Use deterministic calculations for numeric results and make assumptions visible."
    },
    {
      "title": "Put the experience on your website",
      "text": "Adapt the blueprint into a working form and results page. Build loading, empty, and error states and check the experience on mobile."
    },
    {
      "title": "Capture leads and deliver the result",
      "text": "Add a clear email and consent flow. Send or save the result and map the appropriate fields to a CRM or spreadsheet, using test records before a live connection."
    },
    {
      "title": "Test quality and measure engagement",
      "text": "Review sample outputs for usefulness and accuracy. Check failed requests, missing inputs, delivery, usage limits, and basic funnel events so you can improve the experience."
    }
  ],
  "toolAnswer": "We’ll use an AI assistant, a website starter codebase, and a supported model API or form tool. Bring your preferred website, email, and CRM tools; we can use a test project and sample records when access is unavailable. The workshop focuses on one lead magnet rather than building every format.",
  "costAnswer": "Model API usage, hosting, email delivery, form subscriptions, and CRM fees are separate from admission. We’ll build a small test flow and include usage limits and cost checks in the blueprint."
},
{
  "slug": "ai-lead-qualification",
    capacity: 16,
  "name": "Check Customer Fit With AI",
  "titleClassName": "wd-two-line-title",
    "heading": ["Check Customer Fit", "With AI"],
  "level": "For sales, GTM & service teams",
  "price": 999,
  "promise": "Help customers check whether your offer meets their needs.",
  "description": "Build an AI assessment for your website. Ask a few questions, check the answers, and explain whether your offer is a good fit. Give each visitor a useful next step and send the results to your sales team for review.",
  "audience": "Sales and GTM teams, founders, and service businesses that want prospects to assess product or service fit before booking a call.",
  "prerequisite": "Bring a laptop, your offer, qualification criteria, and examples of good-fit and poor-fit prospects. Light vibe coding experience is ideal. CRM access is helpful; a starter codebase and sample records will be available.",
  "outcomes": [
    "An explicit business-fit and readiness rubric with questions, scoring rules, and thresholds.",
    "A self-serve website assessment that gathers the context needed to evaluate a prospect.",
    "An explained result with an appropriate recommendation, booking link, resource, or human review path.",
    "A tested CRM or spreadsheet handoff containing assessment answers, scores, reasoning, and next actions."
  ],
  "topics": [
    {
      "title": "Define what good fit means",
      "text": "Translate your offer and sales process into clear fit and readiness criteria. Separate required conditions from preferences and define where a person should review the result."
    },
    {
      "title": "Design the self-serve assessment",
      "text": "Write a short set of questions visitors can answer confidently. Decide when follow-up questions add useful context and show why each input matters."
    },
    {
      "title": "Combine scoring rules with AI",
      "text": "Use explicit rules for thresholds and an AI workflow for interpreting free-text answers. Return structured results, preserve uncertainty, and test the model against your rubric."
    },
    {
      "title": "Build explanations and useful next steps",
      "text": "Show visitors an understandable result and the factors behind it. Offer a relevant booking path, resource, recommendation, or human review option without overstating certainty."
    },
    {
      "title": "Route qualified context to your team",
      "text": "Map answers, scores, source context, and next actions into a supported CRM or spreadsheet. Prevent duplicate records and test routing before connecting live lead flows."
    },
    {
      "title": "Evaluate accuracy and edge cases",
      "text": "Try missing answers, contradictory inputs, borderline fit, and failed requests. Compare outcomes with human judgments, adjust the rubric, and save a repeatable evaluation checklist."
    }
  ],
  "toolAnswer": "We’ll work with a website blueprint, an AI assistant or supported model API, and a CRM or spreadsheet. Form tools such as Typeform can support structured questions and rule-based segmentation; custom AI interpretation is a separate workflow. Account features and integrations vary, so sample data is available.",
  "costAnswer": "Model API usage, hosting, form software, and CRM fees are separate from admission. We focus on commercial product or service fit and readiness, with explicit scoring and a human review path."
},
{
  "slug": "build-your-brand",
    capacity: 16,
  "name": "Build Your Brand With AI",
  "titleClassName": "wd-two-line-title",
    "heading": ["Build Your Brand", "With AI"],
  "level": "For founders, marketers & independent builders",
  "price": 699,
  "promise": "Give your website, emails, and content one clear identity.",
  "description": "Use AI to build a clear message and consistent design for your business. Create rules for colors, layouts, and writing style. Apply them to your website and emails. Keep a brand kit that your team and AI tools can use again.",
  "audience": "Founders, marketers, agencies, and independent builders who want their website and AI-generated content to feel consistent and recognizable.",
  "prerequisite": "Bring a laptop, your offer and audience, and a few examples of writing and visuals you like. An existing website, logo, and brand materials are helpful but optional. Bring your preferred AI assistant or coding tool; light vibe coding experience is ideal for the website exercise.",
  "outcomes": [
    "A concise brand brief with your audience, offer, positioning, message pillars, and approved proof points, plus a DESIGN.md with visual tokens and design rationale.",
    "A reusable brand voice skill with examples, preferred terms, tone guidance for different situations, and checks for off-brand copy and unsupported claims.",
    "Four draft email templates—welcome, outreach, follow-up, and customer response—with subject lines, calls to action, and guidance for adapting them.",
    "A sample website section and social bio created from the kit, reviewed against a brand checklist with before-and-after examples."
  ],
  "topics": [
    {
      "title": "Define your brand foundation",
      "text": "Audit one current page and email for inconsistencies. Define your audience, offer, positioning, and three message pillars. Gather approved proof points and label assumptions that still need your decision."
    },
    {
      "title": "Create your DESIGN.md",
      "text": "Choose a focused visual direction for one website section. Create DESIGN.md with machine-readable colors, typography, spacing, and component tokens, plus written rationale and examples. Check readability and contrast."
    },
    {
      "title": "Build your brand voice skill",
      "text": "Use your approved examples to define voice attributes, preferred language, and tone for welcome messages, sales follow-ups, and unhappy customers. Package instructions as a skill with inputs, examples, and a review checklist."
    },
    {
      "title": "Write language for emails",
      "text": "Build four adaptable drafts: welcome, outreach, follow-up, and customer response. Refine subject lines, opening sentences, and calls to action. Keep factual claims grounded in the brand brief and review the copy before sending."
    },
    {
      "title": "Apply the brand across touchpoints",
      "text": "Load the kit into your preferred supported tool and apply it to one website section and a social bio. Check that the visuals and wording reflect the same audience, offer, and personality."
    },
    {
      "title": "Test and maintain the brand kit",
      "text": "Run the same website and writing briefs with and without your kit. Review consistency, clarity, tone, accessibility, and claims; revise the files and save an update and handoff checklist."
    }
  ],
  "toolAnswer": "Bring your preferred AI assistant and, for the website exercise, an AI coding or design tool. DESIGN.md documents visual rules; the brand voice skill supplies writing guidance. Skill formats and document support vary by tool, so we’ll show a reusable file structure and a prompt-based fallback. Google Stitch is an optional example, not a required subscription.",
  "costAnswer": "AI subscriptions, design tools, fonts, stock assets, hosting, and API usage are separate from admission. Use assets you have permission to use. The workshop produces a practical brand kit and draft examples; a full logo redesign or complete website build is outside its scope.",
  "deliverables": [
    {
      "name": "BRAND.md",
      "text": "Your audience, offer, positioning, message pillars, and approved evidence."
    },
    {
      "name": "DESIGN.md",
      "text": "Visual tokens, design rationale, component guidance, and references."
    },
    {
      "name": "brand-voice/SKILL.md",
      "text": "Reusable writing instructions, tone guidance, examples, and review steps; adapted to your tool."
    },
    {
      "name": "email-templates.md",
      "text": "Four editable drafts with subject lines, calls to action, and adaptation notes."
    },
    {
      "name": "brand-checklist.md",
      "text": "Before-and-after examples, review criteria, ownership, and update instructions."
    }
  ],
  "extraFaqs": [
    {
      "question": "Do I need an existing brand or logo?",
      "answer": "No. Bring a clear offer and audience, plus a few references you like. We can establish a starter direction. If you already have guidelines, we’ll organize and apply them; this is not a full logo redesign."
    },
    {
      "question": "How is this different from Build Your Website And Marketing Presence With AI?",
      "answer": "Build Your Brand focuses on the reusable visual and writing guidance that your tools and teammates use. Build Your Website And Marketing Presence With AI helps you build or improve your website and social media pages."
    },
    {
      "question": "Will every AI tool automatically follow the files?",
      "answer": "No. We’ll explicitly load or reference the files in a supported tool and test the result. Skill formats, context limits, and file support vary. You’ll also have a prompt-based fallback and a human review checklist."
    }
  ]
},
{
  "slug": "company-knowledge-engine",
  "name": "Find Company Answers With AI",
  "titleClassName": "wd-two-line-title",
    "heading": ["Find Company Answers", "With AI"],
  "level": "Company knowledge",
  "price": 2499,
  "capacity": 12,
  "duration": "Two-day lab",
  "promise": "Find useful answers in your company documents.",
  "description": "Build AI search for your company documents. Show the source for each answer and check who can access the information. Test the answers with real questions. Create a process to keep the documents current.",
  "audience": "Founders, operations leaders, internal enablement teams, and builders who need trustworthy answers across company documents.",
  "prerequisite": "Bring a laptop, an AI coding tool, and a small set of approved, non-sensitive company documents. Light vibe coding experience is ideal; a sample corpus and starter codebase are provided.",
  "outcomes": [
    "A searchable prototype over a small, approved document collection, with source-linked answers.",
    "A documented access model and tests that check whether restricted information stays restricted.",
    "A refresh workflow that tracks document versions, changed sources, and stale answers.",
    "An evaluation set, knowledge-owner checklist, and blueprint for extending the system."
  ],
  "topics": [
    {
      "title": "Bound your knowledge project",
      "text": "Choose one team, document collection, and set of questions. Define what the prototype should answer and what it should decline."
    },
    {
      "title": "Prepare the source library",
      "text": "Clean a small document corpus, preserve source identifiers and versions, and assign owners. Use sample documents where access is unavailable."
    },
    {
      "title": "Build retrieval and answers",
      "text": "Connect ingestion, search, and an answer workflow. Inspect retrieved passages and require useful source links instead of unsupported conclusions."
    },
    {
      "title": "Model access and permissions",
      "text": "Document who can see each source. Test access filtering and attempts to retrieve restricted content using sample roles before considering live company use."
    },
    {
      "title": "Measure answer quality",
      "text": "Create normal, ambiguous, missing-answer, and restricted-source cases. Evaluate retrieval and answer quality separately, then inspect failures."
    },
    {
      "title": "Refresh and hand off",
      "text": "Build a document refresh path, record failed updates, and assign review ownership. Leave with a staged rollout plan and a tested prototype."
    }
  ],
  "toolAnswer": "Bring a supported AI coding environment and access to a model API if you want to use live generation. Search, storage, and model providers can vary; our prepared blueprint and sample corpus provide a common starting point. Software subscriptions and API usage are separate.",
  "extraFaqs": [
    {
      "question": "What follow-up support is included?",
      "answer": "One shared 60-minute implementation-review session within 30 days of the workshop is included. Bring your test results and questions. This is a group review; private consulting and done-for-you implementation are separate."
    },
    {
      "question": "What is the scope of the build?",
      "answer": "We build and test one bounded prototype using a prepared blueprint. Live access depends on your accounts and permissions. A full company rollout, migration, and production certification are outside the workshop scope."
    }
  ]
},
{
  "slug": "ai-prototype-to-production",
  "name": "Test And Improve Your AI Systems",
  "titleClassName": "wd-two-line-title",
    "heading": ["Test And Improve", "Your AI Systems"],
  "level": "Production reliability",
  "price": 2999,
  "capacity": 12,
  "duration": "Two-day lab",
  "promise": "Check your AI system before customers use it.",
  "description": "Test your AI system before you release it. Check the answers, track errors, and control costs. Add human review and a plan for failed tasks. Use the results to decide what is ready and what needs more work.",
  "audience": "Builders, technical founders, product teams, and engineers with an existing AI prototype that needs more reliable behavior.",
  "prerequisite": "Bring a laptop, an AI coding environment, and a small working prototype, or use our starter. You should be comfortable editing code and running basic tests.",
  "outcomes": [
    "A representative evaluation set with expected behavior and repeatable regression checks.",
    "Traces and a review dashboard that reveal failures, tool actions, latency, and usage costs.",
    "Approval gates, bounded retries, and failure handling for one workflow.",
    "A staged-release checklist, rollback plan, and incident playbook for your next deployment."
  ],
  "topics": [
    {
      "title": "Define reliable behavior",
      "text": "Pick one workflow and describe acceptable outcomes, failure cases, and actions that need human approval. Set a practical baseline."
    },
    {
      "title": "Build your evaluation suite",
      "text": "Create representative examples and scoring criteria. Separate deterministic checks from model-graded judgments and review grader disagreements."
    },
    {
      "title": "Trace the workflow",
      "text": "Capture inputs, retrieved context, model outputs, tool calls, and errors with appropriate redaction. Use traces to diagnose a failed case."
    },
    {
      "title": "Control actions and failures",
      "text": "Add approval steps for consequential actions, retry limits, timeouts, and duplicate-action protection. Test tool failures and missing context."
    },
    {
      "title": "Manage latency and cost",
      "text": "Measure a small run, set usage budgets, and compare a change against the baseline. Build an alert or review step for excessive usage."
    },
    {
      "title": "Prepare a staged release",
      "text": "Run regression checks, document rollback and incident steps, and define who approves expansion. The workshop improves readiness; it does not certify production safety."
    }
  ],
  "toolAnswer": "Bring your coding tool and supported model API access. We will use an instrumented starter workflow and adapt the patterns to your prototype where practical. Observability services, API usage, and hosting costs are separate.",
  "extraFaqs": [
    {
      "question": "What follow-up support is included?",
      "answer": "One shared 60-minute implementation-review session within 30 days of the workshop is included. Bring your test results and questions. This is a group review; private consulting and done-for-you implementation are separate."
    },
    {
      "question": "What is the scope of the build?",
      "answer": "We build and test one bounded prototype using a prepared blueprint. Live access depends on your accounts and permissions. A full company rollout, migration, and production certification are outside the workshop scope."
    }
  ]
},
{
  "slug": "ai-client-delivery-system",
  "name": "Deliver Client Projects With AI",
  "titleClassName": "wd-two-line-title",
    "heading": ["Deliver Client Projects", "With AI"],
  "level": "Client delivery",
  "price": 2499,
  "capacity": 16,
  "duration": "Two-day lab",
  "promise": "Keep client work clear from the first request to delivery.",
  "description": "Use AI to help manage client work from the first request to the final review. Define the work, prepare drafts, and keep clients informed. Build checks for quality and a clear process for handing over the finished work.",
  "audience": "Agencies, consultants, studios, and professional service teams that want a clearer, more repeatable client delivery process.",
  "prerequisite": "Bring a laptop, your preferred AI tool, and one anonymized example of a service you deliver. Have a sample brief, acceptance criteria, and deliverable format ready.",
  "outcomes": [
    "A client intake and scope template that captures requirements, exclusions, and acceptance criteria.",
    "A workflow that turns approved scope into tasks and a first deliverable draft.",
    "A review checklist and client-update draft grounded in actual project status.",
    "A tested handoff package with file organization, owner assignments, and reusable delivery skills."
  ],
  "topics": [
    {
      "title": "Map one service",
      "text": "Select a repeatable service and define the client outcome. Separate sales promises from delivery requirements, review, and acceptance."
    },
    {
      "title": "Capture intake and scope",
      "text": "Build structured intake, flag missing information, and draft a scope for human approval. Include exclusions and a change-request path."
    },
    {
      "title": "Plan the work",
      "text": "Turn the approved brief into tasks, dependencies, and owners. Connect a supported project tool or use a prepared task board."
    },
    {
      "title": "Draft and review deliverables",
      "text": "Produce one bounded deliverable using your service blueprint. Review evidence, claims, formatting, and client requirements before approval."
    },
    {
      "title": "Keep clients informed",
      "text": "Generate status updates from project records. Identify blocked work and changes; review drafts before any external message is sent."
    },
    {
      "title": "Package the handoff",
      "text": "Organize approved files, acceptance checks, and next steps. Test a changed requirement and save a reusable delivery playbook."
    }
  ],
  "toolAnswer": "Use your preferred AI assistant with a supported document or project-management workflow. Account permissions and API access vary; sample tasks and documents are available. Software costs are separate, and client messages remain drafts until you approve them.",
  "extraFaqs": [
    {
      "question": "What follow-up support is included?",
      "answer": "One shared 60-minute implementation-review session within 30 days of the workshop is included. Bring your test results and questions. This is a group review; private consulting and done-for-you implementation are separate."
    },
    {
      "question": "What is the scope of the build?",
      "answer": "We build and test one bounded prototype using a prepared blueprint. Live access depends on your accounts and permissions. A full company rollout, migration, and production certification are outside the workshop scope."
    }
  ]
},
{
  "slug": "ai-business-intelligence-team",
  "name": "Build Business Reports And Dashboards With AI",
  "titleClassName": "wd-two-line-title",
    "heading": ["Build Business Reports", "And Dashboards With AI"],
  "level": "Business intelligence",
  "price": 1999,
  "capacity": 16,
  "duration": "Two-day lab",
  "promise": "Turn your business data into reports your team can use.",
  "description": "Use AI to build reports and dashboards from your business data. Choose what to measure, check the numbers, and explain the results. Set up a process for regular reports. Start with a small dataset and compare each report with its sources.",
  "audience": "Founders, operators, analysts, and team leads who want useful business reporting with clear definitions and traceable numbers.",
  "prerequisite": "Bring a laptop, your preferred AI tool, and an anonymized spreadsheet or use our sample dataset. Basic spreadsheet experience is helpful; no advanced analytics background is required.",
  "outcomes": [
    "A metric dictionary and a cleaned sample data model with quality checks.",
    "A dashboard focused on a few actionable business questions.",
    "A recurring reporting workflow with freshness checks and a reviewed decision brief.",
    "A reporting blueprint with metric owners, source references, and a checklist for misleading conclusions."
  ],
  "topics": [
    {
      "title": "Choose decisions and metrics",
      "text": "Start with the business decisions you need to make. Define each metric, time window, owner, and source before building a chart."
    },
    {
      "title": "Prepare the data",
      "text": "Inspect a small dataset for missing values, duplicate records, and inconsistent definitions. Document joins and transformations."
    },
    {
      "title": "Build a useful dashboard",
      "text": "Create a few charts that answer specific questions. Use a supported BI tool or the prepared dashboard blueprint and inspect the underlying numbers."
    },
    {
      "title": "Draft a decision brief",
      "text": "Have an assistant summarize changes with source references. Separate observed facts, hypotheses, and recommended next steps."
    },
    {
      "title": "Make reporting repeatable",
      "text": "Define a refresh schedule and freshness checks. Configure a supported automation or practice the same process with sample data."
    },
    {
      "title": "Test and assign ownership",
      "text": "Introduce stale data and a changed metric definition. Verify the report detects problems, then save an owner checklist and review process."
    }
  ],
  "toolAnswer": "Bring your preferred AI assistant and a spreadsheet or supported BI environment. The guided blueprint includes sample data and a dashboard starting point. Business-system connectors, BI licenses, and API usage are separate; a sample-data path is available.",
  "extraFaqs": [
    {
      "question": "What follow-up support is included?",
      "answer": "One shared 60-minute implementation-review session within 30 days of the workshop is included. Bring your test results and questions. This is a group review; private consulting and done-for-you implementation are separate."
    },
    {
      "question": "What is the scope of the build?",
      "answer": "We build and test one bounded prototype using a prepared blueprint. Live access depends on your accounts and permissions. A full company rollout, migration, and production certification are outside the workshop scope."
    }
  ]
},
{
  "slug": "build-your-ai-software-factory",
  "name": "Build Your Software Factory With AI",
  "titleClassName": "wd-two-line-title",
    "heading": ["Build Your Software", "Factory With AI"],
  "level": "Advanced AI engineering · Two-day workshop",
  "price": 3999,
  "capacity": 12,
  "duration": "Two-day lab",
  "promise": "Turn a work request into code your team can review.",
  "description": "Use AI to connect software tasks to a repeatable build process. Start with a task in Linear, run the build in a separate environment, and test the changes. Send the code to GitHub for review. Build with prepared code and keep people in control of releases.",
  "audience": "Developers, technical founders, engineering leads, and small product teams that already ship software with coding agents and want a repeatable delivery system.",
  "prerequisite": "Bring a laptop, GitHub and Linear accounts, a Vercel account, model API access, and a small TypeScript repository you can safely experiment on. You should be comfortable with Git, pull requests, Node.js, and basic tests. Use our starter repository if your company code cannot be shared.",
  "outcomes": [
    "A Linear work-order flow with acceptance criteria, run status, evidence, and draft-PR links.",
    "An isolated Vercel Sandbox build that investigates a bounded issue, implements a change, and runs checks.",
    "A durable Workflow SDK pipeline with AI SDK tool orchestration, approval pauses, and bounded retry behavior.",
    "A tested ticket-to-draft-PR prototype, repository blueprint, regression cases, and an operator runbook."
  ],
  "topics": [
    {
      "title": "Define the factory boundary",
      "text": "Pick one repository and a narrow ticket type. Define required evidence, tool permissions, cost limits, and which decisions belong to a human."
    },
    {
      "title": "Linear ticketing and updates",
      "text": "Read an approved issue, turn it into a structured work order, and write useful status updates. Link run evidence and a draft PR back to the issue using a supported API or agent integration."
    },
    {
      "title": "Vercel Sandbox build environments",
      "text": "Provision an isolated workspace for repository inspection, edits, tests, and browser checks where supported. Scope credentials to the task and clean up completed runs."
    },
    {
      "title": "Workflow SDK durability",
      "text": "Coordinate steps that can retry, pause for review, and resume. Add run identifiers and duplicate-event protection; test a failed step before broadening the workflow."
    },
    {
      "title": "AI SDK agent orchestration",
      "text": "Give investigation, implementation, and verification distinct briefs and tools. Require repository evidence, a real diff, and passed checks before preparing the handoff."
    },
    {
      "title": "Draft PRs, evaluations, and operations",
      "text": "Create a reviewable draft PR and post a Linear update. Test ambiguous tickets, unsupported premises, failed builds, and duplicate webhooks. Human approval controls merge and production release."
    }
  ],
  "toolAnswer": "The guided stack uses Linear for tickets and run updates; GitHub for code and draft PRs; Vercel Sandbox for isolated execution; Workflow SDK for durable steps; and Vercel AI SDK for model calls and tools. Supported connections depend on account plans and administrator approval. Sample tickets and a starter repository are available; the final setup guide will specify tested versions.",
  "costAnswer": "Admission does not include Linear or Vercel plans, model API usage, Sandbox compute, hosting, or other software costs. We start with a small bounded task and configure run budgets. Bring accounts you control; never share raw credentials in the workshop.",
  "kitIntro": "Adapt these blueprints to a small repository, run the supplied cases, and document what your team needs before a wider rollout.",
  "deliverables": [
    {
      "name": "Factory starter codebase",
      "text": "A prepared TypeScript ticket-to-draft-PR blueprint with adapters for the guided stack."
    },
    {
      "name": "AGENTS.md + skills",
      "text": "Repository context, investigation, implementation, verification, and Linear-update instructions."
    },
    {
      "name": "Work-order schema",
      "text": "Ticket, acceptance criteria, state, approval, cost, and evidence fields for each run."
    },
    {
      "name": "Regression case pack",
      "text": "Supported change, ambiguous ticket, false premise, build failure, and duplicate-event cases."
    },
    {
      "name": "Operator runbook",
      "text": "Credential scope, budgets, review gates, failure recovery, cleanup, and rollout checklist."
    }
  ],
  "followupText": "A 30-minute private readiness review before the lab and two private implementation-review hours within 30 days afterward. We review one repository and your workflow evidence; this does not include done-for-you rollout or unlimited support.",
  "extraFaqs": [
    {
      "question": "What preparation and follow-up are included?",
      "answer": "A 30-minute private readiness review before the lab and two private implementation-review hours within 30 days afterward are included. Use them to scope one repository, review run evidence, and plan your next rollout steps. This does not include unlimited support or done-for-you implementation."
    },
    {
      "question": "Is this different from Build And Test Software With AI?",
      "answer": "Yes. Build And Test Software With AI teaches the individual build workflow: worktrees, tests, browser checks, and skills. This advanced workshop connects ticket intake, durable orchestration, isolated execution, verification, and progress updates into a software-delivery system."
    },
    {
      "question": "How is this different from Test And Improve Your AI Systems?",
      "answer": "That workshop improves the reliability and operation of an existing AI workflow. Software Factory applies those ideas specifically to software delivery: turning a ticket into repository evidence, a tested change, a draft PR, and a Linear update."
    },
    {
      "question": "Will the agents automatically merge or deploy my code?",
      "answer": "The guided build stops at a tested draft PR and reviewed status update. Human approval controls merge and production release. We practice one bounded repository workflow; a complete autonomous engineering organization is outside the two-day scope."
    },
    {
      "question": "Is this an official Linear or Vercel event?",
      "answer": "No. This is an independent Ship AI workshop using those tools. It is not a vendor certification or a claim of sponsorship."
    }
  ],
  "agenda": [
    {
      "day": "Day 1",
      "theme": "From ticket to isolated build",
      "stages": [
        [
          "Prepare the repository",
          "Review the blueprint, repository instructions, acceptance criteria, and credential boundaries."
        ],
        [
          "Connect Linear and GitHub",
          "Build the work-order intake and useful status updates from sample or approved tickets."
        ],
        [
          "Investigate in Vercel Sandbox",
          "Run a small reproduction, inspect the repository, and prove the request before editing."
        ],
        [
          "Implement a bounded change",
          "Use AI SDK tools and durable Workflow SDK steps to produce a candidate change and saved run evidence."
        ]
      ]
    },
    {
      "day": "Day 2",
      "theme": "Verify, recover, and hand off",
      "stages": [
        [
          "Verify the actual change",
          "Run tests and inspect the real diff from a fresh verification context."
        ],
        [
          "Exercise failure paths",
          "Test retries, duplicate events, missing context, approval pauses, and cost limits."
        ],
        [
          "Prepare the draft PR",
          "Publish a reviewable change in a repository you control and link evidence back to Linear."
        ],
        [
          "Review the factory and next rollout",
          "Demo one ticket-to-PR run, identify remaining work, and schedule your private implementation review."
        ]
      ]
    }
  ],
  "references": [
    {
      "name": "Linear agent interactions",
      "url": "https://linear.app/developers/agent-interaction"
    },
    {
      "name": "Vercel Sandbox documentation",
      "url": "https://vercel.com/docs/sandbox"
    },
    {
      "name": "Workflow SDK on Vercel",
      "url": "https://vercel.com/docs/workflows"
    },
    {
      "name": "Vercel AI SDK",
      "url": "https://ai-sdk.dev/docs/introduction"
    }
  ]
},
{
  "slug": "build-your-first-agentic-workflow",
  "name": "Build Your First AI Workflow",
  "titleClassName": "wd-two-line-title",
    "heading": ["Build Your First", "AI Workflow"],
  "level": "Entry-Level AI Development",
  "price": 499,
  "capacity": 16,
  "duration": "One-Day Lab",
  "days": 1,
  "promise": "Connect an AI model to a tool and test the result.",
  "description": "Build a small app that uses AI to complete a task. Start with prepared code, connect one tool, and run the steps. Check the result and publish a preview. Learn how to find errors and keep the process working when a step fails.",
  "audience": "Vibe coders, technical beginners, and builders who have used an AI assistant and want to connect model calls, tools, and durable steps in a small app.",
  "prerequisite": "Bring a laptop, GitHub and Vercel accounts, and access to a model API or AI Gateway. Light JavaScript or TypeScript and terminal experience is ideal. You do not need to have built agents before; we provide a guided starter and sample data.",
  "outcomes": [
    "A Nitro starter app with one clear workflow input, output, and a documented job brief.",
    "An AI SDK step that extracts or generates structured output and calls one bounded tool.",
    "A Workflow SDK run with durable steps, a pause or retry exercise, and inspected execution history.",
    "A tested local run and Vercel preview where account access permits, plus a reusable blueprint and setup checklist."
  ],
  "topics": [
    {
      "title": "Choose One Useful Job",
      "text": "Pick a small request-to-result workflow, such as turning a customer inquiry into a research brief and reviewed response draft. Define one input, one output, and what good looks like."
    },
    {
      "title": "Start With Nitro And The Blueprint",
      "text": "Run the prepared TypeScript app, understand the server route, and load your environment settings locally. Follow the starter before customizing your own workflow."
    },
    {
      "title": "Add AI SDK And One Tool",
      "text": "Connect a supported model, validate a structured output, and call one bounded tool using sample data. Keep external sending and consequential actions behind review."
    },
    {
      "title": "Make Steps Durable With WDK",
      "text": "Use Workflow SDK, also known as Workflow DevKit (WDK), to split the job into steps. Run a pause or retry exercise and inspect where the workflow resumes."
    },
    {
      "title": "Test The Whole Workflow",
      "text": "Try a normal request, missing input, a failed tool, and a repeated request. Inspect run history and check the result rather than judging only the prompt."
    },
    {
      "title": "Deploy And Keep Building",
      "text": "Prepare a Vercel preview where your plan and permissions permit. Save your instructions, checklist, and next-step backlog; sample-data/local runs remain available if account access is blocked."
    }
  ],
  "toolAnswer": "The guided stack is Nitro, Vercel AI SDK, Workflow SDK (WDK), and Vercel. Bring one supported model provider or AI Gateway account. Nitro v3’s native Workflow SDK integration was announced as beta; the setup guide will pin a tested integration and versions before the cohort. No purchase of multiple AI subscriptions is required.",
  "references": [
    {
      "name": "Workflow SDK Documentation",
      "url": "https://workflow-sdk.dev/"
    },
    {
      "name": "Vercel AI SDK",
      "url": "https://ai-sdk.dev/docs/introduction"
    },
    {
      "name": "Workflow SDK With Nitro",
      "url": "https://vercel.com/changelog/workflow-sdk-now-runs-natively-in-nitro-v3"
    },
    {
      "name": "Deploy Nitro On Vercel",
      "url": "https://vercel.com/kb/guide/ship-a-nitro-app-on-vercel"
    }
  ],
  "stackExplanation": "Nitro supplies the app and server routes. AI SDK connects model calls and tools. Workflow SDK (WDK) coordinates durable steps. Vercel provides the preview deployment and managed workflow runtime. This is an independent Ship AI workshop.",
  "extraFaqs": [
    {
      "question": "How Is This Different From Build Your First AI Agent?",
      "answer": "Build Your First AI Agent starts in Claude, ChatGPT, or Grok and teaches a useful connected workflow without requiring code. This workshop is the next step for builders: a small TypeScript app with model calls, tools, durable execution, and a preview deployment."
    },
    {
      "question": "Is This Beginner Friendly?",
      "answer": "It is entry level for code-based agentic development. Light vibe coding or JavaScript experience is ideal, and you should be willing to use a terminal and run a starter app. If you prefer a no-code start, take Build Your First AI Agent first."
    },
    {
      "question": "What Comes After This Workshop?",
      "answer": "Choose Build And Test Software With AI to improve repository, testing, and browser workflows; Test And Improve Your AI Systems to add reliability controls; or the advanced Software Factory workshop when you can comfortably ship and review code."
    }
  ]
},
];

export const UPCOMING_WORKSHOPS = WORKSHOP_CATALOG.filter(workshop => !workshop.hidden).map(workshop => ({ ...workshop, name: titleCase(workshop.name), heading: workshop.heading.map(titleCase), ...(workshop.duration ? { duration: titleCase(workshop.duration) } : {}) }));

export function workshopBySlug(slug) {
  return UPCOMING_WORKSHOPS.find((workshop) => workshop.slug === slug);
}
