"use strict";

// LEVELING ROTATIONS

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
var blmMinimumAstralMP = 200;
var blmMinimumUmbralMP = 0;
var blmRotationBufferTime = 3000;
var blmProcBufferTime = 5000;
var umbralMilliseconds = 0;
var blmCasting = "";
var blmFillerInstant = "";

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
    blmMinimumAstralMP = 800;  // Despair + Blizzard IV
  }
  else if (player.level >= 40) {
    blmMinimumAstralMP = 200;  // Blizzard IV
  }
  else {
    blmMinimumAstralMP = 0;  // Transpose probably
  }

  if (player.level >= 60) {
    icon.firespam1 = icon.fire4;
    icon.firespam2 = icon.fire4;
    icon.firespam3 = icon.fire4;
  }
  else {
    icon.firespam1 = icon.fire;
    icon.firespam2 = icon.fire;
    icon.firespam3 = icon.fire;
  }

  // Any phase
  nextid.enochian = 0;  // ENOCHAAAAAAN
  nextid.filler = 1;
  nextid.thunder = nextid.filler;  // Appears when necessary at front of rotation
  nextid.thunder2 = nextid.filler;  // See above
  nextid.thundercloud = nextid.filler;  // See above above
  nextid.foul = nextid.filler;
  nextid.xenoglossy = nextid.filler;
  nextid.weave = 2;

  // Astral
  nextid.firespam1 = 10;
  nextid.firespam2 = nextid.firespam1 + 1;
  nextid.firespam3 = nextid.firespam1 + 2;
  nextid.despairinstant = 13;
  nextid.instant = 14;
  nextid.manafont = 15;
  nextid.flare = 17;
  nextid.despair = 18;
  nextid.transpose = 19;
  nextid.fire = nextid.transpose;
  nextid.blizzard3 = nextid.transpose;
  nextid.freeze = nextid.transpose;

  // Umbral
  nextid.blizzard = 18;
  nextid.blizzard2 = 18;
  nextid.blizzard4 = 18;
  nextid.fire3 = 19;
  nextid.freezespam = nextid.fire3;
  nextid.freeze = 19;
  nextid.coldflare = nextid.fire3;

  // oGCD
  nextid.leylines = 21;
  nextid.sharpcast = 22;
  nextid.triplecast = 23;
  nextid.swiftcast = 24;

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

  if (player.level >= 74) {
    recast.sharpcast = 30000;
  }
  else {
    recast.sharpcast = 60000;
  }
  icon.thundercloud = icon.thunder;

  // AoE Helpers
  previous.blizzard2 = 0;
  previous.fire2 = 0;
  previous.thunder2 = 0;
  previous.freeze = 0;
  previous.flare = 0;
  previous.foul = 0;

  count.targets = 1;

  blmRotationBufferTime = 3000;  // Adjust to liking? Probably should be a tad lower.

  blmNext();

}

function blmPlayerChangedEvent() {

  blmNext();

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
      addCountdownBar("thunder", checkStatus("thunder", target.ID), "removeCountdownBar");
    }
    else {
      removeCountdownBar("thunder");
    }

    previous.targetID = target.ID;

    if (!toggle.transition) { // To prevent accidental update
      blmNext();
    }
  }

}

function blmStartsUsing() {
  blmCasting = startGroups.actionname;
  blmNext();
}

