import test from "node:test";
import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import { SourceTextModule, SyntheticModule, createContext } from "node:vm";
import { EVENT } from "../lib/hackathon.js";

async function fixture(stored, now) {
  const FixedDate = class extends Date { constructor(...args) { super(...(args.length ? args : [now])); } };
  const context = createContext({ Date: FixedDate });
  const mocks = {
    "server-only": {},
    "./hackathon": { EVENT },
    "./db": { sql: async () => stored === undefined ? [] : [{ key: "submissions_open", value: stored }], safeRead: async fn => fn() },
  };
  const module = new SourceTextModule(await readFile(new URL("../lib/settings.js", import.meta.url), "utf8"), { context });
  await module.link(async specifier => {
    const values = mocks[specifier];
    const mock = new SyntheticModule(Object.keys(values), function () { for (const [k, v] of Object.entries(values)) this.setExport(k, v); }, { context });
    await mock.link(() => {}); return mock;
  });
  await module.evaluate(); return module.namespace;
}

test("the extended deadline is 1 PM Phoenix time on October 18", () => {
  assert.equal(EVENT.deadlineISO, "2026-10-18T13:00:00-07:00");
  assert.match(EVENT.deadline, /^1:00 PM MST/);
});

test("submissions are open before 1 PM and close exactly at 1 even with the switch on", async () => {
  for (const stored of [undefined, true, false]) {
    for (const time of ["2026-10-18T12:00:00-07:00", "2026-10-18T12:59:59-07:00", "2026-10-18T13:00:00-07:00", "2026-10-18T13:00:01-07:00"]) {
      const f = await fixture(stored, time);
      const expected = new Date(time) < new Date(EVENT.deadlineISO) && stored !== false;
      assert.equal(await f.submissionsOpen(), expected, `${stored} at ${time}`);
      assert.equal((await f.allSettings()).submissions_open, expected);
    }
  }
});
