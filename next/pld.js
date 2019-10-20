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
    addCountdownBar("fightorflight", checkRecast("fightorflight"));
  }
  else if (player.level >= 68) {
    addCountdownBar("requiescat", checkRecast("requiescat"));
  }

  addCountdownBar("rampart", checkRecast("rampart"));

  // if (player.level >= 12) {
  //   addCountdownBar("lowblow", checkRecast("lowblow"));
  // }

  // if (player.level >= 18) {
  //   addCountdownBar("interject", checkRecast("interject"));
  // }

  // if (player.level >= 22) {
  //   addCountdownBar("reprisal", checkRecast("reprisal"));
  // }

  if (player.level >= 38) {
    addCountdownBar("sentinel", checkRecast("sentinel"));
  }

  // if (player.level >= 48) {
  //   addCountdownBar("shirk", checkRecast("shirk"));
  // }

  if (player.level >= 50) {
    addCountdownBar("hallowedground", checkRecast("hallowedground"));
  }

  if (player.level >= 74) {
    addCountdownBar("intervene2", checkRecast("intervene2"));
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
      addCountdownBar("fightorflight");
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
        && enemyTargets >= 3) {
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
        && enemyTargets >= 3) {
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
//     if (enemyTargets >= 2) {
//       icon.floodofdarkness = icon.floodofshadow;
//     }
//     else {
//       icon.floodofdarkness = icon.edgeofshadow;
//     }
//   }
//   else if (player.level >= 40
//   && enemyTargets == 1) {
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
//   && enemyTargets >= 3) {
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
    if (enemyTargets >= 3) {
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

  if (enemyTargets >= 2) {
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
