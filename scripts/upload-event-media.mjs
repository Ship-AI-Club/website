#!/usr/bin/env node
/* ------------------------------------------------------------------
   Upload event media (photos, recordings) to the public Vercel Blob
   store, filed under the session:

     node --env-file-if-exists=.env.local scripts/upload-event-media.mjs <session-slug> <file...>

   Photos land at events/<slug>/<basename>; anything video-shaped
   uploads multipart (the store takes files far bigger than a build
   artifact should ever be). Prints the public URLs plus a paste-ready
   `media` snippet for the session's entry in lib/hackathon.js.

   Convert HEIC first — blob serves what you give it:
     sips -s format jpeg -s formatOptions 82 --resampleHeightWidthMax 2400 in.HEIC --out out.jpg
------------------------------------------------------------------ */

import { createReadStream, statSync } from "node:fs";
import { basename, extname } from "node:path";
import { put } from "@vercel/blob";

const [slug, ...files] = process.argv.slice(2);
if (!slug || files.length === 0) {
  console.error("usage: upload-event-media.mjs <session-slug> <file...>");
  process.exit(1);
}
if (!process.env.BLOB_READ_WRITE_TOKEN) {
  console.error("BLOB_READ_WRITE_TOKEN is not set. Run with --env-file-if-exists=.env.local");
  process.exit(1);
}

const VIDEO = new Set([".mp4", ".mov", ".webm", ".m4v"]);
const photos = [];
let recording = null;

for (const file of files) {
  const name = basename(file);
  const ext = extname(name).toLowerCase();
  const isVideo = VIDEO.has(ext);
  const mb = (statSync(file).size / 1024 / 1024).toFixed(1);
  process.stdout.write(`uploading ${name} (${mb} MB)${isVideo ? " [multipart]" : ""}… `);
  const blob = await put(`events/${slug}/${name}`, createReadStream(file), {
    access: "public",
    addRandomSuffix: false,
    allowOverwrite: true,
    multipart: isVideo,
  });
  console.log("done");
  console.log(`  ${blob.url}`);
  if (isVideo) recording = blob.url;
  else photos.push(blob.url);
}

console.log("\nPaste into the session's entry in lib/hackathon.js:\n");
console.log("    media: {");
if (recording) console.log(`      recording: "${recording}",`);
if (photos.length) {
  console.log("      photos: [");
  for (const u of photos) console.log(`        "${u}",`);
  console.log("      ],");
}
console.log("    },");
