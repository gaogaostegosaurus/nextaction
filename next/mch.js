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

  countdownid.barrelstabilizer = 10;
  countdownid.wildfire = 11;
  countdownid.drill = 0;
  countdownid.hotshot = 1;
  countdownid.reassemble = 2;
  countdownid.gaussround = 3;
  countdownid.ricochet = 4;

  // nextid.tactician = 99;

  previous.hotshot = 0;
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
  && enemyTargets >= 2) {
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
  && enemyTargets >= 3) {
    icon.heatblast = icon.autocrossbow;
  }
  else {
    icon.heatblast = "003030";
  }

  // Show available cooldowns

  addCountdownBar("hotshot", checkRecast("hotshot"), "icon");

  if (player.level >= 15) {
    addCountdownBar("gaussround", checkRecast("gaussround1"));
  }

  if (player.level >= 50) {
    addCountdownBar("ricochet", checkRecast("ricochet1"));
  }

  if (player.level >= 10) {
    addCountdownBar("reassemble", checkRecast("reassemble"));
  }

  if (player.level >= 58) {
    addCountdownBar("drill", checkRecast("drill"), "icon");
  }

  mchHeat();
  mchBattery();
  mchCombo();
}

function mchPlayerChangedEvent() {

  nextid.heatblast = 0; // Not sure if necessary but whatever

  if (player.level >= 52
  && enemyTargets >= 3) {
    icon.heatblast == icon.autocrossbow;
  }
  else {
    icon.heatblast = "003030";
  }

  if (player.jobDetail.overheatMilliseconds > 0) {
    addIcon({name: "heatblast"});
  }
  else {
    removeIcon("heatblast");
  }
}

