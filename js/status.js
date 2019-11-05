
function addStatus(name, time, id) {

  if (time === undefined) {
    time = duration[name];
  }
  if (id == undefined) {
    id = player.ID;
  }

  if (!effectTracker[name]) { // Create array if it doesn't exist yet
    effectTracker[name] = [id, Date.now() + time];
  }
  else if (effectTracker[name].indexOf(id) > -1) { // Update array if target match found
    effectTracker[name][effectTracker[name].indexOf(id) + 1] = Date.now() + time;
  }
  else { // Push new entry into array if no matching entry
    effectTracker[name].push(id, Date.now() + time);
  }
}

function checkStatus(name, id) {

  if (id === undefined) {
    id = player.ID;
  }

  if (!effectTracker[name]) {
    return -1;
  } else if (effectTracker[name].indexOf(id) > -1) {
    return Math.max(effectTracker[name][effectTracker[name].indexOf(id) + 1] - Date.now(), -1);
  }
}

function removeStatus(name, id) {

  if (id === undefined) {
    id = player.ID;
  }

  if (!effectTracker[name]) {
    effectTracker[name] = [];
  }
  else if (effectTracker[name].indexOf(id) > -1) {
    effectTracker[name].splice(effectTracker[name].indexOf(id), 2);
  }
}
