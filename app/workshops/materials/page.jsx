import {requireUser} from '../../../lib/auth';
import {MANAGED_WORKSHOPS} from '../../../lib/workshop-media';
import {workshopMaterialAccess} from '../../../lib/workshop-material-access';
import '../../workshop-materials.css';
export const dynamic='force-dynamic';
export const revalidate=0;
export const metadata={title:'Your Workshop Materials — Ship AI',robots:{index:false,follow:false}};
export default async function Page(){await requireUser('/workshops/materials');const all=await Promise.all(MANAGED_WORKSHOPS.map(async w=>({workshop:w,access:await workshopMaterialAccess(w.slug)})));const eligible=all.filter(x=>x.access.allowed);
  return <main className="wm-document"><p className="mk-label">Your workshop library</p><h1>Keep building after the workshop.</h1><p>Materials for your completed registrations and assigned host workshops appear here. Admins can also access the October 10 workshop.</p>{eligible.length?eligible.map(({workshop:w,access})=><section key={w.slug}><h2>{w.name}</h2><div className="wm-downloads"><a href={`/workshops/${w.slug}/materials/deck`}>Open slide deck ↗</a><a href={`/workshops/${w.slug}/materials/guide`}>Open workshop guide ↗</a>{(access.isHost||access.isAdmin)&&<a href={`/workshops/${w.slug}/materials/facilitator`}>Host notes ↗</a>}</div></section>):<section><h2>No workshop materials yet.</h2><p>Use the account tied to your completed booking. Unscheduled workshops remain closed until registration is configured.</p><a href="mailto:hi@shipai.club">Ask about an external ticket</a></section>}<p><a href="/dashboard">Your dashboard</a> · <a href="/workshops">Workshop catalog</a></p></main>;}
