import 'server-only';
import {readFile,readdir} from 'node:fs/promises';
import {join} from 'node:path';
import {zip} from '../scripts/zip.mjs';
const TRACKS=['revenue','engineering','growth','support','operations','insights'];
export async function organizationBlueprints() {
  const files=[];
  for(const track of TRACKS){const root=join(process.cwd(),'workshop-kits/build-your-ai-organization',track);
    for(const name of await readdir(root)){if(!/^[a-zA-Z0-9_.-]+\.(md|mjs|json)$/.test(name))continue;files.push({name:`${track}/${name}`,data:await readFile(join(root,name))});}}
  return zip(files);
}
