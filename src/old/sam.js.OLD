// Keep collapsed, probably
nextActionOverlay.samJobChange = () => {
  nextActionOverlay.tsubamegaeshicomboStep = '';

  nextActionOverlay.actionList.weaponskills = [
    'Hakaze', 'Jinpu', 'Shifu', 'Gekko', 'Kasha', 'Yukikaze',
    'Fuga', 'Mangetsu', 'Oka',
    'Enpi',
  ];

  nextActionOverlay.actionList.iaijutsu = [
    'Higanbana', 'Tenka Goken', 'Midare Setsugekka',
  ];

  nextActionOverlay.castingList.iaijutsu = nextActionOverlay.actionList.iaijutsu;

  nextActionOverlay.actionList.tsubamegaeshi = [
    'Kaeshi: Higanbana', 'Kaeshi: Goken', 'Kaeshi: Setsugekka',
  ];

  nextActionOverlay.actionList.abilities = [
    'Hissatsu: Kaiten', 'Hissatsu: Gyoten', 'Hissatsu: Yaten',
    'Hissatsu: Shinten', 'Hissatsu: Kyuten', 'Hissatsu: Seigan',
    'Hissatsu: Guren', 'Hissatsu: Senei',
    'Third Eye', 'Meikyo Shisui', 'Merciful Eyes', 'Meditate', 'Hagakure', 'Ikishoten', 'Shoha',
    'Tsubame-gaeshi',
    'Second Wind', 'Leg Sweep', 'Bloodbath', 'Feint', 'Arm\'s Length', 'True North',
  ];

  nextActionOverlay.statusList.self = [
    'Jinpu', 'Third Eye', 'Eyes Open', 'Shifu', 'Meikyo Shisui', 'Hissatsu: Kaiten', 'Enhanced Enpi', 'Meditate',
    'Bloodbath', 'Arm\'s Length', 'True North',
    'Combo', 'Tsubame-gaeshi Combo',
  ];

  nextActionOverlay.statusList.target = [
    'Higanbana',
    'Feint',
  ];

  const { recast } = nextActionOverlay;

  recast.meikyoshisui = 55000;
  recast.hissatsukaiten = 1000;
  recast.hissatsugyoten = 10000;
  recast.hissatsuyaten = 10000;
  recast.mercifuleyes = 1000;
  recast.meditate = 60000;
  recast.hissatsushinten = 1000;
  recast.hissatsukyuten = 1000;
  recast.hissatsuseigan = 1000;
  recast.hagakure = 5000;
  recast.ikishoten = 60000;
  recast.hissatsuguren = 120000;
  recast.hissatsusenei = recast.hissatsuguren;
  recast.tsubamegaeshi = 60000;
  recast.shoha = 15000;

  const { duration } = nextActionOverlay;

  duration.jinpu = 40000;
  duration.thirdeye = 3000;
  duration.eyesopen = 15000;
  duration.shifu = 40000;
  duration.higanbana = 60000;
  duration.meikyoshisui = 15000;
  duration.hissatsukaiten = 10000;
  duration.meditate = 15000;

  const { icon } = nextActionOverlay;

  icon.hakaze = '003151';
  icon.jinpu = '003152';
  icon.shifu = '003156';
  icon.fuga = '003157';
  icon.gekko = '003158';
  icon.iaijutsu = '003159';
  icon.higanbana = '003160';
  icon.tenkagoken = '003161';
  icon.midaresetsugekka = '003162';
  icon.mangetsu = '003163';
  icon.kasha = '003164';
  icon.oka = '003165';
  icon.yukikaze = '003166';
  icon.meikyoshisui = '003167';
  icon.hissatsukaiten = '003168';
  icon.hissatsuyaten = '003170';
  icon.hissatsushinten = '003173';
  icon.hissatsukyuten = '003174';
  icon.hissatsuseigan = '003175';
  icon.hagakure = '003176';
  icon.hissatsuguren = '003177';
  icon.hissatsusenei = '003178';
  icon.ikishoten = '003179';
  icon.tsubamegaeshi = '003180';
  icon.kaeshihiganbana = '003181';
  icon.kaeshigoken = '003182';
  icon.kaeshisetsugekka = '003183';
  icon.shoha = '003184';

  nextActionOverlay.meleedpsRoleChange();
}; // Keep collapsed, probably

