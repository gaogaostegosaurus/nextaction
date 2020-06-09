
const brdWeaponskills = [
  'Heavy Shot', 'Burst Shot',
  'Straight Shot', 'Refulgent Arrow',
  'Venomous Bite', 'Caustic Bite', 'Windbite', 'Stormbite', 'Iron Jaws',
  'Apex Arrow',
  'Quick Nock',
];

const brdCooldowns = [
  'Raging Strikes', 'Barrage', 'Battle Voice', 'Pitch Perfect', 'Empyreal Arrow',
  'Sidewinder', 'Shadowbite',
  'Bloodletter', 'Rain Of Death',
];

const brdSongs = [
  'Mage\'s Ballad', 'Army\'s Paeon', 'The Wanderer\'s Minuet',
];

const brdMultiTarget = [
  'Quick Nock',
];

const brdSingleTarget = [
  'Heavy Shot', 'Burst Shot',
];

actionList.BRD = [...new Set([
  ...brdWeaponskills,
  ...brdCooldowns,
  ...brdSongs,
])];

statusList.BRD = [
  'Straight Shot Ready', 'Raging Strikes', 'Barrage', 'Battle Voice',
  'Venomous Bite', 'Windbite', 'Caustic Bite', 'Stormbite',
];

const brdNextGCD = ({
  venomousbiteStatus,
  windbiteStatus,
  soulvoice,
  straightshotreadyStatus,
} = {}) => {
  if (straightshotreadyStatus > 0 && straightshotreadyStatus < player.gcd * 2) {
    if (player.level >= 70) {
      return 'Refulgent Arrow';
    } return 'Straight Shot';
  }

  if (player.level >= 30 && windbiteStatus < player.gcd) {
    if (player.level >= 64) {
      return 'Stormbite';
    } return 'Windbite';
  }

  if (player.level >= 6 && venomousbiteStatus < player.gcd) {
    if (player.level >= 64) {
      return 'Caustic Bite';
    } return 'Venomous Bite';
  }

  if (player.level >= 54 && Math.min(venomousbiteStatus, windbiteStatus) > 0
  && Math.min(venomousbiteStatus, windbiteStatus) < player.gcd * 3) {
    return 'Iron Jaws';
  }

  if (soulvoice >= 100) {
    return 'Apex Arrow';
  }

  if (player.targetCount > 2) {
    return 'Quick Nock';
  }

  if (straightshotreadyStatus > 0) {
    if (player.level >= 70) {
      return 'Refulgent Arrow';
    } return 'Straight Shot';
  }

  if (player.targetCount > 1) {
    return 'Quick Nock';
  }

  if (player.level >= 76) {
    return 'Burst Shot';
  } return 'Heavy Shot';
};

const brdNextOGCD = ({
  gcdTime,
  songName,
  songStatus,
  repertoire,
  magesballadRecast,
  armyspaeonRecast,
  thewanderersminuetRecast,
  straightshotreadyStatus,
  ragingstrikesStatus,
  venomousbiteStatus,
  windbiteStatus,
  ragingstrikesRecast,
  bloodletterRecast,
  barrageRecast,
  battlevoiceRecast,
  pitchperfectRecast,
  empyrealarrowRecast,
  sidewinderRecast,
} = {}) => {
  if (songStatus < player.gcd) { /* No song or song ending */
    if (player.level >= 52 && thewanderersminuetRecast < 0) {
      return 'The Wanderer\'s Minuet';
    } else if (player.level >= 30 && magesballadRecast < 0) {
      return 'Mage\'s Ballad';
    } else if (player.level >= 40 && armyspaeonRecast < 0) {
      return 'Army\'s Paeon';
    }
  } else if (player.level >= 52 && magesballadRecast < 30000 && armyspaeonRecast < 60000
  && thewanderersminuetRecast < 0) {
    return 'The Wanderer\'s Minuet';
  }

  if (songName === 'The Wanderer\'s Minuet' && ragingstrikesRecast < 0) {
    return 'Raging Strikes';
  }

  if (player.level >= 50 && battlevoiceRecast < 0) {
    return 'Battle Voice';
  }

  if (player.level >= 38 && ragingstrikesStatus > 0 && straightshotreadyStatus < 0
  && barrageRecast < 0) {
    return 'Barrage';
  }

  if (songName === 'The Wanderer\'s Minuet' && repertoire >= 3 && pitchperfectRecast < 0) {
    return 'Pitch Perfect';
  }

  if (songName === 'Mage\'s Ballad' && gcdTime > 1500) {
    return 'Bloodletter';
  }

  if (player.level >= 54 && songStatus > player.gcd && gcdTime > 1500 && empyrealarrowRecast < 0) {
    return 'Empyreal Arrow';
  }

  if (player.level >= 60 && Math.min(venomousbiteStatus, windbiteStatus) > player.gcd
  && sidewinderRecast < 0) {
    return 'Sidewinder';
  }

  if (player.level >= 15 && bloodletterRecast < 0) {
    return 'Bloodletter';
  }

  return '';
};

