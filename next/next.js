"use strict";

var recast = {};
var duration = {};
var cooldowntracker = {};     // Holds timestamps for cooldowns
var statustracker = {};       // Holds timestamps for statuses
var cooldowntime = {};        // Holds timestamps for cooldowns
var statustime = {};          // Holds timestamps for statuses
var statuslength = {};        // Holds durations... probably should rename it to durations...
var gauge = {};
var buffertime = {};

var timeout = {};             // For timeout variables
var id = {};                  // Store document id - location on page for icons, etc.
var icon = {};                // Store icon name
var toggle = {};              // Toggley things
var count = {};               // County things

var previous = {};
var next = {};

var actionList = {};

var statusList = {};

var player = {};
var target = {};

var actionRegExp = new RegExp(' 1[56]:([\\dA-F]{8}):(.*?):[\\dA-F]{1,4}:(.*?):([\\dA-F]{8}):(.*?):([\\dA-F]{1,8}):');
var actionLog;
var actionGroups = {};

var statusRegExp = new RegExp(' 1[AE]:([\\dA-F]{8}):(.*?) (gains|loses) the effect of (.*?) from (.*?)(?: for )?(\\d*\\.\\d*)?(?: Seconds)?\\.');
var statusLog;
var statusGroups = {};

var startRegExp =  new RegExp(' 14:[\\dA-F]{1,4}:(.*?) starts using (.*?) on (.*?)\\.');
var startLog;
var startGroups = {};

var cancelRegExp = new RegExp(' 17:([\\dA-F]{8}):(.*?):[\\dA-F]{1,4}:(.*?):Cancelled:');
var cancelLog;
var cancelGroups = {};

// onPlayerChangedEvent: fires whenever player change detected (including HP, MP, other resources, positions, etc.)
document.addEventListener("onPlayerChangedEvent", function(e) {

  player = e.detail;
  player.ID = e.detail.id.toString(16).toUpperCase(); // player.id.toString(16) is lowercase

  // Detects name/job/level change and clears elements
  if (previous.name != player.name || previous.job != player.job || previous.level != player.level) {
    delete toggle.combo;
    clearElements();

    addText("loadmessage", "Plugin loaded for " + player.level + player.job);

    if (player.job == "BLM") {
      blmJobChange();
    }
    else if (player.job == "BRD") {
      actionRegExp = new RegExp(' 1[56]:([\\dA-F]{8}):(' + player.name + '):[\\dA-F]{2,8}:(' + actionList.brd.join("|") + '):([\\dA-F]{2,8}):([^:]*):([\\dA-F]{1,8}):');
      statusRegExp = new RegExp(' 1[AE]:([\\dA-F]{8}):(.*) (gains|loses) the effect of (' + statusList.brd.join("|") + ') from (' + player.name + ')(?: for )?(\\d*\\.\\d*)?(?: Seconds)?\\.');
    }

    else if (player.job == "RDM") {
      rdmJobChange();
    }
    else if (player.job == "SAM") {
      samJobChange();
    }
    else if (player.job == "WAR") {
      warJobChange();
    }
    else if (player.job == "WHM") {
      whmJobChange();
    }

    //// NOTES FOR REGEX CAPTURES ////

    // Action
    // 1:SourceID 2:SourceName 3:SkillName 4:TargetID 5:TargetName 6:Result

    // Status
    // 1: TargetID 2:TargetName 3:GainsLoses 4:Status 5:SourceName 6:Seconds (doesn't exist for "Loses")
    // Avoid using player.ID or target.ID here
    // Old line (2.0.2.2) 1:TargetName 2:GainsLoses 3:Status 4:SourceName 5:Seconds (doesn't exist for "Loses")

    // Backup method for weird zones like Eureka - create toggle for this later?
    // statusRegExp2 = new RegExp(' 00:08[\\da-f]{2}:.*(You) (gain|lose) the effect of (' + selfStatusList.rdm.join("|") + ')\\.');

  }

  previous.name = player.name;
  previous.job = player.job;
  previous.level = player.level;

  // This is probably only useful for jobs that need to watch things that "tick" up or down
  if (player.job == "BRD") {
    brdPlayerChangedEvent(e);
  }
  else if (player.job == "RDM") {
    rdmPlayerChangedEvent(e);
  }
  else if (player.job == "WHM") {
    whmPlayerChangedEvent(e);
  }

});

document.addEventListener('onTargetChangedEvent', function(e) {
  target = e.detail;
  target.ID = e.detail.id.toString(16).toUpperCase(); //
});

