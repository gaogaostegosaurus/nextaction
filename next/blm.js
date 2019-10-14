"use strict";

// LEVELING ROTATIONS from

// Single-Target
// Sub-40: {F1 spam} Transpose T1 {B1 until max MP} Transpose
// 40-59:  B3 T3 {optional B1 for MP tick} F3 {F1 spam until low MP} repeat. Use F3p and T3p as you get them, but don't cancel casts to use procs
// 60-71: B3 B4 T3 F3 F4x3 F1 F4x3 repeat. Foul whenever
// 72+: B3 B4 T3 F3 F4x3 F1 F4x3 Despair repeat
// Same as 60-71 with Despair at the end
// Same as 80 just without Xeno. See guide for better details

// AOE
// 18-34: {F2 spam} Transpose {B2 until max MP} Transpose repeat. Keep up T2 dot
// 35-49: Spam Freeze. Keep up T2 dot
// 50-59: Freeze T2 F3 F2 F2 Flare Transpose repeat
// 60-67: Freeze T2 F3 {F4 2-3 times} Flare Transpose repeat
// Save 800 MP for Flare. Use 50-59 AOE Rotation at 5+ enemies
// 68-71: Freeze T4 F3 Flare Flare Transpose repeat
// 72+: Freeze T4 F3 Flare Flare repeat
// Same as 80. See guide for better details
// For all aoe, use Thundercloud procs on T2/T4 as you get them. Swift/Triple Flares. Manafont for an extra Flare. Foul after Transpose or Freeze

var fire4startCast = 0;
var fire4endCast = 9999;
var fire4castTime = 2800;
var fire4MP = 0;
var castMP = 0;
var castTime = 0;
var minimumMP = 200;
var umbralMilliseconds = 0;

actionList.blm = [
  "Blizzard", "Blizzard II", "Blizzard III", "Blizzard IV",
  "Fire", "Fire II", "Fire III", "Fire IV",
  "Thunder", "Thunder II", "Thunder III", "Thunder IV",
  "Freeze", "Flare", "Despair",
  "Foul", "Xenoglossy",
  "Enochian", "Ley Lines", "Sharpcast", "Manafont",
  "Swiftcast", "Lucid Dreaming"
];

function blmJobChange() {

  // Minimum Astral Phase MP
  if (player.level >= 72) {
    minimumMP = 800;  // Despair + Blizzard IV
  }
  else if (player.level >= 40) {
    minimumMP = 200;  // Blizzard IV
  }
  else {
    minimumMP = 0;  // Transpose probably
  }

  // Any phase
  nextid.enochian = 0;  // ENOCHAAAAAAN
  nextid.thunder = 1;  // Appears when necessary at front of rotation
  nextid.thunder2 = nextid.thunder;  // See above
  nextid.thundercloud = nextid.thunder;  // See above above
  nextid.foul = 2;  
  nextid.xenoglossy = nextid.foul;
  
  // Astral
  nextid.fire4 = 3;
  nextid.flare = nextid.fire4;
  nextid.swiftcastdespair = 4;
  nextid.despair = 5;
  nextid.firestarter = 6;
  nextid.manafontinstant = nextid.firestarter;
  nextid.manafontdespair = 8;
  nextid.blizzard4 = 8;
  nextid.fire = 9;
  nextid.blizzard3 = 9;
  nextid.freeze = 9;

  // Umbral
  nextid.blizzard4 = 8;
  nextid.fire3 = 9;
  nextid.coldflare = nextid.fire3;

  // oGCD
  nextid.leylines = 11;
  nextid.sharpcast = 12;
  nextid.triplecast = 13;
  nextid.swiftcast = 14;

  countdownid.thunder = 0;
  countdownid.thundercloud = 1;
  countdownid.firestarter = 2;

  // Set up traited actions
  if (player.level >= 45) {
    icon.thunder = icon.thunder3;
    duration.thunder = duration.thunder3;
  }
  else {
    icon.thunder = "000457";
    duration.thunder = 18000;
  }
  
  if (player.level >= 64) {
    icon.thunder2 = icon.thunder4;
    duration.thunder2 = duration.thunder4;
  }
  else {
    icon.thunder2 = "000468";
    duration.thunder2 = 12000;
  }
  icon.thundercloud = icon.thunder;

  // AoE Helpers
  previous.fire2 = 0;
  previous.thunder2 = 0;
  previous.freeze = 0;
  previous.flare = 0;
  previous.fire4 = 0;
  previous.foul = 0;

  // "Starts Using" toggles
  toggle.blizzard = 2;
  toggle.blizzard3 = 2;
  toggle.blizzard4 = 2;

  toggle.fire = 2;
  toggle.fire2 = 2;
  toggle.fire3 = 2;
  toggle.fire4 = 2;

  toggle.thunder = 2;
  toggle.thunder2 = 2;
  toggle.thunder3 = 2;
  toggle.thunder4 = 2;

  toggle.freeze = 2;
  toggle.flare = 2;
  toggle.foul = 2;

  bufferTime = 3000;

  blmRotation();

}