const brdNext = ({
  gcd = 0,
} = {}) => {
  let gcdTime = gcd;
  let nextTime = 0; /* Tracks how "long" the loop has lasted */

  let songName = player.songName;
  let songStatus = player.songStatus;
  let repertoire = player.repertoire;
  let soulvoice = player.soulvoice;


  let straightshotreadyStatus = checkStatus({ name: 'Straight Shot Ready' });
  let ragingstrikesStatus = checkStatus({ name: 'Raging Strikes' });
  let venomousbiteStatus = checkStatus({ name: 'Venomous Bite' });
  let windbiteStatus = checkStatus({ name: 'Windbite' });

  let ragingstrikesRecast = checkRecast({ name: 'Raging Strikes' });
  let bloodletterRecast = checkRecast({ name: 'Bloodletter' });
  let magesballadRecast = checkRecast({ name: 'Mage\'s Ballad' });
  let armyspaeonRecast = checkRecast({ name: 'Army\'s Paeon' });
  let thewanderersminuetRecast = checkRecast({ name: 'The Wanderer\'s Minuet' });
  let barrageRecast = checkRecast({ name: 'Barrage' });
  let battlevoiceRecast = checkRecast({ name: 'Battle Voice' });
  let pitchperfectRecast = checkRecast({ name: 'Pitch Perfect' });
  let empyrealarrowRecast = checkRecast({ name: 'Empyreal Arrow' });
  let sidewinderRecast = checkRecast({ name: 'Sidewinder' });


  const brdArray = [];

  while (nextTime < 15000) {
    let loopTime = 0;

    /* If no time for OGCD, use GCD */
    if (gcdTime <= 1000) {
      const nextGCD = brdNextGCD({
        venomousbiteStatus,
        windbiteStatus,
        soulvoice,
        straightshotreadyStatus,
      });

      brdArray.push({ name: nextGCD });

      if (['Straight Shot', 'Refulgent Arrow'].includes(nextGCD)) {
        straightshotreadyStatus = -1;
      } else if (['Venomous Bite', 'Caustic Bite'].includes(nextGCD)) {
        venomousbiteStatus = duration.venomousbite;
      } else if (['Windbite', 'Stormbite'].includes(nextGCD)) {
        windbiteStatus = duration.windbite;
      } else if (nextGCD === 'Iron Jaws') {
        if (venomousbiteStatus > 0) {
          venomousbiteStatus = duration.venomousbite;
        }
        if (windbiteStatus > 0) {
          windbiteStatus = duration.windbite;
        }
      } else if (nextGCD === 'Apex Arrow') {
        soulvoice = 0;
      }

      gcdTime = player.gcd;

      /* Loop */
      loopTime = gcdTime; /* Sets current loop's "length" to GCD length */
      nextTime += loopTime; /* Sets adds current loop's time to total time looked ahead */
    }

    while (gcdTime > 1000) {
      const nextOGCD = brdNextOGCD({
        gcdTime,
        songName,
        songStatus,
        repertoire,
        magesballadRecast,
        armyspaeonRecast,
        thewanderersminuetRecast,
        straightshotreadyStatus,
        ragingstrikesStatus,
        venomousbiteStatus,
        windbiteStatus,
        ragingstrikesRecast,
        bloodletterRecast,
        barrageRecast,
        battlevoiceRecast,
        pitchperfectRecast,
        empyrealarrowRecast,
        sidewinderRecast,
      });

      if (nextOGCD) {
        brdArray.push({ name: nextOGCD, size: 'small' });

        if (nextOGCD === 'Raging Strikes') {
          ragingstrikesRecast = recast.ragingstrikes;
          ragingstrikesStatus = duration.ragingstrikes;
        } else if (['Bloodletter', 'Rain Of Death'].includes(nextOGCD)) {
          repertoire = 0;
          bloodletterRecast = recast.bloodletter;
        } else if (brdSongs.includes(nextOGCD)) {
          if (nextOGCD === 'Mage\'s Ballad') {
            magesballadRecast = recast.magesballad;
          } else if (nextOGCD === 'Army\'s Paeon') {
            armyspaeonRecast = recast.armyspaeon;
          } else if (nextOGCD === 'The Wanderer\'s Minuet') {
            thewanderersminuetRecast = recast.thewanderersminuet;
          }
          songName = nextOGCD;
          songStatus = duration.song;
        } else if (nextOGCD === 'Barrage') {
          barrageRecast = recast.barrage;
          straightshotreadyStatus = duration.straightshotready;
        } else if (nextOGCD === 'Battle Voice') {
          battlevoiceRecast = recast.battlevoice;
        } else if (nextOGCD === 'Pitch Perfect') {
          repertoire = 0;
          pitchperfectRecast = recast.pitchperfect;
        } else if (nextOGCD === 'Empyreal Arrow') {
          repertoire += 1;
          empyrealarrowRecast = recast.empyrealarrow;
        } else if (['Sidewinder', 'Shadowbite'].includes(nextOGCD)) {
          sidewinderRecast = recast.sidewinder;
        }
      }
      gcdTime -= 1000;
    }

    songStatus -= loopTime;
    magesballadRecast -= loopTime;
    armyspaeonRecast -= loopTime;
    thewanderersminuetRecast -= loopTime;

    ragingstrikesRecast -= loopTime;
    straightshotreadyStatus -= loopTime;
    ragingstrikesStatus -= loopTime;
    venomousbiteStatus -= loopTime;
    windbiteStatus -= loopTime;

    bloodletterRecast -= loopTime;
    barrageRecast -= loopTime;
    battlevoiceRecast -= loopTime;
    pitchperfectRecast -= loopTime;
    empyrealarrowRecast -= loopTime;
    sidewinderRecast -= loopTime;
  }
  iconArrayB = brdArray;
  syncIcons();
};


