import assert from 'node:assert/strict';
import {clothOffset} from './cloth.mjs';
const impulse=[{x:55,y:-20},{x:25,y:10}];
assert.deepEqual(clothOffset(.15,.88,.1,impulse,0),[.15,.88,.1]);
const center=clothOffset(.15,.88,.1,impulse,3);assert.ok(center[0]>.3&&center[0]<.5);
for(const y of [0,1.8]){const p=clothOffset(.15,y,.1,impulse,3);assert.ok(Math.abs(p[0]-.15)<1e-10)}
assert.deepEqual(clothOffset(.15,.88,.1,impulse,99),center);
assert.deepEqual(clothOffset(.15,.88,.1,impulse,-1),[.15,.88,.1]);
for(let i=0;i<1000;i++)assert.deepEqual(clothOffset(.15,.88,.1,impulse,3),center);
console.log('PASS: zero intensity, bounded recoil, pinned feet/head, intensity clamps, no accumulated drift.');
