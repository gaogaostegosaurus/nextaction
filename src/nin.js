
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

castingList.NIN = []; // So it doesn't complain

const ninSingleTarget = [
  'Raiton', 'Bhavacakra', 'Hyosho Ranryu',
];

const ninComboWeaponskills = [
  'Spinning Edge', 'Gust Slash', 'Aeolian Edge', 'Shadow Fang', 'Armor Crush', 'Death Blossom',
  'Hakke Mujinsatsu',
];

const ninFinisherWeaponskills = [
  'Aeolian Edge', 'Armor Crush', 'Hakke Mujinsatsu',
];

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

const ninNextLoopTime = 15000;

const ninNextOGCD = ({
  time = 0,
} = {}) => {
  let elapsedTime = time;
  let ogcdSlots = ogcd;
  let ninki = player.ninki;
  let comboStep = player.comboStep;
  let mudra1Recast = checkRecast({ name: 'Mudra 1' });
  let mudra2Recast = checkRecast({ name: 'Mudra 2' });
  let trickattackRecast = checkRecast({ name: 'Trick Attack' });
  let trickattackStatus = checkStatus({ name: 'Trick Attack' }); // Added manually
  let bunshinRecast = checkRecast({ name: 'Bunshin' });
  let meisuiRecast = checkRecast({ name: 'Meisui' });
  let tenchijinRecast = checkRecast({ name: 'Ten Chi Jin' });
  let tenchijinStatus = checkStatus({ name: 'Ten Chi Jin' });
  let dreamwithinadreamRecast = checkRecast({ name: 'Dream Within A Dream' });
  let kassatsuStatus = checkStatus({ name: 'Kassatsu' });
  let kassatsuRecast = checkRecast({ name: 'Kassatsu' });
  let mugRecast = checkRecast({ name: 'Mug' });
  let shadowfangRecast = checkRecast({ name: 'Shadow Fang' });
  let assassinatereadyStatus = checkStatus({ name: 'Assassinate Ready' });
  let suitonStatus = checkStatus({ name: 'Suiton' });
  let hutonStatus = player.huton;

  if (player.level >= 80 && ninki >= 50 && bunshinRecast < 0) {
    ninArray.push({ name: 'Bunshin', size: 'small' });
    ninki -= 50;
    bunshinRecast = 90000 + elapsedTime;
  } else if (player.level >= 50 && kassatsuRecast < 0 && suitonStatus > 0) {
    ninArray.push({ name: 'Kassatsu', size: 'small' });
    kassatsuRecast = recast.kassatsu + elapsedTime;
    kassatsuStatus = duration.kassatsu + elapsedTime;
  } else if (suitonStatus > 0 && trickattackRecast < 0) {
    ninArray.push({ name: 'Trick Attack', size: 'small' });
    suitonStatus = -1;
    trickattackRecast = recast.trickattack + elapsedTime;
    trickattackStatus = duration.trickattack + elapsedTime;
  } else if (player.level >= 72 && suitonStatus > 0 && meisuiRecast < 0 && ninki <= 45) {
    ninArray.push({ name: 'Meisui', size: 'small' });
    suitonStatus = -1;
    ninki += 50;
    meisuiRecast = recast.meisui + elapsedTime;
  } else if (assassinatereadyStatus > 0) {
    ninArray.push({ name: 'Assassinate', size: 'small' });
    assassinatereadyStatus = -1;
  } else if (player.level >= 56 && dreamwithinadreamRecast < 0 && trickattackStatus > 0) {
    ninArray.push({ name: 'Dream Within A Dream', size: 'small' });
    dreamwithinadreamRecast = recast.dreamwithinadream + elapsedTime;
    if (player.level >= 60) {
      assassinatereadyStatus = duration.assassinateready + elapsedTime;
    }
  } else if (player.level >= 15 && ninki <= 55 && mugRecast < 0) {
    ninArray.push({ name: 'Mug', size: 'small' });
    mugRecast = recast.mug + elapsedTime;
    if (player.level >= 66) {
      ninki += 40;
    }
  } else if (player.level >= 62 && ninki >= ninkiTarget) {
    if (player.targetCount >= 2) {
      ninArray.push({ name: 'Hellfrog Medium', size: 'small' });
    } else if (player.level >= 68) {
      ninArray.push({ name: 'Bhavacakra', size: 'small' });
    } else {
      ninArray.push({ name: 'Hellfrog Medium', size: 'small' });
    }
    ninki -= 50;
  } else if (player.level >= 72 && kassatsuStatus < 0 && tenchijinRecast < 0
  && trickattackStatus > 0) {
    ninArray.push({ name: 'Ten Chi Jin', size: 'small' });
    tenchijinRecast = recast.tenchijin + elapsedTime;
    tenchijinStatus = duration.tenchijin + elapsedTime;
  } else if (player.level >= 70 && player.level < 72 && kassatsuStatus < 0
  && tenchijinRecast < 0 && trickattackRecast < 0) {
    ninArray.push({ name: 'Ten Chi Jin', size: 'small' });
    tenchijinRecast = recast.tenchijin + elapsedTime;
    tenchijinStatus = duration.tenchijin + elapsedTime;
  }
  ogcdSlots = 0;
}

