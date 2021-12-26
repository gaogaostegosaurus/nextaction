/* globals
actionData getActionDataProperty
currentPlayerData currentStatusArray calculateDelay
loopPlayerData loopRecastArray loopStatusArray
addActionRecast checkActionRecast resetActionRecast calculateRecast
addStatus removeStatus removeStatusStacks checkStatusDuration
startLoop
*/

// eslint-disable-next-line no-unused-vars
const ninTraits = ({ level } = {}) => {
  if (level >= 56) {
    const actionDataIndex = actionData.findIndex((element) => element.name === 'Assassinate');
    actionData.splice(actionDataIndex, 1);
  }

  if (level >= 62) {
    actionData.forEach((element) => {
      if (element.type === 'Weaponskill') {
        // eslint-disable-next-line no-param-reassign
        element.ninki = 5;
      }
    });
  }

  if (level >= 66) {
    const actionDataIndex = actionData.findIndex((element) => element.name === 'Mug');
    actionData[actionDataIndex].ninki = 40;
  }

  if (level >= 78) {
    let actionDataIndex;
    actionDataIndex = actionData.findIndex((element) => element.name === 'Aeolian Edge');
    actionData[actionDataIndex].ninki = 10;
    actionDataIndex = actionData.findIndex((element) => element.name === 'Armor Crush');
    actionData[actionDataIndex].ninki = 10;
  }

  if (level >= 84) {
    let actionDataIndex;
    actionDataIndex = actionData.findIndex((element) => element.name === 'Aeolian Edge');
    actionData[actionDataIndex].ninki = 15;
    actionDataIndex = actionData.findIndex((element) => element.name === 'Armor Crush');
    actionData[actionDataIndex].ninki = 15;
  }

  if (level >= 88) {
    const actionDataIndex = actionData.findIndex((element) => element.name === 'Meisui');
    actionData[actionDataIndex].status = 'Meisui'; // check name later
  }

  if (level >= 90) {
    const actionDataIndex = actionData.findIndex((element) => element.name === 'Raiton');
    actionData[actionDataIndex].status = 'Forked Raiju Ready';
  }
};

// eslint-disable-next-line no-unused-vars
const ninPlayerChanged = (e) => {
  // Recalculate GCD if Huton status has apparently changed
  if (currentPlayerData.huton > 0 && e.detail.jobDetail.hutonMilliseconds === 0) {
    // Huton recently fell off
    currentPlayerData.gcd = calculateRecast({ modifier: 1 });
  } else if (currentPlayerData.huton === 0 && e.detail.jobDetail.hutonMilliseconds > 0) {
    // Huton recently applied
    currentPlayerData.gcd = calculateRecast({ modifier: 0.85 });
  }

  // Standard stuff otherwise
  currentPlayerData.hp = e.detail.currentHP;
  currentPlayerData.huton = e.detail.jobDetail.hutonMilliseconds / 1000;
  currentPlayerData.ninki = e.detail.jobDetail.ninkiAmount;
};

// eslint-disable-next-line no-unused-vars
const ninTargetChanged = () => {
  const mudraDuration = checkStatusDuration({ statusName: 'Mudra', statusArray: currentStatusArray });
  const kassatsuDuration = checkStatusDuration({ statusName: 'Kassatsu', statusArray: currentStatusArray });
  const tenChiJinDuration = checkStatusDuration({ statusName: 'Ten Chi Jin', statusArray: currentStatusArray });
  if (Math.max(mudraDuration, kassatsuDuration, tenChiJinDuration) === 0) {
    startLoop();
  }
};

