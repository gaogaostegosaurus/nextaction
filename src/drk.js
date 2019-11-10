"use strict";

// Define actions to watch for

const drkActionList = [

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

  countdownid.delirium = 0;

  previous.unleash = 0;
  previous.stalwartsoul = 0;
  previous.floodofdarkness = 0;
  previous.quietus = 0;
  previous.abyssaldrain = 0;

    if (player.level >= 68) {
      addCountdownBar({name: "delirium", time: checkRecast("delirium"), oncomplete: "addIcon"});
    }
  drkCombo();
  drkGauge();


}

function drkPlayerChangedEvent() {
  drkMP(); // Also handles Dark Arts and such
}

function drkAction() {

  if (actionList.drk.indexOf(actionLog.groups.actionName) > -1) {

    // These actions don't break combo

    if ("Delirium" == actionLog.groups.actionName) {
      removeIcon("delirium");
      addStatus("delirium");
      addRecast("delirium");
      addCountdownBar({name: "delirium", time: recast.delirium, oncomplete: "addIcon"});
      drkGauge();
    }

    else if (["Flood Of Darkness", "Edge Of Darkness", "Flood Of Shadow", "Edge Of Shadow"].indexOf(actionLog.groups.actionName) > -1) {
      removeIcon("floodofdarkness");
      addRecast("floodofdarkness");
      drkMP();
    }

    else if ("Blood Weapon" == actionLog.groups.actionName) {
      removeIcon("bloodweapon");
      addRecast("bloodweapon");
      addIconBlinkTimeout("bloodweapon", recast.bloodweapon, nextid.bloodweapon, icon.bloodweapon);
    }

    else if ("Salted Earth" == actionLog.groups.actionName) {
      removeIcon("saltedearth");
      addRecast("carveandspit");
      addIconBlinkTimeout("carveandspit", recast.saltedearth, nextid.saltedearth, icon.saltedearth);
    }

    else if ("Abyssal Drain" == actionLog.groups.actionName) {
      if (Date.now() - previous.abyssaldrain > 1000) {
        previous.abyssaldrain = Date.now();
        count.targets = 1;
      }
      else {
        count.targets = count.targets + 1;
      }
      //removeIcon("abyssaldrain");
      //addRecast("abyssaldrain");
      //addIconBlinkTimeout("abyssaldrain", recast.abyssaldrain, nextid.abyssaldrain, icon.abyssaldrain);
    }

    else if ("Carve And Spit" == actionLog.groups.actionName) {
      removeIcon("carveandspit");
      addRecast("carveandspit");
      addIconBlinkTimeout("carveandspit", recast.carveandspit, nextid.carveandspit, icon.carveandspit);
    }

    else if ("Plunge" == actionLog.groups.actionName) { // Code treats Infuriate like two different skills to juggle the charges.
      if (player.level >= 78) {
        if (checkRecast("plunge2", player.ID) < 0) {
          addRecast("plunge1", player.ID, -1);
          addRecast("plunge2");
        }
        else {
          removeIcon("plunge");
          addRecast("plunge1", player.ID, checkRecast("plunge2", player.ID));
          addRecast("plunge2", player.ID, checkRecast("plunge2", player.ID) + recast.plunge);
          addIconBlinkTimeout("plunge", checkRecast("plunge1", player.ID), nextid.plunge, icon.plunge);
        }
      }
      else {
        addRecast("plunge");
        addIconBlinkTimeout("plunge", recast.plunge, nextid.plunge, icon.plunge);
      }
    }

    else if ("The Blackest Night" == actionLog.groups.actionName) {
      addRecast("theblackestnight");
      removeIcon("theblackestnight");
    }

    else if ("Shadow Wall" == actionLog.groups.actionName) {
      addRecast("shadowwall");
      removeIcon("shadowwall");
    }

    else if ("Rampart" == actionLog.groups.actionName) {
      addRecast("rampart");
      removeIcon("rampart");
    }

    else { // GCD actions

      if ("Bloodspiller" == actionLog.groups.actionName) {
        removeIcon("bloodspiller");
      }

      else if ("Quietus" == actionLog.groups.actionName) {
        if (Date.now() - previous.quietus > 1000) {
          previous.quietus = Date.now();
          count.targets = 1;
        }
        else {
          count.targets = count.targets + 1;
        }
        removeIcon("quietus");
      }

      // These actions affect combo

      else if ("Hard Slash" == actionLog.groups.actionName
      && actionLog.groups.result.length >= 2) {
        count.targets = 1;
        if (next.combo != 1) {
          drkSouleaterCombo();
          toggle.combo = Date.now();
        }
        removeIcon("hardslash");
        drkComboTimeout();
      }

      else if ("Syphon Strike" == actionLog.groups.actionName
      && actionLog.groups.result.length >= 8) {
        if (player.level < 26) {
          drkCombo();
        }
        else {
          removeIcon("hardslash");
          removeIcon("syphonstrike");
          drkComboTimeout();
        }
      }

      else if ("Souleater" == actionLog.groups.actionName
      && actionLog.groups.result.length >= 8) {
        drkCombo();
      }

      else if ("Unleash" == actionLog.groups.actionName
      && actionLog.groups.result.length >= 2) {

        if (Date.now() - previous.unleash > 1000) {
          previous.unleash = Date.now();
          count.targets = 1;
          removeIcon("unleash");

          if (next.combo != 2) {
            drkStalwartSoulCombo();
          }

          if (player.level < 72) {
            drkCombo();
          }
          else {
            toggle.combo = Date.now();
            drkComboTimeout();
          }
        }
        else {
          count.targets = count.targets + 1;
        }
      }

      else if ("Stalwart Soul" == actionLog.groups.actionName
      && actionLog.groups.result.length >= 8) {
        if (Date.now() - previous.stalwartsoul > 1000) {
          previous.stalwartsoul = Date.now();
          count.targets = 1;
          drkCombo();
        }
        else {
          count.targets = count.targets + 1;
        }
      }

      else {
        drkCombo();
      }

      if (count.targets >= 3
      && checkStatus("mitigation", effectLog.groups.targetID) < 1000) {
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

  if (effectLog.groups.targetID == player.ID) { // Target is self

    if ("Delirium" == effectLog.groups.effectName) {
      if (effectLog.groups.gainsLoses == "gains") {
        addStatus("delirium", parseInt(effectLog.groups.effectDuration) * 1000, effectLog.groups.targetID);
      }
      else if (effectLog.groups.gainsLoses == "loses") {
        removeStatus("delirium");
      }
    }

    else if ("Rampart" == effectLog.groups.effectName) {
      if (effectLog.groups.gainsLoses == "gains") {
        if (checkStatus("mitigation", effectLog.groups.targetID) < parseInt(effectLog.groups.effectDuration) * 1000) {
          addStatus("mitigation", parseInt(effectLog.groups.effectDuration) * 1000, effectLog.groups.targetID);
        }
      }
      else if (effectLog.groups.gainsLoses == "loses") {
        if (checkStatus("mitigation", effectLog.groups.targetID) < 0 // Check for overlaps
        && count.targets >= 3) {
          drkMitigation();
        }
      }
    }

    else if ("Dark Wall" == effectLog.groups.effectName) {
      if (effectLog.groups.gainsLoses == "gains") {
        if (checkStatus("mitigation", effectLog.groups.targetID) < parseInt(effectLog.groups.effectDuration) * 1000) {
          addStatus("mitigation", parseInt(effectLog.groups.effectDuration) * 1000, effectLog.groups.targetID);
        }
      }
      else if (effectLog.groups.gainsLoses == "loses") {
        if (checkStatus("mitigation", effectLog.groups.targetID) < 0
        && count.targets >= 3) {
          drkMitigation();
        }
      }
    }
  }
}


function drkMitigation() {

  // Shows next mitigation cooldown

  if (player.level >= 38) {
    if (checkRecast("darkwall") <= checkRecast("rampart")) {
      addIconBlinkTimeout("darkwall",checkRecast("darkwall"),nextid.mitigation,icon.darkwall);
    }
    else if (checkRecast("rampart") <= checkRecast("darkwall")) {
      addIconBlinkTimeout("mitigation",checkRecast("rampart"),nextid.mitigation,icon.rampart);
    }
  }

  else {
    addIconBlinkTimeout("mitigation",checkRecast("rampart"),nextid.mitigation,icon.rampart);
  }
}

function drkMP() {

  player.tempjobDetail.darkarts = player.debugJobSplit[4]; // 0 or 1

  if (player.level >= 74) {
    if (count.targets >= 2) {
      icon.floodofdarkness = icon.floodofshadow;
    }
    else {
      icon.floodofdarkness = icon.edgeofshadow;
    }
  }
  else if (player.level >= 40
  && count.targets == 1) {
    icon.floodofdarkness = icon.edgeofdarkness;
  }
  else {
    icon.floodofdarkness = "003082";
  }

  if (player.level >= 70) {
    if (player.currentMP >= 6000
    || player.tempjobDetail.darkarts == 1) {
      addIcon({name: "floodofdarkness"});
    }
    else {
      removeIcon("floodofdarkness");
    }
  }
  else if (player.level >= 30) { // No TBN yet
    if (player.currentMP >= 3000) {
      addIcon({name: "floodofdarkness"});
    }
    else {
      removeIcon("floodofdarkness");
    }
  }
}

function drkGauge() {

  let targetblood = 50; // Use spender at or above this number

  if (player.level >= 64
  && count.targets >= 3) {
    icon.gaugespender = icon.quietus;
  }
  else {
    icon.gaugespender = icon.bloodspiller;
  }

  if (checkStatus("delirium", player.ID) > 0) {
    targetblood = 0;
  }
  else if (player.level >= 80
  && checkRecast("livingshadow") < 20000) { // Is this enough?
    targetblood = 100; // Try to have a buffer for Living Shadow
  }

  if (player.jobDetail.blood >= targetblood) {
    if (player.level >= 80
    && checkRecast("livingshadow") < 1000) {
      addIcon({name: "gaugespender"});
    }
    else if (player.level >= 62) {
      addIcon({name: "gaugespender"});
    }
  }
  else {
    removeIcon("gaugespender");
  }
}

function drkCombo() {

  delete toggle.combo;
  delete next.combo;

  removeIcon("hardslash");
  removeIcon("syphonstrike");
  removeIcon("souleater");

  if (count.targets >= 2) {
    drkStalwartSoulCombo();
  }
  else {
    drkSouleaterCombo();
  }
}

function drkSouleaterCombo() {
  next.combo = 1;
  addIcon({name: "hardslash"});
  addIcon({name: "syphonstrike"});
  if (player.level >= 26) {
    addIcon({name: "souleater"});
  }
}

function drkStalwartSoulCombo() {
  next.combo = 2;
  addIcon({name: "unleash"});
  if (player.level >= 74) {
    addIcon({name: "stalwartsoul"});
  }
}

function drkComboTimeout() {
  clearTimeout(timeout.combo);
  timeout.combo = setTimeout(drkCombo, 12500);
}
