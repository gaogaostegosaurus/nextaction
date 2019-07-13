"use strict";

actionList.blm = [
  "Blizzard", "Blizzard II", "Blizzard III", "Blizzard IV",
  "Fire", "Fire II", "Fire III", "Fire IV",
  "Thunder", "Thunder II", "Thunder III", "Thunder IV",
  "Freeze", "Flare", "Despair",
  "Sharpcast",
  "Swiftcast", "Lucid Dreaming"
];

// Circle Of Power (Leylines)

// Rotation
// T3 can be moved to fire phase without impacting 6 F4 rotation. Use Xeno for any of: movement, raid buffs, weaving, ice filler, etc.

// Losing uptime = drop a F4
// Lost Astral

function blmPlayerChangedEvent(e) {

  if (toggle.aoe) {

  }

  else {
    if (player.currentMP == 10000
    && player.jobDetail.umbralStacks < 0
    && player.jobDetail.umbralHearts == 3) {
      addIconBlink(nextid.fire3, icon.fire3);
    }
    else if (player.currentMP < 1600
    && player.jobDetail.umbralStacks > 0
    && checkStatus("firestarter", player.ID) < 0) {
      addIconBlink(nextid.blizzard3, icon.blizzard3);
    }
    else if (player.jobDetail.enochian == 0
    && player.jobDetail.umbralStacks == 0) {
      addIconBlink(nextid.blizzard3, icon.blizzard3);
    }
    else {
      removeIcon(nextid.fire3);
    }

    if (player.currentMP >= 4800
    && player.jobDetail.umbralStacks > 0
    && player.jobDetail.umbralMilliseconds > 12000
    && player.jobDetail.enochian > 0) {
      addIconBlink(nextid.fire4_1, icon.fire4);
    }
    else {
      removeIcon(nextid.fire4_1);
    }

    if (player.currentMP >= 3200
    && player.jobDetail.umbralStacks > 0
    && player.jobDetail.umbralMilliseconds > 9000
    && player.jobDetail.enochian > 0) {
      addIconBlink(nextid.fire4_2, icon.fire4);
    }
    else {
      removeIcon(nextid.fire4_2);
    }

    if (player.currentMP >= 1600
    && player.jobDetail.umbralStacks > 0
    && player.jobDetail.umbralMilliseconds > 6000
    && player.jobDetail.enochian > 0) {
      addIconBlink(nextid.fire4_3, icon.fire4);
    }
    // Possibly change to fire if running out of time
    else {
      removeIcon(nextid.fire4_3);
    }

    if (player.currentMP > 7000
    && player.jobDetail.umbralStacks >= 0
    && player.jobDetail.umbralMilliseconds > 0
    && checkStatus("firestarter", player.ID) < 0) {
      addIconBlink(nextid.fire, icon.fire);
    }
    else if (player.currentMP >= 800
    && player.currentMP < 7000
    && player.jobDetail.umbralStacks > 0
    && player.jobDetail.umbralMilliseconds > 0
    && player.jobDetail.enochian > 0) {
      addIconBlink(nextid.despair, icon.despair);
    }
    else {
      removeIcon(nextid.fire);
    }

    if (checkStatus("thunder", target.ID) < 6000
    && player.jobDetail.umbralStacks < 0) {
      addIconBlink(nextid.thunder3, icon.thunder3);
    }
    else {
      removeIcon(nextid.thunder3);
    }

    if (player.jobDetail.umbralStacks < 0
    && player.jobDetail.umbralHearts == 0
    && player.jobDetail.enochian > 0) {
      addIconBlink(nextid.blizzard4, icon.blizzard4);
    }
    else {
      removeIcon(nextid.blizzard4);
    }
  }
}

function blmJobChange() {
  nextid.thundercloud = 0;
  nextid.fire3 = 1;
  nextid.blizzard3 = 1;
  nextid.fire4_1 = 2;
  nextid.fire4_2 = 3;
  nextid.fire4_3 = 4;
  nextid.firestarter = 5;
  nextid.fire = 6;
  nextid.despair = 6;
  nextid.thunder3 = 7;
  nextid.blizzard4 = 8;
}

