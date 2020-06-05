
const mchSingleTarget = [
  'Split Shot', 'Slug Shot', 'Hot Shot', 'Clean Shot',
  'Heated Split Shot', 'Heated Slug Shot', 'Heated Clean Shot',
  'Spread Shot',
  'Air Anchor', 'Drill', 'Bioblaster',
  'Heat Blast',
];

const mchMultiTarget = [
  'Spread Shot', 'Auto Crossbow',
];

const mchComboWeaponskills = [
  'Split Shot', 'Slug Shot', 'Clean Shot',
  'Heated Split Shot', 'Heated Slug Shot', 'Heated Clean Shot',
  'Spread Shot',
];

const mchRecastWeaponskills = [
  'Hot Shot', 'Drill', 'Flamethrower', 'Bioblaster', 'Air Anchor',
  /* Flamethrower isn't actually a weaponskill, but acts like one outside of its recast */
];

const mchOverheatedWeaponskills = [
  'Heat Blast', 'Auto Crossbow',
];

const mchCooldowns = [
  'Reassemble', 'Gauss Round', 'Hypercharge', 'Rook Autoturret', 'Wildfire', 'Ricochet',
  'Barrel Stabilizer',
  'Automaton Queen',
  // 'Second Wind',
];

actionList.MCH = [...new Set([
  ...mchComboWeaponskills,
  ...mchRecastWeaponskills,
  ...mchOverheatedWeaponskills,
  ...mchCooldowns,
])];

statusList.MCH = [
  'Reassemble', 'Wildfire', 'Flamethrower',
];

castingList.MCH = [];

/* Loop will look this many seconds into future before stopping */

const mchNextWeaponskill = ({
  comboStep,
  comboTime,
  overheated,
} = {}) => {
  if (player.level >= 52 && overheated > 0 && player.targetCount >= 3) {
    return 'Auto Crossbow';
  } else if (player.level >= 35 && overheated > 0) {
    return 'Heat Blast';
  } else if (player.level >= 18 && player.targetCount >= 3) {
    return 'Spread Shot';
  } else if (player.level >= 64 && comboStep === 'Heated Slug Shot' && comboTime > player.gcd) {
    return 'Heated Clean Shot';
  } else if (player.level >= 26 && ['Slug Shot', 'Heated Slug Shot'].includes(comboStep)
  && comboTime > player.gcd) {
    return 'Clean Shot';
  } else if (player.level >= 60 && comboStep === 'Heated Split Shot' && comboTime > player.gcd) {
    return 'Heated Slug Shot';
  } else if (player.level >= 2 && ['Split Shot', 'Heated Split Shot'].includes(comboStep)
  && comboTime > player.gcd) {
    return 'Slug Shot';
  } else if (player.level >= 54) {
    return 'Heated Split Shot';
  }
  return 'Split Shot';
};

const mchNextGCD = ({
  comboStep,
  comboTime,
  drillRecast,
  flamethrowerRecast,
  hotshotRecast,
  overheated,
  wildfireStatus,
} = {}) => {
  /* Prevent breaking combo */
  if (comboStep !== '' && comboTime > 0 && comboTime < player.gcd * 3) {
    return mchNextWeaponskill({ comboStep, comboTime, overheated });
  }

  /* Prioritize getting Bioblaster/Drill and Hotshot/Anchor out */
  /* Don't use at end of Wildfire or during Hypercharge */
  if ((wildfireStatus > player.gcd || wildfireStatus < 0) && overheated < player.gcd) {
    if (player.level >= 72 && drillRecast < 0 && player.targetCount >= 2) {
      return 'Bioblaster';
    } else if (player.level >= 58 && drillRecast < 0) {
      return 'Drill';
    } else if (player.level >= 76 && hotshotRecast < 0) {
      return 'Air Anchor';
    }
  }

  /* Use Hypercharge weaponskills */
  if (player.level >= 35 && overheated > 0) {
    if (player.level >= 52 && player.targetCount >= 3) {
      return 'Auto Crossbow';
    } return 'Heat Blast';
  }

  /* Flamethrower is better than Spread in AoE */
  if (player.level >= 70 && player.targetCount >= 2 && flamethrowerRecast < 0) {
    return 'Flamethrower';
  }

  /* Combo */
  return mchNextWeaponskill({ comboStep, comboTime, overheated });
};


