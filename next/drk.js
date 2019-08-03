"use strict";

// Define actions to watch for

actionList.drk = [

  // Role actions
  "Rampart", "Arm\'s Length",

  // AoE actions
  "Unleash", "Stalwart Soul", "Flood Of Darkness", "Flood Of Shadow", "Quietus", "Abyssal Drain",
  // Unleash, Stalwart Soul: 2 or more
  // Flood: 2 or more (after level 40)
  // Quietus: 3 or more
  // Abyssal Drain: /shrug

  // Single target actions
  "Hard Slash", "Syphon Strike", "Souleater", "Edge Of Darkness", "Edge Of Shadow", "Bloodspiller",
  // Souleater combo: 1
  // Edge: 1
  // Bloodspiller: 1-2

  // Everything else
  "Unmend",
  "Blood Weapon", "Plunge", "Carve And Spit", "Delirium", "Living Shadow",
  "Shadow Wall", "Dark Mind", "The Blackest Night"
];


function drkJobChange() {

  console.log("Loading initial values");

  nextid.mitigation = 0;
  nextid.rampart = nextid.mitigation;
  nextid.shadowwall = nextid.mitigation;
  nextid.theblackestnight = 1;
  nextid.gaugespender = 2;
  nextid.bloodspiller = nextid.gaugespender;
  nextid.quietus = nextid.gaugespender;
  nextid.livingshadow = nextid.gaugespender;
  nextid.hardslash = 3;
  nextid.unleash = nextid.hardslash;
  nextid.syphonstrike = 4;
  nextid.souleater = 5;
  nextid.stalwartsoul = nextid.souleater;
  nextid.floodofdarkness = 10;
  nextid.edgeofdarkness = nextid.floodofdarkness;
  nextid.delirium = 11;
  nextid.bloodweapon = 12;
  nextid.carveandspit = 13;
  nextid.plunge = 14;

  previous.unleash = 0;
  previous.stalwartsoul = 0;
  previous.floodofdarkness = 0;
  previous.quietus = 0;
  previous.abyssaldrain = 0;

  drkCombo();
  drkGauge();

}

function drkPlayerChangedEvent() {
  drkMP(); // Also handles Dark Arts and such
}

