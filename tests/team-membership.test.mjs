// Optional integration suite against an isolated local PostgreSQL database:
// TEAM_TEST_DATABASE_URL=postgres://localhost:55439/postgres \
// TEAM_TEST_PG_PATH=/absolute/path/to/pg/lib/index.js \
// node --experimental-vm-modules --test tests/team-membership.test.mjs
import test from "node:test";
import assert from "node:assert/strict";
import { randomUUID } from "node:crypto";
import * as crypto from "node:crypto";
import { readFile } from "node:fs/promises";
import { createRequire } from "node:module";
import { SourceTextModule, SyntheticModule, createContext } from "node:vm";

const databaseUrl = process.env.TEAM_TEST_DATABASE_URL;
const integration = (name, fn) => test(name, { skip: !databaseUrl }, fn);

async function fixture(t) {
  const url = new URL(databaseUrl);
  assert.ok(["localhost", "127.0.0.1"].includes(url.hostname), "Team integration tests require a local database");
  const require = createRequire(import.meta.url);
  const { Pool } = require(process.env.TEAM_TEST_PG_PATH || "pg");
  const root = new Pool({ connectionString: databaseUrl });
  const schema = `team_test_${randomUUID().replaceAll("-", "")}`;
  await root.query(`create schema ${schema}`);
  const pool = new Pool({ connectionString: databaseUrl, options: `-c search_path=${schema},public` });
  t.after(async () => { await pool.end(); await root.query(`drop schema ${schema} cascade`); await root.end(); });
  const source = await readFile(new URL("../lib/schema.sql", import.meta.url), "utf8");
  await pool.query(source);
  const execute = async (query, client = pool) => (await client.query(query.text, query.values)).rows;
  const sql = (strings, ...values) => {
    const text = strings.reduce((query, part, index) => query + (index ? `$${index}` : "") + part, "");
    return { text, values, then(resolve, reject) { return execute(this).then(resolve, reject); } };
  };
  sql.transaction = async (queries) => {
    const client = await pool.connect();
    try {
      await client.query("begin isolation level read committed");
      const results = [];
      for (const query of queries) results.push(await execute(query, client));
      await client.query("commit");
      return results;
    } catch (error) { await client.query("rollback"); throw error; }
    finally { client.release(); }
  };
  const actor = { id: null };
  const context = createContext({ console, Date, URL, FormData, process: { env: {} } });
  const mail = [];
  const noMail = async value => { mail.push(value); return { ok: true, skipped: true }; };
  const mocks = {
    "server-only": {},
    "node:crypto": crypto,
    "next/cache": { revalidatePath() {} },
    "next/navigation": { redirect(location) { throw Object.assign(new Error("redirect"), { location }); } },
    "lib/auth": { requireUser: async () => actor, requireOnboarded: async () => actor },
    "lib/email": { adminNotice: noMail, roleRequestReceivedEmail: noMail, submissionReceiptEmail: noMail },
    "lib/db": { db: () => sql, sql, one: rows => rows[0] ?? null, safeRead: async (fn) => fn() },
  };
  const modules = new Map();
  async function moduleFor(id) {
    if (modules.has(id)) return modules.get(id);
    const exports = mocks[id];
    const module = exports ? new SyntheticModule(Object.keys(exports), function () {
      for (const [key, value] of Object.entries(exports)) this.setExport(key, value);
    }, { context, identifier: id }) : new SourceTextModule(
      await readFile(new URL(`../${id}.js`, import.meta.url), "utf8"), { context, identifier: id });
    modules.set(id, module);
    await module.link((specifier, parent) => moduleFor(specifier.startsWith(".")
      ? new URL(specifier, `https://test.invalid/${parent.identifier}`).pathname.slice(1).replace(/\.js$/, "") : specifier));
    return module;
  }
  async function load(id) { const module = await moduleFor(id); if (module.status !== "evaluated") await module.evaluate(); return module.namespace; }
  const membership = await load("lib/team-membership");
  const store = await load("lib/store");
  const settings = await load("lib/settings");
  const actions = await load("app/dashboard/actions");
  let serial = 0;
  async function user() {
    const id = randomUUID();
    await pool.query("insert into users (id, email, name) values ($1, $2, 'Test member')", [id, `${id}@example.invalid`]);
    return id;
  }
  async function team(userId, hackathonId) {
    const slug = `team-${++serial}`;
    return membership.createTeamMembership({ userId, name: slug, slug, inviteCode: slug.toUpperCase(), hackathonId });
  }
  const form = values => { const data = new FormData(); for (const [key, value] of Object.entries(values)) data.set(key, value); return data; };
  const redirected = promise => assert.rejects(promise, error => typeof error.location === "string");
  return { pool, source, actor, membership, store, settings, actions, user, team, form, redirected, mail };
}

