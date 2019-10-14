"use strict";

var procpotency = 20;
var manabreakpoint = 5; // If you lose this much mana fixing your procs, you have not gained potency.
                        // See https://docs.google.com/spreadsheets/d/143xU_4FYgPBUldSKJQpA30A2i98SVwqFwJ4tsihGbao/edit#gid=1083939279&range=A59

var hardcast = [  // Array with Hardcast spells and mana values
  "Jolt", 3, 3,
  "Verfire", 9, 0,
  "Verstone", 0, 9,
  "Verthunder II", 7, 0,
  "Veraero II", 0, 7,
  "Swiftcast", 0, 0
  ];
var dualcast = [  // Array with longer cast time spells and mana values
  "Verthunder", 11, 0,
  "Veraero", 0, 11,
  "Scatter", 3, 3
];

var i;  // For loops
var j;

actionList.rdm = [

  // Off-GCD
  "Corps-A-Corps", "Displacement", "Fleche", "Contre Sixte", "Acceleration", "Manafication", "Engagement",

  // Role
  "Swiftcast", "Lucid Dreaming",

  // GCD
  "Jolt", "Verfire", "Verstone", "Jolt II", "Verthunder", "Veraero",
  "Verthunder II", "Veraero II", "Impact", "Scatter",
  "Riposte", "Zwerchhau", "Redoublement", "Moulinet", "Reprise",
  "Enchanted Riposte", "Enchanted Zwerchhau", "Enchanted Redoublement", "Enchanted Moulinet", "Enchanted Reprise",
  "Verflare", "Verholy", "Scorch"

];

function rdmJobChange() {

  // Set up UI

  nextid.combo1 = 0;
  nextid.combo2 = nextid.combo1 + 1;
  nextid.combo3 = nextid.combo1 + 2;
  nextid.combo4 = nextid.combo1 + 3;
  nextid.combo5 = nextid.combo1 + 4;

  nextid.riposte = nextid.combo1;
  nextid.moulinet1 = nextid.combo1;
  nextid.moulinet = nextid.moulinet1;

  nextid.zwerchhau = nextid.combo2;
  nextid.moulinet2 = nextid.combo2;

  nextid.redoublement = nextid.combo3;

  nextid.verflare = nextid.combo4;
  nextid.verholy = nextid.verflare;

  nextid.scorch = nextid.combo5;

  nextid.hardcast = 6;
  nextid.dualcast = 7;
  nextid.luciddreaming = 10;
  nextid.manafication = 11;
  nextid.fleche = 12;
  nextid.contresixte = nextid.fleche + 1;
  nextid.corpsacorps = nextid.fleche + 2;
  nextid.displacement = nextid.fleche + 3;
  nextid.acceleration = nextid.fleche + 4;

  countdownid.manafication = 0;
  countdownid.embolden = 1;
  countdownid.luciddreaming = 2;
  countdownid.swiftcast = 3;
  countdownid.fleche = 4;
  countdownid.contresixte = 5;
  countdownid.corpsacorps = 6;
  countdownid.displacement= 7;

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

  addCountdownBar("corpsacorps", checkRecast("corpsacorps"), "icon");

  if (player.level >= 40) {
    addCountdownBar("displacement", checkRecast("displacement"), "icon");
  }

  if (player.level >= 45) {
    addCountdownBar("fleche", checkRecast("fleche"), "icon");
  }

  if (player.level >= 56) {
    addCountdownBar("contresixte", checkRecast("contresixte"), "icon");
  }

  if (player.level >= 60) {
    addCountdownBar("manafication", checkRecast("manafication"));
  }

  toggle.rdmSetup = 1;

}

function rdmPlayerChangedEvent() {

  if (toggle.rdmSetup) { // Not sure if there is a race condition but this should prevent it

    if (player.currentMP / player.maxMP < 0.85) {
      addCountdownBar("luciddreaming", checkRecast("luciddreaming"), "icon");
    }

    else {
      removeIcon("luciddreaming");
      removeCountdownBar("luciddreaming");
    }

  }
}

