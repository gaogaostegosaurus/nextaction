"use strict";

id.invigorate = "next11";

icon.invigorate = "000825";

recast.invigorate = 120000;

cooldownList.meleedps = "Invigorate";

function meleedpsPlayerChangedEvent(e) {
  
  // Lucid Reminder
  if (player.maxTP - player.currentTP >= 400 && (!cooldowntime.invigorate || cooldowntime.invigorate - Date.now() < 0)) {
    addIcon(id.invigorate,icon.invigorate);
  }
  else {
    removeIcon(id.invigorate);
  }
}

function meleedpsLogEvent(e,i) {
  
  cooldownLine.meleedps = e.detail.logs[i].match(RegExp(' [\\dA-F]{2}:[\\dA-F]{8}:' + player.name + ':[\\dA-F]{2,8}:(' + cooldownList.meleedps + '):'));
  //roleSelfGainsStatusLine = e.detail.logs[i].match(RegExp(' [\\dA-F]{2}:(' + player.name + ') gains the effect of (' + selfStatusList.healer + ') from (' + player.name + ') for (.*) Seconds\\.'));
  //roleSelfLosesStatusLine = e.detail.logs[i].match(RegExp(' [\\dA-F]{2}:(' + player.name + ') loses the effect of (' + selfStatusList.healerselfStatusList.healer + ') from (' + player.name + ')\\.'));
  
  if (cooldownLine.meleedps) {
    
    if (cooldownLine.meleedps[1] == "Invigorate") {
      removeIcon(id.invigorate);
      cooldowntime.invigorate = Date.now() + recast.invigorate;
    }
  }
}

