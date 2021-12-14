/* global playerData statusData statusArray  */

const setStatus = ({
  name,
  targetID = playerData.id,
  sourceID = playerData.id,
  duration,
  stacks = 0,
  array = statusArray,
} = {}) => {
  if (!name) { return; }
  const statusArray = array;
  const i = statusArray.findIndex(
    (e) => e.name === name && e.targetID === targetID && e.sourceID === sourceID,
  );

  const j = statusData.findIndex((e) => e.name === name);

  let newDuration;
  if (!duration) {
    // Get default duration if recast not provided
    newDuration = statusData[j].duration * 1000 + Date.now();
  } else {
    // Use provided recast
    newDuration = duration * 1000 + Date.now();
  }

  let newStacks;
  if (!stacks) { newStacks = statusData[j].stacks; } else { newStacks = stacks; }

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
  targetID = playerData.id,
  sourceID = playerData.id,
  array = statusArray,
} = {}) => {
  // Just "sets" status with duration 0
  setStatus({
    name, targetID, sourceID, duration: 0, array,
  });
};

// eslint-disable-next-line no-unused-vars
const getStatusDuration = ({
  name,
  targetID = playerData.id,
  sourceID = playerData.id,
  array = statusArray,
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

// eslint-disable-next-line no-unused-vars
const setStatusStacks = ({
  name,
  targetID = playerData.id,
  sourceID = playerData.id,
  array = statusArray,
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

// eslint-disable-next-line no-unused-vars
const useStatusStacks = ({
  name,
  targetID = playerData.id,
  sourceID = playerData.id,
  array = statusArray,
} = {}) => {
  if (!name) { return; }
  const statusArray = array;
  const i = statusArray.findIndex(
    (e) => e.name === name && e.targetID === targetID && e.sourceID === sourceID,
  );

  if (i > -1) { statusArray[i].stacks -= 1; }

  if (statusArray[i].stacks <= 0) {
    removeStatus({
      name, targetID, sourceID, array,
    });
  }
};

// eslint-disable-next-line no-unused-vars
const getStatusStacks = ({
  name,
  targetID = playerData.id,
  sourceID = playerData.id,
  array = statusArray,
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
