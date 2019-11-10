'use strict';

const schActionList = [

  // Off-GCD
  'Aetherflow',
  'Sacred Soil',
  'Indomitability',
  'Excogitation',
  'Deployment Tactics',
  'Chain Stratagem',
  'Recitation',
  'Swiftcast',
  'Lucid Dreaming',

  // Pet
  'Dissipation',
  'Whispering Dawn',
  'Fey Illumination',
  'Fey Blessing',
  'Summon Seraph',

  // GCD
  'Bio', 'Bio II', 'Biolysis',
];

const schCastingList = [];

const schStatusList = [
  'Bio', 'Bio II', 'Biolysis',
  'Galvanize', 'Catalyze',
];

function schOnJobChange() {

  previous.artofwar = 0;

  if (player.level >= 72) {
    icon.bio = icon.biolysis;
  }
  else if (player.level >= 26) {
    icon.bio = icon.bio2;
  }
  else {
    icon.bio = "000503";
  }

  // Show available cooldowns

  if (player.level >= 20) {
    addCountdown({ name: 'whisperingdawn' });
  }

  if (player.level >= 40) {
    addCountdown({ name: 'feyillumination' });
  }

  if (player.level >= 45) {
    addCountdown({ name: 'aetherflow', onComplete: 'addAction' });
  }

  if (player.level >= 50) {
    addCountdown({ name: 'sacredsoil' });
  }

  if (player.level >= 52) {
    addCountdown({ name: 'indomitability' });
  }

  if (player.level >= 56) {
    addCountdown({ name: 'deploymenttactics' });
  }

  if (player.level >= 60) {
    addCountdown({ name: 'dissipation' });
  }

  if (player.level >= 62) {
    addCountdown({ name: 'excogitation' });
  }

  if (player.level >= 66) {
    addCountdown({ name: 'chainstratagem', onComplete: 'addAction' });
  }

  if (player.level >= 74) {
    addCountdown({ name: 'recitation' });
  }

  if (player.level >= 76) {
    addCountdown({ name: 'feyblessing' });
  }

  if (player.level >= 80) {
    addCountdown({ name: 'summonseraph' });
  }
}

// Copied from BRD mostly...
function schOnTargetChangedEvent() {
  if (previous.targetID != target.ID) {

    // If not a target then clear things out
    if (target.ID === 0 || target.ID.startsWith("1") || target.ID.startsWith('E')) {  // 0 = no target, 1... = player? E... = non-combat NPC?
      removeAction({ name: 'bio' });
      removeCountdown({ name: 'bio' });
    }
    else {
      removeAction({ name: 'bio' });
      addCountdown({ name: 'bio', time: checkStatus({ name: 'bio', id: target.ID }), onComplete: 'addAction' });
    }
    previous.targetID = target.ID;
  }
}


function schOnAction(actionMatch) {

  // Set up icon changes from combat here

  if (['Bio', 'Bio II', 'Biolysis'].indexOf(actionMatch.groups.actionName) > -1) {
    removeAction({ name: 'bio' });
    addStatus('bio', 30000, actionMatch.groups.targetID);
  } else if (actionMatch.groups.actionName === 'Whispering Dawn') {
    addRecast({ name: 'whisperingdawn' });
    addCountdown({ name: 'whisperingdawn' });
  } else if (actionMatch.groups.actionName === 'Fey Illumination') {
    addRecast({ name: 'feyillumination' });
    addCountdown({ name: 'feyillumination' });
  } else if (actionMatch.groups.actionName === 'Aetherflow') {
    removeAction({ name: 'aetherflow' });
    addRecast({ name: 'aetherflow' });
    addCountdown({ name: 'aetherflow', onComplete: 'addAction' });
  } else if (actionMatch.groups.actionName === 'Sacred Soil') {
    addRecast({ name: 'sacredsoil' });
    addCountdown({ name: 'sacredsoil' });
  } else if (actionMatch.groups.actionName === 'Indomitability') {
    addRecast({ name: 'indomitability' });
    addCountdown({ name: 'indomitability' });
  } else if (actionMatch.groups.actionName === 'Excogitation') {
    addRecast({ name: 'excogitation' });
    addCountdown({ name: 'excogitation' });
  } else if (actionMatch.groups.actionName === 'Deployment Tactics') {
    addRecast({ name: 'deploymenttactics' });
    addCountdown({ name: 'deploymenttactics' });
  } else if (actionMatch.groups.actionName === 'Dissipation') {
    addRecast({ name: 'dissipation' });
    addCountdown({ name: 'dissipation' });
  } else if (actionMatch.groups.actionName === 'Chain Stratagem') {
    addRecast({ name: 'chainstratagem' });
    addCountdown({ name: 'chainstratagem', onComplete: 'addAction' });
  } else if (actionMatch.groups.actionName === 'Recitation') {
    addRecast({ name: 'recitation' });
    addCountdown({ name: 'recitation' });
  } else if (actionMatch.groups.actionName === 'Summon Seraph') {
    addRecast({ name: 'summonseraph' });
    addCountdown({ name: 'summonseraph' });
  }
}

const schOnStatus = (statusMatch) => {
  if (['Bio', 'Bio II', 'Biolysis'].indexOf(statusMatch.groups.effectName) > -1) {
    if (statusMatch.groups.gainsLoses === 'gains') {
      addStatus({ name: 'bio', time: parseFloat(statusMatch.groups.effectDuration) * 1000, id: statusMatch.groups.targetID });

      // Might be possible to switch targets between application to target and log entry
      if (target.ID === statusMatch.groups.targetID) {
        addCountdown({ name: 'bio', time: checkStatus({ name: 'bio', id: target.ID }), onComplete: 'addAction' });
      }
    } else if (statusMatch.groups.gainsLoses === 'loses') {
      removeStatus({ name: 'bio', id: statusMatch.groups.targetID });
    }
  }
};
