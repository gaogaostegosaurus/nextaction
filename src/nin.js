
nextActionOverlay.statusList.NIN = [
  'Shade Shift', 'Shadow Fang', 'Kassatsu', 'Assassinate Ready', 'Ten Chi Jin', 'Bunshin',
  'Mudra', 'Doton', 'Suiton',
  'Bloodbath', 'Feint', 'Arm\'s Length', 'True North',
];

nextActionOverlay.actionList.NIN = [];

nextActionOverlay.actionList.NIN.weaponskills = [
  'Spinning Edge', 'Gust Slash', 'Aeolian Edge', 'Armor Crush',
  'Death Blossom', 'Hakke Mujinsatsu',
  'Throwing Dagger',
  'Shadow Fang',
];

nextActionOverlay.actionList.NIN.mudra = [
  'Ten', 'Chi', 'Jin',
];

nextActionOverlay.actionList.NIN.ninjutsu = [
  'Fuma Shuriken', 'Katon', 'Raiton', 'Hyoton', 'Huton', 'Doton', 'Suiton',
  'Rabbit Medium',
  'Goka Mekkyaku', 'Hyosho Ranryu',
];

nextActionOverlay.actionList.NIN.abilities = [
  'Shade Shift', 'Hide', 'Mug', 'Shukuchi', 'Dream Within A Dream', 'Assassinate',
  'Kassatsu', 'Ten Chi Jin',
  'Trick Attack', 'Meisui',
  'Hellfrog Medium', 'Bhavacakra', 'Bunshin',
  'Second Wind', 'Leg Sweep', 'Bloodbath', 'Feint', 'Arm\'s Length', 'True North',
];

nextActionOverlay.onJobChange.NIN = () => {
  const playerData = nextActionOverlay.playerData;
  playerData.ninjutsuCount = 0;
  playerData.mudraCount = 0;

  const recast = nextActionOverlay.recast;
  recast.shadeshift = 120000;
  recast.hide = 20000;
  recast.mug = 120000;
  recast.trickattack = 60000;
  recast.shadowfang = 70000;
  recast.mudra1 = 20000;
  recast.mudra2 = recast.mudra1;
  recast.shukuchi1 = 60000;
  recast.shukuchi2 = 60000;
  recast.kassatsu = 60000;
  recast.dreamwithinadream = 60000;
  recast.tenchijin = 120000;
  recast.meisui = 120000;
  recast.bunshin = 90000;

  const duration = nextActionOverlay.duration;
  duration.trickattack = 15000;
  duration.shadowfang = 30000;
  duration.mudra = 6000;
  duration.huton = 70000;
  duration.doton = 24000;
  duration.suiton = 20000;
  duration.kassatsu = 15000;
  duration.armorcrush = 30000;
  duration.assassinateready = 15000;
  duration.hakkemujinsatsu = 10000;
  duration.tenchijin = 6000;
  duration.bunshin = 30000;

  const icon = nextActionOverlay.icon;
  icon.spinningedge = '000601';
  icon.gustslash = '000602';
  icon.aeolianedge = '000605';
  icon.shadowfang = '000606';
  icon.hide = '000609';
  icon.assassinate = '000612';
  icon.mug = '000613';
  icon.deathblossom = '000615';
  icon.trickattack = '000618';
  icon.ten = '002901';
  icon.chi = '002902';
  icon.jin = '002903';
  icon.ninjutsu = '002904';
  icon.mudra1 = '002904';
  icon.mudra2 = '002904';
  icon.kassatsu = '002906';
  icon.fumashuriken = '002907';
  icon.katon = '002908';
  icon.hyoton = '002909';
  icon.huton = '002910';
  icon.doton = '002911';
  icon.raiton = '002912';
  icon.suiton = '002913';
  icon.rabbitmedium = '002913';
  icon.armorcrush = '002915';
  icon.dreamwithinadream = '002918';
  icon.hellfrogmedium = '002920';
  icon.bhavacakra = '002921';
  icon.tenchijin = '002922';
  icon.hakkemujinsatsu = '002923';
  icon.meisui = '002924';
  icon.gokamekkyaku = '002925';
  icon.hyoshoranryu = '002926';
  icon.bunshin = '002927';
}; /* Keep collapsed, usually */

