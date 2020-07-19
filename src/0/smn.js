
const smnCastedGCDs = [
  'Ruin', 'Ruin III',
  'Outburst',
  'Miasma', 'Miasma III',
  /* 'Physick', 'Ressurection', */
];
const smnMiasmaSpells = ['Miasma', 'Miasma III'];

const smnInstantGCDs = [
  'Bio', 'Bio II', 'Bio III',
  'Ruin IV',
  'Fountain Of Fire', 'Brand Of Purgatory',
  'Assault I: Crimson Cyclone', 'Assault I: Aerial Slash', 'Assault I: Earthen Armor',
  'Assault Ii: Flaming Crush', 'Assault Ii: Slipstream', 'Assault Ii: Mountain Buster',
  'Enkindle: Inferno', 'Enkindle: Aerial Blast', 'Enkindle: Earthen Fury',
];

const smnBioSpells = ['Bio', 'Bio II', 'Bio III'];

const smnAssaultI = [
  'Assault I: Crimson Cyclone', 'Assault I: Aerial Slash', 'Assault I: Earthen Armor',
];

const smnAssaultII = [
  'Assault Ii: Flaming Crush', 'Assault Ii: Slipstream', 'Assault Ii: Mountain Buster',
];

const smnEnkindle = [
  'Enkindle: Inferno', 'Enkindle: Aerial Blast', 'Enkindle: Earthen Fury',
];

const smnOGCDs = [
  'Bane', 'Enkindle', 'Tri-Disaster', 'Aetherpact',
  'Summon', 'Summon II', 'Summon III',
  'Energy Drain', 'Energy Syphon', 'Fester', 'Painflare',
  'Dreadwyrm Trance', 'Deathflare',
  'Summon Bahamut', 'Enkindle Bahamut',
  'Firebird Trance', 'Enkindle Phoenix',
];

const smnTrances = [
  'Dreadwyrm Trance', 'Firebird Trance',
];

const smnCountdownA = [
  'Egi Assault', 'Egi Assault II',
  'Energy Drain', 'Fester', 'Painflare',
];
const smnCountdownB = [
  'Tri-Disaster', 'Dreadwyrm Trance', 'Firebird Trance',
  'Summon Bahamut', 'Enkindle Bahamut', 'Enkindle Phoenix',
];
const smnCountdownC = [];

const smnSingleTarget = [
  'Ruin', 'Ruin III', 'Fester',
]; /* who knows */

actionList.SMN = smnCastedGCDs.concat(smnInstantGCDs, smnOGCDs);
statusList.SMN = [
  'Bio', 'Bio II', 'Bio III',
  'Miasma', 'Miasma III',
  'Further Ruin', /* in log, this doesn't display stacks OR send a loses message until the buff is entirely gone */
  'Hellish Conduit',

  'Devotion',
];
castingList.SMN = smnCastedGCDs;

