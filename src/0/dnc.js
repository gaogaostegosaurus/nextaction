
onTargetChanged.DNC = () => {};


actionList.DNC = [

  // Non-GCD
  'Fan Dance', 'Fan Dance II', 'Fan Dance III', 'Devilment', 'Flourish',

  // GCD
  'Cascade', 'Fountain', 'Windmill', 'Bladeshower',
  'Reverse Cascade', 'Rising Windmill', 'Fountainfall', 'Bloodshower',
  'Saber Dance',

  'Emboite', 'Entrechat', 'Jete', 'Pirouette',

  'Standard Step', 'Standard Finish', 'Single Standard Finish',
  'Double Standard Finish',
  'Technical Step', 'Technical Finish', 'Single Technical Finish',
  'Double Technical Finish', 'Triple Technical Finish',
  'Quadruple Technical Finish',

  'Closed Position',
  'Improvisation',
];

player.statusList.DNC = [
  'Standard Step', 'Standard Finish', 'Flourishing Cascade', 'Flourishing Windmill',
  'Flourishing Fountain', 'Flourishing Shower', 'Closed Position', 'Dance Partner', 'Devilment',
  'Flourishing Fan Dance', 'Technical Step', 'Technical Finish', 'Improvisation',
];

castingList.DNC = [];

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


const dncNext = ({
  time = player.gcd,
} = {}) => {
  next.flourishingcascadeStatus = checkStatus({ name: 'Flourishing Cascade' });
  next.flourishingwindmillStatus = checkStatus({ name: 'Flourishing Windmill' });
  next.flourishingshowerStatus = checkStatus({ name: 'Flourishing Shower' });
  next.flourishingfountainStatus = checkStatus({ name: 'Flourishing Fountain' });
  next.flourishingfandanceStatus = checkStatus({ name: 'Flourishing Fan Dance' });
  next.devilmentRecast = checkRecast({ name: 'Devilment' });
  next.devilmentStatus = checkStatus({ name: 'Devilment' });
  next.standardstepRecast = checkRecast({ name: 'Standard Step' });
  next.standardstepStatus = checkStatus({ name: 'Standard Step' });
  next.standardfinishStatus = checkStatus({ name: 'Standard Finish' });
  next.technicalstepRecast = checkRecast({ name: 'Technical Step' });
  next.technicalstepStatus = checkStatus({ name: 'Technical Step' });
  next.technicalfinishStatus = checkStatus({ name: 'Technical Finish' });
  next.flourishRecast = checkRecast({ name: 'Flourish' });
  next.steps = player.steps;
  next.fourfoldFeathers = player.fourfoldFeathers;
  next.esprit = player.esprit;

  next.combat = toggle.combat;
  next.combo = toggle.combo;
  next.ogcd = toggle.ogcd;

  next.elapsedTime = time;

  const dncArray = [];

  do {
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
  } while (next.elapsedTime < 20000);

  iconArrayB = dncArray;
  syncIcons();
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
