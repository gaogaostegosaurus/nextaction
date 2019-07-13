"use strict";

var dom = {};
var recast = {};
var cooldowntracker = {};     // Holds timestamps for cooldowns
var statustracker = {};       // Holds timestamps for statuses
var cooldowntime = {};        // Holds timestamps for cooldowns
var statustime = {};          // Holds timestamps for statuses
var statuslength = {};        // Holds durations... probably should rename it to durations...
var duration = {};            // OK I DID IT
var gauge = {};
var buffertime = {};

var timeout = {};             // For timeout variables
var nextid = {};                  // Store document id - location on page for icons, etc.
var icon = {};                // Store icon name
var toggle = {};              // Toggley things
var count = {};               // County things?
var previous = {};
var next = {};

// var statusList = {};

var dom = {};
for (var x = 0; x < 30; x++) {
  dom["next" + x] = document.getElementById("next" + x);
  dom["icon" + x] = document.getElementById("icon" + x);
}
for (var x = 0; x < 10; x++) {
  dom["debug" + x] = document.getElementById("debug" + x);
}

var player = {};
var target = {};
var actionList = {};

var actionRegExp = new RegExp(' 1[56]:([\\dA-F]{8}):([ -~]+?):[\\dA-F]{1,4}:([ -~]+?):([\\dA-F]{8}):([ -~]+?):([\\dA-F]{1,8}):');
var actionLog;
var actionGroups = {};

var statusRegExp = new RegExp(' 1[AE]:([\\dA-F]{8}):([ -~]+?) (gains|loses) the effect of ([ -~]+?) from ([ -~]+?)(?: for )?(\\d*\\.\\d*)?(?: Seconds)?\\.');
var statusLog;
var statusGroups = {};

var startRegExp =  new RegExp(' 14:[\\dA-F]{1,4}:([ -~]+?) starts using ([ -~]+?) on ([ -~]+?)\\.');
var startLog;
var startGroups = {};

var cancelRegExp = new RegExp(' 17:([\\dA-F]{8}):([ -~]+?):[\\dA-F]{1,4}:([ -~]+?):Cancelled:');
var cancelLog;
var cancelGroups = {};

// Note to self: using new RegExp() here because strings not supported otherwise - don't know if I will put them in later but keeping it like this for now.

// onPlayerChangedEvent: fires whenever player change detected (including HP, MP, other resources, positions, etc.)
document.addEventListener("onPlayerChangedEvent", function(e) {

  player = e.detail;
  player.ID = e.detail.nextid.toString(16).toUpperCase(); // player.nextid.toString(16) is lowercase; using "ID" to designate uppercase lettering

  // Detects name/job/level change and clears elements
  if (previous.name != player.name || previous.job != player.job || previous.level != player.level) {
    delete toggle.combo;
    clearElements();

    addText("loadmessage", "Plugin loaded for " + player.level + player.job);

    if (player.job == "BLM") {
      blmJobChange();
    }
    else if (player.job == "BRD") {
      // actionRegExp = new RegExp(' 1[56]:([\\dA-F]{8}):(' + player.name + '):[\\dA-F]{2,8}:(' + actionList.brd.join("|") + '):([\\dA-F]{2,8}):([^:]*):([\\dA-F]{1,8}):');
      // statusRegExp = new RegExp(' 1[AE]:([\\dA-F]{8}):(.*) (gains|loses) the effect of (' + statusList.brd.join("|") + ') from (' + player.name + ')(?: for )?(\\d*\\.\\d*)?(?: Seconds)?\\.');
    }
    else if (player.job == "MCH") {
      mchJobChange();
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

  }

  previous.name = player.name;
  previous.job = player.job;
  previous.level = player.level;

  // This is probably only useful for jobs that need to watch things that "tick" up or down
  if (player.job == "BLM") {
    blmPlayerChangedEvent(e);
  }
  if (player.job == "BRD") {
    brdPlayerChangedEvent(e);
  }
  else if (player.job == "RDM") {
    rdmPlayerChangedEvent();
  }
  else if (player.job == "WHM") {
    whmPlayerChangedEvent();
  }

});

document.addEventListener('onTargetChangedEvent', function(e) {
  target = e.detail;
  target.ID = e.detail.nextid.toString(16).toUpperCase(); //

  if (player.job == "WHM") {
    whmTargetChangedEvent();
  }
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
    else if (player.job == "WAR") {
      warInCombatChangedEvent(e);
    }
  }
});

document.addEventListener("onLogEvent", function(e) { // Fires on log event

  let l = e.detail.logs.length;

  for (let i = 0; i < l; i++) {

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
      else if (player.job == "MCH") {
        mchAction();
      }
      else if (player.job == "MNK") {
        mnkAction(actionLog);
      }
      else if (player.job == "RDM") {
        rdmAction();
      }
      else if (player.job == "SAM") {
        samAction(actionLog);
      }
      else if (player.job == "WAR") {
        warAction(actionLog);
      }
      else if (player.job == "WHM") {
        whmAction();
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
      else if (player.job == "MCH") {
        mchStatus(statusLog);
      }
      else if (player.job == "MNK") {
        mnkStatus(statusLog);
      }
      else if (player.job == "RDM") {
        rdmStatus();
      }
      else if (player.job == "SAM") {
        samStatus(statusLog);
      }
      else if (player.job == "WAR") {
        warStatus(statusLog);
      }
      else if (player.job == "WHM") {
        whmStatus();
      }
    }

    else if (startGroups.sourcename == player.name) {  // Status source = player
      if (player.job == "BLM") {
        blmStart(statusLog);
      }
    }

    else if (cancelGroups.sourceID == player.ID) {  // Status source = player
      if (player.job == "BLM") {
        blmCancel(statusLog);
      }
    }

  }
});


function addCooldown(cooldownname, sourceid, recast) {

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