function blmAction() {

  blmCasting = "";

  // console.log("Umbral Stacks: " + player.jobDetail.umbralStacks);
  // console.log("Umbral Hearts: " + player.jobDetail.umbralHearts);
  // console.log("Enochian: " + player.jobDetail.enochian);

  if (actionList.blm.indexOf(actionGroups.actionname) > -1) {

    if ("Fire" == actionGroups.actionname) {
      count.targets = 1;
    }

    else if ("Fire II" == actionGroups.actionname) {
      if (Date.now() - previous.fire2 > 1000) {
        previous.fire2 = Date.now();
        count.targets = 1;
      }
      else {
        count.targets = count.targets + 1;
      }
    }

    else if ("Fire III" == actionGroups.actionname) {
    }

    else if ("Fire IV" == actionGroups.actionname) {
    }

    else if ("Blizzard" == actionGroups.actionname) {
      count.targets = 1;
    }

    else if ("Blizzard II" == actionGroups.actionname) {
      if (Date.now() - previous.blizzard2 > 1000) {
        previous.blizzard2 = Date.now();
        count.targets = 1;
      }
      else {
        count.targets = count.targets + 1;
      }
    }

    else if ("Blizzard III" == actionGroups.actionname) {
    }

    else if (["Thunder", "Thunder III"].indexOf(actionGroups.actionname) > -1) {
      count.targets = 1;
      addStatus("thunder", duration.thunder, actionGroups.targetID);
    }

    else if (["Thunder II", "Thunder IV"].indexOf(actionGroups.actionname) > -1) {
      if (Date.now() - previous.thunder2 > 1000) {
        previous.thunder2 = Date.now();
        count.targets = 1;
      }
      else {
        count.targets = count.targets + 1;
      }
      addStatus("thunder2", duration.thunder2, actionGroups.targetID);
    }

    else if ("Flare" == actionGroups.actionname) {
      if (Date.now() - previous.flare > 1000) {
        previous.flare = Date.now();
        count.targets = 1;
      }
      else {
        count.targets = count.targets + 1;
      }
    }

    else if ("Foul" == actionGroups.actionname) {
      if (Date.now() - previous.foul > 1000) {
        previous.foul = Date.now();
        count.targets = 1;
      }
      else {
        count.targets = count.targets + 1;
      }
    }

    else if ("Freeze" == actionGroups.actionname) {
      if (Date.now() - previous.freeze > 1000) {
        previous.freeze = Date.now();
        count.targets = 1;
      }
      else {
        count.targets = count.targets + 1;
      }
    }

    // oGCDs

    else if ("Enochian" == actionGroups.actionname) {
      removeIcon("enochian");
      addRecast("enochian", recast.enochian);
    }

    else if ("Sharpcast" == actionGroups.actionname) {
      removeIcon("weave");
      addRecast("sharpcast", recast.sharpcast);
    }

    else if ("Manafont" == actionGroups.actionname) {
      removeIcon("manafont");
      addRecast("manafont", recast.manafont);
    }

    else if ("Transpose" == actionGroups.actionname) {
      removeIcon("transpose");
      addRecast("transpose", recast.transpose);
    }

    blmNext();

    console.log(count.targets);

  }
}

function blmCancelled() {
  blmCasting = "";
  blmNext();
}

function blmStatus() {

  if (statusGroups.targetID == player.ID) {

    if (statusGroups.statusname == "Thundercloud") {
      if (statusGroups.gainsloses == "gains") {
        addStatus("thundercloud", parseInt(statusGroups.duration) * 1000);
        addCountdownBar("thundercloud", checkStatus("thundercloud"), "removeCountdownBar");
      }
      else if (statusGroups.gainsloses == "loses") {
        if (blmFillerInstant == "Thundercloud") {
          blmFillerInstant = "";
        }
        removeStatus("thundercloud", statusGroups.targetID);
      }
    }

    else if (statusGroups.statusname == "Firestarter") {
      if (statusGroups.gainsloses == "gains") {
        addStatus("firestarter", parseInt(statusGroups.duration) * 1000);
        addCountdownBar("firestarter", checkStatus("firestarter"), "removeCountdownBar");
      }
      else if (statusGroups.gainsloses == "loses") {
        if (blmFillerInstant == "Firestarter") {
          blmFillerInstant = "";
          removeIcon("filler");
        }
        else {
          removeIcon("instant");
        }
        removeStatus("firestarter", statusGroups.targetID);
        // removeIcon("firestarter");
      }
    }

  }

  else {

    // console.log(statusGroups.targetID + statusGroups.gainsloses + statusGroups.statusname);

    if (["Thunder", "Thunder II", "Thunder III", "Thunder IV"].indexOf(statusGroups.statusname) > -1) {
      if (statusGroups.gainsloses == "gains") {
        addStatus("thunder", parseInt(statusGroups.duration) * 1000, statusGroups.targetID);
        addCountdownBar("thunder", checkStatus("thunder", statusGroups.targetID), "removeCountdownBar");
      }
      else if (statusGroups.gainsloses == "loses") {
        removeStatus("thunder", statusGroups.targetID);
      }
    }

  }
}

