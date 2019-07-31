"use strict";

actionList.blm = [
  "Blizzard", "Blizzard II", "Blizzard III", "Blizzard IV",
  "Fire", "Fire II", "Fire III", "Fire IV",
  "Thunder", "Thunder II", "Thunder III", "Thunder IV",
  "Freeze", "Flare", "Despair",
  "Enochian", "Sharpcast", "Manafont",
  "Swiftcast", "Lucid Dreaming"
];

function blmJobChange() {
  nextid.thundercloud = 0;
  nextid.fire4_1 = 1;
  nextid.fire4_2 = 2;
  nextid.fire4_3 = 3;
  nextid.sharpcast = 4;
  nextid.firestarter = nextid.sharpcast;
  nextid.fire = 5;
  nextid.despair = nextid.fire;
  nextid.manafont = 6;
  nextid.manafontdespair = 7;
  nextid.blizzard3 = 9;

  nextid.blizzard3start = 0;
  nextid.enochian = 1;
  nextid.thunder3 = 2;
  nextid.blizzard4 = 3;
  nextid.fire3 = 9;

  blmRotation();

}

function blmPlayerChangedEvent() {

}

function blmStart() {
  if (player.jobDetail.umbralStacks < 0) {
    // console.log("Casting under Umbral");
    if ("Thunder III" == startGroups.actionname) {
      removeIcon(nextid.thunder3);
      previous.thunder3 = Date.now(); // Use this to detect last Thunder III cast, since status only takes hold on cast
    }
    else if ("Blizzard IV" == startGroups.actionname) {
      removeIcon(nextid.blizzard4);
    }
    else if ("Fire III" == startGroups.actionname) {
      removeIcon(nextid.fire3);
    }
  }
  else if (player.jobDetail.umbralStacks > 0) {
    if ("Fire IV" == startGroups.actionname) {
      if (dom["next" + nextid.fire4_3].className.includes("remove")) {
        // Possible oops
      }
      else if (dom["next" + nextid.fire4_2].className.includes("remove")) {
        removeIcon(nextid.fire4_3);
      }
      else if (dom["next" + nextid.fire4_1].className.includes("remove")) {
        removeIcon(nextid.fire4_2);
      }
      else {
        removeIcon(nextid.fire4_1);
      }
    }
    else if (startGroups.actionname == "Fire") {
      removeIcon(nextid.fire);
    }
    else if (startGroups.actionname == "Despair") {
      if (dom["next" + nextid.manafontdespair].className.includes("remove")) {
        console.log("Error (Despairs x 3?)")
      }
      else if (dom["next" + nextid.despair].className.includes("remove")) {
        removeIcon(nextid.manafontdespair);
      }
      else {
        removeIcon(nextid.despair);
      }
    }
    else if ("Blizzard III" == startGroups.actionname) {
      removeIcon(nextid.blizzard3);
    }
  }
  else {
    if ("Blizzard III" == startGroups.actionname) {
      removeIcon(nextid.blizzard3start);
    }
  }
}

function blmCancel() {
  if (cancelGroups.actionname == "Thunder III"
  && checkStatus("thunder", target.ID < 10000)) {
    previous.thunder3 = 0;
  }
  blmRotation();
}

// Checks and activates things when entering combat

function blmAction(logLine) {

  if (actionList.blm.indexOf(actionGroups.actionname) > -1) {

    removeText("loadmessage");

    if (["Fire II", "Thunder IV", "Freeze", "Flare", "Foul"].indexOf(actionGroups.actionname) > -1) {
      toggle.aoe = Date.now()
    }
    else if (["Blizzard", "Blizzard III", "Blizzard IV", "Fire", "Fire IV", "Thunder III"].indexOf(actionGroups.actionname) > -1) {
      delete toggle.aoe;
    }

    if ("Blizzard III" == actionGroups.actionname) {
      blmUmbralRotation();
    }
    else if (actionGroups.actionname == "Fire III") {
      blmAstralRotation();
    }
    else if (actionGroups.actionname == "Fire") {
      blmAstralRotation();
    }
    else if (actionGroups.actionname == "Thunder III") {
      addStatus("thunder", actionGroups.targetID, 24000);
    }

    else if (actionGroups.actionname == "Enochian") {
      removeIcon(nextid.enochian);
      addCooldown("enochian", recast.enochian);
    }
    else if (actionGroups.actionname == "Sharpcast") {
      removeIcon(nextid.sharpcast);
      addCooldown("sharpcast", recast.sharpcast);
    }
    else if (actionGroups.actionname == "Manafont") {
      removeIcon(nextid.manafont);
      addCooldown("manafont", recast.manafont);
    }
  }
}

