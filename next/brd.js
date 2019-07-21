"use strict";

actionList.brd = [
  "Heavy Shot", "Straight Shot", "Venomous Bite", "Windbite", "Iron Jaws", "Caustic Bite", "Stormbite", "Refulgent Arrow",
  "Quick Nock",
  "Raging Strikes", "Barrage", "Battle Voice", "The Wanderer\'s Minuet", "Empyreal Arrow", "Sidewinder",
  "Mage\'s Ballad", "Army\'s Paeon",
];

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
  if (previous.song == "minuet") {
    if (player.jobDetail.songProcs == 3) {
      addIconBlink(nextid.pitchperfect,icon.pitchperfect);
    }
    else if (player.jobDetail.songProcs > 0
    && player.jobDetail.songMilliseconds < 3000) {
      addIconBlink(nextid.pitchperfect,icon.pitchperfect);
    }
    else {
      removeIcon(nextid.pitchperfect);
    }
  }
  else {
    removeIcon(nextid.pitchperfect);
  }

  // Don't use EA without song after 68
  if (player.level >= 68
  && player.jobDetail.songMilliseconds < 0) {
    removeIcon(nextid.empyrealarrow);
  }
}

function brdTargetChangedEvent() { // Checks DoTs after switching targets
  if (previous.targetID != target.ID) { // Prevent this from repeatedly being called on movement or whatever
    previous.targetID = target.ID;
    if (target.ID == 0 || target.ID.startsWith("1") || target.ID.startsWith("E")) {  // 0 = no target, 1... = player? E... = non-combat NPC?
      removeIcon(nextid.venomousbite);
      removeIcon(nextid.windbite);
      removeIcon(nextid.ironjaws);
      clearTimeout(timeout.venomousbite);
      clearTimeout(timeout.windbite);
      clearTimeout(timeout.ironjaws);
    }
    else if (player.level >= 54
    && Math.min(checkStatus("venomousbite", target.ID), checkStatus("windbite", target.ID)) > 0) {
      removeIcon(nextid.venomousbite);
      removeIcon(nextid.windbite);
      clearTimeout(timeout.venomousbite);
      clearTimeout(timeout.windbite);
      addIconBlinkTimeout("ironjaws", Math.min(checkStatus("venomousbite", target.ID), checkStatus("windbite", target.ID)) - 5000, nextid.ironjaws, icon.ironjaws);
    }
    else {
      removeIcon(nextid.ironjaws);
      clearTimeout(timeout.ironjaws);
      if (player.level >= 6) {
        removeIcon(nextid.venomousbite);
        addIconBlinkTimeout("venomousbite", checkStatus("venomousbite", target.ID), nextid.venomousbite, icon.venomousbite);
      }
      if (player.level >= 18) {
        removeIcon(nextid.windbite);
        addIconBlinkTimeout("windbite", checkStatus("windbite", target.ID), nextid.windbite, icon.windbite);
      }
    }
  }
}

