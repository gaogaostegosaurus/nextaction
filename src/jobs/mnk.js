nextActionOverlay.onJobChange.MNK = () => {
  // const { playerData } = nextActionOverlay;

  nextActionOverlay.actionList.weaponskills = [
    'Form Shift',
    'Bootshine', 'Dragon Kick', 'Arm Of The Destroyer',
    'True Strike', 'Twin Snakes', 'Four-Point Fury',
    'Demolish', 'Snap Punch', 'Rockbreaker',
  ];

  nextActionOverlay.actionList.weaponskills.opoopoform = [
  ];

  nextActionOverlay.actionList.weaponskills.raptorform = [

  ];

  nextActionOverlay.actionList.weaponskills.coeurlform = [
  ];

  nextActionOverlay.actionList.abilities = [
    'Fists Of Earth', 'Fists Of Wind', 'Fists Of Fire', 'Shoulder Tackle',
    'Perfect Balance',
    'Meditation', 'Elixir Field',
    'Riddle Of Fire', 'Brotherhood',
    'Enlightenment', 'Anatman',
    'The Forbidden Chakra',
    'Mantra',
    'Tornado Kick',
    'Riddle Of Earth',
  ];

  nextActionOverlay.statusList.self = [
    'Opo-Opo Form', 'Raptor Form', 'Coeurl Form',
    'Fists Of Earth', 'Fists Of Wind', 'Fists Of Fire',
  ];

  nextActionOverlay.statusList.target = [
    'Demolish',
  ];

  const { recast } = nextActionOverlay;
  recast.anatman = 60000;
  recast.brotherhood = 90000;
  recast.elixirfield = 30000;
  recast.fists = 3000;
  recast.fistsoffire = recast.fists;
  recast.fistsofwind = recast.fists;
  recast.fistsofearth = recast.fists;
  recast.perfectbalance = 120000;
  recast.riddleoffire = 90000;
  recast.riddleofearth = 60000;

  const { duration } = nextActionOverlay;
  duration.twinsnakes = 15000;
  duration.demolish = 18000;
  duration.leadenfist = 30000;
  duration.perfectbalance = 10000;
  duration.riddleoffire = 20000;
  duration.fists = 99999999;
  duration.fistsofearth = duration.fists;
  duration.fistsofwind = duration.fists;
  duration.fistsoffire = duration.fists;
  duration.form = 15000;
  duration.opoopoform = duration.form;
  duration.raptorform = duration.form;
  duration.coeurlform = duration.form;

  const { icon } = nextActionOverlay;
  icon.demolish = '000204';
  icon.fistsoffire = '000205';
  icon.bootshine = '000208';
  icon.truestrike = '000209';
  icon.snappunch = '000210';
  icon.twinsnakes = '000213';
  icon.armofthedestroyer = '000215';
  icon.perfectbalance = '000217';
  icon.fistsofwind = '002527';
  icon.dragonkick = '002528';
  icon.rockbreaker = '002529';
  icon.elixirfield = '002533';
  icon.meditation = '002534';
  icon.theforbiddenchakra = '002535';
  icon.formshift = '002536';
  icon.riddleofearth = '002537';
  icon.riddleoffire = '002541';
  icon.brotherhood = '002542';
  icon.fourpointfury = '002544';
  icon.enlightenment = '002545';
  icon.anatman = '002546';
  icon.sixsidedstar = '002547';
}; /* Keep collapsed, usually */

nextActionOverlay.onPlayerChangedEvent.MNK = (e) => {
  const { checkStatus } = nextActionOverlay;

  const { playerData } = nextActionOverlay;
  const { level } = playerData;

  playerData.greasedlightningStacks = e.detail.jobDetail.lightningStacks;
  if (level >= 76 && checkStatus({ statusName: 'Fists Of Wind' }) > 0) {
    playerData.greasedlightningMaxStacks = 4;
  } else if (level >= 40) {
    playerData.greasedlightningMaxStacks = 3;
  } else if (level >= 20) {
    playerData.greasedlightningMaxStacks = 2;
  } else if (level >= 6) {
    playerData.greasedlightningMaxStacks = 1;
  } else {
    playerData.greasedlightningMaxStacks = 0;
  }
  playerData.greasedlightningStatus = e.detail.jobDetail.lightningMilliseconds;
  if (playerData.greasedlightningStatus === 0) {
    playerData.greasedlightningStatus = -1;
  }
  playerData.chakra = e.detail.jobDetail.chakraStacks;
};

