
const drkComboActions = [
  'Hard Slash', 'Syphon Strike', 'Souleater',
  'Unleash', 'Stalwart Soul', /* Yes, yes, technically not weaponskills, I don't care */
  'Unmend',
];

const drkBloodWeaponskills = [ /* Don't interrupt combos */
  'Bloodspiller', 'Quietus',
];

const drkCooldowns = [
  'Flood Of Darkness', 'Flood Of Shadow',
  'Blood Weapon',
  'Edge Of Darkness', 'Edge Of Shadow',
  'Salted Earth',
  'Plunge',
  'Abyssal Drain',
  'Carve And Spit',
  'Delirium',
  'Living Shadow',
];

const drkSpells = [
  'Unleash', 'Stalwart Soul',
  'Unmend',
];

// const drkMultiTarget = [
//   //
// ];
//
// const drkSingleTarget = [
//   //
// ];

actionList.DRK = [...new Set([
  ...drkComboActions,
  ...drkBloodWeaponskills,
  ...drkCooldowns,
  // ...drkSpells,
])];

const drkNextGCD = ({ /* All drk GCDs are weaponskills so... */
  comboStatus,
  comboStep,
  blood,
  darkarts,
  bloodweaponStatus,
  deliriumStatus,
  // deliriumRecast,
  // livingshadowRecast,
} = {}) => {
  let bloodCap = 100;

  /* Probably some misalignment stuff that needs to be caught here */
  // if (player.level >= 80 && livingshadowRecast < player.gcd) {
  //   bloodCap = 100;
  // } else if (player.level >= 68 && deliriumRecast < player.gcd) {
  //   bloodCap = 50;
  // }

  if (bloodweaponStatus > 0) {
    bloodCap -= 10;
  }

  if ((player.level >= 2 && comboStep === 'Hard Slash')
  || (player.level >= 72 && comboStep === 'Unleash')) {
    bloodCap -= 20;
  }

  /* Check for Delirium */
  if (deliriumStatus > 0) {
    if (player.targetCount >= 3) {
      return 'Quietus';
    } return 'Bloodspiller';
  }

  /* Don't drop combo */
  if (comboStatus < player.gcd * 2) {
    if (player.level >= 72 && player.targetCount >= 2 && comboStep === 'Unleash') {
      return 'Stalwart Soul';
    } else if (player.level >= 26 && comboStep === 'Syphon Strike') {
      return 'Souleater';
    } else if (player.level >= 2 && comboStep === 'Hard Slash') {
      return 'Syphon Strike';
    }
  }

  /* Check for Dark Arts */
  if (darkarts > 0) {
    if (player.targetCount >= 3) {
      return 'Quietus';
    } return 'Bloodspiller';
  }

  /* Check for possible blood overcap */
  if (blood >= 50 && blood > bloodCap) {
    if (player.level >= 64 && player.targetCount >= 3) {
      return 'Quietus';
    } return 'Bloodspiller';
  }

  /* Combos */
  if (player.level >= 72 && player.targetCount >= 2 && comboStep === 'Unleash') {
    return 'Stalwart Soul'; /* Average 155 per hit + blood + mp */
  } else if (player.targetCount >= 72 && player.targetCount >= 2) {
    return 'Unleash';
  } else if (player.targetCount < 72 && player.targetCount >= 3) {
    return 'Unleash'; /* Average 150 per hit */
  } else if (player.level >= 26 && comboStep === 'Syphon Strike') {
    return 'Souleater'; /* Average 300 per hit + blood + mp */
  } else if (player.level >= 2 && comboStep === 'Hard Slash') {
    return 'Syphon Strike';
  } return 'Hard Slash';
};

