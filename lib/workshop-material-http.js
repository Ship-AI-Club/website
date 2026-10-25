import { materialFileSpec, WORKSHOP_PRIVATE_HEADERS } from './workshop-material-access-policy.js';
export function attendeeGuideMarkdown(material) {
  const guide=material.guide;
  return [`# ${material.title}`,material.durationLabel,material.timingNote,guide.intro,'## Preparation',...guide.preparation.map(s=>`- ${s}`),
    ...guide.steps.flatMap((s,i)=>[`## ${i+1}. ${s.title}${s.minutes?` · ${s.minutes} min`:''}`,...s.instructions.map((x,n)=>`${n+1}. ${x}`),s.prompt?`### Example prompt\n\n\`\`\`text\n${s.prompt}\n\`\`\``:'',`**Done:** ${s.done}`,`**Check:** ${s.check}`]),
    ...(guide.browserSetup?['## Set up browser computer use',...guide.browserSetup.flatMap(s=>[`### ${s.title}`,...s.instructions.map((line,i)=>`${i+1}. ${line}`),`[Official setup guide](${s.href})`])]:[]),
    ...(guide.skillSelection?['## Workshop highlight: SEO + AI search skills',...guide.skillSelection.map(s=>`### [${s.name}](${s.href})\n\n${s.summary}`)]:[]),
    ...(guide.resources?['## Sources and skill reviews',...guide.resources.map(s=>`- [${s.label}](${s.href})`)]:[]),
    '## Deliverables',...guide.deliverables.map(s=>`- ${s}`),'## Troubleshooting',...guide.troubleshooting.flatMap(s=>[`### ${s.problem}`,s.fix]),
    '## Source material',...material.sources.map(s=>`- ${s}`)].filter(Boolean).join('\n\n');
}
export function facilitatorMarkdown(title,notes) {
  return [`# ${title} · Host notes`,'Private facilitator material. Do not distribute answer keys to attendees.','## Preparation',...notes.preparation.map(s=>`- ${s}`),
    '## Run of show',...notes.runOfShow.flatMap(s=>[`### ${s.title} · ${s.minutes} min`,Array.isArray(s.notes)?s.notes.join('\n'):s.notes]),
    '## Exercise review',...notes.answerKeys.flatMap(s=>[`### ${s.exercise}`,...s.expected.map(x=>`- ${x}`),'Watch for:',...s.watchFor.map(x=>`- ${x}`)]),
    '## Adaptations',...notes.adaptations.map(s=>`- ${s}`)].join('\n\n');
}
// The actual route uses this factory. Tests inject only trusted server adapters.
export function createMaterialDownloadHandler({authorize,loadAttendee,loadHost,loadBlueprints,loadRoi,loadHandout}) {
  return async function GET(request,{params}) {
    const {slug,file}=await params;
    const spec=materialFileSpec(file);
    const respond=(body,status=200)=>Response.json(body,{status,headers:WORKSHOP_PRIVATE_HEADERS});
    if(!spec)return respond({error:'Resource not found.'},404);
    const access=await authorize(slug,{audience:spec.audience});
    if(!access.allowed)return respond({error:'Workshop access is required.'},access.reason==='unauthenticated'?401:403);
    if(file==='workshop.pptx'||file==='prompts.md') {
      if(slug!=='vibe-coding-gtm')return respond({error:'Resource not found.'},404);
      const bytes=await loadHandout?.(slug,file);
      if(!bytes)return respond({error:'Resource not found.'},404);
      return new Response(bytes,{headers:{...WORKSHOP_PRIVATE_HEADERS,'Content-Type':spec.contentType,'Content-Disposition':`attachment; filename="${slug}-${file}"`}});
    }
    if(file==='blueprints.zip') {
      if(slug!=='build-your-ai-organization')return respond({error:'Resource not found.'},404);
      return new Response(await loadBlueprints(slug),{headers:{...WORKSHOP_PRIVATE_HEADERS,'Content-Type':spec.contentType,'Content-Disposition':'attachment; filename="organization-blueprints.zip"'}});
    }
    const material=await loadAttendee(slug);
    if(!material)return respond({error:'Resource not found.'},404);
    let body;
    if(spec.audience==='host') {
      const notes=await loadHost(slug);if(!notes)return respond({error:'Resource not found.'},404);
      body=file.endsWith('.md')?facilitatorMarkdown(material.title,notes):JSON.stringify({title:material.title,notes});
    } else if(file==='deck.json')body=JSON.stringify({title:material.title,durationLabel:material.durationLabel,timingNote:material.timingNote,agenda:material.agenda,slides:material.slides,roi:await loadRoi?.(slug)});
    else if(file==='guide.json')body=JSON.stringify({title:material.title,durationLabel:material.durationLabel,timingNote:material.timingNote,guide:material.guide,roi:await loadRoi?.(slug)});
    else body=attendeeGuideMarkdown(material)+(loadRoi?`\n\n## Illustrative ROI assumptions\n\n\`\`\`json\n${JSON.stringify(await loadRoi(slug),null,2)}\n\`\`\`\n`: '');
    return new Response(body,{headers:{...WORKSHOP_PRIVATE_HEADERS,'Content-Type':spec.contentType,'Content-Disposition':`attachment; filename="${slug}-${file}"`}});
  };
}
