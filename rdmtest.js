

clearTimeout(timeoutOGCDs);

let next = {};

next.blackMana = player.blackMana;
next.whiteMana = player.whiteMana;

next.verfireStatus = checkStatus({ name: 'Verfire Ready' });
next.verstoneStatus = checkStatus({ name: 'Verstone Ready' });
next.corpsacorpsRecast = checkRecast({ name: 'Corps-A-Corps' });
next.displacementRecast = checkRecast({ name: 'Displacement' });
next.flecheRecast = checkRecast({ name: 'Fleche' });
next.contresixteRecast = checkRecast({ name: 'Contre Sixte' });
next.accelerationRecast = checkRecast({ name: 'Acceleration' });
next.manaficationRecast = checkRecast({ name: 'Manafication' });
next.accelerationCount = accelerationCount;

const hardcastSpells = [
  ['Jolt', 3, 3],
  ['Verfire', 9, 0],
  ['Verstone', 0, 9],
  ['Verthunder II', 7, 0],
  ['Veraero II', 0, 7],
];
const dualcastSpells = [
  ['Verthunder', 11, 0],
  ['Veraero', 0, 11],
  ['Scatter', 3, 3],
];

const rdmArray = [];

let elapsedTime = 0;

let ogcd = 1;
if (elapsedTime < player.gcd / 2) {
  ogcd = 0;
}

