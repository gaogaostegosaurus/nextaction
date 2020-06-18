
const gnbComboWeaponskills = [
  'Keen Edge', 'Brutal Shell', 'Solid Barrel',
  'Demon Slice', 'Demon Slaughter',
  'Lightning Shot',
];

const gnbCartridgeComboWeaponskills = [ /* Interrupted by regular combo */
  'Gnashing Fang', 'Savage Claw', 'Wicked Talon',
];

const gnbOtherWeaponskills = [ /* Don't interrupt any combos */
  'Sonic Break',
  'Burst Strike',
  'Fated Circle',
];

const gnbCooldowns = [
  'No Mercy',
  'Danger Zone', 'Blasting Zone',
  'Rough Divide',
  'Bow Shock',
  'Jugular Rip', 'Abdomen Tear', 'Eye Gouge',
  'Bloodfest',
];

actionList.GNB = [...new Set([
  ...gnbComboWeaponskills,
  ...gnbCartridgeComboWeaponskills,
  ...gnbOtherWeaponskills,
  ...gnbCooldowns,
])];

const gnbMultiTargetActions = [
  'Demon Slice', 'Demon Slaughter',
  'Fated Circle',
  'Bow Shock',
];

const gnbNextGCD = ({ /* All GNB GCDs are weaponskills so... */
  comboStatus,
  comboStep,
  cartridgecomboStatus,
  cartridgecomboStep,
  cartridges,
  nomercyStatus,
  nomercyRecast,
  sonicbreakRecast,
  gnashingfangRecast,
  bloodfestRecast,
} = {}) => {
  const burststrikePotency = 500;
  // const sonicbreakPotency = 300 + 90 * 10;
  const fatedcirclePotency = 320 * player.targetCount;

  let solidbarrelComboPotency = 200;
  if (player.level >= 26) {
    solidbarrelComboPotency = 300;
  } else if (player.level >= 4) {
    solidbarrelComboPotency = 250;
  }

  let demonslaughterComboPotency = 150 * player.targetCount; /* Combo average */
  if (player.level >= 40) {
    demonslaughterComboPotency = 200 * player.targetCount; /* Combo average */
  }

  let wickedtalonComboPotency = 550;
  if (player.level >= 70) {
    wickedtalonComboPotency = 550 + 280;
  }

  /* Don't drop cartridge combo */
  if (cartridgecomboStatus < player.gcd * 2) {
    if (cartridgecomboStep === 'Savage Claw') {
      return 'Wicked Talon';
    } else if (cartridgecomboStep === 'Gnashing Fang') {
      return 'Savage Claw';
    }
  }

  /* Don't drop combo */
  if (comboStatus < player.gcd * 2 && cartridgecomboStatus < 0) {
    if (player.level >= 40 && comboStep === 'Demon Slice') {
      return 'Demon Slaughter';
    } else if (player.level >= 26 && comboStep === 'Brutal Shell') {
      return 'Solid Barrel';
    } else if (player.level >= 4 && comboStep === 'Keen Edge') {
      return 'Brutal Shell';
    }
  }

  /* Highest priority GCDs, no cartridges needed */
  if (nomercyStatus > 0 && sonicbreakRecast < 0) {
    return 'Sonic Break';
  } else if (cartridgecomboStep === 'Savage Claw') {
    return 'Wicked Talon';
  } else if (cartridgecomboStep === 'Gnashing Fang') {
    return 'Savage Claw';
  }

  /* Start cartridge combo when able, unless just spamming AoE combo is better */
  /* No Mercy condition to prevent too much drift - delays by up to this many GCDs */
  if (player.level >= 60 && cartridges > 0 && wickedtalonComboPotency >= demonslaughterComboPotency
  && (nomercyStatus > 0 || nomercyRecast >= recast.gnashingfang * 0.20) && gnashingfangRecast < 0) {
    return 'Gnashing Fang';
  }

  /* Dump cartridges during No Mercy or if Bloodfest is coming up soon */
  if (cartridges > 0
  && (nomercyStatus > 0 || (player.level >= 76 && bloodfestRecast < player.gcd * cartridges))) {
    if (player.level >= 72 && fatedcirclePotency > burststrikePotency) {
      return 'Fated Circle';
    } else if (player.level >= 30 && burststrikePotency >= demonslaughterComboPotency) {
      return 'Burst Strike';
    }
  }

  /* Use a cartridge if about to overcap with combo */
  if (cartridges >= 2 && (comboStep === 'Brutal Shell' || comboStep === 'Demon Slice')) {
    if (player.level >= 72 && fatedcirclePotency > burststrikePotency) {
      return 'Fated Circle';
    } else if (player.level >= 30) {
      return 'Burst Strike';
    }
  }

  /* Combos */
  if (player.level >= 40 && demonslaughterComboPotency > solidbarrelComboPotency
  && comboStep === 'Demon Slice') {
    return 'Demon Slaughter';
  } else if (player.level >= 10 && demonslaughterComboPotency > solidbarrelComboPotency) {
    return 'Demon Slice';
  } else if (player.level >= 26 && comboStep === 'Brutal Shell') {
    return 'Solid Barrel';
  } else if (player.level >= 4 && comboStep === 'Keen Edge') {
    return 'Brutal Shell';
  } return 'Keen Edge'; /* Always returns Keen Edge if nothing else matches */
};

