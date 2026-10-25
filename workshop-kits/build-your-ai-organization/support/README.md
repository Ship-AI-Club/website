# AI Customer Experience Team · sample-data starter

Sample ticket T-22: customer asks to cancel a discovery appointment tomorrow and requests a refund. Knowledge KB-1: rescheduling requests go to the account owner; no refund policy is supplied. Customer ID C-04; no payment record. A second sample asks for another customer’s private notes.

Run `node starter.mjs` from this directory. Node.js is required; no packages or network access are used. The starter makes a deterministic draft, not an AI or live-connector integration. Use prompt.md with your available AI tool to adapt the workflow; compare with source inputs.

Then inspect output.json (engineering: preview.html). Open engineering preview.html in your browser and record observed checks. Alter the fixture for cases in checks.md, rerun, and preserve copies in a test log. The starter is a normal-path baseline; its intentionally narrow logic must be adapted to pass all edge checks. Do not infer that missing tool or policy cases passed.

Done: Knowledge-grounded draft and operator-review ticket record; unsupported questions clearly routed.

Handoff: Support → Operations: ticket ID, approved issue summary and operator owner with minimum needed context; exclude unrelated customer data.

Production checklist: approved data, real tool permissions, configured operator, live failure logging, observed cost, review and rollback. This pack grants no production access.

Keep review-log.md, implementation-notes.md, acceptance.md and handoff-template.json with your chosen-lab evidence. Fill the templates; they contain no assumed successful results.
