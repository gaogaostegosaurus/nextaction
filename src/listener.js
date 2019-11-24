
// https://github.com/quisquous/cactbot/blob/master/CactbotOverlay/JSEvents.cs shows all possible events

// This seems useful to eventually add
// addOverlayListener('onInitializeOverlay', (e) => {
// });

const actionList = {};
const statusList = {};
const castingList = {};

let actionRegExp;
let statusRegExp;
let castingRegExp;
let cancelRegExp;
// let addedRegExp;
const statsRegExp = new RegExp(' 0C:Player Stats: (?<jobID>[\\d]+):(?<strength>[\\d]+):(?<dexterity>[\\d]+):(?<vitality>[\\d]+):(?<intelligence>[\\d]+):(?<mind>[\\d]+):(?<piety>[\\d]+):(?<attackPower>[\\d]+):(?<directHitRate>[\\d]+):(?<criticalHit>[\\d]):(?<attackMagicPotency>[\\d]+):(?<healingMagicPotency>[\\d]+):(?<determination>[\\d]+):(?<skillSpeed>[\\d]+):(?<spellSpeed>[\\d]+):0:(?<tenacity>[\\d]+)');

// onPlayerChangedEvent:
// fires whenever player change detected (including HP, MP, other resources, positions, etc.)
addOverlayListener('onPlayerChangedEvent', (e) => {
  // console.log(JSON.stringify(e));
  // player.id.toString(16) is lowercase; using 'ID' to designate uppercase lettering
  player.ID = e.detail.id.toString(16).toUpperCase();
  player.name = e.detail.name;
  player.job = e.detail.job;
  player.level = e.detail.level;

  player.currentHP = e.detail.currentHP;
  player.maxHP = e.detail.maxHP;
  player.currentMP = e.detail.currentMP;
  player.maxMP = e.detail.maxMP;
  player.currentShield = e.detail.currentShield;

  // Create 8 part array for unsupported jobs - use [0] to [7]
  const debugJobArray = e.detail.debugJob.split(' ');

  if (player.job === 'DNC') { // Temporary
    player.fourfoldFeathers = parseInt(debugJobArray[0], 16); // 0-4
    player.esprit = parseInt(debugJobArray[1], 16); // 0-100
    // Steps - 1 is Emboite, 2 is Entrechat, 3 is Jete, 4 is Pirouette
    player.step1 = parseInt(debugJobArray[2], 16);
    player.step2 = parseInt(debugJobArray[3], 16);
    player.step3 = parseInt(debugJobArray[4], 16);
    player.step4 = parseInt(debugJobArray[5], 16);
    player.stepTotal = debugJobArray[6]; // 0-4
  } else if (player.job === 'GNB') {
    player.cartridge = parseInt(debugJobArray[0], 16); // 0-2
  } else if (player.job === 'NIN') {
    player.huton = e.detail.jobDetail.hutonMilliseconds;
    player.ninki = e.detail.jobDetail.ninkiAmount;
  } else if (player.job === 'RDM') {
    player.blackMana = e.detail.jobDetail.blackMana;
    player.whiteMana = e.detail.jobDetail.whiteMana;
  } else if (player.job === 'SCH') {
    player.aetherflow = parseInt(debugJobArray[2], 16); // 0-3
    player.faerieGauge = parseInt(debugJobArray[3], 16); // 0-100
    healerLucidDreaming();
  } else if (player.job === 'WHM') {
    player.bloodLily = parseInt(debugJobArray[5], 16); // 0-3
    healerLucidDreaming();
  }

  // Detects name/job/level change and clears elements
  if (previous.job !== player.job || previous.level !== player.level) {
    previous.job = player.job;
    previous.level = player.level;

    const action = actionList[player.job].join('|');
    const status = statusList[player.job].join('|');
    const casting = castingList[player.job].join('|');
    actionRegExp = new RegExp(` (?<logType>1[56]):(?<sourceID>${player.ID}):(?<sourceName>${player.name}):(?<actionID>[\\dA-F]{1,8}):(?<actionName>${action}):(?<targetID>[\\dA-F]{8}):(?<targetName>[ -~]+?):(?<result>[\\dA-F]{1,8}):`);
    statusRegExp = new RegExp(` (?<logType>1[AE]):(?<targetID>[\\dA-F]{8}):(?<targetName>[ -~]+?) (?<gainsLoses>gains|loses) the effect of (?<statusName>${status}) from (?<sourceName>${player.name})(?: for )?(?<statusDuration>\\d*\\.\\d*)?(?: Seconds)?\\.`);
    castingRegExp = new RegExp(` 14:(?<actionID>[\\dA-F]{1,4}):(?<sourceName>${player.name}) starts using (?<actionName>${casting}) on (?<targetName>[ -~]+?)\\.`);
    cancelRegExp = new RegExp(` 17:(?<sourceID>${player.ID}):(?<sourceName>${player.name}):(?<actionID>[\\dA-F]{1,4}):(?<actionName>${casting}):Cancelled:`);
    addedRegExp = new RegExp(` 03:(?<sourceID>${player.ID}):Added new combatant (?<sourceName>${player.name})\\.  Job: (?<job>[A-z]{3}) `);
    clearUI();
    onJobChange[player.job]();
    console.log(`Changed to ${player.job}${player.level}`);
    console.log(JSON.stringify(e));
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

    if (actionMatch) { // Status source = player
      onAction[player.job](actionMatch);
    } else if (statusMatch) {
      onStatus[player.job](statusMatch);
    } else if (castingMatch) {
      onCasting[player.job](castingMatch);

      // Display next if casting with an NPC target
      if (target.ID.startsWith('4')) { // 0 = no target, 1... = player? E... = non-combat NPC?
        document.getElementById('nextdiv').className = 'next next-show';
      }
    } else if (cancelMatch) {
      onCancel[player.job](cancelMatch);
    } else if (statsMatch) {
      gcdCalculation({
        speed: Math.max(statsMatch.groups.skillSpeed, statsMatch.groups.spellSpeed),
      });
    }

    // else if (actionLog && actionLog.groups.sourceID != player.ID
    // && actionLog.groups.sourceID.startsWith('1')) {  // Status source = other player
    //   raidAction();
    // }
  }
});

