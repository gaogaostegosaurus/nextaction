/* global
  currentPlayer
*/

const smnActionMatch = ({
  // logType,
  actionName,
  // targetID,
  // playerData,
  recastArray,
  statusArray,
} = {}) => {
  const actionType = getActionProperty({ name: actionName, property: 'type' });

  if (actionType === 'Mudra' && getStatusDuration({ statusName: 'Mudra', statusArray }) <= 0 && getStatusDuration({ statusName: 'Kassatsu', statusArray }) <= 0) {
    // Only add recast if Mudra and Kassatsu are not activated
    addActionRecast({ actionName: 'Mudra', recast: 20, recastArray });
    addStatus({ statusName: 'Mudra', statusArray });
  } else {
    removeStatus({ statusName: 'Mudra', statusArray });
  }

  if (actionType === 'Ninjutsu') {
    // Remove Mudra/Kassatsu/TCJ on Ninjutsu activation
    removeStatus({ statusName: 'Kassatsu', statusArray });
    // removeStatusStacks({ statusName: 'Ten Chi Jin', statusArray });
    if (actionName === 'Doton') {
      addStatus({ statusName: 'Doton', statusArray });
    } else if (actionName === 'Suiton') {
      addStatus({ statusName: 'Suiton', statusArray });
    }
  }

  if (actionName === 'Hide') {
    // Hide reset
    addActionRecast({ actionName: 'Mudra', recast: 0, recastArray });
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

const smnLoopGCDAction = ({
  
}) => {
  const aetherchargeRecast = getRecast({ actionName: 'Aethercharge', })
  const summonBahamutRecast = getRecast({ actionName: 'Summon Bahamut', })
  const summonPhoenixRecast = getRecast({ actionName: 'Summon Phoenix', })

  if (summonBahamutRecast < 1) { return 'Summon Bahamut'; }
  if (something) { return 'Summon Phoenix'; }
  
  if (arcanum) { return 'Summon Garuda';
return 'Summon }
  if (summonBahamutRecast < 1) { return 'Summon Bahamut'; }
  if (summonBahamutRecast < 1) { return 'Summon Bahamut'; }

  // Ruin for filling gaps
  if (actionData.some((element) => element.name === 'Ruin III')) { return 'Ruin III'; }
  if (actionData.some((element) => element.name === 'Ruin II')) { return 'Ruin II'; }
  return 'Ruin';
};

const smnLoopGCDAction = ({
  
}) => {
  const aetherchargeRecast = Math.min(
    getRecast({ actionName: 'Aethercharge', recastArray }),
    getRecast({ actionName: 'Summon Bahamut', recastArray }),
    getRecast({ actionName: 'Summon Phoenix', recastArray }),
  );

  // Summon as soon as recharge is done
  if (aetherchargeRecast < 1) {
    if (actionData.some((element) => element.name === 'Summon Bahamut')) { return 'Summon Bahamut'; }
    if (actionData.some((element) => element.name === 'Summon Phoenix')) { return 'Summon Phoenix'; }
    return 'Aethercharge';
  }

  // Priority here is somewhat arbritrary...
  if (arcanum) {
    if (actionData.some((element) => element.name === 'Summon Garuda II')) { return 'Summon Garuda II'; }
    if (actionData.some((element) => element.name === 'Summon Garuda')) { return 'Summon Garuda'; }
    return 'Summon Emerald';
  }

  if (arcanum) {
    if (actionData.some((element) => element.name === 'Summon Titan II')) { return 'Summon Titan II'; }
    if (actionData.some((element) => element.name === 'Summon Titan')) { return 'Summon Titan'; }
    return 'Summon Topaz';
  }

  if (arcanum) {
    if (actionData.some((element) => element.name === 'Summon Ifrit II')) { return 'Summon Ifrit II'; }
    if (actionData.some((element) => element.name === 'Summon Ifrit')) { return 'Summon Ifrit'; }
    return 'Summon Ruby';
  }

  if (attunement === 'Ifrit') {
    if (getStatusDuration({ name: 'Ifrit\'s Favor', statusArray }) > 0) {
      if (comboAction === 'Crimson Cyclone') { return 'Crimson Strike'; }
      return 'Crimson Cyclone';
    }
    if (attunementSeconds > time) {
      if (actionData.some((element) => element.name === 'Ruby Rite')) { return 'Ruby Rite'; }
      if (actionData.some((element) => element.name === 'Ruby Ruin III')) { return 'Ruby Ruin III'; }
      if (actionData.some((element) => element.name === 'Ruby Ruin II')) { return 'Ruby Ruin II'; }
      return 'Ruby Ruin';
    }
  }

  if (attunement === 'Titan') {
    // Favor action is OGCD so not listed here
    if (attunementSeconds > time) {
      if (actionData.some((element) => element.name === 'Topaz Rite')) { return 'Topaz Rite'; }
      if (actionData.some((element) => element.name === 'Topaz Ruin III')) { return 'Topaz Ruin III'; }
      if (actionData.some((element) => element.name === 'Topaz Ruin II')) { return 'Topaz Ruin II'; }
      return 'Topaz Ruin';
    }
  }


  if (attunement === 'Garuda') {
    getDelay({ })
    if (getStatusDuration({ name: 'Garuda\'s Favor', statusArray }) > 0) {
      return 'Slipstream';
    }
    if (attunementSeconds > time) {
      if (actionData.some((element) => element.name === 'Emerald Rite')) { return 'Emerald Rite'; }
      if (actionData.some((element) => element.name === 'Emerald Ruin III')) { return 'Emerald Ruin III'; }
      if (actionData.some((element) => element.name === 'Emerald Ruin II')) { return 'Emerald Ruin II'; }
      return 'Emerald Ruin';
    }
  }


  // Ruin for filling gaps
  if (actionData.some((element) => element.name === 'Ruin III')) { return 'Ruin III'; }
  if (actionData.some((element) => element.name === 'Ruin II')) { return 'Ruin II'; }
  return 'Ruin';
};


// eslint-disable-next-line no-unused-vars
const smnPlayerChanged = (e) => {
  currentPlayer.mp = e.detail.currentMP;
  currentPlayer.aetherflowStacks = e.detail.jobDetail.aetherflowStacks;
  currentPlayer.tranceSeconds = e.detail.jobDetail.tranceMilliseconds / 1000;
  currentPlayer.nextSummoned = e.detail.jobDetail.nextSummoned; // Phoenix/Bahamut?
  currentPlayer.attunement = e.detail.jobDetail.attunement; // Is this the stacks?
  currentPlayer.attunementSeconds = e.detail.jobDetail.attunementMilliseconds / 1000;
  currentPlayer.activePrimal = e.detail.jobDetail.activePrimal; // Array?
  currentPlayer.usableArcanum = e.detail.jobDetail.usableArcanum; // Array
};