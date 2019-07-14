"use strict";

actionList.sam = [
  "Higanbana", "Midare Setsugekka", "Kaeshi: Higanbana", "Kaeshi: Setsugekka",

  "Meikyo Shisui",
  "Hissatsu: Kaiten", "Hissatsu: Gyoten", "Hissatsu: Yaten", "Meditate", "Ikishoten",

  "Tenka Goken", "Hissatsu: Guren", "Kaeshi: Goken",

  "Hakaze", "Jinpu", "Shifu", "Gekko", "Kasha", "Yukikaze", "Hissatsu: Shinten", "Hissatsu: Senei",
  "Fuga", "Mangetsu", "Oka", "Hissatsu: Kyuten",

  "Enpi"
];

function samInCombatChangedEvent(e) {

}

function samJobChange() {

  nextid.iaijutsu1 = 0;
  nextid.tsubamegaeshi1 = 1;
  nextid.hakaze = 2;
  nextid.fuga = nextid.hakaze;
  nextid.jinpu = 3;
  nextid.shifu = nextid.jinpu;
  nextid.iaijutsu2 = 4;
  nextid.tsubamegaeshi2 = 5;
  nextid.gekko = 6;
  nextid.kasha = nextid.gekko;
  nextid.yukikaze = nextid.gekko;
  nextid.mangetsu = nextid.gekko;
  nextid.oka = nextid.gekko;
  nextid.ikishoten = 10;
  nextid.meikyoshisui = 11;
  nextid.guren = 12;
  nextid.senei = nextid.guren;
  nextid.shinten = 13;
  nextid.kyuten = nextid.shinten;
  nextid.seigan = nextid.shinten;
  nextid.shoha = 14;

  previous.fuga = 0;
  previous.mangetsu = 0;
  previous.oka = 0;
  previous.tenkagoken = 0;
  previous.kaeshigoken = 0;

  if (player.level >= 68
  && checkCooldown("ikishoten", player.ID) < 0) {
    addIconBlink(nextid.ikishoten,icon.ikishoten);
  }

  samMeikyoShisui();
  samKenki();
  samSen();
}