integration("submission saves a partial draft, submits, reloads pitch answers, and edits without losing submitted status", async t => {
  const f = await fixture(t); const user = await f.user(); const team = await f.team(user); f.actor.id = user;
  await f.settings.setSetting("submissions_open", true);
  const draft = await f.actions.saveSubmissionAction({}, f.form({ team_id: team.id, intent: "draft", project: "Porchlight", icp: "Plant owners who travel" }));
  assert.equal(draft.status, "draft");
  const values = { team_id: team.id, intent: "submit", project: "Porchlight", live_url: "example.com", receipts: "A working quote form.",
    summary: "Plant care during your trip.", positioning: "One visit, no subscription.", icp: "Plant owners who travel", design: "A single quote button." };
  const submitted = await f.actions.saveSubmissionAction({}, f.form(values));
  assert.equal(submitted.status, "submitted");
  const saved = await f.store.submissionForTeam(team.id);
  assert.equal(saved.pitch.icp, values.icp);
  assert.equal(saved.pitch.design, values.design);
  assert.ok(saved.submitted_at);
  assert.equal(f.mail.length, 2, "one receipt and one admin notification, all intercepted locally");
  // An old tab with no pitch fields must preserve the answers and submitted state.
  const updated = await f.actions.saveSubmissionAction({}, f.form({ team_id: team.id, intent: "draft", project: "Porchlight updated", live_url: "example.com", receipts: "New evidence" }));
  assert.equal(updated.status, "submitted");
  const reloaded = await f.store.submissionForTeam(team.id);
  assert.deepEqual(reloaded.pitch, saved.pitch);
  assert.equal(reloaded.submitted_at.getTime(), saved.submitted_at.getTime());
  assert.equal(f.mail.length, 2);
});

integration("submission validation, team authorization, and deadline closure block writes", async t => {
  const f = await fixture(t); const user = await f.user(); const team = await f.team(user); f.actor.id = user;
  await f.settings.setSetting("submissions_open", true);
  assert.match((await f.actions.saveSubmissionAction({}, f.form({ team_id: team.id, intent: "submit", project: "Incomplete" }))).error, /Still needs/);
  assert.match((await f.actions.saveSubmissionAction({}, f.form({ team_id: team.id, intent: "draft", repo_url: "ftp://example.com" }))).error, /repository url/);
  f.actor.id = await f.user();
  assert.match((await f.actions.saveSubmissionAction({}, f.form({ team_id: team.id, intent: "draft", project: "Intruder" }))).error, /belong to/);
  f.actor.id = user; await f.settings.setSetting("submissions_open", false);
  assert.match((await f.actions.saveSubmissionAction({}, f.form({ team_id: team.id, intent: "submit" }))).error, /closed/);
  assert.equal(await f.store.submissionForTeam(team.id), null);
  assert.equal(f.mail.length, 0);
});

integration("deck choice and custom link persist, while every deck option remains optional for submission", async t => {
  const f = await fixture(t); const user = await f.user(); f.actor.id = user;
  await f.settings.setSetting("submissions_open", true);
  for (const mode of ["later", "custom", "generated"]) {
    const team = await f.team(user);
    const result = await f.actions.saveSubmissionAction({}, f.form({team_id:team.id,intent:"submit",project:`Deck ${mode}`,live_url:"example.com",receipts:"A working contact form",pitch_mode:mode}));
    assert.equal(result.status, "submitted", `No deck link or pitch answers needed for ${mode}`);
    assert.equal((await f.store.submissionForTeam(team.id)).pitch.mode, mode);
  }
  const team = await f.team(user);
  const values = {team_id:team.id,intent:"draft",project:"Own slides",pitch_mode:"custom",pitch_deck_url:"example.com/deck.pdf",icp:"Traveling plant owners"};
  assert.equal((await f.actions.saveSubmissionAction({}, f.form(values))).status, "draft");
  let saved = await f.store.submissionForTeam(team.id);
  assert.equal(saved.pitch.mode, "custom");
  assert.equal(saved.pitch.deck_url, "https://example.com/deck.pdf");
  // A tab from before deck selection was introduced cannot clear the choice or URL.
  await f.actions.saveSubmissionAction({}, f.form({team_id:team.id,intent:"draft",project:"Updated own slides"}));
  assert.deepEqual((await f.store.submissionForTeam(team.id)).pitch, saved.pitch);
  await f.actions.saveSubmissionAction({}, f.form({team_id:team.id,intent:"draft",project:"Prepare later",pitch_mode:"later"}));
  saved = await f.store.submissionForTeam(team.id);
  assert.equal(saved.pitch.mode, "later");
  assert.equal(saved.pitch.deck_url, "https://example.com/deck.pdf");
  assert.equal(saved.pitch.icp, values.icp);
  const bad = await f.actions.saveSubmissionAction({}, f.form({...values,pitch_deck_url:"javascript:alert(1)"}));
  assert.match(bad.error, /your deck url/);
  assert.equal((await f.store.submissionForTeam(team.id)).pitch.mode, "later", "invalid links do not write");
});

