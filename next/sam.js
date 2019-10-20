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
  previous.guren = 0;

  if (player.level >= 68
  && checkRecast("ikishoten") < 0) {
    addIcon({name: "ikishoten"});
  }

  samMeikyoShisui();
  samKenki();
  samSen();
}

function samAction() {

  if (actionList.sam.indexOf(actionLog.groups.actionName) > -1) {


    // These actions don't interrupt combos

    if (actionLog.groups.actionName == "Higanbana") {
      addStatus("higanbana", duration.higanbana, actionLog.groups.targetID);
      if (checkStatus("meikyoshisui", player.ID) > 0) {
        samCombo(); // Consuming Sen under Meikyo will trigger a new combo
      }
      icon.iaijutsu = "003159";
      removeIcon(id.iaijutsu1);
      removeIcon(id.iaijutsu2);
      timeout.tsubamegaeshi1 = setTimeout(removeIcon, 12500, id.tsubamegaeshi1);
      timeout.tsubamegaeshi2 = setTimeout(removeIcon, 12500, id.tsubamegaeshi2);
    }

    else if ("Tenka Goken" == actionLog.groups.actionName) {
      if (Date.now() - previous.tenkagoken > 1000) {
        previous.tenkagoken = Date.now();
        enemyTargets = 1;
      }
      else {
        enemyTargets = enemyTargets + 1;
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

    else if ("Midare Setsugekka" == actionLog.groups.actionName) {
      if (checkStatus("meikyoshisui", player.ID) > 0) {
        samCombo(); // Consuming Sen under Meikyo will trigger a new combo
      }
      icon.iaijutsu = "003159";
      removeIcon(id.iaijutsu1);
      removeIcon(id.iaijutsu2);
      timeout.tsubamegaeshi1 = setTimeout(removeIcon, 12500, id.tsubamegaeshi1);
      timeout.tsubamegaeshi2 = setTimeout(removeIcon, 12500, id.tsubamegaeshi2);
    }

    else if (["Kaeshi: Higanbana", "Kaeshi: Goken", "Kaeshi: Setsugekka"].indexOf(actionLog.groups.actionName) > -1) {
      addRecast("tsubamegaeshi");
      icon.tsubamegaeshi = "003180";
      clearTimeout(timeout.tsubamegaeshi);
      removeIcon(id.tsubamegaeshi1);
      removeIcon(id.tsubamegaeshi2);
    }

    else if (actionLog.groups.actionName == "Meikyo Shisui") {
      addRecast("meikyoshisui");
      addStatus("meikyoshisui");
      removeIcon(id.meikyoshisui);
      samCombo(); // Clears combo and activates next Sen generating move
    }

    else if (actionLog.groups.actionName == "Hissatsu: Kaiten") {
      addStatus("kaiten");
      samKenki();
    }

    else if (actionLog.groups.actionName == "Hissatsu: Shinten") {
      removeIcon(id.shinten);
      samKenki();
    }

    else if (actionLog.groups.actionName == "Hissatsu: Kyuten") {
      removeIcon(id.kyuten);
      samKenki();
    }

    else if (actionLog.groups.actionName == "Hissatsu: Seigan") {
      removeIcon(id.seigan);
      samKenki();
    }

    else if (actionLog.groups.actionName == "Ikishoten") {
      addRecast("ikishoten");
      removeIcon(id.ikishoten);
      addIconBlinkTimeout("ikishoten", recast.ikishoten, id.ikishoten, icon.ikishoten);
      samKenki();
    }

    else if (actionLog.groups.actionName == "Hissatsu: Guren" || actionLog.groups.actionName == "Hissatsu: Senei") {
      if (Date.now() - previous.guren > 1000) {
        previous.guren = Date.now();
        enemyTargets = 1;
      }
      else {
        enemyTargets = enemyTargets + 1;
      }
      // Senei is on same cooldown as Guren
      addRecast("guren");
      removeIcon(id.guren);
      samKenki();
    }

    // Trigger combos

    else if (["Fuga", "Mangetsu", "Oka"].indexOf(actionLog.groups.actionName) > -1
    && actionLog.groups.targetName == "") {
      // Spinnin' around in town
      // No targets hit
      samCombo();
    }

    else if (actionLog.groups.actionName == "Hakaze"
    && actionLog.groups.result.length >= 2) {
      if ([1,2,3].indexOf(toggle.combo) == -1) {
        samCombo();
      }
      removeIcon(id.hakaze);
      samKenki();
    }

    else if (actionLog.groups.actionName == "Fuga"
    && actionLog.groups.result.length >= 2
    && [4,5].indexOf(toggle.combo) > -1) {
      if (Date.now() - previous.fuga > 1000) {
        previous.fuga = Date.now();
        enemyTargets = 1;
      }
      else {
        enemyTargets = enemyTargets + 1;
      }
      removeIcon(id.fuga);
      samKenki();
    }

    else if (actionLog.groups.actionName == "Jinpu"
    && actionLog.groups.result.length >= 8) {
      addStatus("jinpu");
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

    else if (actionLog.groups.actionName == "Shifu"
    && actionLog.groups.result.length >= 8) {
      addStatus("shifu");
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

    else if (actionLog.groups.actionName == "Mangetsu"
    && actionLog.groups.result.length >= 8) {
      if (Date.now() - previous.mangetsu > 1000) {
        previous.mangetsu = Date.now();
        enemyTargets = 1;
        if (checkStatus("jinpu", player.ID) > 0) {
          addStatus("jinpu", Math.min(checkStatus("jinpu", player.ID) + 15000, duration.jinpu));
        }
      }
      else {
        enemyTargets = enemyTargets + 1;
      }
      samKenki();
      samSen();
      samCombo();
    }

    else if (actionLog.groups.actionName == "Oka"
    && actionLog.groups.result.length >= 8) {
      if (Date.now() - previous.oka > 1000) {
        previous.oka = Date.now();
        enemyTargets = 1;
        if (checkStatus("shifu", player.ID) > 0) {
          addStatus("shifu", Math.min(checkStatus("shifu", player.ID) + 15000, duration.shifu));
        }
      }
      else {
        enemyTargets = enemyTargets + 1;
      }
      samKenki();
      samSen();
      samCombo();
    }

    else if (["Gekko", "Kasha", "Yukikaze"].indexOf(actionLog.groups.actionName) > -1
    && actionLog.groups.result.length >= 8) {
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
        "Enpi"].indexOf(actionLog.groups.actionName) > -1) {
      icon.tsubamegaeshi = "003180";
      removeIcon(id.tsubamegaeshi1);
      removeIcon(id.tsubamegaeshi2);
    }
  }
}

function samStatus() {

  // To anyone from anyone (non-stacking)

  if (effectLog.groups.effectName == "Slashing Resistance Down") {
    if (effectLog.groups.gainsLoses == "gains") {
    }
    else if (effectLog.groups.gainsLoses == "loses") {
    }
  }

  // To player from anyone

  else if (effectLog.groups.targetID == player.ID) {

    if (effectLog.groups.effectName == "Jinpu") {
      if (effectLog.groups.gainsLoses == "gains") {
        addStatus("jinpu", parseInt(effectLog.groups.effectDuration) * 1000, effectLog.groups.targetID);
      }
      else if (effectLog.groups.gainsLoses == "loses") {
        removeStatus("jinpu", effectLog.groups.targetID);
      }
    }

    else if (effectLog.groups.effectName == "Open Eyes") {
      if (effectLog.groups.gainsLoses == "gains") {
        addStatus("openeyes", parseInt(effectLog.groups.effectDuration) * 1000, effectLog.groups.targetID);
      }
      else if (effectLog.groups.gainsLoses == "loses") {
        removeStatus("openeyes", effectLog.groups.targetID);
      }
    }

    else if (effectLog.groups.effectName == "Shifu") {
      if (effectLog.groups.gainsLoses == "gains") {
        addStatus("shifu", parseInt(effectLog.groups.effectDuration) * 1000, effectLog.groups.targetID);
      }
      else if (effectLog.groups.gainsLoses == "loses") {
        removeStatus("shifu", effectLog.groups.targetID);
      }
    }

    else if (effectLog.groups.effectName == "Meikyo Shisui") {
      if (effectLog.groups.gainsLoses == "gains") {
        addStatus("meikyoshisui", parseInt(effectLog.groups.effectDuration) * 1000, effectLog.groups.targetID);
      }
      else if (effectLog.groups.gainsLoses == "loses") {
        removeStatus("meikyoshisui", effectLog.groups.targetID);
        samCombo();
      }
    }

    else if (effectLog.groups.effectName == "Hissatsu: Kaiten") {
      if (effectLog.groups.gainsLoses == "gains") {
        addStatus("kaiten", parseInt(effectLog.groups.effectDuration) * 1000, effectLog.groups.targetID);
      }
      else if (effectLog.groups.gainsLoses == "loses") {
        removeStatus("kaiten", effectLog.groups.targetID);
      }
    }

    else if (effectLog.groups.effectName == "Meditate") {
      if (effectLog.groups.gainsLoses == "gains") {
        addStatus("meditate", parseInt(effectLog.groups.effectDuration) * 1000, effectLog.groups.targetID);
      }
      else if (effectLog.groups.gainsLoses == "loses") {
        removeStatus("meditate", effectLog.groups.targetID);
        samKenki();
      }
    }
  }

  // To NOT player from player

  else if (effectLog.groups.sourceName == player.name) {

    if (effectLog.groups.effectName == "Higanbana") {
      if (effectLog.groups.gainsLoses == "gains") {
        addStatus("higanbana", parseInt(effectLog.groups.effectDuration) * 1000, effectLog.groups.targetID);
      }
      else if (effectLog.groups.gainsLoses == "loses") {
        removeStatus("higanbana", effectLog.groups.targetID);
      }
    }
  }
}

function samMeikyoShisui() {

  // if (player.level >= 76
  // && checkRecast("tsubamegaeshi") > 2500) {
  //   // Attempt to save Meikyo to quickly activate Tsubame-gaeshi
  //   removeIcon("meikyoshisui");
  // }
  // else

  // Set to use on cooldown for now

  if (player.level >= 50
  && checkRecast("meikyoshisui") < 0) {
    addIcon({name: "meikyoshisui"});
  }
  else {
    removeIcon("meikyoshisui");
  }
}

function samSen() {

  removeIcon("iaijutsu1");
  removeIcon("iaijutsu2");

  removeIcon("tsubamegaeshi1");
  removeIcon("tsubamegaeshi2");

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
  && checkRecast("tsubamegaeshi") < 5000
  && icon.iaijutsu == icon.tenkagoken
  && check.aoe >= 3) {
    icon.tsubamegaeshi = icon.kaeshigoken;
  }
  else if (player.level >= 74
  && checkRecast("tsubamegaeshi") < 5000
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

  let minimumkenki = 20;

  if (player.level >= 70
  && checkRecast("ikishoten") > checkRecast("guren")
  && checkRecast("guren") < 20000) {
    minimumkenki = 70;
  }

  // Show Guren/Senei
  if (player.level >= 70
  && checkRecast("ikishoten") > checkRecast("guren") + 5000
  && checkRecast("guren") < 1000
  && player.jobDetail.kenki >= 70) {
    addIcon({name: "guren"});
  }
  else {
    removeIcon("guren");
  }

  // Show Shinten/Kyuten/Seigan
  if (player.level >= 66
  && player.jobDetail.kenki >= minimumkenki + 15
  && checkStatus("openeyes", player.ID) > 5000
  && !toggle.aoe) {
    addIcon({name: "seigan"});
  }
  else if (player.level >= 62
  && player.jobDetail.kenki >= minimumkenki + 25) {
    addIcon({name: "shinten"});
  }
  else {
    removeIcon("shinten");
  }

}

function samCombo() {

  delete toggle.combo;

  // Reset icons
  removeIcon("hakaze");
  removeIcon("jinpu");
  removeIcon("gekko");

  if (toggle.aoe) { // AoE

    if (checkStatus("meikyoshisui", player.ID) > 0) {

      if (player.jobDetail.ka == false
      && checkStatus("shifu", player.ID) < checkStatus("jinpu", player.ID)) {
        addIcon({name: "oka"});
      }
      else if (player.jobDetail.getsu == false
      && checkStatus("jinpu", player.ID) < checkStatus("shifu", player.ID)) {
        addIcon({name: "mangetsu"});
      }

      else if (player.jobDetail.getsu == false) {
        addIcon({name: "mangetsu"});
      }
      else if (player.jobDetail.ka == false) {
        addIcon({name: "oka"});
      }

      else {
        addIcon({name: "mangetsu"});
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
        addIcon({name: "gekko"});
      }
      else if (player.jobDetail.ka == false) {
        addIcon({name: "kasha"});
      }
      else if (player.jobDetail.setsu == false) {
        addIcon({name: "yukikaze"});
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
  addIcon({name: "hakaze"});
  addIcon({name: "jinpu"});
  if (player.level >= 30) {
    addIcon({name: "gekko"});
  }
}

function kashaCombo() {
  toggle.combo = 2;
  addIcon({name: "hakaze"});
  addIcon({name: "shifu"});
  if (player.level >= 40) {
    addIcon({name: "kasha"});
  }
}

function yukikazeCombo() {
  toggle.combo = 3;
  addIcon({name: "hakaze"});
  removeIcon("jinpu");
  addIcon({name: "yukikaze"});
}

function mangetsuCombo() {
  toggle.combo = 4;
  addIcon({name: "fuga"});
  removeIcon("jinpu");
  addIcon({name: "mangetsu"});
}

function okaCombo() {
  toggle.combo = 5;
  addIcon({name: "fuga"});
  removeIcon("jinpu");
  addIcon({name: "oka"});
}
