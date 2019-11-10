const gcdCalculation = ({
  speed,
  time = 2500, // GCD in ms
} = {}) => {
  // From theoryjerks site:
  // Math.floor(Math.floor(100 * 100 *
  // (Math.floor(2500 * (1000 - Math.floor(130 * this.delta/levelMod))/1000)/1000))/100)/100;

  const base = 380;
  const delta = speed - base;
  const levelMod = 3300;

  // console.log(speed);

  return Math.floor(Math.floor(10000 * (Math.floor((time * (1000 - Math.floor(
    130 * (delta / levelMod)
  ))) / 1000) / 1000)) / 100) * 10;
};

const loadInitialState = () => {

  delete toggle.combo;

  if (player.job === 'BLM') {
    blmJobChange();
  } else if (player.job === 'BRD') {
    brdJobChange();
  } else if (player.job === 'DNC') {
    dncJobChange();
  } else if (player.job === 'DRK') {
    drkJobChange();
  } else if (player.job === 'GNB') {
    gnbJobChange();
  } else if (player.job === 'MCH') {
    mchJobChange();
  } else if (player.job === 'MNK') {
    mnkJobChange();
  } else if (player.job === 'NIN') {
    ninJobChange();
  } else if (player.job === 'PLD') {
    pldJobChange();
  } else if (player.job === 'RDM') {
    rdmOnJobChange();
  } else if (player.job === 'SAM') {
    samJobChange();
  } else if (player.job === 'SCH') {
    schJobChange();
  } else if (player.job === 'WAR') {
    warJobChange();
  } else if (player.job === 'WHM') {
    whmJobChange();
  }
};


const clearUI = () => {
  priorityArray = [];
  actionArray = [];
  cooldownArray = [];
  countdownArrayA = [];
  countdownArrayB = [];
  document.getElementById('priority-row').innerHTML = '';
  document.getElementById('action-row').innerHTML = '';
  document.getElementById('cooldown-row').innerHTML = '';
  document.getElementById('countdown-a').innerHTML = '';
  document.getElementById('countdown-b').innerHTML = '';
};


const countTargets = (action) => {
  const countTargetsDelay = 1000;
  if (Date.now() - previous[action] > countTargetsDelay) {
    previous[action] = Date.now();
    count.targets = 1;
  } else {
    count.targets += 1;
  }
};
