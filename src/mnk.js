"use strict";

const mnkActionList = [

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
    addCountdownBar({name: "perfectbalance", time: checkRecast("perfectbalance"), oncomplete: "addIcon"});
  }

  if (player.level >= 68) {
    addCountdownBar({name: "riddleoffire", time: checkRecast("riddleoffire"), oncomplete: "addIcon"});
  }

  if (player.level >= 70) {
    addCountdownBar({name: "brotherhood", time: checkRecast("brotherhood"), oncomplete: "addIcon"});
  }

  mnkCombo();

}

function mnkPlayerChangedEvent(e) {
  if (player.jobDetail.chakraStacks >= 5) {
    addIcon({name: "theforbiddenchakra"});
  }
  else {
    removeIcon("theforbiddenchakra");
  }
}

function mnkAction(logLine) {

  if (actionList.mnk.indexOf(actionLog.groups.actionName) > -1) {

    if ("Perfect Balance" == actionLog.groups.actionName) {
      addCountdownBar({name: "perfectbalance", time: recast.perfectbalance, oncomplete: "addIcon"});
    }

    else if ("Riddle Of Earth" == actionLog.groups.actionName) {
      addCountdownBar({name: "riddleofearth", time: recast.riddleofearth, oncomplete: "addIcon"});
    }

    else if ("Riddle Of Fire" == actionLog.groups.actionName) {
      addCountdownBar({name: "riddleoffire", time: recast.riddleoffire, oncomplete: "addIcon"});
    }

    else if ("Brotherhood" == actionLog.groups.actionName) {
      addCountdownBar({name: "brotherhood", time: recast.brotherhood, oncomplete: "addIcon"});
    }

    else {

      if ("Bootshine" == actionLog.groups.actionName) {
      }

      else if ("Dragon Kick" == actionLog.groups.actionName) {
      }

      else if ("True Strike" == actionLog.groups.actionName) {
      }

      else if ("Twin Snakes" == actionLog.groups.actionName) {
        addStatus("twinsnakes");
      }

      else if ("Snap Punch" == actionLog.groups.actionName) {
        mnkCombo();
      }

      else if ("Demolish" == actionLog.groups.actionName) {
        addStatus("demolish", duration.demolish, actionLog.groups.targetID);
        mnkCombo();
      }

      else if ("Form Shift" == actionLog.groups.actionName) {
      }

    }

  }

}

