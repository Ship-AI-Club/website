# AI Business Operations Team · sample-data starter

Sample intake queue: R-1 office move, due Friday, owner Operations; R-2 invoice approval, due missing, owner Finance; R-3 duplicate of R-1. SOP-1: summarize work, flag missing due dates, route invoice approvals to Finance, never approve payment. Weekly report date is a supplied fixture date, not inferred.

Run `node starter.mjs` from this directory. Node.js is required; no packages or network access are used. The starter makes a deterministic draft, not an AI or live-connector integration. Use prompt.md with your available AI tool to adapt the workflow; compare with source inputs.

Then inspect output.json (engineering: preview.html). Open engineering preview.html in your browser and record observed checks. Alter the fixture for cases in checks.md, rerun, and preserve copies in a test log. The starter is a normal-path baseline; its intentionally narrow logic must be adapted to pass all edge checks. Do not infer that missing tool or policy cases passed.

Done: Operational brief, reviewable task-routing records, exception queue and run log.

Handoff: Operations → Insights: counts by defined request status, reporting period, duplicate rule and source IDs; omit unresolved records from completed totals.

Production checklist: approved data, real tool permissions, configured operator, live failure logging, observed cost, review and rollback. This pack grants no production access.

Keep review-log.md, implementation-notes.md, acceptance.md and handoff-template.json with your chosen-lab evidence. Fill the templates; they contain no assumed successful results.
