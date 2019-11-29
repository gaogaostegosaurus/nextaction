
actionList.SCH = [
  // Off-GCD
  'Aetherflow', 'Dissipation',
  'Energy Drain', 'Lustrate', 'Sacred Soil', 'Indomitability', 'Excogitation',
  'Deployment Tactics', 'Emergency Tactics', 'Recitation',
  'Chain Stratagem',

  // Pet
  'Whispering Dawn', 'Fey Illumination', 'Aetherpact', 'Dissolve Union', 'Fey Blessing',
  'Summon Seraph', 'Consolation',

  // GCD
  'Bio', 'Bio II', 'Biolysis',
  'Ruin II', 'Art Of War',
  'Ruin', 'Broil', 'Broil II', 'Broil III',
  'Physick', 'Adloquium', 'Succor',
  'Summon Eos', 'Summon Selene',
  'Ressurection',

  // Role
  'Repose', 'Esuna',
  'Swiftcast', 'Lucid Dreaming', 'Surecast', 'Rescue',
];

const schCastActions = [
  'Ruin', 'Broil', 'Broil II', 'Broil III',
  'Physick', 'Adloquium', 'Succor',
  'Summon Eos', 'Summon Selene',
  'Ressurection',

  'Repose', 'Esuna',
];

const schInstantActions = [
  'Bio', 'Bio II', 'Biolysis',
  'Ruin II', 'Art Of War',
];

const schCooldownActions = [
  'Aetherflow', 'Dissipation',
  'Energy Drain', 'Lustrate', 'Sacred Soil', 'Indomitability', 'Excogitation',
  'Deployment Tactics', 'Emergency Tactics', 'Recitation',
  'Chain Stratagem',

  'Whispering Dawn', 'Fey Illumination', 'Aetherpact', 'Dissolve Union', 'Fey Blessing',
  'Summon Seraph', 'Consolation',

  'Swiftcast', 'Lucid Dreaming', 'Surecast', 'Rescue',
];

const schBioSpells = [ 'Bio', 'Bio II', 'Biolysis' ];

const schColumns = [
  { name: 'Aetherflow', level: 45, array: countdownArrayA },
  { name: 'Dissipation', level: 60, array: countdownArrayA },
  { name: 'Excogitation', level: 62, array: countdownArrayA },
  { name: 'Indomitability', level: 52, array: countdownArrayA },
  { name: 'Sacred Soil', level: 50, array: countdownArrayA },
  { name: 'Recitation', level: 74, array: countdownArrayA },
  { name: 'Emergency Tactics', level: 58, array: countdownArrayA },
  { name: 'Deployment Tactics', level: 56, array: countdownArrayA },

  { name: 'Summon Seraph', level: 80, array: countdownArrayB },
  { name: 'Fey Blessing', level: 76, array: countdownArrayB },
  { name: 'Fey Illumination', level: 40, array: countdownArrayB },
  { name: 'Whispering Dawn', level: 20, array: countdownArrayB },

  { name: 'Chain Stratagem', level: 66, array: countdownArrayC },
];


actionList.SCH = schCastActions.concat(schInstantActions, schCooldownActions);

castingList.SCH = schCastActions;

statusList.SCH = [
  'Bio', 'Bio II', 'Biolysis',
  'Galvanize', 'Catalyze',
  'Dissipation',
  /* Probably more can go here, but whatever for now? */
];

