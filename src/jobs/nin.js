// eslint-disable-next-line no-unused-vars
const ninTraits = () => {
  const { level } = currentPlayer;

  if (level >= 56) {
    const actionDataIndex = actionData.findIndex((element) => element.name === 'Assassinate');
    actionData.splice(actionDataIndex, 1);
  }
};

// eslint-disable-next-line no-unused-vars
const ninPlayerChanged = (e) => {
  // Recalculate GCD if Huton status has apparently changed
  if (currentPlayer.huton > 0 && e.detail.jobDetail.hutonMilliseconds === 0) {
    // Huton recently fell off
    currentPlayer.gcd = calculateRecast({ modifier: 1 });
  } else if (currentPlayer.huton === 0 && e.detail.jobDetail.hutonMilliseconds > 0) {
    // Huton recently applied
    currentPlayer.gcd = calculateRecast({ modifier: 0.85 });
  }

  // Standard stuff otherwise
  currentPlayer.hp = e.detail.currentHP;
  currentPlayer.huton = e.detail.jobDetail.hutonMilliseconds / 1000;
  currentPlayer.ninki = e.detail.jobDetail.ninkiAmount;
};

// eslint-disable-next-line no-unused-vars
const ninTargetChanged = () => {
  // Avoid starting new loop if mid-Ninjutsu
  if (Math.max(
    getStatusDuration({ statusName: 'Mudra' }),
    getStatusDuration({ statusName: 'Ten Chi Jin' }),
  ) === 0) {
    startLoop();
  }
};

