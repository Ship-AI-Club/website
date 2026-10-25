import { test } from "node:test";
import assert from "node:assert/strict";
import { canFetchInboundBody } from "../lib/inbound-retention.js";

test("recent missing bodies are retryable, expired bodies are not", () => {
  const now = Date.parse("2026-10-12T05:00:00Z");
  assert.equal(canFetchInboundBody("2026-10-11T12:35:00Z", now), true);
  assert.equal(canFetchInboundBody("2026-09-17T10:46:00Z", now), true);
  assert.equal(canFetchInboundBody("2026-09-10T10:50:00Z", now), false);
  assert.equal(canFetchInboundBody("2026-09-12T05:00:00Z", now), false);
  assert.equal(canFetchInboundBody("not a date", now), false);
});
