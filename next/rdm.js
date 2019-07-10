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

function rdmJobChange() {

  id.luciddreaming = 0;
  id.riposte = 1;
  id.moulinet = id.riposte;
  id.zwerchhau = 2;
  id.redoublement = 3;
  id.verflare = 4;
  id.verholy = id.verflare;
  id.scorch = 5;
  id.hardcast = 6;
  id.dualcast = 7;

  id.manafication = 11;
  id.fleche = 12;
  id.contresixte = 13;
  id.acceleration = 14;
  id.corpsacorps = 15;
  id.displacement = 16;

  // Make modifications depending on traits

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

  if (player.level >= 74) {
    recast.manafication = 110000;
  }
  else {
    recast.manafication = 120000;
  }

  if (player.level >= 78) {
    recast.contresixte = 35000;
  }
  else {
    recast.contresixte = 45000;
  }

  // Create cooldown notifications

  if (player.level >= 6
  && checkCooldown("corpsacorps", player.ID) < 0) {
    addIconBlink(id.corpsacorps,icon.corpsacorps);
  }
  if (player.level >= 40
  && checkCooldown("displacement", player.ID) < 0) {
    addIconBlink(id.displacement,icon.displacement);
  }
  if (player.level >= 45
  && checkCooldown("fleche", player.ID) < 0) {
    addIconBlink(id.fleche,icon.fleche);
  }
  if (player.level >= 50
  && checkCooldown("acceleration", player.ID) < 0) {
    addIconBlink(id.acceleration,icon.acceleration);
  }
  if (player.level >= 56
  && checkCooldown("contresixte", player.ID) < 0) {
    addIconBlink(id.contresixte,icon.contresixte);
  }

}

function rdmPlayerChangedEvent() {

  // Lucid Dreaming
  if (player.currentMP / player.maxMP < 0.85
  && checkCooldown("luciddreaming", player.ID) < 0) {
    addIconBlink(id.luciddreaming,icon.luciddreaming);
  }
  else {
    removeIcon(id.luciddreaming);
  }
}

