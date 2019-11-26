"use strict";

var maxEsprit;

onTargetChanged.DNC = () => {};

const actionList.DNC = [

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

const dncPushWeave = ({
  array = actionArray,
} = {}) => {
  if (next.devilmentRecast - next.elapsedTime < 0) {
    array.push({ name: 'devilment', img: 'devilment', size: 'small' });
  } else if (next.flourishRecast - next.elapsedTime < 0) {
    array.push({ name: 'flourish', img: 'flourish', size: 'small' });
  } else if (next.espirit - next.elapsedTime < 0) {
    array.push({ name: 'devilment', img: 'devilment', size: 'small' });
  }
}

const dncNext = ({
  time = recast.gcd,
} = {}) => {
  next.flourishingcascadeStatus = checkStatus({ name: 'Flourishing Cascade' });
  next.flourishingwindmillStatus = checkStatus({ name: 'Flourishing Windmill' });
  next.flourishingshowerStatus = checkStatus({ name: 'Flourishing Shower' });
  next.flourishingfountainStatus = checkStatus({ name: 'Flourishing Fountain' });
  next.devilmentRecast = checkRecast({ name: 'Devilment' });
  next.devilmentStatus = checkStatus({ name: 'Devilment' });
  next.standardstepRecast = checkRecast({ name: 'Standard Step' });
  next.standardfinishStatus = checkStatus({ name: 'Standard Finish' });
  next.technicalstepRecast = checkRecast({ name: 'Technical Step' });
  next.technicalfinishStatus = checkStatus({ name: 'Technical Finish' });
  next.flourishRecast = = checkRecast({ name: 'Flourish' });
  next.steps = player.steps;
  next.fourfoldFeathers = player.fourfoldFeathers;
  next.esprit = player.esprit;

  const dncArray = [];
  do {
    if (player.level >= 15 && next.standardfinishStatus - next.elapsedTime < 0) {
      dncArray.push({ name: 'Standard Step' });
      next.elapsedTime += 1000 * 2;
      dncArray.push({ name: 'Standard Finish' });
      next.standardfinishStatus = 60000 + next.elapsedTime;
      next.elapsedTime += recast.gcd;
    } else if (player.level >= 70 && next.technicalfinishStatus - next.elapsedTime < 0) {
      dncArray.push({ name: 'Technical Step' });
      next.elapsedTime += 1000 * 4;
      dncArray.push({ name: 'Technical Finish' });
      next.standardfinishStatus = 60000 + next.elapsedTime;
      next.elapsedTime += recast.gcd;
    } else if (player.level >= 72 && next.devilmentStatus - next.elapsedTime > 4000) {
      dncArray.push({ name: 'Standard Step' });
      next.elapsedTime += 1000 * 2;
      dncArray.push({ name: 'Standard Finish' });
      next.standardfinishStatus = 60000 + next.elapsedTime;
      next.elapsedTime += recast.gcd;
    }
  } while (next.elapsedTime < 15000);

  // else if (player.level >= 72 && next.flourishRecast - next.elapsedTime < 0
  // && Math.max(
  //   next.flourishingcascadeStatus,
  //   next.flourishingfountainStatus,
  //   next.flourishingwindmillStatus,
  //   next.flourishingshowerStatus,
  // ) - next.elapsedTime < 0) {
  //   dncArray.push({ name: 'Flourish', size: 'small' });
  //   next.flourishingcascadeStatus = 20000 + next.elapsedTime;
  //   next.flourishingfountainStatus = 20000 + next.elapsedTime;
  //   next.flourishingwindmillStatus = 20000 + next.elapsedTime;
  //   next.flourishingshowerStatus = 20000 + next.elapsedTime;
  //   next.flourishRecast = recast.flourish + next.elapsedTime;
  // } else if (player.level >= 62 && next.devilmentRecast - next.elapsedTime < 0) {
  //   dncArray.push({ name: 'Devilment', size: 'small' });
  //   next.devilmentRecast = recast.devilment + next.elapsedTime;
  // }
};

  next.elapsedTime = recast.gcd;

  do {
    if
    if (next.technicalstepRecast - next.elapsedTime < 0) {
      // Technical Step
    } else if (next.standardstepRecast - next.elapsedTime < 0) {
      // Standard Step
    }


  } while (next.elapsedTime < 15000);

}

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
        count.targets = 1;
        previous.fandance2 = Date.now();
      }
      else {
        count.targets = count.targets + 1;
      }
      dncFeathers();
    }

    else if ("Fan Dance III" == actionLog.groups.actionName) {
      removeIcon("fandance3");
      if (Date.now() - previous.fandance3 > 1000) {
        count.targets = 1;
        previous.fandance3 = Date.now();
      }
      else {
        count.targets = count.targets + 1;
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
            count.targets = 1;
            previous.standardfinish = Date.now();
          }
          else {
            count.targets = count.targets + 1;
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
            count.targets = 1;
            previous.technicalfinish = Date.now();
          }
          else {
            count.targets = count.targets + 1;
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

  if (statusLog.groups.targetID == player.ID) {

    if ("Flourishing Cascade" == statusLog.groups.statusName) {
      if (statusLog.groups.gainsLoses == "gains") {
        addIcon({name: "reversecascade"});
        // addCountdownBar({name: "reversecascade", time: parseInt(statusLog.groups.effectDuration) * 1000});
        addStatus("flourishingcascade", player.ID, parseInt(statusLog.groups.effectDuration) * 1000);
        dncFlourishCheck();
      }
      else if (statusLog.groups.gainsLoses == "loses") {
        removeIcon("reversecascade");
        // removeCountdownBar("reversecascade");
        removeStatus("flourishingcascade");
        dncFlourishCheck();
      }
    }

    else if ("Flourishing Fountain" == statusLog.groups.statusName) {
      if (statusLog.groups.gainsLoses == "gains") {
        addIcon({name: "fountainfall"});
        // addCountdownBar({name: "fountainfall", time: parseInt(statusLog.groups.effectDuration) * 1000});
        addStatus("flourishingfountain", parseInt(statusLog.groups.effectDuration) * 1000);
        dncFlourishCheck();
      }
      else if (statusLog.groups.gainsLoses == "loses") {
        removeIcon("fountainfall");
        // removeCountdownBar("fountainfall");
        removeStatus("flourishingfountain");
        dncFlourishCheck();
      }
    }

    else if ("Flourishing Windmill" == statusLog.groups.statusName) {
      if (statusLog.groups.gainsLoses == "gains") {
        addIcon({name: "risingwindmill"});
        // addCountdownBar({name: "risingwindmill", time: parseInt(statusLog.groups.effectDuration) * 1000});
        addStatus("flourishingwindmill", parseInt(statusLog.groups.effectDuration) * 1000);
        dncFlourishCheck();
      }
      else if (statusLog.groups.gainsLoses == "loses") {
        removeIcon("risingwindmill");
        // removeCountdownBar("risingwindmill");
        removeStatus("flourishingwindmill");
        dncFlourishCheck();
      }
    }

    else if ("Flourishing Shower" == statusLog.groups.statusName) {
      if (statusLog.groups.gainsLoses == "gains") {
        addIcon({name: "bloodshower"});
        // addCountdownBar({name: "bloodshower", time: parseInt(statusLog.groups.effectDuration) * 1000});
        addStatus("flourishingshower", parseInt(statusLog.groups.effectDuration) * 1000);
        dncFlourishCheck();
      }
      else if (statusLog.groups.gainsLoses == "loses") {
        removeIcon("bloodshower");
        // removeCountdownBar("bloodshower");
        removeStatus("flourishingshower");
        dncFlourishCheck();
      }
    }

    else if ("Flourishing Fan Dance" == statusLog.groups.statusName) {
      if (statusLog.groups.gainsLoses == "gains") {
        addIcon({name: "fandance3"});
        // addCountdownBar({name: "fandance3", time: parseInt(statusLog.groups.effectDuration) * 1000});
        addStatus("flourishingfandance", parseInt(statusLog.groups.effectDuration) * 1000);
        dncFlourishCheck();
      }
      else if (statusLog.groups.gainsLoses == "loses") {
        removeIcon("fandance3");
        // removeCountdownBar("fandance3");
        removeStatus("flourishingfandance");
        dncFlourishCheck();
      }
    }

    else if ("Standard Step" == statusLog.groups.statusName) {
      if (statusLog.groups.gainsLoses == "gains") {
        addStatus("standardstep", parseInt(statusLog.groups.effectDuration) * 1000);
      }
      else if (statusLog.groups.gainsLoses == "loses") {
        removeStatus("standardstep");
      }
    }

    else if ("Standard Finish" == statusLog.groups.statusName) {
      if (statusLog.groups.gainsLoses == "gains") {
        addStatus("standardfinish", parseInt(statusLog.groups.effectDuration) * 1000);
      }
      else if (statusLog.groups.gainsLoses == "loses") {
        removeStatus("standardfinish");
      }
    }

    else if ("Technical Step" == statusLog.groups.statusName) {
      if (statusLog.groups.gainsLoses == "gains") {
        addStatus("technicalstep", parseInt(statusLog.groups.effectDuration) * 1000);
      }
      else if (statusLog.groups.gainsLoses == "loses") {
        removeStatus("technicalstep");
      }
    }

    else if ("Technical Finish" == statusLog.groups.statusName) {
      if (statusLog.groups.gainsLoses == "gains") {
        addStatus("technicalfinish", parseInt(statusLog.groups.effectDuration) * 1000);
      }
      else if (statusLog.groups.gainsLoses == "loses") {
        removeStatus("technicalfinish");
      }
    }
  }
}

function dncCombo() {

  removeIcon("cascade");
  removeIcon("fountain");

  if (count.targets >= 2
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
      addCountdownBar({name: "flourish", time: checkRecast("flourish"), text: "OK"})
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
  && count.targets > 2) {
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

  if (count.targets >= 2) {
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

  if (checkStatus("standardfinish") > 5000 && count.targets >= 5) {
    removeIcon("standardstep");
    removeCountdownBar("standardstep");
  }

  if (count.targets >= 3) {
    removeIcon("fountainfall");
    removeIcon("reversecascade");
  }
}