function blmPlayerChangedEvent() {

  if (!toggle.transition) { // Halts updates so that next predicted icons will be drawn
    blmRotation();
    // Triggers on MP, movement, timer countdown, etc.
    // Seems NOT EFFICIENT, but oh well.
  }

  // Identifies server ticks for Umbral to Astral timing
  if (previous.currentMP < player.currentMP) {
    // console.log(Date.now() - previous.serverTick);
    previous.serverTick = Date.now();
  }
  previous.currentMP = player.currentMP;

}

function blmTargetChangedEvent() {

  if (previous.targetID != target.ID) {

    // console.log("Target changed: " + target.ID);

    if (target.ID.startsWith("4")) {
      addCountdownBar("thunder", checkStatus("thunder", target.ID), "remove");
    }
    else {
      removeCountdownBar("thunder");
    }

    previous.targetID = target.ID;

    if (!toggle.transition) { // To prevent accidental update
      blmRotation();
    }
  }

}

function blmAction() {

  delete toggle.transition; // If action occured then no longer transitioning, probably

  // console.log("Umbral Stacks: " + player.jobDetail.umbralStacks);
  // console.log("Umbral Hearts: " + player.jobDetail.umbralHearts);
  // console.log("Enochian: " + player.jobDetail.enochian);

  if (actionList.blm.indexOf(actionGroups.actionname) > -1) {

    if (["Fire II", "Thunder IV", "Freeze", "Flare", "Foul"].indexOf(actionGroups.actionname) > -1) {
      toggle.aoe = Date.now()
    }
    else if (["Blizzard", "Blizzard III", "Blizzard IV", "Fire", "Fire IV", "Thunder III"].indexOf(actionGroups.actionname) > -1) {
      delete toggle.aoe;
    }

    if ("Fire" == actionGroups.actionname) {
      if (player.level >= 60) {
        toggle.fire = 0;
      }
      toggle.fire4 = 2;
    }

    else if ("Fire III" == actionGroups.actionname) {
      toggle.fire3 = 0;
      toggle.blizzard3 = 2;
      toggle.fire = 2;
      toggle.fire4 = 2;
    }

    else if ("Blizzard III" == actionGroups.actionname) {
      toggle.blizzard3 = 0;
      toggle.blizzard4 = 2;
      toggle.fire3 = 2;
      toggle.fire4 = 2;
    }

    else if ("Fire IV" == actionGroups.actionname) {
      // Nothing
    }

    else if (["Thunder", "Thunder III"].indexOf(actionGroups.actionname) > -1) {
      toggle.thunder = 0;
      addStatus("thunder", duration.thunder, actionGroups.targetID);
    }

    else if (["Thunder II", "Thunder IV"].indexOf(actionGroups.actionname) > -1) {
      toggle.thunder2 = 0;
      if (Date.now() - previous.thunder2 > 1000) {
        previous.thunder2 = Date.now();
        count.aoe = 1;
      }
      else {
        count.aoe = count.aoe + 1;
      }
      addStatus("thunder2", duration.thunder2, actionGroups.targetID);
    }

    else if ("Fire II" == actionGroups.actionname) {
      if (Date.now() - previous.fire2 > 1000) {
        previous.fire2 = Date.now();
        count.aoe = 1;
      }
      else {
        count.aoe = count.aoe + 1;
      }
    }

    else if ("Flare" == actionGroups.actionname) {
      if (Date.now() - previous.flare > 1000) {
        previous.flare = Date.now();
        count.aoe = 1;
      }
      else {
        count.aoe = count.aoe + 1;
      }
    }

    else if ("Foul" == actionGroups.actionname) {
      toggle.foul = 0;
      if (Date.now() - previous.foul > 1000) {
        previous.foul = Date.now();
        count.aoe = 1;
      }
      else {
        count.aoe = count.aoe + 1;
      }
    }

    else if ("Freeze" == actionGroups.actionname) {
      toggle.freeze = 0;
      if (Date.now() - previous.freeze > 1000) {
        previous.freeze = Date.now();
        count.aoe = 1;
      }
      else {
        count.aoe = count.aoe + 1;
      }
    }

    // oGCDs

    else if ("Enochian" == actionGroups.actionname) {
      addRecast("enochian", recast.enochian);
    }

    else if ("Sharpcast" == actionGroups.actionname) {
      removeIcon("sharpcast");
      addRecast("sharpcast", recast.sharpcast);
    }

    else if ("Manafont" == actionGroups.actionname) {
      removeIcon("manafont");
      addRecast("manafont", recast.manafont);
    }

    blmRotation();

  }
}

