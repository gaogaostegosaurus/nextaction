/* eslint-disable prefer-regex-literals */
/* eslint no-use-before-define: ["error", { "variables": false }] */

/* global
addOverlayListener startOverlayEvents
fadeIcon unfadeIcon removeIcon
baseActionData baseStatusData playerStatsData getActionDataProperty
addActionRecast calculateRecast
addStatus removeStatus checkStatusDuration
startLoop syncOverlay
rdmPlayerChanged rdmActionMatch rdmStatusMatch
ninTraits ninPlayerChanged ninTargetChanged ninActionMatch ninStatusMatch ninCalculateDelay
*/

// All possible events:
// https://github.com/quisquous/cactbot/blob/master/plugin/CactbotEventSource/CactbotEventSource.cs

// Declaring all variables here

// Maximum number of actions looked up
// eslint-disable-next-line no-unused-vars
const maxIcons = 10;

// eslint-disable-next-line no-unused-vars, prefer-const
let currentPlayerData = {}; let currentRecastArray = []; let currentStatusArray = [];
// eslint-disable-next-line no-unused-vars, prefer-const
let loopPlayerData = {}; let loopRecastArray = []; let loopStatusArray = [];

const targetData = {};
// eslint-disable-next-line no-unused-vars
let overlayClass; let overlayArray = [];
// eslint-disable-next-line no-unused-vars
let statusData = []; let actionData = []; let castingActionData = [];

let actionEffectRegex;
let statusRegex;
let startsCastingRegex;
let cancelActionRegex;

// let loopTimeout;
let actionMatchTimestamp = 0;

// Constant across jobs
const playerStatsRegex = new RegExp('^.{15}(?<logType>PlayerStats) 0C:(?<jobID>[\\d]+):(?<strength>[\\d]+):(?<dexterity>[\\d]+):(?<vitality>[\\d]+):(?<intelligence>[\\d]+):(?<mind>[\\d]+):(?<piety>[\\d]+):(?<attackPower>[\\d]+):(?<directHitRate>[\\d]+):(?<criticalHit>[\\d]+):(?<attackMagicPotency>[\\d]+):(?<healingMagicPotency>[\\d]+):(?<determination>[\\d]+):(?<skillSpeed>[\\d]+):(?<spellSpeed>[\\d]+):0:(?<tenacity>[\\d]+):'); // This regex is always static for now, maybe not in future?
const fadeOutRegex = new RegExp('^.{15}(?<logType>Director) 21:8[\\dA-F]{7}:40000005:');

const supportedJobs = ['NIN'];
// let overlayVisible = false;
let overlayReady;
let regexReady;

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
  if (overlayReady === true) { onInCombatChangedEvent(e); }
});

// addOverlayListener('onPartyWipe', (e) => {
//   // console.log(`onPartyWipe: ${JSON.stringify(e)}`);
//   if (overlayReady === true) { onPartyWipe(e); }
// });

addOverlayListener('EnmityTargetData', (e) => {
  // console.log(`EnmityTargetData: ${JSON.stringify(e)}`);
  if (overlayReady === true) { EnmityTargetData(e); }
});

addOverlayListener('onLogEvent', (e) => {
  if (regexReady === true) { onLogEvent(e); }
});

// Possily switch to this? Don't know how it's different
// addOverlayListener('LogLine', (data) => {
//   console.log(`line: ${data.line} | rawLine: ${data.rawLine}`);
// });

