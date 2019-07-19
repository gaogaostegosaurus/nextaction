"use strict";

actionList.brd = [
  "Heavy Shot", "Straight Shot", "Venomous Bite", "Windbite", "Iron Jaws", "Caustic Bite", "Stormbite", "Refulgent Arrow",
  "Quick Nock",
  "Raging Strikes", "Barrage", "Battle Voice", "The Wanderer\'s Minuet", "Empyreal Arrow", "Sidewinder",
  "Mage\'s Ballad", "Army\'s Paeon",
];

// statusList.brd = ["Straight Shot", "Straighter Shot", "Raging Strikes", "Foe Requiem",
//   "Venomous Bite", "Windbite", "Caustic Bite", "Stormbite"];

var heavyshotchecktimeout = {};
var empyrealarrowCount = 0;

// Buffer time in ms to do the darn right thing
var brdBuffer = 5000;

// These status arrays need to be pre-declared for Ironjaws
statustime.venomousbite = [];
statustime.windbite = [];

function brdJobChange() {

  nextid.ironjaws = 0;
  nextid.windbite = 1;
  nextid.venomousbite = 2;
  nextid.straightshot = 3;
  nextid.refulgentarrow = nextid.straightshot;
  nextid.heavyshot = 4;
  nextid.burstshot = nextid.heavyshot;
  nextid.quicknock = nextid.heavyshot;
  nextid.ballad = 10;
  nextid.paeon = nextid.ballad;
  nextid.minuet = nextid.ballad;
  nextid.ragingstrikes = 11;
  nextid.barrage = 12;
  nextid.pitchperfect = 13;
  nextid.empyrealarrow = 14;
  nextid.sidewinder = 15;
  nextid.shadowbite = nextid.sidewinder;

  if (player.level >= 64) {
    icon.venomousbite = icon.causticbite;
    icon.windbite = icon.stormbite;
  }
  else {
    icon.venomousbite = "000363";
    icon.windbite = "000367";
  }

  if (player.level >= 70) {
    icon.straightshot = icon.refulgentarrow;
  }
  else {
    icon.straightshot = "000359";
  }

  if (player.level >= 76) {
    icon.heavyshot = icon.burstshot;
  }
  else {
    icon.heavyshot = "000358";
  }

  previous.quicknock = 0;
  previous.rainofdeath = 0;
  previous.shadowbite = 0;
  previous.apexarrow = 0;
}


function brdPlayerChangedEvent() {

  // Pitch Perfect
  if (player.jobDetail.songName == "Minuet"
  && player.jobDetail.songProcs == 3) {
    addIcon(nextid.pitchperfect,icon.pitchperfect);
  }
  else if (player.jobDetail.songName == "Minuet"
  && player.jobDetail.songProcs > 0
  && player.jobDetail.songMilliseconds < brdBuffer) {
    addIcon(nextid.pitchperfect,icon.pitchperfect);
  }
  else {
    removeIcon(nextid.pitchperfect);
  }

  // Don't use EA without song after 68
  if (player.level >= 68 && player.jobDetail.songMilliseconds == 0) {
    removeIcon(nextid.empyrealarrow);
  }
}

function brdCheckDoTs() {
  if (player.level >= 54
  && (checkStatus("venomousbite", target.ID) >= 5000 || checkStatus("windbite", target.ID) >= 5000)) {
    addIconBlinkTimeout("ironjaws", Math.min(checkStatus("venomousbite", target.ID), checkStatus("windbite", target.ID)) - 5000, nextid.ironjaws, icon.ironjaws);
  }
  else {
    if (player.level >= 18) {
      addIconBlinkTimeout("windbite", checkStatus("windbite", target.ID) - 2500, nextid.windbite, icon.windbite);
    }
    if (player.level >= 6) {
      addIconBlinkTimeout("venomousbite", checkStatus("venomousbite", target.ID) - 2500, nextid.venomousbite, icon.venomousbite);
    }
  }
}