nextActionOverlay.samPlayerChange = (e) => {
  // This creates 8 part array for "unsupported" jobs - index is [0] to [7].
  const debugJobArray = e.detail.debugJob.split(' ');
  const senHex = parseInt(debugJobArray[6], 16);

  if ([2, 3, 6, 7].includes(senHex)) {
    nextActionOverlay.playerData.getsu = 1;
  } else {
    nextActionOverlay.playerData.getsu = 0;
  }

  if ([4, 5, 6, 7].includes(senHex)) {
    nextActionOverlay.playerData.ka = 1;
  } else {
    nextActionOverlay.playerData.ka = 0;
  }

  if ([1, 3, 5, 7].includes(senHex)) {
    nextActionOverlay.playerData.setsu = 1;
  } else {
    nextActionOverlay.playerData.setsu = 0;
  }

  nextActionOverlay.playerData.kenki = parseInt(debugJobArray[4], 16);
  nextActionOverlay.playerData.meditation = parseInt(debugJobArray[5], 16);
  // console.log(nextActionOverlay.playerData.getsu + ''
  // + nextActionOverlay.playerData.ka + ''
  // + nextActionOverlay.playerData.setsu);
  // console.log(nextActionOverlay.playerData.getsu
  // + nextActionOverlay.playerData.ka
  // + nextActionOverlay.playerData.setsu);
  // console.log(nextActionOverlay.playerData.kenki);
  // console.log(nextActionOverlay.playerData.meditation);
};

nextActionOverlay.samTargetChange = () => {
  if (nextActionOverlay.combat) { nextActionOverlay.samNextAction(); }
};

