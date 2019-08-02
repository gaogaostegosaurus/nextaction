"use strict";

actionList.dnc = [

  // Non-GCD
  "Fan Dance", "Fan Dance II", "Fan Dance III", "Flourish",

  // GCD
  "Cascade", "Fountain", "Windmill", "Bladeshower",
  "Reverse Cascade", "Rising Windmill", "Fountainfall", "Bloodshower",
  "Emboite", "Entrechat", "Jete", "Pirouette",
  "Standard Step",
  "Standard Finish", "Single Standard Finish", "Double Standard Finish",
  "Technical Step",
  "Technical Finish", "Single Technical Finish", "Double Technical Finish",
  "Triple Technical Finish", "Quadruple Technical Finish",
  "Saber Dance"
];

function dncJobChange() {

  nextid.technicalstep = 0;
  nextid.technicalfinish = nextid.technicalstep;
  nextid.devilment = nextid.technicalstep;
  nextid.saberdance = 1;  // Assign 3 (after standard step) if not under technical
  nextid.standardstep = 2;
  nextid.standardfinish = nextid.standardstep;
  nextid.saberdance80plus = 3;
  nextid.bloodshower = 4;
  nextid.fountainfall = 5;
  nextid.risingwindmill = 6;
  nextid.reversecascade = 7;  // Easier to just be flexible with these...
  nextid.bloodshowersingletarget = 8;
  nextid.fountainfallsingletarget = 9;

  nextid.fandance3 = 10;
  nextid.fourfoldfeathers = 11;

  countdownid.technicalstep = 0;
  countdownid.standardstep = 1;
  countdownid.devilment = 2;
  countdownid.reversecascade = 3;
  countdownid.fountainfall = 4;
  countdownid.risingwindmill = 5;
  countdownid.bloodshower = 6;
  countdownid.fandance3 = 7;
  countdownid.flourish = 8;

  previous.fandance2 = 0;
  previous.fandance3 = 0;
  previous.windmill = 0;
  previous.bladeshower = 0;
  previous.risingwindmill = 0;
  previous.bloodshower = 0;
  previous.standardfinish = 0;
  previous.saberdance = 0;
  previous.technicalfinish = 0;

  // Show available cooldowns

  if (player.level >= 15) {
    addCountdownBar("standardstep");
  }

  if (player.level >= 62) {
    addCountdownBar("devilment");
  }

  if (player.level >= 70) {
    addCountdownBar("technicalstep");
  }

  if (player.level >= 72) {
    addCountdownBar("flourish");
  }
}

function dncAction() {

  // Set up icon changes from combat here

  if (actionList.dnc.indexOf(actionGroups.actionname) > -1) {

    removeText("loadmessage");

    if ("Fan Dance" == actionGroups.actionname) {
      removeIconNew("fourfoldfeathers");
      dncFeathers();
    }

    else if ("Fan Dance II" == actionGroups.actionname) {
      removeIconNew("fourfoldfeathers");
      if (Date.now() - previous.fandance2 > 1000) {
        count.aoe = 1;
        previous.fandance2 = Date.now();
      }
      else {
        count.aoe = count.aoe + 1;
      }
      dncFeathers();
    }

    else if ("Fan Dance III" == actionGroups.actionname) {
      removeIconNew("fandance3");
      if (Date.now() - previous.fandance3 > 1000) {
        count.aoe = 1;
        previous.fandance3 = Date.now();
      }
      else {
        count.aoe = count.aoe + 1;
      }
    }

    else if ("Flourish" == actionGroups.actionname) {
      addCountdownBar("flourish");
    }

    else {  // GCD Action

      if ("Reverse Cascade" == actionGroups.actionname) {
        removeIconNew("reversecascade");
        dncFeathers();
      }

      else if ("Rising Windmill" == actionGroups.actionname) {
        removeIconNew("risingwindmill");
        dncFeathers();
      }

      else if ("Fountainfall" == actionGroups.actionname) {
        removeIconNew("fountainfall");
        dncFeathers();
      }

      else if ("Bloodshower" == actionGroups.actionname) {
        removeIconNew("bloodshower");
        dncFeathers();
      }

      else if ("Bloodshower" == actionGroups.actionname) {
        removeIconNew("devilment");
        addCountdownBar("devilment");
      }

      else if ("Standard Step" == actionGroups.actionname) {
        removeIconNew("standardstep");
        addCountdownBar("standardstep");
      }

      else if (
      ["Standard Finish", "Single Standard Finish",
      "Double Standard Finish"].indexOf(actionGroups.actionname) > -1) {
        removeIconNew("standardfinish");
        if (actionGroups.targetID.startsWith("4")) {
          if (Date.now() - previous.standardfinish > 1000) {
            count.aoe = 1;
            previous.standardfinish = Date.now();
          }
          else {
            count.aoe = count.aoe + 1;
          }
        }
        if (player.level < 70
        && checkCooldown("devilment", player.ID) < 0) {
          addIconNew("devilment");  // Not sure if this is best use before 70 but whatever
        }
      }

      else if ("Technical Step" == actionGroups.actionname) {
        removeIconNew("technicalstep");
        addCountdownBar("technicalstep");
      }

      else if (
      ["Technical Finish", "Single Technical Finish",
      "Double Technical Finish", "Triple Technical Finish",
      "Quadruple Technical Finish"].indexOf(actionGroups.actionname) > -1) {
        removeIconNew("technicalfinish");
        if (actionGroups.targetID.startsWith("4")) {
          if (Date.now() - previous.technicalfinish > 1000) {
            count.aoe = 1;
            previous.technicalfinish = Date.now();
          }
          else {
            count.aoe = count.aoe + 1;
          }
        }
        if (checkCooldown("devilment", player.ID) < 0) {
          addIconNew("devilment");  // Heck not sure if this best use after 70
        }
      }

      else if (["Emboite", "Entrechat",
      "Jete", "Pirouette"].indexOf(actionGroups.actionname) > -1) {
        if (checkStatus("standardstep") > 0
        && player.tempjobDetail.tempsteps >= 2) {
          addIconNew("standardfinish");
        }
        else if (checkStatus("technicalstep") > 0
        && player.tempjobDetail.tempsteps >= 4) {
          addIconNew("technicalfinish");
        }
        console.log(checkStatus("standardstep"));
      }

      dncEsprit();

    }  // End of GCD section

  }

}

