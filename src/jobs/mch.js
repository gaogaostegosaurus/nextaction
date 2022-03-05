/* globals
actionData getActionProperty
currentPlayer getDelay
loopPlayer loopRecastArray loopStatusArray
addActionRecast getRecast removeRecast calculateRecast
addStatus removeStatus getStatusDuration
startLoop
*/

// eslint-disable-next-line no-unused-vars
const mchTraits = ({ level } = {}) => {
  if (level >= 54) {
    const actionDataIndex = actionData.findIndex((element) => element.name === 'Split Shot');
    actionData.splice(actionDataIndex, 1);
  }

  if (level >= 60) {
    const actionDataIndex = actionData.findIndex((element) => element.name === 'Slug Shot');
    actionData.splice(actionDataIndex, 1);
  }

  if (level >= 64) {
    const actionDataIndex = actionData.findIndex((element) => element.name === 'Clean Shot');
    actionData.splice(actionDataIndex, 1);
  }

  if (level >= 74) {
    let actionDataIndex;
    actionDataIndex = actionData.findIndex((element) => element.name === 'Gauss Round');
    actionData[actionDataIndex].charges = 3;
    actionDataIndex = actionData.findIndex((element) => element.name === 'Ricochet');
    actionData[actionDataIndex].charges = 3;
  }

  if (level >= 76) {
    const actionDataIndex = actionData.findIndex((element) => element.name === 'Hot Shot');
    actionData.splice(actionDataIndex, 1);
  }

  if (level >= 80) {
    let actionDataIndex;
    actionDataIndex = actionData.findIndex((element) => element.name === 'Rook Autoturret');
    actionData.splice(actionDataIndex, 1);
    actionDataIndex = actionData.findIndex((element) => element.name === 'Rook Overdrive');
    actionData.splice(actionDataIndex, 1);
  }

  if (level >= 82) {
    const actionDataIndex = actionData.findIndex((element) => element.name === 'Spread Shot');
    actionData.splice(actionDataIndex, 1);
  }

  if (level >= 84) {
    const actionDataIndex = actionData.findIndex((element) => element.name === 'Reassemble');
    actionData[actionDataIndex].charges = 3;
  }

  if (level >= 88) {
    const actionDataIndex = actionData.findIndex((element) => element.name === 'Tactician');
    actionData[actionDataIndex].recast = 90;
  }
};

// eslint-disable-next-line no-unused-vars
const mchPlayerChanged = (e) => {
  // Recalculate GCD if Huton status has apparently changed
  if (currentPlayer.huton > 0 && e.detail.jobDetail.hutonMilliseconds === 0) {
    // Huton recently fell off
    currentPlayer.gcd = calculateRecast({ modifier: 1 });
  } else if (currentPlayer.huton === 0 && e.detail.jobDetail.hutonMilliseconds > 0) {
    // Huton recently applied
    currentPlayer.gcd = calculateRecast({ modifier: 0.85 });
  }

  // Standard stuff otherwise
  currentPlayer.hp = e.detail.currentHP;
  currentPlayer.huton = e.detail.jobDetail.hutonMilliseconds / 1000;
  currentPlayer.ninki = e.detail.jobDetail.ninkiAmount;
};

// eslint-disable-next-line no-unused-vars
const ninTargetChanged = () => {
  const mudraDuration = getStatusDuration({ statusName: 'Mudra', statusArray: currentStatusArray });
  const kassatsuDuration = getStatusDuration({ statusName: 'Kassatsu', statusArray: currentStatusArray });
  const tenChiJinDuration = getStatusDuration({ statusName: 'Ten Chi Jin', statusArray: currentStatusArray });
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
    // Leaving actual Bunshin out because it doesn't really affect decision-making(?)
    // addStatus({ statusName: 'Bunshin', stacks: 5, statusArray });
    // Add Phantom Kamaitachi alongside Bunshin for simulation
    if (actionData.some((element) => element.name === 'Phantom Kamaitachi')) { addStatus({ statusName: 'Phantom Kamaitachi Ready', statusArray }); }
  } else if (actionName === 'Phantom Kamaitachi') {
    // Remove since it effectively has an infinite time
    removeStatus({ statusName: 'Phantom Kamaitachi Ready', statusArray });
  }

  // Start loop if not in it already
  if (!loop && getStatusDuration({ statusName: 'Ten Chi Jin', statusArray }) === 0
  && ['Spell', 'Weaponskill', 'Ninjutsu'].includes(actionType)) {
    const delay = getDelay({ actionName, playerData, statusArray });
    startLoop({ delay });
  }
};

