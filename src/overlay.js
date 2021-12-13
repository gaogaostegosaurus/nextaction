/* global nextAction */

nextAction.getArrayRow = ({
  iconArray = nextAction.iconArrayB,
} = {}) => {
  // Associate array with row
  let rowID = 'icon-b';
  if (iconArray === nextAction.iconArrayA) {
    rowID = 'icon-a';
  } else if (iconArray === nextAction.iconArrayB) {
    rowID = 'icon-b';
  } else if (iconArray === nextAction.iconArrayC) {
    rowID = 'icon-c';
  }
  return rowID;
};

// Uses an array of objects to create a new set of icons
// If icons exist, it removes any icons that don't match first and then adds any necessary ones
nextAction.syncOverlay = ({
  actionArray,
  row = 'icon-b',
} = {}) => {
  // Get the div element
  const rowDiv = document.getElementById(row);

  // Find div length
  const rowLength = rowDiv.children.length;

  // Check to see how many icons currently match the array, removing any that don't
  let iconCount = 0;
  const iconMax = 10;
  for (let i = 0; i < rowLength; i += 1) {
    const iconDiv = rowDiv.children[i];
    if (actionArray[iconCount] && actionArray[iconCount].name === iconDiv.dataset.name) {
      // Go on to next array item if the div already contains the icon
      iconCount += 1;
      if (iconCount >= iconMax) { break; }
    } else {
      // Remove icon if it doesn't match
      iconDiv.dataset.name = 'none';
      iconDiv.classList.replace('icon-show', 'icon-hide');
      setTimeout(() => { iconDiv.remove(); }, 1000);
    }
  }

  // Add any missing icons
  if (iconCount < actionArray.length) {
    for (let i = iconCount; i < actionArray.length; i += 1) {
      // Define new divs
      const iconDiv = document.createElement('div');
      const iconImg = document.createElement('img');
      const iconOverlay = document.createElement('img');

      // Append new divs
      rowDiv.append(iconDiv);
      iconDiv.append(iconImg);
      iconDiv.append(iconOverlay);

      // Set default attributes
      iconDiv.className = 'icon icon-hide';
      iconImg.className = 'iconimg';
      iconOverlay.className = 'iconoverlay';

      // Add icon images
      iconDiv.dataset.name = actionArray[i].name;
      iconImg.src = `iconhr/${actionArray[i].img}.png`;
      iconOverlay.src = 'iconoverlay.png';

      // Add OGCD stuff
      if (actionArray[i].size === 'small') {
        iconDiv.classList.add('icon-small');
      }

      // eslint-disable-next-line no-void
      void iconDiv.offsetWidth; // Can't remember what this does, but probably do reflow smoothly

      iconDiv.classList.replace('icon-hide', 'icon-show');
      iconCount += 1;
      if (iconCount >= iconMax) { break; }
    }
  }
};

nextAction.showIcon = ({
  name,
  row = 'icon-b',
  match = 'exact',
} = {}) => {
  // Undos fadeAction effect

  const rowDiv = document.getElementById(row);

  // removeOldIcons({ rowID });

  let matchDiv;
  if (match === 'contains') {
    matchDiv = rowDiv.querySelector(`div[data-name~="${name}"]:not([class~="icon-hide"])`);
  } else {
    matchDiv = rowDiv.querySelector(`div[data-name="${name}"]:not([class~="icon-hide"])`);
  }

  if (matchDiv) {
    // eslint-disable-next-line no-void
    void matchDiv.offsetWidth;
    matchDiv.classList.remove('icon-fade');
  }
};

// eslint-disable-next-line no-unused-vars
const fadeIcon = ({
  name,
  row = 'icon-b',
  match = 'exact',
} = {}) => {
  // Sets an action to lower opacity, for casting or whatever

  const rowDiv = document.getElementById(row);

  // removeOldIcons({ rowID });

  let matchDiv;
  if (match === 'contains') {
    matchDiv = rowDiv.querySelector(`div[data-name~="${name}"]:not([class~="icon-hide"])`);
  } else {
    matchDiv = rowDiv.querySelector(`div[data-name="${name}"]:not([class~="icon-hide"])`);
  }

  if (matchDiv) {
    // eslint-disable-next-line no-void
    void matchDiv.offsetWidth;
    matchDiv.classList.add('icon-fade');
  }
};

// eslint-disable-next-line no-unused-vars
const removeIcon = ({
  name,
  row = 'icon-b',
  match = 'exact',
} = {}) => {
  const rowDiv = document.getElementById(row);

  let matchDiv;
  if (match === 'contains') {
    matchDiv = rowDiv.querySelector(`div[data-name~="${name}"]:not([class~="icon-hide"])`);
  } else {
    matchDiv = rowDiv.querySelector(`div[data-name="${name}"]:not([class~="icon-hide"])`);
  }

  if (matchDiv) {
    // eslint-disable-next-line no-void
    void matchDiv.offsetWidth; // Don't need this when removing... probably
    matchDiv.dataset.name = 'none';
    if (!matchDiv.classList.contains('icon-hide')) {
      matchDiv.classList.replace('icon-show', 'icon-hide');
    }
    // setTimeout(() => { matchDiv.remove(); }, 1000);
  }
};

// eslint-disable-next-line no-unused-vars
const debugText = ({ text }) => {
  document.getElementById('debug').innerText = text;
};

function showOverlay() {
  document.getElementById('nextdiv').classList.replace('next-hide', 'next-show');
}

function hideOverlay() {
  document.getElementById('nextdiv').classList.replace('next-show', 'next-hide');
}