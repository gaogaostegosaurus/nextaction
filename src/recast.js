/* globals recastArray actionData */

// eslint-disable-next-line no-unused-vars
const setActionRecast = ({
  name,
  recast, // In seconds
  array = recastArray,
} = {}) => {
  if (name === undefined) { return; }
  let defaultRecast = recast;

  // Get default recast if recast not provided
  if (recast === undefined) {
    const actionDataIndex = actionData.findIndex((element) => element.name === name);
    defaultRecast = actionData[actionDataIndex].recast;
  }

  if (defaultRecast === undefined) { return; }

  const defaultRecastMilliseconds = defaultRecast * 1000;

  // Look for existing entry in recasts
  const arrayIndex = array.findIndex((element) => element.name === name);

  if (arrayIndex > -1) {
    // If entry exists, set recast time
    // eslint-disable-next-line no-param-reassign
    array[arrayIndex].recast = defaultRecastMilliseconds
    + Math.max(array[arrayIndex].recast, Date.now());
    // Adding Math.max for charge skills
  } else {
    // Add new entry if entry does not exist
    array.push({ name, recast: defaultRecastMilliseconds + Date.now() });
  }

  // console.log(`Actions: ${JSON.stringify(array)}`);
};

const getActionRecast = ({
  name,
  array = recastArray,
} = {}) => {
  if (name === undefined) { return 9999; }

  // Get data from actionList
  const actionDataIndex = actionData.findIndex((element) => element.name === name);
  if (actionDataIndex === -1) { return 9999; } // "It's not available yet"

  // Get index of existing entry (if it does)
  const arrayIndex = array.findIndex((element) => element.name === name);

  // Return 0 if not found ("it's off recast")
  if (arrayIndex === -1) { return 0; }

  const defaultRecast = actionData[actionDataIndex].recast;
  if (defaultRecast === undefined) { return 0; }

  const defaultCharges = actionData[actionDataIndex].charges;

  const recastTimestamp = array[arrayIndex].recast;
  let recastSeconds = (recastTimestamp - Date.now()) / 1000;

  // (Charges are a headache. Note to self.)
  // A 30 second recast ability with 3 charges would have the following:
  // 2 charges left if the "initial" recast is at 25 (x < 30 * 1)
  // 1 charge at 50 (30 * 1 < x < 30 * 2)
  // 0 charges at 70 seconds (30 * 2 > x)
  // Recast needs to be incremented for charge abilities in the other functions because of this

  if (defaultCharges) { recastSeconds -= (defaultCharges - 1) * defaultRecast; }

  // Return a minimum of 0 to prevent shenanigans
  if (recastSeconds < 0) { return 0; }

  // Return recast time if found
  return recastSeconds;
};

// eslint-disable-next-line no-unused-vars
const getActionCharges = ({
  name,
  array = recastArray,
} = {}) => {
  if (!name) { return 0; }

  const i = actionData.findIndex((e) => e.name === name);
  if (i < 0) { return 0; }

  const defaultCharges = actionData[i].charges;
  if (!defaultCharges) { return 1; }

  const recastSeconds = getActionRecast({ name, array });
  const defaultRecast = actionData[i].recast;

  const chargesRemaining = defaultCharges - Math.ceil(recastSeconds / defaultRecast);
  return chargesRemaining;
};
