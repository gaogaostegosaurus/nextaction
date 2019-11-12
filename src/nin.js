'use strict';

// To do: clearer indication of when TCJ / Mudra is active


const ninActions = [
  // Off GCD
  'Shade Shift', 'Hide', 'Mug', 'Trick Attack', 'Shukuchi', 'Kassatsu', 'Dream Within A Dream',
  'Assassinate', 'Hellfrog Medium', 'Bhavacakra', 'Ten Chi Jin', 'Meisui', 'Bunshin',

  // GCD
  'Spinning Edge', 'Gust Slash', 'Shadow Fang', 'Throwing Dagger', 'Aeolian Edge', 'Armor Crush',
  'Death Blossom', 'Hakke Mujinsatsu',

  // Ninjutsu
  'Ninjutsu', 'Fuma Shuriken', 'Katon', 'Raiton', 'Hyoton', 'Huton', 'Doton', 'Suiton',
  'Goka Mekkyaku', 'Hyosho Ranyu',
  // Code currently doesn't use mudra or most ninjutsu for decision-making
  // "Ten", "Chi", "Jin", "Fuma Shuriken",  "Hyoton", "Huton", "Doton",

  // Role
  'Second Wind', 'Leg Sweep', 'Bloodbath', 'Feint', 'Arm\'s Length', 'True North',
];

const ninPushWeave = ({
  array = actionArray,
} = {}) => {
  if (player.level >= 45 && next.suitonStatus - next.elapsedTime > 0
    && next.suitonStatus - next.elapsedTime < 10000
    && next.trickattackRecast - next.elapsedTime < 0) {
    array.push({ name: 'trickattack', img: 'trickattack', size: 'small' });
    next.trickattackRecast = recast.trickattack + next.elapsedTime;
    next.suitonStatus = 0;
  } else if (player.level >= 60 && next.trickattackRecast - next.elapsedTime > 45000
    && next.assassinatereadyStatus - next.elapsedTime > 0) {
    array.push({ name: 'assassinate', img: 'assassinate', size: 'small' });
    next.assassinatereadyStatus = -1;
  } else if (player.level >= 56 && next.trickattackRecast - next.elapsedTime > 50000
    && next.dreamwithinadreamRecast - next.elapsedTime > 0) {
    array.push({ name: 'dreamwithinadream', img: 'dreamwithinadream', size: 'small' });
    next.dreamwithinadreamRecast = recast.dreamwithinadream + next.elapsedTime;
    next.assassinatereadyStatus = 15000 + next.elapsedTime;
  } else if (player.level >= 80 && next.ninki >= 50
    && next.trickattackRecast - next.elapsedTime < 10000
    && next.bunshinRecast - next.elapsedTime < 0) {
    array.push({ name: 'bunshin', img: 'bunshin', size: 'small' });
    next.bunshinRecast = recast.bunshin + next.elapsedTime;
    next.ninki -= 50;
  } else if (player.level >= 70 && next.trickattackRecast - next.elapsedTime > 50000
    && next.tenchijinRecast - next.elapsedTime < 0) {
    array.push({ name: 'tenchijin', img: 'tenchijin', size: 'small' });
    next.tenchijinRecast = recast.tenchijin + next.elapsedTime;
    next.tenchijinStatus = 6000 + next.elapsedTime;
    ninPushNinjutsu();
  } else if (player.level >= 50 && next.trickattackRecast - next.elapsedTime < 20000
    && next.suitonStatus - next.elapsedTime > 0
    && next.kassatsuRecast - next.elapsedTime < 0) {
    array.push({ name: 'kassatsu', img: 'kassatsu', size: 'small' });
    next.kassatsuRecast = recast.kassatsu + next.elapsedTime;
    next.kassatsuStatus = 20000 + next.elapsedTime;
  } else if (player.level >= 80 && next.ninki >= 50
    && next.trickattackRecast - next.elapsedTime > 15000
    && next.bunshinRecast - next.elapsedTime < 0) {
    // Adjust this time later
    array.push({ name: 'bunshin', img: 'bunshin', size: 'small' });
    next.bunshinRecast = recast.bunshin + next.elapsedTime;
    next.ninki -= 50;
  } else if (player.level >= 68 && next.ninki >= 50 && count.targets === 1) {
    array.push({ name: 'bhavacakra', img: 'bhavacakra', size: 'small' });
    next.ninki -= 50;
  } else if (player.level >= 62 && next.ninki >= 50 && count.targets > 1) {
    array.push({ name: 'hellfrogmedium', img: 'hellfrogmedium', size: 'small' });
    next.ninki -= 50;
  } else if (player.level >= 72 && next.ninki <= 40 && next.suitonStatus - next.elapsedTime > 0
    && next.meisuiRecast - next.elapsedTime < 0) {
    array.push({ name: 'meisui', img: 'meisui', size: 'small' });
    next.meisuiRecast = recast.meisui + next.elapsedTime;
    next.suitonStatus = 0;
    next.ninki = Math.min(next.ninki + 50, 100);
  } else if (player.level >= 66 && next.mugRecast - next.elapsedTime < 0) {
    array.push({ name: 'mug', img: 'mug', size: 'small' });
    next.mugRecast = recast.mug + next.elapsedTime;
    next.ninki = Math.min(next.ninki + 40, 100);
  } else if (player.level < 66 && next.mugRecast - next.elapsedTime < 0) {
    array.push({ name: 'mug', img: 'mug', size: 'small' });
    next.mugRecast = recast.mug + next.elapsedTime;
  }
};

