/* globals nextAction, actionData:writable, */

const rdmTraits = () => {
  const { level } = playerData;

  // Filter actions
  // Traits
  if (level >= 62) {
    let index;
    index = actionData.findIndex((element) => element.name === 'Jolt');
    actionData = actionData.splice(index, 1);
    index = actionData.findIndex((element) => element.name === 'Verthunder');
    actionData[index].potency = 370;
    index = actionData.findIndex((element) => element.name === 'Veraero');
    actionData[index].potency = 370;
    index = actionData.findIndex((element) => element.name === 'Verfire');
    actionData[index].potency = 310;
    index = actionData.findIndex((element) => element.name === 'Verstone');
    actionData[index].potency = 310;
  }

  if (level >= 66) {
    const i = actionData.findIndex((element) => element.name === 'Scatter');
    actionData = actionData.splice(i, 1);
  }

  if (level >= 72) {
    const i = actionData.findIndex((element) => element.name === 'Displacement');
    actionData[i].potency = 200;
  }

  if (level >= 74) {
    const i = actionData.findIndex((element) => element.name === 'Manafication');
    actionData[i].recast = 110;
    actionData[i].status = 'Manafication';
  }

  if (level >= 78) {
    let i = actionData.findIndex((element) => element.name === 'Contre Sixte');
    actionData[i].recast = 35000;
    i = actionData.findIndex((element) => element.name === 'Verthunder II');
    actionData[i].potency = 120;
    i = actionData.findIndex((element) => element.name === 'Veraero II');
    actionData[i].potency = 120;
  }

  if (level >= 88) {
    const i = actionData.findIndex((element) => element.name === 'Acceleration');
    actionData[i].charges = 2;
  }

  if (level >= 90) {
    const i = statusData.findIndex((element) => element.name === 'Manafication');
    statusData[i].stacks = 6;
  }

  nextAction = rdmNextAction;
  playerDataChanged = rdmPlayerChanged;
};

const rdmPlayerChanged = (e) => {
  playerData.mp = e.detail.currentMP;
  playerData.blackMana = e.detail.jobDetail.blackMana;
  playerData.whiteMana = e.detail.jobDetail.whiteMana;
};

