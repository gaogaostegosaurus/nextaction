'use strict';

const rdmProcBufferTime = 7500;

const rdmVerflareCombo = () => {
  addIcon({ name: 'verflare' });
  if (player.level >= 80) {
    addIcon({ name: 'scorch' });
  }
};

const rdmVerholyCombo = () => {
  addIcon({ name: 'verholy' });
  if (player.level >= 80) {
    addIcon({ name: 'scorch' });
  }
};

const rdmMeleeCombo = () => {
  toggle.combo = Date.now();
  addIcon({ name: 'riposte' });
  if (player.level >= 35) {
    addIcon({ name: 'zwerchhau' });
  }
  if (player.level >= 50) {
    addIcon({ name: 'redoublement' });
  }
  // Verflare or Verholy?
  if (player.level >= 68
  && Math.min(player.jobDetail.blackMana, player.jobDetail.whiteMana) >= 80) {
    // In relative order of desirability
    if (player.level >= 70
    && player.jobDetail.blackMana > player.jobDetail.whiteMana
    && checkStatus('verstoneready') < rdmProcBufferTime) {
      rdmVerholyCombo();
    } else if (player.jobDetail.whiteMana > player.jobDetail.blackMana
    && checkStatus('verfireready') < rdmProcBufferTime) {
      rdmVerflareCombo();
    } else if (player.level >= 70
    && player.jobDetail.whiteMana + 20 - player.jobDetail.blackMana <= 30
    && checkStatus('verstoneready') < rdmProcBufferTime) {
      rdmVerholyCombo();
    } else if (player.jobDetail.blackMana + 20 - player.jobDetail.whiteMana <= 30
    && checkStatus('verfireready') < rdmProcBufferTime) {
      rdmVerflareCombo();
    } else if (player.level >= 70
    && player.jobDetail.blackMana > player.jobDetail.whiteMana) {
      rdmVerholyCombo();
    } else {
      rdmVerflareCombo();
    }
  }
};

