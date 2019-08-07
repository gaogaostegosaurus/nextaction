"use strict";

actionList.dnc = [

  // Non-GCD
  "Fan Dance", "Fan Dance II", "Fan Dance III", "Devilment", "Flourish",

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

  countdownid.standardstep = 0;
  countdownid.flourish = 1;
  countdownid.technicalstep = 10;
  countdownid.devilment = 11;
  // countdownid.reversecascade = 3;
  // countdownid.fountainfall = 4;
  // countdownid.risingwindmill = 5;
  // countdownid.bloodshower = 6;
  // countdownid.fandance3 = 7;

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
    addCountdownBar("standardstep", -1);
  }

  if (player.level >= 62) {
    addCountdownBar("devilment", -1);
  }

  if (player.level >= 70) {
    addCountdownBar("technicalstep", -1);
  }

  if (player.level >= 72) {
    addCountdownBar("flourish", -1);
  }
}

function dncAction() {

  // Set up icon changes from combat here

  if (actionList.dnc.indexOf(actionGroups.actionname) > -1) {



    if ("Fan Dance" == actionGroups.actionname) {
      removeIcon("fourfoldfeathers");
      dncFeathers();
    }

    else if ("Fan Dance II" == actionGroups.actionname) {
      removeIcon("fourfoldfeathers");
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
      removeIcon("fandance3");
      if (Date.now() - previous.fandance3 > 1000) {
        count.aoe = 1;
        previous.fandance3 = Date.now();
      }
      else {
        count.aoe = count.aoe + 1;
      }
    }

    else if ("Devilment" == actionGroups.actionname) {
      removeIcon("devilment");
      addCountdownBar("devilment");
    }

    else if ("Flourish" == actionGroups.actionname) {
      addCountdownBar("flourish");
    }

    else {  // GCD Action

      if ("Reverse Cascade" == actionGroups.actionname) {
        removeIcon("reversecascade");
        dncFeathers();
      }

      else if ("Rising Windmill" == actionGroups.actionname) {
        removeIcon("risingwindmill");
        dncFeathers();
      }

      else if ("Fountainfall" == actionGroups.actionname) {
        removeIcon("fountainfall");
        dncFeathers();
      }

      else if ("Bloodshower" == actionGroups.actionname) {
        removeIcon("bloodshower");
        dncFeathers();
      }

      else if ("Bloodshower" == actionGroups.actionname) {
        removeIcon("devilment");
        addCountdownBar("devilment");
      }

      else if ("Standard Step" == actionGroups.actionname) {
        removeIcon("standardstep");
        addCountdownBar("standardstep");
      }

      else if (
      ["Standard Finish", "Single Standard Finish",
      "Double Standard Finish"].indexOf(actionGroups.actionname) > -1) {
        removeIcon("standardfinish");
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
        && checkRecast("devilment") < 0) {
          addIcon("devilment");  // Not sure if this is best use before 70 but whatever
        }
      }

      else if ("Technical Step" == actionGroups.actionname) {
        removeIcon("technicalstep");
        addCountdownBar("technicalstep");
      }

      else if (
      ["Technical Finish", "Single Technical Finish",
      "Double Technical Finish", "Triple Technical Finish",
      "Quadruple Technical Finish"].indexOf(actionGroups.actionname) > -1) {
        removeIcon("technicalfinish");
        if (actionGroups.targetID.startsWith("4")) {
          if (Date.now() - previous.technicalfinish > 1000) {
            count.aoe = 1;
            previous.technicalfinish = Date.now();
          }
          else {
            count.aoe = count.aoe + 1;
          }
        }
        if (checkRecast("devilment") < 0) {
          addIcon("devilment");  // Heck not sure if this best use after 70
        }
      }

      else if (["Emboite", "Entrechat",
      "Jete", "Pirouette"].indexOf(actionGroups.actionname) > -1) {
        if (checkStatus("standardstep") > 0
        && player.tempjobDetail.tempsteps >= 2) {
          addIcon("standardfinish");
        }
        else if (checkStatus("technicalstep") > 0
        && player.tempjobDetail.tempsteps >= 4) {
          addIcon("technicalfinish");
        }
      }

      dncEsprit();

    }  // End of GCD section

  }

}