function brdAction() {

  // statustime added to actions because just going by buff gain/loss lines is super slow

  if (["Straight Shot", "Refulgent Arrow"].indexOf(actionGroups.actionname) > -1) {
    removeIcon(nextid.straightshot);
  }

  else if (["Venomous Bite", "Caustic Bite"].indexOf(actionGroups.actionname) > -1
  && actionGroups.result.length > 2) {
    removeIcon(nextid.venomousbite);
    addStatus("venomousbite", actionGroups.targetID, 30000);
    if (player.level >= 54
    && checkStatus("windbite", actionGroups.targetID) > 0) {
      removeIcon(nextid.windbite);
      clearTimeout(timeout.venomousbite);
      clearTimeout(timeout.windbite);
      addIconBlinkTimeout("ironjaws", Math.min(checkStatus("venomousbite", actionGroups.targetID), checkStatus("windbite", actionGroups.targetID)) - 5000, nextid.ironjaws, icon.ironjaws);
    }
    else {
      removeIcon(nextid.ironjaws);
      clearTimeout(timeout.ironjaws);
      addIconBlinkTimeout("venomousbite", 30000, nextid.venomousbite, icon.venomousbite);
    }
  }

  else if (["Windbite", "Stormbite"].indexOf(actionGroups.actionname) > -1
  && actionGroups.result.length > 2) {
    removeIcon(nextid.windbite);
    addStatus("windbite", actionGroups.targetID, 30000);
    if (player.level >= 54
    && checkStatus("venomousbite", actionGroups.targetID) > 0) {
      removeIcon(nextid.venomousbite);
      clearTimeout(timeout.venomousbite);
      clearTimeout(timeout.windbite);
      addIconBlinkTimeout("ironjaws", Math.min(checkStatus("venomousbite", actionGroups.targetID), checkStatus("windbite", actionGroups.targetID)) - 5000, nextid.ironjaws, icon.ironjaws);
    }
    else {
      removeIcon(nextid.ironjaws);
      clearTimeout(timeout.ironjaws);
      addIconBlinkTimeout("windbite", 30000, nextid.windbite, icon.windbite);
    }
  }

  else if ("Iron Jaws" == actionGroups.actionname) {
    removeIcon(nextid.ironjaws);
    if (checkStatus("venomousbite", actionGroups.targetID) > 0
    && checkStatus("windbite", actionGroups.targetID) > 0) {
      addStatus("venomousbite", actionGroups.targetID, 30000);
      addStatus("windbite", actionGroups.targetID, 30000);
      removeIcon(nextid.venomousbite);
      removeIcon(nextid.windbite);
      clearTimeout(timeout.venomousbite);
      clearTimeout(timeout.windbite);
      addIconBlinkTimeout("ironjaws", Math.min(checkStatus("venomousbite", actionGroups.targetID), checkStatus("windbite", actionGroups.targetID)) - 5000, nextid.ironjaws, icon.ironjaws);
    }
    else if (checkStatus("venomousbite", actionGroups.targetID) > 0) {
      addStatus("venomousbite", actionGroups.targetID, 30000);
      removeIcon(nextid.venomousbite);
      clearTimeout(timeout.ironjaws);
      addIconBlinkTimeout("venomousbite", 30000, nextid.venomousbite, icon.venomousbite);
    }
    else if (checkStatus("windbite", actionGroups.targetID) > 0) {
      addStatus("windbite", actionGroups.targetID, 30000);
      removeIcon(nextid.windbite);
      clearTimeout(timeout.ironjaws);
      addIconBlinkTimeout("windbite", 30000, nextid.windbite, icon.windbite);
    }
  }

  else if ("Quick Nock" == actionGroups.actionname) {
    if (Date.now() - previous.quicknock > 1000) {
      previous.quicknock = Date.now();
      count.aoe = 1;
    }
    else {
      count.aoe = count.aoe + 1;
    }
  }

  else if ("Rain Of Death" == actionGroups.actionname) {
    if (Date.now() - previous.rainofdeath > 1000) {
      previous.rainofdeath = Date.now();
      count.aoe = 1;
    }
    else {
      count.aoe = count.aoe + 1;
    }
  }

  else if ("Raging Strikes" == actionGroups.actionname) {
    addCooldown("ragingstrikes", player.ID, recast.ragingstrikes);
    removeIcon(nextid.ragingstrikes);
    addIconBlinkTimeout("ragingstrikes",recast.ragingstrikes,nextid.ragingstrikes,icon.ragingstrikes);
    if (player.level >= 38
    && checkStatus("straightshotready") < 0) {
      addIconBlinkTimeout("barrage", checkCooldown("barrage", player.ID), nextid.barrage, icon.barrage);
    }
  }

  else if ("Barrage" == actionGroups.actionname) {
    addCooldown("barrage", player.ID, recast.barrage);
    removeIcon(nextid.barrage);
  }

  else if ("Battle Voice" == actionGroups.actionname) {
    addCooldown("battlevoice", player.ID, recast.battlevoice);
    removeIcon(nextid.battlevoice);
    addIconBlinkTimeout("battlevoice",recast.battlevoice,nextid.battlevoice,icon.battlevoice);
  }

  else if ("Sidewinder" == actionGroups.actionname) {
    addCooldown("sidewinder", player.ID, recast.sidewinder);
    removeIcon(nextid.sidewinder);
    addIconBlinkTimeout("sidewinder",recast.sidewinder,nextid.sidewinder,icon.sidewinder);
  }

  else if ("Shadowbite" == actionGroups.actionname) {
    addCooldown("sidewinder", player.ID, recast.sidewinder); // Same cooldown as SW
    removeIcon(nextid.sidewinder);
    addIconBlinkTimeout("sidewinder",recast.sidewinder,nextid.sidewinder,icon.sidewinder);
    if (Date.now() - previous.shadowbite > 1000) {
      previous.shadowbite = Date.now();
      count.aoe = 1;
    }
    else {
      count.aoe = count.aoe + 1;
    }
  }

  else if ("Mage's Ballad" == actionGroups.actionname) {
    removeIcon(nextid.ballad);
    addCooldown("ballad", player.ID, recast.ballad);
    addStatus("song", player.ID, 30000);
    previous.song = "ballad";
    if (player.level >= 52) {
      if (count.aoe > 6) {
        if (checkCooldown("paeon", player.ID) <= checkCooldown("minuet", player.ID)) {
          addIconBlinkTimeout("paeon", Math.max(checkCooldown("paeon", player.ID), 30000), nextid.paeon, icon.paeon);
        }
        else {
          addIconBlinkTimeout("minuet", Math.max(checkCooldown("minuet", player.ID), 30000), nextid.minuet, icon.minuet);
        }
      }
      else {
        if (checkCooldown("minuet", player.ID) <= checkCooldown("paeon", player.ID)) {
          addIconBlinkTimeout("minuet", Math.max(checkCooldown("minuet", player.ID), 30000), nextid.minuet, icon.minuet);
        }
        else {
          addIconBlinkTimeout("paeon", Math.max(checkCooldown("paeon", player.ID), 30000), nextid.paeon, icon.paeon);
        }
      }
    }
    else if (player.level >= 40) {
      addIconBlinkTimeout("paeon", Math.max(checkCooldown("paeon", player.ID), 30000), nextid.paeon, icon.paeon);
    }
    else {
      addIconBlinkTimeout("ballad", checkCooldown("ballad", player.ID), nextid.ballad, icon.ballad);
    }
    if (player.level >= 68) {
      addIconTimeout("empyrealarrow",checkCooldown("empyrealarrow", player.ID),nextid.empyrealarrow,icon.empyrealarrow);
    }
  }

  else if ("Army's Paeon" == actionGroups.actionname) {
    removeIcon(nextid.paeon);
    addCooldown("paeon", player.ID, recast.paeon);
    addStatus("song", player.ID, 30000);
    previous.song = "paeon";
    if (player.level >= 52) {
      if (count.aoe > 2) { // Min AP time for 3-6 targets
        if (checkCooldown("ballad", player.ID) <= checkCooldown("minuet", player.ID)) {
          addIconBlinkTimeout("ballad", Math.max(checkCooldown("ballad", player.ID), checkCooldown("minuet", player.ID) - 30000, 20000), nextid.ballad, icon.ballad);
        }
        else {
          if (count.aoe > 6) { // Max AP time if many targets
            addIconBlinkTimeout("minuet", Math.max(checkCooldown("minuet", player.ID), 30000), nextid.minuet, icon.minuet);
          }
          else { // Min AP time if 1-2 targets
            addIconBlinkTimeout("minuet", Math.max(checkCooldown("minuet", player.ID), checkCooldown("ballad", player.ID) - 30000, 20000), nextid.minuet, icon.minuet);
          }
        }
      }
      else {
        if (checkCooldown("minuet", player.ID) <= checkCooldown("ballad", player.ID)) {
          addIconBlinkTimeout("minuet", Math.max(checkCooldown("minuet", player.ID), checkCooldown("ballad", player.ID) - 30000, 20000), nextid.minuet, icon.minuet);
        }
        else {
          addIconBlinkTimeout("ballad", Math.max(checkCooldown("ballad", player.ID), checkCooldown("minuet", player.ID) - 30000, 20000), nextid.ballad, icon.ballad);
        }
      }
    }
    else {
      addIconBlinkTimeout("ballad", Math.max(checkCooldown("ballad", player.ID), 30000), nextid.ballad, icon.ballad);
    }
    if (player.level >= 68) {
      addIconTimeout("empyrealarrow",checkCooldown("empyrealarrow", player.ID),nextid.empyrealarrow,icon.empyrealarrow);
    }
  }

  else if ("The Wanderer's Minuet" == actionGroups.actionname) {
    removeIcon(nextid.minuet);
    addCooldown("minuet", player.ID, recast.minuet);
    addStatus("song", player.ID, 30000);
    previous.song = "minuet";
    if (checkCooldown("ballad", player.ID) <= checkCooldown("paeon", player.ID)) { // Mage's always beats Paeon
      addIconBlinkTimeout("ballad", Math.max(checkCooldown("ballad", player.ID), 30000), nextid.ballad, icon.ballad); // Revisit for optimization at high targets?
    }
    else {
      addIconBlinkTimeout("paeon", Math.max(checkCooldown("paeon", player.ID), 30000), nextid.paeon, icon.paeon);
    }
    if (player.level >= 68) {
      addIconTimeout("empyrealarrow",checkCooldown("empyrealarrow", player.ID),nextid.empyrealarrow,icon.empyrealarrow);
    }
  }

  else if ("Empyreal Arrow" == actionGroups.actionname) {
    removeIcon(nextid.empyrealarrow);
    addCooldown("empyrealarrow", player.ID, recast.empyrealarrow);
    if (player.level >= 68) {
      if (checkStatus("song", player.ID) > recast.empyrealarrow) { // Check if EA should be reused within song duration
        addIconTimeout("empyrealarrow",recast.empyrealarrow,nextid.empyrealarrow,icon.empyrealarrow);
      }
    }
    else {
      addIconTimeout("empyrealarrow",recast.empyrealarrow,nextid.empyrealarrow,icon.empyrealarrow);
    }
  }
}


