import 'server-only';
import { workshopMaterialAccess } from './workshop-material-access.js';
import { fxShowcaseDefinition, fxShowcaseConfig } from './fx-showcase-registry.js';
import { resolveFxShowcaseAccess } from './fx-showcase-access.js';
export async function loadFxShowcaseConfig(id) {
  const result=await resolveFxShowcaseAccess(id,{readWorkshopAccess:workshopMaterialAccess,readDefinition:fxShowcaseDefinition});
  return result?fxShowcaseConfig(result.definition):null;
}
