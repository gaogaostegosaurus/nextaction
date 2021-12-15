/* eslint-disable prefer-regex-literals */

/* global
addOverlayListener startOverlayEvents
syncOverlay fadeIcon unfadeIcon
baseActionData baseStatusData playerStatsData getActionProperty
setActionRecast setStatus removeStatus
rdmTraits rdmActionMatch rdmStatusMatch rdmTargetChanged rdmPlayerChanged
rdmLoopGCDAction rdmLoopGCDActionResult rdmLoopOGCDAction rdmLoopOGCDActionResult
*/

// All possible events:
// https://github.com/quisquous/cactbot/blob/master/plugin/CactbotEventSource/CactbotEventSource.cs

const maxActions = 20; // Maximum number of actions looked up
// eslint-disable-next-line no-unused-vars
const maxIcons = 10;

// eslint-disable-next-line no-unused-vars
let recastArray = [];
// eslint-disable-next-line no-unused-vars
let statusArray = [];
let overlayArray = [];

// eslint-disable-next-line no-unused-vars
let loopPlayerData;
let loopRecastArray;
let loopStatusArray;

// eslint-disable-next-line no-unused-vars
let statusData = [];
let actionData = [];
let castingActionData = [];
const playerData = {};
const targetData = {};

let actionEffectRegex;
let statusRegex;
let startsCastingRegex;
let cancelActionRegex;

let loopTimeout;
let actionMatchTimestamp = 0;

// Constant across jobs
const playerStatsRegex = new RegExp('^.{15}(?<logType>PlayerStats) 0C:(?<jobID>[\\d]+):(?<strength>[\\d]+):(?<dexterity>[\\d]+):(?<vitality>[\\d]+):(?<intelligence>[\\d]+):(?<mind>[\\d]+):(?<piety>[\\d]+):(?<attackPower>[\\d]+):(?<directHitRate>[\\d]+):(?<criticalHit>[\\d]+):(?<attackMagicPotency>[\\d]+):(?<healingMagicPotency>[\\d]+):(?<determination>[\\d]+):(?<skillSpeed>[\\d]+):(?<spellSpeed>[\\d]+):0:(?<tenacity>[\\d]+):'); // This regex is always static for now, maybe not in future?
const fadeOutRegex = new RegExp('^.{15}(?<logType>Director) 21:8[\\dA-F]{7}:40000005:');

const supportedJobs = ['RDM'];
let overlayVisible = false;
let overlayReady = false;
let regexReady = false;
// const overlayTest = () => {
//   actionData = testActionData;
//   overlayArray = [{ name: 'GCD1' }, { name: 'OGCD2' }];
//   console.log(overlayArray);

//   syncOverlay();
// };

document.addEventListener('DOMContentLoaded', () => {
  // Not sure if this is necessary but it seems cool!
  // console.log('DOM fully loaded and parsed');
  // overlayTest();
  startOverlayEvents();
  // Reset arrays for player, recasts, and status duration/stacks
  overlayReady = true;
});

const advanceLoopTime = ({ time } = {}) => {
  // Reduces numbers since these arrays can't really use Date.now() compares
  loopRecastArray.forEach((element) => element.recast === element.recast - time * 1000);
  loopStatusArray.forEach((element) => element.duration === element.duration - time * 1000);
};

