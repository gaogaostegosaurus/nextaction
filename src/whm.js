'use strict';

actionList.WHM = [
  // oGCD actions
  'Fluid Aura', 'Presence Of Mind', 'Benediction', 'Asylum', 'Assize', 'Thin Air', 'Tetragrammaton',
  'Divine Benison', 'Plenary Indulgence', 'Temperance',

  // GCD actions
  'Cure', 'Cure II', 'Cure III',
  'Medica', 'Medica II',
  'Regen',
  'Raise',
  'Stone', 'Stone II', 'Stone III', 'Stone IV', 'Glare',
  'Holy',
  'Aero', 'Aero II', 'Dia',
  'Afflatus Solace', 'Afflatus Misery', 'Afflatus Rapture',

  // Role actions
  'Repose', 'Esuna', 'Swiftcast', 'Lucid Dreaming', 'Surecast', 'Rescue',
];

castingList.WHM = [
  'Cure', 'Cure II', 'Cure III',
  'Medica', 'Medica II',
  'Raise',
  'Stone', 'Stone II', 'Stone III', 'Stone IV', 'Glare',
  'Holy',
  // Role actions
  'Repose', 'Esuna',
];

statusList.WHM = [
  'Aero', 'Aero II', 'Dia',
  'Regen',
  'Divine Benison',
  'Freecure',
  'Thin Air',
  // Probably more can go here but whatever for now?
];

const whmCountdownA = [
  'Benediction', 'Asylum', 'Assize', 'Tetragrammaton', 'Divine Benison', 'Temperance',
];

const whmCountdownB = [
  'Presence Of Mind', 'Thin Air',
  'Plenary Indulgence', 'Lucid Dreaming',
];

const whmCountdownC = [
  'Swiftcast', 'Surecast',
];


