// eslint-disable-next-line no-unused-vars
const mnkJobChanged = (e) => {
  const { level } = currentPlayer;

  if (level >= 76) {
    currentPlayer.gcd = calculateRecast({ modifier: 0.8 });
  } else if (level >= 40) {
    currentPlayer.gcd = calculateRecast({ modifier: 0.85 });
  } else if (level >= 20) {
    currentPlayer.gcd = calculateRecast({ modifier: 0.9 });
  } else {
    currentPlayer.gcd = calculateRecast({ modifier: 0.95 });
  }

  if (level >= 54) { // The Forbidden Chakra
    const i = actionData.findIndex((a) => a.name === 'Steel Peak');
    actionData.splice(i, 1);
  }

  if (level >= 74) { // Enlightenment
    const i = actionData.findIndex((a) => a.name === 'Howling Fist');
    actionData.splice(i, 1);
  }

  if (level >= 82) { // Shadow of the Destroyer
    const i = actionData.findIndex((a) => a.name === 'Arm of the Destroyer');
    actionData.splice(i, 1);
  }

  if (level >= 86) { // Rising Phoenix
    const i = actionData.findIndex((a) => a.name === 'Flint Strike');
    actionData.splice(i, 1);
  }

  if (level >= 90) { // Phantom Rush
    const i = actionData.findIndex((a) => a.name === 'Tornado Kick');
    actionData.splice(i, 1);
  }

  currentPlayer.chakra = e.detail.jobDetail.chakraStacks;
  currentPlayer.beastChakraArray = e.detail.jobDetail.beastChakra;
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
  // targetID = currentTarget.id,
  loop,
} = {}) => {
  // if (!loop) { console.log(currentPlayer.beastChakra); }
  const { level } = currentPlayer;

  let player = currentPlayer;
  if (loop) { player = loopPlayer; }

  const perfectBalanceDuration = getStatusDuration({ statusName: 'Perfect Balance', loop });
  // const perfectBalanceStacks = getStatusStacks({ statusName: 'Perfect Balance', loop });

  // Recast
  switch (actionName) {
    case 'Mantra': case 'Perfect Balance': case 'Riddle of Fire': case 'Brotherhood': case 'Riddle of Wind':
      addActionRecast({ actionName, loop }); break;
    default:
  }

  // General status effects
  // This has to come first because a lot of them depend on a stance removed or replaced below
  switch (actionName) {
    case 'Bootshine':
      removeStatus({ statusName: 'Leaden Fist', loop }); break;
    case 'Twin Snakes': case 'Four-point Fury':
      addStatus({ statusName: 'Disciplined Fist', loop }); break;
    case 'Demolish': addStatus({ statusName: actionName, targetID: currentTarget.id, loop }); break;
    case 'Dragon Kick':
      if (getStatusDuration({ statusName: 'Perfect Balance', loop }) > 0
      || getStatusDuration({ statusName: 'Formless Fist', loop }) > 0
      || getStatusDuration({ statusName: 'Opo-opo Form', loop }) > 0) {
        addStatus({ statusName: 'Leaden Fist', loop });
      } break;
    case 'Mantra': case 'Riddle of Fire': case 'Brotherhood': case 'Riddle of Wind':
      addStatus({ statusName: actionName, loop }); break;
    default:
  }

  // Form statuses
  if (perfectBalanceDuration > 0) {
    switch (actionName) {
      case 'Bootshine': case 'Dragon Kick': case 'Arm of the Destroyer': case 'Shadow of the Destroyer':
      case 'True Strike': case 'Twin Snakes': case 'Four-point Fury':
      case 'Demolish': case 'Snap Punch': case 'Rockbreaker':
        removeStatusStacks({ statusName: 'Perfect Balance', loop }); break;
      default:
    }
  } else {
    switch (actionName) {
      case 'Bootshine': case 'Dragon Kick': case 'Arm of the Destroyer': case 'Shadow of the Destroyer':
        removeStatus({ statusName: 'Opo-opo Form', loop });
        removeStatus({ statusName: 'Coeurl Form', loop });
        removeStatus({ statusName: 'Formless Fist', loop });
        addStatus({ statusName: 'Raptor Form', loop }); break;
      case 'True Strike': case 'Twin Snakes': case 'Four-point Fury':
        removeStatus({ statusName: 'Raptor Form', loop });
        removeStatus({ statusName: 'Formless Fist', loop });
        addStatus({ statusName: 'Coeurl Form', loop }); break;
      case 'Demolish': case 'Snap Punch': case 'Rockbreaker':
        removeStatus({ statusName: 'Coeurl Form', loop });
        removeStatus({ statusName: 'Formless Fist', loop });
        addStatus({ statusName: 'Opo-opo Form', loop }); break;
      case 'Form Shift':
        removeStatus({ statusName: 'Opo-opo Form', loop });
        removeStatus({ statusName: 'Raptor Form', loop });
        removeStatus({ statusName: 'Coeurl Form', loop });
        addStatus({ statusName: 'Formless Fist', loop }); break;
      case 'Elixir Field': case 'Flint Strike': case 'Rising Phoenix': case 'Celestial Revolution': case 'Tornado Kick': case 'Phantom Rush':
        addStatus({ statusName: 'Formless Fist', loop }); break;
      case 'Perfect Balance':
        removeStatus({ statusName: 'Opo-opo Form', loop });
        removeStatus({ statusName: 'Raptor Form', loop });
        removeStatus({ statusName: 'Coeurl Form', loop });
        removeStatus({ statusName: 'Formless Fist', loop });
        addStatus({ statusName: 'Perfect Balance', stacks: 3, loop }); break;
      default:
    }
  }

  // Looks like all Gauge lines happen after ActionEffect

  // Chakra
  switch (actionName) {
    case 'Meditation':
      if (player.combat === true) {
        player.chakra = Math.min(player.chakra + 1, 5);
      } else {
        player.chakra = 5;
      } break;
    case 'Steel Peak': case 'Howling Fist': case 'The Forbidden Chakra': case 'Enlightenment':
      player.chakra = 0; break;
    default:
  }

  // Beast Chakra
  // Lines occur after Perfect Balance StatusEffect lines
  if (level >= 60 && perfectBalanceDuration > 0) {
    switch (actionName) {
      case 'Bootshine': case 'Dragon Kick': case 'Arm of the Destroyer': case 'Shadow of the Destroyer':
        player.beastChakraArray.push('Opo'); break;
      case 'True Strike': case 'Twin Snakes': case 'Four-point Fury':
        player.beastChakraArray.push('Raptor'); break;
      case 'Demolish': case 'Snap Punch': case 'Rockbreaker':
        player.beastChakraArray.push('Coeurl'); break;
      default:
    }
  }

  // Beast Chakra and Nadi spenders
  switch (actionName) {
    case 'Elixir Field': case 'Flint Strike': case 'Rising Phoenix': case 'Celestial Revolution': case 'Tornado Kick': case 'Phantom Rush':
      player.beastChakraArray = []; break;
    default:
  }

  switch (actionName) {
    case 'Elixir Field': player.lunarNadi = true; break;
    case 'Flint Strike': case 'Rising Phoenix':
      player.solarNadi = true; break;
    case 'Celestial Revolution':
      if (player.lunarNadi === true) {
        player.solarNadi = true;
      } else {
        player.lunarNadi = true;
      } break;
    case 'Tornado Kick': case 'Phantom Rush':
      player.lunarNadi = false;
      player.solarNadi = false; break;
    default:
  }

  // Combat toggle
  switch (actionName) {
    case 'Meditation': case 'Form Shift':
      break;
    default:
      player.combat = true;
  }
  switch (actionName) { // Probable target count
    case 'Bootshine': case 'Dragon Kick':
      if (level >= 26) { player.targetCount = 1; } break;
    case 'True Strike': case 'Twin Snakes':
      if (level >= 45) { player.targetCount = 1; } break;
    case 'Snap Punch': case 'Demolish':
      if (level >= 30) { player.targetCount = 1; } break;
    // case 'Steel Peak': case 'The Forbidden Chakra':
    //   if (level >= 40) { player.targetCount = 1; } break;
    case 'Arm of the Destroyer': case 'Shadow of the Destroyer':
    case 'Four-point Fury':
    case 'Rockbreaker':
    // case 'Howling Fist': case 'Enlightenment':
      player.targetCount = 3; break;
    default:
  }

  // Start loop
  if (!loop) {
    switch (actionName) {
      case 'Bootshine': case 'Dragon Kick': case 'Arm of the Destroyer': case 'Shadow of the Destroyer':
      case 'True Strike': case 'Twin Snakes': case 'Four-point Fury':
      case 'Snap Punch': case 'Demolish': case 'Rockbreaker':
      case 'Form Shift':
      case 'Elixir Field': case 'Flint Strike': case 'Rising Phoenix': case 'Celestial Revolution': case 'Tornado Kick': case 'Phantom Rush':
        startLoop({ delay: player.gcd }); break;
      case 'Six-sided Star': startLoop({ delay: player.gcd * 2 }); break;
      case 'Meditation': startLoop({ delay: 0 }); break;
      default:
    }
  }
};