function blmNext() {

  // Astral to Umbral to Astral
  if (["Fire", "Fire II"].indexOf(blmCasting) > -1) {
    blmAstralRotation(player.currentMP, 15000);
  }
  else if (blmCasting == "Fire III") {
    removeIcon("fire3");
    blmAstralRotation(player.currentMP, 15000);
  }
  else if (["Flare", "Despair"].indexOf(blmCasting) > -1
  && player.jobDetail.umbralHearts > 0) {
    blmAstralRotation(player.currentMP * 0.34, 15000);
  }
  else if (["Flare", "Despair"].indexOf(blmCasting) > -1) {
    blmAstralRotation(0, 15000);
  }
  else if (["Blizzard", "Blizzard II", "Freeze"].indexOf(blmCasting) > -1) {
    blmUmbralRotation(player.currentMP, 15000);
  }
  else if (blmCasting == "Blizzard III") {
    removeIcon("blizzard3");
    blmUmbralRotation(player.currentMP, 15000);
  }
  else if (player.jobDetail.umbralStacks < 0) { // In Umbral
    blmUmbralRotation(player.currentMP, player.jobDetail.umbralMilliseconds);
  }
  else { // Starting out or in Astral
    blmAstralRotation(player.currentMP, player.jobDetail.umbralMilliseconds);
  }

}

