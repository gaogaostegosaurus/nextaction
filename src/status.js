/* global currentPlayerData statusData */

const addStatus = ({
  name,
  targetID = currentPlayerData.id,
  sourceID = currentPlayerData.id,
  duration,
  stacks,
  statusArray,
} = {}) => {
  // Function should return array index of status

  if (name === undefined) {
    // eslint-disable-next-line no-console
    console.log('addStatus: name is undefined');
    return -1;
  }

  if (statusArray === undefined) {
    // eslint-disable-next-line no-console
    console.log('addStatus: statusArray is undefined');
    return -1;
  }

  const statusDataIndex = statusData.findIndex((element) => element.name === name);
  if (statusDataIndex === -1) {
    // eslint-disable-next-line no-console
    console.log(`addStatus: ${name} not in statusData array`);
    return -1;
  }

  let newDurationMilliseconds; // Conversion for array use
  if (duration === undefined) {
    // Get default duration if recast not provided
    newDurationMilliseconds = statusData[statusDataIndex].duration * 1000;
  } else {
    // Use provided recast
    newDurationMilliseconds = duration * 1000;
  }

  // Create timestamp value for array
  const newDurationTimestamp = newDurationMilliseconds + Date.now();

  // let newStacks;
  // if (stacks !== undefined) {
  //   newStacks = stacks;
  // } else if (statusData[statusDataIndex].stacks !== undefined) {
  //   // Get default value of stacks if this exists
  //   newStacks = statusData[statusDataIndex].stacks;
  // }

  // Look for matching entry
  let statusArrayIndex = statusArray.findIndex(
    (element) => element.name === name
    && element.targetID === targetID && element.sourceID === sourceID,
  );

  if (statusArrayIndex > -1) {
    // Adjust existing timestamp if existing element found
    // eslint-disable-next-line no-param-reassign
    statusArray[statusArrayIndex].duration = newDurationTimestamp;
    // if (newStacks !== undefined) {
    //   // Assign stacks if set
    //   // eslint-disable-next-line no-param-reassign
    //   statusArray[statusArrayIndex].stacks = newStacks;
    // }
  } else {
    // Add new ID and status to array
    statusArrayIndex = statusArray.push({
      name, targetID, sourceID, duration: newDurationTimestamp,
    });
    // if (newStacks !== undefined) {
    // Add stacks if defined
    // eslint-disable-next-line no-param-reassign
    // statusArray[statusArrayIndex].stacks = newStacks;
    // }
  }

  return statusArrayIndex;
};

// eslint-disable-next-line no-unused-vars
const removeStatus = ({
  name,
  targetID = currentPlayerData.id,
  sourceID = currentPlayerData.id,
  statusArray,
} = {}) => {
  if (name === undefined) {
    // eslint-disable-next-line no-console
    console.log('removeStatus: name is undefined');
    return;
  }

  if (statusArray === undefined) {
    // eslint-disable-next-line no-console
    console.log('removeStatus: statusArray is undefined');
    return;
  }

  const statusDataIndex = statusData.findIndex((element) => element.name === name);
  if (statusDataIndex === -1) {
    // eslint-disable-next-line no-console
    console.log(`removeStatus: ${name} not in statusData array`);
    return;
  }

  // Just "sets" status with duration 0
  const statusArrayIndex = addStatus({
    name, targetID, sourceID, duration: 0, statusArray,
  });

  // // Set stacks to 0 if needed
  // if (statusArrayIndex > -1) {
  //   if (statusArray[statusArrayIndex].stacks !== undefined) {
  //     // eslint-disable-next-line no-param-reassign
  //     statusArray[statusArrayIndex].stacks = 0;
  //   }
  // }
};

// eslint-disable-next-line no-unused-vars
const checkStatusDuration = ({
  name,
  targetID = currentPlayerData.id,
  sourceID = currentPlayerData.id,
  statusArray,
} = {}) => {
  if (name === undefined) {
    // eslint-disable-next-line no-console
    console.log('checkStatusDuration: name is undefined');
    return null;
  }

  if (statusArray === undefined) {
    // eslint-disable-next-line no-console
    console.log('checkStatusDuration: statusArray is undefined');
    return null;
  }

  const statusDataIndex = statusData.findIndex((element) => element.name === name);
  if (statusDataIndex === -1) {
    // eslint-disable-next-line no-console
    console.log(`checkStatusDuration: ${name} not in statusData array`);
    return null;
  }

  const statusArrayIndex = statusArray.findIndex(
    (element) => element.name === name
    && element.targetID === targetID
    && element.sourceID === sourceID,
  );

  if (statusArrayIndex > -1) {
    // Returns seconds
    const statusDuration = (statusArray[statusArrayIndex].duration - Date.now()) / 1000;
    return statusDuration;
  }

  // Not found in array
  return 0;
};

// eslint-disable-next-line no-unused-vars
const checkStatusStacks = ({
  name,
  targetID = currentPlayerData.id,
  sourceID = currentPlayerData.id,
  statusArray,
} = {}) => {
  if (name === undefined) {
    // eslint-disable-next-line no-console
    console.log('checkStatusStacks: name is undefined');
    return null;
  }

  if (statusArray === undefined) {
    // eslint-disable-next-line no-console
    console.log('checkStatusStacks: statusArray is undefined');
    return null;
  }

  const statusDataIndex = statusData.findIndex((element) => element.name === name);
  if (statusDataIndex === -1) {
    // eslint-disable-next-line no-console
    console.log(`checkStatusStacks: ${name} not in statusData array`);
    return null;
  }

  const statusArrayIndex = statusArray.findIndex(
    (element) => element.name === name
    && element.targetID === targetID && element.sourceID === sourceID,
  );

  let statusStacks;
  if (statusArrayIndex > -1) {
    // eslint-disable-next-line no-param-reassign
    statusStacks = statusArray[statusArrayIndex].stacks;
  } else {
    statusStacks = null;
  }

  return statusStacks;
};

// eslint-disable-next-line no-unused-vars
const removeStatusStacks = ({
  name,
  targetID = currentPlayerData.id,
  sourceID = currentPlayerData.id,
  stacks = 1,
  statusArray,
} = {}) => {
  if (name === undefined) {
    // eslint-disable-next-line no-console
    console.log('removeStatusStacks: name is undefined');
    return;
  }

  if (statusArray === undefined) {
    // eslint-disable-next-line no-console
    console.log('removeStatusStacks: statusArray is undefined');
    return;
  }

  const statusDataIndex = statusData.findIndex((element) => element.name === name);
  if (statusDataIndex === -1) {
    // eslint-disable-next-line no-console
    console.log(`removeStatusStacks: ${name} not in statusData array`);
    return;
  }

  const statusArrayIndex = statusArray.findIndex(
    (element) => element.name === name
    && element.targetID === targetID
    && element.sourceID === sourceID,
  );

  // eslint-disable-next-line no-param-reassign
  if (statusArrayIndex > -1) {
    // eslint-disable-next-line max-len, no-param-reassign
    statusArray[statusArrayIndex].stacks = Math.max(statusArray[statusArrayIndex].stacks - stacks, 0);
  } else { return; }

  if (statusArray[statusArrayIndex].stacks <= 0) {
    removeStatus({
      name, targetID, sourceID, statusArray,
    });
  }
};