// eslint-disable-next-line no-unused-vars
const startLoop = ({ delay = 0, casting } = {}) => {
  if (playerData.job === undefined) { return; }

  // console.log('Starting loop');
  // Array for actions to sync to overlay
  overlayArray = [];

  // Clone arrays/objects for looping
  loopPlayerData = { ...playerData };
  loopRecastArray = [...recastArray];
  loopStatusArray = [...statusArray];

  let ogcdWindow = delay;

  if (casting) {
    // console.log(`Casting ${casting}`);
    overlayArray.push({ name: casting });
    let actionCast = getActionProperty({ name: casting, property: 'cast' });
    if (actionCast === undefined) {
      // This shouldn't happen, but just in case
      // eslint-disable-next-line no-console
      console.log('Casting action has undefined cast time');
      actionCast = 0;
    }
    advanceLoopTime({ time: actionCast });
    ogcdWindow = playerData.gcd - actionCast;
  }

  while (overlayArray.length <= maxActions) {
    if (ogcdWindow <= 0) {
      let actionName;

      // Call GCD Action functions
      if (playerData.job === 'RDM') { actionName = rdmLoopGCDAction(); }

      overlayArray.push({ name: actionName });

      // Job specific results
      if (playerData.job === 'RDM') { ogcdWindow = rdmLoopGCDActionResult({ actionName }); }
    }

    // Advance just a little bit
    advanceLoopTime({ time: 0.1 });
    ogcdWindow -= 0.1;

    let weaveCount = 1;

    // Inner loop for OGCDs
    while (ogcdWindow > 0.75) { // Arbritrary minimum?
      // Find next OGCD
      let actionName;
      if (playerData.job === 'RDM') { actionName = rdmLoopOGCDAction({ weaveCount }); }

      // Push into array
      if (actionName !== undefined) {
        overlayArray.push({ name: actionName, ogcd: true });

        // Non-generic stuff
        if (playerData.job === 'RDM') { rdmLoopOGCDActionResult({ actionName }); }

        // General action results
        setActionRecast({ name: actionName, array: loopRecastArray });
        const actionDataIndex = actionData.findIndex((element) => element.name === actionName);
        if (actionData[actionDataIndex].status !== undefined) {
          setStatus({ name: actionData[actionDataIndex].status, array: loopStatusArray });
        }
      }

      // Increment for next weave
      advanceLoopTime({ time: 1 });
      ogcdWindow -= 1;
      weaveCount += 1;
    }

    // Advance remaining ogcd window
    advanceLoopTime({ time: ogcdWindow });
    ogcdWindow = 0;
  }

  syncOverlay();
};

const onPlayerChangedEvent = (e) => {
  if (e.detail.name !== playerData.name
  || e.detail.job !== playerData.job
  || e.detail.level !== playerData.level) {
    // Triggers on initial load and job or level change

    if (!supportedJobs.includes(e.detail.job)) {
      overlayReady = false;
      return;
    }

    overlayReady = true;

    // Set new player data
    playerData.name = e.detail.name;
    playerData.level = e.detail.level;
    playerData.job = e.detail.job;
    playerData.jobLowerCase = e.detail.job.toLowerCase();

    playerData.decimalid = e.detail.id; // ID defaults to decimal value
    playerData.id = e.detail.id.toString(16).toUpperCase();

    const { name } = playerData;
    const { level } = playerData;
    const { job } = playerData;
    const { id } = playerData;

    // Set some default values
    playerData.gcd = 2.5;
    playerData.mpRegen = 200;

    // set role
    if (['PLD', 'WAR', 'DRK', 'GNB'].includes(job)) {
      playerData.role = 'Tank';
    } else if (['WHM', 'SCH', 'AST', 'SGE'].includes(job)) {
      playerData.role = 'Healer';
    } else if (['MNK', 'DRG', 'NIN', 'SAM', 'RPR'].includes(job)) {
      playerData.role = 'Melee DPS';
    } else if (['BRD', 'MCH', 'DNC'].includes(job)) {
      playerData.role = 'Physical Ranged DPS';
    } else if (['BLM', 'SMN', 'RDM', 'BLU'].includes(job)) {
      playerData.role = 'Magical Ranged DPS';
    }

    const { role } = playerData;

    // Filter into new action data array
    actionData = baseActionData.filter(
      (element) => (element.affinity === job || element.affinity === role)
      && element.level <= level,
    );

    statusData = [...baseStatusData];

    // Apply job and level specific traits defined in js
    if (job === 'RDM') {
      rdmTraits();
    }
    // Create separate list for casted actions
    castingActionData = actionData.filter((element) => (element.cast > 0));

    // Create Regexes
    const actionMap = actionData.map((element) => element.name);
    const actionNameRegex = actionMap.join('|');
    // console.log(`Matched actions: ${actionNameRegex}`);

    const castingActionMap = castingActionData.map((element) => element.name);
    const castingActionNameRegex = castingActionMap.join('|');
    // console.log(`Matched cast actions: ${castingActionNameRegex}`);

    actionEffectRegex = new RegExp(`^.{15}(?<logType>ActionEffect|AOEActionEffect) 1[56]:(?<sourceID>${id}):(?<sourceName>${name}):(?<actionID>[\\dA-F]{1,8}):(?<actionName>${actionNameRegex}):(?<targetID>[\\dA-F]{8}):`);
    statusRegex = new RegExp(`^.{15}(?<logType>StatusAdd|StatusRemove) 1[AE]:(?<statusID>[\\dA-F]{2,8}):(?<statusName>.+?):(?<statusSeconds>[0-9]+\\.[0-9]+):(?<sourceID>[\\dA-F]{8}):(?<sourceName>${name}):(?<targetID>[\\dA-F]{8}):`);
    if (castingActionData.length > 0) {
      startsCastingRegex = new RegExp(`^.{15}(?<logType>StartsCasting) 14:(?<sourceID>${id}):(?<sourceName>${name}):(?<actionID>[\\dA-F]{1,8}):(?<actionName>${castingActionNameRegex}):(?<targetID>[\\dA-F]{8}):`);
    }
    cancelActionRegex = new RegExp(`^.{15}(?<logType>CancelAction) 17:(?<sourceID>${id}):(?<sourceName>${name}):(?<actionID>[\\dA-F]{1,8}):(?<actionName>${castingActionNameRegex}):(?<cancelReason>Cancelled|Interrupted):`);
    regexReady = true;
  } else if (playerData.job === 'RDM') { rdmPlayerChanged(e); }
};

