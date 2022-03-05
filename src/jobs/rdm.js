/* globals
actionData statusData
currentPlayer currentRecastArray currentStatusArray
loopPlayer loopStatusArray loopRecastArray
startLoop advanceLoopTime
getActionProperty
addActionRecast getRecast checkActionCharges
addStatus removeStatus getStatusDuration
*/

// eslint-disable-next-line no-unused-vars
const rdmActionMatch = ({
  // logType, // Use for AoE checker?
  actionName,
  // targetID, // Not used (yet?)
  loop = false,
} = {}) => {
  // Function returns gcd delay
  if (actionName === undefined) { return 0; }

  let playerData;
  let recastArray;
  let statusArray;

  if (loop === true) {
    playerData = loopPlayer;
    recastArray = loopRecastArray;
    statusArray = loopStatusArray;
  } else {
    playerData = currentPlayer;
    recastArray = currentRecastArray;
    statusArray = currentStatusArray;
  }

  const { gcd } = playerData;
  const accelerationSpells = ['Verthunder', 'Veraero', 'Scatter', 'Verthunder III', 'Aero III', 'Impact'];
  const actionCast = getActionProperty({ actionName, property: 'cast' });
  // const actionRecast = getActionProperty({ actionName, property: 'recast' });
  const actionType = getActionProperty({ actionName, property: 'type' });

  let delay = 0;

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
  if (actionName === 'Displacement') { addActionRecast({ actionName: 'Engagement', recastArray }); }
  if (actionName === 'Engagement') { addActionRecast({ actionName: 'Displacement', recastArray }); }

  // Remove Verfire/Verstone proc
  if (actionName === 'Verfire') {
    removeStatus({ statusName: 'Verfire Ready', statusArray });
  } else if (actionName === 'Verstone') {
    removeStatus({ statusName: 'Verstone Ready', statusArray });
  }

  // Get GCD time
  if (actionType === 'Spell' && actionCast) {
    // console.log(actionCast);
    // Check for fastcast buffs and remove if necessary
    if (accelerationSpells.includes(actionName) && getStatusDuration({ statusName: 'Acceleration', statusArray }) > 0) {
      removeStatus({ statusName: 'Acceleration', statusArray });
      delay = gcd;
    } else if (getStatusDuration({ statusName: 'Dualcast', statusArray }) > 0) {
      removeStatus({ statusName: 'Dualcast', statusArray });
      delay = gcd;
    } else if (getStatusDuration({ statusName: 'Swiftcast', statusArray }) > 0) {
      removeStatus({ statusName: 'Swiftcast', statusArray });
      delay = gcd;
    } else {
      addStatus({ statusName: 'Dualcast', statusArray });
      delay = Math.max(gcd - actionCast, 0);
    }
  } else if (actionType === 'Spell') {
    delay = gcd;
  } else if (actionType === 'Weaponskill') {
    delay = gcd;
  }

  if (loop === false) {
    startLoop({ delay });
  } else {
    // Make other playerData adjustments to mimic playerChangedEvent

    // Get properties of action
    const mpCost = getActionProperty({ actionName, property: 'mpCost' });
    const blackMana = getActionProperty({ actionName, property: 'blackMana' });
    const whiteMana = getActionProperty({ actionName, property: 'whiteMana' });
    const manaCost = getActionProperty({ actionName, property: 'manaCost' });
    const manaStacks = getActionProperty({ actionName, property: 'manaStacks' });
    const manaStackCost = getActionProperty({ actionName, property: 'manaStackCost' });

    // Adjust resources
    if (mpCost !== undefined) { loopPlayer.mp = Math.max(loopPlayer.mp - mpCost, 0); }
    if (blackMana !== undefined) {
      loopPlayer.blackMana = Math.min(loopPlayer.blackMana + blackMana, 100);
    }
    if (whiteMana !== undefined) {
      loopPlayer.whiteMana = Math.min(loopPlayer.whiteMana + whiteMana, 100);
    }
    if (manaCost !== undefined) {
      loopPlayer.blackMana = Math.max(loopPlayer.blackMana - manaCost, 0);
      loopPlayer.whiteMana = Math.max(loopPlayer.whiteMana - manaCost, 0);
    }
    if (manaStacks !== undefined) {
      loopPlayer.manaStacks = Math.min(loopPlayer.manaStacks + manaStacks, 3);
    }
    if (manaStackCost !== undefined) {
      loopPlayer.manaStacks = Math.max(loopPlayer.manaStacks - manaStackCost, 0);
    }

    // Advance time by cast time
    if (actionCast !== undefined) { advanceLoopTime({ time: actionCast }); }
  }
  return delay; // Use for GCD actions only, probably
};