const schNext = ({
  time = player.gcd,
  casting,
} = {}) => {
  next.aetherflow = player.aetherflow;
  next.MP = player.MP;

  if (target.ID && target.ID.startsWith('4')) {
    next.bioStatus = checkStatus({ name: player.bioSpell, id: target.ID });
  } else {
    next.bioStatus = checkStatus({ name: player.bioSpell });
  }
  next.dissipationStatus = checkStatus({ name: 'Dissipation' });
  next.summonseraphStatus = checkStatus({ name: 'Summon Seraph' });
  next.consolationCount = count.consolation;

  next.aetherflowRecast = checkRecast({ name: 'Aetherflow' });
  next.dissipationRecast = checkRecast({ name: 'Dissipation' });
  next.energydrainRecast = checkRecast({ name: 'Energy Drain' });
  next.sacredsoilRecast = checkRecast({ name: 'Sacred Soil' });
  next.indomitabilityRecast = checkRecast({ name: 'Indomitability' });
  next.excogitationRecast = checkRecast({ name: 'Excogitation' });
  next.deploymenttacticsRecast = checkRecast({ name: 'Deployment Tactics' });
  next.emergencytacticsRecast = checkRecast({ name: 'Emergency Tactics' });
  next.recitationRecast = checkRecast({ name: 'Recitation' });
  next.chainstratagemRecast = checkRecast({ name: 'Chain Stratagem ' });
  next.whisperingdawnRecast = checkRecast({ name: 'Whispering Dawn' });
  next.feyilluminationRecast = checkRecast({ name: 'Fey Illumination' });
  next.feyblessingRecast = checkRecast({ name: 'Fey Blessing' });
  next.summonseraphRecast = checkRecast({ name: 'Summon Seraph' });
  next.swiftcastRecast = checkRecast({ name: 'Swiftcast' });
  next.luciddreamingRecast = checkRecast({ name: 'Lucid Dreaming' });

  next.elapsedTime = time;
  next.ogcd = toggle.ogcd;
  next.combat = toggle.combat;

  const schArray = [];

  do {
    /* Check if Ruin II is necessary */
    if (Math.min(
      /* Energy Drain/Aetherflow/Dissipation */
      Math.min(next.aetherflowRecast, next.dissipationRecast) - player.gcd * (1 + next.aetherflow),

      /* Chain Stratagem */
      next.chainstratagemRecast,

      /* ...more? */
    ) - next.elapsedTime < 0) {
      next.cooldown = 1;
    } else if (next.MP < 8000 && next.luciddreamingRecast - next.elapsedTime < 0) {
      /* Lucid Dreaming */
      next.cooldown = 1;
    } else {
      next.cooldown = 0;
    }

    // console.log(next.cooldown);

    if (!next.combat && next.MP >= 400) {
      schArray.push({ name: player.ruinSpell });
      next.elapsedTime += player.gcd;
      next.MP -= 400;
      next.combat = 1;
    } else if (next.ogcd > 0 && player.level >= 45 && next.aetherflow === 0
    && next.aetherflowRecast - next.elapsedTime < 0) {
      schArray.push({ name: 'Aetherflow', size: 'small' });
      next.ogcd -= 1;
      next.cooldown = 0;
      next.aetherflow = 3;
      next.MP += 500;
      next.aetherflowRecast = 60000 + next.elapsedTime;
    } else if (next.ogcd > 0 && player.level >= 60 && next.aetherflow === 0
    && next.dissipationRecast - next.elapsedTime < 0) {
      schArray.push({ name: 'Dissipation', size: 'small' });
      next.ogcd -= 1;
      next.cooldown = 0;
      next.aetherflow = 3;
      next.dissipationStatus = 30000 + next.elapsedTime;
      next.dissipationRecast = 180000 + next.elapsedTime;
    } else if (next.ogcd > 0 && next.summonseraphStatus - next.elapsedTime > 0
    && next.summonseraphStatus - next.consolationCount * player.gcd - next.elapsedTime < 0) {
      /* should be less than 0 or gcd? */
      schArray.push({ name: 'Consolation', size: 'small' });
      next.ogcd -= 1;
      next.cooldown = 0;
      next.consolationCount -= 1;
    } else if (next.ogcd > 0 && player.level >= 26
    && next.MP + Math.floor(next.elapsedTime / 3000) * 200 < 8000
    && next.luciddreamingRecast - next.elapsedTime < 0) {
      schArray.push({ name: 'Lucid Dreaming', size: 'small' });
      next.ogcd -= 1;
      next.cooldown = 0;
      next.luciddreamingRecast = 120000 + next.elapsedTime;
    } else if (next.ogcd > 0 && player.level >= 45 && next.aetherflow > 0
    && Math.min(next.aetherflowRecast, next.dissipationRecast)
    - next.elapsedTime - player.gcd * (1 + next.aetherflow) < 0) {
      schArray.push({ name: 'Energy Drain', size: 'small' });
      next.ogcd -= 1;
      next.cooldown = 0;
      next.aetherflow -= 1;
      next.MP += 1000;
      // next.energydrainRecast = 3000 + next.elapsedTime;
    } else if (next.ogcd > 0 && player.level >= 66
    && next.chainstratagemRecast - next.elapsedTime < 0) {
      schArray.push({ name: 'Chain Stratagem', size: 'small' });
      next.ogcd -= 1;
      next.cooldown = 0;
      next.chainstratagemRecast = 120000 + next.elapsedTime;
    } else if (player.level >= 2 && next.MP >= 400 && next.bioStatus - next.elapsedTime < 0) {
      schArray.push({ name: player.bioSpell });
      next.bioStatus = 30000 + next.elapsedTime;
      next.elapsedTime += player.gcd;
      next.ogcd = 1;
      next.MP -= 400;
    } else if (player.level >= 38 && next.MP >= 400 && next.cooldown > 0) {
      schArray.push({ name: 'Ruin II' });
      next.MP -= 400;
      next.ogcd = 1;
      next.elapsedTime += player.gcd;
    } else {
      schArray.push({ name: player.ruinSpell });
      next.MP -= 400;
      next.elapsedTime += player.gcd;
    }
  } while (next.elapsedTime < 15000);

  iconArrayB = schArray;

  if (casting) {
    schArray.push({ name: player.ruinSpell });
  }

  syncIcons();
};

