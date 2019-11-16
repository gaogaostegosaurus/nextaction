"use strict";

// Define actions to watch for

const warActionList = [

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

  if (count.targets > 1) {
    if (player.level >= 56
    && checkRecast("rawintuition") < 0) {
      addIcon({name: "rawintuition"});
    }
    else if (player.level >= 8
    && checkRecast("rampart") < 0) {
      addIcon({name: "rampart"});
    }
    else if (player.level >= 46
    && checkRecast("vengeance") < 0) {
      addIcon({name: "vengeance"});
    }
  }

  if (player.level >= 50
  && checkRecast("infuriate1", player.ID) < 0) {
    addIcon({name: "infuriate"});
  }

  // Berserk is complicated
  if (player.level >= 64
  && checkRecast("upheaval") < 0
  && checkRecast("berserk") > 25000 ) {
    addIcon({name: "upheaval"}); // Show Upheaval if Berserk is far away
  }
  else if (player.level >= 74
  && checkRecast("infuriate1", player.ID) < 0) {
    removeIcon("berserk"); // Hide Berserk to prevent wasting Nascent Chaos
  }
  else if (player.level >= 6
  && checkRecast("berserk") < 0) {
    addIcon({name: "berserk"});
  }

  warCombo();
  warGauge();
}

function warAction() {

  if (actionList.war.indexOf(actionLog.groups.actionName) > -1) {


    // These actions don't break combo

    if (["Berserk", "Inner Release"].indexOf(actionLog.groups.actionName) > -1) {
      removeIcon("berserk");
      addStatus("berserk", duration.berserk, actionLog.groups.targetID);
      addRecast("berserk");
      addIconBlinkTimeout("berserk",recast.berserk,nextid.berserk,icon.berserk);
      if (player.level >= 70) {
        warGauge(); // Triggers gauge stuff for Inner Release
      }
    }

    else if ("Upheaval" == actionLog.groups.actionName) {
      removeIcon("upheaval");
      addRecast("upheaval");
      warGauge();
    }

    else if ("Infuriate" == actionLog.groups.actionName) { // Code treats Infuriate like two different skills to juggle the charges.
      if (checkRecast("infuriate2", player.ID) < 0) {
        addRecast("infuriate1", player.ID, -1);
        addRecast("infuriate2", player.ID, recast.infuriate);
      }
      else {
        removeIcon("infuriate");
        addRecast("infuriate1", player.ID, checkRecast("infuriate2", player.ID));
        addRecast("infuriate2", player.ID, checkRecast("infuriate2", player.ID) + recast.infuriate);
        addIconBlinkTimeout("infuriate", checkRecast("infuriate1", player.ID), nextid.infuriate, icon.infuriate);
      }
      warGauge();
    }

    else if ("Raw Intuition" == actionLog.groups.actionName) {
      addRecast("rawintuition");
      removeIcon("rawintuition");
    }

    else if ("Rampart" == actionLog.groups.actionName) {
      addRecast("rampart");
      removeIcon("rampart");
    }

    else if ("Vengeance" == actionLog.groups.actionName) {
      addRecast("vengeance");
      removeIcon("vengeance");
    }

    else { // GCD actions

      if (["Inner Beast", "Fell Cleave", "Inner Chaos"].indexOf(actionLog.groups.actionName) > -1) {
        if (player.level >= 45
        && player.level < 54) {
          count.targets = 1; // Steel Cyclone is stronger than Inner Beast at 2+ targets
        }
        if (player.level >= 66) { // Enhanced Infuriate
          addRecast("infuriate1", player.ID, checkRecast("infuriate1", player.ID) - 5000);
          addRecast("infuriate2", player.ID, checkRecast("infuriate2", player.ID) - 5000);
          removeIcon("infuriate");
          addIconBlinkTimeout("infuriate",checkRecast("infuriate1", player.ID),nextid.infuriate,icon.infuriate);
        }
        removeIcon("innerbeast");
      }

      else if (["Steel Cyclone", "Decimate", "Chaotic Cyclone"].indexOf(actionLog.groups.actionName) > -1) {
        if (Date.now() - previous.steelcyclone > 1000) {
          count.targets = 1;
          previous.steelcyclone = Date.now();
          if (player.level >= 66) { // Enhanced Infuriate
            addRecast("infuriate1", player.ID, checkRecast("infuriate1", player.ID) - 5000);
            addRecast("infuriate2", player.ID, checkRecast("infuriate2", player.ID) - 5000);
            removeIcon("infuriate");
            addIconBlinkTimeout("infuriate",checkRecast("infuriate1", player.ID),nextid.infuriate,icon.infuriate);
          }
        }
        else {
          count.targets = count.targets + 1;
        }
        removeIcon("innerbeast");
      }

      // These actions affect combo

      else if ("Heavy Swing" == actionLog.groups.actionName
      && actionLog.groups.result.length >= 2) {
        count.targets = 1;
        if ([1, 2].indexOf(next.combo) == -1) {
          warCombo();
          toggle.combo = Date.now();
        }
        removeIcon("heavyswing");
        if (player.level >= 4) {
          warComboTimeout();
        }
        else {
          warCombo();
        }
      }

      else if ("Maim" == actionLog.groups.actionName
      && actionLog.groups.result.length >= 8) {
        removeIcon("heavyswing");
        removeIcon("maim");
        if (player.level >= 26) {
          warComboTimeout();
        }
        else {
          warCombo();
        }
      }

      else if ("Storm's Path" == actionLog.groups.actionName
      && actionLog.groups.result.length >= 8) {
        warCombo();
      }

      else if ("Storm's Eye" == actionLog.groups.actionName
      && actionLog.groups.result.length >= 8) {
        addStatus("stormseye");
        warCombo();
      }

      else if ("Overpower" == actionLog.groups.actionName
      && actionLog.groups.result.length >= 2) {
        if (Date.now() - previous.overpower > 1000) {
          previous.overpower = Date.now();
          count.targets = 1;
        }
        else {
          count.targets = count.targets + 1;
        }
        if (next.combo != 3) {
          warCombo();
          toggle.combo = Date.now();
        }
        removeIcon("overpower");
        if (player.level >= 40) {
          warComboTimeout();
        }
        else {
          warCombo();
        }
      }

      else if ("Mythril Tempest" == actionLog.groups.actionName
      && actionLog.groups.result.length >= 8) {

        if (Date.now() - previous.mythriltempest > 1000) {
          previous.mythriltempest = Date.now();
          count.targets = 1;
          if (checkStatus("stormseye", player.ID) > 0) {
            addStatus("stormseye", Math.min(checkStatus("stormseye", player.ID) + 10000, duration.stormseye));
          }
        }
        else {
          count.targets = count.targets + 1;
        }
        warCombo();
      }

      else {
        warCombo();
      }

      if (count.targets >= 3
      && checkStatus("mitigation", statusLog.groups.targetID) < 1000) {
        warMitigation();
      }
      else {
        removeIcon("rampart");
      }

      warGauge(); // Check gauge after all GCD actions
    }
  }
}

