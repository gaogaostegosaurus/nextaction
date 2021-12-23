# nextaction

## What does it doooooo (hopefully)

- Snapshots your current character and suggests the next 15 seconds or so of actions. Ideally, it should show an basic opener and then suggest perfect or close-to-perfect single target "dummy play".
- Re-snapshots your character after every major action and modifies the action list. This means that the list will often change on proc-based jobs (DNC, RDM), and also that if you screw up, disconnect, or decide on a better action situationally, it adjusts the action list for when a return to "dummy play" is desired.
- On jobs that have rotations revolving around static abilities used on cooldown (like SAM, PLD etc.) it attempts to automatically align actions around those abilities so that they can be used ASAP.

## Setup

- ACT FFXIV Plugin (obviously)
- ngld OverlayPlugin and cactbot should also both be installed (maybe just OverlayPlugin soon as cactbot's functions will be integrated soon?)
- Add the overlay using the Custom preset, Miniparse type (actually not sure how much this matters)
- Overlay URL should be `https://gaogaostegosaurus.github.io/nextActionOverlay/index.html`.
