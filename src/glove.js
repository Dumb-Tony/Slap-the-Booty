import * as THREE from 'three';
export function createGlove(){
 const group=new THREE.Group();group.name='Arcade glove';
 const surface=new THREE.MeshStandardMaterial({color:'#fff4db',roughness:.66,metalness:0});
 const ink=new THREE.MeshStandardMaterial({color:'#343249',roughness:.85});
 const trim=new THREE.MeshStandardMaterial({color:'#ff6087',roughness:.5});
 const s=new THREE.Shape();
 s.moveTo(-.105,-.16);s.bezierCurveTo(-.17,-.08,-.16,.035,-.155,.12);
 s.lineTo(-.174,.25);s.bezierCurveTo(-.185,.32,-.102,.342,-.086,.275);s.lineTo(-.064,.16);
 s.lineTo(-.058,.325);s.bezierCurveTo(-.059,.396,.032,.403,.038,.33);s.lineTo(.04,.174);
 s.lineTo(.075,.29);s.bezierCurveTo(.10,.36,.175,.325,.154,.258);s.lineTo(.119,.09);
 s.bezierCurveTo(.125,.05,.145,.022,.166,.04);s.lineTo(.20,.082);s.bezierCurveTo(.256,.143,.31,.076,.269,.03);
 s.lineTo(.192,-.075);s.bezierCurveTo(.165,-.115,.126,-.117,.112,-.16);s.closePath();
 const geo=new THREE.ExtrudeGeometry(s,{depth:.045,bevelEnabled:true,bevelThickness:.027,bevelSize:.024,bevelSegments:5,curveSegments:18,steps:1});geo.translate(0,0,-.035);
 const puff=(x,y)=>.027*Math.exp(-Math.pow((x-.005)/.15,2)-Math.pow((y-.015)/.17,2));
 const points=geo.attributes.position;
 for(let i=0;i<points.count;i++){const z=points.getZ(i);if(z>-.012)points.setZ(i,z+puff(points.getX(i),points.getY(i))*Math.min(1,(z+.012)/.022))}geo.computeVertexNormals();
 const outline=new THREE.Mesh(geo,new THREE.MeshBasicMaterial({color:'#28263b',side:THREE.BackSide}));outline.scale.set(1.045,1.035,1.08);group.add(outline);
 const body=new THREE.Mesh(geo,surface);body.castShadow=true;group.add(body);
 const detail=(points,r,material)=>{const curve=new THREE.CatmullRomCurve3(points.map(p=>new THREE.Vector3(p[0],p[1],p[2]+puff(p[0],p[1]))));const mesh=new THREE.Mesh(new THREE.TubeGeometry(curve,20,r,8,false),material);group.add(mesh)};
 // Three classic back-of-glove creases, curved rather than printed flat.
 for(const x of [-.075,-.013,.049])detail([[x-.012,.025,.043],[x,.064,.045],[x+.004,.108,.043]],.005,ink);
 detail([[.115,-.056,.043],[.132,-.017,.047],[.175,.017,.043]],.004,ink);
 const cuff=new THREE.Mesh(new THREE.CapsuleGeometry(.059,.155,8,24),ink);cuff.rotation.z=Math.PI/2;cuff.position.set(.005,-.163,-.005);cuff.castShadow=true;group.add(cuff);
 const band=new THREE.Mesh(new THREE.CapsuleGeometry(.048,.16,8,24),trim);band.rotation.z=Math.PI/2;band.position.set(.005,-.17,.034);group.add(band);
 const rim=new THREE.Mesh(new THREE.TorusGeometry(.093,.012,10,40),surface);rim.scale.set(1.28,.37,1);rim.position.set(.005,-.14,.051);group.add(rim);
 let last=null,tilt=0;
 function pose(hand,time,springs){
  if(last&&time>last.time){const dt=Math.min(.05,time-last.time),speed=(hand.x-last.x)/Math.max(.008,dt);tilt+=(THREE.MathUtils.clamp(speed/3000,-1,1)-tilt)*(1-Math.exp(-dt*18))}
  if(!last||time!==last.time)last={x:hand.x,time};
  group.rotation.set(-.10,.14+tilt*.18,-.25-tilt*.24);
  const bounce=Math.tanh((springs[0].x+springs[1].x)/90)*.035;
  group.scale.set(1.12*(1+bounce),1.12*(1-bounce),1.12);
 }
 return {group,surface,pose};
}
