const addAction = ({
  name,
  img = icon[name],
  array = actionArray,
  order = 'last',
} = {}) => {
  let row = 'action-row';
  if (array === priorityArray) {
    row = 'priority-row';
  } else if (array === cooldownArray) {
    row = 'cooldown-row';
  }

  const iconDiv = document.createElement('div');
  const iconImg = document.createElement('img');
  const iconOverlay = document.createElement('img');
  if (order === 'last') {
    document.getElementById(row).prepend(iconDiv);
  } else {
    document.getElementById(row).append(iconDiv);
  }
  iconDiv.append(iconImg);
  iconDiv.append(iconOverlay);
  void iconDiv.offsetWidth;
  iconDiv.className = 'icondiv icon-add';
  iconImg.className = 'new-iconimg';
  iconImg.src = `/img/icon/${img}.png`;
  iconOverlay.className = 'new-iconoverlay';
  iconOverlay.src = '/img/icon/overlay.png';
};

const fadeAction = ({
  name,
  array = actionArray,
} = {}) => {
  let row = 'action-row';
  if (array === priorityArray) {
    row = 'priority-row';
  } else if (array === cooldownArray) {
    row = 'cooldown-row';
  }

  const fadeTarget = array.findIndex((action) => action.name === name);
  if (fadeTarget > -1) {
    document.getElementById(row).children[fadeTarget].style.opacity = '0.5';
  }
};

const removeAction = ({
  name,
  array = actionArray,
} = {}) => {
  let row = 'action-row';
  if (array === priorityArray) {
    row = 'priority-row';
  } else if (array === cooldownArray) {
    row = 'cooldown-row';
  }

  const removeTarget = array.findIndex((action) => action.name === name);
  if (removeTarget > -1) {
    array.splice(removeTarget, 1);
    document.getElementById(row).children[removeTarget].className = 'icondiv icon-remove';
  }
};

const syncArray = ({
  array = actionArray,
} = {}) => {
  const row = 'action-row';

  // Check existing divs
  for (let i = 0; i < document.getElementById(row).children.length; i += 1) {
    const imgSrc = document.getElementById(row).children[i].children[0].src;

    // If array index doesn't exist or icon doesn't match, remove it and any following icons
    if (!array[i] || imgSrc !== `/img/icon/${icon[array[i].name]}png`) {
      for (let j = i; j < document.getElementById(row).children.length; j += 1) {
        // document.getElementById(row).children[j].remove();
        document.getElementById(row).children[j].className = 'icondiv icon-remove';
      }
      break;
    }
  }

  // Create any needed divs
  for (let i = 0; i < array.length; i += 1) {
    if (!document.getElementById(row).children[i]) {
      const iconDiv = document.createElement('div');
      const iconImg = document.createElement('img');
      const iconOverlay = document.createElement('img');
      document.getElementById(row).appendChild(iconDiv);
      document.getElementById(row).children[i].appendChild(iconImg);
      document.getElementById(row).children[i].appendChild(iconOverlay);
    }
  }

  // Match actionArray with div elements
  for (let i = 0; i < array.length; i += 1) {
    const iconDiv = document.getElementById(row).children[i];
    const iconImg = iconDiv.children[0];
    const iconOverlay = iconDiv.children[1];
    void iconDiv.offsetWidth;
    iconDiv.className = 'icondiv icon-add';
    iconImg.className = 'new-iconimg';
    iconImg.src = `/img/icon/${icon[array[i].icon]}.png`;
    iconOverlay.className = 'new-iconoverlay';
    iconOverlay.src = 'icon/overlay.png';
  }
};
