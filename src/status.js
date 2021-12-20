/* global currentPlayerData statusData */

const addStatus = ({
  statusName,
  targetID = currentPlayerData.id,
  sourceID = currentPlayerData.id,
  duration,
  stacks,
  statusArray,
} = {}) => {
  // Function should return array index of status

  if (!statusName) {
    // eslint-disable-next-line no-console
    console.log('addStatus: no statusName');
    return;
  }

  if (!statusArray) {
    // eslint-disable-next-line no-console
    console.log('addStatus:: no statusArray');
    return;
  }

  const statusDataIndex = statusData.findIndex((element) => element.name === statusName);
  if (statusDataIndex === -1) {
    // eslint-disable-next-line no-console
    console.log(`addStatus: ${statusName} not in statusData array`);
    return;
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

  let newStacks;
  if (stacks) {
    newStacks = stacks;
  } else if (statusData[statusDataIndex].stacks !== undefined) {
    // Get default value of stacks if this exists
    newStacks = statusData[statusDataIndex].stacks;
  }

  // Look for matching entry
  const statusArrayIndex = statusArray.findIndex(
    (element) => element.name === statusName
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
    statusArray.push({
      name: statusName, targetID, sourceID, duration: newDurationTimestamp,
    });
    // if (newStacks !== undefined) {
    // Add stacks if defined
    // eslint-disable-next-line no-param-reassign
    // statusArray[statusArrayIndex].stacks = newStacks;
    // }
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
  
  statusArray.splice(statusArrayIndex, 1);
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
  statusName,
  targetID = currentPlayerData.id,
  sourceID = currentPlayerData.id,
  statusArray,
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
    });  }

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
    });  }

  return 0;
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
