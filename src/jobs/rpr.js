// eslint-disable-next-line no-unused-vars
const rprJobChanged = (e) => {
  currentPlayer.soul = e.detail.jobDetail.soul;
  currentPlayer.shroud = e.detail.jobDetail.shroud;
  currentPlayer.lemureShroud = e.detail.jobDetail.lemureShroud;
  currentPlayer.voidShroud = e.detail.jobDetail.voidShroud;
};

// eslint-disable-next-line no-unused-vars
const rprTargetChanged = () => {
  startLoop();
};

// eslint-disable-next-line no-unused-vars
const rprActionMatch = ({
  // logType,
  actionName, loop,
} = {}) => {
  const { level } = currentPlayer;

  let player = currentPlayer;
  if (loop) { player = loopPlayer; }

  const actionType = getActionProperty({ actionName, property: 'type' });

  if (level >= 50) {
    // Soul Gauge
    switch (actionName) {
      case 'Slice': case 'Waxing Slice': case 'Infernal Slice': case 'Spinning Scythe': case 'Nightmare Scythe':
        player.soul = Math.min(player.soul + 10, 100); break;
      case 'Blood Stalk': case 'Grim Swathe': case 'Unveiled Gibbet': case 'Unveiled Gallows': case 'Gluttony':
        player.soul -= 50; break;
      case 'Soul Slice': case 'Soul Scythe':
        player.soul = Math.min(player.soul + 50, 100); break;
      default:
    }
  }

  if (level >= 70) {
    // Soul Reaver
    switch (actionName) {
      case 'Blood Stalk': case 'Grim Swathe': case 'Unveiled Gibbet': case 'Unveiled Gallows':
        addStatus({ statusName: 'Soul Reaver', loop }); break;
      case 'Gibbet': case 'Gallows': case 'Guillotine':
        switch (actionName) {
          case 'Gibbet':
            addStatus({ statusName: 'Enhanced Gallows', loop });
            removeStatus({ statusName: 'Enhanced Gibbet', loop }); break;
          case 'Gallows':
            addStatus({ statusName: 'Enhanced Gibbet', loop });
            removeStatus({ statusName: 'Enhanced Gallows', loop }); break;
          default:
        }
        // SR stack #1 from Gluttony removed BEFORE ActionEffect for JUST Gibbet/Gallows
        // Why? WELL WHY THE HELL NOT HUH?!
        if (actionName === 'Guillotine') {
          removeStatusStacks({ statusName: 'Soul Reaver', loop });
        } else if (loop && player.gluttony) {
          removeStatusStacks({ statusName: 'Soul Reaver', loop });
        } else if (!player.gluttony) {
          removeStatusStacks({ statusName: 'Soul Reaver', loop });
        }
        player.gluttony = false;
        break;
      case 'Gluttony':
        player.gluttony = true; // Keeps track of source of Soul Reaver stacks because of above
        addStatus({ statusName: 'Soul Reaver', stacks: 2, loop }); break;
      default:
        if (['Weaponskill', 'Spell'].includes(actionType)) {
          // All other weaponskills/spells remove Soul Reaver, I think
          removeStatus({ statusName: 'Soul Reaver', loop });
        }
    }
  }

  if (level >= 80) {
    // Shroud
    switch (actionName) {
      case 'Gibbet': case 'Gallows': case 'Guillotine':
        player.shroud = Math.min(player.shroud + 10, 100); break;
      case 'Plentiful Harvest':
        player.shroud = Math.min(player.shroud + 50, 100); break;
      case 'Enshroud':
        player.shroud = Math.max(player.shroud - 50, 0);
        addStatus({ statusName: 'Enshrouded', loop });
        player.lemureShroud = 5; break;
      default:
    }

    if (getStatusDuration({ statusName: 'Enshrouded', loop }) > 0) {
      // Lemure Shroud
      switch (actionName) {
        case 'Void Reaping': case 'Cross Reaping': case 'Grim Reaping': case 'Communio':
          player.lemureShroud -= 1;

          if (player.lemureShroud > 0 && actionName !== 'Communio') {
            if (level >= 86) { player.voidShroud += 1; }
            switch (actionName) {
              case 'Void Reaping':
                addStatus({ statusName: 'Enhanced Cross Reaping', loop });
                removeStatus({ statusName: 'Enhanced Void Reaping', loop }); break;
              case 'Cross Reaping':
                addStatus({ statusName: 'Enhanced Void Reaping', loop });
                removeStatus({ statusName: 'Enhanced Cross Reaping', loop }); break;
              default:
            }
          } else {
            // Exit Shroud and remove resources/buffs if out of stacks or Communio was used
            removeStatus({ statusName: 'Enshrouded', loop });
            removeStatus({ statusName: 'Enhanced Void Reaping', loop });
            removeStatus({ statusName: 'Enhanced Cross Reaping', loop });
            player.lemureShroud = 0;
            player.voidShroud = 0; break;
          } break;
        case 'Lemure\'s Slice': case 'Lemure\'s Scythe':
          player.voidShroud -= 2; break;
        default:
      }
    }
  }

  // Status effects
  switch (actionName) {
    case 'Shadow of Death': case 'Whorl of Death':
      addStatus({
        statusName: 'Death\'s Design',
        targetID: currentTarget.id,
        duration: Math.min(getStatusDuration({ statusName: 'Death\'s Design', targetID: currentTarget.id, loop }) + 30, 60),
        loop,
      }); break;
    case 'Harpe':
      removeStatus({ statusName: 'Enhanced Harpe', loop }); break;
    case 'Hell\'s Ingress': case 'Hell\'s Egress':
      addStatus({ statusName: 'Enhanced Harpe', loop }); break;
    case 'Arcane Circle':
      addStatus({ statusName: 'Arcane Circle', loop });
      if (level >= 88) {
        addStatus({ statusName: 'Circle of Sacrifice', loop });
        addStatus({ statusName: 'Bloodsown Circle', loop });
      }
      break;
    case 'Soulsow':
      addStatus({ statusName: 'Soulsow', loop }); break;
    case 'Harvest Moon':
      removeStatus({ statusName: 'Soulsow', loop }); break;
    case 'Plentiful Harvest':
      removeStatus({ statusName: 'Immortal Sacrifice', loop }); break;
    default:
  }

  // Sacrifice interactions
  if (getStatusDuration({ statusName: 'Circle of Sacrifice', loop }) > 0 && ['Weaponskill', 'Spell'].includes(actionType)) {
    removeStatus({ statusName: 'Circle of Sacrifice', loop });
    addStatus({ statusName: 'Immortal Sacrifice', loop });
  }

  // Recast
  switch (actionName) {
    case 'Soul Scythe':
      addActionRecast({ actionName: 'Soul Slice', loop }); break;
    default:
      addActionRecast({ actionName, loop });
  }

  // Combo
  addComboAction({ actionName, loop });

  // Combat toggle
  switch (actionName) {
    case 'Hell\'s Ingress': case 'Hell\'s Egress': case 'Soulsow':
      // Don't toggle combat for these skills
      break;
    default:
      player.combat = true;
  }

  // Probable target count
  switch (actionName) {
    case 'Infernal Slice': case 'Gibbet': case 'Gallows': case 'Void Reaping': case 'Cross Reaping':
      player.targetCount = 1; break;
    case 'Slice': case 'Waxing Slice':
      if (level >= 25) { player.targetCount = 1; } break;
    case 'Shadow of Death':
      if (level >= 35) { player.targetCount = 1; } break;
    case 'Blood Stalk':
      if (level >= 55) { player.targetCount = 1; } break;
    case 'Soul Slice':
      if (level >= 65) { player.targetCount = 1; } break;
    case 'Spinning Scythe': case 'Nightmare Scythe': case 'Whorl of Death': case 'Grim Swathe': case 'Soul Scythe': case 'Guillotine': case 'Grim Reaping':
      // if (logType === 'AOEActionEffect') {
      player.targetCount = 3; break;
      // }
    default:
  }

  // Start loop
  if (!loop) {
    switch (actionName) {
      case 'Slice': case 'Waxing Slice': case 'Infernal Slice':
      case 'Spinning Scythe': case 'Nightmare Scythe':
      case 'Shadow of Death': case 'Whorl of Death':
      case 'Soul Slice': case 'Soul Scythe':
      case 'Gibbet': case 'Gallows': case 'Guillotine':
      case 'Plentiful Harvest':
        gcdTimestamp = Date.now();
        startLoop({ delay: currentPlayer.gcd }); break;
      case 'Harpe':
        if (getStatusDuration({ statusName: 'Enhanced Harpe', loop }) > 0) {
          gcdTimestamp = Date.now();
          startLoop({ delay: 2.5 });
        } else {
          gcdTimestamp = Date.now() + 1300;
          startLoop({ delay: 2.5 - 1.3 });
        } break;
      case 'Void Reaping': case 'Cross Reaping': case 'Grim Reaping':
        gcdTimestamp = Date.now();
        startLoop({ delay: 1.5 }); break;
      case 'Soulsow':
        if (player.combat === true) {
          startLoop({ delay: 0 });
        } else {
          startLoop({ delay: 2.5 });
        } break;
      case 'Harvest Moon':
        gcdTimestamp = Date.now();
        startLoop({ delay: 2.5 }); break;
      case 'Communio':
        gcdTimestamp = Date.now() + 1300;
        startLoop({ delay: 2.5 - 1.3 }); break;
      case 'Blood Stalk': case 'Grim Swathe': case 'Unveiled Gibbet': case 'Unveiled Gallows': case 'Gluttony':
      case 'Enshroud':
        // Force refactor with these skills
        startLoop({ delay: currentPlayer.gcd - ((Date.now() - gcdTimestamp) / 1000) }); break;
      default:
    }
  }
};

