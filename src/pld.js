'use strict';


toggle.combo = 0;

// Define actions to watch for

actionList.PLD = [

  // Non-GCD actions
  'Fight Or Flight', 'Spirits Within', 'Sheltron', 'Sentinel', 'Cover',
  'Divine Veil', 'Intervention', 'Requiescat', 'Passage Of Arms',
  'Intervene',
  'Circle Of Scorn',

  // GCD actions
  'Fast Blade', 'Riot Blade', 'Rage Of Halone', 'Goring Blade',
  'Royal Authority', 'Atonement', 'Holy Spirit',
  'Total Eclipse', 'Prominence', 'Holy Circle', 'Confiteor',
  // Total Eclipse => Prominence: 3 or more
  // Holy Circle: 2 or more

  // Role actions
  'Rampart', 'Arm\'s Length'

];

statusList.PLD = [
  'Goring Blade', 'Requiescat', 'Sword Oath',
];

castingList.PLD = [
  'Clemency', 'Holy Spirit', 'Holy Circle',
];

const pldAreaOfEffect = [
  'Total Eclipse', 'Prominence', 'Circle Of Scorn', 'Holy Circle', 'Confiteor',
];

const pldSingleTarget = [
  'Holy Spirit',
];

const pldWeaponskills = [
  'Fast Blade', 'Riot Blade', 'Rage Of Halone', 'Goring Blade',
  'Royal Authority', 'Atonement',
  'Total Eclipse', 'Prominence', 'Holy Spirit', 'Holy Circle', 'Confiteor',
];

const pldFinisherWeaponskills = [
  'Rage Of Halone', 'Goring Blade', 'Royal Authority', 'Prominence',
];

const pldColumnA = [
  'Fight Or Flight', 'Requiescat',
];

const pldColumnB = [
  'Rampart', 'Reprisal', 'Arm\'s Length', 'Sentinel', 'Hallowed Ground', 'Passage Of Arms',
];

const pldColumnC = [
  'Low Blow', 'Provoke', 'Interject', 'Shirk',
];

const pldNextTimeout = () => {
  clearTimeout(timeout.combo);
  timeout.combo = setTimeout(pldNext, 12500);
};

const pldNext = ({
  time = recast.gcd,
} = {}) => {
  const pldArray = [];

  next.MP = player.currentMP;
  next.requiescatRecast = checkRecast({ name: 'Requiescat' });
  next.requiescatStatus = checkStatus({ name: 'Requiescat' });
  next.fightorflightRecast = checkRecast({ name: 'Fight Or Flight' });
  next.fightorflightStatus = checkStatus({ name: 'Fight Or Flight' });
  next.goringbladeStatus = checkStatus({ name: 'Goring Blade', id: target.ID });
  next.swordoathStatus = checkStatus({ name: 'Sword Oath' });
  next.comboToggle = toggle.combo;
  next.swordoathCount = count.swordoath;

  next.elapsedTime = time;
  // console.log(next.comboToggle);

  do {
    if (next.fightorflightRecast - next.elapsedTime < 0
    && !next.comboToggle) {
      // Allows FoF to follow something while opening
      pldArray.push({ name: 'Fast Blade' });
      if (player.level >= 4) {
        next.comboToggle = 1;
      }
      next.elapsedTime += recast.gcd;
    } else if (next.fightorflightRecast - next.elapsedTime < 0
    && next.requiescatStatus - next.elapsedTime < 0) {
      pldArray.push({ name: 'Fight Or Flight', size: 'small' });
      next.fightorflightRecast = 60000 + next.elapsedTime;
      next.fightorflightStatus = 25000 + next.elapsedTime;
    } else if (player.level >= 68 && next.requiescatRecast - next.elapsedTime < 0
    && next.fightorflightStatus - next.elapsedTime < 0
    && next.comboToggle === 0 && next.swordoathCount === 0) {
      pldArray.push({ name: 'Requiescat', size: 'small' });
      next.requiescatRecast = 60000 + next.elapsedTime;
      next.requiescatStatus = 12000 + next.elapsedTime;
    } else if (next.requiescatStatus - next.elapsedTime > 0
    && next.MP + Math.floor(next.elapsedTime / 3000) * 200 >= 2000) {
      if (player.level >= 80
      && (next.MP + Math.floor(next.elapsedTime / 3000) * 200 < 4000
      || next.requiescatStatus - next.elapsedTime < 2500)) {
        pldArray.push({ name: 'Confiteor' });
      } else {
        pldArray.push({ name: 'Holy Spirit' });
      }
      next.MP -= 2000;
      next.elapsedTime += 2500;
    } else if (player.level >= 76 && next.swordoathCount > 0) {
      pldArray.push({ name: 'Atonement' });
      next.swordoathCount -= 1;
      next.MP += 400;
      next.elapsedTime += recast.gcd;
    } else if (player.level >= 54 && next.comboToggle === 2
    && next.goringbladeStatus - next.elapsedTime < 0) {
      pldArray.push({ name: 'Goring Blade' });
      next.goringbladeStatus = 21000 + next.elapsedTime;
      next.comboToggle = 0;
      next.elapsedTime += recast.gcd;
    } else if (player.level >= 60 && next.comboToggle === 2) {
      pldArray.push({ name: 'Royal Authority' });
      if (player.level >= 76) {
        next.swordoathCount = 3;
      }
      next.comboToggle = 0;
      next.elapsedTime += recast.gcd;
    } else if (player.level >= 26 && next.comboToggle === 2) {
      pldArray.push({ name: 'Rage Of Halone' });
      next.comboToggle = 0;
      next.elapsedTime += recast.gcd;
    } else if (player.level >= 4 && next.comboToggle === 1) {
      pldArray.push({ name: 'Riot Blade' });
      if (player.level >= 26) {
        next.comboToggle = 2;
      } else {
        next.comboToggle = 0;
      }
      next.MP += 1000;
      next.elapsedTime += recast.gcd;
    } else {
      pldArray.push({ name: 'Fast Blade' });
      next.elapsedTime += recast.gcd;
      if (player.level >= 4) {
        next.comboToggle = 1;
      }
    }
  } while (next.elapsedTime < 15000);
  iconArrayB = pldArray;
  syncIcons();
  pldNextTimeout();
};

