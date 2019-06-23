"use strict";

actionList.brd = ["Heavy Shot", "Straight Shot", "Venomous Bite", "Quick Nock", "Windbite", "Iron Jaws", "Caustic Bite", "Stormbite", "Refulgent Arrow",
  "Raging Strikes", "Barrage", "Mage\'s Ballad", "Army\'s Paeon", "Battle Voice", "The Wanderer\'s Minuet", "Empyreal Arrow", "Sidewinder"];

statusList.brd = ["Straight Shot", "Straighter Shot", "Raging Strikes", "Foe Requiem",
  "Venomous Bite", "Windbite", "Caustic Bite", "Stormbite"];

var heavyshotchecktimeout = {};
var empyrealarrowCount = 0;
var brdBuffer = 5000; // buffer in ms to do the right thing

id.ironjaws = "nextAction1";
id.straightshot = "nextAction2";
id.windbite = "nextAction3";
id.venomousbite = "nextAction4";
id.openingstraightshot = "nextAction5";
id.straightershot = "nextAction6";
id.refulgentarrow = id.straightershot;
id.heavyshot = "nextAction7";

id.ballad = "nextAction11";
id.paeon = id.ballad;
id.minuet = id.ballad;
id.pitchperfect = "nextAction12";
id.empyrealarrow = "nextAction13";
id.sidewinder = "nextAction14";
id.ragingstrikes = "nextAction15";
id.barrage = "nextAction16";

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

