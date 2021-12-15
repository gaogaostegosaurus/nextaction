// Not used right now, keeping for possible use later
// eslint-disable-next-line no-unused-vars
// const getArrayRow = ({
//   iconArray = nextAction.iconArrayB,
// } = {}) => {
//   // Associate array with row
//   let rowID = 'icon-b';
//   if (iconArray === nextAction.iconArrayA) {
//     rowID = 'icon-a';
//   } else if (iconArray === nextAction.iconArrayB) {
//     rowID = 'icon-b';
//   } else if (iconArray === nextAction.iconArrayC) {
//     rowID = 'icon-c';
//   }
//   return rowID;
// };

/* global actionData overlayArray */

// Uses an array of objects to create a new set of icons
// If icons exist, it removes any icons that don't match first and then adds any necessary ones
// eslint-disable-next-line no-unused-vars
const syncOverlay = () => {
  // Get the div element
  const rowDiv = document.getElementById('actions');
  // console.log(`overlayArray: ${JSON.stringify(overlayArray)}`);

  // Find current div length
  const rowLength = rowDiv.children.length;

  // Check to see how many icons currently match the array, removing any that don't
  let overlayArrayIndex = 0;
  const actionMax = 10;
  for (let rowIndex = 0; rowIndex < rowLength; rowIndex += 1) {
    const iconDiv = rowDiv.children[rowIndex];
    if (overlayArray[overlayArrayIndex]
    && overlayArray[overlayArrayIndex].name === iconDiv.dataset.name) {
      // Go on to next array item if the div already contains the icon
      if (overlayArrayIndex >= actionMax - 1) { break; }
      overlayArrayIndex += 1;
    } else {
      // Remove icon if it doesn't match
      iconDiv.dataset.name = '';
      iconDiv.classList.replace('icon-show', 'icon-hide');
      setTimeout(() => { iconDiv.remove(); }, 1000);
    }
  }

  const stopIndex = overlayArrayIndex;

  // Add icons up to actionMax
  if (stopIndex < actionMax - 1) {
    for (overlayArrayIndex = stopIndex;
      overlayArrayIndex < overlayArray.length; overlayArrayIndex += 1) {
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
      const actionName = overlayArray[overlayArrayIndex].name;
      iconDiv.dataset.name = actionName;
      const actionDataIndex = actionData.findIndex((element) => element.name === actionName);
      const iconFile = `${actionData[actionDataIndex].icon}.png`;
      const iconFolderNumber = Math.floor(
        parseInt(iconFile, 10) / 1000,
      ) * 1000;
      const iconFolder = iconFolderNumber.toString().padStart(6, '0');
      iconImg.src = `img/icon/${iconFolder}/${iconFile}`;
      iconOverlay.src = 'img/icon/iconoverlay.png';

      // Add OGCD stuff
      if (overlayArray[overlayArrayIndex].ogcd === true) {
        iconDiv.classList.add('icon-small');
      }

      // eslint-disable-next-line no-void
      void iconDiv.offsetWidth; // Can't remember what this does, but probably do reflow smoothly

      iconDiv.classList.replace('icon-hide', 'icon-show');
      if (overlayArrayIndex >= actionMax - 1) { break; }
    }
  }
};

// eslint-disable-next-line no-unused-vars
const fadeIcon = ({ // Sets an action to lower opacity, for casting or whatever
  name,
} = {}) => {
  if (name === undefined) { return; }

  const rowDiv = document.getElementById('actions');
  const matchDiv = rowDiv.querySelector(`div[data-name="${name}"]:not([class~="icon-hide"])`);

  if (matchDiv) {
    // eslint-disable-next-line no-void
    void matchDiv.offsetWidth; // I can't remember why this was needed...
    matchDiv.classList.add('icon-fade');
  }
};

// eslint-disable-next-line no-unused-vars
const unfadeIcon = ({ // Undos fadeAction effect
  name,
} = {}) => {
  if (name === undefined) { return; }

  const rowDiv = document.getElementById('actions');
  const matchDiv = rowDiv.querySelector(`div[data-name="${name}"]:not([class~="icon-hide"])`);

  if (matchDiv) {
    // eslint-disable-next-line no-void
    void matchDiv.offsetWidth;
    matchDiv.classList.remove('icon-fade');
  }
};

// eslint-disable-next-line no-unused-vars
const removeIcon = ({
  name,
} = {}) => {
  if (name === undefined) { return; }

  const rowDiv = document.getElementById('actions');
  const matchDiv = rowDiv.querySelector(`div[data-name="${name}"]:not([class~="icon-hide"])`);

  if (matchDiv) {
    // eslint-disable-next-line no-void
    void matchDiv.offsetWidth; // Don't need this when removing...?
    matchDiv.dataset.name = 'none';
    if (!matchDiv.classList.contains('icon-hide')) {
      matchDiv.classList.replace('icon-show', 'icon-hide');
    }
  }
};

// eslint-disable-next-line no-unused-vars
const debugText = ({ text }) => {
  document.getElementById('debug').innerText = text;
};

// function showOverlay() {
//   document.getElementById('nextdiv').classList.replace('next-hide', 'next-show');
// }

// function hideOverlay() {
//   document.getElementById('nextdiv').classList.replace('next-show', 'next-hide');
// }
