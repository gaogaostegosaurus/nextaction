
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

const ninComboWeaponskills = [
  'Spinning Edge', 'Gust Slash', 'Aeolian Edge', 'Armor Crush', 'Death Blossom', 'Hakke Mujinsatsu',
];

const ninFinisherWeaponskills = [
  'Aeolian Edge', 'Armor Crush', 'Hakke Mujinsatsu',
];

const ninNinjutsu = [
  'Fuma Shuriken', 'Katon', 'Raiton', 'Hyoton', 'Huton', 'Doton', 'Suiton', 'Goka Mekkyaku',
  'Hyosho Ranryu', 'Rabbit Medium',
];

const ninWeave = () => {
  if (player.level >= 45 && next.trickattackRecast - next.elapsedTime < 0
  && next.suitonStatus - next.elapsedTime > 0) {
    ninArray.push({ name: 'Trick Attack', size: 'small' });
    next.suitonStatus = -1;
    next.trickattackRecast = 60000 + next.elapsedTime;
  } else if (player.level >= 72 && next.meisuiRecast - next.elapsedTime < 0
  && next.suitonStatus - next.elapsedTime > 0) {
    ninArray.push({ name: 'Meisui', size: 'small' });
    next.suitonStatus = -1;
    next.meisuiRecast = 120000 + next.elapsedTime;
  }
}


next.hutonModifier = 1;