onJobChange.PLD = () => {

  previous.totaleclipse = 0;
  previous.prominence = 0;
  previous.holycircle = 0;
  previous.confiteor = 0;
  previous.circleofscorn = 0;

  addCountdown({ name: 'Fight Or Flight', time: checkRecast({ name: 'Fight Or Flight' }) });

  if (player.level >= 68) {
    addCountdown({ name: 'Requiescat', time: checkRecast({ name: 'Requiescat' }) });
  }

  addCountdown({ name: 'Rampart', time: checkRecast({ name: 'Rampart' }), countdownArray: countdownArrayB });
  if (player.level >= 22) {
    addCountdown({ name: 'Reprisal', time: checkRecast({ name: 'Reprisal' }), countdownArray: countdownArrayB });
  }
  if (player.level >= 32) {
    addCountdown({ name: 'Arm\'s Length', time: checkRecast({ name: 'Arm\'s Length' }), countdownArray: countdownArrayB });
  }
  if (player.level >= 38) {
    addCountdown({ name: 'Sentinel', time: checkRecast({ name: 'Sentinel' }), countdownArray: countdownArrayB });
  }
  if (player.level >= 50) {
    addCountdown({ name: 'Hallowed Ground', time: checkRecast({ name: 'Hallowed Ground' }), countdownArray: countdownArrayB });
  }
  if (player.level >= 70) {
    addCountdown({ name: 'Passage Of Arms', time: checkRecast({ name: 'Passage Of Arms' }), countdownArray: countdownArrayB });
  }

  if (player.level >= 12) {
    addCountdown({ name: 'Low Blow', time: checkRecast({ name: 'Low Blow' }), countdownArray: countdownArrayC });
  }
  if (player.level >= 15) {
    addCountdown({ name: 'Provoke', time: checkRecast({ name: 'Provoke' }), countdownArray: countdownArrayC });
  }
  if (player.level >= 18) {
    addCountdown({ name: 'Interject', time: checkRecast({ name: 'Interject' }), countdownArray: countdownArrayC });
  }
  if (player.level >= 48) {
    addCountdown({ name: 'Shirk', time: checkRecast({ name: 'Shirk' }), countdownArray: countdownArrayC });
  }

  pldNext();
};

onTargetChanged.PLD = () => {};

onAction.PLD = (actionMatch) => {
  if (actionMatch.groups.logType === '16') {
    countTargets({ name: actionMatch.groups.actionName });
  } else if (pldSingleTarget.indexOf(actionMatch.groups.actionName) > -1) {
    count.targets = 1;
  }

  if (['Fight Or Flight', 'Requiescat'].indexOf(actionMatch.groups.actionName) > -1) {
    removeIcon({ name: actionMatch.groups.actionName });
    addStatus({ name: actionMatch.groups.actionName });
    addRecast({ name: actionMatch.groups.actionName });
    addCountdown({ name: actionMatch.groups.actionName });
  } else if (pldWeaponskills.indexOf(actionMatch.groups.actionName) > -1) {
    if (actionMatch.groups.actionName === 'Atonement') {
      count.swordoath -= 1;
      removeIcon({ name: actionMatch.groups.actionName });
    } else if (pldFinisherWeaponskills.indexOf(actionMatch.groups.actionName) > -1) {
      if (actionMatch.groups.actionName === 'Goring Blade' && actionMatch.groups.result.length >= 6) {
        addStatus({ name: 'Goring Blade', id: actionMatch.groups.targetID });
      } else if (player.level >= 76 && actionMatch.groups.actionName === 'Royal Authority' && actionMatch.groups.result.length >= 6) {
        count.swordoath = 3;
      }
      toggle.combo = 0;
      removeIcon({ name: actionMatch.groups.actionName });
    } else if (player.level >= 40 && actionMatch.groups.actionName === 'Total Eclipse' && actionMatch.groups.result.length >= 6) {
      toggle.combo = 11;
      removeIcon({ name: actionMatch.groups.actionName });
    } else if (player.level >= 26 && actionMatch.groups.actionName === 'Riot Blade' && actionMatch.groups.result.length >= 8) {
      toggle.combo = 2;
      removeIcon({ name: actionMatch.groups.actionName });
    } else if (player.level >= 4 && actionMatch.groups.actionName === 'Fast Blade' && actionMatch.groups.result.length >= 6) {
      toggle.combo = 1;
      removeIcon({ name: actionMatch.groups.actionName });
    } else {
      toggle.combo = 0;
    }
    pldNext();
  } else if (pldColumnB.indexOf(actionMatch.groups.actionName) > -1) {
    addStatus({ name: actionMatch.groups.actionName });
    addRecast({ name: actionMatch.groups.actionName });
    addCountdown({ name: actionMatch.groups.actionName, countdownArray: countdownArrayB });
  }
};

onCasting.PLD = () => {};

onCancel.PLD = () => {
  pldNext();
};

onStatus.PLD = () => {
  if (statusMatch.groups.logType === '1A') {
    //
  } else if (statusMatch.groups.statusName === 'Sword Oath') {
    count.swordoath = 0;
    pldNext();
  }
};
