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

// Don't need to check these actions... yet?
// "Onslaught", "Equilibrium", "Shake It Off",
// "Low Blow", "Provoke", "Interject", "Reprisal", "Shirk",

function warJobChange() {

  nextid.mitigation = 0;
  nextid.vengeance = nextid.mitigation;
  nextid.rawintuition = nextid.mitigation;
  nextid.rampart = nextid.mitigation;
  nextid.innerbeast = 1;
  nextid.steelcyclone = nextid.innerbeast;
  nextid.fellcleave = nextid.innerbeast;
  nextid.decimate = nextid.innerbeast;
  nextid.chaoticcyclone = nextid.innerbeast;
  nextid.innerchaos = nextid.innerbeast;
  nextid.heavyswing = 2;
  nextid.overpower = nextid.heavyswing;
  nextid.maim = 3;
  nextid.stormspath = 4;
  nextid.stormseye = nextid.stormspath;
  nextid.mythriltempest = nextid.stormspath;
  nextid.infuriate = 10;
  nextid.berserk = 11;
  nextid.innerrelease = nextid.berserk;
  nextid.upheaval = nextid.berserk;

  previous.overpower = 0;
  previous.mythriltempest = 0;
  previous.steelcyclone = 0;

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

  if (count.aoe > 1) {
    if (player.level >= 56
    && checkCooldown("rawintuition", player.ID) < 0) {
      addIconBlink(nextid.rawintuition,icon.rawintuition);
    }
    else if (player.level >= 8
    && checkCooldown("rampart", player.ID) < 0) {
      addIconBlink(nextid.rampart,icon.rampart);
    }
    else if (player.level >= 46
    && checkCooldown("vengeance", player.ID) < 0) {
      addIconBlink(nextid.vengeance,icon.vengeance);
    }
  }

  if (player.level >= 50
  && checkCooldown("infuriate1", player.ID) < 0) {
    addIconBlink(nextid.infuriate,icon.infuriate);
  }

  // Berserk is complicated
  if (player.level >= 64
  && checkCooldown("upheaval", player.ID) < 0
  && checkCooldown("berserk", player.ID) > 25000 ) {
    addIconBlink(nextid.upheaval,icon.upheaval); // Show Upheaval if Berserk is far away
  }
  else if (player.level >= 74
  && checkCooldown("infuriate1", player.ID) < 0) {
    removeIcon(nextid.berserk); // Hide Berserk to prevent wasting Nascent Chaos
  }
  else if (player.level >= 6
  && checkCooldown("berserk", player.ID) < 0) {
    addIconBlink(nextid.berserk,icon.berserk);
  }

  warCombo();
  warGauge();
}