function rdmAction() {

  if (actionList.rdm.indexOf(actionGroups.actionname) > -1) {

    // Off GCD

    if ("Corps-A-Corps" == actionGroups.actionname) {
      addCountdownBar("corpsacorps", recast.corpsacorps, "icon");
      removeIcon("corpsacorps");
    }

    else if (["Displacement", "Engagement"].indexOf(actionGroups.actionname) > -1) {
      addCountdownBar("displacement", recast.displacement, "icon");
      removeIcon("displacement");
    }

    else if ("Fleche" == actionGroups.actionname) {
      addCountdownBar("fleche", recast.fleche, "icon");
      removeIcon("fleche");
    }

    // No one cares about Acceleration =(
    // else if ("Acceleration" == actionGroups.actionname) {
    //   addRecast("acceleration");
    // }

    else if ("Contre Sixte" == actionGroups.actionname) {
      addCountdownBar("contresixte", recast.contresixte, "icon");
      if (Date.now() - previous.contresixte > 1000) {
        previous.contresixte = Date.now();
        count.aoe = 1;
      }
      else {
        count.aoe = count.aoe + 1;
      }
      removeIcon("contresixte");
    }

    else if ("Embolden" == actionGroups.actionname) {
      addCountdownBar("embolden");
    }

    else if ("Swiftcast" == actionGroups.actionname) {
      addCountdownBar("swiftcast");
    }

    else if ("Lucid Dreaming" == actionGroups.actionname) {
      addRecast("luciddreaming");
    }

    else {  // GCD

      if (["Riposte", "Enchanted Riposte"].indexOf(actionGroups.actionname) > -1) {
        if (player.level >= 35) {
          toggle.combo = Date.now();
          removeIcon("hardcast");
          removeIcon("dualcast");
          rdmComboTimeout();
        }
        if (player.level >= 52) {
          count.aoe = 1;
        }
        removeIcon("riposte");
      }

      else if (["Zwerchhau", "Enchanted Zwerchhau"].indexOf(actionGroups.actionname) > -1) {
        if (player.level >= 52) {
          count.aoe = 1;
        }
        removeIcon("zwerchhau");
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
        removeIcon("redoublement");
        if (player.level < 68) {
          rdmDualcast();
        }
        else {
          rdmComboTimeout();
        }
      }

      else if ("Verflare" == actionGroups.actionname) {
        count.aoe = 1;
        removeIcon("verflare");
        if (player.level < 80) {
          rdmDualcast();
        }
        else {
          rdmComboTimeout();
        }
      }

      else if ("Verholy" == actionGroups.actionname) {
        count.aoe = 1;
        removeIcon("verholy");
        if (player.level < 80) {
          rdmDualcast();
        }
        else {
          rdmComboTimeout();
        }
      }

      else if ("Scorch" == actionGroups.actionname) {
        count.aoe = 1;
        removeIcon("scorch");
        rdmDualcast();
      }

      else { // Interrupt combo

        if ("Verfire" == actionGroups.actionname) {
          removeStatus("verfireready");
        }

        else if ("Verstone" == actionGroups.actionname) {
          removeStatus("verstoneready");
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
          addCountdownBar("manafication");
          addCountdownBar("corpsacorps", -1, "icon");
          addCountdownBar("displacement", -1, "icon");
          removeIcon("manafication");
          rdmDualcast();
        }

      }

    }

  }

}

function rdmStatus() {

  if (statusGroups.targetID == player.ID) {

    if ("Dualcast" == statusGroups.statusname) {
      if (statusGroups.gainsloses == "gains") {
        addStatus("dualcast", parseInt(statusGroups.duration) * 1000);
        removeIcon("hardcast");
      }
      else if (statusGroups.gainsloses == "loses") {
        removeStatus("dualcast");
        rdmDualcast();
      }
    }

    else if ("Verfire Ready" == statusGroups.statusname) {
      if (statusGroups.gainsloses == "gains") {
        addStatus("verfireready", parseInt(statusGroups.duration) * 1000);
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
        addStatus("verstoneready", parseInt(statusGroups.duration) * 1000);
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
        addStatus("swiftcast", parseInt(statusGroups.duration) * 1000);
        removeIcon("hardcast");
      }
      else if (statusGroups.gainsloses == "loses") {
        removeStatus("swiftcast");
        rdmDualcast();
      }
    }
  }
}

function rdmStart() {

  // Starting cast immediately breaks combo, apparently
  delete toggle.combo;
  removeIcon("riposte");
  removeIcon("zwerchhau");
  removeIcon("redoublement");
  removeIcon("verflare");
  removeIcon("scorch");

  removeIcon("hardcast"); // Remove hardcast icon on starting cast
}

function rdmCancel() {
  rdmDualcast(); // Recalculates dualcast if casting canceled
}