function dncStatus() {

  if (statusGroups.targetID == player.ID) {

    if ("Flourishing Cascade" == statusGroups.statusname) {
      if (statusGroups.gainsloses == "gains") {
        addIcon("reversecascade");
        // addCountdownBar("reversecascade", parseInt(statusGroups.duration) * 1000);
        addStatus("flourishingcascade", player.ID, parseInt(statusGroups.duration) * 1000);
        dncFlourishCheck();
      }
      else if (statusGroups.gainsloses == "loses") {
        removeIcon("reversecascade");
        // removeCountdownBar("reversecascade");
        removeStatus("flourishingcascade");
        dncFlourishCheck();
      }
    }

    else if ("Flourishing Fountain" == statusGroups.statusname) {
      if (statusGroups.gainsloses == "gains") {
        addIcon("fountainfall");
        // addCountdownBar("fountainfall", parseInt(statusGroups.duration) * 1000);
        addStatus("flourishingfountain", parseInt(statusGroups.duration) * 1000);
        dncFlourishCheck();
      }
      else if (statusGroups.gainsloses == "loses") {
        removeIcon("fountainfall");
        // removeCountdownBar("fountainfall");
        removeStatus("flourishingfountain");
        dncFlourishCheck();
      }
    }

    else if ("Flourishing Windmill" == statusGroups.statusname) {
      if (statusGroups.gainsloses == "gains") {
        addIcon("risingwindmill");
        // addCountdownBar("risingwindmill", parseInt(statusGroups.duration) * 1000);
        addStatus("flourishingwindmill", parseInt(statusGroups.duration) * 1000);
        dncFlourishCheck();
      }
      else if (statusGroups.gainsloses == "loses") {
        removeIcon("risingwindmill");
        // removeCountdownBar("risingwindmill");
        removeStatus("flourishingwindmill");
        dncFlourishCheck();
      }
    }

    else if ("Flourishing Shower" == statusGroups.statusname) {
      if (statusGroups.gainsloses == "gains") {
        addIcon("bloodshower");
        // addCountdownBar("bloodshower", parseInt(statusGroups.duration) * 1000);
        addStatus("flourishingshower", parseInt(statusGroups.duration) * 1000);
        dncFlourishCheck();
      }
      else if (statusGroups.gainsloses == "loses") {
        removeIcon("bloodshower");
        // removeCountdownBar("bloodshower");
        removeStatus("flourishingshower");
        dncFlourishCheck();
      }
    }

    else if ("Flourishing Fan Dance" == statusGroups.statusname) {
      if (statusGroups.gainsloses == "gains") {
        addIcon("fandance3");
        // addCountdownBar("fandance3", parseInt(statusGroups.duration) * 1000);
        addStatus("flourishingfandance", parseInt(statusGroups.duration) * 1000);
        dncFlourishCheck();
      }
      else if (statusGroups.gainsloses == "loses") {
        removeIcon("fandance3");
        // removeCountdownBar("fandance3");
        removeStatus("flourishingfandance");
        dncFlourishCheck();
      }
    }

    else if ("Standard Step" == statusGroups.statusname) {
      if (statusGroups.gainsloses == "gains") {
        addStatus("standardstep", parseInt(statusGroups.duration) * 1000);
      }
      else if (statusGroups.gainsloses == "loses") {
        removeStatus("standardstep");
      }
    }

    else if ("Standard Finish" == statusGroups.statusname) {
      if (statusGroups.gainsloses == "gains") {
        addStatus("standardfinish", parseInt(statusGroups.duration) * 1000);
      }
      else if (statusGroups.gainsloses == "loses") {
        removeStatus("standardfinish");
      }
    }

    else if ("Technical Step" == statusGroups.statusname) {
      if (statusGroups.gainsloses == "gains") {
        addStatus("technicalstep", parseInt(statusGroups.duration) * 1000);
      }
      else if (statusGroups.gainsloses == "loses") {
        removeStatus("technicalstep");
      }
    }

    else if ("Technical Finish" == statusGroups.statusname) {
      if (statusGroups.gainsloses == "gains") {
        addStatus("technicalfinish", parseInt(statusGroups.duration) * 1000);
      }
      else if (statusGroups.gainsloses == "loses") {
        removeStatus("technicalfinish");
      }
    }
  }
}

function dncCombo() {
  if (count.aoe >= 2
  && player.level >= 15) {
    addIcon("windmill");
    addIcon("bladeshower");
  }
  else {
    addIcon("cascade");
    addIcon("fountain");
  }
}

function dncFlourishCheck() {
  if (player.level >= 72) {
    if (Math.max(
    checkStatus("flourishingcascade"),
    checkStatus("flourishingfountain"),
    checkStatus("flourishingwindmill"),
    checkStatus("flourishingshower"),
    checkStatus("flourishingfandance")) < 0) {
      addCountdownBar("flourish", checkRecast("flourish"), "OK")
    }
    else {
      addCountdownBar("flourish", checkRecast("flourish"), "WAIT")
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
    addIcon("fourfoldfeathers");
  }
  else {
    removeIcon("fourfoldfeathers");
  }
}

function dncEsprit() {
  if (player.tempjobDetail.tempesprit >= 80) {
    addIcon("saberdance");
  }
  else {
    removeIcon("saberdance");
  }
}
