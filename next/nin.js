"use strict";

var shadowfangBuffer = 9000; // Refresh Shadow Fang under this many seconds
var mudraCount = 0;
var mudraCombo = "";

id.mudra1 = "nextAction1";
id.mudra2 = "nextAction2";
id.mudra3 = "nextAction3";
id.ninjutsu = "nextAction4";
id.spinningedge = "nextAction5";
id.gustslash = "nextAction6";
id.aeolianedge = "nextAction7";

id.trickattack = "nextAction11";
id.ninki = "nextAction12";

actionList.nin = "Spinning Edge|Gust Slash|Throwing Dagger|Aeolian Edge|Shadow Fang|Death Blossom|Armor Crush";
actionList.mudra = "Ten|Chi|Jin";
cooldownList.nin = "Shade Shift|Hide|Assassinate|Mug|Trick Attack|Jugulate|Shukuchi|Kassatsu|Smoke Screen|Shadewalker|Duality|Dream Within a Dream|Hellfrog Medium|Bhavacakra|Ten Chi Jin|Fuma Shuriken|Katon|Raiton|Hyoton|Huton|Doton|Suiton";
selfStatusList.nin = "Mudra|Doton|Suiton|Kassatsu|Duality|Ten Chi Jin";
targetStatusList.nin = "Shadow Fang";

function ninPlayerChangedEvent(e) {
  
  if (player.jobDetail.ninkiAmount >= 80) {
    if (player.level >= 70 && (!cooldowntime.tenchijin || cooldowntime.tenchijin - Date.now() < 1000)) {
      addIcon(id.ninki,icon.tenchijin);
    }
    else if (toggle.aoe) {
      addIcon(id.ninki,icon.hellfrogmedium);
    }
    else if (player.level >= 68 && (!cooldowntime.bhavacakra || cooldowntime.bhavacakra - Date.now() < 1000)) {
      addIcon(id.ninki,icon.bhavacakra);
    }
    else if (player.jobDetail.ninkiAmount >= 94) {
      addIcon(id.ninki,icon.hellfrogmedium);
    }
  }
  else {
    removeIcon(id.ninki);
  }
}