const rdmDualcastPotency = ({
  manaTarget,
  blackMana = 0,
  whiteMana = 0,
  hardcastAction = 'hardcast',
  hardcastBlackMana = 0,
  hardcastWhiteMana = 0,
  dualcastAction = 'dualcast',
  dualcastBlackMana = 0,
  dualcastWhiteMana = 0,
  verstoneReady = 0,
  verfireReady = 0,
  // acceleration = 0,
  swiftcast = 0,
} = {}) => {
  // Static variables
  const singleTargetManaPotency = 8.07;
  const multiTargetManaPotency = 2.43; // Per target

  // Set proc potency
  let procPotency = 0;
  if (player.level >= 62) {
    procPotency = 20;
  } else {
    procPotency = 90;
  }

  // Calculate mana manaBreakpoint for Verflare/Verholy fixing
  const manaBreakpoint = (20 * 0.8) / singleTargetManaPotency + 3;

  // Find Hardcasted action potency
  let hardcastPotency = 0;
  if (Math.abs(Math.min(blackMana + hardcastBlackMana, 100)
  - Math.min(whiteMana + hardcastWhiteMana, 100)) > 30) {
    return 0;
  } else if (hardcastAction === 'jolt') {
    if (player.level >= 62) {
      // Level 62 trait
      hardcastPotency = 280;
    } else {
      hardcastPotency = 180;
    }
  } else if (verfireReady > 5000 && hardcastAction === 'verfire') {
    if (player.level >= 62) {
      // Level 62 trait
      hardcastPotency = 300;
    } else {
      hardcastPotency = 270;
    }
  } else if (verstoneReady > 5000 && hardcastAction === 'verstone') {
    if (player.level >= 62) {
      // Level 62 trait
      hardcastPotency = 300;
    } else {
      hardcastPotency = 270;
    }
  } else if (player.level >= 18 && hardcastAction === 'verthunder2') {
    if (player.level >= 78) {
      // Level 78 trait
      hardcastPotency = 120 * count.targets;
    } else {
      hardcastPotency = 100 * count.targets;
    }
  } else if (player.level >= 22 && hardcastAction === 'veraero2') {
    if (player.level >= 78) {
      // Level 78 trait
      hardcastPotency = 120 * count.targets;
    } else {
      hardcastPotency = 100 * count.targets;
    }
  } else if (player.level >= 18 && swiftcast < 0 && hardcastAction === 'swiftcast') {
    if (player.level >= 62) {
      hardcastPotency = (280 + 300 + 350 * 2) * 0.25;
    } else {
      hardcastPotency = (180 + 270 + 310 * 2) * 0.25;
    }
  } else {
    return 0;
  }

  // Find Dualcasted action potency
  let dualcastPotency = 0;
  if (Math.abs(Math.min(blackMana + hardcastBlackMana + dualcastBlackMana, 100)
  - Math.min(whiteMana + hardcastWhiteMana + dualcastWhiteMana, 100)) > 30) {
    return 0;
  } else if (dualcastAction === 'verthunder') {
    if (player.level >= 62) {
      // Level 62 trait
      dualcastPotency = 350;
    } else {
      dualcastPotency = 310;
    }
    if (hardcastAction === 'verfire' || verfireReady <= 0) {
      // Add proc potency if applicable
      dualcastPotency += procPotency * 0.5;
    }
  } else if (dualcastAction === 'veraero') {
    if (player.level >= 62) {
      // Level 62 trait
      dualcastPotency = 350;
    } else {
      dualcastPotency = 310;
    }
    if (hardcastAction === 'verstone' || verstoneReady <= 0) {
      // Add proc potency if applicable
      dualcastPotency += procPotency * 0.5;
    }
  } else if (player.level >= 15 && dualcastAction === 'scatter') {
    if (player.level >= 66) { // Trait
      dualcastPotency = 220 * count.targets;
    } else {
      dualcastPotency = 120 * count.targets;
    }
  } else {
    return 0;
  }

  const newBlackMana = Math.min(blackMana + hardcastBlackMana + dualcastBlackMana, 100);
  const newWhiteMana = Math.min(whiteMana + hardcastWhiteMana + dualcastWhiteMana, 100);
  const manaOverCap = blackMana + hardcastBlackMana + dualcastBlackMana - 100
    + whiteMana + hardcastWhiteMana + dualcastWhiteMana - 100;

  // Prioritize smaller mana differences
  let manaDifferenceModifier = Math.abs(newBlackMana - newWhiteMana);
  if (Math.min(newBlackMana, newWhiteMana) >= manaTarget) {
    manaDifferenceModifier *= -1; // Attempt to value larger spreads when above 80/80
  }

  // Proritize combo that results in Verholy/Verflare procs
  let startMeleeBonus = 0;
  if (Math.min(newBlackMana, newWhiteMana) >= manaTarget && manaOverCap < manaBreakpoint) {
    if (player.level >= 70 && newBlackMana > newWhiteMana && dualcastAction === 'verthunder'
    && verfireReady <= 0 && (hardcastAction === 'verstone' || verstoneReady <= 0)) {
      startMeleeBonus = 1000000; // 100% proc Verholy
    } else if (player.level >= 68 && newWhiteMana > newBlackMana && dualcastAction === 'veraero'
    && verstoneReady <= 0 && (hardcastAction === 'verfire' || verfireReady <= 0)) {
      startMeleeBonus = 1000000; // 100% proc Verflare
    } else if (player.level >= 70 && newBlackMana > newWhiteMana && dualcastAction === 'verthunder'
    && (hardcastAction === 'verstone' || verstoneReady <= 0)) {
      startMeleeBonus = 100000; // 100% proc Verholy, 50% overwrite existing proc
    } else if (player.level >= 68 && newWhiteMana > newBlackMana && dualcastAction === 'veraero'
    && (hardcastAction === 'verfire' || verfireReady <= 0)) {
      startMeleeBonus = 100000; // 100% proc Verflare, 50% overwrite existing proc
    }
  }

  // Calculate final potency
  const potency = hardcastPotency + dualcastPotency
    + (newBlackMana + newWhiteMana - blackMana - whiteMana)
    * Math.max(singleTargetManaPotency, count.targets * multiTargetManaPotency)
    - manaDifferenceModifier + startMeleeBonus;

  return potency;
};