function brdTargetChangedEvent(){
  brdCheckDoTs();
}

function brdInCombatChangedEvent() { // Fires when player enters combat

  brdCheckDoTs();

  if (player.jobDetail.songName == "") { // Activate if no song

    removeIcon(nextid.pitchperfect);

    if (player.level >= 52
    && (!cooldowntime.ragingstrikes || cooldowntime.ragingstrikes - Date.now() < 0)
    && (!cooldowntime.barrage || cooldowntime.barrage - Date.now() < 0)
    && (!cooldowntime.minuet || cooldowntime.minuet - Date.now() < 0)) {
      addIcon(nextid.ballad,icon.minuet);
    }
    else if (player.level >= 30
    && (!cooldowntime.ballad || cooldowntime.ballad - Date.now() < 0)) {
      addIcon(nextid.ballad,icon.ballad);
    }
    else if (player.level >= 40
    && (!cooldowntime.paeon || cooldowntime.paeon - Date.now() < 0)) {
      addIcon(nextid.ballad,icon.paeon);
    }
  }

  else if (player.jobDetail.songName == "Minuet") {
    if (player.jobDetail.songProcs == 3) {
      addIcon(nextid.pitchperfect,icon.pitchperfect);
    }
    else if (player.jobDetail.songProcs > 0
    && player.jobDetail.songMilliseconds < brdBuffer) {
      addIcon(nextid.pitchperfect,icon.pitchperfect);
    }
    else {
      removeIcon(nextid.pitchperfect);
    }
  }

  if (player.level >= 68
  && checkCooldown("empyrealarrow", player.ID) < 0
  && player.jobDetail.songName != "") {
    addIconBlink(nextid.empyrealarrow,icon.empyrealarrow);
  }
  else if (player.level < 68
  && checkCooldown("empyrealarrow", player.ID) < 0) {
    addIconBlink(nextid.empyrealarrow,icon.empyrealarrow);
  }
  else {
    removeIcon(nextid.empyrealarrow);
  }

  if (player.level >= 60
  && checkCooldown("sidewinder", player.ID) < 0
  && checkStatus("venomousbite", target.ID) > 2500
  && checkStatus("windbite", target.ID) > 2500) {
    addIconBlink(nextid.sidewinder,icon.sidewinder);
  }
  else {
    removeIcon(nextid.sidewinder);
  }

  if (player.level >= 4 &&
  && checkCooldown("ragingstrikes", player.ID) < 0) {
    addIconBlink(nextid.ragingstrikes,icon.ragingstrikes);
  }
  else {
    removeIcon(nextid.ragingstrikes);
  }
}