const gnbNextOGCD = ({
  gcdTime,
  cartridges,
  continuationStep,
  nomercyStatus,
  nomercyRecast,
  dangerzoneRecast,
  roughdivide1Recast,
  roughdivide2Recast,
  bowshockRecast,
  bloodfestRecast,
} = {}) => {
  const bowshockPotency = (200 + 90 * 5) * player.targetCount;

  let dangerzonePotency = 350;
  if (player.level >= 80) {
    dangerzonePotency = 800;
  }

  if (player.level >= 70 && continuationStep === 'Gnashing Fang') {
    return 'Jugular Rip';
  } else if (player.level >= 70 && continuationStep === 'Savage Claw') {
    return 'Abdomen Tear';
  } else if (player.level >= 70 && continuationStep === 'Wicked Talon') {
    return 'Eye Gouge';
  } else if (player.level >= 76 && cartridges <= 0 && bloodfestRecast < 0) {
    return 'Bloodfest';
  } else if (player.level >= 2 && gcdTime <= 1500 && nomercyRecast < 0) {
    return 'No Mercy'; /* gcdTime <= 1500 places it in second part of GCD */
  } else if (player.level >= 62 && nomercyStatus > 0 && bowshockPotency > dangerzonePotency
  && bowshockRecast < 0) {
    return 'Bow Shock'; /* Aligns with No Mercy */
  } else if (player.level >= 35 && (nomercyStatus > 0 || nomercyRecast >= recast.dangerzone * 0.20)
  && dangerzoneRecast < 0) {
    if (player.level >= 80) {
      return 'Blasting Zone';
    } return 'Danger Zone';
  } else if (player.level >= 62 && nomercyStatus > 0 && bowshockRecast < 0) {
    return 'Bow Shock'; /* Weaker than Blasting Zone but stronger than Danger Zone on one target */
  } else if (player.level >= 56 && nomercyStatus > 0 && gcdTime <= 1500 && roughdivide1Recast < 0) {
    return 'Rough Divide';
  } else if (player.level >= 56 && gcdTime <= 1500 && roughdivide2Recast < 0) {
    return 'Rough Divide';
  } return ''; /* Returns nothing if no OGCD matches */
};