const actionMatch = ({ logType, actionName, targetID } = {}) => {
  actionMatchTimestamp = Date.now();
  // const actionDataIndex = actionData.findIndex((element) => element.name === actionName);
  syncOverlay();
  let delay;

  // Job specific
  if (playerData.job === 'RDM') { delay = rdmActionMatch({ logType, actionName, targetID }); }
  // else if (playerData.job === 'SMN') { smnActionMatch({ logType, actionName, targetID }); }

  // All jobs
  setActionRecast({ name: actionName });
  if (delay !== undefined) { startLoop({ delay }); }
};

const statusMatch = ({
  logType, statusName, statusSeconds, sourceID, targetID,
} = {}) => {
  if (playerData.job === 'RDM') {
    rdmStatusMatch({ logType, statusName, sourceID });
  }
  setStatus({
    name: statusName, sourceID, targetID, duration: statusSeconds,
  });
};

const startsCastingMatch = ({ actionName } = {}) => {
  // console.log(`Casting ${actionName}`);
  removeStatus({ name: 'Combo' });

  // Call loop again with casting parameter
  if (playerData.job === 'RDM') { startLoop({ casting: actionName }); }

  fadeIcon({ name: actionName });
};

const cancelActionMatch = ({ actionName } = {}) => {
  unfadeIcon({ name: actionName });
  if (playerData.job === 'RDM') { startLoop(); }
};

