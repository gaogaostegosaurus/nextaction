"use strict";

// Listed here for easy modification
// https://docs.google.com/spreadsheets/d/143xU_4FYgPBUldSKJQpA30A2i98SVwqFwJ4tsihGbao/edit#gid=1083939279&range=A59
var rdmSingleTargetManaPotency = 9.24;
var rdmMultiTargetManaPotency = 2.43;
var rdmProcPotency = 20;
var rdmMinimumMana = 50;
var rdmManaBreakpoint = 5;  // "If you lose this much mana fixing your procs, you have not gained potency."

// Time from Enchanted Riposte to Verflare/Verholy
// If proc time is below this value, it's considered "gone" for purposes of Verflare/Verholy procs
var rdmProcBufferTime = 7000;

// Variables used by rdmDualcast();
var rdmDualcastCombo;
var rdmDualcastComboValue;
var rdmDualcastPotency;
var rdmDualcastManaPotency;

// Arrays with spells and mana values
// Potencies left out because easier to do within function due to trait changes and such
var hardcast = [
  "Jolt", 3, 3,
  "Verfire", 9, 0,
  "Verstone", 0, 9,
  "Verthunder II", 7, 0,
  "Veraero II", 0, 7,
  "Swiftcast", 0, 0
  ];
var dualcast = [
  "Verthunder", 11, 0,
  "Veraero", 0, 11,
  "Scatter", 3, 3
];

var i;  // For loops
var j;

actionList.rdm = [

  // Off-GCD
  "Corps-A-Corps", "Displacement", "Fleche", "Contre Sixte", "Acceleration", "Manafication", "Engagement",

  // GCD
  "Jolt", "Verfire", "Verstone", "Jolt II", "Verthunder", "Veraero",
  "Verthunder II", "Veraero II", "Impact", "Scatter",
  "Riposte", "Zwerchhau", "Redoublement", "Moulinet", "Reprise",
  "Enchanted Riposte", "Enchanted Zwerchhau", "Enchanted Redoublement", "Enchanted Moulinet", "Enchanted Reprise",
  "Verflare", "Verholy", "Scorch",

  // Role
  "Swiftcast", "Lucid Dreaming"

];

function rdmJobChange() {

  // Set up UI

  nextid.manafication = 0;
  nextid.moulinet = nextid.manafication;
  nextid.reprise = nextid.manafication;

  nextid.combo1 = 1;
  nextid.combo2 = nextid.combo1 + 1;
  nextid.combo3 = nextid.combo1 + 2;
  nextid.combo4 = nextid.combo1 + 3;
  nextid.combo5 = nextid.combo1 + 4;

  nextid.riposte = 1;
  nextid.zwerchhau = nextid.riposte + 1;
  nextid.redoublement = nextid.riposte + 2;
  nextid.verflare =  nextid.riposte + 3;
  nextid.verholy =  nextid.riposte + 3;
  nextid.scorch =  nextid.riposte + 4;

  nextid.hardcast = 18;
  nextid.dualcast = 19;

  nextid.luciddreaming = 21;
  nextid.fleche = 22;
  nextid.contresixte = nextid.fleche + 1;
  nextid.corpsacorps = nextid.fleche + 2;
  nextid.displacement = nextid.fleche + 3;
  nextid.swiftcast = nextid.fleche + 4;
  nextid.acceleration = nextid.fleche + 5;

  countdownid.manafication = 0;
  countdownid.swiftcast = 1;
  countdownid.fleche = 2;
  countdownid.contresixte = 3;
  countdownid.corpsacorps = 4;
  countdownid.displacement = 5;
  countdownid.acceleration = 6;
  countdownid.embolden = 7;
  countdownid.luciddreaming = 8;

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

  addCountdownBar("corpsacorps", checkRecast("corpsacorps"), "addIcon");

  if (player.level >= 40) {
    addCountdownBar("displacement", checkRecast("displacement"), "addIcon");
  }

  if (player.level >= 45) {
    addCountdownBar("fleche", checkRecast("fleche"), "addIcon");
  }

  if (player.level >= 56) {
    addCountdownBar("contresixte", checkRecast("contresixte"), "addIcon");
  }

  if (player.level >= 60) {
    addCountdownBar("manafication", checkRecast("manafication"));
  }

  enemyTargets = 1;

  rdmNext();

}

// 14: NetworkStartsCasting
function rdmStartsUsing() {

  delete toggle.combo; // Starting cast immediately breaks combo, apparently
  removeIcon("riposte");
  removeIcon("zwerchhau");
  removeIcon("redoublement");
  removeIcon("verflare");
  removeIcon("scorch");

  // rdmNext();  // Check dualcast calculation again?
  removeIcon("hardcast"); // Remove hardcast icon on starting cast

}

