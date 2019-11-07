let priorityArray = [];
let actionArray = [];
let cooldownArray = [];
let countdownArrayA = [];
let countdownArrayB = [];
let recastTracker = {}; // Holds timestamps for cooldowns
let statusTracker = {}; // Holds timestamps for statuses
let cooldowntime = {}; // Holds timestamps for cooldowns
let actionList = {};
let player = {};
let target = {};


const removeAnimationTime = 1000;

const timeout = {}; // For timeout variables
const interval = {};
const nextid = {}; // Store document id - location on page for icons, etc.
const countdownid = {};
const toggle = {}; // Toggley things
const count = {}; // County things?
let potency = {};
let previous = {};
let next = {};


const addAction = ({
  name,
  img = icon[name],
  array = actionArray,
  order = 'last',
} = {}) => {
  let row = 'action-row';
  if (array === priorityArray) {
    row = 'priority-row';
  } else if (array === cooldownArray) {
    row = 'cooldown-row';
  }

  const iconDiv = document.createElement('div');
  const iconImg = document.createElement('img');
  const iconOverlay = document.createElement('img');
  if (order === 'last') {
    document.getElementById(row).prepend(iconDiv);
  } else {
    document.getElementById(row).append(iconDiv);
  }
  iconDiv.append(iconImg);
  iconDiv.append(iconOverlay);
  void iconDiv.offsetWidth;
  iconDiv.className = 'icondiv icon-add';
  iconImg.className = 'new-iconimg';
  iconImg.src = `/img/icon/${img}.png`;
  iconOverlay.className = 'new-iconoverlay';
  iconOverlay.src = '/img/icon/overlay.png';
};

const fadeAction = ({
  name,
  array = actionArray,
} = {}) => {
  let row = 'action-row';
  if (array === priorityArray) {
    row = 'priority-row';
  } else if (array === cooldownArray) {
    row = 'cooldown-row';
  }

  const fadeTarget = array.findIndex((action) => action.name === name);
  if (fadeTarget > -1) {
    document.getElementById(row).children[fadeTarget].style.opacity = '0.5';
  }
};

const removeAction = ({
  name,
  array = actionArray,
} = {}) => {
  let row = 'action-row';
  if (array === priorityArray) {
    row = 'priority-row';
  } else if (array === cooldownArray) {
    row = 'cooldown-row';
  }

  const removeTarget = array.findIndex((action) => action.name === name);
  if (removeTarget > -1) {
    array.splice(removeTarget, 1);
    document.getElementById(row).children[removeTarget].className = 'icondiv icon-remove';
  }
};

const syncArray = ({
  array = actionArray,
} = {}) => {
  const row = 'action-row';

  // Check existing divs
  for (let i = 0; i < document.getElementById(row).children.length; i += 1) {
    const imgSrc = document.getElementById(row).children[i].children[0].src;

    // If array index doesn't exist or icon doesn't match, remove it and any following icons
    if (!array[i] || imgSrc !== `/img/icon/${icon[array[i].name]}png`) {
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
    iconImg.src = `/img/icon/${icon[array[i].icon]}.png`;
    iconOverlay.className = 'new-iconoverlay';
    iconOverlay.src = 'icon/overlay.png';
  }
};

"use strict";

var blmFireSpam = "none";
var blmFireIcon = "none";
var blmFireMP = 1000000;
var blmThunderMP = 1000000;
var blmThunderIcon = "none";

var blmFireTime = 100000;

var blmAstralMinimumMP = 200;
var blmUmbralMinimumMP = 0;
var blmRotationBufferTime = 5000;
var blmProcBufferTime = 5000;
var blmCasting = "";
var blmInstant = "";
var blmInstantIcon = "";
var blmSwiftcasted = 0;
var blmPreviousTargets = 0;

var blmFireCostModifier = 1;
var blmBlizzardCostModifier = 1;


var blmActions = [
  "Blizzard", "Blizzard II", "Blizzard III", "Blizzard IV",
  "Fire", "Fire II", "Fire III", "Fire IV",
  "Thunder", "Thunder II", "Thunder III", "Thunder IV",
  "Freeze", "Flare", "Despair",
  "Foul", "Xenoglossy",
  "Enochian", "Ley Lines", "Sharpcast", "Manafont",
  "Swiftcast", "Lucid Dreaming"
];

function blmJobChange() {

  // Minimum Astral Phase MP
  if (player.level >= 72) {
    blmAstralMinimumMP = 800;  // Despair + Blizzard IV
  }
  else if (player.level >= 40) {
    blmAstralMinimumMP = 200;  // Blizzard IV
  }
  else {
    blmAstralMinimumMP = 0;  // Transpose probably
  }

  // Any phase
  nextid.enochian = 0;  // ENOCHAAAAAAN
  nextid.thundercloud = 1;
  nextid.firestarter = 1;
  nextid.xenoglossy = 1;
  nextid.instantAction = 1;
  nextid.manafont = 2;
  nextid.sharpcast = 3;
  nextid.leylines = 4;
  nextid.triplecast = 5;
  nextid.swiftcast = 6;
  nextid.weaveAction = 2;

  nextid.thunder = 10;  // Appears when necessary at front of rotation
  nextid.thunder2 = nextid.thunder;  // See above
  nextid.foul = 10;

  // Astral
  nextid.firespam = 11;
  // nextid.firespam1 = 10;
  // nextid.firespam2 = nextid.firespam1 + 1;
  // nextid.firespam3 = nextid.firespam1 + 2;
  nextid.instant = 16;
  nextid.flare = 17;
  nextid.despair = 17;
  nextid.transpose = 19;
  nextid.fire = nextid.transpose;
  nextid.blizzard3 = nextid.transpose;
  nextid.freezeUmbral3 = nextid.transpose;

  // Umbral
  nextid.blizzard = 11;
  nextid.blizzard2 = 11;
  nextid.blizzard4 = 11;
  nextid.freeze = 11;
  nextid.fire3 = 19;
  nextid.coldflare = nextid.fire3;

  // oGCD

  countdownid.thunder = 0;
  countdownid.thundercloud = 1;
  countdownid.firestarter = 2;

  // Set up traited actions
  if (player.level >= 45) {
    icon.thunder = icon.thunder3;
    duration.thunder = duration.thunder3;
  }
  else {
    icon.thunder = "000457";
    duration.thunder = 18000;
  }

  if (player.level >= 64) {
    icon.thunder2 = icon.thunder4;
    duration.thunder2 = duration.thunder4;
  }
  else {
    icon.thunder2 = "000468";
    duration.thunder2 = 12000;
  }

  if (player.level >= 74) {
    recast.sharpcast = 30000;
  }
  else {
    recast.sharpcast = 60000;
  }

  // AoE Helpers
  previous.blizzard2 = 0;
  previous.fire2 = 0;
  previous.thunder2 = 0;
  previous.freeze = 0;
  previous.flare = 0;
  previous.foul = 0;

  count.targets = 1;

  blmNext();

}

function blmPlayerChangedEvent() {

  // Pause updates while casting
  if (blmCasting == "") {
    blmNext();
  }

  // Calculate MP cost modifiers
  if (player.jobDetail.umbralStacks == 3) {
    blmFireCostModifier = 2;
    blmBlizzardCostModifier = 0.25;
  }
  else if (player.jobDetail.umbralStacks == 2) {
    blmFireCostModifier = 2;
    blmBlizzardCostModifier = 0.25;
  }
  else if (player.jobDetail.umbralStacks == 1) {
    blmFireCostModifier = 2;
    blmBlizzardCostModifier = 0.5;
  }
  else if (player.jobDetail.umbralStacks == -3) {
    blmFireCostModifier = 0.25;
    blmBlizzardCostModifier = 0;
  }
  else if (player.jobDetail.umbralStacks == -2) {
    blmFireCostModifier = 0.25;
    blmBlizzardCostModifier = 0.5;
  }
  else if (player.jobDetail.umbralStacks == -1) {
    blmFireCostModifier = 0.5;
    blmBlizzardCostModifier = 0.75;
  }
  else {
    blmFireCostModifier = 1;
    blmBlizzardCostModifier = 1;
  }

  // Find server MP ticks
  if (previous.currentMP < player.currentMP) {
    previous.currentMP = player.currentMP;
    previous.serverTick = Date.now();
  }

}

function blmTargetChangedEvent() {

  // if (previous.targetID != target.ID) {
  //
  //   // console.log("Target changed: " + target.ID);
  //   if (player.jobDetail.umbralStacks > 0) {
  //     blmThunder(player.currentMP, player.jobDetail.umbralMilliseconds, player.jobDetail.umbralStacks, blmAstralMinimumMP);
  //   }
  //   else if (player.jobDetail.umbralStacks < 0) {
  //     blmThunder(player.currentMP, player.jobDetail.umbralMilliseconds, player.jobDetail.umbralStacks, blmUmbralMinimumMP);
  //   }
  //   else {
  //     blmThunder(player.currentMP, player.jobDetail.umbralMilliseconds, player.jobDetail.umbralStacks, 0);
  //   }
  //
  //   previous.targetID = target.ID;
  // }

}

function blmStartsUsing() {
  blmCasting = startsLog.groups.actionName;
  blmNext();
}

function blmAction() {

  // No longer casting if an action has resolved
  blmCasting = "";
  // console.log("no longer casting");

  // console.log("Umbral Stacks: " + player.jobDetail.umbralStacks);
  // console.log("Umbral Hearts: " + player.jobDetail.umbralHearts);
  // console.log("Enochian: " + player.jobDetail.enochian);

  if (blmActions.indexOf(actionLog.groups.actionName) > -1) {

    // oGCDs

    if ("Enochian" == actionLog.groups.actionName) {
      removeIcon("enochian");
      addRecast("enochian");
    }

    else if ("Sharpcast" == actionLog.groups.actionName) {
      addStatus("sharpcast");
      addRecast("sharpcast");
    }

    else if ("Manafont" == actionLog.groups.actionName) {
      addRecast("manafont");
    }

    else if ("Transpose" == actionLog.groups.actionName) {
      removeIcon("transpose");
      addRecast("transpose");
    }

    else if ("Triplecast" == actionLog.groups.actionName) {
      blmInstant = "Triplecast";
      addStatus("triplecast");
      addRecast("triplecast");
    }

    else if ("Swiftcast" == actionLog.groups.actionName) {
      blmInstant = "Swiftcast";
      addStatus("swiftcast");
      addRecast("swiftcast");
    }

    else {

      if ("Fire" == actionLog.groups.actionName) {
        count.targets = 1;
      }

      else if ("Fire II" == actionLog.groups.actionName) {
        countTargets("fire2");
      }

      else if ("Fire III" == actionLog.groups.actionName) {
      }

      else if ("Fire IV" == actionLog.groups.actionName) {
      }

      else if ("Blizzard" == actionLog.groups.actionName) {
        count.targets = 1;
      }

      else if ("Blizzard II" == actionLog.groups.actionName) {
        countTargets("blizzard2");
      }

      else if ("Blizzard III" == actionLog.groups.actionName) {
        count.targets = 1;
      }

      else if (["Thunder", "Thunder III"].indexOf(actionLog.groups.actionName) > -1) {
        count.targets = 1;
        addStatus("thunder", duration.thunder, actionLog.groups.targetID);
      }

      else if (["Thunder II", "Thunder IV"].indexOf(actionLog.groups.actionName) > -1) {
        countTargets("thunder2");
        addStatus("thunder2", duration.thunder2, actionLog.groups.targetID);
      }

      else if ("Freeze" == actionLog.groups.actionName) {
        countTargets("freeze");
      }

      else if ("Flare" == actionLog.groups.actionName) {
        countTargets("flare");
      }

      else if ("Foul" == actionLog.groups.actionName) {
        countTargets("foul");
      }

      if (Math.min(checkStatus("swiftcast"), checkStatus("triplecast")) <= 0 && blmSwiftcasted == 1) {
        console.log("Used Swiftcast or Triplecast on " + actionLog.groups.actionName + " (maybe)");
        blmSwiftcasted = 0;
        removeIcon("weaveAction");
      }
    }

    // See if last spell was instant cast via Swiftcast or Triplecast
    if (Math.min(checkStatus("swiftcast"), checkStatus("triplecast")) > 0) {
      blmSwiftcasted = 1;
    }

    blmNext();

    // console.log(count.targets);

  }
}

function blmCancelled() {
  blmCasting = "";
  blmNext();
}

function blmStatus() {

  if (effectLog.groups.targetID == player.ID) {

    if (effectLog.groups.effectName == "Thundercloud") {
      if (effectLog.groups.gainsLoses == "gains") {
        addStatus("thundercloud", parseInt(effectLog.groups.effectDuration) * 1000);
        addCountdownBar({name: "thundercloud", time: checkStatus("thundercloud"), oncomplete: "removeCountdownBar"});
      }
      else if (effectLog.groups.gainsLoses == "loses") {
        removeStatus("thundercloud", effectLog.groups.targetID);
      }
    }

    else if (effectLog.groups.effectName == "Firestarter") {
      if (effectLog.groups.gainsLoses == "gains") {
        addStatus("firestarter", parseInt(effectLog.groups.effectDuration) * 1000);
        addCountdownBar({name: "firestarter", time: checkStatus("firestarter"), oncomplete: "removeCountdownBar"});
      }
      else if (effectLog.groups.gainsLoses == "loses") {
        removeStatus("firestarter", effectLog.groups.targetID);
        // removeIcon("firestarter");
      }
    }

  }

  else {

    // console.log(effectLog.groups.targetID + effectLog.groups.gainsLoses + effectLog.groups.effectName);

    if (["Thunder", "Thunder II", "Thunder III", "Thunder IV"].indexOf(effectLog.groups.effectName) > -1) {
      if (effectLog.groups.gainsLoses == "gains") {
        addStatus("thunder", parseInt(effectLog.groups.effectDuration) * 1000, effectLog.groups.targetID);
        addCountdownBar({name: "thunder", time: checkStatus("thunder", effectLog.groups.targetID), oncomplete: "removeCountdownBar"});
      }
      else if (effectLog.groups.gainsLoses == "loses") {
        removeStatus("thunder", effectLog.groups.targetID);
      }
    }

  }
}

function blmNext() {

  if ("Fire" == blmCasting) {
    if (player.jobDetail.umbralStacks < 0) {
      blmAstralRotation(player.currentMP - 800 * blmFireCostModifier, 15000, 0);
    }
    else {
      blmAstralRotation(player.currentMP - 800 * blmFireCostModifier, 15000, Math.min(player.jobDetail.umbralStacks + 1, 3));
    }
  }

  else if ("Fire II" == blmCasting) {
    if (player.jobDetail.umbralStacks < 0) {
      blmAstralRotation(player.currentMP - 1500 * blmFireCostModifier, 15000, 0);
    }
    else {
      blmAstralRotation(player.currentMP - 1500 * blmFireCostModifier, 15000, Math.min(player.jobDetail.umbralStacks + 1, 3));
    }
  }

  else if ("Fire III" == blmCasting) {
    blmAstralRotation(player.currentMP - 2000 * blmFireCostModifier, 15000, 3 );
  }

  else if ("Flare" == blmCasting) {
    if (player.jobDetail.umbralHearts > 0) {
      blmAstralRotation(player.currentMP * 0.34, 15000, 3);
    }
    else {
      blmAstralRotation(0, 15000, 3);
    }
  }

  else if ("Despair" == blmCasting) {
    if (player.jobDetail.umbralHearts > 0) {
      blmAstralRotation(player.currentMP * 0.34, 15000, 3);
    }
    else {
      blmAstralRotation(0, 15000, 3);
    }
  }

  else if ("Blizzard" == blmCasting) {
    if (player.jobDetail.umbralStacks > 0) {
      blmUmbralRotation(player.currentMP - 400 * blmBlizzardCostModifier, 15000, 0);
    }
    else {
      blmUmbralRotation(player.currentMP - 400 * blmBlizzardCostModifier, 15000, Math.max(player.jobDetail.umbralStacks - 1, -3));
    }
  }

  else if ("Blizzard II" == blmCasting) {
    if (player.jobDetail.umbralStacks > 0) {
      blmUmbralRotation(player.currentMP - 800 * blmBlizzardCostModifier, 15000, 0);
    }
    else {
      blmUmbralRotation(player.currentMP - 800 * blmBlizzardCostModifier, 15000, Math.max(player.jobDetail.umbralStacks - 1, -3));
    }
  }

  else if ("Freeze" == blmCasting) {
    blmUmbralRotation(player.currentMP - 1000 * blmBlizzardCostModifier, 15000, -3);
  }

  else if ("Blizzard III" == blmCasting) {
    blmUmbralRotation(player.currentMP - 800 * blmBlizzardCostModifier, 15000, -3);
  }

  // All other cases
  else if (player.jobDetail.umbralStacks < 0) { // In Umbral
    blmUmbralRotation(player.currentMP, player.jobDetail.umbralMilliseconds, player.jobDetail.umbralStacks);
  }
  else { // Starting out or in Astral
    blmAstralRotation(player.currentMP, player.jobDetail.umbralMilliseconds, player.jobDetail.umbralStacks);
  }

}

// Astral Fire
function blmAstralRotation(currentMP, blmAstralTime, blmAstralStacks) {

  // LEVELING ROTATIONS

  // Single-Target
  // Sub-40: {F1 spam} Transpose T1 {B1 until max MP} Transpose
  // 40-59:  B3 T3 {optional B1 for MP tick} F3 {F1 spam until low MP} repeat. Use F3p and T3p as you get them, but don't cancel casts to use procs
  // 60-71: B3 B4 T3 F3 F4x3 F1 F4x3 repeat. Foul whenever
  // 72+: B3 B4 T3 F3 F4x3 F1 F4x3 Despair repeat
  // Same as 60-71 with Despair at the end
  // Same as 80 just without Xeno. See guide for better details

  // AOE
  // 18-34: {F2 spam} Transpose {B2 until max MP} Transpose repeat. Keep up T2 dot
  // 35-49: Spam Freeze. Keep up T2 dot
  // 50-59: Freeze T2 F3 F2 F2 Flare Transpose repeat
  // 60-67: Freeze T2 F3 {F4 2-3 times} Flare Transpose repeat
  // Save 800 MP for Flare. Use 50-59 AOE Rotation at 5+ enemies
  // 68-71: Freeze T4 F3 Flare Flare Transpose repeat
  // 72+: Freeze T4 F3 Flare Flare repeat
  // Same as 80. See guide for better details
  // For all aoe, use Thundercloud procs on T2/T4 as you get them. Swift/Triple Flares. Manafont for an extra Flare. Foul after Transpose or Freeze

  // Picks Fire spell
  if (player.level >= 68 && count.targets >= 3) {
    blmFireSpam = "none";
  }
  else if (player.level >= 60 && count.targets >= 5) {
    blmFireSpam = "Fire II";
  }
  else if (player.level >= 60) {
    blmFireSpam = "Fire IV";
  }
  else if (player.level >= 50 && count.targets >= 3) {
    blmFireSpam = "Fire II";
  }
  else if (player.level >= 35 && count.targets >= 3) {
    blmFireSpam = "none";
  }
  else if (player.level >= 18 && count.targets >= 3) {
    blmFireSpam = "Fire II";
  }
  else {
    blmFireSpam = "Fire";
  }

  // Fire spam data
  if (blmFireSpam == "Fire") {
    blmFireIcon = "fire";
    blmFireMP = 800 * blmFireCostModifier;
    blmFireTime = 2500;
  }
  else if (blmFireSpam == "Fire II") {
    blmFireIcon = "fire2";
    blmFireMP = 1500 * blmFireCostModifier;
    blmFireTime = 3000;
  }
  else if (blmFireSpam == "Fire IV") {
    blmFireIcon = "fire4";
    blmFireMP = 800 * blmFireCostModifier;
    blmFireTime = 2800;
  }
  else {
    blmFireIcon = "fire";
    blmFireMP = 100000 * blmFireCostModifier;
    blmFireTime = 150000;
  }

  // Calculate Fire spam count
  count.firespam = Math.min(
    (currentMP + player.jobDetail.umbralHearts * (blmFireMP / 2) - blmAstralMinimumMP) / blmFireMP,  // "how much MP for fire spam spells"
    (blmAstralTime - blmRotationBufferTime) / blmFireTime // how much time for fire spam spells
  )

  blmEnochian(blmAstralTime);
  blmInstantFiller(currentMP, blmAstralTime, blmAstralStacks);
  blmThunder(currentMP, blmAstralTime, blmAstralStacks, blmAstralMinimumMP);

  // Firespam
  if (blmFireSpam == "none") {
    removeIcon("firespam");
  }
  else {
    if (count.firespam > 1) {
      addIcon({
        name: "firespam",
        img: blmFireIcon,
      });
    }
    else if (blmCasting == blmFireSpam) {
      fadeIcon({name: "firespam"});
    }
    else {
      removeIcon("firespam");
    }
  }

  // MP to 0 spells
  if (blmAstralStacks == 3) {
    if (player.level >= 50
    && count.targets >= 3
    && currentMP >= 800) {
      addIcon({name: "flare"});
    }
    else if (player.level >= 72
    && currentMP - count.firespam * 1600 >= blmAstralMinimumMP
    && currentMP - count.firespam * 1600 < 1600 + blmAstralMinimumMP) {
      addIcon({name: "despair"});
    }
    else if (blmCasting == "Flare") {
      fadeIcon({name: "flare"});
    }
    else if (blmCasting == "Despair") {
      fadeIcon({name: "despair"});
    }
    else {
      removeIcon("flare");
    }
  }
  else {
    removeIcon("flare");
  }

  // Change to Umbral Ice
  if (count.targets >= 3) {
    if (player.level >= 72) {
      if (blmCasting != "Freeze") {
        addIcon({name: "freezeUmbral3"});
      }
      else {
        fadeIcon({name: "freezeUmbral3"});
      }
    }
    else {
      addIcon({name: "transpose"});
    }
  }
  else {
    if (player.level >= 60
    && blmAstralStacks == 3
    && (currentMP + player.jobDetail.umbralHearts * 800 - 1600 - blmAstralMinimumMP) / 1600 > (blmAstralTime - blmRotationBufferTime) / 2800) {
      addIcon({name: "fire"});
    }
    else if (blmCasting == "Blizzard III") {
      fadeIcon({name: "blizzard3"});
    }
    else {
      addIcon({name: "blizzard3"});
    }
  }
}

// Umbral Ice
function blmUmbralRotation(currentMP, blmUmbralTime, blmUmbralStacks) {

  // LEVELING ROTATIONS

  // Single-Target
  // Sub-40: {F1 spam} Transpose T1 {B1 until max MP} Transpose
  // 40-59:  B3 T3 {optional B1 for MP tick} F3 {F1 spam until low MP} repeat. Use F3p and T3p as you get them, but don't cancel casts to use procs
  // 60-71: B3 B4 T3 F3 F4x3 F1 F4x3 repeat. Foul whenever
  // 72+: B3 B4 T3 F3 F4x3 F1 F4x3 Despair repeat
  // Same as 60-71 with Despair at the end
  // Same as 80 just without Xeno. See guide for better details

  // AOE
  // 18-34: {F2 spam} Transpose {B2 until max MP} Transpose repeat. Keep up T2 dot
  // 35-49: Spam Freeze. Keep up T2 dot
  // 50-59: Freeze T2 F3 F2 F2 Flare Transpose repeat
  // 60-67: Freeze T2 F3 {F4 2-3 times} Flare Transpose repeat
  // Save 800 MP for Flare. Use 50-59 AOE Rotation at 5+ enemies
  // 68-71: Freeze T4 F3 Flare Flare Transpose repeat
  // 72+: Freeze T4 F3 Flare Flare repeat
  // Same as 80. See guide for better details
  // For all aoe, use Thundercloud procs on T2/T4 as you get them. Swift/Triple Flares. Manafont for an extra Flare. Foul after Transpose or Freeze

  if (player.jobDetail.umbralStacks <= -3) {
    blmUmbralMinimumMP = 3800;
  }
  else if (player.jobDetail.umbralStacks <= -2) {
    blmUmbralMinimumMP = 5300;
  }
  else if (player.jobDetail.umbralStacks <= -1) {
    blmUmbralMinimumMP = 6800;
  }

  blmEnochian(blmUmbralTime);
  blmInstantFiller(currentMP, blmUmbralTime, blmUmbralStacks);
  blmThunder(currentMP, blmUmbralTime, blmUmbralStacks, blmUmbralMinimumMP);

  // AoE
  if (count.targets >= 3) {
    if (player.level >= 50) {
      if (blmCasting == "Freeze") {
        removeIcon("freeze");
      }
      // AoE uses Freeze to transition to Umbral III
      else if (player.jobDetail.umbralStacks != -3) {
        addIcon({name: "freeze"});
      }
      else {
        removeIcon("freeze");
      }
    }
    else if (player.level >= 35) {
      addIcon({name: "freeze"});
    }
    else {
      if (player.currentMP == 10000) {
        removeIcon("blizzard2");
      }
      else if (player.currentMP >= blmUmbralMinimumMP && Date.now() - previous.serverTick > 3000 - 2500) {
        removeIcon("blizzard2");
      }
      else {
        addIcon({name: "blizzard2"});
      }
    }
  }

  // Single target
  else {

    // Blizzard IV (post 58)
    if (player.level >= 58) {
      if (blmCasting == "Blizzard IV") {
        removeIcon("blizzard4");
      }
      else if (player.jobDetail.umbralHearts == 3) {
        removeIcon("blizzard4");
      }
      else if (player.jobDetail.enochian || checkRecast("enochian") < 0) {
        addIcon({name: "blizzard4"});
      }
      else {
        removeIcon("blizzard4");
      }
    }

    // Blizzard spam (pre 58)
    else {
      if (player.currentMP == 10000) {
        removeIcon("blizzard");
      }
      else if (player.currentMP >= blmUmbralMinimumMP && Date.now() - previous.serverTick > 3000 - 2500) {
        removeIcon("blizzard");
      }
      else {
        addIcon({name: "blizzard"});
      }
    }
  }

  // Transition spell (Fire III, etc.)
  // Only show transitions at full MP
  if (player.currentMP == 10000 ||
  (player.currentMP >= blmUmbralMinimumMP && Date.now() - previous.serverTick > 1500)) {

    if (player.level >= 72
    && count.targets >= 5
    && player.jobDetail.umbralHearts > 0) {
      addIcon({name: "coldflare"});  // "Cold flare"
    }
    else {
      if (player.level >= 40) {
        addIcon({name: "fire3"});
      }
      else if (player.level < 34) {
        addIcon({name: "transpose"});
      }
    }
  }
  else {
    removeIcon("transpose");
  }
}

// Enochian
function blmEnochian(rotationTime) {
  if (!player.jobDetail.enochian
  && player.level >= 56
  && checkRecast("enochian") <= 0
  && rotationTime > blmRotationBufferTime) {
    addIcon({name: "enochian"});
  }
  else {
    removeIcon("enochian");
  }
}

// Looks for instants for weaving
function blmInstantFiller(currentMP, rotationTime, rotationStacks) {

  // Check for Instants to weave behind

  // Thundercloud gets priority use during AoE - ignore rest
  if (count.targets >= 3) {
    if (checkStatus("thundercloud") > 0
    && rotationTime > 2500 + blmRotationBufferTime) {
      blmInstant = "Thundercloud";
      addIcon({name: "thundercloud", img: blmThunderIcon});
      removeIcon("thunder");
    }
    else {
      blmInstant = "";
    }
  }

  // Thundercloud if Thundercloud effect is about to expire
  else if (checkStatus("thundercloud") > 0
  && checkStatus("thundercloud") < blmProcBufferTime
  && rotationTime > 2500 + blmRotationBufferTime) {
    blmInstant = "Thundercloud";
    addIcon({name: "thundercloud", img: blmThunderIcon});
    removeIcon("thunder");
  }

  // Use Thundercloud if Thunder effect is about to expire
  else if (checkStatus("thundercloud") > 0
  && target.ID.length == 8
  && target.ID.startsWith("4")
  && checkStatus("thunder", target.ID) <= 0
  && rotationTime > 2500 + blmRotationBufferTime) {
    blmInstant = "Thundercloud";
    addIcon({name: "thundercloud", img: blmThunderIcon});
    removeIcon("thunder");
  }

  // Xenoglossy - avoid overcapping
  else if (player.level >= 80
  && player.jobDetail.foulCount > 1
  && rotationTime > 2500 + blmRotationBufferTime) {
    addIcon({name: "xenoglossy"});
    blmInstant = "Xenoglossy";
  }

  // Firestarter
  else if (checkStatus("firestarter") >= 1000
  && rotationStacks > 0
  && rotationTime > 2500) {
    blmInstant = "Firestarter";
  }

  // Xenoglossy
  else if (player.level >= 80
  && player.jobDetail.foulCount > 0
  && rotationTime > 2500 + blmRotationBufferTime) {
    blmInstant = "Xenoglossy";
  }

  // Thundercloud
  else if (checkStatus("thundercloud") >= 1000
  && rotationTime > 2500 + blmRotationBufferTime) {
    blmInstant = "Thundercloud";
  }

  else {
    blmInstant = "";
  }

  if (blmInstant == "Thundercloud") {
    blmInstantIcon = blmThunderIcon;
  }
  else if (blmInstant == "Firestarter") {
    blmInstantIcon = "firestarter";
  }
  else if (blmInstant == "Xenoglossy") {
    blmInstantIcon = "xenoglossy";
  }

  // Add weaveable action if instant is available

  if (blmInstant != "") {

    // Manafont
    if (player.level >= 30
    && checkRecast("manafont") < 1000
    && rotationStacks >= 3
    && currentMP <= 7000) {
      addIcon({name: "instantAction", img: blmInstantIcon});
      addIcon({name: "weaveAction", img: "manafont"});
    }

    // Sharpcast
    else if (player.level >= 54
    && checkRecast("sharpcast") < 1000) {
      addIcon({name: "instantAction", img: blmInstantIcon});
      addIcon({name: "weaveAction", img: "sharpcast"});
    }

    // Triplecast
    else if (player.level >= 66
    && checkRecast("triplecast") < 1000
    && rotationStacks >= 3
    && currentMP >= 1600 * 3 + 800) {
      addIcon({name: "instantAction", img: blmInstantIcon});
      addIcon({name: "weaveAction", img: "triplecast"});
    }

    // Leylines
    else if (player.level >= 52
    && checkRecast("leylines") < 1000) {
      addIcon({name: "instantAction", img: blmInstantIcon});
      addIcon({name: "weaveAction", img: "leylines"});
    }

    // Swiftcast
    else if (player.level >= 18
    && checkRecast("swiftcast") < 1000
    && rotationStacks >= 3) {
      addIcon({name: "instantAction", img: blmInstantIcon});
      addIcon({name: "weaveAction", img: "swiftcast"});
    }

    else {
      removeIcon("weaveAction");
    }
  }
  else {
    removeIcon("instantAction");
  }
}

// Thunder
function blmThunder(currentMP, rotationTime, rotationStacks, rotationMinimumMP) {

  if (count.targets >= 3) {
    if (player.level >= 64) {
      blmThunderMP = 800;
      blmThunderIcon = "thunder4";
    }
    else if (player.level >= 26) {
      blmThunderMP = 400;
      blmThunderIcon = "thunder2";
    }
    else {
      blmThunderMP = 100000;
      blmThunderIcon = "thunder";
    }
  }
  else {
    if (player.level >= 45) {
      blmThunderMP = 400;
      blmThunderIcon = "thunder3";
    }
    else {
      blmThunderMP = 200;
      blmThunderIcon = "thunder";
    }
  }

  // Hide if casting already
  if (["Thunder", "Thunder II", "Thunder III", "Thunder IV"].indexOf(blmCasting) > -1) {
    removeIcon("thunder");
  }

  // Not enough MP
  else if (currentMP < blmThunderMP + rotationMinimumMP) {
    removeIcon("thunder");
  }

  // Hide in Umbral Ice if not at full stacks yet
  else if (player.level >= 40
  && player.umbralStacks < 0
  && player.umbralStacks > -3) {
    removeIcon("thunder");
  }
  else if (player.level >= 20
  && player.umbralStacks < 0
  && player.umbralStacks > -2) {
    removeIcon("thunder");
  }

  // Hardcast Thunder
  else if (target.ID) {
    if (checkStatus("thundercloud") < 0
    && target.ID.length == 8
    && target.ID.startsWith("4")
    && checkStatus("thunder", target.ID) <= 2500
    && rotationTime > 2500 + blmRotationBufferTime) {
      addIcon({name: "thunder", img: blmThunderIcon});
    }
  }

  else {
    removeIcon("thunder");
  }

}

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
      addIcon({name: "pitchperfect"});
    }
    else if (player.jobDetail.songProcs > 0
    && player.jobDetail.songMilliseconds < 3000) {
      addIcon({name: "pitchperfect"});
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
  if (previous.targetID != target.ID) { // Prevent this from repeatedly being called on movement or whatever

    // If not a target then clear things out
    if (target.ID.startsWith("4")) {
      if (player.level >= 54
      && checkStatus("venomousbite", target.ID) > 0
      && checkStatus("windbite", target.ID) > 0) {
        addCountdownBar({name: "ironjaws", time: Math.min(checkStatus("venomousbite", target.ID), checkStatus("windbite", target.ID)) - 5000, oncomplete: "addIcon"});
      }
      else {
        addCountdownBar({name: "venomousbite", time: checkStatus("venomousbite", target.ID), oncomplete: "addIcon"});
        if (player.level >= 18) {
          addCountdownBar({name: "windbite", time: checkStatus("windbite", target.ID), oncomplete: "addIcon"});
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

    previous.targetID = target.ID;
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
      addCountdownBar({name: "ironjaws", time: Math.min(checkStatus("venomousbite", actionLog.groups.targetID), checkStatus("windbite", actionLog.groups.targetID)) - 5000, oncomplete: "addIcon"});
    }
    else {
      removeCountdownBar("ironjaws");
      addCountdownBar({name: "venomousbite", time: checkStatus("venomousbite", actionLog.groups.targetID), oncomplete: "addIcon"});
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
      addCountdownBar({name: "ironjaws", time: Math.min(checkStatus("venomousbite", actionLog.groups.targetID), checkStatus("windbite", actionLog.groups.targetID)) - 5000, oncomplete: "addIcon"});
    }
    else {
      removeCountdownBar("ironjaws");
      addCountdownBar({name: "windbite", time: checkStatus("windbite", actionLog.groups.targetID), oncomplete: "addIcon"});
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
      addCountdownBar({name: "ironjaws", time: Math.min(checkStatus("venomousbite", actionLog.groups.targetID), checkStatus("windbite", actionLog.groups.targetID)) - 5000, oncomplete: "addIcon"});
      // removeIcon("venomousbite");
      // clearTimeout(timeout.ironjaws);
      // addIconBlinkTimeout("venomousbite", 30000, nextid.venomousbite, icon.venomousbite);
    }
    else if (checkStatus("venomousbite", actionLog.groups.targetID) > 0) {
      removeIcon("venomousbite");
      addStatus("venomousbite", duration.venomousbite, actionLog.groups.targetID);
      removeCountdownBar("ironjaws");
      addCountdownBar({name: "venomousbite", time: checkStatus("venomousbite", actionLog.groups.targetID), oncomplete: "addIcon"});
    }

    else if (checkStatus("windbite", actionLog.groups.targetID) > 0) {
      removeIcon("windbite");
      addStatus("windbite", duration.windbite, actionLog.groups.targetID);
      removeCountdownBar("ironjaws");
      addCountdownBar({name: "windbite", time: checkStatus("windbite", actionLog.groups.targetID), oncomplete: "addIcon"});
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
    addCountdownBar({name: "ragingstrikes"});
    // addIconBlinkTimeout("ragingstrikes",recast.ragingstrikes,nextid.ragingstrikes,icon.ragingstrikes);
    // if (player.level >= 38
    // && checkStatus("straightshotready") < 0) {
    //   addIconBlinkTimeout("barrage", checkRecast("barrage"), nextid.barrage, icon.barrage);
    // }
  }

  else if ("Barrage" == actionLog.groups.actionName) {
    addCountdownBar({name: "barrage"});
  }

  else if ("Battle Voice" == actionLog.groups.actionName) {
    addCountdownBar({name: "battlevoice"});
    // addRecast("battlevoice");
    // removeIcon("battlevoice");
    // addIconBlinkTimeout("battlevoice",recast.battlevoice,nextid.battlevoice,icon.battlevoice);
  }

  else if ("Sidewinder" == actionLog.groups.actionName) {
    addCountdownBar({name: "sidewinder"});
    // addRecast("sidewinder");
    // removeIcon("sidewinder");
    // addIconBlinkTimeout("sidewinder",recast.sidewinder,nextid.sidewinder,icon.sidewinder);
  }

  else if ("Shadowbite" == actionLog.groups.actionName) {
    addCountdownBar({name: "sidewinder"});
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
    addCountdownBar({name: "ballad"});
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
      addCountdownBar({name: "empyrealarrow", time: checkRecast("empyrealarrow")});
      // addIconTimeout("empyrealarrow",checkRecast("empyrealarrow"),nextid.empyrealarrow,icon.empyrealarrow);
    }
  }

  else if ("Army's Paeon" == actionLog.groups.actionName) {
    addCountdownBar({name: "paeon"});
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
      addCountdownBar({name: "empyrealarrow", time: checkRecast("empyrealarrow")});
    }
  }

  else if ("The Wanderer's Minuet" == actionLog.groups.actionName) {
    addCountdownBar({name: "paeon"});
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
      addCountdownBar({name: "empyrealarrow", time: checkRecast("empyrealarrow")});
    }
  }

  else if ("Empyreal Arrow" == actionLog.groups.actionName) {
    if (recast.empyrealarrow > Date.now() - previous.empyrealarrow) {
      recast.empyrealarrow = Date.now() - previous.empyrealarrow;
    }
    previous.empyrealarrow = Date.now();
    // removeIcon("empyrealarrow");
    // addRecast("empyrealarrow");
    addCountdownBar({name: "empyrealarrow"});
    // if (player.level >= 68) {
    //   if (checkStatus("song", player.ID) > recast.empyrealarrow) { // Check if EA should be reused within song duration
    //     addIconTimeout("empyrealarrow",recast.empyrealarrow,nextid.empyrealarrow,icon.empyrealarrow);
    //   }
    // }
    // else {
    //   addIconTimeout("empyrealarrow",recast.empyrealarrow,nextid.empyrealarrow,icon.empyrealarrow);
    // }
  }
}


