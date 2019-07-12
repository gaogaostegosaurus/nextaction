"use strict";

actionList.brd = ["Heavy Shot", "Straight Shot", "Venomous Bite", "Quick Nock", "Windbite", "Iron Jaws", "Caustic Bite", "Stormbite", "Refulgent Arrow",
  "Raging Strikes", "Barrage", "Mage\'s Ballad", "Army\'s Paeon", "Battle Voice", "The Wanderer\'s Minuet", "Empyreal Arrow", "Sidewinder"];

// statusList.brd = ["Straight Shot", "Straighter Shot", "Raging Strikes", "Foe Requiem",
//   "Venomous Bite", "Windbite", "Caustic Bite", "Stormbite"];

var heavyshotchecktimeout = {};
var empyrealarrowCount = 0;

// Buffer time in ms to do the darn right thing
var brdBuffer = 5000;

// These status arrays need to be pre-declared for Ironjaws
statustime.venomousbite = [];
statustime.windbite = [];

id.ironjaws = "next0";
id.straightshot = "next1";
id.windbite = "next2";
id.venomousbite = "next3";
id.openingstraightshot = "next4";
id.straightershot = "next5";
id.refulgentarrow = id.straightershot;
id.heavyshot = "next6";

id.ballad = "next10";
id.paeon = id.ballad;
id.minuet = id.ballad;
id.pitchperfect = "next11";
id.empyrealarrow = "next12";
id.sidewinder = "next13";
id.ragingstrikes = "next14";
id.barrage = "next15";

icon.ragingstrikes = "000352";
icon.barrage = "000353";
icon.heavyshot = "000358";
icon.straightshot = "000359";
icon.venomousbite = "000363";
icon.windbite = "000367";
icon.ballad = "002602";
icon.paeon = "002603";
icon.requiem = "002604";
icon.empyrealarrow = "002606";
icon.minuet = "002607";
icon.ironjaws = "002608";
icon.sidewinder = "002610";
icon.pitchperfect = "002611";
icon.causticbite = "002613";
icon.stormbite = "002614";
icon.refulgentarrow = "002616";

recast.ballad = 80000;
recast.ragingstrikes = 80000;
recast.barrage = 80000;
recast.paeon = 80000;
recast.battlevoice = 120000;
recast.minuet = 80000;
recast.empyrealarrow = 15000;
recast.sidewinder = 60000;

function brdPlayerChangedEvent(e) {

  if (player.level >= 64) {
    icon.venomousbite = icon.causticbite;
    icon.windbite = icon.stormbite;
  }
  else {
    icon.venomousbite = "000363";
    icon.windbite = "000367";
  }

  // Pitch Perfect
  if (player.jobDetail.songName == "Minuet"
  && player.jobDetail.songProcs == 3) {
    addIcon(id.pitchperfect,icon.pitchperfect);
  }
  else if (player.jobDetail.songName == "Minuet"
  && player.jobDetail.songProcs > 0
  && player.jobDetail.songMilliseconds < brdBuffer) {
    addIcon(id.pitchperfect,icon.pitchperfect);
  }
  else {
    removeIcon(id.pitchperfect);
  }

  // Don't use EA without song after 68
  if (player.level >= 68 && player.jobDetail.songMilliseconds == 0) {
    removeIcon(id.empyrealarrow);
  }
}

