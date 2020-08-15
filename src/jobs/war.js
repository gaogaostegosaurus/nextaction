nextActionOverlay.warJobChange = () => {
  const { level } = nextActionOverlay.playerData;

  // Set initial values
  nextActionOverlay.comboStep = '';

  nextActionOverlay.actionList.weaponskills = [
    'Heavy Swing', 'Maim', 'Storm\'s Path', 'Storm\'s Eye',
    'Overpower', 'Mythril Tempest',
    'Tomahawk',
  ];

  nextActionOverlay.actionList.beast = [
    'Inner Beast', 'Fell Cleave', 'Inner Chaos',
    'Steel Cyclone', 'Decimate', 'Chaotic Cyclone',
  ];

  nextActionOverlay.actionList.abilities = [
    'Berserk',
    'Thrill Of Battle',
    'Vengeance',
    'Holmgang',
    'Infuriate',
    'Raw Intuition',
    'Equilibrium',
    'Onslaught',
    'Upheaval',
    'Shake It Off',
    'Inner Release',
    'Nascent Flash',
  ];

  // Easier/more accurate controlling this via the buffs
  // I think that means it won't work in Eureka but screw Eureka

  nextActionOverlay.statusList.self = [
    'Berserk', 'Inner Release',
    'Nascent Chaos',
  ];

  nextActionOverlay.statusList.mitigation = [
    'Vengeance',
    'Holmgang',
    'Raw Intuition',
    'Nascent Flash',
  ];

  const { recast } = nextActionOverlay;

  recast.berserk = 90000;
  recast.equilibrium = 60000;
  recast.holmgang = 240000;
  recast.infuriate = 60000;
  recast.infuriate1 = recast.infuriate;
  recast.infuriate2 = recast.infuriate;
  recast.onslaught = 10000;
  recast.rawintuition = 25000;
  recast.shakeitoff = 90000;
  recast.thrillofbattle = 90000;
  recast.upheaval = 30000;
  recast.vengeance = 120000;

  recast.innerrelease = recast.berserk;
  recast.nascentflash = recast.rawintuition;

  const { duration } = nextActionOverlay;

  duration.berserk = 10000;
  duration.defiance = 9999000;
  duration.holmgang = 8000;
  duration.nascentchaos = 30000;
  duration.shakeitoff = 15000;
  duration.stormseye = 30000;
  duration.thrillofbattle = 20000;

  duration.innerrelease = duration.berserk;
  duration.nascentflash = duration.rawintuition;

  const { icon } = nextActionOverlay;

  icon.overpower = '000254';
  icon.maim = '000255';
  icon.stormspath = '000258';
  icon.berserk = '000259';
  icon.heavyswing = '000260';
  icon.tomahawk = '000261';
  icon.thrillofbattle = '000263';
  icon.stormseye = '000264';
  icon.holmgang = '000266';
  icon.vengeance = '000267';
  icon.defiance = '002551';
  icon.steelcyclone = '002552';
  icon.innerbeast = '002553';
  icon.infuriate = '002555';
  icon.fellcleave = '002557';
  icon.decimate = '002558';
  icon.rawintuition = '002559';
  icon.equilibrium = '002560';
  icon.onslaught = '002561';
  icon.upheaval = '002562';
  icon.shakeitoff = '002563';
  icon.innerrelease = '002564';
  icon.mythriltempest = '002565';
  icon.chaoticcyclone = '002566';
  icon.nascentflash = '002567';
  icon.innerchaos = '002568';

  if (level >= 54) { icon.innerbeast = icon.fellcleave; }
  if (level >= 60) { icon.steelcyclone = icon.decimate; }
  if (level >= 70) { icon.berserk = icon.innerrelease; }

  nextActionOverlay.tankRoleChange();
}; // Keep collapsed, usually

nextActionOverlay.warPlayerChange = (e) => {
  nextActionOverlay.playerData.hpp = e.detail.currentHP / e.detail.maxHP;
  nextActionOverlay.playerData.beast = e.detail.jobDetail.beast;
};

nextActionOverlay.warTargetChange = () => {
  nextActionOverlay.warNextAction();
};