const ninNext = ({
  time = recast.gcd * next.hutonModifier,
} = {}) => {
  // if (Date.now() - previous.ninNext < 100) {
  //   return;
  // }

  previous.ninNext = Date.now();
  // console.log(`${checkRecast({ name: 'Mudra 1' })} ${checkRecast({ name: 'Mudra 2' })}`);
  next.mudra1Recast = checkRecast({ name: 'Mudra 1' });
  next.mudra2Recast = checkRecast({ name: 'Mudra 2' });

  next.trickattackRecast = checkRecast({ name: 'Trick Attack' });
  next.trickattackStatus = checkStatus({ name: 'Trick Attack' }); // Added manually

  next.bunshinRecast = checkRecast({ name: 'Bunshin' });
  next.meisuiRecast = checkRecast({ name: 'Meisui' });
  next.tenchijinRecast = checkRecast({ name: 'Ten Chi Jin' });
  next.tenchijinStatus = checkStatus({ name: 'Ten Chi Jin' });
  // next.dreamwithinadreamRecast = checkRecast({ name: 'Dream Within A Dream' });
  next.kassatsuStatus = checkStatus({ name: 'Kassatsu' });
  next.kassatsuRecast = checkRecast({ name: 'Kassatsu' });
  // next.mugRecast = checkRecast({ name: 'Mug' });
  next.shadowfangRecast = checkRecast({ name: 'Shadow Fang' });
  //
  // next.assassinatereadyStatus = checkStatus({ name: 'Assassinate Ready' });
  next.suitonStatus = checkStatus({ name: 'Suiton' });
  next.hutonStatus = player.huton;
  next.ninki = player.ninki;
  next.comboStep = count.comboStep;
  // next.hutonStatus = player.huton;
  next.elapsedTime = time;

  // Calculate Ninki floor level to prevent overcap, maximize Bunshin
  // if (player.level >= 80) {
  //   if (next.bunshinRecast < next.meisuiRecast) {
  //     next.ninkiFloor = 0;
  //   } else if (next.bunshinRecast < next.mugRecast) {
  //     next.ninkiFloor = 10;
  //   } else {
  //     next.ninkiFloor = 50;
  //   }
  // } else {
  //   next.ninkiFloor = 0;
  // }

  // Display Ninki spenders
  // if (player.ninki >= next.ninkiFloor + 50 && !toggle.ninkiSpender) {
  //   if (player.level >= 80 && next.bunshinRecast < 0) {
  //     removeIcon({ name: 'Bhavacakra', iconArray: iconArrayC });
  //     removeIcon({ name: 'Hellfrog Medium', iconArray: iconArrayC });
  //     addIcon({ name: 'Bunshin', iconArray: iconArrayC });
  //     toggle.ninkiSpender = 3;
  //   } else if (player.level >= 68 && count.targets === 1) {
  //     toggle.ninkiSpender = 2;
  //     removeIcon({ name: 'Bunshin', iconArray: iconArrayC });
  //     removeIcon({ name: 'Hellfrog Medium', iconArray: iconArrayC });
  //     addIcon({ name: 'Bhavacakra', iconArray: iconArrayC });
  //   } else if (player.level >= 62) {
  //     removeIcon({ name: 'Bunshin', iconArray: iconArrayC });
  //     removeIcon({ name: 'Bhavacakra', iconArray: iconArrayC });
  //     addIcon({ name: 'Hellfrog Medium', iconArray: iconArrayC });
  //     toggle.ninkiSpender = 1;
  //   } else {
  //     removeIcon({ name: 'Bunshin', iconArray: iconArrayC });
  //     removeIcon({ name: 'Bhavacakra', iconArray: iconArrayC });
  //     removeIcon({ name: 'Hellfrog Medium', iconArray: iconArrayC });
  //     delete toggle.ninkiSpender;
  //   }
  // }

  // Show TCJ icon
  // if (player.level >= 70 && next.tenchijinRecast < 0 && !toggle.tenchijin) {
  //   if (player.level >= 72
  //   && next.meisuiRecast < 20000 + 1500 * 3 - recast.gcd * next.hutonModifier) {
  //     addIcon({ name: 'Ten Chi Jin', iconArray: iconArrayA });
  //     toggle.tenchijin = 2;
  //   } else if (player.level < 72) {
  //     addIcon({ name: 'Ten Chi Jin', iconArray: iconArrayA });
  //     toggle.tenchijin = 1;
  //   } else {
  //     removeIcon({ name: 'Ten Chi Jin', iconArray: iconArrayA });
  //     delete toggle.tenchijin;
  //   }
  // }
  //
  // // Show Kassatsu icon
  // if (player.level >= 50 && !toggle.kassatsu && next.kassatsuRecast < 0 && next.suitonStatus > 0
  // && next.trickattackRecast < 20000 - 500 * 2 - 1500 - recast.gcd * next.hutonModifier) {
  //   addIcon({ name: 'Kassatsu', iconArray: iconArrayA });
  //   toggle.kassatsu = 1;
  // } else {
  //   removeIcon({ name: 'Kassatsu', iconArray: iconArrayA });
  //   delete toggle.kassatsu;
  // }

  const ninArray = [];
  // console.log(`Trick Attack: ${checkRecast({ name: 'Trick Attack' }) - next.elapsedTime}`);
  // console.log(`Meisui: ${next.meisuiRecast - next.elapsedTime}`);
  do {
    if (next.hutonStatus - next.elapsedTime > 0) {
      next.hutonModifier = 85 / 100;
    } else {
      next.hutonModifier = 1;
    }

    if (next.tenchijinRecast - next.elapsedTime < 0 && next.kassatsuStatus - next.elapsedTime < 0
    && next.trickattackStatus - next.elapsedTime > 0) {
      ninArray.push({ name: 'Ten Chi Jin', size: 'small' });
      if (count.targets > 1) {
        // Suiton for upcoming Meisui
        ninArray.push({ name: 'Fuma Shuriken' });
        ninArray.push({ name: 'Katon' });
        ninArray.push({ name: 'Doton' });
      } else if (player.level >= 72 && next.meisuiRecast - next.elapsedTime < 20000) {
        // Suiton for upcoming Meisui
        ninArray.push({ name: 'Fuma Shuriken' });
        ninArray.push({ name: 'Raiton' });
        ninArray.push({ name: 'Suiton' });
        next.suitonStatus = 20000 - 4500 + next.elapsedTime;
      } else {
        // Suiton for whatevs
        ninArray.push({ name: 'Fuma Shuriken' });
        ninArray.push({ name: 'Raiton' });
        ninArray.push({ name: 'Suiton' });
        next.suitonStatus = 20000 - 4500 + next.elapsedTime;
      }
      next.tenchijinRecast = 120000 + next.elapsedTime;
      next.elapsedTime += 1500 * 3;
      // next.tenchijinStatus = -1;
    } else if (next.kassatsuRecast - next.elapsedTime < 0
    && next.suitonStatus - next.elapsedTime > 0) {
      ninArray.push({ name: 'Kassatsu', size: 'small' });
      next.kassatsuRecast = 60000 + next.elapsedTime;
      next.kassatsuStatus = 20000 + next.elapsedTime;
    } else if (next.kassatsuStatus - next.elapsedTime > 0
    && next.trickattackStatus - next.elapsedTime > 0) {
      // console.log(next.kassatsuStatus - next.elapsedTime);
      if (player.level >= 76) {
        if (count.targets > 1) {
          // Katon / Goka
          ninArray.push({ name: 'Goka Mekkyaku' });
        } else {
          ninArray.push({ name: 'Hyosho Ranryu' });
        }
      } else if (count.targets > 1) {
        // Katon / Goka
        ninArray.push({ name: 'Katon' });
      } else {
        // Raiton / Hyosho during trick
        ninArray.push({ name: 'Raiton' });
      }
      next.elapsedTime += 500 * 2 + 1500;
      next.kassatsuStatus = -1;
    } else if (player.level >= 45 && next.mudra1Recast - next.elapsedTime < 0
    && next.hutonStatus - next.elapsedTime - 500 * 3 < 0) {
      ninArray.push({ name: 'Huton' });
      next.mudra1Recast = next.mudra2Recast - next.elapsedTime;
      next.mudra2Recast = next.mudra2Recast + recast.mudra2 - next.elapsedTime;
      next.elapsedTime += 500 * 3 + 1500;
      next.hutonStatus = 70000 - 1500 + next.elapsedTime;
    } else if (player.level >= 45 && next.mudra1Recast - next.elapsedTime < 0
    && next.suitonStatus - next.elapsedTime < 0
    && next.trickattackRecast - next.elapsedTime < 20000) { // Lower seems periodically mess up
      ninArray.push({ name: 'Suiton' });
      next.mudra1Recast = next.mudra2Recast - next.elapsedTime;
      next.mudra2Recast = next.mudra2Recast + recast.mudra2 - next.elapsedTime;
      next.elapsedTime += 500 * 3 + 1500;
      next.suitonStatus = 20000 - 1500 + next.elapsedTime;
      next.trickattackRecast += 60000 + next.elapsedTime;
    } else if (player.level >= 72 && next.mudra1Recast - next.elapsedTime < 0
    && next.suitonStatus - next.elapsedTime < 0
    && next.meisuiRecast - next.elapsedTime < 20000) {
      ninArray.push({ name: 'Suiton' });
      next.mudra1Recast = next.mudra2Recast - next.elapsedTime;
      next.mudra2Recast = next.mudra2Recast + recast.mudra2 - next.elapsedTime;
      next.elapsedTime += 500 * 3 + 1500;
      next.suitonStatus = 20000 - 1500 + next.elapsedTime;
      next.meisuiRecast += 120000 + next.elapsedTime;
    } else if (player.level >= 45 && next.mudra2Recast - next.elapsedTime < 2500) {
      // Use other ninjutsu while keeping one charge active for Suiton actions
      if (count.targets > 1) {
        // Katon
        ninArray.push({ name: 'Katon' });
        next.mudra1Recast = next.mudra2Recast - next.elapsedTime;
        next.mudra2Recast = next.mudra2Recast + recast.mudra2 - next.elapsedTime;
        next.elapsedTime += 500 * 2 + 1500;
      } else {
        // Raiton
        ninArray.push({ name: 'Raiton' });
        next.mudra1Recast = next.mudra2Recast - next.elapsedTime;
        next.mudra2Recast = next.mudra2Recast + recast.mudra2 - next.elapsedTime;
        next.elapsedTime += 500 * 2 + 1500;
      }
    } else if (player.level >= 30 && next.shadowfangRecast - next.elapsedTime < 0
    && next.trickattackStatus - next.elapsedTime > 0) {
      ninArray.push({ name: 'Shadow Fang' });
      next.shadowfangRecast = recast.shadowfang * next.hutonModifier + next.elapsedTime;
      next.shadowfangStatus = duration.shadowfang + next.elapsedTime;
      if (player.level >= 78) {
        next.ninki = Math.min(next.ninki + 10, 100);
      } else {
        next.ninki = Math.min(next.ninki + 5, 100);
      }
      next.elapsedTime += recast.gcd * next.hutonModifier;
    } else if (player.level < 45 && next.mudra1Recast - next.elapsedTime < 0) {
      // Use on cooldown prior to 45
      if (player.level >= 35 && count.targets > 1) {
        ninArray.push({ name: 'Katon' });
        next.mudra1Recast = next.mudra2Recast - next.elapsedTime;
        next.mudra2Recast = next.mudra2Recast + recast.mudra2 - next.elapsedTime;
        next.elapsedTime += 500 * 2 + 1500;
      } else if (player.level >= 35) {
        // Raiton
        ninArray.push({ name: 'Raiton' });
        next.mudra1Recast = next.mudra2Recast - next.elapsedTime;
        next.mudra2Recast = next.mudra2Recast + recast.mudra2 - next.elapsedTime;
        next.elapsedTime += 500 * 2 + 1500;
      } else if (player.level >= 30) {
        ninArray.push({ name: 'Fuma Shuriken' });
        next.mudra1Recast = next.mudra2Recast - next.elapsedTime;
        next.mudra2Recast = next.mudra2Recast + recast.mudra2 - next.elapsedTime;
        next.elapsedTime += 500 * 1 + 1500;
      }
    } else if (player.level >= 52 && next.comboStep === 1 && count.targets >= 3) {
      ninArray.push({ name: 'Hakke Mujinsatsu' });
      next.ninki = Math.min(next.ninki + 5, 100);
      next.comboStep = 0;
      next.elapsedTime += recast.gcd * next.hutonModifier;
    } else if (player.level >= 38 && count.targets >= 3) {
      ninArray.push({ name: 'Death Blossom' });
      next.ninki = Math.min(next.ninki + 5, 100);
      next.comboStep = 1;
      next.elapsedTime += recast.gcd * next.hutonModifier;
    } else if (player.level >= 56 && next.comboStep === 2
      && next.hutonStatus - next.elapsedTime < 40000 + recast.gcd * next.hutonModifier
      && next.hutonStatus - next.elapsedTime > 0 + recast.gcd * next.hutonModifier) {
      ninArray.push({ name: 'Armor Crush' });
      next.hutonStatus = Math.min(
        next.hutonStatus + duration.armorcrush, duration.huton + next.elapsedTime,
      );
      if (player.level >= 78) {
        next.ninki = Math.min(next.ninki + 10, 100);
      } else {
        next.ninki = Math.min(next.ninki + 5, 100);
      }
      next.comboStep = 0;
      next.elapsedTime += recast.gcd * next.hutonModifier;
    } else if (player.level >= 26 && next.comboStep === 2) {
      ninArray.push({ name: 'Aeolian Edge' });
      if (player.level >= 78) {
        next.ninki = Math.min(next.ninki + 10, 100);
      } else {
        next.ninki = Math.min(next.ninki + 5, 100);
      }
      next.comboStep = 0;
      next.elapsedTime += recast.gcd * next.hutonModifier;
    } else if (next.comboStep === 1) {
      ninArray.push({ name: 'Gust Slash' });
      next.ninki = Math.min(next.ninki + 5, 100);
      next.comboStep = 2;
      next.elapsedTime += recast.gcd * next.hutonModifier;
    } else {
      ninArray.push({ name: 'Spinning Edge' });
      next.ninki = Math.min(next.ninki + 5, 100);
      next.comboStep = 1;
      next.elapsedTime += recast.gcd * next.hutonModifier;
    }
    // Adjust all cooldown/status info
  } while (next.elapsedTime < 20000);
  // console.log(JSON.stringify(iconArrayB));
  iconArrayB = ninArray;
  syncIcons();
  ninNextTimeout();
};