const ninPushNinjutsu = ({
  array = actionArray,
} = {}) => {
  if (next.mudra1Recast - next.elapsedTime < 0 && next.huton + next.elapsedTime < 500 * 3) {
    // Huton if it is not active
    ninPushHuton();
    next.elapsedTime += 500 * 3 + 1500;
    next.huton += 70000 + next.elapsedTime;
    ninPushWeave();
  } else if (next.mudra2Recast - next.elapsedTime < 500 * 3 + 1500) {
    // Prevent Mudra from sitting at 2 stacks
    if (player.level >= 45 && next.trickattackRecast - next.elapsedTime < 20000 + 500 * 3 + 1500) {
      // Suiton for upcoming Trick
      ninPushSuiton();
      next.elapsedTime += 500 * 3 + 1500;
      next.suitonStatus = 20000 + next.elapsedTime;
      ninPushWeave();
    } else if (player.level >= 72
      && next.meisuiRecast - next.elapsedTime < 20000 + 500 * 3 + 1500) {
      // Suiton for upcoming Meisui
      ninPushSuiton();
      next.elapsedTime += 500 * 3 + 1500;
      next.suitonStatus = 20000 + next.elapsedTime;
      ninPushWeave();
    } else if (player.level >= 35 && count.targets > 1) {
      // Katon
      ninPushKaton();
      next.elapsedTime += 500 * 2 + 1500;
      ninPushWeave();
    } else if (player.level >= 35 && count.targets > 1) {
      // Katon
      ninPushRaiton();
      next.elapsedTime += 500 * 2 + 1500;
      ninPushWeave();
    } else {
      // Katon
      ninPushFumaShuriken();
      next.elapsedTime += 500 * 2 + 1500;
      ninPushWeave();
    }
  } else if (next.tenchijinStatus - next.elapsedTime > 0) {
    if (player.level >= 45
    && next.trickattackRecast - next.elapsedTime < 20000 + 500 * 3) {
      ninPushSuiton();
      next.elapsedTime += 500 * 3 + 1500;
      next.suitonStatus = 20000 + next.elapsedTime;
      ninPushWeave();
    } else if (player.level >= 72
      && next.meisuiRecast - next.elapsedTime < 20000 + 500 * 3) {
      ninPushSuiton();
      next.elapsedTime += 500 * 3 + 1500;
      next.suitonStatus = 20000 + next.elapsedTime;
      ninPushWeave();
    }
  } else if (next.kassatsuStatus - next.elapsedTime > 0) {
    if (next.trickattackRecast - next.elapsedTime > 45000 + 500 * 2 + 1500) {
      if (player.level >= 76 && count.targets > 1) {
        ninPushGokaMekkyaku();
        next.elapsedTime += 500 * 2 + 1500;
        ninPushWeave();
      } else if (player.level >= 76) {
        ninPushHyoshoRanyu();
        next.elapsedTime += 500 * 2 + 1500;
        ninPushWeave();
      } else if (count.targets > 1) {
        ninPushKaton();
        next.elapsedTime += 500 * 2 + 1500;
        ninPushWeave();
      } else {
        ninPushRaiton();
        next.elapsedTime += 500 * 2 + 1500;
        ninPushWeave();
      }
      next.kassatsuStatus = 0;
    }
  } else if (next.mudra1Recast - next.elapsedTime < 0) {
    if (player.level >= 45
      && next.trickattackRecast - next.elapsedTime < 20000 + 500 * 3) {
      ninPushSuiton();
      next.elapsedTime += 500 * 3 + 1500;
      next.suitonStatus = 20000 + next.elapsedTime;
    } else if (player.level >= 56
      && next.huton - next.elapsedTime === 0) {
      ninPushSuiton();
      next.elapsedTime += 500 * 3 + 1500;
      next.huton = 70000 + next.elapsedTime;
    } else if (player.level >= 72
      && next.meisuiRecast - next.elapsedTime < 20000 + 500 * 3) {
      ninPushSuiton();
      next.elapsedTime += 500 * 3 + 1500;
      next.suitonStatus = 20000 + next.elapsedTime;
    } else if (player.level >= 35 && count.targets === 1
      && next.trickattackRecast - next.elapsedTime > 45000 + 500 * 2) {
      ninPushRaiton();
      next.elapsedTime += 500 * 2 + 1500;
    } else if (player.level >= 35 && count.targets === 1
      && next.mudra2Recast - next.elapsedTime < 500 * 2 + 1500) {
      ninPushRaiton();
      next.elapsedTime += 500 * 2 + 1500;
    } else if (player.level >= 35 && count.targets > 1) {
      ninPushKaton();
      next.elapsedTime += 500 * 2 + 1500;
    } else if (player.level >= 30) {
      ninPushFumaShuriken();
      next.elapsedTime += 500 * 1 + 1500;
    }

    if (next.tenchijinStatus - next.elapsedTime > 0) {
      next.tenchijinStatus = 0;
    } else if (next.kassatsuStatus - next.elapsedTime > 0) {
    } else if (next.mudra2Recast < 0) {
      next.mudra2Recast = recast.mudra2 + next.elapsedTime;
    } else {
      next.mudra1Recast = next.mudra2Recast;
      next.mudra2Recast = next.mudra2Recast + recast.mudra2 + next.elapsedTime;
    }

    ninPushWeave();
  }
};