const rdmDualcast = () => {
  const hardcastSpells = [
    ['jolt', 3, 3],
    ['verfire', 9, 0],
    ['verstone', 0, 9],
    ['verthunder2', 7, 0],
    ['veraero2', 0, 7],
    ['swiftcast', 0, 0],
  ];
  const dualcastSpells = [
    ['verthunder', 11, 0],
    ['veraero', 0, 11],
    ['scatter', 3, 3],
  ];
  const dualcastArray = [];
  let verfireReady = checkStatus('verfireready');
  let verstoneReady = checkStatus('verstoneready');
  let swiftcastRecast = checkRecast('swiftcast');
  let manaficationRecast = checkRecast('manafication');
  let { blackMana } = player.jobDetail;
  let { whiteMana } = player.jobDetail;
  let manaCap = 100;
  let manaTarget = 80;
  let bestDualcastCombo = [];
  let bestPotency = 0;
  let potency = 0;
  let elapsedTime = 0;
  // console.log(JSON.stringify(dualcastArray));

  do {
    // This will loop at least once

    // Calculate mana target for when to stop loop
    if (player.level >= 60 && manaficationRecast - elapsedTime <= 0) {
      if (count.targets > 1) {
        manaCap = 50;
        manaTarget = 50;
      } else {
        manaCap = 50;
        manaTarget = 40;
      }
    } else if (player.level >= 52 && count.targets > 1) {
      manaCap = 100;
      manaTarget = 50;
    } else {
      manaCap = 100;
      manaTarget = 80;
    }

    if (manaCap <= 50 && Math.min(blackMana, whiteMana) >= manaCap
    && count.targets === 1) {
      if (blackMana < whiteMana && whiteMana - 5 < manaCap
      && verfireReady <= 0) {
        dualcastArray.push({ name: 'reprise', icon: 'reprise' });
        blackMana -= 5;
        whiteMana -= 5;
        elapsedTime += 2200;
      } else if (whiteMana < blackMana && whiteMana - 5 < manaCap
      && verstoneReady <= 0) {
        dualcastArray.push({ name: 'reprise', icon: 'reprise' });
        blackMana -= 5;
        whiteMana -= 5;
        elapsedTime += 1500;
      } else if (Math.min(blackMana, whiteMana) - 20 > manaTarget
      && Math.min(blackMana, whiteMana) - 20 > manaCap) {
        dualcastArray.push({ name: 'moulinet', icon: 'moulinet' });
        blackMana -= 20;
        whiteMana -= 20;
        elapsedTime += 1500;
      }
    } else if (player.level >= 52 && Math.min(blackMana, whiteMana) - 20 >= manaTarget) {
      dualcastArray.push({ name: 'moulinet', icon: 'moulinet' });
      blackMana -= 20;
      whiteMana -= 20;
      elapsedTime += 1500;
    } else if (player.level >= 52 && Math.min(blackMana, whiteMana) - 20 >= manaTarget) {
      dualcastArray.push({ name: 'moulinet', icon: 'moulinet' });
      blackMana -= 20;
      whiteMana -= 20;
      elapsedTime += 1500;
    } else if (player.level >= 60 && manaficationRecast - elapsedTime < 0
    && Math.min(blackMana, whiteMana) >= manaTarget) {
      dualcastArray.push({ name: 'manafication', icon: 'manafication' });
      blackMana = Math.min(blackMana * 2, 100);
      whiteMana = Math.min(whiteMana * 2, 100);
      manaficationRecast = elapsedTime + 110000;
    } else {
      // Loops through every hardcast/dualcast combination to find most valuable one
      // To do - acceleration counts
      for (let i = 0; i < hardcastSpells.length; i += 1) {
        for (let j = 0; j < dualcastSpells.length; j += 1) {
          potency = rdmDualcastPotency({
            blackMana,
            whiteMana,
            manaTarget,
            hardcastAction: hardcastSpells[i][0],
            hardcastBlackMana: hardcastSpells[i][1],
            hardcastWhiteMana: hardcastSpells[i][2],
            dualcastAction: dualcastSpells[j][0],
            dualcastBlackMana: dualcastSpells[j][1],
            dualcastWhiteMana: dualcastSpells[j][2],
            verfireReady: verfireReady - elapsedTime,
            verstoneReady: verstoneReady - elapsedTime,
            swiftcastRecast: swiftcastRecast - elapsedTime,
          });
          if (potency > bestPotency) {
            bestPotency = potency;
            bestDualcastCombo = [
              hardcastSpells[i][0],
              dualcastSpells[j][0],
              hardcastSpells[i][1] + dualcastSpells[j][1],
              hardcastSpells[i][2] + dualcastSpells[j][2],
              bestPotency,
            ];
          }
        }
      }
      // console.log(JSON.stringify(bestDualcastCombo)); // Uncomment to check array at end
      // Adjust Verfire/Verstone Ready
      if (bestDualcastCombo[0] === 'verfire') {
        verfireReady = 0;
      } else if (bestDualcastCombo[0] === 'verstone') {
        verstoneReady = 0;
      }

      if (bestDualcastCombo[0] === 'swiftcast') {
        swiftcastRecast = recast.swiftcast + elapsedTime;
      }

      // Add to action array
      dualcastArray.push({ name: 'hardcast', icon: bestDualcastCombo[0] });
      dualcastArray.push({ name: 'dualcast', icon: bestDualcastCombo[1] });
      elapsedTime += 5000;
      blackMana = Math.min(blackMana + bestDualcastCombo[2], 100);
      whiteMana = Math.min(whiteMana + bestDualcastCombo[3], 100);
    }
    // Set up for next loop
    bestPotency = 0;
  } while (elapsedTime <= 12500 && Math.min(blackMana, whiteMana) < 80);

  // Uncomment to check array
  // console.log(`Black: ${blackMana}/${manaCap} White:${whiteMana}/${manaCap}`);
  console.log(JSON.stringify(dualcastArray));

  actionArray = dualcastArray;
  syncActions({ array: actionArray });
};

