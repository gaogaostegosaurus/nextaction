"use strict";

actionList.rdm = ["Jolt", "Verfire", "Verstone", "Jolt II", "Impact", "Scatter", "Verthunder", "Veraero",
"Vercure", "Verraise",
"Riposte", "Zwerchhau", "Redoublement", "Moulinet",
"Enchanted Riposte","Enchanted Zwerchhau", "Enchanted Redoublement", "Verflare", "Verholy", "Enchanted Moulinet",
"Swiftcast", "Corps-A-Corps", "Displacement", "Fleche", "Contre Sixte", "Acceleration", "Manafication",
"Lucid Dreaming"];
statusList.rdm = ["Dualcast", "Verfire Ready", "Verstone Ready", "Impactful", "Swiftcast"];

buffertime.impactful = 10000;

id.riposte = "nextAction1";
id.moulinet = id.riposte;
id.zwerchhau = "nextAction2";
id.redoublement = "nextAction3";
id.verflare = "nextAction4";
id.verholy = id.verflare;
id.hardcast = "nextAction5";
id.dualcast = "nextAction6";
id.manafication = "nextAction11";
id.fleche = "nextAction12";
id.contresixte = "nextAction13";
id.acceleration = "nextAction14";
id.corpsacorps = "nextAction15";
id.displacement = "nextAction16";
id.luciddreaming = "nextAction17";

recast.corpsacorps = 40000;
recast.displacement = 35000;
recast.fleche = 25000;
recast.acceleration = 35000;
recast.contresixte = 45000;
recast.embolden = 120000;
recast.manafication = 120000;
recast.swiftcast = 60000;

statuslength.verfireready = 30000;
statuslength.verstoneready = 30000;
statuslength.acceleration = 10000;
statuslength.enhancedscatter = 10000;
statuslength.impact = 30000;

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

function rdmInCombatChangedEvent(e) { // Activates cooldown stuff when entering combat

  if (player.level >= 6
  && (!cooldowntime.corpsacorps || cooldowntime.corpsacorps - Date.now() < 0)) {
    addIcon(id.corpsacorps,icon.corpsacorps);
  }
  if (player.level >= 40
  && (!cooldowntime.displacement || cooldowntime.displacement - Date.now() < 0)) {
    addIcon(id.displacement,icon.displacement);
  }
  if (player.level >= 45
  && (!cooldowntime.fleche || cooldowntime.fleche - Date.now() < 0)) {
    addIcon(id.fleche,icon.fleche);
  }
  if (player.level >= 50
  && (!cooldowntime.acceleration || cooldowntime.acceleration - Date.now() < 0)) {
    addIcon(id.acceleration,icon.acceleration);
  }
  if (player.level >= 56
  && (!cooldowntime.contresixte || cooldowntime.contresixte - Date.now() < 0)) {
    addIcon(id.contresixte,icon.contresixte);
  }
}

function rdmPlayerChangedEvent(e) {

  if (player.level >= 64) {
    icon.jolt = icon.jolt2;
  }

  // Low MP notice

  if (player.currentMP / player.maxMP < 0.6) {
    addIcon(id.luciddreaming,icon.luciddreaming);
  }


  else if (player.currentMP / player.maxMP > 0.7) {
    removeIcon(id.luciddreaming);
  }

  // Manafication conditions

  if (player.level >= 60
  && (!cooldowntime.manafication || cooldowntime.manafication - Date.now() < 0)
  && !toggle.combo) {

    // Don't use over 65/65
    if (Math.min(player.jobDetail.blackMana, player.jobDetail.whiteMana) >= 65) {
      removeIcon(id.manafication);
    }

    // AOE
    else if (toggle.aoe
    && Math.min(player.jobDetail.blackMana, player.jobDetail.whiteMana) >= 45) {
      addIcon(id.manafication,icon.manafication);
    }

    // Early Manafication if able to proc from Verholy
    else if (player.level >= 70
    && Math.min(player.jobDetail.blackMana, player.jobDetail.whiteMana) >= 43
    && player.jobDetail.whiteMana < 50
    && player.jobDetail.blackMana > player.jobDetail.whiteMana
    && !statustime.verstoneready) {
      addIcon(id.manafication,icon.manafication);
    }

    // Early Manafication if able to proc from Verflare
    else if (player.level >= 68
    && Math.min(player.jobDetail.blackMana, player.jobDetail.whiteMana) >= 43
    && player.jobDetail.blackMana < 50
    && player.jobDetail.whiteMana > player.jobDetail.blackMana
    && !statustime.verfireready) {
      addIcon(id.manafication,icon.manafication);
    }

    // Use if otherwise over 45/45
    else if (player.level >= 60
    && (!cooldowntime.manafication || cooldowntime.manafication - Date.now() < 0)
    && Math.min(player.jobDetail.blackMana, player.jobDetail.whiteMana) >= 45) {
      addIcon(id.manafication,icon.manafication);
    }

    else {
      removeIcon(id.manafication);
    }
  }
}

