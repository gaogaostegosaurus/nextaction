
/* https://github.com/quisquous/cactbot/blob/master/CactbotOverlay/JSEvents.cs shows all possible events */

/* This seems useful to eventually add ?
addOverlayListener('onInitializeOverlay', (e) => {
}); */

const actionList = {};
const statusList = {};
const castingList = {};

// Objects
let recastTracker = {}; // Holds timestamps for cooldowns
let cooldowntime = {}; // Holds timestamps for cooldowns
let nextTimeout;

const player = {};
player.gcd = 2500;

const target = {};

// RegEx matching strings


const removeAnimationTime = 1000;

const timeout = {}; // For timeout variables
const toggle = {}; // Toggley things
const count = {}; // County things?
let potency = {};
let previous = {};
let next = {};

const onAction = {};
const onCasting = {};
const onCancel = {};
const onStatus = {};

const onTargetChanged = {};
const onJobChange = {};

let debounceTimestamp = 0;

let actionRegExp;
let statusRegExp;
let castingRegExp;
let cancelRegExp;
// let addedRegExp;

/* This regex matches a line appearing during various things:
  zone change, eating food, changing equipment, maybe more? */
const statsRegExp = new RegExp(' 0C:Player Stats: (?<jobID>[\\d]+):(?<strength>[\\d]+):(?<dexterity>[\\d]+):(?<vitality>[\\d]+):(?<intelligence>[\\d]+):(?<mind>[\\d]+):(?<piety>[\\d]+):(?<attackPower>[\\d]+):(?<directHitRate>[\\d]+):(?<criticalHit>[\\d]+):(?<attackMagicPotency>[\\d]+):(?<healingMagicPotency>[\\d]+):(?<determination>[\\d]+):(?<skillSpeed>[\\d]+):(?<spellSpeed>[\\d]+):0:(?<tenacity>[\\d]+)');

