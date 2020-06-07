
const mchSingleTarget = [
  'Split Shot', 'Slug Shot', 'Hot Shot', 'Clean Shot',
  'Heated Split Shot', 'Heated Slug Shot', 'Heated Clean Shot',
  'Drill', 'Air Anchor', 'Heat Blast',
];

const mchMultiTarget = [
  'Spread Shot', 'Auto Crossbow', 'Bioblaster',
];

const mchComboWeaponskills = [
  'Split Shot', 'Slug Shot', 'Heated Split Shot', 'Heated Slug Shot',
];

const mchFinisherWeaponskills = [
  'Clean Shot', 'Heated Clean Shot', 'Spread Shot',
];

const mchRecastWeaponskills = [
  'Hot Shot', 'Drill', 'Flamethrower', 'Bioblaster', 'Air Anchor',
  /* Flamethrower isn't actually a weaponskill, but basically acts like one */
];

const mchOverheatedWeaponskills = [
  'Heat Blast', 'Auto Crossbow',
];

const mchCooldowns = [
  'Reassemble', 'Wildfire', 'Barrel Stabilizer',
  'Gauss Round', 'Ricochet',
  'Hypercharge', 'Rook Autoturret', 'Automaton Queen',
];

actionList.MCH = [...new Set([
  ...mchComboWeaponskills,
  ...mchFinisherWeaponskills,
  ...mchRecastWeaponskills,
  ...mchOverheatedWeaponskills,
  ...mchCooldowns,
])];

statusList.MCH = [
  'Reassemble', 'Wildfire', 'Flamethrower',
];

castingList.MCH = []; /* Prevent listener from complaining */

const mchNextWeaponskill = ({
  comboStatus, /* Checks if the function is called too late */
  comboStep,
  // overheated,
} = {}) => {
  if (player.level >= 18 && player.targetCount >= 3) {
    return 'Spread Shot';
  } else if (player.level >= 64 && comboStep === 'Heated Slug Shot' && comboStatus > player.gcd) {
    return 'Heated Clean Shot';
  } else if (player.level >= 26 && ['Slug Shot', 'Heated Slug Shot'].includes(comboStep)
  && comboStatus > player.gcd) {
    return 'Clean Shot';
  } else if (player.level >= 60 && comboStep === 'Heated Split Shot' && comboStatus > player.gcd) {
    return 'Heated Slug Shot';
  } else if (player.level >= 2 && ['Split Shot', 'Heated Split Shot'].includes(comboStep)
  && comboStatus > player.gcd) {
    return 'Slug Shot';
  } else if (player.level >= 54) {
    return 'Heated Split Shot';
  }
  return 'Split Shot';
};

const mchNextGCD = ({
  comboStatus,
  comboStep,
  drillRecast,
  flamethrowerRecast,
  hotshotRecast,
  overheated,
  wildfireStatus,
} = {}) => {
  /* Prevent breaking combo */
  if (comboStatus > 0 && comboStatus < player.gcd * 2) {
    return mchNextWeaponskill({ comboStep, comboStatus });
  }

  /* Use Hypercharge weaponskills */
  /* Remember that next action will take place in 1500 seconds (not 0) */
  if (player.level >= 35 && overheated > 1500) {
    if (player.level >= 52 && player.targetCount >= 3) {
      return 'Auto Crossbow';
    } return 'Heat Blast';
  }

  /* Prioritize getting Bioblaster/Drill and Hotshot/Anchor out */
  /* Don't use at end of Wildfire */
  if (player.level >= 58 && (wildfireStatus > 1500 * 4 + 2500 || wildfireStatus < 0)
  && drillRecast < 0) {
    if (player.level >= 72 && player.targetCount >= 2) {
      return 'Bioblaster';
    } return 'Drill';
  } else if (player.level >= 76 && (wildfireStatus > 1500 * 4 + 2500 || wildfireStatus < 0)
  && hotshotRecast < 0) {
    return 'Air Anchor';
  }

  /* Flamethrower is better than Spread in AoE */
  if (player.level >= 70 && player.targetCount >= 2 && flamethrowerRecast < 0) {
    return 'Flamethrower';
  }

  /* Honestly dunno where this is supposed to go... */
  if (player.level >= 4 && player.level < 76 && hotshotRecast < 0) {
    return 'Hot Shot';
  }

  /* Combo */
  return mchNextWeaponskill({ comboStep, comboStatus });
};


