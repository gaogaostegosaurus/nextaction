"use strict";

actionList.gnb = [

  // Non-GCD
  "No Mercy",
  "Danger Zone", "Blasting Zone",
  "Rough Divide",
  "Bow Shock",
  // "Jugular Rip", "Abdomen Tear", "Eye Gouge",
  "Bloodfest",


  // GCD
  "Keen Edge", "Brutal Shell", "Solid Barrel",
  "Demon Slice", "Demon Slaughter",
  "Sonic Break",
  "Burst Strike", "Fated Circle",
  "Gnashing Fang", "Savage Claw", "Wicked Talon"

];

function gnbJobChange() {

  nextid.gnashingfang = 0;
  nextid.savageclaw = 1;
  nextid.wickedtalon = 2;
  nextid.sonicbreak = 3;
  nextid.burststrike1 = 4;
  nextid.keenedge = 5;
  nextid.demonslice = nextid.keenedge;
  nextid.brutalshell = 6;
  nextid.burststrike2 = 7;
  nextid.solidbarrel = 8;
  nextid.demonslaughter = nextid.solidbarrel;

  nextid.nomercy = 10;
  nextid.bloodfest = 11;
  nextid.continuation = 12;
  nextid.dangerzone = 13;
  nextid.bowshock = 14;
  nextid.roughdivide = 15;

  countdownid.nomercy = 0;
  countdownid.gnashingfang = 1;
  countdownid.sonicbreak = 2;
  countdownid.roughdivide = 3;

  previous.demonslice = 0;
  previous.demonslaughter = 0;
  previous.bowshock = 0;
  previous.fatedcircle = 0;

  previous.gnashingfang = 0;
  previous.sonicbreak = 0;

  // Show available cooldowns

  if (player.level >= 80) {
    icon.dangerzone = icon.blastingzone;
  }

  addCountdownBar({name: "nomercy", time: checkRecast("nomercy"), oncomplete: "addIcon"});

  gnbCartridge();
  gnbCombo();
}

function gnbAction() {

  if (actionList.gnb.indexOf(actionLog.groups.actionName) > -1) {

    if ("No Mercy" == actionLog.groups.actionName) {
      addStatus("nomercy");
      addRecast("nomercy");
      addCountdownBar({name: "nomercy", time: checkRecast("nomercy"), oncomplete: "addIcon"});
      gnbCartridge();
    }

    else if (["Danger Zone", "Blasting Zone"].indexOf(actionLog.groups.actionName) > -1) {

    }

    else if ("Rough Divide" == actionLog.groups.actionName) {

    }

    else if ("Bow Shock" == actionLog.groups.actionName) {
      if (Date.now() - previous.bowshock > 1000) {
        count.targets = 1;
        previous.bowshock = Date.now();
      }
      else {
        count.targets = count.targets + 1;
      }
    }

    else if ("Bloodfest" == actionLog.groups.actionName) {

    }

    else {  // GCD Action

      if ("Keen Edge" == actionLog.groups.actionName
      && actionLog.groups.result.length >= 2) {
        if (next.combo != 1) {
          gnbSolidBarrelCombo();
        }
        removeIcon("keenedge");
      }

      else if ("Brutal Shell" == actionLog.groups.actionName
      && actionLog.groups.result.length >= 2) {
        removeIcon("brutalshell");
        if (player.level < 26) {
          gnbCombo();
        }
      }

      else if ("Solid Barrel" == actionLog.groups.actionName) {
        removeIcon("solidbarrel");
        gnbCombo();
      }

      else if ("Demon Slice" == actionLog.groups.actionName
      && actionLog.groups.result.length >= 2) {
        if (next.combo != 2) {
          gnbDemonSlaughterCombo();
        }
        if (Date.now() - previous.demonslice > 1000) {
          count.targets = 1;
          previous.demonslice = Date.now();
          removeIcon("demonslice");
          if (player.level < 40) {
            gnbCombo();
          }
        }
        else {
          count.targets = count.targets + 1;
        }
      }

      else if ("Demon Slaughter" == actionLog.groups.actionName) {
        if (Date.now() - previous.demonslaughter > 1000) {
          count.targets = 1;
          previous.demonslaughter = Date.now();
          removeIcon("demonslaughter");
          gnbCombo();
        }
        else {
          count.targets = count.targets + 1;
        }
      }

      else if ("Sonic Break" == actionLog.groups.actionName) {
        removeIcon("sonicbreak");
        if (recast.sonicbreak > Date.now() - previous.sonicbreak) {
          recast.sonicbreak = Date.now() - previous.sonicbreak; // Adjusts cooldown
        }
        previous.sonicbreak = Date.now();
        addRecast("sonicbreak");
      }

      else if ("Gnashing Fang" == actionLog.groups.actionName) {
        removeIcon("gnashingfang");
        if (recast.gnashingfang > Date.now() - previous.gnashingfang) {
          recast.gnashingfang = Date.now() - previous.gnashingfang; // Adjusts cooldown
        }
        previous.gnashingfang = Date.now();
        addCountdownBar({name: "gnashingfang", time: recast.gnashingfang});
        addRecast("gnashingfang");
      }

      else if ("Savage Claw" == actionLog.groups.actionName) {
        removeIcon("savageclaw");
      }

      else if ("Wicked Talon" == actionLog.groups.actionName) {
        removeIcon("wickedtalon");
      }

      else if ("Burst Strike" == actionLog.groups.actionName) {
      }

      else if ("Fated Circle" == actionLog.groups.actionName) {
        if (Date.now() - previous.fatedcircle > 1000) {
          count.targets = 1;
          previous.fatedcircle = Date.now();
          gnbCartridge();
        }
        else {
          count.targets = count.targets + 1;
        }
      }

      gnbCartridge();

    }  // End of GCD section

  }

  dncPriority();
}

