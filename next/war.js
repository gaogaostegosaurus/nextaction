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

    else if ("Upheaval" == actionGroups.actionname) {
      removeIcon(nextid.upheaval);
      addCooldown("upheaval", player.ID, recast.upheaval);
      warGauge();
    }

    else if ("Infuriate" == actionGroups.actionname) { // Code treats Infuriate like two different skills to juggle the charges.
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

    else if ("Raw Intuition" == actionGroups.actionname) {
      addCooldown("rawintuition", player.ID, recast.rawintuition);
      removeIcon(nextid.rawintuition);
    }

    else if ("Rampart" == actionGroups.actionname) {
      addCooldown("rampart", player.ID, recast.rampart);
      removeIcon(nextid.rampart);
    }

    else if ("Vengeance" == actionGroups.actionname) {
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

      else if ("Heavy Swing" == actionGroups.actionname
      && actionGroups.result.length >= 2) {
        count.aoe = 1;
        if ([1, 2].indexOf(next.combo) == -1) {
          warCombo();
          toggle.combo = Date.now();
        }
        removeIcon(nextid.heavyswing);
        if (player.level >= 4) {
          warComboTimeout();
        }
        else {
          warCombo();
        }
      }

      else if ("Maim" == actionGroups.actionname
      && actionGroups.result.length >= 8) {
        removeIcon(nextid.heavyswing);
        removeIcon(nextid.maim);
        if (player.level >= 26) {
          warComboTimeout();
        }
        else {
          warCombo();
        }
      }

      else if ("Storm's Path" == actionGroups.actionname
      && actionGroups.result.length >= 8) {
        warCombo();
      }

      else if ("Storm's Eye" == actionGroups.actionname
      && actionGroups.result.length >= 8) {
        addStatus("stormseye", player.ID, duration.stormseye);
        warCombo();
      }

      else if ("Overpower" == actionGroups.actionname
      && actionGroups.result.length >= 2) {
        if (Date.now() - previous.overpower > 1000) {
          previous.overpower = Date.now();
          count.aoe = 1;
        }
        else {
          count.aoe = count.aoe + 1;
        }
        if (next.combo != 3) {
          warCombo();
          toggle.combo = Date.now();
        }
        removeIcon(nextid.overpower);
        if (player.level >= 40) {
          warComboTimeout();
        }
        else {
          warCombo();
        }
      }

      else if ("Mythril Tempest" == actionGroups.actionname
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

  if (statusGroups.targetID == player.ID) { // Target is self

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

      if ("Inner Release" == statusGroups.statusname) {
        warGauge();
      }
    }


    else if ("Storm's Eye" == statusGroups.statusname) {
      if (statusGroups.gainsloses == "gains") {
        addStatus("stormseye", statusGroups.targetID, parseInt(statusGroups.duration) * 1000);
      }
      else if (statusGroups.gainsloses == "loses") {
        removeStatus("stormseye", statusGroups.targetID);
      }
    }

    else if ("Raw Intuition" == statusGroups.statusname) {
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

    else if ("Rampart" == statusGroups.statusname) {
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

    else if ("Vengeance" == statusGroups.statusname) {
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

    else if ("Nascent Chaos" == statusGroups.statusname) {
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

  let targetbeast = 50; // Display spender icon if Beast is this value or above

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
    targetbeast = 0; // Spam during Inner Release
  }
  else if (player.level >= 70
  && checkCooldown("berserk", player.ID) < 5000
  && checkCooldown("infuriate1", player.ID) < 40000) {
    targetbeast = 50; // Avoid overcapping during Inner Release
  }
  else if (player.level >= 66
  && checkCooldown("infuriate1", player.ID) < 10000) {
    targetbeast = 50; // Avoid overcapping from Enhanced Infuriate
  }
  else if (player.level < 66
  && checkCooldown("infuriate1", player.ID) < 5000) {
    targetbeast = 50; // Avoid overcapping from Infuriate
  }
  else if (player.level >= 74
  && checkStatus("nascentchaos", player.ID) > 2500
  && checkStatus("nascentchaos", player.ID) < 12500) {
    targetbeast = 50; // Avoid wasting Nascent Chaos
  }
  else if (player.level >= 50
  && count.aoe <= 3 // AoE wins at 3
  && checkStatus("stormseye", player.ID) < 15000) {
    targetbeast = 90; // Avoid letting Storm's Eye fall off during AoE
  }
  else if (player.level >= 50
  && checkStatus("stormseye", player.ID) < 5000) {
    targetbeast = 90; // Avoid using spenders out of Storm's Eye
  }
  else if (player.level >= 45
  && count.aoe >= 3) {
    targetbeast = 50; // Use AoE
  }
  else if (player.level >= 64
  && checkCooldown("upheaval", player.ID) < 20000) { // Revisit if too conservative
    targetbeast = 70; // Stay above 20 for Upheavals
  }
  else {
    targetbeast = 50; // All other cases
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
  && player.jobDetail.beast >= targetbeast) {
    addIconBlink(nextid.innerbeast, icon.innerbeast);
  }
  else {
    removeIcon(nextid.innerbeast);
  }
}

function warCombo() {

  delete toggle.combo;

  removeIcon(nextid.heavyswing);
  removeIcon(nextid.maim);
  removeIcon(nextid.stormspath);

  // Revisit this later if it is refreshing too much
  if (player.level >= 50
  && checkCooldown("berserk", player.ID) < 17500
  && checkStatus("stormseye", player.ID) - Math.max(checkCooldown("berserk", player.ID), 0) < 20000) {
    stormseyeCombo();
  }

  else if (player.level >= 74
  && count.aoe >= 2
  && checkStatus("stormseye", player.ID) > 7500) {
    mythriltempestCombo();
  }

  else if (player.level >= 50
  && count.aoe >= 3
  && checkStatus("stormseye", player.ID) > 7500) {
    mythriltempestCombo();
  }

  // Revisit this later if it is too conservative
  else if (player.level >= 50
  && checkStatus("stormseye", player.ID) < 10000) {
    stormseyeCombo();
  }

  else if (player.level >= 40
  && count.aoe >= 3) {
    mythriltempestCombo();
  }

  else {
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
