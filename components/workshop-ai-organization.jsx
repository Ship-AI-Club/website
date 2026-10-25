import { PRODUCT_TEAM, MARKETING_TEAM } from '../lib/hackathon-product-team';
import botManifest from '../public/hackathon-product-team/bots.json';

function Bot({ id, optional = false }) {
  const bot = [...PRODUCT_TEAM, ...MARKETING_TEAM].find(item => item.id === id);
  const href = bot.href || botManifest.bots[id]?.templateUrl;
  return <a className={`oc-org-bot${id === 'pm' ? ' is-pm' : ''}${id === 'social' ? ' is-social' : ''}`} href={href} target="_blank" rel="noopener noreferrer" aria-label={`Open ${bot.name} template in a new window`} style={{ '--bot-color': bot.color }}>
    <span className="oc-org-avatar" aria-hidden="true"><i/><i/></span>
    <span><strong>{bot.name}</strong>{optional && <small>Only if needed</small>}{id === 'pm' && <small>Your starting point · one shared brief</small>}</span>
    <span aria-hidden="true">↗</span>
  </a>;
}

export default function WorkshopAIOrganization() {
  return <div className="oc-organization" aria-label="Example AI organization with nine bot roles">
    <div className="oc-org-lead"><Bot id="pm"/></div>
    <div className="oc-org-departments">
      <section><h3>Product</h3><Bot id="research"/><Bot id="designer"/></section>
      <section><h3>Engineering</h3><Bot id="frontend"/><Bot id="backend" optional/></section>
      <section className="oc-org-marketing"><h3>Marketing</h3><Bot id="social"/><div className="oc-org-specialists"><Bot id="performance"/><Bot id="static"/><Bot id="video"/></div></section>
    </div>
  </div>;
}
