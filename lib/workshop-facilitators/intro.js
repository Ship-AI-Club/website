// Workshop-specific training data. Fictional sample inputs are labeled in each guide.
export const FACILITATOR_GUIDES = {
  "your-first-agent": {
    "preparation": [
      "Prepare the policy and five sample messages as local text.",
      "Confirm the assistant is available before class; teach the paste-in path first.",
      "Do not perform live inbox access or sending in this review pack.",
      "Keep sample account records absent so M5 tests unsupported access."
    ],
    "runOfShow": [
      {
        "title": "Orient and inspect the sample",
        "minutes": 10,
        "notes": "Show the supplied fictional inputs. Confirm the sample path runs before anyone attempts account setup."
      },
      {
        "title": "Write the job and tool checklist",
        "minutes": 20,
        "notes": "Teaching cue: Brief names drafts only, source policy, and reviewer. Ask: which input or artifact proves this? Watch for: Learners equating a tool account with connected email access. Have pairs inspect the saved work before advancing."
      },
      {
        "title": "Extract a thread into a record",
        "minutes": 25,
        "notes": "Teaching cue: M3 confirms another bulb was tried; photo remains missing; Wednesday remains a request. Ask: which input or artifact proves this? Watch for: Invented attachment contents and confirmed appointments. Have pairs inspect the saved work before advancing."
      },
      {
        "title": "Draft a useful response",
        "minutes": 30,
        "notes": "Teaching cue: Reply requests the photo and leaves intake and price to staff. Ask: which input or artifact proves this? Watch for: Diagnosis, free-repair promise, or hidden unsupported claims. Have pairs inspect the saved work before advancing."
      },
      {
        "title": "Break",
        "minutes": 10,
        "notes": "Pause; save work and do not begin a new job during the break."
      },
      {
        "title": "Run missing-context and injection tests",
        "minutes": 25,
        "notes": "Teaching cue: M4 does not override policy; missing-policy run asks for input. Ask: which input or artifact proves this? Watch for: Calling customer text a new system instruction. Have pairs inspect the saved work before advancing."
      },
      {
        "title": "Rehearse the review checkpoint",
        "minutes": 30,
        "notes": "Teaching cue: MR-42 cannot be checked from provided data; status needs review. Ask: which input or artifact proves this? Watch for: Claiming an escalation was sent from a local note. Have pairs inspect the saved work before advancing."
      },
      {
        "title": "Save and retest the reusable instructions",
        "minutes": 20,
        "notes": "Teaching cue: Fresh conversation reproduces the fields and refusal boundaries. Ask: which input or artifact proves this? Watch for: Testing in the same context-rich conversation. Have pairs inspect the saved work before advancing."
      },
      {
        "title": "Review and handoff",
        "minutes": 10,
        "notes": "Have each attendee demonstrate one artifact and one failure check. Record incomplete outputs and a concrete next step."
      }
    ],
    "answerKeys": [
      {
        "exercise": "Write the job and tool checklist",
        "expected": [
          "Brief names drafts only, source policy, and reviewer."
        ],
        "watchFor": [
          "Learners equating a tool account with connected email access."
        ]
      },
      {
        "exercise": "Extract a thread into a record",
        "expected": [
          "M3 confirms another bulb was tried; photo remains missing; Wednesday remains a request."
        ],
        "watchFor": [
          "Invented attachment contents and confirmed appointments."
        ]
      },
      {
        "exercise": "Draft a useful response",
        "expected": [
          "Reply requests the photo and leaves intake and price to staff."
        ],
        "watchFor": [
          "Diagnosis, free-repair promise, or hidden unsupported claims."
        ]
      },
      {
        "exercise": "Run missing-context and injection tests",
        "expected": [
          "M4 does not override policy; missing-policy run asks for input."
        ],
        "watchFor": [
          "Calling customer text a new system instruction."
        ]
      },
      {
        "exercise": "Rehearse the review checkpoint",
        "expected": [
          "MR-42 cannot be checked from provided data; status needs review."
        ],
        "watchFor": [
          "Claiming an escalation was sent from a local note."
        ]
      },
      {
        "exercise": "Save and retest the reusable instructions",
        "expected": [
          "Fresh conversation reproduces the fields and refusal boundaries."
        ],
        "watchFor": [
          "Testing in the same context-rich conversation."
        ]
      }
    ],
    "adaptations": [
      "For beginners, use a single markdown prompt and a handwritten test table.",
      "For experienced attendees, add a second approved tone example and test whether the result stays grounded.",
      "After the workshop, connection and self-send practice requires a supported account and explicit owner approval."
    ]
  },
  "agentic-engineering": {
    "preparation": [
      "Prepare a disposable task-list starter with a working local run and basic check command.",
      "Keep a clean baseline and a scratch copy for conflict practice.",
      "Verify the sample fixture and fixed-clock path before class.",
      "Choose browser verification available in the room; manual inspection is acceptable."
    ],
    "runOfShow": [
      {
        "title": "Orient and inspect the sample",
        "minutes": 10,
        "notes": "Show the supplied fictional inputs. Confirm the sample path runs before anyone attempts account setup."
      },
      {
        "title": "Turn the filter into a build brief",
        "minutes": 20,
        "notes": "Teaching cue: T1 qualifies; T2, T3, T4 do not under the declared rule. Ask: which input or artifact proves this? Watch for: Using <= or ignoring completed status. Have pairs inspect the saved work before advancing."
      },
      {
        "title": "Inspect the repository and isolate work",
        "minutes": 25,
        "notes": "Teaching cue: Stack note cites real files; worktree branch and clean baseline are recorded. Ask: which input or artifact proves this? Watch for: Installing a new framework before inspecting scripts. Have pairs inspect the saved work before advancing."
      },
      {
        "title": "Implement and reproduce the boundary",
        "minutes": 30,
        "notes": "Teaching cue: Only bounded filter behavior changes; failure is reproducible with fixed clock. Ask: which input or artifact proves this? Watch for: Broad refactors hiding the feature. Have pairs inspect the saved work before advancing."
      },
      {
        "title": "Break",
        "minutes": 10,
        "notes": "Pause; save work and do not begin a new job during the break."
      },
      {
        "title": "Test behavior and inspect the browser",
        "minutes": 25,
        "notes": "Teaching cue: Visible overdue list contains T1 and All restores all four; logs show actual checks. Ask: which input or artifact proves this? Watch for: Screenshots of an old build or unexecuted tests. Have pairs inspect the saved work before advancing."
      },
      {
        "title": "Resolve a practice conflict and review",
        "minutes": 30,
        "notes": "Teaching cue: Scratch conflict is resolved according to brief; checks run after resolution. Ask: which input or artifact proves this? Watch for: Creating practice conflicts in shared branches. Have pairs inspect the saved work before advancing."
      },
      {
        "title": "Package the review and reusable skill",
        "minutes": 20,
        "notes": "Teaching cue: Handoff describes real evidence and stops at review. Ask: which input or artifact proves this? Watch for: Claiming deployment occurred or omitting failed checks. Have pairs inspect the saved work before advancing."
      },
      {
        "title": "Review and handoff",
        "minutes": 10,
        "notes": "Have each attendee demonstrate one artifact and one failure check. Record incomplete outputs and a concrete next step."
      }
    ],
    "answerKeys": [
      {
        "exercise": "Turn the filter into a build brief",
        "expected": [
          "T1 qualifies; T2, T3, T4 do not under the declared rule."
        ],
        "watchFor": [
          "Using <= or ignoring completed status."
        ]
      },
      {
        "exercise": "Inspect the repository and isolate work",
        "expected": [
          "Stack note cites real files; worktree branch and clean baseline are recorded."
        ],
        "watchFor": [
          "Installing a new framework before inspecting scripts."
        ]
      },
      {
        "exercise": "Implement and reproduce the boundary",
        "expected": [
          "Only bounded filter behavior changes; failure is reproducible with fixed clock."
        ],
        "watchFor": [
          "Broad refactors hiding the feature."
        ]
      },
      {
        "exercise": "Test behavior and inspect the browser",
        "expected": [
          "Visible overdue list contains T1 and All restores all four; logs show actual checks."
        ],
        "watchFor": [
          "Screenshots of an old build or unexecuted tests."
        ]
      },
      {
        "exercise": "Resolve a practice conflict and review",
        "expected": [
          "Scratch conflict is resolved according to brief; checks run after resolution."
        ],
        "watchFor": [
          "Creating practice conflicts in shared branches."
        ]
      },
      {
        "exercise": "Package the review and reusable skill",
        "expected": [
          "Handoff describes real evidence and stops at review."
        ],
        "watchFor": [
          "Claiming deployment occurred or omitting failed checks."
        ]
      }
    ],
    "adaptations": [
      "For a slower group, provide the isolated checkout and focus on diff review and boundary checks.",
      "For experienced builders, add an explicit timezone edge case without broadening authentication or storage.",
      "If startup fails, inspect the supplied diff and fixture as a paired review exercise; mark implementation incomplete."
    ]
  },
  "automate-social-media": {
    "preparation": [
      "Prepare local queue and calendar templates; do not connect live social accounts for these materials.",
      "Check providers only for optional future planning; avoid unverified capability demos.",
      "Have timeout and duplicate status cards ready.",
      "Show where approval applies to a draft version."
    ],
    "runOfShow": [
      {
        "title": "Orient and inspect the sample",
        "minutes": 10,
        "notes": "Show the supplied fictional inputs. Confirm the sample path runs before anyone attempts account setup."
      },
      {
        "title": "Choose the pipeline and budget",
        "minutes": 20,
        "notes": "Teaching cue: Diagram includes status inspection and a local path within the stated planning budget. Ask: which input or artifact proves this? Watch for: Treating Buffer and Zernio as identical or claiming a current price. Have pairs inspect the saved work before advancing."
      },
      {
        "title": "Save audience and voice instructions",
        "minutes": 25,
        "notes": "Teaching cue: Voice rules cite sample lines and forbid unsupported claims. Ask: which input or artifact proves this? Watch for: Adjective-only voice or tax advice. Have pairs inspect the saved work before advancing."
      },
      {
        "title": "Draft two native versions",
        "minutes": 30,
        "notes": "Teaching cue: Short draft counted; all claims refer to S1; formats differ. Ask: which input or artifact proves this? Watch for: Invented savings numbers or claiming S1 was published. Have pairs inspect the saved work before advancing."
      },
      {
        "title": "Break",
        "minutes": 10,
        "notes": "Pause; save work and do not begin a new job during the break."
      },
      {
        "title": "Build and edit the four-week calendar",
        "minutes": 25,
        "notes": "Teaching cue: Six entries, two gaps, and learner-made edits exist. Ask: which input or artifact proves this? Watch for: Regenerating away the edit history. Have pairs inspect the saved work before advancing."
      },
      {
        "title": "Rehearse scheduling and failure recovery",
        "minutes": 30,
        "notes": "Teaching cue: Timeout is reconciled before retry; Q2 detected as potential duplicate. Ask: which input or artifact proves this? Watch for: Automatic retry on unknown final status. Have pairs inspect the saved work before advancing."
      },
      {
        "title": "Test weekly review and preserve the blueprint",
        "minutes": 20,
        "notes": "Teaching cue: P1=4%; P2=7%; no causal winner claimed. Ask: which input or artifact proves this? Watch for: Calling mock performance a measured workshop outcome. Have pairs inspect the saved work before advancing."
      },
      {
        "title": "Review and handoff",
        "minutes": 10,
        "notes": "Have each attendee demonstrate one artifact and one failure check. Record incomplete outputs and a concrete next step."
      }
    ],
    "answerKeys": [
      {
        "exercise": "Choose the pipeline and budget",
        "expected": [
          "Diagram includes status inspection and a local path within the stated planning budget."
        ],
        "watchFor": [
          "Treating Buffer and Zernio as identical or claiming a current price."
        ]
      },
      {
        "exercise": "Save audience and voice instructions",
        "expected": [
          "Voice rules cite sample lines and forbid unsupported claims."
        ],
        "watchFor": [
          "Adjective-only voice or tax advice."
        ]
      },
      {
        "exercise": "Draft two native versions",
        "expected": [
          "Short draft counted; all claims refer to S1; formats differ."
        ],
        "watchFor": [
          "Invented savings numbers or claiming S1 was published."
        ]
      },
      {
        "exercise": "Build and edit the four-week calendar",
        "expected": [
          "Six entries, two gaps, and learner-made edits exist."
        ],
        "watchFor": [
          "Regenerating away the edit history."
        ]
      },
      {
        "exercise": "Rehearse scheduling and failure recovery",
        "expected": [
          "Timeout is reconciled before retry; Q2 detected as potential duplicate."
        ],
        "watchFor": [
          "Automatic retry on unknown final status."
        ]
      },
      {
        "exercise": "Test weekly review and preserve the blueprint",
        "expected": [
          "P1=4%; P2=7%; no causal winner claimed."
        ],
        "watchFor": [
          "Calling mock performance a measured workshop outcome."
        ]
      }
    ],
    "adaptations": [
      "Nontechnical attendees can run the complete pipeline in a spreadsheet.",
      "Technical attendees can write local pseudocode for status reconciliation and duplicate keys.",
      "When live access is unavailable, simulated status checks must be labeled simulated in the handoff."
    ]
  },
  "agentic-lead-generation": {
    "preparation": [
      "Prepare the fictional packet and simulated lookup responses in local files.",
      "Do not query sample domains or contact sample names.",
      "Demonstrate the distinction between match confidence and fit score.",
      "Have an existing-owner target sheet ready for merge review."
    ],
    "runOfShow": [
      {
        "title": "Orient and inspect the sample",
        "minutes": 10,
        "notes": "Show the supplied fictional inputs. Confirm the sample path runs before anyone attempts account setup."
      },
      {
        "title": "Define fit before collecting names",
        "minutes": 20,
        "notes": "Teaching cue: Profile marked hypothesis; size, sector, trigger, and disqualifiers defined. Ask: which input or artifact proves this? Watch for: Invented customer proof or profile widening. Have pairs inspect the saved work before advancing."
      },
      {
        "title": "Extract a small sourced list",
        "minutes": 25,
        "notes": "Teaching cue: S1/S2 support Aster Studio; S3 belongs to another company; Briar fields remain missing. Ask: which input or artifact proves this? Watch for: Guessed roles, emails, or staff counts. Have pairs inspect the saved work before advancing."
      },
      {
        "title": "Match records and rehearse enrichment",
        "minutes": 30,
        "notes": "Teaching cue: L2 rejected for domain/sector conflict; L1 role remains unverified; L3 unresolved. Ask: which input or artifact proves this? Watch for: Treating illustrative confidence as provider score. Have pairs inspect the saved work before advancing."
      },
      {
        "title": "Break",
        "minutes": 10,
        "notes": "Pause; save work and do not begin a new job during the break."
      },
      {
        "title": "Qualify with a transparent rubric",
        "minutes": 25,
        "notes": "Teaching cue: Aster Studio scores 6; Aster Products disqualified; Briar needs research with only sector evidence. Ask: which input or artifact proves this? Watch for: Fit score presented as purchase probability. Have pairs inspect the saved work before advancing."
      },
      {
        "title": "Deduplicate and rehearse the handoff",
        "minutes": 30,
        "notes": "Teaching cue: R1/R2 merge with provenance; target owner Jordan retained. Ask: which input or artifact proves this? Watch for: Overwriting CRM owners or losing sources. Have pairs inspect the saved work before advancing."
      },
      {
        "title": "Test quality and cap lookup spend",
        "minutes": 20,
        "notes": "Teaching cue: Ten attempts use all 20 training credits; failed attempts count. Ask: which input or artifact proves this? Watch for: Unbounded retry or claiming admission includes credits. Have pairs inspect the saved work before advancing."
      },
      {
        "title": "Review and handoff",
        "minutes": 10,
        "notes": "Have each attendee demonstrate one artifact and one failure check. Record incomplete outputs and a concrete next step."
      }
    ],
    "answerKeys": [
      {
        "exercise": "Define fit before collecting names",
        "expected": [
          "Profile marked hypothesis; size, sector, trigger, and disqualifiers defined."
        ],
        "watchFor": [
          "Invented customer proof or profile widening."
        ]
      },
      {
        "exercise": "Extract a small sourced list",
        "expected": [
          "S1/S2 support Aster Studio; S3 belongs to another company; Briar fields remain missing."
        ],
        "watchFor": [
          "Guessed roles, emails, or staff counts."
        ]
      },
      {
        "exercise": "Match records and rehearse enrichment",
        "expected": [
          "L2 rejected for domain/sector conflict; L1 role remains unverified; L3 unresolved."
        ],
        "watchFor": [
          "Treating illustrative confidence as provider score."
        ]
      },
      {
        "exercise": "Qualify with a transparent rubric",
        "expected": [
          "Aster Studio scores 6; Aster Products disqualified; Briar needs research with only sector evidence."
        ],
        "watchFor": [
          "Fit score presented as purchase probability."
        ]
      },
      {
        "exercise": "Deduplicate and rehearse the handoff",
        "expected": [
          "R1/R2 merge with provenance; target owner Jordan retained."
        ],
        "watchFor": [
          "Overwriting CRM owners or losing sources."
        ]
      },
      {
        "exercise": "Test quality and cap lookup spend",
        "expected": [
          "Ten attempts use all 20 training credits; failed attempts count."
        ],
        "watchFor": [
          "Unbounded retry or claiming admission includes credits."
        ]
      }
    ],
    "adaptations": [
      "For beginners, use source IDs in a spreadsheet rather than an integration.",
      "For advanced learners, add a local schema validator and duplicate-group report.",
      "Real sourcing later requires supported tools, checked sources, owner permission, and actual pricing review."
    ]
  },
  "creatives-agentic-workflow": {
    "preparation": [
      "Prepare neutral placeholder images or simple shapes for the no-generation path.",
      "Check editor access and prepare a three-shot timeline template.",
      "Use only fictional or owned references; no live brand assets are required.",
      "Show how the ledger counts unsuccessful generation attempts."
    ],
    "runOfShow": [
      {
        "title": "Orient and inspect the sample",
        "minutes": 10,
        "notes": "Show the supplied fictional inputs. Confirm the sample path runs before anyone attempts account setup."
      },
      {
        "title": "Translate the brief into a production plan",
        "minutes": 20,
        "notes": "Teaching cue: Brief contains one approved message and no environmental claims; attempt cap visible. Ask: which input or artifact proves this? Watch for: Inventing certifications or provider costs. Have pairs inspect the saved work before advancing."
      },
      {
        "title": "Write reusable direction and review rules",
        "minutes": 25,
        "notes": "Teaching cue: Rules cite the fictional lines and product traits; editable copy required. Ask: which input or artifact proves this? Watch for: Uncheckable “premium aesthetic” instructions. Have pairs inspect the saved work before advancing."
      },
      {
        "title": "Build and review image variants",
        "minutes": 30,
        "notes": "Teaching cue: Two concepts and format variants are saved or labeled mocks; review examines actual drafts. Ask: which input or artifact proves this? Watch for: Calling a prompt an image output. Have pairs inspect the saved work before advancing."
      },
      {
        "title": "Break",
        "minutes": 10,
        "notes": "Pause; save work and do not begin a new job during the break."
      },
      {
        "title": "Write the script and storyboard",
        "minutes": 25,
        "notes": "Teaching cue: Three five-second shots; references and readable CTA present. Ask: which input or artifact proves this? Watch for: Overlong narration or unsupported before/after benefits. Have pairs inspect the saved work before advancing."
      },
      {
        "title": "Assemble the short and track handoffs",
        "minutes": 30,
        "notes": "Teaching cue: Saved short or labeled animatic; failed attempts and manual steps logged. Ask: which input or artifact proves this? Watch for: Claiming provider job succeeded without opening output. Have pairs inspect the saved work before advancing."
      },
      {
        "title": "Review exports and preserve the pipeline",
        "minutes": 20,
        "notes": "Teaching cue: Exports open, manifest records actual settings, reviewer tied to version. Ask: which input or artifact proves this? Watch for: Treating export presets as universal platform requirements. Have pairs inspect the saved work before advancing."
      },
      {
        "title": "Review and handoff",
        "minutes": 10,
        "notes": "Have each attendee demonstrate one artifact and one failure check. Record incomplete outputs and a concrete next step."
      }
    ],
    "answerKeys": [
      {
        "exercise": "Translate the brief into a production plan",
        "expected": [
          "Brief contains one approved message and no environmental claims; attempt cap visible."
        ],
        "watchFor": [
          "Inventing certifications or provider costs."
        ]
      },
      {
        "exercise": "Write reusable direction and review rules",
        "expected": [
          "Rules cite the fictional lines and product traits; editable copy required."
        ],
        "watchFor": [
          "Uncheckable “premium aesthetic” instructions."
        ]
      },
      {
        "exercise": "Build and review image variants",
        "expected": [
          "Two concepts and format variants are saved or labeled mocks; review examines actual drafts."
        ],
        "watchFor": [
          "Calling a prompt an image output."
        ]
      },
      {
        "exercise": "Write the script and storyboard",
        "expected": [
          "Three five-second shots; references and readable CTA present."
        ],
        "watchFor": [
          "Overlong narration or unsupported before/after benefits."
        ]
      },
      {
        "exercise": "Assemble the short and track handoffs",
        "expected": [
          "Saved short or labeled animatic; failed attempts and manual steps logged."
        ],
        "watchFor": [
          "Claiming provider job succeeded without opening output."
        ]
      },
      {
        "exercise": "Review exports and preserve the pipeline",
        "expected": [
          "Exports open, manifest records actual settings, reviewer tied to version."
        ],
        "watchFor": [
          "Treating export presets as universal platform requirements."
        ]
      }
    ],
    "adaptations": [
      "For beginners, make an animatic from stills and focus on readable copy and timing.",
      "For experienced creatives, compare two revisions against one criterion within the same cap.",
      "If exports are blocked, save the edit plan and manifest with output status incomplete rather than marking delivery approved."
    ]
  }
};
