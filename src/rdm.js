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
  addIcon({ name: 'Enchanted Riposte', array: iconArrayA });
  if (player.level >= 35
  && Math.min(player.jobDetail.blackMana, player.jobDetail.whiteMana) >= 55) {
    addIcon({ name: 'Enchanted Zwerchhau', array: iconArrayA });
  }
  if (player.level >= 50
  && Math.min(player.jobDetail.blackMana, player.jobDetail.whiteMana) >= 80) {
    addIcon({ name: 'Enchanted Redoublement', array: iconArrayA });
  }
};

// Verflare (called after melee combo function)
const rdmVerflareCombo = () => {
  rdmMeleeCombo();
  addIcon({ name: 'Verflare', array: iconArrayA });
  if (player.level >= 80) {
    addIcon({ name: 'Scorch', array: iconArrayA });
  }
};

// Verholy (called after melee combo function)
const rdmVerholyCombo = () => {
  rdmMeleeCombo();
  addIcon({ name: 'Verholy', array: iconArrayA });
  if (player.level >= 80) {
    addIcon({ name: 'Scorch', array: iconArrayA });
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
  } else if (hardcastAction === 'Jolt') {
    if (player.level >= 62) {
      // Level 62 trait
      hardcastPotency = 280;
    } else {
      hardcastPotency = 180;
    }
  } else if (verfireStatus > 0 && hardcastAction === 'Verfire') {
    if (player.level >= 62) {
      // Level 62 trait
      hardcastPotency = 300;
    } else {
      hardcastPotency = 270;
    }
  } else if (verstoneStatus > 0 && hardcastAction === 'Verstone') {
    if (player.level >= 62) {
      // Level 62 trait
      hardcastPotency = 300;
    } else {
      hardcastPotency = 270;
    }
  } else if (player.level >= 18 && count.targets > 1 && hardcastAction === 'Verthunder II') {
    if (player.level >= 78) {
      // Level 78 trait
      hardcastPotency = 120 * count.targets;
    } else {
      hardcastPotency = 100 * count.targets;
    }
  } else if (player.level >= 22 && count.targets > 1 && hardcastAction === 'Veraero II') {
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
  } else if (dualcastAction === 'Verthunder') {
    if (player.level >= 62) {
      // Level 62 trait
      dualcastPotency = 350;
    } else {
      dualcastPotency = 310;
    }
    if (hardcastAction === 'Verfire' || verfireStatus < 0) {
      // Add proc potency if applicable
      dualcastPotency += procPotency * 0.5;
    }
  } else if (dualcastAction === 'Veraero') {
    if (player.level >= 62) {
      // Level 62 trait
      dualcastPotency = 350;
    } else {
      dualcastPotency = 310;
    }
    if (hardcastAction === 'Verstone' || verstoneStatus < 0) {
      // Add proc potency if applicable
      dualcastPotency += procPotency * 0.5;
    }
  } else if (player.level >= 15 && dualcastAction === 'Scatter') {
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
    && dualcastAction === 'Verthunder' && verfireStatus < 0
    && (hardcastAction === 'Verstone' || verstoneStatus < 0)) {
      startComboPotency = 20; // 100% proc Verholy, no overwrite
      startCombo = 'Verholy';
    } else if (manaOverCap < manaBreakpoint && newWhiteMana > newBlackMana
    && dualcastAction === 'Veraero' && verstoneStatus < 0
    && (hardcastAction === 'Verfire' || verfireStatus < 0)) {
      startComboPotency = 20; // 100% proc Verflare, no overwrite
      startCombo = 'Verflare';
    } else if (player.level >= 70 && manaOverCap < manaBreakpoint && newBlackMana > newWhiteMana
    && dualcastAction === 'Verthunder'
    && (hardcastAction === 'Verstone' || verstoneStatus < 0)) {
      startComboPotency = 10; // 100% proc Verholy, 50% overwrite existing proc
      startCombo = 'Verholy';
    } else if (manaOverCap < manaBreakpoint && newWhiteMana > newBlackMana
    && dualcastAction === 'Veraero'
    && (hardcastAction === 'Verfire' || verfireStatus < 0)) {
      startComboPotency = 10; // 100% proc Verflare, 50% overwrite existing proc
      startCombo = 'Verflare';
    } else if (Math.min(startBlackMana, startWhiteMana) >= manaTarget) {
      // If this condition is met, a fix was already tried and the above did not work
      if (player.level >= 70 && verstoneStatus < 0
        && Math.abs(newBlackMana - newWhiteMana + 20) <= 30) {
        startComboPotency = 4; // 20% proc Verholy
        startCombo = 'Verholy';
      } else if (verfireStatus < 0 && Math.abs(newBlackMana + 20 - newWhiteMana) <= 30) {
        startComboPotency = 4; // 20% proc Verflare
        startCombo = 'Verflare';
      } else if (player.level >= 70 && newBlackMana <= newWhiteMana) {
        startCombo = 'Verholy';
      } else {
        startCombo = 'Verflare';
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
    ['Jolt', 3, 3],
    ['Verfire', 9, 0],
    ['Verstone', 0, 9],
    ['Verthunder II', 7, 0],
    ['Veraero II', 0, 7],
  ];
  const dualcastSpells = [
    ['Verthunder', 11, 0],
    ['Veraero', 0, 11],
    ['Scatter', 3, 3],
  ];
  const dualcastArray = []; // Start with empty array

  // These need to be defined outside of loop - snapshot of current player
  let verfireStatus = checkStatus({ name: 'Verfire Ready' });
  let verstoneStatus = checkStatus({ name: 'Verstone Ready' });
  let corpsacorpsRecast = checkRecast({ name: 'Corps-A-Corps' });
  let displacementRecast = checkRecast({ name: 'Displacement' });
  let flecheRecast = checkRecast({ name: 'Fleche' });
  let contresixteRecast = checkRecast({ name: 'Contre Sixte' });
  let accelerationRecast = checkRecast({ name: 'Acceleration' });
  let manaficationRecast = checkRecast({ name: 'Manafication' });

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
                dualcastArray.unshift({ name: 'Enchanted Reprise', img: 'enchantedreprise' });
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
                dualcastArray.unshift({ name: 'Enchanted Moulinet', img: 'enchantedmoulinet' });
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
              dualcastArray.unshift({ name: 'Enchanted Moulinet', img: 'enchantedmoulinet' });
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
            dualcastArray.unshift({ name: 'Enchanted Moulinet', img: 'enchantedmoulinet' });
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
      dualcastArray.push({ name: 'Manafication', img: 'manafication', size: 'small' });
      manaficationRecast += recast.manafication;
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
    if (bestCombo.hardcastAction === 'Jolt' && player.level >= 62) {
      bestCombo.hardcastAction = 'Jolt II';
    } else if (bestCombo.hardcastAction === 'Verfire') {
      verfireStatus = -1;
    } else if (bestCombo.hardcastAction === 'Verstone') {
      verstoneStatus = -1;
    }

    // Add to action array
    dualcastArray.push({ name: `Hardcast ${bestCombo.hardcastAction}`, img: bestCombo.hardcastAction.replace(/[\s'-]/g, '').toLowerCase() });
    dualcastArray.push({ name: `Dualcast ${bestCombo.dualcastAction}`, img: bestCombo.dualcastAction.replace(/[\s'-]/g, '').toLowerCase() });
    elapsedTime += recast.gcd * 2;
    blackMana = Math.min(blackMana + bestCombo.blackManaGain, 100);
    whiteMana = Math.min(whiteMana + bestCombo.whiteManaGain, 100);

    if (player.level >= 60 && manaficationRecast - elapsedTime < 0
    && Math.min(blackMana, whiteMana) >= 50
    && Math.min(blackMana, whiteMana) < 65) {
      dualcastArray.push({ name: 'Manafication', img: 'manafication' });
      manaficationRecast += recast.manafication;
    }
    // else if (player.level >= 45 && count.targets === 1 && flecheRecast - elapsedTime < 0) {
    //   dualcastArray.push({ name: 'Fleche', img: 'fleche', size: 'small' });
    //   flecheRecast += recast.fleche;
    // } else if (player.level >= 56 && count.targets > 1 && contresixteRecast - elapsedTime < 0) {
    //   dualcastArray.push({ name: 'Contre Sixte', img: 'contresixte', size: 'small' });
    //   contresixteRecast += recast.contresixte;
    // } else if (player.level >= 45 && flecheRecast - elapsedTime < 0) {
    //   dualcastArray.push({ name: 'Fleche', img: 'fleche', size: 'small' });
    //   flecheRecast += recast.fleche;
    // } else if (player.level >= 40 && displacementRecast - elapsedTime < 0) {
    //   dualcastArray.push({ name: 'Displacement', img: 'displacement', size: 'small' });
    //   displacementRecast += recast.displacement;
    // } else if (corpsacorpsRecast - elapsedTime < 0) {
    //   dualcastArray.push({ name: 'Corps-A-Corps', img: 'corpsacorps', size: 'small' });
    //   corpsacorpsRecast += recast.corpsacorps;
    // }

    if (bestCombo.startCombo !== '') { // non empty string
      if (next.combo !== bestCombo.startCombo) {
        iconArrayA.length = 0;
        syncIcons({ array: iconArrayA });
        next.combo = bestCombo.startCombo;
      }
      break;
    } else {
      // Hide everything
      iconArrayA.length = 0;
      syncIcons({ array: iconArrayA });
      delete next.combo;
    }
  } while (elapsedTime < 15000);

  // Uncomment to check array
  // console.log(`Black: ${blackMana}/${manaCap} White:${whiteMana}/${manaCap}`);
  // console.log(JSON.stringify(dualcastArray));

  iconArrayB = dualcastArray;
  syncIcons({ array: iconArrayB });
};

const rdmNext = () => { // Main function
  rdmDualcast();

  iconArrayA.length = 0;
  syncIcons({ array: iconArrayA });

  // Check if combo was toggled by Dualcast function
  if (next.combo) {
    if (player.level >= 68
    && Math.min(player.jobDetail.blackMana, player.jobDetail.whiteMana) >= 80) {
      if (player.level >= 70 && player.jobDetail.whiteMana < player.jobDetail.blackMana
      && checkStatus({ name: 'Verstone Ready' }) < 1500 * 3 + recast.gcd) {
        rdmVerholyCombo();
      } else if (player.jobDetail.blackMana < player.jobDetail.whiteMana
      && checkStatus({ name: 'Verfire Ready' }) < 1500 * 3 + recast.gcd) {
        rdmVerflareCombo();
      } else if (player.level >= 70
      && player.jobDetail.whiteMana + 20 - player.jobDetail.blackMana <= 30
      && checkStatus({ name: 'Verstone Ready' }) < 1500 * 3 + recast.gcd
      && checkStatus({ name: 'Verfire Ready' }) > 1500 * 3 + recast.gcd) {
        rdmVerholyCombo(); // 20% proc, avoid overwrite
      } else if (player.jobDetail.blackMana + 20 - player.jobDetail.whiteMana <= 30
      && checkStatus({ name: 'Verfire Ready' }) < 1500 * 3 + recast.gcd
      && checkStatus({ name: 'Verstone Ready' }) > 1500 * 3 + recast.gcd) {
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
  player.dualcastRow = 'icon-b';
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
    name: 'Corps-A-Corps', array: iconArrayC, onComplete: 'addIcon',
  });
  if (player.level >= 40) {
    addCountdown({
      name: 'Displacement', array: iconArrayC, onComplete: 'addIcon',
    });
  }
  if (player.level >= 45) {
    addCountdown({
      name: 'Fleche', array: iconArrayC, onComplete: 'addIcon',
    });
  }
  if (player.level >= 56) {
    addCountdown({
      name: 'Contre Sixte', array: iconArrayC, onComplete: 'addIcon',
    });
  }
  if (player.level >= 60) {
    addCountdown({ name: 'Manafication' });
  }

  count.targets = 1;
  rdmNext();
};

const rdmOnCasting = () => {
  // Clear out combo stuff
  iconArrayA.length = 0;
  syncIcons({ array: iconArrayA });

  fadeIcon({ name: 'Hardcast', match: 'contains' });
};

const rdmOnAction = (actionMatch) => {

  // Non-GCD Actions
  if ([
    'Corps-A-Corps', 'Fleche', 'Contre Sixte', 'Acceleration', 'Swiftcast', 'Lucid Dreaming',
  ].indexOf(actionMatch.groups.actionName) > -1) {
    removeIcon({ name: actionMatch.groups.actionName, array: iconArrayC });
    addRecast({ name: actionMatch.groups.actionName });
    addCountdown({ name: actionMatch.groups.actionName, onComplete: 'addIcon', array: iconArrayC });
  } else if ([
    'Displacement', 'Engagement',
  ].indexOf(actionMatch.groups.actionName) > -1) {
    removeIcon({ name: 'Displacement', array: iconArrayC });
    addRecast({ name: 'Displacement' });
    addCountdown({ name: 'Displacement', onComplete: 'addIcon', array: iconArrayC });
  } else if (['Riposte', 'Enchanted Riposte'].indexOf(actionMatch.groups.actionName) > -1) {
    toggle.combo = Date.now();
    count.targets = 1;
    removeIcon({ name: actionMatch.groups.actionName, array: iconArrayA });
    if (player.level < 35
    || Math.max(player.jobDetail.blackMana, player.jobDetail.whiteMana) < 25) {
      delete toggle.combo;
    }
  } else if (['Zwerchhau', 'Enchanted Zwerchhau'].indexOf(actionMatch.groups.actionName) > -1) {
    removeIcon({ name: actionMatch.groups.actionName, array: iconArrayA });
    toggle.combo = Date.now();
    if (player.level < 50
    || Math.max(player.jobDetail.blackMana, player.jobDetail.whiteMana) < 25) {
      delete toggle.combo;
    }
  } else if (['Redoublement', 'Enchanted Redoublement'].indexOf(actionMatch.groups.actionName) > -1) {
    toggle.combo = Date.now();
    removeIcon({ name: actionMatch.groups.actionName, array: iconArrayA });
    if (player.level < 68) {
      delete toggle.combo;
    }
  } else if (actionMatch.groups.actionName === 'Verflare') {
    toggle.combo = Date.now();
    removeIcon({ name: actionMatch.groups.actionName, array: iconArrayA });
    if (player.level < 80) {
      delete toggle.combo;
      rdmNext();
    }
  } else if (actionMatch.groups.actionName === 'Verholy') {
    toggle.combo = Date.now();
    removeIcon({ name: actionMatch.groups.actionName, array: iconArrayA });
    if (player.level < 80) {
      delete toggle.combo;
      rdmNext();
    }
  } else if (actionMatch.groups.actionName === 'Scorch') {
    removeIcon({ name: actionMatch.groups.actionName, array: iconArrayA });
    delete toggle.combo;
    rdmNext();
  } else {
    delete toggle.combo; // Everything else here interrupts melee combo

    if (player.level >= 66
    && ['Verthunder', 'Veraero'].indexOf(actionMatch.groups.actionName) > -1) {
      count.targets = 1;
    } else if (['Verthunder II', 'Veraero II', 'Scatter', 'Impact'].indexOf(actionMatch.groups.actionName) > -1) {
      countTargets({ name: actionMatch.groups.actionName });
    } else if (['Moulinet', 'Enchanted Moulinet'].indexOf(actionMatch.groups.actionName) > -1) {
      countTargets({ name: actionMatch.groups.actionName });
      removeIcon({ name: actionMatch.groups.actionName });
      rdmNext();
    } else if (['Reprise', 'Enchanted Reprise'].indexOf(actionMatch.groups.actionName) > -1) {
      count.targets = 1;
      removeIcon({ name: actionMatch.groups.actionName });
      rdmNext();
    } else if (actionMatch.groups.actionName === 'Manafication') {
      removeIcon({ name: 'Manafication' });
      removeIcon({ name: 'Corps-A-Corps', array: iconArrayC });
      removeIcon({ name: 'Displacement', array: iconArrayC });
      addRecast({ name: 'Manafication' });
      addRecast({ name: 'Corps-A-Corps', time: -1 });
      addRecast({ name: 'Displacement', time: -1 });
      addCountdown({ name: 'Manafication' });
      addCountdown({
        name: 'Displacement', onComplete: 'addIcon', array: iconArrayC,
      });
      addCountdown({
        name: 'Corps-A-Corps', onComplete: 'addIcon', array: iconArrayC,
      });
      rdmNext();
    }
  }
};

// 17: NetworkCancelAbility
const rdmOnCancel = (cancelledMatch) => {
  // const row = document.getElementById('action-row');
  // const match = row.querySelector('div[data-name~="Hardcast"]');
  unfadeIcon({ name: 'Hardcast', match: 'contains' });
  rdmNext(); // Recheck dualcast if casting canceled
};

// 1A: NetworkBuff
const rdmOnStatus = (statusMatch) => {
  if (statusMatch.groups.gainsLoses === 'gains') {
    addStatus({
      name: statusMatch.groups.statusName,
      time: parseFloat(statusMatch.groups.statusDuration) * 1000,
    });

    // Status-specific stuff
    if (statusMatch.groups.statusName === 'Dualcast') {
      removeIcon({ name: 'Hardcast', match: 'contains' });
    } else if (statusMatch.groups.statusName === 'Verfire Ready' && !toggle.combo) {
      rdmNext(); // Prevents Verflare proc from resetting combo
    } else if (statusMatch.groups.statusName === 'Verstone Ready' && !toggle.combo) {
      rdmNext(); // Prevents Verflare proc from resetting combo
    }
  } else {
    removeStatus({ name: statusMatch.groups.statusName });
    if (statusMatch.groups.statusName === 'Dualcast') {
      rdmNext();
    }
  }
};

const rdmComboTimeout = () => {
  clearTimeout(timeout.combo);
  timeout.combo = setTimeout(rdmNext, 12500);
};
