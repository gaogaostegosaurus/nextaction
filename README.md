# nextActionOverlay

## What does it doooooo (generally)

- Jobs at least partially supported: PLD WAR GNB MNK NIN SAM DNC RDM
- Snapshots your current character and suggests the next 15 seconds or so of actions. Ideally, it should show an basic opener and then suggest perfect or close-to-perfect single target "dummy play".
- Re-snapshots your character after every major action and modifies the action list. This means that the list will often change on proc-based jobs (DNC, RDM), and also that if you screw up, disconnect, or decide on a better action situationally, it adjusts the action list for when a return to "dummy play" is desired.
- On jobs that have rotations revolving around static abilities used on cooldown (like SAM, PLD etc.) it attempts to automatically align actions around those abilities so that they can be used ASAP.
- Detects multiple targets being hit and prioritizes AOE actions if a potency threshold is met.

## Limitations

- The only way it knows to update targets is to see how many things an AoE attack hits, so don't blame it for suggesting (for example) Impact over Verthunder when the latter is obviously correct.

## Setup

- ACT FFXIV Plugin (obviously)
- ngld OverlayPlugin and cactbot should also both be installed (maybe just OverlayPlugin soon as cactbot's functions will be integrated soon?)
- Add the overlay using the Custom preset, Miniparse type (actually not sure how much this matters)
- Overlay URL should be `https://gaogaostegosaurus.github.io/nextActionOverlay/overlay.html`.

## Known issues

- Most buff "windows" seem to be 1 GCD off ATM due to a change in how buffs were calculated
- PLD: Haven't rewritten GCD alignment around buff use 
- WAR: Inner Release window is weird (seems to not see a last usage of Fell Cleave). Probably a miscalculation somewhere
- MNK: Perfect Balance window is a little janky - doesn't appear to be consistently sure what the final WS will be
- NIN: Mudra activation isn't detected under certain conditions - haven't been able to consistently replicate, some jank with Huton
- SAM: AOE doesn't work right, Meikyo can be weird