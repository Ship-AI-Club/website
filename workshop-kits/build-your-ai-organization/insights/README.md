# AI Insights & Decision Team · sample-data starter

Synthetic intake.csv: week,received,reviewed. W1,20,12; W2,25,15; W3,0,0. Definition: review rate=reviewed/received for the same weekly cohort; zero received yields not applicable. These are practice values, not business performance.

Run `node starter.mjs` from this directory. Node.js is required; no packages or network access are used. The starter makes a deterministic draft, not an AI or live-connector integration. Use prompt.md with your available AI tool to adapt the workflow; compare with source inputs.

Then inspect output.json (engineering: preview.html). Open engineering preview.html in your browser and record observed checks. Alter the fixture for cases in checks.md, rerun, and preserve copies in a test log. The starter is a normal-path baseline; its intentionally narrow logic must be adapted to pass all edge checks. Do not infer that missing tool or policy cases passed.

Done: Dashboard or chart plus evidence-backed brief, metric definitions and reconciliation log.

Handoff: Insights → Revenue or Operations: approved metric, cohort, source date, limitations and proposed action; reviewer decides, no automatic operational change.

Production checklist: approved data, real tool permissions, configured operator, live failure logging, observed cost, review and rollback. This pack grants no production access.

Keep review-log.md, implementation-notes.md, acceptance.md and handoff-template.json with your chosen-lab evidence. Fill the templates; they contain no assumed successful results.
