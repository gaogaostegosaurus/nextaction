"use strict";

id.freecure = "nextAction1";
id.aero = "nextAction2";
id.aero2 = "nextAction2";
id.aero3 = "nextAction3";
id.regen = "nextAction4";
id.medica2 = "nextAction5";
id.assize = "nextAction11";
id.thinair = "nextAction11";
id.benediction = "nextAction12";
id.tetragrammaton = "nextAction12";
id.asylum = "nextAction13";
id.divinebenison = "nextAction14";
id.plenaryindulgence = "nextAction15";

icon.aero = "000401";
icon.aero2 = "000402";
icon.freecure = "000406";
icon.medica2 = "000409";
icon.benediction = "002627";
icon.regen = "002628";
icon.asylum = "002632";
icon.assize = "002634";
icon.aero3 = "002635";
icon.tetragrammaton = "002633";
icon.divinebenison = "002635";
icon.thinair = "002636";
icon.plenaryindulgence = "002639";

recast.presenceofmind = 150000;
recast.benediction = 180000;
recast.asylum = 90000;
recast.assize = 45000;
recast.tetragrammaton = 60000;
recast.thinair = 120000;
recast.divinebenison = 30000;
recast.plenaryindulgence = 120000;

var whmLilyCount = 0;
var whmLilyRecast = 1;

cooldownList.whm = "Benediction|Asylum|Assize|Tetragrammaton|Thin Air|Divine Benison|Plenary Indulgence";
targetStatusList.whm = "Aero|Aero II|Aero III|Regen";
selfStatusList.whm = "Freecure|Medica II";

function whmPlayerChangedEvent(e) {

  // Use cooldowns to reset lily count
  if (player.jobDetail.lilies == 1) {
    whmLilyCount = 1;
  }
  else if (player.jobDetail.lilies == 2) {
    whmLilyCount = 2;
  }
  else if (player.jobDetail.lilies == 3) {
    whmLilyCount = 3;
  }

  if (whmLilyCount == 1) {
    whmLilyRecast = 0.94;
  }
  if (whmLilyCount == 2) {
    whmLilyRecast = 0.9;
  }
  if (whmLilyCount == 3) {
    whmLilyRecast = 0.8;
  }
  else {
    whmLilyRecast = 1;
  }

  if (player.level >= 56 && player.currentMP / player.maxMP < 0.8 && (!cooldowntime.assize || cooldowntime.assize < Date.now())) {
    addIcon(id.assize,icon.assize);
  }
  else if (player.level >= 62 && player.currentMP / player.maxMP < 0.6 && (!cooldowntime.thinair || cooldowntime.thinair < Date.now())) {
    addIcon(id.thinair,icon.thinair);
  }
  else {
    removeIcon(id.assize);
  }
}

