# AI Product & Engineering Team · sample-data starter

Sample backlog F-03: an intake-list view must filter by status (new/reviewed) and show a clear empty state. Fixture records: I-1 new, I-2 reviewed, I-3 new; no personal data. Existing stack and test commands must be read from the supplied project, not assumed.

Run `node starter.mjs` from this directory. Node.js is required; no packages or network access are used. The starter makes a deterministic draft, not an AI or live-connector integration. Use prompt.md with your available AI tool to adapt the workflow; compare with source inputs.

Then inspect output.json (engineering: preview.html). Open engineering preview.html in your browser and record observed checks. Alter the fixture for cases in checks.md, rerun, and preserve copies in a test log. The starter is a normal-path baseline; its intentionally narrow logic must be adapted to pass all edge checks. Do not infer that missing tool or policy cases passed.

Done: Bounded diff, acceptance evidence, browser observation or explicit blocker, and review notes.

Handoff: Engineering → Support: accepted behavior, known limitations, help-text draft and rollback owner; no unresolved test represented as passed.

Production checklist: approved data, real tool permissions, configured operator, live failure logging, observed cost, review and rollback. This pack grants no production access.

Keep review-log.md, implementation-notes.md, acceptance.md and handoff-template.json with your chosen-lab evidence. Fill the templates; they contain no assumed successful results.