do {
  /* Adjust all timers */
  next.verfireStatus = Math.max(next.verfireStatus - elapsedTime, -1);
  next.verstoneStatus = Math.max(next.verstoneStatus - elapsedTime, -1);
  next.corpsacorpsRecast = Math.max(next.corpsacorpsRecast - elapsedTime, -1);
  next.displacementRecast = Math.max(next.displacementRecast - elapsedTime, -1);
  next.flecheRecast = Math.max(next.flecheRecast - elapsedTime, -1);
  next.contresixteRecast = Math.max(next.contresixteRecast - elapsedTime, -1);
  next.accelerationRecast = Math.max(next.accelerationRecast - elapsedTime, -1);
  next.manaficationRecast = Math.max(next.manaficationRecast - elapsedTime, -1);

  /* Check if time for OGCD */
  if (ogcd >= 1) {
    if (player.level >= 60
    && next.manaficationRecast < 0
    && Math.min(next.blackMana, next.whiteMana) >= 40
    && next.blackMana !== next.whiteMana) {
      rdmArray.push({ name: 'Manafication', size: 'small' });
      ogcd -= 1;
      next.manaficationRecast = recast.manafication + elapsedTime;
    } else if (player.level >= 60
    && next.manaficationRecast < 0
    && Math.min(next.blackMana, next.whiteMana) >= 50) {
      rdmArray.push({ name: 'Manafication', size: 'small' });
      ogcd -= 1;
      next.manaficationRecast = recast.manafication + elapsedTime;
    } /* else if (count.targets > 1 && player.level >= 56 && next.contresixteRecast - elapsedTime < 0) {
      rdmArray.push({ name: 'Contre Sixte', size: 'small' });
      ogcd -= 1;
      next.contresixteRecast = recast.contresixte + elapsedTime;
    } else if (player.level >= 45 && next.flecheRecast - elapsedTime < 0) {
      rdmArray.push({ name: 'Fleche', size: 'small' });
      ogcd -= 1;
      next.flecheRecast = recast.fleche + elapsedTime;
    } else if (player.level >= 56 && next.contresixteRecast - elapsedTime < 0) {
      rdmArray.push({ name: 'Contre Sixte', size: 'small' });
      ogcd -= 1;
      next.contresixteRecast = recast.contresixte + elapsedTime;
    } else if (player.level >= 6 && next.corpsacorpsRecast - elapsedTime < 0) {
      rdmArray.push({ name: 'Corps-A-Corps', size: 'small' });
      ogcd -= 1;
      next.corpsacorpsRecast = recast.corpsacorps + elapsedTime;
    } else if (player.level >= 40 && next.displacementRecast - elapsedTime < 0) {
      rdmArray.push({ name: 'Displacement', size: 'small' });
      ogcd -= 1;
      next.displacementRecast = recast.displacement + elapsedTime;
    } */
  }

  /* GCD */

  let dualcastCombo = {};

  if (count.targets > 1
  && target.distance <= 6
  && player.level >= 52 && Math.floor((Math.min(next.blackMana, next.whiteMana) - 50) / 20)
  >= Math.ceil((next.manaficationRecast) / 1500)) {
    /* Mana dump before Manafication */
    rdmArray.push({ name: 'Moulinet' });
    next.blackMana -= 20;
    next.whiteMana -= 20;
    elapsedTime += 1500;
    ogcd = 1;
  } else if (player.level >= 72
  && Math.ceil((Math.min(next.blackMana, next.whiteMana) - 50) / 5)
  >= Math.ceil((next.manaficationRecast) / 2200)) {
    /* Mana dump before Manafication */
    rdmArray.push({ name: 'Reprise' });
    next.blackMana -= 5;
    next.whiteMana -= 5;
    elapsedTime += 2200;
    ogcd = 1;
  } else if (player.level >= 52 && player.level < 72
  && target.distance <= 6
  && Math.ceil((Math.min(next.blackMana, next.whiteMana) - 50) / 20)
  >= Math.ceil((next.manaficationRecast) / 1500)) {
    /* Mana dump before Manafication */
    rdmArray.push({ name: 'Moulinet' });
    next.blackMana -= 20;
    next.whiteMana -= 20;
    elapsedTime += 1500;
    ogcd = 1;
  } else {
    /* Dualcast */
    let oldComboPotency = 0;
    for (let i = 0; i < hardcastSpells.length; i += 1) {
      for (let j = 0; j < dualcastSpells.length; j += 1) {
        /* Setup */
        const hardcastSpell = hardcastSpells[i][0];
        const dualcastSpell = dualcastSpells[j][0];
        const hardcastBlackMana = Math.min(next.blackMana + hardcastSpells[i][1], 100);
        const hardcastWhiteMana = Math.min(next.whiteMana + hardcastSpells[i][2], 100);
        const dualcastBlackMana = Math.min(
          next.blackMana + hardcastSpells[i][1] + dualcastSpells[j][1], 100,
        );
        const dualcastWhiteMana = Math.min(
          next.whiteMana + hardcastSpells[i][2] + dualcastSpells[j][2], 100,
        );
        /* const overcapMana = Math.max(
          next.whiteMana + hardcastSpells[i][2] + dualcastSpells[j][2], 100,
        ) - 100
        + Math.max(
          next.blackMana + hardcastSpells[i][1] + dualcastSpells[j][1], 100,
        ) - 100; */

        /* Starting potency */
        let comboPotency = 0;

        /* Hardcast calculation */
        if (Math.abs(hardcastBlackMana - hardcastWhiteMana) > 30) {
          comboPotency = -1000000;
        } else if (hardcastSpell === 'Jolt') {
          if (player.level >= 62) {
            // Level 62 trait (Jolt II)
            comboPotency += 280;
          } else {
            comboPotency += 180;
          }
        } else if (next.verfireStatus > player.gcd && hardcastSpell === 'Verfire') {
          if (player.level >= 62) {
            // Level 62 trait
            comboPotency += 300;
          } else {
            comboPotency += 270;
          }
        } else if (next.verstoneStatus > player.gcd && hardcastSpell === 'Verstone') {
          if (player.level >= 62) {
            // Level 62 trait
            comboPotency += 300;
          } else {
            comboPotency += 270;
          }
        } else if (player.level >= 18 && hardcastSpell === 'Verthunder II') {
          if (player.level >= 78) {
            // Level 78 trait
            comboPotency += 120 * count.targets;
          } else {
            comboPotency += 100 * count.targets;
          }
        } else if (player.level >= 22 && hardcastSpell === 'Veraero II') {
          if (player.level >= 78) {
            // Level 78 trait
            comboPotency += 120 * count.targets;
          } else {
            comboPotency += 100 * count.targets;
          }
        } else {
          comboPotency = -1000000;
        }

        /* Proc potency */
        let procPotency = 90;
        if (player.level >= 62) {
          procPotency = 20;
        }

        /* Melee combo time  */
        let meleeComboTime = 1500;
        if (player.level >= 80) {
          meleeComboTime = 1500 + 1500 + 2200 + 2500 + 2500;
        } else if (player.level >= 68) {
          meleeComboTime = 1500 + 1500 + 2200 + 2500;
        } else if (player.level >= 50) {
          meleeComboTime = 1500 + 1500 + 2200;
        } else if (player.level >= 35) {
          meleeComboTime = 1500 + 1500;
        }

        /* Dualcast calculation */
        if (comboPotency === -1000000) {
          // Don't matter
        } else if (Math.abs(dualcastBlackMana - dualcastWhiteMana) > 30) {
          comboPotency = -1000000;
        } else if (dualcastSpell === 'Verthunder') {
          if (player.level >= 62) {
            // Level 62 trait
            comboPotency += 350;
          } else {
            comboPotency += 310;
          }

          // 50% proc
          if (hardcastSpell === 'Verfire' || next.verfireStatus <= player.gcd * 3) {
            if (next.accelerationCount > 0) {
              comboPotency += procPotency;
            } else {
              comboPotency += procPotency * 0.5;
            }
          }
        } else if (dualcastSpell === 'Veraero') {
          if (player.level >= 62) {
            // Level 62 trait
            comboPotency += 350;
          } else {
            comboPotency += 310;
          }

          // 50% proc
          if (hardcastSpell === 'Verstone' || next.verstoneStatus < player.gcd * 3) {
            if (next.accelerationCount > 0) {
              comboPotency += procPotency;
            } else {
              comboPotency += procPotency * 0.5;
            }
          }
        } else if (player.level >= 15 && dualcastSpell === 'Scatter') {
          if (player.level >= 66) {
            // Trait
            comboPotency += 220 * count.targets;
          } else {
            comboPotency += 120 * count.targets;
          }
        } else {
          comboPotency = -1000000;
        }

        // Add proc chances from Verholy/Verflare
        if (player.level >= 68
        && Math.min(dualcastBlackMana, dualcastWhiteMana) > 80) {
          if (next.accelerationCount > 1) { // Acceleration active for combo
            if (player.level > 70
            && dualcastSpell !== 'Veraero'
            && (next.verstoneStatus < meleeComboTime + player.gcd || hardcastSpell === 'Verstone')
            && Math.abs((dualcastBlackMana - 80) - (dualcastWhiteMana - 59)) < 30) {
              comboPotency += procPotency;
            } else if (dualcastSpell !== 'Verthunder'
            && (next.verfireStatus < meleeComboTime + player.gcd || hardcastSpell === 'Verfire')
            && Math.abs((dualcastBlackMana - 59) - (dualcastWhiteMana - 80)) < 30) {
              comboPotency += procPotency;
            }
          } else if (player.level >= 70
          && (next.verstoneStatus < meleeComboTime + player.gcd || hardcastSpell === 'Verstone')
          && dualcastSpell !== 'Veraero'
          && dualcastBlackMana > dualcastWhiteMana) {
            comboPotency += procPotency;
          } else if ((next.verfireStatus < meleeComboTime + player.gcd || hardcastSpell === 'Verfire')
          && dualcastSpell !== 'Verthunder'
          && dualcastWhiteMana > dualcastBlackMana) {
            comboPotency += procPotency;
          } else if (player.level >= 70
          && (next.verstoneStatus < meleeComboTime + player.gcd || hardcastSpell === 'Verstone')
          && dualcastSpell !== 'Veraero') {
            comboPotency += 0.2 * procPotency;
          } else if ((next.verfireStatus < meleeComboTime + player.gcd || hardcastSpell === 'Verfire')
          && dualcastSpell !== 'Verthunder') {
            comboPotency += 0.2 * procPotency;
          } else if (player.level >= 70
          && (next.verstoneStatus < meleeComboTime + player.gcd || hardcastSpell === 'Verstone')
          && dualcastSpell === 'Veraero'
          && dualcastBlackMana > dualcastWhiteMana) {
            comboPotency += 0.1 * procPotency;
          } else if ((next.verfireStatus < meleeComboTime + player.gcd || hardcastSpell === 'Verfire')
          && dualcastSpell === 'Verthunder'
          && dualcastWhiteMana > dualcastBlackMana) {
            comboPotency += 0.1 * procPotency;
          }
        }

        const singleTargetManaPotency = 8.07;
        const multiTargetManaPotency = 2.43; // Per target

        /* Add mana potency */
        comboPotency += (dualcastBlackMana + dualcastWhiteMana - next.whiteMana - next.blackMana)
          * Math.max(singleTargetManaPotency, multiTargetManaPotency * count.targets);

        /* Prioritize buff with less time, all other things equal */
        if (next.verstoneStatus > player.gcd
        && next.verstoneStatus < next.verfireStatus
        && hardcastSpell === 'Verstone') {
          comboPotency += 1;
        } else if (next.verfireStatus > player.gcd
        && next.verfireStatus < next.verstoneStatus
        && hardcastSpell === 'Verfire') {
          comboPotency += 1;
        }

        if (comboPotency > oldComboPotency) {
          dualcastCombo = {
            hardcastSpell,
            dualcastSpell,
            dualcastBlackMana,
            dualcastWhiteMana,
          };
        }
      }
    }
    rdmArray.push({ name: dualcastCombo.hardcastSpell });
    rdmArray.push({ name: dualcastCombo.dualcastSpell });
    next.blackMana = dualcastCombo.dualcastBlackMana;
    next.whiteMana = dualcastCombo.dualcastWhiteMana;
    elapsedTime += player.gcd * 2;
    ogcd = 1;
  }
} while (elapsedTime < 12500);

/* Run function again if too much time passes and no action taken */
timeoutOGCDs = setTimeout(rdmNext, player.gcd / 2, { time: player.gcd / 2 });