function samAction() {

  if (actionList.sam.indexOf(actionGroups.actionname) > -1) {

    removeText("loadmessage");
    // removeText("debug1");
    // These actions don't interrupt combos

    if (actionGroups.actionname == "Higanbana") {
      addStatus("higanbana", actionGroups.targetID, duration.higanbana);
      if (checkStatus("meikyoshisui", player.ID) > 0) {
        samCombo(); // Consuming Sen under Meikyo will trigger a new combo
      }
      icon.iaijutsu = "003159";
      removeIcon(id.iaijutsu1);
      removeIcon(id.iaijutsu2);
      timeout.tsubamegaeshi1 = setTimeout(removeIcon, 12500, id.tsubamegaeshi1);
      timeout.tsubamegaeshi2 = setTimeout(removeIcon, 12500, id.tsubamegaeshi2);
    }

    else if ("Tenka Goken" == actionGroups.actionname) {
      if (Date.now() - previous.tenkagoken > 1000) {
        previous.tenkagoken = Date.now();
        count.aoe = 1;
      }
      else {
        count.aoe = count.aoe + 1;
      }
      if (checkStatus("meikyoshisui", player.ID) > 0) {
        samCombo(); // Consuming Sen under Meikyo will trigger a new combo
      }
      icon.iaijutsu = "003159";
      removeIcon(id.iaijutsu1);
      removeIcon(id.iaijutsu2);
      timeout.tsubamegaeshi1 = setTimeout(removeIcon, 12500, id.tsubamegaeshi1);
      timeout.tsubamegaeshi2 = setTimeout(removeIcon, 12500, id.tsubamegaeshi2);
    }

    else if ("Midare Setsugekka" == actionGroups.actionname) {
      if (checkStatus("meikyoshisui", player.ID) > 0) {
        samCombo(); // Consuming Sen under Meikyo will trigger a new combo
      }
      icon.iaijutsu = "003159";
      removeIcon(id.iaijutsu1);
      removeIcon(id.iaijutsu2);
      timeout.tsubamegaeshi1 = setTimeout(removeIcon, 12500, id.tsubamegaeshi1);
      timeout.tsubamegaeshi2 = setTimeout(removeIcon, 12500, id.tsubamegaeshi2);
    }

    else if (["Kaeshi: Higanbana", "Kaeshi: Goken", "Kaeshi: Setsugekka"].indexOf(actionGroups.actionname) > -1) {
      addCooldown("tsubamegaeshi", player.ID, recast.tsubamegaeshi);
      icon.tsubamegaeshi = "003180";
      clearTimeout(timeout.tsubamegaeshi);
      removeIcon(id.tsubamegaeshi1);
      removeIcon(id.tsubamegaeshi2);
    }

    else if (actionGroups.actionname == "Meikyo Shisui") {
      addCooldown("meikyoshisui", player.ID, recast.meikyoshisui);
      addStatus("meikyoshisui", player.ID, duration.meikyoshisui);
      removeIcon(id.meikyoshisui);
      samCombo(); // Clears combo and activates next Sen generating move
    }

    else if (actionGroups.actionname == "Hissatsu: Kaiten") {
      addStatus("kaiten", player.ID, duration.kaiten);
      samKenki();
    }

    else if (actionGroups.actionname == "Hissatsu: Shinten") {
      removeIcon(id.shinten);
      samKenki();
    }

    else if (actionGroups.actionname == "Hissatsu: Kyuten") {
      removeIcon(id.kyuten);
      samKenki();
    }

    else if (actionGroups.actionname == "Hissatsu: Seigan") {
      removeIcon(id.seigan);
      samKenki();
    }

    else if (actionGroups.actionname == "Ikishoten") {
      addCooldown("ikishoten", player.ID, recast.ikishoten);
      removeIcon(id.ikishoten);
      addIconBlinkTimeout("ikishoten", recast.ikishoten, id.ikishoten, icon.ikishoten);
      samKenki();
    }

    else if (actionGroups.actionname == "Hissatsu: Guren" || actionGroups.actionname == "Hissatsu: Senei") {
      // Senei is on same cooldown as Guren
      addCooldown("guren", player.ID, recast.guren);
      removeIcon(id.guren);
      samKenki();
    }

    // Trigger combos

    else if (["Fuga", "Mangetsu", "Oka"].indexOf(actionGroups.actionname) > -1
    && actionGroups.targetname == "") {
      // Spinnin' around in town
      // No targets hit
      samCombo();
    }

    else if (actionGroups.actionname == "Hakaze"
    && actionGroups.result.length >= 2) {
      if ([1,2,3].indexOf(toggle.combo) == -1) {
        samCombo();
      }
      removeIcon(id.hakaze);
      samKenki();
    }

    else if (actionGroups.actionname == "Fuga"
    && actionGroups.result.length >= 2
    && [4,5].indexOf(toggle.combo) > -1) {
      removeIcon(id.fuga);
      samKenki();
    }

    else if (actionGroups.actionname == "Jinpu"
    && actionGroups.result.length >= 8) {
      addStatus("jinpu", player.ID, duration.jinpu);
      if (player.level < 30) {
        samCombo();
      }
      else {
        removeIcon(id.hakaze);
        removeIcon(id.jinpu);
        addIcon(id.gekko,icon.gekko);
      }
      samKenki();
    }

    else if (actionGroups.actionname == "Shifu"
    && actionGroups.result.length >= 8) {
      addStatus("shifu", player.ID, duration.shifu);
      if (player.level < 40) {
        samCombo();
      }
      else {
        removeIcon(id.hakaze);
        removeIcon(id.shifu);
        addIcon(id.kasha,icon.kasha);
      }
      samKenki();
    }

    else if (actionGroups.actionname == "Mangetsu"
    && actionGroups.result.length >= 8) {
      if (!previous.mangetsu || Date.now() - previous.mangetsu > 1000
      && checkStatus("jinpu", player.ID) > 0) {
        previous.mangetsu = Date.now();
        addStatus("jinpu", player.ID, Math.min(checkStatus("jinpu", player.ID) + 15000, duration.jinpu));
      }
      samKenki();
      samSen();
      samCombo();
    }

    else if (actionGroups.actionname == "Oka"
    && actionGroups.result.length >= 8) {
      if (!previous.oka || Date.now() - previous.oka > 1000
      && checkStatus("shifu", player.ID) > 0) {
        previous.oka = Date.now();
        addStatus("shifu", player.ID, Math.min(checkStatus("shifu", player.ID) + 15000, duration.shifu));
      }
      samKenki();
      samSen();
      samCombo();
    }

    else if (["Gekko", "Kasha", "Yukikaze"].indexOf(actionGroups.actionname) > -1
    && actionGroups.result.length >= 8) {
      samKenki();
      samSen();
      samCombo();
    }

    else { // Everything else finishes or breaks combo
      samKenki();
      samCombo();
    }

    samMeikyoShisui();

    // Clear Tsubame-gaeshi

    if (icon.iaijutsu == "003159" // Set to this after Iaijutsu is inactive
    && ["Hakaze", "Jinpu", "Shifu", "Gekko", "Kasha", "Yukikaze",
        "Fuga", "Mangetsu", "Oka",
        "Enpi"].indexOf(actionGroups.actionname) > -1) {
      icon.tsubamegaeshi = "003180";
      removeIcon(id.tsubamegaeshi1);
      removeIcon(id.tsubamegaeshi2);
    }
  }
}

