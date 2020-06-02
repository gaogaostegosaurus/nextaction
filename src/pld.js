actionList.PLD = [

  // Non-GCD actions
  'Fight Or Flight', 'Spirits Within', 'Sheltron', 'Sentinel', 'Cover',
  'Divine Veil', 'Intervention', 'Requiescat', 'Passage Of Arms',
  'Intervene',
  'Circle Of Scorn',

  // GCD actions
  'Fast Blade', 'Riot Blade', 'Rage Of Halone', 'Goring Blade',
  'Royal Authority', 'Atonement', 'Holy Spirit',
  'Total Eclipse', 'Prominence', 'Holy Circle', 'Confiteor',
  // Total Eclipse => Prominence: 3 or more
  // Holy Circle: 2 or more

  // Role actions
  'Rampart', 'Arm\'s Length',

];

statusList.PLD = [
  'Fight Or Flight', 'Goring Blade', 'Requiescat', 'Sword Oath',
];

castingList.PLD = [
  'Clemency', 'Holy Spirit', 'Holy Circle',
];

// const pldAreaOfEffect = [
//   'Total Eclipse', 'Prominence', 'Circle Of Scorn', 'Holy Circle', 'Confiteor',
// ];
//
// const pldSingleTarget = [
//   'Holy Spirit',
// ];

const pldWeaponskills = [
  'Fast Blade',
  'Riot Blade',
  'Rage Of Halone',
  'Goring Blade',
  'Royal Authority',
  'Atonement',
  'Prominence',
  'Total Eclipse',
];

const pldSpells = [
  'Holy Spirit',
  'Holy Circle',
  'Confiteor',
];

const pldCooldowns = [
  'Fight Or Flight',
  'Spirits Within',
  'Circle Of Scorn',
  'Requiescat',
];

const pldMultiTarget = [
  'Total Eclipse',
  'Prominence',
  'Holy Circle',
];

// const pldSingleTarget = [
//   'Total Eclipse',
//   'Prominence',
// ];

// const pldFinisherWeaponskills = [
//   'Rage Of Halone', 'Goring Blade', 'Royal Authority', 'Prominence',
// ];

// const pldColumnA = [
//   'Fight Or Flight', 'Requiescat',
// ];
//
// const pldColumnB = [
//   'Rampart', 'Reprisal', 'Arm\'s Length', 'Sentinel', 'Hallowed Ground', 'Passage Of Arms',
// ];
//
// const pldColumnC = [
//   'Low Blow', 'Provoke', 'Interject', 'Shirk',
// ];

// const pldNextTimeout = () => {
//   clearTimeout(timeout.combo);
//   timeout.combo = setTimeout(pldNext, 12500);
// };


const pldNextWeaponskill = ({
  comboStep,
  goringbladeStatus,
} = {}) => {
  if (player.level >= 40 && player.targetCount >= 3 && comboStep === 'Total Eclipse') {
    return 'Prominence';
  } else if (player.level >= 6 && player.targetCount >= 3) {
    return 'Total Eclipse';
  } else if (player.level >= 54 && comboStep === 'Riot Blade'
  && goringbladeStatus < 0) {
    return 'Goring Blade';
  } else if (player.level >= 60 && comboStep === 'Riot Blade') {
    return 'Royal Authority';
  } else if (player.level >= 26 && comboStep === 'Riot Blade') {
    return 'Rage Of Halone';
  } else if (player.level >= 4 && comboStep === 'Fast Blade') {
    return 'Riot Blade';
  }
  return 'Fast Blade';
};

const pldNextGCD = ({
  comboStep,
  fightorflightRecast,
  // fightorflightStatus,
  goringbladeStatus,
  mp,
  requiescatStatus,
  swordoathStatus,
  // swordoathCount,
} = {}) => {
  // Interrupt things to make sure Fight or Flight starts at right time
  if (player.level >= 54 && fightorflightRecast < 0 && requiescatStatus < 0) {
    return 'Fast Blade';
  } else if (player.level >= 54 && fightorflightRecast < player.gcd && requiescatStatus < 0) {
    return 'Fast Blade';
  }

  // Atonement is highest potency per GCD, so use this first maybe
  if (swordoathStatus > 0 && player.targetCount < 3) {
    return 'Atonement';
  }

  // Requiescat stuff
  if (player.level >= 78 && requiescatStatus > 0 && mp > 2000) {
    /* Rotation under instant-cast Requiescat */
    if (player.level >= 80 && (mp < 4000 || requiescatStatus < player.gcd)) {
      return 'Confiteor';
    } else if (player.targetCount > 1) {
      return 'Holy Circle';
    }
    return 'Holy Spirit';
  } else if (requiescatStatus > 1500 && mp > 2000) {
    /* Requiescat with cast times */
    if (player.targetCount > 1) {
      return 'Holy Circle';
    }
    return 'Holy Spirit';
  }

  return pldNextWeaponskill({ comboStep, goringbladeStatus });
};

