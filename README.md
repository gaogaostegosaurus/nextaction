# nextActionOverlay

## What does it doooooo (generally)

- Snapshots your current character and suggests the next 15 seconds or so of actions. Ideally, it should suggest perfect or close-to-perfect single target dummy rotations.
- Re-snapshots your character after every major action and modifies the action list. This means that the list will often change on proc-based jobs (DNC, RDM), and also that if you screw up or decide that a better action is available, it adjusts the action list to fit.
- On jobs that have rotations revolving heavily around static cooldown abilities (NIN, DNC, SAM etc.) it will attempt to align actions around those abilities so that they can be used ASAP.
- Detects multiple targets being hit and prioritizes AOE actions if a potency threshold is met, switches back on certain actions that imply single targets.

## Limitations

- There's no good way that I know of to see how many targets actually exist in range, so during AOE you just kind of decide what to do.

## Setup

- ACT FFXIV Plugin (obviously)
- ngld OverlayPlugin and Cactbot should also both be installed
- Add the overlay using the Custom preset, Miniparse type (actually not sure how much this matters)
- Overlay URL should be `https://gaogaostegosaurus.github.io/nextActionOverlay/overlay.html`.

## Known issues

- SAM Tsubame-gaeshi is 1 GCD late (always?)
