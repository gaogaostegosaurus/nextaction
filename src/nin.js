
actionList.NIN = [
  // Off GCD
  'Shade Shift', 'Hide', 'Mug', 'Shukuchi', 'Dream Within A Dream', 'Assassinate',
  'Kassatsu', 'Ten Chi Jin',
  'Trick Attack', 'Meisui',
  'Hellfrog Medium', 'Bhavacakra', 'Bunshin',

  // GCD
  'Spinning Edge', 'Gust Slash', 'Shadow Fang', 'Aeolian Edge', 'Armor Crush',
  'Death Blossom', 'Hakke Mujinsatsu',
  'Throwing Dagger',

  // Ninjutsu
  'Ten', 'Chi', 'Jin',
  'Fuma Shuriken',
  'Katon', 'Raiton', 'Hyoton',
  'Huton', 'Doton', 'Suiton',
  'Goka Mekkyaku', 'Hyosho Ranryu',

  // Role
  'Second Wind', 'Leg Sweep', 'Bloodbath', 'Feint', 'Arm\'s Length', 'True North',
];

statusList.NIN = [
  'Shade Shift', 'Shadow Fang', 'Kassatsu', 'Assassinate Ready', 'Ten Chi Jin', 'Bunshin',
  'Mudra', 'Doton', 'Suiton',
  'Bloodbath', 'Feint', 'Arm\'s Length', 'True North',
];

const ninSingleTarget = [
  'Raiton',
  'Hyosho Ranryu',
];

const ninFewerTarget = [
  'Spinning Edge;',
  'Gust Slash',
  'Aeolian Edge',
  'Armor Crush',
];

const ninMultiTarget = [
  'Death Blossom',
  'Hakke Mujinsatsu',
];

const ninWeaponskills = [
  'Spinning Edge',
  'Gust Slash',
  'Throwing Dagger',
  'Aeolian Edge',
  'Shadow Fang',
  'Death Blossom',
  'Hakke Mujinsatsu',
  'Armor Crush',
];

// const ninFinisherWeaponskills = [
//   'Aeolian Edge', 'Armor Crush', 'Hakke Mujinsatsu',
// ];

const ninMudra = [
  'Ten', 'Chi', 'Jin',
];

const ninNinjutsu = [
  'Fuma Shuriken', 'Katon', 'Raiton', 'Hyoton', 'Huton', 'Doton', 'Suiton',
  'Rabbit Medium',
  'Goka Mekkyaku', 'Hyosho Ranryu',
];

const ninCooldowns = [
  'Shade Shift', 'Hide', 'Mug', 'Shukuchi', 'Dream Within A Dream', 'Assassinate',
  'Kassatsu', 'Ten Chi Jin',
  'Trick Attack', 'Meisui',
  'Hellfrog Medium', 'Bhavacakra', 'Bunshin',
  'Second Wind', 'Leg Sweep', 'Bloodbath', 'Feint', 'Arm\'s Length', 'True North',
];

/* Loop will look this many seconds into future before stopping */
const ninNextMaxTime = 15000;

/* Tweaks cooldown timings for Ninjutsu... adjust as needed? */
// const oneMudra = 500 * 1 + 1500;
// const twoMudra = 500 * 2 + 1500;
// const threeMudra = 500 * 3 + 1500;
// const mudraAdjust = 2500; /* Timing for mudra needs to be adjusted to keep one use on cooldown */
// const suitonAdjust = 2500; /* Prevents using Suiton too early */

const ninNextWeaponskill = ({
  comboStep,
  hutonStatus,
} = {}) => {
  if (player.level >= 52 && player.targetCount >= 3 && comboStep === 'Death Blossom') {
    return 'Hakke Mujinsatsu';
  } else if (player.level >= 38 && player.targetCount >= 3) {
    return 'Death Blossom';
  } else if (player.level >= 54 && comboStep === 'Gust Slash'
  && hutonStatus < 40000 && hutonStatus > 0) {
    return 'Armor Crush';
  } else if (player.level >= 26 && comboStep === 'Gust Slash') {
    return 'Aeolian Edge';
  } else if (player.level >= 4 && comboStep === 'Spinning Edge') {
    return 'Gust Slash';
  }
  return 'Spinning Edge';
};

