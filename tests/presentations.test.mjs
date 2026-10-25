// PRESENTATION_TEST_DATABASE_URL=postgres://postgres@localhost:55432/postgres \
// PRESENTATION_TEST_PG_PATH=/tmp/shipai-team-test-runtime/node_modules/pg/lib/index.js \
// node --experimental-vm-modules --test tests/presentations.test.mjs
import test from "node:test";
import assert from "node:assert/strict";
import { randomUUID } from "node:crypto";
import { readFile } from "node:fs/promises";
import { createRequire } from "node:module";
import { SourceTextModule, SyntheticModule, createContext } from "node:vm";
import * as accounts from "../lib/accounts.js";

const databaseUrl = process.env.PRESENTATION_TEST_DATABASE_URL;
const integration = (name, fn) => test(name, { skip: !databaseUrl }, fn);

async function fixture(t) {
  assert.ok(["localhost", "127.0.0.1"].includes(new URL(databaseUrl).hostname));
  const { Pool } = createRequire(import.meta.url)(process.env.PRESENTATION_TEST_PG_PATH || "pg");
  const root = new Pool({ connectionString: databaseUrl });
  const schema = `presentation_test_${randomUUID().replaceAll("-", "")}`;
  await root.query(`create schema ${schema}`);
  const pool = new Pool({ connectionString: databaseUrl, options: `-c search_path=${schema},public` });
  t.after(async () => { await pool.end(); await root.query(`drop schema ${schema} cascade`); await root.end(); });
  await pool.query(await readFile(new URL("../lib/schema.sql", import.meta.url), "utf8"));
  const execute = async (strings, ...values) => (await pool.query(strings.reduce((q, part, i) => q + (i ? `$${i}` : "") + part, ""), values)).rows;
  const eventId = "zero-to-launch-2026";
  let actor = { id: randomUUID(), roles: ["judge"] };
  await pool.query("insert into users (id, email, name) values ($1, 'judge@example.invalid', 'Judge')", [actor.id]);
  const modules = new Map();
  const context = createContext({ console, Date, FormData, URL });
  const redirect = location => { throw Object.assign(new Error("redirect"), { location }); };
  const mocks = {
    "server-only": {},
    react: { cache: fn => fn },
    "next/navigation": { redirect },
    "next/cache": { revalidatePath() {} },
    "lib/accounts": accounts,
    "lib/hackathon": { EVENT: { id: eventId } },
    "lib/db": { sql: execute, one: rows => rows[0] ?? null, safeRead: async fn => fn() },
    "lib/auth": { requireRole: async () => {
      if (!actor.roles.some(role => ["admin", "judge"].includes(role))) redirect("/dashboard?denied=judge");
      return actor;
    } },
  };
  async function moduleFor(id) {
    if (modules.has(id)) return modules.get(id);
    const exports = mocks[id];
    const module = exports ? new SyntheticModule(Object.keys(exports), function () {
      for (const [key, value] of Object.entries(exports)) this.setExport(key, value);
    }, { context, identifier: id }) : new SourceTextModule(await readFile(new URL(`../${id}.js`, import.meta.url), "utf8"), { context, identifier: id });
    modules.set(id, module);
    await module.link((specifier, parent) => moduleFor(specifier.startsWith(".")
      ? new URL(specifier, `https://fixture.invalid/${parent.identifier}`).pathname.slice(1).replace(/\.js$/, "") : specifier));
    return module;
  }
  async function load(id) { const m = await moduleFor(id); if (m.status !== "evaluated") await m.evaluate(); return m.namespace; }
  const presentations = await load("lib/presentations");
  const directory = await load("lib/public-teams");
  const actions = await load("app/judge/actions");
  async function entry({ status = "submitted", event = eventId, at = "2026-10-18T17:00:00Z", name = "Project" } = {}) {
    const teamId = randomUUID(); const id = randomUUID();
    await pool.query("insert into teams (id, name, slug, invite_code, hackathon_id) values ($1::uuid, $2, $1::text, $1::text, $3)", [teamId, name, event]);
    await pool.query("insert into submissions (id, team_id, project, status, submitted_at, live_url) values ($1,$2,$3,$4,$5,'https://example.invalid')", [id, teamId, name, status, status === "submitted" ? at : null]);
    return { id, teamId };
  }
  const form = (id, values = {}) => {
    const data = new FormData();
    for (const [key, value] of Object.entries({ submission_id: id, design: "5", craft: "3", receipts: "4", notes: "Evidence reviewed", intent: "submit", ...values })) data.set(key, value);
    return data;
  };
  return { pool, presentations, directory, actions, entry, form, get actor() { return actor; }, setActor(value) { actor = value; } };
}

integration("lineup contains only this event's submitted projects in identical order for all judges", async t => {
  const f = await fixture(t);
  const later = await f.entry({ at: "2026-10-18T18:00:00Z", name: "Alpha" });
  const first = await f.entry({ name: "Zulu" });
  await f.entry({ status: "draft" }); await f.entry({ status: "withdrawn" }); await f.entry({ event: "another-event" });
  await f.pool.query("insert into teams (name, slug, invite_code) values ('No entry', 'no-entry', 'NO-ENTRY')");
  const a = await f.presentations.presentationQueue(f.actor.id);
  const b = await f.presentations.presentationQueue(randomUUID());
  assert.deepEqual(a.map(e => e.id), [first.id, later.id]);
  assert.deepEqual(b.map(e => e.id), a.map(e => e.id));
});