function blmStatus(logLine) {

  if (statusGroups.targetID == player.ID) {

    if (statusGroups.statusname == "Thundercloud") {
      if (statusGroups.gainsloses == "gains") {
        addStatus("thundercloud", statusGroups.targetID, parseInt(logLine[6]) * 1000);
        blmCheckProcs()
      }
      else if (statusGroups.gainsloses == "loses") {
        removeStatus("thundercloud", statusGroups.targetID);
        removeIcon(nextid.thundercloud);
      }
    }

    else if (statusGroups.statusname == "Firestarter") {
      if (statusGroups.gainsloses== "gains") {
        addStatus("firestarter", statusGroups.targetID, parseInt(logLine[6]) * 1000);
        blmCheckProcs();
      }
      else if (statusGroups.gainsloses == "loses") {
        removeStatus("firestarter", statusGroups.targetID);
        removeIcon(nextid.firestarter);
      }
    }

  }

  else {

    if (statusGroups.statusname == "Thunder III") {
     if (statusGroups.gainsloses== "gains") {
       addStatus("thunder", statusGroups.targetID, parseInt(logLine[6]) * 1000);
       blmCheckProcs();
     }
     else if (statusGroups.gainsloses == "loses") {
       removeStatus("thunder", statusGroups.targetID);
     }
   }

     else if (statusGroups.statusname == "Thunder IV") {
      if (statusGroups.gainsloses== "gains") {
        addStatus("thunder", statusGroups.targetID, parseInt(logLine[6]) * 1000);
        blmCheckProcs()
      }
      else if (statusGroups.gainsloses == "loses") {
        removeStatus("thunder", statusGroups.targetID);
      }
    }

  }

}

function blmCheckProcs() {

  if (checkStatus("firestarter", player.ID) > 0
  && player.currentMP <= 3200
  && player.jobDetail.umbralStacks > 0) {  // Ideally, end of Astral phase?
    addIcon(nextid.firestarter, icon.fire3);
  }
  else {
    removeIcon(nextid.firestarter);
  }

  if (checkStatus("thundercloud", player.ID) > 0
  && (checkStatus("thundercloud", player.ID) < 5000 || checkStatus("thunder", target.ID) < 5000)) {
    addIcon(nextid.thundercloud, icon.thunder3);
  }
  else if (checkStatus("thundercloud", player.ID) > 0
  && toggle.aoe) {
    addIcon(nextid.thundercloud, icon.thunder3);
  }
  else {
    removeIcon(nextid.thundercloud);
  }
}

function blmRotation() {
  if (player.jobDetail.umbralStacks > 0) { // In Astral
    blmAstralRotation();
  }
  else if (player.jobDetail.umbralStacks < 0) {
    blmUmbralRotation();
  }
  else { // Not in Astral
    addIcon(nextid.blizzard3start, icon.blizzard3);
    blmUmbralRotation();
  }
}

function blmAstralRotation() {

  if (player.currentMP >= 4800
  && player.jobDetail.umbralMilliseconds > 12000) {
    addIcon(nextid.fire4_1, icon.fire4);
  }
  else {
    removeIcon(nextid.fire4_1);
  }

  if (player.currentMP >= 3200
  && player.jobDetail.umbralMilliseconds > 9000) {
    addIcon(nextid.fire4_2, icon.fire4);
  }
  else {
    removeIcon(nextid.fire4_2);
  }

  if (player.currentMP >= 1600
  && player.jobDetail.umbralMilliseconds > 6000) {
    addIcon(nextid.fire4_3, icon.fire4);
  }
  else {
    removeIcon(nextid.fire4_3);
  }

  // Post 3x Fire IV things
  if (player.currentMP > 7000) { // Ending first Fire IV set at this MP... probably
    if (checkStatus("sharpcast", player.ID) < player.jobDetail.umbralMilliseconds
    && player.jobDetail.umbralMilliseconds > 4000) {
      addIcon(nextid.fire, icon.fire);
    }
    if (player.jobDetail.umbralMilliseconds > 3000) {
      addIcon(nextid.fire, icon.fire);
    }
    else if (player.jobDetail.umbralMilliseconds > 0) {
      addIconBlink(nextid.fire, icon.fire);
    }
    else {
      // Start umbral?
    }
  }
  else {
    if (checkStatus("firestarter", player.ID) > player.jobDetail.umbralMilliseconds // Firestarter will be still up at 0
    && player.jobDetail.umbralMilliseconds > 0) {
      addIconBlink(nextid.firestarter, icon.fire3); // Refresh Astral with Firestarter proc if available
    }
    if (player.currentMP >= 800
    && player.jobDetail.umbralMilliseconds > 3000) {
      addIcon(nextid.despair, icon.despair); // Finish with Despair
    }
    if (checkCooldown("manafont", player.ID) < player.jobDetail.umbralMilliseconds) { // Manafont will be up by 0
      addIconBlink(nextid.manafont, icon.manafont); // Continue Despairing with Manafont if available
      addIconBlink(nextid.manafontdespair, icon.despair);
    }
    addIcon(nextid.blizzard3, icon.blizzard3); // End rotation
  }
}

function blmUmbralRotation() {
  // Activate on Blizzard III
  if (!player.jobDetail.enochian) {
    addIcon(nextid.enochian, icon.enochian);
  }
  if (Date.now() - previous.thunder3 < 15000) {
    addIcon(nextid.thunder3, icon.thunder3);
  }
  if (player.jobDetail.umbralHearts == 0) {
    addIcon(nextid.blizzard4, icon.blizzard4);
  }
  addIcon(nextid.fire3, icon.fire3); // End rotation
}