function ninLogEvent(e,i) {
  
  actionLine.nin = e.detail.logs[i].match(RegExp(' [\\dA-F]{2}:[\\dA-F]{8}:' + player.name + ':[\\dA-F]{2,8}:(' + actionList.nin + '):([\\dA-F]{2,8}):([^:]*):([\\dA-F]{2,8}):'));
  actionLine.mudra = e.detail.logs[i].match(RegExp(' [\\dA-F]{2}:[\\dA-F]{8}:' + player.name + ':[\\dA-F]{2,8}:(' + actionList.mudra + '):'));
  cooldownLine.nin = e.detail.logs[i].match(RegExp(' [\\dA-F]{2}:[\\dA-F]{8}:' + player.name + ':[\\dA-F]{2,8}:(' + cooldownList.nin + '):'));
  
  selfGainsStatusLine.nin = e.detail.logs[i].match(RegExp(' 00:08ae:.*(You) gain the effect of (' + selfStatusList.nin + ')\\.'));
  selfLosesStatusLine.nin = e.detail.logs[i].match(RegExp(' 00:08b0:.*(You) lose the effect of (' + selfStatusList.nin + ')\\.'));
  // selfGainsStatusLine.nin = e.detail.logs[i].match(RegExp(' [\\dA-F]{2}:(' + player.name + ') gains the effect of (' + selfStatusList.nin + ') from (' + player.name + ') for (.*) Seconds\\.'));
  // selfLosesStatusLine.nin = e.detail.logs[i].match(RegExp(' [\\dA-F]{2}:(' + player.name + ') loses the effect of (' + selfStatusList.nin + ') from (' + player.name + ')\\.'));

  
  targetGainsStatusLine.nin = e.detail.logs[i].match(RegExp(' [\\dA-F]{2}:(.*) gains the effect of (' + targetStatusList.nin + ') from (' + player.name + ') for (.*) Seconds\\.'));
  targetLosesStatusLine.nin = e.detail.logs[i].match(RegExp(' [\\dA-F]{2}:(.*) loses the effect of (' + targetStatusList.nin + ') from (' + player.name + ')\\.'));
  
  if (actionLine.nin) {
    
    if (actionLine.nin[1] == "Death Blossom") { // AoE Toggle
      toggle.aoe = 1;
    }
    else {
      delete toggle.aoe;
    }
    
    if (actionLine.nin[1] == "Death Blossom" && !toggle.combat) {
      // Nothing
    }
    else if (actionLine.nin[1] == "Spinning Edge" && actionLine.nin[4].length >= 2) {
      if (!toggle.combo) {
        ninCombo();
      }
      removeIcon(id.spinningedge);
    }
    else if (actionLine.nin[1] == "Gust Slash" && actionLine.nin[4].length == 8) {
      if (player.level < 26) {
        delete toggle.combo;
        ninCombo();
      }
      else {
        removeIcon(id.gustslash);
      }
    }
    else if (actionLine.nin[1] == "Shadow Fang" && actionLine.nin[4].length == 8) {
      statustime.slashingresistancedown = Date.now() + 21000;
      statustime.shadowfang = Date.now() + 21000;
      delete toggle.combo;
      ninCombo();
    }
    else {
      delete toggle.combo;
      ninCombo();
    }
    
    previous.action = actionLine.nin[1];
    timeoutCombo();
  }
  
  if (actionLine.mudra) {
    
    if (actionLine.mudra[1] == "Ten") {
      mudraCombo = mudraCombo + "T";
      mudra();
    }
    else if (actionLine.mudra[1] == "Chi") {
      mudraCombo = mudraCombo + "C";
      mudra();
    }
    else if (actionLine.mudra[1] == "Jin") {
      mudraCombo = mudraCombo + "J";
      mudra();
    }
  }
  
  if (cooldownLine.nin) {
    
    if (cooldownLine.nin[1] == "Hide") {
      cooldowntime.hide = Date.now() + recast.hide;
      delete cooldowntime.ninjutsu;
      ninjutsu();
    }
    else if (cooldownLine.nin[1] == "Trick Attack") {
      cooldowntime.trickattack = Date.now() + recast.trickattack;
    }
    else if (cooldownLine.nin[1] == "Shukuchi") {
      cooldowntime.shukuchi = Date.now() + recast.shukuchi;
    }
    else if (cooldownLine.nin[1] == "Kassatsu") {
      removeIcon(id.kassatsu);
      cooldowntime.kassatsu = Date.now() + recast.kassatsu;
      delete cooldowntime.ninjutsu;
      toggle.kassatsu = 1;
      clearTimeout(timeout.ninjutsu);
      ninjutsu();
    }
    else if (cooldownLine.nin[1] == "Shadewalker") {
      cooldowntime.shadewalker = Date.now() + recast.shadewalker;
    }
    else if (cooldownLine.nin[1] == "Duality") {
      cooldowntime.duality = Date.now() + recast.duality;
    }
    else if (cooldownLine.nin[1] == "Dream Within A Dream") {
      cooldowntime.dreamwithinadream = Date.now() + recast.dreamwithinadream;
    }
    else if (cooldownLine.nin[1] == "Bhavacakra") {
      removeIcon(id.ninki);
      cooldowntime.bhavacakra = Date.now() + recast.bhavacakra;
    }
    else if (cooldownLine.nin[1] == "Ten Chi Jin") {
      removeIcon(id.ninki);
      cooldowntime.tenchijin = Date.now() + recast.tenchijin;
      delete cooldowntime.ninjutsu;
      toggle.tenchijin = 1;
      clearTimeout(timeout.ninjutsu);
      ninjutsu();
    }
    // Ninjutsu cooldown
    else if (["Rabbit Medium","Fuma Shuriken","Katon","Raiton","Hyoton","Huton","Doton","Suiton"].indexOf(cooldownLine.nin[1]) > -1) {
      clearNinjutsu();
      cooldowntime.ninjutsu = Date.now() + recast.ninjutsu;
      clearTimeout(timeout.ninjutsu);
      timeout.ninjutsu = setTimeout(ninjutsu,recast.ninjutsu);
    }
  }
  
  if (selfGainsStatusLine) {
    if (selfGainsStatusLine[2] == "Mudra") {
      statustime.mudra = Date.now() + statuslength.mudra;
    }
    else if (selfGainsStatusLine[2] == "Doton") {
      statustime.doton = Date.now() + statuslength.doton;
    }
    else if (selfGainsStatusLine[2] == "Suiton") {
      statustime.suiton = Date.now() + statuslength.suiton;
    }
    else if (selfGainsStatusLine[2] == "Kassatsu") {
      statustime.kassatsu = Date.now() + statuslength.kassatsu;
    }
    else if (selfGainsStatusLine[2] == "Duality") {
      statustime.duality = Date.now() + statuslength.duality;
    }
    else if (selfGainsStatusLine[2] == "Ten Chi Jin") {
      statustime.tenchijin = Date.now() + statuslength.tenchijin;
    }
  }
  
  if (selfLosesStatusLine.nin) {
    if (selfLosesStatusLine.nin[2] == "Mudra") {
      delete statustime.mudra
      clearNinjutsu();
    }
    else if (selfLosesStatusLine.nin[2] == "Doton") {
      delete statustime.doton;
    }
    else if (selfLosesStatusLine.nin[2] == "Suiton") {
      delete statustime.suiton;
    }
    else if (selfLosesStatusLine.nin[2] == "kassatsu") {
      delete statustime.kassatsu;
      delete toggle.kassatsu;
    }
    else if (selfLosesStatusLine.nin[2] == "Duality") {
      delete statustime.duality;
    }
    else if (selfLosesStatusLine.nin[2] == "Ten Chi Jin") {
      delete statustime.tenchijin;
      delete toggle.tenchijin;
      clearNinjutsu();
    }
  }
  
  if (targetGainsStatusLine.nin) {
    
    if (targetGainsStatusLine.nin[2] == "Shadow Fang") {
      statustime.shadowfang = Date.now() + parseInt(targetGainsStatusLine.nin[4]) * 1000;
      ninCombo();
    }
  }
  
  if (targetLosesStatusLine.nin) {
    
    if (targetLosesStatusLine.nin[2] == "Shadow Fang") {
      delete statustime.shadowfang;
    }
  }
}

