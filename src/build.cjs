const fs=require('node:fs'),path=require('node:path');
const root=__dirname,original=fs.readFileSync(path.join(__dirname,'game-template.html'),'utf8');
let s=original;
s=s.replace('</style>',()=>fs.readFileSync(path.join(root,'arcade.css'),'utf8')+'</style>');
// Keep the regression-testable game script first; the renderer is loaded after it.
// Until the asset is ready, the menu remains visible and the start button disabled.
s=s.replace('RUBBER-HOSE RULES • ARCADE EDITION','3D STUNT STUDIO • ARCADE EDITION');
s=s.replace('LET\'S GET SLAPPY →','LOADING 3D CHARACTER…');
s=s.replace('class="primary" id="play"','class="primary" id="play" disabled');
s=s.replace('target={x:736,y:325,rx:122,ry:65}','target={x:730,y:300,rx:48,ry:35}');
s=s.replace('function start(){active=true;',"function start(){if(!window.Emma3D?.ready)return;active=true;");
s=s.replace(/function currentTarget\(\)\{[^\n]+\}/,'function currentTarget(){return window.Emma3D?.target||target}');
const a=s.indexOf('function drawEmma(now)'),b=s.indexOf('function drawHand',a);
s=s.slice(0,a)+`function drawEmma(now){if(!active)return;const t=currentTarget();ctx.save();ctx.globalAlpha=armed?.9:.4;ellipse(t.x,t.y,20,20,'#fff5da10','#ffe45e',2);line(t.x-28,t.y,t.x-12,t.y,'#ffe45e',2);line(t.x+12,t.y,t.x+28,t.y,'#ffe45e',2);ctx.restore()}\n`+s.slice(b);
const bg=s.indexOf(' const backdrop=ctx.createLinearGradient'),bgEnd=s.indexOf(' ctx.save();ctx.globalAlpha=active?',bg);
s=s.slice(0,bg)+` const rendered=window.Emma3D?.render({springs,jiggle,time:simTime,hand,glove,active});if(rendered)ctx.drawImage(rendered,0,0,W,H);else{ctx.fillStyle='#151622';ctx.fillRect(0,0,W,H)}\n`+s.slice(bgEnd);
s=s.replace('drawHand(hand.x,hand.y,now)','void 0').replace('else drawHand(275,330+Math.sin(simTime*2)*10,now)','else void 0');
s=s.replace('PADDED SHORTS','TARGET').replace('BIG PADDING. EXTREMELY QUESTIONABLE SPORT.','ONE HAND. ONE VERY SILLY SPORT.');
s=s.replace('let jiggle=2;','let jiggle=1.5;').replace('value="2"><output','value="1.5"><output').replace('>200%</output>','>150%</output>');
const fixture=process.argv.includes('--fixture');
const modelPath=path.join(root,fixture?'smoke.glb':'../assets/emma-3d.glb');
if(!fs.existsSync(modelPath))throw new Error('No inspected 3D asset exists; refusing to build a replacement game.');
const bytes=fs.readFileSync(modelPath);if(bytes.toString('ascii',0,4)!=='glTF')throw new Error('Asset is not a GLB');
const bundle=fs.readFileSync(path.join(root,'renderer.bundle.js'),'utf8');
const boot=`<script>${bundle.replaceAll('</script','<\\/script')}</script><script>
window.addEventListener('emma3d-ready',()=>{document.querySelector('#play').disabled=false;document.querySelector('#play').textContent="LET'S GET SLAPPY →";document.querySelector('#status').textContent='READY. PULL BACK AND WHAP.'});
window.addEventListener('emma3d-error',()=>{document.querySelector('#play').textContent='3D COULD NOT START';document.querySelector('#status').textContent='Enable WebGL or try another browser, then reload.'});
const modelBytes=Uint8Array.from(atob('${bytes.toString('base64')}'),c=>c.charCodeAt(0));
window.Emma3D.load(modelBytes.buffer).catch(()=>{});
</script>`;
s=s.replace('</body>',()=>boot+'</body>');fs.writeFileSync(path.join(root,fixture?'fixture-game.html':'../index.html'),s);
console.log('Built offline-ready 3D game, '+s.length+' characters.');
