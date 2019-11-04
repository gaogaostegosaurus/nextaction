export const rdmMeleeCombo = () => {
  toggle.combo = Date.now();
  addIcon({ name: 'riposte' });
  if (player.level >= 35) {
    addIcon({ name: 'zwerchhau' });
  }
  if (player.level >= 50) {
    addIcon({ name: 'redoublement' });
  }
};

export const rdmVerflareCombo = () => {
  rdmMeleeCombo();
  if (player.level >= 68) {
    addIcon({ name: 'verflare' });
  }
  if (player.level >= 80) {
    addIcon({ name: 'scorch' });
  }
};

export const rdmVerholyCombo = () => {
  rdmMeleeCombo();
  if (player.level >= 70) {
    addIcon({ name: 'verholy' });
  }
  if (player.level >= 80) {
    addIcon({ name: 'scorch' });
  }
};

export const rdmDualcastPotency = ({
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
  manaficationRecast = 110000,
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

  // Set mana target and cap depending on Manafication recast
  let manaTarget = 80;
  if (count.targets > 1) {
    manaTarget = 100;
  }
  if (manaficationRecast <= 0) {
    manaTarget *= 0.5;
  }

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


export const rdmDualcast = () => {
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
  let { blackMana } = player.jobDetail;
  let { whiteMana } = player.jobDetail;
  let dualcastLoop = 0;
  let manaTarget = 100;
  let bestDualcastCombo = [];
  let bestPotency = 0;
  let potency = 0;

  do {
    // This will loop at least once

    // Calculate mana target for when to stop loop
    if (checkRecast('manafication') < 5000 * dualcastLoop) {
      if (count.targets >= 3) {
        manaTarget = 50;
      } else {
        manaTarget = 40;
      }
    } else if (count.targets >= 3) {
      manaTarget = 70;
    } else {
      manaTarget = 80;
    }

    // Loops through every hardcast/dualcast combination to find most valuable one
    // To do - acceleration counts
    for (let i = 0; i < hardcastSpells.length; i += 1) {
      for (let j = 0; j < dualcastSpells.length; j += 1) {
        potency = rdmDualcastPotency({
          blackMana,
          whiteMana,
          hardcastAction: hardcastSpells[i][0],
          hardcastBlackMana: hardcastSpells[i][1],
          hardcastWhiteMana: hardcastSpells[i][2],
          dualcastAction: dualcastSpells[j][0],
          dualcastBlackMana: dualcastSpells[j][1],
          dualcastWhiteMana: dualcastSpells[j][2],
          verfireReady: verfireReady - 5000 * dualcastLoop - 1,
          verstoneReady: verstoneReady - 5000 * dualcastLoop - 1,
          swiftcastRecast,
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
      verstoneReady -= 5000;
    } else if (bestDualcastCombo[0] === 'verstone') {
      verstoneReady = 0;
      verfireReady -= 5000;
    } else {
      verfireReady -= 5000;
      verstoneReady -= 5000;
    }

    if (bestDualcastCombo[0] === 'swiftcast') {
      swiftcastRecast = recast.swiftcast;
    } else {
      swiftcastRecast -= 5000;
    }

    // Add to action array
    dualcastArray.push({ name: 'hardcast', icon: bestDualcastCombo[0] });
    dualcastArray.push({ name: 'dualcast', icon: bestDualcastCombo[1] });

    // Set up for next loop
    dualcastLoop += 1;
    bestPotency = 0;
    blackMana += bestDualcastCombo[2];
    whiteMana += bestDualcastCombo[3];
  } while (Math.min(blackMana, whiteMana) < manaTarget);

  // console.log(JSON.stringify(dualcastArray)); // Uncomment to check array
  actionArray = dualcastArray;
  syncIcons({ array: actionArray });
};


export const rdmNext = () => { // Main function
  if (count.targets > 1) {
    let minimumMana = 50; // Stay above 50/50 during AoE for Manafication
  } else {
    let minimumMana = 40;
  }

  // // Reprise if Reprise can guarantee proc
  // if (player.level >= 60) {
  //   toggle.manafication = 1; // Something being done with Manafication is this is on
  //   if (player.level >= 72
  //   && count.targets === 1
  //   && checkRecast('manafication') < 3500
  //   && player.jobDetail.whiteMana - 5 >= 50
  //   && player.jobDetail.blackMana - 5 < 50
  //   && checkStatus('verfireready') < rdmProcBufferTime + 2500) {
  //     addIcon({ name: 'reprise' });
  //   } else if (player.level >= 72
  //   && count.targets === 1
  //   && checkRecast('manafication') < 3500
  //   && player.jobDetail.blackMana - 5 >= 50
  //   && player.jobDetail.whiteMana - 5 < 50
  //   && checkStatus('verstoneready') < rdmProcBufferTime + 2500) {
  //     addIcon({ name: 'reprise' });
  //   } else if (player.level >= 60
  //   && Math.min(player.jobDetail.blackMana, player.jobDetail.whiteMana) >= 90
  //   && checkRecast('manafication') < 5000) {
  //     addIcon({ name: 'moulinet' });
  //   } else if (player.level >= 60
  //   && Math.min(player.jobDetail.blackMana, player.jobDetail.whiteMana) >= 70
  //   && checkRecast('manafication') < 3500) {
  //     addIcon({ name: 'moulinet' });
  //   } else if (player.level >= 60
  //   && checkRecast('manafication') < 1000
  //   && Math.min(player.jobDetail.blackMana, player.jobDetail.whiteMana) >= rdmMinimumMana
  //   && Math.max(player.jobDetail.blackMana, player.jobDetail.whiteMana) < 70) {
  //     addIcon({ name: 'manafication' });
  //   } else {
  //     delete toggle.manafication;
  //   }
  // }

  // if (!toggle.manafication
  // && player.level >= 52) {
  //   toggle.moulinet = 1;
  //   if (player.level >= 68
  //   && Math.min(player.jobDetail.blackMana, player.jobDetail.whiteMana) >= 90
  //   && count.targets >= 2) {
  //     addIcon({ name: 'moulinet' }); // Moulinet at two targets to prevent capping
  //   } else if (player.level >= 68
  //   && Math.min(player.jobDetail.blackMana, player.jobDetail.whiteMana) > 70
  //   && count.targets >= 4) {
  //     addIcon({ name: 'moulinet' }); // Moulinet at four or more targets (staying above 50/50 for Manafication)
  //   } else if (player.level >= 60
  //   && Math.min(player.jobDetail.blackMana, player.jobDetail.whiteMana) > 70
  //   && count.targets >= 2) {
  //     addIcon({ name: 'moulinet' }); // Moulinet at four or more targets (staying above 50/50 for Manafication)
  //   } else if (Math.min(player.jobDetail.blackMana, player.jobDetail.whiteMana) >= 20
  //   && count.targets >= 2) {
  //     addIcon({ name: 'moulinet' }); // Moulinet whenever with no Manafication
  //   } else {
  //     delete toggle.moulinet;
  //   }
  // }

  // if (!toggle.moulinet) {
  //   // Single target
  //   if (player.level >= 68
  //   && Math.max(player.jobDetail.blackMana, player.jobDetail.whiteMana) >= 70) {
  //     // Attempt to fix procs before starting combos after 68
  //     rdmFixProcs();
  //   } else if (player.level < 68
  //   && Math.min(player.jobDetail.blackMana, player.jobDetail.whiteMana) >= 80) {
  //     rdmMeleeCombo();
  //   } else if (player.level < 50
  //   && Math.min(player.jobDetail.blackMana, player.jobDetail.whiteMana) >= 55) {
  //     rdmMeleeCombo();
  //   } else if (player.level < 35
  //   && Math.min(player.jobDetail.blackMana, player.jobDetail.whiteMana) >= 30) {
  //     rdmMeleeCombo();
  //   }
  // }

  rdmDualcast();
}

export const rdmOnJobChange = () => {
  nextid.manafication = 0;
  nextid.moulinet = nextid.manafication;
  nextid.reprise = nextid.manafication;

  nextid.combo1 = 1;
  nextid.combo2 = nextid.combo1 + 1;
  nextid.combo3 = nextid.combo1 + 2;
  nextid.combo4 = nextid.combo1 + 3;
  nextid.combo5 = nextid.combo1 + 4;

  nextid.riposte = 1;
  nextid.zwerchhau = nextid.riposte + 1;
  nextid.redoublement = nextid.riposte + 2;
  nextid.verflare =  nextid.riposte + 3;
  nextid.verholy =  nextid.riposte + 3;
  nextid.scorch =  nextid.riposte + 4;

  nextid.hardcast = 18;
  nextid.dualcast = 19;

  nextid.luciddreaming = 21;
  nextid.fleche = 22;
  nextid.contresixte = nextid.fleche + 1;
  nextid.corpsacorps = nextid.fleche + 2;
  nextid.displacement = nextid.fleche + 3;
  nextid.swiftcast = nextid.fleche + 4;
  nextid.acceleration = nextid.fleche + 5;

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
  addCountdownBar({ name: 'corpsacorps', time: checkRecast('corpsacorps'), oncomplete: 'addIcon' });
  if (player.level >= 40) {
    addCountdownBar({ name: 'displacement', time: checkRecast('displacement'), oncomplete: 'addIcon' });
  }
  if (player.level >= 45) {
    addCountdownBar({ name: 'fleche', time: checkRecast('fleche'), oncomplete: 'addIcon' });
  }
  if (player.level >= 56) {
    addCountdownBar({ name: 'contresixte', time: checkRecast('contresixte'), oncomplete: 'addIcon' });
  }
  if (player.level >= 60) {
    addCountdownBar({ name: 'manafication', time: checkRecast('manafication') });
  }

  count.targets = 1;
  rdmNext();
};

export const rdmOnStartsUsing = () => {
  delete toggle.combo; // Starting cast immediately breaks combo, apparently
  removeIcon('riposte');
  removeIcon('zwerchhau');
  removeIcon('redoublement');
  removeIcon('verflare');
  removeIcon('scorch');
};

export const rdmOnAction = (actionLine) => {
  const procBufferTime = 7500;
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

  if (rdmActions.indexOf(actionLine.groups.actionName) > -1) {
    // Non-GCD Actions
    if (actionLine.groups.actionName === 'Corps-A-Corps') {
      removeIcon('corpsacorps');
      addRecast('corpsacorps');
      addCountdownBar({ name: 'corpsacorps', time: recast.corpsacorps, oncomplete: 'addIcon' });
    } else if (['Displacement', 'Engagement'].indexOf(actionLine.groups.actionName) > -1) {
      removeIcon('displacement');
      addRecast('displacement');
      addCountdownBar({ name: 'displacement', time: recast.displacement, oncomplete: 'addIcon' });
    } else if (actionLine.groups.actionName === 'Fleche') {
      removeIcon('fleche');
      addRecast('fleche');
      addCountdownBar({ name: 'fleche', time: recast.fleche, oncomplete: 'addIcon' });
    } else if (actionLine.groups.actionName === 'Acceleration') {
      removeIcon('acceleration');
      addRecast('acceleration');
      addCountdownBar({ name: 'acceleration', time: recast.acceleration, oncomplete: 'addIcon' });
    } else if (actionLine.groups.actionName === 'Contre Sixte') {
      removeIcon('contresixte');
      addRecast('contresixte');
      addCountdownBar({ name: 'contresixte', time: recast.contresixte, oncomplete: 'addIcon' });
      countTargets('contresixte');
    } else if (actionLine.groups.actionName === 'Embolden') {
      addRecast('embolden');
    } else if (actionLine.groups.actionName === 'Swiftcast') {
      removeIcon('swiftcast');
      addRecast('swiftcast');
      addCountdownBar({ name: 'swiftcast', time: recast.swiftcast, oncomplete: 'addIcon' });
    } else if (actionLine.groups.actionName === 'Lucid Dreaming') {
      addRecast('luciddreaming');
    } else {
      // All GCDs
      if (['Riposte', 'Enchanted Riposte'].indexOf(actionLine.groups.actionName) > -1) {
        removeIcon('hardcast');
        removeIcon('dualcast');

        count.targets = 1;
        toggle.combo = 1; // Prevents Verflare/Verholy procs from triggering new Dualcast

        if (player.level >= 68
        && Math.min(player.jobDetail.blackMana, player.jobDetail.whiteMana) >= 50) {
          // 100% proc chance
          if (player.level >= 70
          && player.jobDetail.blackMana > player.jobDetail.whiteMana
          && checkStatus('verstoneready') < procBufferTime) {
            rdmVerholyCombo();
          } else if (player.jobDetail.whiteMana > player.jobDetail.blackMana
          && checkStatus('verfireready') < procBufferTime) {
            rdmVerflareCombo();
          } else if (player.level >= 70
          && player.jobDetail.whiteMana + 20 - player.jobDetail.blackMana <= 30
          && checkStatus('verstoneready') < procBufferTime) {
            rdmVerholyCombo();
          } else if (player.jobDetail.blackMana + 20 - player.jobDetail.whiteMana <= 30
          && checkStatus('verfireready') < procBufferTime) {
            rdmVerflareCombo();
          } else if (player.level >= 70
          && player.jobDetail.blackMana > player.jobDetail.whiteMana) {
            rdmVerholyCombo();
          } else {
            rdmVerflareCombo();
          }
          removeIcon('riposte');
        } else if (player.level < 68
        && Math.min(player.jobDetail.blackMana, player.jobDetail.whiteMana) >= 50) {
          rdmMeleeCombo();
          removeIcon('riposte');
        } else if (player.level < 50
        && Math.min(player.jobDetail.blackMana, player.jobDetail.whiteMana) >= 25) {
          rdmMeleeCombo();
          removeIcon('riposte');
        } else {
          removeIcon('riposte');
          delete toggle.combo;
        }
      } else if (['Zwerchhau', 'Enchanted Zwerchhau'].indexOf(actionLine.groups.actionName) > -1) {
        removeIcon('zwerchhau');
        if (player.level < 50) {
          delete toggle.combo;
        }
      } else if (['Redoublement', 'Enchanted Redoublement'].indexOf(actionLine.groups.actionName) > -1) {
        removeIcon('redoublement');
        if (player.level < 68) {
          delete toggle.combo;
        }
      } else if (actionLine.groups.actionName === 'Verflare') {
        count.targets = 1;
        removeIcon('verflare');
        if (player.level < 80) {
          delete toggle.combo;
        }
      } else if (actionLine.groups.actionName === 'Verholy') {
        removeIcon('verholy');
        if (player.level < 80) {
          delete toggle.combo;
        }
      } else if (actionLine.groups.actionName === 'Scorch') {
        removeIcon('scorch');
        delete toggle.combo;
      } else {
        if (actionLine.groups.actionName === 'Verfire') {
          removeStatus('verfireready');
        } else if (actionLine.groups.actionName === 'Verstone') {
          removeStatus('verstoneready');
        } else if (player.level >= 66
        && ['Verthunder', 'Veraero'].indexOf(actionLine.groups.actionName) > -1) {
          count.targets = 1;
        } else if (actionLine.groups.actionName === 'Verthunder II') {
          if (Date.now() - previous.verthunder2 > 1000) {
            previous.verthunder2 = Date.now();
            count.targets = 1;
          } else {
            count.targets += 1;
          }
        } else if (actionLine.groups.actionName === 'Veraero II') {
          countTargets('veraero2');
        } else if (['Scatter', 'Impact'].indexOf(actionLine.groups.actionName) > -1) {
          countTargets('scatter');
        } else if (['Moulinet', 'Enchanted Moulinet'].indexOf(actionLine.groups.actionName) > -1) {
          countTargets('moulinet');
        } else if (['Reprise', 'Enchanted Reprise'].indexOf(actionLine.groups.actionName) > -1) {
          count.targets = 1;
        } else if (actionLine.groups.actionName === 'Manafication') {
          removeIcon('manafication');
          addRecast('manafication');
          addRecast('corpsacorps', -1);
          addRecast('displacement', -1);
          addCountdownBar({ name: 'manafication' });
          addCountdownBar({ name: 'displacement', time: -1, oncomplete: 'addIcon' });
          addCountdownBar({ name: 'corpsacorps', time: -1, oncomplete: 'addIcon' });
        }

        // Everything here interrupts melee combo
        delete toggle.combo;
      }

      // After every GCD action?
      rdmNext();
    }
  }
}

// 17: NetworkCancelAbility
export const rdmOnCancelled = () => {
  rdmNext(); // Recheck dualcast if casting canceled
}

// 1A: NetworkBuff
export const rdmOnEffect = () => {
  if (effectLog.groups.targetID === player.ID) {
    if (effectLog.groups.effectName === 'Dualcast') {
      if (effectLog.groups.gainsLoses === 'gains') {
        addStatus('dualcast', parseInt(effectLog.groups.effectDuration) * 1000);
        removeIcon('hardcast');
        removeAction({ name: 'hardcast' });
      } else if (effectLog.groups.gainsLoses === 'loses') {
        removeStatus('dualcast');
        rdmNext();
        rdmDualcast();
      }
    } else if (effectLog.groups.effectName === "Verfire Ready") {
      if (effectLog.groups.gainsLoses === 'gains') {
        addStatus('verfireready', parseInt(effectLog.groups.effectDuration) * 1000);
        if (!toggle.combo) {
          rdmNext(); // Prevents Verflare proc from resetting combo
        }
      } else if (effectLog.groups.gainsLoses === 'loses') {
        removeStatus('verfireready', player.ID)
      }
    } else if (effectLog.groups.effectName === "Verstone Ready") {
      if (effectLog.groups.gainsLoses === 'gains') {
        addStatus('verstoneready', parseInt(effectLog.groups.effectDuration) * 1000);
        if (!toggle.combo) {
          rdmNext(); // Prevents Verholy proc from resetting combo
        }
      } else if (effectLog.groups.gainsLoses === 'loses') {
        removeStatus('verstoneready', player.ID)
      }
    } else if (effectLog.groups.effectName === 'Manafication') {
      if (effectLog.groups.gainsLoses === 'gains') {
        addStatus('manafication', parseInt(effectLog.groups.effectDuration) * 1000);
      } else if (effectLog.groups.gainsLoses === 'loses') {
        removeStatus('manafication', player.ID)
      }
    } else if (effectLog.groups.effectName === 'Swiftcast') {
      if (effectLog.groups.gainsLoses === 'gains') {
        addStatus('swiftcast', parseInt(effectLog.groups.effectDuration) * 1000);
        removeIcon('hardcast');
      } else if (effectLog.groups.gainsLoses === 'loses') {
        removeStatus('swiftcast');
        rdmNext();
      }
    }
  }
}


export const rdmFixProcs = () => { // Fix procs if able
  // Assume at least level 68 (no point in doing so before that)
  if (player.level >= 70
    && Math.min(player.jobDetail.blackMana, player.jobDetail.whiteMana) >= 80
    && player.jobDetail.whiteMana < player.jobDetail.blackMana
    && checkStatus('verstoneready') < rdmProcBufferTime) {
    // Procs already fixed - start combo
    rdmVerholyCombo(); // Verholy combo
  } else if (player.jobDetail.blackMana < player.jobDetail.whiteMana
    && Math.min(player.jobDetail.blackMana, player.jobDetail.whiteMana) >= 80
    && checkStatus('verfireready') < rdmProcBufferTime) {
    // Procs already fixed - start combo
    rdmVerflareCombo(); // Verflare combo
  } else if (player.level >= 70
    && Math.min(player.jobDetail.whiteMana + 9, 100)
    < Math.min(player.jobDetail.blackMana + 11, 100)
    && Math.max(player.jobDetail.whiteMana + 9 - 100, 0)
    + Math.max(player.jobDetail.blackMana + 11 - 100, 0) < rdmManaBreakpoint
    && Math.min(player.jobDetail.whiteMana + 9, player.jobDetail.blackMana + 11) >= 80
    && checkStatus('verstoneready') >= 5000) {
    // Verstone + Verthunder => Verholy combo
    addIcon({ name: 'hardcast', img: 'verstone' });
    addIcon({ name: 'dualcast', img: 'verthunder' });
  } else if (Math.min(player.jobDetail.blackMana + 9, 100)
    < Math.min(player.jobDetail.whiteMana + 11, 100)
    && Math.max(player.jobDetail.blackMana + 9 - 100, 0)
    + Math.max(player.jobDetail.whiteMana + 11 - 100, 0) < rdmManaBreakpoint
    && Math.min(player.jobDetail.blackMana + 9, player.jobDetail.whiteMana + 11) >= 80
    && checkStatus('verfireready') >= 5000) {
    // Verfire + Veraero => Verflare combo
    addIcon({ name: 'hardcast', img: 'verfire' });
    addIcon({ name: 'dualcast', img: 'veraero' });
  } else if (player.level >= 70
  && player.jobDetail.whiteMana < Math.min(player.jobDetail.blackMana + 20, 100)
  && player.jobDetail.blackMana + 20 - 100 < rdmManaBreakpoint
  && Math.min(player.jobDetail.whiteMana, player.jobDetail.blackMana + 20) >= 80
  && checkStatus('verfireready') >= 5000
  && checkStatus('verstoneready') < rdmProcBufferTime + 5000) {
    // Verfire > Verthunder > Verholy combo
    addIcon({ name: 'hardcast', img: 'verfire' });
    addIcon({ name: 'dualcast', img: 'verthunder' });
  } else if (player.jobDetail.blackMana < Math.min(player.jobDetail.whiteMana + 20, 100)
  && player.jobDetail.whiteMana + 20 - 100 < rdmManaBreakpoint
  && Math.min(player.jobDetail.blackMana, player.jobDetail.whiteMana + 20) >= 80
  && checkStatus('verstoneready') >= 5000
  && checkStatus('verfireready') < rdmProcBufferTime + 5000) {
    // Verstone > Veraero > Verflare combo
    addIcon({ name: 'hardcast', img: 'verstone' });
    addIcon({ name: 'dualcast', img: 'veraero' });
  } else if (player.level >= 70
  && Math.min(player.jobDetail.whiteMana + 3, 100) < Math.min(player.jobDetail.blackMana + 14, 100)
  && Math.max(player.jobDetail.whiteMana + 3 - 100, 0) + Math.max(player.jobDetail.blackMana + 14 - 100, 0) < rdmManaBreakpoint
  && Math.min(player.jobDetail.whiteMana + 3, player.jobDetail.blackMana + 14) >= 80
  && checkStatus('verstoneready') < rdmProcBufferTime + 5000) {
    // Jolt > Verthunder > Verholy combo
    addIcon({ name: 'hardcast', img: 'jolt' });
    addIcon({ name: 'dualcast', img: 'verthunder' });
  } else if (Math.min(player.jobDetail.blackMana + 3, 100)
  < Math.min(player.jobDetail.whiteMana + 14, 100)
  && Math.max(player.jobDetail.blackMana + 3 - 100, 0)
  + Math.max(player.jobDetail.whiteMana + 14 - 100, 0) < rdmManaBreakpoint
  && Math.min(player.jobDetail.blackMana + 3, player.jobDetail.whiteMana + 14)
  >= 80
  && checkStatus('verfireready') < rdmProcBufferTime + 5000) {
    // Jolt > Veraero > Verflare combo
    addIcon({ name: 'hardcast', img: 'jolt' });
    addIcon({ name: 'dualcast', img: 'veraero' });
  }

  else if (player.level >= 70
  && player.jobDetail.whiteMana < Math.min(player.jobDetail.blackMana + 11, 100)
  && Math.max(player.jobDetail.blackMana + 11 - 100, 0) < rdmManaBreakpoint
  && Math.min(player.jobDetail.whiteMana, player.jobDetail.blackMana + 11) >= 80
  && checkStatus('verstoneready') < rdmProcBufferTime + 5000) {
    // Swiftcast > Verthunder > Verholy combo
    addIcon({ name: 'hardcast', img: 'swiftcast' });
    addIcon({ name: 'dualcast', img: 'verthunder' });
  }

  else if (player.jobDetail.blackMana < Math.min(player.jobDetail.whiteMana + 11, 100)
  && Math.max(player.jobDetail.whiteMana + 11 - 100, 0) < rdmManaBreakpoint
  && Math.min(player.jobDetail.blackMana, player.jobDetail.whiteMana + 11) >= 80
  && checkStatus('verfireready') < rdmProcBufferTime + 5000) {
    // Swiftcast > Veraero > Verflare combo
    addIcon({ name: 'hardcast', img: 'swiftcast' });
    addIcon({ name: 'dualcast', img: 'veraero' });
  }

  // Nothing above matches but already 80+/80+
  else if (Math.min(player.jobDetail.blackMana, player.jobDetail.whiteMana) >= 80) {
    // Try for 20% proc
    if (player.level >= 70
    && player.jobDetail.whiteMana + 20 - player.jobDetail.blackMana <= 30
    && checkStatus('verstoneready') < rdmProcBufferTime) {
      rdmVerholyCombo(); // Verholy combo
    } else if (player.jobDetail.blackMana + 20 - player.jobDetail.whiteMana <= 30
    && checkStatus('verfireready') < rdmProcBufferTime) {
      rdmVerflareCombo(); // Verflare combo
    } else if (player.level >= 70
    && player.jobDetail.blackMana >= player.jobDetail.whiteMana) {
      rdmVerholyCombo(); // Verholy combo
    } else {
      rdmVerflareCombo(); // Verflare combo
    }
  } else {
    rdmDualcast();
  }
}


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
//     if (Math.abs(player.jobDetail.blackMana - 50) + Math.abs(player.jobDetail.whiteMana - 50) > 28) {
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
