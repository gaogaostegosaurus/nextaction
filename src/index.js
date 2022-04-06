/* eslint-disable no-use-before-define */
/* eslint-disable prefer-regex-literals */
/* eslint-disable prefer-const */
/* eslint-disable no-unused-vars */

// Bunch of globals since I don't know how to code

// Config options
const supportedJobs = ['MNK', 'NIN', 'RPR'];
const maxIcons = 8;
const maxActions = 100;

const actionMatchBounce = 100;
const ogcdDelay = 200 / 1000;

// Buffer for GCD/OGCD actions
// Modifies recast checks
const gcdRecastBuffer = 0;
const ogcdRecastBuffer = 0.5;

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
let gaugeRegex;

let syncOverlayTimeout;
const syncOverlayDelay = 200;

let overlayArray = [];
let statusData = [];
let actionData = [];

let regexReady = false;
let overlayClass = '';
let actionMatchTimestamp = 0;
let gcdTimestamp = 0;

// All possible events?:
// https://github.com/quisquous/cactbot/blob/master/plugin/CactbotEventSource/CactbotEventSource.cs

document.addEventListener('DOMContentLoaded', () => {
  startOverlayEvents();
});

addOverlayListener('onPlayerChangedEvent', (e) => {
  onPlayerChangedEvent(e);
});

addOverlayListener('onInCombatChangedEvent', (e) => {
  if (regexReady === true) { onInCombatChangedEvent(e); }
});

// addOverlayListener('onPartyWipe', (e) => {
//   // console.log(`onPartyWipe: ${JSON.stringify(e)}`);
//   if (overlayReady === true) { onPartyWipe(e); }
// });

