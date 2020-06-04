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
  'Goring Blade', 'Requiescat', 'Sword Oath',
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
  'Total Eclipse',
  'Shield Bash',
  'Shield Lob',
  'Rage Of Halone',
  'Prominence',
  'Goring Blade',
  'Royal Authority',
  'Atonement',
];

const pldSpells = [
  'Clemency',
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

const pldSingleTarget = [
  'Fast Blade',
  'Riot Blade',
  'Rage Of Halone',
  'Goring Blade',
  'Royal Authority',
  'Holy Spirit',
  'Atonement',
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
  } else if (player.level >= 54 && comboStep === 'Riot Blade' && goringbladeStatus < 6000) {
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
  // fightorflightRecast,
  // fightorflightStatus,
  goringbladeStatus,
  mp,
  requiescatStatus,
  swordoathStatus,
  swordoathCount,
} = {}) => {
  /* Atonement is highest DPS per GCD so I guess it should go here */
  if (swordoathStatus > 0 && swordoathCount > 0) {
    return 'Atonement';
  }

  if (player.level >= 78 && requiescatStatus > 0 && mp > 2000) {
    if (player.level >= 80 && (mp < 4000 || requiescatStatus < player.gcd)) {
      return 'Confiteor';
    } else if (player.targetCount > 1) {
      return 'Holy Circle';
    }
    return 'Holy Spirit';
  }

  return pldNextWeaponskill({ comboStep, goringbladeStatus });
  // if (player.level >= 78 && requiescatStatus > 0 && mp > 2000) {
  //   /* Rotation under Requiescat */
  //   if (player.level >= 80 && (mp < 4000 || requiescatStatus < player.gcd)) {
  //     return 'Confiteor';
  //   } else if (player.targetCount > 1) {
  //     return 'Holy Circle';
  //   }
  //   return 'Holy Spirit';
  // } else if (player.level < 78 && requiescatStatus > 1500 && mp > 2000) {
  //   /* Requiescat with cast times */
  //   if (player.targetCount > 1) {
  //     return 'Holy Circle';
  //   }
  //   return 'Holy Spirit';
  // } else if (player.level >= 52 && player.targetCount >= 3 && comboStep === 'Total Eclipse') {
  //   return 'Prominence';
  // } else if (player.level >= 6 && player.targetCount >= 3) {
  //   return 'Total Eclipse';
  // } else if (swordoathStatus > 0 && swordoathCount > 0) {
  //   return 'Atonement';
  // // } else if (player.level >= 54 && comboStep === 'Riot Blade'
  // // && fightorflightStatus > 6 * player.gcd) {
  // //   return 'Royal Authority'; /* Helps push Goring to end of FOF window, maybe */
  // } else if (player.level >= 54 && comboStep === 'Riot Blade'
  // && goringbladeStatus < player.gcd) {
  //   return 'Goring Blade'; /* Keep Goring up always */
  //   // } else if (player.level >= 54 && comboStep === 'Riot Blade'
  //   //   && fightorflightStatus > duration.fightorflight - player.gcd * 2) {
  //   //   return 'Goring Blade';
  //   // } else if (player.level >= 54 && comboStep === 'Riot Blade'
  //   //   && fightorflightStatus < player.gcd * 4) {
  //   // return 'Goring Blade';
  // // } else if (player.level >= 64 && player.level < 68 && fightorflightStatus < 0
  // // && fightorflightRecast > player.gcd * 3 && mp === 10000) {
  // //   /* This is probably a bad idea. */
  // //   return 'Holy Spirit';
  // } else if (player.level >= 60 && comboStep === 'Riot Blade') {
  //   return 'Royal Authority';
  // } else if (player.level >= 26 && comboStep === 'Riot Blade') {
  //   return 'Rage Of Halone';
  // } else if (player.level >= 4 && comboStep === 'Fast Blade') {
  //   return 'Riot Blade';
  // }
  // return 'Fast Blade';
};

