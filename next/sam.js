"use strict";

actionList.sam = ["Higanbana", "Midare Setsugekka", "Tenka Goken",
  "Meikyo Shisui", "Meditate", "Hagakure", "Hissatsu: Guren",
  "Hakaze", "Jinpu", "Enpi", "Shifu", "Gekko", "Kasha", "Yukikaze", "Fuga", "Mangetsu", "Oka"];

// statusList.sam = ["Jinpu", "Shifu", "Meikyo Shisui", "Hissatsu: Kaiten", "Higanbana", "Slashing Resistance Down"];

id.iaijutsu1 = "nextAction1";
id.hakaze = "nextAction2";
id.fuga = id.hakaze;
id.jinpu = "nextAction3";
id.shifu = id.jinpu;
id.iaijutsu2 = "nextAction4";
id.gekko = "nextAction5";
id.kasha = id.gekko;
id.yukikaze = id.gekko;
id.mangetsu = id.gekko;
id.oka = id.gekko;
id.iaijutsu3 = "nextAction6";
id.shinten = "nextAction11";
id.kyuten = id.shinten;
id.guren = id.shinten;
id.kenkispender = id.shinten;
id.hagakure = "nextAction12";
id.meikyoshisui = "nextAction13";

icon.hakaze = "003151";
icon.jinpu = "003152";
icon.shifu = "003156";
icon.fuga = "003157";
icon.gekko = "003158";
icon.iaijutsu = "003159";
icon.higanbana = "003160";
icon.tenkagoken = "003161";
icon.midaresetsugekka = "003162";
icon.mangetsu = "003163";
icon.kasha = "003164";
icon.oka = "003165";
icon.yukikaze = "003166";
icon.meikyoshisui = "003167";
icon.kaiten = "003168";
icon.shinten = "003173";
icon.kyuten = "003174";
icon.hagakure = "003176";
icon.guren = "003177";

duration.jinpu = 30000;
duration.shifu = 30000;
duration.slashingresistancedown = 30000;
duration.kaiten = 10000;

recast.meikyoshisui = 80000;
recast.hagakure = 40000;
recast.guren = 120000;

