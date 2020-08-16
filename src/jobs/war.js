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
    'Storm\'s Eye',
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
  // duration.stormseye = 30000;
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
  const { weaponskills } = nextActionOverlay.actionList;
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
  const nextMaxTime = 15000; // Maximum prediction time

  // Start loop
  while (nextTime < nextMaxTime) {
    let loopTime = 0; // Tracks of how "long" the current loop lasts
    if (gcdTime === 0) { // Let's assume we're not weaving below that
      const nextGCD = nextActionOverlay.warNextGCD({
        comboStep, beast, loopRecast, loopStatus,
      });

      // Push into array
      iconArray.push({ name: nextGCD });

      // Generic recast/duration handling
      // Not enough generic actions on WAR to make this efficient
      // const propertyName = nextOGCD.replace(/[\s':-]/g, '').toLowerCase();
      // if (recast[propertyName]) { loopRecast[propertyName] = recast[propertyName]; }
      // if (duration[propertyName]) { loopStatus[propertyName] = duration[propertyName]; }

      // Weaponskills
      if (weaponskills.includes(nextGCD)) {
        // Set comboStatus and comboStep
        if ((level >= 4 && nextGCD === 'Heavy Swing')
        || (level >= 26 && nextGCD === 'Maim')
        || (level >= 40 && nextGCD === 'Overpower')) {
          // Continue combo
          comboStep = nextGCD;
          loopStatus.combo = duration.combo;
        } else {
          // Everything else resets combo
          comboStep = '';
          loopStatus.combo = -1;
        }

        // Beast Gauge
        if (level >= 35) {
          if (nextGCD === 'Maim') { beast = Math.min(100, beast + 10); } else
          if (nextGCD === 'Storm\'s Path') { beast = Math.min(100, beast + 20); } else
          if (nextGCD === 'Storm\'s Eye') { beast = Math.min(100, beast + 10); } else
          if (level >= 74 && nextGCD === 'Mythril Tempest') { beast = Math.min(100, beast + 20); }
        }

        // Storm's Eye
        if (nextGCD === 'Storm\'s Eye') { loopStatus.stormseye = Math.min(60000, loopStatus.stormseye + 30000); }
        if (loopStatus.stormseye > 0 && nextGCD === 'Mythril Tempest') { loopStatus.stormseye = Math.min(60000, loopStatus.stormseye + 30000); }
      }

      // Spenders
      if (spenders.includes(nextGCD) && loopStatus.innerrelease < 0) {
        // Adjust Beast Gauge
        beast = Math.max(0, beast - 50);
        // Remove Nascent Chaos
        if (['Chaotic Cyclone', 'Inner Chaos'].includes(nextGCD)) { loopStatus.nascentchaos = -1; }
      }

      // GCD
      loopTime += gcd; // WAR is all standard GCD lengths
    } else { loopTime = gcdTime; }

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

    // OGCD loop
    while (weave <= weaveMax) {
      const nextOGCD = nextActionOverlay.warNextOGCD({
        weave, weaveMax, hpp, beast, loopRecast, loopStatus,
      });

      if (nextOGCD) {
        // Push into array
        iconArray.push({ name: nextOGCD, size: 'small' });

        // Generic recast/duration handling
        const propertyName = nextOGCD.replace(/[\s':-]/g, '').toLowerCase();
        if (recast[propertyName]) { loopRecast[propertyName] = recast[propertyName]; }
        if (duration[propertyName]) { loopStatus[propertyName] = duration[propertyName]; }

        // Special effects
        // "Heal" effects don't actually cap hpp - only for setting conditions
        if (nextOGCD === 'Thrill Of Battle') { hpp = 100; } else
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
    nextActionOverlay.warNextAction, gcd * 2, // 2 GCDs seems like a good number... maybe 3?
  );
};

nextActionOverlay.warNextGCD = ({
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
  if (level >= 30 && level < 78 && hpp < 75 && loopRecast.thrillofbattle < 0) { return 'Thrill Of Battle'; }
  if (level >= 58 && hpp < 75 && loopRecast.equilibrium < 0) { return 'Equilibrium'; }

  return '';
};

nextActionOverlay.warNextMitigation = () => {
  const mitigationList = nextActionOverlay.statusList.mitigation;
  let mitigationStatus = -1;
  const { checkStatus } = nextActionOverlay;

  // Set mitigationStatus to currently longest status
  mitigationList.forEach((ability) => {
    if (mitigationStatus < checkStatus({ statusName: ability })) {
      mitigationStatus = checkStatus({ statusName: ability });
    }
  });

  const iconArray = [];
  const { level } = nextActionOverlay.playerData;
  const { checkRecast } = nextActionOverlay;

  if (mitigationStatus < 0) {
    mitigationList.forEach((ability) => {
      if (checkRecast({ actionName: ability }) < 0) {
        if (level >= 76 && ability === 'Nascent Flash') { iconArray.push({ name: ability, size: 'small' }); }
        if (level >= 78 && ability === 'Thrill Of Battle') { iconArray.push({ name: ability, size: 'small' }); }
        if (level >= 38 && ability === 'Vengeance') { iconArray.push({ name: ability, size: 'small' }); }
        if (level >= 56 && level < 76 && ability === 'Raw Intuition') { iconArray.push({ name: ability, size: 'small' }); }
        if (level >= 68 && ability === 'Shake It Off') { iconArray.push({ name: ability, size: 'small' }); }
        if (level >= 8 && ability === 'Rampart') { iconArray.push({ name: ability, size: 'small' }); }
        if (level >= 22 && ability === 'Reprisal') { iconArray.push({ name: ability, size: 'small' }); }
        if (level >= 32 && ability === 'Arm\'s Length') { iconArray.push({ name: ability, size: 'small' }); }
      }
    });
  }

  nextActionOverlay.NEWsyncIcons({ iconArray, row: 'icon-c' });
};

nextActionOverlay.warActionMatch = (actionMatch) => {
  const { NEWremoveIcon } = nextActionOverlay;
  const { addRecast } = nextActionOverlay;
  const { checkRecast } = nextActionOverlay;
  const { addStatus } = nextActionOverlay;
  const { checkStatus } = nextActionOverlay;
  const { removeStatus } = nextActionOverlay;
  const { recast } = nextActionOverlay;
  const { duration } = nextActionOverlay;

  const { level } = nextActionOverlay.playerData;
  const { gcd } = nextActionOverlay;

  const { weaponskills } = nextActionOverlay.actionList;
  const { spenders } = nextActionOverlay.actionList;
  const { abilities } = nextActionOverlay.actionList;

  const { actionName } = actionMatch.groups;
  const { comboCheck } = actionMatch.groups;

  const singletargetActions = [
    // Use these to switch to "single target mode"
    'Maim', 'Storm\'s Path', 'Storm\'s Eye',
    'Inner Beast', 'Fell Cleave', 'Inner Chaos',
  ];

  // List all actions expected to hit multiple targets
  const multitargetActions = [
    'Overpower', 'Mythril Tempest',
    'Steel Cyclone', 'Decimate', 'Chaotic Cyclone',
  ];

  // Set probable target count
  if (singletargetActions.includes(actionName)) {
    nextActionOverlay.targetCount = 1;
  } else if (multitargetActions.includes(actionName) && actionMatch.groups.logType === '15') {
    // Multi target only hits single target
    nextActionOverlay.targetCount = 1;
  }

  // Remove action from overlay display
  NEWremoveIcon({ name: actionName });

  if (weaponskills.includes(actionName)) {
    // Combo
    if (comboCheck && ((level >= 4 && actionName === 'Heavy Swing')
    || (level >= 26 && actionName === 'Maim')
    || (level >= 40 && actionName === 'Overpower'))) {
      addStatus({ statusName: 'Combo' });
      nextActionOverlay.comboStep = actionName;
    } else {
      removeStatus({ statusName: 'Combo' });
      nextActionOverlay.comboStep = '';
    }

    // Weaponskill-specific effects here
    if (actionName === 'Storm\'s Eye') {
      addStatus({ statusName: 'Storm\'s Eye', duration: Math.min(60000, checkStatus({ statusName: 'Storm\'s Eye' }) + 30000) });
    } else if (actionName === 'Mythril Tempest' && checkStatus({ statusName: 'Storm\'s Eye' }) > 0) {
      addStatus({ statusName: 'Storm\'s Eye', duration: Math.min(60000, checkStatus({ statusName: 'Storm\'s Eye' }) + 30000) });
    }

    // Find next actions
    nextActionOverlay.warNextAction({ delay: gcd });
  } else if (spenders.includes(actionName)) {
    if (['Chaotic Cyclone', 'Inner Chaos'].includes(actionName)) { removeStatus({ statusName: 'Nascent Chaos' }); }
    nextActionOverlay.warNextAction({ delay: gcd });
  } else if (abilities.includes(actionName)) {
    // Generic recast/duration handling
    const propertyName = actionName.replace(/[\s':-]/g, '').toLowerCase();
    if (recast[propertyName]) { addRecast({ actionName }); }
    if (duration[propertyName]) { addStatus({ statusName: actionName }); }
    if (actionName === 'Infuriate') {
      addRecast({ actionName: 'Infuriate 1', recast: checkRecast({ actionName: 'Infuriate 2' }) });
      addRecast({ actionName: 'Infuriate 2', recast: checkRecast({ actionName: 'Infuriate 2' }) + recast.infuriate });
    }
  }
};

nextActionOverlay.warStatusMatch = (statusMatch) => {
  const { statusName } = statusMatch.groups;
  const { statusDuration } = statusMatch.groups;

  if (statusMatch.groups.logType === '1A') {
    nextActionOverlay.addStatus({ statusName, duration: parseFloat(statusDuration) * 1000 });
    // Check to see if this is needed
    // if (statusName === 'Nascent Chaos') { nextActionOverlay.warNextAction(); }
  } else { // 1E - loses status
    nextActionOverlay.removeStatus({ statusName });
  }

  if (nextActionOverlay.statusList.mitigation.includes(statusName)) {
    nextActionOverlay.warNextMitigation();
  }
};