function brdStatus() {

  if (effectLog.groups.targetID == player.ID) {

    if (effectLog.groups.effectName == "Straight Shot Ready") {
      if (effectLog.groups.gainsLoses == "gains") {
        addStatus("straightshotready", parseInt(effectLog.groups.effectDuration) * 1000);
        addIcon({name: "straightshot"});
        // removeIcon("barrage");
      }
      else if (effectLog.groups.gainsLoses == "loses") {
        removeStatus("straightshotready");
        removeIcon("straightshot");
        // addIconBlinkTimeout("barrage", checkRecast("barrage"), nextid.barrage, icon.barrage);
      }
    }

    else if (effectLog.groups.effectName == "Raging Strikes") {
      if (effectLog.groups.gainsLoses == "gains") {
        addStatus("ragingstrikes", parseInt(effectLog.groups.effectDuration) * 1000);
      }
      else if (effectLog.groups.gainsLoses == "loses") {
        removeStatus("ragingstrikes");
      }
    }
  }

  else {

    if (["Venomous Bite", "Caustic Bite"].indexOf(effectLog.groups.effectName) > -1) {
      if (effectLog.groups.gainsLoses == "gains") {
        addStatus("venomousbite", parseInt(effectLog.groups.effectDuration) * 1000, effectLog.groups.targetID);
        if (target.ID == effectLog.groups.targetID) {  // Might be possible to switch targets during this
          if (player.level >= 54
          && checkStatus("windbite", target.ID) > 0) {
            removeCountdownBar("venomousbite");
            removeCountdownBar("windbite");
            addCountdownBar({name: "ironjaws", time: Math.min(checkStatus("venomousbite", target.ID), checkStatus("windbite", target.ID)) - 5000, oncomplete: "addIcon"});
          }
          else {
            removeCountdownBar("ironjaws");
            addCountdownBar({name: "venomousbite", time: checkStatus("venomousbite", target.ID), oncomplete: "addIcon"});
            addCountdownBar({name: "windbite", time: checkStatus("windbite", target.ID), oncomplete: "addIcon"});
          }
        }
      }
      else if (effectLog.groups.gainsLoses == "loses") {
        removeIcon("ironjaws");
        removeCountdownBar("ironjaws");
        addCountdownBar({name: "venomousbite", time: checkStatus("venomousbite", target.ID), oncomplete: "addIcon"});
        addCountdownBar({name: "windbite", time: checkStatus("windbite", target.ID), oncomplete: "addIcon"});
      }
    }

    else if (["Windbite", "Stormbite"].indexOf(effectLog.groups.effectName) > -1) {
      if (effectLog.groups.gainsLoses == "gains") {
        addStatus("windbite", parseInt(effectLog.groups.effectDuration) * 1000, effectLog.groups.targetID);
        if (target.ID == effectLog.groups.targetID) {  // Might be possible to switch targets during this
          if (player.level >= 54
          && checkStatus("venomousbite", target.ID) > 0) {
            removeCountdownBar("venomousbite");
            removeCountdownBar("windbite");
            addCountdownBar({name: "ironjaws", time: Math.min(checkStatus("venomousbite", target.ID), checkStatus("windbite", target.ID)) - 5000, oncomplete: "addIcon"});
          }
          else {
            removeIcon("ironjaws");
            removeCountdownBar("ironjaws");
            addCountdownBar({name: "venomousbite", time: checkStatus("venomousbite", target.ID), oncomplete: "addIcon"});
            addCountdownBar({name: "windbite", time: checkStatus("windbite", target.ID), oncomplete: "addIcon"});
          }
        }
      }
      else if (effectLog.groups.gainsLoses == "loses") {
        removeIcon("ironjaws");
        removeCountdownBar("ironjaws");
        addCountdownBar({name: "venomousbite", time: checkStatus("venomousbite", target.ID), oncomplete: "addIcon"});
        addCountdownBar({name: "windbite", time: checkStatus("windbite", target.ID), oncomplete: "addIcon"});
      }
    }
  }
}


const addCountdown = ({
  name,
  img = icon[name],
  countdownArray = countdownArrayA,
  time = recast[name],
  order = 'last',
  onComplete = 'showText',
  array = actionArray,
  text = 'READY',
} = {}) => {
  // Identify correct column
  let column = 'countdown-a';
  if (countdownArray === countdownArrayB) {
    column = 'countdown-b';
  }

  const countdownIntervalTime = 100;

  let countdownDiv;
  let countdownImgDiv;
  let countdownImg;
  let countdownOverlay;
  let countdownTime;
  let countdownBar;

  // See if already exists somehow
  const findTarget = countdownArray.findIndex((action) => action.name === name);
  if (findTarget > -1) {
    // Already exists, so assign accordingly
    countdownDiv = document.getElementById(column).children[findTarget];
    countdownImgDiv = countdownDiv.children[0];
    countdownImg = countdownImgDiv.children[0];
    countdownOverlay = countdownImgDiv.children[1];
    countdownTime = countdownDiv.children[1];
    countdownBar = countdownDiv.children[2];
  } else {
    // Does not exist, so create
    countdownArray.push({ name, img });
    countdownDiv = document.createElement('div');
    countdownImgDiv = document.createElement('div');
    countdownImg = document.createElement('img');
    countdownOverlay = document.createElement('img');
    countdownTime = document.createElement('div');
    countdownBar = document.createElement('div');

    if (order === 'last') {
      document.getElementById(column).columnDiv.append(countdownDiv);
    } else {
      document.getElementById(column).columnDiv.prepend(countdownDiv);
    }
    countdownDiv.append(countdownImgDiv);
    countdownDiv.append(countdownTime);
    countdownDiv.append(countdownBar);
    countdownImgDiv.append(countdownImg);
    countdownImgDiv.append(countdownOverlay);
  }
  // Divs ready

  countdownImg.src = `/img/icon/${img}.png`;

  // Add or remove icons
  if (text === 'addIcon'
  && time <= 1000) {
    countdownDiv.className = 'countdowndiv countdown-remove';
  }

  if (text === 'removeCountdownBar'
  && time <= 0) {
    countdownDiv.className = 'countdowndiv countdown-remove';
  } else {
    countdownDiv.className = 'countdowndiv countdown-add';
  }

  let displayTime = time;

  clearInterval(interval[name]);

  // Countdown animation function starts here
  interval[name] = setInterval(() => {
    // Show icons a little bit early
    if (displayTime < 1000) {
      if (onComplete === 'addIcon' || onComplete === 'addAction') {
        addAction({ name, array, order });
      }
    }

    if (displayTime < 5000) {
      if (countdownBar.style.backgroundColor !== 'red') {
        countdownBar.style.backgroundColor = 'red';
      }
    } else if (displayTime < 10000) {
      if (countdownBar.style.backgroundColor !== 'orange') {
        countdownBar.style.backgroundColor = 'orange';
      }
    } else if (displayTime < 30000) {
      if (countdownBar.style.backgroundColor !== 'yellow') {
        countdownBar.style.backgroundColor = 'yellow';
      }
    } else {
      countdownBar.style.backgroundColor = 'white';
    }

    // Countdown bar animation
    if (displayTime <= 0) {
      // Cleanup when time <= 0

      countdownBar.style.width = '0px'; // Time 0 = bar width 0
      clearInterval(interval[name]);

      if (onComplete !== 'showText') {
        countdownDiv.className = 'countdowndiv countdown-remove';
      } else {
        countdownTime.innerHTML = text;
      }
    } else if (displayTime < 1000) {
      // Special animation when remaining time is low
      countdownTime.innerHTML = (displayTime / 1000).toFixed(1);
      countdownBar.style.width = `${Math.floor(displayTime / 100)}px`;
    } else {
      // This appears to best mathematically mimic the displayed values for XIV
      countdownTime.innerHTML = Math.ceil(displayTime / 1000);
      // Sets a max bar size
      countdownBar.style.width = `${Math.min(Math.floor((displayTime - 1000) / 1000) + 10, 70)}px`;
    }
    displayTime -= countdownIntervalTime;
  }, countdownIntervalTime);
};

const stopCountdown = ({
  name,
} = {}) => {
  clearInterval(interval[name]);
};

const removeCountdown = ({
  name,
  countdownArray = countdownArrayA,
} = {}) => {
  let column = 'countdown-a';
  if (countdownArray === countdownArrayB) {
    column = 'countdown-b';
  }
  const removeTarget = countdownArray.findIndex((action) => action.name === name);
  if (removeTarget > -1) {
    countdownArray.splice(removeTarget, 1);
    document.getElementById(column).children[removeTarget].className = 'countdowndiv countdown-remove';
  }
  clearInterval(interval[name]);
};

"use strict";

var maxEsprit;

actionList.dnc = [

  // Non-GCD
  "Fan Dance", "Fan Dance II", "Fan Dance III", "Devilment", "Flourish",

  // GCD
  "Cascade", "Fountain", "Windmill", "Bladeshower",
  "Reverse Cascade", "Rising Windmill", "Fountainfall", "Bloodshower",
  "Emboite", "Entrechat", "Jete", "Pirouette",
  "Standard Step",  "Standard Finish", "Single Standard Finish",
  "Double Standard Finish",
  "Technical Step", "Technical Finish", "Single Technical Finish",
  "Double Technical Finish", "Triple Technical Finish",
  "Quadruple Technical Finish",
  "Saber Dance"
];

function dncJobChange() {

  dncPriority();

  nextid.step1 = 10;
  nextid.step2 = 11;
  nextid.step3 = 12;
  nextid.step4 = 14;
  nextid.fandance3 = 15;
  nextid.fourfoldfeathers = 16;
  nextid.devilment = 17;
  nextid.flourish = 18;

  countdownid.standardstep = 0;
  countdownid.flourish = 1;
  countdownid.technicalstep = 10;
  countdownid.devilment = 11;

  previous.fandance2 = 0;
  previous.fandance3 = 0;
  previous.windmill = 0;
  previous.bladeshower = 0;
  previous.risingwindmill = 0;
  previous.bloodshower = 0;
  previous.standardfinish = 0;
  previous.saberdance = 0;
  previous.technicalfinish = 0;

  // Show available cooldowns

  if (player.level >= 15) {
    addCountdownBar({name: "standardstep", time: -1, oncomplete: "addIcon"});
  }

  if (player.level >= 62) {
    addCountdownBar({name: "devilment", time: -1});
  }

  if (player.level >= 70) {
    addCountdownBar({name: "technicalstep", time: -1, oncomplete: "addIcon"});
  }

  if (player.level >= 72) {
    addCountdownBar({name: "flourish", time: -1});
  }

  dncCombo();
  dncEsprit();
}

function dncAction() {

  // Set up icon changes from combat here

  if (actionList.dnc.indexOf(actionLog.groups.actionName) > -1) {

    if ("Fan Dance" == actionLog.groups.actionName) {
      removeIcon("fourfoldfeathers");
      dncFeathers();
    }

    else if ("Fan Dance II" == actionLog.groups.actionName) {
      removeIcon("fourfoldfeathers");
      if (Date.now() - previous.fandance2 > 1000) {
        count.targets = 1;
        previous.fandance2 = Date.now();
      }
      else {
        count.targets = count.targets + 1;
      }
      dncFeathers();
    }

    else if ("Fan Dance III" == actionLog.groups.actionName) {
      removeIcon("fandance3");
      if (Date.now() - previous.fandance3 > 1000) {
        count.targets = 1;
        previous.fandance3 = Date.now();
      }
      else {
        count.targets = count.targets + 1;
      }
    }

    else if ("Devilment" == actionLog.groups.actionName) {
      removeIcon("devilment");
      addCountdownBar({name: "devilment"});
    }

    else if ("Flourish" == actionLog.groups.actionName) {
      removeIcon("flourish");
      addCountdownBar({name: "flourish"});
    }

    else {  // GCD Action

      if ("Cascade" == actionLog.groups.actionName) {
        removeIcon("cascade");
        if (next.combo != 1) {
          addIcon({name: "fountain"});
        }
      }

      else if ("Fountain" == actionLog.groups.actionName) {
        removeIcon("fountain");
        dncCombo();
      }

      else if ("Windmill" == actionLog.groups.actionName) {
        removeIcon("windmill");
        if (next.combo != 2
        && player.level >= 25) {
          addIcon({name: "bladeshower"});
        }
      }

      else if ("Bladeshower" == actionLog.groups.actionName) {
        removeIcon("bladeshower");
        dncCombo();
      }

      else if ("Reverse Cascade" == actionLog.groups.actionName) {
        //removeIcon("reversecascade");
        dncFeathers();
      }

      else if ("Rising Windmill" == actionLog.groups.actionName) {
        //removeIcon("risingwindmill");
        dncFeathers();
      }

      else if ("Fountainfall" == actionLog.groups.actionName) {
        //removeIcon("fountainfall");
        dncFeathers();
      }

      else if ("Bloodshower" == actionLog.groups.actionName) {
        //removeIcon("bloodshower");
        dncFeathers();
      }

      else if ("Standard Step" == actionLog.groups.actionName) {
        removeIcon("standardstep");
        addCountdownBar({name: "standardstep", time: recast.standardstep, oncomplete: "addIcon"});
        let step = 1;
        for (step = 1; step <= 2; step++) {
          console.log(player.tempjobDetail["step" + step]);
          if (player.tempjobDetail["step" + step] == 1) {
            icon["step" + step] = icon.emboite;
          }
          else if (player.tempjobDetail["step" + step] == 2) {
            icon["step" + step] = icon.entrechat;
          }
          else if (player.tempjobDetail["step" + step] == 3) {
            icon["step" + step] = icon.jete;
          }
          else if (player.tempjobDetail["step" + step] == 4) {
            icon["step" + step] = icon.pirouette;
          }
          addIcon({name: "step" + step});
        }
      }

      else if (
      ["Standard Finish", "Single Standard Finish",
      "Double Standard Finish"].indexOf(actionLog.groups.actionName) > -1) {
        removeIcon("standardfinish");
        removeIcon("step1");
        removeIcon("step2");
        if (actionLog.groups.targetID.startsWith("4")) {
          if (Date.now() - previous.standardfinish > 1000) {
            count.targets = 1;
            previous.standardfinish = Date.now();
          }
          else {
            count.targets = count.targets + 1;
          }
        }
        if (player.level < 70
        && checkRecast("devilment") < 0) {
          addIcon({name: "devilment"});  // Not sure if this is best use before 70 but whatever
        }
      }

      else if ("Technical Step" == actionLog.groups.actionName) {
        removeIcon("technicalstep");
        addCountdownBar({name: "technicalstep", time: recast.technicalstep, oncomplete: "addIcon"});
      }

      else if (
      ["Technical Finish", "Single Technical Finish",
      "Double Technical Finish", "Triple Technical Finish",
      "Quadruple Technical Finish"].indexOf(actionLog.groups.actionName) > -1) {
        removeIcon("technicalfinish");
        removeIcon("step1");
        removeIcon("step2");
        removeIcon("step3");
        removeIcon("step4");
        if (actionLog.groups.targetID.startsWith("4")) {
          if (Date.now() - previous.technicalfinish > 1000) {
            count.targets = 1;
            previous.technicalfinish = Date.now();
          }
          else {
            count.targets = count.targets + 1;
          }
        }
        if (checkRecast("devilment") < 0) {
          addIcon({name: "devilment"});  // Heck not sure if this best use after 70
        }
      }

      else if (["Emboite", "Entrechat",
      "Jete", "Pirouette"].indexOf(actionLog.groups.actionName) > -1) {

        if (player.tempjobDetail.steps >= 1) {
          removeIcon("step1");
        }
        if (player.tempjobDetail.steps >= 2) {
          removeIcon("step2");
        }
        if (player.tempjobDetail.steps >= 3) {
          removeIcon("step3");
        }
        if (player.tempjobDetail.steps >= 4) {
          removeIcon("step4");
        }

        if (checkStatus("standardstep") > 0
        && player.tempjobDetail.steps >= 2) {
          addIcon({name: "standardfinish"});
        }
        else if (checkStatus("technicalstep") > 0
        && player.tempjobDetail.steps >= 4) {
          addIcon({name: "technicalfinish"});
        }
      }

      dncEsprit();

    }  // End of GCD section

  }

  dncPriority();
}

function dncStatus() {

  if (effectLog.groups.targetID == player.ID) {

    if ("Flourishing Cascade" == effectLog.groups.effectName) {
      if (effectLog.groups.gainsLoses == "gains") {
        addIcon({name: "reversecascade"});
        // addCountdownBar({name: "reversecascade", time: parseInt(effectLog.groups.effectDuration) * 1000});
        addStatus("flourishingcascade", player.ID, parseInt(effectLog.groups.effectDuration) * 1000);
        dncFlourishCheck();
      }
      else if (effectLog.groups.gainsLoses == "loses") {
        removeIcon("reversecascade");
        // removeCountdownBar("reversecascade");
        removeStatus("flourishingcascade");
        dncFlourishCheck();
      }
    }

    else if ("Flourishing Fountain" == effectLog.groups.effectName) {
      if (effectLog.groups.gainsLoses == "gains") {
        addIcon({name: "fountainfall"});
        // addCountdownBar({name: "fountainfall", time: parseInt(effectLog.groups.effectDuration) * 1000});
        addStatus("flourishingfountain", parseInt(effectLog.groups.effectDuration) * 1000);
        dncFlourishCheck();
      }
      else if (effectLog.groups.gainsLoses == "loses") {
        removeIcon("fountainfall");
        // removeCountdownBar("fountainfall");
        removeStatus("flourishingfountain");
        dncFlourishCheck();
      }
    }

    else if ("Flourishing Windmill" == effectLog.groups.effectName) {
      if (effectLog.groups.gainsLoses == "gains") {
        addIcon({name: "risingwindmill"});
        // addCountdownBar({name: "risingwindmill", time: parseInt(effectLog.groups.effectDuration) * 1000});
        addStatus("flourishingwindmill", parseInt(effectLog.groups.effectDuration) * 1000);
        dncFlourishCheck();
      }
      else if (effectLog.groups.gainsLoses == "loses") {
        removeIcon("risingwindmill");
        // removeCountdownBar("risingwindmill");
        removeStatus("flourishingwindmill");
        dncFlourishCheck();
      }
    }

    else if ("Flourishing Shower" == effectLog.groups.effectName) {
      if (effectLog.groups.gainsLoses == "gains") {
        addIcon({name: "bloodshower"});
        // addCountdownBar({name: "bloodshower", time: parseInt(effectLog.groups.effectDuration) * 1000});
        addStatus("flourishingshower", parseInt(effectLog.groups.effectDuration) * 1000);
        dncFlourishCheck();
      }
      else if (effectLog.groups.gainsLoses == "loses") {
        removeIcon("bloodshower");
        // removeCountdownBar("bloodshower");
        removeStatus("flourishingshower");
        dncFlourishCheck();
      }
    }

    else if ("Flourishing Fan Dance" == effectLog.groups.effectName) {
      if (effectLog.groups.gainsLoses == "gains") {
        addIcon({name: "fandance3"});
        // addCountdownBar({name: "fandance3", time: parseInt(effectLog.groups.effectDuration) * 1000});
        addStatus("flourishingfandance", parseInt(effectLog.groups.effectDuration) * 1000);
        dncFlourishCheck();
      }
      else if (effectLog.groups.gainsLoses == "loses") {
        removeIcon("fandance3");
        // removeCountdownBar("fandance3");
        removeStatus("flourishingfandance");
        dncFlourishCheck();
      }
    }

    else if ("Standard Step" == effectLog.groups.effectName) {
      if (effectLog.groups.gainsLoses == "gains") {
        addStatus("standardstep", parseInt(effectLog.groups.effectDuration) * 1000);
      }
      else if (effectLog.groups.gainsLoses == "loses") {
        removeStatus("standardstep");
      }
    }

    else if ("Standard Finish" == effectLog.groups.effectName) {
      if (effectLog.groups.gainsLoses == "gains") {
        addStatus("standardfinish", parseInt(effectLog.groups.effectDuration) * 1000);
      }
      else if (effectLog.groups.gainsLoses == "loses") {
        removeStatus("standardfinish");
      }
    }

    else if ("Technical Step" == effectLog.groups.effectName) {
      if (effectLog.groups.gainsLoses == "gains") {
        addStatus("technicalstep", parseInt(effectLog.groups.effectDuration) * 1000);
      }
      else if (effectLog.groups.gainsLoses == "loses") {
        removeStatus("technicalstep");
      }
    }

    else if ("Technical Finish" == effectLog.groups.effectName) {
      if (effectLog.groups.gainsLoses == "gains") {
        addStatus("technicalfinish", parseInt(effectLog.groups.effectDuration) * 1000);
      }
      else if (effectLog.groups.gainsLoses == "loses") {
        removeStatus("technicalfinish");
      }
    }
  }
}

function dncCombo() {

  removeIcon("cascade");
  removeIcon("fountain");

  if (count.targets >= 2
  && player.level >= 15) {
    addIcon({name: "windmill"});
    if (player.level >= 25) {
      addIcon({name: "bladeshower"});
    }
  }
  else {
    addIcon({name: "cascade"});
    addIcon({name: "fountain"});
  }
}

function dncFlourishCheck() {
  if (player.level >= 72) {
    if (Math.max(
    checkStatus("flourishingcascade"),
    checkStatus("flourishingfountain"),
    checkStatus("flourishingwindmill"),
    checkStatus("flourishingshower"),
    checkStatus("flourishingfandance")) < 0) {
      addCountdownBar({name: "flourish", time: checkRecast("flourish"), text: "OK"})
      if (checkRecast("flourish") < 0) {
        addIcon({name: "flourish"});
      }
      else {
        removeIcon("flourish");
      }
    }
    else {
      removeIcon("flourish");
      addCountdownBar({name: "flourish", time: checkRecast("flourish"), text: "WAIT"});
    }
  }
}

function dncFeathers() {

  if (player.level >= 50
  && count.targets > 2) {
    icon.fourfoldfeathers = icon.fandance2;
  }
  else {
    icon.fourfoldfeathers = icon.fandance;
  }

  if (player.tempjobDetail.tempfourfoldfeathers == 4) {
    addIcon({name: "fourfoldfeathers"});
  }
  else {
    removeIcon("fourfoldfeathers");
  }
}

function dncEsprit() {
  if (checkStatus("technicalfinish") > 0) {
    maxEsprit = 50;
  }
  else {
    maxEsprit = 80;
  }
  if (player.tempjobDetail.tempesprit >= maxEsprit) {
    addIcon({name: "saberdance"});
  }
  else {
    removeIcon("saberdance");
  }
}


function dncPriority() {

  if (count.targets >= 2) {
    nextid.technicalstep = 0;
    nextid.saberdance = 1;
    nextid.technicalfinish = nextid.technicalstep;
    nextid.standardstep = 2;
    nextid.standardfinish = nextid.standardstep;
    nextid.bloodshower = 3;
    nextid.risingwindmill = 4;
    nextid.fountainfall = 5;
    nextid.reversecascade = 6;
    nextid.windmill = 8;
    nextid.cascade = nextid.windmill;
    nextid.bladeshower = 9;
    nextid.fountain = nextid.bladeshower;
  }

  else {
    nextid.technicalstep = 0;
    nextid.technicalfinish = nextid.technicalstep;
    nextid.standardstep = 1;
    nextid.standardfinish = nextid.standardstep;
    nextid.saberdance = 2;
    nextid.fountainfall = 3;
    nextid.reversecascade = 4;
    nextid.bloodshower = 5;
    nextid.risingwindmill = 6;
    nextid.cascade = 8;
    nextid.windmill = nextid.cascade;
    nextid.fountain = 9;
    nextid.bladeshower = nextid.fountain;
  }

  if (checkStatus("standardfinish") > 5000 && count.targets >= 5) {
    removeIcon("standardstep");
    removeCountdownBar("standardstep");
  }

  if (count.targets >= 3) {
    removeIcon("fountainfall");
    removeIcon("reversecascade");
  }
}

"use strict";

// GCD Combo
// Jumps Dives and pew pew
// Other cooldowns
// player.jobDetail.bloodMilliseconds + " | " + player.jobDetail.lifeMilliseconds + " | " + player.jobDetail.eyesAmount

var drgBlood;
var drgLife;
var drgGaze;

var diveStatus = 0;
var chaosStatus = 0;
var fangStatus = 0;
var heavyStatus = 0;
var wheelStatus = 0;

var jumpTimeout;
var spineshatterTimeout;
var dragonfireTimeout;

var bloodCooldown = 0; // Blood for Blood
var dragonCooldown = 0; // Blood of the Dragon
var dragonfireCooldown = 0;
var geirskogulCooldown = 0;
var jumpCooldown = 0;
var nastrondCooldown = 0;
var sightCooldown = 0; // Dragon Sight
var spineshatterCooldown = 0;
var surgeCooldown = 0; // Life Surge

actionList.drg = [

  // Off-GCD
  "Life Surge", "Lance Charge", "Jump", "Spineshatter Dive", "Battle Litany",
  "Blood Of The Dragon", "Dragon Sight", "Mirage Dive", "High Jump",
  // AoE
  "Dragonfire Dive", "Geirskogul", "Nastrond", "Stardiver",

  // GCD
  "True Thrust", "Vorpal Thrust", "Piercing Talon", "Disembowel", "Full Thrust",
  "Chaos Thrust", "Fang And Claw", "Wheeling Thrust", "Raiden Thrust",
  // AoE
  "Doom Spike", "Sonic Thrust", "Coerthan Torment"//,

  // Role
  // "Second Wind", "Leg Sweep", "Bloodbath", "Feint", "Arm\'s Length",
  // "True North"
];

function drgJobChange() {

  nextid.combo1 = 0;
  nextid.combo2 = nextid.combo1 + 1;
  nextid.combo3 = nextid.combo1 + 2;
  nextid.combo4 = nextid.combo1 + 3;
  nextid.combo5 = nextid.combo1 + 4;

  nextid.truethrust = nextid.combo1;
  nextid.raidenthrust = nextid.combo1;
  nextid.doomspike = nextid.combo1;

  nextid.vorpalthrust = nextid.combo2;
  nextid.disembowel = nextid.combo2;
  nextid.sonicthrust = nextid.combo2;

  nextid.fullthrust = nextid.combo3;
  nextid.chaosthrust = nextid.combo3;
  nextid.coerthantorment = nextid.combo3;

  nextid.bloodofthedragon = 10;
  nextid.dragonsight = 11;
  nextid.stardiver = 12;
  nextid.geirskogul = 13;
  nextid.nastrond = nextid.geirskogul;
  nextid.lifesurge = 14;
  nextid.lancecharge = 15;
  nextid.jump = 16;
  nextid.miragedive = nextid.jump;
  nextid.spineshatterdive = nextid.jump + 1;
  nextid.dragonfiredive = nextid.jump + 2;

  nextid.battlelitany = 19;

  if (player.level >= 74) {
    icon.jump = icon.highjump;
  }
  else {
    icon.jump = "002576";
  }

  if (player.level >= 30) {
    addCountdownBar({name: "jump", time: checkRecast("jump")});
  }

  if (player.level >= 54
  && Math.max(player.jobDetail.bloodMilliseconds, player.jobDetail.lifeMilliseconds) < 500) {
    addCountdownBar({name: "bloodofthedragon", time: checkRecast("bloodofthedragon"), oncomplete: "addIcon"});
  }

}


function drgPlayerChangedEvent() {

  if (player.level >= 54
  && Math.max(player.jobDetail.bloodMilliseconds, player.jobDetail.lifeMilliseconds) < 500) {

    if (checkRecast("bloodofthedragon") < 500) {
      removeIcon("jump");
      removeIcon("spineshatterdive");
    }

    removeIcon("fangandclaw");
    removeIcon("wheelingthrust");
    removeIcon("geirskogul");
    removeIcon("stardiver");
    addCountdownBar({name: "bloodofthedragon", time: checkRecast("bloodofthedragon"), oncomplete: "addIcon"});
  }

}


function drgAction() {

  if (actionList.drg.indexOf(actionLog.groups.actionName) > -1) {

    // Non-GCD

    if ("Life Surge" == actionLog.groups.actionName) {
      addRecast("lifesurge");
    }

    else if ("Lance Charge" == actionLog.groups.actionName) {
      addRecast("lancecharge");
    }

    else if (["Jump", "High Jump"].indexOf(actionLog.groups.actionName)) {
      addRecast("jump");
    }

    else if ("Elusive Jump" == actionLog.groups.actionName) {
      addRecast("elusivejump");
    }

    else if ("Sentinel" == actionLog.groups.actionName) {
      addRecast("sentinel");
    }

    else if ("Cover" == actionLog.groups.actionName) {
      addRecast("cover");
    }

    else if ("Divine Veil" == actionLog.groups.actionName) {
      addRecast("divineveil");
    }

    else if ("Intervention" == actionLog.groups.actionName) {
      addRecast("intervention");
    }

    else if ("Requiescat" == actionLog.groups.actionName) {
      removeIcon("requiescat");
      addStatus("requiescat");
      addRecast("requiescat");
      addCountdownBar({name: "requiescat"});

      pldRequiescatMP();
    }

    else if ("Passage Of Arms" == actionLog.groups.actionName) {
      addRecast("passageofarms");
    }

    else if ("Intervene" == actionLog.groups.actionName) {
      if (checkRecast("intervene2") < 0) {
        addRecast("intervene1", -1);
        addRecast("intervene2");
      }
      else {
        addRecast("intervene1", checkRecast("intervene2"));
        addRecast("intervene2", checkRecast("intervene2") + recast.intervene);
      }
    }

    else if ("Circle Of Scorn" == actionLog.groups.actionName) {
      if (Date.now() - previous.circleofscorn > 1000) {
        previous.circleofscorn = Date.now();
        count.targets = 1;
        addRecast("circleofscorn");
      }
      else {
        count.targets = count.targets + 1;
      }
    }

    // GCD actions - affect combos

    // else if ("Bloodspiller" == actionLog.groups.actionName) {
    //   removeIcon("bloodspiller");
    // }

    // GCD actions - affect combos, catch all)

    else {

      if ("Fast Blade" == actionLog.groups.actionName
      && actionLog.groups.result.length > 1) {
        if (next.combo > 2) {
          pldSingleTargetCombo();
          toggle.combo = Date.now();
        }
        removeIcon("fastblade");
        pldComboTimeout();
      }

      else if ("Riot Blade" == actionLog.groups.actionName
      && actionLog.groups.result.length > 6) {
        if (player.level < 26) {
          pldCombo();
        }
        else {
          removeIcon("fastblade");
          removeIcon("riotblade");
          pldComboTimeout();
        }
      }

      else if ("Goring Blade" == actionLog.groups.actionName
      && actionLog.groups.result.length > 6) {
        addStatus("goringblade", duration.goringblade, actionLog.groups.targetID);
        pldCombo();
      }

      else if ("Royal Authority" == actionLog.groups.actionName
      && player.level >= 76
      && actionLog.groups.result.length > 6) {
        removeIcon("royalauthority");
        count.atonement = 3;
        addIcon({name: "atonement1"});
        addIcon({name: "atonement2"});
        addIcon({name: "atonement3"});
        pldGoringBladeCombo();
      }

      else if ("Atonement" == actionLog.groups.actionName
      && actionLog.groups.result.length > 1) {
        count.atonement = count.atonement - 1;
        if (count.atonement == 2) {
          removeIcon("atonement1");
        }
        else if (count.atonement == 1) {
          removeIcon("atonement2");
        }
        if (count.atonement == 0) {
          removeIcon("atonement3");
        }
      }

      else if ("Total Eclipse" == actionLog.groups.actionName
      && actionLog.groups.result.length > 1) {

        if (Date.now() - previous.totaleclipse > 1000) {
          previous.totaleclipse = Date.now();
          count.targets = 1;
          if (next.combo < 3) {
            pldAreaOfEffectCombo();
          }
          removeIcon("totaleclipse");
          if (player.level < 40) {
            pldCombo();
          }
          else {
            toggle.combo = Date.now();
            pldComboTimeout();
          }
        }
        else {
          count.targets = count.targets + 1;
          pldCombo();
        }
      }

      else if ("Prominence" == actionLog.groups.actionName
      && actionLog.groups.result.length > 6) {

        if (Date.now() - previous.prominence > 1000) {
          previous.prominence = Date.now();
          count.targets = 1;
        }
        else {
          count.targets = count.targets + 1;
        }
        pldCombo();
      }

      else if ("Holy Spirit" == actionLog.groups.actionName
      && actionLog.groups.result.length > 1) {
        pldRequiescatMP();
      }

      else if ("Holy Circle" == actionLog.groups.actionName
      && actionLog.groups.result.length > 1) {
        if (Date.now() - previous.holycircle > 1000) {
          previous.holycircle = Date.now();
          count.targets = 1;
        }
        else {
          count.targets = count.targets + 1;
        }
        pldRequiescatMP();
      }

      else if ("Confiteor" == actionLog.groups.actionName
      && actionLog.groups.result.length > 1) {
        if (Date.now() - previous.confiteor > 1000) {
          previous.confiteor = Date.now();
          count.targets = 1;
        }
        else {
          count.targets = count.targets + 1;
        }
        pldRequiescatMP()
      }

      else {
        pldCombo();
      }
    }
  }
}


