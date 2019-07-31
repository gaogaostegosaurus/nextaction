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

  "Corps-A-Corps", "Displacement", "Fleche", "Contre Sixte", "Acceleration", "Manafication", "Engagement",

  "Riposte", "Zwerchhau", "Redoublement", "Moulinet", "Reprise",
  "Enchanted Riposte", "Enchanted Zwerchhau", "Enchanted Redoublement", "Enchanted Moulinet", "Enchanted Reprise",
  "Verflare", "Verholy", "Scorch",

  "Jolt", "Verfire", "Verstone", "Jolt II", "Verthunder", "Veraero",
  "Verthunder II", "Veraero II", "Impact", "Scatter",

  "Swiftcast", "Lucid Dreaming"
];

function rdmJobChange() {

  // Set up UI
  nextid.manafication = 0;
  nextid.riposte = 1;
  nextid.moulinet = nextid.riposte;
  nextid.zwerchhau = 2;
  nextid.redoublement = 3;
  nextid.verflare = 4;
  nextid.verholy = nextid.verflare;
  nextid.scorch = 5;
  nextid.hardcast = 6;
  nextid.dualcast = 7;
  nextid.luciddreaming = 10;
  nextid.fleche = 11;
  nextid.contresixte = 12;
  nextid.acceleration = 13;
  nextid.corpsacorps = 14;
  nextid.displacement = 15;

  previous.contresixte = 0;
  previous.verthunder2 = 0;
  previous.veraero2 = 0;
  previous.scatter = 0;
  previous.moulinet = 0;

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

  if (checkCooldown("corpsacorps", player.ID) < 0) {
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
  nextid.luciddreaming = 10;

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

    // These actions don't interrupt combos

    if ("Acceleration" == actionGroups.actionname) {
      addCooldown("acceleration", player.ID, recast.acceleration);
      removeIcon(nextid.acceleration);
      addIconBlinkTimeout("acceleration",recast.acceleration,nextid.acceleration,icon.acceleration);
    }

    else if ("Contre Sixte" == actionGroups.actionname) {
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

    else if ("Corps-A-Corps" == actionGroups.actionname) {
      addCooldown("corpsacorps", player.ID, recast.corpsacorps);
      removeIcon(nextid.corpsacorps);
      addIconBlinkTimeout("corpsacorps",recast.corpsacorps,nextid.corpsacorps,icon.corpsacorps);
    }

    else if (["Displacement", "Engagement"].indexOf(actionGroups.actionname) > -1) {
      addCooldown("displacement", player.ID, recast.displacement);
      removeIcon(nextid.displacement);
      addIconBlinkTimeout("displacement",recast.displacement,nextid.displacement,icon.displacement);
    }

    else if ("Fleche" == actionGroups.actionname) {
      addCooldown("fleche", player.ID, recast.fleche);
      removeIcon(nextid.fleche);
      addIconBlinkTimeout("fleche",recast.fleche,nextid.fleche,icon.fleche);
    }

    // else if ("Embolden" == actionGroups.actionname) {
    //   addCooldown("embolden", player.ID, recast.embolden);
    //   removeIcon(nextid.embolden);
    //   addIconBlinkTimeout("fleche",recast.embolden,nextid.embolden,icon.embolden);
    // }

    else if ("Swiftcast" == actionGroups.actionname) {
      addCooldown("swiftcast", player.ID, recast.swiftcast);
    }

    else if ("Lucid Dreaming" == actionGroups.actionname) {
      removeIcon(nextid.luciddreaming);
      addCooldown("luciddreaming", player.ID, recast.luciddreaming);
    }

    // Combo actions

    else if (["Riposte", "Enchanted Riposte"].indexOf(actionGroups.actionname) > -1) {
      if (player.level >= 35) {
        toggle.combo = Date.now();
        rdmComboTimeout();
      }
      if (player.level >= 52) {
        count.aoe = 1;
      }
      removeIcon(nextid.riposte);
    }

    else if (["Zwerchhau", "Enchanted Zwerchhau"].indexOf(actionGroups.actionname) > -1) {
      if (player.level >= 52) {
        count.aoe = 1;
      }
      removeIcon(nextid.zwerchhau);
      if (player.level < 50) {
        rdmDualcast();
      }
      else {
        rdmComboTimeout();
      }
    }

    else if (["Redoublement", "Enchanted Redoublement"].indexOf(actionGroups.actionname) > -1) {
      if (player.level >= 52) {
        count.aoe = 1;
      }
      removeIcon(nextid.redoublement);
      if (player.level < 68) {
        rdmDualcast();
      }
      else {
        rdmComboTimeout();
      }
    }

    else if ("Verflare" == actionGroups.actionname) {
      count.aoe = 1;
      removeIcon(nextid.verflare);
      if (player.level < 80) {
        rdmDualcast();
      }
      else {
        rdmComboTimeout();
      }
    }

    else if ("Verholy" == actionGroups.actionname) {
      count.aoe = 1;
      removeIcon(nextid.verholy);
      if (player.level < 80) {
        rdmDualcast();
      }
      else {
        rdmComboTimeout();
      }
    }

    else if ("Scorch" == actionGroups.actionname) {
      count.aoe = 1;
      removeIcon(nextid.scorch);
      rdmDualcast();
    }

    else { // Interrupt combo

      delete toggle.combo;

      removeIcon(nextid.riposte);
      removeIcon(nextid.zwerchhau);
      removeIcon(nextid.redoublement);
      removeIcon(nextid.verflare);
      removeIcon(nextid.scorch);

      if ("Verfire" == actionGroups.actionname) {
        removeStatus("verfireready", player.ID)
      }

      else if ("Verstone" == actionGroups.actionname) {
        removeStatus("verstoneready", player.ID)
      }

      else if (player.level >= 66
      && ["Verthunder", "Veraero"].indexOf(actionGroups.actionname) > -1) {
        count.aoe = 1;
      }

      else if ("Verthunder II" == actionGroups.actionname) {
        if (Date.now() - previous.verthunder2 > 1000) {
          previous.verthunder2 = Date.now();
          count.aoe = 1;
        }
        else {
          count.aoe = count.aoe + 1;
        }
      }

      else if ("Veraero II" == actionGroups.actionname) {
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
      }

      else if (["Moulinet", "Enchanted Moulinet"].indexOf(actionGroups.actionname) > -1) {
        if (Date.now() - previous.moulinet > 1000) {
          previous.moulinet = Date.now();
          count.aoe = 1;
        }
        else {
          count.aoe = count.aoe + 1;
        }
        rdmDualcast();
      }

      else if ("Manafication" == actionGroups.actionname) {
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

    if ("Dualcast" == statusGroups.statusname) {
      if (statusGroups.gainsloses == "gains") {
        addStatus("dualcast", player.ID, parseInt(statusGroups.duration) * 1000);
        removeIcon(nextid.hardcast);
      }
      else if (statusGroups.gainsloses == "loses") {
        removeStatus("dualcast", player.ID);
        rdmDualcast();
      }
    }

    else if ("Verfire Ready" == statusGroups.statusname) {
      if (statusGroups.gainsloses == "gains") {
        addStatus("verfireready", player.ID, parseInt(statusGroups.duration) * 1000);
        if (!toggle.combo) {
          rdmDualcast(); // Prevents Verflare proc from resetting combo
        }
      }
      else if (statusGroups.gainsloses == "loses") {
        removeStatus("verfireready", player.ID)
      }
    }

    else if ("Verstone Ready" == statusGroups.statusname) {
      if (statusGroups.gainsloses == "gains") {
        addStatus("verstoneready", player.ID, parseInt(statusGroups.duration) * 1000);
        if (!toggle.combo) {
          rdmDualcast(); // Prevents Verholy proc from resetting combo
        }
      }
      else if (statusGroups.gainsloses == "loses") {
        removeStatus("verstoneready", player.ID)
      }
    }

    else if ("Swiftcast" == statusGroups.statusname) {
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

function rdmStart() {
  removeIcon(nextid.hardcast); // Remove hardcast icon on starting cast
}

function rdmCancel() {
  rdmDualcast(); // Recalculates dualcast if casting canceled
}

function rdmDualcast() {

  delete toggle.combo;

  removeIcon(nextid.hardcast);
  removeIcon(nextid.dualcast);
  removeIcon(nextid.riposte);
  removeIcon(nextid.zwerchhau);
  removeIcon(nextid.redoublement);
  removeIcon(nextid.verflare);
  removeIcon(nextid.scorch);

  if (count.aoe >= 2
  && checkCooldown("manafication", player.ID) < 0
  && Math.min(player.jobDetail.blackMana, player.jobDetail.whiteMana) >= 70) {
    addIconBlink(nextid.moulinet, icon.moulinet);
  }

  else if (count.aoe >= 4
  && Math.min(player.jobDetail.blackMana, player.jobDetail.whiteMana) >= 20) {
    addIconBlink(nextid.moulinet, icon.moulinet);
  }

  else if (count.aoe >= 2
  && Math.min(player.jobDetail.blackMana, player.jobDetail.whiteMana) > 90) {
    addIconBlink(nextid.moulinet, icon.moulinet);
  }

  else if ((player.level < 52 || count.aoe == 1)
  && Math.min(player.jobDetail.blackMana, player.jobDetail.whiteMana) >= 80) {
    if (player.level >= 70
    && player.jobDetail.blackMana > player.jobDetail.whiteMana
    && checkStatus("verstoneready", player.ID) < 7000) {
      rdmHolyCombo();
    }
    else if (player.level >= 68
    && player.jobDetail.whiteMana > player.jobDetail.blackMana
    && checkStatus("verfireready", player.ID) < 7000) {
      rdmFlareCombo();
    }
    else if (player.level >= 70
    && player.jobDetail.blackMana <= player.jobDetail.whiteMana
    && player.jobDetail.whiteMana + 20 <= player.jobDetail.blackMana + 30
    && checkStatus("verstoneready", player.ID) < 7000) {
      rdmHolyCombo();
    }
    else if (player.level >= 68
    && player.jobDetail.whiteMana <= player.jobDetail.blackMana
    && player.jobDetail.blackMana + 20 <= player.jobDetail.whiteMana + 30
    && checkStatus("verfireready", player.ID) < 7000) {
      rdmFlareCombo();
    }
    else if (player.level >= 70
    && player.jobDetail.whiteMana + 20 <= player.jobDetail.blackMana + 30) {
      rdmHolyCombo();
    }
    else if (player.level >= 68
    && player.jobDetail.blackMana + 20 <= player.jobDetail.whiteMana + 30) {
      rdmFlareCombo();
    }
    // No fancy stuff before 68
    else if (player.level < 68) {
      rdmCombo();
    }
  }

  else { // Loop through all possible combinations
    next.dualcast = [];
    next.dualcastvalue = 0;
    rdmManafication(); // Check Manafication state
    for (i = 0; i < hardcastarraylength; i = i + 3) {
      for (j = 0; j < dualcastarraylength; j = j + 3) {
        if (rdmDualcastValue(hardcast[i], hardcast[i + 1], hardcast[i + 2], dualcast[j], dualcast[j + 1], dualcast[j + 2]) > next.dualcastvalue) {
          next.dualcast = [hardcast[i], dualcast[j]];
          next.dualcastvalue = rdmDualcastValue(hardcast[i], hardcast[i + 1], hardcast[i + 2], dualcast[j], dualcast[j + 1], dualcast[j + 2]);
        }
      }
    }

    // Shows resulting icon
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

function rdmComboTimeout() {
  clearTimeout(timeout.combo);
  timeout.combo = setTimeout(rdmDualcast, 12500);
}

function rdmDualcastValue(hardcastaction, hardcastblack, hardcastwhite, dualcastaction, dualcastblack, dualcastwhite) {

  // Calculate manapotency using latest values... probably
  let manapotency = Math.max(9.1, 2.43 * count.aoe);

  // Calculate initial value based on current mana potency
  let value = (hardcastblack + dualcastblack + hardcastwhite + dualcastwhite) * manapotency;

  // Calculates mana gain, adjusts value for wasted mana
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

  // Calculates mana after hardcast
  next.hardcastblackMana = Math.min(player.jobDetail.blackMana + hardcastblack, 100);
  next.hardcastwhiteMana = Math.min(player.jobDetail.whiteMana + hardcastwhite, 100);

  // Assign value to spells
  if ("Jolt" == hardcastaction) {
    if (player.level >= 62) { // Trait
      value = value + 250;
    }
    else {
      value = value + 180;
    }
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
    if (player.level >= 78) { // Trait
      value = value + 120 * count.aoe;
    }
    else {
      value = value + 100 * count.aoe;
    }
    if (player.jobDetail.blackMana < player.jobDetail.whiteMana) {
      value = value + 1;
    }
  }
  else if (player.level >= 22
  && "Veraero II" == hardcastaction) {
    if (player.level >= 78) { // Trait
      value = value + 120 * count.aoe;
    }
    else {
      value = value + 100 * count.aoe;
    }
    if (player.jobDetail.whiteMana < player.jobDetail.blackMana) {
      value = value + 1;
    }
  }
  else if (player.level >= 18
  && checkCooldown("swiftcast", player.ID) < 0
  && "Swiftcast" == hardcastaction) {
    value = value + Math.max(310, 220 * count.aoe); // Not actually sure what it's worth, but this seems about right
  }
  else {
    value = value - 1000000;
  }

  if ("Verthunder" == dualcastaction) {
    value = value + 310 + 0.5 * procpotency;
    if (next.hardcastblackMana < next.hardcastwhiteMana) {
      value = value + 1;
    }
  }
  else if ("Veraero" == dualcastaction) {
    value = value + 310 + 0.5 * procpotency;
    if (next.hardcastwhiteMana < next.hardcastblackMana) {
      value = value + 1;
    }
  }
  else if (player.level >= 15
  && "Scatter" == dualcastaction) {
    if (player.level >= 66) { // Trait
      value = value + 220 * count.aoe;
    }
    else {
      value = value + 120 * count.aoe;
    }
  }
  else {
    value = value - 1000000;
  }

  // Penalizes unbalanced
  if (Math.abs(next.hardcastblackMana - next.hardcastwhiteMana) > 30 || Math.abs(next.blackMana - next.whiteMana) > 30) {
    value = value - 1000000; // Just don't do it?
  }

  // Penalizes wasting 50% proc chance
  if (dualcastaction == "Verthunder"
  && hardcastaction != "Verfire"
  && checkStatus("verfireready", player.ID) >= 5000) {
    value = value - 0.5 * procpotency;
  }
  else if (dualcastaction == "Veraero"
  && hardcastaction != "Verstone"
  && checkStatus("verstoneready", player.ID) >= 5000) {
    value = value - 0.5 * procpotency;
  }

  // Finds combo transitions and adds proc value
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
      value = value + 0.2 * procpotency; // Sets up for 20% proc Verholy
    }
    else if (player.level >= 68
    && next.blackMana >= next.whiteMana
    && (checkStatus("verfireready", player.ID) < 5000 || hardcastaction == "Verfire")
    && dualcastaction != "Verthunder") {
      value = value + 0.2 * procpotency; // Sets up for 20% proc Verflare
    }
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

function rdmManafication() {

  if (player.level >= 60
  && checkCooldown("manafication", player.ID) < 0
  && !toggle.combo) {

    // Don't use Manafication if more than 28 away from 50/50
    if (Math.abs(player.jobDetail.blackMana - 50) + Math.abs(player.jobDetail.whiteMana - 50) > 28) {
      removeIcon(nextid.manafication);
      delete toggle.manafication;
    }

    else if (count.aoe >= 4
    && Math.min(player.jobDetail.blackMana, player.jobDetail.whiteMana) >= 50) {
      addIconBlink(nextid.manafication,icon.manafication);
      toggle.manafication = Date.now();
    }

    else if (count.aoe >= 2
    && Math.min(player.jobDetail.blackMana, player.jobDetail.whiteMana) >= 46) {
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
