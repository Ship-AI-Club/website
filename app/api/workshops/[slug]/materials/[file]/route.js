import {workshopMaterialAccess} from '../../../../../../lib/workshop-material-access.js';
import {createMaterialDownloadHandler} from '../../../../../../lib/workshop-material-http.js';
export const runtime='nodejs';
export const dynamic='force-dynamic';
export const revalidate=0;
export const GET=createMaterialDownloadHandler({authorize:workshopMaterialAccess,
  loadAttendee:async slug=>(await import('../../../../../../lib/workshop-materials.js')).workshopMaterialsFor(slug),
  loadHost:async slug=>(await import('../../../../../../lib/workshop-facilitators.js')).facilitatorGuideFor(slug),
  loadBlueprints:async()=> (await import('../../../../../../lib/workshop-blueprints.js')).organizationBlueprints(),
  loadRoi:async slug=>(await import('../../../../../../lib/workshop-roi-runtime.js')).workshopRoiFor(slug),
  loadHandout:async(slug,file)=>(await import('../../../../../../lib/workshop-handouts.js')).workshopHandout(slug,file),
});
