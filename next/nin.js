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
  && checkCooldown("dreamwithinadream") < 0) {
    addIconBlink(nextid.dreamwithinadream, icon.dreamwithinadream);
  }
  else {
    removeIcon("dreamwithinadream");
  }

  if (player.level >= 70
  && checkCooldown("tenchijin") < 0) {
    addIconBlink(nextid.tenchijin, icon.tenchijin);
  }
  else {
    removeIcon("tenchijin");
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
        addCooldown("hide");
        addCooldown("ninjutsu", player.ID, -1);
        clearTimeout(timeout.ninjutsu);
        ninNinjutsu();
      }

      else if ("Mug" == actionGroups.actionname) {
        // removeIcon("mug");
        // addCooldown("mug");
        addCountdownBar("Mug", 0, recast.mug);
        ninNinki();
      }

      else if ("Trick Attack" == actionGroups.actionname) {
        removeIcon("trickattack");
        addCooldown("trickattack");
        addCountdownBar("Trick Attack", countdownid.trickattack, recast.trickattack);
      }

      else if ("Suiton" == actionGroups.actionname) {
        count.aoe = 1;
        addIconBlinkTimeout("trickattack", checkCooldown("trickattack"), nextid.trickattack, icon.trickattack);
      }

      else if ("Dream Within A Dream" == actionGroups.actionname) {
        removeIcon("dreamwithinadream");
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
        // removeIcon("ninjutsu");
      }

      else if ("Kassatsu" == actionGroups.actionname) {

        if (checkCooldown("kassatsu2", player.ID) < 0) {
          addCooldown("kassatsu2", player.ID, recast.kassatsu);
          addCooldown("kassatsu1", player.ID, -1);
        }
        else {
          removeIcon("kassatsu");
          addCooldown("kassatsu1", player.ID, checkCooldown("kassatsu2", player.ID));
          addCooldown("kassatsu2", player.ID, checkCooldown("kassatsu2", player.ID) + recast.kassatsu);
          addIconBlinkTimeout("kassatsu", checkCooldown("kassatsu1", player.ID), nextid.kassatsu, icon.kassatsu);
        }
        addStatus("kassatsu");
        clearTimeout(timeout.ninjutsu);
      }

      else if ("Dream Within A Dream" == actionGroups.actionname) {
        addCooldown("dreamwithinadream");
        addStatus("assassinateready");
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
        removeIcon("hellfrogmedium");
      }

      else if ("Bhavacakra" == actionGroups.actionname) {
        count.aoe = 1;
        removeIcon("bhavacakra");
      }

      else if ("Ten Chi Jin" == actionGroups.actionname) {
        removeIcon("tenchijin");
        addCooldown("tenchijin");
        addCooldown("ninjutsu", player.ID, -1);
        addStatus("tenchijin");
        clearTimeout(timeout.ninjutsu);
      }

      else { // Weaponskills and combos (hopefully)

        if ("Spinning Edge" == actionGroups.actionname
        && actionGroups.result.length >= 2) {
          if (!next.combo) {
            ninCombo();
          }
          removeIcon("spinningedge");
        }

        else if ("Gust Slash" == actionGroups.actionname && actionGroups.result.length >= 8) {
          removeIcon("spinningedge");
          removeIcon("gustslash");
          if (player.level < 26) {
            ninCombo();
          }
        }

        else if ("Shadow Fang" == actionGroups.actionname && actionGroups.result.length >= 8) {
          addStatus("shadowfang", duration.shadowfang, actionGroups.targetID);
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
          removeIcon("deathblossom");
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
        addStatus("mudra", parseInt(statusGroups.duration) * 1000, statusGroups.targetID);
      }
      else if ("loses" == statusGroups.gainsloses) {
        removeIcon("ninjutsu");
        removeStatus("mudra");
        addCooldown("ninjutsu", statusGroups.targetID, recast.ninjutsu);
        clearTimeout(timeout.ninjutsu);
        timeout.ninjutsu = setTimeout(ninNinjutsu, recast.ninjutsu - 1000);
      }
    }

    else if ("Doton" == statusGroups.statusname) {
      if ("gains" == statusGroups.gainsloses) {
        addStatus("doton", parseInt(statusGroups.duration) * 1000, statusGroups.targetID);
      }
      else if ("loses" == statusGroups.gainsloses) {
        removeStatus("doton", statusGroups.targetID);
      }
    }

    else if ("Suiton" == statusGroups.statusname) {
      if ("gains" == statusGroups.gainsloses) {
        addStatus("suiton", parseInt(statusGroups.duration) * 1000, statusGroups.targetID);
      }
      else if ("loses" == statusGroups.gainsloses) {
        clearTimeout(timeout.trickattack);
        removeIcon("trickattack");
        removeStatus("suiton", statusGroups.targetID);
      }
    }

    else if ("Kassatsu" == statusGroups.statusname) {
      if ("gains" == statusGroups.gainsloses) {
        addStatus("kassatsu", parseInt(statusGroups.duration) * 1000, statusGroups.targetID);
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
        addStatus("tenchijin", parseInt(statusGroups.duration) * 1000, statusGroups.targetID);
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
        addStatus("shadowfang", parseInt(statusGroups.duration) * 1000, statusGroups.targetID);
      }
      else if ("loses" == statusGroups.gainsloses) {
        removeStatus("shadowfang", statusGroups.targetID);
      }
    }
  }
}

function ninCombo() {

  removeIcon("spinningedge");
  removeIcon("gustslash");
  removeIcon("aeolianedge");

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
  addIcon("spinningedge");
  addIcon("gustslash");
  if (player.level >= 26) {
    addIcon("aeolianedge");
  }
}

function ninShadowFangCombo() {
  addIcon("spinningedge");
  addIcon("shadowfang");
}

function ninArmorCrushCombo() {
  addIcon("spinningedge");
  addIcon("gustslash");
  addIcon("armorcrush");
}

function ninHakkeMujinsatsuCombo() {
  addIcon("deathblossom");
  if (player.level >= 52) {
    addIcon("hakkemujinsatsu");
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
  && checkCooldown("trickattack") < 22000) {
    if (player.level >= 70
    && checkCooldown("tenchijin") < 2000) { // Use TCJ to set up
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
    removeIcon("ninjutsu");
  }
}

function ninKassatsu() {

  if (checkStatus("suiton", player.ID) < 0
  && checkCooldown("trickattack") < 22000) {
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

  if (checkCooldown("trickattack") < 22000
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
    && checkCooldown("bunshin") < 0) {
      addIcon("bunshin");
    }
    else if (player.level >= 68
    && count.aoe == 1) {
      addIcon("bhavacakra");
    }
    else {
      addIcon("hellfrogmedium");
    }
  }
  else {
    removeIcon("hellfrogmedium");
  }
}
