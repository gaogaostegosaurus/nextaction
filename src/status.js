/* Puts status effects into an array with target ID as an identifier */
nextActionOverlay.addStatus = ({
  statusName,
  propertyName = statusName.replace(/[\s':-]/g, '').toLowerCase(),
  playerData = nextActionOverlay.playerData,
  id = playerData.id,
  duration = nextActionOverlay.duration[propertyName], /* Assign -1 to "reset" recast */
} = {}) => {
  const { statusTracker } = nextActionOverlay;

  if (!statusTracker[propertyName]) {
    // Array doesn't exist yet, so create
    statusTracker[propertyName] = [{ id, duration: Date.now() + duration }];
  } else {
    // Array already exists, check for existing ID
    const match = statusTracker[propertyName].findIndex((entry) => entry.id === id);
    if (match > -1) {
      // Match exists, update with new time
      statusTracker[propertyName][match] = { id, duration: Date.now() + duration };
    } else {
      // Push new entry into array if no matching entry
      statusTracker[propertyName].push({ id, duration: Date.now() + duration });
    }
  }
  // console.log(`added status to statustracker.${name}: ${JSON.stringify(statusTracker[name])}`);
};

// Checks for existing status effects and returns milliseconds left
nextActionOverlay.checkStatus = ({
  statusName,
  propertyName = statusName.replace(/[\s':-]/g, '').toLowerCase(),
  playerData = nextActionOverlay.playerData,
  id = playerData.id,
} = {}) => {
  if (!statusName) {
    return -1; /* Exit if called by mistake? */
  }

  const statusTracker = nextActionOverlay.statusTracker || {};

  if (!statusTracker[propertyName]) {
    return -1;
  }

  const match = statusTracker[propertyName].findIndex((entry) => entry.id === id);

  // match > -1 if index found
  if (match > -1) {
    return Math.max(statusTracker[propertyName][match].duration - Date.now(), -1);
  } return -1;
};

nextActionOverlay.removeStatus = ({
  statusName,
  propertyName = statusName.replace(/[\s':-]/g, '').toLowerCase(),
  playerData = nextActionOverlay.playerData,
  id = playerData.id,
} = {}) => {
  if (!statusName) {
    return; /* Exit if called by mistake? */
  }

  const { statusTracker } = nextActionOverlay;

  if (statusTracker[propertyName]) {
    nextActionOverlay.addStatus({ statusName, id, duration: -1 });
  }
};