function blmStartsUsing() {

  if ("Blizzard" == startGroups.actionname) {
    toggle.blizzard = 1;
  }

  else if ("Blizzard III" == startGroups.actionname) {
    toggle.blizzard3 = 1;
    toggle.transition = -3;
  }

  else if ("Blizzard IV" == startGroups.actionname) {
    toggle.blizzard4 = 1;
  }

  else if ("Fire" == startGroups.actionname) {
    toggle.fire = 1;
    if (player.jobDetail.umbralStacks > 0) {
      toggle.fire4 = 2;
      toggle.transition = 3;
    }
  }

  else if ("Fire III" == startGroups.actionname) {
    toggle.fire3 = 1;
    toggle.transition = 3;
  }

  else if ("Fire IV" == startGroups.actionname) {
    if (player.jobDetail.umbralMilliseconds < 3000 * 2 + bufferTime
    || player.currentMP < 1600 * 2 + minimumMP) {
      toggle.fire4 = 1;
    }
    else {
      toggle.fire4 = 2;
    }
  }

  else if (["Thunder", "Thunder II", "Thunder III", "Thunder IV"].indexOf(startGroups.actionname) > -1) {
    toggle.thunder = 1;
  }

  blmRotation();

}

function blmCancelled() {

  delete toggle.transition;

  if ("Blizzard" == cancelGroups.actionname) {
    toggle.blizzard = 2;
  }

  else if ("Blizzard III" == cancelGroups.actionname) {
    toggle.blizzard3 = 2;
  }

  else if ("Blizzard IV" == cancelGroups.actionname) {
    toggle.blizzard4 = 2;
  }

  else if ("Fire" == cancelGroups.actionname) {

    toggle.fire = 2;

    if (player.jobDetail.umbralMilliseconds >= 3000 + bufferTime
    && player.currentMP >= 1600 + minimumMP) {
      toggle.fire4 = 2;
    }
    else {
      toggle.fire4 = 0;
    }
  }

  else if ("Fire III" == cancelGroups.actionname) {
    toggle.fire3 = 2;
  }


  else if ("Fire IV" == cancelGroups.actionname) {
    if (player.jobDetail.umbralMilliseconds >= 3000 + bufferTime
    && player.currentMP >= 1600 + minimumMP) {
      toggle.fire4 = 2;
    }
    else {
      toggle.fire4 = 0;
    }
  }

  else if (["Thunder", "Thunder II", "Thunder III", "Thunder IV"].indexOf(cancelGroups.actionname) > -1) {
    toggle.thunder = 2;
  }

  blmRotation();

}

function blmStatus() {

  if (statusGroups.targetID == player.ID) {

    if (statusGroups.statusname == "Thundercloud") {
      if (statusGroups.gainsloses == "gains") {
        addStatus("thundercloud", parseInt(statusGroups.duration) * 1000);
        addCountdownBar("thundercloud", checkStatus("thundercloud"), "remove");
      }
      else if (statusGroups.gainsloses == "loses") {
        removeStatus("thundercloud", statusGroups.targetID);
        removeIcon("thundercloud");
      }
    }

    else if (statusGroups.statusname == "Firestarter") {
      if (statusGroups.gainsloses == "gains") {
        addStatus("firestarter", parseInt(statusGroups.duration) * 1000);
        addCountdownBar("firestarter", checkStatus("firestarter"), "remove");
      }
      else if (statusGroups.gainsloses == "loses") {
        removeStatus("firestarter", statusGroups.targetID);
        removeIcon("firestarter");
      }
    }

  }

  else {

    // console.log(statusGroups.targetID + statusGroups.gainsloses + statusGroups.statusname);

    if (["Thunder", "Thunder II", "Thunder III", "Thunder IV"].indexOf(statusGroups.statusname) > -1) {
      if (statusGroups.gainsloses == "gains") {
        addStatus("thunder", parseInt(statusGroups.duration) * 1000, statusGroups.targetID);
        addCountdownBar("thunder", checkStatus("thunder", statusGroups.targetID), "remove");
      }
      else if (statusGroups.gainsloses == "loses") {
        removeStatus("thunder", statusGroups.targetID);
      }
    }

  }

}

