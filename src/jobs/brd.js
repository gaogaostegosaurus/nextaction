/* globals
actionData getActionProperty
currentPlayer currentStatusArray getDelay
loopPlayer loopRecastArray loopStatusArray
addActionRecast getRecast removeRecast calculateRecast
addStatus removeStatus addStatusStacks removeStatusStacks getStatusDuration
startLoop
*/

// eslint-disable-next-line no-unused-vars
const brdTraits = ({ level } = {}) => {
  if (level >= 64) {
    let actionDataIndex;
    actionDataIndex = actionData.findIndex((element) => element.name === 'Venomous Bite');
    actionData.splice(actionDataIndex, 1);
    actionDataIndex = actionData.findIndex((element) => element.name === 'Windbite');
    actionData.splice(actionDataIndex, 1);
  }

  if (level >= 68) {
    const actionDataIndex = actionData.findIndex((element) => element.name === 'Empyreal Arrow');
    actionData[actionDataIndex].repertoire = 1;
  }

  if (level >= 70) {
    const actionDataIndex = actionData.findIndex((element) => element.name === 'Straight Shot');
    actionData.splice(actionDataIndex, 1);
  }

  if (level >= 62) {
    actionData.forEach((element) => {
      if (element.type === 'Weaponskill') {
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
const brdPlayerChanged = (e) => {
  currentPlayer.hp = e.detail.currentHP;

  if (currentPlayer.songName === 'Paeon' && e.detail.jobDetail.songName !== 'Paeon') {
    // "Paeon just ended"
  }

  currentPlayer.songName = e.detail.jobDetail.songName;
  currentPlayer.songSeconds = e.detail.jobDetail.songMilliseconds / 1000;
  currentPlayer.repertoire = e.detail.jobDetail.songProcs;
  currentPlayer.soul = e.detail.jobDetail.soulGauge;
};

// eslint-disable-next-line no-unused-vars
const brdTargetChanged = () => {
  startLoop();
};

// eslint-disable-next-line no-unused-vars
const brdActionMatch = ({
  // logType, // Currently unused parameters commented out
  actionName,
  targetID,
  playerData,
  recastArray,
  statusArray,
  loop,
} = {}) => {
  removeStatus({ statusName: 'Hide', statusArray });

  const actionTargetCount = getActionProperty({ actionName, property: 'targetCount' });
    if (actionTargetCount) { playerData.targetCount = actionTargetCount; }

  const actionType = getActionProperty({ actionName, property: 'type' });

  // Ninjutsu is so damn annoying
  if (actionType === 'Mudra'
  && getStatusDuration({ statusName: 'Mudra', statusArray }) === 0
  && getStatusDuration({ statusName: 'Kassatsu', statusArray }) === 0) {
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

  if (actionType === 'Weaponskill') {
    removeStatusStacks({ statusName: 'Bunshin', statusArray });
    if (getStatusDuration({ statusName: 'Bunshin', statusArray }) === 0) {
      removeStatus({ statusName: 'Phantom Kamaitachi Ready', statusArray });
    }
    if (!['Forked Raiju', 'Fleeting Raiju'].includes(actionName)) {
      removeStatus({ statusName: 'Forked Raiju Ready', statusArray });
      removeStatus({ statusName: 'Fleeting Raiju Ready', statusArray });
    }
  }

  if (actionName === 'Hide') {
    // Hide reset
    removeRecast({ actionName: 'Mudra', recastArray });
  } else if (actionName === 'Trick Attack') {
    // "Self-buff" to simplify alignment calculations
    removeStatus({ statusName: 'Suiton', statusArray });
    addStatus({ statusName: 'Trick Attack', statusArray });
  } else if (actionName === 'Kassatsu') {
    addStatus({ statusName: 'Kassatsu', statusArray });
  } else if (actionName === 'Ten Chi Jin') {
    addStatus({ statusName: 'Ten Chi Jin', stacks: 3, statusArray });
  } else if (actionName === 'Bunshin') {
    addStatus({ statusName: 'Bunshin', stacks: 5, statusArray });
    // Add Phantom Kamaitachi alongside Bunshin for simulation
    if (actionData.some((element) => element.name === 'Phantom Kamaitachi')) {
      addStatus({ statusName: 'Phantom Kamaitachi Ready', statusArray });
    }
  } else if (actionName === 'Phantom Kamaitachi') {
    // Remove since it effectively has an infinite time
    removeStatus({ statusName: 'Phantom Kamaitachi Ready', statusArray });
  } else if (actionName === 'Raiton' && actionData.some((element) => element.name === 'Forked Raiju')) {
    addStatusStacks({ statusName: 'Forked Raiju Ready', statusArray });
  } else if (actionName === 'Forked Raiju') {
    removeStatusStacks({ statusName: 'Forked Raiju Ready', statusArray });
    addStatus({ statusName: 'Fleeting Raiju Ready', statusArray });
  } else if (actionName === 'Fleeting Raiju') {
    removeStatus({ statusName: 'Fleeting Raiju Ready', statusArray });
  }

  // Start loop if not in it already
  if (!loop && getStatusDuration({ statusName: 'Ten Chi Jin', statusArray }) === 0
  && ['Spell', 'Weaponskill', 'Ninjutsu'].includes(actionType)) {
        if (!['Hide', 'Huton'].includes(actionName)) { playerData.combat = true; }
    const delay = getDelay({ actionName, playerData, statusArray });
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
  playerData = loopPlayer,
  // recastArray = loopRecastArray,
  statusArray = loopStatusArray,
} = {}) => {
  const actionType = getActionProperty({ actionName, property: 'type' });

  // Add Huton time
  const huton = getActionProperty({ actionName, property: 'huton' });
    playerData.huton = Math.min(playerData.huton + huton, 60);

  // Make changes to Ninki
  const ninki = getActionProperty({ actionName, property: 'ninki' });
  const ninkiCost = getActionProperty({ actionName, property: 'ninkiCost' });
  const bunshinDuration = getStatusDuration({ statusName: 'Bunshin', statusArray });
    playerData.ninki = Math.min(playerData.ninki + ninki, 100);
    playerData.ninki = Math.max(playerData.ninki - ninkiCost, 0);
  // Bunshin adds another 5 ninki per weaponskill when active
  if (actionType === 'Weaponskill' && bunshinDuration > 0) {
        playerData.ninki = Math.min(playerData.ninki + 5, 100);
  }
  // console.log(`loopPlayer huton|ninki: ${playerData.huton}|${playerData.ninki}`);
};

// eslint-disable-next-line no-unused-vars
const ninNextGCD = (
  playerData = loopPlayer,
  recastArray = loopRecastArray,
  statusArray = loopStatusArray,
) => {
  // TCJ active
  const { targetCount } = playerData;
  const tenChiJinStatus = getStatusDuration({ statusName: 'Ten Chi Jin', statusArray });
  if (tenChiJinStatus > 0) {
    if (targetCount >= 3) { return ['Fuma Shuriken', 'Katon', 'Suiton']; }
    return ['Fuma Shuriken', 'Raiton', 'Suiton'];
  }

  // Kassatsu oopsies
  const hyoshoRanryuAcquired = actionData.some((element) => element.name === 'Hyosho Ranryu');
  const trickAttackRecast = getRecast({ actionName: 'Trick Attack', recastArray });
  const kassatsuStatus = getStatusDuration({ statusName: 'Kassatsu', statusArray });
  if (kassatsuStatus > 0 && kassatsuStatus < trickAttackRecast) {
    if (hyoshoRanryuAcquired) {
      if (targetCount >= 3) { return ['Chi', 'Ten', 'Goka Mekkyaku']; }
      return ['Ten', 'Jin', 'Hyosho Ranryu'];
    }
    if (targetCount >= 3) { return ['Chi', 'Ten', 'Katon']; }
    return ['Ten', 'Chi', 'Raiton'];
  }

  // Huton oopsies
  const { combat } = playerData;
  const { huton } = playerData;
  const huraijinAcquired = actionData.some((element) => element.name === 'Huraijin');
  const jinAcquired = actionData.some((element) => element.name === 'Jin');
  const mudraRecast = getRecast({ actionName: 'Mudra', recastArray });
  if (huton === 0 && jinAcquired) {
    if (combat && huraijinAcquired) { return 'Huraijin'; }
    if (mudraRecast < 20) { return ['Chi', 'Jin', 'Ten', 'Huton']; }
  }

  // Trick Attack
  const chiAcquired = actionData.some((element) => element.name === 'Chi');
  const forkedRaijuStatus = getStatusDuration({ statusName: 'Forked Raiju Ready', statusArray });
  const fleetingRaijuStatus = getStatusDuration({ statusName: 'Fleeting Raiju Ready', statusArray });
  const phantomKamaitachiReadyStatus = getStatusDuration({ statusName: 'Phantom Kamaitachi Ready', statusArray });
  // const bunshinStatus = getStatusDuration({ statusName: 'Bunshin', statusArray });
  const trickAttackStatus = getStatusDuration({ statusName: 'Trick Attack', statusArray });
  if (trickAttackStatus > 0) {
    if (kassatsuStatus > 0) {
      if (hyoshoRanryuAcquired) {
        if (targetCount >= 3) { return ['Chi', 'Ten', 'Goka Mekkyaku']; }
        return ['Ten', 'Jin', 'Hyosho Ranryu'];
      }
      if (targetCount >= 3) { return ['Chi', 'Ten', 'Katon']; }
      return ['Ten', 'Chi', 'Raiton'];
    }
    if (phantomKamaitachiReadyStatus > 0) { return 'Phantom Kamaitachi'; }
    if (tenChiJinStatus > 0) {
      if (targetCount >= 3) { return ['Fuma Shuriken', 'Katon', 'Suiton']; }
      return ['Fuma Shuriken', 'Raiton', 'Suiton'];
    }
    if (mudraRecast < 20) { // Dump Mudras during TA
      if (chiAcquired) {
        if (targetCount >= 3) { return ['Chi', 'Ten', 'Katon']; }
        return ['Ten', 'Chi', 'Raiton'];
      }
      return ['Ten', 'Fuma Shuriken'];
    }
    if (fleetingRaijuStatus > 0) { return 'Fleeting Raiju'; }
    if (forkedRaijuStatus > 0) { return 'Forked Raiju'; }
  }

  // Prep for Trick Attack
  const { gcd } = playerData;
  const suitonStatus = getStatusDuration({ statusName: 'Suiton', statusArray });
  if (mudraRecast < 20 && jinAcquired && suitonStatus <= trickAttackRecast
  && trickAttackRecast < 20 - gcd * 2) {
    return ['Ten', 'Chi', 'Jin', 'Suiton'];
  }

  // Phantom Kamaitachi
  const bunshinStacks = getStatusStacks({ statusName: 'Bunshin', statusArray });
  if (bunshinStacks === 1 && phantomKamaitachiReadyStatus > 0) { return 'Phantom Kamaitachi'; }

  // Keep Ninjutsu off cooldown
  const raitonLength = 0.5 + 0.5 + 1.5;
  const fumaShurikenLength = 0.5 + 1.5;
  if (chiAcquired && mudraRecast < raitonLength + 1) {
    if (targetCount >= 3) { return ['Chi', 'Ten', 'Katon']; }
    return ['Ten', 'Chi', 'Raiton'];
  }
  if (mudraRecast < fumaShurikenLength + 1) { return ['Ten', 'Fuma Shuriken']; }

  // Forked/Fleeting Raiju
  if (fleetingRaijuStatus > 0) { return 'Fleeting Raiju'; }
  if (forkedRaijuStatus > 0) { return 'Forked Raiju'; }

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
const ninOGCD = ({
  weaveCount,
  playerData = loopPlayer,
  recastArray = loopRecastArray,
  statusArray = loopStatusArray,
} = {}) => {
  if (weaveCount > 1) { return ''; } // No double weaving on NIN because lazy

  const { combat } = playerData;
  const hideRecast = getRecast({ actionName: 'Hide', recastArray });
  const mudraRecast = getRecast({ actionName: 'Mudra', recastArray });
  if (!combat && hideRecast === 0 && mudraRecast > 0) { return 'Hide'; }

  // Bunshin all the things
  const { ninki } = playerData;
  const bunshinRecast = getRecast({ actionName: 'Bunshin', recastArray });
  const bunshinStatus = getStatusDuration({ statusName: 'Bunshin', statusArray });
  if (ninki >= 50 && bunshinRecast < 1 && bunshinStatus === 0) { return 'Bunshin'; }

  // Increase Ninki
  const meisuiRecast = getRecast({ actionName: 'Meisui', recastArray });
  const mugRecast = getRecast({ actionName: 'Mug', recastArray });
  const trickAttackRecast = getRecast({ actionName: 'Trick Attack', recastArray });
  const suitonStatus = getStatusDuration({ statusName: 'Suiton', statusArray });
  const trickAttackStatus = getStatusDuration({ statusName: 'Trick Attack', statusArray });
  if (ninki < 60 && mugRecast < 1) { return 'Mug'; }
  if (meisuiRecast < 1 && ninki <= 50 && suitonStatus > 0 && suitonStatus <= trickAttackRecast) { return 'Meisui'; }

  // Kassatsu right before Trick Attack
  const kassatsuRecast = getRecast({ actionName: 'Kassatsu', recastArray });
  if (kassatsuRecast < 1 && trickAttackRecast < suitonStatus) { return 'Kassatsu'; }

  // Trick Attack
  if (suitonStatus > 0 && trickAttackRecast < 1) { return 'Trick Attack'; }

  // Trick Attack window
  const assassinateRecast = getRecast({ actionName: 'Assassinate', recastArray });
  const dreamwithinadreamRecast = getRecast({ actionName: 'Dream Within a Dream', recastArray });
  const tenChiJinRecast = getRecast({ actionName: 'Ten Chi Jin', recastArray });
  const kassatsuStatus = getStatusDuration({ statusName: 'Kassatsu', statusArray });
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
  //   nextWeaponskillNinki = getActionProperty(
  //     { actionName: 'Aeolian Edge', property: 'ninki' }
  //   );
  // }
  // if (ninki + nextWeaponskillNinki > 100 && bhavacakraRecast < 1) { return 'Bhavacakra'; }

  return '';
};

// eslint-disable-next-line no-unused-vars
const ningetDelay = ({
  actionName,
  playerData = currentPlayer,
  // statusArray = currentStatusArray,
} = {}) => {
  const actionType = getActionProperty({ actionName, property: 'type' });
  if (actionType === 'Mudra') { return 0.5; }
  if (actionType === 'Ninjutsu') { return 1.5; }
  return playerData.gcd;
};
