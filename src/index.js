/* eslint-disable prefer-regex-literals */

/* global
addOverlayListener, startOverlayEvents,
allActionData, actionMatchTimestamp,
syncOverlay, setStatus
rdmActionMatch, rdmLoop, rdmStatusMatch,
*/

// All possible events:
// https://github.com/quisquous/cactbot/blob/master/plugin/CactbotEventSource/CactbotEventSource.cs

const loopPlayerData = {};
const loopTargetData = {};

let actionArray = [];
let recastArray = [];
let statusArray = [];
const loopActionArray = [];
const loopRecastArray = [];
const loopStatusArray = [];

let actionData = [];
let castingActionData = [];

const statusData = [];

let actionEffectRegex;
let statusRegex;
let startsCastingRegex;
let cancelActionRegex;

let loopTimeout;
let actionMatchTimestamp;

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
    playerData.gcd = 2500;
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

    // eslint-disable-next-line max-len
    actionData = allActionData.filter((element) => (element.affinity === job || element.affinity === role) && element.level <= level);
    [`${jobLowerCase}Traits`]();

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

addOverlayListener('onPlayerChangedEvent', (e) => {
  if (overlayReady === true) {
    onPlayerChangedEvent(e);
  }
});

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

addOverlayListener('onLogEvent', (e) => {
  onLogEvent(e);
});

const actionMatch = ({ logType, actionName, targetID } = {}) => {
  const index = actionData.findIndex((element) => element.name === actionName);
  actionArray = actionArray.splice(index, 1);
  if (playerData.job === 'RDM') {
    rdmActionMatch({ logType, actionName, targetID });
  }
};

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

const startsCastingMatch = ({ actionName } = {}) => {
  removeStatus({ name: 'Combo' });

  // Call loop again with casting parameter
  if (playerData.job === 'RDM') { rdmLoop({ casting: actionName }); }

  fadeIcon({ name: actionName });
};

const cancelActionMatch = ({ actionName } = {}) => {
  showIcon({ name: actionName });
  if (playerData.job === 'RDM') { rdmLoop(); }
};

function showOverlay() {
  document.getElementById('nextdiv').classList.replace('next-hide', 'next-show');
  // nextActionOverlay.display = true;
}

function hideOverlay() {
  document.getElementById('nextdiv').classList.replace('next-show', 'next-hide');
}

// Toggles overlay visibility appropriately (hopefully)
const overlayToggle = () => {
  if (!document.getElementById('nextdiv')) { return; }
  const { targetData } = nextActionOverlay;
  if (targetData.id && targetData.id.startsWith('4') && targetData.distance <= 30) {
    if (nextActionOverlay.display !== true) {
      document.getElementById('nextdiv').classList.replace('next-hide', 'next-show');
      nextActionOverlay.display = true;
    }
  } else if (nextActionOverlay.combat === true) {
    if (nextActionOverlay.display !== true) {
      document.getElementById('nextdiv').classList.replace('next-hide', 'next-show');
      nextActionOverlay.display = true;
    }
  } else {
    document.getElementById('nextdiv').classList.replace('next-show', 'next-hide');
    nextActionOverlay.display = false;
  }
};
const getActionProperty = ({ name, property } = {}) => {
  const index = actionData.findIndex((e) => e.name === name);

  if (actionData[index][property]) { return actionData[index][property]; }
  return '';
};

const targetData = {};

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
};

// console.log('stuff');

// addOverlayListener('LogLine', (data) => {
//   console.log('other stuff');
//   console.log(`line: ${data.line} | rawLine: ${data.rawLine}`);
// });

// Listed in order of appearance on reload (afaik)

addOverlayListener('EnmityTargetData', (e) => {
  // console.log(`EnmityTargetData: ${JSON.stringify(e)}`);
  EnmityTargetData(e);
});

const onInCombatChangedEvent = (e) => {
  if (playerData.combat !== e.detail.inGameCombat) { // Combat status changed
    playerData.combat = e.detail.inGameCombat; // true or false
    // nextActionOverlay.overlayToggle();
  }
};

addOverlayListener('onInCombatChangedEvent', (e) => {
  // console.log(`onInCombatChangedEvent: ${JSON.stringify(e)}`);
  onInCombatChangedEvent(e);
});

const onPartyWipe = () => {
  recastArray = [];
  statusArray = [];
};

addOverlayListener('onPartyWipe', (e) => {
  // console.log(`onPartyWipe: ${JSON.stringify(e)}`);
  onPartyWipe(e);
});

// // Haven't figured out how to use the rest of these...

// addOverlayListener('onZoneChangedEvent', (e) => {
//   // Not sure how to use this but I'm sure there's a fun way to
//   console.log(`onZoneChangedEvent: ${JSON.stringify(e)}`);
// });