function samStatus() {

  // To anyone from anyone (non-stacking)

  if (statusGroups.statusname == "Slashing Resistance Down") {
    if (statusGroups.gainsloses == "gains") {
    }
    else if (statusGroups.gainsloses == "loses") {
    }
  }

  // To player from anyone

  else if (statusGroups.targetID == player.ID) {

    if (statusGroups.statusname == "Jinpu") {
      if (statusGroups.gainsloses == "gains") {
        addStatus("jinpu", statusGroups.targetID, parseInt(statusGroups.duration) * 1000);
      }
      else if (statusGroups.gainsloses == "loses") {
        removeStatus("jinpu", statusGroups.targetID);
      }
    }

    else if (statusGroups.statusname == "Open Eyes") {
      if (statusGroups.gainsloses == "gains") {
        addStatus("openeyes", statusGroups.targetID, parseInt(statusGroups.duration) * 1000);
      }
      else if (statusGroups.gainsloses == "loses") {
        removeStatus("openeyes", statusGroups.targetID);
      }
    }

    else if (statusGroups.statusname == "Shifu") {
      if (statusGroups.gainsloses == "gains") {
        addStatus("shifu", statusGroups.targetID, parseInt(statusGroups.duration) * 1000);
      }
      else if (statusGroups.gainsloses == "loses") {
        removeStatus("shifu", statusGroups.targetID);
      }
    }

    else if (statusGroups.statusname == "Meikyo Shisui") {
      if (statusGroups.gainsloses == "gains") {
        addStatus("meikyoshisui", statusGroups.targetID, parseInt(statusGroups.duration) * 1000);
      }
      else if (statusGroups.gainsloses == "loses") {
        removeStatus("meikyoshisui", statusGroups.targetID);
        samCombo();
      }
    }

    else if (statusGroups.statusname == "Hissatsu: Kaiten") {
      if (statusGroups.gainsloses == "gains") {
        addStatus("kaiten", statusGroups.targetID, parseInt(statusGroups.duration) * 1000);
      }
      else if (statusGroups.gainsloses == "loses") {
        removeStatus("kaiten", statusGroups.targetID);
      }
    }

    else if (statusGroups.statusname == "Meditate") {
      if (statusGroups.gainsloses == "gains") {
        addStatus("meditate", statusGroups.targetID, parseInt(statusGroups.duration) * 1000);
      }
      else if (statusGroups.gainsloses == "loses") {
        removeStatus("meditate", statusGroups.targetID);
        samKenki();
      }
    }
  }

  // To NOT player from player

  else if (statusGroups.sourcename == player.name) {

    if (statusGroups.statusname == "Higanbana") {
      if (statusGroups.gainsloses == "gains") {
        addStatus("higanbana", statusGroups.targetID, parseInt(statusGroups.duration) * 1000);
      }
      else if (statusGroups.gainsloses == "loses") {
        removeStatus("higanbana", statusGroups.targetID);
      }
    }
  }
}

function samMeikyoShisui() {
  // if (player.level >= 76
  // && checkCooldown("tsubamegaeshi", player.ID) > 2500) {
  //   // Attempt to save Meikyo to quickly activate Tsubame-gaeshi
  //   removeIcon(nextid.meikyoshisui);
  // }
  // else

  // Set to use on cooldown for now

  if (player.level >= 50
  && checkCooldown("meikyoshisui", player.ID) < 0) {
    addIconBlink(nextid.meikyoshisui,icon.meikyoshisui);
  }
  else {
    removeIcon(nextid.meikyoshisui);
  }
}

