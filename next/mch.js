"use strict";

actionList.mch = [

  // Toggle single target
  "Split Shot", "Slug Shot", "Clean Shot",
  "Heated Split Shot", "Heated Slug Shot", "Heated Clean Shot",
  "Hot Shot", "Heat Blast",

  // Toggle AoE
  "Spread Shot", "Auto Crossbow", "Flamethrower", "Bioblaster",

  // Misc
  "Reassemble", "Gauss Round", "Hypercharge", "Rook Autoturret", "Wildfire",
  "Ricochet", "Tactician", "Drill", "Barrel Stabilizer", "Air Anchor",
  "Automaton Queen",

  // Role actions
  "Second Wind", "Peloton", "Head Graze"
];

function mchJobChange() {

  nextid.heatblast = 0;
  nextid.autocrossbow = nextid.heatblast;
  nextid.reassemble = 1;
  nextid.drill = 2;
  nextid.bioblaster = nextid.drill;
  nextid.hotshot = 3;
  nextid.airanchor = nextid.hotshot;
  nextid.splitshot = 4;
  nextid.heatedsplitshot = nextid.splitshot;
  nextid.spreadshot = nextid.splitshot;
  nextid.slugshot = 5;
  nextid.heatedslugshot = nextid.slugshot;
  nextid.cleanshot = 6;
  nextid.heatedcleanshot = nextid.cleanshot;
  nextid.rookautoturret = 10;
  nextid.rookoverdrive = nextid.rookautoturret;
  nextid.automatonqueen = nextid.rookautoturret;
  nextid.queenoverdrive = nextid.rookautoturret;
  nextid.barrelstabilizer = 11;
  nextid.wildfire = 12;
  nextid.detonator = nextid.wildfire;
  nextid.hypercharge = 13;
  nextid.gaussround = 14;
  nextid.ricochet = 15;
  nextid.flamethrower = 16;
  // nextid.tactician = 99;

  // Set up action changes from level

  if (player.level >= 76) {
    icon.hotshot = icon.airanchor;
  }
  else {
    icon.hotshot = "003003";
  }

  if (player.level >= 72
  && toggle.aoe) {
    icon.drill = icon.bioblaster;
  }
  else {
    icon.drill = "003043";
  }

  if (player.level >= 64) {
    icon.cleanshot = icon.heatedcleanshot;
  }
  else {
    icon.cleanshot = "003004";
  }

  if (player.level >= 60) {
    icon.slugshot = icon.heatedslugshot;
  }
  else {
    icon.slugshot = "003002";
  }

  if (player.level >= 54) {
    icon.splitshot = icon.heatedsplitshot;
  }
  else {
    icon.splitshot = "003001";
  }

  if (player.level >= 52
  && toggle.aoe) {
    icon.heatblast = icon.autocrossbow;
  }
  else {
    icon.heatblast = "003030";
  }

  // Show available cooldowns

  if (player.level >= 4
  && checkCooldown("hotshot", player.ID) < 0) {
    addIconBlink(nextid.hotshot, icon.hotshot);
  }
  else {
    removeIcon(nextid.hotshot);
  }

  if (player.level >= 10
  && checkCooldown("reassemble", player.ID) < 0) {
    addIconBlink(nextid.reassemble, icon.reassemble);
  }
  else {
    removeIcon(nextid.reassemble);
  }

  if (player.level >= 15
  && checkCooldown("gaussround1", player.ID) < 0) {
    addIconBlink(nextid.gaussround, icon.gaussround);
  }
  else {
    removeIcon(nextid.gaussround);
  }

  if (player.level >= 45
  && checkCooldown("wildfire", player.ID) < 0) {
    addIconBlink(nextid.wildfire, icon.wildfire);
  }
  else {
    removeIcon(nextid.wildfire);
  }

  if (player.level >= 50
  && checkCooldown("ricochet1", player.ID) < 0) {
    addIconBlink(nextid.ricochet, icon.ricochet);
  }
  else {
    removeIcon(nextid.ricochet);
  }

  if (player.level >= 58
  && checkCooldown("drill", player.ID) < 0) {
    addIconBlink(nextid.drill, icon.drill);
  }
  else {
    removeIcon(nextid.drill);
  }

  if (player.level >= 66
  && checkCooldown("barrelstabilizer", player.ID) < 0) {
    addIconBlink(nextid.barrelstabilizer, icon.barrelstabilizer);
  }
  else {
    removeIcon(nextid.barrelstabilizer);
  }

  if (player.level >= 70
  && toggle.aoe
  && checkCooldown("flamethrower", player.ID) < 0) {
    addIconBlink(nextid.flamethrower, icon.flamethrower);
  }
  else {
    removeIcon(nextid.flamethrower);
  }

}