function rdmAction(logLine) {

  if (logLine[2] == player.name) { // From Player

    // AoE toggle

    if (["Scatter", "Enchanted Moulinet"].indexOf(logLine[3]) > -1) {
      toggle.aoe = Date.now();
    }
    else if (["Jolt", "Verfire", "Verstone", "Jolt II", "Impact", "Enchanted Riposte", "Enchanted Zwerchhau", "Enchanted Redoublement"].indexOf(logLine[3]) > -1) {
      delete toggle.combo;
    }

    // These actions don't interrupt combos

    if (logLine[3] == "Acceleration") {
      cooldowntime.acceleration = Date.now() + recast.acceleration;
      removeIcon(id.acceleration);
      addIconWithTimeout("acceleration",recast.acceleration,id.acceleration,icon.acceleration);
    }

    else if (logLine[3] == "Contresixte") {
      cooldowntime.contresixte = Date.now() + recast.contresixte;
      removeIcon(id.contresixte);
      addIconWithTimeout("contresixte",recast.contresixte,id.contresixte,icon.contresixte);
    }

    else if (logLine[3] == "Corps-A-Corps") {
      cooldowntime.corpsacorps = Date.now() + recast.corpsacorps;
      removeIcon(id.corpsacorps);
      addIconWithTimeout("corpsacorps",recast.corpsacorps,id.corpsacorps,icon.corpsacorps);
    }

    else if (logLine[3] == "Displacement") {
      cooldowntime.displacement = Date.now() + recast.displacement;
      removeIcon(id.displacement);
      addIconWithTimeout("displacement",recast.displacement,id.displacement,icon.displacement);
    }

    else if (logLine[3] == "Fleche") {
      cooldowntime.fleche = Date.now() + recast.fleche;
      removeIcon(id.fleche);
      addIconWithTimeout("fleche",recast.fleche,id.fleche,icon.fleche);
    }

    // Combo actions

    else if (logLine[3] == "Enchanted Riposte") {
      removeIcon(id.riposte);
    }

    else if (logLine[3] == "Enchanted Zwerchhau") {
      removeIcon(id.zwerchhau);
      if (player.level < 50) {
        rdmDualcast();
      }
    }

    else if (logLine[3] == "Enchanted Redoublement") {
      removeIcon(id.redoublement);
      if (player.level < 68) {
        rdmDualcast();
      }
    }

    else if (logLine[3] == "Verflare") {
      removeIcon(id.verflare);
      rdmDualcast();
    }

    else if (logLine[3] == "Verholy") {
      removeIcon(id.verholy);
      rdmDualcast();
    }

    // These actions interrupt combos

    else {

      delete toggle.combo;

      if (logLine[3] == "Jolt II"
      && player.level >= 66) {
        statustime.impactful = Date.now() + 30000;
      }

      else if (logLine[3] == "Impact") {
        delete statustime.impactful;
      }

      else if (logLine[3] == "Verfire") {
        delete statustime.verfireready;
      }

      else if (logLine[3] == "Verstone") {
        delete statustime.verstoneready;
      }

      else if (logLine[3] == "Manafication") {
        cooldowntime.manafication = Date.now() + recast.manafication;
        clearTimeout(timeout.corpsacorps);
        clearTimeout(timeout.displacement);
        addIcon(id.corpsacorps,icon.corpsacorps);
        addIcon(id.displacement,icon.displacement);
        rdmDualcast();
      }

      else if (logLine[3] == "Swiftcast") {
        cooldowntime.swiftcast = Date.now() + recast.swiftcast;
      }

    }
  }
}