function drgStatus() {

  if (effectLog.groups.targetID == player.ID) { // Target is self

    if ("Life Surge" == effectLog.groups.effectName) {
      if (effectLog.groups.gainsLoses == "gains") {
        addStatus("lifesurge", parseInt(effectLog.groups.effectDuration) * 1000, effectLog.groups.targetID);
      }
      else if (effectLog.groups.gainsLoses == "loses") {
        removeStatus("lifesurge");
      }
    }

    else if ("Lance Charge" == effectLog.groups.effectName) {
      if (effectLog.groups.gainsLoses == "gains") {
        addStatus("lancecharge", parseInt(effectLog.groups.effectDuration) * 1000, effectLog.groups.targetID);
      }
      else if (effectLog.groups.gainsLoses == "loses") {
        removeStatus("lancecharge");
      }
    }

    else if ("Disembowel" == effectLog.groups.effectName) {
      if (effectLog.groups.gainsLoses == "gains") {
        addStatus("disembowel", parseInt(effectLog.groups.effectDuration) * 1000, effectLog.groups.targetID);
      }
      else if (effectLog.groups.gainsLoses == "loses") {
        removeStatus("disembowel");
      }
    }

    else if ("Battle Litany" == effectLog.groups.effectName) {
      if (effectLog.groups.gainsLoses == "gains") {
        addStatus("battlelitany", parseInt(effectLog.groups.effectDuration) * 1000, effectLog.groups.targetID);
      }
      else if (effectLog.groups.gainsLoses == "loses") {
        removeStatus("battlelitany");
      }
    }

    else if ("Sharper Fang And Claw" == effectLog.groups.effectName) {
      if (effectLog.groups.gainsLoses == "gains") {
        addStatus("sharperfangandclaw", parseInt(effectLog.groups.effectDuration) * 1000, effectLog.groups.targetID);
      }
      else if (effectLog.groups.gainsLoses == "loses") {
        removeIcon("fangandclaw");
        removeStatus("sharperfangandclaw");
      }
    }

    else if ("Enhanced Wheeling Thrust" == effectLog.groups.effectName) {
      if (effectLog.groups.gainsLoses == "gains") {
        addStatus("enhancedwheelingthrust", parseInt(effectLog.groups.effectDuration) * 1000, effectLog.groups.targetID);
      }
      else if (effectLog.groups.gainsLoses == "loses") {
        removeIcon("wheelingthrust");
        removeStatus("enhancedwheelingthrust");
      }
    }

    else if ("Right Eye" == effectLog.groups.effectName) {
      if (effectLog.groups.gainsLoses == "gains") {
        addStatus("righteye", parseInt(effectLog.groups.effectDuration) * 1000, effectLog.groups.targetID);
      }
      else if (effectLog.groups.gainsLoses == "loses") {
        removeStatus("righteye");
      }
    }

    else if ("Dive Ready" == effectLog.groups.effectName) {
      if (effectLog.groups.gainsLoses == "gains") {
        addStatus("diveready", parseInt(effectLog.groups.effectDuration) * 1000, effectLog.groups.targetID);
        addIcon({name: "miragedive"});
      }
      else if (effectLog.groups.gainsLoses == "loses") {
        removeStatus("diveready");
        removeIcon("miragedive");
      }
    }

    else if ("Raiden Thrust Ready" == effectLog.groups.effectName) {
      if (effectLog.groups.gainsLoses == "gains") {
        addStatus("raidenthrustready", parseInt(effectLog.groups.effectDuration) * 1000, effectLog.groups.targetID);
      }
      else if (effectLog.groups.gainsLoses == "loses") {
        removeStatus("raidenthrustready");
      }
    }

  }

  else { // Target is not self

    if ("Chaos Thrust" == effectLog.groups.effectName) {
      if (effectLog.groups.gainsLoses == "gains") {
        addStatus("chaosthrust", parseInt(effectLog.groups.effectDuration) * 1000, effectLog.groups.targetID)
      }
      else if (effectLog.groups.gainsLoses == "loses") {
        removeStatus("swordoath", effectLog.groups.targetID);
      }
    }

  }
}


function drgCombo() {

  delete toggle.combo;
  delete next.combo;

  removeIcon("combo1");
  removeIcon("combo2");
  removeIcon("combo3");
  removeIcon("combo4");
  removeIcon("combo5");

  if (count.targets >= 3) {
    drgAreaOfEffectCombo();
  }
  else {
    drgSingleTargetCombo();
  }
}


function drgSingleTargetCombo() {
  if (player.level >= 64
  && checkStatus("chaosthrust", target.ID) < 8 * 2500) {
    drgChaosThrustCombo();
  }
  else if (player.level >= 56
  && checkStatus("chaosthrust", target.ID) < 7 * 2500) {
    drgChaosThrustCombo();
  }
  else if (player.level >= 50
  && checkStatus("chaosthrust", target.ID) < 6 * 2500) {
    drgChaosThrustCombo();
  }
  else if (player.level >= 64
  && checkStatus("disembowel", player.ID) < 7 * 2500) {
    drgChaosThrustCombo();
  }
  else if (player.level >= 56
  && checkStatus("disembowel", player.ID) < 6 * 2500) {
    drgChaosThrustCombo();
  }
  else if (player.level >= 26
  && checkStatus("disembowel", player.ID) < 5 * 2500) {
    drgChaosThrustCombo();
  }
  else if (player.level >= 18
  && checkStatus("disembowel", player.ID) < 4 * 2500) {
    drgChaosThrustCombo();
  }
  else {
    drgFullThrustCombo();
  }
}


function drgAreaOfEffectCombo() {
  if (player.level >= 72
  && checkStatus("disembowel", player.ID) < 5 * 2500) {
    drgDisembowelCombo();
  }
  else if (player.level >= 62
  && checkStatus("disembowel", player.ID) < 4 * 2500) {
    drgDisembowelCombo();
  }
  else if (player.level >= 40
  && checkStatus("disembowel", player.ID) < 3 * 2500) {
    drgDisembowelCombo();
  }
  else {
    drgCoerthanTormentCombo();
  }
}


function drgFullThrustCombo() {
  next.combo = 1;
  addIcon({name: "truethrust"});
  addIcon({name: "vorpalthrust"});
  if (player.level >= 26) {
    addIcon({name: "fullthrust"});
  }
  if (player.level >= 56) {
    nextid.combo4 = nextid.fangandclaw;
    addIcon({name: "fangandclaw"});
  }
  if (player.level >= 64) {
    nextid.combo5 = nextid.wheelingthrust;
    addIcon({name: "wheelingthrust"});
  }
}


function drgChaosThrustCombo() {
  next.combo = 2;
  addIcon({name: "truethrust"});
  addIcon({name: "disembowel"});
  if (player.level >= 50) {
    addIcon({name: "chaosthrust"});
  }
  if (player.level >= 58) {
    nextid.combo4 = nextid.fangandclaw;
    addIcon({name: "wheelingthrust"});
  }
  if (player.level >= 64) {
    nextid.combo5 = nextid.wheelingthrust;
    addIcon({name: "fangandclaw"});
  }
}

function drgCoerthanTormentCombo() {
  next.combo = 11;
  addIcon({name: "doomspike"});
  if (player.level >= 62) {
    addIcon({name: "sonicthrust"});
  }
  if (player.level >= 72) {
    addIcon({name: "coerthantorment"});
  }
}


function drgDisembowelCombo() {
  next.combo = 12;
  addIcon({name: "truethrust"});
  addIcon({name: "disembowel"});
}


function drgComboTimeout() {
  clearTimeout(timeout.combo);
  timeout.combo = setTimeout(drgCombo, 12500);
}

"use strict";

// Define actions to watch for

actionList.drk = [

  // Role actions
  "Rampart", "Arm\'s Length",

  // AoE actions
  "Unleash", "Stalwart Soul", "Flood Of Darkness", "Flood Of Shadow", "Quietus", "Abyssal Drain",
  // Unleash, Stalwart Soul: 2 or more
  // Flood: 2 or more (after level 40)
  // Quietus: 3 or more
  // Abyssal Drain: /shrug

  // Single target actions
  "Hard Slash", "Syphon Strike", "Souleater", "Edge Of Darkness", "Edge Of Shadow", "Bloodspiller",
  // Souleater combo: 1
  // Edge: 1
  // Bloodspiller: 1-2

  // Everything else
  "Unmend",
  "Blood Weapon", "Plunge", "Carve And Spit", "Delirium", "Living Shadow",
  "Shadow Wall", "Dark Mind", "The Blackest Night"
];


function drkJobChange() {

  nextid.mitigation = 0;
  nextid.rampart = nextid.mitigation;
  nextid.shadowwall = nextid.mitigation;
  nextid.theblackestnight = 1;
  nextid.gaugespender = 2;
  nextid.bloodspiller = nextid.gaugespender;
  nextid.quietus = nextid.gaugespender;
  nextid.livingshadow = nextid.gaugespender;
  nextid.hardslash = 3;
  nextid.unleash = nextid.hardslash;
  nextid.syphonstrike = 4;
  nextid.souleater = 5;
  nextid.stalwartsoul = nextid.souleater;
  nextid.floodofdarkness = 10;
  nextid.edgeofdarkness = nextid.floodofdarkness;
  nextid.delirium = 11;
  nextid.bloodweapon = 12;
  nextid.carveandspit = 13;
  nextid.plunge = 14;

  countdownid.delirium = 0;

  previous.unleash = 0;
  previous.stalwartsoul = 0;
  previous.floodofdarkness = 0;
  previous.quietus = 0;
  previous.abyssaldrain = 0;

    if (player.level >= 68) {
      addCountdownBar({name: "delirium", time: checkRecast("delirium"), oncomplete: "addIcon"});
    }
  drkCombo();
  drkGauge();


}

function drkPlayerChangedEvent() {
  drkMP(); // Also handles Dark Arts and such
}

function drkAction() {

  if (actionList.drk.indexOf(actionLog.groups.actionName) > -1) {

    // These actions don't break combo

    if ("Delirium" == actionLog.groups.actionName) {
      removeIcon("delirium");
      addStatus("delirium");
      addRecast("delirium");
      addCountdownBar({name: "delirium", time: recast.delirium, oncomplete: "addIcon"});
      drkGauge();
    }

    else if (["Flood Of Darkness", "Edge Of Darkness", "Flood Of Shadow", "Edge Of Shadow"].indexOf(actionLog.groups.actionName) > -1) {
      removeIcon("floodofdarkness");
      addRecast("floodofdarkness");
      drkMP();
    }

    else if ("Blood Weapon" == actionLog.groups.actionName) {
      removeIcon("bloodweapon");
      addRecast("bloodweapon");
      addIconBlinkTimeout("bloodweapon", recast.bloodweapon, nextid.bloodweapon, icon.bloodweapon);
    }

    else if ("Salted Earth" == actionLog.groups.actionName) {
      removeIcon("saltedearth");
      addRecast("carveandspit");
      addIconBlinkTimeout("carveandspit", recast.saltedearth, nextid.saltedearth, icon.saltedearth);
    }

    else if ("Abyssal Drain" == actionLog.groups.actionName) {
      if (Date.now() - previous.abyssaldrain > 1000) {
        previous.abyssaldrain = Date.now();
        count.targets = 1;
      }
      else {
        count.targets = count.targets + 1;
      }
      //removeIcon("abyssaldrain");
      //addRecast("abyssaldrain");
      //addIconBlinkTimeout("abyssaldrain", recast.abyssaldrain, nextid.abyssaldrain, icon.abyssaldrain);
    }

    else if ("Carve And Spit" == actionLog.groups.actionName) {
      removeIcon("carveandspit");
      addRecast("carveandspit");
      addIconBlinkTimeout("carveandspit", recast.carveandspit, nextid.carveandspit, icon.carveandspit);
    }

    else if ("Plunge" == actionLog.groups.actionName) { // Code treats Infuriate like two different skills to juggle the charges.
      if (player.level >= 78) {
        if (checkRecast("plunge2", player.ID) < 0) {
          addRecast("plunge1", player.ID, -1);
          addRecast("plunge2");
        }
        else {
          removeIcon("plunge");
          addRecast("plunge1", player.ID, checkRecast("plunge2", player.ID));
          addRecast("plunge2", player.ID, checkRecast("plunge2", player.ID) + recast.plunge);
          addIconBlinkTimeout("plunge", checkRecast("plunge1", player.ID), nextid.plunge, icon.plunge);
        }
      }
      else {
        addRecast("plunge");
        addIconBlinkTimeout("plunge", recast.plunge, nextid.plunge, icon.plunge);
      }
    }

    else if ("The Blackest Night" == actionLog.groups.actionName) {
      addRecast("theblackestnight");
      removeIcon("theblackestnight");
    }

    else if ("Shadow Wall" == actionLog.groups.actionName) {
      addRecast("shadowwall");
      removeIcon("shadowwall");
    }

    else if ("Rampart" == actionLog.groups.actionName) {
      addRecast("rampart");
      removeIcon("rampart");
    }

    else { // GCD actions

      if ("Bloodspiller" == actionLog.groups.actionName) {
        removeIcon("bloodspiller");
      }

      else if ("Quietus" == actionLog.groups.actionName) {
        if (Date.now() - previous.quietus > 1000) {
          previous.quietus = Date.now();
          count.targets = 1;
        }
        else {
          count.targets = count.targets + 1;
        }
        removeIcon("quietus");
      }

      // These actions affect combo

      else if ("Hard Slash" == actionLog.groups.actionName
      && actionLog.groups.result.length >= 2) {
        count.targets = 1;
        if (next.combo != 1) {
          drkSouleaterCombo();
          toggle.combo = Date.now();
        }
        removeIcon("hardslash");
        drkComboTimeout();
      }

      else if ("Syphon Strike" == actionLog.groups.actionName
      && actionLog.groups.result.length >= 8) {
        if (player.level < 26) {
          drkCombo();
        }
        else {
          removeIcon("hardslash");
          removeIcon("syphonstrike");
          drkComboTimeout();
        }
      }

      else if ("Souleater" == actionLog.groups.actionName
      && actionLog.groups.result.length >= 8) {
        drkCombo();
      }

      else if ("Unleash" == actionLog.groups.actionName
      && actionLog.groups.result.length >= 2) {

        if (Date.now() - previous.unleash > 1000) {
          previous.unleash = Date.now();
          count.targets = 1;
          removeIcon("unleash");

          if (next.combo != 2) {
            drkStalwartSoulCombo();
          }

          if (player.level < 72) {
            drkCombo();
          }
          else {
            toggle.combo = Date.now();
            drkComboTimeout();
          }
        }
        else {
          count.targets = count.targets + 1;
        }
      }

      else if ("Stalwart Soul" == actionLog.groups.actionName
      && actionLog.groups.result.length >= 8) {
        if (Date.now() - previous.stalwartsoul > 1000) {
          previous.stalwartsoul = Date.now();
          count.targets = 1;
          drkCombo();
        }
        else {
          count.targets = count.targets + 1;
        }
      }

      else {
        drkCombo();
      }

      if (count.targets >= 3
      && checkStatus("mitigation", effectLog.groups.targetID) < 1000) {
        drkMitigation();
      }
      else {
        removeIcon("rampart");
      }

      drkMP(); // Check MP after all GCD actions
      drkGauge(); // Check gauge after all GCD actions
    }
  }
}

function drkStatus() {

  if (effectLog.groups.targetID == player.ID) { // Target is self

    if ("Delirium" == effectLog.groups.effectName) {
      if (effectLog.groups.gainsLoses == "gains") {
        addStatus("delirium", parseInt(effectLog.groups.effectDuration) * 1000, effectLog.groups.targetID);
      }
      else if (effectLog.groups.gainsLoses == "loses") {
        removeStatus("delirium");
      }
    }

    else if ("Rampart" == effectLog.groups.effectName) {
      if (effectLog.groups.gainsLoses == "gains") {
        if (checkStatus("mitigation", effectLog.groups.targetID) < parseInt(effectLog.groups.effectDuration) * 1000) {
          addStatus("mitigation", parseInt(effectLog.groups.effectDuration) * 1000, effectLog.groups.targetID);
        }
      }
      else if (effectLog.groups.gainsLoses == "loses") {
        if (checkStatus("mitigation", effectLog.groups.targetID) < 0 // Check for overlaps
        && count.targets >= 3) {
          drkMitigation();
        }
      }
    }

    else if ("Dark Wall" == effectLog.groups.effectName) {
      if (effectLog.groups.gainsLoses == "gains") {
        if (checkStatus("mitigation", effectLog.groups.targetID) < parseInt(effectLog.groups.effectDuration) * 1000) {
          addStatus("mitigation", parseInt(effectLog.groups.effectDuration) * 1000, effectLog.groups.targetID);
        }
      }
      else if (effectLog.groups.gainsLoses == "loses") {
        if (checkStatus("mitigation", effectLog.groups.targetID) < 0
        && count.targets >= 3) {
          drkMitigation();
        }
      }
    }
  }
}


function drkMitigation() {

  // Shows next mitigation cooldown

  if (player.level >= 38) {
    if (checkRecast("darkwall") <= checkRecast("rampart")) {
      addIconBlinkTimeout("darkwall",checkRecast("darkwall"),nextid.mitigation,icon.darkwall);
    }
    else if (checkRecast("rampart") <= checkRecast("darkwall")) {
      addIconBlinkTimeout("mitigation",checkRecast("rampart"),nextid.mitigation,icon.rampart);
    }
  }

  else {
    addIconBlinkTimeout("mitigation",checkRecast("rampart"),nextid.mitigation,icon.rampart);
  }
}

function drkMP() {

  player.tempjobDetail.darkarts = player.debugJobSplit[4]; // 0 or 1

  if (player.level >= 74) {
    if (count.targets >= 2) {
      icon.floodofdarkness = icon.floodofshadow;
    }
    else {
      icon.floodofdarkness = icon.edgeofshadow;
    }
  }
  else if (player.level >= 40
  && count.targets == 1) {
    icon.floodofdarkness = icon.edgeofdarkness;
  }
  else {
    icon.floodofdarkness = "003082";
  }

  if (player.level >= 70) {
    if (player.currentMP >= 6000
    || player.tempjobDetail.darkarts == 1) {
      addIcon({name: "floodofdarkness"});
    }
    else {
      removeIcon("floodofdarkness");
    }
  }
  else if (player.level >= 30) { // No TBN yet
    if (player.currentMP >= 3000) {
      addIcon({name: "floodofdarkness"});
    }
    else {
      removeIcon("floodofdarkness");
    }
  }
}

function drkGauge() {

  let targetblood = 50; // Use spender at or above this number

  if (player.level >= 64
  && count.targets >= 3) {
    icon.gaugespender = icon.quietus;
  }
  else {
    icon.gaugespender = icon.bloodspiller;
  }

  if (checkStatus("delirium", player.ID) > 0) {
    targetblood = 0;
  }
  else if (player.level >= 80
  && checkRecast("livingshadow") < 20000) { // Is this enough?
    targetblood = 100; // Try to have a buffer for Living Shadow
  }

  if (player.jobDetail.blood >= targetblood) {
    if (player.level >= 80
    && checkRecast("livingshadow") < 1000) {
      addIcon({name: "gaugespender"});
    }
    else if (player.level >= 62) {
      addIcon({name: "gaugespender"});
    }
  }
  else {
    removeIcon("gaugespender");
  }
}

function drkCombo() {

  delete toggle.combo;
  delete next.combo;

  removeIcon("hardslash");
  removeIcon("syphonstrike");
  removeIcon("souleater");

  if (count.targets >= 2) {
    drkStalwartSoulCombo();
  }
  else {
    drkSouleaterCombo();
  }
}

function drkSouleaterCombo() {
  next.combo = 1;
  addIcon({name: "hardslash"});
  addIcon({name: "syphonstrike"});
  if (player.level >= 26) {
    addIcon({name: "souleater"});
  }
}

function drkStalwartSoulCombo() {
  next.combo = 2;
  addIcon({name: "unleash"});
  if (player.level >= 74) {
    addIcon({name: "stalwartsoul"});
  }
}

function drkComboTimeout() {
  clearTimeout(timeout.combo);
  timeout.combo = setTimeout(drkCombo, 12500);
}

// Duration properties - list by alphabetical job then alphabetical status

const duration = {};

// Role
duration.swiftcast = 10000;


// BLM
duration.sharpcast = 15000;
duration.thunder = 18000;
duration.thunder2 = 12000;
duration.thunder3 = 24000;
duration.thunder4 = 18000;
duration.triplecast = 15000;

// BRD
duration.straightshotready = 10000;
duration.venomousbite = 30000;
duration.windbite = duration.venomousbite;

// DRK
duration.delirium = 10000;

// GNB
duration.nomercy = 20000;

// MCH
duration.hypercharge = 10000;

// MNK
duration.twinsnakes = 15000;
duration.demolish = 18000;
duration.leadenfist = 30000;
duration.perfectbalance = 10000;
duration.riddleoffire = 20000;

// NIN
duration.shadowfang = 24000;
duration.mudra = 5000;
duration.doton = 24000;
duration.suiton = 20000;
duration.kassatsu = 15000;
duration.assassinateready = 10000;
duration.tenchijin = 10000;
duration.bunshin = 15000;

// PLD
duration.fightorflight = 25000;
duration.ironwill = 999999;
duration.sheltron = 6000;
duration.sentinel = 10000;
// duration.cover = 12000;
// duration.circleofscorn = 15000;
duration.hallowedground = 10000;
duration.goringblade = 21000;
// duration.divineveil = 30000;
duration.requiescat = 12000;
duration.swordoath = 15000;

// SAM
duration.jinpu = 40000;
duration.kaiten = 10000;
duration.meikyoshisui = 15000;
duration.shifu = 40000;

// WAR
duration.stormseye = 30000;

// WHM
duration.aero = 18000;
duration.aero2 = 18000;
duration.dia = 30000;
duration.regen = 18000;

"use strict";

actionList.gnb = [

  // Non-GCD
  "No Mercy",
  "Danger Zone", "Blasting Zone",
  "Rough Divide",
  "Bow Shock",
  // "Jugular Rip", "Abdomen Tear", "Eye Gouge",
  "Bloodfest",


  // GCD
  "Keen Edge", "Brutal Shell", "Solid Barrel",
  "Demon Slice", "Demon Slaughter",
  "Sonic Break",
  "Burst Strike", "Fated Circle",
  "Gnashing Fang", "Savage Claw", "Wicked Talon"

];

function gnbJobChange() {

  nextid.gnashingfang = 0;
  nextid.savageclaw = 1;
  nextid.wickedtalon = 2;
  nextid.sonicbreak = 3;
  nextid.burststrike1 = 4;
  nextid.keenedge = 5;
  nextid.demonslice = nextid.keenedge;
  nextid.brutalshell = 6;
  nextid.burststrike2 = 7;
  nextid.solidbarrel = 8;
  nextid.demonslaughter = nextid.solidbarrel;

  nextid.nomercy = 10;
  nextid.bloodfest = 11;
  nextid.continuation = 12;
  nextid.dangerzone = 13;
  nextid.bowshock = 14;
  nextid.roughdivide = 15;

  countdownid.nomercy = 0;
  countdownid.gnashingfang = 1;
  countdownid.sonicbreak = 2;
  countdownid.roughdivide = 3;

  previous.demonslice = 0;
  previous.demonslaughter = 0;
  previous.bowshock = 0;
  previous.fatedcircle = 0;

  previous.gnashingfang = 0;
  previous.sonicbreak = 0;

  // Show available cooldowns

  if (player.level >= 80) {
    icon.dangerzone = icon.blastingzone;
  }

  addCountdownBar({name: "nomercy", time: checkRecast("nomercy"), oncomplete: "addIcon"});

  gnbCartridge();
  gnbCombo();
}

function gnbAction() {

  if (actionList.gnb.indexOf(actionLog.groups.actionName) > -1) {

    if ("No Mercy" == actionLog.groups.actionName) {
      addStatus("nomercy");
      addRecast("nomercy");
      addCountdownBar({name: "nomercy", time: checkRecast("nomercy"), oncomplete: "addIcon"});
      gnbCartridge();
    }

    else if (["Danger Zone", "Blasting Zone"].indexOf(actionLog.groups.actionName) > -1) {

    }

    else if ("Rough Divide" == actionLog.groups.actionName) {

    }

    else if ("Bow Shock" == actionLog.groups.actionName) {
      if (Date.now() - previous.bowshock > 1000) {
        count.targets = 1;
        previous.bowshock = Date.now();
      }
      else {
        count.targets = count.targets + 1;
      }
    }

    else if ("Bloodfest" == actionLog.groups.actionName) {

    }

    else {  // GCD Action

      if ("Keen Edge" == actionLog.groups.actionName
      && actionLog.groups.result.length >= 2) {
        if (next.combo != 1) {
          gnbSolidBarrelCombo();
        }
        removeIcon("keenedge");
      }

      else if ("Brutal Shell" == actionLog.groups.actionName
      && actionLog.groups.result.length >= 2) {
        removeIcon("brutalshell");
        if (player.level < 26) {
          gnbCombo();
        }
      }

      else if ("Solid Barrel" == actionLog.groups.actionName) {
        removeIcon("solidbarrel");
        gnbCombo();
      }

      else if ("Demon Slice" == actionLog.groups.actionName
      && actionLog.groups.result.length >= 2) {
        if (next.combo != 2) {
          gnbDemonSlaughterCombo();
        }
        if (Date.now() - previous.demonslice > 1000) {
          count.targets = 1;
          previous.demonslice = Date.now();
          removeIcon("demonslice");
          if (player.level < 40) {
            gnbCombo();
          }
        }
        else {
          count.targets = count.targets + 1;
        }
      }

      else if ("Demon Slaughter" == actionLog.groups.actionName) {
        if (Date.now() - previous.demonslaughter > 1000) {
          count.targets = 1;
          previous.demonslaughter = Date.now();
          removeIcon("demonslaughter");
          gnbCombo();
        }
        else {
          count.targets = count.targets + 1;
        }
      }

      else if ("Sonic Break" == actionLog.groups.actionName) {
        removeIcon("sonicbreak");
        if (recast.sonicbreak > Date.now() - previous.sonicbreak) {
          recast.sonicbreak = Date.now() - previous.sonicbreak; // Adjusts cooldown
        }
        previous.sonicbreak = Date.now();
        addRecast("sonicbreak");
      }

      else if ("Gnashing Fang" == actionLog.groups.actionName) {
        removeIcon("gnashingfang");
        if (recast.gnashingfang > Date.now() - previous.gnashingfang) {
          recast.gnashingfang = Date.now() - previous.gnashingfang; // Adjusts cooldown
        }
        previous.gnashingfang = Date.now();
        addCountdownBar({name: "gnashingfang", time: recast.gnashingfang});
        addRecast("gnashingfang");
      }

      else if ("Savage Claw" == actionLog.groups.actionName) {
        removeIcon("savageclaw");
      }

      else if ("Wicked Talon" == actionLog.groups.actionName) {
        removeIcon("wickedtalon");
      }

      else if ("Burst Strike" == actionLog.groups.actionName) {
      }

      else if ("Fated Circle" == actionLog.groups.actionName) {
        if (Date.now() - previous.fatedcircle > 1000) {
          count.targets = 1;
          previous.fatedcircle = Date.now();
          gnbCartridge();
        }
        else {
          count.targets = count.targets + 1;
        }
      }

      gnbCartridge();

    }  // End of GCD section

  }

  dncPriority();
}

function gnbStatus() {

  if (effectLog.groups.targetID == player.ID) {

    if ("No Mercy" == effectLog.groups.effectName) {
      if (effectLog.groups.gainsLoses == "gains") {
        addStatus("nomercy", parseInt(effectLog.groups.effectDuration) * 1000);
        addCountdownBar({name: "sonicbreak", time: checkRecast("sonicbreak"), oncomplete: "addIcon"});
        gnbCartridge();
      }
      else if (effectLog.groups.gainsLoses == "loses") {
        removeStatus("nomercy");
        removeCountdownBar("sonicbreak");
        gnbCartridge();
      }
    }

    else if ("Ready To Rip" == effectLog.groups.effectName) {
      if (effectLog.groups.gainsLoses == "gains") {
        icon.continuation = icon.jugularrip;
        addIcon({name: "continuation"});
        addStatus("readytorip", parseInt(effectLog.groups.effectDuration) * 1000);
      }
      else if (effectLog.groups.gainsLoses == "loses") {
        removeIcon("continuation");
        removeStatus("readytorip");
      }
    }

    else if ("Ready To Tear" == effectLog.groups.effectName) {
      if (effectLog.groups.gainsLoses == "gains") {
        icon.continuation = icon.abdomentear;
        addIcon({name: "continuation"});
        addStatus("readytotear", parseInt(effectLog.groups.effectDuration) * 1000);
      }
      else if (effectLog.groups.gainsLoses == "loses") {
        removeIcon("continuation");
        removeStatus("readytotear");
      }
    }

    else if ("Ready To Gouge" == effectLog.groups.effectName) {
      if (effectLog.groups.gainsLoses == "gains") {
        icon.continuation = icon.eyegouge;
        addIcon({name: "continuation"});
        addStatus("readytogouge", parseInt(effectLog.groups.effectDuration) * 1000);
      }
      else if (effectLog.groups.gainsLoses == "loses") {
        removeIcon("continuation");
        removeStatus("readytogouge");
      }
    }
  }
}

function gnbCombo() {

  removeIcon("keenedge");
  removeIcon("brutalshell");
  removeIcon("solidbarrel");

  if (count.targets >= 2) {
    gnbDemonSlaughterCombo();
  }
  else {
    gnbSolidBarrelCombo();
  }
}

function gnbSolidBarrelCombo() {
  addIcon({name: "keenedge"});
  addIcon({name: "brutalshell"});
  if (player.level >= 26) {
    addIcon({name: "solidbarrel"});
  }
}

function gnbDemonSlaughterCombo() {
  addIcon({name: "demonslice"});
  if (player.level >= 40) {
    addIcon({name: "demonslaughter"});
  }
}

function gnbCartridge() {

  if (player.level >= 72
  && count.targets >= 2) {
    icon.burststrike = icon.fatedcircle;
  }
  else {
    icon.burststrike = "003426";
  }

  if (checkStatus("nomercy") > 3000) {
    var cartridgeFloor = 0;
    nextid.burststrike = nextid.burststrike1;
  }
  else {
    var cartridgeFloor = 1;
    nextid.burststrike = nextid.burststrike2;
  }

  removeIcon("burststrike1");
  removeIcon("burststrike2");

  // console.log(player.tempjobDetail.cartridge - cartridgeFloor);
  // console.log(checkRecast("gnashingfang"));
  // console.log(checkRecast("nomercy"));

  if (player.tempjobDetail.cartridge - cartridgeFloor >= 2) {
    if (player.level >= 60
    && checkRecast("gnashingfang") < 3000
    && checkRecast("nomercy") + 10000 > recast.gnashingfang) {
      addIcon({name: "gnashingfang"});
      addIcon({name: "savageclaw"});
      addIcon({name: "wickedtalon"});
    }
    addIcon({name: "burststrike"});
  }

  else if (player.tempjobDetail.cartridge - cartridgeFloor >= 1) {
    if (player.level >= 60
    && checkRecast("gnashingfang") < 3000
    && checkRecast("nomercy") + 10000 > recast.gnashingfang) {
      addIcon({name: "gnashingfang"});
      addIcon({name: "savageclaw"});
      addIcon({name: "wickedtalon"});
    }
    else {
      addIcon({name: "burststrike"});
    }
  }
}

// Icon properties - list by alphabetical job then alphabetical action

const icon = {};

icon.default = '000000';

// Role Actions
icon.rampart = '000801';
icon.lowblow = '000802';
icon.provoke = '000803';
icon.reprisal = '000806';
icon.interject = '000808';
icon.shirk = '000810';
icon.secondwind = '000821';
icon.armslength = '000822';
icon.bloodbath = '000823';
icon.luciddreaming = '000865';
icon.swiftcast = '000866';

// BLM
icon.fire = '000451';
icon.fire2 = '000452';
icon.fire3 = '000453';
icon.firestarter = icon.fire3;
icon.blizzard = '000454';
icon.blizzard2 = '000455';
icon.blizzard3 = '000456';
icon.thunder = '000457';
icon.thundercloud = icon.thunder;
icon.thunder3 = '000459';
icon.transpose = '000466';
icon.thunder2 = '000468';
icon.manafont = '002651';
icon.flare = '002652';
icon.coldflare = icon.flare;
icon.freeze = '002653';
icon.freezeUmbral3 = icon.freeze;
icon.leylines = '002656';
icon.sharpcast = '002657';
icon.enochian = '002658';
icon.blizzard4 = '002659';
icon.fire4 = '002660';
icon.thunder4 = '002662';
icon.triplecast = '002663';
icon.foul = '002664';
icon.despair = '002665';
icon.xenoglossy = '002667';

// BRD
icon.ragingstrikes = '000352';
icon.barrage = '000353';
icon.heavyshot = '000358';
icon.straightshot = '000359';
icon.venomousbite = '000363';
icon.windbite = '000367';
icon.battlevoice = '002601';
icon.ballad = '002602';
icon.paeon = '002603';
icon.requiem = '002604';
icon.empyrealarrow = '002606';
icon.minuet = '002607';
icon.ironjaws = '002608';
icon.sidewinder = '002610';
icon.pitchperfect = '002611';
icon.causticbite = '002613';
icon.stormbite = '002614';
icon.refulgentarrow = '002616';

// DNC
icon.cascade = '003451';
icon.fountain = '003452';
icon.windmill = '003453';
icon.standardstep = '003454';
icon.emboite = '003455';
icon.entrechat = '003456';
icon.jete = '003457';
icon.pirouette = '003458';
icon.standardfinish = '003459';
icon.reversecascade = '003460';
icon.flourishingcascade = icon.reversecascade;
icon.bladeshower = '003461';
icon.fandance = '003462';
icon.risingwindmill = '003463';
icon.flourishingwindmill = icon.risingwindmill;
icon.fountainfall = '003464';
icon.flourishingfountain = icon.fountainfall;
// icon.fountainfallsingletarget = icon.fountainfall;
icon.bloodshower = '003465';
icon.flourishingshower = icon.bloodshower;
// icon.bloodshowersingletarget = icon.bloodshower;
icon.fandance2 = '003466';
icon.devilment = '003471';
icon.fandance3 = '003472';
icon.flourishingfandance = icon.fandance3;
icon.technicalstep = '003473';
icon.technicalfinish = '003474';
icon.flourish = '003475';
icon.saberdance = '003476';

// DRG
icon.lifesurge = '000304';
icon.doomspike = '000306';
icon.chaosthrust = '000308';
icon.lancecharge = '000309';
icon.truethrust = '000310';
icon.vorpalthrust = '000311';
icon.fullthrust = '000314';
icon.piercingtalon = '000315';
icon.disembowel = '000317';
icon.jump = '002576';
icon.elusivejump = '002577';
icon.dragonfiredive = '002578';
icon.spineshatterdive = '002580';
icon.bloodofthedragon = '002581';
icon.fangandclaw = '002582';
icon.geirskogul = '002583';
icon.wheelingthrust = '002584';
icon.battlelitany = '002585';
icon.sonicthrust = '002586';
icon.dragonsight = '002587';
icon.miragedive = '002588';
icon.nastrond = '002589';
icon.coerthantorment = '002590';
icon.highjump = '002591';
icon.raidenthrust = '002592';
icon.stardiver = '002593';