const ninNextNinjutsu = () => {
  if (player.level >= 35 && player.targetCount > 1) {
    return 'Katon';
  } else if (player.level >= 35) {
    return 'Raiton';
  }
  return 'Fuma Shuriken';
};

const ninNextGCD = ({
  comboStep,
  hutonStatus,
  kassatsuStatus,
  mudra1Recast,
  mudra2Recast,
  shadowfangRecast,
  suitonStatus,
  tenchijinRecast,
  trickattackRecast,
  trickattackStatus,
  // meisuiRecast,
  // tenchijinStatus,
} = {}) => {
  /* Use Kassatsu if it's about to fade */
  if (kassatsuStatus > 0 && kassatsuStatus < player.gcd * 2) {
    if (player.level >= 76) {
      if (player.targetCount > 1) {
        return 'Goka Mekkyaku';
      }
      return 'Hyosho Ranryu';
    } else if (player.targetCount > 1) {
      return 'Katon';
    }
    return 'Raiton';
  }

  /* Prioritize Huton if it's really low for some reason */
  if (player.level >= 45 && mudra1Recast < 0 && hutonStatus < 500 * 3 + 1500) {
    return 'Huton';
  } else if (player.level >= 52 && player.targetCount >= 3
  && hutonStatus < 10000 && hutonStatus > 0) {
    if (comboStep === 'Death Blossom') {
      return 'Hakke Mujinsatsu';
    } return 'Death Blossom';
  } else if (player.level >= 54
  && hutonStatus < 10000 && hutonStatus > 0) {
    if (comboStep === 'Gust Slash') {
      return 'Armor Crush';
    } else if (comboStep === 'Spinning Edge') {
      return 'Gust Slash';
    } return 'Spinning Edge';
  }

  /* Use Suiton to allow TA as soon as possible */
  if (player.level >= 45 && (player.level < 70 || player.level >= 72)
  && mudra1Recast < 0 && suitonStatus < 0
  && trickattackRecast < duration.suiton) { /* Since Suiton casting delays this by about 3s */
    return 'Suiton'; /* Suiton for Trick before 70 */
  } else if (player.level >= 70 && player.level < 72 && mudra1Recast < 0 && suitonStatus < 0
  && tenchijinRecast > 0 && trickattackRecast < duration.suiton) {
    return 'Suiton'; /* Only use Suiton 70 and 71 if TCJ isn't available */
  }

  /* Trick priority */
  if (trickattackStatus > 0) {
    if (kassatsuStatus > 0 && kassatsuStatus < player.gcd * 2) {
      if (player.level >= 76) {
        if (player.targetCount > 1) {
          return 'Goka Mekkyaku';
        }
        return 'Hyosho Ranryu';
      } return ninNextNinjutsu();
    } else if (shadowfangRecast < 0) {
      return 'Shadow Fang';
    } else if (kassatsuStatus > 0) {
      if (player.level >= 76) {
        if (player.targetCount > 1) {
          return 'Goka Mekkyaku';
        }
        return 'Hyosho Ranryu';
      } return ninNextNinjutsu();
    // } else if (player.level >= 70 && tenchijinRecast < 500 * 2 + 1500
    // && mudra2Recast < 500 * 2 + 1500 + 1000 * 2 + 1500) {
    //   return ninNextNinjutsu(); /* Prevent Mudra cooldown from capping during TCJ */
    } else if (mudra1Recast < 0 && trickattackStatus > 2000) {
      return ninNextNinjutsu();
    } return ninNextWeaponskill({ comboStep, hutonStatus });
  }

  /* Normal attacks */
  if (player.level >= 45 && mudra2Recast < (500 * 2 + 1500)) {
    return ninNextNinjutsu(); /* Keep one Ninjutsu charge on cooldown */
  } else if (player.level >= 30 && player.level < 45 && shadowfangRecast < 0) {
    return 'Shadow Fang'; /* Use Shadow Fang on cooldown before Trick */
  } else if (player.level >= 30 && player.level < 45 && mudra1Recast < 0) {
    return ninNextNinjutsu(); /* Use all mudra on cooldown prior to 45 */
  } return ninNextWeaponskill({ comboStep, hutonStatus });
};