// eslint-disable-next-line no-unused-vars
const ninActionMatch = ({
  // logType, // Currently unused parameters commented out
  actionName,
  // targetID,
  playerData,
  recastArray,
  statusArray,
  loop,
} = {}) => {
  const actionTargetCount = getActionDataProperty({ actionName, property: 'targetCount' });

  // eslint-disable-next-line no-param-reassign
  if (actionTargetCount) { playerData.targetCount = actionTargetCount; }

  const actionType = getActionDataProperty({ actionName, property: 'type' });

  // Ninjutsu is so damn annoying
  if (actionType === 'Mudra'
  && checkStatusDuration({ statusName: 'Mudra', statusArray }) === 0
  && checkStatusDuration({ statusName: 'Kassatsu', statusArray }) === 0) {
    // Only add recast if Mudra and Kassatsu are not activated
    addActionRecast({ actionName: 'Mudra', recastArray });
    addStatus({ statusName: 'Mudra', statusArray });
  }

  if (actionType === 'Ninjutsu') {
    // Remove Mudra/Kassatsu/TCJ on Ninjutsu activation
    removeStatus({ statusName: 'Mudra', statusArray });
    removeStatus({ statusName: 'Kassatsu', statusArray });

    // Best way to account for TCJ weirdness is to treat it like it has stacks... maybe
    removeStatusStacks({ statusName: 'Ten Chi Jin', statusArray });

    if (actionName === 'Doton') {
      addStatus({ statusName: 'Doton', statusArray });
    } else if (actionName === 'Suiton') {
      addStatus({ statusName: 'Suiton', statusArray });
    }
  }

  if (actionName === 'Hide') {
    // Hide reset
    resetActionRecast({ actionName: 'Mudra', recastArray });
  } else if (actionName === 'Trick Attack') {
    // "Self-buff" to simplify alignment calculations
    removeStatus({ statusName: 'Suiton', statusArray });
    addStatus({ statusName: 'Trick Attack', statusArray });
  } else if (actionName === 'Kassatsu') {
    addStatus({ statusName: 'Kassatsu', statusArray });
  } else if (actionName === 'Ten Chi Jin') {
    addStatus({ statusName: 'Ten Chi Jin', stacks: 3, statusArray });
  } else if (actionName === 'Bunshin') {
    // Leaving actual Bunshin out because it doesn't really affect decision-making(?)
    // addStatus({ statusName: 'Bunshin', stacks: 5, statusArray });
    // Add Phantom Kamaitachi alongside Bunshin for simulation
    if (actionData.some((element) => element.name === 'Phantom Kamaitachi')) { addStatus({ statusName: 'Phantom Kamaitachi Ready', statusArray }); }
  } else if (actionName === 'Phantom Kamaitachi') {
    // Remove since it effectively has an infinite time
    removeStatus({ statusName: 'Phantom Kamaitachi Ready', statusArray });
  }

  // Start loop if not in it already
  if (!loop && checkStatusDuration({ statusName: 'Ten Chi Jin', statusArray }) === 0
  && ['Spell', 'Weaponskill', 'Ninjutsu'].includes(actionType)) {
    const delay = calculateDelay({ actionName, playerData, statusArray });
    startLoop({ delay });
  }
};

// eslint-disable-next-line no-unused-vars
const ninStatusMatch = ({ logType, statusName, sourceID }) => {
  // if (logType === 'StatusRemove' && ['Mudra', 'Kassatsu', 'Ten Chi Jin'].includes(statusName)) {
  //   // These should all come off after an final ninjutsu cast
  //   // Good point to update?
  //   startLoop({ delay: 1.5 });
  // }
};

// eslint-disable-next-line no-unused-vars
const ninLoopPlayerChanged = ({
  actionName,
  playerData = loopPlayerData,
  // recastArray = loopRecastArray,
  statusArray = loopStatusArray,
} = {}) => {
  const actionType = getActionDataProperty({ actionName, property: 'type' });

  // Add Huton time
  const huton = getActionDataProperty({ actionName, property: 'huton' });
  // eslint-disable-next-line no-param-reassign
  playerData.huton = Math.min(playerData.huton + huton, 60);

  // Make changes to Ninki
  const ninki = getActionDataProperty({ actionName, property: 'ninki' });
  const ninkiCost = getActionDataProperty({ actionName, property: 'ninkiCost' });
  const bunshinDuration = checkStatusDuration({ statusName: 'Bunshin', statusArray });
  // eslint-disable-next-line no-param-reassign
  playerData.ninki = Math.min(playerData.ninki + ninki, 100);
  // eslint-disable-next-line no-param-reassign
  playerData.ninki = Math.max(playerData.ninki - ninkiCost, 0);
  // Bunshin adds another 5 ninki per weaponskill when active
  if (actionType === 'Weaponskill' && bunshinDuration > 0) {
    // eslint-disable-next-line no-param-reassign
    playerData.ninki = Math.min(playerData.ninki + 5, 100);
  }
  // console.log(`loopPlayerData huton|ninki: ${playerData.huton}|${playerData.ninki}`);
};

