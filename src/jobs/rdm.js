/* globals
actionData statusData
currentPlayerData currentRecastArray currentStatusArray
loopPlayerData loopStatusArray loopRecastArray
startLoop advanceLoopTime
getActionDataProperty
addActionRecast checkActionRecast checkActionCharges
addStatus removeStatus checkStatusDuration
*/

// eslint-disable-next-line no-unused-vars
const rdmTraits = () => {
  const { level } = currentPlayerData;

  if (level >= 62) {
    const actionDataIndex = actionData.findIndex((element) => element.name === 'Jolt');
    actionData.splice(actionDataIndex, 1);
  }

  if (level >= 66) {
    const actionDataIndex = actionData.findIndex((element) => element.name === 'Scatter');
    actionData.splice(actionDataIndex, 1);
  }

  if (level >= 68) {
    let actionDataIndex;
    actionDataIndex = actionData.findIndex((element) => element.name === 'Enchanted Riposte');
    actionData[actionDataIndex].manaStacks = 1;
    actionDataIndex = actionData.findIndex((element) => element.name === 'Enchanted Zwerchhau');
    actionData[actionDataIndex].manaStacks = 1;
    actionDataIndex = actionData.findIndex((element) => element.name === 'Enchanted Redoublement');
    actionData[actionDataIndex].manaStacks = 1;
    actionDataIndex = actionData.findIndex((element) => element.name === 'Enchanted Moulinet');
    actionData[actionDataIndex].manaStacks = 1;
  }

  if (level >= 74) {
    const actionDataIndex = actionData.findIndex((element) => element.name === 'Manafication');
    actionData[actionDataIndex].recast = 110;
    actionData[actionDataIndex].status = 'Manafication';

    const statusDataIndex = statusData.findIndex((element) => element.name === 'Manafication');
    statusData[statusDataIndex].stacks = 4;
  }

  if (level >= 78) {
    const actionDataIndex = actionData.findIndex((element) => element.name === 'Contre Sixte');
    actionData[actionDataIndex].recast = 35000;
  }

  if (level >= 80) {
    const statusDataIndex = statusData.findIndex((element) => element.name === 'Manafication');
    statusData[statusDataIndex].stacks = 5;
  }

  if (level >= 88) {
    const actionDataIndex = actionData.findIndex((element) => element.name === 'Acceleration');
    actionData[actionDataIndex].charges = 2;
  }

  if (level >= 90) {
    const statusDataIndex = statusData.findIndex((element) => element.name === 'Manafication');
    statusData[statusDataIndex].stacks = 6;
  }

  // console.log(`Actions: ${JSON.stringify(actionData)}`);
  // console.log(`Actions: ${JSON.stringify(statusData)}`);
};

// eslint-disable-next-line no-unused-vars
const rdmPlayerChanged = (e) => {
  currentPlayerData.mp = e.detail.currentMP;
  currentPlayerData.blackMana = e.detail.jobDetail.blackMana;
  currentPlayerData.whiteMana = e.detail.jobDetail.whiteMana;
  currentPlayerData.manaStacks = e.detail.jobDetail.manaStacks;
  // console.log(`rdmPlayerChanged: ${currentPlayerData.blackMana}|${currentPlayerData.whiteMana}|${currentPlayerData.manaStacks}`);
};