// Astral Fire
function blmAstralRotation(currentMP, blmAstralTime) {

  blmEnochian(blmAstralTime);

  // Calculate how many Fires to display
  if (count.targets >= 3) {

    if (player.level >= 68) {
      count.firespam = 0;
    }

    else if (player.level >= 50 && count.targets >= 5) {
      count.firespam = Math.min(
        Math.floor((currentMP + player.jobDetail.umbralHearts * 800 - 800) / 3000),
        (blmAstralTime - blmRotationBufferTime) / 2800
      )
    }

    else if (player.level >= 60) {
      count.firespam = Math.min(
        Math.floor((currentMP + player.jobDetail.umbralHearts * 800 - 800) / 1600),
        (blmAstralTime - blmRotationBufferTime) / 2800
      )
    }

    else if (player.level < 35) {
      count.firespam = Math.min(
        Math.floor((currentMP + player.jobDetail.umbralHearts * 800 - blmMinimumAstralMP) / 3000),
        (blmAstralTime - blmRotationBufferTime) / 2800
      )
    }

    else {
      count.firespam = 0;
    }
  }

  else {
    count.firespam = Math.min(
      Math.floor((currentMP + player.jobDetail.umbralHearts * 800 - blmMinimumAstralMP) / 1600),
      (blmAstralTime - blmRotationBufferTime) / 2800
    )
  }

  // Create leading instant/weave
  if (player.level >= 72
  && checkRecast("triplecast") < 1000
  && count.firespam >= 2) {
    blmWeave(blmAstralTime, "triplecast");
  }
  else if (player.level >= 66
  && checkRecast("triplecast") < 1000
  && count.firespam >= 3) {
    blmWeave(blmAstralTime, "triplecast");
  }
  else if (player.level >= 54
  && checkRecast("sharpcast") < 1000) {
    blmWeave(blmAstralTime, "sharpcast");
  }
  else if (player.level >= 52
  && checkRecast("leylines") < 1000) {
    blmWeave(blmAstralTime, "leylines");
  }
  else {
    removeIcon("weave");
    blmThunder(blmAstralTime);
  }

  // Place instants if Manafont is available
  if (player.level >= 30
  && checkRecast("manafont") < blmAstralTime - blmRotationBufferTime) {

    // Recently used Triplecast, hopefully competently
    if (checkStatus("triplecast") > blmAstralTime - blmRotationBufferTime) {
      addIcon("manafont");
    }

    // Xenoglossy available
    else if (player.level >= 80
    && player.jobDetail.foulCount == 2
    && blmAstralTime > blmRotationBufferTime) {
      addIcon("instant", "xenoglossy");
      addIcon("manafont");
    }
    else if (player.level >= 80
    && player.jobDetail.foulCount == 1
    && blmAstralTime > blmRotationBufferTime
    && blmFillerInstant != "Xenoglossy") {
      addIcon("instant", "xenoglossy");
      addIcon("manafont");
    }

    // Firestarter available
    else if (checkStatus("firestarter") >= blmAstralTime
    && blmFillerInstant != "Firestarter") {
      addIcon("instant", "firestarter");
      addIcon("manafont");
    }

    // No opportunities
    else {
      removeIcon("manafont");
    }
  }

  // Place Firestarter anyway
  else {
    if (checkStatus("firestarter") >= blmAstralTime
    && blmFillerInstant != "Firestarter") {
      addIcon("instant", "firestarter");
    }
  }

  if (player.level >= 18
  && count.targets >= 3) {

    if (player.level >= 60) {
      if (currentMP < 800) {
        removeIcon("flare");
      }
      else {
        addIcon("flare");
      }
    }

    else if (player.level >= 60
    && count.targets < 5
    && (player.jobDetail.enochian || checkRecast("enochian") < 0)) {

      if (count.firespam >= 3) {
        addIcon("firespam1", "fire4");
      }
      else {
        removeIcon("firespam1");
      }

      if (count.firespam >= 2) {
        addIcon("firespam2", "fire4");
      }
      else {
        removeIcon("firespam2");
      }

      if (count.firespam >= 1) {
        if (blmCasting == "Fire IV"
        && count.firespam < 1.3) {
          removeIcon("firespam3");
        }
        else {
          addIcon("firespam3", "fire4");
        }
      }
      else {
        removeIcon("firespam3");
      }

      if (currentMP < 800) {
        removeIcon("flare");
      }
      else {
        addIcon("flare");
      }
    }

    else if (player.level >= 50) {
      if (count.firespam >= 3) {
        addIcon("firespam1", "fire2");
      }
      else {
        removeIcon("firespam1");
      }

      if (count.firespam >= 2) {
        addIcon("firespam2", "fire2");
      }
      else {
        removeIcon("firespam2");
      }

      if (count.firespam >= 1) {
        if (blmCasting == "Fire II"
        && count.firespam < 1.3) {
          removeIcon("firespam3");
        }
        else {
          addIcon("firespam3", "fire2");
        }
      }
      else {
        removeIcon("firespam3");
      }

      if (currentMP < 800) {
        removeIcon("flare");
      }
      else {
        addIcon("flare");
      }
    }

    else if (player.level >= 35
    && player.level < 50) {
      // Nothing - Freeze spam. Shift to Umbral
    }

    else {
      if (count.firespam >= 3) {
        addIcon("firespam1", "fire2");
      }
      else {
        removeIcon("firespam1");
      }

      if (count.firespam >= 2) {
        addIcon("firespam2", "fire2");
      }
      else {
        removeIcon("firespam2");
      }

      if (count.firespam >= 1) {
        if (blmCasting == "Fire II"
        && count.firespam < 1.3) {
          removeIcon("firespam3");
        }
        else {
          addIcon("firespam3", "fire2");
        }
      }
      else {
        removeIcon("firespam3");
      }
    }
  }

  // Single Target
  else {

    // Fire IV
    if (player.level >= 60
    && (player.jobDetail.enochian || checkRecast("enochian") < 0)) {
      if (count.firespam >= 3) {
        addIcon("firespam1", "fire4");
      }
      else {
        removeIcon("firespam1");
      }

      if (count.firespam >= 2) {
        addIcon("firespam2", "fire4");
      }
      else {
        removeIcon("firespam2");
      }

      if (count.firespam >= 1) {
        if (blmCasting == "Fire IV"
        && count.firespam < 1.3) {
          removeIcon("firespam3");
        }
        else {
          addIcon("firespam3", "fire4");
        }
      }
      else {
        removeIcon("firespam3");
      }
    }

    // Pre Fire IV
    else {
      if (count.firespam >= 3) {
        addIcon("firespam1", "fire");
      }
      else {
        removeIcon("firespam1");
      }

      if (count.firespam >= 2) {
        addIcon("firespam2", "fire");
      }
      else {
        removeIcon("firespam2");
      }

      if (count.firespam >= 1) {
        if (blmCasting == "Fire"
        && count.firespam < 1.3) {
          removeIcon("firespam3");
        }
        else {
          addIcon("firespam3", "fire");
        }
      }
      else {
        removeIcon("firespam3");
      }
    }
  }

  if (player.level >= 72
  && currentMP - count.firespam * 1600 >= blmMinimumAstralMP
  && currentMP - count.firespam * 1600 < 1600 + blmMinimumAstralMP) {
    addIcon("despair");
  }
  else {
    removeIcon("despair");
  }

  // Transition
  if (count.targets >= 3) {
    if (player.level >= 72) {
      addIcon("freeze");
    }
    else {
      addIcon("transpose");
    }
  }
  else {
    if (player.level >= 60
    && blmCasting == "Fire"
    && (currentMP + player.jobDetail.umbralHearts * 800 - 1600 - blmMinimumAstralMP) / 1600 < (blmAstralTime - blmRotationBufferTime) / 2800) {
      addIcon("blizzard3");
    }
    else if (blmCasting == "Blizzard III") {
      removeIcon("blizzard3");
    }
    else if (player.level >= 60
    && blmAstralTime > blmRotationBufferTime
    && (currentMP + player.jobDetail.umbralHearts * 800 - 1600 - blmMinimumAstralMP) / 1600 >= (blmAstralTime - blmRotationBufferTime) / 2800) {
      addIcon("fire");
    }
    else {
      addIcon("blizzard3");
    }
  }
}

