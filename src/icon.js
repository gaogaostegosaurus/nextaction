
const icon = {};

const getArrayRow = ({
  iconArray,
} = {}) => {
  // Associate array with row
  let rowID = 'icon-b';
  if (iconArray === iconArrayA) {
    rowID = 'icon-a';
  } else if (iconArray === iconArrayC) {
    rowID = 'icon-c';
  }
  return rowID;
};

const syncIcons = ({
  iconArray = iconArrayB,
} = {}) => {
  if (!player.job) {
    // console.log('Not ready');
    return;
  }

  if (!player.job || Date.now() - previous.syncIcons < 100) {
    console.log(`${player.job} ${previous.syncIcons}`);
    return;
  }

  previous.syncIcons = Date.now();

  const rowID = getArrayRow({ iconArray });
  const rowDiv = document.getElementById(rowID);

  // Find current row length
  const rowLength = rowDiv.children.length;
  const iconArrayLength = iconArray.length;

  let arrayIndex = 0;

  for (let i = 0; i < rowLength; i += 1) {
    const iconDiv = rowDiv.children[i];
    if (iconArray[arrayIndex] && iconArray[arrayIndex].name === iconDiv.dataset.name) {
      arrayIndex += 1;
    } else {
      void iconDiv.offsetWidth;
      iconDiv.dataset.name = 'none';
      iconDiv.classList.replace('icon-show', 'icon-hide');
      iconDiv.addEventListener('transitionend', (event) => {
        if (event.propertyName === 'height') { // Height is transitioned last
          iconDiv.remove();
        }
      });
      // iconDiv.addEventListener('transitioncancel', (event) => {
      //   console.log('event.propertyName');
      //     const thing = iconDiv;
      //     thing.remove();
      //
      // });
    }
  } // Should have only matching icons remaining now


  if (arrayIndex < iconArrayLength) {
    for (let i = arrayIndex; i < iconArrayLength; i += 1) {
      const iconDiv = document.createElement('div');
      const iconImg = document.createElement('img');
      const iconOverlay = document.createElement('img');
      rowDiv.append(iconDiv);
      iconDiv.append(iconImg);
      iconDiv.append(iconOverlay);
      iconDiv.className = 'icon icon-hide';
      iconImg.className = 'iconimg';
      iconOverlay.className = 'iconoverlay';
      iconDiv.dataset.name = iconArray[i].name;
      if (iconArray[i].img) {
        iconImg.src = `img/icon/${icon[iconArray[i].img]}.png`;
      } else {
        iconImg.src = `img/icon/${icon[iconArray[i].name.replace(/[\s'-:]/g, '').toLowerCase()]}.png`;
      }
      iconOverlay.src = 'img/icon/overlay.png';
      void iconDiv.offsetWidth;
      iconDiv.classList.replace('icon-hide', 'icon-show');
      if (iconArray[i].size === 'small') {
        iconDiv.classList.add('icon-small');
      }
    }
  }
};