nextActionOverlay.samNextAction = ({
  delay = 0, casting,
} = {}) => {
  const { checkRecast } = nextActionOverlay;
  const { checkStatus } = nextActionOverlay;
  const { duration } = nextActionOverlay;
  const { recast } = nextActionOverlay;
  const { weaponskills } = nextActionOverlay.actionList;
  const { iaijutsu } = nextActionOverlay.actionList;
  const { tsubamegaeshi } = nextActionOverlay.actionList;
  const { level } = nextActionOverlay.playerData;

  let { comboStep } = nextActionOverlay;
  let { tsubamegaeshicomboStep } = nextActionOverlay;
  let { meikyoshisuiCount } = nextActionOverlay;
  let { getsu } = nextActionOverlay.playerData;
  let { ka } = nextActionOverlay.playerData;
  let { setsu } = nextActionOverlay.playerData;
  let { kenki } = nextActionOverlay.playerData;
  let { meditation } = nextActionOverlay.playerData;

  const loopRecast = {};
  const loopRecastList = nextActionOverlay.actionList.abilities;
  loopRecastList.forEach((actionName) => {
    const propertyName = actionName.replace(/[\s':-]/g, '').toLowerCase();
    loopRecast[propertyName] = checkRecast({ actionName });
  });

  const loopStatus = {};
  const loopStatusList = nextActionOverlay.statusList.self.concat(['Combo', 'Tsubame-gaeshi Combo']);
  loopStatusList.forEach((statusName) => {
    const propertyName = statusName.replace(/[\s':-]/g, '').toLowerCase();
    loopStatus[propertyName] = checkStatus({ statusName });
  });

  if (nextActionOverlay.targetData.id !== '') {
    loopStatus.higanbana = checkStatus({ statusName: 'Higanbana', id: nextActionOverlay.targetData.id });
  } else { loopStatus.higanbana = 999999; }

  let shifuModifier = 1;
  if (loopStatus.shifu > 0) {
    if (level >= 78) {
      shifuModifier = 0.87;
    } else {
      shifuModifier = 0.9;
    }
  }
  let gcd = nextActionOverlay.gcd * shifuModifier;

  const iconArray = [];

  let gcdTime = delay;
  let nextTime = 0;
  const nextMaxTime = 15000;

  while (nextTime < nextMaxTime) {
    let loopTime = 0;

    // Shifu (recalculate every loop)
    shifuModifier = 1;
    if (loopStatus.shifu > 0) {
      if (level >= 78) { shifuModifier = 0.87; } else { shifuModifier = 0.9; }
    }
    gcd = nextActionOverlay.gcd * shifuModifier;

    if (gcdTime === 0) {
      let nextGCD = '';
      if (nextTime === 0 && casting) {
        nextGCD = casting;
      } else {
        nextGCD = nextActionOverlay.samNextGCD({
          comboStep, tsubamegaeshicomboStep, getsu, ka, setsu, loopRecast, loopStatus,
        });
      }

      // Add Kaiten in front of Iaijutsu
      if (!casting && iaijutsu.includes(nextGCD) && level >= 52 && kenki >= 20) {
        iconArray.push({ name: 'Hissatsu: Kaiten', size: 'small' });
        loopStatus.hissatsukaiten = duration.hissatsukaiten;
        kenki -= 20;
      }

      iconArray.push({ name: nextGCD });

      if (weaponskills.includes(nextGCD)) {
        loopStatus.hissatsukaiten = -1;
        tsubamegaeshicomboStep = '';
        loopStatus.tsubamegaeshicombo = -1;
        if (meikyoshisuiCount > 0) { meikyoshisuiCount -= 1; }
        if (nextGCD === 'Enpi') { loopStatus.enhancedenpi = -1; }

        // Combo
        if ((level >= 4 && nextGCD === 'Hakaze')
        || (level >= 30 && nextGCD === 'Jinpu')
        || (level >= 40 && nextGCD === 'Shifu')) {
          comboStep = nextGCD;
          loopStatus.combo = duration.combo;
        } else {
          comboStep = '';
          loopStatus.combo = -1;
        }

        // Weaponskill-related buffs status
        if (nextGCD === 'Jinpu') { loopStatus.jinpu = 40000; } else
        if (nextGCD === 'Shifu') { loopStatus.shifu = 40000; } else
        if (nextGCD === 'Mangetsu' && loopStatus.jinpu > 0) { loopStatus.jinpu = Math.min(loopStatus.jinpu + 15000, 40000); } else
        if (nextGCD === 'Oka' && loopStatus.shifu > 0) { loopStatus.shifu = Math.min(loopStatus.shifu + 15000, 40000); } else
        if (nextGCD === 'Enpi') { loopStatus.enhancedenpi = -1; }

        // Sen
        if (['Gekko', 'Mangetsu'].includes(nextGCD)) { getsu = 1; } else
        if (['Kasha', 'Oka'].includes(nextGCD)) { ka = 1; } else
        if (nextGCD === 'Yukikaze') { setsu = 1; }

        // Kenki
        if (level >= 52 && ['Enpi', 'Gekko', 'Mangetsu', 'Kasha', 'Oka', 'Yukikaze'].includes(nextGCD)) { kenki = Math.min(kenki + 5, 100); }
        if (level >= 62) { kenki = Math.min(kenki + 5, 100); }

        gcdTime = gcd;
      } else if (iaijutsu.includes(nextGCD)) {
        loopStatus.hissatsukaiten = -1; // Iaijutsu are weaponskills
        meditation = Math.min(meditation + 1, 3);
        getsu = 0; ka = 0; setsu = 0;
        if (level >= 76) {
          tsubamegaeshicomboStep = nextGCD;
          loopStatus.tsubamegaeshicombo = duration.combo;
        }
        // Higanbana
        if (nextGCD === 'Higanbana') { loopStatus.higanbana = duration.higanbana + 1300; }
        // GCD and cast time
        if (level >= 74) { gcdTime = gcd - 1300; } else { gcdTime = gcd - 1800 * (gcd / 2500); }
      } else if (tsubamegaeshi.includes(nextGCD)) {
        meditation = Math.min(meditation + 1, 3);
        tsubamegaeshicomboStep = '';
        loopStatus.tsubamegaeshicombo = -1;
        loopRecast.tsubamegaeshi = recast.tsubamegaeshi;
        // Kaeshi: Higanbana - not needed probably
        // if (nextGCD === 'Kaeshi: Higanbana') { loopStatus.higanbana = duration.higanbana; }
        gcdTime = gcd; // No cast time for Kaeshi abilities
      }
      // Uncomment this to check rotation timings
      // console.log(`${Math.ceil(loopRecast.tsubamegaeshi)} ${nextGCD}`);
      loopTime += gcd;
    } else { loopTime = gcdTime; }

    // Update Combo status
    if (comboStep === '' || loopStatus.combo < 0) {
      comboStep = '';
      loopStatus.combo = -1;
    }

    if (tsubamegaeshicomboStep === '' || loopStatus.tsubamegaeshicombo < 0) {
      tsubamegaeshicomboStep = '';
      loopStatus.tsubamegaeshicombo = -1;
    }

    // Update Meikyo Shisui status
    if (meikyoshisuiCount <= 0 || loopStatus.meikyoshisui < 0) {
      meikyoshisuiCount = 0;
      loopStatus.meikyoshisui = -1;
    }

    let weaveMax = 0;
    if (gcdTime >= 1000) { weaveMax = 1; }

    let weave = 1;

    while (weave <= weaveMax) {
      const nextOGCD = nextActionOverlay.samNextOGCD({
        weave, weaveMax, comboStep, getsu, ka, setsu, kenki, meditation, loopRecast, loopStatus,
      });

      if (nextOGCD) {
        iconArray.push({ name: nextOGCD, size: 'small' });

        const propertyName = nextOGCD.replace(/[\s':-]/g, '').toLowerCase();
        if (recast[propertyName]) { loopRecast[propertyName] = recast[propertyName]; }
        if (duration[propertyName]) { loopStatus[propertyName] = duration[propertyName]; }

        // Special effects
        if (nextOGCD === 'Meikyo Shisui') {
          meikyoshisuiCount = 3;
        } else if (['Hissatsu: Shinten', 'Hissatsu: Kyuten'].includes(nextOGCD)) {
          kenki = Math.max(kenki - 25, 0);
        } else if (nextOGCD === 'Hissatsu: Seigan') {
          kenki = Math.max(kenki - 15, 0);
        } else if (nextOGCD === 'Hagakure') {
          kenki = Math.min(kenki + (getsu + ka + setsu) * 10, 100);
          getsu = 0; ka = 0; setsu = 0;
        } else if (nextOGCD === 'Ikishoten') {
          kenki = Math.min(kenki + 50, 100);
        } else if (['Hissatsu: Guren', 'Hissatsu: Senei'].includes(nextOGCD)) {
          loopRecast.hissatsuguren = duration.hissatsuguren;
          kenki = Math.max(kenki - 50, 0);
        } else if (nextOGCD === 'Shoha') {
          meditation = 0;
        }
      }
      weave += 1;
    }

    Object.keys(loopRecast).forEach((property) => {
      loopRecast[property] = Math.max(loopRecast[property] - loopTime, -1);
    });
    Object.keys(loopStatus).forEach((property) => {
      loopStatus[property] = Math.max(loopStatus[property] - loopTime, -1);
    });

    gcdTime = 0;
    nextTime += loopTime;
  }

  nextActionOverlay.NEWsyncIcons({ iconArray });

  clearTimeout(nextActionOverlay.timeout.nextAction);
  nextActionOverlay.timeout.nextAction = setTimeout(
    nextActionOverlay.samNextAction, gcd * shifuModifier * 2,
  );
};

nextActionOverlay.samNextGCD = ({
  comboStep, tsubamegaeshicomboStep, getsu, ka, setsu, loopRecast, loopStatus,
} = {}) => {
  const { targetCount } = nextActionOverlay;

  let { gcd } = nextActionOverlay;
  const { level } = nextActionOverlay.playerData;
  const sen = getsu + ka + setsu;
  if (loopStatus.shifu > 0) {
    if (level >= 78) {
      gcd *= 0.87;
    } else {
      gcd *= 0.9;
    }
  }

  // HIKEN!!! TSUBAME GAESHI!!!!!!!!!!!!!!111111oneeleventwelve
  if (loopStatus.tsubamegaeshicombo > 0 && loopRecast.tsubamegaeshi < 0) {
    // if (tsubamegaeshicomboStep === 'Higanbana') { return 'Kaeshi: Higanbana'; }
    if (tsubamegaeshicomboStep === 'Tenka Goken') { return 'Kaeshi: Goken'; }
    if (tsubamegaeshicomboStep === 'Midare Setsugekka') { return 'Kaeshi: Setsugekka'; }
  }

  // GCD alignments for Tsubame-gaeshi: https://docs.google.com/spreadsheets/d/1RiMt4oF5pR45Q-UjrlAUuE57zoze7YcVsTcIfZbJym4/edit#gid=1508947597

  // Iaijutsu (post-Tsubame)
  if (level >= 76 && loopStatus.jinpu > 0) {
    if (sen === 1 && loopRecast.tsubamegaeshi > gcd * 5 && loopStatus.higanbana < gcd * 7) {
      // Higanbana
      return 'Higanbana';
    } if (sen === 2 && targetCount > 1) {
      if (loopRecast.tsubamegaeshi < gcd) { return 'Tenka Goken'; }
      if (loopRecast.tsubamegaeshi > gcd * 5) { return 'Tenka Goken'; }
    } if (sen === 2 && loopRecast.tsubamegaeshi > gcd * 5 && loopRecast.tsubamegaeshi <= gcd * 6) {
      // Experimental Tenka on last possible GCD
      return 'Tenka Goken';
    } if (sen === 3) {
      // Use Midare immediately if Tsubame-gaeshi is ready
      if (loopRecast.tsubamegaeshi <= gcd * 1) { return 'Midare Setsugekka'; }
      // Use Sen to align for upcoming GCDs
      if (loopRecast.tsubamegaeshi > gcd * 5) {
        // Fire immediately if last possible GCD to use
        if (loopRecast.tsubamegaeshi <= gcd * 6) { return 'Midare Setsugekka'; }
        // Use if buffed
        if (loopStatus.jinpu > 0) { return 'Midare Setsugekka'; }
        // Use if otherwise stuck
        if (['Jinpu', 'Shifu', 'Fuga'].includes(comboStep) || loopStatus.meikyoshisui > 0) { return 'Midare Setsugekka'; }
      }
    }
  }

  // Iaijutsu (before level 76 and Tsubame-gaeshi)
  if (level < 76) {
    if (sen === 1 && loopStatus.higanbana < gcd * 7) {
      if (loopStatus.jinpu > 0 && loopStatus.higanbana < 0) { return 'Higanbana'; }
      if (['Jinpu', 'Shifu', 'Fuga'].includes(comboStep) || loopStatus.meikyoshisui > 0) { return 'Higanbana'; }
    } if (sen === 2 && (targetCount > 1 || level < 50)) {
      if (Math.min(loopStatus.jinpu, loopStatus.shifu) > 0) { return 'Tenka Goken'; }
      if (['Jinpu', 'Shifu', 'Fuga'].includes(comboStep) || loopStatus.meikyoshisui > 0) { return 'Tenka Goken'; }
    } if (sen === 3) {
      if (Math.min(loopStatus.jinpu, loopStatus.shifu) > 0) { return 'Midare Setsugekka'; }
      if (['Jinpu', 'Shifu', 'Fuga'].includes(comboStep) || loopStatus.meikyoshisui > 0) { return 'Midare Setsugekka'; }
    }
  }

  // Meikyo Shisui
  if (loopStatus.meikyoshisui > 0) {
    // Prioritize Gekko/Kasha if possible
    if (getsu === 0 && loopStatus.shifu <= loopStatus.jinpu) { return 'Gekko'; }
    if (ka === 0) { return 'Kasha'; }
    if (getsu === 0) { return 'Gekko'; }
    if (setsu === 0) { return 'Yukikaze'; }
    return 'Gekko';
  }

  // Combo weaponskills

  // Tsubame-gaeshi alignment
  if (level >= 76 && sen === 2 && loopRecast.tsubamegaeshi <= gcd * 4) {
    // This block might only happen if Meikyo gets flubbed or something... not sure
    if (loopRecast.tsubamegaeshi <= gcd * 2 && comboStep === 'Hakaze' && setsu === 0 && Math.min(loopStatus.jinpu, loopStatus.shifu) > 0) { return 'Yukikaze'; }
    if (loopRecast.tsubamegaeshi <= gcd * 2 && comboStep === 'Jinpu') { return 'Gekko'; }
    if (loopRecast.tsubamegaeshi <= gcd * 2 && comboStep === 'Shifu') { return 'Kasha'; }
    if (loopRecast.tsubamegaeshi <= gcd * 3 && comboStep === 'Hakaze' && ka === 0 && loopStatus.shifu <= loopStatus.jinpu) { return 'Shifu'; }
    if (loopRecast.tsubamegaeshi <= gcd * 3 && comboStep === 'Hakaze' && getsu === 0) { return 'Jinpu'; }
    if (loopRecast.tsubamegaeshi <= gcd * 3 && comboStep === 'Hakaze' && ka === 0) { return 'Shifu'; }
    if (loopRecast.tsubamegaeshi <= gcd * 2 && comboStep === 'Hakaze' && setsu === 0) { return 'Yukikaze'; }
    if (comboStep === '') { return 'Hakaze'; }
  }

  if (level >= 76 && sen === 1 && loopRecast.tsubamegaeshi <= gcd * 5) {
    if (loopRecast.tsubamegaeshi <= gcd * 3 && comboStep === 'Hakaze' && setsu === 0 && Math.min(loopStatus.jinpu, loopStatus.shifu) > 0) { return 'Yukikaze'; }
    if (loopRecast.tsubamegaeshi <= gcd * 3 && comboStep === 'Jinpu') { return 'Gekko'; }
    if (loopRecast.tsubamegaeshi <= gcd * 3 && comboStep === 'Shifu') { return 'Kasha'; }
    if (loopRecast.tsubamegaeshi <= gcd * 4 && comboStep === 'Hakaze' && ka === 0 && loopStatus.shifu <= loopStatus.jinpu) { return 'Shifu'; }
    if (loopRecast.tsubamegaeshi <= gcd * 4 && comboStep === 'Hakaze' && getsu === 0) { return 'Jinpu'; }
    if (loopRecast.tsubamegaeshi <= gcd * 4 && comboStep === 'Hakaze' && ka === 0) { return 'Shifu'; }
    if (loopRecast.tsubamegaeshi <= gcd * 3 && comboStep === 'Hakaze' && setsu === 0) { return 'Yukikaze'; }
    if (comboStep === '') { return 'Hakaze'; }
  }

  if (level >= 76 && sen === 0 && loopRecast.tsubamegaeshi <= gcd * 7) {
    if (loopRecast.tsubamegaeshi <= gcd * 4 && comboStep === 'Hakaze' && Math.min(loopStatus.jinpu, loopStatus.shifu) > 0) { return 'Yukikaze'; }
    if (loopRecast.tsubamegaeshi <= gcd * 5 && comboStep === 'Jinpu') { return 'Gekko'; }
    if (loopRecast.tsubamegaeshi <= gcd * 5 && comboStep === 'Shifu') { return 'Kasha'; }
    if (loopRecast.tsubamegaeshi <= gcd * 6 && comboStep === 'Hakaze' && loopStatus.shifu <= loopStatus.jinpu) { return 'Shifu'; }
    if (loopRecast.tsubamegaeshi <= gcd * 6 && comboStep === 'Hakaze') { return 'Jinpu'; }
    if (loopRecast.tsubamegaeshi <= gcd * 4 && comboStep === 'Hakaze') { return 'Yukikaze'; }
    if (comboStep === '') { return 'Hakaze'; }
    // There is a solution for Yukikaze @ 6 GCDs away, but leaving it out makes things more stable
    // Sen 1 above accounts for this accidentally happening or whatever, though
  }

  // Gekko/Kasha always after Jinpu/Shifu (even if you done messed up, probably)
  if (level >= 30 && comboStep === 'Jinpu') { return 'Gekko'; }
  if (level >= 40 && comboStep === 'Shifu') { return 'Kasha'; }

  // Continue off Hakaze
  if (comboStep === 'Hakaze') {
    // Yukikaze to quickly use Higanbana if it is off
    if (level >= 50 && sen === 0 && loopStatus.jinpu > 0 && loopStatus.higanbana < gcd) { return 'Yukikaze'; }

    // Build Sen normally otherwise
    if (level >= 40 && ka === 0 && loopStatus.shifu <= loopStatus.jinpu) { return 'Shifu'; }
    if (level >= 30 && getsu === 0) { return 'Jinpu'; }
    if (level >= 40 && ka === 0) { return 'Shifu'; }
    if (level >= 50 && setsu === 0 && Math.min(loopStatus.jinpu, loopStatus.shifu) > 0) { return 'Yukikaze'; }
    if (level >= 18 && loopStatus.shifu <= loopStatus.jinpu) { return 'Shifu'; }
    if (level >= 4) { return 'Jinpu'; }
  }

  // Continue off Fuga
  if (comboStep === 'Fuga') {
    if (level >= 45 && ka === 0 && loopStatus.shifu <= loopStatus.jinpu) { return 'Oka'; }
    if (level >= 35 && getsu === 0) { return 'Mangetsu'; }
    if (level >= 45 && ka === 0) { return 'Oka'; }
    if (level >= 45 && loopStatus.shifu <= loopStatus.jinpu) { return 'Oka'; }
    if (level >= 35) { return 'Mangetsu'; }
  }

  // Start Hakaze to apply Shifu/Jinpu
  if (Math.min(loopStatus.shifu, loopStatus.jinpu < 0)) {
    return 'Hakaze';
  }

  if (targetCount > 2) { return 'Fuga'; }
  if (loopStatus.enhancedenpi > 0) { return 'Enpi'; }
  return 'Hakaze';
};

nextActionOverlay.samNextOGCD = ({
  weave, comboStep, getsu, ka, setsu, kenki, meditation, loopRecast, loopStatus,
  // weave, weaveMax, comboStep, getsu, ka, setsu, kenki, meditation, loopRecast, loopStatus,
} = {}) => {
  const { targetCount } = nextActionOverlay;
  const { level } = nextActionOverlay.playerData;
  const zeroTime = 100 + 1250 * (weave - 1);

  const sen = getsu + ka + setsu;

  let { gcd } = nextActionOverlay;
  if (loopStatus.shifu > zeroTime) {
    if (level >= 78) {
      gcd *= 0.87;
    } else {
      gcd *= 0.9;
    }
  }

  // Meikyo Shisui
  if (level >= 50 && comboStep === '' && Math.min(loopStatus.jinpu, loopStatus.shifu) > zeroTime && loopRecast.meikyoshisui < zeroTime) {
    // Use Meikyo to get final Sen
    if (level >= 76 && sen === 0 && loopRecast.tsubamegaeshi <= gcd * 5) { return 'Meikyo Shisui'; }
    if (level >= 76 && sen <= 1 && loopRecast.tsubamegaeshi <= gcd * 4) { return 'Meikyo Shisui'; }
    if (level >= 76 && sen <= 2 && loopRecast.tsubamegaeshi <= gcd * 3) { return 'Meikyo Shisui'; }
    if (level < 76) {
      if (targetCount > 1 && sen < 2) { return 'Meikyo Shisui'; }
      if (sen !== 3) { return 'Meikyo Shisui'; }
    }
  }

  // Hagakure alignment before Tsubame-gaeshi
  if (level >= 76 && sen > 0 && comboStep === '' && loopRecast.tsubamegaeshi > gcd * 5) {
    // Must zero out sen at this GCD or annoying stuff happens
    if (loopRecast.tsubamegaeshi <= gcd * 6) { return 'Hagakure'; }
    // Zeroing out at 8 (or 6) allows 3 Gekko/Kasha under Meikyo
    // Zeroing out at 7 necessitates 1 Yukikaze under Meikyo
    if (loopRecast.tsubamegaeshi <= gcd * 8 && sen < 3) { return 'Hagakure'; }
  }

  // Ikishoten
  if (level >= 68 && kenki <= 50 && loopRecast.ikishoten < zeroTime) {
    return 'Ikishoten';
  }

  // Guren/Senei
  if (level >= 70 && kenki >= 50 && loopStatus.jinpu > zeroTime
  && loopRecast.hissatsuguren < zeroTime) {
    if (level >= 72 && targetCount === 1) { return 'Hissatsu: Senei'; }
    return 'Hissatsu: Guren';
  }

  if (level >= 80 && meditation >= 3) { return 'Shoha'; }

  // Clear space for Ikishoten
  if (level >= 68 && weave === 1 && kenki >= 50 && loopRecast.ikishoten < zeroTime + 1250) {
    if (targetCount > 1) { return 'Hissatsu: Kyuten'; }
    if (loopStatus.eyesopen > zeroTime) { return 'Hissatsu: Seigan'; }
    return 'Hissatsu: Shinten';
  }

  // Spend excess kenki
  let kenkiTarget = 40;
  if (level >= 70 && loopRecast.hissatsuguren < loopRecast.ikishoten) { kenkiTarget = 70; }
  if (level >= 64 && targetCount > 1 && kenki >= kenkiTarget + 25) { return 'Hissatsu: Kyuten'; }
  if (level >= 66 && kenki >= kenkiTarget + 15 && loopStatus.eyesopen > zeroTime) { return 'Hissatsu: Seigan'; }
  if (level >= 62 && kenki >= kenkiTarget + 25) { return 'Hissatsu: Shinten'; }

  // No OGCD action
  return '';
};

nextActionOverlay.samActionMatch = (actionMatch) => {
  // Shortens some stuff
  const { duration } = nextActionOverlay;
  const { recast } = nextActionOverlay;
  // const targetID = actionMatch.groups.targetID;
  const { weaponskills } = nextActionOverlay.actionList;
  const { iaijutsu } = nextActionOverlay.actionList;
  const { tsubamegaeshi } = nextActionOverlay.actionList;
  const { abilities } = nextActionOverlay.actionList;
  const { level } = nextActionOverlay.playerData;

  // Shorten common functions
  const { addStatus } = nextActionOverlay;
  const { checkStatus } = nextActionOverlay;
  const { removeStatus } = nextActionOverlay;
  const { addRecast } = nextActionOverlay;
  // const { checkRecast } = nextActionOverlay;

  const { actionName } = actionMatch.groups;
  const { comboCheck } = actionMatch.groups;

  nextActionOverlay.NEWremoveIcon({ name: actionName });

  let shifuModifier = 1;
  if (checkStatus({ statusName: 'Shifu' }) > 0) {
    if (level >= 78) {
      shifuModifier = 0.87;
    } else {
      shifuModifier = 0.9;
    }
  }
  const gcd = nextActionOverlay.gcd * shifuModifier;

  const singletargetActions = [
    'Hakaze', 'Higanbana', 'Midare Setsugekka', 'Enpi',
    'Hissatsu: Shinten', 'Hissatsu: Seigan', 'Hissatsu: Senei',
  ];

  const multitargetActions = [
    'Fuga', 'Mangetsu', 'Oka', 'Tenka Goken',
    'Hissatsu: Kyuten', 'Hissatsu: Guren',
  ];

  if (singletargetActions.includes(actionName)) {
    nextActionOverlay.targetCount = 1;
  } else if (multitargetActions.includes(actionName) && actionMatch.groups.logType === '15') {
    // Multi target only hits single target
    nextActionOverlay.targetCount = 1;
  }

  // Set generic recast/duration
  const propertyName = actionName.replace(/[\s':-]/g, '').toLowerCase();
  if (recast[propertyName]) { addRecast({ actionName }); }
  if (duration[propertyName]) { addStatus({ statusName: actionName }); }

  if (weaponskills.includes(actionName)) {
    removeStatus({ statusName: 'Tsubame-gaeshi Combo' });
    nextActionOverlay.tsubamegaeshicomboStep = '';

    if (checkStatus({ statusName: 'Meikyo Shisui' }) > 0 && nextActionOverlay.meikyoshisuiCount > 0) {
      nextActionOverlay.meikyoshisuiCount -= 1;
      if (nextActionOverlay.meikyoshisuiCount <= 0) { removeStatus({ statusName: 'Meikyo Shisui' }); }
    } else if ((level >= 4 && actionName === 'Hakaze')
    || (comboCheck && checkStatus({ statusName: 'Combo' }) > 0
    && ((level >= 30 && actionName === 'Jinpu')
    || (level >= 40 && actionName === 'Shifu')
    || (level >= 35 && actionName === 'Fuga')))) {
      addStatus({ statusName: 'Combo' });
      nextActionOverlay.comboStep = actionName;
    } else {
      removeStatus({ statusName: 'Combo' });
      nextActionOverlay.comboStep = '';
    }

    nextActionOverlay.samNextAction({ delay: gcd });
  } else if (iaijutsu.includes(actionName)) {
    if (level >= 76) {
      nextActionOverlay.tsubamegaeshicomboStep = actionName;
      addStatus({ statusName: 'Tsubame-gaeshi Combo', duration: duration.combo });
    }

    if (actionName === 'Higanbana') { addStatus({ statusName: 'Higanbana', id: nextActionOverlay.targetData.id }); }

    let castTime = 1800 * (gcd / 2500);
    if (level >= 74) { castTime = 1300; }

    nextActionOverlay.samNextAction({ delay: gcd - castTime });
  } else if (tsubamegaeshi.includes(actionName)) {
    nextActionOverlay.tsubamegaeshicomboStep = '';
    removeStatus({ statusName: 'Tsubame-gaeshi Combo' });
    addRecast({ actionName: 'Tsubame-gaeshi' });

    // I mean... might as well
    if (actionName === 'Kaeshi: Higanbana') { addStatus({ statusName: 'Higanbana', id: nextActionOverlay.targetData.id }); }

    nextActionOverlay.samNextAction({ delay: gcd });
  } else if (abilities.includes(actionName)) {
    if (actionName === 'Meikyo Shisui') {
      nextActionOverlay.meikyoshisuiCount = 3;
    } else if (actionName === 'Hissatsu: Guren') {
      nextActionOverlay.NEWremoveIcon({ name: 'Hissatsu: Senei' });
    } else if (actionName === 'Hissatsu: Senei') {
      nextActionOverlay.NEWremoveIcon({ name: 'Hissatsu: Guren' });
      addRecast({ actionName: 'Hissatsu: Guren' });
    } else if (['Merciful Eyes', 'Hissatsu: Seigan'].includes(actionName)) {
      removeStatus({ statusName: 'Eyes Open' });
    }
  }
};

nextActionOverlay.samStatusMatch = (statusMatch) => {
  const { addStatus } = nextActionOverlay;
  const { removeStatus } = nextActionOverlay;

  if (statusMatch.groups.gainsLoses === 'gains') {
    addStatus({
      statusName: statusMatch.groups.statusName,
      duration: parseFloat(statusMatch.groups.statusDuration) * 1000,
      id: statusMatch.groups.targetID,
    });
  } else {
    removeStatus({
      statusName: statusMatch.groups.statusName,
      id: statusMatch.groups.targetID,
    });
    if (statusMatch.groups.statusName === 'Mudra') {
      nextActionOverlay.mudraCount = 0;
    } else if (statusMatch.groups.statusName === 'Ten Chi Jin') {
      nextActionOverlay.tenchijinCount = 0;
    }
  }
};

nextActionOverlay.samCastingMatch = (castingMatch) => {
  nextActionOverlay.samNextAction({ casting: castingMatch.groups.actionName });
  nextActionOverlay.NEWfadeIcon({ name: castingMatch.groups.actionName });
};

nextActionOverlay.rdmCancelMatch = (cancelMatch) => {
  nextActionOverlay.NEWunfadeIcon({ name: cancelMatch.groups.actionName });
  nextActionOverlay.samNextAction();
};