const pldNextOGCD = ({
  circleofscornRecast,
  comboStep, // Fight or Flight comes after Fast Blade
  fightorflightRecast,
  fightorflightStatus,
  // goringbladeStatus,
  mp,
  requiescatRecast,
  requiescatStatus,
  spiritswithinRecast,
  // swordoathCount,
  swordoathStatus,
} = {}) => {

  if ()

  if (player.level >= 54 && fightorflightRecast < 0 && requiescatStatus < player.gcd
  && ['Fast Blade', 'Riot Blade', 'Total Eclipse', 'Prominence'].includes(comboStep)) { /* Optimal but can't get it to work */
  // && ['Riot Blade', 'Total Eclipse'].includes(comboStep)) { /* Not optimal but I'm lazy */
    return 'Fight Or Flight';
  } else if (player.level >= 2 && player.level < 54 && fightorflightRecast < 0) {
    /* Just use it (tm) */
    return 'Fight Or Flight';
  } else if (player.level >= 68 && mp > 9600 && requiescatRecast < 0
  && ['Prominence', 'Goring Blade'].includes(comboStep)
  && swordoathStatus < 0 && fightorflightStatus < player.gcd * 2) {
    return 'Requiescat';
  }

  /* Regular OGCDs */
  if (player.level >= 50 && circleofscornRecast < 0 && player.countTargets > 1) {
    return 'Circle Of Scorn';
  } else if (player.level >= 30 && spiritswithinRecast < 0) {
    return 'Spirits Within';
  } else if (player.level >= 50 && circleofscornRecast < 0) {
    return 'Circle Of Scorn';
  }
  /* No OGCD */
  return '';
};

const pldNext = ({
  gcd = 0,
} = {}) => {
  let gcdTime = gcd;
  let nextTime = 0; /* Amount of time looked ahead in loop */
  let mpTick = 0;

  let comboStep = player.comboStep;
  let mp = player.mp;

  let circleofscornRecast = checkRecast({ name: 'Circle Of Scorn' });
  let fightorflightRecast = checkRecast({ name: 'Fight Or Flight' });
  let fightorflightStatus = checkStatus({ name: 'Fight Or Flight' });
  let goringbladeStatus = checkStatus({ name: 'Goring Blade', id: target.id });
  let requiescatRecast = checkRecast({ name: 'Requiescat' });
  let requiescatStatus = checkStatus({ name: 'Requiescat' });
  let spiritswithinRecast = checkRecast({ name: 'Spirits Within' });
  let swordoathStatus = checkStatus({ name: 'Sword Oath' });
  let swordoathCount = player.swordoathCount;

  const pldArray = [];

  do {
    let loopTime = 0; /* The elapsed time for current loop */

    if (gcdTime === 0) {
      /* Insert GCD icon if GCD is complete */
      const nextGCD = pldNextGCD({
        comboStep,
        fightorflightRecast,
        fightorflightStatus,
        goringbladeStatus,
        mp,
        requiescatStatus,
        swordoathStatus,
        swordoathCount,
      });

      pldArray.push({ name: nextGCD });

      /* Special stuff */
      if (nextGCD === 'Riot Blade') {
        mp = Math.min(mp + 1000, 10000);
      } else if (nextGCD === 'Prominence') {
        mp = Math.min(mp + 500, 10000);
      } else if (nextGCD === 'Goring Blade') {
        goringbladeStatus = duration.goringblade;
      } else if (player.level >= 76 && nextGCD === 'Royal Authority') {
        swordoathStatus = duration.swordoath;
        swordoathCount = 3;
      } else if (nextGCD === 'Atonement') {
        swordoathCount = Math.max(swordoathCount - 1, 0);
        mp = Math.min(mp + 400, 10000);
        if (swordoathCount === 0) {
          swordoathStatus = -1;
        }
      } else if (nextGCD === 'Confiteor') {
        requiescatStatus = -1;
      }

      /* Change comboStep for all Weaponskills */
      if (pldWeaponskills.includes(nextGCD)) {
        comboStep = nextGCD;
      } else {
        comboStep = '';
      }

      /* Calculate gcd time */
      gcdTime = player.gcd;
      loopTime = gcdTime;
      if (pldSpells.includes(nextGCD) && (player.level < 78 || requiescatStatus < 0)) {
        gcdTime = 0;
      }
    }

    /* Queue OGCD if GCD action was instant */
    if (gcdTime > 0) {
      const nextOGCD = pldNextOGCD({
        circleofscornRecast,
        comboStep,
        fightorflightRecast,
        fightorflightStatus,
        goringbladeStatus,
        mp,
        requiescatRecast,
        requiescatStatus,
        spiritswithinRecast,
        swordoathCount,
        // swordoathStatus,
      });

      if (nextOGCD) {
        pldArray.push({ name: nextOGCD, size: 'small' });
      }

      if (nextOGCD === 'Fight Or Flight') {
        fightorflightRecast = recast.fightorflight;
        fightorflightStatus = duration.fightorflight;
      } else if (nextOGCD === 'Spirits Within') {
        spiritswithinRecast = recast.spiritswithin;
        mp = Math.min(mp + 500, 10000);
      } else if (nextOGCD === 'Circle Of Scorn') {
        circleofscornRecast = recast.circleofscorn;
      } else if (nextOGCD === 'Requiescat') {
        requiescatRecast = recast.requiescat;
        requiescatStatus = duration.requiescat + 1000;
      }

      gcdTime = 0;
    }

    circleofscornRecast -= loopTime;
    fightorflightRecast -= loopTime;
    fightorflightStatus -= loopTime;
    goringbladeStatus -= loopTime;
    requiescatRecast -= loopTime;
    requiescatStatus -= loopTime;
    spiritswithinRecast -= loopTime;
    swordoathStatus -= loopTime;

    nextTime += loopTime;

    /* MP tick */
    if (Math.floor(loopTime / 3000) > mpTick) {
      mp = Math.min(mp + 200, 10000);
      mpTick += 1;
    }
  } while (nextTime < 15000);
  iconArrayB = pldArray;
  syncIcons();
};