// 15: NetworkAbility
// 16: NetworkAOEAbility
function rdmAction() {

  if (actionList.rdm.indexOf(actionLog.groups.actionName) > -1) {

    // Off GCD Actions

    if ("Corps-A-Corps" == actionLog.groups.actionName) {
      // addRecast("corpsacorps");
      addCountdownBar("corpsacorps", recast.corpsacorps, "addIcon");
      removeIcon("corpsacorps");
    }

    else if (["Displacement", "Engagement"].indexOf(actionLog.groups.actionName) > -1) {
      // addRecast("displacement");
      addCountdownBar("displacement", recast.displacement, "addIcon");
      removeIcon("displacement");
    }

    else if ("Fleche" == actionLog.groups.actionName) {
      // addRecast("fleche");
      addCountdownBar("fleche", recast.fleche, "addIcon");
      removeIcon("fleche");
    }

    else if ("Acceleration" == actionLog.groups.actionName) {
      addRecast("acceleration");
      addCountdownBar("acceleration", recast.acceleration, "addIcon");
      removeIcon("acceleration");
    }

    else if ("Contre Sixte" == actionLog.groups.actionName) {
      // addRecast("contresixte");
      addCountdownBar("contresixte", recast.contresixte, "addIcon");
      // Contre Sixte makes weird things happen when using Single Target
      // if (Date.now() - previous.contresixte > 1000) {
      //   previous.contresixte = Date.now();
      //   enemyTargets = 1;
      // }
      // else {
      //   enemyTargets = enemyTargets + 1;
      // }
      removeIcon("contresixte");
    }

    else if ("Embolden" == actionLog.groups.actionName) {
      addRecast("embolden");
    }

    else if ("Swiftcast" == actionLog.groups.actionName) {
      addRecast("swiftcast");
      addCountdownBar("swiftcast", recast.swiftcast, "addIcon");
    }

    else if ("Lucid Dreaming" == actionLog.groups.actionName) {
      addRecast("luciddreaming");
    }

    // GCD
    else {

      if (["Riposte", "Enchanted Riposte"].indexOf(actionLog.groups.actionName) > -1) {

        removeIcon("hardcast");
        removeIcon("dualcast");

        enemyTargets = 1;
        toggle.combo = 1;  // Prevents Verflare/Verholy procs from triggering new Dualcast

        if (player.level >= 68
        && Math.min(player.jobDetail.blackMana, player.jobDetail.whiteMana) >= 50) {


          // 100%
          if (player.level >= 70
          && player.jobDetail.blackMana > player.jobDetail.whiteMana
          && checkStatus("verstoneready") < rdmProcBufferTime - 1500) {
            rdmVerholyCombo();
          }
          else if (player.jobDetail.whiteMana > player.jobDetail.blackMana
          && checkStatus("verfireready") < rdmProcBufferTime - 1500) {
            rdmVerflareCombo();
          }

          // 20%
          else if (player.level >= 70
          && player.jobDetail.whiteMana + 20 - player.jobDetail.blackMana <= 30
          && checkStatus("verstoneready") < rdmProcBufferTime - 1500) {
            rdmVerholyCombo();
          }
          else if (player.jobDetail.blackMana + 20 - player.jobDetail.whiteMana <= 30
          && checkStatus("verfireready") < rdmProcBufferTime - 1500) {
            rdmVerflareCombo();
          }

          else if (player.level >= 70
          && player.jobDetail.blackMana > player.jobDetail.whiteMana) {
            rdmVerholyCombo();
          }
          else {
            rdmVerflareCombo();
          }

          removeIcon("riposte");

        }

        else if (player.level < 68
        && Max.min(player.jobDetail.blackMana, player.jobDetail.whiteMana) >= 50) {
          rdmMeleeCombo();
          removeIcon("riposte");
        }

        else if (player.level < 50
        && Max.min(player.jobDetail.blackMana, player.jobDetail.whiteMana) >= 25) {
          rdmMeleeCombo();
          removeIcon("riposte");
        }
        else {
          removeIcon("riposte");
          delete toggle.combo;
          rdmNext();
        }

      }

      else if (["Zwerchhau", "Enchanted Zwerchhau"].indexOf(actionLog.groups.actionName) > -1) {
        removeIcon("zwerchhau");
        if (player.level < 50) {
          delete toggle.combo;
          rdmNext();
        }
      }

      else if (["Redoublement", "Enchanted Redoublement"].indexOf(actionLog.groups.actionName) > -1) {
        removeIcon("redoublement");
        if (player.level < 68) {
          delete toggle.combo;
          rdmNext();
        }
      }

      else if ("Verflare" == actionLog.groups.actionName) {
        enemyTargets = 1;
        removeIcon("verflare");
        if (player.level < 80) {
          delete toggle.combo;
          rdmNext();
        }
      }

      else if ("Verholy" == actionLog.groups.actionName) {
        removeIcon("verholy");
        if (player.level < 80) {
          delete toggle.combo;
          rdmNext();
        }
      }

      else if ("Scorch" == actionLog.groups.actionName) {
        removeIcon("scorch");
        delete toggle.combo;
        rdmNext();
      }

       // Interrupt combo
      else {

        if ("Verfire" == actionLog.groups.actionName) {
          removeStatus("verfireready");
        }

        else if ("Verstone" == actionLog.groups.actionName) {
          removeStatus("verstoneready");
        }

        else if (player.level >= 66
        && ["Verthunder", "Veraero"].indexOf(actionLog.groups.actionName) > -1) {
          enemyTargets = 1;
        }

        else if ("Verthunder II" == actionLog.groups.actionName) {
          if (Date.now() - previous.verthunder2 > 1000) {
            previous.verthunder2 = Date.now();
            enemyTargets = 1;
          }
          else {
            enemyTargets = enemyTargets + 1;
          }
        }

        else if ("Veraero II" == actionLog.groups.actionName) {
          if (Date.now() - previous.veraero2 > 1000) {
            previous.veraero2 = Date.now();
            enemyTargets = 1;
          }
          else {
            enemyTargets = enemyTargets + 1;
          }
        }

        else if (["Scatter", "Impact"].indexOf(actionLog.groups.actionName) > -1) {
          if (Date.now() - previous.scatter > 1000) {
            previous.scatter = Date.now();
            enemyTargets = 1;
          }
          else {
            enemyTargets = enemyTargets + 1;
          }
        }

        else if (["Moulinet", "Enchanted Moulinet"].indexOf(actionLog.groups.actionName) > -1) {

          // if (player.level < 60) {  // Only use Moulinet to count targets if >= 60, since it's used as a quick spender after that
              if (Date.now() - previous.moulinet > 1000) {
              previous.moulinet = Date.now();
              enemyTargets = 1;
            }
            else {
              enemyTargets = enemyTargets + 1;
            }
          // }
          rdmNext();
        }

        else if (["Reprise", "Enchanted Reprise"].indexOf(actionLog.groups.actionName) > -1) {
          enemyTargets = 1;
          rdmNext();
        }

        else if ("Manafication" == actionLog.groups.actionName) {
          addRecast("manafication");
          addCountdownBar("manafication");
          addRecast("corpsacorps", -1);
          addCountdownBar("displacement", -1, "addIcon");
          addRecast("displacement", -1);
          addCountdownBar("corpsacorps", -1, "addIcon");
          removeIcon("manafication");
          rdmNext();
        }

      }

    }

  }

}