function ninCombo() {
  
  if (player.level >= 54 && player.jobDetail.hutonMilliseconds > 0 && player.jobDetail.hutonMilliseconds < 15000) {
    armorcrushCombo();
  }
  else if (player.level >= 38 && statustime.slashingresistancedown - Date.now() < shadowfangBuffer) {
    shadowfangCombo();
  }
  else if (player.level >= 58 && cooldowntime.duality < 2000) {
    aeolianedgeCombo();
  }
  else if (player.level >= 38 && !statustime.shadowfang) {
    shadowfangCombo();
  }
  else if (player.level >= 54 && player.jobDetail.hutonMilliseconds > 0 && player.jobDetail.hutonMilliseconds < 40000) {
    armorcrushCombo();
  }
  else {
    aeolianedgeCombo();
  }
}

function aeolianedgeCombo() {
  toggle.combo = 1;
  addIcon(id.spinningedge, icon.spinningedge);
  if (player.level >= 4) {
    addIcon(id.gustslash, icon.gustslash);
  }
  if (player.level >= 26) {
    addIcon(id.aeolianedge, icon.aeolianedge);
  }
}

function shadowfangCombo() {
  toggle.combo = 2;
  addIcon(id.spinningedge, icon.spinningedge);
  addIcon(id.gustslash, icon.gustslash);
  addIcon(id.aeolianedge, icon.shadowfang);
}

function armorcrushCombo() {
  toggle.combo = 3;
  addIcon(id.spinningedge, icon.spinningedge);
  addIcon(id.gustslash, icon.gustslash);
  addIcon(id.aeolianedge, icon.armorcrush);
}