// DRK
icon.hardslash = '003051';
icon.syphonstrike = '003054';
icon.souleater = '003055';
icon.carveandspit = '003058';
icon.plunge = '003061';
icon.unleash = '003063';
icon.abyssaldrain = '003064';
icon.saltedearth = '003066';
icon.bloodweapon = '003071';
icon.shadowwall = '003075';
icon.delirium = '003078';
icon.quietus = '003079';
icon.bloodspiller = '003080';
icon.theblackestnight = '003081';
icon.floodofdarkness = '003082';
icon.edgeofdarkness = '003083';
icon.stalwartsoul = '003084';
icon.floodofshadow = '003085';
icon.edgeofshadow = '003086';
icon.livingshadow = '003088';

// GNB
icon.keenedge = '003401';
icon.nomercy = '003402';
icon.brutalshell = '003403';
icon.camouflage = '003404';
icon.demonslice = '003405';
icon.royalguard = '003406';
icon.lightningshot = '003407';
icon.dangerzone = '003408';
icon.solidbarrel = '003409';
icon.gnashingfang = '003410';
icon.savageclaw = '003411';
icon.nebula = '003412';
icon.demonslaughter = '003413';
icon.wickedtalon = '003414';
icon.aurora = '003415';
icon.superbolide = '003416';
icon.sonicbreak = '003417';
icon.roughdivide = '003418';
icon.continuation = '003419';
icon.jugularrip = '003420';
icon.abdomentear = '003421';
icon.eyegouge = '003422';
icon.bowshock = '003423';
icon.heartoflight = '003424';
icon.heartofstone = '003425';
icon.burststrike = '003426';
icon.fatedcircle = '003427';
icon.bloodfest = '003428';
icon.blastingzone = '003429';

// MCH
icon.splitshot = '003001';
icon.slugshot = '003002';
icon.hotshot = '003003';
icon.cleanshot = '003004';
icon.gaussround = '003005';
icon.spreadshot = '003014';
icon.ricochet = '003017';
icon.wildfire = '003018';
icon.reassemble = '003022';
icon.rookautoturret = '003026';
icon.heatblast = '003030';
icon.heatedsplitshot = '003031';
icon.heatedslugshot = '003032';
icon.heatedcleanshot = '003033';
icon.barrelstabilizer = '003034';
icon.flamethrower = '003038';
icon.tactician = '003040';
icon.hypercharge = '003041';
icon.autocrossbow = '003042';
icon.drill = '003043';
icon.bioblaster = '003044';
icon.airanchor = '003045';
icon.automatonqueen = '003501';

// MNK
icon.demolish = '000204';
icon.fistsoffire = '000205';
icon.bootshine = '000208';
icon.truestrike = '000209';
icon.snappunch = '000210';
icon.twinsnakes = '000213';
icon.armofthedestroyer = '000215';
icon.perfectbalance = '000217';
icon.dragonkick = '002528';
icon.rockbreaker = '002529';
icon.elixirfield = '002533';
icon.theforbiddenchakra = '002535';
icon.riddleofearth = '002537';
icon.riddleoffire = '002541';
icon.brotherhood = '002542';
icon.fourpointfury = '002544';
icon.enlightenment = '002545';
icon.anatman = '002546';
icon.sixsidedstar = '002547';

// NIN
icon.spinningedge = '000601';
icon.gustslash = '000602';
icon.aeolianedge = '000605';
icon.shadowfang = '000606';
icon.hide = '000609';
icon.assassinate = '000612';
icon.mug = '000613';
icon.deathblossom = '000615';
icon.trickattack = '000618';
icon.ten = '002901';
icon.chi = '002902';
icon.jin = '002903';
icon.ninjutsu = '002904';
icon.kassatsu = '002906';
icon.fumashuriken = '002907';
icon.katon = '002908';
icon.hyoton = '002909';
icon.huton = '002910';
icon.doton = '002911';
icon.raiton = '002912';
icon.suiton = '002913';
icon.rabbitmedium = '002913';
icon.armorcrush = '002915';
icon.dreamwithinadream = '002918';
icon.hellfrogmedium = '002920';
icon.bhavacakra = '002921';
icon.tenchijin = '002922';
icon.hakkemujinsatsu = '002923';
icon.meisui = '002924';
icon.gokamekkyaku = '002925';
icon.hyoshoranyu = '002926';
icon.bunshin = '002927';

// PLD
icon.sentinel = '000151';
icon.shieldbash = '000154';
icon.rageofhalone = '000155';
icon.riotblade = '000156';
icon.fastblade = '000158';
icon.circleofscorn = '000161';
icon.shieldlob = '000164';
icon.fightorflight = '000166';
icon.cover = '002501';
icon.hallowedground = '002502';
icon.spiritswithin = '002503';
icon.ironwill = '002505';
icon.goringblade = '002506';
icon.royalauthority = '002507';
icon.divineveil = '002508';
icon.clemency = '002509';
icon.sheltron = '002510';
icon.totaleclipse = '002511';
icon.intervention = '002512';
icon.requiescat = '002513';
icon.holyspirit = '002514';
icon.holyspirit1 = icon.holyspirit;
icon.holyspirit2 = icon.holyspirit;
icon.holyspirit3 = icon.holyspirit;
icon.holyspirit4 = icon.holyspirit;
icon.holyspirit5 = icon.holyspirit;
icon.passageofarms = '002515';
icon.prominence = '002516';
icon.holycircle = '002517';
icon.holycircle1 = icon.holycircle;
icon.holycircle2 = icon.holycircle;
icon.holycircle3 = icon.holycircle;
icon.holycircle4 = icon.holycircle;
icon.holycircle5 = icon.holycircle;
icon.confiteor = '002518';
icon.atonement = '002519';
icon.atonement1 = icon.atonement;
icon.atonement2 = icon.atonement;
icon.atonement3 = icon.atonement;
icon.intervene = '002520';
icon.intervene1 = icon.intervene;
icon.intervene2 = icon.intervene;


// RDM
icon.jolt = '003202';
icon.verthunder = '003203';
icon.corpsacorps = '003204';
icon.veraero = '003205';
icon.scatter = '003207';
icon.verfire = '003208';
icon.verstone = '003209';
icon.displacement = '003211';
icon.fleche = '003212';
icon.acceleration = '003214';
icon.contresixte = '003217';
icon.embolden = '003218';
icon.manafication = '003219';
icon.jolt2 = '003220';
icon.impact = '003222';
icon.verflare = '003223';
icon.verholy = '003224';
icon.riposte = '003225';
icon.zwerchhau = '003226';
icon.redoublement = '003227';
icon.moulinet = '003228';
icon.verthunder2 = '003229';
icon.veraero2 = '003230';
icon.reprise = '003232';
icon.scorch = '003234';

// SAM
icon.hakaze = '003151';
icon.jinpu = '003152';
icon.shifu = '003156';
icon.fuga = '003157';
icon.gekko = '003158';
icon.iaijutsu = '003159';
icon.higanbana = '003160';
icon.tenkagoken = '003161';
icon.midaresetsugekka = '003162';
icon.mangetsu = '003163';
icon.kasha = '003164';
icon.oka = '003165';
icon.yukikaze = '003166';
icon.meikyoshisui = '003167';
icon.kaiten = '003168';
icon.shinten = '003173';
icon.kyuten = '003174';
icon.seigan = '003175';
icon.guren = '003177';
icon.senei = '003178';
icon.ikishoten = '003179';
icon.tsubamegaeshi = '003180';
icon.kaeshihiganbana = '003181';
icon.kaeshigoken = '003182';
icon.kaeshisetsugekka = '003183';
icon.shoha = '003184';

// ACN
icon.bio = '000503';
icon.bio2 = '000504';
icon.aetherflow = '000510';

// SCH
icon.sacredsoil = '002804';
icon.indomitability = '002806';
icon.deploymenttactics = '002808';
icon.emergencytactics = '002809';
icon.dissipation = '002810';
icon.excogitation = '002813';
icon.chainstratagem = '002815';
icon.biolysis = '002820';
icon.recitation = '002822';
icon.summonseraph = '002850';
icon.whisperingdawn = '002852';
icon.feyillumination = '002853';
icon.feyblessing = '002854';

// SMN
icon.devotion = '002688';

// WAR
icon.overpower = '000254';
icon.maim = '000255';
icon.stormspath = '000258';
icon.berserk = '000259';
icon.heavyswing = '000260';
icon.tomahawk = '000261';
icon.thrillofbattle = '000263';
icon.stormseye = '000264';
icon.holmgang = '000266';
icon.vengeance = '000267';
icon.defiance = '002551';
icon.steelcyclone = '002552';
icon.innerbeast = '002553';
icon.infuriate = '002555';
icon.fellcleave = '002557';
icon.decimate = '002558';
icon.rawintuition = '002559';
icon.equilibrium = '002560';
icon.onslaught = '002561';
icon.upheaval = '002562';
icon.shakeitoff = '002563';
icon.innerrelease = '002564';
icon.mythriltempest = '002565';
icon.chaoticcyclone = '002566';
icon.nascentflash = '002567';
icon.innerchaos = '002568';

// WHM
icon.aero = '000401';
icon.aero2 = '000402';
icon.freecure = '000406';
icon.medica2 = '000409';
icon.presenceofmind = '002626';
icon.benediction = '002627';
icon.regen = '002628';
icon.asylum = '002632';
icon.tetragrammaton = '002633';
icon.assize = '002634';
icon.thinair = '002636';
icon.divinebenison = '002638';
icon.plenaryindulgence = '002639';
icon.dia = '002641';
icon.afflatusmisery = '002644';
icon.temperance = '002645';

// Raid
icon.raidbattlelitany = icon.battlelitany;
icon.raidbattlevoice = icon.battlevoice;
icon.raidbrotherhood = icon.brotherhood;
icon.raidchainstratagem = icon.chainstratagem;
icon.raiddevilment = icon.devilment;
icon.raiddevotion = icon.devotion;
icon.raidembolden = icon.embolden;
icon.raidtechnicalstep = icon.technicalstep;
icon.raidtrickattack = icon.trickattack;


// Other
icon.gold0 = '066181';
icon.gold1 = '066182';
icon.gold2 = '066183';
icon.gold3 = '066184';


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
        blmAction(actionMatch);
      } else if (player.job === 'BRD') {
        brdAction(actionMatch);
      } else if (player.job === 'DNC') {
        dncAction(actionMatch);
      } else if (player.job === 'DRK') {
        drkAction(actionMatch);
      } else if (player.job === 'GNB') {
        gnbAction(actionMatch);
      } else if (player.job === 'MCH') {
        mchAction(actionMatch);
      } else if (player.job === 'MNK') {
        mnkAction(actionMatch);
      } else if (player.job === 'NIN') {
        ninAction(actionMatch);
      } else if (player.job === 'PLD') {
        pldAction(actionMatch);
      } else if (player.job === 'RDM') {
        rdmOnAction(actionMatch);
      } else if (player.job === 'SAM') {
        samAction(actionMatch);
      } else if (player.job === 'SCH') {
        schAction(actionMatch);
      } else if (player.job === 'WAR') {
        warAction(actionMatch);
      } else if (player.job === 'WHM') {
        whmAction(actionMatch);
      }
    } else if (effectMatch && effectMatch.groups.sourceName === player.name) {
      if (player.job === 'BLM') {
        blmStatus();
      } else if (player.job === 'BRD') {
        brdStatus();
      } else if (player.job === 'DNC') {
        dncStatus();
      } else if (player.job === 'DRK') {
        drkStatus();
      } else if (player.job === 'GNB') {
        gnbStatus();
      } else if (player.job === 'MCH') {
        mchStatus();
      } else if (player.job === 'MNK') {
        mnkStatus();
      } else if (player.job === 'NIN') {
        ninStatus();
      } else if (player.job === 'PLD') {
        pldStatus();
      } else if (player.job === 'RDM') {
        rdmOnEffect(effectMatch);
      } else if (player.job === 'SAM') {
        samStatus();
      } else if (player.job === 'SCH') {
        schStatus();
      } else if (player.job === 'WAR') {
        warStatus();
      } else if (player.job === 'WHM') {
        whmStatus();
      }
    } else if (startsMatch && startsMatch.groups.sourceName === player.name) {
      if (player.job === 'BLM') {
        blmStartsUsing();
      } else if (player.job === 'RDM') {
        rdmOnStartsUsing(startsMatch);
      }
    } else if (cancelledMatch && cancelledMatch.groups.sourceID === player.ID) {
      if (player.job === 'BLM') {
        blmCancelled();
      } else if (player.job === 'RDM') {
        rdmOnCancelled(cancelledMatch);
      }
    } else if (statsMatch) {
      // Uncomment to check
      const whatever = gcdCalculation({
        speed: Math.max(statsMatch.groups.skillSpeed, statsMatch.groups.spellSpeed),
      });
      console.log(whatever);
    }

    // else if (actionLog && actionLog.groups.sourceID != player.ID
    // && actionLog.groups.sourceID.startsWith('1')) {  // Status source = other player
    //   raidAction();
    // }
  }
});

// onPlayerChangedEvent:
// fires whenever player change detected (including HP, MP, other resources, positions, etc.)
addOverlayListener('onPlayerChangedEvent', (e) => {
  player = e.detail;
  player.ID = e.detail.id.toString(16).toUpperCase();
  // player.id.toString(16) is lowercase; using 'ID' to designate uppercase lettering
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
  } else if (player.job === 'GNB') {
    player.tempjobDetail.cartridge = parseInt(player.debugJobSplit[0], 16); // 0-2
  } else if (player.job === 'SCH') {
    player.tempjobDetail.tempaetherflow = parseInt(player.debugJobSplit[2], 16); // 0-3
    player.tempjobDetail.tempfaerie = parseInt(player.debugJobSplit[3], 16); // 0-100
  } else if (player.job === 'WHM') {
    player.tempjobDetail.bloodlily = parseInt(player.debugJobSplit[5], 16); // 0-3
  }
  // Detects name/job/level change and clears elements
  if (previous.job !== player.job || previous.level !== player.level) {

    clearUI();
    clearTimers();
    loadInitialState();

    previous.job = player.job;
    previous.level = player.level;
    console.log(`Changed to ${player.job}${player.level}`);
  }

  // This is probably only useful for jobs that need to watch things that 'tick' up or down
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
  // else if (player.job == 'RDM') {
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
    document.getElementById('nextdiv').className = 'next-box next-show';
  }
  else {
    delete toggle.combat;
    document.getElementById('nextdiv').className = 'next-box next-hide';


    // Try to get rid of this section
    //
    // if (player.job == 'BRD') {
    //   brdInCombatChangedEvent(e);
    // }
  }
});

addOverlayListener('onZoneChangedEvent', function(e) {
  clearUI();
  clearTimers();
  loadInitialState();
});

addOverlayListener('onPartyWipe', function(e) {
  clearUI();
  clearTimers();
  loadInitialState();
});

"use strict";

actionList.mch = [


  // Non-GCD
  "Reassemble", "Gauss Round", "Hypercharge", "Rook Autoturret", "Wildfire",
  "Ricochet", "Tactician", "Barrel Stabilizer", "Flamethrower",
  "Automaton Queen",
  "Second Wind", "Peloton", "Head Graze",

  // GCD
  "Split Shot", "Slug Shot", "Clean Shot",
  "Heated Split Shot", "Heated Slug Shot", "Heated Clean Shot",
  "Spread Shot",
  "Hot Shot", "Air Anchor", "Drill", "Bioblaster",
  "Heat Blast", "Auto Crossbow"

];

function mchJobChange() {

  nextid.heatblast = 0;
  nextid.autocrossbow = nextid.heatblast;
  nextid.reassemble = 1;
  nextid.drill = nextid.reassemble;
  nextid.bioblaster = nextid.reassemble;
  nextid.hotshot = 3;
  nextid.airanchor = nextid.hotshot;
  nextid.splitshot = 4;
  nextid.heatedsplitshot = nextid.splitshot;
  nextid.spreadshot = nextid.splitshot;
  nextid.slugshot = 5;
  nextid.heatedslugshot = nextid.slugshot;
  nextid.cleanshot = 6;
  nextid.heatedcleanshot = nextid.cleanshot;
  nextid.barrelstabilizer = 10;
  nextid.hypercharge = 11;
  nextid.wildfire = nextid.hypercharge;
  nextid.flamethrower = nextid.hypercharge;
  nextid.rookautoturret = 12;
  nextid.rookoverdrive = nextid.rookautoturret;
  nextid.automatonqueen = nextid.rookautoturret;
  nextid.queenoverdrive = nextid.rookautoturret;
  nextid.gaussround = 13;
  nextid.ricochet = 14;

  countdownid.barrelstabilizer = 10;
  countdownid.wildfire = 11;
  countdownid.drill = 0;
  countdownid.hotshot = 1;
  countdownid.reassemble = 2;
  countdownid.gaussround = 3;
  countdownid.ricochet = 4;

  // nextid.tactician = 99;

  previous.hotshot = 0;
  previous.spreadshot = 0;
  previous.ricochet = 0;
  previous.flamethrower = 0;
  previous.autocrossbow = 0;
  previous.drill = 0;
  previous.bioblaster = 0;

  // Set up action changes from level

  if (player.level >= 76) {
    icon.hotshot = icon.airanchor;
  }
  else {
    icon.hotshot = "003003";
  }

  if (player.level >= 72
  && count.targets >= 2) {
    icon.drill = icon.bioblaster;
  }
  else {
    icon.drill = "003043";
  }

  if (player.level >= 64) {
    icon.cleanshot = icon.heatedcleanshot;
  }
  else {
    icon.cleanshot = "003004";
  }

  if (player.level >= 60) {
    icon.slugshot = icon.heatedslugshot;
  }
  else {
    icon.slugshot = "003002";
  }

  if (player.level >= 54) {
    icon.splitshot = icon.heatedsplitshot;
  }
  else {
    icon.splitshot = "003001";
  }

  if (player.level >= 52
  && count.targets >= 3) {
    icon.heatblast = icon.autocrossbow;
  }
  else {
    icon.heatblast = "003030";
  }

  // Show available cooldowns

  addCountdownBar({name: "hotshot", time: checkRecast("hotshot"), oncomplete: "addIcon"});

  if (player.level >= 15) {
    addCountdownBar({name: "gaussround", time: checkRecast("gaussround1")});
  }

  if (player.level >= 50) {
    addCountdownBar({name: "ricochet", time: checkRecast("ricochet1")});
  }

  if (player.level >= 10) {
    addCountdownBar({name: "reassemble", time: checkRecast("reassemble")});
  }

  if (player.level >= 58) {
    addCountdownBar({name: "drill", time: checkRecast("drill"), oncomplete: "addIcon"});
  }

  mchHeat();
  mchBattery();
  mchCombo();
}

function mchPlayerChangedEvent() {

  nextid.heatblast = 0; // Not sure if necessary but whatever

  if (player.level >= 52
  && count.targets >= 3) {
    icon.heatblast == icon.autocrossbow;
  }
  else {
    icon.heatblast = "003030";
  }

  if (player.jobDetail.overheatMilliseconds > 0) {
    addIcon({name: "heatblast"});
  }
  else {
    removeIcon("heatblast");
  }
}

function mchAction() {

  if (actionList.mch.indexOf(actionLog.groups.actionName) > -1) {

    // These actions don't interrupt combos

    if (["Hot Shot", "Air Anchor"].indexOf(actionLog.groups.actionName) > -1) {
      removeIcon("hotshot");
      if (recast.hotshot > Date.now() - previous.hotshot) {
        recast.hotshot = Date.now() - previous.hotshot;
      }
      previous.hotshot = Date.now();
      addRecast("hotshot");
      addCountdownBar({name: "hotshot", time: recast.hotshot, oncomplete: "addIcon"});
      mchBattery();
      mchHeat();  // Why? Check later
    }

    else if ("Drill" == actionLog.groups.actionName) {
      count.targets = 1;
      if (recast.drill > Date.now() - previous.drill) {
        recast.drill = Date.now() - previous.drill; // Adjusts cooldown
      }
      previous.drill = Date.now();
      addRecast("drill");
      //removeIcon("drill");
      addCountdownBar({name: "drill", time: recast.drill, oncomplete: "addIcon"});
      // if (checkRecast("reassemble") < checkRecast("drill")) {
      //   addIconBlinkTimeout("drill", recast.drill - 1000, nextid.drill, icon.reassemble);
      // }
      // else {
      //   addIconBlinkTimeout("drill", recast.drill - 1000, nextid.drill, icon.drill);
      // }
      mchHeat();
    }

    else if ("Bioblaster" == actionLog.groups.actionName) {
      if (Date.now() - previous.drill > 1000) {
        count.targets = 1;
        // Recast adjust has to go here, otherwise Drill/Bioblaster become 0s recast due to AoE spam
        if (recast.drill > Date.now() - previous.drill) {
          recast.drill = Date.now() - previous.drill;
        }
        previous.drill = Date.now();
      }
      else {
        count.targets = count.targets + 1;
      }
      removeIcon("drill");
      addRecast("drill");
      addIconBlinkTimeout("drill", recast.drill - 1000, nextid.drill, icon.drill);
      mchHeat();
    }

    else if ("Heat Blast" == actionLog.groups.actionName) {

      addRecast("gaussround1", player.ID, checkRecast("gaussround1", player.ID) - 15000);
      addRecast("gaussround2", player.ID, checkRecast("gaussround2", player.ID) - 15000);
      addRecast("ricochet1", player.ID, checkRecast("ricochet1", player.ID) - 15000);
      addRecast("ricochet2", player.ID, checkRecast("ricochet2", player.ID) - 15000);
      if (player.level >= 74) {
        addRecast("gaussround3", player.ID, checkRecast("gaussround3", player.ID) - 15000);
        addRecast("ricochet3", player.ID, checkRecast("ricochet3", player.ID) - 15000);
      }
    }

    else if ("Auto Crossbow" == actionLog.groups.actionName
    && actionLog.groups.result.length >= 2) {
      if (Date.now() - previous.autocrossbow > 1000) {
        count.targets = 1;
        previous.autocrossbow = Date.now();
      }
      else {
        count.targets = count.targets + 1;
      }
    }

    else if ("Flamethrower" == actionLog.groups.actionName) {
      if (Date.now() - previous.flamethrower > 1000) {
        previous.flamethrower = Date.now();
        count.targets = 1;
      }
      else {
        count.targets = count.targets + 1;
      }
    }

    else if ("Gauss Round" == actionLog.groups.actionName) {
      if (player.level >= 74) {
        if (checkRecast("gaussround3", player.ID) < 0) {
          addRecast("gaussround3", player.ID, recast.gaussround);
        }
        else if (checkRecast("gaussround2", player.ID) < 0) {
          addRecast("gaussround2", player.ID, checkRecast("gaussround3", player.ID));
          addRecast("gaussround3", player.ID, checkRecast("gaussround3", player.ID) + recast.gaussround);
        }
        else if (checkRecast("gaussround1", player.ID) < 0) {
          addRecast("gaussround1", player.ID, checkRecast("gaussround2", player.ID));
          addRecast("gaussround2", player.ID, checkRecast("gaussround2", player.ID) + recast.gaussround);
          addRecast("gaussround3", player.ID, checkRecast("gaussround3", player.ID) + recast.gaussround);
          removeIcon("gaussround");
          addIconBlinkTimeout("gaussround", checkRecast("gaussround1", player.ID), nextid.gaussround, icon.gaussround);
        }
      }
      else {
        if (checkRecast("gaussround2", player.ID) < 0) {
          addRecast("gaussround2", player.ID, recast.gaussround);
        }
        else if (checkRecast("gaussround1", player.ID) < 0) {
          addRecast("gaussround1", player.ID, checkRecast("gaussround2", player.ID));
          addRecast("gaussround2", player.ID, checkRecast("gaussround2", player.ID) + recast.gaussround);
          removeIcon("gaussround");
          addIconBlinkTimeout("gaussround", checkRecast("gaussround1", player.ID), nextid.gaussround, icon.gaussround);
        }
      }
    }

    else if ("Ricochet" == actionLog.groups.actionName) {
      if (Date.now() - previous.ricochet > 1000) {
        previous.ricochet = Date.now();
        count.targets = 1;
      }
      else {
        count.targets = count.targets + 1;
      }
      if (player.level >= 74) {
        if (checkRecast("ricochet3", player.ID) < 0) {
          addRecast("ricochet3", player.ID, recast.ricochet);
        }
        else if (checkRecast("ricochet2", player.ID) < 0) {
          addRecast("ricochet2", player.ID, checkRecast("ricochet3", player.ID));
          addRecast("ricochet3", player.ID, checkRecast("ricochet3", player.ID) + recast.ricochet);
        }
        else if (checkRecast("ricochet1", player.ID) < 0) {
          addRecast("ricochet1", player.ID, checkRecast("ricochet2", player.ID));
          addRecast("ricochet2", player.ID, checkRecast("ricochet2", player.ID) + recast.ricochet);
          addRecast("ricochet3", player.ID, checkRecast("ricochet3", player.ID) + recast.ricochet);
          removeIcon("ricochet");
          addIconBlinkTimeout("ricochet", checkRecast("ricochet1", player.ID), nextid.ricochet, icon.ricochet);
        }
      }
      else {
        if (checkRecast("ricochet2", player.ID) < 0) {
          addRecast("ricochet2", player.ID, recast.ricochet);
        }
        else if (checkRecast("ricochet1", player.ID) < 0) {
          addRecast("ricochet1", player.ID, checkRecast("ricochet2", player.ID));
          addRecast("ricochet2", player.ID, checkRecast("ricochet2", player.ID) + recast.ricochet);
          removeIcon("ricochet");
          addIconBlinkTimeout("ricochet", checkRecast("ricochet1", player.ID), nextid.ricochet, icon.ricochet);
        }
      }
    }

    else if ("Reassemble" == actionLog.groups.actionName) {
      addCountdownBar({name: "reassemble"});
      if (player.level >= 58
      && checkRecast("drill") < 0) {
        addIcon({name: "drill"});
      }
    }

    else if ("Hypercharge" == actionLog.groups.actionName) {
      removeIcon("hypercharge");
      mchHeat();
    }

    else if (["Rook Autoturret", "Automaton Queen"].indexOf(actionLog.groups.actionName) > -1) {
      removeIcon("rookautoturret");
      mchBattery();
    }

    else if ("Wildfire" == actionLog.groups.actionName) {
      removeIcon("wildfire");
      addRecast("wildfire");
      mchHeat();
    }

    else if ("Barrel Stabilizer" == actionLog.groups.actionName) {
      removeIcon("barrelstabilizer");
      addRecast("barrelstabilizer");
      mchHeat();
    }

    // Combo

    else if (["Split Shot", "Heated Split Shot"].indexOf(actionLog.groups.actionName) > -1
    && actionLog.groups.result.length >= 2) {
      if (count.targets >= 3) {
        count.targets == 2;
      }
      if (!next.combo) {
       mchCombo();
      }
      toggle.combo = Date.now();
      removeIcon("splitshot");
      mchHeat();
      mchComboTimeout();
    }

    else if (["Slug Shot", "Heated Slug Shot"].indexOf(actionLog.groups.actionName) > -1
    && actionLog.groups.result.length == 8) {
      removeIcon("slugshot");
      mchHeat();
      if (player.level < 26) {
        mchCombo();
      }
      else {
        mchComboTimeout();
      }
    }

    else if (["Clean Shot", "Heated Clean Shot"].indexOf(actionLog.groups.actionName) > -1
    && actionLog.groups.result.length == 8) {
      removeIcon("cleanshot");
      mchHeat();
      mchBattery();
      mchCombo();
    }

    else if ("Spread Shot" == actionLog.groups.actionName) {
      if (Date.now() - previous.spreadshot > 1000) {
        previous.spreadshot = Date.now();
        count.targets = 1;
      }
      else {
        count.targets = count.targets + 1;
      }
      removeIcon("spreadshot");
      mchHeat();
      mchCombo();
    }

    else { // Everything else finishes or breaks combo
      mchCombo();
    }

    // Toggle AoE

    if (player.level >= 70
    && checkRecast("flamethrower") < 0
    && count.targets >= 2) {
      addIcon({name: "flamethrower"});
    }
    else {
      removeIcon("flamethrower");
    }

    if (player.level >= 72
    && count.targets >= 2) {
      icon.drill == icon.bioblaster;
    }
    else {
      icon.drill = "003043";
    }

  }

}

function mchStatus() {
 //????
}

function mchCombo() {

  delete toggle.combo;
  delete next.combo;

  // Reset icons
  removeIcon("splitshot");
  removeIcon("slugshot");
  removeIcon("cleanshot");

  if (player.level >= 80
  && count.targets >= 3) {
    next.combo = 2;
    addIcon({name: "spreadshot"});
  }
  else if (player.level < 80
  && count.targets == 2) {
    next.combo = 2;
    addIcon({name: "spreadshot"});
  }
  else {
    next.combo = 1;
    addIcon({name: "splitshot"});
    if (player.level >= 2) {
      addIcon({name: "slugshot"});
    }
    if (player.level >= 26) {
      addIcon({name: "cleanshot"});
    }
  }
}

function mchComboTimeout() { // Set between combo actions
  clearTimeout(timeout.combo);
  timeout.combo = setTimeout(mchCombo, 12500);
}

function mchHeat() {
  console.log("  Heat:" + player.jobDetail.heat + "  Drill:" + checkRecast("drill") + "  Hotshot:" +  checkRecast("hotshot"));
  if (player.jobDetail.heat >= 50
  && (player.level < 58 || checkRecast("drill") > 9000)
  && (player.level < 76 || checkRecast("hotshot") > 9000)) {  
    addIcon({name: "hypercharge"});
    // if (player.level >= 45
    // && checkRecast("wildfire") < 1000) {
    //   addIcon({name: "wildfire"});
    // }
    // else {
    //   addIcon({name: "hypercharge"});
    // }
    console.log("Go");
  }
  else {
    console.log("No go");
    removeIcon("hypercharge");
  }
}

function mchBattery() {
  if (player.jobDetail.battery >= 50) {
    addIcon({name: "rookautoturret"});
  }
  else {
    removeIcon("rookautoturret");
  }
}

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

const loadInitialState = () => {

  delete toggle.combo;

  if (player.job === 'BLM') {
    blmJobChange();
  } else if (player.job === 'BRD') {
    brdJobChange();
  } else if (player.job === 'DNC') {
    dncJobChange();
  } else if (player.job === 'DRK') {
    drkJobChange();
  } else if (player.job === 'GNB') {
    gnbJobChange();
  } else if (player.job === 'MCH') {
    mchJobChange();
  } else if (player.job === 'MNK') {
    mnkJobChange();
  } else if (player.job === 'NIN') {
    ninJobChange();
  } else if (player.job === 'PLD') {
    pldJobChange();
  } else if (player.job === 'RDM') {
    rdmOnJobChange();
  } else if (player.job === 'SAM') {
    samJobChange();
  } else if (player.job === 'SCH') {
    schJobChange();
  } else if (player.job === 'WAR') {
    warJobChange();
  } else if (player.job === 'WHM') {
    whmJobChange();
  }
};


const clearUI = () => {
  priorityArray = [];
  actionArray = [];
  cooldownArray = [];
  countdownArrayA = [];
  countdownArrayB = [];
  document.getElementById('priority-row').innerHTML = '';
  document.getElementById('action-row').innerHTML = '';
  document.getElementById('cooldown-row').innerHTML = '';
  document.getElementById('countdown-a').innerHTML = '';
  document.getElementById('countdown-b').innerHTML = '';
};


const countTargets = (action) => {
  const countTargetsTime = 100;
  if (Date.now() - previous[action] > countTargetsTime) {
    previous[action] = Date.now();
    count.targets = 1;
  } else {
    count.targets += 1;
  }
};

"use strict";

actionList.mnk = [

  // oGCD
  "Perfect Balance", "Riddle Of Fire", "Brotherhood", "The Forbidden Chakra", "Enlightenment", "Shoulder Tackle", "Elixir Field", "Tornado Kick",
  "Riddle Of Earth",



  // GCD
  "Bootshine", "Dragon Kick",
  "True Strike", "Twin Snakes",
  "Snap Punch", "Demolish",
  "Arm Of The Destroyer",
  "Four-Point Fury",
  "Rockbreaker",
  "Form Shift"

  // Role
  // "True North"

];
//
// statusList.mnk = ["Twin Snakes",
//   "Demolish",
//   "Blunt Resistance Down"];


function mnkJobChange() {

  nextid.fistsoffire = 0;
  nextid.combo1 = 1;
  nextid.combo2 = 2;
  nextid.combo3 = 3;

  nextid.theforbiddenchakra = 10;
  nextid.enlightenment = 10;
  nextid.riddleoffire = 11;
  nextid.brotherhood = 12;
  nextid.perfectbalance = 13;

  countdownid.demolish = 0;
  countdownid.twinsnakes = 1;
  countdownid.perfectbalance = 2;
  countdownid.riddleoffire = 11;
  countdownid.brotherhood = 10;

  if (player.level >= 50) {
    addCountdownBar({name: "perfectbalance", time: checkRecast("perfectbalance"), oncomplete: "addIcon"});
  }

  if (player.level >= 68) {
    addCountdownBar({name: "riddleoffire", time: checkRecast("riddleoffire"), oncomplete: "addIcon"});
  }

  if (player.level >= 70) {
    addCountdownBar({name: "brotherhood", time: checkRecast("brotherhood"), oncomplete: "addIcon"});
  }

  mnkCombo();

}

function mnkPlayerChangedEvent(e) {
  if (player.jobDetail.chakraStacks >= 5) {
    addIcon({name: "theforbiddenchakra"});
  }
  else {
    removeIcon("theforbiddenchakra");
  }
}

function mnkAction(logLine) {

  if (actionList.mnk.indexOf(actionLog.groups.actionName) > -1) {

    if ("Perfect Balance" == actionLog.groups.actionName) {
      addCountdownBar({name: "perfectbalance", time: recast.perfectbalance, oncomplete: "addIcon"});
    }

    else if ("Riddle Of Earth" == actionLog.groups.actionName) {
      addCountdownBar({name: "riddleofearth", time: recast.riddleofearth, oncomplete: "addIcon"});
    }

    else if ("Riddle Of Fire" == actionLog.groups.actionName) {
      addCountdownBar({name: "riddleoffire", time: recast.riddleoffire, oncomplete: "addIcon"});
    }

    else if ("Brotherhood" == actionLog.groups.actionName) {
      addCountdownBar({name: "brotherhood", time: recast.brotherhood, oncomplete: "addIcon"});
    }

    else {

      if ("Bootshine" == actionLog.groups.actionName) {
      }

      else if ("Dragon Kick" == actionLog.groups.actionName) {
      }

      else if ("True Strike" == actionLog.groups.actionName) {
      }

      else if ("Twin Snakes" == actionLog.groups.actionName) {
        addStatus("twinsnakes");
      }

      else if ("Snap Punch" == actionLog.groups.actionName) {
        mnkCombo();
      }

      else if ("Demolish" == actionLog.groups.actionName) {
        addStatus("demolish", duration.demolish, actionLog.groups.targetID);
        mnkCombo();
      }

      else if ("Form Shift" == actionLog.groups.actionName) {
      }

    }

  }

}

