/* ------------------------------------------------------------------
   Build the downloadable half of the session kits.

   Reads the vendored skill files and the guide data, then writes:

     public/skills/<name>/SKILL.md              raw, viewable, linkable
     public/skills/zero-to-launch.zip           all of them
     public/skills/zero-to-launch-<n>-<slug>.zip  one session's set
     public/guides/zero-to-launch-<n>-<slug>.md   the follow-along guide
     lib/skills.generated.json                  registry the site renders from
     lib/qr.generated.json                      QR matrices for the decks

   Runs as prebuild, so the downloads can never drift from the skill
   files the site is describing. Deterministic — an unchanged input
   produces byte-identical output.
------------------------------------------------------------------ */

import { mkdirSync, readFileSync, readdirSync, rmSync, writeFileSync } from "node:fs";
import { dirname, join, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import QRCode from "qrcode";
import { zip } from "./zip.mjs";
import { WORKSHOPS, TEMPLATE_REPO, DISCORD } from "../lib/hackathon.js";
import { GUIDES, SETUP } from "../lib/guides.js";

const root = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const skillsSrc = join(root, "content/skills");
const skillsOut = join(root, "public/skills");
const guidesOut = join(root, "public/guides");

const SITE = "https://www.shipai.club";

/* ---------- read the skills ---------- */

function parseSkill(name) {
  const raw = readFileSync(join(skillsSrc, name, "SKILL.md"), "utf8");
  const match = raw.match(/^---\n([\s\S]*?)\n---\n/);
  if (!match) throw new Error(`${name}/SKILL.md has no frontmatter`);
  const fm = Object.fromEntries(
    match[1]
      .split("\n")
      .filter((l) => /^\w[\w-]*:/.test(l))
      .map((l) => {
        const i = l.indexOf(":");
        return [l.slice(0, i).trim(), l.slice(i + 1).trim().replace(/^["']|["']$/g, "")];
      })
  );
  if (fm.name !== name) {
    throw new Error(`${name}/SKILL.md declares name "${fm.name}" — directory and name must match`);
  }
  return {
    name,
    description: fm.description,
    /* the instructions, minus frontmatter — rendered as the skill's body on the site */
    body: raw.slice(match[0].length).trim(),
    raw,
  };
}

const names = readdirSync(skillsSrc, { withFileTypes: true })
  .filter((d) => d.isDirectory())
  .map((d) => d.name)
  .sort();

const skills = new Map(names.map((n) => [n, parseSkill(n)]));

/* Which sessions use each skill — several are shared across two. */
for (const w of WORKSHOPS) {
  for (const s of w.skills || []) {
    const skill = skills.get(s);
    if (!skill) throw new Error(`Session ${w.n} lists "${s}", which has no skill file`);
    (skill.sessions ||= []).push({ n: w.n, slug: w.slug, title: w.eventTitle });
  }
}

const orphans = [...skills.values()].filter((s) => !s.sessions);
if (orphans.length) {
  console.warn(`  note: not tied to a session — ${orphans.map((s) => s.name).join(", ")}`);
}

/* ---------- install README, shipped inside every bundle ---------- */

function readme(label, list) {
  return `# Zero to Launch — ${label}

${list.length} skill${list.length === 1 ? "" : "s"} for Claude Code, the Codex extension, or
anything else that reads a skills directory.

## Install

Unzip at the root of your project. It writes into \`.claude/skills/\` and
touches nothing else.

    unzip -o <this-file>.zip -d .

Then start your agent from that directory and run the skill by name, e.g.
\`/${list[0].name}\`.

## What's in here

${list.map((s) => `- **/${s.name}** — ${s.description}`).join("\n")}

## Everything else

Guides, slides and the rest of the program: ${SITE}/hackathon/workshops
Template repo: ${TEMPLATE_REPO}
Discord: ${DISCORD}

Free to take and run, during the program or years from now.

— Ship AI, Phoenix AZ
`;
}

function bundle(label, list) {
  return zip([
    { name: "README.md", data: readme(label, list) },
    ...list.map((s) => ({ name: `.claude/skills/${s.name}/SKILL.md`, data: s.raw })),
  ]);
}

/* ---------- guide markdown ---------- */

function guideMarkdown(w) {
  const g = GUIDES[w.slug];
  if (!g) return null;
  const url = `${SITE}/hackathon/workshops/${w.slug}`;
  const lines = [
    `# ${w.eventTitle} — follow-along guide`,
    "",
    `Zero to Launch, session ${w.n} · ${w.date}, 2026 · ${g.minutes}`,
    "",
    g.lede,
    "",
    `## ${SETUP.title}`,
    "",
    SETUP.note,
    "",
    ...SETUP.steps.flatMap((s) => [
      `**${s.t}.** ${s.c}`,
      ...(s.run
        ? ["", "    " + s.run.replace("{BUNDLE}", `zero-to-launch-${w.n}-${w.slug}.zip`)]
        : []),
      "",
    ]),
    "## The steps",
    "",
  ];

  g.steps.forEach((s, i) => {
    lines.push(`### ${String(i + 1).padStart(2, "0")}. ${s.t}`, "");
    if (s.run) lines.push("`" + s.run + "`", "");
    lines.push(s.c, "");
    if (s.good) lines.push(`*Done looks like:* ${s.good}`, "");
  });

  lines.push(
    "## What you leave with",
    "",
    g.output,
    "",
    "## If you get stuck",
    "",
    g.stuck,
    "",
    "---",
    "",
    `Slides, skill downloads and the full session page: ${url}`,
    `Discord: ${DISCORD}`,
    "",
    "© 2026 Ship AI — free to take and run.",
    ""
  );

  return lines.join("\n");
}

/* ---------- write ---------- */

rmSync(skillsOut, { recursive: true, force: true });
rmSync(guidesOut, { recursive: true, force: true });
mkdirSync(skillsOut, { recursive: true });
mkdirSync(guidesOut, { recursive: true });

for (const s of skills.values()) {
  mkdirSync(join(skillsOut, s.name), { recursive: true });
  writeFileSync(join(skillsOut, s.name, "SKILL.md"), s.raw);
}

const all = [...skills.values()];
writeFileSync(join(skillsOut, "zero-to-launch.zip"), bundle("the full set", all));

const manifest = { all: { file: "zero-to-launch.zip", count: all.length }, sessions: {} };

for (const w of WORKSHOPS) {
  const list = (w.skills || []).map((n) => skills.get(n));
  if (!list.length) continue;
  const file = `zero-to-launch-${w.n}-${w.slug}.zip`;
  writeFileSync(join(skillsOut, file), bundle(`session ${w.n}, ${w.eventTitle}`, list));
  manifest.sessions[w.slug] = { file, count: list.length };

  const md = guideMarkdown(w);
  if (md) {
    const gf = `zero-to-launch-${w.n}-${w.slug}.md`;
    writeFileSync(join(guidesOut, gf), md);
    manifest.sessions[w.slug].guide = gf;
  }
}

writeFileSync(
  join(root, "lib/skills.generated.json"),
  JSON.stringify(
    {
      skills: all.map(({ raw, ...rest }) => rest),
      manifest,
    },
    null,
    2
  ) + "\n"
);

/* ---------- QR codes for the decks ---------- */

/* Encoded here rather than at runtime: a deck is projected in a room
   whose wifi you don't control, and it also has to work from a PDF.
   Modules are emitted as a single path — a few hundred <rect>s would be
   a lot of DOM for a slide that never changes. */
async function qr(text) {
  const { modules } = await QRCode.create(text, { errorCorrectionLevel: "M" });
  const { size, data } = modules;
  let path = "";
  for (let y = 0; y < size; y++) {
    for (let x = 0; x < size; x++) {
      if (data[y * size + x]) path += `M${x} ${y}h1v1h-1z`;
    }
  }
  return { size, path };
}

const qrTargets = {
  discord: DISCORD,
  skills: `${SITE}/hackathon/skills`,
  workshops: `${SITE}/hackathon/workshops`,
  repo: TEMPLATE_REPO,
  ...Object.fromEntries(
    WORKSHOPS.map((w) => [`session-${w.slug}`, `${SITE}/hackathon/workshops/${w.slug}`])
  ),
};

const codes = {};
for (const [key, url] of Object.entries(qrTargets)) {
  codes[key] = { ...(await qr(url)), url };
}

writeFileSync(join(root, "lib/qr.generated.json"), JSON.stringify(codes, null, 2) + "\n");

console.log(
  `Kits built — ${all.length} skills, ${Object.keys(manifest.sessions).length} session bundles, ` +
    `${readdirSync(guidesOut).length} guides, ${Object.keys(codes).length} QR codes.`
);
