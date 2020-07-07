
nextActionOverlay.actionList.RDM = [];

nextActionOverlay.actionList.RDM.spells = [
  'Jolt', 'Jolt II', 'Verfire', 'Verstone', 'Verthunder II', 'Veraero II',
  'Verthunder', 'Veraero', 'Scatter', 'Impact',
  'Vercure', 'Veraise',
];

nextActionOverlay.actionList.NIN = [];

nextActionOverlay.actionList.RDM.weaponskills = [
  /* Yes, some are technically not weaponskills but I don't care */
  'Riposte', 'Enchanted Riposte',
  'Zwerchhau', 'Enchanted Zwerchhau',
  'Redoublement', 'Enchanted Redoublement',
  'Verflare', 'Verholy', 'Scorch',
  'Moulinet', 'Enchanted Moulinet',
  'Reprise', 'Enchanted Reprise',
];

nextActionOverlay.actionList.RDM.abilities = [
  'Corps-A-Corps', 'Displacement', 'Fleche', 'Acceleration',
  'Contre Sixte', 'Embolden', 'Manafication',
  'Engagement',
  'Swiftcast', 'Lucid Dreaming',
];

/* Easier/more accurate controlling this via the buffs */
/* I think that means it won't work in Eureka but screw Eureka */


nextActionOverlay.statusList.RDM = [
  'Dualcast',
  'Verfire Ready',
  'Verstone Ready',
  'Swiftcast',
];

nextActionOverlay.onPlayerChangedEvent.RDM = (e) => {
  const playerData = nextActionOverlay.playerData;
  playerData.blackmana = e.detail.jobDetail.blackMana;
  playerData.whitemana = e.detail.jobDetail.whiteMana;
  playerData.mp = e.detail.jobDetail.mp;
};

