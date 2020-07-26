nextActionOverlay.dncJobChange = () => {
  // const { level } = nextActionOverlay.playerData;

  nextActionOverlay.actionList.weaponskills = [
    'Cascade', 'Fountain', 'Windmill', 'Bladeshower',
    'Reverse Cascade', 'Rising Windmill', 'Fountainfall', 'Bloodshower',
    'Saber Dance',
  ];

  nextActionOverlay.actionList.abilities = [
    'Fan Dance', 'Fan Dance II', 'Fan Dance III', 'Devilment', 'Flourish',

    'Emboite', 'Entrechat', 'Jete', 'Pirouette',

    'Standard Step', 'Standard Finish',
    'Single Standard Finish', 'Double Standard Finish',

    'Technical Step', 'Technical Finish',
    'Single Technical Finish', 'Double Technical Finish',
    'Triple Technical Finish', 'Quadruple Technical Finish',

    'Closed Position',
    'Improvisation',
  ];

  nextActionOverlay.statusList.self = [
    'Standard Step', 'Standard Finish',
    'Flourishing Cascade', 'Flourishing Windmill', 'Flourishing Fountain', 'Flourishing Shower',
    'Closed Position', 'Dance Partner', 'Devilment',
    'Flourishing Fan Dance', 'Technical Step', 'Technical Finish', 'Improvisation',
  ];

  const { recast } = nextActionOverlay;

  recast.technicalstep = 120000;
  recast.standardstep = 30000;
  recast.flourish = 60000;
  recast.devilment = 120000;

  const { duration } = nextActionOverlay;

  duration.flourishingcascade = 20000;
  duration.flourishingfountain = duration.flourishingcascade;
  duration.flourishingwindmill = duration.flourishingcascade;
  duration.flourishingshower = duration.flourishingcascade;
  duration.standardstep = 15000;
  duration.standardfinish = 20000;
  duration.doublestandardfinish = duration.standardfinish;
  duration.technicalstep = 15000;
  duration.technicalfinish = 20000;
  duration.doubletechnicalfinish = duration.technicalfinish;
  duration.tripletechnicalfinish = duration.technicalfinish;
  duration.quadrupletechnicalfinish = duration.technicalfinish;
  duration.devilment = 20000;

  const { icon } = nextActionOverlay;

  icon.cascade = '003451';
  icon.fountain = '003452';
  icon.windmill = '003453';
  icon.standardstep = '003454';
  icon.emboite = '003455';
  icon.entrechat = '003456';
  icon.jete = '003457';
  icon.pirouette = '003458';
  icon.standardfinish = '003459';
  icon.reversecascade = '003460';
  icon.flourishingcascade = icon.reversecascade;
  icon.bladeshower = '003461';
  icon.fandance = '003462';
  icon.risingwindmill = '003463';
  icon.flourishingwindmill = icon.risingwindmill;
  icon.fountainfall = '003464';
  icon.flourishingfountain = icon.fountainfall;
  // icon.fountainfallsingletarget = icon.fountainfall;
  icon.bloodshower = '003465';
  icon.flourishingshower = icon.bloodshower;
  // icon.bloodshowersingletarget = icon.bloodshower;
  icon.fandanceii = '003466';
  icon.devilment = '003471';
  icon.fandanceiii = '003472';
  icon.flourishingfandance = icon.fandance3;
  icon.technicalstep = '003473';
  icon.technicalfinish = '003474';
  icon.flourish = '003475';
  icon.saberdance = '003476';
};

nextActionOverlay.dncPlayerChange = (e) => {
  const { playerData } = nextActionOverlay;
  const debugJobArray = e.detail.debugJob.split(' ');

  playerData.steps = e.detail.jobDetail.steps;
  playerData.currentstep = e.detail.jobDetail.currentStep;
  playerData.fourfoldfeathers = e.detail.jobDetail.feathers;
  playerData.esprit = parseInt(debugJobArray[1], 16); // 0-100

  // Steps - 1 is Emboite, 2 is Entrechat, 3 is Jete, 4 is Pirouette
  // playerData.step1 = parseInt(debugJobArray[2], 16);
  // playerData.step2 = parseInt(debugJobArray[3], 16);
  // playerData.step3 = parseInt(debugJobArray[4], 16);
  // playerData.step4 = parseInt(debugJobArray[5], 16);
  // playerData.stepTotal = debugJobArray[6]; /* 0-4 */
};