// eslint-disable-next-line no-unused-vars
const rdmStatusMatch = ({ logType, statusName, sourceID }) => {
  // Run loop again if proc issued
  if (logType === 'StatusAdd' && sourceID === currentPlayer.id && ['Verfire Ready', 'Verstone Ready'].includes(statusName)) {
    startLoop({ delay: currentPlayer.gcd });
  } else if (logType === 'StatusAdd' && sourceID === currentPlayer.id && ['Acceleration', 'Swiftcast'].includes(statusName)) {
    startLoop({ delay: 1 });
  } else if (logType === 'StatusRemove' && sourceID === currentPlayer.id && ['Acceleration', 'Dualcast', 'Swiftcast'].includes(statusName)) {
    startLoop({ delay: currentPlayer.gcd });
  }
};

// eslint-disable-next-line no-unused-vars
const rdmLoopGCDAction = () => {
  // const recastArray = loopRecastArray;
  const statusArray = loopStatusArray;

  const zwerchhauAcquired = actionData.some((element) => element.name === 'Enchanted Zwerchhau');
  const redoublementAcquired = actionData.some((element) => element.name === 'Enchanted Redoublement');
  const scorchAcquired = actionData.some((element) => element.name === 'Scorch');
  const resolutionAcquired = actionData.some((element) => element.name === 'Resolution');

  const zwerchhauCost = actionData[actionData.findIndex((element) => element.name === 'Enchanted Zwerchhau')].manaCost;
  const redoublementCost = actionData[actionData.findIndex((element) => element.name === 'Enchanted Redoublement')].manaCost;

  const { gcd } = loopPlayer;
  const { targetCount } = loopPlayer;
  const { comboAction } = loopPlayer;

  const { blackMana } = loopPlayer;
  const { whiteMana } = loopPlayer;
  const { manaStacks } = loopPlayer;
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

  const verfireDuration = getStatusDuration({ statusName: 'Verfire Ready', statusArray });
  const verstoneDuration = getStatusDuration({ statusName: 'Verstone Ready', statusArray });

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
    // if (getStatusStacks({ statusName: 'Acceleration', statusArray }) > 0) {
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

  const dualcastDuration = getStatusDuration({ statusName: 'Dualcast', statusArray });
  const accelerationDuration = getStatusDuration({ statusName: 'Acceleration', statusArray });
  const swiftcastDuration = getStatusDuration({ statusName: 'Swiftcast', statusArray });

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

  // const manaficationRecast = getRecast({ actionName: 'Manafication', recastArray });

  // const repriseIndex = actionData.findIndex((element) => element.name === 'Enchanted Reprise');
  // const repriseCost = actionData[repriseIndex].manaCost;
  // const repriseGCD = actionData[repriseIndex].recast;

  // const moulinetIndex = actionData.findIndex((element) => element.name === 'Enchanted Moulinet');
  // const moulinetCost = actionData[moulinetIndex].manaCost;
  // const moulinetGCD = actionData[moulinetIndex].recast;

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
  //   if (manaficationRecast < comboTime + finisherTime && lowerMana >= 50) {
  // return 'Enchanted Reprise';
  // }
  //   if (manaficationRecast < repriseGCD) { return 'Enchanted Reprise'; }
  // }

  if (lowerMana >= comboCost) {
    // Start combo immediately under Manafication
    if (getStatusDuration({ statusName: 'Manafication', statusArray }) > 0) { return 'Enchanted Riposte'; }

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

  const { gcd } = loopPlayer;
  const { targetCount } = loopPlayer;
  const { comboAction } = loopPlayer;

  const { mp } = loopPlayer;
  const { blackMana } = loopPlayer;
  const { whiteMana } = loopPlayer;

  // const lowerMana = Math.min(blackMana, whiteMana);
  const higherMana = Math.max(blackMana, whiteMana);
  const manaficationRecast = getRecast({ actionName: 'Manafication', recastArray });
  // Manafication on cooldown (???)
  if (manaficationRecast < 1 && !comboAction) { return 'Manafication'; }
  const contresixteRecast = getRecast({ actionName: 'Contre Sixte', recastArray });
  const flecheRecast = getRecast({ actionName: 'Fleche', recastArray });
  // console.log(flecheRecast);

  // const accelerationRecast = getRecast({ actionName: 'Acceleration', recastArray });
  const accelerationCharges = checkActionCharges({ actionName: 'Acceleration', recastArray });

  // const swiftcastRecast = getRecast({ actionName: 'Swiftcast', recastArray });

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
  if (accelerationCharges > 1 && getStatusDuration({ statusName: 'Acceleration', statusArray }) <= 0) {
    if (targetCount > 1) { return 'Acceleration'; }
    if (higherMana < 80 && Math.min(getStatusDuration({ statusName: 'Verfire Ready', statusArray }), getStatusDuration({ statusName: 'Verstone Ready', statusArray })) < gcd + 1) { return 'Acceleration'; }
    if (higherMana < 60) { return 'Acceleration'; }
  }

  // Other OGCDs, I guess
  if (actionData.some((element) => element.name === 'Embolden') && getRecast({ actionName: 'Embolden', recastArray }) < 1) { return 'Embolden'; }
  if (actionData.some((element) => element.name === 'Corps-a-corps') && checkActionCharges({ actionName: 'Corps-a-corps', recastArray }) > 1) { return 'Corps-a-corps'; }
  if (actionData.some((element) => element.name === 'Engagement') && checkActionCharges({ actionName: 'Engagement', recastArray }) > 1) { return 'Engagement'; }

  // Lucid, but is this even needed anymore
  if (actionData.some((element) => element.name === 'Lucid Dreaming') && mp < 8000 && getRecast({ actionName: 'Lucid Dreaming', recastArray }) < 1) { return 'Lucid Dreaming'; }

  return null;
};

// eslint-disable-next-line no-unused-vars
const rdmTraits = ({ level } = {}) => {
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
  currentPlayer.mp = e.detail.currentMP;
  currentPlayer.blackMana = e.detail.jobDetail.blackMana;
  currentPlayer.whiteMana = e.detail.jobDetail.whiteMana;
  currentPlayer.manaStacks = e.detail.jobDetail.manaStacks;
};

// eslint-disable-next-line no-unused-vars
const rdmTargetChanged = () => { startLoop(); };

// eslint-disable-next-line no-unused-vars
const rdmgetDelay = ({
  actionName,
  playerData = currentPlayer,
  // recastArray = currentRecastArray,
  statusArray = currentStatusArray,
} = {}) => {
  const { gcd } = playerData;
  const actionCast = getActionProperty({ actionName, property: 'cast' });
  const actionType = getActionProperty({ actionName, property: 'type' });
  const actionRecast = getActionProperty({ actionName, property: 'recast' });

  const accelerationSpells = ['Verthunder', 'Veraero', 'Scatter', 'Verthunder III', 'Aero III', 'Impact'];

  let delay = 0;

  if (actionType === 'Weaponskill') {
    if (actionName === 'Enchanted Riposte') { return 1.5; }
    if (actionName === 'Enchanted Zwerchhau') { return 1.5; }
    if (actionName === 'Enchanted Redoublement') { return 2.2; }
    return 2.5;
  }

  // Get GCD time for spells with cast times
  if (actionType === 'Spell' && actionCast) {    
    if (accelerationSpells.includes(actionName) && getStatusDuration({ statusName: 'Acceleration', statusArray }) > 0) {
      removeStatus({ statusName: 'Acceleration', statusArray });
      return gcd;
    } else if (getStatusDuration({ statusName: 'Dualcast', statusArray }) > 0) {
      removeStatus({ statusName: 'Dualcast', statusArray });
      return gcd;
    }
    if (getStatusDuration({ statusName: 'Swiftcast', statusArray }) > 0) {
      removeStatus({ statusName: 'Swiftcast', statusArray });
      return gcd;
    }
    
    addStatus({ statusName: 'Dualcast', statusArray });
    return Math.max(gcd - actionCast, 0);
  }

  return gcd; // Includes no-cast spells
};