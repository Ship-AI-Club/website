import {authorizedWorkshopMaterial,MaterialDenied,FacilitatorGuide} from '../../../../../components/workshop-materials.jsx';
export const dynamic='force-dynamic';
export const revalidate=0;
export const metadata={title:'Private Workshop Facilitator — Ship AI',robots:{index:false,follow:false}};
export default async function Page({params}){const {slug}=await params;const {access,material}=await authorizedWorkshopMaterial(slug,'host');if(!material)return <MaterialDenied/>;
const notes=(await import('../../../../../lib/workshop-facilitators.js')).facilitatorGuideFor(slug);return <FacilitatorGuide slug={slug} title={material.title} notes={notes}/>;}
