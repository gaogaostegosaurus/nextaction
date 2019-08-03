"use strict";

actionList.mch = [

  // Non-GCD
  "Reassemble", "Gauss Round", "Hypercharge", "Rook Autoturret", "Wildfire",
  "Ricochet", "Tactician", "Barrel Stabilizer", "Flamethrower",
  "Automaton Queen",
  "Second Wind", "Peloton", "Head Graze",

  // GCD
  "Split Shot", "Slug Shot", "Clean Shot",
  "Heated Split Shot", "Heated Slug Shot", "Heated Clean Shot",
  "Spread Shot",
  "Hot Shot", "Air Anchor", "Drill", "Bioblaster",
  "Heat Blast", "Auto Crossbow"

];

function mchJobChange() {

  nextid.heatblast = 0;
  nextid.autocrossbow = nextid.heatblast;
  nextid.reassemble = 1;
  nextid.drill = nextid.reassemble;
  nextid.bioblaster = nextid.reassemble;
  nextid.hotshot = 3;
  nextid.airanchor = nextid.hotshot;
  nextid.splitshot = 4;
  nextid.heatedsplitshot = nextid.splitshot;
  nextid.spreadshot = nextid.splitshot;
  nextid.slugshot = 5;
  nextid.heatedslugshot = nextid.slugshot;
  nextid.cleanshot = 6;
  nextid.heatedcleanshot = nextid.cleanshot;
  nextid.barrelstabilizer = 10;
  nextid.hypercharge = 11;
  nextid.wildfire = nextid.hypercharge;
  nextid.flamethrower = nextid.hypercharge;
  nextid.rookautoturret = 12;
  nextid.rookoverdrive = nextid.rookautoturret;
  nextid.automatonqueen = nextid.rookautoturret;
  nextid.queenoverdrive = nextid.rookautoturret;
  nextid.gaussround = 13;
  nextid.ricochet = 14;

  countdownid.barrelstabilizer = 0;
  countdownid.wildfire = 1;
  countdownid.drill = 2;
  countdownid.hotshot = 3;
  countdownid.reassemble = 4;
  countdownid.gaussround = 5;
  countdownid.ricochet = 6;

  // nextid.tactician = 99;

  previous.spreadshot = 0;
  previous.ricochet = 0;
  previous.flamethrower = 0;
  previous.autocrossbow = 0;
  previous.drill = 0;
  previous.bioblaster = 0;

  // Set up action changes from level

  if (player.level >= 76) {
    icon.hotshot = icon.airanchor;
  }
  else {
    icon.hotshot = "003003";
  }

  if (player.level >= 72
  && count.aoe >= 2) {
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
  && count.aoe >= 3) {
    icon.heatblast = icon.autocrossbow;
  }
  else {
    icon.heatblast = "003030";
  }

  // Show available cooldowns

  addCountdownBar("hotshot", checkCooldown("hotshot"));

  if (player.level >= 15) {
    addCountdownBar("gaussround", checkCooldown("gaussround1", player.ID));
  }

  if (player.level >= 50) {
    addCountdownBar("ricochet", checkCooldown("ricochet1", player.ID));
  }

  if (player.level >= 10) {
    addCountdownBar("reassemble", checkCooldown("reassemble"));
  }

  if (player.level >= 58) {
    addCountdownBar("drill", checkCooldown("drill"));
  }

  mchHeat();
  mchBattery();
  mchCombo();
}

function mchPlayerChangedEvent() {

  nextid.heatblast = 0; // Not sure if necessary but whatever

  if (player.level >= 52
  && count.aoe >= 3) {
    icon.heatblast == icon.autocrossbow;
  }
  else {
    icon.heatblast = "003030";
  }

  if (player.jobDetail.overheatMilliseconds > 0) {
    addIconBlink(nextid.heatblast, icon.heatblast);
  }
  else {
    removeIcon("heatblast");
  }
}

