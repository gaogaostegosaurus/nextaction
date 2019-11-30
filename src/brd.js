"use strict";

const brdActionList = [
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

  countdownid.ironjaws = 0;
  countdownid.windbite = 1;
  countdownid.venomousbite = 2;
  countdownid.ballad = 3;
  countdownid.paeon = 4;
  countdownid.minuet = 5;
  countdownid.empyrealarrow = 6;
  countdownid.ragingstrikes = 7;
  countdownid.barrage = 8;
  countdownid.sidewinder = 9;
  countdownid.shadowbite = countdownid.sidewinder;

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

  previous.empyrealarrow = 0;
  previous.quicknock = 0;
  previous.rainofdeath = 0;
  previous.shadowbite = 0;
  previous.apexarrow = 0;
}


function brdPlayerChangedEvent() {

  // Pitch Perfect
  if (previous.song == "minuet") {
    if (player.jobDetail.songProcs == 3) {
      addIcon({ name: "pitchperfect"});
    }
    else if (player.jobDetail.songProcs > 0
    && player.jobDetail.songMilliseconds < 3000) {
      addIcon({ name: "pitchperfect"});
    }
    else {
      removeIcon("pitchperfect");
    }
  }
  else {
    removeIcon("pitchperfect");
  }

  // Don't use EA without song after 68
  if (player.level >= 68
  && player.jobDetail.songMilliseconds <= 0) {
    removeCountdownBar("empyrealarrow");
  }
}

function brdTargetChangedEvent() { // Checks DoTs after switching targets
  if (previous.targetID != target.id) { // Prevent this from repeatedly being called on movement or whatever

    // If not a target then clear things out
    if (target.id.startsWith("4")) {
      if (player.level >= 54
      && checkStatus("venomousbite", target.id) > 0
      && checkStatus("windbite", target.id) > 0) {
        addCountdownBar({ name: "ironjaws", time: Math.min(checkStatus("venomousbite", target.id), checkStatus("windbite", target.id)) - 5000, oncomplete: "addIcon"});
      }
      else {
        addCountdownBar({ name: "venomousbite", time: checkStatus("venomousbite", target.id), oncomplete: "addIcon"});
        if (player.level >= 18) {
          addCountdownBar({ name: "windbite", time: checkStatus("windbite", target.id), oncomplete: "addIcon"});
        }
      }
    }
    else {
      removeIcon("ironjaws");
      removeIcon("venomousbite");
      removeIcon("windbite");
      removeCountdownBar("ironjaws");
      removeCountdownBar("venomousbite");
      removeCountdownBar("windbite");
    }

    previous.targetID = target.id;
  }
}