// eslint-disable-next-line no-unused-vars
const onLogEvent = (e) => {
  if (regexReady === false) { return; }
  // const { playerData } = nextActionOverlay;
  // const { supportedJobs } = nextActionOverlay;

  const { logs } = e.detail;
  const { length } = e.detail.logs;

  for (let i = 0; i < length; i += 1) {
    const actionEffectLine = logs[i].match(actionEffectRegex);
    const statusLine = logs[i].match(statusRegex);
    const startsCastingLine = logs[i].match(startsCastingRegex);
    const cancelActionLine = logs[i].match(cancelActionRegex);
    const playerStatsLine = logs[i].match(playerStatsRegex);
    const fadeOutLine = logs[i].match(fadeOutRegex);

    if (actionEffectLine && Date.now() - actionMatchTimestamp > 10) {
      // console.log(actionEffectLine);
      actionMatch({
        logType: actionEffectLine.groups.logType,
        actionName: actionEffectLine.groups.actionName,
        targetID: actionEffectLine.groups.targetID,
      });
    } else if (statusLine) {
      statusMatch({
        logType: statusLine.groups.logType,
        statusName: statusLine.groups.statusName,
        statusSeconds: statusLine.groups.statusSeconds,
        sourceID: statusLine.groups.sourceID,
        targetID: statusLine.groups.targetID,
      });
    } else if (startsCastingLine) {
      startsCastingMatch({
        // logType: startsCastingMatch.logType,
        actionName: startsCastingLine.groups.actionName,
        // targetID: startsCastingMatch.targetID,
      });
    } else if (cancelActionLine) {
      cancelActionMatch({
        // logType: cancelActionMatch.logType,
        actionName: cancelActionLine.groups.actionName,
        // cancelReason: cancelActionMatch.cancelReason,
      });
    } else if (playerStatsLine) {
      // playerStatsMatch({ piety, skillSpeed, spellSpeed });
    } else if (fadeOutLine) {
      // Reset data on wipes?
      clearTimeout(loopTimeout);
      recastArray = [];
      statusArray = [];
      overlayArray = [];
      syncOverlay();
    }
  }
};

const EnmityTargetData = (e) => {
  if (!overlayReady) { return; }
  const { job } = playerData;

  // Possible properties for e.Target are
  // ID - as decimal number instead of hex
  // OwnerID - often "0", I assume this is for pets or something
  // Type
  // TargetID
  // Job
  // Name
  // CurrentHP, MaxHP
  // PosX, PosY, PosZ, Rotation
  // Distance - Distance to center of target
  // EffectiveDistance - Distance to edge of target
  // Effects - Array of effects (?)

  // Copied from stringify for notes:
  // {"type":"EnmityTargetData","Target":{"ID":1111111111,"OwnerID":0,"Type":2,"TargetID":275370607,"Job":0,"Name":"Striking Dummy","CurrentHP":254,"MaxHP":16000,"PosX":-706.4552,"PosY":23.5000038,"PosZ":-583.5873,"Rotation":-0.461016417,"Distance":"2.78","EffectiveDistance":0,"Effects":[{"BuffID":508,"Stack":0,"Timer":10.7531652,"ActorID":275370607,"isOwner":false}]},"Focus":null,"Hover":null,"TargetOfTarget":{"ID":275370607,"OwnerID":0,"Type":1,"TargetID":3758096384,"Job":30,"Name":"Lyn Tah'row","CurrentHP":87008,"MaxHP":87008,"PosX":-708.9726,"PosY":23.5000038,"PosZ":-582.397156,"Rotation":2.01241565,"Distance":"0.00","EffectiveDistance":0,"Effects":[{"BuffID":365,"Stack":10,"Timer":30,"ActorID":3758096384,"isOwner":false},{"BuffID":360,"Stack":10,"Timer":30,"ActorID":3758096384,"isOwner":false}]},"Entries":[{"ID":275370607,"OwnerID":0,"Name":"Lyn Tah'row","Enmity":100,"isMe":true,"HateRate":100,"Job":30}]} (Source: file:///C:/asdf/asdf/asdf/listeners.js, Line: 219)

  // const { playerData } = nextActionOverlay;
  // const { job } = playerData;

  if (e.Target) {
    targetData.distance = e.Target.EffectiveDistance; // Distance to "outside of circle"

    if (e.Target.ID !== targetData.decimalid) {
      targetData.name = e.Target.Name; // Set new targetData
      targetData.id = e.Target.ID.toString(16).toUpperCase();
      if (job === 'RDM') { rdmTargetChanged(); }
    }
  }

  // Control overlay visiblity based on target
  if (targetData.id && targetData.id.startsWith('4') && targetData.distance <= 30) {
    if (overlayVisible !== true) {
      document.getElementById('nextdiv').classList.replace('next-hide', 'next-show');
      overlayVisible = true;
    }
  } else if (playerData.combat === true) {
    if (overlayVisible !== true) {
      document.getElementById('nextdiv').classList.replace('next-hide', 'next-show');
      overlayVisible = true;
    }
  } else {
    document.getElementById('nextdiv').classList.replace('next-show', 'next-hide');
    overlayVisible = true;
  }
};

