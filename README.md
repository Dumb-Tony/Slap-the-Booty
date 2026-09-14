# SLAP THE BOOTY

[Play in your browser](https://dumb-tony.github.io/Slap-the-Booty/)

An original, fully clothed slapstick arcade game. Emma is an adult cartoon stunt volunteer in a loose jersey, oversized opaque padded shorts, elbow guards and trainers. No storyline: pull back, whap, chase a bigger number.

## Play

Open `index.html` directly in a modern browser; no install or build required.

- Move the glove into the left wind-up zone, then swipe right through the padded shorts.
- Pull left again to retry after the short recovery.
- Touch: drag from the left zone through the target. Phones work best sideways.
- Hold Space and release for the keyboard charge alternative. Escape or Menu opens the menu; M toggles sound.
- Gold unlocks at 2,000 points, cosmic at 4,000. All gloves have equal scoring power.
- Wobble ranges from 0–300%, defaulting to 200%. It changes animation and the visible target geometry, not the score formula.

## Mini GDD

**Core:** a one-input velocity game with immediate exaggerated feedback and instant retries. The new cartoon silhouette pairs a normal jersey with comically oversized protective padding.

**Scoring:** pointer displacement over a recent 90ms window measures logical pixels/second, capped at 6,500. Swept segment/ellipse collision catches fast swipes. Centered hits transfer full power; glancing hits lose power. Points = velocity × (0.35 + 0.65 × quality). Displayed slap MPH is a fictional arcade conversion. A 520ms recovery prevents double scoring. Keyboard charging is capped below the fastest mouse score.

**Physics:** two coupled damped springs drive costume displacement, squash/stretch, shear and torso recoil. Lower damping produces several visible rebounds. The ponytail follows the upper body, and legs connect the moving costume to planted shoes. Spring integration uses small substeps and bounded travel. Costume scale is constrained to stay positive. The collision ellipse and target marker follow the costume's position and scale. This is deliberately cartoon motion, not biomechanical simulation.

**Feedback:** synthesized strength-scaled slap audio, hit stop, shake, confetti, impact rays, trails, score popups and personal-best banners. Local storage preserves best score, glove selection and mute. Blocked storage gracefully falls back to a session-only game.

## Build and verification

Everything needed to play is in `index.html`: procedural Canvas 2D artwork, UI, physics and synthesized audio. Optional Google Fonts fall back to system fonts offline. Artwork is resolution independent and follows display pixel density up to 3.5×. No game framework, account or server is needed.

Run `node tests.cjs` for 19 deterministic regression checks. See `TESTING.md` for browser replay results and limits. GitHub Pages deploys from the root of `main`.

The previous realistic portrait in `assets/emma.png` and its generation notes in `ART-PROMPT.md` are retained as historical source assets; the current game does not load them. The supplied reference image is not included in this project.