const rdmNext = () => { // Main function
  rdmDualcast();

  if (player.level >= 50
  && Math.min(player.jobDetail.blackMana, player.jobDetail.whiteMana) >= 80
  && count.targets === 1) {
    rdmMeleeCombo();
  }
};

const rdmOnJobChange = () => {
  // nextid.manafication = 0;
  // nextid.moulinet = nextid.manafication;
  // nextid.reprise = nextid.manafication;
  //
  // nextid.combo1 = 1;
  // nextid.combo2 = nextid.combo1 + 1;
  // nextid.combo3 = nextid.combo1 + 2;
  // nextid.combo4 = nextid.combo1 + 3;
  // nextid.combo5 = nextid.combo1 + 4;
  // nextid.riposte = 1;
  // nextid.zwerchhau = nextid.riposte + 1;
  // nextid.redoublement = nextid.riposte + 2;
  // nextid.verflare =  nextid.riposte + 3;
  // nextid.verholy =  nextid.riposte + 3;
  // nextid.scorch =  nextid.riposte + 4;
  // nextid.hardcast = 18;
  // nextid.dualcast = 19;
  // nextid.luciddreaming = 21;
  // nextid.fleche = 22;
  // nextid.contresixte = nextid.fleche + 1;
  // nextid.corpsacorps = nextid.fleche + 2;
  // nextid.displacement = nextid.fleche + 3;
  // nextid.swiftcast = nextid.fleche + 4;
  // nextid.acceleration = nextid.fleche + 5;
  countdownid.manafication = 0;
  countdownid.swiftcast = 1;
  countdownid.fleche = 2;
  countdownid.contresixte = 3;
  countdownid.corpsacorps = 4;
  countdownid.displacement = 5;
  countdownid.acceleration = 6;
  countdownid.embolden = 7;
  countdownid.luciddreaming = 8;
  previous.contresixte = 0;
  previous.verthunder2 = 0;
  previous.veraero2 = 0;
  previous.scatter = 0;
  previous.moulinet = 0;

  // Set up icons

  if (player.level >= 62) {
    icon.jolt = icon.jolt2;
  } else {
    icon.jolt = '003202';
  }

  if (player.level >= 66) {
    icon.scatter = icon.impact;
  } else {
    icon.scatter = '003207';
  }

  // Set up traits
  if (player.level >= 74) {
    recast.manafication = 110000;
  } else {
    recast.manafication = 120000;
  }

  if (player.level >= 78) {
    recast.contresixte = 35000;
  } else {
    recast.contresixte = 45000;
  }


  // Create cooldown notifications
  addCountdownBar({ name: 'corpsacorps', array: cooldownArray, time: checkRecast('corpsacorps'), onComplete: 'addIcon' });
  if (player.level >= 40) {
    addCountdownBar({ name: 'displacement', array: cooldownArray, time: checkRecast('displacement'), onComplete: 'addIcon' });
  }
  if (player.level >= 45) {
    addCountdownBar({ name: 'fleche', array: cooldownArray, time: checkRecast('fleche'), onComplete: 'addIcon' });
  }
  if (player.level >= 56) {
    addCountdownBar({ name: 'contresixte', array: cooldownArray, time: checkRecast('contresixte'), onComplete: 'addIcon' });
  }
  if (player.level >= 60) {
    addCountdownBar({ name: 'manafication', array: cooldownArray, time: checkRecast('manafication') });
  }

  count.targets = 1;
  rdmNext();
};

const rdmOnStartsUsing = () => {
  delete toggle.combo; // Starting cast immediately breaks combo, apparently
  removeIcon('riposte');
  removeIcon('zwerchhau');
  removeIcon('redoublement');
  removeIcon('verflare');
  removeIcon('scorch');
};

