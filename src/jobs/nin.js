// eslint-disable-next-line no-unused-vars
const ninJobChanged = (e) => {
  addStatus({ statusName: 'Huton', duration: e.detail.jobDetail.hutonMilliseconds / 1000 });
  currentPlayer.ninki = e.detail.jobDetail.ninkiAmount;
  // console.log(getStatusDuration({ statusName: 'Huton' }));

  const { level } = currentPlayer;

  if (level >= 56) {
    const actionDataIndex = actionData.findIndex((element) => element.name === 'Assassinate');
    actionData.splice(actionDataIndex, 1);
  }
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
  removeStatus({ statusName: 'Hidden', loop }); // Everything removes Hide

  let player = currentPlayer;
  if (loop) { player = loopPlayer; }

  const { level } = currentPlayer;

  const bunshinDuration = getStatusDuration({ statusName: 'Bunshin', loop });
  const hutonDuration = getStatusDuration({ statusName: 'Huton', loop });
  const kassatsuDuration = getStatusDuration({ statusName: 'Kassatsu', loop });
  const mudraDuration = getStatusDuration({ statusName: 'Mudra', loop });

  // Combat toggle
  switch (actionName) {
    case 'Shade Shift': case 'Hide': case 'Ten': case 'Chi': case 'Jin': case 'Huton':
    case 'Shukuchi': case 'Kassatsu': case 'Ten Chi Jin': case 'Meisui': case 'Bunshin':
      break;
    default:
      player.combat = true;
  }

  // Probable target count
  switch (actionName) {
    case 'Spinning Edge': case 'Gust Slash': case 'Aeolian Edge':
      if (level >= 38) { player.targetCount = 1; } break;
    case 'Hellfrog Medium':
      if (level >= 68) { player.targetCount = 3; } break;
    case 'Bhavacakara': case 'Raiton': case 'Hyosho Ranryu':
      player.targetCount = 1; break;
    case 'Death Blossom': case 'Hakke Mujinsatsu': case 'Katon': case 'Doton': case 'Goka Mekkyaku':
      player.targetCount = 3; break;
    default:
  }

  addComboAction({ actionName, loop });

  switch (actionName) {
    case 'Ten': case 'Chi': case 'Jin':
      if (mudraDuration === 0 && kassatsuDuration === 0) { addActionRecast({ actionName: 'Mudra', loop }); } break;
    default: addActionRecast({ actionName, loop });
  }

  // Ninki
  switch (actionName) {
    case 'Spinning Edge': case 'Gust Slash': case 'Death Blossom': case 'Hakke Mujinsatsu':
    case 'Throwing Dagger': case 'Huraijin': case 'Forked Raiju': case 'Fleeting Raiju':
      player.ninki = Math.min(player.ninki + 5, 100); break;
    case 'Armor Crush': case 'Aeolian Edge':
      player.ninki = Math.min(player.ninki + 5, 100);
      if (level >= 78) { player.ninki = Math.min(player.ninki + 5, 100); }
      if (level >= 84) { player.ninki = Math.min(player.ninki + 5, 100); } break;
    case 'Mug':
      if (level >= 40) { player.ninki = Math.min(player.ninki + 40, 100); } break;
    case 'Hellfrog Medium': case 'Bhavacakra': case 'Bunshin':
      player.ninki = Math.max(player.ninki - 50, 0); break;
    case 'Meisui':
      player.ninki = Math.min(player.ninki + 50, 100); break;
    case 'Phantom Kamaitachi':
      player.ninki = Math.min(player.ninki + 10, 100); break;
    default:
  }

  // Bunshin
  if (bunshinDuration > 0) {
    switch (actionName) {
      case 'Spinning Edge': case 'Gust Slash': case 'Aeolian Edge': case 'Armor Crush':
      case 'Death Blossom': case 'Hakke Mujinsatsu':
      case 'Throwing Dagger':
      case 'Huraijin': case 'Phantom Kamaitachi':
      case 'Forked Raiju': case 'Fleeting Raiju':
        if (loop) { player.ninki = Math.min(player.ninki + 5, 100); }
        removeStatusStacks({ statusName: 'Bunshin', loop }); break;
      default:
    }
  }
  // }

  // Ninjutsu is so damn annoying
  switch (actionName) {
    case 'Fuma Shuriken':
    case 'Katon': case 'Raiton': case 'Hyoton':
    case 'Goka Mekkyaku': case 'Hyosho Ranryu':
      // Remove Mudra/Kassatsu on Ninjutsu activation
      removeStatus({ statusName: 'Mudra', loop });
      removeStatus({ statusName: 'Kassatsu', loop }); break;
    case 'Huton': case 'Doton': case 'Suiton':
      removeStatus({ statusName: 'Mudra', loop });
      removeStatus({ statusName: 'Kassatsu', loop });
      removeStatus({ statusName: 'Ten Chi Jin', loop }); break;
    default:
  }

  switch (actionName) {
    case 'Hide': removeRecast({ actionName: 'Mudra', loop }); break;
    case 'Trick Attack':
      // "Self-buff" to simplify alignment calculations
      removeStatus({ statusName: 'Suiton', loop });
      addStatus({ statusName: 'Trick Attack', loop }); break;
    case 'Ten': case 'Chi': case 'Jin':
      if (mudraDuration === 0) { addStatus({ statusName: 'Mudra', loop }); } break;
    case 'Doton': case 'Suiton':
      addStatus({ statusName: actionName, loop }); break;
    case 'Huton': case 'Huraijin':
      addStatus({ statusName: 'Huton', duration: 60, loop }); break;
    case 'Kassatsu': addStatus({ statusName: 'Kassatsu', loop }); break;
    case 'Hakke Mujinsatsu':
      addStatus({ statusName: 'Huton', duration: Math.min(hutonDuration + 10, 60), loop }); break;
    case 'Armor Crush':
      addStatus({ statusName: 'Huton', duration: Math.min(hutonDuration + 30, 60), loop }); break;
    case 'Ten Chi Jin': addStatus({ statusName: 'Ten Chi Jin', stacks: 3, loop }); break;
    case 'Bunshin':
      addStatus({ statusName: 'Bunshin', stacks: 5, loop });
      if (level >= 82) { addStatus({ statusName: 'Phantom Kamaitachi Ready', loop }); } break;
    case 'Phantom Kamaitachi':
      removeStatus({ statusName: 'Phantom Kamaitachi Ready', loop });
      addStatus({ statusName: 'Huton', duration: Math.min(hutonDuration + 10, 60), loop }); break;
    case 'Raiton': if (level >= 90) { addStatusStacks({ statusName: 'Raiju Ready', loop }); } break;
    case 'Forked Raiju': case 'Fleeting Raiju':
      removeStatusStacks({ statusName: 'Raiju Ready', loop }); break;
    default:
  }

  // Start loop
  if (!loop) {
    switch (actionName) {
      case 'Spinning Edge': case 'Gust Slash': case 'Aeolian Edge': case 'Armor Crush':
      case 'Death Blossom': case 'Hakke Mujinsatsu':
      case 'Throwing Dagger':
      case 'Huraijin':
      case 'Phantom Kamaitachi':
      case 'Forked Raiju': case 'Fleeting Raiju':
        startLoop({ delay: currentPlayer.gcd }); break;
      case 'Fuma Shuriken':
      case 'Katon': case 'Raiton': case 'Hyoton':
      case 'Huton': case 'Doton': case 'Suiton':
      case 'Goka Mekkyaku': case 'Hyosho Ranryu':
        if (getStatusDuration({ statusName: 'Ten Chi Jin', loop }) === 0) { startLoop({ delay: 1.5 }); } break;
      default:
    }
  }
};

