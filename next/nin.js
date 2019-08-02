"use strict";

actionList.nin = [

  // Single Target
  "Gust Slash", "Aeolian Edge", "Armor Crush",
  "Raiton", "Bhavacakra", "Hyosho Ranyu",

  // AoE
  "Death Blossom", "Hakke Mujinsatsu",
  "Katon", "Goka Mekkyaku", "Doton",

  // Other
  "Spinning Edge", "Shadow Fang", "Throwing Dagger",
  "Ten", "Chi", "Jin", "Fuma Shuriken", "Hyoton", "Huton", "Suiton",
  "Hellfrog Medium",
  "Hide", "Mug", "Trick Attack", "Kassatsu", "Dream Within A Dream",
  "Assassinate", "Ten Chi Jin",

  // Role
  "True North"
];

function ninJobChange() {

  nextid.tcj1 = 1;
  nextid.tcj2 = 2;
  nextid.tcj3 = 3;
  nextid.ninjutsu = 3;
  nextid.spinningedge = 4;
  nextid.deathblossom = nextid.spinningedge;
  nextid.gustslash = 5;
  nextid.aeolianedge = 6;
  nextid.armorcrush = nextid.aeolianedge;
  nextid.shadowfang = nextid.aeolianedge;
  nextid.hakkemujinsatsu = nextid.spinningedge;
  nextid.tenchijin = 10;
  nextid.hellfrogmedium = 11;
  nextid.bhavacakra = nextid.hellfrogmedium;
  nextid.trickattack = 12;
  nextid.dreamwithinadream = 13;
  nextid.assassinate = 14;

  countdownid.ninjutsu = 0;
  countdownid.suiton = 1;
  countdownid.trickattack = 2;
  countdownid.tenchijin = 3;
  countdownid.dreamwithinadream = 4;

  count.aoe = 1;
  previous.deathblossom = 0;
  previous.hakkemujinsatsu = 0;
  previous.katon = 0; // Includes Goka Mekkyaku
  previous.hellfrogmedium = 0;

  if (player.level >= 56
  && checkCooldown("dreamwithinadream", player.ID) < 0) {
    addIconBlink(nextid.dreamwithinadream, icon.dreamwithinadream);
  }
  else {
    removeIcon(nextid.dreamwithinadream);
  }

  if (player.level >= 70
  && checkCooldown("tenchijin", player.ID) < 0) {
    addIconBlink(nextid.tenchijin, icon.tenchijin);
  }
  else {
    removeIcon(nextid.tenchijin);
  }
  ninCombo();
  ninNinjutsu();
}

