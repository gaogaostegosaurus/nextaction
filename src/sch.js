'use strict';

const schActionList = [
  // Off-GCD
  'Aetherflow', 'Lustrate', 'Energy Drain', 'Sacred Soil',
  'Indomitability', 'Deployment Tactics', 'Emergency Tactics', 'Dissipation',
  'Excogitation', 'Chain Stratagem',
  'Recitation',

  // Pet
  'Whispering Dawn',
  'Fey Illumination',
  'Aetherpact',
  'Fey Blessing',
  'Summon Seraph',
  'Consolation',

  // GCD
  'Bio', 'Bio II', 'Biolysis',
  'Ruin', 'Broil', 'Broil II', 'Broil III',
  'Ruin II', 'Art Of War',
  'Physick', 'Adloquium', 'Succor',
  'Summon Eos', 'Summon Selene',

  // Role
  'Swiftcast', 'Lucid Dreaming',
];

const schCastingList = [
  'Bio', 'Bio II', 'Biolysis',
  'Ruin', 'Broil', 'Broil II', 'Broil III',
  'Ruin II', 'Art Of War',
  'Physick', 'Adloquium', 'Succor',
  'Summon Eos', 'Summon Selene',
];

const schStatusList = [
  'Bio', 'Bio II', 'Biolysis',
  'Galvanize', 'Catalyze',
  // Probably more can go here but whatever for now?
];

const schAetherflow = () => {
  const array = iconArrayA; // Just in case I change it later I guess
  // Helps spend extra Aetherflow
  if (toggle.aetherflow) {
    return; // Already doing things
  }

  if (player.level >= 60
  && Math.min(checkRecast({ name: 'Aetherflow' }), checkRecast({ name: 'Dissipation' }))
  < recast.gcd * player.tempjobDetail.aetherflow) {
    if (!toggle.aetherflow) {
      for (let i = 1; i <= player.tempjobDetail.aetherflow; i += 1) {
        addIcon({ name: 'Stack', img: 'energydrain', array });
      }
      toggle.aetherflow = Date.now();
    }
    if (checkRecast({ name: 'Aetherflow' }) <= checkRecast({ name: 'Dissipation' })) {
      addIcon({ name: 'Aetherflow', array });
    } else {
      addIcon({ name: 'Dissipation', array });
    }
  } else if (player.level >= 45 && checkRecast({ name: 'Aetherflow' }) < recast.gcd * player.tempjobDetail.aetherflow) {
    if (!toggle.aetherflow) {
      for (let i = 1; i <= player.tempjobDetail.aetherflow; i += 1) {
        addIcon({ name: 'Stack', img: 'energydrain', array });
      }
      toggle.aetherflow = Date.now();
    }
    addIcon({ name: 'Aetherflow', array });
  }
};


const schLucidDreaming = () => {
  if (toggle.luciddreaming) {
    return;
  }
  if (player.level >= 24 && player.currentMP < 7500 && checkRecast({ name: 'luciddreaming' }) < 0) {
    addIcon({ name: 'luciddreaming', array: iconArrayA });
    toggle.luciddreaming = Date.now();
  }
};

const schNext = () => {
  schAetherflow();
  schLucidDreaming();
};

const schOnJobChange = () => {
  // Icon setup


  // Displays right away (probably)
  if (player.level >= 45) {
    addCountdown({ name: 'Aetherflow', order: -101 });
  }
  if (player.level >= 60) {
    addCountdown({ name: 'Dissipation', order: -101 });
  }
  if (player.level >= 66) {
    addCountdown({
      name: 'Chain Stratagem', countdownArray: countdownArrayC, onComplete: 'addIcon', array: iconArrayC,
    });
  }

  // Faerie cooldowns
  if (player.level >= 20) {
    addCountdown({ name: 'Whispering Dawn', countdownArray: countdownArrayB });
  }
  if (player.level >= 40) {
    addCountdown({ name: 'Fey Illumination', countdownArray: countdownArrayB });
  }
  if (player.level >= 76) {
    addCountdown({ name: 'Fey Blessing', countdownArray: countdownArrayB });
  }
  if (player.level >= 80) {
    addCountdown({ name: 'Summon Seraph', countdownArray: countdownArrayB });
  }
  // if (player.level >= 80) {
  //   addCountdown({ name: 'consolation', countdownArray: countdownArrayB });
  // }

  // All others
  if (player.level >= 50) {
    addCountdown({ name: 'Sacred Soil' });
  }
  if (player.level >= 52) {
    addCountdown({ name: 'Indomitability' });
  }
  if (player.level >= 56) {
    addCountdown({ name: 'Deployment Tactics' });
  }
  if (player.level >= 58) {
    addCountdown({ name: 'Emergency Tactics' });
  }
  if (player.level >= 62) {
    addCountdown({ name: 'Excogitation' });
  }
  if (player.level >= 74) {
    addCountdown({ name: 'Recitation' });
  }
  if (player.level >= 18) {
    addCountdown({ name: 'Swiftcast' });
  }
  schNext();
};

const schOnCasting = (castingMatch) => {
  schNext();
};

