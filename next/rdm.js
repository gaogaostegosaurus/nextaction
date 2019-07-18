"use strict";

var procpotency = 20;

var hardcast = [
  "Jolt", 3, 3,
  "Verfire", 9, 0,
  "Verstone", 0, 9,
  "Verthunder II", 7, 0,
  "Veraero II", 0, 7,
  "Swiftcast", 0, 0
  ];
var hardcastarraylength = hardcast.length;
var dualcast = [
  "Verthunder", 11, 0,
  "Veraero", 0, 11,
  "Scatter", 3, 3
];
var dualcastarraylength = dualcast.length;
var i;
var j;

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

  // Set up UI
  nextid.luciddreaming = 0;
  nextid.riposte = 1;
  nextid.moulinet = nextid.riposte;
  nextid.zwerchhau = 2;
  nextid.redoublement = 3;
  nextid.verflare = 4;
  nextid.verholy = nextid.verflare;
  nextid.scorch = 5;
  nextid.hardcast = 6;
  nextid.dualcast = 7;
  nextid.manafication = 11;
  nextid.fleche = 12;
  nextid.contresixte = 13;
  nextid.acceleration = 14;
  nextid.corpsacorps = 15;
  nextid.displacement = 16;

  previous.contresixte = 0;
  previous.verthunder2 = 0;
  previous.veraero2 = 0;
  previous.scatter = 0;
  previous.impact = 0;

  // Set up icons
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

  // Set up traits
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
    addIconBlink(nextid.corpsacorps,icon.corpsacorps);
  }
  if (player.level >= 40
  && checkCooldown("displacement", player.ID) < 0) {
    addIconBlink(nextid.displacement,icon.displacement);
  }
  if (player.level >= 45
  && checkCooldown("fleche", player.ID) < 0) {
    addIconBlink(nextid.fleche,icon.fleche);
  }
  if (player.level >= 50
  && checkCooldown("acceleration", player.ID) < 0) {
    addIconBlink(nextid.acceleration,icon.acceleration);
  }
  if (player.level >= 56
  && checkCooldown("contresixte", player.ID) < 0) {
    addIconBlink(nextid.contresixte,icon.contresixte);
  }

}

function rdmPlayerChangedEvent() {

  // Lucid Dreaming
  if (player.currentMP / player.maxMP < 0.85
  && checkCooldown("luciddreaming", player.ID) < 0) {
    addIconBlink(nextid.luciddreaming,icon.luciddreaming);
  }
  else {
    removeIcon(nextid.luciddreaming);
  }
}

