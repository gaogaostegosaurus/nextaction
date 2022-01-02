/* global
currentPlayerData, currentRecastArray, currentStatusArray
addStatus
ninStatusMatch rdmStatusMatch samStatusMatch
*/

// eslint-disable-next-line no-unused-vars
const actionMatch = ({
  logType,
  actionName,
  targetID = targetData.id,
  playerData = currentPlayerData,
  recastArray = currentRecastArray,
  statusArray = currentStatusArray,
  loop = false,
} = {}) => {
  // This function should run once as-is per loop and then fall to the wrapper function afterwards
  // console.log(`${logType} ${actionName} ${targetID}`);
  const { job } = playerData;
  // setComboAction({ actionName });

  // Weird errors?
  if (!playerData) { console.log('actionMatch: No playerData defined'); return; }
  if (!recastArray) { console.log('actionMatch: No recastArray defined'); return; }
  if (!statusArray) { console.log('actionMatch: No statusArray defined'); return; }

  const actionTargetCount = getActionDataProperty({ actionName, property: 'targetCount' });
  // eslint-disable-next-line no-param-reassign
  if (actionTargetCount) { playerData.targetCount = actionTargetCount; }

  // Adds generic recast and status stuff
  addActionRecast({ actionName, recastArray });
  // addActionStatus({ actionName, statusArray });
  // This did NOT work well due to statuses being complicated - easier to just add in below

  // Add generic combo action stuff
  const actionType = getActionDataProperty({ actionName, property: 'type' });
  if (actionType) {
    setComboAction({ actionName, playerData });
  }
  // Job specific stuff here
  // Since loop conditions are too different between jobs, start loop inside job functions
  if (job === 'NIN') {
    ninActionMatch({
      // logType, // Some of these aren't used currently
      actionName,
      // targetID,
      playerData,
      recastArray,
      statusArray,
      loop,
    });
  } else if (job === 'SAM') {
    samActionMatch({
      // logType,
      actionName,
      targetID,
      playerData,
      recastArray,
      statusArray,
      loop,
    });
  // } else if (job === 'RDM') {
  //   rdmActionMatch({
  //     logType,
  //     actionName,
  //     targetID,
  //     playerData,
  //     recastArray,
  //     statusArray,
  //     loop,
  //   });
  }

  // Start loop with certain things only
  // if (!loop && checkStatusDuration({ statusName: 'Ten Chi Jin', statusArray }) === 0
  // && ['Spell', 'Weaponskill', 'Ninjutsu'].includes(actionType)) {
  //   const delay = calculateDelay({ actionName });
  //   startLoop({ delay });
  // }
};

// eslint-disable-next-line no-unused-vars
const statusMatch = ({
  logType, statusName, statusSeconds, sourceID, targetID, statusStacks,
} = {}) => {
  addStatus({
    statusName,
    sourceID,
    targetID,
    duration: statusSeconds,
    stacks: statusStacks,
    statusArray: currentStatusArray,
  });
  const { job } = currentPlayerData.job;

  if (job === 'NIN') {
    ninStatusMatch({ logType, statusName, sourceID });
  } else if (job === 'RDM') {
    rdmStatusMatch({ logType, statusName, sourceID });
  // } else if (job === 'SAM') {
  //   samStatusMatch({ logType, statusName });
  }
};

const startsCastingMatch = ({ actionName } = {}) => {
  // Call loop again with casting parameter
  if (['RDM', 'SAM'].includes(currentPlayerData.job)) { startLoop({ casting: actionName }); }
  fadeIcon({ name: actionName });
};

const cancelActionMatch = ({ actionName } = {}) => {
  if (['RDM', 'SAM'].includes(currentPlayerData.job)) { startLoop(); }
  unfadeIcon({ name: actionName });
};

// eslint-disable-next-line no-unused-vars
const playerStatsMatch = ({ piety, skillSpeed, spellSpeed } = {}) => {
  const speed = Math.max(skillSpeed, spellSpeed);
  const { level } = currentPlayerData;
  currentPlayerData.speed = speed;
  currentPlayerData.gcd = calculateRecast();
  currentPlayerData.mpRegen = 200 + Math.floor(
    (150 * (piety - playerStatsData[level - 1].baseStat)) / playerStatsData[level - 1].levelMod,
  );

  // for (let index = 0; index < actionData.length; index += 1) {
  //   if (['Spell', 'Weaponskill'].includes(actionData[index].type)) {
  //     if (actionData[index].cast) {
  //       actionData[index].cast = calculateRecast({ recast: actionData[index].cast });
  //     }
  //     if (actionData[index].recast) {
  //       actionData[index].recast = calculateRecast({ recast: actionData[index].recast });
  //     }
  //   }
  // }
};