function mchAction() {

  if (actionList.mch.indexOf(actionGroups.actionname) > -1) {

    // Toggle AoE

    if (player.level >= 70
    && checkCooldown("flamethrower") < 0
    && count.aoe >= 2) {
      addIconBlink(nextid.flamethrower, icon.flamethrower);
    }
    else {
      removeIcon("flamethrower");
    }

    if (player.level >= 72
    && count.aoe >= 2) {
      icon.drill == icon.bioblaster;
    }
    else {
      icon.drill = "003043";
    }

    // These actions don't interrupt combos

    if (["Hot Shot", "Air Anchor"].indexOf(actionGroups.actionname) > -1) {
      if (previous.hotshot
      && recast.hotshot > Date.now() - previous.hotshot) {
        recast.hotshot = Date.now() - previous.hotshot;
      }
      previous.hotshot = Date.now();
      removeIcon("hotshot");
      addCooldown("hotshot");
      addCountdownBar("hotshot", recast.hotshot);
      mchBattery();
      mchHeat();
    }

    else if ("Drill" == actionGroups.actionname) {
      count.aoe = 1;
      if (recast.drill > Date.now() - previous.drill) {
        recast.drill = Date.now() - previous.drill; // Adjusts cooldown
      }
      previous.drill = Date.now();
      removeIcon("drill");
      addCooldown("drill");
      addCountdownBar("drill", recast.drill);
      if (checkCooldown("reassemble") < checkCooldown("drill")) {
        addIconBlinkTimeout("drill", recast.drill - 1000, nextid.drill, icon.reassemble);
      }
      else {
        addIconBlinkTimeout("drill", recast.drill - 1000, nextid.drill, icon.drill);
      }
      mchHeat();
    }

    else if ("Bioblaster" == actionGroups.actionname) {
      if (Date.now() - previous.drill > 1000) {
        count.aoe = 1;
        // Recast adjust has to go here, otherwise Drill/Bioblaster become 0s recast due to AoE spam
        if (recast.drill > Date.now() - previous.drill) {
          recast.drill = Date.now() - previous.drill;
        }
        previous.drill = Date.now();
      }
      else {
        count.aoe = count.aoe + 1;
      }
      removeIcon("drill");
      addCooldown("drill");
      addIconBlinkTimeout("drill", recast.drill - 1000, nextid.drill, icon.drill);
      mchHeat();
    }

    else if ("Heat Blast" == actionGroups.actionname) {

      addCooldown("gaussround1", player.ID, checkCooldown("gaussround1", player.ID) - 15000);
      addCooldown("gaussround2", player.ID, checkCooldown("gaussround2", player.ID) - 15000);
      addCooldown("ricochet1", player.ID, checkCooldown("ricochet1", player.ID) - 15000);
      addCooldown("ricochet2", player.ID, checkCooldown("ricochet2", player.ID) - 15000);
      if (player.level >= 74) {
        addCooldown("gaussround3", player.ID, checkCooldown("gaussround3", player.ID) - 15000);
        addCooldown("ricochet3", player.ID, checkCooldown("ricochet3", player.ID) - 15000);
      }
    }

    else if ("Auto Crossbow" == actionGroups.actionname
    && actionGroups.result.length >= 2) {
      if (Date.now() - previous.autocrossbow > 1000) {
        count.aoe = 1;
        previous.autocrossbow = Date.now();
      }
      else {
        count.aoe = count.aoe + 1;
      }
    }

    else if ("Flamethrower" == actionGroups.actionname) {
      if (Date.now() - previous.flamethrower > 1000) {
        previous.flamethrower = Date.now();
        count.aoe = 1;
      }
      else {
        count.aoe = count.aoe + 1;
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
          removeIcon("gaussround");
          addIconBlinkTimeout("gaussround", checkCooldown("gaussround1", player.ID), nextid.gaussround, icon.gaussround);
        }
      }
      else {
        if (checkCooldown("gaussround2", player.ID) < 0) {
          addCooldown("gaussround2", player.ID, recast.gaussround);
        }
        else if (checkCooldown("gaussround1", player.ID) < 0) {
          addCooldown("gaussround1", player.ID, checkCooldown("gaussround2", player.ID));
          addCooldown("gaussround2", player.ID, checkCooldown("gaussround2", player.ID) + recast.gaussround);
          removeIcon("gaussround");
          addIconBlinkTimeout("gaussround", checkCooldown("gaussround1", player.ID), nextid.gaussround, icon.gaussround);
        }
      }
    }

    else if ("Ricochet" == actionGroups.actionname) {
      if (Date.now() - previous.ricochet > 1000) {
        previous.ricochet = Date.now();
        count.aoe = 1;
      }
      else {
        count.aoe = count.aoe + 1;
      }
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
          removeIcon("ricochet");
          addIconBlinkTimeout("ricochet", checkCooldown("ricochet1", player.ID), nextid.ricochet, icon.ricochet);
        }
      }
      else {
        if (checkCooldown("ricochet2", player.ID) < 0) {
          addCooldown("ricochet2", player.ID, recast.ricochet);
        }
        else if (checkCooldown("ricochet1", player.ID) < 0) {
          addCooldown("ricochet1", player.ID, checkCooldown("ricochet2", player.ID));
          addCooldown("ricochet2", player.ID, checkCooldown("ricochet2", player.ID) + recast.ricochet);
          removeIcon("ricochet");
          addIconBlinkTimeout("ricochet", checkCooldown("ricochet1", player.ID), nextid.ricochet, icon.ricochet);
        }
      }
    }

    else if ("Reassemble" == actionGroups.actionname) {
      removeIcon("reassemble");
      addCooldown("reassemble");
      if (player.level >= 58
      && checkCooldown("drill") < 0) {
        addIcon("drill");
      }
    }

    else if ("Hypercharge" == actionGroups.actionname) {
      removeIcon("hypercharge");
      mchHeat();
    }

    else if (["Rook Autoturret", "Automaton Queen"].indexOf(actionGroups.actionname) > -1) {
      removeIcon("rookautoturret");
      mchBattery();
    }

    else if ("Wildfire" == actionGroups.actionname) {
      removeIcon("wildfire");
      addCooldown("wildfire");
      mchHeat();
    }

    else if ("Barrel Stabilizer" == actionGroups.actionname) {
      removeIcon("barrelstabilizer");
      addCooldown("barrelstabilizer");
      mchHeat();
    }

    // Combo

    else if (["Split Shot", "Heated Split Shot"].indexOf(actionGroups.actionname) > -1
    && actionGroups.result.length >= 2) {
      if (count.aoe >= 3) {
        count.aoe == 2;
      }
      if (!next.combo) {
       mchCombo();
      }
      toggle.combo = Date.now();
      removeIcon("splitshot");
      mchHeat();
      mchComboTimeout();
    }

    else if (["Slug Shot", "Heated Slug Shot"].indexOf(actionGroups.actionname) > -1
    && actionGroups.result.length == 8) {
      removeIcon("slugshot");
      mchHeat();
      if (player.level < 26) {
        mchCombo();
      }
      else {
        mchComboTimeout();
      }
    }

    else if (["Clean Shot", "Heated Clean Shot"].indexOf(actionGroups.actionname) > -1
    && actionGroups.result.length == 8) {
      removeIcon("cleanshot");
      mchHeat();
      mchBattery();
      mchCombo();
    }

    else if ("Spread Shot" == actionGroups.actionname) {
      if (Date.now() - previous.spreadshot > 1000) {
        previous.spreadshot = Date.now();
        count.aoe = 1;
      }
      else {
        count.aoe = count.aoe + 1;
      }
      removeIcon("spreadshot");
      mchHeat();
      mchCombo();
    }

    else { // Everything else finishes or breaks combo
      mchCombo();
    }
  }
}

