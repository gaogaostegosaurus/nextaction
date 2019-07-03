"use strict";

actionList.rdm = [

  "Corps-A-Corps", "Displacement", "Fleche", "Contre Sixte", "Acceleration", "Manafication",

  "Riposte", "Zwerchhau", "Redoublement", "Moulinet", "Reprise",
  "Enchanted Riposte", "Enchanted Zwerchhau", "Enchanted Redoublement", "Enchanted Moulinet", "Enchanted Reprise",
  "Verflare", "Verholy", "Scorch",

  "Jolt", "Verfire", "Verstone", "Jolt II", "Verthunder", "Veraero",
  "Verthunder II", "Veraero II", "Impact", "Scatter",

  "Swiftcast", "Lucid Dreaming"
];

id.riposte = "1";
id.moulinet = id.riposte;
id.zwerchhau = "2";
id.redoublement = "3";
id.verflare = "4";
id.verholy = id.verflare;
id.hardcast = "5";
id.dualcast = "6";

id.manafication = "11";
id.fleche = "12";
id.contresixte = "13";
id.acceleration = "14";
id.corpsacorps = "15";
id.displacement = "16";

recast.corpsacorps = 40000;
recast.displacement = 35000;
recast.fleche = 25000;
recast.acceleration = 35000;
recast.contresixte = 45000;
recast.embolden = 120000;
recast.manafication = 120000;


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

  if (player.level >= 62) {
    icon.jolt = icon.jolt2;
  }
  else {
    icon.jolt = "003202";
  }

  if (player.level >= 66) {
    icon.scatter = icon.impact;
  }
  else {
    icon.scatter = "003207";
  }

  // Lucid Dreaming Low MP

  if (player.currentMP / player.maxMP < 0.85
  && checkCooldown("luciddreaming", player.name) < 0) {
    addIconBlink(id.luciddreaming,icon.luciddreaming);
  }
  else {
    removeIcon(id.luciddreaming);
  }

  if (player.level >= 74) {
    recast.manafication = 110000;
  }
}

// Checks and activates things when entering combat
function rdmInCombatChangedEvent(e) {

  if (player.level >= 6
  && checkCooldown("corpsacorps", player.name) < 0) {
    addIconBlink(id.corpsacorps,icon.corpsacorps);
  }
  if (player.level >= 40
  && checkCooldown("displacement", player.name) < 0) {
    addIconBlink(id.displacement,icon.displacement);
  }
  if (player.level >= 45
  && checkCooldown("fleche", player.name) < 0) {
    addIconBlink(id.fleche,icon.fleche);
  }
  if (player.level >= 50
  && checkCooldown("acceleration", player.name) < 0) {
    addIconBlink(id.acceleration,icon.acceleration);
  }
  if (player.level >= 56
  && checkCooldown("contresixte", player.name) < 0) {
    addIconBlink(id.contresixte,icon.contresixte);
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
      addIconBlinkTimeout("acceleration",recast.acceleration,id.acceleration,icon.acceleration);
    }

    else if (logLine[3] == "Contre Sixte") {
      addCooldown("contresixte", player.name, recast.contresixte);
      removeIcon(id.contresixte);
      addIconBlinkTimeout("contresixte",recast.contresixte,id.contresixte,icon.contresixte);
    }

    else if (logLine[3] == "Corps-A-Corps") {
      addCooldown("corpsacorps", player.name, recast.corpsacorps);
      removeIcon(id.corpsacorps);
      addIconBlinkTimeout("corpsacorps",recast.corpsacorps,id.corpsacorps,icon.corpsacorps);
    }

    else if (logLine[3] == "Displacement") {
      addCooldown("displacement", player.name, recast.displacement);
      removeIcon(id.displacement);
      addIconBlinkTimeout("displacement",recast.displacement,id.displacement,icon.displacement);
    }

    else if (logLine[3] == "Fleche") {
      addCooldown("fleche", player.name, recast.fleche);
      removeIcon(id.fleche);
      addIconBlinkTimeout("fleche",recast.fleche,id.fleche,icon.fleche);
    }

    else if (logLine[3] == "Embolden") {
    }

    else if (logLine[3] == "Swiftcast") {
      addCooldown("swiftcast", player.name, recast.swiftcast);
    }

    else if (logLine[3] == "Lucid Dreaming") {
      removeIcon(id.luciddreaming);
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


      if (logLine[3] == "Verfire") {
        removeStatus("verfireready", player.name)
      }

      else if (logLine[3] == "Verstone") {
        removeStatus("verstoneready", player.name)
      }

      else if (logLine[3] == "Manafication") {
        addCooldown("manafication", player.name, recast.manafication);
        clearTimeout(timeout.corpsacorps);
        clearTimeout(timeout.displacement);
        addIconBlink(id.corpsacorps,icon.corpsacorps);
        addIconBlink(id.displacement,icon.displacement);
        removeIcon(id.manafication);
        rdmDualcast();
      }
    }
  }
}