function blmRotation() {

  if (!player.jobDetail.enochian
  && player.jobDetail.umbralStacks != 0
  && checkRecast("enochian") <= 0) {
    addIcon("enochian");
  }
  else {
    removeIcon("enochian");
  }

  if (player.level < 40) {
    blmRotation1040();
  }

  else if (player.level < 60) {
    blmRotation4059();
  }

  else {

    // 60-71: B3 B4 T3 F3 F4x3 F1 F4x3 repeat
    // Add Foul at 70
    // Add Despair at end at 72
    // Add Xeno at 80

    if (toggle.transition < 0) {
      blmUmbralRotation(player.currentMP, 15000);
    }
    else if (toggle.transition > 0) {
      blmAstralRotation(player.currentMP, 15000);
    }
    else if (player.jobDetail.umbralStacks < 0) { // In Umbral
      blmUmbralRotation(player.currentMP, player.jobDetail.umbralMilliseconds);
    }
    else { // Starting out or in Astral
      blmAstralRotation(player.currentMP, player.jobDetail.umbralMilliseconds);
    }

  }

}

function blmAstralRotation(currentMP, umbralMilliseconds) {
  
  // Instant for Manafont
  if (player.level < 30
  || checkRecast("manafont") >= 0
  || currentMP >= 4 * 1600 + minimumMP) {
    // No manafont = hide instant icon
    // Wait for final set of 3 Fire IV to decide
    removeIcon("manafont");
    removeIcon("manafontinstant");
  }
  else if (player.jobDetail.asdf) {
    removeIcon("xenoglossy");
    addIcon("manafontinstant", "xenoglossy");  // Prioritize use with Xenoglossy
  }
  else if (checkStatus("swiftcast") > 0) {
    addIcon("swiftcastdespair", "swiftcast");
    // Use Swiftcast on Despair
  }
  else if (checkStatus("triplecast") > 0
  && currentMP < 3 * 1600 + minimumMP) {
    addIcon("swiftcastdespair", "triplecast");
    // Use Triplecast on at least first Despair
  }
  
  else if (checkStatus("thundercloud") > 0) {
  }
  else {
    removeIcon("manafont");
    removeIcon("manafontinstant");
  }
  
  // Thunder
  if (player.level < 26
  && toggle.aoe) {
    removeIcon("thunder");  // No AoE Thunder
  }
  else if (umbralMilliseconds < 3000 + bufferTime) {
    removeIcon("thunder");
  }
  else if (checkStatus("thundercloud") > 0
  && checkStatus("thundercloud") <= bufferTime) {
    addIcon("thunder");  // Proc about to drop
  }
  else if (checkStatus("thundercloud") > 0
  && checkStatus("thunder", target.ID) <= 0) {
    addIcon("thunder");  // DoT about to drop with proc available
  }
  else if (toggle.thunder != 2) {
    removeIcon("thunder");
  }
  else if (checkStatus("thunder", target.ID) <= bufferTime
  && (currentMP - player.jobDetail.umbralHearts * 800) % 1600 >= 800 + 200) {
    addIcon("thunder");
  }
  else {
    removeIcon("thunder");
  }

  // Fire IV
  if (player.level >= 60
  && currentMP >= 1600 * 1 + minimumMP
  && umbralMilliseconds > 3000 * 1 + bufferTime
  && toggle.fire4 == 2) {
    addIcon("fire4");
  }
  else {
    removeIcon("fire4");
  }

  // Firestarter
  if (checkStatus("firestarter", player.ID) >= umbralMilliseconds // Firestarter will be still up at 0
  && umbralMilliseconds > 0) {
    addIcon("firestarter"); // Refresh Astral with Firestarter proc if available
    bufferTime = 0;
  }
  else {
    removeIcon("firestarter");
  }
  
  if (player.level < 72 || currentMP < 800) {
    removeIcon("despair");
  }
  else if (currentMP <= 1600 * 3 + minimumMP
  && umbralMilliseconds > bufferTime
  && toggle.despair == 2) {
    addIcon("despair"); // Finish with Despair
  }
  else {
    removeIcon("despair");
  }

  // if (checkRecast("manafont") < umbralMilliseconds) { // Manafont will be up by 0
  //   addIcon("manafont"); // Continue Despairing with Manafont if available
  //   addIcon("manafontdespair");
  // }

  if (umbralMilliseconds > bufferTime
  && player.currentMP >= 1600 + minimumMP
  && toggle.fire == 2) {
    addIcon("fire");
  }
  else if (toggle.blizzard3 == 2) {
    addIcon("blizzard3"); // Ends rotation - no need to "remove"
  }
}

