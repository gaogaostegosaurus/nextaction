/* globals
playerData actionData statusData
*/
const ninTraits = () => {
  const { level } = playerData;

  if (level >= 56) {
    const actionDataIndex = actionData.findIndex((element) => element.name === 'Assassinate');
    actionData.splice(actionDataIndex, 1);
  }

  if (level >= 62) {
    actionData.forEach((element) => {
      if (element.type === 'Weaponskill') {
        // eslint-disable-next-line no-param-reassign
        element.ninki = 5;
      }
    });
  }

  if (level >= 66) {
    const actionDataIndex = actionData.findIndex((element) => element.name === 'Mug');
    actionData[actionDataIndex].ninki = 40;
  }

  if (level >= 78) {
    let actionDataIndex;
    actionDataIndex = actionData.findIndex((element) => element.name === 'Aeolian Edge');
    actionData[actionDataIndex].ninki = 10;
    actionDataIndex = actionData.findIndex((element) => element.name === 'Armor Crush');
    actionData[actionDataIndex].ninki = 10;
  }

  if (level >= 84) {
    let actionDataIndex;
    actionDataIndex = actionData.findIndex((element) => element.name === 'Aeolian Edge');
    actionData[actionDataIndex].ninki = 15;
    actionDataIndex = actionData.findIndex((element) => element.name === 'Armor Crush');
    actionData[actionDataIndex].ninki = 15;
  }

  if (level >= 88) {
    const actionDataIndex = actionData.findIndex((element) => element.name === 'Meisui');
    actionData[actionDataIndex].status = 'Meisui'; // check name later
  }

  if (level >= 90) {
    const actionDataIndex = actionData.findIndex((element) => element.name === 'Raiton');
    actionData[actionDataIndex].status = 'Forked Raiju Ready';
  }
}; // Keep collapsed, probably

const ninPlayerChanged = (e) => {
  playerData.huton = e.detail.jobDetail.hutonMilliseconds;
  playerData.ninki = e.detail.jobDetail.ninkiAmount;

  // Huton call GCD
};

const ninTargetChange = () => {
  // 
};


