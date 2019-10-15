"use strict";

// Use https://quisquous.github.io/cactbot/ui/test/test.html to figure out random values


var cooldowntracker = {};     // Holds timestamps for cooldowns
var statustracker = {};       // Holds timestamps for statuses
var cooldowntime = {};        // Holds timestamps for cooldowns
var bufferTime = 0;
var countdownIntervalTime = 100;

var timeout = {};             // For timeout variables
var interval = {};
var nextid = {};              // Store document id - location on page for icons, etc.
var countdownid = {};
var toggle = {};              // Toggley things
var count = {};               // County things?
var potency = {};
var previous = {};
var next = {};

// Set up doms

var dom = {};
for (var x = 0; x < 30; x++) {
  dom["icondiv" + x] = document.getElementById("icondiv" + x); // Container for all parts
  dom["iconimgdiv" + x] = document.getElementById("iconimgdiv" + x); // Wraps icon and overlay (for animation)
  dom["iconimg" + x] = document.getElementById("iconimg" + x); // src = icon
  dom["iconcountdown" + x] = document.getElementById("iconcountdown" + x); // Countdown - separate from img
}
for (var x = 0; x < 40; x++) {
  dom["countdowndiv" + x] = document.getElementById("countdowndiv" + x); // Countdown - separate from img
  dom["countdownimgdiv" + x] = document.getElementById("countdownimgdiv" + x); // Countdown - separate from img
  dom["countdownimg" + x] = document.getElementById("countdownimg" + x); // Countdown - separate from img
  dom["countdownbar" + x] = document.getElementById("countdownbar" + x); // Countdown - separate from img
  dom["countdowntime" + x] = document.getElementById("countdowntime" + x); // Countdown - separate from img
}

var player = {};
var target = {};
var actionList = {};

var actionRegExp = new RegExp(' 1[56]:([\\dA-F]{8}):([ -~]+?):[\\dA-F]{1,4}:([ -~]+?):([\\dA-F]{8}):([ -~]+?):([\\dA-F]{1,8}):');
var actionLog;
var actionGroups = {};

var effectRegExp = new RegExp(' 1[AE]:([\\dA-F]{8}):([ -~]+?) (gains|loses) the effect of ([ -~]+?) from ([ -~]+?)(?: for )?(\\d*\\.\\d*)?(?: Seconds)?\\.');
var statusLog;
var statusGroups = {};

var startsusingRegExp =  new RegExp(' 14:[\\dA-F]{1,4}:([ -~]+?) starts using ([ -~]+?) on ([ -~]+?)\\.');
var startLog;
var startGroups = {};

var cancelledRegExp = new RegExp(' 17:([\\dA-F]{8}):([ -~]+?):[\\dA-F]{1,4}:([ -~]+?):Cancelled:');
var cancelLog;
var cancelGroups = {};

// Note to self: using new RegExp() here because strings not supported otherwise - don't know if I will put them in later but keeping it like this for now.

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
    statusLog = e.detail.logs[i].match(effectRegExp);
    startLog  = e.detail.logs[i].match(startsusingRegExp);
    cancelLog = e.detail.logs[i].match(cancelledRegExp);

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
        blmAction();
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
      else if (player.job == "GNB") {
        gnbAction();
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
      else if (player.job == "PLD") {
        pldAction();
      }
      else if (player.job == "RDM") {
        rdmAction();
      }
      else if (player.job == "SAM") {
        samAction(actionLog);
      }
      else if (player.job == "SCH") {
        schAction();
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
        blmStatus();
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
      else if (player.job == "GNB") {
        gnbStatus();
      }
      else if (player.job == "MCH") {
        mchStatus();
      }
      else if (player.job == "MNK") {
        mnkStatus();
      }
      else if (player.job == "NIN") {
        ninStatus();
      }
      else if (player.job == "PLD") {
        pldStatus();
      }
      else if (player.job == "RDM") {
        rdmEffect();
      }
      else if (player.job == "SAM") {
        samStatus();
      }
      else if (player.job == "SCH") {
        schStatus();
      }
      else if (player.job == "WAR") {
        warStatus();
      }
      else if (player.job == "WHM") {
        whmStatus();
      }
    }

    else if (startGroups.sourcename == player.name) {  // Status source = player
      if (player.job == "BLM") {
        blmStartsUsing();
      }
      else if (player.job == "RDM") {
        rdmStartsUsing();
      }
    }

    else if (cancelGroups.sourceID == player.ID) {  // Status source = player
      if (player.job == "BLM") {
        blmCancelled();
      }
      else if (player.job == "RDM") {
        rdmCancelled();
      }
    }

    else if (actionGroups.sourceID != player.ID
    && actionGroups.sourceID.startsWith("1")) {  // Status source = other player
      raidAction();
    }
  }
});