document.addEventListener("onInCombatChangedEvent", function(e) {
// Fires when character exits or enters combat

  if (! e.detail.inGameCombat) {
    delete toggle.combat;
    document.getElementById("nextdiv").className = "fadeout";
  }
  else {

    toggle.combat = Date.now();
    document.getElementById("nextdiv").className = "fadein";

    // Try to get rid of this section

    if (player.job == "BRD") {
      brdInCombatChangedEvent(e);
    }
    else if (player.job == "RDM") {
      rdmInCombatChangedEvent(e);
    }
    else if (player.job == "SAM") {
      samInCombatChangedEvent(e);
    }
    else if (player.job == "WAR") {
      warInCombatChangedEvent(e);
    }
    else if (player.job == "WHM") {
      whmInCombatChangedEvent(e);
    }
  }
});

document.addEventListener("onLogEvent", function(e) { // Fires on log event

  for (let i = 0; i < e.detail.logs.length; i++) {

    // Replaces named regex groups until CEF updated

    actionGroups.sourceID = "";
    actionGroups.sourcename = "";
    actionGroups.actionname = "";
    actionGroups.targetID = "";
    actionGroups.targetname = "";
    actionGroups.result = "";

    statusGroups.targetID = "";
    statusGroups.targetname = "";
    statusGroups.gainsloses = "";
    statusGroups.statusname = "";
    //statusGroups.sourceID = "";  // Maybe someday
    statusGroups.sourcename = "";
    statusGroups.duration = "";

    // startGroups.sourceID = "";
    startGroups.sourcename = "";
    startGroups.actionname = "";
    // startGroups.targetID = "";
    startGroups.targetname = "";

    cancelGroups.sourceID = "";
    cancelGroups.sourcename = "";
    cancelGroups.actionname = "";

    actionLog = e.detail.logs[i].match(actionRegExp);
    statusLog = e.detail.logs[i].match(statusRegExp);
    startLog  = e.detail.logs[i].match(startRegExp);
    cancelLog = e.detail.logs[i].match(cancelRegExp);

    if (actionLog) {
      actionGroups.sourceID = actionLog[1];
      actionGroups.sourcename = actionLog[2];
      actionGroups.actionname = actionLog[3];
      actionGroups.targetID = actionLog[4];
      actionGroups.targetname = actionLog[5];
      actionGroups.result = actionLog[6];
    }

    else if (statusLog) {
      statusGroups.targetID = statusLog[1];
      statusGroups.targetname = statusLog[2];
      statusGroups.gainsloses = statusLog[3];
      statusGroups.statusname = statusLog[4];
      statusGroups.sourcename = statusLog[5];
      statusGroups.duration = statusLog[6];
    }

    else if (startLog) {
      startGroups.sourcename = startLog[1];
      startGroups.actionname = startLog[2];
      startGroups.targetname = startLog[3];
    }

    else if (cancelLog) {
      cancelGroups.sourceID = cancelLog[1];
      cancelGroups.sourcename = cancelLog[2];
      cancelGroups.actionname = cancelLog[3];
    }

    //

    if (actionGroups.sourceID == player.ID) {  // Status source = player
      if (player.job == "BLM") {
        blmAction(actionLog);
      }
      else if (player.job == "BRD") {
        brdAction(actionLog);
      }
      else if (player.job == "MNK") {
        mnkAction(actionLog);
      }
      else if (player.job == "RDM") {
        rdmAction(actionLog);
      }
      else if (player.job == "SAM") {
        samAction(actionLog);
      }
      else if (player.job == "WAR") {
        warAction(actionLog);
      }
      else if (player.job == "WHM") {
        whmAction(actionLog);
      }
    }

    // Checks for status

    else if (statusGroups.sourcename == player.name) {  // Status source = player
      if (player.job == "BLM") {
        blmStatus(statusLog);
      }
      else if (player.job == "BRD") {
        brdStatus(statusLog);
      }
      else if (player.job == "MNK") {
        mnkStatus(statusLog);
      }
      else if (player.job == "RDM") {
        rdmStatus(statusLog);
      }
      else if (player.job == "SAM") {
        samStatus(statusLog);
      }
      else if (player.job == "WAR") {
        warStatus(statusLog);
      }
      // else if (player.job == "WHM") {
      //   whmStatus(statusLog);
      // }
    }

    else if (startGroups.sourcename == player.name) {  // Status source = player
      if (player.job == "BLM") {
        blmStartsUsing(statusLog);
      }
    }

    else if (cancelGroups.sourceID == player.ID) {  // Status source = player
      if (player.job == "BLM") {
        blmCancelled(statusLog);
      }
    }

  }
});