const rdmNextDualcast = ({
  blackmana,
  whitemana,
  verfirereadyStatus,
  verstonereadyStatus,
  swiftcastStatus,
} = {}) => {
  const playerData = nextActionOverlay.playerData;
  const level = playerData.level;
  /* Verthunder/Veraero II: 100 */
  /* Verthunder/Veraero: 310 */
  /* Verstone/Verfire: 270 */

  let joltPotency = 180;
  if (level >= 62) {
    joltPotency = 280;
  }

  let verstonePotency = 270;
  if (level >= 62) {
    verstonePotency = 300;
  }

  let veraeroPotency = 310;
  if (level >= 62) {
    veraeroPotency = 370;
  }

  let veraeroiiPotency = 100 * player.targetCount;
  if (level >= 78) {
    veraeroiiPotency = 120 * player.targetCount;
  }

  const scatterPotency = 120 * player.targetCount;
  const impactPotency = 220 * player.targetCount;

  let hardcast = 'Jolt';
  let dualcast = 'Jolt';

  if (swiftcastStatus < 0) {
    if (level >= 18 && veraeroiiPotency > verstonePotency) {
      if (level >= 22 && blackmana > whitemana) {
        hardcast = 'Veraero II';
      } else {
        hardcast = 'Verthunder II';
      }
    } else if (level >= 18 && Math.max(verfirereadyStatus, verstonereadyStatus) < player.gcd
    && veraeroiiPotency > joltPotency) {
      if (level >= 22 && blackmana > whitemana) {
        hardcast = 'Veraero II';
      } else {
        hardcast = 'Verthunder II';
      }
    } else if (Math.min(blackmana + 9, 100) > whitemana + 30) {
      /* This and following block should prevent unbalanced mana */
      if (verstonereadyStatus > player.gcd) {
        hardcast = 'Verstone';
      }
    } else if (Math.min(whitemana + 9, 100) > blackmana + 30) {
      if (verfirereadyStatus > player.gcd) {
        hardcast = 'Verfire';
      }
    } else if (verfirereadyStatus > player.gcd && verstonereadyStatus < player.gcd) {
      hardcast = 'Verfire';
    } else if (verstonereadyStatus > player.gcd && verfirereadyStatus < player.gcd) {
      hardcast = 'Verstone';
    } else if (verfirereadyStatus > player.gcd && verstonereadyStatus > player.gcd) {
      if (verfirereadyStatus > player.gcd * 3 && verstonereadyStatus > player.gcd * 3) {
        if (blackmana > whitemana) {
          hardcast = 'Verstone';
        } else {
          hardcast = 'Verfire';
        }
      } else if (verfirereadyStatus > verstonereadyStatus) {
        hardcast = 'Verstone';
      } else {
        hardcast = 'Verfire';
      }
    }
  } else {
    hardcast = '(Swiftcasted)';
  }

  let blackmanaNext = blackmana;
  let whitemanaNext = whitemana;

  /* Add mana values from hardcast */
  if (hardcast === 'Jolt') {
    blackmanaNext += 3;
    whitemanaNext += 3;
  } else if (hardcast === 'Verthunder II') {
    blackmanaNext += 7;
  } else if (hardcast === 'Veraero II') {
    whitemanaNext += 7;
  } else if (hardcast === 'Verfire') {
    blackmanaNext += 9;
  } else if (hardcast === 'Verstone') {
    whitemanaNext += 9;
  }

  /* Set cap to 100 */
  blackmanaNext = Math.min(blackmanaNext, 100);
  whitemanaNext = Math.min(whitemanaNext, 100);

  if (level >= 66 && impactPotency > veraeroPotency) {
    dualcast = 'Impact';
  } else if (level >= 15 && scatterPotency > veraeroPotency) {
    dualcast = 'Scatter';
  } else if (level >= 10 && Math.min(blackmanaNext + 11, 100) > whitemanaNext + 30) {
    /* This and following block should prevent unbalanced mana */
    dualcast = 'Veraero';
  } else if (level >= 4 && Math.min(whitemanaNext + 11, 100) > blackmanaNext + 30) {
    dualcast = 'Verthunder';
  } else if (level >= 70 && Math.min(blackmanaNext + 11, 100) > whitemanaNext
  && Math.min(blackmanaNext + 11, whitemanaNext) > 80
  && (hardcast === 'Verstone' || verstonereadyStatus < player.gcd)) {
    /* Use Verthunder to set up for Verholy */
    dualcast = 'Verthunder';
  } else if (level >= 68 && Math.min(whitemanaNext + 11, 100) > blackmanaNext
  && Math.min(whitemanaNext + 11, blackmanaNext) > 80
  && (hardcast === 'Verfire' || verfirereadyStatus < player.gcd)) {
    /* Use Veraero to set up for Verflare */
    dualcast = 'Veraero';
  } else if (verfirereadyStatus > player.gcd && hardcast !== 'Verfire') {
    dualcast = 'Veraero';
  } else if (verstonereadyStatus > player.gcd && hardcast !== 'Verstone') {
    dualcast = 'Verthunder';
  } else if (level >= 10 && blackmanaNext > whitemanaNext) {
    dualcast = 'Veraero';
  } else if (level >= 4) {
    dualcast = 'Verthunder';
  }

  /* Upgrade actions from traits */
  if (level >= 62 && hardcast === 'Jolt') {
    hardcast = 'Jolt II';
  }
  if (level >= 66 && dualcast === 'Scatter') {
    dualcast = 'Impact';
  }

  return [hardcast, dualcast];
};

