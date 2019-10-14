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

  if (player.level >= 60) {

    // Any phase
    nextid.thunder = 0;
    nextid.foul = 1;
    nextid.xenoglossy = nextid.foul;

    // Astral
    nextid.fire4_1 = 2;
    nextid.fire4_2 = nextid.fire4_1 + 1;
    nextid.fire4_3 = nextid.fire4_1 + 2;
    nextid.firestarter = 5;
    nextid.despair = 6;
    nextid.manafont = 7;
    nextid.manafontdespair = 8;
    nextid.fire = 9;
    nextid.blizzard3 = 9;

    // Umbral
    nextid.blizzard4 = 1;
    nextid.fire3 = 9;
  }

  else if (player.level >= 40) {
    nextid.thunder = 0;
    nextid.fire_1 = 2;
    nextid.fire = nextid.fire_1;
    nextid.fire_2 = 3;
    nextid.fire_3 = 4;
    nextid.fire3 = 9;
    nextid.blizzard3 = 9;
    nextid.blizzard = nextid.fire_1;
  }

  else {
    nextid.thunder = 0;
    nextid.fire_1 = 2;
    nextid.fire = nextid.fire_1;
    nextid.fire_2 = 3;
    nextid.fire_3 = 4;
    nextid.fire3 = 5;
    nextid.blizzard = nextid.fire_1;
  }

  // oGCD
  nextid.enochian = 10;
  nextid.leylines = 11;
  nextid.sharpcast = 12;
  nextid.triplecast = 13;
  nextid.swiftcast = 14;

  countdownid.thunder = 0;
  countdownid.thundercloud = 1;
  countdownid.firestarter = 2;

  // Set up icons
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
    icon.thunder2 = "000457";
    duration.thunder2 = 12000;
  }
  icon.thundercloud = icon.thunder;

  previous.fire2 = 0;
  previous.thunder2 = 0;
  previous.freeze = 0;
  previous.flare = 0;
  previous.fire4 = 0;
  previous.foul = 0;

  toggle.stance = 0;

  toggle.blizzard = 2;
  toggle.blizzard3 = 2;
  toggle.blizzard4 = 2;

  toggle.fire = 2;
  toggle.fire3 = 2;
  toggle.fire4_1 = 2;
  toggle.fire4_2 = 2;
  toggle.fire4_3 = 2;

  toggle.thunder = 2;

  toggle.freeze = 2;
  toggle.flare = 2;
  toggle.foul = 2;

  bufferTime = 3000;

  blmRotation();

}

function blmPlayerChangedEvent() {

  blmRotation();
  // Triggers on MP, movement, timer countdown, etc.
  // Seems NOT EFFICIENT, but oh well.

  // Identifies server ticks for Umbral to Astral timing
  if (previous.playerMP < player.currentMP) {
    // console.log(Date.now() - previous.serverTick);
    previous.serverTick = Date.now();
  }
  previous.playerMP = player.currentMP;

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
    blmRotation();

  }

}

