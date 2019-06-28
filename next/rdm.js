"use strict";

actionList.rdm = [
  "Corps-A-Corps", "Displacement", "Fleche", "Contre Sixte", "Acceleration", "Manafication",
  "Riposte", "Zwerchhau", "Redoublement", "Moulinet", "Enchanted Riposte","Enchanted Zwerchhau", "Enchanted Redoublement",  "Enchanted Moulinet", "Verflare", "Verholy",
  "Jolt", "Verfire", "Verstone", "Jolt II", "Impact", "Scatter", "Verthunder", "Veraero",
  "Swiftcast", "Lucid Dreaming"
];

buffertime.impactful = 10000;

id.riposte = "next0";
id.moulinet = id.riposte;
id.zwerchhau = "next1";
id.redoublement = "next2";
id.verflare = "next3";
id.verholy = id.verflare;
id.hardcast = "next4";
id.dualcast = "next5";
id.manafication = "next10";
id.fleche = "next11";
id.contresixte = "next12";
id.acceleration = "next13";
id.corpsacorps = "next14";
id.displacement = "next15";
id.luciddreaming = "next16";

recast.corpsacorps = 40000;
recast.displacement = 35000;
recast.fleche = 25000;
recast.acceleration = 35000;
recast.contresixte = 45000;
recast.embolden = 120000;
recast.manafication = 120000;
recast.swiftcast = 60000;
recast.luciddreaming = 120000;

duration.impactful = 30000;

icon.luciddreaming = "000865";
icon.swiftcast = "000866";

icon.jolt = "003202";
icon.jolt2 = "003220"
icon.verthunder = "003203";
icon.corpsacorps = "003204";
icon.veraero = "003205";
icon.scatter = "003207";
icon.verfire = "003208";
icon.verstone = "003209";
icon.displacement = "003211";
icon.fleche = "003212";
icon.acceleration = "003214"
icon.contresixte = "003217";
icon.manafication = "003219";
icon.impact = "003222";
icon.verflare = "003223";
icon.verholy = "003224";
icon.riposte = "003225";
icon.zwerchhau = "003226";
icon.redoublement = "003227";
icon.moulinet = "003228";

function rdmPlayerChangedEvent(e) {

  if (player.level >= 64) {
    icon.jolt = icon.jolt2;
  }
  else {
    icon.jolt = "003202";
  }

  // Lucid Dreaming Low MP

  if (player.currentMP / player.maxMP < 0.6
  && checkCooldown("luciddreaming", player.name) < 0) {
    addIcon(id.luciddreaming,icon.luciddreaming);
  }
  else if (player.currentMP / player.maxMP > 0.7) {
    removeIcon(id.luciddreaming);
  }

  // Manafication

  if (player.level >= 60
  && checkCooldown("manafication", player.name) < 0
  && !toggle.combo) {

    // Don't use Manafication if more than 28 away from 50/50
    if (player.jobDetail.blackMana - 50 + player.jobDetail.whiteMana - 50 > 28) {
      removeIcon(id.manafication);
    }

    // Use if able to get 3x Moulinet for AOE
    else if (toggle.aoe
    && Math.min(player.jobDetail.blackMana, player.jobDetail.whiteMana) >= 45) {
      addIcon(id.manafication,icon.manafication);
    }

    // Early Manafication if able to proc from Verholy
    else if (player.level >= 70
    && Math.min(player.jobDetail.blackMana, player.jobDetail.whiteMana) >= 43
    && player.jobDetail.whiteMana < 50
    && player.jobDetail.blackMana > player.jobDetail.whiteMana
    && checkStatus("verstoneready", player.name) < 0) {
      addIcon(id.manafication,icon.manafication);
    }

    // Early Manafication if able to proc from Verflare
    else if (player.level >= 68
    && Math.min(player.jobDetail.blackMana, player.jobDetail.whiteMana) >= 43
    && player.jobDetail.blackMana < 50
    && player.jobDetail.whiteMana > player.jobDetail.blackMana
    && checkStatus("verfireready", player.name) < 0) {
      addIcon(id.manafication,icon.manafication);
    }

    // Use if otherwise over 45/45
    else if (player.level >= 60
    && Math.min(player.jobDetail.blackMana, player.jobDetail.whiteMana) >= 45) {
      addIcon(id.manafication,icon.manafication);
    }

    else {
      // Hide otherwise?
      removeIcon(id.manafication);
    }
  }
}