const ninNext = ({
  gcd = 0, // Time to next GCD
  ogcd = 0, // How many OGCDs to next GCD
  // time = player.gcd * hutonModifier,
} = {}) => {
  // if (Date.now() - previous.ninNext < 100) {
  //   return;
  // }

  // previous.ninNext = Date.now();
  // console.log(`${checkRecast({ name: 'Mudra 1' })} ${checkRecast({ name: 'Mudra 2' })}`);

  /* Store all the data */
  let elapsedTime = gcd;
  let ogcdSlots = ogcd;
  let ninki = player.ninki;
  let comboStep = player.comboStep;
  let mudra1Recast = checkRecast({ name: 'Mudra 1' });
  let mudra2Recast = checkRecast({ name: 'Mudra 2' });
  let trickattackRecast = checkRecast({ name: 'Trick Attack' });
  let trickattackStatus = checkStatus({ name: 'Trick Attack' }); // Added manually
  let bunshinRecast = checkRecast({ name: 'Bunshin' });
  let meisuiRecast = checkRecast({ name: 'Meisui' });
  let tenchijinRecast = checkRecast({ name: 'Ten Chi Jin' });
  let tenchijinStatus = checkStatus({ name: 'Ten Chi Jin' });
  let dreamwithinadreamRecast = checkRecast({ name: 'Dream Within A Dream' });
  let kassatsuStatus = checkStatus({ name: 'Kassatsu' });
  let kassatsuRecast = checkRecast({ name: 'Kassatsu' });
  let mugRecast = checkRecast({ name: 'Mug' });
  let shadowfangRecast = checkRecast({ name: 'Shadow Fang' });
  let assassinatereadyStatus = checkStatus({ name: 'Assassinate Ready' });
  let suitonStatus = checkStatus({ name: 'Suiton' });
  let hutonStatus = player.huton;

  /* Calculate conservative Ninki floor to prevent overcap */
  let ninkiTarget = 50;
  if (player.level >= 80) {
    if (checkRecast({ name: 'Bunshin' }) > checkRecast({ name: 'Meisui' })) {
      ninkiTarget = 50;
    } else if (checkRecast({ name: 'Bunshin' }) > checkRecast({ name: 'Mug' })) {
      ninkiTarget = 55;
    } else {
      ninkiTarget = 95;
    }
  }

  /* Clear array */
  const ninArray = [];

  do {
    /* Use modifier if Huton is up */
    let hutonModifier = 1;
    if (hutonStatus > 0) {
      hutonModifier = 0.85;
    }

    let gcdTime = player.gcd * hutonModifier;

    /* Start loop */
    /* Change GCD length depending on Huton */

    if (ogcdSlots === 0) {
      if (kassatsuStatus > 0 && trickattackStatus > 0) {
        if (player.level >= 76) {
          if (player.targetCount > 1) {
            ninArray.push({ name: 'Goka Mekkyaku' });
          } else {
            ninArray.push({ name: 'Hyosho Ranryu' });
          }
        } else if (player.targetCount > 1) {
          ninArray.push({ name: 'Katon' });
        } else {
          ninArray.push({ name: 'Raiton' });
        }
        gcdTime = 500 * 2 + 1500;
        kassatsuStatus = -1;
      } else if (tenchijinStatus > 0) {
        if (trickattackRecast < 0) {
          ninArray.push({ name: 'Fuma Shuriken' });
          if (player.targetCount > 1) {
            ninArray.push({ name: 'Katon' });
          } else {
            ninArray.push({ name: 'Raiton' });
          }
          ninArray.push({ name: 'Suiton' });
        } else if (player.level >= 72 && meisuiRecast < 0) {
          ninArray.push({ name: 'Fuma Shuriken' });
          if (player.targetCount > 1) {
            ninArray.push({ name: 'Katon' });
          } else {
            ninArray.push({ name: 'Raiton' });
          }
          ninArray.push({ name: 'Suiton' });
        } else {
          ninArray.push({ name: 'Fuma Shuriken' });
          ninArray.push({ name: 'Katon' });
          ninArray.push({ name: 'Doton' });
        }
        tenchijinStatus = -1;
        elapsedTime += 1000 * 2;
        suitonStatus = duration.suiton + elapsedTime;
        gcdTime = 1500;
      } else if (player.level >= 45 && mudra1Recast < 0 && hutonStatus - 500 * 3 < 0) {
        ninArray.push({ name: 'Huton' });
        mudra1Recast = mudra2Recast + elapsedTime;
        mudra2Recast = mudra2Recast + recast.mudra2 + elapsedTime;
        elapsedTime += 500 * 3;
        hutonStatus = duration.huton + elapsedTime;
        gcdTime = 1500;
      } else if (player.level >= 45 && mudra1Recast < 0 && suitonStatus < 0
      && trickattackRecast < 17000) {
        ninArray.push({ name: 'Suiton' });
        mudra1Recast = mudra2Recast + elapsedTime;
        mudra2Recast = mudra2Recast + recast.mudra2 + elapsedTime;
        elapsedTime += 500 * 3;
        suitonStatus = duration.suiton + elapsedTime;
        gcdTime = 1500;
      } else if (player.level >= 72 && mudra1Recast < 0 && suitonStatus < 0
      && meisuiRecast < 17000) {
        ninArray.push({ name: 'Suiton' });
        mudra1Recast = mudra2Recast + elapsedTime;
        mudra2Recast = mudra2Recast + recast.mudra2 + elapsedTime;
        elapsedTime += 500 * 3;
        suitonStatus = duration.suiton + elapsedTime;
        gcdTime = 1500;
      } else if (player.level >= 45 && mudra2Recast < 2500) {
        /* Use other ninjutsu while keeping one charge active for Suiton actions */
        if (player.targetCount > 1) {
          ninArray.push({ name: 'Katon' });
          mudra1Recast = mudra2Recast + elapsedTime;
          mudra2Recast = mudra2Recast + recast.mudra2 + elapsedTime;
          elapsedTime += 500 * 2;
          gcdTime = 1500;
        } else {
          ninArray.push({ name: 'Raiton' });
          mudra1Recast = mudra2Recast + elapsedTime;
          mudra2Recast = mudra2Recast + recast.mudra2 + elapsedTime;
          elapsedTime += 500 * 2;
          gcdTime = 1500;
        }
      } else if (player.level >= 45 && trickattackStatus > 0 && shadowfangRecast < 0) {
        /* Assuming hitting everything and all ticks, SF is weaker than AoE at 9 targets (lol) */
        ninArray.push({ name: 'Shadow Fang' });
        // shadowfangStatus = duration.shadowfang + elapsedTime;
        shadowfangRecast = recast.shadowfang * hutonModifier + elapsedTime;
        if (player.level >= 78) {
          ninki += 10;
        } else {
          ninki += 5;
        }
      } else if (player.level >= 30 && player.level < 45 && shadowfangRecast < 0) {
        /* Assuming hitting everything and all ticks, SF is weaker than AoE at 9 targets (lol) */
        ninArray.push({ name: 'Shadow Fang' });
        // shadowfangStatus = duration.shadowfang + elapsedTime;
        shadowfangRecast = recast.shadowfang * hutonModifier + elapsedTime;
        ninki += 5;
      } else if (player.level < 45 && mudra1Recast < 0) {
        /* Use on cooldown prior to 45 */
        if (player.level >= 35 && player.targetCount > 1) {
          ninArray.push({ name: 'Katon' });
          mudra1Recast = mudra2Recast + elapsedTime;
          mudra2Recast = mudra2Recast + recast.mudra2 + elapsedTime;
          elapsedTime += 500 * 2;
          gcdTime = 1500;
        } else if (player.level >= 35) {
          ninArray.push({ name: 'Raiton' });
          mudra1Recast = mudra2Recast + elapsedTime;
          mudra2Recast = mudra2Recast + recast.mudra2 + elapsedTime;
          elapsedTime += 500 * 2;
          gcdTime = 1500;
        } else {
          ninArray.push({ name: 'Fuma Shuriken' });
          mudra1Recast = mudra2Recast + elapsedTime;
          mudra2Recast = mudra2Recast + recast.mudra2 + elapsedTime;
          elapsedTime += 500 * 1;
          gcdTime = 1500;
        }
      } else if (player.level >= 52 && player.targetCount >= 3 && comboStep === 11) {
        ninArray.push({ name: 'Hakke Mujinsatsu' });
        hutonStatus = Math.min(
          hutonStatus + duration.hakkemujinsatsu, duration.huton + elapsedTime,
        );
        ninki += 5;
        comboStep = 0;
      } else if (player.level >= 38 && player.targetCount >= 3) {
        ninArray.push({ name: 'Death Blossom' });
        ninki += 5;
        comboStep = 11;
      } else if (player.level >= 56 && comboStep === 2 && hutonStatus < 40000 && hutonStatus > 0) {
        ninArray.push({ name: 'Armor Crush' });
        hutonStatus = Math.min(
          hutonStatus + duration.armorcrush, duration.huton + elapsedTime,
        );
        if (player.level >= 78) {
          ninki += 10;
        } else {
          ninki += 5;
        }
        comboStep = 0;
      } else if (player.level >= 26 && comboStep === 2) {
        ninArray.push({ name: 'Aeolian Edge' });
        if (player.level >= 78) {
          ninki += 10;
        } else {
          ninki += 5;
        }
        comboStep = 0;
      } else if (player.level >= 4 && comboStep === 1) {
        ninArray.push({ name: 'Gust Slash' });
        ninki += 5;
        comboStep = 2;
      } else {
        ninArray.push({ name: 'Spinning Edge' });
        ninki = Math.min(ninki + 5, 100);
        comboStep = 1;
      }
      ogcdSlots = 1;
    }

    /* Add OGCD action */

    if (ogcdSlots > 0) {
      if (player.level >= 80 && ninki >= 50 && bunshinRecast < 0) {
        ninArray.push({ name: 'Bunshin', size: 'small' });
        ninki -= 50;
        bunshinRecast = 90000 + elapsedTime;
      } else if (player.level >= 50 && kassatsuRecast < 0 && suitonStatus > 0) {
        ninArray.push({ name: 'Kassatsu', size: 'small' });
        kassatsuRecast = recast.kassatsu + elapsedTime;
        kassatsuStatus = duration.kassatsu + elapsedTime;
      } else if (suitonStatus > 0 && trickattackRecast < 0) {
        ninArray.push({ name: 'Trick Attack', size: 'small' });
        suitonStatus = -1;
        trickattackRecast = recast.trickattack + elapsedTime;
        trickattackStatus = duration.trickattack + elapsedTime;
      } else if (player.level >= 72 && suitonStatus > 0 && meisuiRecast < 0 && ninki <= 45) {
        ninArray.push({ name: 'Meisui', size: 'small' });
        suitonStatus = -1;
        ninki += 50;
        meisuiRecast = recast.meisui + elapsedTime;
      } else if (assassinatereadyStatus > 0) {
        ninArray.push({ name: 'Assassinate', size: 'small' });
        assassinatereadyStatus = -1;
      } else if (player.level >= 56 && dreamwithinadreamRecast < 0 && trickattackStatus > 0) {
        ninArray.push({ name: 'Dream Within A Dream', size: 'small' });
        dreamwithinadreamRecast = recast.dreamwithinadream + elapsedTime;
        if (player.level >= 60) {
          assassinatereadyStatus = duration.assassinateready + elapsedTime;
        }
      } else if (player.level >= 15 && ninki <= 55 && mugRecast < 0) {
        ninArray.push({ name: 'Mug', size: 'small' });
        mugRecast = recast.mug + elapsedTime;
        if (player.level >= 66) {
          ninki += 40;
        }
      } else if (player.level >= 62 && ninki >= ninkiTarget) {
        if (player.targetCount >= 2) {
          ninArray.push({ name: 'Hellfrog Medium', size: 'small' });
        } else if (player.level >= 68) {
          ninArray.push({ name: 'Bhavacakra', size: 'small' });
        } else {
          ninArray.push({ name: 'Hellfrog Medium', size: 'small' });
        }
        ninki -= 50;
      } else if (player.level >= 72 && kassatsuStatus < 0 && tenchijinRecast < 0
      && trickattackStatus > 0) {
        ninArray.push({ name: 'Ten Chi Jin', size: 'small' });
        tenchijinRecast = recast.tenchijin + elapsedTime;
        tenchijinStatus = duration.tenchijin + elapsedTime;
      } else if (player.level >= 70 && player.level < 72 && kassatsuStatus < 0
      && tenchijinRecast < 0 && trickattackRecast < 0) {
        ninArray.push({ name: 'Ten Chi Jin', size: 'small' });
        tenchijinRecast = recast.tenchijin + elapsedTime;
        tenchijinStatus = duration.tenchijin + elapsedTime;
      }
      ogcdSlots = 0;
    } /* OGCD block ends here */

    /* Fix ninki if necessary */
    if (ninki > 100) {
      ninki = 100;
    } else if (ninki < 0) {
      ninki = 0;
    }

    elapsedTime += gcdTime;

    mudra1Recast -= elapsedTime;
    mudra2Recast -= elapsedTime;
    trickattackRecast -= elapsedTime;
    trickattackStatus -= elapsedTime; // Added manually
    bunshinRecast -= elapsedTime;
    meisuiRecast -= elapsedTime;
    tenchijinRecast -= elapsedTime;
    tenchijinStatus -= elapsedTime;
    dreamwithinadreamRecast -= elapsedTime;
    kassatsuStatus -= elapsedTime;
    kassatsuRecast -= elapsedTime;
    mugRecast -= elapsedTime;
    shadowfangRecast -= elapsedTime;
    assassinatereadyStatus -= elapsedTime;
    suitonStatus -= elapsedTime;
    hutonStatus -= elapsedTime;

    // Adjust all cooldown/status info
  } while (elapsedTime < ninNextLoopTime);
  // console.log(JSON.stringify(iconArrayB));
  iconArrayB = ninArray;
  syncIcons();
  ninNextTimeout({ time: 10000 });
};

