/* ------------------------------------------------------------------
   Cross-reference validator: skills catalog ↔ session arrays ↔ guides
   ↔ decks ↔ built kits. Catches what build-kits' own assertions miss:
   guide steps invoking skills that aren't in that session's bundle,
   deck terminals referencing unknown skills, stale zip contents, and
   unsubstituted {BUNDLE} placeholders in the guide downloads.

     node scripts/validate-kits.mjs   (run from the site root,
                                       after scripts/build-kits.mjs)
------------------------------------------------------------------ */
import { readFileSync, readdirSync, existsSync } from "node:fs";
import { execSync } from "node:child_process";
import { PROGRAMS } from "../lib/programs.js";
import { GUIDES_BY_PROGRAM, SETUP, setupFor } from "../lib/guides.js";
import { DECKS_BY_PROGRAM } from "../lib/decks.js";

let errors = [], warns = [];

// 1. catalog: frontmatter name == dirname, description present
const catalog = new Set();
for (const dir of readdirSync("content/skills", { withFileTypes: true })) {
  if (!dir.isDirectory()) continue;
  const md = readFileSync(`content/skills/${dir.name}/SKILL.md`, "utf8");
  const name = md.match(/^name:\s*(.+)$/m)?.[1]?.trim();
  const desc = md.match(/^description:\s*(.+)$/m)?.[1]?.trim();
  if (name !== dir.name) errors.push(`catalog: ${dir.name} frontmatter name is "${name}"`);
  if (!desc) errors.push(`catalog: ${dir.name} missing description`);
  catalog.add(dir.name);
}

// 2. session arrays reference real skills
for (const p of PROGRAMS) for (const w of p.sessions) for (const s of w.skills || [])
  if (!catalog.has(s)) errors.push(`${p.slug}/${w.slug}: skills array references missing skill "${s}"`);

// 3. guides: every /command in a step's run resolves to a skill in THAT session's bundle
const cmdRe = /(?:^|\s)\/([a-z0-9-]+)/g;  // whitespace-anchored: skips npm scopes like @anthropic-ai/claude-code
for (const p of PROGRAMS) {
  const guides = GUIDES_BY_PROGRAM[p.slug] || {};
  for (const [slug, g] of Object.entries(guides)) {
    const w = p.sessions.find((x) => x.slug === slug);
    if (!w) { errors.push(`${p.slug}: guide "${slug}" has no matching session`); continue; }
    const bundle = new Set(w.skills || []);
    for (const step of g.steps) {
      for (const m of (step.run || "").matchAll(cmdRe)) {
        const name = m[1];
        if (!catalog.has(name)) { errors.push(`${p.slug}/${slug} guide step "${step.t}": /${name} is not a catalog skill`); continue; }
        if (!bundle.has(name)) errors.push(`${p.slug}/${slug} guide step "${step.t}": /${name} not in that session's bundle [${[...bundle]}]`);
      }
    }
    // setupFor sanity: ask-santos step only when bundled somewhere in program
    const setup = setupFor(p);
    const asksAskSantos = setup.steps.some((s) => /ask-santos/.test(s.c || "") || /ask-santos/.test(s.t || ""));
    const hasAskSantos = p.sessions.some((x) => (x.skills || []).includes("ask-santos"));
    if (asksAskSantos && !hasAskSantos) errors.push(`${p.slug}: setupFor still mentions ask-santos but no session bundles it`);
  }
  // sessions without guides
  for (const w of p.sessions) if (!guides[w.slug]) warns.push(`${p.slug}/${w.slug}: no guide`);
}

// 4. decks: terminal slides reference skills; check membership in session bundle
for (const p of PROGRAMS) {
  const decks = DECKS_BY_PROGRAM[p.slug] || {};
  for (const [slug, slides] of Object.entries(decks)) {
    const w = p.sessions.find((x) => x.slug === slug);
    const bundle = new Set(w?.skills || []);
    for (const slide of slides) {
      if (slide.kind !== "terminal") continue;
      for (const m of (slide.cmd || "").matchAll(cmdRe)) {
        const name = m[1];
        if (!catalog.has(name)) errors.push(`${p.slug}/${slug} deck terminal "/${name}": not a catalog skill`);
        else if (!bundle.has(name)) warns.push(`${p.slug}/${slug} deck terminal "/${name}": not in session bundle`);
      }
    }
  }
}

// 5. built kits: manifest ↔ zips ↔ guide downloads
const registry = JSON.parse(readFileSync("lib/skills.generated.json", "utf8"));
for (const [pslug, pm] of Object.entries(registry.manifest.programs)) {
  if (pm.all && !existsSync(`public/skills/${pm.all.file}`)) errors.push(`${pslug}: missing all-zip ${pm.all.file}`);
  for (const [slug, sm] of Object.entries(pm.sessions)) {
    if (!existsSync(`public/skills/${sm.file}`)) { errors.push(`${pslug}/${slug}: missing zip ${sm.file}`); continue; }
    const listing = execSync(`unzip -l public/skills/${sm.file}`, { encoding: "utf8" });
    const p = PROGRAMS.find((x) => x.slug === pslug);
    const w = p.sessions.find((x) => x.slug === slug);
    for (const s of w.skills || [])
      if (!listing.includes(`.claude/skills/${s}/SKILL.md`)) errors.push(`${pslug}/${slug}: zip ${sm.file} missing skill ${s}`);
    if (sm.count !== (w.skills || []).length) errors.push(`${pslug}/${slug}: manifest count ${sm.count} != session skills ${(w.skills || []).length}`);
    if (sm.guide) {
      if (!existsSync(`public/guides/${sm.guide}`)) errors.push(`${pslug}/${slug}: missing guide download ${sm.guide}`);
      else {
        const gmd = readFileSync(`public/guides/${sm.guide}`, "utf8");
        const g = GUIDES_BY_PROGRAM[pslug][slug];
        for (const step of g.steps) if (!gmd.includes(step.t)) errors.push(`${pslug}/${slug}: guide download missing step "${step.t}"`);
        if (gmd.includes("{BUNDLE}")) errors.push(`${pslug}/${slug}: guide download has unsubstituted {BUNDLE}`);
      }
    }
  }
}

console.log(`catalog: ${catalog.size} skills`);
console.log(`ERRORS (${errors.length}):`); errors.forEach((e) => console.log("  ✗", e));
console.log(`WARNINGS (${warns.length}):`); warns.forEach((w) => console.log("  ~", w));
process.exit(errors.length ? 1 : 0);
