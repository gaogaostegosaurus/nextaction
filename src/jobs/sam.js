/* globals
  currentPlayer loopPlayer
  actionData
  startLoop

  calculateRecast
  getActionProperty getRecast getStatusDuration
  addActionRecast addStatus
  removeStatus removeStatusStacks
*/

// eslint-disable-next-line no-unused-vars
const samTraits = () => {
  const { level } = currentPlayer;
  if (level >= 52) {
    const kenkiWeaponskills = ['Enpi', 'Gekko', 'Kasha', 'Yukikaze', 'Mangetsu', 'Oka'];
    for (let index = 0, { length } = actionData; index < length; index += 1) {
      if (kenkiWeaponskills.includes(actionData[index].name)) {
        actionData[index].kenki = 5;
      }
    }
  }

  if (level >= 62) {
    for (let index = 0, { length } = actionData; index < length; index += 1) {
      if (['Weaponskill'].includes(actionData[index].type)) {
        if (actionData[index].kenki === 5) {
          actionData[index].kenki = 10;
        } else {
          actionData[index].kenki = 5;
        }
      }
    }
  }

  if (level >= 74) {
    const iaijutsuActions = ['Iaijutsu', 'Higanbana', 'Tenka Goken', 'Midare Setsugekka'];
    for (let index = 0, { length } = actionData; index < length; index += 1) {
      if (iaijutsuActions.includes(actionData[index].name)) {
        actionData[index].cast = 1.3;
      }
    }
  }

  if (level >= 84) {
    const index = actionData.findIndex((element) => element.name === 'Tsubame-gaeshi');
    actionData[index].charges = 2;
  }

  if (level >= 86) {
    const index = actionData.findIndex((element) => element.name === 'Fuga');
    actionData.splice(index, 1);
  }

  if (level >= 88) {
    const index = actionData.findIndex((element) => element.name === 'Meikyo Shisui');
    actionData[index].charges = 2;
  }

  if (level >= 90) {
    const index = actionData.findIndex((element) => element.name === 'Ikishoten');
    actionData[index].statusName = 'Ogi Namikiri Ready';
  }
};

// eslint-disable-next-line no-unused-vars
const samPlayerChanged = (e) => {
  currentPlayer.kenki = e.detail.jobDetail.kenki;
  currentPlayer.meditationStacks = e.detail.jobDetail.meditationStacks;
  currentPlayer.setsu = e.detail.jobDetail.setsu;
  currentPlayer.getsu = e.detail.jobDetail.getsu;
  currentPlayer.ka = e.detail.jobDetail.ka;
  currentPlayer.sen = currentPlayer.setsu + currentPlayer.getsu + currentPlayer.ka;
};

// eslint-disable-next-line no-unused-vars
const samTargetChanged = () => {
  startLoop();
};

// eslint-disable-next-line no-unused-vars
const samActionMatch = ({
  // logType, // Currently unused parameters commented out
  actionName,
  // targetID,
  loop,
} = {}) => {
  const actionType = getActionProperty({ actionName, property: 'type' });
  const sen = getActionProperty({ actionName, property: 'sen' });
  const kenki = getActionProperty({ actionName, property: 'kenki' });
  const kenkiCost = getActionProperty({ actionName, property: 'kenkiCost' });
  const meditationStacks = getActionProperty({ actionName, property: 'meditationStacks' });
  const meditationStackCost = getActionProperty({ actionName, property: 'meditationStackCost' });

  const meikyoShisuiDuration = getStatusDuration({ statusName: 'Meikyo Shisui', loop });

  // Only do these things during loops
  // Probably best to keep it to stuff that player changed would take care of normally
  if (loop) {
    // Sen
    if (actionType === 'Iaijutsu' || actionName === 'Hagakure') {
      loopPlayer.setsu = false; loopPlayer.getsu = false; loopPlayer.ka = false;
    } else if (sen === 'Getsu') {
      loopPlayer.getsu = true;
    } else if (sen === 'Ka') {
      loopPlayer.ka = true;
    } else if (sen === 'Setsu') {
      loopPlayer.setsu = true;
    }

    // Kenki
    loopPlayer.kenki = Math.min(loopPlayer.kenki + kenki, 100);
    loopPlayer.kenki = Math.max(loopPlayer.kenki - kenkiCost, 0);

    // Meditation stacks
    loopPlayer.meditationStacks = Math.min(loopPlayer.meditationStacks + meditationStacks, 3);
    loopPlayer.meditationStacks = Math.max(loopPlayer.meditationStacks - meditationStackCost, 0);
  }

  // Status effects
  if (['Jinpu', 'Mangetsu'].includes(actionName) || (meikyoShisuiDuration > 0 && actionName === 'Gekko')) {
    addStatus({ statusName: 'Fugetsu', loop });
  } else if (['Shifu', 'Oka'].includes(actionName) || (meikyoShisuiDuration > 0 && actionName === 'Kasha')) {
    addStatus({ statusName: 'Fuka', loop });
  } else if (actionName === 'Higanbana') {
    addStatus({ statusName: 'Higanbana', loop });
  } else if (actionName === 'Meikyo Shisui') {
    addStatus({ statusName: 'Meikyo Shisui', loop });
  } else if (actionName === 'Hissatsu: Kaiten') {
    addStatus({ statusName: 'Kaiten', loop });
  } else if (actionName === 'Hissatsu: Guren') {
    addActionRecast({ actionName: 'Hissatsu: Senei', loop });
  } else if (actionName === 'Hissatsu: Senei') {
    addActionRecast({ actionName: 'Hissatsu: Guren', loop });
  } else if (actionName === 'Ikishoten' && getActionProperty({ actionName: 'Ikishoten', property: 'statusName' }) === 'Ogi Namikiri Ready') {
    addStatus({ statusName: 'Ogi Namikiri Ready', loop });
  } else if (actionName === 'Ogi Namikiri') {
    removeStatus({ statusName: 'Ogi Namikiri Ready', loop });
  } else if (actionType === 'Tsubame-gaeshi') {
    addActionRecast({ actionName: 'Tsubame-gaeshi', loop });
  }

  // Remove stacks for Meikyo Shisui
  // (Putting down here to avoid strange interactions with above)
  if (meikyoShisuiDuration > 0 && actionType === 'Weaponskill') {
    removeStatusStacks({ statusName: 'Meikyo Shisui', loop });
  }
};