// eslint-disable-next-line no-unused-vars
const rprStatusMatch = ({
  logType, statusName,
  // statusSeconds, sourceID, targetID, statusStacks,
} = {}) => {
  if (logType === 'StatusRemove') {
    switch (statusName) {
      case 'Soul Reaper': case 'Enshrouded':
        // Refactors if these skills fall off (mid-combat/between pulls?)
        startLoop({ delay: currentPlayer.gcd - ((Date.now() - gcdTimestamp) / 1000) }); break;
      default:
    }
  }
};

// eslint-disable-next-line no-unused-vars
const rprGaugeMatch = ({ gaugeHex } = {}) => {
  currentPlayer.soul = parseInt(gaugeHex[0].substring(4, 6), 16);
  currentPlayer.shroud = parseInt(gaugeHex[0].substring(2, 4), 16);
  currentPlayer.lemureShroud = parseInt(gaugeHex[1].substring(4, 6), 16);
  currentPlayer.voidShroud = parseInt(gaugeHex[1].substring(2, 4), 16);
};

// eslint-disable-next-line no-unused-vars
const rprNextGCD = () => {
  const loop = true;

  const { level } = currentPlayer;
  const { targetCount } = currentPlayer;

  const { combat } = loopPlayer;
  const { comboAction } = loopPlayer;
  const { gcd } = loopPlayer;

  const { soul } = loopPlayer;
  const { shroud } = loopPlayer;
  const { lemureShroud } = loopPlayer;
  const { voidShroud } = loopPlayer;

  const bloodsownCircleDuration = getStatusDuration({ statusName: 'Bloodsown Circle', loop });
  const deathsDesignDuration = getStatusDuration({ statusName: 'Death\'s Design', targetID: currentTarget.id, loop });
  const enhancedCrossReapingDuration = getStatusDuration({ statusName: 'Enhanced Cross Reaping', loop });
  const enhancedGallowsDuration = getStatusDuration({ statusName: 'Enhanced Gallows', loop });
  const enhancedGibbetDuration = getStatusDuration({ statusName: 'Enhanced Gibbet', loop });
  const enhancedVoidReapingDuration = getStatusDuration({ statusName: 'Enhanced Void Reaping', loop });
  const enshroudedDuration = getStatusDuration({ statusName: 'Enshrouded', loop });
  const immortalSacrificeDuration = getStatusDuration({ statusName: 'Immortal Sacrifice', loop });
  const soulReaverDuration = getStatusDuration({ statusName: 'Soul Reaver', loop });
  const soulsowDuration = getStatusDuration({ statusName: 'Soulsow', loop });

  const soulSliceRecast = getRecast({ actionName: 'Soul Slice', loop });

  // Highest priority since apparently everything removes Soul Reaver
  if (soulReaverDuration > 0) { // Implies level >= 70
    // console.log(soulReaverDuration);
    if (targetCount >= 3) { return 'Guillotine'; }
    if (enhancedGibbetDuration > 0) { return 'Gibbet'; }
    if (enhancedGallowsDuration > 0) { return 'Gallows'; }
    return 'Gibbet';
  }

  if (level >= 82 && combat !== true && soulsowDuration === 0) { return 'Soulsow'; }

  // Ensure Death's Design stays on
  let deathsDesignMinimum = gcd * 2;
  if (level >= 76) {
    deathsDesignMinimum = gcd * 4; // Semi-arbritary numbers yay
  } else if (level >= 70) {
    deathsDesignMinimum = gcd * 3;
  }

  if (deathsDesignDuration < deathsDesignMinimum) {
    if (level >= 30 && targetCount > 1) { return 'Whorl of Death'; }
    if (level >= 10) { return 'Shadow of Death'; }
  }

  if (immortalSacrificeDuration > 0 && bloodsownCircleDuration === 0 && enshroudedDuration === 0 && shroud <= 50) { return 'Plentiful Harvest'; }

  if (soulsowDuration > 0 && targetCount > 1) { return 'Harvest Moon'; }

  if (enshroudedDuration > 0) { // Implies level >= 80
    if (enshroudedDuration < gcd && enshroudedDuration > 1.3) { return 'Communio'; }
    if (level < 86
    || !(voidShroud >= 2 && lemureShroud === 1)) { // Delays last GCD with 2 Void Shrouds
      if (level >= 90 && lemureShroud === 1) { return 'Communio'; }
      if (targetCount >= 3) { return 'Grim Reaping'; }
      if (enhancedVoidReapingDuration > 0) { return 'Void Reaping'; }
      if (enhancedCrossReapingDuration > 0) { return 'Cross Reaping'; }
      return 'Void Reaping';
    }
  }

  if (level >= 60 && soulSliceRecast === 0 && soul <= 50) {
    if (level >= 65 && targetCount >= 3) { return 'Soul Scythe'; }
    return 'Soul Slice';
  }

  // Continue/start combos
  if (level >= 45 && comboAction === 'Spinning Scythe') { return 'Nightmare Scythe'; }
  if (level >= 30 && comboAction === 'Waxing Slice') { return 'Infernal Slice'; }
  if (level >= 5 && comboAction === 'Slice') { return 'Waxing Slice'; }

  // Dumb algorithm for deciding if an extention will not be wasted
  if (deathsDesignDuration < 30
  && currentTarget.hp / currentTarget.maxHP > deathsDesignDuration / 60) {
    if (level >= 30 && targetCount > 1) { return 'Whorl of Death'; }
    if (level >= 10) { return 'Shadow of Death'; }
  }

  if (level >= 78 && soulSliceRecast <= 30 && soul <= 50) {
    if (level >= 65 && targetCount >= 3) { return 'Soul Scythe'; }
    return 'Soul Slice';
  }

  if (soulsowDuration > 0) { return 'Harvest Moon'; } // Techncially better for disconnects

  if (level >= 24 && targetCount >= 3) { return 'Spinning Scythe'; }
  return 'Slice';
};

