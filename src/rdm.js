// actionList.RDM = [
//   // Off-GCD
//   'Corps-A-Corps', 'Displacement', 'Fleche', 'Contre Sixte', 'Acceleration', 'Manafication',
//   'Engagement', 'Embolden',
//   // GCD
//   'Jolt', 'Verfire', 'Verstone', 'Jolt II', 'Verthunder', 'Veraero',
//   'Verthunder II', 'Veraero II', 'Impact', 'Scatter',
//   'Riposte', 'Zwerchhau', 'Redoublement', 'Moulinet', 'Reprise',
//   'Enchanted Riposte', 'Enchanted Zwerchhau', 'Enchanted Redoublement', 'Enchanted Moulinet',
//   'Enchanted Reprise',
//   'Verflare', 'Verholy', 'Scorch',
//   // Role
//   'Swiftcast', 'Lucid Dreaming',
// ];

const rdmAccelerationSpells = [
  'Verthunder',
  'Veraero',
  'Verflare',
  'Verholy',
];

const rdmCooldowns = [
  'Corps-A-Corps', 'Displacement', 'Fleche', 'Contre Sixte', 'Acceleration', 'Manafication',
  'Engagement', 'Embolden',
  'Swiftcast', 'Lucid Dreaming',
];

const rdmComboActions = [
  'Enchanted Riposte',
  'Enchanted Zwerchhau',
  'Enchanted Redoublement',
  'Verflare',
  'Verholy',
  'Scorch',
];

const rdmDualcastSpells = [
  'Jolt',
  'Verthunder',
  'Veraero',
  'Scatter',
  'Verthunder II',
  'Veraero II',
  'Verfire',
  'Verstone',
  'Vercure',
  'Jolt II',
  'Impact',
];

const rdmWeaponskills = [
  'Riposte', 'Enchanted Riposte',
  'Zwerchhau', 'Enchanted Zwerchhau',
  'Redoublement', 'Enchanted Redoublement',
  'Moulinet', 'Enchanted Moulinet',
  'Verflare',
  'Verholy',
  'Reprise', 'Enchanted Reprise',
  'Scorch',
];

actionList.RDM = [...new Set([
  ...rdmAccelerationSpells,
  ...rdmComboActions,
  ...rdmCooldowns,
  ...rdmDualcastSpells,
  ...rdmWeaponskills,
])];

castingList.RDM = [
  'Jolt',
  'Verfire',
  'Verstone',
  'Jolt II',
  'Verthunder',
  'Veraero',
  'Verthunder II',
  'Veraero II',
  'Vercure',
  'Impact',
  'Scatter',
];

statusList.RDM = [
  // 'Dualcast',
  'Verfire Ready',
  'Verstone Ready',
  // 'Manafication',
  // 'Swiftcast',
];

