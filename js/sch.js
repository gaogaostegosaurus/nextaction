"use strict";

actionList.sch = [

  // Off-GCD
  "Aetherflow",
  "Sacred Soil",
  "Indomitability",
  "Excogitation",
  "Deployment Tactics",
  "Chain Stratagem",
  "Recitation",
  "Swiftcast",
  "Lucid Dreaming",

  // Pet
  "Dissipation",
  "Whispering Dawn",
  "Fey Illumination",
  "Fey Blessing",
  "Summon Seraph",

  // GCD
  "Bio", "Bio II", "Biolysis"
];

function schJobChange() {

  nextid.bio = 0;
  nextid.aetherflow = 10;
  nextid.chainstratagem = 11;

  // Column 1
  countdownid.bio = 0;
  countdownid.aetherflow = 1;
  countdownid.excogitation = 2;
  countdownid.indomitability = 3;
  countdownid.sacredsoil = 4;
  countdownid.recitation = 5;
  countdownid.deploymenttactics = 6;
  countdownid.swiftcast = 8;
  countdownid.luciddreaming = 9;


  // Column 2
  countdownid.dissipation = 10;
  countdownid.summonseraph = 11;
  countdownid.whisperingdawn = 12;
  countdownid.feyblessing = 13;
  countdownid.feyillumination = 14;
  countdownid.chainstratagem = 19;

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
    addCountdownBar({name: "whisperingdawn", time: -1});
  }

  if (player.level >= 40) {
    addCountdownBar({name: "feyillumination", time: -1});
  }

  if (player.level >= 45) {
    addCountdownBar({name: "aetherflow", time: -1, oncomplete: "addIcon"});
  }

  if (player.level >= 50) {
    addCountdownBar({name: "sacredsoil", time: -1});
  }

  if (player.level >= 52) {
    addCountdownBar({name: "indomitability", time: -1});
  }

  if (player.level >= 56) {
    addCountdownBar({name: "deploymenttactics", time: -1});
  }

  if (player.level >= 60) {
    addCountdownBar({name: "dissipation", time: -1});
  }

  if (player.level >= 62) {
    addCountdownBar({name: "excogitation", time: -1});
  }

  if (player.level >= 66) {
    addCountdownBar({name: "chainstratagem", time: checkRecast("chainstratagem"), oncomplete: "addIcon"});
  }

  if (player.level >= 74) {
    addCountdownBar({name: "recitation", time: -1});
  }

  if (player.level >= 76) {
    addCountdownBar({name: "feyblessing", time: -1});
  }

  if (player.level >= 80) {
    addCountdownBar({name: "summonseraph", time: -1});
  }
}

// Copied from BRD mostly...
function schTargetChangedEvent() {
  if (previous.targetID != target.ID) {

    // If not a target then clear things out
    if (target.ID == 0 || target.ID.startsWith("1") || target.ID.startsWith("E")) {  // 0 = no target, 1... = player? E... = non-combat NPC?
      removeCountdownBar("bio");
    }
    else {
      addCountdownBar({name: "bio", time: checkStatus("bio", target.ID), oncomplete: "addIcon"});
    }
    previous.targetID = target.ID;
  }
}


function schAction() {

  // Set up icon changes from combat here

  if (actionList.sch.indexOf(actionLog.groups.actionName) > -1) {

    if (["Bio", "Bio II", "Biolysis"].indexOf(actionLog.groups.actionName) > -1) {
      removeIcon("bio");
      addStatus("bio", 30000, actionLog.groups.targetID);
    }

    else if ("Whispering Dawn" == actionLog.groups.actionName) {
      addCountdownBar({name: "whisperingdawn"});
    }

    else if ("Fey Illumination" == actionLog.groups.actionName) {
      addCountdownBar({name: "feyillumination"});
    }

    else if ("Aetherflow" == actionLog.groups.actionName) {
      removeIcon("aetherflow");
      addCountdownBar({name: "aetherflow", time: recast.aetherflow, oncomplete: "addIcon"});
    }

    else if ("Sacred Soil" == actionLog.groups.actionName) {
      addCountdownBar({name: "sacredsoil"});
    }

    else if ("Indomitability" == actionLog.groups.actionName) {
      addCountdownBar({name: "indomitability"});
    }

    else if ("Excogitation" == actionLog.groups.actionName) {
      addCountdownBar({name: "excogitation"});
    }

    else if ("Deployment Tactics" == actionLog.groups.actionName) {
      addCountdownBar({name: "deploymenttactics"});
    }

    else if ("Dissipation" == actionLog.groups.actionName) {
      addCountdownBar({name: "dissipation"});
    }

    else if ("Chain Stratagem" == actionLog.groups.actionName) {
      addCountdownBar({name: "chainstratagem", time: recast.chainstratagem, oncomplete: "addIcon"});
    }

    else if ("Recitation" == actionLog.groups.actionName) {
      addCountdownBar({name: "recitation"});
    }

    else if ("Summon Seraph" == actionLog.groups.actionName) {
      addCountdownBar({name: "summonseraph"});
    }
  }
}

function schStatus() {

  if (["Bio", "Bio II", "Biolysis"].indexOf(effectLog.groups.effectName) > -1) {
    if (effectLog.groups.gainsLoses == "gains") {
      addStatus("bio", parseInt(effectLog.groups.effectDuration) * 1000, effectLog.groups.targetID);
      if (target.ID == effectLog.groups.targetID) {  // Might be possible to switch targets between application to target and log entry
        addCountdownBar({name: "bio", time: checkStatus("bio", target.ID), oncomplete: "addIcon"});
      }
    }
    else if (effectLog.groups.gainsLoses == "loses") {
      removeStatus("bio", effectLog.groups.targetID);
    }
  }
}
