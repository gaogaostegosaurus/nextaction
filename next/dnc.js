"use strict";

var maxEsprit;

actionList.dnc = [

  // Non-GCD
  "Fan Dance", "Fan Dance II", "Fan Dance III", "Devilment", "Flourish",

  // GCD
  "Cascade", "Fountain", "Windmill", "Bladeshower",
  "Reverse Cascade", "Rising Windmill", "Fountainfall", "Bloodshower",
  "Emboite", "Entrechat", "Jete", "Pirouette",
  "Standard Step",  "Standard Finish", "Single Standard Finish",
  "Double Standard Finish",
  "Technical Step", "Technical Finish", "Single Technical Finish",
  "Double Technical Finish", "Triple Technical Finish",
  "Quadruple Technical Finish",
  "Saber Dance"
];

function dncJobChange() {

  dncPriority();

  nextid.step1 = 10;
  nextid.step2 = 11;
  nextid.step3 = 12;
  nextid.step4 = 14;
  nextid.fandance3 = 15;
  nextid.fourfoldfeathers = 16;
  nextid.devilment = 17;
  nextid.flourish = 18;

  countdownid.standardstep = 0;
  countdownid.flourish = 1;
  countdownid.technicalstep = 10;
  countdownid.devilment = 11;

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
    addCountdownBar("standardstep", -1, "icon");
  }

  if (player.level >= 62) {
    addCountdownBar("devilment", -1);
  }

  if (player.level >= 70) {
    addCountdownBar("technicalstep", -1, "icon");
  }

  if (player.level >= 72) {
    addCountdownBar("flourish", -1);
  }

  dncCombo();
  dncEsprit();
}