function brdAction(logLine) {

  // statustime added to actions because just going by buff gain/loss lines is super slow

  if (logLine[2] == player.name) {

    if (logLine[3] == "Straight Shot") {
      statustime.straightshot = Date.now() + 30000;
      brdRemoveIcon(nextid.straightshot);
      brdRemoveIcon(nextid.openingstraightshot);
      brdRemoveIcon(nextid.straightershot);
    }

    else if (logLine[3] == "Iron Jaws") {

      if (player.level >= 64
      && statustime.venomousbite.indexOf(logLine[5]) > -1) {
        addStatus("venomousbite", logLine[5], 30000);
      }
      else if (statustime.venomousbite.indexOf(logLine[5]) > -1) {
        addStatus("venomousbite", logLine[5], 18000);
      }

      if (player.level >= 64
      && statustime.windbite.indexOf(logLine[5]) > -1) {
        addStatus("windbite", logLine[5], 30000);
      }
      else if (statustime.windbite.indexOf(logLine[5]) > -1) {
        addStatus("windbite", logLine[5], 18000);
      }
      brdRemoveIcon(nextid.ironjaws);
    }

    else if (["Windbite", "Stormbite"].indexOf(actionGroups.actionname) > -1) {
      addStatus("windbite", actionGroups.targetID, 30000);
      removeIcon(nextid.windbite);
    }

    else if (["Venomous Bite", "Caustic Bite"].indexOf(actionGroups.actionname) > -1) {
      addStatus("venomousbite", actionGroups.targetID, 30000);
      removeIcon(nextid.windbite);
    }

    else if (logLine[3] == "Refulgent Arrow") {
      brdRemoveIcon(nextid.straightershot);
      if (Math.min(statustime.venomousbite[statustime.venomousbite.indexOf(target.name) + 1], statustime.windbite[statustime.windbite.indexOf(target.name) + 1]) - Date.now() - brdBuffer - brdBuffer < 0) {
        brdAddIcon(nextid.straightshot,icon.straightshot);
      }
    }

    if (logLine[3] == "Raging Strikes") {
      cooldowntime.ragingstrikes = Date.now() + recast.ragingstrikes;
      removeIcon(nextid.ragingstrikes);
      addIconTimeout("ragingstrikes",recast.ragingstrikes,nextid.ragingstrikes,icon.ragingstrikes);
    }

    else if (logLine[3] == "Barrage") {
      cooldowntime.barrage = Date.now() + recast.barrage;
      removeIcon(nextid.barrage);
      addIconTimeout("barrage",recast.barrage,nextid.barrage,icon.barrage);
    }

    else if (logLine[3] == "Battle Voice") {
      cooldowntime.battlevoice = Date.now() + recast.battlevoice;
    }

    else if (logLine[3] == "Sidewinder") {
      cooldowntime.sidewinder = Date.now() + 60 * 1000;
      removeIcon(nextid.sidewinder);
      addIconTimeout("sidewinder",recast.sidewinder,nextid.sidewinder,icon.sidewinder);
    }

    else if (logLine[3] == "Mage's Ballad") {
      cooldowntime.ballad = Date.now() + recast.ballad;
      statustime.song = Date.now() + 30000;
      removeIcon(nextid.ballad);
      songRotation();
    }

    else if (logLine[3] == "Army's Paeon") {
      cooldowntime.paeon = Date.now() + recast.paeon;
      // Minimize Paeon time
      if (player.level >= 52) {
        statustime.song = Math.min(Date.now() + 30000,Math.max(cooldowntime.minuet, cooldowntime.ballad - 30000));
      }
      else {
        statustime.song = Date.now() + 30000;
      }

      removeIcon(nextid.ballad);
      songRotation();
    }

    else if (logLine[3] == "The Wanderer's Minuet") {
      cooldowntime.minuet = Date.now() + recast.minuet;
      statustime.song = Date.now() + 30000;
      removeIcon(nextid.ballad);
      songRotation();
    }

    else if (logLine[3] == "Empyreal Arrow") {

      removeIcon(nextid.empyrealarrow);

      if (previous.empyrealarrow
      && recast.empyrealarrow > Date.now() - previous.empyrealarrow
      && Date.now() - previous.empyrealarrow >= 1500) { // Recast limits to prevent Barrage shenanigans
        recast.empyrealarrow = Date.now() - previous.empyrealarrow;
      }

      // addText("debug1","EA recast: " + recast.empyrealarrow);

      previous.empyrealarrow = Date.now();
      cooldowntime.empyrealarrow = Date.now() + recast.empyrealarrow;
      empyrealarrowCount = empyrealarrowCount + 1;

      if (player.level >= 68) {
        if (recast.empyrealarrow < player.jobDetail.songMilliseconds) { // Check if EA should be reused within song duration
          if (player.jobDetail.songName = "Paeon"
          && empyrealarrowCount < 1) {
            addIconTimeout("empyrealarrow",recast.empyrealarrow,nextid.empyrealarrow,icon.empyrealarrow);
          }
          else if (player.jobDetail.songName = "Ballad") {
            addIconTimeout("empyrealarrow",recast.empyrealarrow,nextid.empyrealarrow,icon.empyrealarrow);
          }
          else if (player.jobDetail.songName = "Minuet"
          && empyrealarrowCount < 2) {
            addIconTimeout("empyrealarrow",recast.empyrealarrow,nextid.empyrealarrow,icon.empyrealarrow);
          }
        }
      }

      else {
        addIconTimeout("empyrealarrow",recast.empyrealarrow,nextid.empyrealarrow,icon.empyrealarrow);
      }
    }

    previous.action = logLine[3];
  }
}

