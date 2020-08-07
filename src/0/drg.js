nextActionOverlay.drgJobChange = () => {
  const { level } = nextActionOverlay.playerData;

  // Set initial values
  nextActionOverlay.comboStep = '';

  nextActionOverlay.actionList.weaponskills = [
    'True Thrust',
    'Vorpal Thrust',
    'Piercing Talon',
    'Disembowel',
    'Full Thrust',
    'Chaos Thrust',
    'Doom Spike',
    'Fang And Claw',
    'Wheeling Thrust',
    'Coerthan Torment',
    'Raiden Thrust',
  ];

  nextActionOverlay.actionList.abilities = [
    'Life Surge',
    'Lance Charge',
    'Jump',
    'Elusive Jump',
    'Spineshatter Dive',
    'Dragonfire Dive',
    'Battle Litany',
    'Blood Of The Dragon',
    'Geirskogul',
    'Dragon Sight',
    'Mirage Dive',
    'High Jump',
    'Stardiver',
    'Nastrod',
  ];

  // Easier/more accurate controlling this via the buffs
  // I think that means it won't work in Eureka but screw Eureka

  nextActionOverlay.statusList.self = [
    'Life Surge',
    'Disembowel',
    'Lance Charge',
    'Battle Litany',
    'Dragon Sight',
    'Raiden Thrust Ready',
  ];

  nextActionOverlay.statusList.target = ['Chaos Thrust'];

  const { recast } = nextActionOverlay;

  recast.lifesurge = 45000;
  recast.lancecharge = 90000;
  recast.jump = 30000;
  recast.elusivejump = 30000;
  recast.spineshatterdive = 60000;
  recast.dragonfiredive = 120000;
  recast.battlelitany = 180000;
  recast.bloodofthedragon = 25000;
  recast.geirskogul = 30000;
  recast.dragonsight = 120000;
  recast.miragedive = 1000;
  recast.highjump = recast.jump;
  recast.stardiver = 30000;
  recast.nastrond = 10000;

  const { duration } = nextActionOverlay;

  duration.lifesurge = 5000;
  duration.disembowel = 30000;
  duration.lancecharge = 20000;
  duration.chaosthrust = 24000;
  duration.diveready = 15000;
  duration.battlelitany = 20000;
  duration.bloodofthedragon = 25000;
  duration.dragonsight = 20000;
  duration.raidenthrustready = 10000;

  if (level >= 78) { duration.bloodofthedragon = 30000; }

  const { icon } = nextActionOverlay;

  icon.lifesurge = '000304';
  icon.doomspike = '000306';
  icon.chaosthrust = '000308';
  icon.lancecharge = '000309';
  icon.truethrust = '000310';
  icon.vorpalthrust = '000311';
  icon.fullthrust = '000314';
  icon.piercingtalon = '000315';
  icon.disembowel = '000317';
  icon.jump = '002576';
  icon.elusivejump = '002577';
  icon.dragonfiredive = '002578';
  icon.spineshatterdive = '002580';
  icon.bloodofthedragon = '002581';
  icon.fangandclaw = '002582';
  icon.geirskogul = '002583';
  icon.wheelingthrust = '002584';
  icon.battlelitany = '002585';
  icon.sonicthrust = '002586';
  icon.dragonsight = '002587';
  icon.miragedive = '002588';
  icon.nastrond = '002589';
  icon.coerthantorment = '002590';
  icon.highjump = '002591';
  icon.raidenthrust = '002592';
  icon.stardiver = '002593';

  if (level >= 74) { icon.jump = icon.highjump; }

  nextActionOverlay.changedJob.meleeDPS();
};

nextActionOverlay.drgPlayerChange = (e) => {
  nextActionOverlay.playerData.bloodofthedragonStatus = e.detail.jobDetail.bloodMilliseconds;
  nextActionOverlay.playerData.lifeofthedragonStatus = e.detail.jobDetail.lifeMilliseconds;
  nextActionOverlay.playerData.eyes = e.detail.jobDetail.eyesAmount;
  if (nextActionOverlay.playerData.bloodofthedragonStatus < 0) {
    nextActionOverlay.playerData.bloodofthedragonStatus = -1;
  }
  if (nextActionOverlay.playerData.lifeofthedragonStatus < 0) {
    nextActionOverlay.playerData.lifeofthedragonStatus = -1;
  }
};