function samSen() {

  player.jobDetail.getsu = player.jobDetail.gekko; // Until cactbot fixes this

  removeIcon(nextid.iaijutsu1);
  removeIcon(nextid.iaijutsu2);

  removeIcon(nextid.tsubamegaeshi1);
  removeIcon(nextid.tsubamegaeshi2);

  // Choose Iaijutsu icon
  if (player.jobDetail.getsu + player.jobDetail.ka + player.jobDetail.setsu == 1
  && checkStatus("higanbana", target.ID) < 15000) {
    icon.iaijutsu = icon.higanbana;
  }
  else if (player.jobDetail.getsu + player.jobDetail.ka + player.jobDetail.setsu == 2) {
    icon.iaijutsu = icon.tenkagoken;
  }
  else if (player.jobDetail.getsu + player.jobDetail.ka + player.jobDetail.setsu == 3) {
    icon.iaijutsu = icon.midaresetsugekka;
  }
  else {
    icon.iaijutsu = "003159";
  }

  // Choose Tsubame-gaeshi icon
  if (player.level >= 74
  && checkCooldown("tsubamegaeshi", player.ID) < 5000
  && icon.iaijutsu == icon.tenkagoken
  && toggle.aoe) {
    icon.tsubamegaeshi = icon.kaeshigoken;
  }
  else if (player.level >= 74
  && checkCooldown("tsubamegaeshi", player.ID) < 5000
  && icon.iaijutsu == icon.midaresetsugekka) {
    icon.tsubamegaeshi = icon.kaeshisetsugekka;
  }
  else {
    icon.tsubamegaeshi = "003180";
  }

  // Place Iaijutsu in combo
  if (checkStatus("jinpu", player.ID) < 5000
  && toggle.combo == 1) {
    // Delay Iaijutsu for upcoming Jinpu buff
    if (icon.iaijutsu != "003159") {
      addIconBlink(nextid.iaijutsu2,icon.iaijutsu);
    }
    if (icon.tsubamegaeshi != "003180") {
      addIconBlink(nextid.tsubamegaeshi2,icon.tsubamegaeshi);
    }
  }
  else if (checkStatus("kaiten", player.ID) < 0
  && player.jobDetail.kenki < 20) {
    // Delay Iaijutsu to try for more Kenki
    if (icon.iaijutsu != "003159") {
      addIconBlink(nextid.iaijutsu2,icon.iaijutsu);
    }
    if (icon.tsubamegaeshi != "003180") {
      addIconBlink(nextid.tsubamegaeshi2,icon.tsubamegaeshi);
    }
  }
  else {
    if (icon.iaijutsu != "003159") {
      addIconBlink(nextid.iaijutsu1,icon.iaijutsu);
    }
    if (icon.tsubamegaeshi != "003180") {
      addIconBlink(nextid.tsubamegaeshi1,icon.tsubamegaeshi);
    }
  }
}

function samKenki() {

  // Set icons according to level/toggle/status

  // Shinten/Kyuten
  if (player.level >= 64
  && toggle.aoe) {
    icon.shinten = icon.kyuten;
  }
  else {
    icon.shinten = "003173";
  }

  if (player.level >= 72
  && !toggle.aoe) {
    icon.guren = icon.senei;
  }
  else {
    icon.guren = "003177";
  }

  // Set Kenki target
  if (player.level >= 70
  && checkCooldown("ikishoten", player.ID) > checkCooldown("guren", player.ID)
  && checkCooldown("guren", player.ID) < 20000) {
    gauge.target = 70;
  }
  else {
    gauge.target = 20;
  }

  // Show Guren/Senei
  if (player.level >= 70
  && checkCooldown("ikishoten", player.ID) > checkCooldown("guren", player.ID) + 5000
  && checkCooldown("guren", player.ID) < 1000
  && player.jobDetail.kenki >= 70) {
    addIconBlink(nextid.guren, icon.guren);
  }
  else {
    removeIcon(nextid.guren);
  }

  // Show Shinten/Kyuten/Seigan
  if (player.level >= 66
  && player.jobDetail.kenki >= gauge.target + 15
  && checkStatus("openeyes", player.ID) > 5000
  && !toggle.aoe) {
    addIconBlink(nextid.seigan, icon.seigan);
  }
  else if (player.level >= 62
  && player.jobDetail.kenki >= gauge.target + 25) {
    addIconBlink(nextid.shinten, icon.shinten);
  }
  else {
    removeIcon(nextid.shinten);
  }

}

