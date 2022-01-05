/* globals
actionData getActionDataProperty
currentPlayerData currentStatusArray calculateDelay
loopPlayerData loopTargetData loopRecastArray loopStatusArray
addActionRecast checkActionRecast resetActionRecast calculateRecast
addStatus removeStatus addStatusStacks removeStatusStacks checkStatusDuration
startLoop
*/

// eslint-disable-next-line no-unused-vars
const samTraits = ({ level } = {}) => {
  if (level >= 52) {
    let actionDataIndex;
    actionDataIndex = actionData.findIndex((element) => element.name === 'Enpi');
    actionData[actionDataIndex].kenki = 5;
    actionDataIndex = actionData.findIndex((element) => element.name === 'Gekko');
    actionData[actionDataIndex].kenki = 5;
    actionDataIndex = actionData.findIndex((element) => element.name === 'Kasha');
    actionData[actionDataIndex].kenki = 5;
    actionDataIndex = actionData.findIndex((element) => element.name === 'Yukikaze');
    actionData[actionDataIndex].kenki = 5;
    actionDataIndex = actionData.findIndex((element) => element.name === 'Mangetsu');
    actionData[actionDataIndex].kenki = 5;
    actionDataIndex = actionData.findIndex((element) => element.name === 'Oka');
    actionData[actionDataIndex].kenki = 5;
  }

  if (level >= 62) {
    actionData.forEach((element) => {
      if (element.type === 'Weaponskill') {
        if (element.kenki) {
          // eslint-disable-next-line no-param-reassign
          element.kenki = 10;
        } else {
          // eslint-disable-next-line no-param-reassign
          element.kenki = 5;
        }
      }
    });
  }

  if (level >= 74) {
    let actionDataIndex;
    actionDataIndex = actionData.findIndex((element) => element.name === 'Iaijutsu');
    actionData[actionDataIndex].cast = 1.3;
    actionDataIndex = actionData.findIndex((element) => element.name === 'Higanbana');
    actionData[actionDataIndex].cast = 1.3;
    actionDataIndex = actionData.findIndex((element) => element.name === 'Tenka Goken');
    actionData[actionDataIndex].cast = 1.3;
    actionDataIndex = actionData.findIndex((element) => element.name === 'Midare Setsugekka');
    actionData[actionDataIndex].cast = 1.3;
  }

  if (level >= 84) {
    const actionDataIndex = actionData.findIndex((element) => element.name === 'Tsubame-gaeshi');
    actionData[actionDataIndex].charges = 2;
  }

  if (level >= 86) {
    const actionDataIndex = actionData.findIndex((element) => element.name === 'Fuga');
    actionData.splice(actionDataIndex, 1);
  }

  if (level >= 88) {
    const actionDataIndex = actionData.findIndex((element) => element.name === 'Meikyo Shisui');
    actionData[actionDataIndex].charges = 2;
  }

  if (level >= 90) {
    const actionDataIndex = actionData.findIndex((element) => element.name === 'Ikishoten');
    actionData[actionDataIndex].statusName = 'Ogi Namikiri Ready'; // check name later
    actionData[actionDataIndex].statusDuration = 30;
  }
};

// eslint-disable-next-line no-unused-vars
const samPlayerChanged = (e) => {
  currentPlayerData.hp = e.detail.currentHP;
  currentPlayerData.kenki = e.detail.jobDetail.kenki;
  currentPlayerData.meditationStacks = e.detail.jobDetail.meditationStacks;
  currentPlayerData.setsu = e.detail.jobDetail.setsu;
  currentPlayerData.getsu = e.detail.jobDetail.getsu;
  currentPlayerData.ka = e.detail.jobDetail.ka;
};

// eslint-disable-next-line no-unused-vars
const samTargetChanged = () => {
  // Get Higanbana status and "apply to self" for easier calculation
  const higanbanaDuration = checkStatusDuration({ statusName: 'Higanbana', targetID: targetData.id, statusArray: currentStatusArray });
  if (higanbanaDuration > 0) {
    addStatus({ statusName: 'Higanbana', duration: higanbanaDuration, statusArray: currentStatusArray });
    console.log(higanbanaDuration);
  }
  startLoop();
};

