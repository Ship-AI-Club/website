/* ------------------------------------------------------------------
   Pull the Zero to Launch skill files in from the planning repo.

   The site repo is deployed on its own, so the skills have to be
   vendored into content/skills/ rather than read across directories at
   build time. Source of truth stays the template repo; run this
   whenever a SKILL.md changes there.

     node scripts/sync-skills.mjs

   Only works on a machine that has the planning repo checked out
   alongside the site; it is not part of the Vercel build.
------------------------------------------------------------------ */

import { cpSync, existsSync, rmSync, readdirSync } from "node:fs";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const root = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const src = resolve(root, "../events/zero-to-launch/template-repo/.claude/skills");
const dest = resolve(root, "content/skills");

if (!existsSync(src)) {
  console.error(`No skill source at ${src} — nothing to sync.`);
  process.exit(1);
}

rmSync(dest, { recursive: true, force: true });
cpSync(src, dest, { recursive: true });

console.log(`Synced ${readdirSync(dest).length} skills → content/skills`);
