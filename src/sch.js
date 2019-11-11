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
  const array = priorityArray; // Just in case I change it later I guess
  // Helps spend extra Aetherflow
  if (toggle.aetherflow) {
    return; // Already doing things
  }

  if (player.level >= 60
  && Math.min(checkRecast({ name: 'aetherflow' }), checkRecast({ name: 'dissipation' }))
  < recast.gcd * player.tempjobDetail.aetherflow) {
    if (!toggle.aetherflow) {
      for (let i = 1; i <= player.tempjobDetail.aetherflow; i += 1) {
        addAction({ name: 'stack', img: 'energydrain', array });
      }
      toggle.aetherflow = Date.now();
    }
    if (checkRecast({ name: 'aetherflow' }) <= checkRecast({ name: 'dissipation' })) {
      addAction({ name: 'aetherflow', array });
    } else {
      addAction({ name: 'dissipation', array });
    }
  } else if (player.level >= 45 && checkRecast({ name: 'aetherflow' }) < recast.gcd * player.tempjobDetail.aetherflow) {
    if (!toggle.aetherflow) {
      for (let i = 1; i <= player.tempjobDetail.aetherflow; i += 1) {
        addAction({ name: 'stack', img: 'energydrain', array });
      }
      toggle.aetherflow = Date.now();
    }
    addAction({ name: 'aetherflow', array });
  }
};


const schLucidDreaming = () => {
  if (toggle.luciddreaming) {
    return;
  }
  if (player.level >= 24 && player.currentMP < 7500 && checkRecast({ name: 'luciddreaming' }) < 0) {
    addAction({ name: 'luciddreaming', array: priorityArray });
    toggle.luciddreaming = Date.now();
  }
};

const schNext = () => {
  schAetherflow();
  schLucidDreaming();
};