const smnNext = ({
  time = player.gcd,
} = {}) => {
  next.aetherflow = player.aetherflow;
  next.dreadwyrm = player.dreadwyrm;
  next.dreadwyrmAether = player.dreadwyrmAether;
  next.bahamut = player.bahamut;
  next.firebird = player.firebird;

  next.hellishconduitStatus = checkStatus({ name: 'Hellish Conduit' });

  if (target.id && target.id.startsWith('4')) {
    if (player.level >= 66) {
      next.bioStatus = checkStatus({ name: 'Bio III', id: target.id });
    } else if (player.level >= 26) {
      next.bioStatus = checkStatus({ name: 'Bio II', id: target.id });
    } else {
      next.bioStatus = checkStatus({ name: 'Bio', id: target.id });
    }

    if (player.level >= 66) {
      next.miasmaStatus = checkStatus({ name: 'Miasma III', id: target.id });
    } else {
      next.miasmaStatus = checkStatus({ name: 'Miasma', id: target.id });
    }
  }

  next.swiftcastStatus = checkStatus({ name: 'Swiftcast' });

  next.egiassault1Recast = checkRecast({ name: 'Egi Assault 1' });
  next.egiassault2Recast = checkRecast({ name: 'Egi Assault 2' });
  next.egiassaultii1Recast = checkRecast({ name: 'Egi Assault II 1' });
  next.egiassaultii2Recast = checkRecast({ name: 'Egi Assault II 2' });
  next.energydrainRecast = checkRecast({ name: 'Energy Drain' });
  next.enkindleRecast = checkRecast({ name: 'Enkindle' });
  next.tridisasterRecast = checkRecast({ name: 'Tri-Disaster' });
  next.dreadwyrmtranceRecast = checkRecast({ name: 'Dreadwyrm Stance' });
  next.summonbahamutRecast = checkRecast({ name: 'Summon Bahamut' });
  next.enkindlebahamutRecast = checkRecast({ name: 'Enkindle Bahamut' });
  next.aetherpactRecast = checkRecast({ name: 'Aetherpact' });
  next.festerRecast = checkRecast({ name: 'Fester' });
  next.baneRecast = checkRecast({ name: 'Bane' });
  next.painflareRecast = checkRecast({ name: 'Painflare' });

  next.furtherruinCount = count.furtherruin;

  next.combat = toggle.combat;
  next.ogcdSlots = toggle.ogcdSlots;

  next.elapsedTime = time;
  previous.elapsedTime = 0;
  let smnArray = [];

  do {
    delete next.gcdTime;
    if (next.ogcdSlots > 0) {
      if (next.elapsedTime === 0) { /* precast */
        smnArray.push({ name: player.ruinSpell });
      } else if (next.bahamut - next.elapsedTime > 0
      && next.bahamut - next.elapsedTime < player.gcd * (next.furtherruinCount + 0)
      && next.furtherruinCount > 0) {
        /* Use Ruin IV if running out of Bahamut GCDs */
        smnArray.push({ name: 'Ruin IV' });
        next.furtherruinCount = Math.max(next.furtherruinCount - 1, 0);
      } else if (player.level >= 62 && next.furtherruinCount >= 4
      && next.egiassault2Recast - next.elapsedTime < player.gcd * 2) {
        /* Use Ruin IV if about to get another stack from EA */
        smnArray.push({ name: 'Ruin IV' });
        next.furtherruinCount = Math.max(next.furtherruinCount - 1, 0);
      } else if (player.level >= 74 && next.furtherruinCount >= 4
      && next.egiassaultii2Recast - next.elapsedTime < player.gcd * 2) {
        /* Use Ruin IV if about to get another stack from EAII */
        smnArray.push({ name: 'Ruin IV' });
        next.furtherruinCount = Math.max(next.furtherruinCount - 1, 0);
      } else if (player.level >= 10
      && next.egiassault2Recast - next.elapsedTime < player.gcd) {
        /* Use Egi Assault before second stack stops timer */
        smnArray.push({ name: 'Egi Assault' });
        next.egiassault1Recast = next.egiassault2Recast + next.elapsedTime;
        next.egiassault2Recast = next.egiassault2Recast + recast.egiassault + next.elapsedTime;
        if (player.level >= 62) {
          next.furtherruinCount = Math.min(next.furtherruinCount + 1, 4);
        }
      } else if (player.level >= 40
      && next.egiassaultii2Recast - next.elapsedTime < player.gcd) {
        /* Use Egi Assault II before second stack stops timer */
        smnArray.push({ name: 'Egi Assault II' });
        next.egiassaultii1Recast = next.egiassaultii2Recast + next.elapsedTime;
        next.egiassaultii2Recast += recast.egiassaultii + next.elapsedTime;
        if (player.level >= 74) {
          next.furtherruinCount = Math.min(next.furtherruinCount + 1, 4);
        }
      } else if (next.firebird - next.elapsedTime > 0) { /* in Firebird phase */
        if (next.hellishconduitStatus - next.elapsedTime > 0) {
          smnArray.push({ name: 'Brand Of Purgatory' });
          next.hellishconduitStatus = -1;
        } else {
          smnArray.push({ name: 'Fountain Of Fire' });
          next.hellishconduitStatus = duration.hellishconduit + next.elapsedTime;
        }
      } else if (next.bioStatus - next.elapsedTime < 0
      && next.tridisasterRecast - next.elapsedTime > player.gcd * 4
      && next.dreadwyrmtranceRecast - next.elapsedTime > player.gcd * 3) {
        smnArray.push({ name: player.bioSpell });
        next.bioStatus = 30000 + next.elapsedTime;
      } else if (next.miasmaStatus - next.elapsedTime < 0
      && next.tridisasterRecast - next.elapsedTime > player.gcd * 4
      && next.dreadwyrmtranceRecast - next.elapsedTime > player.gcd * 3) {
        smnArray.push({ name: player.miasmaSpell });
        next.miasmaStatus = 30000 + next.elapsedTime;
      } else if (player.level >= 70 && next.egiassault1Recast - next.elapsedTime < 0
      && next.furtherruinCount < 4) {
        smnArray.push({ name: 'Egi Assault' });
        next.egiassault1Recast = next.egiassault2Recast + next.elapsedTime;
        next.egiassault2Recast = next.egiassault2Recast + recast.egiassault + next.elapsedTime;
        next.furtherruinCount = Math.min(next.furtherruinCount + 1, 4);
      } else if (player.level >= 74 && next.egiassaultii1Recast - next.elapsedTime < 0
      && next.furtherruinCount < 4) {
        smnArray.push({ name: 'Egi Assault II' });
        next.egiassaultii1Recast = next.egiassaultii2Recast + next.elapsedTime;
        next.egiassaultii2Recast += recast.egiassaultii + next.elapsedTime;
        next.furtherruinCount = Math.min(next.furtherruinCount + 1, 4);
      } else if (player.level >= 40 && count.targets >= 4) {
        smnArray.push({ name: 'Outburst' });
      } else if (player.level >= 40 && count.targets >= 3 && next.furtherruinCount === 0) {
        smnArray.push({ name: 'Outburst' });
      } else {
        smnArray.push({ name: player.ruinSpell });
      }
    }

    /* Determine OGCDs and adjust existing GCDs accordingly */
    const ogcdArray = [];
    next.ogcdSlots = 2;
    next.elapsedTime += 500;
    while (next.ogcdSlots > 0 && next.combat === 1) {
      if (player.level >= 80 && next.firebird - next.elapsedTime > 0
      && next.enkindlebahamutRecast - next.elapsedTime < 0) {
        ogcdArray.push({ name: 'Enkindle Phoenix', size: 'small' });
        next.enkindlebahamutRecast = recast.enkindlebahamut + next.elapsedTime;
      } else if (next.bahamut - next.elapsedTime > 0
      && next.enkindlebahamutRecast - next.elapsedTime < 0) {
        ogcdArray.push({ name: 'Enkindle Bahamut', size: 'small' });
        next.enkindlebahamutRecast = recast.enkindlebahamut + next.elapsedTime;
      } else if (player.level >= 30 && next.aetherflow === 0
      && next.energydrainRecast - next.elapsedTime < 0) {
        if (count.targets >= 3 && player.level >= 35) {
          ogcdArray.push({ name: 'Energy Syphon', size: 'small' });
        } else {
          ogcdArray.push({ name: 'Energy Drain', size: 'small' });
        }
        next.aetherflow = 2;
        next.energydrainRecast = recast.energydrain + next.elapsedTime;
      } else if (player.level >= 58 && next.dreadwyrmtranceRecast - next.elapsedTime < player.gcd
      && next.tridisasterRecast - next.elapsedTime < 0) {
        /* Use Tri-disaster if it will be reset soon */
        ogcdArray.push({ name: 'Tri-Disaster', size: 'small' });
        next.tridisasterRecast = recast.tridisaster + next.elapsedTime;
        next.bioStatus = 30000 + next.elapsedTime;
        next.miasmaStatus = 30000 + next.elapsedTime;
      } else if (player.level >= 60 && next.dreadwyrm - next.elapsedTime > 0
      && next.dreadwyrm - next.elapsedTime < player.gcd) {
        ogcdArray.push({ name: 'Deathflare', size: 'small' });
        next.dreadwyrm = -1 + next.elapsedTime;
        if (player.level >= 70 && next.dreadwyrmAether >= 2) {
          ogcdArray.push({ name: 'Summon Bahamut', size: 'small' });
          next.dreadwyrmAether = 0;
          next.bahamut = 20000 + next.elapsedTime;
          next.summonbahamutRecast = recast.summonbahamut + next.elapsedTime;
          next.firebirdToggle = 1;
          next.ogcdSlots -= 1;
        }
      } else if (next.bahamut - next.elapsedTime < 0
      && player.level >= 58 && next.dreadwyrmtranceRecast - next.elapsedTime < 0) {
        if (next.firebirdToggle === 1) {
          ogcdArray.push({ name: 'Firebird Trance', size: 'small' });
          next.firebird = 20000 + next.elapsedTime;
          next.firebirdToggle = 0;
          next.dreadwyrmtranceRecast = recast.dreadwyrmtrance + next.elapsedTime;
          next.tridisasterRecast = -1 + next.elapsedTime;
        } else {
          /* Dreadwyrm Trance */
          ogcdArray.push({ name: 'Dreadwyrm Trance', size: 'small' });
          next.dreadwyrm = 20000 + next.elapsedTime;
          next.dreadwyrmtranceRecast = recast.dreadwyrmtrance + next.elapsedTime;
          next.tridisasterRecast = -1 + next.elapsedTime;
          if (player.level >= 72) {
            next.dreadwyrmAether = 2;
          } else if (player.level >= 70) {
            next.dreadwyrmAether = 1;
          }
        }
      } else if (next.aetherpactRecast - next.elapsedTime < 0) {
        ogcdArray.push({ name: 'Aetherpact', size: 'small' });
        next.aetherpactStatus = duration.aetherpact + next.elapsedTime;
        next.aetherpactRecast = recast.aetherpact + next.elapsedTime;
      } else if (player.level >= 56
      && Math.min(next.bioStatus, next.miasmaStatus) - next.elapsedTime < 0
      && next.tridisasterRecast - next.elapsedTime < 0) {
        /* Just use it: Tri-disaster */
        ogcdArray.push({ name: 'Tri-Disaster', size: 'small' });
        next.tridisasterRecast = recast.tridisaster + next.elapsedTime;
        next.bioStatus = 30000 + next.elapsedTime;
        next.miasmaStatus = 30000 + next.elapsedTime;
      } else if (count.targets >= 3
      && Math.min(next.bioStatus, next.miasmaStatus) - next.elapsedTime > 20000
      && next.baneRecast - next.elapsedTime < 0) {
        ogcdArray.push({ name: 'Bane', size: 'small' });
        next.baneRecast = recast.bane + next.elapsedTime;
      } else if (player.level >= 50 && next.enkindleRecast - next.elapsedTime < 0) {
        ogcdArray.push({ name: 'Enkindle', size: 'small' });
        next.enkindleRecast = recast.enkindle + next.elapsedTime;
      } else if (next.aetherflow >= 1
      && count.targets >= 3 && next.painflareRecast - next.elapsedTime < 0) {
        ogcdArray.push({ name: 'Painflare', size: 'small' });
        next.aetherflow -= 1;
        next.painflareRecast = recast.painflare + next.elapsedTime;
      } else if (next.aetherflow >= 1
      && Math.min(next.bioStatus, next.miasmaStatus) - next.elapsedTime > 0
      && next.festerRecast - next.elapsedTime < 0) {
        ogcdArray.push({ name: 'Fester', size: 'small' });
        next.aetherflow -= 1;
        next.festerRecast = recast.fester + next.elapsedTime;
      } else if (player.level >= 72 && next.ogcdSlots >= 2
      && next.dreadwyrm - next.elapsedTime > 0
      && next.summonbahamutRecast - next.elapsedTime < 0
      && !smnArray[smnArray.length - 1].name.includes('Egi Assault')
      && next.furtherruinCount >= 4) {
        /* No OGCDs to weave, pow pow Deathflare Bahamut */
        ogcdArray.push({ name: 'Deathflare', size: 'small' });
        next.dreadwyrm = -1 + next.elapsedTime;
        ogcdArray.push({ name: 'Summon Bahamut', size: 'small' });
        next.dreadwyrmAether = 0;
        next.bahamut = 20000 + next.elapsedTime;
        next.summonbahamutRecast = recast.summonbahamut + next.elapsedTime;
        next.firebirdToggle = 1;
        next.ogcdSlots -= 1;
      } else if (player.level >= 70 && next.ogcdSlots >= 2
      && next.dreadwyrm - next.elapsedTime > 0
      && next.summonbahamutRecast - next.elapsedTime < 0
      && next.furtherruinCount >= 4
      && !smnArray[smnArray.length - 1].name.includes('Egi Assault')
      && next.dreadwyrmAether >= 1) {
        ogcdArray.push({ name: 'Deathflare', size: 'small' });
        next.dreadwyrm = -1 + next.elapsedTime;
        ogcdArray.push({ name: 'Summon Bahamut', size: 'small' });
        next.dreadwyrmAether = 0;
        next.bahamut = 20000 + next.elapsedTime;
        next.summonbahamutRecast = recast.summonbahamut + next.elapsedTime;
        next.firebirdToggle = 1;
        next.ogcdSlots -= 1;
      }
      next.ogcdSlots -= 1; /* Decreases regardless of whether or not something was assigned to
      array */
    }
    /* restore offset to original */
    next.elapsedTime -= 500;

    /* Replace casted GCDs for weaving */
    if (ogcdArray.length > 0
    && (next.dreadwyrm - next.elapsedTime < 0 || next.dreadwyrm - next.elapsedTime > 20000)
    && next.swiftcastStatus - next.elapsedTime < 0
    && smnCastedGCDs.includes(smnArray[smnArray.length - 1].name)) {
      if (smnArray[smnArray.length - 1].name.includes('Miasma')) {
        next.miasmaStatus = -1;
      }
      smnArray.pop();
      if (next.furtherruinCount > 0 && next.bahamut - next.elapsedTime > 0) {
        smnArray.push({ name: 'Ruin IV' });
        next.furtherruinCount = Math.max(next.furtherruinCount - 1, 0);
      } else if (next.furtherruinCount >= 4
      && next.dreadwyrmtranceRecast > Math.min(next.egiassault1, next.egiassaultii1)
      && next.firebirdToggle === 0) {
        smnArray.push({ name: 'Ruin IV' });
        next.furtherruinCount = Math.max(next.furtherruinCount - 1, 0);
      } else if (player.level >= 10 && next.egiassault1 - next.elapsedTime < 0) {
        /* Use second charge on OGCD */
        smnArray.push({ name: 'Egi Assault' });
        next.egiassault1Recast = next.egiassault2Recast + next.elapsedTime;
        next.egiassault2Recast = next.egiassault2Recast + recast.egiassault + next.elapsedTime;
        if (player.level >= 62) {
          next.furtherruinCount = Math.min(next.furtherruinCount + 1, 4);
        }
      } else if (player.level >= 40 && next.egiassaultii1 - next.elapsedTime < 0) {
        /* Use second charge on OGCD */
        smnArray.push({ name: 'Egi Assault II' });
        next.egiassaultii1Recast = next.egiassaultii2Recast + next.elapsedTime;
        next.egiassaultii2Recast += recast.egiassaultii + next.elapsedTime;
        if (player.level >= 74) {
          next.furtherruinCount = Math.min(next.furtherruinCount + 1, 4);
        }
      } else if (player.level >= 38) {
        smnArray.push({ name: 'Ruin II' });
      }
    }
    smnArray = smnArray.concat(ogcdArray);

    if (next.gcdTime) {
      next.elapsedTime += next.gcdTime;
    } else {
      next.elapsedTime += player.gcd;
    }

    next.combat = 1;
  } while (next.elapsedTime < 20000);

  iconArrayB = smnArray;
  syncIcons();
};