nextActionOverlay.onPlayerChangedEvent.NIN = (e) => {
  const playerData = nextActionOverlay.playerData;
  playerData.huton = e.detail.jobDetail.hutonMilliseconds;
  if (playerData.huton === 0) {
    playerData.huton = -1;
  }
  playerData.ninki = e.detail.jobDetail.ninkiAmount;
};

nextActionOverlay.next.NIN = ({
  time = 0,
} = {}) => {
  /* Shorten names */
  const checkRecast = nextActionOverlay.checkRecast;
  const checkStatus = nextActionOverlay.checkStatus;
  const recast = nextActionOverlay.recast;
  const duration = nextActionOverlay.duration;

  const playerData = nextActionOverlay.playerData;
  const level = playerData.level;

  const weaponskills = nextActionOverlay.actionList.NIN.weaponskills;
  const ninjutsu = nextActionOverlay.actionList.NIN.ninjutsu;

  const next = nextActionOverlay.next.NIN;

  /* Initial values for loops */
  let ogcdTime = time;
  let nextTime = 0;
  const nextMaxTime = 15000;

  let comboStep = playerData.comboStep;
  let ninki = playerData.ninki;
  let bunshinCount = playerData.bunshinCount;

  const loopRecast = {};
  loopRecast.mug = checkRecast({ actionName: 'Mug' });
  loopRecast.trickattack = checkRecast({ actionName: 'Trick Attack' });
  loopRecast.shadowfang = checkRecast({ actionName: 'Shadow Fang' });
  loopRecast.mudra1 = checkRecast({ actionName: 'Mudra 1' });
  loopRecast.mudra2 = checkRecast({ actionName: 'Mudra 2' });
  loopRecast.kassatsu = checkRecast({ actionName: 'Kassatsu' });
  loopRecast.dreamwithinadream = checkRecast({ actionName: 'Dream Within A Dream' });
  loopRecast.tenchijin = checkRecast({ actionName: 'Ten Chi Jin' });
  loopRecast.meisui = checkRecast({ actionName: 'Meisui' });
  loopRecast.bunshin = checkRecast({ actionName: 'Bunshin' });

  const loopStatus = {};
  loopStatus.combo = checkStatus({ statusName: 'Combo' });
  loopStatus.huton = playerData.huton;
  loopStatus.trickattack = checkStatus({ statusName: 'Trick Attack' }); // Added manually
  loopStatus.kassatsu = checkStatus({ statusName: 'Kassatsu' });
  loopStatus.assassinateready = checkStatus({ statusName: 'Assassinate Ready' });
  loopStatus.bunshin = checkStatus({ statusName: 'Bunshin' });
  loopStatus.suiton = checkStatus({ statusName: 'Suiton' });

  /* Clear array */
  const ninArray = [];

  do {
    let loopTime = 0; /* Used at end of loop to move things "forward" */
    let mudraTime = 0; /* NIN specific, also shifts things forward */
    let hutonModifier = 1;

    if (loopStatus.huton > 0) {
      hutonModifier = 0.85;
    }

    if (ogcdTime <= 1000) { /* "If not enough time for oGCD" */
      const nextGCD = next.gcd({
        comboStep,
        loopRecast,
        loopStatus,
      });
      ninArray.push({ name: nextGCD });

      /* Weaponskills */
      if (weaponskills.includes(nextGCD)) {
        comboStep = nextGCD;
        /* Ninki */
        ninki = Math.min(ninki + 5, 100);
        if (level >= 78 && (['Aeolian Edge', 'Shadow Fang', 'Armor Crush'].indexOf(nextGCD) > -1)) {
          ninki = Math.min(ninki + 5, 100);
        }

        if (loopStatus.bunshin > 0 && bunshinCount > 0) {
          bunshinCount -= 1;
          ninki = Math.min(ninki + 5, 100);
        }

        if ((level >= 4 && nextGCD === 'Spinning Edge')
        || (level >= 26 && nextGCD === 'Gust Slash')
        || (level >= 52 && nextGCD === 'Death Blossom')) {
          loopStatus.combo = 15000;
        } else {
          loopStatus.combo = -1;
        }

        /* Weaponskill specific effects */
        if (nextGCD === 'Armor Crush') {
          loopStatus.huton = Math.min(
            loopStatus.huton + duration.armorcrush, duration.huton,
          );
        } else if (nextGCD === 'Hakke Mujinsatsu') {
          loopStatus.huton = Math.min(
            loopStatus.huton + duration.hakkemujinsatsu, duration.huton,
          );
        } else if (nextGCD === 'Shadow Fang') {
          loopRecast.shadowfang = recast.shadowfang * hutonModifier;
        }
      }

      /* Status and Recast */
      if (ninjutsu.includes(nextGCD)) {
        if (loopStatus.kassatsu > 0) {
          loopStatus.kassatsu = -1;
        } else {
          loopRecast.mudra1 = loopRecast.mudra2;
          loopRecast.mudra2 += recast.mudra2;
        }

        if (nextGCD === 'Huton') {
          loopStatus.huton = mudraTime + duration.huton;
        } else if (nextGCD === 'Suiton') {
          loopStatus.suiton = mudraTime + duration.suiton;
        }

        /* mudraTime */
        if (nextGCD === 'Fuma Shuriken') {
          mudraTime = 500;
        } else if (['Katon', 'Raiton', 'Goka Mekkyaku', 'Hyosho Ranryu'].indexOf(nextGCD) > -1) {
          mudraTime = 500 * 2;
        } else if (['Huton', 'Suiton'].indexOf(nextGCD) > -1) {
          mudraTime = 500 * 3;
        }
      }

      /* Calculate how much time for OGCDs */
      if (ninjutsu.indexOf(nextGCD) > -1) {
        ogcdTime = 1500;
      } else {
        ogcdTime = playerData.gcd * hutonModifier;
      }

      loopTime = mudraTime + ogcdTime;

      /* End of GCD section */
    } else {
      /* If gcdTime > 0, then add OGCD action */

      /* Calculate Ninki target for OGCD function */
      let ninkiTarget = 50; /* "If Ninki is here or above, use Bhavacakra or Hellfrog" */
      if (level >= 80) {
        if (loopRecast.bunshin > Math.max(loopRecast.meisui, loopRecast.tenchijin)) {
          ninkiTarget = 50;
        } else if (loopRecast.bunshin > loopRecast.mug) {
          ninkiTarget = 60;
        } else {
          ninkiTarget = 100;
        }
      }

      const nextOGCD = next.ogcd({
        ninki,
        ninkiTarget,
        loopRecast,
        loopStatus,
      });

      /* Push nextOGCD to end of ninArray - TCJ is special */
      if (nextOGCD === 'Ten Chi Jin Suiton') {
        ninArray.push({ name: 'Ten Chi Jin', size: 'small' });
        ninArray.push({ name: 'Fuma Shuriken' });
        if (playerData.targetCount > 1) {
          ninArray.push({ name: 'Katon' });
        } else {
          ninArray.push({ name: 'Raiton' });
        }
        ninArray.push({ name: 'Suiton' });
      } else if (nextOGCD) {
        ninArray.push({ name: nextOGCD, size: 'small' });
      }

      /* OGCD status, recast, and resources */
      if (nextOGCD === 'Assassinate') {
        loopStatus.assassinateready = -1;
      } else if (nextOGCD === 'Bhavacakra') {
        ninki = Math.max(ninki - 50, 0);
      } else if (nextOGCD === 'Bunshin') {
        ninki = Math.max(ninki - 50, 0);
        loopStatus.bunshin = duration.bunshin;
        bunshinCount = 5;
        loopRecast.bunshin = recast.bunshin;
      } else if (nextOGCD === 'Dream Within A Dream') {
        loopRecast.dreamwithinadream = recast.dreamwithinadream;
        if (level >= 60) {
          loopStatus.assassinateready = duration.assassinateready;
        }
      } else if (nextOGCD === 'Hellfrog Medium') {
        ninki = Math.max(ninki - 50, 0);
      } else if (nextOGCD === 'Kassatsu') {
        loopRecast.kassatsu = recast.kassatsu;
        loopStatus.kassatsu = duration.kassatsu;
      } else if (nextOGCD === 'Meisui') {
        loopStatus.suiton = -1;
        ninki = Math.min(ninki + 50, 100);
        loopRecast.meisui = recast.meisui;
      } else if (nextOGCD === 'Mug') {
        loopRecast.mug = recast.mug;
        if (level >= 66) {
          ninki = Math.min(ninki + 40, 100);
        }
      } else if (nextOGCD === 'Ten Chi Jin Suiton') {
        loopRecast.tenchijin = recast.tenchijin;
        // loopStatus.tenchijin = -1;
        loopStatus.suiton = duration.suiton + 2000;
      } else if (nextOGCD === 'Trick Attack') {
        loopStatus.suiton = -1;
        loopRecast.trickattack = recast.trickattack;
        loopStatus.trickattack = duration.trickattack;
      }

      if (nextOGCD === 'Ten Chi Jin Suiton') {
        /* This is a little awkward but probably fine as long as it's defined out of loop */
        loopTime += 2000; /* To account for the first two Ninjutsu steps */
        ogcdTime = 1500; /* Ends with a GCD practically */
      } else {
        ogcdTime = 0;
      }
    }

    /* Adjust all cooldown/status info */
    Object.keys(loopRecast).forEach((property) => { loopRecast[property] -= loopTime; });
    Object.keys(loopStatus).forEach((property) => { loopStatus[property] -= loopTime; });
    nextTime += loopTime;
    /* Go to next loop unless time has exceeded */
  } while (nextTime < nextMaxTime);
  // console.log(JSON.stringify(iconArrayB));

  nextActionOverlay.iconArrayB = ninArray;
  nextActionOverlay.syncIcons();
  clearTimeout(nextActionOverlay.timeout.next);
  nextActionOverlay.timeout.next = setTimeout(next, 14000);
};

