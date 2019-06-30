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

id.innerbeast = "0";
id.steelcyclone = id.innerbeast;
id.fellcleave = id.innerbeast;
id.decimate = id.innerbeast;
id.chaoticcyclone = id.innerbeast;
id.innerchaos = id.innerbeast;

id.heavyswing = "1";
id.maim = "2";
id.stormspath = "3";
id.stormseye = id.stormspath;

id.rampart = "10";
id.vengeance = id.rampart;
id.rawintuition = id.rampart;
id.mitigation = "10";
id.infuriate = "11";
id.berserk = "12";
id.innerrelease = id.berserk;
id.upheaval = id.berserk;

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

}

// Checks and activates things when entering combat
function warInCombatChangedEvent(e) {

  if (player.level >= 46
  && checkCooldown("vengeance", player.name) < 0) {
    addIcon(id.vengeance,icon.vengeance);
  }
  else if (player.level >= 56
  && checkCooldown("rawintuition", player.name) < 0) {
    addIcon(id.rawintuition,icon.rawintuition);
  }
  else if (player.level >= 8
  && checkCooldown("rampart", player.name) < 0) {
    addIcon(id.rampart,icon.rampart);
  }

  if (player.level >= 6
  && checkCooldown("berserk", player.name) < 0) {
    addIcon(id.berserk,icon.berserk);
  }

  if (player.level >= 50
  && checkCooldown("infuriate1", player.name) < 0) {
    addIcon(id.infuriate,icon.infuriate);
  }

  if (player.level >= 64
  && checkCooldown("upheaval", player.name) < 0) {
    addIcon(id.upheaval,icon.upheaval);
  }
}

