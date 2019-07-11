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

  id.freecure = 0;
  id.regen = 1;
  id.aero = 2;
  id.assize = 3;
  id.divinebenison = 4;
  id.tetragrammaton = 5;
  id.benediction = 6;
  id.asylum = 7;
  id.luciddreaming = 10;
  id.thinair = 11;
  id.presenceofmind = 12;

  if (checkStatus("freecure", player.ID) > 0) {
    addIconBlink(id.freecure,icon.cure2);
  }
  else {
    removeIcon(id.freecure)
  }

  if (player.level >= 56
  && checkCooldown("assize", player.ID) < 0) {
    addIconBlink(id.assize,icon.assize);
  }
  else {
    removeIcon(id.assize)
  }

  if (player.level >= 66
  && checkCooldown("divinebenison", player.ID) < 0) {
    addIconBlink(id.divinebenison,icon.divinebenison);
  }
  else {
    removeIcon(id.divinebenison)
  }

  if (player.level >= 60
  && checkCooldown("tetragrammaton", player.ID) < 0) {
    addIconBlink(id.tetragrammaton,icon.tetragrammaton);
  }
  else {
    removeIcon(id.tetragrammaton)
  }

  if (player.level >= 50
  && checkCooldown("benediction", player.ID) < 0) {
    addIconBlink(id.benediction,icon.benediction);
  }
  else {
    removeIcon(id.benediction)
  }

  if (player.level >= 52
  && checkCooldown("asylum", player.ID) < 0) {
    addIconBlink(id.asylum,icon.asylum);
  }
  else {
    removeIcon(id.asylum)
  }

  if (player.level >= 24
  && player.currentMP / player.maxMP < 0.85
  && checkCooldown("luciddreaming", player.ID) < 0) {
    addIconBlink(id.luciddreaming,icon.luciddreaming);
  }
  else {
    removeIcon(id.luciddreaming)
  }

  if (player.level >= 30
  && checkCooldown("presenceofmind", player.ID) < 0) {
    addIconBlink(id.presenceofmind,icon.presenceofmind);
  }
  else {
    removeIcon(id.presenceofmind)
  }
}

function whmPlayerChangedEvent() {

  if (player.level >= 24
  && player.currentMP / player.maxMP < 0.85
  && checkCooldown("luciddreaming", player.ID) < 0) {
    addIconBlink(id.luciddreaming,icon.luciddreaming);
  }
  else {
    removeIcon(id.luciddreaming);
  }
}

function whmTargetChangedEvent() {

  // Ideally tries to keep Regen up on player tank characters
  if (player.level >= 35
  && ["PLD", "WAR", "DRK", "GNB"].indexOf(target.job) > -1
  && checkStatus("regen", target.ID) < 0) {
    addIconBlink(id.regen,icon.regen);
  }
  else {
    removeIcon(id.regen)
  }
}

function whmAction() {

  if (actionList.whm.indexOf(actionGroups.actionname) > -1) {

    if (actionGroups.actionname == "Lucid Dreaming") {
      removeIcon(id.luciddreaming);
      addCooldown("luciddreaming", player.ID, recast.luciddreaming);
    }

    else if (actionGroups.actionname == "Presence Of Mind") {
      removeIcon(id.presenceofmind);
      addCooldown("presenceofmind", player.ID, recast.presenceofmind);
    }

    else if (actionGroups.actionname == "Benediction") {
      removeIcon(id.benediction);
      addCooldown("benediction", player.ID, recast.benediction);
    }

    else if (actionGroups.actionname == "Asylum") {
      removeIcon(id.asylum);
      addCooldown("asylum", player.ID, recast.asylum);
    }

    else if (actionGroups.actionname == "Assize") {
      removeIcon(id.assize);
      addCooldown("assize", player.ID, recast.assize);
    }

    else if (actionGroups.actionname == "Thin Air") {
      removeIcon(id.thinair);
      addCooldown("thinair", player.ID, recast.thinair);
    }

    else if (actionGroups.actionname == "Tetragrammaton") {
      removeIcon(id.tetragrammaton);
      addCooldown("tetragrammaton", player.ID, recast.tetragrammaton);
    }

    else if (actionGroups.actionname == "Divine Benison") {
      removeIcon(id.divinebenison);
      addCooldown("divinebenison", player.ID, recast.divinebenison);
    }

    else if (actionGroups.actionname == "Regen") {
      removeIcon(id.regen);
      addStatus("regen", actionGroups.targetID, duration.regen);
    }

    else if (["Aero", "Aero II"].indexOf(actionGroups.actionname) > -1) {
      removeIcon(id.aero);
      addStatus("aero", actionGroups.targetID, duration.aero);
    }

    else if (actionGroups.actionname == "Dia") {
      removeIcon(id.aero);
      addStatus("aero", actionGroups.targetID, duration.dia);
    }
  }
}

function whmStatus() {

  if (statusGroups.targetID == player.ID) {

    if (statusGroups.statusname == "Freecure") {
      if (statusGroups.gainsloses == "gains") {
        addStatus("freecure", player.ID, parseInt(statusGroups.duration) * 1000);
        addIcon(id.freecure, icon.cure2);
      }
      else if (statusGroups.gainsloses == "loses") {
        removeStatus("Regen", player.ID);
        removeIcon(id.freecure);
      }
    }
  }

  else {
    if (statusGroups.statusname == "Regen") {
      if (statusGroups.gainsloses == "gains") {
        addStatus("regen", statusGroups.targetID, parseInt(statusGroups.duration) * 1000);
        removeIcon(id.regen);
      }
      else if (statusGroups.gainsloses == "loses") {
        removeStatus("regen", statusGroups.targetID);
      }
    }

    else if (["Aero", "Aero II", "Dia"].indexOf(statusGroups.statusname) > -1) {
      if (statusGroups.gainsloses == "gains") {
        addStatus("aero", statusGroups.targetID, parseInt(statusGroups.duration) * 1000);
        removeIcon(id.aero);
      }
      else if (statusGroups.gainsloses == "loses") {
        removeStatus("aero", statusGroups.targetID);
      }
    }
  }
}