function blmAction() {

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
      toggle.fire = 0;

      toggle.fire4_1 = 2;
      toggle.fire4_2 = 2;
      toggle.fire4_3 = 2;
    }

    else if ("Fire III" == actionGroups.actionname) {
      toggle.fire3 = 0;

      toggle.blizzard3 = 2;
      toggle.fire = 2;
      toggle.fire4_1 = 2;
      toggle.fire4_2 = 2;
      toggle.fire4_3 = 2;
    }

    else if ("Blizzard III" == actionGroups.actionname) {
      toggle.blizzard3 = 0;

      toggle.blizzard4 = 2;
      toggle.fire3 = 2;
      toggle.fire4_1 = 2;
      toggle.fire4_2 = 2;
      toggle.fire4_3 = 2;
    }

    else if ("Fire IV" == actionGroups.actionname) {
    }

    else if (["Thunder", "Thunder III"].indexOf(actionGroups.actionname) > -1) {
      addStatus("thunder", duration.thunder, actionGroups.targetID);
    }

    else if (["Thunder II", "Thunder IV"].indexOf(actionGroups.actionname) > -1) {
      if (Date.now() - previous.thunder2 > 1000) {
        previous.thunder2 = Date.now();
        count.aoe = 1;
      }
      else {
        count.aoe = count.aoe + 1;
      }
      addStatus("thunder2", duration.thunder, actionGroups.targetID);
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
      if (Date.now() - previous.foul > 1000) {
        previous.foul = Date.now();
        count.aoe = 1;
      }
      else {
        count.aoe = count.aoe + 1;
      }
    }

    else if ("Freeze" == actionGroups.actionname) {
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
    toggle.blizzard3 = 1;
    blmUmbralRotation(player.currentMP, 15000);
  }

  else if ("Blizzard III" == startGroups.actionname) {
    toggle.blizzard3 = 1;
    blmUmbralRotation(player.currentMP, 15000);
  }

  else if ("Blizzard IV" == startGroups.actionname) {
    toggle.blizzard4 = 1;
  }

  else if ("Fire" == startGroups.actionname) {
    toggle.fire = 1;
    blmAstralRotation(player.currentMP, 15000);
  }

  if ("Fire III" == startGroups.actionname) {
    toggle.fire3 = 1;
    previous.stance = toggle.stance;
    toggle.stance = 3;
    blmRotation(player.currentMP, 15000);
  }

  else if ("Fire IV" == startGroups.actionname) {
    if (toggle.fire4_1 == 2) {
      toggle.fire4_1 = 1;
    }
    else if (toggle.fire4_2 == 2) {
      toggle.fire4_2 = 1;
    }
    else if (toggle.fire4_3 == 2) {
      toggle.fire4_3 = 1;
    }
  }

  else if (["Thunder", "Thunder II", "Thunder III", "Thunder IV"].indexOf(startGroups.actionname) > -1) {
    toggle.thunder = 1;
  }
  
}

function blmCancelled() {

  if ("Fire" == cancelGroups.actionname) {
    toggle.fire = 2;
    if (player.jobDetail.umbralStacks > 0) {
      blmAstralRotation(player.currentMP, player.jobDetail.umbralMilliseconds);
    }
    else {
      blmUmbralRotation(player.currentMP, player.jobDetail.umbralMilliseconds);
    }
  }

  else if ("Fire III" == cancelGroups.actionname) {
    toggle.fire3 = 2;
    if (player.jobDetail.umbralStacks > 0) {
      blmAstralRotation(player.currentMP, player.jobDetail.umbralMilliseconds);
    }
    else {
      blmUmbralRotation(player.currentMP, player.jobDetail.umbralMilliseconds);
    }
  }

  else if (["Thunder", "Thunder II", "Thunder III", "Thunder IV"].indexOf(cancelGroups.actionname) > -1) {
    toggle.thunder = 2;
  }

  else if ("Blizzard III" == cancelGroups.actionname) {
    toggle.blizzard3 = 2;
    if (player.jobDetail.umbralStacks > 0) {
      blmAstralRotation(player.currentMP, player.jobDetail.umbralMilliseconds);
    }
    else {
      blmUmbralRotation(player.currentMP, player.jobDetail.umbralMilliseconds);
    }
  }

  else if ("Blizzard IV" == cancelGroups.actionname) {
    toggle.blizzard4 = 2;
  }

  else if ("Fire IV" == cancelGroups.actionname) {
    if (toggle.fire4_3 == 1) {
      toggle.fire4_3 = 2;
    }
    else if (toggle.fire4_2 == 1) {
      toggle.fire4_2 = 2;
    }
    else if (toggle.fire4_1 == 1) {
      toggle.fire4_1 = 2;
    }
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

    if (toggle.stance < 0) { // In Umbral
      blmUmbralRotation(player.currentMP, player.jobDetail.umbralMilliseconds);
    }
    else { // Starting out or in Astral
      blmAstralRotation(player.currentMP, player.jobDetail.umbralMilliseconds);
    }

  }

}