const schOnJobChange = () => {
  // Icon setup
  if (player.level >= 72) {
    icon.bio = icon.biolysis;
  } else if (player.level >= 26) {
    icon.bio = icon.bio2;
  } else {
    icon.bio = '000503';
  }

  // Displays right away (probably)
  if (player.level >= 45) {
    addCountdown({ name: 'aetherflow', order: -101 });
  }
  if (player.level >= 60) {
    addCountdown({ name: 'dissipation', order: -101 });
  }
  if (player.level >= 66) {
    addCountdown({
      name: 'chainstratagem', countdownArray: countdownArrayC, onComplete: 'addAction', array: cooldownArray,
    });
  }

  // Faerie cooldowns
  if (player.level >= 20) {
    addCountdown({ name: 'whisperingdawn', countdownArray: countdownArrayB });
  }
  if (player.level >= 40) {
    addCountdown({ name: 'feyillumination', countdownArray: countdownArrayB });
  }
  if (player.level >= 76) {
    addCountdown({ name: 'feyblessing', countdownArray: countdownArrayB });
  }
  if (player.level >= 80) {
    addCountdown({ name: 'summonseraph', countdownArray: countdownArrayB });
  }
  // if (player.level >= 80) {
  //   addCountdown({ name: 'consolation', countdownArray: countdownArrayB });
  // }

  // All others
  if (player.level >= 50) {
    addCountdown({ name: 'sacredsoil' });
  }
  if (player.level >= 52) {
    addCountdown({ name: 'indomitability' });
  }
  if (player.level >= 56) {
    addCountdown({ name: 'deploymenttactics' });
  }
  if (player.level >= 58) {
    addCountdown({ name: 'emergencytactics' });
  }
  if (player.level >= 62) {
    addCountdown({ name: 'excogitation' });
  }
  if (player.level >= 74) {
    addCountdown({ name: 'recitation' });
  }
  if (player.level >= 18) {
    addCountdown({ name: 'swiftcast' });
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
  // Check if target is a new target
  if (previous.targetID !== target.ID) {
    removeAction({ name: 'bio' });
    // Check Bio status if looking at new target
    if (target.ID === 0 || target.ID.startsWith('1') || target.ID.startsWith('E')) {
      // If not a target then clear things out
      // 0 = no target, 1... = player? E... = non-combat NPC?
      removeCountdown({ name: 'bio' });
    } else {
      addCountdown({ name: 'bio', time: checkStatus({ name: 'bio', id: target.ID }), onComplete: 'addAction removeCountdown' });
    }
    previous.targetID = target.ID;
  }
};

const schOnAction = (actionMatch) => {
  if (['Bio', 'Bio II', 'Biolysis'].indexOf(actionMatch.groups.actionName) > -1) {
    removeAction({ name: 'bio' });
    addStatus('bio', 30000, actionMatch.groups.targetID);
  } else if (['Ruin', 'Broil', 'Broil II', 'Broil III'].indexOf(actionMatch.groups.actionName) > -1) {
    // ?
  } else if (actionMatch.groups.actionName === 'Ruin II') {
    // ?
  } else if (actionMatch.groups.actionName === 'Whispering Dawn') {
    // removeAction({ name: 'whisperingdawn', array: cooldownArray });
    addRecast({ name: 'whisperingdawn' });
    addCountdown({ name: 'whisperingdawn', array: cooldownArray, countdownArray: countdownArrayB });
  } else if (actionMatch.groups.actionName === 'Fey Illumination') {
    // removeAction({ name: 'feyillumination', array: cooldownArray });
    addRecast({ name: 'feyillumination' });
    addCountdown({ name: 'feyillumination', array: cooldownArray, countdownArray: countdownArrayB });
  } else if (actionMatch.groups.actionName === 'Aetherflow') {
    removeAction({ name: 'aetherflow', array: priorityArray });
    addRecast({ name: 'aetherflow' });
    addCountdown({ name: 'aetherflow', order: -2 });
    delete toggle.aetherflow;
  } else if (actionMatch.groups.actionName === 'Energy Drain') {
    removeAction({ name: 'stack', array: priorityArray });
  } else if (actionMatch.groups.actionName === 'Lustrate') {
    removeAction({ name: 'stack', array: priorityArray });
  } else if (actionMatch.groups.actionName === 'Sacred Soil') {
    removeAction({ name: 'stack', array: priorityArray });
    // removeAction({ name: 'sacredsoil', array: cooldownArray });
    addRecast({ name: 'sacredsoil' });
    addCountdown({ name: 'sacredsoil', array: cooldownArray });
  } else if (actionMatch.groups.actionName === 'Indomitability') {
    removeAction({ name: 'stack', array: priorityArray });
    // removeAction({ name: 'indomitability', array: cooldownArray });
    addRecast({ name: 'indomitability' });
    addCountdown({ name: 'indomitability', array: cooldownArray });
  } else if (actionMatch.groups.actionName === 'Excogitation') {
    removeAction({ name: 'stack', array: priorityArray });
    // removeAction({ name: 'excogitation', array: cooldownArray });
    addRecast({ name: 'excogitation' });
    addCountdown({ name: 'excogitation', array: cooldownArray });
  } else if (actionMatch.groups.actionName === 'Deployment Tactics') {
    // removeAction({ name: 'deploymenttactics', array: cooldownArray });
    addRecast({ name: 'deploymenttactics' });
    addCountdown({ name: 'deploymenttactics', array: cooldownArray });
  } else if (actionMatch.groups.actionName === 'Dissipation') {
    removeAction({ name: 'dissipation', array: priorityArray });
    addRecast({ name: 'dissipation' });
    addCountdown({ name: 'dissipation', order: -1 });
    delete toggle.aetherflow;
  } else if (actionMatch.groups.actionName === 'Chain Stratagem') {
    removeAction({ name: 'chainstratagem', array: cooldownArray });
    addRecast({ name: 'chainstratagem' });
    addCountdown({
      name: 'chainstratagem', countdownArray: countdownArrayC, onComplete: 'addAction', array: cooldownArray,
    });
  } else if (actionMatch.groups.actionName === 'Recitation') {
    // removeAction({ name: 'recitation', array: cooldownArray });
    addRecast({ name: 'recitation' });
    addCountdown({ name: 'recitation' });
  } else if (actionMatch.groups.actionName === 'Summon Seraph') {
    // removeAction({ name: 'summonseraph', array: cooldownArray });
    addRecast({ name: 'summonseraph' });
    addCountdown({ name: 'summonseraph', countdownArray: countdownArrayB, array: cooldownArray });
  } else if (actionMatch.groups.actionName === 'Swiftcast') {
    // removeAction({ name: 'summonseraph', array: cooldownArray });
    addRecast({ name: 'swiftcast' });
    addCountdown({ name: 'swiftcast', array: cooldownArray });
  } else if (actionMatch.groups.actionName === 'Lucid Dreaming') {
    removeAction({ name: 'luciddreaming', array: priorityArray });
    addRecast({ name: 'luciddreaming' });
    addCountdown({ name: 'luciddreaming', array: priorityArray, onComplete: 'removeCountdown' });
    delete toggle.luciddreaming;
  }
  schNext();
};

const schOnStatus = (statusMatch) => {
  if (['Bio', 'Bio II', 'Biolysis'].indexOf(statusMatch.groups.effectName) > -1) {
    if (statusMatch.groups.gainsLoses === 'gains') {
      addStatus({ name: 'bio', time: parseFloat(statusMatch.groups.effectDuration) * 1000, id: statusMatch.groups.targetID });

      // Might be possible to switch targets between application to target and log entry
      if (target.ID === statusMatch.groups.targetID) {
        addCountdown({ name: 'bio', time: checkStatus({ name: 'bio', id: target.ID }), onComplete: 'addAction removeCountdown' });
      }
    } else if (statusMatch.groups.gainsLoses === 'loses') {
      removeStatus({ name: 'bio', id: statusMatch.groups.targetID });
    }
  }
};
