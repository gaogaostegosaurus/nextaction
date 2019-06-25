"use strict";

actionList.war = ["Heavy Swing", "Skull Sunder", "Overpower", "Tomahawk", "Maim", "Butcher\'s Block", "Storm\'s Path", "Storm\'s Eye",
"Inner Beast", "Steel Cyclone", "Fell Cleave", "Decimate",
"Berserk", "Rampart", "Awareness", "Thrill Of Battle", "Holmgang", "Vengeance", "Unchained", "Infuriate", "Raw Intuition", "Equilibrium", "Onslaught", "Upheaval", "Shake It Off", "Inner Release"];
statusList.war = ["Rampart", "Defiance", "Deliverance", "Berserk", "Unchained", "Storm\'s Eye", "Inner Release", "Inner Beast", "Vengeance", "Raw Intuition", "Slashing Resistance Down", "The Bole"];

id.innerbeast = "nextAction1";
id.steelcyclone = id.innerbeast;
id.fellcleave = id.innerbeast;
id.decimate = id.innerbeast;

id.heavyswing = "nextAction2";
id.skullsunder = "nextAction3";
id.maim = id.skullsunder;
id.butchersblock = "nextAction4";
id.stormspath = id.butchersblock;
id.stormseye = id.butchersblock;

id.rampart = "nextAction11";
id.vengeance = id.rampart;
id.rawintuition = id.rampart;
id.mitigation = "nextAction11";
id.infuriate = "nextAction12";
id.berserk = "nextAction13";
id.innerrelease = id.berserk;
id.unchained = "nextAction14";
id.upheaval = "nextAction15";

icon.overpower = "000254";
icon.maim = "000255";
icon.skullsunder = "000257";
icon.stormspath = "000258";
icon.berserk = "000259";
icon.heavyswing = "000260";
icon.tomahawk = "000261";
icon.butchersblock = "000262";
icon.thrillofbattle = "000263";
icon.stormseye = "000264";
icon.holmgang = "000266";
icon.vengeance = "000267";

icon.defiance = "002551";
icon.steelcyclone = "002552";
icon.innerbeast = "002553";
icon.unchained = "002554";
icon.infuriate = "002555";
icon.deliverance = "002556";
icon.fellcleave = "002557";
icon.decimate = "002558";
icon.rawintuition = "002559";
icon.equilibrium = "002560";
icon.onslaught = "002561";
icon.upheaval = "002562";
icon.shakeitoff = "002563";
icon.innerrelease = "002564";

recast.berserk = 90000;
recast.infuriate = 60000;
recast.rampart = 90000;
recast.rawintuition = 90000;
recast.unchained = 90000;
recast.upheaval = 30000;
recast.vengeance = 120000;

function warPlayerChangedEvent(e) {

  // Spender calculations

  if (player.level >= 70
  && statustime.berserk - Date.now() > 0) {
    addText("debug3", "Berserk/Inner Release");
    gauge.target = 0;
  }
  else if (player.level >= 50
  && cooldowntime.infuriate - Date.now() < 5000) {
    addText("debug3", "Infuriate coming up");
    gauge.target = 50;
  }
  else if (player.level >= 70
  && cooldowntime.berserk - Date.now() < 2500
  && cooldowntime.infuriate - Date.now() < 30000) {
    addText("debug3", "Inner Release + Infuriate coming up");
    gauge.target = 50;
  }
  else {
    addText("debug3", "Build gauge");
    gauge.target = 90;
  }

  addText("debug2", "Gauge target: " + gauge.target + " |  Gauge cap: " + gauge.cap);

  if (player.jobDetail.beast >= gauge.target) {
    if (toggle.stance == 2 && player.level >= 54) {
      addIcon(id.fellcleave,icon.fellcleave);
    }
    else if (player.level >= 35) {
      addIcon(id.innerbeast,icon.innerbeast);
    }
  }
  else {
    removeIcon(id.innerbeast);
  }
}