const ninNextTimeout = ({ time = 12500, gcd = 0, ogcd = 0 } = {}) => {
  clearTimeout(timeout.next);
  timeout.next = setTimeout(ninNext, time, { gcd, ogcd });
};

onJobChange.NIN = () => {
  addCountdown({ name: 'Mudra 1', text: '#1 READY' });
  addCountdown({ name: 'Mudra 2', text: '#2 READY' });
  // addCountdown({ name: 'Ten Chi Jin' });
  // addCountdown({ name: 'Kassatsu' });
  // addCountdown({ name: 'Bunshin', countdownArray: countdownArrayB });
  // addCountdown({ name: 'Trick Attack', countdownArray: countdownArrayB });
  // addCountdown({ name: 'Dream Within A Dream', countdownArray: countdownArrayB });
  // addCountdown({ name: 'Meisui', countdownArray: countdownArrayB });
  // addCountdown({ name: 'Mug', countdownArray: countdownArrayB });
  ninNext();
};

onTargetChanged.NIN = () => {};

player.ninjutsuCount = 0;
player.comboStep = 0;
player.mudraCount = 0;

onAction.NIN = (actionMatch) => {

  // player.gcd * (1 - Math.sign(player.huton) * 0.15)
  let hutonModifier = 1;
  if (player.huton > 0) {
    hutonModifier = 0.85;
  }

  removeIcon({ name: actionMatch.groups.actionName });

  if (ninSingleTarget.includes(actionMatch.groups.actionName) > -1) {
    player.targetCount = 1;
  }

  if (ninMudra.indexOf(actionMatch.groups.actionName) > -1) {
    /* Don't increase Mudra recast under Kassatsu */
    if (player.mudraCount === 0 && checkStatus({ name: 'Kassatsu' }) < 0) {
      if (checkRecast({ name: 'Mudra 2' }) > 0) {
        addRecast({ name: 'Mudra 1', time: checkRecast({ name: 'Mudra 2' }) });
        addCountdown({ name: 'Mudra 1', text: '#1 READY' });
      }
      addRecast({ name: 'Mudra 2', time: checkRecast({ name: 'Mudra 2' }) + 20000 });
      addCountdown({ name: 'Mudra 2', text: '#2 READY' });
    }
    player.mudraCount += 1;
    // ninNext({ gcd: 500, ogcd: 0 });
    //console.log(player.mudraCount);
  } else if (ninNinjutsu.indexOf(actionMatch.groups.actionName) > -1) {
    /* General catch-all */
    removeStatus({ name: 'Kassatsu' });

    if (actionMatch.groups.actionName === 'Doton') {
      addStatus({ name: 'Doton' });
    } else if (actionMatch.groups.actionName === 'Suiton') {
      addStatus({ name: 'Suiton' });
    }

    if (checkStatus({ name: 'Ten Chi Jin' }) > 0 && player.tenchijinCount < 3) {
      /* TCJ doesn't actually use Mudra */
      player.tenchijinCount += 1;
    } else {
      removeStatus({ name: 'Ten Chi Jin' });
    }

    ninNext({ gcd: 1500, ogcd: 1 });
  } else if (ninComboWeaponskills.indexOf(actionMatch.groups.actionName) > -1) {
    if (actionMatch.groups.actionName === 'Death Blossom' && player.level >= 52 && actionMatch.groups.comboCheck) {
      player.comboStep = 11;
    } else if (actionMatch.groups.actionName === 'Gust Slash' && player.level >= 26 && actionMatch.groups.comboCheck) {
      player.comboStep = 2;
    } else if (actionMatch.groups.actionName === 'Spinning Edge' && player.level >= 4 && actionMatch.groups.comboCheck) {
      player.comboStep = 1;
    } else if (actionMatch.groups.actionName === 'Shadow Fang') {
      addRecast({ name: 'Shadow Fang', time: recast.shadowfang * hutonModifier });
      addStatus({ name: 'Shadow Fang', id: actionMatch.groups.targetID });
      addStatus({ name: 'Shadow Fang' }); /* to ease calculations */
    } else {
      player.comboStep = 0;
    }
    ninNext({ gcd: player.gcd * hutonModifier, ogcd: 1 });
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
      addCountdown({ name: 'Mudra 1' });
      addCountdown({ name: 'Mudra 2' });
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
