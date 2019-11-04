'use strict';

// Test file for new functions

// New addIcon thing
// Basically, let img = document.createElement("img"); img.setAttribute("src", "https://..."); document.body.appendChild(img); creates a new image, modifies the image location and then places it directly inside the <body> tag.


let testDualcastPotency;
let testBestDualcastValue;
// let priorityArray = [];
// let cooldownArray = [];
let rdmUnbalancedBonus = 1;

// function testAddAction({
//   name,
//   icon = name,
//   array = defaultArray,
//   effect = "none",
// } = {}) {
//
//   array.push({name: name, icon: icon, effect: effect});
//
//   testAddIcon({name: name, icon: icon, array: array, effect: effect});
//
// }

// function testAddIcon({
//   name,
//   img = name,
//   array = defaultArray,
//   effect = "none",
// } = {}) {
//   let row = "default-row"
//
//   if (array == defaultArray) {
//     let row = "default-row"
//   }
//
//   let iconDiv = document.createElement("div");
//   let iconImg = document.createElement("img");
//   let iconOverlay = document.createElement("img");
//   document.getElementById(row).appendChild(iconDiv);
//   document.getElementById(row).lastElementChild.appendChild(iconImg);
//   //document.getElementById(row).children[i].appendChild(iconOverlay);
//
//   iconDiv.className = "new-icondiv";
//   iconImg.className = "new-iconimg";
//   iconImg.src = "icon/" + icon[img] + ".png";
//   //console.log(array[i].icon);
//   iconOverlay.className = "new-iconoverlay";
//   iconOverlay.src = "icon/overlay.png";
//
//
// }

function tesasdftRemoveAction({
  name,
} = {}) {
  const removeTarget = actionArray.findIndex((x) => x.name === name);

  if (removeTarget > -1) {
    actionArray.splice(removeTarget, 1);
    document.getElementById('action-row').children[removeTarget].className = 'icondiv icon-remove';
  }
}

// Use this function after every "next" prediction to clean up the bars.asd



//
// function testAddIcon({
//   name,
//   img = name,
//   row = "default-row",
//   order = parseInt(document.getElementById(priority + "-priority").lastElementChild.style.order) + 1,
// } = {}) {
//
//   if (!document.getElementById(name)) {
//     var addIconDiv = document.createElement("div");
//     var addIconImg = document.createElement("img");
//     var addIconOverlay = document.createElement("img");
//     //addIconDiv.id = name;
//     addIconDiv.className = "icon-add";
//   }
//
//   else {
//     var addIconDiv = document.getElementById(name);
//     var addIconImg = document.getElementById(name + "-img");
//     var addIconOverlay = document.getElementById(name + "-overlay");
//   }
//
//   addIconDiv.style.order = order;
//   //addIconImg.id = name + "-img";
//   addIconImg.src = "icon/" + icon[img] + ".png";
//   addIconImg.className = "new-iconimg";
//   //addIconOverlay.id = name + "-overlay";
//   addIconOverlay.className = "new-iconoverlay";
//   addIconOverlay.src = "icon/overlay.png";
//
//   if (!document.getElementById(name)) {
//     document.getElementById(priority + "-priority").appendChild(addIconDiv);
//     document.getElementById(name).appendChild(addIconImg);
//     document.getElementById(name).appendChild(addIconOverlay);
//   }
// }

// function testRemoveIcon({
//   name,
//   priority = "normal",
// } = {}) {
//   let removeTarget = document.getElementById(name);
//   removeTarget.className = "new-icon-remove";
// setTimeout(function(){removeTarget.parentNode.removeChild(removeTarget);}, removeAnimationTime);
// }
function rasddmDualcast() {

  let dualcastArray = [];

  const hardcastSpells = [
    ['jolt', 3, 3],
    ['verfire', 9, 0],
    ['verstone', 0, 9],
    ['verthunder2', 7, 0],
    ['veraero2', 0, 7],
    ['swiftcast', 0, 0],
  ];

  const dualcastSpells = [
    ['verthunder', 11, 0],
    ['veraero', 0, 11],
    ['scatter', 3, 3],
  ];

  let { blackMana } = player.jobDetail;
  let { whiteMana } = player.jobDetail;
  let dualcastLoop = 0;
  let manaTarget = 100;
  let bestDualcastCombo = [];
  let bestPotency = 0;
  let potency = 0;

  let verfireReadyTime = checkStatus('verfireready');
  let verstoneReadyTime = checkStatus('verstoneready');

  // Loops at least once
  do {
    // Calculate mana target for when to stop loop

    if (checkRecast("manafication") < 5000 * dualcastLoop) {
      if (count.targets >= 3) {
        manaTarget = 50;
      }
      else {
        manaTarget = 40;
      }
    }

    else if (count.targets >= 3) {
      manaTarget = 70;
    }
    else {
      manaTarget = 80;
    }

    // Loops through every hardcast/dualcast combination to find most valuable one
    for (let i = 0; i < hardcastSpells.length; i += 1) {
      for (let j = 0; j < dualcastSpells.length; j += 1) {
        potency = testDualcastValue({
          blackMana,
          whiteMana,
          hardcastAction: hardcastSpells[i][0],
          hardcastBlackMana: hardcastSpells[i][1],
          hardcastWhiteMana: hardcastSpells[i][2],
          dualcastAction: dualcastSpells[j][0],
          dualcastBlackMana: dualcastSpells[j][1],
          dualcastWhiteMana: dualcastSpells[j][2],
          verfireReady: verfireReadyTime - 5000 * dualcastLoop - 1,
          verstoneReady: verstoneReadyTime - 5000 * dualcastLoop - 1,
          acceleration: 0,
          swiftcast: 0});
        if (potency > bestPotency) {
          bestPotency = potency;
          bestDualcastCombo = [
            hardcastSpells[i][0],
            dualcastSpells[j][0],
            hardcastSpells[i][1] + dualcastSpells[j][1],
            hardcastSpells[i][2] + dualcastSpells[j][2],
            bestPotency
          ];
        }
      }
    }

    if (bestDualcastCombo[0] == "verfire") {
      verfireReadyTime = 0;
    }
    else if (bestDualcastCombo[0] == "verstone") {
      verstoneReadyTime = 0;
    }

    //actionArray[dualcastLoop] = [bestDualcastCombo[0],bestDualcastCombo[1]];

    dualcastArray.push({name: 'hardcast', icon: bestDualcastCombo[0] });
    dualcastArray.push({name: 'dualcast', icon: bestDualcastCombo[1] });
    // defaultArray.push({name: hardcast, icon: "icons/" + icon[bestDualcastCombo[0]] + ".png"});
    // defaultArray.push({name: dualcast, icon: bestDualcastCombo[1]});

    // testAddIcon({name: "hardcast-" + dualcastLoop, img: bestDualcastCombo[0]});
    // testAddIcon({name: "dualcast-" + dualcastLoop, img: bestDualcastCombo[1]});

    blackMana += bestDualcastCombo[2];
    whiteMana += bestDualcastCombo[3];
    dualcastLoop += 1;

    // Set up for next loop
    bestPotency = 0;
  } while (Math.min(blackMana, whiteMana) < manaTarget);

  console.log(JSON.stringify(dualcastArray));

  defaultArray = dualcastArray;
  // testSyncActionIcons();
  testSyncActionIcons();
}