function ninAction(logLine) {
  // console.log("Logline")

  if (actionList.nin.indexOf(actionGroups.actionname) > -1) {

    // Everything breaks Mudra "combo" so list it first
    // Not sure if we even need this right now...

    if ("Ten" == actionGroups.actionname) {
      toggle.mudra = toggle.mudra + "T";
      ninMudraCombo();
    }
    else if ("Chi" == actionGroups.actionname) {
      toggle.mudra = toggle.mudra + "C";
      ninMudraCombo();
    }
    else if ("Jin" == actionGroups.actionname) {
      toggle.mudra = toggle.mudra + "J";
      ninMudraCombo();
    }

    else {

      delete toggle.mudra;

      if ("Hide" == actionGroups.actionname) {
        addCooldown("hide", player.ID, recast.hide);
        addCooldown("ninjutsu", player.ID, -1);
        clearTimeout(timeout.ninjutsu);
        ninNinjutsu();
      }

      else if ("Mug" == actionGroups.actionname) {
        // removeIcon(nextid.mug);
        // addCooldown("mug", player.ID, recast.mug);
        addCountdownBar("Mug", 0, recast.mug);
        ninNinki();
      }

      else if ("Trick Attack" == actionGroups.actionname) {
        removeIcon(nextid.trickattack);
        addCooldown("trickattack", player.ID, recast.trickattack);
        addCountdownBar("Trick Attack", countdownid.trickattack, recast.trickattack);
      }

      else if ("Suiton" == actionGroups.actionname) {
        count.aoe = 1;
        addIconBlinkTimeout("trickattack", checkCooldown("trickattack", player.ID), nextid.trickattack, icon.trickattack);
      }

      else if ("Dream Within A Dream" == actionGroups.actionname) {
        removeIcon(nextid.dreamwithinadream);
        addIconBlinkTimeout("dreamwithinadream", recast.dreamwithinadream, nextid.dreamwithinadream, icon.dreamwithinadream);
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
        // removeIcon(nextid.ninjutsu);
      }

      else if ("Kassatsu" == actionGroups.actionname) {

        if (checkCooldown("kassatsu2", player.ID) < 0) {
          addCooldown("kassatsu2", player.ID, recast.kassatsu);
          addCooldown("kassatsu1", player.ID, -1);
        }
        else {
          removeIcon(nextid.kassatsu);
          addCooldown("kassatsu1", player.ID, checkCooldown("kassatsu2", player.ID));
          addCooldown("kassatsu2", player.ID, checkCooldown("kassatsu2", player.ID) + recast.kassatsu);
          addIconBlinkTimeout("kassatsu", checkCooldown("kassatsu1", player.ID), nextid.kassatsu, icon.kassatsu);
        }
        addStatus("kassatsu", player.ID, duration.kassatsu);
        clearTimeout(timeout.ninjutsu);
      }

      else if ("Dream Within A Dream" == actionGroups.actionname) {
        addCooldown("dreamwithinadream", player.ID, recast.dreamwithinadream);
        addStatus("assassinateready", player.ID, duration.assassinateready);
        addIconBlinkTimeout("dreamwithinadream", recast.dreamwithinadream, nextid.dreamwithinadream, icon.dreamwithinadream);
      }

      else if ("Hellfrog Medium" == actionGroups.actionname) {
        if (Date.now() - previous.hellfrogmedium > 1000) {
          previous.hellfrogmedium = Date.now()
          count.aoe = 1;
        }
        else {
          count.aoe = count.aoe + 1;
        }
        removeIcon(nextid.hellfrogmedium);
      }

      else if ("Bhavacakra" == actionGroups.actionname) {
        count.aoe = 1;
        removeIcon(nextid.bhavacakra);
      }

      else if ("Ten Chi Jin" == actionGroups.actionname) {
        removeIcon(nextid.tenchijin);
        addCooldown("tenchijin", player.ID, recast.tenchijin);
        addCooldown("ninjutsu", player.ID, -1);
        addStatus("tenchijin", player.ID, duration.tenchijin);
        clearTimeout(timeout.ninjutsu);
      }

      else { // Weaponskills and combos (hopefully)

        if ("Spinning Edge" == actionGroups.actionname
        && actionGroups.result.length >= 2) {
          if (!next.combo) {
            ninCombo();
          }
          removeIcon(nextid.spinningedge);
        }

        else if ("Gust Slash" == actionGroups.actionname && actionGroups.result.length >= 8) {
          removeIcon(nextid.spinningedge);
          removeIcon(nextid.gustslash);
          if (player.level < 26) {
            ninCombo();
          }
        }

        else if ("Shadow Fang" == actionGroups.actionname && actionGroups.result.length >= 8) {
          addStatus("shadowfang", actionGroups.targetID, duration.shadowfang);
          ninCombo();
        }

        else if ("Death Blossom" == actionGroups.actionname
        && actionGroups.result.length >= 2) {
          if (Date.now() - previous.deathblossom > 1000) {
            previous.deathblossom = Date.now()
            count.aoe = 1;
          }
          else {
            count.aoe = count.aoe + 1;
          }
          removeIcon(nextid.deathblossom);
          if (player.level < 52) {
            ninCombo();
          }
        }

        else if ("Hakke Mujinsatsu" == actionGroups.actionname
        && actionGroups.result.length == 8) {
          if (Date.now() - previous.hakkemujinsatsu > 1000) {
            previous.hakkemujinsatsu = Date.now()
            count.aoe = 1;
          }
          else {
            count.aoe = count.aoe + 1;
          }
          ninCombo();
        }

        else {
          ninCombo();
        }

        // Check Ninki after all GCD actions?
        if (player.level >= 62) {
          ninNinki();
        }
      }
    }
  }
}