function ninjutsu() {
  
  if (player.level >= 45 && !cooldowntime.trickattack) {
    // Suiton TCJ CTJ
    toggle.ninjutsu = 7;
    addIcon(id.mudra1,icon.ten);
    addIcon(id.mudra2,icon.chi);
    addIcon(id.mudra3,icon.jin);
    addIcon(id.ninjutsu,icon.suiton);
  }
  else if (player.level >= 45 && cooldowntime.trickattack - Date.now() < 20000) {
    // Suiton TCJ CTJ
    toggle.ninjutsu = 7;
    addIconWithTimeout("mudra1",cooldowntime.trickattack - Date.now() - 10000,id.mudra1,icon.ten);
    addIconWithTimeout("mudra2",cooldowntime.trickattack - Date.now() - 10000,id.mudra2,icon.chi);
    addIconWithTimeout("mudra3",cooldowntime.trickattack - Date.now() - 10000,id.mudra3,icon.jin);
    addIconWithTimeout("ninjutsu",cooldowntime.trickattack - Date.now() - 10000,id.ninjutsu,icon.suiton);
  }
  else if (player.level >= 54 && player.jobDetail.hutonMilliseconds == 0 && !toggle.kassatsu && !toggle.tenchijin) {
    // Huton JCT CJT
    toggle.ninjutsu = 5;
    addIcon(id.mudra1,icon.jin);
    addIcon(id.mudra2,icon.chi);
    addIcon(id.mudra3,icon.ten);
    addIcon(id.ninjutsu,icon.huton);
  }
  else if (player.level >= 45 && player.jobDetail.hutonMilliseconds < 20000 && !toggle.kassatsu && !toggle.tenchijin) {
    // Huton JCT CJT
    toggle.ninjutsu = 5;
    addIcon(id.mudra1,icon.jin);
    addIcon(id.mudra2,icon.chi);
    addIcon(id.mudra3,icon.ten);
    addIcon(id.ninjutsu,icon.huton);
  }
  else if (player.level >= 35 && toggle.aoe == 1 && !toggle.tenchijin) {
    // Katon CT JT
    toggle.ninjutsu = 2;
    addIcon(id.mudra1,icon.chi);
    addIcon(id.mudra2,icon.ten);
    removeIcon(id.mudra3);
    addIcon(id.ninjutsu,icon.katon);
  }
  else if (player.level >= 64 && cooldowntime.shukuchi - Date.now() > 0 && !toggle.tenchijin) {
    // Raiton TC JC
    toggle.ninjutsu = 3;
    addIcon(id.mudra1,icon.ten);
    addIcon(id.mudra2,icon.chi);
    removeIcon(id.mudra3);
    addIcon(id.ninjutsu,icon.raiton);
  }
  else if (toggle.tenchijin) {
    toggle.ninjutsu = 6;
    addIcon(id.mudra1,icon.ten);
    addIcon(id.mudra2,icon.jin);
    addIcon(id.mudra3,icon.chi);
    addIcon(id.ninjutsu,icon.doton);
  }
  else {
    // Fuma
    toggle.ninjutsu = 1;
    addIcon(id.mudra1,icon.ten);
    removeIcon(id.mudra2);
    removeIcon(id.mudra3);
    addIcon(id.ninjutsu,icon.fumashuriken);
  }
}

