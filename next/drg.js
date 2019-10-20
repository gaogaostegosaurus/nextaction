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
    addCountdownBar("jump", checkRecast("jump"));
  }

  if (player.level >= 54
  && Math.max(player.jobDetail.bloodMilliseconds, player.jobDetail.lifeMilliseconds) < 500) {
    addCountdownBar("bloodofthedragon", checkRecast("bloodofthedragon"), "icon");
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
    addCountdownBar("bloodofthedragon", checkRecast("bloodofthedragon"), "icon");
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
      addCountdownBar("requiescat");

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
        enemyTargets = 1;
        addRecast("circleofscorn");
      }
      else {
        enemyTargets = enemyTargets + 1;
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
          enemyTargets = 1;
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
          enemyTargets = enemyTargets + 1;
          pldCombo();
        }
      }

      else if ("Prominence" == actionLog.groups.actionName
      && actionLog.groups.result.length > 6) {

        if (Date.now() - previous.prominence > 1000) {
          previous.prominence = Date.now();
          enemyTargets = 1;
        }
        else {
          enemyTargets = enemyTargets + 1;
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
          enemyTargets = 1;
        }
        else {
          enemyTargets = enemyTargets + 1;
        }
        pldRequiescatMP();
      }

      else if ("Confiteor" == actionLog.groups.actionName
      && actionLog.groups.result.length > 1) {
        if (Date.now() - previous.confiteor > 1000) {
          previous.confiteor = Date.now();
          enemyTargets = 1;
        }
        else {
          enemyTargets = enemyTargets + 1;
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

  if (enemyTargets >= 3) {
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
