// eslint-disable-next-line no-unused-vars
const drgTraits = () => {
  const { level } = currentPlayer;

  if (level >= 74) { // High Jump
    const i = actionData.findIndex((e) => e.name === 'Jump');
    actionData.splice(i, 1);
  }

  if (level >= 74) { // Enlightenment
    const i = actionData.findIndex((e) => e.name === 'Howling Fist');
    actionData.splice(i, 1);
  }

  if (level >= 82) { // Shadow of the Destroyer
    const i = actionData.findIndex((e) => e.name === 'Arm of the Destroyer');
    actionData.splice(i, 1);
  }

  if (level >= 86) { // Rising Phoenix
    const i = actionData.findIndex((e) => e.name === 'Flint Strike');
    actionData.splice(i, 1);
  }

  if (level >= 90) { // Phantom Rush
    const i = actionData.findIndex((e) => e.name === 'Tornado Kick');
    actionData.splice(i, 1);
  }
};

// eslint-disable-next-line no-unused-vars
const mnkPlayerChanged = (e) => {
  currentPlayer.chakra = e.detail.jobDetail.chakraStacks;
  currentPlayer.beastChakra = e.detail.jobDetail.beastChakra; // Array
  currentPlayer.lunarNadi = e.detail.jobDetail.lunarNadi;
  currentPlayer.solarNadi = e.detail.jobDetail.solarNadi;
};

// eslint-disable-next-line no-unused-vars
const mnkTargetChanged = () => {
  startLoop();
};