const rdmOnAction = (actionMatch) => {
  const rdmActions = [
    // Off-GCD
    'Corps-A-Corps', 'Displacement', 'Fleche', 'Contre Sixte', 'Acceleration', 'Manafication',
    'Engagement',
    // GCD
    'Jolt', 'Verfire', 'Verstone', 'Jolt II', 'Verthunder', 'Veraero',
    'Verthunder II', 'Veraero II', 'Impact', 'Scatter',
    'Riposte', 'Zwerchhau', 'Redoublement', 'Moulinet', 'Reprise',
    'Enchanted Riposte', 'Enchanted Zwerchhau', 'Enchanted Redoublement', 'Enchanted Moulinet',
    'Enchanted Reprise',
    'Verflare', 'Verholy', 'Scorch',
    // Role
    'Swiftcast', 'Lucid Dreaming',
  ];

  if (rdmActions.indexOf(actionMatch.groups.actionName) > -1) {
    // Non-GCD Actions
    if (actionMatch.groups.actionName === 'Corps-A-Corps') {
      removeIcon('corpsacorps');
      addRecast('corpsacorps');
      addCountdownBar({ name: 'corpsacorps', time: recast.corpsacorps, onComplete: 'addIcon' });
    } else if (['Displacement', 'Engagement'].indexOf(actionMatch.groups.actionName) > -1) {
      removeIcon('displacement');
      addRecast('displacement');
      addCountdownBar({ name: 'displacement', time: recast.displacement, onComplete: 'addIcon' });
    } else if (actionMatch.groups.actionName === 'Fleche') {
      removeIcon('fleche');
      addRecast('fleche');
      addCountdownBar({ name: 'fleche', time: recast.fleche, onComplete: 'addIcon' });
    } else if (actionMatch.groups.actionName === 'Acceleration') {
      removeIcon('acceleration');
      addRecast('acceleration');
      addCountdownBar({ name: 'acceleration', time: recast.acceleration, onComplete: 'addIcon' });
    } else if (actionMatch.groups.actionName === 'Contre Sixte') {
      removeIcon('contresixte');
      addRecast('contresixte');
      addCountdownBar({ name: 'contresixte', time: recast.contresixte, onComplete: 'addIcon' });
      countTargets('contresixte');
    } else if (actionMatch.groups.actionName === 'Embolden') {
      addRecast('embolden');
    } else if (actionMatch.groups.actionName === 'Swiftcast') {
      removeIcon('swiftcast');
      addRecast('swiftcast');
      addCountdownBar({ name: 'swiftcast', time: recast.swiftcast, onComplete: 'addIcon' });
    } else if (actionMatch.groups.actionName === 'Lucid Dreaming') {
      addRecast('luciddreaming');
    } else if (['Riposte', 'Enchanted Riposte'].indexOf(actionMatch.groups.actionName) > -1) {
      count.targets = 1;
      rdmMeleeCombo();
      removeIcon('riposte');
      if (player.level < 35
      || Math.max(player.jobDetail.blackMana, player.jobDetail.whiteMana) < 25) {
        delete toggle.combo;
      }
    } else if (['Zwerchhau', 'Enchanted Zwerchhau'].indexOf(actionMatch.groups.actionName) > -1) {
      removeIcon('zwerchhau');
      if (player.level < 50
      || Math.max(player.jobDetail.blackMana, player.jobDetail.whiteMana) < 25) {
        delete toggle.combo;
      }
    } else if (['Redoublement', 'Enchanted Redoublement'].indexOf(actionMatch.groups.actionName) > -1) {
      removeIcon('redoublement');
      if (player.level < 68) {
        delete toggle.combo;
      }
    } else if (actionMatch.groups.actionName === 'Verflare') {
      removeIcon('verflare');
      if (player.level < 80) {
        delete toggle.combo;
      }
    } else if (actionMatch.groups.actionName === 'Verholy') {
      removeIcon('verholy');
      if (player.level < 80) {
        delete toggle.combo;
      }
    } else if (actionMatch.groups.actionName === 'Scorch') {
      removeIcon('scorch');
      delete toggle.combo;
    } else {
      delete toggle.combo; // Everything else here interrupts melee combo

      if (player.level >= 66
      && ['Verthunder', 'Veraero'].indexOf(actionMatch.groups.actionName) > -1) {
        count.targets = 1;
      } else if (actionMatch.groups.actionName === 'Verthunder II') {
        countTargets('verthunder2');
      } else if (actionMatch.groups.actionName === 'Veraero II') {
        countTargets('veraero2');
      } else if (['Scatter', 'Impact'].indexOf(actionMatch.groups.actionName) > -1) {
        countTargets('scatter');
      } else if (['Moulinet', 'Enchanted Moulinet'].indexOf(actionMatch.groups.actionName) > -1) {
        countTargets('moulinet');
        removeAction({ name: 'moulinet' });
      } else if (['Reprise', 'Enchanted Reprise'].indexOf(actionMatch.groups.actionName) > -1) {
        count.targets = 1;
        removeAction({ name: 'reprise' });
      } else if (actionMatch.groups.actionName === 'Manafication') {
        removeAction({ name: 'manafication' });
        removeIcon('manafication');
        addRecast('manafication');
        addRecast('corpsacorps', -1);
        addRecast('displacement', -1);
        addCountdownBar({ name: 'manafication' });
        addCountdownBar({ name: 'displacement', time: -1, onComplete: 'addIcon' });
        addCountdownBar({ name: 'corpsacorps', time: -1, onComplete: 'addIcon' });
      }
    }
  }
};

