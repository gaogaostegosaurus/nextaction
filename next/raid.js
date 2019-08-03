"use strict";

actionList.raid = [

  // ALl
  "Battle Litany",
  "Battle Voice",
  "Chain Strategem",
  "Devilment",
  "Devotion",
  "Technical Step",
  "Trick Attack",

  // Physical only
  "Brotherhood",
  "Embolden"

];

countdownid.raidbattlelitany = 10;
countdownid.raidbattlevoice = 11;
countdownid.raidbrotherhood = 12;
countdownid.raidchainstrategem = 13;
countdownid.raiddevilment = 14;
countdownid.raiddevotion = 15;
countdownid.raidembolden = 16;
countdownid.raidtechnicalstep = 17;
countdownid.raidtrickattack = 18;

function raidAction() {

  // Set up icon changes from combat here

  if (actionList.raid.indexOf(actionGroups.actionname) > -1) {

    if ("Battle Litany" == actionGroups.actionname) {
      addCountdownBar("raidbattlelitany", recast.battlelitany, actionGroups.sourcenname);
    }

    else if ("Battle Voice" == actionGroups.actionname) {
      addCountdownBar("raidbattlevoice", recast.battlevoice, actionGroups.sourcenname);
    }

    else if ("Brotherhood" == actionGroups.actionname
    && ["BRD", "DNC", "DRG", "MCH", "MNK", "NIN", "SAM"].indexOf(player.job) > -1) {
      addCountdownBar("raidbrotherhood", recast.brotherhood, actionGroups.sourcenname);
    }

    else if ("Chain Strategem" == actionGroups.actionname) {
      addCountdownBar("raidchainstrategem", recast.chainstrategem, actionGroups.sourcenname);
    }

    else if ("Devilment" == actionGroups.actionname) {
      addCountdownBar("raiddevilment", recast.devilment, actionGroups.sourcenname);
    }

    else if ("Devotion" == actionGroups.actionname) {
      addCountdownBar("raiddevotion", recast.devotion, actionGroups.sourcenname);
    }

    else if ("Embolden" == actionGroups.actionname
    && ["BRD", "DNC", "DRG", "MCH", "MNK", "NIN", "SAM"].indexOf(player.job) > -1) {
      addCountdownBar("raidembolden", recast.embolden, actionGroups.sourcenname);
    }

    else if ("Technical Step" == actionGroups.actionname) {
      addCountdownBar("raidtechnicalstep", recast.technicalstep, actionGroups.sourcenname);
    }

    else if ("Trick Attack" == actionGroups.actionname) {
      addCountdownBar("raidtrickattack", recast.trickattack, actionGroups.sourcenname);
    }

  }

}