function addCooldown(cooldownname, sourceid, recast) {

  //// NOTES FOR SELF ////
  //// (Unless I change it up again) ////
  // logLine[1] = source ID in action logLine
  // logLine[2] = source name in action logLine

  if (!cooldowntracker[cooldownname]) { // Create array if it doesn't exist yet
    cooldowntracker[cooldownname] = [sourceid, recast + Date.now()];
  }
  else if (cooldowntracker[cooldownname].indexOf(sourceid) > -1) { // Update array if source match found
    cooldowntracker[cooldownname][cooldowntracker[cooldownname].indexOf(sourceid) + 1] = recast + Date.now();
  }
  else { // Push new entry into array if no matching entry
    cooldowntracker[cooldownname].push(sourceid, recast + Date.now());
  }
}

function checkCooldown(cooldownname, sourceid) {
  if (!cooldowntracker[cooldownname]) {
    return -1;
  }
  else if (cooldowntracker[cooldownname].indexOf(sourceid) > -1) {
    return cooldowntracker[cooldownname][cooldowntracker[cooldownname].indexOf(sourceid) + 1] - Date.now();
  }
  else {
    return -1;
  }
}

function addStatus(statusname, targetid, duration) {

  //// NOTES FOR SELF ////
  //// (Unless I change it up again) ////
  // logLine[4] - target ID in action logLine - it might be good to eventually include this, but status logLines don't include ID
  // logLine[5] - target name in action logLine
  // logLine[1] - target ID in status logLine
  // target.name - from change target function - probably works all the time? Maybe?

  if (!statustracker[statusname]) { // Create array if it doesn't exist yet
    statustracker[statusname] = [targetid, Date.now() + duration];
  }
  else if (statustracker[statusname].indexOf(targetid) > -1) { // Update array if target match found
    statustracker[statusname][statustracker[statusname].indexOf(targetid) + 1] = Date.now() + duration;
  }
  else { // Push new entry into array if no matching entry
    statustracker[statusname].push(targetid, Date.now() + duration);
  }
}

function checkStatus(statusname, targetid) {
  if (!statustracker[statusname]) {
    return -1;
  }
  else if (statustracker[statusname].indexOf(targetid) > -1) {
    return statustracker[statusname][statustracker[statusname].indexOf(targetid) + 1] - Date.now();
  }
  else {
    return -1;
  }
}

function removeStatus(statusname, targetid) {
  if (!statustracker[statusname]) {
    statustracker[statusname] = [];
  }
  else if (statustracker[statusname].indexOf(targetid) > -1) {
    statustracker[statusname].splice(statustracker[statusname].indexOf(targetid), 2);
  }
}

// Icon functions

function addIcon(nextid, actionicon) {
  document.getElementById("icon" + nextid).src = "icons/" + actionicon + ".png";
  document.getElementById("next" + nextid).className = "icondiv addfadein";
  document.getElementById("next" + nextid).style.display = "table-cell";
}

function addIconBlink(nextid, actionicon) {
  document.getElementById("icon" + nextid).src = "icons/" + actionicon + ".png";
  document.getElementById("next" + nextid).className = "icondiv addfadeinblink";
  document.getElementById("next" + nextid).style.display = "table-cell";
}

function addIconWithTimeout(action,delay,nextid,actionicon) {
  clearTimeout(timeout[action]);
  timeout[action] = setTimeout(addIcon, delay, nextid, actionicon);
}

function addIconBlinkTimeout(action, delay, nextid, actionicon) {
  clearTimeout(timeout[action]);
  timeout[action] = setTimeout(addIconBlink, delay, nextid, actionicon);
}

function removeIcon(nextid) {
  document.getElementById("next" + nextid).className = "icondivtest fadeoutremove";
}

function addText(actionid,message) {
  document.getElementById(actionid).style.display = "table-row";
  document.getElementById(actionid).innerText = message;
}

function removeText(actionid) {
  document.getElementById(actionid).style.display = "none";
}

function clearElements() {
  for (var x = 0; x < 30; x++) {
    document.getElementById("next" + x).style.display = "none";
  }
}

// Should call timeouts inside the function - self-referring stuff

// function timeoutCombo() {
// // Call this function at the end of event log checker to prevent combos from lingering more than they should
//   clearTimeout(timeout.combo);
//   timeout.combo = setTimeout(resetCombo, 12000);
// }
//
// function resetCombo() {
//   delete toggle.combo;
//   if (toggle.combat) {
//     if (player.job == "DRG") {
//       drgCombo();
//     }
//     else if (player.job == "NIN") {
//       ninCombo();
//     }
//     else if (player.job == "SAM") {
//       samCombo();
//     }
//     else if (player.job == "WAR") {
//       warCombo();
//     }
//   }
// }