function brdInCombatChangedEvent(e) { // Fires when player enters combat

  // Populate icons

  if (player.level >= 54
  && statustime.venomousbite[statustime.venomousbite.indexOf(target.name) + 1] - Date.now() - brdBuffer * 2 < 0
  && statustime.windbite[statustime.windbite.indexOf(target.name) + 1] - Date.now() < 0 - brdBuffer * 2 ) {
    brdAddIcon(id.ironjaws,icon.ironjaws);
  }

  if (player.level >= 18
  && statustime.windbite.indexOf(target.id) > -1) {
    brdAddIcon(id.windbite,icon.windbite);
  }

  if (player.level >= 6
  && statustime.windbite.indexOf(target.id) > -1) {
    brdAddIcon(id.venomousbite,icon.venomousbite);
  }

  if (player.level >= 2
  && (!statustime.straightshot || statustime.straightshot - Date.now() - brdBuffer < 0)) {
    brdAddIcon(id.openingstraightshot,icon.straightshot);
  }

  if (statustime.straightershot) { // This feels like it needs to be fixed/cleaned up
    if (player.level >= 70) {
      brdAddIcon(id.straightershot,icon.refulgentarrow);
    }
  }

  if (player.jobDetail.songName == "") { // Activate if no song

    removeIcon(id.pitchperfect);

    if (player.level >= 52
    && (!cooldowntime.ragingstrikes || cooldowntime.ragingstrikes - Date.now() < 0)
    && (!cooldowntime.barrage || cooldowntime.barrage - Date.now() < 0)
    && (!cooldowntime.minuet || cooldowntime.minuet - Date.now() < 0)) {
      addIcon(id.ballad,icon.minuet);
    }
    else if (player.level >= 30
    && (!cooldowntime.ballad || cooldowntime.ballad - Date.now() < 0)) {
      addIcon(id.ballad,icon.ballad);
    }
    else if (player.level >= 40
    && (!cooldowntime.paeon || cooldowntime.paeon - Date.now() < 0)) {
      addIcon(id.ballad,icon.paeon);
    }
  }

  else if (player.jobDetail.songName == "Minuet") {
    if (player.jobDetail.songProcs == 3) {
      addIcon(id.pitchperfect,icon.pitchperfect);
    }
    else if (player.jobDetail.songProcs > 0
    && player.jobDetail.songMilliseconds < brdBuffer) {
      addIcon(id.pitchperfect,icon.pitchperfect);
    }
    else {
      removeIcon(id.pitchperfect);
    }
  }

  if (player.level >= 68
  && (!cooldowntime.empyrealarrow || cooldowntime.empyrealarrow - Date.now() < 0)
  && player.jobDetail.songName != "") {
    addIcon(id.empyrealarrow,icon.empyrealarrow);
  }
  else if (player.level >= 54
  && (!cooldowntime.empyrealarrow || cooldowntime.empyrealarrow - Date.now() < 0)) {
    addIcon(id.empyrealarrow,icon.empyrealarrow);
  }

  if (player.level >= 60
  && (!cooldowntime.sidewinder || cooldowntime.sidewinder - Date.now() < 0)) {
    addIcon(id.sidewinder,icon.sidewinder);
  }

  if (player.level >= 4 &&
  (!cooldowntime.ragingstrikes || cooldowntime.ragingstrikes - Date.now() < 0)) {
    addIcon(id.ragingstrikes,icon.ragingstrikes);
  }

  if (player.level >= 4 &&
  (!cooldowntime.ragingstrikes || cooldowntime.ragingstrikes - Date.now() < 0)) {
    addIcon(id.ragingstrikes,icon.ragingstrikes);
  }
}

