nextActionOverlay.onJobChange.MNK = () => {
  // const { playerData } = nextActionOverlay;

  nextActionOverlay.actionList.weaponskills = [
    'Form Shift',
    'Bootshine', 'Dragon Kick', 'Arm Of The Destroyer',
    'True Strike', 'Twin Snakes', 'Four-Point Fury',
    'Demolish', 'Snap Punch', 'Rockbreaker',
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
    'Perfect Balance', 'Anatman',
    'Fists Of Earth', 'Fists Of Wind', 'Fists Of Fire', 'Leaden Fist', 'Twin Snakes',
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
  duration.anatman = 30000;
  duration.demolish = 18000;
  duration.leadenfist = 30000;
  duration.perfectbalance = 10000;
  duration.twinsnakes = 15000;
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
  icon.shouldertackle = '002526';
  icon.shouldertackle1 = icon.shouldertackle;
  icon.shouldertackle2 = icon.shouldertackle;
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
    playerData.greasedlightningMax = 4;
  } else if (level >= 40) {
    playerData.greasedlightningMax = 3;
  } else if (level >= 20) {
    playerData.greasedlightningMax = 2;
  } else if (level >= 6) {
    playerData.greasedlightningMax = 1;
  } else {
    playerData.greasedlightningMax = 0;
  }
  playerData.greasedlightningStatus = e.detail.jobDetail.lightningMilliseconds;
  if (playerData.greasedlightningStatus === 0) {
    /* Re-assess actions if GL hits 0 for whatever reason */
    playerData.greasedlightningStacks = 0; /* Should already be this but just in case? */
    playerData.greasedlightningStatus = -1;
    nextActionOverlay.nextAction.MNK({ delay: 0 });
  }
  playerData.chakra = e.detail.jobDetail.chakraStacks;
};

nextActionOverlay.onTargetChange.MNK = () => {
  nextActionOverlay.nextAction.MNK();
};