function brdAction() {

  // statustime added to actions because just going by buff gain/loss lines is super slow

  if (["Straight Shot", "Refulgent Arrow"].indexOf(actionLog.groups.actionName) > -1) {
    removeIcon("straightshot");
  }

  else if (["Venomous Bite", "Caustic Bite"].indexOf(actionLog.groups.actionName) > -1
  && actionLog.groups.result.length > 2) {
    removeIcon("ironjaws");
    removeIcon("venomousbite");
    addStatus("venomousbite", duration.venomousbite, actionLog.groups.targetID);
    if (player.level >= 54
    && checkStatus("windbite", actionLog.groups.targetID) > 0) {
      removeCountdownBar("venomousbite");
      removeCountdownBar("windbite");
      addCountdownBar({ name: "ironjaws", time: Math.min(checkStatus("venomousbite", actionLog.groups.targetID), checkStatus("windbite", actionLog.groups.targetID)) - 5000, oncomplete: "addIcon"});
    }
    else {
      removeCountdownBar("ironjaws");
      addCountdownBar({ name: "venomousbite", time: checkStatus("venomousbite", actionLog.groups.targetID), oncomplete: "addIcon"});
    }
  }

  else if (["Windbite", "Stormbite"].indexOf(actionLog.groups.actionName) > -1
  && actionLog.groups.result.length > 2) {
    removeIcon("ironjaws");
    removeIcon("windbite");
    addStatus("windbite", duration.windbite, actionLog.groups.targetID);
    if (player.level >= 54
    && checkStatus("venomousbite", actionLog.groups.targetID) > 0) {
      removeCountdownBar("venomousbite");
      removeCountdownBar("windbite");
      addCountdownBar({ name: "ironjaws", time: Math.min(checkStatus("venomousbite", actionLog.groups.targetID), checkStatus("windbite", actionLog.groups.targetID)) - 5000, oncomplete: "addIcon"});
    }
    else {
      removeCountdownBar("ironjaws");
      addCountdownBar({ name: "windbite", time: checkStatus("windbite", actionLog.groups.targetID), oncomplete: "addIcon"});
    }
    // if (player.level >= 54
    // && checkStatus("venomousbite", actionLog.groups.targetID) > 0) {
    //   removeIcon("venomousbite");
    //   clearTimeout(timeout.venomousbite);
    //   clearTimeout(timeout.windbite);
    //   addIconBlinkTimeout("ironjaws", Math.min(checkStatus("venomousbite", actionLog.groups.targetID), checkStatus("windbite", actionLog.groups.targetID)) - 5000, nextid.ironjaws, icon.ironjaws);
    // }
    // else {
    //   removeIcon("ironjaws");
    //   clearTimeout(timeout.ironjaws);
    //   addIconBlinkTimeout("windbite", 30000, nextid.windbite, icon.windbite);
    // }
  }

  else if ("Iron Jaws" == actionLog.groups.actionName) {

    removeIcon("ironjaws");

    if (checkStatus("venomousbite", actionLog.groups.targetID) > 0
    && checkStatus("windbite", actionLog.groups.targetID) > 0) {
      removeCountdownBar("venomousbite");
      removeCountdownBar("windbite");
      addStatus("venomousbite", duration.venomousbite, actionLog.groups.targetID);
      addStatus("windbite", duration.windbite, actionLog.groups.targetID);
      addCountdownBar({ name: "ironjaws", time: Math.min(checkStatus("venomousbite", actionLog.groups.targetID), checkStatus("windbite", actionLog.groups.targetID)) - 5000, oncomplete: "addIcon"});
      // removeIcon("venomousbite");
      // clearTimeout(timeout.ironjaws);
      // addIconBlinkTimeout("venomousbite", 30000, nextid.venomousbite, icon.venomousbite);
    }
    else if (checkStatus("venomousbite", actionLog.groups.targetID) > 0) {
      removeIcon("venomousbite");
      addStatus("venomousbite", duration.venomousbite, actionLog.groups.targetID);
      removeCountdownBar("ironjaws");
      addCountdownBar({ name: "venomousbite", time: checkStatus("venomousbite", actionLog.groups.targetID), oncomplete: "addIcon"});
    }

    else if (checkStatus("windbite", actionLog.groups.targetID) > 0) {
      removeIcon("windbite");
      addStatus("windbite", duration.windbite, actionLog.groups.targetID);
      removeCountdownBar("ironjaws");
      addCountdownBar({ name: "windbite", time: checkStatus("windbite", actionLog.groups.targetID), oncomplete: "addIcon"});
    }

  }

  else if ("Quick Nock" == actionLog.groups.actionName) {
    if (Date.now() - previous.quicknock > 1000) {
      previous.quicknock = Date.now();
      count.targets = 1;
    }
    else {
      count.targets = count.targets + 1;
    }
  }

  else if ("Rain Of Death" == actionLog.groups.actionName) {
    if (Date.now() - previous.rainofdeath > 1000) {
      previous.rainofdeath = Date.now();
      count.targets = 1;
    }
    else {
      count.targets = count.targets + 1;
    }
  }

  else if ("Raging Strikes" == actionLog.groups.actionName) {
    addCountdownBar({ name: "ragingstrikes"});
    // addIconBlinkTimeout("ragingstrikes",recast.ragingstrikes,nextid.ragingstrikes,icon.ragingstrikes);
    // if (player.level >= 38
    // && checkStatus("straightshotready") < 0) {
    //   addIconBlinkTimeout("barrage", checkRecast("barrage"), nextid.barrage, icon.barrage);
    // }
  }

  else if ("Barrage" == actionLog.groups.actionName) {
    addCountdownBar({ name: "barrage"});
  }

  else if ("Battle Voice" == actionLog.groups.actionName) {
    addCountdownBar({ name: "battlevoice"});
    // addRecast("battlevoice");
    // removeIcon("battlevoice");
    // addIconBlinkTimeout("battlevoice",recast.battlevoice,nextid.battlevoice,icon.battlevoice);
  }

  else if ("Sidewinder" == actionLog.groups.actionName) {
    addCountdownBar({ name: "sidewinder"});
    // addRecast("sidewinder");
    // removeIcon("sidewinder");
    // addIconBlinkTimeout("sidewinder",recast.sidewinder,nextid.sidewinder,icon.sidewinder);
  }

  else if ("Shadowbite" == actionLog.groups.actionName) {
    addCountdownBar({ name: "sidewinder"});
    // addRecast("sidewinder"); // Same cooldown as SW
    // removeIcon("sidewinder");
    // addIconBlinkTimeout("sidewinder",recast.sidewinder,nextid.sidewinder,icon.sidewinder);
    if (Date.now() - previous.shadowbite > 1000) {
      previous.shadowbite = Date.now();
      count.targets = 1;
    }
    else {
      count.targets = count.targets + 1;
    }
  }

  else if ("Mage's Ballad" == actionLog.groups.actionName) {
    addCountdownBar({ name: "ballad"});
    // removeIcon("ballad");
    // addRecast("ballad");
    // addStatus("song", 30000);
    // previous.song = "ballad";
    // if (player.level >= 52) {
    //   if (count.targets > 6) {
    //     if (checkRecast("paeon") <= checkRecast("minuet")) {
    //       addIconBlinkTimeout("paeon", Math.max(checkRecast("paeon"), 30000), nextid.paeon, icon.paeon);
    //     }
    //     else {
    //       addIconBlinkTimeout("minuet", Math.max(checkRecast("minuet"), 30000), nextid.minuet, icon.minuet);
    //     }
    //   }
    //   else {
    //     if (checkRecast("minuet") <= checkRecast("paeon")) {
    //       addIconBlinkTimeout("minuet", Math.max(checkRecast("minuet"), 30000), nextid.minuet, icon.minuet);
    //     }
    //     else {
    //       addIconBlinkTimeout("paeon", Math.max(checkRecast("paeon"), 30000), nextid.paeon, icon.paeon);
    //     }
    //   }
    // }
    // else if (player.level >= 40) {
    //   addIconBlinkTimeout("paeon", Math.max(checkRecast("paeon"), 30000), nextid.paeon, icon.paeon);
    // }
    // else {
    //   addIconBlinkTimeout("ballad", checkRecast("ballad"), nextid.ballad, icon.ballad);
    // }
    if (player.level >= 68) {
      addCountdownBar({ name: "empyrealarrow", time: checkRecast("empyrealarrow")});
      // addIconTimeout("empyrealarrow",checkRecast("empyrealarrow"),nextid.empyrealarrow,icon.empyrealarrow);
    }
  }

  else if ("Army's Paeon" == actionLog.groups.actionName) {
    addCountdownBar({ name: "paeon"});
    // removeIcon("paeon");
    // addRecast("paeon");
    // addStatus("song", 30000);
    // previous.song = "paeon";
    // if (player.level >= 52) {
    //   if (count.targets > 2) { // Min AP time for 3-6 targets
    //     if (checkRecast("ballad") <= checkRecast("minuet")) {
    //       addIconBlinkTimeout("ballad", Math.max(checkRecast("ballad"), checkRecast("minuet") - 30000, 20000), nextid.ballad, icon.ballad);
    //     }
    //     else {
    //       if (count.targets > 6) { // Max AP time if many targets
    //         addIconBlinkTimeout("minuet", Math.max(checkRecast("minuet"), 30000), nextid.minuet, icon.minuet);
    //       }
    //       else { // Min AP time if 1-2 targets
    //         addIconBlinkTimeout("minuet", Math.max(checkRecast("minuet"), checkRecast("ballad") - 30000, 20000), nextid.minuet, icon.minuet);
    //       }
    //     }
    //   }
    //   else {
    //     if (checkRecast("minuet") <= checkRecast("ballad")) {
    //       addIconBlinkTimeout("minuet", Math.max(checkRecast("minuet"), checkRecast("ballad") - 30000, 20000), nextid.minuet, icon.minuet);
    //     }
    //     else {
    //       addIconBlinkTimeout("ballad", Math.max(checkRecast("ballad"), checkRecast("minuet") - 30000, 20000), nextid.ballad, icon.ballad);
    //     }
    //   }
    // }
    // else {
    //   addIconBlinkTimeout("ballad", Math.max(checkRecast("ballad"), 30000), nextid.ballad, icon.ballad);
    // }
    if (player.level >= 68) {
      addCountdownBar({ name: "empyrealarrow", time: checkRecast("empyrealarrow")});
    }
  }

  else if ("The Wanderer's Minuet" == actionLog.groups.actionName) {
    addCountdownBar({ name: "paeon"});
    // removeIcon("minuet");
    // addRecast("minuet");
    // addStatus("song", 30000);
    // previous.song = "minuet";
    // if (checkRecast("ballad") <= checkRecast("paeon")) { // Mage's always beats Paeon
    //   addIconBlinkTimeout("ballad", Math.max(checkRecast("ballad"), 30000), nextid.ballad, icon.ballad); // Revisit for optimization at high targets?
    // }
    // else {
    //   addIconBlinkTimeout("paeon", Math.max(checkRecast("paeon"), 30000), nextid.paeon, icon.paeon);
    // }
    if (player.level >= 68) {
      addCountdownBar({ name: "empyrealarrow", time: checkRecast("empyrealarrow")});
    }
  }

  else if ("Empyreal Arrow" == actionLog.groups.actionName) {
    if (recast.empyrealarrow > Date.now() - previous.empyrealarrow) {
      recast.empyrealarrow = Date.now() - previous.empyrealarrow;
    }
    previous.empyrealarrow = Date.now();
    // removeIcon("empyrealarrow");
    // addRecast("empyrealarrow");
    addCountdownBar({ name: "empyrealarrow"});
    // if (player.level >= 68) {
    //   if (checkStatus("song", player.id) > recast.empyrealarrow) { // Check if EA should be reused within song duration
    //     addIconTimeout("empyrealarrow",recast.empyrealarrow,nextid.empyrealarrow,icon.empyrealarrow);
    //   }
    // }
    // else {
    //   addIconTimeout("empyrealarrow",recast.empyrealarrow,nextid.empyrealarrow,icon.empyrealarrow);
    // }
  }
}


