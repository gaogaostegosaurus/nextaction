
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
  if (!previous.removeAction) {
    previous.removeAction = Date.now();
  } else if (Date.now() - previous.removeAction > 1000) {
    document.getElementById(row).querySelectorAll('div[class~="action-hide"]').forEach((e) => e.remove());
  }
};


const resyncActions = ({
  array = actionArray,
} = {}) => {
  // Use this to reset entire row if array is reset somehow
  // i. e. on RNG procs that change rotation, missed/fatfingered combos, etc.

  const row = getArrayRow({ array });

  // removeOldActions({ row });

  // Find current row length
  const rowDiv = document.getElementById(row);
  const rowLength = rowDiv.children.length;
  const arrayLength = array.length;

  let arrayIndex = 0;

  for (let i = 0; i < rowLength; i += 1) {
    const iconDiv = rowDiv.children[i];
    if (array[arrayIndex] && array[arrayIndex].name === iconDiv.dataset.action
    && iconDiv.className === 'action action-show') {
      arrayIndex += 1;
    } else {
      iconDiv.className = 'action action-hide';
      iconDiv.dataset.action = 'none';
    }
  }

  // Should have only matching icons remaining now
  if (arrayIndex < arrayLength) {
    for (let i = arrayIndex; i < arrayLength; i += 1) {
      const iconDiv = document.createElement('div');
      const iconImg = document.createElement('img');
      const iconOverlay = document.createElement('img');
      rowDiv.append(iconDiv);
      iconDiv.append(iconImg);
      iconDiv.append(iconOverlay);
      iconDiv.className = 'action action-hide';
      iconImg.className = 'actionimg';
      iconOverlay.className = 'actionoverlay';
      iconDiv.dataset.action = array[i].name;
      iconImg.src = `img/icon/${icon[array[i].img]}.png`;
      iconOverlay.src = 'img/icon/overlay.png';
      void iconDiv.offsetWidth;
      iconDiv.className = 'action action-show';
    }
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

  // Cannot do this because if you call this function multiple times, it acts weird
  // Maybe make a previous variable to prevent that from happening if necessary
  // removeOldActions({ row });

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