nextActionOverlay.next.NIN.gcd = ({
  comboStep,
  loopRecast,
  loopStatus,
} = {}) => {
  const next = nextActionOverlay.next.NIN;
  const playerData = nextActionOverlay.playerData;
  const level = playerData.level;
  const duration = nextActionOverlay.duration;
  /* Use Kassatsu if it's about to fade */
  if (loopStatus.kassatsu > 0 && loopStatus.kassatsu < playerData.gcd * 2) {
    if (level >= 76) {
      if (playerData.targetCount > 1) {
        return 'Goka Mekkyaku';
      }
      return 'Hyosho Ranryu';
    } else if (playerData.targetCount > 1) {
      return 'Katon';
    }
    return 'Raiton';
  }

  /* Continue Combo if timer is low */
  if (loopStatus.combo > 0 && loopStatus.combo < playerData.gcd * 2) {
    return next.weaponskill({ comboStep, loopStatus });
  }

  /* Prioritize Huton if it's really low for some reason */
  if (level >= 45 && loopRecast.mudra1 < 0 && loopStatus.huton < 500 * 3 + 1500) {
    return 'Huton';
  } else if (level >= 52 && playerData.targetCount >= 3
  && loopStatus.huton < 10000 && loopStatus.huton > 0) {
    if (comboStep === 'Death Blossom') {
      return 'Hakke Mujinsatsu';
    } return 'Death Blossom';
  } else if (level >= 54
  && loopStatus.huton < 10000 && loopStatus.huton > 0) {
    if (comboStep === 'Gust Slash') {
      return 'Armor Crush';
    } else if (comboStep === 'Spinning Edge') {
      return 'Gust Slash';
    } return 'Spinning Edge';
  }

  /* Use Suiton to allow TA as soon as possible */
  if (level >= 45 && (level < 70 || level >= 72)
  && loopRecast.mudra1 < 0 && loopStatus.suiton < 0
  && loopRecast.trickattack < duration.suiton) { /* Since Suiton casting delays this by about 3s */
    return 'Suiton'; /* Suiton for Trick before 70 */
  } else if (level >= 70 && level < 72 && loopRecast.mudra1 < 0 && loopStatus.suiton < 0
  && loopRecast.tenchijin > loopRecast.trickattack) {
    return 'Suiton'; /* Only use Suiton 70 and 71 if TCJ isn't available */
  }

  /* Trick priority */
  if (loopStatus.trickattack > 0) {
    if (loopStatus.kassatsu > 0 && loopStatus.kassatsu < playerData.gcd * 2) {
      if (level >= 76) {
        if (playerData.targetCount > 1) {
          return 'Goka Mekkyaku';
        }
        return 'Hyosho Ranryu';
      } return next.weaponskill();
    } else if (loopRecast.shadowfang < 0) {
      return 'Shadow Fang';
    } else if (loopStatus.kassatsu > 0) {
      if (level >= 76) {
        if (playerData.targetCount > 1) {
          return 'Goka Mekkyaku';
        }
        return 'Hyosho Ranryu';
      } return next.ninjutsu();
    } else if (loopRecast.mudra1 < 0 && loopStatus.trickattack > 2000) {
      return next.ninjutsu();
    } return next.weaponskill({ comboStep, loopStatus });
  }

  /* Normal attacks */
  if (level >= 45 && loopRecast.mudra2 < (500 * 2 + 1500)) {
    return next.ninjutsu(); /* Keep one Ninjutsu charge on cooldown */
  } else if (level >= 30 && level < 45 && loopRecast.shadowfang < 0) {
    return 'Shadow Fang'; /* Use Shadow Fang on cooldown before Trick */
  } else if (level >= 30 && level < 45 && loopRecast.mudra1 < 0) {
    return next.ninjutsu(); /* Use all mudra on cooldown prior to 45 */
  } return next.weaponskill({ comboStep, loopStatus });
};

