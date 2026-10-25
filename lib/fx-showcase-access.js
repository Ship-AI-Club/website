// Dependency injection keeps the authorization ordering testable without a DB.
export async function resolveFxShowcaseAccess(id, { readWorkshopAccess, readDefinition }) {
  if(typeof id!=='string' || id.length>180) return null;
  let access=null;
  if(id.startsWith('workshop:')) {
    access=await readWorkshopAccess(id.slice(9),{audience:'attendee'});
    if(!access?.allowed) return null;
  }
  const definition=await readDefinition(id);
  if(!definition || (definition.scope==='workshop' && !access?.allowed)) return null;
  return {definition,hostId:access?.isHost?access.user?.id:null};
}
