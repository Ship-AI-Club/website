import {notFound} from 'next/navigation';
import {authorizedWorkshopMaterial,MaterialDenied,WorkshopDeck} from '../../../../../components/workshop-materials.jsx';
import {workshopMaterialsFor} from '../../../../../lib/workshop-materials.js';
export const dynamic='force-dynamic';
export const revalidate=0;
export const metadata={title:'Vibe Coding for Go-to-Market · Workshop Deck — Ship AI',description:'Slides and copyable prompts for the Ship AI website and marketing workshop.'};
export default async function Page({params}){const {slug}=await params;if(slug==='vibe-coding-gtm'){const material=workshopMaterialsFor(slug);if(!material)notFound();return <WorkshopDeck slug={slug} material={material} isHost={false}/>;}const {access,material}=await authorizedWorkshopMaterial(slug,'attendee',`/workshops/${slug}/materials/deck`);if(!material)return <MaterialDenied/>;
return <WorkshopDeck slug={slug} material={material} isHost={access.isHost||access.isAdmin}/>;}
