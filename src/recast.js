/* globals
actionData playerStatsData
currentPlayerData
*/

// eslint-disable-next-line no-unused-vars
const addActionRecast = ({
  actionName,
  recast, // In seconds
  recastArray,
} = {}) => {
  if (!actionName) {
    // eslint-disable-next-line no-console
    console.log('addActionRecast: no actionName');
    return;
  }

  if (!recastArray) {
    // eslint-disable-next-line no-console
    console.log('addActionRecast: no recastArray');
    return;
  }

  let newRecast = recast;
  const actionDataIndex = actionData.findIndex((element) => element.name === actionName);
  if (actionDataIndex === -1) { console.log(`addActionRecast: ${actionName} not in actionData`); return; }

  // Get default recast if recast not provided
  if (!recast) { newRecast = actionData[actionDataIndex].recast; }

  // Exit if no recast is defined at all (function will have no effect)
  if (!newRecast) { return; }

  // Convert to milliseconds for array timestamp
  const newRecastMilliseconds = newRecast * 1000;

  // Look for existing entry in recasts
  const recastArrayIndex = recastArray.findIndex((element) => element.name === actionName);

  // If entry exists, set recast timestamp
  if (recastArrayIndex > -1) {
    // Math.max() to calculate "total" recast for charge skills
    // eslint-disable-next-line max-len, no-param-reassign
    recastArray[recastArrayIndex].recast = newRecastMilliseconds + Math.max(recastArray[recastArrayIndex].recast, Date.now());
  } else {
    // Add new entry if entry does not exist
    recastArray.push({ name: actionName, recast: newRecastMilliseconds + Date.now() });
  }
  // console.log(JSON.stringify(recastArray));
};

// eslint-disable-next-line no-unused-vars
const resetActionRecast = ({
  actionName,
  recastArray,
} = {}) => {
  if (!actionName) {
    // eslint-disable-next-line no-console
    console.log('resetActionRecast: no actionName');
    return;
  }

  if (!recastArray) {
    // eslint-disable-next-line no-console
    console.log('resetActionRecast: no recastArray');
    return;
  }

  const recastArrayIndex = recastArray.findIndex((element) => element.name === actionName);
  if (recastArrayIndex > -1) {
    recastArray.splice(recastArrayIndex, 1);
  }
};

// eslint-disable-next-line no-unused-vars
const checkActionRecast = ({
  actionName,
  recastArray,
} = {}) => {
  if (!actionName) {
    // eslint-disable-next-line no-console
    console.log('checkActionRecast: no actionName');
    return 9999;
  }

  if (!recastArray) {
    // eslint-disable-next-line no-console
    console.log('checkActionRecast: no recastArray');
    return 9999;
  }

  // Get data from actionList
  const actionDataIndex = actionData.findIndex((element) => element.name === actionName);
  if (actionDataIndex === -1) { return 9999; } // "It's not available yet"

  // Check for recast data
  const defaultRecast = actionData[actionDataIndex].recast;
  if (!defaultRecast) { return 0; }
  // const defaultCharges = actionData[actionDataIndex].charges;

  // Get index of existing entry
  const recastArrayIndex = recastArray.findIndex((element) => element.name === actionName);

  // Return 0 if not found ("it's off recast")
  if (recastArrayIndex === -1) { return 0; }
  // console.log(`${recastArray[recastArrayIndex].name} ${recastArray[recastArrayIndex].recast}`);

  // Calculate recast
  // Actions with charges will return higher than 0 when charges are available
  // Example: Mudra will return < 20 if it has one charge left, 0 at 2 charges
  const recastTimestamp = recastArray[recastArrayIndex].recast;
  const recastSeconds = (recastTimestamp - Date.now()) / 1000;

  // Return 0 and remove if recast <= 0 (to prevent shenanigans)
  if (recastSeconds <= 0) {
    resetActionRecast({ actionName, recastArray });
    return 0;
  }

  return recastSeconds;
};

// eslint-disable-next-line no-unused-vars
// const checkActionCharges = ({
//   actionName,
//   recastArray,
// } = {}) => {
//   if (!actionName) {
//     // eslint-disable-next-line no-console
//     console.log('checkActionCharges: no actionName, returning 0');
//     return 0;
//   }

//   if (!recastArray) {
//     // eslint-disable-next-line no-console
//     console.log('checkActionCharges: no recastArray, returning 0');
//     return 0;
//   }

//   // Search data for action
//   const actionDataIndex = actionData.findIndex((e) => e.name === actionName);

//   // "This action doesn't exist"
//   if (actionDataIndex === -1) { return 0; }

//   // "This action doesn't use charges"
//   const defaultCharges = actionData[actionDataIndex].charges;
//   if (!defaultCharges) { return 0; }

//   // Calculate remaining charges using recast
//   const defaultRecast = actionData[actionDataIndex].recast;
//   const recastArrayIndex = recastArray.findIndex((e) => e.name === actionName);
//   let recastTimestamp = 0;
//   if (recastArrayIndex > -1) {
//     recastTimestamp = recastArray[recastArrayIndex].recast;
//   }
//   const recastSeconds = (recastTimestamp - Date.now() - 1000) / 1000;
//   const chargesRemaining = defaultCharges - Math.ceil(recastSeconds / defaultRecast);

//   // Return charges remaining from above calculation
//   return chargesRemaining;
// };

// eslint-disable-next-line no-unused-vars
const calculateRecast = ({
  recast = 2.5, // Should work with other stuff too like Aethercharge
  modifier = 1, // 0.85 for Huton, etc. etc.
} = {}) => {
  const { level } = currentPlayerData;

  let { speed } = currentPlayerData;
  // Set speed to base stat if there hasn't been a chance to update things
  if (!speed) { speed = playerStatsData[level - 1].baseStat; }

  // eslint-disable-next-line max-len
  const newRecast = Math.floor(Math.floor(Math.floor((1000 - Math.floor((130 * (speed - playerStatsData[level - 1].baseStat)) / playerStatsData[level - 1].levelMod)) * recast) * modifier) / 10) / 100;
  return newRecast;
};
