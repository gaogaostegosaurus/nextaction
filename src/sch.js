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
  'Bio', 'Bio II', 'Biolysis'
];

function schJobChange() {

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
    addCountdown({name: 'whisperingdawn', time: -1});
  }

  if (player.level >= 40) {
    addCountdown({name: 'feyillumination', time: -1});
  }

  if (player.level >= 45) {
    addCountdown({name: 'aetherflow', time: -1, oncomplete: 'addIcon'});
  }

  if (player.level >= 50) {
    addCountdown({name: 'sacredsoil', time: -1});
  }

  if (player.level >= 52) {
    addCountdown({name: 'indomitability', time: -1});
  }

  if (player.level >= 56) {
    addCountdown({name: 'deploymenttactics', time: -1});
  }

  if (player.level >= 60) {
    addCountdown({name: 'dissipation', time: -1});
  }

  if (player.level >= 62) {
    addCountdown({name: 'excogitation', time: -1});
  }

  if (player.level >= 66) {
    addCountdown({name: 'chainstratagem', time: checkRecast('chainstratagem'), oncomplete: 'addIcon'});
  }

  if (player.level >= 74) {
    addCountdown({name: 'recitation', time: -1});
  }

  if (player.level >= 76) {
    addCountdown({name: 'feyblessing', time: -1});
  }

  if (player.level >= 80) {
    addCountdown({name: 'summonseraph', time: -1});
  }
}

// Copied from BRD mostly...
function schTargetChangedEvent() {
  if (previous.targetID != target.ID) {

    // If not a target then clear things out
    if (target.ID == 0 || target.ID.startsWith("1") || target.ID.startsWith('E')) {  // 0 = no target, 1... = player? E... = non-combat NPC?
      removeCountdownBar('bio');
    }
    else {
      addCountdown({name: 'bio', time: checkStatus('bio', target.ID), oncomplete: 'addIcon'});
    }
    previous.targetID = target.ID;
  }
}


function schAction() {

  // Set up icon changes from combat here

  if (actionList.sch.indexOf(actionLog.groups.actionName) > -1) {

    if (['Bio', 'Bio II', 'Biolysis'].indexOf(actionLog.groups.actionName) > -1) {
      removeIcon('bio');
      addStatus('bio', 30000, actionLog.groups.targetID);
    }

    else if ('Whispering Dawn' == actionLog.groups.actionName) {
      addCountdown({name: 'whisperingdawn'});
    }

    else if ('Fey Illumination' == actionLog.groups.actionName) {
      addCountdown({name: 'feyillumination'});
    }

    else if ('Aetherflow' == actionLog.groups.actionName) {
      removeIcon('aetherflow');
      addCountdown({name: 'aetherflow', time: recast.aetherflow, oncomplete: 'addIcon'});
    }

    else if ('Sacred Soil' == actionLog.groups.actionName) {
      addCountdown({name: 'sacredsoil'});
    }

    else if ('Indomitability' == actionLog.groups.actionName) {
      addCountdown({name: 'indomitability'});
    }

    else if ('Excogitation' == actionLog.groups.actionName) {
      addCountdown({name: 'excogitation'});
    }

    else if ('Deployment Tactics' == actionLog.groups.actionName) {
      addCountdown({name: 'deploymenttactics'});
    }

    else if ('Dissipation' == actionLog.groups.actionName) {
      addCountdown({name: 'dissipation'});
    }

    else if ('Chain Stratagem' == actionLog.groups.actionName) {
      addCountdown({name: 'chainstratagem', time: recast.chainstratagem, oncomplete: 'addIcon'});
    }

    else if ('Recitation' == actionLog.groups.actionName) {
      addCountdown({name: 'recitation'});
    }

    else if ('Summon Seraph' == actionLog.groups.actionName) {
      addCountdown({name: 'summonseraph'});
    }
  }
}

function schStatus() {

  if (['Bio', 'Bio II', 'Biolysis'].indexOf(effectLog.groups.effectName) > -1) {
    if (effectLog.groups.gainsLoses == 'gains') {
      addStatus('bio', parseInt(effectLog.groups.effectDuration) * 1000, effectLog.groups.targetID);
      if (target.ID == effectLog.groups.targetID) {  // Might be possible to switch targets between application to target and log entry
        addCountdown({name: 'bio', time: checkStatus('bio', target.ID), oncomplete: 'addIcon'});
      }
    }
    else if (effectLog.groups.gainsLoses == 'loses') {
      removeStatus('bio', effectLog.groups.targetID);
    }
  }
}