// addOverlayListener('onGameExistsEvent', (e) => {
//   // console.log(`onGameExistsEvent: ${JSON.stringify(e)}`);
//   // nextActionOverlay.gameExists = e.detail.exists; // Appears to only have this
// });

// addOverlayListener('onGameActiveChangedEvent', (e) => {
//   // console.log(`onGameActiveChangedEvent: ${JSON.stringify(e)}`);
//   // nextActionOverlay.gameActive = e.detail.active; // Appears to only have this
// });

// Needs to be updated for Endwalker - probably useless as is
// const OLDplayerStatsMatch = ({ piety, skillSpeed, spellSpeed } = {}) => {
//   // Generalized
//   // Currently don't have the information needed to do this - update later
//   const oldLevelMods = [ // Pre EW
//     // Level, MP, Stat 1, Stat 2, "Level Mod", HP, ELMT?, THREAT?
//     [0, 0, 0, 0, 0, 0, 0, 0], // So that the index = level
//     [1, 10000, 20, 56, 56, 86, 52, 2],
//     [2, 10000, 21, 57, 57, 101, 54, 2],
//     [3, 10000, 22, 60, 60, 109, 56, 3],
//     [4, 10000, 24, 62, 62, 116, 58, 3],
//     [5, 10000, 26, 65, 65, 123, 60, 3],
//     [6, 10000, 27, 68, 68, 131, 62, 3],
//     [7, 10000, 29, 70, 70, 138, 64, 4],
//     [8, 10000, 31, 73, 73, 145, 66, 4],
//     [9, 10000, 33, 76, 76, 153, 68, 4],
//     [10, 10000, 35, 78, 78, 160, 70, 5],
//     [11, 10000, 36, 82, 82, 174, 73, 5],
//     [12, 10000, 38, 85, 85, 188, 75, 5],
//     [13, 10000, 41, 89, 89, 202, 78, 6],
//     [14, 10000, 44, 93, 93, 216, 81, 6],
//     [15, 10000, 46, 96, 96, 230, 84, 7],
//     [16, 10000, 49, 100, 100, 244, 86, 7],
//     [17, 10000, 52, 104, 104, 258, 89, 8],
//     [18, 10000, 54, 109, 109, 272, 93, 9],
//     [19, 10000, 57, 113, 113, 286, 95, 9],
//     [20, 10000, 60, 116, 116, 300, 98, 10],
//     [21, 10000, 63, 122, 122, '333?', 102, 10],
//     [22, 10000, 67, 127, 127, 366, 105, 11],
//     [23, 10000, 71, 133, 133, 399, 109, 12],
//     [24, 10000, 74, 138, 138, 432, 113, 13],
//     [25, 10000, 78, 144, 144, 465, 117, 14],
//     [26, 10000, 81, 150, 150, '498?', 121, 15],
//     [27, 10000, 85, 155, 155, 531, 125, 16],
//     [28, 10000, 89, 162, 162, 564, 129, 17],
//     [29, 10000, 92, 168, 168, '597?', 133, 18],
//     [30, 10000, 97, 173, 173, 630, 137, 19],
//     [31, 10000, 101, 181, 181, 669, 143, 20],
//     [32, 10000, 106, 188, 188, 708, 148, 22],
//     [33, 10000, 110, 194, 194, 747, 153, 23],
//     [34, 10000, 115, 202, 202, 786, 159, 25],
//     [35, 10000, 119, 209, 209, 825, 165, 27],
//     [36, 10000, 124, 215, 215, 864, 170, 29],
//     [37, 10000, 128, 223, 223, 903, 176, 31],
//     [38, 10000, 134, 229, 229, 942, 181, 33],
//     [39, 10000, 139, 236, 236, 981, 186, 35],
//     [40, 10000, 144, 244, 244, 1020, 192, 38],
//     [41, 10000, 150, 253, 253, 1088, 200, 40],
//     [42, 10000, 155, 263, 263, 1156, 207, 43],
//     [43, 10000, 161, 272, 272, 1224, 215, 46],
//     [44, 10000, 166, 283, 283, 1292, 223, 49],
//     [45, 10000, 171, 292, 292, '1360?', 231, 52],
//     [46, 10000, 177, 302, 302, '1428?', 238, 55],
//     [47, 10000, 183, 311, 311, 1496, 246, 58],
//     [48, 10000, 189, 322, 322, '1564?', 254, 62],
//     [49, 10000, 196, 331, 331, 1632, 261, 66],
//     [50, 10000, 202, 341, 341, 1700, 269, 70],
//     [51, 10000, 204, 342, 393, 1774, 270, 84],
//     [52, 10000, 205, 344, 444, 1851, 271, 99],
//     [53, 10000, 207, 345, 496, '1931?', 273, 113],
//     [54, 10000, 209, 346, 548, 2015, 274, 128],
//     [55, 10000, 210, 347, 600, 2102, 275, 142],
//     [56, 10000, 212, 349, 651, 2194, 276, 157],
//     [57, 10000, 214, 350, 703, 2289, 278, 171],
//     [58, 10000, 215, 351, 755, 2388, 279, 186],
//     [59, 10000, 217, 352, 806, 2492, 280, 200],
//     [60, 10000, 218, 354, 858, 2600, 282, 215],
//     [61, 10000, 224, 355, 941, 2700, 283, 232],
//     [62, 10000, 228, 356, 1032, 2800, 284, 250],
//     [63, 10000, 236, 357, 1133, 2900, 286, 269],
//     [64, 10000, 244, 358, 1243, 3000, 287, 290],
//     [65, 10000, 252, 359, 1364, 3100, 288, 313],
//     [66, 10000, 260, 360, 1497, 3200, 290, 337],
//     [67, 10000, 268, 361, 1643, 3300, 292, 363],
//     [68, 10000, 276, 362, 1802, 3400, 293, 392],
//     [69, 10000, 284, 363, 1978, 3500, 294, 422],
//     [70, 10000, 292, 364, 2170, 3600, 295, 455],
//     [71, 10000, 296, 365, 2263, '??', '??', 466],
//     [72, 10000, 300, 366, 2360, '??', '??', '??'],
//     [73, 10000, 305, 367, 2461, '??', '??', '??'],
//     [74, 10000, 310, 368, 2566, '??', '??', '??'],
//     [75, 10000, 315, 370, 2676, '??', '??', '??'],
//     [76, 10000, 320, 372, 2790, '??', '??', '??'],
//     [77, 10000, 325, 374, 2910, '??', '??', '??'],
//     [78, 10000, 330, 376, 3034, '??', '??', '??'],
//     [79, 10000, 335, 378, 3164, '??', '??', '??'], // was 355 a typo? Fixed to 335
//     [80, 10000, 340, 380, 3300, '??', '??', 569],
//   ];
//   const { level } = nextActionOverlay.playerData;
//   // Keep below collapsed
//   // Keep above collapsed

