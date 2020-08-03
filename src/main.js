// Load this first, probably
const nextActionOverlay = {};

// Define property objects for later use
// Keep collapsed
nextActionOverlay.propertyList = [
  'nextAction',
  'timeout',

  'changedJob',
  'castingLog',
  'cancelLog',
  'actionLog',
  'statusLog',

  // 'gameExists',
  'playerData', // All player data sits here
  'targetData',

  'actionList', // These get job things attached to the end
  'statusList',
  'castingList',
  'icon',
  'recast',
  'duration',
  'recastTracker',
  'statusTracker',

  'iconArrayA',
  'iconArrayB',
  'iconArrayC',

  // 'onAction', // These get job things attached to the end
  // 'onStatus',
  // 'onCasting',
  // 'onCancel',
  // 'onJobChanged',
  // 'onTargetChanged',
  // 'onPlayerChangedEvent',
]; // Keep collapsed

nextActionOverlay.propertyList.forEach((property) => {
  nextActionOverlay[property] = {}; // Set all of the above as objects
});

// Supported job list
nextActionOverlay.supportedJobs = [
  'PLD', 'GNB',
  'MNK', 'NIN', 'DNC',
  'RDM',
];

// Toggles overlay appropriately (hopefully)
nextActionOverlay.overlayToggle = (
  // { targetData, combat, display, }
) => {
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

// Use these to call the correct function for each job.js
// These functions wrap some of the specific code so that I can find errors easier (hopefully)

nextActionOverlay.EnmityTargetData = (e) => {
  if (!nextActionOverlay.ready) { return; }
  const { playerData } = nextActionOverlay;
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

  const { targetData } = nextActionOverlay;
  const jobLowercase = job.toLowerCase();

  if (!e.Target && targetData.decimalid !== 0) {
    // Switched to no target

    targetData.name = '';
    targetData.decimalid = 0;
    targetData.id = 0;
    if (nextActionOverlay[`${jobLowercase}TargetChange`]) {
      nextActionOverlay[`${jobLowercase}TargetChange`]();
    }
  } else if (e.Target && targetData.decimalid !== e.Target.ID) {
    // Switched to some target

    targetData.name = e.Target.Name; // Set new targetData
    targetData.decimalid = e.Target.ID;
    targetData.id = targetData.decimalid.toString(16).toUpperCase();
    if (nextActionOverlay[`${jobLowercase}TargetChange`]) {
      nextActionOverlay[`${jobLowercase}TargetChange`]();
    }
  }

  if (e.Target) { // Put stuff that should be constantly updated here
    targetData.distance = e.Target.EffectiveDistance; // Distance to "outside of circle"
  }

  nextActionOverlay.overlayToggle();
};

nextActionOverlay.onInCombatChangedEvent = (e) => {
  if (nextActionOverlay.combat !== e.detail.inGameCombat) { // Combat status changed
    nextActionOverlay.combat = e.detail.inGameCombat; // true or false
    nextActionOverlay.overlayToggle();
  }
};

nextActionOverlay.onPlayerChangedEvent = (e) => {
  const { playerData } = nextActionOverlay;

  if (e.detail.name !== playerData.name || e.detail.job !== playerData.job
  || e.detail.level !== playerData.level) { // "If name/job/level has changed, do this stuff"
    // Set new playerData
    // This is the first point at which playerData properties are defined after reloading
    playerData.name = e.detail.name;
    playerData.level = e.detail.level;
    playerData.job = e.detail.job;
    playerData.decimalid = e.detail.id; // ID defaults to decimal value
    playerData.id = playerData.decimalid.toString(16).toUpperCase();

    const { duration } = nextActionOverlay;

    // Set some initial values
    nextActionOverlay.targetCount = 1;
    nextActionOverlay.comboStep = '';
    playerData.gcd = 2500;
    playerData.mpRegen = 200;
    duration.combo = 14000; // I don't know what this is actually supposed to be

    const { job } = playerData;
    const jobLowercase = job.toLowerCase();
    const { supportedJobs } = nextActionOverlay;

    // Reset all timeouts
    const { timeout } = nextActionOverlay; // Timeout object
    Object.keys(timeout).forEach((timeoutProperty) => { clearTimeout(timeout[timeoutProperty]); });

    // Clear overlay
    // Check if divs are ready
    // (I don't really get it but sometimes they are null)
    if (!document.getElementById('icon-a')) {
      nextActionOverlay.ready = false;
      return;
    }
    document.getElementById('icon-a').innerHTML = '';
    document.getElementById('icon-b').innerHTML = '';
    document.getElementById('icon-c').innerHTML = '';
    // document.getElementById('countdown-a').innerHTML = '';
    // document.getElementById('countdown-b').innerHTML = '';
    // document.getElementById('countdown-c').innerHTML = '';

    // Reset lists
    // Probably a more elegant way to do this, but whatever for now...
    nextActionOverlay.actionList = {};
    nextActionOverlay.statusList = {};
    nextActionOverlay.castingList = {};
    const { actionList } = nextActionOverlay;
    const { statusList } = nextActionOverlay;
    const { castingList } = nextActionOverlay;

    // Set ready as false and return if job unsupported
    if (!supportedJobs.includes(job)) {
      nextActionOverlay.ready = false;
      return;
    }

    // Tell overlay that job changed, which sets up some job-specific stuff
    nextActionOverlay[`${jobLowercase}JobChange`]();

    // Creates new regexes for matching
    const actionNames = Object.values(actionList).flat(Infinity).join('|');
    const statusNames = Object.values(statusList).flat(Infinity).join('|');
    const castingNames = Object.values(castingList).flat(Infinity).join('|'); // This relies on chat log output
    // Shorten some static (or semi-static) variables
    const { name } = playerData;
    const { level } = playerData;
    const { id } = playerData;

    nextActionOverlay.actionRegex = new RegExp(`^.{15}(?<logType>1[56]):(?<sourceID>${id}):(?<sourceName>${name}):(?<actionID>[\\dA-F]{1,8}):(?<actionName>${actionNames}):(?<targetID>[\\dA-F]{8}):(?<comboCheck>([^:]*:)*?1?1B:)?`);
    nextActionOverlay.statusRegex = new RegExp(`^.{15}(?<logType>1[AE]):(?<targetID>[\\dA-F]{8}):(?<targetName>[ -~]+?) (?<gainsLoses>gains|loses) the effect of (?<statusName>${statusNames}) from (?<sourceName>${name})(?: for )?(?<statusDuration>\\d*\\.\\d*)?(?: Seconds)?\\.`);
    nextActionOverlay.castingRegex = new RegExp(`^.{15}00:(?<logType>[\\da-f]+):You begin casting (?<actionName>${castingNames})\\.`, 'i');
    nextActionOverlay.cancelRegex = new RegExp(`^.{15}00:(?<logType>[\\da-f]+):You cancel (?<actionName>${castingNames})\\.`, 'i');
    nextActionOverlay.playerstatsRegex = new RegExp('^.{15}0C:Player Stats: (?<jobID>[\\d]+):(?<strength>[\\d]+):(?<dexterity>[\\d]+):(?<vitality>[\\d]+):(?<intelligence>[\\d]+):(?<mind>[\\d]+):(?<piety>[\\d]+):(?<attackPower>[\\d]+):(?<directHitRate>[\\d]+):(?<criticalHit>[\\d]+):(?<attackMagicPotency>[\\d]+):(?<healingMagicPotency>[\\d]+):(?<determination>[\\d]+):(?<skillSpeed>[\\d]+):(?<spellSpeed>[\\d]+):0:(?<tenacity>[\\d]+)'); // This regex is always static for now, maybe not in future?

    // Initialize resources and such
    if (nextActionOverlay[`${jobLowercase}PlayerChange`]) {
      nextActionOverlay[`${jobLowercase}PlayerChange`](e);
    }

    // Initialize overlay (finally)
    nextActionOverlay[`${jobLowercase}NextAction`]();

    // eslint-disable-next-line no-console
    console.log(`Changed to ${job}${level}`);
    nextActionOverlay.ready = true;
  } else {
    const { job } = playerData;
    const jobLowercase = job.toLowerCase();
    // Just the usual player changed event
    if (nextActionOverlay[`${jobLowercase}PlayerChange`]) {
      nextActionOverlay[`${jobLowercase}PlayerChange`](e);
    }
  }

  // This function loads all the character details
  // Probably best candidate for triggering "overlay is ready"?
};

nextActionOverlay.onLogEvent = (e) => {
  if (!nextActionOverlay.ready) { return; }
  const { playerData } = nextActionOverlay;
  const { job } = playerData;
  // const { supportedJobs } = nextActionOverlay;

  const { logs } = e.detail;
  const { length } = e.detail.logs;

  // Shorten some names
  const { actionRegex } = nextActionOverlay;
  const { statusRegex } = nextActionOverlay;
  const { castingRegex } = nextActionOverlay;
  const { cancelRegex } = nextActionOverlay;
  const { playerstatsRegex } = nextActionOverlay;

  const jobLowercase = job.toLowerCase();

  let aoeTargetsHit = 0;
  // This doesn't seem to be a perfect way to do this, but whatever until I find a better one

  for (let i = 0; i < length; i += 1) {
    const actionMatch = logs[i].match(actionRegex);
    const statusMatch = logs[i].match(statusRegex);
    const castingMatch = logs[i].match(castingRegex);
    const cancelMatch = logs[i].match(cancelRegex);
    const playerstatsMatch = logs[i].match(playerstatsRegex);

    if (actionMatch && nextActionOverlay[`${jobLowercase}ActionMatch`]) {
      const { logType } = actionMatch.groups;
      const { targetID } = actionMatch.groups;
      const { actionName } = actionMatch.groups;
      if (logType === '16') {
        const { timeout } = nextActionOverlay;
        const timeoutName = actionName.replace(/[\s':-]/g, '').toLowerCase();
        if (targetID.startsWith('4') && actionName !== 'Dream Within A Dream') { // DWAW hits multiple times using logType 16
          aoeTargetsHit += 1;
          if (nextActionOverlay.targetCount !== aoeTargetsHit) {
            nextActionOverlay.targetCount = aoeTargetsHit;
          }
        }
        clearTimeout(timeout[`${timeoutName}`]);
        timeout[`${timeoutName}`] = setTimeout(nextActionOverlay[`${jobLowercase}ActionMatch`], 50, actionMatch);
      } else if (logType === '15') {
        nextActionOverlay[`${jobLowercase}ActionMatch`](actionMatch);
      }
    } else if (statusMatch && nextActionOverlay[`${jobLowercase}StatusMatch`]) {
      nextActionOverlay[`${jobLowercase}StatusMatch`](statusMatch);
    } else if (castingMatch && nextActionOverlay[`${jobLowercase}CastingMatch`]) {
      nextActionOverlay[`${jobLowercase}CastingMatch`](castingMatch);
    } else if (cancelMatch && nextActionOverlay[`${jobLowercase}CancelMatch`]) {
      nextActionOverlay[`${jobLowercase}CancelMatch`](cancelMatch);
    } else if (playerstatsMatch) {
      const { level } = playerData;
      // Keep below collapsed
      const levelMods = [
        // Level, MP, Stat 1, Stat 2, "Level Mod", HP, ELMT?, THREAT?
        [0, 0, 0, 0, 0, 0, 0, 0], // So that the index = level
        [1, 10000, 20, 56, 56, 86, 52, 2],
        [2, 10000, 21, 57, 57, 101, 54, 2],
        [3, 10000, 22, 60, 60, 109, 56, 3],
        [4, 10000, 24, 62, 62, 116, 58, 3],
        [5, 10000, 26, 65, 65, 123, 60, 3],
        [6, 10000, 27, 68, 68, 131, 62, 3],
        [7, 10000, 29, 70, 70, 138, 64, 4],
        [8, 10000, 31, 73, 73, 145, 66, 4],
        [9, 10000, 33, 76, 76, 153, 68, 4],
        [10, 10000, 35, 78, 78, 160, 70, 5],
        [11, 10000, 36, 82, 82, 174, 73, 5],
        [12, 10000, 38, 85, 85, 188, 75, 5],
        [13, 10000, 41, 89, 89, 202, 78, 6],
        [14, 10000, 44, 93, 93, 216, 81, 6],
        [15, 10000, 46, 96, 96, 230, 84, 7],
        [16, 10000, 49, 100, 100, 244, 86, 7],
        [17, 10000, 52, 104, 104, 258, 89, 8],
        [18, 10000, 54, 109, 109, 272, 93, 9],
        [19, 10000, 57, 113, 113, 286, 95, 9],
        [20, 10000, 60, 116, 116, 300, 98, 10],
        [21, 10000, 63, 122, 122, '333?', 102, 10],
        [22, 10000, 67, 127, 127, 366, 105, 11],
        [23, 10000, 71, 133, 133, 399, 109, 12],
        [24, 10000, 74, 138, 138, 432, 113, 13],
        [25, 10000, 78, 144, 144, 465, 117, 14],
        [26, 10000, 81, 150, 150, '498?', 121, 15],
        [27, 10000, 85, 155, 155, 531, 125, 16],
        [28, 10000, 89, 162, 162, 564, 129, 17],
        [29, 10000, 92, 168, 168, '597?', 133, 18],
        [30, 10000, 97, 173, 173, 630, 137, 19],
        [31, 10000, 101, 181, 181, 669, 143, 20],
        [32, 10000, 106, 188, 188, 708, 148, 22],
        [33, 10000, 110, 194, 194, 747, 153, 23],
        [34, 10000, 115, 202, 202, 786, 159, 25],
        [35, 10000, 119, 209, 209, 825, 165, 27],
        [36, 10000, 124, 215, 215, 864, 170, 29],
        [37, 10000, 128, 223, 223, 903, 176, 31],
        [38, 10000, 134, 229, 229, 942, 181, 33],
        [39, 10000, 139, 236, 236, 981, 186, 35],
        [40, 10000, 144, 244, 244, 1020, 192, 38],
        [41, 10000, 150, 253, 253, 1088, 200, 40],
        [42, 10000, 155, 263, 263, 1156, 207, 43],
        [43, 10000, 161, 272, 272, 1224, 215, 46],
        [44, 10000, 166, 283, 283, 1292, 223, 49],
        [45, 10000, 171, 292, 292, '1360?', 231, 52],
        [46, 10000, 177, 302, 302, '1428?', 238, 55],
        [47, 10000, 183, 311, 311, 1496, 246, 58],
        [48, 10000, 189, 322, 322, '1564?', 254, 62],
        [49, 10000, 196, 331, 331, 1632, 261, 66],
        [50, 10000, 202, 341, 341, 1700, 269, 70],
        [51, 10000, 204, 342, 393, 1774, 270, 84],
        [52, 10000, 205, 344, 444, 1851, 271, 99],
        [53, 10000, 207, 345, 496, '1931?', 273, 113],
        [54, 10000, 209, 346, 548, 2015, 274, 128],
        [55, 10000, 210, 347, 600, 2102, 275, 142],
        [56, 10000, 212, 349, 651, 2194, 276, 157],
        [57, 10000, 214, 350, 703, 2289, 278, 171],
        [58, 10000, 215, 351, 755, 2388, 279, 186],
        [59, 10000, 217, 352, 806, 2492, 280, 200],
        [60, 10000, 218, 354, 858, 2600, 282, 215],
        [61, 10000, 224, 355, 941, 2700, 283, 232],
        [62, 10000, 228, 356, 1032, 2800, 284, 250],
        [63, 10000, 236, 357, 1133, 2900, 286, 269],
        [64, 10000, 244, 358, 1243, 3000, 287, 290],
        [65, 10000, 252, 359, 1364, 3100, 288, 313],
        [66, 10000, 260, 360, 1497, 3200, 290, 337],
        [67, 10000, 268, 361, 1643, 3300, 292, 363],
        [68, 10000, 276, 362, 1802, 3400, 293, 392],
        [69, 10000, 284, 363, 1978, 3500, 294, 422],
        [70, 10000, 292, 364, 2170, 3600, 295, 455],
        [71, 10000, 296, 365, 2263, '??', '??', 466],
        [72, 10000, 300, 366, 2360, '??', '??', '??'],
        [73, 10000, 305, 367, 2461, '??', '??', '??'],
        [74, 10000, 310, 368, 2566, '??', '??', '??'],
        [75, 10000, 315, 370, 2676, '??', '??', '??'],
        [76, 10000, 320, 372, 2790, '??', '??', '??'],
        [77, 10000, 325, 374, 2910, '??', '??', '??'],
        [78, 10000, 330, 376, 3034, '??', '??', '??'],
        [79, 10000, 335, 378, 3164, '??', '??', '??'], // was 355 a typo? Fixed to 335
        [80, 10000, 340, 380, 3300, '??', '??', 569],
      ]; // Keep above collapsed

      const { skillSpeed } = playerstatsMatch.groups;
      const { spellSpeed } = playerstatsMatch.groups;

      const levelMod = levelMods[level][4];
      const speed = Math.max(skillSpeed, spellSpeed);
      const speedBase = levelMods[level][3];
      const speedDelta = speed - speedBase;

      playerData.gcd = Math.floor(
        Math.floor(
          10000 * (
            Math.floor(
              (2500 * (1000 - Math.floor(130 * (speedDelta / levelMod)))) / 1000,
            ) / 1000),
        ) / 100,
      ) * 10; // Modified to output in ms

      const { gcd } = playerData; // Save some typing

      const { recast } = nextActionOverlay; // Shorten recast object

      recast.sonicbreak = gcd * 24;
      recast.gnashingfang = gcd * 12;

      recast.shadowfang = Math.floor(
        Math.floor(
          10000 * (
            Math.floor(
              (70000 * (1000 - Math.floor(130 * (speedDelta / levelMod)))) / 1000,
            ) / 1000),
        ) / 100,
      ) * 10; // Why? Why. WHY?

      recast.drill = gcd * 8;
      recast.hotshot = gcd * 16;
      recast.airanchor = nextActionOverlay.recast.hotshot;

      const egiassaultRecast = gcd * 12;
      recast.egiassault1 = egiassaultRecast;
      recast.egiassault2 = egiassaultRecast;
      recast.egiassaultii1 = egiassaultRecast;
      recast.egiassaultii2 = egiassaultRecast;

      const { piety } = playerstatsMatch.groups;
      const mpBase = levelMods[level][2];
      const mpDelta = piety - mpBase;

      playerData.mpRegen = 200 + Math.floor(150 * (mpDelta / levelMod));

      // Display special cooldowns to for debug purposes
      // eslint-disable-next-line no-console
      if (job === 'GNB') {
        // eslint-disable-next-line no-console
        console.log(`Sonic Break recast: ${nextActionOverlay.recast.sonicbreak}`);
        // eslint-disable-next-line no-console
        console.log(`Gnashing Fang recast: ${nextActionOverlay.recast.gnashingfang}`);
      } else if (job === 'NIN') {
        // eslint-disable-next-line no-console
        console.log(`Shadow Fang recast: ${nextActionOverlay.recast.shadowfang}`);
      } else if (job === 'MCH') {
        // eslint-disable-next-line no-console
        console.log(`Drill recast: ${nextActionOverlay.recast.drill}`);
        // eslint-disable-next-line no-console
        console.log(`Hotshot recast: ${nextActionOverlay.recast.hotshot}`);
      } else if (job === 'SMN') {
        // eslint-disable-next-line no-console
        console.log(`Egi Assault recast: ${egiassaultRecast}`);
      }
    }
  }
};

nextActionOverlay.nextAction = () => {
  if (!nextActionOverlay.ready) { return; }

  const { playerData } = nextActionOverlay;
  const { job } = playerData;
  const jobLowercase = job.toLowerCase();

  if (nextActionOverlay[`${jobLowercase}NextAction`]) {
    nextActionOverlay[`${jobLowercase}NextAction`]();
  }
};