function warAction() {

  if (actionList.war.indexOf(actionGroups.actionname) > -1) {

    removeText("loadmessage");

    // These actions don't break combo

    if (["Berserk", "Inner Release"].indexOf(actionGroups.actionname) > -1) {
      removeIcon(nextid.berserk);
      addStatus("berserk", actionGroups.targetID, duration.berserk);
      addCooldown("berserk", player.ID, recast.berserk);
      addIconBlinkTimeout("berserk",recast.berserk,nextid.berserk,icon.berserk);
      if (player.level >= 70) {
        warGauge(); // Triggers gauge stuff for Inner Release
      }
    }

    else if (actionGroups.actionname == "Upheaval") {
      removeIcon(nextid.upheaval);
      addCooldown("upheaval", player.ID, recast.upheaval);
      warGauge();
    }

    else if (actionGroups.actionname == "Infuriate") { // Code treats Infuriate like two different skills to juggle the charges.
      if (checkCooldown("infuriate2", player.ID) < 0) {
        addCooldown("infuriate1", player.ID, -1);
        addCooldown("infuriate2", player.ID, recast.infuriate);
      }
      else {
        removeIcon(nextid.infuriate);
        addCooldown("infuriate1", player.ID, checkCooldown("infuriate2", player.ID));
        addCooldown("infuriate2", player.ID, checkCooldown("infuriate2", player.ID) + recast.infuriate);
        addIconBlinkTimeout("infuriate", checkCooldown("infuriate1", player.ID), nextid.infuriate, icon.infuriate);
      }
      warGauge();
    }

    else if (actionGroups.actionname == "Raw Intuition") {
      addCooldown("rawintuition", player.ID, recast.rawintuition);
      removeIcon(nextid.rawintuition);
    }

    else if (actionGroups.actionname == "Rampart") {
      addCooldown("rampart", player.ID, recast.rampart);
      removeIcon(nextid.rampart);
    }

    else if (actionGroups.actionname == "Vengeance") {
      addCooldown("vengeance", player.ID, recast.vengeance);
      removeIcon(nextid.vengeance);
    }

    else { // GCD actions

      if (["Inner Beast", "Fell Cleave", "Inner Chaos"].indexOf(actionGroups.actionname) > -1) {
        if (player.level >= 45
        && player.level < 54) {
          count.aoe = 1; // Steel Cyclone is stronger than Inner Beast at 2+ targets
        }
        if (player.level >= 66) { // Enhanced Infuriate
          addCooldown("infuriate1", player.ID, checkCooldown("infuriate1", player.ID) - 5000);
          addCooldown("infuriate2", player.ID, checkCooldown("infuriate2", player.ID) - 5000);
          removeIcon(nextid.infuriate);
          addIconBlinkTimeout("infuriate",checkCooldown("infuriate1", player.ID),nextid.infuriate,icon.infuriate);
        }
        removeIcon(nextid.innerbeast);
      }

      else if (["Steel Cyclone", "Decimate", "Chaotic Cyclone"].indexOf(actionGroups.actionname) > -1) {
        if (Date.now() - previous.steelcyclone > 1000) {
          count.aoe = 1;
          previous.steelcyclone = Date.now();
          if (player.level >= 66) { // Enhanced Infuriate
            addCooldown("infuriate1", player.ID, checkCooldown("infuriate1", player.ID) - 5000);
            addCooldown("infuriate2", player.ID, checkCooldown("infuriate2", player.ID) - 5000);
            removeIcon(nextid.infuriate);
            addIconBlinkTimeout("infuriate",checkCooldown("infuriate1", player.ID),nextid.infuriate,icon.infuriate);
          }
        }
        else {
          count.aoe = count.aoe + 1;
        }
        removeIcon(nextid.innerbeast);
      }

      // These actions affect combo

      else if (actionGroups.actionname == "Heavy Swing"
      && actionGroups.result.length >= 2) {
        if (!toggle.combo) {
          warCombo();
        }
        removeIcon(nextid.heavyswing);
        warComboTimeout();
      }

      else if (actionGroups.actionname == "Maim"
      && actionGroups.result.length >= 8) {
        removeIcon(nextid.heavyswing);
        removeIcon(nextid.maim);
        warComboTimeout();
      }

      else if (actionGroups.actionname == "Storm's Path"
      && actionGroups.result.length >= 8) {
        count.aoe = 1;
        delete toggle.combo;
        warCombo();
      }

      else if (actionGroups.actionname == "Storm's Eye"
      && actionGroups.result.length >= 8) {
        addStatus("stormseye", player.ID, duration.stormseye);
        delete toggle.combo;
        warCombo();
      }

      else if (actionGroups.actionname == "Overpower"
      && actionGroups.result.length >= 2) {
        if (Date.now() - previous.overpower > 1000) {
          previous.overpower = Date.now();
          count.aoe = 1;
        }
        else {
          count.aoe = count.aoe + 1;
        }
        if (player.level >= 40) {
          mythriltempestCombo();
          removeIcon(nextid.overpower);
          warComboTimeout();
        }
      }

      else if (actionGroups.actionname == "Mythril Tempest"
      && actionGroups.result.length >= 8) {

        if (Date.now() - previous.mythriltempest > 1000) {
          previous.mythriltempest = Date.now();
          count.aoe = 1;
          if (checkStatus("stormseye", player.ID) > 0) {
            addStatus("stormseye", player.ID, Math.min(checkStatus("stormseye", player.ID) + 10000, duration.stormseye));
          }
        }
        else {
          count.aoe = count.aoe + 1;
        }
        warCombo();
      }

      else {
        warCombo();
      }

      if (count.aoe >= 3
      && checkStatus("mitigation", statusGroups.targetID) < 1000) {
        warMitigation();
      }
      else {
        removeIcon(nextid.rampart);
      }

      warGauge(); // Check gauge after all GCD actions
    }
  }
}

