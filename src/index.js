/* eslint-disable prefer-regex-literals */
/* eslint-disable no-use-before-define */
/* eslint-disable prefer-const */
/* eslint-disable no-unused-vars */

// Bunch of globals since I don't know how to code

// Config options
const supportedJobs = ['NIN'];
const maxIcons = 10;
const maxActions = 100;

let currentPlayer = {};
let currentTarget = {};
let currentRecastArray = [];
let currentStatusArray = [];

let loopPlayer = {};
let loopRecastArray = [];
let loopStatusArray = [];

// These regexes don't need additional strings --- declare as const
// const logTypeRegex = new RegExp('^.{15}(?<logType>.+?) [\\d]{2}:');
const playerStatsRegex = new RegExp('^.{15}(?<logType>PlayerStats) 0C:(?<jobID>[\\d]+):(?<strength>[\\d]+):(?<dexterity>[\\d]+):(?<vitality>[\\d]+):(?<intelligence>[\\d]+):(?<mind>[\\d]+):(?<piety>[\\d]+):(?<attackPower>[\\d]+):(?<directHitRate>[\\d]+):(?<criticalHit>[\\d]+):(?<attackMagicPotency>[\\d]+):(?<healingMagicPotency>[\\d]+):(?<determination>[\\d]+):(?<skillSpeed>[\\d]+):(?<spellSpeed>[\\d]+):0:(?<tenacity>[\\d]+):'); // This regex is always static for now, maybe not in future?
const fadeOutRegex = new RegExp('^.{15}(?<logType>Director) 21:8[\\dA-F]{7}:40000005:');

// These rely on some string
let actionEffectRegex;
let statusRegex;
let castingRegex;
// let gaugeRegex;

let overlayArray = [];
let statusData = [];
let actionData = [];

let overlayReady = false;
let regexReady = false;
let overlayClass = '';
let actionMatchTimestamp = 0;

// All possible events?:
// https://github.com/quisquous/cactbot/blob/master/plugin/CactbotEventSource/CactbotEventSource.cs

document.addEventListener('DOMContentLoaded', () => {
  console.log('DOM fully loaded and parsed');
  overlayReady = true;
  startOverlayEvents();
});

addOverlayListener('onPlayerChangedEvent', (e) => {
  // console.log(`onPlayerChangedEvent: ${JSON.stringify(e)}`);
  if (overlayReady === true) { onPlayerChangedEvent(e); }
});

addOverlayListener('onInCombatChangedEvent', (e) => {
  // console.log(`onInCombatChangedEvent: ${JSON.stringify(e)}`);
  if (regexReady === true) { onInCombatChangedEvent(e); }
});

// addOverlayListener('onPartyWipe', (e) => {
//   // console.log(`onPartyWipe: ${JSON.stringify(e)}`);
//   if (overlayReady === true) { onPartyWipe(e); }
// });

addOverlayListener('EnmityTargetData', (e) => {
  // console.log(`EnmityTargetData: ${JSON.stringify(e)}`);
  if (regexReady === true) { EnmityTargetData(e); }
});

addOverlayListener('onLogEvent', (e) => {
  if (regexReady === true) { onLogEvent(e); }
});

// Possily switch to this later? Don't know if it's different/better...
// addOverlayListener('LogLine', (data) => {
//   console.log(`line: ${data.line} | rawLine: ${data.rawLine}`);
// });