// 17: NetworkCancelAbility
function rdmCancelled() {
  rdmNext(); // Recheck dualcast if casting canceled
}

// 1A: NetworkBuff
function rdmEffect() {

  if (effectLog.groups.targetID == player.ID) {

    if ("Dualcast" == effectLog.groups.effectName) {
      if (effectLog.groups.gainsLoses == "gains") {
        addStatus("dualcast", parseInt(effectLog.groups.effectDuration) * 1000);
        removeIcon("hardcast");
      }
      else if (effectLog.groups.gainsLoses == "loses") {
        removeStatus("dualcast");
        rdmNext();
      }
    }

    else if ("Verfire Ready" == effectLog.groups.effectName) {
      if (effectLog.groups.gainsLoses == "gains") {
        addStatus("verfireready", parseInt(effectLog.groups.effectDuration) * 1000);
        if (!toggle.combo) {
          rdmNext(); // Prevents Verflare proc from resetting combo
        }
      }
      else if (effectLog.groups.gainsLoses == "loses") {
        removeStatus("verfireready", player.ID)
      }
    }

    else if ("Verstone Ready" == effectLog.groups.effectName) {
      if (effectLog.groups.gainsLoses == "gains") {
        addStatus("verstoneready", parseInt(effectLog.groups.effectDuration) * 1000);
        if (!toggle.combo) {
          rdmNext(); // Prevents Verholy proc from resetting combo
        }
      }
      else if (effectLog.groups.gainsLoses == "loses") {
        removeStatus("verstoneready", player.ID)
      }
    }

    else if ("Manafication" == effectLog.groups.effectName) {
      if (effectLog.groups.gainsLoses == "gains") {
        addStatus("manafication", parseInt(effectLog.groups.effectDuration) * 1000);
      }
      else if (effectLog.groups.gainsLoses == "loses") {
        removeStatus("manafication", player.ID)
      }
    }

    else if ("Swiftcast" == effectLog.groups.effectName) {
      if (effectLog.groups.gainsLoses == "gains") {
        addStatus("swiftcast", parseInt(effectLog.groups.effectDuration) * 1000);
        removeIcon("hardcast");
      }
      else if (effectLog.groups.gainsLoses == "loses") {
        removeStatus("swiftcast");
        rdmNext();
      }
    }
  }
}