function rdmAction() {

  if (actionList.rdm.indexOf(actionGroups.actionname) > -1) {

    removeText("loadmessage");

    if (["Enchanted Riposte", "Enchanted Zwerchhau", "Enchanted Redoublement", "Verflare", "Verholy", "Scorch"].indexOf(actionGroups.actionname) > -1) {
      // Does "Enchanted Reprise" go here too?
    }

    // These actions don't interrupt combos

    if (actionGroups.actionname == "Acceleration") {
      addCooldown("acceleration", player.ID, recast.acceleration);
      removeIcon(nextid.acceleration);
      addIconBlinkTimeout("acceleration",recast.acceleration,nextid.acceleration,icon.acceleration);
    }

    else if (actionGroups.actionname == "Contre Sixte") {
      addCooldown("contresixte", player.ID, recast.contresixte);
      removeIcon(nextid.contresixte);
      addIconBlinkTimeout("contresixte",recast.contresixte,nextid.contresixte,icon.contresixte);
      if (Date.now() - previous.contresixte > 1000) {
        previous.contresixte = Date.now();
        count.aoe = 1;
      }
      else {
        count.aoe = count.aoe + 1;
      }
    }

    else if (actionGroups.actionname == "Corps-A-Corps") {
      addCooldown("corpsacorps", player.ID, recast.corpsacorps);
      removeIcon(nextid.corpsacorps);
      addIconBlinkTimeout("corpsacorps",recast.corpsacorps,nextid.corpsacorps,icon.corpsacorps);
    }

    else if (actionGroups.actionname == "Displacement") {
      addCooldown("displacement", player.ID, recast.displacement);
      removeIcon(nextid.displacement);
      addIconBlinkTimeout("displacement",recast.displacement,nextid.displacement,icon.displacement);
    }

    else if (actionGroups.actionname == "Fleche") {
      addCooldown("fleche", player.ID, recast.fleche);
      removeIcon(nextid.fleche);
      addIconBlinkTimeout("fleche",recast.fleche,nextid.fleche,icon.fleche);
    }

    // else if (actionGroups.actionname == "Embolden") {
    //   addCooldown("embolden", player.ID, recast.embolden);
    //   removeIcon(nextid.embolden);
    //   addIconBlinkTimeout("fleche",recast.embolden,nextid.embolden,icon.embolden);
    // }

    else if (actionGroups.actionname == "Swiftcast") {
      addCooldown("swiftcast", player.ID, recast.swiftcast);
    }

    else if (actionGroups.actionname == "Lucid Dreaming") {
      removeIcon(nextid.luciddreaming);
      addCooldown("luciddreaming", player.ID, recast.luciddreaming);
    }

    // Combo actions

    else if (actionGroups.actionname == "Enchanted Riposte") {
      if (player.level >= 35) {
        toggle.combo = Date.now();
      }
      count.aoe = 1;
      removeIcon(nextid.riposte);
    }

    else if (actionGroups.actionname == "Enchanted Zwerchhau") {
      count.aoe = 1;
      removeIcon(nextid.zwerchhau);
      if (player.level < 50) {
        delete toggle.combo;
        rdmDualcast();
      }
    }

    else if (actionGroups.actionname == "Enchanted Redoublement") {
      removeIcon(nextid.redoublement);
      if (player.level < 68) {
        delete toggle.combo;
        rdmDualcast();
      }
    }

    else if (actionGroups.actionname == "Verflare") {
      removeIcon(nextid.verflare);
      if (player.level < 80) {
        delete toggle.combo;
        rdmDualcast();
      }
    }

    else if (actionGroups.actionname == "Verholy") {
      removeIcon(nextid.verholy);
      if (player.level < 80) {
        delete toggle.combo;
        rdmDualcast();
      }
    }

    else if (actionGroups.actionname == "Scorch") {
      removeIcon(nextid.scorch);
      delete toggle.combo;
      rdmDualcast();
    }

    // These actions interrupt combos

    else {

      delete toggle.combo;

      removeIcon(nextid.riposte);
      removeIcon(nextid.zwerchhau);
      removeIcon(nextid.redoublement);
      removeIcon(nextid.verflare);
      removeIcon(nextid.scorch);

      if (actionGroups.actionname == "Verfire") {
        removeStatus("verfireready", player.ID)
      }

      else if (actionGroups.actionname == "Verstone") {
        removeStatus("verstoneready", player.ID)
      }

      else if (player.level >= 66
      && ["Verthunder", "Veraero"].indexOf(actionGroups.actionname) > -1) {
        count.aoe = 1;
      }

      else if (actionGroups.actionname == "Verthunder II") {
        if (Date.now() - previous.verthunder2 > 1000) {
          previous.verthunder2 = Date.now();
          count.aoe = 1;
        }
        else {
          count.aoe = count.aoe + 1;
        }
      }

      else if (actionGroups.actionname == "Veraero II") {
        if (Date.now() - previous.veraero2 > 1000) {
          previous.veraero2 = Date.now();
          count.aoe = 1;
        }
        else {
          count.aoe = count.aoe + 1;
        }
      }

      else if (["Scatter", "Impact"].indexOf(actionGroups.actionname) > -1) {
        if (Date.now() - previous.scatter > 1000) {
          previous.scatter = Date.now();
          count.aoe = 1;
        }
        else {
          count.aoe = count.aoe + 1;
        }
        if (count.aoe < 4) {
          rdmDualcast();
        }
      }

      else if (["Moulinet", "Enchanted Moulinet"].indexOf(actionGroups.actionname) > -1) {
        if (Date.now() - previous.moulinet > 1000) {
          previous.moulinet = Date.now();
          count.aoe = 1;
        }
        else {
          count.aoe = count.aoe + 1;
        }
      }

      else if (actionGroups.actionname == "Manafication") {
        addCooldown("manafication", player.ID, recast.manafication);
        clearTimeout(timeout.corpsacorps);
        clearTimeout(timeout.displacement);
        addIconBlink(nextid.corpsacorps,icon.corpsacorps);
        addIconBlink(nextid.displacement,icon.displacement);
        removeIcon(nextid.manafication);
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
        removeIcon(nextid.hardcast);
      }
      else if (statusGroups.gainsloses == "loses") {
        addText("debug2", "Loses Dualcast");
        removeStatus("dualcast", player.ID);
        rdmDualcast();
      }
    }

    else if (statusGroups.statusname == "Verfire Ready") {
      if (statusGroups.gainsloses == "gains") {
        addStatus("verfireready", player.ID, parseInt(statusGroups.duration) * 1000);
        if (!toggle.combo) {
          rdmDualcast(); // Prevents Verflare/Verholy procs from resetting combo
        }
      }
      else if (statusGroups.gainsloses == "loses") {
        removeStatus("verfireready", player.ID)
      }
    }

    else if (statusGroups.statusname == "Verstone Ready") {
      if (statusGroups.gainsloses == "gains") {
        addStatus("verstoneready", player.ID, parseInt(statusGroups.duration) * 1000);
        if (!toggle.combo) {
          rdmDualcast();
        }
      }
      else if (statusGroups.gainsloses == "loses") {
        removeStatus("verstoneready", player.ID)
      }
    }

    else if (statusGroups.statusname == "Swiftcast") {
      if (statusGroups.gainsloses == "gains") {
        addStatus("swiftcast", player.ID, parseInt(statusGroups.duration) * 1000);
        removeIcon(nextid.hardcast);
      }
      else if (statusGroups.gainsloses == "loses") {
        removeStatus("swiftcast", player.ID);
        rdmDualcast();
      }
    }
  }
}