// Checks and activates things when entering combat
function warInCombatChangedEvent(e) {

  if (player.level >= 46
  && (!cooldowntime.vengeance || cooldowntime.vengeance - Date.now() < 0)) {
    addIcon(id.vengeance,icon.vengeance);
  }
  else if (player.level >= 8
  && (!cooldowntime.rampart || cooldowntime.rampart - Date.now() < 0)) {
    addIcon(id.rampart,icon.rampart);
  }
  else if (player.level >= 56
  && ((!cooldowntime.awareness && !cooldowntime.rawintuition) || Math.max(cooldowntime.awareness,cooldowntime.rawintuition) - Date.now() < 0)) {
    addIcon(id.rawintuition,icon.rawintuition);
  }

  if (player.level >= 6
  && (!cooldowntime.berserk || cooldowntime.berserk - Date.now() < 0)) {
    if (player.level >= 70) {
      addIcon(id.innerrelease,icon.innerrelease);
    }
    else {
      addIcon(id.berserk,icon.berserk);
    }
  }
  if (player.level >= 40
  && (!cooldowntime.unchained || cooldowntime.unchained - Date.now() < 0)) {
    addIcon(id.unchained,icon.unchained);
  }
  if (player.level >= 50
  && (!cooldowntime.infuriate || cooldowntime.infuriate - Date.now() < 0)) {
    addIcon(id.infuriate,icon.infuriate);
  }
  if (player.level >= 64
  && (!cooldowntime.upheaval || cooldowntime.upheaval - Date.now() < 0)) {
    addIcon(id.upheaval,icon.upheaval);
  }

  warCombo();
}

function warAction(logLine) {

  if (logLine[2] == player.name) {

    // These actions don't break combo

    if (logLine[3] == "Berserk"
    || logLine[3] == "Inner Release") {
      cooldowntime.berserk = Date.now() + recast.berserk;
      removeIcon(id.berserk);
      if (player.level >= 70) {
        addIconWithTimeout("berserk",recast.berserk,id.berserk,icon.innerrelease);
      }
      else {
        addIconWithTimeout("berserk",recast.berserk,id.berserk,icon.berserk);
      }
    }

    else if (logLine[3] == "Rampart") {
      cooldowntime.rampart = Date.now() + recast.rampart;
      removeIcon(id.mitigation);
    }

    else if (logLine[3] == "Awareness") {
      cooldowntime.awareness = Date.now() + recast.awareness;
    }

    else if (logLine[3] == "Unchained") {
      cooldowntime.unchained = Date.now() + recast.unchained;
      removeIcon(id.unchained);
      addIconWithTimeout("unchained",recast.unchained,id.unchained,icon.unchained);
    }

    else if (logLine[3] == "Vengeance") {
      cooldowntime.vengeance = Date.now() + recast.vengeance;
      removeIcon(id.mitigation);
    }

    else if (logLine[3] == "Infuriate") {
      cooldowntime.infuriate = Date.now() + recast.infuriate;
      removeIcon(id.infuriate);
      addIconWithTimeout("infuriate",recast.infuriate,id.infuriate,icon.infuriate);
    }

    else if (logLine[3] == "Raw Intuition") {
      cooldowntime.rawintuition = Date.now() + recast.rawintuition;
      removeIcon(id.mitigation);
    }

    else if (logLine[3] == "Upheaval") {
      cooldowntime.upheaval = Date.now() + recast.upheaval;
      removeIcon(id.upheaval);
      if (cooldowntime.berserk - cooldowntime.upheaval < 20000) {
        addIconWithTimeout("upheaval",cooldowntime.berserk - Date.now(),id.upheaval,icon.upheaval);
      }
      else {
        addIconWithTimeout("upheaval",recast.upheaval,id.upheaval,icon.upheaval);
      }
    }

    else if (logLine[3] == "Inner Beast") {
      // Special mitigation stuff here
      toggle.stance = 1;
      removeIcon(id.mitigation);
      if (player.level >= 66) {
        cooldowntime.infuriate = cooldowntime.infuriate - 5000;
        addIconWithTimeout("infuriate",cooldowntime.infuriate - Date.now(),id.infuriate,icon.infuriate);
      }
    }

    else if (logLine[3] == "Steel Cyclone") {
      toggle.stance = 1;
      if (player.level >= 66) {
        cooldowntime.infuriate = cooldowntime.infuriate - 5000;
        addIconWithTimeout("infuriate",cooldowntime.infuriate - Date.now(),id.infuriate,icon.infuriate);
      }
    }

    else if (logLine[3] == "Fell Cleave"
    || logLine[3] == "Decimate") {
      toggle.stance = 2;
      if (player.level >= 66) {
        cooldowntime.infuriate = cooldowntime.infuriate - 5000;
        addIconWithTimeout("infuriate",cooldowntime.infuriate - Date.now(),id.infuriate,icon.infuriate);
      }
    }

    // These actions can break combo

    else {

      if (logLine[3] == "Heavy Swing"
      && logLine[6].length >= 2) {
        if (!toggle.combo) {
          warCombo();
        }
        removeIcon(id.heavyswing);
      }

      else if (logLine[3] == "Skull Sunder"
      && logLine[6].length >= 8) {
        removeIcon(id.heavyswing);
        removeIcon(id.skullsunder);
        if (player.level >= 30) {
          addIcon(id.butchersblock,icon.butchersblock);
        }
        else {
          delete toggle.combo;
          warCombo();
        }
      }

      else if (logLine[3] == "Maim"
      && logLine[6].length >= 8) {
        statustime.slashingresistancedown = Date.now() + 24000;
        removeIcon(id.heavyswing);
        removeIcon(id.maim);
        if (player.level >= 50
        && (!statustime.stormseye || statustime.stormseye - Date.now() < 12500 )) {
          addIcon(id.stormseye,icon.stormseye);
        }
        else if (player.level >= 38) {
          addIcon(id.stormspath,icon.stormspath);
        }
        else {
          delete toggle.combo;
          warCombo();
        }
      }

      else if (logLine[3] == "Storm's Eye"
      && logLine[6].length == 8) {
        statustime.stormseye = Date.now() + 30000;
        delete toggle.combo;
        warCombo();
      }

      else {
        delete toggle.combo;
        warCombo();
      }
    }
  }
}