const onPlayerChangedEvent = (e) => {
  // This triggers on job or level change
  // eslint-disable-next-line max-len
  if (e.detail.name !== currentPlayer.name || e.detail.level !== currentPlayer.level || e.detail.job !== currentPlayer.job) {
    // Clear row
    document.getElementById('actions').innerHTML = '';

    // Set regex as not available
    regexReady = false;

    // Quit here if job isn't one of the supported ones atm
    if (!supportedJobs.includes(e.detail.job)) {
      // eslint-disable-next-line no-console
      console.log(`${e.detail.job} not supported yet`);
      return;
    }

    // Set new player data
    currentPlayer.id = e.detail.id.toString(16).toUpperCase(); // ID defaults to decimal value
    currentPlayer.name = e.detail.name;
    currentPlayer.level = e.detail.level;
    currentPlayer.job = e.detail.job;

    const { id } = currentPlayer;
    const { name } = currentPlayer;
    const { level } = currentPlayer;
    const { job } = currentPlayer;

    // Set role
    if (['PLD', 'WAR', 'DRK', 'GNB'].includes(job)) {
      currentPlayer.role = 'Tank';
    } else if (['WHM', 'SCH', 'AST', 'SGE'].includes(job)) {
      currentPlayer.role = 'Healer';
    } else if (['MNK', 'DRG', 'NIN', 'SAM', 'RPR'].includes(job)) {
      currentPlayer.role = 'Melee DPS';
    } else if (['BRD', 'MCH', 'DNC'].includes(job)) {
      currentPlayer.role = 'Physical Ranged DPS';
    } else if (['BLM', 'SMN', 'RDM', 'BLU'].includes(job)) {
      currentPlayer.role = 'Magical Ranged DPS';
    }

    const { role } = currentPlayer.role;

    // eslint-disable-next-line no-console
    console.log(`Changed to ${job}${level} (${role})`);

    // Set some default values
    currentPlayer.gcd = 2.5;
    currentPlayer.mpRegen = 200;

    // Directly cloned so that it can be modified without changing base "level 1" version
    actionData = JSON.parse(JSON.stringify(baseActionData));

    // Filter out unnecessary actions
    actionData = actionData.filter(
      (element) => element.level <= level
      && (element.affinity === job || element.affinity === currentPlayer.role),
    );

    statusData = JSON.parse(JSON.stringify(baseStatusData));

    // Apply job and level specific traits
    switch (job) {
      case 'NIN':
        ninTraits();
        break;
      default:
    }

    // Create separate list for casted actions
    const castingActionData = actionData.filter((element) => (element.cast > 0));

    const actionMap = actionData.map((element) => element.name);
    const actionNameRegex = actionMap.join('|');

    const castingActionMap = castingActionData.map((element) => element.name);
    const castingActionNameRegex = castingActionMap.join('|');

    // Define Regexes
    actionEffectRegex = new RegExp(`^.{15}(?<logType>ActionEffect|AOEActionEffect) 1[56]:(?<sourceID>${id}):(?<sourceName>${name}):(?<actionID>[\\dA-F]{1,8}):(?<actionName>${actionNameRegex}):(?<targetID>[\\dA-F]{8}):`);
    statusRegex = new RegExp(`^.{15}(?<logType>StatusAdd|StatusRemove) 1[AE]:(?<statusID>[\\dA-F]{2,8}):(?<statusName>.+?):(?<statusSeconds>[0-9]+\\.[0-9]+):(?<sourceID>${id}):(?<sourceName>${name}):(?<targetID>[\\dA-F]{8}):(?<targetName>.+?):(?<statusStacks>[\\d]{2}):`);
    castingRegex = new RegExp(`^.{15}(?<logType>StartsCasting|CancelAction) 1[47]:(?<sourceID>${id}):(?<sourceName>${name}):(?<actionID>[\\dA-F]{1,8}):(?<actionName>${castingActionNameRegex}):(?<targetID>[\\dA-F]{8})?:`);
    // gaugeRegex = new RegExp(
    //   `^.{15}(?<logType>Gauge) 1F:${playerID}:(?<gaugeHex>[\\dA-F]{0,8}):`,
    // );
    regexReady = true;
  }

  const { job } = currentPlayer;

  // Usual stuff

  switch (job) {
    case 'NIN':
      ninPlayerChanged(e);
      break;
    default:
  }
};

const onInCombatChangedEvent = (e) => {
  if (currentPlayer.combat !== e.detail.inGameCombat) { // Combat status changed
    currentPlayer.combat = e.detail.inGameCombat; // true or false
    // console.log(`currentPlayer.combat ${currentPlayer.combat} ${e.detail.inGameCombat}`);
    // Not sure the above doesn't work consistently...
    toggleOverlayClass();
  }
};

const EnmityTargetData = (e) => {
  // Stop if regexes aren't loaded up yet
  if (regexReady !== true) { return; }

  // Possible properties for e.Target are
  // ID - as decimal number instead of hex
  // OwnerID - often "0", I assume this is for pets or something?
  // Type
  // TargetID
  // Job
  // Name
  // CurrentHP, MaxHP
  // PosX, PosY, PosZ, Rotation
  // Distance - Distance to center of target
  // EffectiveDistance - Distance to edge of target
  // Effects - Array of effects (?)

  // Example from JSON.stringify:
  // {"type":"EnmityTargetData","Target":{"ID":1111111111,"OwnerID":0,"Type":2,"TargetID":275370607,"Job":0,"Name":"Striking Dummy","CurrentHP":254,"MaxHP":16000,"PosX":-706.4552,"PosY":23.5000038,"PosZ":-583.5873,"Rotation":-0.461016417,"Distance":"2.78","EffectiveDistance":0,"Effects":[{"BuffID":508,"Stack":0,"Timer":10.7531652,"ActorID":275370607,"isOwner":false}]},"Focus":null,"Hover":null,"TargetOfTarget":{"ID":275370607,"OwnerID":0,"Type":1,"TargetID":3758096384,"Job":30,"Name":"Lyn Tah'row","CurrentHP":87008,"MaxHP":87008,"PosX":-708.9726,"PosY":23.5000038,"PosZ":-582.397156,"Rotation":2.01241565,"Distance":"0.00","EffectiveDistance":0,"Effects":[{"BuffID":365,"Stack":10,"Timer":30,"ActorID":3758096384,"isOwner":false},{"BuffID":360,"Stack":10,"Timer":30,"ActorID":3758096384,"isOwner":false}]},"Entries":[{"ID":275370607,"OwnerID":0,"Name":"Lyn Tah'row","Enmity":100,"isMe":true,"HateRate":100,"Job":30}]} (Source: file:///C:/asdf/asdf/asdf/listeners.js, Line: 219)

  if (e.Target) {
    // Distance to "outside of circle" - helps if this is continuously updated?
    currentTarget.distance = e.Target.EffectiveDistance;

    if (e.Target.ID !== currentTarget.decimalID) {
      // Everything here runs once per target change (hopefully)
      currentTarget.decimalID = e.Target.ID;
      currentTarget.id = e.Target.ID.toString(16).toUpperCase();
      currentTarget.name = e.Target.Name; // Set new targetData

      const { job } = currentPlayer;
      switch (job) {
        case 'NIN':
          ninTargetChanged();
          break;
        default:
      }
    }
    toggleOverlayClass();
  } else if (currentTarget.decimalID !== 0) {
    // Runs once per target loss (hopefully)
    // Set ID 0 for conditonals
    currentTarget.id = '';
    currentTarget.decimalID = 0;
    currentTarget.distance = 9999;
    toggleOverlayClass();
  }
};