// Main function
function rdmNext() {

  removeIcon("manafication");
  delete toggle.manafication;
  delete toggle.moulinet;

  if (enemyTargets > 1) {
    rdmMinimumMana = 50;  // Stay above 50/50 during AoE for Manafication
  }
  else {
    rdmMinimumMana = 40;
  }

  // Reprise if Reprise can guarantee proc
  if (player.level >= 60) {

    toggle.manafication = 1;  // Something being done with Manafication is this is on

    if (player.level >= 72
    && enemyTargets == 1
    && checkRecast("manafication") < 3500
    && player.jobDetail.whiteMana - 5 >= 50
    && player.jobDetail.blackMana - 5 < 50
    && checkStatus("verfireready") < rdmProcBufferTime + 2500) {
      addIcon("reprise");
    }
    else if (player.level >= 72
    && enemyTargets == 1
    && checkRecast("manafication") < 3500
    && player.jobDetail.blackMana - 5 >= 50
    && player.jobDetail.whiteMana - 5 < 50
    && checkStatus("verstoneready") < rdmProcBufferTime + 2500) {
      addIcon("reprise");
    }

    // Spend excess mana with Moulinet
    else if (player.level >= 60
    && Math.min(player.jobDetail.blackMana, player.jobDetail.whiteMana) >= 90
    && checkRecast("manafication") < 5000) {
      addIcon("moulinet");
    }
    else if (player.level >= 60
    && Math.min(player.jobDetail.blackMana, player.jobDetail.whiteMana) >= 70
    && checkRecast("manafication") < 3500) {
      addIcon("moulinet");
    }

    // Use Manafication if excess mana spent
    else if (player.level >= 60
    && checkRecast("manafication") < 1000
    && Math.min(player.jobDetail.blackMana, player.jobDetail.whiteMana) >= rdmMinimumMana
    && Math.max(player.jobDetail.blackMana, player.jobDetail.whiteMana) < 70) {
      addIcon("manafication");
    }

    else {
      delete toggle.manafication;
    }

  }

  if (!toggle.manafication
  && player.level >= 52) {

    toggle.moulinet = 1;

    if (player.level >= 68
    && Math.min(player.jobDetail.blackMana, player.jobDetail.whiteMana) >= 90
    && enemyTargets >= 2) {
      addIcon("moulinet");  // Moulinet at two targets to prevent capping
    }
    else if (player.level >= 68
    && Math.min(player.jobDetail.blackMana, player.jobDetail.whiteMana) > 70
    && enemyTargets >= 4) {
      addIcon("moulinet");  // Moulinet at four or more targets (staying above 50/50 for Manafication)
    }
    else if (player.level >= 60
    && Math.min(player.jobDetail.blackMana, player.jobDetail.whiteMana) > 70
    && enemyTargets >= 2) {
      addIcon("moulinet");  // Moulinet at four or more targets (staying above 50/50 for Manafication)
    }
    else if (Math.min(player.jobDetail.blackMana, player.jobDetail.whiteMana) >= 20
    && enemyTargets >= 2) {
      addIcon("moulinet");  // Moulinet whenever with no Manafication
    }

    else {
      delete toggle.moulinet;
    }

  }

  if (!toggle.moulinet) {
    // Single target
    if (player.level >= 68
    && Math.max(player.jobDetail.blackMana, player.jobDetail.whiteMana) >= 70) {
      // Attempt to fix procs before starting combos after 68
      rdmFixProcs();
    }

    else if (player.level < 68
    && Math.min(player.jobDetail.blackMana, player.jobDetail.whiteMana) >= 80) {
      rdmMeleeCombo();
    }
    else if (player.level < 50
    && Math.min(player.jobDetail.blackMana, player.jobDetail.whiteMana) >= 55) {
      rdmMeleeCombo();
    }
    else if (player.level < 35
    && Math.min(player.jobDetail.blackMana, player.jobDetail.whiteMana) >= 30) {
      rdmMeleeCombo();
    }
  }

  rdmDualcast();

}