function warStatus() {

  if (statusLog.groups.targetID == player.ID) { // Target is self

    if (["Berserk", "Inner Release"].indexOf(statusLog.groups.statusName) > -1) {
      if (statusLog.groups.gainsLoses == "gains") {
        addStatus("berserk", parseInt(statusLog.groups.effectDuration) * 1000, statusLog.groups.targetID);
        if (checkRecast("upheaval") < parseInt(statusLog.groups.effectDuration) * 1000) {
          addIconBlinkTimeout("upheaval", checkRecast("upheaval"), nextid.upheaval, icon.upheaval); // Show Upheaval if up during Berserk
        }
      }
      else if (statusLog.groups.gainsLoses == "loses") {
        removeStatus("berserk", statusLog.groups.targetID);
      }

      if ("Inner Release" == statusLog.groups.statusName) {
        warGauge();
      }
    }


    else if ("Storm's Eye" == statusLog.groups.statusName) {
      if (statusLog.groups.gainsLoses == "gains") {
        addStatus("stormseye", parseInt(statusLog.groups.effectDuration) * 1000, statusLog.groups.targetID);
      }
      else if (statusLog.groups.gainsLoses == "loses") {
        removeStatus("stormseye", statusLog.groups.targetID);
      }
    }

    else if ("Raw Intuition" == statusLog.groups.statusName) {
      if (statusLog.groups.gainsLoses == "gains") {
        if (checkStatus("mitigation", statusLog.groups.targetID) < parseInt(statusLog.groups.effectDuration) * 1000) {
          addStatus("mitigation", parseInt(statusLog.groups.effectDuration) * 1000, statusLog.groups.targetID);
        }
      }
      else if (statusLog.groups.gainsLoses == "loses") {
        if (checkStatus("mitigation", statusLog.groups.targetID) < 0
        && count.targets >= 3) {
          warMitigation();
        }
      }
    }

    else if ("Rampart" == statusLog.groups.statusName) {
      if (statusLog.groups.gainsLoses == "gains") {
        if (checkStatus("mitigation", statusLog.groups.targetID) < parseInt(statusLog.groups.effectDuration) * 1000) {
          addStatus("mitigation", parseInt(statusLog.groups.effectDuration) * 1000, statusLog.groups.targetID);
        }
      }
      else if (statusLog.groups.gainsLoses == "loses") {
        if (checkStatus("mitigation", statusLog.groups.targetID) < 0 // Check for overlaps
        && count.targets >= 3) {
          warMitigation();
        }
      }
    }

    else if ("Vengeance" == statusLog.groups.statusName) {
      if (statusLog.groups.gainsLoses == "gains") {
        if (checkStatus("mitigation", statusLog.groups.targetID) < parseInt(statusLog.groups.effectDuration) * 1000) {
          addStatus("mitigation", parseInt(statusLog.groups.effectDuration) * 1000, statusLog.groups.targetID);
        }
      }
      else if (statusLog.groups.gainsLoses == "loses") {
        if (checkStatus("mitigation", statusLog.groups.targetID) < 0
        && count.targets >= 3) {
          warMitigation();
        }
      }
    }

    else if ("Nascent Chaos" == statusLog.groups.statusName) {
      if (statusLog.groups.gainsLoses == "gains") {
        addStatus("nascentchaos", parseInt(statusLog.groups.effectDuration) * 1000, statusLog.groups.targetID);
        removeIcon("berserk");
      }
      else if (statusLog.groups.gainsLoses == "loses") {
        removeStatus("nascentchaos", statusLog.groups.targetID);
        addIconBlinkTimeout("berserk",checkRecast("berserk"),nextid.berserk,icon.berserk);
      }
      warGauge()
    }
  }
}