function mnkStatus(logLine) {

  if (effectLog.groups.effectName == "Opo-Opo Form") {
    if (effectLog.groups.gainsLoses == "gains") {
      addStatus("opoopoform", parseInt(effectLog.groups.effectDuration) * 1000, effectLog.groups.targetID);
      mnkCombo();
      mnkComboTimeout();
    }
    else if (effectLog.groups.gainsLoses == "loses") {
      removeStatus("opoopoform", effectLog.groups.targetID);
    }
  }

  else if (effectLog.groups.effectName == "Raptor Form") {
    if (effectLog.groups.gainsLoses == "gains") {
      addStatus("raptorform", parseInt(effectLog.groups.effectDuration) * 1000, effectLog.groups.targetID);
      removeIcon("combo1");
      mnkComboTimeout();
    }
    else if (effectLog.groups.gainsLoses == "loses") {
      removeStatus("raptorform", effectLog.groups.targetID);
    }
  }

  else if (effectLog.groups.effectName == "Coeurl Form") {
    if (effectLog.groups.gainsLoses == "gains") {
      addStatus("coeurlform", parseInt(effectLog.groups.effectDuration) * 1000, effectLog.groups.targetID);
      removeIcon("combo2");
      mnkComboTimeout();
    }
    else if (effectLog.groups.gainsLoses == "loses") {
      removeStatus("coeurlform", effectLog.groups.targetID);
    }
  }

  else if (effectLog.groups.effectName == "Twin Snakes") {
    if (effectLog.groups.gainsLoses == "gains") {
      addStatus("twinsnakes", parseInt(effectLog.groups.effectDuration) * 1000, effectLog.groups.targetID);
    }
    else if (effectLog.groups.gainsLoses == "loses") {
      removeStatus("twinsnakes", effectLog.groups.targetID);
    }
  }

  else if (effectLog.groups.effectName == "Demolish") {
    if (effectLog.groups.gainsLoses == "gains") {
      addStatus("demolish", parseInt(effectLog.groups.effectDuration) * 1000, effectLog.groups.targetID);
    }
    else if (effectLog.groups.gainsLoses == "loses") {
      removeStatus("demolish", effectLog.groups.targetID);
    }
  }

  else if (effectLog.groups.effectName == "Fists Of Earth") {
    if (effectLog.groups.gainsLoses == "gains") {
      addStatus("fistsofearth", parseInt(effectLog.groups.effectDuration) * 1000, effectLog.groups.targetID);
      addIcon({name: "fistsoffire"});
    }
    else if (effectLog.groups.gainsLoses == "loses") {
      removeStatus("fistsofearth", effectLog.groups.targetID);
    }
  }

  else if (effectLog.groups.effectName == "Fists Of Wind") {
    if (effectLog.groups.gainsLoses == "gains") {
      addStatus("fistsofwind", parseInt(effectLog.groups.effectDuration) * 1000, effectLog.groups.targetID);
      addIcon({name: "fistsoffire"});
    }
    else if (effectLog.groups.gainsLoses == "loses") {
      removeStatus("fistsofwind", effectLog.groups.targetID);
    }
  }

  else if (effectLog.groups.effectName == "Fists Of Fire") {
    if (effectLog.groups.gainsLoses == "gains") {
      addStatus("fistsoffire", parseInt(effectLog.groups.effectDuration) * 1000, effectLog.groups.targetID);
      removeIcon("fistsoffire");
    }
    else if (effectLog.groups.gainsLoses == "loses") {
      removeStatus("fistsoffire", effectLog.groups.targetID);
      addIcon({name: "fistsoffire"});
    }
  }

  else if (effectLog.groups.effectName == "Leaden Fist") {
    if (effectLog.groups.gainsLoses == "gains") {
      addStatus("leadenfist", parseInt(effectLog.groups.effectDuration) * 1000, effectLog.groups.targetID);
    }
    else if (effectLog.groups.gainsLoses == "loses") {
      removeStatus("leadenfist", effectLog.groups.targetID);
    }
  }

  else if (effectLog.groups.effectName == "Perfect Balance") {
    if (effectLog.groups.gainsLoses == "gains") {
      addStatus("perfectbalance", parseInt(effectLog.groups.effectDuration) * 1000, effectLog.groups.targetID);
    }
    else if (effectLog.groups.gainsLoses == "loses") {
      removeStatus("perfectbalance", effectLog.groups.targetID);
    }
  }

  else if (effectLog.groups.effectName == "Riddle Of Fire") {
    if (effectLog.groups.gainsLoses == "gains") {
      addStatus("riddleoffire", parseInt(effectLog.groups.effectDuration) * 1000, effectLog.groups.targetID);
    }
    else if (effectLog.groups.gainsLoses == "loses") {
      removeStatus("riddleoffire", effectLog.groups.targetID);
    }
  }
}

function mnkCombo() {
  //
  // if (checkStatus("perfectbalance") > 0) {
  //   if
  // }
  //
  // else {
  //
  // }
  // Reset icons
  removeIcon("combo1");
  removeIcon("combo2");
  removeIcon("combo3");

  if (checkStatus("leadenfist") > 0) {
    potency.bootshine = 300 * 2;
  }
  else {
    potency.bootshine = 150 * 2;
  }

  if (checkStatus("opoopoform") > 0) {
    potency.armofthedestroyer = 110;
  }
  else {
    potency.armofthedestroyer = 80;
  }

  potency.dragonkick = 200;

    if (player.level >= 26
  && potency.armofthedestroyer * count.targets > Math.max(potency.bootshine, potency.dragonkick)) {
    icon.combo1 = icon.armofthedestroyer;
  }
  else if (player.level >= 50
  && checkStatus("leadenfist") < 0) {
    icon.combo1 = icon.dragonkick;
  }
  else {
    icon.combo1 = icon.bootshine;
  }

  if (player.level >= 18
  && checkStatus("twinsnakes") < 12000) {
    icon.combo2 = icon.twinsnakes;
  }
  else if (player.level >= 45
  && count.targets >= 2) {
    icon.combo2 = icon.fourpointfury;
  }
  else {
    icon.combo2 = icon.truestrike;
  }

  if (player.level >= 30
  && count.targets >= 2) {
    icon.combo3 = icon.rockbreaker;
  }
  else if (player.level >= 30
  && checkStatus("demolish", target.ID) < 12000) {
    icon.combo3 = icon.demolish;
  }

  else {
    icon.combo3 = icon.snappunch;
  }

  addIcon({name: "combo1"});
  addIcon({name: "combo2"});
  addIcon({name: "combo3"});

}

function mnkComboTimeout() {
  clearTimeout(timeout.combo);
  timeout.combo = setTimeout(mnkCombo, 12500);
}



// Set up doms
//
// const dom = {};
// for (let x = 0; x < 30; x += 1) {
//   dom[`icondiv${x}`] = document.getElementById(`icondiv${x}`); // Container for all parts
//   dom[`iconimgdiv${x}`] = document.getElementById(`iconimgdiv${x}`); // Wraps icon and overlay (for animation)
//   dom[`iconimg${x}`] = document.getElementById(`iconimg${x}`); // src = icon
//   dom[`iconcountdown${x}`] = document.getElementById(`iconcountdown${x}`); // Countdown - separate from img
// }
// for (let x = 0; x < 40; x += 1) {
//   dom[`countdowndiv${x}`] = document.getElementById("countdowndiv" + x); // Countdown - separate from img
//   dom[`countdownimgdiv${x}`] = document.getElementById("countdownimgdiv" + x); // Countdown - separate from img
//   dom[`countdownimg${x}`] = document.getElementById("countdownimg" + x); // Countdown - separate from img
//   dom[`countdownbar${x}`] = document.getElementById("countdownbar" + x); // Countdown - separate from img
//   dom[`countdowntime${x}`] = document.getElementById("countdowntime" + x); // Countdown - separate from img
// }




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

callOverlayHandler({ call: 'cactbotRequestState' });

// callOverlayHandler:
// accepts an object so you can add more parameters which will be passed to the C# code.
// i.e. a TTS call for Cactbot would look like this:
// callOverlayHandler({ call: "cactbotSay", text: "Hello World!" });.

"use strict";

// To do: clearer indication of when TCJ / Mudra is active

actionList.nin = [

  // Off GCD
  'Hide', 'Mug', 'Trick Attack', 'Kassatsu', 'Dream Within A Dream', 'Assassinate', 'Bhavacakra',
  'Hellfrog Medium', 'Ten Chi Jin', 'Meisui',

  // GCD
  'Spinning Edge', 'Gust Slash', 'Shadow Fang', 'Aeolian Edge', 'Armor Crush',
  'Death Blossom', 'Hakke Mujinsatsu',
  'Throwing Dagger',

  // Ninjutsu
  'Katon', 'Raiton', 'Suiton', 'Goka Mekkyaku', 'Hyosho Ranyu',
  // Code currently doesn't use mudra or most ninjutsu for decision-making
  // "Ten", "Chi", "Jin", "Fuma Shuriken",  "Hyoton", "Huton", "Doton",

  // Role
  'True North'
];

function ninJobChange() {

  nextid.ninjutsu1 = 1;
  nextid.ninjutsu2 = 2;
  nextid.ninjutsu3 = 3;
  nextid.spinningedge = 4;
  nextid.deathblossom = nextid.spinningedge;
  nextid.gustslash = 5;
  nextid.aeolianedge = 6;
  nextid.armorcrush = nextid.aeolianedge;
  nextid.shadowfang = nextid.aeolianedge;
  nextid.hakkemujinsatsu = nextid.spinningedge;
  nextid.tenchijin = 10;
  nextid.kassatsu = 11;
  nextid.ninkiaction = 12;
  // nextid.trickattack = 12;
  nextid.dreamwithinadream = 13;
  // nextid.assassinate = 14;

  countdownid.shadowfang = 0;
  countdownid.ninjutsu = 1;
  countdownid.kassatsu = 2;
  countdownid.tenchijin = 3;
  countdownid.trickattack = 10;
  countdownid.dreamwithinadream = 11;

  count.targets = 1;
  previous.deathblossom = 0;
  previous.hakkemujinsatsu = 0;
  previous.katon = 0; // Includes Goka Mekkyaku
  previous.hellfrogmedium = 0;

  if (player.level >= 56) {
    addCountdownBar({name: "dreamwithinadream", time: -1});
  }

  ninNinjutsu();
  ninCombo();
}

function ninTargetChangedEvent() {
  if (previous.targetID != target.ID
  && !toggle.combo) { // Prevent this from repeatedly being called on movement, target change-mid combo

    // If not a target then clear things out
    if (target.ID == 0 || target.ID.startsWith("1") || target.ID.startsWith("E")) {  // 0 = no target, 1... = player? E... = non-combat NPC?
      removeCountdownBar("shadowfang");
    }
    else {
      addCountdownBar({name: "shadowfang", time: checkStatus("shadowfang"), text: target.ID});
    }
    previous.targetID = target.ID;
  }
}

function ninAction(logLine) {

  // console.log("Logline")

  if (actionList.nin.indexOf(actionLog.groups.actionName) > -1) {

    // Everything breaks Mudra "combo" so list it first
    // Not sure what to do with this

    if ("Ten" == actionLog.groups.actionName) {
      // toggle.mudra = toggle.mudra + "T";
      // ninMudraCombo();
    }
    else if ("Chi" == actionLog.groups.actionName) {
      // toggle.mudra = toggle.mudra + "C";
      // ninMudraCombo();
    }
    else if ("Jin" == actionLog.groups.actionName) {
      // toggle.mudra = toggle.mudra + "J";
      // ninMudraCombo();
    }

    else { // Off-GCD actions

      delete toggle.mudra;

      if ("Hide" == actionLog.groups.actionName) {
        removeIcon("tenchijin");
        addRecast("hide");
        addRecast("ninjutsu", -1);
        addCountdownBar({name: "ninjutsu", time: -1});
        clearTimeout(timeout.ninjutsu);
        ninNinjutsu();
      }

      else if ("Mug" == actionLog.groups.actionName) {
        ninNinki();
      }

      else if ("Trick Attack" == actionLog.groups.actionName) {
        addCountdownBar({name: "trickattack"});
      }

      else if (["Raiton", "Hyosho Ranyu"].indexOf(actionLog.groups.actionName) > -1) {
        count.targets = 1;
      }

      else if (["Katon", "Goka Mekkyaku"].indexOf(actionLog.groups.actionName) > -1) {
        if (Date.now() - previous.katon > 1000) {
          previous.katon = Date.now()
          count.targets = 1;
        }
        else {
          count.targets = count.targets + 1;
        }
      }

      else if ("Suiton" == actionLog.groups.actionName) {
        addStatus("suiton");
      }

      else if ("Kassatsu" == actionLog.groups.actionName) {

        removeIcon("kassatsu");
        addStatus("kassatsu");

        if (checkRecast("kassatsu2") < 0) {
          addRecast("kassatsu2", recast.kassatsu);
          addRecast("kassatsu1", -1);
        }
        else {
          addRecast("kassatsu1", checkRecast("kassatsu2"));
          addRecast("kassatsu2", checkRecast("kassatsu2") + recast.kassatsu);
          addCountdownBar({name: "kassatsu", time: checkRecast("kassatsu1"), oncomplete: "addIcon"});
        }

        addCountdownBar({name: "ninjutsu", time: -1});
        clearTimeout(timeout.ninjutsu);
        ninNinjutsu();
      }

      else if ("Dream Within A Dream" == actionLog.groups.actionName) {
        removeIcon("dreamwithinadream");
        addCountdownBar({name: "dreamwithinadream", time: recast.dreamwithinadream, oncomplete: "addIcon"});
        addStatus("assassinateready");
      }

      else if ("Hellfrog Medium" == actionLog.groups.actionName) {
        if (Date.now() - previous.hellfrogmedium > 1000) {
          previous.hellfrogmedium = Date.now()
          count.targets = 1;
        }
        else {
          count.targets = count.targets + 1;
        }
        ninNinki();
      }

      else if ("Bhavacakra" == actionLog.groups.actionName) {
        count.targets = 1;
        ninNinki();
      }

      else if ("Ten Chi Jin" == actionLog.groups.actionName) {
        removeIcon("tenchijin");
        addStatus("tenchijin");
        addCountdownBar({name: "tenchijin"});
        addRecast("ninjutsu", -1);
        addCountdownBar({name: "ninjutsu", time: -1});
        clearTimeout(timeout.ninjutsu);
        ninNinjutsu();
      }

      else if ("Meisui" == actionLog.groups.actionName) {
        addCountdownBar({name: "meisui"});
        ninNinki();
      }

      else { // Weaponskills and combos (hopefully)

        if ("Spinning Edge" == actionLog.groups.actionName
        && actionLog.groups.result.length >= 2) {

          if ([1, 2, 3].indexOf(next.combo) == -1) {
            if (player.level >= 38
            && checkStatus("shadowfang", target.ID) < 9000) {
              ninShadowFangCombo();
            }
            else if (player.level >= 54
            && player.jobDetail.hutonMilliseconds > 6000
            && player.jobDetail.hutonMilliseconds < 46000) {
              ninArmorCrushCombo();
            }
            else {
              ninAeolianEdgeCombo();
            }
          }
          removeIcon("spinningedge");
          toggle.combo = Date.now();
        }

        else if ("Gust Slash" == actionLog.groups.actionName
        && actionLog.groups.result.length >= 8) {

          if ([1, 2].indexOf(next.combo) == -1) {
            if (player.level >= 54
            && player.jobDetail.hutonMilliseconds > 6000
            && player.jobDetail.hutonMilliseconds < 46000) {
              ninArmorCrushCombo();
            }
            else {
              ninAeolianEdgeCombo();
            }
          }
          removeIcon("spinningedge");
          removeIcon("gustslash");

          if (player.level < 26) {
            ninCombo();
          }
        }

        else if ("Shadow Fang" == actionLog.groups.actionName
        && actionLog.groups.result.length >= 8) {
          addStatus("shadowfang", duration.shadowfang, actionLog.groups.targetID);
          ninCombo();
        }

        else if ("Death Blossom" == actionLog.groups.actionName
        && actionLog.groups.result.length >= 2) {

          if (Date.now() - previous.deathblossom > 1000) {
            previous.deathblossom = Date.now()
            count.targets = 1;
            if (next.combo != 4) {
              ninHakkeMujinsatsuCombo();
            }
            removeIcon("deathblossom");
            if (player.level < 52) {
              ninCombo();
            }
          }
          else {
            count.targets = count.targets + 1;
          }
        }

        else if ("Hakke Mujinsatsu" == actionLog.groups.actionName
        && actionLog.groups.result.length == 8) {

          if (Date.now() - previous.hakkemujinsatsu > 1000) {
            previous.hakkemujinsatsu = Date.now()
            count.targets = 1;
            ninCombo();
          }
          else {
            count.targets = count.targets + 1;
          }
        }

        else {
          ninCombo();
        }

        // Recalculate optimal Ninjutsu after every GCD
        if (checkRecast("ninjutsu") < 1000) {
          ninNinjutsu();
        }

        // Check Ninki after all GCD actions
        if (player.level >= 62) {
          ninNinki();
        }
      }
    }
  }
}

function ninStatus() {

  if (effectLog.groups.targetID == player.ID) {

    if ("Mudra" == effectLog.groups.effectName) {
      if ("gains" == effectLog.groups.gainsLoses) {
        removeCountdownBar("ninjutsu");
      }
      else if ("loses" == effectLog.groups.gainsLoses) {
        removeIcon("ninjutsu1");
        removeIcon("ninjutsu2");
        removeIcon("ninjutsu3");
        addCountdownBar({name: "ninjutsu"});
        clearTimeout(timeout.ninjutsu);
        timeout.ninjutsu = setTimeout(ninNinjutsu, recast.ninjutsu - 1000);
        if (player.level >= 70
        && checkRecast("trickattack") < 21000
        && checkRecast("tenchijin") < 1000) {
          addIcon({name: "tenchijin"});
        }
      }
    }

    // else if ("Doton" == effectLog.groups.effectName) {
    //   if ("gains" == effectLog.groups.gainsLoses) {
    //     addStatus("doton", parseInt(effectLog.groups.effectDuration) * 1000, effectLog.groups.targetID);
    //   }
    //   else if ("loses" == effectLog.groups.gainsLoses) {
    //     removeStatus("doton", effectLog.groups.targetID);
    //   }
    // }

    else if ("Suiton" == effectLog.groups.effectName) {
      if ("gains" == effectLog.groups.gainsLoses) {
        addStatus("suiton", parseInt(effectLog.groups.effectDuration) * 1000);
        if (checkStatus("suiton") > checkRecast("trickattack")) {

        }
        else if (checkStatus("suiton") > checkRecast("meisui")) {

        }
      }
      else if ("loses" == effectLog.groups.gainsLoses) {
        removeStatus("suiton", effectLog.groups.targetID);
      }
    }

    else if ("Kassatsu" == effectLog.groups.effectName) {
      if ("gains" == effectLog.groups.gainsLoses) {
        addStatus("kassatsu", parseInt(effectLog.groups.effectDuration) * 1000);
        if (player.level >= 76) {
          icon.katon = icon.gokamekkyaku;
          icon.raiton = icon.hyoshoranyu;  // This isn't how it really upgrades, but  this happens in practice
          icon.hyoton = icon.hyoshoranyu;  // Just in case for later
        }
      }
      else if ("loses" == effectLog.groups.gainsLoses) {
        removeStatus("kassatsu");
        icon.katon = "002908";
        icon.raiton = "002912";
        icon.hyoton = "002909";
        // addRecast("ninjutsu", effectLog.groups.targetID, recast.ninjutsu);
        // clearTimeout(timeout.ninjutsu);
        // timeout.ninjutsu = setTimeout(ninNinjutsu, recast.ninjutsu - 1000);
      }
    }

    else if ("Ten Chi Jin" == effectLog.groups.effectName) {
      if ("gains" == effectLog.groups.gainsLoses) {
        addStatus("tenchijin", parseInt(effectLog.groups.effectDuration) * 1000);
      }
      else if ("loses" == effectLog.groups.gainsLoses) {
        ninLosesMudra()
      }
    }
  }

  else {
    if ("Shadow Fang" == effectLog.groups.effectName) {
      if ("gains" == effectLog.groups.gainsLoses) {
        addStatus("shadowfang", parseInt(effectLog.groups.effectDuration) * 1000, effectLog.groups.targetID);
        if (target.ID == effectLog.groups.targetID) {  // Might be possible to switch targets between application to target and log entry
          addCountdownBar({name: "shadowfang", time: checkStatus("shadowfang"), text: target.ID});
        }
      }
      else if ("loses" == effectLog.groups.gainsLoses) {
        removeStatus("shadowfang", effectLog.groups.targetID);
      }
    }
  }
}

function ninCombo() {

  delete toggle.combo;
  removeIcon("spinningedge");
  removeIcon("gustslash");
  removeIcon("aeolianedge");

  if (player.level >= 54
  && count.targets <= 2
  && player.jobDetail.hutonMilliseconds > 6000
  && player.jobDetail.hutonMilliseconds < 46000) {
    ninArmorCrushCombo();
  }
  else if (player.level >= 38
  && count.targets <= 3
  && checkStatus("shadowfang", target.ID) < 9000) {
    ninShadowFangCombo();
  }
  else if (player.level >= 38
  && count.targets >= 3
  && player.jobDetail.hutonMilliseconds > 3000) {
    ninHakkeMujinsatsuCombo();
  }
  else {
    ninAeolianEdgeCombo();
  }
}

function ninAeolianEdgeCombo() {
  next.combo = 1;
  addIcon({name: "spinningedge"});
  addIcon({name: "gustslash"});
  if (player.level >= 26) {
    addIcon({name: "aeolianedge"});
  }
}

function ninArmorCrushCombo() {
  next.combo = 2;
  addIcon({name: "spinningedge"});
  addIcon({name: "gustslash"});
  addIcon({name: "armorcrush"});
}

function ninShadowFangCombo() {
  next.combo = 3;
  addIcon({name: "spinningedge"});
  addIcon({name: "shadowfang"});
}

function ninHakkeMujinsatsuCombo() {
  next.combo = 4;
  addIcon({name: "deathblossom"});
  if (player.level >= 52) {
    addIcon({name: "hakkemujinsatsu"});
  }
}

function ninLosesMudra() {
  removeIcon("ninjutsu1");
  removeIcon("ninjutsu2");
  removeIcon("ninjutsu3");
  addCountdownBar({name: "ninjutsu"});
  clearTimeout(timeout.ninjutsu);
  timeout.ninjutsu = setTimeout(ninNinjutsu, recast.ninjutsu - 1000);
  if (checkRecast("kassatsu1") < 0) {
    addIcon({name: "kassatsu"});
  }
  if (checkRecast("tenchijin") < 0) {
    addIcon({name: "tenchijin"});
  }
}

function ninNinjutsu() {

  if (player.level >= 70) {
    if (checkRecast("trickattack") < checkRecast("tenchijin") + 25000) {
      addCountdownBar({name: "tenchijin", time: checkRecast("tenchijin"), text: "SUITON"});
    }
    else {
      removeCountdownBar("tenchijin");  // Maybe explore this another day
    }
  }

  if (player.level >= 45
  && player.jobDetail.hutonMilliseconds == 0
  && checkStatus("kassatsu")
  && checkStatus("tenchijin") < 0) {
    icon.ninjutsu3 = icon.huton;
    addIcon({name: "ninjutsu3"}); // Huton if down and no damage buffs
  }
  else if (player.level >= 45
  && player.level < 54  // No AC
  && player.jobDetail.hutonMilliseconds < 25000
  && checkStatus("kassatsu") < 0) {
    icon.ninjutsu3 = icon.huton;
    addIcon({name: "ninjutsu3"});  // Huton if Huton is low (and no AC yet)
  }

  else if (checkStatus("tenchijin") > 0) {
    if (count.targets >= 2) {
      icon.ninjutsu1 = icon.fumashuriken;
      icon.ninjutsu2 = icon.katon;
      icon.ninjutsu3 = icon.suiton;
    }
    else {
      icon.ninjutsu1 = icon.fumashuriken;
      icon.ninjutsu2 = icon.raiton;
      icon.ninjutsu3 = icon.suiton;
    }
    addIcon({name: "ninjutsu1"});
    addIcon({name: "ninjutsu2"});
    addIcon({name: "ninjutsu3"});
  }

  else if (player.level >= 76
  && checkStatus("kassatsu") > 0) {
    if (count.targets >= 2) {
      icon.ninjutsu3 = icon.katon;
    }
    else {
      icon.ninjutsu3 = icon.hyoton;
    }
    addIcon({name: "ninjutsu3"});
  }

  else if (player.level >= 45
  && checkStatus("suiton") < checkRecast("trickattack")
  && checkRecast("trickattack") < 24000
  && checkRecast("tenchijin") > 1000) {
    icon.ninjutsu3 = icon.suiton;
    addIcon({name: "ninjutsu3"});
    if (checkStatus("tenchijin") > 0) {
      icon.ninjutsu1 = icon.fumashuriken;
      addIcon({name: "ninjutsu1"});
      icon.ninjutsu2 = icon.raiton;
      addIcon({name: "ninjutsu2"});
    }
  }

  else if (player.level >= 35
  && count.targets >= 3) {
    icon.ninjutsu3 = icon.katon;
    addIcon({name: "ninjutsu3"}); // Probably more damage at 3 targets to do Katon than anything else...
  }

  else if (player.level >= 45
  && checkStatus("suiton", player.ID) < 0
  && player.jobDetail.ninkiAmount < 60
  && checkRecast("tenchijin") > 1000) {
    icon.ninjutsu3 = icon.suiton;
    addIcon({name: "ninjutsu3"});
    if (checkStatus("tenchijin") > 0) {
      icon.ninjutsu1 = icon.fumashuriken;
      addIcon({name: "ninjutsu1"});
      icon.ninjutsu2 = icon.raiton;
      addIcon({name: "ninjutsu2"});
    }
  }
  else if (player.level >= 35
  && count.targets >= 2) {
    icon.ninjutsu3 = icon.katon;
    addIcon({name: "ninjutsu3"});
  }
  else if (player.level >= 35) {
    icon.ninjutsu3 = icon.raiton;
    addIcon({name: "ninjutsu3"});
  }
  else if (player.level >= 30) {
    icon.ninjutsu3 = icon.fumashuriken;
    addIcon({name: "ninjutsu3"});
  }
  else {
    console.log("Possible error in ninjutsu decision")
    removeIcon("ninjutsu");
  }
}

// function ninMudraCombo() {
//
//   if (checkStatus("kassatsu", player.ID) > 5000) {
//     icon.katon = icon.gokamekkyaku;
//     icon.hyoton = icon.hyoshoranyu;
//   }
//   else {
//     icon.katon = "002908";
//     icon.hyoton = "002909";
//   }
//
//   if (toggle.mudra.length == 1) {
//     // Fuma Shuriken
//   }
//   else if (["CT", "JT"].indexOf(toggle.mudra) > -1) {
//     // Katon
//   }
//   else if (["TC", "JC"].indexOf(toggle.mudra) > -1) {
//     // Raiton
//   }
//   else if (["TJ", "CJ"].indexOf(toggle.mudra) > -1) {
//     // Hyoton
//   }
//   else if (["JCT", "CJT"].indexOf(toggle.mudra) > -1) {
//     // Huton
//   }
//   else if (["TJC", "JTC"].indexOf(toggle.mudra) > -1) {
//     // Doton
//   }
//   else if (["TCJ", "CTJ"].indexOf(toggle.mudra) > -1) {
//     // Suiton
//   }
//   else {
//     // Rabbit
//   }
// }

function ninNinki() {

  if (player.jobDetail.ninkiAmount >= 80) {
    // if (player.level >= 80
    // && checkRecast("bunshin") < 1000) {
    //   icon.ninkiaction = icon.bunshin;
    // }
    if (player.level >= 68
    && count.targets == 1) {
      icon.ninkiaction = icon.bhavacakra;
    }
    else {
      icon.ninkiaction = icon.hellfrogmedium;
    }
    addIcon({name: "ninkiaction"});
  }

  else {
    removeIcon("ninkiaction");
  }
}

"use strict";

// Define actions to watch for

actionList.pld = [

  // Non-GCD actions
  "Fight Or Flight", "Spirits Within", "Sheltron", "Sentinel", "Cover",
  "Divine Veil", "Intervention", "Requiescat", "Passage Of Arms",
  "Intervene",
  "Circle Of Scorn",

  // GCD actions
  "Fast Blade", "Riot Blade", "Rage Of Halone", "Goring Blade",
  "Royal Authority", "Atonement", "Holy Spirit",
  "Total Eclipse", "Prominence", "Holy Circle", "Confiteor",
  // Total Eclipse => Prominence: 3 or more
  // Holy Circle: 2 or more

  // Role actions
  "Rampart", "Arm\'s Length"

];

function pldJobChange() {

  nextid.ironwill = 0;

  nextid.atonement1 = 1;
  nextid.atonement2 = nextid.atonement1 + 1;
  nextid.atonement3 = nextid.atonement1 + 2;

  nextid.combo1 = nextid.atonement1 + 3;
  nextid.combo2 = nextid.combo1 + 1;
  nextid.combo3 = nextid.combo1 + 2;

  nextid.holyspirit1 = nextid.combo1;
  nextid.holyspirit2 = nextid.holyspirit1 + 1;
  nextid.holyspirit3 = nextid.holyspirit1 + 2;
  nextid.holyspirit4 = nextid.holyspirit1 + 3;
  nextid.holyspirit5 = nextid.holyspirit1 + 4;

  nextid.fastblade = nextid.combo1;
  nextid.totaleclipse = nextid.combo1;

  nextid.riotblade = nextid.combo2;
  nextid.prominence = nextid.combo2;

  nextid.rageofhalone = nextid.combo3;
  nextid.royalauthority = nextid.rageofhalone;
  nextid.goringblade = nextid.combo3;

  nextid.mitigation = 10;
  nextid.rampart = nextid.mitigation;
  nextid.sentinel = nextid.mitigation;
  nextid.sheltron = nextid.mitigation;
  nextid.fightorflight = 11;
  nextid.requiescat = nextid.fightorflight;

  countdownid.fightorflight = 0;
  countdownid.requiescat = 1;
  countdownid.intervene2 = 2;
  countdownid.rampart = 11;
  countdownid.sentinel = 12;
  countdownid.hallowedground = 13;

  previous.totaleclipse = 0;
  previous.prominence = 0;
  previous.holycircle = 0;
  previous.confiteor = 0;
  previous.circleofscorn = 0;

  if (player.level >= 60) {
    icon.rageofhalone = icon.royalauthority;
  }
  else {
    icon.rageofhalone = "000155";
  }

  if (checkRecast("fightorflight") <= checkRecast("requiescat")) {
    addCountdownBar({name: "fightorflight", time: checkRecast("fightorflight")});
  }
  else if (player.level >= 68) {
    addCountdownBar({name: "requiescat", time: checkRecast("requiescat")});
  }

  addCountdownBar({name: "rampart", time: checkRecast("rampart")});

  // if (player.level >= 12) {
  //   addCountdownBar({name: "lowblow", time: checkRecast("lowblow")});
  // }

  // if (player.level >= 18) {
  //   addCountdownBar({name: "interject", time: checkRecast("interject")});
  // }

  // if (player.level >= 22) {
  //   addCountdownBar({name: "reprisal", time: checkRecast("reprisal")});
  // }

  if (player.level >= 38) {
    addCountdownBar({name: "sentinel", time: checkRecast("sentinel")});
  }

  // if (player.level >= 48) {
  //   addCountdownBar({name: "shirk", time: checkRecast("shirk")});
  // }

  if (player.level >= 50) {
    addCountdownBar({name: "hallowedground", time: checkRecast("hallowedground")});
  }

  if (player.level >= 74) {
    addCountdownBar({name: "intervene2", time: checkRecast("intervene2")});
  }

  pldCombo();

}

function pldPlayerChangedEvent() {
}

function pldCastStart() {
}


function pldCastCancel() {
}

function pldAction() {

  if (actionList.pld.indexOf(actionLog.groups.actionName) > -1) {

    // Role actions

    if ("Rampart" == actionLog.groups.actionName) {
      addRecast("rampart");
      removeIcon("rampart");
    }

    // PLD non-GCD

    else if ("Fight Or Flight" == actionLog.groups.actionName) {
      removeIcon("fightorflight");
      addStatus("fightorflight");
      addRecast("fightorflight");
      addCountdownBar({name: "fightorflight"});
    }

    else if ("Spirits Within" == actionLog.groups.actionName) {
      addRecast("spiritswithin");
    }

    else if ("Sheltron" == actionLog.groups.actionName) {
      addRecast("sheltron");
    }

    else if ("Sentinel" == actionLog.groups.actionName) {
      addRecast("sentinel");
    }

    else if ("Cover" == actionLog.groups.actionName) {
      addRecast("cover");
    }

    else if ("Divine Veil" == actionLog.groups.actionName) {
      addRecast("divineveil");
    }

    else if ("Intervention" == actionLog.groups.actionName) {
      addRecast("intervention");
    }

    else if ("Requiescat" == actionLog.groups.actionName) {
      removeIcon("requiescat");
      addStatus("requiescat");
      addRecast("requiescat");
      addCountdownBar({name: "requiescat"});

      pldRequiescatMP();
    }

    else if ("Passage Of Arms" == actionLog.groups.actionName) {
      addRecast("passageofarms");
    }

    else if ("Intervene" == actionLog.groups.actionName) {
      if (checkRecast("intervene2") < 0) {
        addRecast("intervene1", -1);
        addRecast("intervene2");
      }
      else {
        addRecast("intervene1", checkRecast("intervene2"));
        addRecast("intervene2", checkRecast("intervene2") + recast.intervene);
      }
    }

    else if ("Circle Of Scorn" == actionLog.groups.actionName) {
      if (Date.now() - previous.circleofscorn > 1000) {
        previous.circleofscorn = Date.now();
        count.targets = 1;
        addRecast("circleofscorn");
      }
      else {
        count.targets = count.targets + 1;
      }
    }

    // GCD actions - affect combos

    // else if ("Bloodspiller" == actionLog.groups.actionName) {
    //   removeIcon("bloodspiller");
    // }

    // GCD actions - affect combos, catch all)

    else {

      if ("Fast Blade" == actionLog.groups.actionName
      && actionLog.groups.result.length > 1) {
        if (next.combo > 2) {
          pldSingleTargetCombo();
          toggle.combo = Date.now();
        }
        removeIcon("fastblade");
        pldComboTimeout();
      }

      else if ("Riot Blade" == actionLog.groups.actionName
      && actionLog.groups.result.length > 6) {
        if (player.level < 26) {
          pldCombo();
        }
        else {
          removeIcon("fastblade");
          removeIcon("riotblade");
          pldComboTimeout();
        }
      }

      else if ("Goring Blade" == actionLog.groups.actionName
      && actionLog.groups.result.length > 6) {
        addStatus("goringblade", duration.goringblade, actionLog.groups.targetID);
        pldCombo();
      }

      else if ("Royal Authority" == actionLog.groups.actionName
      && player.level >= 76
      && actionLog.groups.result.length > 6) {
        removeIcon("royalauthority");
        count.atonement = 3;
        addIcon({name: "atonement1"});
        addIcon({name: "atonement2"});
        addIcon({name: "atonement3"});
        pldGoringBladeCombo();
      }

      else if ("Atonement" == actionLog.groups.actionName
      && actionLog.groups.result.length > 1) {
        count.atonement = count.atonement - 1;
        if (count.atonement == 2) {
          removeIcon("atonement1");
        }
        else if (count.atonement == 1) {
          removeIcon("atonement2");
        }
        if (count.atonement == 0) {
          removeIcon("atonement3");
        }
      }

      else if ("Total Eclipse" == actionLog.groups.actionName
      && actionLog.groups.result.length > 1) {

        if (Date.now() - previous.totaleclipse > 1000) {
          previous.totaleclipse = Date.now();
          count.targets = 1;
          if (next.combo < 3) {
            pldAreaOfEffectCombo();
          }
          removeIcon("totaleclipse");
          if (player.level < 40) {
            pldCombo();
          }
          else {
            toggle.combo = Date.now();
            pldComboTimeout();
          }
        }
        else {
          count.targets = count.targets + 1;
          pldCombo();
        }
      }

      else if ("Prominence" == actionLog.groups.actionName
      && actionLog.groups.result.length > 6) {

        if (Date.now() - previous.prominence > 1000) {
          previous.prominence = Date.now();
          count.targets = 1;
        }
        else {
          count.targets = count.targets + 1;
        }
        pldCombo();
      }

      else if ("Holy Spirit" == actionLog.groups.actionName
      && actionLog.groups.result.length > 1) {
        pldRequiescatMP();
      }

      else if ("Holy Circle" == actionLog.groups.actionName
      && actionLog.groups.result.length > 1) {
        if (Date.now() - previous.holycircle > 1000) {
          previous.holycircle = Date.now();
          count.targets = 1;
        }
        else {
          count.targets = count.targets + 1;
        }
        pldRequiescatMP();
      }

      else if ("Confiteor" == actionLog.groups.actionName
      && actionLog.groups.result.length > 1) {
        if (Date.now() - previous.confiteor > 1000) {
          previous.confiteor = Date.now();
          count.targets = 1;
        }
        else {
          count.targets = count.targets + 1;
        }
        pldRequiescatMP()
      }

      else {
        pldCombo();
      }
    }
  }
}