onJobChange.PLD = () => {
  player.swordoathCount = 0;
  pldNext();
};

onTargetChanged.PLD = () => {};

onAction.PLD = (actionMatch) => {
  removeIcon({ name: actionMatch.groups.actionName });

  if (pldMultiTarget.includes(actionMatch.groups.actionName)) {
    player.targetCount = 3;
  } else {
    player.targetCount = 1;
  }

  if (pldWeaponskills.includes(actionMatch.groups.actionName)) {
    if (actionMatch.groups.actionName === 'Atonement') {
      /* Atonement actually doesn't break combo */
      player.swordoathCount = Math.max(player.swordoathCount - 1, 0);
    } else if (actionMatch.groups.comboCheck) {
      player.comboStep = actionMatch.groups.actionName;
      if (actionMatch.groups.actionName === 'Goring Blade') {
        addStatus({ name: 'Goring Blade', id: actionMatch.groups.targetID });
      } else if (player.level >= 76 && actionMatch.groups.actionName === 'Royal Authority') {
        addStatus({ name: 'Sword Oath' });
        player.swordoathCount = 3;
      }
    } else {
      player.comboStep = '';
    }
    pldNext({ gcd: 2500 });
  } else if (pldSpells.includes(actionMatch.groups.actionName)) {
    player.comboStep = actionMatch.groups.actionName;
    if (player.level >= 78 && checkStatus({ name: 'Requiescat' }) > 0) {
      pldNext({ gcd: 2500 });
    } else {
      pldNext({ gcd: 0 });
    }
  } else if (pldCooldowns.includes(actionMatch.groups.actionName)) {
    addRecast({ name: actionMatch.groups.actionName });
    if (['Fight Or Flight', 'Requiescat'].includes(actionMatch.groups.actionName)) {
      addStatus({ name: actionMatch.groups.actionName });
    }
  }
};

onCasting.PLD = () => {
  fadeIcon({ name: 'Holy', match: 'contains' });
};

onCancel.PLD = () => {
  pldNext();
};

onStatus.PLD = (statusMatch) => {
  if (statusMatch.groups.logType === '1E') {
    if (statusMatch.groups.statusName === 'Sword Oath') {
      player.swordoathCount = 0;
    }
  }
};
