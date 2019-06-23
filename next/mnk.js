"use strict";

actionList.mnk = ["Bootshine", "True Strike", "Snap Punch", "Twin Snakes", "Demolish", "Dragon Kick"];

statusList.mnk = ["Twin Snakes",
  "Demolish",
  "Blunt Resistance Down"];

id.bootshine = "nextAction1";
id.dragonkick = id.bootshine;
id.truestrike = "nextAction2";
id.twinsnakes = id.truestrike;
id.snappunch = "nextAction3";
id.demolish = id.snappunch;

icon.bootshine = "000208";
icon.dragonkick = "002528";
icon.truestrike = "000209";
icon.twinsnakes = "000213";
icon.snappunch = "000210";
icon.demolish = "000204";

function mnkPlayerChangedEvent(e) {

}

function mnkAction(logLine) {

  if (logLine[2] == player.name) { // Check if from player

    if (logLine[3] == "Bootshine" && logLine[6].length >= 2) {
      removeIcon(id.bootshine);
      toggle.stance = 1;
    }

    else if (logLine[3] == "Dragon Kick" && logLine[6].length >= 2) {
      removeIcon(id.dragonkick);
      if (toggle.stance == 3) {
        statustime.bluntresistancedown == Date.now + 15000;
      }
      toggle.stance = 1;
    }

    else if (logLine[3] == "True Strike" && logLine[6].length >= 2) {
      removeIcon(id.truestrike);
      if (player.level < 6) {
        mnkCombo();
      }
      toggle.stance = 2;
    }
    else if (logLine[3] == "Twin Snakes" && logLine[6].length >= 2) {
      statustime.twinsnakes = Date.now() + 15000;
      removeIcon(id.twinsnakes);
      toggle.stance = 2;
    }

    else if (logLine[3] == "Snap Punch" && logLine[6].length >= 2) {
      removeIcon(id.snappunch);
      toggle.stance = 3;
      mnkCombo();
    }

    else if (logLine[3] == "Demolish" && logLine[6].length >= 2) {
      statustime.demolish = Date.now() + 18000;
      removeIcon(id.demolish);
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

  // To anyone from anyone (non-stacking)

  if (logLine[3] == "Blunt Resistance Down") {
    if (logLine[2] == "gains") {
      statustime.bluntresistancedown = Date.now() + parseInt(logLine[5]) * 1000;
    }
    else if (logLine[2] == "loses") {
      delete statustime.bluntresistancedown;
    }
  }

  // To player from anyone

  else if (logLine[1] == player.name) {

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
  removeIcon(id.bootshine);
  removeIcon(id.truestrike);
  removeIcon(id.snappunch);

  if (player.level >= 50
  && (!statustime.bluntresistancedown || statustime.bluntresistancedown < Date.now() + 9000)
  && toggle.stance == 3) {
    addIcon(id.dragonkick,icon.dragonkick);
    addIcon(id.twinsnakes,icon.twinsnakes);
    toggle.combo = 1;
  }
  else if (player.level >= 18
  && (!statustime.twinsnakes || statustime.twinsnakes < Date.now() + 11000)) {
    if (player.level >= 50) {
      addIcon(id.dragonkick,icon.dragonkick);
    }
    else {
      addIcon(id.bootshine,icon.bootshine);
    }
    addIcon(id.twinsnakes,icon.twinsnakes);
    toggle.combo = 1;
  }
  else {
    addIcon(id.bootshine,icon.bootshine);
    addIcon(id.truestrike,icon.truestrike);
    toggle.combo = 0;
  }

  if (player.level >= 30
  && (!statustime.demolish || statustime.demolish < Date.now() + 12000)) {
    addIcon(id.demolish,icon.demolish);
    toggle.combo = toggle.combo + 4;
  }
  else {
    addIcon(id.snappunch,icon.snappunch);
    toggle.combo = toggle.combo + 2;
  }
}
