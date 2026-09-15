import * as THREE from 'three';
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';
import { RoomEnvironment } from 'three/addons/environments/RoomEnvironment.js';
import { clothOffset, createClothMotion } from './cloth.mjs';
const sampleMotion=createClothMotion();

// Real GLB geometry, physically based materials and lit depth. This module is
// staged until the reference-based character is available and visually checked.
const api={ready:false,error:null,canvas:null,load,render,turn:3.5,target:null,stats:null};
window.Emma3D=api;
let renderer,scene,camera,actor,parts=[],floor,environment,gloveGroup,gloveSurface;
const normalizedHeight=1.8;
function setup(){
 if(renderer)return;
 renderer=new THREE.WebGLRenderer({alpha:false,antialias:true,preserveDrawingBuffer:true});
 renderer.setPixelRatio(Math.min(window.devicePixelRatio||1,2));
 renderer.setSize(1100,535,false);renderer.outputColorSpace=THREE.SRGBColorSpace;
 renderer.toneMapping=THREE.ACESFilmicToneMapping;renderer.toneMappingExposure=.8;
 renderer.shadowMap.enabled=true;renderer.shadowMap.type=THREE.PCFShadowMap;
 api.canvas=renderer.domElement;
 scene=new THREE.Scene();scene.background=new THREE.Color('#151622');
 scene.fog=new THREE.Fog('#151622',6,16);
 camera=new THREE.OrthographicCamera(-2.35,2.35,1.143,-1.143,.1,30);
 camera.position.set(0,1.28,6);camera.lookAt(0,.94,0);
 const pmrem=new THREE.PMREMGenerator(renderer);environment=pmrem.fromScene(new RoomEnvironment(),.04);scene.environment=environment.texture;
 const ambient=new THREE.HemisphereLight('#e3eaff','#323040',1.15);scene.add(ambient);
 const key=new THREE.DirectionalLight('#ffd3a0',3.6);key.position.set(-2,4,3);key.castShadow=true;key.shadow.mapSize.set(2048,2048);key.shadow.camera.left=-3;key.shadow.camera.right=3;key.shadow.camera.top=3;key.shadow.camera.bottom=-3;key.shadow.normalBias=.015;scene.add(key);
 const rim=new THREE.DirectionalLight('#ff6c97',2.7);rim.position.set(3,2,-2);scene.add(rim);
 const fill=new THREE.DirectionalLight('#79dfe0',2);fill.position.set(-3,2,-1);scene.add(fill);
 floor=new THREE.Mesh(new THREE.PlaneGeometry(30,30),new THREE.MeshStandardMaterial({color:'#272530',roughness:.4,metalness:.35}));floor.rotation.x=-Math.PI/2;floor.receiveShadow=true;floor.position.y=-.015;scene.add(floor);
 const pedestal=new THREE.Mesh(new THREE.CylinderGeometry(.78,.85,.09,96),new THREE.MeshStandardMaterial({color:'#35313b',metalness:.65,roughness:.25}));pedestal.position.set(.77,.01,0);pedestal.receiveShadow=true;scene.add(pedestal);
 const ring=new THREE.Mesh(new THREE.TorusGeometry(.79,.008,8,96),new THREE.MeshStandardMaterial({color:'#e1bd75',emissive:'#c18a2c',emissiveIntensity:2,metalness:.7,roughness:.25}));ring.rotation.x=Math.PI/2;ring.position.set(.77,.06,0);scene.add(ring);
 for(const [x,color] of [[-.06,'#76cfc5'],[1.76,'#ff79a2']]){
  const tube=new THREE.Mesh(new THREE.CylinderGeometry(.009,.009,1.8,12),new THREE.MeshBasicMaterial({color}));tube.position.set(x,1.1,-.55);scene.add(tube);
 }
 gloveGroup=new THREE.Group();gloveGroup.name='Slap glove';
 gloveSurface=new THREE.MeshStandardMaterial({color:'#fff5d8',roughness:.55,metalness:.04});
 const cuffMaterial=new THREE.MeshStandardMaterial({color:'#3ec5b4',roughness:.4,metalness:.12});
 const ellipsoid=(name,x,y,z,sx,sy,sz,material=gloveSurface)=>{const m=new THREE.Mesh(new THREE.SphereGeometry(1,24,16),material);m.name=name;m.position.set(x,y,z);m.scale.set(sx,sy,sz);m.castShadow=true;gloveGroup.add(m);return m};
 ellipsoid('Palm',0,0,0,.14,.15,.052);
 for(const [x,y,length,angle] of [[-.10,.16,.16,-.18],[-.037,.21,.20,-.07],[.035,.21,.19,.06],[.10,.16,.15,.18]]){
  const finger=new THREE.Mesh(new THREE.CapsuleGeometry(.031,length,6,12),gloveSurface);finger.position.set(x,y,0);finger.rotation.z=-angle;finger.castShadow=true;gloveGroup.add(finger);
 }
 const thumb=ellipsoid('Thumb',.155,-.01,.008,.055,.105,.048);thumb.rotation.z=-.85;
 ellipsoid('Cuff',0,-.15,-.012,.14,.056,.075,cuffMaterial);
 gloveGroup.rotation.z=-.3;scene.add(gloveGroup);
}
async function load(buffer){
 try{
  setup();api.ready=false;api.error=null;
  const gltf=await new GLTFLoader().parseAsync(buffer,'');gltf.scene.updateMatrixWorld(true);
  const bounds=new THREE.Box3().setFromObject(gltf.scene),size=bounds.getSize(new THREE.Vector3()),center=bounds.getCenter(new THREE.Vector3());
  if(!Number.isFinite(size.y)||size.y<=0)throw new Error('The GLB has no usable character geometry.');
  const scale=normalizedHeight/size.y,normalizer=new THREE.Matrix4().makeScale(scale,scale,scale).multiply(new THREE.Matrix4().makeTranslation(-center.x,-bounds.min.y,-center.z));
  if(actor){scene.remove(actor);for(const p of parts)p.geometry.dispose()}
  actor=new THREE.Group();actor.name='Emma';actor.position.set(.77,.06,0);parts=[];
  let vertices=0,triangles=0;
  gltf.scene.traverse(node=>{
   if(!node.isMesh)return;
   const geometry=node.geometry.clone();geometry.applyMatrix4(new THREE.Matrix4().multiplyMatrices(normalizer,node.matrixWorld));
   const materials=(Array.isArray(node.material)?node.material:[node.material]).map(m=>{const c=m.clone();c.side=THREE.DoubleSide;if(c.isMeshStandardMaterial){c.envMapIntensity=.45;c.roughness=Math.max(.45,c.roughness);c.metalness=Math.min(.15,c.metalness)}return c});
   const mesh=new THREE.Mesh(geometry,materials.length===1?materials[0]:materials);mesh.name=node.name;mesh.castShadow=true;mesh.receiveShadow=true;mesh.frustumCulled=false;
   const rest=new Float32Array(geometry.attributes.position.array);parts.push({geometry,mesh,rest});actor.add(mesh);vertices+=geometry.attributes.position.count;triangles+=(geometry.index?.count||geometry.attributes.position.count)/3;
  });
  if(!parts.length)throw new Error('No renderable mesh was found in the GLB.');
  scene.add(actor);api.stats={vertices,triangles,meshes:parts.length,sourceDimensions:size.toArray()};api.ready=true;
  render({springs:[{x:0,y:0},{x:0,y:0}],jiggle:0,time:0});
  window.dispatchEvent(new CustomEvent('emma3d-ready',{detail:api.stats}));return api.stats;
 }catch(e){api.error=e.message;api.ready=false;window.dispatchEvent(new CustomEvent('emma3d-error',{detail:e.message}));throw e}
}
function project(point){const p=point.clone().project(camera);return{x:(p.x+1)*550,y:(1-p.y)*267.5}}
function render({springs,jiggle,time=0,hand={x:250,y:325},glove=0,active=false}){
 if(!api.ready)return null;
 actor.rotation.y=api.turn;
 const amount=Math.min(jiggle,3),motion=sampleMotion(time,springs);
 for(const part of parts){
  const position=part.geometry.attributes.position,rest=part.rest;
  for(let i=0;i<position.count;i++){
   const k=i*3,x=rest[k],y=rest[k+1],z=rest[k+2];
   // Broad cloth recoil fades continuously above the waist and below the thighs.
   // It never changes rest proportions or exposes underlying anatomy.
   const moved=clothOffset(x,y,z,springs,amount,motion);
   position.setXYZ(i,...moved);
  }
  position.needsUpdate=true;part.geometry.computeVertexNormals();
 }
 actor.updateMatrixWorld(true);const c=actor.localToWorld(new THREE.Vector3(...clothOffset(0,.88,-.12,springs,amount,motion)));
 const t=project(c),right=project(c.clone().add(new THREE.Vector3(.19,0,0))),top=project(c.clone().add(new THREE.Vector3(0,.13,0)));
 api.target={x:t.x,y:t.y,rx:Math.max(22,Math.abs(right.x-t.x)),ry:Math.max(18,Math.abs(top.y-t.y))};
 const cursor=new THREE.Vector3(hand.x/550-1,1-hand.y/267.5,0).unproject(camera);
 const direction=new THREE.Vector3(0,0,-1).applyQuaternion(camera.quaternion);
 const distance=(.8-cursor.z)/direction.z;cursor.addScaledVector(direction,distance);
 gloveGroup.position.copy(cursor);gloveGroup.visible=active;gloveSurface.color.set(['#fff5d8','#f2c25c','#b59bff'][glove]||'#fff5d8');
 renderer.render(scene,camera);return api.canvas;
}