function warStatus(logLine) {

  // Target and source is anyone

  addText("debug1", logLine[1] + " " + logLine[2] + " " + logLine[3]);

  if (logLine[3] == "Slashing Resistance Down") {
    if (logLine[2] == "gains") {
      statustime.slashingresistancedown = Date.now() + parseInt(logLine[5]) * 1000;
    }
    else if (logLine[2] == "loses") {
      delete statustime.slashingresistancedown;
    }
  }

  // Target is player

  else if (logLine[1] == player.name) {

    if (logLine[3] == "Berserk"
    || logLine[3] == "Inner Release") {
      if (logLine[2] == "gains") {
        statustime.berserk = Date.now() + parseInt(logLine[5]) * 1000;
      }
      else if (logLine[2] == "loses") {
        delete statustime.berserk;
      }
    }

    else if (logLine[3] == "Rampart") {
      if (logLine[2] == "gains") {
        if (!statustime.mitigation
        || statustime.mitigation < Date.now() + parseInt(logLine[5]) * 1000) {
          statustime.mitigation = Date.now() + parseInt(logLine[5]) * 1000;
        }
      }
      else if (logLine[2] == "loses") {
        if (statustime.mitigation <= Date.now()) {
          delete statustime.mitigation;
          warMitigation();
        }
      }
    }

    else if (logLine[3] == "Defiance") {
      if (logLine[2] == "gains") {
        toggle.stance = 1;
        if (!cooldowntime.unchained) {
          addIcon(id.unchained,icon.unchained);
        }
        else if (cooldowntime.unchained - Date.now() < 0) {
          clearTimeout(timeout.unchained);
          addIconWithTimeout("unchained",Date.now() - cooldowntime.unchained,id.unchained,icon.unchained);
        }
      }
      else if (logLine[2] == "loses") {
        clearTimeout(timeout.unchained);
        removeIcon(id.unchained);
      }
    }

    else if (logLine[3] == "Inner Beast") {
      if (logLine[2] == "gains") {
        if (!statustime.mitigation
        || statustime.mitigation < Date.now() + parseInt(logLine[5]) * 1000) {
          statustime.mitigation = Date.now() + parseInt(logLine[5]) * 1000;
        }
      }
      else if (logLine[2] == "loses") {
        if (statustime.mitigation <= Date.now()) {
          delete statustime.mitigation;
          warMitigation();
        }
      }
    }

    else if (logLine[3] == "Unchained") {
      if (logLine[2] == "gains") {
        statustime.unchained = Date.now() + parseInt(logLine[5]) * 1000;
      }
      else if (logLine[2] == "loses") {
        delete statustime.unchained;
      }
    }

    else if (logLine[3] == "Vengeance") {
      if (logLine[2] == "gains") {
        if (!statustime.mitigation
        || statustime.mitigation < Date.now() + parseInt(logLine[5]) * 1000) {
          statustime.mitigation = Date.now() + parseInt(logLine[5]) * 1000;
        }
      }
      else if (logLine[2] == "loses") {
        if (statustime.mitigation <= Date.now()) {
          delete statustime.mitigation;
          warMitigation();
        }
      }
    }

    else if (logLine[3] == "Deliverance") {
      if (logLine[2] == "gains") {
        toggle.stance = 2;
      }
      else if (logLine[2] == "loses") {
      }
    }

    else if (logLine[3] == "Raw Intuition") {
      if (logLine[2] == "gains") {
        if (!statustime.mitigation
        || statustime.mitigation < Date.now() + parseInt(logLine[5]) * 1000) {
          statustime.mitigation = Date.now() + parseInt(logLine[5]) * 1000;
        }
      }
      else if (logLine[2] == "loses") {
        if (statustime.mitigation <= Date.now()) {
          delete statustime.mitigation;
          warMitigation();
        }
      }
    }

    else if (logLine[3] == "The Bole") {
      if (logLine[2] == "gains") {
        if (!statustime.mitigation
        || statustime.mitigation < Date.now() + parseInt(logLine[5]) * 1000) {
          statustime.mitigation = Date.now() + parseInt(logLine[5]) * 1000;
        }
      }
      else if (logLine[2] == "loses") {
        if (statustime.mitigation <= Date.now()) {
          delete statustime.mitigation;
          warMitigation();
        }
      }
    }
  }

  // Target is not player, source is player

  else if (logLine[1] != player.name
  && logLine[4] == player.name) {

    if (logLine[3] == "test") {
      if (logLine[2] == "gains") {
        statustime.test = Date.now() + parseInt(logLine[5]) * 1000;
      }
      else if (logLine[2] == "loses") {
        delete statustime.test;
      }
    }
  }
}


