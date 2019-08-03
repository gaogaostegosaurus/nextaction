"use strict";

actionList.mnk = ["Bootshine", "True Strike", "Snap Punch", "Twin Snakes", "Demolish", "Dragon Kick"];
//
// statusList.mnk = ["Twin Snakes",
//   "Demolish",
//   "Blunt Resistance Down"];

nextid.bootshine = "next0";
nextid.dragonkick = nextid.bootshine;
nextid.truestrike = "next1";
nextid.twinsnakes = nextid.truestrike;
nextid.snappunch = "next2";
nextid.demolish = nextid.snappunch;



function mnkPlayerChangedEvent(e) {

}

function mnkAction(logLine) {

  if (logLine[2] == player.name) { // Check if from player

    if (logLine[3] == "Bootshine" && logLine[6].length >= 2) {
      removeIcon("bootshine");
      toggle.stance = 1;
    }

    else if (logLine[3] == "Dragon Kick" && logLine[6].length >= 2) {
      removeIcon("dragonkick");
      if (toggle.stance == 3) {
      }
      toggle.stance = 1;
    }

    else if (logLine[3] == "True Strike" && logLine[6].length >= 2) {
      removeIcon("truestrike");
      if (player.level < 6) {
        mnkCombo();
      }
      toggle.stance = 2;
    }
    else if (logLine[3] == "Twin Snakes" && logLine[6].length >= 2) {
      removeIcon("twinsnakes");
      toggle.stance = 2;
    }

    else if (logLine[3] == "Snap Punch" && logLine[6].length >= 2) {
      removeIcon("snappunch");
      toggle.stance = 3;
      mnkCombo();
    }

    else if (logLine[3] == "Demolish" && logLine[6].length >= 2) {
      removeIcon("demolish");
      toggle.stance = 3;
      mnkCombo();
    }

    else {
      mnkCombo();
    }

    previous.action = logLine[3];
  }
}

function mnkStatus(logLine) {

  // To player from anyone

  if (logLine[1] == player.name) {

    if (logLine[3] == "Twin Snakes") {
      if (logLine[2] == "gains") {
        statustime.twinsnakes = Date.now() + parseInt(logLine[5]) * 1000;
      }
      else if (logLine[2] == "loses") {
        delete statustime.twinsnakes;
      }
    }
  }

  // To NOT player from player

  else if (logLine[1] != player.name
  && logLine[4] == player.name) {

    if (logLine[3] == "Demolish") {
      if (logLine[2] == "gains") {
        statustime.demolish = Date.now() + parseInt(logLine[5]) * 1000;
      }
      else if (logLine[2] == "loses") {
        delete statustime.demolish;
      }
    }
  }
}

function mnkCombo() {

  // Reset icons
  removeIcon("bootshine");
  removeIcon("truestrike");
  removeIcon("snappunch");

  if (player.level >= 50
  && (!statustime.bluntresistancedown || statustime.bluntresistancedown < Date.now() + 9000)
  && toggle.stance == 3) {
    addIcon("dragonkick");
    addIcon("twinsnakes");
    toggle.combo = 1;
  }
  else if (player.level >= 18
  && (!statustime.twinsnakes || statustime.twinsnakes < Date.now() + 11000)) {
    if (player.level >= 50) {
      addIcon("dragonkick");
    }
    else {
      addIcon("bootshine");
    }
    addIcon("twinsnakes");
    toggle.combo = 1;
  }
  else {
    addIcon("bootshine");
    addIcon("truestrike");
    toggle.combo = 0;
  }

  if (player.level >= 30
  && (!statustime.demolish || statustime.demolish < Date.now() + 12000)) {
    addIcon("demolish");
    toggle.combo = toggle.combo + 4;
  }
  else {
    addIcon("snappunch");
    toggle.combo = toggle.combo + 2;
  }
}
