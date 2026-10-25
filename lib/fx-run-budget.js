export function reserveFxRun(state, { production=false, now=Date.now() }={}) {
  if(state.active || (!production && (state.used>=12 || (state.lastRun && now-state.lastRun<15000)))) return null;
  state.active=true;
  if(!production) {state.used++;state.lastRun=now;}
  let released=false;
  return ()=>{if(!released){released=true;state.active=false;}};
}
