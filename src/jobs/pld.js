nextActionOverlay.pldJobChange = () => {
  const { playerData } = nextActionOverlay;
  const { level } = playerData;

  nextActionOverlay.actionList.weaponskills = [
    'Fast Blade',
    'Riot Blade',
    'Rage Of Halone',
    'Goring Blade',
    'Royal Authority',
    'Total Eclipse',
    'Prominence',
    'Shield Bash',
    'Shield Lob',
    'Atonement', // I keep forgetting this DOES break combo
  ];

  nextActionOverlay.actionList.spells = [
    'Clemency',
    'Holy Spirit',
    'Holy Circle',
    'Confiteor',
  ];

  nextActionOverlay.actionList.abilities = [
    'Fight Or Flight', 'Spirits Within', 'Circle Of Scorn', 'Requiescat', 'Intervene',
    'Sheltron', 'Sentinel', 'Hallowed Ground', 'Passage Of Arms',
    'Rampart', 'Reprisal', 'Arm\'s Length',
  ];

  nextActionOverlay.statusList.self = [
    'Fight Or Flight', 'Requiescat', 'Sword Oath',
  ];

  nextActionOverlay.statusList.target = [
    'Goring Blade',
  ];

  nextActionOverlay.statusList.mitigation = [
    'Sheltron', 'Sentinel', 'Hallowed Ground', 'Passage Of Arms',
    'Rampart', 'Reprisal', 'Arm\'s Length',
  ];

  nextActionOverlay.castingList.spells = nextActionOverlay.actionList.spells;

  const { recast } = nextActionOverlay;

  recast.fightorflight = 60000;
  recast.sentinel = 120000;
  recast.circleofscorn = 25000;

  recast.spiritswithin = 30000;
  recast.sheltron = 5000;
  recast.cover = 120000;
  recast.hallowedground = 420000;
  recast.divineveil = 90000;
  recast.intervention = 10000;
  recast.requiescat = 60000;
  recast.passageofarms = 120000;
  recast.intervene = 30000;
  recast.intervene1 = recast.intervene;
  recast.intervene2 = recast.intervene;

  const { duration } = nextActionOverlay;

  duration.fightorflight = 25000;
  duration.ironwill = 999999;
  duration.sentinel = 10000;
  duration.circleofscorn = 15000;

  duration.sheltron = 6000;
  duration.cover = 12000;
  duration.hallowedground = 10000;
  duration.goringblade = 21000;
  duration.divineveil = 30000;
  duration.intervention = 6000;
  duration.requiescat = 12000;
  duration.passageofarms = 18000;
  duration.swordoath = 15000;

  const { icon } = nextActionOverlay;
  icon.sentinel = '000151';
  icon.shieldbash = '000154';
  icon.rageofhalone = '000155';
  icon.riotblade = '000156';
  icon.fastblade = '000158';
  icon.circleofscorn = '000161';
  icon.shieldlob = '000164';
  icon.fightorflight = '000166';
  icon.cover = '002501';
  icon.hallowedground = '002502';
  icon.spiritswithin = '002503';
  icon.ironwill = '002505';
  icon.goringblade = '002506';
  icon.royalauthority = '002507';
  icon.divineveil = '002508';
  icon.clemency = '002509';
  icon.sheltron = '002510';
  icon.totaleclipse = '002511';
  icon.intervention = '002512';
  icon.requiescat = '002513';
  icon.holyspirit = '002514';
  icon.passageofarms = '002515';
  icon.prominence = '002516';
  icon.holycircle = '002517';
  icon.confiteor = '002518';
  icon.atonement = '002519';
  icon.intervene = '002520';
  icon.intervene1 = icon.intervene;
  icon.intervene2 = icon.intervene;

  if (level >= 60) {
    icon.rageofhalone = icon.royalauthority;
  }

  nextActionOverlay.tankJobChange();

  nextActionOverlay.swordoathCount = 0;
}; // Keep collapsed, usually

nextActionOverlay.pldPlayerChange = (e) => {
  const { playerData } = nextActionOverlay;
  playerData.mp = e.detail.currentMP;
  playerData.oath = e.detail.jobDetail.oath;
  nextActionOverlay.pldNextMitigation();
};

nextActionOverlay.pldTargetChange = () => {
  nextActionOverlay.pldNextAction();
};