addOverlayListener('onPlayerChangedEvent', (e) => {
  // console.log(JSON.stringify(e));
  player.id = e.detail.id.toString(16).toUpperCase();
  player.name = e.detail.name;
  player.job = e.detail.job;
  player.level = e.detail.level;
  // player.currentHP = e.detail.currentHP;
  // player.maxHP = e.detail.maxHP;
  player.mp = e.detail.currentMP;
  // player.maxMP = e.detail.maxMP;
  // player.currentShield = e.detail.currentShield;
  /* Create 8 part array for unsupported jobs - use [0] to [7].
  Need to use parseInt because 04 is not the same as 4. */
  const debugJobArray = e.detail.debugJob.split(' ');

  if (player.job === 'BRD') {
    if (e.detail.jobDetail.songName === 'Ballad') {
      player.songName = 'Mage\'s Ballad';
    } else if (e.detail.jobDetail.songName === 'Paeon') {
      player.songName = 'Army\'s Paeon';
    } else if (e.detail.jobDetail.songName === 'Minuet') {
      player.songName = 'The Wanderer\'s Minuet';
    } else if (e.detail.jobDetail.songName === 'None') {
      player.songName = '';
    }
    player.songStatus = e.detail.jobDetail.songMilliseconds;
    player.repertoire = e.detail.jobDetail.songProcs;
    player.soulvoice = e.detail.jobDetail.soulGauge;
  } else if (player.job === 'DNC') { // Temporary
    player.fourfoldFeathers = parseInt(debugJobArray[0], 16); /* 0-4 */
    player.esprit = parseInt(debugJobArray[1], 16); /* 0-100 */
    /* Steps - 1 is Emboite, 2 is Entrechat, 3 is Jete, 4 is Pirouette */
    player.step1 = parseInt(debugJobArray[2], 16);
    player.step2 = parseInt(debugJobArray[3], 16);
    player.step3 = parseInt(debugJobArray[4], 16);
    player.step4 = parseInt(debugJobArray[5], 16);
    player.stepTotal = debugJobArray[6]; /* 0-4 */
  } else if (player.job === 'GNB') {
    player.cartridges = e.detail.jobDetail.cartridges;
    // player.cartridges = parseInt(debugJobArray[0], 16); /* 0-2 */
  } else if (player.job === 'MCH') {
    player.heat = e.detail.jobDetail.heat;
    player.overheated = e.detail.jobDetail.overheatMilliseconds;
    if (player.overheated === 0) {
      player.overheated = -1;
    } /* Simplifies comparisons */
    player.battery = e.detail.jobDetail.battery;
  } else if (player.job === 'NIN') {
    player.huton = e.detail.jobDetail.hutonMilliseconds;
    if (player.huton === 0) {
      player.huton = -1;
    }
    player.ninki = e.detail.jobDetail.ninkiAmount;
  } else if (player.job === 'PLD') {
    player.oath = e.detail.jobDetail.oath;
  } else if (player.job === 'RDM') {
    player.blackmana = e.detail.jobDetail.blackMana;
    player.whitemana = e.detail.jobDetail.whiteMana;
  } else if (player.job === 'SCH') {
    player.aetherflow = parseInt(debugJobArray[2], 16); /* 0-3 */
    // player.faerie = parseInt(debugJobArray[3], 16); /* 0-100 */
    // healerLucidDreaming();
  } else if (player.job === 'SMN') {
    player.aetherflow = e.detail.jobDetail.aetherflowStacks; /* 0-3 */
    player.dreadwyrmAether = e.detail.jobDetail.dreadwyrmStacks; /* 0-2 */
    player.firebirdToggle = e.detail.jobDetail.bahamutStacks; /* 0-1 */
    if (player.firebirdToggle === 1) {
      player.dreadwyrm = -1;
      player.firebird = e.detail.jobDetail.dreadwyrmMilliseconds;
    } else {
      player.dreadwyrm = e.detail.jobDetail.dreadwyrmMilliseconds;
      player.firebird = -1;
    }
    // player.firebird = player.dreadwyrm;
    player.bahamut = e.detail.jobDetail.bahamutMilliseconds;
    // player.faerie = parseInt(debugJobArray[3], 16); /* 0-100 */
    // healerLucidDreaming();
  } else if (player.job === 'WHM') {
    // player.lilies = parseInt(debugJobArray[4], 16);
    player.bloodLily = parseInt(debugJobArray[5], 16); /* 0-3 */
    // healerLucidDreaming();
  }

  /* Detects name/job/level change and clears elements */
  if (player.job && (previous.job !== player.job || previous.level !== player.level)) {
    previous.job = player.job;
    previous.level = player.level;

    /* Reset all player.whatever variables */
    player.gcd = 2500;
    player.mpRegen = 200;
    player.targetCount = 1;
    player.comboStep = '';
    player.comboTime = -1;
    player.ninjutsuCount = 0;
    player.mudraCount = 0;

    let actionNames = '';
    if (actionList[player.job]) {
      actionNames = actionList[player.job].join('|');
    }
    actionRegExp = new RegExp(`^.{15}(?<logType>1[56]):(?<sourceID>${player.id}):(?<sourceName>${player.name}):(?<actionID>[\\dA-F]{1,8}):(?<actionName>${actionNames}):(?<targetID>[\\dA-F]{8}):(?<comboCheck>([^:]*:)*?1?1B:)?`);

    let statusNames = '';
    if (statusList[player.job]) {
      statusNames = statusList[player.job].join('|');
    }
    statusRegExp = new RegExp(`^.{15}(?<logType>1[AE]):(?<targetID>[\\dA-F]{8}):(?<targetName>[ -~]+?) (?<gainsLoses>gains|loses) the effect of (?<statusName>${statusNames}) from (?<sourceName>${player.name})(?: for )?(?<statusDuration>\\d*\\.\\d*)?(?: Seconds)?\\.`);

    let castingNames = '';
    if (castingList[player.job]) {
      castingNames = castingList[player.job].join('|');
    }
    castingRegExp = new RegExp(`^.{15}00:(?<logType>[\\da-f]+):You begin casting (?<actionName>${castingNames})\\.`, 'i');
    cancelRegExp = new RegExp(`^.{15}00:(?<logType>[\\da-f]+):You cancel (?<actionName>${castingNames})\\.`, 'i');

    resetNext();
    onJobChange[player.job]();
    // console.log(`Changed to ${player.job}${player.level}`);
    // console.log(JSON.stringify(e));
  }
});

