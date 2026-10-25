// Attendee content. Source paths are server-only provenance metadata. No facilitator answer keys.
export const WORKSHOP_MATERIALS = {
  "vibe-coding-gtm": {
    "title": "Build Your Website And Marketing Presence With AI",
    "durationLabel": "4 hours · October 10, 2026 · 9 AM–1 PM MST",
    "timingNote": "The event window is published. Teaching allocations below are a proposed internal facilitation plan, not a published timed agenda. Coffee, breakfast and lunch are included; reserve their time inside the four-hour window.",
    "sources": [
      "lib/vibe-gtm-workshop.js",
      "app/workshops/vibe-coding-gtm/page.jsx",
      "lib/marketing-site-deck.js"
    ],
    "agenda": [
      {
        "title": "9:00–9:15 · Coffee, breakfast and orientation",
        "minutes": 15,
        "output": "Choose new site, existing-site improvement or sample practice."
      },
      {
        "title": "9:15–9:35 · Customer brief",
        "minutes": 20,
        "output": "Approved message and claim ledger."
      },
      {
        "title": "9:35–9:55 · Design",
        "minutes": 20,
        "output": "Reusable design note and page sketch."
      },
      {
        "title": "9:55–10:50 · Build or improve",
        "minutes": 55,
        "output": "Website preview and contact path."
      },
      {
        "title": "10:50–11:00 · Break",
        "minutes": 10,
        "output": "Reset."
      },
      {
        "title": "11:00–11:25 · SEO and content",
        "minutes": 25,
        "output": "Findability checks and customer-question map."
      },
      {
        "title": "11:25–11:55 · Social presence",
        "minutes": 30,
        "output": "Profile worksheet/update and two channel drafts."
      },
      {
        "title": "11:55–12:15 · Lunch",
        "minutes": 20,
        "output": "Meal and reset."
      },
      {
        "title": "12:15–12:40 · Customer journey tests",
        "minutes": 25,
        "output": "Test log and one correction."
      },
      {
        "title": "12:40–1:00 · Handoff and review",
        "minutes": 20,
        "output": "Package, demonstration and next-week plan."
      }
    ],
    "slides": [
      {
        "eyebrow": "Build lab",
        "title": "One message across every touchpoint",
        "lead": "Build a useful website or improve the one you have, then align the social presence.",
        "layout": "flow",
        "items": [
          {
            "title": "Keep",
            "body": "Customer brief, design note, working preview, search/content plan and social drafts."
          },
          {
            "title": "Work from evidence",
            "body": "Use approved facts or the labelled Mesa Bike Care practice fixture."
          },
          {
            "title": "Finish honestly",
            "body": "Record what works, what is simulated and what still blocks launch."
          }
        ],
        "takeaway": "The result is inspectable work, not a promised conversion increase."
      },
      {
        "eyebrow": "Build lab",
        "title": "Start with the customer",
        "lead": "Give a stranger enough information to understand the offer.",
        "layout": "flow",
        "items": [
          {
            "title": "Audience",
            "body": "Who needs this, in what situation?"
          },
          {
            "title": "Offer",
            "body": "What do you do, where, and under what conditions?"
          },
          {
            "title": "Action",
            "body": "What happens after a visitor clicks?"
          }
        ],
        "takeaway": "Write the brief before asking for a page."
      },
      {
        "eyebrow": "Build lab",
        "title": "Use facts you can defend",
        "lead": "Practice with a fictional business, then replace its facts with your own.",
        "layout": "example",
        "items": [
          {
            "title": "Practice fixture",
            "body": "Fictional practice business: Mesa Bike Care, a mobile bicycle tune-up service for Phoenix commuters. Owner-approved facts for this exercise: standard tune-up $85; service area Phoenix; request an appointment by contact form; appointment availability confirmed by a person. No customer testimonials, measured results, emergency repairs, or same-day guarantee supplied. Contact email and social handles are placeholders; do not publish them."
          },
          {
            "title": "Claim ledger",
            "body": "For each claim: approved fact, source, missing information, or draft assumption."
          }
        ],
        "takeaway": "Missing evidence is a gap to solve."
      },
      {
        "eyebrow": "Build lab",
        "title": "Write the next three lines",
        "lead": "Use the brief to draft the offer above the fold.",
        "layout": "exercise",
        "items": [
          {
            "title": "Headline",
            "body": "Name the customer or service and useful outcome."
          },
          {
            "title": "Support",
            "body": "Give concrete scope, not unsourced adjectives."
          },
          {
            "title": "CTA",
            "body": "Describe the actual next step: request an appointment, not an unconfirmed booking."
          }
        ],
        "takeaway": "Have a partner explain the offer back.",
        "prompt": "Using only this brief, draft three homepage options: audience + outcome headline, factual support sentence, and one CTA. Do not invent proof, availability, contact details or results. List unresolved facts separately."
      },
      {
        "eyebrow": "Build lab",
        "title": "Make the design repeatable",
        "lead": "Choose a small set of decisions that work on every page.",
        "layout": "checklist",
        "items": [
          {
            "title": "Type and color",
            "body": "Readable text, clear headings and consistent contrast."
          },
          {
            "title": "Layout",
            "body": "Offer → services → process/evidence → fit questions → contact."
          },
          {
            "title": "Design note",
            "body": "Save colors, styles, spacing, mobile order and CTA behavior."
          }
        ],
        "takeaway": "A design note makes future edits coherent."
      },
      {
        "eyebrow": "Build lab",
        "title": "Choose the right build path",
        "lead": "New site and existing site use the same brief.",
        "layout": "compare",
        "items": [
          {
            "title": "New site",
            "body": "Build one convincing page and a clear contact path."
          },
          {
            "title": "Existing site",
            "body": "Copy or branch it, then fix the two biggest message or design problems."
          },
          {
            "title": "Learning path",
            "body": "Use a local mock and document what an account or deployment would require."
          }
        ],
        "takeaway": "Keep the build bounded."
      },
      {
        "eyebrow": "Build lab",
        "title": "Build from the specification",
        "lead": "Ask the tool for one useful change and inspect it.",
        "layout": "exercise",
        "items": [
          {
            "title": "Input",
            "body": "Approved copy, DESIGN.md, section order and contact specification."
          },
          {
            "title": "Review",
            "body": "Check changed files or preview, then correct observed issues."
          },
          {
            "title": "Contact",
            "body": "Simulate explicitly when a working destination is unavailable."
          }
        ],
        "takeaway": "A visible button is not proof that a request arrives.",
        "prompt": "Build the smallest page from this brief and DESIGN.md. Preserve approved claims. Explain changed files and preview steps. Treat contact submission as a labelled simulation unless an approved working destination is supplied."
      },
      {
        "eyebrow": "Build lab",
        "title": "Help people find the right page",
        "lead": "Search readiness starts with accurate content and a clear structure.",
        "layout": "checklist",
        "items": [
          {
            "title": "Page basics",
            "body": "Specific title, description, main heading and descriptive links."
          },
          {
            "title": "Content map",
            "body": "Answer genuine customer questions using approved evidence."
          },
          {
            "title": "Verification",
            "body": "Inspect the rendered page; record production-only canonical and indexing checks."
          }
        ],
        "takeaway": "Check accuracy and usefulness before scale."
      },
      {
        "eyebrow": "Build lab",
        "title": "A page must deserve to exist",
        "lead": "A location name does not make a new page useful.",
        "layout": "compare",
        "items": [
          {
            "title": "Useful",
            "body": "Distinct service facts, process details or an evidenced customer question."
          },
          {
            "title": "Weak",
            "body": "The same paragraph with a swapped city name."
          },
          {
            "title": "Missing data",
            "body": "Keep a draft until the needed evidence is available."
          }
        ],
        "takeaway": "Review one sample before generating a family."
      },
      {
        "eyebrow": "Build lab",
        "title": "Carry the message into social",
        "lead": "The profile and the website should describe the same business.",
        "layout": "exercise",
        "items": [
          {
            "title": "Profile",
            "body": "Name, audience, offer, scope and working website link."
          },
          {
            "title": "Visuals",
            "body": "Adapt the design note to avatar and cover crop."
          },
          {
            "title": "Account access",
            "body": "Use a reviewed worksheet when login is unavailable."
          }
        ],
        "takeaway": "Choose one channel you can maintain.",
        "prompt": "Adapt the approved website message to [channel] using its current visible field limits. Provide profile copy and two draft posts with one relevant next action. Flag missing assets or facts. Preserve appointment-request wording."
      },
      {
        "eyebrow": "Build lab",
        "title": "Create two useful channel drafts",
        "lead": "Give the visitor a reason to click.",
        "layout": "example",
        "items": [
          {
            "title": "Introduction",
            "body": "What you do, who it serves and how a request works."
          },
          {
            "title": "Question answer",
            "body": "Respond to a real concern without inventing policy or proof."
          },
          {
            "title": "Review",
            "body": "Check field limits, crop, attribution and link destination in the account UI."
          }
        ],
        "takeaway": "A draft stays a draft until reviewed."
      },
      {
        "eyebrow": "Build lab",
        "title": "Test as a customer",
        "lead": "Walk the path from profile to contact.",
        "layout": "checklist",
        "items": [
          {
            "title": "Message",
            "body": "Can a stranger explain the offer and boundaries?"
          },
          {
            "title": "Interaction",
            "body": "Keyboard, mobile, form validation and acknowledgement."
          },
          {
            "title": "Evidence",
            "body": "Record observed behavior and retest the change."
          }
        ],
        "takeaway": "Fix the largest observed obstacle."
      },
      {
        "eyebrow": "Build lab",
        "title": "Keep a complete handoff",
        "lead": "Make the next working session easy to start.",
        "layout": "flow",
        "items": [
          {
            "title": "Artifacts",
            "body": "Brief, design note, preview instructions, content map and social drafts."
          },
          {
            "title": "Open issues",
            "body": "Missing facts, simulated actions and launch blockers."
          },
          {
            "title": "Next week",
            "body": "Owner, next edit, a measure you can collect and review date."
          }
        ],
        "takeaway": "Your handoff tells the truth about readiness."
      },
      {
        "eyebrow": "Build lab",
        "title": "Show one journey that works",
        "lead": "Demonstrate the website and matching social message.",
        "layout": "exercise",
        "items": [
          {
            "title": "Show",
            "body": "A visitor enters, understands and takes the next action."
          },
          {
            "title": "Explain",
            "body": "One correction you made from testing."
          },
          {
            "title": "Commit",
            "body": "One next task with an owner and date."
          }
        ],
        "takeaway": "Software, domains and hosting are separate decisions."
      }
    ],
    "guide": {
      "intro": "Use your own site or start from the fictional Mesa Bike Care fixture. Keep the message consistent across website, search content and one social channel. Complete a preview and an honest readiness record; deployment depends on your accounts and permissions.",
      "preparation": [
        "Bring a laptop, charger, existing site or project idea, customer description and approved brand assets.",
        "Have access to your preferred AI building tool and social account. Light vibe coding experience is helpful.",
        "Keep a backup or working copy of an existing site. Bring only data you may share.",
        "Tool subscriptions, domains and hosting are separate. Use a local preview and social worksheet when access is unavailable."
      ],
      "steps": [
        {
          "title": "Write the customer brief",
          "minutes": 20,
          "instructions": [
            "Fictional practice business: Mesa Bike Care, a mobile bicycle tune-up service for Phoenix commuters. Owner-approved facts for this exercise: standard tune-up $85; service area Phoenix; request an appointment by contact form; appointment availability confirmed by a person. No customer testimonials, measured results, emergency repairs, or same-day guarantee supplied. Contact email and social handles are placeholders; do not publish them.",
            "Use your own approved business facts instead if available. List audience, problem, service, service area, price if approved, evidence, one primary action, and facts still missing.",
            "Draft a headline, one supporting sentence, and CTA. Ask a partner to explain the offer without your help."
          ],
          "done": "A one-page brief and three lines of homepage copy; each claim has an approved source or is marked missing.",
          "check": "Try a visitor outside the service area and a request for same-day repair. The copy must not imply either is available.",
          "prompt": "Using only this brief, draft three homepage options: audience + outcome headline, factual support sentence, and one CTA. Do not invent proof, availability, contact details or results. List unresolved facts separately."
        },
        {
          "title": "Choose a small design system",
          "minutes": 20,
          "instructions": [
            "Choose two colors with a readable foreground/background combination, a heading and body style, consistent spacing, and one CTA treatment.",
            "Sketch page order: offer, services, evidence or process, fit questions, contact. Existing-site path: identify the two sections that most obscure the offer.",
            "Write these decisions into DESIGN.md or a plain design note. Make a mobile sketch before building."
          ],
          "done": "A design note plus desktop/mobile section sketches that can guide the next edit.",
          "check": "Check text at enlarged browser zoom and a narrow viewport; verify CTA labels stay readable and information is not communicated by color alone.",
          "prompt": "Turn this approved brief and design note into a page specification. Include section purpose, approved copy, mobile order, and missing assets. Keep one primary action."
        },
        {
          "title": "Build or improve the website",
          "minutes": 55,
          "instructions": [
            "Work in a copy or branch of your project. Ask your available AI building tool to create the agreed page or edit the two selected sections.",
            "Add a labelled contact path and explain that an appointment request awaits confirmation. Use a local preview or supported preview service.",
            "For the practice business, simulate the form result with an explicit demo notice. For your live site, verify the real destination with permission before launch.",
            "Save the brief and design note beside the project. Make one change at a time and inspect the result."
          ],
          "done": "A preview with coherent copy, reusable styling, and a contact journey that is either verified or clearly simulated.",
          "check": "Test keyboard navigation, blank required fields, an invalid email, long customer names, mobile layout, and a request outside Phoenix. Record actual behavior.",
          "prompt": "Build the smallest page from this brief and DESIGN.md. Preserve approved claims. Explain changed files and preview steps. Treat contact submission as a labelled simulation unless an approved working destination is supplied."
        },
        {
          "title": "Make the page findable",
          "minutes": 25,
          "instructions": [
            "Write a specific page title and description reflecting the actual service and location. Use a clear main heading and descriptive internal links.",
            "Create a content map for three genuine customer questions. Draft one useful answer using the approved facts.",
            "If considering location or service pages, require distinct useful evidence for each. Start with one sample; do not generate swapped-name pages.",
            "Inspect the supported preview or rendered HTML for title, headings, link destinations, and a share image if available. Note production-only checks such as canonical URL and indexing."
          ],
          "done": "A title/description pair, a three-question content map, and one useful page or draft with verification notes.",
          "check": "Reject invented neighborhoods, certifications, reviews, opening hours and turnaround promises. Check broken links and duplicate sample content.",
          "prompt": "Audit this page against the approved facts. Suggest a page title, description, heading structure and three customer-question pages. For each page state the unique information needed; do not promise rankings or traffic."
        },
        {
          "title": "Align the social presence",
          "minutes": 30,
          "instructions": [
            "Pick one relevant social account you control. Draft a profile name, bio, description, website link and cover/avatar plan from the same business brief.",
            "Create two channel drafts: an introduction and an answer to a customer question. Keep a source note for claims.",
            "Use a worksheet if you cannot access the account. With your own account, preview updates and verify the website destination before saving.",
            "Check the site and profile side by side for name, offer, visual treatment, contact action and appointment wording."
          ],
          "done": "A consistent profile worksheet or reviewed profile update, plus two reusable channel drafts.",
          "check": "Read a truncated bio and preview a cropped cover. Test the link on mobile. Avoid fabricated customer quotes and unlicensed assets.",
          "prompt": "Adapt the approved website message to [channel] using its current visible field limits. Provide profile copy and two draft posts with one relevant next action. Flag missing assets or facts. Preserve appointment-request wording."
        },
        {
          "title": "Test the complete customer journey",
          "minutes": 25,
          "instructions": [
            "Ask a partner to find who the offer is for, what it costs if stated, service boundaries and the contact action in one minute.",
            "Start from the social profile or worksheet link. Follow it to the page, inspect the contact path, and check the acknowledgement.",
            "Record issue, reproduction steps, severity, owner and retest result. Fix the highest-impact problem.",
            "For a live site, keep launch decisions separate from preview completion and document required access or destination fixes."
          ],
          "done": "A test log with one observed issue fixed and retested, or a named blocker with next action.",
          "check": "Include a bad link, incomplete form, unsupported customer request, small screen and a missing proof claim. A preview cannot establish lead conversion performance.",
          "prompt": "Act as a first-time customer using this approved brief. Give a test checklist for message, mobile readability, links, contact, unsupported claims and social consistency. Report observed evidence separately from guesses."
        },
        {
          "title": "Package the next edit",
          "minutes": 20,
          "instructions": [
            "Save the brief, design note, preview URL or local instructions, SEO/content map, profile copy, channel drafts and test log.",
            "Write a one-week plan: owner, next edit, measurement to collect, review date and any subscription/domain/hosting decision still needed.",
            "Choose a modest baseline such as inquiries received and qualified inquiries. State how you will obtain it; do not invent current values."
          ],
          "done": "A handoff package another person can open and a dated next review.",
          "check": "Open the preview from the saved instructions. Verify sample labels, missing assets, contact limitations and launch blockers remain visible.",
          "prompt": "Create a concise handoff from these artifacts: what exists, how to preview, what is simulated, unresolved facts, launch checks, owner and next review. Do not claim the site is deployed unless I provide deployment evidence."
        }
      ],
      "deliverables": [
        "Approved customer brief and claim ledger",
        "Design note and page structure",
        "Website preview or bounded existing-site improvement with contact check",
        "SEO checklist and three-question content map",
        "One social profile worksheet/update and two channel drafts",
        "Customer-journey test log and next-week handoff"
      ],
      "troubleshooting": [
        {
          "problem": "The AI invents proof or service promises.",
          "fix": "Return to the claim ledger; remove unsupported claims and request the missing facts."
        },
        {
          "problem": "The form appears to work but no message arrives.",
          "fix": "Check destination and error behavior. Label a simulation; record the missing integration instead of declaring launch ready."
        },
        {
          "problem": "You cannot log into a social account or building tool.",
          "fix": "Use the same specification in a local mock and profile worksheet. Record access as the next task."
        },
        {
          "problem": "SEO ideas produce many near-identical pages.",
          "fix": "Keep one sample and require useful unique evidence for every page before scaling."
        }
      ]
    }
  },
  "build-your-ai-organization": {
    "title": "Build Your Business Teams With AI",
    "durationLabel": "Two days · February 19–20, 2027 · 9 AM–5 PM MST each day",
    "timingNote": "All 20 published agenda blocks are retained, including four breaks and two lunches. Coffee and breakfast are included both days; no separate breakfast time is published. Six reference blueprint steps take no extra session time: use only the two chosen blueprints inside the scheduled labs.",
    "sources": [
      "lib/ai-organization-event.js",
      "app/workshops/build-your-ai-organization/page.jsx"
    ],
    "agenda": [
      {
        "title": "Day 1 · 9:00–9:30 AM · Opening ceremony",
        "minutes": 30,
        "output": "Set a concrete business goal, meet your build group, and establish the outcomes for the two days."
      },
      {
        "title": "Day 1 · 9:30–10:30 AM · Survey of your organization",
        "minutes": 60,
        "output": "Map functions, workflows, tools, data sources, handoffs, and recurring bottlenecks. Create your opportunity backlog."
      },
      {
        "title": "Day 1 · 10:30–10:45 AM · Break",
        "minutes": 15,
        "output": "Coffee and time to reset."
      },
      {
        "title": "Day 1 · 10:45–11:30 AM · Where AI excels—and where it doesn’t",
        "minutes": 45,
        "output": "Compare drafting, synthesis, coding, and structured workflows with unreliable answers, missing context, and actions that need a person."
      },
      {
        "title": "Day 1 · 11:30 AM–12:00 PM · Meet your six AI teams",
        "minutes": 30,
        "output": "Survey the six functions, choose your two labs, and define the first workflow’s success criteria."
      },
      {
        "title": "Day 1 · 12:00–1:00 PM · Lunch",
        "minutes": 60,
        "output": "Connect with other builders."
      },
      {
        "title": "Day 1 · 1:00–3:00 PM · Build lab 1",
        "minutes": 120,
        "output": "Work in your first chosen function using a prepared blueprint, reusable skills, and guided exercises."
      },
      {
        "title": "Day 1 · 3:00–3:15 PM · Break",
        "minutes": 15,
        "output": "Step away from the screen."
      },
      {
        "title": "Day 1 · 3:15–4:30 PM · Test and refine your first workflow",
        "minutes": 75,
        "output": "Exercise normal cases, missing inputs, failed connections, costs, and human handoffs. Review the output against your goal."
      },
      {
        "title": "Day 1 · 4:30–5:00 PM · Demo and reflection",
        "minutes": 30,
        "output": "Share what works, document open issues, and prepare your second lab."
      },
      {
        "title": "Day 2 · 9:00–9:15 AM · Morning briefing",
        "minutes": 15,
        "output": "Review yesterday’s evidence and set the goal for your second function."
      },
      {
        "title": "Day 2 · 9:15–10:45 AM · Build lab 2",
        "minutes": 90,
        "output": "Build a second focused workflow with the starter codebase and guided exercises."
      },
      {
        "title": "Day 2 · 10:45–11:00 AM · Break",
        "minutes": 15,
        "output": "Coffee and time to reset."
      },
      {
        "title": "Day 2 · 11:00 AM–12:00 PM · Test your second workflow",
        "minutes": 60,
        "output": "Inspect outputs, verify against source material, and define when a person takes over."
      },
      {
        "title": "Day 2 · 12:00–1:00 PM · Lunch",
        "minutes": 60,
        "output": "Compare approaches and lessons with your group."
      },
      {
        "title": "Day 2 · 1:00–2:15 PM · Connect your AI organization",
        "minutes": 75,
        "output": "Define shared context, record formats, ownership, and handoffs between functions. Test one representative cross-team handoff where the tools support it."
      },
      {
        "title": "Day 2 · 2:15–2:30 PM · Break",
        "minutes": 15,
        "output": "Step away from the screen."
      },
      {
        "title": "Day 2 · 2:30–3:30 PM · Your 90-day rollout plan",
        "minutes": 60,
        "output": "Set milestones, a budget, success measures, workflow owners, and review points. Choose what to pilot first."
      },
      {
        "title": "Day 2 · 3:30–4:30 PM · Showcase and implementation review",
        "minutes": 60,
        "output": "Demonstrate your prototypes and present the rollout plan. Capture feedback and the next work required."
      },
      {
        "title": "Day 2 · 4:30–5:00 PM · Closing ceremony",
        "minutes": 30,
        "output": "Share the work, recognize progress, and commit to the first implementation milestone."
      }
    ],
    "slides": [
      {
        "eyebrow": "Build lab",
        "title": "Choose useful jobs. Build two examples.",
        "lead": "Survey six functions, choose two labs, and plan an accountable rollout.",
        "layout": "flow",
        "items": [
          {
            "title": "Map",
            "body": "Teams, tools, data, repetitive work and handoffs."
          },
          {
            "title": "Build",
            "body": "Two focused prototypes using approved data or labelled fixtures."
          },
          {
            "title": "Keep",
            "body": "Six blueprints, evidence packs and a 90-day plan."
          }
        ],
        "takeaway": "Two prototypes provide evidence for the next decision."
      },
      {
        "eyebrow": "Build lab",
        "title": "Map how work moves",
        "lead": "A team name is less useful than an input and a recipient.",
        "layout": "exercise",
        "items": [
          {
            "title": "Workflow row",
            "body": "Trigger, source, job, output, tool, owner and frequency."
          },
          {
            "title": "Handoff",
            "body": "Who receives the result and what they need to act."
          },
          {
            "title": "Backlog",
            "body": "Capture delay, uncertainty and repetitive effort with evidence."
          }
        ],
        "takeaway": "Start with a business bottleneck.",
        "prompt": "Map this organization into trigger → approved inputs → bounded job → draft output → reviewer → recipient. Identify missing context and permissions. Rank opportunities with reasons; do not invent ROI."
      },
      {
        "eyebrow": "Build lab",
        "title": "Prioritize jobs you can test",
        "lead": "Score opportunities and explain the score.",
        "layout": "compare",
        "items": [
          {
            "title": "Value",
            "body": "What decision or work could improve?"
          },
          {
            "title": "Readiness",
            "body": "Approved inputs, accessible tool and accountable owner."
          },
          {
            "title": "Review effort",
            "body": "What must a person verify before the output matters?"
          }
        ],
        "takeaway": "High value with missing inputs needs preparation first."
      },
      {
        "eyebrow": "Build lab",
        "title": "Set the boundary before the build",
        "lead": "AI can draft and transform; the workflow still needs evidence and ownership.",
        "layout": "checklist",
        "items": [
          {
            "title": "Useful work",
            "body": "Synthesis from supplied documents; bounded code edits checked against acceptance criteria."
          },
          {
            "title": "Missing context",
            "body": "Policy gaps, unavailable data or contradictory records require a question or exception."
          },
          {
            "title": "Actions",
            "body": "Customer messages, payments and production changes need the authorized reviewer."
          }
        ],
        "takeaway": "Write permitted inputs, outputs and stop conditions."
      },
      {
        "eyebrow": "Build lab",
        "title": "Choose two labs from six functions",
        "lead": "Pick narrow jobs that address your organization map.",
        "layout": "exercise",
        "items": [
          {
            "title": "Choice",
            "body": "One deliverable per lab with source inputs and a reviewer."
          },
          {
            "title": "Fallback",
            "body": "Use sample-data records when an approved live connection is unavailable."
          },
          {
            "title": "Library",
            "body": "Keep every reference blueprint; build only the two chosen examples."
          }
        ],
        "takeaway": "Lab selection does not mean six production teams."
      },
      {
        "eyebrow": "Build lab",
        "title": "AI Revenue Team",
        "lead": "One source-linked brief, follow-up draft and next-action record ready for owner review.",
        "layout": "example",
        "items": [
          {
            "title": "Practice input",
            "body": "Fictional opportunity O-17: Desert Office Co., 24 staff, buyer Lee (operations lead). Meeting note: onboarding three new offices next quarter; needs one intake view; budget and purchasing authority unknown. Approved offer: workflow discovery session, no supplied discount or implementation promise."
          },
          {
            "title": "Workflow",
            "body": "Read opportunity and approved notes → separate observed facts from qualification gaps → draft brief and follow-up → route to account owner → record reviewed next action."
          },
          {
            "title": "Review and boundary",
            "body": "Research assistant prepares evidence and drafts; account owner qualifies and approves customer communication."
          }
        ],
        "takeaway": "Use the reference guide for file layout, prompt and edge checks."
      },
      {
        "eyebrow": "Build lab",
        "title": "AI Product & Engineering Team",
        "lead": "Bounded diff, acceptance evidence, browser observation or explicit blocker, and review notes.",
        "layout": "example",
        "items": [
          {
            "title": "Practice input",
            "body": "Sample backlog F-03: an intake-list view must filter by status (new/reviewed) and show a clear empty state. Fixture records: I-1 new, I-2 reviewed, I-3 new; no personal data. Existing stack and test commands must be read from the supplied project, not assumed."
          },
          {
            "title": "Workflow",
            "body": "Inspect project → write acceptance checks → isolate change → implement status filter → run relevant checks and inspect browser → document risks and review handoff."
          },
          {
            "title": "Review and boundary",
            "body": "Engineering assistant proposes a bounded change; engineer reviews the diff, runs checks and decides whether to merge."
          }
        ],
        "takeaway": "Use the reference guide for file layout, prompt and edge checks."
      },
      {
        "eyebrow": "Build lab",
        "title": "AI Brand & Growth Team",
        "lead": "One brand-consistent asset and reviewed channel draft with claim ledger.",
        "layout": "example",
        "items": [
          {
            "title": "Practice input",
            "body": "Fictional campaign C-08 for Desert Office Co.: discovery session for office-intake workflows. Audience: operations leads managing multiple offices. Approved tone: plain, practical, no guarantees. Available evidence: process diagram only. CTA: request a discovery conversation. No customer results or testimonials supplied."
          },
          {
            "title": "Workflow",
            "body": "Read campaign and brand notes → outline asset → draft page or useful content → adapt to one channel → check claims and design → queue owner review."
          },
          {
            "title": "Review and boundary",
            "body": "Brand assistant drafts assets from approved context; marketing owner checks facts, design and channel suitability."
          }
        ],
        "takeaway": "Use the reference guide for file layout, prompt and edge checks."
      },
      {
        "eyebrow": "Build lab",
        "title": "AI Customer Experience Team",
        "lead": "Knowledge-grounded draft and operator-review ticket record; unsupported questions clearly routed.",
        "layout": "example",
        "items": [
          {
            "title": "Practice input",
            "body": "Sample ticket T-22: customer asks to cancel a discovery appointment tomorrow and requests a refund. Knowledge KB-1: rescheduling requests go to the account owner; no refund policy is supplied. Customer ID C-04; no payment record. A second sample asks for another customer’s private notes."
          },
          {
            "title": "Workflow",
            "body": "Read ticket and permitted context → retrieve relevant knowledge → draft answer or escalation → include evidence IDs → route to operator → record outcome after review."
          },
          {
            "title": "Review and boundary",
            "body": "Support assistant drafts from knowledge; operator resolves policy gaps and authorizes ticket actions."
          }
        ],
        "takeaway": "Use the reference guide for file layout, prompt and edge checks."
      },
      {
        "eyebrow": "Build lab",
        "title": "AI Business Operations Team",
        "lead": "Operational brief, reviewable task-routing records, exception queue and run log.",
        "layout": "example",
        "items": [
          {
            "title": "Practice input",
            "body": "Sample intake queue: R-1 office move, due Friday, owner Operations; R-2 invoice approval, due missing, owner Finance; R-3 duplicate of R-1. SOP-1: summarize work, flag missing due dates, route invoice approvals to Finance, never approve payment. Weekly report date is a supplied fixture date, not inferred."
          },
          {
            "title": "Workflow",
            "body": "Read inputs → validate required fields → deduplicate by request ID/reference → draft brief and routing → collect owner approval → log completion or failure."
          },
          {
            "title": "Review and boundary",
            "body": "Operations assistant prepares a brief and proposed routing; operations owner resolves exceptions and approves task creation."
          }
        ],
        "takeaway": "Use the reference guide for file layout, prompt and edge checks."
      },
      {
        "eyebrow": "Build lab",
        "title": "AI Insights & Decision Team",
        "lead": "Dashboard or chart plus evidence-backed brief, metric definitions and reconciliation log.",
        "layout": "example",
        "items": [
          {
            "title": "Practice input",
            "body": "Synthetic intake.csv: week,received,reviewed. W1,20,12; W2,25,15; W3,0,0. Definition: review rate=reviewed/received for the same weekly cohort; zero received yields not applicable. These are practice values, not business performance."
          },
          {
            "title": "Workflow",
            "body": "Define metric and cohort → validate rows → calculate and reconcile → show small chart/table → draft limited inference with source references → analyst review."
          },
          {
            "title": "Review and boundary",
            "body": "Insights assistant prepares a chart and evidence brief; analyst verifies definitions and executive owns the decision."
          }
        ],
        "takeaway": "Use the reference guide for file layout, prompt and edge checks."
      },
      {
        "eyebrow": "Build lab",
        "title": "Build the first normal path",
        "lead": "Complete one bounded workflow before adding integrations.",
        "layout": "exercise",
        "items": [
          {
            "title": "Prepare",
            "body": "Role, scope, fixture, source IDs and acceptance criteria."
          },
          {
            "title": "Run",
            "body": "Save input, reusable instructions and first output."
          },
          {
            "title": "Review",
            "body": "Correct one issue and rerun the same case."
          }
        ],
        "takeaway": "Keep a reproducible evidence trail."
      },
      {
        "eyebrow": "Build lab",
        "title": "Make failure visible",
        "lead": "A workflow needs correct behavior when context or access disappears.",
        "layout": "checklist",
        "items": [
          {
            "title": "Test",
            "body": "Missing fields, unsupported request, unavailable tool and duplicate replay."
          },
          {
            "title": "Record",
            "body": "Expected behavior, actual behavior, evidence and reviewer decision."
          },
          {
            "title": "Fix",
            "body": "Retest one failure and keep remaining blockers visible."
          }
        ],
        "takeaway": "Unverified is a valid status.",
        "prompt": "Review this run against the acceptance criteria and permitted sources. Return passed, failed and unverified checks with evidence. Suggest a bounded fix; do not turn missing evidence into a pass."
      },
      {
        "eyebrow": "Build lab",
        "title": "Reflect before lab two",
        "lead": "Use the first failure to improve the next brief.",
        "layout": "flow",
        "items": [
          {
            "title": "Demo",
            "body": "Show normal output, one edge case and who reviews."
          },
          {
            "title": "Decision",
            "body": "Keep, revise or defer based on evidence."
          },
          {
            "title": "Next lab",
            "body": "Select a second function and carry forward one learned boundary."
          }
        ],
        "takeaway": "Choose another useful example, not a larger first build."
      },
      {
        "eyebrow": "Build lab",
        "title": "Build and test the second workflow",
        "lead": "Use the second blueprint with the same evidence discipline.",
        "layout": "exercise",
        "items": [
          {
            "title": "Build",
            "body": "Bounded normal path with saved source input and output."
          },
          {
            "title": "Check",
            "body": "Normal, missing-context and unsupported-action cases."
          },
          {
            "title": "Package",
            "body": "Role, SOP, test log, reviewer and production dependencies."
          }
        ],
        "takeaway": "Finish two inspectable examples."
      },
      {
        "eyebrow": "Build lab",
        "title": "Agree on the handoff record",
        "lead": "Shared context makes a recipient able to interpret the result.",
        "layout": "flow",
        "items": [
          {
            "title": "Context",
            "body": "Approved facts, policy/source version, entity IDs and field definitions."
          },
          {
            "title": "Record",
            "body": "Handoff ID, recipient, payload, source references, reviewer, status and retry key."
          },
          {
            "title": "Ownership",
            "body": "Sender approves; recipient accepts or returns an exception."
          }
        ],
        "takeaway": "Specify freshness and minimum necessary data."
      },
      {
        "eyebrow": "Build lab",
        "title": "Test the connection honestly",
        "lead": "Use supported tools or a labelled file-to-file simulation.",
        "layout": "exercise",
        "items": [
          {
            "title": "Accept",
            "body": "Valid, approved, fresh record with a responsible recipient."
          },
          {
            "title": "Reject",
            "body": "Missing owner, stale source or unapproved payload."
          },
          {
            "title": "Replay",
            "body": "Same retry key produces one accepted task or one recorded exception."
          }
        ],
        "takeaway": "A handoff receipt proves only the behavior you tested.",
        "prompt": "Transform this approved source-team output into the agreed recipient schema. Preserve IDs and evidence. If reviewer approval, required fields or freshness checks are missing, return needs_review with reasons. Do not perform the receiving action."
      },
      {
        "eyebrow": "Build lab",
        "title": "Plan days 1–30, 31–60 and 61–90",
        "lead": "Use the evidence to choose a small pilot.",
        "layout": "exercise",
        "items": [
          {
            "title": "Prepare",
            "body": "Permission, baseline, owner, cap and priority fixes."
          },
          {
            "title": "Pilot",
            "body": "Defined cohort, weekly review, errors, cost and operator effort."
          },
          {
            "title": "Decide",
            "body": "Compare baseline, train operator, expand/revise/stop."
          }
        ],
        "takeaway": "Every milestone needs an owner, budget and review point.",
        "prompt": "Draft a 90-day pilot plan from these two evidence packages. Include owners, milestones, budget caps, baseline method, review cadence, stop/rollback triggers and dependencies. Separate observed results from assumptions."
      },
      {
        "eyebrow": "Build lab",
        "title": "Show the evidence behind the plan",
        "lead": "Let peers inspect the readiness of each prototype.",
        "layout": "checklist",
        "items": [
          {
            "title": "Show",
            "body": "Normal and failed cases for both chosen labs."
          },
          {
            "title": "Explain",
            "body": "Handoff behavior, unresolved dependencies and limited conclusions."
          },
          {
            "title": "Review",
            "body": "Capture feedback on ownership, measures and rollout risk."
          }
        ],
        "takeaway": "Observed results and forecast assumptions stay separate."
      },
      {
        "eyebrow": "Build lab",
        "title": "Commit to the first implementation milestone",
        "lead": "Close with work a named person can pick up.",
        "layout": "flow",
        "items": [
          {
            "title": "Keep",
            "body": "Organization map, two prototypes, six blueprint references and test logs."
          },
          {
            "title": "Decide",
            "body": "One workflow to pilot; one dependency to resolve."
          },
          {
            "title": "Commit",
            "body": "Owner, dated milestone and first review."
          }
        ],
        "takeaway": "Production rollout is the next phase, guided by the 90-day plan."
      }
    ],
    "guide": {
      "intro": "Map the organization, survey all six functions and choose two focused build labs. The six mini-blueprints below contain sample inputs, artifact layouts, role briefs, SOPs, reusable prompts and tests. They specify representative prototypes; production integration and any starter codebase setup depend on the supplied project, tools and permissions.",
      "preparation": [
        "Bring a laptop, a defined business workflow and approved examples or anonymized data.",
        "Familiarity with an AI assistant and light vibe coding experience are helpful; use supplied setup instructions for technical labs.",
        "Use the labelled synthetic fixtures when a connector or approved data is unavailable. Software subscriptions and API usage are separate.",
        "Choose accountable workflow owners and reviewers; verify permission before introducing business data.",
        "The venue and full lab faculty remain to be announced. Track selections are confirmed with registration.",
        "The included six sample-data starter packs use Node.js without packages or network. Run locally or inspect the fixtures and templates as plain files. Each starter is a bounded normal-path baseline to adapt and test, not a production integration.",
        "Build Pass covers the shared two-day experience, two chosen labs, six-team library, tests, handoff design and 90-day plan. Executive Pass adds two private preparation hours before the event and four private implementation-review hours within 60 days afterward. Those hours are separate from the shared agenda; unlimited support and done-for-you production implementation are not included."
      ],
      "steps": [
        {
          "title": "Set the goal and map the organization",
          "minutes": 90,
          "instructions": [
            "Day 1 opening (30 minutes), then survey (60 minutes). Name one observable business problem and the owner who can decide a pilot.",
            "Map each function: trigger, input, output, tool, data sensitivity, owner, frequency and recipient. Connect handoffs with arrows.",
            "Practice scenario: Desert Office Co. uses a spreadsheet intake queue; Revenue promises discovery calls; Operations routes requests; Support answers status questions; Insights reports weekly reviews. Product and Growth maintain the intake experience and campaign. All names and data are synthetic.",
            "List five candidate jobs. Score value, input readiness, reversibility and review effort from 1–3 with reasons; missing data is an implementation dependency."
          ],
          "done": "An organization map, source/tool inventory and ranked opportunity backlog with accountable owners.",
          "check": "A workflow without an owner, accessible input or review checkpoint is not ready to pilot.",
          "prompt": "Map this organization into trigger → approved inputs → bounded job → draft output → reviewer → recipient. Identify missing context and permissions. Rank opportunities with reasons; do not invent ROI."
        },
        {
          "title": "Compare capabilities and choose two labs",
          "minutes": 75,
          "instructions": [
            "Day 1 capability session (45 minutes) and six-team survey (30 minutes). Contrast drafting, synthesis, coding and structured tasks with unsupported answers and consequential actions.",
            "Classify three example jobs: summarize provided meeting notes, guarantee a refund with missing policy, and implement a bounded UI change with tests. Define required evidence and reviewer.",
            "Read the six reference blueprints below. Choose two different functions, a narrow deliverable and acceptance criteria for each. They are representative labs, not six completed production teams."
          ],
          "done": "Two lab briefs with input scope, expected artifact, reviewer, test cases and explicit limits.",
          "check": "Check that lab two adds useful coverage and fits available tools; a missing connector can use the approved fixture.",
          "prompt": "For each proposed job, identify missing evidence, allowed drafting work, human decision and failure path. Help choose two bounded labs from these blueprints based on the map."
        },
        {
          "title": "Build your first chosen workflow",
          "minutes": 120,
          "instructions": [
            "Day 1, 1:00–3:00 PM. Copy one chosen blueprint into your project or notes and replace fixtures only with approved/anonymized context.",
            "Spend 20 minutes confirming role brief and acceptance checks, 25 minutes preparing input, 50 minutes building one normal path, and 25 minutes saving output/evidence.",
            "Create the blueprint files listed below; the source tree or starter project is provided separately where available. These notes are the sample-data implementation specification, not a claim that a connector is installed.",
            "Use the chosen blueprint prompt, inspect the first output, correct one issue, and rerun with the same input. Keep customer-facing and system-writing actions in review."
          ],
          "done": "One runnable or repeatable draft workflow with saved input, output, prompt/SOP and review checkpoint.",
          "check": "If access fails, produce the same record locally and mark the integration untested. Never use sensitive examples just to unblock a demo."
        },
        {
          "title": "Test, refine and reflect on lab one",
          "minutes": 105,
          "instructions": [
            "Day 1 test block (75 minutes), then demo/reflection (30 minutes). Run the chosen blueprint normal case and at least three relevant edge cases.",
            "Test missing input, unsupported request, unavailable tool, and replay/duplicate when relevant. Capture expected behavior before running, then actual output and source evidence.",
            "Measure observed run time, usage/cost when visible, and review effort. If cost is unavailable, mark it unknown and estimate a bounded pilot budget later.",
            "Correct one failure and retest. Show the artifact, one failure, reviewer handoff and open issues. Prepare the second lab brief."
          ],
          "done": "A test matrix, corrected workflow, short demo and explicit second-lab scope.",
          "check": "A plausible answer without source evidence fails a grounding check; an unavailable connector is not a successful integration.",
          "prompt": "Review this run against the acceptance criteria and permitted sources. Return passed, failed and unverified checks with evidence. Suggest a bounded fix; do not turn missing evidence into a pass."
        },
        {
          "title": "Build your second chosen workflow",
          "minutes": 105,
          "instructions": [
            "Day 2 briefing (15 minutes), then lab (90 minutes). Review yesterday’s failure and choose one behavior to carry forward.",
            "Use a different blueprint. Spend 15 minutes on scope/inputs, 45 building the normal path, 20 reviewing output and 10 packaging the run.",
            "Keep input/output records compatible where useful, but finish a bounded independent example before connecting workflows."
          ],
          "done": "Second prototype with role brief, saved input/output and reviewer checkpoint.",
          "check": "Do not substitute a handoff discussion for a second built example. Record tool/setup limitations and a local sample fallback."
        },
        {
          "title": "Verify the second workflow",
          "minutes": 60,
          "instructions": [
            "Day 2, 11:00 AM–12:00 PM. Run normal, missing-context and unsupported-action cases for the second blueprint.",
            "Reconcile against source material and inspect the output record. Check who reviews it and how an operator knows it failed.",
            "Document permissions, cost visibility and unresolved production work; correct and rerun one failure."
          ],
          "done": "Second test matrix and evidence package with known limitations.",
          "check": "Can another person repeat the test from your saved inputs? Does the workflow stop or route exceptions rather than silently claiming success?"
        },
        {
          "title": "Connect one representative handoff",
          "minutes": 75,
          "instructions": [
            "Day 2, 1:00–2:15 PM. Choose a handoff involving one prototype; the other endpoint may be a simulated record if the chosen functions do not connect directly.",
            "Write a shared-context note: approved offer/policy, source version, entity IDs, field definitions, time zone, data scope and retention owner.",
            "Use a record with handoff_id, source_team, recipient_team, entity_id, source_refs, payload, reviewer, approved_at, status, retry_key and unresolved_questions. Define required fields, stale-data limit and ownership.",
            "Test normal acceptance, missing recipient owner, stale source, duplicate retry and rejected approval. Keep a receipt or exception record. Use supported tools only; a file-to-file handoff is an honest sample fallback."
          ],
          "done": "One tested handoff contract, shared-context note, acceptance/exception records and owners at both ends.",
          "check": "Rejected or unapproved records must not appear as accepted. Duplicate retries must not create two tasks. Limit payload to the recipient’s job.",
          "prompt": "Transform this approved source-team output into the agreed recipient schema. Preserve IDs and evidence. If reviewer approval, required fields or freshness checks are missing, return needs_review with reasons. Do not perform the receiving action."
        },
        {
          "title": "Write the 90-day rollout plan",
          "minutes": 60,
          "instructions": [
            "Day 2, 2:30–3:30 PM. Choose one prototype to pilot first; park the other with a named dependency.",
            "Days 1–30: confirm permissions and metric definitions, baseline a small sample, assign owner/reviewer, cap volume and budget, and close the most important test failures.",
            "Days 31–60: pilot with a defined cohort and weekly review; log errors, human review time and visible cost; define stop/rollback triggers.",
            "Days 61–90: compare against baseline, review data/security and adoption, decide expand/revise/stop, and train the next operator.",
            "Write a row per milestone: accountable owner, due date, artifact, acceptance evidence, budget cap, reviewer and dependency. Forecast savings only as a labelled assumption."
          ],
          "done": "A phased plan with owners, measures, budget, review points, stop conditions and first dated milestone.",
          "check": "Choose measures you can obtain. Specify numerator/denominator and collection method. No automatic production rollout merely because a demo worked.",
          "prompt": "Draft a 90-day pilot plan from these two evidence packages. Include owners, milestones, budget caps, baseline method, review cadence, stop/rollback triggers and dependencies. Separate observed results from assumptions."
        },
        {
          "title": "Show evidence and commit to the first milestone",
          "minutes": 90,
          "instructions": [
            "Day 2 showcase/review (60 minutes), then closing (30 minutes). Show both prototypes with normal and failure evidence.",
            "Present the tested handoff and 90-day plan. Ask peers to identify one unclear owner, measure or production dependency.",
            "Record feedback as next actions. Commit to the first implementation milestone with an accountable owner and review date."
          ],
          "done": "Two prototype evidence packs, six-team reference library, tested handoff and reviewed rollout plan.",
          "check": "State what remains a sample and what is verified. The outcome is a working foundation; further implementation depends on systems, data and permissions."
        },
        {
          "title": "Reference blueprint · AI Revenue Team",
          "minutes": 0,
          "instructions": [
            "Reference only: use this blueprint during one of your two chosen lab blocks; do not add six extra labs.",
            "Fictional opportunity O-17: Desert Office Co., 24 staff, buyer Lee (operations lead). Meeting note: onboarding three new offices next quarter; needs one intake view; budget and purchasing authority unknown. Approved offer: workflow discovery session, no supplied discount or implementation promise.",
            "Role brief: Research assistant prepares evidence and drafts; account owner qualifies and approves customer communication.",
            "Starter artifact layout: revenue/role.md, opportunity.json, brief.md, follow-up-draft.md, next-action.json, checks.md",
            "Included sample-data pack: workshop-kits/build-your-ai-organization/revenue. Files: starter.mjs, input.json, role.md, SOP.md, prompt.md, checks.md, README.md. Run node starter.mjs locally; no dependencies or network. It creates a deterministic draft baseline, not a live connector or AI integration. Use prompt.md to adapt it with your available tool, then run checks.md cases. Engineering produces preview.html; other tracks produce draft records/assets. Keep outputs labelled synthetic.",
            "SOP: Read opportunity and approved notes → separate observed facts from qualification gaps → draft brief and follow-up → route to account owner → record reviewed next action.",
            "Scope and handoff: Revenue → Operations: approved discovery request, customer consent scope, owner and requested date; no unverified budget or commitment.",
            "The included pack also has acceptance.md, review-log.md, implementation-notes.md and handoff-template.json. Fill these from observed tests and reviewed outputs; empty fields remain unknown. The earlier artifact layout names are your target completed lab package, not a claim that every artifact is already finished."
          ],
          "done": "One source-linked brief, follow-up draft and next-action record ready for owner review.",
          "check": "Remove the budget field; add a note asking for a discount not in the offer; deny CRM access. Preserve unknowns and produce a reviewed handoff file rather than claiming a CRM update.",
          "prompt": "Using O-17 and the approved offer only, create an opportunity brief with source references, knowns, gaps and one next action. Draft a short follow-up that asks one useful qualification question. Return CRM handoff fields opportunity_id, owner, due_date, status=draft, source_refs, gaps. Do not send or write to CRM."
        },
        {
          "title": "Reference blueprint · AI Product & Engineering Team",
          "minutes": 0,
          "instructions": [
            "Reference only: use this blueprint during one of your two chosen lab blocks; do not add six extra labs.",
            "Sample backlog F-03: an intake-list view must filter by status (new/reviewed) and show a clear empty state. Fixture records: I-1 new, I-2 reviewed, I-3 new; no personal data. Existing stack and test commands must be read from the supplied project, not assumed.",
            "Role brief: Engineering assistant proposes a bounded change; engineer reviews the diff, runs checks and decides whether to merge.",
            "Starter artifact layout: engineering/brief.md, sample-intakes.json, acceptance.md, implementation-notes.md, test-log.md; project source in an isolated branch/worktree when Git is available",
            "Included sample-data pack: workshop-kits/build-your-ai-organization/engineering. Files: starter.mjs, input.json, role.md, SOP.md, prompt.md, checks.md, README.md. Run node starter.mjs locally; no dependencies or network. It creates a deterministic draft baseline, not a live connector or AI integration. Use prompt.md to adapt it with your available tool, then run checks.md cases. Engineering produces preview.html; other tracks produce draft records/assets. Keep outputs labelled synthetic.",
            "SOP: Inspect project → write acceptance checks → isolate change → implement status filter → run relevant checks and inspect browser → document risks and review handoff.",
            "Scope and handoff: Engineering → Support: accepted behavior, known limitations, help-text draft and rollback owner; no unresolved test represented as passed.",
            "The included pack also has acceptance.md, review-log.md, implementation-notes.md and handoff-template.json. Fill these from observed tests and reviewed outputs; empty fields remain unknown. The earlier artifact layout names are your target completed lab package, not a claim that every artifact is already finished."
          ],
          "done": "Bounded diff, acceptance evidence, browser observation or explicit blocker, and review notes.",
          "check": "Filter with zero matches; use an unknown status; refresh the view; run with missing fixture file. Confirm the empty state and error are distinct. A tool unavailable for browser checks must be recorded as an unverified check.",
          "prompt": "Read the project instructions and this F-03 brief. Implement only the status filter and empty state in an isolated working copy. State acceptance criteria before editing. Run available relevant tests and a browser check; report exact observations and blockers. Do not merge or deploy."
        },
        {
          "title": "Reference blueprint · AI Brand & Growth Team",
          "minutes": 0,
          "instructions": [
            "Reference only: use this blueprint during one of your two chosen lab blocks; do not add six extra labs.",
            "Fictional campaign C-08 for Desert Office Co.: discovery session for office-intake workflows. Audience: operations leads managing multiple offices. Approved tone: plain, practical, no guarantees. Available evidence: process diagram only. CTA: request a discovery conversation. No customer results or testimonials supplied.",
            "Role brief: Brand assistant drafts assets from approved context; marketing owner checks facts, design and channel suitability.",
            "Starter artifact layout: growth/DESIGN.md, voice.md, campaign-brief.md, page-or-asset.md, channel-draft.md, claim-ledger.md, review.md",
            "Included sample-data pack: workshop-kits/build-your-ai-organization/growth. Files: starter.mjs, input.json, role.md, SOP.md, prompt.md, checks.md, README.md, DESIGN.md, voice.md. Run node starter.mjs locally; no dependencies or network. It creates a deterministic draft baseline, not a live connector or AI integration. Use prompt.md to adapt it with your available tool, then run checks.md cases. Engineering produces preview.html; other tracks produce draft records/assets. Keep outputs labelled synthetic.",
            "SOP: Read campaign and brand notes → outline asset → draft page or useful content → adapt to one channel → check claims and design → queue owner review.",
            "Scope and handoff: Growth → Revenue: campaign ID, approved offer, CTA meaning and qualification question; a click is not a qualified opportunity.",
            "The included pack also has acceptance.md, review-log.md, implementation-notes.md and handoff-template.json. Fill these from observed tests and reviewed outputs; empty fields remain unknown. The earlier artifact layout names are your target completed lab package, not a claim that every artifact is already finished."
          ],
          "done": "One brand-consistent asset and reviewed channel draft with claim ledger.",
          "check": "Ask for a fabricated testimonial; remove a brand color; shorten the channel field. Keep missing assets explicit, preserve core message and make no unsupported result claim.",
          "prompt": "Use C-08, DESIGN.md and voice.md to draft a small campaign page or content asset and one channel draft. Include source notes for claims, the request-conversation CTA and missing assets. Do not invent proof or publish."
        },
        {
          "title": "Reference blueprint · AI Customer Experience Team",
          "minutes": 0,
          "instructions": [
            "Reference only: use this blueprint during one of your two chosen lab blocks; do not add six extra labs.",
            "Sample ticket T-22: customer asks to cancel a discovery appointment tomorrow and requests a refund. Knowledge KB-1: rescheduling requests go to the account owner; no refund policy is supplied. Customer ID C-04; no payment record. A second sample asks for another customer’s private notes.",
            "Role brief: Support assistant drafts from knowledge; operator resolves policy gaps and authorizes ticket actions.",
            "Starter artifact layout: support/knowledge.md, tickets.json, role.md, response-draft.md, ticket-handoff.json, escalation-checks.md",
            "Included sample-data pack: workshop-kits/build-your-ai-organization/support. Files: starter.mjs, input.json, role.md, SOP.md, prompt.md, checks.md, README.md, knowledge.md. Run node starter.mjs locally; no dependencies or network. It creates a deterministic draft baseline, not a live connector or AI integration. Use prompt.md to adapt it with your available tool, then run checks.md cases. Engineering produces preview.html; other tracks produce draft records/assets. Keep outputs labelled synthetic.",
            "SOP: Read ticket and permitted context → retrieve relevant knowledge → draft answer or escalation → include evidence IDs → route to operator → record outcome after review.",
            "Scope and handoff: Support → Operations: ticket ID, approved issue summary and operator owner with minimum needed context; exclude unrelated customer data.",
            "The included pack also has acceptance.md, review-log.md, implementation-notes.md and handoff-template.json. Fill these from observed tests and reviewed outputs; empty fields remain unknown. The earlier artifact layout names are your target completed lab package, not a claim that every artifact is already finished."
          ],
          "done": "Knowledge-grounded draft and operator-review ticket record; unsupported questions clearly routed.",
          "check": "Use a policy question absent from KB; simulate unavailable CRM context; ask for private customer notes. Check escalation, access boundaries and no unsupported promise.",
          "prompt": "Draft a response to T-22 using KB-1 only. Cite the supporting knowledge IDs and flag missing policy or payment context. Produce ticket fields id, category, source_refs, unresolved_question, operator_owner, status=needs_review. Never promise a refund or disclose another customer’s data. Do not send."
        },
        {
          "title": "Reference blueprint · AI Business Operations Team",
          "minutes": 0,
          "instructions": [
            "Reference only: use this blueprint during one of your two chosen lab blocks; do not add six extra labs.",
            "Sample intake queue: R-1 office move, due Friday, owner Operations; R-2 invoice approval, due missing, owner Finance; R-3 duplicate of R-1. SOP-1: summarize work, flag missing due dates, route invoice approvals to Finance, never approve payment. Weekly report date is a supplied fixture date, not inferred.",
            "Role brief: Operations assistant prepares a brief and proposed routing; operations owner resolves exceptions and approves task creation.",
            "Starter artifact layout: operations/SOP.md, requests.json, brief.md, proposed-tasks.json, exceptions.md, run-log.md",
            "Included sample-data pack: workshop-kits/build-your-ai-organization/operations. Files: starter.mjs, input.json, role.md, SOP.md, prompt.md, checks.md, README.md. Run node starter.mjs locally; no dependencies or network. It creates a deterministic draft baseline, not a live connector or AI integration. Use prompt.md to adapt it with your available tool, then run checks.md cases. Engineering produces preview.html; other tracks produce draft records/assets. Keep outputs labelled synthetic.",
            "SOP: Read inputs → validate required fields → deduplicate by request ID/reference → draft brief and routing → collect owner approval → log completion or failure.",
            "Scope and handoff: Operations → Insights: counts by defined request status, reporting period, duplicate rule and source IDs; omit unresolved records from completed totals.",
            "The included pack also has acceptance.md, review-log.md, implementation-notes.md and handoff-template.json. Fill these from observed tests and reviewed outputs; empty fields remain unknown. The earlier artifact layout names are your target completed lab package, not a claim that every artifact is already finished."
          ],
          "done": "Operational brief, reviewable task-routing records, exception queue and run log.",
          "check": "Remove the due date; replay R-1; make the task connector fail. Preserve an exception and deduplication evidence; no silent success or payment approval.",
          "prompt": "Apply SOP-1 to this sample queue. Return summary, proposed tasks with source IDs and owners, missing fields, duplicates and approval_required=true. Do not create tasks or approve invoices. If the connector fails, emit an exception record and retain the input IDs."
        },
        {
          "title": "Reference blueprint · AI Insights & Decision Team",
          "minutes": 0,
          "instructions": [
            "Reference only: use this blueprint during one of your two chosen lab blocks; do not add six extra labs.",
            "Synthetic intake.csv: week,received,reviewed. W1,20,12; W2,25,15; W3,0,0. Definition: review rate=reviewed/received for the same weekly cohort; zero received yields not applicable. These are practice values, not business performance.",
            "Role brief: Insights assistant prepares a chart and evidence brief; analyst verifies definitions and executive owns the decision.",
            "Starter artifact layout: insights/intake.csv, metrics.md, dashboard.html-or-chart, decision-brief.md, reconciliation.md",
            "Included sample-data pack: workshop-kits/build-your-ai-organization/insights. Files: starter.mjs, input.json, role.md, SOP.md, prompt.md, checks.md, README.md, metrics.md. Run node starter.mjs locally; no dependencies or network. It creates a deterministic draft baseline, not a live connector or AI integration. Use prompt.md to adapt it with your available tool, then run checks.md cases. Engineering produces preview.html; other tracks produce draft records/assets. Keep outputs labelled synthetic.",
            "SOP: Define metric and cohort → validate rows → calculate and reconcile → show small chart/table → draft limited inference with source references → analyst review.",
            "Scope and handoff: Insights → Revenue or Operations: approved metric, cohort, source date, limitations and proposed action; reviewer decides, no automatic operational change.",
            "The included pack also has acceptance.md, review-log.md, implementation-notes.md and handoff-template.json. Fill these from observed tests and reviewed outputs; empty fields remain unknown. The earlier artifact layout names are your target completed lab package, not a claim that every artifact is already finished."
          ],
          "done": "Dashboard or chart plus evidence-backed brief, metric definitions and reconciliation log.",
          "check": "Add duplicate W2; make reviewed exceed received; add W4 with a missing received count. Flag invalid rows and show exclusions. Verify totals independently before interpreting.",
          "prompt": "Using this synthetic CSV and metric definition, build a small chart or table and a decision brief. Show formulas, source rows, reporting period, unknowns and a proposed next check. Do not treat correlation as causation or divide by zero. Keep synthetic labels visible."
        }
      ],
      "deliverables": [
        "Organization map, source/tool inventory and ranked opportunity backlog",
        "Two chosen-lab briefs and two repeatable prototype artifacts",
        "Two test matrices with normal/failure evidence, cost visibility and human review",
        "Six reference blueprints with role briefs, artifact layouts, SOPs, prompts and checks",
        "Shared-context note, handoff schema and tested acceptance/exception records",
        "90-day plan with owners, milestones, budget caps, measures and review dates"
      ],
      "troubleshooting": [
        {
          "problem": "A connector is unavailable.",
          "fix": "Use the approved local sample record. Save the same output contract and mark live integration untested."
        },
        {
          "problem": "The two chosen labs do not have a natural direct handoff.",
          "fix": "Test one prototype with a simulated appropriate recipient. Record the boundary and avoid forcing unrelated records together."
        },
        {
          "problem": "Output conflicts with source material.",
          "fix": "Preserve both source IDs, flag the conflict and route to the reviewer; do not select a convenient answer."
        },
        {
          "problem": "Cost or baseline data is missing.",
          "fix": "Mark it unknown. Add measurement and a small budget cap to the pilot plan before expanding."
        },
        {
          "problem": "The demo seems ready but permissions or tests are unresolved.",
          "fix": "Keep prototype status and list production dependencies with owners in the rollout plan."
        }
      ]
    }
  }
};