integration("judges and admins can score immediately without prior assignments; cards remain separate", async t => {
  const f = await fixture(t); const entry = await f.entry(); const judgeId = f.actor.id;
  const saved = await f.actions.savePresentationScoreAction({}, f.form(entry.id));
  assert.match(saved.ok, /filed/);
  assert.equal((await f.pool.query("select * from judge_assignments")).rowCount, 1);
  const adminId = randomUUID();
  await f.pool.query("insert into users (id,email,is_admin) values ($1,'admin@example.invalid',true)", [adminId]);
  f.setActor({ id: adminId, roles: ["admin"] });
  assert.match((await f.actions.savePresentationScoreAction({}, f.form(entry.id, { design: "1" }))).ok, /filed/);
  const judgeQueue = await f.presentations.presentationQueue(judgeId);
  const adminQueue = await f.presentations.presentationQueue(adminId);
  assert.equal(judgeQueue[0].design, 5); assert.equal(adminQueue[0].design, 1);
  assert.equal(judgeQueue[0].score_receipts, 4); assert.ok(judgeQueue[0].scored_at);
});

integration("own-team, draft, withdrawn, other-event and malformed entries cannot be scored", async t => {
  const f = await fixture(t); const own = await f.entry();
  await f.pool.query("insert into team_members (team_id,user_id) values ($1,$2)", [own.teamId, f.actor.id]);
  for (const id of [own.id, (await f.entry({ status: "draft" })).id, (await f.entry({ status: "withdrawn" })).id, (await f.entry({ event: "another-event" })).id, "bad-id"]) {
    assert.ok((await f.actions.savePresentationScoreAction({}, f.form(id))).error);
  }
  assert.equal((await f.pool.query("select * from scores")).rowCount, 0);
  assert.equal((await f.pool.query("select * from judge_assignments")).rowCount, 0);
  assert.equal((await f.presentations.presentationQueue(f.actor.id))[0].conflict, true);
});

integration("save and next advances only after a complete valid card; drafts persist without counting", async t => {
  const f = await fixture(t); const first = await f.entry(); const next = await f.entry({ at: "2026-10-18T18:00:00Z" });
  const incomplete = await f.actions.savePresentationScoreAction({}, f.form(first.id, { craft: "", intent: "next" }));
  assert.match(incomplete.error, /missing craft/);
  assert.equal((await f.pool.query("select * from scores")).rowCount, 0);
  assert.match((await f.actions.savePresentationScoreAction({}, f.form(first.id, { craft: "", intent: "draft" }))).ok, /Draft saved/);
  assert.equal((await f.pool.query("select submitted_at from scores")).rows[0].submitted_at, null);
  assert.equal((await f.actions.savePresentationScoreAction({}, f.form(first.id, { intent: "next" }))).nextUrl, `/judge/presentations?team=${next.id}`);
  const row = (await f.pool.query("select * from scores")).rows[0];
  assert.equal(row.notes, "Evidence reviewed"); assert.ok(row.submitted_at);
  assert.match((await f.actions.savePresentationScoreAction({}, f.form(next.id, { intent: "next" }))).ok, /filed/);
});