const whmNext = ({
  time = recast.gcd,
  ogcd = 0,
} = {}) => {
  if (target.ID && target.ID.startsWith('4')) {
    next.aeroStatus = checkStatus({ name: player.aeroSpell, id: target.ID });
  } else {
    next.aeroStatus = checkStatus({ name: player.aeroSpell });
  }
  if (target.ID && target.ID.startsWith('1') && ['PLD', 'WAR', 'DRK', 'GNB'].indexOf(target.job) > -1) {
    next.regenStatus = checkStatus({ name: 'Regen', id: target.ID });
  } else {
    next.regenStatus = checkStatus({ name: 'Regen' });
  }
  next.thinairStatus = checkStatus({ name: 'Thin Air' });

  next.assizeRecast = checkRecast({ name: 'Assize' });
  next.divinebenisonRecast = checkRecast({ name: 'Divine Benison' });
  next.luciddreamingRecast = checkRecast({ name: 'Lucid Dreaming' });
  next.thinairRecast = checkRecast({ name: 'Thin Air' });
  next.asylumRecast = checkRecast({ name: 'Asylum' });
  next.temperanceRecast = checkRecast({ name: 'Temperance' });
  next.presenceofmindRecast = checkRecast({ name: 'Presence Of Mind' });

  next.combatToggle = toggle.combat;
  next.MP = player.currentMP;
  next.bloodLily = player.bloodLily;

  next.elapsedTime = time;
  next.ogcd = ogcd;

  const whmArray = [];

  do {
    if (!next.combatToggle) {
      whmArray.push({ name: player.stoneSpell });
      next.elapsedTime += recast.gcd;
      next.combatToggle = 1;
    } else if (player.level >= 56 && next.assizeRecast - next.elapsedTime < 0 && next.ogcd >= 1) {
      whmArray.push({ name: 'Assize', size: 'small' });
      next.assizeRecast = 45000 + next.elapsedTime;
      next.ogcd -= 1;
    } else if (player.level >= 66 && next.divinebenisonRecast - next.elapsedTime < 0
    && next.ogcd >= 1) {
      whmArray.push({ name: 'Divine Benison', size: 'small' });
      next.divinebenisonRecast = 30000 + next.elapsedTime;
      next.ogcd -= 1;
    } else if (player.level >= 80 && next.luciddreamingRecast - next.elapsedTime < 0
    && next.MP < 8000 && next.ogcd >= 1) {
      whmArray.push({ name: 'Lucid Dreaming', size: 'small' });
      next.luciddreamingRecast = 60000 + next.elapsedTime;
      next.ogcd -= 1;
    } else if (player.level >= 80 && next.thinairRecast - next.elapsedTime < 0
    && next.ogcd >= 1) {
      whmArray.push({ name: 'Thin Air', size: 'small' });
      next.thinairRecast = 120000 + next.elapsedTime;
      next.ogcd -= 1;
    } else if (player.level >= 80 && next.asylumRecast - next.elapsedTime < 0 && next.ogcd >= 1) {
      whmArray.push({ name: 'Asylum', size: 'small' });
      next.asylumRecast = 90000 + next.elapsedTime;
      next.ogcd -= 1;
    } else if (player.level >= 80 && next.temperanceRecast - next.elapsedTime < 0
    && next.ogcd >= 1) {
      whmArray.push({ name: 'Temperance', size: 'small' });
      next.temperanceRecast = 120000 + next.elapsedTime;
      next.ogcd -= 1;
    } else if (player.level >= 80 && next.presenceofmindRecast - next.elapsedTime < 0
    && next.ogcd >= 1) {
      whmArray.push({ name: 'Presence Of Mind', size: 'small' });
      next.presenceofmindRecast = 150000 + next.elapsedTime;
      next.ogcd -= 1;
    } else if (next.aeroStatus - next.elapsedTime < 0) {
      whmArray.push({ name: player.aeroSpell });
      if (next.thinairStatus - next.elapsedTime < 0) {
        next.MP -= 400;
      }
      next.aeroStatus = player.aeroDuration + next.elapsedTime;
      next.elapsedTime += recast.gcd;
      next.ogcd = 2;
    } else if (next.regenStatus - next.elapsedTime < 0) {
      whmArray.push({ name: 'Regen' });
      if (next.thinairStatus - next.elapsedTime < 0) {
        next.MP -= 500;
      }
      next.regenStatus = 18000 + next.elapsedTime;
      next.elapsedTime += recast.gcd;
      next.ogcd = 2;
    } else if (next.bloodLily >= 3) {
      whmArray.push({ name: 'Afflatus Misery' });
      next.bloodLily = 0;
      next.elapsedTime += recast.gcd;
      next.ogcd = 2;
    } else if (player.level >= 72 && count.targets >= 3) {
      whmArray.push({ name: 'Holy' });
      next.elapsedTime += recast.gcd;
      if (next.thinairStatus - next.elapsedTime < 0) {
        next.MP -= 400;
      }
    } else if (player.level >= 50 && count.targets >= 2) {
      whmArray.push({ name: 'Holy' });
      next.elapsedTime += recast.gcd;
      if (next.thinairStatus - next.elapsedTime < 0) {
        next.MP -= 400;
      }
    } else {
      whmArray.push({ name: player.stoneSpell });
      next.elapsedTime += recast.gcd;
      if (next.thinairStatus - next.elapsedTime < 0) {
        next.MP -= 400;
      }
    }
  } while (next.elapsedTime < 20000)

  iconArrayB = whmArray;
  syncIcons();
  // Anything?
};