// nextActionOverlay.nextAction.MNK.greasedlightningMaxStacks = ({
//   loopStatus,
// } = {}) => {
//   const { playerData } = nextActionOverlay;
//   const { level } = playerData;
//   let greasedlightningMaxStacks = 0;
//   if (level >= 76 && loopStatus.fistsofwind > 0) {
//     greasedlightningMaxStacks = 4;
//   } else if (level >= 40) {
//     greasedlightningMaxStacks = 3;
//   } else if (level >= 20) {
//     greasedlightningMaxStacks = 2;
//   } else if (level >= 6) {
//     greasedlightningMaxStacks = 1;
//   } return greasedlightningMaxStacks;
// };

nextActionOverlay.nextAction.MNK = ({
  delay = 0,
} = {}) => {
  const nextAction = nextActionOverlay.nextAction.MNK;

  const { checkRecast } = nextActionOverlay;
  const { checkStatus } = nextActionOverlay;
  const { recast } = nextActionOverlay;
  const { duration } = nextActionOverlay;

  const { playerData } = nextActionOverlay;
  const { level } = playerData;
  const { gcd } = playerData;
  let { greasedlightningStacks } = playerData;
  let { chakra } = playerData;

  const { targetData } = nextActionOverlay;

  let { combat } = nextActionOverlay;

  const loopRecast = {};
  const loopRecastList = [
    'Shoulder Tackle 1', 'Shoulder Tackle 2', 'Perfect Balance', 'Elixir Field', 'Brotherhood', 'Riddle Of Fire', 'Anatman',
  ];

  loopRecastList.forEach((actionName) => {
    const propertyName = actionName.replace(/[\s':-]/g, '').toLowerCase();
    loopRecast[propertyName] = checkRecast({ actionName }) - 1000;
  });

  const loopStatus = {};
  const loopStatusList = [
    'Opo Opo Form', 'Raptor Form', 'Coeurl Form',
    'Twin Snakes', 'Leaden Fist',
    'Fists Of Fire', 'Fists Of Wind',
    'Perfect Balance',
  ];

  loopStatusList.forEach((statusName) => {
    const propertyName = statusName.replace(/[\s':-]/g, '').toLowerCase();
    loopStatus[propertyName] = checkStatus({ statusName });
  });

  loopStatus.demolish = checkStatus({ statusName: 'Demolish', id: targetData.id }); /* Not self-targeted */
  loopStatus.greasedlightning = playerData.greasedlightingStatus;

  const mnkArray = [];

  let gcdTime = delay;
  let nextTime = 0; /* Amount of time looked ahead in loop */

  while (nextTime < 15000) { /* Outside loop for GCDs, looks ahead this number ms */
    let loopTime = 0; /* The elapsed time for current loop */

    /* Calculate max GL */
    let greasedlightningMax = 0;
    if (level >= 76 && loopStatus.fistsofwind > 0) {
      greasedlightningMax = 4;
    } else if (level >= 40) {
      greasedlightningMax = 3;
    } else if (level >= 20) {
      greasedlightningMax = 2;
    } else if (level >= 6) {
      greasedlightningMax = 1;
    }

    if (gcdTime <= 1000) {
      /* GCD action if GCD is complete */
      const nextGCD = nextAction.gcd({
        combat,
        chakra,
        greasedlightningStacks,
        greasedlightningMax,
        loopRecast,
        loopStatus,
      });

      mnkArray.push({ name: nextGCD });

      if (!['Form Shift', 'Meditation'].includes(nextGCD)) {
        combat = true;
        // console.log(nextGCD);
      }

      /* Special stuff */
      if (nextGCD === 'Twin Snakes') {
        loopStatus.twinsnakes = duration.twinsnakes;
      } else if (nextGCD === 'Four Point Fury' && loopStatus.twinsnakes > 0) {
        loopStatus.twinsnakes = Math.min(loopStatus.twinsnakes + 10000, 15000);
      } else if (nextGCD === 'Demolish') {
        loopStatus.demolish = duration.demolish;
      } else if (nextGCD === 'Dragon Kick' && (loopStatus.opoopoform > 0 || loopStatus.perfectbalance
         > 0)) {
        loopStatus.leadenfist = duration.leadenfist;
      } else if (nextGCD === 'Bootshine') {
        loopStatus.leadenfist = -1;
      } else if (nextGCD === 'Meditation') {
        if (!combat) {
          chakra = 5;
        } else {
          chakra += 1;
        }
      }

      /* Stance change */
      if (loopStatus.perfectbalance > 0) {
        loopStatus.opoopoform = -1;
        loopStatus.raptorform = -1;
        loopStatus.coeurlform = -1;
      } else if (['Bootshine', 'Arm Of The Destroyer', 'Dragon Kick'].includes(nextGCD)) {
        loopStatus.opoopoform = -1;
        loopStatus.raptorform = 15000;
        loopStatus.coeurlform = -1;
      } else if (['True Strike', 'Twin Snakes', 'Four Point Fury'].includes(nextGCD)) {
        loopStatus.opoopoform = -1;
        loopStatus.raptorform = -1;
        loopStatus.coeurlform = 15000;
      } else if (['Snap Punch', 'Demolish', 'Rockbreaker'].includes(nextGCD)) {
        loopStatus.opoopoform = 15000;
        loopStatus.raptorform = -1;
        loopStatus.coeurlform = -1;
        loopStatus.greasedlightning = 16000;

        /* Increase GL up to max */
        if (greasedlightningStacks < greasedlightningMax) {
          greasedlightningStacks += 1;
          // console.log(greasedlightningStacks + ' / ' + greasedlightningMax);
        }
      } else if (nextGCD === 'Form Shift') {
        if (Math.max(loopStatus.opoopoform, loopStatus.raptorform, loopStatus.coeurlform) < 0) {
          loopStatus.opoopoform = 15000;
        } else if (loopStatus.opoopoform > 0) {
          loopStatus.opoopoform = -1;
          loopStatus.raptorform = 15000;
          loopStatus.coeurlform = -1;
        } else if (loopStatus.raptorform > 0) {
          loopStatus.opoopoform = -1;
          loopStatus.raptorform = -1;
          loopStatus.coeurlform = 15000;
        } else if (loopStatus.coeurlform > 0) {
          loopStatus.opoopoform = 15000;
          loopStatus.raptorform = -1;
          loopStatus.coeurlform = -1;
        }
      }

      if (nextGCD === 'Meditation') {
        gcdTime = 1200;
      } else {
        gcdTime = gcd * (1 - 0.05 * greasedlightningStacks);
      }

      if (loopStatus.perfectbalance > 0 && loopStatus.perfectbalance < gcd) {
        mnkArray.push({ name: 'Perfect Balance' });
      }

      if (loopStatus.riddleoffire > 0 && loopStatus.riddleoffire < gcd) {
        mnkArray.push({ name: 'Riddle Of Fire' });
      }

      loopTime = gcdTime;
    }

    while (gcdTime > 1250) {
      const nextOGCD = nextAction.ogcd({
        combat,
        greasedlightningMax,
        greasedlightningStacks,
        chakra,
        loopRecast,
        loopStatus,
      });

      if (nextOGCD) {
        mnkArray.push({ name: nextOGCD, size: 'small' });
      }

      if (nextOGCD === 'Anatman' && greasedlightningStacks < greasedlightningMax) {
        greasedlightningStacks += 1;
      }

      if (['The Forbidden Chakra', 'Enlightenment'].includes(nextOGCD)) {
        chakra = 0;
      }

      const property = nextOGCD.replace(/[\s':-]/g, '').toLowerCase();

      if (nextOGCD === 'Shoulder Tackle 2') {
        loopRecast.shouldertackle1 = loopRecast.shouldertackle2;
        loopRecast.shouldertackle2 += recast.shouldertackle2;
      } else if (recast[property]) {
        loopRecast[property] = recast[property];
      }

      if (nextOGCD === 'Perfect Balance') {
        loopStatus.opoopoform = -1;
        loopStatus.raptorform = -1;
        loopStatus.coeurlform = -1;
        loopStatus.perfectbalance = duration.perfectbalance + gcd;
      } else if (nextOGCD === 'Riddle Of Fire') {
        loopStatus.riddleoffire = duration.riddleoffire + gcd;
      } else if (duration[property]) {
        loopStatus[property] = duration[property];
      }

      if (!['Fists Of Fire', 'Fists Of Wind', 'Anatman', ''].includes(nextOGCD)) {
        combat = true;
      }

      gcdTime -= 9999; /* Just so I don't hafta worry about it */
    }

    Object.keys(loopRecast).forEach((property) => { loopRecast[property] -= loopTime; });
    Object.keys(loopStatus).forEach((property) => { loopStatus[property] -= loopTime; });
    nextTime += loopTime;
  }
  nextActionOverlay.iconArrayB = mnkArray;
  nextActionOverlay.syncIcons();
};

nextActionOverlay.nextAction.MNK.gcd = ({
  combat,
  chakra,
  greasedlightningStacks,
  greasedlightningMax,
  loopStatus,
  loopRecast,
} = {}) => {
  const { playerData } = nextActionOverlay;
  const { level } = playerData;
  const { duration } = nextActionOverlay;
  const { targetCount } = playerData;

  const gcd = playerData.gcd * (1 - greasedlightningStacks * 0.05);
  const snappunchPotency = 230 + Math.ceil(loopStatus.demolish / 3000) * 65;
  const rockbreakerPotency = 120 * targetCount + Math.ceil(loopStatus.demolish / 3000) * 65;
  const demolishPotency = 90 + Math.floor((18000 - loopStatus.demolish) / 3000) * 65;

  /* Demolish at start of Riddle of Fire */
  if (loopStatus.riddleoffire > duration.riddleoffire - gcd
  && Math.max(loopStatus.coeurlform, loopStatus.perfectbalance) > 0) {
    return 'Demolish';
  }

  /* Demolish at end of Riddle of Fire */
  if (loopStatus.riddleoffire > 0 && loopStatus.riddleoffire < gcd
  && Math.max(loopStatus.coeurlform, loopStatus.perfectbalance) > 0) {
    return 'Demolish';
  }

  /* Perfect Balance priorities */
  if (loopStatus.perfectbalance > 0) { /* Implies player level >= 50 */
    /* Increase GL stacks and refresh */
    if (greasedlightningStacks < greasedlightningMax || loopStatus.greasedlightning < gcd * 3) {
      if (rockbreakerPotency > Math.max(demolishPotency, snappunchPotency)) {
        return 'Rockbreaker';
      }
      if (demolishPotency > snappunchPotency) {
        return 'Demolish';
      } return 'Snap Punch';
    }

    /* Keep Twin Snakes up for AoE */
    if (playerData.targetCount > 1 && loopStatus.twinsnakes < gcd) {
      return 'Four Point Fury';
    }

    /* Apply Demolish if needed */
    if (loopStatus.demolish < 0) {
      return 'Demolish';
    }

    /* DK/BS spam */
    if (loopStatus.leadenfist < 0) {
      return 'Dragon Kick';
    } return 'Bootshine';
  }

  /* Out of combat actions */
  if (!combat && chakra < 5) {
    return 'Meditation';
  }

  if (!combat && loopStatus.coeurlform < gcd) {
    return 'Form Shift';
  }

  /* General priority (no PB) */
  if (level >= 30 && rockbreakerPotency > Math.max(demolishPotency, snappunchPotency)
  && loopStatus.coeurlform > 0) {
    return 'Rockbreaker';
  }

  if (level >= 30 && demolishPotency > snappunchPotency && loopStatus.coeurlform > 0) {
    return 'Demolish';
  }

  if (level >= 6 && loopStatus.coeurlform > 0) {
    return 'Snap Punch';
  }

  if (level >= 40 && playerData.targetCount > 1 && loopStatus.twinsnakes > 0
  && loopStatus.raptorform > 0) {
    return 'Four Point Fury';
  }

  if (level >= 50 && loopRecast.perfectbalance < gcd * 3 && loopStatus.raptorform > 0) {
    return 'Twin Snakes'; /* Twin Snakes before Perfect Balance if able */
  }

  if (level >= 18 && loopStatus.twinsnakes <= gcd * 3 && loopStatus.raptorform > 0) {
    return 'Twin Snakes';
  }

  if (level >= 4 && loopStatus.raptorform > 0) {
    return 'True Strike';
  }

  if (level >= 26 && playerData.targetCount > 2) {
    return 'Arm Of The Destroyer';
  }

  if (level >= 50 && loopStatus.leadenfist < 0) {
    return 'Dragon Kick';
  } return 'Bootshine';
};

nextActionOverlay.nextAction.MNK.ogcd = ({
  combat,
  greasedlightningStacks,
  greasedlightningMax,
  chakra,
  loopRecast,
  loopStatus,
} = {}) => {
  const { playerData } = nextActionOverlay;
  const { level } = playerData;

  if (level >= 76 && loopStatus.fistsofwind < 0 && greasedlightningStacks >= 3
  && loopStatus.coeurlform > 0) {
    return 'Fists Of Wind';
  }

  if (level >= 40 && loopStatus.fistsoffire < 0) {
    return 'Fists Of Fire';
  }

  if (!combat) {
    return '';
  }

  if (level >= 78 && greasedlightningStacks < greasedlightningMax
  && loopStatus.opoopoform > 0 && loopRecast.anatman < 0) {
    return 'Anatman';
    /* Not sure why Opo-opo is needed...? Just opening shenanigans, maybe */
  }
  if (level >= 68 && loopRecast.riddleoffire < 0 && loopStatus.coeurlform > 0) {
    return 'Riddle Of Fire';
  }
  if (level >= 70 && loopRecast.brotherhood < 0 && loopRecast.riddleoffire > 22500) {
    return 'Brotherhood';
  }

  if (greasedlightningStacks >= 4 /* Implies 78 */
  && loopStatus.raptorform > 0 && loopRecast.perfectbalance < 0) {
    return 'Perfect Balance';
  }

  if (level >= 50 && level < 78 && greasedlightningStacks < greasedlightningMax
  && loopStatus.opoopoform > 0 && loopRecast.perfectbalance < 0) {
    return 'Perfect Balance';
  }

  if (level >= 74 && playerData.targetCount > 1 && chakra === 5) {
    return 'Enlightenment';
  }

  if (level >= 56 && playerData.targetCount > 1 && loopRecast.elixirfield < 0
  && loopRecast.riddleoffire > 7500) {
    return 'Elixir Field';
  }

  if (level >= 54 && chakra === 5) {
    return 'The Forbidden Chakra';
  }

  if (level >= 56 && loopRecast.elixirfield < 0 && loopRecast.riddleoffire > 7500) {
    return 'Elixir Field';
  }

  if (level >= 66 && loopRecast.shouldertackle2 < 0) {
    return 'Shoulder Tackle 2';
  } return '';
};

nextActionOverlay.onAction.MNK = (actionMatch) => {
  const { actionName } = actionMatch.groups;
  const { removeIcon } = nextActionOverlay;
  const { checkStatus } = nextActionOverlay;
  const { removeStatus } = nextActionOverlay;
  const { addRecast } = nextActionOverlay;
  const { checkRecast } = nextActionOverlay;
  const { recast } = nextActionOverlay;
  const { targetData } = nextActionOverlay;
  const { weaponskills } = nextActionOverlay.actionList;
  // const nextAction = nextActionOverlay.nextAction.MNK;

  const { addStatus } = nextActionOverlay;
  const { playerData } = nextActionOverlay;
  const { level } = playerData;

  removeIcon({ name: actionName });
  // console.log(`${actionName}`);

  const singletargetActions = [
    'True Strike', 'Snap Punch',
  ];

  if (checkStatus({ statusName: 'Leaden Fist' }) < 0) {
    singletargetActions.push('Bootshine');
  }

  if (checkStatus({ statusName: 'Twin Snakes' }) > 0) {
    singletargetActions.push('Twin Snakes');
  }

  if (checkStatus({ statusName: 'Demolish', id: targetData.id }) > 0) {
    singletargetActions.push('Demolish');
  }

  if (level >= 74) {
    singletargetActions.push('The Forbidden Chakra');
  }

  const multitargetActions = [
    'Arm Of The Destroyer', 'Four-Point Fury', 'Rockbreaker', 'Elixir Field', 'Enlightenment',
  ]; /* Actions that can hit multiple targets */

  /* Set probable target count */
  if (multitargetActions.includes(actionName) && actionMatch.groups.logType === '15') {
    playerData.targetCount = 1; /* Multi target action only hits single target */
  } else if (singletargetActions.includes(actionName)) {
    playerData.targetCount = 1;
  }

  /* Add recasts */
  if (actionName === 'Shoulder Tackle') {
    addRecast({ actionName: 'Shoulder Tackle 1', time: checkRecast({ actionName: 'Shoulder Tackle 2' }) });
    addRecast({ actionName: 'Shoulder Tackle 2', time: checkRecast({ actionName: 'Shoulder Tackle 2' }) + recast.shouldertackle });
  } else if (nextActionOverlay.actionList.abilities.includes(actionName)) {
    addRecast({ actionName });
  }

  /* Form changes */
  if (actionName === 'Form Shift') {
    if (Math.max(
      checkStatus({ statusName: 'Opo Opo Form' }),
      checkStatus({ statusName: 'Raptor Form' }),
      checkStatus({ statusName: 'Coeurl Form' }),
    ) < 0) {
      addStatus({ statusName: 'Opo Opo Form' });
    } else if (checkStatus({ statusName: 'Opo Opo Form' }) > 0) {
      removeStatus({ statusName: 'Opo Opo Form' });
      removeStatus({ statusName: 'Coeurl Form' });
      addStatus({ statusName: 'Raptor Form' });
    } else if (checkStatus({ statusName: 'Raptor Form' }) > 0) {
      removeStatus({ statusName: 'Opo Opo Form' });
      removeStatus({ statusName: 'Raptor Form' });
      addStatus({ statusName: 'Coeurl Form' });
    } else if (checkStatus({ statusName: 'Coeurl Form' }) > 0) {
      removeStatus({ statusName: 'Raptor Form' });
      removeStatus({ statusName: 'Coeurl Form' });
      addStatus({ statusName: 'Opo Opo Form' });
    }
  } else if (['Bootshine', 'Dragon Kick', 'Arm Of The Destroyer',
  ].includes(actionName)) {
    removeStatus({ statusName: 'Opo Opo Form' });
    removeStatus({ statusName: 'Coeurl Form' });
    addStatus({ statusName: 'Raptor Form' });
  } else if (['True Strike', 'Twin Snakes', 'Four-Point Fury',
  ].includes(actionName)) {
    removeStatus({ statusName: 'Opo Opo Form' });
    removeStatus({ statusName: 'Raptor Form' });
    addStatus({ statusName: 'Coeurl Form' });
  } else if (['Demolish', 'Snap Punch', 'Rockbreaker'].includes(actionName)) {
    removeStatus({ statusName: 'Raptor Form' });
    removeStatus({ statusName: 'Coeurl Form' });
    addStatus({ statusName: 'Opo Opo Form' });
  }

  /* Call next function */
  if (Object.values(weaponskills).flat(Infinity).includes(actionName)) {
    nextActionOverlay.nextAction.MNK({ delay: playerData.gcd });
  }
};

nextActionOverlay.onStatus.MNK = (statusMatch) => {
  /* Shorten common functions */
  // const { playerData } = nextActionOverlay;
  const { addStatus } = nextActionOverlay;
  // const checkStatus = nextActionOverlay.checkStatus;
  const { removeStatus } = nextActionOverlay;

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
  }
};
