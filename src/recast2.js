/* global nextAction */

nextAction.addRecast = ({
  name,
  recast, // In seconds
  array = nextAction.recastArray,
} = {}) => {
  if (!name) { return; }

  const { actionData } = nextAction;
  const recastArray = array;
  let defaultRecast = recast;

  // Get default recast if recast not provided
  if (!recast) {
    const i = actionData.findIndex((e) => e.name === name);
    defaultRecast = nextAction.actionData[i].recast;
  }

  const defaultRecastMilliseconds = defaultRecast * 1000;

  // Look for existing entry in recasts
  const i = recastArray.findIndex((e) => e.name === name);

  if (i > -1) {
    // If entry exists, set recast time
    const j = actionData.findIndex((e) => e.name === name);
    const defaultCharges = actionData[j].charges;
    if (defaultCharges > 0 && recastArray[i].recast - Date.now() > 0) {
      // Increment by default recast if entry exists and is more than current timestamp
      recastArray[i].recast += defaultRecastMilliseconds;
    } else {
      recastArray[i].recast = defaultRecastMilliseconds + Date.now();
    }
  } else {
    // Add new entry if entry does not exist
    recastArray.push({ name, recast: defaultRecastMilliseconds + Date.now() });
  }
};

nextAction.getRecast = ({
  name,
  array = nextAction.recastArray,
} = {}) => {
  if (!name) { return 9999; }

  const recastArray = array; // I'm not sure why I do this

  // Get data from actionList
  const { actionList } = nextAction;
  const i = actionList.findIndex((e) => e.name === name);
  if (i < 0) { return 9999; } // "It's not usable yet"

  // Get index of existing entry (if it does)
  const j = recastArray.findIndex((e) => e.name === name);

  // Return 0 if not found ("it's off recast")
  if (j < 0) { return 0; }

  const defaultRecast = actionList[i].recast;
  const defaultCharges = actionList[i].charges;

  const recastTimestamp = recastArray[j].recast;
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

nextAction.getCharges = ({
  name,
  array,
} = {}) => {
  if (!name) { return 0; }

  const { actionList } = nextAction;
  const i = actionList.findIndex((e) => e.name === name);
  if (i < 0) { return 0; }

  const defaultCharges = actionList[i].charges;
  if (!defaultCharges) { return 0; }

  const recastSeconds = nextAction.getRecast({ name, array });
  const defaultRecast = actionList[i].recast;

  const chargesRemaining = defaultCharges - Math.ceil(recastSeconds / defaultRecast);
  return chargesRemaining;
};
