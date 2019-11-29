
/* https://github.com/quisquous/cactbot/blob/master/CactbotOverlay/JSEvents.cs shows all possible events */

/* This seems useful to eventually add ?
addOverlayListener('onInitializeOverlay', (e) => {
}); */

const actionList = {};
const statusList = {};
const castingList = {};

let actionRegExp;
let statusRegExp;
let castingRegExp;
let cancelRegExp;
// let addedRegExp;
const statsRegExp = new RegExp(' 0C:Player Stats: (?<jobID>[\\d]+):(?<strength>[\\d]+):(?<dexterity>[\\d]+):(?<vitality>[\\d]+):(?<intelligence>[\\d]+):(?<mind>[\\d]+):(?<piety>[\\d]+):(?<attackPower>[\\d]+):(?<directHitRate>[\\d]+):(?<criticalHit>[\\d]+):(?<attackMagicPotency>[\\d]+):(?<healingMagicPotency>[\\d]+):(?<determination>[\\d]+):(?<skillSpeed>[\\d]+):(?<spellSpeed>[\\d]+):0:(?<tenacity>[\\d]+)');

addOverlayListener('onPlayerChangedEvent', (e) => {
  // console.log(JSON.stringify(e));
  /* e.detail.id is a numeric ID, e.detail.id .toString(16) is lowercase.
  Using 'ID' to designate uppercase lettering. */
  player.ID = e.detail.id.toString(16).toUpperCase();
  player.name = e.detail.name;
  player.job = e.detail.job;
  player.level = e.detail.level;

  player.currentHP = e.detail.currentHP;
  player.maxHP = e.detail.maxHP;
  player.MP = e.detail.currentMP;
  player.maxMP = e.detail.maxMP;
  player.currentShield = e.detail.currentShield;

  /* Create 8 part array for unsupported jobs - use [0] to [7].
  Need to use parseInt because 04 is not the same as 4. */
  const debugJobArray = e.detail.debugJob.split(' ');

  if (player.job === 'DNC') { // Temporary
    player.fourfoldFeathers = parseInt(debugJobArray[0], 16); /* 0-4 */
    player.esprit = parseInt(debugJobArray[1], 16); /* 0-100 */
    /* Steps - 1 is Emboite, 2 is Entrechat, 3 is Jete, 4 is Pirouette */
    player.step1 = parseInt(debugJobArray[2], 16);
    player.step2 = parseInt(debugJobArray[3], 16);
    player.step3 = parseInt(debugJobArray[4], 16);
    player.step4 = parseInt(debugJobArray[5], 16);
    player.stepTotal = debugJobArray[6]; /* 0-4 */
  } else if (player.job === 'GNB') {
    player.cartridge = parseInt(debugJobArray[0], 16); /* 0-2 */
  } else if (player.job === 'PLD') {
    player.oath = e.detail.jobDetail.oath;
  } else if (player.job === 'NIN') {
    player.huton = e.detail.jobDetail.hutonMilliseconds;
    player.ninki = e.detail.jobDetail.ninkiAmount;
  } else if (player.job === 'RDM') {
    player.blackMana = e.detail.jobDetail.blackMana;
    player.whiteMana = e.detail.jobDetail.whiteMana;
  } else if (player.job === 'SCH') {
    player.aetherflow = parseInt(debugJobArray[2], 16); /* 0-3 */
    player.faerieGauge = parseInt(debugJobArray[3], 16); /* 0-100 */
    // healerLucidDreaming();
  } else if (player.job === 'WHM') {
    // player.lilies
    player.bloodLily = parseInt(debugJobArray[5], 16); /* 0-3 */
    // healerLucidDreaming();
  }

  /* Detects name/job/level change and clears elements */
  if (player.job && (previous.job !== player.job || previous.level !== player.level)) {
    previous.job = player.job;
    previous.level = player.level;
    player.gcd = 2500;
    player.mpRegen = 200;


    const action = actionList[player.job].join('|');
    const status = statusList[player.job].join('|');
    const casting = castingList[player.job].join('|');
    actionRegExp = new RegExp(` (?<logType>1[56]):(?<sourceID>${player.ID}):(?<sourceName>${player.name}):(?<actionID>[\\dA-F]{1,8}):(?<actionName>${action}):(?<targetID>[\\dA-F]{8}):(?<targetName>[ -~]+?):(?<result>[\\dA-F]{1,8}):`);
    statusRegExp = new RegExp(` (?<logType>1[AE]):(?<targetID>[\\dA-F]{8}):(?<targetName>[ -~]+?) (?<gainsLoses>gains|loses) the effect of (?<statusName>${status}) from (?<sourceName>${player.name})(?: for )?(?<statusDuration>\\d*\\.\\d*)?(?: Seconds)?\\.`);
    castingRegExp = new RegExp(` 14:(?<actionID>[\\dA-F]{1,4}):(?<sourceName>${player.name}) starts using (?<actionName>${casting}) on (?<targetName>[ -~]+?)\\.`);
    cancelRegExp = new RegExp(` 17:(?<sourceID>${player.ID}):(?<sourceName>${player.name}):(?<actionID>[\\dA-F]{1,4}):(?<actionName>${casting}):Cancelled:`);
    /* addedRegExp = new RegExp(` 03:(?<sourceID>${player.ID}):
    Added new combatant (?<sourceName>${player.name})\\.  Job: (?<job>[A-z]{3}) `); */
    resetNext();
    onJobChange[player.job]();
    console.log(`Changed to ${player.job}${player.level}`);
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
      if (actionMatch.groups.logType === '16') {
        /* fix for heals */
        const property = actionMatch.groups.actionName.replace(/[\s'-:]/g, '').toLowerCase();
        if (!previous[`${property}Match`] || previous[`${property}Match`] - Date.now() > 10) {
          previous[`${property}Match`] = Date.now();
          count.targets = 1;
          timeout[`${property}Match`] = setTimeout(onAction[player.job], 100, actionMatch);
        } else {
          clearTimeout(timeout[`${property}Match`]);
          count.targets += 1;
          timeout[`${property}Match`] = setTimeout(onAction[player.job], 100, actionMatch);
        }
      } else {
        onAction[player.job](actionMatch);
      }
    } else if (statusMatch) {
      onStatus[player.job](statusMatch);
    } else if (castingMatch) {
      onCasting[player.job](castingMatch);

      /* Display next if casting with an NPC target */
      if (target.ID.startsWith('4')) { /* 0 = no target, 1... = player? E... = non-combat NPC? */
        document.getElementById('nextdiv').classList.replace('next-hide', 'next-show');
      }
    } else if (cancelMatch) {
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
  target.ID = e.detail.id.toString(16).toUpperCase(); // See player.ID above
  target.job = e.detail.job;
  // target.level = e.detail.level;
  target.currentHP = e.detail.currentHP;
  target.currentMP = e.detail.currentMP;
  target.maxHP = e.detail.maxHP;
  target.maxMP = e.detail.maxMP;
  // target.distance = e.detail.distance;
  if (player.job) {
    onTargetChanged[player.job]();
  }
});

addOverlayListener('onInCombatChangedEvent', (e) => {
  // console.log(`onInCombatChangedEvent: ${JSON.stringify(e)}`);

  /* Can't think of a good way to consistently reset AoE count other than this. Hopefully does not
  have a race condition with starting with AoEs... */
  count.targets = 1;

  if (e.detail.inGameCombat) {
    toggle.combat = Date.now();
    document.getElementById('nextdiv').classList.replace('next-hide', 'next-show');
  } else {
    delete toggle.combat;
    document.getElementById('nextdiv').classList.replace('next-show', 'next-hide');
    /* next-hide class has a built in delay */
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