nextActionOverlay.nextAction.MNK = ({
  delay = 0,
} = {}) => {
  // console.log(nextActionOverlay.playerData.greasedlightningStatus);
  const nextAction = nextActionOverlay.nextAction.MNK;

  const { checkRecast } = nextActionOverlay;
  const { checkStatus } = nextActionOverlay;
  const { recast } = nextActionOverlay;
  const { duration } = nextActionOverlay;

  const { playerData } = nextActionOverlay;
  const { level } = playerData;
  let { greasedlightningStacks } = playerData;
  let { chakra } = playerData;
  let { gcd } = playerData.gcd * (1 - 0.05 * greasedlightningStacks);

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
    'Opo-Opo Form', 'Raptor Form', 'Coeurl Form',
    'Twin Snakes', 'Leaden Fist',
    'Fists Of Fire', 'Fists Of Wind',
    'Perfect Balance', 'Riddle Of Fire',
  ];

  loopStatusList.forEach((statusName) => {
    const propertyName = statusName.replace(/[\s':-]/g, '').toLowerCase();
    loopStatus[propertyName] = checkStatus({ statusName });
  });

  loopStatus.demolish = checkStatus({ statusName: 'Demolish', id: targetData.id }); /* Not self-targeted */
  loopStatus.greasedlightning = playerData.greasedlightningStatus;

  const mnkArray = [];

  let gcdTime = delay;
  let nextTime = 0; /* Amount of time looked ahead in loop */

  while (nextTime < 15000) { /* Outside loop for GCDs, looks ahead this number ms */
    let loopTime = 0; /* The elapsed time for current loop */
    gcd = playerData.gcd * (1 - 0.05 * greasedlightningStacks); /* Update new GCD */

    /* Calculate max GL in case Fists was used in previous loop */
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
    // console.log(gcdTime);

    if (gcdTime <= 1000) {
      /* Cancel Anatman */
      loopStatus.anatman = -1;

      /* GCD action if GCD is complete */
      const nextGCD = nextAction.gcd({
        combat,
        greasedlightningStacks,
        greasedlightningMax,
        chakra,
        gcd,
        loopRecast,
        loopStatus,
      });

      mnkArray.push({ name: nextGCD });

      if (!['Form Shift', 'Meditation'].includes(nextGCD)) {
        combat = true;
      }

      const property = nextGCD.replace(/[\s':-]/g, '').toLowerCase();

      /* Recasts */
      if (recast[property]) {
        loopRecast[property] = recast[property];
      }

      /* Statuses */
      if (nextGCD === 'Bootshine') {
        loopStatus.leadenfist = -1;
      } else if (nextGCD === 'Four Point Fury' && loopStatus.twinsnakes > 0) {
        loopStatus.twinsnakes = Math.min(loopStatus.twinsnakes + 10000, 15000);
      } else if (nextGCD === 'Dragon Kick'
      && (loopStatus.opoopoform > 0 || loopStatus.perfectbalance > 0)) {
        loopStatus.leadenfist = duration.leadenfist;
      } else if (duration[property]) {
        loopStatus[property] = duration[property];
      }

      /* Resources */
      if (nextGCD === 'Meditation') {
        if (!combat) {
          chakra = 5;
        } else {
          chakra += 1;
        }
      } else if (nextGCD === 'Anatman' && greasedlightningStacks < greasedlightningMax) {
        greasedlightningStacks += 1;
      } else if (['Snap Punch', 'Demolish', 'Rockbreaker'].includes(nextGCD)) {
        loopStatus.greasedlightning = 16000;
        /* Increase GL up to max */
        if (greasedlightningStacks < greasedlightningMax) {
          greasedlightningStacks += 1;
        }
      } else if (nextGCD === 'Form Shift' && loopStatus.coeurlform > 0 && greasedlightningStacks > 0) {
        loopStatus.greasedlightning = 16000;
      }

      /* Form change */
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
      } else if (nextGCD === 'Form Shift') {
        if (loopStatus.opoopoform > 0) {
          loopStatus.opoopoform = -1;
          loopStatus.raptorform = 15000;
          loopStatus.coeurlform = -1;
        } else if (loopStatus.raptorform > 0) {
          loopStatus.opoopoform = -1;
          loopStatus.raptorform = -1;
          loopStatus.coeurlform = 15000;
        } else {
          loopStatus.opoopoform = 15000;
          loopStatus.raptorform = -1;
          loopStatus.coeurlform = -1;
        }
      }

      if (nextGCD === 'Meditation') {
        gcdTime = 1200;
      } else if (nextGCD === 'Anatman') {
        gcdTime = 3000;
      } else {
        gcdTime = gcd;
      }

      // if (loopStatus.perfectbalance > 0 && loopStatus.perfectbalance < gcd) {
      //   mnkArray.push({ name: 'Perfect Balance' });
      // }

      // if (loopStatus.riddleoffire > 0 && loopStatus.riddleoffire < gcd) {
      //   mnkArray.push({ name: 'Riddle Of Fire' });
      // }

      loopTime = gcdTime;

      /* Remove OGCD for Anatman */
      if (nextGCD === 'Anatman') {
        loopStatus.greasedlightning += gcdTime;
        gcdTime = 0;
      }
    }

    while (gcdTime > 1250) {
      const nextOGCD = nextAction.ogcd({
        combat,
        greasedlightningStacks,
        greasedlightningMax,
        chakra,
        loopRecast,
        loopStatus,
      });

      if (nextOGCD) {
        mnkArray.push({ name: nextOGCD, size: 'small' });
      }

      if (['The Forbidden Chakra', 'Enlightenment'].includes(nextOGCD)) {
        chakra = 0;
      }

      const property = nextOGCD.replace(/[\s':-]/g, '').toLowerCase();

      if (nextOGCD === 'Shoulder Tackle') {
        if (level >= 66) {
          loopRecast.shouldertackle1 = loopRecast.shouldertackle2;
          loopRecast.shouldertackle2 += recast.shouldertackle;
        } else {
          loopRecast.shouldertackle1 += loopRecast.shouldertackle;
        }
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

      if (!['Fists Of Fire', 'Fists Of Wind', ''].includes(nextOGCD)) {
        combat = true;
      }

      gcdTime -= 9999; /* Just not bothering with double weaves on MNK */
    }

    Object.keys(loopRecast).forEach((property) => { loopRecast[property] -= loopTime; });
    Object.keys(loopStatus).forEach((property) => { loopStatus[property] -= loopTime; });

    gcdTime = 0; /* Zero out for next loop */

    nextTime += loopTime;
  }
  nextActionOverlay.iconArrayB = mnkArray;
  nextActionOverlay.syncIcons();

  clearTimeout(nextActionOverlay.timeout.nextAction);
  nextActionOverlay.timeout.nextAction = setTimeout(
    nextAction, gcd * 2,
  );
};

nextActionOverlay.nextAction.MNK.gcd = ({
  combat,
  greasedlightningStacks,
  greasedlightningMax,
  chakra,
  gcd,
  loopRecast,
  loopStatus,
} = {}) => {
  const { duration } = nextActionOverlay;
  const { recast } = nextActionOverlay;

  const { playerData } = nextActionOverlay;
  const { level } = playerData;
  const { targetCount } = nextActionOverlay;

  /* Checks if demolish was snapshotted */
  const demolishStatusPotency = Math.ceil(Math.max(loopStatus.demolish, 0) / 3000) * 65;
  let basePotencyMultiplier = 1;
  let demolishStatusMultiplier = 1;
  const windowMax = recast.riddleoffire - duration.demolish;
  const windowMin = recast.riddleoffire - duration.riddleoffire - duration.demolish;
  if (windowMax >= loopRecast.riddleoffire - loopStatus.demolish
  && windowMin <= loopRecast.riddleoffire - loopStatus.demolish) {
    demolishStatusMultiplier = 1.25;
  } /* REALLY unsure about this formula but whatever */

  if (loopStatus.riddleoffire > 0) {
    basePotencyMultiplier = 1.25;
  }

  const snappunchPotency = 230 * basePotencyMultiplier
    + demolishStatusPotency * demolishStatusMultiplier;
  const rockbreakerPotency = 120 * targetCount * basePotencyMultiplier
    + demolishStatusPotency * demolishStatusMultiplier;
  const demolishPotency = (90 + (18000 / 3000) * 65) * basePotencyMultiplier
    - demolishStatusPotency * demolishStatusMultiplier;

  /* Perfect Balance priorities */
  if (loopStatus.perfectbalance > 0) { /* Implies player level >= 50 */
    /* Increase GL stacks and refresh */
    if (greasedlightningStacks < greasedlightningMax || loopStatus.greasedlightning < gcd * 3) {
      if (rockbreakerPotency > Math.max(demolishPotency, snappunchPotency)) {
        return 'Rockbreaker';
      }
      if (demolishPotency > snappunchPotency) {
        return 'Demolish';
      }
      return 'Snap Punch';
    }

    /* Keep Twin Snakes up for AoE */
    if (targetCount > 1
    && loopStatus.twinsnakes > 0 && loopStatus.twinsnakes < gcd) {
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

  /* Anatman */
  if (level >= 78 && greasedlightningStacks < greasedlightningMax
  && loopStatus.opoopoform > 0 && loopStatus.leadenfist < 0 && loopStatus.riddleoffire < 0
  && loopRecast.anatman < 0) {
    return 'Anatman';
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

  if (level >= 40 && targetCount > 1 && loopStatus.twinsnakes > 0
  && loopStatus.raptorform > 0) {
    return 'Four Point Fury';
  }

  if (level >= 50 && loopRecast.perfectbalance < gcd * 3 && greasedlightningStacks >= 3
  && loopStatus.raptorform > 0) {
    return 'Twin Snakes'; /* Twin Snakes before Perfect Balance if able */
  }

  if (level >= 18 && loopStatus.twinsnakes <= gcd * 2 && loopStatus.raptorform > 0) {
    return 'Twin Snakes';
  }

  if (level >= 4 && loopStatus.raptorform > 0) {
    return 'True Strike';
  }

  if (level >= 26 && targetCount > 2) {
    return 'Arm Of The Destroyer';
  }

  if (level >= 50 && (loopStatus.leadenfist < 0 || loopStatus.opoopoform < 0)) {
    return 'Dragon Kick';
  }

  return 'Bootshine';
};

nextActionOverlay.nextAction.MNK.ogcd = ({
  combat,
  greasedlightningStacks,
  greasedlightningMax,
  loopRecast,
  loopStatus,
} = {}) => {
  const { recast } = nextActionOverlay;
  const { playerData } = nextActionOverlay;
  const { targetCount } = nextActionOverlay;
  const { level } = playerData;

  if (level >= 76 && loopStatus.fistsofwind < 0 && greasedlightningStacks >= 3
  && loopStatus.coeurlform > 0) {
    return 'Fists Of Wind';
  }

  if (level >= 40 && greasedlightningStacks <= 3 && (loopStatus.coeurlform < 0 || level < 76)
  && loopStatus.fistsoffire < 0) {
    return 'Fists Of Fire';
  }

  if (!combat) {
    return '';
  }

  if (level >= 68 && loopStatus.coeurlform > 0 && greasedlightningStacks >= 2
  && loopRecast.riddleoffire < 0) {
    return 'Riddle Of Fire';
  }
  if (level >= 70 && loopRecast.riddleoffire > recast.brotherhood * 0.25
  && loopRecast.brotherhood < 0) {
    return 'Brotherhood';
  }

  if (level >= 50 && targetCount <= 2
  && (greasedlightningStacks >= 4 /* Implies 76 */ || (level < 76 && greasedlightningStacks === 3))
  && loopStatus.raptorform > 0 && loopRecast.perfectbalance < 0) {
    return 'Perfect Balance';
  }

  if (level >= 50 && level < 78 && targetCount <= 2
  && greasedlightningStacks < greasedlightningMax && loopStatus.opoopoform > 0
  && loopRecast.perfectbalance < 0) {
    return 'Perfect Balance'; /* Use PB to boost to 3 stacks before 78) */
  }

  // if (level >= 74 && nextActionOverlay.targetCount > 1 && chakra === 5) {
  //   return 'Enlightenment';
  // }

  if (level >= 56 && targetCount > 1
  && loopRecast.riddleoffire > recast.elixirfield * 0.25
  && loopRecast.elixirfield < 0) {
    return 'Elixir Field';
  }

  // if (level >= 54 && chakra === 5) {
  //   return 'The Forbidden Chakra';
  // }

  if (level >= 56 && loopRecast.riddleoffire > recast.elixirfield * 0.25
  && loopRecast.elixirfield < 0) {
    return 'Elixir Field';
  }

  if (level >= 66 && loopRecast.shouldertackle2 < 0) {
    return 'Shoulder Tackle';
  }

  return ''; /* Nothing available */
};

nextActionOverlay.onAction.MNK = (actionMatch) => {
  const { actionName } = actionMatch.groups;
  const { removeIcon } = nextActionOverlay;
  const { checkStatus } = nextActionOverlay;
  const { removeStatus } = nextActionOverlay;
  const { addRecast } = nextActionOverlay;
  const { checkRecast } = nextActionOverlay;
  const { recast } = nextActionOverlay;
  const { duration } = nextActionOverlay;

  const { targetData } = nextActionOverlay;
  const { weaponskills } = nextActionOverlay.actionList;
  // const nextAction = nextActionOverlay.nextAction.MNK;

  const { addStatus } = nextActionOverlay;
  const { playerData } = nextActionOverlay;
  const { level } = playerData;

  const gcd = playerData.gcd * (1 - playerData.greasedlightningStacks * 0.05);
  // const opoopoformWeaponskills = ['Bootshine', 'Dragon Kick', 'Arm Of The Destroyer'];
  // const raptorformWeaponskills = ['True Strike', 'Twin Snakes', 'Four-Point Fury'];
  // const coeurlformWeaponskills = ['Demolish', 'Snap Punch', 'Rockbreaker'];

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
    nextActionOverlay.targetCount = 1; /* Multi target action only hits single target */
  } else if (singletargetActions.includes(actionName)) {
    nextActionOverlay.targetCount = 1;
  }

  const property = actionName.replace(/[\s':-]/g, '').toLowerCase();

  /* Recasts */
  if (actionName === 'Shoulder Tackle') {
    if (level >= 66) {
      addRecast({ actionName: 'Shoulder Tackle 1', recast: checkRecast({ actionName: 'Shoulder Tackle 2' }) });
      addRecast({
        actionName: 'Shoulder Tackle 2',
        recast: checkRecast({ actionName: 'Shoulder Tackle 2' }) + recast.shouldertackle,
      });
    } else {
      addRecast({ actionName: 'Shoulder Tackle 1' });
    }
  } else if (recast[property]) {
    addRecast({ actionName });
  }

  /* Statuses */
  if (actionName === 'Bootshine') {
    removeStatus({ statusName: 'Leaden Fist' });
  } else if (actionName === 'Four-Point Fury' && checkStatus({ statusName: 'Twin Snakes' }) > 0) {
    addStatus({
      statusName: 'Twin Snakes',
      duration: Math.min(duration.twinsnakes, checkStatus({ statusName: 'Twin Snakes' }) + 10000),
    });
  } else if (actionName === 'Demolish') {
    addStatus({ statusName: 'Demolish', id: targetData.id });
  } else if (actionName === 'Dragon Kick'
  && (checkStatus({ statusName: 'Opo-Opo Form' }) > 0 || checkStatus({ statusName: 'Perfect Balance' }) > 0)) {
    addStatus({ statusName: 'Leaden Fist' });
  } else if (['Perfect Balance', 'Riddle Of Fire'].includes(actionName)) {
    addStatus({ statusName: actionName, duration: duration[property] + gcd });
  } else if (duration[property]) {
    addStatus({ statusName: actionName });
  }

  // if (actionName === 'Meditation') {
  //   if (nextActionOverlay.combat) {
  //     playerData.chakra = 5;
  //   } else {
  //     playerData.chakra += 1;
  //   }
  // } else if (actionName === 'Anatman'
  // && playerData.greasedlightningStacks < playerData.greasedlightningMax) {
  //   playerData.greasedlightningStacks += 1;
  // } else if (['Snap Punch', 'Demolish', 'Rockbreaker'].includes(actionName)) {
  //   playerData.greasedlightningStatus = 16000;
  //   /* Increase GL up to max */
  //   if (playerData.greasedlightningStacks < playerData.greasedlightningMax) {
  //     playerData.greasedlightningStacks += 1;
  //   }
  // } else if (actionName === 'Form Shift'
  // && checkStatus({ statusName: 'Coeurl Form' }) > 0 && playerData.greasedlightningStacks > 0) {
  //   playerData.greasedlightningStatus = 16000;
  // }

  // /* Form changes */
  // if (checkStatus({ statusName: 'Perfect Balance' }) > 0) {
  //   removeStatus({ statusName: 'Opo-Opo Form' });
  //   removeStatus({ statusName: 'Raptor Form' });
  //   removeStatus({ statusName: 'Coeurl Form' });
  // } else if (actionName === 'Form Shift') {
  //   if (checkStatus({ statusName: 'Opo-Opo Form' }) > 0) {
  //     removeStatus({ statusName: 'Opo-Opo Form' });
  //     addStatus({ statusName: 'Raptor Form' });
  //     removeStatus({ statusName: 'Coeurl Form' });
  //   } else if (checkStatus({ statusName: 'Raptor Form' }) > 0) {
  //     removeStatus({ statusName: 'Opo-Opo Form' });
  //     removeStatus({ statusName: 'Raptor Form' });
  //     addStatus({ statusName: 'Coeurl Form' });
  //   } else {
  //     addStatus({ statusName: 'Opo-Opo Form' });
  //     removeStatus({ statusName: 'Raptor Form' });
  //     removeStatus({ statusName: 'Coeurl Form' });
  //   }
  // }
  //  else if (opoopoformWeaponskills.includes(actionName)) {
  //   removeStatus({ statusName: 'Opo-Opo Form' });
  //   addStatus({ statusName: 'Raptor Form' });
  //   removeStatus({ statusName: 'Coeurl Form' });
  // } else if (raptorformWeaponskills.includes(actionName)) {
  //   removeStatus({ statusName: 'Opo-Opo Form' });
  //   removeStatus({ statusName: 'Raptor Form' });
  //   addStatus({ statusName: 'Coeurl Form' });
  // } else if (coeurlformWeaponskills.includes(actionName)) {
  //   addStatus({ statusName: 'Opo-Opo Form' });
  //   removeStatus({ statusName: 'Raptor Form' });
  //   removeStatus({ statusName: 'Coeurl Form' });
  // }

  /* Toggles combat flag for loop */
  if (!['Fists Of Fire', 'Fists Of Wind', 'Form Shift', 'Meditation'].includes(actionName)) {
    nextActionOverlay.combat = true;
  }

  /* Call next function */
  if (checkStatus({ statusName: 'Perfect Balance' }) > 0 && weaponskills.includes(actionName)) {
    nextActionOverlay.nextAction.MNK({ delay: gcd }); /* No stance changes if PB is up */
  } else if (actionName === 'Six-Sided Star') {
    nextActionOverlay.nextAction.MNK({ delay: gcd * 2 });
  }
  // console.log(gcd);
};

nextActionOverlay.onStatus.MNK = (statusMatch) => {
  /* Shorten common functions */
  const { addStatus } = nextActionOverlay;
  const { removeStatus } = nextActionOverlay;
  // const { checkStatus } = nextActionOverlay;

  const { playerData } = nextActionOverlay;
  const { gcd } = playerData;

  const { statusName } = statusMatch.groups;

  if (statusMatch.groups.gainsLoses === 'gains') {
    addStatus({
      statusName,
      duration: parseFloat(statusMatch.groups.statusDuration) * 1000,
      id: statusMatch.groups.targetID,
    });

    // if (['Anatman', 'Perfect Balance'].includes(statusName)) {
    //   nextActionOverlay.nextAction.MNK({ delay: 0 });
    // }

    /* Triggers nextAction on form change */
    /* This prevents weird shenanigans during invincibility etc. */
    if (['Opo-Opo Form', 'Raptor Form', 'Coeurl Form'].includes(statusName)) {
      nextActionOverlay.nextAction.MNK({ delay: gcd });
    }

    // if (['Twin Snakes', 'Leaden Fist'].includes(statusName)) {
    //   //console.log(checkStatus({ statusName: 'Leaden Fist' }));
    //   nextActionOverlay.nextAction.MNK({ delay: gcd });
    // } /* For Perfect Balance mainly? Looks like above will usually catch it */
  } else {
    removeStatus({
      statusName,
      id: statusMatch.groups.targetID,
    });

    // if (['Opo-Opo Form', 'Raptor Form', 'Coeurl Form'].includes(statusName)) {
    //   nextActionOverlay.nextAction.MNK({ delay: gcd });
    // }

    // if (['Anatman', 'Perfect Balance'].includes(statusName)) {
    //   nextActionOverlay.nextAction.MNK({ delay: 0 });
    // }

    // if (['Twin Snakes', 'Leaden Fist'].includes(statusName)) {
    //  // console.log(checkStatus({ statusName: 'Leaden Fist' }));
    //   nextActionOverlay.nextAction.MNK({ delay: gcd });
    // }
  }
};
