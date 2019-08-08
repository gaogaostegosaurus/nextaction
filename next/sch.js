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

  nextid.aetherflow = 0;
  nextid.bio = 1;

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
    addCountdownBar("aetherflow", -1, "icon");
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
    addCountdownBar("chainstratagem", -1);
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
      addCountdownBar("bio", checkStatus("bio", target.ID), "icon");
    }
    previous.targetID = target.ID;
  }
}


function schAction() {

  // Set up icon changes from combat here

  if (actionList.sch.indexOf(actionGroups.actionname) > -1) {

    if (["Bio", "Bio II", "Biolysis"].indexOf(actionGroups.actionname) > -1) {
      removeIcon("bio");
      addStatus("bio", 30000, actionGroups.targetID);
    }

    else if ("Whispering Dawn" == actionGroups.actionname) {
      addCountdownBar("whisperingdawn");
    }

    else if ("Fey Illumination" == actionGroups.actionname) {
      addCountdownBar("feyillumination");
    }

    else if ("Aetherflow" == actionGroups.actionname) {
      removeIcon("aetherflow");
      addCountdownBar("aetherflow", recast.aetherflow, "icon");
    }

    else if ("Sacred Soil" == actionGroups.actionname) {
      addCountdownBar("sacredsoil");
    }

    else if ("Indomitability" == actionGroups.actionname) {
      addCountdownBar("indomitability");
    }

    else if ("Excogitation" == actionGroups.actionname) {
      addCountdownBar("excogitation");
    }

    else if ("Deployment Tactics" == actionGroups.actionname) {
      addCountdownBar("deploymenttactics");
    }

    else if ("Dissipation" == actionGroups.actionname) {
      addCountdownBar("dissipation");
    }

    else if ("Chain Stratagem" == actionGroups.actionname) {
      addCountdownBar("chainstratagem");
    }

    else if ("Recitation" == actionGroups.actionname) {
      addCountdownBar("recitation");
    }

    else if ("Summon Seraph" == actionGroups.actionname) {
      addCountdownBar("summonseraph");
    }
  }
}

function schStatus() {

  if (["Bio", "Bio II", "Biolysis"].indexOf(statusGroups.statusname) > -1) {
    if (statusGroups.gainsloses == "gains") {
      addStatus("bio", parseInt(statusGroups.duration) * 1000, statusGroups.targetID);
      if (target.ID == statusGroups.targetID) {  // Might be possible to switch targets between application to target and log entry
        addCountdownBar("bio", checkStatus("bio", target.ID), "icon");
      }
    }
    else if (statusGroups.gainsloses == "loses") {
      removeStatus("bio", statusGroups.targetID);
    }
  }
}
