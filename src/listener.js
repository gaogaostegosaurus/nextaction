
// https://github.com/quisquous/cactbot/blob/master/CactbotOverlay/JSEvents.cs shows all possible events

// addOverlayListener('onInitializeOverlay', (e) => {
  // This seems useful to eventually add
// });

addOverlayListener('onLogEvent', (e) => { // Fires on log event

  const statsRegExp = new RegExp(' 0C:Player Stats: (?<jobID>[\\d]+):(?<strength>[\\d]+):(?<dexterity>[\\d]+):(?<vitality>[\\d]+):(?<intelligence>[\\d]+):(?<mind>[\\d]+):(?<piety>[\\d]+):(?<attackPower>[\\d]+):(?<directHitRate>[\\d]+):(?<criticalHit>[\\d]):(?<attackMagicPotency>[\\d]+):(?<healingMagicPotency>[\\d]+):(?<determination>[\\d]+):(?<skillSpeed>[\\d]+):(?<spellSpeed>[\\d]+):0:(?<tenacity>[\\d]+)');
  const actionRegExp = new RegExp(` (?<logType>1[56]):(?<sourceID>${player.ID}):(?<sourceName>${player.name}):(?<actionID>[\\dA-F]{1,8}):(?<actionName>${actionList}):(?<targetID>[\\dA-F]{8}):(?<targetName>[ -~]+?):(?<result>[\\dA-F]{1,8}):`);
  const effectRegExp = new RegExp(` (?<logType>1[AE]):(?<targetID>[\\dA-F]{8}):(?<targetName>[ -~]+?) (?<gainsLoses>gains|loses) the effect of (?<effectName>${statusList}) from (?<sourceName>${player.name})(?: for )?(?<effectDuration>\\d*\\.\\d*)?(?: Seconds)?\\.`);
  const startsUsingRegExp = new RegExp(` 14:(?<actionID>[\\dA-F]{1,4}):(?<sourceName>${player.name}) starts using (?<actionName>${castingList}) on (?<targetName>[ -~]+?)\\.`);
  const cancelledRegExp = new RegExp(` 17:(?<sourceID>[\\dA-F]{8}):(?<sourceName>${player.name}):(?<actionID>[\\dA-F]{1,4}):(?<actionName>${castingList}):Cancelled:`);
  const l = e.detail.logs.length;

  for (let i = 0; i < l; i += 1) {
    const actionMatch = e.detail.logs[i].match(actionRegExp);
    const effectMatch = e.detail.logs[i].match(effectRegExp);
    const startsMatch = e.detail.logs[i].match(startsUsingRegExp);
    const cancelledMatch = e.detail.logs[i].match(cancelledRegExp);
    const statsMatch = e.detail.logs[i].match(statsRegExp);

    if (actionMatch && actionMatch.groups.sourceID === player.ID) { // Status source = player
      if (player.job === 'BLM') {
        blmAction(actionMatch);
      } else if (player.job === 'BRD') {
        brdAction(actionMatch);
      } else if (player.job === 'DNC') {
        dncAction(actionMatch);
      } else if (player.job === 'DRK') {
        drkAction(actionMatch);
      } else if (player.job === 'GNB') {
        gnbAction(actionMatch);
      } else if (player.job === 'MCH') {
        mchAction(actionMatch);
      } else if (player.job === 'MNK') {
        mnkAction(actionMatch);
      } else if (player.job === 'NIN') {
        ninAction(actionMatch);
      } else if (player.job === 'PLD') {
        pldAction(actionMatch);
      } else if (player.job === 'RDM') {
        rdmOnAction(actionMatch);
      } else if (player.job === 'SAM') {
        samAction(actionMatch);
      } else if (player.job === 'SCH') {
        schAction(actionMatch);
      } else if (player.job === 'WAR') {
        warAction(actionMatch);
      } else if (player.job === 'WHM') {
        whmAction(actionMatch);
      }
    } else if (effectMatch && effectMatch.groups.sourceName === player.name) {
      if (player.job === 'BLM') {
        blmStatus();
      } else if (player.job === 'BRD') {
        brdStatus();
      } else if (player.job === 'DNC') {
        dncStatus();
      } else if (player.job === 'DRK') {
        drkStatus();
      } else if (player.job === 'GNB') {
        gnbStatus();
      } else if (player.job === 'MCH') {
        mchStatus();
      } else if (player.job === 'MNK') {
        mnkStatus();
      } else if (player.job === 'NIN') {
        ninStatus();
      } else if (player.job === 'PLD') {
        pldStatus();
      } else if (player.job === 'RDM') {
        rdmOnEffect(effectMatch);
      } else if (player.job === 'SAM') {
        samStatus();
      } else if (player.job === 'SCH') {
        schStatus();
      } else if (player.job === 'WAR') {
        warStatus();
      } else if (player.job === 'WHM') {
        whmStatus();
      }
    } else if (startsMatch && startsMatch.groups.sourceName === player.name) {
      if (player.job === 'BLM') {
        blmStartsUsing();
      } else if (player.job === 'RDM') {
        rdmOnStartsUsing(startsMatch);
      }
    } else if (cancelledMatch && cancelledMatch.groups.sourceID === player.ID) {
      if (player.job === 'BLM') {
        blmCancelled();
      } else if (player.job === 'RDM') {
        rdmOnCancelled(cancelledMatch);
      }
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

// onPlayerChangedEvent:
// fires whenever player change detected (including HP, MP, other resources, positions, etc.)
addOverlayListener('onPlayerChangedEvent', (e) => {
  // console.log(JSON.stringify(player));
  player = e.detail;
  player.ID = player.id.toString(16).toUpperCase();
  // player.id.toString(16) is lowercase; using 'ID' to designate uppercase lettering

  // Create 8 part array for unsupported jobs - use [0] to [7]
  player.debugJobSplit = player.debugJob.split(' ');

  player.tempjobDetail = {};

  if (player.job === 'DNC') { // Temporary
    player.tempjobDetail.fourfoldfeathers = parseInt(player.debugJobSplit[0], 16); // 0-4
    player.tempjobDetail.esprit = parseInt(player.debugJobSplit[1], 16); // 0-100

    // Steps
    // 1 is  Emboite, 2 is Entrechat, 3 is Jete, 4 is Pirouette
    player.tempjobDetail.step1 = parseInt(player.debugJobSplit[2], 16);
    player.tempjobDetail.step2 = parseInt(player.debugJobSplit[3], 16);
    player.tempjobDetail.step3 = parseInt(player.debugJobSplit[4], 16);
    player.tempjobDetail.step4 = parseInt(player.debugJobSplit[5], 16);
    player.tempjobDetail.totalsteps = parseInt(player.debugJobSplit[6], 16); // 0-4
  } else if (player.job === 'GNB') {
    player.tempjobDetail.cartridge = parseInt(player.debugJobSplit[0], 16); // 0-2
  } else if (player.job === 'SCH') {
    player.tempjobDetail.tempaetherflow = parseInt(player.debugJobSplit[2], 16); // 0-3
    player.tempjobDetail.tempfaerie = parseInt(player.debugJobSplit[3], 16); // 0-100
  } else if (player.job === 'WHM') {
    player.tempjobDetail.bloodlily = parseInt(player.debugJobSplit[5], 16); // 0-3
  }

  // Detects name/job/level change and clears elements
  if (previous.job !== player.job || previous.level !== player.level) {
    clearUI();
    clearTimers();
    loadInitialState();
    previous.job = player.job;
    previous.level = player.level;
    // console.log(`Changed to ${player.job}${player.level}`);
    // Maybe change this to an element later
    if (player.job === 'AST') {
      // actions = astActions.join('|');
    } else if (player.job === 'BLM') {
      // actions = blmActions.join('|');
    } else if (player.job === 'BLU') {
      // actions = bluActions.join('|');
    } else if (player.job === 'BRD') {
      // actions = brdActions.join('|');
    } else if (player.job === 'DNC') {
      // actions = dncActions.join('|');
    } else if (player.job === 'DRG') {
      // actions = drgActions.join('|');
    } else if (player.job === 'DRK') {
      // actions = drkActions.join('|');
    } else if (player.job === 'GNB') {
      // actions = gnbActions.join('|');
    } else if (player.job === 'MCH') {
      // actions = mchmActions.join('|');
    } else if (player.job === 'MNK') {
      // actions = mnkActions.join('|');
    } else if (player.job === 'NIN') {
      // actions = ninActions.join('|');
    } else if (player.job === 'PLD') {
      // actions = pldActions.join('|');
    } else if (player.job === 'RDM') {
      actionList = rdmActionList.join('|');
      castingList = rdmCastingList.join('|');
      statusList = rdmStatusList.join('|');
    } else if (player.job === 'SAM') {
      // actions = samActions.join('|');
    } else if (player.job === 'SCH') {
      // actions = schActions.join('|');
    } else if (player.job === 'SMN') {
      // actions = smnActions.join('|');
    } else if (player.job === 'WAR') {
      // actions = warActions.join('|');
    } else if (player.job === 'WHM') {
      // actions = whmActions.join('|');
    }

  }

  // This is probably only useful for jobs that need to watch things that 'tick' up or down
  if (player.job === 'BLM') {
    blmPlayerChangedEvent();
  } else if (player.job === 'BRD') {
    brdPlayerChangedEvent();
  } else if (player.job === 'MCH') {
    mchPlayerChangedEvent();
  } else if (player.job === 'MNK') {
    mnkPlayerChangedEvent();
  } else if (player.job === 'WHM') {
    whmPlayerChangedEvent();
  }

  // Possible use for later
  // else if (player.job == 'RDM') {
  //   rdmPlayerChangedEvent();
  // }
  // console.log(JSON.stringify(player));
});

addOverlayListener('onTargetChangedEvent', (e) => {
  // console.log(`onTargetChangedEvent: ${JSON.stringify(e)}`);
  // {"type":"onTargetChangedEvent","detail":{
  // "id":int,"level":int,"name":"string","job":"string","currentHP":int,"maxHP":int,
  // "currentMP":int,"maxMP":int,"currentTP":int,"maxTP":int,
  // "pos":{"x":float,"y":float,"z":float},"distance":int}}
  target = e.detail;
  target.ID = e.detail.id.toString(16).toUpperCase(); // See player.ID above

  if (player.job === 'BLM') {
    blmTargetChangedEvent();
  } else if (player.job === 'BRD') {
    brdTargetChangedEvent();
  } else if (player.job === 'SCH') {
    schTargetChangedEvent();
  } else if (player.job === 'WHM') {
    whmTargetChangedEvent();
  }
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
