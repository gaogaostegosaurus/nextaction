nextActionOverlay.rdmJobChange = () => {
  const { level } = nextActionOverlay.playerData;

  // Set initial values
  nextActionOverlay.comboStep = '';

  nextActionOverlay.actionList.weaponskills = [
    // Yes, some are technically not weaponskills, but close enough I don't care
    'Riposte', 'Enchanted Riposte',
    'Zwerchhau', 'Enchanted Zwerchhau',
    'Redoublement', 'Enchanted Redoublement',
    'Verflare', 'Verholy', 'Scorch',
    'Moulinet', 'Enchanted Moulinet',
    'Reprise', 'Enchanted Reprise',
  ];

  nextActionOverlay.actionList.spells = [
    'Jolt', 'Jolt II', 'Verfire', 'Verstone', 'Verthunder II', 'Veraero II',
    'Verthunder', 'Veraero', 'Scatter', 'Impact',
    'Vercure', 'Veraise',
  ];

  nextActionOverlay.actionList.abilities = [
    'Corps-A-Corps', 'Displacement', 'Fleche', 'Acceleration',
    'Contre Sixte', 'Embolden', 'Manafication',
    'Engagement',
    'Swiftcast', 'Lucid Dreaming',
  ];

  // Easier/more accurate controlling this via the buffs
  // I think that means it won't work in Eureka but screw Eureka

  nextActionOverlay.statusList.self = [
    'Dualcast',
    'Verfire Ready', 'Verstone Ready',
    'Acceleration', 'Manafication',
    'Swiftcast',
  ];

  nextActionOverlay.castingList.spells = nextActionOverlay.actionList.spells;

  const { recast } = nextActionOverlay;

  recast.corpsacorps = 40000;
  recast.displacement = 35000;
  recast.fleche = 25000;
  recast.acceleration = 55000;
  recast.contresixte = 45000;
  recast.embolden = 120000;
  recast.manafication = 120000;
  recast.engagement = recast.displacement;

  if (level >= 74) { recast.manafication = 110000; }
  if (level >= 78) { recast.contresixte = 35000; }

  const { duration } = nextActionOverlay;

  duration.dualcast = 15000;
  duration.verfireready = 30000;
  duration.verstoneready = duration.verfireready;
  duration.manafication = 10000;
  duration.acceleration = 20000;

  const { icon } = nextActionOverlay;

  icon.jolt = '003202';
  icon.verthunder = '003203';
  icon.corpsacorps = '003204';
  icon.veraero = '003205';
  icon.scatter = '003207';
  icon.verfire = '003208';
  icon.verstone = '003209';
  icon.displacement = '003211';
  icon.fleche = '003212';
  icon.acceleration = '003214';
  icon.vercure = '003216';
  icon.contresixte = '003217';
  icon.embolden = '003218';
  icon.manafication = '003219';
  icon.joltii = '003220';
  icon.verraise = '003221';
  icon.impact = '003222';
  icon.verflare = '003223';
  icon.verholy = '003224';
  icon.enchantedriposte = '003225';
  icon.enchantedzwerchhau = '003226';
  icon.enchantedredoublement = '003227';
  icon.enchantedmoulinet = '003228';
  icon.verthunderii = '003229';
  icon.veraeroii = '003230';
  icon.engagement = '003231';
  icon.enchantedreprise = '003232';
  icon.scorch = '003234';

  if (level >= 62) { icon.jolt = icon.joltii; }
  if (level >= 66) { icon.scatter = icon.impact; }

  icon.hardcastjolt = icon.jolt;
  icon.hardcastverthunder = icon.verthunder;
  icon.hardcastveraero = icon.veraero;
  icon.hardcastscatter = icon.scatter;
  icon.hardcastverfire = icon.verfire;
  icon.hardcastverstone = icon.verstone;
  icon.hardcastvercure = icon.vercure;
  icon.hardcastjoltii = icon.joltii;
  icon.hardcastverraise = icon.verraise;
  icon.hardcastimpact = icon.impact;
  icon.hardcastverthunderii = icon.verthunderii;
  icon.hardcastveraeroii = icon.veraeroii;

  icon.dualcastjolt = icon.jolt;
  icon.dualcastverthunder = icon.verthunder;
  icon.dualcastveraero = icon.veraero;
  icon.dualcastscatter = icon.scatter;
  icon.dualcastimpact = icon.impact;

  icon.swiftcastjolt = icon.jolt;
  icon.swiftcastverthunder = icon.verthunder;
  icon.swiftcastveraero = icon.veraero;
  icon.swiftcastscatter = icon.scatter;
  icon.swiftcastimpact = icon.impact;

  nextActionOverlay.magicdpsRoleChange();
}; // Keep collapsed, usually

