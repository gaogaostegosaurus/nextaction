"use strict";

actionList.sam = ["Hakaze", "Jinpu", "Enpi", "Shifu", "Gekko", "Kasha", "Yukikaze", "Fuga", "Mangetsu", "Oka",
  "Higanbana", "Midare Setsugekka", "Tenka Goken",
  "Meikyo Shisui", "Meditate", "Hagakure", "Hissatsu: Guren"];

statusList.sam = ["Jinpu", "Shifu", "Meikyo Shisui", "Hissatsu: Kaiten",
  "Higanbana",
  "Slashing Resistance Down"];

var kenkiFloor = 0;

id.iaijutsu1 = "nextAction1";
id.hakaze = "nextAction2";
id.fuga = "nextAction2";
id.jinpu = "nextAction3";
id.shifu = "nextAction3";
id.iaijutsu2 = "nextAction4";
id.gekko = "nextAction5";
id.kasha = "nextAction5";
id.yukikaze = "nextAction5";
id.mangetsu = "nextAction5";
id.oka = "nextAction5";
id.iaijutsu3 = "nextAction6";
id.shinten = "nextAction11";
id.kyuten = "nextAction11";
id.guren = "nextAction11";
id.kenkispender = "nextAction11";
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

recast.meikyoshisui = 80000;
recast.hagakure = 40000;
recast.guren = 120000;

