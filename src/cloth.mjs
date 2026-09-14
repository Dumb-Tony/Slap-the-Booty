// Broad garment recoil: displacement is spatially weighted and vanishes at
// shoes and face. Every frame starts from rest, so deformation cannot drift.
export function clothOffset(x,y,z,springs,amount){
 const strength=Math.max(0,Math.min(Number(amount)||0,3));
 const a=springs[0],b=springs[1],weight=Math.exp(-Math.pow((y-.88)/.24,2)*2);
 const side=x<0?a:b;
 return [x+(a.x+b.x)*.0009*strength*weight,y+(a.y+b.y)*.0006*strength*weight,z+side.x*.0004*strength*weight];
}
