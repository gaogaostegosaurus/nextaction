"use strict";

icon.rampart = "000801";
icon.awareness = "000807";

recast.rampart = 90000;
recast.awareness = 120000;

function tankLogEvent(e,i) {
  
  cooldownLine.tank = e.detail.logs[i].match(RegExp(' [\\dA-F]{2}:[\\dA-F]{8}:' + player.name + ':[\\dA-F]{2,8}:(' + cooldownList.tank + '):'));
  selfGainsStatusLine.tank = e.detail.logs[i].match(RegExp(' [\\dA-F]{2}:(' + player.name + ') gains the effect of (' + selfStatusList.tank + ') from (' + player.name + ') for (.*) Seconds\\.'));
  selfLosesStatusLine.tank = e.detail.logs[i].match(RegExp(' [\\dA-F]{2}:(' + player.name + ') loses the effect of (' + selfStatusList.tank + ') from (' + player.name + ')\\.'));
  
  if (cooldownLine.tank) {
    if (cooldownLine.tank[1] == "Rampart") {
      cooldowntime.rampart = Date.now() + recast.rampart;
    }
  }
  
  if (selfGainsStatusLine.tank) {
    if (selfGainsStatusLine.tank[2] == "Rampart") {
      statustime.rampart = Date.now() + selfGainsStatusLine.tank[4] * 1000;
      if (statustime.rampart > statustime.mitigation) {
        statustime.mitigation = statustime.rampart;
      }
    }
    else if (selfGainsStatusLine.tank[2] == "Awareness") {
      statustime.awareness = Date.now() + selfGainsStatusLine.tank[4] * 1000;
      if (statustime.awareness > statustime.mitigation) {
        statustime.mitigation = statustime.awareness;
      }
    }
  }
  
  if (selfLosesStatusLine.tank) {
    if (selfLosesStatusLine.tank[2] == "Rampart") {
      delete statustime.rampart;
      if (statustime.mitigation < Date.now() - 1000) {
        if (player.job == "WAR") {
          warMitigation();
        }
      }
    }
    else if (selfLosesStatusLine.tank[2] == "Awareness") {
      delete statustime.awareness;
      if (statustime.mitigation < Date.now() - 1000) {
        if (player.job == "WAR") {
          warMitigation();
        }
      }
    }
  }
}