function mchStatus() {
 //????
}

function mchCombo() {

  delete toggle.combo;
  delete next.combo;

  // Reset icons
  removeIcon("splitshot");
  removeIcon("slugshot");
  removeIcon("cleanshot");

  if (player.level >= 80
  && count.aoe >= 3) {
    next.combo = 2;
    addIcon("spreadshot");
  }
  else if (player.level < 80
  && count.aoe == 2) {
    next.combo = 2;
    addIcon("spreadshot");
  }
  else {
    next.combo = 1;
    addIcon("splitshot");
    if (player.level >= 2) {
      addIcon("slugshot");
    }
    if (player.level >= 26) {
      addIcon("cleanshot");
    }
  }
}

function mchComboTimeout() { // Set between combo actions
  clearTimeout(timeout.combo);
  timeout.combo = setTimeout(mchCombo, 12500);
}

function mchHeat() {

  if (player.jobDetail.heat >= 50
  && (player.level < 58 || checkCooldown("drill") > 9000)
  && (player.level < 76 || checkCooldown("hotshot") > 9000)) {
    if (player.level >= 45
    && checkCooldown("wildfire") < 1000) {
      addIconBlink(nextid.wildfire, icon.wildfire);
    }
    else {
      addIconBlink(nextid.hypercharge, icon.hypercharge);
    }
  }
  else if (player.jobDetail.heat >= 95) {
    if (player.level >= 45
    && checkCooldown("wildfire") < 1000) {
      addIconBlink(nextid.wildfire, icon.wildfire);
    }
    else {
      addIconBlink(nextid.hypercharge, icon.hypercharge);
    }
  }
  else if (player.level >= 66
  && player.jobDetail.heat < 50
  && checkCooldown("wildfire") < 3500
  && checkCooldown("barrelstabilizer") < 1000) {
    addIconBlink(nextid.barrelstabilizer, icon.barrelstabilizer);
  }
  else {
    removeIcon("hypercharge");
  }
}

function mchBattery() {
  if (player.jobDetail.battery >= 50) {
    addIconBlink(nextid.rookautoturret, icon.rookautoturret);
  }
  else {
    removeIcon("rookautoturret");
  }
}