nextActionOverlay.warNextAction = ({
  delay = 0,
} = {}) => {
  // Static values
  const { checkRecast } = nextActionOverlay;
  const { checkStatus } = nextActionOverlay;
  const { duration } = nextActionOverlay;
  const { recast } = nextActionOverlay;
  const { gcd } = nextActionOverlay; // WAR has static GCD
  const { level } = nextActionOverlay.playerData;

  // Snapshot of current character
  let { comboStep } = nextActionOverlay;
  let { hpp } = nextActionOverlay.playerData;
  let { beast } = nextActionOverlay.playerData;
  
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

  // Add target statuses here if needed

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
      // Special case for entering loop when casting
     
      const nextGCD = nextActionOverlay.rdmNextGCD({
        comboStep, blackmana, whitemana, loopRecast, loopStatus,
      });

      // Push into array
      iconArray.push({ name: nextGCD });

      // Set comboStatus and comboStep
      // Probably fine to not separate weaponskills for RDM since the list of combo actions is short
      if ((level >= 35 && nextGCD === 'Enchanted Riposte')
      || (level >= 50 && nextGCD === 'Enchanted Zwerchhau')
      || (level >= 68 && nextGCD === 'Enchanted Redoublement')
      || (level >= 80 && ['Verflare', 'Verholy'].includes(nextGCD))) {
        comboStep = nextGCD;
        loopStatus.combo = duration.combo;
      } else {
        // Everything else resets combo
        comboStep = '';
        loopStatus.combo = -1;
      }

      // Add procs
      // This block needs to come before mana stuff for simplicity's sake
      if (blackmana < whitemana && nextGCD === 'Verflare') { loopStatus.verfireready = duration.verfireready; } else
      if (whitemana < blackmana && nextGCD === 'Verholy') { loopStatus.verstoneready = duration.verstoneready; } else
      if (accelerationCount > 0) {
        if (nextGCD.endsWith(' Verthunder') || nextGCD === 'Verflare') {
          accelerationCount -= 1;
          loopStatus.verfireready = duration.verfireready;
        } else
        if (nextGCD.endsWith(' Veraero') || nextGCD === 'Verholy') {
          accelerationCount -= 1;
          loopStatus.verstoneready = duration.verstoneready;
        }
      }

      // Adjust mana from actions
      if (nextGCD.endsWith(' Jolt') || nextGCD.endsWith(' Jolt II')) { blackmana += 3; whitemana += 3; } else
      if (nextGCD.endsWith(' Verthunder')) { blackmana += 11; } else
      if (nextGCD.endsWith(' Veraero')) { whitemana += 11; } else
      if (nextGCD.endsWith(' Scatter') || nextGCD.endsWith(' Impact')) { blackmana += 3; whitemana += 3; } else
      if (nextGCD.endsWith(' Verthunder II')) { blackmana += 7; } else
      if (nextGCD.endsWith(' Veraero II')) { whitemana += 7; } else
      if (nextGCD.endsWith(' Verfire')) { blackmana += 9; } else
      if (nextGCD.endsWith(' Verstone')) { whitemana += 9; } else

      if (nextGCD === 'Enchanted Riposte') { blackmana -= 30; whitemana -= 30; } else
      if (nextGCD === 'Enchanted Zwerchhau') { blackmana -= 25; whitemana -= 25; } else
      if (nextGCD === 'Enchanted Redoublement') { blackmana -= 25; whitemana -= 25; } else
      if (nextGCD === 'Enchanted Moulinet') { blackmana -= 20; whitemana -= 20; } else
      if (nextGCD === 'Verflare') { blackmana += 21; } else
      if (nextGCD === 'Verholy') { whitemana += 21; } else
      if (nextGCD === 'Enchanted Reprise') { blackmana -= 5; whitemana -= 5; } else
      if (nextGCD === 'Scorch') { blackmana += 7; whitemana += 7; }

      // Fix mana
      if (blackmana > 100) { blackmana = 100; } else if (blackmana < 0) { blackmana = 0; }
      if (whitemana > 100) { whitemana = 100; } else if (whitemana < 0) { whitemana = 0; }

      // Remove procs
      if (nextGCD.endsWith(' Verfire')) { loopStatus.verfireready = -1; } else
      if (nextGCD.endsWith(' Verstone')) { loopStatus.verstoneready = -1; }

      // GCD
      if (['Enchanted Riposte', 'Enchanted Zwerchhau', 'Enchanted Moulinet'].includes(nextGCD)) {
        gcdTime = 1500;
        loopTime += gcdTime;
      } else
      if (['Enchanted Redoublement', 'Enchanted Reprise'].includes(nextGCD)) {
        gcdTime = 2200;
        loopTime += gcdTime;
      } else
      if (nextGCD.startsWith('Hardcast ') && loopStatus.dualcast < 0 && loopStatus.swiftcast < 0) {
        // Hardcasted stuff
        gcdTime = 0; // Due to cast time
        if (nextGCD.endsWith(' Verthunder') || nextGCD.endsWith(' Veraero') || nextGCD.endsWith(' Scatter') || nextGCD.endsWith(' Impact')) { loopTime += gcd * 2; } else
        if (nextGCD.endsWith(' Verraise')) { loopTime += gcd * 4; } else { loopTime += gcd; }
      } else {
        // Dualcasted/Swiftcasted stuff, spell finishers
        gcdTime = gcd;
        loopTime += gcdTime;
      }

      // Dualcast/Swiftcast status
      // Apparently everything deletes Dualcast
      if (loopStatus.dualcast > 0) { loopStatus.dualcast = -1; } else
      // Swiftcast only consumed on spells (and no dualcast)
      if (loopStatus.swiftcast > 0 && nextGCD.startsWith('Dualcast ')) { loopStatus.swiftcast = -1; } else
      // Add Dualcast if nothing above was used
      if (nextGCD.startsWith('Hardcast ')) { loopStatus.dualcast = duration.dualcast; }
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

    let weave = 1; let weaveMax = 0;
    if (gcdTime > 2200) { weaveMax = 2; } else
    if (gcdTime >= 1500) { weaveMax = 1; }

    // Second loop for OGCDs
    while (weave <= weaveMax) {
      const nextOGCD = nextActionOverlay.rdmNextOGCD({
        weave, weaveMax, comboStep, blackmana, whitemana, loopRecast, loopStatus,
        // Put MP in later
        // weave, weaveMax, mp, comboStep, blackmana, whitemana, loopRecast, loopStatus,
      });

      if (nextOGCD) {
        // Push into array
        iconArray.push({ name: nextOGCD, size: 'small' });

        // Generic recast/duration handling
        const propertyName = nextOGCD.replace(/[\s':-]/g, '').toLowerCase();
        if (recast[propertyName]) { loopRecast[propertyName] = recast[propertyName]; }
        if (duration[propertyName]) { loopStatus[propertyName] = duration[propertyName]; }

        // Special effects
        // Force end OGCD section if Displacement used
        if (nextOGCD === 'Displacement') { weave = 9; } else
        if (nextOGCD === 'Acceleration') { accelerationCount = 3; } else
        if (nextOGCD === 'Manafication') {
          blackmana = Math.min(blackmana * 2, 100);
          whitemana = Math.min(whitemana * 2, 100);
          loopRecast.corpsacorps = -1;
          loopRecast.displacement = -1;
        } else
        if (nextOGCD === 'Engagement') {
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

nextActionOverlay.warNextGCD = ({ // Copied from PLD
  comboStep, beast, loopRecast, loopStatus,
} = {}) => {
  const { recast } = nextActionOverlay;
  const { duration } = nextActionOverlay;
  const { targetCount } = nextActionOverlay;
  const { level } = nextActionOverlay.playerData;
  const { gcd } = nextActionOverlay;

  // Gauge use toggle
  let spender = false;

  // Inner Release
  if (loopStatus.innerrelease > 0) { spender = true; } else
  // Avoid losing Nascent Chaos
  if (loopStatus.nascentchaos > 0 && loopStatus.nascentchaos < gcd * 2) { spender = true; } else
  // Avoid losing Upheaval uses
  if (level >= 64 && (loopRecast.upheaval > loopRecast.infuriate1 || beast >= 70)) {
    spender = true;
  } else
  // Use immediately before Upheaval is available
  if (level < 64 && beast >= 50) { spender = true; }

  if (spender === true) {
    if (loopStatus.nascentchaos > 0) {
      if (targetCount > 1) { return 'Chaotic Cyclone'; }
      if (level >= 80) { return 'Inner Chaos'; }
      return 'Chaotic Cyclone';
    }
    if (targetCount > 1) {
      if (level >= 60) { return 'Decimate'; } return 'Steel Cyclone';
    }
    if (level >= 54) { return 'Fell Cleave'; } return 'Inner Beast';
  }

  // Continue combos
  if (level >= 40 && comboStep === 'Overpower') { return 'Mythril Tempest'; }
  if (level >= 26 && comboStep === 'Maim') {
    if (level >= 50 && loopStatus.stormseye < 30000) { return 'Storm\'s Eye'; }
    return 'Storm\'s Path';
  }
  if (level >= 4 && comboStep === 'Heavy Swing') { return 'Maim'; }

  // Start combos
  if (level >= 50 && loopStatus.stormseye < gcd * 2) { return 'Heavy Swing'; }
  if (level >= 10 && targetCount > 1) { return 'Overpower'; }
  return 'Heavy Swing';
};

nextActionOverlay.warNextOGCD = ({
  weave, loopRecast, loopStatus,
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