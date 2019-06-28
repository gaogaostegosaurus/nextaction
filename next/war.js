"use strict";

// Define actions to watch for

actionList.war = [

  "Rampart",

  "Berserk", "Thrill Of Battle", "Vengeance", "Holmgang", "Infuriate",
  "Raw Intuition", "Upheaval", "Inner Release",
  "Nascent Flash",

  "Inner Beast", "Steel Cyclone",
  "Fell Cleave", "Decimate",
  "Chaotic Cyclone", "Inner Chaos",

  "Heavy Swing", "Maim", "Overpower", "Tomahawk", "Storm\'s Path", "Mythril Tempest", "Storm\'s Eye"
];

// Don't need to check these actions yet
// "Onslaught", "Equilibrium", "Shake It Off",
// "Low Blow", "Provoke", "Interject", "Reprisal", "Arm's Length", "Shirk",

// Decide placement of stuff

id.innerbeast = "next0";
id.steelcyclone = id.innerbeast;
id.fellcleave = id.innerbeast;
id.decimate = id.innerbeast;

id.heavyswing = "next1";
id.skullsunder = "next2";
id.maim = id.skullsunder;
id.butchersblock = "next3";
id.stormspath = id.butchersblock;
id.stormseye = id.butchersblock;

id.rampart = "next10";
id.vengeance = id.rampart;
id.rawintuition = id.rampart;
id.mitigation = "next10";
id.infuriate = "next11";
id.berserk = "next12";
id.innerrelease = id.berserk;
id.unchained = "next13";
id.upheaval = "next14";

recast.berserk = 90000;
recast.infuriate = 60000;
recast.rampart = 90000;
recast.rawintuition = 25000;
recast.upheaval = 30000;
recast.vengeance = 120000;
recast.innerrelease = recast.berserk;

icon.overpower = "000254";
icon.maim = "000255";
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

icon.chaoticcyclone = "W29MrhEmsNo9M_ptkmTejtHOgk";
icon.nascentflash = "9vWCpDYwb7DjJ35QXTusOuPTaA";
icon.innerchaos = "eytwlJikgqXuLL8u6rxAB0t0w4";

function warPlayerChangedEvent(e) {

  if (player.level >= 54) {
    icon.innerbeast = icon.fellcleave;
  }
  else {
    icon.innerbeast = "002553";
  }

  if (player.level >= 60) {
    icon.steelcyclone = icon.decimate;
  }
  else {
    icon.steelcyclone = "002552";
  }

  if (player.level >= 70) {
    icon.berserk = icon.innerrelease;
  }
  else {
    icon.berserk = "000259";
  }

  warGauge();
}

// Checks and activates things when entering combat
function warInCombatChangedEvent(e) {

  if (player.level >= 46
  && checkCooldown("vengeance", player.name) < 0) {
    addIcon(id.vengeance,icon.vengeance);
  }
  else if (player.level >= 8
  && checkCooldown("rampart", player.name) < 0) {
    addIcon(id.rampart,icon.rampart);
  }
  else if (player.level >= 56
  && checkCooldown("awareness", player.name) < 0
  && checkCooldown("rawintuition", player.name) < 0) {
    addIcon(id.rawintuition,icon.rawintuition);
  }

  if (player.level >= 6
  && checkCooldown("berserk", player.name) < 0) {
    addIcon(id.berserk,icon.berserk);
  }

  if (player.level >= 40
  && checkCooldown("unchained", player.name) < 0) {
    addIcon(id.unchained,icon.unchained);
  }
  if (player.level >= 50
  && checkCooldown("infuriate", player.name) < 0) {
    addIcon(id.infuriate,icon.infuriate);
  }
  if (player.level >= 64
  && checkCooldown("upheaval", player.name) < 0) {
    addIcon(id.upheaval,icon.upheaval);
  }
}

