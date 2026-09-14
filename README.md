# SLAP THE BOOTY

A tiny original score-chasing browser arcade game. Emma is a consenting adult female cartoon character wearing an opaque tracksuit; there is no storyline. The realistic character was generated with the built-in image-generation tool; the arena and glove are procedural canvas art; the tone is slapstick, fully clothed, and non-explicit.

## Play

Open `index.html` directly in any modern browser. No build, install, or server required. Optional Google Fonts enhance the typography; system fonts work offline.

- Click **Let's get slappy**. Bring the glove into the left wind-up box, then swipe right through the target. Repeat immediately after the short recovery.
- Touch: drag from the left zone through the shorts.
- Keyboard alternative: hold Space to charge, release to hit. Escape opens the menu; M toggles sound.
- Gold unlocks at 2,000 points; cosmic at 4,000. Cosmetics have identical power.

## Mini GDD

**Pillars:** understand it in seconds; an exaggerated whap on every successful swing; instant pursuit of a bigger number. A neon-lit sports studio sits inside a chunky faux-2000s arcade cabinet.

**Core loop:** enter wind-up zone → arm → accelerate across the target → receive points and feedback → pull back to retry. Misses ask the player to re-arm. Hits have a 520ms recovery to prevent double scoring.

**Scoring:** recent pointer displacement over a rolling 90ms window gives logical pixels/second (capped at 6,500). A swept segment/ellipse collision prevents fast events tunneling through the shorts. Quality depends on distance from the target's vertical center at entry. Points = velocity × (0.35 + 0.65 × quality). The displayed “slap MPH” is an arcade conversion, not a physical speed measurement. Viewport coordinates normalize to an 1100 × 535 arena. Keyboard mode is a charge-based accessibility alternative, capped below the fastest pointer score.

**Juice:** strength-scaled synthesized noise/thump sound, brief character hit stop, two coupled damped springs deforming a 12 × 24 textured mesh, screen shake, confetti, radial impact lines, glove trails, praise tiers, score popup, and record banner. No audio assets or borrowed game assets.

**Persistence:** best score, selected unlocked glove and mute preference are stored locally, with graceful fallback if browser storage is blocked. No accounts, analytics, networking gameplay, or server scoreboard. Browser storage is device/origin-specific.

**Scope:** one character, one arena, three cosmetic hands. Future candidates: alternate stunt volunteers, daily score seeds, more reactive scenery. No progression grind between attempts.

## Implementation

The entire playable game, including an embedded character image, is `index.html`: semantic HTML controls, responsive CSS, Canvas 2D rendering, Web Audio synthesis, and localStorage. No dependencies, framework, build process or secrets. `node tests.cjs` runs deterministic scoring/collision and state regression checks using a minimal DOM/canvas harness. Browser interaction checks complement these tests; synthetic replays do not establish subjective mouse feel on real hardware.

Deploy via GitHub Pages from the root of `main`.

## Visual edition and limits

The character is an original AI-generated realistic 2D render, not a realtime 3D model. The source asset is 941 × 1672 pixels, not native 4K. Canvas rendering follows display pixel density up to 3.5×. Jiggle is a stylized spring-and-mesh simulation with two coupled impact regions, spatial falloff, damping, pinned surrounding body, and adjustable intensity from 0–200%; it is not a biomechanical simulation. The tracksuit render replaced the cartoon after the user requested realism. The first requested shorts asset was rejected by the image service; a neutral sports-uniform render succeeded.

`assets/emma.png` retains the source image; `ART-PROMPT.md` records the final generation prompt. The source is also embedded in the HTML so direct file opening works offline. Small phones work best in landscape; touch and keyboard alternatives are available.
