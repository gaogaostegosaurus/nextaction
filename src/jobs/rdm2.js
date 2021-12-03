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
    nextAction.actionList[i].status = 'Manafication';
  }

  if (level >= 78) {
    let i = nextAction.actionList.findIndex((e) => e.name === 'Contre Sixte');
    nextAction.actionList[i].recast = 35000;
    i = nextAction.actionList.findIndex((e) => e.name === 'Verthunder II');
    nextAction.actionList[i].potency = 120;
    i = nextAction.actionList.findIndex((e) => e.name === 'Veraero II');
    nextAction.actionList[i].potency = 120;
  }

  if (level >= 88) {
    const i = nextAction.actionList.findIndex((e) => e.name === 'Acceleration');
    nextAction.actionList[i].charges = 2;
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

nextAction.actionLoop = ({
  delay = 0, // Call with this to allow OGCDs to fill next slots
  casting, // Use for calling function during casting
} = {}) => {
  // Static values
  const { addRecast } = nextAction;
  const { getRecast } = nextAction;
  const { addStatus } = nextAction;
  const { removeStatus } = nextAction;
  const { getStatusStacks } = nextAction;
  const { getStatusDuration } = nextAction;

  const { getActionData } = nextAction;

  // Clone arrays/objects useful for loop
  const loopPlayerData = { ...nextAction.playerData };
  const loopRecastList = [...nextAction.recastList];
  const loopStatusList = [...nextAction.statusList];

  const actionArray = [];

  // Initial values for loop control
  let gcdDelay = delay; // Time till next GCD action (or GCD length, whatever)
  let nextTime = 0; // Amount of time looked ahead in loop
  const maxTime = 240000; // Maximum predict time

  // Start loop
  while (nextTime < maxTime) {
    let nextGCD;
    let loopTime = 0; // Tracks of how "long" the current loop takes
    if (nextTime === 0 && casting) {
      nextGCD = casting;
      // If casting, current spell is first GCD
      actionArray.push({ name: nextGCD, casting: true });
    } else if (gcdDelay === 0) {
      nextGCD = nextAction.rdmNextGCD({ loopPlayerData, loopRecastList, loopStatusList });
    }

    loopPlayerData.mp -= getActionData({ name: nextGCD, data: 'mpCost' });

    loopPlayerData.blackMana += getActionData({ name: nextGCD, data: 'blackMana' });
    loopPlayerData.whiteMana += getActionData({ name: nextGCD, data: 'whiteMana' });

    loopPlayerData.blackMana -= getActionData({ name: nextGCD, data: 'manaCost' });
    loopPlayerData.whiteMana -= getActionData({ name: nextGCD, data: 'manaCost' });

    loopPlayerData.manaStacks += getActionData({ name: nextGCD, data: 'manaStacks' });
    loopPlayerData.manaStacks -= getActionData({ name: nextGCD, data: 'manaStackCost' });

    if (actionList.some((e) => e.comboAction.includes(nextGCD))) {
      addStatus({ name: 'Combo ', array: loopStatusArray });
    } else {
      removeStatus({ name: 'Combo ', array: loopStatusArray });
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
    if (nextGCD.startsWith('Hardcast ')) { loopStatus.dualcast = duration.dualcast; } else { loopTime = gcdTime; }

    // Update Combo status
    if (comboAction === '' || loopStatus.combo < 0) {
      comboAction = '';
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
        weave, weaveMax, comboAction, blackMana, whiteMana, loopRecast, loopStatus,
        // Put MP in later?
        // weave, weaveMax, mp, comboAction, blackMana, whiteMana, loopRecast, loopStatus,
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

nextAction.rdmNextGCD = ({
  loopPlayerData, loopRecastArray, loopStatusArray,
} = {}) => {
  const { getRecast } = nextAction;
  const { setStatus } = nextAction;
  const { getStatusDuration } = nextAction;
  const { getStatusStacks } = nextAction;
  const { blackMana } = loopPlayerData;
  const { whiteMana } = loopPlayerData;
  const lowerMana = Math.min(blackMana, whiteMana);
  // const higherMana = Math.max(blackMana, whiteMana);
  const targets = 1;
  const { gcd } = loopPlayerData;
  const { comboAction } = loopPlayerData;
  const { actionList } = nextAction;
  const { targetCount } = nextAction;

  const dualcastDuration = getStatusDuration({ name: 'Dualcast', array: loopStatusArray });
  const swiftcastDuration = getStatusDuration({ name: 'Swiftcast', array: loopStatusArray });
  const verfireDuration = getStatusDuration({ name: 'Verfire Ready', array: loopStatusArray });
  const verstoneDuration = getStatusDuration({ name: 'Verstone Ready', array: loopStatusArray });

  // "Use Dualcast/Swiftcast"
  if (dualcastDuration > 0 || swiftcastDuration > 0) {
    // Remove Dualcast or Swiftcast buff
    if (dualcastDuration > 0) {
      setStatus({ name: 'Dualcast', duration: -1, array: loopStatusArray });
    } else {
      setStatus({ name: 'Swiftcast', duration: -1, array: loopStatusArray });
    }

    // AoE
    if (actionList.some((e) => e.name === 'Impact') && targets >= 2) { return 'Impact'; }
    if (actionList.some((e) => e.name === 'Scatter') && targets >= 3) { return 'Scatter'; }

    const verthunderAcquired = actionList.some((e) => e.name === 'Verthunder');
    const veraeroAcquired = actionList.some((e) => e.name === 'Veraero');
    const verthunderMana = actionList[actionList.findIndex((e) => e.name === 'Verthunder')].blackMana;
    const veraeroMana = actionList[actionList.findIndex((e) => e.name === 'Veraero')].whiteMana;

    // "If one will cause you to unbalance, do the other one"
    if (veraeroAcquired && Math.min(blackMana + verthunderMana, 100) > whiteMana + 30) { return 'Veraero'; }
    if (verthunderAcquired && Math.min(whiteMana + veraeroMana, 100) > blackMana + 30) { return 'Verthunder'; }

    // "Avoid overwriting procs"
    // Procs imply Verthunder/Veraero is acquired
    // 3 times GCD so that there is ample time to use the proc
    if (verfireDuration > gcd * 3) { return 'Veraero'; }
    if (verstoneDuration > gcd * 3) { return 'Verthunder'; }

    // "All other cases (well, I hope)"
    // Use Veraero if equal or black mana is higher, Verthunder otherwise
    if (veraeroAcquired && blackMana >= whiteMana) { return 'Veraero'; }
    if (verthunderAcquired) { return 'Verthunder'; }

    if (actionList.some((e) => e.name === 'Jolt')) { return 'Jolt'; }
  }

  // Multiple blocks use these variables; keep outside
  const verholyAcquired = actionList.some((e) => e.name === 'Verholy');
  const verflareAcquired = actionList.some((e) => e.name === 'Verflare');
  const verholyMana = actionList[actionList.findIndex((e) => e.name === 'Verholy')].whiteMana;
  const verflareMana = actionList[actionList.findIndex((e) => e.name === 'Verflare')].blackMana;

  const { manaStacks } = loopPlayerData;

  // "Use mana stacks ASAP"
  // Mana stacks implies level >= 68 so no need to check for Verflare explicitly
  // Probably catches combo screw-ups with 3 stacks
  // Also assumes that mana stacks are usable ideally ASAP but whenever - check after 6.0 release
  if (manaStacks >= 3) {
    // "If one will cause you to unbalance, do the other one"
    if (verholyAcquired && Math.min(blackMana + verflareMana, 100) > whiteMana + 30) { return 'Verholy'; }
    if (Math.min(whiteMana + verholyMana, 100) > blackMana + 30) { return 'Verflare'; }

    // "Proc using lower mana (100%)"
    if (verholyAcquired && verstoneDuration < gcd * 3 && blackMana > whiteMana) { return 'Verholy'; }
    if (verfireDuration < gcd * 3 && blackMana < whiteMana) { return 'Verflare'; }

    // "Use Acceleration to proc (100%)"
    if (getStatusStacks({ name: 'Acceleration', array: loopStatusArray }) > 0) {
      // Use lower mana in case of both procs being down
      if (verholyAcquired && verfireDuration < gcd * 3 && verstoneDuration < gcd * 3) {
        if (blackMana >= whiteMana) { return 'Verholy'; }
        return 'Verflare';
      }

      // Pick proc that's down
      if (verholyAcquired && verstoneDuration < gcd * 3) { return 'Verholy'; }
      if (verfireDuration < gcd * 3) { return 'Verflare'; }
    }

    // "Attempt proc using higher mana (20%)"
    if (verholyAcquired && verstoneDuration < gcd * 3) { return 'Verholy'; }
    if (verfireDuration < gcd * 3) { return 'Verflare'; }

    // "Procs not possible, simply increase lower mana"
    if (verholyAcquired && blackMana >= whiteMana) { return 'Verholy'; }
    return 'Verflare';
  }

  const riposteCost = actionList[actionList.findIndex((e) => e.name === 'Enchanted Riposte')].manaCost;
  const zwerchhauCost = actionList[actionList.findIndex((e) => e.name === 'Enchanted Zwerchhau')].manaCost;
  const redoublementCost = actionList[actionList.findIndex((e) => e.name === 'Enchanted Redoublement')].manaCost;

  const zwerchhauAcquired = actionList.some((e) => e.name === 'Enchanted Zwerchhau');
  const redoublementAcquired = actionList.some((e) => e.name === 'Enchanted Redoublement');

  let comboTime = actionList[actionList.findIndex((e) => e.name === 'Enchanted Riposte')].gcd;
  let comboCost = riposteCost;

  if (zwerchhauAcquired) {
    comboTime += actionList[actionList.findIndex((e) => e.name === 'Enchanted Zwerchhau')].gcd;
    comboCost += zwerchhauCost;
  }

  if (redoublementAcquired) {
    comboTime += actionList[actionList.findIndex((e) => e.name === 'Enchanted Redoublement')].gcd;
    comboCost += redoublementCost;
  }

  const repriseAcquired = actionList.some((e) => e.name === 'Enchanted Reprise');

  const scorchAcquired = actionList.some((e) => e.name === 'Scorch');
  const resolutionAcquired = actionList.some((e) => e.name === 'Resolution');

  let finisherTime = 0;
  if (verflareAcquired) { finisherTime += gcd; }
  if (scorchAcquired) { finisherTime += gcd; }
  if (resolutionAcquired) { finisherTime += gcd; }

  const manaficationRecast = getRecast({ name: 'Manafication', array: loopRecastArray });

  // Finisher combos
  if (resolutionAcquired && comboAction === 'Scorch') { return 'Resolution'; }
  if (scorchAcquired && ['Verflare', 'Verholy'].includes(comboAction)) { return 'Scorch'; }
  if (redoublementAcquired && lowerMana >= redoublementCost && comboAction === 'Enchanted Zwerchhau') { return 'Enchanted Redoublement'; }

  // Moulinet
  const moulinetCost = actionList[actionList.findIndex((e) => e.name === 'Enchanted Moulinet')].manaCost;
  if (actionList.some((e) => e.name === 'Enchanted Moulinet') && lowerMana >= moulinetCost) {
    if (targetCount > 3) { return 'Enchanted Moulinet'; }
    if (!repriseAcquired && manaficationRecast < actionList[actionList.findIndex((e) => e.name === 'Enchanted Moulinet')].gcd) { return 'Enchanted Moulinet'; }
  }

  // Continue combo
  if (zwerchhauAcquired && lowerMana >= zwerchhauCost && comboAction === 'Enchanted Riposte') { return 'Enchanted Zwerchhau'; }

  if (lowerMana >= comboCost) {
    // Start combo immediately under Manafication or when proc guaranteed
    if ((verholyAcquired && verstoneDuration <= comboTime && blackMana > whiteMana)
    || (verflareAcquired && verfireDuration <= comboTime && whiteMana > blackMana)
    || getStatusDuration({ name: 'Manafication', array: loopStatusArray }) > 0
    || !zwerchhauAcquired) {
      return 'Enchanted Riposte';
    }
  }

  // Burn GCDs with Reprise if Manafication comes up at a weird time
  if (actionList.some((e) => e.name === 'Enchanted Reprise') && actionList[actionList.findIndex((e) => e.name === 'Enchanted Reprise')].manaCost >= lowerMana) {
    if (manaficationRecast < gcd) { return 'Enchanted Reprise'; }
    if (manaficationRecast < comboTime + finisherTime && lowerMana >= 50) { return 'Enchanted Reprise'; }
  }

  const verthunderiiAcquired = actionList.some((e) => e.name === 'Verthunder II');
  const veraeroiiAcquired = actionList.some((e) => e.name === 'Veraero II');

  const verfireMana = actionList[actionList.findIndex((e) => e.name === 'Verfire')].blackMana;
  const verstoneMana = actionList[actionList.findIndex((e) => e.name === 'Verstone')].whiteMana;

  // AOE
  if (targetCount >= 3) {
    if (veraeroiiAcquired && whiteMana <= blackMana) { return 'Veraero II'; }
    if (verthunderiiAcquired) { return 'Verthunder II'; }
  }

  // "If one will cause you to unbalance, do the other one"
  if (verstoneDuration >= gcd && Math.min(blackMana + verfireMana, 100) > whiteMana + 30) { return 'Verstone'; }
  if (verfireDuration >= gcd && Math.min(whiteMana + verstoneMana, 100) > blackMana + 30) { return 'Verfire'; }

  // Prioritize proc that will drop during combo
  if (verstoneDuration < comboTime + finisherTime + gcd * 3) { return 'Verstone'; }
  if (verfireDuration < comboTime + finisherTime + gcd * 3) { return 'Verfire'; }

  // Use the lower mana one
  if (verstoneDuration > gcd && whiteMana <= blackMana) { return 'Verstone'; }
  if (verfireDuration > gcd && blackMana <= whiteMana) { return 'Verfire'; }

  // Use something
  if (verstoneDuration > gcd) { return 'Verstone'; }
  if (verfireDuration > gcd) { return 'Verfire'; }

  if (actionList.some((e) => e.name === 'Jolt II')) { return 'Jolt II'; }
  if (actionList.some((e) => e.name === 'Jolt')) { return 'Jolt'; }
  return 'Riposte';
};

nextAction.rdmNextOGCD = ({
  loopPlayerData, loopRecastArray, loopStatusArray,
} = {}) => {
  const { actionList } = nextAction;
  const { getRecast } = nextAction;
  const { getStatusDuration } = nextAction;

  const { blackMana } = loopPlayerData;
  const { whiteMana } = loopPlayerData;
  const { targetCount } = loopPlayerData;
  const { gcd } = loopPlayerData;
  const { mp } = loopPlayerData;
  const { comboAction } = loopPlayerData;
  const lowerMana = Math.min(blackMana, whiteMana);
  const higherMana = Math.max(blackMana, whiteMana);

  if (actionList.some((e) => e.name === 'Manafication') && getRecast({ name: 'Manafication', array: loopRecastArray }) < 1 && !comboAction) { return 'Manafication'; }

  const contresixteAcquired = actionList.some((e) => e.name === 'Contre Sixte');
  const contresixteRecast = getRecast({ name: 'Contre Sixte', array: loopRecastArray });

  if (contresixteAcquired && contresixteRecast < 1 && targetCount > 1) { return 'Contre Sixte'; }
  if (actionList.some((e) => e.name === 'Fleche') && getRecast({ name: 'Fleche', array: loopRecastArray })) { return 'Fleche'; }
  if (contresixteAcquired && contresixteRecast < 1) { return 'Contre Sixte'; }
  if (actionList.some((e) => e.name === 'Swiftcast') && getRecast({ name: 'Swiftcast', array: loopRecastArray } < 1 && getRecast({ name: 'Manafication', array: loopRecastArray }) < gcd + 1)) { return 'Swiftcast'; }
  if (actionList.some((e) => e.name === 'Embolden') && getRecast({ name: 'Embolden', array: loopRecastArray }) < 1) { return 'Embolden'; }
  if (actionList.some((e) => e.name === 'Corps-a-corps') && getRecast({ name: 'Corps-a-corps', array: loopRecastArray }) < 1) { return 'Corps-a-corps'; }
  if (actionList.some((e) => e.name === 'Engagement') && getRecast({ name: 'Engagement', array: loopRecastArray }) < 1) { return 'Engagement'; }
  if (actionList.some((e) => e.name === 'Acceleration') && getRecast({ name: 'Acceleration', array: loopRecastArray }) < 1) {
    if (higherMana < 80 && Math.min(getStatusDuration({ name: 'Verfire Ready', array: loopStatusArray }), getStatusDuration({ name: 'Verstone Ready', array: loopStatusArray })) < gcd + 1) { return 'Acceleration'; }
    if (higherMana < 60) { return 'Acceleration'; }
  }
  if (actionList.some((e) => e.name === 'Lucid Dreaming') && mp < 8000 && getRecast({ name: 'Lucid Dreaming', array: loopRecastArray }) < 1) { return 'Lucid Dreaming'; }
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
      nextAction.comboAction = actionName;
    } else {
      removeStatus({ statusName: 'Combo' });
      nextAction.comboAction = '';
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
  nextAction.comboAction = '';
  nextAction.removeStatus({ statusName: 'Combo' });

  nextAction.rdmNextAction({ casting: castingMatch.groups.actionName });
  nextAction.NEWfadeIcon({ name: `Hardcast ${castingMatch.groups.actionName}` });
};

nextAction.rdmCancelMatch = (cancelMatch) => {
  // No let declarations here - everything needs to modify current snapshot
  nextAction.NEWunfadeIcon({ name: `Hardcast ${cancelMatch.groups.actionName}` });
  nextAction.rdmNextAction();
};
