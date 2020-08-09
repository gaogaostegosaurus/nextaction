# nextActionOverlay

## What does it doooooo (generally)

- Snapshots your current character and suggests the next 15 seconds or so of actions
- Re-snapshots your character after every major action and modifies the action list. This means that if you screw up or decide that a better action is available (see below) it adjusts the action list to fit
- Switches to AoE mode if it detects multiple targets being hit, switches back on certain actions that imply single targets
- Ideally, it should suggest perfect or close-to-perfect dummy rotations

## Limitations

- There's no good way that I know of to see how many targets actually exist in range, so during AOE you have to kind of decide what to do

## Setup

- ACT FFXIV Plugin (obviously)
- ngld OverlayPlugin and Cactbot should also both be installed
- Add the overlay using the Custom preset, Miniparse type (actually not sure how much this matters)
- Overlay URL should be `https://gaogaostegosaurus.github.io/nextActionOverlay/overlay.html`.