function blmUmbralRotation(currentMP, umbralMilliseconds) {

  // Thunder
  if (player.level < 26
  && toggle.aoe) {
    removeIcon("thunder");
  }
  else if (checkStatus("thundercloud") > 0
  && checkStatus("thundercloud") < bufferTime) {
    addIcon("thunder");
  }
  else if (checkStatus("thundercloud") > 0
  && checkStatus("thunder", target.ID) <= 0) {
    addIcon("thunder");
  }
  else if (toggle.thunder != 2) {
    removeIcon("thunder");
  }
  else if (checkStatus("thunder", target.ID) <= bufferTime) {
    addIcon("thunder");
  }
  else {
    removeIcon("thunder");
  }

  // Blizzard IV

  if (player.level < 58) {
    removeIcon("blizzard4");
  }
  else if (toggle.blizzard4 != 2) {
    removeIcon("blizzard4");
  }
  else if (player.jobDetail.umbralHearts == 3) {
    removeIcon("blizzard4");
  }
  else if (player.jobDetail.enochian > 0) {
    addIcon("blizzard4");
  }
  else if (checkRecast("enochian") < 0) {
    addIcon("blizzard4");
  }
  else {
    removeIcon("blizzard4");
  }

  // Fire 3

  if (player.level < 34) {
    removeIcon("fire3");
  }
  else if (toggle.fire3 != 2) {
    removeIcon("fire3");
  }
  else if (player.currentMP == 10000) {
    addIcon("fire3");
  }
  else if (player.jobDetail.umbralStacks >= 3
  && player.currentMP >= 3800
  && Date.now() - previous.serverTick < 2000) { // Might need adjustment later
    addIcon("fire3");
  }
  else if (player.jobDetail.umbralStacks >= 2
  && player.currentMP >= 5300
  && Date.now() - previous.serverTick < 2000) {
    addIcon("fire3");
  }
  else if (player.jobDetail.umbralStacks >= 1
  && player.currentMP >= 6800
  && Date.now() - previous.serverTick < 2000) {
    addIcon("fire3");
  }
  else {
    removeIcon("fire3");
  }

}

function blmAoECombo1834() {
  // 18-34:
  // {F2 spam} Transpose {B2 until max MP} Transpose repeat
  // Keep up T2 dot
  // Thundercloud procs on T2/T4 as you get them
}

function blmAoECombo3549() {
  // 35-49: Spam Freeze
  // Keep up T2 dot
  // Thundercloud procs on T2/T4 as you get them
}

function blmAoECombo5059() {
  // 50-59:
  // Freeze T2 F3 F2 F2 Flare Transpose repeat
  // Thundercloud procs on T2/T4 as you get them
  // Swift/Triple Flares
  // Manafont for an extra Flare
}

function blmAoECombo6067() {
  // 60-67:
  // Freeze T2 F3 {F4 2-3 times} Flare Transpose repeat
  // Save 800 MP for Flare
  // Use 50-59 AOE Rotation at 5+ enemies
  // Thundercloud procs on T2/T4 as you get them
  // Swift/Triple Flares
  // Manafont for an extra Flare
}

function blmAoECombo() {
  // 68-71:
  // Freeze T4 F3 Flare Flare Transpose repeat
  // Thundercloud procs on T2/T4 as you get them
  // Foul after Transpose or Freeze
  // Swift/Triple Flares
  // Manafont for an extra Flare
  // Remove Transpose at 72
}
