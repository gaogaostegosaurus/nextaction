nextActionOverlay.warJobChange = () => {
  const { level } = nextActionOverlay.playerData;

  // Set initial values
  nextActionOverlay.comboStep = '';

  nextActionOverlay.actionList.weaponskills = [
    'Heavy Swing', 'Maim', 'Storm\'s Path', 'Storm\'s Eye',
    'Overpower', 'Mythril Tempest',
    'Tomahawk',
  ];

  nextActionOverlay.actionList.spenders = [
    'Inner Beast', 'Fell Cleave', 'Inner Chaos',
    'Steel Cyclone', 'Decimate', 'Chaotic Cyclone',
  ];

  nextActionOverlay.actionList.abilities = [
    'Berserk', 'Inner Release',
    'Thrill Of Battle',
    'Vengeance',
    'Holmgang',
    'Infuriate',
    'Raw Intuition', 'Nascent Flash',
    'Equilibrium',
    'Onslaught',
    'Upheaval',
    'Shake It Off',
  ];

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
  nextActionOverlay.playerData.hpp = (e.detail.currentHP / e.detail.maxHP) * 100;
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
  const { spenders } = nextActionOverlay.actionList;
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
      const nextGCD = nextActionOverlay.rdmNextGCD({
        comboStep, beast, loopRecast, loopStatus,
      });

      // Push into array
      iconArray.push({ name: nextGCD });

      // Set comboStatus and comboStep
      if ((level >= 4 && nextGCD === 'Heavy Swing')
      || (level >= 26 && nextGCD === 'Maim')
      || (level >= 40 && nextGCD === 'Overpower')) {
        comboStep = nextGCD;
        loopStatus.combo = duration.combo;
      } else if (spenders.includes(nextGCD)) {
        // Do nothing here
      } else {
        // Everything else resets combo
        comboStep = '';
        loopStatus.combo = -1;
      }

      // Adjust Beast Gauge from actions
      if (spenders.includes(nextGCD) && loopStatus.innerrelease < 0) {
        beast = Math.max(0, beast - 50);
        if (['Chaotic Cyclone', 'Inner Chaos'].includes(nextGCD)) { loopStatus.nascentchaos = -1; }
      } else
      if (level >= 35) {
        if (nextGCD === 'Maim') { beast = Math.min(100, beast + 10); } else
        if (nextGCD === 'Storm\'s Path') { beast = Math.min(100, beast + 20); } else
        if (nextGCD === 'Storm\'s Eye') { beast = Math.min(100, beast + 10); } else
        if (level >= 74 && nextGCD === 'Mythril Tempest') { beast = Math.min(100, beast + 20); }
      }

      // Storm's Eye buff
      if (nextGCD === 'Storm\'s Eye') { loopStatus.stormseye = Math.min(60000, loopStatus.stormseye + 30000); }
      if (loopStatus.stormseye > 0 && nextGCD === 'Mythril Tempest') { loopStatus.stormseye = Math.min(60000, loopStatus.stormseye + 30000); }

      // GCD
      // WAR has no weird GCD lengths
      loopTime += gcd;
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

    let weave = 1; const weaveMax = 2;

    // Second loop for OGCDs
    while (weave <= weaveMax) {
      const nextOGCD = nextActionOverlay.warNextOGCD({
        weave, weaveMax, hpp, beast, loopRecast, loopStatus,
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
        if (nextOGCD === 'Infuriate') {
          loopRecast.infuriate1 = loopRecast.infuriate2;
          loopRecast.infuriate2 += recast.infuriate;
          beast = Math.min(100, beast + 50);
          if (level >= 72) { loopStatus.nascentchaos = duration.nascentchaos; }
        } else
        if (nextOGCD === 'Equilibrium') { hpp = 100; } else
        if (nextOGCD === 'Inner Release') {
          loopRecast.berserk = recast.innerrelease;
        } else
        // Beast gauge changes
        if (loopStatus.innerrelease < 0) {
          if (nextOGCD === 'Onslaught') { beast = Math.max(0, beast - 10); }
          if (nextOGCD === 'Upheaval') { beast = Math.max(0, beast - 20); }
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

nextActionOverlay.warNextGCD = ({ // Originally copied from PLD
  comboStep, beast, loopRecast, loopStatus,
} = {}) => {
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
  weave, weaveMax, hpp, beast, loopRecast, loopStatus,
} = {}) => {
  const { gcd } = nextActionOverlay;
  const { level } = nextActionOverlay.playerData;

  // Inner Release/Berserk as close to cooldown as possible
  // Inner Release only activates if first Infuriate stack is already used
  if (level >= 70 && weave === weaveMax && loopStatus.nascentchaos < 0 && loopRecast.infuriate2 > 0 && loopRecast.innerrelease < 0) { return 'Inner Release'; }
  if (level >= 6 && level < 70 && weave === weaveMax && loopRecast.berserk < 0) { return 'Berserk'; }

  // Upheaval
  if (level >= 70 && (beast >= 20 || loopStatus.innerrelease > 0) && loopRecast.innerrelease > 20000 + gcd && loopRecast.upheaval < 0) { return 'Upheaval'; }
  if (level >= 64 && level < 70 && beast >= 20 && loopRecast.berserk > 20000 + gcd && loopRecast.upheaval < 0) { return 'Upheaval'; }

  // Use final Infuriate stack
  if (level >= 50 && loopRecast.infuriate1 < 0) {
    // After Nascent Chaos
    if (level >= 72 && beast <= 50 && loopStatus.nascentchaos < 0 && loopStatus.innerrelease < 0) { return 'Infuriate'; }
    // Before Nascent Chaos
    // Should be OK during Inner Release?
    if (level < 72 && beast <= 50) { return 'Infuriate'; }
  }

  // Use Onslaught if under Inner Release
  if (level >= 70 && loopStatus.innerrelease > 0 && loopRecast.onslaught < 0) { return 'Onslaught'; }

  // Let's see if this is worth including...
  if (level >= 58 && hpp < 75 && loopRecast.equilibrium < 0) { return 'Equilibrium'; }

  return '';
};
