nextActionOverlay.mnkJobChange = () => {
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

nextActionOverlay.mnkPlayerChange = (e) => {
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
    nextActionOverlay.mnkNextAction({ delay: 0 });
  }
  playerData.chakra = e.detail.jobDetail.chakraStacks;
};

nextActionOverlay.mnkTargetChange = () => {
  nextActionOverlay.mnkNextAction();
};

nextActionOverlay.mnkNextAction = ({
  delay = 0,
} = {}) => {
  const { checkRecast } = nextActionOverlay;
  const { checkStatus } = nextActionOverlay;
  const { recast } = nextActionOverlay;
  const { duration } = nextActionOverlay;

  const { level } = nextActionOverlay.playerData;

  // Snapshot of current character
  let { combat } = nextActionOverlay;
  let { greasedlightningStacks } = nextActionOverlay.playerData;
  let { chakra } = nextActionOverlay.playerData;
  let greasedlightningMultiplier = 1 - 0.05 * greasedlightningStacks;
  let { gcd } = nextActionOverlay.gcd * greasedlightningMultiplier;

  const loopRecast = {};
  const loopRecastList = nextActionOverlay.actionList.abilities.concat(['Shoulder Tackle 1', 'Shoulder Tackle 2']);
  loopRecastList.forEach((actionName) => {
    const propertyName = actionName.replace(/[\s':-]/g, '').toLowerCase();
    loopRecast[propertyName] = checkRecast({ actionName });
  });

  const loopStatus = {};
  const loopStatusList = nextActionOverlay.statusList.self;
  loopStatusList.forEach((statusName) => {
    const propertyName = statusName.replace(/[\s':-]/g, '').toLowerCase();
    loopStatus[propertyName] = checkStatus({ statusName });
  });

  // Only non-self-status, so do it manually
  loopStatus.demolish = checkStatus({ statusName: 'Demolish', id: nextActionOverlay.targetData.id }); /* Not self-targeted */
  // Not really status, but who cares
  loopStatus.greasedlightning = nextActionOverlay.playerData.greasedlightningStatus;

  const iconArray = [];

  let gcdTime = delay;
  let nextTime = 0;
  const nextMaxTime = 15000;

  while (nextTime < nextMaxTime) {
    let loopTime = 0;

    // Calculate max GL in case Fists was used in previous loop
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

    // Calculate GCD for this loop
    greasedlightningMultiplier = 1 - 0.05 * greasedlightningStacks;
    gcd = nextActionOverlay.gcd * greasedlightningMultiplier;

    if (gcdTime <= 1000) {
      // Everything cancels Anatman
      loopStatus.anatman = -1;

      const nextGCD = nextActionOverlay.mnkNextGCD({
        combat,
        greasedlightningStacks,
        greasedlightningMax,
        chakra,
        gcd,
        loopRecast,
        loopStatus,
      });

      // Toggle combat if GCD implies combat
      if (!['Form Shift', 'Meditation'].includes(nextGCD)) { combat = true; }

      iconArray.push({ name: nextGCD });

      // Set general recast/status
      const property = nextGCD.replace(/[\s':-]/g, '').toLowerCase();
      if (recast[property]) { loopRecast[property] = recast[property]; }
      if (duration[property]) { loopStatus[property] = duration[property]; }

      // Special effects
      if (nextGCD === 'Bootshine') {
        loopStatus.leadenfist = -1;
      } else if (nextGCD === 'Four Point Fury' && loopStatus.twinsnakes > 0) {
        loopStatus.twinsnakes += 15000;
      } else if (nextGCD === 'Dragon Kick'
      && (loopStatus.opoopoform > 0 || loopStatus.perfectbalance > 0)) {
        loopStatus.leadenfist = duration.leadenfist;
      }

      // Set Twin Snakes to cap if over cap
      if (loopStatus.twinsnakes > 15000) { loopStatus.twinsnakes = 15000; }

      // Resources
      if (nextGCD === 'Meditation') {
        if (!combat) { chakra = 5; } else { chakra += 1; }
      } else if (nextGCD === 'Anatman' && greasedlightningStacks < greasedlightningMax) {
        greasedlightningStacks += 1;
      } else if (['Snap Punch', 'Demolish', 'Rockbreaker'].includes(nextGCD)) {
        loopStatus.greasedlightning = 16000;
        // Increase GL up to max
        if (greasedlightningStacks < greasedlightningMax) {
          greasedlightningStacks += 1;
        }
      } else if (nextGCD === 'Form Shift' && loopStatus.coeurlform > 0 && greasedlightningStacks > 0) {
        loopStatus.greasedlightning = 16000;
      }

      // Form changes
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
        loopTime = gcdTime;
      } else if (nextGCD === 'Anatman') {
        gcdTime = 0;
        loopTime = 3000; // Fix this number later maybe
        loopStatus.greasedlightning += loopTime; // Offsets adjustment
      } else {
        gcdTime = gcd;
        loopTime = gcdTime;
      }
    }

    Object.keys(loopRecast).forEach((property) => {
      loopRecast[property] = Math.max(loopRecast[property] - loopTime, -1);
    });
    Object.keys(loopStatus).forEach((property) => {
      loopStatus[property] = Math.max(loopStatus[property] - loopTime, -1);
    });

    // Reset GL if it's gone
    if (loopStatus.greasedlightning < 0) { greasedlightningStacks = 0; }

    let weave = 1;
    let weaveMax = 0;
    if (gcdTime > 2200) {
      weaveMax = 2;
    } else if (gcdTime >= 1500) {
      weaveMax = 1;
    }

    while (weave <= weaveMax) {
      const nextOGCD = nextActionOverlay.mnkNextOGCD({
        weave,
        weaveMax,
        combat,
        greasedlightningStacks,
        greasedlightningMax,
        chakra,
        loopRecast,
        loopStatus,
      });

      if (nextOGCD) {
        iconArray.push({ name: nextOGCD, size: 'small' });

        // Recast and Status
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

        if (['The Forbidden Chakra', 'Enlightenment'].includes(nextOGCD)) { chakra = 0; }
        if (!['Fists Of Fire', 'Fists Of Wind', ''].includes(nextOGCD)) { combat = true; }
      }

      weave += 1;
    }

    gcdTime = 0;
    nextTime += loopTime;
  }
  nextActionOverlay.NEWsyncIcons({ iconArray });

  clearTimeout(nextActionOverlay.timeout.nextAction);
  nextActionOverlay.timeout.nextAction = setTimeout(
    nextActionOverlay.mnkNextAction, gcd * 2,
  );
};

nextActionOverlay.mnkNextGCD = ({
  combat,
  greasedlightningStacks,
  greasedlightningMax,
  chakra,
  gcd,
  loopRecast,
  loopStatus,
} = {}) => {
  const { targetCount } = nextActionOverlay;
  const { duration } = nextActionOverlay;
  const { recast } = nextActionOverlay;

  const { playerData } = nextActionOverlay;
  const { level } = playerData;

  const snappunchPotency = 230;
  const rockbreakerPotency = 120 * targetCount;

  // Checks if Demolish was snapshotted
  // Taken from PLD Goring Blade check, so probably need to fix this if that's changed
  const riddleoffireCutoff = recast.riddleoffire - duration.riddleoffire;
  let dotPotencyLoss = 65 * (Math.ceil(Math.max(loopStatus.demolish, 0) / 3000));
  if (loopStatus.riddleoffire < 0
  && loopRecast.riddleoffire + loopStatus.demolish > riddleoffireCutoff) {
    dotPotencyLoss *= 1.25;
  } else if (loopStatus.riddleoffire > 0
  && loopRecast.riddleoffire + loopStatus.demolish > recast.riddleoffire) {
    dotPotencyLoss *= 0.8;
  }
  const demolishPotency = 90 + 65 * 6 - dotPotencyLoss;

  // Perfect Balance (implies player level >= 50)
  if (loopStatus.perfectbalance > 0) {
    // Not at max stacks or need to refresh
    if (greasedlightningStacks < greasedlightningMax || loopStatus.greasedlightning < gcd * 4) {
      if (rockbreakerPotency > Math.max(demolishPotency, snappunchPotency)) { return 'Rockbreaker'; }
      if (demolishPotency > snappunchPotency) { return 'Demolish'; }
      return 'Snap Punch';
    }

    // Keep Twin Snakes up for AoE
    if (targetCount > 1
    && loopStatus.twinsnakes > 0 && loopStatus.twinsnakes < gcd) { return 'Four Point Fury'; }

    // Apply Demolish if needed
    if (loopStatus.demolish < 0) { return 'Demolish'; }

    // DK/BS spam
    if (loopStatus.leadenfist < 0) { return 'Dragon Kick'; }
    return 'Bootshine';
  }

  // Out of combat
  if (!combat && chakra < 5) { return 'Meditation'; }
  if (!combat && loopStatus.coeurlform < gcd * 2) { return 'Form Shift'; }

  // Anatman
  if (level >= 78 && greasedlightningStacks < greasedlightningMax
  && loopStatus.opoopoform > 0 && loopStatus.leadenfist < 0 && loopStatus.riddleoffire < 0
  && loopRecast.anatman < 0) {
    return 'Anatman';
  }

  // General priority (no PB)

  // Couerl Form
  if (level >= 30 && rockbreakerPotency > Math.max(demolishPotency, snappunchPotency) && loopStatus.coeurlform > 0) { return 'Rockbreaker'; }
  if (level >= 30 && demolishPotency > snappunchPotency && loopStatus.coeurlform > 0) { return 'Demolish'; }
  if (level >= 6 && loopStatus.coeurlform > 0) { return 'Snap Punch'; }

  // Raptor Form
  // Twin Snakes before Perfect Balance
  if (level >= 50 && loopRecast.perfectbalance < gcd * 3 && greasedlightningStacks >= 3 && loopStatus.raptorform > 0) { return 'Twin Snakes'; }
  if (level >= 40 && targetCount > 1 && loopStatus.twinsnakes > 0 && loopStatus.raptorform > 0) { return 'Four Point Fury'; }
  if (level >= 18 && loopStatus.twinsnakes <= gcd * 2 && loopStatus.raptorform > 0) { return 'Twin Snakes'; }
  if (level >= 4 && loopStatus.raptorform > 0) { return 'True Strike'; }

  // Opo-opo Form (or formless)
  if (level >= 26 && targetCount > 2) { return 'Arm Of The Destroyer'; }
  // Dragon Kick when formless when able
  if (level >= 50 && (loopStatus.leadenfist < 0 || loopStatus.opoopoform < 0)) { return 'Dragon Kick'; }
  return 'Bootshine';
};

nextActionOverlay.mnkNextOGCD = ({
  weave,
  weaveMax,
  combat,
  greasedlightningStacks,
  greasedlightningMax,
  chakra,
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

  // Everything else starts combat so
  if (!combat) { return ''; }

  if (level >= 68 && loopStatus.coeurlform > 0 && greasedlightningStacks >= 2 && weave === weaveMax
  && loopRecast.riddleoffire < 0) { return 'Riddle Of Fire'; }

  if (level >= 70 && loopRecast.riddleoffire > recast.brotherhood * 0.5
  && loopRecast.brotherhood < 0) {
    return 'Brotherhood';
  }

  if (level >= 50 && targetCount === 1
  && (greasedlightningStacks >= 4 /* Implies 76 */ || (level < 76 && greasedlightningStacks === 3))
  && loopStatus.raptorform > 0 && loopRecast.perfectbalance < 0) {
    return 'Perfect Balance';
  }

  // Use PB to boost to 3 stacks before 78
  if (level >= 50 && level < 78 && targetCount === 1
  && greasedlightningStacks < greasedlightningMax && loopStatus.opoopoform > 0
  && loopRecast.perfectbalance < 0) {
    return 'Perfect Balance';
  }

  if (level >= 74 && nextActionOverlay.targetCount > 1 && chakra === 5) {
    return 'Enlightenment';
  }

  if (level >= 56 && targetCount > 1
  && loopRecast.riddleoffire > recast.elixirfield * 0.5
  && loopRecast.elixirfield < 0) {
    return 'Elixir Field';
  }

  if (level >= 54 && chakra === 5) {
    return 'The Forbidden Chakra';
  }

  if (level >= 56 && loopRecast.riddleoffire > recast.elixirfield * 0.5
  && loopRecast.elixirfield < 0) {
    return 'Elixir Field';
  }

  if (level >= 66 && loopRecast.shouldertackle2 < 0) {
    return 'Shoulder Tackle';
  }

  return '';
};

nextActionOverlay.mnkActionMatch = (actionMatch) => {
  const { addStatus } = nextActionOverlay;
  const { checkStatus } = nextActionOverlay;
  const { removeStatus } = nextActionOverlay;
  const { addRecast } = nextActionOverlay;
  const { checkRecast } = nextActionOverlay;
  const { recast } = nextActionOverlay;
  const { duration } = nextActionOverlay;
  const { targetData } = nextActionOverlay;

  const { weaponskills } = nextActionOverlay.actionList;
  // const nextAction = nextActionOverlay.nextAction.mnk;

  const { level } = nextActionOverlay.playerData;

  const greasedlightningMultiplier = 1 - nextActionOverlay.playerData.greasedlightningStacks * 0.05;
  const gcd = nextActionOverlay.gcd * greasedlightningMultiplier;
  // const opoopoformWeaponskills = ['Bootshine', 'Dragon Kick', 'Arm Of The Destroyer'];
  // const raptorformWeaponskills = ['True Strike', 'Twin Snakes', 'Four-Point Fury'];
  // const coeurlformWeaponskills = ['Demolish', 'Snap Punch', 'Rockbreaker'];

  const { actionName } = actionMatch.groups;

  nextActionOverlay.NEWremoveIcon({ name: actionName });
  // console.log(`${actionName}`);

  const singletargetActions = [];

  if (level >= 26 && checkStatus({ statusName: 'Leaden Fist' }) < 0) {
    singletargetActions.push('Bootshine');
  }

  if (level >= 30) {
    singletargetActions.push('Snap Punch');
  }

  if (level >= 45) {
    singletargetActions.push('True Strike');
  }

  if (level >= 45 && checkStatus({ statusName: 'Twin Snakes' }) > 0) {
    singletargetActions.push('Twin Snakes');
  }

  if (level >= 74) {
    singletargetActions.push('The Forbidden Chakra');
  }

  if (checkStatus({ statusName: 'Demolish', id: targetData.id }) > 0) {
    singletargetActions.push('Demolish');
  }

  const multitargetActions = [ /* Actions that can hit multiple targets */
    'Arm Of The Destroyer', 'Four-Point Fury', 'Rockbreaker', 'Elixir Field', 'Enlightenment',
  ];

  /* Set probable target count 1 */
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
    nextActionOverlay.mnkNextAction({ delay: gcd }); /* No stance changes if PB is up */
  } else if (actionName === 'Six-Sided Star') {
    nextActionOverlay.mnkNextAction({ delay: gcd * 2 });
  }
  // console.log(gcd);
};

nextActionOverlay.mnkStatusMatch = (statusMatch) => {
  /* Shorten common functions */
  const { addStatus } = nextActionOverlay;
  const { removeStatus } = nextActionOverlay;

  const greasedlightningMultiplier = 1 - nextActionOverlay.playerData.greasedlightningStacks * 0.05;
  const gcd = nextActionOverlay.gcd * greasedlightningMultiplier;

  const { statusName } = statusMatch.groups;

  if (statusMatch.groups.gainsLoses === 'gains') {
    addStatus({
      statusName,
      duration: parseFloat(statusMatch.groups.statusDuration) * 1000,
      id: statusMatch.groups.targetID,
    });

    if (['Opo-Opo Form', 'Raptor Form', 'Coeurl Form'].includes(statusName)) {
      nextActionOverlay.mnkNextAction({ delay: gcd });
    }
  } else {
    removeStatus({
      statusName,
      id: statusMatch.groups.targetID,
    });
  }
};
