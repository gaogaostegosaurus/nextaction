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
var actionRegExp;
var actionLog;

var statusList = {};
var statusRegExp;
var statusLog;

// var selfStatusRegExp2;
// var statusLog2;

var player = {};
var target = {};

// onPlayerChangedEvent: fires whenever player change detected (including HP, positions, etc.)

document.addEventListener("onPlayerChangedEvent", function(e) {

  player = e.detail;

  // Detects name/job/level change and clears elements

  if (previous.name != player.name || previous.job != player.job || previous.level != player.level) {
    delete toggle.combo;
    clearElements();

    if (player.job == "BRD") {
      actionRegExp = new RegExp(' 1[56]:([\\dA-F]{8}):(' + player.name + '):[\\dA-F]{2,8}:(' + actionList.brd.join("|") + '):([\\dA-F]{2,8}):([^:]*):([\\dA-F]{1,8}):');
      statusRegExp = new RegExp(' 1[AE]:(.*) (gains|loses) the effect of (' + statusList.brd.join("|") + ') from (' + player.name + ')(?: for )?(\\d*\\.\\d*)?(?: Seconds)?\\.');
    }
    else if (player.job == "MNK") {
      actionRegExp = new RegExp(' 1[56]:([\\dA-F]{8}):(' + player.name + '):[\\dA-F]{2,8}:(' + actionList.mnk.join("|") + '):([\\dA-F]{2,8}):([^:]*):([\\dA-F]{1,8}):');
      statusRegExp = new RegExp(' 1[AE]:(.*) (gains|loses) the effect of (' + statusList.mnk.join("|") + ') from (.*?)(?: for )?(\\d*\\.\\d*)?(?: Seconds)?\\.');
    }
    else if (player.job == "RDM") {
      actionRegExp = new RegExp(' 1[56]:([\\dA-F]{8}):(.*?):[\\dA-F]{1,4}:(.*?):([\\dA-F]{8}):(.*?):([\\dA-F]{1,8}):');
      statusRegExp = new RegExp(' 1[AE]:(.*?) (gains|loses) the effect of (.*?) from (.*?)(?: for )?(\\d*\\.\\d*)?(?: Seconds)?\\.');
    }
    else if (player.job == "SAM") {
      actionRegExp = new RegExp(' 1[56]:([\\dA-F]{8}):(' + player.name + '):[\\dA-F]{2,8}:(' + actionList.sam.join("|") + '):([\\dA-F]{2,8}):([^:]*):([\\dA-F]{1,8}):');
      statusRegExp = new RegExp(' 1[AE]:(.*) (gains|loses) the effect of (' + statusList.sam.join("|") + ') from (.*?)(?: for )?(\\d*\\.\\d*)?(?: Seconds)?\\.');
    }
    else if (player.job == "WAR") {
      actionRegExp = new RegExp(' 1[56]:([\\dA-F]{8}):(' + player.name + '):[\\dA-F]{2,8}:(' + actionList.war.join("|") + '):([\\dA-F]{2,8}):([^:]*):([\\dA-F]{1,8}):');
      statusRegExp = new RegExp(' 1[AE]:(.*) (gains|loses) the effect of (' + statusList.war.join("|") + ') from (' + player.name + ')(?: for )?([^ ]*)(?: Seconds)?\\.');
    }

    //// NOTES FOR REGEX CAPTURES ////

    // Action
    // 1:SourceID 2:SourceName 3:SkillName 4:TargetID 5:TargetName 6:Result

    // Status
    // 1:TargetName 2:GainsLoses 3:Status 4:SourceName 5:Seconds (doesn't exist for "Loses")

    // Backup method for weird zones like Eureka - create toggle for this later?
    // statusRegExp2 = new RegExp(' 00:08[\\da-f]{2}:.*(You) (gain|lose) the effect of (' + selfStatusList.rdm.join("|") + ')\\.');

  }

  previous.name = player.name;
  previous.job = player.job;
  previous.level = player.level;

  if (toggle.combat) { // Prevents functions from activating outside of combat (to prevent annoying stuff popping up)

    if (player.job == "BRD") {
      brdPlayerChangedEvent(e);
    }
    else if (player.job == "RDM") {
      rdmPlayerChangedEvent(e);
    }
    else if (player.job == "SAM") {
      samPlayerChangedEvent(e);
    }
    else if (player.job == "WAR") {
      warPlayerChangedEvent(e);
    }
  }
});

document.addEventListener('onTargetChangedEvent', function(e) {
  if (!e.detail.name) {
    target.name = "";
    target.id = "";
  }
  else {
    target.name = e.detail.name;
    target.id = e.detail.id.toString(16);
  }
});

document.addEventListener("onInCombatChangedEvent", function(e) {
// Fires when character exits or enters combat

  if (! e.detail.inGameCombat) {

    delete toggle.combat;
    clearTimeout(timeout.clearElements);

    timeout.clearElements = setTimeout(clearElements, 4000);
    // Wait 4 seconds before clearing stuff (DoTs can be annoying otherwise)
  }
  else {

    clearTimeout(timeout.clearElements);
    toggle.combat = Date.now();

    if (player.job == "BRD") {
      brdInCombatChangedEvent(e);
    }
    else if (player.job == "RDM") {
      rdmInCombatChangedEvent(e);
    }
    else if (player.job == "WAR") {
      warInCombatChangedEvent(e);
    }
  }
});