const rdmNextGCD = ({
  // accelerationCount,
  // accelerationRecast,
  // accelerationStatus,
  blackMana,
  comboStep,
  dualcastStatus,
  // manaCap,
  // manaTarget,
  manaficationRecast,
  // mp,
  swiftcastStatus,
  verfirereadyStatus,
  verstonereadyStatus,
  whiteMana,
} = {}) => {
  /* Time with Reprise needed to reduce Mana under 50 */
  const repriseTime = (Math.ceil((Math.min(blackMana, whiteMana) - 54) / 5) - 1) * 2200;
  /* Time with Reprise needed to reduce Mana under 60 */
  // const moulinetTime = (Math.ceil((Math.min(blackMana, whiteMana) - 59) / 20) - 1) * 1500;
  /* Both assume 2 Reprise is 2200 ms, 3 is 4400, etc. */

  /* Instant cast status not available */
  if (Math.max(dualcastStatus, swiftcastStatus) < 0) {
    /* Spend excess mana before Manafication */
    if (player.level >= 80 && ['Verflare', 'Verholy'].includes(comboStep)) {
      return 'Scorch';
    } else if (player.level >= 70 && comboStep === 'Enchanted Redoublement') {
      // /* Proc is gone before it can be used, if under this time */
      // let minimumTime = player.gcd * 2; /* Verflare/Verholy, Verfire/Verstone */
      // if (player.level >= 80) {
      //   minimumTime = player.gcd * 3; /* Verflare/Verholy, Scorch, Verfire/Verstone */
      // }
      if (blackMana > whiteMana) {
        if (verstonereadyStatus < 0) {
          return 'Verholy';
        } else if (verstonereadyStatus > 0 && verstonereadyStatus < 0
        && blackMana + 21 - whiteMana <= 30) {
          return 'Verflare';
        } return 'Verholy';
      } else if (blackMana < whiteMana) {
        if (verfirereadyStatus < 0) {
          return 'Verflare';
        } else if (verfirereadyStatus > 0 && verstonereadyStatus < 0
        && whiteMana + 21 - blackMana <= 30) {
          return 'Verholy';
        } return 'Verflare';
      } else if (verfirereadyStatus > verstonereadyStatus) {
        return 'Verholy';
      } else if (verfirereadyStatus < verstonereadyStatus) {
        return 'Verflare';
      } return 'Verholy';
    } else if (player.level >= 68 && comboStep === 'Enchanted Redoublement') {
      return 'Verflare';
    } else if (player.level >= 50 && comboStep === 'Enchanted Zwerchhau') {
      return 'Enchanted Redoublement';
    } else if (player.level >= 35 && comboStep === 'Enchanted Riposte') {
      return 'Enchanted Zwerchhau';
    } else if (player.level >= 76 && manaficationRecast < repriseTime) {
      return 'Enchanted Reprise';
    } else if (Math.min(verfirereadyStatus, verstonereadyStatus) > player.gcd) {
      if (blackMana > whiteMana && verfirereadyStatus > player.gcd * 3) {
        return 'Verstone';
      } else if (blackMana < whiteMana && verstonereadyStatus > player.gcd * 3) {
        return 'Verfire';
      } else if (verfirereadyStatus > verstonereadyStatus
      && Math.min(whiteMana + 9, 100) - blackMana <= 30) {
        return 'Verstone';
      } else if (verfirereadyStatus < verstonereadyStatus
      && Math.min(blackMana + 9, 100) - whiteMana <= 30) {
        return 'Verfire';
      } else if (player.level >= 62) { return 'Jolt II'; } return 'Jolt';
    } else if (verfirereadyStatus > player.gcd) {
      if (Math.min(blackMana + 9, 100) - whiteMana <= 30) {
        return 'Verfire';
      } else if (player.level >= 62) { return 'Jolt II'; } return 'Jolt';
    } else if (verstonereadyStatus > player.gcd) {
      if (Math.min(whiteMana + 9, 100) - blackMana <= 30) {
        return 'Verstone';
      } else if (player.level >= 62) { return 'Jolt II'; } return 'Jolt';
    } else if (player.level >= 62) { return 'Jolt II'; } return 'Jolt';
    /* Instant cast */
  } else if (Math.min(verfirereadyStatus, verstonereadyStatus) > player.gcd * 2) {
    if (blackMana > whiteMana) {
      return 'Veraero';
    } else if (blackMana < whiteMana) {
      return 'Verthunder';
    } return 'Veraero';
  } else if (verfirereadyStatus > player.gcd) {
    if (Math.min(whiteMana + 11, 100) - blackMana <= 30) {
      return 'Veraero';
    } return 'Verthunder';
  } else if (verstonereadyStatus > player.gcd) {
    if (Math.min(blackMana + 11, 100) - whiteMana <= 30) {
      return 'Verthunder';
    } return 'Veraero';
  } else if (player.level >= 10 && blackMana > whiteMana) {
    return 'Veraero';
  } else if (player.level >= 6 && blackMana < whiteMana) {
    return 'Verthunder';
  } else if (player.level >= 10) {
    return 'Veraero';
  } else if (player.level >= 6) {
    return 'Verthunder';
  } return 'Jolt';
};