function brdStatus() {

  if (statusGroups.targetID == player.ID) {

    if (statusGroups.statusname == "Straight Shot Ready") {
      if (statusGroups.gainsloses == "gains") {
        addStatus("straightshotready", player.ID);
        addIconBlink(nextid.straightshot,icon.straightshot);
        removeIcon(nextid.barrage);
      }
      else if (statusGroups.gainsloses == "loses") {
        removeIcon(nextid.straightshot);
        addIconBlinkTimeout("barrage", checkCooldown("barrage", player.ID), nextid.barrage, icon.barrage);
      }
    }

    else if (statusGroups.statusname == "Raging Strikes") {
      if (statusGroups.gainsloses == "gains") {
        addStatus("ragingstrikes", statusGroups.targetID, parseInt(statusGroups.duration) * 1000);
      }
      else if (statusGroups.gainsloses == "loses") {
        removeStatus("ragingstrikes", statusGroups.targetID);
      }
    }
  }

  else {

    if (["Venomous Bite", "Caustic Bite"].indexOf(statusGroups.statusname) > -1) {
      if (statusGroups.gainsloses == "gains"
      && target.ID == statusGroups.targetID) {
        removeIcon(nextid.venomousbite);
        addStatus("venomousbite", statusGroups.targetID, parseInt(statusGroups.duration) * 1000);
        if (player.level >= 54
        && checkStatus("windbite", statusGroups.targetID) > 0) {
          clearTimeout(timeout.venomousbite);
          clearTimeout(timeout.windbite);
          addIconBlinkTimeout("ironjaws", Math.min(checkStatus("venomousbite", statusGroups.targetID), checkStatus("windbite", statusGroups.targetID)) - 5000, nextid.ironjaws, icon.ironjaws);
        }
        else {
          removeIcon(nextid.ironjaws);
          clearTimeout(timeout.ironjaws);
          addIconBlinkTimeout("venomousbite", 30000, nextid.venomousbite, icon.venomousbite);
        }
      }
      else if (statusGroups.gainsloses == "loses"
      && target.ID == statusGroups.targetID) {
        removeIcon(nextid.ironjaws);
        clearTimeout(timeout.venomousbite);
        clearTimeout(timeout.ironjaws);
        addIconBlink(nextid.venomousbite, icon.venomousbite);
      }
    }

    else if (["Windbite", "Stormbite"].indexOf(statusGroups.statusname) > -1) {
      if (statusGroups.gainsloses == "gains"
      && target.ID == statusGroups.targetID) {
        removeIcon(nextid.windbite);
        addStatus("windbite", statusGroups.targetID, parseInt(statusGroups.duration) * 1000);
        if (player.level >= 54
        && checkStatus("venomousbite", statusGroups.targetID) > 0) {
          clearTimeout(timeout.venomousbite);
          clearTimeout(timeout.windbite);
          addIconBlinkTimeout("ironjaws", Math.min(checkStatus("venomousbite", statusGroups.targetID), checkStatus("windbite", statusGroups.targetID)) - 5000, nextid.ironjaws, icon.ironjaws);
        }
        else {
          removeIcon(nextid.ironjaws);
          clearTimeout(timeout.ironjaws);
          addIconBlinkTimeout("windbite", 30000, nextid.windbite, icon.windbite);
        }
      }
      else if (statusGroups.gainsloses == "loses"
      && target.ID == statusGroups.targetID) {
        removeIcon(nextid.ironjaws);
        clearTimeout(timeout.windbite);
        clearTimeout(timeout.ironjaws);
        addIconBlink(nextid.windbite, icon.windbite);
      }
    }
  }
}