// console.log('stuff');

// addOverlayListener('LogLine', (data) => {
//   console.log('other stuff');
//   console.log(`line: ${data.line} | rawLine: ${data.rawLine}`);
// });

// Listed in order of appearance on reload (afaik)

const onInCombatChangedEvent = (e) => {
  if (playerData.combat !== e.detail.inGameCombat) { // Combat status changed
    playerData.combat = e.detail.inGameCombat; // true or false
    // overlayToggle();
  }
};

const onPartyWipe = () => {
  recastArray = [];
  statusArray = [];
};

const calculateRecast = ({
  recast = 2.5,
} = {}) => {
  const { speed } = playerData;
  const { level } = playerData;

  const newRecast = Math.floor(Math.floor(((1000 - Math.floor(
    (130 * (speed - playerStatsData[level - 1].baseStat)) / playerStatsData[level - 1].levelMod,
  )) * recast * 1000) / 1000) / 10) / 100;

  // Put GCD-related buffing stuff here later
  return newRecast;
};

// eslint-disable-next-line no-unused-vars
const playerStatsMatch = ({ piety, skillSpeed, spellSpeed } = {}) => {
  const speed = Math.max(skillSpeed, spellSpeed);
  const { level } = playerData;
  playerData.speed = speed;
  playerData.gcd = calculateRecast();
  playerData.mpRegen = 200 + Math.floor(
    (150 * (piety - playerStatsData[level - 1].baseStat)) / playerStatsData[level - 1].levelMod,
  );

  for (let index = 0; index < actionData.length; index += 1) {
    if (['Spell', 'Weaponskill'].includes(actionData[index].type)) {
      if (actionData[index].cast) {
        actionData[index].cast = calculateRecast({ recast: actionData[index].cast });
      }
      if (actionData[index].recast) {
        actionData[index].recast = calculateRecast({ recast: actionData[index].recast });
      }
    }
  }
};

addOverlayListener('EnmityTargetData', (e) => {
  // console.log(`EnmityTargetData: ${JSON.stringify(e)}`);
  EnmityTargetData(e);
});

addOverlayListener('onInCombatChangedEvent', (e) => {
  // console.log(`onInCombatChangedEvent: ${JSON.stringify(e)}`);
  onInCombatChangedEvent(e);
});

addOverlayListener('onLogEvent', (e) => {
  if (overlayReady === true) { onLogEvent(e); }
});

addOverlayListener('onPartyWipe', (e) => {
  // console.log(`onPartyWipe: ${JSON.stringify(e)}`);
  if (overlayReady === true) { onPartyWipe(e); }
});

addOverlayListener('onPlayerChangedEvent', (e) => {
  // console.log(`onPlayerChangedEvent: ${JSON.stringify(e)}`);
  onPlayerChangedEvent(e);
});

// // Haven't figured out how to use the rest of these...

// addOverlayListener('onZoneChangedEvent', (e) => {
//   // Not sure how to use this but I'm sure there's a fun way to
//   console.log(`onZoneChangedEvent: ${JSON.stringify(e)}`);
// });

// addOverlayListener('onGameExistsEvent', (e) => {
//   // console.log(`onGameExistsEvent: ${JSON.stringify(e)}`);
//   // gameExists = e.detail.exists; // Appears to only have this
// });

// addOverlayListener('onGameActiveChangedEvent', (e) => {
//   // console.log(`onGameActiveChangedEvent: ${JSON.stringify(e)}`);
//   // gameActive = e.detail.active; // Appears to only have this
// });
