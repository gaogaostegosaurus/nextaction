/* global
  currentPlayerData
*/

const smnActionMatch = ({
  // logType,
  actionName,
  // targetID,
  // playerData,
  recastArray,
  statusArray,
} = {}) => {
  const actionType = getActionDataProperty({ name: actionName, property: 'type' });

  // ninjutsu is so annoying

  if (actionType === 'Mudra' && checkStatusDuration({ statusName: 'Mudra', statusArray }) <= 0 && checkStatusDuration({ statusName: 'Kassatsu', statusArray }) <= 0) {
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
  const aetherchargeRecast = checkActionRecast({ actionName: 'Aethercharge', })
  if ()
  return 'Summon Bahamut';
  return 'Ruin III';
};


// eslint-disable-next-line no-unused-vars
const smnPlayerChanged = (e) => {
  currentPlayerData.mp = e.detail.currentMP;
  currentPlayerData.aetherflowStacks = e.detail.jobDetail.aetherflowStacks;
  currentPlayerData.tranceSeconds = e.detail.jobDetail.tranceMilliseconds / 1000;
  currentPlayerData.nextSummoned = e.detail.jobDetail.nextSummoned; // Phoenix/Bahamut?
  currentPlayerData.attunement = e.detail.jobDetail.attunement; // Is this the stacks?
  currentPlayerData.attunementSeconds = e.detail.jobDetail.attunementMilliseconds / 1000;
  currentPlayerData.activePrimal = e.detail.jobDetail.activePrimal; // Array?
  currentPlayerData.usableArcanum = e.detail.jobDetail.usableArcanum; // Array

  `${detail.jobDetail.aetherflowStacks} | ${detail.jobDetail.tranceMilliseconds} | ${detail.jobDetail.attunement} | ${detail.jobDetail.attunementMilliseconds} | [${
    detail.jobDetail.activePrimal.join(', ')
  }] | [${detail.jobDetail.usableArcanum.join(', ')}] | ${detail.jobDetail.nextSummoned}`;

};