function samPlayerChangedEvent(e) {

  // Sen management

  // Set Kenki floor based on if Hagakure is coming up
  if (player.level >= 68
  && (!cooldowntime.hagakure || cooldowntime.hagakure - Date.now() < 4000)) {
    kenkiFloor = 0;
  }
  else {
    kenkiFloor = 20;
  }

  // Check for Hagakure, spend Sen if Hagakure is far enough away, use Kenki otherwise
  if (player.level >= 68
  && (!cooldowntime.hagakure || cooldowntime.hagakure - Date.now() < 4000)
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
    && (!statustime.higanbana || statustime.higanbana - Date.now() < 15000)) {
        if ((!statustime.jinpu || statustime.jinpu - Date.now() < 4000)
        && toggle.combo == 1) {
        // Delay Higanbana for Jinpu buff
          removeIcon(id.iaijutsu1);
          addIcon(id.iaijutsu2,icon.higanbana);
          removeIcon(id.iaijutsu3);
        }
        else if (player.level >= 62
        && !statustime.kaiten
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
      if ((!statustime.jinpu || statustime.jinpu - Date.now() < 4000)
      && toggle.combo == 1) {
      // Delay Midare for Jinpu
        removeIcon(id.iaijutsu1);
        addIcon(id.iaijutsu2,icon.midaresetsugekka);
        removeIcon(id.iaijutsu3);
      }
      else if (player.level >= 62
      && !statustime.kaiten
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
  && (!cooldowntime.guren || cooldowntime.guren - Date.now() < 12000)
  && cooldowntime.hagakure - Date.now() > 12000) {
  // Guren coming up

    if (player.jobDetail.kenki >= kenkiFloor + 50
    && (!cooldowntime.guren || cooldowntime.guren - Date.now() < 0)) {
    // Spend Kenki on Guren
      addIcon(id.kenkispender,icon.guren);
    }

    else if (player.level >= 70
    && player.jobDetail.kenki >= kenkiFloor + 50 + 25) {
    // Spend to avoid overcap
      if (toggle.aoe) {
        addIcon(id.kenkispender,icon.kyuten);
      }
      else {
        addIcon(id.kenkispender,icon.shinten);
      }
    }

    else if (player.level >= 70
    && player.jobDetail.kenki < kenkiFloor + 50
    && (!cooldowntime.guren || cooldowntime.guren - Date.now() < 12000)) { // Save for Guren
      removeIcon(id.kenkispender);
    }
  }

  else if (player.level >= 62
  && player.jobDetail.kenki >= kenkiFloor + 25) {
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

  if (logLine[2] == player.name) { // Check if from player

    // AoE toggle
    if (["Fuga","Mangetsu","Oka"].indexOf(logLine[3]) > -1) {
      toggle.aoe = Date.now();
    }
    else {
      delete toggle.aoe;
    }

    if (logLine[3] == "Higanbana"){
      if (statustime.meikyoshisui) {
        samCombo(); // Consuming Sen under Meikyo will trigger a new combo
      }
    }

    else if (logLine[3] == "Tenka Goken") {
      if (statustime.meikyoshisui) {
        samCombo();
      }
    }

    else if (logLine[3] == "Midare Setsugekka") {
      if (statustime.meikyoshisui) {
        samCombo();
      }
    }

    else if (logLine[3] == "Meikyo Shisui") {
      cooldowntime.meikyoshisui = Date.now() + recast.meikyoshisui;
      removeIcon(id.hakaze);
      removeIcon(id.jinpu);
      removeIcon(id.meikyoshisui);
    }

    else if (logLine[3] == "Hissatsu: Kaiten") {
      statustime.kaiten = Date.now() + 10000;
    }

    else if (logLine[3] == "Hissatsu: Guren") {
      cooldowntime.guren = Date.now() + recast.guren;
      removeIcon(id.kenkispender);
    }

    else if (logLine[3] == "Hagakure") {
      cooldowntime.hagakure = Date.now() + recast.hagakure;
      removeIcon(id.hagakure);
      if (statustime.meikyoshisui) {
        samCombo();
      }
    }

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
      statustime.jinpu = Date.now() + 30000;
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
      statustime.shifu = Date.now() + 30000;
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
      statustime.slashingresistancedown = Date.now() + 30000;
      samCombo();
      meikyoCheck();
    }

    else { // Everything else finishes or breaks combo
      samCombo();
      meikyoCheck();
    }

    previous.action = logLine[3];
    timeoutCombo();
  }
}

function samStatus(logLine) {

  // To anyone from anyone (non-stacking)

  if (logLine[3] == "Slashing Resistance Down") {
    if (["gain","gains"].indexOf(logLine[2]) > -1) {
      statustime.slashingresistancedown = Date.now() + parseInt(logLine[5]) * 1000;
    }
    else if (["lose","loses"].indexOf(logLine[2]) > -1) {
      delete statustime.slashingresistancedown;
    }
  }

  // To player from anyone

  else if (logLine[1] == player.name) {

    if (logLine[3] == "Jinpu") {
      if (["gain","gains"].indexOf(logLine[2]) > -1) {
        statustime.jinpu = Date.now() + parseInt(logLine[5]) * 1000;
      }
      else if (["lose","loses"].indexOf(logLine[2]) > -1) {
        delete statustime.jinpu;
      }
    }

    else if (logLine[3] == "Shifu") {
      if (["gain","gains"].indexOf(logLine[2]) > -1) {
        statustime.shifu = Date.now() + parseInt(logLine[5]) * 1000;
      }
      else if (["lose","loses"].indexOf(logLine[2]) > -1) {
        delete statustime.shifu;
      }
    }

    else if (logLine[3] == "Meikyo Shisui") {
      if (["gain","gains"].indexOf(logLine[2]) > -1) {
        statustime.meikyoshisui = Date.now() + parseInt(logLine[5]) * 1000;
      }
      else if (["lose","loses"].indexOf(logLine[2]) > -1) {
        delete statustime.meikyoshisui;
        samCombo();
      }
    }

    else if (logLine[3] == "Hissatsu: Kaiten") {
      if (["gain","gains"].indexOf(logLine[2]) > -1) {
        statustime.kaiten = Date.now() + parseInt(logLine[5]) * 1000;
      }
      else if (["lose","loses"].indexOf(logLine[2]) > -1) {
        delete statustime.kaiten;
      }
    }
  }

  // To NOT player from player

  else if (logLine[1] != player.name
  && logLine[4] == player.name) {

    if (logLine[3] == "Higanbana") {
      if (["gain","gains"].indexOf(logLine[2]) > -1) {
        statustime.higanbana = Date.now() + parseInt(logLine[5]) * 1000;
      }
      else if (["lose","loses"].indexOf(logLine[2]) > -1) {
        delete statustime.higanbana;
      }
    }
  }
}

function meikyoCheck() {
  if (!cooldowntime.meikyoshisui
  || cooldowntime.meikyoshisui - Date.now() < 1000) {
    if (toggle.aoe == 1) {
      addIcon(id.meikyoshisui,icon.meikyoshisui);
    }
    else if (!toggle.aoe
    && statustime.jinpu - Date.now() > 13000
    && statustime.shifu - Date.now() > 13000) {
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

    if (statustime.meikyoshisui) {
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

    if (statustime.meikyoshisui) {
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
      && (!statustime.shifu || statustime.shifu < Math.min(statustime.jinpu, statustime.slashingresistancedown))) {
        kashaCombo();
      }
      else if (player.level >= 4
      && player.jobDetail.gekko == false
      && (!statustime.jinpu || statustime.jinpu < Math.min(statustime.shifu, statustime.slashingresistancedown))) {
        gekkoCombo();
      }
      else if (player.level >= 50
      && player.jobDetail.setsu == false
      && (!statustime.slashingresistancedown || statustime.slashingresistancedown < Math.min(statustime.jinpu, statustime.shifu))) {
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
