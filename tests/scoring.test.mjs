import test from "node:test";
import assert from "node:assert/strict";
import { averageScore, weightedScore } from "../lib/accounts.js";

test("design, craft, and shipped-work receipts have equal weight", () => {
  assert.equal(weightedScore({ design: 5, craft: 3, receipts: 1 }), 3);
  assert.equal(weightedScore({ design: 1, craft: 5, receipts: 3 }), 3);
  assert.equal(weightedScore({ design: 5, craft: 5, receipts: 5 }), 5);
  assert.equal(weightedScore({ design: 1, craft: 1, receipts: 1 }), 1);
});

test("retired shipped and growth scores cannot substitute for design", () => {
  assert.equal(weightedScore({ shipped: 5, growth: 5, receipts: 5, craft: 5 }), null);
  assert.equal(weightedScore({ design: 3, craft: 3, receipts: 3, shipped: 0, growth: 0 }), 3);
});

test("incomplete and invalid cards do not contribute to averages", () => {
  const complete = { design: 5, craft: 3, receipts: 1 };
  assert.equal(averageScore([complete, { design: 5, craft: null, receipts: 5 }]), 3);
  assert.equal(weightedScore({ design: 6, craft: 5, receipts: 5 }), null);
  assert.equal(weightedScore({ design: 0, craft: 5, receipts: 5 }), null);
  assert.equal(weightedScore({ design: 2.5, craft: 5, receipts: 5 }), null);
  assert.equal(weightedScore({ design: "invalid", craft: 5, receipts: 5 }), null);
  assert.equal(averageScore([complete, { design: 0, craft: 5, receipts: 5 }]), 3);
  assert.equal(averageScore([]), null);
});