document.addEventListener("onLogEvent", function(e) {
// Fires on log event

  for (let i = 0; i < e.detail.logs.length; i++) {

    actionLog = e.detail.logs[i].match(actionRegExp);
    statusLog = e.detail.logs[i].match(statusRegExp);

    if (actionLog) {
      if (player.job == "BRD") {
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
    }

    else if (statusLog) {
      if (player.job == "BRD") {
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
    }
  }
});


function addCooldown(cooldownname, source, recast) {

  //// NOTES FOR SELF ////
  //// (Unless I change it up again) ////
  // logLine[1] = source ID in action logLine
  // logLine[2] = source name in action logLine

  if (!cooldowntracker[cooldownname]) { // Create array if it doesn't exist yet
    cooldowntracker[cooldownname] = [source, Date.now() + recast];
  }
  else if (cooldowntracker[cooldownname].indexOf(source) > -1) { // Update array if source match found
    cooldowntracker[cooldownname][cooldowntracker[cooldownname].indexOf(source) + 1] = Date.now() + recast;
  }
  else { // Push new entry into array if no matching entry
    cooldowntracker[cooldownname].push(source, Date.now() + recast);
  }
}

function checkCooldown(cooldownname, source) {
  if (!cooldowntracker[cooldownname]) {
    return -1;
  }
  else if (cooldowntracker[cooldownname].indexOf(source) > -1) {
    return cooldowntracker[cooldownname][cooldowntracker[cooldownname].indexOf(source) + 1] - Date.now();
  }
}

function addStatus(statusname, target, duration) {

  //// NOTES FOR SELF ////
  //// (Unless I change it up again) ////
  // logLine[4] - target ID in action logLine - it might be good to eventually include this, but status logLines don't include ID
  // logLine[5] - target name in action logLine
  // logLine[1] - target name in status logLine
  // target.name - from change target function - probably works all the time? Maybe?

  if (!statustracker[statusname]) { // Create array if it doesn't exist yet
    statustracker[statusname] = [target, Date.now() + duration];
  }
  else if (statustracker[statusname].indexOf(target) > -1) { // Update array if target match found
    statustracker[statusname][statustracker[statusname].indexOf(target) + 1] = Date.now() + duration;
  }
  else { // Push new entry into array if no matching entry
    statustracker[statusname].push(target, Date.now() + duration);
  }
}

function checkStatus(statusname, target) {
  if (!statustracker[statusname]) {
    return -1;
  }
  else if (statustracker[statusname].indexOf(target) > -1) {
    return statustracker[statusname][statustracker[statusname].indexOf(target) + 1] - Date.now();
  }
}

function removeStatus(statusname, target) {
  if (!statustracker[statusname]) {
    statustracker[statusname] = [];
  }
  else if (statustracker[statusname].indexOf(target) > -1) {
    statustracker[statusname].splice(statustracker[statusname].indexOf(target), 2);
  }
}

// Icon functions

function addIcon(actionid,actionicon) {
// actionid is element ID, actionicon is png name without extention
  if (toggle.combat) {
    document.getElementById(actionid).src = "icons/" + actionicon + ".png";
  }
}

function addIconWithTimeout(action,delay,actionid,actionicon) {
  clearTimeout(timeout[action]);
  timeout[action] = setTimeout(addIcon, delay, actionid, actionicon);
}

function removeIcon(actionid) {
  document.getElementById(actionid).src = "";
}

function addText(actionid,message) {
  document.getElementById(actionid).innerText = message;
}

function removeText(actionid) {
  document.getElementById(actionid).innerText = "";
}

function clearElements() {
  document.getElementById("nextAction1").src = "";
  document.getElementById("nextAction2").src = "";
  document.getElementById("nextAction3").src = "";
  document.getElementById("nextAction4").src = "";
  document.getElementById("nextAction5").src = "";
  document.getElementById("nextAction6").src = "";
  document.getElementById("nextAction7").src = "";
  document.getElementById("nextAction11").src = "";
  document.getElementById("nextAction12").src = "";
  document.getElementById("nextAction13").src = "";
  document.getElementById("nextAction14").src = "";
  document.getElementById("nextAction15").src = "";
  document.getElementById("nextAction16").src = "";
  document.getElementById("nextAction17").src = "";
  document.getElementById("nextAction21").src = "";
  document.getElementById("nextAction22").src = "";
  document.getElementById("nextAction23").src = "";
  document.getElementById("nextAction24").src = "";
  document.getElementById("nextAction25").src = "";
  document.getElementById("nextAction26").src = "";
  document.getElementById("debug1").innerText = "";
  document.getElementById("debug2").innerText = "";
  document.getElementById("debug3").innerText = "";

}

function timeoutCombo() {
// Call this function at the end of event log checker to prevent combos from lingering more than they should
  clearTimeout(timeout.combo);
  timeout.combo = setTimeout(resetCombo, 12000);
}

function resetCombo() {
  delete toggle.combo;
  if (toggle.combat) {
    if (player.job == "DRG") {
      drgCombo();
    }
    else if (player.job == "NIN") {
      ninCombo();
    }
    else if (player.job == "SAM") {
      samCombo();
    }
    else if (player.job == "WAR") {
      warCombo();
    }
  }
}
