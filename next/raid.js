"use strict";

var trickTarget;
var trickUser;

// Non-stacking buffs and debuffs are raid buffs now I guess
targetStatusList.raid = "Battle Litany|Battle Voice|Brotherhood|Chain Stratagem|Devotion|Embolden|Foe Requiem|Piercing Resistance Down|Slashing Resistance Down";

function raidLogEvent(e,i) {
  for (var i = 0; i < e.detail.logs.length; i++) {
    
    // Appears that successful trick will have a 8 character code (unsuccessful has 6)
    actionLine.trickattack = e.detail.logs[i].match(RegExp(' [\\dA-F]{2}:[\\dA-F]{8}:([^:]*):[\\dA-F]{2,8}:(Trick Attack):[\\dA-F]{2,8}:([^:]*):([\\dA-F]{2,8}):'));
    targetGainsStatusLine.raid = e.detail.logs[i].match(RegExp(' [\\dA-F]{2}:(.*) gains the effect of (' + targetStatusList.raid + ') from (.*) for (.*) Seconds\\.'));
    targetLosesStatusLine.raid = e.detail.logs[i].match(RegExp(' [\\dA-F]{2}:(.*) loses the effect of (' + targetStatusList.raid + ') from (.*)\\.'));
    
    if (actionLine.trickattack) {
      if (actionLine.trickattack[4].length == 8) {
        trickUser = actionLine.trickattack[1];
        trickTarget = actionLine.trickattack[3];
        statustime.trickattack = Date.now() + 10 * 1000;
        // document.getElementById("debug").innerText = "Trick Attack Successful on " + actionLine.trickattack[3] + " by " + actionLine.trickattack[1];
      }
      /* else {
        document.getElementById("debug").innerText = "Trick Attack Unsuccessful";
      } */
    }
    
    if (targetGainsStatusLine.raid) {
      if (targetGainsStatusLine.raid[2] == "Piercing Resistance Down") {
        statustime.piercingresistancedown = Date.now() + targetGainsStatusLine.raid[4] * 1000;
      }
      else if (targetGainsStatusLine.raid[2] == "Slashing Resistance Down") {
        statustime.slashingresistancedown = Date.now() + targetGainsStatusLine.raid[4] * 1000;
      }
    }
      
    if (targetLosesStatusLine.raid) {
      if (targetLosesStatusLine.raid[2] == "Slashing Resistance Down") {
        delete statustime.piercingresistancedown;
      }
      else if (targetLosesStatusLine.raid[2] == "Slashing Resistance Down") {
        delete statustime.slashingresistancedown;
      }
    }
  }
}
