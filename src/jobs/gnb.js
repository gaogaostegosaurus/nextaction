nextActionOverlay.onJobChange.GNB = () => {
  // const { playerData } = nextActionOverlay;

  nextActionOverlay.actionList.comboweaponskills = [
    'Keen Edge', 'Brutal Shell', 'Solid Barrel',
    'Demon Slice', 'Demon Slaughter',
    'Lightning Shot',
  ];

  nextActionOverlay.actionList.cartridgecomboweaponskills = [
    'Gnashing Fang', 'Savage Claw', 'Wicked Talon',
  ];

  nextActionOverlay.actionList.otherweaponskills = [
    'Sonic Break', 'Burst Strike', 'Fated Circle',
  ];

  nextActionOverlay.actionList.abilities = [
    'No Mercy',
    'Danger Zone', 'Blasting Zone',
    'Rough Divide',
    'Bow Shock',
    'Jugular Rip', 'Abdomen Tear', 'Eye Gouge',
    'Bloodfest',
  ];

  nextActionOverlay.statusList = [
    //
  ];

  const { recast } = nextActionOverlay;
  recast.nomercy = 60000;
  recast.dangerzone = 30000;
  recast.roughdivide = 30000;
  recast.roughdivide1 = recast.roughdivide;
  recast.roughdivide2 = recast.roughdivide;
  recast.bowshock = 60000;
  recast.continuation = 1000;
  recast.bloodfest = 90000;
  recast.gnashingfang = 30000;
  recast.sonicbreak = 60000;

  const { duration } = nextActionOverlay;
  duration.nomercy = 20000;
  duration.continuation = 10000;
  duration.readytorip = duration.continuation;
  duration.readytotear = duration.continuation;
  duration.readytogouge = duration.continuation;

  const { icon } = nextActionOverlay;
  icon.keenedge = '003401';
  icon.nomercy = '003402';
  icon.brutalshell = '003403';
  icon.camouflage = '003404';
  icon.demonslice = '003405';
  icon.royalguard = '003406';
  icon.lightningshot = '003407';
  icon.dangerzone = '003408';
  icon.solidbarrel = '003409';
  icon.gnashingfang = '003410';
  icon.savageclaw = '003411';
  icon.nebula = '003412';
  icon.demonslaughter = '003413';
  icon.wickedtalon = '003414';
  icon.aurora = '003415';
  icon.superbolide = '003416';
  icon.sonicbreak = '003417';
  icon.roughdivide = '003418';
  icon.continuation = '003419';
  icon.jugularrip = '003420';
  icon.abdomentear = '003421';
  icon.eyegouge = '003422';
  icon.bowshock = '003423';
  icon.heartoflight = '003424';
  icon.heartofstone = '003425';
  icon.burststrike = '003426';
  icon.fatedcircle = '003427';
  icon.bloodfest = '003428';
  icon.blastingzone = '003429';
}; /* Keep collapsed, usually */

nextActionOverlay.onPlayerChangedEvent.GNB = (e) => {
  const { playerData } = nextActionOverlay;
  playerData.cartridges = e.detail.jobDetail.cartridges;
  // playerData.cartridges = parseInt(debugJobArray[0], 16); /* 0-2 */
};

