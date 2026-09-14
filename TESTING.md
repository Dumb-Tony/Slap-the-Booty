# Cartoon update verification

`node tests.cjs`: 19 checks pass. Coverage includes swept hits and misses, capped velocity, arming, perfect accuracy, double-score prevention, retries, glancing hits, idle-pointer handling, menu reset, storage persistence/fallback, rendering, settling, enlarged target geometry, collision following costume motion, bounded scale at maximum wobble, zero wobble, and a visible rebound through the resting position.

Local browser automated input replays:

- Started game and hit the visible enlarged target: 6,066 points at 90% quality.
- Swiped above the costume: miss, with score unchanged.
- Increased Wobble to 300%, then hit again: 6,263 points at 94% quality.
- Inspected resting and impact frames: squash/stretch stays within the arena and legs follow the moving padding while shoes remain planted.
- No browser warnings or errors were reported.

These are automated input replays and visual checks, not a human mouse-feel assessment. Physical touchscreen feel and audio playback have not been independently assessed. Existing desktop/mobile UI remains responsive; small phones work best in landscape. This update changes the character, target geometry and physics rather than page layout.

## Known limits

The collision is an ellipse approximating the costume rather than a per-pixel mask. Cartoon motion uses coupled springs and affine deformation, not full 3D soft-body simulation. High scores are browser-local and not tamper-proof.