function testDualcastValue({
  blackMana = 0,
  whiteMana = 0,
  hardcastAction = "hardcast",
  hardcastBlackMana = 0,
  hardcastWhiteMana = 0,
  dualcastAction = "dualcast",
  dualcastBlackMana = 0,
  dualcastWhiteMana = 0,
  verstoneReady = 0,
  verfireReady = 0,
  acceleration = 0,
  swiftcast = 0
} = {}) {

  const singleTargetManaPotency = 8.07;
  const multiTargetManaPotency = 2.43;  // Per target
  const procPotency = 20;
  const manaBreakpoint = 5;  // "If you lose this much mana fixing your procs, you have not gained potency."

  // Find Hardcasted action potency
  let hardcastPotency = 0;


  if (Math.abs(
    Math.min(
      blackMana + hardcastBlackMana, 100
    ) -
    Math.min(
      whiteMana + hardcastWhiteMana, 100
    )) > 30) {
    hardcastPotency = -1000000;
  }

  else if ("jolt" == hardcastAction) {
    if (player.level >= 62) { // Trait
      hardcastPotency = 250;
    }
    else {
      hardcastPotency = 180;
    }
  }

  else if (verfireReady > 5000
  && "verfire" == hardcastAction) {
    hardcastPotency = 270;
  }

  else if (verstoneReady > 5000
  && "verstone" == hardcastAction) {
    hardcastPotency = 270;
  }

  else if (player.level >= 18
  && "verthunder2" == hardcastAction) {
    if (player.level >= 78) { // Trait
      hardcastPotency = 120 * count.targets;
    }
    else {
      hardcastPotency = 100 * count.targets;
    }
  }

  else if (player.level >= 22
  && "veraero2" == hardcastAction) {
    if (player.level >= 78) { // Trait
      hardcastPotency = 120 * count.targets;
    }
    else {
      hardcastPotency = 100 * count.targets;
    }
  }

  else if (player.level >= 18
  && swiftcast < 0
  && "swiftcast" == hardcastAction) {
    hardcastPotency = 35; // Not actually sure what it's worth
  }

  else {
    hardcastPotency = -1000000;
  }

  // Find Dualcasted action potency

  let dualcastPotency = 0;


  if (Math.abs(
    Math.min(
      blackMana + hardcastBlackMana + dualcastBlackMana, 100
    ) -
    Math.min(
      whiteMana + hardcastWhiteMana + dualcastWhiteMana, 100
    )) > 30) {
    dualcastPotency = -1000000;
  }

  else if ("verthunder" == dualcastAction) {
    dualcastPotency = 310;
  }

  else if ("veraero" == dualcastAction) {
    dualcastPotency = 310;
  }

  else if (player.level >= 15
  && "scatter" == dualcastAction) {
    if (player.level >= 66) { // Trait
      dualcastPotency = 220 * count.targets;
    } else {
      dualcastPotency = 120 * count.targets;
    }
  } else {
    dualcastPotency = -1000000;
  }

  let newBlackMana = Math.min(blackMana + hardcastBlackMana + dualcastBlackMana, 100);
  let newWhiteMana = Math.min(whiteMana + hardcastWhiteMana + dualcastWhiteMana, 100);

  let manaDifferenceModifier = Math.abs(newBlackMana - newWhiteMana);
  let potency =
  hardcastPotency + dualcastPotency
  + (newBlackMana + newWhiteMana - blackMana - whiteMana)
  * Math.max(singleTargetManaPotency, count.targets * multiTargetManaPotency)
  - manaDifferenceModifier;

  // console.log(newBlackMana + "|" + newWhiteMana + "|" + potency);
  // console.log(hardcastAction+dualcastAction+potency);
  return potency;
}