// eslint-disable-next-line no-unused-vars
const ninLoopGCDAction = (
  playerData = loopPlayerData,
  recastArray = loopRecastArray,
  statusArray = loopStatusArray,
) => {
  // TCJ active
  const { targetCount } = playerData;
  const tenChiJinStatus = checkStatusDuration({ statusName: 'Ten Chi Jin', statusArray });
  if (tenChiJinStatus > 0) {
    if (targetCount >= 3) { return ['Fuma Shuriken', 'Katon', 'Suiton']; }
    return ['Fuma Shuriken', 'Raiton', 'Suiton'];
  }

  // Kassatsu oopsies
  const hyoshoRanryuAcquired = actionData.some((element) => element.name === 'Hyosho Ranryu');
  const trickAttackRecast = checkActionRecast({ actionName: 'Trick Attack', recastArray });
  const kassatsuStatus = checkStatusDuration({ statusName: 'Kassatsu', statusArray });
  if (kassatsuStatus > 0 && kassatsuStatus < trickAttackRecast) {
    if (hyoshoRanryuAcquired) {
      if (targetCount >= 3) { return ['Chi', 'Ten', 'Goka Mekkyaku']; }
      return ['Ten', 'Jin', 'Hyosho Ranryu'];
    }
    if (targetCount >= 3) { return ['Chi', 'Ten', 'Katon']; }
    return ['Ten', 'Chi', 'Raiton'];
  }

  // Huton oopsies
  const { huton } = playerData;
  const huraijinAcquired = actionData.some((element) => element.name === 'Huraijin');
  const jinAcquired = actionData.some((element) => element.name === 'Jin');
  const mudraRecast = checkActionRecast({ actionName: 'Mudra', recastArray });
  if (huton === 0) {
    if (huraijinAcquired) { return 'Huraijin'; }
    if (jinAcquired && mudraRecast < 20) { return ['Chi', 'Jin', 'Ten', 'Huton']; }
  }

  // Trick Attack checks
  // const fumaShurikenAcquired = actionData.some((element) => element.name === 'Fuma Shuriken');
  // const forkedRaijuAcquired = actionData.some((element) => element.name === 'Forked Raiju');
  const chiAcquired = actionData.some((element) => element.name === 'Chi');
  const forkedRaijuStatus = checkStatusDuration({ statusName: 'Forked Raiju Ready', statusArray });
  const fleetingRaijuStatus = checkStatusDuration({ statusName: 'Fleeting Raiju Ready', statusArray });
  const phantomKamaitachiReadyStatus = checkStatusDuration({ statusName: 'Phantom Kamaitachi Ready', statusArray });
  const bunshinStatus = checkStatusDuration({ statusName: 'Bunshin', statusArray });

  // Trick Attack priority
  const trickAttackStatus = checkStatusDuration({ statusName: 'Trick Attack', statusArray });
  if (trickAttackStatus > 0) {
    if (fleetingRaijuStatus > 0) { return 'Fleeting Raiju'; }
    if (forkedRaijuStatus > 0) { return 'Forked Raiju'; }
    if (Math.min(bunshinStatus, phantomKamaitachiReadyStatus) > 0) { return 'Phantom Kamaitachi'; }
    if (kassatsuStatus > 0) {
      if (hyoshoRanryuAcquired) {
        if (targetCount >= 3) { return ['Chi', 'Ten', 'Goka Mekkyaku']; }
        return ['Ten', 'Jin', 'Hyosho Ranryu'];
      }
      if (targetCount >= 3) { return ['Chi', 'Ten', 'Katon']; }
      return ['Ten', 'Chi', 'Raiton'];
    }
    if (tenChiJinStatus > 0) {
      if (targetCount >= 3) { return ['Fuma Shuriken', 'Katon', 'Suiton']; }
      return ['Fuma Shuriken', 'Raiton', 'Suiton'];
    }
    if (mudraRecast < 20) {
      if (chiAcquired) {
        if (targetCount >= 3) { return ['Chi', 'Ten', 'Katon']; }
        return ['Ten', 'Chi', 'Raiton'];
      }
      return ['Ten', 'Fuma Shuriken'];
    } // Dump Mudras during TA
  }

  // Prep for Trick Attack
  const { gcd } = playerData;
  const suitonStatus = checkStatusDuration({ statusName: 'Suiton', statusArray });
  if (mudraRecast < 20 && jinAcquired && suitonStatus <= trickAttackRecast
  && trickAttackRecast < 20 - gcd * 2) {
    return ['Ten', 'Chi', 'Jin', 'Suiton'];
  }

  // Keep Ninjutsu off cooldown
  const raitonLength = 0.5 + 0.5 + 1.5;
  const fumaShurikenLength = 0.5 + 1.5;
  if (chiAcquired && mudraRecast < raitonLength + 1) {
    if (targetCount >= 3) { return ['Chi', 'Ten', 'Katon']; }
    return ['Ten', 'Chi', 'Raiton'];
  }
  if (mudraRecast < fumaShurikenLength + 1) { return ['Ten', 'Fuma Shuriken']; }

  // Continue combos
  const { comboAction } = playerData;
  const gustSlashAcquired = actionData.some((element) => element.name === 'Gust Slash');
  const aeolianEdgeAcquired = actionData.some((element) => element.name === 'Aeolian Edge');
  const armorCrushAcquired = actionData.some((element) => element.name === 'Armor Crush');
  const hakkeMujinsatsuAcquired = actionData.some((element) => element.name === 'Hakke Mujinsatsu');
  if (comboAction) {
    if (comboAction === 'Gust Slash') {
      if (armorCrushAcquired && huton <= 30) { return 'Armor Crush'; }
      if (aeolianEdgeAcquired) { return 'Aeolian Edge'; }
    }
    if (gustSlashAcquired && comboAction === 'Spinning Edge') { return 'Gust Slash'; }
    if (hakkeMujinsatsuAcquired && comboAction === 'Death Blossom') { return 'Hakke Mujinsatsu'; }
  }

  // Start combos
  const deathBlossomAcquired = actionData.some((element) => element.name === 'Death Blossom');
  if (deathBlossomAcquired && targetCount >= 3) { return 'Death Blossom'; }
  return 'Spinning Edge';
};