function dncStatus() {

  if (statusGroups.targetID == player.ID) {

    if ("Flourishing Cascade" == statusGroups.statusname) {
      if (statusGroups.gainsloses == "gains") {
        addIconNew("reversecascade");
        addCountdownBar("reversecascade", parseInt(statusGroups.duration) * 1000);
        addStatusNew("flourishingcascade", player.ID, parseInt(statusGroups.duration) * 1000);
        dncFlourishCheck();
      }
      else if (statusGroups.gainsloses == "loses") {
        removeIconNew("reversecascade");
        removeCountdownBar("reversecascade");
        removeStatusNew("flourishingcascade");
        dncFlourishCheck();
      }
    }

    else if ("Flourishing Fountain" == statusGroups.statusname) {
      if (statusGroups.gainsloses == "gains") {
        addIconNew("fountainfall");
        addCountdownBar("fountainfall", parseInt(statusGroups.duration) * 1000);
        addStatusNew("flourishingfountain", parseInt(statusGroups.duration) * 1000);
        dncFlourishCheck();
      }
      else if (statusGroups.gainsloses == "loses") {
        removeIconNew("fountainfall");
        removeCountdownBar("fountainfall");
        removeStatusNew("flourishingfountain");
        dncFlourishCheck();
      }
    }

    else if ("Flourishing Windmill" == statusGroups.statusname) {
      if (statusGroups.gainsloses == "gains") {
        addIconNew("risingwindmill");
        addCountdownBar("risingwindmill", parseInt(statusGroups.duration) * 1000);
        addStatusNew("flourishingwindmill", parseInt(statusGroups.duration) * 1000);
        dncFlourishCheck();
      }
      else if (statusGroups.gainsloses == "loses") {
        removeIconNew("risingwindmill");
        removeCountdownBar("risingwindmill");
        removeStatusNew("flourishingwindmill");
        dncFlourishCheck();
      }
    }

    else if ("Flourishing Shower" == statusGroups.statusname) {
      if (statusGroups.gainsloses == "gains") {
        addIconNew("bloodshower");
        addCountdownBar("bloodshower", parseInt(statusGroups.duration) * 1000);
        addStatusNew("flourishingshower", parseInt(statusGroups.duration) * 1000);
        dncFlourishCheck();
      }
      else if (statusGroups.gainsloses == "loses") {
        removeIconNew("bloodshower");
        removeCountdownBar("bloodshower");
        removeStatusNew("flourishingshower");
        dncFlourishCheck();
      }
    }

    else if ("Flourishing Fan Dance" == statusGroups.statusname) {
      if (statusGroups.gainsloses == "gains") {
        addIconNew("fandance3");
        addCountdownBar("fandance3", parseInt(statusGroups.duration) * 1000);
        addStatusNew("flourishingfandance", parseInt(statusGroups.duration) * 1000);
        dncFlourishCheck();
      }
      else if (statusGroups.gainsloses == "loses") {
        removeIconNew("fandance3");
        removeCountdownBar("fandance3");
        removeStatusNew("flourishingfandance");
        dncFlourishCheck();
      }
    }

    else if ("Standard Step" == statusGroups.statusname) {
      if (statusGroups.gainsloses == "gains") {
        addStatusNew("standardstep", parseInt(statusGroups.duration) * 1000);
      }
      else if (statusGroups.gainsloses == "loses") {
        removeStatusNew("standardstep");
      }
    }

    else if ("Technical Step" == statusGroups.statusname) {
      if (statusGroups.gainsloses == "gains") {
        addStatusNew("technicalstep", parseInt(statusGroups.duration) * 1000);
      }
      else if (statusGroups.gainsloses == "loses") {
        removeStatusNew("technicalstep");
      }
    }
  }
}

function dncFlourishCheck() {
  if (player.level >= 72) {
    if (Math.max(
    checkStatus("flourishingcascade", player.ID),
    checkStatus("flourishingfountain", player.ID),
    checkStatus("flourishingwindmill", player.ID),
    checkStatus("flourishingshower", player.ID),
    checkStatus("flourishingfandance", player.ID)) < 0) {
      addCountdownBar("flourish", checkCooldown("flourish", player.ID), "OK")
    }
    else {
      addCountdownBar("flourish", checkCooldown("flourish", player.ID), "WAIT - procs already up")
    }
  }
}

function dncFeathers() {

  if (player.level >= 50
  && count.aoe > 2) {
    icon.fourfoldfeathers = icon.fandance2;
  }
  else {
    icon.fourfoldfeathers = icon.fandance;
  }

  if (player.tempjobDetail.tempfourfoldfeathers == 4) {
    addIconNew("fourfoldfeathers");
  }
  else {
    removeIconNew("fourfoldfeathers");
  }
}

function dncEsprit() {
  if (player.tempjobDetail.tempesprit >= 80) {
    addIconNew("saberdance");
  }
  else {
    removeIconNew("saberdance");
  }
}