// Umbral Ice
function blmUmbralRotation(currentMP, blmUmbralTime) {

  blmEnochian(blmUmbralTime);
  blmThunder(blmUmbralTime);

  removeIcon("firespam1");
  removeIcon("firespam2");
  removeIcon("firespam3");

  blmThunder(blmUmbralTime);

  if (player.jobDetail.umbralStacks <= -3) {
    blmMinimumUmbralMP = 3800;
  }
  else if (player.jobDetail.umbralStacks <= -2) {
    blmMinimumUmbralMP = 5300;
  }
  else if (player.jobDetail.umbralStacks <= -1) {
    blmMinimumUmbralMP = 6800;
  }

  // AoE
  if (count.targets >= 3) {
    if (player.level >= 50) {
      if (blmCasting == "Freeze") {
        removeIcon("freeze");
      }
      // AoE uses Freeze to transition to Umbral III
      else if (player.jobDetail.umbralStacks != -3) {
        addIcon("freeze");
      }
      else {
        removeIcon("freeze");
      }
    }
    else if (player.level >= 35) {
      addIcon("freezespam");
    }
    else {
      if (player.currentMP == 10000) {
        removeIcon("blizzard2");
      }
      else if (player.currentMP >= blmMinimumUmbralMP && Date.now() - previous.serverTick > 3000 - 2500) {
        removeIcon("blizzard2");
      }
      else {
        addIcon("blizzard2");
      }
    }
  }

  // Single target
  else {

    // Blizzard IV (post 58)
    if (player.level >= 58) {
      if (blmCasting == "Blizzard IV") {
        removeIcon("blizzard4");
      }
      else if (player.jobDetail.umbralHearts == 3) {
        removeIcon("blizzard4");
      }
      else if (player.jobDetail.enochian || checkRecast("enochian") < 0) {
        addIcon("blizzard4");
      }
      else {
        removeIcon("blizzard4");
      }
    }

    // Blizzard spam (pre 58)
    else {
      if (player.currentMP == 10000) {
        removeIcon("blizzard");
      }
      else if (player.currentMP >= blmMinimumMP && Date.now() - previous.serverTick > 3000 - 2500) {
        removeIcon("blizzard");
      }
      else {
        addIcon("blizzard");
      }
    }
  }

  // Transition spell (Fire III, etc.)
  // Only transitions at full MP
  if (player.currentMP == 10000 ||
  (player.currentMP >= blmMinimumUmbralMP && Date.now() - previous.serverTick > 1500)) {

    if (player.level >= 72
    && count.targets >= 5) {
      addIcon("coldflare");  // "Cold flare"
    }
    else if (count.targets >= 3) {
      if (player.level >= 50) {
        addIcon("fire3");
      }
      else if (player.level >= 35) {
        addIcon("freezespam");  // Just spam Freeze at this level
      }
      else {
        addIcon("transpose");
      }
    }
    else {
      if (player.level >= 40) {
        addIcon("fire3");
      }
      else if (player.level < 34) {
        addIcon("transpose");
      }
    }
  }
}