function brdStatus(logLine) {

  if (logLine[1] == player.name) {

    if (logLine[3] == "Straighter Shot") {
      if (logLine[2] == "gains") {
        statustime.straightershot = Date.now() + parseInt(logLine[5]) * 1000;
        if (player.level >= 70
        && Math.min(statustime.venomousbite[statustime.venomousbite.indexOf(target.name) + 1], statustime.windbite[statustime.windbite.indexOf(target.name) + 1]) - brdBuffer * 2 - Date.now() > 0) {
          brdAddIcon(nextid.straightershot,icon.refulgentarrow);
        }
        else {
          brdAddIcon(nextid.straightshot,icon.straightshot);
        }
      }
      else if (logLine[2] == "loses") {
        delete statustime.straightershot;
        brdRemoveIcon(nextid.straightershot);
      }
    }

    else if (logLine[3] == "Raging Strikes") {
      if (logLine[2] == "gains") {
        statustime.ragingstrikes = Date.now() + parseInt(logLine[5]) * 1000;
      }
      else if (logLine[2] == "loses") {
        delete statustime.ragingstrikes;
      }
    }
  }

  // To NOT player from player

  else if (logLine[1] != player.name
  && logLine[4] == player.name) {

    if (logLine[3] == "Venomous Bite"
    || logLine[3] == "Caustic Bite") {
      if (logLine[2] == "gains") {
        addStatus("venomousbite", logLine[1], parseInt(logLine[5]) * 1000);
        if (player.level >= 54
        && statustime.windbite.indexOf(logLine[1]) > -1) { // Check if other dot is on target
          ironjawsTimeout();
        }
      }
      else if (logLine[2] == "loses") {
        statustime.venomousbite.splice(statustime.venomousbite.indexOf(logLine[1]),2);
      }
    }

    else if (logLine[3] == "Windbite"
    || logLine[3] == "Stormbite") {
      if (logLine[2] == "gains") {
        addStatus("windbite", logLine[1], parseInt(logLine[5]) * 1000);
        if (player.level >= 54
        && statustime.venomousbite.indexOf(logLine[1]) > -1) { // Check if other dot is on target
          ironjawsTimeout();
        }
      }
      else if (logLine[2] == "loses") {
        statustime.windbite.splice(statustime.windbite.indexOf(logLine[1]),2);
      }
    }
  }
}

function ironjawsTimeout() {

  brdaddIconTimeout("ironjaws",Math.min(statustime.venomousbite[statustime.venomousbite.indexOf(target.name) + 1], statustime.windbite[statustime.windbite.indexOf(target.name) + 1]) - Date.now() - brdBuffer,nextid.ironjaws,icon.ironjaws); // Determine next Iron Jaws depending on how many seconds left of shortest dot

  if (Math.min(statustime.venomousbite[statustime.venomousbite.indexOf(target.name) + 1], statustime.windbite[statustime.windbite.indexOf(target.name) + 1]) - statustime.straightshot < brdBuffer
  && Math.min(statustime.venomousbite[statustime.venomousbite.indexOf(target.name) + 1], statustime.windbite[statustime.windbite.indexOf(target.name) + 1]) - statustime.straightshot >= 0) {
    brdaddIconTimeout("straightshot",Math.min(statustime.venomousbite[statustime.venomousbite.indexOf(target.name) + 1], statustime.windbite[statustime.windbite.indexOf(target.name) + 1]) - brdBuffer - Date.now() - brdBuffer,nextid.straightshot,icon.straightshot); // Adjust Straight Shot countdown depending on if Straight Shot will expire at an awkward time
  }
}

