
actionList.RDM = [
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

castingList.RDM = [
  'Jolt', 'Verfire', 'Verstone', 'Jolt II', 'Verthunder', 'Veraero',
  'Verthunder II', 'Veraero II', 'Impact', 'Scatter',
];

statusList.RDM = [
  'Dualcast', 'Verfire Ready', 'Verstone Ready', 'Manafication',
  'Swiftcast',
];

const rdmClearCombo = () => {
  delete toggle.combo;
  iconArrayA.length = 0;
  syncIcons({ iconArray: iconArrayA });
};

const rdmMeleeCombo = () => {
  if (toggle.combo !== 'melee') {
    rdmClearCombo();
  } else {
    return;
  }
  toggle.combo = 'melee';
  addIcon({ name: 'Enchanted Riposte', iconArray: iconArrayA });
  addIcon({ name: 'Enchanted Zwerchhau', iconArray: iconArrayA });
  addIcon({ name: 'Enchanted Redoublement', iconArray: iconArrayA });
};

// Verflare (called after melee combo function)
const rdmVerflareCombo = () => {
  if (toggle.combo !== 'Verflare') {
    rdmClearCombo();
  } else {
    return;
  }
  toggle.combo = 'Verflare';
  addIcon({ name: 'Enchanted Riposte', iconArray: iconArrayA });
  addIcon({ name: 'Enchanted Zwerchhau', iconArray: iconArrayA });
  addIcon({ name: 'Enchanted Redoublement', iconArray: iconArrayA });
  addIcon({ name: 'Verflare', iconArray: iconArrayA });
  if (player.level >= 80) {
    addIcon({ name: 'Scorch', iconArray: iconArrayA });
  }
};

// Verholy (called after melee combo function)
const rdmVerholyCombo = () => {
  if (toggle.combo !== 'Verflare') {
    rdmClearCombo();
  } else {
    return;
  }
  toggle.combo = 'Verflare';
  addIcon({ name: 'Enchanted Riposte', iconArray: iconArrayA });
  addIcon({ name: 'Enchanted Zwerchhau', iconArray: iconArrayA });
  addIcon({ name: 'Enchanted Redoublement', iconArray: iconArrayA });
  addIcon({ name: 'Verholy', iconArray: iconArrayA });
  if (player.level >= 80) {
    addIcon({ name: 'Scorch', iconArray: iconArrayA });
  }
};


const rdmCheckCombo = () => {
  const blackMana = player.blackMana;
  const whiteMana = player.whiteMana;
  const manaMin = Math.min(blackMana, whiteMana);
  // const manaMax = Math.max(blackMana, whiteMana);
  const verfireStatus = checkStatus({ name: 'Verfire Ready' });
  const verstoneStatus = checkStatus({ name: 'Verstone Ready' });
  const statusBuffer = recast.gcd * 2;
  const accelerationStatus = checkStatus({ name: 'Acceleration' });
  // console.log(blackMana);

  if (player.level >= 52 && count.targets > 1 && manaMin >= 70) {
    // Thing
  } else if (player.level >= 68 && manaMin >= 80) {
    // Finds available proc combo
    // Priority is Verholy because why not
    if (player.level >= 70 && blackMana > whiteMana && verstoneStatus < statusBuffer) {
      rdmVerholyCombo();
    } else if (whiteMana > blackMana && verfireStatus < statusBuffer) {
      rdmVerflareCombo();
    } else if (player.level >= 70 && verstoneStatus < statusBuffer
    && accelerationStatus > statusBuffer && Math.min(whiteMana + 20, 100) - blackMana <= 30) {
      rdmVerholyCombo(); // 100% Proc with Acceleration
    } else if (verfireStatus < statusBuffer && accelerationStatus > statusBuffer
    && Math.min(blackMana + 20, 100) - whiteMana <= 30) {
      rdmVerflareCombo(); // 100% Proc with Acceleration
    } else if (player.level >= 70 && blackMana + 14 <= 100 && blackMana + 14 > whiteMana + 3
    && verfireStatus < statusBuffer && verstoneStatus < statusBuffer) {
      // Jolt Verthunder Verholy
    } else if (player.level >= 70 && blackMana + 11 <= 100 && blackMana + 11 > whiteMana + 9
    && verfireStatus < statusBuffer && verstoneStatus > statusBuffer) {
      // Verstone Verthunder Verholy
    } else if (player.level >= 70 && blackMana + 20 <= 100 && blackMana + 20 > whiteMana
    && verfireStatus > statusBuffer && verstoneStatus < statusBuffer) {
      // Verfire Verthunder Verholy
    } else if (whiteMana + 14 <= 100 && whiteMana + 14 > blackMana + 3
    && verfireStatus < statusBuffer && verstoneStatus < statusBuffer) {
      // Jolt Veraero Verflare
    } else if (whiteMana + 11 <= 100 && whiteMana + 11 > blackMana + 9
    && verfireStatus > statusBuffer && verstoneStatus < statusBuffer) {
      // Verfire Veraero Verflare
    } else if (whiteMana + 20 <= 100 && whiteMana + 20 > blackMana
    && verfireStatus < statusBuffer && verstoneStatus > statusBuffer) {
      // Verstone Veraero Verflare
    } else if (player.level >= 70 && verstoneStatus < statusBuffer
    && Math.min(whiteMana + 20, 100) - blackMana <= 30) {
      rdmVerholyCombo();
    } else if (verfireStatus < statusBuffer && Math.min(blackMana + 20, 100) - whiteMana <= 30) {
      rdmVerflareCombo();
    } else if (player.level >= 70 && blackMana >= whiteMana) {
      rdmVerholyCombo();
    } else {
      rdmVerflareCombo();
    }
  } else if (player.level < 35 && manaMin >= 30) {
    rdmMeleeCombo();
  } else if (player.level < 50 && manaMin >= 55) {
    rdmMeleeCombo();
  } else if (player.level < 68 && manaMin >= 80) {
    rdmMeleeCombo();
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
  accelerationCount,
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
  // const manaBreakpoint = (20 * 0.8) / singleTargetManaPotency + 3;

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
      if (accelerationCount > 0) {
        dualcastPotency += procPotency;
      } else {
        dualcastPotency += procPotency * 0.5;
      }
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
      if (accelerationCount > 0) {
        dualcastPotency += procPotency;
      } else {
        dualcastPotency += procPotency * 0.5;
      }
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

  if (player.level >= 68 && Math.min(newBlackMana, newWhiteMana) >= manaTarget) {
    if (player.level >= 70 && newBlackMana > newWhiteMana
    && (hardcastAction === 'Verstone' || verstoneStatus < 0)
    && dualcastAction === 'Verthunder' && verfireStatus < 0) {
      startComboPotency = 20; // 100% proc Verholy, no overwrite
    } else if (player.level >= 70 && newBlackMana > newWhiteMana
    && (hardcastAction === 'Verstone' || verstoneStatus < 0)
    && dualcastAction === 'Verthunder') {
      startComboPotency = 10; // 100% proc Verholy, 50% overwrite existing proc
    } else if (player.level >= 70 && Math.abs(newBlackMana - newWhiteMana + 20) <= 30
    && (hardcastAction === 'Verstone' || verstoneStatus < 0)) {
      if (accelerationCount - 1 > 0) {
        startComboPotency = 20; // 100% proc Verholy with Acceleration
      } else {
        startComboPotency = 4; // 20% proc Verholy
      }
    } else if (newWhiteMana > newBlackMana
    && (hardcastAction === 'Verfire' || verfireStatus < 0)
    && dualcastAction === 'Veraero' && verstoneStatus < 0) {
      startComboPotency = 20; // 100% proc Verflare, no overwrite
    } else if (newWhiteMana > newBlackMana
    && (hardcastAction === 'Verfire' || verfireStatus < 0)
    && dualcastAction === 'Veraero') {
      startComboPotency = 10; // 100% proc Verflare, 50% overwrite existing proc
    } else if (verfireStatus < 0 && Math.abs(newBlackMana + 20 - newWhiteMana) <= 30
    && (hardcastAction === 'Verfire' || verfireStatus < 0)) {
      if (accelerationCount - 1 > 0) {
        startComboPotency = 200; // 100% proc Verflare
      } else {
        startComboPotency = 4; // 20% proc Verflare
      }
    }
  }

  // Calculate final potency
  const potency = hardcastPotency + dualcastPotency
    + (hardcastBlackMana + dualcastBlackMana + hardcastWhiteMana + dualcastWhiteMana - manaOverCap)
    * Math.max(singleTargetManaPotency, count.targets * multiTargetManaPotency)
    - manaDifference + startComboPotency;

  return { potency };
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
  // let corpsacorpsRecast = checkRecast({ name: 'Corps-A-Corps' });
  // let displacementRecast = checkRecast({ name: 'Displacement' });
  // let flecheRecast = checkRecast({ name: 'Fleche' });
  // let contresixteRecast = checkRecast({ name: 'Contre Sixte' });
  // let accelerationRecast = checkRecast({ name: 'Acceleration' });
  let accelerationCount = count.acceleration;
  let manaficationRecast = checkRecast({ name: 'Manafication' });

  let blackMana = player.blackMana;
  let whiteMana = player.whiteMana;
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
      manaficationRecast = recast.manafication + elapsedTime;
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
          };
          // console.log(JSON.stringify(bestCombo)); // Uncomment to check array at end
        }
      }
    }

    // console.log(elapsedTime);

    // console.log(JSON.stringify(bestCombo)); // Uncomment to check array at end

    // Change Jolt to Jolt II
    if (bestCombo.hardcastAction === 'Jolt' && player.level >= 62) {
      bestCombo.hardcastAction = 'Jolt II';
    }

    // Adjust Verfire/Verstone Ready status
    if (accelerationCount > 0) {
      accelerationCount -= 1;
      if (bestCombo.dualcastAction === 'Verthunder') {
        verfireStatus = 15000 + elapsedTime;
      } else if (bestCombo.dualcastAction === 'Veraero') {
        verstoneStatus = 15000 + elapsedTime;
      }
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
      dualcastArray.push({ name: 'Manafication', img: 'manafication', size: 'small' });
      manaficationRecast = recast.manafication + elapsedTime;
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

    // if (next.combo !== bestCombo.startCombo && bestCombo.startCombo !== '') { // non empty string
    //   iconArrayA.length = 0;
    //   syncIcons({ iconArray: iconArrayA });
    //   next.combo = bestCombo.startCombo;
    //   break;
    // } else {
    //   // Hide everything
    //   iconArrayA.length = 0;
    //   syncIcons({ iconArray: iconArrayA });
    //   delete next.combo;
    // }
  } while (elapsedTime < 15000);

  // Uncomment to check array
  // console.log(`Black: ${blackMana}/${manaCap} White:${whiteMana}/${manaCap}`);
  // console.log(JSON.stringify(dualcastArray));

  iconArrayB = dualcastArray;
  syncIcons({ iconArray: iconArrayB });
};

