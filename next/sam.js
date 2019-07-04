"use strict";

actionList.sam = [
  "Higanbana", "Midare Setsugekka",

  "Meikyo Shisui",
  "Hissatsu: Kaiten", "Hissatsu: Gyoten", "Hissatsu: Yaten", "Meditate", "Ikishoten",

  "Tenka Goken", "Hissatsu: Guren",

  "Hakaze", "Jinpu", "Shifu", "Gekko", "Kasha", "Yukikaze", "Hissatsu: Shinten", "Hissatsu: Senei",
  "Fuga", "Mangetsu", "Oka", "Hissatsu: Kyuten",

  "Enpi"
];

function samJobChange() {

  id.iaijutsu1 = "0";
  id.hakaze = "1";
  id.fuga = id.hakaze;
  id.jinpu = "2";
  id.shifu = id.jinpu;
  id.iaijutsu2 = "3";
  id.gekko = "4";
  id.kasha = id.gekko;
  id.yukikaze = id.gekko;
  id.mangetsu = id.gekko;
  id.oka = id.gekko;
  id.ikishoten = "10";
  id.meikyoshisui = "11";
  id.guren = "12";
  id.senei = id.guren;
  id.shinten = "13";
  id.kyuten = id.shinten;
  id.seigan = id.shinten;
  id.shoha = "14";
}