const ninActionMatch = ({ logType, actionName, targetID } = {}) => {
  let delay = playerData.gcd;
  

  return delay;

  // // Set recast
  // if (mudra.includes(actionName) && mudraCount === 0 && checkStatus({ statusName: 'Kassatsu' }) < 0) {
  //   // Don't increase Mudra recast under Kassatsu
  //   addRecast({ actionName: 'Mudra 1', recast: checkRecast({ actionName: 'Mudra 2' }) });
  //   addRecast({ actionName: 'Mudra 2', recast: checkRecast({ actionName: 'Mudra 2' }) + 20000 });
  //   mudraCount += 1;
  // } else if (recast[propertyName]) { addRecast({ actionName }); }

  // // Set duration
  // if (duration[propertyName]) { addStatus({ statusName: actionName }); }

  // if (weaponskills.includes(actionName)) {
  //   // Combo
  //   if (comboCheck && ((level >= 4 && actionName === 'Spinning Edge')
  //   || (level >= 26 && actionName === 'Gust Slash')
  //   || (level >= 52 && actionName === 'Death Blossom'))) {
  //     addStatus({ statusName: 'Combo' });
  //     comboStep = actionName;
  //   } else {
  //     removeStatus({ statusName: 'Combo' });
  //     comboStep = '';
  //   }

  //   // Add recasts
  //   if (actionName === 'Shadow Fang') {
  //     addRecast({ actionName: 'Shadow Fang', recast: recast.shadowfang * hutonModifier });
  //     // Since Shadow Fang can't be on more than one target anyway, treat it like a buff
  //   } else if (recast[propertyName]) { addRecast({ actionName }); }

  //   // Add durations
  //   if (duration[propertyName]) { addStatus({ statusName: actionName }); }

  //   ninNextAction({ delay: gcd });
  // } else if (mudra.includes(actionName)) {
  //   if (checkStatus({ statusName: 'Kassatsu' }) > 0) {
  //     // Nothing
  //   } else if (mudraCount === 0) {
  //     // Don't increase Mudra recast under Kassatsu
  //     addRecast({ actionName: 'Mudra 1', recast: checkRecast({ actionName: 'Mudra 2' }) });
  //     addRecast({ actionName: 'Mudra 2', recast: checkRecast({ actionName: 'Mudra 2' }) + 20000 });
  //   }
  //   mudraCount += 1;
  // } else if (ninjutsu.includes(actionName)) {
  //   mudraCount = 0;

  //   // Probably safe to remove this regardless of what actually happens
  //   removeStatus({ statusName: 'Kassatsu' });

  //   if (duration[propertyName]) { addStatus({ statusName: actionName }); }

  //   if (checkStatus({ statusName: 'Ten Chi Jin' }) > 0) {
  //     tenchijinCount += 1;
  //     if (tenchijinCount >= 3) {
  //       removeStatus({ statusName: 'Ten Chi Jin' });
  //       tenchijinCount = 0;
  //     }
  //   } else {
  //     tenchijinCount = 0;
  //   }

  //   // Set gcd delay for ninjutsu (or final ninjutsu of TCJ)
  //   if (checkStatus({ statusName: 'Ten Chi Jin' }) < 0) {
  //     ninNextAction({ delay: 1500 });
  //   }
  // } else if (abilities.includes(actionName)) {
  //   if (recast[propertyName]) { addRecast({ actionName }); }
  //   if (duration[propertyName]) { addStatus({ statusName: actionName }); }

  //   if (actionName === 'Trick Attack') {
  //     removeStatus({ statusName: 'Suiton' });
  //     // ninNextAction();
  //   } else if (level >= 30 && actionName === 'Hide') {
  //     addRecast({ actionName: 'Mudra 1', recast: -1 });
  //     addRecast({ actionName: 'Mudra 2', recast: -1 });
  //     ninNextAction();
  //   } else if (actionName === 'Kassatsu') {
  //     // ninNextAction();
  //   } else if (actionName === 'Dream Within A Dream') {
  //     if (level >= 60) { addStatus({ statusName: 'Assassinate Ready' }); }
  //   } else if (actionName === 'Assassinate') {
  //     removeStatus({ statusName: 'Assassinate Ready' });
  //   } else if (actionName === 'Ten Chi Jin') {
  //     tenchijinCount = 0;
  //     // Don't call next action here since the next actions are pretty much decided
  //   } else if (actionName === 'Meisui') {
  //     removeStatus({ statusName: 'Suiton' });
  //     // ninNextAction();
  //   }
  // }
};