integration("shared scoring does not open the assigned scorecard action to unassigned or participant users", async t => {
  const f = await fixture(t); const entry = await f.entry();
  assert.match((await f.actions.saveScoreAction({}, f.form(entry.id))).error, /isn't assigned/);
  f.setActor({ ...f.actor, roles: [] });
  await assert.rejects(f.actions.savePresentationScoreAction({}, f.form(entry.id)), error => error.location === "/dashboard?denied=judge");
  assert.equal((await f.pool.query("select * from scores")).rowCount, 0);
});

integration("generated deck lookup excludes drafts and other events", async t => {
  const f = await fixture(t); const submitted = await f.entry();
  assert.equal((await f.presentations.presentationSubmission(submitted.id)).id, submitted.id);
  assert.equal(await f.presentations.presentationSubmission((await f.entry({ status: "draft" })).id), null);
  assert.equal(await f.presentations.presentationSubmission((await f.entry({ event: "another-event" })).id), null);
});

async function runCleanup(f) {
  const context = createContext({ console, process: { env: {
    APPLY_EMPTY_TEAM_REMOVAL_ID: "d31098e3-a8b7-4dcd-8b2e-c330f2b0d222",
    VERCEL: "1", VERCEL_ENV: "production", DATABASE_URL: databaseUrl,
  } } });
  const execute = async (strings, ...values) => (await f.pool.query(strings.reduce((q, part, i) => q + (i ? `$${i}` : "") + part, ""), values)).rows;
  const module = new SourceTextModule(await readFile(new URL("../scripts/remove-approved-empty-team.mjs", import.meta.url), "utf8"), { context });
  await module.link(async specifier => {
    const values = specifier.includes("serverless") ? { neon: () => execute } : { EVENT: { id: "zero-to-launch-2026" } };
    const mock = new SyntheticModule(Object.keys(values), function () { for (const [k, v] of Object.entries(values)) this.setExport(k, v); }, { context });
    await mock.link(() => {}); return mock;
  });
  await module.evaluate();
}

integration("requested empty-team deletion retains a recovery snapshot and the member's submitted team", async t => {
  const f = await fixture(t);
  const id = "d31098e3-a8b7-4dcd-8b2e-c330f2b0d222";
  await f.pool.query("insert into teams (id,name,slug,invite_code) values ($1,'Aviva Ounap','aviva-ounap','AVIVA')", [id]);
  await f.pool.query("insert into team_members (team_id,user_id) values ($1,$2)", [id, f.actor.id]);
  const kept = await f.entry({ name: "CLICKATICK" });
  await f.pool.query("insert into team_members (team_id,user_id) values ($1,$2)", [kept.teamId, f.actor.id]);
  await runCleanup(f);
  assert.equal((await f.pool.query("select * from teams where id=$1", [id])).rowCount, 0);
  assert.equal((await f.pool.query("select * from submissions where id=$1", [kept.id])).rowCount, 1);
  assert.equal((await f.pool.query("select * from team_members where team_id=$1", [kept.teamId])).rowCount, 1);
  const backup = (await f.pool.query("select meta from audit_log where action='delete-empty-team'")).rows[0].meta;
  assert.equal(backup.team.id, id); assert.equal(backup.members[0].user_id, f.actor.id);
  await runCleanup(f);
  assert.equal((await f.pool.query("select * from audit_log where action='delete-empty-team'")).rowCount, 1);
});

integration("empty-team cleanup refuses a team that now has an entry", async t => {
  const f = await fixture(t); const id = "d31098e3-a8b7-4dcd-8b2e-c330f2b0d222";
  await f.pool.query("insert into teams (id,name,slug,invite_code) values ($1,'Aviva Ounap','aviva-ounap','AVIVA')", [id]);
  await f.pool.query("insert into submissions (team_id,project,status) values ($1,'New work','submitted')", [id]);
  await assert.rejects(runCleanup(f), /has a submission/);
  assert.equal((await f.pool.query("select * from teams where id=$1", [id])).rowCount, 1);
});

integration("public directory lists every event team and exposes only submitted project content", async t => {
  const f = await fixture(t); const submitted = await f.entry({ name: "Published project" });
  const draft = await f.entry({ status: "draft", name: "Secret draft title" });
  await f.pool.query("update teams set name='Draft team' where id=$1", [draft.teamId]);
  await f.entry({ event: "another-event", name: "Other event" });
  await f.pool.query("insert into teams (name,slug,invite_code) values ('Empty team','empty-team','PRIVATE-INVITE')");
  await f.pool.query("update submissions set summary='Private draft content', receipts='Unpublished receipts' where id=$1", [draft.id]);
  const teams = await f.directory.publicTeams();
  assert.equal(teams.length, 3);
  assert.equal(teams.filter(team => team.submitted).length, 1);
  assert.ok(teams.some(team => team.project === "Published project"));
  const draftTeam = teams.find(team => team.slug === draft.teamId);
  assert.equal(draftTeam.project, null); assert.equal(draftTeam.summary, null); assert.equal(draftTeam.receipts, null);
  assert.equal(teams.find(team => team.slug === "empty-team").submitted, false);
  const serialized = JSON.stringify(teams);
  for (const privateField of ["PRIVATE-INVITE", "Private draft content", "Unpublished receipts", "Secret draft title", "Other event", "judge_id", "notes", "email", "invite_code"])
    assert.ok(!serialized.includes(privateField), privateField);
  assert.equal((await f.directory.publicTeam(submitted.teamId)).project, "Published project");
  assert.equal(await f.directory.publicTeam("missing-team"), null);
});

integration("public team pages respect member profile visibility and omit contact details", async t => {
  const f = await fixture(t); const entry = await f.entry();
  await f.pool.query("update users set name='Visible builder',onboarded_at=now(),phone='555-private',public_profile=true where id=$1", [f.actor.id]);
  const privateId = randomUUID();
  await f.pool.query("insert into users (id,email,name,public_profile,onboarded_at) values ($1,'private@example.invalid','Private builder',false,now())", [privateId]);
  await f.pool.query("insert into team_members (team_id,user_id) values ($1,$2),($1,$3)", [entry.teamId, f.actor.id, privateId]);
  const team = await f.directory.publicTeam(entry.teamId);
  assert.equal(team.member_count, 2);
  assert.equal(team.members.length, 1); assert.equal(team.members[0].name, "Visible builder");
  const serialized = JSON.stringify(team);
  for (const text of ["Private builder", "555-private", "@example.invalid", "phone", "user_id"]) assert.ok(!serialized.includes(text), text);
  assert.equal(f.directory.publicTeamPath(team), `/programs/zero-to-launch/hackathon/teams/${team.slug}`);
});
