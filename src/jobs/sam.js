// eslint-disable-next-line no-unused-vars
const samJobChanged = (e) => {
  const { level } = currentPlayer;

  if (level >= 86) {
    const index = actionData.findIndex((element) => element.name === 'Fuga');
    actionData.splice(index, 1);
  }

  currentPlayer.kenki = e.detail.jobDetail.kenki;
  currentPlayer.meditationStacks = e.detail.jobDetail.meditationStacks;
  currentPlayer.setsu = e.detail.jobDetail.setsu;
  currentPlayer.getsu = e.detail.jobDetail.getsu;
  currentPlayer.ka = e.detail.jobDetail.ka;
  currentPlayer.sen = currentPlayer.setsu + currentPlayer.getsu + currentPlayer.ka;
};

// eslint-disable-next-line no-unused-vars
const samTargetChanged = () => {
  startLoop();
};

// eslint-disable-next-line no-unused-vars
const samActionMatch = ({
  // logType, // Currently unused parameters commented out
  actionName,
  // targetID,
  loop,
} = {}) => {
  const { level } = currentPlayer;

  let player = currentPlayer;
  if (loop) { player = loopPlayer; }

  // Sen
  switch (actionName) {
    case 'Higanbana': case 'Tenka Goken': case 'Midare Setsugekka': case 'Hagakure':
      // Hagakure Kenki should be taken care of before here
      player.setsu = false; player.getsu = false; player.ka = false; break;
    case 'Gekko': case 'Mangetsu':
      player.getsu = true; break;
    case 'Kasha': case 'Oka':
      player.ka = true; break;
    case 'Yukikaze':
      player.setsu = true; break;
    default:
  }

  // Kenki
  if (level >= 52) {
    switch (actionName) {
      case 'Hakaze': case 'Jinpu': case 'Shifu': case 'Fuga':
        if (level >= 62) { player.kenki += 5; } break;
      case 'Gekko': case 'Kasha': case 'Mangetsu': case 'Oka': case 'Enpi':
        player.kenki += 5;
        if (level >= 62) { player.kenki += 5; } break;
      case 'Yukikaze':
        player.kenki += 10;
        if (level >= 62) { player.kenki += 5; } break;
      case 'Fuko':
        player.kenki += 10; break;
      case 'Hissatsu: Kaiten':
        player.kenki -= 20; break;
      case 'Hissatsu: Gyoten': case 'Hissatsu: Yaten':
        player.kenki -= 10; break;
      case 'Hissatsu: Shinten': case 'Hissatsu: Kyuten': case 'Hissatsu: Guren': case 'Hissatsu: Senei':
        player.kenki -= 25; break;
      case 'Hagakure':
        player.kenki += 10 * (player.getsu + player.ka + player.setsu); break;
      case 'Ikishoten':
        player.kenki += 50; break;
      default:
    }

    // Normalize Kenki just in case?
    if (player.kenki > 100) {
      player.kenki = 100;
    } else if (player.kenki < 0) {
      player.kenki = 0;
    }
  }

  // Meditation Stacks
  if (level >= 80) {
    switch (actionName) {
      case 'Higanbana': case 'Tenka Goken': case 'Midare Setsugekka': case 'Ogi Namikiri':
        player.meditation = Math.min(player.meditation + 1, 3); break;
      case 'Shoha': case 'Shoha II':
        player.meditation = 0; break;
      default:
    }
  }

  // Status effects
  switch (actionName) {
    case 'Jinpu': case 'Mangetsu':
      addStatus({ statusName: 'Fugetsu', loop }); break;
    case 'Shifu': case 'Oka':
      addStatus({ statusName: 'Fuka', loop }); break;
    case 'Gekko':
      if (getStatusDuration({ statusName: 'Meikyo Shisui', loop }) > 0) { addStatus({ statusName: 'Fugetsu', loop }); } break;
    case 'Kasha':
      if (getStatusDuration({ statusName: 'Meikyo Shisui', loop }) > 0) { addStatus({ statusName: 'Fuka', loop }); } break;
    case 'Meikyo Shisui':
      addStatus({ statusName: 'Meikyo Shisui', stacks: 3, loop }); break; // Special naming for random reasons
    case 'Hissatsu: Kaiten':
      addStatus({ statusName: 'Kaiten', loop }); break; // Special naming for random reasons
    case 'Ikishoten':
      if (level >= 90) { addStatus({ statusName: 'Ogi Namikiri Ready', loop }); } break;
    case 'Ogi Namikiri':
      removeStatus({ statusName: 'Ogi Namikiri Ready', loop }); break;
    case 'Higanbana':
      addStatus({ statusName: 'Higanbana', targetID: currentTarget.id, loop }); break; // Standard statuses
    default:
  }

  // Remove stacks for Meikyo Shisui
  if (getStatusDuration({ statusName: 'Meikyo Shisui', loop }) > 0) {
    switch (actionName) {
      case 'Hakaze': case 'Jinpu': case 'Shifu': case 'Gekko': case 'Kasha': case 'Yukikaze':
      case 'Fuga': case 'Mangetsu': case 'Oka': case 'Fuko':
      case 'Enpi':
        removeStatusStacks({ statusName: 'Meikyo Shisui', loop });
        break;
      default:
    }
  }

  // Add recasts
  switch (actionName) {
    case 'Kaeshi: Higanbana': case 'Kaeshi: Goken': case 'Kaeshi: Setsugekka':
      addActionRecast({ actionName: 'Tsubame-gaeshi', loop }); break;
    case 'Hissatsu: Guren': case 'Hissatsu: Senei':
      addActionRecast({ actionName: 'Hissatsu: Guren', loop }); addActionRecast({ actionName: 'Hissatsu: Senei', loop }); break;
    default:
      addActionRecast({ actionName, loop });
  }

  // Add combo
  addComboAction({ actionName, loop });

  // Combat toggle
  switch (actionName) {
    case 'Third Eye': case 'Meikyo Shisui': case 'Hissatsu: Kaiten': case 'Meditate':
      break;
    default:
      player.combat = true;
  }

  // Probable target count
  switch (actionName) {
    case 'Fuga': case 'Mangetsu': case 'Oka': case 'Fuko':
      player.targetCount = 3; break;
    case 'Hakaze': case 'Jinpu': case 'Shifu':
      player.targetCount = 1; break;
    case 'Gekko':
      if (level >= 35) { player.targetCount = 1; } break;
    case 'Kasha':
      if (level >= 45) { player.targetCount = 1; } break;
    case 'Tenka Goken':
      if (level >= 50) { player.targetCount = 3; } break;
    case 'Midare Setsugekka':
      player.targetCount = 1; break;
    default:
  }

  // Start loop
  if (!loop) {
    switch (actionName) {
      case 'Hakaze': case 'Jinpu': case 'Shifu': case 'Gekko': case 'Kasha': case 'Yukikaze':
      case 'Fuga': case 'Mangetsu': case 'Oka': case 'Fuko':
      case 'Enpi':
      case 'Kaeshi: Higanbana': case 'Kaeshi: Goken': case 'Kaeshi: Setsugekka':
      case 'Kaeshi: Namikiri':
        startLoop({ delay: player.gcd }); break;
      case 'Higanbana': case 'Tenka Goken': case 'Midare Setsugekka':
        // Prevent loop from starting and "removing" Kaeshi
        if (level < 76) { startLoop({ delay: player.gcd }); } break;
      default:
    }
  }
};