function heavyshotCheckWithTimeout(action,delay) {
  clearTimeout(timeout.heavyshotCheck[action]);
  timeout.heavyshotCheck[action] = setTimeout(heavyshotCheck,delay);
}

function songRotation() {

  if (!cooldowntime.minuet) {
    cooldowntime.minuet = 0;
  }
  if (!cooldowntime.ballad) {
    cooldowntime.ballad = 0;
  }
  if (!cooldowntime.paeon) {
    cooldowntime.paeon = 0;
  }
  if (!cooldowntime.ragingstrikes) {
    cooldowntime.ragingstrikes = 0;
  }
  if (!cooldowntime.barrage) {
    cooldowntime.barrage = 0;
  }

  // Reset EA count and start countdown if needed
  if (player.level >= 68) {
    empyrealarrowCount = 0;
    addIconTimeout("empyrealarrow",cooldowntime.empyrealarrow - Date.now(),nextid.empyrealarrow,icon.empyrealarrow);
  }

  // Shows next song
  if (player.level >= 52) {
    if (Math.max(cooldowntime.minuet,cooldowntime.barrage,cooldowntime.ragingstrikes) <= Math.min(cooldowntime.ballad, cooldowntime.paeon)) {
      addIconTimeout("song",Math.max(statustime.song,cooldowntime.ragingstrikes,cooldowntime.barrage,cooldowntime.minuet) - Date.now(),nextid.ballad,icon.minuet);
      addText("debug1",Math.max(statustime.song,cooldowntime.ragingstrikes,cooldowntime.barrage,cooldowntime.minuet) - Date.now())
    }
    else if (cooldowntime.ballad <= cooldowntime.paeon) {
      addIconTimeout("song",Math.max(statustime.song,cooldowntime.ballad) - Date.now(),nextid.ballad,icon.ballad);
      addText("debug1",Math.max(statustime.song,cooldowntime.ballad) - Date.now());
    }
    else {
      addIconTimeout("song",Math.max(statustime.song,cooldowntime.paeon) - Date.now(),nextid.ballad,icon.paeon);
      addText("debug1",Math.max(statustime.song,cooldowntime.paeon) - Date.now());
    }
  }

  else if (player.level >= 40) {
    if (cooldowntime.ballad < cooldowntime.paeon) {
      addIconTimeout("song",Math.max(statustime.song, cooldowntime.ballad) - Date.now(),nextid.ballad,icon.ballad);
    }
    else {
      addIconTimeout("song",Math.max(statustime.song, cooldowntime.paeon) - Date.now(),nextid.ballad,icon.paeon);
    }
  }

  else if (player.level >= 30) {
    addIconTimeout("song",Math.max(statustime.song, cooldowntime.ballad) - Date.now(),nextid.ballad,icon.ballad);
  }
}

// BRD needs special version of this due to priority system for GCD actions

function brdAddIcon(actionid,actionicon) {
  if (toggle.combat) {
    document.getElementById(actionid).src = "icons/" + actionicon + ".png";
    removeIcon(nextid.heavyshot);
  }
}

function brdaddIconTimeout(action,delay,actionid,actionicon) {
  clearTimeout(timeout[action]);
  timeout[action] = setTimeout(brdAddIcon, delay, actionid, actionicon);
}

function brdRemoveIcon(actionid) {
  document.getElementById(actionid).src = "";

  if (!document.getElementById(nextid.ironjaws).src.endsWith("png")
  && !document.getElementById(nextid.straightshot).src.endsWith("png")
  && !document.getElementById(nextid.windbite).src.endsWith("png")
  && !document.getElementById(nextid.venomousbite).src.endsWith("png")
  && !document.getElementById(nextid.openingstraightshot).src.endsWith("png")
  && !document.getElementById(nextid.straightershot).src.endsWith("png") ) {
    addIcon(nextid.heavyshot,icon.heavyshot);
  }
}