const rdmNextOGCD = ({
  accelerationRecast,
  blackMana,
  comboStep,
  contresixteRecast,
  // dualcastStatus,
  emboldenRecast,
  engagementRecast,
  flecheRecast,
  luciddreamingRecast,
  manaficationRecast,
  mp,
  swiftcastRecast,
  // swiftcastStatus,
  verfirereadyStatus,
  verstonereadyStatus,
  whiteMana,
} = {}) => {
  if (mp < 8000 && luciddreamingRecast < 0) {
    return 'Lucid Dreaming';
  } else if (contresixteRecast < 0 && player.countTargets > 1) {
    return 'Contre Sixte';
  } else if (flecheRecast < 0) {
    return 'Fleche';
  } else if (contresixteRecast < 0) {
    return 'Contre Sixte';
  } else if (player.level >= 60 && player.targetCount === 1 && manaficationRecast < 0
  && Math.min(blackMana, whiteMana) >= 40) {
    return 'Manafication';
  } else if (player.level >= 60 && manaficationRecast < 0 && Math.min(blackMana, whiteMana) >= 50) {
    return 'Manafication';
  } else if (emboldenRecast < 0) {
    return 'Embolden';
  } else if (engagementRecast < 0) {
    return 'Engagement';
  } else if (swiftcastRecast < 0 && Math.max(blackMana, whiteMana) < 80 && comboStep === ''
  && Math.max(verfirereadyStatus, verstonereadyStatus) < 0) {
    /* "If you are below 80|80 Mana & ran out of both Verstone and Verfire procs,
    fish for a proc." */
    return 'Swiftcast';
  } else if (swiftcastRecast < 0 && Math.max(blackMana, whiteMana) < 60 && comboStep === ''
  && Math.min(verfirereadyStatus, verstonereadyStatus) < 0) {
    /* If you are below 60|60 Mana & only have a single Verstone proc OR a Verfire proc,
    fish for the other proc. */
    return 'Swiftcast';
  } else if (accelerationRecast < 0 && Math.max(blackMana, whiteMana) < 80
  && Math.max(verfirereadyStatus, verstonereadyStatus) < 0) {
    return 'Acceleration';
  } else if (accelerationRecast < 0 && Math.max(blackMana, whiteMana) < 60
  && Math.min(verfirereadyStatus, verstonereadyStatus) < 0) {
    return 'Acceleration';
  } return '';
};