const rdmNextGCD = ({
  comboStep,
  hardcasting,
  blackmana,
  whitemana,
  manaficationRecast,
  swiftcastStatus,
  verfirereadyStatus,
  verstonereadyStatus,
} = {}) => {
  const playerData = nextActionOverlay.playerData;
  const level = playerData.level;

  let moulinetFloor = 40; /* Allows Reprise to be used until 40-59 mana is reached */
  if (player.targetCount >= 3) {
    moulinetFloor = 50; /* Allows Reprise to be used until 50-69 mana is reached */
  }

  let repriseFloor = 45; /* Allows Reprise to be used until 45-49 mana is reached */
  if (blackmana === whitemana) {
    repriseFloor = 46; /* Allows Reprise to be used until 46-50 mana is reached */
  }

  /* Calculate how many Reprise/Moulinet can be used and how much time it will take */
  const repriseCount = Math.floor(Math.max(Math.min(blackmana, whitemana) - repriseFloor, 0) / 5);
  const moulinetCount = Math.floor(Math.max(Math.min(blackmana, whitemana) - moulinetFloor, 0) / 5);
  const repriseTime = repriseCount * 2200; /* Reprise and Moulinet have set recast times */
  const moulinetTime = moulinetCount * 1500;

  /* Moves Dualcast combo to front if called by hardcasting something */
  // if (hardcasting !== '') {
  //   return rdmNextDualcast({
  //     blackmana,
  //     whitemana,
  //     verfirereadyStatus,
  //     verstonereadyStatus,
  //     swiftcastStatus,
  //   });
  // } else

  if (level >= 80 && ['Verflare', 'Verholy'].includes(comboStep)) {
    return 'Scorch';
  } else if (level >= 70 && blackmana + 21 > whitemana + 30
  && comboStep === 'Enchanted Redoublement') {
    return 'Verholy';
  } else if (level >= 68 && whitemana + 21 > blackmana + 30
  && comboStep === 'Enchanted Redoublement') {
    return 'Verflare';
  } else if (level >= 70 && verstonereadyStatus < player.gcd && blackmana > whitemana
  && comboStep === 'Enchanted Redoublement') {
    return 'Verholy';
  } else if (level >= 68 && verfirereadyStatus < player.gcd && whitemana > blackmana
  && comboStep === 'Enchanted Redoublement') {
    return 'Verflare';
  } else if (level >= 70 && verstonereadyStatus < player.gcd
  && comboStep === 'Enchanted Redoublement') {
    return 'Verholy';
  } else if (level >= 68 && verfirereadyStatus < player.gcd
  && comboStep === 'Enchanted Redoublement') {
    return 'Verflare';
  } else if (level >= 70 && blackmana >= whitemana
  && comboStep === 'Enchanted Redoublement') {
    return 'Verholy';
  } else if (level >= 68 && whitemana >= blackmana
  && comboStep === 'Enchanted Redoublement') {
    return 'Verflare';
  } else if (level >= 50 && Math.min(blackmana, whitemana) >= 25
  && comboStep === 'Enchanted Zwerchhau') {
    return 'Enchanted Redoublement';
  } else if (level >= 50 && Math.min(blackmana, whitemana) >= 50
  && comboStep === 'Enchanted Riposte') {
    return 'Enchanted Zwerchhau';
  } else if (level >= 35 && level < 50 && Math.min(blackmana, whitemana) >= 25
  && comboStep === 'Enchanted Riposte') {
    return 'Enchanted Zwerchhau';
  } else if (level >= 52 && player.targetCount > 1 && Math.min(blackmana, whitemana) >= 20
  && moulinetTime > manaficationRecast) {
    return 'Enchanted Moulinet'; /* This should take care of general AoE but check later */
  } else if (level >= 70 && Math.min(blackmana, whitemana) >= 80 && blackmana > whitemana
  && verstonereadyStatus < 1500 * 2 + 2200 + player.gcd * 3) {
    return 'Enchanted Riposte'; /* Start combo for Verholy */
  } else if (level >= 68 && Math.min(blackmana, whitemana) >= 80 && whitemana > blackmana
  && verfirereadyStatus < 1500 * 2 + 2200 + player.gcd * 3) {
    return 'Enchanted Riposte'; /* Start combo for Verflare */
  } else if (level >= 70 && Math.min(blackmana, whitemana) >= 80
  && whitemana + 21 < blackmana + 30 && verstonereadyStatus < 1500 * 2 + 2200 + player.gcd * 3) {
    return 'Enchanted Riposte'; /* Start combo for Verholy (20%) */
  } else if (level >= 68 && Math.min(blackmana, whitemana) >= 80
  && blackmana + 21 < whitemana + 30 && verfirereadyStatus < 1500 * 2 + 2200 + player.gcd * 3) {
    return 'Enchanted Riposte'; /* Start combo for Verflare (20%) */
  } else if (level >= 68 && Math.min(blackmana, whitemana) >= 80
  && Math.max(blackmana + 11, whitemana + 11) >= 100) {
    return 'Enchanted Riposte'; /* Likely to overcapping mana unless combo starts */
  } else if (level >= 2 && level < 68 && Math.min(blackmana, whitemana) >= 80) {
    return 'Enchanted Riposte'; /* Before Verflare/Verholy */
  } else if (level >= 2 && level < 50 && Math.min(blackmana, whitemana) >= 55) {
    return 'Enchanted Riposte'; /* Before Redoublement */
  } else if (level >= 2 && level < 35 && Math.min(blackmana, whitemana) >= 30) {
    return 'Enchanted Riposte'; /* Before Zwerchhau */
  } else if (level >= 76 && Math.min(blackmana, whitemana) >= repriseFloor + 5
  && repriseTime > manaficationRecast) {
    return 'Enchanted Reprise';
  } else if (level >= 52 && Math.min(blackmana, whitemana) >= moulinetFloor + 20
  && moulinetTime > manaficationRecast) {
    return 'Enchanted Moulinet';
  } return rdmNextDualcast({
    blackmana,
    whitemana,
    verfirereadyStatus,
    verstonereadyStatus,
    swiftcastStatus,
  });
};

