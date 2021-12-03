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
  if (!name) { return 0; }

  const recastArray = array; // I'm not sure why I do this

  // Get index of existing entry (if it does)
  const i = recastArray.findIndex((e) => e.name === name);

  // Return 0 if not found ("it's off recast")
  if (i < 0) { return 0; }

  // Get action data
  const { actionData } = nextAction;
  const j = actionData.findIndex((e) => e.name === name);
  const defaultRecast = actionData[j].recast;
  const defaultCharges = actionData[j].charges;

  const recastTimestamp = recastArray[i].recast;
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
  const { actionData } = nextAction;
  const i = actionData.findIndex((e) => e.name === name);
  const defaultRecast = actionData[i].recast;
  const defaultCharges = actionData[i].charges;
  const recastSeconds = nextAction.getRecast({ name, array });

  if (!defaultCharges) { return 0; }

  const chargesRemaining = defaultCharges - Math.ceil(recastSeconds / defaultRecast);
  return chargesRemaining;
};