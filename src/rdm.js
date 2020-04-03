
actionList.RDM = [
  // Off-GCD
  'Corps-A-Corps', 'Displacement', 'Fleche', 'Contre Sixte', 'Acceleration', 'Manafication',
  'Engagement', 'Embolden',
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

const rdmCooldowns = [
  'Corps-A-Corps', 'Displacement', 'Fleche', 'Contre Sixte', 'Acceleration', 'Manafication',
  'Engagement', 'Embolden',
  'Swiftcast', 'Lucid Dreaming',
];

const rdmDualcastSpells = [
  'Jolt',
  'Verthunder',
  'Veraero',
  'Verfire',
  'Verstone',
  'Verthunder II',
  'Veraero II',
  'Jolt II',
  'Scatter',
  'Impact',
];

const rdmAccelerationSpells = [
  'Verthunder',
  'Veraero',
  'Verflare',
  'Verholy',
];

const rdmComboSkills = [
  'Enchanted Riposte',
  'Enchanted Zwerchhau',
  'Enchanted Redoublement',
  'Verflare',
  'Verholy',
  'Scorch',
];

const rdmWeaponskills = [
  'Riposte', 'Enchanted Riposte',
  'Zwerchhau', 'Enchanted Zwerchhau',
  'Redoublement', 'Enchanted Redoublement',
  'Moulinet', 'Enchanted Moulinet',
  'Reprise', 'Enchanted Reprise',
];

castingList.RDM = [
  'Jolt', 'Verfire', 'Verstone', 'Jolt II', 'Verthunder', 'Veraero',
  'Verthunder II', 'Veraero II', 'Vercure', 'Impact', 'Scatter',
];

statusList.RDM = [
  'Dualcast', 'Verfire Ready', 'Verstone Ready', 'Manafication',
  'Swiftcast',
];

// const rdmClearCombo = () => {
//   delete toggle.combo;
//   iconArrayA.length = 0;
//   syncIcons({ iconArray: iconArrayA });
// };
//
// const rdmMeleeCombo = () => {
//   if (toggle.combo !== 'melee') {
//     rdmClearCombo();
//   } else {
//     return;
//   }
//   toggle.combo = 'melee';
//   addIcon({ name: 'Enchanted Riposte', iconArray: iconArrayA });
//   addIcon({ name: 'Enchanted Zwerchhau', iconArray: iconArrayA });
//   addIcon({ name: 'Enchanted Redoublement', iconArray: iconArrayA });
// };
//
// // Verflare (called after melee combo function)
// const rdmVerflareCombo = () => {
//   if (toggle.combo !== 'Verflare') {
//     rdmClearCombo();
//   } else {
//     return;
//   }
//   toggle.combo = 'Verflare';
//   addIcon({ name: 'Enchanted Riposte', iconArray: iconArrayA });
//   addIcon({ name: 'Enchanted Zwerchhau', iconArray: iconArrayA });
//   addIcon({ name: 'Enchanted Redoublement', iconArray: iconArrayA });
//   addIcon({ name: 'Verflare', iconArray: iconArrayA });
//   if (player.level >= 80) {
//     addIcon({ name: 'Scorch', iconArray: iconArrayA });
//   }
// };

// Verholy (called after melee combo function)
// const rdmVerholyCombo = () => {
//   if (toggle.combo !== 'Verflare') {
//     rdmClearCombo();
//   } else {
//     return;
//   }
//   toggle.combo = 'Verflare';
//   addIcon({ name: 'Enchanted Riposte', iconArray: iconArrayA });
//   addIcon({ name: 'Enchanted Zwerchhau', iconArray: iconArrayA });
//   addIcon({ name: 'Enchanted Redoublement', iconArray: iconArrayA });
//   addIcon({ name: 'Verholy', iconArray: iconArrayA });
//   if (player.level >= 80) {
//     addIcon({ name: 'Scorch', iconArray: iconArrayA });
//   }
// };
//
//
// const rdmCheckCombo = () => {
//   const blackMana = player.blackMana;
//   const whiteMana = player.whiteMana;
//   const manaMin = Math.min(blackMana, whiteMana);
//   // const manaMax = Math.max(blackMana, whiteMana);
//   const verfirereadyStatus = checkStatus({ name: 'Verfire Ready' });
//   const verstonereadyStatus = checkStatus({ name: 'Verstone Ready' });
//   const statusBuffer = player.gcd * 2;
//   const accelerationStatus = checkStatus({ name: 'Acceleration' });
//   // console.log(blackMana);
//
//   if (player.level >= 52 && count.targets > 1 && manaMin >= 70) {
//     // Thing
//   } else if (player.level >= 68 && manaMin >= 80) {
//     // Finds available proc combo
//     // Verholy wins tiebreakers because why not
//     if (player.level >= 70 && blackMana > whiteMana && verstonereadyStatus < statusBuffer) {
//       rdmVerholyCombo();
//     } else if (whiteMana > blackMana && verfirereadyStatus < statusBuffer) {
//       rdmVerflareCombo();
//     } else if (player.level >= 70 && verstonereadyStatus < statusBuffer
//     && accelerationStatus > statusBuffer && Math.min(whiteMana + 20, 100) - blackMana <= 30) {
//       rdmVerholyCombo(); // 100% Proc with Acceleration
//     } else if (verfirereadyStatus < statusBuffer && accelerationStatus > statusBuffer
//     && Math.min(blackMana + 20, 100) - whiteMana <= 30) {
//       rdmVerflareCombo(); // 100% Proc with Acceleration
//     } else if (player.level >= 70 && blackMana + 14 <= 100 && blackMana + 14 > whiteMana + 3
//     && verfirereadyStatus < statusBuffer && verstonereadyStatus < statusBuffer) {
//       // Jolt Verthunder Verholy
//     } else if (player.level >= 70 && blackMana + 11 <= 100 && blackMana + 11 > whiteMana + 9
//     && verfirereadyStatus < statusBuffer && verstonereadyStatus > statusBuffer) {
//       // Verstone Verthunder Verholy
//     } else if (player.level >= 70 && blackMana + 20 <= 100 && blackMana + 20 > whiteMana
//     && verfirereadyStatus > statusBuffer && verstonereadyStatus < statusBuffer) {
//       // Verfire Verthunder Verholy
//     } else if (whiteMana + 14 <= 100 && whiteMana + 14 > blackMana + 3
//     && verfirereadyStatus < statusBuffer && verstonereadyStatus < statusBuffer) {
//       // Jolt Veraero Verflare
//     } else if (whiteMana + 11 <= 100 && whiteMana + 11 > blackMana + 9
//     && verfirereadyStatus > statusBuffer && verstonereadyStatus < statusBuffer) {
//       // Verfire Veraero Verflare
//     } else if (whiteMana + 20 <= 100 && whiteMana + 20 > blackMana
//     && verfirereadyStatus < statusBuffer && verstonereadyStatus > statusBuffer) {
//       // Verstone Veraero Verflare
//     } else if (player.level >= 70 && verstonereadyStatus < statusBuffer
//     && Math.min(whiteMana + 20, 100) - blackMana <= 30) {
//       rdmVerholyCombo();
//     } else if (verfirereadyStatus < statusBuffer && Math.min(blackMana + 20, 100) - whiteMana <= 30) {
//       rdmVerflareCombo();
//     } else if (player.level >= 70 && blackMana >= whiteMana) {
//       rdmVerholyCombo();
//     } else {
//       rdmVerflareCombo();
//     }
//   } else if (player.level < 35 && manaMin >= 30) {
//     rdmMeleeCombo();
//   } else if (player.level < 50 && manaMin >= 55) {
//     rdmMeleeCombo();
//   } else if (player.level < 68 && manaMin >= 80) {
//     rdmMeleeCombo();
//   }
// };

// const rdmFindNextDualcast = ({
//   startBlackMana,
//   startWhiteMana,
//   manaTarget,
//   manaCap,
//   hardcastAction,
//   hardcastBlackMana,
//   hardcastWhiteMana,
//   dualcastAction,
//   dualcastBlackMana,
//   dualcastWhiteMana,
//   verfirereadyStatus,
//   verstonereadyStatus,
//   accelerationCount,
// } = {}) => {
//   // Static variables
//   const singleTargetManaPotency = 8.07;
//   const multiTargetManaPotency = 2.43; // Per target
//
//   // Set proc potency
//   let procPotency = 0;
//   if (player.level >= 62) {
//     procPotency = 20;
//   } else {
//     procPotency = 90;
//   }
//
//   // Calculate mana manaBreakpoint for Verflare/Verholy fixing
//   // const manaBreakpoint = (20 * 0.8) / singleTargetManaPotency + 3;
//
//   // Find Hardcasted action potency
//   let hardcastPotency = 0;
//
//   if (Math.abs(Math.min(startBlackMana + hardcastBlackMana, 100)
//   - Math.min(startWhiteMana + hardcastWhiteMana, 100)) > 30) {
//     hardcastPotency = -1000000;
//   } else if (hardcastAction === 'Jolt') {
//     if (player.level >= 62) {
//       // Level 62 trait
//       hardcastPotency = 280;
//     } else {
//       hardcastPotency = 180;
//     }
//   } else if (verfirereadyStatus > 0 && hardcastAction === 'Verfire') {
//     if (player.level >= 62) {
//       // Level 62 trait
//       hardcastPotency = 300;
//     } else {
//       hardcastPotency = 270;
//     }
//   } else if (verstonereadyStatus > 0 && hardcastAction === 'Verstone') {
//     if (player.level >= 62) {
//       // Level 62 trait
//       hardcastPotency = 300;
//     } else {
//       hardcastPotency = 270;
//     }
//   } else if (player.level >= 18 && count.targets > 1 && hardcastAction === 'Verthunder II') {
//     if (player.level >= 78) {
//       // Level 78 trait
//       hardcastPotency = 120 * count.targets;
//     } else {
//       hardcastPotency = 100 * count.targets;
//     }
//   } else if (player.level >= 22 && count.targets > 1 && hardcastAction === 'Veraero II') {
//     if (player.level >= 78) {
//       // Level 78 trait
//       hardcastPotency = 120 * count.targets;
//     } else {
//       hardcastPotency = 100 * count.targets;
//     }
//   } else {
//     hardcastPotency = -1000000;
//   }
//
//   // hardcastPotency += (hardcastBlackMana + hardcastWhiteMana)
//   // * Math.max(singleTargetManaPotency, multiTargetManaPotency * count.targets);
//
//   // Find Dualcasted action potency
//   let dualcastPotency = 0;
//   if (Math.abs(Math.min(startBlackMana + hardcastBlackMana + dualcastBlackMana, 100)
//   - Math.min(startWhiteMana + hardcastWhiteMana + dualcastWhiteMana, 100)) > 30) {
//     dualcastPotency = -1000000;
//   } else if (dualcastAction === 'Verthunder') {
//     if (player.level >= 62) {
//       // Level 62 trait
//       dualcastPotency = 350;
//     } else {
//       dualcastPotency = 310;
//     }
//     if (hardcastAction === 'Verfire' || verfirereadyStatus < 0) {
//       // Add proc potency if applicable
//       if (accelerationCount > 0) {
//         dualcastPotency += procPotency;
//       } else {
//         dualcastPotency += procPotency * 0.5;
//       }
//     }
//   } else if (dualcastAction === 'Veraero') {
//     if (player.level >= 62) {
//       // Level 62 trait
//       dualcastPotency = 350;
//     } else {
//       dualcastPotency = 310;
//     }
//     if (hardcastAction === 'Verstone' || verstonereadyStatus < 0) {
//       // Add proc potency if applicable
//       if (accelerationCount > 0) {
//         dualcastPotency += procPotency;
//       } else {
//         dualcastPotency += procPotency * 0.5;
//       }
//     }
//   } else if (player.level >= 15 && dualcastAction === 'Scatter') {
//     if (player.level >= 66) { // Trait
//       dualcastPotency = 220 * count.targets;
//     } else {
//       dualcastPotency = 120 * count.targets;
//     }
//   } else {
//     dualcastPotency = -1000000;
//   }
//
//   const newBlackMana = Math.min(startBlackMana + hardcastBlackMana + dualcastBlackMana, 100);
//   const newWhiteMana = Math.min(startWhiteMana + hardcastWhiteMana + dualcastWhiteMana, 100);
//   const manaDifference = Math.abs(newBlackMana
//     - newWhiteMana) / 10; // Help prioritize smaller differences
//
//   const manaOverCap = Math.max(startBlackMana + hardcastBlackMana + dualcastBlackMana - 100, 0)
//   + Math.max(startWhiteMana + hardcastWhiteMana + dualcastWhiteMana - 100, 0);
//
//   // Proritize combo that results in Verholy/Verflare procs
//   let startComboPotency = 0;
//
//   if (player.level >= 68 && Math.min(newBlackMana, newWhiteMana) >= manaTarget) {
//     if (player.level >= 70 && newBlackMana > newWhiteMana
//     && (hardcastAction === 'Verstone' || verstonereadyStatus < 0)
//     && dualcastAction === 'Verthunder' && verfirereadyStatus < 0) {
//       startComboPotency = 20; // 100% proc Verholy, no overwrite
//     } else if (player.level >= 70 && newBlackMana > newWhiteMana
//     && (hardcastAction === 'Verstone' || verstonereadyStatus < 0)
//     && dualcastAction === 'Verthunder') {
//       startComboPotency = 10; // 100% proc Verholy, 50% overwrite existing proc
//     } else if (player.level >= 70 && Math.abs(newBlackMana - newWhiteMana + 20) <= 30
//     && (hardcastAction === 'Verstone' || verstonereadyStatus < 0)) {
//       if (accelerationCount - 1 > 0) {
//         startComboPotency = 20; // 100% proc Verholy with Acceleration
//       } else {
//         startComboPotency = 4; // 20% proc Verholy
//       }
//     } else if (newWhiteMana > newBlackMana
//     && (hardcastAction === 'Verfire' || verfirereadyStatus < 0)
//     && dualcastAction === 'Veraero' && verstonereadyStatus < 0) {
//       startComboPotency = 20; // 100% proc Verflare, no overwrite
//     } else if (newWhiteMana > newBlackMana
//     && (hardcastAction === 'Verfire' || verfirereadyStatus < 0)
//     && dualcastAction === 'Veraero') {
//       startComboPotency = 10; // 100% proc Verflare, 50% overwrite existing proc
//     } else if (verfirereadyStatus < 0 && Math.abs(newBlackMana + 20 - newWhiteMana) <= 30
//     && (hardcastAction === 'Verfire' || verfirereadyStatus < 0)) {
//       if (accelerationCount - 1 > 0) {
//         startComboPotency = 200; // 100% proc Verflare
//       } else {
//         startComboPotency = 4; // 20% proc Verflare
//       }
//     }
//   }
//
//   // Calculate final potency
//   const potency = hardcastPotency + dualcastPotency
//     + (hardcastBlackMana + dualcastBlackMana + hardcastWhiteMana + dualcastWhiteMana - manaOverCap)
//     * Math.max(singleTargetManaPotency, count.targets * multiTargetManaPotency)
//     - manaDifference + startComboPotency;
//
//   return { potency };
// };

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
    } else if (Math.random() < 0.5) {
      return 'Veraero';
    } return 'Verthunder';
  } else if (verfirereadyStatus > player.gcd) {
    if (Math.min(whiteMana + 11, 100) - blackMana <= 30) {
      return 'Veraero';
    } return 'Verthunder';
  } else if (verstonereadyStatus > player.gcd) {
    if (Math.min(blackMana + 11, 100) - whiteMana <= 30) {
      return 'Verthunder';
    } return 'Veraero';
  } else if (blackMana > whiteMana) {
    return 'Veraero';
  } else if (blackMana < whiteMana) {
    return 'Verthunder';
  } else if (Math.random() < 0.5) {
    return 'Veraero';
  } return 'Verthunder';
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
  } else if (swiftcastRecast < 0 && Math.max(blackMana, whiteMana) < 80
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
  let manaficationStatus = checkStatus({ name: 'Manafication' });
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
      // console.log(nextGCD);

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
          gcdTime = 0;
        }
      } else if (['Enchanted Redoublement', 'Enchanted Reprise'].includes(nextGCD)) {
        gcdTime = 2200;
      } else if (rdmWeaponskills.includes(nextGCD)) {
        gcdTime = 1500;
      } else {
        gcdTime = player.gcd;
      }
      loopTime = gcdTime;

      /* Combo */
      if (rdmComboSkills.includes(nextGCD)) {
        comboStep = nextGCD;
      } else {
        comboStep = '';
      }

      /* Resources */
      if (['Jolt', 'Jolt II'].includes(nextGCD)) {
        blackMana = Math.min(blackMana + 3, 100);
        whiteMana = Math.min(whiteMana + 3, 100);
      } else if (nextGCD === 'Verthunder') {
        if (accelerationCount > 0) {
          verfirereadyStatus = duration.verfireready;
          accelerationCount -= 1;
        }
        blackMana = Math.min(blackMana + 11, 100);
      } else if (nextGCD === 'Veraero') {
        if (accelerationCount > 0) {
          verstonereadyStatus = duration.verstoneready;
          accelerationCount -= 1;
        }
        whiteMana = Math.min(whiteMana + 11, 100);
      } else if (nextGCD === 'Verfire') {
        verfirereadyStatus = -1;
        blackMana = Math.min(blackMana + 9, 100);
      } else if (nextGCD === 'Verstone') {
        verstonereadyStatus = -1;
        whiteMana = Math.min(whiteMana + 9, 100);
      } else if (nextGCD === 'Verflare') {
        if (blackMana < whiteMana) {
          verfirereadyStatus = duration.verfireready;
        } else if (accelerationCount > 0) {
          verfirereadyStatus = duration.verfireready;
          accelerationCount -= 1;
        }
        blackMana = Math.min(blackMana + 21, 100);
      } else if (nextGCD === 'Verholy') {
        if (blackMana > whiteMana) {
          verstonereadyStatus = duration.verstoneready;
        } else if (accelerationCount > 0) {
          verstonereadyStatus = duration.verstoneready;
          accelerationCount -= 1;
        }
        whiteMana = Math.min(whiteMana + 21, 100);
      } else if (nextGCD === 'Enchanted Riposte') {
        blackMana -= 30;
        whiteMana -= 30;
      } else if (nextGCD === 'Enchanted Zwerchhau') {
        blackMana -= 25;
        whiteMana -= 25;
      } else if (nextGCD === 'Enchanted Redoublement') {
        blackMana -= 25;
        whiteMana -= 25;
      } else if (nextGCD === 'Enchanted Reprise') {
        blackMana -= 5;
        whiteMana -= 5;
        // console.log('reprise: black'+blackMana+' white'+whiteMana);
        // console.log(gcdTime);
      } else if (nextGCD === 'Scorch') {
        blackMana += 7;
        whiteMana += 7;
      }

      /* Acceleration stuff */
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


      /* Calculate gcd time */
      // gcdTime = player.gcd;
      // loopTime = gcdTime;
      // if (pldSpells.includes(nextGCD) && (player.level < 78 || requiescatStatus < 0)) {
      //   gcdTime = 0;
      // }
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
        manaficationStatus = duration.manafication;
        manaficationRecast = recast.manafication;
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
    manaficationStatus -= loopTime;
    swiftcastRecast -= loopTime;
    swiftcastStatus -= loopTime;
    verfirereadyStatus -= loopTime;
    verstonereadyStatus -= loopTime;


    // circleofscornRecast -= loopTime;
    // fightorflightRecast -= loopTime;
    // fightorflightStatus -= loopTime;
    // goringbladeStatus -= loopTime;
    // requiescatRecast -= loopTime;
    // requiescatStatus -= loopTime;
    // spiritswithinRecast -= loopTime;
    // swordoathStatus -= loopTime;
    nextTime += loopTime;
    // console.log(nextTime);
    /* MP tick */
    if (Math.floor(loopTime / 3000) > mpTick) {
      mp = Math.min(mp + 200, 10000);
      if (luciddreamingStatus > 0) {
        mp = Math.min(mp + 500, 10000);
      }
      mpTick += 1;
    }
  } while (nextTime < 15000);
  iconArrayB = rdmArray;
  syncIcons();
};