function rdmStatus(logLine) {

  // addText("debug1", logLine[1] + " " + logLine[2] + " " + logLine[3]);

  // To anyone from anyone (non-stacking)

  if (logLine[3] == "non-stacking status") { }

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

  // else if (logLine[1] != player.name
  // && logLine[4] == player.name) {
  //
  //   if (logLine[3] == "test") {
  //     if (logLine[2] == "gains") {
  //     }
  //     else if (logLine[2] == "loses") {
  //     }
  //   }
  // }
}

function rdmDualcast() {

  removeIcon(id.hardcast);
  removeIcon(id.dualcast);
  removeIcon(id.riposte);
  removeIcon(id.zwerchhau);
  removeIcon(id.redoublement);
  removeIcon(id.verflare);

  rdmManafication();

  // AoE toggle

  if (player.level >= 22
  && toggle.aoe) {

    if (player.jobDetail.blackMana < player.jobDetail.whiteMana) {
      addIcon(id.hardcast, icon.verthunder2);
      addIcon(id.dualcast, icon.scatter);
    }
    else {
      addIcon(id.hardcast, icon.veraero2);
      addIcon(id.dualcast, icon.scatter);
    }
    if (Math.min(player.jobDetail.blackMana < player.jobDetail.whiteMana) >= 20
    && !toggle.manafication) {
      addIcon(id.riposte, icon.moulinet);
    }
  }

  // Check for ideal combo situations

  else if (player.level >= 70
  && Math.min(player.jobDetail.blackMana, player.jobDetail.whiteMana) >= 80
  && player.jobDetail.blackMana > player.jobDetail.whiteMana
  && checkStatus("verstoneready", player.name) < 0) {
    addText("debug1", "Start combo - Verholy (100% proc)");
    rdmHolyCombo();
  }

  else if (player.level >= 68
  && Math.min(player.jobDetail.blackMana, player.jobDetail.whiteMana) >= 80
  && player.jobDetail.whiteMana > player.jobDetail.blackMana
  && checkStatus("verfireready", player.name) < 0) {
    addText("debug1", "Start combo - Verflare (100% proc)");
    rdmFlareCombo();
  }

  // No fancy stuff before 68

  else if (player.level < 68
  && Math.min(player.jobDetail.blackMana, player.jobDetail.whiteMana) >= 80) {
    addText("debug1", "Start combo");
    rdmCombo();
  }

  else {

    // Weigh value for possible cast options

    next.dualcast = [0, 0, 0, 0, 0, 0, 0, 0];
    // [0] J+VT, [1] J+VA, [2] VF+VT, [3] VF+VA, [4] VS+VT, [5] VS+VA, [6] SC+VT, [7] SC+VA
    next.dualcast[0] = rdmDualcastValue("Jolt", "Verthunder", 14, 3, toggle.manafication);
    next.dualcast[1] = rdmDualcastValue("Jolt", "Veraero", 3, 14, toggle.manafication);

    if (checkStatus("verfireready", player.name) > 5000) {
      next.dualcast[2] = rdmDualcastValue("Verfire", "Verthunder", 20, 0, toggle.manafication);
      next.dualcast[3] = rdmDualcastValue("Verfire", "Veraero", 9, 11, toggle.manafication);
    }
    else {
      next.dualcast[2] = -1000;
      next.dualcast[3] = -1000;
    }

    if (checkStatus("verstoneready", player.name) > 5000) {
      next.dualcast[4] = rdmDualcastValue("Verstone", "Verthunder", 11, 9, toggle.manafication);
      next.dualcast[5] = rdmDualcastValue("Verstone", "Veraero", 0, 20, toggle.manafication);
    }
    else {
      next.dualcast[4] = -1000;
      next.dualcast[5] = -1000;
    }

    if (player.level >= 18
    && checkCooldown("swiftcast", player.name) < 0) {
      next.dualcast[6] = rdmDualcastValue("Swiftcast", "Verthunder", 11, 0, toggle.manafication);
      next.dualcast[7] = rdmDualcastValue("Swiftcast", "Veraero", 0, 11, toggle.manafication);
    }
    else {
      next.dualcast[6] = -1000;
      next.dualcast[7] = -1000;
    }

    var max = next.dualcast[0];
    var maxIndex = 0;

    for (var i = 1; i < next.dualcast.length; i++) {
      if (next.dualcast[i] > max) {
          maxIndex = i;
          max = next.dualcast[i];
      }
    }

    if (maxIndex == 0) {
      addIcon(id.hardcast, icon.jolt);
      addIcon(id.dualcast, icon.verthunder);
    }
    else if (maxIndex == 1) {
      addIcon(id.hardcast, icon.jolt);
      addIcon(id.dualcast, icon.veraero);
    }
    else if (maxIndex == 2) {
      addIcon(id.hardcast, icon.verfire);
      addIcon(id.dualcast, icon.verthunder);
    }
    else if (maxIndex == 3) {
      addIcon(id.hardcast, icon.verfire);
      addIcon(id.dualcast, icon.veraero);
    }
    else if (maxIndex == 4) {
      addIcon(id.hardcast, icon.verstone);
      addIcon(id.dualcast, icon.verthunder);
    }
    else if (maxIndex == 5) {
      addIcon(id.hardcast, icon.verstone);
      addIcon(id.dualcast, icon.veraero);
    }
    else if (maxIndex == 6) {
      addIcon(id.hardcast, icon.swiftcast);
      addIcon(id.dualcast, icon.verthunder);
    }
    else if (maxIndex == 7) {
      addIcon(id.hardcast, icon.swiftcast);
      addIcon(id.dualcast, icon.veraero);
    }

    // addText("debug1", "Index: " + maxIndex + "  Value: " + max);
    addText("debug1",  "J+VT:"  + next.dualcast[0] + " J+VA:"  + next.dualcast[1]
                    + " VF+VT:" + next.dualcast[2] + " VF+VA:" + next.dualcast[3]
                    + " VS+VT:" + next.dualcast[4] + " VS+VA:" + next.dualcast[5]
                    + " SC+VT:" + next.dualcast[6] + " SC+VA:" + next.dualcast[7]);
    // If all options suck, reset?

  }
}

