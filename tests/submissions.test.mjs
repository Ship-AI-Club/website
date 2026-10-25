import test from "node:test";
import assert from "node:assert/strict";
import { LIMITS } from "../lib/accounts.js";
import { missingSubmissionFields, readSubmission, invalidSubmissionUrls, submissionPitchMode, customPitchDeckUrl } from "../lib/submissions.js";

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

test("teams can submit with their own deck, an empty generated draft, or no deck", () => {
  for (const mode of ["custom", "generated", "later"]) {
    const result = entry({ project: "Studio", live_url: "example.com", receipts: "Working pages", pitch_mode: mode });
    assert.deepEqual(missingSubmissionFields(result), []);
    assert.equal(result.pitch.mode, mode);
    assert.equal(customPitchDeckUrl(result.pitch), "");
  }
  assert.equal(submissionPitchMode(), "later");
  assert.equal(submissionPitchMode({icp:"Traveling owners"}), "generated", "existing generated drafts stay selected");
  assert.equal(Object.hasOwn(entry({project:"Old form"}).pitch, "mode"), false, "old forms do not replace saved choices");
});

test("custom deck links are optional, normalized, and validated before saving", () => {
  const form = new FormData(); form.set("pitch_mode", "custom");
  for (const url of ["", "docs.google.com/presentation/d/demo/edit", "https://example.com/deck.pdf"]) {
    form.set("pitch_deck_url", url);
    assert.deepEqual(invalidSubmissionUrls(form), []);
  }
  for (const url of ["https://", "javascript:alert(1)", "data:text/html,hello", "https://name:secret@example.com", "example .com"]) {
    form.set("pitch_deck_url", url);
    assert.equal(invalidSubmissionUrls(form)[0]?.name, "Your deck URL", url);
  }
  const result = entry({pitch_mode:"custom",pitch_deck_url:"example.com/deck.pdf"});
  assert.equal(customPitchDeckUrl(result.pitch), "https://example.com/deck.pdf");
  assert.equal(customPitchDeckUrl({...result.pitch,mode:"generated"}), "", "inactive custom decks are not shown to judges");
});