// 17: NetworkCancelAbility
const rdmOnCancelled = (cancelledMatch) => {
  if (cancelledMatch.groups.actionName === 'Jolt') {
    //
  }
  rdmNext(); // Recheck dualcast if casting canceled
};

// 1A: NetworkBuff
const rdmOnEffect = (effectMatch) => {
  if (effectMatch.groups.targetID === player.ID) {
    if (effectMatch.groups.effectName === 'Dualcast') {
      if (effectMatch.groups.gainsLoses === 'gains') {
        addStatus('dualcast', parseInt(effectMatch.groups.effectDuration, 10) * 1000);
        removeIcon('hardcast');
        removeAction({ name: 'hardcast' });
      } else if (effectMatch.groups.gainsLoses === 'loses') {
        removeStatus('dualcast');
        removeAction({ name: 'dualcast' });
        rdmNext();
      }
    } else if (effectMatch.groups.effectName === 'Verfire Ready') {
      if (effectMatch.groups.gainsLoses === 'gains') {
        addStatus('verfireready', parseInt(effectMatch.groups.effectDuration, 10) * 1000);
        if (!toggle.combo) {
          rdmDualcast(); // Prevents Verflare proc from resetting combo
        }
      } else if (effectMatch.groups.gainsLoses === 'loses') {
        removeStatus('verfireready', player.ID);
      }
    } else if (effectMatch.groups.effectName === 'Verstone Ready') {
      if (effectMatch.groups.gainsLoses === 'gains') {
        addStatus('verstoneready', parseInt(effectMatch.groups.effectDuration, 10) * 1000);
        if (!toggle.combo) {
          rdmDualcast(); // Prevents Verholy proc from resetting combo
        }
      } else if (effectMatch.groups.gainsLoses === 'loses') {
        removeStatus('verstoneready', player.ID);
      }
    } else if (effectMatch.groups.effectName === 'Manafication') {
      if (effectMatch.groups.gainsLoses === 'gains') {
        addStatus('manafication', parseInt(effectMatch.groups.effectDuration, 10) * 1000);
      } else if (effectMatch.groups.gainsLoses === 'loses') {
        removeStatus('manafication', player.ID);
      }
    } else if (effectMatch.groups.effectName === 'Swiftcast') {
      if (effectMatch.groups.gainsLoses === 'gains') {
        addStatus('swiftcast', parseInt(effectMatch.groups.effectDuration, 10) * 1000);
        removeIcon('hardcast');
      } else if (effectMatch.groups.gainsLoses === 'loses') {
        removeStatus('swiftcast');
        rdmNext();
      }
    }
  }
};