const toggleOverlayClass = () => {
  const { id } = currentTarget;
  const { combat } = currentPlayer;
  // Control overlay visiblity based on target
  if (id.startsWith('4') && currentTarget.distance < 30 && overlayClass !== 'show') {
    console.log('Showing overlay (enemy less than 30 yalms away targeted)');
    document.getElementById('nextdiv').classList.replace('next-hide', 'next-show');
    overlayClass = 'show';
  } else if (combat === true && overlayClass !== 'show') {
    console.log(`Showing overlay (combat = ${combat})`);
    document.getElementById('nextdiv').classList.replace('next-hide', 'next-show');
    overlayClass = 'show';
  } else if (!(id.startsWith('4') && currentTarget.distance < 30) && combat === false && overlayClass === 'show') {
    console.log('Hiding overlay');
    document.getElementById('nextdiv').classList.replace('next-show', 'next-hide');
    overlayClass = 'hide';
  }
};

// eslint-disable-next-line no-unused-vars
const onLogEvent = (e) => {
  const { logs } = e.detail;
  const { length } = e.detail.logs;

  for (let i = 0; i < length; i += 1) {
    const actionEffectLine = logs[i].match(actionEffectRegex);
    const statusLine = logs[i].match(statusRegex);
    const castingLine = logs[i].match(castingRegex);
    const playerStatsLine = logs[i].match(playerStatsRegex);
    // const gaugeLine = logs[i].match(gaugeRegex);
    const fadeOutLine = logs[i].match(fadeOutRegex);

    if (actionEffectLine && Date.now() - actionMatchTimestamp > 10) {
      actionMatchTimestamp = Date.now(); // Timestamp to prevent bouncing
      const { logType } = actionEffectLine.groups;
      const { actionName } = actionEffectLine.groups;
      const { targetID } = actionEffectLine.groups;
      // console.log(`onLogEvent actionEffectLine: ${logType} ${actionName} ${targetID}`);
      actionMatch({ logType, actionName, targetID });
    } else if (statusLine) {
      // console.log(`${statusLine.groups.statusName} ${statusLine.groups.statusSeconds}`);
      statusMatch({
        logType: statusLine.groups.logType,
        statusName: statusLine.groups.statusName,
        statusSeconds: parseFloat(statusLine.groups.statusSeconds),
        sourceID: statusLine.groups.sourceID,
        targetID: statusLine.groups.targetID,
        statusStacks: parseInt(statusLine.groups.statusStacks, 16),
        // Not 100% sure that statusStacks is a hexdecimal, but might as well
      });
    } else if (castingLine) {
      castingMatch({
        logType: castingLine.groups.logType,
        actionName: castingLine.groups.actionName,
      });
    } else if (playerStatsLine) {
      playerStatsMatch({
        piety: playerStatsLine.groups.piety,
        skillSpeed: playerStatsLine.groups.skillSpeed,
        spellSpeed: playerStatsLine.groups.spellSpeed,
      });
    // } else if (gaugeLine) {
      // something something
    } else if (fadeOutLine) {
      // Reset data on wipes?
      // clearTimeout(loopTimeout);
      currentStatusArray = [];
      currentRecastArray = [];
      overlayArray = [];
      syncOverlay();
    }
  }
};

// eslint-disable-next-line no-unused-vars
const actionMatch = ({
  logType,
  actionName,
  targetID,
  loop = false,
} = {}) => {
  const { job } = currentPlayer;

  switch (job) {
    case 'NIN':
      ninActionMatch({
        logType, actionName, targetID, loop,
      });
      break;
    default:
  }
};

// eslint-disable-next-line no-unused-vars
const statusMatch = ({
  logType, statusName, statusSeconds, sourceID, targetID, statusStacks,
} = {}) => {
  switch (logType) {
    case 'StatusAdd':
      addStatus({
        statusName, sourceID, targetID, duration: statusSeconds, stacks: statusStacks,
      });
      break;
    case 'StatusRemove':
      removeStatus({ statusName });
      break;
    default:
  }
};

// eslint-disable-next-line no-unused-vars
const castingMatch = ({ logType, actionName } = {}) => {
  switch (logType) {
    case 'StartsCasting':
      // Call loop again with casting parameter
      startLoop({ casting: actionName });
      fadeIcon({ name: actionName });
      break;
    case 'CancelAction':
      startLoop();
      unfadeIcon({ name: actionName });
      break;
    default:
  }
};