// eslint-disable-next-line no-unused-vars
const samGaugeMatch = ({ gaugeHex } = {}) => {
  // Sen
  switch (gaugeHex[1].substring(2, 4)) {
    case '00':
      currentPlayer.setsu = false;
      currentPlayer.getsu = false;
      currentPlayer.ka = false; break;
    case '01':
      currentPlayer.setsu = true;
      currentPlayer.getsu = false;
      currentPlayer.ka = false; break;
    case '02':
      currentPlayer.setsu = false;
      currentPlayer.getsu = true;
      currentPlayer.ka = false; break;
    case '03':
      currentPlayer.setsu = true;
      currentPlayer.getsu = true;
      currentPlayer.ka = false; break;
    case '04':
      currentPlayer.setsu = false;
      currentPlayer.getsu = false;
      currentPlayer.ka = true; break;
    case '05':
      currentPlayer.setsu = true;
      currentPlayer.getsu = false;
      currentPlayer.ka = true; break;
    case '06':
      currentPlayer.setsu = false;
      currentPlayer.getsu = true;
      currentPlayer.ka = true; break;
    case '07':
      currentPlayer.setsu = true;
      currentPlayer.getsu = true;
      currentPlayer.ka = true; break;
    default:
  }

  currentPlayer.kenki = parseInt(gaugeHex[1].substring(6), 16);
  currentPlayer.meditation = parseInt(gaugeHex[1].substring(4, 6), 16);
  console.log(`Setsu: ${currentPlayer.setsu} | Getsu: ${currentPlayer.getsu} | Ka: ${currentPlayer.ka} | Kenki: ${currentPlayer.kenki} | Meditation: ${currentPlayer.meditation}`);
};