nextActionOverlay.next.NIN.weaponskill = ({
  comboStep,
  loopStatus,
} = {}) => {
  const playerData = nextActionOverlay.playerData;
  const level = playerData.level;
  const targetCount = playerData.targetCount;

  let aeolianedgeComboPotency = 220;
  if (level >= 26) {
    aeolianedgeComboPotency = (220 + 330 + 480) / 3;
  } else if (level >= 4) {
    aeolianedgeComboPotency = (220 + 330) / 2;
  }

  // let armorcrushComboPotency = 220;
  // if (level >= 54) {
  //   aeolianedgeComboPotency = (220 + 330 + 460) / 3;
  // } else if (level >= 4) {
  //   aeolianedgeComboPotency = (220 + 330) / 2;
  // }

  let hakkemujinsatsuComboPotency = 0;
  if (level >= 52) {
    hakkemujinsatsuComboPotency = ((120 + 140) * targetCount) / 2;
  } else if (level >= 38) {
    hakkemujinsatsuComboPotency = (120 * targetCount) / 2;
  }

  if (level >= 54 && comboStep === 'Gust Slash'
  && loopStatus.huton < 40000 && loopStatus.huton > 0) {
    return 'Armor Crush';
  } else if (level >= 52 && comboStep === 'Death Blossom') {
    return 'Hakke Mujinsatsu';
  } else if (level >= 26 && comboStep === 'Gust Slash') {
    return 'Aeolian Edge';
  } else if (level >= 4 && comboStep === 'Spinning Edge') {
    return 'Gust Slash';
  } else if (level >= 38 && hakkemujinsatsuComboPotency > aeolianedgeComboPotency) {
    return 'Death Blossom';
  } return 'Spinning Edge';
};

