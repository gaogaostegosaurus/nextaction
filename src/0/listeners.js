
/* https://github.com/quisquous/cactbot/blob/master/CactbotOverlay/JSEvents.cs shows all possible events */

/* This seems useful to eventually add ?
addOverlayListener('onInitializeOverlay', (e) => {
}); */

/* Store list of whatevers in property matching job abbreivations -
  allows for some code reuse across jobs */
const actionList = {};
const statusList = {};
const castingList = {};

// Objects
const player = {};
player.gcd = 2500;

const target = {};

// RegEx matching strings


const removeAnimationTime = 1000;

const timeout = {}; // For timeout variables
// const toggle = {}; // Toggley things
// const count = {}; // County things?
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
  /* Fires after onZoneChangedEvent on reload */
  // console.log('onPlayerChangedEvent');
  // console.log(JSON.stringify(e));
  player.id = e.detail.id.toString(16).toUpperCase();
  player.name = e.detail.name;
  player.job = e.detail.job;
  player.level = e.detail.level;
  player.mp = e.detail.currentMP;

  /* Create 8 part array for "unsupported" jobs - index is [0] to [7].
  Example: player.fourfoldFeathers = parseInt(debugJobArray[0], 16);
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
  } else if (player.job === 'DNC') {
    player.fourfoldFeathers = parseInt(debugJobArray[0], 16); /* 0-4 */
    player.esprit = parseInt(debugJobArray[1], 16); /* 0-100 */

    /* Steps - 1 is Emboite, 2 is Entrechat, 3 is Jete, 4 is Pirouette */
    player.step1 = parseInt(debugJobArray[2], 16);
    player.step2 = parseInt(debugJobArray[3], 16);
    player.step3 = parseInt(debugJobArray[4], 16);
    player.step4 = parseInt(debugJobArray[5], 16);
    player.stepTotal = debugJobArray[6]; /* 0-4 */
  } else if (player.job === 'DRK') {
    player.blood = e.detail.jobDetail.blood;
    player.darkarts = parseInt(debugJobArray[4], 16);
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
    player.bahamut = e.detail.jobDetail.bahamutMilliseconds;
  } else if (player.job === 'WHM') {
    // player.lilies = parseInt(debugJobArray[4], 16);
    player.bloodLily = parseInt(debugJobArray[5], 16); /* 0-3 */
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
    console.log(`Changed to ${player.job}${player.level}`);
  }
});

addOverlayListener('onLogEvent', (e) => { // Fires on log event
  // console.log('onLogEvent');
  const logLength = e.detail.logs.length;
  let aoeTargetsHit = 0;

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
      } else if (actionMatch.groups.logType === '16') {
        const timeoutProperty = actionMatch.groups.actionName.replace(/[\s'-:]/g, '').toLowerCase();
        if (actionMatch.groups.targetID.startsWith('4')
        && actionMatch.groups.actionName !== 'Dream Within A Dream') {
          /* DWAW hits one target multiple times using logType 16 */
          aoeTargetsHit += 1;
          if (player.targetCount !== aoeTargetsHit) {
            player.targetCount = aoeTargetsHit;
          }
        }
        clearTimeout(timeout[`${timeoutProperty}`]);
        timeout[`${timeoutProperty}`] = setTimeout(onAction[player.job], 50, actionMatch);
      }
    } else if (statusMatch) {
      onStatus[player.job](statusMatch);
    } else if (castingMatch) {
      onCasting[player.job](castingMatch);
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

addOverlayListener('EnmityTargetData', (e) => {
  // console.log('EmnityTargetData');
  // console.log(`onTargetChangedEvent: ${JSON.stringify(e)}`);
  /* Copied from stringify for notes:
  {"type":"EnmityTargetData","Target":{"ID":1073746514,"OwnerID":0,"Type":2,"TargetID":275370607,"Job":0,"Name":"Striking Dummy","CurrentHP":254,"MaxHP":16000,"PosX":-706.4552,"PosY":23.5000038,"PosZ":-583.5873,"Rotation":-0.461016417,"Distance":"2.78","EffectiveDistance":0,"Effects":[{"BuffID":508,"Stack":0,"Timer":10.7531652,"ActorID":275370607,"isOwner":false}]},"Focus":null,"Hover":null,"TargetOfTarget":{"ID":275370607,"OwnerID":0,"Type":1,"TargetID":3758096384,"Job":30,"Name":"Lyn Tah'row","CurrentHP":87008,"MaxHP":87008,"PosX":-708.9726,"PosY":23.5000038,"PosZ":-582.397156,"Rotation":2.01241565,"Distance":"0.00","EffectiveDistance":0,"Effects":[{"BuffID":365,"Stack":10,"Timer":30,"ActorID":3758096384,"isOwner":false},{"BuffID":360,"Stack":10,"Timer":30,"ActorID":3758096384,"isOwner":false}]},"Entries":[{"ID":275370607,"OwnerID":0,"Name":"Lyn Tah'row","Enmity":100,"isMe":true,"HateRate":100,"Job":30}]} (Source: file:///C:/Users/Dan/Google%20Drive/Advanced%20Combat%20Tracker/Plugins/next/src/0/listeners.js, Line: 219) */
  /* Possible properties for e.Target are
    ID - as decimal number instead of hex (as in parser log)
    OwnerID - often "0"
    Type
    TargetID
    Job
    Name
    CurrentHP, MaxHP
    PosX, PosY, PosZ, Rotation
    Distance - Distance to center of target
    EffectiveDistance - Distance to edge of target
    Effects - Array of effects (?)
  */
  if (e.Target) {
    target.name = e.Target.Name;
    target.id = e.Target.ID.toString(16).toUpperCase(); /* Change to hex value (with caps) */
    target.distance = e.Target.EffectiveDistance;

    /* Shows and hides the overlay based on target and combat status */
    if (target.id.startsWith('4') && target.distance <= 25) {
      document.getElementById('nextdiv').classList.replace('next-hide', 'next-show');
    } else {
      document.getElementById('nextdiv').classList.replace('next-show', 'next-hide');
    }

    if (player.job && target.id !== target.previousid) {
      target.previousid = target.id;
      onTargetChanged[player.job]();
    }
  } else if (!player.combat) { /* Implies no target, not in combat */
    document.getElementById('nextdiv').classList.replace('next-show', 'next-hide');
  }
});

addOverlayListener('onInCombatChangedEvent', (e) => {
  if (e.detail.inGameCombat) {
    player.combat = Date.now();
    // toggle.combat = 1;
  } else {
    delete player.combat;
  }
});

addOverlayListener('onZoneChangedEvent', (e) => {
  /* Fires first on reload */
  /* This seems to fire extremely early upon load -
    careful of what you put here since it won't work if it requires the character data to be loaded
    as well. */
  // console.log('onZoneChangedEvent');
  // console.log(`onZoneChangedEvent: ${JSON.stringify(e)}`);
});

addOverlayListener('onPartyWipe', (e) => {
  // console.log(`onPartyWipe: ${JSON.stringify(e)}`);
});

callOverlayHandler({ call: 'cactbotRequestState' });