// eslint-disable-next-line no-unused-vars
const mnkActionMatch = ({
  // logType, // Currently unused parameters commented out
  actionName,
  targetID = currentTarget.id,
  loop,
} = {}) => {
  const { level } = currentPlayer;

  let player = currentPlayer;
  if (loop) { player = loopPlayer; }

  const perfectBalanceDuration = getStatusDuration({ statusName: 'Perfect Balance', loop });

  switch (actionName) { // Probable target count
    case 'Bootshine':
      if (level >= 26) { player.targetCount = 1; } break;
    case 'True Strike':
    case 'Twin Snakes':
      if (level >= 45) { player.targetCount = 1; } break;
    case 'Snap Punch':
      if (level >= 30) { player.targetCount = 1; } break;
    case 'Steel Peak': case 'The Forbidden Chakra':
      if (level >= 40) { player.targetCount = 1; } break;
    case 'Arm of the Destroyer': case 'Shadow of the Destroyer':
    case 'Rockbreaker':
    case 'Howling Fist': case 'Enlightenment':
    case 'Four-point Fury':
      player.targetCount = 3; break;
    default:
  }

  // Combat toggle
  switch (actionName) {
    case 'Meditation':
    case 'Form Shift':
      break;
    default:
      player.combat = true;
  }

  // Chakra
  if (loop) {
    switch (actionName) {
      case 'Meditation':
        if (player.combat === true) {
          player.chakra = Math.min(player.chakra + 1, 5);
        } else {
          player.chakra = 5;
        }
        break;
      case 'Steel Peak':
      case 'Howling Fist':
      case 'The Forbidden Chakra':
      case 'Enlightenment':
        player.chakra = 0;
        break;
      default:
    }

    // console.log(player.chakra);

    // Beast Chakra and Nadi spenders
    switch (actionName) {
      case 'Elixir Field':
        player.beastChakra = [];
        player.lunarNadi = true;
        break;
      case 'Flint Strike': case 'Rising Phoenix':
        player.beastChakra = [];
        player.solarNadi = true;
        break;
      case 'Celestial Revolution':
        player.beastChakra = [];
        if (player.lunarNadi === true) {
          player.solarNadi = true;
        } else {
          player.lunarNadi = true;
        }
        break;
      case 'Tornado Kick': case 'Phantom Rush':
        player.beastChakra = [];
        player.lunarNadi = false;
        player.solarNadi = false;
        break;
      default:
    }

    if (getStatusDuration({ statusName: 'Perfect Balance', loop }) > 0) {
      switch (actionName) {
        case 'Bootshine': case 'Dragon Kick': case 'Arm of the Destroyer': case 'Shadow of the Destroyer':
          if (level >= 60) { player.beastChakra.push('Opo'); }
          break;
        case 'True Strike': case 'Twin Snakes': case 'Four-point Fury':
          if (level >= 60) { player.beastChakra.push('Raptor'); }
          break;
        case 'Demolish': case 'Snap Punch': case 'Rockbreaker':
          if (level >= 60) { player.beastChakra.push('Coeurl'); }
          break;
        default:
      }
    }
  }

  // Form and Perfect Balance
  switch (actionName) {
    case 'Bootshine': case 'Dragon Kick': case 'Arm of the Destroyer': case 'Shadow of the Destroyer':
      if (getStatusDuration({ statusName: 'Perfect Balance', loop }) > 0) {
        removeStatusStacks({ statusName: 'Perfect Balance', loop });
        if (getStatusDuration({ statusName: 'Perfect Balance', loop }) === 0) {
          removeStatus({ statusName: 'Opo-opo Form', loop });
          removeStatus({ statusName: 'Raptor Form', loop });
          removeStatus({ statusName: 'Coeurl Form', loop });
          removeStatus({ statusName: 'Formless Fist', loop });
        }
      } else {
        addStatus({ statusName: 'Raptor Form', loop });
        removeStatus({ statusName: 'Opo-opo Form', loop });
        removeStatus({ statusName: 'Coeurl Form', loop });
        removeStatus({ statusName: 'Formless Fist', loop });
      }
      break;
    case 'True Strike': case 'Twin Snakes': case 'Four-point Fury':
      if (getStatusDuration({ statusName: 'Perfect Balance', loop }) > 0) {
        removeStatusStacks({ statusName: 'Perfect Balance', loop });
        if (getStatusDuration({ statusName: 'Perfect Balance', loop }) === 0) {
          removeStatus({ statusName: 'Opo-opo Form', loop });
          removeStatus({ statusName: 'Raptor Form', loop });
          removeStatus({ statusName: 'Coeurl Form', loop });
          removeStatus({ statusName: 'Formless Fist', loop });
        }
      } else {
        addStatus({ statusName: 'Coeurl Form', loop });
        removeStatus({ statusName: 'Opo-opo Form', loop });
        removeStatus({ statusName: 'Raptor Form', loop });
        removeStatus({ statusName: 'Formless Fist', loop });
      }
      break;
    case 'Demolish': case 'Snap Punch': case 'Rockbreaker':
      if (getStatusDuration({ statusName: 'Perfect Balance', loop }) > 0) {
        removeStatusStacks({ statusName: 'Perfect Balance', loop });
        if (getStatusDuration({ statusName: 'Perfect Balance', loop }) === 0) {
          removeStatus({ statusName: 'Opo-opo Form', loop });
          removeStatus({ statusName: 'Raptor Form', loop });
          removeStatus({ statusName: 'Coeurl Form', loop });
          removeStatus({ statusName: 'Formless Fist', loop });
        }
      } else {
        addStatus({ statusName: 'Opo-opo Form', loop });
        removeStatus({ statusName: 'Raptor Form', loop });
        removeStatus({ statusName: 'Coeurl Form', loop });
        removeStatus({ statusName: 'Formless Fist', loop });
      }
      break;
    case 'Form Shift':
      if (perfectBalanceDuration === 0) {
        addStatus({ statusName: 'Formless Fist', loop });
        removeStatus({ statusName: 'Opo-opo Form', loop });
        removeStatus({ statusName: 'Raptor Form', loop });
        removeStatus({ statusName: 'Coeurl Form', loop });
      }
      break;
    case 'Elixir Field':
    case 'Flint Strike': case 'Rising Phoenix':
    case 'Celestial Revolution':
    case 'Tornado Kick': case 'Phantom Rush':
      addStatus({ statusName: 'Formless Fist', loop });
      removeStatus({ statusName: 'Opo-opo Form', loop });
      removeStatus({ statusName: 'Raptor Form', loop });
      removeStatus({ statusName: 'Coeurl Form', loop });
      removeStatus({ statusName: 'Perfect Balance', loop });
      break;
    case 'Perfect Balance':
      addStatus({ statusName: 'Perfect Balance', loop });
      removeStatus({ statusName: 'Opo-opo Form', loop });
      removeStatus({ statusName: 'Raptor Form', loop });
      removeStatus({ statusName: 'Coeurl Form', loop });
      removeStatus({ statusName: 'Formless Fist', loop });
      break;
    default:
  }
  // Other status effects
  switch (actionName) {
    case 'Bootshine':
      removeStatus({ statusName: 'Leaden Fist', loop });
      break;
    case 'Twin Snakes':
    case 'Four-point Fury':
      addStatus({ statusName: 'Disciplined Fist', loop });
      break;
    case 'Demolish':
      addStatus({ statusName: actionName, targetID, loop });
      break;
    case 'Dragon Kick':
      addStatus({ statusName: 'Leaden Fist', loop });
      break;
      // case 'Thunderclap':
      //   addActionRecast({ actionName, loop });
      //   break;
    case 'Mantra':
    case 'Perfect Balance':
    case 'Riddle of Fire':
    case 'Brotherhood':
    case 'Riddle of Wind':
      addStatus({ statusName: actionName, loop });
      break;
    default:
  }

  // Recast
  switch (actionName) {
    case 'Mantra':
    case 'Perfect Balance':
    case 'Riddle of Fire':
    case 'Brotherhood':
    case 'Riddle of Wind':
      addActionRecast({ actionName, loop });
      break;
    default:
  }

  // Start loop
  if (!loop) {
    switch (actionName) {
      case 'Bootshine':
      case 'Arm of the Destroyer': case 'Shadow of the Destroyer':
      case 'True Strike':
      case 'Snap Punch':
      case 'Twin Snakes':
      case 'Demolish':
      case 'Rockbreaker':
      case 'Four-point Fury':
      case 'Dragon Kick':
      case 'Form Shift':
      case 'Elixir Field':
      case 'Flint Strike': case 'Rising Phoenix':
      case 'Celestial Revolution':
      case 'Tornado Kick': case 'Phantom Rush':
        startLoop({ delay: player.gcd });
        break;
      case 'Six-sided Star':
        startLoop({ delay: player.gcd * 2 });
        break;
      case 'Meditation':
        startLoop({ delay: 0 });
        break;
      default:
    }
  }
};