integration("simultaneous draft and final saves cannot demote a submitted entry", async t => {
  const f = await fixture(t); const user = await f.user(); const team = await f.team(user); f.actor.id = user;
  await f.settings.setSetting("submissions_open", true);
  const values = { team_id: team.id, project: "Race test", live_url: "example.com", receipts: "Working pages" };
  await Promise.all(Array.from({ length: 6 }, (_, index) => f.actions.saveSubmissionAction({}, f.form({ ...values, intent: index % 2 ? "draft" : "submit" }))));
  assert.equal((await f.store.submissionForTeam(team.id)).status, "submitted");
});

integration("first pitch save upgrades the old submissions table without replacing entries", async t => {
  const f = await fixture(t); const user = await f.user(); const team = await f.team(user); f.actor.id = user;
  await f.settings.setSetting("submissions_open", true);
  await f.pool.query("insert into submissions(team_id,project,status) values($1,'Existing entry','draft')", [team.id]);
  await f.pool.query("alter table submissions drop column pitch");
  const result = await f.actions.saveSubmissionAction({}, f.form({ team_id: team.id, project: "Existing entry", intent: "draft", icp: "Local customers" }));
  assert.equal(result.status, "draft");
  assert.equal((await f.store.submissionForTeam(team.id)).pitch.icp, "Local customers");
  assert.equal((await f.pool.query("select count(*)::int as count from submissions")).rows[0].count, 1);
});

integration("migration preserves old teams and replaces the global unique membership index", async t => {
  const f = await fixture(t); const user = await f.user(); const team = await f.team(user);
  await f.pool.query("alter table teams drop column hackathon_id cascade; create unique index team_members_one_per_person on team_members(user_id)");
  await f.pool.query(f.source);
  await f.pool.query(f.source);
  assert.equal((await f.store.teamsFor(user))[0].id, team.id);
  assert.equal((await f.pool.query("select 1 from pg_indexes where schemaname = current_schema() and indexname = 'team_members_one_per_person'")).rowCount, 0);
  assert.ok(await f.team(user));
});

integration("Ship AI allows multiple teams by default and duplicate joins remain idempotent", async t => {
  const f = await fixture(t); const user = await f.user();
  const a = await f.team(user); const b = await f.team(user);
  assert.notEqual(a.id, b.id);
  assert.equal((await f.settings.allSettings()).multiple_teams_allowed, true);
  const owner = await f.user(); const c = await f.team(owner);
  const { invite_code: code } = (await f.pool.query("select invite_code from teams where id=$1", [c.id])).rows[0];
  assert.equal((await f.membership.joinTeamMembership({ userId: user, code })).result, "joined");
  assert.equal((await f.membership.joinTeamMembership({ userId: user, code })).result, "joined");
  assert.equal((await f.store.teamsFor(user)).length, 3);
  assert.equal((await f.store.teamFor(user, b.id)).id, b.id);
  assert.equal(await f.store.teamFor(user, randomUUID()), null);
});

integration("disabling multiple teams preserves memberships, blocks create and join, and can be reversed", async t => {
  const f = await fixture(t); const user = await f.user();
  await f.team(user); await f.team(user);
  const destination = await f.team(await f.user());
  const { invite_code: code } = (await f.pool.query("select invite_code from teams where id=$1", [destination.id])).rows[0];
  await f.settings.setSetting("multiple_teams_allowed", false);
  assert.equal(await f.team(user), null);
  assert.equal((await f.membership.joinTeamMembership({ userId: user, code })).result, "single_team");
  assert.equal((await f.store.teamsFor(user)).length, 2);
  assert.equal((await f.pool.query("select count(*)::int as n from teams")).rows[0].n, 3);
  await f.settings.setSetting("multiple_teams_allowed", true);
  assert.ok(await f.team(user));
});

integration("future hackathons default to one team and their policy is independent", async t => {
  const f = await fixture(t); const user = await f.user();
  await f.team(user);
  assert.ok(await f.team(user, "future-hackathon"));
  assert.equal(await f.team(user, "future-hackathon"), null);
  await f.pool.query("insert into settings(key,value) values ('hackathon:future-hackathon:multiple_teams_allowed','true')");
  assert.ok(await f.team(user, "future-hackathon"));
  assert.equal((await f.store.teamsFor(user)).length, 1);
  const future = (await f.pool.query("select invite_code from teams where hackathon_id='future-hackathon' limit 1")).rows[0];
  assert.equal(await f.membership.joinTeamMembership({ userId: await f.user(), code: future.invite_code }), null);
});

