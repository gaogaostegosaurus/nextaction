// eslint-disable-next-line no-unused-vars
const warJobChanged = (e) => {
  currentPlayer.beast = e.detail.jobDetail.beast;
};

// eslint-disable-next-line no-unused-vars
const warTargetChanged = () => {
  startLoop();
};

// eslint-disable-next-line no-unused-vars
const warActionMatch = ({
  // logType,
  actionName, loop,
} = {}) => {
  const { level } = currentPlayer;

  let player = currentPlayer;
  if (loop) { player = loopPlayer; }

  const actionType = getActionProperty({ actionName, property: 'type' });

  if (level >= 35) {
    // Gauge lines all happen after ActionEffect lines
    switch (actionName) {
      case 'Maim': case 'Storm\'s Eye':
        player.beast = Math.min(player.beast + 10, 100); break;
      case 'Storm\'s Path':
        player.beast = Math.min(player.beast + 20, 100); break;
      case 'Infuriate':
        player.beast = Math.min(player.beast + 50, 100); break;
      case 'Inner Beast': case 'Steel Cyclone': case 'Fell Cleave': case 'Decimate': case 'Chaotic Cyclone': case 'Inner Chaos':
        if (getStatusDuration({ statusName: 'Inner Release', loop }) === 0) { player.beast = Math.max(player.beast - 50, 0); }
        if (level >= 66) { addActionRecast({ actionName: 'Infuriate', recast: -5, loop }); } break;
      default:
    }
  }

  // Status effects
  switch (actionName) {
    case 'Berserk':
      addStatus({ statusName: 'Berserk', stacks: 3, loop }); break;
    case 'Storm\'s Eye': case 'Mythril Tempest':
      addStatus({
        statusName: 'Surging Tempest',
        duration: Math.min(getStatusDuration({ statusName: 'Surging Tempest', loop }) + 30, 60),
        loop,
      }); break;
    case 'Infuriate':
      if (level >= 72) { addStatus({ statusName: 'Nascent Chaos', loop }); } break;
    case 'Inner Release':
      addStatus({ statusName: 'Inner Release', stacks: 3, loop });
      if (getStatusDuration({ statusName: 'Surging Tempest', loop }) > 0) {
        addStatus({
          statusName: 'Surging Tempest',
          duration: Math.min(getStatusDuration({ statusName: 'Surging Tempest', loop }) + 10, 60),
          loop,
        });
      }
      if (level >= 90) { addStatus({ statusName: 'Primal Rend Ready', loop }); } break;
    case 'Chaotic Cyclone': case 'Inner Chaos':
      removeStatus({ statusName: 'Nascent Chaos', loop }); break;
    case 'Primal Rend':
      removeStatus({ statusName: 'Primal Rend Ready', loop }); break;
    default:
  }

  if (actionType === 'Weaponskill' && actionName !== 'Primal Rend') {
    removeStatusStacks({ statusName: 'Berserk', loop });
    removeStatusStacks({ statusName: 'Inner Release', loop });
  }

  // Recast
  switch (actionName) {
    case 'Inner Release':
      addActionRecast({ actionName: 'Berserk', loop }); break;
    case 'Orogeny':
      addActionRecast({ actionName: 'Upheaval', loop }); break;
    default:
      addActionRecast({ actionName, loop });
  }

  // Combo
  addComboAction({ actionName, loop });

  // Combat toggle
  // There's probably something I want here but I don't know what it is
  switch (actionName) {
    default:
      player.combat = true;
  }

  // Probable target count
  switch (actionName) {
    case 'Heavy Swing': case 'Maim':
      if (level >= 10) { player.targetCount = 1; } break;
    case 'Storm\'s Path': case 'Storm\'s Eye':
      player.targetCount = 1; break;
    case 'Inner Beast': case 'Fell Cleave':
      if (level >= 35) { player.targetCount = 1; } break;
    case 'Chaotic Cyclone':
      if (level >= 80) { player.targetCount = 3; } break;
    case 'Inner Chaos':
      player.targetCount = 1; break;
    case 'Overpower': case 'Mythril Tempest': case 'Steel Cyclone': case 'Decimate':
      player.targetCount = 3; break;
    default:
  }

  // Start loop
  if (!loop) {
    // console.log(getRecast({ actionName: 'Infuriate', loop }));
    switch (actionName) {
      case 'Heavy Swing': case 'Maim': case 'Storm\'s Path': case 'Storm\'s Eye':
      case 'Overpower': case 'Mythril Tempest':
      case 'Inner Beast': case 'Steel Cyclone': case 'Fell Cleave': case 'Decimate':
      case 'Chaotic Cyclone': case 'Inner Chaos':
      case 'Primal Rend':
      case 'Tomahawk':
        gcdTimestamp = Date.now();
        startLoop({ delay: currentPlayer.gcd }); break;
      default:
    }
  }
};

// eslint-disable-next-line no-unused-vars
const warStatusMatch = ({
  logType, statusName,
  // statusSeconds, sourceID, targetID,
  statusStacks,
} = {}) => {
  if (logType === 'StatusAdd' && statusName === 'Inner Release' && statusStacks === 3) {
    startLoop({
      delay: currentPlayer.gcd - ((Date.now() - gcdTimestamp) / 1000),
      skipFirstWindow: true,
    });
  }
  if (logType === 'StatusRemove') {
    switch (statusName) {
      case 'Surging Tempest': case 'Inner Release': case 'Nascent Chaos': case 'Primal Rend Ready':
        // Refactors if IR falls off (mid-combat/between pulls?)
        startLoop({
          delay: currentPlayer.gcd - ((Date.now() - gcdTimestamp) / 1000),
          skipFirstWindow: true,
        }); break;
      default:
    }
  }
};