function rdmDualcast() {

  rdmDualcastCombo = ["Hardcast", "Dualcast"];
  rdmDualcastComboValue = 0;
  previous.rdmDualcastValue = 0;

  for (i = 0; i < hardcast.length; i = i + 3) {
    for (j = 0; j < dualcast.length; j = j + 3) {
      if (rdmDualcastValue(hardcast[i], hardcast[i + 1], hardcast[i + 2], dualcast[j], dualcast[j + 1], dualcast[j + 2]) > previous.rdmDualcastValue) {
        rdmDualcastCombo = [hardcast[i], dualcast[j]];
        previous.rdmDualcastValue = rdmDualcastValue(hardcast[i], hardcast[i + 1], hardcast[i + 2], dualcast[j], dualcast[j + 1], dualcast[j + 2]);
      }
    }
  }

  if ("Jolt" == rdmDualcastCombo[0]) {
    addIcon("hardcast", "jolt");
  }
  else if ("Verfire" == rdmDualcastCombo[0]) {
    addIcon("hardcast", "verfire");
  }
  else if ("Verstone" == rdmDualcastCombo[0]) {
    addIcon("hardcast", "verstone");
  }
  else if ("Verthunder II" == rdmDualcastCombo[0]) {
    addIcon("hardcast", "verthunder2");
  }
  else if ("Veraero II" == rdmDualcastCombo[0]) {
    addIcon("hardcast", "veraero2");
  }
  else if ("Swiftcast" == rdmDualcastCombo[0]) {
    addIcon("hardcast", "swiftcast");
  }

  if ("Verthunder" == rdmDualcastCombo[1]) {
    addIcon("dualcast", "verthunder");
  }
  else if ("Veraero" == rdmDualcastCombo[1]) {
    addIcon("dualcast", "veraero");
  }
  else if ("Scatter" == rdmDualcastCombo[1]) {
    addIcon("dualcast", "scatter");
  }

  // console.log(rdmDualcastCombo[0] + " " + rdmDualcastCombo[1] + " " + previous.rdmDualcastValue);

}