function samCombo() {
  player.jobDetail.getsu = player.jobDetail.gekko // Until cactbot fixes this
  delete toggle.combo;

  // Reset icons
  removeIcon(nextid.hakaze);
  removeIcon(nextid.jinpu);
  removeIcon(nextid.gekko);

  if (toggle.aoe) { // AoE

    if (checkStatus("meikyoshisui", player.ID) > 0) {

      if (player.jobDetail.ka == false
      && checkStatus("shifu", player.ID) < checkStatus("jinpu", player.ID)) {
        addIconBlink(nextid.oka,icon.oka);
      }
      else if (player.jobDetail.getsu == false
      && checkStatus("jinpu", player.ID) < checkStatus("shifu", player.ID)) {
        addIconBlink(nextid.mangetsu,icon.mangetsu);
      }

      else if (player.jobDetail.getsu == false) {
        addIconBlink(nextid.mangetsu,icon.mangetsu);
      }
      else if (player.jobDetail.ka == false) {
        addIconBlink(nextid.oka,icon.oka);
      }

      else {
        addIcon(nextid.mangetsu,icon.mangetsu);
      }
    }

    else {

      if (player.level >= 45
      && player.jobDetail.ka == false
      && checkStatus("shifu", player.ID) < checkStatus("jinpu", player.ID)) {
        okaCombo();
      }
      else if (player.level >= 35
      && player.jobDetail.getsu == false
      && checkStatus("jinpu", player.ID) < checkStatus("shifu", player.ID)) {
        mangetsuCombo();
      }

      else if (player.level >= 35
      && player.jobDetail.getsu == false) {
        mangetsuCombo();
      }
      else if (player.level >= 45
      && player.jobDetail.ka == false) {
        okaCombo();
      }
    }
  }

  else {

    if (checkStatus("meikyoshisui", player.ID) > 0) {

      if (player.jobDetail.getsu == false) {
        addIconBlink(nextid.gekko,icon.gekko);
      }
      else if (player.jobDetail.ka == false) {
        addIconBlink(nextid.kasha,icon.kasha);
      }
      else if (player.jobDetail.setsu == false) {
        addIconBlink(nextid.yukikaze,icon.yukikaze);
      }
    }

    else {

      if (player.level >= 18
      && player.jobDetail.ka == false
      && checkStatus("shifu", player.ID) < checkStatus("jinpu", player.ID)) {
        kashaCombo();
      }
      else if (player.level >= 4
      && player.jobDetail.getsu == false
      && checkStatus("jinpu", player.ID) < checkStatus("shifu", player.ID)) {
        gekkoCombo();
      }

      else if (player.level >= 30
      && player.jobDetail.getsu == false) {
        gekkoCombo();
      }
      else if (player.level >= 40
      && player.jobDetail.ka == false) {
        kashaCombo();
      }
      else if (player.level >= 50
      && player.jobDetail.setsu == false) {
        yukikazeCombo();
      }

      else {
        gekkoCombo();
      }
    }
  }

  clearTimeout(timeout.combo);
  timeout.combo = setTimeout(samComboTimeout, 12500);
}

function samComboTimeout() {
  if (toggle.combat) {
    samCombo();
  }
}

function gekkoCombo() {
  toggle.combo = 1;
  addIcon(nextid.hakaze,icon.hakaze);
  addIcon(nextid.jinpu,icon.jinpu);
  if (player.level >= 30) {
    addIcon(nextid.gekko,icon.gekko);
  }
}

function kashaCombo() {
  toggle.combo = 2;
  addIcon(nextid.hakaze,icon.hakaze);
  addIcon(nextid.shifu,icon.shifu);
  if (player.level >= 40) {
    addIcon(nextid.kasha,icon.kasha);
  }
}

function yukikazeCombo() {
  toggle.combo = 3;
  addIcon(nextid.hakaze,icon.hakaze);
  removeIcon(nextid.jinpu);
  addIcon(nextid.yukikaze,icon.yukikaze);
}

function mangetsuCombo() {
  toggle.combo = 4;
  addIcon(nextid.fuga,icon.fuga);
  removeIcon(nextid.jinpu);
  addIcon(nextid.mangetsu,icon.mangetsu);
}

function okaCombo() {
  toggle.combo = 5;
  addIcon(nextid.fuga,icon.fuga);
  removeIcon(nextid.jinpu);
  addIcon(nextid.oka,icon.oka);
}