// eslint-disable-next-line no-unused-vars
const playerStatsMatch = ({ piety, skillSpeed, spellSpeed } = {}) => {
  const speed = Math.max(skillSpeed, spellSpeed);
  const { level } = currentPlayer;
  currentPlayer.speed = speed;
  currentPlayer.gcd = getRecast();
  currentPlayer.mpRegen = 200 + Math.floor(
    (150 * (piety - playerStatsData[level - 1].baseStat)) / playerStatsData[level - 1].levelMod,
  );

  // for (let index = 0; index < actionData.length; index += 1) {
  //   if (['Spell', 'Weaponskill'].includes(actionData[index].type)) {
  //     if (actionData[index].cast) {
  //       actionData[index].cast = getRecast({ recast: actionData[index].cast });
  //     }
  //     if (actionData[index].recast) {
  //       actionData[index].recast = getRecast({ recast: actionData[index].recast });
  //     }
  //   }
  // }
};

// eslint-disable-next-line no-unused-vars
const addActionRecast = ({
  actionName,
  recast, // In seconds
  loop = false,
} = {}) => {
  // eslint-disable-next-line no-console
  if (!actionName) { console.log('addActionRecast: no actionName'); return; }

  let recastArray = currentRecastArray;
  if (loop) { recastArray = loopRecastArray; }

  let newRecast = recast;
  const actionDataIndex = actionData.findIndex((element) => element.name === actionName);
  if (actionDataIndex === -1) { console.log(`addActionRecast: ${JSON.stringify(actionName)} not in actionData`); return; }

  // Get default recast if recast not provided
  if (!recast) { newRecast = actionData[actionDataIndex].recast; }

  // Exit if no recast is defined at all (function will have no effect)
  if (!newRecast) { return; }

  // Convert to milliseconds for array timestamp
  const newRecastMilliseconds = newRecast * 1000;

  // Look for existing entry in recasts
  const recastArrayIndex = recastArray.findIndex((element) => element.name === actionName);

  // If entry exists, set recast timestamp
  if (recastArrayIndex > -1) {
    const i = recastArrayIndex;
    // Math.max() to calculate "total" recast for charge skills
    recastArray[i].recast = newRecastMilliseconds + Math.max(recastArray[i].recast, Date.now());
  } else {
    // Add new entry if entry does not exist
    recastArray.push({ name: actionName, recast: newRecastMilliseconds + Date.now() });
  }
  // console.log(JSON.stringify(recastArray));
};

// eslint-disable-next-line no-unused-vars
const addComboAction = ({
  actionName,
  actionDataIndex = actionData.findIndex((e) => e.name === actionName),
  loop = false,
} = {}) => {
  // TODO: 'Drop' combos properly after a timeout

  // eslint-disable-next-line no-console
  if (!actionName) { console.log('addComboAction: no actionName'); return; }

  // eslint-disable-next-line no-console
  if (actionDataIndex === -1) { console.log(`addComboAction: ${actionName} needs to be added to data array`); return; }

  // Check if action actually interrupts combo, return if it doesn't
  if (!actionData[actionDataIndex].breaksCombo) { return; }

  // Look for followup action
  const comboAvailable = actionData.some((element) => element.comboAction
  && element.comboAction.includes(actionName));

  let player = currentPlayer;
  if (loop === true) { player = loopPlayer; }

  if (comboAvailable) {
    player.comboAction = actionName;
  } else {
    player.comboAction = '';
  }
};

const addStatus = ({
  statusName,
  targetID = currentPlayer.id,
  sourceID = currentPlayer.id, // Seems like most statuses default to this
  duration,
  stacks,
  loop = false,
} = {}) => {
  // eslint-disable-next-line no-console
  if (!statusName) { console.log('addStatus: no statusName'); return; }

  let statusArray = currentStatusArray;
  if (loop) { statusArray = loopStatusArray; }

  // Check if status is defined inside data array
  const statusDataIndex = statusData.findIndex((element) => element.name === statusName);
  // eslint-disable-next-line no-console
  if (statusDataIndex === -1) { console.log(`addStatus: ${statusName} not in statusData array`); return; }

  // Convert seconds to milliseconds for array use
  // Use provided duration or default to statusData duration
  let newDurationMilliseconds;
  if (duration) {
    newDurationMilliseconds = duration * 1000;
  } else {
    newDurationMilliseconds = statusData[statusDataIndex].duration * 1000;
  }

  // Create timestamp value for array
  const newDurationTimestamp = newDurationMilliseconds + Date.now();

  // Set number of stacks, else get default value of stacks if unprovided
  let newStacks;
  if (stacks) {
    newStacks = stacks;
  } else if (statusData[statusDataIndex].stacks) {
    newStacks = statusData[statusDataIndex].stacks;
  }

  // Look for existing entry
  let statusArrayIndex = statusArray.findIndex(
    (element) => element.name === statusName
    && element.targetID === targetID && element.sourceID === sourceID,
  );

  // Adjust existing timestamp if existing element found
  // Push new array entry if not
  if (statusArrayIndex > -1) {
    statusArray[statusArrayIndex].duration = newDurationTimestamp;
  } else {
    statusArray.push({
      name: statusName, targetID, sourceID, duration: newDurationTimestamp,
    });
    statusArrayIndex = statusArray.length - 1;
  }

  // Add stacks if value was defined
  if (newStacks) {
    statusArray[statusArrayIndex].stacks = newStacks;
  }
};