function drkAction() {

  if (actionList.drk.indexOf(actionGroups.actionname) > -1) {

    removeText("loadmessage");

    // These actions don't break combo

    if ("Delirium" == actionGroups.actionname) {
      removeIcon("delirium");
      addStatus("delirium", duration.delirium, actionGroups.targetID);
      addRecast("delirium");
      addIconBlinkTimeout("delirium", recast.delirium, nextid.delirium, icon.delirium);
      drkGauge();
    }

    else if (["Flood Of Darkness", "Edge Of Darkness", "Flood Of Shadow", "Edge Of Shadow"].indexOf(actionGroups.actionname) > -1) {
      removeIcon("floodofdarkness");
      addRecast("floodofdarkness");
      drkMP();
    }

    else if ("Blood Weapon" == actionGroups.actionname) {
      removeIcon("bloodweapon");
      addRecast("bloodweapon");
      addIconBlinkTimeout("bloodweapon", recast.bloodweapon, nextid.bloodweapon, icon.bloodweapon);
    }

    else if ("Salted Earth" == actionGroups.actionname) {
      removeIcon("saltedearth");
      addRecast("carveandspit");
      addIconBlinkTimeout("carveandspit", recast.saltedearth, nextid.saltedearth, icon.saltedearth);
    }

    else if ("Abyssal Drain" == actionGroups.actionname) {
      if (Date.now() - previous.abyssaldrain > 1000) {
        previous.abyssaldrain = Date.now();
        count.aoe = 1;
      }
      else {
        count.aoe = count.aoe + 1;
      }
      removeIcon("abyssaldrain");
      addRecast("abyssaldrain");
      addIconBlinkTimeout("abyssaldrain", recast.abyssaldrain, nextid.abyssaldrain, icon.abyssaldrain);
    }

    else if ("Carve And Spit" == actionGroups.actionname) {
      removeIcon("carveandspit");
      addRecast("carveandspit");
      addIconBlinkTimeout("carveandspit", recast.carveandspit, nextid.carveandspit, icon.carveandspit);
    }

    else if ("Plunge" == actionGroups.actionname) { // Code treats Infuriate like two different skills to juggle the charges.
      if (player.level >= 78) {
        if (checkCooldown("plunge2", player.ID) < 0) {
          addRecast("plunge1", player.ID, -1);
          addRecast("plunge2", player.ID, recast.plunge);
        }
        else {
          removeIcon("plunge");
          addRecast("plunge1", player.ID, checkCooldown("plunge2", player.ID));
          addRecast("plunge2", player.ID, checkCooldown("plunge2", player.ID) + recast.plunge);
          addIconBlinkTimeout("plunge", checkCooldown("plunge1", player.ID), nextid.plunge, icon.plunge);
        }
      }
      else {
        addRecast("plunge");
        addIconBlinkTimeout("plunge", recast.plunge, nextid.plunge, icon.plunge);
      }
    }

    else if ("The Blackest Night" == actionGroups.actionname) {
      addRecast("theblackestnight");
      removeIcon("theblackestnight");
    }

    else if ("Shadow Wall" == actionGroups.actionname) {
      addRecast("shadowwall");
      removeIcon("shadowwall");
    }

    else if ("Rampart" == actionGroups.actionname) {
      addRecast("rampart");
      removeIcon("rampart");
    }

    else { // GCD actions

      if ("Bloodspiller" == actionGroups.actionname) {
        removeIcon("bloodspiller");
      }

      else if ("Quietus" == actionGroups.actionname) {
        if (Date.now() - previous.quietus > 1000) {
          previous.quietus = Date.now();
          count.aoe = 1;
        }
        else {
          count.aoe = count.aoe + 1;
        }
        removeIcon("quietus");
      }

      // These actions affect combo

      else if ("Hard Slash" == actionGroups.actionname
      && actionGroups.result.length >= 2) {
        count.aoe = 1;
        if (next.combo != 1) {
          drkCombo();
          toggle.combo = Date.now();
        }
        removeIcon("hardslash");
        drkComboTimeout();
      }

      else if ("Syphon Strike" == actionGroups.actionname
      && actionGroups.result.length >= 8) {
        removeIcon("hardslash");
        removeIcon("syphonstrike");
        drkComboTimeout();
      }

      else if ("Souleater" == actionGroups.actionname
      && actionGroups.result.length >= 8) {
        drkCombo();
      }

      else if ("Unleash" == actionGroups.actionname
      && actionGroups.result.length >= 2) {
        if (Date.now() - previous.unleash > 1000) {
          previous.unleash = Date.now();
          count.aoe = 1;
        }
        else {
          count.aoe = count.aoe + 1;
        }
        if (next.combo != 2) {
          stalwartsoulCombo();
          toggle.combo = Date.now();
        }
        removeIcon("overpower");
        if (player.level >= 74) {
          drkComboTimeout();
        }
        else {
          drkCombo();
        }
      }

      else if ("Stalwart Soul" == actionGroups.actionname
      && actionGroups.result.length >= 8) {
        if (Date.now() - previous.stalwartsoul > 1000) {
          previous.stalwartsoul = Date.now();
          count.aoe = 1;
        }
        else {
          count.aoe = count.aoe + 1;
        }
        drkCombo();
      }

      else {
        drkCombo();
      }

      if (count.aoe >= 3
      && checkStatus("mitigation", statusGroups.targetID) < 1000) {
        drkMitigation();
      }
      else {
        removeIcon("rampart");
      }

      drkMP(); // Check MP after all GCD actions
      drkGauge(); // Check gauge after all GCD actions
    }
  }
}