function warMitigation() {

  // Vengeance > Rampart > Raw Intuition

  if (player.level >= 46
  && (!cooldowntime.vengeance || cooldowntime.vengeance - Date.now() < 0 )) {
    addIcon(id.mitigation,icon.vengeance);
  }
  else if (player.level >= 8
  && (!cooldowntime.rampart || cooldowntime.rampart - Date.now() < 0 )) {
    addIcon(id.mitigation,icon.rampart);
  }
  else if (player.level >= 56
  && ((!cooldowntime.awareness && !cooldowntime.rawintuition) || Math.max(cooldowntime.awareness, cooldowntime.rawintuition) - Date.now() < 0)) {
    addIcon(id.mitigation,icon.rawintuition);
  }

  else if (cooldowntime.vengeance < Math.min(cooldowntime.rampart, cooldowntime.awareness)) {
    addIconWithTimeout("mitigation",cooldowntime.vengeance - Date.now(),id.mitigation,icon.vengeance);
  }
  else if (cooldowntime.rampart < Math.min(cooldowntime.awareness, cooldowntime.vengeance)) {
    addIconWithTimeout("mitigation",cooldowntime.rampart - Date.now(),id.mitigation,icon.rampart);
  }
  else if (player.level >= 56
  && Math.max(cooldowntime.awareness,cooldowntime.rawintuition) < Math.min(cooldowntime.rampart, cooldowntime.vengeance)) {
    addIconWithTimeout("mitigation",Math.max(cooldowntime.awareness, cooldowntime.rawintuition) - Date.now(),id.mitigation,icon.rawintuition);
  }
}

function warCombo() {

  // Refresh Storm's Eye
  if (player.level >= 50
  && (!statustime.stormseye || statustime.stormseye - Date.now() < 10000) ) {
    stormseyeCombo();
  }

  // Refresh if berserk coming up
  else if (statustime.stormseye - Date.now() < 21000
  && cooldowntime.berserk - Date.now() < 10000) {
    stormseyeCombo();
  }

  else if (player.level >= 38) {
    stormspathCombo();
  }

  // Maintain slashing resistance down
  else if (player.level >= 18 && !statustime.slashingresistancedown) {
    stormspathCombo();
  }

  else {
    butchersblockCombo();
  }
}

function butchersblockCombo() {
  toggle.combo = 1;
  addIcon(id.heavyswing,icon.heavyswing);
  if (player.level >= 6) {
    addIcon(id.skullsunder,icon.skullsunder);
  }
  if (player.level >= 30) {
    addIcon(id.butchersblock,icon.butchersblock);
  }
}

function stormspathCombo() {
  toggle.combo = 2;
  addIcon(id.heavyswing,icon.heavyswing);
  if (player.level >= 18) {
    addIcon(id.maim,icon.maim);
  }
  if (player.level >= 38) {
    addIcon(id.butchersblock,icon.stormspath);
  }
}

function stormseyeCombo() {
  toggle.combo = 3;
  addIcon(id.heavyswing,icon.heavyswing);
  addIcon(id.maim,icon.maim);
  addIcon(id.stormseye,icon.stormseye);
}