// Checks and activates things when entering combat
function rdmInCombatChangedEvent(e) {

  if (player.level >= 6
  && checkCooldown("corpsacorps", player.name) < 0) {
    addIcon(id.corpsacorps,icon.corpsacorps);
  }
  if (player.level >= 40
  && checkCooldown("displacement", player.name) < 0) {
    addIcon(id.displacement,icon.displacement);
  }
  if (player.level >= 45
  && checkCooldown("fleche", player.name) < 0) {
    addIcon(id.fleche,icon.fleche);
  }
  if (player.level >= 50
  && checkCooldown("acceleration", player.name) < 0) {
    addIcon(id.acceleration,icon.acceleration);
  }
  if (player.level >= 56
  && checkCooldown("contresixte", player.name) < 0) {
    addIcon(id.contresixte,icon.contresixte);
  }

  rdmDualcast();
}

function rdmAction(logLine) {

  // From Player
  if (logLine[2] == player.name
  && actionList.rdm.indexOf(logLine[3]) > -1) {

    // AoE toggle
    if (["Scatter", "Enchanted Moulinet"].indexOf(logLine[3]) > -1) {
      toggle.aoe = Date.now();
    }
    else if (["Jolt", "Verfire", "Verstone", "Jolt II", "Impact", "Enchanted Riposte", "Enchanted Zwerchhau", "Enchanted Redoublement"].indexOf(logLine[3]) > -1) {
      delete toggle.aoe;
    }

    // These actions don't interrupt combos

    if (logLine[3] == "Acceleration") {
      addCooldown("acceleration", player.name, recast.acceleration);
      removeIcon(id.acceleration);
      addIconWithTimeout("acceleration",recast.acceleration,id.acceleration,icon.acceleration);
    }

    else if (logLine[3] == "Contre Sixte") {
      addCooldown("contresixte", player.name, recast.contresixte);
      removeIcon(id.contresixte);
      addIconWithTimeout("contresixte",recast.contresixte,id.contresixte,icon.contresixte);
    }

    else if (logLine[3] == "Corps-A-Corps") {
      addCooldown("corpsacorps", player.name, recast.corpsacorps);
      removeIcon(id.corpsacorps);
      addIconWithTimeout("corpsacorps",recast.corpsacorps,id.corpsacorps,icon.corpsacorps);
    }

    else if (logLine[3] == "Displacement") {
      addCooldown("displacement", player.name, recast.displacement);
      removeIcon(id.displacement);
      addIconWithTimeout("displacement",recast.displacement,id.displacement,icon.displacement);
    }

    else if (logLine[3] == "Fleche") {
      addCooldown("fleche", player.name, recast.fleche);
      removeIcon(id.fleche);
      addIconWithTimeout("fleche",recast.fleche,id.fleche,icon.fleche);
    }

    else if (logLine[3] == "Embolden") {
    }

    else if (logLine[3] == "Swiftcast") {
      addCooldown("swiftcast", player.name, recast.swiftcast);
    }

    else if (logLine[3] == "Lucid Dreaming") {
      addCooldown("luciddreaming", player.name, recast.luciddreaming);
    }

    // Combo actions

    else if (logLine[3] == "Enchanted Riposte") {
      removeIcon(id.riposte);
    }

    else if (logLine[3] == "Enchanted Zwerchhau") {
      removeIcon(id.zwerchhau);
      if (player.level < 50) {
        delete toggle.combo;
        rdmDualcast();
      }
    }

    else if (logLine[3] == "Enchanted Redoublement") {
      removeIcon(id.redoublement);
      if (player.level < 68) {
        delete toggle.combo;
        rdmDualcast();
      }
    }

    else if (logLine[3] == "Verflare") {
      removeIcon(id.verflare);
      delete toggle.combo;
      rdmDualcast();
    }

    else if (logLine[3] == "Verholy") {
      removeIcon(id.verholy);
      delete toggle.combo;
      rdmDualcast();
    }

    // These actions interrupt combos

    else {

      delete toggle.combo;

      removeIcon(id.riposte);
      removeIcon(id.zwerchhau);
      removeIcon(id.redoublement);
      removeIcon(id.verflare);

      if (logLine[3] == "Jolt II"
      && player.level >= 66) {
        addStatus("impactful", player.name, duration.impactful);
      }

      else if (logLine[3] == "Impact") {
        removeStatus("impactful", player.name)
      }

      else if (logLine[3] == "Verfire") {
        removeStatus("verfireready", player.name)
      }

      else if (logLine[3] == "Verstone") {
        removeStatus("verstoneready", player.name)
      }

      else if (logLine[3] == "Manafication") {
        addCooldown("manafication", player.name, recast.manafication);
        clearTimeout(timeout.corpsacorps);
        clearTimeout(timeout.displacement);
        addIcon(id.corpsacorps,icon.corpsacorps);
        addIcon(id.displacement,icon.displacement);
        removeIcon(id.manafication);
        rdmDualcast();
      }
    }
  }
}


