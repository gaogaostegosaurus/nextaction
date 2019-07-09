"use strict";

actionList.whm = [
  "Lucid Dreaming"
];



// id.freecure = "next0";
// id.aero = "next1";
// id.aero2 = "next1";
// id.aero3 = "next2";
// id.regen = "next3";
// id.medica2 = "next4";
// id.assize = "next10";
// id.thinair = "next10";
// id.benediction = "next11";
// id.tetragrammaton = "next11";
// id.asylum = "next12";
// id.divinebenison = "next13";
// id.plenaryindulgence ="next14";

// Cooldown tracker
// Single target OGCDs


// Count holy Hits

//
//

function whmJobChange() {
  id.luciddreaming = 0;
  id.freecure = "1";
  id.afflatussolace = "10";
  id.tetragrammaton = "10";
  id.benediction = "10";
  id.assize = "11";
  id.divinebenison = "12";
  id.asylum = "13";
  id.thinair = "14";
  id.afflatusmisery;
  id.afflatusrapture;
}

function whmPlayerChangedEvent(e) {

  if (player.currentMP / player.maxMP < 0.85
  && checkCooldown("luciddreaming", player.ID) < 0) {
    addIconBlink(id.luciddreaming,icon.luciddreaming);
  }
  else {
    removeIcon(id.luciddreaming);
  }
}

function whmInCombatChangedEvent(e) {

  if (player.currentMP / player.maxMP < 0.85
  && checkCooldown("luciddreaming", player.ID) < 0) {
    addIconBlink(id.luciddreaming,icon.luciddreaming);
  }
}

function whmAction(logLine) {

  if (actionList.whm.indexOf(actionGroups.actionname) > -1) {

    if (actionGroups.actionname == "Lucid Dreaming") {
      removeIcon(id.luciddreaming);
      addCooldown("luciddreaming", player.ID, recast.luciddreaming);
    }
  }
}

function whmStatus(logLine) {

  if (statusGroups.targetID == player.ID) {

    if (statusGroups.statusname == "Freecure") {
      if (logLine[2] == "gains") {
        addStatus("freecure", player.name, parseInt(statusGroups.duration) * 1000);
        addIcon(id.freecure, icon.cure2);
      }
      else if (logLine[2] == "loses") {
        removeIcon(id.freecure);
      }
    }
  }
}