const mchNextOGCD = ({
  barrelstabilizerRecast,
  battery,
  comboStatus,
  comboStep,
  drillRecast,
  gaussround1Recast,
  gaussround2Recast,
  gaussround3Recast,
  gcdTime,
  heat,
  hotshotRecast,
  hyperchargeRecast,
  overheated,
  reassembleRecast,
  ricochet1Recast,
  ricochet2Recast,
  ricochet3Recast,
  wildfireRecast,
  wildfireStatus,
} = {}) => {
  /* Use Reassemble right before Drill or Air Anchor, or just on cooldown during AoE */
  if (player.level >= 18 && player.targetCount >= 3 && drillRecast > player.gcd
  && reassembleRecast < 0) {
    return 'Reassemble';
  } else if (player.level >= 10 && drillRecast < player.gcd && overheated < 0
  && reassembleRecast < 0) {
    return 'Reassemble';
  } else if (player.level >= 76 && hotshotRecast < player.gcd && overheated < 0
  && reassembleRecast < 0) {
    return 'Reassemble';
  }

  /* Use stack 3 of Gauss/Ricochet */
  if (player.level >= 50 && ricochet3Recast < 0) {
    return 'Ricochet';
  } else if (player.level >= 15 && gaussround3Recast < 0) {
    return 'Gauss Round';
  }

  /* Use Barrel Stabilizer */
  if (player.level >= 66 && heat < 50 && barrelstabilizerRecast < 0) {
    return 'Barrel Stabilizer';
  }

  /* Use stack 2 of Gauss/Ricochet */
  if (player.level >= 50 && ricochet2Recast < 0) {
    return 'Ricochet';
  } else if (player.level >= 15 && gaussround2Recast < 0) {
    return 'Gauss Round';
  }

  /* Maximize Wildfire uses */
  if (player.level >= 45 && heat >= 50 && hyperchargeRecast < 0 && wildfireRecast < 0) {
    /* Use Wildfire immediately if Hypercharge looks ready */
    /* Will probably(?) place Hypercharge in second OGCD slot */
    return 'Wildfire';
  } else if (player.level >= 45 && gcdTime <= 1500 && wildfireRecast < 0) {
    /* Use Hypercharge on cooldown in second OGCD slot */
    return 'Wildfire';
  }

  /* Maximize Hypercharge uses */
  /* gcdTime <= 1500 keeps it in second weave slot */
  if (player.level >= 30 && heat >= 50 && (wildfireStatus > 0 || wildfireRecast < 1500)
  && gcdTime <= 1500 && comboStatus > 1500 * 6 && hyperchargeRecast < 0) {
    /* Use Hypercharge immediately if Wildfire is up or about to be up */
    /* wildfireRecast < 1500 so that it is definitely in the next Heat Blast OGCD */
    return 'Hypercharge';
  } else if (player.level >= 30 && heat >= 50
  && (heat === 100 || barrelstabilizerRecast < wildfireRecast) && wildfireRecast > 10000
  && gcdTime <= 1500 && comboStatus > 1500 * 6 && hyperchargeRecast < 0) {
    /* Use Hypercharge if unlikely(?) to miss a Wildfire window */
    return 'Hypercharge';
  }

  /* Use Gauss/Ricochet */
  if (player.level >= 50 && ricochet1Recast < 0) {
    return 'Ricochet';
  } else if (player.level >= 15 && gaussround1Recast < 0) {
    return 'Gauss Round';
  }

  /* Reassemble before most powerful GCD available before Drill */
  if (player.level >= 26 && player.level < 58 && comboStep === 'Slug Shot'
  && reassembleRecast < 0) {
    return 'Reassemble';
  } else if (player.level >= 10 && player.level < 26 && comboStep === 'Split Shot'
  && reassembleRecast < 0) {
    return 'Reassemble';
  }

  /* Rook/Queen at 50 battery */
  if (battery > 50) {
    if (player.level >= 80) {
      return 'Automaton Queen';
    } return 'Rook Autoturret';
  }

  /* No OGCDs available */
  return '';
};