// Doesn't seem needed right now?
// const mnkStatusMatch = ({ logType, statusName, sourceID }) => {
// };

// eslint-disable-next-line no-unused-vars
const mnkGaugeMatch = ({
  gaugeHex,
} = {}) => {
  currentPlayer.chakra = parseInt(gaugeHex[0].substring(4, 6), 16);

  switch (gaugeHex[0].substring(2, 4)) {
    case '00': delete currentPlayer.beastChakra1; break;
    case '01': currentPlayer.beastChakra1 = 'Coeurl'; break;
    case '02': currentPlayer.beastChakra1 = 'Opo'; break;
    case '03': currentPlayer.beastChakra1 = 'Raptor'; break;
    default:
  }

  switch (gaugeHex[0].substring(0, 2)) {
    case '00': delete currentPlayer.beastChakra2; break;
    case '01': currentPlayer.beastChakra2 = 'Coeurl'; break;
    case '02': currentPlayer.beastChakra2 = 'Opo'; break;
    case '03': currentPlayer.beastChakra2 = 'Raptor'; break;
    default:
  }

  switch (gaugeHex[1].substring(6)) {
    case '00': delete currentPlayer.beastChakra3; break;
    case '01': currentPlayer.beastChakra3 = 'Coeurl'; break;
    case '02': currentPlayer.beastChakra3 = 'Opo'; break;
    case '03': currentPlayer.beastChakra3 = 'Raptor'; break;
    default:
  }

  switch (gaugeHex[1].substring(4, 6)) {
    case '00':
      currentPlayer.lunarNadi = false;
      currentPlayer.solarNadi = false; break;
    case '02':
      currentPlayer.lunarNadi = true;
      currentPlayer.solarNadi = false; break;
    case '04':
      currentPlayer.lunarNadi = false;
      currentPlayer.solarNadi = true; break;
    case '06':
      currentPlayer.lunarNadi = true;
      currentPlayer.solarNadi = true; break;
    default:
  }

  currentPlayer.beastChakraArray = [
    currentPlayer.beastChakra1,
    currentPlayer.beastChakra2,
    currentPlayer.beastChakra3,
  ].filter((e) => e !== undefined);

  // console.log(`Chakra: ${currentPlayer.chakra}
  // | Beast Chakra: ${currentPlayer.beastChakraArray}`);
};