const pldNextOGCD = ({
  circleofscornRecast,
  comboStep,
  fightorflightRecast,
  fightorflightStatus,
  gcdTime,
  // goringbladeStatus,
  // mp,
  requiescatRecast,
  requiescatStatus,
  spiritswithinRecast,
  // swordoathCount,
  // swordoathStatus,
} = {}) => {
  if (player.level >= 2 && fightorflightRecast < 0 && requiescatStatus < player.gcd
    && ['Fast Blade', 'Riot Blade', 'Total Eclipse', 'Prominence'].includes(comboStep)
    && gcdTime <= 1250) {
    return 'Fight Or Flight';
  } else if (player.level >= 68 && requiescatRecast < 0 && fightorflightStatus < player.gcd
  && ['Prominence', 'Goring Blade', 'Royal Authority', 'Atonement'].includes(comboStep)
  && gcdTime <= 1250) {
    return 'Requiescat';
  } else if (player.level >= 50 && circleofscornRecast < 0 && player.countTargets > 1) {
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

    if (gcdTime <= 0) {
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

      if (pldWeaponskills.includes(nextGCD)) {
        /* GCD stuff */
        comboStep = nextGCD;
        gcdTime = player.gcd;
        loopTime = gcdTime;

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
          comboStep = nextGCD;
          gcdTime = player.gcd;
          loopTime = gcdTime;

          swordoathCount -= 1;
          mp = Math.min(mp + 400, 10000);
          if (swordoathCount <= 0) {
            swordoathStatus = -1;
          }
        }
      } else if (pldSpells.includes(nextGCD)) {
        comboStep = '';
        mp -= 2000;

        if (player.level >= 78 && requiescatStatus > 0) {
          gcdTime = 2500;
          loopTime = 2500;
        } else {
          gcdTime = 2500;
          loopTime = 2500;
        }

        if (nextGCD === 'Confiteor') {
          requiescatStatus = -1;
        }
      }
    } else {
      const nextOGCD = pldNextOGCD({
        circleofscornRecast,
        comboStep,
        fightorflightRecast,
        fightorflightStatus,
        gcdTime,
        goringbladeStatus,
        mp,
        requiescatRecast,
        requiescatStatus,
        spiritswithinRecast,
        swordoathCount,
        // swordoathStatus,
      });

      if (gcdTime >= player.gcd) {
        gcdTime -= 1250;
      } else {
        gcdTime = 0;
      }

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
        requiescatStatus = duration.requiescat;
      }
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

onTargetChanged.PLD = () => {
  if (player.combat === 0) {
    pldNext();
  }
};

onAction.PLD = (actionMatch) => {
  removeIcon({ name: actionMatch.groups.actionName });

  if (pldMultiTarget.includes(actionMatch.groups.actionName)) {
    player.targetCount = 3;
  } else if (pldSingleTarget.includes(actionMatch.groups.actionName)) {
    player.targetCount = 1;
  }

  if (pldWeaponskills.includes(actionMatch.groups.actionName)) {
    if (actionMatch.groups.actionName === 'Atonement') {
      /* Atonement actually doesn't break combo */
      player.swordoathCount -= 1;
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
    pldNext({ gcd: player.gcd });
  } else if (pldSpells.includes(actionMatch.groups.actionName)) {
    player.comboStep = '';
    if (player.level >= 78 && checkStatus({ name: 'Requiescat' }) > 0) {
      pldNext({ gcd: player.gcd });
    } else {
      pldNext({ gcd: 0 });
    }
  } else if (pldCooldowns.includes(actionMatch.groups.actionName)) {
    addRecast({ name: actionMatch.groups.actionName });
    if (['Fight Or Flight', 'Requiescat'].includes(actionMatch.groups.actionName)) {
      addStatus({ name: actionMatch.groups.actionName });
    }
  }
  // console.debug(player.comboStep);
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