function rdmStatus(logLine) {

  // To anyone from anyone (non-stacking)

  if (logLine[3] == "test status") {
    if (logLine[2] == "gains") {
      statustime.test = Date.now() + parseInt(logLine[5]) * 1000;
    }
    else if (logLine[2] == "loses") {
      delete statustime.test;
    }
  }

  // To player from anyone

  else if (logLine[1] == player.name) {

    if (logLine[3] == "Dualcast") {
      if (logLine[2] == "gains") {
        statustime.dualcast = Date.now() + parseInt(logLine[5]) * 1000;
        removeIcon(id.hardcast);
      }
      else if (logLine[2] == "loses") {
        delete statustime.dualcast;
        removeIcon(id.dualcast);
        rdmDualcast();
      }
    }

    else if (logLine[3] == "Verfire Ready") {
      if (logLine[2] == "gains") {
        statustime.verfireready = Date.now() + parseInt(logLine[5]) * 1000;
        rdmDualcast();
      }
      else if (logLine[2] == "loses") {
        delete statustime.verfireready;
      }
    }

    else if (logLine[3] == "Verstone Ready") {
      if (logLine[2] == "gains") {
        statustime.verstoneready = Date.now() + parseInt(logLine[5]) * 1000;
        rdmDualcast();
      }
      else if (logLine[2] == "loses") {
        delete statustime.verstoneready;
      }
    }

    else if (logLine[3] == "Impactful") {
      if (logLine[2] == "gains") {
        statustime.impactful = Date.now() + parseInt(logLine[5]) * 1000;
      }
      else if (logLine[2] == "loses") {
        delete statustime.impactful;
      }
    }

    else if (logLine[3] == "Swiftcast") {
      if (logLine[2] == "gains") {
        statustime.swiftcast = Date.now() + parseInt(logLine[5]) * 1000;
      }
      else if (logLine[2] == "loses") {
        delete statustime.swiftcast;
        rdmDualcast();
      }
    }
  }

  // To NOT player from player

  else if (logLine[1] != player.name
  && logLine[4] == player.name) {

    if (logLine[3] == "test") {
      if (logLine[2] == "gains") {
        statustime.test = Date.now() + parseInt(logLine[5]) * 1000;
      }
      else if (logLine[2] == "loses") {
        delete statustime.test;
      }
    }
  }
}