// eslint-disable-next-line no-unused-vars
const warGaugeMatch = ({ gaugeHex } = {}) => {
  currentPlayer.beast = parseInt(gaugeHex[0].substring(4, 6), 16);
};

const warSpender = () => {
  const loop = true;
  const { level } = currentPlayer;
  const { targetCount } = currentPlayer;

  const nascentChaosDuration = getStatusDuration({ statusName: 'Nascent Chaos', loop });

  if (targetCount >= 3) {
    if (nascentChaosDuration > 0) { return 'Chaotic Cyclone'; }
    if (level >= 60) { return 'Decimate'; }
    return 'Steel Cyclone';
  }

  if (nascentChaosDuration > 0) {
    if (level >= 80) { return 'Inner Chaos'; }
    return 'Chaotic Cyclone';
  }

  if (level >= 54) { return 'Fell Cleave'; }
  return 'Inner Beast';
};

// eslint-disable-next-line no-unused-vars
const warNextGCD = () => {
  const loop = true;

  const { level } = currentPlayer;
  const { targetCount } = currentPlayer;

  // const { combat } = loopPlayer;
  const { comboAction } = loopPlayer;
  const { gcd } = loopPlayer;

  const { beast } = loopPlayer;

  const berserkDuration = getStatusDuration({ statusName: 'Berserk', loop });
  const nascentChaosDuration = getStatusDuration({ statusName: 'Nascent Chaos', loop });
  const primalRendReadyDuration = getStatusDuration({ statusName: 'Primal Rend Ready', loop });
  const innerReleaseDuration = getStatusDuration({ statusName: 'Inner Release', loop });
  const surgingTempestDuration = getStatusDuration({ statusName: 'Surging Tempest', loop });
  const infuriateRecast = getRecast({ actionName: 'Infuriate', loop });

  if (primalRendReadyDuration > 0 && primalRendReadyDuration < gcd) { return 'Primal Rend'; }

  if (level >= 35) {
    if (beast >= 100
    || innerReleaseDuration > 0
    || (nascentChaosDuration > 0 && nascentChaosDuration <= gcd && beast >= 50)
    || (infuriateRecast < gcd && beast >= 50)
    || (berserkDuration > 0 && beast >= 50)
    || (comboAction === 'Maim' && surgingTempestDuration > 30 && beast > 80)
    || (comboAction === 'Maim' && beast > 90)
    || (comboAction === 'Heavy Swing' && beast > 90)) {
      // All conditions that require immediate usage of Beast Gauge
      return warSpender();
    }
  }

  if (surgingTempestDuration > 20 || level < 50) {
    if (primalRendReadyDuration) { return 'Primal Rend'; }
    if (level >= 70 && beast >= 50) { return warSpender(); }
  }

  // Continue combos
  if (level >= 50 && comboAction === 'Maim' && surgingTempestDuration <= 30) { return 'Storm\'s Eye'; }
  if (level >= 40 && comboAction === 'Overpower') { return 'Mythril Tempest'; }
  if (level >= 26 && comboAction === 'Maim') { return 'Storm\'s Path'; }
  if (level >= 4 && comboAction === 'Heavy Swing') { return 'Maim'; }

  // Start combos
  if (level >= 10 && targetCount >= 3) { return 'Overpower'; }
  return 'Heavy Swing';
};

// eslint-disable-next-line no-unused-vars
const warNextOGCD = ({ weaveCount } = {}) => {
  if (weaveCount > 1) { return ''; } // Lazy
  if (!loopPlayer.combat) { return ''; } // So lazy

  const loop = true;

  const { level } = currentPlayer;
  const { targetCount } = currentPlayer;

  // const { gcd } = loopPlayer;
  const { beast } = loopPlayer;

  const berserkDuration = getStatusDuration({ statusName: 'Berserk', loop });
  const innerReleaseDuration = getStatusDuration({ statusName: 'Inner Release', loop });
  const nascentChaosDuration = getStatusDuration({ statusName: 'Nascent Chaos', loop });
  const surgingTempestDuration = getStatusDuration({ statusName: 'Surging Tempest', loop });

  const berserkRecast = getRecast({ actionName: 'Berserk', loop });
  const infuriateRecast = getRecast({ actionName: 'Infuriate', loop });
  const onslaughtRecast = getRecast({ actionName: 'Onslaught', loop });
  const upheavalRecast = getRecast({ actionName: 'Upheaval', loop });

  if (surgingTempestDuration > 0 || level < 50) {
    if (level >= 6 && berserkRecast === 0) {
      if (level >= 70 && nascentChaosDuration === 0) { return 'Inner Release'; }
      if (level < 70) { return 'Berserk'; }
    }
  }

  if (level >= 50
  && beast <= 50
  && (infuriateRecast === 0 || (level >= 66 && infuriateRecast === 5000))
  && innerReleaseDuration === 0
  && nascentChaosDuration === 0) {
    // Quickly use first stack of Infuriate
    return 'Infuriate';
  }

  if (surgingTempestDuration > 0) { // Level >= 50 for all of these skills
    if (level >= 64 && upheavalRecast === 0) {
      if (level >= 86 && targetCount >= 3) { return 'Orogeny'; }
      return 'Upheaval';
    }

    if (level >= 88 && onslaughtRecast <= 30) { return 'Onslaught'; }
    if (level >= 62 && onslaughtRecast === 0) { return 'Onslaught'; }

    if (level >= 50
    && beast <= 50
    && infuriateRecast <= 60
    && innerReleaseDuration === 0
    && nascentChaosDuration === 0) {
      if (level >= 70) { return 'Infuriate'; }
      if (berserkDuration > 0) { return 'Infuriate'; } // Use Infuriate during Berserk when level < 70
    }
  }

  return '';
};