// eslint-disable-next-line no-unused-vars
const samStatusMatch = ({ logType, statusName, targetID }) => {
  switch (statusName) {
    case 'Fuka':
      if (logType === 'StatusAdd') {
        if (currentPlayer.level >= 78) {
          currentPlayer.gcd = calculateRecast({ modifier: 0.87 });
        } else {
          currentPlayer.gcd = calculateRecast({ modifier: 0.9 });
        }
      } else {
        currentPlayer.gcd = calculateRecast();
      }
      break;
    default:
  }
};

// eslint-disable-next-line no-unused-vars
const samNextGCD = () => {
  const { level } = currentPlayer;
  const { targetCount } = loopPlayer;

  const { comboAction } = loopPlayer;
  // const { kenki } = loopPlayer;
  const { gcd } = loopPlayer;

  const { combat } = loopPlayer;
  const { getsu } = loopPlayer;
  const { ka } = loopPlayer;
  const { setsu } = loopPlayer;
  const sen = getsu + ka + setsu;
  const { kenki } = loopPlayer;

  const fugetsuDuration = getStatusDuration({ statusName: 'Fugetsu', loop: true });
  const fukaDuration = getStatusDuration({ statusName: 'Fuka', loop: true });
  const higanbanaDuration = getStatusDuration({ statusName: 'Higanbana', targetID: currentTarget.id, loop: true });
  const meikyoShisuiDuration = getStatusDuration({ statusName: 'Meikyo Shisui', loop: true });
  const ogiNamikiriReadyDuration = getStatusDuration({ statusName: 'Ogi Namikiri Ready', loop: true });

  const tsubamegaeshiRecast = getRecast({ actionName: 'Tsubame-gaeshi', loop: true });
  const meikyoShisuiRecast = getRecast({ actionName: 'Meikyo Shisui', loop: true });

  // Start combat with Meikyo Shisui Gekko/Kasha if possible
  if (!combat && !comboAction && meikyoShisuiDuration === 0) {
    if (meikyoShisuiRecast < 55) {
      return 'Meikyo Shisui';
    }
  }

  // Final alignment for Tsubame-gaeshi
  if (level >= 76) {
    let tsubamegaeshiTimeOffset = 0;
    if (level >= 84) { tsubamegaeshiTimeOffset = 60; }
    if (sen === 3) {
      // Tsubame-gaeshi ready for use
      if (tsubamegaeshiRecast <= tsubamegaeshiTimeOffset + gcd) {
        if (kenki >= 20) { return ['Hissatsu: Kaiten', 'Midare Setsugekka', 'Kaeshi: Setsugekka']; }
        return ['Midare Setsugekka', 'Kaeshi: Setsugekka'];
      }
      if (meikyoShisuiDuration === 0) {
        if (tsubamegaeshiRecast <= tsubamegaeshiTimeOffset + gcd * 2) {
          if (comboAction === 'Jinpu') { return 'Enpi'; }
          if (comboAction === 'Shifu') { return 'Enpi'; }
          if (comboAction === 'Hakaze' && fugetsuDuration <= fukaDuration) { return 'Jinpu'; }
          if (comboAction === 'Hakaze' && fukaDuration < fugetsuDuration) { return 'Shifu'; }
          if (!comboAction) { return 'Hakaze'; }
        }
        if (tsubamegaeshiRecast <= tsubamegaeshiTimeOffset + gcd * 3) {
          if (!comboAction) { return 'Hakaze'; }
        }
      }

      // Midare resets Sen in time for next Tsubame here:
      if (tsubamegaeshiRecast > tsubamegaeshiTimeOffset + gcd * 9) {
        // 0 Midare 12345678 3 Sen 9 Midare 10 Kaeshi
        if (kenki >= 20) { return ['Hissatsu: Kaiten', 'Midare Setsugekka']; }
        return 'Midare Setsugekka';
      }
      if (tsubamegaeshiRecast > tsubamegaeshiTimeOffset + gcd * 8 && comboAction === 'Hakaze') {
        // 0 Midare 1234567 3 Sen 8 Midare 9 Kaeshi
        if (kenki >= 20) { return ['Hissatsu: Kaiten', 'Midare Setsugekka']; }
        return 'Midare Setsugekka';
      }
      if (tsubamegaeshiRecast > tsubamegaeshiTimeOffset + gcd * 7 && (comboAction === 'Jinpu' || comboAction === 'Shifu')) {
        // 0 Midare 123456 3 Sen 7 Midare 8 Kaeshi
        if (kenki >= 20) { return ['Hissatsu: Kaiten', 'Midare Setsugekka']; }
        return 'Midare Setsugekka';
      }
    }

    if (sen === 2 && targetCount > 1) {
      if (tsubamegaeshiRecast <= tsubamegaeshiTimeOffset + gcd) {
        if (kenki >= 20) { return ['Hissatsu: Kaiten', 'Tenka Goken', 'Kaeshi: Goken']; }
        return ['Tenka Goken', 'Kaeshi: Goken'];
      }
      if (tsubamegaeshiRecast <= tsubamegaeshiTimeOffset + gcd * 2 && meikyoShisuiDuration === 0) {
        if (!comboAction && level >= 86) { return 'Fuko'; }
        return 'Fuga';
      }
    }

    if (sen === 1 && targetCount === 1) {
      // (0) Higanbana > (1-8) 3 sen  > (9) Midare > (10) Tsubame-gaeshi

      if (tsubamegaeshiRecast > tsubamegaeshiTimeOffset + gcd * 9 && higanbanaDuration < gcd) {
        // 0 Higanbana 12345678 3 Sen 9 Midare 10 Kaeshi
        if (kenki >= 20) { return ['Hissatsu: Kaiten', 'Higanbana']; }
        return 'Higanbana';
      }

      if (tsubamegaeshiRecast > tsubamegaeshiTimeOffset + gcd * 8 && higanbanaDuration < gcd && comboAction === 'Hakaze') {
        // 0 Higanbana 1234567 3 Sen 8 Midare 9 Kaeshi
        if (kenki >= 20) { return ['Hissatsu: Kaiten', 'Higanbana']; }
        return 'Higanbana';
      }

      if (tsubamegaeshiRecast > tsubamegaeshiTimeOffset + gcd * 7 && higanbanaDuration < gcd && (comboAction === 'Jinpu' || comboAction === 'Shifu')) {
        // 0 Higanbana 123456 3 Sen 7 Midare 8 Kaeshi
        if (kenki >= 20) { return ['Hissatsu: Kaiten', 'Higanbana']; }
        return 'Higanbana';
      }

      if (tsubamegaeshiRecast > 0 && higanbanaDuration < gcd) {
        if (kenki >= 20) { return ['Hissatsu: Kaiten', 'Higanbana']; }
        return 'Higanbana';
      }
    }

    if (sen === 0 && meikyoShisuiDuration === 0) {
      if (targetCount > 1) {
        if (tsubamegaeshiRecast <= tsubamegaeshiTimeOffset + gcd * 4) {
          // (0) Mangetsu/Oka (1-2) 2 Sen (3) Tenka (4) Tsubame
          if (comboAction === 'Fuga' || comboAction === 'Fuko') {
            if (fukaDuration < fugetsuDuration) { return 'Oka'; }
            return 'Mangetsu';
          }
        }
        if (tsubamegaeshiRecast <= tsubamegaeshiTimeOffset + gcd * 5) {
          // 1 GCD early
          if (comboAction === 'Fuga' || comboAction === 'Fuko') {
            if (fukaDuration < fugetsuDuration) { return 'Oka'; }
            return 'Mangetsu';
          }

          // (0) Fuga (1-3) 2 Sen (4) Tenka (5) Tsubame
          if (!comboAction) {
            if (level >= 76) { return 'Fuko'; }
            return 'Fuga';
          }
        }
        if (tsubamegaeshiRecast <= tsubamegaeshiTimeOffset + gcd * 6) {
          // 1 GCD early
          if (!comboAction) {
            if (level >= 76) { return 'Fuko'; }
            return 'Fuga';
          }
        }
      } else {
        if (tsubamegaeshiRecast <= tsubamegaeshiTimeOffset + gcd * 7) {
          // (0) Gekko/Kasha (1-5) +2 Sen (6) Midare (7) Tsubame
          if (comboAction === 'Jinpu') { return 'Gekko'; }
          if (comboAction === 'Shifu') { return 'Kasha'; }
        }
        if (tsubamegaeshiRecast <= tsubamegaeshiTimeOffset + gcd * 8) {
          // 1 GCD early
          if (comboAction === 'Jinpu') { return 'Gekko'; }
          if (comboAction === 'Shifu') { return 'Kasha'; }

          // (0) Jinpu/Shifu/Yukikaze (1-6) +3 Sen (7) Midare (8) Tsubame
          if (comboAction === 'Hakaze') {
            if (Math.min(fugetsuDuration, fukaDuration) > 2 * gcd) { return 'Yukikaze'; }
            if (comboAction === 'Hakaze' && fukaDuration < fugetsuDuration) { return 'Shifu'; }
            return 'Jinpu';
          }
        }
        if (tsubamegaeshiRecast <= tsubamegaeshiTimeOffset + gcd * 9) {
          // 2 GCDs early
          if (comboAction === 'Jinpu') {
            if (ogiNamikiriReadyDuration > 0) {
              if (kenki >= 20) { return ['Hissatsu: Kaiten', 'Ogi Namikiri', 'Kaeshi: Namikiri']; }
              return ['Ogi Namikiri', 'Kaeshi: Namikiri'];
            }
            return 'Gekko';
          }
          if (comboAction === 'Shifu') {
            if (ogiNamikiriReadyDuration > 0) {
              if (kenki >= 20) { return ['Hissatsu: Kaiten', 'Ogi Namikiri', 'Kaeshi: Namikiri']; }
              return ['Ogi Namikiri', 'Kaeshi: Namikiri'];
            }
            return 'Kasha';
          }

          // 1 GCD early
          if (comboAction === 'Hakaze') {
            if (Math.min(fugetsuDuration, fukaDuration) > 2 * gcd) { return 'Yukikaze'; }
            if (comboAction === 'Hakaze' && fukaDuration < fugetsuDuration) { return 'Shifu'; }
            return 'Jinpu';
          }

          // (0) Hakaze > (1) Jinpu > (2-7) 3 Sen > (8) Midare > (9) Tsubame
          if (!comboAction) { return 'Hakaze'; }
        }
        if (tsubamegaeshiRecast <= tsubamegaeshiTimeOffset + gcd * 10) {
          // 2 GCDs early
          if (comboAction === 'Hakaze') {
            if (ogiNamikiriReadyDuration > 0) {
              if (kenki >= 20) { return ['Hissatsu: Kaiten', 'Ogi Namikiri', 'Kaeshi: Namikiri']; }
              return ['Ogi Namikiri', 'Kaeshi: Namikiri'];
            }
            if (Math.min(fugetsuDuration, fukaDuration) > 2 * gcd) { return 'Yukikaze'; }
            if (comboAction === 'Hakaze' && fukaDuration < fugetsuDuration) { return 'Shifu'; }
            return 'Jinpu';
          }

          // 1 GCD early
          if (!comboAction) { return 'Hakaze'; }
        }
        if (tsubamegaeshiRecast <= tsubamegaeshiTimeOffset + gcd * 11) {
          // 2 GCD early
          if (!comboAction) {
            if (ogiNamikiriReadyDuration > 0) {
              if (kenki >= 20) { return ['Hissatsu: Kaiten', 'Ogi Namikiri', 'Kaeshi: Namikiri']; }
              return ['Ogi Namikiri', 'Kaeshi: Namikiri'];
            }
            return 'Hakaze';
          }
        }
      }
    }
  }

  // Assumes that it didn't fall under above if over level 76
  if (sen === 3) {
    if (kenki >= 20) { return ['Hissatsu: Kaiten', 'Midare Setsugekka']; }
    return 'Midare Setsugekka';
  }

  if (sen === 2 && targetCount > 1) {
    if (kenki >= 20) { return ['Hissatsu: Kaiten', 'Tenka Goken']; }
    return 'Tenka Goken';
  }

  if (level < 76 && sen === 1 && targetCount === 1 && higanbanaDuration < gcd) {
    if (kenki >= 20) { return ['Hissatsu: Kaiten', 'Higanbana']; }
    return 'Higanbana';
  }

  // Meikyo
  if (meikyoShisuiDuration > 0) { // Implies level >= 50
    if (targetCount > 1) {
      if (!getsu && !ka) {
        if (fukaDuration < fugetsuDuration) { return 'Oka'; }
        return 'Mangetsu';
      }
      if (!getsu) { return 'Mangetsu'; }
      if (!ka) { return 'Oka'; }
    }
    if (!getsu && !ka) {
      if (fukaDuration < fugetsuDuration) { return 'Kasha'; }
      return 'Gekko';
    }
    if (!getsu) { return 'Gekko'; }
    if (!ka) { return 'Kasha'; }
    if (!setsu) { return 'Yukikaze'; }
  }

  if (ogiNamikiriReadyDuration > 0) {
    if (kenki >= 20) { return ['Hissatsu: Kaiten', 'Ogi Namikiri', 'Kaeshi: Namikiri']; }
    return ['Ogi Namikiri', 'Kaeshi: Namikiri'];
  }

  if (targetCount > 1) {
    if (comboAction === 'Fuga' || comboAction === 'Fuko') {
      if (level >= 45 && !getsu && !ka) {
        if (fukaDuration < fugetsuDuration) { return 'Oka'; }
        return 'Mangetsu';
      }

      if (level >= 35 && !getsu) { return 'Mangetsu'; }
      if (level >= 45 && !ka) { return 'Oka'; }

      if (level >= 35) { return 'Mangetsu'; }
      if (level >= 45) { return 'Oka'; }
    }

    if (level >= 86) { return 'Fuko'; }
    return 'Fuga';
  }

  if (level >= 30 && comboAction === 'Jinpu') { return 'Gekko'; }
  if (level >= 40 && comboAction === 'Shifu') { return 'Kasha'; }

  if (level >= 40 && comboAction === 'Hakaze') {
    if (level >= 50 && Math.min(fugetsuDuration, fukaDuration) > 2 * gcd && !setsu) { return 'Yukikaze'; }
    if (!getsu && !ka) {
      if (fukaDuration < fugetsuDuration) { return 'Shifu'; }
      return 'Jinpu';
    }
    if (!getsu) { return 'Jinpu'; }
    if (!ka) { return 'Shifu'; }
    if (level >= 50 && !setsu) { return 'Yukikaze'; }
  }

  if (comboAction === 'Hakaze') {
    if (level >= 18 && fukaDuration < fugetsuDuration) { return 'Shifu'; }
    if (level >= 4) { return 'Jinpu'; }
  }

  return 'Hakaze';
};

