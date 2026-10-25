import '../app/hackathon-coding-route.css';

export const CODING_WORKSHOP_DECK = 'https://www.shipai.club/workshops/vibe-coding-gtm/materials/deck';

export default function WorkshopCodingRoute() {
  return <div className="hc-route">
    <div className="hc-route-story" aria-label="Your brief, your website, your marketing">
      <span>01 <strong>Your brief.</strong></span>
      <span>02 <strong>Your website.</strong></span>
      <span>03 <strong>Your marketing.</strong></span>
    </div>
    <div className="hc-route-action">
      <p>Website + marketing workshop</p>
      <h3>Use your coding agent.</h3>
      <p>Follow the prompts. Review each step.</p>
      <a href={CODING_WORKSHOP_DECK} target="_blank" rel="noopener noreferrer">Open the workshop deck <span aria-hidden="true">↗</span></a>
      <small>The workshop guide uses Claude Code.</small>
    </div>
  </div>;
}
