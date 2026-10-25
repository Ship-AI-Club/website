// node --experimental-vm-modules --test tests/auth.test.mjs
import test from "node:test";
import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import { SourceTextModule, SyntheticModule, createContext } from "node:vm";
import * as crypto from "node:crypto";
import * as nav from "../lib/nav.js";

const secret = "isolated-auth-regression-secret";
const code = "012345";
const token = "invented-test-token";
const hash = value => crypto.createHash("sha256").update(`${secret}:${value}`).digest("hex");

async function fixture({ expired = false } = {}) {
  const state = { consumed: false, attempts: 0, sessions: [], invites: 0, queries: [] };
  const user = { id: "fixture-user", email: "visitor@example.invalid", onboarded_at: null };
  const row = { id: "fixture-code", email: user.email, code_hash: hash(code), attempts: 0 };
  const cookieStore = new Map();
  const sql = async (strings, ...values) => {
    const query = strings.join("?").replace(/\s+/g, " ").trim();
    state.queries.push(query);
    if (query.startsWith("select * from login_codes")) {
      return !state.consumed && !expired && values[0] === user.email
        ? [{ ...row, attempts: state.attempts }] : [];
    }
    if (query.startsWith("update login_codes set consumed_at") && query.includes("token_hash")) {
      if (values[0] !== hash(token) || state.consumed || expired) return [];
      state.consumed = true;
      return [{ email: user.email }];
    }
    if (query.startsWith("update login_codes set consumed_at")) { state.consumed = true; return []; }
    if (query.startsWith("update login_codes set attempts")) { state.attempts++; return []; }
    if (query.startsWith("select * from users")) return [user];
    if (query.startsWith("update users set last_seen_at")) return [];
    if (query.startsWith("insert into sessions")) { state.sessions.push(values); return []; }
    throw new Error(`Unexpected auth query: ${query}`);
  };
  const context = createContext({ Buffer, URL, URLSearchParams, console,
    process: { env: { AUTH_SECRET: secret, NODE_ENV: "test" } } });
  const mocks = {
    "server-only": {},
    "node:crypto": crypto,
    react: { cache: fn => fn },
    "next/headers": { cookies: async () => ({
      get: name => cookieStore.has(name) ? { value: cookieStore.get(name) } : undefined,
      set: (name, value) => cookieStore.set(name, value),
    }), headers: async () => new Headers({ "user-agent": "Auth regression test" }) },
    "next/navigation": { redirect: location => { throw Object.assign(new Error("redirect"), { location }); } },
    "next/server": { NextResponse: { redirect: url => new Response(null, { status: 307, headers: { Location: String(url) } }) } },
    "lib/db": { sql, one: rows => rows[0] || null, hasDb: () => true },
    "lib/nav": nav,
    "lib/accounts": { normalizeEmail: v => String(v || "").trim().toLowerCase(),
      text: (v, limit) => String(v || "").trim().slice(0, limit), LIMITS: {} },
    "lib/email": { loginCodeEmail: () => { throw new Error("Test must never send email"); },
      mailConfigured: () => false, SITE: "https://example.invalid" },
    "lib/invites": { redeemPendingInvite: async () => { state.invites++; } },
  };
  const modules = new Map();
  async function moduleFor(id) {
    if (modules.has(id)) return modules.get(id);
    let module;
    if (id in mocks) {
      const exports = mocks[id];
      module = new SyntheticModule(Object.keys(exports), function () {
        for (const [key, value] of Object.entries(exports)) this.setExport(key, value);
      }, { context, identifier: id });
    } else {
      const source = await readFile(new URL(`../${id}.js`, import.meta.url), "utf8");
      module = new SourceTextModule(source, { context, identifier: id });
    }
    modules.set(id, module);
    await module.link(async (specifier, parent) => {
      const target = specifier.startsWith(".")
        ? new URL(specifier, `https://fixture.invalid/${parent.identifier}`).pathname.slice(1).replace(/\.js$/, "")
        : specifier;
      return moduleFor(target);
    });
    return module;
  }
  async function load(id) {
    const module = await moduleFor(id);
    if (module.status !== "evaluated") await module.evaluate();
    return module.namespace;
  }
  return { state, user, load, cookieStore };
}

test("scanning an email link repeatedly leaves the six-digit code usable", async () => {
  const f = await fixture();
  const { GET } = await f.load("app/auth/verify/route");
  for (let i = 0; i < 3; i++) {
    const response = await GET(new Request(`https://example.invalid/auth/verify?token=${token}&next=/workshops/materials`));
    const destination = new URL(response.headers.get("location"));
    assert.equal(destination.pathname, "/auth/confirm");
    assert.equal(destination.searchParams.get("token"), token);
    assert.equal(destination.searchParams.get("next"), "/workshops/materials");
    assert.match(response.headers.get("cache-control"), /no-store/);
    assert.equal(response.headers.get("referrer-policy"), "no-referrer");
  }
  assert.equal(f.state.queries.length, 0, "GET must not touch login codes or create sessions");
  const { verifyLoginCode } = await f.load("lib/auth");
  const result = await verifyLoginCode(f.user.email, code);
  assert.equal(result.user.email, f.user.email);
  assert.equal(f.state.sessions.length, 1);
  assert.ok(f.cookieStore.has("shipai_session"));
});

test("the confirmation POST creates a session, redeems invites and preserves the return path", async () => {
  const f = await fixture();
  const { confirmSignInAction } = await f.load("app/auth/confirm/actions");
  const form = new FormData();
  form.set("token", token);
  form.set("next", "/workshops/materials");
  await assert.rejects(confirmSignInAction(form), error => error.location === "/workshops/materials");
  assert.equal(f.state.sessions.length, 1);
  assert.equal(f.state.invites, 1);
  await assert.rejects(confirmSignInAction(form), error => error.location?.startsWith("/login?error="));
  assert.equal(f.state.sessions.length, 1, "a repeated confirmation must not mint another session");
});

test("expired or invalid tokens cannot create a session", async () => {
  for (const expired of [false, true]) {
    const f = await fixture({ expired });
    const { verifyLoginToken } = await f.load("lib/auth");
    const result = await verifyLoginToken(expired ? token : "wrong-token");
    assert.match(result.error, /expired or was already used/);
    assert.equal(f.state.sessions.length, 0);
    assert.equal(f.state.consumed, false);
  }
});

test("concurrent confirmations can claim the token only once", async () => {
  const f = await fixture();
  const { verifyLoginToken } = await f.load("lib/auth");
  const results = await Promise.all([verifyLoginToken(token), verifyLoginToken(token)]);
  assert.equal(results.filter(result => result.user).length, 1);
  assert.equal(results.filter(result => result.error).length, 1);
  assert.equal(f.state.sessions.length, 1);
});

test("a confirmation cannot redirect to another site", async () => {
  const f = await fixture();
  const { GET } = await f.load("app/auth/verify/route");
  const response = await GET(new Request(`https://example.invalid/auth/verify?token=${token}&next=https://other.invalid`));
  assert.equal(new URL(response.headers.get("location")).searchParams.get("next"), "/dashboard");
  const { confirmSignInAction } = await f.load("app/auth/confirm/actions");
  const form = new FormData();
  form.set("token", token);
  form.set("next", "//other.invalid");
  await assert.rejects(confirmSignInAction(form), error => error.location === "/dashboard");
});
