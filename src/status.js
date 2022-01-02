/* global currentPlayerData statusData */

// Main add status function
// eslint-disable-next-line no-unused-vars
const addStatus = ({
  statusName,
  targetID = currentPlayerData.id, // Seems like most statuses default to this
  sourceID = currentPlayerData.id, // Seems like most statuses default to this
  duration,
  stacks,
  statusArray,
} = {}) => {
  // eslint-disable-next-line no-console
  if (!statusName) { console.log('addStatus: undefined statusName'); return; }
  // eslint-disable-next-line no-console
  if (!statusArray) { console.log('addStatus: undefined statusArray'); return; }

  // Check if status is defined inside data array
  const statusDataIndex = statusData.findIndex((element) => element.name === statusName);
  // eslint-disable-next-line no-console
  if (statusDataIndex === -1) { console.log(`addStatus: ${statusName} not in statusData array`); return; }

  // Convert seconds to milliseconds for array use
  // Use provided duration or default to statusData duration
  let newDurationMilliseconds;
  if (duration) {
    newDurationMilliseconds = duration * 1000;
  } else {
    newDurationMilliseconds = statusData[statusDataIndex].duration * 1000;
  }

  // Create timestamp value for array
  const newDurationTimestamp = newDurationMilliseconds + Date.now();

  // Set number of stacks, else get default value of stacks if unprovided
  let newStacks;
  if (stacks) {
    newStacks = stacks;
  } else if (statusData[statusDataIndex].stacks) {
    newStacks = statusData[statusDataIndex].stacks;
  }

  // Look for existing entry
  let statusArrayIndex = statusArray.findIndex(
    (element) => element.name === statusName
    && element.targetID === targetID && element.sourceID === sourceID,
  );

  // Adjust existing timestamp if existing element found
  // Push new array entry if not
  if (statusArrayIndex > -1) {
    // eslint-disable-next-line no-param-reassign
    statusArray[statusArrayIndex].duration = newDurationTimestamp;
  } else {
    statusArray.push({
      name: statusName, targetID, sourceID, duration: newDurationTimestamp,
    });
    statusArrayIndex = statusArray.length - 1;
  }

  // Add stacks if value was defined
  if (newStacks) {
    // eslint-disable-next-line no-param-reassign
    statusArray[statusArrayIndex].stacks = newStacks;
  }
};

// eslint-disable-next-line no-unused-vars
const removeStatus = ({
  statusName,
  targetID = currentPlayerData.id,
  sourceID = currentPlayerData.id,
  statusArray,
} = {}) => {
  if (!statusName) {
    // eslint-disable-next-line no-console
    console.log('removeStatus: no name');
    return;
  }

  if (!statusArray) {
    // eslint-disable-next-line no-console
    console.log('removeStatus:: no statusArray');
    return;
  }

  const statusDataIndex = statusData.findIndex((element) => element.name === statusName);
  if (statusDataIndex === -1) {
    // eslint-disable-next-line no-console
    console.log(`removeStatus: ${statusName} not in statusData array`);
    return;
  }

  const statusArrayIndex = statusArray.findIndex(
    (element) => element.name === statusName
    && element.targetID === targetID && element.sourceID === sourceID,
  );

  if (statusArrayIndex > -1) {
    statusArray.splice(statusArrayIndex, 1);
  }
  // // Set stacks to 0 if needed

  //   if (statusArray[statusArrayIndex].stacks !== undefined) {
  //     // eslint-disable-next-line no-param-reassign
  //     statusArray[statusArrayIndex].stacks = 0;
  //   }
  // }
};

// eslint-disable-next-line no-unused-vars
const checkStatusDuration = ({
  statusName,
  targetID = currentPlayerData.id,
  sourceID = currentPlayerData.id,
  statusArray = currentStatusArray,
} = {}) => {
  if (!statusName) {
    // eslint-disable-next-line no-console
    console.log('checkStatusDuration: no name');
    return 0;
  }

  if (!statusArray) {
    // eslint-disable-next-line no-console
    console.log('checkStatusDuration:: no statusArray');
    return 0;
  }

  const statusDataIndex = statusData.findIndex((element) => element.name === statusName);
  if (statusDataIndex === -1) {
    // eslint-disable-next-line no-console
    console.log(`checkStatusDuration: ${statusName} not in statusData array`);
    return 0;
  }

  const statusArrayIndex = statusArray.findIndex(
    (element) => element.name === statusName
    && element.targetID === targetID
    && element.sourceID === sourceID,
  );

  if (statusArrayIndex > -1) {
    // Returns seconds
    const statusDuration = (statusArray[statusArrayIndex].duration - Date.now()) / 1000;
    if (statusDuration > 0) {
      return statusDuration; // Only return positive values
    }
    // Remove if status is zero and allow return zero at buttom
    removeStatus({
      statusName, targetID, sourceID, statusArray,
    });
  }

  return 0;
};

