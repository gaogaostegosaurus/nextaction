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

function blmJobChange() {

  id.thundercloud = 10;
  id.firestarter = 11;

  // id.blizzard3 = 0;
  // id.blizzard4 = 1;
  // id.thunder3 = 2;
  //
  // id.fire3 = 0;
  // id.fire4_1 = 1;
  // id.fire4_2 = 2;
  // id.fire4_3 = 3;
  // id.fire4_4 = 4;
  // id.fire = 5;
  // id.fire4_4 = 5;
  // id.fire4_5 = 6;
  // id.fire4_6 = 7;
  // id.fire3p = 8;
  // id.despair = 9;
  //
  // id.fire3p = 10;
  // id.thunder3p = 10;
  // id.xenoglossia = 10;

}

function blmStartsUsing(logLine) {
  blmCheckProcs();
}

function blmCancelled(logLine) {
  blmCheckProcs();
}

// Checks and activates things when entering combat

function blmAction(logLine) {
  blmCheckProcs();
  if (actionList.blm.indexOf(logLine[3]) > -1) {

    removeText("loadmessage");

    if (["Fire II", "Thunder IV", "Freeze", "Flare", "Foul"].indexOf(actionGroups.actionname) > -1) {
      toggle.aoe = Date.now()
    }
    else if (["Blizzard", "Blizzard III", "Blizzard IV", "Fire", "Fire IV", "Thunder III"].indexOf(actionGroups.actionname) > -1) {
      delete toggle.aoe;
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
        removeIcon(id.thundercloud);
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
        removeIcon(id.firestarter);
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
    addIcon(id.firestarter, icon.fire3);
    addText("debug2", "Use F3P");
  }
  else {
    removeIcon(id.firestarter);
    addText("debug2", "Firestarter: " + checkStatus("firestarter", player.ID));
  }

  if (checkStatus("thundercloud", player.ID) > 0
  && (checkStatus("thundercloud", player.ID) < 5000 || checkStatus("thunder", target.ID) < 5000)) {
    addIcon(id.thundercloud, icon.thunder3);
    addText("debug3", "Use T3P");
  }
  else if (checkStatus("thundercloud", player.ID) > 0
  && toggle.aoe) {
    addIcon(id.thundercloud, icon.thunder3);
    addText("debug3", "Use T3P");
  }
  else {
    removeIcon(id.thundercloud);
    addText("debug3", "Thundercloud: " + checkStatus("thundercloud", player.ID));
  }

}

function blmAstralRotation() {

}

function blmUmbralRotation() {

}