// eslint-disable-next-line no-unused-vars
const ninLoopOGCDAction = ({
  weaveCount,
  playerData = loopPlayerData,
  recastArray = loopRecastArray,
  statusArray = loopStatusArray,
} = {}) => {
  if (weaveCount > 1) { return ''; } // No double weaving on NIN because lazy

  // Bunshin all the things
  const { ninki } = playerData;
  const bunshinRecast = checkActionRecast({ actionName: 'Bunshin', recastArray });
  const bunshinStatus = checkStatusDuration({ statusName: 'Bunshin', statusArray });
  if (ninki >= 50 && bunshinRecast < 1 && bunshinStatus === 0) { return 'Bunshin'; }

  // Increase Ninki
  const meisuiRecast = checkActionRecast({ actionName: 'Meisui', recastArray });
  const mugRecast = checkActionRecast({ actionName: 'Mug', recastArray });
  const trickAttackRecast = checkActionRecast({ actionName: 'Trick Attack', recastArray });
  const suitonStatus = checkStatusDuration({ statusName: 'Suiton', statusArray });
  const trickAttackStatus = checkStatusDuration({ statusName: 'Trick Attack', statusArray });
  if (ninki < 60 && mugRecast < 1) { return 'Mug'; }
  if (meisuiRecast < 1 && ninki <= 50 && suitonStatus > 0 && suitonStatus <= trickAttackRecast) { return 'Meisui'; }

  // Kassatsu right before Trick Attack
  const kassatsuRecast = checkActionRecast({ actionName: 'Kassatsu', recastArray });
  if (kassatsuRecast < 1 && trickAttackRecast < suitonStatus) { return 'Kassatsu'; }

  // Trick Attack
  if (suitonStatus > 0 && trickAttackRecast < 1) { return 'Trick Attack'; }

  // Trick Attack window
  const assassinateRecast = checkActionRecast({ actionName: 'Assassinate', recastArray });
  const dreamwithinadreamRecast = checkActionRecast({ actionName: 'Dream Within a Dream', recastArray });
  const mudraRecast = checkActionRecast({ actionName: 'Mudra', recastArray });
  const tenChiJinRecast = checkActionRecast({ actionName: 'Ten Chi Jin', recastArray });
  const kassatsuStatus = checkStatusDuration({ statusName: 'Kassatsu', statusArray });
  if (trickAttackStatus > 0) {
    if (dreamwithinadreamRecast < 1) { return 'Dream Within a Dream'; }
    if (assassinateRecast < 1) { return 'Assassinate'; }
    if (kassatsuStatus === 0 && mudraRecast > 5 && tenChiJinRecast < 1) { return 'Ten Chi Jin'; }
  }

  // Ninki
  const { targetCount } = playerData;
  if (
    ninki === 100
    || (mugRecast < bunshinRecast && ninki >= 60)
    || (meisuiRecast < bunshinRecast && ninki >= 50)
  ) {
    if (targetCount >= 3) { return 'Hellfrog Medium'; }
    return 'Bhavacakra';
  }

  // Prevent ninki overcap
  // Not needed? Who knows?
  // let nextWeaponskillNinki = 5;
  // if (comboAction === 'Gust Slash') {
  //   nextWeaponskillNinki = getActionDataProperty(
  //     { actionName: 'Aeolian Edge', property: 'ninki' }
  //   );
  // }
  // if (ninki + nextWeaponskillNinki > 100 && bhavacakraRecast < 1) { return 'Bhavacakra'; }

  return '';
};

// eslint-disable-next-line no-unused-vars
const ninCalculateDelay = ({
  actionName,
  playerData = currentPlayerData,
  // statusArray = currentStatusArray,
} = {}) => {
  const actionType = getActionDataProperty({ actionName, property: 'type' });
  if (actionType === 'Mudra') { return 0.5; }
  if (actionType === 'Ninjutsu') { return 1.5; }
  return playerData.gcd;
};