function pldStatus() {

  if (effectLog.groups.targetID == player.ID) { // Target is self

    if ("Rampart" == effectLog.groups.effectName) {
      if (effectLog.groups.gainsLoses == "gains") {
        if (checkStatus("mitigation", effectLog.groups.targetID) < parseInt(effectLog.groups.effectDuration) * 1000) {
          addStatus("mitigation", parseInt(effectLog.groups.effectDuration) * 1000, effectLog.groups.targetID);
        }
      }
      else if (effectLog.groups.gainsLoses == "loses") {
        if (checkStatus("mitigation", effectLog.groups.targetID) < 0 // Check for overlaps
        && count.targets >= 3) {
          drkMitigation();
        }
      }
    }

    else if ("Iron Will" == effectLog.groups.effectName) {
      if (effectLog.groups.gainsLoses == "gains") {
        removeIcon("ironwill");
      }
      else if (effectLog.groups.gainsLoses == "loses") {
        addIcon({name: "ironwill"});
      }
    }

    else if ("Sentinel" == effectLog.groups.effectName) {
      if (effectLog.groups.gainsLoses == "gains") {
        if (checkStatus("mitigation", effectLog.groups.targetID) < parseInt(effectLog.groups.effectDuration) * 1000) {
          addStatus("mitigation", parseInt(effectLog.groups.effectDuration) * 1000, effectLog.groups.targetID);
        }
      }
      else if (effectLog.groups.gainsLoses == "loses") {
        if (checkStatus("mitigation", effectLog.groups.targetID) < 0
        && count.targets >= 3) {
          drkMitigation();
        }
      }
    }

    else if ("Requiescat" == effectLog.groups.effectName) {
      if (effectLog.groups.gainsLoses == "gains") {
        addStatus("requiescat", parseInt(effectLog.groups.effectDuration) * 1000, effectLog.groups.targetID)
      }
      else if (effectLog.groups.gainsLoses == "loses") {
        removeStatus("requiescat");
        removeIcon("holyspirit1");
        removeIcon("holyspirit2");
        removeIcon("holyspirit3");
        removeIcon("holyspirit4");
        removeIcon("holyspirit5");
        pldCombo();
      }
    }

    else if ("Sword Oath" == effectLog.groups.effectName) {
      if (effectLog.groups.gainsLoses == "gains") {
        addStatus("swordoath", parseInt(effectLog.groups.effectDuration) * 1000, effectLog.groups.targetID)
      }
      else if (effectLog.groups.gainsLoses == "loses") {
        removeIcon("atonement1");
        removeIcon("atonement2");
        removeIcon("atonement3");
        removeStatus("swordoath");
        pldCombo();
      }
    }

  }
}


function pldMitigation() {

  // Shows next mitigation cooldown

}
//
// function pldMP() {
//
//   player.tempjobDetail.darkarts = player.debugJobSplit[4]; // 0 or 1
//
//   if (player.level >= 74) {
//     if (count.targets >= 2) {
//       icon.floodofdarkness = icon.floodofshadow;
//     }
//     else {
//       icon.floodofdarkness = icon.edgeofshadow;
//     }
//   }
//   else if (player.level >= 40
//   && count.targets == 1) {
//     icon.floodofdarkness = icon.edgeofdarkness;
//   }
//   else {
//     icon.floodofdarkness = "003082";
//   }
//
//   if (player.level >= 70) {
//     if (player.currentMP >= 6000
//     || player.tempjobDetail.darkarts == 1) {
//       //addIcon({name: "floodofdarkness"});
//     }
//     else {
//       removeIcon("floodofdarkness");
//     }
//   }
//   else if (player.level >= 30) { // No TBN yet
//     if (player.currentMP >= 3000) {
//       addIcon({name: "floodofdarkness"});
//     }
//     else {
//       removeIcon("floodofdarkness");
//     }
//   }
// }

// function pldGauge() {
//
//   let targetblood = 50; // Use spender at or above this number
//
//   if (player.level >= 64
//   && count.targets >= 3) {
//     icon.gaugespender = icon.quietus;
//   }
//   else {
//     icon.gaugespender = icon.bloodspiller;
//   }
//
//   if (checkStatus("delirium", player.ID) > 0) {
//     targetblood = 0;
//   }
//   else if (player.level >= 80
//   && checkRecast("livingshadow") < 20000) { // Is this enough?
//     targetblood = 100; // Try to have a buffer for Living Shadow
//   }
//
//   if (player.jobDetail.blood >= targetblood) {
//     if (player.level >= 80
//     && checkRecast("livingshadow") < 1000) {
//       addIcon({name: "gaugespender"});
//     }
//     else if (player.level >= 62) {
//       addIcon({name: "gaugespender"});
//     }
//   }
//   else {
//     removeIcon("gaugespender");
//   }
// }

function pldCombo() {

  delete toggle.combo;
  delete next.combo;

  removeIcon("combo1");
  removeIcon("combo2");
  removeIcon("combo3");

  if (checkStatus("requiescat") < 0
  || player.currentMP < 2000) {
    if (count.targets >= 3) {
      pldAreaOfEffectCombo();
    }
    else {
      pldSingleTargetCombo();
    }
  }

}

function pldSingleTargetCombo() {
  if (checkStatus("swordoath") > 2000) {
    pldGoringBladeCombo();
  }
  else if (player.level >= 54
  && checkStatus("goringblade", target.ID) < 5 * 2500) {
    pldGoringBladeCombo();
  }
  else if (player.level >= 54
  && checkRecast("fightorflight") < 2 * 2500) {
    pldGoringBladeCombo();
  }
  else if (player.level >= 54
  && checkStatus("fightorflight") > 3 * 2500
  && checkStatus("fightorflight") < 6 * 2500) {
    pldGoringBladeCombo();
  }
  else {
    pldRageOfHaloneCombo();
  }
}

function pldAreaOfEffectCombo() {
  pldProminenceCombo();
}

function pldRageOfHaloneCombo() {
  next.combo = 1;
  addIcon({name: "fastblade"});
  addIcon({name: "riotblade"});
  if (player.level >= 26) {
    addIcon({name: "rageofhalone"});
  }
}

function pldGoringBladeCombo() {
  next.combo = 2;
  addIcon({name: "fastblade"});
  addIcon({name: "riotblade"});
  addIcon({name: "goringblade"});
}


function pldProminenceCombo() {
  next.combo = 3;
  addIcon({name: "totaleclipse"});
  if (player.level >= 40) {
    addIcon({name: "prominence"});
  }
}

function pldComboTimeout() {
  clearTimeout(timeout.combo);
  timeout.combo = setTimeout(pldCombo, 12500);
}

function pldRequiescatMP() {

  removeIcon("holyspirit1");
  removeIcon("holyspirit2");
  removeIcon("holyspirit3");
  removeIcon("holyspirit4");
  removeIcon("holyspirit5");

  if (count.targets >= 2) {
    icon.holyspirit1 = icon.holycircle;
    icon.holyspirit2 = icon.holycircle;
    icon.holyspirit3 = icon.holycircle;
    icon.holyspirit4 = icon.holycircle;
    icon.holyspirit5 = icon.holycircle;
  }
  else {
    icon.holyspirit1 = icon.holyspirit;
    icon.holyspirit2 = icon.holyspirit;
    icon.holyspirit3 = icon.holyspirit;
    icon.holyspirit4 = icon.holyspirit;
    icon.holyspirit5 = icon.holyspirit;
  }

  if (player.level >= 80) {
    icon.holyspirit5 = icon.confiteor;
  }

  if (Math.floor(player.currentMP / 2000) >= 5) {
    addIcon({name: "holyspirit1"});
  }
  if (Math.floor(player.currentMP / 2000) >= 4) {
    addIcon({name: "holyspirit2"});
  }
  if (Math.floor(player.currentMP / 2000) >= 3) {
    addIcon({name: "holyspirit3"});
  }
  if (Math.floor(player.currentMP / 2000) >= 2) {
    addIcon({name: "holyspirit4"});
  }
  if (Math.floor(player.currentMP / 2000) >= 1) {
    addIcon({name: "holyspirit5"});
  }

  if (Math.floor(player.currentMP / 2000) == 0) {
    pldCombo();
  }

}


"use strict";

actionList.raid = [

  // ALl
  "Battle Litany",
  "Battle Voice",
  "Chain Stratagem",
  "Devilment",
  "Devotion",
  "Technical Step",
  "Trick Attack",

  // Physical only
  "Brotherhood",
  "Embolden"

];

countdownid.raidbattlelitany = 30;
countdownid.raidbattlevoice = 31;
countdownid.raidbrotherhood = 32;
countdownid.raidchainstratagem = 33;
countdownid.raiddevilment = 34;
countdownid.raiddevotion = 35;
countdownid.raiddragonsight = 36;
countdownid.raidembolden = 37;
countdownid.raidtechnicalstep = 38;
countdownid.raidtrickattack = 39;

function raidAction() {

  // Set up icon changes from combat here

  if (actionList.raid.indexOf(actionLog.groups.actionName) > -1) {

    if ("Battle Litany" == actionLog.groups.actionName) {
      addCountdownBar({name: "raidbattlelitany", time: recast.battlelitany, text: actionLog.groups.sourceName});
    }

    else if ("Battle Voice" == actionLog.groups.actionName) {
      addCountdownBar({name: "raidbattlevoice", time: recast.battlevoice, text: actionLog.groups.sourceName});
    }

    // else if ("Brotherhood" == actionLog.groups.actionName
    // && ["BRD", "DNC", "DRG", "MCH", "MNK", "NIN", "SAM"].indexOf(player.job) > -1) {
    else if ("Brotherhood" == actionLog.groups.actionName) {
      addCountdownBar({name: "raidbrotherhood", time: recast.brotherhood, text: actionLog.groups.sourceName});
    }

    else if ("Chain Stratagem" == actionLog.groups.actionName) {
      addCountdownBar({name: "raidchainstratagem", time: recast.chainstratagem, text: actionLog.groups.sourceName});
    }

    else if ("Devilment" == actionLog.groups.actionName) {
      addCountdownBar({name: "raiddevilment", time: recast.devilment, text: actionLog.groups.sourceName});
    }

    else if ("Devotion" == actionLog.groups.actionName) {
      addCountdownBar({name: "raiddevotion", time: recast.devotion, text: actionLog.groups.sourceName});
    }

    else if ("Dragon Sight" == actionLog.groups.actionName) {
      addCountdownBar({name: "raiddragonsight", time: recast.dragonsight, text: actionLog.groups.sourceName});
    }

    // else if ("Embolden" == actionLog.groups.actionName
    // && ["BRD", "DNC", "DRG", "MCH", "MNK", "NIN", "SAM"].indexOf(player.job) > -1) {
    else if ("Embolden" == actionLog.groups.actionName) {
      addCountdownBar({name: "raidembolden", time: recast.embolden, text: actionLog.groups.sourceName});
    }

    else if ("Technical Step" == actionLog.groups.actionName) {
      addCountdownBar({name: "raidtechnicalstep", time: recast.technicalstep, text: actionLog.groups.sourceName});
    }

    else if ("Trick Attack" == actionLog.groups.actionName) {
      addCountdownBar({name: "raidtrickattack", time: recast.trickattack, text: actionLog.groups.sourceName});
    }

  }

}

'use strict';

const rdmProcBufferTime = 7500;

const rdmVerflareCombo = () => {
  addIcon({ name: 'verflare' });
  if (player.level >= 80) {
    addIcon({ name: 'scorch' });
  }
};

const rdmVerholyCombo = () => {
  addIcon({ name: 'verholy' });
  if (player.level >= 80) {
    addIcon({ name: 'scorch' });
  }
};

const rdmMeleeCombo = () => {
  toggle.combo = Date.now();
  addIcon({ name: 'riposte' });
  if (player.level >= 35) {
    addIcon({ name: 'zwerchhau' });
  }
  if (player.level >= 50) {
    addIcon({ name: 'redoublement' });
  }
  // Verflare or Verholy?
  if (player.level >= 68
  && Math.min(player.jobDetail.blackMana, player.jobDetail.whiteMana) >= 80) {
    // In relative order of desirability
    if (player.level >= 70
    && player.jobDetail.blackMana > player.jobDetail.whiteMana
    && checkStatus('verstoneready') < rdmProcBufferTime) {
      rdmVerholyCombo();
    } else if (player.jobDetail.whiteMana > player.jobDetail.blackMana
    && checkStatus('verfireready') < rdmProcBufferTime) {
      rdmVerflareCombo();
    } else if (player.level >= 70
    && player.jobDetail.whiteMana + 20 - player.jobDetail.blackMana <= 30
    && checkStatus('verstoneready') < rdmProcBufferTime) {
      rdmVerholyCombo();
    } else if (player.jobDetail.blackMana + 20 - player.jobDetail.whiteMana <= 30
    && checkStatus('verfireready') < rdmProcBufferTime) {
      rdmVerflareCombo();
    } else if (player.level >= 70
    && player.jobDetail.blackMana > player.jobDetail.whiteMana) {
      rdmVerholyCombo();
    } else {
      rdmVerflareCombo();
    }
  }
};

const rdmDualcastPotency = ({
  manaTarget,
  blackMana = 0,
  whiteMana = 0,
  hardcastAction = 'hardcast',
  hardcastBlackMana = 0,
  hardcastWhiteMana = 0,
  dualcastAction = 'dualcast',
  dualcastBlackMana = 0,
  dualcastWhiteMana = 0,
  verstoneReady = 0,
  verfireReady = 0,
  // acceleration = 0,
  swiftcast = 0,
} = {}) => {
  // Static variables
  const singleTargetManaPotency = 8.07;
  const multiTargetManaPotency = 2.43; // Per target

  // Set proc potency
  let procPotency = 0;
  if (player.level >= 62) {
    procPotency = 20;
  } else {
    procPotency = 90;
  }

  // Calculate mana manaBreakpoint for Verflare/Verholy fixing
  const manaBreakpoint = (20 * 0.8) / singleTargetManaPotency + 3;

  // Find Hardcasted action potency
  let hardcastPotency = 0;
  if (Math.abs(Math.min(blackMana + hardcastBlackMana, 100)
  - Math.min(whiteMana + hardcastWhiteMana, 100)) > 30) {
    return 0;
  } else if (hardcastAction === 'jolt') {
    if (player.level >= 62) {
      // Level 62 trait
      hardcastPotency = 280;
    } else {
      hardcastPotency = 180;
    }
  } else if (verfireReady > 5000 && hardcastAction === 'verfire') {
    if (player.level >= 62) {
      // Level 62 trait
      hardcastPotency = 300;
    } else {
      hardcastPotency = 270;
    }
  } else if (verstoneReady > 5000 && hardcastAction === 'verstone') {
    if (player.level >= 62) {
      // Level 62 trait
      hardcastPotency = 300;
    } else {
      hardcastPotency = 270;
    }
  } else if (player.level >= 18 && hardcastAction === 'verthunder2') {
    if (player.level >= 78) {
      // Level 78 trait
      hardcastPotency = 120 * count.targets;
    } else {
      hardcastPotency = 100 * count.targets;
    }
  } else if (player.level >= 22 && hardcastAction === 'veraero2') {
    if (player.level >= 78) {
      // Level 78 trait
      hardcastPotency = 120 * count.targets;
    } else {
      hardcastPotency = 100 * count.targets;
    }
  } else if (player.level >= 18 && swiftcast < 0 && hardcastAction === 'swiftcast') {
    if (player.level >= 62) {
      hardcastPotency = (280 + 300 + 350 * 2) * 0.25;
    } else {
      hardcastPotency = (180 + 270 + 310 * 2) * 0.25;
    }
  } else {
    return 0;
  }

  // Find Dualcasted action potency
  let dualcastPotency = 0;
  if (Math.abs(Math.min(blackMana + hardcastBlackMana + dualcastBlackMana, 100)
  - Math.min(whiteMana + hardcastWhiteMana + dualcastWhiteMana, 100)) > 30) {
    return 0;
  } else if (dualcastAction === 'verthunder') {
    if (player.level >= 62) {
      // Level 62 trait
      dualcastPotency = 350;
    } else {
      dualcastPotency = 310;
    }
    if (hardcastAction === 'verfire' || verfireReady <= 0) {
      // Add proc potency if applicable
      dualcastPotency += procPotency * 0.5;
    }
  } else if (dualcastAction === 'veraero') {
    if (player.level >= 62) {
      // Level 62 trait
      dualcastPotency = 350;
    } else {
      dualcastPotency = 310;
    }
    if (hardcastAction === 'verstone' || verstoneReady <= 0) {
      // Add proc potency if applicable
      dualcastPotency += procPotency * 0.5;
    }
  } else if (player.level >= 15 && dualcastAction === 'scatter') {
    if (player.level >= 66) { // Trait
      dualcastPotency = 220 * count.targets;
    } else {
      dualcastPotency = 120 * count.targets;
    }
  } else {
    return 0;
  }

  const newBlackMana = Math.min(blackMana + hardcastBlackMana + dualcastBlackMana, 100);
  const newWhiteMana = Math.min(whiteMana + hardcastWhiteMana + dualcastWhiteMana, 100);
  const manaOverCap = blackMana + hardcastBlackMana + dualcastBlackMana - 100
    + whiteMana + hardcastWhiteMana + dualcastWhiteMana - 100;

  // Prioritize smaller mana differences
  let manaDifferenceModifier = Math.abs(newBlackMana - newWhiteMana);
  if (Math.min(newBlackMana, newWhiteMana) >= manaTarget) {
    manaDifferenceModifier *= -1; // Attempt to value larger spreads when above 80/80
  }

  // Proritize combo that results in Verholy/Verflare procs
  let startMeleeBonus = 0;
  if (Math.min(newBlackMana, newWhiteMana) >= manaTarget && manaOverCap < manaBreakpoint) {
    if (player.level >= 70 && newBlackMana > newWhiteMana && dualcastAction === 'verthunder'
    && verfireReady <= 0 && (hardcastAction === 'verstone' || verstoneReady <= 0)) {
      startMeleeBonus = 1000000; // 100% proc Verholy
    } else if (player.level >= 68 && newWhiteMana > newBlackMana && dualcastAction === 'veraero'
    && verstoneReady <= 0 && (hardcastAction === 'verfire' || verfireReady <= 0)) {
      startMeleeBonus = 1000000; // 100% proc Verflare
    } else if (player.level >= 70 && newBlackMana > newWhiteMana && dualcastAction === 'verthunder'
    && (hardcastAction === 'verstone' || verstoneReady <= 0)) {
      startMeleeBonus = 100000; // 100% proc Verholy, 50% overwrite existing proc
    } else if (player.level >= 68 && newWhiteMana > newBlackMana && dualcastAction === 'veraero'
    && (hardcastAction === 'verfire' || verfireReady <= 0)) {
      startMeleeBonus = 100000; // 100% proc Verflare, 50% overwrite existing proc
    }
  }

  // Calculate final potency
  const potency = hardcastPotency + dualcastPotency
    + (newBlackMana + newWhiteMana - blackMana - whiteMana)
    * Math.max(singleTargetManaPotency, count.targets * multiTargetManaPotency)
    - manaDifferenceModifier + startMeleeBonus;

  return potency;
};

const rdmDualcast = () => {
  const hardcastSpells = [
    ['jolt', 3, 3],
    ['verfire', 9, 0],
    ['verstone', 0, 9],
    ['verthunder2', 7, 0],
    ['veraero2', 0, 7],
    ['swiftcast', 0, 0],
  ];
  const dualcastSpells = [
    ['verthunder', 11, 0],
    ['veraero', 0, 11],
    ['scatter', 3, 3],
  ];
  const dualcastArray = [];
  let verfireReady = checkStatus('verfireready');
  let verstoneReady = checkStatus('verstoneready');
  let swiftcastRecast = checkRecast('swiftcast');
  let manaficationRecast = checkRecast('manafication');
  let { blackMana } = player.jobDetail;
  let { whiteMana } = player.jobDetail;
  let manaCap = 100;
  let manaTarget = 80;
  let bestDualcastCombo = [];
  let bestPotency = 0;
  let potency = 0;
  let elapsedTime = 0;
  // console.log(JSON.stringify(dualcastArray));

  do {
    // This will loop at least once

    // Calculate mana target for when to stop loop
    if (player.level >= 60 && manaficationRecast - elapsedTime <= 0) {
      if (count.targets > 1) {
        manaCap = 50;
        manaTarget = 50;
      } else {
        manaCap = 50;
        manaTarget = 40;
      }
    } else if (player.level >= 52 && count.targets > 1) {
      manaCap = 100;
      manaTarget = 50;
    } else {
      manaCap = 100;
      manaTarget = 80;
    }

    if (manaCap <= 50 && Math.min(blackMana, whiteMana) >= manaCap
    && count.targets === 1) {
      if (blackMana < whiteMana && whiteMana - 5 < manaCap
      && verfireReady <= 0) {
        dualcastArray.push({ name: 'reprise', icon: 'reprise' });
        blackMana -= 5;
        whiteMana -= 5;
        elapsedTime += 2200;
      } else if (whiteMana < blackMana && whiteMana - 5 < manaCap
      && verstoneReady <= 0) {
        dualcastArray.push({ name: 'reprise', icon: 'reprise' });
        blackMana -= 5;
        whiteMana -= 5;
        elapsedTime += 1500;
      } else if (Math.min(blackMana, whiteMana) - 20 > manaTarget
      && Math.min(blackMana, whiteMana) - 20 > manaCap) {
        dualcastArray.push({ name: 'moulinet', icon: 'moulinet' });
        blackMana -= 20;
        whiteMana -= 20;
        elapsedTime += 1500;
      }
    } else if (player.level >= 52 && Math.min(blackMana, whiteMana) - 20 >= manaTarget) {
      dualcastArray.push({ name: 'moulinet', icon: 'moulinet' });
      blackMana -= 20;
      whiteMana -= 20;
      elapsedTime += 1500;
    } else if (player.level >= 52 && Math.min(blackMana, whiteMana) - 20 >= manaTarget) {
      dualcastArray.push({ name: 'moulinet', icon: 'moulinet' });
      blackMana -= 20;
      whiteMana -= 20;
      elapsedTime += 1500;
    } else if (player.level >= 60 && manaficationRecast - elapsedTime < 0
    && Math.min(blackMana, whiteMana) >= manaTarget) {
      dualcastArray.push({ name: 'manafication', icon: 'manafication' });
      blackMana = Math.min(blackMana * 2, 100);
      whiteMana = Math.min(whiteMana * 2, 100);
      manaficationRecast = elapsedTime + 110000;
    } else {
      // Loops through every hardcast/dualcast combination to find most valuable one
      // To do - acceleration counts
      for (let i = 0; i < hardcastSpells.length; i += 1) {
        for (let j = 0; j < dualcastSpells.length; j += 1) {
          potency = rdmDualcastPotency({
            blackMana,
            whiteMana,
            manaTarget,
            hardcastAction: hardcastSpells[i][0],
            hardcastBlackMana: hardcastSpells[i][1],
            hardcastWhiteMana: hardcastSpells[i][2],
            dualcastAction: dualcastSpells[j][0],
            dualcastBlackMana: dualcastSpells[j][1],
            dualcastWhiteMana: dualcastSpells[j][2],
            verfireReady: verfireReady - elapsedTime,
            verstoneReady: verstoneReady - elapsedTime,
            swiftcastRecast: swiftcastRecast - elapsedTime,
          });
          if (potency > bestPotency) {
            bestPotency = potency;
            bestDualcastCombo = [
              hardcastSpells[i][0],
              dualcastSpells[j][0],
              hardcastSpells[i][1] + dualcastSpells[j][1],
              hardcastSpells[i][2] + dualcastSpells[j][2],
              bestPotency,
            ];
          }
        }
      }
      // console.log(JSON.stringify(bestDualcastCombo)); // Uncomment to check array at end
      // Adjust Verfire/Verstone Ready
      if (bestDualcastCombo[0] === 'verfire') {
        verfireReady = 0;
      } else if (bestDualcastCombo[0] === 'verstone') {
        verstoneReady = 0;
      }

      if (bestDualcastCombo[0] === 'swiftcast') {
        swiftcastRecast = recast.swiftcast + elapsedTime;
      }

      // Add to action array
      dualcastArray.push({ name: 'hardcast', icon: bestDualcastCombo[0] });
      dualcastArray.push({ name: 'dualcast', icon: bestDualcastCombo[1] });
      elapsedTime += 5000;
      blackMana = Math.min(blackMana + bestDualcastCombo[2], 100);
      whiteMana = Math.min(whiteMana + bestDualcastCombo[3], 100);
    }
    // Set up for next loop
    bestPotency = 0;
  } while (elapsedTime <= 12500 && Math.min(blackMana, whiteMana) < 80);

  // Uncomment to check array
  // console.log(`Black: ${blackMana}/${manaCap} White:${whiteMana}/${manaCap}`);
  // console.log(JSON.stringify(dualcastArray));

  actionArray = dualcastArray;
  syncActions({ array: actionArray });
};

const rdmNext = () => { // Main function
  rdmDualcast();

  if (player.level >= 50
  && Math.min(player.jobDetail.blackMana, player.jobDetail.whiteMana) >= 80
  && count.targets === 1) {
    rdmMeleeCombo();
  }
};

const rdmOnJobChange = () => {
  // nextid.manafication = 0;
  // nextid.moulinet = nextid.manafication;
  // nextid.reprise = nextid.manafication;
  //
  // nextid.combo1 = 1;
  // nextid.combo2 = nextid.combo1 + 1;
  // nextid.combo3 = nextid.combo1 + 2;
  // nextid.combo4 = nextid.combo1 + 3;
  // nextid.combo5 = nextid.combo1 + 4;
  // nextid.riposte = 1;
  // nextid.zwerchhau = nextid.riposte + 1;
  // nextid.redoublement = nextid.riposte + 2;
  // nextid.verflare =  nextid.riposte + 3;
  // nextid.verholy =  nextid.riposte + 3;
  // nextid.scorch =  nextid.riposte + 4;
  // nextid.hardcast = 18;
  // nextid.dualcast = 19;
  // nextid.luciddreaming = 21;
  // nextid.fleche = 22;
  // nextid.contresixte = nextid.fleche + 1;
  // nextid.corpsacorps = nextid.fleche + 2;
  // nextid.displacement = nextid.fleche + 3;
  // nextid.swiftcast = nextid.fleche + 4;
  // nextid.acceleration = nextid.fleche + 5;
  // countdownid.manafication = 0;
  // countdownid.swiftcast = 1;
  // countdownid.fleche = 2;
  // countdownid.contresixte = 3;
  // countdownid.corpsacorps = 4;
  // countdownid.displacement = 5;
  // countdownid.acceleration = 6;
  // countdownid.embolden = 7;
  // countdownid.luciddreaming = 8;
  // previous.contresixte = 0;
  // previous.verthunder2 = 0;
  // previous.veraero2 = 0;
  // previous.scatter = 0;
  // previous.moulinet = 0;

  // Set up icons

  if (player.level >= 62) {
    icon.jolt = icon.jolt2;
  } else {
    icon.jolt = '003202';
  }

  if (player.level >= 66) {
    icon.scatter = icon.impact;
  } else {
    icon.scatter = '003207';
  }

  // Set up traits
  if (player.level >= 74) {
    recast.manafication = 110000;
  } else {
    recast.manafication = 120000;
  }

  if (player.level >= 78) {
    recast.contresixte = 35000;
  } else {
    recast.contresixte = 45000;
  }


  // Create cooldown notifications
  addCountdown({
    name: 'corpsacorps', array: cooldownArray, time: checkRecast('corpsacorps'), onComplete: 'addIcon',
  });
  if (player.level >= 40) {
    addCountdownBar({ name: 'displacement', array: cooldownArray, time: checkRecast('displacement'), onComplete: 'addIcon' });
  }
  if (player.level >= 45) {
    addCountdownBar({ name: 'fleche', array: cooldownArray, time: checkRecast('fleche'), onComplete: 'addIcon' });
  }
  if (player.level >= 56) {
    addCountdownBar({ name: 'contresixte', array: cooldownArray, time: checkRecast('contresixte'), onComplete: 'addIcon' });
  }
  if (player.level >= 60) {
    addCountdownBar({ name: 'manafication', array: cooldownArray, time: checkRecast('manafication') });
  }

  count.targets = 1;
  rdmNext();
};

const rdmOnStartsUsing = () => {
  delete toggle.combo; // Starting cast immediately breaks combo, apparently
  removeIcon('riposte');
  removeIcon('zwerchhau');
  removeIcon('redoublement');
  removeIcon('verflare');
  removeIcon('scorch');
};

const rdmOnAction = (actionMatch) => {
  const rdmActions = [
    // Off-GCD
    'Corps-A-Corps', 'Displacement', 'Fleche', 'Contre Sixte', 'Acceleration', 'Manafication',
    'Engagement',
    // GCD
    'Jolt', 'Verfire', 'Verstone', 'Jolt II', 'Verthunder', 'Veraero',
    'Verthunder II', 'Veraero II', 'Impact', 'Scatter',
    'Riposte', 'Zwerchhau', 'Redoublement', 'Moulinet', 'Reprise',
    'Enchanted Riposte', 'Enchanted Zwerchhau', 'Enchanted Redoublement', 'Enchanted Moulinet',
    'Enchanted Reprise',
    'Verflare', 'Verholy', 'Scorch',
    // Role
    'Swiftcast', 'Lucid Dreaming',
  ];

  if (rdmActions.indexOf(actionMatch.groups.actionName) > -1) {
    // Non-GCD Actions
    if (actionMatch.groups.actionName === 'Corps-A-Corps') {
      removeIcon('corpsacorps');
      addRecast('corpsacorps');
      addCountdownBar({ name: 'corpsacorps', time: recast.corpsacorps, onComplete: 'addIcon' });
    } else if (['Displacement', 'Engagement'].indexOf(actionMatch.groups.actionName) > -1) {
      removeIcon('displacement');
      addRecast('displacement');
      addCountdownBar({ name: 'displacement', time: recast.displacement, onComplete: 'addIcon' });
    } else if (actionMatch.groups.actionName === 'Fleche') {
      removeIcon('fleche');
      addRecast('fleche');
      addCountdownBar({ name: 'fleche', time: recast.fleche, onComplete: 'addIcon' });
    } else if (actionMatch.groups.actionName === 'Acceleration') {
      removeIcon('acceleration');
      addRecast('acceleration');
      addCountdownBar({ name: 'acceleration', time: recast.acceleration, onComplete: 'addIcon' });
    } else if (actionMatch.groups.actionName === 'Contre Sixte') {
      removeIcon('contresixte');
      addRecast('contresixte');
      addCountdownBar({ name: 'contresixte', time: recast.contresixte, onComplete: 'addIcon' });
      countTargets('contresixte');
    } else if (actionMatch.groups.actionName === 'Embolden') {
      addRecast('embolden');
    } else if (actionMatch.groups.actionName === 'Swiftcast') {
      removeIcon('swiftcast');
      addRecast('swiftcast');
      addCountdownBar({ name: 'swiftcast', time: recast.swiftcast, onComplete: 'addIcon' });
    } else if (actionMatch.groups.actionName === 'Lucid Dreaming') {
      addRecast('luciddreaming');
    } else if (['Riposte', 'Enchanted Riposte'].indexOf(actionMatch.groups.actionName) > -1) {
      count.targets = 1;
      rdmMeleeCombo();
      removeIcon('riposte');
      if (player.level < 35
      || Math.max(player.jobDetail.blackMana, player.jobDetail.whiteMana) < 25) {
        delete toggle.combo;
      }
    } else if (['Zwerchhau', 'Enchanted Zwerchhau'].indexOf(actionMatch.groups.actionName) > -1) {
      removeIcon('zwerchhau');
      if (player.level < 50
      || Math.max(player.jobDetail.blackMana, player.jobDetail.whiteMana) < 25) {
        delete toggle.combo;
      }
    } else if (['Redoublement', 'Enchanted Redoublement'].indexOf(actionMatch.groups.actionName) > -1) {
      removeIcon('redoublement');
      if (player.level < 68) {
        delete toggle.combo;
      }
    } else if (actionMatch.groups.actionName === 'Verflare') {
      removeIcon('verflare');
      if (player.level < 80) {
        delete toggle.combo;
      }
    } else if (actionMatch.groups.actionName === 'Verholy') {
      removeIcon('verholy');
      if (player.level < 80) {
        delete toggle.combo;
      }
    } else if (actionMatch.groups.actionName === 'Scorch') {
      removeIcon('scorch');
      delete toggle.combo;
    } else {
      delete toggle.combo; // Everything else here interrupts melee combo

      if (player.level >= 66
      && ['Verthunder', 'Veraero'].indexOf(actionMatch.groups.actionName) > -1) {
        count.targets = 1;
      } else if (actionMatch.groups.actionName === 'Verthunder II') {
        countTargets('verthunder2');
      } else if (actionMatch.groups.actionName === 'Veraero II') {
        countTargets('veraero2');
      } else if (['Scatter', 'Impact'].indexOf(actionMatch.groups.actionName) > -1) {
        countTargets('scatter');
      } else if (['Moulinet', 'Enchanted Moulinet'].indexOf(actionMatch.groups.actionName) > -1) {
        countTargets('moulinet');
        removeAction({ name: 'moulinet' });
      } else if (['Reprise', 'Enchanted Reprise'].indexOf(actionMatch.groups.actionName) > -1) {
        count.targets = 1;
        removeAction({ name: 'reprise' });
      } else if (actionMatch.groups.actionName === 'Manafication') {
        removeAction({ name: 'manafication' });
        removeIcon('manafication');
        addRecast('manafication');
        addRecast('corpsacorps', -1);
        addRecast('displacement', -1);
        addCountdownBar({ name: 'manafication' });
        addCountdownBar({ name: 'displacement', time: -1, onComplete: 'addIcon' });
        addCountdownBar({ name: 'corpsacorps', time: -1, onComplete: 'addIcon' });
      }
    }
  }
};

// 17: NetworkCancelAbility
const rdmOnCancelled = (cancelledMatch) => {
  if (cancelledMatch.groups.actionName === 'Jolt') {
    //
  }
  rdmNext(); // Recheck dualcast if casting canceled
};