onAction.NONE = () => {};
onCasting.NONE = () => {};
onCancel.NONE = () => {};
onStatus.NONE = () => {};


addOverlayListener('onTargetChangedEvent', (e) => {
  // console.log(`onTargetChangedEvent: ${JSON.stringify(e)}`);
  // {"type":"onTargetChangedEvent","detail":{
  // "id":int,"level":int,"name":"string","job":"string","currentHP":int,"maxHP":int,
  // "currentMP":int,"maxMP":int,"currentTP":int,"maxTP":int,
  // "pos":{"x":float,"y":float,"z":float},"distance":int}}
  target.name = e.detail.name;
  target.ID = e.detail.id.toString(16).toUpperCase(); // See player.ID above
  target.job = e.detail.job;
  // target.level = e.detail.level;
  target.currentHP = e.detail.currentHP;
  target.currentMP = e.detail.currentMP;
  target.maxHP = e.detail.maxHP;
  target.maxMP = e.detail.maxMP;
  // target.distance = e.detail.distance;

  onTargetChanged[player.job]();
});

// Fires when character exits or enters combat
addOverlayListener('onInCombatChangedEvent', (e) => {
  // console.log(`onInCombatChangedEvent: ${JSON.stringify(e)}`);
  // e.detail contains booleans e.detail.inACTCombat and e.detail.inGameCombat
  count.targets = 1;
  // Can't think of a good way to consistently reset AoE count other than this
  // Hopefully does not have a race condition with starting with AoEs...

  if (e.detail.inGameCombat) {
    toggle.combat = Date.now();
    document.getElementById('nextdiv').className = 'next next-show';
  } else {
    delete toggle.combat;
    document.getElementById('nextdiv').className = 'next next-hide';
    // next-hide class has a has a built in delay
  }
});

// Listens for zone changes
addOverlayListener('onZoneChangedEvent', (e) => {
  // console.log(`onPartyWipe: ${JSON.stringify(e)}`);
  // e shows current zone in details
  // console.log(`current zone: ${e.detail.zoneName}`);
  clearUI();
  clearTimers();
  loadInitialState();
});

// Not sure how this works - only in raid where it resets? Bosses? Regular pulls?
addOverlayListener('onPartyWipe', (e) => {
  // console.log(`onPartyWipe: ${JSON.stringify(e)}`);
  // e only shows type (no details)
  clearUI();
  clearTimers();
  loadInitialState();
});