integration("simultaneous requests cannot bypass single-team mode or the four-person cap", async t => {
  const f = await fixture(t); const user = await f.user();
  await f.settings.setSetting("multiple_teams_allowed", false);
  const created = await Promise.all([f.team(user), f.team(user)]);
  assert.equal(created.filter(Boolean).length, 1);
  await f.settings.setSetting("multiple_teams_allowed", true);
  const destination = created.find(Boolean);
  const { invite_code: code } = (await f.pool.query("select invite_code from teams where id=$1", [destination.id])).rows[0];
  const users = await Promise.all(Array.from({ length: 8 }, () => f.user()));
  const joins = await Promise.all(users.map(userId => f.membership.joinTeamMembership({ userId, code })));
  assert.equal(joins.filter(row => row.result === "joined").length, 3);
  assert.equal(joins.filter(row => row.result === "full").length, 5);
  assert.equal((await f.store.teamMembers(destination.id)).length, 4);
});

integration("rename, remove, invite regeneration, and leave affect only the selected owned team", async t => {
  const f = await fixture(t); f.actor.id = await f.user();
  const a = await f.team(f.actor.id); const b = await f.team(f.actor.id); const member = await f.user();
  await f.pool.query("insert into team_members(team_id,user_id) values ($1,$3),($2,$3)", [a.id, b.id, member]);
  assert.ok((await f.actions.updateTeamAction({}, f.form({ team_id: b.id, name: "Renamed" }))).ok);
  assert.notEqual((await f.store.teamFor(f.actor.id, a.id)).name, "Renamed");
  assert.equal((await f.store.teamFor(f.actor.id, b.id)).name, "Renamed");
  const code = (await f.store.teamFor(f.actor.id, a.id)).invite_code;
  await f.actions.regenerateInviteAction(f.form({ team_id: b.id }));
  assert.equal((await f.store.teamFor(f.actor.id, a.id)).invite_code, code);
  assert.ok((await f.actions.removeMemberAction({}, f.form({ team_id: b.id, member_id: member }))).ok);
  assert.equal((await f.store.teamMembers(a.id)).length, 2);
  assert.equal((await f.store.teamMembers(b.id)).length, 1);
  await f.redirected(f.actions.leaveTeamAction(f.form({ team_id: a.id })));
  assert.equal((await f.store.teamsFor(f.actor.id)).length, 1);
  assert.equal((await f.store.teamMembers(a.id))[0].is_owner, true);
  assert.equal((await f.store.teamFor(f.actor.id, b.id)).id, b.id);
});

integration("non-owners and forged team IDs cannot change another team or its submission", async t => {
  const f = await fixture(t); const owner = await f.user(); const team = await f.team(owner);
  f.actor.id = await f.user(); await f.team(f.actor.id);
  const before = (await f.store.teamFor(owner, team.id));
  assert.ok((await f.actions.updateTeamAction({}, f.form({ team_id: team.id, name: "Forged" }))).error);
  assert.ok((await f.actions.removeMemberAction({}, f.form({ team_id: team.id, member_id: owner }))).error);
  await f.actions.regenerateInviteAction(f.form({ team_id: team.id }));
  await f.actions.leaveTeamAction(f.form({ team_id: team.id }));
  assert.ok((await f.actions.saveSubmissionAction({}, f.form({ team_id: team.id, project: "Forged" }))).error);
  assert.ok((await f.actions.saveSubmissionAction({}, f.form({ project: "No selection" }))).error);
  const after = await f.store.teamFor(owner, team.id);
  assert.equal(after.name, before.name); assert.equal(after.invite_code, before.invite_code);
  assert.equal(after.members.length, 1);
  await f.pool.query("insert into team_members(team_id,user_id) values ($1,$2)", [team.id, f.actor.id]);
  assert.ok((await f.actions.updateTeamAction({}, f.form({ team_id: team.id, name: "Still forged" }))).error);
});

integration("submissions save to the selected membership and admin users are not duplicated", async t => {
  const f = await fixture(t); f.actor.id = await f.user();
  const a = await f.team(f.actor.id); const b = await f.team(f.actor.id);
  await f.settings.setSetting("submissions_open", true);
  await f.actions.saveSubmissionAction({}, f.form({ team_id: a.id, project: "Project A", intent: "draft" }));
  await f.actions.saveSubmissionAction({}, f.form({ team_id: b.id, project: "Project B", intent: "draft" }));
  assert.equal((await f.store.submissionForTeam(a.id)).project, "Project A");
  assert.equal((await f.store.submissionForTeam(b.id)).project, "Project B");
  const users = await f.store.listUsers();
  assert.equal(users.length, 1);
  assert.ok(users[0].team_name.includes("team-1")); assert.ok(users[0].team_name.includes("team-2"));
});