// 1A: NetworkBuff
const rdmOnEffect = (effectMatch) => {
  if (effectMatch.groups.targetID === player.ID) {
    if (effectMatch.groups.effectName === 'Dualcast') {
      if (effectMatch.groups.gainsLoses === 'gains') {
        addStatus('dualcast', parseInt(effectMatch.groups.effectDuration, 10) * 1000);
        removeIcon('hardcast');
        removeAction({ name: 'hardcast' });
      } else if (effectMatch.groups.gainsLoses === 'loses') {
        removeStatus('dualcast');
        removeAction({ name: 'dualcast' });
        rdmNext();
      }
    } else if (effectMatch.groups.effectName === 'Verfire Ready') {
      if (effectMatch.groups.gainsLoses === 'gains') {
        addStatus('verfireready', parseInt(effectMatch.groups.effectDuration, 10) * 1000);
        if (!toggle.combo) {
          rdmDualcast(); // Prevents Verflare proc from resetting combo
        }
      } else if (effectMatch.groups.gainsLoses === 'loses') {
        removeStatus('verfireready', player.ID);
      }
    } else if (effectMatch.groups.effectName === 'Verstone Ready') {
      if (effectMatch.groups.gainsLoses === 'gains') {
        addStatus('verstoneready', parseInt(effectMatch.groups.effectDuration, 10) * 1000);
        if (!toggle.combo) {
          rdmDualcast(); // Prevents Verholy proc from resetting combo
        }
      } else if (effectMatch.groups.gainsLoses === 'loses') {
        removeStatus('verstoneready', player.ID);
      }
    } else if (effectMatch.groups.effectName === 'Manafication') {
      if (effectMatch.groups.gainsLoses === 'gains') {
        addStatus('manafication', parseInt(effectMatch.groups.effectDuration, 10) * 1000);
      } else if (effectMatch.groups.gainsLoses === 'loses') {
        removeStatus('manafication', player.ID);
      }
    } else if (effectMatch.groups.effectName === 'Swiftcast') {
      if (effectMatch.groups.gainsLoses === 'gains') {
        addStatus('swiftcast', parseInt(effectMatch.groups.effectDuration, 10) * 1000);
        removeIcon('hardcast');
      } else if (effectMatch.groups.gainsLoses === 'loses') {
        removeStatus('swiftcast');
        rdmNext();
      }
    }
  }
};

//
// const rdmFixProcs = () => { // Fix procs if able
//   // Assume at least level 68 (no point in doing so before that)
//   if (player.level >= 70
//     && Math.min(player.jobDetail.blackMana, player.jobDetail.whiteMana) >= 80
//     && player.jobDetail.whiteMana < player.jobDetail.blackMana
//     && checkStatus('verstoneready') < rdmProcBufferTime) {
//     // Procs already fixed - start combo
//     rdmVerholyCombo(); // Verholy combo
//   } else if (player.jobDetail.blackMana < player.jobDetail.whiteMana
//     && Math.min(player.jobDetail.blackMana, player.jobDetail.whiteMana) >= 80
//     && checkStatus('verfireready') < rdmProcBufferTime) {
//     // Procs already fixed - start combo
//     rdmVerflareCombo(); // Verflare combo
//   } else if (player.level >= 70
//     && Math.min(player.jobDetail.whiteMana + 9, 100)
//     < Math.min(player.jobDetail.blackMana + 11, 100)
//     && Math.max(player.jobDetail.whiteMana + 9 - 100, 0)
//     + Math.max(player.jobDetail.blackMana + 11 - 100, 0) < rdmManaBreakpoint
//     && Math.min(player.jobDetail.whiteMana + 9, player.jobDetail.blackMana + 11) >= 80
//     && checkStatus('verstoneready') >= 5000) {
//     // Verstone + Verthunder => Verholy combo
//     addIcon({ name: 'hardcast', img: 'verstone' });
//     addIcon({ name: 'dualcast', img: 'verthunder' });
//   } else if (Math.min(player.jobDetail.blackMana + 9, 100)
//     < Math.min(player.jobDetail.whiteMana + 11, 100)
//     && Math.max(player.jobDetail.blackMana + 9 - 100, 0)
//     + Math.max(player.jobDetail.whiteMana + 11 - 100, 0) < rdmManaBreakpoint
//     && Math.min(player.jobDetail.blackMana + 9, player.jobDetail.whiteMana + 11) >= 80
//     && checkStatus('verfireready') >= 5000) {
//     // Verfire + Veraero => Verflare combo
//     addIcon({ name: 'hardcast', img: 'verfire' });
//     addIcon({ name: 'dualcast', img: 'veraero' });
//   } else if (player.level >= 70
//   && player.jobDetail.whiteMana < Math.min(player.jobDetail.blackMana + 20, 100)
//   && player.jobDetail.blackMana + 20 - 100 < rdmManaBreakpoint
//   && Math.min(player.jobDetail.whiteMana, player.jobDetail.blackMana + 20) >= 80
//   && checkStatus('verfireready') >= 5000
//   && checkStatus('verstoneready') < rdmProcBufferTime + 5000) {
//     // Verfire > Verthunder > Verholy combo
//     addIcon({ name: 'hardcast', img: 'verfire' });
//     addIcon({ name: 'dualcast', img: 'verthunder' });
//   } else if (player.jobDetail.blackMana < Math.min(player.jobDetail.whiteMana + 20, 100)
//   && player.jobDetail.whiteMana + 20 - 100 < rdmManaBreakpoint
//   && Math.min(player.jobDetail.blackMana, player.jobDetail.whiteMana + 20) >= 80
//   && checkStatus('verstoneready') >= 5000
//   && checkStatus('verfireready') < rdmProcBufferTime + 5000) {
//     // Verstone > Veraero > Verflare combo
//     addIcon({ name: 'hardcast', img: 'verstone' });
//     addIcon({ name: 'dualcast', img: 'veraero' });
//   } else if (player.level >= 70
//   && Math.min(player.jobDetail.whiteMana + 3, 100)
// < Math.min(player.jobDetail.blackMana + 14, 100)
//   && Math.max(player.jobDetail.whiteMana + 3 - 100, 0)
// + Math.max(player.jobDetail.blackMana + 14 - 100, 0) < rdmManaBreakpoint
//   && Math.min(player.jobDetail.whiteMana + 3, player.jobDetail.blackMana + 14) >= 80
//   && checkStatus('verstoneready') < rdmProcBufferTime + 5000) {
//     // Jolt > Verthunder > Verholy combo
//     addIcon({ name: 'hardcast', img: 'jolt' });
//     addIcon({ name: 'dualcast', img: 'verthunder' });
//   } else if (Math.min(player.jobDetail.blackMana + 3, 100)
//   < Math.min(player.jobDetail.whiteMana + 14, 100)
//   && Math.max(player.jobDetail.blackMana + 3 - 100, 0)
//   + Math.max(player.jobDetail.whiteMana + 14 - 100, 0) < rdmManaBreakpoint
//   && Math.min(player.jobDetail.blackMana + 3, player.jobDetail.whiteMana + 14)
//   >= 80
//   && checkStatus('verfireready') < rdmProcBufferTime + 5000) {
//     // Jolt > Veraero > Verflare combo
//     addIcon({ name: 'hardcast', img: 'jolt' });
//     addIcon({ name: 'dualcast', img: 'veraero' });
//   }
//
//   else if (player.level >= 70
//   && player.jobDetail.whiteMana < Math.min(player.jobDetail.blackMana + 11, 100)
//   && Math.max(player.jobDetail.blackMana + 11 - 100, 0) < rdmManaBreakpoint
//   && Math.min(player.jobDetail.whiteMana, player.jobDetail.blackMana + 11) >= 80
//   && checkStatus('verstoneready') < rdmProcBufferTime + 5000) {
//     // Swiftcast > Verthunder > Verholy combo
//     addIcon({ name: 'hardcast', img: 'swiftcast' });
//     addIcon({ name: 'dualcast', img: 'verthunder' });
//   }
//
//   else if (player.jobDetail.blackMana < Math.min(player.jobDetail.whiteMana + 11, 100)
//   && Math.max(player.jobDetail.whiteMana + 11 - 100, 0) < rdmManaBreakpoint
//   && Math.min(player.jobDetail.blackMana, player.jobDetail.whiteMana + 11) >= 80
//   && checkStatus('verfireready') < rdmProcBufferTime + 5000) {
//     // Swiftcast > Veraero > Verflare combo
//     addIcon({ name: 'hardcast', img: 'swiftcast' });
//     addIcon({ name: 'dualcast', img: 'veraero' });
//   } else if (Math.min(player.jobDetail.blackMana, player.jobDetail.whiteMana) >= 80) {
//     // Try for 20% proc
//     if (player.level >= 70
//     && player.jobDetail.whiteMana + 20 - player.jobDetail.blackMana <= 30
//     && checkStatus('verstoneready') < rdmProcBufferTime) {
//       rdmVerholyCombo(); // Verholy combo
//     } else if (player.jobDetail.blackMana + 20 - player.jobDetail.whiteMana <= 30
//     && checkStatus('verfireready') < rdmProcBufferTime) {
//       rdmVerflareCombo(); // Verflare combo
//     } else if (player.level >= 70
//     && player.jobDetail.blackMana >= player.jobDetail.whiteMana) {
//       rdmVerholyCombo(); // Verholy combo
//     } else {
//       rdmVerflareCombo(); // Verflare combo
//     }
//   } else {
//     rdmDualcast();
//   }
// };


function rdmComboTimeout() {
  clearTimeout(timeout.combo);
  timeout.combo = setTimeout(rdmNext, 12500);
}

// function rdmManafication() {
//
//   if (player.level >= 60
//   && checkRecast('manafication') < 0
//   && !toggle.combo) {
//
//    // Don't use Manafication if more than 28 away from 50/50
//     if (Math.abs(player.jobDetail.blackMana - 50) + Math.abs(player.jobDetail.whiteMana - 50)
// > 28) {
//       removeIcon('manafication');
//       delete toggle.manafication;
//     }
//
//     else if (count.targets >= 4
//     && Math.min(player.jobDetail.blackMana, player.jobDetail.whiteMana) >= 50) {
//       addIcon({ name: 'manafication' });
//       toggle.manafication = Date.now();
//     }
//
//     else if (count.targets >= 2
//     && Math.min(player.jobDetail.blackMana, player.jobDetail.whiteMana) >= 50) {
//       addIcon({ name: 'manafication' });
//       toggle.manafication = Date.now();
//     }
//
//    // Early Manafication if able to proc from Verholy
//     else if (player.level >= 70
//     && Math.min(player.jobDetail.blackMana, player.jobDetail.whiteMana) >= 40
//     && player.jobDetail.whiteMana < 50
//     && player.jobDetail.blackMana > player.jobDetail.whiteMana
//     && checkStatus('verstoneready') < 2500) {
//       addIcon({ name: 'manafication' });
//       toggle.manafication = Date.now();
//     }
//
//    // Early Manafication if able to proc from Verflare
//     else if (player.level >= 68
//     && Math.min(player.jobDetail.blackMana, player.jobDetail.whiteMana) >= 40
//     && player.jobDetail.blackMana < 50
//     && player.jobDetail.whiteMana > player.jobDetail.blackMana
//     && checkStatus('verfireready') < 2500) {
//       addIcon({ name: 'manafication' });
//       toggle.manafication = Date.now();
//     }
//
//    // Use if otherwise over 40/40
//     else if (player.level >= 60
//     && Math.min(player.jobDetail.blackMana, player.jobDetail.whiteMana) >= 40) {
//       addIcon({ name: 'manafication' });
//       toggle.manafication = Date.now();
//     }
//
//     else {
//      // Hide otherwise?
//       removeIcon('manafication');
//       delete toggle.manafication;
//     }
//   }
//   else {
//     removeIcon('manafication');
//     delete toggle.manafication;
//   }
// }

// Recast properties - list by alphabetical job then alphabetical action
function addRecast(name, time, id) {

  if (time === undefined) {
    time = recast[name];
  }
  if (id === undefined) {
    id = player.ID;
  }

  if (!recastTracker[name]) { // Create array if it doesn't exist yet
    recastTracker[name] = [id, time + Date.now()];
  }
  else if (recastTracker[name].indexOf(id) > -1) { // Update array if source match found
    recastTracker[name][recastTracker[name].indexOf(id) + 1] = time + Date.now();
  }
  else { // Push new entry into array if no matching entry
    recastTracker[name].push(id, time + Date.now());
  }
}

function checkRecast(name, id) {
  if (id === undefined) {
    id = player.ID;
  }
  if (recastTracker[name].indexOf(id) > -1) {
    return Math.max(recastTracker[name][recastTracker[name].indexOf(id) + 1] - Date.now(), -1);
  }
  return -1;
}

const recast = {};

// Role actions
recast.luciddreaming = 60000;
recast.peloton = 5000;
recast.rampart = 90000;
recast.swiftcast = 60000;

// BLM
recast.enochian = 30000;
recast.manafont = 180000;
recast.sharpcast = 60000;
recast.transpose = 5000;
recast.triplecast = 60000;

// BRD
recast.ballad = 80000;
recast.ragingstrikes = 80000;
recast.barrage = 80000;
recast.paeon = 80000;
recast.battlevoice = 180000;
recast.minuet = 80000;
recast.empyrealarrow = 15000;
recast.sidewinder = 60000;

// DNC
recast.technicalstep = 120000;
recast.standardstep = 30000;
recast.flourish = 60000;
recast.devilment = 120000;

// DRK
recast.abyssaldrain = 60000;
recast.bloodweapon = 60000;
recast.carveandspit = 60000;
recast.delirium = 90000;
recast.floodofdarkness = 2000;
recast.plunge = 30000;
recast.saltedearth = 90000;
recast.shadowwall = 120000;
recast.theblackestnight = 15000;

// DRG
recast.battlelitany = 180000;
recast.dragonsight = 120000;

// GNB
recast.gnashingfang = 30000;
recast.nomercy = 60000;
recast.roughdivide = 30000;
recast.sonicbreak = 60000;

// MCH
recast.barrelstabilizer = 120000;
recast.drill = 20000
// recast.bioblaster = recast.drill; // Use above due to shared cooldown
recast.flamethrower = 60000;
recast.gaussround = 30000;
recast.hypercharge = 10000;
recast.hotshot = 40000;
recast.airanchor = recast.hotshot;
recast.reassemble = 60000;
recast.ricochet = 30000;
recast.rookautoturret = 6000;
recast.automatonqueen = recast.rookautoturret;
recast.tactician = 180000;
recast.wildfire = 120000;

// MNK
recast.anatman = 60000;
recast.brotherhood = 90000;
recast.elixirfield = 30000;
recast.perfectbalance = 120000;
recast.riddleoffire = 90000;
recast.riddleofearth = 60000;

// NIN
recast.hide = 20000;
recast.mug = 110000;
recast.ninjutsu = 20000;
recast.trickattack = 60000;
recast.ninjutsu = 20000;
recast.kassatsu = 60000;
recast.dreamwithinadream = 60000;
recast.tenchijin = 100000;
recast.meisui = 60000;
recast.bunshin = 110000;

// RDM
recast.acceleration = 35000;
recast.contresixte = 45000;
recast.corpsacorps = 40000;
recast.displacement = 35000;
recast.embolden = 120000;
recast.fleche = 25000;
recast.manafication = 120000;

// SAM
recast.guren = 120000;
recast.ikishoten = 60000;
recast.meikyoshisui = 60000;
recast.senei = recast.guren;
recast.tsubamegaeshi = 60000;

// SCH
recast.aetherflow = 60000;
recast.chainstratagem = 120000;
recast.deploymenttactics = 120000;
recast.dissipation = 180000;
recast.excogitation = 45000;
recast.feyblessing = 60000;
recast.feyillumination = 120000;
recast.indomitability = 30000;
recast.recitation = 90000;
recast.sacredsoil = 30000;
recast.summonseraph = 120000;
recast.whisperingdawn = 60000;

// SMN
recast.devotion = 180000;

// WAR
recast.berserk = 90000;
recast.infuriate = 60000;
recast.rampart = 90000;
recast.rawintuition = 25000;
recast.upheaval = 30000;
recast.vengeance = 120000;
recast.innerrelease = recast.berserk;

// WHM
recast.assize = 45000;
recast.asylum = 90000;
recast.benediction = 180000;
recast.divinebenison = 30000;
recast.plenaryindulgence = 120000;
recast.presenceofmind = 150000;
recast.tetragrammaton = 60000;
recast.thinair = 120000;

// Raid
recast.raidbattlelitany = recast.battlelitany;
recast.raidbattlevoice = recast.battlevoice;
recast.raidbrotherhood = recast.brotherhood;
recast.raidchainstratagem = recast.chainstratagem;
recast.raiddevilment = recast.devilment;
recast.raiddevotion = recast.devotion;
recast.raidembolden = recast.embolden;
recast.raidtechnicalstep = recast.technicalstep;
recast.raidtrickattack = recast.trickattack;

"use strict";

actionList.sam = [
  "Higanbana", "Midare Setsugekka", "Kaeshi: Higanbana", "Kaeshi: Setsugekka",

  "Meikyo Shisui",
  "Hissatsu: Kaiten", "Hissatsu: Gyoten", "Hissatsu: Yaten", "Meditate", "Ikishoten",

  "Tenka Goken", "Hissatsu: Guren", "Kaeshi: Goken",

  "Hakaze", "Jinpu", "Shifu", "Gekko", "Kasha", "Yukikaze", "Hissatsu: Shinten", "Hissatsu: Senei",
  "Fuga", "Mangetsu", "Oka", "Hissatsu: Kyuten",

  "Enpi"
];

function samJobChange() {

  nextid.iaijutsu1 = 0;
  nextid.tsubamegaeshi1 = 1;
  nextid.hakaze = 2;
  nextid.fuga = nextid.hakaze;
  nextid.jinpu = 3;
  nextid.shifu = nextid.jinpu;
  nextid.iaijutsu2 = 4;
  nextid.tsubamegaeshi2 = 5;
  nextid.gekko = 6;
  nextid.kasha = nextid.gekko;
  nextid.yukikaze = nextid.gekko;
  nextid.mangetsu = nextid.gekko;
  nextid.oka = nextid.gekko;
  nextid.ikishoten = 10;
  nextid.meikyoshisui = 11;
  nextid.guren = 12;
  nextid.senei = nextid.guren;
  nextid.shinten = 13;
  nextid.kyuten = nextid.shinten;
  nextid.seigan = nextid.shinten;
  nextid.shoha = 14;

  previous.fuga = 0;
  previous.mangetsu = 0;
  previous.oka = 0;
  previous.tenkagoken = 0;
  previous.kaeshigoken = 0;
  previous.guren = 0;

  if (player.level >= 68
  && checkRecast("ikishoten") < 0) {
    addIcon({name: "ikishoten"});
  }

  samMeikyoShisui();
  samKenki();
  samSen();
}

function samAction() {

  if (actionList.sam.indexOf(actionLog.groups.actionName) > -1) {


    // These actions don't interrupt combos

    if (actionLog.groups.actionName == "Higanbana") {
      addStatus("higanbana", duration.higanbana, actionLog.groups.targetID);
      if (checkStatus("meikyoshisui", player.ID) > 0) {
        samCombo(); // Consuming Sen under Meikyo will trigger a new combo
      }
      icon.iaijutsu = "003159";
      removeIcon(id.iaijutsu1);
      removeIcon(id.iaijutsu2);
      timeout.tsubamegaeshi1 = setTimeout(removeIcon, 12500, id.tsubamegaeshi1);
      timeout.tsubamegaeshi2 = setTimeout(removeIcon, 12500, id.tsubamegaeshi2);
    }

    else if ("Tenka Goken" == actionLog.groups.actionName) {
      if (Date.now() - previous.tenkagoken > 1000) {
        previous.tenkagoken = Date.now();
        count.targets = 1;
      }
      else {
        count.targets = count.targets + 1;
      }
      if (checkStatus("meikyoshisui", player.ID) > 0) {
        samCombo(); // Consuming Sen under Meikyo will trigger a new combo
      }
      icon.iaijutsu = "003159";
      removeIcon(id.iaijutsu1);
      removeIcon(id.iaijutsu2);
      timeout.tsubamegaeshi1 = setTimeout(removeIcon, 12500, id.tsubamegaeshi1);
      timeout.tsubamegaeshi2 = setTimeout(removeIcon, 12500, id.tsubamegaeshi2);
    }

    else if ("Midare Setsugekka" == actionLog.groups.actionName) {
      if (checkStatus("meikyoshisui", player.ID) > 0) {
        samCombo(); // Consuming Sen under Meikyo will trigger a new combo
      }
      icon.iaijutsu = "003159";
      removeIcon(id.iaijutsu1);
      removeIcon(id.iaijutsu2);
      timeout.tsubamegaeshi1 = setTimeout(removeIcon, 12500, id.tsubamegaeshi1);
      timeout.tsubamegaeshi2 = setTimeout(removeIcon, 12500, id.tsubamegaeshi2);
    }

    else if (["Kaeshi: Higanbana", "Kaeshi: Goken", "Kaeshi: Setsugekka"].indexOf(actionLog.groups.actionName) > -1) {
      addRecast("tsubamegaeshi");
      icon.tsubamegaeshi = "003180";
      clearTimeout(timeout.tsubamegaeshi);
      removeIcon(id.tsubamegaeshi1);
      removeIcon(id.tsubamegaeshi2);
    }

    else if (actionLog.groups.actionName == "Meikyo Shisui") {
      addRecast("meikyoshisui");
      addStatus("meikyoshisui");
      removeIcon(id.meikyoshisui);
      samCombo(); // Clears combo and activates next Sen generating move
    }

    else if (actionLog.groups.actionName == "Hissatsu: Kaiten") {
      addStatus("kaiten");
      samKenki();
    }

    else if (actionLog.groups.actionName == "Hissatsu: Shinten") {
      removeIcon(id.shinten);
      samKenki();
    }

    else if (actionLog.groups.actionName == "Hissatsu: Kyuten") {
      removeIcon(id.kyuten);
      samKenki();
    }

    else if (actionLog.groups.actionName == "Hissatsu: Seigan") {
      removeIcon(id.seigan);
      samKenki();
    }

    else if (actionLog.groups.actionName == "Ikishoten") {
      addRecast("ikishoten");
      removeIcon(id.ikishoten);
      addIconBlinkTimeout("ikishoten", recast.ikishoten, id.ikishoten, icon.ikishoten);
      samKenki();
    }

    else if (actionLog.groups.actionName == "Hissatsu: Guren" || actionLog.groups.actionName == "Hissatsu: Senei") {
      if (Date.now() - previous.guren > 1000) {
        previous.guren = Date.now();
        count.targets = 1;
      }
      else {
        count.targets = count.targets + 1;
      }
      // Senei is on same cooldown as Guren
      addRecast("guren");
      removeIcon(id.guren);
      samKenki();
    }

    // Trigger combos

    else if (["Fuga", "Mangetsu", "Oka"].indexOf(actionLog.groups.actionName) > -1
    && actionLog.groups.targetName == "") {
      // Spinnin' around in town
      // No targets hit
      samCombo();
    }

    else if (actionLog.groups.actionName == "Hakaze"
    && actionLog.groups.result.length >= 2) {
      if ([1,2,3].indexOf(toggle.combo) == -1) {
        samCombo();
      }
      removeIcon(id.hakaze);
      samKenki();
    }

    else if (actionLog.groups.actionName == "Fuga"
    && actionLog.groups.result.length >= 2
    && [4,5].indexOf(toggle.combo) > -1) {
      if (Date.now() - previous.fuga > 1000) {
        previous.fuga = Date.now();
        count.targets = 1;
      }
      else {
        count.targets = count.targets + 1;
      }
      removeIcon(id.fuga);
      samKenki();
    }

    else if (actionLog.groups.actionName == "Jinpu"
    && actionLog.groups.result.length >= 8) {
      addStatus("jinpu");
      if (player.level < 30) {
        samCombo();
      }
      else {
        removeIcon(id.hakaze);
        removeIcon(id.jinpu);
        addIcon(id.gekko,icon.gekko);
      }
      samKenki();
    }

    else if (actionLog.groups.actionName == "Shifu"
    && actionLog.groups.result.length >= 8) {
      addStatus("shifu");
      if (player.level < 40) {
        samCombo();
      }
      else {
        removeIcon(id.hakaze);
        removeIcon(id.shifu);
        addIcon(id.kasha,icon.kasha);
      }
      samKenki();
    }

    else if (actionLog.groups.actionName == "Mangetsu"
    && actionLog.groups.result.length >= 8) {
      if (Date.now() - previous.mangetsu > 1000) {
        previous.mangetsu = Date.now();
        count.targets = 1;
        if (checkStatus("jinpu", player.ID) > 0) {
          addStatus("jinpu", Math.min(checkStatus("jinpu", player.ID) + 15000, duration.jinpu));
        }
      }
      else {
        count.targets = count.targets + 1;
      }
      samKenki();
      samSen();
      samCombo();
    }

    else if (actionLog.groups.actionName == "Oka"
    && actionLog.groups.result.length >= 8) {
      if (Date.now() - previous.oka > 1000) {
        previous.oka = Date.now();
        count.targets = 1;
        if (checkStatus("shifu", player.ID) > 0) {
          addStatus("shifu", Math.min(checkStatus("shifu", player.ID) + 15000, duration.shifu));
        }
      }
      else {
        count.targets = count.targets + 1;
      }
      samKenki();
      samSen();
      samCombo();
    }

    else if (["Gekko", "Kasha", "Yukikaze"].indexOf(actionLog.groups.actionName) > -1
    && actionLog.groups.result.length >= 8) {
      samKenki();
      samSen();
      samCombo();
    }

    else { // Everything else finishes or breaks combo
      samKenki();
      samCombo();
    }

    samMeikyoShisui();

    // Clear Tsubame-gaeshi

    if (icon.iaijutsu == "003159" // Set to this after Iaijutsu is inactive
    && ["Hakaze", "Jinpu", "Shifu", "Gekko", "Kasha", "Yukikaze",
        "Fuga", "Mangetsu", "Oka",
        "Enpi"].indexOf(actionLog.groups.actionName) > -1) {
      icon.tsubamegaeshi = "003180";
      removeIcon(id.tsubamegaeshi1);
      removeIcon(id.tsubamegaeshi2);
    }
  }
}

function samStatus() {

  // To anyone from anyone (non-stacking)

  if (effectLog.groups.effectName == "Slashing Resistance Down") {
    if (effectLog.groups.gainsLoses == "gains") {
    }
    else if (effectLog.groups.gainsLoses == "loses") {
    }
  }

  // To player from anyone

  else if (effectLog.groups.targetID == player.ID) {

    if (effectLog.groups.effectName == "Jinpu") {
      if (effectLog.groups.gainsLoses == "gains") {
        addStatus("jinpu", parseInt(effectLog.groups.effectDuration) * 1000, effectLog.groups.targetID);
      }
      else if (effectLog.groups.gainsLoses == "loses") {
        removeStatus("jinpu", effectLog.groups.targetID);
      }
    }

    else if (effectLog.groups.effectName == "Open Eyes") {
      if (effectLog.groups.gainsLoses == "gains") {
        addStatus("openeyes", parseInt(effectLog.groups.effectDuration) * 1000, effectLog.groups.targetID);
      }
      else if (effectLog.groups.gainsLoses == "loses") {
        removeStatus("openeyes", effectLog.groups.targetID);
      }
    }

    else if (effectLog.groups.effectName == "Shifu") {
      if (effectLog.groups.gainsLoses == "gains") {
        addStatus("shifu", parseInt(effectLog.groups.effectDuration) * 1000, effectLog.groups.targetID);
      }
      else if (effectLog.groups.gainsLoses == "loses") {
        removeStatus("shifu", effectLog.groups.targetID);
      }
    }

    else if (effectLog.groups.effectName == "Meikyo Shisui") {
      if (effectLog.groups.gainsLoses == "gains") {
        addStatus("meikyoshisui", parseInt(effectLog.groups.effectDuration) * 1000, effectLog.groups.targetID);
      }
      else if (effectLog.groups.gainsLoses == "loses") {
        removeStatus("meikyoshisui", effectLog.groups.targetID);
        samCombo();
      }
    }

    else if (effectLog.groups.effectName == "Hissatsu: Kaiten") {
      if (effectLog.groups.gainsLoses == "gains") {
        addStatus("kaiten", parseInt(effectLog.groups.effectDuration) * 1000, effectLog.groups.targetID);
      }
      else if (effectLog.groups.gainsLoses == "loses") {
        removeStatus("kaiten", effectLog.groups.targetID);
      }
    }

    else if (effectLog.groups.effectName == "Meditate") {
      if (effectLog.groups.gainsLoses == "gains") {
        addStatus("meditate", parseInt(effectLog.groups.effectDuration) * 1000, effectLog.groups.targetID);
      }
      else if (effectLog.groups.gainsLoses == "loses") {
        removeStatus("meditate", effectLog.groups.targetID);
        samKenki();
      }
    }
  }

  // To NOT player from player

  else if (effectLog.groups.sourceName == player.name) {

    if (effectLog.groups.effectName == "Higanbana") {
      if (effectLog.groups.gainsLoses == "gains") {
        addStatus("higanbana", parseInt(effectLog.groups.effectDuration) * 1000, effectLog.groups.targetID);
      }
      else if (effectLog.groups.gainsLoses == "loses") {
        removeStatus("higanbana", effectLog.groups.targetID);
      }
    }
  }
}

function samMeikyoShisui() {

  // if (player.level >= 76
  // && checkRecast("tsubamegaeshi") > 2500) {
  //   // Attempt to save Meikyo to quickly activate Tsubame-gaeshi
  //   removeIcon("meikyoshisui");
  // }
  // else

  // Set to use on cooldown for now

  if (player.level >= 50
  && checkRecast("meikyoshisui") < 0) {
    addIcon({name: "meikyoshisui"});
  }
  else {
    removeIcon("meikyoshisui");
  }
}

function samSen() {

  removeIcon("iaijutsu1");
  removeIcon("iaijutsu2");

  removeIcon("tsubamegaeshi1");
  removeIcon("tsubamegaeshi2");

  // Choose Iaijutsu icon
  if (player.jobDetail.getsu + player.jobDetail.ka + player.jobDetail.setsu == 1
  && checkStatus("higanbana", target.ID) < 15000) {
    icon.iaijutsu = icon.higanbana;
  }
  else if (player.jobDetail.getsu + player.jobDetail.ka + player.jobDetail.setsu == 2) {
    icon.iaijutsu = icon.tenkagoken;
  }
  else if (player.jobDetail.getsu + player.jobDetail.ka + player.jobDetail.setsu == 3) {
    icon.iaijutsu = icon.midaresetsugekka;
  }
  else {
    icon.iaijutsu = "003159";
  }

  // Choose Tsubame-gaeshi icon
  if (player.level >= 74
  && checkRecast("tsubamegaeshi") < 5000
  && icon.iaijutsu == icon.tenkagoken
  && check.aoe >= 3) {
    icon.tsubamegaeshi = icon.kaeshigoken;
  }
  else if (player.level >= 74
  && checkRecast("tsubamegaeshi") < 5000
  && icon.iaijutsu == icon.midaresetsugekka) {
    icon.tsubamegaeshi = icon.kaeshisetsugekka;
  }
  else {
    icon.tsubamegaeshi = "003180";
  }

  // Place Iaijutsu in combo
  if (checkStatus("jinpu", player.ID) < 5000
  && toggle.combo == 1) {
    // Delay Iaijutsu for upcoming Jinpu buff
    if (icon.iaijutsu != "003159") {
      addIconBlink(nextid.iaijutsu2,icon.iaijutsu);
    }
    if (icon.tsubamegaeshi != "003180") {
      addIconBlink(nextid.tsubamegaeshi2,icon.tsubamegaeshi);
    }
  }
  else if (checkStatus("kaiten", player.ID) < 0
  && player.jobDetail.kenki < 20) {
    // Delay Iaijutsu to try for more Kenki
    if (icon.iaijutsu != "003159") {
      addIconBlink(nextid.iaijutsu2,icon.iaijutsu);
    }
    if (icon.tsubamegaeshi != "003180") {
      addIconBlink(nextid.tsubamegaeshi2,icon.tsubamegaeshi);
    }
  }
  else {
    if (icon.iaijutsu != "003159") {
      addIconBlink(nextid.iaijutsu1,icon.iaijutsu);
    }
    if (icon.tsubamegaeshi != "003180") {
      addIconBlink(nextid.tsubamegaeshi1,icon.tsubamegaeshi);
    }
  }
}

function samKenki() {

  // Set icons according to level/toggle/status

  // Shinten/Kyuten
  if (player.level >= 64
  && toggle.aoe) {
    icon.shinten = icon.kyuten;
  }
  else {
    icon.shinten = "003173";
  }

  if (player.level >= 72
  && !toggle.aoe) {
    icon.guren = icon.senei;
  }
  else {
    icon.guren = "003177";
  }

  // Set Kenki target

  let minimumkenki = 20;

  if (player.level >= 70
  && checkRecast("ikishoten") > checkRecast("guren")
  && checkRecast("guren") < 20000) {
    minimumkenki = 70;
  }

  // Show Guren/Senei
  if (player.level >= 70
  && checkRecast("ikishoten") > checkRecast("guren") + 5000
  && checkRecast("guren") < 1000
  && player.jobDetail.kenki >= 70) {
    addIcon({name: "guren"});
  }
  else {
    removeIcon("guren");
  }

  // Show Shinten/Kyuten/Seigan
  if (player.level >= 66
  && player.jobDetail.kenki >= minimumkenki + 15
  && checkStatus("openeyes", player.ID) > 5000
  && !toggle.aoe) {
    addIcon({name: "seigan"});
  }
  else if (player.level >= 62
  && player.jobDetail.kenki >= minimumkenki + 25) {
    addIcon({name: "shinten"});
  }
  else {
    removeIcon("shinten");
  }

}

function samCombo() {

  delete toggle.combo;

  // Reset icons
  removeIcon("hakaze");
  removeIcon("jinpu");
  removeIcon("gekko");

  if (toggle.aoe) { // AoE

    if (checkStatus("meikyoshisui", player.ID) > 0) {

      if (player.jobDetail.ka == false
      && checkStatus("shifu", player.ID) < checkStatus("jinpu", player.ID)) {
        addIcon({name: "oka"});
      }
      else if (player.jobDetail.getsu == false
      && checkStatus("jinpu", player.ID) < checkStatus("shifu", player.ID)) {
        addIcon({name: "mangetsu"});
      }

      else if (player.jobDetail.getsu == false) {
        addIcon({name: "mangetsu"});
      }
      else if (player.jobDetail.ka == false) {
        addIcon({name: "oka"});
      }

      else {
        addIcon({name: "mangetsu"});
      }
    }

    else {

      if (player.level >= 45
      && player.jobDetail.ka == false
      && checkStatus("shifu", player.ID) < checkStatus("jinpu", player.ID)) {
        okaCombo();
      }
      else if (player.level >= 35
      && player.jobDetail.getsu == false
      && checkStatus("jinpu", player.ID) < checkStatus("shifu", player.ID)) {
        mangetsuCombo();
      }

      else if (player.level >= 35
      && player.jobDetail.getsu == false) {
        mangetsuCombo();
      }
      else if (player.level >= 45
      && player.jobDetail.ka == false) {
        okaCombo();
      }
    }
  }

  else {

    if (checkStatus("meikyoshisui", player.ID) > 0) {

      if (player.jobDetail.getsu == false) {
        addIcon({name: "gekko"});
      }
      else if (player.jobDetail.ka == false) {
        addIcon({name: "kasha"});
      }
      else if (player.jobDetail.setsu == false) {
        addIcon({name: "yukikaze"});
      }
    }

    else {

      if (player.level >= 18
      && player.jobDetail.ka == false
      && checkStatus("shifu", player.ID) < checkStatus("jinpu", player.ID)) {
        kashaCombo();
      }
      else if (player.level >= 4
      && player.jobDetail.getsu == false
      && checkStatus("jinpu", player.ID) < checkStatus("shifu", player.ID)) {
        gekkoCombo();
      }

      else if (player.level >= 30
      && player.jobDetail.getsu == false) {
        gekkoCombo();
      }
      else if (player.level >= 40
      && player.jobDetail.ka == false) {
        kashaCombo();
      }
      else if (player.level >= 50
      && player.jobDetail.setsu == false) {
        yukikazeCombo();
      }

      else {
        gekkoCombo();
      }
    }
  }

  clearTimeout(timeout.combo);
  timeout.combo = setTimeout(samComboTimeout, 12500);
}