// eslint-disable-next-line no-unused-vars
const ninGaugeMatch = ({
  gaugeHex,
} = {}) => {
  addStatus({ statusName: 'Huton', duration: parseInt(gaugeHex[0].substring(2, 6), 16) / 1000 });
  if (getStatusDuration({ statusName: 'Huton' }) > 0) {
    currentPlayer.gcd = calculateRecast({ modifier: 0.85 });
  } else {
    currentPlayer.gcd = calculateRecast({ modifier: 1 });
  }

  currentPlayer.ninki = parseInt(gaugeHex[1].substring(4, 6), 16);
};

// Doesn't seem needed right now?
// const ninStatusMatch = ({ logType, statusName, sourceID }) => {
// };

// eslint-disable-next-line no-unused-vars
const ninNextGCD = () => {
  const { level } = currentPlayer;

  // TCJ active
  const { targetCount } = loopPlayer;
  const tenChiJinDuration = getStatusDuration({ statusName: 'Ten Chi Jin', loop: true });
  if (tenChiJinDuration > 0) {
    if (targetCount >= 3) { return ['Fuma Shuriken', 'Katon', 'Suiton']; }
    return ['Fuma Shuriken', 'Raiton', 'Suiton'];
  }

  // Kassatsu oopsies
  const trickAttackRecast = getRecast({ actionName: 'Trick Attack', loop: true });
  const kassatsuDuration = getStatusDuration({ statusName: 'Kassatsu', loop: true });
  const hutonDuration = getStatusDuration({ statusName: 'Huton', loop: true });

  // Huton oopsies
  const { combat } = loopPlayer;
  const mudraRecast = getRecast({ actionName: 'Mudra', loop: true });
  if (level >= 45 && hutonDuration === 0) {
    if (level >= 60 && combat) { return 'Huraijin'; }
    if (mudraRecast < 20 && kassatsuDuration === 0) { return ['Chi', 'Jin', 'Ten', 'Huton']; }
  }

  // Trick Attack
  const raijuReadyDuration = getStatusDuration({ statusName: 'Raiju Ready', loop: true });
  const phantomKamaitachiReadyDuration = getStatusDuration({ statusName: 'Phantom Kamaitachi Ready', loop: true });
  const trickAttackDuration = getStatusDuration({ statusName: 'Trick Attack', loop: true });

  if (trickAttackDuration > 1) { // Needs > 1 to ensure mudras land during
    if (kassatsuDuration > 0) {
      if (level >= 76) {
        if (targetCount > 1) { return ['Chi', 'Ten', 'Goka Mekkyaku']; }
        return ['Ten', 'Jin', 'Hyosho Ranryu'];
      }
      if (targetCount > 1) { return ['Chi', 'Ten', 'Katon']; }
      return ['Ten', 'Chi', 'Raiton'];
    }

    // Not needed? Due to TCJ mudras being at top anyway
    // if (tenChiJinDuration > 0) {
    //   if (targetCount > 1) { return ['Fuma Shuriken', 'Katon', 'Suiton']; }
    //   return ['Fuma Shuriken', 'Raiton', 'Suiton'];
    // }

    if (mudraRecast < 20) { // Dump Mudras during TA
      if (level >= 35) {
        if (targetCount > 1) { return ['Chi', 'Ten', 'Katon']; }
        return ['Ten', 'Chi', 'Raiton'];
      }
      return ['Ten', 'Fuma Shuriken'];
    }
  }

  if (kassatsuDuration > 0 && kassatsuDuration < trickAttackRecast) { // "Oops!"
    if (level >= 76) {
      if (targetCount >= 3) { return ['Chi', 'Ten', 'Goka Mekkyaku']; }
      return ['Ten', 'Jin', 'Hyosho Ranryu'];
    }
    if (targetCount >= 3) { return ['Chi', 'Ten', 'Katon']; }
    return ['Ten', 'Chi', 'Raiton'];
  }

  // Prep for Trick Attack
  const { gcd } = loopPlayer;
  const suitonDuration = getStatusDuration({ statusName: 'Suiton', loop: true });
  if (level >= 45 && mudraRecast < 20 && suitonDuration <= trickAttackRecast
  && trickAttackRecast < 21.5 - gcd * 3) {
    // suitonDuration <= trickAttackRecast because they can both be zero
    // 21.5 = Suiton length + mudra time for Suiton
    // and a few GCDs for buffer...? I guess...?
    return ['Ten', 'Chi', 'Jin', 'Suiton'];
  }

  // Keep Ninjutsu cooldown rolling
  // Queues Ninjutsu early if recast will hit 0 during its Mudra + GCD time
  const raitonLength = 0.5 + 0.5 + 1.5;
  const fumaShurikenLength = 0.5 + 1.5;
  if (level >= 35 && mudraRecast < raitonLength) {
    if (targetCount >= 3) { return ['Chi', 'Ten', 'Katon']; }
    return ['Ten', 'Chi', 'Raiton'];
  }
  if (mudraRecast < fumaShurikenLength) { return ['Ten', 'Fuma Shuriken']; }

  // Status-bound weaponskills
  if (targetCount > 1 && phantomKamaitachiReadyDuration > 0 && trickAttackRecast + gcd > phantomKamaitachiReadyDuration) { return 'Phantom Kamaitachi'; }
  if (raijuReadyDuration > 0) { return 'Fleeting Raiju'; }
  if (phantomKamaitachiReadyDuration > 0 && trickAttackRecast + gcd > phantomKamaitachiReadyDuration) { return 'Phantom Kamaitachi'; }

  // Continue combos
  const { comboAction } = loopPlayer;
  if (comboAction === 'Gust Slash') {
    if (level >= 54 && hutonDuration <= 30) { return 'Armor Crush'; }
    if (level >= 26) { return 'Aeolian Edge'; }
  }
  if (level >= 4 && comboAction === 'Spinning Edge') { return 'Gust Slash'; }
  if (level >= 52 && comboAction === 'Death Blossom') { return 'Hakke Mujinsatsu'; }

  // Start combos
  if (level >= 38 && targetCount >= 3) { return 'Death Blossom'; }
  return 'Spinning Edge';
};

