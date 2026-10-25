import 'server-only';
import { readFile } from 'node:fs/promises';
import path from 'node:path';

// Called only after the download route authorizes the workshop and audience.
const files = Object.freeze({
  'workshop.pptx': 'workshop-kits/vibe-coding-gtm/workshop.pptx',
  'prompts.md': 'workshop-kits/vibe-coding-gtm/prompts.md',
});
export async function workshopHandout(slug, filename) {
  if (slug !== 'vibe-coding-gtm' || !Object.hasOwn(files, filename)) return null;
  return readFile(path.join(process.cwd(), files[filename]));
}
