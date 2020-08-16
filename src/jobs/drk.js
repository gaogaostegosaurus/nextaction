nextActionOverlay.drkJobChange = () => {
  const { playerData } = nextActionOverlay;
  const { level } = playerData;

  nextActionOverlay.actionList.weaponskills = [
    'Hard Slash', 'Syphon Strike', 'Souleater',
    'Bloodspiller', 'Quietus',
  ];

  nextActionOverlay.actionList.spells = [
    'Unleash', 'Stalwart Soul',
    'Unmend',
  ];

  nextActionOverlay.actionList.abilities = [
    'Flood Of Darkness', 'Blood Weapon', 'Edge Of Darkness',
    'Salted Earth', 'Plunge', 'Abyssal Drain', 'Carve And Spit',
    'Delirium',
    'Flood Of Shadow', 'Edge Of Shadow', 'Living Shadow',
  ];

  nextActionOverlay.statusList.self = [
    'Blood Weapon', 'Delirium',
  ];

  nextActionOverlay.statusList.mitigation = [
    'Shadow Wall', 'Dark Mind', 'Living Dead', 'The Blackest Night',
    'Rampart', 'Reprisal', 'Arm\'s Length',
  ];

  const { recast } = nextActionOverlay;
  recast.floodofdarkness = 2000;
  recast.bloodweapon = 60000;
  recast.shadowwall = 120000;
  recast.edgeofdarkness = recast.floodofdarkness;
  recast.darkmind = 60000;
  recast.livingdead = 300000;
  recast.saltedearth = 90000;
  recast.plunge = 30000;
  recast.abyssaldrain = 60000;
  recast.carveandspit = 60000;
  recast.delirium = 90000;
  recast.theblackestnight = 15000;
  recast.floodofshadow = recast.floodofdarkness;
  recast.edgeofshadow = recast.floodofdarkness;
  recast.darkmissionary = 90000;
  recast.plunge1 = recast.plunge;
  recast.plunge2 = recast.plunge;
  recast.livingshadow = 120000;
  recast.plunge1 = recast.plunge;
  recast.plunge2 = recast.plunge;

  const { duration } = nextActionOverlay;

  duration.darkside = 30000;
  duration.bloodweapon = 10000;
  duration.shadowwall = 15000;
  duration.darkmind = 10000;
  duration.livingdead = 10000;
  duration.saltedearth = 15000;
  duration.delirium = 10000;
  duration.theblackestnight = 7000;
  duration.livingshadow = 120000;

  const { icon } = nextActionOverlay;

  icon.hardslash = '003051';
  icon.syphonstrike = '003054';
  icon.souleater = '003055';
  icon.carveandspit = '003058';
  icon.plunge = '003061';
  icon.unleash = '003063';
  icon.abyssaldrain = '003064';
  icon.saltedearth = '003066';
  icon.bloodweapon = '003071';
  icon.shadowwall = '003075';
  icon.delirium = '003078';
  icon.quietus = '003079';
  icon.bloodspiller = '003080';
  icon.theblackestnight = '003081';
  icon.floodofdarkness = '003082';
  icon.edgeofdarkness = '003083';
  icon.stalwartsoul = '003084';
  icon.floodofshadow = '003085';
  icon.edgeofshadow = '003086';
  icon.livingshadow = '003088';

  if (level >= 74) {
    icon.floodofdarkness = icon.floodofshadow;
    icon.edgeofdarkness = icon.edgeofshadow;
  }

  nextActionOverlay.tankRoleChange();
}; // Keep collapsed, usually

nextActionOverlay.drkPlayerChange = (e) => {
  const debugJobArray = e.detail.debugJob.split(' ');
  const { playerData } = nextActionOverlay;
  playerData.mp = e.detail.currentMP;
  playerData.blood = e.detail.jobDetail.blood;
  playerData.darkarts = parseInt(debugJobArray[4], 16);
  playerData.darkside = e.detail.jobDetail.darksideMilliseconds;
  if (playerData.darkside === 0) {
    playerData.darkside = -1;
  }
  nextActionOverlay.drkNextMitigation();
};