onCasting.RDM = (castingMatch) => {
  // Clear out combo stuff
  // next.casting = Date.now();
  // console.log(`Starts casting ${castingMatch.groups.actionName}: ${Date.now()}`);
  // iconArrayA.length = 0;
  // syncIcons({ iconArray: iconArrayA });

  fadeIcon({ name: castingMatch.groups.actionName });
  // fadeIcon({ name: 'Hardcast', match: 'contains' });
  rdmNext();
};

onAction.RDM = (actionMatch) => {
  // Action log
  // next.uses = Date.now();
  // console.log(`Uses ${actionMatch.groups.actionName}: ${next.uses - next.casting}`);
  removeIcon({ name: actionMatch.groups.actionName });

  // Target number calculations
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
  } else if (player.level >= 52 && rdmComboSkills.includes(actionMatch.groups.actionName)) {
    player.targetCount = 1;
  } else if (actionMatch.groups.actionName === 'Enchanted Moulinet' && player.targetCount === 1) {
    player.targetCount = 2;
  } else {
    player.targetCount = 1;
  }

  /* Dualcast */

  // Acceleration counter
  if (player.accelerationCount > 0
  && rdmAccelerationSpells.includes(actionMatch.groups.actionName)) {
    player.accelerationCount -= 1;
  }

  if (rdmCooldowns.includes(actionMatch.groups.actionName)) {
    removeIcon({ name: actionMatch.groups.actionName });
    addRecast({ name: actionMatch.groups.actionName });
    if (actionMatch.groups.actionName === 'Acceleration') {
      addStatus({ name: 'Acceleration' });
      player.accelerationCount = 3;
    } else if (actionMatch.groups.actionName === 'Manafication') {
      addRecast({ name: 'Corps-A-Corps', time: -1 });
      addRecast({ name: 'Displacement', time: -1 });
    } else if (actionMatch.groups.actionName === 'Engagement') {
      removeIcon({ name: 'Displacement' });
      addRecast({ name: 'Displacement' });
    }
  } else if (rdmDualcastSpells.includes(actionMatch.groups.actionName)) {
    player.comboStep = '';
    if (player.accelerationCount > 0
    && rdmAccelerationSpells.includes(actionMatch.groups.actionName)) {
      player.accelerationCount -= 1;
    }

    if (actionMatch.groups.actionName === 'Verfire') {
      removeStatus({ name: 'Verfire Ready' });
    } else if (actionMatch.groups.actionName === 'Verstone') {
      removeStatus({ name: 'Verstone Ready' });
    }

    if (Math.max(checkStatus({ name: 'Dualcast' }) > 0)) {
      removeStatus({ name: 'Dualcast' });
      rdmNext({ gcd: player.gcd });
    } else if (Math.max(checkStatus({ name: 'Swiftcast' }) > 0)) {
      removeStatus({ name: 'Swiftcast' });
      rdmNext({ gcd: player.gcd });
    } else {
      addStatus({ name: 'Dualcast', time: 15000 });
      rdmNext({ gcd: 0 });
    }
  } else if (rdmComboSkills.includes(actionMatch.groups.actionName)) {
    player.comboStep = actionMatch.groups.actionName;
    if (player.accelerationCount > 0
    && rdmAccelerationSpells.includes(actionMatch.groups.actionName)) {
      player.accelerationCount -= 1;
    }

    if (actionMatch.groups.actionName === 'Enchanted Redoublement') {
      rdmNext({ gcd: 2200 });
    } else if (['Verflare', 'Verholy', 'Scorch'].includes(actionMatch.groups.actionName)) {
      rdmNext({ gcd: player.gcd });
    } else {
      rdmNext({ gcd: 1500 });
    }
  } else {
    rdmNext({ gcd: player.gcd });
  }
};

