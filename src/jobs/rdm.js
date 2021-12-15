/* globals
playerData actionData statusData
startLoop advanceLoopTime
loopPlayerData loopStatusArray loopRecastArray
setActionRecast getActionRecast getActionCharges getActionProperty
setStatus removeStatus getStatusDuration useStatusStacks
*/

// eslint-disable-next-line no-unused-vars
const rdmTraits = () => {
  const { level } = playerData;

  if (level >= 62) {
    const actionDataIndex = actionData.findIndex((element) => element.name === 'Jolt');
    actionData.splice(actionDataIndex, 1);
  }

  if (level >= 66) {
    const actionDataIndex = actionData.findIndex((element) => element.name === 'Scatter');
    actionData.splice(actionDataIndex, 1);
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
  playerData.mp = e.detail.currentMP;
  playerData.blackMana = e.detail.jobDetail.blackMana;
  playerData.whiteMana = e.detail.jobDetail.whiteMana;
  // console.log(`${playerData.blackMana} | ${playerData.whiteMana}`);
};

// eslint-disable-next-line no-unused-vars
const rdmActionMatch = ({ logType, actionName, targetID } = {}) => {
  // let { targetCount } = playerData;
  let delay;
  // const actionType = getActionProperty({ name: actionName, property: 'type' });
  // const actionRecast = getActionProperty({ name: actionName, property: 'recast' });
  const actionCast = getActionProperty({ name: actionName, property: 'cast' });

  // // Identify probable target count
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
  if (actionName === 'Displacement') { setActionRecast({ name: 'Engagement' }); }
  if (actionName === 'Engagement') { setActionRecast({ name: 'Displacement' }); }

  // Get GCD time
  if (actionCast !== undefined) {
    if (['Verthunder', 'Veraero', 'Scatter', 'Verthunder III', 'Aero III', 'Impact'].includes(actionName)
    && getStatusDuration({ name: 'Acceleration' }) > 0) {
      delay = playerData.gcd;
    } else if (Math.min(getStatusDuration({ name: 'Dualcast' }), getStatusDuration({ name: 'Swiftcast' })) > 0) {
      // Dualcast or Swiftcast
      delay = playerData.gcd;
    } else {
      setStatus({ name: 'Dualcast' }); // Probably easiest to set Dualcast on this line
      delay = Math.min(0, playerData.gcd - actionCast);
    }
  } else {
    delay = playerData.gcd;
  }

  return delay;
};

// eslint-disable-next-line no-unused-vars
const rdmStatusMatch = ({ logType, statusName, sourceID }) => {
  // Run loop again if proc issued
  if (logType === 'StatusAdd' && sourceID === playerData.id && ['Verfire Ready', 'Verstone Ready'].includes(statusName)) {
    startLoop({ delay: playerData.gcd });
  }
};

// eslint-disable-next-line no-unused-vars
const rdmTargetChanged = () => {
  startLoop();
};

// eslint-disable-next-line no-unused-vars
const rdmLoopGCDAction = () => {
  const { blackMana } = loopPlayerData;
  const { whiteMana } = loopPlayerData;
  const lowerMana = Math.min(blackMana, whiteMana);
  // const higherMana = Math.max(blackMana, whiteMana);

  const targets = 1;
  const { gcd } = loopPlayerData;
  const { comboAction } = loopPlayerData;

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

  const manaficationRecast = getActionRecast({ name: 'Manafication', array: loopRecastArray });

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
  if (playerData.targetCount >= 3) {
    if (veraero2Acquired && whiteMana <= blackMana) { return 'Veraero II'; }
    if (verthunder2Acquired) { return 'Verthunder II'; }
  }

  // "Hardcast stuff"

  // "If one will cause you to unbalance, do the other one"
  if (Math.min(blackMana + verfireMana, 100) > whiteMana + 30) {
    if (verstoneDuration >= gcd) {
      return 'Verstone';
    } if (actionData.some((element) => element.name === 'Jolt II')) {
      return 'Jolt II';
    } if (actionData.some((element) => element.name === 'Jolt')) {
      return 'Jolt';
    }
    return 'Riposte';
  }
  if (Math.min(whiteMana + verstoneMana, 100) > blackMana + 30) {
    if (verfireDuration >= gcd) {
      return 'Verfire';
    } if (actionData.some((element) => element.name === 'Jolt II')) {
      return 'Jolt II';
    } if (actionData.some((element) => element.name === 'Jolt')) {
      return 'Jolt';
    }
    return 'Riposte';
  }

  // Prioritize proc that would drop during combo
  if (verstoneDuration < comboTime + finisherTime + gcd * 3) {
    return 'Verstone';
  }
  if (verfireDuration < comboTime + finisherTime + gcd * 3) {
    return 'Verfire';
  }

  // Raise lower mana
  if (verstoneDuration >= gcd && whiteMana <= blackMana) {
    return 'Verstone';
  }
  if (verfireDuration >= gcd && blackMana <= whiteMana) {
    return 'Verfire';
  }

  // Use something
  if (verstoneDuration >= gcd) {
    return 'Verstone';
  }
  if (verfireDuration >= gcd) {
    return 'Verfire';
  }

  if (actionData.some((element) => element.name === 'Jolt II')) {
    return 'Jolt II';
  }
  if (actionData.some((element) => element.name === 'Jolt')) {
    return 'Jolt';
  }
  return 'Riposte';
};

// eslint-disable-next-line no-unused-vars
const rdmLoopOGCDAction = () => {
  const { mp } = loopPlayerData;
  const { gcd } = loopPlayerData;
  const { targetCount } = loopPlayerData;

  // const lowerMana = Math.min(blackMana, whiteMana);
  const higherMana = Math.max(loopPlayerData.blackMana, loopPlayerData.whiteMana);
  const manaficationRecast = getActionRecast({ name: 'Manafication', array: loopRecastArray });
  // Manafication on cooldown (???)
  if (manaficationRecast < 1 && !loopPlayerData.comboAction) { return 'Manafication'; }

  const contresixteRecast = getActionRecast({ name: 'Contre Sixte', array: loopRecastArray });
  const flecheRecast = getActionRecast({ name: 'Fleche', array: loopRecastArray });

  const accelerationRecast = getActionRecast({ name: 'Acceleration', array: loopRecastArray });
  const accelerationCharges = getActionCharges({ name: 'Acceleration', array: loopRecastArray });

  const swiftcastRecast = getActionRecast({ name: 'Swiftcast', array: loopRecastArray });

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
  if (actionData.some((element) => element.name === 'Embolden') && getActionRecast({ name: 'Embolden', array: loopRecastArray }) < 1) { return 'Embolden'; }
  if (actionData.some((element) => element.name === 'Corps-a-corps') && getActionCharges({ name: 'Corps-a-corps', array: loopRecastArray }) > 1) { return 'Corps-a-corps'; }
  if (actionData.some((element) => element.name === 'Engagement') && getActionCharges({ name: 'Engagement', array: loopRecastArray }) > 1) { return 'Engagement'; }

  // Lucid, but is this even needed anymore
  if (actionData.some((element) => element.name === 'Lucid Dreaming') && mp < 8000 && getActionRecast({ name: 'Lucid Dreaming', array: loopRecastArray }) < 1) { return 'Lucid Dreaming'; }

  return undefined;
};

// Accounts for effect of GCD action and returns OGCD window
// eslint-disable-next-line no-unused-vars
const rdmLoopGCDActionResult = ({ actionName } = {}) => {
  if (actionName === undefined) { return 0; }

  const actionType = getActionProperty({ name: actionName, property: 'type' });

  let actionCast = getActionProperty({ name: actionName, property: 'cast' }); // Not const due to Dualcast, etc.
  if (actionCast === undefined) { actionCast = 0; }
  // const actionRecast = getActionProperty({ name: actionName, property: 'recast' });

  const mpCost = getActionProperty({ name: actionName, property: 'mpCost' });
  const blackMana = getActionProperty({ name: actionName, property: 'blackMana' });
  const whiteMana = getActionProperty({ name: actionName, property: 'whiteMana' });
  const manaCost = getActionProperty({ name: actionName, property: 'manaCost' });
  const manaStacks = getActionProperty({ name: actionName, property: 'manaStacks' });
  const manaStackCost = getActionProperty({ name: actionName, property: 'manaStackCost' });

  // Adjust all resources
  loopPlayerData.mp -= mpCost;
  loopPlayerData.blackMana = Math.min(loopPlayerData.blackMana + blackMana, 100);
  loopPlayerData.whiteMana = Math.min(loopPlayerData.whiteMana + whiteMana, 100);
  loopPlayerData.blackMana = Math.max(loopPlayerData.blackMana - manaCost, 0);
  loopPlayerData.whiteMana = Math.max(loopPlayerData.whiteMana - manaCost, 0);
  loopPlayerData.manaStacks += manaStacks;
  loopPlayerData.manaStacks -= manaStackCost;

  // Combo
  if (actionData.some((element) => element.comboAction
  && element.comboAction.includes(actionName))) {
    setStatus({ name: 'Combo', array: loopStatusArray });
  } else {
    removeStatus({ name: 'Combo', array: loopStatusArray });
  }

  // Remove Verfire/Verstone proc
  if (actionName === 'Verfire') {
    removeStatus({ name: 'Verfire Ready', array: loopStatusArray });
  } else if (actionName === 'Verstone') {
    removeStatus({ name: 'Verstone Ready', array: loopStatusArray });
  }

  // Acceleration/Swiftcast/Dualcast shenanigans
  const accelerationDuration = getStatusDuration({ name: 'Acceleration', array: loopStatusArray });
  const swiftcastDuration = getStatusDuration({ name: 'Swiftcast', array: loopStatusArray });
  const dualcastDuration = getStatusDuration({ name: 'Dualcast', array: loopStatusArray });
  const accelerationSpells = ['Verthunder', 'Veraero', 'Scatter', 'Impact', 'Verthunder III', 'Veraero III'];
  // console.log(`${accelerationDuration} ${swiftcastDuration} ${dualcastDuration}`);

  if (accelerationDuration > 0
      && accelerationSpells.includes(actionName)) {
    actionCast = 0;
    removeStatus({ name: 'Acceleration', array: loopStatusArray });
    if (['Verthunder', 'Verthunder III'].includes(actionName)) {
      setStatus({ name: 'Verfire Ready', array: loopStatusArray });
    } else if (['Veraero', 'Veraero III'].includes(actionName)) {
      setStatus({ name: 'Verstone Ready', array: loopStatusArray });
    }
    // console.log('Acceleration removed');
  } else if (swiftcastDuration > 0 && actionType === 'Spell') {
    actionCast = 0;
    removeStatus({ name: 'Swiftcast', array: loopStatusArray });
    // console.log('Swiftcast removed');
  } else if (dualcastDuration > 0) {
    actionCast = 0;
    removeStatus({ name: 'Dualcast', array: loopStatusArray });
    // console.log('Dualcast removed');
  } else if (actionCast > 0) {
    setStatus({ name: 'Dualcast', array: loopStatusArray });
    advanceLoopTime({ time: actionCast });
    // console.log('Dualcast set');
  }
  // console.log(`${loopPlayerData.blackMana} | ${loopPlayerData.whiteMana}`);

  return Math.max(playerData.gcd - actionCast, 0);
};

// eslint-disable-next-line no-unused-vars
const rdmLoopOGCDActionResult = ({ actionName } = {}) => {
  if (actionName === undefined) { return; }

  if (actionName === 'Displacement') {
    setActionRecast({ name: 'Engagement', array: loopRecastArray });
  } else if (actionName === 'Engagement') {
    setActionRecast({ name: 'Displacement', array: loopRecastArray });
  } else if (actionName === 'Manafication') {
    loopPlayerData.blackMana = Math.min(loopPlayerData.blackMana + 50, 100);
    loopPlayerData.whiteMana = Math.min(loopPlayerData.whiteMana + 50, 100);
  }
};