function warMitigation() {

  // Shows next mitigation cooldown
  // Ideally Vengeance > Raw Intuition > Rampart > Raw Intuition > DPS plz wake up and DPS

  if (player.level >= 56) {
    if (checkRecast("vengeance") <= Math.min(checkRecast("rampart"), checkRecast("rawintuition"))) {
      addIconBlinkTimeout("mitigation",checkRecast("vengeance"),nextid.mitigation,icon.vengeance);
    }
    else if (checkRecast("rawintuition") <= Math.min(checkRecast("rampart"), checkRecast("vengeance"))) {
      addIconBlinkTimeout("mitigation",checkRecast("rawintuition"),nextid.mitigation,icon.rawintuition);
    }
    else if (checkRecast("rampart") <= Math.min(checkRecast("vengeance"), checkRecast("rawintuition"))) {
      addIconBlinkTimeout("mitigation",checkRecast("rampart"),nextid.mitigation,icon.rampart);
    }
  }

  else if (player.level >= 46) {
    if (checkRecast("vengeance") <= checkRecast("rampart")) {
      addIconBlinkTimeout("mitigation",checkRecast("vengeance"),nextid.mitigation,icon.vengeance);
    }
    else if (checkRecast("rampart") <= checkRecast("vengeance")) {
      addIconBlinkTimeout("mitigation",checkRecast("rampart"),nextid.mitigation,icon.rampart);
    }
  }

  else if (player.level >= 8) {
    addIconBlinkTimeout("mitigation",checkRecast("rampart"),nextid.mitigation,icon.rampart);
  }
}