// Enochian
function blmEnochian(rotationTime) {
  if (!player.jobDetail.enochian
  && checkRecast("enochian") <= 0
  && rotationTime > blmRotationBufferTime) {
    addIcon("enochian");
  }
  else {
    removeIcon("enochian");
  }
}

// Looks for instants for weaving
function blmWeave(rotationTime, weaveAction) {

  if (player.level >= 80
  && player.jobDetail.foulCount > 0
  && rotationTime > 2500 + blmRotationBufferTime) {
    blmFillerInstant = "Xenoglossy";
    addIcon("filler", "xenoglossy");
  }
  else if (checkStatus("firestarter") >= 1000) {
    blmFillerInstant = "Firestarter";
    addIcon("filler", "firestarter");
  }
  else if (checkStatus("thundercloud") >= rotationTime + blmRotationBufferTime) {
    blmFillerInstant = "Thundercloud";
    addIcon("filler", "thunder");
  }
}

// Thunder (for Umbral Ice)
function blmThunder(rotationTime) {

  // Hide in Umbral Ice but not at Umbral Ice III
  if (player.level >= 40
  && player.umbralStacks < 0
  && player.umbralStacks != -3) {
    removeIcon("thunder");
  }

  // Hide if casting already
  else if (["Thunder", "Thunder II", "Thunder III", "Thunder IV"].indexOf(blmCasting) > -1) {
    removeIcon("thunder");
  }

  // AoE
  else if (count.targets >= 3) {

    // No AoE? No problem
    if (player.level < 26) {
      removeIcon("thunder");
    }

    // Use Thundercloud immediately during AoE
    else if (checkStatus("thundercloud") > 0
    && rotationTime > 2500 + blmRotationBufferTime) {
      addIcon("thunder");
    }

    // Keep up DoT during Freeze spam
    else if (player.level >= 35
    && player.level < 50
    && checkStatus("thunder", target.ID) <= 0) {
      addIcon("thunder");
    }

    // Hardcast Thunder
    else if (player.level < 64
    && player.currentMP >= 400
    && checkStatus("thunder", target.ID) <= 2500
    && rotationTime > 2500 + blmRotationBufferTime) {
      addIcon("thunder");
    }
    else if (player.currentMP >= 800
    && checkStatus("thunder", target.ID) <= 2500
    && rotationTime > 2500 + blmRotationBufferTime) {
      addIcon("thunder");
    }

    else {
      removeIcon("thunder");
    }

  }

  // Single target
  else {

    // Thundercloud
    if (checkStatus("thundercloud") > 0
    && checkStatus("thundercloud") < blmProcBufferTime
    && rotationTime > 2500 + blmRotationBufferTime) {
      addIcon("thunder");
    }
    else if (checkStatus("thundercloud") > 0
    && checkStatus("thunder", target.ID) <= 0
    && rotationTime > 2500 + blmRotationBufferTime) {
      addIcon("thunder");
    }

    // Hardcast Thunder
    else if (player.level < 45
    && player.currentMP >= 200
    && checkStatus("thunder", target.ID) <= 2500
    && rotationTime > 2500 + blmRotationBufferTime) {
      addIcon("thunder");
    }
    else if (player.currentMP >= 400
    && checkStatus("thunder", target.ID) <= 2500
    && rotationTime > 2500 + blmRotationBufferTime) {
      addIcon("thunder");
    }

    else {
      removeIcon("thunder");
    }
  }
}