// eslint-disable-next-line no-unused-vars
const samStatusMatch = ({ logType, statusName, targetID }) => {
  if (statusName === 'Fuka') {
    if (logType === 'StatusAdd') {
      if (currentPlayer.level >= 78) {
        currentPlayer.gcd = calculateRecast({ modifier: 0.87 });
      } else { currentPlayer.gcd = calculateRecast({ modifier: 0.9 }); }
    } else {
      currentPlayer.gcd = calculateRecast();
    }
  } else if (statusName === 'Higanbana') {
    if (logType === 'StatusAdd') {
      addStatus({ statusName: 'Higanbana' }); // This is probably the least annoying way to just track Higanbana on one target
    } else {
      removeStatus({ statusName: 'Higanbana' });
    }
  }
  // getStatusDuration({ statusName: 'Higanbana', statusArray: currentStatusArray });
};

const samIaijutsuArray = () => {
  const iaijutsuArray = [];
  if (getRecast({ actionName: 'Hissatsu: Kaiten', loop: true }) === 0 && loopPlayer.kenki >= 20) {
    iaijutsuArray.push('Hissatsu: Kaiten');
  }

  const sen = loopPlayer.setsu + loopPlayer.getsu + loopPlayer.ka;
  if (sen === 1) {
    iaijutsuArray.push('Higanbana');
  } else if (sen === 2) {
    iaijutsuArray.push('Tenka Goken');
  } else if (sen === 3) {
    iaijutsuArray.push('Midare Setsugekka');
  }

  const tsubameGaeshiRecast = getRecast({ actionName: 'Tsubame-gaeshi', loop: true });
  if (tsubameGaeshiRecast <= loopPlayer.gcd) {
    if (sen === 2) {
      iaijutsuArray.push('Kaeshi: Goken');
    } else if (sen === 3) {
      iaijutsuArray.push('Kaeshi: Setsugekka');
    }
  }

  return iaijutsuArray;
};

const samEnpiArray = () => {
  const enpiArray = [];
  if (getRecast({ actionName: 'Hissatsu: Yaten', loop: true }) === 0 && loopPlayer.kenki >= 10) {
    enpiArray.push({ name: 'Hissatsu: Yaten' });
  }

  enpiArray.push({ name: 'Enpi' });

  if (getRecast({ actionName: 'Hissatsu: Gyoten', loop: true }) === 0 && loopPlayer.kenki >= 20) {
    enpiArray.push({ name: 'Hissatsu: Gyoten' });
  }
};