function mchAction() {

  if (actionList.mch.indexOf(actionGroups.actionname) > -1) {

    removeText("loadmessage");

    // Toggle AoE

    if ([
      "Spread Shot", "Auto Crossbow", "Flamethrower", "Bioblaster"
    ].indexOf(actionGroups.actionname) > -1) {
      toggle.aoe = Date.now();
      if (player.level >= 72) {
        icon.drill = icon.bioblaster;
      }
      if (player.level >= 52) {
        icon.heatblast = icon.autocrossbow;
      }
      if (player.level >= 70
      && checkCooldown("flamethrower", player.ID) < 0) {
        addIconBlink(nextid.flamethrower, icon.flamethrower);
      }
      addIconBlinkTimeout("drill", checkCooldown("drill", player.ID), nextid.drill, icon.drill); // Not sure if necessary
    }
    else if ([
      "Split Shot", "Slug Shot", "Clean Shot", "Heated Split Shot",
      "Heated Slug Shot", "Heated Clean Shot", "Hot Shot", "Heat Blast"
    ].indexOf(actionGroups.actionname) > -1) {
      delete toggle.aoe;
      icon.drill = "003043";
      icon.heatblast = "003030";
      addIconBlinkTimeout("drill", checkCooldown("drill", player.ID), nextid.drill, icon.drill);
      removeIcon(nextid.flamethrower);
    }

    // These actions don't interrupt combos

    if (["Hot Shot", "Air Anchor"].indexOf(actionGroups.actionname) > -1) {
      if (previous.hotshot
      && recast.hotshot > Date.now() - previous.hotshot) {
        recast.hotshot = Date.now() - previous.hotshot;
      }
      previous.hotshot = Date.now();
      removeIcon(nextid.hotshot);
      addCooldown("hotshot", player.ID, recast.hotshot);
      addIconBlinkTimeout("hotshot", recast.hotshot, nextid.hotshot, icon.hotshot);
      mchBattery();
    }

    else if (["Drill", "Bioblaster"].indexOf(actionGroups.actionname) > -1) {
      if (previous.drill
      && recast.drill > Date.now() - previous.drill) {
        recast.drill = Date.now() - previous.drill;
      }
      previous.drill = Date.now();
      removeIcon(nextid.drill);
      addCooldown("drill", player.ID, recast.drill);
      addIconBlinkTimeout("drill", recast.drill, nextid.drill, icon.drill);
    }

    else if (["Heat Blast", "Auto Crossbow"].indexOf(actionGroups.actionname) > -1) {
      addCooldown("gaussround1", player.ID, checkCooldown("gaussround1", player.ID) - 15000);
      addCooldown("gaussround2", player.ID, checkCooldown("gaussround2", player.ID) - 15000);
      addCooldown("ricochet1", player.ID, checkCooldown("ricochet1", player.ID) - 15000);
      addCooldown("ricochet2", player.ID, checkCooldown("ricochet2", player.ID) - 15000);
      if (player.level >= 74) {
        addCooldown("gaussround3", player.ID, checkCooldown("gaussround3", player.ID) - 15000);
        addCooldown("ricochet3", player.ID, checkCooldown("ricochet3", player.ID) - 15000);
      }
    }

    else if ("Gauss Round" == actionGroups.actionname) {
      if (player.level >= 74) {
        if (checkCooldown("gaussround3", player.ID) < 0) {
          addCooldown("gaussround3", player.ID, recast.gaussround);
        }
        else if (checkCooldown("gaussround2", player.ID) < 0) {
          addCooldown("gaussround2", player.ID, checkCooldown("gaussround3", player.ID));
          addCooldown("gaussround3", player.ID, checkCooldown("gaussround3", player.ID) + recast.gaussround);
        }
        else if (checkCooldown("gaussround1", player.ID) < 0) {
          addCooldown("gaussround1", player.ID, checkCooldown("gaussround2", player.ID));
          addCooldown("gaussround2", player.ID, checkCooldown("gaussround2", player.ID) + recast.gaussround);
          addCooldown("gaussround3", player.ID, checkCooldown("gaussround3", player.ID) + recast.gaussround);
        }
      }
      else {
        if (checkCooldown("gaussround2", player.ID) < 0) {
          addCooldown("gaussround2", player.ID, recast.gaussround);
        }
        else if (checkCooldown("gaussround1", player.ID) < 0) {
          addCooldown("gaussround1", player.ID, checkCooldown("gaussround2", player.ID));
          addCooldown("gaussround2", player.ID, checkCooldown("gaussround2", player.ID) + recast.gaussround);
        }
      }
    }

    else if ("Ricochet" == actionGroups.actionname) {
      if (player.level >= 74) {
        if (checkCooldown("ricochet3", player.ID) < 0) {
          addCooldown("ricochet3", player.ID, recast.ricochet);
        }
        else if (checkCooldown("ricochet2", player.ID) < 0) {
          addCooldown("ricochet2", player.ID, checkCooldown("ricochet3", player.ID));
          addCooldown("ricochet3", player.ID, checkCooldown("ricochet3", player.ID) + recast.ricochet);
        }
        else if (checkCooldown("ricochet1", player.ID) < 0) {
          addCooldown("ricochet1", player.ID, checkCooldown("ricochet2", player.ID));
          addCooldown("ricochet2", player.ID, checkCooldown("ricochet2", player.ID) + recast.ricochet);
          addCooldown("ricochet3", player.ID, checkCooldown("ricochet3", player.ID) + recast.ricochet);
        }
      }
      else {
        if (checkCooldown("ricochet2", player.ID) < 0) {
          addCooldown("ricochet2", player.ID, recast.ricochet);
        }
        else if (checkCooldown("ricochet1", player.ID) < 0) {
          addCooldown("ricochet1", player.ID, checkCooldown("ricochet2", player.ID));
          addCooldown("ricochet2", player.ID, checkCooldown("ricochet2", player.ID) + recast.ricochet);
        }
      }
    }

    else if ("Reassemble" == actionGroups.actionname) {
      removeIcon(nextid.reassemble);
      addCooldown("reassemble", player.ID, recast.reassemble);
      addIconBlinkTimeout("reassemble", recast.reassemble, nextid.reassemble, icon.reassemble);
    }

    else if ("Hypercharge" == actionGroups.actionname) {
      removeIcon(nextid.hypercharge);
      addCooldown("hypercharge", player.ID, recast.hypercharge);
      addStatus("hypercharge", player.ID, duration.hypercharge);
      mchHeat();
    }

    else if (["Rook Autoturret", "Automaton Queen"].indexOf(actionGroups.actionname) > -1) {
      removeIcon(nextid.rookautoturret);
    }

    else if ("Wildfire" == actionGroups.actionname) {
      removeIcon(nextid.wildfire);
      addCooldown("wildfire", player.ID, recast.wildfire);
    }

    else if ("Barrel Stabilizer" == actionGroups.actionname) {
      removeIcon(nextid.barrelstabilizer);
      addCooldown("barrelstabilizer", player.ID, recast.barrelstabilizer);
      mchHeat();
    }

    // Combo

    else if (["Split Shot", "Heated Split Shot"].indexOf(actionGroups.actionname) > -1
    && actionGroups.result.length >= 2) {
      if (!next.combo) {
       mchCombo();
      }
      toggle.combo = Date.now();
      removeIcon(nextid.splitshot);
      mchHeat();
      mchComboTimeout();
    }

    else if (["Slug Shot", "Heated Slug Shot"].indexOf(actionGroups.actionname) > -1
    && actionGroups.result.length == 8) {
      removeIcon(nextid.slugshot);
      mchHeat();
      if (player.level < 26) {
        delete toggle.combo;
        delete next.combo;
        mchCombo();
      }
      else {
        mchComboTimeout();
      }
    }

    else if (["Clean Shot", "Heated Clean Shot"].indexOf(actionGroups.actionname) > -1
    && actionGroups.result.length == 8) {
      removeIcon(nextid.cleanshot);
      mchHeat();
      mchBattery();
      delete toggle.combo;
      delete next.combo;
      mchCombo();
    }

    else if ("Spread Shot" == actionGroups.actionname) {
      removeIcon(nextid.spreadshot);
      mchHeat();
      delete toggle.combo;
      delete next.combo;
      mchCombo();
    }

    else { // Everything else finishes or breaks combo
      delete toggle.combo;
      delete next.combo;
      mchCombo();
    }
  }
}

