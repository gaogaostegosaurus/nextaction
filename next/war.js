"use strict";

// Define actions to watch for

actionList.war = [

  // Role actions
  "Rampart", "Arm\'s Length",

  // AoE actions
  "Overpower", "Mythril Tempest", "Steel Cyclone", "Decimate",

  // Single target actions
  "Storm\'s Path", "Fell Cleave", "Inner Chaos",

  // AoE or single target depending on level
  "Inner Beast", "Chaotic Cyclone",

  // Everything else
  "Heavy Swing", "Maim", "Storm\'s Eye", "Tomahawk",
  "Berserk", "Thrill Of Battle", "Vengeance", "Holmgang", "Infuriate", "Raw Intuition", "Upheaval", "Inner Release", "Nascent Flash"

];

// Don't need to check these actions yet?
// "Onslaught", "Equilibrium", "Shake It Off",
// "Low Blow", "Provoke", "Interject", "Reprisal", "Arm's Length", "Shirk",

function warJobChange() {

  id.innerbeast = "0";
  id.steelcyclone = id.innerbeast;
  id.fellcleave = id.innerbeast;
  id.decimate = id.innerbeast;
  id.chaoticcyclone = id.innerbeast;
  id.innerchaos = id.innerbeast;
  id.heavyswing = "1";
  id.overpower = id.heavyswing;
  id.maim = "2";
  id.stormspath = "3";
  id.stormseye = id.stormspath;
  id.mythriltempest = id.stormspath;
  id.rampart = "9";
  id.vengeance = id.rampart;
  id.rawintuition = id.rampart;
  id.mitigation = id.rampart;

  id.infuriate = "11";
  id.berserk = "12";
  id.innerrelease = id.berserk;
  id.upheaval = id.berserk;

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
}

// Checks and activates things when entering combat
function warInCombatChangedEvent(e) {

  if (player.level >= 46
  && checkCooldown("vengeance", player.name) < 0) {
    addIconBlink(id.vengeance,icon.vengeance);
  }
  else if (player.level >= 56
  && checkCooldown("rawintuition", player.name) < 0) {
    addIconBlink(id.rawintuition,icon.rawintuition);
  }
  else if (player.level >= 8
  && checkCooldown("rampart", player.name) < 0) {
    addIconBlink(id.rampart,icon.rampart);
  }

  if (player.level >= 50
  && checkCooldown("infuriate1", player.name) < 0) {
    addIconBlink(id.infuriate,icon.infuriate);
  }

  // Berserk is complicated
  if (player.level >= 64
  && checkCooldown("upheaval", player.name) < 0
  && checkCooldown("berserk", player.name) > 25000 ) {
    addIconBlink(id.upheaval,icon.upheaval);
  }
  else if (player.level >= 74
  && checkCooldown("infuriate1", player.name) < 0) {
    removeIcon(id.berserk);
  }
  else if (player.level >= 50
  && checkStatus("stormseye", player.name) < 20000) {
    removeIcon(id.berserk);
  }
  else if (player.level >= 6
  && checkCooldown("berserk", player.name) < 0) {
    addIconBlink(id.berserk,icon.berserk);
  }

  warCombo();
  warGauge();

}

