# Verification

- `node tests.cjs`: 16 passing deterministic checks: fast swept collisions, misses, velocity cap, arming, perfect hits, double-score prevention, retry, glancing accuracy, idle-pointer handling, menu reset, storage persistence/fallback, render paths, damped-spring settling, pinned mesh regions, and zero-jiggle geometry.
- Local browser, automated UI input: started from title; dragged through the visible target (5,856 points, 85% quality); dragged above target (miss with score unchanged); pulled back and successfully retried; toggled mute; returned to menu. No browser errors or warnings were reported.
- Reload retained personal best and mute preference.
- Inspected desktop and 390 × 844 layouts. Phones are supported, but landscape provides a larger aiming area. Touch logic is implemented; physical touchscreen feel has not been tested.
- These are automated input replays and visual checks, not a human subjective mouse-feel assessment. Audio synthesis was exercised in-browser but not independently listened to or calibrated.

## Known limits

The realistic portrait is 941 × 1672, not native 4K. The interactive character is a 2D spring-deformed image, not a 3D skeletal character or physically accurate soft-body simulation. Cosmetic unlocks are local and all have equal scoring power. Local scores are not tamper-proof.