const rdmNext = ({
  gcd = 0,
} = {}) => { // Main function
  let gcdTime = gcd;
  let castTime = 0;
  let nextTime = 0; /* Amount of time looked ahead in loop */
  let mpTick = 0;
  // let manaCap = 100;
  let rdmCombo = 0;

  let accelerationCount = player.accelerationCount;
  let blackMana = player.blackMana;
  let comboStep = player.comboStep;
  let mp = player.mp;
  let whiteMana = player.whiteMana;

  const displacementRecast = checkRecast({ name: 'Displacement' });

  let accelerationRecast = checkRecast({ name: 'Acceleration' });
  let accelerationStatus = checkStatus({ name: 'Acceleration' });
  let contresixteRecast = checkRecast({ name: 'Contre Sixte' });
  let dualcastStatus = checkStatus({ name: 'Dualcast' });
  let emboldenRecast = checkRecast({ name: 'Embolden' });
  let engagementRecast = displacementRecast;
  let flecheRecast = checkRecast({ name: 'Fleche' });
  let luciddreamingStatus = checkStatus({ name: 'Lucid Dreaming' });
  let luciddreamingRecast = checkRecast({ name: 'Lucid Dreaming' });
  let manaficationRecast = checkRecast({ name: 'Manafication' });
  // let manaficationStatus = checkStatus({ name: 'Manafication' });
  let swiftcastRecast = checkRecast({ name: 'Swiftcast' });
  let swiftcastStatus = checkStatus({ name: 'Swiftcast' });
  let verfirereadyStatus = checkStatus({ name: 'Verfire Ready' });
  let verstonereadyStatus = checkStatus({ name: 'Verstone Ready' });

  const rdmArray = [];

  do {
    let loopTime = 0; /* The elapsed time for current loop */

    if (gcdTime === 0) {
      /* Display starting combo action at sufficient mana */
      if (rdmCombo === 0) {
        if (player.level >= 50 && Math.min(blackMana, whiteMana) >= 80) {
          rdmArray.push({ name: 'Enchanted Riposte' });
          rdmCombo = 1;
        } else if (player.level >= 35 && player.level < 50
        && Math.min(blackMana, whiteMana) >= 55) {
          rdmArray.push({ name: 'Enchanted Riposte' });
          rdmCombo = 1;
        } else if (player.level < 35 && Math.min(blackMana, whiteMana) >= 30) {
          rdmArray.push({ name: 'Enchanted Riposte' });
          rdmCombo = 1;
        }
      }

      /* Insert GCD icon if GCD is complete */
      const nextGCD = rdmNextGCD({
        blackMana,
        comboStep,
        dualcastStatus,
        manaficationRecast,
        swiftcastStatus,
        verfirereadyStatus,
        verstonereadyStatus,
        whiteMana,
      });

      rdmArray.push({ name: nextGCD });

      /* Set GCD and Dualcast status */
      if (rdmDualcastSpells.includes(nextGCD)) {
        if (dualcastStatus > 0) {
          dualcastStatus = -1;
          gcdTime = player.gcd;
        } else if (swiftcastStatus > 0) {
          swiftcastStatus = -1;
          gcdTime = player.gcd;
          // } else if (rdmDualcastSpells.includes(nextGCD)) {
          //   dualcastStatus = duration.dualcast + 4500;
        } else {
          dualcastStatus = duration.dualcast + 1500;
          castTime = player.gcd;
          gcdTime = 0;
        }
      } else if (['Enchanted Redoublement', 'Enchanted Reprise'].includes(nextGCD)) {
        gcdTime = 2200;
      } else if (rdmWeaponskills.includes(nextGCD)) {
        gcdTime = 1500;
      } else {
        gcdTime = player.gcd;
      }

      loopTime = gcdTime + castTime;

      /* Combo */
      if (rdmComboActions.includes(nextGCD)) {
        comboStep = nextGCD;
        if (nextGCD === 'Scorch') {
          comboStep = '';
        }
      } else {
        comboStep = '';
      }

      /* Resources */
      let blackManaIncrease = 0;
      let whiteManaIncrease = blackManaIncrease;
      if (['Jolt', 'Jolt II'].includes(nextGCD)) {
        blackManaIncrease = 3;
        whiteManaIncrease = blackManaIncrease;
      } else if (nextGCD === 'Verthunder') {
        if (accelerationStatus > 0) {
          verfirereadyStatus = duration.verfireready;
          accelerationCount -= 1;
        }
        blackManaIncrease = 11;
      } else if (nextGCD === 'Veraero') {
        if (accelerationStatus > 0) {
          verstonereadyStatus = duration.verstoneready;
          accelerationCount -= 1;
        }
        whiteManaIncrease = 11;
      } else if (nextGCD === 'Verfire') {
        verfirereadyStatus = -1;
        blackManaIncrease = 9;
      } else if (nextGCD === 'Verstone') {
        verstonereadyStatus = -1;
        whiteManaIncrease = 9;
      } else if (nextGCD === 'Verflare') {
        if (blackMana < whiteMana) {
          verfirereadyStatus = duration.verfireready;
        } else if (accelerationStatus > 0) {
          verfirereadyStatus = duration.verfireready;
          accelerationCount -= 1;
        }
        blackManaIncrease = 21;
      } else if (nextGCD === 'Verholy') {
        if (blackMana > whiteMana) {
          verstonereadyStatus = duration.verstoneready;
        } else if (accelerationStatus > 0) {
          verstonereadyStatus = duration.verstoneready;
          accelerationCount -= 1;
        }
        whiteManaIncrease = 21;
      } else if (nextGCD === 'Enchanted Riposte') {
        blackManaIncrease = -30;
        whiteManaIncrease = blackManaIncrease;
      } else if (nextGCD === 'Enchanted Zwerchhau') {
        blackManaIncrease = -25;
        whiteManaIncrease = blackManaIncrease;
      } else if (nextGCD === 'Enchanted Redoublement') {
        blackManaIncrease = -25;
        whiteManaIncrease = blackManaIncrease;
      } else if (nextGCD === 'Enchanted Moulinet') {
        blackManaIncrease = -20;
        whiteManaIncrease = blackManaIncrease;
      } else if (nextGCD === 'Enchanted Reprise') {
        blackManaIncrease = -5;
        whiteManaIncrease = blackManaIncrease;
        // console.log('reprise: black'+blackMana+' white'+whiteMana);
        // console.log(gcdTime);
      } else if (nextGCD === 'Scorch') {
        blackManaIncrease = 7;
        whiteManaIncrease = blackManaIncrease;
      }

      /* Adjust for unbalanced */
      /* Check that it's an actual increase first */
      if (Math.sign(Math.min(blackManaIncrease, whiteManaIncrease)) === 1) {
        if (blackMana < whiteMana + 30) {
          blackManaIncrease = Math.floor(blackManaIncrease / 2);
        } else if (blackMana + 30 > whiteMana) {
          whiteManaIncrease = Math.floor(whiteManaIncrease / 2);
        }
      }

      /* Adjust mana values */
      blackMana = Math.min(blackMana + blackManaIncrease, 100);
      whiteMana = Math.min(whiteMana + whiteManaIncrease, 100);

      /* Acceleration */
      if (accelerationStatus > 0 && nextGCD === 'Verthunder') {
        verfirereadyStatus = duration.verfireready;
        accelerationCount -= 1;
      } else if (accelerationStatus > 0 && nextGCD === 'Veraero') {
        verstonereadyStatus = duration.verstoneready;
        accelerationCount -= 1;
      } else if (accelerationStatus > 0 && nextGCD === 'Verflare' && blackMana >= whiteMana) {
        verfirereadyStatus = duration.verfireready;
        accelerationCount -= 1;
      } else if (accelerationStatus > 0 && nextGCD === 'Verholy' && blackMana <= whiteMana) {
        verstonereadyStatus = duration.verstoneready;
        accelerationCount -= 1;
      } else if (nextGCD === 'Verflare' && blackMana < whiteMana) {
        verfirereadyStatus = duration.verfireready;
      } else if (nextGCD === 'Verholy' && blackMana > whiteMana) {
        verstonereadyStatus = duration.verstoneready;
      }

      /* Remove Acceleration if no more stacks calculated */
      if (accelerationCount === 0) {
        accelerationStatus = -1;
      }
    }

    /* Queue OGCD if GCD action was instant */
    if (gcdTime > 0) {
      const nextOGCD = rdmNextOGCD({
        accelerationRecast,
        blackMana,
        comboStep,
        contresixteRecast,
        emboldenRecast,
        engagementRecast,
        flecheRecast,
        luciddreamingRecast,
        manaficationRecast,
        mp,
        swiftcastRecast,
        verfirereadyStatus,
        verstonereadyStatus,
        whiteMana,
      });

      if (nextOGCD) {
        rdmArray.push({ name: nextOGCD, size: 'small' });
        // console.log(nextOGCD);
      }

      if (nextOGCD === 'Fleche') {
        flecheRecast = recast.fleche;
      } else if (nextOGCD === 'Contre Sixte') {
        contresixteRecast = recast.contresixte;
      } else if (nextOGCD === 'Embolden') {
        emboldenRecast = recast.embolden;
      } else if (nextOGCD === 'Manafication') {
        // manaficationStatus = duration.manafication;
        manaficationRecast = recast.manafication;
        if (player.level >= 74) {
          manaficationRecast = 110000;
        }
        blackMana = Math.min(blackMana * 2, 100);
        whiteMana = Math.min(whiteMana * 2, 100);
      } else if (nextOGCD === 'Engagement') {
        engagementRecast = recast.displacement;
      } else if (nextOGCD === 'Lucid Dreaming') {
        luciddreamingRecast = recast.luciddreaming;
        luciddreamingStatus = duration.luciddreaming;
      } else if (nextOGCD === 'Swiftcast') {
        swiftcastRecast = recast.swiftcast;
        swiftcastStatus = duration.swiftcast;
      } else if (nextOGCD === 'Acceleration') {
        accelerationRecast = recast.acceleration;
        accelerationStatus = duration.acceleration;
        accelerationCount = 3;
      }

      gcdTime = 0;
    }

    accelerationRecast -= loopTime;
    accelerationStatus -= loopTime;
    contresixteRecast -= loopTime;
    dualcastStatus -= loopTime;
    emboldenRecast -= loopTime;
    engagementRecast -= loopTime;
    flecheRecast -= loopTime;
    luciddreamingRecast -= loopTime;
    luciddreamingStatus -= loopTime;
    manaficationRecast -= loopTime;
    // manaficationStatus -= loopTime;
    swiftcastRecast -= loopTime;
    swiftcastStatus -= loopTime;
    verfirereadyStatus -= loopTime;
    verstonereadyStatus -= loopTime;

    nextTime += loopTime;

    /* MP tick */
    if (Math.floor(loopTime / 3000) > mpTick) {
      mp = Math.min(mp + 200, 10000);
      if (luciddreamingStatus > 0) {
        mp = Math.min(mp + 500, 10000);
      }
      mpTick += 1;
    }
  } while (nextTime < 16000);
  iconArrayB = rdmArray;
  syncIcons();
};