function rdmDualcastValue(hardcastAction, hardcastBlackMana, hardcastWhiteMana, dualcastAction, dualcastBlackMana, dualcastWhiteMana) {

  // Calculate rdmDualcastManaPotency using latest values... probably
  rdmDualcastManaPotency = Math.max(rdmSingleTargetManaPotency, rdmMultiTargetManaPotency * enemyTargets);

  // Calculate initial value based on current mana potency
  rdmDualcastPotency = (hardcastBlackMana + dualcastBlackMana + hardcastWhiteMana + dualcastWhiteMana) * rdmDualcastManaPotency;

  // Calculates mana gain, adjusts value for wasted mana
  if (checkRecast("manafication") < 1000) {
    next.blackMana = Math.min(2 * (player.jobDetail.blackMana + hardcastBlackMana + dualcastBlackMana), 100);
    next.whiteMana = Math.min(2 * (player.jobDetail.whiteMana + hardcastWhiteMana + dualcastWhiteMana), 100);
    rdmDualcastPotency = rdmDualcastPotency - (Math.max(2 * (player.jobDetail.blackMana + hardcastBlackMana + dualcastBlackMana), 100) - 100) * rdmDualcastManaPotency;
    rdmDualcastPotency = rdmDualcastPotency - (Math.max(2 * (player.jobDetail.whiteMana + hardcastWhiteMana + dualcastWhiteMana), 100) - 100) * rdmDualcastManaPotency;
  }
  else {
    next.blackMana = Math.min(player.jobDetail.blackMana + hardcastBlackMana + dualcastBlackMana, 100);
    next.whiteMana = Math.min(player.jobDetail.whiteMana + hardcastWhiteMana + dualcastWhiteMana, 100);
    rdmDualcastPotency = rdmDualcastPotency - (Math.max(player.jobDetail.blackMana + hardcastBlackMana + dualcastBlackMana, 100) - 100) * rdmDualcastManaPotency;
    rdmDualcastPotency = rdmDualcastPotency - (Math.max(player.jobDetail.whiteMana + hardcastWhiteMana + dualcastWhiteMana, 100) - 100) * rdmDualcastManaPotency;
  }

  // Calculates mana after hardcast
  next.hardcastBlackManaMana = Math.min(player.jobDetail.blackMana + hardcastBlackMana, 100);
  next.hardcastWhiteManaMana = Math.min(player.jobDetail.whiteMana + hardcastWhiteMana, 100);

  // Assign value to spells
  if ("Jolt" == hardcastAction) {
    if (player.level >= 62) { // Trait
      rdmDualcastPotency = rdmDualcastPotency + 250;
    }
    else {
      rdmDualcastPotency = rdmDualcastPotency + 180;
    }
  }
  else if (checkStatus("verfireready") > 5000
  && "Verfire" == hardcastAction) {
    rdmDualcastPotency = rdmDualcastPotency + 270;
    if (player.jobDetail.blackMana < player.jobDetail.whiteMana) {
      rdmDualcastPotency = rdmDualcastPotency + 1;
    }
  }
  else if (checkStatus("verstoneready") > 5000
  && "Verstone" == hardcastAction) {
    rdmDualcastPotency = rdmDualcastPotency + 270;
    if (player.jobDetail.whiteMana < player.jobDetail.blackMana) {
      rdmDualcastPotency = rdmDualcastPotency + 1;
    }
  }
  else if (player.level >= 18
  && "Verthunder II" == hardcastAction) {
    if (player.level >= 78) { // Trait
      rdmDualcastPotency = rdmDualcastPotency + 120 * enemyTargets;
    }
    else {
      rdmDualcastPotency = rdmDualcastPotency + 100 * enemyTargets;
    }
    if (player.jobDetail.blackMana < player.jobDetail.whiteMana) {
      rdmDualcastPotency = rdmDualcastPotency + 1;
    }
  }
  else if (player.level >= 22
  && "Veraero II" == hardcastAction) {
    if (player.level >= 78) { // Trait
      rdmDualcastPotency = rdmDualcastPotency + 120 * enemyTargets;
    }
    else {
      rdmDualcastPotency = rdmDualcastPotency + 100 * enemyTargets;
    }
    if (player.jobDetail.whiteMana < player.jobDetail.blackMana) {
      rdmDualcastPotency = rdmDualcastPotency + 1;
    }
  }
  else if (player.level >= 18
  && checkRecast("swiftcast") < 0
  && "Swiftcast" == hardcastAction) {
    rdmDualcastPotency = rdmDualcastPotency + 35; // Not actually sure what it's worth, but this seems about right
  }
  else {
    rdmDualcastPotency = rdmDualcastPotency - 1000000;
  }
  checkRecast("swiftcast");

  if ("Verthunder" == dualcastAction) {
    rdmDualcastPotency = rdmDualcastPotency + 310 + 0.5 * rdmProcPotency;
    if (next.hardcastBlackManaMana < next.hardcastWhiteManaMana) {
      rdmDualcastPotency = rdmDualcastPotency + 1;
    }
  }
  else if ("Veraero" == dualcastAction) {
    rdmDualcastPotency = rdmDualcastPotency + 310 + 0.5 * rdmProcPotency;
    if (next.hardcastWhiteManaMana < next.hardcastBlackManaMana) {
      rdmDualcastPotency = rdmDualcastPotency + 1;
    }
  }
  else if (player.level >= 15
  && "Scatter" == dualcastAction) {
    if (player.level >= 66) { // Trait
      rdmDualcastPotency = rdmDualcastPotency + 220 * enemyTargets;
    }
    else {
      rdmDualcastPotency = rdmDualcastPotency + 120 * enemyTargets;
    }
  }
  else {
    rdmDualcastPotency = rdmDualcastPotency - 1000000;
  }

  // Penalizes unbalanced
  if (Math.abs(next.hardcastBlackManaMana - next.hardcastWhiteManaMana) > 30 || Math.abs(next.blackMana - next.whiteMana) > 30) {
    rdmDualcastPotency = rdmDualcastPotency - 1000000; // Just don't do it?
  }

  // Penalizes wasting 50% proc chance
  if (dualcastAction == "Verthunder"
  && hardcastAction != "Verfire"
  && checkStatus("verfireready") >= 5000) {
    rdmDualcastPotency = rdmDualcastPotency - 0.5 * rdmProcPotency;
  }
  else if (dualcastAction == "Veraero"
  && hardcastAction != "Verstone"
  && checkStatus("verstoneready") >= 5000) {
    rdmDualcastPotency = rdmDualcastPotency - 0.5 * rdmProcPotency;
  }

  // Finds combo transitions and adds proc value
  // if (Math.min(next.blackMana, next.whiteMana) >= 80) {
  //   if (player.level >= 70
  //   && next.blackMana > next.whiteMana
  //   && (checkStatus("verstoneready") < 5000 || hardcastAction == "Verstone")
  //   && dualcastAction != "Veraero") {
  //     rdmDualcastPotency = rdmDualcastPotency + rdmProcPotency; // Sets up for 100% proc Verholy
  //   }
  //   else if (player.level >= 68
  //   && next.blackMana < next.whiteMana
  //   && (checkStatus("verfireready") < 5000 || hardcastAction == "Verfire")
  //   && dualcastAction != "Verthunder") {
  //     rdmDualcastPotency = rdmDualcastPotency + rdmProcPotency; // Sets up for 100% proc Verflare
  //   }
  //   else if (player.level >= 70
  //   && next.blackMana <= next.whiteMana
  //   && (checkStatus("verstoneready") < 5000 || hardcastAction == "Verstone")
  //   && dualcastAction != "Veraero") {
  //     rdmDualcastPotency = rdmDualcastPotency + 0.2 * rdmProcPotency; // Sets up for 20% proc Verholy
  //   }
  //   else if (player.level >= 68
  //   && next.blackMana >= next.whiteMana
  //   && (checkStatus("verfireready") < 5000 || hardcastAction == "Verfire")
  //   && dualcastAction != "Verthunder") {
  //     rdmDualcastPotency = rdmDualcastPotency + 0.2 * rdmProcPotency; // Sets up for 20% proc Verflare
  //   }
  // }

  return rdmDualcastPotency;
}