function mudra() {
  
  if (mudraCombo.length == 1) {
    removeIcon(id.mudra1);
  }
  else if (mudraCombo.length == 2) {
    removeIcon(id.mudra2)
  }
  else if (mudraCombo.length == 3) {
    removeIcon(id.mudra3)
  }
  
  if (toggle.ninjutsu == 1) {
    if (mudraCombo == "T") {
      // 
    }
    else if (mudraCombo == "C") {
      // 
    }
    else if (mudraCombo == "J") {
      // 
    }
    else if (mudraCombo == "CT" || mudraCombo == "JT") {
      addIcon(id.ninjutsu,icon.katon);
    }
    else if (mudraCombo == "TC" || mudraCombo == "JC") {
      addIcon(id.ninjutsu,icon.raiton);
    }
    else if (mudraCombo == "TJ" || mudraCombo == "CJ") {
      addIcon(id.ninjutsu,icon.hyoton);
    }
    else if (mudraCombo == "CJT" || mudraCombo == "JCT") {
      addIcon(id.ninjutsu,icon.huton);
    }
    else if (mudraCombo == "TJC" || mudraCombo == "JTC") {
      addIcon(id.ninjutsu,icon.doton);
    }
    else if (mudraCombo == "TCJ" || mudraCombo == "CTJ") {
      addIcon(id.ninjutsu,icon.suiton);
    }
    else {
      addIcon(id.ninjutsu,icon.rabbitmedium);
    }
  }
  
  else if (toggle.ninjutsu == 2) {
    if (mudraCombo == "T") {
      addIcon(id.ninjutsu,icon.fumashuriken);
    }
    else if (mudraCombo == "C") {
      // 
    }
    else if (mudraCombo == "J") {
      // 
    }
    else if (mudraCombo == "CT" || mudraCombo == "JT") {
      // 
    }
    else if (mudraCombo == "TC" || mudraCombo == "JC") {
      addIcon(id.ninjutsu,icon.raiton);
    }
    else if (mudraCombo == "TJ" || mudraCombo == "CJ") {
      addIcon(id.ninjutsu,icon.hyoton);
    }
    else if (mudraCombo == "CJT" || mudraCombo == "JCT") {
      addIcon(id.ninjutsu,icon.huton);
    }
    else if (mudraCombo == "TJC" || mudraCombo == "JTC") {
      addIcon(id.ninjutsu,icon.doton);
    }
    else if (mudraCombo == "TCJ" || mudraCombo == "CTJ") {
      addIcon(id.ninjutsu,icon.suiton);
    }
    else {
      addIcon(id.ninjutsu,icon.rabbitmedium);
    }
  }
  
  else if (toggle.ninjutsu == 3) {
    if (mudraCombo == "T") {
      //
    }
    else if (mudraCombo == "C") {
      addIcon(id.ninjutsu,icon.fumashuriken);
    }
    else if (mudraCombo == "J") {
      // 
    }
    else if (mudraCombo == "CT" || mudraCombo == "JT") {
      addIcon(id.ninjutsu,icon.katon); 
    }
    else if (mudraCombo == "TC" || mudraCombo == "JC") {
      
    }
    else if (mudraCombo == "TJ" || mudraCombo == "CJ") {
      addIcon(id.ninjutsu,icon.hyoton);
    }
    else if (mudraCombo == "CJT" || mudraCombo == "JCT") {
      addIcon(id.ninjutsu,icon.huton);
    }
    else if (mudraCombo == "TJC" || mudraCombo == "JTC") {
      addIcon(id.ninjutsu,icon.doton);
    }
    else if (mudraCombo == "TCJ" || mudraCombo == "CTJ") {
      addIcon(id.ninjutsu,icon.suiton);
    }
    else {
      addIcon(id.ninjutsu,icon.rabbitmedium);
    }
  }
  
  else if (toggle.ninjutsu == 5) {
    if (mudraCombo == "T") {
      addIcon(id.ninjutsu,icon.fumashuriken);
    }
    else if (mudraCombo == "C") {
      //
    }
    else if (mudraCombo == "J") {
      //
    }
    else if (mudraCombo == "CT" || mudraCombo == "JT") {
      addIcon(id.ninjutsu,icon.katon);
    }
    else if (mudraCombo == "TC") {
      addIcon(id.ninjutsu,icon.raiton);
    }
    else if (mudraCombo == "JC") {
      //
    }
    else if (mudraCombo == "TJ") {
      addIcon(id.ninjutsu,icon.hyoton);
    }
    else if (mudraCombo == "CJ") {
      // 
    }
    else if (mudraCombo == "CJT" || mudraCombo == "JCT") {
      // 
    }
    else if (mudraCombo == "TJC" || mudraCombo == "JTC") {
      addIcon(id.ninjutsu,icon.doton);
    }
    else if (mudraCombo == "TCJ" || mudraCombo == "CTJ") {
      addIcon(id.ninjutsu,icon.suiton);
    }
    else {
      addIcon(id.ninjutsu,icon.rabbitmedium);
    }
  }
  
  else if (toggle.ninjutsu == 6) {
    if (mudraCombo == "T") {
      // 
    }
    else if (mudraCombo == "J") {
      // 
    }
    else if (mudraCombo == "C") {
      addIcon(id.ninjutsu,icon.fumashuriken);
    }
    else if (mudraCombo == "CT") {
      addIcon(id.ninjutsu,icon.katon);
    }
    else if (mudraCombo == "JT") {
      //
    }
    else if (mudraCombo == "TC" || mudraCombo == "JC") {
      addIcon(id.ninjutsu,icon.raiton);
    }
    else if (mudraCombo == "TJ") {
      addIcon(id.ninjutsu,icon.hyoton);
    }
    else if (mudraCombo == "CJ") {
      // 
    }
    else if (mudraCombo == "CJT" || mudraCombo == "JCT") {
      addIcon(id.ninjutsu,icon.huton);
    }
    else if (mudraCombo == "TJC" || mudraCombo == "JTC") {
      // 
    }
    else if (mudraCombo == "TCJ" || mudraCombo == "CTJ") {
      addIcon(id.ninjutsu,icon.suiton);
    }
    else {
      addIcon(id.ninjutsu,icon.rabbitmedium);
    }
  }
  
  if (toggle.ninjutsu == 7) {
    if (mudraCombo == "T") {
      // 
    }
    else if (mudraCombo == "C") {
      // 
    }
    else if (mudraCombo == "J") {
      clearNinjutsu();
      addIcon(id.ninjutsu,icon.fumashuriken);
    }
    else if (mudraCombo == "TC" || mudraCombo == "CT") {
      // 
    }
    else if (mudraCombo == "JT") {
      clearNinjutsu();
      addIcon(id.ninjutsu,icon.katon);
    }
    else if (mudraCombo == "JC") {
      clearNinjutsu();
      addIcon(id.ninjutsu,icon.raiton);
    }
    else if (mudraCombo == "TCJ" || mudraCombo == "CTJ") {
      // 
    }
    else if (mudraCombo == "TJ" || mudraCombo == "CJ") {
      clearNinjutsu();
      addIcon(id.ninjutsu,icon.hyoton);
    }
    else if (mudraCombo == "CJT" || mudraCombo == "JCT") {
      clearNinjutsu();
      addIcon(id.ninjutsu,icon.huton);
    }
    else if (mudraCombo == "TJC" || mudraCombo == "JTC") {
      clearNinjutsu();
      addIcon(id.ninjutsu,icon.doton);
    }
    else {
      addIcon(id.ninjutsu,icon.rabbitmedium);
    }
  }
}

