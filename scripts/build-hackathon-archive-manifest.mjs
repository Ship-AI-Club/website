import { createHash } from 'node:crypto';
import { readFile, writeFile } from 'node:fs/promises';

const base = new URL('../public/hackathon-product-team/', import.meta.url);
const names = ['ship-ai-product-team.zip', 'business-site-starter.zip', 'yc-interface-craft.zip', 'product-designer-update.zip'];
const archives = await Promise.all(names.map(async (file) => {
  const bytes = await readFile(new URL(file, base));
  return { file, url: `https://www.shipai.club/hackathon-product-team/${file}`, bytes: bytes.length, sha256: createHash('sha256').update(bytes).digest('hex') };
}));

await writeFile(new URL('kit-archives.json', base), JSON.stringify({
  schemaVersion: 1,
  instructions: 'Match the exact archive filename and URL before checking its SHA256. Each archive has its own hash. The YC Interface Craft hash must never be used for the full team kit or starter.',
  archives,
  designerFilesManifest: 'https://www.shipai.club/hackathon-product-team/designer-skill-manifest.json',
}, null, 2) + '\n');
console.log(`Hackathon archive manifest: ${archives.length} archives.`);
