/* global nextAction */

nextAction.setStatus = ({
  name,
  targetID = nextAction.player.id,
  sourceID = nextAction.player.id,
  duration,
  stacks = 1,
  array,
} = {}) => {
  if (!name) { return false; }

  let statusArray;
  if (array) {
    statusArray = array;
  } else {
    statusArray = nextAction.statusArray;
  }

  let newDuration;

  if (!duration) {
    // Get default duration if recast not provided
    const i = nextAction.statusData.findIndex((e) => e.name === name);
    newDuration = nextAction.statusData[i].duration * 1000 + Date.now();
  } else {
    // Use provided recast
    newDuration = duration * 1000 + Date.now();
  }

  const i = statusArray.findIndex(
    (e) => e.name === name && e.targetID === targetID && e.sourceID === sourceID,
  );

  if (i > -1) {
    statusArray[i].duration = newDuration;
  } else {
    // Add new ID and status to durations array
    statusArray.push({
      name, targetID, sourceID, duration: newDuration, stacks,
    });
  }

  return true;
};

nextAction.getStatusDuration = ({
  name,
  targetID,
  sourceID,
  array,
} = {}) => {
  if (!name) { return false; }

  let statusArray;
  if (array) {
    statusArray = array;
  } else {
    statusArray = nextAction.statusArray;
  }

  const i = statusArray.findIndex(
    (e) => e.name === name && e.targetID === targetID && e.sourceID === sourceID,
  );

  if (i > -1) {
    return (statusArray[i].duration - Date.now()) / 1000;
  }

  return -1;
};

nextAction.getStatusStacks = ({
  name,
  targetID,
  sourceID,
  array,
} = {}) => {
  if (!name) { return false; }

  let statusArray;
  if (array) {
    statusArray = array;
  } else {
    statusArray = nextAction.statusArray;
  }
  const i = statusArray.findIndex(
    (e) => e.name === name && e.targetID === targetID && e.sourceID === sourceID,
  );

  if (i > -1) {
    return statusArray[i].stacks;
  }

  return -1;
};