// eslint-disable-next-line no-unused-vars
const samNextOGCD = ({
  weaveCount,
} = {}) => {
  if (weaveCount > 1) { return ''; } // Lazy

  const { level } = currentPlayer;

  const { comboAction } = loopPlayer;
  const { targetCount } = loopPlayer;
  const { gcd } = loopPlayer;
  const { combat } = loopPlayer;

  const fugetsuDuration = getStatusDuration({ statusName: 'Fugetsu', loop: true });
  const fukaDuration = getStatusDuration({ statusName: 'Fuka', loop: true });
  const meikyoShisuiDuration = getStatusDuration({ statusName: 'Meikyo Shisui', loop: true });

  const tsubamegaeshiRecast = getRecast({ actionName: 'Tsubame-gaeshi', loop: true });
  const { kenki } = loopPlayer;
  const { setsu } = loopPlayer;
  const { getsu } = loopPlayer;
  const { ka } = loopPlayer;
  const sen = setsu + getsu + ka;
  const { meditationStacks } = loopPlayer;

  const ikishotenRecast = getRecast({ actionName: 'Ikishoten', loop: true });

  const meikyoShisuiRecast = getRecast({ actionName: 'Meikyo Shisui', loop: true });
  const hissatsuGurenRecast = getRecast({ actionName: 'Hissatsu: Guren', loop: true });

  if (!combat) { return ''; }

  if (kenki <= 50 && ikishotenRecast < 0.5) { return 'Ikishoten'; }

  if (level >= 76) {
    let tsubamegaeshiTimeOffset = 0;
    if (level >= 84) {
      tsubamegaeshiTimeOffset = 60;
    }
    if (sen > 0) {
    // These ranges look a little suspicious --- adjust as needed
      if (!comboAction && tsubamegaeshiRecast > tsubamegaeshiTimeOffset + 9 * gcd && tsubamegaeshiRecast < tsubamegaeshiTimeOffset + 12 * gcd) {
      // 0 Hagakure 12345678 9 Midare 10 Tsubame (+ up to 2 more)
        return 'Hagakure';
      }
      if (comboAction === 'Hakaze' && tsubamegaeshiRecast > tsubamegaeshiTimeOffset + 8 * gcd && tsubamegaeshiRecast < tsubamegaeshiTimeOffset + 11 * gcd) {
      // 0 Hagakure 1234567 8 Midare 9 Tsubame (+ up to 2 more)
        return 'Hagakure';
      }

      if ((comboAction === 'Jinpu' || comboAction === 'Shifu') && tsubamegaeshiRecast > tsubamegaeshiTimeOffset + 7 * gcd && tsubamegaeshiRecast < tsubamegaeshiTimeOffset + 10 * gcd) {
      // 0 Hagakure 123456 7 Midare 8 Tsubame (+ up to 2 more)
        return 'Hagakure';
      }
    }
  }

  if (!comboAction && meikyoShisuiDuration === 0 && meikyoShisuiRecast <= tsubamegaeshiRecast) {
    if (level >= 88 && meikyoShisuiRecast <= 55) { return 'Meikyo Shisui'; }
    if (level >= 50 && meikyoShisuiRecast === 0) { return 'Meikyo Shisui'; }
  }

  if (level >= 62) {
    let kenkiCap;
    if (ikishotenRecast <= gcd * 2) { kenkiCap = 100; }
    if (ikishotenRecast <= gcd) { kenkiCap = 75; }

    if (!comboAction) {
      if (level >= 86 && !comboAction && targetCount > 1) {
        kenkiCap -= 10;
      } else {
        kenkiCap -= 5;
      }
    }

    if (comboAction === 'Hakaze') {
      if (Math.min(fugetsuDuration, fukaDuration) > 2 * gcd) {
        kenkiCap -= 15;
      } else {
        kenkiCap -= 5;
      }
    }

    if (['Jinpu', 'Shifu', 'Fuga', 'Fuko'].includes(comboAction)) {
      kenkiCap -= 10;
    }

    if (kenki >= kenkiCap) {
      if (level >= 70 && hissatsuGurenRecast === 0) {
        if (level >= 72 && targetCount === 1) { return 'Hissatsu: Senei'; }
        return 'Hissatsu: Guren';
      }

      if (level >= 64 && targetCount >= 3) { return 'Hissatsu: Kyuten'; }
      return 'Hissatsu: Shinten';
    }
  }

  if (meditationStacks === 3) {
    if (level >= 82 && targetCount >= 3) { return 'Shoha II'; }
    return 'Shoha';
  }

  return '';
};