addOverlayListener('onLogEvent', (e) => { // Fires on log event
  const logLength = e.detail.logs.length;

  for (let i = 0; i < logLength; i += 1) {
    const actionMatch = e.detail.logs[i].match(actionRegExp);
    const statusMatch = e.detail.logs[i].match(statusRegExp);
    const castingMatch = e.detail.logs[i].match(castingRegExp);
    const cancelMatch = e.detail.logs[i].match(cancelRegExp);
    const statsMatch = e.detail.logs[i].match(statsRegExp);
    // const addedMatch = e.detail.logs[i].match(addedRegExp);

    if (actionMatch) {
      if (actionMatch.groups.logType === '15') {
        onAction[player.job](actionMatch);
        // if (actionMatch.groups.targetID.startsWith('4')) {
        // if (!previous.aoe || Date.now() - previous.aoe > 100) {
        //   clearTimeout(timeout.aoe);
        //   previous.aoe = Date.now();
        //   // count.targets = 1;
        //   timeout.aoe = setTimeout(onAction[player.job], 100, actionMatch);
        // } else {
        //   clearTimeout(timeout.aoe);
        //   // count.targets += 1;
        //   timeout.aoe = setTimeout(onAction[player.job], 100, actionMatch);
        // }
        // /* This is slightly more complicated... for no reason? Was there a reason? */
        // const property = actionMatch.groups.actionName.replace(/[\s'-:]/g, '').toLowerCase();
        // if (!previous[`${property}Match`] || Date.now() - previous[`${property}Match`] > 10) {
        //   previous[`${property}Match`] = Date.now();
        //   count.targets = 1;
        //   timeout[`${property}Match`] = setTimeout(onAction[player.job], 100, actionMatch);
        // } else {
        //   clearTimeout(timeout[`${property}Match`]);
        //   count.targets += 1;
        //   timeout[`${property}Match`] = setTimeout(onAction[player.job], 100, actionMatch);
        // }
        // }
      } else if (actionMatch.groups.logType === '16' && Date.now() - debounceTimestamp > 50) {
        debounceTimestamp = Date.now(); /* Prevents AoE stuff from being silly */
        onAction[player.job](actionMatch);
      }
    } else if (statusMatch) {
      onStatus[player.job](statusMatch);
    } else if (castingMatch) {
      // console.log(`${castingMatch}`);
      onCasting[player.job](castingMatch);

      /* Display next if casting with an NPC target */
      if (castingMatch.groups.logType === '0aab') { /* 0 = no target, 1... = player? E... = non-combat NPC? */
        document.getElementById('nextdiv').classList.replace('next-hide', 'next-show');
      }
      // if (target.id.startsWith('4')) { /* 0 = no target, 1... = player? E... = non-combat NPC? */
      //   document.getElementById('nextdiv').classList.replace('next-hide', 'next-show');
      // }
    } else if (cancelMatch) {
      // console.log(`${cancelMatch}`);
      onCancel[player.job](cancelMatch);
    } else if (statsMatch) {
      gcdCalculation({
        speed: Math.max(statsMatch.groups.skillSpeed, statsMatch.groups.spellSpeed),
      });
      mpRegenCalculation({ piety: statsMatch.groups.piety });
      console.log(`GCD: ${player.gcd}`);
      console.log(`MP regen: ${player.mpRegen}`);
    }
  }
});

addOverlayListener('onTargetChangedEvent', (e) => {
  // console.log(`onTargetChangedEvent: ${JSON.stringify(e)}`);
  target.name = e.detail.name;
  target.id = e.detail.id.toString(16).toUpperCase(); // See player.id above
  target.job = e.detail.job;
  // target.level = e.detail.level;
  // target.currentHP = e.detail.currentHP;
  // target.currentMP = e.detail.currentMP;
  // target.maxHP = e.detail.maxHP;
  // target.maxMP = e.detail.maxMP;
  target.distance = e.detail.distance;
  /* Shows and hides the overlay based on target and combat status */
  if (target.id.startsWith('4')) {
    document.getElementById('nextdiv').classList.replace('next-hide', 'next-show');
  } else if (toggle.combat !== 1) {
    document.getElementById('nextdiv').classList.replace('next-show', 'next-hide');
  }

  if (player.job && target.id !== target.previousid) {
    target.previousid = target.id;
    onTargetChanged[player.job]();
  }
});

addOverlayListener('onInCombatChangedEvent', (e) => {
  // console.log(`onInCombatChangedEvent: ${JSON.stringify(e)}`);

  /* Can't think of a good way to consistently reset AoE count other than this. Hopefully does not
  have a race condition with starting with AoEs... */
  count.targets = 1;

  if (e.detail.inGameCombat) {
    player.combat = 1;
    toggle.combat = 1;
  } else {
    player.combat = 0;
    toggle.combat = 0;
    if (target.id && !target.id.startsWith('4')) {
      document.getElementById('nextdiv').classList.replace('next-show', 'next-hide');
    }
  }
});

addOverlayListener('onZoneChangedEvent', (e) => {
  /* This fires extremely early upon load - careful of what you put here since it won't work if it
  requires the character data to be loaded as well. */
  // console.log(`onZoneChangedEvent: ${JSON.stringify(e)}`);
});

addOverlayListener('onPartyWipe', (e) => {
  // console.log(`onPartyWipe: ${JSON.stringify(e)}`);
});

callOverlayHandler({ call: 'cactbotRequestState' });