function rdmAction() {

  if (actionList.rdm.indexOf(actionGroups.actionname) > -1) {

    removeText("loadmessage");

    // AoE toggle
    if (["Verthunder II", "Veraero II", "Enchanted Moulinet"].indexOf(actionGroups.actionname) > -1) {
      toggle.aoe = Date.now();
    }
    else if (["Jolt", "Verfire", "Verstone", "Jolt II", "Verthunder", "Veraero", "Enchanted Riposte", "Enchanted Zwerchhau", "Enchanted Redoublement", "Verflare", "Verholy", "Scorch"].indexOf(actionGroups.actionname) > -1) {
      // Does "Enchanted Reprise" go here too?
      delete toggle.aoe;
    }

    // These actions don't interrupt combos

    if (actionGroups.actionname == "Acceleration") {
      addCooldown("acceleration", player.ID, recast.acceleration);
      removeIcon(id.acceleration);
      addIconBlinkTimeout("acceleration",recast.acceleration,id.acceleration,icon.acceleration);
    }

    else if (actionGroups.actionname == "Contre Sixte") {
      addCooldown("contresixte", player.ID, recast.contresixte);
      removeIcon(id.contresixte);
      addIconBlinkTimeout("contresixte",recast.contresixte,id.contresixte,icon.contresixte);
    }

    else if (actionGroups.actionname == "Corps-A-Corps") {
      addCooldown("corpsacorps", player.ID, recast.corpsacorps);
      removeIcon(id.corpsacorps);
      addIconBlinkTimeout("corpsacorps",recast.corpsacorps,id.corpsacorps,icon.corpsacorps);
    }

    else if (actionGroups.actionname == "Displacement") {
      addCooldown("displacement", player.ID, recast.displacement);
      removeIcon(id.displacement);
      addIconBlinkTimeout("displacement",recast.displacement,id.displacement,icon.displacement);
    }

    else if (actionGroups.actionname == "Fleche") {
      addCooldown("fleche", player.ID, recast.fleche);
      removeIcon(id.fleche);
      addIconBlinkTimeout("fleche",recast.fleche,id.fleche,icon.fleche);
    }

    // else if (actionGroups.actionname == "Embolden") {
    //   addCooldown("embolden", player.ID, recast.embolden);
    //   removeIcon(id.embolden);
    //   addIconBlinkTimeout("fleche",recast.embolden,id.embolden,icon.embolden);
    // }

    else if (actionGroups.actionname == "Swiftcast") {
      addCooldown("swiftcast", player.ID, recast.swiftcast);
    }

    else if (actionGroups.actionname == "Lucid Dreaming") {
      removeIcon(id.luciddreaming);
      addCooldown("luciddreaming", player.ID, recast.luciddreaming);
    }

    // Combo actions

    else if (actionGroups.actionname == "Enchanted Riposte") {
      removeIcon(id.riposte);
    }

    else if (actionGroups.actionname == "Enchanted Zwerchhau") {
      removeIcon(id.zwerchhau);
      if (player.level < 50) {
        delete toggle.combo;
        rdmDualcast();
      }
    }

    else if (actionGroups.actionname == "Enchanted Redoublement") {
      removeIcon(id.redoublement);
      if (player.level < 68) {
        delete toggle.combo;
        rdmDualcast();
      }
    }

    else if (actionGroups.actionname == "Verflare") {
      removeIcon(id.verflare);
      if (player.level < 80) {
        delete toggle.combo;
        rdmDualcast();
      }
    }

    else if (actionGroups.actionname == "Verholy") {
      removeIcon(id.verholy);
      if (player.level < 80) {
        delete toggle.combo;
        rdmDualcast();
      }
    }

    else if (actionGroups.actionname == "Scorch") {
      removeIcon(id.scorch);
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

      if (actionGroups.actionname == "Verfire") {
        removeStatus("verfireready", player.ID)
      }

      else if (actionGroups.actionname == "Verstone") {
        removeStatus("verstoneready", player.ID)
      }

      else if (actionGroups.actionname == "Manafication") {
        addCooldown("manafication", player.ID, recast.manafication);
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

function rdmStatus() {

  if (statusGroups.targetID == player.ID) {

    if (statusGroups.statusname == "Dualcast") {
      if (statusGroups.gainsloses == "gains") {
        addStatus("dualcast", player.ID, parseInt(statusGroups.duration) * 1000);
        removeIcon(id.hardcast);
      }
      else if (statusGroups.gainsloses == "loses") {
        removeStatus("dualcast", player.ID);
        rdmDualcast();
      }
    }

    else if (statusGroups.statusname == "Verfire Ready") {
      if (statusGroups.gainsloses == "gains") {
        addStatus("verfireready", player.ID, parseInt(statusGroups.duration) * 1000);
        rdmDualcast();
      }
      else if (statusGroups.gainsloses == "loses") {
        removeStatus("verfireready", player.ID)
      }
    }

    else if (statusGroups.statusname == "Verstone Ready") {
      if (statusGroups.gainsloses == "gains") {
        addStatus("verstoneready", player.ID, parseInt(statusGroups.duration) * 1000);
        rdmDualcast();
      }
      else if (statusGroups.gainsloses == "loses") {
        removeStatus("verstoneready", player.ID)
      }
    }

    else if (statusGroups.statusname == "Swiftcast") {
      if (statusGroups.gainsloses == "gains") {
        addStatus("swiftcast", player.ID, parseInt(statusGroups.duration) * 1000);
        removeIcon(id.hardcast);
      }
      else if (statusGroups.gainsloses == "loses") {
        removeStatus("swiftcast", player.ID);
        rdmDualcast();
      }
    }
  }
}

function rdmDualcast() {

  if (!toggle.combo) {

    removeIcon(id.hardcast);
    removeIcon(id.dualcast);
    removeIcon(id.riposte);
    removeIcon(id.zwerchhau);
    removeIcon(id.redoublement);
    removeIcon(id.verflare);
    removeIcon(id.scorch);

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
    && checkStatus("verstoneready", player.ID) < 0) {
      addText("debug1", "Start combo - Verholy (100% proc)");
      rdmHolyCombo();
    }

    else if (player.level >= 68
    && Math.min(player.jobDetail.blackMana, player.jobDetail.whiteMana) >= 80
    && player.jobDetail.whiteMana > player.jobDetail.blackMana
    && checkStatus("verfireready", player.ID) < 0) {
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
      next.dualcast[0] = rdmDualcastValue("Jolt", "Verthunder", 14, 3, toggle.manafication);
      next.dualcast[1] = rdmDualcastValue("Jolt", "Veraero", 3, 14, toggle.manafication);

      if (checkStatus("verfireready", player.ID) > 5000) {
        next.dualcast[2] = rdmDualcastValue("Verfire", "Verthunder", 20, 0, toggle.manafication);
        next.dualcast[3] = rdmDualcastValue("Verfire", "Veraero", 9, 11, toggle.manafication);
      }
      else {
        next.dualcast[2] = -1000;
        next.dualcast[3] = -1000;
      }

      if (checkStatus("verstoneready", player.ID) > 5000) {
        next.dualcast[4] = rdmDualcastValue("Verstone", "Verthunder", 11, 9, toggle.manafication);
        next.dualcast[5] = rdmDualcastValue("Verstone", "Veraero", 0, 20, toggle.manafication);
      }
      else {
        next.dualcast[4] = -1000;
        next.dualcast[5] = -1000;
      }

      if (player.level >= 18
      && checkCooldown("swiftcast", player.ID) < 0) {
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

      // Debug to check values
      addText("debug2", "Jolt + Verthunder:"  + next.dualcast[0]);
      addText("debug3", "Jolt + Veraero:"  + next.dualcast[1]);
      addText("debug4", "Verfire + Verthunder:" + next.dualcast[2]);
      addText("debug5", "Verfire + Veraero:" + next.dualcast[3]);
      addText("debug6", "Verstone + Verthunder:" + next.dualcast[4]);
      addText("debug7", "Verstone + Veraero:" + next.dualcast[5]);
      addText("debug8", "Swiftcast + Verthunder:" + next.dualcast[6]);
      addText("debug9", "Swiftcast + Veraero:" + next.dualcast[7]);
    }

    clearTimeout(timeout.dualcast);
    timeout.dualcast = setTimeout(rdmDualcastTimeout, 12500);
  }
}

function rdmDualcastTimeout() {
  if (toggle.combat) {
    rdmDualcast();
  }
}



function rdmDualcastValue(hardcastaction, dualcastaction, black, white, manafication) {

  // This function assigns values to various situations.
  // Adjust values to make some situations more (or less) weighted than others.

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
  && checkStatus("verfireready", player.ID) >= 5000) {
    value = value - 100;
  }
  else if (dualcastaction == "Veraero"
  && hardcastaction != "Verstone"
  && checkStatus("verstoneready", player.ID) >= 5000) {
    value = value - 100;
  }

  // Priority to Verfire, Verstone, and Swiftcast
  if (hardcastaction == "Verfire" || hardcastaction == "Verstone") {
    value = value + 10;
  }
  else if (checkStatus("verfireready", player.ID) < 5000
  && checkStatus("verstoneready", player.ID) < 5000
  && hardcastaction == "Swiftcast") {
    value = value + 20;
  }

  // Looks for fix above 80/80
  if (Math.min(player.jobDetail.blackMana, player.jobDetail.whiteMana) >= 80) {

    if (player.level >= 70
    && next.blackMana > next.whiteMana
    && (checkStatus("verstoneready", player.ID) < 5000 || hardcastaction == "Verstone")
    && dualcastaction != "Veraero") {
      value = value + 1000; // Sets up for 100% proc Verholy
    }

    else if (player.level >= 68
    && next.blackMana < next.whiteMana
    && (checkStatus("verfireready", player.ID) < 5000 || hardcastaction == "Verfire")
    && dualcastaction != "Verthunder") {
      value = value + 1000; // Sets up for 100% proc Verflare
    }

    else if (player.level >= 70
    && next.blackMana <= next.whiteMana
    && (checkStatus("verstoneready", player.ID) < 5000 || hardcastaction == "Verstone")
    && dualcastaction != "Veraero") {
      value = value + 100; // Sets up for 20% proc Verholy
    }

    else if (player.level >= 68
    && next.blackMana >= next.whiteMana
    && (checkStatus("verfireready", player.ID) < 5000 || hardcastaction == "Verfire")
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
    && (checkStatus("verstoneready", player.ID) < 5000 || hardcastaction == "Verstone")
    && dualcastaction != "Veraero") {
      value = value + 1000; // Sets up for 100% proc Verholy
    }

    else if (player.level >= 68
    && next.blackMana < next.whiteMana
    && (checkStatus("verfireready", player.ID) < 5000 || hardcastaction == "Verfire")
    && dualcastaction != "Verthunder") {
      value = value + 1000; // Sets up for 100% proc Verflare
    }

    // else if (player.level >= 70
    // && next.whiteMana + 21 - next.blackMana <= 30
    // && (checkStatus("verstoneready", player.ID) < 5000 || hardcastaction == "Verstone")
    // && dualcastaction != "Veraero") {
    //   value = value + 100; // Sets up for 20% proc Verholy
    // }
    //
    // else if (player.level >= 68
    // && next.blackMana + 21 - next.whiteMana <= 30
    // && (checkStatus("verfireready", player.ID) < 5000 || hardcastaction == "Verfire")
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
  if (player.level >= 80) {
    addIcon(id.scorch, icon.scorch);
  }
}

function rdmHolyCombo() {
  rdmCombo();
  addIcon(id.verholy,icon.verholy);
  if (player.level >= 80) {
    addIcon(id.scorch, icon.scorch);
  }
}

// Note to self
// delete toggle.combo; is everywhere because Manafication relies on it to check

function rdmManafication() {

  if (player.level >= 60
  && checkCooldown("manafication", player.ID) < 0
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
    && toggle.aoe
    && Math.min(player.jobDetail.blackMana, player.jobDetail.whiteMana) >= 43
    && player.jobDetail.whiteMana < 50
    && player.jobDetail.blackMana > player.jobDetail.whiteMana
    && checkStatus("verstoneready", player.ID) < 2500) {
      addIconBlink(id.manafication,icon.manafication);
      toggle.manafication = Date.now();
    }

    // Early Manafication if able to proc from Verflare
    else if (player.level >= 68
    && Math.min(player.jobDetail.blackMana, player.jobDetail.whiteMana) >= 43
    && player.jobDetail.blackMana < 50
    && player.jobDetail.whiteMana > player.jobDetail.blackMana
    && checkStatus("verfireready", player.ID) < 2500) {
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
    removeIcon(id.manafication);
    delete toggle.manafication;
  }
}
