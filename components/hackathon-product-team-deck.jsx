import DeckControls from '../app/programs/[program]/[slug]/deck/deck-controls';
import {EVENT} from '../lib/hackathon';
import {BREAKOUTS,HACKATHON_PATH} from '../lib/hackathon-opening';
import {PRODUCT_TEAM,BOT_DIRECTORY,MARKETING_TEAM,workshopSetupPrompt} from '../lib/hackathon-product-team';
import ProductTeamPrompt from './product-team-prompt';
import botManifest from '../public/hackathon-product-team/bots.json';
import WorkshopCodingRoute from './workshop-coding-route';

function RoleGlyph({id,color}){
  return <svg viewBox="0 0 80 70" aria-hidden="true" className="pt-role-glyph">
    <path d="M22 12Q42 4 59 15L67 40Q67 58 45 62L22 56Q11 47 13 31Z" fill={color}/>
    <path d="M30 26L33 35M45 24L48 33" stroke="white" strokeWidth="6" strokeLinecap="round"/>
    {id==='research'&&<g stroke="#24344e" strokeWidth="2.5"><circle cx="62" cy="47" r="9" fill="#fffdf7"/><path d="M69 54L76 62"/></g>}
    {id==='pm'&&<g stroke="#24344e" strokeWidth="2"><path d="M48 44L69 45 67 65 46 63Z" fill="#fffdf7"/><path d="M52 50L63 51M52 56L62 57"/></g>}
    {id==='designer'&&<g stroke="#24344e" strokeWidth="2"><path d="M55 63L66 39 72 43 61 66 54 69Z" fill="#e8bd61"/></g>}
    {id==='frontend'&&<g stroke="#24344e" strokeWidth="2"><path d="M43 46L73 48 70 66 40 64Z" fill="#fffdf7"/><path d="M45 52L70 54"/></g>}
    {id==='backend'&&<g stroke="#24344e" strokeWidth="2"><path d="M49 46L73 49V67L49 64Z" fill="#fffdf7"/><path d="M50 53L72 56M50 59L72 62"/></g>}
  </svg>;
}