nextActionOverlay.next.NIN.ninjutsu = () => {
  const playerData = nextActionOverlay.playerData;
  const level = playerData.level;
  const targetCount = playerData.targetCount;

  if (level >= 35 && targetCount > 1) {
    return 'Katon';
  } else if (level >= 35) {
    return 'Raiton';
  } return 'Fuma Shuriken';
};

nextActionOverlay.next.NIN.ogcd = ({
  loopStatus,
  loopRecast,
  ninki,
  ninkiTarget,
} = {}) => {
  const playerData = nextActionOverlay.playerData;
  const level = playerData.level;
  const gcd = playerData.gcd;

  const duration = nextActionOverlay.duration;

  /* Prioritize these action if the related buff is about to wear off for some reason? */
  if (loopStatus.suiton > 0 && loopStatus.suiton < gcd * 2 && loopRecast.trickattack < 0) {
    return 'Trick Attack';
  } else if (level >= 72 && loopStatus.suiton > 0 && loopStatus.suiton < gcd * 2
  && loopStatus.suiton < loopRecast.trickattack && ninki < ninkiTarget && loopRecast.meisui < 0) {
    return 'Meisui';
  } else if (loopStatus.assassinateready > 0 && loopStatus.assassinateready < gcd * 2) {
    return 'Assassinate';
  }

  /* Normal priority */
  if (level >= 50 && (loopStatus.suiton > gcd || loopStatus.trickattack > 0)
  && loopRecast.kassatsu < 0) {
    return 'Kassatsu';
  } else if (level >= 15 && (level < 66 || ninki < ninkiTarget) && loopRecast.mug < 0) {
    return 'Mug';
  } else if (level >= 80 && ninki >= 50 && loopRecast.bunshin < 0) {
    return 'Bunshin';
  } else if (loopStatus.suiton > 0 && loopRecast.trickattack < 0) {
    return 'Trick Attack';
  } else if (level >= 56 && loopStatus.trickattack > 0 && loopRecast.dreamwithinadream < 0) {
    return 'Dream Within A Dream';
  } else if (level >= 72 && loopStatus.kassatsu < 0 && loopStatus.trickattack > 0
  && loopRecast.meisui < duration.suiton && loopStatus.combo > playerData.gcd * 3
  && loopRecast.tenchijin < 0) {
    return 'Ten Chi Jin Suiton'; /* Use TCJ to set up Meisui */
  } else if (level >= 70 && level < 72 && loopStatus.kassatsu < 0
  && loopRecast.trickattack < duration.suiton && loopStatus.combo > playerData.gcd * 3
  && loopRecast.tenchijin < 0) {
    return 'Ten Chi Jin Suiton'; /* Use TCJ to set up TA before 72 */
  } else if (loopStatus.assassinateready > 0) {
    return 'Assassinate';
  } else if (level >= 72 && loopStatus.suiton > 0 && loopStatus.suiton < loopRecast.trickattack
  && ninki < ninkiTarget && loopRecast.meisui < 0) {
    return 'Meisui';
  } else if (level >= 62 && ninki >= ninkiTarget) {
    if (playerData.targetCount > 1) {
      return 'Hellfrog Medium';
    } else if (level >= 68) {
      return 'Bhavacakra';
    }
    return 'Hellfrog Medium';
  } return ''; /* No OGCD */
};

