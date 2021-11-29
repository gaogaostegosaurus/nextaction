/* global nextAction */

nextAction.setRecast = ({
  name,
  recast, // In seconds
  array,
} = {}) => {
  if (!name) { return false; }

  let recastArray;
  if (array) {
    recastArray = array;
  } else {
    recastArray = nextAction.recastArray;
  }

  let newRecast;

  if (!recast) {
    // Get default recast if recast not provided
    const i = nextAction.actionData.findIndex((e) => e.name === name);
    newRecast = nextAction.actionData[i].recast * 1000 + Date.now();
  } else {
    // Use provided recast
    newRecast = recast * 1000 + Date.now();
  }

  // Look for existing entry in recasts
  const i = recastArray.findIndex((e) => e.name === name);

  if (i > -1) {
    // If entry exists, set recast time
    recastArray[i].recast = newRecast;
  } else {
    // Add new entry if entry does not exist
    recastArray.push({ name, recast: newRecast });
  }

  return true;
};

nextAction.getRecast = ({
  name,
  array,
} = {}) => {
  if (!name) { return false; }

  let recastArray;
  if (array) {
    recastArray = array;
  } else {
    recastArray = nextAction.recastArray;
  }

  // Look for existing entry
  const i = recastArray.findIndex((element) => element.name === name);

  if (i > -1) {
    // Return recast time if found
    return (recastArray[i].recast - Date.now()) / 1000;
  }

  // Return -1 if not found, effectively says "it's off recast"
  return -1;
};

// Might eventually need something here to all-lowercase names