function clearNinjutsu() {
  removeIcon(id.mudra1);
  removeIcon(id.mudra2);
  removeIcon(id.mudra3);
  removeIcon(id.ninjutsu);
  mudraCombo = "";
}

icon.spinningedge = "000601";
icon.gustslash = "000602";
icon.aeolianedge = "000605";
icon.shadowfang = "000606";
icon.shadeshift = "000607";
icon.hide = "000609";
icon.mug = "000613";
icon.jugulate = "000616";
icon.trickattack = "000618";

icon.ten = "002901";
icon.chi = "002902";
icon.jin = "002903";
icon.ninjutsu = "002904";
icon.shukuchi = "002905";
icon.kassatsu = "002906";
icon.fumashuriken = "002907";
icon.katon = "002908";
icon.hyoton = "002909"
icon.huton = "002910";
icon.doton = "002911";
icon.raiton = "002912";
icon.suiton = "002913";
icon.rabbitmedium = "002913";
icon.armorcrush = "002915";
icon.shadewalker = "002916";
icon.smokescreen = "002917";
icon.dreamwithinadream = "002918";
icon.duality = "002919";
icon.hellfrogmedium = "002920";
icon.bhavacakra = "002921";
icon.tenchijin = "002922";

recast.trickattack = 60000;
recast.ninjutsu = 20000;
recast.kassatsu = 120000;
recast.duality = 90000;
recast.dreamwithinadream = 60000;
recast.bhavacakra = 50000;
recast.tenchijin = 100000;

statuslength.mudra = 10000;
statuslength.doton = 24000;
statuslength.suiton = 10000;
statuslength.kassatsu = 10000;
statuslength.duality = 10000;
statuslength.tenchijin = 10000;