nextActionOverlay.onTargetChange.NIN = () => {
  const playerData = nextActionOverlay.playerData;
  if (playerData.combat === 0) {
    nextActionOverlay.next.NIN();
  }
};

nextActionOverlay.onAction.NIN = (actionMatch) => {
  const singletargetActions = [
    'Raiton', 'Hyosho Ranryu',
  ];
  const playerData = nextActionOverlay.playerData;

  /* Shortens some stuff */
  const actionName = actionMatch.groups.actionName;
  const comboCheck = actionMatch.groups.comboCheck;
  // const targetID = actionMatch.groups.targetID;
  const weaponskills = nextActionOverlay.actionList.NIN.weaponskills;
  const abilities = nextActionOverlay.actionList.NIN.abilities;
  const mudra = nextActionOverlay.actionList.NIN.mudra;
  const ninjutsu = nextActionOverlay.actionList.NIN.ninjutsu;
  const level = playerData.level;
  const huton = playerData.huton;
  const next = nextActionOverlay.next.NIN;
  const gcd = playerData.gcd;

  /* Shorten common functions */
  const addStatus = nextActionOverlay.addStatus;
  const checkStatus = nextActionOverlay.checkStatus;
  const removeStatus = nextActionOverlay.removeStatus;
  const addRecast = nextActionOverlay.addRecast;
  const checkRecast = nextActionOverlay.checkRecast;

  /* Remove icon before reflow */
  nextActionOverlay.removeIcon({ name: actionName });

  /* Set GCD based on Huton */
  let hutonModifier = 1;
  if (huton >= 0) {
    hutonModifier = 0.85;
  }


  if (singletargetActions.includes(actionName)) {
    playerData.targetCount = 1;
  }

  if (weaponskills.includes(actionName)) {
    if (actionName === 'Shadow Fang') {
      addRecast({ actionName: 'Shadow Fang' });

      /* Since Shadow Fang can't be on more than one target anyway, treat it like a buff */
      addStatus({ statusName: 'Shadow Fang' });
    } else if ((level < 4)
    || (level < 26 && actionName === 'Gust Slash')
    || (level < 52 && actionName === 'Death Blossom')) {
      removeStatus({ statusName: 'Combo' });
      playerData.comboStep = '';
    } else if (comboCheck) {
      addStatus({ statusName: 'Combo' });
      playerData.comboStep = actionName;
    } else {
      removeStatus({ statusName: 'Combo' });
      playerData.comboStep = '';
    }
    /* Call next with GCD active */
    next({ time: gcd * hutonModifier });
  } else if (mudra.includes(actionName)) {
    if (playerData.mudraCount === 0 && checkStatus({ statusName: 'Kassatsu' }) < 0) {
      /* Don't increase Mudra recast under Kassatsu */
      addRecast({ actionName: 'Mudra 1', recast: checkRecast({ actionName: 'Mudra 2' }) });
      addRecast({ actionName: 'Mudra 2', recast: checkRecast({ actionName: 'Mudra 2' }) + 20000 });
    }
    playerData.mudraCount += 1;
  } else if (ninjutsu.includes(actionName)) {
    playerData.mudraCount = 0;

    /* Ninjutsu specific stuff */
    if (actionName === 'Doton') {
      addStatus({ statusName: 'Doton' });
    } else if (actionName === 'Suiton') {
      addStatus({ statusName: 'Suiton' });
    }

    if (checkStatus({ statusName: 'Ten Chi Jin' }) > 0 && playerData.tenchijinCount < 2) {
      /* TCJ doesn't actually use Mudra - can't catch it with Mudra matching */
      /* If count is on 2, then upcoming TCJ cast is the last one */
      /* (Condition above sees "0, 1, 2") */
      playerData.tenchijinCount += 1;
    } else {
      /* Catch-all - includes TCJ's last Ninjutsu */
      removeStatus({ statusName: 'Kassatsu' });
      removeStatus({ statusName: 'Ten Chi Jin' });
      playerData.tenchijinCount = 0;
      next({ time: 1500 });
    }
  } else if (abilities.includes(actionName)) {
    addRecast({ actionName });
    if (actionName === 'Trick Attack') {
      addStatus({ statusName: 'Trick Attack' }); /* Treat as buff to make predictions easier */
      next({ time: 0 });
    } else if (actionName === 'Kassatsu') {
      addStatus({ statusName: 'Kassatsu' });
      next({ time: 0 });
    } else if (actionName === 'Ten Chi Jin') {
      addStatus({ statusName: 'Ten Chi Jin' });
      playerData.tenchijinCount = 0;
    } else if (actionName === 'Hide') {
      addRecast({ actionName: 'Mudra 1', recast: -1 });
      addRecast({ actionName: 'Mudra 2', recast: -1 });
      next({ time: 0 });
    }
  }
};

nextActionOverlay.onStatus.NIN = (statusMatch) => {
  /* Shorten common functions */
  const playerData = nextActionOverlay.playerData;
  const addStatus = nextActionOverlay.addStatus;
  // const checkStatus = nextActionOverlay.checkStatus;
  const removeStatus = nextActionOverlay.removeStatus;

  if (statusMatch.groups.gainsLoses === 'gains') {
    addStatus({
      statusName: statusMatch.groups.statusName,
      duration: parseFloat(statusMatch.groups.statusDuration) * 1000,
      id: statusMatch.groups.targetID,
    });
  } else {
    removeStatus({
      statusName: statusMatch.groups.statusName,
      id: statusMatch.groups.targetID,
    });
    if (statusMatch.groups.statusName === 'Mudra') {
      playerData.mudraCount = 0;
    } else if (statusMatch.groups.statusName === 'Ten Chi Jin') {
      playerData.tenchijinCount = 0;
    }
  }
};