const rdmLoop = ({
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

  const { actionData } = nextAction;

  // Clone arrays/objects for loop
  const loopPlayerData = { ...playerData };
  const loopRecastArray = [...recastArray];
  const loopStatusArray = [...statusArray];

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
      nextGCD = rdmNextGCD({ loopPlayerData, loopRecastList, loopStatusList });
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
    if (actionData.some((e) => e.comboAction.includes(nextGCD))) {
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
      const nextOGCD = rdmNextOGCD({
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

  syncIcons({ iconArray });

  // Refresh after a few GCDs if nothing's happening
  clearTimeout(loopTimeout); // Keep this the same across jobs
  loopTimeout = setTimeout(rdmLoop, gcd * 2, // 2 GCDs seems like a good number... maybe 3?
  );
};

const rdmNextGCD = ({
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
  const { actionData } = nextAction;
  const { targetCount } = nextAction;

  useStatusStacks({ name: 'Manafication', array: loopStatusArray });

  const zwerchhauAcquired = actionData.some((element) => element.name === 'Enchanted Zwerchhau');
  const redoublementAcquired = actionData.some((element) => element.name === 'Enchanted Redoublement');
  const scorchAcquired = actionData.some((element) => element.name === 'Scorch');
  const resolutionAcquired = actionData.some((element) => element.name === 'Resolution');

  const zwerchhauCost = actionData[actionData.findIndex((element) => element.name === 'Enchanted Zwerchhau')].manaCost;
  const redoublementCost = actionData[actionData.findIndex((element) => element.name === 'Enchanted Redoublement')].manaCost;

  // "Continue combos"
  if (comboAction) {
    if (zwerchhauAcquired && lowerMana >= zwerchhauCost && comboAction === 'Enchanted Riposte') { return 'Enchanted Zwerchhau'; }
    if (redoublementAcquired && lowerMana >= redoublementCost && comboAction === 'Enchanted Zwerchhau') { return 'Enchanted Redoublement'; }
    if (scorchAcquired && (comboAction === 'Verflare' || comboAction === 'Verholy')) { return 'Scorch'; }
    if (resolutionAcquired && comboAction === 'Scorch') { return 'Scorch'; }
  }

  const verflareAcquired = actionData.some((element) => element.name === 'Verflare');
  const verholyAcquired = actionData.some((element) => element.name === 'Verholy');

  const verflareMana = actionData[actionData.findIndex((element) => element.name === 'Verflare')].blackMana;
  const verholyMana = actionData[actionData.findIndex((element) => element.name === 'Verholy')].whiteMana;

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
    if (actionData.some((element) => element.name === 'Impact') && targets >= 2) { return 'Impact'; }
    if (actionData.some((element) => element.name === 'Scatter') && targets >= 3) { return 'Scatter'; }

    const verthunderAcquired = actionData.some((element) => element.name === 'Verthunder');
    const veraeroAcquired = actionData.some((element) => element.name === 'Veraero');
    const verthunder3Acquired = actionData.some((element) => element.name === 'Verthunder III');
    const veraero3Acquired = actionData.some((element) => element.name === 'Veraero III');
    const verthunderMana = actionData[actionData.findIndex((element) => element.name === 'Verthunder')].blackMana;
    const veraeroMana = actionData[actionData.findIndex((element) => element.name === 'Veraero')].whiteMana;

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

  const repriseAcquired = actionData.some((element) => element.name === 'Enchanted Reprise');
  const repriseCost = actionData[actionData.findIndex((element) => element.name === 'Enchanted Reprise')].manaCost;
  const repriseGCD = actionData[actionData.findIndex((element) => element.name === 'Enchanted Reprise')].gcd;

  const moulinetAcquired = actionData.some((element) => element.name === 'Enchanted Moulinet');
  const moulinetCost = actionData[actionData.findIndex((element) => element.name === 'Enchanted Moulinet')].manaCost;
  const moulinetGCD = actionData[actionData.findIndex((element) => element.name === 'Enchanted Moulinet')].gcd;

  if (moulinetAcquired && lowerMana >= moulinetCost) {
    if (targets >= 3) {
      if (verflareAcquired && lowerMana >= moulinetCost * (3 - manaStacks)) { return 'Enchanted Moulinet'; }
      if (verflareAcquired && lowerMana >= moulinetCost * Math.ceil(manaficationRecast / moulinetGCD) + 10) { return 'Enchanted Moulinet'; }
      if (!verflareAcquired) { return 'Enchanted Moulinet'; }
    }
    if (!repriseAcquired && manaficationRecast < moulinetGCD) { return 'Enchanted Moulinet'; }
  }

  const riposteCost = actionData[actionData.findIndex((element) => element.name === 'Enchanted Riposte')].manaCost;

  let comboTime = actionData[actionData.findIndex((element) => element.name === 'Enchanted Riposte')].gcd;
  let comboCost = riposteCost;

  if (zwerchhauAcquired) {
    comboTime += actionData[actionData.findIndex((element) => element.name === 'Enchanted Zwerchhau')].gcd;
    comboCost += zwerchhauCost;
  }

  if (redoublementAcquired) {
    comboTime += actionData[actionData.findIndex((element) => element.name === 'Enchanted Redoublement')].gcd;
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

  const verthunder2Acquired = actionData.some((element) => element.name === 'Verthunder II');
  const veraero2Acquired = actionData.some((element) => element.name === 'Veraero II');

  const verfireMana = actionData[actionData.findIndex((element) => element.name === 'Verfire')].blackMana;
  const verstoneMana = actionData[actionData.findIndex((element) => element.name === 'Verstone')].whiteMana;

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

  if (actionData.some((element) => element.name === 'Jolt II')) { return 'Jolt II'; }
  if (actionData.some((element) => element.name === 'Jolt')) { return 'Jolt'; }
  return 'Riposte';
};

const rdmNextOGCD = ({
  loopPlayerData, loopRecastArray, loopStatusArray,
} = {}) => {
  const { actionData } = nextAction;
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
  if (actionData.some((element) => element.name === 'Embolden') && getRecast({ name: 'Embolden', array: loopRecastArray }) < 1) { return 'Embolden'; }
  if (actionData.some((element) => element.name === 'Corps-a-corps') && getCharges({ name: 'Corps-a-corps', array: loopRecastArray }) > 1) { return 'Corps-a-corps'; }
  if (actionData.some((element) => element.name === 'Engagement') && getCharges({ name: 'Engagement', array: loopRecastArray }) > 1) { return 'Engagement'; }

  // Lucid, but is this even needed anymore
  if (actionData.some((element) => element.name === 'Lucid Dreaming') && mp < 8000 && getRecast({ name: 'Lucid Dreaming', array: loopRecastArray }) < 1) { return 'Lucid Dreaming'; }
  return '';
};

const rdmActionMatch = ({ logType, actionName, targetID } = {}) => {
  // Identify probable target count
  let { targetCount } = nextAction;
  if (logType === 'AOEAction Effect 16') {
    if (['Scatter', 'Verthunder II', 'Veraero II', 'Moulinet'].includes(actionName)) { targetCount = 3; } else if (actionName === 'Impact' && targetCount === 1) { targetCount = 2; }
  } else if (['Jolt', 'Verfire', 'Verstone', 'Jolt II'].includes(actionName) && targetCount < 2) { targetCount = 2; } else { targetCount = 1; }


  rdmLoop({ delay: gcd });

    // Call next function with appropriate GCD time
    if (['Enchanted Riposte', 'Enchanted Zwerchhau', 'Enchanted Moulinet'].includes(actionName)) { rdmNextAction({ delay: 1500 }); } else
    if (['Enchanted Redoublement', 'Enchanted Reprise'].includes(actionName)) {
      rdmNextAction({ delay: 2200 });
    } else { rdmNextAction({ delay: gcd }); }
  } else
  if (spells.includes(actionName)) {
    if (checkStatus({ statusName: 'Dualcast' }) < 0 && checkStatus({ statusName: 'Swiftcast' }) < 0) {
      NEWremoveIcon({ name: `Hardcast ${actionName}` });
    } else { NEWremoveIcon({ name: `Dualcast ${actionName}` }); }
  } else
  if (abilities.includes(actionName)) {
    NEWremoveIcon({ name: actionName });
    const propertyName = actionName.replace(/[\s':-]/g, '').toLowerCase();
    if (recast[propertyName]) { addRecast({ actionName }); }
    if (duration[propertyName]) { addStatus({ statusName: actionName }); }
    if (actionName === 'Acceleration') { accelerationCount = 3; } else
    if (actionName === 'Manafication') {
      addRecast({ actionName: 'Corps-A-Corps', recast: -1 });
      addRecast({ actionName: 'Displacement', recast: -1 });
      rdmNextAction();
    } else
    if (actionName === 'Engagement') {
      addRecast({ actionName: 'Displacement' }); // Set Displacement cooldown with Engagement
    }
    // console.log(actionName + ' ' + checkRecast({ actionName: actionName }));
  }
};

rdmStatusMatch = (statusMatch) => {
  // No let declarations here - everything needs to modify current snapshot
  const { statusName } = statusMatch.groups;
  const { statusDuration } = statusMatch.groups;
  const { gcd } = nextActionOverlay;

  // Control Dualcast/Swiftcast flow from here because it's a lot easier
  if (statusMatch.groups.logType === '1A') {
    addStatus({ statusName, duration: parseFloat(statusDuration) * 1000 });

    // if (statusName === 'Dualcast') {
    //   // NEWremoveIcon({ name: 'Hardcast ', match: 'contains' });
    //   // rdmNextAction();
    // } else
    if (statusName === 'Verfire Ready') {
      rdmNextAction({ delay: gcd });
    } else
    if (statusName === 'Verstone Ready') {
      rdmNextAction({ delay: gcd });
    // } else
    // if (statusName === 'Swiftcast') {
    //   // rdmNextAction();
    }
    // Acceleration 'gains' a new line every time a stack is used
  } else {
    removeStatus({ statusName });

    if (['Dualcast', 'Swiftcast'].includes(statusMatch.groups.statusName)) {
      NEWremoveIcon({ name: 'Dualcast ', match: 'contains' });
      rdmNextAction({ delay: gcd });
    } else
    if (statusName === 'Acceleration') { accelerationCount = 0; }
  }
};

rdmCastingMatch = (castingMatch) => {
  // No let declarations here - everything needs to modify current snapshot
  // Casting breaks combo
  comboAction = '';
  removeStatus({ statusName: 'Combo' });

  rdmNextAction({ casting: castingMatch.groups.actionName });
  NEWfadeIcon({ name: `Hardcast ${castingMatch.groups.actionName}` });
};

rdmCancelMatch = (cancelMatch) => {
  // No let declarations here - everything needs to modify current snapshot
  NEWunfadeIcon({ name: `Hardcast ${cancelMatch.groups.actionName}` });
  rdmNextAction();
};
