import {authorizedWorkshopMaterial,MaterialDenied,WorkshopGuide} from '../../../../../components/workshop-materials.jsx';
export const dynamic='force-dynamic';
export const revalidate=0;
export const metadata={title:'Private Workshop Guide — Ship AI',robots:{index:false,follow:false}};
export default async function Page({params}){const {slug}=await params;const {access,material}=await authorizedWorkshopMaterial(slug,'attendee');if(!material)return <MaterialDenied/>;
return <WorkshopGuide slug={slug} material={material} isHost={access.isHost||access.isAdmin}/>;}