const mchNextOGCD = ({
  barrelstabilizerRecast,
  battery,
  comboStep,
  drillRecast,
  gaussround1Recast,
  gaussround2Recast,
  gaussround3Recast,
  gcdTime,
  heat,
  hotshotRecast,
  hyperchargeRecast,
  // overheated,
  reassembleRecast,
  ricochet1Recast,
  ricochet2Recast,
  ricochet3Recast,
  wildfireRecast,
  wildfireStatus,
} = {}) => {
  /* Use Reassemble right before Drill or Air Anchor */
  if (player.level >= 10 && drillRecast < player.gcd && reassembleRecast < 0) {
    return 'Reassemble';
  } else if (player.level >= 76 && hotshotRecast < player.gcd && reassembleRecast < 0) {
    return 'Reassemble';
  }

  /* Use stack 3 of Gauss/Ricochet */
  if (player.level >= 50 && player.targetCount > 1 && ricochet3Recast < 0) {
    return 'Ricochet';
  } else if (player.level >= 15 && gaussround3Recast < 0) {
    return 'Gauss Round';
  } else if (player.level >= 50 && ricochet3Recast < 0) {
    return 'Ricochet';
  }

  /* Use Barrel Stabilizer */
  if (player.level >= 66 && heat <= 50 && barrelstabilizerRecast < 0) {
    return 'Barrel Stabilizer';
  }

  /* Use stack 2 of Gauss/Ricochet */
  if (player.level >= 50 && player.targetCount > 1 && ricochet2Recast < 0) {
    return 'Ricochet';
  } else if (player.level >= 15 && gaussround2Recast < 0) {
    return 'Gauss Round';
  } else if (player.level >= 50 && ricochet2Recast < 0) {
    return 'Ricochet';
  }

  /* Maximize Wildfire uses */
  if (player.level >= 45 && heat >= 50 && hyperchargeRecast < 0 && wildfireRecast < 0) {
    /* Use Wildfire immediately if Hypercharge looks ready */
    /* Will probably(?) place Hypercharge in second OGCD slot */
    return 'Wildfire';
  } else if (player.level >= 45 && wildfireRecast < 0 && gcdTime <= 1500) {
    /* Use Hypercharge on cooldown in second OGCD slot */
    return 'Wildfire';
  }

  /* Maximize Hypercharge uses */
  /* gcdTime <= 1500 keeps it in second weave slot */
  if (player.level >= 30 && heat >= 50 && (wildfireStatus > 0 || wildfireRecast < 1500)
  && gcdTime <= 1500 && hyperchargeRecast < 0) {
    /* Use Hypercharge immediately if Wildfire is up or about to be up */
    /* wildfireRecast < 1500 so that it is definitely in the next Heat Blast OGCD */
    return 'Hypercharge';
  } else if (player.level >= 30 && heat >= 50
  && (heat === 100 || barrelstabilizerRecast < wildfireRecast) && wildfireRecast > 10000
  && gcdTime <= 1500 && hyperchargeRecast < 0) {
    /* Use Hypercharge if unlikely(?) to miss a Wildfire window */
    return 'Hypercharge';
  }

  /* Use Gauss/Ricochet */
  if (player.level >= 50 && player.targetCount > 1 && ricochet1Recast < 0) {
    return 'Ricochet';
  } else if (player.level >= 15 && gaussround1Recast < 0) {
    return 'Gauss Round';
  } else if (player.level >= 50 && ricochet1Recast < 0) {
    return 'Ricochet';
  }

  /* Reassemble in other cases */
  /* On cooldown during AoE (Spread and ACB) */
  if (player.level >= 18 && player.targetCount >= 3 && reassembleRecast < 0) {
    return 'Reassemble';
  } else if (player.level >= 26 && player.level < 58 && reassembleRecast < 0 && comboStep === 'Slug Shot') {
    return 'Reassemble';
  } else if (player.level >= 10 && player.level < 26 && reassembleRecast < 0 && comboStep === 'Split Shot') {
    return 'Reassemble';
  }

  /* Rook/Queen at 50 battery */
  if (battery > 50) {
    if (player.level >= 80) {
      return 'Automaton Queen';
    } return 'Rook Autoturret';
  }

  /* No OGCDs */
  return '';
};