function ninStatus() {
  // console.log("Status")
  if (statusGroups.targetID == player.ID) {

    if ("Mudra" == statusGroups.statusname) {
      if ("gains" == statusGroups.gainsloses) {
        addStatus("mudra", statusGroups.targetID, parseInt(statusGroups.duration) * 1000);
      }
      else if ("loses" == statusGroups.gainsloses) {
        removeIcon(nextid.ninjutsu);
        removeStatus("mudra", player.ID);
        addCooldown("ninjutsu", statusGroups.targetID, recast.ninjutsu);
        clearTimeout(timeout.ninjutsu);
        timeout.ninjutsu = setTimeout(ninNinjutsu, recast.ninjutsu - 1000);
      }
    }

    else if ("Doton" == statusGroups.statusname) {
      if ("gains" == statusGroups.gainsloses) {
        addStatus("doton", statusGroups.targetID, parseInt(statusGroups.duration) * 1000);
      }
      else if ("loses" == statusGroups.gainsloses) {
        removeStatus("doton", statusGroups.targetID);
      }
    }

    else if ("Suiton" == statusGroups.statusname) {
      if ("gains" == statusGroups.gainsloses) {
        addStatus("suiton", statusGroups.targetID, parseInt(statusGroups.duration) * 1000);
      }
      else if ("loses" == statusGroups.gainsloses) {
        clearTimeout(timeout.trickattack);
        removeIcon(nextid.trickattack);
        removeStatus("suiton", statusGroups.targetID);
      }
    }

    else if ("Kassatsu" == statusGroups.statusname) {
      if ("gains" == statusGroups.gainsloses) {
        addStatus("kassatsu", statusGroups.targetID, parseInt(statusGroups.duration) * 1000);
        ninKassatsu();
      }
      else if ("loses" == statusGroups.gainsloses) {
        removeStatus("kassatsu", statusGroups.targetID);
        addCooldown("ninjutsu", statusGroups.targetID, recast.ninjutsu);
        clearTimeout(timeout.ninjutsu);
        timeout.ninjutsu = setTimeout(ninNinjutsu, recast.ninjutsu - 1000);
      }
    }

    else if ("Ten Chi Jin" == statusGroups.statusname) {
      if ("gains" == statusGroups.gainsloses) {
        addStatus("tenchijin", statusGroups.targetID, parseInt(statusGroups.duration) * 1000);
        ninTCJ();
      }
      else if ("loses" == statusGroups.gainsloses) {
        removeStatus("tenchijin", statusGroups.targetID);
        addCooldown("ninjutsu", statusGroups.targetID, recast.ninjutsu);
        clearTimeout(timeout.ninjutsu);
        timeout.ninjutsu = setTimeout(ninNinjutsu, recast.ninjutsu - 1000);
      }
    }
  }

  else {
    if ("Shadow Fang" == statusGroups.statusname) {
      if ("gains" == statusGroups.gainsloses) {
        addStatus("shadowfang", statusGroups.targetID, parseInt(statusGroups.duration) * 1000);
      }
      else if ("loses" == statusGroups.gainsloses) {
        removeStatus("shadowfang", statusGroups.targetID);
      }
    }
  }
}

function ninCombo() {

  removeIcon(nextid.spinningedge);
  removeIcon(nextid.gustslash);
  removeIcon(nextid.aeolianedge);

  if (player.level >= 38
  && count.aoe >= 3
  && player.jobDetail.hutonMilliseconds > 0) {
    next.combo = 4;
    ninHakkeMujinsatsuCombo();
  }
  else if (player.level >= 54
  && player.jobDetail.hutonMilliseconds > 0
  && player.jobDetail.hutonMilliseconds < 35000) {
    next.combo = 3;
    ninArmorCrushCombo();
  }
  else if (player.level >= 38
  && checkStatus("shadowfang", target.ID) < 9000) {
    next.combo = 2;
    ninShadowFangCombo();
  }
  else {
    next.combo = 1;
    ninAeolianEdgeCombo();
  }
}

function ninAeolianEdgeCombo() {
  addIcon(nextid.spinningedge, icon.spinningedge);
  addIcon(nextid.gustslash, icon.gustslash);
  if (player.level >= 26) {
    addIcon(nextid.aeolianedge, icon.aeolianedge);
  }
}

function ninShadowFangCombo() {
  addIcon(nextid.spinningedge, icon.spinningedge);
  addIcon(nextid.shadowfang, icon.shadowfang);
}

function ninArmorCrushCombo() {
  addIcon(nextid.spinningedge, icon.spinningedge);
  addIcon(nextid.gustslash, icon.gustslash);
  addIcon(nextid.armorcrush, icon.armorcrush);
}

function ninHakkeMujinsatsuCombo() {
  addIcon(nextid.deathblossom, icon.deathblossom);
  if (player.level >= 52) {
    addIcon(nextid.hakkemujinsatsu, icon.hakkemujinsatsu);
  }
}