function mchAction() {

  if (actionList.mch.indexOf(actionLog.groups.actionName) > -1) {

    // These actions don't interrupt combos

    if (["Hot Shot", "Air Anchor"].indexOf(actionLog.groups.actionName) > -1) {
      removeIcon("hotshot");
      if (recast.hotshot > Date.now() - previous.hotshot) {
        recast.hotshot = Date.now() - previous.hotshot;
      }
      previous.hotshot = Date.now();
      addRecast("hotshot");
      addCountdownBar("hotshot", recast.hotshot, "icon");
      mchBattery();
      mchHeat();  // Why? Check later
    }

    else if ("Drill" == actionLog.groups.actionName) {
      enemyTargets = 1;
      if (recast.drill > Date.now() - previous.drill) {
        recast.drill = Date.now() - previous.drill; // Adjusts cooldown
      }
      previous.drill = Date.now();
      addRecast("drill");
      //removeIcon("drill");
      addCountdownBar("drill", recast.drill, "icon");
      // if (checkRecast("reassemble") < checkRecast("drill")) {
      //   addIconBlinkTimeout("drill", recast.drill - 1000, nextid.drill, icon.reassemble);
      // }
      // else {
      //   addIconBlinkTimeout("drill", recast.drill - 1000, nextid.drill, icon.drill);
      // }
      mchHeat();
    }

    else if ("Bioblaster" == actionLog.groups.actionName) {
      if (Date.now() - previous.drill > 1000) {
        enemyTargets = 1;
        // Recast adjust has to go here, otherwise Drill/Bioblaster become 0s recast due to AoE spam
        if (recast.drill > Date.now() - previous.drill) {
          recast.drill = Date.now() - previous.drill;
        }
        previous.drill = Date.now();
      }
      else {
        enemyTargets = enemyTargets + 1;
      }
      removeIcon("drill");
      addRecast("drill");
      addIconBlinkTimeout("drill", recast.drill - 1000, nextid.drill, icon.drill);
      mchHeat();
    }

    else if ("Heat Blast" == actionLog.groups.actionName) {

      addRecast("gaussround1", player.ID, checkRecast("gaussround1", player.ID) - 15000);
      addRecast("gaussround2", player.ID, checkRecast("gaussround2", player.ID) - 15000);
      addRecast("ricochet1", player.ID, checkRecast("ricochet1", player.ID) - 15000);
      addRecast("ricochet2", player.ID, checkRecast("ricochet2", player.ID) - 15000);
      if (player.level >= 74) {
        addRecast("gaussround3", player.ID, checkRecast("gaussround3", player.ID) - 15000);
        addRecast("ricochet3", player.ID, checkRecast("ricochet3", player.ID) - 15000);
      }
    }

    else if ("Auto Crossbow" == actionLog.groups.actionName
    && actionLog.groups.result.length >= 2) {
      if (Date.now() - previous.autocrossbow > 1000) {
        enemyTargets = 1;
        previous.autocrossbow = Date.now();
      }
      else {
        enemyTargets = enemyTargets + 1;
      }
    }

    else if ("Flamethrower" == actionLog.groups.actionName) {
      if (Date.now() - previous.flamethrower > 1000) {
        previous.flamethrower = Date.now();
        enemyTargets = 1;
      }
      else {
        enemyTargets = enemyTargets + 1;
      }
    }

    else if ("Gauss Round" == actionLog.groups.actionName) {
      if (player.level >= 74) {
        if (checkRecast("gaussround3", player.ID) < 0) {
          addRecast("gaussround3", player.ID, recast.gaussround);
        }
        else if (checkRecast("gaussround2", player.ID) < 0) {
          addRecast("gaussround2", player.ID, checkRecast("gaussround3", player.ID));
          addRecast("gaussround3", player.ID, checkRecast("gaussround3", player.ID) + recast.gaussround);
        }
        else if (checkRecast("gaussround1", player.ID) < 0) {
          addRecast("gaussround1", player.ID, checkRecast("gaussround2", player.ID));
          addRecast("gaussround2", player.ID, checkRecast("gaussround2", player.ID) + recast.gaussround);
          addRecast("gaussround3", player.ID, checkRecast("gaussround3", player.ID) + recast.gaussround);
          removeIcon("gaussround");
          addIconBlinkTimeout("gaussround", checkRecast("gaussround1", player.ID), nextid.gaussround, icon.gaussround);
        }
      }
      else {
        if (checkRecast("gaussround2", player.ID) < 0) {
          addRecast("gaussround2", player.ID, recast.gaussround);
        }
        else if (checkRecast("gaussround1", player.ID) < 0) {
          addRecast("gaussround1", player.ID, checkRecast("gaussround2", player.ID));
          addRecast("gaussround2", player.ID, checkRecast("gaussround2", player.ID) + recast.gaussround);
          removeIcon("gaussround");
          addIconBlinkTimeout("gaussround", checkRecast("gaussround1", player.ID), nextid.gaussround, icon.gaussround);
        }
      }
    }

    else if ("Ricochet" == actionLog.groups.actionName) {
      if (Date.now() - previous.ricochet > 1000) {
        previous.ricochet = Date.now();
        enemyTargets = 1;
      }
      else {
        enemyTargets = enemyTargets + 1;
      }
      if (player.level >= 74) {
        if (checkRecast("ricochet3", player.ID) < 0) {
          addRecast("ricochet3", player.ID, recast.ricochet);
        }
        else if (checkRecast("ricochet2", player.ID) < 0) {
          addRecast("ricochet2", player.ID, checkRecast("ricochet3", player.ID));
          addRecast("ricochet3", player.ID, checkRecast("ricochet3", player.ID) + recast.ricochet);
        }
        else if (checkRecast("ricochet1", player.ID) < 0) {
          addRecast("ricochet1", player.ID, checkRecast("ricochet2", player.ID));
          addRecast("ricochet2", player.ID, checkRecast("ricochet2", player.ID) + recast.ricochet);
          addRecast("ricochet3", player.ID, checkRecast("ricochet3", player.ID) + recast.ricochet);
          removeIcon("ricochet");
          addIconBlinkTimeout("ricochet", checkRecast("ricochet1", player.ID), nextid.ricochet, icon.ricochet);
        }
      }
      else {
        if (checkRecast("ricochet2", player.ID) < 0) {
          addRecast("ricochet2", player.ID, recast.ricochet);
        }
        else if (checkRecast("ricochet1", player.ID) < 0) {
          addRecast("ricochet1", player.ID, checkRecast("ricochet2", player.ID));
          addRecast("ricochet2", player.ID, checkRecast("ricochet2", player.ID) + recast.ricochet);
          removeIcon("ricochet");
          addIconBlinkTimeout("ricochet", checkRecast("ricochet1", player.ID), nextid.ricochet, icon.ricochet);
        }
      }
    }

    else if ("Reassemble" == actionLog.groups.actionName) {
      addCountdownBar("reassemble");
      if (player.level >= 58
      && checkRecast("drill") < 0) {
        addIcon({name: "drill"});
      }
    }

    else if ("Hypercharge" == actionLog.groups.actionName) {
      removeIcon("hypercharge");
      mchHeat();
    }

    else if (["Rook Autoturret", "Automaton Queen"].indexOf(actionLog.groups.actionName) > -1) {
      removeIcon("rookautoturret");
      mchBattery();
    }

    else if ("Wildfire" == actionLog.groups.actionName) {
      removeIcon("wildfire");
      addRecast("wildfire");
      mchHeat();
    }

    else if ("Barrel Stabilizer" == actionLog.groups.actionName) {
      removeIcon("barrelstabilizer");
      addRecast("barrelstabilizer");
      mchHeat();
    }

    // Combo

    else if (["Split Shot", "Heated Split Shot"].indexOf(actionLog.groups.actionName) > -1
    && actionLog.groups.result.length >= 2) {
      if (enemyTargets >= 3) {
        enemyTargets == 2;
      }
      if (!next.combo) {
       mchCombo();
      }
      toggle.combo = Date.now();
      removeIcon("splitshot");
      mchHeat();
      mchComboTimeout();
    }

    else if (["Slug Shot", "Heated Slug Shot"].indexOf(actionLog.groups.actionName) > -1
    && actionLog.groups.result.length == 8) {
      removeIcon("slugshot");
      mchHeat();
      if (player.level < 26) {
        mchCombo();
      }
      else {
        mchComboTimeout();
      }
    }

    else if (["Clean Shot", "Heated Clean Shot"].indexOf(actionLog.groups.actionName) > -1
    && actionLog.groups.result.length == 8) {
      removeIcon("cleanshot");
      mchHeat();
      mchBattery();
      mchCombo();
    }

    else if ("Spread Shot" == actionLog.groups.actionName) {
      if (Date.now() - previous.spreadshot > 1000) {
        previous.spreadshot = Date.now();
        enemyTargets = 1;
      }
      else {
        enemyTargets = enemyTargets + 1;
      }
      removeIcon("spreadshot");
      mchHeat();
      mchCombo();
    }

    else { // Everything else finishes or breaks combo
      mchCombo();
    }

    // Toggle AoE

    if (player.level >= 70
    && checkRecast("flamethrower") < 0
    && enemyTargets >= 2) {
      addIcon({name: "flamethrower"});
    }
    else {
      removeIcon("flamethrower");
    }

    if (player.level >= 72
    && enemyTargets >= 2) {
      icon.drill == icon.bioblaster;
    }
    else {
      icon.drill = "003043";
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
  && enemyTargets >= 3) {
    next.combo = 2;
    addIcon({name: "spreadshot"});
  }
  else if (player.level < 80
  && enemyTargets == 2) {
    next.combo = 2;
    addIcon({name: "spreadshot"});
  }
  else {
    next.combo = 1;
    addIcon({name: "splitshot"});
    if (player.level >= 2) {
      addIcon({name: "slugshot"});
    }
    if (player.level >= 26) {
      addIcon({name: "cleanshot"});
    }
  }
}

function mchComboTimeout() { // Set between combo actions
  clearTimeout(timeout.combo);
  timeout.combo = setTimeout(mchCombo, 12500);
}

function mchHeat() {
  console.log("  Heat:" + player.jobDetail.heat + "  Drill:" + checkRecast("drill") + "  Hotshot:" +  checkRecast("hotshot"));
  if (player.jobDetail.heat >= 50
  && (player.level < 58 || checkRecast("drill") > 9000)
  && (player.level < 76 || checkRecast("hotshot") > 9000)) {  
    addIcon({name: "hypercharge"});
    // if (player.level >= 45
    // && checkRecast("wildfire") < 1000) {
    //   addIcon({name: "wildfire"});
    // }
    // else {
    //   addIcon({name: "hypercharge"});
    // }
    console.log("Go");
  }
  else {
    console.log("No go");
    removeIcon("hypercharge");
  }
}

function mchBattery() {
  if (player.jobDetail.battery >= 50) {
    addIcon({name: "rookautoturret"});
  }
  else {
    removeIcon("rookautoturret");
  }
}