function warStatus() {

  // Target is player

  if (statusGroups.targetID == player.ID) {

    if (["Berserk", "Inner Release"].indexOf(statusGroups.statusname) > -1) {
      if (statusGroups.gainsloses == "gains") {
        addStatus("berserk", statusGroups.targetID, parseInt(statusGroups.duration) * 1000);
        if (checkCooldown("upheaval", player.ID) < parseInt(statusGroups.duration) * 1000) {
          addIconBlinkTimeout("upheaval", checkCooldown("upheaval", player.ID), nextid.upheaval, icon.upheaval); // Show Upheaval if up during Berserk
        }
      }
      else if (statusGroups.gainsloses == "loses") {
        removeStatus("berserk", statusGroups.targetID);
      }

      if (statusGroups.statusname == "Inner Release") {
        warGauge();
      }
    }


    else if (statusGroups.statusname == "Storm's Eye") {
      if (statusGroups.gainsloses == "gains") {
        addStatus("stormseye", statusGroups.targetID, parseInt(statusGroups.duration) * 1000);
      }
      else if (statusGroups.gainsloses == "loses") {
        removeStatus("stormseye", statusGroups.targetID);
      }
    }

    else if (statusGroups.statusname == "Raw Intuition") {
      if (statusGroups.gainsloses == "gains") {
        if (checkStatus("mitigation", statusGroups.targetID) < parseInt(statusGroups.duration) * 1000) {
          addStatus("mitigation", statusGroups.targetID, parseInt(statusGroups.duration) * 1000);
        }
      }
      else if (statusGroups.gainsloses == "loses") {
        if (checkStatus("mitigation", statusGroups.targetID) < 0
        && count.aoe >= 3) {
          warMitigation();
        }
      }
    }

    else if (statusGroups.statusname == "Rampart") {
      if (statusGroups.gainsloses == "gains") {
        if (checkStatus("mitigation", statusGroups.targetID) < parseInt(statusGroups.duration) * 1000) {
          addStatus("mitigation", statusGroups.targetID, parseInt(statusGroups.duration) * 1000);
        }
      }
      else if (statusGroups.gainsloses == "loses") {
        if (checkStatus("mitigation", statusGroups.targetID) < 0 // Check for overlaps
        && count.aoe >= 3) {
          warMitigation();
        }
      }
    }

    else if (statusGroups.statusname == "Vengeance") {
      if (statusGroups.gainsloses == "gains") {
        if (checkStatus("mitigation", statusGroups.targetID) < parseInt(statusGroups.duration) * 1000) {
          addStatus("mitigation", statusGroups.targetID, parseInt(statusGroups.duration) * 1000);
        }
      }
      else if (statusGroups.gainsloses == "loses") {
        if (checkStatus("mitigation", statusGroups.targetID) < 0
        && count.aoe >= 3) {
          warMitigation();
        }
      }
    }

    else if (statusGroups.statusname == "Nascent Chaos") {
      if (statusGroups.gainsloses == "gains") {
        addStatus("nascentchaos", statusGroups.targetID, parseInt(statusGroups.duration) * 1000);
        removeIcon(nextid.berserk);
      }
      else if (statusGroups.gainsloses == "loses") {
        removeStatus("nascentchaos", statusGroups.targetID);
        addIconBlinkTimeout("berserk",checkCooldown("berserk", player.ID),nextid.berserk,icon.berserk);
      }
      warGauge()
    }
  }
}