const addStatusStacks = ({
  statusName,
  targetID = currentPlayer.id,
  sourceID = currentPlayer.id,
  stacks = 1,
  loop = false,
} = {}) => {
  const initialStacks = getStatusStacks({
    statusName, targetID, sourceID, loop,
  });

  addStatus({
    statusName, targetID, sourceID, stacks: stacks + initialStacks, loop,
  });
};

// eslint-disable-next-line no-unused-vars
const incrementLoopTime = ({
  time = 0, // In seconds
} = {}) => {
  // Modifies all time numbers for loops

  // Reduce recast and duration timestamps
  for (let i = 0, { length } = loopRecastArray; i < length; i += 1) {
    loopRecastArray[i].recast -= time * 1000;
  }

  for (let i = 0, { length } = loopStatusArray; i < length; i += 1) {
    loopStatusArray[i].duration -= time * 1000;
  }

  const { job } = loopPlayer;

  // Reduce job-specific times
  if (job === 'NIN') {
    loopPlayer.huton = Math.max(loopPlayer.huton - time, 0);
    // TODO: Possibly call function to re-calculate GCDs if Huton is lost
  } else if (job === 'SAM') {
    // TODO: Check for Fuka drop?
  } else if (job === 'SMN') {
    // TODO: Might need a "changed over to Bahamut/Phoenix" after 0 trance seconds
    // loopPlayer.tranceSeconds = Math.max(loopPlayer.tranceSeconds - time, 0);
    // loopPlayer.attunementSeconds = Math.max(loopPlayer.attunementSeconds - time, 0);
  }
};

const getActionProperty = ({ actionName, property } = {}) => {
  const actionDataIndex = actionData.findIndex((e) => e.name === actionName);
  if (actionDataIndex < 0) { return 0; }
  if (actionData[actionDataIndex][property]) {
    return actionData[actionDataIndex][property];
  }
  return 0;
};

// eslint-disable-next-line no-unused-vars
const calculateRecast = ({
  recast = 2.5, // Should work with other stuff too like Aethercharge
  modifier = 1, // 0.85 for Huton, etc. etc.
} = {}) => {
  const { level } = currentPlayer;

  let { speed } = currentPlayer;
  // Set speed to base stat if there hasn't been a chance to update things
  if (!speed) { speed = playerStatsData[level - 1].baseStat; }

  // eslint-disable-next-line max-len
  const newRecast = Math.floor(Math.floor(Math.floor((1000 - Math.floor((130 * (speed - playerStatsData[level - 1].baseStat)) / playerStatsData[level - 1].levelMod)) * recast) * modifier) / 10) / 100;
  return newRecast;
};

const getRecast = ({
  actionName,
  loop = false,
} = {}) => {
  if (!actionName) {
    // eslint-disable-next-line no-console
    console.log('getRecast: no actionName');
    return 9999;
  }

  let recastArray = currentRecastArray;
  if (loop) {
    recastArray = loopRecastArray;
  }

  // Get data from actionList
  const actionDataIndex = actionData.findIndex((element) => element.name === actionName);
  if (actionDataIndex === -1) { return 9999; } // "It's not available yet"

  // Check for recast data
  const defaultRecast = actionData[actionDataIndex].recast;
  if (!defaultRecast) { return 0; }
  // const defaultCharges = actionData[actionDataIndex].charges;

  // Get index of existing entry
  const recastArrayIndex = recastArray.findIndex((element) => element.name === actionName);

  // Return 0 if not found ("it's off recast")
  if (recastArrayIndex === -1) { return 0; }
  // console.log(`${recastArray[recastArrayIndex].name} ${recastArray[recastArrayIndex].recast}`);

  // Calculate recast
  // Actions with charges will return higher than 0 when charges are available
  // Example: Mudra will return < 20 if it has one charge left, 0 at 2 charges
  const recastTimestamp = recastArray[recastArrayIndex].recast;
  const recastSeconds = (recastTimestamp - Date.now()) / 1000;

  // Return 0 and remove if recast <= 0 (to prevent shenanigans)
  if (recastSeconds <= 0) {
    removeRecast({ actionName, loop });
    return 0;
  }

  return recastSeconds;
};
const getDelay = ({
  actionName,
  loop = false,
} = {}) => {
  const { job } = currentPlayer;
  const actionType = getActionProperty({ actionName, property: 'type' });
  // if (job === 'RDM') { return rdmgetDelay({ actionName, playerData, statusArray }); }
  if (job === 'NIN') {
    if (actionType === 'Mudra') { return 0.5; }
    if (actionType === 'Ninjutsu') { return 1.5; }
  }

  if (job === 'SAM') {
    if (actionName === 'Meikyo Shisui') { return 0; }
    if (actionType === 'Iaijutsu') { return 0; } // Lazy
  }

  // Generic catch-all
  if (loop) { return loopPlayer.gcd; } return currentPlayer.gcd;
};

// Not used right now, keeping for possible use later
// eslint-disable-next-line no-unused-vars
// const getArrayRow = ({
//   iconArray = nextAction.iconArrayB,
// } = {}) => {
//   // Associate array with row
//   let rowID = 'icon-b';
//   if (iconArray === nextAction.iconArrayA) {
//     rowID = 'icon-a';
//   } else if (iconArray === nextAction.iconArrayB) {
//     rowID = 'icon-b';
//   } else if (iconArray === nextAction.iconArrayC) {
//     rowID = 'icon-c';
//   }
//   return rowID;
// };

