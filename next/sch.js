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
    addCountdownBar("whisperingdawn", -1);
  }

  if (player.level >= 40) {
    addCountdownBar("feyillumination", -1);
  }

  if (player.level >= 45) {
    addCountdownBar("aetherflow", -1, "addIcon");
  }

  if (player.level >= 50) {
    addCountdownBar("sacredsoil", -1);
  }

  if (player.level >= 52) {
    addCountdownBar("indomitability", -1);
  }

  if (player.level >= 56) {
    addCountdownBar("deploymenttactics", -1);
  }

  if (player.level >= 60) {
    addCountdownBar("dissipation", -1);
  }

  if (player.level >= 62) {
    addCountdownBar("excogitation", -1);
  }

  if (player.level >= 66) {
    addCountdownBar("chainstratagem", checkRecast("chainstratagem"), "addIcon");
  }

  if (player.level >= 74) {
    addCountdownBar("recitation", -1);
  }

  if (player.level >= 76) {
    addCountdownBar("feyblessing", -1);
  }

  if (player.level >= 80) {
    addCountdownBar("summonseraph", -1);
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
      addCountdownBar("bio", checkStatus("bio", target.ID), "addIcon");
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
      addCountdownBar("whisperingdawn");
    }

    else if ("Fey Illumination" == actionLog.groups.actionName) {
      addCountdownBar("feyillumination");
    }

    else if ("Aetherflow" == actionLog.groups.actionName) {
      removeIcon("aetherflow");
      addCountdownBar("aetherflow", recast.aetherflow, "addIcon");
    }

    else if ("Sacred Soil" == actionLog.groups.actionName) {
      addCountdownBar("sacredsoil");
    }

    else if ("Indomitability" == actionLog.groups.actionName) {
      addCountdownBar("indomitability");
    }

    else if ("Excogitation" == actionLog.groups.actionName) {
      addCountdownBar("excogitation");
    }

    else if ("Deployment Tactics" == actionLog.groups.actionName) {
      addCountdownBar("deploymenttactics");
    }

    else if ("Dissipation" == actionLog.groups.actionName) {
      addCountdownBar("dissipation");
    }

    else if ("Chain Stratagem" == actionLog.groups.actionName) {
      addCountdownBar("chainstratagem", recast.chainstratagem, "addIcon");
    }

    else if ("Recitation" == actionLog.groups.actionName) {
      addCountdownBar("recitation");
    }

    else if ("Summon Seraph" == actionLog.groups.actionName) {
      addCountdownBar("summonseraph");
    }
  }
}

function schStatus() {

  if (["Bio", "Bio II", "Biolysis"].indexOf(effectLog.groups.effectName) > -1) {
    if (effectLog.groups.gainsLoses == "gains") {
      addStatus("bio", parseInt(effectLog.groups.effectDuration) * 1000, effectLog.groups.targetID);
      if (target.ID == effectLog.groups.targetID) {  // Might be possible to switch targets between application to target and log entry
        addCountdownBar("bio", checkStatus("bio", target.ID), "addIcon");
      }
    }
    else if (effectLog.groups.gainsLoses == "loses") {
      removeStatus("bio", effectLog.groups.targetID);
    }
  }
}