onJobChange.WHM = () => {


  if (player.level >= 72) {
    player.stoneSpell = 'Glare';
  } else if (player.level >= 64) {
    player.aeroSpell = 'Stone IV';
  } else if (player.level >= 54) {
    player.aeroSpell = 'Stone III';
  } else if (player.level >= 18) {
    player.aeroSpell = 'Stone II';
  } else {
    player.aeroSpell = 'Stone';
  }

  if (player.level >= 72) {
    player.aeroSpell = 'Dia';
  } else if (player.level >= 46) {
    player.aeroSpell = 'Aero II';
  } else {
    player.aeroSpell = 'Aero';
  }

  if (player.level >= 72) {
    player.aeroDuration = 30000;
  } else {
    player.aeroDuration = 18000;
  }

  if (checkStatus({ name: 'Freecure' }) > 0 && !toggle.freecure) {
    addIcon({ name: 'Freecure' });
    toggle.freecure = 1;
  } else {
    removeIcon({ name: 'Freecure' });
    toggle.freecure = 0;
  }

  if (player.level >= 56) {
    addCountdown({ name: 'Assize', time: checkRecast({ name: 'Assize' }) });
  }
  if (player.level >= 66) {
    addCountdown({ name: 'Divine Benison', time: checkRecast({ name: 'Divine Benison' }) });
  }
  if (player.level >= 60) {
    addCountdown({ name: 'Tetragrammaton', time: checkRecast({ name: 'Tetragrammaton' }) });
  }
  if (player.level >= 50) {
    addCountdown({ name: 'Benediction', time: checkRecast({ name: 'Benediction' }) });
  }
  if (player.level >= 52) {
    addCountdown({ name: 'Asylum', time: checkRecast({ name: 'Asylum' }) });
  }
  if (player.level >= 80) {
    addCountdown({ name: 'Temperance', time: checkRecast({ name: 'Temperance' }), countdownArray: countdownArrayA });
  }

  if (player.level >= 24) {
    addCountdown({ name: 'Lucid Dreaming', time: checkRecast({ name: 'Lucid Dreaming' }), countdownArray: countdownArrayB });
  }
  if (player.level >= 58) {
    addCountdown({ name: 'Thin Air', time: checkRecast({ name: 'Thin Air' }), countdownArray: countdownArrayB });
  }
  if (player.level >= 30) {
    addCountdown({ name: 'Presence Of Mind', time: checkRecast({ name: 'Presence Of Mind' }), countdownArray: countdownArrayB });
  }
  if (player.level >= 70) {
    addCountdown({ name: 'Plenary Indulgence', time: checkRecast({ name: 'Plenary Indulgence' }), countdownArray: countdownArrayB });
  }

  if (player.level >= 18) {
    addCountdown({ name: 'Swiftcast', time: checkRecast({ name: 'Swiftcast' }), countdownArray: countdownArrayC });
  }

  whmNext();
};

onCasting.WHM = (castingMatch) => {
  fadeIcon({ name: player.stoneSpell });
};

onCancel.WHM = (cancelMatch) => {
  whmNext();
};

onTargetChanged.WHM = () => {
  // Check if target is a new target
  if (previous.targetID !== target.ID) {
    whmNext();
    previous.targetID = target.ID;
  }
};

onAction.WHM = (actionMatch) => {
  removeIcon({ name: actionMatch.groups.actionName });
  if (whmCountdownA.indexOf(actionMatch.groups.actionName) > -1) {
    addRecast({ name: actionMatch.groups.actionName });
    addCountdown({ name: actionMatch.groups.actionName, countdownArray: countdownArrayA });
  } else if (whmCountdownB.indexOf(actionMatch.groups.actionName) > -1) {
    addRecast({ name: actionMatch.groups.actionName });
    addCountdown({ name: actionMatch.groups.actionName, countdownArray: countdownArrayB });
  } else if (whmCountdownC.indexOf(actionMatch.groups.actionName) > -1) {
    addRecast({ name: actionMatch.groups.actionName });
    addCountdown({ name: actionMatch.groups.actionName, countdownArray: countdownArrayC });
  } else if (['Dia', 'Regen'].indexOf(actionMatch.groups.actionName) > -1) {
    addStatus({ name: actionMatch.groups.actionName, id: actionMatch.groups.targetID });
    addStatus({ name: actionMatch.groups.actionName }); /* This helps with calculations */
    whmNext({ ogcd: 2 });
  } else if (actionMatch.groups.actionName === player.stoneSpell) {
    whmNext();
  }
};

onStatus.WHM = (statusMatch) => {

  if (statusMatch.groups.gainsLoses === 'gains') {
    addStatus({
      name: statusMatch.groups.statusName,
      time: parseFloat(statusMatch.groups.statusDuration) * 1000,
      id: statusMatch.groups.targetID,
    });
    if (statusMatch.groups.statusName === 'Freecure') {
      addIcon({ name: 'Freecure' });
    }
  } else if (statusMatch.groups.gainsLoses === 'loses') {
    removeStatus({ name: statusMatch.groups.statusName });
    if (statusMatch.groups.statusName === 'Freecure') {
      removeIcon({ name: 'Freecure' });
    }
  }
};