const ninPushMelee = ({
  array = actionArray,
} = {}) => {
  ninPushNinjutsu();
  if (player.level >= 30 && next.trickattackRecast - next.elapsedTime > 45000
    && next.shadowfangRecast - next.elapsedTime < 0) {
    // Apply while trick is up
    array.push({ name: 'shadowfang', img: 'shadowfang' });
    next.shadowfangRecast = recast.shadowfang + next.elapsedTime;
    ninPushWeave();
    next.elapsedTime += recast.gcd;
    next.ninki += 10;
    ninPushNinjutsu();
  } else if (player.level >= 30 && next.trickattackRecast - next.elapsedTime > 6000
    && next.shadowfangRecast - next.elapsedTime < 0) {
    // Apply without trick due to delay
    array.push({ name: 'shadowfang', img: 'shadowfang' });
    next.shadowfangRecast = recast.shadowfang + next.elapsedTime;
    ninPushWeave();
    next.elapsedTime += recast.gcd;
    next.ninki += 10;
    ninPushNinjutsu();
  } else {
    array.push({ name: 'spinningedge', img: 'spinningedge' });
    ninPushNinjutsu();
    next.elapsedTime += recast.gcd;
    next.ninki += 5;
    ninPushWeave();
    array.push({ name: 'gustslash', img: 'gustslash' });
    ninPushWeave();
    next.elapsedTime += recast.gcd;
    next.ninki += 5;
    ninPushNinjutsu();
    if (player.level >= 56 && next.huton < 40000 + recast.gcd * 2
    && next.huton > 0 + recast.gcd * 2) {
      array.push({ name: 'armorcrush', img: 'armorcrush' }); // Add Armor Crush
      ninPushWeave();
      next.elapsedTime += recast.gcd;
      next.ninki += 10;
      ninPushNinjutsu();
    } else if (player.level >= 26) {
      array.push({ name: 'aeolianedge', img: 'aeolianedge' }); // Add Armor Crush
      ninPushWeave();
      next.elapsedTime += recast.gcd;
      next.ninki += 10;
      ninPushNinjutsu();
    }
  }
};

const ninPushFumaShuriken = ({ array = actionArray } = {}) => {
  array.push({ name: 'ten', img: 'ten' });
  array.push({ name: 'fumashuriken', img: 'fumashuriken' });
};

const ninPushKaton = ({ array = actionArray } = {}) => {
  array.push({ name: 'chi', img: 'chi' });
  array.push({ name: 'ten', img: 'ten' });
  array.push({ name: 'katon', img: 'katon' });
};

const ninPushRaiton = ({ array = actionArray } = {}) => {
  array.push({ name: 'ten', img: 'ten' });
  array.push({ name: 'chi', img: 'chi' });
  array.push({ name: 'raiton', img: 'raiton' });
};

const ninPushSuiton = ({ array = actionArray } = {}) => {
  array.push({ name: 'ten', img: 'ten' });
  array.push({ name: 'chi', img: 'chi' });
  array.push({ name: 'jin', img: 'jin' });
  array.push({ name: 'suiton', img: 'suiton' });
};

const ninPushHyoshoRanyu = ({ array = actionArray } = {}) => {
  array.push({ name: 'ten', img: 'ten' });
  array.push({ name: 'jin', img: 'jin' });
  array.push({ name: 'hyoshoranyu', img: 'hyoshoranyu' });
};

const ninPushGokaMekkyaku = ({ array = actionArray } = {}) => {
  array.push({ name: 'chi', img: 'chi' });
  array.push({ name: 'ten', img: 'ten' });
  array.push({ name: 'gokamekkyaku', img: 'gokamekkyaku' });
};