const addIcon = ({
  name,
  img = name.replace(/[\s'-:]/g, '').toLowerCase(),
  iconArray = iconArrayB,
  size = 'normal',
  order = 10,
} = {}) => {
  // Adds action to specified array and row

  const rowID = getArrayRow({ iconArray });
  const rowDiv = document.getElementById(rowID);
  // console.log(name + rowID);

  // removeOldIcons({ rowID });

  // Create elements
  const iconDiv = document.createElement('div');
  const iconImg = document.createElement('img');
  const iconOverlay = document.createElement('img');

  // Add elements to page
  iconDiv.className = 'icon icon-hide';
  iconDiv.style.order = order;
  iconImg.className = 'iconimg';
  iconOverlay.className = 'iconoverlay';
  iconDiv.dataset.name = name;
  iconImg.src = `img/icon/${icon[img]}.png`;
  iconOverlay.src = 'img/icon/overlay.png';
  rowDiv.append(iconDiv);
  iconDiv.append(iconImg);
  iconDiv.append(iconOverlay);
  void iconDiv.offsetWidth; // Reflow to make transition work
  iconDiv.classList.replace('icon-hide', 'icon-show');
  if (size === 'small') {
    iconDiv.classList.add('icon-small');
  }

  // Add to array
  iconArray.push({
    name, img, size, order,
  });
  iconArray.sort((a, b) => a.order - b.order);
};


const fadeIcon = ({
  name,
  // size = 'normal',
  iconArray = iconArrayB,
  match = 'exact',
} = {}) => {
  // Sets an action to lower opacity, for casting or whatever

  const rowID = getArrayRow({ iconArray });
  const rowDiv = document.getElementById(rowID);

  // removeOldIcons({ rowID });

  let matchDiv;
  if (match === 'contains') {
    matchDiv = rowDiv.querySelector(`div[data-name~="${name}"]:not([class~="icon-hide"])`);
  } else {
    matchDiv = rowDiv.querySelector(`div[data-name="${name}"]:not([class~="icon-hide"])`);
  }

  if (matchDiv) {
    void matchDiv.offsetWidth;
    matchDiv.classList.add('icon-fade');
  }
};


const unfadeIcon = ({
  name,
  iconArray = iconArrayB,
  match = 'exact',
} = {}) => {
  // Undos fadeAction effect

  const rowID = getArrayRow({ iconArray });
  const rowDiv = document.getElementById(rowID);

  // removeOldIcons({ rowID });

  let matchDiv;
  if (match === 'contains') {
    matchDiv = rowDiv.querySelector(`div[data-name~="${name}"]:not([class~="icon-hide"])`);
  } else {
    matchDiv = rowDiv.querySelector(`div[data-name="${name}"]:not([class~="icon-hide"])`);
  }

  if (matchDiv) {
    void matchDiv.offsetWidth;
    matchDiv.classList.remove('icon-fade');
  }
};


const removeIcon = ({
  name,
  // property = name.replace(/[\s'-:]/g, '').toLowerCase(),
  iconArray = iconArrayB,
  match = 'exact',
} = {}) => {
  const removeDelay = 100;

  // Prevents this from being called multiple times by AoEs
  if (!previous.removeIcon || Date.now() - previous.removeIcon > removeDelay) {
    previous.removeIcon = Date.now();
    const rowID = getArrayRow({ iconArray });
    const rowDiv = document.getElementById(rowID);

    let matchDiv;
    if (match === 'contains') {
      matchDiv = rowDiv.querySelector(`div[data-name~="${name}"]:not([class~="icon-hide"])`);
    } else {
      matchDiv = rowDiv.querySelector(`div[data-name="${name}"]:not([class~="icon-hide"])`);
    }

    if (matchDiv) {
      // void matchDiv.offsetWidth; // Don't need this when removing... probably
      matchDiv.dataset.name = 'none';
      if (!matchDiv.classList.contains('icon-hide')) {
        matchDiv.classList.replace('icon-show', 'icon-hide');
      }
      matchDiv.addEventListener('transitionend', () => {
        if (matchDiv.propertyName === 'height' || matchDiv.propertyName === 'width') {
          matchDiv.remove();
        }
      });
    }

    const matchIndex = iconArray.findIndex((entry) => entry.name === name);
    if (matchIndex > -1) {
      iconArray.splice(matchIndex, 1);
    }
  }
};

// const removeIconContaining = ({
//   name,
//   array = iconArrayB,
// } = {}) => {
//   const row = getArrayRow({ array });
//   const rowDiv = document.getElementById(row);
//
//   removeOldIcons({ row });
//
//   const matchDiv = rowDiv.querySelector(`div[data-name~="${name}"]`);
//   if (matchDiv) {
//     matchDiv.className += ' icon-hide';
//     const matchIndex = array.findIndex((entry) => entry.name === matchDiv.dataset.name);
//     if (matchIndex > -1) {
//       array.splice(matchIndex, 1);
//     }
//     matchDiv.dataset.name = 'none';
//   }
// };

// const removeToIcon = ({
//   name,
//   iconArray = iconArrayB,
// } = {}) => {
//   // Meh
//   // Removes all actions up to the first case of selected action from display
//   const rowID = getArrayRow({ iconArray });
//   const rowDiv = document.getElementById(rowID);
//   removeOldIcons({ rowID });
// };