function brdInCombatChangedEvent(e) { // Fires when player enters combat

  // Populate icons

  if (player.level >= 54
  && (Math.min(statustime.venomousbite,statustime.windbite) - Date.now() - brdBuffer > 0)) {
    brdAddIcon(id.ironjaws,icon.ironjaws);
  }

  if (player.level >= 18
  && !statustime.windbite) {
    if (player.level >= 64) {
      brdAddIcon(id.windbite,icon.stormbite);
    }
    else {
      brdAddIcon(id.windbite,icon.windbite);
    }
  }

  if (player.level >= 6
  && !statustime.venomousbite) {
    if (player.level >= 64) {
      brdAddIcon(id.venomousbite,icon.causticbite);
    }
    else {
      brdAddIcon(id.venomousbite,icon.venomousbite);
    }
  }

  if (player.level >= 2
  && (!statustime.straightshot || statustime.straightshot - Date.now() - brdBuffer < 0)) {
    brdAddIcon(id.openingstraightshot,icon.straightshot);
  }

  if (statustime.straightershot) {
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

function brdPlayerChangedEvent(e) {

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

      if (player.level >= 64 && statustime.venomousbite) {
        statustime.venomousbite = Date.now() + 30000;
      }
      else if (statustime.venomousbite) {
        statustime.venomousbite = Date.now() + 18000;
      }

      if (player.level >= 64 && statustime.windbite) {
        statustime.windbite = Date.now() + 30000;
      }
      else if (statustime.windbite) {
        statustime.windbite = Date.now() + 18000;
      }
      brdRemoveIcon(id.ironjaws);
    }

    else if (logLine[3] == "Windbite") {
      statustime.windbite = Date.now() + 18000;
      brdRemoveIcon(id.windbite);
    }

    else if (logLine[3] == "Stormbite") {
      statustime.windbite = Date.now() + 30000;
      brdRemoveIcon(id.windbite);
    }

    else if (logLine[3] == "Venomous Bite") {
      statustime.venomousbite = Date.now() + 18000;
      brdRemoveIcon(id.venomousbite);
    }

    else if (logLine[3] == "Caustic Bite") {
      statustime.venomousbite = Date.now() + 30000;
      brdRemoveIcon(id.venomousbite);
    }

    else if (logLine[3] == "Refulgent Arrow") {
      brdRemoveIcon(id.straightershot);
      if (Math.min(statustime.venomousbite,statustime.windbite) - Date.now() - brdBuffer - brdBuffer < 0) {
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

      // addText("debug","EA recast: " + recast.empyrealarrow);

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

  if (logLine[1] == player.name
  && logLine[4] == player.name) { // From self to self

    if (logLine[2] == "gains") {

      addText("debug","Gains " + logLine[3] + " for " + logLine[5] + " seconds");

      if (logLine[3] == "Straight Shot") {
        statustime.straightshot = Date.now() + parseInt(logLine[5]) * 1000;
        brdRemoveIcon(id.straightshot);
        brdAddIconWithTimeout("straightshot",parseInt(logLine[5]) * 1000 - brdBuffer,id.straightshot,icon.straightshot);
      }

      else if (logLine[3] == "Straighter Shot") {

        statustime.straightershot = Date.now() + parseInt(logLine[5]) * 1000;

        if (player.level >= 70
        && Math.min(statustime.venomousbite,statustime.windbite) - Date.now() - brdBuffer - brdBuffer > 0) {
          brdAddIcon(id.straightershot,icon.refulgentarrow);
        }
        else {
          brdAddIcon(id.straightshot,icon.straightshot);
        }
      }

      else if (logLine[3] == "Raging Strikes") {
        statustime.ragingstrikes = Date.now() + parseInt(logLine[5]) * 1000;
      }

      else if (logLine[3] == "Foe Requiem") {
        // Fix later
      }
    }

    else if (logLine[2] == "loses") {

      addText("debug","Loses " + logLine[3]);

      if (logLine[3] == "Straight Shot") {
        delete statustime.straightshot;
        brdAddIcon(id.straightshot,icon.straightshot);
      }

      else if (logLine[3] == "Straighter Shot") {
        delete statustime.straightershot;
        brdRemoveIcon(id.straightershot);
      }

      else if (logLine[3] == "Raging Strikes") {
        delete statustime.ragingstrikes;
      }

      else if (logLine[3] == "Foe Requiem") {
        // Fix later
      }
    }
  }

  else if (logLine[4] == player.name) { // From self

    if (logLine[2] == "gains") {

      addText("debug","Gains " + logLine[3] + " (" + logLine[1] + ")");

      if (["Venomous Bite","Caustic Bite"].indexOf(logLine[3]) > -1) {
        statustime.venomousbite = Date.now() + parseInt(logLine[5]) * 1000;
        if (player.level >= 54
        && Math.min(statustime.venomousbite,statustime.windbite) - Date.now() > 0) { // Check if both dots are up
          ironjawsTimeout();
        }
      }
      else if (["Windbite","Stormbite"].indexOf(logLine[3]) > -1) {
        statustime.windbite = Date.now() + parseInt(logLine[5]) * 1000;
        if (player.level >= 54
        && Math.min(statustime.venomousbite,statustime.windbite) - Date.now() > 0) { // Check if both dots are up
          ironjawsTimeout();
        }
      }
    }

    else if (logLine[2] == "loses") {

      addText("debug","Loses " + logLine[3] + " (" + logLine[1] + ")");

      if (["Venomous Bite","Caustic Bite"].indexOf(logLine[3]) > -1) {
        delete statustime.venomousbite;
        if (player.level >= 64) {
          brdAddIcon(id.venomousbite,icon.causticbite);
        }
        else {
          brdAddIcon(id.venomousbite,icon.venomousbite);
        }
      }

      else if (["Windbite","Stormbite"].indexOf(logLine[3]) > -1) {
        delete statustime.windbite;
        if (player.level >= 64) {
          brdAddIcon(id.windbite,icon.stormbite);
        }
        else {
          brdAddIcon(id.windbite,icon.windbite);
        }
      }
    }
  }
}

function ironjawsTimeout() {

  brdAddIconWithTimeout("ironjaws",Math.min(statustime.venomousbite,statustime.windbite) - Date.now() - brdBuffer,id.ironjaws,icon.ironjaws); // Determine next Iron Jaws depending on how many seconds left of shortest dot

  if (Math.min(statustime.venomousbite,statustime.windbite) - statustime.straightshot < brdBuffer
  && Math.min(statustime.venomousbite,statustime.windbite) - statustime.straightshot >= 0) {
    brdAddIconWithTimeout("straightshot",Math.min(statustime.venomousbite,statustime.windbite) - brdBuffer - Date.now() - brdBuffer,id.straightshot,icon.straightshot); // Adjust Straight Shot countdown depending on if Straight Shot will expire at an awkward time
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
      addText("debug",Math.max(statustime.song,cooldowntime.ragingstrikes,cooldowntime.barrage,cooldowntime.minuet) - Date.now())
    }
    else if (cooldowntime.ballad <= cooldowntime.paeon) {
      addIconWithTimeout("song",Math.max(statustime.song,cooldowntime.ballad) - Date.now(),id.ballad,icon.ballad);
      addText("debug",Math.max(statustime.song,cooldowntime.ballad) - Date.now());
    }
    else {
      addIconWithTimeout("song",Math.max(statustime.song,cooldowntime.paeon) - Date.now(),id.ballad,icon.paeon);
      addText("debug",Math.max(statustime.song,cooldowntime.paeon) - Date.now());
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
