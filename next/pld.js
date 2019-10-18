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

  if (actionList.pld.indexOf(actionGroups.actionname) > -1) {

    // Role actions

    if ("Rampart" == actionGroups.actionname) {
      addRecast("rampart");
      removeIcon("rampart");
    }

    // PLD non-GCD

    else if ("Fight Or Flight" == actionGroups.actionname) {
      removeIcon("fightorflight");
      addStatus("fightorflight");
      addRecast("fightorflight");
      addCountdownBar("fightorflight");
    }

    else if ("Spirits Within" == actionGroups.actionname) {
      addRecast("spiritswithin");
    }

    else if ("Sheltron" == actionGroups.actionname) {
      addRecast("sheltron");
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

function pldStatus() {

  if (statusGroups.targetID == player.ID) { // Target is self

    if ("Rampart" == statusGroups.statusname) {
      if (statusGroups.gainsloses == "gains") {
        if (checkStatus("mitigation", statusGroups.targetID) < parseInt(statusGroups.duration) * 1000) {
          addStatus("mitigation", parseInt(statusGroups.duration) * 1000, statusGroups.targetID);
        }
      }
      else if (statusGroups.gainsloses == "loses") {
        if (checkStatus("mitigation", statusGroups.targetID) < 0 // Check for overlaps
        && count.aoe >= 3) {
          drkMitigation();
        }
      }
    }

    else if ("Iron Will" == statusGroups.statusname) {
      if (statusGroups.gainsloses == "gains") {
        removeIcon("ironwill");
      }
      else if (statusGroups.gainsloses == "loses") {
        addIcon("ironwill");
      }
    }

    else if ("Sentinel" == statusGroups.statusname) {
      if (statusGroups.gainsloses == "gains") {
        if (checkStatus("mitigation", statusGroups.targetID) < parseInt(statusGroups.duration) * 1000) {
          addStatus("mitigation", parseInt(statusGroups.duration) * 1000, statusGroups.targetID);
        }
      }
      else if (statusGroups.gainsloses == "loses") {
        if (checkStatus("mitigation", statusGroups.targetID) < 0
        && count.aoe >= 3) {
          drkMitigation();
        }
      }
    }

    else if ("Requiescat" == statusGroups.statusname) {
      if (statusGroups.gainsloses == "gains") {
        addStatus("requiescat", parseInt(statusGroups.duration) * 1000, statusGroups.targetID)
      }
      else if (statusGroups.gainsloses == "loses") {
        removeStatus("requiescat");
        removeIcon("holyspirit1");
        removeIcon("holyspirit2");
        removeIcon("holyspirit3");
        removeIcon("holyspirit4");
        removeIcon("holyspirit5");
        pldCombo();
      }
    }

    else if ("Sword Oath" == statusGroups.statusname) {
      if (statusGroups.gainsloses == "gains") {
        addStatus("swordoath", parseInt(statusGroups.duration) * 1000, statusGroups.targetID)
      }
      else if (statusGroups.gainsloses == "loses") {
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

  // if (player.level >= 38) {
  //   if (checkRecast("darkwall") <= checkRecast("rampart")) {
  //     addIconBlinkTimeout("darkwall",checkRecast("darkwall"),nextid.mitigation,icon.darkwall);
  //   }
  //   else if (checkRecast("rampart") <= checkRecast("darkwall")) {
  //     addIconBlinkTimeout("mitigation",checkRecast("rampart"),nextid.mitigation,icon.rampart);
  //   }
  // }
  //
  // else {
  //   addIconBlinkTimeout("mitigation",checkRecast("rampart"),nextid.mitigation,icon.rampart);
  // }
}
//
// function pldMP() {
//
//   player.tempjobDetail.darkarts = player.debugJobSplit[4]; // 0 or 1
//
//   if (player.level >= 74) {
//     if (count.aoe >= 2) {
//       icon.floodofdarkness = icon.floodofshadow;
//     }
//     else {
//       icon.floodofdarkness = icon.edgeofshadow;
//     }
//   }
//   else if (player.level >= 40
//   && count.aoe == 1) {
//     icon.floodofdarkness = icon.edgeofdarkness;
//   }
//   else {
//     icon.floodofdarkness = "003082";
//   }
//
//   if (player.level >= 70) {
//     if (player.currentMP >= 6000
//     || player.tempjobDetail.darkarts == 1) {
//       //addIcon("floodofdarkness");
//     }
//     else {
//       removeIcon("floodofdarkness");
//     }
//   }
//   else if (player.level >= 30) { // No TBN yet
//     if (player.currentMP >= 3000) {
//       addIcon("floodofdarkness");
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
//   && count.aoe >= 3) {
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
//       addIcon("gaugespender");
//     }
//     else if (player.level >= 62) {
//       addIcon("gaugespender");
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
    if (count.aoe >= 3) {
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
  addIcon("fastblade");
  addIcon("riotblade");
  if (player.level >= 26) {
    addIcon("rageofhalone");
  }
}

function pldGoringBladeCombo() {
  next.combo = 2;
  addIcon("fastblade");
  addIcon("riotblade");
  addIcon("goringblade");
}


function pldProminenceCombo() {
  next.combo = 3;
  addIcon("totaleclipse");
  if (player.level >= 40) {
    addIcon("prominence");
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

  if (count.aoe >= 2) {
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
    addIcon("holyspirit1");
  }
  if (Math.floor(player.currentMP / 2000) >= 4) {
    addIcon("holyspirit2");
  }
  if (Math.floor(player.currentMP / 2000) >= 3) {
    addIcon("holyspirit3");
  }
  if (Math.floor(player.currentMP / 2000) >= 2) {
    addIcon("holyspirit4");
  }
  if (Math.floor(player.currentMP / 2000) >= 1) {
    addIcon("holyspirit5");
  }

  if (Math.floor(player.currentMP / 2000) == 0) {
    pldCombo();
  }

}