function samPlayerChangedEvent(e) {
  
  // Add guren then haga vs haga then guren situations
  // Set Kenki target based on if Hagakure is coming up
  if (player.level >= 70
  && checkCooldown("hagakure", player.name) > checkCooldown("guren", player.name)) {
    gauge.target = 70;
  }
  else if (player.level >= 70
  && checkCooldown("guren", player.name) > checkCooldown("hagakure", player.name)) {
    gauge.target = 0;
  }
  else if (player.level >= 68
  && checkCooldown("hagakure", player.name) < 4000) {
    gauge.target = 0;
  }
  else if (player.level >= 70
  && checkCooldown("guren", player.name) < 10000) {
    gauge.target = 70;
  }
  else {
    gauge.target = 20;
  }

  // Check for Hagakure, spend Sen if Hagakure is far enough away, use Kenki otherwise
  if (player.level >= 68
  && checkCooldown("hagakure", player.name) < 4000
  && player.jobDetail.kenki <= 35) {
    removeIcon(id.iaijutsu1);
    removeIcon(id.iaijutsu2);
    removeIcon(id.iaijutsu3);
    if (toggle.aoe
    && player.jobDetail.gekko + player.jobDetail.ka + player.jobDetail.setsu >= 2) {
      addIcon(id.hagakure,icon.hagakure);
    }
    else if (player.jobDetail.gekko + player.jobDetail.ka + player.jobDetail.setsu >= 3) {
      addIcon(id.hagakure,icon.hagakure);
    }
    else {
      removeIcon(id.hagakure);
    }
  }

  else { // Iaijutsu with available Sen

    // Higanbana
    if (player.jobDetail.gekko + player.jobDetail.ka + player.jobDetail.setsu == 1
    && checkStatus("higanbana", target.name) < 15000) {
        if (checkStatus("jinpu", player.name) < 4000
        && toggle.combo == 1) {
        // Delay Higanbana for Jinpu buff
          removeIcon(id.iaijutsu1);
          addIcon(id.iaijutsu2,icon.higanbana);
          removeIcon(id.iaijutsu3);
        }
        else if (player.level >= 62
        && checkStatus("kaiten", player.name) < 0
        && player.jobDetail.kenki < 20
        && player.jobDetail.kenki >= 10) {
        // Delay Higanbana for Kenki
          removeIcon(id.iaijutsu1);
          addIcon(id.iaijutsu2,icon.higanbana);
          removeIcon(id.iaijutsu3);
        }

      else {
        addIcon(id.iaijutsu1,icon.higanbana);
        removeIcon(id.iaijutsu2);
        removeIcon(id.iaijutsu3);
      }
    }

    // Tenka Goken
    else if (player.jobDetail.gekko + player.jobDetail.ka + player.jobDetail.setsu == 2) {
      removeIcon(id.iaijutsu1);
      removeIcon(id.iaijutsu2);
      addIcon(id.iaijutsu3,icon.tenkagoken);
    }

    // Midare Setsugekka
    else if (player.jobDetail.gekko + player.jobDetail.ka + player.jobDetail.setsu == 3) {
      if (checkStatus("jinpu", player.name) < 4000
      && toggle.combo == 1) {
      // Delay Midare for Jinpu
        removeIcon(id.iaijutsu1);
        addIcon(id.iaijutsu2,icon.midaresetsugekka);
        removeIcon(id.iaijutsu3);
      }
      else if (player.level >= 62
      && checkStatus("kaiten", player.name) < 0
      && player.jobDetail.kenki < 20
      && player.jobDetail.kenki >= 10) {
      // Delay Midare for Kenki
        removeIcon(id.iaijutsu1);
        addIcon(id.iaijutsu2,icon.midaresetsugekka);
        removeIcon(id.iaijutsu3);
      }
      else {
        addIcon(id.iaijutsu1,icon.midaresetsugekka);
        removeIcon(id.iaijutsu2);
        removeIcon(id.iaijutsu3);
      }
    }

    // No Sen
    else {
      removeIcon(id.iaijutsu1);
      removeIcon(id.iaijutsu2);
      removeIcon(id.iaijutsu3);
    }
  }

  // Kenki management

  if (player.level >= 70
  && checkCooldown("guren", player.name) < 12000
  && checkCooldown("hagakure", player.name) > 12000) {
  // Guren coming up

    if (player.jobDetail.kenki >= gauge.target + 50
    && checkCooldown("guren", player.name) < 0) {
    // Spend Kenki on Guren
      addIcon(id.kenkispender,icon.guren);
    }

    else if (player.level >= 70
    && player.jobDetail.kenki >= gauge.target + 50 + 25) {
    // Spend to avoid overcap
      if (toggle.aoe) {
        addIcon(id.kenkispender,icon.kyuten);
      }
      else {
        addIcon(id.kenkispender,icon.shinten);
      }
    }

    else if (player.level >= 70
    && player.jobDetail.kenki < gauge.target + 50
    && checkCooldown("guren", player.name) < 12000) { // Save for Guren
      removeIcon(id.kenkispender);
    }
  }

  else if (player.level >= 62
  && player.jobDetail.kenki >= gauge.target + 25) {
    if (player.level >= 64
    && toggle.aoe) {
      addIcon(id.kenkispender,icon.kyuten);
    }
    else {
      addIcon(id.kenkispender,icon.shinten);
    }
  }
  else {
    removeIcon(id.kenkispender);
  }
}