const ninNextOGCD = ({
  assassinatereadyStatus,
  bunshinRecast,
  dreamwithinadreamRecast,
  kassatsuStatus,
  kassatsuRecast,
  meisuiRecast,
  mugRecast,
  ninki,
  ninkiTarget,
  suitonStatus,
  tenchijinRecast,
  trickattackRecast,
  trickattackStatus,
  // hutonStatus,
  // mudra1Recast,
  // mudra2Recast,
  // shadowfangRecast,
} = {}) => {
  /* Use action if buff is about to wear off for some reason */
  if (suitonStatus > 0 && suitonStatus < player.gcd * 2 && trickattackRecast < 0) {
    return 'Trick Attack';
  } else if (player.level >= 72 && suitonStatus > 0 && suitonStatus < player.gcd * 2
  && suitonStatus < trickattackRecast && ninki < ninkiTarget && meisuiRecast < 0) {
    return 'Meisui';
  } else if (assassinatereadyStatus > 0 && assassinatereadyStatus < player.gcd * 2) {
    return 'Assassinate';
  }

  /* Normal priority */
  if (player.level >= 50 && (suitonStatus > player.gcd || trickattackStatus > 0)
  && kassatsuRecast < 0) {
    return 'Kassatsu';
  } else if (player.level >= 15 && (player.level < 66 || ninki < ninkiTarget) && mugRecast < 0) {
    return 'Mug';
  } else if (player.level >= 80 && ninki >= 50 && bunshinRecast < 0) {
    return 'Bunshin';
  } else if (suitonStatus > 0 && trickattackRecast < 0) {
    return 'Trick Attack';
  } else if (player.level >= 56 && trickattackStatus > 0 && dreamwithinadreamRecast < 0) {
    return 'Dream Within A Dream';
  } else if (player.level >= 72 && kassatsuStatus < 0 && trickattackStatus > 0
  && meisuiRecast < duration.suiton && tenchijinRecast < 0) {
    return 'Ten Chi Jin Suiton'; /* Use TCJ to set up Meisui */
  } else if (player.level >= 70 && player.level < 72 && kassatsuStatus < 0
  && trickattackRecast < duration.suiton && tenchijinRecast < 0) {
    return 'Ten Chi Jin Suiton'; /* Use TCJ to set up TA before 72 */
  } else if (assassinatereadyStatus > 0) {
    return 'Assassinate';
  } else if (player.level >= 72 && suitonStatus > 0 && suitonStatus < trickattackRecast
  && ninki < ninkiTarget && meisuiRecast < 0) {
    return 'Meisui';
  } else if (player.level >= 62 && ninki >= ninkiTarget) {
    if (player.targetCount > 1) {
      return 'Hellfrog Medium';
    } else if (player.level >= 68) {
      return 'Bhavacakra';
    }
    return 'Hellfrog Medium';
  }

  /* No OGCD */
  return '';
};

// const ninNextNinkiSpender = ({
//   bunshinRecast,
//   ninki,
//   ninkiTarget,
//   // hutonStatus,
//   // mudra1Recast,
//   // mudra2Recast,
//   // shadowfangRecast,
// } = {}) => {
//   if (player.level >= 80 && ninki >= 50 && bunshinRecast < 0) {
//     return 'Bunshin';
//   } else if (player.level >= 62 && ninki >= ninkiTarget) {
//     if (player.targetCount > 1) {
//       return 'Hellfrog Medium';
//     } else if (player.level >= 68) {
//       return 'Bhavacakra';
//     }
//     return 'Hellfrog Medium';
//   }
//
//   /* No Ninki Spender */
//   return '';
// };