const onPlayerChangedEvent = (e) => {
  // This triggers on job or level change
  if (e.detail.name !== currentPlayerData.name
  || e.detail.level !== currentPlayerData.level
  || e.detail.job !== currentPlayerData.job) {
    // Clear row
    document.getElementById('actions').innerHTML = '';

    // Set regex as not available
    regexReady = false;

    // Set new player data
    currentPlayerData.name = e.detail.name;
    currentPlayerData.level = e.detail.level;
    currentPlayerData.job = e.detail.job;
    currentPlayerData.jobLowerCase = e.detail.job.toLowerCase();

    currentPlayerData.decimalID = e.detail.id; // ID defaults to decimal value
    currentPlayerData.id = e.detail.id.toString(16).toUpperCase();

    const { level } = currentPlayerData;
    const { job } = currentPlayerData;

    // Set some default values
    currentPlayerData.gcd = 2.5;
    currentPlayerData.mpRegen = 200;

    // set role
    if (['PLD', 'WAR', 'DRK', 'GNB'].includes(job)) {
      currentPlayerData.role = 'Tank';
    } else if (['WHM', 'SCH', 'AST', 'SGE'].includes(job)) {
      currentPlayerData.role = 'Healer';
    } else if (['MNK', 'DRG', 'NIN', 'SAM', 'RPR'].includes(job)) {
      currentPlayerData.role = 'Melee DPS';
    } else if (['BRD', 'MCH', 'DNC'].includes(job)) {
      currentPlayerData.role = 'Physical Ranged DPS';
    } else if (['BLM', 'SMN', 'RDM', 'BLU'].includes(job)) {
      currentPlayerData.role = 'Magical Ranged DPS';
    }

    const { role } = currentPlayerData;

    // Quit here if job isn't one of the supported ones atm
    if (!supportedJobs.includes(e.detail.job)) {
      console.log(`${job} not supported yet`);
      return;
    }

    console.log(`Changed to ${job}${level}`);

    // Clone and filter into new action data array
    actionData = JSON.parse(JSON.stringify(baseActionData));
    actionData = actionData.filter(
      (element) => (element.affinity === job || element.affinity === role)
      && element.level <= level,
    );

    // Directly cloned so that it can be modified without changing original
    // Dunno why I decided this but here it is...
    statusData = JSON.parse(JSON.stringify(baseStatusData));

    // Apply job and level specific traits
    if (job === 'NIN') {
      ninTraits({ level });
    // } else if (job === 'RDM') {
    //   rdmTraits({ level });
    }

    // Create separate list for casted actions
    castingActionData = actionData.filter((element) => (element.cast > 0));

    // Create Regexes
    const playerName = currentPlayerData.name;
    const playerID = currentPlayerData.id;

    const actionMap = actionData.map((element) => element.name);
    const actionNameRegex = actionMap.join('|');

    const castingActionMap = castingActionData.map((element) => element.name);
    const castingActionNameRegex = castingActionMap.join('|');

    actionEffectRegex = new RegExp(`^.{15}(?<logType>ActionEffect|AOEActionEffect) 1[56]:(?<sourceID>${playerID}):(?<sourceName>${playerName}):(?<actionID>[\\dA-F]{1,8}):(?<actionName>${actionNameRegex}):(?<targetID>[\\dA-F]{8}):`);
    statusRegex = new RegExp(`^.{15}(?<logType>StatusAdd|StatusRemove) 1[AE]:(?<statusID>[\\dA-F]{2,8}):(?<statusName>.+?):(?<statusSeconds>[0-9]+\\.[0-9]+):(?<sourceID>[${playerID}):(?<sourceName>${playerName}):(?<targetID>[\\dA-F]{8}):(?:<statusStacks>[\\d]{2}:)`);
    startsCastingRegex = new RegExp(`^.{15}(?<logType>StartsCasting) 14:(?<sourceID>${playerID}):(?<sourceName>${playerName}):(?<actionID>[\\dA-F]{1,8}):(?<actionName>${castingActionNameRegex}):(?<targetID>[\\dA-F]{8}):`);
    cancelActionRegex = new RegExp(`^.{15}(?<logType>CancelAction) 17:(?<sourceID>${playerID}):(?<sourceName>${playerName}):(?<actionID>[\\dA-F]{1,8}):(?<actionName>${castingActionNameRegex}):(?<cancelReason>Cancelled|Interrupted):`);
    regexReady = true;
  }

  // Usual stuff
  if (currentPlayerData.job === 'NIN') {
    ninPlayerChanged(e);
  } else if (currentPlayerData.job === 'RDM') {
    rdmPlayerChanged(e);
  }
};