function blmRotation1040() {

  // Sub-40:
  // {F1 spam} Transpose T1 {B1 until max MP} Transpose

  // Thunder
  if (checkStatus("thundercloud") > 0) {
    addIcon("thunder");
  }
  // else if () { // In Umbral
  //   addIcon("thunder");
  // }
  // else {
  //   removeIcon("thunder");
  // }

  if (player.jobDetail.umbralStacks < 0
  && player.currentMP < 10000) { // In Umbral
    addIcon("blizzard");
  }
  else {

  }
}

function blmRotation4059() {

  // 40-59:
  // B3 T3 {optional B1 for MP tick} F3 {F1 spam until low MP} repeat
  // Use F3p and T3p as you get them, but don't cancel casts to use procs

  // Minimum MP for Blizzard III
  if (player.jobDetail.umbralStacks >= 2) {
    minimumMP = 200;
  }
  else if (player.jobDetail.umbralStacks == 1) {
    minimumMP = 400;
  }
  else {
    minimumMP = 800;
  }

  // Thunder
  if (checkStatus("thundercloud") > 0) {
    addIcon("thunder");
  }
  else if (player.jobDetail.umbralStacks < 0
  && checkStatus("thunder", target.ID) < duration.thunder * 0.25) {
    addIcon("thunder");
  }
  else {
    removeIcon("thunder");
  }

  // Astral Phase
  if (player.jobDetail.umbralStacks > 0) {

    if (player.currentMP >= 1600 * 3 + minimumMP) {
      addIcon("fire_1");
    }
    else {
      removeIcon("fire_1");
    }

    if (player.currentMP >= 1600 * 2 + minimumMP) {
      addIcon("fire_2");
    }
    else {
      removeIcon("fire_2");
    }

    if (player.currentMP >= 1600 * 1 + minimumMP) {
      addIcon("fire_3");
    }
    else {
      removeIcon("fire_3");
    }

  }

  if (player.level >= 42
  && player.jobDetail.umbralStacks >= 0
  && checkStatus("firestarter") > 0) {
    addIcon("fire3");
  }
  else if (player.currentMP >= 10000
  && player.jobDetail.umbralStacks < 0) {
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

function blmAstralRotation(currentMP, umbralMilliseconds) {

  if (player.level < 72) {
    minimumMP = 200;
  }
  else {
    minimumMP = 800; // Needs Despair at end
  }

  // Thunder
  if (player.level >= 28
  && checkStatus("thundercloud") > 0
  && checkStatus("thundercloud") <= bufferTime
  && umbralMilliseconds > 3000 + bufferTime) {
    addIcon("thunder");
  }
  else if (player.level >= 28
  && checkStatus("thundercloud") > 0
  && checkStatus("thunder", target.ID) <= 0
  && umbralMilliseconds > 3000 + bufferTime) {
    addIcon("thunder");
  }
  else if (player.level >= 26
  && toggle.aoe
  && checkStatus("thunder", target.ID) <= bufferTime
  && (currentMP - player.jobDetail.umbralHearts * 800) % 1600 >= 800 + 400
  && umbralMilliseconds > 3000 + bufferTime
  && toggle.thunder == 2) {
    addIcon("thunder");
  }
  else if (checkStatus("thunder", target.ID) <= bufferTime
  && (currentMP - player.jobDetail.umbralHearts * 800) % 1600 >= 800 + 200
  && umbralMilliseconds > 3000 + bufferTime
  && toggle.thunder == 2) {
    addIcon("thunder");
  }
  else {
    removeIcon("thunder");
  }

  if (player.jobDetail.enochian) { // Populate Fire IV casts, hide as time/MP goes down

    if (currentMP >= player.jobDetail.umbralHearts * 800 + (3 - player.jobDetail.umbralHearts) * 1600 + minimumMP
    && umbralMilliseconds > 3000 * 3 + bufferTime
    && toggle.fire4_1 == 2) {
      addIcon("fire4_1", "fire4");
    }
    else {
      removeIcon("fire4_1");
    }

    if (currentMP >= player.jobDetail.umbralHearts * 800 + (2 - player.jobDetail.umbralHearts) * 1600 + minimumMP
    && umbralMilliseconds > 3000 * 2 + bufferTime
    && toggle.fire4_2 == 2) {
      addIcon("fire4_2", "fire4");
    }
    else {
      removeIcon("fire4_2");
    }

    if (currentMP >= player.jobDetail.umbralHearts * 800 + (1 - player.jobDetail.umbralHearts) * 1600 + minimumMP
    && umbralMilliseconds > 3000 * 1 + bufferTime
    && toggle.fire4_3 == 2) {
      addIcon("fire4_3", "fire4");
    }
    else {
      removeIcon("fire4_3");
    }

  }

  else {

    // No Enochian = no Fire IV
    // Probably a better way to do this but add in later

    removeIcon("fire4_1");
    removeIcon("fire4_2");
    removeIcon("fire4_3");
  }

  if (checkStatus("firestarter", player.ID) >= umbralMilliseconds // Firestarter will be still up at 0
  && umbralMilliseconds > 0) {
    addIcon("firestarter"); // Refresh Astral with Firestarter proc if available
    bufferTime = 0;
  }
  else {
    removeIcon("firestarter");
  }

  // if (player.level >= 72
  // && currentMP >= 800
  // && umbralMilliseconds > 3000) {
  //   addIcon("despair"); // Finish with Despair
  // }

  // if (checkRecast("manafont") < umbralMilliseconds) { // Manafont will be up by 0
  //   addIcon("manafont"); // Continue Despairing with Manafont if available
  //   addIcon("manafontdespair");
  // }

  if (checkStatus("firestarter", player.ID) < 0
  && umbralMilliseconds > bufferTime
  && toggle.fire == 2) {
    addIcon("fire");
  }
  else if (toggle.blizzard3 == 2) {
    addIcon("blizzard3"); // End rotation
  }
}

function blmUmbralRotation(currentMP, umbralMilliseconds) {

  // Thunder
  if (player.level >= 28
  && checkStatus("thundercloud") > 0
  && checkStatus("thundercloud") <= bufferTime) {
    addIcon("thunder");
  }
  else if (player.level >= 28
  && checkStatus("thundercloud") > 0
  && checkStatus("thunder", target.ID) <= 0) {
    addIcon("thunder");
  }
  else if (player.level >= 26
  && checkStatus("thunder", target.ID) <= bufferTime
  && toggle.aoe
  && currentMP >= 800
  && toggle.thunder == 2) {
    addIcon("thunder");
  }
  else if (checkStatus("thunder", target.ID) <= bufferTime
  && currentMP >= 400
  && toggle.thunder == 2) {
    addIcon("thunder");
  }
  else {
    removeIcon("thunder");
  }

  // Blizzard IV

  if (player.jobDetail.enochian > 0
  && player.jobDetail.umbralHearts == 0
  && toggle.blizzard4 == 2) {
    addIcon("blizzard4");
  }
  else {
    removeIcon("blizzard4");
  }

  // "Can I enter Astral?"

  if (player.currentMP == 10000
  && toggle.fire3 == 2) {
    addIcon("fire3");
  }
  else if (player.jobDetail.umbralStacks >= 3
  && player.currentMP >= 3800
  && toggle.fire3 == 2
  && Date.now() - previous.serverTick < 2000) { // Might need adjustment later
    addIcon("fire3");
  }
  else if (player.jobDetail.umbralStacks >= 2
  && player.currentMP >= 5300
  && toggle.fire3 == 2
  && Date.now() - previous.serverTick < 2000) {
    addIcon("fire3");
  }
  else if (player.jobDetail.umbralStacks >= 1
  && player.currentMP >= 6800
  && toggle.fire3 == 2
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