// eslint-disable-next-line no-unused-vars
const rdmActionMatch = ({
  // logType, // Use for AoE checker?
  actionName,
  // targetID, // Not used (yet?)
  loop = false,
} = {}) => {
  if (actionName === undefined) { return 0; }

  let playerData;
  let recastArray;
  let statusArray;

  if (loop === true) {
    playerData = loopPlayerData;
    recastArray = loopRecastArray;
    statusArray = loopStatusArray;
  } else {
    playerData = currentPlayerData;
    recastArray = currentRecastArray;
    statusArray = currentStatusArray;
  }

  // Identify probable target count

  // let targetCount;
  // if (playerData.targetCount !== undefined) {
  //   targetCount = playerData.targetCount;
  // } else { targetCount = 1; }

  // if (logType === 'AOEActionEffect') {
  //   if (['Scatter', 'Verthunder II', 'Veraero II', 'Moulinet'].includes(actionName)) {
  //     targetCount = 3;
  //   } else if (actionName === 'Impact' && targetCount === 1) {
  //     targetCount = 2;
  //   }
  // } else if (['Jolt', 'Verfire', 'Verstone', 'Jolt II'].includes(actionName)
  // && targetCount < 2) {
  //   targetCount = 2;
  // } else {
  //   targetCount = 1;
  // }

  

  // Add linked cooldowns
  if (actionName === 'Displacement') { addActionRecast({ name: 'Engagement', recastArray }); }
  if (actionName === 'Engagement') { addActionRecast({ name: 'Displacement', recastArray }); }

  // Remove Verfire/Verstone proc
  if (actionName === 'Verfire') {
    removeStatus({ name: 'Verfire Ready', statusArray });
  } else if (actionName === 'Verstone') {
    removeStatus({ name: 'Verstone Ready', statusArray });
  }

  // const { gcd } = playerData;
  const { gcd } = playerData;
  const accelerationSpells = ['Verthunder', 'Veraero', 'Scatter', 'Verthunder III', 'Aero III', 'Impact'];
  const actionCast = getActionDataProperty({ name: actionName, property: 'cast' });
  // const actionRecast = getActionProperty({ name: actionName, property: 'recast' });
  const actionType = getActionDataProperty({ name: actionName, property: 'type' });

  let delay;

  // Get GCD time
  if (actionType === 'Spell' && actionCast !== undefined) {
    // console.log(actionCast);
    // Check for fastcast buffs and remove if necessary
    if (accelerationSpells.includes(actionName) && checkStatusDuration({ name: 'Acceleration', statusArray }) > 0) {
      removeStatus({ name: 'Acceleration', statusArray });
      delay = gcd;
    } else if (checkStatusDuration({ name: 'Dualcast', statusArray }) > 0) {
      removeStatus({ name: 'Dualcast', statusArray });
      delay = gcd;
    } else if (checkStatusDuration({ name: 'Swiftcast', statusArray }) > 0) {
      removeStatus({ name: 'Swiftcast', statusArray });
      delay = gcd;
    } else {
      addStatus({ name: 'Dualcast', statusArray });
      delay = Math.max(gcd - actionCast, 0);
    }
  } else if (actionType === 'Spell') {
    delay = gcd;
  } else if (actionType === 'Weaponskill') {
    delay = gcd;
  }

  if (loop === false && delay !== undefined) {
    startLoop({ delay });
  } else {
    // Make other playerData adjustments to mimic playerChangedEvent

    // Get properties of action
    const mpCost = getActionDataProperty({ name: actionName, property: 'mpCost' });
    const blackMana = getActionDataProperty({ name: actionName, property: 'blackMana' });
    const whiteMana = getActionDataProperty({ name: actionName, property: 'whiteMana' });
    const manaCost = getActionDataProperty({ name: actionName, property: 'manaCost' });
    const manaStacks = getActionDataProperty({ name: actionName, property: 'manaStacks' });
    const manaStackCost = getActionDataProperty({ name: actionName, property: 'manaStackCost' });

    // Adjust resources
    if (mpCost !== undefined) { loopPlayerData.mp = Math.max(loopPlayerData.mp - mpCost, 0); }
    if (blackMana !== undefined) {
      loopPlayerData.blackMana = Math.min(loopPlayerData.blackMana + blackMana, 100);
    }
    if (whiteMana !== undefined) {
      loopPlayerData.whiteMana = Math.min(loopPlayerData.whiteMana + whiteMana, 100);
    }
    if (manaCost !== undefined) {
      loopPlayerData.blackMana = Math.max(loopPlayerData.blackMana - manaCost, 0);
      loopPlayerData.whiteMana = Math.max(loopPlayerData.whiteMana - manaCost, 0);
    }
    if (manaStacks !== undefined) {
      loopPlayerData.manaStacks = Math.min(loopPlayerData.manaStacks + manaStacks, 3);
    }
    if (manaStackCost !== undefined) {
      loopPlayerData.manaStacks = Math.max(loopPlayerData.manaStacks - manaStackCost, 0);
    }

    // Advance time by cast time
    if (actionCast !== undefined) { advanceLoopTime({ time: actionCast }); }
  }
  return delay; // Use for GCD actions only, probably
};

