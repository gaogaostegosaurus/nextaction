"use strict";

actionList.raid = [

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
      addCountdownBar("raidbattlelitany", recast.battlelitany, actionGroups.sourcenname);
    }

    else if ("Battle Voice" == actionLog.groups.actionName) {
      addCountdownBar("raidbattlevoice", recast.battlevoice, actionGroups.sourcenname);
    }

    // else if ("Brotherhood" == actionLog.groups.actionName
    // && ["BRD", "DNC", "DRG", "MCH", "MNK", "NIN", "SAM"].indexOf(player.job) > -1) {
    else if ("Brotherhood" == actionLog.groups.actionName) {
      addCountdownBar("raidbrotherhood", recast.brotherhood, actionGroups.sourcenname);
    }

    else if ("Chain Stratagem" == actionLog.groups.actionName) {
      addCountdownBar("raidchainstratagem", recast.chainstratagem, actionGroups.sourcenname);
    }

    else if ("Devilment" == actionLog.groups.actionName) {
      addCountdownBar("raiddevilment", recast.devilment, actionGroups.sourcenname);
    }

    else if ("Devotion" == actionLog.groups.actionName) {
      addCountdownBar("raiddevotion", recast.devotion, actionGroups.sourcenname);
    }

    else if ("Dragon Sight" == actionLog.groups.actionName) {
      addCountdownBar("raiddragonsight", recast.dragonsight, actionGroups.sourcenname);
    }

    // else if ("Embolden" == actionLog.groups.actionName
    // && ["BRD", "DNC", "DRG", "MCH", "MNK", "NIN", "SAM"].indexOf(player.job) > -1) {
    else if ("Embolden" == actionLog.groups.actionName) {
      addCountdownBar("raidembolden", recast.embolden, actionGroups.sourcenname);
    }

    else if ("Technical Step" == actionLog.groups.actionName) {
      addCountdownBar("raidtechnicalstep", recast.technicalstep, actionGroups.sourcenname);
    }

    else if ("Trick Attack" == actionLog.groups.actionName) {
      addCountdownBar("raidtrickattack", recast.trickattack, actionGroups.sourcenname);
    }

  }

}