const rdmNextOGCD = ({
  gcdTime,
  mp,
  comboStep,
  blackmana,
  whitemana,
  accelerationRecast,
  contresixteRecast,
  corpsacorpsRecast,
  displacementRecast,
  emboldenRecast,
  flecheRecast,
  luciddreamingRecast,
  manaficationRecast,
  swiftcastRecast,
  verfirereadyStatus,
  verstonereadyStatus,
} = {}) => {
  const playerData = nextActionOverlay.playerData;
  const level = playerData.level;

  if (level >= 60 && player.targetCount >= 2 && comboStep === ''
  && Math.min(blackmana, whitemana) >= 50 && gcdTime <= 2200 && manaficationRecast < 0) {
    return 'Manafication'; /* gcdTime <= 1500 places at end of double weave */
  } else if (level >= 60 && player.targetCount === 1 && comboStep === ''
  && Math.min(blackmana, whitemana) >= 40 && gcdTime <= 2200
  && manaficationRecast < 0) {
    return 'Manafication';
  } else if (level >= 56 && contresixteRecast < 0 && player.countTargets > 1) {
    return 'Contre Sixte';
  } else if (level >= 45 && flecheRecast < 0) {
    return 'Fleche';
  } else if (level >= 56 && contresixteRecast < 0) {
    return 'Contre Sixte';
  } else if (level >= 58 && gcdTime <= 2200 && emboldenRecast < 0) {
    return 'Embolden';
  } else if (level >= 6 && gcdTime <= 2200 && corpsacorpsRecast < 0) {
    return 'Corps-A-Corps';
  } else if (level >= 72 && displacementRecast < 0) {
    return 'Engagement';
  } else if (level >= 40
  && comboStep !== 'Enchanted Riposte' && comboStep !== 'Enchanted Zwerchhau'
  && (player.targetCount === 1 || Math.min(blackmana, whitemana) < 20) && gcdTime >= 2200
  && displacementRecast < 0) {
    return 'Displacement';
  } else if (level >= 18 && Math.max(blackmana, whitemana) < 80
  && Math.max(verfirereadyStatus, verstonereadyStatus) < 0 && comboStep === '' && gcdTime <= 2200
  && swiftcastRecast < 0) {
    /* "If you are below 80|80 Mana & ran out of both Verstone and Verfire procs,
      fish for a proc." - from guide */
    return 'Swiftcast';
  } else if (level >= 18 && Math.max(blackmana, whitemana) < 60
  && Math.min(verfirereadyStatus, verstonereadyStatus) < 0 && comboStep === '' && gcdTime <= 2200
  && swiftcastRecast < 0) {
    /* "If you are below 60|60 Mana & only have a single Verstone proc OR a Verfire proc,
      fish for the other proc." - from guide */
    return 'Swiftcast';
  } else if (accelerationRecast < 0 && Math.max(blackmana, whitemana) < 80 && comboStep === ''
  && Math.min(verfirereadyStatus, verstonereadyStatus) < 0) {
    /* "If you are between 60|60 and 80|80 Mana and have both a Verstone proc AND a Verfire proc
      do NOT use Acceleration." - from guide */
    return 'Acceleration';
  } else if (accelerationRecast < 0 && Math.max(blackmana, whitemana) < 60 && comboStep === '') {
    return 'Acceleration';
  } else if (level >= 24 && mp < 8000 && luciddreamingRecast < 0) {
    return 'Lucid Dreaming';
  } return '';
};

