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

  id.iaijutsu1 = 0;
  id.tsubamegaeshi1 = 1;
  id.hakaze = 2;
  id.fuga = id.hakaze;
  id.jinpu = 3;
  id.shifu = id.jinpu;
  id.iaijutsu2 = 4;
  id.tsubamegaeshi2 = 5;
  id.gekko = 6;
  id.kasha = id.gekko;
  id.yukikaze = id.gekko;
  id.mangetsu = id.gekko;
  id.oka = id.gekko;
  id.ikishoten = 10;
  id.meikyoshisui = 11;
  id.guren = 12;
  id.senei = id.guren;
  id.shinten = 13;
  id.kyuten = id.shinten;
  id.seigan = id.shinten;
  id.shoha = 14;


    samMeikyoShisui();

    if (player.level >= 68
    && checkCooldown("ikishoten", player.ID) < 0) {
      addIconBlink(id.ikishoten,icon.ikishoten);
    }
    samKenki();
    samSen();
}


// 1:SourceID 2:SourceName 3:SkillName 4:TargetID 5:TargetName 6:Result

function samAction(logLine) {

  if (logLine[1] == player.ID
  && actionList.sam.indexOf(logLine[3]) > -1) { // Check if from player

    removeText("loadmessage");
    // removeText("debug1");

    // Toggle AoE

    if (["Fuga", "Mangetsu", "Oka", "Hissatsu: Kyuten", "Kaeshi: Goken"].indexOf(logLine[3]) > -1
    || (logLine[3] == "Tenka Goken" && player.level >= 50)
    || (logLine[3] == "Hissatsu: Guren" && player.level >= 72)) {
      toggle.aoe = Date.now();
    }
    else if (["Hakaze", "Jinpu", "Shifu", "Gekko", "Kasha", "Yukikaze",
              "Hissatsu: Shinten", "Hissatsu: Senei",
              "Higanbana", "Midare Setsugekka", "Kaeshi: Higanbana", "Kaeshi: Setsugekka"].indexOf(logLine[3]) > -1)
    {
      delete toggle.aoe;
    }

    // These actions don't interrupt combos

    if (logLine[3] == "Higanbana") {
      addStatus("higanbana", logLine[4], duration.higanbana);
      if (checkStatus("meikyoshisui", player.ID) > 0) {
        samCombo(); // Consuming Sen under Meikyo will trigger a new combo
      }
      icon.iaijutsu = "003159";
      removeIcon(id.iaijutsu1);
      removeIcon(id.iaijutsu2);
      timeout.tsubamegaeshi1 = setTimeout(removeIcon, 12500, id.tsubamegaeshi1);
      timeout.tsubamegaeshi2 = setTimeout(removeIcon, 12500, id.tsubamegaeshi2);
    }

    else if (["Tenka Goken", "Midare Setsugekka"].indexOf(logLine[3]) > -1) {
      if (checkStatus("meikyoshisui", player.ID) > 0) {
        samCombo(); // Consuming Sen under Meikyo will trigger a new combo
      }
      icon.iaijutsu = "003159";
      removeIcon(id.iaijutsu1);
      removeIcon(id.iaijutsu2);
      timeout.tsubamegaeshi1 = setTimeout(removeIcon, 12500, id.tsubamegaeshi1);
      timeout.tsubamegaeshi2 = setTimeout(removeIcon, 12500, id.tsubamegaeshi2);
    }

    else if (["Kaeshi: Higanbana", "Kaeshi: Goken", "Kaeshi: Setsugekka"].indexOf(logLine[3]) > -1) {
      addCooldown("tsubamegaeshi", player.ID, recast.tsubamegaeshi);
      icon.tsubamegaeshi = "003180";
      clearTimeout(timeout.tsubamegaeshi);
      removeIcon(id.tsubamegaeshi1);
      removeIcon(id.tsubamegaeshi2);
    }

    else if (logLine[3] == "Meikyo Shisui") {
      addCooldown("meikyoshisui", player.ID, recast.meikyoshisui);
      addStatus("meikyoshisui", player.ID, duration.meikyoshisui);
      removeIcon(id.meikyoshisui);
      samCombo(); // Clears combo and activates next Sen generating move
    }

    else if (logLine[3] == "Hissatsu: Kaiten") {
      addStatus("kaiten", player.ID, duration.kaiten);
      samKenki();
    }

    else if (logLine[3] == "Hissatsu: Shinten") {
      removeIcon(id.shinten);
      samKenki();
    }

    else if (logLine[3] == "Hissatsu: Kyuten") {
      removeIcon(id.kyuten);
      samKenki();
    }

    else if (logLine[3] == "Hissatsu: Seigan") {
      removeIcon(id.seigan);
      samKenki();
    }

    else if (logLine[3] == "Ikishoten") {
      addCooldown("ikishoten", player.ID, recast.ikishoten);
      removeIcon(id.ikishoten);
      addIconBlinkTimeout("ikishoten", recast.ikishoten, id.ikishoten, icon.ikishoten);
      samKenki();
    }

    else if (logLine[3] == "Hissatsu: Guren" || logLine[3] == "Hissatsu: Senei") {
      // Senei is on same cooldown as Guren
      addCooldown("guren", player.ID, recast.guren);
      removeIcon(id.guren);
      samKenki();
    }

    // Trigger combos

    else if (["Fuga", "Mangetsu", "Oka"].indexOf(logLine[3]) > -1
    && logLine[5] == "") {
      // Spinnin' around in town
      // No targets hit
      samCombo();
    }

    else if (logLine[3] == "Hakaze"
    && logLine[6].length >= 2) {
      if ([1,2,3].indexOf(toggle.combo) == -1) {
        samCombo();
      }
      removeIcon(id.hakaze);
      samKenki();
    }

    else if (logLine[3] == "Fuga"
    && logLine[6].length >= 2
    && [4,5].indexOf(toggle.combo) > -1) {
      removeIcon(id.fuga);
      samKenki();
    }

    else if (logLine[3] == "Jinpu"
    && logLine[6].length >= 8) {
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

    else if (logLine[3] == "Shifu"
    && logLine[6].length >= 8) {
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

    else if (logLine[3] == "Mangetsu"
    && logLine[6].length >= 8) {
      if (!previous.mangetsu || Date.now() - previous.mangetsu > 1000
      && checkStatus("jinpu", player.ID) > 0) {
        previous.mangetsu = Date.now();
        addStatus("jinpu", player.ID, Math.min(checkStatus("jinpu", player.ID) + 15000, duration.jinpu));
      }
      samKenki();
      samSen();
      samCombo();
    }

    else if (logLine[3] == "Oka"
    && logLine[6].length >= 8) {
      if (!previous.oka || Date.now() - previous.oka > 1000
      && checkStatus("shifu", player.ID) > 0) {
        previous.oka = Date.now();
        addStatus("shifu", player.ID, Math.min(checkStatus("shifu", player.ID) + 15000, duration.shifu));
      }
      samKenki();
      samSen();
      samCombo();
    }

    else if (["Gekko", "Kasha", "Yukikaze"].indexOf(logLine[3]) > -1
    && logLine[6].length >= 8) {
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
        "Enpi"].indexOf(logLine[3]) > -1) {
      icon.tsubamegaeshi = "003180";
      removeIcon(id.tsubamegaeshi1);
      removeIcon(id.tsubamegaeshi2);
    }
  }
}

function samStatus(logLine) {

  // To anyone from anyone (non-stacking)

  if (logLine[4] == "Slashing Resistance Down") {
    if (logLine[3] == "gains") {
    }
    else if (logLine[3] == "loses") {
    }
  }

  // To player from anyone

  else if (logLine[1] == player.ID) {

    if (logLine[4] == "Jinpu") {
      if (logLine[3] == "gains") {
        addStatus("jinpu", logLine[1], parseInt(logLine[6]) * 1000);
      }
      else if (logLine[3] == "loses") {
        removeStatus("jinpu", logLine[1]);
      }
    }

    else if (logLine[4] == "Open Eyes") {
      if (logLine[3] == "gains") {
        addStatus("openeyes", logLine[1], parseInt(logLine[6]) * 1000);
      }
      else if (logLine[3] == "loses") {
        removeStatus("openeyes", logLine[1]);
      }
    }

    else if (logLine[4] == "Shifu") {
      if (logLine[3] == "gains") {
        addStatus("shifu", logLine[1], parseInt(logLine[6]) * 1000);
      }
      else if (logLine[3] == "loses") {
        removeStatus("shifu", logLine[1]);
      }
    }

    else if (logLine[4] == "Meikyo Shisui") {
      if (logLine[3] == "gains") {
        addStatus("meikyoshisui", logLine[1], parseInt(logLine[6]) * 1000);
      }
      else if (logLine[3] == "loses") {
        removeStatus("meikyoshisui", logLine[1]);
        samCombo();
      }
    }

    else if (logLine[4] == "Hissatsu: Kaiten") {
      if (logLine[3] == "gains") {
        addStatus("kaiten", logLine[1], parseInt(logLine[6]) * 1000);
      }
      else if (logLine[3] == "loses") {
        removeStatus("kaiten", logLine[1]);
      }
    }

    else if (logLine[4] == "Meditate") {
      if (logLine[3] == "gains") {
        addStatus("meditate", logLine[1], parseInt(logLine[6]) * 1000);
      }
      else if (logLine[3] == "loses") {
        removeStatus("meditate", logLine[1]);
        samKenki();
      }
    }
  }

  // To NOT player from player

  else if (logLine[5] == player.name) {

    if (logLine[4] == "Higanbana") {
      if (logLine[3] == "gains") {
        addStatus("higanbana", logLine[1], parseInt(logLine[6]) * 1000);
      }
      else if (logLine[3] == "loses") {
        removeStatus("higanbana", logLine[1]);
      }
    }
  }
}

function samMeikyoShisui() {
  // if (player.level >= 76
  // && checkCooldown("tsubamegaeshi", player.ID) > 2500) {
  //   // Attempt to save Meikyo to quickly activate Tsubame-gaeshi
  //   removeIcon(id.meikyoshisui);
  // }
  // else

  // Set to use on cooldown for now

  if (player.level >= 50
  && checkCooldown("meikyoshisui", player.ID) < 0) {
    addIconBlink(id.meikyoshisui,icon.meikyoshisui);
  }
  else {
    removeIcon(id.meikyoshisui);
  }
}

function samSen() {

  player.jobDetail.getsu = player.jobDetail.gekko; // Until cactbot fixes this

  removeIcon(id.iaijutsu1);
  removeIcon(id.iaijutsu2);

  removeIcon(id.tsubamegaeshi1);
  removeIcon(id.tsubamegaeshi2);

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
      addIconBlink(id.iaijutsu2,icon.iaijutsu);
    }
    if (icon.tsubamegaeshi != "003180") {
      addIconBlink(id.tsubamegaeshi2,icon.tsubamegaeshi);
    }
  }
  else if (checkStatus("kaiten", player.ID) < 0
  && player.jobDetail.kenki < 20) {
    // Delay Iaijutsu to try for more Kenki
    if (icon.iaijutsu != "003159") {
      addIconBlink(id.iaijutsu2,icon.iaijutsu);
    }
    if (icon.tsubamegaeshi != "003180") {
      addIconBlink(id.tsubamegaeshi2,icon.tsubamegaeshi);
    }
  }
  else {
    if (icon.iaijutsu != "003159") {
      addIconBlink(id.iaijutsu1,icon.iaijutsu);
    }
    if (icon.tsubamegaeshi != "003180") {
      addIconBlink(id.tsubamegaeshi1,icon.tsubamegaeshi);
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
    addIconBlink(id.guren, icon.guren);
  }
  else {
    removeIcon(id.guren);
  }

  // Show Shinten/Kyuten/Seigan
  if (player.level >= 66
  && player.jobDetail.kenki >= gauge.target + 15
  && checkStatus("openeyes", player.ID) > 5000
  && !toggle.aoe) {
    addIconBlink(id.seigan, icon.seigan);
  }
  else if (player.level >= 62
  && player.jobDetail.kenki >= gauge.target + 25) {
    addIconBlink(id.shinten, icon.shinten);
  }
  else {
    removeIcon(id.shinten);
  }

}