nextActionOverlay.pldNextAction = ({
  delay = 0,
  casting,
} = {}) => {
  // Static values
  const { checkStatus } = nextActionOverlay;
  const { checkRecast } = nextActionOverlay;
  const { duration } = nextActionOverlay;
  const { recast } = nextActionOverlay;
  const { gcd } = nextActionOverlay;
  const { weaponskills } = nextActionOverlay.actionList;
  const { spells } = nextActionOverlay.actionList;
  const { level } = nextActionOverlay.playerData;

  // Snapshot of current character
  let { comboStep } = nextActionOverlay;
  let { mp } = nextActionOverlay.playerData;
  let { swordoathCount } = nextActionOverlay;

  const loopRecast = {};
  const loopRecastList = nextActionOverlay.actionList.abilities.concat(
    ['Intervene 1', 'Intervene 2'], // Add Intervene manually
  );
  loopRecastList.forEach((actionName) => {
    const propertyName = actionName.replace(/[\s':-]/g, '').toLowerCase();
    loopRecast[propertyName] = checkRecast({ actionName });
  });

  const loopStatus = {};
  const loopStatusList = nextActionOverlay.statusList.self.concat(nextActionOverlay.statusList.target, ['Combo']);
  loopStatusList.forEach((statusName) => {
    const propertyName = statusName.replace(/[\s':-]/g, '').toLowerCase();
    loopStatus[propertyName] = checkStatus({ statusName });
  });

  // Treat Goring like a buff for purposes of loop
  // Loop resets if target changes anyway
  loopStatus.goringblade = checkStatus({ statusName: 'Goring Blade', id: nextActionOverlay.targetData.id });

  const iconArray = [];

  let gcdTime = delay;
  let mpTick = 0;
  let nextTime = 0;
  const nextMaxTime = 15000;

  while (nextTime < nextMaxTime) {
    let loopTime = 0;
    if (gcdTime < 1000) {
      let nextGCD = '';
      if (nextTime === 0 && casting) {
        nextGCD = casting;
      } else {
        nextGCD = nextActionOverlay.pldNextGCD({
          comboStep,
          mp,
          swordoathCount,
          loopRecast,
          loopStatus,
        });
      }

      iconArray.push({ name: nextGCD });

      if (weaponskills.includes(nextGCD)) {
        if ((level >= 4 && nextGCD === 'Fast Blade')
        || (level >= 26 && nextGCD === 'Riot Blade')
        || (level >= 40 && nextGCD === 'Total Eclipse')) {
          loopStatus.combo = duration.combo;
          comboStep = nextGCD;
        } else {
          loopStatus.combo = -1;
          comboStep = '';
        }
      } else if (spells.includes(nextGCD)) {
        loopStatus.combo = -1;
        comboStep = '';
        mp -= 2000;
      }

      // Special effects
      if (nextGCD === 'Riot Blade') {
        mp += 1000;
      } else if (nextGCD === 'Prominence') {
        mp += 500;
      } else if (nextGCD === 'Goring Blade') {
        loopStatus.goringblade = duration.goringblade;
      } else if (level >= 76 && nextGCD === 'Royal Authority') {
        loopStatus.swordoath = duration.swordoath;
        swordoathCount = 3;
      } else if (nextGCD === 'Atonement') {
        swordoathCount -= 1;
        mp += 400;
      } else if (nextGCD === 'Confiteor') {
        loopStatus.requiescat = -1;
      }

      // Remove Sword Oath if last charge was used
      if (swordoathCount <= 0) {
        swordoathCount = 0;
        loopStatus.swordoath = -1;
      }

      if (spells.includes(nextGCD)) {
        if (nextGCD === 'Confiteor' || (level >= 78 && loopStatus.requiescat > 0)) {
          gcdTime = 2500;
          loopTime = 2500;
        } else {
          gcdTime = 0; // Due to cast time
          loopTime = 2500;
        }
      } else {
        gcdTime = gcd;
        loopTime = gcdTime;
      }
    }

    Object.keys(loopRecast).forEach((property) => {
      loopRecast[property] = Math.max(loopRecast[property] - loopTime, -1);
    });
    Object.keys(loopStatus).forEach((property) => {
      loopStatus[property] = Math.max(loopStatus[property] - loopTime, -1);
    });

    if (comboStep === '' || loopStatus.combo < 0) {
      comboStep = '';
      loopStatus.combo = -1;
    }

    if (swordoathCount <= 0 || loopStatus.swordoath <= 0) {
      swordoathCount = 0;
      loopStatus.swordoath = -1;
    }

    let weave = 1;
    let weaveMax = 0;
    if (gcdTime >= 2200) {
      weaveMax = 2;
    } else if (gcdTime > 1000) {
      weaveMax = 1;
    }

    while (weave <= weaveMax) {
      const nextOGCD = nextActionOverlay.pldNextOGCD({
        comboStep,
        gcdTime,
        mp,
        swordoathCount,
        loopRecast,
        loopStatus,
      });
      if (nextOGCD) {
        iconArray.push({ name: nextOGCD, size: 'small' });

        const propertyName = nextOGCD.replace(/[\s':-]/g, '').toLowerCase();
        if (recast[propertyName]) { loopRecast[propertyName] = recast[propertyName]; }
        if (duration[propertyName]) { loopStatus[propertyName] = duration[propertyName]; }

        if (nextOGCD === 'Requiescat') {
          // Aesthetic window adjustment
          loopStatus.requiescat += gcd;
        } else if (nextOGCD === 'Spirits Within') { mp += 500; }
      }

      weave += 1;
    }

    gcdTime = 0;
    nextTime += loopTime;

    // MP tick
    if (Math.floor(nextTime / 3000) > mpTick) {
      mp += 200;
      mpTick += 1;
    }
    // Fix MP just in case
    if (mp > 10000) { mp = 10000; } else if (mp < 0) { mp = 0; }
  }
  nextActionOverlay.NEWsyncIcons({ iconArray });
  nextActionOverlay.pldNextMitigation();

  // Refresh after a few GCDs if nothing's happening
  clearTimeout(nextActionOverlay.timeout.nextAction);
  nextActionOverlay.timeout.nextAction = setTimeout(
    nextActionOverlay.pldNextAction, gcd * 2,
  );
};

nextActionOverlay.pldNextGCD = ({
  comboStep, mp, swordoathCount, loopRecast, loopStatus,
} = {}) => {
  const { recast } = nextActionOverlay;
  const { duration } = nextActionOverlay;
  const fightorflightCutoff = recast.fightorflight - duration.fightorflight;
  const { targetCount } = nextActionOverlay;
  const { level } = nextActionOverlay.playerData;
  const { gcd } = nextActionOverlay;

  // Calculate potency of remaining DoT ticks
  let dotPotency = 85 * Math.floor(loopStatus.goringblade / 3000);
  if (loopStatus.fightorflight < 0 // Not in FoF, implies loopRecast.fightorflight < 65000)
  && loopRecast.fightorflight + loopStatus.goringblade > fightorflightCutoff) {
    // Last Goring was used during FoF
    dotPotency *= 1.25;
  } else if (loopStatus.fightorflight > 0 // In FoF, implies loopRecast.fightorflight > 65000)
  && loopRecast.fightorflight + loopStatus.goringblade > recast.fightorflight) {
    // Last Goring was NOT used during FoF
    dotPotency *= 0.8;
  }

  let goringbladePotency = 0;
  let goringbladeComboPotency = 200;
  if (level >= 54) {
    goringbladePotency = 390 + (85 * 7) - dotPotency * 2;
    // Counts twice because overwrite + compare to not overwriting... I think
    goringbladeComboPotency = (200 + 300 + goringbladePotency) / 3;
  }

  let rageofhalonePotency = 0;
  let rageofhaloneComboPotency = 200;
  let atonementPotency = 0;
  if (level >= 76) {
    rageofhalonePotency = 550;
    rageofhaloneComboPotency = (200 + 300 + 550 * 4) / 6;
    atonementPotency = 550;
  } else if (level >= 60) {
    rageofhalonePotency = 550;
    rageofhaloneComboPotency = (200 + 300 + 550) / 3;
  } else if (level >= 26) {
    rageofhalonePotency = 350;
    rageofhaloneComboPotency = (200 + 300 + 350) / 3;
  } else if (level >= 4) {
    rageofhaloneComboPotency = (200 + 300) / 2;
  }

  let prominenceComboPotency = 0;
  if (level >= 40) {
    prominenceComboPotency = ((120 + 220) / 2) * targetCount;
  } else if (level >= 6) {
    prominenceComboPotency = 120 * targetCount;
  }

  // Sword Oath (First probably? Because potency-wise Atonement > Holy Spirit)
  if (loopStatus.swordoath > 0) { // Implies 76
    if (loopStatus.requiescat > 0 && mp >= 2000) {
      // AoE time for some reason
      if (level >= 80 && (loopStatus.requiescat <= 2500 || mp < 4000)) { return 'Confiteor'; }
      if (targetCount > 1) { return 'Holy Circle'; }
      if (loopStatus.swordoath > swordoathCount * gcd + 2500) {
        // Best of both worlds
        return 'Holy Spirit';
      }
    }
    if (prominenceComboPotency > atonementPotency) {
      // Better to AoE here than to use Atonements
      if (comboStep === 'Total Eclipse') { return 'Prominence'; } return 'Total Eclipse';
    }
    return 'Atonement';
  }

  // Requiescat
  if (loopStatus.requiescat > 0 && mp >= 2000) {
    if (level >= 80 && (loopStatus.requiescat <= 2500 || mp < 4000)) { return 'Confiteor'; }
    if (level >= 72 && targetCount > 1) { return 'Holy Circle'; }
    if (prominenceComboPotency > 350 * 1.5) {
      // Better to AoE than cast sometimes (before 72)
      if (comboStep === 'Total Eclipse') { return 'Prominence'; } return 'Total Eclipse';
    }
    return 'Holy Spirit';
  }

  // Continue combos
  if (level >= 40 && comboStep === 'Total Eclipse') { return 'Prominence'; }
  if (level >= 26 && comboStep === 'Riot Blade') {
    if (goringbladePotency > rageofhalonePotency) { return 'Goring Blade'; }
    if (level >= 60) { return 'Royal Authority'; }
    return 'Rage Of Halone';
  }
  if (level >= 4 && comboStep === 'Fast Blade') { return 'Riot Blade'; }

  // Start combos
  if (prominenceComboPotency > Math.max(rageofhaloneComboPotency, goringbladeComboPotency)) {
    return 'Total Eclipse';
  }
  return 'Fast Blade';
};

nextActionOverlay.pldNextOGCD = ({
  comboStep,
  gcdTime,
  // mp,
  // swordoathCount,
  loopRecast,
  loopStatus,
} = {}) => {
  const { level } = nextActionOverlay.playerData;
  const { recast } = nextActionOverlay;
  // const { gcd } = nextActionOverlay;
  const { targetCount } = nextActionOverlay;

  if (level >= 2 && loopStatus.requiescat < 0
  && (['Fast Blade', 'Riot Blade'].includes(comboStep) || targetCount > 1)
  && gcdTime <= 1500 && loopRecast.fightorflight < 0) {
    return 'Fight Or Flight';
  }

  if (level >= 68 && loopStatus.fightorflight < 0 && loopStatus.swordoath < 0
  && comboStep === '' && loopRecast.fightorflight > 0 // Requiescat goes second
  && gcdTime <= 1500 && loopRecast.requiescat < 0) {
    return 'Requiescat';
  }

  if (level >= 50 && targetCount > 1 && loopRecast.fightorflight > recast.circleofscorn * 0.5
  && loopRecast.circleofscorn < 0) {
    return 'Circle Of Scorn';
  }

  if (level >= 30 && loopRecast.fightorflight > recast.spiritswithin * 0.5
  && loopRecast.spiritswithin < 0) {
    return 'Spirits Within';
  }

  if (level >= 50 && loopRecast.fightorflight > recast.circleofscorn * 0.5
  && loopRecast.circleofscorn < 0) {
    return 'Circle Of Scorn';
  }

  return '';
};

nextActionOverlay.pldNextMitigation = () => {
  const mitigationList = nextActionOverlay.statusList.mitigation;
  let mitigationStatus = -1;
  const { checkStatus } = nextActionOverlay;

  mitigationList.forEach((ability) => {
    if (mitigationStatus < checkStatus({ statusName: ability })) {
      mitigationStatus = checkStatus({ statusName: ability });
    }
  });

  const iconArray = [];
  const { level } = nextActionOverlay.playerData;
  const { checkRecast } = nextActionOverlay;
  const { oath } = nextActionOverlay.playerData;

  if (mitigationStatus < 0) {
    mitigationList.forEach((ability) => {
      if (checkRecast({ actionName: ability }) < 0) {
        if (level >= 35 && ability === 'Sheltron' && oath >= 50) { iconArray.push({ name: ability, size: 'small' }); }
        if (level >= 38 && ability === 'Sentinel') { iconArray.push({ name: ability, size: 'small' }); }
        if (level >= 50 && ability === 'Hallowed Ground') { iconArray.push({ name: ability, size: 'small' }); }
        if (level >= 70 && ability === 'Passage Of Arms') { iconArray.push({ name: ability, size: 'small' }); }
        if (level >= 8 && ability === 'Rampart') { iconArray.push({ name: ability, size: 'small' }); }
        if (level >= 22 && ability === 'Reprisal') { iconArray.push({ name: ability, size: 'small' }); }
        if (level >= 32 && ability === 'Arm\'s Length') { iconArray.push({ name: ability, size: 'small' }); }
      }
    });
  }
  nextActionOverlay.NEWsyncIcons({ iconArray, row: 'icon-c' });
};

nextActionOverlay.pldActionMatch = (actionMatch) => {
  const { removeIcon } = nextActionOverlay;
  const { addRecast } = nextActionOverlay;
  // const { checkRecast } = nextActionOverlay;
  const { addStatus } = nextActionOverlay;
  const { checkStatus } = nextActionOverlay;
  const { removeStatus } = nextActionOverlay;
  const { recast } = nextActionOverlay;
  const { duration } = nextActionOverlay;

  const { level } = nextActionOverlay.playerData;
  const { gcd } = nextActionOverlay;

  const { weaponskills } = nextActionOverlay.actionList;
  const { spells } = nextActionOverlay.actionList;
  const { abilities } = nextActionOverlay.actionList;

  const { actionName } = actionMatch.groups;
  const { comboCheck } = actionMatch.groups;

  const singletargetActions = [
    // Use these to switch to "single target mode"
    // Technically not always single target, but it gets too messy otherwise
    'Rage of Halone', 'Royal Authority', 'Holy Spirit',
  ];

  const multitargetActions = [
    'Total Eclipse', 'Prominence', 'Holy Circle', 'Confiteor', 'Circle Of Scorn', 'Reprisal',
  ];

  // Set probable target count
  if (singletargetActions.includes(actionName)) {
    nextActionOverlay.targetCount = 1;
  } else if (multitargetActions.includes(actionName) && actionMatch.groups.logType === '15') {
    // Multi target only hits single target
    nextActionOverlay.targetCount = 1;
  }

  // Remove action from overlay display
  removeIcon({ name: actionName });

  if (weaponskills.includes(actionName)) {
    // Combo
    if (comboCheck && ((level >= 4 && actionName === 'Fast Blade')
    || (level >= 26 && actionName === 'Riot Blade')
    || (level >= 40 && actionName === 'Total Eclipse'))) {
      addStatus({ statusName: 'Combo' });
      nextActionOverlay.comboStep = actionName;
    } else {
      removeStatus({ statusName: 'Combo' });
      nextActionOverlay.comboStep = '';
    }

    // Weaponskill-specific effects here
    if (actionName === 'Goring Blade') {
      addStatus({ statusName: 'Goring Blade', id: actionMatch.groups.targetID });
    } else if (actionName === 'Atonement') {
      nextActionOverlay.swordoathCount -= 1;
      if (nextActionOverlay.swordoathCount <= 0) {
        nextActionOverlay.swordoathCount = 0;
        removeStatus({ statusName: 'Sword Oath' });
      }
    } else if (level >= 76 && actionName === 'Royal Authority') {
      addStatus({ statusName: 'Sword Oath' });
      nextActionOverlay.swordoathCount = 3;
    }

    // Find next actions
    nextActionOverlay.pldNextAction({ delay: gcd });
  } else if (spells.includes(actionName)) {
    removeStatus({ statusName: 'Combo' });
    nextActionOverlay.comboStep = '';

    // Find next action (check for cast time)
    if (level >= 78 && checkStatus({ statusName: 'Requiescat' }) > 0) {
      nextActionOverlay.pldNextAction({ delay: gcd });
    } else {
      nextActionOverlay.pldNextAction({ delay: 0 });
    }
  } else if (abilities.includes(actionName)) {
    const propertyName = actionName.replace(/[\s':-]/g, '').toLowerCase();
    if (recast[propertyName]) { addRecast({ actionName }); }
    if (duration[propertyName]) { addStatus({ statusName: actionName }); }
  }
};

nextActionOverlay.pldStatusMatch = (statusMatch) => {
  const { statusName } = statusMatch.groups;
  const { addStatus } = nextActionOverlay;
  const { removeStatus } = nextActionOverlay;

  if (statusMatch.groups.logType === '1A') {
    addStatus({ statusName });
  } else { // 1E - loses status
    removeStatus({ statusName });
  }

  if (nextActionOverlay.statusList.mitigation.includes(statusName)) {
    nextActionOverlay.pldNextMitigation();
  }
};

nextActionOverlay.pldCastingMatch = (castingMatch) => {
  nextActionOverlay.comboStep = '';
  nextActionOverlay.removeStatus({ statusName: 'Combo' });
  nextActionOverlay.pldNextAction({ casting: castingMatch.groups.actionName });
  nextActionOverlay.NEWfadeIcon({ name: castingMatch.groups.actionName });
};

nextActionOverlay.pldCancelMatch = (cancelMatch) => {
  nextActionOverlay.NEWunfadeIcon({ name: cancelMatch.groups.actionName });
  nextActionOverlay.pldNextAction();
};
