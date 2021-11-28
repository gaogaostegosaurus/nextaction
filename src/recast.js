/* global nextAction, nextActionOverlay */

// Might eventually need something here to all-lowercase names

nextAction.setRecast = ({
  actionName,
  actionRecast,
} = {}) => {
  const { recasts } = nextAction;

  // Look for existing entry in recasts
  const i = recasts.findIndex((element) => element.name === actionName);

  if (i > -1) {
    // If entry exists, set recast time
    recasts[i].recast = actionRecast;
  } else if (actionRecast) {
    // Add new entry otherwise
    recasts.push({ name: actionName, recast: actionRecast });
  } else {
    // Add new entry using default recast
    const j = nextAction.actionData.findIndex((element) => element.name === actionName);
    const defaultRecast = nextAction.actionData[j].recast;
    recasts.push({ name: actionName, recast: defaultRecast });
  }
};

nextAction.checkRecast = ({
  actionName,
} = {}) => {
  const { recasts } = nextAction;

  // Look for existing entry
  const i = recasts.findIndex((element) => element.name === actionName);

  if (i > -1) {
    // Return recast time if found
    return recasts[i].recast;
  }
  // Return -1 if not found
  return -1;
};

// Replace this crap

nextActionOverlay.addRecast = ({
  actionName,
  propertyName = actionName.replace(/[\s':-]/g, '').toLowerCase(),
  playerData = nextActionOverlay.playerData,
  id = playerData.id,
  recast = nextActionOverlay.recast[propertyName], /* Assign -1 to "reset" recast */
} = {}) => {
  if (!actionName) {
    return; /* Exit if called by mistake? */
  }

  const { recastTracker } = nextActionOverlay;

  if (!recastTracker[propertyName]) {
    recastTracker[propertyName] = [{ id, recast: Date.now() + recast }];
  } else {
    const match = recastTracker[propertyName].findIndex((entry) => entry.id === id);
    if (match > -1) {
      /* Update recast if match found */
      recastTracker[propertyName][match] = { id, recast: Date.now() + recast };
    } else {
      /* Push recast value if no match found */
      recastTracker[propertyName].push({ id, recast: Date.now() + recast });
    }
  }
};

nextActionOverlay.checkRecast = ({
  actionName,
  propertyName = actionName.replace(/[\s':-]/g, '').toLowerCase(),
  playerData = nextActionOverlay.playerData,
  id = playerData.id,
} = {}) => {
  const { recastTracker } = nextActionOverlay;

  if (!recastTracker[propertyName]) {
    return -1; /* Return -1 if array doesn't exist */
  }

  const match = recastTracker[propertyName].findIndex((entry) => entry.id === id);

  /* Find matching ID in array */
  if (match > -1) {
    return Math.max(recastTracker[propertyName][match].recast - Date.now(), -1);
  } return -1; /* Return -1 if no match */
};

nextActionOverlay.NEWaddRecast = ({
  actionName,
  id = nextActionOverlay.playerData.id,
  propertyName = actionName.replace(/[\s':-]/g, '').toLowerCase(),
  recast = nextActionOverlay.recast[propertyName], /* Assign -1 to "reset" recast */
} = {}) => {
  if (!actionName) { return; }

  const { recastArray } = nextActionOverlay;

  const actionMatch = (entry) => entry.id === id
    && entry.actionName.toLowerCase() === actionName.toLowerCase();
  const index = recastArray.findIndex(actionMatch);

  if (index > -1) {
    recastArray[index] = [{ id, actionName, recast: Date.now() + recast }];
  } else {
    recastArray.push({ id, actionName, recast: Date.now() + recast });
  }
};

nextActionOverlay.NEWcheckRecast = ({
  actionName,
  id = nextActionOverlay.playerData.id,
} = {}) => {
  if (!actionName) { return -1; } // eslint wants me to return a value

  const { recastArray } = nextActionOverlay;

  // Find matching ID in array
  const actionMatch = (entry) => entry.id === id
    && entry.actionName.toLowerCase() === actionName.toLowerCase();
  const index = recastArray.findIndex(actionMatch);

  if (index > -1) {
    return Math.max(recastArray[index].recast - Date.now(), -1);
  } return -1; // Return -1 if no match
};