function samComboTimeout() {
  if (toggle.combat) {
    samCombo();
  }
}

function gekkoCombo() {
  toggle.combo = 1;
  addIcon({name: "hakaze"});
  addIcon({name: "jinpu"});
  if (player.level >= 30) {
    addIcon({name: "gekko"});
  }
}

function kashaCombo() {
  toggle.combo = 2;
  addIcon({name: "hakaze"});
  addIcon({name: "shifu"});
  if (player.level >= 40) {
    addIcon({name: "kasha"});
  }
}

function yukikazeCombo() {
  toggle.combo = 3;
  addIcon({name: "hakaze"});
  removeIcon("jinpu");
  addIcon({name: "yukikaze"});
}

function mangetsuCombo() {
  toggle.combo = 4;
  addIcon({name: "fuga"});
  removeIcon("jinpu");
  addIcon({name: "mangetsu"});
}

function okaCombo() {
  toggle.combo = 5;
  addIcon({name: "fuga"});
  removeIcon("jinpu");
  addIcon({name: "oka"});
}

"use strict";

actionList.sch = [

  // Off-GCD
  "Aetherflow",
  "Sacred Soil",
  "Indomitability",
  "Excogitation",
  "Deployment Tactics",
  "Chain Stratagem",
  "Recitation",
  "Swiftcast",
  "Lucid Dreaming",

  // Pet
  "Dissipation",
  "Whispering Dawn",
  "Fey Illumination",
  "Fey Blessing",
  "Summon Seraph",

  // GCD
  "Bio", "Bio II", "Biolysis"
];

function schJobChange() {

  nextid.bio = 0;
  nextid.aetherflow = 10;
  nextid.chainstratagem = 11;

  // Column 1
  countdownid.bio = 0;
  countdownid.aetherflow = 1;
  countdownid.excogitation = 2;
  countdownid.indomitability = 3;
  countdownid.sacredsoil = 4;
  countdownid.recitation = 5;
  countdownid.deploymenttactics = 6;
  countdownid.swiftcast = 8;
  countdownid.luciddreaming = 9;


  // Column 2
  countdownid.dissipation = 10;
  countdownid.summonseraph = 11;
  countdownid.whisperingdawn = 12;
  countdownid.feyblessing = 13;
  countdownid.feyillumination = 14;
  countdownid.chainstratagem = 19;

  previous.artofwar = 0;

  if (player.level >= 72) {
    icon.bio = icon.biolysis;
  }
  else if (player.level >= 26) {
    icon.bio = icon.bio2;
  }
  else {
    icon.bio = "000503";
  }

  // Show available cooldowns

  if (player.level >= 20) {
    addCountdownBar({name: "whisperingdawn", time: -1});
  }

  if (player.level >= 40) {
    addCountdownBar({name: "feyillumination", time: -1});
  }

  if (player.level >= 45) {
    addCountdownBar({name: "aetherflow", time: -1, oncomplete: "addIcon"});
  }

  if (player.level >= 50) {
    addCountdownBar({name: "sacredsoil", time: -1});
  }

  if (player.level >= 52) {
    addCountdownBar({name: "indomitability", time: -1});
  }

  if (player.level >= 56) {
    addCountdownBar({name: "deploymenttactics", time: -1});
  }

  if (player.level >= 60) {
    addCountdownBar({name: "dissipation", time: -1});
  }

  if (player.level >= 62) {
    addCountdownBar({name: "excogitation", time: -1});
  }

  if (player.level >= 66) {
    addCountdownBar({name: "chainstratagem", time: checkRecast("chainstratagem"), oncomplete: "addIcon"});
  }

  if (player.level >= 74) {
    addCountdownBar({name: "recitation", time: -1});
  }

  if (player.level >= 76) {
    addCountdownBar({name: "feyblessing", time: -1});
  }

  if (player.level >= 80) {
    addCountdownBar({name: "summonseraph", time: -1});
  }
}

// Copied from BRD mostly...
function schTargetChangedEvent() {
  if (previous.targetID != target.ID) {

    // If not a target then clear things out
    if (target.ID == 0 || target.ID.startsWith("1") || target.ID.startsWith("E")) {  // 0 = no target, 1... = player? E... = non-combat NPC?
      removeCountdownBar("bio");
    }
    else {
      addCountdownBar({name: "bio", time: checkStatus("bio", target.ID), oncomplete: "addIcon"});
    }
    previous.targetID = target.ID;
  }
}


function schAction() {

  // Set up icon changes from combat here

  if (actionList.sch.indexOf(actionLog.groups.actionName) > -1) {

    if (["Bio", "Bio II", "Biolysis"].indexOf(actionLog.groups.actionName) > -1) {
      removeIcon("bio");
      addStatus("bio", 30000, actionLog.groups.targetID);
    }

    else if ("Whispering Dawn" == actionLog.groups.actionName) {
      addCountdownBar({name: "whisperingdawn"});
    }

    else if ("Fey Illumination" == actionLog.groups.actionName) {
      addCountdownBar({name: "feyillumination"});
    }

    else if ("Aetherflow" == actionLog.groups.actionName) {
      removeIcon("aetherflow");
      addCountdownBar({name: "aetherflow", time: recast.aetherflow, oncomplete: "addIcon"});
    }

    else if ("Sacred Soil" == actionLog.groups.actionName) {
      addCountdownBar({name: "sacredsoil"});
    }

    else if ("Indomitability" == actionLog.groups.actionName) {
      addCountdownBar({name: "indomitability"});
    }

    else if ("Excogitation" == actionLog.groups.actionName) {
      addCountdownBar({name: "excogitation"});
    }

    else if ("Deployment Tactics" == actionLog.groups.actionName) {
      addCountdownBar({name: "deploymenttactics"});
    }

    else if ("Dissipation" == actionLog.groups.actionName) {
      addCountdownBar({name: "dissipation"});
    }

    else if ("Chain Stratagem" == actionLog.groups.actionName) {
      addCountdownBar({name: "chainstratagem", time: recast.chainstratagem, oncomplete: "addIcon"});
    }

    else if ("Recitation" == actionLog.groups.actionName) {
      addCountdownBar({name: "recitation"});
    }

    else if ("Summon Seraph" == actionLog.groups.actionName) {
      addCountdownBar({name: "summonseraph"});
    }
  }
}

function schStatus() {

  if (["Bio", "Bio II", "Biolysis"].indexOf(effectLog.groups.effectName) > -1) {
    if (effectLog.groups.gainsLoses == "gains") {
      addStatus("bio", parseInt(effectLog.groups.effectDuration) * 1000, effectLog.groups.targetID);
      if (target.ID == effectLog.groups.targetID) {  // Might be possible to switch targets between application to target and log entry
        addCountdownBar({name: "bio", time: checkStatus("bio", target.ID), oncomplete: "addIcon"});
      }
    }
    else if (effectLog.groups.gainsLoses == "loses") {
      removeStatus("bio", effectLog.groups.targetID);
    }
  }
}


function addStatus(name, time, id) {

  if (time === undefined) {
    time = duration[name];
  }
  if (id == undefined) {
    id = player.ID;
  }

  if (!statusTracker[name]) { // Create array if it doesn't exist yet
    statusTracker[name] = [id, Date.now() + time];
  }
  else if (statusTracker[name].indexOf(id) > -1) { // Update array if target match found
    statusTracker[name][statusTracker[name].indexOf(id) + 1] = Date.now() + time;
  }
  else { // Push new entry into array if no matching entry
    statusTracker[name].push(id, Date.now() + time);
  }
}

function checkStatus(name, id) {

  if (id === undefined) {
    id = player.ID;
  }

  if (!statusTracker[name]) {
    return -1;
  } else if (statusTracker[name].indexOf(id) > -1) {
    return Math.max(statusTracker[name][statusTracker[name].indexOf(id) + 1] - Date.now(), -1);
  }
}

function removeStatus(name, id) {

  if (id === undefined) {
    id = player.ID;
  }

  if (!statusTracker[name]) {
    statusTracker[name] = [];
  }
  else if (statusTracker[name].indexOf(id) > -1) {
    statusTracker[name].splice(statusTracker[name].indexOf(id), 2);
  }
}

"use strict";

// Define actions to watch for

actionList.war = [

  // Role actions
  "Rampart", "Arm\'s Length",

  // AoE actions
  "Overpower", "Mythril Tempest", "Steel Cyclone", "Decimate",

  // Single target actions
  "Storm\'s Path", "Fell Cleave", "Inner Chaos",

  // AoE or single target depending on level
  "Inner Beast", "Chaotic Cyclone",

  // Everything else
  "Heavy Swing", "Maim", "Storm\'s Eye", "Tomahawk",
  "Berserk", "Thrill Of Battle", "Vengeance", "Holmgang", "Infuriate", "Raw Intuition", "Upheaval", "Inner Release", "Nascent Flash"

];

// Don't need to check these actions... yet?
// "Onslaught", "Equilibrium", "Shake It Off",
// "Low Blow", "Provoke", "Interject", "Reprisal", "Shirk",

function warJobChange() {

  nextid.mitigation = 0;
  nextid.vengeance = nextid.mitigation;
  nextid.rawintuition = nextid.mitigation;
  nextid.rampart = nextid.mitigation;
  nextid.innerbeast = 1;
  nextid.steelcyclone = nextid.innerbeast;
  nextid.fellcleave = nextid.innerbeast;
  nextid.decimate = nextid.innerbeast;
  nextid.chaoticcyclone = nextid.innerbeast;
  nextid.innerchaos = nextid.innerbeast;
  nextid.heavyswing = 2;
  nextid.overpower = nextid.heavyswing;
  nextid.maim = 3;
  nextid.stormspath = 4;
  nextid.stormseye = nextid.stormspath;
  nextid.mythriltempest = nextid.stormspath;
  nextid.infuriate = 10;
  nextid.berserk = 11;
  nextid.innerrelease = nextid.berserk;
  nextid.upheaval = nextid.berserk;

  previous.overpower = 0;
  previous.mythriltempest = 0;
  previous.steelcyclone = 0;

  if (player.level >= 54) {
    icon.innerbeast = icon.fellcleave;
  }
  else {
    icon.innerbeast = "002553";
  }

  if (player.level >= 60) {
    icon.steelcyclone = icon.decimate;
  }
  else {
    icon.steelcyclone = "002552";
  }

  if (player.level >= 70) {
    icon.berserk = icon.innerrelease;
  }
  else {
    icon.berserk = "000259";
  }

  if (count.targets > 1) {
    if (player.level >= 56
    && checkRecast("rawintuition") < 0) {
      addIcon({name: "rawintuition"});
    }
    else if (player.level >= 8
    && checkRecast("rampart") < 0) {
      addIcon({name: "rampart"});
    }
    else if (player.level >= 46
    && checkRecast("vengeance") < 0) {
      addIcon({name: "vengeance"});
    }
  }

  if (player.level >= 50
  && checkRecast("infuriate1", player.ID) < 0) {
    addIcon({name: "infuriate"});
  }

  // Berserk is complicated
  if (player.level >= 64
  && checkRecast("upheaval") < 0
  && checkRecast("berserk") > 25000 ) {
    addIcon({name: "upheaval"}); // Show Upheaval if Berserk is far away
  }
  else if (player.level >= 74
  && checkRecast("infuriate1", player.ID) < 0) {
    removeIcon("berserk"); // Hide Berserk to prevent wasting Nascent Chaos
  }
  else if (player.level >= 6
  && checkRecast("berserk") < 0) {
    addIcon({name: "berserk"});
  }

  warCombo();
  warGauge();
}

function warAction() {

  if (actionList.war.indexOf(actionLog.groups.actionName) > -1) {


    // These actions don't break combo

    if (["Berserk", "Inner Release"].indexOf(actionLog.groups.actionName) > -1) {
      removeIcon("berserk");
      addStatus("berserk", duration.berserk, actionLog.groups.targetID);
      addRecast("berserk");
      addIconBlinkTimeout("berserk",recast.berserk,nextid.berserk,icon.berserk);
      if (player.level >= 70) {
        warGauge(); // Triggers gauge stuff for Inner Release
      }
    }

    else if ("Upheaval" == actionLog.groups.actionName) {
      removeIcon("upheaval");
      addRecast("upheaval");
      warGauge();
    }

    else if ("Infuriate" == actionLog.groups.actionName) { // Code treats Infuriate like two different skills to juggle the charges.
      if (checkRecast("infuriate2", player.ID) < 0) {
        addRecast("infuriate1", player.ID, -1);
        addRecast("infuriate2", player.ID, recast.infuriate);
      }
      else {
        removeIcon("infuriate");
        addRecast("infuriate1", player.ID, checkRecast("infuriate2", player.ID));
        addRecast("infuriate2", player.ID, checkRecast("infuriate2", player.ID) + recast.infuriate);
        addIconBlinkTimeout("infuriate", checkRecast("infuriate1", player.ID), nextid.infuriate, icon.infuriate);
      }
      warGauge();
    }

    else if ("Raw Intuition" == actionLog.groups.actionName) {
      addRecast("rawintuition");
      removeIcon("rawintuition");
    }

    else if ("Rampart" == actionLog.groups.actionName) {
      addRecast("rampart");
      removeIcon("rampart");
    }

    else if ("Vengeance" == actionLog.groups.actionName) {
      addRecast("vengeance");
      removeIcon("vengeance");
    }

    else { // GCD actions

      if (["Inner Beast", "Fell Cleave", "Inner Chaos"].indexOf(actionLog.groups.actionName) > -1) {
        if (player.level >= 45
        && player.level < 54) {
          count.targets = 1; // Steel Cyclone is stronger than Inner Beast at 2+ targets
        }
        if (player.level >= 66) { // Enhanced Infuriate
          addRecast("infuriate1", player.ID, checkRecast("infuriate1", player.ID) - 5000);
          addRecast("infuriate2", player.ID, checkRecast("infuriate2", player.ID) - 5000);
          removeIcon("infuriate");
          addIconBlinkTimeout("infuriate",checkRecast("infuriate1", player.ID),nextid.infuriate,icon.infuriate);
        }
        removeIcon("innerbeast");
      }

      else if (["Steel Cyclone", "Decimate", "Chaotic Cyclone"].indexOf(actionLog.groups.actionName) > -1) {
        if (Date.now() - previous.steelcyclone > 1000) {
          count.targets = 1;
          previous.steelcyclone = Date.now();
          if (player.level >= 66) { // Enhanced Infuriate
            addRecast("infuriate1", player.ID, checkRecast("infuriate1", player.ID) - 5000);
            addRecast("infuriate2", player.ID, checkRecast("infuriate2", player.ID) - 5000);
            removeIcon("infuriate");
            addIconBlinkTimeout("infuriate",checkRecast("infuriate1", player.ID),nextid.infuriate,icon.infuriate);
          }
        }
        else {
          count.targets = count.targets + 1;
        }
        removeIcon("innerbeast");
      }

      // These actions affect combo

      else if ("Heavy Swing" == actionLog.groups.actionName
      && actionLog.groups.result.length >= 2) {
        count.targets = 1;
        if ([1, 2].indexOf(next.combo) == -1) {
          warCombo();
          toggle.combo = Date.now();
        }
        removeIcon("heavyswing");
        if (player.level >= 4) {
          warComboTimeout();
        }
        else {
          warCombo();
        }
      }

      else if ("Maim" == actionLog.groups.actionName
      && actionLog.groups.result.length >= 8) {
        removeIcon("heavyswing");
        removeIcon("maim");
        if (player.level >= 26) {
          warComboTimeout();
        }
        else {
          warCombo();
        }
      }

      else if ("Storm's Path" == actionLog.groups.actionName
      && actionLog.groups.result.length >= 8) {
        warCombo();
      }

      else if ("Storm's Eye" == actionLog.groups.actionName
      && actionLog.groups.result.length >= 8) {
        addStatus("stormseye");
        warCombo();
      }

      else if ("Overpower" == actionLog.groups.actionName
      && actionLog.groups.result.length >= 2) {
        if (Date.now() - previous.overpower > 1000) {
          previous.overpower = Date.now();
          count.targets = 1;
        }
        else {
          count.targets = count.targets + 1;
        }
        if (next.combo != 3) {
          warCombo();
          toggle.combo = Date.now();
        }
        removeIcon("overpower");
        if (player.level >= 40) {
          warComboTimeout();
        }
        else {
          warCombo();
        }
      }

      else if ("Mythril Tempest" == actionLog.groups.actionName
      && actionLog.groups.result.length >= 8) {

        if (Date.now() - previous.mythriltempest > 1000) {
          previous.mythriltempest = Date.now();
          count.targets = 1;
          if (checkStatus("stormseye", player.ID) > 0) {
            addStatus("stormseye", Math.min(checkStatus("stormseye", player.ID) + 10000, duration.stormseye));
          }
        }
        else {
          count.targets = count.targets + 1;
        }
        warCombo();
      }

      else {
        warCombo();
      }

      if (count.targets >= 3
      && checkStatus("mitigation", effectLog.groups.targetID) < 1000) {
        warMitigation();
      }
      else {
        removeIcon("rampart");
      }

      warGauge(); // Check gauge after all GCD actions
    }
  }
}

function warStatus() {

  if (effectLog.groups.targetID == player.ID) { // Target is self

    if (["Berserk", "Inner Release"].indexOf(effectLog.groups.effectName) > -1) {
      if (effectLog.groups.gainsLoses == "gains") {
        addStatus("berserk", parseInt(effectLog.groups.effectDuration) * 1000, effectLog.groups.targetID);
        if (checkRecast("upheaval") < parseInt(effectLog.groups.effectDuration) * 1000) {
          addIconBlinkTimeout("upheaval", checkRecast("upheaval"), nextid.upheaval, icon.upheaval); // Show Upheaval if up during Berserk
        }
      }
      else if (effectLog.groups.gainsLoses == "loses") {
        removeStatus("berserk", effectLog.groups.targetID);
      }

      if ("Inner Release" == effectLog.groups.effectName) {
        warGauge();
      }
    }


    else if ("Storm's Eye" == effectLog.groups.effectName) {
      if (effectLog.groups.gainsLoses == "gains") {
        addStatus("stormseye", parseInt(effectLog.groups.effectDuration) * 1000, effectLog.groups.targetID);
      }
      else if (effectLog.groups.gainsLoses == "loses") {
        removeStatus("stormseye", effectLog.groups.targetID);
      }
    }

    else if ("Raw Intuition" == effectLog.groups.effectName) {
      if (effectLog.groups.gainsLoses == "gains") {
        if (checkStatus("mitigation", effectLog.groups.targetID) < parseInt(effectLog.groups.effectDuration) * 1000) {
          addStatus("mitigation", parseInt(effectLog.groups.effectDuration) * 1000, effectLog.groups.targetID);
        }
      }
      else if (effectLog.groups.gainsLoses == "loses") {
        if (checkStatus("mitigation", effectLog.groups.targetID) < 0
        && count.targets >= 3) {
          warMitigation();
        }
      }
    }

    else if ("Rampart" == effectLog.groups.effectName) {
      if (effectLog.groups.gainsLoses == "gains") {
        if (checkStatus("mitigation", effectLog.groups.targetID) < parseInt(effectLog.groups.effectDuration) * 1000) {
          addStatus("mitigation", parseInt(effectLog.groups.effectDuration) * 1000, effectLog.groups.targetID);
        }
      }
      else if (effectLog.groups.gainsLoses == "loses") {
        if (checkStatus("mitigation", effectLog.groups.targetID) < 0 // Check for overlaps
        && count.targets >= 3) {
          warMitigation();
        }
      }
    }

    else if ("Vengeance" == effectLog.groups.effectName) {
      if (effectLog.groups.gainsLoses == "gains") {
        if (checkStatus("mitigation", effectLog.groups.targetID) < parseInt(effectLog.groups.effectDuration) * 1000) {
          addStatus("mitigation", parseInt(effectLog.groups.effectDuration) * 1000, effectLog.groups.targetID);
        }
      }
      else if (effectLog.groups.gainsLoses == "loses") {
        if (checkStatus("mitigation", effectLog.groups.targetID) < 0
        && count.targets >= 3) {
          warMitigation();
        }
      }
    }

    else if ("Nascent Chaos" == effectLog.groups.effectName) {
      if (effectLog.groups.gainsLoses == "gains") {
        addStatus("nascentchaos", parseInt(effectLog.groups.effectDuration) * 1000, effectLog.groups.targetID);
        removeIcon("berserk");
      }
      else if (effectLog.groups.gainsLoses == "loses") {
        removeStatus("nascentchaos", effectLog.groups.targetID);
        addIconBlinkTimeout("berserk",checkRecast("berserk"),nextid.berserk,icon.berserk);
      }
      warGauge()
    }
  }
}


function warMitigation() {

  // Shows next mitigation cooldown
  // Ideally Vengeance > Raw Intuition > Rampart > Raw Intuition > DPS plz wake up and DPS

  if (player.level >= 56) {
    if (checkRecast("vengeance") <= Math.min(checkRecast("rampart"), checkRecast("rawintuition"))) {
      addIconBlinkTimeout("mitigation",checkRecast("vengeance"),nextid.mitigation,icon.vengeance);
    }
    else if (checkRecast("rawintuition") <= Math.min(checkRecast("rampart"), checkRecast("vengeance"))) {
      addIconBlinkTimeout("mitigation",checkRecast("rawintuition"),nextid.mitigation,icon.rawintuition);
    }
    else if (checkRecast("rampart") <= Math.min(checkRecast("vengeance"), checkRecast("rawintuition"))) {
      addIconBlinkTimeout("mitigation",checkRecast("rampart"),nextid.mitigation,icon.rampart);
    }
  }

  else if (player.level >= 46) {
    if (checkRecast("vengeance") <= checkRecast("rampart")) {
      addIconBlinkTimeout("mitigation",checkRecast("vengeance"),nextid.mitigation,icon.vengeance);
    }
    else if (checkRecast("rampart") <= checkRecast("vengeance")) {
      addIconBlinkTimeout("mitigation",checkRecast("rampart"),nextid.mitigation,icon.rampart);
    }
  }

  else if (player.level >= 8) {
    addIconBlinkTimeout("mitigation",checkRecast("rampart"),nextid.mitigation,icon.rampart);
  }
}

function warGauge() {

  let targetbeast = 50; // Display spender icon if Beast is this value or above

  // Set Inner Beast icon - listed from highest to lowest minimum potency
  if (checkStatus("nascentchaos", player.ID) > 2500) {
    if (count.targets >= 3) {
      icon.innerbeast = icon.chaoticcyclone;
    }
    if (player.level >= 80) {
      icon.innerbeast = icon.innerchaos;
    }
    else if (player.level >= 74) {
      icon.innerbeast = icon.chaoticcyclone; // Use Cyclone on Single Target before 80? Not sure...
    }
  }
  else if (player.level >= 60
  && count.targets >= 3) {
    icon.innerbeast = icon.decimate;
  }
  else if (player.level >= 45
  && count.targets >= 3) {
    icon.innerbeast = icon.steelcyclone;
  }
  else if (player.level >= 54) {
    icon.innerbeast = icon.fellcleave;
  }
  else if (player.level >= 45
  && player.level < 54
  && count.targets >= 2) {
    icon.innerbeast = icon.steelcyclone;
  }
  else {
    icon.innerbeast = "002553";
  }

  // Set Steel Cyclone icon
  if (checkStatus("nascentchaos", player.ID) > 2500) {
    icon.steelcyclone = icon.chaoticcyclone;
  }
  else if (player.level >= 60) {
    icon.steelcyclone = icon.decimate;
  }
  else {
    icon.steelcyclone = "002552";
  }

  if (player.level >= 70
  && checkStatus("berserk", player.ID) > 0) { // Possibly adjust this number
    targetbeast = 0; // Spam during Inner Release
  }
  else if (player.level >= 70
  && checkRecast("berserk") < 5000
  && checkRecast("infuriate1", player.ID) < 40000) {
    targetbeast = 50; // Avoid overcapping during Inner Release
  }
  else if (player.level >= 66
  && checkRecast("infuriate1", player.ID) < 10000) {
    targetbeast = 50; // Avoid overcapping from Enhanced Infuriate
  }
  else if (player.level < 66
  && checkRecast("infuriate1", player.ID) < 5000) {
    targetbeast = 50; // Avoid overcapping from Infuriate
  }
  else if (player.level >= 74
  && checkStatus("nascentchaos", player.ID) > 2500
  && checkStatus("nascentchaos", player.ID) < 12500) {
    targetbeast = 50; // Avoid wasting Nascent Chaos
  }
  else if (player.level >= 50
  && count.targets <= 3 // AoE wins at 3
  && checkStatus("stormseye", player.ID) < 15000) {
    targetbeast = 90; // Avoid letting Storm's Eye fall off during AoE
  }
  else if (player.level >= 50
  && checkStatus("stormseye", player.ID) < 5000) {
    targetbeast = 90; // Avoid using spenders out of Storm's Eye
  }
  else if (player.level >= 45
  && count.targets >= 3) {
    targetbeast = 50; // Use AoE
  }
  else if (player.level >= 64
  && checkRecast("upheaval") < 20000) { // Revisit if too conservative
    targetbeast = 70; // Stay above 20 for Upheavals
  }
  else {
    targetbeast = 50; // All other cases
  }

  // Berserk/Inner Release
  if (checkRecast("berserk") < 0
  && checkStatus("stormseye", player.ID) > 0) {
    addIcon({name: "berserk"});
  }
  else if (player.level >= 70
  && checkRecast("upheaval") < 1000
  && checkStatus("berserk", player.ID) > 0) {
    addIcon({name: "upheaval"});
  }
  else if (player.level >= 64
  && player.jobDetail.beast >= 20
  && checkRecast("upheaval") < 1000
  && checkRecast("berserk") > 25000) {
    addIcon({name: "upheaval"});
  }
  else {
    removeIcon("upheaval");
  }

  if (player.level >= 35
  && player.jobDetail.beast >= targetbeast) {
    addIcon({name: "innerbeast"});
  }
  else {
    removeIcon("innerbeast");
  }
}

function warCombo() {

  delete toggle.combo;

  removeIcon("heavyswing");
  removeIcon("maim");
  removeIcon("stormspath");

  // Revisit this later if it is refreshing too much
  if (player.level >= 50
  && checkRecast("berserk") < 17500
  && checkStatus("stormseye", player.ID) - Math.max(checkRecast("berserk"), 0) < 20000) {
    stormseyeCombo();
  }

  else if (player.level >= 74
  && count.targets >= 2
  && checkStatus("stormseye", player.ID) > 7500) {
    mythriltempestCombo();
  }

  else if (player.level >= 50
  && count.targets >= 3
  && checkStatus("stormseye", player.ID) > 7500) {
    mythriltempestCombo();
  }

  // Revisit this later if it is too conservative
  else if (player.level >= 50
  && checkStatus("stormseye", player.ID) < 10000) {
    stormseyeCombo();
  }

  else if (player.level >= 40
  && count.targets >= 3) {
    mythriltempestCombo();
  }

  else {
    stormspathCombo();
  }
}

function warComboTimeout() {
  clearTimeout(timeout.combo);
  timeout.combo = setTimeout(warCombo, 12500);
}

function stormspathCombo() {
  next.combo = 1;
  addIcon({name: "heavyswing"});
  if (player.level >= 18) {
    addIcon({name: "maim"});
  }
  if (player.level >= 38) {
    addIcon({name: "stormspath"});
  }
}

function stormseyeCombo() {
  next.combo = 2;
  addIcon({name: "heavyswing"});
  addIcon({name: "maim"});
  addIcon({name: "stormseye"});
}

function mythriltempestCombo() {
  next.combo = 3;
  addIcon({name: "overpower"});
  removeIcon("maim");
  if (player.level >= 40) {
    addIcon({name: "mythriltempest"});
  }
}

"use strict";

actionList.whm = [

  // oGCD actions
  "Presence Of Mind", "Benediction", "Asylum", "Assize", "Thin Air", "Tetragrammaton", "Divine Benison",


  // GCD actions
  "Aero", "Regen", "Aero II", "Dia", "Afflatus Misery",

  "Lucid Dreaming"

];

function whmJobChange() {

  // Set up UI
  nextid.freecure = 0;
  nextid.regen = 1;
  nextid.aero = 2;
  nextid.afflatusmisery = 3;
  nextid.luciddreaming = 10;
  nextid.thinair = nextid.luciddreaming;

  countdownid.regen = 0;
  countdownid.aero = 0;
  countdownid.assize = 1;
  countdownid.divinebenison = 2;
  countdownid.tetragrammaton = 3;
  countdownid.benediction = 4;
  countdownid.asylum = 5;
  countdownid.presenceofmind = 6;
  countdownid.thinair = 7;
  countdownid.swiftcast = 8;
  countdownid.plenaryindulgence = 10;
  countdownid.temperance = 11;

  // Set up icons
  if (player.level >= 72) {
    icon.aero = icon.dia;
  }
  else if (player.level >= 46) {
    icon.aero = icon.aero2;
  }
  else {
    icon.aero = "000401";
  }

  if (checkStatus("freecure") > 0) {
    addIcon({name: "freecure"});
  }
  else {
    removeIcon("freecure");
  }

  if (player.level >= 24
  && player.currentMP / player.maxMP < 0.8
  && checkRecast("luciddreaming") < 0) {
    addIcon({name: "luciddreaming"});
  }
  else {
    removeIcon("luciddreaming");
  }

  if (player.level >= 30) {
    addCountdownBar({name: "presenceofmind", time: -1});
  }

  if (player.level >= 50) {
    addCountdownBar({name: "benediction", time: -1});
  }

  if (player.level >= 52) {
    addCountdownBar({name: "asylum", time: -1});
  }

  if (player.level >= 56) {
    addCountdownBar({name: "assize", time: -1});
  }

  if (player.level >= 58) {
    addCountdownBar({name: "thinair", time: -1});
  }

  if (player.level >= 60) {
    addCountdownBar({name: "tetragrammaton", time: -1});
  }

  if (player.level >= 66) {
    addCountdownBar({name: "divinebenison", time: -1});
  }

  if (player.level >= 70) {
    addCountdownBar({name: "plenaryindulgence", time: -1});
  }

  if (player.level >= 80) {
    addCountdownBar({name: "temperance", time: -1});
  }

  if (player.level >= 18) {
    addCountdownBar({name: "swiftcast", time: -1});
  }
}

function whmPlayerChangedEvent() {

  // MP recovery - Lucid and Thin Air share same spot
  if (player.level >= 24
  && player.currentMP / player.maxMP < 0.8
  && checkRecast("luciddreaming") < 0) {
    addIcon({name: "luciddreaming"});
  }
  else {
    removeIcon("luciddreaming");
  }

  if (player.tempjobDetail.bloodlily >= 3) {
    addIcon({name: "afflatusmisery"});
  }
  else {
    removeIcon("afflatusmisery");
  }
}

function whmTargetChangedEvent() {

  if (previous.targetID != target.ID) {

    // 0 = no target, 1... = player? E... = non-combat NPC?
    if (target.ID.startsWith("1")
    && ["PLD", "WAR", "DRK", "GNB"].indexOf(target.job) > -1) {
      addCountdownBar({name: "regen", time: checkStatus("regen", target.ID), oncomplete: "addIcon"});
    }
    else if (target.ID.startsWith("4")) {
      addCountdownBar({name: "aero", time: checkStatus("aero", target.ID), oncomplete: "addIcon"});
    }
    else {
      removeCountdownBar("aero");
    }
    previous.targetID = target.ID;
  }
}

function whmAction() {

  if (actionList.whm.indexOf(actionLog.groups.actionName) > -1) {

    if (actionLog.groups.actionName == "Lucid Dreaming") {
      addRecast("luciddreaming");
      addCountdownBar({name: "luciddreaming"});
    }

    else if (actionLog.groups.actionName == "Presence Of Mind") {
      addRecast("presenceofmind");
      addCountdownBar({name: "presenceofmind"});
    }

    else if (actionLog.groups.actionName == "Benediction") {
      addRecast("benediction");
      addCountdownBar({name: "benediction"});
    }

    else if (actionLog.groups.actionName == "Asylum") {
      addRecast("asylum");
      addCountdownBar({name: "asylum"});
    }

    else if (actionLog.groups.actionName == "Assize") {
      addRecast("assize");
      addCountdownBar({name: "assize"});
    }

    else if (actionLog.groups.actionName == "Thin Air") {
      addRecast("thinair");
      addCountdownBar({name: "thinair"});
    }

    else if (actionLog.groups.actionName == "Tetragrammaton") {
      addRecast("tetragrammaton");
      addCountdownBar({name: "tetragrammaton"});
    }

    else if (actionLog.groups.actionName == "Divine Benison") {
      addRecast("divinebenison");
      addCountdownBar({name: "divinebenison"});
    }

    else if (actionLog.groups.actionName == "Regen") {
      removeIcon("regen");
      addCountdownBar({name: "regen", time: checkStatus("regen", target.ID), oncomplete: "addIcon"});
      addStatus("regen", duration.regen, actionLog.groups.targetID);
    }

    else if (["Aero", "Aero II", "Dia"].indexOf(actionLog.groups.actionName) > -1) {
      removeIcon("aero");
      if (player.level >= 72) {
        addStatus("aero", duration.dia, actionLog.groups.targetID);
      }
      else {
        addStatus("aero", duration.aero, actionLog.groups.targetID);
      }
    }
  }
}

function whmStatus() {

  if (effectLog.groups.effectName == "Freecure") {
    if (effectLog.groups.gainsLoses == "gains") {
      addStatus("freecure", parseInt(effectLog.groups.effectDuration) * 1000);
      addIcon({name: "freecure"});
    }
    else if (effectLog.groups.gainsLoses == "loses") {
      removeStatus("freecure");
      removeIcon("freecure");
    }
  }

  else if (effectLog.groups.effectName == "Lucid Dreaming") {
    if (effectLog.groups.gainsLoses == "gains") {
      addStatus("luciddreaming", parseInt(effectLog.groups.effectDuration) * 1000);
    }
    else if (effectLog.groups.gainsLoses == "loses") {
      removeStatus("luciddreaming");
    }
  }

  else if (effectLog.groups.effectName == "Regen") {
    if (effectLog.groups.gainsLoses == "gains") {
      addStatus("regen", parseInt(effectLog.groups.effectDuration) * 1000, effectLog.groups.targetID);
      removeIcon("regen");
      if (target.ID == effectLog.groups.targetID
      && ["PLD", "WAR", "DRK", "GNB"].indexOf(target.job) > -1) {
        addCountdownBar({name: "regen", time: checkStatus("regen", target.ID), oncomplete: "addIcon"});
      }
    }
    else if (effectLog.groups.gainsLoses == "loses") {
      removeStatus("regen", effectLog.groups.targetID);
      if (target.ID == effectLog.groups.targetID
      && ["PLD", "WAR", "DRK", "GNB"].indexOf(target.job) > -1) {
        addIcon({name: "regen"});
      }
    }
  }

  else if (["Aero", "Aero II", "Dia"].indexOf(effectLog.groups.effectName) > -1) {
    if (effectLog.groups.gainsLoses == "gains") {
      addStatus("aero", parseInt(effectLog.groups.effectDuration) * 1000, effectLog.groups.targetID);
      removeIcon("aero");
      if (target.ID == effectLog.groups.targetID) {
        addCountdownBar({name: "aero", time: checkStatus("aero", target.ID), oncomplete: "addIcon"});
      }
    }
    else if (effectLog.groups.gainsLoses == "loses") {
      removeStatus("aero", effectLog.groups.targetID);
      if (target.ID == effectLog.groups.targetID) {
        addIcon({name: "aero"});
      }
    }
  }
}