// 17: NetworkCancelAbility
onCancel.RDM = (cancelledMatch) => {
  // console.log(`Canceled: ${Date.now()}`);
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

    if (statusMatch.groups.statusName === 'Verfire Ready') {
      rdmNext({ gcd: player.gcd }); // Prevents Verflare proc from resetting combo
    } else if (statusMatch.groups.statusName === 'Verstone Ready') {
      rdmNext({ gcd: player.gcd }); // Prevents Verflare proc from resetting combo
    }

  //   // Status-specific stuff
  //   if (statusMatch.groups.statusName === 'Dualcast') {
  //     removeIcon({ name: 'Hardcast', match: 'contains' });
  //   } else if (statusMatch.groups.statusName === 'Verfire Ready' && !toggle.combo) {
  //     rdmNext({ gcd: player.gcd }); // Prevents Verflare proc from resetting combo
  //   } else if (statusMatch.groups.statusName === 'Verstone Ready' && !toggle.combo) {
  //     rdmNext({ gcd: player.gcd }); // Prevents Verflare proc from resetting combo
  //   }
  // } else {
  //   removeStatus({ name: statusMatch.groups.statusName });
  //   if (statusMatch.groups.statusName === 'Dualcast') {
  //     rdmNext();
  //   } else if (statusMatch.groups.statusName === 'Acceleration') {
  //     count.acceleration = 0;
  //     rdmNext();
  //   }
  // }
  }
};

