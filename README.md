# nextActionOverlay

## What does it doooooo (generally)

- Jobs supported: PLD GNB MNK NIN SAM DNC RDM
- Snapshots your current character and suggests the next 15 seconds or so of actions. Ideally, it should suggest perfect or close-to-perfect single target "dummy play".
- Re-snapshots your character after every major action and modifies the action list. This means that the list will often change on proc-based jobs (DNC, RDM), and also that if you screw up, disconnect, or decide on a better action situationally, it adjusts the action list for when a return to "dummy play" is desired.
- On jobs that have rotations revolving around static abilities used on cooldown (like SAM, etc.) it attempts to automatically align actions around those abilities so that they can be used ASAP. (I found and fixed the 1 GCD drift.)
- Detects multiple targets being hit and prioritizes AOE actions if a potency threshold is met.

## Limitations

- The only way it knows to update targets is to see how many things an AoE attack hits, so don't blame it for suggesting (for example) Impact over Verthunder when the latter is obviously correct.

## Setup

- ACT FFXIV Plugin (obviously)
- ngld OverlayPlugin and cactbot should also both be installed (maybe just OverlayPlugin soon as cactbot's functions will be integrated soon?)
- Add the overlay using the Custom preset, Miniparse type (actually not sure how much this matters)
- Overlay URL should be `https://gaogaostegosaurus.github.io/nextActionOverlay/overlay.html`.

## Known issues

- MNK: Perfect Balance window is a little janky - doesn't appear to be consistently sure what the final WS will be
- NIN: Mudra activation isn't detected under certain conditions - haven't been able to consistently replicate