function warMitigation() {

  // Shows next mitigation cooldown
  // Ideally Vengeance > Raw Intuition > Rampart > Raw Intuition > DPS plz wake up and DPS

  if (player.level >= 56) {
    if (checkCooldown("vengeance", player.ID) <= Math.min(checkCooldown("rampart", player.ID), checkCooldown("rawintuition", player.ID))) {
      addIconBlinkTimeout("mitigation",checkCooldown("vengeance", player.ID),nextid.mitigation,icon.vengeance);
    }
    else if (checkCooldown("rawintuition", player.ID) <= Math.min(checkCooldown("rampart", player.ID), checkCooldown("vengeance", player.ID))) {
      addIconBlinkTimeout("mitigation",checkCooldown("rawintuition", player.ID),nextid.mitigation,icon.rawintuition);
    }
    else if (checkCooldown("rampart", player.ID) <= Math.min(checkCooldown("vengeance", player.ID), checkCooldown("rawintuition", player.ID))) {
      addIconBlinkTimeout("mitigation",checkCooldown("rampart", player.ID),nextid.mitigation,icon.rampart);
    }
  }

  else if (player.level >= 46) {
    if (checkCooldown("vengeance", player.ID) <= checkCooldown("rampart", player.ID)) {
      addIconBlinkTimeout("mitigation",checkCooldown("vengeance", player.ID),nextid.mitigation,icon.vengeance);
    }
    else if (checkCooldown("rampart", player.ID) <= checkCooldown("vengeance", player.ID)) {
      addIconBlinkTimeout("mitigation",checkCooldown("rampart", player.ID),nextid.mitigation,icon.rampart);
    }
  }

  else if (player.level >= 8) {
    addIconBlinkTimeout("mitigation",checkCooldown("rampart", player.ID),nextid.mitigation,icon.rampart);
  }
}

function warGauge() {

  // Clear debug
  addText("debug2", "");

  // Set Inner Beast icon - listed from highest to lowest minimum potency
  if (checkStatus("nascentchaos", player.ID) > 2500) {
    if (count.aoe >= 3) {
      icon.innerbeast = icon.chaoticcyclone;
    }
    if (player.level >= 80) {
      icon.innerbeast = icon.innerchaos;
    }
    else if (player.level >= 74) {
      icon.innerbeast = icon.chaoticcyclone; // Use Cyclone on Single Target before 80? Not sure...
    }
  }
  else if (player.level >= 60
  && count.aoe >= 3) {
    icon.innerbeast = icon.decimate;
  }
  else if (player.level >= 45
  && count.aoe >= 3) {
    icon.innerbeast = icon.steelcyclone;
  }
  else if (player.level >= 54) {
    icon.innerbeast = icon.fellcleave;
  }
  else if (player.level >= 45
  && player.level < 54
  && count.aoe >= 2) {
    icon.innerbeast = icon.steelcyclone;
  }
  else {
    icon.innerbeast = "002553";
  }

  // Set Steel Cyclone icon
  if (checkStatus("nascentchaos", player.ID) > 2500) {
    icon.steelcyclone = icon.chaoticcyclone;
  }
  else if (player.level >= 60) {
    icon.steelcyclone = icon.decimate;
  }
  else {
    icon.steelcyclone = "002552";
  }

  if (player.level >= 70
  && checkStatus("berserk", player.ID) > 0) { // Possibly adjust this number
    addText("debug2", "Inner Release");
    gauge.max = 0; // Spam during Inner Release
  }
  else if (player.level >= 70
  && checkCooldown("berserk", player.ID) < 5000
  && checkCooldown("infuriate1", player.ID) < 40000) {
    addText("debug2", "Upcoming Inner Release");
    gauge.max = 50; // Avoid capping during Inner Release
  }
  else if (player.level >= 66
  && checkCooldown("infuriate1", player.ID) < 10000) {
    addText("debug2", "Upcoming Enhanced Infuriate");
    gauge.max = 50; // Avoid overcapping from Enhanced Infuriate
  }
  else if (player.level < 66
  && checkCooldown("infuriate1", player.ID) < 5000) {
    addText("debug2", "Upcoming Infuriate");
    gauge.max = 50; // Avoid overcapping from Infuriate
  }
  else if (player.level >= 74
  && checkStatus("nascentchaos", player.ID) > 2500
  && checkStatus("nascentchaos", player.ID) < 12500) {
    addText("debug2", "Use Nascent Chaos");
    gauge.max = 50; // Avoid wasting Nascent Chaos
  }
  else if (player.level >= 50
  && count.aoe <= 2
  && checkStatus("stormseye", player.ID) < 15000) {
    addText("debug2", "Waiting for Storm's Eye");
    gauge.max = 90; // Avoid letting Storm's Eye fall off during AoE
  }
  else if (player.level >= 50
  && checkStatus("stormseye", player.ID) < 5000) {
    addText("debug2", "Waiting for Storm's Eye");
    gauge.max = 90; // Avoid using spenders out of Storm's Eye
  }
  else if (player.level >= 64
  && checkCooldown("upheaval", player.ID) < 20000) { // Revisit if too conservative
    addText("debug2", "Build buffer for Upheaval");
    gauge.max = 70; // Stay above 20 for Upheavals
  }
  else {
    addText("debug2", "");
    gauge.max = 50; // All other cases
  }

  // Berserk/Inner Release
  if (checkCooldown("berserk", player.ID) < 0
  && checkStatus("stormseye", player.ID) > 0) {
    addIconBlink(nextid.berserk,icon.berserk);
  }
  else if (player.level >= 70
  && checkCooldown("upheaval", player.ID) < 1000
  && checkStatus("berserk", player.ID) > 0) {
    addIconBlink(nextid.upheaval,icon.upheaval);
  }
  else if (player.level >= 64
  && player.jobDetail.beast >= 20
  && checkCooldown("upheaval", player.ID) < 1000
  && checkCooldown("berserk", player.ID) > 25000) {
    addIconBlink(nextid.upheaval,icon.upheaval);
  }
  else {
    removeIcon(nextid.upheaval);
  }

  if (player.level >= 35
  && player.jobDetail.beast >= gauge.max) {
    addIconBlink(nextid.innerbeast, icon.innerbeast);
  }
  else {
    removeIcon(nextid.innerbeast);
  }
}

