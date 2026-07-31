/* ------------------------------------------------------------------
   Push the site's skill catalog out to the planning repo's template
   mirror.

   Direction matters: content/skills/ in THIS repo is the source of
   truth — the Day Zero skills and every QA fix live here first. The
   template-repo mirror under events/zero-to-launch/ is a downstream
   copy for publishing to GitHub. (This script used to pull the other
   way; that direction now destroys newer work. Don't flip it back.)

     node scripts/sync-skills.mjs

   Only works on a machine that has the planning repo checked out
   alongside the site; it is not part of the Vercel build.
------------------------------------------------------------------ */

import { cpSync, existsSync, rmSync, readdirSync } from "node:fs";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const root = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const src = resolve(root, "content/skills");
const dest = resolve(root, "../events/zero-to-launch/template-repo/.claude/skills");

if (!existsSync(resolve(dest, ".."))) {
  console.error(`No template-repo mirror at ${dirname(dest)} — nothing to sync to.`);
  process.exit(1);
}

rmSync(dest, { recursive: true, force: true });
cpSync(src, dest, { recursive: true });

console.log(`Synced ${readdirSync(dest).length} skills → template-repo mirror`);