// eslint-disable-next-line no-unused-vars
const ninActionMatch = ({
  // logType, // Currently unused parameters commented out
  actionName,
  // targetID,
  loop,
} = {}) => {
  // Everything removes Hide
  removeStatus({ statusName: 'Hide', loop });

  const { level } = currentPlayer;
  const actionType = getActionProperty({ actionName, property: 'type' });

  switch (actionType) {
    case 'Mudra':
      break;
    default:
      addActionRecast({ actionName, loop });
  }

  addComboAction({ actionName, loop });

  if (loop) {
    switch (actionName) {
      case 'Shade Shift':
      case 'Hide':
      case 'Ten':
      case 'Chi':
      case 'Shukuchi':
      case 'Jin':
      case 'Kassatsu':
      case 'Ten Chi Jin':
      case 'Meisui':
      case 'Bunshin':
      case 'Huton':
        break;
      default:
        loopPlayer.combat = true;
    }

    // Replaces gauge lines during loops
    switch (actionName) {
      case 'Huton':
      case 'Hurajin':
        loopPlayer.huton = 60;
        break;
      case 'Hakke Mujinsatsu':
      case 'Phantom Kamaitachi':
        loopPlayer.huton = Math.min(loopPlayer.huton + 10, 60);
        break;
      case 'Armor Break':
        loopPlayer.huton = Math.min(loopPlayer.huton + 30, 60);
        break;
      default:
    }

    switch (actionName) {
      case 'Spinning Edge':
      case 'Gust Slash':
      case 'Throwing Dagger':
      case 'Death Blossom':
      case 'Hakke Mujinsatsu':
      case 'Huraijin':
      case 'Forked Raiju':
      case 'Fleeting Raiju':
        loopPlayer.ninki = Math.min(loopPlayer.ninki + 5, 100);
        break;
      case 'Armor Crush':
      case 'Aeolian Edge':
        loopPlayer.ninki = Math.min(loopPlayer.ninki + 5, 100);
        if (level >= 78) { loopPlayer.ninki = Math.min(loopPlayer.ninki + 5, 100); }
        if (level >= 84) { loopPlayer.ninki = Math.min(loopPlayer.ninki + 5, 100); }
        break;
      case 'Mug':
        if (level >= 40) { loopPlayer.ninki = Math.min(loopPlayer.ninki + 40, 100); }
        break;
      case 'Hellfrog Medium':
      case 'Bhavacakra':
      case 'Bunshin':
        loopPlayer.ninki = Math.max(loopPlayer.ninki - 50, 0);
        break;
      case 'Meisui':
        loopPlayer.ninki = Math.min(loopPlayer.ninki + 50, 100);
        break;
      case 'Phantom Kamaitachi':
        loopPlayer.ninki = Math.min(loopPlayer.ninki + 10, 100);
        break;
      default:
    }

    // Bunshin adds another 5 ninki per weaponskill when active
    const bunshinDuration = getStatusDuration({ statusName: 'Bunshin', loop });
    if (actionType === 'Weaponskill' && bunshinDuration > 0) {
      loopPlayer.ninki = Math.min(loopPlayer.ninki + 5, 100);
    }
  }

  // Ninjutsu is so damn annoying
  switch (actionType) {
    case 'Mudra':
      if (getStatusDuration({ statusName: 'Mudra', loop }) === 0) {
        // Only add recast if Mudra and Kassatsu are not activated
        if (getStatusDuration({ statusName: 'Kassatsu', loop }) === 0) {
          addActionRecast({ actionName: 'Mudra', loop });
        }
        // Only add status if it is not already on
        addStatus({ statusName: 'Mudra', loop });
      }
      break;
    case 'Ninjutsu':
      // Remove Mudra/Kassatsu on Ninjutsu activation
      removeStatus({ statusName: 'Mudra', loop });
      removeStatus({ statusName: 'Kassatsu', loop });

      // TCJ apparently actually has stacks in loglines
      removeStatusStacks({ statusName: 'Ten Chi Jin', loop });

      switch (actionName) {
        case 'Doton':
        case 'Suiton':
          addStatus({ statusName: actionName, loop });
          break;
        default:
      }
      break;
    case 'Weaponskill':
      removeStatusStacks({ statusName: 'Bunshin', loop });
      switch (actionName) {
        case 'Forked Raiju':
        case 'Fleeting Raiju':
          break;
        default:
          removeStatus({ statusName: 'Raiju Ready', loop });
      }
      break;
    default:
  }

  switch (actionName) {
    case 'Hide':
      removeRecast({ actionName: 'Mudra', loop });
      break;
    case 'Trick Attack':
      // "Self-buff" to simplify alignment calculations
      removeStatus({ statusName: 'Suiton', loop });
      addStatus({ statusName: 'Trick Attack', loop });
      break;
    case 'Kassatsu':
      addStatus({ statusName: 'Kassatsu', loop });
      break;
    case 'Ten Chi Jin':
      addStatus({ statusName: 'Ten Chi Jin', stacks: 3, loop });
      break;
    case 'Bunshin':
      addStatus({ statusName: 'Bunshin', stacks: 5, loop });
      if (level >= 82) { addStatus({ statusName: 'Phantom Kamaitachi Ready', loop }); }
      break;
    case 'Phantom Kamaitachi':
      removeStatus({ statusName: 'Phantom Kamaitachi Ready', loop });
      break;
    case 'Raiton':
      if (level >= 90) { addStatusStacks({ statusName: 'Raiju Ready', loop }); }
      break;
    case 'Forked Raiju':
    case 'Fleeting Raiju':
      removeStatusStacks({ statusName: 'Raiju Ready', loop });
      break;
    default:
  }

  // Start loop
  if (!loop) {
    switch (actionType) {
      case 'Weaponskill':
        startLoop({ delay: currentPlayer.gcd });
        break;
      case 'Ninjutsu':
        if (getStatusDuration({ statusName: 'Ten Chi Jin', loop }) === 0) { startLoop({ delay: 1.5 }); }
        break;
      default:
    }
  }
};

// Doesn't seem needed right now?
// const ninStatusMatch = ({ logType, statusName, sourceID }) => {
// };

