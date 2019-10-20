"use strict";

// To do: clearer indication of when TCJ / Mudra is active

actionList.nin = [

  // Off GCD
  "Hide", "Mug", "Trick Attack", "Kassatsu", "Dream Within A Dream", "Assassinate",
  "Bhavacakra", "Hellfrog Medium",
  "Ten Chi Jin",

  // GCD
  "Spinning Edge", "Gust Slash", "Shadow Fang", "Aeolian Edge", "Armor Crush",
  "Death Blossom", "Hakke Mujinsatsu", "Throwing Dagger",
  "Katon", "Raiton", "Suiton", "Goka Mekkyaku", "Hyosho Ranyu",
  // Code currently doesn't use mudra or most ninjutsu for decision-making
  // "Ten", "Chi", "Jin", "Fuma Shuriken",  "Hyoton", "Huton", "Doton",

  // Role
  "True North"
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

  enemyTargets = 1;
  previous.deathblossom = 0;
  previous.hakkemujinsatsu = 0;
  previous.katon = 0; // Includes Goka Mekkyaku
  previous.hellfrogmedium = 0;

  if (player.level >= 56) {
    addCountdownBar("dreamwithinadream", -1);
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
      addCountdownBar("shadowfang", checkStatus("shadowfang", target.ID));
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
        addCountdownBar("ninjutsu", -1);
        clearTimeout(timeout.ninjutsu);
        ninNinjutsu();
      }

      else if ("Mug" == actionLog.groups.actionName) {
        ninNinki();
      }

      else if ("Trick Attack" == actionLog.groups.actionName) {
        addCountdownBar("trickattack");
      }

      else if (["Raiton", "Hyosho Ranyu"].indexOf(actionLog.groups.actionName) > -1) {
        enemyTargets = 1;
      }

      else if (["Katon", "Goka Mekkyaku"].indexOf(actionLog.groups.actionName) > -1) {
        if (Date.now() - previous.katon > 1000) {
          previous.katon = Date.now()
          enemyTargets = 1;
        }
        else {
          enemyTargets = enemyTargets + 1;
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
          addCountdownBar("kassatsu", checkRecast("kassatsu1"), "icon");
        }

        addCountdownBar("ninjutsu", -1);
        clearTimeout(timeout.ninjutsu);
        ninNinjutsu();
      }

      else if ("Dream Within A Dream" == actionLog.groups.actionName) {
        removeIcon("dreamwithinadream");
        addCountdownBar("dreamwithinadream", recast.dreamwithinadream, "icon");
        addStatus("assassinateready");
      }

      else if ("Hellfrog Medium" == actionLog.groups.actionName) {
        if (Date.now() - previous.hellfrogmedium > 1000) {
          previous.hellfrogmedium = Date.now()
          enemyTargets = 1;
        }
        else {
          enemyTargets = enemyTargets + 1;
        }
        ninNinki();
      }

      else if ("Bhavacakra" == actionLog.groups.actionName) {
        enemyTargets = 1;
        ninNinki();
      }

      else if ("Ten Chi Jin" == actionLog.groups.actionName) {
        removeIcon("tenchijin");
        addStatus("tenchijin");
        addCountdownBar("tenchijin");
        addRecast("ninjutsu", -1);
        addCountdownBar("ninjutsu", -1);
        clearTimeout(timeout.ninjutsu);
        ninNinjutsu();
      }

      else if ("Meisui" == actionLog.groups.actionName) {
        addCountdownBar("meisui");
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
            enemyTargets = 1;
            if (next.combo != 4) {
              ninHakkeMujinsatsuCombo();
            }
            removeIcon("deathblossom");
            if (player.level < 52) {
              ninCombo();
            }
          }
          else {
            enemyTargets = enemyTargets + 1;
          }
        }

        else if ("Hakke Mujinsatsu" == actionLog.groups.actionName
        && actionLog.groups.result.length == 8) {

          if (Date.now() - previous.hakkemujinsatsu > 1000) {
            previous.hakkemujinsatsu = Date.now()
            enemyTargets = 1;
            ninCombo();
          }
          else {
            enemyTargets = enemyTargets + 1;
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
        addCountdownBar("ninjutsu");
        clearTimeout(timeout.ninjutsu);
        timeout.ninjutsu = setTimeout(ninNinjutsu, recast.ninjutsu - 1000);
        if (player.level >= 70
        && checkRecast("trickattack") < 21000
        && checkRecast("tenchijin") < 1000) {
          addIcon("tenchijin");
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
          addCountdownBar("shadowfang", checkStatus("shadowfang", target.ID));
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
  && enemyTargets <= 2
  && player.jobDetail.hutonMilliseconds > 6000
  && player.jobDetail.hutonMilliseconds < 46000) {
    ninArmorCrushCombo();
  }
  else if (player.level >= 38
  && enemyTargets <= 3
  && checkStatus("shadowfang", target.ID) < 9000) {
    ninShadowFangCombo();
  }
  else if (player.level >= 38
  && enemyTargets >= 3
  && player.jobDetail.hutonMilliseconds > 3000) {
    ninHakkeMujinsatsuCombo();
  }
  else {
    ninAeolianEdgeCombo();
  }
}

function ninAeolianEdgeCombo() {
  next.combo = 1;
  addIcon("spinningedge");
  addIcon("gustslash");
  if (player.level >= 26) {
    addIcon("aeolianedge");
  }
}

function ninArmorCrushCombo() {
  next.combo = 2;
  addIcon("spinningedge");
  addIcon("gustslash");
  addIcon("armorcrush");
}

function ninShadowFangCombo() {
  next.combo = 3;
  addIcon("spinningedge");
  addIcon("shadowfang");
}

function ninHakkeMujinsatsuCombo() {
  next.combo = 4;
  addIcon("deathblossom");
  if (player.level >= 52) {
    addIcon("hakkemujinsatsu");
  }
}

function ninLosesMudra() {
  removeIcon("ninjutsu1");
  removeIcon("ninjutsu2");
  removeIcon("ninjutsu3");
  addCountdownBar("ninjutsu");
  clearTimeout(timeout.ninjutsu);
  timeout.ninjutsu = setTimeout(ninNinjutsu, recast.ninjutsu - 1000);
  if (checkRecast("kassatsu1") < 0) {
    addIcon("kassatsu");
  }
  if (checkRecast("tenchijin") < 0) {
    addIcon("tenchijin");
  }
}

function ninNinjutsu() {

  if (player.level >= 70) {
    if (checkRecast("trickattack") < checkRecast("tenchijin") + 25000) {
      addCountdownBar("tenchijin", checkRecast("tenchijin"), "SUITON");
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
    addIcon("ninjutsu3"); // Huton if down and no damage buffs
  }
  else if (player.level >= 45
  && player.level < 54  // No AC
  && player.jobDetail.hutonMilliseconds < 25000
  && checkStatus("kassatsu") < 0) {
    icon.ninjutsu3 = icon.huton;
    addIcon("ninjutsu3");  // Huton if Huton is low (and no AC yet)
  }

  else if (checkStatus("tenchijin") > 0) {
    if (enemyTargets >= 2) {
      icon.ninjutsu1 = icon.fumashuriken;
      icon.ninjutsu2 = icon.katon;
      icon.ninjutsu3 = icon.suiton;
    }
    else {
      icon.ninjutsu1 = icon.fumashuriken;
      icon.ninjutsu2 = icon.raiton;
      icon.ninjutsu3 = icon.suiton;
    }
    addIcon("ninjutsu1");
    addIcon("ninjutsu2");
    addIcon("ninjutsu3");
  }

  else if (player.level >= 76
  && checkStatus("kassatsu") > 0) {
    if (enemyTargets >= 2) {
      icon.ninjutsu3 = icon.katon;
    }
    else {
      icon.ninjutsu3 = icon.hyoton;
    }
    addIcon("ninjutsu3");
  }

  else if (player.level >= 45
  && checkStatus("suiton") < checkRecast("trickattack")
  && checkRecast("trickattack") < 24000
  && checkRecast("tenchijin") > 1000) {
    icon.ninjutsu3 = icon.suiton;
    addIcon("ninjutsu3");
    if (checkStatus("tenchijin") > 0) {
      icon.ninjutsu1 = icon.fumashuriken;
      addIcon("ninjutsu1");
      icon.ninjutsu2 = icon.raiton;
      addIcon("ninjutsu2");
    }
  }

  else if (player.level >= 35
  && enemyTargets >= 3) {
    icon.ninjutsu3 = icon.katon;
    addIcon("ninjutsu3"); // Probably more damage at 3 targets to do Katon than anything else...
  }

  else if (player.level >= 45
  && checkStatus("suiton", player.ID) < 0
  && player.jobDetail.ninkiAmount < 60
  && checkRecast("tenchijin") > 1000) {
    icon.ninjutsu3 = icon.suiton;
    addIcon("ninjutsu3");
    if (checkStatus("tenchijin") > 0) {
      icon.ninjutsu1 = icon.fumashuriken;
      addIcon("ninjutsu1");
      icon.ninjutsu2 = icon.raiton;
      addIcon("ninjutsu2");
    }
  }
  else if (player.level >= 35
  && enemyTargets >= 2) {
    icon.ninjutsu3 = icon.katon;
    addIcon("ninjutsu3");
  }
  else if (player.level >= 35) {
    icon.ninjutsu3 = icon.raiton;
    addIcon("ninjutsu3");
  }
  else if (player.level >= 30) {
    icon.ninjutsu3 = icon.fumashuriken;
    addIcon("ninjutsu3");
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
    && enemyTargets == 1) {
      icon.ninkiaction = icon.bhavacakra;
    }
    else {
      icon.ninkiaction = icon.hellfrogmedium;
    }
    addIcon("ninkiaction");
  }

  else {
    removeIcon("ninkiaction");
  }
}