const rdmNext = () => { // Main function
  rdmCheckCombo();
  rdmDualcast();
};

onCasting.RDM = () => {
  // Clear out combo stuff
  iconArrayA.length = 0;
  syncIcons({ iconArray: iconArrayA });

  fadeIcon({ name: 'Hardcast', match: 'contains' });
};

onAction.RDM = (actionMatch) => {
  // Action log

  // Target number calculations
  if (['Verthunder II', 'Veraero II', 'Scatter', 'Impact', 'Moulinet', 'Enchanted Moulinet', 'Contre Sixte'].indexOf(actionMatch.groups.actionName) > -1) {
    countTargets({ name: actionMatch.groups.actionName });
  } else if (['Verfire', 'Verstone'].indexOf(actionMatch.groups.actionName) > -1 && count.targets > 2) {
    count.targets = 2;
    // Verfire / Verstone are higher potency at 2 targets than Verthunder II / Veraero II
  } else if (['Verthunder', 'Veraero'].indexOf(actionMatch.groups.actionName) > -1 && player.level < 66 && count.targets > 2) {
    count.targets = 2;
    // Verthunder / Veraero are higher potency at 2 targets before Impact at 66
  } else {
    count.targets = 1;
  }

  // Acceleration counter
  if (actionMatch.groups.actionName === 'Acceleration') {
    count.acceleration = 3;
    return;
  } else if (['Verthunder', 'Veraero', 'Verflare', 'Verholy'].indexOf(actionMatch.groups.actionName) > -1 && count.acceleration > 0) {
    count.acceleration -= 1;
  }

  // Icon/countdown stuff
  if (['Corps-A-Corps', 'Fleche', 'Contre Sixte', 'Acceleration', 'Swiftcast', 'Lucid Dreaming'].indexOf(actionMatch.groups.actionName) > -1) {
    removeIcon({ name: actionMatch.groups.actionName, iconArray: iconArrayC });
    addRecast({ name: actionMatch.groups.actionName });
    addCountdown({ name: actionMatch.groups.actionName, onComplete: 'addIcon', iconArray: iconArrayC });
  } else if (['Displacement', 'Engagement'].indexOf(actionMatch.groups.actionName) > -1) {
    removeIcon({ name: 'Displacement', iconArray: iconArrayC });
    addRecast({ name: 'Displacement' });
    addCountdown({ name: 'Displacement', onComplete: 'addIcon', iconArray: iconArrayC });
  } else if (['Enchanted Riposte', 'Enchanted Zwerchhau', 'Enchanted Redoublement', 'Verflare', 'Verholy', 'Scorch'].indexOf(actionMatch.groups.actionName) > -1) {
    removeIcon({ name: actionMatch.groups.actionName, iconArray: iconArrayA });
    count.targets = 1;
    if (actionMatch.groups.actionName === 'Enchanted Riposte' && (Math.max(player.blackMana, player.whiteMana) < 25 || player.level < 35)) {
      rdmClearCombo();
      rdmNext();
    } else if (actionMatch.groups.actionName === 'Enchanted Zwerchhau' && (Math.max(player.blackMana, player.whiteMana) < 25 || player.level < 50)) {
      rdmClearCombo();
      rdmNext();
    } else if (actionMatch.groups.actionName === 'Enchanted Redoublement' && player.level < 68) {
      rdmClearCombo();
      rdmNext();
    } else if (['Verflare', 'Verholy'].indexOf(actionMatch.groups.actionName) > -1 && player.level < 80) {
      rdmClearCombo();
      rdmNext();
    } else if (actionMatch.groups.actionName === 'Scorch') {
      rdmClearCombo();
      rdmNext();
    }
  } else if (['Moulinet', 'Enchanted Moulinet', 'Reprise', 'Enchanted Reprise'].indexOf(actionMatch.groups.actionName) > -1) {
    rdmClearCombo();
    rdmNext();
  } else if (actionMatch.groups.actionName === 'Manafication') {
    removeIcon({ name: 'Manafication' });
    removeIcon({ name: 'Corps-A-Corps', iconArray: iconArrayC });
    removeIcon({ name: 'Displacement', iconArray: iconArrayC });
    addRecast({ name: 'Manafication' });
    addRecast({ name: 'Corps-A-Corps', time: -1 });
    addRecast({ name: 'Displacement', time: -1 });
    addCountdown({ name: 'Manafication' });
    addCountdown({
      name: 'Displacement', onComplete: 'addIcon', iconArray: iconArrayC,
    });
    addCountdown({
      name: 'Corps-A-Corps', onComplete: 'addIcon', iconArray: iconArrayC,
    });
    rdmClearCombo();
    rdmNext();
  }
};