const breakoutNames=['Positioning & research','Productize the site','Design & build','Create your marketing'];
// Five core slides per breakout, plus an optional coding-agent route in breakout 3.
const slides=[
 {id:'position',breakout:1,type:'intro',title:'Find your position.',lead:'Leave with a clear customer, offer and pricing direction.',roles:['pm','research']},
 {id:'add-starting-team',breakout:1,type:'add',title:'Set up your starting team.',lead:'One prompt gets your team ready.',roles:['pm','research'],note:'Your assistant handles setup. Product Manager guides the work.'},
 {id:'tell-your-bot',breakout:1,type:'quote',title:'Tell your bot what you know.',lead:'It asks the questions. You answer in your own words.',quote:'Help me clarify my business and who it serves.',note:'“Not sure” is a useful answer.'},
 {id:'research',breakout:1,type:'words',title:'Let the team research.',lead:'Your bots explore the options and recommend a starting point.',words:['Customer','Offer','Pricing']},
 {id:'position-review',breakout:1,type:'review',title:'Does the positioning fit?',lead:'Review the recommendation with Product Manager.',words:['Keep what fits.','Change what doesn’t.','Approve your brief.']},
 {id:'productize',breakout:2,type:'intro',title:'Make the site useful.',lead:'Leave with one visitor experience worth building.',roles:['pm','designer']},
 {id:'add-designer',breakout:2,type:'add',title:'Bring in Product Designer.',lead:'One prompt continues from your approved brief.',roles:['pm','designer'],note:'The PM and Designer work together from your approved brief.'},
 {id:'experience',breakout:2,type:'flow',title:'Let the team shape it.',lead:'Your bots recommend what fits your customer.',words:['A clear promise','A useful result','The right next step']},
 {id:'design-review',breakout:2,type:'words',title:'Review the copy and design.',lead:'Tell your bot what feels unclear or out of place.',words:['Message','Experience','Next step']},
 {id:'scope-approval',breakout:2,type:'quote',title:'Approve the plan.',lead:'Continue when the experience feels right for your business.',quote:'This fits. Let’s build it.',note:'Or tell Product Manager what to change.'},
 {id:'build',breakout:3,type:'intro',title:'Build the experience.',lead:'Leave with a working site you can try.',roles:['designer','frontend'],note:`Submit your live site by ${EVENT.deadline}.`},
 {id:'add-engineer',breakout:3,type:'add',title:'Set up the build team.',lead:'Product Manager coordinates. Designer and engineers build together.',roles:['pm','designer','frontend','backend'],optionalRole:'backend',note:'Reuse the same Product Manager and Product Designer. Add Backend only when the experience needs it.'},
 {id:'team-builds',breakout:3,type:'flow',title:'Let the bots build.',lead:'Stay in the same Product Manager conversation.',words:['Design','Build','Check']},
 {id:'try-it',breakout:3,type:'review',title:'Try it. Give feedback.',lead:'Your team revises the site and brings it back.',words:['Try the main action.','Check it on your phone.','Approve when it works.']},
 {id:'save-build',breakout:3,type:'quote',title:'Keep your approved work together.',lead:'Save the site and shared brief for the marketing team.',quote:'This works. Let’s use it to create our marketing.',note:'Continue to breakout 4 after you approve the site.'},
 {id:'coding-route',breakout:3,type:'coding-route',title:'Build with a coding agent.',lead:'Use this workshop if you prefer to build directly.'},
 {id:'market',breakout:4,type:'intro',title:'Create your marketing.',lead:'Turn your approved site into a campaign draft.',roles:['social','static']},
 {id:'marketing',breakout:4,type:'marketing',title:'Set up your marketing team.',lead:'One prompt starts your team from the approved site.',note:'Social Media Manager coordinates the three specialists.'},
 {id:'campaign-brief',breakout:4,type:'quote',title:'Start with your approved site.',lead:'Your team reuses the customer, positioning, offer and brand.',quote:'Help me create one campaign for this site.',note:'Stay in the same project. Your bots ask only for missing details.'},
 {id:'campaign-create',breakout:4,type:'flow',title:'Research. Create. Review.',lead:'Review the static creative before the team moves to video.',words:['Research the direction','Create a static draft','Plan and create the video']},
 {id:'campaign-review',breakout:4,type:'review',title:'Review the whole campaign.',lead:'Your bots bring one bundle back for your feedback.',words:['Review the creative.','Check the caption and link.','Approve delivery separately.'],note:'Zernio and Meta Ads MCP are optional. Nothing is sent or spent from the setup prompt.'},
];
function BotLink({id,optional=false}){
 const bot=PRODUCT_TEAM.find(x=>x.id===id)||MARKETING_TEAM.find(x=>x.id===id);
 const href=bot.href||botManifest.bots[id]?.templateUrl;
 return <a className="pt-five-bot" href={href} target="_blank" rel="noopener noreferrer" aria-label={`Open ${bot.name} template in a new window`} style={{'--role-color':bot.color}}><span className="pt-five-avatar"><RoleGlyph id={id} color={bot.color}/></span><strong>{bot.name}</strong>{optional&&<small className="pt-five-role-note">Only if needed</small>}<span className="pt-five-open">Open template <span aria-hidden="true">↗</span></span></a>;
}
function SetupPrompt({stage}){
 const title=stage==='marketing'?'Set up my marketing team':`Set up breakout ${stage}`;
 return <div className="pt-five-setup"><ProductTeamPrompt label="Copy setup prompt" title={title} prompt={workshopSetupPrompt(stage,botManifest.bots)} copyOnOpen description="Paste this into your main Grok Bot, or Codex or Claude with computer use. Your assistant handles setup and guides this brief." copiedMessage="Copied. Paste into Grok Bot, Codex or Claude."/><p>Grok Bot · Codex · Claude <span>Use computer use outside Grok Bot.</span></p></div>;
}
function Body({slide}){
 switch(slide.type){
  case 'intro':return <div className="pt-five-intro-art" aria-hidden="true"><span className="pt-five-number">{slide.breakout}</span><div>{slide.roles.map(id=>{const bot=PRODUCT_TEAM.find(x=>x.id===id)||MARKETING_TEAM.find(x=>x.id===id);return <RoleGlyph key={id} id={id} color={bot.color}/>;})}</div></div>;
  case 'add':return <div className="pt-five-add"><SetupPrompt stage={slide.breakout}/><div className={`pt-five-bots${slide.roles.length===1?' is-single':''}${slide.roles.length>2?' is-compact':''}`}>{slide.roles.map(id=><BotLink id={id} optional={slide.optionalRole===id} key={id}/>)}</div></div>;
  case 'quote':return <blockquote className="pt-five-quote">“{slide.quote}”</blockquote>;
  case 'coding-route':return <WorkshopCodingRoute/>;
  case 'words':return <div className="pt-five-words">{slide.words.map(word=><p key={word}>{word}</p>)}</div>;
  case 'flow':return <ol className="pt-five-flow">{slide.words.map(word=><li key={word}>{word}</li>)}</ol>;
  case 'review':return <ol className="pt-five-review">{slide.words.map((word,i)=><li key={word}><span>{i+1}</span>{word}</li>)}</ol>;
  case 'marketing':return <div className="pt-five-marketing"><SetupPrompt stage="marketing"/><BotLink id="social"/><div className="pt-five-marketing-team" aria-label="Managed by Social Media Manager">{MARKETING_TEAM.filter(x=>x.id!=='social').map(bot=><a href={bot.href} target="_blank" rel="noopener noreferrer" aria-label={`Open ${bot.name} template in a new window`} key={bot.id}>{bot.name}<span aria-hidden="true">↗</span></a>)}</div></div>;
  default:return null;
 }
}
export default function ProductTeamDeck({breakout=null}){
 const shown=breakout?slides.filter(x=>x.breakout===breakout):slides;
 return <div className="dk-page pt-deck pt-five-deck">
  <header className="dk-bar"><a href={`${HACKATHON_PATH}${breakout?'#decks':''}`}>{breakout?'← All breakouts':'← Hackathon'}</a><nav className="pt-breakout-nav" aria-label="Breakouts">{BREAKOUTS.map((item,i)=><a href={item.href} aria-current={breakout===item.number?'page':undefined} key={item.slug}>{item.number} · {['Position','Productize','Build','Market'][i]}</a>)}</nav><a href={BOT_DIRECTORY} target="_blank" rel="noopener noreferrer">All bot templates ↗</a></header>
  <main className="dk-track" data-lenis-prevent tabIndex={-1}>{shown.map((slide,i)=><section className="dk-slide dk-marketing-slide pt-slide" id={`slide-${i+1}`} key={slide.id} aria-label={`Slide ${i+1}: ${slide.title}`}><div className={`dk-frame pt-frame pt-five-frame pt-five-kind-${slide.type}`}><div className="pt-body"><p className="pt-five-label">Breakout {slide.breakout} · {breakoutNames[slide.breakout-1]}</p><header className="pt-five-heading">{i===0?<h1>{slide.title}</h1>:<h2>{slide.title}</h2>}<p>{slide.lead}</p></header><Body slide={slide}/>{slide.note&&<p className="pt-five-note">{slide.note}</p>}</div><footer className="dk-chrome"><span className="pt-brand"><img src="/logo-mark.png" alt=""/>Ship AI</span><span className="dk-chrome-mid">Practical AI, Built Together.</span><span>{slides.filter(x=>x.breakout===slide.breakout).indexOf(slide)+1} / {slides.filter(x=>x.breakout===slide.breakout).length}</span></footer></div></section>)}</main>
  <DeckControls total={shown.length}/>
 </div>;
}