nextActionOverlay.drgTargetChange = () => {
  nextActionOverlay.drgNextAction();
};

nextActionOverlay.drgNextAction = ({
  delay = 0,
} = {}) => {
  // Static values
  const { checkRecast } = nextActionOverlay;
  const { checkStatus } = nextActionOverlay;
  const { duration } = nextActionOverlay;
  const { recast } = nextActionOverlay;
  const { level } = nextActionOverlay.playerData;
  const { gcd } = nextActionOverlay;

  // Snapshot of current character
  let { comboStep } = nextActionOverlay;
  let { accelerationCount } = nextActionOverlay;
  let { blackmana } = nextActionOverlay.playerData;
  let { whitemana } = nextActionOverlay.playerData;

  // Set up object for tracking recast times in loops
  const loopRecast = {};
  // loopRecastList array contains all abilities that have recast, concat extra stuff here as needed
  const loopRecastList = nextActionOverlay.actionList.abilities;
  loopRecastList.forEach((actionName) => {
    const propertyName = actionName.replace(/[\s':-]/g, '').toLowerCase();
    loopRecast[propertyName] = checkRecast({ actionName });
  });

  // Set up object for tracking status effects in loops (same as above)
  const loopStatus = {};
  const loopStatusList = nextActionOverlay.statusList.self.concat(['Combo']);
  loopStatusList.forEach((statusName) => {
    const propertyName = statusName.replace(/[\s':-]/g, '').toLowerCase();
    loopStatus[propertyName] = checkStatus({ statusName });
  });

  loopStatus.chaosthrust = checkStatus({ statusName: 'Chaos Thrust', id: nextActionOverlay.target.id });

  // Clear icon array
  const iconArray = [];

  // Initial values for loop control
  let gcdTime = delay; // Time till next GCD action (or GCD length, whatever)
  let nextTime = 0; // Amount of time looked ahead in loop
  const nextMaxTime = 15000; // Maximum predict time

  // Start loop
  while (nextTime < nextMaxTime) {
    let loopTime = 0; // Tracks of how "long" the current loop takes
    if (gcdTime < 1500) { // I assume we're not weaving below that
      const nextGCD = nextActionOverlay.rdmNextGCD({
        comboStep,
        blackmana,
        whitemana,
        loopRecast,
        loopStatus,
      });

      // Push into array
      iconArray.push({ name: nextGCD });

      // Set comboStatus and comboStep
      // Other WS are controlled by buffs so maybe OK to leave them out here
      if ((level >= 4 && nextGCD === 'True Thrust')
      || (level >= 26 && nextGCD === 'Vorpal Thrust')
      || (level >= 50 && nextGCD === 'Disembowel')) {
        comboStep = nextGCD;
        loopStatus.combo = duration.combo;
      } else {
        // Everything else resets combo
        comboStep = '';
        loopStatus.combo = -1;
      }

      // Add procs
      // This block needs to come before mana stuff for simplicity's sake
      if (blackmana < whitemana && nextGCD === 'Verflare') {
        loopStatus.verfireready = duration.verfireready;
      } else if (whitemana < blackmana && nextGCD === 'Verholy') {
        loopStatus.verstoneready = duration.verstoneready;
      } else if (accelerationCount > 0) {
        if (nextGCD.endsWith(' Verthunder') || nextGCD === 'Verflare') {
          accelerationCount -= 1;
          loopStatus.verfireready = duration.verfireready;
        } else if (nextGCD.endsWith(' Veraero') || nextGCD === 'Verholy') {
          accelerationCount -= 1;
          loopStatus.verstoneready = duration.verstoneready;
        }
      }

      // Adjust mana from actions
      if (nextGCD.endsWith(' Jolt') || nextGCD.endsWith(' Jolt II')) {
        blackmana += 3; whitemana += 3;
      } else if (nextGCD.endsWith(' Verthunder')) {
        blackmana += 11;
      } else if (nextGCD.endsWith(' Veraero')) {
        whitemana += 11;
      } else if (nextGCD.endsWith(' Scatter') || nextGCD.endsWith(' Impact')) {
        blackmana += 3; whitemana += 3;
      } else if (nextGCD.endsWith(' Verthunder II')) {
        blackmana += 7;
      } else if (nextGCD.endsWith(' Veraero II')) {
        whitemana += 7;
      } else if (nextGCD.endsWith(' Verfire')) {
        blackmana += 9;
      } else if (nextGCD.endsWith(' Verstone')) {
        whitemana += 9;
      } else if (nextGCD === 'Enchanted Riposte') {
        blackmana -= 30; whitemana -= 30;
      } else if (nextGCD === 'Enchanted Zwerchhau') {
        blackmana -= 25; whitemana -= 25;
      } else if (nextGCD === 'Enchanted Redoublement') {
        blackmana -= 25; whitemana -= 25;
      } else if (nextGCD === 'Enchanted Moulinet') {
        blackmana -= 20; whitemana -= 20;
      } else if (nextGCD === 'Verflare') {
        blackmana += 21;
      } else if (nextGCD === 'Verholy') {
        whitemana += 21;
      } else if (nextGCD === 'Enchanted Reprise') {
        blackmana -= 5; whitemana -= 5;
      } else if (nextGCD === 'Scorch') {
        blackmana += 7; whitemana += 7;
      }

      // Fix mana
      if (blackmana > 100) { blackmana = 100; } else if (blackmana < 0) { blackmana = 0; }
      if (whitemana > 100) { whitemana = 100; } else if (whitemana < 0) { whitemana = 0; }

      // Remove procs
      if (nextGCD.endsWith(' Verfire')) {
        loopStatus.verfireready = -1;
      } else if (nextGCD.endsWith(' Verstone')) {
        loopStatus.verstoneready = -1;
      }

      // GCD
      if (['Enchanted Riposte', 'Enchanted Zwerchhau', 'Enchanted Moulinet'].includes(nextGCD)) {
        gcdTime = 1500;
        loopTime += gcdTime;
      } else if (['Enchanted Redoublement', 'Enchanted Reprise'].includes(nextGCD)) {
        gcdTime = 2200;
        loopTime += gcdTime;
      } else if (nextGCD.startsWith('Hardcast ') && loopStatus.dualcast < 0 && loopStatus.swiftcast < 0) {
        // Hardcasted stuff
        gcdTime = 0; // Due to cast time
        if (nextGCD.endsWith(' Verthunder') || nextGCD.endsWith(' Veraero') || nextGCD.endsWith(' Scatter') || nextGCD.endsWith(' Impact')) {
          loopTime += gcd * 2;
        } else if (nextGCD.endsWith(' Verraise')) {
          loopTime += gcd * 4;
        } else {
          loopTime += gcd;
        }
      } else {
        // Dualcasted/Swiftcasted stuff, spell finishers
        gcdTime = gcd;
        loopTime += gcdTime;
      }

      // Dualcast/Swiftcast status
      if (loopStatus.dualcast > 0) {
        // Apparently everything deletes Dualcast
        loopStatus.dualcast = -1;
      } else if (loopStatus.swiftcast > 0 && nextGCD.startsWith('Dualcast ')) {
        // Swiftcast only consumed on spells (and no dualcast)
        loopStatus.swiftcast = -1;
      } else if (nextGCD.startsWith('Hardcast ')) {
        // Add Dualcast if nothing above was used
        loopStatus.dualcast = duration.dualcast;
      }
    }

    Object.keys(loopRecast).forEach((property) => {
      loopRecast[property] = Math.max(loopRecast[property] - loopTime, -1);
    });
    Object.keys(loopStatus).forEach((property) => {
      loopStatus[property] = Math.max(loopStatus[property] - loopTime, -1);
    });

    // Update Combo status
    if (comboStep === '' || loopStatus.combo < 0) {
      comboStep = '';
      loopStatus.combo = -1;
    }

    // Remove Acceleration if out of charges or time
    if (accelerationCount <= 0 || loopStatus.acceleration <= 0) {
      accelerationCount = 0;
      loopStatus.acceleration = -1;
    }

    let weave = 1;
    let weaveMax = 0;
    if (gcdTime > 2200) {
      weaveMax = 2;
    } else if (gcdTime >= 1500) {
      weaveMax = 1;
    }

    // Second loop for OGCDs
    while (weave <= weaveMax) {
      const nextOGCD = nextActionOverlay.rdmNextOGCD({
        weave,
        weaveMax,
        comboStep,
        blackmana,
        whitemana,
        loopRecast,
        loopStatus,
      });

      if (nextOGCD) {
        // Push into array
        iconArray.push({ name: nextOGCD, size: 'small' });

        // Generic recast/duration handling
        const propertyName = nextOGCD.replace(/[\s':-]/g, '').toLowerCase();
        if (recast[propertyName]) { loopRecast[propertyName] = recast[propertyName]; }
        if (duration[propertyName]) { loopStatus[propertyName] = duration[propertyName]; }

        // Special effects
        if (nextOGCD === 'Displacement') {
          weave = 9; // Force end OGCD section if Displacement used
        } else if (nextOGCD === 'Acceleration') {
          accelerationCount = 3;
        } else if (nextOGCD === 'Manafication') {
          blackmana = Math.min(blackmana * 2, 100);
          whitemana = Math.min(whitemana * 2, 100);
          loopRecast.corpsacorps = -1;
          loopRecast.displacement = -1;
        } else if (nextOGCD === 'Engagement') {
          loopRecast.displacement = recast.displacement;
        }
      }

      weave += 1; // Increment regardless if OGCD was added; some skills only go on weave 2
    }

    gcdTime = 0; // Zero out for next GCD
    nextTime += loopTime;
  }

  nextActionOverlay.NEWsyncIcons({ iconArray });

  // Refresh after a few GCDs if nothing's happening
  clearTimeout(nextActionOverlay.timeout.nextAction); // Keep this the same across jobs
  nextActionOverlay.timeout.nextAction = setTimeout(
    nextActionOverlay.rdmNextAction, gcd * 2, // 2 GCDs seems like a good number... maybe 3?
  );
};

const drgNextGCD = ({
  comboStep,
  disembowelStatus,
  chaosthrustStatus,
  sharperfangandclawStatus,
  enhancedwheelingthrustStatus,
  raidenthrustreadyStatus,
} = {}) => {
  const gcd = gcd;

  let fullthrustComboPotency = 210;
  if (level >= 76) {
    fullthrustComboPotency = (290 + 350 + 530 + 360 + 460 + 40) / 5;
  } else if (level >= 64) {
    fullthrustComboPotency = (210 + 310 + 530 + 360 + 460) / 5;
  } else if (level >= 56) {
    fullthrustComboPotency = (210 + 310 + 530 + 360) / 4;
  } else if (level >= 26) {
    fullthrustComboPotency = (210 + 310 + 530) / 3;
  } else if (level >= 4) {
    fullthrustComboPotency = (210 + 310) / 2;
  }

  let chaosthrustComboPotency = 210;
  if (level >= 76) {
    chaosthrustComboPotency = (290 + 320 + 330 + 45 * Math.floor(chaosthrustStatus / 3000)
    + 360 + 460 + 40) / 5;
  } else if (level >= 64) {
    chaosthrustComboPotency = (210 + 270 + 330 + 45 * Math.floor(chaosthrustStatus / 3000)
    + 360 + 460) / 5;
  } else if (level >= 58) {
    chaosthrustComboPotency = (210 + 270 + 330
    + 45 * Math.floor((chaosthrustStatus - gcd) / 3000)
    + 360) / 4;
  } else if (level >= 50) {
    chaosthrustComboPotency = (210 + 270 + 330 + 45 * Math.floor(chaosthrustStatus / 3000)) / 3;
  } else if (level >= 18) {
    chaosthrustComboPotency = (210 + 270) / 2;
  }

  /* Add potency bonus for Disembowel */
  if ((level >= 64 && disembowelStatus < gcd * 5)
  || (level >= 56 && disembowelStatus < gcd * 4)
  || (level >= 26 && disembowelStatus < gcd * 3)
  || (level >= 18 && disembowelStatus < gcd * 2)) {
    chaosthrustComboPotency += fullthrustComboPotency * 0.1;
  }

  let coerthantormentComboPotency = 0;
  if (level >= 72) {
    coerthantormentComboPotency = ((170 + 200 + 230) / 3) * player.targetCount;
  } else if (level >= 62) {
    coerthantormentComboPotency = ((170 + 200) / 2) * player.targetCount;
  } else if (level >= 40) {
    coerthantormentComboPotency = 170 * player.targetCount;
  }

  if (level >= 72 && comboStep === 'Sonic Break') {
    return 'Coerthan Torment';
  } if (level >= 62 && comboStep === 'Doom Spike') {
    return 'Sonic Break';
  } if (coerthantormentComboPotency
    > Math.max(fullthrustComboPotency, chaosthrustComboPotency)) {
    return 'Doom Spike'; /* Breaks combo for AoE */
  } if (sharperfangandclawStatus > 0) {
    return 'Fang And Claw';
  } if (enhancedwheelingthrustStatus > 0) {
    return 'Wheeling Thrust';
  } if (level >= 50 && comboStep === 'Disembowel') {
    return 'Chaos Thrust';
  } if (level >= 26 && comboStep === 'Vorpal Thrust') {
    return 'Full Thrust';
  } if (level >= 18 && comboStep === 'True Thrust'
  && chaosthrustComboPotency > fullthrustComboPotency) {
    return 'Disembowel';
  } if (level >= 4 && comboStep === 'True Thrust') {
    return 'Vorpal Thrust';
  } if (raidenthrustreadyStatus > 0) {
    return 'Raiden Thrust';
  } return 'True Thrust';
};

const drgNextOGCD = ({
  comboStep,
  jumpRecast,
  lancechargeRecast,
  spineshatterdiveRecast,
  dragonfirediveRecast,
  battlelitanyRecast,
  bloodofthedragonRecast,
  geirskogulRecast,
  dragonsightRecast,
  lifesurgeRecast,
  nastrondRecast,
  stardiverRecast,
  bloodofthedragonStatus,
  lifeofthedragonStatus,
  divereadyStatus,
  gaze,
} = {}) => {
  const damageBuffAfter = ['True Thrust', 'Raiden Thrust', 'Vorpal Thrust', 'Disembowel'];

  const dragonfiredivePotency = 380 * player.targetCount;
  const geirskogulPotency = 300 * player.targetCount;

  let jumpPotency = 310;
  if (level >= 74) { jumpPotency = 400; }
  if (bloodofthedragonStatus > 0) { jumpPotency *= 1.3; }
  if (level >= 68) { jumpPotency += 300; }
  if (jumpRecast >= 0) { jumpPotency = 0; }

  let spineshatterdivePotency = 240;
  if (bloodofthedragonStatus > 0) { spineshatterdivePotency *= 1.3; }
  if (spineshatterdiveRecast >= 0) { spineshatterdivePotency = 0; }

  if (level >= 54 && bloodofthedragonStatus < 0 && bloodofthedragonRecast < 0) {
    return 'Blood Of The Dragon';
  } if (lifeofthedragonStatus < 0 && nastrondRecast < 0) {
    return 'Nastrond';
  } if (lifeofthedragonStatus < 0 && stardiverRecast < 0) {
    return 'Stardiver';
  } if (level >= 26 && comboStep === 'Vorpal Thrust' && lifesurgeRecast < 0) {
    return 'Life Surge';
  } if (level >= 66 && damageBuffAfter.includes(comboStep) && dragonsightRecast < 0) {
    return 'Dragon Sight';
  } if (level >= 52 && damageBuffAfter.includes(comboStep)
  && battlelitanyRecast < 0) {
    return 'Battle Litany';
  } if (level >= 30 && damageBuffAfter.includes(comboStep) && lancechargeRecast < 0) {
    return 'Lance Charge';
  } if (level >= 50
  && dragonfiredivePotency > Math.max(jumpPotency, spineshatterdivePotency)
  && dragonfirediveRecast < 0) {
    return 'Dragonfire Dive';
  } if (level >= 60
  && geirskogulPotency > Math.max(jumpPotency, spineshatterdivePotency) && geirskogulRecast < 0) {
    return 'Geirskogul';
  } if (level >= 30 && jumpRecast < 0) {
    if (level >= 74) {
      return 'High Jump';
    } return 'Jump';
  } if (level >= 45 && spineshatterdiveRecast < 0) {
    return 'Spineshatter Dive';
  } if (divereadyStatus > 0 && gaze < 2) {
    return 'Mirage Dive';
  } if (level >= 6 && level < 26 && lifesurgeRecast < 0) {
    return 'Life Surge';
  } return '';
};
