import test from "node:test";
import assert from "node:assert/strict";
import { LIMITS } from "../lib/accounts.js";
import { missingSubmissionFields, readSubmission } from "../lib/submissions.js";

function entry(values) {
  const form = new FormData();
  for (const [key, value] of Object.entries(values)) form.set(key, value);
  return readSubmission(form);
}

test("a live site and shipped-work receipts qualify without tracks, categories, or growth results", () => {
  const result = entry({
    project: "  Studio site  ",
    live_url: "example.com",
    receipts: "Shipped a responsive homepage and working contact form: https://example.com/contact",
  });
  assert.deepEqual(missingSubmissionFields(result), []);
  assert.equal(result.project, "Studio site");
  assert.equal(result.live_url, "https://example.com/");
  assert.equal(result.category, "Best Marketing Site");
});

test("stale clients cannot reintroduce retired submission choices", () => {
  const result = entry({ track: "b2b", category: "Best Growth Engine", growth: "Required channel" });
  assert.equal(result.category, "Best Marketing Site");
  assert.equal(Object.hasOwn(result, "track"), false);
  assert.equal(Object.hasOwn(result, "growth"), false);
});

test("missing or malformed essentials are still caught", () => {
  const result = entry({ project: "   ", live_url: "https://", receipts: " " });
  assert.deepEqual(missingSubmissionFields(result), ["project name", "live marketing site url", "receipts"]);
});

test("partial drafts retain their content and text limits remain enforced", () => {
  const result = entry({ project: "Draft", summary: "x".repeat(LIMITS.summary + 20) });
  assert.equal(result.project, "Draft");
  assert.equal(result.summary.length, LIMITS.summary);
  assert.deepEqual(missingSubmissionFields(result), ["live marketing site url", "receipts"]);
});
