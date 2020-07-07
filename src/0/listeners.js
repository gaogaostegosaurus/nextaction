
/* https://github.com/quisquous/cactbot/blob/master/CactbotOverlay/JSEvents.cs shows all possible events */

/* This seems useful to eventually add ?
addOverlayListener('onInitializeOverlay', (e) => {
}); */

/* Store list of whatevers in property matching job abbreivations -
  allows for some code reuse across jobs */

// Objects

const nextActionOverlay = {};
nextActionOverlay.propertyList = [
  'next',
  'timeout',

  'gameExists',
  'playerData', /* All player data sits here */
  'targetData',

  'actionList', /* These get job things attached to the end */
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

  'onAction', /* These get job things attached to the end */
  'onStatus',
  'onCasting',
  'onJobChange',
  'onTargetChange',
  'onPlayerChangedEvent',
];

nextActionOverlay.propertyList.forEach((property) => {
  nextActionOverlay[property] = nextActionOverlay[property] || {};
});

/* Static RegExes */
nextActionOverlay.statsRegex = new RegExp(' 0C:Player Stats: (?<jobID>[\\d]+):(?<strength>[\\d]+):(?<dexterity>[\\d]+):(?<vitality>[\\d]+):(?<intelligence>[\\d]+):(?<mind>[\\d]+):(?<piety>[\\d]+):(?<attackPower>[\\d]+):(?<directHitRate>[\\d]+):(?<criticalHit>[\\d]+):(?<attackMagicPotency>[\\d]+):(?<healingMagicPotency>[\\d]+):(?<determination>[\\d]+):(?<skillSpeed>[\\d]+):(?<spellSpeed>[\\d]+):0:(?<tenacity>[\\d]+)');

