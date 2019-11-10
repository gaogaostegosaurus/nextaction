
// Puts status effects into an array with target ID as an identifier
const addStatus = ({
  name,
  time = duration[name],
  id = player.ID,
} = {}) => {
  if (!statusTracker[name]) {
    // Array doesn't exist yet, so create
    statusTracker[name] = [{ id, time: Date.now() + time }];
  } else {
    // Array already exists, check for existing ID
    const match = statusTracker[name].findIndex((entry) => entry.id === id);
    if (match > -1) {
      // Match exists, update with new time
      statusTracker[name][match] = { id, time: Date.now() + time };
    } else {
      // Push new entry into array if no matching entry
      statusTracker[name].push({ id, time: Date.now() + time });
    }
  }
  // console.log(`added status to statustracker.${name}: ${JSON.stringify(statusTracker[name])}`);
};

// Checks for existing status effects and returns milliseconds left
const checkStatus = ({
  name,
  id = player.ID,
} = {}) => {
  // Search for index of matching ID
  if (!statusTracker[name]) {
    return -1;
  }

  const match = statusTracker[name].findIndex((entry) => entry.id === id);

  // match > -1 if index found
  if (match > -1) {
    return Math.max(statusTracker[name][match].time - Date.now(), -1);
  }

  return -1;
};

const removeStatus = ({
  name,
  id = player.ID,
} = {}) => {
  if (statusTracker[name]) {
    const match = statusTracker[name].findIndex((entry) => entry.id === id);
    if (match > -1) {
      statusTracker[name].splice(match, 1);
    }
  }
  // console.log(`removed status from statustracker.${name}: ${JSON.stringify(statusTracker[name])}`);
};
