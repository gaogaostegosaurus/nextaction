/* global nextAction */

nextAction.setStatus = ({
  name,
  targetID = nextAction.player.id,
  sourceID = nextAction.player.id,
  duration,
  stacks = 1,
} = {}) => {
  if (!name) { return false; }

  const { statuses } = nextAction;

  let newDuration;

  if (!duration) {
    // Get default recast if recast not provided
    const i = nextAction.statusData.findIndex((e) => e.name === name);
    newDuration = nextAction.statusData[i].duration * 1000 + Date.now();
  } else {
    // Use provided recast
    newDuration = duration * 1000 + Date.now();
  }

  const i = statuses.findIndex(
    (e) => e.name === name && e.targetID === targetID && e.sourceID === sourceID,
  );

  if (i > -1) {
    statuses[i].duration = newDuration;
  } else {
    // Add new ID and status to durations array
    statuses.push({
      name, targetID, sourceID, duration: newDuration, stacks,
    });
  }

  return true;
};

nextAction.getStatusDuration = ({
  name,
  targetID,
  sourceID,
} = {}) => {
  if (!name) { return false; }

  const { statuses } = nextAction;

  const i = statuses.findIndex(
    (e) => e.name === name && e.targetID === targetID && e.sourceID === sourceID,
  );

  if (i > -1) {
    return statuses[i].duration;
  }

  return -1;
};

nextAction.getStatusStacks = ({
  name,
  targetID,
  sourceID,
} = {}) => {
  if (!name) { return false; }

  const { statuses } = nextAction;

  const i = statuses.findIndex(
    (e) => e.name === name && e.targetID === targetID && e.sourceID === sourceID,
  );

  if (i > -1) {
    return statuses[i].stacks;
  }

  return -1;
};