const drkNextOGCD = ({
  weaveTime,
  comboStatus,
  comboStep,
  mp,
  blood,
  bloodweaponStatus,
  floodofdarknessRecast,
  bloodweaponRecast,
  edgeofdarknessRecast,
  saltedearthRecast,
  plunge2Recast,
  abyssaldrainRecast,
  deliriumRecast,
  carveandspitRecast,
  livingshadowRecast,
} = {}) => {
  let mpCap = 9800;
  let bloodCap = 100;

  if (bloodweaponStatus > 0) {
    mpCap -= 600;
    if (player.level >= 66) {
      bloodCap -= 10;
    }
  }

  if (carveandspitRecast < 0) {
    mpCap -= 600;
  }

  if ((player.level >= 2 && comboStep === 'Hard Slash')
  || (player.level >= 72 && comboStep === 'Unleash')) {
    mpCap -= 600;
  }

  if ((player.level >= 62 && comboStep === 'Syphon Strike')
  || (player.level >= 72 && comboStep === 'Unleash')) {
    bloodCap -= 20;
  }

  if (player.level >= 30 && player.targetCount >= 2 && mp >= mpCap
  && floodofdarknessRecast < 0) {
    if (player.level >= 74) {
      return 'Flood Of Shadow';
    } return 'Flood Of Darkness';
  } else if (player.level >= 40 && mp >= mpCap && edgeofdarknessRecast < 0) {
    if (player.level >= 74) {
      return 'Edge Of Shadow';
    } return 'Edge Of Darkness';
  } else if (player.level >= 35 && weaveTime <= 1500 && bloodweaponRecast < 0) {
    return 'Blood Weapon';
  } else if (player.level >= 80 && blood >= bloodCap && livingshadowRecast < 0) {
    return 'Living Shadow';
  } else if (player.level >= 68 && weaveTime <= 1500
  && (comboStatus > player.gcd * 5 || comboStatus < -1) && deliriumRecast < 0) {
    return 'Delirium'; /* weaveTime <= 1500 places it in second part of GCD */
  } else if (player.level >= 52 && player.targetCount >= 2 && saltedearthRecast < 0) {
    return 'Salted Earth';
  } else if (player.level >= 60 && carveandspitRecast < 0) {
    return 'Carve And Spit';
  } else if (player.level >= 56 && player.targetCount >= 2 && abyssaldrainRecast < 0) {
    return 'Abyssal Drain';
  } else if (player.level >= 52 && weaveTime > 1250 && saltedearthRecast < 0) {
    return 'Salted Earth';
  } else if (player.level >= 56 && abyssaldrainRecast < 0) {
    return 'Abyssal Drain';
  } else if (player.level >= 56 && weaveTime <= 1500 && plunge2Recast < 0) {
    return 'Plunge';
  } return ''; /* Returns nothing if no OGCD matches */
};