// eslint-disable-next-line no-unused-vars
const rdmStatusMatch = ({ logType, statusName, sourceID }) => {
  // Run loop again if proc issued
  if (logType === 'StatusAdd' && sourceID === currentPlayerData.id && ['Verfire Ready', 'Verstone Ready'].includes(statusName)) {
    startLoop({ delay: currentPlayerData.gcd });
  } else if (logType === 'StatusAdd' && sourceID === currentPlayerData.id && ['Acceleration', 'Swiftcast'].includes(statusName)) {
    startLoop({ delay: 1 });
  } else if (logType === 'StatusRemove' && sourceID === currentPlayerData.id && ['Acceleration', 'Dualcast', 'Swiftcast'].includes(statusName)) {
    startLoop({ delay: currentPlayerData.gcd });
  }
};

// eslint-disable-next-line no-unused-vars
const rdmTargetChanged = () => {
  // startLoop();
};

// eslint-disable-next-line no-unused-vars
const rdmLoopGCDAction = () => {
  const recastArray = loopRecastArray;
  const statusArray = loopStatusArray;

  const zwerchhauAcquired = actionData.some((element) => element.name === 'Enchanted Zwerchhau');
  const redoublementAcquired = actionData.some((element) => element.name === 'Enchanted Redoublement');
  const scorchAcquired = actionData.some((element) => element.name === 'Scorch');
  const resolutionAcquired = actionData.some((element) => element.name === 'Resolution');

  const zwerchhauCost = actionData[actionData.findIndex((element) => element.name === 'Enchanted Zwerchhau')].manaCost;
  const redoublementCost = actionData[actionData.findIndex((element) => element.name === 'Enchanted Redoublement')].manaCost;

  const { gcd } = loopPlayerData;
  const { targetCount } = loopPlayerData;
  const { comboAction } = loopPlayerData;

  const { blackMana } = loopPlayerData;
  const { whiteMana } = loopPlayerData;
  const { manaStacks } = loopPlayerData;
  const lowerMana = Math.min(blackMana, whiteMana);

  // "Continue combos"
  if (comboAction) {
    if (resolutionAcquired && comboAction === 'Scorch') { return 'Resolution'; }
    if (scorchAcquired && (comboAction === 'Verflare' || comboAction === 'Verholy')) { return 'Scorch'; }
    if (redoublementAcquired && lowerMana >= redoublementCost && comboAction === 'Enchanted Zwerchhau') { return 'Enchanted Redoublement'; }
    if (zwerchhauAcquired && lowerMana >= zwerchhauCost && comboAction === 'Enchanted Riposte') { return 'Enchanted Zwerchhau'; }
  }

  const verflareAcquired = actionData.some((element) => element.name === 'Verflare');
  const verholyAcquired = actionData.some((element) => element.name === 'Verholy');

  const verflareMana = actionData[actionData.findIndex((element) => element.name === 'Verflare')].blackMana;
  const verholyMana = actionData[actionData.findIndex((element) => element.name === 'Verholy')].whiteMana;

  const verfireDuration = checkStatusDuration({ name: 'Verfire Ready', statusArray });
  const verstoneDuration = checkStatusDuration({ name: 'Verstone Ready', statusArray });

  let finisherTime = 0;
  if (verflareAcquired) { finisherTime += gcd; }
  if (scorchAcquired) { finisherTime += gcd; }
  if (resolutionAcquired) { finisherTime += gcd; }

  // "Use 3 mana stacks ASAP"
  // Mana stacks implies level >= 68 so no need to check for Verflare explicitly
  if (manaStacks >= 3) {
    // "If one will cause you to unbalance, do the other one"
    if (verholyAcquired && Math.min(blackMana + verflareMana, 100) > whiteMana + 30) { return 'Verholy'; }
    if (Math.min(whiteMana + verholyMana, 100) > blackMana + 30) { return 'Verflare'; }

    // "Proc using lower mana (100%)"
    if (verholyAcquired && verstoneDuration <= finisherTime + gcd && blackMana > whiteMana) { return 'Verholy'; }
    if (verfireDuration <= finisherTime + gcd && blackMana < whiteMana) { return 'Verflare'; }

    // Old 5.x stuff, keeping around for no reason probably
    // // "Use Acceleration to proc (100%)"
    // if (getStatusStacks({ name: 'Acceleration', statusArray }) > 0) {
    //   if (verholyAcquired && verstoneDuration < finisherTime + gcd) { return 'Verholy'; }
    //   if (verfireDuration < finisherTime + gcd) { return 'Verflare'; }
    // }

    // "Attempt proc using higher mana (20%)"
    if (verholyAcquired && verstoneDuration <= finisherTime + gcd) { return 'Verholy'; }
    if (verfireDuration <= finisherTime + gcd) { return 'Verflare'; }

    // "Procs not possible, simply increase lower mana"
    if (verholyAcquired && blackMana >= whiteMana) { return 'Verholy'; }
    return 'Verflare';
  }

  const dualcastDuration = checkStatusDuration({ name: 'Dualcast', statusArray });
  const accelerationDuration = checkStatusDuration({ name: 'Acceleration', statusArray });
  const swiftcastDuration = checkStatusDuration({ name: 'Swiftcast', statusArray });

  // "Use Dualcast/Swiftcast/Acceleration"
  if (Math.max(dualcastDuration, accelerationDuration, swiftcastDuration) > 0) {
    // AoE
    // if (actionData.some((element) => element.name === 'Impact') && targets >= 2)
    //  return 'Impact';
    // }
    // if (actionData.some((element) => element.name === 'Scatter') && targets >= 3) {
    //  return 'Scatter';
    // }

    const verthunderAcquired = actionData.some((element) => element.name === 'Verthunder');
    const veraeroAcquired = actionData.some((element) => element.name === 'Veraero');
    const verthunder3Acquired = actionData.some((element) => element.name === 'Verthunder III');
    const veraero3Acquired = actionData.some((element) => element.name === 'Veraero III');
    const verthunderMana = actionData[actionData.findIndex((element) => element.name === 'Verthunder')].blackMana;
    const veraeroMana = actionData[actionData.findIndex((element) => element.name === 'Veraero')].whiteMana;

    // "If one will cause you to unbalance, do the other one"
    if (veraeroAcquired
    && Math.min(blackMana + verthunderMana, 100) > whiteMana + 30) {
      if (veraero3Acquired) { return 'Veraero III'; }
      return 'Veraero';
    }
    if (verthunderAcquired
    && Math.min(whiteMana + veraeroMana, 100) > blackMana + 30) {
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

  const manaficationRecast = checkActionRecast({ name: 'Manafication', recastArray });

  // const repriseAcquired = actionData.some((element) => element.name === 'Enchanted Reprise');
  // const repriseCost = actionData[actionData.findIndex((element) => element.name === 'Enchanted Reprise')].manaCost;
  // const repriseGCD = actionData[actionData.findIndex((element) => element.name === 'Enchanted Reprise')].recast;

  // const moulinetAcquired = actionData.some((element) => element.name === 'Enchanted Moulinet');
  // const moulinetCost = actionData[actionData.findIndex((element) => element.name === 'Enchanted Moulinet')].manaCost;
  // const moulinetGCD = actionData[actionData.findIndex((element) => element.name === 'Enchanted Moulinet')].recast;

  // if (moulinetAcquired && lowerMana >= moulinetCost) {
  // if (targetCount >= 3) {
  //   if (verflareAcquired && lowerMana >= moulinetCost * (3 - manaStacks)) {
  //  return 'Enchanted Moulinet';
  // }
  //   if (verflareAcquired
  // && lowerMana >= moulinetCost * Math.ceil(manaficationRecast / moulinetGCD) + 10) {
  // return 'Enchanted Moulinet';
  // }
  //   if (!verflareAcquired) { return 'Enchanted Moulinet'; }
  // }
  // if (!repriseAcquired && manaficationRecast < moulinetGCD) { return 'Enchanted Moulinet'; }
  // }

  const riposteCost = actionData[actionData.findIndex((element) => element.name === 'Enchanted Riposte')].manaCost;

  let comboTime = actionData[actionData.findIndex((element) => element.name === 'Enchanted Riposte')].recast;
  let comboCost = riposteCost;

  if (zwerchhauAcquired) {
    comboTime += actionData[actionData.findIndex((element) => element.name === 'Enchanted Zwerchhau')].recast;
    comboCost += zwerchhauCost;
  }

  if (redoublementAcquired) {
    comboTime += actionData[actionData.findIndex((element) => element.name === 'Enchanted Redoublement')].recast;
    comboCost += redoublementCost;
  }

  // Burn GCDs with Reprise (if Manafication comes up at a weird time)
  // if (repriseAcquired && lowerMana >= repriseCost) {
  //   if (manaficationRecast < comboTime + finisherTime && lowerMana >= 50) { return 'Enchanted Reprise'; }
  //   if (manaficationRecast < repriseGCD) { return 'Enchanted Reprise'; }
  // }

  if (lowerMana >= comboCost) {
    // Start combo immediately under Manafication
    if (checkStatusDuration({ name: 'Manafication', statusArray }) > 0) { return 'Enchanted Riposte'; }

    // Proc guaranteed after Verholy/Verflare
    if (verflareAcquired && verfireDuration <= comboTime + finisherTime + gcd && whiteMana > blackMana) { return 'Enchanted Riposte'; }
    if (verholyAcquired && verstoneDuration <= comboTime + finisherTime + gcd && blackMana > whiteMana) { return 'Enchanted Riposte'; }

    // "Might as well"
    if (!verflareAcquired && Math.min(verfireDuration, verstoneDuration) <= comboTime + gcd) { return 'Enchanted Riposte'; }
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
  if (Math.min(blackMana + verfireMana, 100) > whiteMana + 30) {
    if (verstoneDuration > gcd) {
      return 'Verstone';
    } if (actionData.some((element) => element.name === 'Jolt II')) {
      return 'Jolt II';
    } if (actionData.some((element) => element.name === 'Jolt')) {
      return 'Jolt';
    }
    return 'Riposte';
  }

  if (Math.min(whiteMana + verstoneMana, 100) > blackMana + 30) {
    if (verfireDuration > gcd) { return 'Verfire'; }
    if (actionData.some((element) => element.name === 'Jolt II')) { return 'Jolt II'; }
    if (actionData.some((element) => element.name === 'Jolt')) { return 'Jolt'; }
    return 'Riposte';
  }

  // Prioritize proc that would drop during combo
  if (verstoneDuration > gcd && verstoneDuration <= comboTime + finisherTime + gcd * 3) { return 'Verstone'; }
  if (verfireDuration > gcd && verfireDuration <= comboTime + finisherTime + gcd * 3) { return 'Verfire'; }

  // Raise lower mana
  if (verstoneDuration > gcd && whiteMana <= blackMana) { return 'Verstone'; }
  if (verfireDuration > gcd && blackMana <= whiteMana) { return 'Verfire'; }

  // Use something
  if (verstoneDuration > gcd) { return 'Verstone'; }
  if (verfireDuration > gcd) { return 'Verfire'; }
  if (actionData.some((element) => element.name === 'Jolt II')) { return 'Jolt II'; }
  if (actionData.some((element) => element.name === 'Jolt')) { return 'Jolt'; }
  return 'Riposte';
};

// eslint-disable-next-line no-unused-vars
const rdmLoopOGCDAction = () => {
  const recastArray = loopRecastArray;
  const statusArray = loopStatusArray;

  const { gcd } = loopPlayerData;
  const { targetCount } = loopPlayerData;
  const { comboAction } = loopPlayerData;

  const { mp } = loopPlayerData;
  const { blackMana } = loopPlayerData;
  const { whiteMana } = loopPlayerData;

  // const lowerMana = Math.min(blackMana, whiteMana);
  const higherMana = Math.max(blackMana, whiteMana);
  const manaficationRecast = checkActionRecast({ name: 'Manafication', recastArray });
  // Manafication on cooldown (???)
  if (manaficationRecast < 1 && !comboAction) { return 'Manafication'; }
  const contresixteRecast = checkActionRecast({ name: 'Contre Sixte', recastArray });
  const flecheRecast = checkActionRecast({ name: 'Fleche', recastArray });
  // console.log(flecheRecast);

  const accelerationRecast = checkActionRecast({ name: 'Acceleration', recastArray });
  const accelerationCharges = checkActionCharges({ name: 'Acceleration', recastArray });

  const swiftcastRecast = checkActionRecast({ name: 'Swiftcast', recastArray });

  // Acceleration/Swiftcast for Manafication during next GCD
  // if (manaficationRecast < gcd + 1) {
  //   if (accelerationCharges > 1) { return 'Acceleration'; }
  //   if (swiftcastRecast < 1) { return 'Swiftcast'; }
  //   if (accelerationCharges > 0) { return 'Acceleration'; }
  // }

  // Fleche/Contre Sixte spam
  if (contresixteRecast < 1 && targetCount > 1) { return 'Contre Sixte'; }
  if (flecheRecast < 1) { return 'Fleche'; }
  if (contresixteRecast < 1) { return 'Contre Sixte'; }

  // Acceleration/Swift to prevent Fleche/Contre Sixte drift
  // if (manaficationRecast > Math.min(swiftcastRecast, accelerationRecast) + gcd) {
  //   if (flecheRecast < gcd + 1 || contresixteRecast < gcd + 1) {
  //     if (accelerationCharges > 1) { return 'Acceleration'; }
  //     if (swiftcastRecast < 1) { return 'Swiftcast'; }
  //     if (accelerationCharges > 0) { return 'Acceleration'; }
  //   }
  // }

  // Acceleration for damage/procs if 2 charges up?
  if (accelerationCharges > 1 && checkStatusDuration({ name: 'Acceleration', statusArray }) <= 0) {
    if (targetCount > 1) { return 'Acceleration'; }
    if (higherMana < 80 && Math.min(checkStatusDuration({ name: 'Verfire Ready', statusArray }), checkStatusDuration({ name: 'Verstone Ready', statusArray })) < gcd + 1) { return 'Acceleration'; }
    if (higherMana < 60) { return 'Acceleration'; }
  }

  // Other OGCDs, I guess
  if (actionData.some((element) => element.name === 'Embolden') && checkActionRecast({ name: 'Embolden', recastArray }) < 1) { return 'Embolden'; }
  if (actionData.some((element) => element.name === 'Corps-a-corps') && checkActionCharges({ name: 'Corps-a-corps', recastArray }) > 1) { return 'Corps-a-corps'; }
  if (actionData.some((element) => element.name === 'Engagement') && checkActionCharges({ name: 'Engagement', recastArray }) > 1) { return 'Engagement'; }

  // Lucid, but is this even needed anymore
  if (actionData.some((element) => element.name === 'Lucid Dreaming') && mp < 8000 && checkActionRecast({ name: 'Lucid Dreaming', recastArray }) < 1) { return 'Lucid Dreaming'; }

  return null;
};
