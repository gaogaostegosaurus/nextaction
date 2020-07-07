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
