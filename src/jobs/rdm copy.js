/* global nextAction */

nextAction.RDM = () => {
  const { level } = nextAction.player;

  // Filter actions
  nextAction.actionList = nextAction.actionData.filter((e) => (e.affinity === 'RDM' || e.affinity === 'Magical Ranged DPS') && e.level <= level);

  // Modify based on traits
  if (level >= 74) {
    const i = nextAction.actionList.findIndex((e) => e.name === 'Manafication');
    nextAction.actionData[i].recast = 110000;
  }

  if (level >= 78) {
    const i = nextAction.actionList.findIndex((e) => e.name === 'Contre Sixte');
    nextAction.actionData[i].recast = 35000;
  }

  nextAction.nextAction = nextAction.rdmNextAction;
  nextAction.playerChanged = nextAction.rdmPlayerChanged;
};

nextAction.rdmPlayerChanged = (e) => {
  nextAction.player.MP = e.detail.currentMP;
  nextAction.player.blackMana = e.detail.jobDetail.blackMana;
  nextAction.player.whiteMana = e.detail.jobDetail.whiteMana;
};

nextAction.rdmTargetChanged = () => {
  nextAction.rdmNextAction();
};

nextAction.rdmNextLoop = ({
  delay = 0, casting, // Use for calling function during casting
} = {}) => {
  // Static values
  const { setRecast } = nextAction;
  const { getRecast } = nextAction;
  const { getStatusStacks } = nextAction;
  const { getStatusDuration } = nextAction;
  const { gcd } = nextAction.player; // RDM has static GCD
  const { level } = nextAction.player;

  // Snapshot of current character
  let { comboStep } = nextAction;
  let accelerationCount = getStatusStacks({ name: 'Acceleration' });
  let { blackMana } = nextAction.player;
  let { whiteMana } = nextAction.player;

  // Set up object for tracking recast times in loops
  const loopRecast = {};
  const loopRecastList = nextAction.actionList.filter((e) => (e.recast));

  // Set up object for tracking status effects in loops (same as above)
  const loopStatus = {};
  const loopStatusList = 
  loopStatusList.forEach((statusName) => {
    const propertyName = statusName.replace(/[\s':-]/g, '').toLowerCase();
    loopStatus[propertyName] = checkStatus({ statusName });
  });

  // Add target statuses here if needed

  // Clear icon array
  const actionArray = [];

  // Initial values for loop control
  let gcdTime = delay; // Time till next GCD action (or GCD length, whatever)
  let nextTime = 0; // Amount of time looked ahead in loop
  const nextMaxTime = 15000; // Maximum predict time

  // Start loop
  while (nextTime < nextMaxTime) {
    let loopTime = 0; // Tracks of how "long" the current loop takes
    if (gcdTime === 0) {
      // Special case for entering loop when casting
      let nextGCD = '';
      if (nextTime === 0 && casting) {
        // If casting, current spell is first GCD
        nextGCD = `Hardcast ${casting}`;
      } else {
        nextGCD = nextAction.rdmNextGCD({
          comboStep, blackmana, whitemana, loopRecast, loopStatus,
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
      if (blackmana < whitemana && nextGCD === 'Verflare') { loopStatus.verfireready = duration.verfireready; } else
      if (whitemana < blackmana && nextGCD === 'Verholy') { loopStatus.verstoneready = duration.verstoneready; } else
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
      if (nextGCD.endsWith(' Jolt') || nextGCD.endsWith(' Jolt II')) { blackmana += 3; whitemana += 3; } else
      if (nextGCD.endsWith(' Verthunder')) { blackmana += 11; } else
      if (nextGCD.endsWith(' Veraero')) { whitemana += 11; } else
      if (nextGCD.endsWith(' Scatter') || nextGCD.endsWith(' Impact')) { blackmana += 3; whitemana += 3; } else
      if (nextGCD.endsWith(' Verthunder II')) { blackmana += 7; } else
      if (nextGCD.endsWith(' Veraero II')) { whitemana += 7; } else
      if (nextGCD.endsWith(' Verfire')) { blackmana += 9; } else
      if (nextGCD.endsWith(' Verstone')) { whitemana += 9; } else

      if (nextGCD === 'Enchanted Riposte') { blackmana -= 30; whitemana -= 30; } else
      if (nextGCD === 'Enchanted Zwerchhau') { blackmana -= 25; whitemana -= 25; } else
      if (nextGCD === 'Enchanted Redoublement') { blackmana -= 25; whitemana -= 25; } else
      if (nextGCD === 'Enchanted Moulinet') { blackmana -= 20; whitemana -= 20; } else
      if (nextGCD === 'Verflare') { blackmana += 21; } else
      if (nextGCD === 'Verholy') { whitemana += 21; } else
      if (nextGCD === 'Enchanted Reprise') { blackmana -= 5; whitemana -= 5; } else
      if (nextGCD === 'Scorch') { blackmana += 7; whitemana += 7; }

      // Fix mana
      if (blackmana > 100) { blackmana = 100; } else if (blackmana < 0) { blackmana = 0; }
      if (whitemana > 100) { whitemana = 100; } else if (whitemana < 0) { whitemana = 0; }

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
        gcdTime = gcd;
        loopTime += gcdTime;
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
        weave, weaveMax, comboStep, blackmana, whitemana, loopRecast, loopStatus,
        // Put MP in later?
        // weave, weaveMax, mp, comboStep, blackmana, whitemana, loopRecast, loopStatus,
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
          blackmana = Math.min(blackmana * 2, 100);
          whitemana = Math.min(whitemana * 2, 100);
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

nextAction.rdmNextGCD = ({
  comboStep, blackmana, whitemana, loopRecast, loopStatus,
} = {}) => {
  const { gcd } = nextActionOverlay;
  const { level } = nextAction.playerData;
  const { targetCount } = nextActionOverlay;
  const lowerMana = Math.min(blackmana, whitemana);
  const higherMana = Math.max(blackmana, whitemana);
  const comboTime = 1500 * 2 + 2200 + gcd * 3;

  let verthunderPotency = 310;
  if (level >= 62) { verthunderPotency = 370; }

  let scatterPotency = 120 * targetCount;
  if (level >= 78) { scatterPotency = 220 * targetCount; }

  // Use Dualcast/Swiftcast if up
  if (loopStatus.dualcast > 0 || loopStatus.swiftcast > 0) {
    // AoE
    if (level >= 15 && scatterPotency > verthunderPotency) { return 'Dualcast Scatter'; }

    // Prevent unbalanced mana
    if (level >= 10 && Math.min(blackmana + 11, 100) > whitemana + 30) { return 'Dualcast Veraero'; }
    if (level >= 4 && Math.min(whitemana + 11, 100) > blackmana + 30) { return 'Dualcast Verthunder'; }

    // Setup for Verflare/Verholy
    if (level >= 70 && loopStatus.verstoneready < comboTime
    && Math.min(blackmana + 11, 100) > whitemana && whitemana >= 80) {
      return 'Dualcast Verthunder';
    }
    if (level >= 68 && loopStatus.verfireready < comboTime
    && Math.min(whitemana + 11, 100) > blackmana && blackmana >= 80) {
      return 'Dualcast Veraero';
    }

    // Avoid overwriting
    if (loopStatus.verfireready > gcd) { return 'Dualcast Veraero'; }
    if (loopStatus.verstoneready > gcd) { return 'Dualcast Verthunder'; }

    // All other cases (I hope)
    if (level >= 10 && blackmana >= whitemana) { return 'Dualcast Veraero'; }
    if (level >= 4) { return 'Dualcast Verthunder'; }
    if (level >= 62) { return 'Dualcast Jolt II'; }
    return 'Dualcast Jolt';
  }

  // Always Scorch
  if (level >= 80 && ['Verflare', 'Verholy'].includes(comboStep)) { return 'Scorch'; }

  // If it will unbalance, do the other one
  if (level >= 70 && blackmana + 21 > whitemana + 30 && comboStep === 'Enchanted Redoublement') { return 'Verholy'; }
  if (level >= 68 && whitemana + 21 > blackmana + 30 && comboStep === 'Enchanted Redoublement') { return 'Verflare'; }

  // 100% proc (without overwriting)
  if (level >= 70 && loopStatus.verstoneready < gcd && blackmana > whitemana && comboStep === 'Enchanted Redoublement') { return 'Verholy'; }
  if (level >= 68 && loopStatus.verfireready < gcd && whitemana > blackmana && comboStep === 'Enchanted Redoublement') { return 'Verflare'; }

  // 20% proc
  if (level >= 70 && loopStatus.verstoneready < gcd && comboStep === 'Enchanted Redoublement') { return 'Verholy'; }
  if (level >= 68 && loopStatus.verfireready < gcd && comboStep === 'Enchanted Redoublement') { return 'Verflare'; }

  // Procs not possible(?) - attempt to keep mana levels close
  if (level >= 70 && blackmana >= whitemana && comboStep === 'Enchanted Redoublement') { return 'Verholy'; }
  if (level >= 68 && whitemana >= blackmana && comboStep === 'Enchanted Redoublement') { return 'Verflare'; }

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
  && lowerMana >= 80 && blackmana > whitemana) {
    return 'Enchanted Riposte';
  } // Start combo for Verholy
  if (level >= 68 && loopStatus.verfireready < comboTime
  && lowerMana >= 80 && whitemana > blackmana) {
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
  if (blackmana !== whitemana) { repriseFloor = 45; }

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
    if (level >= 22 && blackmana >= whitemana) { return 'Hardcast Veraero II'; } return 'Hardcast Verthunder II';
  }

  if (level >= 18 && verthunderiiPotency > joltPotency) {
    if (level >= 22 && blackmana >= whitemana) { return 'Hardcast Veraero II'; } return 'Hardcast Verthunder II';
  }

  // Prevent unbalanced mana
  if (Math.min(blackmana + 9, 100) > whitemana + 30) {
    if (loopStatus.verstoneready > gcd) { return 'Hardcast Verstone'; }
    if (level >= 62) { return 'Hardcast Jolt II'; }
    return 'Hardcast Jolt';
  }

  if (Math.min(whitemana + 9, 100) > blackmana + 30) {
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
  weave, weaveMax, mp, comboStep, blackmana, whitemana, loopRecast, loopStatus,
} = {}) => {
  const { targetCount } = nextActionOverlay;
  const { playerData } = nextActionOverlay;
  const zeroTime = 100 + 1250 * (weave - 1);

  const { level } = playerData;
  const lowerMana = Math.min(blackmana, whitemana);

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
  if (level >= 18 && Math.max(blackmana, whitemana) < 80 && Math.max(loopStatus.verfireready, loopStatus.verstoneready) < 0 && comboStep === '' && loopRecast.swiftcast < zeroTime) { return 'Swiftcast'; }
  // "If < 60|60 Mana with one proc, fish other proc."
  // This is hard to queue practically without accidentally flubbing Swiftcast 50% of the time
  // if (level >= 18 && Math.max(blackmana, whitemana) < 60
  // && Math.min(loopStatus.verfireready, loopStatus.verstoneready) < 0 && comboStep === ''
  // && loopRecast.swiftcast < 0) { return 'Swiftcast'; }
  // "If between 60|60 and 80|80 Mana with both procs, do NOT use Acceleration."
  // (So use acceleration before 80 with both procs and before 60 with one proc)
  if (level >= 50 && loopRecast.acceleration < zeroTime) {
    if (Math.max(blackmana, whitemana) < 80 && comboStep === '' && Math.min(loopStatus.verfireready, loopStatus.verstoneready) < zeroTime) { return 'Acceleration'; }
    if (Math.max(blackmana, whitemana) < 60 && comboStep === '') { return 'Acceleration'; }
  }
  if (level >= 24 && mp < 8000 && loopRecast.luciddreaming < zeroTime) { return 'Lucid Dreaming'; }
  return '';
};

nextAction.rdmActionMatch = (actionMatch) => {
  // No let declarations here - everything needs to modify current snapshot
  const { removeStatus } = nextActionOverlay;

  const { weaponskills } = nextAction.actionList;
  const { spells } = nextAction.actionList;
  const { abilities } = nextAction.actionList;
  const { level } = nextAction.playerData;
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