const mchNext = ({
  gcd = 0,
} = {}) => {
  let gcdTime = gcd;
  let nextTime = 0; /* Tracks how "long" the loop has lasted */

  let comboStep = player.comboStep;
  let heat = player.heat;
  let overheated = player.overheated;
  let battery = player.battery;

  let barrelstabilizerRecast = checkRecast({ name: 'Barrel Stabilizer' });
  let comboStatus = checkStatus({ name: 'Combo' });
  let drillRecast = checkRecast({ name: 'Drill' });
  let flamethrowerRecast = checkRecast({ name: 'Flamethrower' });
  let flamethrowerStatus = checkStatus({ name: 'Flamethrower' });
  let gaussround1Recast = checkRecast({ name: 'Gauss Round 1' });
  let gaussround2Recast = checkRecast({ name: 'Gauss Round 2' });
  let gaussround3Recast = checkRecast({ name: 'Gauss Round 3' });
  let hotshotRecast = checkRecast({ name: 'Hot Shot' });
  let hyperchargeRecast = checkRecast({ name: 'Hypercharge' });
  let reassembleRecast = checkRecast({ name: 'Reassemble' });
  // let reassembleStatus = checkStatus({ name: 'Reassemble' });
  let ricochet1Recast = checkRecast({ name: 'Ricochet 1' });
  let ricochet2Recast = checkRecast({ name: 'Ricochet 2' });
  let ricochet3Recast = checkRecast({ name: 'Ricochet 3' });
  let wildfireRecast = checkRecast({ name: 'Wildfire' });
  let wildfireStatus = checkStatus({ name: 'Wildfire' });

  const mchArray = [];

  while (nextTime < 30000) {
    let loopTime = 0;

    /* If no time for OGCD, use GCD */
    if (gcdTime <= 1000) {
      const nextGCD = mchNextGCD({
        comboStatus,
        comboStep,
        drillRecast,
        flamethrowerRecast,
        hotshotRecast,
        overheated,
        wildfireStatus,
      });

      mchArray.push({ name: nextGCD });

      /* Combo */
      if (mchComboWeaponskills.includes(nextGCD)) {
        if (player.level < 2) {
          comboStatus = 0;
          comboStep = '';
        } else if (player.level < 26 && nextGCD === 'Slug Shot') {
          comboStatus = 0;
          comboStep = '';
        } else {
          comboStatus = duration.combo;
          comboStep = nextGCD;
        }
      } else if (mchFinisherWeaponskills.includes(nextGCD)) {
        comboStatus = 0;
        comboStep = '';
      }

      /* Recast */
      if (['Drill', 'Bioblaster'].includes(nextGCD)) {
        drillRecast = recast.drill;
      } else if (['Hot Shot', 'Air Anchor'].includes(nextGCD)) {
        hotshotRecast = recast.hotshot;
      } else if (['Flamethrower'].includes(nextGCD)) {
        flamethrowerRecast = recast.flamethrower;
        flamethrowerStatus = duration.flamethrower;
      } else if (nextGCD === 'Heat Blast') {
        gaussround1Recast -= 15000;
        gaussround2Recast -= 15000;
        gaussround3Recast -= 15000;
        ricochet1Recast -= 15000;
        ricochet2Recast -= 15000;
        ricochet3Recast -= 15000;
      }

      /* Heat and Battery */
      if (mchComboWeaponskills.includes(nextGCD) || mchFinisherWeaponskills.includes(nextGCD)) {
        heat = Math.min(heat + 5, 100);
        if (['Clean Shot', 'Heated Clean Shot'].includes(nextGCD)) {
          battery = Math.min(battery + 10, 100);
        }
      } else if (['Hot Shot', 'Air Anchor'].includes(nextGCD)) {
        battery = Math.min(battery + 20, 100);
      }

      /* GCD */
      if (mchOverheatedWeaponskills.includes(nextGCD)) {
        gcdTime = 1500;
      } else if (nextGCD === 'Flamethrower') {
        gcdTime = 0;
      } else {
        gcdTime = player.gcd;
      }

      /* Loop */
      loopTime = gcdTime; /* Sets current loop's "length" to GCD length */
      nextTime += loopTime; /* Sets adds current loop's time to total time looked ahead */
    }

    if (flamethrowerStatus > 0) {
      loopTime += 10000;
    }

    while (gcdTime > 1000) {
      const nextOGCD = mchNextOGCD({
        barrelstabilizerRecast,
        battery,
        comboStatus,
        comboStep,
        drillRecast,
        gaussround1Recast,
        gaussround2Recast,
        gaussround3Recast,
        gcdTime,
        heat,
        hotshotRecast,
        hyperchargeRecast,
        overheated,
        reassembleRecast,
        ricochet1Recast,
        ricochet2Recast,
        ricochet3Recast,
        wildfireRecast,
        wildfireStatus,
      });

      if (nextOGCD) {
        mchArray.push({ name: nextOGCD, size: 'small' });

        if (nextOGCD === 'Reassemble') {
          reassembleRecast = recast.reassemble;
          // reassembleStatus = duration.reassemble;
        } else if (nextOGCD === 'Gauss Round') {
          gaussround1Recast = gaussround2Recast;
          if (player.level >= 74) {
            gaussround2Recast = gaussround3Recast;
            gaussround3Recast = Math.max(gaussround3Recast + 30000, 30000);
          } else {
            gaussround2Recast = Math.max(gaussround2Recast + 30000, 30000);
          }
          // console.log('Gauss: ' + gaussround1Recast + ' '
          // + gaussround2Recast + ' ' + gaussround3Recast);
          /* Honestly not 100% sure if this works, but it should prevent
           weird edge cases where the number is negative before operations even start */
        } else if (nextOGCD === 'Hypercharge') {
          heat -= 50;
          overheated = 10500; /* For display purposes */
        } else if (['Rook Autoturret', 'Automaton Queen'].includes(nextOGCD)) {
          battery = 0;
        } else if (nextOGCD === 'Wildfire') {
          wildfireRecast = recast.wildfire;
          wildfireStatus = duration.wildfire;
        } else if (nextOGCD === 'Ricochet') {
          ricochet1Recast = ricochet2Recast;
          if (player.level >= 74) {
            ricochet2Recast = ricochet3Recast;
            ricochet3Recast = Math.max(ricochet3Recast + 30000, 30000);
          } else {
            ricochet2Recast = Math.max(ricochet2Recast + 30000, 30000);
          }
          // console.log('Ricochet: ' + ricochet1Recast + ' '
          //  + ricochet2Recast + ' ' + ricochet3Recast);
        } else if (nextOGCD === 'Barrel Stabilizer') {
          barrelstabilizerRecast = recast.barrelstabilizer;
          heat = Math.min(heat + 50, 100);
        }
      }
      gcdTime -= 1000;
    }

    barrelstabilizerRecast -= loopTime;
    comboStatus -= loopTime;
    drillRecast -= loopTime;
    flamethrowerRecast -= loopTime;
    hotshotRecast -= loopTime;
    hyperchargeRecast -= loopTime;
    gaussround1Recast -= loopTime;
    gaussround2Recast -= loopTime;
    gaussround3Recast -= loopTime;
    overheated -= loopTime;
    reassembleRecast -= loopTime;
    // reassembleStatus -= loopTime;
    ricochet1Recast -= loopTime;
    ricochet2Recast -= loopTime;
    ricochet3Recast -= loopTime;
    wildfireRecast -= loopTime;
    wildfireStatus -= loopTime;
  }
  iconArrayB = mchArray;
  syncIcons();
};