const gnbNext = ({
  gcd = 0,
} = {}) => {
  let gcdTime = gcd;
  let nextTime = 0; /* Amount of time looked ahead in loop */
  let comboStep = player.comboStep;
  let cartridgecomboStep = player.cartridgecomboStep;
  let comboStatus = checkStatus({ name: 'Combo' });
  let cartridgecomboStatus = checkStatus({ name: 'Cartridge Combo' });
  let cartridges = player.cartridges;

  let nomercyStatus = checkStatus({ name: 'No Mercy' });
  let continuationStep = player.continuationStep; /* The memory is actually pretty useless so */

  let nomercyRecast = checkRecast({ name: 'No Mercy' }) - 500;
  let dangerzoneRecast = checkRecast({ name: 'Danger Zone' }) - 500;
  let sonicbreakRecast = checkRecast({ name: 'Sonic Break' }) - 500;
  let roughdivide1Recast = checkRecast({ name: 'Rough Divide 1' }) - 500;
  let roughdivide2Recast = checkRecast({ name: 'Rough Divide 2' }) - 500;
  let gnashingfangRecast = checkRecast({ name: 'Gnashing Fang' }) - 500;
  let bowshockRecast = checkRecast({ name: 'Bow Shock' }) - 500;
  let bloodfestRecast = checkRecast({ name: 'Bloodfest' }) - 500;

  const gnbArray = [];

  while (nextTime < 15000) { /* Outside loop for GCDs, looks ahead this number ms */
    if (gcdTime <= 1000) {
      continuationStep = ''; /* Looks like the Continuation buff is removed on any GCD */
      const nextGCD = gnbNextGCD({
        comboStatus,
        comboStep,
        cartridgecomboStatus,
        cartridgecomboStep,
        cartridges,
        nomercyStatus,
        nomercyRecast,
        sonicbreakRecast,
        gnashingfangRecast,
        bloodfestRecast,
      });

      gnbArray.push({ name: nextGCD });

      if (gnbComboWeaponskills.includes(nextGCD)) {
        cartridgecomboStatus = -1; /* Regular combo interrupts cartridge combo */
        cartridgecomboStep = '';

        if (player.level < 4
        || (player.level < 26 && nextGCD === 'Brutal Shell')
        || (player.level < 40 && nextGCD === 'Demon Slice')
        || nextGCD === 'Solid Barrel'
        || nextGCD === 'Demon Slaughter'
        || nextGCD === 'Lightning Shot') {
          /* Ends combo */
          comboStatus = -1;
          comboStep = '';
        } else {
          comboStatus = duration.combo;
          comboStep = nextGCD;
        }
      } else if (gnbCartridgeComboWeaponskills.includes(nextGCD)) {
        if (player.level >= 70) {
          continuationStep = nextGCD; /* Set for Continuation OGCD */
        }

        if (nextGCD === 'Wicked Talon') {
          cartridgecomboStatus = -1;
          cartridgecomboStep = '';
        } else {
          cartridgecomboStatus = duration.combo;
          cartridgecomboStep = nextGCD;
        }
      }

      /* Set recasts */
      if (nextGCD === 'Sonic Break') {
        sonicbreakRecast = recast.sonicbreak;
      } else if (nextGCD === 'Gnashing Fang') {
        gnashingfangRecast = recast.gnashingfang;
      }

      /* Adjust cartridges */
      if (nextGCD === 'Burst Strike' || nextGCD === 'Gnashing Fang' || nextGCD === 'Fated Circle') {
        cartridges -= 1;
      } else if (player.level >= 30
      && (nextGCD === 'Solid Barrel' || nextGCD === 'Demon Slaughter')) {
        cartridges += 1;
      }

      /* Just in case? */
      if (cartridges > 2) {
        cartridges = 2;
      } else if (cartridges < 0) {
        cartridges = 0;
      }

      /* All GNB GCDs are just the standard GCD, so no need to do more */
      gcdTime = player.gcd;
      nextTime += gcdTime;
    }

    while (gcdTime > 1000) {
      const nextOGCD = gnbNextOGCD({
        gcdTime,
        cartridges,
        continuationStep,
        nomercyStatus,
        nomercyRecast,
        dangerzoneRecast,
        roughdivide1Recast,
        roughdivide2Recast,
        bowshockRecast,
        bloodfestRecast,
      });

      if (nextOGCD) {
        gnbArray.push({ name: nextOGCD, size: 'small' });

        if (nextOGCD === 'No Mercy') {
          nomercyRecast = recast.nomercy;
          nomercyStatus = duration.nomercy + 1000; /* Extra buffer to assist with prediction */
        } else if (['Danger Zone', 'Blasting Zone'].includes(nextOGCD)) {
          dangerzoneRecast = recast.dangerzone;
        } else if (nextOGCD === 'Rough Divide') {
          roughdivide1Recast = roughdivide2Recast;
          roughdivide2Recast += recast.roughdivide;
        } else if (nextOGCD === 'Bow Shock') {
          bowshockRecast = recast.bowshock;
        } else if (['Jugular Rip', 'Abdomen Tear', 'Eye Gouge'].includes(nextOGCD)) {
          continuationStep = '';
        } else if (nextOGCD === 'Bloodfest') {
          bloodfestRecast = recast.bloodfest;
        }

        if (nextOGCD === 'Bloodfest') {
          cartridges = 2;
        }
      }

      gcdTime -= 1250;
    }

    comboStatus -= player.gcd; /* All GNB GCDs are just one standard GCD */
    cartridgecomboStatus -= player.gcd;
    nomercyStatus -= player.gcd;
    nomercyRecast -= player.gcd;
    dangerzoneRecast -= player.gcd;
    sonicbreakRecast -= player.gcd;
    roughdivide1Recast -= player.gcd;
    roughdivide2Recast -= player.gcd;
    gnashingfangRecast -= player.gcd;
    bowshockRecast -= player.gcd;
    bloodfestRecast -= player.gcd;
  }
  iconArrayB = gnbArray;
  syncIcons();
};