onAction.RDM = (actionMatch) => {
  /* Remove matched icon */
  removeIcon({ name: actionMatch.groups.actionName });

  /* Target number guesswork */
  if (player.level >= 18 && actionMatch.groups.actionName === 'Jolt') {
    player.targetCount = 1;
  } else if (actionMatch.groups.actionName === 'Scatter') {
    player.targetCount = 3;
  } else if (player.level >= 66
  && ['Verthunder', 'Veraero'].includes(actionMatch.groups.actionName)) {
    player.targetCount = 1;
  } else if (['Verthunder', 'Veraero'].includes(actionMatch.groups.actionName)
  && player.targetCount === 3) {
    player.targetCount = 2;
  } else if (player.level < 62 && player.targetCount === 1
  && ['Verthunder II', 'Veraero II'].includes(actionMatch.groups.actionName)) {
    player.targetCount = 2;
  } else if (['Verthunder II', 'Veraero II'].includes(actionMatch.groups.actionName)) {
    player.targetCount = 3;
  } else if (actionMatch.groups.actionName === 'Jolt II' && player.targetCount === 3) {
    player.targetCount = 2;
  } else if (actionMatch.groups.actionName === 'Impact' && player.targetCount === 1) {
    player.targetCount = 2;
  } else if (player.level >= 52 && rdmComboActions.includes(actionMatch.groups.actionName)) {
    player.targetCount = 1;
  } else if (actionMatch.groups.actionName === 'Enchanted Moulinet' && player.targetCount === 1) {
    player.targetCount = 2;
  } else {
    player.targetCount = 1;
  }

  /* Acceleration */
  if (checkStatus({ name: 'Acceleration' }) > 0
  && rdmAccelerationSpells.includes(actionMatch.groups.actionName)) {
    player.accelerationCount -= 1;
  }
  if (player.accelerationCount === 0) {
    removeStatus({ name: 'Acceleration' });
  }

  /* Call loop */
  if (rdmCooldowns.includes(actionMatch.groups.actionName)) {
    addRecast({ name: actionMatch.groups.actionName });
    if (actionMatch.groups.actionName === 'Acceleration') {
      addStatus({ name: 'Acceleration' });
      player.accelerationCount = 3;
    } else if (actionMatch.groups.actionName === 'Manafication') {
      if (player.level >= 74) {
        addRecast({ name: actionMatch.groups.actionName, time: 110000 });
      }
      addRecast({ name: 'Corps-A-Corps', time: -1 });
      addRecast({ name: 'Displacement', time: -1 });
    } else if (actionMatch.groups.actionName === 'Engagement') {
      /* Set Displacement cooldown with Engagement */
      removeIcon({ name: 'Displacement' });
      addRecast({ name: 'Displacement' });
    } else if (actionMatch.groups.actionName === 'Swiftcast') {
      addStatus({ name: 'Swiftcast' });
    } else if (actionMatch.groups.actionName === 'Lucid Dreaming') {
      addStatus({ name: 'Lucid Dreaming' });
    }
  } else if (rdmDualcastSpells.includes(actionMatch.groups.actionName)) {
    /* Dualcast and Swiftcast spells */
    player.comboStep = '';

    /* Remove Verfire/Verstone Ready */
    if (actionMatch.groups.actionName === 'Verfire') {
      removeStatus({ name: 'Verfire Ready' });
    } else if (actionMatch.groups.actionName === 'Verstone') {
      removeStatus({ name: 'Verstone Ready' });
    }

    /* Call loop with appropriate gcd parameter */
    if (Math.max(checkStatus({ name: 'Dualcast' }) > 0)) {
      /* Dualcast used for instant cast */
      removeStatus({ name: 'Dualcast' });
      rdmNext({ gcd: player.gcd });
    } else if (Math.max(checkStatus({ name: 'Swiftcast' }) > 0)) {
      /* Swiftcast used for instant cast */
      removeStatus({ name: 'Swiftcast' });
      rdmNext({ gcd: player.gcd });
    } else {
      /* No instant cast, add Dualcast */
      addStatus({ name: 'Dualcast', time: 15000 });
      rdmNext({ gcd: 0 });
    }
  } else if (rdmWeaponskills.includes(actionMatch.groups.actionName)) {
    /* Well I guess some aren't Weaponskills, but close enough */
    if (actionMatch.groups.comboCheck) {
      player.comboStep = actionMatch.groups.actionName;
    } else {
      player.comboStep = '';
    }

    if (['Enchanted Riposte', 'Enchanted Zwerchhau', 'Enchanted Moulinet'].includes(actionMatch.groups.actionName)) {
      rdmNext({ gcd: 1500 });
    } else if (['Enchanted Redoublement', 'Enchanted Reprise'].includes(actionMatch.groups.actionName)) {
      rdmNext({ gcd: 2200 });
    } else {
      rdmNext({ gcd: player.gcd });
    }
  } else { /* What did I miss? */
    rdmNext({ gcd: player.gcd });
  }
};

onStatus.RDM = (statusMatch) => {
  if (statusMatch.groups.gainsLoses === 'gains') {
    addStatus({
      name: statusMatch.groups.statusName,
      time: parseFloat(statusMatch.groups.statusDuration) * 1000,
    });

    if (statusMatch.groups.statusName === 'Verfire Ready') {
      rdmNext({ gcd: player.gcd });
    } else if (statusMatch.groups.statusName === 'Verstone Ready') {
      rdmNext({ gcd: player.gcd });
    }
  }
};

onCasting.RDM = (castingMatch) => {
  fadeIcon({ name: castingMatch.groups.actionName });
  rdmNext();
};

onCancel.RDM = (cancelledMatch) => {
  unfadeIcon({ name: cancelledMatch.groups.actionName });
  rdmNext();
};

onTargetChanged.RDM = () => {
  if (player.combat === 0) {
    rdmNext();
  }
};

onJobChange.RDM = () => {
  rdmNext();
};
