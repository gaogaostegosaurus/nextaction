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

  if (actionList.drg.indexOf(actionGroups.actionname) > -1) {

    // Non-GCD

    if ("Life Surge" == actionGroups.actionname) {
      addRecast("lifesurge");
    }

    else if ("Lance Charge" == actionGroups.actionname) {
      addRecast("lancecharge");
    }

    else if (["Jump", "High Jump"].indexOf(actionGroups.actionname)) {
      addRecast("jump");
    }

    else if ("Elusive Jump" == actionGroups.actionname) {
      addRecast("elusivejump");
    }

    else if ("Sentinel" == actionGroups.actionname) {
      addRecast("sentinel");
    }

    else if ("Cover" == actionGroups.actionname) {
      addRecast("cover");
    }

    else if ("Divine Veil" == actionGroups.actionname) {
      addRecast("divineveil");
    }

    else if ("Intervention" == actionGroups.actionname) {
      addRecast("intervention");
    }

    else if ("Requiescat" == actionGroups.actionname) {
      removeIcon("requiescat");
      addStatus("requiescat");
      addRecast("requiescat");
      addCountdownBar("requiescat");

      pldRequiescatMP();
    }

    else if ("Passage Of Arms" == actionGroups.actionname) {
      addRecast("passageofarms");
    }

    else if ("Intervene" == actionGroups.actionname) {
      if (checkRecast("intervene2") < 0) {
        addRecast("intervene1", -1);
        addRecast("intervene2");
      }
      else {
        addRecast("intervene1", checkRecast("intervene2"));
        addRecast("intervene2", checkRecast("intervene2") + recast.intervene);
      }
    }

    else if ("Circle Of Scorn" == actionGroups.actionname) {
      if (Date.now() - previous.circleofscorn > 1000) {
        previous.circleofscorn = Date.now();
        count.aoe = 1;
        addRecast("circleofscorn");
      }
      else {
        count.aoe = count.aoe + 1;
      }
    }

    // GCD actions - affect combos

    // else if ("Bloodspiller" == actionGroups.actionname) {
    //   removeIcon("bloodspiller");
    // }

    // GCD actions - affect combos, catch all)

    else {

      if ("Fast Blade" == actionGroups.actionname
      && actionGroups.result.length > 1) {
        if (next.combo > 2) {
          pldSingleTargetCombo();
          toggle.combo = Date.now();
        }
        removeIcon("fastblade");
        pldComboTimeout();
      }

      else if ("Riot Blade" == actionGroups.actionname
      && actionGroups.result.length > 6) {
        if (player.level < 26) {
          pldCombo();
        }
        else {
          removeIcon("fastblade");
          removeIcon("riotblade");
          pldComboTimeout();
        }
      }

      else if ("Goring Blade" == actionGroups.actionname
      && actionGroups.result.length > 6) {
        addStatus("goringblade", duration.goringblade, actionGroups.targetID);
        pldCombo();
      }

      else if ("Royal Authority" == actionGroups.actionname
      && player.level >= 76
      && actionGroups.result.length > 6) {
        removeIcon("royalauthority");
        count.atonement = 3;
        addIcon("atonement1");
        addIcon("atonement2");
        addIcon("atonement3");
        pldGoringBladeCombo();
      }

      else if ("Atonement" == actionGroups.actionname
      && actionGroups.result.length > 1) {
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

      else if ("Total Eclipse" == actionGroups.actionname
      && actionGroups.result.length > 1) {

        if (Date.now() - previous.totaleclipse > 1000) {
          previous.totaleclipse = Date.now();
          count.aoe = 1;
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
          count.aoe = count.aoe + 1;
          pldCombo();
        }
      }

      else if ("Prominence" == actionGroups.actionname
      && actionGroups.result.length > 6) {

        if (Date.now() - previous.prominence > 1000) {
          previous.prominence = Date.now();
          count.aoe = 1;
        }
        else {
          count.aoe = count.aoe + 1;
        }
        pldCombo();
      }

      else if ("Holy Spirit" == actionGroups.actionname
      && actionGroups.result.length > 1) {
        pldRequiescatMP();
      }

      else if ("Holy Circle" == actionGroups.actionname
      && actionGroups.result.length > 1) {
        if (Date.now() - previous.holycircle > 1000) {
          previous.holycircle = Date.now();
          count.aoe = 1;
        }
        else {
          count.aoe = count.aoe + 1;
        }
        pldRequiescatMP();
      }

      else if ("Confiteor" == actionGroups.actionname
      && actionGroups.result.length > 1) {
        if (Date.now() - previous.confiteor > 1000) {
          previous.confiteor = Date.now();
          count.aoe = 1;
        }
        else {
          count.aoe = count.aoe + 1;
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

  if (statusGroups.targetID == player.ID) { // Target is self

    if ("Life Surge" == statusGroups.statusname) {
      if (statusGroups.gainsloses == "gains") {
        addStatus("lifesurge", parseInt(statusGroups.duration) * 1000, statusGroups.targetID);
      }
      else if (statusGroups.gainsloses == "loses") {
        removeStatus("lifesurge");
      }
    }

    else if ("Lance Charge" == statusGroups.statusname) {
      if (statusGroups.gainsloses == "gains") {
        addStatus("lancecharge", parseInt(statusGroups.duration) * 1000, statusGroups.targetID);
      }
      else if (statusGroups.gainsloses == "loses") {
        removeStatus("lancecharge");
      }
    }

    else if ("Disembowel" == statusGroups.statusname) {
      if (statusGroups.gainsloses == "gains") {
        addStatus("disembowel", parseInt(statusGroups.duration) * 1000, statusGroups.targetID);
      }
      else if (statusGroups.gainsloses == "loses") {
        removeStatus("disembowel");
      }
    }

    else if ("Battle Litany" == statusGroups.statusname) {
      if (statusGroups.gainsloses == "gains") {
        addStatus("battlelitany", parseInt(statusGroups.duration) * 1000, statusGroups.targetID);
      }
      else if (statusGroups.gainsloses == "loses") {
        removeStatus("battlelitany");
      }
    }

    else if ("Sharper Fang And Claw" == statusGroups.statusname) {
      if (statusGroups.gainsloses == "gains") {
        addStatus("sharperfangandclaw", parseInt(statusGroups.duration) * 1000, statusGroups.targetID);
      }
      else if (statusGroups.gainsloses == "loses") {
        removeIcon("fangandclaw");
        removeStatus("sharperfangandclaw");
      }
    }

    else if ("Enhanced Wheeling Thrust" == statusGroups.statusname) {
      if (statusGroups.gainsloses == "gains") {
        addStatus("enhancedwheelingthrust", parseInt(statusGroups.duration) * 1000, statusGroups.targetID);
      }
      else if (statusGroups.gainsloses == "loses") {
        removeIcon("wheelingthrust");
        removeStatus("enhancedwheelingthrust");
      }
    }

    else if ("Right Eye" == statusGroups.statusname) {
      if (statusGroups.gainsloses == "gains") {
        addStatus("righteye", parseInt(statusGroups.duration) * 1000, statusGroups.targetID);
      }
      else if (statusGroups.gainsloses == "loses") {
        removeStatus("righteye");
      }
    }

    else if ("Dive Ready" == statusGroups.statusname) {
      if (statusGroups.gainsloses == "gains") {
        addStatus("diveready", parseInt(statusGroups.duration) * 1000, statusGroups.targetID);
        addIcon("miragedive");
      }
      else if (statusGroups.gainsloses == "loses") {
        removeStatus("diveready");
        removeIcon("miragedive");
      }
    }

    else if ("Raiden Thrust Ready" == statusGroups.statusname) {
      if (statusGroups.gainsloses == "gains") {
        addStatus("raidenthrustready", parseInt(statusGroups.duration) * 1000, statusGroups.targetID);
      }
      else if (statusGroups.gainsloses == "loses") {
        removeStatus("raidenthrustready");
      }
    }

  }

  else { // Target is not self

    if ("Chaos Thrust" == statusGroups.statusname) {
      if (statusGroups.gainsloses == "gains") {
        addStatus("chaosthrust", parseInt(statusGroups.duration) * 1000, statusGroups.targetID)
      }
      else if (statusGroups.gainsloses == "loses") {
        removeStatus("swordoath", statusGroups.targetID);
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

  if (count.aoe >= 3) {
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
  addIcon("truethrust");
  addIcon("vorpalthrust");
  if (player.level >= 26) {
    addIcon("fullthrust");
  }
  if (player.level >= 56) {
    nextid.combo4 = nextid.fangandclaw;
    addIcon("fangandclaw");
  }
  if (player.level >= 64) {
    nextid.combo5 = nextid.wheelingthrust;
    addIcon("wheelingthrust");
  }
}


function drgChaosThrustCombo() {
  next.combo = 2;
  addIcon("truethrust");
  addIcon("disembowel");
  if (player.level >= 50) {
    addIcon("chaosthrust");
  }
  if (player.level >= 58) {
    nextid.combo4 = nextid.fangandclaw;
    addIcon("wheelingthrust");
  }
  if (player.level >= 64) {
    nextid.combo5 = nextid.wheelingthrust;
    addIcon("fangandclaw");
  }
}

function drgCoerthanTormentCombo() {
  next.combo = 11;
  addIcon("doomspike");
  if (player.level >= 62) {
    addIcon("sonicthrust");
  }
  if (player.level >= 72) {
    addIcon("coerthantorment");
  }
}


function drgDisembowelCombo() {
  next.combo = 12;
  addIcon("truethrust");
  addIcon("disembowel");
}


function drgComboTimeout() {
  clearTimeout(timeout.combo);
  timeout.combo = setTimeout(drgCombo, 12500);
}
