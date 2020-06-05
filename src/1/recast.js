
const addRecast = ({
  name,
  property = name.replace(/[\s'-]/g, '').toLowerCase(),
  time = recast[property], /* Assigned to -1 to "reset" recast */
  id = player.id, /* Typically doesn't need to be assigned, but just in case I get around to writing
   raid type stuff */
} = {}) => {
  /* Create array if it doesn't exist yet */
  if (!recastTracker[property]) {
    recastTracker[property] = [];
  }

  /* Look for matching ID */
  const match = recastTracker[property].findIndex((entry) => entry.id === id);

  if (match > -1) {
    /* Update recast if match found */
    recastTracker[property][match] = { id, time: time + Date.now() };
  } else {
    /* Push recast value if no match found */
    recastTracker[property].push({ id, time: time + Date.now() });
  }
};

const checkRecast = ({
  name,
  property = name.replace(/[\s'-]/g, '').toLowerCase(),
  id = player.id,
} = {}) => {
  /* Return -1 if array doesn't exist */
  if (!recastTracker[property]) {
    return -1;
  }

  /* Find matching ID in array */
  const match = recastTracker[property].findIndex((entry) => entry.id === id);

  if (match > -1) {
    /* Returns recast time matching ID */
    /* Returns -1 if the number is less than -1 */
    return Math.max(recastTracker[property][match].time - Date.now(), -1);
  }

  /* Return -1 if no match */
  return -1;
};