onJobChange.SCH = () => {
  //
  delete toggle.aetherflow;
  //  delete toggle.luciddreaming;

  if (player.level >= 72) {
    player.ruinSpell = 'Broil III';
  } else if (player.level >= 64) {
    player.ruinSpell = 'Broil II';
  } else if (player.level >= 54) {
    player.ruinSpell = 'Broil';
  } else {
    player.ruinSpell = 'Ruin';
  }

  if (player.level >= 72) {
    player.bioSpell = 'Biolysis';
  } else if (player.level >= 26) {
    player.bioSpell = 'Bio II';
  } else {
    player.bioSpell = 'Bio';
  }

  for (let i = 0, columnsLength = schColumns.length; i < columnsLength; i += 1) {
    if (player.level >= schColumns[i].level) {
      addCountdown({ name: schColumns[i].name, countdownArray: schColumns[i].array });
    }
  }

  schNext({ time: 0 });
};

onCasting.SCH = (castingMatch) => {
  toggle.ogcd = 0;
  schNext();
};

onCancel.SCH = (cancelMatch) => {
  schNext();
};

onTargetChanged.SCH = () => {
  //
};

onAction.SCH = (actionMatch) => {
  removeIcon({ name: actionMatch.groups.actionName });

  if (schInstantActions.indexOf(actionMatch.groups.actionName) > -1) {
    if (schBioSpells.indexOf(actionMatch.groups.actionName) > -1) {
      addStatus({ name: actionMatch.groups.actionName, id: actionMatch.groups.targetID });
      addStatus({ name: actionMatch.groups.actionName }); /* to assist with next calculations */
    }
    toggle.ogcd = 1;
    schNext();
  } else if (schCastActions.indexOf(actionMatch.groups.actionName) > -1) {
    toggle.ogcd = 0;
    schNext({ time: 0 });
  } else if (schCooldownActions.indexOf(actionMatch.groups.actionName) > -1) {
    addRecast({ name: actionMatch.groups.actionName });
    if (schColumns.some((entry) => entry.name === actionMatch.groups.actionName)) {
      const index = schColumns.findIndex((entry) => entry.name === actionMatch.groups.actionName);
      addCountdown({
        name: actionMatch.groups.actionName, countdownArray: schColumns[index].array,
      });
    }
    toggle.ogcd -= 1;
    schNext({ time: 1000 });
  }
};

onStatus.SCH = (statusMatch) => {
  if (statusMatch.groups.gainsLoses === 'gains') {
    addStatus({
      name: statusMatch.groups.statusName,
      time: parseFloat(statusMatch.groups.statusDuration) * 1000,
      id: statusMatch.groups.targetID,
    });
  } else {
    removeStatus({ name: statusMatch.groups.statusName, id: statusMatch.groups.targetID });
  }
};