// 17: NetworkCancelAbility
onCancel.RDM = (cancelledMatch) => {
  // const row = document.getElementById('action-row');
  // const match = row.querySelector('div[data-name~="Hardcast"]');
  unfadeIcon({ name: 'Hardcast', match: 'contains' });
  rdmNext(); // Recheck dualcast if casting canceled
};

// 1A: NetworkBuff
onStatus.RDM = (statusMatch) => {
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
    } else if (statusMatch.groups.statusName === 'Acceleration') {
      count.acceleration = 0;
      rdmNext();
    }
  }
};

const rdmComboTimeout = () => {
  clearTimeout(timeout.combo);
  timeout.combo = setTimeout(rdmNext, 12500);
};


onJobChange.RDM = () => {
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
    name: 'Corps-A-Corps', iconArray: iconArrayC, onComplete: 'addIcon',
  });
  if (player.level >= 40) {
    addCountdown({
      name: 'Displacement', iconArray: iconArrayC, onComplete: 'addIcon',
    });
  }
  if (player.level >= 45) {
    addCountdown({
      name: 'Fleche', iconArray: iconArrayC, onComplete: 'addIcon',
    });
  }
  if (player.level >= 56) {
    addCountdown({
      name: 'Contre Sixte', iconArray: iconArrayC, onComplete: 'addIcon',
    });
  }
  if (player.level >= 60) {
    addCountdown({ name: 'Manafication' });
  }

  count.targets = 1;
  rdmNext();
};
