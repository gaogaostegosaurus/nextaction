/* globals nextAction,
playerData, actionData:writable, statusData,
recastArray, statusArray,
getRecast, getCharges,
addActionRecast,
syncIcons, setStatus, removeStatus, getActionProperty, getActionProperty, getStatusDuration */

// eslint-disable-next-line no-unused-vars
const rdmTraits = () => {
  const { level } = playerData;

  // Filter actions
  // Traits
  if (level >= 62) {
    const index = actionData.findIndex((element) => element.name === 'Jolt');
    actionData = actionData.splice(index, 1);
    // index = actionData.findIndex((element) => element.name === 'Verthunder');
    // actionData[index].potency = 370;
    // index = actionData.findIndex((element) => element.name === 'Veraero');
    // actionData[index].potency = 370;
    // index = actionData.findIndex((element) => element.name === 'Verfire');
    // actionData[index].potency = 310;
    // index = actionData.findIndex((element) => element.name === 'Verstone');
    // actionData[index].potency = 310;
  }

  if (level >= 66) {
    const index = actionData.findIndex((element) => element.name === 'Scatter');
    actionData = actionData.splice(index, 1);
  }

  // if (level >= 72) {
  //   const index = actionData.findIndex((element) => element.name === 'Displacement');
  //   actionData[index].potency = 200;
  // }

  if (level >= 74) {
    const index = actionData.findIndex((element) => element.name === 'Manafication');
    actionData[index].recast = 110;
    actionData[index].status = 'Manafication';
  }

  if (level >= 78) {
    const index = actionData.findIndex((element) => element.name === 'Contre Sixte');
    actionData[index].recast = 35000;
    // index = actionData.findIndex((element) => element.name === 'Verthunder II');
    // actionData[index].potency = 120;
    // index = actionData.findIndex((element) => element.name === 'Veraero II');
    // actionData[index].potency = 120;
  }

  if (level >= 88) {
    const index = actionData.findIndex((element) => element.name === 'Acceleration');
    actionData[index].charges = 2;
  }

  if (level >= 90) {
    const index = statusData.findIndex((element) => element.name === 'Manafication');
    statusData[index].stacks = 6;
  }
};