onJobChange.MCH = () => {
  mchNext();
};

onTargetChanged.MCH = () => {
  if (player.combat === 0) {
    mchNext();
  }
};

onAction.MCH = (actionMatch) => {
  removeIcon({ name: actionMatch.groups.actionName });

  if (mchMultiTarget.includes(actionMatch.groups.actionName)) {
    player.targetCount = 3;
  } else if (mchSingleTarget.includes(actionMatch.groups.actionName)) {
    player.targetCount = 1;
  }

  if (mchComboWeaponskills.includes(actionMatch.groups.actionName)) {
    if (player.level < 2) {
      player.comboStatus = -1;
      player.comboStep = '';
    } else if (player.level < 26 && actionMatch.groups.actionName === 'Slug Shot') {
      player.comboStatus = -1;
      player.comboStep = '';
    } else if (actionMatch.groups.comboCheck) {
      addStatus({ name: 'Combo' });
      player.comboStep = actionMatch.groups.actionName;
    } else {
      player.comboStatus = -1;
      player.comboStep = '';
    }
    mchNext({ gcd: player.gcd });
  } else if (mchFinisherWeaponskills.includes(actionMatch.groups.actionName)) {
    player.comboStatus = -1;
    player.comboStep = '';
    mchNext({ gcd: player.gcd });
  }

  if (mchRecastWeaponskills.includes(actionMatch.groups.actionName)) {
    if (actionMatch.groups.actionName === 'Bioblaster') {
      addRecast({ name: 'Drill' });
    } else if (actionMatch.groups.actionName === 'Air Anchor') {
      addRecast({ name: 'Hot Shot' });
    } else {
      addRecast({ name: actionMatch.groups.actionName });
    }

    /* We'll pretend Flamethrower is used for longer than 2 seconds */
    if (actionMatch.groups.actionName === 'Flamethrower') {
      addStatus({ name: 'Flamethrower' });
      mchNext({ gcd: 0 });
    } else {
      mchNext({ gcd: player.gcd });
    }
  } else if (mchOverheatedWeaponskills.includes(actionMatch.groups.actionName)) {
    if (actionMatch.groups.actionName === 'Heat Blast') {
      addRecast({ name: 'Gauss Round 1', time: checkRecast({ name: 'Gauss Round 1' }) - 15000 });
      addRecast({ name: 'Gauss Round 2', time: checkRecast({ name: 'Gauss Round 2' }) - 15000 });
      addRecast({ name: 'Gauss Round 3', time: checkRecast({ name: 'Gauss Round 3' }) - 15000 });
      addRecast({ name: 'Ricochet 1', time: checkRecast({ name: 'Ricochet 1' }) - 15000 });
      addRecast({ name: 'Ricochet 2', time: checkRecast({ name: 'Ricochet 2' }) - 15000 });
      addRecast({ name: 'Ricochet 3', time: checkRecast({ name: 'Ricochet 3' }) - 15000 });
      // console.log('Gauss: ' + checkRecast({ name: 'Gauss Round 1' }) + ' '
      //   + checkRecast({ name: 'Gauss Round 2' }) + ' '
      //   + checkRecast({ name: 'Gauss Round 3' }));
      // console.log('Ricochet - HB: ' + checkRecast({ name: 'Ricochet 1' })
      //   + ' ' + checkRecast({ name: 'Ricochet 2' }) + ' '
      //   + checkRecast({ name: 'Ricochet 3' }) + ' ' + Date.now());
    }
    mchNext({ gcd: 1500 });
  } else if (mchCooldowns.includes(actionMatch.groups.actionName)) {
    if (actionMatch.groups.actionName === 'Gauss Round') {
      addRecast({ name: 'Gauss Round 1', time: checkRecast({ name: 'Gauss Round 2' }) });
      addRecast({ name: 'Gauss Round 2', time: checkRecast({ name: 'Gauss Round 3' }) });
      addRecast({ name: 'Gauss Round 3', time: checkRecast({ name: 'Gauss Round 3' }) + 30000 });
      // console.log('Gauss: ' + checkRecast({ name: 'Gauss Round 1' }) + ' '
      //   + checkRecast({ name: 'Gauss Round 2' }) + ' '
      //   + checkRecast({ name: 'Gauss Round 3' }));
    } else if (actionMatch.groups.actionName === 'Ricochet') {
      addRecast({ name: 'Ricochet 1', time: checkRecast({ name: 'Ricochet 2' }) });
      addRecast({ name: 'Ricochet 2', time: checkRecast({ name: 'Ricochet 3' }) });
      addRecast({ name: 'Ricochet 3', time: checkRecast({ name: 'Ricochet 3' }) + 30000 });
      // console.log('Ricochet: ' + checkRecast({ name: 'Ricochet 1' }) + ' '
      //   + checkRecast({ name: 'Ricochet 2' }) + ' '
      //   + checkRecast({ name: 'Ricochet 3' }) + ' ' + Date.now());
    } else {
      addRecast({ name: actionMatch.groups.actionName });
    }

    if (['Reassemble', 'Wildfire'].includes(actionMatch.groups.actionName)) {
      addStatus({ name: actionMatch.groups.actionName });
    }

    if (actionMatch.groups.actionName === 'Hypercharge') {
      mchNext({ gcd: 0 }); /* To reflow icons */
    }
  }
};

onStatus.MCH = (statusMatch) => {
  if (statusMatch.groups.gainsLoses === 'gains') {
    addStatus({
      name: statusMatch.groups.statusName,
      time: parseFloat(statusMatch.groups.statusDuration) * 1000,
      id: statusMatch.groups.targetID,
    });
  } else {
    removeStatus({ name: statusMatch.groups.statusName, id: statusMatch.groups.targetID });
  }
};
