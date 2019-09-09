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

  addCountdownBar("nomercy", checkRecast("nomercy"), "icon");

  gnbCartridge();
  gnbCombo();
}

function gnbAction() {

  if (actionList.gnb.indexOf(actionGroups.actionname) > -1) {

    if ("No Mercy" == actionGroups.actionname) {
      addStatus("nomercy");
      addRecast("nomercy");
      addCountdownBar("nomercy", checkRecast("nomercy"), "icon");
      gnbCartridge();
    }

    else if (["Danger Zone", "Blasting Zone"].indexOf(actionGroups.actionname) > -1) {

    }

    else if ("Rough Divide" == actionGroups.actionname) {

    }

    else if ("Bow Shock" == actionGroups.actionname) {
      if (Date.now() - previous.bowshock > 1000) {
        count.aoe = 1;
        previous.bowshock = Date.now();
      }
      else {
        count.aoe = count.aoe + 1;
      }
    }

    else if ("Bloodfest" == actionGroups.actionname) {

    }

    else {  // GCD Action

      if ("Keen Edge" == actionGroups.actionname
      && actionGroups.result.length >= 2) {
        if (next.combo != 1) {
          gnbSolidBarrelCombo();
        }
        removeIcon("keenedge");
      }

      else if ("Brutal Shell" == actionGroups.actionname
      && actionGroups.result.length >= 2) {
        removeIcon("brutalshell");
        if (player.level < 26) {
          gnbCombo();
        }
      }

      else if ("Solid Barrel" == actionGroups.actionname) {
        removeIcon("solidbarrel");
        gnbCombo();
      }

      else if ("Demon Slice" == actionGroups.actionname
      && actionGroups.result.length >= 2) {
        if (next.combo != 2) {
          gnbDemonSlaughterCombo();
        }
        if (Date.now() - previous.demonslice > 1000) {
          count.aoe = 1;
          previous.demonslice = Date.now();
          removeIcon("demonslice");
          if (player.level < 40) {
            gnbCombo();
          }
        }
        else {
          count.aoe = count.aoe + 1;
        }
      }

      else if ("Demon Slaughter" == actionGroups.actionname) {
        if (Date.now() - previous.demonslaughter > 1000) {
          count.aoe = 1;
          previous.demonslaughter = Date.now();
          removeIcon("demonslaughter");
          gnbCombo();
        }
        else {
          count.aoe = count.aoe + 1;
        }
      }

      else if ("Sonic Break" == actionGroups.actionname) {
        removeIcon("sonicbreak");
        if (recast.sonicbreak > Date.now() - previous.sonicbreak) {
          recast.sonicbreak = Date.now() - previous.sonicbreak; // Adjusts cooldown
        }
        previous.sonicbreak = Date.now();
        addRecast("sonicbreak");
      }

      else if ("Gnashing Fang" == actionGroups.actionname) {
        removeIcon("gnashingfang");
        if (recast.gnashingfang > Date.now() - previous.gnashingfang) {
          recast.gnashingfang = Date.now() - previous.gnashingfang; // Adjusts cooldown
        }
        previous.gnashingfang = Date.now();
        addCountdownBar("gnashingfang", recast.gnashingfang);
        addRecast("gnashingfang");
      }

      else if ("Savage Claw" == actionGroups.actionname) {
        removeIcon("savageclaw");
      }

      else if ("Wicked Talon" == actionGroups.actionname) {
        removeIcon("wickedtalon");
      }

      else if ("Burst Strike" == actionGroups.actionname) {
      }

      else if ("Fated Circle" == actionGroups.actionname) {
        if (Date.now() - previous.fatedcircle > 1000) {
          count.aoe = 1;
          previous.fatedcircle = Date.now();
          gnbCartridge();
        }
        else {
          count.aoe = count.aoe + 1;
        }
      }

      gnbCartridge();

    }  // End of GCD section

  }

  dncPriority();
}

function gnbStatus() {

  if (statusGroups.targetID == player.ID) {

    if ("No Mercy" == statusGroups.statusname) {
      if (statusGroups.gainsloses == "gains") {
        addStatus("nomercy", parseInt(statusGroups.duration) * 1000);
        addCountdownBar("sonicbreak", checkRecast("sonicbreak"), "icon");
        gnbCartridge();
      }
      else if (statusGroups.gainsloses == "loses") {
        removeStatus("nomercy");
        removeCountdownBar("sonicbreak");
        gnbCartridge();
      }
    }

    else if ("Ready To Rip" == statusGroups.statusname) {
      if (statusGroups.gainsloses == "gains") {
        icon.continuation = icon.jugularrip;
        addIcon("continuation");
        addStatus("readytorip", parseInt(statusGroups.duration) * 1000);
      }
      else if (statusGroups.gainsloses == "loses") {
        removeIcon("continuation");
        removeStatus("readytorip");
      }
    }

    else if ("Ready To Tear" == statusGroups.statusname) {
      if (statusGroups.gainsloses == "gains") {
        icon.continuation = icon.abdomentear;
        addIcon("continuation");
        addStatus("readytotear", parseInt(statusGroups.duration) * 1000);
      }
      else if (statusGroups.gainsloses == "loses") {
        removeIcon("continuation");
        removeStatus("readytotear");
      }
    }

    else if ("Ready To Gouge" == statusGroups.statusname) {
      if (statusGroups.gainsloses == "gains") {
        icon.continuation = icon.eyegouge;
        addIcon("continuation");
        addStatus("readytogouge", parseInt(statusGroups.duration) * 1000);
      }
      else if (statusGroups.gainsloses == "loses") {
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

  if (count.aoe >= 2) {
    gnbDemonSlaughterCombo();
  }
  else {
    gnbSolidBarrelCombo();
  }
}

function gnbSolidBarrelCombo() {
  addIcon("keenedge");
  addIcon("brutalshell");
  if (player.level >= 26) {
    addIcon("solidbarrel");
  }
}

function gnbDemonSlaughterCombo() {
  addIcon("demonslice");
  if (player.level >= 40) {
    addIcon("demonslaughter");
  }
}

function gnbCartridge() {

  if (player.level >= 72
  && count.aoe >= 2) {
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
      addIcon("gnashingfang");
      addIcon("savageclaw");
      addIcon("wickedtalon");
    }
    addIcon("burststrike");
  }

  else if (player.tempjobDetail.cartridge - cartridgeFloor >= 1) {
    if (player.level >= 60
    && checkRecast("gnashingfang") < 3000
    && checkRecast("nomercy") + 10000 > recast.gnashingfang) {
      addIcon("gnashingfang");
      addIcon("savageclaw");
      addIcon("wickedtalon");
    }
    else {
      addIcon("burststrike");
    }
  }
}