function rdmFixProcs() {

  // Fix procs if able
  // Assumes at least level 68 (no point in doing so before that)

  // Procs already fixed - start combo
  if (player.level >= 70
  && Math.min(player.jobDetail.blackMana, player.jobDetail.whiteMana) >= 80
  && player.jobDetail.whiteMana < player.jobDetail.blackMana
  && checkStatus("verstoneready") < rdmProcBufferTime) {
    rdmVerholyCombo();  // Verholy combo
  }
  else if (player.jobDetail.blackMana < player.jobDetail.whiteMana
  && Math.min(player.jobDetail.blackMana, player.jobDetail.whiteMana) >= 80
  && checkStatus("verfireready") < rdmProcBufferTime) {
    rdmVerflareCombo();  // Verflare combo
  }

  // Searches for fixed proc
  else if (player.level >= 70
  && Math.min(player.jobDetail.whiteMana + 9, 100) < Math.min(player.jobDetail.blackMana + 11, 100)
  && Math.max(player.jobDetail.whiteMana + 9 - 100, 0) + Math.max(player.jobDetail.blackMana + 11 - 100, 0) < rdmManaBreakpoint
  && Math.min(player.jobDetail.whiteMana + 9, player.jobDetail.blackMana + 11) >= 80
  && checkStatus("verstoneready") >= 5000) {
    // Verstone > Verthunder > Verholy combo
    addIcon("hardcast", "verstone");
    addIcon("dualcast", "verthunder");
  }

  else if (Math.min(player.jobDetail.blackMana + 9, 100) < Math.min(player.jobDetail.whiteMana + 11, 100)
  && Math.max(player.jobDetail.blackMana + 9 - 100, 0) + Math.max(player.jobDetail.whiteMana + 11 - 100, 0) < rdmManaBreakpoint
  && Math.min(player.jobDetail.blackMana + 9, player.jobDetail.whiteMana + 11) >= 80
  && checkStatus("verfireready") >= 5000) {
    // Verfire > Veraero > Verflare combo
    addIcon("hardcast", "verfire");
    addIcon("dualcast", "veraero");
  }

  else if (player.level >= 70
  && player.jobDetail.whiteMana < Math.min(player.jobDetail.blackMana + 20, 100)
  && player.jobDetail.blackMana + 20 - 100 < rdmManaBreakpoint
  && Math.min(player.jobDetail.whiteMana, player.jobDetail.blackMana + 20) >= 80
  && checkStatus("verfireready") >= 5000
  && checkStatus("verstoneready") < rdmProcBufferTime + 5000) {
    // Verfire > Verthunder > Verholy combo
    addIcon("hardcast", "verfire");
    addIcon("dualcast", "verthunder");
  }

  else if (player.jobDetail.blackMana < Math.min(player.jobDetail.whiteMana + 20, 100)
  && player.jobDetail.whiteMana + 20 - 100 < rdmManaBreakpoint
  && Math.min(player.jobDetail.blackMana, player.jobDetail.whiteMana + 20) >= 80
  && checkStatus("verstoneready") >= 5000
  && checkStatus("verfireready") < rdmProcBufferTime + 5000) {
    // Verstone > Veraero > Verflare combo
    addIcon("hardcast", "verstone");
    addIcon("dualcast", "veraero");
  }

  else if (player.level >= 70
  && Math.min(player.jobDetail.whiteMana + 3, 100) < Math.min(player.jobDetail.blackMana + 14, 100)
  && Math.max(player.jobDetail.whiteMana + 3 - 100, 0) + Math.max(player.jobDetail.blackMana + 14 - 100, 0) < rdmManaBreakpoint
  && Math.min(player.jobDetail.whiteMana + 3, player.jobDetail.blackMana + 14) >= 80
  && checkStatus("verstoneready") < rdmProcBufferTime + 5000) {
    // Jolt > Verthunder > Verholy combo
    addIcon("hardcast", "jolt");
    addIcon("dualcast", "verthunder");
  }

  else if (Math.min(player.jobDetail.blackMana + 3, 100) < Math.min(player.jobDetail.whiteMana + 14, 100)
  && Math.max(player.jobDetail.blackMana + 3 - 100, 0) + Math.max(player.jobDetail.whiteMana + 14 - 100, 0) < rdmManaBreakpoint
  && Math.min(player.jobDetail.blackMana + 3, player.jobDetail.whiteMana + 14) >= 80
  && checkStatus("verfireready") < rdmProcBufferTime + 5000) {
    // Jolt > Veraero > Verflare combo
    addIcon("hardcast", "jolt");
    addIcon("dualcast", "veraero");
  }

  else if (player.level >= 70
  && player.jobDetail.whiteMana < Math.min(player.jobDetail.blackMana + 11, 100)
  && Math.max(player.jobDetail.blackMana + 11 - 100, 0) < rdmManaBreakpoint
  && Math.min(player.jobDetail.whiteMana, player.jobDetail.blackMana + 11) >= 80
  && checkStatus("verstoneready") < rdmProcBufferTime + 5000) {
    // Swiftcast > Verthunder > Verholy combo
    addIcon("hardcast", "swiftcast");
    addIcon("dualcast", "verthunder");
  }

  else if (player.jobDetail.blackMana < Math.min(player.jobDetail.whiteMana + 11, 100)
  && Math.max(player.jobDetail.whiteMana + 11 - 100, 0) < rdmManaBreakpoint
  && Math.min(player.jobDetail.blackMana, player.jobDetail.whiteMana + 11) >= 80
  && checkStatus("verfireready") < rdmProcBufferTime + 5000) {
    // Swiftcast > Veraero > Verflare combo
    addIcon("hardcast", "swiftcast");
    addIcon("dualcast", "veraero");
  }

  // Nothing above matches but already 80+/80+
  else if (Math.min(player.jobDetail.blackMana, player.jobDetail.whiteMana) >= 80) {

    // Try for 20% proc
    if (player.level >= 70
    && player.jobDetail.whiteMana + 20 - player.jobDetail.blackMana <= 30
    && checkStatus("verstoneready") < rdmProcBufferTime) {
      rdmVerholyCombo();  // Verholy combo
    }
    else if (player.jobDetail.blackMana + 20 - player.jobDetail.whiteMana <= 30
    && checkStatus("verfireready") < rdmProcBufferTime) {
      rdmVerflareCombo();  // Verflare combo
    }

    // Just do something
    else if (player.level >= 70
    && player.jobDetail.blackMana >= player.jobDetail.whiteMana) {
      rdmVerholyCombo();  // Verholy combo
    }
    else {
      rdmVerflareCombo();  // Verflare combo
    }

  }

  // Dualcast
  else {
    rdmDualcast();
  }

}