addOverlayListener('onPlayerChangedEvent', (e) => { /* Fires after onZoneChangedEvent on reload */
  const playerData = nextActionOverlay.playerData;

  /* This block activates on job/level change */
  if (e.detail.job !== nextActionOverlay.playerData.job
    || e.detail.level !== nextActionOverlay.playerData.level) {
    /* Set new playerData */
    // nextActionOverlay.playerData = e.detail;

    const actionList = nextActionOverlay.actionList;
    const statusList = nextActionOverlay.statusList;
    const castingList = nextActionOverlay.castingList;

    /* Fix ID - defaults to decimal value */
    playerData.name = e.detail.name;
    playerData.level = e.detail.level;
    playerData.job = e.detail.job;
    playerData.id = e.detail.id.toString(16).toUpperCase();

    /* Reset playerData values from nextActionOverlay */
    playerData.gcd = 2500;
    playerData.mpRegen = 200;
    playerData.targetCount = 1;
    playerData.comboStep = '';
    playerData.comboTimeout = -1;

    /* Initialize job-specific stuff */
    nextActionOverlay.onJobChange[playerData.job](); /* Sets static and initial values */
    nextActionOverlay.onPlayerChangedEvent[playerData.job](e); /* Links dynamic values */

    /* Creates new regexes for matching */
    const actionNames = Object.values(actionList[playerData.job]).flat(Infinity).join('|');
    const statusNames = Object.values(statusList[playerData.job]).flat(Infinity).join('|');
    const castingNames = Object.values(castingList[playerData.job]).flat(Infinity).join('|');

    nextActionOverlay.actionRegex = new RegExp(
      `^.{15}(?<logType>1[56]):(?<sourceID>${playerData.id}):(?<sourceName>${playerData.name}):(?<actionID>[\\dA-F]{1,8}):(?<actionName>${actionNames}):(?<targetID>[\\dA-F]{8}):(?<comboCheck>([^:]*:)*?1?1B:)?`,
    );
    nextActionOverlay.statusRegex = new RegExp(
      `^.{15}(?<logType>1[AE]):(?<targetID>[\\dA-F]{8}):(?<targetName>[ -~]+?) (?<gainsLoses>gains|loses) the effect of (?<statusName>${statusNames}) from (?<sourceName>${playerData.name})(?: for )?(?<statusDuration>\\d*\\.\\d*)?(?: Seconds)?\\.`,
    );
    nextActionOverlay.castingRegex = new RegExp(
      `^.{15}00:(?<logType>[\\da-f]+):You begin casting (?<actionName>${castingNames})\\.`, 'i',
    );
    nextActionOverlay.cancelRegex = new RegExp(
      `^.{15}00:(?<logType>[\\da-f]+):You cancel (?<actionName>${castingNames})\\.`, 'i',
    );
    /* NOTE: Casting matching relies on standard log output */
    /* Not sure if there's a better solution since the network log line is suuuuuuper slow */

    /* Initialize overlay */
    nextActionOverlay.next.NIN();
    console.log(`Changed to ${playerData.job}${playerData.level}`);
  }

  nextActionOverlay.onPlayerChangedEvent[playerData.job](e);

  /* Section below does job-specific stuff */

  /* This creates 8 part array for "unsupported" jobs - index is [0] to [7].
    Example: playerData.fourfoldFeathers = parseInt(debugJobArray[0], 16);
    (Need to use parseInt because 04 is not the same as 4.) */
  // const debugJobArray = e.detail.debugJob.split(' ');
  // if (playerData.job === 'BRD') {
  //   if (e.detail.jobDetail.songName === 'Ballad') {
  //     playerData.songName = 'Mage\'s Ballad';
  //   } else if (e.detail.jobDetail.songName === 'Paeon') {
  //     playerData.songName = 'Army\'s Paeon';
  //   } else if (e.detail.jobDetail.songName === 'Minuet') {
  //     playerData.songName = 'The Wanderer\'s Minuet';
  //   } else if (e.detail.jobDetail.songName === 'None') {
  //     playerData.songName = '';
  //   }
  //   playerData.songStatus = e.detail.jobDetail.songMilliseconds;
  //   playerData.repertoire = e.detail.jobDetail.songProcs;
  //   playerData.soulvoice = e.detail.jobDetail.soulGauge;
  // } else if (playerData.job === 'DNC') {
  //   playerData.fourfoldFeathers = parseInt(debugJobArray[0], 16); /* 0-4 */
  //   playerData.esprit = parseInt(debugJobArray[1], 16); /* 0-100 */
  //
  //   /* Steps - 1 is Emboite, 2 is Entrechat, 3 is Jete, 4 is Pirouette */
  //   playerData.step1 = parseInt(debugJobArray[2], 16);
  //   playerData.step2 = parseInt(debugJobArray[3], 16);
  //   playerData.step3 = parseInt(debugJobArray[4], 16);
  //   playerData.step4 = parseInt(debugJobArray[5], 16);
  //   playerData.stepTotal = debugJobArray[6]; /* 0-4 */
  // } else if (playerData.job === 'DRK') {
  //   playerData.blood = e.detail.jobDetail.blood;
  //   playerData.darkarts = parseInt(debugJobArray[4], 16);
  // } else if (playerData.job === 'GNB') {
  //   playerData.cartridges = e.detail.jobDetail.cartridges;
  //   // playerData.cartridges = parseInt(debugJobArray[0], 16); /* 0-2 */
  // } else if (playerData.job === 'MCH') {
  //   playerData.heat = e.detail.jobDetail.heat;
  //   playerData.overheated = e.detail.jobDetail.overheatMilliseconds;
  //   if (playerData.overheated === 0) {
  //     playerData.overheated = -1; /* Simplifies comparisons */
  //   }
  //   playerData.battery = e.detail.jobDetail.battery;
  // } else if (playerData.job === 'MNK') {
  //   playerData.onPlayerChangedEvent[playerData.job](e);
  // } else if (playerData.job === 'NIN') {
  //   playerData.huton = e.detail.jobDetail.hutonMilliseconds;
  //   if (playerData.huton === 0) {
  //     playerData.huton = -1;
  //   }
  //   playerData.ninki = e.detail.jobDetail.ninkiAmount;
  // } else if (playerData.job === 'PLD') {
  //   playerData.oath = e.detail.jobDetail.oath;
  // } else if (playerData.job === 'RDM') {
  //   //
  // } else if (playerData.job === 'SCH') {
  //   playerData.aetherflow = parseInt(debugJobArray[2], 16); /* 0-3 */
  //   // playerData.faerie = parseInt(debugJobArray[3], 16); /* 0-100 */
  // } else if (playerData.job === 'SMN') {
  //   playerData.aetherflow = e.detail.jobDetail.aetherflowStacks; /* 0-3 */
  //   playerData.dreadwyrmAether = e.detail.jobDetail.dreadwyrmStacks; /* 0-2 */
  //   playerData.firebirdToggle = e.detail.jobDetail.bahamutStacks; /* 0-1 */
  //   if (playerData.firebirdToggle === 1) {
  //     playerData.dreadwyrm = -1;
  //     playerData.firebird = e.detail.jobDetail.dreadwyrmMilliseconds;
  //   } else {
  //     playerData.dreadwyrm = e.detail.jobDetail.dreadwyrmMilliseconds;
  //     playerData.firebird = -1;
  //   }
  //   playerData.bahamut = e.detail.jobDetail.bahamutMilliseconds;
  // } else if (playerData.job === 'WHM') {
  //   // playerData.lilies = parseInt(debugJobArray[4], 16);
  //   playerData.bloodLily = parseInt(debugJobArray[5], 16); /* 0-3 */
  // }
});

