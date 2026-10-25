import { GROWTH_BOT_TEMPLATES } from '../lib/growth-engineering-templates';
import MarketingTeamPromptTools from './marketing-team-prompt-tools';

const roles = {
  'Site Builder': { tone:'sand', deliverable:'Website + client brief', description:'Build the website and quote flow. Share the approved brief with the team.' },
  'Social Media Manager': { tone:'mint', deliverable:'Social · Zernio', description:'Plan organic content. Review the campaign and hand approved drafts to Zernio.' },
  'Performance Marketer': { tone:'violet', deliverable:'Paid ads · Meta Ads MCP', description:'Research ads, brief the creators, and turn campaign results into next steps.' },
  'Content Creator · Design': { tone:'blue', deliverable:'Imagery + static creative', description:'Create site imagery and static graphics. Refine each design with feedback.' },
  'Content Creator · Video': { tone:'peach', deliverable:'Storyboards + video', description:'Storyboard, render, and refine video ads from the approved positioning.' },
};

function BotAvatar({ tone }) {
  return <svg className={`ai-team-avatar ai-team-avatar-${tone}`} viewBox="0 0 120 120" aria-hidden="true">
    <path d="M60 12C25 12 12 26 12 60s13 48 48 48 48-14 48-48S95 12 60 12Z" fill="currentColor"/>
    <rect x="43" y="36" width="11" height="27" rx="5.5" transform="rotate(-27 43 36)" fill="white"/>
    <rect x="66" y="32" width="11" height="27" rx="5.5" transform="rotate(-27 66 32)" fill="white"/>
  </svg>;
}

export default function MarketingTeamCards() {
  return <div className="ai-team">
    <div className="ai-team-cards">{GROWTH_BOT_TEMPLATES.map((bot) => {
      const role = roles[bot.name];
      return <article className={`ai-team-card ai-team-card-${role.tone}`} key={bot.name}>
        <div className="ai-team-art"><BotAvatar tone={role.tone}/><span>Grok Bot</span></div>
        <div className="ai-team-copy">
          <h4>{bot.name}</h4><p className="ai-team-credit">by Ship AI</p>
          <strong>{role.deliverable}</strong><p className="ai-team-description">{role.description}</p>
          <a href={bot.href} target="_blank" rel="noreferrer" aria-label={`Get the ${bot.name} bot template`}>Get bot template <span aria-hidden="true">↗</span></a>
        </div>
      </article>;
    })}</div>
    <div className="ai-team-flow"><span>Website + brief</span><b aria-hidden="true">→</b><span>Static + feedback</span><b aria-hidden="true">→</b><span>Video + feedback</span><b aria-hidden="true">→</b><span>Zernio drafts</span></div>
    <MarketingTeamPromptTools/>
  </div>;
}