function rdmStatus(logLine) {

  // addText("debug1", logLine[1] + " " + logLine[2] + " " + logLine[3]);

  // To anyone from anyone (non-stacking)

  if (logLine[3] == "non-stacking status") {
    // if (logLine[2] == "gains") { }
    // else if (logLine[2] == "loses") { }
  }

  // To player from anyone

  else if (logLine[1] == player.name) {

    if (logLine[3] == "Dualcast") {
      if (logLine[2] == "gains") {
        addStatus("dualcast", player.name, parseInt(logLine[5]) * 1000);
        removeIcon(id.hardcast);
      }
      else if (logLine[2] == "loses") {
        removeStatus("dualcast", player.name);
        rdmDualcast();
      }
    }

    else if (logLine[3] == "Verfire Ready") {
      if (logLine[2] == "gains") {
        addStatus("verfireready", player.name, parseInt(logLine[5]) * 1000);
        rdmDualcast();
      }
      else if (logLine[2] == "loses") {
        removeStatus("verfireready", player.name)
      }
    }

    else if (logLine[3] == "Verstone Ready") {
      if (logLine[2] == "gains") {
        addStatus("verstoneready", player.name, parseInt(logLine[5]) * 1000);
        rdmDualcast();
      }
      else if (logLine[2] == "loses") {
        removeStatus("verstoneready", player.name)
      }
    }

    else if (logLine[3] == "Impactful") {
      if (logLine[2] == "gains") {
        addStatus("impactful", player.name, parseInt(logLine[5]) * 1000);
      }
      else if (logLine[2] == "loses") {
        removeStatus("impactful", player.name)
      }
    }

    else if (logLine[3] == "Swiftcast") {
      if (logLine[2] == "gains") {
        addStatus("swiftcast", player.name, parseInt(logLine[5]) * 1000);
        removeIcon(id.hardcast);
      }
      else if (logLine[2] == "loses") {
        removeStatus("swiftcast", player.name);
        rdmDualcast();
      }
    }
  }

  // To NOT player from player

  else if (logLine[1] != player.name
  && logLine[4] == player.name) {

    if (logLine[3] == "test") {
      if (logLine[2] == "gains") {
      }
      else if (logLine[2] == "loses") {
      }
    }
  }
}

