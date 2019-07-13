// old

// function rdmDualcast() {
//
//   // Reset all icons because double calls that result in "cancelled" combos are common
//
//
//   addText("debug1", "");
//
//   // Set gauge target/cap
//
//   if (player.level < 35) {
//     gauge.target = 30;
//     gauge.cap = 100;
//   }
//   else if (player.level < 50) {
//     gauge.target = 55;
//     gauge.cap = 100;
//   }
//   else if (player.level >= 60
//   && player.jobDetail.blackMana + player.jobDetail.whiteMana - 100 <= 28
//   && checkCooldown("manafication", player.name) < 0) {
//     gauge.target = 43;
//     gauge.cap = 50;
//   }
//   else {
//     gauge.target = 80;
//     gauge.cap = 100;
//   }
//
//   // Activate combo if already set up
//
//   if (player.level >= 70
//   && Math.min(player.jobDetail.blackMana, player.jobDetail.whiteMana) >= 80
//   && player.jobDetail.blackMana > player.jobDetail.whiteMana
//   && checkStatus("verstoneready", player.name) < 0) {
//     addText("debug1", "Verholy (100% proc)");
//     rdmHolyCombo();
//   }
//
//   else if (player.level >= 68
//   && Math.min(player.jobDetail.blackMana, player.jobDetail.whiteMana) >= 80
//   && player.jobDetail.whiteMana > player.jobDetail.blackMana
//   && checkStatus("verfireready", player.name) < 0) {
//     addText("debug1", "Start combo - Verflare (100% proc)");
//     rdmFlareCombo();
//   }
//
//   // Fix mana before combos
//
//   else if (player.level >= 70
//   && player.jobDetail.whiteMana + 9 >= gauge.target
//   && player.jobDetail.whiteMana + 9 < gauge.cap
//   && Math.min(player.jobDetail.blackMana + 11, gauge.cap) > player.jobDetail.whiteMana + 9
//   && checkStatus("verstoneready", player.name) > 0
//   && checkStatus("verfireready", player.name) > 0) {
//     addText("debug1", "Ignore Verfire Ready, set up Verholy");
//     addIcon(nextid.hardcast,icon.verstone);
//     addIcon(nextid.dualcast,icon.verthunder);
//   }
//
//   else if (player.jobDetail.blackMana + 9 >= gauge.target
//   && player.jobDetail.blackMana + 9 < gauge.cap
//   && Math.min(player.jobDetail.whiteMana + 11, gauge.cap) > player.jobDetail.blackMana + 9
//   && checkStatus("verfireready", player.name) > 0
//   && checkStatus("verstoneready", player.name) > 0) {
//     addText("debug1", "Ignore Verstone Ready, set up Verflare");
//     addIcon(nextid.hardcast,icon.verfire);
//     addIcon(nextid.dualcast,icon.veraero);
//   }
//
//   else if (player.level >= 70
//   && player.jobDetail.whiteMana >= gauge.target
//   && Math.min(player.jobDetail.blackMana + 20, gauge.cap) > player.jobDetail.whiteMana
//   && checkStatus("verfireready", player.name) > 0
//   && checkStatus("verstoneready", player.name) < 0) {
//     addText("debug1", "Set up Verholy");
//     addIcon(nextid.hardcast,icon.verfire);
//     addIcon(nextid.dualcast,icon.verthunder);
//   }
//
//   else if (player.jobDetail.blackMana >= gauge.target
//   && Math.min(player.jobDetail.whiteMana + 20, gauge.cap) > player.jobDetail.blackMana
//   && checkStatus("verstoneready", player.name) > 0
//   && checkStatus("verfireready", player.name) < 0) {
//     addText("debug1", "Set up Verflare");
//     addIcon(nextid.hardcast,icon.verstone);
//     addIcon(nextid.dualcast,icon.veraero);
//   }
//
//   else if (player.level >= 70
//   && player.jobDetail.whiteMana + 9 >= gauge.target
//   && Math.min(player.jobDetail.blackMana + 11, gauge.cap) > player.jobDetail.whiteMana + 9
//   && checkStatus("verstoneready", player.name) > 0
//   && checkStatus("verfireready", player.name) < 0) {
//     addText("debug1", "Set up Verholy");
//     addIcon(nextid.hardcast,icon.verstone);
//     addIcon(nextid.dualcast,icon.verthunder);
//   }
//
//   else if (player.jobDetail.blackMana + 9 >= gauge.target
//   && Math.min(player.jobDetail.whiteMana + 11, gauge.cap) > player.jobDetail.blackMana + 9
//   && checkStatus("verfireready", player.name) > 0
//   && checkStatus("verstoneready", player.name) < 0) {
//     addText("debug1", "Set up Verflare");
//     addIcon(nextid.hardcast,icon.verfire);
//     addIcon(nextid.dualcast,icon.veraero);
//   }
//
//   else if (player.level >= 70
//   && player.jobDetail.whiteMana >= gauge.target
//   && Math.min(player.jobDetail.blackMana + 11, gauge.cap) > player.jobDetail.whiteMana
//   && checkCooldown("swiftcast", player.name) < 0
//   && checkStatus("verstoneready", player.name) < 0) {
//     addText("debug1", "Set up Verholy");
//     addIcon(nextid.hardcast,icon.swiftcast);
//     addIcon(nextid.dualcast,icon.verthunder);
//   }
//
//   else if (player.jobDetail.blackMana >= gauge.target
//   && Math.min(player.jobDetail.whiteMana + 11, gauge.cap) > player.jobDetail.blackMana
//   && checkCooldown("swiftcast", player.name) < 0
//   && checkStatus("verfireready", player.name) < 0) {
//     addText("debug1", "Set up Verflare");
//     addIcon(nextid.hardcast,icon.swiftcast);
//     addIcon(nextid.dualcast,icon.veraero);
//   }
//
//   else if (player.level >= 70
//   && player.jobDetail.whiteMana + 3 >= gauge.target
//   && Math.min(player.jobDetail.blackMana + 14, gauge.cap)> player.jobDetail.whiteMana + 3
//   && checkStatus("verstoneready", player.name) < 0) {
//     addText("debug1", "Set up Verholy");
//     addIcon(nextid.hardcast,icon.jolt);
//     addIcon(nextid.dualcast,icon.verthunder);
//   }
//
//   else if (player.jobDetail.blackMana + 3 >= gauge.target
//   && Math.min(player.jobDetail.whiteMana + 14, gauge.cap)> player.jobDetail.blackMana + 3
//   && checkStatus("verfireready", player.name) < 0) {
//     addText("debug1", "Set up Verflare");
//     addIcon(nextid.hardcast,icon.jolt);
//     addIcon(nextid.dualcast,icon.veraero);
//   }
//
//   // Unfixable mana situations
//
//   else if (player.level >= 70
//   && Math.min(player.jobDetail.blackMana, player.jobDetail.whiteMana) >= 80) {
//     if (player.jobDetail.whiteMana + 20 - player.jobDetail.blackMana <= 30
//     && checkStatus("verstoneready", player.name) < 0) {
//       addText("debug1", "Start combo (cannot fix mana for 100%)");
//       rdmHolyCombo();
//     }
//     else if (player.jobDetail.blackMana + 20 - player.jobDetail.whiteMana <= 30
//     && checkStatus("verfireready", player.name) < 0) {
//       addText("debug1", "Start combo (cannot fix mana for 100%)");
//       rdmFlareCombo();
//     }
//     else if (player.jobDetail.whiteMana > player.jobDetail.blackMana) {
//       addText("debug1", "Start combo (cannot fix mana for 20%)");
//       rdmFlareCombo();
//     }
//     else {
//       addText("debug1", "Start combo (cannot fix mana for 20%)");
//       rdmHolyCombo();
//     }
//   }
//
//   else if (player.level >= 68
//   && Math.min(player.jobDetail.blackMana, player.jobDetail.whiteMana) >= 80) {
//     addText("debug1", "Start combo");
//     rdmFlareCombo();
//   }
//
//   // Normal Dualcasts
//
//   else if (checkStatus("verfireready", player.name) > 5000 && checkStatus("verstoneready", player.name) > 5000) {
//     if (player.jobDetail.blackMana >= player.jobDetail.whiteMana) {
//       addText("debug1", "Using Verstone");
//       addIcon(nextid.hardcast,icon.verstone);
//       addIcon(nextid.dualcast,icon.veraero);
//     }
//     else {
//       addText("debug1", "Using Verfire");
//       addIcon(nextid.hardcast,icon.verfire);
//       addIcon(nextid.dualcast,icon.verthunder);
//     }
//   }
//
//   else if (checkStatus("verfireready", player.name) > 5000) {
//
//     addText("debug1", "Using Verfire");
//
//     if (Math.min(player.jobDetail.blackMana + 9, 100) - player.jobDetail.whiteMana > 30) {
//       addText("debug1", "Ignoring Verfire to keep balance");
//       addIcon(nextid.hardcast,icon.jolt);
//       addIcon(nextid.dualcast,icon.veraero);
//     }
//
//     else if (player.jobDetail.blackMana + 9 < player.jobDetail.whiteMana) {
//       addIcon(nextid.hardcast,icon.verfire);
//       addIcon(nextid.dualcast,icon.verthunder);
//     }
//
//     else {
//       addIcon(nextid.hardcast,icon.verfire);
//       addIcon(nextid.dualcast,icon.veraero);
//     }
//   }
//
//   // Verstone Ready
//
//   else if (checkStatus("verstoneready", player.name) > 5000) {
//
//     addText("debug1", "Using Verstone");
//
//     if (Math.min(player.jobDetail.whiteMana + 9, 100) - player.jobDetail.blackMana > 30) {
//       addText("debug1", "Ignoring Verstone to keep balance");
//       addIcon(nextid.hardcast,icon.jolt);
//       addIcon(nextid.dualcast,icon.verthunder);
//     }
//
//     else if (player.jobDetail.whiteMana + 9 < player.jobDetail.blackMana) {
//       addIcon(nextid.hardcast,icon.verstone);
//       addIcon(nextid.dualcast,icon.veraero);
//     }
//
//     else {
//       addIcon(nextid.hardcast,icon.verstone);
//       addIcon(nextid.dualcast,icon.verthunder);
//     }
//   }
//
//   // Swiftcast
//
//   else if (checkCooldown("swiftcast", player.name) < 0) {
//
//     addText("debug1", "Using Swiftcast");
//
//     addIcon(nextid.hardcast,icon.swiftcast);
//
//     if (player.jobDetail.blackMana + 11 == player.jobDetail.whiteMana) {
//       addText("debug1", "Avoiding equal mana with Swiftcast");
//       addIcon(nextid.dualcast,icon.veraero);
//     }
//
//     else if (player.jobDetail.blackMana == player.jobDetail.whiteMana + 11) {
//       addText("debug1", "Avoiding equal mana with Swiftcast");
//       addIcon(nextid.dualcast,icon.verthunder);
//     }
//
//     else if (player.jobDetail.blackMana >= player.jobDetail.whiteMana) {
//       addIcon(nextid.dualcast,icon.veraero);
//     }
//
//     else {
//       addIcon(nextid.dualcast,icon.verthunder);
//     }
//   }
//
//   // Jolt
//
//   else {
//     addText("debug1", "Using Jolt");
//
//     addIcon(nextid.hardcast,icon.jolt);
//
//     if (player.jobDetail.blackMana >= player.jobDetail.whiteMana) {
//       addIcon(nextid.dualcast,icon.veraero);
//     }
//     else {
//       addIcon(nextid.dualcast,icon.verthunder);
//     }
//   }
// }