function mchStatus() {
  if (statusGroups.statusname == "Wildfire") {
    addStatus("wildfire", statusGroups.targetID, statusGroups.duration * 1000);
  }
}

function mchCombo() {

  // Reset icons
  removeIcon(nextid.splitshot);
  removeIcon(nextid.slugshot);
  removeIcon(nextid.cleanshot);

  if (toggle.aoe) { // AoE\
    next.combo = 2;
    addIcon(nextid.spreadshot,icon.spreadshot);
  }

  else {
    next.combo = 1;
    addIcon(nextid.splitshot,icon.splitshot);
    if (player.level >= 2) {
      addIcon(nextid.slugshot,icon.slugshot);
    }
    if (player.level >= 26) {
      addIcon(nextid.cleanshot,icon.cleanshot);
    }
  }
}

function mchComboTimeout() { // Set between combo actions
  clearTimeout(timeout.combo);
  timeout.combo = setTimeout(mchCombo, 12500);
}

function mchHeat() {
  // get player.heat from player.debugJob
  if (player.heat >= 50
  && checkCooldown("hypercharge", player.ID) < 2500
  && checkCooldown("drill", player.ID) > 12500
  && (player.level >= 76 && checkCooldown("hotshot", player.ID) > 12500)) {
    addIconBlink(nextid.hypercharge, icon.hypercharge);
  }
  else {
    removeIcon(nextid.hypercharge);
  }
}

function mchBattery() {
  // get player.battery from player.debugJob
  if (player.battery >= 50) {
    addIconBlink(nextid.rookautoturret, icon.rookautoturret);
  }
  else {
    removeIcon(nextid.rookautoturret);
  }
}