const ninNextTimeout = ({ time = 12500 } = {}) => {
  clearTimeout(timeout.next);
  timeout.next = setTimeout(ninNext, time);
};

onJobChange.NIN = () => {
  addCountdown({ name: 'Mudra 1' });
  addCountdown({ name: 'Mudra 2' });
  addCountdown({ name: 'Bunshin' });
  addCountdown({ name: 'Ten Chi Jin' });
  addCountdown({ name: 'Kassatsu' });
  addCountdown({ name: 'Trick Attack' });
  addCountdown({ name: 'Dream Within A Dream' });
  addCountdown({ name: 'Meisui' });
  addCountdown({ name: 'Mug' });
  ninNext();
};

onTargetChanged.NIN = () => {};

count.ninjutsu = 0;
count.comboStep = 0;
count.mudra = 0;

onAction.NIN = (actionMatch) => {
  removeIcon({ name: actionMatch.groups.actionName });

  // AoE checker
  if (['Death Blossom', 'Hakke Mujinsatsu', 'Katon', 'Goka Mekkyaku', 'Hellfrog Medium'].indexOf(actionMatch.groups.actionName) > -1) {
    countTargets({ name: actionMatch.groups.actionName });
  } else if (['Spinning Edge', 'Gust Slash', 'Aeolian Edge', 'Armor Crush'].indexOf(actionMatch.groups.actionName) > -1 && count.targets > 2) {
    count.targets = 2;
  } else if (['Raiton', 'Bhavacakra', 'Hyosho Ranryu'].indexOf(actionMatch.groups.actionName) > -1) {
    count.targets = 1;
  }

  if (['Ten', 'Chi', 'Jin'].indexOf(actionMatch.groups.actionName) > -1) {
    if (count.mudra === 0 && checkStatus({ name: 'Kassatsu' }) < 0) {
      if (checkRecast({ name: 'Mudra 2' }) > 0) {
        addRecast({ name: 'Mudra 1', time: checkRecast({ name: 'Mudra 2' }) });
        addCountdown({ name: 'Mudra 1' });
      }
      addRecast({ name: 'Mudra 2', time: checkRecast({ name: 'Mudra 2' }) + 20000 });
      addCountdown({ name: 'Mudra 2' });
    }
    count.mudra += 1;
  } else if (ninNinjutsu.indexOf(actionMatch.groups.actionName) > -1) {
    count.mudra = 0;
    removeStatus({ name: 'Kassatsu' });
    if (actionMatch.groups.actionName === 'Suiton') {
      addStatus({ name: 'Suiton' });
    }
    if (checkStatus({ name: 'Ten Chi Jin' }) > 0 && count.tenchijin < 3) {
      count.tenchijin += 1;
    } else {
      ninNext({ time: 1500 });
    }
  } else if (ninComboWeaponskills.indexOf(actionMatch.groups.actionName) > -1) {
    if (ninFinisherWeaponskills.indexOf(actionMatch.groups.actionName) > -1) {
      count.comboStep = 0;
    } else if (actionMatch.groups.actionName === 'Gust Slash' && player.level < 26) {
      count.comboStep = 0;
    } else if (actionMatch.groups.actionName === 'Gust Slash' && actionMatch.groups.result.length <= 6) {
      count.comboStep = 0;
    } else if (actionMatch.groups.actionName === 'Death Blossom' && player.level < 52) {
      count.comboStep = 0;
    } else if (actionMatch.groups.result.length < 6) {
      count.comboStep = 0;
    } else if (actionMatch.groups.actionName === 'Death Blossom') {
      count.comboStep = 1;
    } else if (actionMatch.groups.actionName === 'Spinning Edge') {
      count.comboStep = 1;
    } else if (actionMatch.groups.actionName === 'Gust Slash') {
      count.comboStep = 2;
    }
    ninNext();
  } else if (actionMatch.groups.actionName === 'Shadow Fang') {
    addRecast({ name: 'Shadow Fang' });
    addStatus({ name: 'Shadow Fang', id: actionMatch.groups.targetID });
    ninNext();
  } else if (actionMatch.groups.actionName === 'Kassatsu') {
    removeIcon({ name: 'Kassatsu', iconArray: iconArrayA });
    addRecast({ name: 'Kassatsu' });
    addStatus({ name: 'Kassatsu' });
    delete toggle.kassatsu;
    ninNext({ time: 1000 });
  } else if (actionMatch.groups.actionName === 'Ten Chi Jin') {
    removeIcon({ name: 'Ten Chi Jin', iconArray: iconArrayA });
    addRecast({ name: 'Ten Chi Jin' });
    addStatus({ name: 'Ten Chi Jin' });
    delete toggle.tenchijin;
    count.tenchijin = 0;
  } else if (['Hellfrog Medium', 'Bhavacakra', 'Bunshin'].indexOf(actionMatch.groups.actionName) > -1) {
    removeIcon({ name: 'Hellfrog Medium', iconArray: iconArrayC });
    removeIcon({ name: 'Bhavacakra', iconArray: iconArrayC });
    removeIcon({ name: 'Bunshin', iconArray: iconArrayC });
    if (actionMatch.groups.actionName === 'Bunshin') {
      addRecast({ name: 'Bunshin' });
    }
    delete toggle.ninkiSpender;
    // ninNext({ time: 0 });
  } else if (['Mug', 'Trick Attack', 'Dream Within A Dream', 'Meisui'].indexOf(actionMatch.groups.actionName) > -1) {
    // removeIcon({ name: actionMatch.groups.actionName, iconArray: iconArrayC });
    addRecast({ name: actionMatch.groups.actionName });
    addCountdown({ name: actionMatch.groups.actionName });
    if (actionMatch.groups.actionName === 'Hide') {
      addRecast({ name: 'Mudra 1', time: -1 });
      addRecast({ name: 'Mudra 2', time: -1 });
      addCountdown({ name: 'Mudra 1' });
      addCountdown({ name: 'Mudra 2' });
    } else if (actionMatch.groups.actionName === 'Trick Attack') {
      addStatus({ name: 'Trick Attack' });
    }
    ninNext({ time: 1000 });
  }
};