function rdmDualcastValue(hardcastaction, dualcastaction, black, white, manafication) {

  // Calculates mana after dualcast and manafication
  if (manafication) {
    next.blackMana = Math.min(2 * (player.jobDetail.blackMana + black), 100);
    next.whiteMana = Math.min(2 * (player.jobDetail.whiteMana + white), 100);
  }

  // Calculates mana after dualcast (no manafication)
  else {
    next.blackMana = Math.min(player.jobDetail.blackMana + black, 100);
    next.whiteMana = Math.min(player.jobDetail.whiteMana + white, 100);
  }

  // Initial value - small bonus for smaller differences
  var value = next.blackMana + next.whiteMana + (30 - Math.abs(next.blackMana - next.whiteMana));

  // Penalizes overcapping
  if (manafication == 1) {
    value = value - (Math.max(2 * (player.jobDetail.blackMana + black), 100) - 100) * 2;
    value = value - (Math.max(2 * (player.jobDetail.whiteMana + white), 100) - 100) * 2;
  }
  else {
    value = value - (Math.max(player.jobDetail.blackMana + black, 100) - 100) * 2;
    value = value - (Math.max(player.jobDetail.whiteMana + white, 100) - 100) * 2;
  }

  // Penalizes unbalanced
  if (Math.abs(next.blackMana - next.whiteMana) > 30) {
    value = value - 1000;
  }

  // Penalizes unbalanced upon Verfire/Verstone
  else if (hardcastaction == "Verfire"
  && Math.abs(Math.min(player.jobDetail.blackMana + 9, 100) - player.jobDetail.whiteMana) > 30) {
    value = value - 1000;
  }
  else if (hardcastaction == "Verstone"
  && Math.abs(player.jobDetail.blackMana - Math.min(player.jobDetail.whiteMana + 9, 100)) > 30) {
    value = value - 1000;
  }

  // Penalizes overwriting

  if (dualcastaction == "Verthunder"
  && hardcastaction != "Verfire"
  && checkStatus("verfireready", player.name) >= 5000) {
    value = value - 100;
  }
  else if (dualcastaction == "Veraero"
  && hardcastaction != "Verstone"
  && checkStatus("verstoneready", player.name) >= 5000) {
    value = value - 100;
  }

  // Priority to Verfire, Verstone, and Swiftcast
  if (hardcastaction == "Verfire" || hardcastaction == "Verstone") {
    value = value + 10;
  }
  else if (checkStatus("verfireready", player.name) < 5000
  && checkStatus("verstoneready", player.name) < 5000
  && hardcastaction == "Swiftcast") {
    value = value + 20;
  }

  // Looks for fix above 80/80
  if (Math.min(player.jobDetail.blackMana, player.jobDetail.whiteMana) >= 80) {

    if (player.level >= 70
    && next.blackMana > next.whiteMana
    && (checkStatus("verstoneready", player.name) < 5000 || hardcastaction == "Verstone")
    && dualcastaction != "Veraero") {
      value = value + 1000; // Sets up for 100% proc Verholy
    }

    else if (player.level >= 68
    && next.blackMana < next.whiteMana
    && (checkStatus("verfireready", player.name) < 5000 || hardcastaction == "Verfire")
    && dualcastaction != "Verthunder") {
      value = value + 1000; // Sets up for 100% proc Verflare
    }

    else if (player.level >= 70
    && next.blackMana <= next.whiteMana
    && (checkStatus("verstoneready", player.name) < 5000 || hardcastaction == "Verstone")
    && dualcastaction != "Veraero") {
      value = value + 100; // Sets up for 20% proc Verholy
    }

    else if (player.level >= 68
    && next.blackMana >= next.whiteMana
    && (checkStatus("verfireready", player.name) < 5000 || hardcastaction == "Verfire")
    && dualcastaction != "Verthunder") {
      value = value + 100; // Sets up for 20% proc Verflare
    }

    else {
      value = value // He's dead Jim
    }
  }

  // Looks for combo after dualcast
  else if (Math.min(next.blackMana, next.whiteMana) >= 80) {

    if (player.level >= 70
    && next.blackMana > next.whiteMana
    && (checkStatus("verstoneready", player.name) < 5000 || hardcastaction == "Verstone")
    && dualcastaction != "Veraero") {
      value = value + 1000; // Sets up for 100% proc Verholy
    }

    else if (player.level >= 68
    && next.blackMana < next.whiteMana
    && (checkStatus("verfireready", player.name) < 5000 || hardcastaction == "Verfire")
    && dualcastaction != "Verthunder") {
      value = value + 1000; // Sets up for 100% proc Verflare
    }

    // else if (player.level >= 70
    // && next.whiteMana + 21 - next.blackMana <= 30
    // && (checkStatus("verstoneready", player.name) < 5000 || hardcastaction == "Verstone")
    // && dualcastaction != "Veraero") {
    //   value = value + 100; // Sets up for 20% proc Verholy
    // }
    //
    // else if (player.level >= 68
    // && next.blackMana + 21 - next.whiteMana <= 30
    // && (checkStatus("verfireready", player.name) < 5000 || hardcastaction == "Verfire")
    // && dualcastaction != "Verthunder") {
    //   value = value + 100; // Sets up for 20% proc Verflare
    // }

    else {
      value = value + 10; // Will get mana above 80/80 (hopefully to fix)
    }
  }

  return value;
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

function rdmManafication() {

  if (player.level >= 60
  && checkCooldown("manafication", player.name) < 0
  && !toggle.combo) {

    // Don't use Manafication if more than 28 away from 50/50
    if (Math.abs(player.jobDetail.blackMana - 50) + Math.abs(player.jobDetail.whiteMana - 50) > 28) {
      removeIcon(id.manafication);
      delete toggle.manafication;
    }

    // Use if able to get 5x Moulinet for AOE
    else if (toggle.aoe
    && Math.min(player.jobDetail.blackMana, player.jobDetail.whiteMana) >= 50) {
      addIconBlink(id.manafication,icon.manafication);
      toggle.manafication = Date.now();
    }

    // Early Manafication if able to proc from Verholy
    else if (player.level >= 70
    && Math.min(player.jobDetail.blackMana, player.jobDetail.whiteMana) >= 43
    && player.jobDetail.whiteMana < 50
    && player.jobDetail.blackMana > player.jobDetail.whiteMana
    && checkStatus("verstoneready", player.name) < 2500) {
      addIconBlink(id.manafication,icon.manafication);
      toggle.manafication = Date.now();
    }

    // Early Manafication if able to proc from Verflare
    else if (player.level >= 68
    && Math.min(player.jobDetail.blackMana, player.jobDetail.whiteMana) >= 43
    && player.jobDetail.blackMana < 50
    && player.jobDetail.whiteMana > player.jobDetail.blackMana
    && checkStatus("verfireready", player.name) < 2500) {
      addIconBlink(id.manafication,icon.manafication);
      toggle.manafication = Date.now();
    }

    // Use if otherwise over 45/45
    else if (player.level >= 60
    && Math.min(player.jobDetail.blackMana, player.jobDetail.whiteMana) >= 45) {
      addIconBlink(id.manafication,icon.manafication);
      toggle.manafication = Date.now();
    }

    else {
      // Hide otherwise?
      removeIcon(id.manafication);
      delete toggle.manafication;
    }
  }
  else {
    // Hide otherwise?
    removeIcon(id.manafication);
    delete toggle.manafication;
  }
}