// eslint-disable-next-line no-unused-vars
const ninNextGCD = () => {
  // TCJ active
  const { targetCount } = loopPlayer;
  const tenChiJinDuration = getStatusDuration({ statusName: 'Ten Chi Jin', loop: true });
  if (tenChiJinDuration > 0) {
    if (targetCount >= 3) { return ['Fuma Shuriken', 'Katon', 'Suiton']; }
    return ['Fuma Shuriken', 'Raiton', 'Suiton'];
  }

  // Kassatsu oopsies
  const hyoshoRanryuAcquired = actionData.some((element) => element.name === 'Hyosho Ranryu');
  const trickAttackRecast = getRecast({ actionName: 'Trick Attack', loop: true });
  const kassatsuDuration = getStatusDuration({ statusName: 'Kassatsu', loop: true });
  if (kassatsuDuration > 0 && kassatsuDuration < trickAttackRecast) {
    if (hyoshoRanryuAcquired) {
      if (targetCount >= 3) { return ['Chi', 'Ten', 'Goka Mekkyaku']; }
      return ['Ten', 'Jin', 'Hyosho Ranryu'];
    }
    if (targetCount >= 3) { return ['Chi', 'Ten', 'Katon']; }
    return ['Ten', 'Chi', 'Raiton'];
  }

  // Huton oopsies
  const { combat } = loopPlayer;
  const { huton } = loopPlayer;
  const huraijinAcquired = actionData.some((element) => element.name === 'Huraijin');
  const jinAcquired = actionData.some((element) => element.name === 'Jin');
  const mudraRecast = getRecast({ actionName: 'Mudra', loop: true });
  if (huton === 0 && jinAcquired) {
    if (combat && huraijinAcquired) { return 'Huraijin'; }
    if (mudraRecast < 20 && kassatsuDuration < 1) { return ['Chi', 'Jin', 'Ten', 'Huton']; }
  }

  // Trick Attack
  const chiAcquired = actionData.some((element) => element.name === 'Chi');
  const raijuReadyDuration = getStatusDuration({ statusName: 'Raiju Ready', loop: true });
  const phantomKamaitachiReadyDuration = getStatusDuration({ statusName: 'Phantom Kamaitachi Ready', loop: true });
  const trickAttackDuration = getStatusDuration({ statusName: 'Trick Attack', loop: true });
  if (trickAttackDuration > 0) {
    if (kassatsuDuration > 0) {
      if (hyoshoRanryuAcquired) {
        if (targetCount >= 3) { return ['Chi', 'Ten', 'Goka Mekkyaku']; }
        return ['Ten', 'Jin', 'Hyosho Ranryu'];
      }
      if (targetCount >= 3) { return ['Chi', 'Ten', 'Katon']; }
      return ['Ten', 'Chi', 'Raiton'];
    }
    if (phantomKamaitachiReadyDuration > 0) { return 'Phantom Kamaitachi'; }
    if (tenChiJinDuration > 0) {
      if (targetCount >= 3) { return ['Fuma Shuriken', 'Katon', 'Suiton']; }
      return ['Fuma Shuriken', 'Raiton', 'Suiton'];
    }
    if (mudraRecast < 20) { // Dump Mudras during TA
      if (chiAcquired) {
        if (targetCount >= 3) { return ['Chi', 'Ten', 'Katon']; }
        return ['Ten', 'Chi', 'Raiton'];
      }
      return ['Ten', 'Fuma Shuriken'];
    }
    // Maybe there should be a "> 3 stacks" conditional but it seems like a super edge case
    if (raijuReadyDuration > 0) { return 'Fleeting Raiju'; }
  }

  // Prep for Trick Attack
  const { gcd } = loopPlayer;
  const suitonDuration = getStatusDuration({ statusName: 'Suiton', loop: true });
  if (mudraRecast < 20 && jinAcquired && suitonDuration <= trickAttackRecast
  && trickAttackRecast < 20 - gcd * 2) {
    return ['Ten', 'Chi', 'Jin', 'Suiton'];
  }

  // Phantom Kamaitachi
  const bunshinStacks = getStatusStacks({ statusName: 'Bunshin', loop: true });
  if (bunshinStacks === 1 && phantomKamaitachiReadyDuration > 0) { return 'Phantom Kamaitachi'; }

  // Keep Ninjutsu off cooldown
  const raitonLength = 0.5 + 0.5 + 1.5;
  const fumaShurikenLength = 0.5 + 1.5;
  if (chiAcquired && mudraRecast < raitonLength + 1) {
    if (targetCount >= 3) { return ['Chi', 'Ten', 'Katon']; }
    return ['Ten', 'Chi', 'Raiton'];
  }
  if (mudraRecast < fumaShurikenLength + 1) { return ['Ten', 'Fuma Shuriken']; }

  // Forked/Fleeting Raiju
  if (raijuReadyDuration > 0) { return 'Fleeting Raiju'; }

  // Continue combos
  const { comboAction } = loopPlayer;
  const gustSlashAcquired = actionData.some((element) => element.name === 'Gust Slash');
  const aeolianEdgeAcquired = actionData.some((element) => element.name === 'Aeolian Edge');
  const armorCrushAcquired = actionData.some((element) => element.name === 'Armor Crush');
  const hakkeMujinsatsuAcquired = actionData.some((element) => element.name === 'Hakke Mujinsatsu');
  if (comboAction) {
    if (comboAction === 'Gust Slash') {
      if (armorCrushAcquired && huton <= 30) { return 'Armor Crush'; }
      if (aeolianEdgeAcquired) { return 'Aeolian Edge'; }
    }
    if (gustSlashAcquired && comboAction === 'Spinning Edge') { return 'Gust Slash'; }
    if (hakkeMujinsatsuAcquired && comboAction === 'Death Blossom') { return 'Hakke Mujinsatsu'; }
  }

  // Start combos
  const deathBlossomAcquired = actionData.some((element) => element.name === 'Death Blossom');
  if (deathBlossomAcquired && targetCount >= 3) { return 'Death Blossom'; }
  return 'Spinning Edge';
};