// eslint-disable-next-line no-unused-vars
const getStatusDuration = ({
  statusName,
  targetID = currentPlayer.id,
  sourceID = currentPlayer.id,
  loop = false,
} = {}) => {
  if (!statusName) {
    // eslint-disable-next-line no-console
    console.log('getStatusDuration: no name');
    return 0;
  }

  let statusArray = currentStatusArray;
  if (loop) {
    statusArray = loopStatusArray;
  }

  const statusDataIndex = statusData.findIndex((element) => element.name === statusName);
  if (statusDataIndex === -1) {
    // eslint-disable-next-line no-console
    console.log(`getStatusDuration: ${statusName} not in statusData array`);
    return 0;
  }

  const statusArrayIndex = statusArray.findIndex(
    (element) => element.name === statusName
    && element.targetID === targetID
    && element.sourceID === sourceID,
  );

  if (statusArrayIndex > -1) {
    // Returns seconds
    const statusDuration = (statusArray[statusArrayIndex].duration - Date.now()) / 1000;
    if (statusDuration > 0) {
      return statusDuration; // Only return positive values
    }
    // Remove if status is zero and allow return zero at buttom
    removeStatus({
      statusName, targetID, sourceID, loop,
    });
  }

  return 0;
};

// eslint-disable-next-line no-unused-vars
const getStatusStacks = ({
  statusName,
  targetID = currentPlayer.id,
  sourceID = currentPlayer.id,
  loop = false,
} = {}) => {
  if (!statusName) {
    // eslint-disable-next-line no-console
    console.log('getStatusStacks: no name');
    return 0;
  }

  let statusArray = currentStatusArray;
  if (loop) {
    statusArray = loopStatusArray;
  }

  const statusDataIndex = statusData.findIndex((element) => element.name === statusName);
  if (statusDataIndex === -1) {
    // eslint-disable-next-line no-console
    console.log(`getStatusStacks: ${statusName} not in statusData array`);
    return 0;
  }

  const statusArrayIndex = statusArray.findIndex(
    (element) => element.name === statusName
    && element.targetID === targetID && element.sourceID === sourceID,
  );

  if (statusArrayIndex > -1) {
    const statusStacks = statusArray[statusArrayIndex].stacks;
    if (statusStacks > 0) { return statusStacks; }
    removeStatus({
      statusName, targetID, sourceID, loop,
    });
  }

  return 0;
};

// eslint-disable-next-line no-unused-vars
const removeStatus = ({
  statusName,
  targetID = currentPlayer.id,
  sourceID = currentPlayer.id,
  loop = false,
} = {}) => {
  if (!statusName) {
    // eslint-disable-next-line no-console
    console.log('removeStatus: no name');
    return;
  }

  let statusArray = currentStatusArray;
  if (loop) {
    statusArray = loopStatusArray;
  }

  const statusDataIndex = statusData.findIndex((element) => element.name === statusName);
  if (statusDataIndex === -1) {
    // eslint-disable-next-line no-console
    console.log(`removeStatus: ${statusName} not in statusData array`);
    return;
  }

  const statusArrayIndex = statusArray.findIndex(
    (element) => element.name === statusName
    && element.targetID === targetID && element.sourceID === sourceID,
  );

  if (statusArrayIndex > -1) {
    statusArray.splice(statusArrayIndex, 1);
  }
  // // Set stacks to 0 if needed

  //   if (statusArray[statusArrayIndex].stacks !== undefined) {
  //     statusArray[statusArrayIndex].stacks = 0;
  //   }
  // }
};

const removeRecast = ({
  actionName,
  loop,
} = {}) => {
  if (!actionName) {
    // eslint-disable-next-line no-console
    console.log('removeRecast: no actionName');
    return;
  }

  let recastArray = currentRecastArray;
  if (loop) { recastArray = loopRecastArray; }

  const recastArrayIndex = recastArray.findIndex((element) => element.name === actionName);
  if (recastArrayIndex > -1) {
    recastArray.splice(recastArrayIndex, 1);
  }
};

// eslint-disable-next-line no-unused-vars
const removeStatusStacks = ({
  statusName,
  targetID = currentPlayer.id,
  sourceID = currentPlayer.id,
  stacks = 1,
  loop = false,
} = {}) => {
  if (!statusName) {
    // eslint-disable-next-line no-console
    console.log('removeStatusStacks: no name');
    return;
  }

  let statusArray = currentStatusArray;
  if (loop) {
    statusArray = loopStatusArray;
  }

  const statusDataIndex = statusData.findIndex((element) => element.name === statusName);
  if (statusDataIndex === -1) {
    // eslint-disable-next-line no-console
    console.log(`removeStatusStacks: ${statusName} not in statusData array`);
    return;
  }

  const statusArrayIndex = statusArray.findIndex(
    (element) => element.name === statusName
    && element.targetID === targetID
    && element.sourceID === sourceID,
  );

  if (statusArrayIndex > -1) {
    statusArray[statusArrayIndex].stacks -= stacks;
    if (statusArray[statusArrayIndex].stacks <= 0) {
      removeStatus({
        statusName, targetID, sourceID, loop,
      });
    }
  }
};

