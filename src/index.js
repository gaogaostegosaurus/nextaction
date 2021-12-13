/* eslint-disable prefer-regex-literals */

/* global
addOverlayListener, startOverlayEvents,
allActionData, playerStatsData,
syncOverlay, setStatus, removeStatus,
showIcon, fadeIcon,
rdmLoop, rdmActionMatch, rdmStatusMatch,  rdmChangedTarget
*/

// All possible events:
// https://github.com/quisquous/cactbot/blob/master/plugin/CactbotEventSource/CactbotEventSource.cs

// eslint-disable-next-line no-unused-vars
const loopPlayerData = {};
// eslint-disable-next-line no-unused-vars
const loopTargetData = {};

let actionArray = [];
// eslint-disable-next-line no-unused-vars
let recastArray = [];
// eslint-disable-next-line no-unused-vars
let statusArray = [];
// eslint-disable-next-line no-unused-vars
const loopActionArray = [];
// eslint-disable-next-line no-unused-vars
const loopRecastArray = [];
// eslint-disable-next-line no-unused-vars
const loopStatusArray = [];

let actionData = [];
let castingActionData = [];

// eslint-disable-next-line no-unused-vars
const statusData = [];

let actionEffectRegex;
let statusRegex;
let startsCastingRegex;
let cancelActionRegex;

let loopTimeout;
let actionMatchTimestamp = 0;

// Constant across jobs
const playerStatsRegex = new RegExp('^.{15}(?<logType>PlayerStats 0C):(?<jobID>[\\d]+):(?<strength>[\\d]+):(?<dexterity>[\\d]+):(?<vitality>[\\d]+):(?<intelligence>[\\d]+):(?<mind>[\\d]+):(?<piety>[\\d]+):(?<attackPower>[\\d]+):(?<directHitRate>[\\d]+):(?<criticalHit>[\\d]+):(?<attackMagicPotency>[\\d]+):(?<healingMagicPotency>[\\d]+):(?<determination>[\\d]+):(?<skillSpeed>[\\d]+):(?<spellSpeed>[\\d]+):0:(?<tenacity>[\\d]+):'); // This regex is always static for now, maybe not in future?
const fadeOutRegex = new RegExp('^.{15}Director 21:8[\\dA-F]{7}:40000005:');

let overlayReady = false;

document.addEventListener('DOMContentLoaded', () => {
  // Not sure if this is necessary but it seems cool!
  // console.log('DOM fully loaded and parsed');
  startOverlayEvents();

  // Reset arrays for player, recasts, and status duration/stacks
  overlayReady = true;
});

const supportedJobs = ['RDM'];

const playerData = {};

const onPlayerChangedEvent = (e) => {
  if (e.detail.name !== playerData.name
  || e.detail.job !== playerData.job
  || e.detail.level !== playerData.level) {
    // Triggers on initial load and job or level change

    if (!supportedJobs.includes(e.detail.job)) {
      overlayReady = false;
      return;
    }

    // Set new player data
    playerData.name = e.detail.name;
    playerData.level = e.detail.level;
    playerData.job = e.detail.job;
    playerData.jobLowerCase = e.detail.job.toLowerCase();

    playerData.decimalid = e.detail.id; // ID defaults to decimal value
    playerData.id = e.detail.id.toString(16).toUpperCase();

    const jobLowerCase = playerData.job.toLowerCase();
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
    actionData = allActionData.filter(
      (element) => (element.affinity === job || element.affinity === role)
      && element.level <= level,
    );

    // Apply job and level specific traits defined in js
    [`${jobLowerCase}Traits`]();

    // Create separate list for casted actions
    castingActionData = actionData.filter((element) => (element.cast > 0));

    // Create Regexes
    const actionMap = actionData.map((element) => element.name);
    const actionNameRegex = actionMap.join('|');

    const castingActionMap = castingActionData.map((element) => element.name);
    const castingActionNameRegex = castingActionMap.join('|');

    actionEffectRegex = new RegExp(`^.{15}(?<logType>ActionEffect 15|AOEActionEffect 16):(?<sourceID>${id}):(?<sourceName>${name}):(?<actionID>[\\dA-F]{1,8}):(?<actionName>${actionNameRegex}):(?<targetID>[\\dA-F]{8}):`);
    statusRegex = new RegExp('^.{15}(?<logType>StatusAdd 1A|StatusRemove 1E):(?<statusID>[\\dA-F]{2,8}):(?<statusName>.+?):(?<statusSeconds>[0-9]+\\.[0-9]+):(?<sourceID>[\\dA-F]{8}):(?<sourceName>.+?):(?<targetID>[\\dA-F]{8}):');
    startsCastingRegex = new RegExp(`^.{15}(?<logType>StartsCasting 14):(?<sourceID>${id}):(?<sourceName>${name}):(?<actionID>[\\dA-F]{1,8}):(?<actionName>${castingActionNameRegex}):(?<targetID>[\\dA-F]{8}):`);
    cancelActionRegex = new RegExp(`^.{15}(?<logType>CancelAction 17):(?<sourceID>${id}):(?<sourceName>${name}):(?<actionID>[\\dA-F]{1,8}):(?<actionName>${castingActionNameRegex}):(?<cancelReason>Cancelled|Interrupted):`);

    // eslint-disable-next-line no-console
    console.log(`Changed to ${job}${level}, matched actions are ${actionNameRegex}`);
  } else {
    const { job } = playerData;
    const jobLowerCase = job.toLowerCase();
    // Just the usual player changed event
    `${jobLowerCase}PlayerChangedEvent`(e);
  }
};