//
// const rdmFixProcs = () => { // Fix procs if able
//   // Assume at least level 68 (no point in doing so before that)
//   if (player.level >= 70
//     && Math.min(player.jobDetail.blackMana, player.jobDetail.whiteMana) >= 80
//     && player.jobDetail.whiteMana < player.jobDetail.blackMana
//     && checkStatus('verstoneready') < rdmProcBufferTime) {
//     // Procs already fixed - start combo
//     rdmVerholyCombo(); // Verholy combo
//   } else if (player.jobDetail.blackMana < player.jobDetail.whiteMana
//     && Math.min(player.jobDetail.blackMana, player.jobDetail.whiteMana) >= 80
//     && checkStatus('verfireready') < rdmProcBufferTime) {
//     // Procs already fixed - start combo
//     rdmVerflareCombo(); // Verflare combo
//   } else if (player.level >= 70
//     && Math.min(player.jobDetail.whiteMana + 9, 100)
//     < Math.min(player.jobDetail.blackMana + 11, 100)
//     && Math.max(player.jobDetail.whiteMana + 9 - 100, 0)
//     + Math.max(player.jobDetail.blackMana + 11 - 100, 0) < rdmManaBreakpoint
//     && Math.min(player.jobDetail.whiteMana + 9, player.jobDetail.blackMana + 11) >= 80
//     && checkStatus('verstoneready') >= 5000) {
//     // Verstone + Verthunder => Verholy combo
//     addIcon({ name: 'hardcast', img: 'verstone' });
//     addIcon({ name: 'dualcast', img: 'verthunder' });
//   } else if (Math.min(player.jobDetail.blackMana + 9, 100)
//     < Math.min(player.jobDetail.whiteMana + 11, 100)
//     && Math.max(player.jobDetail.blackMana + 9 - 100, 0)
//     + Math.max(player.jobDetail.whiteMana + 11 - 100, 0) < rdmManaBreakpoint
//     && Math.min(player.jobDetail.blackMana + 9, player.jobDetail.whiteMana + 11) >= 80
//     && checkStatus('verfireready') >= 5000) {
//     // Verfire + Veraero => Verflare combo
//     addIcon({ name: 'hardcast', img: 'verfire' });
//     addIcon({ name: 'dualcast', img: 'veraero' });
//   } else if (player.level >= 70
//   && player.jobDetail.whiteMana < Math.min(player.jobDetail.blackMana + 20, 100)
//   && player.jobDetail.blackMana + 20 - 100 < rdmManaBreakpoint
//   && Math.min(player.jobDetail.whiteMana, player.jobDetail.blackMana + 20) >= 80
//   && checkStatus('verfireready') >= 5000
//   && checkStatus('verstoneready') < rdmProcBufferTime + 5000) {
//     // Verfire > Verthunder > Verholy combo
//     addIcon({ name: 'hardcast', img: 'verfire' });
//     addIcon({ name: 'dualcast', img: 'verthunder' });
//   } else if (player.jobDetail.blackMana < Math.min(player.jobDetail.whiteMana + 20, 100)
//   && player.jobDetail.whiteMana + 20 - 100 < rdmManaBreakpoint
//   && Math.min(player.jobDetail.blackMana, player.jobDetail.whiteMana + 20) >= 80
//   && checkStatus('verstoneready') >= 5000
//   && checkStatus('verfireready') < rdmProcBufferTime + 5000) {
//     // Verstone > Veraero > Verflare combo
//     addIcon({ name: 'hardcast', img: 'verstone' });
//     addIcon({ name: 'dualcast', img: 'veraero' });
//   } else if (player.level >= 70
//   && Math.min(player.jobDetail.whiteMana + 3, 100)
// < Math.min(player.jobDetail.blackMana + 14, 100)
//   && Math.max(player.jobDetail.whiteMana + 3 - 100, 0)
// + Math.max(player.jobDetail.blackMana + 14 - 100, 0) < rdmManaBreakpoint
//   && Math.min(player.jobDetail.whiteMana + 3, player.jobDetail.blackMana + 14) >= 80
//   && checkStatus('verstoneready') < rdmProcBufferTime + 5000) {
//     // Jolt > Verthunder > Verholy combo
//     addIcon({ name: 'hardcast', img: 'jolt' });
//     addIcon({ name: 'dualcast', img: 'verthunder' });
//   } else if (Math.min(player.jobDetail.blackMana + 3, 100)
//   < Math.min(player.jobDetail.whiteMana + 14, 100)
//   && Math.max(player.jobDetail.blackMana + 3 - 100, 0)
//   + Math.max(player.jobDetail.whiteMana + 14 - 100, 0) < rdmManaBreakpoint
//   && Math.min(player.jobDetail.blackMana + 3, player.jobDetail.whiteMana + 14)
//   >= 80
//   && checkStatus('verfireready') < rdmProcBufferTime + 5000) {
//     // Jolt > Veraero > Verflare combo
//     addIcon({ name: 'hardcast', img: 'jolt' });
//     addIcon({ name: 'dualcast', img: 'veraero' });
//   }
//
//   else if (player.level >= 70
//   && player.jobDetail.whiteMana < Math.min(player.jobDetail.blackMana + 11, 100)
//   && Math.max(player.jobDetail.blackMana + 11 - 100, 0) < rdmManaBreakpoint
//   && Math.min(player.jobDetail.whiteMana, player.jobDetail.blackMana + 11) >= 80
//   && checkStatus('verstoneready') < rdmProcBufferTime + 5000) {
//     // Swiftcast > Verthunder > Verholy combo
//     addIcon({ name: 'hardcast', img: 'swiftcast' });
//     addIcon({ name: 'dualcast', img: 'verthunder' });
//   }
//
//   else if (player.jobDetail.blackMana < Math.min(player.jobDetail.whiteMana + 11, 100)
//   && Math.max(player.jobDetail.whiteMana + 11 - 100, 0) < rdmManaBreakpoint
//   && Math.min(player.jobDetail.blackMana, player.jobDetail.whiteMana + 11) >= 80
//   && checkStatus('verfireready') < rdmProcBufferTime + 5000) {
//     // Swiftcast > Veraero > Verflare combo
//     addIcon({ name: 'hardcast', img: 'swiftcast' });
//     addIcon({ name: 'dualcast', img: 'veraero' });
//   } else if (Math.min(player.jobDetail.blackMana, player.jobDetail.whiteMana) >= 80) {
//     // Try for 20% proc
//     if (player.level >= 70
//     && player.jobDetail.whiteMana + 20 - player.jobDetail.blackMana <= 30
//     && checkStatus('verstoneready') < rdmProcBufferTime) {
//       rdmVerholyCombo(); // Verholy combo
//     } else if (player.jobDetail.blackMana + 20 - player.jobDetail.whiteMana <= 30
//     && checkStatus('verfireready') < rdmProcBufferTime) {
//       rdmVerflareCombo(); // Verflare combo
//     } else if (player.level >= 70
//     && player.jobDetail.blackMana >= player.jobDetail.whiteMana) {
//       rdmVerholyCombo(); // Verholy combo
//     } else {
//       rdmVerflareCombo(); // Verflare combo
//     }
//   } else {
//     rdmDualcast();
//   }
// };


