
// Puts status effects into an array with target ID as an identifier
const addStatus = ({
  name,
  property = name.replace(/[\s'-]/g, '').toLowerCase(),
  time = duration[property],
  id = player.ID,
} = {}) => {
  if (!statusTracker[property]) {
    // Array doesn't exist yet, so create
    statusTracker[property] = [{ id, time: Date.now() + time }];
  } else {
    // Array already exists, check for existing ID
    const match = statusTracker[property].findIndex((entry) => entry.id === id);
    if (match > -1) {
      // Match exists, update with new time
      statusTracker[property][match] = { id, time: Date.now() + time };
    } else {
      // Push new entry into array if no matching entry
      statusTracker[property].push({ id, time: Date.now() + time });
    }
  }
  // console.log(`added status to statustracker.${name}: ${JSON.stringify(statusTracker[name])}`);
};

// Checks for existing status effects and returns milliseconds left
const checkStatus = ({
  name,
  property = name.replace(/[\s'-]/g, '').toLowerCase(),
  id = player.ID,
} = {}) => {
  // Search for index of matching ID
  if (!statusTracker[property]) {
    return -1;
  }

  const match = statusTracker[property].findIndex((entry) => entry.id === id);

  // match > -1 if index found
  if (match > -1) {
    return Math.max(statusTracker[property][match].time - Date.now(), -1);
  }

  return -1;
};

const removeStatus = ({
  name,
  property = name.replace(/[\s'-]/g, '').toLowerCase(),
  id = player.ID,
} = {}) => {
  if (statusTracker[property]) {
    const match = statusTracker[property].findIndex((entry) => entry.id === id);
    if (match > -1) {
      statusTracker[property].splice(match, 1);
    }
  }
  // console.log(`removed status from statustracker.${name}: ${JSON.stringify(statusTracker[name])}`);
};
