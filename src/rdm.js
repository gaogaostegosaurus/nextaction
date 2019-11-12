'use strict';

/* If the proc's remaining time lower than this, it is not considered active for dualcast
calculations */

const rdmActionList = [
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

const rdmCastingList = [
  'Jolt', 'Verfire', 'Verstone', 'Jolt II', 'Verthunder', 'Veraero',
  'Verthunder II', 'Veraero II', 'Impact', 'Scatter',
];

const rdmStatusList = [
  'Dualcast', 'Verfire Ready', 'Verstone Ready', 'Manafication',
  'Swiftcast',
];

const rdmMeleeCombo = () => {
  addAction({ name: 'riposte', array: priorityArray });
  if (player.level >= 35
  && Math.min(player.jobDetail.blackMana, player.jobDetail.whiteMana) >= 55) {
    addAction({ name: 'zwerchhau', array: priorityArray });
  }
  if (player.level >= 50
  && Math.min(player.jobDetail.blackMana, player.jobDetail.whiteMana) >= 80) {
    addAction({ name: 'redoublement', array: priorityArray });
  }
};

// Verflare (called after melee combo function)
const rdmVerflareCombo = () => {
  rdmMeleeCombo();
  addAction({ name: 'verflare', array: priorityArray });
  if (player.level >= 80) {
    addAction({ name: 'scorch', array: priorityArray });
  }
};

// Verholy (called after melee combo function)
const rdmVerholyCombo = () => {
  rdmMeleeCombo();
  addAction({ name: 'verholy', array: priorityArray });
  if (player.level >= 80) {
    addAction({ name: 'scorch', array: priorityArray });
  }
};


const rdmFindNextDualcast = ({
  startBlackMana,
  startWhiteMana,
  manaTarget,
  manaCap,
  hardcastAction,
  hardcastBlackMana,
  hardcastWhiteMana,
  dualcastAction,
  dualcastBlackMana,
  dualcastWhiteMana,
  verfireStatus,
  verstoneStatus,
  // acceleration = 0,
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

  if (Math.abs(Math.min(startBlackMana + hardcastBlackMana, 100)
  - Math.min(startWhiteMana + hardcastWhiteMana, 100)) > 30) {
    hardcastPotency = -1000000;
  } else if (hardcastAction === 'jolt') {
    if (player.level >= 62) {
      // Level 62 trait
      hardcastPotency = 280;
    } else {
      hardcastPotency = 180;
    }
  } else if (verfireStatus > 0 && hardcastAction === 'verfire') {
    if (player.level >= 62) {
      // Level 62 trait
      hardcastPotency = 300;
    } else {
      hardcastPotency = 270;
    }
  } else if (verstoneStatus > 0 && hardcastAction === 'verstone') {
    if (player.level >= 62) {
      // Level 62 trait
      hardcastPotency = 300;
    } else {
      hardcastPotency = 270;
    }
  } else if (player.level >= 18 && count.targets > 1 && hardcastAction === 'verthunder2') {
    if (player.level >= 78) {
      // Level 78 trait
      hardcastPotency = 120 * count.targets;
    } else {
      hardcastPotency = 100 * count.targets;
    }
  } else if (player.level >= 22 && count.targets > 1 && hardcastAction === 'veraero2') {
    if (player.level >= 78) {
      // Level 78 trait
      hardcastPotency = 120 * count.targets;
    } else {
      hardcastPotency = 100 * count.targets;
    }
  } else {
    hardcastPotency = -1000000;
  }

  // hardcastPotency += (hardcastBlackMana + hardcastWhiteMana)
  // * Math.max(singleTargetManaPotency, multiTargetManaPotency * count.targets);

  // Find Dualcasted action potency
  let dualcastPotency = 0;
  if (Math.abs(Math.min(startBlackMana + hardcastBlackMana + dualcastBlackMana, 100)
  - Math.min(startWhiteMana + hardcastWhiteMana + dualcastWhiteMana, 100)) > 30) {
    dualcastPotency = -1000000;
  } else if (dualcastAction === 'verthunder') {
    if (player.level >= 62) {
      // Level 62 trait
      dualcastPotency = 350;
    } else {
      dualcastPotency = 310;
    }
    if (hardcastAction === 'verfire' || verfireStatus < 0) {
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
    if (hardcastAction === 'verstone' || verstoneStatus < 0) {
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
    dualcastPotency = -1000000;
  }

  const newBlackMana = Math.min(startBlackMana + hardcastBlackMana + dualcastBlackMana, 100);
  const newWhiteMana = Math.min(startWhiteMana + hardcastWhiteMana + dualcastWhiteMana, 100);
  const manaDifference = Math.abs(newBlackMana
    - newWhiteMana) / 10; // Help prioritize smaller differences

  const manaOverCap = Math.max(startBlackMana + hardcastBlackMana + dualcastBlackMana - 100, 0)
  + Math.max(startWhiteMana + hardcastWhiteMana + dualcastWhiteMana - 100, 0);

  // Proritize combo that results in Verholy/Verflare procs
  let startComboPotency = 0;
  let startCombo = '';

  if (player.level >= 52 && count.targets > 1) {
    // delete toggle.startCombo;
  } else if (player.level >= 68 && Math.min(newBlackMana, newWhiteMana) >= manaTarget) {
    if (player.level >= 70 && manaOverCap < manaBreakpoint && newBlackMana > newWhiteMana
    && dualcastAction === 'verthunder' && verfireStatus < 0
    && (hardcastAction === 'verstone' || verstoneStatus < 0)) {
      startComboPotency = 20; // 100% proc Verholy, no overwrite
      startCombo = 'verholy';
    } else if (manaOverCap < manaBreakpoint && newWhiteMana > newBlackMana
    && dualcastAction === 'veraero' && verstoneStatus < 0
    && (hardcastAction === 'verfire' || verfireStatus < 0)) {
      startComboPotency = 20; // 100% proc Verflare, no overwrite
      startCombo = 'verflare';
    } else if (player.level >= 70 && manaOverCap < manaBreakpoint && newBlackMana > newWhiteMana
    && dualcastAction === 'verthunder'
    && (hardcastAction === 'verstone' || verstoneStatus < 0)) {
      startComboPotency = 10; // 100% proc Verholy, 50% overwrite existing proc
      startCombo = 'verholy';
    } else if (manaOverCap < manaBreakpoint && newWhiteMana > newBlackMana
    && dualcastAction === 'veraero'
    && (hardcastAction === 'verfire' || verfireStatus < 0)) {
      startComboPotency = 10; // 100% proc Verflare, 50% overwrite existing proc
      startCombo = 'verflare';
    } else if (Math.min(startBlackMana, startWhiteMana) >= manaTarget) {
      // If this condition is met, a fix was already tried and the above did not work
      if (player.level >= 70 && verstoneStatus < 0
        && Math.abs(newBlackMana - newWhiteMana + 20) <= 30) {
        startComboPotency = 4; // 20% proc Verholy
        startCombo = 'verholy';
      } else if (verfireStatus < 0 && Math.abs(newBlackMana + 20 - newWhiteMana) <= 30) {
        startComboPotency = 4; // 20% proc Verflare
        startCombo = 'verflare';
      } else if (player.level >= 70 && newBlackMana <= newWhiteMana) {
        startCombo = 'verholy';
      } else {
        startCombo = 'verflare';
      }
    }
  } else if (player.level < 68 && Math.min(newBlackMana, newWhiteMana) >= manaTarget) {
    startCombo = 'melee';
  } else if (player.level < 50 && Math.min(newBlackMana, newWhiteMana) >= 55) {
    startCombo = 'melee';
  } else if (player.level < 35 && Math.min(newBlackMana, newWhiteMana) >= 30) {
    startCombo = 'melee';
  }

  // Calculate final potency
  const potency = hardcastPotency + dualcastPotency
    + (hardcastBlackMana + dualcastBlackMana + hardcastWhiteMana + dualcastWhiteMana - manaOverCap)
    * Math.max(singleTargetManaPotency, count.targets * multiTargetManaPotency)
    - manaDifference + startComboPotency;

  return { potency, startCombo };
};

const rdmDualcast = () => {
  const hardcastSpells = [
    ['jolt', 3, 3],
    ['verfire', 9, 0],
    ['verstone', 0, 9],
    ['verthunder2', 7, 0],
    ['veraero2', 0, 7],
  ];
  const dualcastSpells = [
    ['verthunder', 11, 0],
    ['veraero', 0, 11],
    ['scatter', 3, 3],
  ];
  const dualcastArray = []; // Start with empty array

  // These need to be defined outside of loop - snapshot of current player
  let verfireStatus = checkStatus({ name: 'verfireready' });
  let verstoneStatus = checkStatus({ name: 'verstoneready' });
  let manaficationRecast = checkRecast({ name: 'manafication' });
  let { blackMana } = player.jobDetail;
  let { whiteMana } = player.jobDetail;
  let manaCap = 100; // Define outside for loop conditions
  let manaTarget = 80;
  let elapsedTime = recast.gcd;

  // console.log(`Verfire Ready: ${verfireStatus}  Verstone Ready: ${verstoneStatus}`);
  // console.log(JSON.stringify(dualcastArray));

  do {
    // This will loop at least once

    // reset variables
    let bestCombo = { potency: -10000000 };

    // Calculate mana target for when to stop loop

    if (player.level >= 60 && manaficationRecast - elapsedTime < 0) {
      if (count.targets > 1) {
        manaCap = 50;
        manaTarget = 40;
      } else {
        manaCap = 50;
        manaTarget = 50;
      }
    } else if (player.level >= 52 && count.targets > 1) {
      manaCap = 100;
      manaTarget = 70; // Try to stay above 50/50 for upcoming Manafications
    } else {
      manaCap = 100;
      manaTarget = 80;
    }

    // Reprise/Moulinet control
    // Lower mana preempitively with moulinet/reprise

    // With Manafication
    if (player.level >= 60) {
      // Single Target/Reprise
      if (count.targets === 1 && Math.min(blackMana, whiteMana) < 80) {

        if (player.level >= 72) {
          for (let i = 1; i <= 5; i += 1) {
            // console.log(recast.gcd);
            if (manaficationRecast - elapsedTime - 2200 * i < 0
            && Math.min(blackMana - 5 * i, whiteMana - 5 * i) >= 50) {
              for (let j = 1; j <= i; j += 1) {
                dualcastArray.unshift({ name: 'reprise', img: 'reprise' });
                elapsedTime += 2200;
                blackMana -= 5;
                whiteMana -= 5;
              }
            }
          }
        } else {
          for (let i = 1; i <= 2; i += 1) {
            if (manaficationRecast - elapsedTime - 1500 * i < 0
            && Math.min(blackMana - 20 * i, whiteMana - 20 * i) >= 50) {
              for (let j = 1; j <= i; j += 1) {
                dualcastArray.unshift({ name: 'moulinet', img: 'moulinet' });
                elapsedTime += 1500;
                blackMana -= 20;
                whiteMana -= 20;
              }
            }
          }
        }
      } else if (count.targets > 1) {
        for (let i = 1; i <= 2; i += 1) {
          if (manaficationRecast - elapsedTime - 1500 * i < 0
          && Math.min(blackMana - 20 * i, whiteMana - 20 * i) >= 50) {
            for (let j = 1; j <= i; j += 1) {
              dualcastArray.unshift({ name: 'moulinet', img: 'moulinet' });
              elapsedTime += 1500;
              blackMana -= 20;
              whiteMana -= 20;
            }
          }
        }
      }
    } else if (player.level >= 52 && count.targets > 1) {
      // Moulinet only
      for (let i = 1; i <= 5; i += 1) {
        // console.log(recast.gcd);
        if (Math.min(blackMana - 20 * i, whiteMana - 20 * i) >= 0) {
          for (let j = 1; j <= i; j += 1) {
            dualcastArray.unshift({ name: 'moulinet', img: 'moulinet' });
            elapsedTime += 1500;
            blackMana -= 20;
            whiteMana -= 20;
          }
        }
      }
    }

    if (player.level >= 60 && manaficationRecast - elapsedTime < 0
    && Math.min(blackMana, whiteMana) >= 50
    && Math.min(blackMana, whiteMana) < 65) {
      dualcastArray.push({ name: 'manafication', img: 'manafication' });
      manaficationRecast += recast.manafication;
      elapsedTime += 1000 * 1;
    }

    // Loops through every hardcast/dualcast combination to find most valuable one
    // To do - acceleration counts
    for (let i = 0; i < hardcastSpells.length; i += 1) {
      for (let j = 0; j < dualcastSpells.length; j += 1) {
        const nextDualcast = rdmFindNextDualcast({
          startBlackMana: blackMana,
          startWhiteMana: whiteMana,
          manaTarget,
          manaCap,
          hardcastAction: hardcastSpells[i][0],
          hardcastBlackMana: hardcastSpells[i][1],
          hardcastWhiteMana: hardcastSpells[i][2],
          dualcastAction: dualcastSpells[j][0],
          dualcastBlackMana: dualcastSpells[j][1],
          dualcastWhiteMana: dualcastSpells[j][2],
          verfireStatus: verfireStatus - elapsedTime,
          verstoneStatus: verstoneStatus - elapsedTime,
        });
        if (nextDualcast.potency > bestCombo.potency) {
          bestCombo = {
            hardcastAction: hardcastSpells[i][0],
            dualcastAction: dualcastSpells[j][0],
            blackManaGain: hardcastSpells[i][1] + dualcastSpells[j][1],
            whiteManaGain: hardcastSpells[i][2] + dualcastSpells[j][2],
            potency: nextDualcast.potency,
            startCombo: nextDualcast.startCombo,
          };
          // console.log(JSON.stringify(bestCombo)); // Uncomment to check array at end
        }
      }
    }

    // console.log(elapsedTime);

    // console.log(JSON.stringify(bestCombo)); // Uncomment to check array at end

    // Adjust Verfire/Verstone Ready
    if (bestCombo.hardcastAction === 'verfire') {
      verfireStatus = -1;
    } else if (bestCombo.hardcastAction === 'verstone') {
      verstoneStatus = -1;
    }

    // Add to action array
    dualcastArray.push({ name: `hardcast ${bestCombo.hardcastAction}`, img: bestCombo.hardcastAction });
    dualcastArray.push({ name: `dualcast ${bestCombo.dualcastAction}`, img: bestCombo.dualcastAction });
    elapsedTime += recast.gcd * 2;
    blackMana = Math.min(blackMana + bestCombo.blackManaGain, 100);
    whiteMana = Math.min(whiteMana + bestCombo.whiteManaGain, 100);

    if (player.level >= 60 && manaficationRecast - elapsedTime < 0
    && Math.min(blackMana, whiteMana) >= 50
    && Math.min(blackMana, whiteMana) < 65) {
      dualcastArray.push({ name: 'manafication', img: 'manafication' });
      manaficationRecast += recast.manafication;
      elapsedTime += 1000 * 1;
    }

    if (bestCombo.startCombo !== '') { // non empty string
      if (next.combo !== bestCombo.startCombo) {
        priorityArray.length = 0;
        resyncActions({ array: priorityArray });
        next.combo = bestCombo.startCombo;
      }
      break;
    } else {
      // Hide everything
      priorityArray.length = 0;
      resyncActions({ array: priorityArray });
      delete next.combo;
    }
  } while (elapsedTime < 15000);

  // Uncomment to check array
  // console.log(`Black: ${blackMana}/${manaCap} White:${whiteMana}/${manaCap}`);
  // console.log(JSON.stringify(dualcastArray));

  actionArray = dualcastArray;
  resyncActions({ array: actionArray });
};

const rdmNext = () => { // Main function
  rdmDualcast();
  
  priorityArray.length = 0;
  resyncActions({ array: priorityArray });

  // Check if combo was toggled by Dualcast function
  if (next.combo) {
    if (player.level >= 68
    && Math.min(player.jobDetail.blackMana, player.jobDetail.whiteMana) >= 80) {
      if (player.level >= 70 && player.jobDetail.whiteMana < player.jobDetail.blackMana
      && checkStatus({ name: 'verstoneready' }) < 1500 * 3 + recast.gcd) {
        rdmVerholyCombo();
      } else if (player.jobDetail.blackMana < player.jobDetail.whiteMana
      && checkStatus({ name: 'verfireready' }) < 1500 * 3 + recast.gcd) {
        rdmVerflareCombo();
      } else if (player.level >= 70
      && player.jobDetail.whiteMana + 20 - player.jobDetail.blackMana <= 30
      && checkStatus({ name: 'verstoneready' }) < 1500 * 3 + recast.gcd
      && checkStatus({ name: 'verfireready' }) > 1500 * 3 + recast.gcd) {
        rdmVerholyCombo(); // 20% proc, avoid overwrite
      } else if (player.jobDetail.blackMana + 20 - player.jobDetail.whiteMana <= 30
      && checkStatus({ name: 'verfireready' }) < 1500 * 3 + recast.gcd
      && checkStatus({ name: 'verstoneready' }) > 1500 * 3 + recast.gcd) {
        rdmVerflareCombo(); // 20% proc, avoid overwrite
      } else if (player.level >= 70 && player.jobDetail.blackMana <= player.jobDetail.whiteMana) {
        rdmVerholyCombo();
      } else {
        rdmVerflareCombo();
      }
    } else if (player.level < 68
    && Math.min(player.jobDetail.blackMana, player.jobDetail.whiteMana) >= 80) {
      rdmMeleeCombo();
    } else if (player.level < 50
    && Math.min(player.jobDetail.blackMana, player.jobDetail.whiteMana) >= 55) {
      rdmMeleeCombo();
    } else if (player.level < 35
    && Math.min(player.jobDetail.blackMana, player.jobDetail.whiteMana) >= 30) {
      rdmMeleeCombo();
    }
  }
};

const rdmOnJobChange = () => {
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
  addCountdown({
    name: 'corpsacorps', array: cooldownArray, onComplete: 'addAction',
  });
  if (player.level >= 40) {
    addCountdown({
      name: 'displacement', array: cooldownArray, onComplete: 'addAction',
    });
  }
  if (player.level >= 45) {
    addCountdown({
      name: 'fleche', array: cooldownArray, onComplete: 'addAction',
    });
  }
  if (player.level >= 56) {
    addCountdown({
      name: 'contresixte', array: cooldownArray, onComplete: 'addAction',
    });
  }
  if (player.level >= 60) {
    addCountdown({ name: 'manafication' });
  }

  count.targets = 1;
  rdmNext();
};

const rdmOnCasting = () => {
  // Clear out combo stuff
  priorityArray.length = 0;
  resyncActions({ array: priorityArray });

  const row = document.getElementById('action-row');
  const match = row.querySelector('div[data-action~="hardcast"]');
  if (match) {
    const name = match.dataset.action;
    fadeAction({ name });
  }
};

const rdmOnAction = (actionMatch) => {
  // Non-GCD Actions
  if (actionMatch.groups.actionName === 'Corps-A-Corps') {
    removeAction({ name: 'corpsacorps', array: cooldownArray });
    addRecast({ name: 'corpsacorps' });
    addCountdown({
      name: 'corpsacorps', time: recast.corpsacorps, onComplete: 'addAction', array: cooldownArray,
    });
  } else if (['Displacement', 'Engagement'].indexOf(actionMatch.groups.actionName) > -1) {
    removeAction({ name: 'displacement', array: cooldownArray });
    addRecast({ name: 'displacement' });
    addCountdown({
      name: 'displacement', time: recast.displacement, onComplete: 'addAction', array: cooldownArray,
    });
  } else if (actionMatch.groups.actionName === 'Fleche') {
    removeAction({ name: 'fleche', array: cooldownArray });
    addRecast({ name: 'fleche' });
    addCountdown({
      name: 'fleche', time: recast.fleche, onComplete: 'addAction', array: cooldownArray,
    });
  } else if (actionMatch.groups.actionName === 'Acceleration') {
    removeAction({ name: 'acceleration', array: cooldownArray });
    addRecast({ name: 'acceleration' });
    addCountdown({
      name: 'acceleration', time: recast.acceleration, onComplete: 'addAction', array: cooldownArray,
    });
  } else if (actionMatch.groups.actionName === 'Contre Sixte') {
    removeAction({ name: 'contresixte', array: cooldownArray });
    addRecast({ name: 'contresixte' });
    addCountdown({
      name: 'contresixte', time: recast.contresixte, onComplete: 'addAction', array: cooldownArray,
    });
    // Contre Sixte makes the formulas act funny it seems...
    // countTargets('contresixte');
  } else if (actionMatch.groups.actionName === 'Embolden') {
    addRecast({ name: 'embolden' });
  } else if (actionMatch.groups.actionName === 'Swiftcast') {
    removeAction({ name: 'swiftcast', array: cooldownArray });
    addRecast({ name: 'swiftcast' });
    addCountdown({
      name: 'swiftcast', time: recast.swiftcast, onComplete: 'addAction', array: cooldownArray,
    });
  } else if (actionMatch.groups.actionName === 'Lucid Dreaming') {
    addRecast({ name: 'luciddreaming' });
  } else if (['Riposte', 'Enchanted Riposte'].indexOf(actionMatch.groups.actionName) > -1) {
    toggle.combo = Date.now();
    count.targets = 1;
    removeAction({ name: 'riposte', array: priorityArray });
    if (player.level < 35
    || Math.max(player.jobDetail.blackMana, player.jobDetail.whiteMana) < 25) {
      delete toggle.combo;
    }
  } else if (['Zwerchhau', 'Enchanted Zwerchhau'].indexOf(actionMatch.groups.actionName) > -1) {
    removeAction({ name: 'zwerchhau', array: priorityArray });
    toggle.combo = Date.now();
    if (player.level < 50
    || Math.max(player.jobDetail.blackMana, player.jobDetail.whiteMana) < 25) {
      delete toggle.combo;
    }
  } else if (['Redoublement', 'Enchanted Redoublement'].indexOf(actionMatch.groups.actionName) > -1) {
    toggle.combo = Date.now();
    removeAction({ name: 'redoublement', array: priorityArray });
    if (player.level < 68) {
      delete toggle.combo;
    }
  } else if (actionMatch.groups.actionName === 'Verflare') {
    toggle.combo = Date.now();
    removeAction({ name: 'verflare', array: priorityArray });
    if (player.level < 80) {
      delete toggle.combo;
      rdmNext();
    }
  } else if (actionMatch.groups.actionName === 'Verholy') {
    toggle.combo = Date.now();
    removeAction({ name: 'verholy', array: priorityArray });
    if (player.level < 80) {
      delete toggle.combo;
      rdmNext();
    }
  } else if (actionMatch.groups.actionName === 'Scorch') {
    removeAction({ name: 'scorch', array: priorityArray });
    delete toggle.combo;
    rdmNext();
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
      rdmNext();
    } else if (['Reprise', 'Enchanted Reprise'].indexOf(actionMatch.groups.actionName) > -1) {
      count.targets = 1;
      removeAction({ name: 'reprise' });
      rdmNext();
    } else if (actionMatch.groups.actionName === 'Manafication') {
      removeAction({ name: 'manafication' });
      removeAction({ name: 'corpsacorps', array: cooldownArray });
      removeAction({ name: 'displacement', array: cooldownArray });
      addRecast({ name: 'manafication' });
      addRecast({ name: 'corpsacorps', time: -1 });
      addRecast({ name: 'displacement', time: -1 });
      addCountdown({ name: 'manafication' });
      addCountdown({
        name: 'displacement', time: -1, onComplete: 'addAction', array: cooldownArray,
      });
      addCountdown({
        name: 'corpsacorps', time: -1, onComplete: 'addAction', array: cooldownArray,
      });
      rdmNext();
    }
  }
};

// 17: NetworkCancelAbility
const rdmOnCancel = (cancelledMatch) => {
  const row = document.getElementById('action-row');
  const match = row.querySelector('div[data-action~="hardcast"]');
  if (match) {
    const name = match.dataset.action;
    unfadeAction({ name });
  }
  rdmNext(); // Recheck dualcast if casting canceled
};

// 1A: NetworkBuff
const rdmOnStatus = (statusMatch) => {
  if (statusMatch.groups.effectName === 'Dualcast') {
    if (statusMatch.groups.gainsLoses === 'gains') {
      addStatus({ name: 'dualcast', time: parseInt(statusMatch.groups.effectDuration, 10) * 1000 });
      const hardcastDiv = document.getElementById('action-row').querySelector('div[data-action~="hardcast"]');
      if (hardcastDiv) { removeAction({ name: hardcastDiv.dataset.action }); }
    } else if (statusMatch.groups.gainsLoses === 'loses') {
      removeStatus({ name: 'dualcast' });
      rdmNext();
    }
  } else if (statusMatch.groups.effectName === 'Verfire Ready') {
    if (statusMatch.groups.gainsLoses === 'gains') {
      addStatus({ name: 'verfireready', time: parseInt(statusMatch.groups.effectDuration, 10) * 1000 });
      if (!toggle.combo) { rdmNext(); } // Prevents Verflare proc from resetting combo
    } else if (statusMatch.groups.gainsLoses === 'loses') {
      removeStatus({ name: 'verfireready' });
    }
  } else if (statusMatch.groups.effectName === 'Verstone Ready') {
    if (statusMatch.groups.gainsLoses === 'gains') {
      addStatus({ name: 'verstoneready', time: parseInt(statusMatch.groups.effectDuration, 10) * 1000 });
      if (!toggle.combo) { rdmNext(); } // Prevents Verholy proc from resetting combo
    } else if (statusMatch.groups.gainsLoses === 'loses') {
      removeStatus({ name: 'verstoneready' });
    }
  } else if (statusMatch.groups.effectName === 'Manafication') {
    if (statusMatch.groups.gainsLoses === 'gains') {
      addStatus({ name: 'manafication', time: parseInt(statusMatch.groups.effectDuration, 10) * 1000 });
    } else if (statusMatch.groups.gainsLoses === 'loses') {
      removeStatus({ name: 'manafication' });
    }
  } else if (statusMatch.groups.effectName === 'Swiftcast') {
    if (statusMatch.groups.gainsLoses === 'gains') {
      addStatus({ name: 'swiftcast', time: parseInt(statusMatch.groups.effectDuration, 10) * 1000 });
    } else if (statusMatch.groups.gainsLoses === 'loses') {
      removeStatus({ name: 'swiftcast' });
    }
  }
};

const rdmComboTimeout = () => {
  clearTimeout(timeout.combo);
  timeout.combo = setTimeout(rdmNext, 12500);
};