// eslint-disable-next-line no-unused-vars
const ninNextOGCD = ({ weaveCount } = {}) => {
  if (weaveCount > 1) { return ''; } // No double weaving on NIN because lazy

  const loop = true;

  const { level } = currentPlayer;

  const { gcd } = loopPlayer;
  const { combat } = loopPlayer;
  const { ninki } = loopPlayer;
  const { targetCount } = loopPlayer;

  const kassatsuRecast = getRecast({ actionName: 'Kassatsu', loop });
  const bunshinRecast = getRecast({ actionName: 'Bunshin', loop });
  const assassinateRecast = getRecast({ actionName: 'Assassinate', loop });
  const dreamwithinadreamRecast = getRecast({ actionName: 'Dream Within a Dream', loop });
  const hideRecast = getRecast({ actionName: 'Hide', loop });
  const meisuiRecast = getRecast({ actionName: 'Meisui', loop });
  const mugRecast = getRecast({ actionName: 'Mug', loop });
  const tenChiJinRecast = getRecast({ actionName: 'Ten Chi Jin', loop });
  const trickAttackRecast = getRecast({ actionName: 'Trick Attack', loop });
  const mudraRecast = getRecast({ actionName: 'Mudra', loop });

  const bunshinDuration = getStatusDuration({ statusName: 'Bunshin', loop });
  const kassatsuDuration = getStatusDuration({ statusName: 'Kassatsu', loop });
  const phantomKamaitachiReadyDuration = getStatusDuration({ statusName: 'Phantom Kamaitachi Ready', loop });
  const suitonDuration = getStatusDuration({ statusName: 'Suiton', loop });
  const tenChiJinDuration = getStatusDuration({ statusName: 'Ten Chi Jin', loop: true });
  const trickAttackDuration = getStatusDuration({ statusName: 'Trick Attack', loop });

  if (level >= 30 && hideRecast < 0.5 && !combat && mudraRecast > 0) { return 'Hide'; }
  // Level >= 30 because of Ninjutsu

  // Bunshin all the things
  if (level >= 80 && bunshinRecast < 0.5 && ninki >= 50) { return 'Bunshin'; }

  // Increase Ninki
  if (level >= 66 && mugRecast < 0.5 && ninki <= 60) { return 'Mug'; }
  if (level >= 72 && meisuiRecast < 0.5 && ninki <= 50 && suitonDuration > 0 && suitonDuration < trickAttackRecast) { return 'Meisui'; }

  // Kassatsu right before Trick Attack
  if (kassatsuRecast < 0.5 && tenChiJinDuration === 0 && trickAttackRecast < suitonDuration) { return 'Kassatsu'; }
  // Non-zero value for suiton implies level >= 50

  // Trick Attack
  if (suitonDuration > 0 && trickAttackRecast < 0.5) { return 'Trick Attack'; }
  // Non-zero value for suiton implies level >= 50

  // Trick Attack window
  if (trickAttackDuration > 0) {
    if (level >= 56 && dreamwithinadreamRecast < 0.5) { return 'Dream Within a Dream'; }
    if (level >= 40 && assassinateRecast < 0.5) { return 'Assassinate'; }
    if (level >= 70 && tenChiJinRecast < 0.5 && kassatsuDuration === 0 && mudraRecast > gcd + 3.5) { return 'Ten Chi Jin'; }
  }

  // Ninki cap calculation
  let ninkiCap;

  if (level >= 80) {
    ninkiCap = 100;

    if (level >= 72 && meisuiRecast + gcd < bunshinRecast) { ninkiCap -= 50; }
    if (level >= 66 && mugRecast + gcd < bunshinRecast) { ninkiCap -= 40; }

    if (phantomKamaitachiReadyDuration > gcd) {
      ninkiCap -= 10;
      if (bunshinDuration > gcd) { ninkiCap -= 5; }
    } else {
      if (level >= 84 && loopPlayer.comboAction === 'Gust Slash') {
        ninkiCap -= 15;
      } else if (level >= 78 && loopPlayer.comboAction === 'Gust Slash') {
        ninkiCap -= 10;
      } else {
        ninkiCap -= 5;
      }
      if (bunshinDuration > gcd) { ninkiCap -= 5; }
    }
  } else {
    ninkiCap = 50;
  }

  // Ninki spenders
  if (ninki >= 50 && ninki >= ninkiCap) {
    if (level >= 68 && targetCount === 1) { return 'Bhavacakra'; }
    return 'Hellfrog Medium';
  }

  return '';
};