function warAction(logLine) {

  if (logLine[2] == player.name
  && actionlist.war.indexOf(logLine[3]) > -1) {

    // These actions don't break combo

    if (logLine[3] == "Berserk"
    || logLine[3] == "Inner Release") {
      addCooldown("berserk", player.name, recast.berserk);
      removeIcon(id.berserk);
      if (player.level >= 70) {
        addIconWithTimeout("berserk",recast.berserk,id.berserk,icon.innerrelease);
      }
      else {
        addIconWithTimeout("berserk",recast.berserk,id.berserk,icon.berserk);
      }
    }

    else if (logLine[3] == "Rampart") {
      addCooldown("rampart", player.name, recast.rampart);
      removeIcon(id.rampart);
    }

    else if (logLine[3] == "Awareness") {
      addCooldown("awareness", player.name, recast.awareness);
    }

    else if (logLine[3] == "Unchained") {
      addCooldown("unchained", player.name, recast.unchained);
      removeIcon(id.unchained);
      addIconWithTimeout("unchained",recast.unchained,id.unchained,icon.unchained);
    }

    else if (logLine[3] == "Vengeance") {
      addCooldown("vengeance", player.name, recast.vengeance);
      removeIcon(id.mitigation);
    }

    else if (logLine[3] == "Infuriate") {
      addCooldown("infuriate", player.name, recast.infuriate);
      removeIcon(id.infuriate);
      addIconWithTimeout("infuriate",recast.infuriate,id.infuriate,icon.infuriate);
    }

    else if (logLine[3] == "Raw Intuition") {
      addCooldown("rawintuition", player.name, recast.rawintuition);
      removeIcon(id.mitigation);
    }

    else if (logLine[3] == "Upheaval") {
      addCooldown("upheaval", player.name, recast.upheaval);
      removeIcon(id.upheaval);
      if (checkCooldown("berserk", player.name) - checkCooldown("upheaval", player.name) < 20000) { // Delay Upheaval up to 20 seconds to catch next Berserk window
        addIconWithTimeout("upheaval",checkCooldown("berserk", player.name),id.upheaval,icon.upheaval);
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
        addCooldown("infuriate", player.name, checkCooldown("infuriate", player.name) - 5000);
        addIconWithTimeout("infuriate",cooldowntime.infuriate - Date.now(),id.infuriate,icon.infuriate);
      }
    }

    else if (logLine[3] == "Steel Cyclone") {
      toggle.stance = 1;
      if (player.level >= 66) {
        addCooldown("infuriate", player.name, checkCooldown("infuriate", player.name) - 5000);
        addIconWithTimeout("infuriate",cooldowntime.infuriate - Date.now(),id.infuriate,icon.infuriate);
      }
    }

    else if (logLine[3] == "Fell Cleave"
    || logLine[3] == "Decimate") {
      toggle.stance = 2;
      if (player.level >= 66) {
        addCooldown("infuriate", player.name, checkCooldown("infuriate", player.name) - 5000);
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
        addStatus("slashingresistancedown", logLine[5], 24000);
        removeIcon(id.heavyswing);
        removeIcon(id.maim);
        if (player.level >= 50
        && checkStatus("stormseye", player.name) < 12500 ) {
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
        addStatus("stormseye", logLine[5], 30000);
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

  // addText("debug1", logLine[1] + " " + logLine[2] + " " + logLine[3]);

  // Target and source is anything (non stacking status only)

  if (logLine[3] == "Reprisal") {
    if (logLine[2] == "gains") {
      addStatus("reprisal", logLine[1], parseInt(logLine[5]) * 1000);
    }
    else if (logLine[2] == "loses") {
      removeStatus("reprisal", logLine[1]);
    }
  }

  // Target is player

  else if (logLine[1] == player.name) {

    if (logLine[3] == "Berserk"
    || logLine[3] == "Inner Release") {
      if (logLine[2] == "gains") {
        addStatus("berserk", logLine[1], parseInt(logLine[5]) * 1000);
      }
      else if (logLine[2] == "loses") {
        removeStatus("berserk", logLine[1]);
      }
    }

    else if (logLine[3] == "Rampart") {
      if (logLine[2] == "gains") {
        if (checkStatus("mitigation", logLine[1]) < parseInt(logLine[5]) * 1000) {
          addStatus("mitigation", logLine[1], parseInt(logLine[5]) * 1000);
        }
      }
      else if (logLine[2] == "loses") {
        if (checkStatus("mitigation", logLine[1]) < 0) {
          removeStatus("mitigation", logLine[1]);
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
          addStatus("mitigation", logLine[1], parseInt(logLine[5]) * 1000);
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
          addStatus("mitigation", logLine[1], parseInt(logLine[5]) * 1000);
        }
      }
      else if (logLine[2] == "loses") {
        if (statustime.mitigation <= Date.now()) {
          delete statustime.mitigation;
          warMitigation();
        }
      }
    }

    else if (logLine[3] == "Storm's Eye") {
      if (logLine[2] == "gains") {
        statustime.stormseye = Date.now() + parseInt(logLine[5]) * 1000;
      }
      else if (logLine[2] == "loses") {
        delete statustime.stormseye;
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
  && checkStatus("stormseye", player.name) {
    stormseyeCombo();
  }

  // Prevent refresh during Berserk
  else if (player.level >= 50
  && checkStatus("stormseye", player.name) < checkStatus("berserk", player.name) - 10000) {
    stormseyeCombo();
  }
  
  else {
    stormspathCombo();
  }
}

warGauge() {

  if (toggle.stance == 1 && player.level >= 54) {
    icon.innerbeast = "002553";
  }
  else {
    icon.innerbeast = icon.fellcleave;
  }

  // Gauge

  if (player.level >= 70
  && checkStatus("berserk", player.name) > 0) {
    gauge.target = 0;
  }

  else if (player.level >= 50
  && checkCooldown("infuriate", player.name) < 2500) {
    gauge.target = 50;
  }

  else if (player.level >= 70
  && checkCooldown("berserk", player.name) < 2500
  && checkCooldown("infuriate", player.name) < 27500) {
    gauge.target = 50;
  }
  else {
    addText("debug3", "Build gauge");
    gauge.target = 90;
  }

  addText("debug1", "Gauge target: " + gauge.target + " |  Gauge cap: " + gauge.cap);

  if (player.jobDetail.beast >= gauge.target) {
    addIcon(id.fellcleave,icon.fellcleave);
  }
  else {
    removeIcon(id.innerbeast);
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
