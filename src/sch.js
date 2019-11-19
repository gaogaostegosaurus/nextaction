
actionList.SCH = [
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

castingList.SCH = [
  'Bio', 'Bio II', 'Biolysis',
  'Ruin', 'Broil', 'Broil II', 'Broil III',
  'Ruin II', 'Art Of War',
  'Physick', 'Adloquium', 'Succor',
  'Summon Eos', 'Summon Selene',
];

statusList.SCH = [
  'Bio', 'Bio II', 'Biolysis',
  'Galvanize', 'Catalyze',
  // Probably more can go here but whatever for now?
];

const schAetherflow = () => {
  // Helps spend extra Aetherflow
  // let iconArray = iconArrayA; // Just in case I change it later I guess

  if (checkRecast({ name: 'Aetherflow' }) < 0 && toggle.aetherflow === 'Dissipation') {
    removeIcon({ name: 'Dissipation', iconArray: iconArrayA });
    addIcon({ name: 'Aetherflow', iconArray: iconArrayA });
    toggle.aetherflow = 'Aetherflow';
    // Refresh display if both are on cooldown
  }

  if (toggle.aetherflow) {
    return; // Already displaying something, probably
  }

  // Remove all Aetherflow Stack icons
  iconArrayA = iconArrayA.filter((entry) => entry.name !== 'Energy Drain' && entry.name !== 'Aetherflow' && entry.name !== 'Dissipation');
  syncIcons({ iconArray: iconArrayA });
  // rowDiv.querySelectorAll('div[data-name="Aetherflow Stack"]').forEach(e => e.remove());

  if (player.level >= 45 && checkRecast({ name: 'Aetherflow' }) < recast.gcd * (player.aetherflow + 1)) {
    for (let i = 1; i <= player.aetherflow; i += 1) {
      addIcon({ name: 'Energy Drain', iconArray: iconArrayA });
    }
    addIcon({ name: 'Aetherflow', iconArray: iconArrayA });
    toggle.aetherflow = 'Aetherflow';
    // console.log(`${player.aetherflow} ${checkRecast({ name: 'Aetherflow' })}`);
  } else if (player.level >= 60 && checkRecast({ name: 'Dissipation' }) < recast.gcd * (player.aetherflow + 1)) {
    for (let i = 1; i <= player.aetherflow; i += 1) {
      addIcon({ name: 'Energy Drain', iconArray: iconArrayA });
    }
    addIcon({ name: 'Dissipation', iconArray: iconArrayA });
    toggle.aetherflow = 'Dissipation';
  }
};

const schNext = () => {
  schAetherflow();
};

onJobChange.SCH = () => {
  //
  delete toggle.aetherflow;
  //  delete toggle.luciddreaming;

  if (player.level >= 72) {
    player.bioSpell = 'Biolysis';
  } else if (player.level >= 26) {
    player.bioSpell = 'Bio II';
  } else {
    player.bioSpell = 'Bio';
  }

  // Displays right away (probably)
  if (player.level >= 45) {
    addCountdown({ name: 'Aetherflow', order: -101 });
  }
  if (player.level >= 60) {
    addCountdown({ name: 'Dissipation', order: -101 });
  }
  if (player.level >= 66) {
    addCountdown({
      name: 'Chain Stratagem', countdownArray: countdownArrayC, onComplete: 'addIcon', iconArray: iconArrayC,
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

onCasting.SCH = (castingMatch) => {
  schNext();
};

onCancel.SCH = (cancelMatch) => {
  schNext();
};

onTargetChanged.SCH = () => {
  // Check if target is a new target
  if (previous.targetID !== target.ID) {
    // Check Bio status if looking at new target
    removeIcon({ name: player.bioSpell });
    if (target.ID.startsWith('4')) {
      // If not a target then clear things out
      // 0 = no target, 1... = player? E... = non-combat NPC?
      addCountdown({ name: player.bioSpell, time: checkStatus({ name: player.bioSpell, id: target.ID }), onComplete: 'addIcon removeCountdown' });
    } else {
      hideCountdown({ name: player.bioSpell });
    }
    previous.targetID = target.ID;
  }
};

onAction.SCH = (actionMatch) => {
  // Currently no catch for Ruin/Ruin II and such - not needed?
  if (['Bio', 'Bio II', 'Biolysis'].indexOf(actionMatch.groups.actionName) > -1) {
    removeIcon({ name: actionMatch.groups.actionName });
    addStatus({ name: actionMatch.groups.actionName, id: actionMatch.groups.targetID });
  } else if (['Whispering Dawn', 'Fey Illumination', 'Fey Blessing', 'Summon Seraph'].indexOf(actionMatch.groups.actionName) > -1) {
    // removeIcon({ name: 'Whispering Dawn', iconArray: iconArrayC });
    addRecast({ name: actionMatch.groups.actionName });
    addCountdown({
      name: actionMatch.groups.actionName, iconArray: iconArrayC, countdownArray: countdownArrayB,
    });
  } else if (['Deployment Tactics', 'Chain Stratagem', 'Recitation', 'Swiftcast'].indexOf(actionMatch.groups.actionName) > -1) {
    addRecast({ name: actionMatch.groups.actionName });
    addCountdown({ name: actionMatch.groups.actionName, iconArray: iconArrayC });
    if (actionMatch.groups.actionName === 'Chain Stratagem') {
      removeIcon({ name: actionMatch.groups.actionName, iconArray: iconArrayC });
      addCountdown({
        name: actionMatch.groups.actionName, countdownArray: countdownArrayC, onComplete: 'addIcon', iconArray: iconArrayC,
      });
    }
  } else if (['Energy Drain', 'Lustrate', 'Sacred Soil', 'Indomitability', 'Excogitation'].indexOf(actionMatch.groups.actionName) > -1) {
    removeIcon({ name: 'Energy Drain', iconArray: iconArrayA });
    if (['Sacred Soil', 'Indomitability', 'Excogitation'].indexOf(actionMatch.groups.actionName) > -1) {
      addRecast({ name: actionMatch.groups.actionName });
      addCountdown({ name: actionMatch.groups.actionName, iconArray: iconArrayC });
    }
  } else if (['Aetherflow', 'Lucid Dreaming', 'Dissipation'].indexOf(actionMatch.groups.actionName) > -1) {
    removeIcon({ name: actionMatch.groups.actionName, iconArray: iconArrayA });
    addRecast({ name: actionMatch.groups.actionName });
    if (actionMatch.groups.actionName === 'Aetherflow') {
      addCountdown({ name: 'Aetherflow', order: -2 });
      delete toggle.aetherflow;
    } else if (actionMatch.groups.actionName === 'Dissipation') {
      addCountdown({ name: 'Dissipation', order: -1 });
      delete toggle.aetherflow;
    } else if (actionMatch.groups.actionName === 'Lucid Dreaming') {
      addCountdown({ name: 'Lucid Dreaming', iconArray: iconArrayA, onComplete: 'removeCountdown' });
      delete toggle.luciddreaming;
    }
  }
  schNext();
};

onStatus.SCH = (statusMatch) => {
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