nextActionOverlay.drkNextGCD = ({
  comboStep,
  blood,
  darkarts,
  loopStatus,
} = {}) => {
  const { level } = nextActionOverlay.playerData;
  const { gcd } = nextActionOverlay;
  const { targetCount } = nextActionOverlay;

  let bloodCap = 50;
  if (level >= 80) { bloodCap = 100; }

  if (loopStatus.bloodweapon > 0) { bloodCap -= 10; }

  if ((level >= 2 && comboStep === 'Syphon Strike')
  || (level >= 72 && comboStep === 'Unleash')) {
    bloodCap -= 20;
  }

  // Check for Delirium
  if (loopStatus.delirium > 0) {
    if (targetCount >= 3) {
      return 'Quietus';
    } return 'Bloodspiller';
  }

  // Don't drop combo
  if (loopStatus.combo < gcd * 2) {
    if (level >= 72 && targetCount >= 2 && comboStep === 'Unleash') { return 'Stalwart Soul'; }
    if (level >= 26 && comboStep === 'Syphon Strike') { return 'Souleater'; }
    if (level >= 2 && comboStep === 'Hard Slash') { return 'Syphon Strike'; }
  }

  // Check for Dark Arts
  if (darkarts > 0) {
    if (targetCount >= 3) {
      return 'Quietus';
    } return 'Bloodspiller';
  }

  // Check for possible blood overcap
  if (blood >= 50 && blood > bloodCap) {
    if (level >= 64 && targetCount >= 3) { return 'Quietus'; } return 'Bloodspiller';
  }

  // Combos
  if (level >= 72 && targetCount >= 2 && comboStep === 'Unleash') {
    return 'Stalwart Soul';
  } if (level >= 26 && comboStep === 'Syphon Strike') {
    return 'Souleater';
  } if (level >= 2 && comboStep === 'Hard Slash') {
    return 'Syphon Strike';
  } if (targetCount >= 72 && targetCount >= 2) {
    return 'Unleash';
  } if (targetCount < 72 && targetCount >= 3) {
    return 'Unleash';
  } return 'Hard Slash';
};

nextActionOverlay.drkNextOGCD = ({
  gcdTime,
  mp,
  blood,
  loopRecast,
  loopStatus,
} = {}) => {
  const { level } = nextActionOverlay.playerData;
  const { gcd } = nextActionOverlay;
  const { targetCount } = nextActionOverlay;

  if (level >= 30 && targetCount >= 2 && mp >= 9000 && loopRecast.floodofdarkness < 0) {
    if (level >= 74) { return 'Flood Of Shadow'; } return 'Flood Of Darkness';
  } if (level >= 40 && mp >= 9000 && loopRecast.floodofdarkness < 0) {
    if (level >= 74) { return 'Edge Of Shadow'; } return 'Edge Of Darkness';
  } if (level >= 35 && gcdTime <= 1500 && loopRecast.bloodweapon < 0) {
    return 'Blood Weapon';
  } if (level >= 80 && blood >= 50 && loopRecast.livingshadow < 0) {
    return 'Living Shadow';
  } if (level >= 68 && gcdTime <= 1500 && (loopStatus.combo > gcd * 5 || loopStatus.combo < -1)
  && loopRecast.delirium < 0) {
    return 'Delirium';
  } if (level >= 52 && targetCount >= 2 && gcdTime >= 1500 && loopRecast.saltedearth < 0) {
    return 'Salted Earth';
  } if (level >= 60 && loopRecast.carveandspit < 0) {
    return 'Carve And Spit';
  } if (level >= 56 && targetCount >= 2 && loopRecast.abyssaldrain < 0) {
    return 'Abyssal Drain';
  } if (level >= 52 && gcdTime >= 1500 && loopRecast.saltedearth < 0) {
    return 'Salted Earth';
  } if (level >= 56 && loopRecast.abyssaldrain < 0) {
    return 'Abyssal Drain';
  } if (level >= 78 && gcdTime <= 1500 && loopRecast.plunge2 < 0) {
    return 'Plunge';
  } return ''; /* Returns nothing if no OGCD matches */
};