const samCalculateDelay = ({
  actionName,
  playerData = currentPlayerData,
  // statusArray = currentStatusArray,
} = {}) => {
  const actionType = getActionDataProperty({ actionName, property: 'type' });
  if (actionType === 'Iaijutsu') { return 0; } // For now? Probably not most efficient
  return playerData.gcd;
};

// eslint-disable-next-line no-unused-vars
const samActionMatch = ({
  // logType, // Currently unused parameters commented out
  actionName,
  targetID,
  playerData,
  recastArray,
  statusArray,
  loop,
} = {}) => {
  const { level } = playerData;
  const actionType = getActionDataProperty({ actionName, property: 'type' });
  const sen = getActionDataProperty({ actionName, property: 'sen' });
  const kenki = getActionDataProperty({ actionName, property: 'kenki' });
  const kenkiCost = getActionDataProperty({ actionName, property: 'kenkiCost' });
  const meditationStacks = getActionDataProperty({ actionName, property: 'meditationStacks' });
  const meditationStackCost = getActionDataProperty({ actionName, property: 'meditationStackCost' });
  const meikyoShisuiDuration = checkStatusDuration({ statusName: 'Meikyo Shisui', statusArray });
  const { gcd } = playerData;
  // Only do these things during loops
  // Probably best to keep it to stuff that player changed would take care of normally
  if (loop) {
    // Sen
    if (actionType === 'Iaijutsu' || actionName === 'Hagakure') {
      // eslint-disable-next-line no-param-reassign
      playerData.setsu = false; playerData.getsu = false; playerData.ka = false;
      // console.log(`${playerData.setsu} ${playerData.getsu} ${playerData.ka}`);
    } else if (sen === 'Getsu') {
      // eslint-disable-next-line no-param-reassign
      playerData.getsu = true;
    } else if (sen === 'Ka') {
      // eslint-disable-next-line no-param-reassign
      playerData.ka = true;
    } else if (sen === 'Setsu') {
      // eslint-disable-next-line no-param-reassign
      playerData.setsu = true;
    }
    // Kenki
    // eslint-disable-next-line no-param-reassign
    playerData.kenki = Math.min(playerData.kenki + kenki, 100);
    // eslint-disable-next-line no-param-reassign
    playerData.kenki = Math.max(playerData.kenki - kenkiCost, 0);

    // Meditation stacks
    // eslint-disable-next-line no-param-reassign
    playerData.meditationStacks = Math.min(playerData.meditationStacks + meditationStacks, 3);
    // eslint-disable-next-line no-param-reassign
    playerData.meditationStacks = Math.max(playerData.meditationStacks - meditationStackCost, 0);
  }

  if (meikyoShisuiDuration > 0 && actionType === 'Weaponskill') {
    removeStatusStacks({ statusName: 'Meikyo Shisui', statusArray });
  }

  // Calculate delay here, probably
  const delay = samCalculateDelay({ actionName, playerData, statusArray });

  // Status effects
  if (['Jinpu', 'Mangetsu'].includes(actionName) || (meikyoShisuiDuration > 0 && actionName === 'Gekko')) {
    addStatus({ statusName: 'Fugetsu', statusArray });
  } else if (['Shifu', 'Oka'].includes(actionName) || (meikyoShisuiDuration > 0 && actionName === 'Kasha')) {
    addStatus({ statusName: 'Fuka', statusArray });
    if (level >= 78) {
      // eslint-disable-next-line no-param-reassign
      playerData.gcd = calculateRecast({ modifier: 0.87 });
    } else {
      // eslint-disable-next-line no-param-reassign
      playerData.gcd = calculateRecast({ modifier: 0.9 });
    }
  } else if (actionName === 'Higanbana') {
    addStatus({ statusName: 'Higanbana', statusArray });
  } else if (actionName === 'Hissatsu: Kaiten') {
    addStatus({ statusName: 'Kaiten', statusArray });
  } else if (actionName === 'Meikyo Shisui') {
    addStatus({ statusName: 'Meikyo Shisui', statusArray });
  } else if (actionName === 'Ikishoten' && actionData.some((element) => element.name === 'Ogi Namikiri')) {
    addStatus({ statusName: 'Ogi Namikiri Ready', statusArray });
  } else if (actionName === 'Ogi Namikiri') {
    removeStatus({ statusName: 'Ogi Namikiri Ready', statusArray });
  } else if (actionType === 'Tsubame-gaeshi') {
    addActionRecast({ actionName: 'Tsubame-gaeshi', recastArray });
  }

  // Flag for Tsubame-gaeshi to prevent it from being removed from icon list
  let tsubameGaeshiReady = false;
  if (['Tenka Goken', 'Midare Setsugekka'].includes(actionName)
  && checkActionRecast({ actionName: 'Tsubame-gaeshi', recastArray }) < gcd) {
    tsubameGaeshiReady = true;
  }

  // Start loop if not in one already
  if (!loop && ['Weaponskill', 'Iaijutsu', 'Tsubame-gaeshi'].includes(actionType) && !tsubameGaeshiReady) {
    startLoop({ delay });
  }
};