function warAction(logLine) {

  if (logLine[2] == player.name
  && actionList.war.indexOf(logLine[3]) > -1) {

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

    else if (logLine[3] == "Vengeance") {
      addCooldown("vengeance", player.name, recast.vengeance);
      removeIcon(id.mitigation);
    }

    else if (logLine[3] == "Infuriate") {
      // addText("debug1", "Infuriate x1: " + checkCooldown("infuriate1", player.name) + "   Infuriate x2: " + checkCooldown("infuriate2", player.name));

      // Had only 1 charge - was charging 2
      if (checkCooldown("infuriate2", logLine[2]) >= 0) {
        addCooldown("infuriate1", player.name, checkCooldown("infuriate2", logLine[2]));
        addCooldown("infuriate2", player.name, checkCooldown("infuriate2", logLine[2]) + recast.infuriate);
        removeIcon(id.infuriate);
        addIconWithTimeout("infuriate",checkCooldown("infuriate1", logLine[2]),id.infuriate,icon.infuriate);
      }

      // Had 2 charges (can't use with 0 charges...)
      else {
        addCooldown("infuriate2", player.name, recast.infuriate);
      }
      warGauge()
    }

    else if (logLine[3] == "Raw Intuition") {
      addCooldown("rawintuition", player.name, recast.rawintuition);
      removeIcon(id.rawintuition);
    }

    else if (logLine[3] == "Upheaval") {
      removeIcon(id.upheaval);
      if (checkCooldown("berserk", player.name) < 50000
      && checkCooldown("berserk",player.name) > 30000) { // Delay Upheaval up to 20 seconds to catch next Berserk window
        addCooldown("upheaval", player.name, checkCooldown("berserk", player.name));
      }
      else {
        addCooldown("upheaval", player.name, recast.upheaval);
        addIconWithTimeout("upheaval",recast.upheaval,id.upheaval,icon.upheaval);
      }
      warGauge();
    }

    else if (logLine[3] == "Inner Beast" || logLine[3] == "Steel Cyclone"
    || logLine[3] == "Fell Cleave" || logLine[3] == "Decimate"
    || logLine[3] == "Chaotic Cyclone" || logLine[3] == "Inner Chaos") {
      if (player.level >= 66) {

        if (checkCooldown("infuriate1", logLine[2]) >= 0) {
          addCooldown("infuriate1", player.name, checkCooldown("infuriate1", logLine[2]) - 5000);
          addCooldown("infuriate2", player.name, checkCooldown("infuriate1", logLine[2]) + recast.infuriate);
          removeIcon(id.infuriate);
          addIconWithTimeout("infuriate",checkCooldown("infuriate1", logLine[2]),id.infuriate,icon.infuriate);
        }
        else if (checkCooldown("infuriate2", logLine[2]) >= 0) {
          addCooldown("infuriate2", logLine[2], checkCooldown("infuriate2", logLine[2]) - 5000);
        }
      }
      warGauge();
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

      else if (logLine[3] == "Maim"
      && logLine[6].length >= 8) {
        removeIcon(id.heavyswing);
        removeIcon(id.maim);
        warGauge();
      }

      else if (logLine[3] == "Storm's Eye"
      && logLine[6].length >= 8) {
        addStatus("stormseye", logLine[2], 30000);
        addText("debug1", checkStatus("stormseye", player.name));
        delete toggle.combo;
        warCombo();
        warGauge();
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
        if (checkCooldown("upheaval", player.name) < 0) {
          addIcon(id.upheaval, icon.upheaval);
        }
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

    else if (logLine[3] == "Vengeance") {
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

    else if (logLine[3] == "Storm's Eye") {
      if (logLine[2] == "gains") {
        addStatus("stormseye", logLine[1], parseInt(logLine[5]) * 1000);
      }
      else if (logLine[2] == "loses") {
        removeStatus("stormseye", logLine[1]);
      }
    }

    else if (logLine[3] == "Raw Intuition") {
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

    else if (logLine[3] == "Nascent Chaos") {
      if (logLine[2] == "gains") {
        addStatus("nascentchaos", logLine[1], parseInt(logLine[5]) * 1000);
        removeIcon(id.berserk);
      }
      else if (logLine[2] == "loses") {
        removeStatus("nascentchaos", logLine[1]);
        addIconWithTimeout("berserk",checkCooldown("berserk", player.name),id.berserk,icon.innerrelease);
      }
      warGauge()
    }
  }

  // Target is not player, source is player

  else if (logLine[1] != player.name
  && logLine[4] == player.name) {

    if (logLine[3] == "test") {
      if (logLine[2] == "gains") {
      }
      else if (logLine[2] == "loses") {
      }
    }
  }
}


function warMitigation() {

  // Vengeance > Raw Intuition > Rampart
  // I guess

  if (player.level >= 46
  && checkCooldown("vengeance", player.name) < 0 ) {
    addIcon(id.mitigation,icon.vengeance);
  }
  else if (player.level >= 56
  && checkCooldown("rawintuition", player.name) < 0) {
    addIcon(id.mitigation,icon.rawintuition);
  }
  else if (player.level >= 8
  && checkCooldown("rampart", player.name) < 0 ) {
    addIcon(id.mitigation,icon.rampart);
  }

  else if (player.level >= 46
  && checkCooldown("vengeance", player.name) < Math.min(checkCooldown("rampart", player.name), checkCooldown("rawintuition", player.name))) {
    addIconWithTimeout("mitigation",checkCooldown("vengeance", player.name),id.mitigation,icon.vengeance);
  }
  else if (player.level >= 56
  && checkCooldown("rawintuition", player.name) < Math.min(checkCooldown("rampart", player.name), checkCooldown("vengeance", player.name))) {
    addIconWithTimeout("mitigation",checkCooldown("rawintuition", player.name),id.mitigation,icon.rawintuition);
  }
  else if (player.level >= 8
  && checkCooldown("rampart", player.name) < Math.min(checkCooldown("rawintuition", player.name), checkCooldown("vengeance", player.name))) {
    addIconWithTimeout("mitigation",ccheckCooldown("rampart", player.name),id.mitigation,icon.rampart);
  }
}

function warCombo() {

  // Refresh Storm's Eye
  if (player.level >= 50) {

    if (checkCooldown("berserk", player.name) < 15000
    && checkStatus("stormseye", player.name) - checkCooldown("berserk", player.name) < 15000) {
      stormseyeCombo();
    }

    else if (checkStatus("stormseye", player.name) < 15000) {
      stormseyeCombo();
    }

    else {
      stormspathCombo();
    }
  }

  else {
    stormspathCombo();
  }
}

function warGauge() {

  // addText("debug1", "Nascent Chaos: " + checkStatus("nascentchaos", player.name));

  if (checkStatus("nascentchaos", player.name) > 0
  && player.level >= 80) {
    icon.innerbeast = icon.innerchaos;
  }
  else if (player.level >= 54) {
    icon.innerbeast = icon.fellcleave;
  }
  else {
    icon.innerbeast = "002553";
  }

  if (checkStatus("nascentchaos", player.name) > 0) {
    icon.steelcyclone = icon.chaoticcyclone;
  }
  else if (player.level >= 60) {
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

  // Gauge

  if (player.jobDetail.beast >= 90) {
    addIcon(id.innerbeast, icon.innerbeast);
  }

  else if (checkStatus("nascentchaos", player.name) > 0) {
    if (checkCooldown("infuriate1", player.name) < 0) {
      addIcon(id.innerbeast, icon.innerbeast);
    }
    else if (checkStatus("stormseye", player.name) > 0) {
      addIcon(id.innerbeast, icon.innerbeast);
    }
    else {
      removeIcon(id.innerbeast);
    }
  }

  else if (player.level >= 70
  && checkStatus("berserk", player.name) > 0) {
    addIcon(id.innerbeast, icon.innerbeast);
  }

  else if (player.level >= 70
  && checkCooldown("berserk", player.name) < 0
  && checkCooldown("infuriate1", player.name) < 35000
  && player.jobDetail.beast >= 50) {
    addIcon(id.innerbeast, icon.innerbeast);
  }

  else if (player.level >= 68
  && checkCooldown("infuriate1", player.name) < 5000
  && player.jobDetail.beast >= 50) {
    addIcon(id.innerbeast, icon.innerbeast);
  }
  else if (checkStatus("stormseye", player.name) > 0) {

    if (player.level >= 64
    && player.jobDetail.beast >= 70) {
      addIcon(id.innerbeast, icon.innerbeast);
    }

    else if (player.level < 64
    && player.jobDetail.beast >= 50) {
      addIcon(id.innerbeast, icon.innerbeast);
    }

    else {
      removeIcon(id.innerbeast);
    }
  }

  else {
    removeIcon(id.innerbeast);
  }
}
  // addText("debug1", "Gauge target: " + gauge.target + " |  Gauge cap: " + gauge.cap);

function stormspathCombo() {
  toggle.combo = 2;
  addIcon(id.heavyswing,icon.heavyswing);
  if (player.level >= 18) {
    addIcon(id.maim,icon.maim);
  }
  if (player.level >= 38) {
    addIcon(id.stormspath,icon.stormspath);
  }
}

function stormseyeCombo() {
  toggle.combo = 3;
  addIcon(id.heavyswing,icon.heavyswing);
  addIcon(id.maim,icon.maim);
  addIcon(id.stormseye,icon.stormseye);
}