nextActionOverlay.nextAction.GNB = ({
  delay = 0,
} = {}) => {
  const nextAction = nextActionOverlay.nextAction.GNB;
  const { checkStatus } = nextActionOverlay;
  const { checkRecast } = nextActionOverlay;
  const { duration } = nextActionOverlay;
  const { recast } = nextActionOverlay;

  const { playerData } = nextActionOverlay;
  const { level } = playerData;
  const { gcd } = playerData;
  let { comboStep } = playerData;
  let { cartridgecomboStep } = playerData;
  let { cartridges } = playerData;
  // let { continuationStep } = playerData; /* The memory is actually pretty useless so */

  const { comboweaponskills } = nextActionOverlay.actionList;
  const { cartridgecomboweaponskills } = nextActionOverlay.actionList;
  // const { otherweaponskills } = nextActionOverlay.actionList;

  const loopRecast = {};
  const loopRecastList = [
    'No Mercy', 'Danger Zone', 'Sonic Break', 'Rough Divide 1', 'Rough Divide 2', 'Gnashing Fang', 'Bow Shock',
    'Bloodfest'];
  loopRecastList.forEach((actionName) => {
    const propertyName = actionName.replace(/[\s':-]/g, '').toLowerCase();
    loopRecast[propertyName] = checkRecast({ actionName }) - 1000;
  });

  const loopStatus = {};
  const loopStatusList = ['Combo', 'No Mercy', 'Ready To Rip', 'Ready To Tear', 'Ready To Gouge'];
  loopStatusList.forEach((statusName) => {
    const propertyName = statusName.replace(/[\s':-]/g, '').toLowerCase();
    loopStatus[propertyName] = checkStatus({ statusName });
  });

  loopStatus.combo = checkStatus({ statusName: 'Combo' });
  loopStatus.cartridgecombo = checkStatus({ statusName: 'Cartridge Combo' });

  const gnbArray = [];

  let gcdTime = delay;
  let nextTime = 0; /* Amount of time looked ahead in loop */
  const nextMaxTime = 15000;

  while (nextTime < nextMaxTime) { /* Outside loop for GCDs, looks ahead this number ms */
    let loopTime = 0; /* Time elapsed for one loop */

    if (gcdTime <= 1000) {
      const nextGCD = nextAction.gcd({
        comboStep,
        cartridgecomboStep,
        cartridges,
        loopRecast,
        loopStatus,
      });

      gnbArray.push({ name: nextGCD });

      loopStatus.readytorip = -1; /* It appears that any GCD removes Continuation buff */
      loopStatus.readytotear = -1;
      loopStatus.readytogouge = -1;

      if (comboweaponskills.includes(nextGCD)) {
        loopStatus.cartridgecombo = -1; /* Regular combo interrupts cartridge combo */
        cartridgecomboStep = '';

        if ((level >= 4 && nextGCD === 'Keen Edge')
        || (level >= 26 && nextGCD === 'Brutal Shell')
        || (level >= 40 && nextGCD === 'Demon Slice')) {
          loopStatus.combo = duration.combo;
          comboStep = nextGCD;
        } else {
          loopStatus.combo = -1;
          comboStep = '';
        }
      } else if (cartridgecomboweaponskills.includes(nextGCD)) {
        if (level >= 70) {
          if (nextGCD === 'Gnashing Fang') {
            loopStatus.readytorip = duration.continuation;
          } else if (nextGCD === 'Savage Claw') {
            loopStatus.readytotear = duration.continuation;
          } else if (nextGCD === 'Wicked Talon') {
            loopStatus.readytogouge = duration.continuation;
          }
        }

        if (nextGCD !== 'Wicked Talon') {
          loopStatus.cartridgecombo = duration.combo;
          cartridgecomboStep = nextGCD;
        } else {
          loopStatus.cartridgecombo = -1;
          cartridgecomboStep = '';
        }
      }

      /* Set recasts */
      if (nextGCD === 'Sonic Break') {
        loopRecast.sonicbreak = recast.sonicbreak;
      } else if (nextGCD === 'Gnashing Fang') {
        loopRecast.gnashingfang = recast.gnashingfang;
      }

      /* Adjust cartridges */
      if (nextGCD === 'Burst Strike' || nextGCD === 'Gnashing Fang' || nextGCD === 'Fated Circle') {
        cartridges -= 1;
      } else if ((level >= 30 && nextGCD === 'Solid Barrel')
      || nextGCD === 'Demon Slaughter') {
        cartridges += 1;
      }

      /* Just in case? */
      if (cartridges > 2) {
        cartridges = 2;
      } else if (cartridges < 0) {
        cartridges = 0;
      }

      /* All GNB GCDs are just the standard GCD, so no need to do more */
      gcdTime = gcd;
      loopTime = gcdTime;
    }

    while (gcdTime > 1000) {
      const nextOGCD = nextAction.ogcd({
        gcdTime,
        cartridges,
        loopRecast,
        loopStatus,
      });

      if (nextOGCD) {
        gnbArray.push({ name: nextOGCD, size: 'small' });

        if (nextOGCD === 'No Mercy') {
          loopRecast.nomercy = recast.nomercy;
          loopStatus.nomercy = duration.nomercy + 1000; /* Extra buffer to assist with prediction */
        } else if (['Danger Zone', 'Blasting Zone'].includes(nextOGCD)) {
          loopRecast.dangerzone = recast.dangerzone;
        } else if (nextOGCD === 'Rough Divide') {
          loopRecast.roughdivide1 = loopRecast.roughdivide2;
          loopRecast.roughdivide2 += recast.roughdivide;
        } else if (nextOGCD === 'Bow Shock') {
          loopRecast.bowshock = recast.bowshock;
        } else if (['Jugular Rip', 'Abdomen Tear', 'Eye Gouge'].includes(nextOGCD)) {
          loopStatus.readytorip = -1; /* It appears that any GCD removes Continuation buff */
          loopStatus.readytotear = -1;
          loopStatus.readytogouge = -1;
        } else if (nextOGCD === 'Bloodfest') {
          loopRecast.bloodfest = recast.bloodfest;
        }

        if (nextOGCD === 'Bloodfest') {
          cartridges = 2;
        }
      }
      gcdTime -= 1250;
    }

    Object.keys(loopRecast).forEach((property) => { loopRecast[property] -= loopTime; });
    Object.keys(loopStatus).forEach((property) => { loopStatus[property] -= loopTime; });
    nextTime += loopTime;
  }
  nextActionOverlay.iconArrayB = gnbArray;
  nextActionOverlay.syncIcons();
};

nextActionOverlay.nextAction.GNB.gcd = ({ /* All GNB GCDs are weaponskills so... */
  comboStep,
  cartridgecomboStep,
  cartridges,
  loopRecast,
  loopStatus,
} = {}) => {
  const { playerData } = nextActionOverlay;
  const { level } = playerData;
  const { gcd } = playerData;
  const { targetCount } = playerData;
  const { recast } = nextActionOverlay;

  const burststrikePotency = 500;
  // const sonicbreakPotency = 300 + 90 * 10;
  const fatedcirclePotency = 320 * targetCount;

  let solidbarrelComboPotency = 200;
  if (level >= 26) {
    solidbarrelComboPotency = 300;
  } else if (level >= 4) {
    solidbarrelComboPotency = 250;
  }

  let demonslaughterComboPotency = 150 * targetCount; /* Combo average */
  if (level >= 40) {
    demonslaughterComboPotency = 200 * targetCount; /* Combo average */
  }

  let wickedtalonComboPotency = 550;
  if (level >= 70) {
    wickedtalonComboPotency = 550 + 280;
  }

  /* Don't drop cartridge combo */
  if (loopStatus.cartridgecombo < gcd * 2) {
    if (cartridgecomboStep === 'Savage Claw') {
      return 'Wicked Talon';
    } if (cartridgecomboStep === 'Gnashing Fang') {
      return 'Savage Claw';
    }
  }

  /* Don't drop combo */
  if (loopStatus.combo < gcd * 2 && loopStatus.cartridgecombo < 0) {
    if (level >= 40 && comboStep === 'Demon Slice') {
      return 'Demon Slaughter';
    } if (level >= 26 && comboStep === 'Brutal Shell') {
      return 'Solid Barrel';
    } if (level >= 4 && comboStep === 'Keen Edge') {
      return 'Brutal Shell';
    }
  }

  /* Highest priority GCDs, no cartridges needed */
  if (level >= 54 && loopStatus.nomercy > 0 && loopRecast.sonicbreak < 0) {
    return 'Sonic Break';
  } if (cartridgecomboStep === 'Savage Claw') {
    return 'Wicked Talon';
  } if (cartridgecomboStep === 'Gnashing Fang') {
    return 'Savage Claw';
  }

  /* Start cartridge combo when able, unless just spamming AoE combo is better */
  /* No Mercy condition to prevent too much drift - delays by up to this many GCDs */
  if (level >= 60 && cartridges > 0 && wickedtalonComboPotency >= demonslaughterComboPotency
  && (loopStatus.nomercy > 0 || loopRecast.nomercy >= recast.gnashingfang * 0.20)
  && loopRecast.gnashingfang < 0) {
    return 'Gnashing Fang';
  }

  /* Dump cartridges during No Mercy or if Bloodfest is coming up soon */
  if (cartridges > 0
  && (loopStatus.nomercy > 0 || (level >= 76 && loopRecast.bloodfest < gcd * cartridges))) {
    if (level >= 72 && fatedcirclePotency > burststrikePotency) {
      return 'Fated Circle';
    } if (level >= 30 && burststrikePotency >= demonslaughterComboPotency) {
      return 'Burst Strike';
    }
  }

  /* Use a cartridge if about to overcap with combo */
  if (cartridges >= 2 && (comboStep === 'Brutal Shell' || comboStep === 'Demon Slice')) {
    if (level >= 72 && fatedcirclePotency > burststrikePotency) {
      return 'Fated Circle';
    } if (level >= 30) {
      return 'Burst Strike';
    }
  }

  /* Combos */
  if (level >= 40 && demonslaughterComboPotency > solidbarrelComboPotency
  && comboStep === 'Demon Slice') {
    return 'Demon Slaughter';
  } if (level >= 10 && demonslaughterComboPotency > solidbarrelComboPotency) {
    return 'Demon Slice';
  } if (level >= 26 && comboStep === 'Brutal Shell') {
    return 'Solid Barrel';
  } if (level >= 4 && comboStep === 'Keen Edge') {
    return 'Brutal Shell';
  } return 'Keen Edge'; /* Always returns Keen Edge if nothing else matches */
};

nextActionOverlay.nextAction.GNB.ogcd = ({
  gcdTime,
  cartridges,
  loopRecast,
  loopStatus,
} = {}) => {
  const { playerData } = nextActionOverlay;
  const { level } = playerData;
  const { targetCount } = playerData;
  const { recast } = nextActionOverlay;
  const bowshockPotency = (200 + 90 * 5) * targetCount;

  let dangerzonePotency = 350;
  if (level >= 80) {
    dangerzonePotency = 800;
  }

  if (level >= 70 && loopStatus.readytorip > 0) {
    return 'Jugular Rip';
  } if (level >= 70 && loopStatus.readytotear > 0) {
    return 'Abdomen Tear';
  } if (level >= 70 && loopStatus.readytogouge > 0) {
    return 'Eye Gouge';
  } if (level >= 76 && cartridges <= 0 && loopRecast.bloodfest < 0) {
    return 'Bloodfest';
  } if (level >= 2 && gcdTime <= 1500 && loopRecast.nomercy < 0) {
    return 'No Mercy'; /* gcdTime <= 1500 places it in second part of GCD */
  } if (level >= 62 && loopStatus.nomercy > 0 && bowshockPotency > dangerzonePotency
  && loopRecast.bowshock < 0) {
    return 'Bow Shock'; /* Aligns with No Mercy */
  } if (level >= 35 && (loopStatus.nomercy > 0 || loopRecast.nomercy >= recast.dangerzone * 0.20)
  && loopRecast.dangerzone < 0) {
    if (level >= 80) {
      return 'Blasting Zone';
    } return 'Danger Zone';
  } if (level >= 62 && loopStatus.nomercy > 0 && loopRecast.bowshock < 0) {
    return 'Bow Shock'; /* Weaker than Blasting Zone but stronger than Danger Zone on one target */
  } if (level >= 56 && loopStatus.nomercy > 0 && gcdTime <= 1500 && loopRecast.roughdivide1 < 0) {
    return 'Rough Divide';
  } if (level >= 56 && gcdTime <= 1500 && loopRecast.roughdivide2 < 0) {
    return 'Rough Divide';
  } return ''; /* Returns nothing if no OGCD matches */
};

nextActionOverlay.onAction.GNB = (actionMatch) => {
  const { removeIcon } = nextActionOverlay;
  const { addRecast } = nextActionOverlay;
  const { checkRecast } = nextActionOverlay;
  const { addStatus } = nextActionOverlay;
  // const { checkStatus } = nextActionOverlay;
  const { removeStatus } = nextActionOverlay;
  const nextAction = nextActionOverlay.nextAction.GNB;

  const { recast } = nextActionOverlay;
  // const { duration } = nextActionOverlay;

  const { playerData } = nextActionOverlay;
  const { level } = playerData;
  const { gcd } = playerData;

  const { actionList } = nextActionOverlay;
  const { comboweaponskills } = actionList;
  const { cartridgecomboweaponskills } = actionList;
  const { otherweaponskills } = actionList;
  const { abilities } = actionList;

  const { actionName } = actionMatch.groups;
  removeIcon({ name: actionName });

  const multitargetActions = ['Demon Slice', 'Demon Slaughter', 'Fated Circle', 'Bow Shock'];

  /* Set probable target count */
  if (playerData.targetCount > 1) {
    if (multitargetActions.includes(actionName) && actionMatch.groups.logType === '15') {
      /* Multi target only hits single target */
      playerData.targetCount = 1;
    } else if ((level >= 10 && actionName === 'Keen Edge')
      || (level >= 72 && actionName === 'Burst Strike')) {
      playerData.targetCount = 1;
    }
  }

  if (comboweaponskills.includes(actionName)) {
    removeStatus({ statusName: 'Cartridge Combo' });
    playerData.cartridgecomboStep = '';

    removeStatus({ statusName: 'Ready To Rip' });
    removeStatus({ statusName: 'Ready To Tear' });
    removeStatus({ statusName: 'Ready To Gouge' });

    if ((level >= 4 && actionName === 'Keen Edge')
    || (level >= 26 && actionName === 'Brutal Shell')
    || (level >= 40 && actionName === 'Demon Slice')) {
      addStatus({ statusName: 'Combo' });
      playerData.comboStep = actionName;
    } else {
      removeStatus({ statusName: 'Combo' });
      playerData.comboStep = '';
    }
  } else if (cartridgecomboweaponskills.includes(actionName)) {
    removeStatus({ statusName: 'Ready To Rip' });
    removeStatus({ statusName: 'Ready To Tear' });
    removeStatus({ statusName: 'Ready To Gouge' });

    if (level >= 70) {
      if (actionName === 'Gnashing Fang') {
        addStatus({ statusName: 'Ready To Rip' });
      } else if (actionName === 'Savage Claw') {
        addStatus({ statusName: 'Ready To Tear' });
      } else if (actionName === 'Wicked Talon') {
        addStatus({ statusName: 'Ready To Gouge' });
      }
    }

    if (actionName !== 'Wicked Talon') {
      addStatus({ statusName: 'Cartridge Combo' });
      playerData.cartridgecomboStep = actionName;
    } else {
      removeStatus({ statusName: 'Cartridge Combo' });
      playerData.cartridgecomboStep = '';
    }
  } else if (otherweaponskills.includes(actionName)) {
    removeStatus({ statusName: 'Ready To Rip' });
    removeStatus({ statusName: 'Ready To Tear' });
    removeStatus({ statusName: 'Ready To Gouge' });
  }

  /* Add recasts */
  if (['Sonic Break', 'Gnashing Fang'].includes(actionName)) {
    addRecast({ actionName });
  } else if (actionName === 'Rough Divide') {
    /* Catch Rough Divide since it has stacks and needs to be handled differently */
    addRecast({ actionName: 'Rough Divide 1', time: checkRecast({ actionName: 'Rough Divide 2' }) });
    addRecast({ actionName: 'Rough Divide 2', time: checkRecast({ actionName: 'Rough Divide 2' }) + recast.roughdivide });
  } else if (actionName === 'Blasting Zone') {
    addRecast({ actionName: 'Danger Zone' });
  } else if (abilities.includes(actionName)) {
    /* All other cooldowns */
    addRecast({ actionName });
  }

  /* Add statuses */
  if (actionName === 'No Mercy') {
    addStatus({ statusName: 'No Mercy' });
  }

  /* Call next function */
  if (comboweaponskills.includes(actionName)
  || cartridgecomboweaponskills.includes(actionName)
  || otherweaponskills.includes(actionName)) {
    nextAction({ delay: gcd });
  }
};

nextActionOverlay.onTargetChange.GNB = () => {
  // nextAction();
};
