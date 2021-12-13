/* global nextAction */

nextAction.setStatus = ({
  name,
  targetID = nextAction.playerData.id,
  sourceID = nextAction.playerData.id,
  duration,
  stacks = 0,
  array = nextAction.statusArray,
} = {}) => {
  if (!name) { return; }
  const statusArray = array;
  const i = statusArray.findIndex(
    (e) => e.name === name && e.targetID === targetID && e.sourceID === sourceID,
  );

  const j = nextAction.statusData.findIndex((e) => e.name === name);

  let newDuration;
  if (!duration) {
    // Get default duration if recast not provided
    newDuration = nextAction.statusData[j].duration * 1000 + Date.now();
  } else {
    // Use provided recast
    newDuration = duration * 1000 + Date.now();
  }

  let newStacks;
  if (!stacks) { newStacks = nextAction.statusData[j].stacks; } else { newStacks = stacks; }

  if (i > -1) {
    statusArray[i].duration = newDuration;
    if (newStacks) { statusArray[j].stacks = newStacks; } else { delete statusArray[j].stacks; }
  } else {
    // Add new ID and status to durations array
    const k = statusArray.push({
      name, targetID, sourceID, duration: newDuration,
    });
    if (newStacks) { statusArray[k].stacks = newStacks; }
  }
};

// eslint-disable-next-line no-unused-vars
const removeStatus = ({
  name,
  targetID = nextAction.playerData.id,
  sourceID = nextAction.playerData.id,
  array = nextAction.statusArray,
} = {}) => {
  // Just "sets" status with duration 0
  nextAction.setStatus({
    name, targetID, sourceID, duration: 0, array,
  });
};

const getStatusDuration = ({
  name,
  targetID = nextAction.playerData.id,
  sourceID = nextAction.playerData.id,
  array = nextAction.statusArray,
} = {}) => {
  if (!name) { return 0; }

  const statusArray = array;

  const i = statusArray.findIndex(
    (e) => e.name === name && e.targetID === targetID && e.sourceID === sourceID,
  );

  if (i > -1) {
    // Returns seconds
    const statusDuration = (statusArray[i].duration - Date.now()) / 1000;
    return statusDuration;
  }

  return 0;
};

nextAction.setStatusStacks = ({
  name,
  targetID = nextAction.playerData.id,
  sourceID = nextAction.playerData.id,
  array = nextAction.statusArray,
  stacks,
} = {}) => {
  if (!name) { return; }

  const statusArray = array;

  const i = statusArray.findIndex(
    (e) => e.name === name && e.targetID === targetID && e.sourceID === sourceID,
  );

  if (i > -1) {
    statusArray[i].stacks = stacks;
  }
};

nextAction.useStatusStacks = ({
  name,
  targetID = nextAction.playerData.id,
  sourceID = nextAction.playerData.id,
  array = nextAction.statusArray,
} = {}) => {
  if (!name) { return; }
  const statusArray = array;
  const i = statusArray.findIndex(
    (e) => e.name === name && e.targetID === targetID && e.sourceID === sourceID,
  );

  if (i > -1) { statusArray[i].stacks -= 1; }

  if (statusArray[i].stacks <= 0) {
    const { removeStatus } = nextAction;
    removeStatus({
      name, targetID, sourceID, array,
    });
  }
};

nextAction.getStatusStacks = ({
  name,
  targetID = nextAction.playerData.id,
  sourceID = nextAction.playerData.id,
  array = nextAction.statusArray,
} = {}) => {
  if (!name) { return 0; }
  const statusArray = array;
  const i = statusArray.findIndex(
    (e) => e.name === name && e.targetID === targetID && e.sourceID === sourceID,
  );

  if (i > -1) {
    if (statusArray[i].duration <= 0) { statusArray[i].stacks = 0; }
    return statusArray[i].stacks;
  }

  return 0;
};
