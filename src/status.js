/* global playerData statusData statusArray  */

const setStatus = ({
  name,
  targetID = playerData.id,
  sourceID = playerData.id,
  duration,
  stacks = 0,
  array = statusArray,
} = {}) => {
  if (name === undefined) { return; }
  let arrayIndex = array.findIndex(
    (element) => element.name === name
    && element.targetID === targetID
    && element.sourceID === sourceID,
  );

  const statusDataIndex = statusData.findIndex((element) => element.name === name);
  if (statusDataIndex === -1) {
    // eslint-disable-next-line no-console
    console.log(`Could not find ${name} in statusData array`);
    return;
  }
  let newDuration;
  if (duration === undefined) {
    // Get default duration if recast not provided
    newDuration = statusData[statusDataIndex].duration * 1000 + Date.now();
  } else {
    // Use provided recast
    newDuration = duration * 1000 + Date.now();
  }

  let newStacks;
  if (stacks === undefined) {
    newStacks = statusData[statusDataIndex].stacks;
  } else { newStacks = stacks; }

  if (arrayIndex > -1) {
    // eslint-disable-next-line no-param-reassign
    array[arrayIndex].duration = newDuration;
    if (newStacks) {
      // eslint-disable-next-line no-param-reassign
      array[arrayIndex].stacks = newStacks;
    // eslint-disable-next-line no-param-reassign
    } else { delete array[arrayIndex].stacks; }
  } else {
    // Add new ID and status to durations array
    arrayIndex = array.push({
      name, targetID, sourceID, duration: newDuration,
    });
    // eslint-disable-next-line no-param-reassign
    if (newStacks) { array[arrayIndex].stacks = newStacks; }
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
    name, targetID, sourceID, duration: 0, stacks: 0, array,
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

  const arrayIndex = array.findIndex(
    (element) => element.name === name
    && element.targetID === targetID
    && element.sourceID === sourceID,
  );

  if (arrayIndex > -1) {
    // Returns seconds
    const statusDuration = (array[arrayIndex].duration - Date.now()) / 1000;
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
  const i = array.findIndex(
    (e) => e.name === name && e.targetID === targetID && e.sourceID === sourceID,
  );

  if (i > -1) {
    // eslint-disable-next-line no-param-reassign
    array[i].stacks = stacks;
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
  // console.log(`useStatusStacks array: ${JSON.stringify(array)}`);

  const arrayIndex = array.findIndex(
    (element) => element.name === name
    && element.targetID === targetID
    && element.sourceID === sourceID,
  );

  if (arrayIndex === -1) { return; }

  // eslint-disable-next-line no-param-reassign
  if (arrayIndex > -1) { array[arrayIndex].stacks -= 1; }

  if (array[arrayIndex].stacks <= 0) {
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
  const i = array.findIndex(
    (e) => e.name === name && e.targetID === targetID && e.sourceID === sourceID,
  );

  if (i > -1) {
    // eslint-disable-next-line no-param-reassign
    if (array[i].duration <= 0) { array[i].stacks = 0; }
    return array[i].stacks;
  }

  return 0;
};