function samAction(logLine) {

  if (logLine[2] == player.name
  && actionList.sam.indexOf(logLine[3]) > -1) { // Check if from player

    removeText("loadmessage");
    removeText("debug1");

    // Toggle AoE

    if (["Fuga", "Mangetsu", "Oka", "Hissatsu: Kyuten"].indexOf(logLine[3]) > -1
    || (logLine[3] == "Tenka Goken" && player.level >= 50)
    || (logLine[3] == "Hissatsu: Guren" && player.level >= 72)) {
      toggle.aoe = Date.now();
    }
    else if (["Hakaze", "Jinpu", "Shifu", "Gekko", "Kasha", "Yukikaze", "Hissatsu: Shinten", "Hissatsu: Senei"].indexOf(logLine[3]) > -1)  {
      delete toggle.aoe;
    }

    // These actions don't interrupt combos

    if (logLine[3] == "Higanbana") {
      addStatus("higanbana", logLine[5], duration.higanbana);
      if (checkStatus("meikyoshisui", player.name) > 0) {
        samCombo(); // Consuming Sen under Meikyo will trigger a new combo
      }
      removeIcon(id.iaijutsu1);
      removeIcon(id.iaijutsu2);
      samSen();
    }

    else if (logLine[3] == "Tenka Goken" || logLine[3] == "Midare Setsugekka") {
      if (checkStatus("meikyoshisui", player.name) > 0) {
        samCombo(); // Consuming Sen under Meikyo will trigger a new combo
      }
      removeIcon(id.iaijutsu1);
      removeIcon(id.iaijutsu2);
      samSen();
    }

    else if (logLine[3] == "Meikyo Shisui") {
      addCooldown("meikyoshisui", player.name, recast.meikyoshisui);
      addStatus("meikyoshisui", player.name, duration.meikyoshisui);
      removeIcon(id.meikyoshisui);
      samCombo();
    }

    else if (logLine[3] == "Hissatsu: Kaiten") {
      addStatus("kaiten", player.name, duration.kaiten);
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
      addCooldown("ikishoten", player.name, recast.ikishoten);
      removeIcon(id.ikishoten);
      samKenki();
    }

    else if (logLine[3] == "Hissatsu: Guren" || logLine[3] == "Hissatsu: Senei") {
      // Senei is on same cooldown as Guren
      addCooldown("guren", player.name, recast.guren);
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
    && logLine[6].length >= 2
    && [1,2,3].indexOf(toggle.combo) > -1) {
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
      addStatus("jinpu", player.name, duration.jinpu);
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
      addStatus("shifu", player.name, duration.shifu);
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
      && checkStatus("jinpu", player.name > 0)) {
        previous.mangetsu = Date.now();
        addStatus("jinpu", player.name, Math.min(checkStatus("jinpu", player.name) + 15000, duration.jinpu));
      }
      samKenki();
      samSen();
      samCombo();
    }

    else if (logLine[3] == "Oka"
    && logLine[6].length >= 8) {
      if (!previous.oka || Date.now() - previous.oka > 1000
      && checkStatus("shifu", player.name > 0)) {
        previous.oka = Date.now();
        addStatus("shifu", player.name, Math.min(checkStatus("shifu", player.name) + 15000, duration.shifu));
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
    meikyoCheck();
  }
}

function samStatus(logLine) {

  // To anyone from anyone (non-stacking)

  if (logLine[3] == "Slashing Resistance Down") {
    if (logLine[2] == "gains") {
    }
    else if (logLine[2] == "loses") {
    }
  }

  // To player from anyone

  else if (logLine[1] == player.name) {

    if (logLine[3] == "Jinpu") {
      if (logLine[2] == "gains") {
        addStatus("jinpu", logLine[1], parseInt(logLine[5]) * 1000);
      }
      else if (logLine[2] == "loses") {
        removeStatus("jinpu", logLine[1]);
      }
    }

    else if (logLine[3] == "Shifu") {
      if (logLine[2] == "gains") {
        addStatus("shifu", logLine[1], parseInt(logLine[5]) * 1000);
      }
      else if (logLine[2] == "loses") {
        removeStatus("shifu", logLine[1]);
      }
    }

    else if (logLine[3] == "Meikyo Shisui") {
      if (logLine[2] == "gains") {
        addStatus("meikyoshisui", logLine[1], parseInt(logLine[5]) * 1000);
      }
      else if (logLine[2] == "loses") {
        removeStatus("meikyoshisui", logLine[1]);
        samCombo();
      }
    }

    else if (logLine[3] == "Hissatsu: Kaiten") {
      if (logLine[2] == "gains") {
        addStatus("kaiten", logLine[1], parseInt(logLine[5]) * 1000);
      }
      else if (logLine[2] == "loses") {
        removeStatus("kaiten", logLine[1]);
      }
    }

    else if (logLine[3] == "Meditate") {
      if (logLine[2] == "gains") {
        addStatus("meditate", logLine[1], parseInt(logLine[5]) * 1000);
      }
      else if (logLine[2] == "loses") {
        removeStatus("meditate", logLine[1]);
        samKenki();
      }
    }
  }

  // To NOT player from player

  else if (logLine[4] == player.name) {

    if (logLine[3] == "Higanbana") {
      if (logLine[2] == "gains") {
        addStatus("higanbana", logLine[1], parseInt(logLine[5]) * 1000);
      }
      else if (logLine[2] == "loses") {
        removeStatus("higanbana", logLine[1]);
      }
    }
  }
}

function meikyoCheck() {
  if (checkCooldown("meikyoshisui", player.name) < 0) {
    addIconBlink(id.meikyoshisui,icon.meikyoshisui);
  }
  else {
    removeIcon(id.meikyoshisui);
  }
}

function samSen() {

  // Choose Iaijutsu
  if (player.jobDetail.gekko + player.jobDetail.ka + player.jobDetail.setsu == 1
  && checkStatus("higanbana", target.name) < 15000) {
    icon.iaijutsu = icon.higanbana;
  }
  else if (player.jobDetail.gekko + player.jobDetail.ka + player.jobDetail.setsu == 2) {
    icon.iaijutsu = icon.tenkagoken;
  }
  else if (player.jobDetail.gekko + player.jobDetail.ka + player.jobDetail.setsu == 3) {
    icon.iaijutsu = icon.midaresetsugekka;
  }
  else {
    icon.iaijutsu = "003159";
    removeIcon(id.iaijutsu1);
    removeIcon(id.iaijutsu2);
    return;
  }

  if (checkStatus("jinpu", player.name) < 5000
  && toggle.combo == 1) {
    // Delay Iaijutsu for upcoming Jinpu buff
    removeIcon(id.iaijutsu1);
    addIconBlink(id.iaijutsu2,icon.iaijutsu);
  }

  else if (player.level >= 62
  && checkStatus("kaiten", player.name) < 0
  && player.jobDetail.kenki < 20) {
    // Delay Iaijutsu to try for more Kenki
    removeIcon(id.iaijutsu1);
    addIconBlink(id.iaijutsu2,icon.iaijutsu);
  }

  else {
    addIconBlink(id.iaijutsu1,icon.iaijutsu);
    removeIcon(id.iaijutsu2);
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
  && checkCooldown("ikishoten", player.name) > checkCooldown("guren", player.name)) {
    gauge.target = 70;
  }
  else {
    gauge.target = 20;
  }

  // Show Guren/Senei
  if (player.level >= 70
  && checkCooldown("ikishoten", player.name) > checkCooldown("guren", player.name)
  && player.jobDetail.kenki >= 70) {
    addIconBlink(id.guren, icon.guren);
  }
  else {
    removeIcon(id.guren);
  }

  // Show Shinten/Kyuten/Seigan
  if (player.level >= 66
  && player.jobDetail.kenki >= gauge.target + 15
  && checkStatus("openeyes", player.name) > 5000
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

  delete toggle.combo;

  // Reset icons
  removeIcon(id.hakaze);
  removeIcon(id.jinpu);
  removeIcon(id.gekko);

  if (toggle.aoe) { // AoE

    if (checkStatus("meikyoshisui", player.name) > 0) {

      if (player.jobDetail.ka == false
      && checkStatus("shifu", player.name) < checkStatus("jinpu", player.name)) {
        addIcon(id.oka,icon.oka);
      }
      else if (player.jobDetail.gekko == false
      && checkStatus("jinpu", player.name) < checkStatus("shifu", player.name)) {
        addIcon(id.mangetsu,icon.mangetsu);
      }

      else if (player.jobDetail.gekko == false) {
        addIcon(id.mangetsu,icon.mangetsu);
      }
      else if (player.jobDetail.ka == false) {
        addIcon(id.oka,icon.oka);
      }

      else {
        addIcon(id.mangetsu,icon.mangetsu);
      }
    }

    else {

      if (player.level >= 45
      && player.jobDetail.ka == false
      && checkStatus("shifu", player.name) < checkStatus("jinpu", player.name)) {
        okaCombo();
      }
      else if (player.level >= 35
      && player.jobDetail.gekko == false
      && checkStatus("jinpu", player.name) < checkStatus("shifu", player.name)) {
        mangetsuCombo();
      }

      else if (player.level >= 35
      && player.jobDetail.gekko == false) {
        mangetsuCombo();
      }
      else if (player.level >= 45
      && player.jobDetail.ka == false) {
        okaCombo();
      }

      else {
        mangetsuCombo();
      }
    }
  }

  else {

    if (checkStatus("meikyoshisui", player.name) > 0) {

      if (player.jobDetail.gekko == false) {
        addIcon(id.gekko,icon.gekko);
      }
      else if (player.jobDetail.ka == false) {
        addIcon(id.kasha,icon.kasha);
      }
      else if (player.jobDetail.setsu == false) {
        addIcon(id.yukikaze,icon.yukikaze);
      }

      else {
        addIcon(id.gekko,icon.gekko); // Do something
      }
    }

    else {

      if (player.level >= 18
      && player.jobDetail.ka == false
      && checkStatus("shifu", player.name) < checkStatus("jinpu", player.name)) {
        kashaCombo();
      }
      else if (player.level >= 4
      && player.jobDetail.gekko == false
      && checkStatus("jinpu", player.name) < checkStatus("shifu", player.name)) {
        gekkoCombo();
      }

      else if (player.level >= 30
      && player.jobDetail.gekko == false) {
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
