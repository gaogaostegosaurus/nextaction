"use strict";

actionList.whm = [

  // oGCD actions
  "Presence Of Mind", "Benediction", "Asylum", "Assize", "Thin Air", "Tetragrammaton", "Divine Benison",


  // GCD actions
  "Aero", "Regen", "Aero II", "Dia", "Afflatus Misery",

  "Lucid Dreaming"

];

function whmJobChange() {

  // Set up UI
  nextid.freecure = 0;
  nextid.regen = 1;
  nextid.aero = 2;
  nextid.afflatusmisery = 3;
  nextid.luciddreaming = 10;
  nextid.thinair = nextid.luciddreaming;

  countdownid.regen = 0;
  countdownid.aero = 0;
  countdownid.assize = 1;
  countdownid.divinebenison = 2;
  countdownid.tetragrammaton = 3;
  countdownid.benediction = 4;
  countdownid.asylum = 5;
  countdownid.presenceofmind = 6;
  countdownid.thinair = 7;
  countdownid.swiftcast = 8;
  countdownid.plenaryindulgence = 10;
  countdownid.temperance = 11;

  // Set up icons
  if (player.level >= 72) {
    icon.aero = icon.dia;
  }
  else if (player.level >= 46) {
    icon.aero = icon.aero2;
  }
  else {
    icon.aero = "000401";
  }

  if (checkStatus("freecure") > 0) {
    addIcon("freecure");
  }
  else {
    removeIcon("freecure");
  }

  if (player.level >= 24
  && player.currentMP / player.maxMP < 0.8
  && checkRecast("luciddreaming") < 0) {
    addIcon("luciddreaming");
  }
  else {
    removeIcon("luciddreaming");
  }

  if (player.level >= 30) {
    addCountdownBar("presenceofmind", -1);
  }

  if (player.level >= 50) {
    addCountdownBar("benediction", -1);
  }

  if (player.level >= 52) {
    addCountdownBar("asylum", -1);
  }

  if (player.level >= 56) {
    addCountdownBar("assize", -1);
  }

  if (player.level >= 58) {
    addCountdownBar("thinair", -1);
  }

  if (player.level >= 60) {
    addCountdownBar("tetragrammaton", -1);
  }

  if (player.level >= 66) {
    addCountdownBar("divinebenison", -1);
  }

  if (player.level >= 70) {
    addCountdownBar("plenaryindulgence", -1);
  }

  if (player.level >= 80) {
    addCountdownBar("temperance", -1);
  }

  if (player.level >= 18) {
    addCountdownBar("swiftcast", -1);
  }
}

function whmPlayerChangedEvent() {

  // MP recovery - Lucid and Thin Air share same spot
  if (player.level >= 24
  && player.currentMP / player.maxMP < 0.8
  && checkRecast("luciddreaming") < 0) {
    addIcon("luciddreaming");
  }
  else {
    removeIcon("luciddreaming");
  }

  if (player.tempjobDetail.bloodlily >= 3) {
    addIcon("afflatusmisery");
  }
  else {
    removeIcon("afflatusmisery");
  }
}

function whmTargetChangedEvent() {

  if (previous.targetID != target.ID) {

    // 0 = no target, 1... = player? E... = non-combat NPC?
    if (target.ID.startsWith("1")
    && ["PLD", "WAR", "DRK", "GNB"].indexOf(target.job) > -1) {
      addCountdownBar("regen", checkStatus("regen", target.ID), "icon");
    }
    else if (target.ID.startsWith("4")) {
      addCountdownBar("aero", checkStatus("aero", target.ID), "icon");
    }
    else {
      removeCountdownBar("aero");
    }
    previous.targetID = target.ID;
  }
}

function whmAction() {

  if (actionList.whm.indexOf(actionGroups.actionname) > -1) {

    if (actionGroups.actionname == "Lucid Dreaming") {
      addRecast("luciddreaming");
      addCountdownBar("luciddreaming");
    }

    else if (actionGroups.actionname == "Presence Of Mind") {
      addRecast("presenceofmind");
      addCountdownBar("presenceofmind");
    }

    else if (actionGroups.actionname == "Benediction") {
      addRecast("benediction");
      addCountdownBar("benediction");
    }

    else if (actionGroups.actionname == "Asylum") {
      addRecast("asylum");
      addCountdownBar("asylum");
    }

    else if (actionGroups.actionname == "Assize") {
      addRecast("assize");
      addCountdownBar("assize");
    }

    else if (actionGroups.actionname == "Thin Air") {
      addRecast("thinair");
      addCountdownBar("thinair");
    }

    else if (actionGroups.actionname == "Tetragrammaton") {
      addRecast("tetragrammaton");
      addCountdownBar("tetragrammaton");
    }

    else if (actionGroups.actionname == "Divine Benison") {
      addRecast("divinebenison");
      addCountdownBar("divinebenison");
    }

    else if (actionGroups.actionname == "Regen") {
      removeIcon("regen");
      addCountdownBar("regen", checkStatus("regen", target.ID), "icon");
      addStatus("regen", duration.regen, actionGroups.targetID);
    }

    else if (["Aero", "Aero II", "Dia"].indexOf(actionGroups.actionname) > -1) {
      removeIcon("aero");
      if (player.level >= 72) {
        addStatus("aero", duration.dia, actionGroups.targetID);
      }
      else {
        addStatus("aero", duration.aero, actionGroups.targetID);
      }
    }
  }
}

function whmStatus() {

  if (statusGroups.statusname == "Freecure") {
    if (statusGroups.gainsloses == "gains") {
      addStatus("freecure", parseInt(statusGroups.duration) * 1000);
      addIcon("freecure");
    }
    else if (statusGroups.gainsloses == "loses") {
      removeStatus("freecure");
      removeIcon("freecure");
    }
  }

  else if (statusGroups.statusname == "Lucid Dreaming") {
    if (statusGroups.gainsloses == "gains") {
      addStatus("luciddreaming", parseInt(statusGroups.duration) * 1000);
    }
    else if (statusGroups.gainsloses == "loses") {
      removeStatus("luciddreaming");
    }
  }

  else if (statusGroups.statusname == "Regen") {
    if (statusGroups.gainsloses == "gains") {
      addStatus("regen", parseInt(statusGroups.duration) * 1000, statusGroups.targetID);
      removeIcon("regen");
      if (target.ID == statusGroups.targetID
      && ["PLD", "WAR", "DRK", "GNB"].indexOf(target.job) > -1) {
        addCountdownBar("regen", checkStatus("regen", target.ID), "icon");
      }
    }
    else if (statusGroups.gainsloses == "loses") {
      removeStatus("regen", statusGroups.targetID);
      if (target.ID == statusGroups.targetID
      && ["PLD", "WAR", "DRK", "GNB"].indexOf(target.job) > -1) {
        addIcon("regen");
      }
    }
  }

  else if (["Aero", "Aero II", "Dia"].indexOf(statusGroups.statusname) > -1) {
    if (statusGroups.gainsloses == "gains") {
      addStatus("aero", parseInt(statusGroups.duration) * 1000, statusGroups.targetID);
      removeIcon("aero");
      if (target.ID == statusGroups.targetID) {
        addCountdownBar("aero", checkStatus("aero", target.ID), "icon");
      }
    }
    else if (statusGroups.gainsloses == "loses") {
      removeStatus("aero", statusGroups.targetID);
      if (target.ID == statusGroups.targetID) {
        addIcon("aero");
      }
    }
  }
}