function rdmDualcast() {

  removeIcon(nextid.hardcast);
  removeIcon(nextid.dualcast);
  removeIcon(nextid.riposte);
  removeIcon(nextid.zwerchhau);
  removeIcon(nextid.redoublement);
  removeIcon(nextid.verflare);
  removeIcon(nextid.scorch);

  // rdmManafication();

  if (player.level >= 70
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
    rdmManafication();
    next.dualcast = [];
    next.dualcastvalue = 0;

    for (i = 0; i < hardcastarraylength; i = i + 3) {
      for (j = 0; j < dualcastarraylength; j = j + 3) {

        if (rdmDualcastValue(hardcast[i], hardcast[i + 1], hardcast[i + 2], dualcast[j], dualcast[j + 1], dualcast[j + 2]) > next.dualcastvalue) {
          next.dualcast = [hardcast[i], dualcast[j]];
          next.dualcastvalue = rdmDualcastValue(hardcast[i], hardcast[i + 1], hardcast[i + 2], dualcast[j], dualcast[j + 1], dualcast[j + 2]);
          addText("debug1", next.dualcast + next.dualcastvalue);
        }
      }
    }


    if ("Jolt" == next.dualcast[0]) {
      addIcon(nextid.hardcast, icon.jolt);
    }
    else if ("Verfire" == next.dualcast[0]) {
      addIcon(nextid.hardcast, icon.verfire);
    }
    else if ("Verstone" == next.dualcast[0]) {
      addIcon(nextid.hardcast, icon.verstone);
    }
    else if ("Verthunder II" == next.dualcast[0]) {
      addIcon(nextid.hardcast, icon.verthunder2);
    }
    else if ("Veraero II" == next.dualcast[0]) {
      addIcon(nextid.hardcast, icon.veraero2);
    }
    else if ("Swiftcast" == next.dualcast[0]) {
      addIcon(nextid.hardcast, icon.swiftcast);
    }

    if ("Verthunder" == next.dualcast[1]) {
      addIcon(nextid.dualcast, icon.verthunder);
    }
    else if ("Veraero" == next.dualcast[1]) {
      addIcon(nextid.dualcast, icon.veraero);
    }
    else if ("Scatter" == next.dualcast[1]) {
      addIcon(nextid.dualcast, icon.scatter);
    }

  }
}

function rdmDualcastTimeout() {
  if (toggle.combat) {
    rdmDualcast();
  }
}