function whmLogEvent(e,i) {

  cooldownLine.whm = e.detail.logs[i].match(RegExp(' [\\dA-F]{2}:[\\dA-F]{8}:' + player.name + ':[\\dA-F]{2,8}:(' + cooldownList.whm + '):'));
  selfGainsStatusLine.whm = e.detail.logs[i].match(RegExp(' [\\dA-F]{2}:(' + player.name + ') gains the effect of (' + selfStatusList.whm + ') from (' + player.name + ') for (.*) Seconds\\.'));
  selfLosesStatusLine.whm = e.detail.logs[i].match(RegExp(' [\\dA-F]{2}:(' + player.name + ') loses the effect of (' + selfStatusList.whm + ') from (' + player.name + ')\\.'));
  targetGainsStatusLine.whm = e.detail.logs[i].match(RegExp(' [\\dA-F]{2}:(.*) gains the effect of (' + targetStatusList.whm + ') from (' + player.name + ') for (.*) Seconds\\.'));
  targetLosesStatusLine.whm = e.detail.logs[i].match(RegExp(' [\\dA-F]{2}:(.*) loses the effect of (' + targetStatusList.whm + ') from (' + player.name + ')\\.'));

  if (cooldownLine.whm) {
    if (cooldownLine.whm[1] == "Presence Of Mind") {
      cooldowntime.presenceofmind = Date.now() + recast.presenceofmind;
    }
    else if (cooldownLine.whm[1] == "Benediction") {
      removeIcon(id.benediction);
      cooldowntime.benediction = Date.now() + recast.benediction;
      if (player.level >= 60 && !cooldowntime.tetragrammaton) {
        addIcon(id.tetragrammaton,icon.tetragrammaton);
      }
      else if (cooldowntime.tetragrammaton < cooldowntime.benediction) {
        addIconWithTimeout("tetragrammaton",cooldowntime.tetragrammaton - Date.now(),id.tetragrammaton,icon.tetragrammaton);
      }
      else {
        addIconWithTimeout("benediction",recast.benediction,id.benediction,icon.benediction);
      }
    }
    else if (cooldownLine.whm[1] == "Asylum") {
      removeIcon(id.asylum);
      cooldowntime.asylum = Date.now() + recast.asylum * whmLilyRecast;
      whmLilyCount = 0;
    }
    else if (cooldownLine.whm[1] == "Assize") {
      removeIcon(id.assize);
      cooldowntime.assize = Date.now() + recast.assize * whmLilyRecast;
      whmLilyCount = 0;
    }
    else if (cooldownLine.whm[1] == "Tetragrammaton") {
      removeIcon(id.tetragrammaton);
      cooldowntime.tetragrammaton = Date.now() + recast.tetragrammaton * whmLilyRecast;
      whmLilyCount = 0;
      if (!cooldowntime.benediction) {
        addIcon(id.benediction,icon.benediction);
      }
      else if (cooldowntime.benediction < cooldowntime.tetragrammaton) {
        addIconWithTimeout("benediction",cooldowntime.benediction - Date.now(),id.benediction,icon.benediction);
      }
      else {
        addIconWithTimeout("tetragrammaton",cooldowntime.tetragrammaton - Date.now(),id.tetragrammaton,icon.tetragrammaton);
      }
    }
    else if (cooldownLine.whm[1] == "Divine Benison") {
      removeIcon(id.divinebenison);
      cooldowntime.divinebenison = Date.now() + recast.divinebenison * whmLilyRecast;
      whmLilyCount = 0;
    }
    else if (cooldownLine.whm[1] == "Thin Air") {
      removeIcon(id.thinair);
      cooldowntime.thinair = Date.now() + recast.thinair;
    }
  }

  if (selfGainsStatusLine.whm) {
    if (selfGainsStatusLine.whm[2] == "Freecure") {
      statustime.freecure = Date.now() + parseInt(selfGainsStatusLine.whm[4]) * 1000;
      addIcon(id.freecure,icon.freecure);
    }
    else if (selfGainsStatusLine.whm[2] == "Medica II") {
      statustime.medica2 = Date.now() + parseInt(selfGainsStatusLine.whm[4]) * 1000;
      removeIcon(id.medica2);
      addIconWithTimeout("medica2",statustime.medica2 - Date.now(),id.medica2,icon.medica2);
    }
  }

  if (selfLosesStatusLine.whm) {
    if (selfLosesStatusLine.whm[2] == "Freecure") {
      removeIcon(id.freecure);
    }
    else if (selfLosesStatusLine.whm[2] == "Medica II") {
      if (toggle.combat) {
        addIcon(id.medica2,icon.medica2);
      }
    }
  }

  if (targetGainsStatusLine.whm) {
    if (targetGainsStatusLine.whm[2] == "Aero") {
      statustime.aero = Date.now() + parseInt(targetGainsStatusLine.whm[4]) * 1000;
      removeIcon(id.aero);
      addIconWithTimeout("aero",statustime.aero - Date.now(),id.aero,icon.aero);
    }
    else if (targetGainsStatusLine.whm[2] == "Aero II") {
      statustime.aero = Date.now() + parseInt(targetGainsStatusLine.whm[4]) * 1000;
      removeIcon(id.aero2);
      addIconWithTimeout("aero",statustime.aero - Date.now(),id.aero2,icon.aero2);
    }
    else if (targetGainsStatusLine.whm[2] == "Aero III") {
      statustime.aero3 = Date.now() + parseInt(targetGainsStatusLine.whm[4]) * 1000;
      removeIcon(id.aero3);
      addIconWithTimeout("aero3",statustime.aero3 - Date.now(),id.aero3,icon.aero3);
    }
    else if (targetGainsStatusLine.whm[2] == "Regen") {
      statustime.regen = Date.now() + parseInt(targetGainsStatusLine.whm[4]) * 1000;
      removeIcon(id.regen);
      addIconWithTimeout("regen",statustime.regen - Date.now(),id.regen,icon.regen);
    }
  }

  if (targetLosesStatusLine.whm) {
    if (targetLosesStatusLine.whm[2] == "Aero") {
      delete statustime.aero;
      if (toggle.combat) {
        addIcon(id.aero,icon.aero);
      }
    }
    else if (targetLosesStatusLine.whm[2] == "Aero II") {
      delete statustime.aero;
      if (toggle.combat) {
        addIcon(id.aero2,icon.aero2);
      }
    }
    else if (targetLosesStatusLine.whm[2] == "Aero III") {
      delete statustime.aero3;
      if (toggle.combat) {
        addIcon(id.aero3,icon.aero3);
      }
    }
    else if (targetLosesStatusLine.whm[2] == "Regen") {
      delete statustime.regen;
      if (toggle.combat) {
        addIcon(id.regen,icon.regen);
      }
    }
  }
}