// eslint-disable-next-line no-unused-vars
const checkStatusStacks = ({
  statusName,
  targetID = currentPlayerData.id,
  sourceID = currentPlayerData.id,
  statusArray,
} = {}) => {
  if (!statusName) {
    // eslint-disable-next-line no-console
    console.log('checkStatusStacks: no name');
    return 0;
  }

  if (!statusArray) {
    // eslint-disable-next-line no-console
    console.log('checkStatusStacks:: no statusArray');
    return 0;
  }

  const statusDataIndex = statusData.findIndex((element) => element.name === statusName);
  if (statusDataIndex === -1) {
    // eslint-disable-next-line no-console
    console.log(`checkStatusStacks: ${statusName} not in statusData array`);
    return 0;
  }

  const statusArrayIndex = statusArray.findIndex(
    (element) => element.name === statusName
    && element.targetID === targetID && element.sourceID === sourceID,
  );

  if (statusArrayIndex > -1) {
    // eslint-disable-next-line no-param-reassign
    const statusStacks = statusArray[statusArrayIndex].stacks;
    if (statusStacks > 0) { return statusStacks; }
    removeStatus({
      statusName, targetID, sourceID, statusArray,
    });
  }

  return 0;
};

// eslint-disable-next-line no-unused-vars
const addStatusStacks = ({
  statusName,
  targetID = currentPlayerData.id,
  sourceID = currentPlayerData.id,
  stacks = 1,
  statusArray,
} = {}) => {
  const initialStacks = checkStatusStacks({
    statusName, targetID, sourceID, statusArray,
  });

  addStatus({
    statusName, targetID, sourceID, stacks: stacks + initialStacks, statusArray,
  });
};

// eslint-disable-next-line no-unused-vars
const removeStatusStacks = ({
  statusName,
  targetID = currentPlayerData.id,
  sourceID = currentPlayerData.id,
  stacks = 1,
  statusArray,
} = {}) => {
  if (!statusName) {
    // eslint-disable-next-line no-console
    console.log('removeStatusStacks: no name');
    return;
  }

  if (!statusArray) {
    // eslint-disable-next-line no-console
    console.log('removeStatusStacks: no statusArray');
    return;
  }

  const statusDataIndex = statusData.findIndex((element) => element.name === statusName);
  if (statusDataIndex === -1) {
    // eslint-disable-next-line no-console
    console.log(`removeStatusStacks: ${statusName} not in statusData array`);
    return;
  }

  const statusArrayIndex = statusArray.findIndex(
    (element) => element.name === statusName
    && element.targetID === targetID
    && element.sourceID === sourceID,
  );

  // eslint-disable-next-line no-param-reassign
  if (statusArrayIndex > -1) {
    // eslint-disable-next-line max-len, no-param-reassign
    statusArray[statusArrayIndex].stacks -= stacks;
    if (statusArray[statusArrayIndex].stacks <= 0) {
      removeStatus({
        statusName, targetID, sourceID, statusArray,
      });
    }
  }
};

// Adds status effect shown in actionData array during actionMatch function
// eslint-disable-next-line no-unused-vars
const addActionStatus = ({
  actionName,
  statusArray,
} = {}) => {
  // Check for status in action
  const actionDataIndex = actionData.findIndex((element) => element.name === actionName);
  if (!actionData[actionDataIndex].statusName) { return; }

  const { statusName } = actionData[actionDataIndex];

  if (statusName) {
    let targetID;
    let duration;
    const { extendsDuration } = actionData[actionDataIndex];
    const { maxDuration } = actionData[actionDataIndex];
    let stacks;
    const { grantsStacks } = actionData[actionDataIndex]; // "skill doesn't grant max stacks"
    const { maxStacks } = actionData[actionDataIndex];
    const { statusTarget } = actionData[actionDataIndex];
    if (statusTarget === 'target') {
      targetID = targetData.id;
    } else if (extendsDuration) {
      // eslint-disable-next-line max-len
      duration = Math.min(checkStatusDuration({ statusName, statusArray }) + extendsDuration, maxDuration);
    } else if (grantsStacks) {
      stacks = Math.min(checkStatusStacks({ statusName, statusArray }) + grantsStacks, maxStacks);
    }

    // Time to add it
    addStatus({
      statusName,
      targetID,
      duration,
      stacks,
      statusArray,
    });
  }
};
