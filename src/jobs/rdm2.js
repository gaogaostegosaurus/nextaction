/* global nextAction */

nextAction.RDM = () => {
  const { level } = nextAction.playerData;

  // Filter actions
  nextAction.actionList = nextAction.actionData.filter((e) => (e.affinity === 'RDM' || e.affinity === 'Magical Ranged DPS') && e.level <= level);

  // Traits
  if (level >= 62) {
    let i;
    i = nextAction.actionList.findIndex((e) => e.name === 'Jolt');
    nextAction.actionList = nextAction.actionList.splice(i, 1);
    i = nextAction.actionList.findIndex((e) => e.name === 'Verthunder');
    nextAction.actionList[i].potency = 370;
    i = nextAction.actionList.findIndex((e) => e.name === 'Veraero');
    nextAction.actionList[i].potency = 370;
    i = nextAction.actionList.findIndex((e) => e.name === 'Verfire');
    nextAction.actionList[i].potency = 310;
    i = nextAction.actionList.findIndex((e) => e.name === 'Verstone');
    nextAction.actionList[i].potency = 310;
  }

  if (level >= 66) {
    const i = nextAction.actionList.findIndex((e) => e.name === 'Scatter');
    nextAction.actionList = nextAction.actionList.splice(i, 1);
  }

  if (level >= 72) {
    const i = nextAction.actionList.findIndex((e) => e.name === 'Displacement');
    nextAction.actionList[i].potency = 200;
  }

  if (level >= 74) {
    const i = nextAction.actionList.findIndex((e) => e.name === 'Manafication');
    nextAction.actionList[i].recast = 110000;
  }

  if (level >= 78) {
    let i = nextAction.actionList.findIndex((e) => e.name === 'Contre Sixte');
    nextAction.actionList[i].recast = 35000;
    i = nextAction.actionList.findIndex((e) => e.name === 'Verthunder II');
    nextAction.actionList[i].potency = 120;
    i = nextAction.actionList.findIndex((e) => e.name === 'Veraero II');
    nextAction.actionList[i].potency = 120;
  }

  nextAction.nextAction = nextAction.rdmNextAction;
  nextAction.playerDataChanged = nextAction.rdmPlayerChanged;
};

nextAction.rdmPlayerChanged = (e) => {
  nextAction.playerData.mp = e.detail.currentMP;
  nextAction.playerData.blackMana = e.detail.jobDetail.blackMana;
  nextAction.playerData.whiteMana = e.detail.jobDetail.whiteMana;
};

nextAction.rdmTargetChanged = () => {
  nextAction.rdmNextAction();
};