function samCombo() {
  player.jobDetail.getsu = player.jobDetail.gekko // Until cactbot fixes this
  delete toggle.combo;

  // Reset icons
  removeIcon(id.hakaze);
  removeIcon(id.jinpu);
  removeIcon(id.gekko);

  if (toggle.aoe) { // AoE

    if (checkStatus("meikyoshisui", player.ID) > 0) {

      if (player.jobDetail.ka == false
      && checkStatus("shifu", player.ID) < checkStatus("jinpu", player.ID)) {
        addIconBlink(id.oka,icon.oka);
      }
      else if (player.jobDetail.getsu == false
      && checkStatus("jinpu", player.ID) < checkStatus("shifu", player.ID)) {
        addIconBlink(id.mangetsu,icon.mangetsu);
      }

      else if (player.jobDetail.getsu == false) {
        addIconBlink(id.mangetsu,icon.mangetsu);
      }
      else if (player.jobDetail.ka == false) {
        addIconBlink(id.oka,icon.oka);
      }

      else {
        addIcon(id.mangetsu,icon.mangetsu);
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
        addIconBlink(id.gekko,icon.gekko);
      }
      else if (player.jobDetail.ka == false) {
        addIconBlink(id.kasha,icon.kasha);
      }
      else if (player.jobDetail.setsu == false) {
        addIconBlink(id.yukikaze,icon.yukikaze);
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
  addIcon(id.hakaze,icon.hakaze);
  addIcon(id.jinpu,icon.jinpu);
  if (player.level >= 30) {
    addIcon(id.gekko,icon.gekko);
  }
}

function kashaCombo() {
  toggle.combo = 2;
  addIcon(id.hakaze,icon.hakaze);
  addIcon(id.shifu,icon.shifu);
  if (player.level >= 40) {
    addIcon(id.kasha,icon.kasha);
  }
}

function yukikazeCombo() {
  toggle.combo = 3;
  addIcon(id.hakaze,icon.hakaze);
  removeIcon(id.jinpu);
  addIcon(id.yukikaze,icon.yukikaze);
}

function mangetsuCombo() {
  toggle.combo = 4;
  addIcon(id.fuga,icon.fuga);
  removeIcon(id.jinpu);
  addIcon(id.mangetsu,icon.mangetsu);
}

function okaCombo() {
  toggle.combo = 5;
  addIcon(id.fuga,icon.fuga);
  removeIcon(id.jinpu);
  addIcon(id.oka,icon.oka);
}
