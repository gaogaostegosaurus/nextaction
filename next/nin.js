"use strict";

actionList.nin = [

  // Off GCD
  "Hide", "Mug", "Trick Attack", "Kassatsu", "Dream Within A Dream", "Assassinate",
  "Bhavacakra", "Hellfrog Medium",
  "Ten Chi Jin",

  // GCD
  "Spinning Edge", "Gust Slash", "Shadow Fang", "Aeolian Edge", "Armor Crush",
  "Death Blossom", "Hakke Mujinsatsu", "Throwing Dagger",
  "Ten", "Chi", "Jin", "Fuma Shuriken", "Raiton", "Katon", "Hyoton", "Huton", "Doton", "Suiton",
  "Goka Mekkyaku", "Hyosho Ranyu",

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
  nextid.ninkiaction = 11;
  // nextid.trickattack = 12;
  // nextid.dreamwithinadream = 13;
  // nextid.assassinate = 14;

  countdownid.shadowfang = 0;
  countdownid.ninjutsu = 1;
  countdownid.trickattack = 2;
  countdownid.suiton = 3;
  countdownid.tenchijin = 4;
  countdownid.kassatsu = 5;
  countdownid.dreamwithinadream = 6;

  count.aoe = 1;
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
  if (previous.targetID != target.ID) { // Prevent this from repeatedly being called on movement or whatever

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

  if (actionList.nin.indexOf(actionGroups.actionname) > -1) {

    // Everything breaks Mudra "combo" so list it first
    // Not sure what to do with this

    if ("Ten" == actionGroups.actionname) {
      // toggle.mudra = toggle.mudra + "T";
      // ninMudraCombo();
    }
    else if ("Chi" == actionGroups.actionname) {
      // toggle.mudra = toggle.mudra + "C";
      // ninMudraCombo();
    }
    else if ("Jin" == actionGroups.actionname) {
      // toggle.mudra = toggle.mudra + "J";
      // ninMudraCombo();
    }

    else { // Off-GCD actions

      delete toggle.mudra;

      if ("Hide" == actionGroups.actionname) {
        removeIcon("tenchijin");
        addRecast("hide");
        addRecast("ninjutsu", -1);
        addCountdownBar("ninjutsu", -1);
        clearTimeout(timeout.ninjutsu);
        ninNinjutsu();
      }

      else if ("Mug" == actionGroups.actionname) {
        ninNinki();
      }

      else if ("Trick Attack" == actionGroups.actionname) {
        addCountdownBar("trickattack");
      }

      else if (["Hyoton", "Raiton", "Hyosho Ranyu"].indexOf(actionGroups.actionname) > -1) {
        count.aoe = 1;
      }

      else if (["Katon", "Goka Mekkyaku"].indexOf(actionGroups.actionname) > -1) {
        if (Date.now() - previous.katon > 1000) {
          previous.katon = Date.now()
          count.aoe = 1;
        }
        else {
          count.aoe = count.aoe + 1;
        }
      }

      else if ("Suiton" == actionGroups.actionname) {
        // addCountdownBar("trickattack", checkRecast("trickattack"));
      }

      else if ("Kassatsu" == actionGroups.actionname) {
        removeIcon("tenchijin");

        if (checkRecast("kassatsu2", player.ID) < 0) {
          addRecast("kassatsu2", recast.kassatsu);
          addRecast("kassatsu1", player.ID, -1);
          addCountdownBar("kassatsu", -1);
        }
        else {
          addRecast("kassatsu1", checkRecast("kassatsu2"));
          addRecast("kassatsu2", checkRecast("kassatsu2") + recast.kassatsu);
          addCountdownBar("kassatsu", checkRecast("kassatsu1"));
        }
        addStatus("kassatsu");
        addCountdownBar("ninjutsu", -1);
        clearTimeout(timeout.ninjutsu);
        ninNinjutsu();
      }

      else if ("Dream Within A Dream" == actionGroups.actionname) {
        addCountdownBar("dreamwithinadream");
        addStatus("assassinateready");
      }

      else if ("Hellfrog Medium" == actionGroups.actionname) {
        if (Date.now() - previous.hellfrogmedium > 1000) {
          previous.hellfrogmedium = Date.now()
          count.aoe = 1;
        }
        else {
          count.aoe = count.aoe + 1;
        }
        ninNinki();
      }

      else if ("Bhavacakra" == actionGroups.actionname) {
        count.aoe = 1;
        ninNinki();
      }

      else if ("Ten Chi Jin" == actionGroups.actionname) {
        removeIcon("tenchijin");
        addStatus("tenchijin");
        addCountdownBar("tenchijin");
        addRecast("ninjutsu", -1);
        addCountdownBar("ninjutsu", -1);
        clearTimeout(timeout.ninjutsu);
        ninNinjutsu();
      }

      else { // Weaponskills and combos (hopefully)

        if ("Spinning Edge" == actionGroups.actionname
        && actionGroups.result.length >= 2) {

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

        else if ("Gust Slash" == actionGroups.actionname
        && actionGroups.result.length >= 8) {

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

        else if ("Shadow Fang" == actionGroups.actionname
        && actionGroups.result.length >= 8) {
          addStatus("shadowfang", duration.shadowfang, actionGroups.targetID);
          ninCombo();
        }

        else if ("Death Blossom" == actionGroups.actionname
        && actionGroups.result.length >= 2) {

          if (Date.now() - previous.deathblossom > 1000) {
            previous.deathblossom = Date.now()
            count.aoe = 1;
            if (next.combo != 4) {
              ninHakkeMujinsatsuCombo();
            }
            removeIcon("deathblossom");
            if (player.level < 52) {
              ninCombo();
            }
          }
          else {
            count.aoe = count.aoe + 1;
          }
        }

        else if ("Hakke Mujinsatsu" == actionGroups.actionname
        && actionGroups.result.length == 8) {

          if (Date.now() - previous.hakkemujinsatsu > 1000) {
            previous.hakkemujinsatsu = Date.now()
            count.aoe = 1;
            ninCombo();
          }
          else {
            count.aoe = count.aoe + 1;
          }
        }

        else {
          ninCombo();
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

  if (statusGroups.targetID == player.ID) {

    if ("Mudra" == statusGroups.statusname) {
      if ("gains" == statusGroups.gainsloses) {
        removeCountdownBar("ninjutsu");
      }
      else if ("loses" == statusGroups.gainsloses) {
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

    // else if ("Doton" == statusGroups.statusname) {
    //   if ("gains" == statusGroups.gainsloses) {
    //     addStatus("doton", parseInt(statusGroups.duration) * 1000, statusGroups.targetID);
    //   }
    //   else if ("loses" == statusGroups.gainsloses) {
    //     removeStatus("doton", statusGroups.targetID);
    //   }
    // }

    else if ("Suiton" == statusGroups.statusname) {
      if ("gains" == statusGroups.gainsloses) {
        addStatus("suiton", parseInt(statusGroups.duration) * 1000);
      }
      else if ("loses" == statusGroups.gainsloses) {
        removeStatus("suiton", statusGroups.targetID);
      }
    }

    else if ("Kassatsu" == statusGroups.statusname) {
      if ("gains" == statusGroups.gainsloses) {
        addStatus("kassatsu", parseInt(statusGroups.duration) * 1000);
      }
      else if ("loses" == statusGroups.gainsloses) {
        removeStatus("kassatsu");
        // addRecast("ninjutsu", statusGroups.targetID, recast.ninjutsu);
        // clearTimeout(timeout.ninjutsu);
        // timeout.ninjutsu = setTimeout(ninNinjutsu, recast.ninjutsu - 1000);
      }
    }

    else if ("Ten Chi Jin" == statusGroups.statusname) {
      if ("gains" == statusGroups.gainsloses) {
        addStatus("tenchijin", parseInt(statusGroups.duration) * 1000);
      }
      else if ("loses" == statusGroups.gainsloses) {
        removeStatus("tenchijin");
        // addRecast("ninjutsu", statusGroups.targetID, recast.ninjutsu);
        // clearTimeout(timeout.ninjutsu);
        // timeout.ninjutsu = setTimeout(ninNinjutsu, recast.ninjutsu - 1000);
      }
    }
  }

  else {
    if ("Shadow Fang" == statusGroups.statusname) {
      if ("gains" == statusGroups.gainsloses) {
        addStatus("shadowfang", parseInt(statusGroups.duration) * 1000, statusGroups.targetID);
        if (target.ID == statusGroups.targetID) {  // Might be possible to switch targets between application to target and log entry
          addCountdownBar("shadowfang", checkStatus("shadowfang", target.ID));
        }
      }
      else if ("loses" == statusGroups.gainsloses) {
        removeStatus("shadowfang", statusGroups.targetID);
      }
    }
  }
}

function ninCombo() {

  delete toggle.combo;
  removeIcon("spinningedge");
  removeIcon("gustslash");
  removeIcon("aeolianedge");

  if (player.level >= 38
  && count.aoe <= 3
  && checkStatus("shadowfang", target.ID) < 9000) {
    ninShadowFangCombo();
  }
  else if (player.level >= 38
  && count.aoe >= 3
  && player.jobDetail.hutonMilliseconds > 3000) {
    ninHakkeMujinsatsuCombo();
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

function ninNinjutsu() {

  if (player.level >= 70) {
    if (checkRecast("trickattack") < checkRecast("tenchijin") + 20000) {
      addCountdownBar("tenchijin", checkRecast("tenchijin"), "SUITON");
    }
    else {
      removeCountdownBar("tenchijin");  // Maybe explore this another day
    }
  }

  if (player.level >= 45
  && player.jobDetail.hutonMilliseconds == 0
  && Math.max(checkStatus("kassatsu"), checkStatus("tenchijin")) < 0) {
    icon.ninjutsu3 = icon.huton;
    addIcon("ninjutsu3"); // Huton if down and no damage buffs
  }
  else if (player.level >= 45
  && player.level < 54  // No AC
  && player.jobDetail.hutonMilliseconds < 23000) {
    icon.ninjutsu3 = icon.huton;
    addIcon("ninjutsu3");  // Huton if Huton is low (and no AC yet)
  }
  else if (player.level >= 35
  && count.aoe >= 3
  && checkStatus("tenchijin") < 0) {
    icon.ninjutsu3 = icon.katon;
    addIcon("ninjutsu3"); // Probably more damage at 3 targets to do Katon than anything else...
  }
  else if (player.level >= 45
  && checkStatus("suiton", player.ID) < 0
  && checkRecast("trickattack") < 21000
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
  && count.aoe >= 2) {
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
    if (player.level >= 80
    && checkRecast("bunshin") < 1000) {
      icon.ninkiaction = icon.bunshin;
    }
    else if (player.level >= 68
    && count.aoe == 1) {
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