// eslint-disable-next-line no-unused-vars
const rdmPlayerChanged = (e) => {
  playerData.mp = e.detail.currentMP;
  playerData.blackMana = e.detail.jobDetail.blackMana;
  playerData.whiteMana = e.detail.jobDetail.whiteMana;
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
  const { mp } = loopPlayerData;
  const { gcd } = loopPlayerData;
  const { targetCount } = loopPlayerData;

  // const lowerMana = Math.min(blackMana, whiteMana);
  const higherMana = Math.max(loopPlayerData.blackMana, loopPlayerData.whiteMana);
  const manaficationRecast = getRecast({ name: 'Manafication', array: loopRecastArray });
  // Manafication on cooldown (???)
  if (manaficationRecast < 1 && !loopPlayerData.comboAction) { return 'Manafication'; }

  const contresixteRecast = getRecast({ name: 'Contre Sixte', array: loopRecastArray });
  const flecheRecast = getRecast({ name: 'Fleche', array: loopRecastArray });

  const accelerationRecast = getRecast({ name: 'Acceleration', array: loopRecastArray });
  const accelerationCharges = getCharges({ name: 'Acceleration', array: loopRecastArray });

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

const rdmLoop = ({
  delay, // Set remaining global cooldown, after instant cast or short cast actions
  casting, // Use for calling function from StartsCasting lines
} = {}) => {
  // Array for actions to sync to overlay
  const actionArray = [];

  // Clone arrays/objects for looping
  const loopPlayerData = { ...playerData };
  const loopRecastArray = [...recastArray];
  const loopStatusArray = [...statusArray];

  // Initial values for loop control
  const maxActions = 100; // Maximum number of actions looked up
  let ogcdWindow = delay;

  // Shift recast/durations by cast time if casting
  // Casted spell will be first action displayed
  if (casting) {
    const actionCast = getActionProperty({ name: casting, property: 'cast' });
    const actionCastMilliseconds = actionCast * 1000;
    const actionRecast = getActionProperty({ name: casting, property: 'recast' });

    loopRecastArray.forEach(
      (element) => element.recast === element.recast - actionCastMilliseconds,
    );
    loopStatusArray.forEach(
      (element) => element.duration === element.duration - actionCastMilliseconds,
    );

    ogcdWindow = actionRecast - actionCast;
    actionArray.push({ name: casting });
  }

  // Start loop here
  while (actionArray.length <= maxActions) {
    if (ogcdWindow <= 0) {
      // Find best action
      const actionName = rdmNextGCD({ loopPlayerData, loopRecastArray, loopStatusArray });

      // Add GCD action to array
      actionArray.push({ name: actionName });

      // Get useful action properties
      const actionType = getActionProperty({ name: actionName, property: 'type' });
      const actionCast = getActionProperty({ name: actionName, property: 'cast' });
      const actionRecast = getActionProperty({ name: actionName, property: 'recast' });

      // Calculate default ogcd window length (seconds)
      ogcdWindow = actionRecast - actionCast;

      // Get resource changes
      const mpCost = getActionProperty({ name: actionName, property: 'mpCost' });
      const blackMana = getActionProperty({ name: actionName, property: 'blackMana' });
      const whiteMana = getActionProperty({ name: actionName, property: 'whiteMana' });
      const manaCost = getActionProperty({ name: actionName, property: 'manaCost' });
      const manaStacks = getActionProperty({ name: actionName, property: 'manaStacks' });
      const manaStackCost = getActionProperty({ name: actionName, property: 'manaStackCost' });

      // Adjust resources
      loopPlayerData.mp -= mpCost;
      loopPlayerData.blackMana = Math.min(loopPlayerData.blackMana + blackMana, 100);
      loopPlayerData.whiteMana = Math.min(loopPlayerData.whiteMana + whiteMana, 100);
      loopPlayerData.blackMana = Math.max(loopPlayerData.blackMana - manaCost, 0);
      loopPlayerData.whiteMana = Math.max(loopPlayerData.whiteMana - manaCost, 0);
      loopPlayerData.manaStacks += manaStacks;
      loopPlayerData.manaStacks -= manaStackCost;

      // Find possible combo action or end combo otherwise
      if (actionData.some((element) => element.comboAction.includes(actionName))) {
        setStatus({ name: 'Combo ', array: loopStatusArray });
      } else {
        removeStatus({ name: 'Combo ', array: loopStatusArray });
      }

      // Remove Verfire/Verstone proc
      if (actionName === 'Verfire') {
        removeStatus({ name: 'Verfire Ready', array: loopStatusArray });
      } else if (actionName === 'Verstone') {
        removeStatus({ name: 'Verstone Ready', array: loopStatusArray });
      }

      const accelerationDuration = getStatusDuration({ name: 'Acceleration', array: loopStatusArray });
      const swiftcastDuration = getStatusDuration({ name: 'Swiftcast', array: loopStatusArray });
      const dualcastDuration = getStatusDuration({ name: 'Dualcast', array: loopStatusArray });
      const accelerationSpells = ['Verthunder', 'Veraero', 'Scatter', 'Impact', 'Verthunder III', 'Veraero III'];
      // Acceleration/Swiftcast/Dualcast shenanigans
      if (accelerationDuration > 0
      && accelerationSpells.includes(actionName)) {
        ogcdWindow = actionRecast;
        removeStatus({ name: 'Acceleration', array: loopStatusArray });
        if (['Verthunder', 'Verthunder III'].includes(actionName)) {
          setStatus({ name: 'Verfire Ready', array: loopStatusArray });
        } else if (['Veraero', 'Veraero III'].includes(actionName)) {
          setStatus({ name: 'Verstone Ready', array: loopStatusArray });
        }
      } else if (swiftcastDuration > 0 && actionType === 'Spell') {
        ogcdWindow = actionRecast;
        removeStatus({ name: 'Swiftcast', array: loopStatusArray });
      } else if (dualcastDuration > 0) {
        ogcdWindow = actionRecast;
        removeStatus({ name: 'Swiftcast', array: loopStatusArray });
      }
    }

    let weaveMax = 0;
    if (ogcdWindow > 2.25) {
      weaveMax = 2;
    } else if (ogcdWindow > 0.75) {
      weaveMax = 1;
    }

    let weave = 1;

    let ogcdWindowMilliseconds = ogcdWindow * 1000;

    ogcdWindowMilliseconds -= 100;
    loopRecastArray.forEach((element) => element.recast === element.recast - 100);
    loopStatusArray.forEach((element) => element.duration === element.duration - 100);

    // Second loop for OGCDs
    while (weave <= weaveMax) {
      // Find next OGCD
      const actionName = rdmNextOGCD({ loopPlayerData, loopRecastArray, loopStatusArray });

      // Push into array
      if (actionName) { actionArray.push({ name: actionName, ogcd: true }); }

      // Increment for next weave
      if (weave < weaveMax) {
        ogcdWindow -= 1000;
        loopRecastArray.forEach((element) => element.recast === element.recast - 1000);
        loopStatusArray.forEach((element) => element.duration === element.duration - 1000);
      }
      weave += 1; // Increment regardless if OGCD was added; some skills only go on weave 2
    }

    // Subtract remaining ogcd window
    const remainingDelay = ogcdWindowMilliseconds;
    loopRecastArray.forEach((element) => element.recast === element.recast - remainingDelay);
    loopStatusArray.forEach((element) => element.duration === element.duration - remainingDelay);
  }

  syncIcons({ actionArray });
};

// eslint-disable-next-line no-unused-vars
const rdmActionMatch = ({ logType, actionName, targetID } = {}) => {
  let { targetCount } = nextAction;
  let delay;
  const actionType = getActionProperty({ name: actionName, property: 'type' });
  const actionRecast = getActionProperty({ name: actionName, property: 'recast' });
  const actionCast = getActionProperty({ name: actionName, property: 'cast' });

  // Identify probable target count
  if (logType === 'AOEAction Effect 16') {
    if (['Scatter', 'Verthunder II', 'Veraero II', 'Moulinet'].includes(actionName)) { targetCount = 3; } else if (actionName === 'Impact' && targetCount === 1) { targetCount = 2; }
  } else if (['Jolt', 'Verfire', 'Verstone', 'Jolt II'].includes(actionName) && targetCount < 2) { targetCount = 2; } else { targetCount = 1; }

  // Add cooldowns
  addActionRecast({ name: actionName });

  // Add linked cooldowns
  if (actionName === 'Displacement') { addActionRecast({ name: 'Engagement' }); }
  if (actionName === 'Engagement') { addActionRecast({ name: 'Displacement' }); }

  // Get GCD time
  if (actionType === 'Weaponskill') {
    delay = actionRecast;
  } else if (actionType === 'Spell') {
    if (['Verthunder', 'Veraero', 'Scatter', 'Verthunder III', 'Aero III', 'Impact'].includes(actionName)
    && getStatusDuration({ name: 'Acceleration' }) > 0) {
      delay = actionRecast;
    } else if (Math.min(getStatusDuration({ name: 'Dualcast' }), getStatusDuration({ name: 'Swiftcast' })) > 0) {
      // Dualcast or Swiftcast
      delay = actionRecast;
    } else {
      delay = Math.min(0, actionRecast - actionCast);
    }
  }

  // Start loop
  rdmLoop({ delay });
};

// eslint-disable-next-line no-unused-vars
const rdmStatusMatch = ({ statusName, sourceID }) => {
  // Run loop again if proc issued
  if (sourceID === playerData.id && ['Verfire Ready', 'Verstone Ready'].includes(statusName)) {
    rdmLoop({ delay: playerData.gcd });
  }
};
