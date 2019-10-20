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

  if (actionList.whm.indexOf(actionLog.groups.actionName) > -1) {

    if (actionLog.groups.actionName == "Lucid Dreaming") {
      addRecast("luciddreaming");
      addCountdownBar("luciddreaming");
    }

    else if (actionLog.groups.actionName == "Presence Of Mind") {
      addRecast("presenceofmind");
      addCountdownBar("presenceofmind");
    }

    else if (actionLog.groups.actionName == "Benediction") {
      addRecast("benediction");
      addCountdownBar("benediction");
    }

    else if (actionLog.groups.actionName == "Asylum") {
      addRecast("asylum");
      addCountdownBar("asylum");
    }

    else if (actionLog.groups.actionName == "Assize") {
      addRecast("assize");
      addCountdownBar("assize");
    }

    else if (actionLog.groups.actionName == "Thin Air") {
      addRecast("thinair");
      addCountdownBar("thinair");
    }

    else if (actionLog.groups.actionName == "Tetragrammaton") {
      addRecast("tetragrammaton");
      addCountdownBar("tetragrammaton");
    }

    else if (actionLog.groups.actionName == "Divine Benison") {
      addRecast("divinebenison");
      addCountdownBar("divinebenison");
    }

    else if (actionLog.groups.actionName == "Regen") {
      removeIcon("regen");
      addCountdownBar("regen", checkStatus("regen", target.ID), "icon");
      addStatus("regen", duration.regen, actionLog.groups.targetID);
    }

    else if (["Aero", "Aero II", "Dia"].indexOf(actionLog.groups.actionName) > -1) {
      removeIcon("aero");
      if (player.level >= 72) {
        addStatus("aero", duration.dia, actionLog.groups.targetID);
      }
      else {
        addStatus("aero", duration.aero, actionLog.groups.targetID);
      }
    }
  }
}

function whmStatus() {

  if (effectLog.groups.effectName == "Freecure") {
    if (effectLog.groups.gainsLoses == "gains") {
      addStatus("freecure", parseInt(effectLog.groups.effectDuration) * 1000);
      addIcon("freecure");
    }
    else if (effectLog.groups.gainsLoses == "loses") {
      removeStatus("freecure");
      removeIcon("freecure");
    }
  }

  else if (effectLog.groups.effectName == "Lucid Dreaming") {
    if (effectLog.groups.gainsLoses == "gains") {
      addStatus("luciddreaming", parseInt(effectLog.groups.effectDuration) * 1000);
    }
    else if (effectLog.groups.gainsLoses == "loses") {
      removeStatus("luciddreaming");
    }
  }

  else if (effectLog.groups.effectName == "Regen") {
    if (effectLog.groups.gainsLoses == "gains") {
      addStatus("regen", parseInt(effectLog.groups.effectDuration) * 1000, effectLog.groups.targetID);
      removeIcon("regen");
      if (target.ID == effectLog.groups.targetID
      && ["PLD", "WAR", "DRK", "GNB"].indexOf(target.job) > -1) {
        addCountdownBar("regen", checkStatus("regen", target.ID), "icon");
      }
    }
    else if (effectLog.groups.gainsLoses == "loses") {
      removeStatus("regen", effectLog.groups.targetID);
      if (target.ID == effectLog.groups.targetID
      && ["PLD", "WAR", "DRK", "GNB"].indexOf(target.job) > -1) {
        addIcon("regen");
      }
    }
  }

  else if (["Aero", "Aero II", "Dia"].indexOf(effectLog.groups.effectName) > -1) {
    if (effectLog.groups.gainsLoses == "gains") {
      addStatus("aero", parseInt(effectLog.groups.effectDuration) * 1000, effectLog.groups.targetID);
      removeIcon("aero");
      if (target.ID == effectLog.groups.targetID) {
        addCountdownBar("aero", checkStatus("aero", target.ID), "icon");
      }
    }
    else if (effectLog.groups.gainsLoses == "loses") {
      removeStatus("aero", effectLog.groups.targetID);
      if (target.ID == effectLog.groups.targetID) {
        addIcon("aero");
      }
    }
  }
}