// eslint-disable-next-line no-unused-vars
const ninNextOGCD = ({
  weaveCount,
} = {}) => {
  if (weaveCount > 1) { return ''; } // No double weaving on NIN because lazy

  const { combat } = loopPlayer;
  const hideRecast = getRecast({ actionName: 'Hide', loop: true });
  const mudraRecast = getRecast({ actionName: 'Mudra', loop: true });
  if (!combat && hideRecast === 0 && mudraRecast > 0) { return 'Hide'; }

  // Bunshin all the things
  const { ninki } = loopPlayer;
  const bunshinRecast = getRecast({ actionName: 'Bunshin', loop: true });
  const bunshinDuration = getStatusDuration({ statusName: 'Bunshin', loop: true });
  if (ninki >= 50 && bunshinRecast < 1 && bunshinDuration === 0) { return 'Bunshin'; }

  // Increase Ninki
  const meisuiRecast = getRecast({ actionName: 'Meisui', loop: true });
  const mugRecast = getRecast({ actionName: 'Mug', loop: true });
  const trickAttackRecast = getRecast({ actionName: 'Trick Attack', loop: true });
  const suitonDuration = getStatusDuration({ statusName: 'Suiton', loop: true });
  const trickAttackDuration = getStatusDuration({ statusName: 'Trick Attack', loop: true });
  if (ninki < 60 && mugRecast < 1) { return 'Mug'; }
  if (meisuiRecast < 1 && ninki <= 50 && suitonDuration > 0 && suitonDuration <= trickAttackRecast) { return 'Meisui'; }

  // Kassatsu right before Trick Attack
  const kassatsuRecast = getRecast({ actionName: 'Kassatsu', loop: true });
  if (kassatsuRecast < 1 && trickAttackRecast < suitonDuration) { return 'Kassatsu'; }

  // Trick Attack
  if (suitonDuration > 0 && trickAttackRecast < 1) { return 'Trick Attack'; }

  // Trick Attack window
  const assassinateRecast = getRecast({ actionName: 'Assassinate', loop: true });
  const dreamwithinadreamRecast = getRecast({ actionName: 'Dream Within a Dream', loop: true });
  const tenChiJinRecast = getRecast({ actionName: 'Ten Chi Jin', loop: true });
  const kassatsuDuration = getStatusDuration({ statusName: 'Kassatsu', loop: true });
  if (trickAttackDuration > 0) {
    if (dreamwithinadreamRecast < 1) { return 'Dream Within a Dream'; }
    if (assassinateRecast < 1) { return 'Assassinate'; }
    if (kassatsuDuration === 0 && mudraRecast > 5 && tenChiJinRecast < 1) { return 'Ten Chi Jin'; }
  }

  // Ninki
  const { targetCount } = loopPlayer;
  if (
    ninki === 100
    || (mugRecast < bunshinRecast && ninki >= 60)
    || (meisuiRecast < bunshinRecast && ninki >= 50)
  ) {
    if (targetCount >= 3) { return 'Hellfrog Medium'; }
    return 'Bhavacakra';
  }

  // Prevent ninki overcap
  // Not needed? Who knows?
  // let nextWeaponskillNinki = 5;
  // if (comboAction === 'Gust Slash') {
  //   nextWeaponskillNinki = getActionProperty(
  //     { actionName: 'Aeolian Edge', property: 'ninki' }
  //   );
  // }
  // if (ninki + nextWeaponskillNinki > 100 && bhavacakraRecast < 1) { return 'Bhavacakra'; }

  return '';
};

// // eslint-disable-next-line no-unused-vars
// const ninPushArray = ({
//   array,
// } = {}) => {
//   // Note to self: probably better to do this in array since there's so many conditions
//   for (let i = 0; i < array.length - 1; i += 1) {
//     // Push all but last entry

//     overlayArray.push({ name: array[i] });
//     actionMatch({ actionName: array[i], loop: true });
//     // Advancing time for Mudras
//     if (getStatusDuration({ statusName: 'Ten Chi Jin', loop: true }) > 0) {
//       incrementLoopTime({ time: 1 });
//     } else {
//       incrementLoopTime({ time: 0.5 });
//     }
//   }
//   // Last entry (should be ninjutsu itself)
//   overlayArray.push({ name: array[array.length - 1] });
//   actionMatch({ actionName: array[array.length - 1], loop: true });
// };