function rdmDualcast() {

  // Reset all icons because double calls that result in "cancelled" combos are common
  removeIcon(id.hardcast);
  removeIcon(id.dualcast);
  removeIcon(id.riposte);
  removeIcon(id.zwerchhau);
  removeIcon(id.redoublement);
  removeIcon(id.verflare);

  // Set gauge target/cap

  if (player.level < 35) {
    gauge.target = 30;
    gauge.cap = 100;
  }
  else if (player.level < 50) {
    gauge.target = 55;
    gauge.cap = 100;
  }
  else if (player.level >= 60
  && player.jobDetail.blackMana + player.jobDetail.whiteMana - 100 <= 28
  && checkCooldown("manafication", player.name) < 0) {
    gauge.target = 43;
    gauge.cap = 50;
  }
  else {
    gauge.target = 80;
    gauge.cap = 100;
  }

  addText("debug2", "Gauge target: " + gauge.target + " |  Gauge cap: " + gauge.cap);

  // Activate combo if already set up

  if (player.level >= 70
  && Math.min(player.jobDetail.blackMana, player.jobDetail.whiteMana) >= 80
  && player.jobDetail.blackMana > player.jobDetail.whiteMana
  && checkStatus("verstoneready", player.name) < 0) {
    addText("debug3", "Verholy (100% proc)");
    rdmHolyCombo();
  }

  else if (player.level >= 68
  && Math.min(player.jobDetail.blackMana, player.jobDetail.whiteMana) >= 80
  && player.jobDetail.whiteMana > player.jobDetail.blackMana
  && checkStatus("verfireready", player.name) < 0) {
    addText("debug3", "Verflare (100% proc)");
    rdmFlareCombo();
  }

  // Fix mana before combos

  else if (player.level >= 70
  && player.jobDetail.whiteMana + 9 >= gauge.target
  && player.jobDetail.whiteMana + 9 < gauge.cap
  && Math.min(player.jobDetail.blackMana + 11, gauge.cap) > player.jobDetail.whiteMana + 9
  && checkStatus("verstoneready", player.name) > 0
  && checkStatus("verfireready", player.name) > 0) {
    addText("debug3", "Dump Verthunder proc, set up for Verholy");
    addIcon(id.hardcast,icon.verstone);
    addIcon(id.dualcast,icon.verthunder);
  }

  else if (player.jobDetail.blackMana + 9 >= gauge.target
  && player.jobDetail.blackMana + 9 < gauge.cap
  && Math.min(player.jobDetail.whiteMana + 11, gauge.cap) > player.jobDetail.blackMana + 9
  && checkStatus("verfireready", player.name) > 0
  && checkStatus("verstoneready", player.name) > 0) {
    addText("debug3", "Dump Veraero proc, set up for Verflare");
    addIcon(id.hardcast,icon.verfire);
    addIcon(id.dualcast,icon.veraero);
  }

  else if (player.level >= 70
  && player.jobDetail.whiteMana >= gauge.target
  && Math.min(player.jobDetail.blackMana + 20, gauge.cap) > player.jobDetail.whiteMana
  && checkStatus("verfireready", player.name) > 0
  && checkStatus("verstoneready", player.name) < 0) {
    addText("debug3", "Use Verfire, set up for Verholy");
    addIcon(id.hardcast,icon.verfire);
    addIcon(id.dualcast,icon.verthunder);
  }

  else if (player.jobDetail.blackMana >= gauge.target
  && Math.min(player.jobDetail.whiteMana + 20, gauge.cap) > player.jobDetail.blackMana
  && checkStatus("verstoneready", player.name) > 0
  && checkStatus("verfireready", player.name) < 0) {
    addText("debug3", "Use Verstone, set up for Verflare");
    addIcon(id.hardcast,icon.verstone);
    addIcon(id.dualcast,icon.veraero);
  }

  else if (player.level >= 70
  && player.jobDetail.whiteMana + 9 >= gauge.target
  && Math.min(player.jobDetail.blackMana + 11, gauge.cap) > player.jobDetail.whiteMana + 9
  && checkStatus("verstoneready", player.name) > 0
  && checkStatus("verfireready", player.name) < 0) {
    addText("debug3", "Use Verstone, set up for Verholy");
    addIcon(id.hardcast,icon.verstone);
    addIcon(id.dualcast,icon.verthunder);
  }

  else if (player.jobDetail.blackMana + 9 >= gauge.target
  && Math.min(player.jobDetail.whiteMana + 11, gauge.cap) > player.jobDetail.blackMana + 9
  && checkStatus("verfireready", player.name) > 0
  && checkStatus("verstoneready", player.name) < 0) {
    addText("debug3", "Use Verfire, set up for Verflare");
    addIcon(id.hardcast,icon.verfire);
    addIcon(id.dualcast,icon.veraero);
  }

  else if (player.level >= 70
  && player.jobDetail.whiteMana + 4 >= gauge.target
  && Math.min(player.jobDetail.blackMana + 15, gauge.cap) > player.jobDetail.whiteMana + 4
  && checkStatus("impactful", player.name) > 0
  && checkStatus("verstoneready", player.name) < 0) {
    addText("debug3", "Use Impact, set up for Verholy");
    addIcon(id.hardcast,icon.impact);
    addIcon(id.dualcast,icon.verthunder);
  }

  else if (player.jobDetail.blackMana + 4 >= gauge.target
  && Math.min(player.jobDetail.whiteMana + 15, gauge.cap) > player.jobDetail.blackMana + 4
  && checkStatus("impactful", player.name) > 0
  && checkStatus("verfireready", player.name) < 0) {
    addText("debug3", "Use Impact, set up for Verflare");
    addIcon(id.hardcast,icon.impact);
    addIcon(id.dualcast,icon.veraero);
  }

  else if (player.level >= 70
  && player.jobDetail.whiteMana >= gauge.target
  && Math.min(player.jobDetail.blackMana + 11, gauge.cap) > player.jobDetail.whiteMana
  && checkCooldown("swiftcast", player.name) < 0
  && checkStatus("verstoneready", player.name) < 0) {
    addText("debug3", "Use Swiftcast, set up for Verholy");
    addIcon(id.hardcast,icon.swiftcast);
    addIcon(id.dualcast,icon.verthunder);
  }

  else if (player.jobDetail.blackMana >= gauge.target
  && Math.min(player.jobDetail.whiteMana + 11, gauge.cap) > player.jobDetail.blackMana
  && checkCooldown("swiftcast", player.name) < 0
  && checkStatus("verfireready", player.name) < 0) {
    addText("debug3", "Use Swiftcast, set up for Verflare");
    addIcon(id.hardcast,icon.swiftcast);
    addIcon(id.dualcast,icon.veraero);
  }

  else if (player.level >= 70
  && player.jobDetail.whiteMana + 3 >= gauge.target
  && Math.min(player.jobDetail.blackMana + 14, gauge.cap)> player.jobDetail.whiteMana + 3
  && checkStatus("verstoneready", player.name) < 0) {
    addText("debug3", "Use Jolt, set up for Verholy");
    addIcon(id.hardcast,icon.jolt);
    addIcon(id.dualcast,icon.verthunder);
  }

  else if (player.jobDetail.blackMana + 3 >= gauge.target
  && Math.min(player.jobDetail.whiteMana + 14, gauge.cap)> player.jobDetail.blackMana + 3
  && checkStatus("verfireready", player.name) < 0) {
    addText("debug3", "Use Jolt, set up for Verflare");
    addIcon(id.hardcast,icon.jolt);
    addIcon(id.dualcast,icon.veraero);
  }

  // Unfixable mana situations

  else if (player.level >= 70
  && Math.min(player.jobDetail.blackMana, player.jobDetail.whiteMana) >= 80) {
    if (player.jobDetail.whiteMana + 20 - player.jobDetail.blackMana <= 30
    && checkStatus("verstoneready", player.name) < 0) {
      addText("debug3", "Cannot fix mana - 20% proc");
      rdmHolyCombo();
    }
    else if (player.jobDetail.blackMana + 20 - player.jobDetail.whiteMana <= 30
    && checkStatus("verfireready", player.name) < 0) {
      addText("debug3", "Cannot fix mana - 20% proc");
      rdmFlareCombo();
    }
    else if (player.jobDetail.whiteMana > player.jobDetail.blackMana) {
      addText("debug3", "Cannot fix mana - balancing mana");
      rdmFlareCombo();
    }
    else {
      addText("debug3", "Cannot fix mana - balancing mana");
      rdmHolyCombo();
    }
  }

  else if (player.level >= 68
  && Math.min(player.jobDetail.blackMana, player.jobDetail.whiteMana) >= 80) {
    addText("debug3", "Cannot fix mana - starting combo");
    rdmFlareCombo();
  }

  // Normal Dualcasts

  else if (checkStatus("impactful", player.name) > 0
  && checkStatus("impactful", player.name) < 10000) {

    addIcon(id.hardcast,icon.impact);

    if (checkStatus("verfireready", player.name) > 0
    && Math.min(player.jobDetail.whiteMana + 15, 100) - Math.min(player.jobDetail.blackMana + 4, 100) <= 30)
    {
      addText("debug3", "Avoiding Verfire Ready proc");
      addIcon(id.dualcast,icon.veraero);
    }

    else if (checkStatus("verstoneready", player.name) > 0
    && Math.min(player.jobDetail.blackMana + 15, 100) - Math.min(player.jobDetail.whiteMana + 4, 100) <= 30)
    {
      addText("debug3", "Avoiding Verstone Ready proc");
      addIcon(id.dualcast,icon.verthunder);
    }

    else if (player.jobDetail.blackMana >= player.jobDetail.whiteMana) {
      addText("debug3", "Balancing mana");
      addIcon(id.dualcast,icon.veraero);
    }

    else {
      addText("debug3", "Balancing mana");
      addIcon(id.dualcast,icon.verthunder);
    }
  }

  else if (checkStatus("verfireready", player.name) > 0 && checkStatus("verstoneready", player.name) > 0) {
    addText("debug3", "Verfire and Verstone Ready, balancing mana");
    if (player.jobDetail.blackMana >= player.jobDetail.whiteMana) {
      addIcon(id.hardcast,icon.verstone);
      addIcon(id.dualcast,icon.veraero);
    }
    else {
      addIcon(id.hardcast,icon.verfire);
      addIcon(id.dualcast,icon.verthunder);
    }
  }

  else if (checkStatus("verfireready", player.name) > 0) {

    if (Math.min(player.jobDetail.blackMana + 9, 100) - player.jobDetail.whiteMana > 30) {
      addText("debug3", "Avoiding unbalanced mana");
      if (checkStatus("impactful", player.name) > 0) {
        addIcon(id.hardcast,icon.impact);
      }
      else {
        addIcon(id.hardcast,icon.jolt);
      }
      addIcon(id.dualcast,icon.veraero);
    }

    else if (player.jobDetail.blackMana + 9 == player.jobDetail.whiteMana + 11) {
      addText("debug3", "Avoiding equal mana");
      if (checkStatus("impactful", player.name) > 0) {
        addIcon(id.hardcast,icon.impact);
      }
      else {
        addIcon(id.hardcast,icon.jolt);
      }
      addIcon(id.dualcast,icon.veraero);
    }

    else if (player.jobDetail.blackMana + 9 < player.jobDetail.whiteMana) {
      addText("debug3", "Balancing mana");
      addIcon(id.hardcast,icon.verfire);
      addIcon(id.dualcast,icon.verthunder);
    }

    else {
      addText("debug3", "Balancing mana");
      addIcon(id.hardcast,icon.verfire);
      addIcon(id.dualcast,icon.veraero);
    }
  }

  else if (checkStatus("verstoneready", player.name) > 0) {

    if (Math.min(player.jobDetail.whiteMana + 9, 100) - player.jobDetail.blackMana > 30) {
      addText("debug3", "Avoiding unbalanced mana");
      if (checkStatus("impactful", player.name) > 0) {
        addIcon(id.hardcast,icon.impact);
      }
      else {
        addIcon(id.hardcast,icon.jolt);
      }
      addIcon(id.dualcast,icon.verthunder);
    }

    else if (player.jobDetail.whiteMana + 9 == player.jobDetail.blackMana + 11) {
      addText("debug3", "Avoiding equal mana");
      if (checkStatus("impactful", player.name) > 0) {
        addIcon(id.hardcast,icon.impact);
      }
      else {
        addIcon(id.hardcast,icon.jolt);
      }
      addIcon(id.dualcast,icon.verthunder);
    }

    else if (player.jobDetail.whiteMana + 9 < player.jobDetail.blackMana) {
      addText("debug3", "Balancing mana");
      addIcon(id.hardcast,icon.verstone);
      addIcon(id.dualcast,icon.veraero);
    }

    else {
      addText("debug3", "Balancing mana");
      addIcon(id.hardcast,icon.verstone);
      addIcon(id.dualcast,icon.verthunder);
    }
  }

  else if (checkCooldown("swiftcast", player.name) < 0) {

    addIcon(id.hardcast,icon.swiftcast);

    if (player.jobDetail.blackMana + 11 == player.jobDetail.whiteMana) {
      addText("debug3", "Avoiding equal mana");
      addIcon(id.dualcast,icon.veraero);
    }

    else if (player.jobDetail.blackMana == player.jobDetail.whiteMana + 11) {
      addText("debug3", "Avoiding equal mana");
      addIcon(id.dualcast,icon.verthunder);
    }

    else if (player.jobDetail.blackMana >= player.jobDetail.whiteMana) {
      addText("debug3", "Balancing mana");
      addIcon(id.dualcast,icon.veraero);
    }

    else {
      addText("debug3", "Balancing mana");
      addIcon(id.dualcast,icon.verthunder);
    }
  }

  else {
    if (checkStatus("impactful", player.name) > 0) {
      addIcon(id.hardcast,icon.impact);
    }
    else {
      addIcon(id.hardcast,icon.jolt);
    }

    if (player.jobDetail.blackMana >= player.jobDetail.whiteMana) {
      addText("debug3", "Balancing mana");
      addIcon(id.dualcast,icon.veraero);
    }
    else {
      addText("debug3", "Balancing mana");
      addIcon(id.dualcast,icon.verthunder);
    }
  }
}

function rdmCombo() {
  toggle.combo = Date.now();
  addIcon(id.riposte,icon.riposte);
  if (player.level >= 35) {
    addIcon(id.zwerchhau,icon.zwerchhau);
  }
  if (player.level >= 50) {
    addIcon(id.redoublement,icon.redoublement);
  }
}

function rdmFlareCombo() {
  rdmCombo();
  addIcon(id.verflare,icon.verflare);
}

function rdmHolyCombo() {
  rdmCombo();
  addIcon(id.verholy,icon.verholy);
}

// Notes to self
// delete toggle.combo is everywhere because Manafication relies on it to check