// eslint-disable-next-line no-unused-vars
const nextActionLoop = ({
  delay = 0, // Pass delay to cause OGCDs to be added first
  casting, // Pass casting to show that action "in progress"
} = {}) => {
  // Clear array for resyncing
  overlayArray = [];

  // Clone current object/arrays for looping
  // Some sort of deep clone is required due to being object/array of objects?
  // https://stackoverflow.com/questions/122102/what-is-the-most-efficient-way-to-deep-clone-an-object-in-javascript/122704#122704
  // For future reference: https://developer.mozilla.org/en-US/docs/Web/API/structuredClone
  loopPlayer = JSON.parse(JSON.stringify(currentPlayer));
  loopRecastArray = JSON.parse(JSON.stringify(currentRecastArray));
  loopStatusArray = JSON.parse(JSON.stringify(currentStatusArray));

  const { job } = loopPlayer;

  let ogcdWindow = delay;

  // Place casted action
  // if (casting) {
  //   const actionName = casting;
  //   overlayArray.push({ name: casting });
  //   ogcdWindow = getDelay({ actionName, loop: true });
  //   actionMatch({ actionName, loop: true });
  // }

  while (overlayArray.length <= maxActions) {
    if (ogcdWindow === 0) {
      let actionName;
      switch (job) {
        case 'NIN':
          actionName = ninNextGCD();
          if (Array.isArray(actionName)) {
            const actionNameArray = actionName;
            for (let i = 0; i < actionNameArray.length - 1; i += 1) {
              // Push all but last entry
              overlayArray.push({ name: actionNameArray[i] });
              actionMatch({ actionName: actionNameArray[i], loop: true });
              // Advancing time for Mudras
              if (getStatusDuration({ statusName: 'Ten Chi Jin', loop: true }) > 0) {
                incrementLoopTime({ time: 1 });
              } else {
                incrementLoopTime({ time: 0.5 });
              }
            }
            // Set actionName to last entry
            actionName = actionNameArray[actionNameArray.length - 1];
          }
          break;
        default:
      }

      overlayArray.push({ name: actionName });
      actionMatch({ actionName, loop: true });

      // Determine OGCD window
      const actionType = getActionProperty({ actionName, property: 'type' });
      switch (actionType) {
        case 'Mudra':
          ogcdWindow = 0.5;
          break;
        case 'Ninjutsu':
          ogcdWindow = 1.5;
          break;
        default:
          ogcdWindow = loopPlayer.gcd;
      }
    }

    // Advance just a little bit to account for animation lock
    // May need additional adjustment?
    ogcdWindow -= 0.1;
    incrementLoopTime({ time: 0.1 });

    let weaveCount = 1;

    // Inner loop for OGCDs
    while (ogcdWindow >= 1) {
      // Find next OGCD
      let actionName;
      switch (job) {
        case 'NIN':
          actionName = ninNextOGCD({ weaveCount });
          break;
        default:
      }

      // Push action into array
      if (actionName) {
        overlayArray.push({ name: actionName, ogcd: true });
        actionMatch({ actionName, loop: true });
      }

      incrementLoopTime({ time: 1 });
      ogcdWindow -= 1;
      weaveCount += 1;
    }

    // Advance time and remove values if below 1 second
    if (ogcdWindow < 1) {
      incrementLoopTime({ time: ogcdWindow });
      ogcdWindow = 0;
    }
  }

  syncOverlay();
};

// eslint-disable-next-line no-unused-vars
const startLoop = ({
  actionName,
  casting,
} = {}) => {
  let delay;

  let initialAction;
  if (actionName) { initialAction = actionName; } else
  if (casting) { initialAction = casting; }

  const actionType = getActionProperty({ actionName: initialAction, property: 'type' });

  // if (job === 'SAM') {
  //   if (['Weaponskill', 'Iaijutsu', 'Tsubame-gaeshi'].includes(actionType) === false) { return; }
  //   // Avoid starting loop before Tsubame-gaeshi
  //   // (mostly because I don't know how to program for it)
  //   const tsubameGaeshiRecast = getRecast({ actionName: 'Tsubame-gaeshi' });
  //   if (['Tenka Goken', 'Midare Setsugekka'].includes(initialAction)
  // && tsubameGaeshiRecast <= currentPlayer.gcd) { return; }
  //   if (['Ogi Namikiri'].includes(initialAction)) { return; }

  //   if (actionName) { delay = getDelay({ actionName, loop: false }); }
  //   if (casting) { delay = 0; }
  // }

  const { job } = currentPlayer;

  if (job === 'NIN') {
    if (['Weaponskill'].includes(actionType) === false) { return; }
    if (getStatusDuration({ statusName: 'Mudra' }) > 0) { return; }
    if (getStatusDuration({ statusName: 'Ten Chi Jin' }) > 0) { return; }
  }

  nextActionLoop({ delay, casting });
};

