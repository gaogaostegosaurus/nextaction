
player.onPlayerChangedEvent.MNK = (e) => {
  player.greasedlightningStacks = e.detail.jobDetail.lightningStacks;
  if (player.level >= 76 && checkStatus({ name: 'Fists Of Wind' }) > 0) {
    player.greasedlightningMaxStacks = 4;
  } else if (player.level >= 40) {
    player.greasedlightningMaxStacks = 3;
  } else if (player.level >= 20) {
    player.greasedlightningMaxStacks = 2;
  } else if (player.level >= 6) {
    player.greasedlightningMaxStacks = 1;
  } else {
    player.greasedlightningMaxStacks = 0;
  }
  player.greasedlightningStatus = e.detail.jobDetail.lightningMilliseconds;
  if (player.greasedlightningStatus === 0) {
    player.greasedlightningStatus = -1;
  }
  player.chakra = e.detail.jobDetail.chakraStacks;
};

player.statusList.MNK = [
  'Opo-Opo Form', 'Raptor Form', 'Coeurl Form',
  'Fists Of Earth', 'Fists Of Wind', 'Fists Of Fire',
  'Demolish',
];

player.actionList.MNK.weaponskills.opoopoform = [
  'Bootshine', 'Dragon Kick', 'Arm Of The Destroyer',
];

player.actionList.MNK.weaponskills.raptorform = [
  'True Strike', 'Twin Snakes', 'Four-Point Fury',
];

player.actionList.MNK.weaponskills.coeurlform = [
  'Demolish', 'Snap Punch', 'Rockbreaker',
];

player.actionList.MNK.weaponskills.other = [
  'Form Shift',
];