const drkNext = ({
  gcdTime = 0,
} = {}) => {
  let weaveTime = gcdTime;
  let nextTime = 0; /* Amount of time looked ahead in loop */
  let comboStep = player.comboStep;
  let comboStatus = checkStatus({ name: 'Combo' });
  let mp = player.mp;
  let blood = player.blood;
  let darkarts = player.darkarts;

  let bloodweaponStatus = checkStatus({ name: 'Blood Weapon' });
  let deliriumStatus = checkStatus({ name: 'Delirium' });

  let floodofdarknessRecast = checkRecast({ name: 'Flood Of Darkness' }) - 500;
  let bloodweaponRecast = checkRecast({ name: 'Blood Weapon' }) - 1500;
  let edgeofdarknessRecast = checkRecast({ name: 'Edge Of Darkness' }) - 500;
  let saltedearthRecast = checkRecast({ name: 'Salted Earth' }) - 500;
  let plunge1Recast = checkRecast({ name: 'Plunge 1' }) - 500;
  let plunge2Recast = checkRecast({ name: 'Plunge 2' }) - 500;
  let abyssaldrainRecast = checkRecast({ name: 'Abyssal Drain' }) - 500;
  let carveandspitRecast = checkRecast({ name: 'Carve And Spit' }) - 500;
  let deliriumRecast = checkRecast({ name: 'Delirium' }) - 1500;
  let livingshadowRecast = checkRecast({ name: 'Living Shadow' }) - 500;

  const drkArray = [];

  while (nextTime < 22000) { /* Outside loop for GCDs, looks ahead this number ms */
    let loopTime = 0;
    if (weaveTime <= 1000) {
      const gcdAction = drkNextGCD({
        comboStatus,
        comboStep,
        blood,
        darkarts,
        bloodweaponStatus,
        deliriumStatus,
        deliriumRecast,
        livingshadowRecast,
      });

      drkArray.push({ name: gcdAction });

      if (drkComboActions.includes(gcdAction)) {
        if (player.level < 4
        || (player.level < 26 && gcdAction === 'Syphon Strike')
        || (player.level < 72 && gcdAction === 'Unleash')
        || gcdAction === 'Souleater'
        || gcdAction === 'Unmend') {
          /* Ends combo */
          comboStatus = -1;
          comboStep = '';
        } else {
          comboStatus = duration.combo;
          comboStep = gcdAction;
        }
      }

      if (bloodweaponStatus > 0) {
        mp += 600;
      }

      if (gcdAction === 'Syphon Strike') {
        mp += 600;
      } else if (gcdAction === 'Stalwart Soul') {
        mp += 600;
      }

      if (mp > 10000) {
        mp = 10000;
      } else if (mp < 0) {
        mp = 0;
      }

      /* Adjust blood */
      if (player.level >= 66 && bloodweaponStatus > 0) {
        blood += 10;
      }

      if (player.level >= 62 && gcdAction === 'Souleater') {
        blood += 20;
      } else if (gcdAction === 'Stalwart Soul') {
        blood += 20;
      } else if (deliriumStatus < 0 && drkBloodWeaponskills.includes(gcdAction)) {
        if (darkarts > 0) {
          darkarts = 0;
        } else {
          blood -= 50;
        }
      }

      /* Fix blood */
      if (blood > 100) {
        blood = 100;
      } else if (blood < 0) {
        blood = 0;
      }

      /* All drk GCDs are just the standard GCD, so no need to do more */
      if (drkSpells.includes(gcdAction)) {
        weaveTime = 2500;
      } else {
        weaveTime = player.gcd;
      }
      loopTime = weaveTime;
      nextTime += weaveTime;
    }

    while (weaveTime > 1000) {
      const ogcdAction = drkNextOGCD({
        weaveTime,
        comboStatus,
        comboStep,
        mp,
        blood,
        bloodweaponStatus,
        floodofdarknessRecast,
        bloodweaponRecast,
        edgeofdarknessRecast,
        saltedearthRecast,
        plunge1Recast,
        plunge2Recast,
        abyssaldrainRecast,
        deliriumRecast,
        carveandspitRecast,
        livingshadowRecast,
      });

      if (ogcdAction) {
        drkArray.push({ name: ogcdAction, size: 'small' });

        if (['Flood Of Darkness', 'Flood Of Shadow'].includes(ogcdAction)) {
          floodofdarknessRecast = recast.floodofdarkness;
          mp -= 3000;
        } else if (ogcdAction === 'Blood Weapon') {
          bloodweaponRecast = recast.bloodweapon;
          bloodweaponStatus = duration.bloodweapon + 1000;
          /* Extra buffer to assist with prediction */
        } else if (['Edge Of Darkness', 'Edge Of Shadow'].includes(ogcdAction)) {
          edgeofdarknessRecast = recast.edgeofdarkness;
          mp -= 3000;
        } else if (ogcdAction === 'Salted Earth') {
          saltedearthRecast = recast.saltedearth;
          weaveTime -= 1250;
        } else if (ogcdAction === 'Plunge') {
          plunge1Recast = plunge2Recast;
          plunge2Recast += recast.plunge;
        } else if (ogcdAction === 'Abyssal Drain') {
          abyssaldrainRecast = recast.abyssaldrain;
        } else if (ogcdAction === 'Carve And Spit') {
          carveandspitRecast = recast.carveandspit;
          mp += 600;
        } else if (ogcdAction === 'Delirium') {
          deliriumRecast = recast.delirium;
          deliriumStatus = duration.delirium + 2501;
        } else if (ogcdAction === 'Living Shadow') {
          livingshadowRecast = recast.livingshadow;
          blood -= 50;
        }
      }

      if (mp > 10000) {
        mp = 10000;
      } else if (mp < 0) {
        mp = 0;
      }

      if (blood > 100) {
        blood = 100;
      } else if (blood < 0) {
        blood = 0;
      }

      weaveTime -= 1250;
    }

    comboStatus -= loopTime;
    bloodweaponStatus -= loopTime;
    deliriumStatus -= loopTime;
    floodofdarknessRecast -= loopTime;
    bloodweaponRecast -= loopTime;
    edgeofdarknessRecast -= loopTime;
    saltedearthRecast -= loopTime;
    plunge1Recast -= loopTime;
    plunge2Recast -= loopTime;
    abyssaldrainRecast -= loopTime;
    carveandspitRecast -= loopTime;
    deliriumRecast -= loopTime;
    livingshadowRecast -= loopTime;
  }
  iconArrayB = drkArray;
  syncIcons();
};

onAction.DRK = (actionMatch) => {
  removeIcon({ name: actionMatch.groups.actionName });

  /* Set probable target count */
  // if (drkMultiTarget.includes(actionMatch.groups.actionName)) {
  //   player.targetCount = 2;
  // } else if (drkSingleTarget.includes(actionMatch.groups.actionName)) {
  //   player.targetCount = 1;
  // }

  if (drkComboActions.includes(actionMatch.groups.actionName)) {
    const gcdAction = actionMatch.groups.actionName;
    if (player.level < 4
    || (player.level < 26 && gcdAction === 'Syphon Strike')
    || (player.level < 72 && gcdAction === 'Unleash')
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
    drkNext({ gcdTime: player.gcd });
  }
};

onJobChange.DRK = () => {
  drkNext();
};

onTargetChanged.DRK = () => {
  // drkNext();
};