function dncAction() {

  // Set up icon changes from combat here

  if (actionList.dnc.indexOf(actionLog.groups.actionName) > -1) {

    if ("Fan Dance" == actionLog.groups.actionName) {
      removeIcon("fourfoldfeathers");
      dncFeathers();
    }

    else if ("Fan Dance II" == actionLog.groups.actionName) {
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

    else if ("Fan Dance III" == actionLog.groups.actionName) {
      removeIcon("fandance3");
      if (Date.now() - previous.fandance3 > 1000) {
        count.aoe = 1;
        previous.fandance3 = Date.now();
      }
      else {
        count.aoe = count.aoe + 1;
      }
    }

    else if ("Devilment" == actionLog.groups.actionName) {
      removeIcon("devilment");
      addCountdownBar("devilment");
    }

    else if ("Flourish" == actionLog.groups.actionName) {
      removeIcon("flourish");
      addCountdownBar("flourish");
    }

    else {  // GCD Action

      if ("Cascade" == actionLog.groups.actionName) {
        removeIcon("cascade");
        if (next.combo != 1) {
          addIcon("fountain");
        }
      }

      else if ("Fountain" == actionLog.groups.actionName) {
        removeIcon("fountain");
        dncCombo();
      }

      else if ("Windmill" == actionLog.groups.actionName) {
        removeIcon("windmill");
        if (next.combo != 2
        && player.level >= 25) {
          addIcon("bladeshower");
        }
      }

      else if ("Bladeshower" == actionLog.groups.actionName) {
        removeIcon("bladeshower");
        dncCombo();
      }

      else if ("Reverse Cascade" == actionLog.groups.actionName) {
        //removeIcon("reversecascade");
        dncFeathers();
      }

      else if ("Rising Windmill" == actionLog.groups.actionName) {
        //removeIcon("risingwindmill");
        dncFeathers();
      }

      else if ("Fountainfall" == actionLog.groups.actionName) {
        //removeIcon("fountainfall");
        dncFeathers();
      }

      else if ("Bloodshower" == actionLog.groups.actionName) {
        //removeIcon("bloodshower");
        dncFeathers();
      }

      else if ("Standard Step" == actionLog.groups.actionName) {
        removeIcon("standardstep");
        addCountdownBar("standardstep", recast.standardstep, "icon");
        let step = 1;
        for (step = 1; step <= 2; step++) {
          console.log(player.tempjobDetail["step" + step]);
          if (player.tempjobDetail["step" + step] == 1) {
            icon["step" + step] = icon.emboite;
          }
          else if (player.tempjobDetail["step" + step] == 2) {
            icon["step" + step] = icon.entrechat;
          }
          else if (player.tempjobDetail["step" + step] == 3) {
            icon["step" + step] = icon.jete;
          }
          else if (player.tempjobDetail["step" + step] == 4) {
            icon["step" + step] = icon.pirouette;
          }
          addIcon("step" + step);
        }
      }

      else if (
      ["Standard Finish", "Single Standard Finish",
      "Double Standard Finish"].indexOf(actionLog.groups.actionName) > -1) {
        removeIcon("standardfinish");
        removeIcon("step1");
        removeIcon("step2");
        if (actionLog.groups.targetID.startsWith("4")) {
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

      else if ("Technical Step" == actionLog.groups.actionName) {
        removeIcon("technicalstep");
        addCountdownBar("technicalstep", recast.technicalstep, "icon");
      }

      else if (
      ["Technical Finish", "Single Technical Finish",
      "Double Technical Finish", "Triple Technical Finish",
      "Quadruple Technical Finish"].indexOf(actionLog.groups.actionName) > -1) {
        removeIcon("technicalfinish");
        removeIcon("step1");
        removeIcon("step2");
        removeIcon("step3");
        removeIcon("step4");
        if (actionLog.groups.targetID.startsWith("4")) {
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
      "Jete", "Pirouette"].indexOf(actionLog.groups.actionName) > -1) {

        if (player.tempjobDetail.steps >= 1) {
          removeIcon("step1");
        }
        if (player.tempjobDetail.steps >= 2) {
          removeIcon("step2");
        }
        if (player.tempjobDetail.steps >= 3) {
          removeIcon("step3");
        }
        if (player.tempjobDetail.steps >= 4) {
          removeIcon("step4");
        }

        if (checkStatus("standardstep") > 0
        && player.tempjobDetail.steps >= 2) {
          addIcon("standardfinish");
        }
        else if (checkStatus("technicalstep") > 0
        && player.tempjobDetail.steps >= 4) {
          addIcon("technicalfinish");
        }
      }

      dncEsprit();

    }  // End of GCD section

  }

  dncPriority();
}

function dncStatus() {

  if (effectLog.groups.targetID == player.ID) {

    if ("Flourishing Cascade" == effectLog.groups.effectName) {
      if (effectLog.groups.gainsLoses == "gains") {
        addIcon("reversecascade");
        // addCountdownBar("reversecascade", parseInt(effectLog.groups.effectDuration) * 1000);
        addStatus("flourishingcascade", player.ID, parseInt(effectLog.groups.effectDuration) * 1000);
        dncFlourishCheck();
      }
      else if (effectLog.groups.gainsLoses == "loses") {
        removeIcon("reversecascade");
        // removeCountdownBar("reversecascade");
        removeStatus("flourishingcascade");
        dncFlourishCheck();
      }
    }

    else if ("Flourishing Fountain" == effectLog.groups.effectName) {
      if (effectLog.groups.gainsLoses == "gains") {
        addIcon("fountainfall");
        // addCountdownBar("fountainfall", parseInt(effectLog.groups.effectDuration) * 1000);
        addStatus("flourishingfountain", parseInt(effectLog.groups.effectDuration) * 1000);
        dncFlourishCheck();
      }
      else if (effectLog.groups.gainsLoses == "loses") {
        removeIcon("fountainfall");
        // removeCountdownBar("fountainfall");
        removeStatus("flourishingfountain");
        dncFlourishCheck();
      }
    }

    else if ("Flourishing Windmill" == effectLog.groups.effectName) {
      if (effectLog.groups.gainsLoses == "gains") {
        addIcon("risingwindmill");
        // addCountdownBar("risingwindmill", parseInt(effectLog.groups.effectDuration) * 1000);
        addStatus("flourishingwindmill", parseInt(effectLog.groups.effectDuration) * 1000);
        dncFlourishCheck();
      }
      else if (effectLog.groups.gainsLoses == "loses") {
        removeIcon("risingwindmill");
        // removeCountdownBar("risingwindmill");
        removeStatus("flourishingwindmill");
        dncFlourishCheck();
      }
    }

    else if ("Flourishing Shower" == effectLog.groups.effectName) {
      if (effectLog.groups.gainsLoses == "gains") {
        addIcon("bloodshower");
        // addCountdownBar("bloodshower", parseInt(effectLog.groups.effectDuration) * 1000);
        addStatus("flourishingshower", parseInt(effectLog.groups.effectDuration) * 1000);
        dncFlourishCheck();
      }
      else if (effectLog.groups.gainsLoses == "loses") {
        removeIcon("bloodshower");
        // removeCountdownBar("bloodshower");
        removeStatus("flourishingshower");
        dncFlourishCheck();
      }
    }

    else if ("Flourishing Fan Dance" == effectLog.groups.effectName) {
      if (effectLog.groups.gainsLoses == "gains") {
        addIcon("fandance3");
        // addCountdownBar("fandance3", parseInt(effectLog.groups.effectDuration) * 1000);
        addStatus("flourishingfandance", parseInt(effectLog.groups.effectDuration) * 1000);
        dncFlourishCheck();
      }
      else if (effectLog.groups.gainsLoses == "loses") {
        removeIcon("fandance3");
        // removeCountdownBar("fandance3");
        removeStatus("flourishingfandance");
        dncFlourishCheck();
      }
    }

    else if ("Standard Step" == effectLog.groups.effectName) {
      if (effectLog.groups.gainsLoses == "gains") {
        addStatus("standardstep", parseInt(effectLog.groups.effectDuration) * 1000);
      }
      else if (effectLog.groups.gainsLoses == "loses") {
        removeStatus("standardstep");
      }
    }

    else if ("Standard Finish" == effectLog.groups.effectName) {
      if (effectLog.groups.gainsLoses == "gains") {
        addStatus("standardfinish", parseInt(effectLog.groups.effectDuration) * 1000);
      }
      else if (effectLog.groups.gainsLoses == "loses") {
        removeStatus("standardfinish");
      }
    }

    else if ("Technical Step" == effectLog.groups.effectName) {
      if (effectLog.groups.gainsLoses == "gains") {
        addStatus("technicalstep", parseInt(effectLog.groups.effectDuration) * 1000);
      }
      else if (effectLog.groups.gainsLoses == "loses") {
        removeStatus("technicalstep");
      }
    }

    else if ("Technical Finish" == effectLog.groups.effectName) {
      if (effectLog.groups.gainsLoses == "gains") {
        addStatus("technicalfinish", parseInt(effectLog.groups.effectDuration) * 1000);
      }
      else if (effectLog.groups.gainsLoses == "loses") {
        removeStatus("technicalfinish");
      }
    }
  }
}

function dncCombo() {

  removeIcon("cascade");
  removeIcon("fountain");

  if (count.aoe >= 2
  && player.level >= 15) {
    addIcon("windmill");
    if (player.level >= 25) {
      addIcon("bladeshower");
    }
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
      if (checkRecast("flourish") < 0) {
        addIcon("flourish");
      }
      else {
        removeIcon("flourish");
      }
    }
    else {
      removeIcon("flourish");
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
  if (checkStatus("technicalfinish") > 0) {
    maxEsprit = 50;
  }
  else {
    maxEsprit = 80;
  }
  if (player.tempjobDetail.tempesprit >= maxEsprit) {
    addIcon("saberdance");
  }
  else {
    removeIcon("saberdance");
  }
}


function dncPriority() {

  if (count.aoe >= 2) {
    nextid.technicalstep = 0;
    nextid.saberdance = 1;
    nextid.technicalfinish = nextid.technicalstep;
    nextid.standardstep = 2;
    nextid.standardfinish = nextid.standardstep;
    nextid.bloodshower = 3;
    nextid.risingwindmill = 4;
    nextid.fountainfall = 5;
    nextid.reversecascade = 6;
    nextid.windmill = 8;
    nextid.cascade = nextid.windmill;
    nextid.bladeshower = 9;
    nextid.fountain = nextid.bladeshower;
  }

  else {
    nextid.technicalstep = 0;
    nextid.technicalfinish = nextid.technicalstep;
    nextid.standardstep = 1;
    nextid.standardfinish = nextid.standardstep;
    nextid.saberdance = 2;
    nextid.fountainfall = 3;
    nextid.reversecascade = 4;
    nextid.bloodshower = 5;
    nextid.risingwindmill = 6;
    nextid.cascade = 8;
    nextid.windmill = nextid.cascade;
    nextid.fountain = 9;
    nextid.bladeshower = nextid.fountain;
  }

  if (checkStatus("standardfinish") > 5000 && count.aoe >= 5) {
    removeIcon("standardstep");
    removeCountdownBar("standardstep");
  }

  if (count.aoe >= 3) {
    removeIcon("fountainfall");
    removeIcon("reversecascade");
  }
}