function brdAction(logLine) {

  // statustime added to actions because just going by buff gain/loss lines is super slow

  if (logLine[2] == player.name) {

    if (logLine[3] == "Straight Shot") {
      statustime.straightshot = Date.now() + 30000;
      brdRemoveIcon(id.straightshot);
      brdRemoveIcon(id.openingstraightshot);
      brdRemoveIcon(id.straightershot);
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
      brdRemoveIcon(id.ironjaws);
    }

    else if (logLine[3] == "Windbite") {
      addStatus("windbite", logLine[5], 18000);
      brdRemoveIcon(id.windbite);
    }

    else if (logLine[3] == "Stormbite") {
      addStatus("windbite", logLine[5], 30000);
      brdRemoveIcon(id.windbite);
    }

    else if (logLine[3] == "Venomous Bite") {
      addStatus("venomousbite", logLine[5], 18000);
      brdRemoveIcon(id.venomousbite);
    }

    else if (logLine[3] == "Caustic Bite") {
      addStatus("venomousbite", logLine[5], 30000);
      brdRemoveIcon(id.venomousbite);
    }

    else if (logLine[3] == "Refulgent Arrow") {
      brdRemoveIcon(id.straightershot);
      if (Math.min(statustime.venomousbite[statustime.venomousbite.indexOf(target.name) + 1], statustime.windbite[statustime.windbite.indexOf(target.name) + 1]) - Date.now() - brdBuffer - brdBuffer < 0) {
        brdAddIcon(id.straightshot,icon.straightshot);
      }
    }

    if (logLine[3] == "Raging Strikes") {
      cooldowntime.ragingstrikes = Date.now() + recast.ragingstrikes;
      removeIcon(id.ragingstrikes);
      addIconWithTimeout("ragingstrikes",recast.ragingstrikes,id.ragingstrikes,icon.ragingstrikes);
    }

    else if (logLine[3] == "Barrage") {
      cooldowntime.barrage = Date.now() + recast.barrage;
      removeIcon(id.barrage);
      addIconWithTimeout("barrage",recast.barrage,id.barrage,icon.barrage);
    }

    else if (logLine[3] == "Battle Voice") {
      cooldowntime.battlevoice = Date.now() + recast.battlevoice;
    }

    else if (logLine[3] == "Sidewinder") {
      cooldowntime.sidewinder = Date.now() + 60 * 1000;
      removeIcon(id.sidewinder);
      addIconWithTimeout("sidewinder",recast.sidewinder,id.sidewinder,icon.sidewinder);
    }

    else if (logLine[3] == "Mage's Ballad") {
      cooldowntime.ballad = Date.now() + recast.ballad;
      statustime.song = Date.now() + 30000;
      removeIcon(id.ballad);
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

      removeIcon(id.ballad);
      songRotation();
    }

    else if (logLine[3] == "The Wanderer's Minuet") {
      cooldowntime.minuet = Date.now() + recast.minuet;
      statustime.song = Date.now() + 30000;
      removeIcon(id.ballad);
      songRotation();
    }

    else if (logLine[3] == "Empyreal Arrow") {

      removeIcon(id.empyrealarrow);

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
            addIconWithTimeout("empyrealarrow",recast.empyrealarrow,id.empyrealarrow,icon.empyrealarrow);
          }
          else if (player.jobDetail.songName = "Ballad") {
            addIconWithTimeout("empyrealarrow",recast.empyrealarrow,id.empyrealarrow,icon.empyrealarrow);
          }
          else if (player.jobDetail.songName = "Minuet"
          && empyrealarrowCount < 2) {
            addIconWithTimeout("empyrealarrow",recast.empyrealarrow,id.empyrealarrow,icon.empyrealarrow);
          }
        }
      }

      else {
        addIconWithTimeout("empyrealarrow",recast.empyrealarrow,id.empyrealarrow,icon.empyrealarrow);
      }
    }

    previous.action = logLine[3];
  }
}

