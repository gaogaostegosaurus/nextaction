
const addCountdown = ({
  name,
  img = icon[name],
  countdownArray = countdownArrayA,
  time = checkRecast({ name }),
  order = 'last',
  onComplete = 'showText',
  array = actionArray,
  text = 'READY',
} = {}) => {
  // For some reason the time is slightly off... might not be much to be done about it

  // Identify correct column
  let column = 'countdown-a';
  if (countdownArray === countdownArrayB) {
    column = 'countdown-b';
  }

  const countdownIntervalTime = 100;

  let countdownDiv;
  let countdownImgDiv;
  let countdownImg;
  let countdownOverlay;
  let countdownTime;
  let countdownBar;

  // See if already exists somehow
  const findTarget = countdownArray.findIndex((action) => action.name === name);
  if (findTarget > -1) {
    // Already exists, so assign accordingly
    countdownDiv = document.getElementById(column).children[findTarget];
    countdownImgDiv = countdownDiv.children[0];
    countdownBar = countdownDiv.children[1];
    countdownTime = countdownDiv.children[2];
    countdownImg = countdownImgDiv.children[0];
    countdownOverlay = countdownImgDiv.children[1];
  } else {
    // Does not exist, so create
    countdownArray.push({ name, img });
    countdownDiv = document.createElement('div');
    countdownImgDiv = document.createElement('div');
    countdownBar = document.createElement('div');
    countdownTime = document.createElement('div');
    countdownImg = document.createElement('img');
    countdownOverlay = document.createElement('img');

    if (order === 'last') {
      document.getElementById(column).append(countdownDiv);
    } else {
      document.getElementById(column).prepend(countdownDiv);
    }
    countdownDiv.className = 'countdown countdown-hide';
    countdownImgDiv.className = 'smalliconimgdiv';
    countdownImg.className = 'smalliconimg';
    countdownImg.src = `img/icon/${img}.png`;
    countdownOverlay.className = 'smalliconoverlay';
    countdownOverlay.src = 'img/icon/overlay.png';
    countdownBar.className = 'countdownbar';
    countdownTime.className = 'countdowntime';
    countdownDiv.append(countdownImgDiv);
    countdownDiv.append(countdownBar);
    countdownDiv.append(countdownTime);
    countdownImgDiv.append(countdownImg);
    countdownImgDiv.append(countdownOverlay);
    void countdownDiv.offsetWidth;
    countdownDiv.className = 'countdown countdown-show';
  }
  // Divs ready


  // Add or remove icons
  if (text === 'addAction'
  && time <= 1000) {
    countdownDiv.className = 'countdown countdown-hide';
  }

  if (text === 'removeCountdown'
  && time <= 0) {
    countdownDiv.className = 'countdown countdown-hide';
  } else {
    countdownDiv.className = 'countdown countdown-show';
  }

  let displayTime = time;
  let actionAdded = 0; // Prevent from being added multiple times

  clearInterval(interval[name]);

  // Countdown animation function starts here
  interval[name] = setInterval(() => {
    // Show icons a little bit early
    if (displayTime < 1000 && actionAdded === 0) {
      if (onComplete === 'addAction') {
        addAction({ name, array, order });
        actionAdded = 1;
      }
    }

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

    // Countdown bar animation
    if (displayTime <= 0) {
      // Cleanup when time <= 0

      countdownBar.style.width = '0px'; // Time 0 = bar width 0
      clearInterval(interval[name]);

      if (onComplete !== 'showText') {
        countdownDiv.className = 'countdown countdown-hide';
      } else {
        countdownTime.innerHTML = text;
      }
    } else if (displayTime < 1000) {
      // Special animation when remaining time is low
      countdownTime.innerHTML = (displayTime / 1000).toFixed(1);
      countdownBar.style.width = `${Math.floor(displayTime / 100)}px`;
    } else {
      // This appears to best mathematically mimic the displayed values for XIV
      countdownTime.innerHTML = Math.ceil(displayTime / 1000);
      // Sets a max bar size
      countdownBar.style.width = `${Math.min(Math.floor((displayTime - 1000) / 1000) + 10, 70)}px`;
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
