
const getArrayRow = ({
  array,
} = {}) => {
  // Associate array with row
  let row = 'action-row';
  if (array === priorityArray) {
    row = 'priority-row';
  } else if (array === cooldownArray) {
    row = 'cooldown-row';
  }
  return row;
};

const removeOldActions = ({
  row,
} = {}) => {
  // Clear away old divs before adding more actions
  // Called at beginning of other action functions
  
  document.getElementById(row).querySelectorAll('div[class~="action-hide"]').forEach((e) => e.parentNode.removeChild(e));
};


const resyncActions = ({
  array = actionArray,
} = {}) => {
  // Use this to reset entire row if array is reset somehow 
  // i. e. on RNG procs that change rotation, missed/fatfingered combos, etc.
  
  const row = getArrayRow({ array });
  
  removeOldActions({ row });
  
  // Find current row length
  const rowLength = document.getElementById(row).children.length;

  // Delete already-hidden divs
  for (let i = 0; i < rowLength; i += 1) {
    const iconDiv = document.getElementById(row).children[i];
    if (iconDiv.dataset.action === 'none' || iconDiv.className === 'action action-hide') {
      iconDiv.remove();
    }
  }

  // Hide all actions currently displayed
  for (let i = 0; i < rowLength; i += 1) {
    const iconDiv = document.getElementById(row).children[i];
    iconDiv.dataset.action = 'none';
    iconDiv.className = 'action action-hide';
  }

  // Append new actions from array to end of row
  for (let i = 0; i < array.length; i += 1) {
    const iconDiv = document.createElement('div');
    const iconImg = document.createElement('img');
    const iconOverlay = document.createElement('img');
    iconDiv.className = 'action action-hide';
    iconImg.className = 'actionimg';
    iconOverlay.className = 'actionoverlay';
    iconDiv.dataset.action = array[i].name;
    iconImg.src = `img/icon/${icon[array[i].img]}.png`;
    iconOverlay.src = 'img/icon/overlay.png';
    document.getElementById(row).append(iconDiv);
    iconDiv.append(iconImg);
    iconDiv.append(iconOverlay);
    void iconDiv.offsetWidth;
    iconDiv.className = 'action action-show';
  }
};

const addAction = ({
  name,
  img = name,
  array = actionArray,
  order = 'last',
} = {}) => {
  // Adds action to specified array and row
  
  // Pick row using array
  const row = getArrayRow({ array });
  removeOldActions({ row });

  // Create elements
  const iconDiv = document.createElement('div');
  const iconImg = document.createElement('img');
  const iconOverlay = document.createElement('img');

  // Add elements to page
  if (order === 'last') {
    document.getElementById(row).append(iconDiv);
  } else {
    document.getElementById(row).prepend(iconDiv);
  }
  iconDiv.className = 'action action-hide';
  iconImg.className = 'actionimg';
  iconOverlay.className = 'actionoverlay';
  iconDiv.dataset.action = name;
  iconImg.src = `img/icon/${icon[img]}.png`;
  iconOverlay.src = 'img/icon/overlay.png';
  iconDiv.append(iconImg);
  iconDiv.append(iconOverlay);
  void iconDiv.offsetWidth; // Reflow to make transition work
  iconDiv.className = 'action action-show';

  // Add to array
  if (order === 'last') {
    array.push({ name, img });
  } else {
    array.unshift({ name, img });
  }
};

const fadeAction = ({
  name,
  array = actionArray,
} = {}) => {
  // Sets an action to lower opacity, for casting or whatever
  
  const row = getArrayRow({ array });
  removeOldActions({ row });

  const match = document.getElementById(row).querySelector(`div[data-action="${name}"]`);
  if (match) {
    match.className = 'action action-fade';
  }
};

const unfadeAction = ({
  name,
  array = actionArray,
} = {}) => {
  // Undos fadeAction effect
  
  const row = getArrayRow({ array });
  removeOldActions({ row });

  const match = document.getElementById(row).querySelector(`div[data-action="${name}"]`);
  if (match) {
    match.className = 'action action-show';
  }
};

const removeAction = ({
  name,
  array = actionArray,
} = {}) => {
  // Removes action from display
  
  const row = getArrayRow({ array });
  removeOldActions({ row });

  const match = document.getElementById(row).querySelector(`div[data-action="${name}"]`);
  if (match) {
    match.className = 'action action-hide';
    match.dataset.action = 'none';
  }

  const removeTarget = array.findIndex((action) => action.name === name);
  if (removeTarget > -1) {
    array.splice(removeTarget, 1);
  }
};
