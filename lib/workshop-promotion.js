import { VIBE_GTM } from './vibe-gtm-workshop.js';

export function workshopPromotion(code, now = new Date()) {
  if (typeof code !== 'string' || code.trim().toLowerCase() !== 'gotomarket') return null;
  if (new Date(now).getTime() >= new Date(VIBE_GTM.start).getTime()) return null;
  return { code: 'GoToMarket', amount: 99900, total: 149, id: 'promo_1UNwrbLVO0cFESfS03e4CKye' };
}