// Doesn't seem needed right now?
// const ninStatusMatch = ({ logType, statusName, sourceID }) => {
// };

// eslint-disable-next-line no-unused-vars
const mnkNextGCD = () => {
  const loop = true;

  const { level } = currentPlayer;
  const { targetCount } = currentPlayer;

  const { beastChakra } = loopPlayer;
  const { chakra } = loopPlayer;
  const { combat } = loopPlayer;
  const { gcd } = loopPlayer;
  const { lunarNadi } = loopPlayer;
  const { solarNadi } = loopPlayer;

  const beastChakraSet = new Set(beastChakra);

  const opoDuration = getStatusDuration({ statusName: 'Opo-opo Form', loop });
  const raptorDuration = getStatusDuration({ statusName: 'Raptor Form', loop });
  const coeurlDuration = getStatusDuration({ statusName: 'Coeurl Form', loop });

  const formlessFistDuration = getStatusDuration({ statusName: 'Formless Fist', loop });

  const perfectBalanceDuration = getStatusDuration({ statusName: 'Perfect Balance', loop });
  const perfectBalanceStacks = getStatusStacks({ statusName: 'Perfect Balance', loop });

  const demolishDuration = getStatusDuration({ statusName: 'Demolish', targetID: currentTarget.id, loop });
  const disciplinedFistDuration = getStatusDuration({ statusName: 'Disciplined Fist', loop });
  const leadenFistDuration = getStatusDuration({ statusName: 'Leaden Fist', loop });
  const riddleFireDuration = getStatusDuration({ statusName: 'Riddle of Fire', loop });

  const perfectBalanceRecast = getRecast({ actionName: 'Perfect Balance', loop });
  const riddleFireRecast = getRecast({ actionName: 'Riddle of Fire', loop });

  if (beastChakra.length === 3) {
    if (solarNadi && lunarNadi) {
      if (level >= 90) { return 'Phantom Rush'; }
      return 'Tornado Kick';
    }
    if (beastChakraSet.size === 1) { return 'Elixir Field'; }
    if (beastChakraSet.size === 2) { return 'Celestial Revolution'; }
    if (beastChakraSet.size === 3) {
      if (level >= 86) { return 'Rising Phoenix'; }
      return 'Flint Strike';
    }
  }

  if (perfectBalanceDuration > 0) { // Implies level >= 50
    if (level >= 60) {
      if (!lunarNadi) { // Opo spam for Lunar
        if (targetCount > 2) {
          if (level >= 82) { return 'Shadow of the Destroyer'; }
          return 'Rockbreaker'; // Stronger AoE before Shadow
        }
        if (leadenFistDuration > 0) { return 'Bootshine'; }
        return 'Dragon Kick';
      }

      if (!solarNadi) { // Some sort of priority for Solar
        if (targetCount > 2) {
          if (!beastChakra.includes('Opo')) {
            if (level >= 82) { return 'Shadow of the Destroyer'; }
            return 'Arm of the Destroyer';
          }
          if (!beastChakra.includes('Raptor')) { return 'Four-point Fury'; }
          if (!beastChakra.includes('Coeurl')) { return 'Rockbreaker'; }
        }

        if (!beastChakra.includes('Opo')) {
          if (leadenFistDuration > 0) { return 'Bootshine'; }
          return 'Dragon Kick';
        }

        if (!beastChakra.includes('Raptor')) {
          if (riddleFireDuration > gcd * (perfectBalanceStacks + 5) && perfectBalanceRecast < gcd * (perfectBalanceStacks + 2) + 41) { return 'Twin Snakes'; } // Refresh PB during PB spam
          if (disciplinedFistDuration < gcd * (perfectBalanceStacks + 3)) { return 'Twin Snakes'; } // Avoid dropping DF before next Raptor GCD
          return 'True Strike';
        }

        if (!beastChakra.includes('Coeurl')) {
          if (demolishDuration < gcd) { return 'Demolish'; }
          return 'Snap Punch';
        }
      }
    }

    // General PB stuff

    if ((riddleFireDuration > gcd * (perfectBalanceStacks + 5)
    && perfectBalanceRecast < gcd * (perfectBalanceStacks + 1) + 41) // Will follow with another PB
    // Twin > Opo > Opo > Finisher > Opo (PB) > Opo > Opo > Opo > Finisher > Opo > Twin?
    || (level >= 60 && disciplinedFistDuration < gcd * (perfectBalanceStacks + 2))
    // Twin > Opo > Opo > Finisher > Opo > Twin?
    || (level < 60 && disciplinedFistDuration < gcd * (perfectBalanceStacks + 1))) {
    // Twin > Opo > Opo > Opo > Twin?
      if (targetCount > 2) { return 'Four-point Fury'; }
      return 'Twin Snakes';
    }

    if (targetCount > 2) {
      if (level >= 82) { return 'Shadow of the Destroyer'; }
      return 'Rockbreaker';
    }

    if (demolishDuration < gcd) { return 'Demolish'; }
    if (leadenFistDuration > 0) { return 'Bootshine'; }
    return 'Dragon Kick';
  }

  if (!combat && chakra < 5) { return 'Meditation'; }
  if (!combat && formlessFistDuration === 0 && opoDuration === 0) { return 'Form Shift'; }

  if (formlessFistDuration > 0) { // Implies level >= 52
    if (targetCount > 2) {
      if (level >= 82) { return 'Shadow of the Destroyer'; }
      if (level >= 26) { return 'Arm of the Destroyer'; }
    }
    if (leadenFistDuration > 0) { return 'Bootshine'; }
    return 'Dragon Kick';
  }

  // Opo-opo form
  if (opoDuration > 0) {
    if (targetCount > 2) {
      if (level >= 82) { return 'Shadow of the Destroyer'; }
      if (level >= 26) { return 'Arm of the Destroyer'; }
    }
    if (leadenFistDuration > 0) { return 'Bootshine'; }
    if (level >= 50 && leadenFistDuration === 0) { return 'Dragon Kick'; }
    return 'Bootshine';
  }

  // Raptor form
  if (raptorDuration > 0) {
    if (level >= 45 && targetCount > 2) { return 'Four-point Fury'; }
    if (level >= 60 && solarNadi) { // Refresh Twin Snakes before PB Lunar
      if (riddleFireRecast < gcd + 1 && perfectBalanceRecast < gcd * 2 + 41) { return 'Twin Snakes'; }
      // Twin > Coeurl > Opo (PB) > Opo > Opo > Opo > Finisher (RoF expires)
      if (riddleFireDuration > gcd * 6 && perfectBalanceRecast < gcd * 2 + 41) { return 'Twin Snakes'; }
      // Twin > Coeurl (RoF) > Opo (PB) > Opo > Opo > Opo > Finisher
      if (perfectBalanceRecast < gcd * 2 + 1) { return 'Twin Snakes'; }
      // Twin > Coeurl > Opo (PB)
    }
    if (level >= 18 && disciplinedFistDuration < gcd * 3) { return 'Twin Snakes'; }
    // Twin > Coeurl > Opo > True
    return 'True Strike';
    // True > Coeurl > Opo > Twin (probably)
  }

  // Coeurl form
  if (coeurlDuration > 0) {
    if (level >= 30 && targetCount > 2) {
      return 'Rockbreaker';
    }
    if (level >= 30 && demolishDuration < gcd) { return 'Demolish'; }
    return 'Snap Punch';
  }

  // No stance
  if (targetCount > 2) {
    if (level >= 82) { return 'Shadow of the Destroyer'; }
    if (level >= 26) { return 'Arm of the Destroyer'; }
  }
  if (level >= 50) { return 'Dragon Kick'; }
  return 'Bootshine';
};