function gnbStatus() {

  if (effectLog.groups.targetID == player.ID) {

    if ("No Mercy" == effectLog.groups.effectName) {
      if (effectLog.groups.gainsLoses == "gains") {
        addStatus("nomercy", parseInt(effectLog.groups.effectDuration) * 1000);
        addCountdownBar({name: "sonicbreak", time: checkRecast("sonicbreak"), oncomplete: "addIcon"});
        gnbCartridge();
      }
      else if (effectLog.groups.gainsLoses == "loses") {
        removeStatus("nomercy");
        removeCountdownBar("sonicbreak");
        gnbCartridge();
      }
    }

    else if ("Ready To Rip" == effectLog.groups.effectName) {
      if (effectLog.groups.gainsLoses == "gains") {
        icon.continuation = icon.jugularrip;
        addIcon({name: "continuation"});
        addStatus("readytorip", parseInt(effectLog.groups.effectDuration) * 1000);
      }
      else if (effectLog.groups.gainsLoses == "loses") {
        removeIcon("continuation");
        removeStatus("readytorip");
      }
    }

    else if ("Ready To Tear" == effectLog.groups.effectName) {
      if (effectLog.groups.gainsLoses == "gains") {
        icon.continuation = icon.abdomentear;
        addIcon({name: "continuation"});
        addStatus("readytotear", parseInt(effectLog.groups.effectDuration) * 1000);
      }
      else if (effectLog.groups.gainsLoses == "loses") {
        removeIcon("continuation");
        removeStatus("readytotear");
      }
    }

    else if ("Ready To Gouge" == effectLog.groups.effectName) {
      if (effectLog.groups.gainsLoses == "gains") {
        icon.continuation = icon.eyegouge;
        addIcon({name: "continuation"});
        addStatus("readytogouge", parseInt(effectLog.groups.effectDuration) * 1000);
      }
      else if (effectLog.groups.gainsLoses == "loses") {
        removeIcon("continuation");
        removeStatus("readytogouge");
      }
    }
  }
}

function gnbCombo() {

  removeIcon("keenedge");
  removeIcon("brutalshell");
  removeIcon("solidbarrel");

  if (count.targets >= 2) {
    gnbDemonSlaughterCombo();
  }
  else {
    gnbSolidBarrelCombo();
  }
}

function gnbSolidBarrelCombo() {
  addIcon({name: "keenedge"});
  addIcon({name: "brutalshell"});
  if (player.level >= 26) {
    addIcon({name: "solidbarrel"});
  }
}

function gnbDemonSlaughterCombo() {
  addIcon({name: "demonslice"});
  if (player.level >= 40) {
    addIcon({name: "demonslaughter"});
  }
}

function gnbCartridge() {

  if (player.level >= 72
  && count.targets >= 2) {
    icon.burststrike = icon.fatedcircle;
  }
  else {
    icon.burststrike = "003426";
  }

  if (checkStatus("nomercy") > 3000) {
    var cartridgeFloor = 0;
    nextid.burststrike = nextid.burststrike1;
  }
  else {
    var cartridgeFloor = 1;
    nextid.burststrike = nextid.burststrike2;
  }

  removeIcon("burststrike1");
  removeIcon("burststrike2");

  // console.log(player.tempjobDetail.cartridge - cartridgeFloor);
  // console.log(checkRecast("gnashingfang"));
  // console.log(checkRecast("nomercy"));

  if (player.tempjobDetail.cartridge - cartridgeFloor >= 2) {
    if (player.level >= 60
    && checkRecast("gnashingfang") < 3000
    && checkRecast("nomercy") + 10000 > recast.gnashingfang) {
      addIcon({name: "gnashingfang"});
      addIcon({name: "savageclaw"});
      addIcon({name: "wickedtalon"});
    }
    addIcon({name: "burststrike"});
  }

  else if (player.tempjobDetail.cartridge - cartridgeFloor >= 1) {
    if (player.level >= 60
    && checkRecast("gnashingfang") < 3000
    && checkRecast("nomercy") + 10000 > recast.gnashingfang) {
      addIcon({name: "gnashingfang"});
      addIcon({name: "savageclaw"});
      addIcon({name: "wickedtalon"});
    }
    else {
      addIcon({name: "burststrike"});
    }
  }
}