ninNextAction = ({
  delay = 0,
} = {}) => {
  const { checkRecast } = nextActionOverlay;
  const { checkStatus } = nextActionOverlay;
  const { duration } = nextActionOverlay;
  const { recast } = nextActionOverlay;
  const { level } = playerData;
  const { weaponskills } = actionList;
  const { ninjutsu } = actionList;

  // Initial values
  let { comboStep } = nextActionOverlay;
  let { ninki } = playerData;
  let { bunshinCount } = playerData;

  const loopRecast = {};
  const loopRecastList = [
    'Mug', 'Trick Attack', 'Shadow Fang', 'Mudra 1', 'Mudra 2', 'Kassatsu', 'Dream Within A Dream',
    'Ten Chi Jin', 'Meisui', 'Bunshin'];
  loopRecastList.forEach((actionName) => {
    const propertyName = actionName.replace(/[\s':-]/g, '').toLowerCase();
    loopRecast[propertyName] = checkRecast({ actionName });
  });

  const loopStatus = {};
  const loopStatusList = ['Combo', 'Trick Attack', 'Suiton', 'Kassatsu', 'Assassinate Ready', 'Bunshin'];
  loopStatusList.forEach((statusName) => {
    const propertyName = statusName.replace(/[\s':-]/g, '').toLowerCase();
    loopStatus[propertyName] = checkStatus({ statusName });
  });

  // Huton technically not a status effect, but treat like one
  loopStatus.huton = playerData.huton;

  let hutonModifier = 1;
  if (loopStatus.huton > 0) { hutonModifier = 0.85; }
  let gcd = gcd * hutonModifier;

  const iconArray = [];

  let gcdTime = delay;
  let nextTime = 0;
  const nextMaxTime = 15000;

  while (nextTime < nextMaxTime) {
    let loopTime = 0;

    // Huton makin' stuff complicated
    if (loopStatus.huton > 0) { hutonModifier = 0.85; } else { hutonModifier = 1; }
    gcd *= hutonModifier;

    if (gcdTime === 0) {
      const nextGCD = ninNextGCD({
        comboStep,
        loopRecast,
        loopStatus,
      });

      iconArray.push({ name: nextGCD });

      // Weaponskills
      // Ninjutsu kept separate to avoid combo interaction
      if (weaponskills.includes(nextGCD)) {
        if ((level >= 4 && nextGCD === 'Spinning Edge')
        || (level >= 26 && nextGCD === 'Gust Slash')
        || (level >= 52 && nextGCD === 'Death Blossom')) {
          comboStep = nextGCD;
          loopStatus.combo = 15000;
        } else {
          comboStep = '';
          loopStatus.combo = -1;
        }

        // Ninki
        if (level >= 62) {
          ninki = Math.min(ninki + 5, 100);
          if (level >= 78 && ['Aeolian Edge', 'Shadow Fang', 'Armor Crush'].includes(nextGCD)) {
            ninki = Math.min(ninki + 5, 100);
          }
        }

        // Bunshin
        if (loopStatus.bunshin > 0 && bunshinCount > 0) {
          bunshinCount -= 1;
          ninki = Math.min(ninki + 5, 100);
        }

        // Weaponskill specific effects
        if (nextGCD === 'Armor Crush') {
          loopStatus.huton = Math.min(loopStatus.huton + duration.armorcrush, duration.huton);
        } else if (nextGCD === 'Hakke Mujinsatsu') {
          loopStatus.huton = Math.min(loopStatus.huton + duration.hakkemujinsatsu, duration.huton);
        } else if (nextGCD === 'Shadow Fang') {
          loopStatus.shadowfang = duration.shadowfang;
          loopRecast.shadowfang = recast.shadowfang * hutonModifier;
        }
      } else if (ninjutsu.includes(nextGCD)) {
        // Mudra recast
        if (loopStatus.kassatsu > 0) {
          // Use Kassatsu buff first
          loopStatus.kassatsu = -1;
        } else {
          loopRecast.mudra1 = loopRecast.mudra2;
          loopRecast.mudra2 += recast.mudra2;
        }

        // Calculate amount of time Mudra takes (to adjust Ninjutsu effect)
        let mudraTime = 500;
        if (['Katon', 'Raiton', 'Hyoton', 'Goka Mekkyaku', 'Hyosho Ranryu'].includes(nextGCD)) {
          mudraTime = 500 * 2;
        } else if (['Huton', 'Doton', 'Suiton'].includes(nextGCD)) {
          mudraTime = 500 * 3;
        }

        const propertyName = nextGCD.replace(/[\s':-]/g, '').toLowerCase();
        if (duration[propertyName]) {
          loopStatus[propertyName] = duration[propertyName] + mudraTime;
        }

        loopTime += mudraTime;
      }

      // Calculate how much time for OGCDs
      if (ninjutsu.includes(nextGCD)) {
        gcdTime = 1500;
      } else {
        gcdTime = gcd;
      }

      loopTime += gcdTime;
    } else { loopTime = gcdTime; }

    // Update Combo status
    if (comboStep === '' || loopStatus.combo < 0) {
      comboStep = '';
      loopStatus.combo = -1;
    }

    // Update Bunshin status
    if (bunshinCount <= 0 || loopStatus.bunshin < 0) {
      bunshinCount = 0;
      loopStatus.bunshin = -1;
    }

    // Calculate Ninki target for OGCD section
    let ninkiTarget = 50; // "If Ninki is this or more, OK to use Bhavacakra or Hellfrog"
    if (level >= 80) {
      if (loopRecast.bunshin > loopRecast.meisui) {
        ninkiTarget = 50;
      } else if (loopRecast.bunshin > loopRecast.mug) {
        ninkiTarget = 55;
      } else {
        ninkiTarget = 100;
      }
    }

    let weaveMax = 0;
    if (gcdTime >= 1500) { weaveMax = 1; } // Too much of a pain to double weave on NIN

    let weave = 1;

    while (weave <= weaveMax) {
      const nextOGCD = ninNextOGCD({
        weave, ninki, ninkiTarget, loopRecast, loopStatus,
      });

      if (nextOGCD) {
        // Push into array (special cases for TCJ)
        if (nextOGCD === 'Ten Chi Jin Suiton') {
          iconArray.push({ name: 'Ten Chi Jin', size: 'small' });
          iconArray.push({ name: 'Fuma Shuriken' });
          if (targetCount > 1) {
            iconArray.push({ name: 'Katon' });
          } else {
            iconArray.push({ name: 'Raiton' });
          }
          iconArray.push({ name: 'Suiton' });
        } else {
          iconArray.push({ name: nextOGCD, size: 'small' });
        }
      }

      const propertyName = nextOGCD.replace(/[\s':-]/g, '').toLowerCase();
      if (recast[propertyName]) { loopRecast[propertyName] = recast[propertyName]; }
      if (duration[propertyName]) { loopStatus[propertyName] = duration[propertyName]; }

      // Special effects
      if (nextOGCD === 'Assassinate') {
        loopStatus.assassinateready = -1;
      } else if (nextOGCD === 'Bhavacakra') {
        ninki = Math.max(ninki - 50, 0);
      } else if (nextOGCD === 'Bunshin') {
        ninki = Math.max(ninki - 50, 0);
        bunshinCount = 5;
      } else if (nextOGCD === 'Dream Within A Dream') {
        if (level >= 60) { loopStatus.assassinateready = duration.assassinateready; }
      } else if (nextOGCD === 'Hellfrog Medium') {
        ninki = Math.max(ninki - 50, 0);
      } else if (nextOGCD === 'Meisui') {
        loopStatus.suiton = -1;
        ninki = Math.min(ninki + 50, 100);
      } else if (nextOGCD === 'Mug') {
        if (level >= 66) { ninki = Math.min(ninki + 40, 100); }
      } else if (nextOGCD === 'Ten Chi Jin Suiton') {
        loopStatus.suiton = duration.suiton + 2000;
      } else if (nextOGCD === 'Trick Attack') {
        loopStatus.suiton = -1;
      }

      if (nextOGCD === 'Ten Chi Jin Suiton') {
        // 3500 is total GCD time for TCJ (1000 + 1000 + 1500)
        loopRecast.tenchijin = recast.tenchijin;
        nextTime += 3500;
        Object.keys(loopRecast).forEach((property) => {
          loopRecast[property] = Math.max(loopRecast[property] - 3500, -1);
        });
        Object.keys(loopStatus).forEach((property) => {
          loopStatus[property] = Math.max(loopStatus[property] - 3500, -1);
        });
        weave = 1; // Ends with a GCD, allow one more weave
      } else {
        weave += 1;
      }
    }

    Object.keys(loopRecast).forEach((property) => {
      loopRecast[property] = Math.max(loopRecast[property] - loopTime, -1);
    });
    Object.keys(loopStatus).forEach((property) => {
      loopStatus[property] = Math.max(loopStatus[property] - loopTime, -1);
    });

    gcdTime = 0; // Zero out for next loop
    nextTime += loopTime;
  }

  NEWsyncIcons({ iconArray });

  clearTimeout(timeout.nextAction);
  timeout.nextAction = setTimeout(ninNextAction, gcd * 2);
};

ninNextGCD = ({
  comboStep,
  loopRecast,
  loopStatus,
} = {}) => {
  const { duration } = nextActionOverlay;
  const { recast } = nextActionOverlay;
  const { targetCount } = nextActionOverlay;

  let { gcd } = nextActionOverlay;
  const { level } = playerData;

  if (loopStatus.huton > 0) { gcd *= 0.85; }

  // Since NIN has a lot of different priority cases, lots of function use here

  // Use Kassatsu buff if it's about to fade
  if (loopStatus.kassatsu > 0 && loopStatus.kassatsu < gcd * 2) {
    return ninNextNinjutsu({ loopStatus });
  }

  // Continue Combo if timer is low
  if (loopStatus.combo > 0 && loopStatus.combo < gcd * 2) {
    return ninNextWeaponskill({ comboStep, loopStatus });
  }

  // Prioritize Huton if it's really low for some reason
  if (level >= 45 && loopStatus.kassatsu < 0 && loopStatus.huton < 500 * 3 + 1500
  && loopRecast.mudra1 < 0) { return 'Huton'; }

  if (level >= 52 && targetCount >= 3
  && loopStatus.huton < 20000 && loopStatus.huton > 0) {
    if (comboStep === 'Death Blossom') { return 'Hakke Mujinsatsu'; } return 'Death Blossom';
  }

  if (level >= 54 && loopStatus.huton < 20000 && loopStatus.huton > 0) {
    if (comboStep === 'Gust Slash') { return 'Armor Crush'; }
    if (comboStep === 'Spinning Edge') { return 'Gust Slash'; } return 'Spinning Edge';
  }

  // Shadow Fang ASAP (1100 potency with 1 GCD)
  if (level >= 45 && loopRecast.trickattack > recast.shadowfang * 0.1
  && loopRecast.shadowfang < 0) { return 'Shadow Fang'; }

  // Use Kassatsu buff (hopefully during TA)
  if (loopStatus.kassatsu > 0 && loopStatus.kassatsu < loopRecast.trickattack + 2000 + gcd) {
    return ninNextNinjutsu({ loopStatus });
  }

  // Use Suiton to allow TA as soon as possible
  // *** Double check these conditions later ***
  if (level >= 45 && loopStatus.kassatsu < 0
  && loopStatus.suiton < 0 && loopRecast.trickattack < duration.suiton - gcd) {
    if (level >= 70 && level < 72 && loopRecast.tenchijin + 3500 < loopRecast.trickattack) {
      // Do nothing in this circumstance - use TCJ for TA during these levels if possible
    } else if (loopRecast.mudra1 < 0) {
      // Standard Suiton for TA
      return 'Suiton';
    }
  }

  // Kassatsu Ninjutsu under Trick Attack
  // Above state should cover this...? Keeping just in case
  // if (loopStatus.trickattack > 0 && loopStatus.kassatsu > 0) {
  //   return ninNextNinjutsu({ loopStatus });
  // }

  // Ninjutsu under Trick Attack
  if (loopStatus.trickattack > 2000 && loopRecast.mudra1 < 0) {
    return ninNextNinjutsu({ loopStatus });
  }

  // Use Shadow Fang on cooldown before Trick (level 45)
  if (level >= 30 && level < 45 && loopRecast.shadowfang < 0) { return 'Shadow Fang'; }

  // Ninjutsu (without Kassatsu or Trick)
  if (loopStatus.kassatsu < 0 && loopStatus.trickattack < 0) {
    // Keep one Ninjutsu charge on cooldown (after 45)
    if (level >= 45 && loopRecast.mudra2 < 500 * 2 + 1500) {
      return ninNextNinjutsu({ loopStatus });
    }

    // Use all mudra on cooldown before Trick/Huton/etc
    if (level >= 30 && level < 45 && loopRecast.mudra1 < 0) {
      return ninNextNinjutsu({ loopStatus });
    }
  }

  // Weaponskill
  return ninNextWeaponskill({ comboStep, loopStatus });
};

ninNextWeaponskill = ({
  comboStep,
  loopStatus,
} = {}) => {
  const { targetCount } = nextActionOverlay;
  const { level } = playerData;

  let aeolianedgeComboPotency = 220;
  if (level >= 26) {
    aeolianedgeComboPotency = (220 + 330 + 480) / 3;
  } else if (level >= 4) {
    aeolianedgeComboPotency = (220 + 330) / 2;
  }

  // let armorcrushComboPotency = 220;
  // if (level >= 54) {
  //   aeolianedgeComboPotency = (220 + 330 + 460) / 3;
  // } else if (level >= 4) {
  //   aeolianedgeComboPotency = (220 + 330) / 2;
  // }

  let hakkemujinsatsuComboPotency = 0;
  if (level >= 52) {
    hakkemujinsatsuComboPotency = ((120 + 140) * targetCount) / 2;
  } else if (level >= 38) {
    hakkemujinsatsuComboPotency = (120 * targetCount) / 2;
  }

  if (level >= 54 && comboStep === 'Gust Slash'
  && loopStatus.huton < 40000 && loopStatus.huton > 0) {
    if (loopStatus.huton > 20000 && loopStatus.trickattack > 0) { return 'Aeolian Edge'; }
    return 'Armor Crush';
  } if (level >= 52 && comboStep === 'Death Blossom') {
    return 'Hakke Mujinsatsu';
  } if (level >= 26 && comboStep === 'Gust Slash') {
    return 'Aeolian Edge';
  } if (level >= 4 && comboStep === 'Spinning Edge') {
    return 'Gust Slash';
  } if (level >= 38 && hakkemujinsatsuComboPotency > aeolianedgeComboPotency) {
    return 'Death Blossom';
  } return 'Spinning Edge';
};

ninNextNinjutsu = ({
  loopStatus,
} = {}) => {
  const { targetCount } = nextActionOverlay;
  const { level } = playerData;

  if (level >= 76 && loopStatus.kassatsu > 0) {
    if (targetCount > 1) {
      return 'Goka Mekkyaku';
    } return 'Hyosho Ranryu';
  }

  if (level >= 35) {
    if (targetCount > 1) {
      return 'Katon';
    } return 'Raiton';
  }

  return 'Fuma Shuriken';
};

ninNextOGCD = ({
  weave, ninki, ninkiTarget, loopRecast, loopStatus,
} = {}) => {
  // Prioritize these actions if the related buff is about to wear off for some reason
  if (checkStatusDuration({ name: 'Suiton', statusArray })) {
    if (loopRecast.trickattack < zeroTime) { return 'Trick Attack'; }

    if (level >= 72 && loopStatus.suiton < loopRecast.trickattack && ninki < ninkiTarget
    && loopRecast.meisui < zeroTime) { return 'Meisui'; }
  }
  if (loopStatus.assassinateready > zeroTime && loopStatus.assassinateready < gcd * 2) { return 'Assassinate'; }

  // OGCDs are ordered so that they match with opener (more or less)

  // Kassatsu
  if (level >= 50
  && (loopStatus.suiton > gcd || loopRecast.trickattack > recast.kassatsu * 0.1)
  && loopRecast.kassatsu < zeroTime) { return 'Kassatsu'; }

  // Mug (for Ninki)
  if (level >= 66 && ninki <= 60 && loopRecast.mug < zeroTime) { return 'Mug'; }

  // Bunshin
  if (level >= 80 && ninki >= 50 && loopRecast.bunshin < zeroTime) { return 'Bunshin'; }

  // Trick Attack
  if (loopStatus.suiton > zeroTime && loopRecast.trickattack < zeroTime) { return 'Trick Attack'; }

  // Dream (during TA)
  if (level >= 56 && loopRecast.trickattack > recast.dreamwithinadream * 0.1
  && loopRecast.dreamwithinadream < zeroTime) { return 'Dream Within A Dream'; }

  // Assassinate
  if (loopStatus.assassinateready > zeroTime) { return 'Assassinate'; }

  // TCJ section is a little janky but I can't think of a better way at the moment...

  // Use TCJ to set up Meisui
  if (level >= 72 && loopStatus.kassatsu < zeroTime
  && loopRecast.meisui < duration.suiton - gcd
  && loopRecast.trickattack > recast.tenchijin * 0.1
  && (loopStatus.combo < zeroTime || loopStatus.combo > gcd * 2)
  && loopRecast.tenchijin < zeroTime) { return 'Ten Chi Jin Suiton'; }

  // Use TCJ to set up TA before 72
  if (level >= 70 && level < 72 && loopStatus.kassatsu < zeroTime
  && loopRecast.trickattack < duration.suiton - gcd
  && (loopStatus.combo < zeroTime || loopStatus.combo > gcd * 2)
  && loopRecast.tenchijin < zeroTime) { return 'Ten Chi Jin Suiton'; }

  // Meisui
  if (level >= 72 && ninki <= 50 && loopStatus.suiton > zeroTime
  && loopStatus.suiton < loopRecast.trickattack && loopRecast.meisui < zeroTime) { return 'Meisui'; }

  // Ninki spenders
  if (level >= 62 && ninki >= ninkiTarget) {
    if (targetCount > 1) { return 'Hellfrog Medium'; }
    if (level >= 68) { return 'Bhavacakra'; } return 'Hellfrog Medium';
  }

  // Mug (before Ninki)
  if (level >= 45 && level < 66 && loopRecast.trickattack > recast.mug * 0.1
  && loopRecast.mug < zeroTime) { return 'Mug'; }

  if (level >= 15 && level < 45 && loopRecast.mug < zeroTime) { return 'Mug'; }

  // No OGCD
  return '';
};



ninStatusMatch = (statusMatch) => {
  const { addStatus } = nextActionOverlay;
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
    if (statusMatch.groups.statusName === 'Mudra') {
      mudraCount = 0;
    } else if (statusMatch.groups.statusName === 'Ten Chi Jin') {
      tenchijinCount = 0;
    }
  }
};