function rdmComboTimeout() {
  clearTimeout(timeout.combo);
  timeout.combo = setTimeout(rdmNext, 12500);
}

// function rdmManafication() {
//
//   if (player.level >= 60
//   && checkRecast('manafication') < 0
//   && !toggle.combo) {
//
//    // Don't use Manafication if more than 28 away from 50/50
//     if (Math.abs(player.jobDetail.blackMana - 50) + Math.abs(player.jobDetail.whiteMana - 50)
// > 28) {
//       removeIcon('manafication');
//       delete toggle.manafication;
//     }
//
//     else if (count.targets >= 4
//     && Math.min(player.jobDetail.blackMana, player.jobDetail.whiteMana) >= 50) {
//       addIcon({ name: 'manafication' });
//       toggle.manafication = Date.now();
//     }
//
//     else if (count.targets >= 2
//     && Math.min(player.jobDetail.blackMana, player.jobDetail.whiteMana) >= 50) {
//       addIcon({ name: 'manafication' });
//       toggle.manafication = Date.now();
//     }
//
//    // Early Manafication if able to proc from Verholy
//     else if (player.level >= 70
//     && Math.min(player.jobDetail.blackMana, player.jobDetail.whiteMana) >= 40
//     && player.jobDetail.whiteMana < 50
//     && player.jobDetail.blackMana > player.jobDetail.whiteMana
//     && checkStatus('verstoneready') < 2500) {
//       addIcon({ name: 'manafication' });
//       toggle.manafication = Date.now();
//     }
//
//    // Early Manafication if able to proc from Verflare
//     else if (player.level >= 68
//     && Math.min(player.jobDetail.blackMana, player.jobDetail.whiteMana) >= 40
//     && player.jobDetail.blackMana < 50
//     && player.jobDetail.whiteMana > player.jobDetail.blackMana
//     && checkStatus('verfireready') < 2500) {
//       addIcon({ name: 'manafication' });
//       toggle.manafication = Date.now();
//     }
//
//    // Use if otherwise over 40/40
//     else if (player.level >= 60
//     && Math.min(player.jobDetail.blackMana, player.jobDetail.whiteMana) >= 40) {
//       addIcon({ name: 'manafication' });
//       toggle.manafication = Date.now();
//     }
//
//     else {
//      // Hide otherwise?
//       removeIcon('manafication');
//       delete toggle.manafication;
//     }
//   }
//   else {
//     removeIcon('manafication');
//     delete toggle.manafication;
//   }
// }