const ninNext = ({
  time = recast.gcd,
} = {}) => {
  //
  let array = actionArray;

  next.shadowfangRecast = checkRecast({ name: 'shadowfang' });
  //
  next.bunshinRecast = checkRecast({ name: 'bunshin' });
  next.meisuiRecast = checkRecast({ name: 'meisui' });
  next.tenchijinRecast = checkRecast({ name: 'tenchijin' });
  next.dreamwithinadreamRecast = checkRecast({ name: 'dreamwithinadream' });
  next.kassatsuRecast = checkRecast({ name: 'kassatsu' });
  next.mudra2Recast = checkRecast({ name: 'mudra2' });
  next.mudra1Recast = checkRecast({ name: 'mudra1' });
  next.trickattackRecast = checkRecast({ name: 'trickattack' });
  next.mugRecast = checkRecast({ name: 'mug' });
  //
  next.assassinatereadyStatus = checkStatus({ name: 'assassinateready' });
  next.kassatsuStatus = checkStatus({ name: 'kassatsu' });
  next.suitonStatus = checkStatus({ name: 'suiton' });
  next.huton = player.jobDetail.hutonMilliseconds;

  next.ninki = player.jobDetail.ninkiAmount;

  next.elapsedTime = time;

  do {
    ninPushNinjutsu();
    ninPushMelee();
    // Adjust all cooldown/status info
  } while (next.elapsedTime < 180000);
  console.log(JSON.stringify(actionArray));
  resyncActions();
};

const ninOnJobChange = () => {

  ninNext();
};

const ninOnTargetChangedEvent = () => {
  if (previous.targetID !== target.ID
  && !toggle.combo) {
    // Prevent this from repeatedly being called on movement, target change-mid combo

    // If not a target then clear things out
    if (target.ID === 0 || target.ID.startsWith('1') || target.ID.startsWith('E')) { // 0 = no target, 1... = player? E... = non-combat NPC?
      removeCountdown('shadowfang');
    } else {
      addCountdown({ name: 'shadowfang', time: checkStatus({ name: 'shadowfang', id: target.ID }), text: target.name });
    }
    previous.targetID = target.ID;
  }
};

function ninOnAction(actionMatch) {

  // console.log("Logline")

    // Everything breaks Mudra "combo" so list it first
    // Not sure what to do with this

    if (['Ten', 'Chi', 'Jin'].indexOf(actionMatch.groups.actionName) > -1) {
      if (!toggle.mudra) {
        toggle.mudra = Date.now();
        if (checkRecast({ name: 'mudra2' }) > 0) {
          addRecast({ name: 'mudra2' });
        } else {
          addRecast({ name: 'mudra1', time: checkRecast({ name: 'mudra2' }) });
          addRecast({ name: 'mudra2', time: checkRecast({ name: 'mudra2' }) + 20000 });
        }
      }
    }
    else { // Off-GCD actions

      delete toggle.mudra;

      if ("Hide" == actionMatch.groups.actionName) {
        removeIcon("tenchijin");
        addRecast("hide");
        addRecast("ninjutsu", -1);
        addCountdown({name: "ninjutsu", time: -1});
        clearTimeout(timeout.ninjutsu);
        ninNinjutsu();
      }

      else if ("Mug" == actionMatch.groups.actionName) {
        ninNinki();
      }

      else if ("Trick Attack" == actionMatch.groups.actionName) {
        addCountdown({name: "trickattack"});
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
          addCountdown({name: "kassatsu", time: checkRecast("kassatsu1"), oncomplete: "addIcon"});
        }

        addCountdown({name: "ninjutsu", time: -1});
        clearTimeout(timeout.ninjutsu);
        ninNinjutsu();
      }

      else if ("Dream Within A Dream" == actionMatch.groups.actionName) {
        removeIcon("dreamwithinadream");
        addCountdown({name: "dreamwithinadream", time: recast.dreamwithinadream, oncomplete: "addIcon"});
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
        addCountdown({name: "tenchijin"});
        addRecast("ninjutsu", -1);
        addCountdown({name: "ninjutsu", time: -1});
        clearTimeout(timeout.ninjutsu);
        ninNinjutsu();
      }

      else if ("Meisui" == actionMatch.groups.actionName) {
        addCountdown({name: "meisui"});
        ninNinki();
      }

      else { // Weaponskills and combos (hopefully)

        if (actionMatch.groups.actionName == "Spinning Edge"
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
        addCountdown({name: "ninjutsu"});
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
          addCountdown({name: "shadowfang", time: checkStatus("shadowfang"), text: target.ID});
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
  addCountdown({name: "ninjutsu"});
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
      addCountdown({name: "tenchijin", time: checkRecast("tenchijin"), text: "SUITON"});
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
