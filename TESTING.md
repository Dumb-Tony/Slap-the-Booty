# 3D update verification

16 deterministic gameplay checks pass: swept hits/misses, velocity, arming, scoring once, retry, quality, pointer idle, menu, persistence/fallback, drawing, spring settling, projected target, and loading gate. Deformation tests pass: rest stability, bounded recoil, intensity clamp, pinned head/feet, and no accumulated drift.

Local browser input replay: two consecutive target swipes scored 3,324 at 90% quality and 3,835 at 88%; retry worked and the gold glove unlocked. The actual textured GLB was visually inspected in the game from the rear three-quarter angle. The final renderer uses supported PCF shadows.

These are automated input replays and visual checks, not human mouse-feel testing. Touchscreen feel and audio have not been independently assessed.

Collision is a projected ellipse, not exact mesh contact. Garment recoil uses coupled springs and vertex deformation, not a full soft-body simulation. A single image cannot specify unseen geometry precisely. WebGL is required; low-end devices may run slowly. Best scores are browser-local.

Additional local browser checks: best score 3,835 survived reload; an above-target swipe reported AIR SLAP and left the score unchanged; M toggled mute successfully.