nextActionOverlay.drkNextAction = ({
  delay = 0, // Time to next GCD
} = {}) => {
  // Shorten objects and functions
  const { checkStatus } = nextActionOverlay;
  const { checkRecast } = nextActionOverlay;
  const { duration } = nextActionOverlay;
  const { recast } = nextActionOverlay;

  // "Snapshot" current character
  const { level } = nextActionOverlay.layerData;
  let { comboStep } = nextActionOverlay;
  let { mp } = nextActionOverlay.playerData;
  let { blood } = nextActionOverlay.playerData;
  let { darkarts } = nextActionOverlay.playerData;
  const { darkside } = nextActionOverlay.playerData;
  const { gcd } = nextActionOverlay;
  const { weaponskills } = nextActionOverlay.actionList;
  const { spells } = nextActionOverlay.actionList;

  const loopRecast = {};
  const loopRecastList = nextActionOverlay.actionList.abilities.concat(['Plunge 1', 'Plunge 2']);
  loopRecastList.forEach((actionName) => {
    const propertyName = actionName.replace(/[\s':-]/g, '').toLowerCase();
    loopRecast[propertyName] = checkRecast({ actionName }) - 1000;
  });

  const loopStatus = {};
  const loopStatusList = nextActionOverlay.statusList.self.concat(['Combo']);
  loopStatusList.forEach((statusName) => {
    const propertyName = statusName.replace(/[\s':-]/g, '').toLowerCase();
    loopStatus[propertyName] = checkStatus({ statusName });
  });
  loopStatus.darkside = darkside;

  const iconArray = [];

  let gcdTime = delay;
  let mpTick = 0;
  let nextTime = 0; // Amount of time looked ahead in loop
  const nextMaxTime = 15000;

  while (nextTime < nextMaxTime) { /* Outside loop for GCDs, looks ahead this number ms */
    let loopTime = 0;

    if (gcdTime <= 1000) {
      const nextGCD = nextActionOverlay.drkNextGCD({
        comboStep,
        mp,
        blood,
        darkarts,
        loopRecast,
        loopStatus,
      });

      iconArray.push({ name: nextGCD });

      if (weaponskills.includes(nextGCD)) {
        if ((level >= 4 && nextGCD === 'Hard Slash')
        || (level >= 26 && nextGCD === 'Syphon Strike')) {
          // Refresh combo
          comboStep = nextGCD;
          loopStatus.combo = duration.combo;
        } else if (['Bloodspiller', 'Quietus'].includes(nextGCD)) {
          // Do nothing
        } else {
          comboStep = '';
          loopStatus.combo = -1;
        }
      } else if (spells.includes(nextGCD)) {
        if (level >= 72 && nextGCD === 'Unleash') {
          // Refresh combo
          comboStep = nextGCD;
          loopStatus.combo = duration.combo;
        } else {
          comboStep = '';
          loopStatus.combo = -1;
        }
      }

      // MP stuff

      if (nextGCD === 'Syphon Strike') { mp += 600; } else if (nextGCD === 'Stalwart Soul') { mp += 600; }

      if (loopStatus.bloodweapon > 0) { mp += 600; }

      // Blood stuff

      if (level >= 62 && nextGCD === 'Souleater') { blood += 20; } else if (nextGCD === 'Stalwart Soul') { blood += 20; }

      if (loopStatus.bloodweapon > 0 && level >= 66) { blood += 10; }

      if (['Bloodspiller', 'Delirium'].includes(nextGCD)) {
        if (loopStatus.delirium > 0) {
          // Do nothing
        } else if (darkarts > 0) {
          darkarts = 0;
        } else {
          blood -= 50;
        }
      }

      // Fix MP/Blood
      if (mp > 10000) { mp = 10000; } else if (mp < 0) { mp = 0; }
      if (blood > 100) { blood = 100; } else if (blood < 0) { blood = 0; }

      if (spells.includes(nextGCD)) {
        gcdTime = 2500;
      } else {
        gcdTime = gcd;
      }

      loopTime = gcdTime;
    }

    while (gcdTime > 1000) {
      const nextOGCD = nextActionOverlay.drkNextOGCD({
        gcdTime,
        comboStep,
        mp,
        blood,
        loopRecast,
        loopStatus,
      });

      const actionLowercase = nextOGCD.replace(/[\s':-]/g, '').toLowerCase();
      if (nextOGCD) { iconArray.push({ name: nextOGCD, size: 'small' }); }
      if (recast[actionLowercase]) { loopRecast[actionLowercase] = recast[actionLowercase]; }
      if (duration[actionLowercase]) { loopStatus[actionLowercase] = duration[actionLowercase]; }

      // Special cases
      if (['Flood Of Darkness', 'Flood Of Shadow', 'Edge Of Darkness, Edge Of Shadow'].includes(nextOGCD)) {
        loopRecast.floodofdarkness = recast.floodofdarkness;
        loopRecast.floodofshadow = loopRecast.floodofdarkness;
        loopRecast.edgeofdarkness = loopRecast.floodofdarkness;
        loopRecast.edgeofshadow = loopRecast.floodofdarkness;
        mp -= 3000;
      } else if (nextOGCD === 'Blood Weapon') {
        loopStatus.bloodweapon += 1000; // To assist with prediction
      } else if (nextOGCD === 'Salted Earth') {
        gcdTime = 0;
      } else if (level >= 78 && nextOGCD === 'Plunge') {
        recast.plunge1 = recast.plunge2;
        recast.plunge2 += recast.plunge;
      } else if (nextOGCD === 'Carve And Spit') {
        mp += 600;
      } else if (nextOGCD === 'Delirium') {
        loopStatus.delirium += 1000;
      } else if (nextOGCD === 'Living Shadow') {
        blood -= 50;
      }

      // Fix MP/Blood
      if (mp > 10000) { mp = 10000; } else if (mp < 0) { mp = 0; }
      if (blood > 100) { blood = 100; } else if (blood < 0) { blood = 0; }

      gcdTime -= 1000;
    }

    Object.keys(loopRecast).forEach((property) => { loopRecast[property] -= loopTime; });
    Object.keys(loopStatus).forEach((property) => { loopStatus[property] -= loopTime; });

    if (Math.floor(nextTime / 3000) > mpTick) {
      mp += 200;
      mpTick += 1;
    }

    // Fix MP/Blood
    if (mp > 10000) { mp = 10000; } else if (mp < 0) { mp = 0; }
    if (blood > 100) { blood = 100; } else if (blood < 0) { blood = 0; }

    gcdTime = 0;

    nextTime += loopTime;
  }

  nextActionOverlay.NEWsyncIcons({ iconArray, row: 'icon-b' });
};

nextActionOverlay.drkOnAction = (actionMatch) => {
  removeIcon({ name: actionMatch.groups.actionName });

  /* Set probable target count */
  // if (drkMultiTarget.includes(actionMatch.groups.actionName)) {
  //   targetCount = 2;
  // } else if (drkSingleTarget.includes(actionMatch.groups.actionName)) {
  //   targetCount = 1;
  // }

  if (drkComboActions.includes(actionMatch.groups.actionName)) {
    const gcdAction = actionMatch.groups.actionName;
    if (level < 4
    || (level < 26 && gcdAction === 'Syphon Strike')
    || (level < 72 && gcdAction === 'Unleash')
    || gcdAction === 'Souleater'
    || gcdAction === 'Unmend') {
      /* All of the above end combo */
      removeStatus({ name: 'Combo' });
      player.comboStep = '';
    } else {
      addStatus({ name: 'Combo' });
      player.comboStep = actionMatch.groups.actionName;
    }
  } else if (actionMatch.groups.actionName === 'Plunge') {
    /* Catch Plunge since it has stacks and needs to be handled differently */
    addRecast({ name: 'Plunge 1', time: checkRecast({ name: 'Plunge 2' }) });
    addRecast({ name: 'Plunge 2', time: checkRecast({ name: 'Plunge 2' }) + recast.plunge });
  } else if (drkCooldowns.includes(actionMatch.groups.actionName)) {
    /* All other cooldowns */
    addRecast({ name: actionMatch.groups.actionName });
  }

  /* Add statuses */
  if (['Blood Weapon', 'Delirium'].includes(actionMatch.groups.actionName)) {
    addStatus({ name: actionMatch.groups.actionName });
  }

  /* Call next function */
  if (drkSpells.includes(actionMatch.groups.actionName)) {
    drkNext({ gcdTime: 2500 });
  } else if (drkComboActions.includes(actionMatch.groups.actionName)
  || drkBloodWeaponskills.includes(actionMatch.groups.actionName)) {
    drkNext({ gcdTime: gcd });
  }
};

onJobChanged.DRK = () => {
  drkNext();
};

onTargetChanged.DRK = () => {
  // drkNext();
};
