/* globals actionData */

// eslint-disable-next-line no-unused-vars
const addActionRecast = ({
  name,
  recast, // In seconds
  recastArray,
} = {}) => {
  if (name === undefined) {
    // eslint-disable-next-line no-console
    console.log('addActionRecast: name is undefined');
    return;
  }

  if (recastArray === undefined) {
    // eslint-disable-next-line no-console
    console.log('addActionRecast: recastArray is undefined');
    return;
  }

  let newRecast = recast;
  const actionDataIndex = actionData.findIndex((element) => element.name === name);
  if (actionDataIndex === -1) { console.log(`addActionRecast: ${name} not in actionData`); return; }

  // Get default recast if recast not provided
  if (recast === undefined) { newRecast = actionData[actionDataIndex].recast; }

  // Exit if no recast is defined (function will have no effect)
  if (newRecast === undefined) { return; }

  // Convert to milliseconds for array timestamp
  const newRecastMilliseconds = newRecast * 1000;

  // Look for existing entry in recasts
  const arrayIndex = recastArray.findIndex((element) => element.name === name);

  // If entry exists, set recast timestamp
  if (arrayIndex > -1) {
    // Math.max() to calculate "total" recast for charge skills
    // eslint-disable-next-line max-len, no-param-reassign
    recastArray[arrayIndex].recast = newRecastMilliseconds + Math.max(recastArray[arrayIndex].recast, Date.now());
  } else {
    // Add new entry if entry does not exist
    recastArray.push({ name, recast: newRecastMilliseconds + Date.now() });
  }
};

// eslint-disable-next-line no-unused-vars
const checkActionRecast = ({
  name,
  recastArray,
} = {}) => {
  if (name === undefined) {
    // eslint-disable-next-line no-console
    console.log('checkActionRecast: name is undefined, returning 9999');
    return 9999;
  }

  if (recastArray === undefined) {
    // eslint-disable-next-line no-console
    console.log('checkActionRecast: recastArray is undefined, returning 9999');
    return 9999;
  }

  // Get data from actionList
  const actionDataIndex = actionData.findIndex((element) => element.name === name);
  if (actionDataIndex === -1) { return 9999; } // "It's not available yet"

  // Check for recast data
  const defaultRecast = actionData[actionDataIndex].recast;
  if (defaultRecast === undefined) { return 0; }
  const defaultCharges = actionData[actionDataIndex].charges;

  // Get index of existing entry
  const recastArrayIndex = recastArray.findIndex((element) => element.name === name);

  // Return 0 if not found ("it's off recast")
  if (recastArrayIndex === -1) { return 0; }
  // console.log(`${recastArray[recastArrayIndex].name} ${recastArray[recastArrayIndex].recast}`);

  // Calculate recast
  const recastTimestamp = recastArray[recastArrayIndex].recast;
  let recastSeconds = (recastTimestamp - Date.now()) / 1000;

  // If action has charges, reduce recastSeconds * number of charges beyond the first
  // Allows this function to return 0 if the ability is usable at all
  if (defaultCharges !== undefined) {
    recastSeconds -= (defaultCharges - 1) * defaultRecast;
  }

  // Return a minimum of 0 to prevent shenanigans
  if (recastSeconds < 0) { recastSeconds = 0; }

  // Return recast time if found
  return recastSeconds;
};

// eslint-disable-next-line no-unused-vars
const checkActionCharges = ({
  name,
  recastArray,
} = {}) => {
  if (name === undefined) {
    // eslint-disable-next-line no-console
    console.log('checkActionCharges: name is undefined, returning 0');
    return 0;
  }

  if (recastArray === undefined) {
    // eslint-disable-next-line no-console
    console.log('checkActionCharges: recastArray is undefined, returning 0');
    return 0;
  }

  // Search data for action
  const actionDataIndex = actionData.findIndex((e) => e.name === name);

  // Return 0 if not found
  if (actionDataIndex === -1) { return 0; }

  // Return 0 if this ability has no charges by default
  const defaultCharges = actionData[actionDataIndex].charges;
  if (defaultCharges === undefined) { return 0; }

  // Calculate remaining charges using recast
  const defaultRecast = actionData[actionDataIndex].recast;
  const recastArrayIndex = recastArray.findIndex((e) => e.name === name);
  let recastTimestamp = 0;
  if (recastArrayIndex > -1) {
    recastTimestamp = recastArray[recastArrayIndex].recast;
  }
  const recastSeconds = (recastTimestamp - Date.now()) / 1000;
  const chargesRemaining = defaultCharges - Math.ceil(recastSeconds / defaultRecast);

  // Return charges remaining from above calculation
  return chargesRemaining;
};
