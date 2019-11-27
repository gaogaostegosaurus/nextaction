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
  // Probably more can go here but whatever for now?
];

cooldownListA.WHM = [
  'Benediction', 'Asylum', 'Assize', 'Tetragrammaton', 'Divine Benison',
];

cooldownListB.WHM = [
  'Presence Of Mind', 'Thin Air',
  'Plenary Indulgence',
];

cooldownListC.WHM = [
  'Temperance', 'Swiftcast', 'Lucid Dreaming', 'Surecast',
];


const whmNext = () => {
  // Anything?
};

onJobChange.WHM = () => {

  if (player.level >= 72) {
    player.aeroSpell = 'Dia';
  } else if (player.level >= 46) {
    player.aeroSpell = 'Aero II';
  } else {
    player.aeroSpell = 'Aero';
  }

  if (checkStatus({ name: 'Freecure' }) > 0 && !toggle.freecure) {
    addIcon({ name: 'Freecure' });
    toggle.freecure;
  } else {
    removeIcon({ name: 'Freecure' });
    delete toggle.freecure;
  }

  if (player.level >= 30) {
    addCountdown({ name: 'Presence Of Mind', time: checkRecast({ name: 'Presence Of Mind' }), countdownArray: countdownArrayB });
  }

  if (player.level >= 50) {
    addCountdown({ name: 'Benediction', time: checkRecast({ name: 'Benediction' }) });
  }

  if (player.level >= 52) {
    addCountdown({ name: 'Asylum', time: checkRecast({ name: 'Asylum' }) });
  }

  if (player.level >= 56) {
    addCountdown({ name: 'Assize', time: checkRecast({ name: 'Assize' }) });
  }

  if (player.level >= 58) {
    addCountdown({ name: 'Thin Air', time: checkRecast({ name: 'Thin Air' }), countdownArray: countdownArrayB });
  }

  if (player.level >= 60) {
    addCountdown({ name: 'Tetragrammaton', time: checkRecast({ name: 'Tetragrammaton' }) });
  }

  if (player.level >= 66) {
    addCountdown({ name: 'Divine Benison', time: checkRecast({ name: 'Divine Benison' }) });
  }

  if (player.level >= 70) {
    addCountdown({ name: 'Plenary Indulgence', time: checkRecast({ name: 'Plenary Indulgence' }), countdownArray: countdownArrayB });
  }

  if (player.level >= 80) {
    addCountdown({ name: 'Temperance', time: checkRecast({ name: 'Temperance' }), countdownArray: countdownArrayC });
  }

  if (player.level >= 18) {
    addCountdown({ name: 'Swiftcast', time: checkRecast({ name: 'Swiftcast' }), countdownArray: countdownArrayC });
  }

  if (player.level >= 24) {
    addCountdown({ name: 'Lucid Dreaming', time: checkRecast({ name: 'Lucid Dreaming' }), countdownArray: countdownArrayC });
  }
};

onCasting.WHM = (castingMatch) => {
  whmNext();
};

onCancel.WHM = (cancelMatch) => {
  whmNext();
};

onTargetChanged.WHM = () => {
  // Check if target is a new target
  if (previous.targetID !== target.ID) {
    const whmArray = [];
    if (target.ID.startsWith('4')) {
      // If not a target then clear things out
      // 0 = no target, 1... = player? E... = non-combat NPC?
      addCountdown({ name: player.aeroSpell, time: checkStatus({ name: player.aeroSpell, id: target.ID }), onComplete: 'addIcon' });
    } else if (target.ID.startsWith('1') && ['PLD', 'WAR', 'DRK', 'GNB'].indexOf(target.job) > -1) {
      addCountdown({ name: 'Regen', time: checkStatus({ name: 'Regen', id: target.ID }), onComplete: 'addIcon' });
    } else {
      hideCountdown({ name: player.aeroSpell });
      hideCountdown({ name: 'Regen' });
    }
    previous.targetID = target.ID;
    iconArrayB = whmArray;
    syncIcons();
  }
};

onAction.WHM = (actionMatch) => {

  if (cooldownListA.WHM.indexOf(actionMatch.groups.actionName) > -1) {
    addRecast({ name: actionMatch.groups.actionName });
    addCountdown({ name: actionMatch.groups.actionName, countdownArray: countdownArrayA });
  } else if (cooldownListB.WHM.indexOf(actionMatch.groups.actionName) > -1) {
    addRecast({ name: actionMatch.groups.actionName });
    addCountdown({ name: actionMatch.groups.actionName, countdownArray: countdownArrayB });
  } else if (cooldownListC.WHM.indexOf(actionMatch.groups.actionName) > -1) {
    addRecast({ name: actionMatch.groups.actionName });
    addCountdown({ name: actionMatch.groups.actionName, countdownArray: countdownArrayC });
  } else if (['Aero', 'Aero II', 'Dia', 'Regen'].indexOf(actionMatch.groups.actionName) > -1) {
    removeIcon({ name: actionMatch.groups.actionName });
    addStatus({ name: actionMatch.groups.actionName, id: actionMatch.groups.targetID });
    if (player.name === 'Zoot Zoots') {
      addCountdown({
        name: actionMatch.groups.actionName,
        time: checkStatus({ name: actionMatch.groups.actionName, id: target.ID }),
        onComplete: 'addIcon',
        text: `${actionMatch.groups.actionName.toUpperCase} U DUMMY`,
      });
    } else {
      addCountdown({
        name: actionMatch.groups.actionName,
        time: checkStatus({ name: actionMatch.groups.actionName, id: target.ID }),
        onComplete: 'addIcon',
      });
    }
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
}
