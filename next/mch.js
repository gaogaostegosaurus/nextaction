"use strict";

actionList.mch = [

  // Toggle single target
  "Split Shot", "Slug Shot", "Clean Shot",
  "Heated Split Shot", "Heated Slug Shot", "Heated Clean Shot",
  "Hot Shot", "Heat Blast",

  // Toggle AoE
  "Spread Shot", "Auto Crossbow", "Flamethrower", "Bioblaster",

  // Misc
  "Reassemble", "Gauss Round", "Hypercharge", "Rook Autoturret", "Wildfire",
  "Ricochet", "Tactician", "Drill", "Barrel Stabilizer", "Air Anchor",
  "Automaton Queen",

  // Role actions
  "Second Wind", "Peloton", "Head Graze"
];

function mchJobChange() {

  id.heatblast = 0;
  id.autocrossbow = id.heatblast;
  id.reassemble = 1;
  id.drill = 2;
  id.bioblaster = id.drill;
  id.hotshot = 3;
  id.airanchor = id.hotshot;
  id.splitshot = 4;
  id.heatedsplitshot = id.splitshot;
  id.spreadshot = id.splitshot;
  id.slugshot = 4;
  id.heatedslugshot = id.slugshot;
  id.cleanshot = 5;
  id.heatedcleanshot = id.cleanshot;
  id.rookautoturret = 10;
  id.rookoverdrive = id.rookautoturret;
  id.automatonqueen = id.rookautoturret;
  id.queenoverdrive = id.rookautoturret;
  id.barrelstabilizer = 11;
  id.wildfire = 12;
  id.detonator = id.wildfire;
  id.hypercharge = 13;
  id.gaussround = 14;
  id.ricochet = 15;
  id.flamethrower = 16;
  // id.tactician = ?;

  if (player.level >= 76) {
    icon.hotshot = icon.airanchor;
  }
  else {
    icon.hotshot = "003003";
  }
  if (player.level >= 64) {
    icon.cleanshot = icon.heatedcleanshot;
  }
  else {
    icon.cleanshot = "003004";
  }
  if (player.level >= 60) {
    icon.slugshot = icon.heatedslugshot;
  }
  else {
    icon.slugshot = "003002";
  }
  if (player.level >= 54) {
    icon.splitshot = icon.heatedsplitshot;
  }
  else {
    icon.splitshot = "003001";
  }
}


// 1:SourceID 2:SourceName 3:SkillName 4:TargetID 5:TargetName 6:Result

function mchAction() {

  if (actionList.mch.indexOf(actionGroups.actionname) > -1) { // Check if from player

    removeText("loadmessage");

    // Toggle AoE

    if (["Spread Shot", "Auto Crossbow", "Flamethrower", "Bioblaster"].indexOf(actionGroups.actionname) > -1) {
      toggle.aoe = Date.now();
    }
    else if (["Split Shot", "Slug Shot", "Clean Shot",
              "Heated Split Shot", "Heated Slug Shot", "Heated Clean Shot",
              "Hot Shot", "Heat Blast"
             ].indexOf(actionGroups.actionname) > -1)
    {
      delete toggle.aoe;
    }

    // These actions don't interrupt combos

    if (.indexOf(actionGroups.actionname) > -1) {
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

    else if (["Hot Shot", "Air Anchor"].indexOf(actionGroups.actionname) > -1
    && logLine[6].length >= 2) {
      removeIcon(id.hotshot);
      addCooldown("hotshot", player.ID, recast.hotshot);
    }


    else if (["Split Shot", "Heated Split Shot"].indexOf(actionGroups.actionname) > -1
    && logLine[6].length >= 2) {
      if (!toggle.combo) {
        mchCombo();
      }
      removeIcon(id.splitshot);
    }

    else if (["Slug Shot", "Heated Slug Shot"].indexOf(actionGroups.actionname) > -1
    && logLine[6].length == 8) {
      if (!toggle.combo) {
        mchCombo();
      }
      removeIcon(id.splitshot);
      removeIcon(id.slugshot);
    }

    // else if (["Clean Shot", "Heated Clean Shot"].indexOf(actionGroups.actionname) > -1
    // && logLine[6].length == 8) {
    //   if (!toggle.combo) {
    //     mchCombo();
    //   }
    //   removeIcon(id.splitshot);
    //   removeIcon(id.slugshot);
    //   removeIcon(id.cleanshot);
    // }

    else { // Everything else finishes or breaks combo
      mchCombo();
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

function mchCombo() {
  delete toggle.combo;

  // Reset icons
  removeIcon(id.splitshot);
  removeIcon(id.slugshot);
  removeIcon(id.cleanshot);

  if (toggle.aoe) { // AoE
    addIcon(id.spreadshot,icon.spreadshot);
  }

  else {
    addIcon(id.splitshot,icon.splitshot);
    if (player.level >= 2) {
      addIcon(id.slugshot,icon.slugshot);
    }
    if (player.level >= 26) {
      addIcon(id.cleanshot,icon.cleanshot);
    }
  }

  clearTimeout(timeout.combo);
  timeout.combo = setTimeout(mchComboTimeout, 12500);
}

function mchComboTimeout() {
  if (toggle.combat) {
    mchCombo();
  }
}
