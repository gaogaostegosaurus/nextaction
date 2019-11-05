
addOverlayListener('onLogEvent', (e) => { // Fires on log event
  const statsRegExp = new RegExp(' 0C:Player Stats: (?<jobID>[\\d]+):(?<strength>[\\d]+):(?<dexterity>[\\d]+):(?<vitality>[\\d]+):(?<intelligence>[\\d]+):(?<mind>[\\d]+):(?<piety>[\\d]+):(?<attackPower>[\\d]+):(?<directHitRate>[\\d]+):(?<criticalHit>[\\d]+):(?<attackMagicPotency>[\\d]+):(?<healingMagicPotency>[\\d]+):(?<determination>[\\d]+):(?<skillSpeed>[\\d]+):(?<spellSpeed>[\\d]+):0:(?<tenacity>[\\d]+)');
  const actionRegExp = new RegExp(' (?<logType>1[56]):(?<sourceID>[\\dA-F]{8}):(?<sourceName>[a-zA-Z\']+? [a-zA-Z\']+?):(?<actionID>[\\dA-F]{1,8}):(?<actionName>[ -~]+?):(?<targetID>[\\dA-F]{8}):(?<targetName>[ -~]+?):(?<result>[\\dA-F]{1,8}):');
  const effectRegExp = new RegExp(' (?<logType>1[AE]):(?<targetID>[\\dA-F]{8}):(?<targetName>[ -~]+?) (?<gainsLoses>gains|loses) the effect of (?<effectName>[ -~]+?) from (?<sourceName>[a-zA-Z\']+? [a-zA-Z\']+?)(?: for )?(?<effectDuration>\\d*\\.\\d*)?(?: Seconds)?\\.');
  const startsUsingRegExp = new RegExp(' 14:(?<actionID>[\\dA-F]{1,4}):(?<sourceName>[a-zA-Z\']+? [a-zA-Z\']+?) starts using (?<actionName>[ -~]+?) on (?<targetName>[ -~]+?)\\.');
  const cancelledRegExp = new RegExp(' 17:(?<sourceID>[\\dA-F]{8}):(?<sourceName>[a-zA-Z\']+? [a-zA-Z\']+?):(?<actionID>[\\dA-F]{1,4}):(?<actionName>[ -~]+?):Cancelled:');
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
      } else if (player.job == 'DNC') {
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
    }

    else if (startsMatch && startsMatch.groups.sourceName === player.name) { // Status source = player
      if (player.job === 'BLM') {
        blmStartsUsing();
      } else if (player.job === 'RDM') {
        rdmOnStartsUsing();
      }
    }

    else if (cancelledMatch && cancelledMatch.groups.sourceID === player.ID) { // Status source = player
      if (player.job === 'BLM') {
        blmCancelled();
      }
      else if (player.job === 'RDM') {
        rdmOnCancelled(cancelledMatch);
      }
    }

    else if (statsMatch) {
      // Uncomment to check
      const whatever = gcdCalculation({
        speed: Math.max(statsMatch.groups.skillSpeed, statsMatch.groups.spellSpeed),
      });
      console.log(whatever);
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
  player = e.detail;
  player.ID = e.detail.id.toString(16).toUpperCase();
  // player.id.toString(16) is lowercase; using 'ID' to designate uppercase lettering
  player.debugJobSplit = player.debugJob.split(' '); // Creates 8 part array - use [0] to [7]

  player.tempjobDetail = {};

  if (player.job === 'DNC') { // Temporary
    player.tempjobDetail.tempfourfoldfeathers = parseInt(player.debugJobSplit[0], 16); // 0-4
    player.tempjobDetail.tempesprit = parseInt(player.debugJobSplit[1], 16); // 0-100

    // Steps
    // 1 is  Emboite, 2 is Entrechat, 3 is Jete, 4 is Pirouette
    player.tempjobDetail.step1 = parseInt(player.debugJobSplit[2], 16);
    player.tempjobDetail.step2 = parseInt(player.debugJobSplit[3], 16);
    player.tempjobDetail.step3 = parseInt(player.debugJobSplit[4], 16);
    player.tempjobDetail.step4 = parseInt(player.debugJobSplit[5], 16);
    player.tempjobDetail.steps = parseInt(player.debugJobSplit[6], 16); // 0-4
  } else if (player.job == 'GNB') {
    player.tempjobDetail.cartridge = parseInt(player.debugJobSplit[0]); // 0-2
  } else if (player.job == 'SCH') {
    player.tempjobDetail.tempaetherflow = parseInt(player.debugJobSplit[2]); // 0-3
    player.tempjobDetail.tempfaerie = parseInt(player.debugJobSplit[3], 16); // 0-100
  } else if (player.job == 'WHM') {
    player.tempjobDetail.bloodlily = parseInt(player.debugJobSplit[5]); // 0-3
  }
  // Detects name/job/level change and clears elements
  if (previous.job != player.job || previous.level != player.level) {

    clearUI();
    clearTimers();
    loadInitialState();

    previous.job = player.job;
    previous.level = player.level;
    console.log(`Changed to ${player.job}${player.level}`);
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

});

addOverlayListener('onTargetChangedEvent', (e) => {
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

addOverlayListener('onInCombatChangedEvent', (e) => {
  // Fires when character exits or enters combat

  count.targets = 1;
  // Can't think of a good way to consistently reset AoE count other than this
  // Hopefully does not have a race condition with starting with AoEs...

  if (e.detail.inGameCombat) {
    toggle.combat = Date.now();
    document.getElementById('nextdiv').className = 'next-box next-show';
  }
  else {
    delete toggle.combat;
    document.getElementById('nextdiv').className = 'next-box next-hide';


    // Try to get rid of this section
    //
    // if (player.job == 'BRD') {
    //   brdInCombatChangedEvent(e);
    // }
  }
});

addOverlayListener('onZoneChangedEvent', function(e) {
  clearUI();
  clearTimers();
  loadInitialState();
});

addOverlayListener('onPartyWipe', function(e) {
  clearUI();
  clearTimers();
  loadInitialState();
});
