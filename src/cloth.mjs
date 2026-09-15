// Costume deformation only. Rest coordinates are never accumulated.
const clamp=(x,a,b)=>Math.max(a,Math.min(b,x));
const smooth=(a,b,x)=>{const t=clamp((x-a)/(b-a),0,1);return t*t*(3-2*t)};
export function createClothMotion(){
 let history=[];
 return (time,springs)=>{
  const last=history.at(-1);
  if(last&&time<last.time)history=[];
  if(!last||time!==last.time)history.push({time,springs:springs.map(n=>({x:n.x,y:n.y}))});
  while(history.length>2&&history[1].time<time-.2)history.shift();
  const at=delay=>{
   const t=time-delay;if(t<history[0].time)return [{x:0,y:0},{x:0,y:0}];
   let lo=history[0],hi=history.at(-1);
   for(const h of history){if(h.time<=t)lo=h;else{hi=h;break}}
   const f=hi.time===lo.time?0:clamp((t-lo.time)/(hi.time-lo.time),0,1);
   return lo.springs.map((n,i)=>({x:n.x+(hi.springs[i].x-n.x)*f,y:n.y+(hi.springs[i].y-n.y)*f}));
  };
  return {lead:at(0),follow:at(.065),hem:at(.115)};
 };
}
export function clothOffset(x,y,z,springs,amount,motion){
 const strength=clamp(Number(amount)||0,0,3);
 if(!strength)return [x,y,z];
 const weight=smooth(.57,.78,y)*(1-smooth(.94,1.13,y))*(1-smooth(.19,.31,Math.abs(x)));
 if(!weight)return [x,y,z];
 const m=motion||{lead:springs,follow:springs,hem:springs};
 const blend=smooth(.70,.96,y),side=smooth(-.16,.16,x);
 const sample=(states,key)=>states[0][key]*(1-side)+states[1][key]*side;
 const driver=(sample(m.lead,'x')*.35+sample(m.follow,'x')*.65)*blend+sample(m.hem,'x')*(1-blend);
 const squash=Math.tanh(driver/42)*.16*strength;
 // Reciprocal stretch creates a bulge/rebound instead of translating a slab.
 const sx=1-squash*.55,sz=1+squash,sy=1/(sx*sz);
 const lag=Math.tanh((sample(m.follow,'x')-sample(m.lead,'x'))/42);
 const dx=Math.tanh(driver/50)*.014*strength;
 const dy=Math.tanh(sample(m.follow,'y')/40)*.009*strength;
 return [x+weight*(x*(sx-1)+dx),y+weight*((y-.86)*(sy-1)+dy),z+weight*(z*(sz-1)+lag*.014*strength)];
}
