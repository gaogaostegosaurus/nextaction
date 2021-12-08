
nextAction.rdmTraits = () => {
  const { level } = nextAction.playerData;

  // Filter actions
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
    nextAction.actionList[i].recast = 110;
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

  if (level >= 90) {
    const i = nextAction.statusData.findIndex((e) => e.name === 'Manafication');
    nextAction.statusData[i].stacks = 6;
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

nextAction.rdmLoop = ({
  delay = 0, // Call with this to allow OGCDs to fill next slots
  casting, // Use for calling function during casting
} = {}) => {
  // Static values
  const { addActionRecast } = nextAction;
  const { getActionRecast } = nextAction;
  const { setStatus } = nextAction;
  const { removeStatus } = nextAction;
  const { getStatusStacks } = nextAction;
  const { getStatusDuration } = nextAction;

  const { getActionData } = nextAction;

  const { actionList } = nextAction;

  // Clone arrays/objects for loop
  const loopPlayerData = { ...nextAction.playerData };
  const loopRecastArray = [...nextAction.recastArray];
  const loopStatusArray = [...nextAction.statusArray];

  const actionArray = [];

  // Initial values for loop control
  let gcdDelay = delay; // Time till next GCD action (or GCD length, whatever)
  let nextTime = 0; // Amount of time looked ahead in loop
  const maxActions = 100; // Maximum number of actions looked up
  let { mp } = loopPlayerData;
  let { blackMana } = loopPlayerData;
  let { whiteMana } = loopPlayerData;
  let { manaStacks } = loopPlayerData;
  
  // Start loop here
  for (let i = 1; i <= maxActions; i += 1) {
    let nextGCD = '';
    let loopTime = 0; // Tracks of how "long" the current loop takes
    if (nextTime === 0 && casting) {
      nextGCD = casting;
      // If casting, current spell is first GCD
      actionArray.push({ name: nextGCD, casting: true });
    } else if (gcdDelay === 0) {
      nextGCD = nextAction.rdmNextGCD({ loopPlayerData, loopRecastList, loopStatusList });
    }

    // Adjust resources

    mp -= getActionData({ name: nextGCD, data: 'mpCost' });

    blackMana += getActionData({ name: nextGCD, data: 'blackMana' });
    whiteMana += getActionData({ name: nextGCD, data: 'whiteMana' });

    blackMana -= getActionData({ name: nextGCD, data: 'manaCost' });
    whiteMana -= getActionData({ name: nextGCD, data: 'manaCost' });

    manaStacks += getActionData({ name: nextGCD, data: 'manaStacks' });
    manaStacks -= getActionData({ name: nextGCD, data: 'manaStackCost' });

    // Fix mana
    if (blackMana > 100) { blackMana = 100; } else if (blackMana < 0) { blackMana = 0; }
    if (whiteMana > 100) { whiteMana = 100; } else if (whiteMana < 0) { whiteMana = 0; }

    // Check for combo
    if (actionList.some((e) => e.comboAction.includes(nextGCD))) {
      setStatus({ name: 'Combo ', array: loopStatusArray });
    } else {
      removeStatus({ name: 'Combo ', array: loopStatusArray });
    }

    // Remove procs
    if (nextGCD === 'Verfire') {
      removeStatus({ name: 'Verfire Ready', array: loopStatusArray });
    } else if (nextGCD === 'Verstone') {
      removeStatus({ name: 'Verstone Ready', array: loopStatusArray });
    }

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

    let weave = 1;
    let weaveMax = 0;
    if (gcdTime > 2200) { weaveMax = 2; } else
    if (gcdTime > 1000) { weaveMax = 1; }

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
  clearTimeout(nextAction.loopTimeout); // Keep this the same across jobs
  nextAction.loopTimeout = setTimeout(nextAction.rdmLoop, gcd * 2, // 2 GCDs seems like a good number... maybe 3?
  );
};

nextAction.rdmNextGCD = ({
  loopPlayerData, loopRecastArray, loopStatusArray,
} = {}) => {
  const { getRecast } = nextAction;
  const { removeStatus } = nextAction;
  const { getStatusDuration } = nextAction;
  const { useStatusStacks } = nextAction;

  const { blackMana } = loopPlayerData;
  const { whiteMana } = loopPlayerData;
  const lowerMana = Math.min(blackMana, whiteMana);
  // const higherMana = Math.max(blackMana, whiteMana);

  const targets = 1;
  const { gcd } = loopPlayerData;
  const { comboAction } = loopPlayerData;
  const { actionList } = nextAction;
  const { targetCount } = nextAction;

  useStatusStacks({ name: 'Manafication', array: loopStatusArray });

  const zwerchhauAcquired = actionList.some((e) => e.name === 'Enchanted Zwerchhau');
  const redoublementAcquired = actionList.some((e) => e.name === 'Enchanted Redoublement');
  const scorchAcquired = actionList.some((e) => e.name === 'Scorch');
  const resolutionAcquired = actionList.some((e) => e.name === 'Resolution');

  const zwerchhauCost = actionList[actionList.findIndex((e) => e.name === 'Enchanted Zwerchhau')].manaCost;
  const redoublementCost = actionList[actionList.findIndex((e) => e.name === 'Enchanted Redoublement')].manaCost;

  // "Continue combos"
  if (comboAction) {
    if (zwerchhauAcquired && lowerMana >= zwerchhauCost && comboAction === 'Enchanted Riposte') { return 'Enchanted Zwerchhau'; }
    if (redoublementAcquired && lowerMana >= redoublementCost && comboAction === 'Enchanted Zwerchhau') { return 'Enchanted Redoublement'; }
    if (scorchAcquired && (comboAction === 'Verflare' || comboAction === 'Verholy')) { return 'Scorch'; }
    if (resolutionAcquired && comboAction === 'Scorch') { return 'Scorch'; }
  }

  const verflareAcquired = actionList.some((e) => e.name === 'Verflare');
  const verholyAcquired = actionList.some((e) => e.name === 'Verholy');

  const verflareMana = actionList[actionList.findIndex((e) => e.name === 'Verflare')].blackMana;
  const verholyMana = actionList[actionList.findIndex((e) => e.name === 'Verholy')].whiteMana;

  const verfireDuration = getStatusDuration({ name: 'Verfire Ready', array: loopStatusArray });
  const verstoneDuration = getStatusDuration({ name: 'Verstone Ready', array: loopStatusArray });

  let finisherTime = 0;
  if (verflareAcquired) { finisherTime += gcd; }
  if (scorchAcquired) { finisherTime += gcd; }
  if (resolutionAcquired) { finisherTime += gcd; }

  const { manaStacks } = loopPlayerData;

  // "Use 3 mana stacks ASAP"
  // Mana stacks implies level >= 68 so no need to check for Verflare explicitly
  if (manaStacks >= 3) {
    // "If one will cause you to unbalance, do the other one"
    if (verholyAcquired && Math.min(blackMana + verflareMana, 100) > whiteMana + 30) { return 'Verholy'; }
    if (Math.min(whiteMana + verholyMana, 100) > blackMana + 30) { return 'Verflare'; }

    // "Proc using lower mana (100%)"
    if (verholyAcquired && verstoneDuration < finisherTime + gcd && blackMana > whiteMana) { return 'Verholy'; }
    if (verfireDuration < finisherTime + gcd && blackMana < whiteMana) { return 'Verflare'; }

    // Old 5.x stuff, keeping around for no reason probably
    // // "Use Acceleration to proc (100%)"
    // if (getStatusStacks({ name: 'Acceleration', array: loopStatusArray }) > 0) {
    //   if (verholyAcquired && verstoneDuration < finisherTime + gcd) { return 'Verholy'; }
    //   if (verfireDuration < finisherTime + gcd) { return 'Verflare'; }
    // }

    // "Attempt proc using higher mana (20%)"
    if (verholyAcquired && verstoneDuration < finisherTime + gcd) { return 'Verholy'; }
    if (verfireDuration < finisherTime + gcd) { return 'Verflare'; }

    // "Procs not possible, simply increase lower mana"
    if (verholyAcquired && blackMana >= whiteMana) { return 'Verholy'; }
    return 'Verflare';
  }

  const dualcastDuration = getStatusDuration({ name: 'Dualcast', array: loopStatusArray });
  const accelerationDuration = getStatusDuration({ name: 'Acceleration', array: loopStatusArray });
  const swiftcastDuration = getStatusDuration({ name: 'Swiftcast', array: loopStatusArray });

  // "Use Dualcast/Swiftcast/Acceleration"
  if (dualcastDuration > 0 || accelerationDuration > 0 || swiftcastDuration > 0) {
    // Remove Dualcast or Swiftcast buff
    if (dualcastDuration > 0) {
      removeStatus({ name: 'Dualcast', array: loopStatusArray });
    } else if (accelerationDuration > 0) {
      removeStatus({ name: 'Acceleration', array: loopStatusArray });
    } else {
      removeStatus({ name: 'Swiftcast', array: loopStatusArray });
    }

    // AoE
    if (actionList.some((e) => e.name === 'Impact') && targets >= 2) { return 'Impact'; }
    if (actionList.some((e) => e.name === 'Scatter') && targets >= 3) { return 'Scatter'; }

    const verthunderAcquired = actionList.some((e) => e.name === 'Verthunder');
    const veraeroAcquired = actionList.some((e) => e.name === 'Veraero');
    const verthunder3Acquired = actionList.some((e) => e.name === 'Verthunder III');
    const veraero3Acquired = actionList.some((e) => e.name === 'Veraero III');
    const verthunderMana = actionList[actionList.findIndex((e) => e.name === 'Verthunder')].blackMana;
    const veraeroMana = actionList[actionList.findIndex((e) => e.name === 'Veraero')].whiteMana;

    // "If one will cause you to unbalance, do the other one"
    if (veraeroAcquired && Math.min(blackMana + verthunderMana, 100) > whiteMana + 30) {
      if (veraero3Acquired) { return 'Veraero III'; }
      return 'Veraero';
    }
    if (verthunderAcquired && Math.min(whiteMana + veraeroMana, 100) > blackMana + 30) {
      if (verthunder3Acquired) { return 'Verthunder III'; }
      return 'Verthunder';
    }

    // "All other cases (well, I hope)"
    // Use Veraero if equal or black mana is higher, Verthunder otherwise
    if (veraeroAcquired && blackMana >= whiteMana) {
      if (veraero3Acquired) { return 'Veraero III'; }
      return 'Veraero';
    }
    if (verthunderAcquired) {
      if (verthunder3Acquired) { return 'Verthunder III'; }
      return 'Verthunder';
    }
    return 'Jolt';
  }

  const manaficationRecast = getRecast({ name: 'Manafication', array: loopRecastArray });

  const repriseAcquired = actionList.some((e) => e.name === 'Enchanted Reprise');
  const repriseCost = actionList[actionList.findIndex((e) => e.name === 'Enchanted Reprise')].manaCost;
  const repriseGCD = actionList[actionList.findIndex((e) => e.name === 'Enchanted Reprise')].gcd;

  const moulinetAcquired = actionList.some((e) => e.name === 'Enchanted Moulinet');
  const moulinetCost = actionList[actionList.findIndex((e) => e.name === 'Enchanted Moulinet')].manaCost;
  const moulinetGCD = actionList[actionList.findIndex((e) => e.name === 'Enchanted Moulinet')].gcd;

  if (moulinetAcquired && lowerMana >= moulinetCost) {
    if (targets >= 3) {
      if (verflareAcquired && lowerMana >= moulinetCost * (3 - manaStacks)) { return 'Enchanted Moulinet'; }
      if (verflareAcquired && lowerMana >= moulinetCost * Math.ceil(manaficationRecast / moulinetGCD) + 10) { return 'Enchanted Moulinet'; }
      if (!verflareAcquired) { return 'Enchanted Moulinet'; }
    }
    if (!repriseAcquired && manaficationRecast < moulinetGCD) { return 'Enchanted Moulinet'; }
  }

  const riposteCost = actionList[actionList.findIndex((e) => e.name === 'Enchanted Riposte')].manaCost;

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

  // Burn GCDs with Reprise (if Manafication comes up at a weird time)
  if (repriseAcquired && lowerMana >= repriseCost) {
    if (manaficationRecast < comboTime + finisherTime && lowerMana >= 50) { return 'Enchanted Reprise'; }
    if (manaficationRecast < repriseGCD) { return 'Enchanted Reprise'; }
  }

  if (lowerMana >= comboCost) {
    // Start combo immediately under Manafication
    if (getStatusDuration({ name: 'Manafication', array: loopStatusArray }) > 0) { return 'Enchanted Riposte'; }

    // Proc guaranteed after Verholy/Verflare
    if (verflareAcquired && verfireDuration < comboTime + finisherTime + gcd && whiteMana > blackMana) { return 'Enchanted Riposte'; }
    if (verholyAcquired && verstoneDuration < comboTime + finisherTime + gcd && blackMana > whiteMana) { return 'Enchanted Riposte'; }

    // "Might as well"
    if (!verflareAcquired && Math.min(verfireDuration, verstoneDuration) < comboTime + gcd) { return 'Enchanted Riposte'; }
  }

  const verthunder2Acquired = actionList.some((e) => e.name === 'Verthunder II');
  const veraero2Acquired = actionList.some((e) => e.name === 'Veraero II');

  const verfireMana = actionList[actionList.findIndex((e) => e.name === 'Verfire')].blackMana;
  const verstoneMana = actionList[actionList.findIndex((e) => e.name === 'Verstone')].whiteMana;

  // AOE
  if (targetCount >= 3) {
    if (veraero2Acquired && whiteMana <= blackMana) { return 'Veraero II'; }
    if (verthunder2Acquired) { return 'Verthunder II'; }
  }

  // "Hardcast stuff"

  // "If one will cause you to unbalance, do the other one"
  if (verstoneDuration >= gcd && Math.min(blackMana + verfireMana, 100) > whiteMana + 30) { return 'Verstone'; }
  if (verfireDuration >= gcd && Math.min(whiteMana + verstoneMana, 100) > blackMana + 30) { return 'Verfire'; }

  // Prioritize proc that would drop during combo
  if (verstoneDuration < comboTime + finisherTime + gcd * 3) { return 'Verstone'; }
  if (verfireDuration < comboTime + finisherTime + gcd * 3) { return 'Verfire'; }

  // Raise lower mana
  if (verstoneDuration >= gcd && whiteMana <= blackMana) { return 'Verstone'; }
  if (verfireDuration >= gcd && blackMana <= whiteMana) { return 'Verfire'; }

  // Use something
  if (verstoneDuration >= gcd) { return 'Verstone'; }
  if (verfireDuration >= gcd) { return 'Verfire'; }

  if (actionList.some((e) => e.name === 'Jolt II')) { return 'Jolt II'; }
  if (actionList.some((e) => e.name === 'Jolt')) { return 'Jolt'; }
  return 'Riposte';
};

nextAction.rdmNextOGCD = ({
  loopPlayerData, loopRecastArray, loopStatusArray,
} = {}) => {
  const { actionList } = nextAction;
  const { getRecast } = nextAction;
  const { getCharges } = nextAction;
  const { getStatusDuration } = nextAction;
  const { targetCount } = loopPlayerData;
  const { gcd } = loopPlayerData;
  const { mp } = loopPlayerData;
  const { comboAction } = loopPlayerData;
  const { blackMana } = loopPlayerData;
  const { whiteMana } = loopPlayerData;
  // const lowerMana = Math.min(blackMana, whiteMana);
  const higherMana = Math.max(blackMana, whiteMana);

  const manaficationRecast = getRecast({ name: 'Manafication', array: loopRecastArray });

  // Manafication on cooldown (???)
  if (manaficationRecast < 1 && !comboAction) { return 'Manafication'; }

  const contresixteRecast = getRecast({ name: 'Contre Sixte', array: loopRecastArray });
  const flecheRecast = getRecast({ name: 'Fleche', array: loopRecastArray });

  const accelerationCharges = getCharges({ name: 'Acceleration', array: loopRecastArray });
  const accelerationRecast = getRecast({ name: 'Acceleration', array: loopRecastArray });

  const swiftcastRecast = getRecast({ name: 'Swiftcast', array: loopRecastArray });

  // Acceleration/Swiftcast for Manafication during next GCD
  if (manaficationRecast < gcd + 1) {
    if (accelerationCharges > 1) { return 'Acceleration'; }
    if (swiftcastRecast < 1) { return 'Swiftcast'; }
    if (accelerationCharges > 0) { return 'Acceleration'; }
  }

  // Fleche/Contre Sixte spam
  if (contresixteRecast < 1 && targetCount > 1) { return 'Contre Sixte'; }
  if (flecheRecast < 1) { return 'Fleche'; }
  if (contresixteRecast < 1) { return 'Contre Sixte'; }

  // Acceleration/Swift to prevent Fleche/Contre Sixte drift
  if (manaficationRecast > Math.min(swiftcastRecast, accelerationRecast) + gcd) {
    if (flecheRecast < gcd + 1 || contresixteRecast < gcd + 1) {
      if (accelerationCharges > 1) { return 'Acceleration'; }
      if (swiftcastRecast < 1) { return 'Swiftcast'; }
      if (accelerationCharges > 0) { return 'Acceleration'; }
    }
  }

  // Acceleration for damage/procs if 2 charges up?
  if (accelerationCharges > 1) {
    if (targetCount > 1) { return 'Acceleration'; }
    if (higherMana < 80 && Math.min(getStatusDuration({ name: 'Verfire Ready', array: loopStatusArray }), getStatusDuration({ name: 'Verstone Ready', array: loopStatusArray })) < gcd + 1) { return 'Acceleration'; }
    if (higherMana < 60) { return 'Acceleration'; }
  }

  // Other OGCDs, I guess
  if (actionList.some((e) => e.name === 'Embolden') && getRecast({ name: 'Embolden', array: loopRecastArray }) < 1) { return 'Embolden'; }
  if (actionList.some((e) => e.name === 'Corps-a-corps') && getCharges({ name: 'Corps-a-corps', array: loopRecastArray }) > 1) { return 'Corps-a-corps'; }
  if (actionList.some((e) => e.name === 'Engagement') && getCharges({ name: 'Engagement', array: loopRecastArray }) > 1) { return 'Engagement'; }

  // Lucid, but is this even needed anymore
  if (actionList.some((e) => e.name === 'Lucid Dreaming') && mp < 8000 && getRecast({ name: 'Lucid Dreaming', array: loopRecastArray }) < 1) { return 'Lucid Dreaming'; }
  return '';
};

nextAction.rdmActionMatch = ({ logType, actionName, targetID } = {}) => {
  nextAction.actionMatchTimestamp = Date.now();
  // No let declarations here - everything needs to modify current snapshot
  const { removeStatus } = nextAction;

  const { weaponskills } = nextAction.actionData;
  const { spells } = nextAction.actionData;
  const { abilities } = nextAction.actionData;
  const { gcd } = nextAction;

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