function rdmDualcast() {

  delete toggle.combo;

  removeIcon("hardcast");
  removeIcon("dualcast");
  removeIcon("riposte");
  removeIcon("zwerchhau");
  removeIcon("redoublement");
  removeIcon("verflare");
  removeIcon("scorch");

  if (checkRecast("manafication") < 2500
  && Math.min(player.jobDetail.blackMana, player.jobDetail.whiteMana) >= 70) {
    addIcon("moulinet");
  }

  // else if (checkRecast("manafication") < 2500
  // && Math.min(player.jobDetail.blackMana, player.jobDetail.whiteMana) >= 55) {
  //   addIcon("reprise");
  // }

  else if (count.aoe >= 4
  && Math.min(player.jobDetail.blackMana, player.jobDetail.whiteMana) >= 70) {
    addIcon("moulinet");
  }

  else if (count.aoe >= 2
  && Math.min(player.jobDetail.blackMana, player.jobDetail.whiteMana) > 90) {
    addIcon("moulinet");
  }

  else if ((player.level < 52 || count.aoe == 1)
  && Math.min(player.jobDetail.blackMana, player.jobDetail.whiteMana) >= 80) {
    if (player.level >= 70
    && player.jobDetail.blackMana > player.jobDetail.whiteMana
    && checkStatus("verstoneready") < 7000) {
      rdmHolyCombo();
    }
    else if (player.level >= 68
    && player.jobDetail.whiteMana > player.jobDetail.blackMana
    && checkStatus("verfireready") < 7000) {
      rdmFlareCombo();
    }
    else if (player.level >= 70
    && player.jobDetail.blackMana <= player.jobDetail.whiteMana
    && player.jobDetail.whiteMana + 20 <= player.jobDetail.blackMana + 30
    && checkStatus("verstoneready") < 7000) {
      rdmHolyCombo();
    }
    else if (player.level >= 68
    && player.jobDetail.whiteMana <= player.jobDetail.blackMana
    && player.jobDetail.blackMana + 20 <= player.jobDetail.whiteMana + 30
    && checkStatus("verfireready") < 7000) {
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
    for (i = 0; i < hardcast.length; i = i + 3) {
      for (j = 0; j < dualcast.length; j = j + 3) {
        if (rdmDualcastValue(hardcast[i], hardcast[i + 1], hardcast[i + 2], dualcast[j], dualcast[j + 1], dualcast[j + 2]) > next.dualcastvalue) {
          next.dualcast = [hardcast[i], dualcast[j]];
          next.dualcastvalue = rdmDualcastValue(hardcast[i], hardcast[i + 1], hardcast[i + 2], dualcast[j], dualcast[j + 1], dualcast[j + 2]);
        }
      }
    }

    // Shows resulting icon
    if ("Jolt" == next.dualcast[0]) {
      addIcon("hardcast", "jolt");
    }
    else if ("Verfire" == next.dualcast[0]) {
      addIcon("hardcast", "verfire");
    }
    else if ("Verstone" == next.dualcast[0]) {
      addIcon("hardcast", "verstone");
    }
    else if ("Verthunder II" == next.dualcast[0]) {
      addIcon("hardcast", "verthunder2");
    }
    else if ("Veraero II" == next.dualcast[0]) {
      addIcon("hardcast", "veraero2");
    }
    else if ("Swiftcast" == next.dualcast[0]) {
      addIcon("hardcast", "swiftcast");
    }

    if ("Verthunder" == next.dualcast[1]) {
      addIcon("dualcast", "verthunder");
    }
    else if ("Veraero" == next.dualcast[1]) {
      addIcon("dualcast", "veraero");
    }
    else if ("Scatter" == next.dualcast[1]) {
      addIcon("dualcast", "scatter");
    }
  }
}

function rdmComboTimeout() {
  clearTimeout(timeout.combo);
  timeout.combo = setTimeout(rdmDualcast, 12500);
}

function rdmDualcastValue(hardcastaction, hardcastblack, hardcastwhite, dualcastaction, dualcastblack, dualcastwhite) {

  // Calculate manapotency using latest values... probably
  let manapotency = Math.max(9.24, 2.43 * count.aoe);

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
  && checkRecast("swiftcast") < 0
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
  && checkStatus("verfireready") >= 5000) {
    value = value - 0.5 * procpotency;
  }
  else if (dualcastaction == "Veraero"
  && hardcastaction != "Verstone"
  && checkStatus("verstoneready") >= 5000) {
    value = value - 0.5 * procpotency;
  }

  // Finds combo transitions and adds proc value
  if (Math.min(next.blackMana, next.whiteMana) >= 80) {
    if (player.level >= 70
    && next.blackMana > next.whiteMana
    && (checkStatus("verstoneready") < 5000 || hardcastaction == "Verstone")
    && dualcastaction != "Veraero") {
      value = value + procpotency; // Sets up for 100% proc Verholy
    }
    else if (player.level >= 68
    && next.blackMana < next.whiteMana
    && (checkStatus("verfireready") < 5000 || hardcastaction == "Verfire")
    && dualcastaction != "Verthunder") {
      value = value + procpotency; // Sets up for 100% proc Verflare
    }
    else if (player.level >= 70
    && next.blackMana <= next.whiteMana
    && (checkStatus("verstoneready") < 5000 || hardcastaction == "Verstone")
    && dualcastaction != "Veraero") {
      value = value + 0.2 * procpotency; // Sets up for 20% proc Verholy
    }
    else if (player.level >= 68
    && next.blackMana >= next.whiteMana
    && (checkStatus("verfireready") < 5000 || hardcastaction == "Verfire")
    && dualcastaction != "Verthunder") {
      value = value + 0.2 * procpotency; // Sets up for 20% proc Verflare
    }
  }

  return value;
}