player.actionList.MNK.abilities = [
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

player.statusList.MNK.target = [
  'Demolish',
];

player.statusList.MNK.self = [
  'Twin Snakes', 'Four-Point Fury', 'Dragon Kick',
  'Fists Of Earth', 'Fists Of Wind', 'Fists Of Fire',
  'Riddle Of Fire', 'Brotherhood',
];

player.greasedlightningMaxStacks = ({
  fistsofwindStatus,
} = {}) => {
  let greasedlightningMaxStacks = 0;
  if (player.level >= 76 && fistsofwindStatus > 0) {
    greasedlightningMaxStacks = 4;
  } else if (player.level >= 40) {
    greasedlightningMaxStacks = 3;
  } else if (player.level >= 20) {
    greasedlightningMaxStacks = 2;
  } else if (player.level >= 6) {
    greasedlightningMaxStacks = 1;
  } return greasedlightningMaxStacks;
};

player.nextGCD.MNK = ({
  combat,
  chakra,
  greasedlightningStacks,
  greasedlightningMaxStacks,
  greasedlightningStatus,
  perfectbalanceStatus,
  // opoopoformStatus,
  raptorformStatus,
  coeurlformStatus,
  twinsnakesStatus,
  demolishStatus,
  leadenfistStatus,
} = {}) => {
  const snappunchPotency = 230;
  const rockbreakerPotency = 120;
  const demolishPotency = 90 + (Math.floor(demolishStatus / 3) * 65);
  const gcd = player.gcd * (1 - greasedlightningStacks * 0.05);

  /* Out of combat */
  if (!combat) {
    if (chakra < 5) {
      return 'Meditation';
    } else if (coeurlformStatus < gcd) {
      return 'Form Change';
    }
  }

  /* Special priority for PB */
  if (perfectbalanceStatus > 0) { /* Implies player level >= 50 */
    if (greasedlightningMaxStacks > greasedlightningStacks || greasedlightningStatus < gcd * 2) {
      if (rockbreakerPotency * player.targetCount > demolishPotency) {
        return 'Rockbreaker';
      } else if (demolishPotency > snappunchPotency) {
        return 'Demolish';
      } return 'Snap Punch';
    } else if (twinsnakesStatus < gcd * 2) {
      if (player.targetCount > 1 && twinsnakesStatus > 0) {
        return 'Four Point Fury';
      } return 'Twin Snakes';
    } else if (demolishStatus < 0) {
      return 'Demolish';
    } else if (leadenfistStatus < 0) {
      return 'Dragon Kick';
    } return 'Bootshine';
  }

  /* General priority */
  if (player.level >= 30 && rockbreakerPotency * player.targetCount > demolishPotency
  && coeurlformStatus > 0) {
    return 'Rockbreaker';
  } else if (player.level >= 30 && demolishPotency > snappunchPotency && coeurlformStatus > 0) {
    return 'Demolish';
  } else if (player.level >= 6 && coeurlformStatus > 0) {
    return 'Snap Punch';
  } else if (player.level >= 40 && player.targetCount > 1 && twinsnakesStatus > 0
  && raptorformStatus > 0) {
    return 'Four Point Fury';
  } else if (player.level >= 18 && twinsnakesStatus <= gcd * 3 && raptorformStatus > 0) {
    return 'Twin Snakes';
  } else if (player.level >= 4 && raptorformStatus > 0) {
    return 'True Strike';
  } else if (player.level >= 26 && player.targetCount > 2) {
    return 'Arm Of The Destroyer';
  } else if (player.level >= 50 && leadenfistStatus < 0) {
    return 'Dragon Kick';
  } return 'Bootshine';
};

player.nextOGCD.MNK = ({
  greasedlightningStacks,
  greasedlightningMaxStacks,
  chakra,
  shouldertackle2Recast,
  opoopoformStatus,
  anatmanRecast,
  perfectbalanceRecast,
  elixirfieldRecast,
  brotherhoodRecast,
  riddleoffireRecast,
  fistsoffireStatus,
  fistsofwindStatus,
} = {}) => {
  if (player.level >= 40 && greasedlightningStacks <= 3 && fistsoffireStatus < 0) {
    return 'Fists Of Fire';
  } else if (player.level >= 76 && greasedlightningStacks >= 3 && fistsofwindStatus < 0) {
    return 'Fists Of Wind';
  } else if (player.level >= 78 && greasedlightningStacks < greasedlightningMaxStacks
  && greasedlightningStacks > 0 && anatmanRecast < 0) {
    return 'Anatman'; // Fix later?
  } else if (player.level >= 50 && greasedlightningStacks < greasedlightningMaxStacks
    && opoopoformStatus > 0
    && perfectbalanceRecast < 0) {
    return 'Perfect Balance';
  } else if (greasedlightningStacks >= greasedlightningMaxStacks) {
    if (player.level >= 68 && riddleoffireRecast < 0) {
      return 'Riddle Of Fire';
    } else if (player.level >= 70 && brotherhoodRecast < 0) {
      return 'Brotherhood';
    } else if (player.level >= 74 && player.targetCount > 1 && chakra === 5) {
      return 'Enlightenment';
    } else if (player.level >= 56 && player.targetCount > 1 && elixirfieldRecast < 0) {
      return 'Elixir Field';
    } else if (player.level >= 54 && chakra === 5) {
      return 'The Forbidden Chakra';
    } else if (player.level >= 50 && perfectbalanceRecast < 0) {
      return 'Perfect Balance';
    } else if (player.level >= 56 && elixirfieldRecast < 0) {
      return 'Elixir Field';
    } else if (player.level >= 66 && shouldertackle2Recast < 0) {
      return 'Shoulder Tackle';
    }
  } return '';
};

player.next.MNK = ({
  gcd = 0,
} = {}) => {
  let gcdTime = gcd;
  let nextTime = 0; /* Amount of time looked ahead in loop */
  let mpTick = 0;

  let combat = player.combat;
  let greasedlightningStacks = player.greasedlightningStacks;
  let greasedlightningMaxStacks = player.greasedlightningMaxStacks;
  let greasedlightningStatus = player.greasedlightningStatus;
  let chakra = player.chakra;

  let opoopoformStatus = checkStatus({ name: 'Opo Opo Form' });
  let raptorformStatus = checkStatus({ name: 'Raptor Form' });
  let coeurlformStatus = checkStatus({ name: 'Coeurl Form' });
  let twinsnakesStatus = checkStatus({ name: 'Twin Snakes' });
  let fistsoffireStatus = checkStatus({ name: 'Fists Of Fire' });
  let fistsofwindStatus = checkStatus({ name: 'Fists Of Wind' });
  let leadenfistStatus = checkStatus({ name: 'Leaden Fist' });
  let demolishStatus = checkStatus({ name: 'Demolish', id: target.id });

  let shouldertackle2Recast = checkRecast({ name: 'Shoulder Tackle 2' });
  let anatmanRecast = checkRecast({ name: 'Anatman' });
  let perfectbalanceRecast = checkRecast({ name: 'Perfect Balance' });
  let perfectbalanceStatus = checkStatus({ name: 'Perfect Balance' });
  let elixirfieldRecast = checkRecast({ name: 'Elixir Field' });
  let brotherhoodRecast = checkRecast({ name: 'Brotherhood' });
  let riddleoffireRecast = checkRecast({ name: 'Riddle Of Fire' });

  const mnkArray = [];

  do {
    let loopTime = 0; /* The elapsed time for current loop */

    if (gcdTime <= 0) {
      /* Insert GCD icon if GCD is complete */
      const nextGCD = mnkNextGCD({
        combat,
        greasedlightningStacks,
        greasedlightningStatus,
        fistsofwindStatus,
        perfectbalanceStatus,
        // opoopoformStatus,
        raptorformStatus,
        coeurlformStatus,
        twinsnakesStatus,
        demolishStatus,
        leadenfistStatus,
      });

      mnkArray.push({ name: nextGCD });

      /* Stance change */
      if (['Bootshine', 'Arm Of The Destroyer', 'Dragon Kick'].includes(nextGCD)) {
        opoopoformStatus = -1;
        raptorformStatus = 15000;
        coeurlformStatus = -1;
      } else if (['True Strike', 'Twin Snakes', 'Four Point Fury'].includes(nextGCD)) {
        opoopoformStatus = -1;
        raptorformStatus = -1;
        coeurlformStatus = 15000;
      } else if (['Snap Punch', 'Demolish', 'Rockbreaker'].includes(nextGCD)) {
        opoopoformStatus = 15000;
        raptorformStatus = -1;
        coeurlformStatus = -1;
        greasedlightningStatus = 16000;
        const maxStacks = mnkGreasedLightning({ fistsofwindStatus });
        if (greasedlightningStacks < maxStacks) { greasedlightningStacks += 1; }
      }

      /* Special stuff */
      if (nextGCD === 'Twin Snakes') {
        twinsnakesStatus = duration.twinsnakes;
      } else if (nextGCD === 'Four Point Fury' && twinsnakesStatus > 0) {
        twinsnakesStatus = Math.min(twinsnakesStatus + 10000, 15000);
      } else if (nextGCD === 'Demolish') {
        demolishStatus = duration.demolish;
      }
    } else {
      const nextOGCD = mnkNextOGCD({
        combat,
        greasedlightningStacks,
        chakra,
        shouldertackle2Recast,
        opoopoformStatus,
        anatmanRecast,
        perfectbalanceRecast,
        elixirfieldRecast,
        brotherhoodRecast,
        riddleoffireRecast,
        fistsoffireStatus,
        fistsofwindStatus,
      });

      if (gcdTime >= player.gcd) {
        gcdTime -= 1250;
      } else {
        gcdTime = 0;
      }

      if (nextOGCD) {
        mnkArray.push({ name: nextOGCD, size: 'small' });
      }

      if (nextOGCD === 'Fight Or Flight') {
        fightorflightRecast = recast.fightorflight;
        fightorflightStatus = duration.fightorflight;
      } else if (nextOGCD === 'Spirits Within') {
        spiritswithinRecast = recast.spiritswithin;
        mp = Math.min(mp + 500, 10000);
      } else if (nextOGCD === 'Circle Of Scorn') {
        circleofscornRecast = recast.circleofscorn;
      } else if (nextOGCD === 'Requiescat') {
        requiescatRecast = recast.requiescat;
        requiescatStatus = duration.requiescat;
      }
    }

    combat = true; /* Unsets out of combat */

    brotherhoodRecast -= loopTime;
    fightorflightRecast -= loopTime;
    fightorflightStatus -= loopTime;
    goringbladeStatus -= loopTime;
    requiescatRecast -= loopTime;
    requiescatStatus -= loopTime;
    spiritswithinRecast -= loopTime;
    swordoathStatus -= loopTime;

    nextTime += loopTime;

    /* MP tick */
    if (Math.floor(loopTime / 3000) > mpTick) {
      mp = Math.min(mp + 200, 10000);
      mpTick += 1;
    }
  } while (nextTime < 15000);
  iconArrayB = mnkArray;
  syncIcons();
};

onAction.MNK = (actionMatch) => {
  const actionName = actionMatch.groups.actionName;
  removeIcon({ name: actionName });

  const singletargetActions = [
    'True Strike', 'Snap Punch',
  ];

  if (checkStatus({ name: 'Leaden Fist' }) < 0) {
    singletargetActions.push('Bootshine');
  }

  if (checkStatus({ name: 'Twin Snakes' }) > 0) {
    singletargetActions.push('Twin Snakes');
  }

  if (checkStatus({ name: 'Demolish', id: target.id }) > 0) {
    singletargetActions.push('Demolish');
  }

  if (player.level >= 74) {
    singletargetActions.push('The Forbidden Chakra');
  }

  const multitargetActions = [
    'Arm Of The Destroyer', 'Four-Point Fury', 'Rockbreaker', 'Elixir Field', 'Enlightenment',
  ]; /* Actions that can hit multiple targets */

  /* Set probable target count */
  if (multitargetActions.includes(actionName) && actionMatch.groups.logType === '15') {
    player.targetCount = 1; /* Multi target action only hits single target */
  } else if (singletargetActions.includes(actionName)) {
    player.targetCount = 1;
  }

  /* Add recasts */
  if (actionName === 'Shoulder Tackle') {
    addRecast({ name: 'Shoulder Tackle 1', time: checkRecast({ name: 'Shoulder Tackle 2' }) });
    addRecast({ name: 'Shoulder Tackle 2', time: checkRecast({ name: 'Shoulder Tackle 2' }) + recast.shouldertackle });
  } else if (player.actionList.MNK.abilities.includes(actionName)) {
    addRecast({ name: actionName });
  }

  /* Form changes */
  if (player.actionList.MNK.weaponskills.opoopoform.includes(actionName)) {
    addStatus({ name: 'Raptor Form' });
  } else if (player.actionList.MNK.weaponskills.raptorform.includes(actionName)) {
    addStatus({ name: 'Coeurl Form' });
  } else if (player.actionList.MNK.weaponskills.coeurlform.includes(actionName)) {
    addStatus({ name: 'Opo Opo Form' });
  }

  /* Call next function */
  if (player.actionList.MNK.weaponskills.flat(Infinity).includes(actionName)) {
    player.next.MNK({ gcd: player.gcd });
  }
};
