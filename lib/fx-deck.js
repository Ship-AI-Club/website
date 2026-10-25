import { readFile, readdir } from 'node:fs/promises';
import { join } from 'node:path';
import { createSkillsAdapter, loadSkillFile } from 'libfx/skills/node';
import { FX_DECK_PRESETS, FX_DECK_BRIEF } from './fx-deck-presets.js';

export async function loadFxDeckSkill(name) {
  if (!FX_DECK_PRESETS.some(p => p.id === name)) throw new Error('Unknown demo skill');
  const root = join(process.cwd(), 'public/marketing-resources/library', name);
  const resources = [];
  // libfx does not scan referenced files. Supply actual bundled references explicitly.
  for (const file of (await readdir(join(root, 'references'))).filter(n => n.endsWith('.md')).sort()) {
    resources.push({ uri: `skill://${name}/references/${file}`, text: await readFile(join(root, 'references', file), 'utf8') });
  }
  const record = await loadSkillFile(join(root, 'SKILL.md'), { resources });
  const adapter = createSkillsAdapter([record]);
  return { ...adapter, name: record.name, files: ['SKILL.md', ...resources.map(r => r.uri.split('/references/')[1])] };
}

export function fxDeckOptions(skill) {
  return {
    instructions: `${skill.instructions}\n\nWorkshop rules: Apply the supplied skill to the illustrative business brief. Use only supplied facts. Never invent customer evidence, measurements, promises, or prices. Follow the requested word limit. Give the requested output directly rather than asking follow-up questions. Begin by reading the business brief tool once. The CTA must be exactly “${FX_DECK_BRIEF.primaryAction}”; the brief does not promise a free consultation. Label sample deliverables as samples, never as client results. Respond in plain text without Markdown formatting.`,
    tools: [{
      name: 'read_marketing_brief',
      description: 'Read the fixed illustrative marketing brief for this workshop example. Contains no private repository data.',
      inputSchema: { type:'object', properties:{}, additionalProperties:false },
      execute: async () => FX_DECK_BRIEF,
    }],
  };
}

export function createFxDeckTransport() {
  let requests = 0;
  return async (input, init) => {
    const request = new Request(input, init);
    const url = new URL(request.url);
    const catalog = url.pathname === '/coding-agent/v1/models' && request.method === 'GET';
    const generation = ['/v3/ai/language-model','/v4/ai/language-model'].includes(url.pathname) && request.method === 'POST';
    if(url.origin !== 'https://ai-gateway.vercel.sh' || url.search || (!catalog && !generation)) throw new Error('Unknown model endpoint');
    if (!generation) return fetch(request);
    if (++requests > 3) throw new Error('Demo model-step limit reached');
    const body = await request.json();
    return fetch(new Request(url, { method:'POST', headers:request.headers, body:JSON.stringify({...body,maxOutputTokens:512}), redirect:'error', signal:AbortSignal.any([request.signal,AbortSignal.timeout(25000)]) }));
  };
}