//   const levelMod = levelMods[level][4];
//   const speed = Math.max(skillSpeed, spellSpeed);
//   const speedBase = levelMods[level][3];
//   const speedDelta = speed - speedBase;

//   nextActionOverlay.gcd = Math.floor(
//     Math.floor(
//       10000 * (
//         Math.floor(
//           (2500 * (1000 - Math.floor(130 * (speedDelta / levelMod)))) / 1000,
//         ) / 1000),
//     ) / 100,
//   ) * 10; // Modified to output in ms

//   document.getElementById('debug').innerText = `GCD: ${nextActionOverlay.gcd}`;

//   const { gcd } = nextActionOverlay; // Save some typing

//   const { recast } = nextActionOverlay; // Shorten recast object

//   recast.sonicbreak = gcd * 24;
//   recast.gnashingfang = gcd * 12;

//   recast.drill = gcd * 8;
//   recast.hotshot = gcd * 16;
//   recast.airanchor = nextActionOverlay.recast.hotshot;

//   const egiassaultRecast = gcd * 12;
//   recast.egiassault1 = egiassaultRecast;
//   recast.egiassault2 = egiassaultRecast;
//   recast.egiassaultii1 = egiassaultRecast;
//   recast.egiassaultii2 = egiassaultRecast;

//   const mpBase = levelMods[level][2];
//   const mpDelta = piety - mpBase;

//   nextActionOverlay.mpRegen = 200 + Math.floor(150 * (mpDelta / levelMod));

//   // Display special cooldowns to for debug purposes
//   // eslint-disable-next-line no-console
//   if (job === 'GNB') {
//     // eslint-disable-next-line no-console
//     console.log(`Sonic Break recast: ${nextActionOverlay.recast.sonicbreak}`);
//     // eslint-disable-next-line no-console
//     console.log(`Gnashing Fang recast: ${nextActionOverlay.recast.gnashingfang}`);
//   } else if (job === 'NIN') {
//     // eslint-disable-next-line no-console
//     console.log(`Shadow Fang recast: ${nextActionOverlay.recast.shadowfang}`);
//   } else if (job === 'MCH') {
//     // eslint-disable-next-line no-console
//     console.log(`Drill recast: ${nextActionOverlay.recast.drill}`);
//     // eslint-disable-next-line no-console
//     console.log(`Hotshot recast: ${nextActionOverlay.recast.hotshot}`);
//   } else if (job === 'SMN') {
//     // eslint-disable-next-line no-console
//     console.log(`Egi Assault recast: ${egiassaultRecast}`);
//   }
// };