// const rdmComboTimeout = () => {
//   clearTimeout(timeout.combo);
//   timeout.combo = setTimeout(rdmNext, 12500);
// };
//
onJobChange.RDM = () => {
//   player.dualcastRow = 'icon-b';
//   if (player.level >= 62) {
//     icon.jolt = icon.jolt2;
//   } else {
//     icon.jolt = '003202';
//   }
//
//   if (player.level >= 66) {
//     icon.scatter = icon.impact;
//   } else {
//     icon.scatter = '003207';
//   }
//
//   // Set up traits
//   if (player.level >= 74) {
//     recast.manafication = 110000;
//   } else {
//     recast.manafication = 120000;
//   }
//
//   if (player.level >= 78) {
//     recast.contresixte = 35000;
//   } else {
//     recast.contresixte = 45000;
//   }
//
//
//   // Create cooldown notifications
//   addCountdown({
//     name: 'Corps-A-Corps', iconArray: iconArrayC, onComplete: 'addIcon',
//   });
//   if (player.level >= 40) {
//     addCountdown({
//       name: 'Displacement', iconArray: iconArrayC, onComplete: 'addIcon',
//     });
//   }
//   if (player.level >= 45) {
//     addCountdown({
//       name: 'Fleche', iconArray: iconArrayC, onComplete: 'addIcon',
//     });
//   }
//   if (player.level >= 56) {
//     addCountdown({
//       name: 'Contre Sixte', iconArray: iconArrayC, onComplete: 'addIcon',
//     });
//   }
//   if (player.level >= 60) {
//     addCountdown({ name: 'Manafication' });
//   }
//
//   count.targets = 1;
  rdmNext();
};
// Unused functions
onTargetChanged.RDM = () => {

};
