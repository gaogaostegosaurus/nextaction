
const gnbWeaponskills = [
  'Keen Edge', 'Brutal Shell', 'Solid Barrel',
  'Demon Slice', 'Demon Slaughter',
  'Lightning Shot',
];

const gnbCartridgeWeaponskills = [ /* Interrupted by regular combo */
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

const gnbMultiTarget = [
  'Demon Slice', 'Demon Slaughter',
  'Fated Circle',
];

const gnbSingleTarget = [
  'Keen Edge', 'Brutal Shell', 'Solid Barrel',
];

actionList.GNB = [...new Set([
  ...gnbWeaponskills,
  ...gnbCartridgeWeaponskills,
  ...gnbOtherWeaponskills,
  ...gnbCooldowns,
])];

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
  /* Don't drop cartridge combo */
  if (cartridgecomboStatus < player.gcd * 2) {
    if (cartridgecomboStep === 'Savage Claw') {
      return 'Wicked Talon';
    } else if (cartridgecomboStep === 'Gnashing Fang') {
      return 'Savage Claw';
    }
  }

  /* Don't drop combo */
  if (comboStatus < player.gcd * 2) {
    if (player.level >= 40 && player.targetCount >= 2 && comboStep === 'Demon Slice') {
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

  /* Highest priority if a cartridge is available */
  if (player.level >= 72 && cartridges > 0 && player.targetCount >= 4) { /* For future use, maybe */
    return 'Fated Circle'; /* Spam at high enemy counts */
  } else if (player.level >= 60 && cartridges > 0 && nomercyRecast > player.gcd * 2
  && gnashingfangRecast < 0) {
    /* No Mercy condition to prevent too much drift - delays by up to this many GCDs */
    return 'Gnashing Fang';
  }

  /* Dump cartridges during No Mercy or if Bloodfest is coming up soon */
  if ((cartridges > 0 && (nomercyStatus > 0 || bloodfestRecast < player.gcd * cartridges))) {
    if (player.level >= 72 && player.targetCount >= 2) {
      return 'Fated Circle';
    } else if (player.level >= 30) {
      return 'Burst Strike';
    }
  }

  /* Use a cartridge if about to overcap with combo */
  if (cartridges >= 2 && (comboStep === 'Brutal Shell' || comboStep === 'Demon Slice')) {
    if (player.level >= 72 && player.targetCount >= 2) {
      return 'Fated Circle';
    } else if (player.level >= 30) {
      return 'Burst Strike';
    }
  }

  /* Combos */
  if (player.level >= 40 && player.targetCount >= 2 && comboStep === 'Demon Slice') {
    return 'Demon Slaughter';
  } else if (player.level >= 10 && player.targetCount >= 2) {
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
  } else if (player.level >= 62 && player.targetCount >= 2 && nomercyStatus > 0
  && bowshockRecast < 0) {
    return 'Bow Shock'; /* Aligns with No Mercy */
  } else if (player.level >= 80 && dangerzoneRecast < 0) {
    return 'Blasting Zone';
  } else if (player.level >= 62 && nomercyStatus > 0 && bowshockRecast < 0) {
    return 'Bow Shock'; /* Weaker than Blasting Zone but stronger than Danger Zone on one target */
  } else if (player.level >= 18 && dangerzoneRecast < 0) {
    return 'Danger Zone';
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

      if (gnbWeaponskills.includes(nextGCD)) {
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
      } else if (gnbCartridgeWeaponskills.includes(nextGCD)) {
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
  removeIcon({ name: actionMatch.groups.actionName });

  /* Set probable target count */
  if (gnbMultiTarget.includes(actionMatch.groups.actionName)) {
    player.targetCount = 2;
  } else if (gnbSingleTarget.includes(actionMatch.groups.actionName)) {
    player.targetCount = 1;
  } else if (player.level >= 72 && actionMatch.groups.actionName === 'Burst Strike') {
    /* Burst Strike will only be used on one target after getting Fated Circle */
    player.targetCount = 1;
  }

  if (gnbWeaponskills.includes(actionMatch.groups.actionName)) {
    removeStatus({ name: 'Cartridge Combo' });
    player.cartridgecomboStep = '';

    if (player.level < 4
    || (player.level < 26 && actionMatch.groups.actionName === 'Brutal Shell')
    || (player.level < 40 && actionMatch.groups.actionName === 'Demon Slice')
    || actionMatch.groups.actionName === 'Solid Barrel'
    || actionMatch.groups.actionName === 'Demon Slaughter'
    || actionMatch.groups.actionName === 'Lightning Shot') {
      /* All of the above end combo */
      removeStatus({ name: 'Combo' });
      player.comboStep = '';
    } else {
      addStatus({ name: 'Combo' });
      player.comboStep = actionMatch.groups.actionName;
    }
  } else if (gnbCartridgeWeaponskills.includes(actionMatch.groups.actionName)) {
    if (player.level >= 70) {
      player.continuationStep = actionMatch.groups.actionName;
    }

    if (actionMatch.groups.actionName === 'Wicked Talon') {
      removeStatus({ name: 'Cartridge Combo' });
      player.cartridgecomboStep = '';
    } else {
      addStatus({ name: 'Cartridge Combo' });
      player.cartridgecomboStep = actionMatch.groups.actionName;
    }
  } else if (gnbOtherWeaponskills.includes(actionMatch.groups.actionName)) {
    player.continuationStep = '';
  }

  /* Add recasts */
  if (['Sonic Break', 'Gnashing Fang'].includes(actionMatch.groups.actionName)) {
    addRecast({ name: actionMatch.groups.actionName });
  } else if (actionMatch.groups.actionName === 'Rough Divide') {
    /* Catch Rough Divide since it has stacks and needs to be handled differently */
    addRecast({ name: 'Rough Divide 1', time: checkRecast({ name: 'Rough Divide 2' }) });
    addRecast({ name: 'Rough Divide 2', time: checkRecast({ name: 'Rough Divide 2' }) + recast.roughdivide });
  } else if (['Jugular Rip', 'Abdomen Tear', 'Eye Gouge'].includes(actionMatch.groups.actionName)) {
    player.continuationStep = '';
  } else if (actionMatch.groups.actionName === 'Blasting Zone') {
    addRecast({ name: 'Danger Zone' });
  } else if (gnbCooldowns.includes(actionMatch.groups.actionName)) {
    /* All other cooldowns */
    addRecast({ name: actionMatch.groups.actionName });
  }

  /* Add statuses */
  if (actionMatch.groups.actionName === 'No Mercy') {
    addStatus({ name: 'No Mercy' });
  }

  /* Call next function */
  if (gnbWeaponskills.includes(actionMatch.groups.actionName)
  || gnbCartridgeWeaponskills.includes(actionMatch.groups.actionName)
  || gnbOtherWeaponskills.includes(actionMatch.groups.actionName)) {
    gnbNext({ gcd: player.gcd });
  }
};

onJobChange.GNB = () => {
  gnbNext();
};

onTargetChanged.GNB = () => {
  // gnbNext();
};