// eslint-disable-next-line no-unused-vars
const onLogEvent = (e) => {
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
      actionMatchTimestamp = Date.now(); // Timestamp to prevent bouncing
      const { logType } = actionEffectLine.groups;
      const { actionName } = actionEffectLine.groups;
      const { targetID } = actionEffectLine.groups;
      // console.log(`onLogEvent actionEffectLine: ${logType} ${actionName} ${targetID}`);
      removeIcon({ actionName });

      actionMatch({ logType, actionName, targetID });
    } else if (statusLine) {
      statusMatch({
        logType: statusLine.groups.logType,
        statusName: statusLine.groups.statusName,
        statusSeconds: statusLine.groups.statusSeconds,
        sourceID: statusLine.groups.sourceID,
        targetID: statusLine.groups.targetID,
        statusStacks: statusLine.groups.statusStacks,
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
      // clearTimeout(loopTimeout);
      currentStatusArray = [];
      currentRecastArray = [];
      overlayArray = [];
      syncOverlay();
    }
  }
};

const actionMatch = ({
  logType,
  actionName,
  targetID,
  playerData = currentPlayerData,
  recastArray = currentRecastArray,
  statusArray = currentStatusArray,
  loop = false,
} = {}) => {
  // This function should run once as-is per loop and then fall to the wrapper function afterwards
  // console.log(`${logType} ${actionName} ${targetID}`);
  const { job } = playerData;
  // setComboAction({ actionName });

  // Weird errors?
  if (!playerData) { console.log('actionMatch: No playerData defined'); return; }
  if (!recastArray) { console.log('actionMatch: No recastArray defined'); return; }
  if (!statusArray) { console.log('actionMatch: No statusArray defined'); return; }

  // const actionDataIndex = actionData.findIndex((element) => element.name === actionName);

  // Not sure if this will stay here or move around later
  addActionRecast({ actionName, recastArray });
  const actionType = getActionDataProperty({ actionName, property: 'type' });

  if (['Spell', 'Weaponskill'].includes(actionType)) {
    setComboAction({ actionName, playerData, statusArray });
  }

  // Job specific stuff here
  if (job === 'NIN') {
    ninActionMatch({
      // logType, // Some of these aren't used currently
      actionName,
      // targetID,
      playerData,
      recastArray,
      statusArray,
      loop,
    });
  } else if (job === 'RDM') {
    rdmActionMatch({
      logType,
      actionName,
      targetID,
      playerData,
      recastArray,
      statusArray,
      loop,
    });
  }

  // Start loop with certain things only
  // if (!loop && checkStatusDuration({ statusName: 'Ten Chi Jin', statusArray }) === 0
  // && ['Spell', 'Weaponskill', 'Ninjutsu'].includes(actionType)) {
  //   const delay = calculateDelay({ actionName });
  //   startLoop({ delay });
  // }
};

const statusMatch = ({
  logType, statusName, statusSeconds, sourceID, targetID, statusStacks,
} = {}) => {
  addStatus({
    statusName,
    sourceID,
    targetID,
    duration: statusSeconds,
    stacks: statusStacks,
    statusArray: currentStatusArray,
  });
  if (currentPlayerData.job === 'NIN') {
    ninStatusMatch({ logType, statusName, sourceID });
  } else if (currentPlayerData.job === 'RDM') { rdmStatusMatch({ logType, statusName, sourceID }); }
};

const startsCastingMatch = ({ actionName } = {}) => {
  removeStatus({ statusName: 'Combo', statusArray: currentStatusArray });

  // Call loop again with casting parameter
  if (currentPlayerData.job === 'RDM') { startLoop({ casting: actionName }); }

  fadeIcon({ name: actionName });
};

const cancelActionMatch = ({ actionName } = {}) => {
  unfadeIcon({ name: actionName });
  if (currentPlayerData.job === 'RDM') { startLoop(); }
};

