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

  id.heatblast = 0;
  id.autocrossbow = id.heatblast;
  id.reassemble = 1;
  id.drill = 2;
  id.bioblaster = id.drill;
  id.hotshot = 3;
  id.airanchor = id.hotshot;
  id.splitshot = 4;
  id.heatedsplitshot = id.splitshot;
  id.spreadshot = id.splitshot;
  id.slugshot = 4;
  id.heatedslugshot = id.slugshot;
  id.cleanshot = 5;
  id.heatedcleanshot = id.cleanshot;
  id.rookautoturret = 10;
  id.rookoverdrive = id.rookautoturret;
  id.automatonqueen = id.rookautoturret;
  id.queenoverdrive = id.rookautoturret;
  id.barrelstabilizer = 11;
  id.wildfire = 12;
  id.detonator = id.wildfire;
  id.hypercharge = 13;
  id.gaussround = 14;
  id.ricochet = 15;
  id.flamethrower = 16;
  // id.tactician = ?;

  if (player.level >= 76) {
    icon.hotshot = icon.airanchor;
  }
  else {
    icon.hotshot = "003003";
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
}


function mchAction() {

  if (actionList.mch.indexOf(actionGroups.actionname) > -1) {

    removeText("loadmessage");

    // Toggle AoE

    if ([
      "Spread Shot", "Auto Crossbow", "Flamethrower", "Bioblaster"
    ].indexOf(actionGroups.actionname) > -1) {
      toggle.aoe = Date.now();
    }
    else if ([
      "Split Shot", "Slug Shot", "Clean Shot", "Heated Split Shot",
      "Heated Slug Shot", "Heated Clean Shot", "Hot Shot", "Heat Blast"
    ].indexOf(actionGroups.actionname) > -1) {
      delete toggle.aoe;
    }

    // These actions don't interrupt combos

    if (["Hot Shot", "Air Anchor"].indexOf(actionGroups.actionname) > -1) {
      if (previous.hotshot
          && recast.hotshot > Date.now() - previous.hotshot) {
        recast.hotshot = Date.now() - previous.hotshot;
      }
      previous.hotshot = Date.now();
      addCooldown("hotshot", player.ID, recast.hotshot);
    }

    else if (["Drill", "Bioblaster"].indexOf(actionGroups.actionname) > -1) {
      if (previous.drill
          && recast.drill > Date.now() - previous.drill) {
        recast.drill = Date.now() - previous.drill;
      }
      previous.drill = Date.now();
      addCooldown("drill", player.ID, recast.drill);
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
      removeIcon(id.reassemble);
      addCooldown("reassemble", player.ID, recast.reassemble);
      addIconBlinkTimeout("reassemble", recast.reassemble, id.reassemble, icon.reassemble);
    }

    else if ("Hypercharge" == actionGroups.actionname) {
      removeIcon(id.hypercharge);
      addCooldown("hypercharge", player.ID, recast.hypercharge);
      addStatus("hypercharge", player.ID, duration.hypercharge)
    }

    else if (["Rook Autoturret", "Automaton Queen"].indexOf(actionGroups.actionname) > -1) {
      removeIcon(id.rookautoturret);
    }

    else if ("Wildfire" == actionGroups.actionname) {
      removeIcon(id.wildfire);
      addCooldown("wildfire", player.ID, recast.wildfire);
    }

    else if ("Barrel Stabilizer" == actionGroups.actionname) {
      removeIcon(id.barrelstabilizer);
      addCooldown("barrelstabilizer", player.ID, recast.barrelstabilizer);
    }

    // Combo

    else if (["Split Shot", "Heated Split Shot"].indexOf(actionGroups.actionname) > -1
    && logLine[6].length >= 2) {
      if (!next.combo) {
       mchCombo();
      }
      toggle.combo = Date.now();
      removeIcon(id.splitshot);
      mchHeat();
      mchComboTimeout();
    }

    else if (["Slug Shot", "Heated Slug Shot"].indexOf(actionGroups.actionname) > -1
    && logLine[6].length == 8) {
      removeIcon(id.slugshot);
      mchHeat();
      mchComboTimeout();
      if (player.level < 26) {
        delete toggle.combo;
        delete next.combo;
        mchCombo();
      }
    }

    else if (["Clean Shot", "Heated Clean Shot"].indexOf(actionGroups.actionname) > -1
    && logLine[6].length == 8) {
      removeIcon(id.cleanshot);
      mchHeat();
      mchBattery();
      delete toggle.combo;
      delete next.combo;
      mchCombo();
    }

    else if (["Spread Shot" == actionGroups.actionname) {
      removeIcon(id.spreadshot);
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

function mchStatus(logLine) {
  if (statusGroups.statusname == "Wildfire") {
    addStatus("wildfire", statusGroups.targetID, statusGroups.duration * 1000);
  }
}

function mchCombo() {

  // Reset icons
  removeIcon(id.splitshot);
  removeIcon(id.slugshot);
  removeIcon(id.cleanshot);

  if (toggle.aoe) { // AoE\
    next.combo = 2;
    addIcon(id.spreadshot,icon.spreadshot);
  }

  else {
    next.combo = 1;
    addIcon(id.splitshot,icon.splitshot);
    if (player.level >= 2) {
      addIcon(id.slugshot,icon.slugshot);
    }
    if (player.level >= 26) {
      addIcon(id.cleanshot,icon.cleanshot);
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
  && (player.level >= 76 && checkCooldown("hotshot", player.ID) > 12500) {
    addIconBlink(id.hypercharge, icon.hypercharge);
  }
  else {
    removeIcon(id.hypercharge);
  }
}

function mchBattery() {
  // get player.battery from player.debugJob
  if (player.battery >= 50) {
    addIconBlink(id.rookautoturret, icon.rookautoturret);
  }
  else {
    removeIcon(id.rookautoturret);
  }
}
