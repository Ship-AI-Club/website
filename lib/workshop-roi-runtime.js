import 'server-only';
import {ROI_SCENARIOS} from './workshop-roi.js';
import {workshopPrice} from './vibe-gtm-workshop.js';
export function workshopRoiFor(slug){const source=ROI_SCENARIOS[slug];if(!source)return null;
  return {...source,assumptions:{...source.assumptions,fee:slug==='vibe-coding-gtm'?workshopPrice().amount:source.assumptions.fee}};
}