const schOnCancel = (cancelMatch) => {
  schNext();
};

const schOnTargetChangedEvent = () => {
  if (player.level >= 72) {
    player.bioSpell = 'Biolysis'
  } else if (player.level >= 26) {
    player.bioSpell = 'Bio II'
  } else {
    player.bioSpell = 'Bio'
  }
  // Check if target is a new target
  if (previous.targetID !== target.ID) {
    // Check Bio status if looking at new target
    if (target.ID.startsWith('4')) {
      // If not a target then clear things out
      // 0 = no target, 1... = player? E... = non-combat NPC?
      addCountdown({ name: player.bioSpell, time: checkStatus({ name: player.bioSpell, id: target.ID }), onComplete: 'addIcon removeCountdown' });
    } else {
      removeIcon({ name: player.bioSpell });
      removeCountdown({ name: player.bioSpell });
    }
    previous.targetID = target.ID;
  }
};

const schOnAction = (actionMatch) => {
  if (['Bio', 'Bio II', 'Biolysis'].indexOf(actionMatch.groups.actionName) > -1) {
    removeIcon({ name: actionMatch.groups.actionName });
    addStatus({ name: actionMatch.groups.actionName, id: actionMatch.groups.targetID });
  // } else if (['Ruin', 'Broil', 'Broil II', 'Broil III'].indexOf(actionMatch.groups.actionName) > -1) {
    // ?
  // } else if (actionMatch.groups.actionName === 'Ruin II') {
    // ?
  } else if (['Whispering Dawn', 'Fey Illumination', 'Fey Blessing', 'Summon Seraph'].indexOf(actionMatch.groups.actionName) > -1) {
    // removeIcon({ name: 'Whispering Dawn', array: iconArrayC });
    addRecast({ name: actionMatch.groups.actionName });
    addCountdown({ name: actionMatch.groups.actionName, array: iconArrayC, countdownArray: countdownArrayB });
  } else if (['Deployment Tactics', 'Recitation', 'Swiftcast'].indexOf(actionMatch.groups.actionName) > -1) {
    // removeIcon({ name: 'Whispering Dawn', array: iconArrayC });
    addRecast({ name: actionMatch.groups.actionName });
    addCountdown({ name: actionMatch.groups.actionName, array: iconArrayC });
  } else if (['Energy Drain', 'Lustrate'].indexOf(actionMatch.groups.actionName) > -1) {
    removeIcon({ name: 'Energy Drain', array: iconArrayA });
  } else if (['Sacred Soil', 'Indomitability', 'Excogitation'].indexOf(actionMatch.groups.actionName) > -1) {
    removeIcon({ name: 'Energy Drain', array: iconArrayA });
    addRecast({ name: actionMatch.groups.actionName });
    addCountdown({ name: actionMatch.groups.actionName, array: iconArrayC });
  } else if (actionMatch.groups.actionName === 'Chain Stratagem') {
    removeIcon({ name: actionMatch.groups.actionName, array: iconArrayC });
    addRecast({ name: actionMatch.groups.actionName, array: iconArrayC });
    addCountdown({
      name: actionMatch.groups.actionName, countdownArray: countdownArrayC, onComplete: 'addIcon', array: iconArrayC,
    });
  } else if (actionMatch.groups.actionName === 'Aetherflow') {
    removeIcon({ name: 'Aetherflow', array: iconArrayA });
    addRecast({ name: 'Aetherflow' });
    addCountdown({ name: 'Aetherflow', order: -2 });
    delete toggle.aetherflow;
  } else if (actionMatch.groups.actionName === 'Dissipation') {
    removeIcon({ name: 'Dissipation', array: iconArrayA });
    addRecast({ name: 'Dissipation' });
    addCountdown({ name: 'Dissipation', order: -1 });
    delete toggle.aetherflow;
  } else if (actionMatch.groups.actionName === 'Lucid Dreaming') {
    removeIcon({ name: 'luciddreaming', array: iconArrayA });
    addRecast({ name: 'luciddreaming' });
    addCountdown({ name: 'luciddreaming', array: iconArrayA, onComplete: 'removeCountdown' });
    delete toggle.luciddreaming;
  }
  schNext();
};

const schOnStatus = (statusMatch) => {
  if (statusMatch.groups.gainsLoses === 'gains') {
    addStatus({ name: statusMatch.groups.statusName, time: parseFloat(statusMatch.groups.statusDuration) * 1000, id: statusMatch.groups.targetID });

    if (['Bio', 'Bio II', 'Biolysis'].indexOf(statusMatch.groups.statusName) > -1 && target.ID === statusMatch.groups.targetID) {
      // Might be possible to switch targets between application to target and log entry
      addCountdown({ name: statusMatch.groups.statusName, time: checkStatus({ name: statusMatch.groups.statusName, id: target.ID }), onComplete: 'addIcon removeCountdown' });
    }
  } else if (statusMatch.groups.gainsLoses === 'loses') {
    removeStatus({ name: statusMatch.groups.statusName, id: statusMatch.groups.targetID });
  }
};
