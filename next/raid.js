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
      addRaidCountdownBar("raidbattlelitany");
    }

    else if ("Battle Voice" == actionGroups.actionname) {
      addRaidCountdownBar("raidbattlevoice");
    }

    else if ("Brotherhood" == actionGroups.actionname
    && ["BRD", "DNC", "DRG", "MCH", "MNK", "NIN", "SAM"].indexOf(player.job) > -1) {
      addRaidCountdownBar("raidbrotherhood");
    }

    else if ("Chain Strategem" == actionGroups.actionname) {
      addRaidCountdownBar("raidchainstrategem");
    }

    else if ("Devilment" == actionGroups.actionname) {
      addRaidCountdownBar("raiddevilment");
    }

    else if ("Devotion" == actionGroups.actionname) {
      addRaidCountdownBar("raiddevotion");
    }

    else if ("Embolden" == actionGroups.actionname
    && ["BRD", "DNC", "DRG", "MCH", "MNK", "NIN", "SAM"].indexOf(player.job) > -1) {
      addRaidCountdownBar("raidembolden");
    }

    else if ("Technical Step" == actionGroups.actionname) {
      addRaidCountdownBar("raidtechnicalstep");
    }

    else if ("Trick Attack" == actionGroups.actionname) {
      addRaidCountdownBar("raidtrickattack");
    }

  }

}