// eslint-disable-next-line no-unused-vars
const ninStatusMatch = ({ logType, statusName, sourceID }) => {
  if (logType === 'StatusRemove' && ['Mudra', 'Kassatsu', 'Ten Chi Jin'].includes(statusName)) {
    // These should all come off after an final ninjutsu cast
    // Good point to update?
    startLoop({ delay: 1.5 });
  }
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
  const { comboAction } = playerData;
  const { huton } = playerData;
  const { level } = playerData;

  const gustSlashAcquired = actionData.some((element) => element.name === 'Gust Slash');
  const aeolianEdgeAcquired = actionData.some((element) => element.name === 'Aeolian Edge');
  const armorCrushAcquired = actionData.some((element) => element.name === 'Armor Crush');
  // const deathBlossomAcquired = actionData.some((element) => element.name === 'Death Blossom');
  const hakkeMujinsatsuAcquired = actionData.some((element) => element.name === 'Hakke Mujinsatsu');
  const huraijinAcquired = actionData.some((element) => element.name === 'Huraijin');
  // const forkedRaijuAcquired = actionData.some((element) => element.name === 'Forked Raiju');

  const raitonAcquired = actionData.some((element) => element.name === 'Raiton');
  const fumaShurikenAcquired = actionData.some((element) => element.name === 'Fuma Shuriken');
  const suitonAcquired = actionData.some((element) => element.name === 'Suiton');

  const trickAttackRecast = getRecast({ actionName: 'Trick Attack', recastArray });
  const mudraRecast = getRecast({ actionName: 'Mudra', recastArray });

  const trickAttackStatus = getStatusDuration({ statusName: 'Trick Attack', statusArray });
  const suitonStatus = getStatusDuration({ statusName: 'Suiton', statusArray });
  const kassatsuStatus = getStatusDuration({ statusName: 'Kassatsu', statusArray });
  const tenChiJinStatus = getStatusDuration({ statusName: 'Ten Chi Jin', statusArray });
  const phantomKamaitachiReadyStatus = getStatusDuration({ statusName: 'Phantom Kamaitachi Ready', statusArray });
  // const bunshinStatus = getStatusDuration({ statusName: 'Bunshin', statusArray });
  const forkedRaijuStatus = getStatusDuration({ statusName: 'Forked Raiju Ready', statusArray });
  const fleetingRaijuStatus = getStatusDuration({ statusName: 'Fleeting Raiju Ready', statusArray });

  // lol
  if (huraijinAcquired && huton === 0) { return 'Huraijin'; }

  // Put Huton up if it's not
  if (mudraRecast < 20 && huton === 0) { return ['Chi', 'Jin', 'Ten', 'Huton']; }

  // TCJ?
  if (tenChiJinStatus > 0) { return ['Fuma Shuriken', 'Raiton', 'Suiton']; }

  // Trick Attack priority
  if (trickAttackStatus > 0) {
    if (kassatsuStatus > 0) {
      if (level >= 76) { return ['Ten', 'Jin', 'Hyosho Ranryu']; } return ['Ten', 'Chi', 'Raiton'];
    }
    if (phantomKamaitachiReadyStatus > 0) { return 'Phantom Kamaitachi'; }
    if (fleetingRaijuStatus > 0) { return 'Fleeting Raiju'; }
    if (forkedRaijuStatus > 0) { return 'Forked Raiju'; }
    if (mudraRecast < 20) { return ['Ten', 'Chi', 'Raiton']; } // Dump Mudras during TA
  }

  // TCJ

  // Prep for Trick Attack
  if (mudraRecast < 20 && suitonAcquired && suitonStatus <= trickAttackRecast && trickAttackRecast < 20) { return ['Ten', 'Chi', 'Jin', 'Suiton']; }

  const raitonLength = 0.5 + 0.5 + 1.5;
  const fumaShurikenLength = 0.5 + 1.5;
  // const suitonLength = 0.5 + 0.5 + 0.5 + 1.5;

  // Keep Ninjutsu off cooldown
  if (raitonAcquired && mudraRecast < raitonLength + 1) { return ['Ten', 'Chi', 'Raiton']; }
  if (fumaShurikenAcquired && mudraRecast < fumaShurikenLength + 1) { return ['Ten', 'Fuma Shuriken']; }

  // Continue combos
  if (comboAction) {
    if (comboAction === 'Gust Slash') {
      if (armorCrushAcquired && huton <= 30) { return 'Armor Crush'; }
      if (aeolianEdgeAcquired) { return 'Aeolian Edge'; }
    }
    if (gustSlashAcquired && comboAction === 'Spinning Edge') { return 'Gust Slash'; }
    if (hakkeMujinsatsuAcquired && comboAction === 'Death Blossom') { return 'Hakke Mujinsatsu'; }
  }

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

  // const { gcd } = playerData;
  // const { targetCount } = playerData;
  // const { comboAction } = playerData;

  const { ninki } = playerData;
  // const { huton } = playerData;

  const assassinateRecast = getRecast({ actionName: 'Assassinate', recastArray });
  const bhavacakraRecast = getRecast({ actionName: 'Bhavacakra', recastArray });
  const bunshinRecast = getRecast({ actionName: 'Bunshin', recastArray });
  const dreamwithinadreamRecast = getRecast({ actionName: 'Dream Within a Dream', recastArray });
  const kassatsuRecast = getRecast({ actionName: 'Kassatsu', recastArray });
  const meisuiRecast = getRecast({ actionName: 'Meisui', recastArray });
  const mudraRecast = getRecast({ actionName: 'Mudra', recastArray });
  const mugRecast = getRecast({ actionName: 'Mug', recastArray });
  const tenChiJinRecast = getRecast({ actionName: 'Ten Chi Jin', recastArray });
  const trickAttackRecast = checkActionRecast({ actionName: 'Trick Attack', recastArray });

  const bunshinStatus = getStatusDuration({ statusName: 'Bunshin', statusArray });
  const kassatsuStatus = getStatusDuration({ statusName: 'Kassatsu', statusArray });
  const suitonStatus = getStatusDuration({ statusName: 'Suiton', statusArray });
  const trickAttackStatus = getStatusDuration({ statusName: 'Trick Attack', statusArray });

  // Bunshin all the things
  if (ninki >= 50 && bunshinRecast < 1 && bunshinStatus === 0) { return 'Bunshin'; }

  // Increase Ninki
  if (ninki < 60 && mugRecast < 1) { return 'Mug'; }
  if (meisuiRecast < 1 && ninki <= 50 && suitonStatus > 0 && suitonStatus <= trickAttackRecast) { return 'Meisui'; }

  // Kassatsu right before Trick Attack
  if (kassatsuRecast < 1 && trickAttackRecast < suitonStatus) { return 'Kassatsu'; }

  // Trick Attack
  if (suitonStatus > 0 && trickAttackRecast < 1) { return 'Trick Attack'; }

  // Trick Attack window
  if (trickAttackStatus > 0) {
    if (kassatsuRecast < 1) { return 'Kassatsu'; }
    if (dreamwithinadreamRecast < 1) { return 'Dream Within a Dream'; }
    if (assassinateRecast < 1) { return 'Assassinate'; }
    if (kassatsuStatus === 0 && mudraRecast > 4 && tenChiJinRecast < 1) { return 'Ten Chi Jin'; }
  }

  if (bhavacakraRecast < 1 && (ninki === 100
    || (mugRecast < bunshinRecast && ninki >= 60)
    || (meisuiRecast < bunshinRecast && ninki >= 50))) {
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
  statusArray = currentStatusArray,
} = {}) => {
  const actionType = getActionProperty({ actionName, property: 'type' });
  if (actionType === 'Mudra') { return 0.5; }
  if (actionType === 'Ninjutsu') { return 1.5; }
  return playerData.gcd;
};
