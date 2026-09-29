import test from "node:test";
import assert from "node:assert/strict";
import { averageScore, weightedScore } from "../lib/accounts.js";

test("design, craft, and shipped-work receipts have equal weight", () => {
  assert.equal(weightedScore({ design: 9, craft: 6, receipts: 3 }), 6);
  assert.equal(weightedScore({ design: 3, craft: 9, receipts: 6 }), 6);
  assert.equal(weightedScore({ design: 10, craft: 10, receipts: 10 }), 10);
  assert.equal(weightedScore({ design: 0, craft: 0, receipts: 0 }), 0);
});

test("retired shipped and growth scores cannot substitute for design", () => {
  assert.equal(weightedScore({ shipped: 10, growth: 10, receipts: 10, craft: 10 }), null);
  assert.equal(weightedScore({ design: 6, craft: 6, receipts: 6, shipped: 0, growth: 0 }), 6);
});

test("incomplete and invalid cards do not contribute to averages", () => {
  const complete = { design: 9, craft: 6, receipts: 3 };
  assert.equal(averageScore([complete, { design: 10, craft: null, receipts: 10 }]), 6);
  assert.equal(weightedScore({ design: 11, craft: 10, receipts: 10 }), null);
  assert.equal(weightedScore({ design: "invalid", craft: 10, receipts: 10 }), null);
  assert.equal(averageScore([]), null);
});