nextActionOverlay.rdmPlayerChange = (e) => {
  nextActionOverlay.playerData.mp = e.detail.currentMP;
  nextActionOverlay.playerData.blackmana = e.detail.jobDetail.blackMana;
  nextActionOverlay.playerData.whitemana = e.detail.jobDetail.whiteMana;
};

nextActionOverlay.rdmTargetChange = () => {
  nextActionOverlay.rdmNextAction();
};

nextActionOverlay.rdmNextAction = ({
  delay = 0, casting, // Use for calling function during casting
} = {}) => {
  // Static values
  const { checkRecast } = nextActionOverlay;
  const { checkStatus } = nextActionOverlay;
  const { duration } = nextActionOverlay;
  const { recast } = nextActionOverlay;
  const { gcd } = nextActionOverlay; // RDM has static GCD
  const { level } = nextActionOverlay.playerData;

  // Snapshot of current character
  let { comboStep } = nextActionOverlay;
  let { accelerationCount } = nextActionOverlay;
  let { blackmana } = nextActionOverlay.playerData;
  let { whitemana } = nextActionOverlay.playerData;

  // Set up object for tracking recast times in loops
  const loopRecast = {};
  // loopRecastList array contains all abilities that have recast, concat extra stuff here as needed
  const loopRecastList = nextActionOverlay.actionList.abilities;
  loopRecastList.forEach((actionName) => {
    const propertyName = actionName.replace(/[\s':-]/g, '').toLowerCase();
    loopRecast[propertyName] = checkRecast({ actionName });
  });

  // Set up object for tracking status effects in loops (same as above)
  const loopStatus = {};
  const loopStatusList = nextActionOverlay.statusList.self.concat(['Combo']);
  loopStatusList.forEach((statusName) => {
    const propertyName = statusName.replace(/[\s':-]/g, '').toLowerCase();
    loopStatus[propertyName] = checkStatus({ statusName });
  });

  // Add target statuses here if needed

  // Clear icon array
  const iconArray = [];

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
        nextGCD = nextActionOverlay.rdmNextGCD({
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

    Object.keys(loopRecast).forEach((property) => {
      loopRecast[property] = Math.max(loopRecast[property] - loopTime, -1);
    });
    Object.keys(loopStatus).forEach((property) => {
      loopStatus[property] = Math.max(loopStatus[property] - loopTime, -1);
    });

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

    let weave = 1; let weaveMax = 0;
    if (gcdTime > 2200) { weaveMax = 2; } else
    if (gcdTime >= 1500) { weaveMax = 1; }

    // Second loop for OGCDs
    while (weave <= weaveMax) {
      const nextOGCD = nextActionOverlay.rdmNextOGCD({
        weave, weaveMax, comboStep, blackmana, whitemana, loopRecast, loopStatus,
        // Put MP in later
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
          loopRecast.displacement = recast.displacement;
        }
      }

      weave += 1; // Increment regardless if OGCD was added; some skills only go on weave 2
    }

    gcdTime = 0; // Zero out for next GCD
    nextTime += loopTime;
  }

  nextActionOverlay.NEWsyncIcons({ iconArray });

  // Refresh after a few GCDs if nothing's happening
  clearTimeout(nextActionOverlay.timeout.nextAction); // Keep this the same across jobs
  nextActionOverlay.timeout.nextAction = setTimeout(
    nextActionOverlay.rdmNextAction, gcd * 2, // 2 GCDs seems like a good number... maybe 3?
  );
};

nextActionOverlay.rdmNextGCD = ({
  comboStep, blackmana, whitemana, loopRecast, loopStatus,
} = {}) => {
  const { gcd } = nextActionOverlay;
  const { level } = nextActionOverlay.playerData;
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
  if (nextActionOverlay.targetCount === 1) { moulinetFloor = 40; }

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
  if (level >= 76 && repriseTime > Math.max(loopRecast.manafication, 0)) { return 'Enchanted Reprise'; }
  if (level >= 60 && moulinetTime > Math.max(loopRecast.manafication, 0)) { return 'Enchanted Moulinet'; }

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

nextActionOverlay.rdmNextOGCD = ({
  weave, weaveMax, mp, comboStep, blackmana, whitemana, loopRecast, loopStatus,
} = {}) => {
  const { targetCount } = nextActionOverlay;
  const { playerData } = nextActionOverlay;

  const { level } = playerData;
  const lowerMana = Math.min(blackmana, whitemana);

  if (level >= 60 && targetCount === 1 && comboStep === '' && lowerMana >= 40 && weave === weaveMax && loopRecast.manafication < 0) {
    return 'Manafication';
  }
  if (level >= 60 && comboStep === '' && lowerMana >= 50 && weave === weaveMax && loopRecast.manafication < 0) {
    return 'Manafication';
  } if (level >= 56 && targetCount > 1 && loopRecast.contresixte < 0) {
    return 'Contre Sixte';
  } if (level >= 45 && loopRecast.fleche < 0) {
    return 'Fleche';
  } if (level >= 56 && loopRecast.contresixte < 0) {
    return 'Contre Sixte';
  } if (level >= 58 && weave === weaveMax && loopRecast.embolden < 0) {
    return 'Embolden';
  } if (level >= 6 && loopRecast.corpsacorps < 0) {
    return 'Corps-A-Corps';
  } if (level >= 72 && loopRecast.displacement < 0) {
    return 'Engagement';
  } if (level >= 40 && comboStep !== 'Enchanted Riposte' && comboStep !== 'Enchanted Zwerchhau'
  && (nextActionOverlay.targetCount === 1 || lowerMana < 20) && weave === 1
  && loopRecast.displacement < 0) {
    return 'Displacement';
  }
  // "If < 80|80 Mana & with no procs, fish for proc."
  if (level >= 18 && Math.max(blackmana, whitemana) < 80
  && Math.max(loopStatus.verfireready, loopStatus.verstoneready) < 0 && comboStep === ''
  && loopRecast.swiftcast < 0) { return 'Swiftcast'; }
  // "If < 60|60 Mana with one proc, fish other proc."
  // This is hard to queue practically without accidentally flubbing Swiftcast 50% of the time
  // if (level >= 18 && Math.max(blackmana, whitemana) < 60
  // && Math.min(loopStatus.verfireready, loopStatus.verstoneready) < 0 && comboStep === ''
  // && loopRecast.swiftcast < 0) { return 'Swiftcast'; }
  // "If between 60|60 and 80|80 Mana with both procs, do NOT use Acceleration."
  // (So use acceleration before 80 with both procs and before 60 with one proc)
  if (loopRecast.acceleration < 0 && Math.max(blackmana, whitemana) < 80 && comboStep === ''
  && Math.min(loopStatus.verfireready, loopStatus.verstoneready) < 0) { return 'Acceleration'; }
  if (loopRecast.acceleration < 0 && Math.max(blackmana, whitemana) < 60
  && comboStep === '') { return 'Acceleration'; }
  if (level >= 24 && mp < 8000 && loopRecast.luciddreaming < 0) { return 'Lucid Dreaming'; }
  return '';
};

nextActionOverlay.rdmActionMatch = (actionMatch) => {
  // No let declarations here - everything needs to modify current snapshot
  const { removeStatus } = nextActionOverlay;

  const { weaponskills } = nextActionOverlay.actionList;
  const { spells } = nextActionOverlay.actionList;
  const { abilities } = nextActionOverlay.actionList;
  const { level } = nextActionOverlay.playerData;
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
    if (nextActionOverlay.targetCount > 2) {
      nextActionOverlay.targetCount = 2;
    } else { nextActionOverlay.targetCount = 1; }
  } else
  if (multitargetActions.includes(actionName) && actionMatch.groups.logType === '15') {
    // Multi target only hits single target
    nextActionOverlay.targetCount = 1;
  }

  if (weaponskills.includes(actionName)) {
    nextActionOverlay.NEWremoveIcon({ name: actionName });

    // Set combo status/step
    // Spells also break combo - handled by the casting match section
    if ((level >= 35 && actionName === 'Enchanted Riposte')
    || (level >= 50 && actionName === 'Enchanted Zwerchhau')
    || (level >= 68 && actionName === 'Enchanted Redoublement')
    || (level >= 80 && ['Verflare', 'Verholy'].includes(actionName))) {
      addStatus({ statusName: 'Combo' });
      nextActionOverlay.comboStep = actionName;
    } else {
      removeStatus({ statusName: 'Combo' });
      nextActionOverlay.comboStep = '';
    }

    // Call next function with appropriate GCD time
    if (['Enchanted Riposte', 'Enchanted Zwerchhau', 'Enchanted Moulinet'].includes(actionName)) { nextActionOverlay.rdmNextAction({ delay: 1500 }); } else
    if (['Enchanted Redoublement', 'Enchanted Reprise'].includes(actionName)) {
      nextActionOverlay.rdmNextAction({ delay: 2200 });
    } else { nextActionOverlay.rdmNextAction({ delay: gcd }); }
  } else
  if (spells.includes(actionName)) {
    if (checkStatus({ statusName: 'Dualcast' }) < 0 && checkStatus({ statusName: 'Swiftcast' }) < 0) {
      nextActionOverlay.NEWremoveIcon({ name: `Hardcast ${actionName}` });
    } else { nextActionOverlay.NEWremoveIcon({ name: `Dualcast ${actionName}` }); }
  } else
  if (abilities.includes(actionName)) {
    nextActionOverlay.NEWremoveIcon({ name: actionName });
    const propertyName = actionName.replace(/[\s':-]/g, '').toLowerCase();
    if (recast[propertyName]) { addRecast({ actionName }); }
    if (duration[propertyName]) { addStatus({ statusName: actionName }); }
    if (actionName === 'Acceleration') { nextActionOverlay.accelerationCount = 3; } else
    if (actionName === 'Manafication') {
      addRecast({ actionName: 'Corps-A-Corps', recast: -1 });
      addRecast({ actionName: 'Displacement', recast: -1 });
      nextActionOverlay.rdmNextAction();
    } else
    if (actionName === 'Engagement') {
      addRecast({ actionName: 'Displacement' }); // Set Displacement cooldown with Engagement
    }
    // console.log(actionName + ' ' + checkRecast({ actionName: actionName }));
  }
};

nextActionOverlay.rdmStatusMatch = (statusMatch) => {
  // No let declarations here - everything needs to modify current snapshot
  const { statusName } = statusMatch.groups;
  const { statusDuration } = statusMatch.groups;
  const { gcd } = nextActionOverlay;

  // Control Dualcast/Swiftcast flow from here because it's a lot easier
  if (statusMatch.groups.logType === '1A') {
    nextActionOverlay.addStatus({ statusName, duration: parseFloat(statusDuration) * 1000 });

    // if (statusName === 'Dualcast') {
    //   // nextActionOverlay.NEWremoveIcon({ name: 'Hardcast ', match: 'contains' });
    //   // nextActionOverlay.rdmNextAction();
    // } else
    if (statusName === 'Verfire Ready') {
      nextActionOverlay.rdmNextAction({ delay: gcd });
    } else
    if (statusName === 'Verstone Ready') {
      nextActionOverlay.rdmNextAction({ delay: gcd });
    // } else
    // if (statusName === 'Swiftcast') {
    //   // nextActionOverlay.rdmNextAction();
    }
    // Acceleration 'gains' a new line every time a stack is used
  } else {
    nextActionOverlay.removeStatus({ statusName });

    if (['Dualcast', 'Swiftcast'].includes(statusMatch.groups.statusName)) {
      nextActionOverlay.NEWremoveIcon({ name: 'Dualcast ', match: 'contains' });
      nextActionOverlay.rdmNextAction({ delay: gcd });
    } else
    if (statusName === 'Acceleration') { nextActionOverlay.accelerationCount = 0; }
  }
};

nextActionOverlay.rdmCastingMatch = (castingMatch) => {
  // No let declarations here - everything needs to modify current snapshot
  // Casting breaks combo
  nextActionOverlay.comboStep = '';
  nextActionOverlay.removeStatus({ statusName: 'Combo' });

  nextActionOverlay.rdmNextAction({ casting: castingMatch.groups.actionName });
  nextActionOverlay.NEWfadeIcon({ name: `Hardcast ${castingMatch.groups.actionName}` });
};

nextActionOverlay.rdmCancelMatch = (cancelMatch) => {
  // No let declarations here - everything needs to modify current snapshot
  nextActionOverlay.NEWunfadeIcon({ name: `Hardcast ${cancelMatch.groups.actionName}` });
  nextActionOverlay.rdmNextAction();
};
