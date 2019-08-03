"use strict";

var cooldowntracker = {};     // Holds timestamps for cooldowns
var statustracker = {};       // Holds timestamps for statuses
var cooldowntime = {};        // Holds timestamps for cooldowns

var timeout = {};             // For timeout variables
var interval = {};
var countdowntimeout = {};            // Timer intervals
var nextid = {};              // Store document id - location on page for icons, etc.
var countdownid = {};
var toggle = {};              // Toggley things
var count = {};               // County things?
var previous = {};
var next = {};

var dom = {};
for (var x = 0; x < 20; x++) {
  dom["icondiv" + x] = document.getElementById("icondiv" + x); // Container for all parts
  dom["iconimgdiv" + x] = document.getElementById("iconimgdiv" + x); // Wraps icon and overlay (for animation)
  dom["iconimg" + x] = document.getElementById("iconimg" + x); // src = icon
  dom["iconcountdown" + x] = document.getElementById("iconcountdown" + x); // Countdown - separate from img
}
for (var x = 0; x < 20; x++) {
  dom["countdowndiv" + x] = document.getElementById("countdowndiv" + x); // Countdown - separate from img
  dom["countdownimgdiv" + x] = document.getElementById("countdownimgdiv" + x); // Countdown - separate from img
  dom["countdownimg" + x] = document.getElementById("countdownimg" + x); // Countdown - separate from img
  dom["countdownbar" + x] = document.getElementById("countdownbar" + x); // Countdown - separate from img
  dom["countdowntime" + x] = document.getElementById("countdowntime" + x); // Countdown - separate from img
}

dom.loadmessage = document.getElementById("loadmessage");

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
  player.ID = e.detail.id.toString(16).toUpperCase(); // player.id.toString(16) is lowercase; using "ID" to designate uppercase lettering
  player.debugJobSplit = player.debugJob.split(" "); // Creates 8 part array - use [0] to [7]

  player.tempjobDetail = {};

    if (player.job == "DNC") { // Temporary
      player.tempjobDetail.tempfourfoldfeathers = parseInt(player.debugJobSplit[0]); // 0-4
      player.tempjobDetail.tempesprit = parseInt(player.debugJobSplit[1], 16); // 0-100
      player.tempjobDetail.tempsteps = parseInt(player.debugJobSplit[6]); // 0-4
    }
  // Detects name/job/level change and clears elements

  if (previous.job != player.job || previous.level != player.level) {

    delete toggle.combo;
    resetEverything();

    addText("loadmessage", "Plugin loaded for " + player.level + player.job);

    if (player.job == "BLM") {
      addText("loadmessage", "WIP - currently assumes level 72 BLM");
      blmJobChange();
    }
    else if (player.job == "BRD") {
      brdJobChange();
    }
    else if (player.job == "DNC") {
      dncJobChange();
    }
    else if (player.job == "DRK") {
      drkJobChange();
    }
    else if (player.job == "MCH") {
      mchJobChange();
    }
    else if (player.job == "NIN") {
      ninJobChange();
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

    previous.job = player.job;
    previous.level = player.level;
    console.log("Changed to " + player.job + player.level);

  }


  // This is probably only useful for jobs that need to watch things that "tick" up or down
  if (player.job == "BLM") {
    blmPlayerChangedEvent();
  }
  else if (player.job == "BRD") {
    brdPlayerChangedEvent();
  }
  else if (player.job == "MCH") {
    mchPlayerChangedEvent();
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
  target.ID = e.detail.id.toString(16).toUpperCase(); // See player.ID above

  if (player.job == "BRD") {
    brdTargetChangedEvent();
  }
  else if (player.job == "WHM") {
    whmTargetChangedEvent();
  }
});

document.addEventListener("onInCombatChangedEvent", function(e) {
// Fires when character exits or enters combat

  count.aoe = 1;
  // Can't think of a good way to consistently reset AoE count other than this
  // Hopefully does not have a race condition with starting with AoEs...

  if (e.detail.inGameCombat) {
    toggle.combat = Date.now();
    //document.getElementById("nextdiv").className = "combat-show";
  }
  else {
    delete toggle.combat;
    //document.getElementById("nextdiv").className = "combat-hide";


    // Try to get rid of this section
    //
    // if (player.job == "BRD") {
    //   brdInCombatChangedEvent(e);
    // }
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
        brdAction();
      }
      else if (player.job == "DNC") {
        dncAction();
      }
      else if (player.job == "DRK") {
        drkAction();
      }
      else if (player.job == "MCH") {
        mchAction();
      }
      else if (player.job == "MNK") {
        mnkAction(actionLog);
      }
      else if (player.job == "NIN") {
        ninAction(actionLog);
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
        brdStatus();
      }
      else if (player.job == "DNC") {
        dncStatus();
      }
      else if (player.job == "DRK") {
        drkStatus();
      }
      else if (player.job == "MCH") {
        mchStatus(statusLog);
      }
      else if (player.job == "MNK") {
        mnkStatus(statusLog);
      }
      else if (player.job == "NIN") {
        ninStatus(statusLog);
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
        blmStart();
      }
      else if (player.job == "RDM") {
        rdmStart();
      }
    }

    else if (cancelGroups.sourceID == player.ID) {  // Status source = player
      if (player.job == "BLM") {
        blmCancel();
      }
      else if (player.job == "RDM") {
        rdmCancel();
      }
    }

    else if (actionGroups.sourceID != player.ID
    && actionGroups.sourceID.startsWith("1")) {  // Status source = other player
      raidAction();
    }
  }
});