function blmStart(logLine) {
  blmCheckProcs();
  if (startGroups.actionname == "Fire IV") {
    count.fire4 = count.fire4 - 1;
  }
}

function blmCancel(logLine) {
  blmCheckProcs();
  if (cancelGroups.actionname == "Fire IV") {
    count.fire4 = count.fire4 + 1;
  }
}

// Checks and activates things when entering combat

function blmAction(logLine) {
  blmCheckProcs();

  if (actionList.blm.indexOf(actionGroups.actionname) > -1) {

    removeText("loadmessage");

    if (["Fire II", "Thunder IV", "Freeze", "Flare", "Foul"].indexOf(actionGroups.actionname) > -1) {
      toggle.aoe = Date.now()
    }
    else if (["Blizzard", "Blizzard III", "Blizzard IV", "Fire", "Fire IV", "Thunder III"].indexOf(actionGroups.actionname) > -1) {
      delete toggle.aoe;
    }

    if (actionGroups.actionname == "Thunder III") {
      addStatus("thunder", actionGroups.targetID, 24000);
    }

  }
}

function blmStatus(logLine) {

  if (statusGroups.targetID == player.ID) {

    if (statusGroups.statusname == "Thundercloud") {
      if (statusGroups.gainsloses == "gains") {
        addStatus("thundercloud", statusGroups.targetID, parseInt(logLine[6]) * 1000);
        blmCheckProcs()
        addText("debug1", "Thundercloud");
      }
      else if (statusGroups.gainsloses == "loses") {
        removeStatus("thundercloud", statusGroups.targetID);
        removeIcon(nextid.thundercloud);
      }
    }

    else if (statusGroups.statusname == "Firestarter") {
      if (statusGroups.gainsloses== "gains") {
        addStatus("firestarter", statusGroups.targetID, parseInt(logLine[6]) * 1000);
        blmCheckProcs()
        addText("debug1", "Firestarter");
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
       blmCheckProcs()
       addText("debug1", "Thunder III");
     }
     else if (statusGroups.gainsloses == "loses") {
       removeStatus("thunder", statusGroups.targetID);
     }
   }

     else if (statusGroups.statusname == "Thunder IV") {
      if (statusGroups.gainsloses== "gains") {
        addStatus("thunder", statusGroups.targetID, parseInt(logLine[6]) * 1000);
        blmCheckProcs()
        addText("debug1", "Thunder IV");
      }
      else if (statusGroups.gainsloses == "loses") {
        removeStatus("thunder", statusGroups.targetID);
      }
    }

  }

}

function blmCheckProcs() {

  addText("debug1", "Checking procs... MP:  " + player.currentMP);

  if (checkStatus("firestarter", player.ID) > 0
  && player.currentMP <= 3200
  && player.jobDetail.umbralStacks > 0) {  // Ideally, end of Astral phase?
    addIcon(nextid.firestarter, icon.fire3);
    addText("debug2", "Use F3P");
  }
  else {
    removeIcon(nextid.firestarter);
    addText("debug2", "Firestarter: " + checkStatus("firestarter", player.ID));
  }

  if (checkStatus("thundercloud", player.ID) > 0
  && (checkStatus("thundercloud", player.ID) < 5000 || checkStatus("thunder", target.ID) < 5000)) {
    addIcon(nextid.thundercloud, icon.thunder3);
    addText("debug3", "Use T3P");
  }
  else if (checkStatus("thundercloud", player.ID) > 0
  && toggle.aoe) {
    addIcon(nextid.thundercloud, icon.thunder3);
    addText("debug3", "Use T3P");
  }
  else {
    removeIcon(nextid.thundercloud);
    addText("debug3", "Thundercloud: " + checkStatus("thundercloud", player.ID));
  }

}

function blmCountFire4() {



    addIcon(nextid.fire4count_1, icon.gold[count.fire4 - 3])
    addIcon(nextid.fire4count_1, icon.gold[Math.min(3, count.fire4 - 3)])

}

function blmRotation() {
  if (player.jobDetail.umbralStacks > 0) { // In Astral Phase

  }
}

function blmUmbralRotation() {

}
