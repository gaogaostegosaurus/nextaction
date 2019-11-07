
const addStatus = ({
  name,
  time = duration[name],
  id = player.ID
} = {}) => {
  const match = statusTracker.findIndex((status) => status.name === name);
  if (match) {
    statusTracker[match] = { name, id, time: Date.now() + time };
  } else { // Push new entry into array if no matching entry
    statusTracker.push({ name, id, time: Date.now() + time });
  }
};

const checkStatus = ({
  name,
  id = player.ID,
} = {}) => {
  const match = statusTracker.findIndex((status) => status.name === name);
  if (match) {
    return Math.max(statusTracker[match].time - Date.now(), -1);
  }
  return -1;
};

const removeStatus = ({
  name,
  id = player.ID,
} = {}) => {
  const match = statusTracker.findIndex((status) => status.name === name);
  if (match) {
    statusTracker.splice(match, 1);
  }
};