function warAction(logLine) {

  addText("debug3", "Infuriate x1: " + checkCooldown("infuriate1", player.name) + "  Infuriate x2: " + checkCooldown("infuriate2", player.name) );

  if (logLine[2] == player.name
  && actionList.war.indexOf(logLine[3]) > -1) {

    removeText("loadmessage");

    // Toggle AoE

    if (["Overpower", "Mythril Tempest", "Steel Cyclone", "Decimate"].indexOf(logLine[3]) > -1) {
      toggle.aoe = Date.now();
    }
    else if (["Storm\'s Path", "Fell Cleave", "Inner Chaos"].indexOf(logLine[3]) > -1) {
      delete toggle.aoe;
    }
    else if (logLine[3] == "Chaotic Cyclone"
    && player.level >= 80) {
      toggle.aoe = Date.now();
    }
    else if (logLine[3] == "Inner Beast"
    && player.level >= 45) {
      delete toggle.aoe;
    }

    // These actions don't break combo

    if (logLine[3] == "Berserk"
    || logLine[3] == "Inner Release") {
      removeIcon(id.berserk);
      addCooldown("berserk", player.name, recast.berserk);

      if (player.level >= 70) {
        icon.berserk = icon.innerrelease;
      }
      else {
        icon.berserk = "000259";
      }

      addIconBlinkTimeout("berserk",recast.berserk,id.berserk,icon.berserk);
      if (player.level >= 70) {
        warGauge();
      }
    }

    else if (logLine[3] == "Upheaval") {
      removeIcon(id.upheaval);
      addCooldown("upheaval", player.name, recast.upheaval);
      warGauge();
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

      // Code treats Infuriate like two different skills to juggle the charges.

      if (checkCooldown("infuriate2", player.name) < 0) {
        addCooldown("infuriate2", player.name, recast.infuriate);
        addCooldown("infuriate1", player.name, 0);
      }
      else {
        removeIcon(id.infuriate);
        addCooldown("infuriate2", player.name, checkCooldown("infuriate2", player.name) + recast.infuriate);
        addCooldown("infuriate1", player.name, checkCooldown("infuriate2", player.name) - recast.infuriate);
        addIconBlinkTimeout("infuriate", checkCooldown("infuriate1", player.name), id.infuriate, icon.infuriate);
      }
      warGauge();
    }

    else if (logLine[3] == "Raw Intuition") {
      addCooldown("rawintuition", player.name, recast.rawintuition);
      removeIcon(id.rawintuition);
    }

    else if (logLine[3] == "Inner Beast" || logLine[3] == "Fell Cleave" || logLine[3] == "Inner Chaos") {
      if (player.level >= 66) { // Enhanced Infuriate
        addCooldown("infuriate1", player.name, checkCooldown("infuriate1", player.name) - 5000);
        addCooldown("infuriate2", player.name, checkCooldown("infuriate2", player.name) - 5000);
        removeIcon(id.infuriate);
        addIconBlinkTimeout("infuriate",checkCooldown("infuriate1", player.name),id.infuriate,icon.infuriate);
      }
      removeIcon(id.innerbeast);
      warGauge();
    }

    else if (logLine[3] == "Steel Cyclone" || logLine[3] == "Decimate" || logLine[3] == "Chaotic Cyclone") {

      if (player.level >= 66) { // Enhanced Infuriate

        // Me: "WHY ARE MY COOLDOWNS SCREWED UP!!??!?!1/1/1/1"
        // Since 1 line is created for every AoE hit, this is needed to prevent every line from triggering Enhanced Infuriate

        if (!previous.steelcyclone || Date.now() - previous.steelcyclone > 1000) {
          previous.steelcyclone = Date.now();
          addCooldown("infuriate1", player.name, checkCooldown("infuriate1", player.name) - 5000);
          addCooldown("infuriate2", player.name, checkCooldown("infuriate2", player.name) - 5000);
          removeIcon(id.infuriate);
          addIconBlinkTimeout("infuriate",checkCooldown("infuriate1", player.name),id.infuriate,icon.infuriate);
        }
      }
      removeIcon(id.innerbeast);
      warGauge();
    }

    // These actions affect combo

    else {

      if (logLine[3] == "Heavy Swing"
      && logLine[6].length >= 2) {
        if (!toggle.combo) {
          warCombo();
          removeIcon(id.heavyswing);
        }
      }

      else if (logLine[3] == "Maim"
      && logLine[6].length >= 8) {
        removeIcon(id.heavyswing);
        removeIcon(id.maim);
        warGauge();
      }

      else if (logLine[3] == "Storm's Path"
      && logLine[6].length >= 8) {
        delete toggle.combo;
        warCombo();
        warGauge();
      }

      else if (logLine[3] == "Storm's Eye"
      && logLine[6].length >= 8) {
        addStatus("stormseye", player.name, 30000);
        delete toggle.combo;
        warCombo();
        warGauge();
      }

      else if (logLine[3] == "Overpower"
      && logLine[6].length >= 2) {
        if (player.level >= 40) {
          mythriltempestCombo();
          removeIcon(id.overpower);
        }
      }

      else if (logLine[3] == "Mythril Tempest"
      && logLine[6].length >= 8) {
        addStatus("stormseye", player.name, Math.min(checkStatus("stormseye", player.name) + 10000, 30000));
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
          addIconBlink(id.upheaval, icon.upheaval); // Show Upheaval if up during Berserk
        }
      }
      else if (logLine[2] == "loses") {
        removeStatus("berserk", logLine[1]);
      }

      if (logLine[3] == "Inner Release") {
        warGauge();
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
        addIconBlinkTimeout("berserk",checkCooldown("berserk", player.name),id.berserk,icon.innerrelease);
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
    addIconBlink(id.mitigation,icon.vengeance);
  }
  else if (player.level >= 56
  && checkCooldown("rawintuition", player.name) < 0) {
    addIconBlink(id.mitigation,icon.rawintuition);
  }
  else if (player.level >= 8
  && checkCooldown("rampart", player.name) < 0 ) {
    addIconBlink(id.mitigation,icon.rampart);
  }

  else if (player.level >= 46
  && checkCooldown("vengeance", player.name) < Math.min(checkCooldown("rampart", player.name), checkCooldown("rawintuition", player.name))) {
    addIconBlinkTimeout("mitigation",checkCooldown("vengeance", player.name),id.mitigation,icon.vengeance);
  }
  else if (player.level >= 56
  && checkCooldown("rawintuition", player.name) < Math.min(checkCooldown("rampart", player.name), checkCooldown("vengeance", player.name))) {
    addIconBlinkTimeout("mitigation",checkCooldown("rawintuition", player.name),id.mitigation,icon.rawintuition);
  }
  else if (player.level >= 8
  && checkCooldown("rampart", player.name) < Math.min(checkCooldown("rawintuition", player.name), checkCooldown("vengeance", player.name))) {
    addIconBlinkTimeout("mitigation",checkCooldown("rampart", player.name),id.mitigation,icon.rampart);
  }
}

function warGauge() {

  // Clear debug
  addText("debug2", "");

  // Set Inner Beast icon
  if (checkStatus("nascentchaos", player.name) > 2500) {
    if (player.level >= 80) {
      icon.innerbeast = icon.innerchaos;
    }
    else if (player.level >= 74) {
      icon.innerbeast = icon.chaoticcyclone; // Use Cyclone on Single Target before 80? Not sure...
    }
  }
  else if (player.level >= 54) {
    icon.innerbeast = icon.fellcleave;
  }
  else {
    icon.innerbeast = "002553";
  }

  // Set Steel Cyclone icon
  if (checkStatus("nascentchaos", player.name) > 2500) {
    icon.steelcyclone = icon.chaoticcyclone;
  }
  else if (player.level >= 60) {
    icon.steelcyclone = icon.decimate;
  }
  else {
    icon.steelcyclone = "002552";
  }

  if (player.level >= 70
  && checkStatus("berserk", player.name) > 0) { // Set to 0 just to be safe - function called when IR status lost anyway.
    addText("debug2", "Inner Release");
    gauge.max = 0; // Spam during Inner Release
  }
  else if (player.level >= 70
  && checkCooldown("berserk", player.name) < 5000
  && checkCooldown("infuriate1", player.name) < 40000) {
    addText("debug2", "Upcoming Inner Release");
    gauge.max = 50; // Avoid capping during Inner Release
  }
  else if (player.level >= 66
  && checkCooldown("infuriate1", player.name) < 10000) {
    addText("debug2", "Upcoming Enhanced Infuriate");
    gauge.max = 50; // Avoid overcapping from Enhanced Infuriate
  }
  else if (player.level < 66
  && checkCooldown("infuriate1", player.name) < 5000) {
    addText("debug2", "Upcoming Infuriate");
    gauge.max = 50; // Avoid overcapping from Infuriate
  }
  else if (player.level >= 74
  && checkStatus("nascentchaos", player.name) > 2500
  && checkStatus("nascentchaos", player.name) < 12500) {
    addText("debug2", "Use Nascent Chaos");
    gauge.max = 50; // Avoid wasting Nascent Chaos
  }
  else if (player.level >= 50
  && toggle.aoe
  && checkStatus("stormseye", player.name) < 15000) {
    addText("debug2", "Waiting for Storm's Eye");
    gauge.max = 90; // Avoid letting Storm's Eye fall off during AoE
  }
  else if (player.level >= 50
  && checkStatus("stormseye", player.name) < 5000) {
    addText("debug2", "Waiting for Storm's Eye");
    gauge.max = 90; // Avoid using spenders out of Storm's Eye
  }
  else if (player.level >= 64
  && checkCooldown("upheaval", player.name) < 20000) { // Revisit if too conservative
    addText("debug2", "Build buffer for Upheaval");
    gauge.max = 70; // Stay above 20 for Upheavals
  }
  else {
    addText("debug2", "");
    gauge.max = 50; // All other cases
  }


  if (player.level >= 70
  && checkCooldown("upheaval", player.name) < 2500
  && checkStatus("berserk", player.name) > 0) {
    addIconBlink(id.upheaval,icon.upheaval);
  }
  else if (player.level >= 64
  && player.jobDetail.beast >= 20
  && checkCooldown("upheaval", player.name) < 2500
  && checkCooldown("berserk", player.name) > 25000) {
    addIconBlink(id.upheaval,icon.upheaval);
  }
  else {
    removeIcon(id.upheaval);
  }

  if (player.jobDetail.beast >= gauge.max) {
    addIconBlink(id.innerbeast, icon.innerbeast);
  }
  else {
    removeIcon(id.innerbeast);
  }
}

function warCombo() {

  // Clear debug
  addText("debug1", "");

  if (toggle.aoe) {
    addText("debug1", "Mythril Tempest Combo");
    mythriltempestCombo();
  }

  // Revisit this later if it double refreshing too often (or at all?)
  else if (player.level >= 50
  && checkCooldown("berserk", player.name) < 17500
  && checkStatus("stormseye", player.name) - Math.max(checkCooldown("berserk", player.name), 0) < 20000) {
    addText("debug1", "Refresh Storm's Eye for Berserk");
    stormseyeCombo();
  }

  // Revisit this later if it is too conservative
  else if (player.level >= 50
  && checkStatus("stormseye", player.name) < 10000) {
    addText("debug1", "Refresh Storm's Eye");
    stormseyeCombo();
  }

  else {
    addText("debug1", "Storm's Path Combo");
    stormspathCombo();
  }

  clearTimeout(timeout.combo);
  timeout.combo = setTimeout(warComboTimeout, 12500);
}

function warComboTimeout() {
  if (toggle.combat) {
    warCombo();
  }
}

function stormspathCombo() {
  toggle.combo = 1;
  addIcon(id.heavyswing,icon.heavyswing);
  if (player.level >= 18) {
    addIcon(id.maim,icon.maim);
  }
  if (player.level >= 38) {
    addIcon(id.stormspath,icon.stormspath);
  }
}

function stormseyeCombo() {
  toggle.combo = 2;
  addIcon(id.heavyswing,icon.heavyswing);
  addIcon(id.maim,icon.maim);
  addIcon(id.stormseye,icon.stormseye);
}

function mythriltempestCombo() {
  toggle.combo = 3;
  addIcon(id.overpower,icon.overpower);
  removeIcon(id.maim);
  if (player.level >= 40) {
    addIcon(id.mythriltempest,icon.mythriltempest);
  }
}