function warCombo() {

  removeIcon(nextid.heavyswing);
  removeIcon(nextid.maim);
  removeIcon(nextid.stormspath);

  // Revisit this later if it is refreshing too much
  if (player.level >= 50
  && checkCooldown("berserk", player.ID) < 17500
  && checkStatus("stormseye", player.ID) - Math.max(checkCooldown("berserk", player.ID), 0) < 20000) {
    addText("debug1", "Refresh Storm's Eye for Berserk");
    stormseyeCombo();
  }

  else if (player.level >= 74
  && count.aoe >= 2
  && checkStatus("stormseye", player.ID) > 7500) {
    addText("debug1", "Mythril Tempest Combo");
    mythriltempestCombo();
  }

  else if (count.aoe >= 3
  && checkStatus("stormseye", player.ID) > 7500) {
    addText("debug1", "Mythril Tempest Combo");
    mythriltempestCombo();
  }

  // Revisit this later if it is too conservative
  else if (player.level >= 50
  && checkStatus("stormseye", player.ID) < 10000) {
    addText("debug1", "Refresh Storm's Eye");
    stormseyeCombo();
  }

  else {
    addText("debug1", "Storm's Path Combo");
    stormspathCombo();
  }
}

function warComboTimeout() {
  clearTimeout(timeout.combo);
  timeout.combo = setTimeout(warCombo, 12500);
}

function stormspathCombo() {
  next.combo = 1;
  addIcon(nextid.heavyswing,icon.heavyswing);
  if (player.level >= 18) {
    addIcon(nextid.maim,icon.maim);
  }
  if (player.level >= 38) {
    addIcon(nextid.stormspath,icon.stormspath);
  }
}

function stormseyeCombo() {
  next.combo = 2;
  addIcon(nextid.heavyswing,icon.heavyswing);
  addIcon(nextid.maim,icon.maim);
  addIcon(nextid.stormseye,icon.stormseye);
}

function mythriltempestCombo() {
  next.combo = 3;
  addIcon(nextid.overpower,icon.overpower);
  removeIcon(nextid.maim);
  if (player.level >= 40) {
    addIcon(nextid.mythriltempest,icon.mythriltempest);
  }
}