function mnkStatus(logLine) {

  if (statusLog.groups.statusName == "Opo-Opo Form") {
    if (statusLog.groups.gainsLoses == "gains") {
      addStatus("opoopoform", parseInt(statusLog.groups.effectDuration) * 1000, statusLog.groups.targetID);
      mnkCombo();
      mnkComboTimeout();
    }
    else if (statusLog.groups.gainsLoses == "loses") {
      removeStatus("opoopoform", statusLog.groups.targetID);
    }
  }

  else if (statusLog.groups.statusName == "Raptor Form") {
    if (statusLog.groups.gainsLoses == "gains") {
      addStatus("raptorform", parseInt(statusLog.groups.effectDuration) * 1000, statusLog.groups.targetID);
      removeIcon("combo1");
      mnkComboTimeout();
    }
    else if (statusLog.groups.gainsLoses == "loses") {
      removeStatus("raptorform", statusLog.groups.targetID);
    }
  }

  else if (statusLog.groups.statusName == "Coeurl Form") {
    if (statusLog.groups.gainsLoses == "gains") {
      addStatus("coeurlform", parseInt(statusLog.groups.effectDuration) * 1000, statusLog.groups.targetID);
      removeIcon("combo2");
      mnkComboTimeout();
    }
    else if (statusLog.groups.gainsLoses == "loses") {
      removeStatus("coeurlform", statusLog.groups.targetID);
    }
  }

  else if (statusLog.groups.statusName == "Twin Snakes") {
    if (statusLog.groups.gainsLoses == "gains") {
      addStatus("twinsnakes", parseInt(statusLog.groups.effectDuration) * 1000, statusLog.groups.targetID);
    }
    else if (statusLog.groups.gainsLoses == "loses") {
      removeStatus("twinsnakes", statusLog.groups.targetID);
    }
  }

  else if (statusLog.groups.statusName == "Demolish") {
    if (statusLog.groups.gainsLoses == "gains") {
      addStatus("demolish", parseInt(statusLog.groups.effectDuration) * 1000, statusLog.groups.targetID);
    }
    else if (statusLog.groups.gainsLoses == "loses") {
      removeStatus("demolish", statusLog.groups.targetID);
    }
  }

  else if (statusLog.groups.statusName == "Fists Of Earth") {
    if (statusLog.groups.gainsLoses == "gains") {
      addStatus("fistsofearth", parseInt(statusLog.groups.effectDuration) * 1000, statusLog.groups.targetID);
      addIcon({name: "fistsoffire"});
    }
    else if (statusLog.groups.gainsLoses == "loses") {
      removeStatus("fistsofearth", statusLog.groups.targetID);
    }
  }

  else if (statusLog.groups.statusName == "Fists Of Wind") {
    if (statusLog.groups.gainsLoses == "gains") {
      addStatus("fistsofwind", parseInt(statusLog.groups.effectDuration) * 1000, statusLog.groups.targetID);
      addIcon({name: "fistsoffire"});
    }
    else if (statusLog.groups.gainsLoses == "loses") {
      removeStatus("fistsofwind", statusLog.groups.targetID);
    }
  }

  else if (statusLog.groups.statusName == "Fists Of Fire") {
    if (statusLog.groups.gainsLoses == "gains") {
      addStatus("fistsoffire", parseInt(statusLog.groups.effectDuration) * 1000, statusLog.groups.targetID);
      removeIcon("fistsoffire");
    }
    else if (statusLog.groups.gainsLoses == "loses") {
      removeStatus("fistsoffire", statusLog.groups.targetID);
      addIcon({name: "fistsoffire"});
    }
  }

  else if (statusLog.groups.statusName == "Leaden Fist") {
    if (statusLog.groups.gainsLoses == "gains") {
      addStatus("leadenfist", parseInt(statusLog.groups.effectDuration) * 1000, statusLog.groups.targetID);
    }
    else if (statusLog.groups.gainsLoses == "loses") {
      removeStatus("leadenfist", statusLog.groups.targetID);
    }
  }

  else if (statusLog.groups.statusName == "Perfect Balance") {
    if (statusLog.groups.gainsLoses == "gains") {
      addStatus("perfectbalance", parseInt(statusLog.groups.effectDuration) * 1000, statusLog.groups.targetID);
    }
    else if (statusLog.groups.gainsLoses == "loses") {
      removeStatus("perfectbalance", statusLog.groups.targetID);
    }
  }

  else if (statusLog.groups.statusName == "Riddle Of Fire") {
    if (statusLog.groups.gainsLoses == "gains") {
      addStatus("riddleoffire", parseInt(statusLog.groups.effectDuration) * 1000, statusLog.groups.targetID);
    }
    else if (statusLog.groups.gainsLoses == "loses") {
      removeStatus("riddleoffire", statusLog.groups.targetID);
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
  && potency.armofthedestroyer * count.targets > Math.max(potency.bootshine, potency.dragonkick)) {
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
  && count.targets >= 2) {
    icon.combo2 = icon.fourpointfury;
  }
  else {
    icon.combo2 = icon.truestrike;
  }

  if (player.level >= 30
  && count.targets >= 2) {
    icon.combo3 = icon.rockbreaker;
  }
  else if (player.level >= 30
  && checkStatus("demolish", target.ID) < 12000) {
    icon.combo3 = icon.demolish;
  }

  else {
    icon.combo3 = icon.snappunch;
  }

  addIcon({name: "combo1"});
  addIcon({name: "combo2"});
  addIcon({name: "combo3"});

}

function mnkComboTimeout() {
  clearTimeout(timeout.combo);
  timeout.combo = setTimeout(mnkCombo, 12500);
}