onStatus.NIN = (statusMatch) => {
  if (statusMatch.groups.gainsLoses === 'gains') {
    addStatus({
      name: statusMatch.groups.statusName,
      time: parseFloat(statusMatch.groups.statusDuration) * 1000,
      id: statusMatch.groups.targetID,
    });
    // console.log(`${statusMatch.groups.statusName}: ${checkStatus({ name: statusMatch.groups.statusName, id: statusMatch.groups.targetID })}`);

    // Status-specific stuff
    // if (statusMatch.groups.statusName === 'Mudra' && count.mudra === 0 && checkStatus({ name: 'Kassatsu' }) < 0) {
    //   if (checkRecast({ name: 'Mudra 2' }) > 0) {
    //     addRecast({ name: 'Mudra 1', time: checkRecast({ name: 'Mudra 2' }) });
    //     addCountdown({ name: 'Mudra 1' });
    //   }
    //   addRecast({ name: 'Mudra 2', time: checkRecast({ name: 'Mudra 2' }) + 20000 });
    //   addCountdown({ name: 'Mudra 2' });
    //   count.mudra += 1;
    // } else if (statusMatch.groups.statusName === 'Kassatsu') {
    //   ninNext({ time: 1500 });
    // } else if (statusMatch.groups.statusName === 'Ten Chi Jin') {
    //   ninNext({ time: 1500 });
    // }
  } else {
    removeStatus({ name: statusMatch.groups.statusName, id: statusMatch.groups.targetID });
    // if (statusMatch.groups.statusName === 'Mudra') {
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



// function ninOnAction2(actionMatch) {
//
//   // console.log("Logline")
//
//   // Everything breaks Mudra "combo" so list it first
//   // Not sure what to do with this
//
//   if (['Ten', 'Chi', 'Jin'].indexOf(actionMatch.groups.actionName) > -1) {
//     if (!toggle.mudra) {
//       toggle.mudra = Date.now();
//       if (checkRecast({ name: 'mudra2' }) > 0) {
//         addRecast({ name: 'mudra2' });
//       } else {
//         addRecast({ name: 'mudra1', time: checkRecast({ name: 'mudra2' }) });
//         addRecast({ name: 'mudra2', time: checkRecast({ name: 'mudra2' }) + 20000 });
//       }
//     }
//   }
//   else { // Off-GCD actions
//
//     delete toggle.mudra;
//
//     if ("Hide" == actionMatch.groups.actionName) {
//       removeIcon("tenchijin");
//       addRecast("hide");
//       addRecast("ninjutsu", -1);
//       addCountdown({name: "ninjutsu", time: -1});
//       clearTimeout(timeout.ninjutsu);
//       ninNinjutsu();
//     }
//
//     else if ("Mug" == actionMatch.groups.actionName) {
//       ninNinki();
//     }
//
//     else if ("Trick Attack" == actionMatch.groups.actionName) {
//       addCountdown({name: "trickattack"});
//     }
//
//     else if (["Raiton", "Hyosho Ranyu"].indexOf(actionMatch.groups.actionName) > -1) {
//       count.targets = 1;
//     }
//
//     else if (["Katon", "Goka Mekkyaku"].indexOf(actionMatch.groups.actionName) > -1) {
//       if (Date.now() - previous.katon > 1000) {
//         previous.katon = Date.now()
//         count.targets = 1;
//       }
//       else {
//         count.targets = count.targets + 1;
//       }
//     }
//
//     else if ("Suiton" == actionMatch.groups.actionName) {
//       addStatus("suiton");
//     }
//
//     else if ("Kassatsu" == actionMatch.groups.actionName) {
//
//       removeIcon("kassatsu");
//       addStatus("kassatsu");
//
//       if (checkRecast("kassatsu2") < 0) {
//         addRecast("kassatsu2", recast.kassatsu);
//         addRecast("kassatsu1", -1);
//       }
//       else {
//         addRecast("kassatsu1", checkRecast("kassatsu2"));
//         addRecast("kassatsu2", checkRecast("kassatsu2") + recast.kassatsu);
//         addCountdown({name: "kassatsu", time: checkRecast("kassatsu1"), oncomplete: "addIcon"});
//       }
//
//       addCountdown({name: "ninjutsu", time: -1});
//       clearTimeout(timeout.ninjutsu);
//       ninNinjutsu();
//     }
//
//     else if ("Dream Within A Dream" == actionMatch.groups.actionName) {
//       removeIcon("dreamwithinadream");
//       addCountdown({name: "dreamwithinadream", time: recast.dreamwithinadream, oncomplete: "addIcon"});
//       addStatus("assassinateready");
//     }
//
//     else if ("Hellfrog Medium" == actionMatch.groups.actionName) {
//       if (Date.now() - previous.hellfrogmedium > 1000) {
//         previous.hellfrogmedium = Date.now()
//         count.targets = 1;
//       }
//       else {
//         count.targets = count.targets + 1;
//       }
//       ninNinki();
//     }
//
//     else if ("Bhavacakra" == actionMatch.groups.actionName) {
//       count.targets = 1;
//       ninNinki();
//     }
//
//     else if ("Ten Chi Jin" == actionMatch.groups.actionName) {
//       removeIcon("tenchijin");
//       addStatus("tenchijin");
//       addCountdown({name: "tenchijin"});
//       addRecast("ninjutsu", -1);
//       addCountdown({name: "ninjutsu", time: -1});
//       clearTimeout(timeout.ninjutsu);
//       ninNinjutsu();
//     }
//
//     else if ("Meisui" == actionMatch.groups.actionName) {
//       addCountdown({name: "meisui"});
//       ninNinki();
//     }
//
//     else { // Weaponskills and combos (hopefully)
//
//       if (actionMatch.groups.actionName == "Spinning Edge"
//       && actionMatch.groups.result.length >= 2) {
//
//         if ([1, 2, 3].indexOf(next.combo) == -1) {
//           if (player.level >= 38
//             && checkStatus("shadowfang", target.ID) < 9000) {
//               ninShadowFangCombo();
//             }
//             else if (player.level >= 54
//               && player.huton > 6000
//               && player.huton < 46000) {
//                 ninArmorCrushCombo();
//               }
//               else {
//                 ninAeolianEdgeCombo();
//               }
//             }
//             removeIcon("spinningedge");
//             toggle.combo = Date.now();
//           }
//
//           else if ("Gust Slash" == actionMatch.groups.actionName
//           && actionMatch.groups.result.length >= 8) {
//
//             if ([1, 2].indexOf(next.combo) == -1) {
//               if (player.level >= 54
//                 && player.huton > 6000
//                 && player.huton < 46000) {
//                   ninArmorCrushCombo();
//                 }
//                 else {
//                   ninAeolianEdgeCombo();
//                 }
//               }
//               removeIcon("spinningedge");
//               removeIcon("gustslash");
//
//               if (player.level < 26) {
//                 ninCombo();
//               }
//             }
//
//             else if ("Shadow Fang" == actionMatch.groups.actionName
//             && actionMatch.groups.result.length >= 8) {
//               addStatus("shadowfang", duration.shadowfang, actionMatch.groups.targetID);
//               ninCombo();
//             }
//
//             else if ("Death Blossom" == actionMatch.groups.actionName
//             && actionMatch.groups.result.length >= 2) {
//
//               if (Date.now() - previous.deathblossom > 1000) {
//                 previous.deathblossom = Date.now()
//                 count.targets = 1;
//                 if (next.combo != 4) {
//                   ninHakkeMujinsatsuCombo();
//                 }
//                 removeIcon("deathblossom");
//                 if (player.level < 52) {
//                   ninCombo();
//                 }
//               }
//               else {
//                 count.targets = count.targets + 1;
//               }
//             }
//
//             else if ("Hakke Mujinsatsu" == actionMatch.groups.actionName
//             && actionMatch.groups.result.length == 8) {
//
//               if (Date.now() - previous.hakkemujinsatsu > 1000) {
//                 previous.hakkemujinsatsu = Date.now()
//                 count.targets = 1;
//                 ninCombo();
//               }
//               else {
//                 count.targets = count.targets + 1;
//               }
//             }
//
//             else {
//               ninCombo();
//             }
//
//             // Recalculate optimal Ninjutsu after every GCD
//             if (checkRecast("ninjutsu") < 1000) {
//               ninNinjutsu();
//             }
//
//             // Check Ninki after all GCD actions
//             if (player.level >= 62) {
//               ninNinki();
//             }
//           }
//         }
//       }
//
//       const ninOnStatus = (statusMatch) => {
//         if (statusMatch.groups.gainsLoses === 'gains') {
//           addStatus({
//             name: statusMatch.groups.statusName,
//             time: parseFloat(statusMatch.groups.statusDuration) * 1000,
//           });
//
//           if (statusMatch.groups.statusName ===  'Mudra') {
//
//           }
//           else if (statusMatch.groups.statusName ===  'Suiton') {
//
//           }
//         }
//
//
//         // else if ("Doton" == statusLog.groups.statusName) {
//           //   if ("gains" == statusLog.groups.gainsLoses) {
//             //     addStatus("doton", parseInt(statusLog.groups.effectDuration) * 1000, statusLog.groups.targetID);
//             //   }
//             //   else if ("loses" == statusLog.groups.gainsLoses) {
//               //     removeStatus("doton", statusLog.groups.targetID);
//               //   }
//               // }
//
//               else if ("Suiton" == statusLog.groups.statusName) {
//                 if ("gains" == statusLog.groups.gainsLoses) {
//                   addStatus("suiton", parseInt(statusLog.groups.effectDuration) * 1000);
//                   if (checkStatus("suiton") > checkRecast("trickattack")) {
//
//                   }
//                   else if (checkStatus("suiton") > checkRecast("meisui")) {
//
//                   }
//                 }
//                 else if ("loses" == statusLog.groups.gainsLoses) {
//                   removeStatus("suiton", statusLog.groups.targetID);
//                 }
//               }
//
//               else if ("Kassatsu" == statusLog.groups.statusName) {
//                 if ("gains" == statusLog.groups.gainsLoses) {
//                   addStatus("kassatsu", parseInt(statusLog.groups.effectDuration) * 1000);
//                   if (player.level >= 76) {
//                     icon.katon = icon.gokamekkyaku;
//                     icon.raiton = icon.hyoshoranyu;  // This isn't how it really upgrades, but  this happens in practice
//                     icon.hyoton = icon.hyoshoranyu;  // Just in case for later
//                   }
//                 }
//                 else if ("loses" == statusLog.groups.gainsLoses) {
//                   removeStatus("kassatsu");
//                   icon.katon = "002908";
//                   icon.raiton = "002912";
//                   icon.hyoton = "002909";
//                   // addRecast("ninjutsu", statusLog.groups.targetID, recast.ninjutsu);
//                   // clearTimeout(timeout.ninjutsu);
//                   // timeout.ninjutsu = setTimeout(ninNinjutsu, recast.ninjutsu - 1000);
//                 }
//               }
//
//               else if ("Ten Chi Jin" == statusLog.groups.statusName) {
//                 if ("gains" == statusLog.groups.gainsLoses) {
//                   addStatus("tenchijin", parseInt(statusLog.groups.effectDuration) * 1000);
//                 }
//                 else if ("loses" == statusLog.groups.gainsLoses) {
//                   ninLosesMudra()
//                 }
//               }
//             }
//
//             else {
//               if ("Shadow Fang" == statusLog.groups.statusName) {
//                 if ("gains" == statusLog.groups.gainsLoses) {
//                   addStatus("shadowfang", parseInt(statusLog.groups.effectDuration) * 1000, statusLog.groups.targetID);
//                   if (target.ID == statusLog.groups.targetID) {  // Might be possible to switch targets between application to target and log entry
//                     addCountdown({name: "shadowfang", time: checkStatus("shadowfang"), text: target.ID});
//                   }
//                 }
//                 else if ("loses" == statusLog.groups.gainsLoses) {
//                   removeStatus("shadowfang", statusLog.groups.targetID);
//                 }
//               }
//             }
//           }
// function ninCombo() {
//
//   delete toggle.combo;
//   removeIcon("spinningedge");
//   removeIcon("gustslash");
//   removeIcon("aeolianedge");
//
//   if (player.level >= 54
//   && count.targets <= 2
//   && player.huton > 6000
//   && player.huton < 46000) {
//     ninArmorCrushCombo();
//   }
//   else if (player.level >= 38
//   && count.targets <= 3
//   && checkStatus("shadowfang", target.ID) < 9000) {
//     ninShadowFangCombo();
//   }
//   else if (player.level >= 38
//   && count.targets >= 3
//   && player.huton > 3000) {
//     ninHakkeMujinsatsuCombo();
//   }
//   else {
//     ninAeolianEdgeCombo();
//   }
// }
//
// function ninAeolianEdgeCombo() {
//   next.combo = 1;
//   addIcon({name: "spinningedge"});
//   addIcon({name: "gustslash"});
//   if (player.level >= 26) {
//     addIcon({name: "aeolianedge"});
//   }
// }
//
// function ninArmorCrushCombo() {
//   next.combo = 2;
//   addIcon({name: "spinningedge"});
//   addIcon({name: "gustslash"});
//   addIcon({name: "armorcrush"});
// }
//
// function ninShadowFangCombo() {
//   next.combo = 3;
//   addIcon({name: "spinningedge"});
//   addIcon({name: "shadowfang"});
// }
//
// function ninHakkeMujinsatsuCombo() {
//   next.combo = 4;
//   addIcon({name: "deathblossom"});
//   if (player.level >= 52) {
//     addIcon({name: "hakkemujinsatsu"});
//   }
// }
//
// function ninLosesMudra() {
//   removeIcon("ninjutsu1");
//   removeIcon("ninjutsu2");
//   removeIcon("ninjutsu3");
//   addCountdown({name: "ninjutsu"});
//   clearTimeout(timeout.ninjutsu);
//   timeout.ninjutsu = setTimeout(ninNinjutsu, recast.ninjutsu - 1000);
//   if (checkRecast("kassatsu1") < 0) {
//     addIcon({name: "kassatsu"});
//   }
//   if (checkRecast("tenchijin") < 0) {
//     addIcon({name: "tenchijin"});
//   }
// }
//
//
// const ninPushMug = ({ array = iconArrayB } = {}) => {
//   array.push({ name: 'mug', img: 'mug', size: 'small' });
//   next.mugRecast = recast.mug + next.elapsedTime;
//   if (player.level >= 66) {
//     next.ninki = Math.min(next.ninki + 40, 100);
//   }
// };
//
// const ninPushTrickAttack = ({ array = iconArrayB } = {}) => {
//   if (player.level >= 80 && next.bunshinRecast - next.elapsedTime < 0) {
//     return;
//   }
//   array.push({ name: 'trickattack', img: 'trickattack', size: 'small' });
//   next.trickattackRecast = recast.trickattack + next.elapsedTime;
//   next.trickattackStatus = duration.trickattack + next.elapsedTime;
//   next.suitonStatus = -1;
// };
//
// const ninPushKassatsu = ({ array = iconArrayB } = {}) => {
//   array.push({ name: 'kassatsu', img: 'kassatsu', size: 'small' });
//   next.kassatsuRecast = recast.kassatsu + next.elapsedTime;
//   next.kassatsuStatus = duration.kassatsu + next.elapsedTime;
// };
//
// const ninPushDreamWithinaDream = ({ array = iconArrayB } = {}) => {
//   array.push({ name: 'dreamwithinadream', img: 'dreamwithinadream', size: 'small' });
//   next.dreamwithinadreamRecast = recast.dreamwithinadream + next.elapsedTime;
//   if (player.level >= 60) {
//     next.assassinatereadyStatus = duration.assassinateready + next.elapsedTime;
//   }
// };
//
// const ninPushAssassinate = ({ array = iconArrayB } = {}) => {
//   array.push({ name: 'assassinate', img: 'assassinate', size: 'small' });
//   next.assassinatereadyStatus = -1;
// };
//
// const ninPushBhavacakra = ({ array = iconArrayB } = {}) => {
//   array.push({ name: 'bhavacakra', img: 'bhavacakra', size: 'small' });
//   next.ninki -= 50;
// };
//
// const ninPushHellfrogMedium = ({ array = iconArrayB } = {}) => {
//   array.push({ name: 'hellfrogmedium', img: 'hellfrogmedium', size: 'small' });
//   next.ninki -= 50;
// };
//
// const ninPushTenChiJin = ({ array = iconArrayB } = {}) => {
//   array.push({ name: 'tenchijin', img: 'tenchijin', size: 'small' });
//   next.tenchijinRecast = recast.tenchijin + next.elapsedTime;
//   next.tenchijinStatus = duration.tenchijin + next.elapsedTime;
//   ninPushNinjutsu();
// };
//
// const ninPushMeisui = ({ array = iconArrayB } = {}) => {
//   array.push({ name: 'meisui', img: 'meisui', size: 'small' });
//   next.meisuiRecast = recast.meisui + next.elapsedTime;
//   next.ninki = Math.min(next.ninki + 50, 100);
//   next.suitonStatus = -1;
// };
//
// const ninPushBunshin = ({ array = iconArrayB } = {}) => {
//   array.push({ name: 'bunshin', img: 'bunshin', size: 'small' });
//   next.bunshinRecast = recast.bunshin + next.elapsedTime;
//   next.bunshinStatus = duration.bunshin + next.elapsedTime;
//   next.ninki -= 50;
// };
//
// const ninPushWeave = ({
//   array = iconArrayB,
// } = {}) => {
//   if (player.level >= 80 && next.ninki >= 50
//     && next.trickattackRecast - next.elapsedTime < 15000
//     && next.bunshinRecast - next.elapsedTime < 0) {
//     ninPushBunshin();
//   } else if (player.level >= 70 && next.trickattackStatus - next.elapsedTime > 0
//     && next.kassatsuStatus - next.elapsedTime < 0
//     && next.tenchijinRecast - next.elapsedTime < 0) {
//     ninPushTenChiJin();
//   } else if (player.level >= 50 && next.trickattackRecast - next.elapsedTime < 20000
//     && next.suitonStatus - next.elapsedTime > 0
//     && next.kassatsuRecast - next.elapsedTime < 0) {
//     ninPushKassatsu();
//   } else if (player.level >= 45 && next.suitonStatus - next.elapsedTime > 0
//     && next.suitonStatus - next.elapsedTime > 0
//     && next.trickattackRecast - next.elapsedTime < 0) {
//     ninPushTrickAttack();
//   } else if (next.trickattackStatus - next.elapsedTime > 0
//     && next.assassinatereadyStatus - next.elapsedTime > 0) {
//     ninPushAssassinate();
//   } else if (player.level >= 56 && next.trickattackStatus - next.elapsedTime > 0
//     && next.dreamwithinadreamRecast - next.elapsedTime > 0) {
//     ninPushDreamWithinaDream();
//   } else if (player.level >= 72 && next.ninki < 50 && next.suitonStatus - next.elapsedTime > 0
//     && next.meisuiRecast - next.elapsedTime < 0) {
//     ninPushMeisui();
//   } else if (player.level >= 66 && next.mugRecast - next.elapsedTime < 0 && next.ninki < 60) {
//     ninPushMug();
//   } else if (player.level >= 68 && next.ninki >= 50 + next.ninkiFloor && count.targets === 1) {
//     ninPushBhavacakra();
//   } else if (player.level >= 62 && next.ninki >= 50 + next.ninkiFloor && count.targets > 1) {
//     ninPushHellfrogMedium();
//   } else if (player.level < 66 && next.mugRecast - next.elapsedTime < 0) {
//     ninPushMug();
//   }
// };
//
//
// const ninAeolianEdge = ({ array = iconArrayB } = {}) => {
//   array.push({ name: 'Spinning Edge', img: 'spinningedge' });
//   next.ninki = Math.min(next.ninki + 5, 100);
//   next.elapsedTime += recast.gcd * next.hutonModifier;
//   ninNinjutsu();
//   array.push({ name: 'Gust Slash', img: 'gustslash' });
//   next.ninki = Math.min(next.ninki + 5, 100);
//   next.elapsedTime += recast.gcd * next.hutonModifier;
//   ninNinjutsu();
//   if (player.level >= 26) {
//     array.push({ name: 'Aeolian Edge', img: 'aeolianedge' }); // Add Armor Crush
//     if (player.level >= 78) {
//       next.ninki = Math.min(next.ninki + 10, 100);
//     } else {
//       next.ninki = Math.min(next.ninki + 5, 100);
//     }
//     next.elapsedTime += recast.gcd * next.hutonModifier;
//     ninNinjutsu();
//   }
// };
//
// const ninArmorCrush = ({ array = iconArrayB } = {}) => {
//   array.push({ name: 'Armor Crush', img: 'armorcrush' }); // Add Armor Crush
//   if (player.level >= 78) {
//     next.ninki = Math.min(next.ninki + 10, 100);
//   } else {
//     next.ninki = Math.min(next.ninki + 5, 100);
//   }
//   next.hutonStatus = Math.min(next.hutonStatus + duration.armorcrush,
//     duration.huton + next.elapsedTime);
//   next.elapsedTime += recast.gcd * next.hutonModifier;
//   ninNinjutsu();
// };
//
// const ninShadowFang = ({ array = iconArrayB } = {}) => {
//   array.push({ name: 'Shadow Fang', img: 'shadowfang' });
//   next.shadowfangRecast = recast.shadowfang + next.elapsedTime;
//   next.shadowfangStatus = duration.shadowfang + next.elapsedTime;
//   if (player.level >= 78) {
//     next.ninki = Math.min(next.ninki + 10, 100);
//   } else {
//     next.ninki = Math.min(next.ninki + 5, 100);
//   }
//   next.elapsedTime += recast.gcd * next.hutonModifier;
//   ninNinjutsu();
// };
