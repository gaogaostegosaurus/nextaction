import * as rdm from './rdm';

// Use https://quisquous.github.io/cactbot/ui/test/test.html to figure out random values
const priorityArray = [];
const actionArray = [];
const cooldownArray = [];

const removeAnimationTime = 1000;
let cooldownTracker = {}; // Holds timestamps for cooldowns
let effectTracker = {}; // Holds timestamps for statuses
let cooldowntime = {}; // Holds timestamps for cooldowns
let bufferTime = 0;
const countdownIntervalTime = 100;

const timeout = {}; // For timeout variables
const interval = {};
const nextid = {}; // Store document id - location on page for icons, etc.
const countdownid = {};
const toggle = {}; // Toggley things
const count = {}; // County things?
let potency = {};
let previous = {};
let next = {};

count.targets = 1;
const countTargetsTime = 100; // Determines how many things multi-line attack hits

// Set up doms

const dom = {};
for (let x = 0; x < 30; x += 1) {
  dom[`icondiv${x}`] = document.getElementById("icondiv" + x); // Container for all parts
  dom[`iconimgdiv${x}`] = document.getElementById("iconimgdiv" + x); // Wraps icon and overlay (for animation)
  dom[`iconimg${x}`] = document.getElementById("iconimg" + x); // src = icon
  dom[`iconcountdown${x}`] = document.getElementById("iconcountdown" + x); // Countdown - separate from img
}
for (let x = 0; x < 40; x += 1) {
  dom[`countdowndiv${x}`] = document.getElementById("countdowndiv" + x); // Countdown - separate from img
  dom[`countdownimgdiv${x}`] = document.getElementById("countdownimgdiv" + x); // Countdown - separate from img
  dom[`countdownimg${x}`] = document.getElementById("countdownimg" + x); // Countdown - separate from img
  dom[`countdownbar${x}`] = document.getElementById("countdownbar" + x); // Countdown - separate from img
  dom[`countdowntime${x}`] = document.getElementById("countdowntime" + x); // Countdown - separate from img
}

let player = {};
let target = {};
let actionList = {};

const gcdCalculation = ({
  speed,
  time = 2500, // GCD in ms
} = {}) => {
  const base = 380;
  const delta = speed - base;
  const levelMod = 1 / 3300;

  return Math.floor(Math.floor(100 * 100 * (Math.floor(time * (1000
    - Math.floor(130 * delta * levelMod)) * 0.001) * 0.001)) * 0.01);
};