function warGauge() {

  let targetbeast = 50; // Display spender icon if Beast is this value or above

  // Set Inner Beast icon - listed from highest to lowest minimum potency
  if (checkStatus("nascentchaos", player.ID) > 2500) {
    if (count.targets >= 3) {
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
  && count.targets >= 3) {
    icon.innerbeast = icon.decimate;
  }
  else if (player.level >= 45
  && count.targets >= 3) {
    icon.innerbeast = icon.steelcyclone;
  }
  else if (player.level >= 54) {
    icon.innerbeast = icon.fellcleave;
  }
  else if (player.level >= 45
  && player.level < 54
  && count.targets >= 2) {
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
  && checkRecast("berserk") < 5000
  && checkRecast("infuriate1", player.ID) < 40000) {
    targetbeast = 50; // Avoid overcapping during Inner Release
  }
  else if (player.level >= 66
  && checkRecast("infuriate1", player.ID) < 10000) {
    targetbeast = 50; // Avoid overcapping from Enhanced Infuriate
  }
  else if (player.level < 66
  && checkRecast("infuriate1", player.ID) < 5000) {
    targetbeast = 50; // Avoid overcapping from Infuriate
  }
  else if (player.level >= 74
  && checkStatus("nascentchaos", player.ID) > 2500
  && checkStatus("nascentchaos", player.ID) < 12500) {
    targetbeast = 50; // Avoid wasting Nascent Chaos
  }
  else if (player.level >= 50
  && count.targets <= 3 // AoE wins at 3
  && checkStatus("stormseye", player.ID) < 15000) {
    targetbeast = 90; // Avoid letting Storm's Eye fall off during AoE
  }
  else if (player.level >= 50
  && checkStatus("stormseye", player.ID) < 5000) {
    targetbeast = 90; // Avoid using spenders out of Storm's Eye
  }
  else if (player.level >= 45
  && count.targets >= 3) {
    targetbeast = 50; // Use AoE
  }
  else if (player.level >= 64
  && checkRecast("upheaval") < 20000) { // Revisit if too conservative
    targetbeast = 70; // Stay above 20 for Upheavals
  }
  else {
    targetbeast = 50; // All other cases
  }

  // Berserk/Inner Release
  if (checkRecast("berserk") < 0
  && checkStatus("stormseye", player.ID) > 0) {
    addIcon({name: "berserk"});
  }
  else if (player.level >= 70
  && checkRecast("upheaval") < 1000
  && checkStatus("berserk", player.ID) > 0) {
    addIcon({name: "upheaval"});
  }
  else if (player.level >= 64
  && player.jobDetail.beast >= 20
  && checkRecast("upheaval") < 1000
  && checkRecast("berserk") > 25000) {
    addIcon({name: "upheaval"});
  }
  else {
    removeIcon("upheaval");
  }

  if (player.level >= 35
  && player.jobDetail.beast >= targetbeast) {
    addIcon({name: "innerbeast"});
  }
  else {
    removeIcon("innerbeast");
  }
}

function warCombo() {

  delete toggle.combo;

  removeIcon("heavyswing");
  removeIcon("maim");
  removeIcon("stormspath");

  // Revisit this later if it is refreshing too much
  if (player.level >= 50
  && checkRecast("berserk") < 17500
  && checkStatus("stormseye", player.ID) - Math.max(checkRecast("berserk"), 0) < 20000) {
    stormseyeCombo();
  }

  else if (player.level >= 74
  && count.targets >= 2
  && checkStatus("stormseye", player.ID) > 7500) {
    mythriltempestCombo();
  }

  else if (player.level >= 50
  && count.targets >= 3
  && checkStatus("stormseye", player.ID) > 7500) {
    mythriltempestCombo();
  }

  // Revisit this later if it is too conservative
  else if (player.level >= 50
  && checkStatus("stormseye", player.ID) < 10000) {
    stormseyeCombo();
  }

  else if (player.level >= 40
  && count.targets >= 3) {
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
  addIcon({name: "heavyswing"});
  if (player.level >= 18) {
    addIcon({name: "maim"});
  }
  if (player.level >= 38) {
    addIcon({name: "stormspath"});
  }
}

function stormseyeCombo() {
  next.combo = 2;
  addIcon({name: "heavyswing"});
  addIcon({name: "maim"});
  addIcon({name: "stormseye"});
}

function mythriltempestCombo() {
  next.combo = 3;
  addIcon({name: "overpower"});
  removeIcon("maim");
  if (player.level >= 40) {
    addIcon({name: "mythriltempest"});
  }
}
