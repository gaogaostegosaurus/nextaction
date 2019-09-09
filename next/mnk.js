"use strict";

actionList.mnk = [

  // oGCD
  "Perfect Balance", "Riddle Of Fire", "Brotherhood", "The Forbidden Chakra", "Enlightenment", "Shoulder Tackle", "Elixir Field", "Tornado Kick",
  "Riddle Of Earth",



  // GCD
  "Bootshine", "Dragon Kick",
  "True Strike", "Twin Snakes",
  "Snap Punch", "Demolish",
  "Arm Of The Destroyer",
  "Four-Point Fury",
  "Rockbreaker",
  "Form Shift"

  // Role
  // "True North"

];
//
// statusList.mnk = ["Twin Snakes",
//   "Demolish",
//   "Blunt Resistance Down"];


function mnkJobChange() {

  nextid.fistsoffire = 0;
  nextid.combo1 = 1;
  nextid.combo2 = 2;
  nextid.combo3 = 3;

  nextid.theforbiddenchakra = 10;
  nextid.enlightenment = 10;
  nextid.riddleoffire = 11;
  nextid.brotherhood = 12;
  nextid.perfectbalance = 13;

  countdownid.demolish = 0;
  countdownid.twinsnakes = 1;
  countdownid.perfectbalance = 2;
  countdownid.riddleoffire = 11;
  countdownid.brotherhood = 10;

  if (player.level >= 50) {
    addCountdownBar("perfectbalance", checkRecast("perfectbalance"), "icon");
  }

  if (player.level >= 68) {
    addCountdownBar("riddleoffire", checkRecast("riddleoffire"), "icon");
  }

  if (player.level >= 70) {
    addCountdownBar("brotherhood", checkRecast("brotherhood"), "icon");
  }

  mnkCombo();

}

function mnkPlayerChangedEvent(e) {
  if (player.jobDetail.chakraStacks >= 5) {
    addIcon("theforbiddenchakra");
  }
  else {
    removeIcon("theforbiddenchakra");
  }
}

function mnkAction(logLine) {

  if (actionList.mnk.indexOf(actionGroups.actionname) > -1) {

    if ("Perfect Balance" == actionGroups.actionname) {
      addCountdownBar("perfectbalance", recast.perfectbalance, "icon");
    }

    else if ("Riddle Of Earth" == actionGroups.actionname) {
      addCountdownBar("riddleofearth", recast.riddleofearth, "icon");
    }

    else if ("Riddle Of Fire" == actionGroups.actionname) {
      addCountdownBar("riddleoffire", recast.riddleoffire, "icon");
    }

    else if ("Brotherhood" == actionGroups.actionname) {
      addCountdownBar("brotherhood", recast.brotherhood, "icon");
    }

    else {

      if ("Bootshine" == actionGroups.actionname) {
      }

      else if ("Dragon Kick" == actionGroups.actionname) {
      }

      else if ("True Strike" == actionGroups.actionname) {
      }

      else if ("Twin Snakes" == actionGroups.actionname) {
        addStatus("twinsnakes");
      }

      else if ("Snap Punch" == actionGroups.actionname) {
        mnkCombo();
      }

      else if ("Demolish" == actionGroups.actionname) {
        addStatus("demolish", duration.demolish, actionGroups.targetID);
        mnkCombo();
      }

      else if ("Form Shift" == actionGroups.actionname) {
      }

    }

  }

}

