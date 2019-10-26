"use strict";

// Test file for new functions

// New addIcon thing
// Basically, let img = document.createElement("img"); img.setAttribute("src", "https://..."); document.body.appendChild(img); creates a new image, modifies the image location and then places it directly inside the <body> tag.

function testAddIcon({
  name,
  img = name,
  priority = "normal",
  order = parseInt(document.getElementById(priority + "-priority").lastElementChild.style.order) + 1,
} = {}) {

  if (!document.getElementById(name)) {
    var addIconDiv = document.createElement("div");
    var addIconImg = document.createElement("img");
    var addIconOverlay = document.createElement("img");
    addIconDiv.id = name;
    addIconDiv.className = "new-icon-add";
  }

  else {
    var addIconDiv = document.getElementById(name);
    var addIconImg = document.getElementById(name + "-img");
    var addIconOverlay = document.getElementById(name + "-overlay");
  }

  addIconDiv.style.order = order;
  addIconImg.id = name + "-img";
  addIconImg.src = "icon/" + icon[name] + ".png";
  addIconImg.className = "new-iconimg";
  addIconOverlay.id = name + "-overlay";
  addIconOverlay.className = "iconoverlay";
  addIconOverlay.src = "icon/overlay.png";

  if (!document.getElementById(name)) {
    document.getElementById(priority + "-priority").appendChild(addIconDiv);
    document.getElementById(name).appendChild(addIconImg);
    document.getElementById(name).appendChild(addIconOverlay);
  }
}

function testRemoveIcon({
  name,
  priority = "normal",
} = {}) {
  let removeTarget = document.getElementById(name);
  removeTarget.className = "new-icon-remove";
  setTimeout(function(){removeTarget.parentNode.removeChild(removeTarget);}, removeAnimationTime);
}


function testDualcast() {

  rdmBlackManaPrediction = player.jobDetail.blackMana;
  rdmWhiteManaPrediction = player.jobDetail.whiteMana;
  rdmDualcastLoop = 1;

  // Loops at least once
  do {

    for (i = 0; i < rdmHardcastSpells.length; i = i + 1) {
      for (j = 0; j < rdmDualcastSpells.length; j = j + 1) {

        let newValue = testDualcastValue({blackMana: rdmManaArray[0][0], whiteMana: rdmManaArray[0][1],
        hardcastAction: rdmHardcastSpells[i][0], hardcastBlackMana: rdmHardcastSpells[i][1], hardcastWhiteMana: rdmHardcastSpells[i][2],
        dualcastAction: rdmDualcastSpells[j][0], dualcastBlackMana: rdmDualcastSpells[j][1], dualcastWhiteMana: rdmDualcastSpells[j][2]})

        if (
          newValue > rdmBestDualcastValue
        ) {

          rdmDualcastCombo = [rdmHardcastSpells[i][0], rdmDualcastSpells[j][0]];
          rdmBestDualcastValue = newValue;

        }
      }
    }

      

  }
  while (rdmDualcastLoop == 1);

}


function testDualcastValue({
  blackMana,
  whiteMana,
  hardcastAction,
  hardcastBlackMana,
  hardcastWhiteMana,
  dualcastAction,
  dualcastBlackMana,
  dualcastWhiteMana,
  verStoneReady = 0,
  verFireReady = 0,
} = {}) {

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