addOverlayListener('onLogEvent', (e) => { // Fires on log event
  const statsRegExp = new RegExp(' 0C:Player Stats: (?<jobID>[\\d]+):(?<strength>[\\d]+):(?<dexterity>[\\d]+):(?<vitality>[\\d]+):(?<intelligence>[\\d]+):(?<mind>[\\d]+):(?<piety>[\\d]+):(?<attackPower>[\\d]+):(?<directHitRate>[\\d]+):(?<criticalHit>[\\d]+):(?<attackMagicPotency>[\\d]+):(?<healingMagicPotency>[\\d]+):(?<determination>[\\d]+):(?<skillSpeed>[\\d]+):(?<spellSpeed>[\\d]+):0:(?<tenacity>[\\d]+)');
  const actionRegExp = new RegExp(' (?<logType>1[56]):(?<sourceID>[\\dA-F]{8}):(?<sourceName>[a-zA-Z\']+? [a-zA-Z\']+?):(?<actionID>[\\dA-F]{1,8}):(?<actionName>[ -~]+?):(?<targetID>[\\dA-F]{8}):(?<targetName>[ -~]+?):(?<result>[\\dA-F]{1,8}):');
  const effectRegExp = new RegExp(' (?<logType>1[AE]):(?<targetID>[\\dA-F]{8}):(?<targetName>[ -~]+?) (?<gainsLoses>gains|loses) the effect of (?<effectName>[ -~]+?) from (?<sourceName>[a-zA-Z\']+? [a-zA-Z\']+?)(?: for )?(?<effectDuration>\\d*\\.\\d*)?(?: Seconds)?\\.');
  const startsUsingRegExp = new RegExp(' 14:(?<actionID>[\\dA-F]{1,4}):(?<sourceName>[a-zA-Z\']+? [a-zA-Z\']+?) starts using (?<actionName>[ -~]+?) on (?<targetName>[ -~]+?)\\.');
  const cancelledRegExp = new RegExp(' 17:(?<sourceID>[\\dA-F]{8}):(?<sourceName>[a-zA-Z\']+? [a-zA-Z\']+?):(?<actionID>[\\dA-F]{1,4}):(?<actionName>[ -~]+?):Cancelled:');
  const l = e.detail.logs.length;

  for (let i = 0; i < l; i += 1) {
    const actionMatch = e.detail.logs[i].match(actionRegExp);
    const effectMatch = e.detail.logs[i].match(effectRegExp);
    const startsMatch = e.detail.logs[i].match(startsUsingRegExp);
    const cancelledMatch = e.detail.logs[i].match(cancelledRegExp);
    const statsMatch = e.detail.logs[i].match(statsRegExp);

    if (actionMatch && actionMatch.groups.sourceID === player.ID) { // Status source = player
      if (player.job === 'BLM') {
        blmAction();
      } else if (player.job === 'BRD') {
        brdAction();
      } else if (player.job == "DNC") {
        dncAction();
      } else if (player.job === "DRK") {
        drkAction();
      } else if (player.job === "GNB") {
        gnbAction();
      } else if (player.job === "MCH") {
        mchAction();
      } else if (player.job === "MNK") {
        mnkAction(actionMatch);
      } else if (player.job === "NIN") {
        ninAction(actionMatch);
      } else if (player.job === "PLD") {
        pldAction();
      } else if (player.job === 'RDM') {
        rdm.onAction(actionMatch);
      } else if (player.job === 'SAM') {
        samAction(actionMatch);
      } else if (player.job === "SCH") {
        schAction();
      } else if (player.job === 'WAR') {
        warAction(actionMatch);
      } else if (player.job === 'WHM') {
        whmAction();
      }
    } else if (effectMatch && effectMatch.groups.sourceName === player.name) {
      if (player.job === "BLM") {
        blmStatus();
      }
      else if (player.job === "BRD") {
        brdStatus();
      }
      else if (player.job === "DNC") {
        dncStatus();
      }
      else if (player.job === "DRK") {
        drkStatus();
      }
      else if (player.job === "GNB") {
        gnbStatus();
      }
      else if (player.job === "MCH") {
        mchStatus();
      }
      else if (player.job === "MNK") {
        mnkStatus();
      }
      else if (player.job === "NIN") {
        ninStatus();
      }
      else if (player.job === "PLD") {
        pldStatus();
      }
      else if (player.job === 'RDM') {
        rdm.onEffect(effectMatch);
      } else if (player.job === "SAM") {
        samStatus();
      }
      else if (player.job === "SCH") {
        schStatus();
      }
      else if (player.job === "WAR") {
        warStatus();
      }
      else if (player.job === "WHM") {
        whmStatus();
      }
    }

    else if (startsMatch && startsMatch.groups.sourceName === player.name) { // Status source = player
      if (player.job === "BLM") {
        blmStartsUsing();
      } else if (player.job === 'RDM') {
        rdm.onStartsUsing();
      }
    }

    else if (cancelledLog && cancelledLog.groups.sourceID === player.ID) { // Status source = player
      if (player.job === "BLM") {
        blmCancelled();
      }
      else if (player.job === "RDM") {
        rdm.onCancelled();
      }
    }

    else if (statsLog) {
      // Uncomment to check
      const whatever = gcdCalculation({
        speed: Math.max(statsLog.groups.skillSpeed, statsLog.groups.spellSpeed),
      });
      console.log(whatever);
    }

    // else if (actionLog && actionLog.groups.sourceID != player.ID
    // && actionLog.groups.sourceID.startsWith("1")) {  // Status source = other player
    //   raidAction();
    // }
  }
});

// onPlayerChangedEvent:
// fires whenever player change detected (including HP, MP, other resources, positions, etc.)
addOverlayListener('onPlayerChangedEvent', (e) => {
  player = e.detail;
  player.ID = e.detail.id.toString(16).toUpperCase();
  // player.id.toString(16) is lowercase; using "ID" to designate uppercase lettering
  player.debugJobSplit = player.debugJob.split(' '); // Creates 8 part array - use [0] to [7]

  player.tempjobDetail = {};

  if (player.job === 'DNC') { // Temporary
    player.tempjobDetail.tempfourfoldfeathers = parseInt(player.debugJobSplit[0], 16); // 0-4
    player.tempjobDetail.tempesprit = parseInt(player.debugJobSplit[1], 16); // 0-100

    // Steps
    // 1 is  Emboite, 2 is Entrechat, 3 is Jete, 4 is Pirouette
    player.tempjobDetail.step1 = parseInt(player.debugJobSplit[2], 16);
    player.tempjobDetail.step2 = parseInt(player.debugJobSplit[3], 16);
    player.tempjobDetail.step3 = parseInt(player.debugJobSplit[4], 16);
    player.tempjobDetail.step4 = parseInt(player.debugJobSplit[5], 16);
    player.tempjobDetail.steps = parseInt(player.debugJobSplit[6], 16); // 0-4
  } else if (player.job == "GNB") {
    player.tempjobDetail.cartridge = parseInt(player.debugJobSplit[0]); // 0-2
  } else if (player.job == "SCH") {
    player.tempjobDetail.tempaetherflow = parseInt(player.debugJobSplit[2]); // 0-3
    player.tempjobDetail.tempfaerie = parseInt(player.debugJobSplit[3], 16); // 0-100
  } else if (player.job == "WHM") {
    player.tempjobDetail.bloodlily = parseInt(player.debugJobSplit[5]); // 0-3
  }
  // Detects name/job/level change and clears elements
  if (previous.job != player.job || previous.level != player.level) {

    clearUI();
    clearTimers();
    loadInitialState();

    previous.job = player.job;
    previous.level = player.level;
    console.log(`Changed to ${player.job}${player.level}`);
  }

  // This is probably only useful for jobs that need to watch things that "tick" up or down
  if (player.job === 'BLM') {
    blmPlayerChangedEvent();
  } else if (player.job === 'BRD') {
    brdPlayerChangedEvent();
  } else if (player.job === 'MCH') {
    mchPlayerChangedEvent();
  } else if (player.job === 'MNK') {
    mnkPlayerChangedEvent();
  } else if (player.job === 'WHM') {
    whmPlayerChangedEvent();
  }

  // Possible use for later
  // else if (player.job == "RDM") {
  //   rdmPlayerChangedEvent();
  // }

});