const ninNext = ({
  gcd = 0, // Time to next GCD
  // ogcd = 0, // How many OGCDs to next GCD
  // time = player.gcd * hutonModifier,
} = {}) => {
  // if (Date.now() - previous.ninNext < 100) {
  //   return;
  // }
  let nextTime = 0;
  // previous.ninNext = Date.now();
  // console.log(`${checkRecast({ name: 'Mudra 1' })} ${checkRecast({ name: 'Mudra 2' })}`);
  let gcdTime = gcd; /* This controls how much OGCDs have to work with */

  // let ogcdSlots = ogcd;
  /* Store all the data */
  // let mudraTime = 0;
  let bunshinCount = player.bunshinCount;
  let comboStep = player.comboStep;
  let hutonStatus = player.huton;
  let ninki = player.ninki;
  // let tenchijinCount = player.tenchijinCount;

  let mugRecast = checkRecast({ name: 'Mug' });
  let trickattackRecast = checkRecast({ name: 'Trick Attack' });
  let shadowfangRecast = checkRecast({ name: 'Shadow Fang' });
  let mudra1Recast = checkRecast({ name: 'Mudra 1' });
  let mudra2Recast = checkRecast({ name: 'Mudra 2' });
  let kassatsuRecast = checkRecast({ name: 'Kassatsu' });
  let dreamwithinadreamRecast = checkRecast({ name: 'Dream Within A Dream' });
  let tenchijinRecast = checkRecast({ name: 'Ten Chi Jin' });
  let meisuiRecast = checkRecast({ name: 'Meisui' });
  let bunshinRecast = checkRecast({ name: 'Bunshin' });

  let trickattackStatus = checkStatus({ name: 'Trick Attack' }); // Added manually
  let kassatsuStatus = checkStatus({ name: 'Kassatsu' });
  let assassinatereadyStatus = checkStatus({ name: 'Assassinate Ready' });
  // let tenchijinStatus = checkStatus({ name: 'Ten Chi Jin' });
  let bunshinStatus = checkStatus({ name: 'Bunshin' });
  let suitonStatus = checkStatus({ name: 'Suiton' });

  /* Calculate conservative Ninki floor to prevent overcap */

  /* Clear array */
  const ninArray = [];

  do {
    let loopTime = 0; /* Used at end of loop to move things "forward" */
    let mudraTime = 0; /* Also shifts things forward */
    let hutonModifier = 1;
    if (hutonStatus > 0) {
      hutonModifier = 0.85;
    }


    /* Can't remember why I thought this was necessary */
    // if (ninWeaponskills.includes(nextGCD)) {
    //   ninkiTarget -= 5;
    //   if (player.level >= 78
    //   && (['Aeolian Edge', 'Shadow Fang', 'Armor Crush'].indexOf(nextGCD) > -1)) {
    //     ninkiTarget -= 5;
    //   }
    //   if (bunshinStatus > 0 && bunshinCount > 0) {
    //     ninkiTarget -= 5;
    //   }
    // }

    if (gcdTime <= 0) {
      const nextGCD = ninNextGCD({
        comboStep,
        hutonStatus,
        kassatsuStatus,
        mudra1Recast,
        mudra2Recast,
        shadowfangRecast,
        suitonStatus,
        tenchijinRecast,
        trickattackRecast,
        trickattackStatus,
      });

      /* Use gcdTime to detect if GCD action is needed */

      ninArray.push({ name: nextGCD });


      /* Weaponskills */
      if (ninWeaponskills.includes(nextGCD)) {
        comboStep = nextGCD;

        /* Ninki */
        ninki = Math.min(ninki + 5, 100);
        if (player.level >= 78 && (['Aeolian Edge', 'Shadow Fang', 'Armor Crush'].indexOf(nextGCD) > -1)) {
          ninki = Math.min(ninki + 5, 100);
        }

        if (bunshinStatus > 0 && bunshinCount > 0) {
          bunshinCount -= 1;
          ninki = Math.min(ninki + 5, 100);
        }

        /* Weaponskill specific effects */
        if (nextGCD === 'Armor Crush') {
          hutonStatus = Math.min(
            hutonStatus + duration.armorcrush, duration.huton,
          );
        } else if (nextGCD === 'Hakke Mujinsatsu') {
          hutonStatus = Math.min(
            hutonStatus + duration.hakkemujinsatsu, duration.huton,
          );
        } else if (nextGCD === 'Shadow Fang') {
          shadowfangRecast = recast.shadowfang * hutonModifier;
        }
      }

      /* Status and Recast */
      if (ninNinjutsu.includes(nextGCD)) {
        if (kassatsuStatus > 0) {
          kassatsuStatus = -1;
        } else {
          mudra1Recast = mudra2Recast;
          mudra2Recast += recast.mudra2;
        }

        if (nextGCD === 'Huton') {
          hutonStatus = mudraTime + duration.huton;
        } else if (nextGCD === 'Suiton') {
          suitonStatus = mudraTime + duration.suiton;
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

      /* gcdTime */
      if (ninNinjutsu.indexOf(nextGCD) > -1) {
        gcdTime = 1500;
      } else {
        gcdTime = player.gcd * hutonModifier;
      }

      loopTime = mudraTime + gcdTime;

      /* End of GCD section */
    } else {
      /* If gcdTime > 0, then add OGCD action */

      /* Calculate Ninki target for OGCD function */
      let ninkiTarget = 50;
      if (player.level >= 80) {
        if (bunshinRecast > meisuiRecast) {
          ninkiTarget = 50;
        } else if (bunshinRecast > mugRecast) {
          ninkiTarget = 60;
        } else {
          ninkiTarget = 100;
        }
      }

      const nextOGCD = ninNextOGCD({
        assassinatereadyStatus,
        bunshinRecast,
        dreamwithinadreamRecast,
        kassatsuStatus,
        kassatsuRecast,
        meisuiRecast,
        mugRecast,
        ninki,
        ninkiTarget,
        suitonStatus,
        tenchijinRecast,
        trickattackRecast,
        trickattackStatus,
      });

      /* Push nextOGCD to end of ninArray - TCJ is special */
      if (nextOGCD === 'Ten Chi Jin Suiton') {
        ninArray.push({ name: 'Ten Chi Jin', size: 'small' });
        ninArray.push({ name: 'Fuma Shuriken' });
        if (player.targetCount > 1) {
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
        assassinatereadyStatus = -1;
      } else if (nextOGCD === 'Bhavacakra') {
        ninki = Math.max(ninki - 50, 0);
      } else if (nextOGCD === 'Bunshin') {
        ninki = Math.max(ninki - 50, 0);
        bunshinStatus = duration.bunshin;
        bunshinCount = 5;
        bunshinRecast = recast.bunshin;
      } else if (nextOGCD === 'Dream Within A Dream') {
        dreamwithinadreamRecast = recast.dreamwithinadream;
        if (player.level >= 60) {
          assassinatereadyStatus = duration.assassinateready;
        }
      } else if (nextOGCD === 'Hellfrog Medium') {
        ninki = Math.max(ninki - 50, 0);
      } else if (nextOGCD === 'Kassatsu') {
        kassatsuRecast = recast.kassatsu;
        kassatsuStatus = duration.kassatsu;
      } else if (nextOGCD === 'Meisui') {
        suitonStatus = -1;
        ninki = Math.min(ninki + 50, 100);
        meisuiRecast = recast.meisui;
      } else if (nextOGCD === 'Mug') {
        mugRecast = recast.mug;
        if (player.level >= 66) {
          ninki = Math.min(ninki + 40, 100);
        }
      } else if (nextOGCD === 'Ten Chi Jin Suiton') {
        tenchijinRecast = recast.tenchijin;
        // tenchijinStatus = -1;
        suitonStatus = duration.suiton + 2000;
      } else if (nextOGCD === 'Trick Attack') {
        suitonStatus = -1;
        trickattackRecast = recast.trickattack;
        trickattackStatus = duration.trickattack;
      }

      if (nextOGCD === 'Ten Chi Jin Suiton') {
        /* This is a little awkward but probably fine as long as it's defined out of loop */
        loopTime += 2000; /* To account for the first two Ninjutsu steps */
        gcdTime = 1500; /* Ends with a GCD practically */
      } else {
        gcdTime = 0;
      }

      // const ninkiSpender = ninNextNinkiSpender({
      //   bunshinRecast,
      //   ninki,
      //   ninkiTarget,
      // });
      //
      // if (ninkiSpender) {
      //   ninArray.push({ name: ninkiSpender, size: 'small' });
      // }
    }

    /* Adjust all cooldown/status info */
    nextTime += loopTime;
    trickattackRecast -= loopTime;
    mudra1Recast -= loopTime;
    mudra2Recast -= loopTime;
    bunshinRecast -= loopTime;
    meisuiRecast -= loopTime;
    tenchijinRecast -= loopTime;
    kassatsuRecast -= loopTime;
    dreamwithinadreamRecast -= loopTime;
    mugRecast -= loopTime;
    shadowfangRecast -= loopTime;
    // tenchijinStatus -= loopTime;
    trickattackStatus -= loopTime;
    assassinatereadyStatus -= loopTime;
    kassatsuStatus -= loopTime;
    suitonStatus -= loopTime;
    hutonStatus -= loopTime;

    /* Go to next loop */
  } while (nextTime < ninNextMaxTime);
  // console.log(JSON.stringify(iconArrayB));

  iconArrayB = ninArray;
  syncIcons();
  clearTimeout(timeout.ninNext);
  timeout.ninNext = setTimeout(ninNext, 14000);
};

// const ninNextTimeout = ({ time = 12500, gcd = 0, ogcd = 0 } = {}) => {

// };

onJobChange.NIN = () => {
  // addCountdown({ name: 'Mudra 1', text: '#1 READY' });
  // addCountdown({ name: 'Mudra 2', text: '#2 READY' });
  // addCountdown({ name: 'Ten Chi Jin' });
  // addCountdown({ name: 'Kassatsu' });
  // addCountdown({ name: 'Bunshin', countdownArray: countdownArrayB });
  // addCountdown({ name: 'Trick Attack', countdownArray: countdownArrayB });
  // addCountdown({ name: 'Dream Within A Dream', countdownArray: countdownArrayB });
  // addCountdown({ name: 'Meisui', countdownArray: countdownArrayB });
  // addCountdown({ name: 'Mug', countdownArray: countdownArrayB });
  ninNext();
};

onTargetChanged.NIN = () => {
  if (player.combat === 0) {
    ninNext();
  }
};

onAction.NIN = (actionMatch) => {
  /* Action log matching */

  /* Remove icon before reflow */
  removeIcon({ name: actionMatch.groups.actionName });

  /* Huton modifier */
  let hutonModifier = 1;
  if (player.huton > 0) {
    hutonModifier = 0.85;
  }

  /* AOE toggle - definitely not perfect but whatever, can't do EVERYTHING. */
  if (ninMultiTarget.includes(actionMatch.groups.actionName)
    && actionMatch.groups.targetID !== 'E0000000') {
    /* E0000000 prevents triggering off AOEs like Death Blossom that can be used without target */
    player.targetCount = 3;
  } else if (ninSingleTarget.includes(actionMatch.groups.actionName)) {
    player.targetCount = 1;
  } else if (ninFewerTarget.includes(actionMatch.groups.actionName) && player.targetCount >= 3) {
    player.targetCount -= 1;
  }

  /* Mudra-specific stuff */
  if (ninMudra.includes(actionMatch.groups.actionName)) {
    /* Don't increase Mudra recast under Kassatsu */
    if (player.mudraCount === 0 && checkStatus({ name: 'Kassatsu' }) < 0) {
      if (checkRecast({ name: 'Mudra 2' }) > 0) {
        addRecast({ name: 'Mudra 1', time: checkRecast({ name: 'Mudra 2' }) });
        // addCountdown({ name: 'Mudra 1', text: '#1 READY' });
      }
      addRecast({ name: 'Mudra 2', time: checkRecast({ name: 'Mudra 2' }) + 20000 });
      // addCountdown({ name: 'Mudra 2', text: '#2 READY' });
    }
    player.mudraCount += 1;
    // ninNext({ gcd: 500, ogcd: 0 });
  } else if (ninNinjutsu.includes(actionMatch.groups.actionName)) {
    /* Ninjutsu specific stuff */
    /* Logic here feels messy - return to fix at some point */
    if (checkStatus({ name: 'Ten Chi Jin' }) > 0 && player.tenchijinCount < 3) {
      /* TCJ doesn't actually use Mudra */
      player.tenchijinCount += 1;
      return;
    }
    removeStatus({ name: 'Kassatsu' });
    removeStatus({ name: 'Ten Chi Jin' });
    if (actionMatch.groups.actionName === 'Doton') {
      addStatus({ name: 'Doton' });
    } else if (actionMatch.groups.actionName === 'Suiton') {
      addStatus({ name: 'Suiton' });
    }
    ninNext({ gcd: 1500 });
  } else if (ninWeaponskills.indexOf(actionMatch.groups.actionName) > -1) {
    if (actionMatch.groups.comboCheck) {
      player.comboStep = actionMatch.groups.actionName;
    } else if (actionMatch.groups.actionName === 'Shadow Fang') {
      /* Shadow Fang doesn't interrupt combo */
      addRecast({ name: 'Shadow Fang', time: recast.shadowfang * hutonModifier });
      // addStatus({ name: 'Shadow Fang', id: actionMatch.groups.targetID });
      /* Since Shadow Fang can't be on more than one target, treat it like a buff */
      addStatus({ name: 'Shadow Fang' });
    } else {
      player.comboStep = '';
    }
    ninNext({ gcd: player.gcd * hutonModifier });
  } else if (ninCooldowns.indexOf(actionMatch.groups.actionName) > -1) {
    removeIcon({ name: actionMatch.groups.actionName });
    addRecast({ name: actionMatch.groups.actionName });
    if (actionMatch.groups.actionName === 'Trick Attack') {
      // addStatus({ name: 'Trick Attack', id: actionMatch.groups.targetID });
      addStatus({ name: 'Trick Attack' }); /* to ease calculations */
    } else if (actionMatch.groups.actionName === 'Kassatsu') {
      addStatus({ name: 'Kassatsu' });
    } else if (actionMatch.groups.actionName === 'Ten Chi Jin') {
      addStatus({ name: 'Ten Chi Jin' });
      player.tenchijinCount = 0;
    } else if (actionMatch.groups.actionName === 'Hide') {
      addRecast({ name: 'Mudra 1', time: -1 });
      addRecast({ name: 'Mudra 2', time: -1 });
      // addCountdown({ name: 'Mudra 1' });
      // addCountdown({ name: 'Mudra 2' });
    }
    // ninNext();
  }
};

onStatus.NIN = (statusMatch) => {
  if (statusMatch.groups.gainsLoses === 'gains') {
    addStatus({
      name: statusMatch.groups.statusName,
      time: parseFloat(statusMatch.groups.statusDuration) * 1000,
      id: statusMatch.groups.targetID,
    });
  } else {
    removeStatus({ name: statusMatch.groups.statusName, id: statusMatch.groups.targetID });
    if (statusMatch.groups.statusName === 'Mudra') {
      player.mudraCount = 0;
    } else if (statusMatch.groups.statusName === 'Ten Chi Jin') {
      player.tenchijinCount = 0;
    }
    //   count.mudra = 0;
    //   ninNext({ time: 1500 });
    // }
    // } else if (statusMatch.groups.statusName === 'Kassatsu') {
    //   delete toggle.ninjutsu;
    //   count.ninjutsu = 0;
    //   ninNext();
    // } else if (statusMatch.groups.statusName === 'Ten Chi Jin') {
    //   delete toggle.ninjutsu;
    //   count.ninjutsu = 0;
    //   ninNext();
    // }
  }
};
