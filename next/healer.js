"use strict";

id.luciddreaming = "next11";
id.eyeforaneye = "next12";
id.largesse = "next13";
id.clericstance = "next14";

icon.clericstance = "000881";
icon.protect = "000883";
icon.eyeforaneye = "000887";
icon.largesse = "000888";
icon.rescue = "000890";

recast.clericstance = 90000;
recast.eyeforaneye = 180000;
recast.largesse = 90000;
recast.rescue = 150000;

cooldownList.healer = "Lucid Dreaming";
selfStatusList.healer = "Cleric Stance|Largesse";

function healerPlayerChangedEvent(e) {
  
  // Lucid Reminder
  if (player.currentMP / player.maxMP < 0.6 && (!cooldowntime.luciddreaming || cooldowntime.luciddreaming - Date.now() < 0)) {
    addIcon(id.luciddreaming,icon.luciddreaming);
  }
  else {
    removeIcon(id.luciddreaming);
  }
}

function healerLogEvent(e,i) {
  
  cooldownLine.healer = e.detail.logs[i].match(RegExp(' [\\dA-F]{2}:[\\dA-F]{8}:' + player.name + ':[\\dA-F]{2,8}:(' + cooldownList.healer + '):'));
  selfGainsStatusLine.healer = e.detail.logs[i].match(RegExp(' [\\dA-F]{2}:(' + player.name + ') gains the effect of (' + selfStatusList.healer + ') from (' + player.name + ') for (.*) Seconds\\.'));
  selfLosesStatusLine.healer = e.detail.logs[i].match(RegExp(' [\\dA-F]{2}:(' + player.name + ') loses the effect of (' + selfStatusList.healer + ') from (' + player.name + ')\\.'));
  
  if (cooldownLine.healer) {
    
    if (cooldownLine.healer[1] == "Lucid Dreaming") {
      removeIcon(id.luciddreaming);
      cooldowntime.luciddreaming = Date.now() + recast.luciddreaming;
    }
    
    else if (cooldownLine.healer[1] == "Eye For An Eye") {
      cooldowntime.eyeforaneye = Date.now() + recast.eyeforaneye;
      removeIcon(id.eyeforaneye);
      addIconWithTimeout("eyeforaneye",recast.eyeforaneye,id.eyeforaneye,icon.eyeforaneye);
      //clearTimeout(timeout.eyeforaneye);
      //timeout.eyeforaneye = setTimeout(addIcon, cooldowntime.eyeforaneye - Date.now(), id.eyeforaneye, icon.eyeforaneye);
    }
  }
  
  if (selfGainsStatusLine.healer) {
    if (selfGainsStatusLine.healer[2] == "Cleric Stance") {
      statustime.clericstance = Date.now() + selfGainsStatusLine.healer[4] * 1000;
    }
    
    else if (selfGainsStatusLine.healer[2] == "Largesse") {
      statustime.largesse = Date.now() + selfGainsStatusLine.healer[4] * 1000;
    }
  }
}