const rdmNext = ({
  gcd = 0,
} = {}) => {
  const playerData = nextActionOverlay.playerData;
  const level = playerData.level;
  const weaponskills = nextActionOverlay.actionList.RDM.weaponskills;

  let gcdTime = gcd;
  let nextTime = 0; /* Tracks how far next loop has "looked ahead" */
  let mpTick = 0;
  let hardcasting = player.hardcasting; /* Allows loop to see if it was called from onCasting */

  let comboStep = player.comboStep;
  let mp = player.mp;
  let blackmana = player.blackmana;
  let whitemana = player.whitemana;
  let accelerationCount = player.accelerationCount;
  let accelerationRecast = checkRecast({ name: 'Acceleration' }) - 1000;
  let corpsacorpsRecast = checkRecast({ name: 'Corps-A-Corps' }) - 1000;
  let contresixteRecast = checkRecast({ name: 'Contre Sixte' }) - 1000;
  let emboldenRecast = checkRecast({ name: 'Embolden' }) - 1000;
  let displacementRecast = checkRecast({ name: 'Displacement' }) - 1000;
  let flecheRecast = checkRecast({ name: 'Fleche' }) - 1000;
  let manaficationRecast = checkRecast({ name: 'Manafication' }) - 1000;
  let swiftcastRecast = checkRecast({ name: 'Swiftcast' }) - 1000;
  let luciddreamingRecast = checkRecast({ name: 'Lucid Dreaming' }) - 1000;

  let dualcastStatus = checkStatus({ name: 'Dualcast' });
  let comboStatus = checkStatus({ name: 'Combo' });
  let accelerationStatus = checkStatus({ name: 'Acceleration' });
  let luciddreamingStatus = checkStatus({ name: 'Lucid Dreaming' });
  let verfirereadyStatus = checkStatus({ name: 'Verfire Ready' });
  let verstonereadyStatus = checkStatus({ name: 'Verstone Ready' });
  let swiftcastStatus = checkStatus({ name: 'Swiftcast' });
  // let manaficationStatus = checkStatus({ name: 'Manafication' });

  const rdmArray = [];

  while (nextTime < 15000) { /* Outside loop for GCDs, stops looking ahead at this number ms */
    let loopTime = 0;

    /* If no time for OGCD, use GCD */
    if (gcdTime <= 1000) {
      const nextGCD = rdmNextGCD({
        comboStep,
        hardcasting,
        blackmana,
        whitemana,
        manaficationRecast,
        swiftcastStatus,
        verfirereadyStatus,
        verstonereadyStatus,
      });

      hardcasting = ''; /* Toggles off for rest of loops */

      /* Dualcast returns an array of two items, so some shenanigans to get things to work */
      if (Array.isArray(nextGCD)) {
        const hardcastImg = nextGCD[0].replace(/[\s':-]/g, '').toLowerCase();
        const dualcastImg = nextGCD[1].replace(/[\s':-]/g, '').toLowerCase();
        if (nextGCD[0] !== '(Swiftcasted)') {
          rdmArray.push({ name: `Hardcast ${nextGCD[0]}`, img: hardcastImg });
        }
        rdmArray.push({ name: `Dualcast ${nextGCD[1]}`, img: dualcastImg });
      } else {
        rdmArray.push({ name: nextGCD });
      }

      /* Sets comboStatus and Step */
      if (weaponskills.includes(nextGCD)) {
        if (level < 35
        || (level < 50 && nextGCD === 'Enchanted Zwerchhau')
        || (level < 68 && nextGCD === 'Enchanted Redoublement')
        || (level < 80 && ['Verflare', 'Verholy'].includes(nextGCD))
        || nextGCD === 'Scorch') {
          comboStatus = -1;
          comboStep = '';
        } else if (['Moulinet', 'Enchanted Moulinet', 'Reprise', 'Enchanted Reprise'].includes(nextGCD)) {
          /* These two will also match the combo string */
          comboStatus = -1;
          comboStep = '';
        } else {
          comboStatus = duration.combo;
          comboStep = nextGCD;
        }
      } else {
        comboStatus = -1;
        comboStep = '';
      }

      /* Sets Verfire/Verstone ready from Acceleration */
      if (Array.isArray(nextGCD)) {
        if (nextGCD[0] === 'Verfire') {
          verfirereadyStatus = -1;
        } else if (nextGCD[0] === 'Verstone') {
          verstonereadyStatus = -1;
        } else if (nextGCD[1] === 'Verthunder' && accelerationCount > 0) {
          verfirereadyStatus = duration.verfireready;
          accelerationCount -= 1;
        } else if (nextGCD[1] === 'Veraero' && accelerationCount > 0) {
          verstonereadyStatus = duration.verstoneready;
          accelerationCount -= 1;
        }
      }

      /* Sets Verfire/Verstone ready from Verflare/Verholy */
      if (nextGCD === 'Verflare' && whitemana > blackmana) {
        verfirereadyStatus = duration.verfireready;
      } else if (nextGCD === 'Verholy' && whitemana > blackmana) {
        verstonereadyStatus = duration.verstoneready;
      } if (nextGCD === 'Verflare' && accelerationCount > 0) {
        verfirereadyStatus = duration.verfireready;
        accelerationCount -= 1;
        /* Acceleration apparently only used if Verflare/Verholy doesn't already have 100% proc */
      } else if (nextGCD === 'Verholy' && accelerationCount > 0) {
        verstonereadyStatus = duration.verstoneready;
        accelerationCount -= 1;
      }

      /* Remove Swiftcast status if spell was used */
      if (Array.isArray(nextGCD)) {
        swiftcastStatus = -1;
      }

      /* Adjust mana from actions */
      if (nextGCD === 'Enchanted Riposte') {
        blackmana -= 30;
        whitemana -= 30;
      } else if (nextGCD === 'Enchanted Zwerchhau') {
        blackmana -= 25;
        whitemana -= 25;
      } else if (nextGCD === 'Enchanted Redoublement') {
        blackmana -= 25;
        whitemana -= 25;
      } else if (nextGCD === 'Enchanted Moulinet') {
        blackmana -= 20;
        whitemana -= 20;
      } else if (nextGCD === 'Verflare') {
        blackmana += 21;
      } else if (nextGCD === 'Verholy') {
        whitemana += 21;
      } else if (nextGCD === 'Scorch') {
        blackmana += 7;
        whitemana += 7;
      } else if (nextGCD === 'Enchanted Reprise') {
        blackmana -= 5;
        whitemana -= 5;
      }

      /* Adjust mana from Dualcast */
      if (Array.isArray(nextGCD)) {
        if (nextGCD.includes('Jolt')) {
          blackmana += 3;
          whitemana += 3;
        }
        if (nextGCD.includes('Verthunder')) {
          blackmana += 11;
        }
        if (nextGCD.includes('Veraero')) {
          whitemana += 11;
        }
        if (nextGCD.includes('Scatter')) {
          blackmana += 3;
          whitemana += 3;
        }
        if (nextGCD.includes('Verthunder II')) {
          blackmana += 7;
        }
        if (nextGCD.includes('Veraero II')) {
          whitemana += 7;
        }
        if (nextGCD.includes('Verfire')) {
          blackmana += 9;
        }
        if (nextGCD.includes('Verstone')) {
          whitemana += 9;
        }
        if (nextGCD.includes('Jolt II')) {
          blackmana += 3;
          whitemana += 3;
        }
        if (nextGCD.includes('Impact')) {
          blackmana += 3;
          whitemana += 3;
        }
      }

      /* Just in case, I guess? */
      if (blackmana > 100) {
        blackmana = 100;
      } else if (blackmana < 0) {
        blackmana = 0;
      }

      if (whitemana > 100) {
        whitemana = 100;
      } else if (whitemana < 0) {
        whitemana = 0;
      }

      gcdTime = player.gcd;
      loopTime = gcdTime;

      /* Sets timing for OGCD and loop */
      if (['Enchanted Riposte', 'Enchanted Zwerchhau', 'Enchanted Moulinet'].includes(nextGCD)) {
        gcdTime = 1500;
        loopTime = gcdTime;
      } else if (['Enchanted Redoublement', 'Enchanted Reprise'].includes(nextGCD)) {
        gcdTime = 2200;
        loopTime = gcdTime;
      }

      if (Array.isArray(nextGCD)) {
        nextTime += player.gcd;
        /* Since one "extra" GCD passes before OGCDs are calculated */
        accelerationRecast -= player.gcd;
        accelerationStatus -= player.gcd;
        contresixteRecast -= player.gcd;
        corpsacorpsRecast -= player.gcd;
        dualcastStatus -= player.gcd;
        emboldenRecast -= player.gcd;
        displacementRecast -= player.gcd;
        flecheRecast -= player.gcd;
        luciddreamingRecast -= player.gcd;
        luciddreamingStatus -= player.gcd;
        manaficationRecast -= player.gcd;
        // manaficationStatus -= loopTime;
        swiftcastRecast -= player.gcd;
        swiftcastStatus -= player.gcd;
        verfirereadyStatus -= player.gcd;
        verstonereadyStatus -= player.gcd;
      }

      nextTime += loopTime; /* Increments for outside loop */
    }

    while (gcdTime > 1000) { /* Inside loop for OGCDs */
      const nextOGCD = rdmNextOGCD({
        gcdTime,
        mp,
        comboStep,
        blackmana,
        whitemana,
        accelerationRecast,
        contresixteRecast,
        corpsacorpsRecast,
        displacementRecast,
        emboldenRecast,
        flecheRecast,
        luciddreamingRecast,
        manaficationRecast,
        swiftcastRecast,
        verfirereadyStatus,
        verstonereadyStatus,
      });

      if (nextOGCD) {
        rdmArray.push({ name: nextOGCD, size: 'small' });

        if (nextOGCD === 'Swiftcast') {
          swiftcastRecast = recast.swiftcast;
          swiftcastStatus = duration.swiftcast;
        } else if (nextOGCD === 'Lucid Dreaming') {
          luciddreamingRecast = recast.luciddreaming;
          luciddreamingStatus = duration.luciddreaming;
        } else if (nextOGCD === 'Corps-A-Corps') {
          corpsacorpsRecast = recast.corpsacorps;
        } else if (nextOGCD === 'Displacement') {
          displacementRecast = recast.displacement;
          gcdTime = 0;
        } else if (nextOGCD === 'Fleche') {
          flecheRecast = recast.fleche;
        } else if (nextOGCD === 'Acceleration') {
          accelerationRecast = recast.acceleration;
          accelerationStatus = duration.acceleration;
          accelerationCount = 3;
        } else if (nextOGCD === 'Contre Sixte') {
          contresixteRecast = recast.contresixte;
          if (level >= 78) {
            contresixteRecast = 35000; /* Set trait manually */
          }
        } else if (nextOGCD === 'Embolden') {
          emboldenRecast = recast.embolden;
        } else if (nextOGCD === 'Manafication') {
          manaficationRecast = recast.manafication;
          if (level >= 76) {
            manaficationRecast = 110000; /* Set trait manually */
          }
          blackmana = Math.min(blackmana * 2, 100);
          whitemana = Math.min(whitemana * 2, 100);
          corpsacorpsRecast = -1;
          displacementRecast = -1;
        } else if (nextOGCD === 'Engagement') {
          displacementRecast = recast.displacement;
        }
      }
      gcdTime -= 1250;
    }

    if (accelerationCount <= 0) {
      accelerationStatus = -1;
    }

    accelerationRecast -= loopTime;
    accelerationStatus -= loopTime;
    contresixteRecast -= loopTime;
    corpsacorpsRecast -= loopTime;
    dualcastStatus -= loopTime;
    emboldenRecast -= loopTime;
    displacementRecast -= loopTime;
    flecheRecast -= loopTime;
    luciddreamingRecast -= loopTime;
    luciddreamingStatus -= loopTime;
    manaficationRecast -= loopTime;
    // manaficationStatus -= loopTime;
    swiftcastRecast -= loopTime;
    swiftcastStatus -= loopTime;
    verfirereadyStatus -= loopTime;
    verstonereadyStatus -= loopTime;

    /* MP tick */
    if (Math.floor(loopTime / 3000) > mpTick) {
      mp = Math.min(mp + 200, 10000);
      if (luciddreamingStatus > 0) {
        mp = Math.min(mp + 500, 10000);
      }
      mpTick += 1;
    }
  }

  iconArrayB = rdmArray;
  syncIcons();
};

onAction.RDM = (actionMatch) => {
  const playerData = nextActionOverlay.playerData;
  const level = playerData.level;

  const addRecast = nextActionOverlay.addRecast;
  const checkRecast = nextActionOverlay.checkRecast;
  const checkStatus = nextActionOverlay.checkStatus;


  const multiTargetActions = [
    'Verthunder II', 'Veraero II', 'Scatter', 'Impact',
    'Moulinet', 'Enchanted Moulinet',
    'Contre Sixte',
  ];
  /* Untoggle casting */
  player.hardcasting = '';
  const actionName = actionMatch.groups.actionName;

  if (multiTargetActions.includes(actionName) && actionMatch.groups.logType === '15') {
    /* Multi target only hits single target */
    player.targetCount = 1;
  } else if (
    (level < 62 && actionName === 'Jolt')
    || (level >= 52 && ['Enchanted Riposte'].includes(actionName))
    || (level >= 66 && ['Verthunder', 'Veraero'].includes(actionName))
  ) {
    /* Unambiguous single target actions */
    player.targetCount = 1;
  }

  /* Remove matched icon */
  removeIcon({ name: actionName });
  if (weaponskills.includes(actionName)) {
    /* Set combo status/step */
    if (level < 35
    || (level < 50 && actionName === 'Enchanted Zwerchhau')
    || (level < 68 && actionName === 'Enchanted Redoublement')
    || (level < 80 && ['Verflare', 'Verholy'].includes(actionName))
    || (actionName === 'Scorch')) {
      removeStatus({ name: 'Combo' });
      player.comboStep = '';
    } else if (['Moulinet', 'Enchanted Moulinet', 'Reprise', 'Enchanted Reprise'].includes(actionName)) {
      removeStatus({ name: 'Combo' });
      player.comboStep = '';
    } else {
      addStatus({ name: 'Combo' });
      player.comboStep = actionName;
    }

    /* Call next function with appropriate GCD time */
    if (['Enchanted Riposte', 'Enchanted Zwerchhau', 'Enchanted Moulinet'].includes(actionName)) {
      rdmNext({ gcd: 1500 });
    } else if (['Enchanted Redoublement', 'Enchanted Reprise'].includes(actionName)) {
      rdmNext({ gcd: 2200 });
    } else {
      rdmNext({ gcd: player.gcd });
    }
  } else if (rdmCooldowns.includes(actionName)) {
    addRecast({ name: actionName });
    if (actionName === 'Acceleration') {
      addStatus({ name: 'Acceleration' });
      player.accelerationCount = 3;
    } else if (actionName === 'Contre Sixte') {
      if (level >= 78) {
        addRecast({ name: actionName, time: 35000 }); /* Level 78 trait */
      }
    } else if (actionName === 'Manafication') {
      if (level >= 74) {
        addRecast({ name: actionName, time: 110000 }); /* Level 74 trait */
      }
      addRecast({ name: 'Corps-A-Corps', time: -1 });
      addRecast({ name: 'Displacement', time: -1 });
      nextActionOverlay.next.RDM();
    } else if (actionName === 'Engagement') {
      addRecast({ name: 'Displacement' }); /* Set Displacement cooldown with Engagement */
    } else if (actionName === 'Swiftcast') {
      addStatus({ name: 'Swiftcast' });
    } else if (actionName === 'Lucid Dreaming') {
      addStatus({ name: 'Lucid Dreaming' });
    }
    // console.log(actionName + ' ' + checkRecast({ name: actionName }));
  }
};

onStatus.RDM = (statusMatch) => {
  /* Control Dualcast/Swiftcast flow from here because it's a lot easier */
  if (statusMatch.groups.gainsLoses === 'gains') {
    addStatus({
      name: statusMatch.groups.statusName,
      time: parseFloat(statusMatch.groups.statusDuration) * 1000,
    });

    if (statusMatch.groups.statusName === 'Dualcast') {
      player.hardcasting = '';
      removeIcon({ name: 'Hardcast', match: 'contains' });
      /* Possibly look into making this the same as the Dualcast version */
    } else if (statusMatch.groups.statusName === 'Verfire Ready') {
      rdmNext({ gcd: player.gcd }); /* Call function if Ready status changes */
    } else if (statusMatch.groups.statusName === 'Verstone Ready') {
      rdmNext({ gcd: player.gcd });
    } else if (statusMatch.groups.statusName === 'Swiftcast') {
      nextActionOverlay.next.RDM(); /* Call function if Swiftcasting */
    }
  } else {
    removeStatus({ name: statusMatch.groups.statusName });

    if (['Dualcast', 'Swiftcast'].includes(statusMatch.groups.statusName)) {
      /* Removes second spell after Dualcast/Swiftcast is used, probably */
      player.hardcasting = '';
      removeIcon({ name: 'Dualcast', match: 'contains' });
      rdmNext({ gcd: player.gcd });
    } else if (statusMatch.groups.statusName === 'Acceleration') {
      player.accelerationCount = 3;
    }
  }
};

nextActionOverlay.onCasting.RDM = (castingMatch) => {
  const playerData = nextActionOverlay.playerData;
  const fadeIcon = nextActionOverlay.fadeIcon;
  // if (rdmMultiTarget.includes(castingMatch.groups.actionName)) {
  //   player.targetCount = 3;
  // } else {
  //   player.targetCount = 1;
  // }
  playerData.hardcasting = castingMatch.groups.actionName;
  playerData.comboStep = '';
  nextActionOverlay.next.RDM();
  fadeIcon({ name: 'Hardcast', match: 'contains' });
};

nextActionOverlay.onCancel.RDM = (cancelledMatch) => {
  const playerData = nextActionOverlay.playerData;
  const unfadeIcon = nextActionOverlay.unfadeIcon;

  playerData.hardcasting = '';
  unfadeIcon({ name: 'Hardcast', match: 'contains' });
  nextActionOverlay.next.RDM();
};

nextActionOverlay.onTargetChanged.RDM = () => {
  nextActionOverlay.next.RDM(); // ?
};

nextActionOverlay.onJobChange.RDM = () => {
  nextActionOverlay.next.RDM();
};