function drkStatus() {

  if (statusGroups.targetID == player.ID) { // Target is self

    if ("Delirium" == statusGroups.statusname) {
      if (statusGroups.gainsloses == "gains") {
        addStatus("delirium", parseInt(statusGroups.duration) * 1000, statusGroups.targetID);
      }
      else if (statusGroups.gainsloses == "loses") {
        removeStatus("berserk", statusGroups.targetID);
      }
    }

    else if ("Rampart" == statusGroups.statusname) {
      if (statusGroups.gainsloses == "gains") {
        if (checkStatus("mitigation", statusGroups.targetID) < parseInt(statusGroups.duration) * 1000) {
          addStatus("mitigation", parseInt(statusGroups.duration) * 1000, statusGroups.targetID);
        }
      }
      else if (statusGroups.gainsloses == "loses") {
        if (checkStatus("mitigation", statusGroups.targetID) < 0 // Check for overlaps
        && count.aoe >= 3) {
          drkMitigation();
        }
      }
    }

    else if ("Dark Wall" == statusGroups.statusname) {
      if (statusGroups.gainsloses == "gains") {
        if (checkStatus("mitigation", statusGroups.targetID) < parseInt(statusGroups.duration) * 1000) {
          addStatus("mitigation", parseInt(statusGroups.duration) * 1000, statusGroups.targetID);
        }
      }
      else if (statusGroups.gainsloses == "loses") {
        if (checkStatus("mitigation", statusGroups.targetID) < 0
        && count.aoe >= 3) {
          drkMitigation();
        }
      }
    }
  }
}


function drkMitigation() {

  // Shows next mitigation cooldown

  if (player.level >= 38) {
    if (checkCooldown("darkwall") <= checkCooldown("rampart")) {
      addIconBlinkTimeout("darkwall",checkCooldown("darkwall"),nextid.mitigation,icon.darkwall);
    }
    else if (checkCooldown("rampart") <= checkCooldown("darkwall")) {
      addIconBlinkTimeout("mitigation",checkCooldown("rampart"),nextid.mitigation,icon.rampart);
    }
  }

  else {
    addIconBlinkTimeout("mitigation",checkCooldown("rampart"),nextid.mitigation,icon.rampart);
  }
}

function drkMP() {

  if (player.level >= 74) {
    if (count.aoe >= 2) {
      icon.floodofdarkness = icon.floodofshadow;
    }
    else {
      icon.floodofdarkness = icon.edgeofshadow;
    }
  }
  else if (player.level >= 40) {
    if (count.aoe == 1) {
      icon.floodofdarkness = icon.edgeofdarkness;
    }
    else {
      icon.floodofdarkness = "003082";
    }
  }
  else {
    icon.floodofdarkness = "003082";
  }

  player.jobDetail.darkarts = player.debugJobSplit[4]; // 0 or 1

  if (player.level >= 70) {
    if (player.currentMP >= 6000
    || player.jobDetail.darkarts == 1) {
      addIcon("floodofdarkness");
    }
    else {
      removeIcon("floodofdarkness");
    }
  }
  else if (player.level >= 30) { // No TBN yet
    if (player.currentMP >= 3000) {
      addIcon("floodofdarkness");
    }
    else {
      removeIcon("floodofdarkness");
    }
  }
}

function drkGauge() {

  let targetblood = 50; // Use spender at or above this number

  if (player.level >= 64
  && count.aoe >= 3) {
    icon.gaugespender = icon.quietus;
  }
  else if (player.level >= 62) {
    icon.gaugespender = icon.bloodspiller;
  }

  if (checkStatus("delirium", player.ID) > 0) {
    targetblood = 0;
  }
  else if (player.level >= 80
  && checkCooldown("livingshadow") < 20000) { // Is this enough?
    targetblood = 100; // Try to have a buffer for Living Shadow
  }

  if (player.jobDetail.blood >= targetblood) {
    if (player.level >= 80
    && checkCooldown("livingshadow") < 1000) {
      addIcon("gaugespender");
    }
    else if (player.level >= 62) {
      addIcon("gaugespender");
    }
  }
  else {
    removeIcon("gaugespender");
  }
}

function drkCombo() {

  delete toggle.combo;

  removeIcon("hardslash");
  removeIcon("syphonstrike");
  removeIcon("souleater");

  if (count.aoe >= 2) {
    addIcon("unleash");
    if (player.level >= 74) {
      addIcon("stalwartsoul");
    }
  }
  else {
    addIcon("hardslash");
    addIcon("syphonstrike");
    if (player.level >= 26) {
      addIcon("souleater");
    }
  }
}

function drkComboTimeout() {
  clearTimeout(timeout.combo);
  timeout.combo = setTimeout(drkCombo, 12500);
}
