"use strict";

// To do: clearer indication of when TCJ / Mudra is active



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

function ninOnAction(actionMatch) {
  const ninActions = [

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
  // console.log("Logline")

  if (ninActions.indexOf(actionMatch.groups.actionName) > -1) {

    // Everything breaks Mudra "combo" so list it first
    // Not sure what to do with this

    if ("Ten" == actionMatch.groups.actionName) {
      // toggle.mudra = toggle.mudra + "T";
      // ninMudraCombo();
    }
    else if ("Chi" == actionMatch.groups.actionName) {
      // toggle.mudra = toggle.mudra + "C";
      // ninMudraCombo();
    }
    else if ("Jin" == actionMatch.groups.actionName) {
      // toggle.mudra = toggle.mudra + "J";
      // ninMudraCombo();
    }

    else { // Off-GCD actions

      delete toggle.mudra;

      if ("Hide" == actionMatch.groups.actionName) {
        removeIcon("tenchijin");
        addRecast("hide");
        addRecast("ninjutsu", -1);
        addCountdownBar({name: "ninjutsu", time: -1});
        clearTimeout(timeout.ninjutsu);
        ninNinjutsu();
      }

      else if ("Mug" == actionMatch.groups.actionName) {
        ninNinki();
      }

      else if ("Trick Attack" == actionMatch.groups.actionName) {
        addCountdownBar({name: "trickattack"});
      }

      else if (["Raiton", "Hyosho Ranyu"].indexOf(actionMatch.groups.actionName) > -1) {
        count.targets = 1;
      }

      else if (["Katon", "Goka Mekkyaku"].indexOf(actionMatch.groups.actionName) > -1) {
        if (Date.now() - previous.katon > 1000) {
          previous.katon = Date.now()
          count.targets = 1;
        }
        else {
          count.targets = count.targets + 1;
        }
      }

      else if ("Suiton" == actionMatch.groups.actionName) {
        addStatus("suiton");
      }

      else if ("Kassatsu" == actionMatch.groups.actionName) {

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

      else if ("Dream Within A Dream" == actionMatch.groups.actionName) {
        removeIcon("dreamwithinadream");
        addCountdownBar({name: "dreamwithinadream", time: recast.dreamwithinadream, oncomplete: "addIcon"});
        addStatus("assassinateready");
      }

      else if ("Hellfrog Medium" == actionMatch.groups.actionName) {
        if (Date.now() - previous.hellfrogmedium > 1000) {
          previous.hellfrogmedium = Date.now()
          count.targets = 1;
        }
        else {
          count.targets = count.targets + 1;
        }
        ninNinki();
      }

      else if ("Bhavacakra" == actionMatch.groups.actionName) {
        count.targets = 1;
        ninNinki();
      }

      else if ("Ten Chi Jin" == actionMatch.groups.actionName) {
        removeIcon("tenchijin");
        addStatus("tenchijin");
        addCountdownBar({name: "tenchijin"});
        addRecast("ninjutsu", -1);
        addCountdownBar({name: "ninjutsu", time: -1});
        clearTimeout(timeout.ninjutsu);
        ninNinjutsu();
      }

      else if ("Meisui" == actionMatch.groups.actionName) {
        addCountdownBar({name: "meisui"});
        ninNinki();
      }

      else { // Weaponskills and combos (hopefully)

        if ("Spinning Edge" == actionMatch.groups.actionName
        && actionMatch.groups.result.length >= 2) {

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

        else if ("Gust Slash" == actionMatch.groups.actionName
        && actionMatch.groups.result.length >= 8) {

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

        else if ("Shadow Fang" == actionMatch.groups.actionName
        && actionMatch.groups.result.length >= 8) {
          addStatus("shadowfang", duration.shadowfang, actionMatch.groups.targetID);
          ninCombo();
        }

        else if ("Death Blossom" == actionMatch.groups.actionName
        && actionMatch.groups.result.length >= 2) {

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

        else if ("Hakke Mujinsatsu" == actionMatch.groups.actionName
        && actionMatch.groups.result.length == 8) {

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