white black

jolt > Verthunder  +3 +14
jolt > veraero  +14 +3
verfire > Verthunder +0 +20
verfire > Veraero +11 +9
verstone > Verthunder +9 +11
verstone > Veraero +20 +0
swiftcast > Verthunder
swiftcast > veraero

++++ sets up verholy
++++ sets up Verflare
++++ sets up manafication > Verholy
++++ sets up manafication > Verflare

+++ Uses proc
++ Uses Swiftcast
+ minimizes mana gap

- overwrites proc
-- overcap by X
--- unbalance
---- can't actually do it (no proc)

jolt Verthunder

black = 14
white = 3

var priority

if black +


function rdmDualcastValue(hardcastaction, dualcastaction, black, white, manafication) {

  // Calculates mana after dualcast and manafication
  if (manafication == 1) {
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
    value = value - (Math.max(2 * (player.jobDetail.blackMana + black), 100) - 100);
    value = value - (Math.max(2 * (player.jobDetail.whiteMana + white), 100) - 100);
  }
  else {
    value = value - (Math.max(player.jobDetail.blackMana + black, 100) - 100);
    value = value - (Math.max(player.jobDetail.whiteMana + white, 100) - 100);
  }

  // Penalizes unbalanced
  if (Math.abs(next.blackMana - next.whiteMana) > 30) {
    value = value - 1000000;
  }

  // Penalizes unbalanced upon Verfire/Verstone
  else if (hardcastaction == "Verfire"
  && Math.abs(Math.min(player.jobDetail.blackMana + 9, 100) - player.jobDetail.whiteMana) > 30) {
    value = value - 1000000;
  }
  else if (hardcastaction == "Verstone"
  && Math.abs(player.jobDetail.blackMana - Math.min(player.jobDetail.whiteMana + 9, 100)) > 30) {
    value = value - 1000000;
  }

  // Penalizes overwriting

  if (dualcastaction == "Verthunder"
  && hardcastaction != "Verfire"
  && checkStatus("verfireready", player.name) >= 5000) {
    value = value - 1000;
  }
  else if (dualcastaction == "Veraero"
  && hardcastaction != "Verstone"
  && checkStatus("verstoneready", player.name) >= 5000) {
    value = value - 1000;
  }

  // Priority to Verfire, Verstone, and Swiftcast
  if (hardcastaction == "Verfire" || hardcastaction == "Verstone") {
    value = value + 100;
  }
  else if (hardcastaction == "Swiftcast") {
    value = value + 100;
  }

  // Looks for fix above 80/80
  if (Math.min(player.jobDetail.blackMana, player.jobDetail.whiteMana) >= 80) {

    if (player.level >= 70
    && next.blackMana > next.whiteMana
    && (checkStatus("verstoneready", player.name) < 5000 || hardcastaction == "Verstone")
    && dualcastaction != "Veraero") {
      value = value + 10000; // Sets up for 100% proc Verholy
    }

    else if (player.level >= 68
    && next.blackMana < next.whiteMana
    && (checkStatus("verfireready", player.name) < 5000 || hardcastaction == "Verfire")
    && dualcastaction != "Verthunder") {
      value = value + 10000; // Sets up for 100% proc Verflare
    }

    else if (player.level >= 70
    && next.blackMana <= next.whiteMana
    && (checkStatus("verstoneready", player.name) < 5000 || hardcastaction == "Verstone")
    && dualcastaction != "Veraero") {
      value = value + 1000; // Sets up for 20% proc Verholy
    }

    else if (player.level >= 68
    && next.blackMana >= next.whiteMana
    && (checkStatus("verfireready", player.name) < 5000 || hardcastaction == "Verfire")
    && dualcastaction != "Verthunder") {
      value = value + 1000; // Sets up for 20% proc Verflare
    }

    else {
      value = value + 10; // He's dead Jim
    }
  }

  // Looks for combo after dualcast
  else if (Math.min(next.blackMana, next.whiteMana) >= 80) {

    if (player.level >= 70
    && next.blackMana > next.whiteMana
    && (checkStatus("verstoneready", player.name) < 5000 || hardcastaction == "Verstone")
    && dualcastaction != "Veraero") {
      value = value + 10000; // Sets up for 100% proc Verholy
    }

    else if (player.level >= 68
    && next.blackMana < next.whiteMana
    && (checkStatus("verfireready", player.name) < 5000 || hardcastaction == "Verfire")
    && dualcastaction != "Verthunder") {
      value = value + 10000; // Sets up for 100% proc Verflare
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


}

rdmPriority(black1,black,white1,white) {

  // b1/w1 = after hardcast ("step 1")
  // b2/w2 = after dualcast (TOTAL)

  // Check for Unbalanced situations
  if (Math.abs((player.jobDetail.blackMana + black1) - (player.jobDetail.whiteMana + white1) > 30) {
    // Lowest possible
  }
  else if (Math.abs((player.jobDetail.blackMana + black) - (player.jobDetail.whiteMana + white) > 30) {
    // Lowest possible
  }
  else {
    // No gain/loss
  }

  // Check for



}