addOverlayListener('EnmityTargetData', (e) => {
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
  if (e.detail.name !== currentPlayer.name
  || e.detail.level !== currentPlayer.level
  || e.detail.job !== currentPlayer.job) {
    // Clear row
    document.getElementById('actions').innerHTML = '';

    // Set regex as not available
    regexReady = false;
    currentPlayer.combat = false;

    // Quit here if job isn't one of the supported ones
    currentPlayer.job = e.detail.job;
    if (!supportedJobs.includes(currentPlayer.job)) { return; }

    // Set other player data
    currentPlayer.id = e.detail.id.toString(16).toUpperCase(); // ID defaults to decimal value
    currentPlayer.name = e.detail.name;
    currentPlayer.level = e.detail.level;

    const { id } = currentPlayer;
    const { name } = currentPlayer;
    const { level } = currentPlayer;
    const { job } = currentPlayer;

    // Set role
    switch (job) {
      case 'PLD': case 'WAR': case 'DRK': case 'GNB':
        currentPlayer.role = 'Tank'; break;
      case 'WHM': case 'SCH': case 'AST': case 'SGE':
        currentPlayer.role = 'Healer'; break;
      case 'MNK': case 'DRG': case 'NIN': case 'SAM': case 'RPR':
        currentPlayer.role = 'Melee DPS'; break;
      case 'BRD': case 'MCH': case 'DNC':
        currentPlayer.role = 'Physical Ranged DPS'; break;
      case 'BLM': case 'SMN': case 'RDM': case 'BLU':
        currentPlayer.role = 'Magical Ranged DPS'; break;
      default:
    }

    const { role } = currentPlayer;

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

    // Apply job and level specific traits, set initial job-specific values
    switch (job) {
      case 'MNK': mnkJobChanged(e); break;
      case 'NIN': ninJobChanged(e); break;
      case 'RPR': rprJobChanged(e); break;
      case 'SAM': samJobChanged(e); break;
      default:
    }

    // Create separate list for casted actions
    const castingActionData = actionData.filter((f) => (f.cast > 0));

    const actionMap = actionData.map((f) => f.name);
    const actionNameRegex = actionMap.join('|');

    const castingActionMap = castingActionData.map((f) => f.name);
    const castingActionNameRegex = castingActionMap.join('|');

    // Define Regexes
    actionEffectRegex = new RegExp(`^.{15}(?<logType>ActionEffect|AOEActionEffect) 1[56]:(?<sourceID>${id}):(?<sourceName>${name}):(?<actionID>[\\dA-F]{1,8}):(?<actionName>${actionNameRegex}):(?<targetID>[\\dA-F]{8}):`);
    castingRegex = new RegExp(`^.{15}(?<logType>StartsCasting|CancelAction) 1[47]:(?<sourceID>${id}):(?<sourceName>${name}):(?<actionID>[\\dA-F]{1,8}):(?<actionName>${castingActionNameRegex}):(?<targetID>[\\dA-F]{8}):`);
    gaugeRegex = new RegExp(`^.{15}(?<logType>Gauge) 1F:${id}:(?<gaugeHex0>[\\dA-F]{0,8}):(?<gaugeHex1>[\\dA-F]{0,8}):(?<gaugeHex2>[\\dA-F]{0,8}):`);
    statusRegex = new RegExp(`^.{15}(?<logType>StatusAdd|StatusRemove) 1[AE]:(?<statusID>[\\dA-F]{2,8}):(?<statusName>.+?):(?<statusSeconds>[0-9]+\\.[0-9]+):(?<sourceID>${id}):(?<sourceName>${name}):(?<targetID>[\\dA-F]{8}):(?<targetName>.+?):(?<statusStacks>[\\dA-F]{2}):`);
    regexReady = true;

    // eslint-disable-next-line no-console
    console.log(`Changed to ${job}${level} (${role})`);
  }

  // Usual stuff

  // switch (currentPlayer.job) {
  //   // case 'MNK':
  //   //   mnkPlayerChanged(e); break;
  //   // // case 'NIN':
  //   // //   ninPlayerChanged(e); break;
  //   case 'RPR':
  //     rprPlayerChanged(e); break;
  //   // case 'SAM':
  //   //   samPlayerChanged(e); break;
  //   default:
  // }
};

const onInCombatChangedEvent = (e) => {
  if (currentPlayer.combat !== e.detail.inGameCombat) { // Combat status changed
    currentPlayer.combat = e.detail.inGameCombat; // true or false
    // console.log(`currentPlayer.combat ${currentPlayer.combat}`);
    // Not if the above works consistently...
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
    currentTarget.hp = e.Target.CurrentHP;
    currentTarget.maxHP = e.Target.MaxHP;
    // Distance to "outside of circle" - helps if this is continuously updated?
    currentTarget.distance = e.Target.EffectiveDistance;

    if (e.Target.ID !== currentTarget.decimalID) {
      // Everything here runs once per target change (hopefully)
      currentTarget.decimalID = e.Target.ID;
      currentTarget.id = e.Target.ID.toString(16).toUpperCase();
      currentTarget.name = e.Target.Name; // Set new targetData

      const { job } = currentPlayer;
      switch (job) {
        case 'MNK': mnkTargetChanged(); break;
        case 'NIN': ninTargetChanged(); break;
        case 'RPR': rprTargetChanged(); break;
        case 'SAM': samTargetChanged(); break;
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
  if (overlayClass !== 'hide') {
    if (!id.startsWith('40')) {
      document.getElementById('nextdiv').classList.replace('next-show', 'next-hide');
      overlayClass = 'hide';
    } else if (currentTarget.distance >= 30) {
      document.getElementById('nextdiv').classList.replace('next-show', 'next-hide');
      overlayClass = 'hide';
    }
  } else if (overlayClass !== 'show') {
    if (id.startsWith('40') && currentTarget.distance < 30) {
      document.getElementById('nextdiv').classList.replace('next-hide', 'next-show');
      overlayClass = 'show';
    } else if (combat === true) {
      document.getElementById('nextdiv').classList.replace('next-hide', 'next-show');
      overlayClass = 'show';
    }
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
    const gaugeLine = logs[i].match(gaugeRegex);
    const fadeOutLine = logs[i].match(fadeOutRegex);

    if (actionEffectLine && Date.now() - actionMatchTimestamp > actionMatchBounce) {
      actionMatchTimestamp = Date.now(); // Timestamp to prevent bouncing
      actionMatch({
        logType: actionEffectLine.groups.logType,
        actionName: actionEffectLine.groups.actionName,
        targetID: actionEffectLine.groups.targetID,
      });
    } else if (gaugeLine) {
      gaugeMatch({
        gaugeHex0: gaugeLine.groups.gaugeHex0,
        gaugeHex1: gaugeLine.groups.gaugeHex1,
        gaugeHex2: gaugeLine.groups.gaugeHex2,
      });
    } else if (statusLine) {
      statusMatch({
        logType: statusLine.groups.logType,
        statusName: statusLine.groups.statusName,
        statusSeconds: parseFloat(statusLine.groups.statusSeconds),
        sourceID: statusLine.groups.sourceID,
        targetID: statusLine.groups.targetID,
        statusStacks: parseInt(statusLine.groups.statusStacks, 16),
        // Not always stack amount (example: TCJ)
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

  if (!loop) {
    let linkedActions; // Any actions that effectively replace another one go here
    switch (actionName) {
      case 'Hellfrog Medium': case 'Bhavacakra':
        linkedActions = ['Hellfrog Medium', 'Bhavacakra']; break;
      case 'Forked Raiju': case 'Fleeting Raiju':
        linkedActions = ['Forked Raiju', 'Fleeting Raiju']; break;
      case 'Soul Slice': case 'Soul Scythe':
        linkedActions = ['Soul Slice', 'Soul Scythe']; break;
      case 'Blood Stalk': case 'Grim Swathe': case 'Gluttony':
        linkedActions = ['Blood Stalk', 'Grim Swathe', 'Gluttony']; break;
      default:
    }

    if (linkedActions) {
      const found = overlayArray.find((e) => linkedActions.includes(e.name));
      if (found) {
        removeIcon({ actionName: found.name });
      }
    } else {
      removeIcon({ actionName });
    }
  }

  switch (job) {
    case 'MNK':
      mnkActionMatch({
        logType, actionName, targetID, loop,
      }); break;
    case 'NIN':
      ninActionMatch({
        logType, actionName, targetID, loop,
      }); break;
    case 'RPR':
      rprActionMatch({
        logType, actionName, targetID, loop,
      }); break;
    case 'SAM':
      samActionMatch({
        logType, actionName, targetID, loop,
      }); break;
    default:
  }
};

const gaugeMatch = ({
  gaugeHex0,
  gaugeHex1,
  gaugeHex2,
} = {}) => {
  const gaugeHex = [gaugeHex0.padStart(8, '0'), gaugeHex1.padStart(8, '0'), gaugeHex2.padStart(8, '0')];

  switch (currentPlayer.job) {
    case 'MNK':
      mnkGaugeMatch({ gaugeHex }); break;
    case 'NIN':
      ninGaugeMatch({ gaugeHex }); break;
    case 'RPR':
      rprGaugeMatch({ gaugeHex }); break;
    case 'SAM':
      samGaugeMatch({ gaugeHex }); break;
    default:
  }
};

const statusMatch = ({
  logType, statusName, statusSeconds, sourceID, targetID, statusStacks,
} = {}) => {
  switch (logType) {
    case 'StatusAdd':
      addStatus({
        statusName, sourceID, targetID, duration: statusSeconds, stacks: statusStacks,
      }); break;
    case 'StatusRemove':
      removeStatus({ statusName }); break;
    default:
  }

  switch (currentPlayer.job) {
    case 'RPR':
      rprStatusMatch({
        logType, statusName, statusSeconds, sourceID, targetID, statusStacks,
      }); break;
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
  const { job } = currentPlayer;
  currentPlayer.speed = speed;

  currentPlayer.mpRegen = 200 + Math.floor(
    (150 * (piety - playerStatsData[level - 1].baseStat)) / playerStatsData[level - 1].levelMod,
  );

  switch (job) {
    case 'MNK':
      if (level >= 76) {
        currentPlayer.gcd = calculateRecast({ modifier: 0.8 });
      } else if (level >= 40) {
        currentPlayer.gcd = calculateRecast({ modifier: 0.85 });
      } else if (level >= 20) {
        currentPlayer.gcd = calculateRecast({ modifier: 0.9 });
      } else {
        currentPlayer.gcd = calculateRecast({ modifier: 0.95 });
      }
      break;
    default:
      currentPlayer.gcd = calculateRecast();
  }

  // console.log(`GCD set to ${currentPlayer.gcd} seconds`);
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
  if (actionDataIndex === -1) {
    // console.log(`addActionRecast: ${JSON.stringify(actionName)} not in actionData`);
    return;
  }

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

  // Check if action actually interrupts combo, return if it doesn't
  if (!actionData[actionDataIndex].breaksCombo) { return; }

  // eslint-disable-next-line no-console
  if (actionDataIndex === -1) { console.log(`addComboAction: ${actionName} needs to be added to data array`); return; }

  // Look for followup action
  const comboAvailable = actionData.some((e) => e.comboAction
  && e.comboAction.includes(actionName));

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
  duration,
  stacks = 1,
  targetID = currentPlayer.id,
  sourceID = currentPlayer.id, // Seems like most statuses default to this
  loop = false,
} = {}) => {
  // eslint-disable-next-line no-console
  if (!statusName) { console.log('addStatus: no statusName'); return; }

  let statusArray = currentStatusArray;
  if (loop) { statusArray = loopStatusArray; }

  // Check if status is defined inside data array
  const statusDataIndex = statusData.findIndex((element) => element.name === statusName);
  // eslint-disable-next-line no-console

  // Convert seconds to milliseconds for array use
  // Use provided duration or default to statusData duration
  let newDurationMilliseconds;
  if (duration !== undefined) {
    newDurationMilliseconds = duration * 1000;
  } else if (statusDataIndex === -1) {
    // eslint-disable-next-line no-console
    console.log(`addStatus: ${statusName} not in statusData array`); return;
  } else {
    newDurationMilliseconds = statusData[statusDataIndex].duration * 1000;
  }

  // Create timestamp value for array
  const newDurationTimestamp = newDurationMilliseconds + Date.now();

  // Set number of stacks, else get default value of stacks if unprovided
  let newStacks;
  if (stacks) {
    newStacks = stacks;
  } else if (statusDataIndex === -1) {
    // eslint-disable-next-line no-console
    console.log(`addStatus: ${statusName} not in statusData array`); return;
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
    // loopPlayer.huton = Math.max(loopPlayer.huton - time, 0);
    // TODO: Possibly call function to re-calculate GCDs if Huton is lost
  // } else if (job === 'SAM') {
    // TODO: Check for Fuka drop?
  // } else if (job === 'SMN') {
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
  const { baseStat } = playerStatsData[level - 1];
  const { levelMod } = playerStatsData[level - 1];

  let { speed } = currentPlayer;
  // Set speed to base stat if there hasn't been a chance to update things
  if (!speed) { speed = baseStat; }

  // eslint-disable-next-line max-len
  // f(GCD) = ⌊ ((GCD * (1000 + ⌈ 130 × ( Level Lv, SUB - Speed)/ Level Lv, DIV)⌉ ) / 10000)/100 ⌋
  const speedCalculation = (baseStat - speed) / levelMod;
  const speedModifier = Math.ceil(130 * (speedCalculation));
  const recastMultiplier = 1000 * modifier + speedModifier;
  const recastMilliseconds = Math.floor((recast * recastMultiplier) / 10) * 10; // Lops off 1 sigdig
  return recastMilliseconds / 1000;
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
  let recastSeconds = (recastTimestamp - Date.now()) / 1000;

  if (actionData.findIndex((e) => e.ogcd) === true) {
    recastSeconds -= ogcdRecastBuffer;
  } else {
    recastSeconds -= gcdRecastBuffer;
  }

  // Return if > 0
  if (recastSeconds > 0) { return recastSeconds; }

  // removeRecast({ actionName, loop }); // Is this necessary?
  return 0;
};
// const getDelay = ({
//   actionName,
//   loop = false,
// } = {}) => {
//   const { job } = currentPlayer;
//   const actionType = getActionProperty({ actionName, property: 'type' });
//   // if (job === 'RDM') { return rdmgetDelay({ actionName, playerData, statusArray }); }
//   if (job === 'NIN') {
//     if (actionType === 'Mudra') { return 0.5; }
//     if (actionType === 'Ninjutsu') { return 1.5; }
//   }

//   if (job === 'SAM') {
//     if (actionName === 'Meikyo Shisui') { return 0; }
//     if (actionType === 'Iaijutsu') { return 0; } // Lazy
//   }

//   // Generic catch-all
//   if (loop) { return loopPlayer.gcd; } return currentPlayer.gcd;
// };

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
    (e) => e.name === statusName
    && e.targetID === targetID
    && e.sourceID === sourceID,
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

  const statusArrayIndex = statusArray.findIndex(
    (e) => e.name === statusName
    && e.targetID === targetID
    && e.sourceID === sourceID,
  );

  if (statusArrayIndex > -1) {
    statusArray[statusArrayIndex].stacks -= stacks;
    // console.log(`${statusName} Stacks: ${statusArray[statusArrayIndex].stacks}`);
    if (statusArray[statusArrayIndex].stacks <= 0) {
      removeStatus({
        statusName, targetID, sourceID, loop,
      });
    }
  }
};

// eslint-disable-next-line no-unused-vars
const startLoop = ({
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

  let ogcdWindow = Math.max(delay, 0); // Prevent accidental negative values or something

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
        case 'MNK':
          actionName = mnkNextGCD(); break;
        case 'NIN':
          actionName = ninNextGCD(); break;
        case 'RPR':
          actionName = rprNextGCD(); break;
        case 'SAM':
          actionName = samNextGCD(); break;
        default:
      }

      if (Array.isArray(actionName)) {
        const actionNameArray = actionName;
        for (let i = 0; i < actionNameArray.length - 1; i += 1) {
          // Push all but last entry
          switch (actionNameArray[i]) {
            case 'Hissatsu: Kaiten':
              if (overlayArray.length > 0 && ['Hissatsu: Shinten', 'Hissatsu: Kyuten', 'Hissatsu: Guren', 'Hissatsu: Senei'].includes(overlayArray[overlayArray.length - 1].name)) {
                overlayArray.splice(overlayArray.length - 1); // Remove OGCD action
                loopPlayer.kenki += 25;
              }
              overlayArray.push({ name: actionNameArray[i], ogcd: true }); break;
            default:
              overlayArray.push({ name: actionNameArray[i] });
          }
          actionMatch({ actionName: actionNameArray[i], loop: true });
          switch (actionNameArray[i]) {
            case 'Ten': case 'Chi': case 'Jin':
              if (getStatusDuration({ statusName: 'Ten Chi Jin', loop: true }) > 0) {
                incrementLoopTime({ time: 1 });
              } else {
                incrementLoopTime({ time: 0.5 });
              } break;
            case 'Hissatsu: Kaiten':
              break;
            default:
              incrementLoopTime({ time: loopPlayer.gcd });
          }
        }

        // Set actionName to last entry
        actionName = actionNameArray[actionNameArray.length - 1];
      }

      overlayArray.push({ name: actionName });
      actionMatch({ actionName, loop: true });

      // Determine OGCD window
      switch (actionName) {
        case 'Ten': case 'Chi': case 'Jin':
          ogcdWindow = 0.5; break;
        case 'Katon': case 'Raiton': case 'Hyoton': case 'Suiton': case 'Huton': case 'Doton': case 'Hyosho Ranryu': case 'Goka Mekkyaku':
          ogcdWindow = 1.5; break;
        case 'Meditation':
          ogcdWindow = 1; break;
        case 'Six-sided Star':
          ogcdWindow = loopPlayer.gcd * 2; break;
        case 'Void Reaping': case 'Cross Reaping': case 'Grim Reaping':
          ogcdWindow = 1.5; break;
        default:
          ogcdWindow = loopPlayer.gcd;
      }
    }

    // Advance just a little bit to account for animation lock
    // May need additional adjustment?
    ogcdWindow -= ogcdDelay;
    incrementLoopTime({ time: ogcdDelay });

    let weaveCount = 1;

    // Inner loop for OGCDs
    while (ogcdWindow > 0) {
      // Find next OGCD
      let actionName;
      switch (job) {
        case 'MNK':
          actionName = mnkNextOGCD({ weaveCount });
          break;
        case 'NIN':
          actionName = ninNextOGCD({ weaveCount });
          break;
        case 'RPR':
          actionName = rprNextOGCD({ weaveCount });
          break;
        case 'SAM':
          actionName = samNextOGCD({ weaveCount });
          break;
        default:
      }

      // Push action into array
      if (actionName) {
        overlayArray.push({ name: actionName, ogcd: true });
        actionMatch({ actionName, loop: true });
      }

      // Advance time and remove values if below 1 second
      if (ogcdWindow < 1) {
        incrementLoopTime({ time: ogcdWindow });
        ogcdWindow = 0;
      } else {
        incrementLoopTime({ time: 1 });
        ogcdWindow -= 1;
        weaveCount += 1;
      }
    }
  }

  syncOverlay();
};

// Uses an array of objects to create a new set of icons
// If icons exist, it removes any icons that don't match first and then adds any necessary ones
// eslint-disable-next-line no-unused-vars
const syncOverlay = () => {
  clearTimeout(syncOverlayTimeout);
  syncOverlayTimeout = setTimeout(() => {
    // console.log(`overlayArray: ${JSON.stringify(overlayArray)}`);
    // Get the div element
    const rowDiv = document.getElementById('actions');
    // Find current div length
    const rowLength = rowDiv.children.length;
    // overlayArray.length = maxIcons;
    // Check to see how many icons currently match the array, removing any that don't
    let overlayArrayIndex = 0;
    let iconCount = 0;
    for (let i = 0; i < rowLength; i += 1) {
      if (iconCount >= maxIcons) { break; }
      const iconDiv = rowDiv.children[i];
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

    for (let i = overlayArrayIndex;
      i < overlayArray.length; i += 1) {
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
      const actionName = overlayArray[i].name;
      iconDiv.dataset.name = actionName;
      const j = actionData.findIndex((e) => e.name === actionName);
      const iconFile = `${actionData[j].icon}.png`;
      const iconFolderNumber = Math.floor(
        parseInt(iconFile, 10) / 1000,
      ) * 1000;
      const iconFolder = iconFolderNumber.toString().padStart(6, '0');
      iconImg.src = `img/icon/${iconFolder}/${iconFile}`;
      iconOverlay.src = 'img/icon/iconoverlay.png';

      // Add OGCD stuff
      if (overlayArray[i].ogcd === true) {
        iconDiv.classList.add('icon-small');
      }

      // eslint-disable-next-line no-void
      void iconDiv.offsetWidth; // Can't remember what this does, but probably do reflow smoothly

      iconDiv.classList.replace('icon-hide', 'icon-show');
      iconCount += 1;
    }
  }, syncOverlayDelay);
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

// eslint-disable-next-line no-unused-vars
const removeIcon = ({ actionName } = {}) => {
  if (actionName === undefined) { return; }
  // Removes first instance of action and then syncs array, technically?
  const overlayArrayIndex = overlayArray.findIndex((e) => e.name === actionName);
  if (overlayArrayIndex > -1) {
    overlayArray.splice(overlayArrayIndex, 1);
    syncOverlay();
  }
};
