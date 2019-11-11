const removeOldCountdowns = ({
  column,
} = {}) => {
  // Clear away old divs before adding more actions
  // Called at beginning of other action functions
  if (!previous.removeCountdown || Date.now() - previous.removeCountdown > 1000) {
    previous.removeCountdown = Date.now();
    document.getElementById(column).querySelectorAll('div[class~="countdown-hide"]').forEach((e) => e.remove());
  }
};


const addCountdown = ({
  name,
  img = name,
  time = checkRecast({ name }),
  countdownArray = countdownArrayA,
  order = 10,
  onComplete = 'showText',
  array = actionArray,
  text = 'READY',
} = {}) => {
  // For some reason the time is slightly off... might not be much to be done about it
  const countdownIntervalTime = 100;

  // Identify correct column
  let column = 'countdown-a';
  if (countdownArray === countdownArrayB) {
    column = 'countdown-b';
  } else if (countdownArray === countdownArrayC) {
    column = 'countdown-c';
  }

  removeOldCountdowns({ column });

  const matchIndex = countdownArray.findIndex((action) => action.name === name);
  if (matchIndex > -1) {
    countdownArray.splice(matchIndex, 1);
  }

  const matchDiv = document.getElementById(column).querySelector(`div[data-name="${name}"]`);
  if (matchDiv) {
    matchDiv.className = 'countdown countdown-hide';
    matchDiv.dataset.name = 'none';
  }

  const countdownDiv = document.createElement('div');
  const countdownImgDiv = document.createElement('div');
  const countdownBar = document.createElement('div');
  const countdownTime = document.createElement('div');
  const countdownImg = document.createElement('img');
  const countdownOverlay = document.createElement('img');

  // Place into array and sort
  countdownArray.push({ name, img, order });
  countdownArray.sort((a, b) => a.order - b.order);

  // Place into div with order
  countdownDiv.className = 'countdown countdown-hide';
  countdownDiv.dataset.name = name;
  countdownDiv.style.order = time;
  countdownImgDiv.className = 'smalliconimgdiv';
  countdownImg.className = 'smalliconimg';
  countdownImg.src = `img/icon/${icon[img]}.png`;
  countdownOverlay.className = 'smalliconoverlay';
  countdownOverlay.src = 'img/icon/overlay.png';
  countdownBar.className = 'countdownbar';
  countdownTime.className = 'countdowntime';
  document.getElementById(column).append(countdownDiv);
  countdownDiv.append(countdownImgDiv);
  countdownDiv.append(countdownBar);
  countdownDiv.append(countdownTime);
  countdownImgDiv.append(countdownImg);
  countdownImgDiv.append(countdownOverlay);
  void countdownDiv.offsetWidth;
  countdownDiv.className = 'countdown countdown-show';

  let displayTime = time;
  let actionAdded = 0; // Prevent from being added multiple times

  clearInterval(interval[name]);

  // Countdown animation function starts here
  interval[name] = setInterval(() => {
    // Div removal
    if (displayTime <= 0) {
      // Cleanup at 0
      if (onComplete.includes('removeCountdown')) {
        countdownDiv.className = 'countdown countdown-hide';
      }
      if (onComplete.includes('addAction') && actionAdded === 0) {
        // Show icons a little bit early
        addAction({ name, array, order });
        actionAdded = 1;
      }
      countdownBar.style.width = '0px';
      clearInterval(interval[name]);
    } else if (displayTime < 1000) {
      // Show icons a little bit early
      if (onComplete.includes('addAction') && actionAdded === 0) {
        addAction({ name, array, order });
        actionAdded = 1;
      }
    }

    // Div order
    if (displayTime <= 0) {
      countdownDiv.style.order = order;
    } else {
      countdownDiv.style.order = 100 + displayTime;
    }

    // Time display
    if (displayTime <= 0) {
      countdownTime.innerHTML = text;
    } else if (displayTime < 1000) {
      countdownTime.innerHTML = (displayTime / 1000).toFixed(1);
      countdownBar.style.width = `${Math.floor(displayTime / 100)}px`;
    } else {
      countdownTime.innerHTML = Math.ceil(displayTime / 1000);
      countdownBar.style.width = `${Math.min(Math.floor((displayTime - 1000) / 1000) + 10, 70)}px`;
    }

    // Color
    if (displayTime < 5000) {
      if (countdownBar.style.backgroundColor !== 'red') {
        countdownBar.style.backgroundColor = 'red';
      }
    } else if (displayTime < 10000) {
      if (countdownBar.style.backgroundColor !== 'orange') {
        countdownBar.style.backgroundColor = 'orange';
      }
    } else if (displayTime < 30000) {
      if (countdownBar.style.backgroundColor !== 'yellow') {
        countdownBar.style.backgroundColor = 'yellow';
      }
    } else {
      countdownBar.style.backgroundColor = 'white';
    }

    displayTime -= countdownIntervalTime;
  }, countdownIntervalTime);
};

const stopCountdown = ({
  name,
} = {}) => {
  clearInterval(interval[name]);
};

const removeCountdown = ({
  name,
  countdownArray = countdownArrayA,
} = {}) => {
  let column = 'countdown-a';
  if (countdownArray === countdownArrayB) {
    column = 'countdown-b';
  }
  const removeTarget = countdownArray.findIndex((action) => action.name === name);
  if (removeTarget > -1) {
    countdownArray.splice(removeTarget, 1);
    document.getElementById(column).children[removeTarget].className = 'countdown countdown-hide';
  }
  clearInterval(interval[name]);
};