// eslint-disable-next-line no-unused-vars
const mnkNextGCD = () => {
  const loop = true;

  const { level } = currentPlayer;
  const { targetCount } = currentPlayer;

  const { beastChakraArray } = loopPlayer;
  const { chakra } = loopPlayer;
  const { combat } = loopPlayer;
  const { gcd } = loopPlayer;
  const { lunarNadi } = loopPlayer;
  const { solarNadi } = loopPlayer;

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
  // const riddleFireRecast = getRecast({ actionName: 'Riddle of Fire', loop });

  const beastChakraSet = new Set(beastChakraArray);

  if (beastChakraArray.length === 3) {
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
      if (!lunarNadi
      && (beastChakraArray.length === 0 || beastChakraSet.size === 1)) { // Opo spam for Lunar
        if (targetCount > 2) {
          if (level >= 82) { return 'Shadow of the Destroyer'; }
          return 'Rockbreaker'; // Stronger AoE before Shadow
        }
        if (leadenFistDuration > 0) { return 'Bootshine'; }
        return 'Dragon Kick';
      }

      if (!solarNadi) { // Some sort of priority for Solar
        if (targetCount > 2) {
          if (!beastChakraArray.includes('Opo')) {
            if (level >= 82) { return 'Shadow of the Destroyer'; }
            return 'Arm of the Destroyer';
          }
          if (!beastChakraArray.includes('Raptor')) { return 'Four-point Fury'; }
          if (!beastChakraArray.includes('Coeurl')) { return 'Rockbreaker'; }
        }

        if (!beastChakraArray.includes('Opo')) {
          if (leadenFistDuration > 0) { return 'Bootshine'; }
          return 'Dragon Kick';
        }

        if (!beastChakraArray.includes('Raptor')) {
          if (riddleFireDuration > gcd * (perfectBalanceStacks + 5) && perfectBalanceRecast <= gcd * (perfectBalanceStacks + 2) + 40) { return 'Twin Snakes'; } // Refresh PB during PB spam
          if (disciplinedFistDuration < gcd * (perfectBalanceStacks + 3)) { return 'Twin Snakes'; } // Avoid dropping DF before next Raptor GCD
          return 'True Strike';
        }

        if (!beastChakraArray.includes('Coeurl')) {
          if (demolishDuration < gcd) { return 'Demolish'; }
          return 'Snap Punch';
        }
      }
    }

    // General PB stuff
    // Priority should also drop here for Tornado Kick/Phantom Rush and Celestial Revolution mishaps

    if (disciplinedFistDuration < gcd) {
      if (targetCount > 2) { return 'Four-point Fury'; }
      return 'Twin Snakes';
    }

    if (level >= 60 && perfectBalanceStacks === 1 && disciplinedFistDuration < gcd * 4) {
      if (targetCount > 2) { return 'Four-point Fury'; }
      return 'Twin Snakes';
    }

    if (level < 60 && perfectBalanceStacks === 1 && disciplinedFistDuration < gcd * 3) {
      if (targetCount > 2) { return 'Four-point Fury'; }
      return 'Twin Snakes';
    }

    if (riddleFireDuration > gcd * 6 && perfectBalanceStacks === 1
    && perfectBalanceRecast - gcd * 2 <= 40 && disciplinedFistDuration < gcd * 6) {
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
    if (level >= 60 && !lunarNadi) { // Refresh DF before likely Lunar Nadi
      // Refresh before Lunar during ROF
      // Twin, Coeurl, Opo (PB), etc.
      if (riddleFireDuration > gcd * 6 && perfectBalanceRecast - gcd * 2 <= 40) { return 'Twin Snakes'; }

      // Refresh before Lunar to keep PB charging, Solar next
      // Twin, Coeurl, Opo (PB), Opo, Opo, Opo, Blitz, Opo (PB 2 stacks), etc.
      if (level >= 68 && perfectBalanceRecast - gcd * 7 === 0) { return 'Twin Snakes'; }

      // Refresh before Lunar for PB spam (pre-ROF)
      if (level < 68 && perfectBalanceRecast - gcd * 2 <= 40) { return 'Twin Snakes'; } // Refresh DF before Lunar PB
    }
    if (level >= 18 && disciplinedFistDuration < gcd * 3) { return 'Twin Snakes'; } // Keep DF up
    return 'True Strike';
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
  if (weaveCount > 1) { return ''; } // No double weaving on MNK because lazy
  if (!loopPlayer.combat) { return ''; }

  const loop = true;
  const { level } = currentPlayer;
  // const { targetCount } = currentPlayer;
  // const { chakra } = loopPlayer;
  const { gcd } = loopPlayer;
  // const { beastChakra1 } = loopPlayer;
  const { lunarNadi } = loopPlayer;

  const raptorFormDuration = getStatusDuration({ statusName: 'Raptor Form', loop });
  const perfectBalanceDuration = getStatusDuration({ statusName: 'Perfect Balance', loop });
  const riddleFireDuration = getStatusDuration({ statusName: 'Riddle of Fire', loop });
  const perfectBalanceRecast = getRecast({ actionName: 'Perfect Balance', loop });
  const disciplinedFistDuration = getStatusDuration({ statusName: 'Disciplined Fist', loop });

  if (getRecast({ actionName: 'Riddle of Fire', loop }) === 0) { return 'Riddle of Fire'; }

  // Chakra is RNG-based so no reason to include it... probably.
  // if (chakra >= 5) {
  //   if (targetCount > 2) {
  //     if (level >= 74) { return 'Enlightenment'; }
  //     if (level >= 40) { return 'Howling Fist'; }
  //   }

  //   if (level >= 54) { return 'The Forbidden Chakra'; }
  //   return 'Steel Peak';
  // }

  if (riddleFireDuration > 0) { // Implies level >= 68
    if (level >= 70 && getRecast({ actionName: 'Brotherhood', loop }) === 0) { return 'Brotherhood'; }
    // There was probably supposed to be more here, but whatever
  }

  if (level >= 50 && perfectBalanceDuration === 0 && raptorFormDuration > 0) {
    if (riddleFireDuration > gcd * 4 && perfectBalanceRecast <= 40) {
      if (disciplinedFistDuration > gcd * 4 || lunarNadi) { return 'Perfect Balance'; }
    }
    if (level >= 68 && perfectBalanceRecast <= gcd * 5) { return 'Perfect Balance'; } // PB will be available after this PB ends
    if (level < 68 && perfectBalanceRecast <= 40) { return 'Perfect Balance'; } // Allow PB spam before RoF is available
  }

  if (level >= 72 && getRecast({ actionName: 'Riddle of Wind', loop }) === 0) { return 'Riddle of Wind'; }

  return '';
};