addOverlayListener('onLogEvent', (e) => { // Fires on log event
  // console.log('onLogEvent');
  const length = e.detail.logs.length;
  const logs = e.detail.logs;
  let aoeTargetsHit = 0;

  /* Shorten RegEx names */
  const actionRegex = nextActionOverlay.actionRegex;
  const statusRegex = nextActionOverlay.statusRegex;
  const castingRegex = nextActionOverlay.castingRegex;
  const cancelRegex = nextActionOverlay.cancelRegex;
  const statsRegex = nextActionOverlay.statsRegex;

  const onAction = nextActionOverlay.onAction;
  const onStatus = nextActionOverlay.onStatus;
  const onCasting = nextActionOverlay.onCasting;
  const onCancel = nextActionOverlay.onCancel;

  for (let i = 0; i < length; i += 1) {
    const actionMatch = logs[i].match(actionRegex);
    const statusMatch = logs[i].match(statusRegex);
    const castingMatch = logs[i].match(castingRegex);
    const cancelMatch = logs[i].match(cancelRegex);
    const statsMatch = logs[i].match(statsRegex);

    const playerData = nextActionOverlay.playerData;

    if (actionMatch) {
      const logType = actionMatch.groups.logType;
      const actionName = actionMatch.groups.actionName;
      const targetID = actionMatch.groups.targetID;
      if (logType === '15') {
        onAction[playerData.job](actionMatch);
      } else if (logType === '16') {
        const timeout = nextActionOverlay.timeout;
        const timeoutName = actionName.replace(/[\s':-]/g, '').toLowerCase();
        if (targetID.startsWith('4') && actionName !== 'Dream Within A Dream') {
          /* DWAW hits one target multiple times using logType 16 */
          aoeTargetsHit += 1;
          if (playerData.targetCount !== aoeTargetsHit) {
            playerData.targetCount = aoeTargetsHit;
          }
        }
        clearTimeout(timeout[`${timeoutName}`]);
        timeout[`${timeoutName}`] = setTimeout(onAction[playerData.job], 50, actionMatch);
      }
    } else if (statusMatch) {
      onStatus[playerData.job](statusMatch);
    } else if (castingMatch) {
      onCasting[playerData.job](castingMatch);
    } else if (cancelMatch) {
      // console.log(`${cancelMatch}`);
      onCancel[playerData.job](cancelMatch);
    } else if (statsMatch) {
      /* Calculates speed-related stuff */

      const levelMods = [
        /* Level, MP, Stat 1, Stat 2, "Level Mod", HP, ELMT?, THREAT? */
        [0, 0, 0, 0, 0, 0, 0, 0], /* So that the index = level */
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
        [79, 10000, 335, 378, 3164, '??', '??', '??'], /* was 355 a typo? Fixed to 335 */
        [80, 10000, 340, 380, 3300, '??', '??', 569],
      ]; /* DEFINITELY keep this collapsed...... */
      const levelMod = levelMods[playerData.level][4];

      const mpBase = levelMods[playerData.level][2];
      const mpDelta = statsMatch.groups.piety - mpBase;
      playerData.mpRegen = 200 + Math.floor(150 * (mpDelta / levelMod));

      const speed = Math.max(statsMatch.groups.skillSpeed, statsMatch.groups.spellSpeed);
      const speedBase = levelMods[playerData.level][3];
      const speedDelta = speed - speedBase;

      playerData.gcd = Math.floor(
        Math.floor(
          10000 * (
            Math.floor(
              (2500 * (1000 - Math.floor(130 * (speedDelta / levelMod)))) / 1000,
            ) / 1000),
        ) / 100,
      ) * 10; // Modified to output in ms

      /* Actions affected by speed here */
      nextActionOverlay.recast.sonicbreak = playerData.gcd * 24;
      nextActionOverlay.recast.gnashingfang = playerData.gcd * 12;

      nextActionOverlay.recast.shadowfang = Math.floor(
        Math.floor(
          10000 * (
            Math.floor(
              (70000 * (1000 - Math.floor(130 * (speedDelta / levelMod)))) / 1000,
            ) / 1000),
        ) / 100,
      ) * 10; /* why? why. WHY */

      nextActionOverlay.recast.drill = playerData.gcd * 8;
      nextActionOverlay.recast.hotshot = playerData.gcd * 16;
      nextActionOverlay.recast.airanchor = playerData.recast.hotshot;

      const egiassaultRecast = playerData.gcd * 12;
      nextActionOverlay.recast.egiassault1 = egiassaultRecast;
      nextActionOverlay.recast.egiassault2 = egiassaultRecast;
      nextActionOverlay.recast.egiassaultii1 = egiassaultRecast;
      nextActionOverlay.recast.egiassaultii2 = egiassaultRecast;
    }
  }
});

addOverlayListener('EnmityTargetData', (e) => {
  // console.log(`onTargetChangedEvent: ${JSON.stringify(e)}`);

  /* Copied from stringify for notes:
  {"type":"EnmityTargetData","Target":{"ID":1073746514,"OwnerID":0,"Type":2,"TargetID":275370607,"Job":0,"Name":"Striking Dummy","CurrentHP":254,"MaxHP":16000,"PosX":-706.4552,"PosY":23.5000038,"PosZ":-583.5873,"Rotation":-0.461016417,"Distance":"2.78","EffectiveDistance":0,"Effects":[{"BuffID":508,"Stack":0,"Timer":10.7531652,"ActorID":275370607,"isOwner":false}]},"Focus":null,"Hover":null,"TargetOfTarget":{"ID":275370607,"OwnerID":0,"Type":1,"TargetID":3758096384,"Job":30,"Name":"Lyn Tah'row","CurrentHP":87008,"MaxHP":87008,"PosX":-708.9726,"PosY":23.5000038,"PosZ":-582.397156,"Rotation":2.01241565,"Distance":"0.00","EffectiveDistance":0,"Effects":[{"BuffID":365,"Stack":10,"Timer":30,"ActorID":3758096384,"isOwner":false},{"BuffID":360,"Stack":10,"Timer":30,"ActorID":3758096384,"isOwner":false}]},"Entries":[{"ID":275370607,"OwnerID":0,"Name":"Lyn Tah'row","Enmity":100,"isMe":true,"HateRate":100,"Job":30}]} (Source: file:///C:/Users/Dan/Google%20Drive/Advanced%20Combat%20Tracker/Plugins/next/src/0/listeners.js, Line: 219) */

  /* Possible properties for e.Target are
    ID - as decimal number instead of hex
    OwnerID - often "0", I assume this is for pets or something
    Type
    TargetID
    Job
    Name
    CurrentHP, MaxHP
    PosX, PosY, PosZ, Rotation
    Distance - Distance to center of target
    EffectiveDistance - Distance to edge of target
    Effects - Array of effects (?)
  */

  const playerData = nextActionOverlay.playerData;
  const targetData = nextActionOverlay.targetData;

  if (e.Target && playerData.job) {
    if (targetData.id !== e.Target.ID.toString(16).toUpperCase()) {
      targetData.name = e.Target.Name;
      targetData.id = e.Target.ID.toString(16).toUpperCase();
      nextActionOverlay.onTargetChange[playerData.job]();
    }

    targetData.distance = e.Target.EffectiveDistance; /* Distance to "outside of circle" */

    /* Shows and hides the overlay based on target and combat status */
  }

  if (nextActionOverlay.gameActive
  && (playerData.combat
    || (targetData.id && targetData.id.startsWith('4') && targetData.distance <= 25)
  )) {
    document.getElementById('nextdiv').classList.replace('next-hide', 'next-show');
  } else {
    document.getElementById('nextdiv').classList.replace('next-show', 'next-hide');
  }


});

addOverlayListener('onInCombatChangedEvent', (e) => {
  // console.log(`onInCombatChangedEvent: ${JSON.stringify(e)}`);
  const playerData = nextActionOverlay.playerData;
  if (playerData.combat !== e.detail.inGameCombat) {
    playerData.combat = e.detail.inGameCombat;
    if (playerData.combat === false) {
      playerData.targetCount = 1; /* Reset targetCount when OOC */
    }
  }
});

addOverlayListener('onZoneChangedEvent', (e) => {
  /* This appears to fire first on reload, so be careful of what is put here.
    It probably won't work if it requires the character data to be loaded as well. */
  // console.log(`onZoneChangedEvent: ${JSON.stringify(e)}`);
  nextActionOverlay.playerData.zone = e.detail.zoneName;
});

addOverlayListener('onPartyWipe', (e) => {
  /* Leaving this here to see when/what it outputs */
  console.log(`onPartyWipe: ${JSON.stringify(e)}`);
});

addOverlayListener('onGameExistsEvent', (e) => {
  // console.log(`onGameExistsEvent: ${JSON.stringify(e)}`);
  nextActionOverlay.gameExists = e.detail.exists; /* Appears to only have this */
});

addOverlayListener('onGameActiveChangedEvent', (e) => {
  // console.log(`onGameActiveChangedEvent: ${JSON.stringify(e)}`);
  nextActionOverlay.gameActive = e.detail.active; /* Appears to only have this */
});

callOverlayHandler({ call: 'cactbotRequestState' });