function addCooldown(cooldownname, cooldownsourceid, cooldownrecast) {
  if (!cooldownsourceid) {
    cooldownsourceid = player.ID;
  }
  if (!cooldownrecast) {
    cooldownrecast = recast[cooldownname];
  }

  if (!cooldowntracker[cooldownname]) { // Create array if it doesn't exist yet
    cooldowntracker[cooldownname] = [cooldownsourceid, cooldownrecast + Date.now()];
  }
  else if (cooldowntracker[cooldownname].indexOf(cooldownsourceid) > -1) { // Update array if source match found
    cooldowntracker[cooldownname][cooldowntracker[cooldownname].indexOf(cooldownsourceid) + 1] = cooldownrecast + Date.now();
  }
  else { // Push new entry into array if no matching entry
    cooldowntracker[cooldownname].push(cooldownsourceid, cooldownrecast + Date.now());
  }
}

function checkCooldown(cooldownname, sourceid) {
  if (!sourceid) {
    sourceid = player.ID;
  }
  if (!cooldowntracker[cooldownname]) {
    return -1;
  }
  else if (cooldowntracker[cooldownname].indexOf(sourceid) > -1) {
    return Math.max(cooldowntracker[cooldownname][cooldowntracker[cooldownname].indexOf(sourceid) + 1] - Date.now(), -1);
  }
  else {
    return -1; // Always eturns -1 when cooldown is available
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

function checkStatus(name, id) {

  if (!id) {
    id = player.ID;
  }

  if (!statustracker[name]) {
    return -1;
  }
  else if (statustracker[name].indexOf(id) > -1) {
    return Math.max(statustracker[name][statustracker[name].indexOf(id) + 1] - Date.now(), -1);
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


function addIconNew(name) {

  let iconid = nextid[name];
  let iconfilename = icon[name];

  dom["iconimg" + iconid].src = "icon/" + iconfilename + ".png";
  dom["icondiv" + iconid].className = "icondiv icon-popin";
}

function removeIconNew(name) {

  let iconid = nextid[name];
  dom["icondiv" + iconid].className = "icondiv icon-popout";
}

function addStatusNew(name, time, id) {

  if (!duration) {
    time = duration[statusname];
  }
  if (!id) {
    id = player.ID;
  }

  if (!statustracker[name]) { // Create array if it doesn't exist yet
    statustracker[name] = [id, Date.now() + time];
  }
  else if (statustracker[name].indexOf(id) > -1) { // Update array if target match found
    statustracker[name][statustracker[name].indexOf(id) + 1] = Date.now() + time;
  }
  else { // Push new entry into array if no matching entry
    statustracker[name].push(id, Date.now() + time);
  }
}

function removeStatusNew(name, id) {

  if (!id) {
    id = player.ID;
  }

  if (!statustracker[name]) {
    statustracker[name] = [];
  }
  else if (statustracker[name].indexOf(id) > -1) {
    statustracker[name].splice(statustracker[name].indexOf(id), 2);
  }
}


//



function addIcon(nextid, actionicon) {
  dom["iconimgdiv" + nextid].className = "iconimgdiv growiconimgdiv-fadein";
  dom["iconimg" + nextid].src = "icon/" + actionicon + ".png";
  dom["icondiv" + nextid].style.display = "inline-flex";
}

function addIconBlink(nextid, actionicon) {
  dom["iconimgdiv" + nextid].className = "iconimgdiv addicondivfadeinblink";
  dom["iconimg" + nextid].src = "icon/" + actionicon + ".png";
  dom["icondiv" + nextid].style.display = "inline-flex";
}

function addIconDim(nextid, actionicon) {
  dom["iconimgdiv" + nextid].className = "iconimgdiv addicondivfadeindim";
  dom["iconimg" + nextid].src = "icon/" + actionicon + ".png";
  dom["icondiv" + nextid].style.display = "inline-flex";
}

function addIconTimeout(action, delay, nextid, actionicon) {
  clearTimeout(timeout[action]);
  timeout[action] = setTimeout(addIcon, delay, nextid, actionicon);
}

function addIconBlinkTimeout(action, delay, nextid, actionicon, countdowntime) {
  clearTimeout(timeout[action]);
  if (!countdowntime) {
    timeout[action] = setTimeout(addIconBlink, delay, nextid, actionicon);
  }
  else  {
    clearTimeout(countdowntimeout[action]);
    timeout[action] = setTimeout(addIconBlink, delay, nextid, actionicon);
    timeout[action] = setTimeout(addIconBlink, delay, nextid, actionicon);
    countdowntimeout[action] = setTimeout(addIconCountdown, delay - countdowntime, nextid, countdowntime, actionicon);
  }
}

// function addIconCountdown(nextid, countdowntime) {
//   let i = countdowntime;
//   i = i - 100; // I think it "skips" the first iteration
//   let x = setInterval(function () {
//     if (i < 0) {
//       clearInterval(x);
//       dom["iconcountdown" + nextid].innerHTML = "";
//     }
//     else if (i < 1000) {
//       dom["iconcountdown" + nextid].innerHTML = (i / 1000).toFixed(1) + "s";
//     }
//     else {
//       dom["iconcountdown" + nextid].innerHTML = Math.ceil(i / 1000) + "s"; // This appears to best mimic what happens for XIV
//     }
//     i = i - 100;
//   }, 100);
// }

function addRaidCountdownBar(name) {
  addCountdownBar(name, recast[name]);
}

function addCountdownBar(name, time, text) {
  // function addCountdownBar(actionname, countdowntime = checkCooldown(actionname), finishtext = "READY") { // Once CEF updated

  if (!time) {
    addCooldown(name);
    time = checkCooldown(name);
  }
  if (!text) {
    text = "READY";
  }

  clearInterval(interval[name]);

  let id = countdownid[name];
  let filenname = icon[name];
  time = time - 1000;

  dom["countdownimg" + id].src = "icon/" + filenname + ".png";

  interval[name] = setInterval(function () {

    if (time > 60000) {
      dom["countdowndiv" + id].className = "countdowndiv countdown-popout";
    }
    else {
      dom["countdowndiv" + id].className = "countdowndiv countdown-popin";
    }

    if (time <= 0) {
      dom["countdowntime" + id].innerHTML = text;
      clearInterval(interval[name]);
    }
    else if (time < 1000) {
      dom["countdowntime" + id].innerHTML = (time / 1000).toFixed(1);
      dom["countdownbar" + id].style.width = Math.floor(time / 100) + "px";
    }
    else {
      dom["countdowntime" + id].innerHTML = Math.ceil(time / 1000); // This appears to best mimic what happens for XIV
      dom["countdownbar" + id].style.width = (Math.floor((time - 1000) / 1000) + 10) + "px";
    }
    time = time - 100;
  }, 100);
}

function removeCountdownBar(name) {
  clearInterval(interval[name]);
  let id = countdownid[name];
  dom["countdowndiv" + id].className = "countdowndiv countdown-popout"; // Possibility of countdown getting fubared in this (left behind or something else), check later
}


function removeIcon(nextid) {
  dom["iconimgdiv" + nextid].className = "iconimgdiv fadeoutremoveicondiv"; // Possibility of countdown getting fubared in this (left behind or something else), check later
}

function addText(textid,message) {
  dom[textid].style.display = "table-row";
  dom[textid].innerText = message;
}

function removeText(textid) {
  document.getElementById(textid).style.display = "none";
}

for (var x = 0; x < 20; x++) {
  dom["icondiv" + x] = document.getElementById("icondiv" + x); // Container for all parts
  dom["iconimgdiv" + x] = document.getElementById("iconimgdiv" + x); // Wraps icon and overlay (for animation)
  dom["iconimg" + x] = document.getElementById("iconimg" + x); // src = icon
  dom["iconcountdown" + x] = document.getElementById("iconcountdown" + x); // Countdown - separate from img
}
for (var x = 0; x < 10; x++) {
  dom["countdowndiv" + x] = document.getElementById("countdowndiv" + x); // Countdown - separate from img
  dom["countdownimgdiv" + x] = document.getElementById("countdownimgdiv" + x); // Countdown - separate from img
  dom["countdownimg" + x] = document.getElementById("countdownimg" + x); // Countdown - separate from img
  dom["countdownbar" + x] = document.getElementById("countdownbar" + x); // Countdown - separate from img
  dom["countdowntime" + x] = document.getElementById("countdowntime" + x); // Countdown - separate from img
}

function resetEverything() {

  let x = 0;

  for (x = 0; x < 20; x++) {
    dom["icondiv" + x].className = "icondiv";
  }

  for (x = 0; x < 10; x++) {
    dom["countdowndiv" + x].className = "countdowndiv";
  }

  let property = "";
  for (property in timeout) {
    if (timeout.hasOwnProperty(property)) {
      clearTimeout(timeout[property]);
    }
  }
  for (property in interval) {
    if (interval.hasOwnProperty(property)) {
      clearInterval(interval[property]);
    }
  }
}
