const fs=require('node:fs'),vm=require('node:vm'),assert=require('node:assert/strict');
const source=fs.readFileSync(__dirname+'/index.html','utf8').match(/<script>([\s\S]*?)<\/script>/)[1];
function boot(stored='{}',blocked=false){const elements=new Map(),events={};const context2d=new Proxy({},{get:()=>()=>({addColorStop(){}})});const element=id=>{if(!elements.has(id))elements.set(id,{textContent:'',dataset:{glove:id.at(-1)},setAttribute(k,v){this[k]=v},addEventListener(k,f){events[id+':'+k]=f},focus(){},getContext(){return context2d},getBoundingClientRect(){return{left:0,top:0,width:1100,height:535}},setPointerCapture(){}});return elements.get(id)};const sandbox={Image:class {complete=true;naturalWidth=941;naturalHeight=1672},console,performance:{now:()=>1000},Math,devicePixelRatio:1,requestAnimationFrame(){},document:{querySelector:element,querySelectorAll:()=>[0,1,2].map(i=>element('glove'+i))},localStorage:{getItem(){if(blocked)throw Error();return stored},setItem(k,v){if(blocked)throw Error();sandbox.saved=v}},window:{addEventListener(k,f){events[k]=f}}};vm.createContext(sandbox);vm.runInContext(source,sandbox);return{run:s=>vm.runInContext(s,sandbox),elements,events,sandbox}}
const g=boot();let checks=0;function test(name,fn){fn();checks++;console.log('PASS '+name)}
test('fast swept collision catches skipped target',()=>assert.ok(g.run('intersect({x:250,y:325},{x:1000,y:325})')));
test('above-target swipe misses',()=>assert.equal(g.run('intersect({x:250,y:190},{x:1000,y:190})'),null));
test('velocity capped, slower movement scores less',()=>{assert.equal(g.run('measure({x:0,y:0,t:0},{x:1000,y:0,t:1},[])'),6500);assert.equal(g.run('measure({x:0,y:0,t:0},{x:100,y:0,t:100},[])'),1000)});
test('unarmed pass produces no score',()=>{g.run('start();move(500,325,1000);move(900,325,1090)');assert.equal(g.run('slaps'),0)});
test('armed swing scores once with perfect accuracy',()=>{g.run('move(250,325,2000);move(500,325,2050);move(850,325,2100)');assert.equal(g.run('slaps'),1);assert.equal(g.elements.get('#accuracy').textContent,'100%');assert.ok(g.run('best')>2000)});
test('continued movement cannot double score',()=>{g.run('move(700,325,2110);move(900,325,2120)');assert.equal(g.run('slaps'),1)});
test('pullback after recovery rearms and instant retry works',()=>{g.run('move(250,325,3000);move(500,325,3050);move(850,325,3100)');assert.equal(g.run('slaps'),2)});
test('glancing shot loses power',()=>{g.run('slap(3000,.2,{x:650,y:370},4000)');assert.equal(g.elements.get('#score').textContent,'1,440')});
test('idle pointer jump does not generate artificial velocity',()=>{g.run('move(250,325,5000);move(900,325,6000)');assert.equal(g.run('slaps'),3)});
test('escape clears keyboard charge and shows menu',()=>{g.run('chargeAt=12;menu()');assert.equal(g.run('chargeAt'),0);assert.equal(g.elements.get('#overlay').hidden,false)});
test('saved best and unlocks survive a new game',()=>{const b=boot(g.sandbox.saved);assert.equal(b.run('best'),g.run('best'));assert.equal(b.elements.get('glove1').disabled,false)});
test('invalid and unavailable storage do not prevent play',()=>{for(const s of ['{bad','null'])assert.equal(boot(s).run('best'),0);assert.equal(boot('{}',true).run('best'),0)});
test('drawing runs across hit stop, recovery and title',()=>{g.run('draw(4020);draw(4500);draw(8000)')});
test('spring response stays bounded and settles after a hard hit',()=>{g.run('slap(6500,1,{x:736,y:325},9000)');for(let i=0;i<600;i++)g.run('integratePhysics(1/60)');assert.ok(g.run('springs.every(n=>Number.isFinite(n.x)&&Math.abs(n.x)<.01&&Math.abs(n.y)<.01)'))});
test('oversized costume receives hits beyond old narrow target',()=>{const b=boot();assert.ok(b.run('intersect({x:300,y:375},{x:950,y:375})'));assert.equal(b.run('intersect({x:300,y:420},{x:950,y:420})'),null)});
test('moving target follows costume rebound',()=>{g.run('jiggle=3;springs[0].x=45;springs[1].x=20');assert.ok(g.run('currentTarget().x>target.x'));assert.ok(g.run('currentTarget().rx>target.rx'))});
test('maximum wobble keeps costume scale positive',()=>{for(const sign of [-1,1]){g.run('springs.forEach(n=>{n.x='+sign+'*65;n.y='+sign+'*40})');assert.ok(g.run('cartoonPose().sx>=.7&&cartoonPose().sx<=1.5&&cartoonPose().sy>0'))}});
test('zero wobble restores resting collision geometry',()=>{g.run('jiggle=0');assert.equal(g.run('currentTarget().x'),g.run('target.x'));assert.equal(g.run('currentTarget().rx'),g.run('target.rx'))});
test('hard hit visibly rebounds through rest',()=>{const b=boot();b.run('slap(6500,1,{x:736,y:325},1000)');let peak=0,rebound=false;for(let i=0;i<120;i++){b.run('integratePhysics(1/120)');const x=b.run('springs[0].x');peak=Math.max(peak,x);if(x<-5)rebound=true}assert.ok(peak>35);assert.ok(rebound)});
console.log(checks+' checks passed.');
