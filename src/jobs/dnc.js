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
  duration.closedposition = 99999000;
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

  icon.step = '066313';
};

nextActionOverlay.dncPlayerChange = (e) => {
  const { playerData } = nextActionOverlay;
  const debugJobArray = e.detail.debugJob.split(' ');

  playerData.steps = e.detail.jobDetail.steps;
  playerData.currentstep = e.detail.jobDetail.currentStep;
  playerData.fourfoldfeathers = e.detail.jobDetail.feathers;
  playerData.esprit = parseInt(debugJobArray[2], 16); // 0-100
  // Steps - 1 is Emboite, 2 is Entrechat, 3 is Jete, 4 is Pirouette
  // playerData.step1 = parseInt(debugJobArray[2], 16);
  // playerData.step2 = parseInt(debugJobArray[3], 16);
  // playerData.step3 = parseInt(debugJobArray[4], 16);
  // playerData.step4 = parseInt(debugJobArray[5], 16);
  // playerData.stepTotal = debugJobArray[6]; /* 0-4 */
};

nextActionOverlay.dncNextAction = ({
  delay = 0,
} = {}) => {
  const { checkRecast } = nextActionOverlay;
  const { checkStatus } = nextActionOverlay;

  const { duration } = nextActionOverlay;
  const { recast } = nextActionOverlay;

  let { comboStep } = nextActionOverlay;

  const { weaponskills } = nextActionOverlay.actionList;
  const { abilities } = nextActionOverlay.actionList;

  const { gcd } = nextActionOverlay.playerData;
  const { level } = nextActionOverlay.playerData;
  let { steps } = nextActionOverlay.playerData;
  let { fourfoldfeathers } = nextActionOverlay.playerData;
  let { esprit } = nextActionOverlay.playerData;

  const loopRecast = {};
  const loopRecastList = nextActionOverlay.actionList.abilities;
  loopRecastList.forEach((actionName) => {
    const propertyName = actionName.replace(/[\s':-]/g, '').toLowerCase();
    loopRecast[propertyName] = checkRecast({ actionName }) - 1000;
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

    if (steps !== 'None') {
      // console.log(steps);
      // Split steps into array
      const stepArray = steps.split(', ');

      // Add to icon array
      stepArray.forEach((step) => { iconArray.push({ name: step }); });

      // Add finish
      if (stepArray.length === 4) {
        iconArray.push({ name: 'Technical Finish' });
        loopStatus.technicalstep = -1;
        loopStatus.technicalfinish = duration.technicalfinish;
      } else {
        iconArray.push({ name: 'Standard Finish' });
        loopStatus.standardstep = -1;
        loopStatus.standardfinish = duration.standardfinish;
      }

      steps = 'None';

      // GCD
      gcdTime = 1500;
      loopTime = stepArray.length * 1000 + 1500;
    } else if (loopStatus.standardstep > 0) {
      // Split steps into array
      // iconArray.push({ name: 'Step' });
      // iconArray.push({ name: 'Step' });
      iconArray.push({ name: 'Standard Finish' });
      loopStatus.standardstep = -1;
      loopStatus.standardfinish = duration.standardfinish;
      gcdTime = 1500;
      loopTime = 2 * 1000 + 1500;
    } else if (loopStatus.technicalstep > 0) {
      // iconArray.push({ name: 'Step' });
      // iconArray.push({ name: 'Step' });
      // iconArray.push({ name: 'Step' });
      // iconArray.push({ name: 'Step' });
      iconArray.push({ name: 'Technical Finish' });
      loopStatus.technicalstep = -1;
      loopStatus.technicalfinish = duration.technicalfinish;
      gcdTime = 1500;
      loopTime = 4 * 1000 + 1500;
    } else if (gcdTime < 1500) {
      const nextGCD = nextActionOverlay.dncNextGCD({
        comboStep,
        esprit,
        loopRecast,
        loopStatus,
      });

      iconArray.push({ name: nextGCD });

      // Combo
      if ((level >= 2 && nextGCD === 'Cascade')
      || (level >= 25 && nextGCD === 'Windmill')) {
        comboStep = nextGCD;
        loopStatus.combo = duration.combo;
      } else if (['Fountain', 'Bladeshower'].includes(nextGCD)) {
        comboStep = '';
        loopStatus.combo = duration.combo;
      } // DNC kinda weird in that most things don't interrupt?

      // Add recasts and status durations
      const propertyName = nextGCD.replace(/[\s':-]/g, '').toLowerCase();
      if (recast[propertyName]) { loopRecast[propertyName] = recast[propertyName]; }
      if (duration[propertyName]) { loopStatus[propertyName] = duration[propertyName]; }

      if (nextGCD === 'Reverse Cascade') {
        loopStatus.flourishingcascade = -1;
      } else if (nextGCD === 'Fountainfall') {
        loopStatus.flourishingfountain = -1;
      } else if (nextGCD === 'Rising Windmill') {
        loopStatus.flourishingwindmill = -1;
      } else if (nextGCD === 'Bloodshower') {
        loopStatus.flourishingshower = -1;
      } else if (nextGCD === 'Saber Dance') {
        esprit -= 50;
      }

      // GCD
      if (weaponskills.includes(nextGCD)) {
        gcdTime = gcd;
        loopTime = gcdTime;
      } else if (['Standard Step', 'Technical Step'].includes(nextGCD)) {
        gcdTime = 0;
        loopTime = 1500;
      } else if (abilities.includes(nextGCD)) {
        gcdTime = 1500;
        loopTime = gcdTime;
      }
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
      const nextOGCD = nextActionOverlay.dncNextOGCD({
        fourfoldfeathers,
        loopRecast,
        loopStatus,
      });
      if (nextOGCD) {
        iconArray.push({ name: nextOGCD, size: 'small' });

        const propertyName = nextOGCD.replace(/[\s':-]/g, '').toLowerCase();
        if (recast[propertyName]) { loopRecast[propertyName] = recast[propertyName]; }
        if (duration[propertyName]) { loopStatus[propertyName] = duration[propertyName]; }

        if (nextOGCD === 'Flourish') {
          loopStatus.flourishingcascade = duration.flourishingcascade;
          loopStatus.flourishingfountain = duration.flourishingfountain;
          loopStatus.flourishingwindmill = duration.flourishingwindmill;
          loopStatus.flourishingshower = duration.flourishingshower;
          loopStatus.flourishingfandance = duration.flourishingfandance;
        } else if (nextOGCD === 'Fan Dance' || nextOGCD === 'Fan Dance II') {
          fourfoldfeathers -= 1;
        } else if (nextOGCD === 'Fan Dance III') {
          loopStatus.flourishingfandance = -1;
        }
      }

      weave += 1; // Increment anyway because some skills only "activate" on weave 2
    }
    gcdTime = 0;
    nextTime += loopTime;
  }

  nextActionOverlay.NEWsyncIcons({ iconArray });
};

nextActionOverlay.dncNextGCD = ({
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
    if (loopStatus.flourishingshower > 0 && loopStatus.flourishingshower < procFloor && targetCount > 1) { return 'Bloodshower'; }
    if (loopStatus.flourishingfountain > 0 && loopStatus.flourishingfountain < procFloor) { return 'Fountainfall'; }
    if (loopStatus.flourishingshower > 0 && loopStatus.flourishingshower < procFloor) { return 'Bloodshower'; }
    if (loopStatus.flourishingwindmill > 0 && loopStatus.flourishingwindmill < procFloor && targetCount > 1) { return 'Rising Windmill'; }
    if (loopStatus.flourishingcascade > 0 && loopStatus.flourishingcascade < procFloor) { return 'Reverse Cascade'; }
    if (loopStatus.flourishingwindmill > 0 && loopStatus.flourishingwindmill < procFloor) { return 'Rising Windmill'; }
  }

  // Slightly different priorities based on Technical Finish
  if (loopStatus.technicalfinish > 0) { // Implies 70+
    if (level >= 76 && esprit >= 80) { return 'Saber Dance'; }
    if (loopRecast.standardstep < 0 && Math.min(loopRecast.devilment, loopRecast.flourish) > 0) {
      // Standard Step after both of these are used (with other GCDs)
      return 'Standard Step';
    }
    if (level >= 76 && esprit >= 50) { return 'Saber Dance'; }
  } else {
    if (level >= 15 && loopRecast.standardstep < 0) { return 'Standard Step'; }
    if (level >= 70 && loopRecast.technicalstep < 0) { return 'Technical Step'; }
    if (level >= 76 && esprit >= 90) { return 'Saber Dance'; }
  }

  // Clear proc for combo
  if (loopStatus.flourishingshower > 0 && targetCount > 1 && comboStep === 'Windmill') { return 'Bloodshower'; }
  if (loopStatus.flourishingfountain > 0 && comboStep === 'Cascade') { return 'Fountainfall'; }
  if (loopStatus.flourishingshower > 0 && comboStep === 'Windmill') { return 'Bloodshower'; }

  // Don't drop combo
  if (loopStatus.combo < gcd * 2) {
    if (level >= 45 && targetCount > 1 && comboStep === 'Windmill') { return 'Bladeshower'; }
    if (level >= 2 && comboStep === 'Cascade') { return 'Fountain'; }
    if (level >= 45 && comboStep === 'Windmill') { return 'Bladeshower'; }
  }

  // Use procs (AOE)
  if (targetCount > 1) {
    if (loopStatus.flourishingshower > 0) { return 'Bloodshower'; }
    if (loopStatus.flourishingwindmill > 0) { return 'Rising Windmill'; }
  }

  // Use procs
  if (loopStatus.flourishingfountain > 0) { return 'Fountainfall'; }
  if (loopStatus.flourishingshower > 0) { return 'Bloodshower'; }
  if (loopStatus.flourishingcascade > 0) { return 'Reverse Cascade'; }
  if (loopStatus.flourishingwindmill > 0) { return 'Rising Windmill'; }

  // Continue combo
  if (level >= 45 && targetCount > 1 && comboStep === 'Windmill') { return 'Bladeshower'; }
  if (level >= 2 && comboStep === 'Cascade') { return 'Fountain'; }
  if (level >= 45 && comboStep === 'Windmill') { return 'Bladeshower'; }

  // Start combo
  if (level >= 15 && targetCount > 1) { return 'Windmill'; }
  return 'Cascade';
};

nextActionOverlay.dncNextOGCD = ({
  fourfoldfeathers,
  loopRecast,
  loopStatus,
} = {}) => {
  const { level } = nextActionOverlay.playerData;
  const { gcd } = nextActionOverlay.playerData;
  const { targetCount } = nextActionOverlay;

  let procCount = 0;
  if (loopStatus.flourishingcascade > 0) { procCount += 1; }
  if (loopStatus.flourishingfountain > 0) { procCount += 1; }
  if (loopStatus.flourishingwindmill > 0) { procCount += 1; }
  if (loopStatus.flourishingshower > 0) { procCount += 1; }

  // I mean, I guess
  if (level >= 60 && loopStatus.closedposition < 0) { return 'Closed Position'; }

  // Technical Finish
  if (loopStatus.technicalfinish > 0) {
    if (loopRecast.devilment < 0) { return 'Devilment'; }
    if (loopStatus.flourishingfandance > 0) { return 'Fan Dance III'; }
    if (fourfoldfeathers > 0) {
      if (level >= 50 && targetCount > 1) { return 'Fan Dance II'; }
      return 'Fan Dance';
    }
  }

  // Flourish only if no procs
  if (level >= 72 && procCount === 0 && loopStatus.flourishingfandance < 0
  && loopRecast.flourish < 0) {
    return 'Flourish';
  }

  // Stuff I guess
  if (level >= 62 && level < 70 && loopRecast.devilment < 0) { return 'Devilment'; }
  if (fourfoldfeathers >= 4 || (procCount > 0 && loopRecast.flourish < gcd)) {
    if (level >= 50 && targetCount > 1) { return 'Fan Dance II'; }
    return 'Fan Dance';
  }

  return ''; // No OGCD
};

nextActionOverlay.dncActionMatch = (actionMatch) => {
  const { removeStatus } = nextActionOverlay;

  const { weaponskills } = nextActionOverlay.actionList;
  const { abilities } = nextActionOverlay.actionList;
  const { playerData } = nextActionOverlay;
  const { level } = playerData;
  const { gcd } = playerData;

  const { addRecast } = nextActionOverlay;
  const { duration } = nextActionOverlay;
  const { recast } = nextActionOverlay;

  // const { checkRecast } = nextActionOverlay;
  // const { checkStatus } = nextActionOverlay;
  const { addStatus } = nextActionOverlay;

  const singletargetActions = [
    'Cascade', 'Fountain', 'Reverse Cascade', 'Fountainfall',
    'Fan Dance',
  ];

  const multitargetActions = [
    'Windmill', 'Bladeshower', 'Rising Windmill', 'Bloodshower', 'Saber Dance',
    'Fan Dance II', 'Fan Dance III',
    'Standard Finish', 'Technical Finish',
  ];

  const { actionName } = actionMatch.groups;

  if (singletargetActions.includes(actionName)) {
    nextActionOverlay.targetCount = 1;
  } else if (multitargetActions.includes(actionName) && actionMatch.groups.logType === '15') {
    // Multi target only hits single target
    nextActionOverlay.targetCount = 1;
  }

  if (weaponskills.includes(actionName)) {
    nextActionOverlay.NEWremoveIcon({ name: actionName });

    // Set combo status/step
    if ((level >= 2 && actionName === 'Cascade')
    || (level >= 40 && actionName === 'Windmill')) {
      addStatus({ statusName: 'Combo' });
      nextActionOverlay.comboStep = actionName;
    } else if (['Fountain', 'Bladeshower'].includes(actionName)) {
      removeStatus({ statusName: 'Combo' });
      nextActionOverlay.comboStep = '';
    }

    if (actionName === 'Reverse Cascade') {
      removeStatus({ statusName: 'Flourishing Cascade' });
    } else if (actionName === 'Fountainfall') {
      removeStatus({ statusName: 'Flourishing Fountain' });
    } else if (actionName === 'Rising Windmill') {
      removeStatus({ statusName: 'Flourishing Windmill' });
    } else if (actionName === 'Bloodshower') {
      removeStatus({ statusName: 'Flourishing Shower' });
    }

    nextActionOverlay.dncNextAction({ delay: gcd });
  } else if (abilities.includes(actionName)) {
    nextActionOverlay.NEWremoveIcon({ name: actionName });

    const propertyName = actionName.replace(/[\s':-]/g, '').toLowerCase();
    if (recast[propertyName]) { addRecast({ actionName }); }
    if (duration[propertyName]) { addStatus({ statusName: actionName }); }

    if (actionName === 'Closed Position') {
      addStatus({ statusName: 'Closed Position' });
    } else if (actionName === 'Flourish') {
      addStatus({ statusName: 'Flourishing Cascade' });
      addStatus({ statusName: 'Flourishing Fountain' });
      addStatus({ statusName: 'Flourishing Windmill' });
      addStatus({ statusName: 'Flourishing Shower' });
      addStatus({ statusName: 'Flourishing Fan Dance' });
    } else if (actionName === 'Fan Dance III') {
      removeStatus({ statusName: 'Flourishing Fan Dance' }); // Set Displacement cooldown with Engagement
    }

    // Since the actions are called Double whatever and such and such
    if (actionName.endsWith('Standard Finish')) {
      removeStatus({ statusName: 'Standard Step' });
      addStatus({ statusName: 'Standard Finish' });
    } else if (actionName.endsWith('Technical Finish')) {
      removeStatus({ statusName: 'Technical Step' });
      addStatus({ statusName: 'Technical Finish' });
    }

    if (['Standard Step', 'Technical Step'].includes(actionName) || actionName.endsWith('Finish')) {
      nextActionOverlay.dncNextAction({ delay: 1500 });
    }
  }
};

nextActionOverlay.dncStatusMatch = (statusMatch) => {
  const { statusName } = statusMatch.groups;
  const { statusDuration } = statusMatch.groups;
  const { gcd } = nextActionOverlay.playerData;
  const procStatus = ['Flourishing Cascade', 'Flourishing Windmill', 'Flourishing Fountain', 'Flourishing Shower'];
  // Control Dualcast/Swiftcast flow from here because it's a lot easier
  if (statusMatch.groups.logType === '1A') {
    nextActionOverlay.addStatus({ statusName, duration: parseFloat(statusDuration) * 1000 });

    if (procStatus.includes(statusName)) {
      nextActionOverlay.dncNextAction();
    }
    // Acceleration 'gains' a new line every time a stack is used
  } else {
    nextActionOverlay.removeStatus({ statusName });

    if (['Dualcast', 'Swiftcast'].includes(statusMatch.groups.statusName)) {
      nextActionOverlay.NEWremoveIcon({ name: 'Dualcast', match: 'contains' });
      nextActionOverlay.rdmNextAction({ delay: gcd });
    } else if (statusName === 'Acceleration') {
      nextActionOverlay.accelerationCount = 0;
    }
  }
};