function brdStatus() {

  if (statusLog.groups.targetID == player.id) {

    if (statusLog.groups.statusName == "Straight Shot Ready") {
      if (statusLog.groups.gainsLoses == "gains") {
        addStatus("straightshotready", parseInt(statusLog.groups.effectDuration) * 1000);
        addIcon({ name: "straightshot"});
        // removeIcon("barrage");
      }
      else if (statusLog.groups.gainsLoses == "loses") {
        removeStatus("straightshotready");
        removeIcon("straightshot");
        // addIconBlinkTimeout("barrage", checkRecast("barrage"), nextid.barrage, icon.barrage);
      }
    }

    else if (statusLog.groups.statusName == "Raging Strikes") {
      if (statusLog.groups.gainsLoses == "gains") {
        addStatus("ragingstrikes", parseInt(statusLog.groups.effectDuration) * 1000);
      }
      else if (statusLog.groups.gainsLoses == "loses") {
        removeStatus("ragingstrikes");
      }
    }
  }

  else {

    if (["Venomous Bite", "Caustic Bite"].indexOf(statusLog.groups.statusName) > -1) {
      if (statusLog.groups.gainsLoses == "gains") {
        addStatus("venomousbite", parseInt(statusLog.groups.effectDuration) * 1000, statusLog.groups.targetID);
        if (target.id == statusLog.groups.targetID) {  // Might be possible to switch targets during this
          if (player.level >= 54
          && checkStatus("windbite", target.id) > 0) {
            removeCountdownBar("venomousbite");
            removeCountdownBar("windbite");
            addCountdownBar({ name: "ironjaws", time: Math.min(checkStatus("venomousbite", target.id), checkStatus("windbite", target.id)) - 5000, oncomplete: "addIcon"});
          }
          else {
            removeCountdownBar("ironjaws");
            addCountdownBar({ name: "venomousbite", time: checkStatus("venomousbite", target.id), oncomplete: "addIcon"});
            addCountdownBar({ name: "windbite", time: checkStatus("windbite", target.id), oncomplete: "addIcon"});
          }
        }
      }
      else if (statusLog.groups.gainsLoses == "loses") {
        removeIcon("ironjaws");
        removeCountdownBar("ironjaws");
        addCountdownBar({ name: "venomousbite", time: checkStatus("venomousbite", target.id), oncomplete: "addIcon"});
        addCountdownBar({ name: "windbite", time: checkStatus("windbite", target.id), oncomplete: "addIcon"});
      }
    }

    else if (["Windbite", "Stormbite"].indexOf(statusLog.groups.statusName) > -1) {
      if (statusLog.groups.gainsLoses == "gains") {
        addStatus("windbite", parseInt(statusLog.groups.effectDuration) * 1000, statusLog.groups.targetID);
        if (target.id == statusLog.groups.targetID) {  // Might be possible to switch targets during this
          if (player.level >= 54
          && checkStatus("venomousbite", target.id) > 0) {
            removeCountdownBar("venomousbite");
            removeCountdownBar("windbite");
            addCountdownBar({ name: "ironjaws", time: Math.min(checkStatus("venomousbite", target.id), checkStatus("windbite", target.id)) - 5000, oncomplete: "addIcon"});
          }
          else {
            removeIcon("ironjaws");
            removeCountdownBar("ironjaws");
            addCountdownBar({ name: "venomousbite", time: checkStatus("venomousbite", target.id), oncomplete: "addIcon"});
            addCountdownBar({ name: "windbite", time: checkStatus("windbite", target.id), oncomplete: "addIcon"});
          }
        }
      }
      else if (statusLog.groups.gainsLoses == "loses") {
        removeIcon("ironjaws");
        removeCountdownBar("ironjaws");
        addCountdownBar({ name: "venomousbite", time: checkStatus("venomousbite", target.id), oncomplete: "addIcon"});
        addCountdownBar({ name: "windbite", time: checkStatus("windbite", target.id), oncomplete: "addIcon"});
      }
    }
  }
}