// eslint-disable-next-line no-unused-vars
const playerStatsMatch = ({ piety, skillSpeed, spellSpeed } = {}) => {
  const speed = Math.max(skillSpeed, spellSpeed);
  const { level } = currentPlayerData;
  currentPlayerData.speed = speed;
  currentPlayerData.gcd = calculateRecast();
  currentPlayerData.mpRegen = 200 + Math.floor(
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

const onInCombatChangedEvent = (e) => {
  if (currentPlayerData.combat !== e.detail.inGameCombat) { // Combat status changed
    currentPlayerData.combat = e.detail.inGameCombat; // true or false
    console.log(`currentPlayerData.combat ${currentPlayerData.combat}`);
    toggleOverlayClass();
  }
};

const EnmityTargetData = (e) => {
  // Stop if regexes aren't loaded up yet
  if (regexReady !== true) { return; }

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

  if (e.Target) {
    // Distance to "outside of circle" - helps if this is continuously updated?
    targetData.distance = e.Target.EffectiveDistance;

    if (e.Target.ID !== targetData.decimalID) {
      // Everything here runs once per target change (hopefully)
      targetData.decimalID = e.Target.ID;
      targetData.id = targetData.decimalID.toString(16).toUpperCase();
      targetData.name = e.Target.Name; // Set new targetData

      const { job } = currentPlayerData;

      if (job === 'NIN') {
        ninTargetChanged();
      // } else {
      //   startLoop();
      }
      // } else if (job === 'RDM') {
      //   rdmTargetChanged();
      // }
      console.log(`Switched targets to {Name: ${targetData.name} ID: ${targetData.id} Distance: ${targetData.distance}}`);
    }
    toggleOverlayClass();
  } else if (targetData.decimalID !== 0) {
    // Runs once per target loss (hopefully)
    // Set ID 0 for conditonals
    targetData.decimalID = 0;
    targetData.id = '';
    targetData.distance = 9999;
    console.log('Switched targets to no target');
    toggleOverlayClass();
  }
};

const toggleOverlayClass = () => {
  // Control overlay visiblity based on target
  if (targetData.id.startsWith('4') && targetData.distance < 30) {
    // Show overlay if targetting enemy and distance < 30
    if (overlayClass !== 'show') {
      console.log('Showing overlay');
      document.getElementById('nextdiv').classList.replace('next-hide', 'next-show');
      overlayClass = 'show';
    }
  } else if (currentPlayerData.combat === true) {
    if (overlayClass !== 'show') {
      console.log('Showing overlay');
      document.getElementById('nextdiv').classList.replace('next-hide', 'next-show');
      overlayClass = 'show';
    }
  } else if (overlayClass === 'show') {
    console.log('Hiding overlay');
    document.getElementById('nextdiv').classList.replace('next-show', 'next-hide');
    overlayClass = 'hide';
  }
};

// eslint-disable-next-line no-unused-vars
const calculateDelay = ({
  actionName,
  playerData = currentPlayerData,
  // recastArray = currentRecastArray,
  statusArray = currentStatusArray,
} = {}) => {
  const { job } = currentPlayerData;

  // if (job === 'RDM') { return rdmCalculateDelay({ actionName, playerData, statusArray }); }
  if (job === 'NIN') { return ninCalculateDelay({ actionName, playerData, statusArray }); }

  return 0;
};

const setComboAction = ({
  actionName,
  playerData = currentPlayerData,
  statusArray = currentStatusArray,
} = {}) => {
  // TODO: This still needs some tweaking to drop combos properly

  const actionDataIndex = actionData.findIndex((e) => e.name === actionName);
  if (actionDataIndex === -1) { console.log(`setComboAction: ${actionName} not found`); return; }
  // if (!actionData[actionDataIndex].type || !actionData[actionDataIndex].comboBreak) {

  if (!actionData[actionDataIndex].comboBreak) {
    return; // Action will not affect combo
  }

  const comboAvailable = actionData.some((element) => element.comboAction
  && element.comboAction.includes(actionName));
  if (comboAvailable) {
    addStatus({ statusName: 'Combo', statusArray });
    // eslint-disable-next-line no-param-reassign
    playerData.comboAction = actionName;
  } else {
    removeStatus({ statusName: 'Combo', statusArray });
    // eslint-disable-next-line no-param-reassign
    playerData.comboAction = '';
  }
};
