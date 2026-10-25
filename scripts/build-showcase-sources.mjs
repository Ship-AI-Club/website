// Bundle only the actual registered SKILL.md/reference files for server use.
// Avoid unconstrained runtime directory tracing; never publish workshop files.
import {readFileSync,readdirSync,writeFileSync} from 'node:fs';
import {join} from 'node:path';
import {FX_PROGRAM_SHOWCASES,FX_WORKSHOP_SHOWCASES} from '../lib/fx-showcase-registry.js';
const directories=[...new Set([...FX_PROGRAM_SHOWCASES,...FX_WORKSHOP_SHOWCASES].flatMap(d=>d.tasks.map(t=>t.directory)))].sort();
const sources={};
for(const directory of directories){
 if(!/^(content\/(skills|program-skills|workshop-skills)|public\/marketing-resources\/library)\/[a-z0-9-]+$/.test(directory))throw Error('Unregistered skill directory');
 const files=[{name:'SKILL.md',text:readFileSync(join(directory,'SKILL.md'),'utf8')}];
 function walk(relative){let entries;try{entries=readdirSync(join(directory,relative),{withFileTypes:true});}catch(e){if(e.code==='ENOENT')return;throw e;}
  for(const entry of entries.sort((a,b)=>a.name.localeCompare(b.name))){
   if(entry.isSymbolicLink())throw Error('Skill references must be regular files');
   const name=relative+'/'+entry.name;
   if(entry.isDirectory())walk(name);
   else if(entry.isFile()&&/\.(md|txt|json)$/.test(entry.name))files.push({name,text:readFileSync(join(directory,name),'utf8')});
  }
 }
 walk('references');sources[directory]=files;
}
writeFileSync('lib/fx-showcase-sources.generated.json',JSON.stringify(sources));
console.log('Private server skill bundle:',directories.length,'actual skill directories.');
