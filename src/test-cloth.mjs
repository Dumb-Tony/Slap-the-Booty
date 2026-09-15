import assert from 'node:assert/strict';
import {clothOffset,createClothMotion} from './cloth.mjs';
const s=[{x:55,y:-20},{x:25,y:10}],p=[.15,.88,-.12];
assert.deepEqual(clothOffset(...p,s,0),p);
assert.deepEqual(clothOffset(...p,s,-1),p);
assert.deepEqual(clothOffset(...p,s,99),clothOffset(...p,s,3));
for(const q of [[0,0,0],[0,1.8,0],[.35,.88,0],[0,1.14,0]])assert.deepEqual(clothOffset(...q,s,3),q);
const l=clothOffset(-1e-7,.88,-.12,s,3),r=clothOffset(1e-7,.88,-.12,s,3);assert.ok(Math.hypot(...l.map((v,i)=>v-r[i]))<1e-5,'continuous center seam');
for(let x=-.3;x<=.3;x+=.025)for(let y=.55;y<1.15;y+=.025)for(let z=-.2;z<=.2;z+=.04){const q=clothOffset(x,y,z,s,3);assert.ok(q.every(Number.isFinite));assert.ok(Math.hypot(q[0]-x,q[1]-y,q[2]-z)<.15)}
const sample=createClothMotion(),zero=[{x:0,y:0},{x:0,y:0}];sample(0,zero);const m=sample(.04,s);assert.equal(m.follow[0].x,0);assert.equal(m.lead[0].x,55);assert.deepEqual(sample(.04,zero),m,'hit stop freezes motion');
for(let i=5;i<40;i++)sample(i*.01,zero);const settled=sample(.4,zero);assert.deepEqual(clothOffset(...p,zero,3,settled),p);
const trace=createClothMotion();let signs=[];for(let i=0;i<360;i++){const t=i/120,d=65*Math.exp(-2.7*t)*Math.sin(9.3*t),v=[{x:d,y:0},{x:d*.5,y:0}],m=trace(t,v);signs.push(clothOffset(...p,v,1.5,m)[2]-p[2])}assert.ok(Math.min(...signs)<-.002&&Math.max(...signs)>.002,'visible opposite-side rebound');
console.log('PASS rest, clamps, pinned extremities, center continuity, bounded deformation, delayed response, hit-stop freeze, settling and reversal');