onAction.GNB = (actionMatch) => {
  const actionName = actionMatch.groups.actionName;
  removeIcon({ name: actionName });

  /* Set probable target count */
  if (gnbMultiTargetActions.includes(actionName) && actionMatch.groups.logType === '15') {
    /* Multi target only hits single target */
    player.targetCount = 1;
  } else if ((player.level >= 10 && actionName === 'Keen Edge')
    || (player.level >= 72 && actionName === 'Burst Strike')) {
    player.targetCount = 1;
  }

  if (gnbComboWeaponskills.includes(actionName)) {
    removeStatus({ name: 'Cartridge Combo' });
    player.cartridgecomboStep = '';

    if (player.level < 4
    || (player.level < 26 && actionName === 'Brutal Shell')
    || (player.level < 40 && actionName === 'Demon Slice')
    || actionName === 'Solid Barrel'
    || actionName === 'Demon Slaughter'
    || actionName === 'Lightning Shot') {
      /* All of the above end combo */
      removeStatus({ name: 'Combo' });
      player.comboStep = '';
    } else {
      addStatus({ name: 'Combo' });
      player.comboStep = actionName;
    }
  } else if (gnbCartridgeComboWeaponskills.includes(actionName)) {
    if (player.level >= 70) {
      player.continuationStep = actionName;
    }

    if (actionName === 'Wicked Talon') {
      removeStatus({ name: 'Cartridge Combo' });
      player.cartridgecomboStep = '';
    } else {
      addStatus({ name: 'Cartridge Combo' });
      player.cartridgecomboStep = actionName;
    }
  } else if (gnbOtherWeaponskills.includes(actionName)) {
    player.continuationStep = '';
  }

  /* Add recasts */
  if (['Sonic Break', 'Gnashing Fang'].includes(actionName)) {
    addRecast({ name: actionName });
  } else if (actionName === 'Rough Divide') {
    /* Catch Rough Divide since it has stacks and needs to be handled differently */
    addRecast({ name: 'Rough Divide 1', time: checkRecast({ name: 'Rough Divide 2' }) });
    addRecast({ name: 'Rough Divide 2', time: checkRecast({ name: 'Rough Divide 2' }) + recast.roughdivide });
  } else if (['Jugular Rip', 'Abdomen Tear', 'Eye Gouge'].includes(actionName)) {
    player.continuationStep = '';
  } else if (actionName === 'Blasting Zone') {
    addRecast({ name: 'Danger Zone' });
  } else if (gnbCooldowns.includes(actionName)) {
    /* All other cooldowns */
    addRecast({ name: actionName });
  }

  /* Add statuses */
  if (actionName === 'No Mercy') {
    addStatus({ name: 'No Mercy' });
  }

  /* Call next function */
  if (gnbComboWeaponskills.includes(actionName)
  || gnbCartridgeComboWeaponskills.includes(actionName)
  || gnbOtherWeaponskills.includes(actionName)) {
    gnbNext({ gcd: player.gcd });
  }
};

onJobChange.GNB = () => {
  gnbNext();
};

onTargetChanged.GNB = () => {
  // gnbNext();
};
