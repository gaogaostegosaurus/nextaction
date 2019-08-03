"use strict";

actionList.whm = [

  // Role actions
  "Lucid Dreaming",

  // oGCD actions
  "Presence Of Mind", "Benediction", "Asylum", "Assize", "Thin Air", "Tetragrammaton", "Divine Benison",

  // GCD actions
  "Aero", "Regen", "Aero II", "Dia"
];

function whmJobChange() {

  // Set up UI
  nextid.freecure = 0;
  nextid.regen = 1;
  nextid.aero = 2;
  nextid.assize = 3;
  nextid.divinebenison = 4;
  nextid.tetragrammaton = 5;
  nextid.benediction = 6;
  nextid.asylum = 7;
  nextid.luciddreaming = 10;
  nextid.thinair = 10;
  nextid.presenceofmind = 11;

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

  if (checkStatus("freecure", player.ID) > 0) {
    addIconBlink(nextid.freecure,icon.cure2);
  }
  else {
    removeIcon(nextid.freecure)
  }

  if (player.level >= 24
  && player.currentMP / player.maxMP < 0.8
  && checkCooldown("luciddreaming") < 0) {
    addIconBlink(nextid.luciddreaming,icon.luciddreaming);
  }
  else if (player.level >= 58
  && player.currentMP / player.maxMP < 0.8
  && checkCooldown("thinair") < 0) {
    addIconBlink(nextid.thinair,icon.thinair);
  }
  else {
    removeIcon(nextid.luciddreaming)
  }

  if (player.level >= 30
  && checkCooldown("presenceofmind") < 0) {
    addIconBlink(nextid.presenceofmind,icon.presenceofmind);
  }
  else {
    removeIcon(nextid.presenceofmind)
  }

  if (player.level >= 50
  && checkCooldown("benediction") < 0) {
    addIconBlink(nextid.benediction,icon.benediction);
  }
  else {
    removeIcon(nextid.benediction)
  }

  if (player.level >= 52
  && checkCooldown("asylum") < 0) {
    addIconBlink(nextid.asylum,icon.asylum);
  }
  else {
    removeIcon(nextid.asylum)
  }

  if (player.level >= 56
  && checkCooldown("assize") < 0) {
    addIconBlink(nextid.assize,icon.assize);
  }
  else {
    removeIcon(nextid.assize)
  }

  if (player.level >= 60
  && checkCooldown("tetragrammaton") < 0) {
    addIconBlink(nextid.tetragrammaton,icon.tetragrammaton);
  }
  else {
    removeIcon(nextid.tetragrammaton)
  }

  if (player.level >= 66
  && checkCooldown("divinebenison") < 0) {
    addIconBlink(nextid.divinebenison,icon.divinebenison);
  }
  else {
    removeIcon(nextid.divinebenison)
  }
}

function whmPlayerChangedEvent() {

  // MP recovery - Lucid and Thin Air share same spot
  if (player.level >= 24
  && player.currentMP / player.maxMP < 0.8
  && checkCooldown("luciddreaming") < 0) {
    addIconBlink(nextid.luciddreaming,icon.luciddreaming);
  }
  else if (player.level >= 58
  && player.currentMP / player.maxMP < 0.8
  && checkCooldown("thinair") < 0) {
    addIconBlink(nextid.thinair,icon.thinair);
  }
  else {
    removeIcon("luciddreaming");
  }
}

function whmTargetChangedEvent() {

  // Ideally tries to keep Regen up on player tank characters
  if (player.level >= 35
  && ["PLD", "WAR", "DRK", "GNB"].indexOf(target.job) > -1
  && checkStatus("regen", target.ID) < 0) {
    addIconBlink(nextid.regen,icon.regen);
  }
  else {
    removeIcon(nextid.regen)
  }
}

function whmAction() {

  if (actionList.whm.indexOf(actionGroups.actionname) > -1) {

    if (actionGroups.actionname == "Lucid Dreaming") {
      removeIcon("luciddreaming");
      addCooldown("luciddreaming");
    }

    else if (actionGroups.actionname == "Presence Of Mind") {
      removeIcon("presenceofmind");
      addCooldown("presenceofmind");
    }

    else if (actionGroups.actionname == "Benediction") {
      removeIcon("benediction");
      addCooldown("benediction");
    }

    else if (actionGroups.actionname == "Asylum") {
      removeIcon("asylum");
      addCooldown("asylum");
    }

    else if (actionGroups.actionname == "Assize") {
      removeIcon("assize");
      addCooldown("assize");
    }

    else if (actionGroups.actionname == "Thin Air") {
      removeIcon("thinair");
      addCooldown("thinair");
    }

    else if (actionGroups.actionname == "Tetragrammaton") {
      removeIcon("tetragrammaton");
      addCooldown("tetragrammaton");
    }

    else if (actionGroups.actionname == "Divine Benison") {
      removeIcon("divinebenison");
      addCooldown("divinebenison");
    }

    else if (actionGroups.actionname == "Regen") {
      removeIcon("regen");
      addStatus("regen", duration.regen, actionGroups.targetID);
    }

    else if (["Aero", "Aero II"].indexOf(actionGroups.actionname) > -1) {
      removeIcon("aero");
      addStatus("aero", duration.aero, actionGroups.targetID);
    }

    else if (actionGroups.actionname == "Dia") {
      removeIcon("aero");
      addStatus("aero", duration.dia, actionGroups.targetID);
    }
  }
}

function whmStatus() {

  if (statusGroups.targetID == player.ID) {

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
  }

  else {

    if (statusGroups.statusname == "Regen") {
      if (statusGroups.gainsloses == "gains") {
        addStatus("regen", parseInt(statusGroups.duration) * 1000, statusGroups.targetID);
        removeIcon("regen");
      }
      else if (statusGroups.gainsloses == "loses") {
        removeStatus("regen", statusGroups.targetID);
      }
    }

    else if (["Aero", "Aero II", "Dia"].indexOf(statusGroups.statusname) > -1) {
      if (statusGroups.gainsloses == "gains") {
        addStatus("aero", parseInt(statusGroups.duration) * 1000, statusGroups.targetID);
        removeIcon("aero");
      }
      else if (statusGroups.gainsloses == "loses") {
        removeStatus("aero", statusGroups.targetID);
      }
    }
  }
}