// eslint-disable-next-line no-unused-vars
const onLogEvent = (e) => {
  if (!overlayReady) { return; }
  // const { playerData } = nextActionOverlay;
  // const { supportedJobs } = nextActionOverlay;

  const { logs } = e.detail;
  const { length } = e.detail.logs;

  for (let i = 0; i < length; i += 1) {
    const actionMatch = logs[i].match(actionEffectRegex);
    const statusMatch = logs[i].match(statusRegex);
    const startsCastingMatch = logs[i].match(startsCastingRegex);
    const cancelActionMatch = logs[i].match(cancelActionRegex);
    const playerStatsMatch = logs[i].match(playerStatsRegex);
    const fadeOutMatch = logs[i].match(fadeOutRegex);

    if (actionMatch && Date.now() - actionMatchTimestamp > 10) {
      actionMatch({
        logType: actionMatch.logType,
        actionName: actionMatch.actionName,
        targetID: actionMatch.targetID,
      });
    } else if (statusMatch) {
      statusMatch({
        // logType: statusMatch.logType,
        statusName: statusMatch.statusName,
        statusSeconds: statusMatch.statusSeconds,
        sourceID: statusMatch.sourceID,
        targetID: statusMatch.targetID,
      });
    } else if (startsCastingMatch) {
      startsCastingMatch({
        // logType: startsCastingMatch.logType,
        actionName: startsCastingMatch.actionName,
        // targetID: startsCastingMatch.targetID,
      });
    } else if (cancelActionMatch) {
      cancelActionMatch({
        // logType: cancelActionMatch.logType,
        actionName: cancelActionMatch.actionName,
        // cancelReason: cancelActionMatch.cancelReason,
      });
    } else if (playerStatsMatch) {
      // playerStatsMatch({ piety, skillSpeed, spellSpeed });
    } else if (fadeOutMatch) {
      // Reset data on wipes?
      clearTimeout(loopTimeout);
      recastArray = [];
      statusArray = [];
      actionArray = [];
      syncOverlay();
    }
  }
};

// eslint-disable-next-line no-unused-vars
const actionMatch = ({ logType, actionName, targetID } = {}) => {
  if (Date.now() - actionMatchTimestamp < 10) { return; }
  actionMatchTimestamp = Date.now();
  const index = actionData.findIndex((element) => element.name === actionName);
  actionArray = actionArray.splice(index, 1);
  if (playerData.job === 'RDM') { rdmActionMatch({ logType, actionName, targetID }); }
  // else if (playerData.job === 'SMN') { smnActionMatch({ logType, actionName, targetID }); }
};

// eslint-disable-next-line no-unused-vars
const statusMatch = ({
  statusName, statusSeconds, sourceID, targetID,
} = {}) => {
  setStatus({
    name: statusName, sourceID, targetID, duration: statusSeconds,
  });

  if (playerData.job === 'RDM') {
    rdmStatusMatch({ statusName });
  }
};

// eslint-disable-next-line no-unused-vars
const startsCastingMatch = ({ actionName } = {}) => {
  removeStatus({ name: 'Combo' });

  // Call loop again with casting parameter
  if (playerData.job === 'RDM') { rdmLoop({ casting: actionName }); }

  fadeIcon({ name: actionName });
};

// eslint-disable-next-line no-unused-vars
const cancelActionMatch = ({ actionName } = {}) => {
  showIcon({ name: actionName });
  if (playerData.job === 'RDM') { rdmLoop(); }
};

// eslint-disable-next-line no-unused-vars
const startLoop = () => {
  clearTimeout(loopTimeout);
  const { job } = playerData;
  if (job === 'RDM') { loopTimeout = setTimeout(rdmLoop, playerData.gcd * 2); }
};

// eslint-disable-next-line no-unused-vars
const getActionProperty = ({ name, property } = {}) => {
  const index = actionData.findIndex((e) => e.name === name);

  if (actionData[index][property]) { return actionData[index][property]; }
  return '';
};

const targetData = {};
let overlayVisible = false;

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

  if (e.Target.ID !== targetData.decimalid) {
    targetData.name = e.Target.Name; // Set new targetData
    targetData.id = e.Target.ID.toString(16).toUpperCase();
    if (job === 'RDM') { rdmChangedTarget(); }
  }

  if (e.Target) { // Put stuff that should be constantly updated here
    targetData.distance = e.Target.EffectiveDistance; // Distance to "outside of circle"
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
  if (overlayReady === true) { onPlayerChangedEvent(e); }
});
