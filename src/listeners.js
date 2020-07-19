// All possible events:
// https://github.com/quisquous/cactbot/blob/master/plugin/CactbotEventSource/CactbotEventSource.cs

// Listed in order of appearance on reload

addOverlayListener('EnmityTargetData', (e) => {
  // console.log(`EnmityTargetData: ${JSON.stringify(e)}`);
  nextActionOverlay.EnmityTargetData(e);
});

addOverlayListener('onInCombatChangedEvent', (e) => {
  // console.log(`onInCombatChangedEvent: ${JSON.stringify(e)}`);
  nextActionOverlay.onInCombatChangedEvent(e);
});

// eslint-disable-next-line no-unused-vars
addOverlayListener('onZoneChangedEvent', (e) => {
  // Not sure how to use this but I'm sure there's a fun way to
  // console.log(`onZoneChangedEvent: ${JSON.stringify(e)}`);
  // nextActionOverlay.zone = e.detail.zoneName;
});

addOverlayListener('onPlayerChangedEvent', (e) => {
  // console.log(`onPlayerChangedEvent: ${JSON.stringify(e)}`);
  nextActionOverlay.onPlayerChangedEvent(e);
});

addOverlayListener('onLogEvent', (e) => {
  nextActionOverlay.onLogEvent(e);
});

// Haven't figured out how to use the rest of these...

addOverlayListener('onPartyWipe', (e) => {
  // Leaving this here to see when/what it outputs
  // eslint-disable-next-line no-console
  console.log(`onPartyWipe: ${JSON.stringify(e)}`);
});

// eslint-disable-next-line no-unused-vars
addOverlayListener('onGameExistsEvent', (e) => {
  // console.log(`onGameExistsEvent: ${JSON.stringify(e)}`);
  // nextActionOverlay.gameExists = e.detail.exists; // Appears to only have this
});

// eslint-disable-next-line no-unused-vars
addOverlayListener('onGameActiveChangedEvent', (e) => {
  // console.log(`onGameActiveChangedEvent: ${JSON.stringify(e)}`);
  // nextActionOverlay.gameActive = e.detail.active; // Appears to only have this
});

// This seems to have been taken out?
// eslint-disable-next-line no-unused-vars
// addOverlayListener('onInitializeOverlay', (e) => {
// });

callOverlayHandler({ call: 'cactbotRequestState' });