function rdmDualcast() {

  // Fixing mana before combos

  // Set up for Manafication - priority is Verholy

  if (player.level >= 70
  && player.jobDetail.whiteMana + 9 >= 43
  && player.jobDetail.blackMana + 11 > player.jobDetail.whiteMana + 9
  && statustime.verstoneready) {
    addIcon(id.hardcast,icon.verstone);
    addIcon(id.dualcast,icon.verthunder);
  }

  else if (player.level >= 68
  && player.jobDetail.blackMana + 9 >= 43
  && player.jobDetail.whiteMana + 11 > player.jobDetail.blackMana + 9
  && statustime.verfireready) {
    addIcon(id.hardcast,icon.verfire);
    addIcon(id.dualcast,icon.veraero);
  }

  else if (player.level >= 70
  && player.jobDetail.whiteMana + 4 >= 43
  && player.jobDetail.blackMana + 15 > player.jobDetail.whiteMana + 4
  && statustime.impactful) {
    addIcon(id.hardcast,icon.impact);
    addIcon(id.dualcast,icon.verthunder);
  }

  else if (player.level >= 68
  && player.jobDetail.blackMana + 4 >= 43
  && player.jobDetail.whiteMana + 15 > player.jobDetail.blackMana + 4
  && statustime.impactful) {
    addIcon(id.hardcast,icon.impact);
    addIcon(id.dualcast,icon.veraero);
  }

  else if (player.level >= 70
  && player.jobDetail.whiteMana >= 43
  && player.jobDetail.blackMana + 11 > player.jobDetail.whiteMana
  && !cooldowntime.swiftcast || cooldowntime.swiftcast - Date.now() < 0) {
    addIcon(id.hardcast,icon.swiftcast);
    addIcon(id.dualcast,icon.verthunder);
  }

  else if (player.level >= 68
  && player.jobDetail.blackMana >= 43
  && player.jobDetail.whiteMana + 11 > player.jobDetail.blackMana
  && !cooldowntime.swiftcast || cooldowntime.swiftcast - Date.now() < 0) {
    addIcon(id.hardcast,icon.swiftcast);
    addIcon(id.dualcast,icon.veraero);
  }

  else if (player.level >= 70
  && player.jobDetail.whiteMana + 3 >= 43
  && player.jobDetail.blackMana + 14 > player.jobDetail.whiteMana + 3) {
    addIcon(id.hardcast,icon.jolt);
    addIcon(id.dualcast,icon.verthunder);
  }

  else if (player.level >= 68
  && player.jobDetail.blackMana + 3 >= 43
  && player.jobDetail.whiteMana + 14 > player.jobDetail.blackMana + 3) {
    addIcon(id.hardcast,icon.jolt);
    addIcon(id.dualcast,icon.veraero);
  }

  // Regular combo prep - priorty is Verholy

  // Delay combo if both procs are up

  else if (player.level >= 70
  && player.jobDetail.whiteMana + 9 >= 89
  && Math.min(player.jobDetail.blackMana + 11, 100) > player.jobDetail.whiteMana + 9
  && statustime.verstoneready) {
    addIcon(id.hardcast,icon.verstone);
    addIcon(id.dualcast,icon.verthunder);
  }

  else if (player.level >= 68
  && player.jobDetail.blackMana + 9 >= 89
  && Math.min(player.jobDetail.whiteMana + 11, 100) > player.jobDetail.blackMana + 9
  && statustime.verfireready) {
    addIcon(id.hardcast,icon.verfire);
    addIcon(id.dualcast,icon.veraero);
  }

  // Start combo ASAP if proc available

  else if (player.level >= 70
  && player.jobDetail.whiteMana + 9 >= 80
  && Math.min(player.jobDetail.blackMana + 11, 100) > player.jobDetail.whiteMana + 9
  && statustime.verstoneready
  && !statustime.verfireready) {
    addIcon(id.hardcast,icon.verstone);
    addIcon(id.dualcast,icon.verthunder);
  }

  else if (player.level >= 68
  && player.jobDetail.blackMana + 9 >= 80
  && Math.min(player.jobDetail.whiteMana + 11, 100) > player.jobDetail.blackMana + 9
  && statustime.verfireready
  && !statustime.verstoneready) {
    addIcon(id.hardcast,icon.verfire);
    addIcon(id.dualcast,icon.veraero);
  }

  else if (player.level >= 70
  && player.jobDetail.whiteMana + 4 >= 80
  && Math.min(player.jobDetail.blackMana + 11, 100) > player.jobDetail.whiteMana + 4
  && statustime.impactful - Date.now() < 20000) {
    addIcon(id.hardcast,icon.impact);
    addIcon(id.dualcast,icon.verthunder);
  }

  else if (player.level >= 68
  && player.jobDetail.blackMana + 4 >= 80
  && Math.min(player.jobDetail.whiteMana + 11, 100) > player.jobDetail.blackMana + 4
  && statustime.impactful - Date.now() < 20000) {
    addIcon(id.hardcast,icon.impact);
    addIcon(id.dualcast,icon.veraero);
  }

  else if (player.level >= 70
  && player.jobDetail.whiteMana >= 80
  && Math.min(player.jobDetail.blackMana + 11, 100) > player.jobDetail.whiteMana
  && !cooldowntime.swiftcast || cooldowntime.swiftcast <= Date.now()) {
    addIcon(id.hardcast,icon.swiftcast);
    addIcon(id.dualcast,icon.verthunder);
  }

  else if (player.level >= 68
  && player.jobDetail.blackMana >= 80
  && Math.min(player.jobDetail.whiteMana + 11, 100) > player.jobDetail.blackMana
  && !cooldowntime.swiftcast || cooldowntime.swiftcast <= Date.now()) {
    addIcon(id.hardcast,icon.swiftcast);
    addIcon(id.dualcast,icon.veraero);
  }

  else if (player.level >= 70
  && player.jobDetail.whiteMana + 4 >= 80
  && Math.min(player.jobDetail.blackMana + 11, 100) > player.jobDetail.whiteMana + 4
  && statustime.impactful) {
    addIcon(id.hardcast,icon.impact);
    addIcon(id.dualcast,icon.verthunder);
  }

  else if (player.level >= 68
  && player.jobDetail.blackMana + 4 >= 80
  && Math.min(player.jobDetail.whiteMana + 11, 100) > player.jobDetail.blackMana + 4
  && statustime.impactful) {
    addIcon(id.hardcast,icon.impact);
    addIcon(id.dualcast,icon.veraero);
  }

  else if (player.level >= 70
  && player.jobDetail.whiteMana + 3 >= 80
  && Math.min(player.jobDetail.blackMana + 11, 100) > player.jobDetail.whiteMana + 3) {
    addIcon(id.hardcast,icon.jolt);
    addIcon(id.dualcast,icon.verthunder);
  }

  else if (player.level >= 68
  && player.jobDetail.blackMana + 3 >= 80
  && Math.min(player.jobDetail.whiteMana + 11, 100) > player.jobDetail.blackMana + 3) {
    addIcon(id.hardcast,icon.jolt);
    addIcon(id.dualcast,icon.veraero);
  }

  // Normal Dualcasts

  else if (statustime.impactful - Date.now() < 10000) {

    addIcon(id.hardcast,icon.impact);

    if (statustime.verfire
    && Math.min(player.jobDetail.whiteMana + 15, 100) - Math.min(player.jobDetail.blackMana + 4, 100) <= 30)
    {
      addIcon(id.dualcast,icon.veraero);
    }

    else if (statustime.verstone
    && Math.min(player.jobDetail.blackMana + 15, 100) - Math.min(player.jobDetail.whiteMana + 4, 100) <= 30)
    {
      addIcon(id.dualcast,icon.verthunder);
    }

    else if (player.jobDetail.blackMana >= player.jobDetail.whiteMana) {
      addIcon(id.dualcast,icon.veraero);
    }

    else {
      addIcon(id.dualcast,icon.verthunder);
    }
  }

  else if (statustime.verfireready && statustime.verstoneready) {

    if (player.jobDetail.blackMana >= player.jobDetail.whiteMana) {
      addIcon(id.hardcast,icon.verstone);
      addIcon(id.dualcast,icon.veraero);
    }
    else {
      addIcon(id.hardcast,icon.verfire);
      addIcon(id.dualcast,icon.verthunder);
    }
  }

  else if (statustime.verfireready) {

    if (Math.min(player.jobDetail.blackMana + 9, 100) - player.jobDetail.whiteMana > 30) {
      if (statustime.impactful) {
        addIcon(id.hardcast,icon.impact);
      }
      else {
        addIcon(id.hardcast,icon.jolt);
      }
      addIcon(id.dualcast,icon.veraero);
    }

    else if (player.jobDetail.blackMana + 9 == player.jobDetail.whiteMana + 11) {
      if (statustime.impactful) {
        addIcon(id.hardcast,icon.impact);
      }
      else {
        addIcon(id.hardcast,icon.jolt);
      }
      addIcon(id.dualcast,icon.veraero);
    }

    else if (player.jobDetail.blackMana + 9 < player.jobDetail.whiteMana) {
      addIcon(id.hardcast,icon.verfire);
      addIcon(id.dualcast,icon.verthunder);
    }

    else {
      addIcon(id.hardcast,icon.verfire);
      addIcon(id.dualcast,icon.veraero);
    }
  }

  else if (statustime.verstoneready) {

    if (Math.min(player.jobDetail.whiteMana + 9, 100) - player.jobDetail.blackMana > 30) {

      if (statustime.impactful) {
        addIcon(id.hardcast,icon.impact);
      }
      else {
        addIcon(id.hardcast,icon.jolt);
      }
      addIcon(id.dualcast,icon.verthunder);
    }

    else if (player.jobDetail.whiteMana + 9 == player.jobDetail.blackMana + 11) {

      if (statustime.impactful) {
        addIcon(id.hardcast,icon.impact);
      }
      else {
        addIcon(id.hardcast,icon.jolt);
      }
      addIcon(id.dualcast,icon.verthunder);
    }

    else if (player.jobDetail.whiteMana + 9 < player.jobDetail.blackMana) {
      addIcon(id.hardcast,icon.verstone);
      addIcon(id.dualcast,icon.veraero);
    }

    else {
      addIcon(id.hardcast,icon.verstone);
      addIcon(id.dualcast,icon.verthunder);
    }
  }

  else if (!cooldowntime.swiftcast || cooldowntime.swiftcast <= Date.now()) {

    addIcon(id.hardcast,icon.swiftcast);

    if (player.jobDetail.blackMana + 11 == player.jobDetail.whiteMana) {
      addIcon(id.dualcast,icon.veraero);
    }

    else if (player.jobDetail.blackMana == player.jobDetail.whiteMana + 11) {
      addIcon(id.dualcast,icon.verthunder);
    }

    else if (player.jobDetail.blackMana >= player.jobDetail.whiteMana) {
      addIcon(id.dualcast,icon.veraero);
    }

    else {
      addIcon(id.dualcast,icon.verthunder);
    }
  }

  else {
    if (statustime.impactful) {
      addIcon(id.hardcast,icon.impact);
    }
    else {
      addIcon(id.hardcast,icon.jolt);
    }
    if (player.jobDetail.blackMana >= player.jobDetail.whiteMana) {
      addIcon(id.dualcast,icon.veraero);
    }
    else {
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

  if (player.level >= 70
  && player.jobDetail.whiteMana < player.jobDetail.blackMana
  && !statustime.verstoneready) {
    addIcon(id.verholy,icon.verholy);
  }

  else if (player.level >= 68
  && player.jobDetail.blackMana < player.jobDetail.whiteMana
  && !statustime.verfireready) {
    addIcon(id.verflare,icon.verflare);
  }

  else if (player.level >= 70) {
    addIcon(id.verholy,icon.verholy);
  }

  else if (player.level >= 68) {
    addIcon(id.verflare,icon.verflare);
  }
}
