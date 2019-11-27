
// Adds a recast time to tracker array
const addRecast = ({
  name,
  property = name.replace(/[\s'-]/g, '').toLowerCase(),
  time = recast[property],
  id = player.ID,
} = {}) => {
  // Create if array doesn't exist yet
  if (!recastTracker[property]) {
    recastTracker[property] = [];
  }

  // Look for matching index
  const match = recastTracker[property].findIndex((entry) => entry.id === id);

  if (match > -1) {
    // Update array if match found
    recastTracker[property][match] = { id, time: time + Date.now() };
  } else {
    // Push new entry into array if no matching entry
    recastTracker[property].push({ id, time: time + Date.now() });
  }
};

const checkRecast = ({
  name,
  property = name.replace(/[\s'-]/g, '').toLowerCase(),
  id = player.ID,
} = {}) => {
  // Check if array exists
  if (!recastTracker[property]) {
    return -1;
  }

  // Find matching index
  const match = recastTracker[property].findIndex((entry) => entry.id === id);

  if (match > -1) {
    // Returns matching recast time
    return Math.max(recastTracker[property][match].time - Date.now(), -1);
  }

  // Return a recast time of -1 if no match
  return -1;
};