function ninNinjutsu() { // Activate between GCDs?

  if (player.level >= 45
  && player.jobDetail.hutonMilliseconds == 0) {
    addIconBlink(nextid.ninjutsu, icon.huton); // Apply Huton if off
  }
  else if (player.level >= 45
  && player.level < 54
  && player.jobDetail.hutonMilliseconds < 23000) {
    addIconBlink(nextid.ninjutsu, icon.huton); // Apply Huton if low (and no AC yet)
  }
  else if (player.level >= 35
  && count.aoe >= 3) {
    addIconBlink(nextid.ninjutsu, icon.katon); // Probably more damage at 3 targets to do Katon than anything else...
  }
  else if (player.level >= 45
  && checkStatus("suiton", player.ID) < 0
  && checkCooldown("trickattack", player.ID) < 22000) {
    if (player.level >= 70
    && checkCooldown("tenchijin", player.ID) < 2000) { // Use TCJ to set up
      if (player.level >= 35
      && count.aoe >= 2) {
        addIconBlink(nextid.ninjutsu, icon.katon);
      }
      else if (player.level >= 35) {
        addIconBlink(nextid.ninjutsu, icon.raiton);
      }
    }
    else {
      addIconBlink(nextid.ninjutsu, icon.suiton); // Prep for normal Suiton Trick
    }
  }
  else if (player.level >= 35
  && count.aoe >= 2) {
    addIconBlink(nextid.ninjutsu, icon.katon);
  }
  else if (player.level >= 35) {
    addIconBlink(nextid.ninjutsu, icon.raiton);
  }
  else if (player.level >= 30) {
    addIconBlink(nextid.ninjutsu, icon.fumashuriken);
  }
  else {
    removeIcon(nextid.ninjutsu);
  }
}

function ninKassatsu() {

  if (checkStatus("suiton", player.ID) < 0
  && checkCooldown("trickattack", player.ID) < 22000) {
    addIconBlink(nextid.ninjutsu, icon.suiton);
  }
  else if (count.aoe >= 2) {
    addIconBlink(nextid.ninjutsu, icon.katon);
  }
  else if (player.level >= 76) {
    addIconBlink(nextid.ninjutsu, icon.hyoton);
  }
  else {
    addIconBlink(nextid.ninjutsu, icon.raiton);
  }
}

function ninTCJ() { // Activate between GCDs?

  if (checkCooldown("trickattack", player.ID) < 22000
  && checkStatus("suiton", player.ID) < 0) {
    addIconBlink(nextid.ninjutsu, icon.suiton);
  }
  else {
    addIconBlink(nextid.ninjutsu, icon.doton);
  }
}

function ninMudraCombo() {

  if (checkStatus("kassatsu", player.ID) > 5000) {
    icon.katon = icon.gokamekkyaku;
    icon.hyoton = icon.hyoshoranyu;
  }
  else {
    icon.katon = "002908";
    icon.hyoton = "002909";
  }

  if (toggle.mudra.length == 1) {
    // Fuma Shuriken
  }
  else if (["CT", "JT"].indexOf(toggle.mudra) > -1) {
    // Katon
  }
  else if (["TC", "JC"].indexOf(toggle.mudra) > -1) {
    // Raiton
  }
  else if (["TJ", "CJ"].indexOf(toggle.mudra) > -1) {
    // Hyoton
  }
  else if (["JCT", "CJT"].indexOf(toggle.mudra) > -1) {
    // Huton
  }
  else if (["TJC", "JTC"].indexOf(toggle.mudra) > -1) {
    // Doton
  }
  else if (["TCJ", "CTJ"].indexOf(toggle.mudra) > -1) {
    // Suiton
  }
  else {
    // Rabbit
  }
}

function ninNinki() {

  // Since NIN gains ninki based on weaponskills now, can just run this function after weaponskills
  if (player.jobDetail.ninkiAmount >= 80) {

    if (player.level >= 80
    && checkCooldown("bunshin", player.ID) < 0) {
      addIcon(nextid.bunshin,icon.bunshin);
    }
    else if (player.level >= 68
    && count.aoe == 1) {
      addIcon(nextid.bhavacakra,icon.bhavacakra);
    }
    else {
      addIcon(nextid.hellfrogmedium,icon.hellfrogmedium);
    }
  }
  else {
    removeIcon(nextid.hellfrogmedium);
  }
}