// eslint-disable-next-line no-unused-vars
const mnkNextOGCD = ({
  weaveCount,
} = {}) => {
  // if (weaveCount > 1) { return ''; } // No double weaving on MNK because lazy
  if (!loopPlayer.combat) { return ''; }

  const loop = true;
  const { level } = currentPlayer;
  // const { targetCount } = currentPlayer;
  // const { chakra } = loopPlayer;
  const { gcd } = loopPlayer;

  const raptorFormDuration = getStatusDuration({ statusName: 'Raptor Form', loop });
  const perfectBalanceDuration = getStatusDuration({ statusName: 'Perfect Balance', loop });
  const riddleFireDuration = getStatusDuration({ statusName: 'Riddle of Fire', loop });
  const perfectBalanceRecast = getRecast({ actionName: 'Perfect Balance', loop });

  if (weaveCount > 1 && getRecast({ actionName: 'Riddle of Fire', loop }) < 1) { return 'Riddle of Fire'; }

  // Chakra is RNG-based so no reason to include it... probably.
  // if (chakra >= 5) {
  //   if (targetCount > 2) {
  //     if (level >= 74) { return 'Enlightenment'; }
  //     if (level >= 40) { return 'Howling Fist'; }
  //   }

  //   if (level >= 54) { return 'The Forbidden Chakra'; }
  //   return 'Steel Peak';
  // }

  if (weaveCount === 1) {
    if (riddleFireDuration > 0) { // Implies level >= 68
      if (level >= 70 && getRecast({ actionName: 'Brotherhood', loop }) < 1) { return 'Brotherhood'; }
      // There was probably supposed to be more here, but whatever
    }

    if (level >= 50 && perfectBalanceDuration === 0 && raptorFormDuration > 0) {
      if (level >= 68 && riddleFireDuration > gcd * 4 && perfectBalanceRecast < 41) { return 'Perfect Balance'; } // Second charge before RoF
      // (PB) > Opo > Opo > Opo > Finisher (RoF ends)
      if (level >= 68 && perfectBalanceRecast < gcd * 5) { return 'Perfect Balance'; } // PB will be available after this PB ends
      // (PB) > Opo > Opo > Opo > Finisher > Opo (PB available)
      if (level < 68 && perfectBalanceRecast < 41) { return 'Perfect Balance'; } // Allow PB spam before RoF is available
    }

    if (level >= 72 && getRecast({ actionName: 'Riddle of Wind', loop }) < 1) { return 'Riddle of Wind'; }
  }

  return '';
};