function rdmComboTimeout() {
  clearTimeout(timeout.combo);
  timeout.combo = setTimeout(rdmNext, 12500);
}

function rdmMeleeCombo() {
  toggle.combo = 1;
  addIcon("riposte");
  if (player.level >= 35) {
    addIcon("zwerchhau");
  }
  if (player.level >= 50) {
    addIcon("redoublement");
  }
}

function rdmVerflareCombo() {
  toggle.combo = 3;
  addIcon("riposte");
  addIcon("zwerchhau");
  addIcon("redoublement");
  addIcon("verflare");
  if (player.level >= 80) {
    addIcon("scorch");
  }
}

function rdmVerholyCombo() {
  toggle.combo = 4;
  addIcon("riposte");
  addIcon("zwerchhau");
  addIcon("redoublement");
  addIcon("verholy");
  if (player.level >= 80) {
    addIcon("scorch");
  }
}

// function rdmManafication() {
//
//   if (player.level >= 60
//   && checkRecast("manafication") < 0
//   && !toggle.combo) {
//
//     // Don't use Manafication if more than 28 away from 50/50
//     if (Math.abs(player.jobDetail.blackMana - 50) + Math.abs(player.jobDetail.whiteMana - 50) > 28) {
//       removeIcon("manafication");
//       delete toggle.manafication;
//     }
//
//     else if (enemyTargets >= 4
//     && Math.min(player.jobDetail.blackMana, player.jobDetail.whiteMana) >= 50) {
//       addIcon("manafication");
//       toggle.manafication = Date.now();
//     }
//
//     else if (enemyTargets >= 2
//     && Math.min(player.jobDetail.blackMana, player.jobDetail.whiteMana) >= 50) {
//       addIcon("manafication");
//       toggle.manafication = Date.now();
//     }
//
//     // Early Manafication if able to proc from Verholy
//     else if (player.level >= 70
//     && Math.min(player.jobDetail.blackMana, player.jobDetail.whiteMana) >= 40
//     && player.jobDetail.whiteMana < 50
//     && player.jobDetail.blackMana > player.jobDetail.whiteMana
//     && checkStatus("verstoneready") < 2500) {
//       addIcon("manafication");
//       toggle.manafication = Date.now();
//     }
//
//     // Early Manafication if able to proc from Verflare
//     else if (player.level >= 68
//     && Math.min(player.jobDetail.blackMana, player.jobDetail.whiteMana) >= 40
//     && player.jobDetail.blackMana < 50
//     && player.jobDetail.whiteMana > player.jobDetail.blackMana
//     && checkStatus("verfireready") < 2500) {
//       addIcon("manafication");
//       toggle.manafication = Date.now();
//     }
//
//     // Use if otherwise over 40/40
//     else if (player.level >= 60
//     && Math.min(player.jobDetail.blackMana, player.jobDetail.whiteMana) >= 40) {
//       addIcon("manafication");
//       toggle.manafication = Date.now();
//     }
//
//     else {
//       // Hide otherwise?
//       removeIcon("manafication");
//       delete toggle.manafication;
//     }
//   }
//   else {
//     removeIcon("manafication");
//     delete toggle.manafication;
//   }
// }