function rdmDualcastValue(hardcastaction, hardcastblack, hardcastwhite, dualcastaction, dualcastblack, dualcastwhite) {

  let manapotency = Math.max(9.1, 2.43 * count.aoe);

  // TODO: assign potency values to mana gains and actual spells - that's almost definitely the best way to do this
  // Loop through all possible combinations and then keep highest one
  // This function assigns values to various situations.
  // Adjust values to make some situations more (or less) weighted than others.
  // Calculates mana after dualcast and manafication




  // Calculate initial value based on current mana potency
  let value = (hardcastblack + dualcastblack + hardcastwhite + dualcastwhite) * manapotency;

  // Calculates mana after dualcast (no manafication)
  next.hardcastblackMana = Math.min(player.jobDetail.blackMana + hardcastblack, 100);
  next.hardcastwhiteMana = Math.min(player.jobDetail.whiteMana + hardcastwhite, 100);
  if (toggle.manafication) {
    next.blackMana = Math.min(2 * (player.jobDetail.blackMana + hardcastblack + dualcastblack), 100);
    next.whiteMana = Math.min(2 * (player.jobDetail.whiteMana + hardcastwhite + dualcastwhite), 100);
    value = value - (Math.max(2 * (player.jobDetail.blackMana + hardcastblack + dualcastblack), 100) - 100) * manapotency;
    value = value - (Math.max(2 * (player.jobDetail.whiteMana + hardcastwhite + dualcastwhite), 100) - 100) * manapotency;

  }
  else {
    next.blackMana = Math.min(player.jobDetail.blackMana + hardcastblack + dualcastblack, 100);
    next.whiteMana = Math.min(player.jobDetail.whiteMana + hardcastwhite + dualcastwhite, 100);
    value = value - (Math.max(player.jobDetail.blackMana + hardcastblack + dualcastblack, 100) - 100) * manapotency;
    value = value - (Math.max(player.jobDetail.whiteMana + hardcastwhite + dualcastwhite, 100) - 100) * manapotency;

  }

  // Overcapping


  if (player.level >= 62
  && "Jolt" == hardcastaction) {
    value = value + 250;
  }
  else if (player.level >= 2
  && "Jolt" == hardcastaction) {
    value = value + 180;
  }
  else if (checkStatus("verfireready", player.ID) > 5000
  && "Verfire" == hardcastaction) {
    value = value + 270;
    if (player.jobDetail.blackMana < player.jobDetail.whiteMana) {
      value = value + 1;
    }
  }
  else if (checkStatus("verstoneready", player.ID) > 5000
  && "Verstone" == hardcastaction) {
    value = value + 270;
    if (player.jobDetail.whiteMana < player.jobDetail.blackMana) {
      value = value + 1;
    }
  }
  else if (player.level >= 18
  && "Verthunder II" == hardcastaction) {
    value = value + 120 * count.aoe;
    if (player.jobDetail.blackMana < player.jobDetail.whiteMana) {
      value = value + 1;
    }
  }
  else if (player.level >= 22
  && "Veraero II" == hardcastaction) {
    value = value + 120 * count.aoe;
    if (player.jobDetail.whiteMana < player.jobDetail.blackMana) {
      value = value + 1;
    }
  }
  else if (player.level >= 18
  && checkCooldown("swiftcast", player.ID) < 0
  && "Swiftcast" == hardcastaction) {
    value = value + 310; // check later
  }
  else {
    value = value - 1000000;
  }

  if (player.level >= 4
  && "Verthunder" == dualcastaction) {
    value = value + 310;
    if (next.hardcastblackMana < next.hardcastwhiteMana) {
      value = value + 1;
    }
  }
  else if (player.level >= 10
  && "Veraero" == dualcastaction) {
    value = value + 310;
    if (next.hardcastwhiteMana < next.hardcastblackMana) {
      value = value + 1;
    }
  }
  else if (player.level >= 66
  && "Scatter" == dualcastaction) {
    value = value + 220 * count.aoe;
  }
  else if (player.level >= 15
  && "Scatter" == dualcastaction) {
    value = value + 120 * count.aoe;
  }
  else {
    value = value - 1000000;
  }

  // Penalizes unbalanced
  if (Math.abs(next.hardcastblackMana - next.hardcastwhiteMana) > 30 || Math.abs(next.blackMana - next.whiteMana) > 30) {
    value = value - 1000000; // Just don't do it?
  }

  // Penalizes overwriting

  if (dualcastaction == "Verthunder"
  && hardcastaction != "Verfire"
  && checkStatus("verfireready", player.ID) >= 5000) {
    value = value - 0.5 * procpotency; // Wastes 50% proc chance
  }
  else if (dualcastaction == "Veraero"
  && hardcastaction != "Verstone"
  && checkStatus("verstoneready", player.ID) >= 5000) {
    value = value - 0.5 * procpotency;
  }

  if (Math.min(next.blackMana, next.whiteMana) >= 80) {

    if (player.level >= 70
    && next.blackMana > next.whiteMana
    && (checkStatus("verstoneready", player.ID) < 5000 || hardcastaction == "Verstone")
    && dualcastaction != "Veraero") {
      value = value + procpotency; // Sets up for 100% proc Verholy
    }

    else if (player.level >= 68
    && next.blackMana < next.whiteMana
    && (checkStatus("verfireready", player.ID) < 5000 || hardcastaction == "Verfire")
    && dualcastaction != "Verthunder") {
      value = value + procpotency; // Sets up for 100% proc Verflare
    }

    else if (player.level >= 70
    && next.blackMana <= next.whiteMana
    && (checkStatus("verstoneready", player.ID) < 5000 || hardcastaction == "Verstone")
    && dualcastaction != "Veraero") {
      value = value + 0.2 * procpotency; // Sets up for 100% proc Verholy
    }

    else if (player.level >= 68
    && next.blackMana >= next.whiteMana
    && (checkStatus("verfireready", player.ID) < 5000 || hardcastaction == "Verfire")
    && dualcastaction != "Verthunder") {
      value = value + 0.2 * procpotency; // Sets up for 100% proc Verflare
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
  }

  return value;
}

function rdmCombo() {
  addIcon(nextid.riposte,icon.riposte);
  if (player.level >= 35) {
    addIcon(nextid.zwerchhau,icon.zwerchhau);
  }
  if (player.level >= 50) {
    addIcon(nextid.redoublement,icon.redoublement);
  }
}

function rdmFlareCombo() {
  rdmCombo();
  addIcon(nextid.verflare,icon.verflare);
  if (player.level >= 80) {
    addIcon(nextid.scorch, icon.scorch);
  }
}

function rdmHolyCombo() {
  rdmCombo();
  addIcon(nextid.verholy,icon.verholy);
  if (player.level >= 80) {
    addIcon(nextid.scorch, icon.scorch);
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
      removeIcon(nextid.manafication);
      delete toggle.manafication;
    }

    // Use if able to get 5x Moulinet for AOE
    else if (count.aoe > 2
    && Math.min(player.jobDetail.blackMana, player.jobDetail.whiteMana) >= 50) {
      addIconBlink(nextid.manafication,icon.manafication);
      toggle.manafication = Date.now();
    }

    // Early Manafication if able to proc from Verholy
    else if (player.level >= 70
    && Math.min(player.jobDetail.blackMana, player.jobDetail.whiteMana) >= 43
    && player.jobDetail.whiteMana < 50
    && player.jobDetail.blackMana > player.jobDetail.whiteMana
    && checkStatus("verstoneready", player.ID) < 2500) {
      addIconBlink(nextid.manafication,icon.manafication);
      toggle.manafication = Date.now();
    }

    // Early Manafication if able to proc from Verflare
    else if (player.level >= 68
    && Math.min(player.jobDetail.blackMana, player.jobDetail.whiteMana) >= 43
    && player.jobDetail.blackMana < 50
    && player.jobDetail.whiteMana > player.jobDetail.blackMana
    && checkStatus("verfireready", player.ID) < 2500) {
      addIconBlink(nextid.manafication,icon.manafication);
      toggle.manafication = Date.now();
    }

    // Use if otherwise over 45/45
    else if (player.level >= 60
    && Math.min(player.jobDetail.blackMana, player.jobDetail.whiteMana) >= 45) {
      addIconBlink(nextid.manafication,icon.manafication);
      toggle.manafication = Date.now();
    }

    else {
      // Hide otherwise?
      removeIcon(nextid.manafication);
      delete toggle.manafication;
    }
  }
  else {
    removeIcon(nextid.manafication);
    delete toggle.manafication;
  }
}