addOverlayListener('onTargetChangedEvent', (e) => {
  target = e.detail;
  target.ID = e.detail.id.toString(16).toUpperCase(); // See player.ID above

  if (player.job === 'BLM') {
    blmTargetChangedEvent();
  } else if (player.job === 'BRD') {
    brdTargetChangedEvent();
  } else if (player.job === 'SCH') {
    schTargetChangedEvent();
  } else if (player.job === 'WHM') {
    whmTargetChangedEvent();
  }
});

addOverlayListener('onInCombatChangedEvent', (e) => {
// Fires when character exits or enters combat

  count.targets = 1;
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

addOverlayListener("onZoneChangedEvent", function(e) {
  clearUI();
  clearTimers();
  loadInitialState();
});

addOverlayListener("onPartyWipe", function(e) {
  clearUI();
  clearTimers();
  loadInitialState();
});

// This function looks old - replace when able
// function addIconBlinkTimeout(action, delay, nextid, actionicon, countdowntime) {
//   clearTimeout(timeout[action]);
//   if (!countdowntime) {
//     timeout[action] = setTimeout(addIcon, delay, action);
//   }
//   else  {
//     clearTimeout(countdowntimeout[action]);
//     timeout[action] = setTimeout(addIconBlink, delay, nextid, actionicon);
//     timeout[action] = setTimeout(addIconBlink, delay, nextid, actionicon);
//     countdowntimeout[action] = setTimeout(addIconCountdown, delay - countdowntime, nextid, countdowntime, actionicon);
//   }
// }

function setupRegExp() {
  actionRegExp = new RegExp(' 1[56]:([\\dA-F]{8}):([ -~]+?):[\\dA-F]{1,4}:([ -~]+?):([\\dA-F]{8}):([ -~]+?):([\\dA-F]{1,8}):');
  effectRegExp = new RegExp(' 1[AE]:([\\dA-F]{8}):([ -~]+?) (gains|loses) the effect of ([ -~]+?) from ([ -~]+?)(?: for )?(\\d*\\.\\d*)?(?: Seconds)?\\.');
  startsRegExp = new RegExp(' 14:[\\dA-F]{1,4}:([ -~]+?) starts using ([ -~]+?) on ([ -~]+?)\\.');
  cancelledRegExp = new RegExp(' 17:([\\dA-F]{8}):([ -~]+?):[\\dA-F]{1,4}:([ -~]+?):Cancelled:');
}

// Calculate level 80 GCD length in ms
// Formula from Theoryjerks site

function addRecast(name, time, id) {

  if (time === undefined) {
    time = recast[name];
  }
  if (id === undefined) {
    id = player.ID;
  }

  if (!cooldownTracker[name]) { // Create array if it doesn't exist yet
    cooldownTracker[name] = [id, time + Date.now()];
  }
  else if (cooldownTracker[name].indexOf(id) > -1) { // Update array if source match found
    cooldownTracker[name][cooldownTracker[name].indexOf(id) + 1] = time + Date.now();
  }
  else { // Push new entry into array if no matching entry
    cooldownTracker[name].push(id, time + Date.now());
  }
}

function checkRecast(name, id) {
  if (id === undefined) {
    id = player.ID;
  }
  if (!cooldownTracker[name]) {
    return -1;
  }
  else if (cooldownTracker[name].indexOf(id) > -1) {
    return Math.max(cooldownTracker[name][cooldownTracker[name].indexOf(id) + 1] - Date.now(), -1);
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

  if (!effectTracker[name]) { // Create array if it doesn't exist yet
    effectTracker[name] = [id, Date.now() + time];
  }
  else if (effectTracker[name].indexOf(id) > -1) { // Update array if target match found
    effectTracker[name][effectTracker[name].indexOf(id) + 1] = Date.now() + time;
  }
  else { // Push new entry into array if no matching entry
    effectTracker[name].push(id, Date.now() + time);
  }
}

function checkStatus(name, id) {

  if (id === undefined) {
    id = player.ID;
  }

  if (!effectTracker[name]) {
    return -1;
  }
  else if (effectTracker[name].indexOf(id) > -1) {
    return Math.max(effectTracker[name][effectTracker[name].indexOf(id) + 1] - Date.now(), -1);
  }
  else {
    return -1;
  }
}

function removeStatus(name, id) {

  if (id === undefined) {
    id = player.ID;
  }

  if (!effectTracker[name]) {
    effectTracker[name] = [];
  }
  else if (effectTracker[name].indexOf(id) > -1) {
    effectTracker[name].splice(effectTracker[name].indexOf(id), 2);
  }
}

const addAction = ({
  name,
  array = actionArray,
} = {}) => {
  let row = 'action-row';
  if (array === cooldownArray) {
    row = 'cooldown-row';
  }

  const addTarget = array.findIndex((action) => action.name === name);
  if (removeTarget > -1) {
    array.splice(removeTarget, 1);
    document.getElementById(row).children[removeTarget].className = 'icondiv icon-remove';
  }
};

const removeAction = ({
  name,
  array = actionArray,
} = {}) => {
  const row = 'action-row';
  const removeTarget = array.findIndex((action) => action.name === name);
  if (removeTarget > -1) {
    array.splice(removeTarget, 1);
    document.getElementById(row).children[removeTarget].className = 'icondiv icon-remove';
  }
};


const syncIcons = ({
  array = actionArray,
} = {}) => {
  const row = 'action-row';

  // Check existing divs
  for (let i = 0; i < document.getElementById(row).children.length; i += 1) {
    const imgSrc = document.getElementById(row).children[i].children[0].src;

    // If array index doesn't exist or icon doesn't match, remove it and any following icons
    if (!array[i] || imgSrc !== `icon/${icon[array[i].name]}png`) {
      for (let j = i; j < document.getElementById(row).children.length; j += 1) {
        // document.getElementById(row).children[j].remove();
        document.getElementById(row).children[j].className = 'icondiv icon-remove';
      }
      break;
    }
  }

  // Create any needed divs
  for (let i = 0; i < array.length; i += 1) {
    if (!document.getElementById(row).children[i]) {
      const iconDiv = document.createElement('div');
      const iconImg = document.createElement('img');
      const iconOverlay = document.createElement('img');
      document.getElementById(row).appendChild(iconDiv);
      document.getElementById(row).children[i].appendChild(iconImg);
      document.getElementById(row).children[i].appendChild(iconOverlay);
    }
  }


  // Match actionArray with div elements
  for (let i = 0; i < array.length; i += 1) {
    const iconDiv = document.getElementById(row).children[i];
    const iconImg = iconDiv.children[0];
    const iconOverlay = iconDiv.children[1];
    void iconDiv.offsetWidth;
    iconDiv.className = 'icondiv icon-add';
    iconImg.className = 'new-iconimg';
    iconImg.src = `icon/${icon[array[i].icon]}.png`;
    iconOverlay.className = 'new-iconoverlay';
    iconOverlay.src = 'icon/overlay.png';
  }
};


const addIcon = ({
  name,
  img = name,
  effect = '',
} = {}) => {

  dom[`iconimg${nextid[name]}`].src = `icon/${icon[img]}.png`;
  dom[`icondiv${nextid[name]}`].className = `icondiv icon-add ${effect}`;
};

function addIconEffect({
  name,
  img = name,
  effect = "",
} = {}) {

  dom["icondiv" + nextid[name]].className = dom["icondiv" + nextid[name]].className + " " + effect;
}

function fadeIcon({name} = {}) {
  dom["icondiv" + nextid[name]].className = "icondiv icon-fade";
}

function removeIcon(name) {
  dom["icondiv" + nextid[name]].className = "icondiv icon-remove";
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

function countTargets(action) {
  if (Date.now() - previous[action] > countTargetsTime) {
    previous[action] = Date.now();
    count.targets = 1;
  }
  // If multiple lines inside countTargetTime, then increase
  else {
    count.targets = count.targets + 1;
  }
}

 callOverlayHandler({ call: "cactbotRequestState" });

// callOverlayHandler accepts an object so you can add more parameters which will be passed to the C# code.
// i.e. a TTS call for Cactbot would look like this:
// callOverlayHandler({ call: "cactbotSay", text: "Hello World!" });.
