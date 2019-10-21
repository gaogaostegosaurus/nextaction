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
    addCountdownBar({name: "standardstep", time: -1, oncomplete: "addIcon"});
  }

  if (player.level >= 62) {
    addCountdownBar({name: "devilment", time: -1});
  }

  if (player.level >= 70) {
    addCountdownBar({name: "technicalstep", time: -1, oncomplete: "addIcon"});
  }

  if (player.level >= 72) {
    addCountdownBar({name: "flourish", time: -1});
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
        enemyTargets = 1;
        previous.fandance2 = Date.now();
      }
      else {
        enemyTargets = enemyTargets + 1;
      }
      dncFeathers();
    }

    else if ("Fan Dance III" == actionLog.groups.actionName) {
      removeIcon("fandance3");
      if (Date.now() - previous.fandance3 > 1000) {
        enemyTargets = 1;
        previous.fandance3 = Date.now();
      }
      else {
        enemyTargets = enemyTargets + 1;
      }
    }

    else if ("Devilment" == actionLog.groups.actionName) {
      removeIcon("devilment");
      addCountdownBar({name: "devilment"});
    }

    else if ("Flourish" == actionLog.groups.actionName) {
      removeIcon("flourish");
      addCountdownBar({name: "flourish"});
    }

    else {  // GCD Action

      if ("Cascade" == actionLog.groups.actionName) {
        removeIcon("cascade");
        if (next.combo != 1) {
          addIcon({name: "fountain"});
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
          addIcon({name: "bladeshower"});
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
        addCountdownBar({name: "standardstep", time: recast.standardstep, oncomplete: "addIcon"});
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
          addIcon({name: "step" + step});
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
            enemyTargets = 1;
            previous.standardfinish = Date.now();
          }
          else {
            enemyTargets = enemyTargets + 1;
          }
        }
        if (player.level < 70
        && checkRecast("devilment") < 0) {
          addIcon({name: "devilment"});  // Not sure if this is best use before 70 but whatever
        }
      }

      else if ("Technical Step" == actionLog.groups.actionName) {
        removeIcon("technicalstep");
        addCountdownBar({name: "technicalstep", time: recast.technicalstep, oncomplete: "addIcon"});
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
            enemyTargets = 1;
            previous.technicalfinish = Date.now();
          }
          else {
            enemyTargets = enemyTargets + 1;
          }
        }
        if (checkRecast("devilment") < 0) {
          addIcon({name: "devilment"});  // Heck not sure if this best use after 70
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
          addIcon({name: "standardfinish"});
        }
        else if (checkStatus("technicalstep") > 0
        && player.tempjobDetail.steps >= 4) {
          addIcon({name: "technicalfinish"});
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
        addIcon({name: "reversecascade"});
        // addCountdownBar({name: "reversecascade", time: parseInt(effectLog.groups.effectDuration) * 1000});
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
        addIcon({name: "fountainfall"});
        // addCountdownBar({name: "fountainfall", time: parseInt(effectLog.groups.effectDuration) * 1000});
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
        addIcon({name: "risingwindmill"});
        // addCountdownBar({name: "risingwindmill", time: parseInt(effectLog.groups.effectDuration) * 1000});
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
        addIcon({name: "bloodshower"});
        // addCountdownBar({name: "bloodshower", time: parseInt(effectLog.groups.effectDuration) * 1000});
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
        addIcon({name: "fandance3"});
        // addCountdownBar({name: "fandance3", time: parseInt(effectLog.groups.effectDuration) * 1000});
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

  if (enemyTargets >= 2
  && player.level >= 15) {
    addIcon({name: "windmill"});
    if (player.level >= 25) {
      addIcon({name: "bladeshower"});
    }
  }
  else {
    addIcon({name: "cascade"});
    addIcon({name: "fountain"});
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
      addCountdownBar({name: "flourish", time: checkRecast("flourish"), text: "OK")
      if (checkRecast("flourish") < 0) {
        addIcon({name: "flourish"});
      }
      else {
        removeIcon("flourish");
      }
    }
    else {
      removeIcon("flourish");
      addCountdownBar({name: "flourish", time: checkRecast("flourish"), text: "WAIT"});
    }
  }
}

function dncFeathers() {

  if (player.level >= 50
  && enemyTargets > 2) {
    icon.fourfoldfeathers = icon.fandance2;
  }
  else {
    icon.fourfoldfeathers = icon.fandance;
  }

  if (player.tempjobDetail.tempfourfoldfeathers == 4) {
    addIcon({name: "fourfoldfeathers"});
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
    addIcon({name: "saberdance"});
  }
  else {
    removeIcon("saberdance");
  }
}


function dncPriority() {

  if (enemyTargets >= 2) {
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

  if (checkStatus("standardfinish") > 5000 && enemyTargets >= 5) {
    removeIcon("standardstep");
    removeCountdownBar("standardstep");
  }

  if (enemyTargets >= 3) {
    removeIcon("fountainfall");
    removeIcon("reversecascade");
  }
}
