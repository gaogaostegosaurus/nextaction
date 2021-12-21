/* globals
actionData
currentPlayerData
calculateRecast
loopPlayerData loopRecastArray loopStatusArray
getActionDataProperty addActionRecast addStatus checkStatusDuration checkActionRecast
*/
// eslint-disable-next-line no-unused-vars
const ninActionMatch = ({
  // logType,
  actionName,
  // targetID,
  // playerData,
  recastArray,
  statusArray,
} = {}) => {


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
  }
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

  const trickAttackRecast = checkActionRecast({ actionName: 'Trick Attack', recastArray });
  const mudraRecast = checkActionRecast({ actionName: 'Mudra', recastArray });

  const trickAttackStatus = checkStatusDuration({ statusName: 'Trick Attack', statusArray });
  const suitonStatus = checkStatusDuration({ statusName: 'Suiton', statusArray });
  const kassatsuStatus = checkStatusDuration({ statusName: 'Kassatsu', statusArray });
  const tenChiJinStatus = checkStatusDuration({ statusName: 'Ten Chi Jin', statusArray });
  const phantomKamaitachiReadyStatus = checkStatusDuration({ statusName: 'Phantom Kamaitachi Ready', statusArray });
  // const bunshinStatus = checkStatusDuration({ statusName: 'Bunshin', statusArray });
  const forkedRaijuStatus = checkStatusDuration({ statusName: 'Forked Raiju Ready', statusArray });
  const fleetingRaijuStatus = checkStatusDuration({ statusName: 'Fleeting Raiju Ready', statusArray });

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
  const suitonLength = 0.5 + 0.5 + 0.5 + 1.5;

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
const ninLoopOGCDAction = ({
  weaveCount,
  playerData = loopPlayerData,
  recastArray = loopRecastArray,
  statusArray = loopStatusArray,
} = {}) => {
  if (weaveCount > 1) { return ''; } // No double weaving on NIN because lazy

  // const { gcd } = playerData;
  // const { targetCount } = playerData;
  const { comboAction } = playerData;

  const { ninki } = playerData;
  // const { huton } = playerData;

  const assassinateRecast = checkActionRecast({ actionName: 'Assassinate', recastArray });
  const bhavacakraRecast = checkActionRecast({ actionName: 'Bhavacakra', recastArray });
  const bunshinRecast = checkActionRecast({ actionName: 'Bunshin', recastArray });
  const dreamwithinadreamRecast = checkActionRecast({ actionName: 'Dream Within a Dream', recastArray });
  const kassatsuRecast = checkActionRecast({ actionName: 'Kassatsu', recastArray });
  const meisuiRecast = checkActionRecast({ actionName: 'Meisui', recastArray });
  const mudraRecast = checkActionRecast({ actionName: 'Mudra', recastArray });
  const mugRecast = checkActionRecast({ actionName: 'Mug', recastArray });
  const tenChiJinRecast = checkActionRecast({ actionName: 'Ten Chi Jin', recastArray });
  const trickAttackRecast = checkActionRecast({ actionName: 'Trick Attack', recastArray });

  const bunshinStatus = checkStatusDuration({ statusName: 'Bunshin', statusArray });
  const kassatsuStatus = checkStatusDuration({ statusName: 'Kassatsu', statusArray });
  const suitonStatus = checkStatusDuration({ statusName: 'Suiton', statusArray });
  const trickAttackStatus = checkStatusDuration({ statusName: 'Trick Attack', statusArray });

  // Bunshin all the things
  if (ninki >= 50 && bunshinRecast < 1 && bunshinStatus === 0) { return 'Bunshin'; }
  if (ninki <= 50 && mugRecast < 1) { return 'Mug'; }

  // Kassatsu right before Trick Attack
  if (kassatsuRecast < 1 && (trickAttackRecast < suitonStatus || trickAttackStatus > 0)) { return 'Kassatsu'; }

  // Trick Attack
  if (suitonStatus > 0 && trickAttackRecast < 1) { return 'Trick Attack'; }

  // Trick Attack window
  if (trickAttackStatus > 0) {
    if (assassinateRecast < 1) { return 'Assassinate'; }
    if (dreamwithinadreamRecast < 1) { return 'Dream Within a Dream'; }
    if (kassatsuStatus === 0 && mudraRecast > 4 && tenChiJinRecast < 1) { return 'Ten Chi Jin'; }
  }

  if (meisuiRecast < 1 && ninki <= 50 && suitonStatus > 0 && suitonStatus <= trickAttackRecast) { return 'Meisui'; }

  if (bhavacakraRecast < 1 && (ninki === 100
    || (mugRecast < bunshinRecast && ninki >= 60)
    || (meisuiRecast < bunshinRecast && ninki >= 50))) {
    return 'Bhavacakra';
  }

  // // Prevent ninki overcap
  // let nextWeaponskillNinki = 5;
  // if (comboAction === 'Gust Slash') {
  //   nextWeaponskillNinki = getActionDataProperty({ actionName: 'Aeolian Edge', property: 'ninki' });
  // }
  // if (ninki + nextWeaponskillNinki > 100 && bhavacakraRecast < 1) { return 'Bhavacakra'; }

  return '';
};

// eslint-disable-next-line no-unused-vars
const ninStatusMatch = ({ logType, statusName, sourceID }) => {
  if (logType === 'StatusRemove' && ['Mudra', 'Kassatsu', 'Ten Chi Jin'].includes(statusName)) {
    // These should all come off after an final ninjutsu cast
    startLoop({ delay: 1.5 });
  }
};

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
  const mudraDuration = checkStatusDuration({ statusName: 'Mudra', statusArray: currentStatusArray});
  const kassatsuDuration = checkStatusDuration({ statusName: 'Kassatsu', statusArray: currentStatusArray});
  const tenChiJinDuration = checkStatusDuration({ statusName: 'Ten Chi Jin', statusArray: currentStatusArray});
  if (Math.max(mudraDuration, kassatsuDuration, tenChiJinDuration) === 0) {
    startLoop();
  }
};