const dncSingleTarget = ['Cascade', 'Fountain', 'Reverse Cascade', 'Fountainfall', 'Fan Dance'];

const dncSteps = ['Standard Step', 'Technical Step'];
const dncStepActions = ['Emboite', 'Entrechat', 'Jete', 'Pirouette'];
const dncStandardFinishes = ['Standard Finish', 'Single Standard Finish', 'Double Standard Finish'];
const dncTechnicalFinishes = [
  'Technical Finish', 'Single Technical Finish', 'Double Technical Finish',
  'Triple Technical Finish', 'Quadruple Technical Finish',
];
const dncFanDances = ['Fan Dance', 'Fan Dance II', 'Fan Dance III'];
const dncCooldowns = ['Devilment', 'Flourish'];
const dncWeaponskills = [
  'Cascade', 'Fountain', 'Windmill', 'Bladeshower',
  'Reverse Cascade', 'Fountainfall', 'Rising Windmill', 'Bloodshower',
];

const dncFlourishingBuff = [
  'Flourishing Cascade', 'Flourishing Cascade', 'Flourishing Windmill', 'Flourishing Fountain',
  'Flourishing Shower', 'Flourishing Fan Dance',
];

nextActionOverlay.dncNextAction = ({
  delay = 0,
} = {}) => {
  const { checkRecast } = nextActionOverlay;
  const { checkStatus } = nextActionOverlay;

  const loopRecast = {};
  const loopRecastList = nextActionOverlay.actionList.abilities;
  loopRecastList.forEach((actionName) => {
    const propertyName = actionName.replace(/[\s':-]/g, '').toLowerCase();
    loopRecast[propertyName] = checkRecast({ actionName });
  });

  const loopStatus = {};
  const loopStatusList = nextActionOverlay.statusList.self.concat(['Combo']);
  loopStatusList.forEach((statusName) => {
    const propertyName = statusName.replace(/[\s':-]/g, '').toLowerCase();
    loopStatus[propertyName] = checkStatus({ statusName });
  });

  const iconArray = [];

  let gcdTime = delay;
  let nextTime = 0; // Amount of time looked ahead in loop
  const nextMaxTime = 15000;

  while (nextTime < nextMaxTime) {
    let loopTime = 0;

    if (steps) {
      // Split steps into array
      const stepArray = steps.split(', ');

      // Add to icon array
      stepArray.forEach((step) => {
        iconArray.push({ name: step });
      });

      // Add finish
      if (stepArray.length === 4) {
        iconArray.push({ name: 'Technical Finish' });
      } else {
        iconArray.push({ name: 'Standard Finish' });
      }

      // GCD
      gcdTime = 1500;
      loopTime = stepArray.length * 1000 + 1500;
    } else if (gcdTime <= 1000) {
      const nextGCD = nextActionOverlay.dncNextGCD({
        loopRecast,
        loopStatus,
      });

      iconArray.push({ name: nextGCD });
    }

    Object.keys(loopRecast).forEach((property) => { loopRecast[property] -= loopTime; });
    Object.keys(loopStatus).forEach((property) => { loopStatus[property] -= loopTime; });

    let weaveMax = 0;
    if (gcdTime > 2200) {
      weaveMax = 2;
    } else if (gcdTime > 1000) {
      weaveMax = 1;
    }

    let weave = 0;

    while (weave < weaveMax) { // Inside loop for OGCDs
      weave += 1; // Increment anyway because some skills only "activate" on weave 2
    }
    gcdTime = 0;
    nextTime += loopTime;
  }

  iconArrayB = dncArray;
  syncIcons();
};

nextActionOverlay.dncNextAction = ({
  comboStep,
  esprit,
  loopRecast,
  loopStatus,
} = {}) => {
  const { targetCount } = nextActionOverlay;
  const { gcd } = nextActionOverlay.playerData;
  const { level } = nextActionOverlay.playerData;
  
  let procCount = 0;
  if (loopStatus.flourishingcascade > 0) { procCount += 1; }
  if (loopStatus.flourishingfountain > 0) { procCount += 1; }
  if (loopStatus.flourishingwindmill > 0) { procCount += 1; }
  if (loopStatus.flourishingshower > 0) { procCount += 1; }

  // Define "omg use proc now" time
  let procFloor = gcd * (procCount + 1);
  if (loopRecast.technicalstep < 0) {
    procFloor = gcd + 1500 + 1000 * 4 + 1500;
  } else if (loopRecast.standardstep < 0) {
    procFloor = gcd + 1500 + 1000 * 2 + 1500;
  }

  // Use any procs that appear to be in danger of falling off
  if (procFloor > 0) {
    if (loopStatus.flourishingshower < procFloor && targetCount > 1) { return 'Bloodshower'; }
    if (loopStatus.flourishingfountain < procFloor) { return 'Fountainfall'; }
    if (loopStatus.flourishingshower < procFloor) { return 'Bloodshower'; }
    if (loopStatus.flourishingwindmill < procFloor && targetCount > 1) { return 'Rising Windmill'; }
    if (loopStatus.flourishingcascade < procFloor) { return 'Reverse Cascade'; }
    if (loopStatus.flourishingwindmill < procFloor) { return 'Rising Windmill'; }
  }

  if (loopStatus.technicalfinish > 0) { // Implies 70+
    if (level >= 76 && esprit >= 80) { return 'Sabre Dance'; }
    if (loopRecast.standardstep < 0) { return 'Standard Step'; }
    if (level >= 76 && esprit >= 50) { return 'Sabre Dance'; }
  } else {
    if (level >= 15 && loopRecast.standardstep < 0) { return 'Standard Step'; }
    if (level >= 70 && loopRecast.technicalstep < 0) { return 'Technical Step'; }
    if (level >= 76 && esprit >= 90) { return 'Sabre Dance'; }
  }

  // Clear proc for combo
  if (loopStatus.flourishingshower > 0 && targetCount > 1 && comboStep === 'Windmill') { return 'Bloodshower'; }
  if (loopStatus.flourishingfountain > 0 && comboStep === 'Cascade') { return 'Fountainfall'; }
  if (loopStatus.flourishingshower > 0 && comboStep === 'Windmill') { return 'Bloodshower'; }

  if (loopStatus.combo < gcd * 2) {
    if (level >= 1 && targetCount > 1 && comboStep === 'Windmill') { return 'Bladeshower'; }
  }

  
  return 'Cascade';

  if (level >= 15 && loopRecast.standardstep < 0) { return 'Standard Step'; }
  
  if (next.technicalstepStatus - next.elapsedTime > 0) {
    dncArray.push({ name: 'Technical Finish' });
    next.technicalstepStatus = -1;
    next.technicalfinishStatus = 20000 + next.elapsedTime;
    next.ogcd = 1;
    next.elapsedTime += 1500;
  } else if (next.standardstepStatus - next.elapsedTime > 0) {
    dncArray.push({ name: 'Standard Finish' });
    next.standardstepStatus = -1;
    next.standardfinishStatus = 60000 + next.elapsedTime;
    next.ogcd = 1;
    next.elapsedTime += 1500;
  } else if (player.level >= 15 && next.standardstepRecast - next.elapsedTime < 0
  && !next.combat) { /* Pre-pull stuff, maybe */
    dncArray.push({ name: 'Standard Step' });
    next.standardstepStatus = duration.standardstep + next.elapsedTime;
    next.standardstepRecast = 30000 + next.elapsedTime;
    next.combat = 1;
    next.elapsedTime += 1500;
  } else if (next.ogcd > 0 && player.level >= 70
  && next.technicalfinishStatus - next.elapsedTime > 0
  && next.devilmentRecast - next.elapsedTime < 0) {
    dncArray.push({ name: 'Devilment', size: 'small' });
    next.ogcd -= 1;
    next.devilmentRecast = recast.devilment + next.elapsedTime;
  } else if (next.ogcd > 0 && player.level >= 72 && next.flourishRecast - next.elapsedTime < 0
  && next.combo === 0 && Math.max(
    next.flourishingcascadeStatus, next.flourishingfountainStatus, next.flourishingwindmillStatus,
    next.flourishingshowerStatus, next.flourishingfandanceStatus,
  ) - next.elapsedTime < 0) {
    dncArray.push({ name: 'Flourish', size: 'small' });
    next.ogcd -= 1;
    next.flourishingcascadeStatus = 20000 + next.elapsedTime;
    next.flourishingfountainStatus = 20000 + next.elapsedTime;
    next.flourishingwindmillStatus = 20000 + next.elapsedTime;
    next.flourishingshowerStatus = 20000 + next.elapsedTime;
    next.flourishingfandanceStatus = 20000 + next.elapsedTime;
    next.flourishRecast = recast.flourish + next.elapsedTime;
  } else if (next.ogcd > 0 && player.level >= 62 && player.level < 70
  && next.devilmentRecast - next.elapsedTime < 0) {
    dncArray.push({ name: 'Devilment', size: 'small' });
    next.ogcd -= 1;
    next.devilmentRecast = recast.devilment + next.elapsedTime;
  } else if (next.ogcd > 0 && player.level >= 50 && count.targets >= 2
  && next.fourfoldFeathers > 0) {
    if (next.flourishingfandanceStatus - next.elapsedTime > 0) {
      dncArray.push({ name: 'Fan Dance III', size: 'small' });
      next.flourishingfandanceStatus = -1;
    } else {
      dncArray.push({ name: 'Fan Dance II', size: 'small' });
    }
    next.fourfoldFeathers -= 1;
    next.ogcd -= 1;
  } else if (next.ogcd > 0 && next.technicalfinishStatus - next.elapsedTime > 0
  && next.fourfoldFeathers > 0) {
    if (next.flourishingfandanceStatus - next.elapsedTime > 0) {
      dncArray.push({ name: 'Fan Dance III', size: 'small' });
      next.flourishingfandanceStatus = -1;
    } else {
      dncArray.push({ name: 'Fan Dance', size: 'small' });
    }
    next.fourfoldFeathers -= 1;
    next.ogcd -= 1;
  } else if (next.ogcd > 0 && next.fourfoldFeathers >= 4) {
    if (next.flourishingfandanceStatus - next.elapsedTime > 0) {
      dncArray.push({ name: 'Fan Dance III', size: 'small' });
      next.flourishingfandanceStatus = -1;
    } else {
      dncArray.push({ name: 'Fan Dance', size: 'small' });
    }
    next.fourfoldFeathers -= 1;
    next.ogcd -= 1;
  } else if (player.level >= 70 && next.technicalstepRecast - next.elapsedTime < 0) {
    dncArray.push({ name: 'Technical Step' });
    next.technicalstepStatus = 15000 + next.elapsedTime;
    next.technicalstepRecast = 120000 + next.elapsedTime;
    next.elapsedTime += 1500;
    next.elapsedTime += 1000 * 4;
  } else if (count.targets > 1 && player.level >= 15) {
    if (player.level >= 76 && next.esprit >= 50) {
      dncArray.push({ name: 'Saber Dance' });
      next.esprit -= 50;
      next.ogcd = 1;
      next.elapsedTime += player.gcd;
    } else if (count.targets <= 5 && player.level >= 15
    && next.standardstepRecast - next.elapsedTime < 0) {
      dncArray.push({ name: 'Standard Step' });
      next.standardstepStatus = duration.standardstep + next.elapsedTime;
      next.standardstepRecast = recast.standardstep + next.elapsedTime;
      next.elapsedTime += 1500;
      next.elapsedTime += 1000 * 2;
    } else if (player.level >= 15 && next.standardfinishStatus - next.elapsedTime < 2000
    && next.standardstepRecast - next.elapsedTime < 0) {
      dncArray.push({ name: 'Standard Step' });
      next.standardstepStatus = duration.standardstep + next.elapsedTime;
      next.standardstepRecast = recast.standardstep + next.elapsedTime;
      next.elapsedTime += 1500;
      next.elapsedTime += 1000 * 2;
    } else if (next.combo === 0 && next.flourishingshowerStatus - next.elapsedTime > 0) {
      dncArray.push({ name: 'Bloodshower' });
      next.flourishingshowerStatus = -1;
      next.ogcd = 1;
      next.elapsedTime += player.gcd;
    } else if (next.combo === 0 && next.flourishingwindmillStatus - next.elapsedTime > 0) {
      dncArray.push({ name: 'Rising Windmill' });
      next.flourishingwindmillStatus = -1;
      next.ogcd = 1;
      next.elapsedTime += player.gcd;
    } else if (count.targets === 2 && next.combo === 0
    && next.flourishingfountainStatus - next.elapsedTime > 0) {
      dncArray.push({ name: 'Fountainfall' });
      next.flourishingfountainStatus = -1;
      next.ogcd = 1;
      next.elapsedTime += player.gcd;
    } else if (count.targets === 2 && next.combo === 0
    && next.flourishingcascadeStatus - next.elapsedTime > 0) {
      dncArray.push({ name: 'Reverse Cascade' });
      next.flourishingcascadeStatus = -1;
      next.ogcd = 1;
      next.elapsedTime += player.gcd;
    } else if (player.level >= 25 && next.combo === 11) {
      dncArray.push({ name: 'Bladeshower' });
      next.combo = 0;
      next.ogcd = 1;
      next.elapsedTime += player.gcd;
    } else {
      dncArray.push({ name: 'Windmill' });
      next.combo = 11;
      next.ogcd = 1;
      next.elapsedTime += player.gcd;
    }
  } else if (next.combo === 0 && next.technicalfinishStatus - next.elapsedTime > 0) {
    if (next.combo === 0 && player.level >= 76 && next.esprit >= 80) {
      dncArray.push({ name: 'Saber Dance' });
      next.esprit -= 50;
      next.ogcd = 1;
      next.elapsedTime += player.gcd;
    } else if (player.level >= 15 && next.standardstepRecast - next.elapsedTime < 0
    && next.devilmentStatus - next.elapsedTime > 2000) {
      dncArray.push({ name: 'Standard Step' });
      next.standardstepStatus = 15000 + next.elapsedTime;
      next.standardstepRecast = 30000 + next.elapsedTime;
      next.elapsedTime += 1500;
      next.elapsedTime += 1000 * 2;
    } else if (next.combo === 0 && next.flourishingfountainStatus - next.elapsedTime > 0) {
      dncArray.push({ name: 'Fountainfall' });
      next.flourishingfountainStatus = -1;
      next.ogcd = 1;
      next.elapsedTime += player.gcd;
    } else if (next.combo === 0 && next.flourishingshowerStatus - next.elapsedTime > 0) {
      dncArray.push({ name: 'Bloodshower' });
      next.flourishingshowerStatus = -1;
      next.ogcd = 1;
      next.elapsedTime += player.gcd;
    } else if (next.combo === 0 && next.flourishingcascadeStatus - next.elapsedTime > 0) {
      dncArray.push({ name: 'Reverse Cascade' });
      next.flourishingcascadeStatus = -1;
      next.ogcd = 1;
      next.elapsedTime += player.gcd;
    } else if (next.combo === 0 && next.flourishingwindmillStatus - next.elapsedTime > 0) {
      dncArray.push({ name: 'Rising Windmill' });
      next.flourishingwindmillStatus = -1;
      next.ogcd = 1;
      next.elapsedTime += player.gcd;
    } else if (next.combo === 0 && player.level >= 76 && next.esprit >= 50) {
      dncArray.push({ name: 'Saber Dance' });
      next.esprit -= 50;
      next.ogcd = 1;
      next.elapsedTime += player.gcd;
    } else if (player.level >= 2 && next.combo === 1) {
      dncArray.push({ name: 'Fountain' });
      next.combo = 0;
      next.ogcd = 1;
      next.elapsedTime += player.gcd;
    } else {
      dncArray.push({ name: 'Cascade' });
      next.combo = 1;
      next.ogcd = 1;
      next.elapsedTime += player.gcd;
    }
  } else if (player.level >= 15 && next.standardstepRecast - next.elapsedTime < 0) {
    dncArray.push({ name: 'Standard Step' });
    next.standardstepStatus = 15000 + next.elapsedTime;
    next.standardstepRecast = 30000 + next.elapsedTime;
    next.elapsedTime += 1500;
    next.elapsedTime += 1000 * 2;
  } else if (player.level >= 76 && next.esprit >= 80) {
    dncArray.push({ name: 'Saber Dance' });
    next.esprit -= 50;
    next.ogcd = 1;
    next.elapsedTime += player.gcd;
  } else if (next.combo === 0 && next.flourishingfountainStatus - next.elapsedTime > 0) {
    dncArray.push({ name: 'Fountainfall' });
    next.flourishingfountainStatus = -1;
    next.ogcd = 1;
    next.elapsedTime += player.gcd;
  } else if (next.combo === 0 && next.flourishingshowerStatus - next.elapsedTime > 0) {
    dncArray.push({ name: 'Bloodshower' });
    next.flourishingshowerStatus = -1;
    next.ogcd = 1;
    next.elapsedTime += player.gcd;
  } else if (next.combo === 0 && next.flourishingcascadeStatus - next.elapsedTime > 0) {
    dncArray.push({ name: 'Reverse Cascade' });
    next.flourishingcascadeStatus = -1;
    next.ogcd = 1;
    next.elapsedTime += player.gcd;
  } else if (next.combo === 0 && next.flourishingwindmillStatus - next.elapsedTime > 0) {
    dncArray.push({ name: 'Rising Windmill' });
    next.flourishingwindmillStatus = -1;
    next.ogcd = 1;
    next.elapsedTime += player.gcd;
  } else if (player.level >= 2 && next.combo === 1) {
    dncArray.push({ name: 'Fountain' });
    next.combo = 0;
    next.ogcd = 1;
    next.elapsedTime += player.gcd;
  } else {
    dncArray.push({ name: 'Cascade' });
    next.combo = 1;
    next.ogcd = 1;
    next.elapsedTime += player.gcd;
  }
};

onJobChanged.DNC = () => {
  if (player.level >= 15) {
    addCountdown({ name: 'Standard Step' });
  }
  if (player.level >= 70) {
    addCountdown({ name: 'Technical Step' });
  }
  if (player.level >= 72) {
    addCountdown({ name: 'Flourish' });
  }
  if (player.level >= 62) {
    addCountdown({ name: 'Devilment' });
  }
  dncNext({ time: 0 });
};

onAction.DNC = (actionMatch) => {
  removeIcon({ name: actionMatch.groups.actionName });

  if (dncSingleTarget.includes(actionMatch.groups.actionName)) {
    count.targets = 1;
  }
  // console.log(count.targets);

  if (dncSteps.includes(actionMatch.groups.actionName)) {
    addRecast({ name: actionMatch.groups.actionName });
    addStatus({ name: actionMatch.groups.actionName });
    dncNext({ time: 1500 });
  } else if (dncStepActions.includes(actionMatch.groups.actionName)) {
    // dncNext({ time: 1000 });
  } else if (dncStandardFinishes.includes(actionMatch.groups.actionName)) {
    removeStatus({ name: 'Standard Step' });
    toggle.ogcd = 1;
    dncNext({ time: 1500 });
  } else if (dncTechnicalFinishes.includes(actionMatch.groups.actionName)) {
    removeStatus({ name: 'Technical Step' });
    toggle.ogcd = 1;
    dncNext({ time: 1500 });
  } else if (dncFanDances.includes(actionMatch.groups.actionName)) {
    toggle.ogcd -= 1;
    dncNext({ time: 1000 });
  } else if (dncCooldowns.includes(actionMatch.groups.actionName)) {
    addRecast({ name: actionMatch.groups.actionName });
    if (actionMatch.groups.actionName === 'Devilment') {
      addStatus({ name: 'Devilment' });
    } else if (actionMatch.groups.actionName === 'Flourish') {
      addStatus({ name: 'Flourishing Cascade' });
      addStatus({ name: 'Flourishing Fountain' });
      addStatus({ name: 'Flourishing Windmill' });
      addStatus({ name: 'Flourishing Shower' });
      addStatus({ name: 'Flourishing Fan Dance' });
    }
    toggle.ogcd -= 1;
    dncNext({ time: 1000 });
  } else if (dncWeaponskills.includes(actionMatch.groups.actionName)) {
    if (actionMatch.groups.actionName === 'Bloodshower') {
      removeStatus({ name: 'Flourishing Shower' });
    } else if (actionMatch.groups.actionName === 'Rising Windmill') {
      removeStatus({ name: 'Flourishing Windmill' });
    } else if (actionMatch.groups.actionName === 'Fountainfall') {
      removeStatus({ name: 'Flourishing Fountain' });
    } else if (actionMatch.groups.actionName === 'Reverse Cascade') {
      removeStatus({ name: 'Flourishing Cascade' });
    } else if (['Fountain', 'Bladeshower'].includes(actionMatch.groups.actionName)) {
      toggle.combo = 0;
    } else if (actionMatch.groups.actionName === 'Cascade') {
      toggle.combo = 1;
    } else if (actionMatch.groups.actionName === 'Windmill') {
      toggle.combo = 11;
    }
    toggle.ogcd = 1;
    dncNext();
  }
};

onStatus.DNC = (statusMatch) => {
  if (statusMatch.groups.gainsLoses === 'gains') {
    addStatus({ name: statusMatch.groups.statusName });
    if (dncFlourishingBuff.includes(statusMatch.groups.statusName)) {
      dncNext();
    }
  } else {
    removeStatus({ name: statusMatch.groups.statusName });
  }
};

const dncTimeoutNext = ({
  time,
} = {}) => {
  // Something
};