// onPlayerChangedEvent: fires whenever player change detected (including HP, MP, other resources, positions, etc.)
document.addEventListener("onPlayerChangedEvent", function(e) {

  player = e.detail;
  player.ID = e.detail.id.toString(16).toUpperCase(); // player.id.toString(16) is lowercase; using "ID" to designate uppercase lettering
  player.debugJobSplit = player.debugJob.split(" "); // Creates 8 part array - use [0] to [7]

  player.tempjobDetail = {};

  if (player.job == "DNC") { // Temporary
    player.tempjobDetail.tempfourfoldfeathers = parseInt(player.debugJobSplit[0]); // 0-4
    player.tempjobDetail.tempesprit = parseInt(player.debugJobSplit[1], 16); // 0-100
    player.tempjobDetail.step1 = parseInt(player.debugJobSplit[2]); // 1 is  Emboite, 2 is Entrechat, 3 is Jete, 4 is Pirouette
    player.tempjobDetail.step2 = parseInt(player.debugJobSplit[3]);
    player.tempjobDetail.step3 = parseInt(player.debugJobSplit[4]);
    player.tempjobDetail.step4 = parseInt(player.debugJobSplit[5]);
    player.tempjobDetail.steps = parseInt(player.debugJobSplit[6]); // 0-4
  }
  else if (player.job == "GNB") {
    player.tempjobDetail.cartridge = parseInt(player.debugJobSplit[0]); // 0-2
  }
  else if (player.job == "SCH") {
    player.tempjobDetail.tempaetherflow = parseInt(player.debugJobSplit[2]); // 0-3
    player.tempjobDetail.tempfaerie = parseInt(player.debugJobSplit[3], 16); // 0-100
  }
  else if (player.job == "WHM") {
    player.tempjobDetail.bloodlily = parseInt(player.debugJobSplit[5]); // 0-3
  }
  // Detects name/job/level change and clears elements

  if (previous.job != player.job || previous.level != player.level) {

    clearUI();
    clearTimers();
    loadInitialState();

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
  else if (player.job == "MNK") {
    mnkPlayerChangedEvent();
  }
  // else if (player.job == "RDM") {
  //   rdmPlayerChangedEvent();
  // }
  else if (player.job == "WHM") {
    whmPlayerChangedEvent();
  }

});

document.addEventListener('onTargetChangedEvent', function(e) {
  target = e.detail;
  target.ID = e.detail.id.toString(16).toUpperCase(); // See player.ID above

  if (player.job == "BLM") {
    blmTargetChangedEvent();
  }
  else if (player.job == "BRD") {
    brdTargetChangedEvent();
  }
  else if (player.job == "SCH") {
    schTargetChangedEvent();
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
    document.getElementById("nextdiv").className = "next-box next-show";
  }
  else {
    delete toggle.combat;
    document.getElementById("nextdiv").className = "next-box next-hide";


    // Try to get rid of this section
    //
    // if (player.job == "BRD") {
    //   brdInCombatChangedEvent(e);
    // }
  }
});

document.addEventListener("onZoneChangedEvent", function(e) {
  clearUI();
  clearTimers();
  loadInitialState();
});

document.addEventListener("onPartyWipe", function(e) {
  clearUI();
  clearTimers();
  loadInitialState();
});

// This function looks old - replace when able
function addIconBlinkTimeout(action, delay, nextid, actionicon, countdowntime) {
  clearTimeout(timeout[action]);
  if (!countdowntime) {
    timeout[action] = setTimeout(addIcon, delay, action);
  }
  else  {
    clearTimeout(countdowntimeout[action]);
    timeout[action] = setTimeout(addIconBlink, delay, nextid, actionicon);
    timeout[action] = setTimeout(addIconBlink, delay, nextid, actionicon);
    countdowntimeout[action] = setTimeout(addIconCountdown, delay - countdowntime, nextid, countdowntime, actionicon);
  }
}

function setupRegExp() {
  actionRegExp = new RegExp(' 1[56]:([\\dA-F]{8}):([ -~]+?):[\\dA-F]{1,4}:([ -~]+?):([\\dA-F]{8}):([ -~]+?):([\\dA-F]{1,8}):');
  effectRegExp = new RegExp(' 1[AE]:([\\dA-F]{8}):([ -~]+?) (gains|loses) the effect of ([ -~]+?) from ([ -~]+?)(?: for )?(\\d*\\.\\d*)?(?: Seconds)?\\.');
  startsusingRegExp =  new RegExp(' 14:[\\dA-F]{1,4}:([ -~]+?) starts using ([ -~]+?) on ([ -~]+?)\\.');
  cancelledRegExp = new RegExp(' 17:([\\dA-F]{8}):([ -~]+?):[\\dA-F]{1,4}:([ -~]+?):Cancelled:');
}

function addRecast(name, time, id) {

  if (time === undefined) {
    time = recast[name];
  }
  if (id === undefined) {
    id = player.ID;
  }

  if (!cooldowntracker[name]) { // Create array if it doesn't exist yet
    cooldowntracker[name] = [id, time + Date.now()];
  }
  else if (cooldowntracker[name].indexOf(id) > -1) { // Update array if source match found
    cooldowntracker[name][cooldowntracker[name].indexOf(id) + 1] = time + Date.now();
  }
  else { // Push new entry into array if no matching entry
    cooldowntracker[name].push(id, time + Date.now());
  }
}

function checkRecast(name, id) {
  if (id === undefined) {
    id = player.ID;
  }
  if (!cooldowntracker[name]) {
    return -1;
  }
  else if (cooldowntracker[name].indexOf(id) > -1) {
    return Math.max(cooldowntracker[name][cooldowntracker[name].indexOf(id) + 1] - Date.now(), -1);
  }
  else {
    return -1; // Always eturns -1 when cooldown is available
  }
}

function addStatus(name, time, id) {

  if (time === undefined) {
    time = duration[name];
  }
  if (id == undefined) {
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

function checkStatus(name, id) {

  if (id === undefined) {
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

function removeStatus(name, id) {

  if (id === undefined) {
    id = player.ID;
  }

  if (!statustracker[name]) {
    statustracker[name] = [];
  }
  else if (statustracker[name].indexOf(id) > -1) {
    statustracker[name].splice(statustracker[name].indexOf(id), 2);
  }
}

function addIcon(name, img, effect) {

  if (img === undefined) {
    img = name;
  }
  if (effect === undefined) {
    effect == "";
  }

  dom["iconimg" + nextid[name]].src = "icon/" + icon[img] + ".png";
  dom["icondiv" + nextid[name]].className = "icondiv icon-add " + effect;
}

function addIconDelay(name, delay, img, effect) {
  clearTimeout(timeout[name]);
  timeout[name] = setTimeout(addIcon, delay, name, img, effect);
}

function removeIcon(name) {
  dom["icondiv" + nextid[name]].className = "icondiv icon-remove";
}

function addCountdownBar(name, time, text) {
// function addCountdownBar(actionname, countdowntime = checkRecast(actionname), finishtext = "READY") { Once CEF updated

  dom["countdownimg" + countdownid[name]].src = "icon/" + icon[name] + ".png";

  if (time === undefined) {  // Optional parameter
    // addRecast(name);  // Adding this to the function ended up being really confusing
    time = recast[name];
  }
  time = time - 1000;  // This appears to make it match better to what's on screen?

  if (text === undefined) {  // Optional parameter
    text = "READY";
  }
  else if (text == "icon") {
    text == "addIcon";
    removeIcon(name);  // If point is to display icon at end of countdown, remove it first
  }
  else if (text == "remove") {
    text == "removeCountdownBar";
    removeIcon(name);  // If point is to display icon at end of countdown, remove it first
  }
  else if (text == "removeCountdownBar" || text == "addIcon") {
    removeIcon(name);  // If point is to display icon at end of countdown, remove it first
  }

  // Add or remove icons
  if (text == "addIcon"
  && time <= 1000) {
    dom["countdowndiv" + countdownid[name]].className = "countdowndiv countdown-remove";
  }
  if (text == "removeCountdownBar"
  && time <= 0) {
    dom["countdowndiv" + countdownid[name]].className = "countdowndiv countdown-remove";
  }
  else {
    dom["countdowndiv" + countdownid[name]].className = "countdowndiv countdown-add";
  }

  // Style bars 20 to 39 to set apart from "personal" bars
  if (countdownid[name] >= 20) {
    dom["countdowndiv" + countdownid[name]].style.opacity = "0.5";
    // dom["countdownbar" + countdownid[name]].style.color = "green";
  }

  clearInterval(interval[name]);

  // Countdown animation function starts here
  interval[name] = setInterval(function () {

    // Show icons a little bit early
    if (time < 1000) {
      if (text == "addIcon") {
        addIcon(name);
      }
    }

    else if (time < 5000) {
      if (dom["countdownbar" + countdownid[name]].style.backgroundColor != "red") {
        dom["countdownbar" + countdownid[name]].style.backgroundColor = "red";
      }
    }
    else if (time < 10000) {
      if (dom["countdownbar" + countdownid[name]].style.backgroundColor != "orange") {
        dom["countdownbar" + countdownid[name]].style.backgroundColor = "orange";
      }
    }
    else if (time < 30000) {
      if (dom["countdownbar" + countdownid[name]].style.backgroundColor != "yellow") {
        dom["countdownbar" + countdownid[name]].style.backgroundColor = "yellow";
      }
    }
    else {
      if (dom["countdownbar" + countdownid[name]].style.backgroundColor != "white") {
        dom["countdownbar" + countdownid[name]].style.backgroundColor = "white";
      }
    }

    // Countdown bar animation
    if (time <= 0) {

      // Cleanup when time <= 0

      dom["countdownbar" + countdownid[name]].style.width = "0px";  // Time 0 = bar width 0
      clearInterval(interval[name]);

      if (text == "removeCountdownBar" || text == "addIcon") {
        removeCountdownBar(name)
      }
      else {
        dom["countdowntime" + countdownid[name]].innerHTML = text;
      }
      // console.log("Interval should be closed now - writing log because of possible coding error");
    }
    else if (time < 1000) {
      // Special animation when remaining time is low
      dom["countdowntime" + countdownid[name]].innerHTML = (time / 1000).toFixed(1);
      dom["countdownbar" + countdownid[name]].style.width = Math.floor(time / 100) + "px";
    }
    else {
      dom["countdowntime" + countdownid[name]].innerHTML = Math.ceil(time / 1000);  // This appears to best mathematically mimic the displayed values for XIV...
      dom["countdownbar" + countdownid[name]].style.width = Math.min(Math.floor((time - 1000) / 1000) + 10, 70) + "px";  // Sets a max bar size
    }

    time = time - countdownIntervalTime;  // Tick down every 100 ms

  }, countdownIntervalTime);

}

function stopCountdownBar(name) {
  clearInterval(interval[name]);
}

function removeCountdownBar(name) {
  clearInterval(interval[name]);
  let id = countdownid[name];
  dom["countdowndiv" + id].className = "countdowndiv countdown-remove"; // Possibility of countdown getting fubared in this (left behind or something else), check later
}

function loadInitialState() {

  delete toggle.combo;

  if (player.job == "BLM") {
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
  else if (player.job == "GNB") {
    gnbJobChange();
  }
  else if (player.job == "MCH") {
    mchJobChange();
  }
  else if (player.job == "MNK") {
    mnkJobChange();
  }
  else if (player.job == "NIN") {
    ninJobChange();
  }
  else if (player.job == "PLD") {
    pldJobChange();
  }
  else if (player.job == "RDM") {
    rdmJobChange();
  }
  else if (player.job == "SAM") {
    samJobChange();
  }
  else if (player.job == "SCH") {
    schJobChange();
  }
  else if (player.job == "WAR") {
    warJobChange();
  }
  else if (player.job == "WHM") {
    whmJobChange();
  }
}

function clearUI() {
  let x = 0;
  for (x = 0; x < 30; x++) {
    dom["icondiv" + x].className = "icondiv icon-remove";
  }
  for (x = 0; x < 40; x++) {
    dom["countdowndiv" + x].className = "countdowndiv countdown-remove";
  }
}

function clearTimers() {
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