// Uses an array of objects to create a new set of icons
// If icons exist, it removes any icons that don't match first and then adds any necessary ones
// eslint-disable-next-line no-unused-vars
const syncOverlay = () => {
  if (overlayArray === undefined) { return; }
  // console.log(`overlayArray: ${JSON.stringify(overlayArray)}`);

  // Get the div element
  const rowDiv = document.getElementById('actions');
  // Find current div length
  const rowLength = rowDiv.children.length;
  // overlayArray.length = maxIcons;
  // Check to see how many icons currently match the array, removing any that don't
  let overlayArrayIndex = 0;
  let iconCount = 0;
  for (let rowIndex = 0; rowIndex < rowLength; rowIndex += 1) {
    if (iconCount >= maxIcons) { break; }
    const iconDiv = rowDiv.children[rowIndex];
    if (overlayArray[overlayArrayIndex].name === iconDiv.dataset.name) {
      // Go on to next array item if the div already contains the icon
      overlayArrayIndex += 1;
      iconCount += 1;
    } else {
      // Remove icon if it doesn't match
      // overlayArrayIndex stays the same to match next icon
      iconDiv.dataset.name = '';
      iconDiv.classList.replace('icon-show', 'icon-hide');
      setTimeout(() => { iconDiv.remove(); }, 1000);
    }
  }

  // Entire set of current icons is matched
  // Rest of icons must be recreated

  for (overlayArrayIndex;
    overlayArrayIndex < overlayArray.length; overlayArrayIndex += 1) {
    if (iconCount >= maxIcons) { break; }
    // Define new divs
    const iconDiv = document.createElement('div');
    const iconImg = document.createElement('img');
    const iconOverlay = document.createElement('img');

    // Append new divs
    rowDiv.append(iconDiv);
    iconDiv.append(iconImg);
    iconDiv.append(iconOverlay);

    // Set default attributes
    iconDiv.className = 'icon icon-hide';
    iconImg.className = 'iconimg';
    iconOverlay.className = 'iconoverlay';

    // Add icon images
    const actionName = overlayArray[overlayArrayIndex].name;
    iconDiv.dataset.name = actionName;
    const actionDataIndex = actionData.findIndex((element) => element.name === actionName);
    const iconFile = `${actionData[actionDataIndex].icon}.png`;
    const iconFolderNumber = Math.floor(
      parseInt(iconFile, 10) / 1000,
    ) * 1000;
    const iconFolder = iconFolderNumber.toString().padStart(6, '0');
    iconImg.src = `img/icon/${iconFolder}/${iconFile}`;
    iconOverlay.src = 'img/icon/iconoverlay.png';

    // Add OGCD stuff
    if (overlayArray[overlayArrayIndex].ogcd === true) {
      iconDiv.classList.add('icon-small');
    }

    // eslint-disable-next-line no-void
    void iconDiv.offsetWidth; // Can't remember what this does, but probably do reflow smoothly

    iconDiv.classList.replace('icon-hide', 'icon-show');
    iconCount += 1;
  }
};

// eslint-disable-next-line no-unused-vars
const fadeIcon = ({ // Sets an action to lower opacity, for casting or whatever
  name,
} = {}) => {
  if (name === undefined) { return; }

  const rowDiv = document.getElementById('actions');
  const matchDiv = rowDiv.querySelector(`div[data-name="${name}"]:not([class~="icon-hide"])`);

  if (matchDiv) {
    // eslint-disable-next-line no-void
    void matchDiv.offsetWidth; // I can't remember why this was needed...
    matchDiv.classList.add('icon-fade');
  }
};

// eslint-disable-next-line no-unused-vars
const unfadeIcon = ({ // Undos fadeAction effect
  name,
} = {}) => {
  if (name === undefined) { return; }

  const rowDiv = document.getElementById('actions');
  const matchDiv = rowDiv.querySelector(`div[data-name="${name}"]:not([class~="icon-hide"])`);

  if (matchDiv) {
    // eslint-disable-next-line no-void
    void matchDiv.offsetWidth;
    matchDiv.classList.remove('icon-fade');
  }
};

// // eslint-disable-next-line no-unused-vars
// const removeIcon = ({ actionName } = {}) => {
//   if (actionName === undefined) { return; }

//   // Removes first instance of action and then syncs array, technically?
//   const overlayArrayIndex = overlayArray.findIndex((element) => element.name === actionName);
//   if (overlayArrayIndex > -1) {
//     overlayArray.splice(overlayArrayIndex, 1);
//     syncOverlay();
//   }
// };

// eslint-disable-next-line no-unused-vars
// const removeIcon = ({
//   name,
// } = {}) => {
//   if (name === undefined) { return; }

//   const rowDiv = document.getElementById('actions');
//   const matchDiv = rowDiv.querySelector(`div[data-name="${name}"]:not([class~="icon-hide"])`);

//   if (matchDiv) {
//     // eslint-disable-next-line no-void
//     void matchDiv.offsetWidth; // Don't need this when removing...?
//     matchDiv.dataset.name = '';
//     if (!matchDiv.classList.contains('icon-hide')) {
//       matchDiv.classList.replace('icon-show', 'icon-hide');
//     }
//   }
// };

// eslint-disable-next-line no-unused-vars
const debugText = ({ text }) => {
  document.getElementById('debug').innerText = text;
};

// function showOverlay() {
//   document.getElementById('nextdiv').classList.replace('next-hide', 'next-show');
// }

// function hideOverlay() {
//   document.getElementById('nextdiv').classList.replace('next-show', 'next-hide');
// }