onJobChanged.SMN = () => {
  if (player.level >= 66) {
    player.bioSpell = 'Bio III';
    next.bioStatus = checkStatus({ name: 'Bio III', id: target.id });
  } else if (player.level >= 26) {
    player.bioSpell = 'Bio II';
    next.bioStatus = checkStatus({ name: 'Bio II', id: target.id });
  } else {
    player.bioSpell = 'Bio';
    next.bioStatus = checkStatus({ name: 'Bio', id: target.id });
  }

  if (player.level >= 66) {
    player.miasmaSpell = 'Miasma III';
    next.miasmaStatus = checkStatus({ name: 'Miasma III', id: target.id });
  } else {
    player.miasmaSpell = 'Miasma';
    next.miasmaStatus = checkStatus({ name: 'Miasma', id: target.id });
  }

  if (player.level >= 54) {
    player.ruinSpell = 'Ruin III';
  } else {
    player.ruinSpell = 'Ruin';
  }
  toggle.ogcd = 0;
  count.furtherruin = 0;
  smnNext({ time: 0 });
};

onAction.SMN = (actionMatch) => {
  removeIcon({ name: actionMatch.groups.actionName });

  if (smnSingleTarget.includes(actionMatch.groups.actionName)) {
    count.targets = 1;
  }

  if (smnCastedGCDs.includes(actionMatch.groups.actionName)) {
    if (smnMiasmaSpells.includes(actionMatch.groups.actionName)) {
      addStatus({ name: player.miasmaSpell, id: actionMatch.groups.targetID });
    }
    if (checkStatus({ name: 'Swiftcast' }) > 0) {
      smnNext();
    } else {
      smnNext({ time: 0 });
    }
  } else if (smnInstantGCDs.includes(actionMatch.groups.actionName)) {
    if (smnBioSpells.includes(actionMatch.groups.actionName)) {
      addStatus({ name: player.bioSpell, id: actionMatch.groups.targetID });
    } else if (actionMatch.groups.actionName === 'Ruin IV') {
      count.furtherruin = Math.max(count.furtherruin - 1, 0);
    } else if (actionMatch.groups.actionName === 'Fountain Of Fire') {
      addStatus({ name: 'Hellish Conduit' });
    } else if (actionMatch.groups.actionName === 'Brand Of Purgatory') {
      removeStatus({ name: 'Hellish Conduit' });
    } else if (smnAssaultI.includes(actionMatch.groups.actionName)) {
      if (checkRecast({ name: 'Egi Assault 2' }) > 0) {
        addRecast({ name: 'Egi Assault 1', time: checkRecast({ name: 'Egi Assault 2' }) });
        addCountdown({ name: 'Egi Assault 1', text: '#1 READY' });
      }
      addRecast({ name: 'Egi Assault 2', time: checkRecast({ name: 'Egi Assault 2' }) + recast.egiassault });
      addCountdown({ name: 'Egi Assault 2', text: '#2 READY' });
    } else if (smnAssaultII.includes(actionMatch.groups.actionName)) {
      if (checkRecast({ name: 'Egi Assault II 2' }) > 0) {
        addRecast({ name: 'Egi Assault II 1', time: checkRecast({ name: 'Egi Assault II 2' }) });
        addCountdown({ name: 'Egi Assault II 1', text: '#1 READY' });
      }
      addRecast({ name: 'Egi Assault II 2', time: checkRecast({ name: 'Egi Assault II 2' }) + recast.egiassault });
      addCountdown({ name: 'Egi Assault II 2', text: '#2 READY' });
    }
    toggle.ogcdSlots = 2;
    smnNext();
  } else if (smnOGCDs.includes(actionMatch.groups.actionName)) {
    addRecast({ name: actionMatch.groups.actionName });
    if (actionMatch.groups.actionName === 'Tri-Disaster') {
      addCountdown({ name: 'Tri-Disaster' });
    } else if (actionMatch.groups.actionName === 'Dreadwyrm Trance') {
      addRecast({ name: 'Dreadwyrm Trance' });
      addRecast({ name: 'Tri-Disaster', time: -1 });
      addCountdown({ name: 'Tri-Disaster' });
      if (player.level >= 72) {
        addCountdown({ name: 'Trance', property: 'firebirdtrance', time: checkRecast({ name: 'Dreadwyrm Trance' }) });
      } else {
        addCountdown({ name: 'Trance', property: 'dreadwyrmtrance', time: checkRecast({ name: 'Dreadwyrm Trance' }) });
      }
    } else if (actionMatch.groups.actionName === 'Firebird Trance') {
      addRecast({ name: 'Dreadwyrm Trance' });
      addRecast({ name: 'Tri-Disaster', time: -1 });
      addCountdown({ name: 'Tri-Disaster' });
      addCountdown({ name: 'Trance', property: 'dreadwyrmtrance', time: checkRecast({ name: 'Dreadwyrm Trance' }) });
    }
  }
};

onStatus.SMN = (statusMatch) => {
  if (statusMatch.groups.gainsLoses === 'gains') {
    addStatus({ name: statusMatch.groups.statusName, id: statusMatch.groups.targetID });
  } else {
    removeStatus({ name: statusMatch.groups.statusName, id: statusMatch.groups.targetID });
  }
};


onTargetChanged.SMN = () => {};