// eslint-disable-next-line no-unused-vars
const getSamuraiAction = ({
  weaveCount,
} = {}) => {
  const { comboAction } = loopPlayer;
  const { targetCount } = loopPlayer;
  const { gcd } = loopPlayer;
  const { combat } = loopPlayer;

  const fugetsuDuration = getStatusDuration({ statusName: 'Fugetsu', loop: true });
  const fukaDuration = getStatusDuration({ statusName: 'Fuka', loop: true });
  const meikyoShisuiDuration = getStatusDuration({ statusName: 'Meikyo Shisui', loop: true });
  const higanbanaDuration = getStatusDuration({ statusName: 'Higanbana', loop: true });

  let tsubameGaeshiRecast = getRecast({ actionName: 'Tsubame-gaeshi', loop: true });
  const tsubameGaeshiCharges = getActionProperty({ actionName: 'Tsubame-gaeshi', property: 'charges' });
  if (tsubameGaeshiCharges) {
    tsubameGaeshiRecast = Math.max(0, tsubameGaeshiRecast - getActionProperty({ actionName: 'Tsubame-gaeshi', property: 'recast' }) * (tsubameGaeshiCharges - 1));
  }
  const { kenki } = loopPlayer;
  const ogiNamikiriReadyDuration = getStatusDuration({ statusName: 'Ogi Namikiri Ready', loop: true });

  const { setsu } = loopPlayer;
  const { getsu } = loopPlayer;
  const { ka } = loopPlayer;
  const sen = setsu + getsu + ka;

  let meikyoShisuiRecast = getRecast({ actionName: 'Meikyo Shisui', loop: true });
  const meikyoShisuiCharges = getActionProperty({ actionName: 'Meikyo Shisui', property: 'charges' });
  if (meikyoShisuiCharges) {
    meikyoShisuiRecast = Math.max(0, meikyoShisuiRecast - getActionProperty({ actionName: 'Meikyo Shisui', property: 'recast' }) * (meikyoShisuiCharges - 1));
  }
  // Start combat with Meikyo Shisui Gekko/Kasha if possible
  if (!combat && !comboAction && meikyoShisuiDuration === 0) {
    loopPlayer.combat = true;
    if (meikyoShisuiRecast < 1) {
      if (!getsu && fugetsuDuration < 8 * gcd) { return 'Meikyo Shisui'; } if (!ka && fukaDuration < 8 * gcd) { return 'Meikyo Shisui'; }
    }
  }

  // OGCD actions triggered by weaveCount
  if (weaveCount) {
    // Ikishoten highest priority(?)
    const ikishotenRecast = getRecast({ actionName: 'Ikishoten', loop: true });
    if (kenki <= 50 && ikishotenRecast < 1) { return 'Ikishoten'; }

    // Hagakure GCD manipulation
    // TODO: Should this be < or <=?
    if ((sen === 1 || sen === 2) && tsubameGaeshiRecast < gcd * 12) {
      if (!comboAction && tsubameGaeshiRecast >= gcd * 9) { return 'Hagakure'; }
      if (comboAction === 'Hakaze' && (!getsu || !ka) && tsubameGaeshiRecast >= gcd * 8) { return 'Hagakure'; }
      if (comboAction === 'Shifu' && !ka && tsubameGaeshiRecast >= gcd * 7) { return 'Hagakure'; }
      if (comboAction === 'Jinpu' && !getsu && tsubameGaeshiRecast >= gcd * 7) { return 'Hagakure'; }
      if (comboAction === 'Hakaze' && !setsu && getsu && ka && tsubameGaeshiRecast >= gcd * 7) { return 'Hagakure'; }
    }

    if (!comboAction && meikyoShisuiDuration === 0
    && (targetCount >= 3 || (sen === 0 && higanbanaDuration < gcd * 2))) {
      if (meikyoShisuiRecast < 1) { return 'Meikyo Shisui'; }
    }

    const { meditationStacks } = loopPlayer;
    if (meditationStacks === 3) {
      const shohaIIacquired = actionData.some((element) => element.name === 'Shoha II');
      if (shohaIIacquired && targetCount >= 3) { return 'Shoha II'; }
      return 'Shoha';
    }

    const hissatsuGurenRecast = getRecast({ actionName: 'Hissatsu: Guren', loop: true });
    if (hissatsuGurenRecast < 1) {
      return 'Hissatsu: Senei';
    }

    const shintenAcquired = actionData.some((element) => element.name === 'Hissatsu: Shinten');
    if (shintenAcquired) {
      if (kenki >= 90 || (ikishotenRecast < gcd * 2 && kenki > 50)) {
        const kyutenAcquired = actionData.some((element) => element.name === 'Hissatsu: Kyuten');
        if (kyutenAcquired && targetCount >= 3) { return 'Hissatsu: Kyuten'; }
        return 'Hissatsu: Shinten';
      }
    }

    return '';
  }

  // GCD actions start here

  if (kenki >= 20 && fugetsuDuration > 0 && ogiNamikiriReadyDuration > 0) {
    return ['Hissatsu: Kaiten', 'Ogi Namikiri', 'Kaeshi: Namikiri'];
  }

  if (sen === 3) {
    if (tsubameGaeshiRecast <= gcd) { return samIaijutsuArray(); }

    if (tsubameGaeshiRecast <= gcd * 2 && meikyoShisuiDuration === 0) {
      if (comboAction === 'Jinpu') { return 'Enpi'; }
      if (comboAction === 'Shifu') { return 'Enpi'; }
      if (comboAction === 'Hakaze' && fugetsuDuration <= fukaDuration) { return 'Jinpu'; }
      if (comboAction === 'Hakaze' && fukaDuration < fugetsuDuration) { return 'Shifu'; }
      if (!comboAction) { return 'Hakaze'; }
    }

    if (tsubameGaeshiRecast <= gcd * 3 && meikyoShisuiDuration === 0) {
      if (!comboAction) { return 'Hakaze'; }
    }

    if (tsubameGaeshiRecast <= gcd * 4 && meikyoShisuiDuration === 0) {
      if (!comboAction) { return 'Enpi'; }
    }

    // something crazy happened I hope
    if (tsubameGaeshiRecast > gcd * 4) { return samIaijutsuArray(); } // Temporary?
    if (tsubameGaeshiRecast > gcd * 9) { return samIaijutsuArray(); }
  }

  if (sen === 1 && tsubameGaeshiRecast > gcd * 9) {
    if (higanbanaDuration < gcd) { return samIaijutsuArray(); }
    if (higanbanaDuration < gcd * 2 && meikyoShisuiDuration === 0) {
      if (comboAction === 'Hakaze' && fugetsuDuration <= fukaDuration) { return 'Jinpu'; }
      if (comboAction === 'Hakaze' && fukaDuration < fugetsuDuration) { return 'Shifu'; }
      if (!comboAction) { return 'Hakaze'; }
    }
    if (higanbanaDuration < gcd * 3 && meikyoShisuiDuration === 0) {
      if (!comboAction) { return 'Hakaze'; }
    }
  }

  // if (sen === 2) {
  //   if (tsubameGaeshiRecast <= gcd * 4) { return 'Iaijutsu'; }

  //   if (tsubameGaeshiRecast <= gcd * 5) {
  //     if (comboAction === 'Hakaze' && fugetsuDuration <= fukaDuration) { return 'Jinpu'; }
  //     if (comboAction === 'Hakaze' && fukaDuration < fugetsuDuration) { return 'Shifu'; }
  //     if (!comboAction) { return 'Hakaze'; }
  //     return 'Enpi';
  //   }

  //   if (tsubameGaeshiRecast <= gcd * 6) {
  //     if (!comboAction) { return 'Hakaze'; }
  //     return 'Enpi';
  //   }
  // }

  if (meikyoShisuiDuration > 0) {
    if (!getsu && !ka) {
      if (fugetsuDuration === 0 || fugetsuDuration <= fukaDuration) { return 'Gekko'; }
      if (fukaDuration === 0 || fukaDuration < fugetsuDuration) { return 'Kasha'; }
    }
    if (!getsu && ka) { return 'Gekko'; }
    if (getsu && !ka) { return 'Kasha'; }
    if (!setsu) { return 'Yukikaze'; }
  }

  // // Continue combos
  // const gekkoAcquired = actionData.some((element) => element.name === 'Gekko');
  // const kashaAcquired = actionData.some((element) => element.name === 'Kasha');
  // const yukikazeAcquired = actionData.some((element) => element.name === 'Yukikaze');
  // const shifuAcquired = actionData.some((element) => element.name === 'Shifu');
  // const jinpuAcquired = actionData.some((element) => element.name === 'Jinpu');
  // const mangetsuAcquired = actionData.some((element) => element.name === 'Mangetsu');
  // const okaAcquired = actionData.some((element) => element.name === 'Oka');

  if (comboAction === 'Jinpu') { return 'Gekko'; }
  if (comboAction === 'Shifu') { return 'Kasha'; }

  if (comboAction === 'Hakaze') {
    if (!getsu && !ka) {
      if (fugetsuDuration === 0 || fugetsuDuration <= fukaDuration) { return 'Jinpu'; }
      if (fukaDuration === 0 || fukaDuration < fugetsuDuration) { return 'Shifu'; }
    }
    if (!getsu && ka) { return 'Jinpu'; }
    if (getsu && !ka) { return 'Shifu'; }
    if (!setsu) { return 'Yukikaze'; }

    if (fugetsuDuration === 0 || fugetsuDuration <= fukaDuration) { return 'Jinpu'; }
    if (fukaDuration === 0 || fukaDuration < fugetsuDuration) { return 'Shifu'; }
  }
  return 'Hakaze';
};
