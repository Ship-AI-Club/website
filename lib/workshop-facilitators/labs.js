// Workshop lab data. Facilitator answers are stored separately and must not enter attendee bundles.
export const FACILITATOR_GUIDES = {
  "company-knowledge-engine": {
    "preparation": [
      "Read the current published scope and verify the prepared blueprint in the same environment learners will use. Pin tested dependencies before the cohort; do not improvise provider API syntax from slides.",
      "Prepare a local/sample route for every external dependency. Account plans, administrative access, subscriptions, API usage, and hosting are separate from admission.",
      "Keep this module and its answer keys available only to facilitators. Distribute the attendee module independently.",
      "Bring an AI coding environment and approved non-sensitive documents, or use the inline corpus below. Create a lab folder with sources/, evaluations/, and runs/.",
      "Choose model/search/storage access you control. A local passage matcher and recorded model-output fixtures are an acceptable fallback. Keep credentials outside the repository.",
      "One shared 60-minute implementation-review session within 30 days is included for this two-day lab; private consulting and done-for-you implementation are separate.",
      "Before the session, run every failure fixture from the attendee guide and keep both failed and recovered evidence. Open this answer-key module only in the facilitator context; do not include it in attendee props, downloads, or client-side imports."
    ],
    "runOfShow": [
      {
        "title": "Day 1 — Write the question contract",
        "minutes": 65,
        "notes": "Proposed allocation: 10 minutes demonstrate, 42 minutes build, 13 minutes inspect evidence. Demonstrate with the synthetic fixture before learners substitute approved data. Checkpoint: The brief limits answers to depot procedure; no account approvals or fabricated exceptions. Debrief: A general “answer any company question” brief cannot be evaluated. Use local/sample adapters when access is blocked and record which live integration remains unverified. Save the artifact before moving on."
      },
      {
        "title": "Day 1 — Prepare the versioned corpus",
        "minutes": 90,
        "notes": "Proposed allocation: 14 minutes demonstrate, 58 minutes build, 18 minutes inspect evidence. Demonstrate with the synthetic fixture before learners substitute approved data. Checkpoint: Four versioned records; yard-check v1 is archived and v2 active. Debrief: Dropping role metadata during chunking defeats the next lab. Use local/sample adapters when access is blocked and record which live integration remains unverified. Save the artifact before moving on."
      },
      {
        "title": "Day 1 — Inspect retrieval before generation",
        "minutes": 105,
        "notes": "Proposed allocation: 15 minutes demonstrate, 70 minutes build, 20 minutes inspect evidence. Demonstrate with the synthetic fixture before learners substitute approved data. Checkpoint: Release retrieval supplies active yard-check v2 and pickup retrieval supplies pickup v1. Debrief: A plausible answer from model memory is a failed grounding check. Use local/sample adapters when access is blocked and record which live integration remains unverified. Save the artifact before moving on."
      },
      {
        "title": "Day 1 — Prove role boundaries",
        "minutes": 100,
        "notes": "Proposed allocation: 15 minutes demonstrate, 65 minutes build, 20 minutes inspect evidence. Demonstrate with the synthetic fixture before learners substitute approved data. Checkpoint: Manager can use exceptions v1; coordinator cannot retrieve or quote it. Debrief: Filtering only the rendered answer leaves restricted evidence exposed. Use local/sample adapters when access is blocked and record which live integration remains unverified. Save the artifact before moving on."
      },
      {
        "title": "Day 2 — Score the evaluation set",
        "minutes": 95,
        "notes": "Proposed allocation: 14 minutes demonstrate, 62 minutes build, 19 minutes inspect evidence. Demonstrate with the synthetic fixture before learners substitute approved data. Checkpoint: Normal cases are grounded; ambiguous input clarifies; absent policy declines; denied source stays denied. Debrief: One aggregate score can hide a permission failure. Use local/sample adapters when access is blocked and record which live integration remains unverified. Save the artifact before moving on."
      },
      {
        "title": "Day 2 — Refresh a changed procedure",
        "minutes": 105,
        "notes": "Proposed allocation: 15 minutes demonstrate, 70 minutes build, 20 minutes inspect evidence. Demonstrate with the synthetic fixture before learners substitute approved data. Checkpoint: Successful staged v3 answers add lights and cite v3 only after approval. Debrief: Replacing the live index before validation destroys the rollback path. Use local/sample adapters when access is blocked and record which live integration remains unverified. Save the artifact before moving on."
      },
      {
        "title": "Day 2 — Add operating limits",
        "minutes": 80,
        "notes": "Proposed allocation: 12 minutes demonstrate, 52 minutes build, 16 minutes inspect evidence. Demonstrate with the synthetic fixture before learners substitute approved data. Checkpoint: Limits are stated and enforced; local fallback never fabricates measured costs. Debrief: Logging all retrieved text without role-aware access creates a second knowledge leak. Use local/sample adapters when access is blocked and record which live integration remains unverified. Save the artifact before moving on."
      },
      {
        "title": "Day 2 — Run the handoff demonstration",
        "minutes": 80,
        "notes": "Proposed allocation: 12 minutes demonstrate, 52 minutes build, 16 minutes inspect evidence. Demonstrate with the synthetic fixture before learners substitute approved data. Checkpoint: Packet includes source-linked allowed answer, deny-path evidence, and refresh/rollback evidence. Debrief: A demo screenshot without versioned files and test inputs cannot be reproduced. Use local/sample adapters when access is blocked and record which live integration remains unverified. Save the artifact before moving on."
      }
    ],
    "answerKeys": [
      {
        "exercise": "Write the question contract",
        "expected": [
          "The brief limits answers to depot procedure; no account approvals or fabricated exceptions.",
          "The ten cases include all four categories and named review ownership."
        ],
        "watchFor": [
          "A general “answer any company question” brief cannot be evaluated."
        ]
      },
      {
        "exercise": "Prepare the versioned corpus",
        "expected": [
          "Four versioned records; yard-check v1 is archived and v2 active.",
          "Owner, effective date, roles, and source sections remain attached after chunking."
        ],
        "watchFor": [
          "Dropping role metadata during chunking defeats the next lab."
        ]
      },
      {
        "exercise": "Inspect retrieval before generation",
        "expected": [
          "Release retrieval supplies active yard-check v2 and pickup retrieval supplies pickup v1.",
          "Removing the evidence produces unknown/escalation rather than a remembered policy."
        ],
        "watchFor": [
          "A plausible answer from model memory is a failed grounding check."
        ]
      },
      {
        "exercise": "Prove role boundaries",
        "expected": [
          "Manager can use exceptions v1; coordinator cannot retrieve or quote it.",
          "Role-filtered retrieval, citation resolution, and cache scope agree."
        ],
        "watchFor": [
          "Filtering only the rendered answer leaves restricted evidence exposed."
        ]
      },
      {
        "exercise": "Score the evaluation set",
        "expected": [
          "Normal cases are grounded; ambiguous input clarifies; absent policy declines; denied source stays denied.",
          "The repair does not regress a previously passing access case."
        ],
        "watchFor": [
          "One aggregate score can hide a permission failure."
        ]
      },
      {
        "exercise": "Refresh a changed procedure",
        "expected": [
          "Successful staged v3 answers add lights and cite v3 only after approval.",
          "Failed ingestion retains v2 with a visible pending/failed refresh marker."
        ],
        "watchFor": [
          "Replacing the live index before validation destroys the rollback path."
        ]
      },
      {
        "exercise": "Add operating limits",
        "expected": [
          "Limits are stated and enforced; local fallback never fabricates measured costs.",
          "Logs preserve evidence needed for review without leaking secrets or denied text."
        ],
        "watchFor": [
          "Logging all retrieved text without role-aware access creates a second knowledge leak."
        ]
      },
      {
        "exercise": "Run the handoff demonstration",
        "expected": [
          "Packet includes source-linked allowed answer, deny-path evidence, and refresh/rollback evidence.",
          "Full company rollout and production certification remain outside the lab."
        ],
        "watchFor": [
          "A demo screenshot without versioned files and test inputs cannot be reproduced."
        ]
      }
    ],
    "adaptations": [
      "Pair learners for input design and independent review; the reviewer should inspect evidence rather than trust the builder’s summary.",
      "If time is short, keep the failure exercise and handoff. Reduce live integration work and document it in the backlog.",
      "For an experienced group, add one unseen fixture after the initial regression run. Keep permissions and task size bounded.",
      "Human approval controls external sending, consequential actions, merge, and production release. A workshop prototype is not production certification."
    ]
  },
  "ai-prototype-to-production": {
    "preparation": [
      "Read the current published scope and verify the prepared blueprint in the same environment learners will use. Pin tested dependencies before the cohort; do not improvise provider API syntax from slides.",
      "Prepare a local/sample route for every external dependency. Account plans, administrative access, subscriptions, API usage, and hosting are separate from admission.",
      "Keep this module and its answer keys available only to facilitators. Distribute the attendee module independently.",
      "Bring a small prototype you can edit safely or use the instrumented starter; keep live customer data out of the fixture pack.",
      "Create evaluations/, traces/, and release/. Use mock tools for refund/send actions throughout the lab.",
      "One shared 60-minute implementation-review session within 30 days is included for this two-day lab; private consulting and done-for-you implementation are separate.",
      "Before the session, run every failure fixture from the attendee guide and keep both failed and recovered evidence. Open this answer-key module only in the facilitator context; do not include it in attendee props, downloads, or client-side imports."
    ],
    "runOfShow": [
      {
        "title": "Day 1 — Freeze a baseline contract",
        "minutes": 65,
        "notes": "Proposed allocation: 10 minutes demonstrate, 42 minutes build, 13 minutes inspect evidence. Demonstrate with the synthetic fixture before learners substitute approved data. Checkpoint: The contract permits a reviewed draft, never an automatic promise or payment. Debrief: Treating eligibility as approval changes the policy. Use local/sample adapters when access is blocked and record which live integration remains unverified. Save the artifact before moving on."
      },
      {
        "title": "Day 1 — Build eight regression cases",
        "minutes": 95,
        "notes": "Proposed allocation: 14 minutes demonstrate, 62 minutes build, 19 minutes inspect evidence. Demonstrate with the synthetic fixture before learners substitute approved data. Checkpoint: Eight categories are represented; schema/actions/citations have deterministic checks. Debrief: A model that grades its own answer without external criteria can hide failures. Use local/sample adapters when access is blocked and record which live integration remains unverified. Save the artifact before moving on."
      },
      {
        "title": "Day 1 — Instrument and redact traces",
        "minutes": 105,
        "notes": "Proposed allocation: 15 minutes demonstrate, 70 minutes build, 20 minutes inspect evidence. Demonstrate with the synthetic fixture before learners substitute approved data. Checkpoint: No mock secret or contact is exported; run/case identifiers remain useful. Debrief: Removing all inputs may make the trace private but impossible to diagnose. Use local/sample adapters when access is blocked and record which live integration remains unverified. Save the artifact before moving on."
      },
      {
        "title": "Day 1 — Repair one failure and compare",
        "minutes": 95,
        "notes": "Proposed allocation: 14 minutes demonstrate, 62 minutes build, 19 minutes inspect evidence. Demonstrate with the synthetic fixture before learners substitute approved data. Checkpoint: Same fixture versions support the comparison and any regression is visible. Debrief: Changing fixtures and prompts together prevents a meaningful baseline comparison. Use local/sample adapters when access is blocked and record which live integration remains unverified. Save the artifact before moving on."
      },
      {
        "title": "Day 2 — Implement a real approval gate",
        "minutes": 110,
        "notes": "Proposed allocation: 15 minutes demonstrate, 75 minutes build, 20 minutes inspect evidence. Demonstrate with the synthetic fixture before learners substitute approved data. Checkpoint: Gate blocks pre-approval and stale-payload execution; reject produces no execution. Debrief: A prompt-only “ask first” rule is not an application gate. Use local/sample adapters when access is blocked and record which live integration remains unverified. Save the artifact before moving on."
      },
      {
        "title": "Day 2 — Exercise recovery and duplicates",
        "minutes": 105,
        "notes": "Proposed allocation: 15 minutes demonstrate, 70 minutes build, 20 minutes inspect evidence. Demonstrate with the synthetic fixture before learners substitute approved data. Checkpoint: Permanent invalid input stops; transient retry remains bounded. Debrief: Timeout does not prove the external effect never happened. Use local/sample adapters when access is blocked and record which live integration remains unverified. Save the artifact before moving on."
      },
      {
        "title": "Day 2 — Measure latency and usage",
        "minutes": 85,
        "notes": "Proposed allocation: 13 minutes demonstrate, 55 minutes build, 17 minutes inspect evidence. Demonstrate with the synthetic fixture before learners substitute approved data. Checkpoint: Report is explicit about small sample and unmeasured fallback costs. Debrief: A fixed made-up price per run is not a cost measurement. Use local/sample adapters when access is blocked and record which live integration remains unverified. Save the artifact before moving on."
      },
      {
        "title": "Day 2 — Rehearse rollback and incident response",
        "minutes": 80,
        "notes": "Proposed allocation: 12 minutes demonstrate, 52 minutes build, 16 minutes inspect evidence. Demonstrate with the synthetic fixture before learners substitute approved data. Checkpoint: Playbook preserves evidence and reconciles actions before resuming intake. Debrief: Rolling back code alone does not undo a duplicate action. Use local/sample adapters when access is blocked and record which live integration remains unverified. Save the artifact before moving on."
      }
    ],
    "answerKeys": [
      {
        "exercise": "Freeze a baseline contract",
        "expected": [
          "The contract permits a reviewed draft, never an automatic promise or payment.",
          "Baseline observations remain saved before changes."
        ],
        "watchFor": [
          "Treating eligibility as approval changes the policy."
        ]
      },
      {
        "exercise": "Build eight regression cases",
        "expected": [
          "Eight categories are represented; schema/actions/citations have deterministic checks.",
          "Judgment rubric separates grounded policy from invented refund promises."
        ],
        "watchFor": [
          "A model that grades its own answer without external criteria can hide failures."
        ]
      },
      {
        "exercise": "Instrument and redact traces",
        "expected": [
          "No mock secret or contact is exported; run/case identifiers remain useful.",
          "The first failing step is distinguished from later symptoms."
        ],
        "watchFor": [
          "Removing all inputs may make the trace private but impossible to diagnose."
        ]
      },
      {
        "exercise": "Repair one failure and compare",
        "expected": [
          "Same fixture versions support the comparison and any regression is visible.",
          "Disputed grounding judgments are reviewed against policy, not accepted automatically."
        ],
        "watchFor": [
          "Changing fixtures and prompts together prevents a meaningful baseline comparison."
        ]
      },
      {
        "exercise": "Implement a real approval gate",
        "expected": [
          "Gate blocks pre-approval and stale-payload execution; reject produces no execution.",
          "Approval record binds request, action, amount, and policy version."
        ],
        "watchFor": [
          "A prompt-only “ask first” rule is not an application gate."
        ]
      },
      {
        "exercise": "Exercise recovery and duplicates",
        "expected": [
          "Permanent invalid input stops; transient retry remains bounded.",
          "Duplicate request and lost-response recovery produce at most one mock action."
        ],
        "watchFor": [
          "Timeout does not prove the external effect never happened."
        ]
      },
      {
        "exercise": "Measure latency and usage",
        "expected": [
          "Report is explicit about small sample and unmeasured fallback costs.",
          "Budget stops excessive work and records the reason for operator review."
        ],
        "watchFor": [
          "A fixed made-up price per run is not a cost measurement."
        ]
      },
      {
        "exercise": "Rehearse rollback and incident response",
        "expected": [
          "Playbook preserves evidence and reconciles actions before resuming intake.",
          "Release decision states failures, pilot scope, reviewer, and rollback version."
        ],
        "watchFor": [
          "Rolling back code alone does not undo a duplicate action."
        ]
      }
    ],
    "adaptations": [
      "Pair learners for input design and independent review; the reviewer should inspect evidence rather than trust the builder’s summary.",
      "If time is short, keep the failure exercise and handoff. Reduce live integration work and document it in the backlog.",
      "For an experienced group, add one unseen fixture after the initial regression run. Keep permissions and task size bounded.",
      "Human approval controls external sending, consequential actions, merge, and production release. A workshop prototype is not production certification."
    ]
  },
  "ai-client-delivery-system": {
    "preparation": [
      "Read the current published scope and verify the prepared blueprint in the same environment learners will use. Pin tested dependencies before the cohort; do not improvise provider API syntax from slides.",
      "Prepare a local/sample route for every external dependency. Account plans, administrative access, subscriptions, API usage, and hosting are separate from admission.",
      "Keep this module and its answer keys available only to facilitators. Distribute the attendee module independently.",
      "Bring a preferred AI assistant, approved anonymized service brief, acceptance criteria, and target deliverable format, or use the sample service.",
      "Create intake/, scope/, tasks/, drafts/, review/, and handoff/; use local tables if a project-management connection is unavailable.",
      "One shared 60-minute implementation-review session within 30 days is included for this two-day lab; private consulting and done-for-you implementation are separate.",
      "Before the session, run every failure fixture from the attendee guide and keep both failed and recovered evidence. Open this answer-key module only in the facilitator context; do not include it in attendee props, downloads, or client-side imports."
    ],
    "runOfShow": [
      {
        "title": "Day 1 — Map the service and intake",
        "minutes": 65,
        "notes": "Proposed allocation: 10 minutes demonstrate, 42 minutes build, 13 minutes inspect evidence. Demonstrate with the synthetic fixture before learners substitute approved data. Checkpoint: Intake records five pages and form CTA, with missing due-date detail and approver unresolved. Debrief: A relative “Friday” without date/timezone is not an agreed deadline. Use local/sample adapters when access is blocked and record which live integration remains unverified. Save the artifact before moving on."
      },
      {
        "title": "Day 1 — Approve a bounded scope",
        "minutes": 100,
        "notes": "Proposed allocation: 15 minutes demonstrate, 65 minutes build, 20 minutes inspect evidence. Demonstrate with the synthetic fixture before learners substitute approved data. Checkpoint: Scope remains copy-only and no invented deadline is committed. Debrief: Calling a role-play record client approval misrepresents the exercise. Use local/sample adapters when access is blocked and record which live integration remains unverified. Save the artifact before moving on."
      },
      {
        "title": "Day 1 — Plan dependencies and owners",
        "minutes": 105,
        "notes": "Proposed allocation: 15 minutes demonstrate, 70 minutes build, 20 minutes inspect evidence. Demonstrate with the synthetic fixture before learners substitute approved data. Checkpoint: Board separates fact gathering, drafting, review, and handoff. Debrief: An unordered checklist cannot explain a delivery blocker. Use local/sample adapters when access is blocked and record which live integration remains unverified. Save the artifact before moving on."
      },
      {
        "title": "Day 1 — Produce a source-backed page draft",
        "minutes": 90,
        "notes": "Proposed allocation: 14 minutes demonstrate, 58 minutes build, 18 minutes inspect evidence. Demonstrate with the synthetic fixture before learners substitute approved data. Checkpoint: Facts remain limited to F-1; CTA is a quote request. Debrief: Polishing unsupported claims is not a review pass. Use local/sample adapters when access is blocked and record which live integration remains unverified. Save the artifact before moving on."
      },
      {
        "title": "Day 2 — Apply the quality gate",
        "minutes": 100,
        "notes": "Proposed allocation: 15 minutes demonstrate, 65 minutes build, 20 minutes inspect evidence. Demonstrate with the synthetic fixture before learners substitute approved data. Checkpoint: Both guarantee and certification fail the evidence check. Debrief: A reusable checklist is useful only when its result refers to the actual file version. Use local/sample adapters when access is blocked and record which live integration remains unverified. Save the artifact before moving on."
      },
      {
        "title": "Day 2 — Draft a truthful client update",
        "minutes": 95,
        "notes": "Proposed allocation: 14 minutes demonstrate, 62 minutes build, 19 minutes inspect evidence. Demonstrate with the synthetic fixture before learners substitute approved data. Checkpoint: Update distinguishes Home passed QA from Contact awaiting QA. Debrief: “On track” without a verified date or blocked-work context is unsupported. Use local/sample adapters when access is blocked and record which live integration remains unverified. Save the artifact before moving on."
      },
      {
        "title": "Day 2 — Test a changed requirement",
        "minutes": 105,
        "notes": "Proposed allocation: 15 minutes demonstrate, 70 minutes build, 20 minutes inspect evidence. Demonstrate with the synthetic fixture before learners substitute approved data. Checkpoint: Pricing calculator and publishing are recognized as outside copy-only S-1. Debrief: Inventing price or timeline to make the update sound complete creates an unapproved commitment. Use local/sample adapters when access is blocked and record which live integration remains unverified. Save the artifact before moving on."
      },
      {
        "title": "Day 2 — Hand over the delivery packet",
        "minutes": 80,
        "notes": "Proposed allocation: 12 minutes demonstrate, 52 minutes build, 16 minutes inspect evidence. Demonstrate with the synthetic fixture before learners substitute approved data. Checkpoint: Manifest makes draft/QA/client-accepted states distinct and includes open input needs. Debrief: A ZIP of files without acceptance state does not complete the delivery system. Use local/sample adapters when access is blocked and record which live integration remains unverified. Save the artifact before moving on."
      }
    ],
    "answerKeys": [
      {
        "exercise": "Map the service and intake",
        "expected": [
          "Intake records five pages and form CTA, with missing due-date detail and approver unresolved.",
          "No unsupported certification or guaranteed availability is introduced."
        ],
        "watchFor": [
          "A relative “Friday” without date/timezone is not an agreed deadline."
        ]
      },
      {
        "exercise": "Approve a bounded scope",
        "expected": [
          "Scope remains copy-only and no invented deadline is committed.",
          "Review state, exclusions, acceptance, and change path are explicit."
        ],
        "watchFor": [
          "Calling a role-play record client approval misrepresents the exercise."
        ]
      },
      {
        "exercise": "Plan dependencies and owners",
        "expected": [
          "Board separates fact gathering, drafting, review, and handoff.",
          "Blocking dependencies and scope version are visible in task records."
        ],
        "watchFor": [
          "An unordered checklist cannot explain a delivery blocker."
        ]
      },
      {
        "exercise": "Produce a source-backed page draft",
        "expected": [
          "Facts remain limited to F-1; CTA is a quote request.",
          "No fabricated proof is presented as finished copy."
        ],
        "watchFor": [
          "Polishing unsupported claims is not a review pass."
        ]
      },
      {
        "exercise": "Apply the quality gate",
        "expected": [
          "Both guarantee and certification fail the evidence check.",
          "QA record references the reviewed artifact version and repair evidence."
        ],
        "watchFor": [
          "A reusable checklist is useful only when its result refers to the actual file version."
        ]
      },
      {
        "exercise": "Draft a truthful client update",
        "expected": [
          "Update distinguishes Home passed QA from Contact awaiting QA.",
          "Safety blocker and needed approved procedure are explicit; no automatic send occurs."
        ],
        "watchFor": [
          "“On track” without a verified date or blocked-work context is unsupported."
        ]
      },
      {
        "exercise": "Test a changed requirement",
        "expected": [
          "Pricing calculator and publishing are recognized as outside copy-only S-1.",
          "Rejected path preserves S-1; approved simulation creates reviewed new scope/dependencies."
        ],
        "watchFor": [
          "Inventing price or timeline to make the update sound complete creates an unapproved commitment."
        ]
      },
      {
        "exercise": "Hand over the delivery packet",
        "expected": [
          "Manifest makes draft/QA/client-accepted states distinct and includes open input needs.",
          "Skill preserves scope/change and external-message review gates."
        ],
        "watchFor": [
          "A ZIP of files without acceptance state does not complete the delivery system."
        ]
      }
    ],
    "adaptations": [
      "Pair learners for input design and independent review; the reviewer should inspect evidence rather than trust the builder’s summary.",
      "If time is short, keep the failure exercise and handoff. Reduce live integration work and document it in the backlog.",
      "For an experienced group, add one unseen fixture after the initial regression run. Keep permissions and task size bounded.",
      "Human approval controls external sending, consequential actions, merge, and production release. A workshop prototype is not production certification."
    ]
  },
  "ai-business-intelligence-team": {
    "preparation": [
      "Read the current published scope and verify the prepared blueprint in the same environment learners will use. Pin tested dependencies before the cohort; do not improvise provider API syntax from slides.",
      "Prepare a local/sample route for every external dependency. Account plans, administrative access, subscriptions, API usage, and hosting are separate from admission.",
      "Keep this module and its answer keys available only to facilitators. Distribute the attendee module independently.",
      "Bring an anonymized spreadsheet and preferred AI assistant or use the inline CSV. A spreadsheet and local files are enough; live BI connectors are optional.",
      "Create raw/, cleaned/, metrics/, dashboard/, and reports/. Use read-only source access, keep credentials out of files, and agree who can see raw customer-level records.",
      "One shared 60-minute implementation-review session within 30 days is included for this two-day lab; private consulting and done-for-you implementation are separate.",
      "Before the session, run every failure fixture from the attendee guide and keep both failed and recovered evidence. Open this answer-key module only in the facilitator context; do not include it in attendee props, downloads, or client-side imports."
    ],
    "runOfShow": [
      {
        "title": "Day 1 — Write decisions and metric definitions",
        "minutes": 65,
        "notes": "Proposed allocation: 10 minutes demonstrate, 42 minutes build, 13 minutes inspect evidence. Demonstrate with the synthetic fixture before learners substitute approved data. Checkpoint: Four metrics specify order grain, UTC window, units, and owner. Debrief: “Revenue” without date basis or refund policy is not a defined metric. Use local/sample adapters when access is blocked and record which live integration remains unverified. Save the artifact before moving on."
      },
      {
        "title": "Day 1 — Audit the raw fixtures",
        "minutes": 100,
        "notes": "Proposed allocation: 15 minutes demonstrate, 65 minutes build, 20 minutes inspect evidence. Demonstrate with the synthetic fixture before learners substitute approved data. Checkpoint: Exact duplicate O2 and branch B are flagged. O5/O6 require owner review and are not silently filled. Debrief: Replacing a missing gross with zero changes revenue without evidence. Use local/sample adapters when access is blocked and record which live integration remains unverified. Save the artifact before moving on."
      },
      {
        "title": "Day 1 — Clean and prove the join",
        "minutes": 110,
        "notes": "Proposed allocation: 15 minutes demonstrate, 75 minutes build, 20 minutes inspect evidence. Demonstrate with the synthetic fixture before learners substitute approved data. Checkpoint: Clean model retains O1–O4, with O5/O6 quarantined and duplicate O2 collapsed. Debrief: DISTINCT on a final aggregate can conceal an invalid model instead of fixing it. Use local/sample adapters when access is blocked and record which live integration remains unverified. Save the artifact before moving on."
      },
      {
        "title": "Day 1 — Build and check the dashboard",
        "minutes": 105,
        "notes": "Proposed allocation: 15 minutes demonstrate, 70 minutes build, 20 minutes inspect evidence. Demonstrate with the synthetic fixture before learners substitute approved data. Checkpoint: Net revenue is A=250, B=80, total=330; cleaned order counts are A=2, B=2. Debrief: A visually striking percentage must not imply a reliable trend from two orders. Use local/sample adapters when access is blocked and record which live integration remains unverified. Save the artifact before moving on."
      },
      {
        "title": "Day 2 — Draft a decision brief",
        "minutes": 90,
        "notes": "Proposed allocation: 14 minutes demonstrate, 58 minutes build, 18 minutes inspect evidence. Demonstrate with the synthetic fixture before learners substitute approved data. Checkpoint: Brief reports counts and net revenue with M-1 references and quality caveat. Debrief: An assistant can turn a sparse chart into an unsupported business diagnosis. Use local/sample adapters when access is blocked and record which live integration remains unverified. Save the artifact before moving on."
      },
      {
        "title": "Day 2 — Rehearse recurring reporting",
        "minutes": 100,
        "notes": "Proposed allocation: 15 minutes demonstrate, 65 minutes build, 20 minutes inspect evidence. Demonstrate with the synthetic fixture before learners substitute approved data. Checkpoint: Stale snapshot fails the contract and does not become a fresh-looking current report. Debrief: Job execution time and data freshness are different fields. Use local/sample adapters when access is blocked and record which live integration remains unverified. Save the artifact before moving on."
      },
      {
        "title": "Day 2 — Test a changed definition",
        "minutes": 105,
        "notes": "Proposed allocation: 15 minutes demonstrate, 70 minutes build, 20 minutes inspect evidence. Demonstrate with the synthetic fixture before learners substitute approved data. Checkpoint: Missing collection_date blocks M-2; M-1 remains clearly versioned. Debrief: Changing a definition without changing its label makes past/future comparisons misleading. Use local/sample adapters when access is blocked and record which live integration remains unverified. Save the artifact before moving on."
      },
      {
        "title": "Day 2 — Inspect the reporting handoff",
        "minutes": 75,
        "notes": "Proposed allocation: 11 minutes demonstrate, 49 minutes build, 15 minutes inspect evidence. Demonstrate with the synthetic fixture before learners substitute approved data. Checkpoint: Packet supports recomputation of 330 USD and explains quarantines without invented money. Debrief: Only sharing the dashboard loses the model and its quality decisions. Use local/sample adapters when access is blocked and record which live integration remains unverified. Save the artifact before moving on."
      }
    ],
    "answerKeys": [
      {
        "exercise": "Write decisions and metric definitions",
        "expected": [
          "Four metrics specify order grain, UTC window, units, and owner.",
          "Net revenue excludes canceled rows and subtracts recorded refunds from paid gross."
        ],
        "watchFor": [
          "“Revenue” without date basis or refund policy is not a defined metric."
        ]
      },
      {
        "exercise": "Audit the raw fixtures",
        "expected": [
          "Exact duplicate O2 and branch B are flagged. O5/O6 require owner review and are not silently filled.",
          "Raw data remains intact and cleanup disposition is traceable."
        ],
        "watchFor": [
          "Replacing a missing gross with zero changes revenue without evidence."
        ]
      },
      {
        "exercise": "Clean and prove the join",
        "expected": [
          "Clean model retains O1–O4, with O5/O6 quarantined and duplicate O2 collapsed.",
          "Dimension uniqueness prevents multiplied rows; bad join evidence is retained."
        ],
        "watchFor": [
          "DISTINCT on a final aggregate can conceal an invalid model instead of fixing it."
        ]
      },
      {
        "exercise": "Build and check the dashboard",
        "expected": [
          "Net revenue is A=250, B=80, total=330; cleaned order counts are A=2, B=2.",
          "Cancellation counts are A=0, B=1 with explicit small denominators and quarantine warning."
        ],
        "watchFor": [
          "A visually striking percentage must not imply a reliable trend from two orders."
        ]
      },
      {
        "exercise": "Draft a decision brief",
        "expected": [
          "Brief reports counts and net revenue with M-1 references and quality caveat.",
          "Any cause is labelled hypothetical and paired with an investigation step."
        ],
        "watchFor": [
          "An assistant can turn a sparse chart into an unsupported business diagnosis."
        ]
      },
      {
        "exercise": "Rehearse recurring reporting",
        "expected": [
          "Stale snapshot fails the contract and does not become a fresh-looking current report.",
          "Owner and reviewed failure destination exist even on the manual sample route."
        ],
        "watchFor": [
          "Job execution time and data freshness are different fields."
        ]
      },
      {
        "exercise": "Test a changed definition",
        "expected": [
          "Missing collection_date blocks M-2; M-1 remains clearly versioned.",
          "Historical comparisons require an approved bridge or explicit break in series."
        ],
        "watchFor": [
          "Changing a definition without changing its label makes past/future comparisons misleading."
        ]
      },
      {
        "exercise": "Inspect the reporting handoff",
        "expected": [
          "Packet supports recomputation of 330 USD and explains quarantines without invented money.",
          "Access/cost/freshness and change ownership are explicit."
        ],
        "watchFor": [
          "Only sharing the dashboard loses the model and its quality decisions."
        ]
      }
    ],
    "adaptations": [
      "Pair learners for input design and independent review; the reviewer should inspect evidence rather than trust the builder’s summary.",
      "If time is short, keep the failure exercise and handoff. Reduce live integration work and document it in the backlog.",
      "For an experienced group, add one unseen fixture after the initial regression run. Keep permissions and task size bounded.",
      "Human approval controls external sending, consequential actions, merge, and production release. A workshop prototype is not production certification."
    ]
  },
  "build-your-ai-software-factory": {
    "preparation": [
      "Read the current published scope and verify the prepared blueprint in the same environment learners will use. Pin tested dependencies before the cohort; do not improvise provider API syntax from slides.",
      "Prepare a local/sample route for every external dependency. Account plans, administrative access, subscriptions, API usage, and hosting are separate from admission.",
      "Keep this module and its answer keys available only to facilitators. Distribute the attendee module independently.",
      "Bring GitHub, Linear, Vercel, and model API access you control, plus a safe small TypeScript repo or the starter. Be comfortable with Git, Node, tests, and PR review.",
      "During the included 30-minute private readiness review, scope one repository and permitted ticket type. Pin tested SDK/runtime versions before the lab.",
      "Use separate scoped credentials for ticket reading/status updates, repository draft-PR work, and execution; never paste raw credentials into tickets, prompts, or run evidence.",
      "A 30-minute private readiness review before the lab and two private implementation-review hours within 30 days afterward. We review one repository and your workflow evidence; this does not include done-for-you rollout or unlimited support.",
      "Before the session, run every failure fixture from the attendee guide and keep both failed and recovered evidence. Open this answer-key module only in the facilitator context; do not include it in attendee props, downloads, or client-side imports."
    ],
    "runOfShow": [
      {
        "title": "Day 1 — Prepare the repository",
        "minutes": 75,
        "notes": "Proposed allocation: 11 minutes demonstrate, 49 minutes build, 15 minutes inspect evidence. Demonstrate with the synthetic fixture before learners substitute approved data. Checkpoint: One repository and permitted ticket type with explicit excluded paths/actions. Debrief: A generic autonomous developer brief grants more scope than the ticket needs. Use local/sample adapters when access is blocked and record which live integration remains unverified. Save the artifact before moving on."
      },
      {
        "title": "Day 1 — Connect Linear and GitHub",
        "minutes": 95,
        "notes": "Proposed allocation: 14 minutes demonstrate, 62 minutes build, 19 minutes inspect evidence. Demonstrate with the synthetic fixture before learners substitute approved data. Checkpoint: SF-101 maps to equal/before rejection and later acceptance. Debrief: Using ticket prose as unchecked tool commands bypasses scope validation. Use local/sample adapters when access is blocked and record which live integration remains unverified. Save the artifact before moving on."
      },
      {
        "title": "Day 1 — Investigate in Vercel Sandbox",
        "minutes": 110,
        "notes": "Proposed allocation: 15 minutes demonstrate, 75 minutes build, 20 minutes inspect evidence. Demonstrate with the synthetic fixture before learners substitute approved data. Checkpoint: Equal-date reproduction fails the desired acceptance; code evidence identifies the comparison. Debrief: Failure to find a symbol is a reason to investigate, not invent a file. Use local/sample adapters when access is blocked and record which live integration remains unverified. Save the artifact before moving on."
      },
      {
        "title": "Day 1 — Implement a bounded change",
        "minutes": 110,
        "notes": "Proposed allocation: 15 minutes demonstrate, 75 minutes build, 20 minutes inspect evidence. Demonstrate with the synthetic fixture before learners substitute approved data. Checkpoint: Minimal change rejects equal/before and preserves later dates. Debrief: A wide refactor makes a narrow ticket harder to review and evaluate. Use local/sample adapters when access is blocked and record which live integration remains unverified. Save the artifact before moving on."
      },
      {
        "title": "Day 2 — Verify the actual change",
        "minutes": 110,
        "notes": "Proposed allocation: 15 minutes demonstrate, 75 minutes build, 20 minutes inspect evidence. Demonstrate with the synthetic fixture before learners substitute approved data. Checkpoint: Actual commands and candidate SHA/diff support verification. Debrief: Reading the implementation summary is not independent verification. Use local/sample adapters when access is blocked and record which live integration remains unverified. Save the artifact before moving on."
      },
      {
        "title": "Day 2 — Exercise failure paths",
        "minutes": 110,
        "notes": "Proposed allocation: 15 minutes demonstrate, 75 minutes build, 20 minutes inspect evidence. Demonstrate with the synthetic fixture before learners substitute approved data. Checkpoint: Supported/ambiguous/false-premise/build-failure/duplicate cases are distinct. Debrief: Workflow durability does not by itself define idempotent GitHub/Linear writes. Use local/sample adapters when access is blocked and record which live integration remains unverified. Save the artifact before moving on."
      },
      {
        "title": "Day 2 — Prepare the draft PR",
        "minutes": 95,
        "notes": "Proposed allocation: 14 minutes demonstrate, 62 minutes build, 19 minutes inspect evidence. Demonstrate with the synthetic fixture before learners substitute approved data. Checkpoint: PR explains equal/before/later behavior and links actual checks. Debrief: An unsubmitted local PR packet is useful evidence but is not a live GitHub PR. Use local/sample adapters when access is blocked and record which live integration remains unverified. Save the artifact before moving on."
      },
      {
        "title": "Day 2 — Review the factory and next rollout",
        "minutes": 75,
        "notes": "Proposed allocation: 11 minutes demonstrate, 49 minutes build, 15 minutes inspect evidence. Demonstrate with the synthetic fixture before learners substitute approved data. Checkpoint: Packet includes starter/adapters, role instructions, schema, regression pack, runbook, and cleanup evidence. Debrief: Destroying the workspace before saving evidence makes the run unreviewable. Use local/sample adapters when access is blocked and record which live integration remains unverified. Save the artifact before moving on."
      }
    ],
    "answerKeys": [
      {
        "exercise": "Prepare the repository boundary",
        "expected": [
          "One repository and permitted ticket type with explicit excluded paths/actions.",
          "Role instructions require real evidence and preserve release approval."
        ],
        "watchFor": [
          "A generic autonomous developer brief grants more scope than the ticket needs."
        ]
      },
      {
        "exercise": "Connect work-order intake",
        "expected": [
          "SF-101 maps to equal/before rejection and later acceptance.",
          "Ambiguous request lacks sufficient scope and does not trigger speculative edits."
        ],
        "watchFor": [
          "Using ticket prose as unchecked tool commands bypasses scope validation."
        ]
      },
      {
        "exercise": "Investigate in the isolated workspace",
        "expected": [
          "Equal-date reproduction fails the desired acceptance; code evidence identifies the comparison.",
          "False-premise ticket yields no imaginary field removal."
        ],
        "watchFor": [
          "Failure to find a symbol is a reason to investigate, not invent a file."
        ]
      },
      {
        "exercise": "Implement the bounded pipeline",
        "expected": [
          "Minimal change rejects equal/before and preserves later dates.",
          "Durable state carries run/base/candidate evidence across steps."
        ],
        "watchFor": [
          "A wide refactor makes a narrow ticket harder to review and evaluate."
        ]
      },
      {
        "exercise": "Verify the actual candidate",
        "expected": [
          "Actual commands and candidate SHA/diff support verification.",
          "Failed build blocks handoff with operator evidence."
        ],
        "watchFor": [
          "Reading the implementation summary is not independent verification."
        ]
      },
      {
        "exercise": "Exercise durable recovery and gates",
        "expected": [
          "Supported/ambiguous/false-premise/build-failure/duplicate cases are distinct.",
          "Approval pause and bounded recovery preserve identity without duplicate side effects."
        ],
        "watchFor": [
          "Workflow durability does not by itself define idempotent GitHub/Linear writes."
        ]
      },
      {
        "exercise": "Prepare the reviewed draft PR",
        "expected": [
          "PR explains equal/before/later behavior and links actual checks.",
          "Update is truthful about draft state, environment, and blockers; release remains human-controlled."
        ],
        "watchFor": [
          "An unsubmitted local PR packet is useful evidence but is not a live GitHub PR."
        ]
      },
      {
        "exercise": "Review operations and cleanup",
        "expected": [
          "Packet includes starter/adapters, role instructions, schema, regression pack, runbook, and cleanup evidence.",
          "Follow-up is the published two private review hours within 30 days, not unlimited implementation."
        ],
        "watchFor": [
          "Destroying the workspace before saving evidence makes the run unreviewable."
        ]
      }
    ],
    "adaptations": [
      "Pair learners for input design and independent review; the reviewer should inspect evidence rather than trust the builder’s summary.",
      "If time is short, keep the failure exercise and handoff. Reduce live integration work and document it in the backlog.",
      "For an experienced group, add one unseen fixture after the initial regression run. Keep permissions and task size bounded.",
      "Human approval controls external sending, consequential actions, merge, and production release. A workshop prototype is not production certification."
    ]
  },
  "build-your-first-agentic-workflow": {
    "preparation": [
      "Read the current published scope and verify the prepared blueprint in the same environment learners will use. Pin tested dependencies before the cohort; do not improvise provider API syntax from slides.",
      "Prepare a local/sample route for every external dependency. Account plans, administrative access, subscriptions, API usage, and hosting are separate from admission.",
      "Keep this module and its answer keys available only to facilitators. Distribute the attendee module independently.",
      "Bring a laptop, GitHub/Vercel access, and one supported model API or AI Gateway account. Light JavaScript/TypeScript and terminal familiarity are enough; use the prepared starter.",
      "Use the cohort’s pinned Nitro, AI SDK, and Workflow SDK versions. Nitro v3 native Workflow SDK integration was announced as beta; confirm the tested setup rather than assuming any version combination works.",
      "Create brief.md, fixtures/, runs/, and setup-checklist.md. Store environment keys locally/server-side and never commit them or send them to browser code.",
      "Use the saved setup checklist and backlog for continued practice; no extra follow-up entitlement is implied.",
      "Before the session, run every failure fixture from the attendee guide and keep both failed and recovered evidence. Open this answer-key module only in the facilitator context; do not include it in attendee props, downloads, or client-side imports."
    ],
    "runOfShow": [
      {
        "title": "Write the job brief",
        "minutes": 30,
        "notes": "Proposed allocation: 4 minutes demonstrate, 20 minutes build, 6 minutes inspect evidence. Demonstrate with the synthetic fixture before learners substitute approved data. Checkpoint: Brief is inquiry-to-reviewed-draft with one catalog lookup. Debrief: Expanding into a booking app introduces actions outside the one-day scope. Use local/sample adapters when access is blocked and record which live integration remains unverified. Save the artifact before moving on."
      },
      {
        "title": "Run and inspect the Nitro starter",
        "minutes": 45,
        "notes": "Proposed allocation: 7 minutes demonstrate, 29 minutes build, 9 minutes inspect evidence. Demonstrate with the synthetic fixture before learners substitute approved data. Checkpoint: Learner identifies the actual starter route/scripts and tested versions. Debrief: A successful install is not evidence that the request route works. Use local/sample adapters when access is blocked and record which live integration remains unverified. Save the artifact before moving on."
      },
      {
        "title": "Extract and validate the brief",
        "minutes": 45,
        "notes": "Proposed allocation: 7 minutes demonstrate, 29 minutes build, 9 minutes inspect evidence. Demonstrate with the synthetic fixture before learners substitute approved data. Checkpoint: Malformed object fails on ID, enum, and missing_details type. Debrief: Typing a TypeScript interface does not validate an untrusted runtime object. Use local/sample adapters when access is blocked and record which live integration remains unverified. Save the artifact before moving on."
      },
      {
        "title": "Connect the single catalog tool",
        "minutes": 50,
        "notes": "Proposed allocation: 8 minutes demonstrate, 32 minutes build, 10 minutes inspect evidence. Demonstrate with the synthetic fixture before learners substitute approved data. Checkpoint: Tool reads only the two catalog records and returns provenance/unknown explicitly. Debrief: Passing user text directly to a file path makes the tool less bounded than advertised. Use local/sample adapters when access is blocked and record which live integration remains unverified. Save the artifact before moving on."
      },
      {
        "title": "Add durable steps and inspect a pause",
        "minutes": 55,
        "notes": "Proposed allocation: 8 minutes demonstrate, 36 minutes build, 11 minutes inspect evidence. Demonstrate with the synthetic fixture before learners substitute approved data. Checkpoint: Run history shows the resume point and preserves request identity. Debrief: Durable execution is not proven by a hand-written diagram alone; label simulated evidence. Use local/sample adapters when access is blocked and record which live integration remains unverified. Save the artifact before moving on."
      },
      {
        "title": "Run the whole failure set",
        "minutes": 50,
        "notes": "Proposed allocation: 8 minutes demonstrate, 32 minutes build, 10 minutes inspect evidence. Demonstrate with the synthetic fixture before learners substitute approved data. Checkpoint: Empty input needs correction; failed tool stops/retries within limit without fabricating facts. Debrief: A 200 response does not mean the asynchronous workflow produced a valid result. Use local/sample adapters when access is blocked and record which live integration remains unverified. Save the artifact before moving on."
      },
      {
        "title": "Prepare and inspect a preview",
        "minutes": 45,
        "notes": "Proposed allocation: 7 minutes demonstrate, 29 minutes build, 9 minutes inspect evidence. Demonstrate with the synthetic fixture before learners substitute approved data. Checkpoint: Live preview is claimed only if it is inspected; blocked path remains clearly local. Debrief: A successful deploy status is not a functional workflow test. Use local/sample adapters when access is blocked and record which live integration remains unverified. Save the artifact before moving on."
      },
      {
        "title": "Package the reusable blueprint",
        "minutes": 30,
        "notes": "Proposed allocation: 4 minutes demonstrate, 20 minutes build, 6 minutes inspect evidence. Demonstrate with the synthetic fixture before learners substitute approved data. Checkpoint: Packet ties Nitro route, AI SDK extraction/tool, Workflow run evidence, and preview/local checklist together. Debrief: A chat transcript without starter files and commands is not a reusable blueprint. Use local/sample adapters when access is blocked and record which live integration remains unverified. Save the artifact before moving on."
      }
    ],
    "answerKeys": [
      {
        "exercise": "Write the job brief",
        "expected": [
          "Brief is inquiry-to-reviewed-draft with one catalog lookup.",
          "No booking, live sending, price, stock, or safety promise is authorized."
        ],
        "watchFor": [
          "Expanding into a booking app introduces actions outside the one-day scope."
        ]
      },
      {
        "exercise": "Run and inspect the Nitro starter",
        "expected": [
          "Learner identifies the actual starter route/scripts and tested versions.",
          "Server-side keys are not committed or returned to the client."
        ],
        "watchFor": [
          "A successful install is not evidence that the request route works."
        ]
      },
      {
        "exercise": "Extract and validate the brief",
        "expected": [
          "Malformed object fails on ID, enum, and missing_details type.",
          "Tool invocation is gated by validated structured output."
        ],
        "watchFor": [
          "Typing a TypeScript interface does not validate an untrusted runtime object."
        ]
      },
      {
        "exercise": "Connect the single catalog tool",
        "expected": [
          "Tool reads only the two catalog records and returns provenance/unknown explicitly.",
          "Draft requests source-specified details without invented commercial promises."
        ],
        "watchFor": [
          "Passing user text directly to a file path makes the tool less bounded than advertised."
        ]
      },
      {
        "exercise": "Add durable steps and inspect a pause",
        "expected": [
          "Run history shows the resume point and preserves request identity.",
          "Review boundary remains explicit and repeated result persistence is controlled."
        ],
        "watchFor": [
          "Durable execution is not proven by a hand-written diagram alone; label simulated evidence."
        ]
      },
      {
        "exercise": "Run the whole failure set",
        "expected": [
          "Empty input needs correction; failed tool stops/retries within limit without fabricating facts.",
          "Repeated request and lost-response case reuse identity and avoid duplicate queue output."
        ],
        "watchFor": [
          "A 200 response does not mean the asynchronous workflow produced a valid result."
        ]
      },
      {
        "exercise": "Prepare and inspect a preview",
        "expected": [
          "Live preview is claimed only if it is inspected; blocked path remains clearly local.",
          "Settings, tests, usage caveat, and human production-release approval are explicit."
        ],
        "watchFor": [
          "A successful deploy status is not a functional workflow test."
        ]
      },
      {
        "exercise": "Package the reusable blueprint",
        "expected": [
          "Packet ties Nitro route, AI SDK extraction/tool, Workflow run evidence, and preview/local checklist together.",
          "Next work is bounded and the draft/release review boundary remains intact."
        ],
        "watchFor": [
          "A chat transcript without starter files and commands is not a reusable blueprint."
        ]
      }
    ],
    "adaptations": [
      "Pair learners for input design and independent review; the reviewer should inspect evidence rather than trust the builder’s summary.",
      "If time is short, keep the failure exercise and handoff. Reduce live integration work and document it in the backlog.",
      "For an experienced group, add one unseen fixture after the initial regression run. Keep permissions and task size bounded.",
      "Human approval controls external sending, consequential actions, merge, and production release. A workshop prototype is not production certification."
    ]
  }
};