function rdmCombo() {
  addIcon("riposte");
  if (player.level >= 35) {
    addIcon("zwerchhau");
  }
  if (player.level >= 50) {
    addIcon("redoublement");
  }
}

function rdmFlareCombo() {
  addIcon("riposte");
  if (player.level >= 35) {
    addIcon("zwerchhau");
  }
  if (player.level >= 50) {
    addIcon("redoublement");
  }
  if (player.level >= 68) {
    addIcon("verflare");
  }
  if (player.level >= 80) {
    addIcon("scorch");
  }
}

function rdmHolyCombo() {
  addIcon("riposte");
  if (player.level >= 35) {
    addIcon("zwerchhau");
  }
  if (player.level >= 50) {
    addIcon("redoublement");
  }
  if (player.level >= 70) {
    addIcon("verholy");
  }
  if (player.level >= 80) {
    addIcon("scorch");
  }
}

function rdmManafication() {

  if (player.level >= 60
  && checkRecast("manafication") < 0
  && !toggle.combo) {

    // Don't use Manafication if more than 28 away from 50/50
    if (Math.abs(player.jobDetail.blackMana - 50) + Math.abs(player.jobDetail.whiteMana - 50) > 28) {
      removeIcon("manafication");
      delete toggle.manafication;
    }

    else if (count.aoe >= 4
    && Math.min(player.jobDetail.blackMana, player.jobDetail.whiteMana) >= 50) {
      addIcon("manafication");
      toggle.manafication = Date.now();
    }

    else if (count.aoe >= 2
    && Math.min(player.jobDetail.blackMana, player.jobDetail.whiteMana) >= 46) {
      addIcon("manafication");
      toggle.manafication = Date.now();
    }

    // Early Manafication if able to proc from Verholy
    else if (player.level >= 70
    && Math.min(player.jobDetail.blackMana, player.jobDetail.whiteMana) >= 43
    && player.jobDetail.whiteMana < 50
    && player.jobDetail.blackMana > player.jobDetail.whiteMana
    && checkStatus("verstoneready") < 2500) {
      addIcon("manafication");
      toggle.manafication = Date.now();
    }

    // Early Manafication if able to proc from Verflare
    else if (player.level >= 68
    && Math.min(player.jobDetail.blackMana, player.jobDetail.whiteMana) >= 43
    && player.jobDetail.blackMana < 50
    && player.jobDetail.whiteMana > player.jobDetail.blackMana
    && checkStatus("verfireready") < 2500) {
      addIcon("manafication");
      toggle.manafication = Date.now();
    }

    // Use if otherwise over 45/45
    else if (player.level >= 60
    && Math.min(player.jobDetail.blackMana, player.jobDetail.whiteMana) >= 45) {
      addIcon("manafication");
      toggle.manafication = Date.now();
    }

    else {
      // Hide otherwise?
      removeIcon("manafication");
      delete toggle.manafication;
    }
  }
  else {
    removeIcon("manafication");
    delete toggle.manafication;
  }
}
