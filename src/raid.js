"use strict";

const raidActionList = [

  // ALl
  "Battle Litany",
  "Battle Voice",
  "Chain Stratagem",
  "Devilment",
  "Devotion",
  "Technical Step",
  "Trick Attack",

  // Physical only
  "Brotherhood",
  "Embolden"

];

countdownid.raidbattlelitany = 30;
countdownid.raidbattlevoice = 31;
countdownid.raidbrotherhood = 32;
countdownid.raidchainstratagem = 33;
countdownid.raiddevilment = 34;
countdownid.raiddevotion = 35;
countdownid.raiddragonsight = 36;
countdownid.raidembolden = 37;
countdownid.raidtechnicalstep = 38;
countdownid.raidtrickattack = 39;

function raidAction() {

  // Set up icon changes from combat here

  if (actionList.raid.indexOf(actionLog.groups.actionName) > -1) {

    if ("Battle Litany" == actionLog.groups.actionName) {
      addCountdownBar({name: "raidbattlelitany", time: recast.battlelitany, text: actionLog.groups.sourceName});
    }

    else if ("Battle Voice" == actionLog.groups.actionName) {
      addCountdownBar({name: "raidbattlevoice", time: recast.battlevoice, text: actionLog.groups.sourceName});
    }

    // else if ("Brotherhood" == actionLog.groups.actionName
    // && ["BRD", "DNC", "DRG", "MCH", "MNK", "NIN", "SAM"].indexOf(player.job) > -1) {
    else if ("Brotherhood" == actionLog.groups.actionName) {
      addCountdownBar({name: "raidbrotherhood", time: recast.brotherhood, text: actionLog.groups.sourceName});
    }

    else if ("Chain Stratagem" == actionLog.groups.actionName) {
      addCountdownBar({name: "raidchainstratagem", time: recast.chainstratagem, text: actionLog.groups.sourceName});
    }

    else if ("Devilment" == actionLog.groups.actionName) {
      addCountdownBar({name: "raiddevilment", time: recast.devilment, text: actionLog.groups.sourceName});
    }

    else if ("Devotion" == actionLog.groups.actionName) {
      addCountdownBar({name: "raiddevotion", time: recast.devotion, text: actionLog.groups.sourceName});
    }

    else if ("Dragon Sight" == actionLog.groups.actionName) {
      addCountdownBar({name: "raiddragonsight", time: recast.dragonsight, text: actionLog.groups.sourceName});
    }

    // else if ("Embolden" == actionLog.groups.actionName
    // && ["BRD", "DNC", "DRG", "MCH", "MNK", "NIN", "SAM"].indexOf(player.job) > -1) {
    else if ("Embolden" == actionLog.groups.actionName) {
      addCountdownBar({name: "raidembolden", time: recast.embolden, text: actionLog.groups.sourceName});
    }

    else if ("Technical Step" == actionLog.groups.actionName) {
      addCountdownBar({name: "raidtechnicalstep", time: recast.technicalstep, text: actionLog.groups.sourceName});
    }

    else if ("Trick Attack" == actionLog.groups.actionName) {
      addCountdownBar({name: "raidtrickattack", time: recast.trickattack, text: actionLog.groups.sourceName});
    }

  }

}
