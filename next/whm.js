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
  id.luciddreaming = "0";
  id.freecure = "1";
  id.assize;
  id.asylum;
  id.tetragrammaton;
  id.thinair;
  id.divinebenison;
  id.afflatussolace ;
  id.benediction = 1;
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

  if (logLine[1] == player.ID
  && actionList.whm.indexOf(logLine[3]) > -1) {

    if (logLine[3] == "Lucid Dreaming") {
      removeIcon(id.luciddreaming);
      addCooldown("luciddreaming", player.ID, recast.luciddreaming);
    }
  }
}

function whmStatus(logLine) {

  // // addText("debug1", logLine[1] + " " + logLine[2] + " " + logLine[3]);
  //
  // // To anyone from anyone (non-stacking)
  //
  // if (logLine[3] == "nonstackingstatus") {
  //   // if (logLine[2] == "gains") { }
  //   // else if (logLine[2] == "loses") { }
  // }
  //
  // // To player from anyone
  //
  // else if (logLine[1] == player.name) {
  //
  //   if (logLine[3] == "playertotarget") {
  //     if (logLine[2] == "gains") {
  //       addStatus("playertotarget", player.name, parseInt(logLine[5]) * 1000);
  //       removeIcon(id.playertotarget);
  //     }
  //     else if (logLine[2] == "loses") {
  //       removeStatus("playertotarget", player.name);
  //       rdmDualcast();
  //     }
  //   }
  //
  // }
  //
  // // To NOT player from player
  //
  // else if (logLine[1] != player.name
  // && logLine[4] == player.name) {
  //
  //   if (logLine[3] == "test") {
  //     if (logLine[2] == "gains") {
  //     }
  //     else if (logLine[2] == "loses") {
  //     }
  //   }
  // }
}