function mnkStatus(logLine) {

  if (statusGroups.statusname == "Opo-Opo Form") {
    if (statusGroups.gainsloses == "gains") {
      addStatus("opoopoform", parseInt(statusGroups.duration) * 1000, statusGroups.targetID);
      mnkCombo();
      mnkComboTimeout();
    }
    else if (statusGroups.gainsloses == "loses") {
      removeStatus("opoopoform", statusGroups.targetID);
    }
  }

  else if (statusGroups.statusname == "Raptor Form") {
    if (statusGroups.gainsloses == "gains") {
      addStatus("raptorform", parseInt(statusGroups.duration) * 1000, statusGroups.targetID);
      removeIcon("combo1");
      mnkComboTimeout();
    }
    else if (statusGroups.gainsloses == "loses") {
      removeStatus("raptorform", statusGroups.targetID);
    }
  }

  else if (statusGroups.statusname == "Coeurl Form") {
    if (statusGroups.gainsloses == "gains") {
      addStatus("coeurlform", parseInt(statusGroups.duration) * 1000, statusGroups.targetID);
      removeIcon("combo2");
      mnkComboTimeout();
    }
    else if (statusGroups.gainsloses == "loses") {
      removeStatus("coeurlform", statusGroups.targetID);
    }
  }

  else if (statusGroups.statusname == "Twin Snakes") {
    if (statusGroups.gainsloses == "gains") {
      addStatus("twinsnakes", parseInt(statusGroups.duration) * 1000, statusGroups.targetID);
    }
    else if (statusGroups.gainsloses == "loses") {
      removeStatus("twinsnakes", statusGroups.targetID);
    }
  }

  else if (statusGroups.statusname == "Demolish") {
    if (statusGroups.gainsloses == "gains") {
      addStatus("demolish", parseInt(statusGroups.duration) * 1000, statusGroups.targetID);
    }
    else if (statusGroups.gainsloses == "loses") {
      removeStatus("demolish", statusGroups.targetID);
    }
  }

  else if (statusGroups.statusname == "Fists Of Earth") {
    if (statusGroups.gainsloses == "gains") {
      addStatus("fistsofearth", parseInt(statusGroups.duration) * 1000, statusGroups.targetID);
      addIcon("fistsoffire");
    }
    else if (statusGroups.gainsloses == "loses") {
      removeStatus("fistsofearth", statusGroups.targetID);
    }
  }

  else if (statusGroups.statusname == "Fists Of Wind") {
    if (statusGroups.gainsloses == "gains") {
      addStatus("fistsofwind", parseInt(statusGroups.duration) * 1000, statusGroups.targetID);
      addIcon("fistsoffire");
    }
    else if (statusGroups.gainsloses == "loses") {
      removeStatus("fistsofwind", statusGroups.targetID);
    }
  }

  else if (statusGroups.statusname == "Fists Of Fire") {
    if (statusGroups.gainsloses == "gains") {
      addStatus("fistsoffire", parseInt(statusGroups.duration) * 1000, statusGroups.targetID);
      removeIcon("fistsoffire");
    }
    else if (statusGroups.gainsloses == "loses") {
      removeStatus("fistsoffire", statusGroups.targetID);
      addIcon("fistsoffire");
    }
  }

  else if (statusGroups.statusname == "Leaden Fist") {
    if (statusGroups.gainsloses == "gains") {
      addStatus("leadenfist", parseInt(statusGroups.duration) * 1000, statusGroups.targetID);
    }
    else if (statusGroups.gainsloses == "loses") {
      removeStatus("leadenfist", statusGroups.targetID);
    }
  }

  else if (statusGroups.statusname == "Perfect Balance") {
    if (statusGroups.gainsloses == "gains") {
      addStatus("perfectbalance", parseInt(statusGroups.duration) * 1000, statusGroups.targetID);
    }
    else if (statusGroups.gainsloses == "loses") {
      removeStatus("perfectbalance", statusGroups.targetID);
    }
  }

  else if (statusGroups.statusname == "Riddle Of Fire") {
    if (statusGroups.gainsloses == "gains") {
      addStatus("riddleoffire", parseInt(statusGroups.duration) * 1000, statusGroups.targetID);
    }
    else if (statusGroups.gainsloses == "loses") {
      removeStatus("riddleoffire", statusGroups.targetID);
    }
  }
}

function mnkCombo() {
  //
  // if (checkStatus("perfectbalance") > 0) {
  //   if
  // }
  //
  // else {
  //
  // }
  // Reset icons
  removeIcon("combo1");
  removeIcon("combo2");
  removeIcon("combo3");

  if (checkStatus("leadenfist") > 0) {
    potency.bootshine = 300 * 2;
  }
  else {
    potency.bootshine = 150 * 2;
  }

  if (checkStatus("opoopoform") > 0) {
    potency.armofthedestroyer = 110;
  }
  else {
    potency.armofthedestroyer = 80;
  }

  potency.dragonkick = 200;

    if (player.level >= 26
  && potency.armofthedestroyer * count.aoe > Math.max(potency.bootshine, potency.dragonkick)) {
    icon.combo1 = icon.armofthedestroyer;
  }
  else if (player.level >= 50
  && checkStatus("leadenfist") < 0) {
    icon.combo1 = icon.dragonkick;
  }
  else {
    icon.combo1 = icon.bootshine;
  }

  if (player.level >= 18
  && checkStatus("twinsnakes") < 12000) {
    icon.combo2 = icon.twinsnakes;
  }
  else if (player.level >= 45
  && count.aoe >= 2) {
    icon.combo2 = icon.fourpointfury;
  }
  else {
    icon.combo2 = icon.truestrike;
  }

  if (player.level >= 30
  && count.aoe >= 2) {
    icon.combo3 = icon.rockbreaker;
  }
  else if (player.level >= 30
  && checkStatus("demolish", target.ID) < 12000) {
    icon.combo3 = icon.demolish;
  }

  else {
    icon.combo3 = icon.snappunch;
  }

  addIcon("combo1");
  addIcon("combo2");
  addIcon("combo3");

}

function mnkComboTimeout() {
  clearTimeout(timeout.combo);
  timeout.combo = setTimeout(mnkCombo, 12500);
}