// eslint-disable-next-line no-unused-vars
const samStatusMatch = ({ logType, statusName }) => {
  if (statusName === 'Fuka') {
    if (logType === 'StatusAdd') {
      if (currentPlayerData.level >= 78) {
        currentPlayerData.gcd = calculateRecast({ modifier: 0.87 });
      } else { currentPlayerData.gcd = calculateRecast({ modifier: 0.9 }); }
    } else {
      currentPlayerData.gcd = calculateRecast();
    }
  } else if (statusName === 'Higanbana') {
    if (logType === 'StatusAdd') {
      addStatus({ statusName: 'Higanbana', statusArray: currentStatusArray });
    } else {
      removeStatus({ statusName: 'Higanbana', statusArray: currentStatusArray });
    }
  }
  // checkStatusDuration({ statusName: 'Higanbana', statusArray: currentStatusArray });
};

// eslint-disable-next-line no-unused-vars
const samLoopGCDAction = (
  playerData = loopPlayerData,
  recastArray = loopRecastArray,
  statusArray = loopStatusArray,
) => {
  const { level } = playerData;
  const { comboAction } = playerData;
  // const { targetCount } = playerData;
  const { gcd } = playerData;

  const { setsu } = playerData;
  const { getsu } = playerData;
  const { ka } = playerData;
  const sen = setsu + getsu + ka;
  const fugetsuDuration = checkStatusDuration({ statusName: 'Fugetsu', statusArray });
  const fukaDuration = checkStatusDuration({ statusName: 'Fuka', statusArray });
  const meikyoShisuiDuration = checkStatusDuration({ statusName: 'Meikyo Shisui', statusArray });
  const higanbanaDuration = checkStatusDuration({ statusName: 'Higanbana', statusArray });

  const tsubameGaeshiRecast = checkActionRecast({ actionName: 'Tsubame-gaeshi', recastArray });
  const { kenki } = playerData;
  const ogiNamikiriReadyDuration = checkStatusDuration({ statusName: 'Ogi Namikiri Ready', statusArray });

  if (sen === 3) {
    if (tsubameGaeshiRecast <= gcd) { return 'Iaijutsu'; }

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
    if (tsubameGaeshiRecast > gcd * 4) { return 'Iaijutsu'; } // Temporary?

    if (tsubameGaeshiRecast > gcd * 9) { return 'Iaijutsu'; }
  }

  if (sen === 1 && tsubameGaeshiRecast > gcd * 9) {
    if (higanbanaDuration < gcd) { return 'Iaijutsu'; }
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

  if (kenki >= 20 && ogiNamikiriReadyDuration > 0) {
    return 'Ogi Namikiri';
  }


  // // Continue combos
  // const gekkoAcquired = actionData.some((element) => element.name === 'Gekko');
  // const kashaAcquired = actionData.some((element) => element.name === 'Kasha');
  // const yukikazeAcquired = actionData.some((element) => element.name === 'Yukikaze');
  // const shifuAcquired = actionData.some((element) => element.name === 'Shifu');
  // const jinpuAcquired = actionData.some((element) => element.name === 'Jinpu');
  // const mangetsuAcquired = actionData.some((element) => element.name === 'Mangetsu');
  // const okaAcquired = actionData.some((element) => element.name === 'Oka');

  if (meikyoShisuiDuration > 0) {
    if (!getsu && !ka) {
      if (fugetsuDuration === 0 || fugetsuDuration <= fukaDuration) { return 'Gekko'; }
      if (fukaDuration === 0 || fukaDuration < fugetsuDuration) { return 'Kasha'; }
    }
    if (!getsu && ka) { return 'Gekko'; }
    if (getsu && !ka) { return 'Kasha'; }
    if (!setsu) { return 'Yukikaze'; }
  }

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

// eslint-disable-next-line no-unused-vars
const samLoopOGCDAction = ({
  weaveCount,
  playerData = loopPlayerData,
  recastArray = loopRecastArray,
  statusArray = loopStatusArray,
} = {}) => {
  if (weaveCount > 1) { return ''; } // No double weaving on SAM because lazy

  const { level } = playerData;
  const { comboAction } = playerData;
  const { kenki } = playerData;
  const { gcd } = playerData;
  const { setsu } = playerData;
  const { getsu } = playerData;
  const { ka } = playerData;
  const sen = playerData.setsu + playerData.getsu + playerData.ka;
  const ikishotenRecast = checkActionRecast({ actionName: 'Ikishoten', recastArray });
  if (kenki <= 50 && ikishotenRecast < 1) { return 'Ikishoten'; }
  const tsubameGaeshiRecast = checkActionRecast({ actionName: 'Tsubame-gaeshi', recastArray });
  const higanbanaDuration = checkStatusDuration({ statusName: 'Higanbana', statusArray });

  if (!comboAction) {
    if (sen === 1 && tsubameGaeshiRecast <= gcd * 12 && tsubameGaeshiRecast >= gcd * 9) { return 'Hagakure'; }
    if (sen === 2 && setsu && tsubameGaeshiRecast <= gcd * 12 && tsubameGaeshiRecast >= gcd * 9) { return 'Hagakure'; }
    if (sen === 3 && tsubameGaeshiRecast <= gcd * 10 && tsubameGaeshiRecast >= gcd * 9) { return 'Hagakure'; }
  }

  const meikyoShisuiRecast = checkActionRecast({ actionName: 'Meikyo Shisui', recastArray });
  // const tsubameGaeshiRecast = checkActionRecast({ actionName: 'Tsubame-gaeshi', recastArray });
  if (!comboAction && sen === 0) {
    if (level >= 88 && meikyoShisuiRecast < 56) { return 'Meikyo Shisui'; }
    if (meikyoShisuiRecast < 1) { return 'Meikyo Shisui'; }
  }

  const { meditationStacks } = playerData;
  if (meditationStacks === 3) {
    // if (targetCount >= 3) {}
    return 'Shoha';
  }

  let kenkiTarget = 0; // Checks for when to use kenki with spenders
  // Maybe adjust later to "save" more kenki?
  const hissatsuGurenRecast = checkActionRecast({ actionName: 'Hissatsu: Guren', recastArray });
  if (level >= 52) { kenkiTarget = 30; }
  if (level >= 62) { kenkiTarget = 45; }
  // if (level >= 68) { kenkiCap = 45; }
  if (level >= 70) {
    if (ikishotenRecast <= hissatsuGurenRecast) { kenkiTarget = 45; } else { kenkiTarget = 70; }
  }

  if (kenki >= kenkiTarget) {
    // if (targetCount >= 3)
    return 'Hissatsu: Shinten';
  }

  return '';
};

const samPushIaijutsu = () => {
  // Replace other Hissatsu with Kaiten
  if (checkActionRecast({ actionName: 'Hissatsu: Kaiten', recastArray: loopRecastArray })) {
    if (overlayArray[overlayArray.length - 1] && ['Hissatsu: Shinten', 'Hissatsu: Kyuten'].includes(overlayArray[overlayArray.length - 1].name)) {
      overlayArray[overlayArray.length - 1].name = 'Hissatsu: Kaiten';
      loopPlayerData.kenki += 25;
      actionMatch({
        actionName: 'Hissatsu: Kaiten',
        playerData: loopPlayerData,
        recastArray: loopRecastArray,
        statusArray: loopStatusArray,
        loop: true,
      });
    } else if (loopPlayerData.kenki >= 20) {
      overlayArray.push({ name: 'Hissatsu: Kaiten', ogcd: true });
      actionMatch({
        actionName: 'Hissatsu: Kaiten',
        playerData: loopPlayerData,
        recastArray: loopRecastArray,
        statusArray: loopStatusArray,
        loop: true,
      });
    }
  }
  
  const { gcd } = loopPlayerData;
  const sen = loopPlayerData.setsu + loopPlayerData.getsu + loopPlayerData.ka;
  const tsubameGaeshiRecast = checkActionRecast({ actionName: 'Tsubame-gaeshi', recastArray: loopRecastArray });
  if (sen === 1) {
    overlayArray.push({ name: 'Higanbana' });
    actionMatch({
      actionName: 'Higanbana',
      playerData: loopPlayerData,
      recastArray: loopRecastArray,
      statusArray: loopStatusArray,
      loop: true,
    });
  } else if (sen === 2) {
    overlayArray.push({ name: 'Tenka Goken' });
    actionMatch({
      actionName: 'Tenka Goken',
      playerData: loopPlayerData,
      recastArray: loopRecastArray,
      statusArray: loopStatusArray,
      loop: true,
    });
    if (tsubameGaeshiRecast <= gcd) {
      advanceLoopTime({ time: gcd });
      overlayArray.push({ name: 'Kaeshi: Goken' });
      actionMatch({
        actionName: 'Tenka Goken',
        playerData: loopPlayerData,
        recastArray: loopRecastArray,
        statusArray: loopStatusArray,
        loop: true,
      });
    }
  } else if (sen === 3) {
    overlayArray.push({ name: 'Midare Setsugekka' });
    actionMatch({
      actionName: 'Midare Setsugekka',
      playerData: loopPlayerData,
      recastArray: loopRecastArray,
      statusArray: loopStatusArray,
      loop: true,
    });
    if (tsubameGaeshiRecast <= gcd) {
      advanceLoopTime({ time: gcd });
      overlayArray.push({ name: 'Kaeshi: Setsugekka' });
      actionMatch({
        actionName: 'Kaeshi: Setsugekka',
        playerData: loopPlayerData,
        recastArray: loopRecastArray,
        statusArray: loopStatusArray,
        loop: true,
      });
    }
  }
};

const samPushEnpi = () => {
  if (checkActionRecast({ actionName: 'Hissatsu: Yaten', recastArray: loopRecastArray })) {
    if (overlayArray[overlayArray.length - 1] && ['Hissatsu: Shinten', 'Hissatsu: Kyuten'].includes(overlayArray[overlayArray.length - 1].name)) {
      overlayArray[overlayArray.length - 1].name = 'Hissatsu: Yaten';
      loopPlayerData.kenki += 25;
      actionMatch({
        actionName: 'Hissatsu: Yaten',
        playerData: loopPlayerData,
        recastArray: loopRecastArray,
        statusArray: loopStatusArray,
        loop: true,
      });
    } else if (loopPlayerData.kenki >= 10) {
      overlayArray.push({ name: 'Hissatsu: Yaten', ogcd: true });
      actionMatch({
        actionName: 'Hissatsu: Yaten',
        playerData: loopPlayerData,
        recastArray: loopRecastArray,
        statusArray: loopStatusArray,
        loop: true,
      });
    }
  }
  
  overlayArray.push({ name: 'Enpi' });
    actionMatch({
      actionName: 'Enpi',
      playerData: loopPlayerData,
      recastArray: loopRecastArray,
      statusArray: loopStatusArray,
      loop: true,
    });


};
