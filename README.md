# SLAP THE BOOTY — 3D studio edition

[Play in your browser](https://dumb-tony.github.io/Slap-the-Booty/)

Standalone slapstick arcade gameplay with an actual textured character mesh, real lighting, contact shadows and a 3D glove.

## Character and art direction

The primary reference is the generated adult woman in a loose teal/magenta tracksuit, white trainers and a brown ponytail, looking over her shoulder. The reference is reconstructed using Meshy image-to-3D through Higgsfield. Warm gold key lighting, cool fill and pink rim lighting carry the stage presentation. This is single-image reconstruction; unseen geometry is inferred rather than captured or scanned.

The character remains fully clothed. Her resting anatomy is not enlarged by gameplay; the animation is broad stylized garment recoil.

## Controls

Move left to wind up; swipe right through the visible target. Pull left again for instant retry after recovery. Touch uses a drag. Space charges a keyboard hit, Escape opens the menu, and M mutes. Local best scores unlock cosmetic glove colors. Wobble controls recoil intensity.

## Runtime

Three.js renders the GLB with PBR materials, studio lights, environment reflections and contact shadows. The model is normalized to human scale and the target projects from the character into the gameplay plane. The glove follows the pointer at a fixed depth in front of the model.

Two coupled springs drive a smooth, spatially weighted deformation of the garment area. Every frame starts from rest geometry to prevent accumulated drift. Feet and head remain anchored. This is a stylized reaction, not a full soft-body simulation.

The game keeps its pointer-velocity scoring, swept collision detection, impact freeze, particles, sound and local score persistence. The character must finish loading before play begins. A clear error message handles unavailable WebGL or asset-loading failures.

The shipped HTML embeds the renderer and GLB for direct offline opening. No runtime package or CDN downloads are needed other than optional web fonts. Standalone source GLB and authored renderer source accompany the build.

## Validation

See `TESTING.md` for exact final checks. Run `node tests.cjs` for 16 gameplay checks. Run `node src/test-cloth.mjs` for deformation checks. To rebuild: `cd src`, `npm ci`, `npm run build`.

## Mini GDD

One hand, one target, immediate feedback and a bigger personal best.

**Scoring:** pointer displacement over a recent 90ms window measures logical pixels/second, capped at 6,500. Swept segment/ellipse collision catches fast swipes. Centered hits transfer full power; glancing hits lose power. Points = velocity × (0.35 + 0.65 × quality). Displayed slap MPH is a fictional arcade conversion. A 520ms recovery prevents double scoring. Keyboard charging is capped below the fastest mouse score.

## Asset

`assets/emma-3d.glb` is a portable textured mesh reconstructed by Meshy 7 through Higgsfield. It contains 31,201 triangles and one PBR material. The mesh is static; the game supplies garment deformation at runtime. No skeletal animation or full soft-body solver is included. The reference image remains in `assets/emma.png`. Visual quality depends on the generated geometry and texture; this is not a native 4K scan.

## Cloth response update
Garment motion uses volume-compensated compression and stretch with 65 ms and 115 ms follow-through delays. Smooth spatial weights pin the waistband, hands, feet and upper body. Rest geometry stays fixed and the hit target follows the same deformation. The existing Wobble control scales this stylized costume response.

## Arcade presentation update
A cream-and-coral title card, larger score readouts, clearer cosmetic controls and responsive cabinet styling. The glove is a rounded, connected four-digit cartoon shape with a padded cuff, crease details and velocity-responsive tilt. A faster damped spring response sharpens the clothed costume rebound without changing scoring.
