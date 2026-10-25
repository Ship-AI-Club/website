import test from "node:test";
import assert from "node:assert/strict";
import { buildPitch, pitchMarkdown, PITCH_STEPS, pitchAnswerParts, DEMO_PITCH, DEMO_PITCH_TEAM } from "../lib/hackathon-pitch.js";
import { readSubmission, invalidSubmissionUrls } from "../lib/submissions.js";

test("four pitch sections cover exactly five minutes", () => {
  assert.equal(PITCH_STEPS.length, 4);
  assert.equal(PITCH_STEPS.reduce((total, step) => total + step.seconds, 0), 300);
});

test("the complete demo has four populated slides and structured answers keep their content",()=>{
  const deck=buildPitch(DEMO_PITCH,DEMO_PITCH_TEAM);
  assert.ok(deck.slides.every(slide=>slide.answer));
  assert.deepEqual(pitchAnswerParts("Customer: Phoenix owners\nProblem: Care during travel"),[{label:"Customer",body:"Phoenix owners"},{label:"Problem",body:"Care during travel"}]);
  assert.deepEqual(pitchAnswerParts("https://example.com"),[{label:"",body:"https://example.com"}]);
});

test("saved submission answers populate the right slides without leaking contact details", () => {
  const deck = buildPitch({ project: "Porchlight", summary: "Plant care while you travel.", live_url: "example.com",
    pitch: { positioning: "Local care, without a subscription.", icp: "Traveling plant owners.", design: "A clear quote action on mobile." },
    launch: "Shipped a quote form.", receipts: "https://example.com/quote" },
  { name: "Team Porchlight", members: [{ name: "Taylor", email: "private@example.invalid" }, { name: "Alex" }] });
  assert.equal(deck.team, "Taylor, Alex");
  assert.equal(deck.slides[1].answer, "Local care, without a subscription.");
  assert.equal(deck.slides[2].answer, "Traveling plant owners.");
  assert.equal(deck.slides[3].answer, "A clear quote action on mobile.");
  const markdown = pitchMarkdown(deck);
  assert.match(markdown, /https:\/\/example.com\//);
  assert.match(markdown, /Shipped a quote form/);
  assert.match(markdown, /2:45–5:00/);
  assert.doesNotMatch(markdown, /private@example.invalid/);
});

test("old and incomplete submissions keep explicit prompts and never invent claims", () => {
  const deck = buildPitch({ project: "Old entry" });
  assert.ok(deck.slides.every(slide => slide.answer === "" && slide.prompt));
  assert.match(pitchMarkdown(deck), /\[Describe one specific customer/);
  assert.equal(deck.liveUrl, "");
});

test("pitch answers are bounded and absent fields from older forms stay absent", () => {
  const form = new FormData(); form.set("icp", "x".repeat(900));
  assert.equal(readSubmission(form).pitch.icp.length, 600);
  assert.equal(Object.hasOwn(readSubmission(form).pitch, "positioning"), false);
});

test("malformed, credential-bearing, and non-web URLs return actionable validation", () => {
  for (const url of ["https://", "ftp://example.com", "javascript:alert(1)", "https://name:secret@example.com", "example .com"]) {
    const form = new FormData(); form.set("live_url", url);
    assert.equal(invalidSubmissionUrls(form).length, 1, url);
  }
  for (const url of ["example.com", "https://example.com/contact", "http://localhost:3000"]) {
    const form = new FormData(); form.set("live_url", url);
    assert.equal(invalidSubmissionUrls(form).length, 0, url);
  }
});