function samAction(logLine) {

  if (logLine[2] == player.name
  && actionlist.sam.indexOf(logLine[3]) > -1) { // Check if from player

    // AoE toggle
    if (["Fuga","Mangetsu","Oka"].indexOf(logLine[3]) > -1) {
      toggle.aoe = Date.now();
    }
    else {
      delete toggle.aoe;
    }

    // These actions don't interrupt combos

    if (logLine[3] == "Tenka Goken" || logLine[3] == "Midare Setsugekka") {
      if (checkStatus("meikyoshisui", player.name) > 0) {
        samCombo(); // Consuming Sen under Meikyo will trigger a new combo
      }
    }

    else if (logLine[3] == "Higanbana") {
      addStatus("higanbana", logLine[5], duration.higanbana);
      if (checkStatus("meikyoshisui", player.name) > 0) {
        samCombo(); // Consuming Sen under Meikyo will trigger a new combo
      }
    }

    else if (logLine[3] == "Meikyo Shisui") {
      addCooldown("meikyoshisui", player.name, recast.meikyoshisui);
      removeIcon(id.hakaze);
      removeIcon(id.jinpu);
      removeIcon(id.meikyoshisui);
    }

    else if (logLine[3] == "Hissatsu: Kaiten") {
      addStatus("kaiten", player.name, duration.kaiten);
    }

    else if (logLine[3] == "Hissatsu: Guren") {
      addCooldown("guren", player.name, recast.guren);
      removeIcon(id.kenkispender);
    }

    else if (logLine[3] == "Hagakure") {
      addCooldown("hagakure", player.name, recast.guren);
      removeIcon(id.hagakure);
      if (checkStatus("meikyoshisui", player.name) > 0) {
        samCombo();
      }
    }

    // Trigger combos

    else if (["Mangetsu","Oka"].indexOf(logLine[3]) > -1 && !toggle.combat) { } // Catches random hopping

    else if (logLine[3] == "Hakaze" && logLine[6].length >= 2) {
      if (![1,2,3].indexOf(toggle.combo) > -1) {
        samCombo();
      }
      removeIcon(id.hakaze);
    }

    else if (logLine[3] == "Fuga" && logLine[6].length >= 2) {
      if (![4,5].indexOf(toggle.combo) > -1) {
        samCombo();
      }
      removeIcon(id.fuga);
      meikyoCheck();
    }

    else if (logLine[3] == "Jinpu" && logLine[6].length == 8) {
      addStatus("jinpu", player.name, duration.jinpu);
      if (player.level < 30) {
        samCombo();
      }
      else {
        removeIcon(id.hakaze);
        removeIcon(id.jinpu);
        addIcon(id.gekko,icon.gekko);
      }
      meikyoCheck();
    }

    else if (logLine[3] == "Shifu" && logLine[6].length == 8) {
      addStatus("shifu", player.name, duration.shifu);
      if (player.level < 40) {
        samCombo();
      }
      else {
        removeIcon(id.hakaze);
        removeIcon(id.shifu);
        addIcon(id.kasha,icon.kasha);
      }
      meikyoCheck();
    }

    else if (logLine[3] == "Yukikaze" && logLine[6].length == 8) {
      addStatus("slashingresistancedown", logLine[5], duration.slashingresistancedown);
      samCombo();
      meikyoCheck();
    }

    else { // Everything else finishes or breaks combo
      samCombo();
      meikyoCheck();
    }

    timeoutCombo();
  }
}

function samStatus(logLine) {

  // To anyone from anyone (non-stacking)

  if (logLine[3] == "Slashing Resistance Down") {
    if (logLine[2] == "gains") {
      addStatus("slashingresistancedown", logLine[1], parseInt(logLine[5]) * 1000);
    }
    else if (logLine[2] == "loses") {
      removeStatus("slashingresistancedown", logLine[1]);
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
  }

  // To NOT player from player

  else if (logLine[1] != player.name
  && logLine[4] == player.name) {

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
    if (toggle.aoe == 1) {
      addIcon(id.meikyoshisui,icon.meikyoshisui);
    }
    else if (!toggle.aoe
    && checkStatus("jinpu", player.name) > 13000
    && checkStatus("shifu", player.name) > 13000) {
      addIcon(id.meikyoshisui,icon.meikyoshisui);
    }
    else {
      removeIcon(id.meikyoshisui);
    }
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
      if (player.jobDetail.gekko == false) {
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
      if (player.level >= 35
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
      && checkStatus("shifu", player.name) < Math.min(checkStatus("jinpu", player.name), checkStatus("slashingresistancedown", target.name))) {
        kashaCombo();
      }
      else if (player.level >= 4
      && player.jobDetail.gekko == false
      && checkStatus("jinpu", player.name) < Math.min(checkStatus("shifu", player.name), checkStatus("slashingresistancedown", target.name))) {
        gekkoCombo();
      }
      else if (player.level >= 50
      && player.jobDetail.setsu == false
      && checkStatus("slashingresistancedown", target.name) < Math.min(checkStatus("jinpu", player.name), checkStatus("shifu", player.name))) {
        yukikazeCombo();
      }
      else if (player.level >= 40
      && player.jobDetail.ka == false) {
        kashaCombo();
      }
      else if (player.level >= 30
      && player.jobDetail.gekko == false) {
        gekkoCombo();
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
