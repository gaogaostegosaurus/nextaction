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


// icon.aero = "000401";
// icon.aero2 = "000402";
// icon.freecure = "000406";
// icon.medica2 = "000409";
// icon.benediction = "002627";
// icon.regen = "002628";
// icon.asylum = "002632";
// icon.assize = "002634";
// icon.aero3 = "002635";
// icon.tetragrammaton = "002633";
// icon.divinebenison = "002635";
// icon.thinair = "002636";
// icon.plenaryindulgence = "002639";
//
// recast.presenceofmind = 150000;
// recast.benediction = 180000;
// recast.asylum = 90000;
// recast.assize = 45000;
// recast.tetragrammaton = 60000;
// recast.thinair = 120000;
// recast.divinebenison = 30000;
// recast.plenaryindulgence = 120000;



function whmPlayerChangedEvent(e) {

  if (player.currentMP / player.maxMP < 0.85
  && checkCooldown("luciddreaming", player.name) < 0) {
    addIconBlink(id.luciddreaming,icon.luciddreaming);
  }
  else {
    removeIcon(id.luciddreaming);
  }
}

function whmInCombatChangedEvent(e) {

  if (player.currentMP / player.maxMP < 0.85
  && checkCooldown("luciddreaming", player.name) < 0) {
    addIconBlink(id.luciddreaming,icon.luciddreaming);
  }
}

function whmAction(logLine) {

  if (logLine[2] == player.name
  && actionList.whm.indexOf(logLine[3]) > -1) {

    if (logLine[3] == "Lucid Dreaming") {
      removeIcon(id.luciddreaming);
      addCooldown("luciddreaming", player.name, recast.luciddreaming);
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