nextAction.rdmNextLoop = ({
  delay = 0, // Call with this to allow OGCDs to fill next slots
  casting, // Use for calling function during casting
} = {}) => {
  // Static values
  const { setRecast } = nextAction;
  const { getRecast } = nextAction;
  const { getStatusStacks } = nextAction;
  const { getStatusDuration } = nextAction;

  // Clone arrays/objects useful for loop
  const loopPlayer = { ...nextAction.playerData };
  const loopRecastList = [...nextAction.recastList];
  const loopStatusList = [...nextAction.statusList];

  const actionArray = [];

  // Initial values for loop control
  let gcdDelay = delay; // Time till next GCD action (or GCD length, whatever)
  let nextTime = 0; // Amount of time looked ahead in loop
  const maxTime = 240000; // Maximum predict time

  // Start loop
  while (loopTime < maxTime) {
    let loopTime = 0; // Tracks of how "long" the current loop takes
    if (gcdDelay === 0) {
      // Special case for entering loop when casting
      let nextGCD = '';
      if (nextTime === 0 && casting) {
        // If casting, current spell is first GCD
        nextGCD = `Hardcast ${casting}`;
      } else {
        nextGCD = nextAction.rdmNextGCD({
          loopPlayer, loopRecastList, loopStatusList,
        });
      }

      // Push into array
      iconArray.push({ name: nextGCD });

      // Set comboStatus and comboStep
      // Probably fine to not separate weaponskills for RDM since the list of combo actions is short
      if ((level >= 35 && nextGCD === 'Enchanted Riposte')
      || (level >= 50 && nextGCD === 'Enchanted Zwerchhau')
      || (level >= 68 && nextGCD === 'Enchanted Redoublement')
      || (level >= 80 && ['Verflare', 'Verholy'].includes(nextGCD))) {
        comboStep = nextGCD;
        loopStatus.combo = duration.combo;
      } else {
        // Everything else resets combo
        comboStep = '';
        loopStatus.combo = -1;
      }

      // Add procs
      // This block needs to come before mana stuff for simplicity's sake
      if (blackMana < whiteMana && nextGCD === 'Verflare') { loopStatus.verfireready = duration.verfireready; } else
      if (whiteMana < blackMana && nextGCD === 'Verholy') { loopStatus.verstoneready = duration.verstoneready; } else
      if (accelerationCount > 0) {
        if (nextGCD.endsWith(' Verthunder') || nextGCD === 'Verflare') {
          accelerationCount -= 1;
          loopStatus.verfireready = duration.verfireready;
        } else
        if (nextGCD.endsWith(' Veraero') || nextGCD === 'Verholy') {
          accelerationCount -= 1;
          loopStatus.verstoneready = duration.verstoneready;
        }
      }

      // Adjust mana from actions
      if (nextGCD.endsWith(' Jolt') || nextGCD.endsWith(' Jolt II')) { blackMana += 3; whiteMana += 3; } else
      if (nextGCD.endsWith(' Verthunder')) { blackMana += 11; } else
      if (nextGCD.endsWith(' Veraero')) { whiteMana += 11; } else
      if (nextGCD.endsWith(' Scatter') || nextGCD.endsWith(' Impact')) { blackMana += 3; whiteMana += 3; } else
      if (nextGCD.endsWith(' Verthunder II')) { blackMana += 7; } else
      if (nextGCD.endsWith(' Veraero II')) { whiteMana += 7; } else
      if (nextGCD.endsWith(' Verfire')) { blackMana += 9; } else
      if (nextGCD.endsWith(' Verstone')) { whiteMana += 9; } else

      if (nextGCD === 'Enchanted Riposte') { blackMana -= 30; whiteMana -= 30; } else
      if (nextGCD === 'Enchanted Zwerchhau') { blackMana -= 25; whiteMana -= 25; } else
      if (nextGCD === 'Enchanted Redoublement') { blackMana -= 25; whiteMana -= 25; } else
      if (nextGCD === 'Enchanted Moulinet') { blackMana -= 20; whiteMana -= 20; } else
      if (nextGCD === 'Verflare') { blackMana += 21; } else
      if (nextGCD === 'Verholy') { whiteMana += 21; } else
      if (nextGCD === 'Enchanted Reprise') { blackMana -= 5; whiteMana -= 5; } else
      if (nextGCD === 'Scorch') { blackMana += 7; whiteMana += 7; }

      // Fix mana
      if (blackMana > 100) { blackMana = 100; } else if (blackMana < 0) { blackMana = 0; }
      if (whiteMana > 100) { whiteMana = 100; } else if (whiteMana < 0) { whiteMana = 0; }

      // Remove procs
      if (nextGCD.endsWith(' Verfire')) { loopStatus.verfireready = -1; } else
      if (nextGCD.endsWith(' Verstone')) { loopStatus.verstoneready = -1; }

      // GCD
      if (['Enchanted Riposte', 'Enchanted Zwerchhau', 'Enchanted Moulinet'].includes(nextGCD)) {
        gcdTime = 1500;
        loopTime += gcdTime;
      } else
      if (['Enchanted Redoublement', 'Enchanted Reprise'].includes(nextGCD)) {
        gcdTime = 2200;
        loopTime += gcdTime;
      } else
      if (nextGCD.startsWith('Hardcast ') && loopStatus.dualcast < 0 && loopStatus.swiftcast < 0) {
        // Hardcasted stuff
        gcdTime = 0; // Due to cast time
        if (nextGCD.endsWith(' Verthunder') || nextGCD.endsWith(' Veraero') || nextGCD.endsWith(' Scatter') || nextGCD.endsWith(' Impact')) { loopTime += gcd * 2; } else
        if (nextGCD.endsWith(' Verraise')) { loopTime += gcd * 4; } else { loopTime += gcd; }
      } else {
        // Dualcasted/Swiftcasted stuff, spell finishers
        gcdDelay = gcd;
        loopTime += gcdDelay;
      }

      // Dualcast/Swiftcast status
      // Apparently everything deletes Dualcast
      if (loopStatus.dualcast > 0) { loopStatus.dualcast = -1; } else
      // Swiftcast only consumed on spells (and no dualcast)
      if (loopStatus.swiftcast > 0 && nextGCD.startsWith('Dualcast ')) { loopStatus.swiftcast = -1; } else
      // Add Dualcast if nothing above was used
      if (nextGCD.startsWith('Hardcast ')) { loopStatus.dualcast = duration.dualcast; }
    } else { loopTime = gcdTime; }

    // Update Combo status
    if (comboStep === '' || loopStatus.combo < 0) {
      comboStep = '';
      loopStatus.combo = -1;
    }

    // Remove Acceleration if out of charges or time
    if (accelerationCount <= 0 || loopStatus.acceleration <= 0) {
      accelerationCount = 0;
      loopStatus.acceleration = -1;
    }

    let weave = 1;
    let weaveMax = 0;
    if (gcdTime >= 2200) { weaveMax = 2; } else
    if (gcdTime >= 1500) { weaveMax = 1; }

    // Second loop for OGCDs
    while (weave <= weaveMax) {
      const nextOGCD = nextAction.rdmNextOGCD({
        weave, weaveMax, comboStep, blackMana, whiteMana, loopRecast, loopStatus,
        // Put MP in later?
        // weave, weaveMax, mp, comboStep, blackMana, whiteMana, loopRecast, loopStatus,
      });

      if (nextOGCD) {
        // Push into array
        iconArray.push({ name: nextOGCD, size: 'small' });

        // Generic recast/duration handling
        const propertyName = nextOGCD.replace(/[\s':-]/g, '').toLowerCase();
        if (recast[propertyName]) { loopRecast[propertyName] = recast[propertyName]; }
        if (duration[propertyName]) { loopStatus[propertyName] = duration[propertyName]; }

        // Special effects
        // Force end OGCD section if Displacement used
        if (nextOGCD === 'Displacement') { weave = 9; } else
        if (nextOGCD === 'Acceleration') { accelerationCount = 3; } else
        if (nextOGCD === 'Manafication') {
          blackMana = Math.min(blackMana * 2, 100);
          whiteMana = Math.min(whiteMana * 2, 100);
          loopRecast.corpsacorps = -1;
          loopRecast.displacement = -1;
        } else
        if (nextOGCD === 'Engagement') {
          loopRecast.displacement = loopRecast.engagement;
        }
      }

      weave += 1; // Increment regardless if OGCD was added; some skills only go on weave 2
    }

    gcdTime = 0; // Zero out for next GCD

    Object.keys(loopRecast).forEach((property) => {
      loopRecast[property] = Math.max(loopRecast[property] - loopTime, -1);
    });
    Object.keys(loopStatus).forEach((property) => {
      loopStatus[property] = Math.max(loopStatus[property] - loopTime, -1);
    });

    nextTime += loopTime;
  }

  nextAction.syncIcons({ iconArray });

  // Refresh after a few GCDs if nothing's happening
  clearTimeout(nextAction.timeout.nextAction); // Keep this the same across jobs
  nextAction.timeout.nextAction = setTimeout(nextAction.rdmNextAction, gcd * 2, // 2 GCDs seems like a good number... maybe 3?
  );
};

nextAction.rdmGCD = ({
  loopPlayerData, loopRecastArray, loopStatusArray,
} = {}) => {
  const { getStatusDuration } = nextAction;
  const { setStatus } = nextAction;
  const { blackMana } = loopPlayerData;
  const { whiteMana } = loopPlayerData;
  const lowerMana = Math.min(blackMana, whiteMana);
  const higherMana = Math.max(blackMana, whiteMana);
  const targets = 1;
  const { level } = loopPlayerData;
  const { gcd } = loopPlayerData;
  const { actionList } = nextAction;

  // const comboTime = 1500 * 2 + 2200 + gcd * 3;

  const dualcastDuration = getStatusDuration({ name: 'Dualcast', array: loopStatusArray });
  const swiftcastDuration = getStatusDuration({ name: 'Dualcast', array: loopStatusArray });

  // Use Dualcast/Swiftcast if up
  if (dualcastDuration > 0 || swiftcastDuration > 0) {
    if (dualcastDuration > 0) {
      setStatus({ name: 'Dualcast', duration: -1, array: loopStatusArray });
    } else {
      setStatus({ name: 'Swiftcast', duration: -1, array: loopStatusArray });
    }

    // AoE
    if (actionList.some((e) => e.name === 'Impact') && targets >= 2) { return 'Impact'; }
    if (actionList.some((e) => e.name === 'Scatter') && targets >= 3) { return 'Scatter'; }

    // Prevent unbalanced mana
    if (actionList.some((e) => e.name === 'Veraero') && Math.min(blackMana + 11, 100) > whiteMana + 30) { return 'Veraero'; }
    if (actionList.some((e) => e.name === 'Verthunder') && Math.min(whiteMana + 11, 100) > blackMana + 30) { return 'Verthunder'; }

    // Setup for Verflare/Verholy
    const verfireDuration = getStatusDuration({ name: 'Verfire Ready', array: loopStatusArray });
    const verstoneDuration = getStatusDuration({ name: 'Verstone Ready', array: loopStatusArray });

    if (actionList.some((e) => e.name === 'Verholy') && verstoneDuration < comboTime
    && Math.min(blackMana + 11, 100) > whiteMana && whiteMana >= 80) {
      return 'Verthunder';
    }
    if (actionList.some((e) => e.name === 'Verflare') && verfireDuration < comboTime
    && Math.min(whiteMana + 11, 100) > blackMana && blackMana >= 80) {
      return 'Veraero';
    }

    // Avoid overwriting
    // Verfire/Verstone buff implies Verthunder/Veraero is castable
    if (verfireDuration > gcd) { return 'Veraero'; }
    if (verstoneDuration > gcd) { return 'Verthunder'; }

    // All other cases (I hope)
    if (actionList.some((e) => e.name === 'Veraero') && blackMana >= whiteMana) { return 'Veraero'; }
    if (actionList.some((e) => e.name === 'Verthunder')) { return 'Verthunder'; }
    if (actionList.some((e) => e.name === 'Jolt II')) { return 'Jolt II'; }
    if (actionList.some((e) => e.name === 'Jolt')) { return 'Jolt'; }
    return 'Riposte';
  }

  // Always Scorch
  if (actionList.some((e) => e.name === 'Scorch') && ['Verflare', 'Verholy'].includes(comboStep)) { return 'Scorch'; }

  // If it will unbalance, do the other one
  if (level >= 70 && blackMana + 21 > whiteMana + 30 && comboStep === 'Enchanted Redoublement') { return 'Verholy'; }
  if (level >= 68 && whiteMana + 21 > blackMana + 30 && comboStep === 'Enchanted Redoublement') { return 'Verflare'; }

  // 100% proc (without overwriting)
  if (level >= 70 && loopStatus.verstoneready < gcd && blackMana > whiteMana && comboStep === 'Enchanted Redoublement') { return 'Verholy'; }
  if (level >= 68 && loopStatus.verfireready < gcd && whiteMana > blackMana && comboStep === 'Enchanted Redoublement') { return 'Verflare'; }

  // 20% proc
  if (level >= 70 && loopStatus.verstoneready < gcd && comboStep === 'Enchanted Redoublement') { return 'Verholy'; }
  if (level >= 68 && loopStatus.verfireready < gcd && comboStep === 'Enchanted Redoublement') { return 'Verflare'; }

  // Procs not possible(?) - attempt to keep mana levels close
  if (level >= 70 && blackMana >= whiteMana && comboStep === 'Enchanted Redoublement') { return 'Verholy'; }
  if (level >= 68 && whiteMana >= blackMana && comboStep === 'Enchanted Redoublement') { return 'Verflare'; }

  // Whatever
  if (level >= 68 && level < 70 && comboStep === 'Enchanted Redoublement') { return 'Verflare'; }

  // Continue combos
  if (level >= 50 && lowerMana >= 25 && comboStep === 'Enchanted Zwerchhau') { return 'Enchanted Redoublement'; }
  if (level >= 50 && lowerMana >= 50 && comboStep === 'Enchanted Riposte') { return 'Enchanted Zwerchhau'; }
  // Prevent accidental combo continuation?
  if (level >= 35 && level < 50 && lowerMana >= 25 && comboStep === 'Enchanted Riposte') { return 'Enchanted Zwerchhau'; }

  // Moulinet
  if (level >= 60 && targetCount > 1 && lowerMana >= 70) { return 'Enchanted Moulinet'; }
  // Spam AoE if under Manafication buff
  if (level >= 74 && targetCount > 1 && loopStatus.manafication > 0 && lowerMana >= 20) { return 'Enchanted Moulinet'; }
  // No Manafication? No problem
  if (level >= 52 && level < 60 && targetCount > 1 && lowerMana >= 20) { return 'Enchanted Moulinet'; }

  // Start combos
  if (level >= 70 && loopStatus.verstoneready < comboTime
  && lowerMana >= 80 && blackMana > whiteMana) {
    return 'Enchanted Riposte';
  } // Start combo for Verholy
  if (level >= 68 && loopStatus.verfireready < comboTime
  && lowerMana >= 80 && whiteMana > blackMana) {
    return 'Enchanted Riposte';
  } // Start combo for Verflare
  if (level >= 70 && lowerMana >= 80 && loopStatus.verstoneready < comboTime) { return 'Enchanted Riposte'; } // Verholy (20%)
  if (level >= 68 && lowerMana >= 80 && loopStatus.verfireready < comboTime) { return 'Enchanted Riposte'; } // Start combo for Verflare (20%)
  if (level >= 68 && lowerMana >= 80 && higherMana + 11 >= 100) { return 'Enchanted Riposte'; } // Likely to overcapping mana unless combo starts
  if (level >= 2 && level < 68 && lowerMana >= 80) { return 'Enchanted Riposte'; } // Before Verflare/Verholy
  if (level >= 2 && level < 50 && lowerMana >= 55) { return 'Enchanted Riposte'; } // Before Redoublement
  if (level >= 2 && level < 35 && lowerMana >= 30) { return 'Enchanted Riposte'; } // Before Zwerchhau

  let moulinetFloor = 50;
  if (nextAction.targetCount === 1) { moulinetFloor = 40; }

  let repriseFloor = 50;
  // Unbalance mana before Manafication
  if (blackMana !== whiteMana) { repriseFloor = 45; }

  // Calculate how many Reprise/Moulinet can be used and how much time it will take
  const repriseCount = Math.floor(Math.max(lowerMana - repriseFloor, 0) / 5);
  const moulinetCount = Math.floor(Math.max(lowerMana - moulinetFloor, 0) / 20);
  const repriseTime = repriseCount * 2200; // Reprise and Moulinet have set recast times
  const moulinetTime = moulinetCount * 1500;

  // Spend excess mana with Reprise or Moulinet
  // There's probably some improvements that can be made here but I don't know what they are
  if (level >= 76 && repriseTime > 0 && loopRecast.manafication - repriseTime < 1350) { return 'Enchanted Reprise'; }
  if (level >= 60 && moulinetTime > 0 && loopRecast.manafication - moulinetTime < 100) { return 'Enchanted Moulinet'; }

  const lowerProc = Math.min(loopStatus.verfireready, loopStatus.verstoneready);
  const higherProc = Math.max(loopStatus.verfireready, loopStatus.verstoneready);

  let joltPotency = 180;
  let verfirePotency = 270;
  let verthunderiiPotency = 100 * targetCount;

  if (level >= 62) { joltPotency = 280; }
  if (level >= 62) { verfirePotency = 300; }
  if (level >= 78) { verthunderiiPotency = 120 * targetCount; }

  // AOE
  if (level >= 18 && higherProc > gcd && verthunderiiPotency > verfirePotency) {
    if (level >= 22 && blackMana >= whiteMana) { return 'Hardcast Veraero II'; } return 'Hardcast Verthunder II';
  }

  if (level >= 18 && verthunderiiPotency > joltPotency) {
    if (level >= 22 && blackMana >= whiteMana) { return 'Hardcast Veraero II'; } return 'Hardcast Verthunder II';
  }

  // Prevent unbalanced mana
  if (Math.min(blackMana + 9, 100) > whiteMana + 30) {
    if (loopStatus.verstoneready > gcd) { return 'Hardcast Verstone'; }
    if (level >= 62) { return 'Hardcast Jolt II'; }
    return 'Hardcast Jolt';
  }

  if (Math.min(whiteMana + 9, 100) > blackMana + 30) {
    if (loopStatus.verfireready > gcd) { return 'Hardcast Verfire'; }
    if (level >= 62) { return 'Hardcast Jolt II'; }
    return 'Hardcast Jolt';
  }

  // Use proc with less time
  if (lowerProc > gcd && loopStatus.verstoneready < loopStatus.verfireready) { return 'Hardcast Verstone'; }
  if (lowerProc > gcd && loopStatus.verfireready < loopStatus.verstoneready) { return 'Hardcast Verfire'; }

  // Use a proc
  if (loopStatus.verstoneready > gcd) { return 'Hardcast Verstone'; }
  if (loopStatus.verfireready > gcd) { return 'Hardcast Verfire'; }

  // Jolt
  if (level >= 62) { return 'Hardcast Jolt II'; }
  return 'Hardcast Jolt';
};

nextAction.rdmNextOGCD = ({
  weave, weaveMax, mp, comboStep, blackMana, whiteMana, loopRecast, loopStatus,
} = {}) => {
  const { targetCount } = nextActionOverlay;
  const { playerData } = nextActionOverlay;
  const zeroTime = 100 + 1250 * (weave - 1);

  const { level } = playerData;
  const lowerMana = Math.min(blackMana, whiteMana);

  if (level >= 60 && weave === weaveMax && comboStep === '' && loopRecast.manafication < zeroTime) {
    if (targetCount === 1 && lowerMana >= 40) { return 'Manafication'; }
    if (lowerMana >= 50) { return 'Manafication'; }
  }
  if (level >= 56 && targetCount > 1 && loopRecast.contresixte < zeroTime) { return 'Contre Sixte'; }
  if (level >= 45 && loopRecast.fleche < zeroTime) { return 'Fleche'; }
  if (level >= 56 && loopRecast.contresixte < zeroTime) { return 'Contre Sixte'; }
  if (level >= 58 && weave === weaveMax && loopRecast.embolden < zeroTime) { return 'Embolden'; }
  if (level >= 6 && loopRecast.corpsacorps < zeroTime) { return 'Corps-A-Corps'; }
  if (level >= 40 && loopRecast.displacement < zeroTime) {
    if (level >= 72) { return 'Engagement'; }
    if (comboStep !== 'Enchanted Riposte' && comboStep !== 'Enchanted Zwerchhau' && (nextAction.targetCount === 1 || lowerMana < 20) && weave === 1) { return 'Displacement'; }
  }
  // "If < 80|80 Mana & with no procs, fish for proc."
  if (level >= 18 && Math.max(blackMana, whiteMana) < 80 && Math.max(loopStatus.verfireready, loopStatus.verstoneready) < 0 && comboStep === '' && loopRecast.swiftcast < zeroTime) { return 'Swiftcast'; }
  // "If < 60|60 Mana with one proc, fish other proc."
  // This is hard to queue practically without accidentally flubbing Swiftcast 50% of the time
  // if (level >= 18 && Math.max(blackMana, whiteMana) < 60
  // && Math.min(loopStatus.verfireready, loopStatus.verstoneready) < 0 && comboStep === ''
  // && loopRecast.swiftcast < 0) { return 'Swiftcast'; }
  // "If between 60|60 and 80|80 Mana with both procs, do NOT use Acceleration."
  // (So use acceleration before 80 with both procs and before 60 with one proc)
  if (level >= 50 && loopRecast.acceleration < zeroTime) {
    if (Math.max(blackMana, whiteMana) < 80 && comboStep === '' && Math.min(loopStatus.verfireready, loopStatus.verstoneready) < zeroTime) { return 'Acceleration'; }
    if (Math.max(blackMana, whiteMana) < 60 && comboStep === '') { return 'Acceleration'; }
  }
  if (level >= 24 && mp < 8000 && loopRecast.luciddreaming < zeroTime) { return 'Lucid Dreaming'; }
  return '';
};

nextAction.rdmActionMatch = (actionMatch) => {
  // No let declarations here - everything needs to modify current snapshot
  const { removeStatus } = nextActionOverlay;

  const { weaponskills } = nextAction.actionData;
  const { spells } = nextAction.actionData;
  const { abilities } = nextAction.actionData;
  const { gcd } = nextActionOverlay;

  const { addRecast } = nextActionOverlay;
  const { duration } = nextActionOverlay;
  const { recast } = nextActionOverlay;

  // const { checkRecast } = nextActionOverlay;
  const { checkStatus } = nextActionOverlay;
  const { addStatus } = nextActionOverlay;

  const singletargetActions = [
    'Jolt', 'Jolt II', 'Verfire', 'Verstone',
    'Verthunder', 'Veraero',
    'Enchanted Riposte', 'Riposte',
    'Enchanted Zwerchhau', 'Zwerchhau',
    'Enchanted Redoublement', 'Redoublement',
    'Enchanted Reprise', 'Reprise',
  ];

  const multitargetActions = [
    'Verthunder II', 'Veraero II', 'Scatter', 'Impact',
    'Moulinet', 'Enchanted Moulinet',
    'Contre Sixte',
  ];

  const { actionName } = actionMatch.groups;

  if (singletargetActions.includes(actionName)) {
    // Two ST actions in a row brings it to 1
    if (nextAction.targetCount > 2) {
      nextAction.targetCount = 2;
    } else { nextAction.targetCount = 1; }
  } else
  if (multitargetActions.includes(actionName) && actionMatch.groups.logType === '15') {
    // Multi target only hits single target
    nextAction.targetCount = 1;
  }

  if (weaponskills.includes(actionName)) {
    nextAction.NEWremoveIcon({ name: actionName });

    // Set combo status/step
    // Spells also break combo - handled by the casting match section
    if ((level >= 35 && actionName === 'Enchanted Riposte')
    || (level >= 50 && actionName === 'Enchanted Zwerchhau')
    || (level >= 68 && actionName === 'Enchanted Redoublement')
    || (level >= 80 && ['Verflare', 'Verholy'].includes(actionName))) {
      addStatus({ statusName: 'Combo' });
      nextAction.comboStep = actionName;
    } else {
      removeStatus({ statusName: 'Combo' });
      nextAction.comboStep = '';
    }

    // Call next function with appropriate GCD time
    if (['Enchanted Riposte', 'Enchanted Zwerchhau', 'Enchanted Moulinet'].includes(actionName)) { nextAction.rdmNextAction({ delay: 1500 }); } else
    if (['Enchanted Redoublement', 'Enchanted Reprise'].includes(actionName)) {
      nextAction.rdmNextAction({ delay: 2200 });
    } else { nextAction.rdmNextAction({ delay: gcd }); }
  } else
  if (spells.includes(actionName)) {
    if (checkStatus({ statusName: 'Dualcast' }) < 0 && checkStatus({ statusName: 'Swiftcast' }) < 0) {
      nextAction.NEWremoveIcon({ name: `Hardcast ${actionName}` });
    } else { nextAction.NEWremoveIcon({ name: `Dualcast ${actionName}` }); }
  } else
  if (abilities.includes(actionName)) {
    nextAction.NEWremoveIcon({ name: actionName });
    const propertyName = actionName.replace(/[\s':-]/g, '').toLowerCase();
    if (recast[propertyName]) { addRecast({ actionName }); }
    if (duration[propertyName]) { addStatus({ statusName: actionName }); }
    if (actionName === 'Acceleration') { nextAction.accelerationCount = 3; } else
    if (actionName === 'Manafication') {
      addRecast({ actionName: 'Corps-A-Corps', recast: -1 });
      addRecast({ actionName: 'Displacement', recast: -1 });
      nextAction.rdmNextAction();
    } else
    if (actionName === 'Engagement') {
      addRecast({ actionName: 'Displacement' }); // Set Displacement cooldown with Engagement
    }
    // console.log(actionName + ' ' + checkRecast({ actionName: actionName }));
  }
};

nextAction.rdmStatusMatch = (statusMatch) => {
  // No let declarations here - everything needs to modify current snapshot
  const { statusName } = statusMatch.groups;
  const { statusDuration } = statusMatch.groups;
  const { gcd } = nextActionOverlay;

  // Control Dualcast/Swiftcast flow from here because it's a lot easier
  if (statusMatch.groups.logType === '1A') {
    nextAction.addStatus({ statusName, duration: parseFloat(statusDuration) * 1000 });

    // if (statusName === 'Dualcast') {
    //   // nextAction.NEWremoveIcon({ name: 'Hardcast ', match: 'contains' });
    //   // nextAction.rdmNextAction();
    // } else
    if (statusName === 'Verfire Ready') {
      nextAction.rdmNextAction({ delay: gcd });
    } else
    if (statusName === 'Verstone Ready') {
      nextAction.rdmNextAction({ delay: gcd });
    // } else
    // if (statusName === 'Swiftcast') {
    //   // nextAction.rdmNextAction();
    }
    // Acceleration 'gains' a new line every time a stack is used
  } else {
    nextAction.removeStatus({ statusName });

    if (['Dualcast', 'Swiftcast'].includes(statusMatch.groups.statusName)) {
      nextAction.NEWremoveIcon({ name: 'Dualcast ', match: 'contains' });
      nextAction.rdmNextAction({ delay: gcd });
    } else
    if (statusName === 'Acceleration') { nextAction.accelerationCount = 0; }
  }
};

nextAction.rdmCastingMatch = (castingMatch) => {
  // No let declarations here - everything needs to modify current snapshot
  // Casting breaks combo
  nextAction.comboStep = '';
  nextAction.removeStatus({ statusName: 'Combo' });

  nextAction.rdmNextAction({ casting: castingMatch.groups.actionName });
  nextAction.NEWfadeIcon({ name: `Hardcast ${castingMatch.groups.actionName}` });
};

nextAction.rdmCancelMatch = (cancelMatch) => {
  // No let declarations here - everything needs to modify current snapshot
  nextAction.NEWunfadeIcon({ name: `Hardcast ${cancelMatch.groups.actionName}` });
  nextAction.rdmNextAction();
};