const mchNext = ({
  gcd = 0,
} = {}) => {
  let gcdTime = gcd;
  let nextTime = 0; /* Amount of time looked ahead in loop */

  let comboStep = player.comboStep;
  let heat = player.heat;
  let overheated = player.overheated - 1500; /* Not 100% sure why I have to do this but whatever */
  let battery = player.battery;

  let barrelstabilizerRecast = checkRecast({ name: 'Barrel Stabilizer' });
  let comboTime = player.comboTime - Date.now();
  let drillRecast = checkRecast({ name: 'Drill' });
  let flamethrowerRecast = checkRecast({ name: 'Flamethrower' });
  let gaussround1Recast = checkRecast({ name: 'Gauss Round 1' });
  let gaussround2Recast = checkRecast({ name: 'Gauss Round 2' });
  let gaussround3Recast = checkRecast({ name: 'Gauss Round 3' });
  let hotshotRecast = checkRecast({ name: 'Hot Shot' });
  let hyperchargeRecast = checkRecast({ name: 'Hypercharge' });
  let reassembleRecast = checkRecast({ name: 'Reassemble' });
  let reassembleStatus = checkStatus({ name: 'Reassemble' });
  let ricochet1Recast = checkRecast({ name: 'Ricochet 1' });
  let ricochet2Recast = checkRecast({ name: 'Ricochet 2' });
  let ricochet3Recast = checkRecast({ name: 'Ricochet 3' });
  let wildfireRecast = checkRecast({ name: 'Wildfire' });
  let wildfireStatus = checkStatus({ name: 'Wildfire' });

  const mchArray = [];

  while (nextTime < 30000) {
    let loopTime = 0;

    if (gcdTime <= 1000) {
      const nextGCD = mchNextGCD({
        comboStep,
        comboTime,
        drillRecast,
        flamethrowerRecast,
        hotshotRecast,
        overheated,
        wildfireStatus,
      });

      mchArray.push({ name: nextGCD });

      if (mchComboWeaponskills.includes(nextGCD)) {
        comboStep = nextGCD;
        comboTime = 15000;
        heat = Math.min(heat + 5, 100);
        if (['Clean Shot', 'Heated Clean Shot'].includes(nextGCD)) {
          battery = Math.min(battery + 10, 100);
        }
        if (['Spread Shot', 'Clean Shot', 'Heated Clean Shot'].includes(nextGCD)) {
          comboStep = '';
        }
      } else if (['Hot Shot', 'Air Anchor'].includes(nextGCD)) {
        battery = Math.min(battery + 20, 100);
        hotshotRecast = recast.hotshot;
      } else if (['Drill', 'Bioblaster'].includes(nextGCD)) {
        drillRecast = recast.drill;
      } else if (nextGCD === 'Heat Blast') {
        gaussround1Recast -= 15000;
        gaussround2Recast -= 15000;
        gaussround3Recast -= 15000;
        ricochet1Recast -= 15000;
        ricochet2Recast -= 15000;
        ricochet3Recast -= 15000;
      }

      if (mchOverheatedWeaponskills.includes(nextGCD)) {
        gcdTime = 1500;
      } else if (nextGCD === 'Flamethrower') {
        gcdTime = 0;
      } else {
        gcdTime = player.gcd;
      }
      loopTime = gcdTime;
      nextTime += loopTime;
    }

    if (gcdTime > 1000) {
      while (gcdTime > 1000) {
        const nextOGCD = mchNextOGCD({
          barrelstabilizerRecast,
          battery,
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
            gaussround2Recast = gaussround3Recast;
            gaussround3Recast = Math.max(gaussround3Recast + 30000, 30000);
            /* Honestly not 100% sure why this is needed or if this works, but it shoud prevent
             weird edge cases where the number is negative before operations even start */
          } else if (nextOGCD === 'Hypercharge') {
            heat -= 50;
            overheated = 8501; /* Actually 8 seconds, but this predicts better because reasons */
          } else if (['Rook Autoturret', 'Automaton Queen'].includes(nextOGCD)) {
            battery = 0;
          } else if (nextOGCD === 'Wildfire') {
            wildfireRecast = recast.wildfire;
            wildfireStatus = duration.wildfire;
          } else if (nextOGCD === 'Ricochet') {
            ricochet1Recast = ricochet2Recast;
            ricochet2Recast = ricochet3Recast;
            ricochet3Recast = Math.max(ricochet3Recast + 30000, 30000);
          } else if (nextOGCD === 'Barrel Stabilizer') {
            barrelstabilizerRecast = recast.barrelstabilizer;
            heat = Math.min(heat + 50, 100);
          }
        }
        gcdTime -= 1000;
      }
    }

    barrelstabilizerRecast -= loopTime;
    wildfireRecast -= loopTime;
    wildfireStatus -= loopTime;

    comboTime -= loopTime;
    drillRecast -= loopTime;
    flamethrowerRecast -= loopTime;
    hotshotRecast -= loopTime;
    hyperchargeRecast -= loopTime;
    reassembleRecast -= loopTime;
    reassembleStatus -= loopTime;
    overheated -= loopTime;
    gaussround1Recast -= loopTime;
    gaussround2Recast -= loopTime;
    gaussround3Recast -= loopTime;
    ricochet1Recast -= loopTime;
    ricochet2Recast -= loopTime;
    ricochet3Recast -= loopTime;
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
    if (actionMatch.groups.comboCheck) {
      player.comboStep = actionMatch.groups.actionName;
      player.comboTime = Date.now() + 15000;
    } else {
      player.comboStep = '';
      player.comboTime = -1;
    }
    mchNext({ gcd: player.gcd });
  } else if (mchRecastWeaponskills.includes(actionMatch.groups.actionName)) {
    if (actionMatch.groups.actionName === 'Bioblaster') {
      addRecast({ name: 'Drill' });
    } else if (actionMatch.groups.actionName === 'Air Anchor') {
      addRecast({ name: 'Hot Shot' });
    } else {
      addRecast({ name: actionMatch.groups.actionName });
    }

    /* We'll pretend Flamethrower is used for longer than 2 seconds */
    if (actionMatch.groups.actionName === 'Flamethrower') {
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
    }
    mchNext({ gcd: 1500 });
  } else if (mchCooldowns.includes(actionMatch.groups.actionName)) {
    if (actionMatch.groups.actionName === 'Gauss Round') {
      addRecast({ name: 'Gauss Round 1', time: checkRecast({ name: 'Gauss Round 2' }) });
      addRecast({ name: 'Gauss Round 2', time: checkRecast({ name: 'Gauss Round 3' }) });
      addRecast({ name: 'Gauss Round 3', time: checkRecast({ name: 'Gauss Round 3' }) + 30000 });
    } else if (actionMatch.groups.actionName === 'Ricochet') {
      addRecast({ name: 'Ricochet 1', time: checkRecast({ name: 'Ricochet 2' }) });
      addRecast({ name: 'Ricochet 2', time: checkRecast({ name: 'Ricochet 3' }) });
      addRecast({ name: 'Ricochet 3', time: checkRecast({ name: 'Ricochet 3' }) + 30000 });
    } else {
      addRecast({ name: actionMatch.groups.actionName });
    }

    if (['Reassemble', 'Wildfire'].includes(actionMatch.groups.actionName)) {
      addStatus({ name: actionMatch.groups.actionName });
    }

    if (actionMatch.groups.actionName === 'Hypercharge') {
      mchNext({ gcd: 0 });
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