function brdStatus(logLine) {

  addText("debug1", logLine[1] + " " + logLine[2] + " " + logLine[3]);

  // To anyone from anyone (non-stacking)

  if (logLine[3] == "Foe Requiem") {
    if (logLine[2] == "gains") {
      statustime.foerequiem.push(logLine[1], Date.now() + parseInt(logLine[5]) * 1000);
    }
    else if (logLine[2] == "loses") {
      statustime.foerequiem.splice(indexOf(logLine[1]),2);
    }
  }

  // To player from anyone

  else if (logLine[1] == player.name) {

    if (logLine[3] == "Straight Shot") {
      if (logLine[2] == "gains") {
        statustime.straightshot = Date.now() + parseInt(logLine[5]) * 1000;
        brdRemoveIcon(id.straightshot);
        brdAddIconWithTimeout("straightshot",parseInt(logLine[5]) * 1000 - brdBuffer,id.straightshot,icon.straightshot);
      }
      else if (logLine[2] == "loses") {
        delete statustime.straightshot;
        brdAddIcon(id.straightshot,icon.straightshot);
      }
    }

    else if (logLine[3] == "Straighter Shot") {
      if (logLine[2] == "gains") {
        statustime.straightershot = Date.now() + parseInt(logLine[5]) * 1000;
        if (player.level >= 70
        && Math.min(statustime.venomousbite[statustime.venomousbite.indexOf(target.name) + 1], statustime.windbite[statustime.windbite.indexOf(target.name) + 1]) - brdBuffer * 2 - Date.now() > 0) {
          brdAddIcon(id.straightershot,icon.refulgentarrow);
        }
        else {
          brdAddIcon(id.straightshot,icon.straightshot);
        }
      }
      else if (logLine[2] == "loses") {
        delete statustime.straightershot;
        brdRemoveIcon(id.straightershot);
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

  brdAddIconWithTimeout("ironjaws",Math.min(statustime.venomousbite[statustime.venomousbite.indexOf(target.name) + 1], statustime.windbite[statustime.windbite.indexOf(target.name) + 1]) - Date.now() - brdBuffer,id.ironjaws,icon.ironjaws); // Determine next Iron Jaws depending on how many seconds left of shortest dot

  if (Math.min(statustime.venomousbite[statustime.venomousbite.indexOf(target.name) + 1], statustime.windbite[statustime.windbite.indexOf(target.name) + 1]) - statustime.straightshot < brdBuffer
  && Math.min(statustime.venomousbite[statustime.venomousbite.indexOf(target.name) + 1], statustime.windbite[statustime.windbite.indexOf(target.name) + 1]) - statustime.straightshot >= 0) {
    brdAddIconWithTimeout("straightshot",Math.min(statustime.venomousbite[statustime.venomousbite.indexOf(target.name) + 1], statustime.windbite[statustime.windbite.indexOf(target.name) + 1]) - brdBuffer - Date.now() - brdBuffer,id.straightshot,icon.straightshot); // Adjust Straight Shot countdown depending on if Straight Shot will expire at an awkward time
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
    addIconWithTimeout("empyrealarrow",cooldowntime.empyrealarrow - Date.now(),id.empyrealarrow,icon.empyrealarrow);
  }

  // Shows next song
  if (player.level >= 52) {
    if (Math.max(cooldowntime.minuet,cooldowntime.barrage,cooldowntime.ragingstrikes) <= Math.min(cooldowntime.ballad, cooldowntime.paeon)) {
      addIconWithTimeout("song",Math.max(statustime.song,cooldowntime.ragingstrikes,cooldowntime.barrage,cooldowntime.minuet) - Date.now(),id.ballad,icon.minuet);
      addText("debug1",Math.max(statustime.song,cooldowntime.ragingstrikes,cooldowntime.barrage,cooldowntime.minuet) - Date.now())
    }
    else if (cooldowntime.ballad <= cooldowntime.paeon) {
      addIconWithTimeout("song",Math.max(statustime.song,cooldowntime.ballad) - Date.now(),id.ballad,icon.ballad);
      addText("debug1",Math.max(statustime.song,cooldowntime.ballad) - Date.now());
    }
    else {
      addIconWithTimeout("song",Math.max(statustime.song,cooldowntime.paeon) - Date.now(),id.ballad,icon.paeon);
      addText("debug1",Math.max(statustime.song,cooldowntime.paeon) - Date.now());
    }
  }

  else if (player.level >= 40) {
    if (cooldowntime.ballad < cooldowntime.paeon) {
      addIconWithTimeout("song",Math.max(statustime.song, cooldowntime.ballad) - Date.now(),id.ballad,icon.ballad);
    }
    else {
      addIconWithTimeout("song",Math.max(statustime.song, cooldowntime.paeon) - Date.now(),id.ballad,icon.paeon);
    }
  }

  else if (player.level >= 30) {
    addIconWithTimeout("song",Math.max(statustime.song, cooldowntime.ballad) - Date.now(),id.ballad,icon.ballad);
  }
}

// BRD needs special version of this due to priority system for GCD actions

function brdAddIcon(actionid,actionicon) {
  if (toggle.combat) {
    document.getElementById(actionid).src = "icons/" + actionicon + ".png";
    removeIcon(id.heavyshot);
  }
}

function brdAddIconWithTimeout(action,delay,actionid,actionicon) {
  clearTimeout(timeout[action]);
  timeout[action] = setTimeout(brdAddIcon, delay, actionid, actionicon);
}

function brdRemoveIcon(actionid) {
  document.getElementById(actionid).src = "";

  if (!document.getElementById(id.ironjaws).src.endsWith("png")
  && !document.getElementById(id.straightshot).src.endsWith("png")
  && !document.getElementById(id.windbite).src.endsWith("png")
  && !document.getElementById(id.venomousbite).src.endsWith("png")
  && !document.getElementById(id.openingstraightshot).src.endsWith("png")
  && !document.getElementById(id.straightershot).src.endsWith("png") ) {
    addIcon(id.heavyshot,icon.heavyshot);
  }
}
