"use strict";

id.luciddreaming = "next11";
id.swiftcast = "next12";
id.surecast = "next13";


icon.surecast = "000869";

recast.luciddreaming = 120000;
recast.swiftcast = 120000;
recast.surecast = 30000;

cooldownList.magicdps = "Lucid Dreaming|Swiftcast";

function magicdpsPlayerChangedEvent(e) {
  
  // Lucid Reminder
  if (player.currentMP / player.maxMP < 0.6 && (!cooldowntime.luciddreaming || cooldowntime.luciddreaming - Date.now() < 0)) {
    addIcon(id.luciddreaming,icon.luciddreaming);
  }
  else {
    removeIcon(id.luciddreaming);
  }
}

function magicdpsLogEvent(e,i) {
  
  cooldownLine.magicdps = e.detail.logs[i].match(RegExp(' [\\dA-F]{2}:[\\dA-F]{8}:' + player.name + ':[\\dA-F]{2,8}:(' + cooldownList.magicdps + '):'));
  //roleSelfGainsStatusLine = e.detail.logs[i].match(RegExp(' [\\dA-F]{2}:(' + player.name + ') gains the effect of (' + selfStatusList.healer + ') from (' + player.name + ') for (.*) Seconds\\.'));
  //roleSelfLosesStatusLine = e.detail.logs[i].match(RegExp(' [\\dA-F]{2}:(' + player.name + ') loses the effect of (' + selfStatusList.healerselfStatusList.healer + ') from (' + player.name + ')\\.'));
  
  if (cooldownLine.magicdps) {
    
    if (cooldownLine.magicdps[1] == "Lucid Dreaming") {
      removeIcon(id.luciddreaming);
      cooldowntime.luciddreaming = Date.now() + recast.luciddreaming;
    }
    else if (cooldownLine.magicdps[1] == "Swiftcast") {
      removeIcon(id.swiftcast);
      cooldowntime.swoftcast = Date.now() + recast.swiftcast;
    }
  }
}