// eslint-disable-next-line no-unused-vars
const rprNextOGCD = ({ weaveCount } = {}) => {
  if (weaveCount > 1) { return ''; } // Lazy
  if (!loopPlayer.combat) { return ''; } // So lazy

  const loop = true;

  const { level } = currentPlayer;
  const { targetCount } = currentPlayer;

  const { gcd } = loopPlayer;
  const { soul } = loopPlayer;
  const { shroud } = loopPlayer;
  const { voidShroud } = loopPlayer;

  const deathsDesignDuration = getStatusDuration({
    statusName: 'Death\'s Design',
    targetID: currentTarget.id,
    loop,
  });

  const arcaneCircleDuration = getStatusDuration({ statusName: 'Arcane Circle', loop });
  const enshroudedDuration = getStatusDuration({ statusName: 'Enshrouded', loop });
  const enhancedGallowsDuration = getStatusDuration({ statusName: 'Enhanced Gallows', loop });
  const enhancedGibbetDuration = getStatusDuration({ statusName: 'Enhanced Gibbet', loop });
  const soulReaverDuration = getStatusDuration({ statusName: 'Soul Reaver', loop });

  const arcaneCircleRecast = getRecast({ actionName: 'Arcane Circle', loop });
  const gluttonyRecast = getRecast({ actionName: 'Gluttony', loop });
  const soulSliceRecast = getRecast({ actionName: 'Soul Slice', loop });

  // Highest priority since the timing for these can be super tight
  if (level >= 86 && voidShroud >= 2) {
    if (targetCount >= 3) { return 'Lemure\'s Scythe'; }
    return 'Lemure\'s Slice';
  }

  if (level >= 72 && arcaneCircleRecast === 0 && arcaneCircleDuration === 0) { return 'Arcane Circle'; }

  // const soulReaverTime = gcd * 2;

  // const bufferTime = Math.min(soulSliceRecast, deathsDesignDuration);

  if (soulReaverDuration === 0
    && enshroudedDuration === 0
    && deathsDesignDuration > 0) {
    if (soul >= 50) { // Implies level 50
      if (level >= 76 && gluttonyRecast === 0) { return 'Gluttony'; }
      if ((level < 76)
        || (soul >= 100)
        || (level >= 76 && gluttonyRecast > soulSliceRecast)
        || (level >= 78 && gluttonyRecast > soulSliceRecast - 30)) {
        if (level >= 55 && targetCount >= 3) { return 'Grim Swathe'; }
        if (enhancedGibbetDuration > 0) { return 'Unveiled Gibbet'; }
        if (enhancedGallowsDuration > 0) { return 'Unveiled Gallows'; }
        return 'Blood Stalk';
      }
    }

    let enshroudTime = 1.5 * 5;
    if (level >= 90) { enshroudTime = 1.5 * 4 + 2.5; }

    if (gluttonyRecast > enshroudTime + gcd && shroud >= 50) { return 'Enshroud'; }
  }
  return '';
};