onJobChange.BRD = () => {
  brdNext();
};

onTargetChanged.BRD = () => { /* Re-checks DoTs after switching targets */
  if (player.combat === 0) {
    brdNext({ gcd: player.gcd });
  }
};

onAction.BRD = (actionMatch) => {
  removeIcon({ name: actionMatch.groups.actionName });

  if (brdMultiTarget.includes(actionMatch.groups.actionName)) {
    player.targetCount = 3;
  } else if (brdSingleTarget.includes(actionMatch.groups.actionName)) {
    player.targetCount = 1;
  }

  if (brdWeaponskills.includes(actionMatch.groups.actionName)) {
    if (['Straight Shot', 'Refulgent Arrow'].includes(actionMatch.groups.actionName)) {
      removeStatus({ name: 'Straight Shot Ready' });
    } else if (['Venomous Bite', 'Caustic Bite'].includes(actionMatch.groups.actionName)) {
      addStatus({ name: 'Venomous Bite' });
    } else if (['Windbite', 'Stormbite'].includes(actionMatch.groups.actionName)) {
      addStatus({ name: 'Windbite' });
    } else if (actionMatch.groups.actionName === 'Iron Jaws') {
      if (checkStatus({ name: 'Venomous Bite' }) > 0) {
        addStatus({ name: 'Venomous Bite' });
      }
      if (checkStatus({ name: 'Windbite' }) > 0) {
        addStatus({ name: 'Windbite' });
      }
    }
    brdNext({ gcd: player.gcd });
  } else if (brdSongs.includes(actionMatch.groups.actionName)) {
    addRecast({ name: actionMatch.groups.actionName });
  } else if (brdCooldowns.includes(actionMatch.groups.actionName)) {
    if (actionMatch.groups.actionName === 'Raging Strikes') {
      addStatus({ name: actionMatch.groups.actionName });
    } else if (['Bloodletter', 'Rain Of Death'].includes(actionMatch.groups.actionName)) {
      addRecast({ name: 'Bloodletter' });
    } else if (actionMatch.groups.actionName === 'Barrage') {
      addStatus({ name: 'Straight Shot Ready' });
    } else if (actionMatch.groups.actionName === 'Shadowbite') {
      addRecast({ name: 'Sidewinder' });
    }
    addRecast({ name: actionMatch.groups.actionName });
  }
  // console.log(checkStatus({ name: 'Straight Shot Ready' }));
};

onStatus.BRD = (statusMatch) => {
  if (statusMatch.groups.gainsLoses === 'gains') {
    addStatus({
      name: statusMatch.groups.statusName,
      time: parseFloat(statusMatch.groups.statusDuration) * 1000,
      id: statusMatch.groups.targetID,
    });
    if (statusMatch.groups.statusName === 'Caustic Bite') {
      addStatus({
        name: 'Venomous Bite',
        time: parseFloat(statusMatch.groups.statusDuration) * 1000,
        id: statusMatch.groups.targetID,
      });
    } else if (statusMatch.groups.statusName === 'Stormbite') {
      addStatus({
        name: 'Windbite',
        time: parseFloat(statusMatch.groups.statusDuration) * 1000,
        id: statusMatch.groups.targetID,
      });
    } else if (statusMatch.groups.statusName === 'Straight Shot Ready') {
      brdNext({ gcd: 0 });
    }
  } else {
    removeStatus({ name: statusMatch.groups.statusName, id: statusMatch.groups.targetID });
  }
};
