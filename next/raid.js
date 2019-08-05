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

countdownid.raidbattlelitany = 20;
countdownid.raidbattlevoice = 21;
countdownid.raidbrotherhood = 22;
countdownid.raidchainstrategem = 23;
countdownid.raiddevilment = 24;
countdownid.raiddevotion = 25;
countdownid.raiddragonsight = 26;
countdownid.raidembolden = 27;
countdownid.raidtechnicalstep = 28;
countdownid.raidtrickattack = 29;

function raidAction() {

  // Set up icon changes from combat here

  if (actionList.raid.indexOf(actionGroups.actionname) > -1) {

    if ("Battle Litany" == actionGroups.actionname) {
      addCountdownBar("raidbattlelitany", recast.battlelitany, actionGroups.sourcenname);
    }

    else if ("Battle Voice" == actionGroups.actionname) {
      addCountdownBar("raidbattlevoice", recast.battlevoice, actionGroups.sourcenname);
    }

    // else if ("Brotherhood" == actionGroups.actionname
    // && ["BRD", "DNC", "DRG", "MCH", "MNK", "NIN", "SAM"].indexOf(player.job) > -1) {
    else if ("Brotherhood" == actionGroups.actionname) {
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

    else if ("Dragon Sight" == actionGroups.actionname) {
      addCountdownBar("raiddragonsight", recast.dragonsight, actionGroups.sourcenname);
    }

    // else if ("Embolden" == actionGroups.actionname
    // && ["BRD", "DNC", "DRG", "MCH", "MNK", "NIN", "SAM"].indexOf(player.job) > -1) {
    else if ("Embolden" == actionGroups.actionname) {
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
