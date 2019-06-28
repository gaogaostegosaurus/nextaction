"use strict";

var shadowfangBuffer = 9000; // Refresh Shadow Fang under this many seconds
var mudraCount = 0;
toggle.mudra = "";

id.mudra1 = "next0";
id.mudra2 = "next1";
id.mudra3 = "next2";
id.ninjutsu = "next3";
id.spinningedge = "next4";
id.gustslash = "next5";
id.aeolianedge = "next6";
id.shadowfang = id.aeolianedge;
id.armorcrush = id.aeolianedge;

id.trickattack = "next10";
id.hellfrogmedium = "next11";
id.bhavacakra = id.hellfrogmedium;
id.tenchijin = id.hellfrogmedium;


actionList.nin = ["Shade Shift", "Hide", "Assassinate", "Mug", "Trick Attack", "Jugulate", "Shukuchi", "Kassatsu", "Smoke Screen", "Shadewalker", "Duality", "Dream Within a Dream",
"Hellfrog Medium", "Bhavacakra", "Ten Chi Jin",
"Ten", "Chi", "Jin",
"Fuma Shuriken", "Katon", "Raiton", "Hyoton", "Huton", "Doton", "Suiton",
"Spinning Edge", "Gust Slash", "Throwing Dagger", "Aeolian Edge", "Shadow Fang", "Death Blossom", "Armor Crush"];

statusList.nin = ["Slashing Resistance Down", "Vulnerability Up",
"Mudra", "Doton", "Suiton", "Kassatsu", "Duality", "Ten Chi Jin",
"Shadow Fang"];

function ninPlayerChangedEvent(e) {

  if (player.jobDetail.ninkiAmount >= 80) {
    if (player.level >= 70 && (!cooldowntime.tenchijin || cooldowntime.tenchijin - Date.now() < 1000)) {
      addIcon(id.hellfrogmedium,icon.tenchijin);
    }
    else if (toggle.aoe) {
      addIcon(id.hellfrogmedium,icon.hellfrogmedium);
    }
    else if (player.level >= 68 && (!cooldowntime.bhavacakra || cooldowntime.bhavacakra - Date.now() < 1000)) {
      addIcon(id.hellfrogmedium,icon.bhavacakra);
    }
    else if (player.jobDetail.ninkiAmount >= 94) { // Delay Hellfrog as far as possible without capping
      addIcon(id.hellfrogmedium,icon.hellfrogmedium);
    }
  }
  else {
    removeIcon(id.hellfrogmedium);
  }
}

function ninAction(logLine) {

  if (logLine[2] == player.name) { // Check if from player

    // AoE Toggle
    if (logLine[3] == "Death Blossom"
    && toggle.combat) {
      toggle.aoe = 1;
    }
    else {
      delete toggle.aoe;
    }

    // Mudra first because doing anything else breaks the "combo"

    if (actionLine.mudra[1] == "Ten") {
      toggle.mudra = toggle.mudra + "T";
      ninMudra();
    }
    else if (actionLine.mudra[1] == "Chi") {
      toggle.mudra = toggle.mudra + "C";
      ninMudra();
    }
    else if (actionLine.mudra[1] == "Jin") {
      toggle.mudra = toggle.mudra + "J";
      ninMudra();
    }
    else {

      // Rabbit Rabbit Rabbit?
      delete toggle.mudra;

      if (logLine[3] == "Hide") {
        cooldowntime.hide = Date.now() + recast.hide;
        delete cooldowntime.ninjutsu;
        ninNinjutsu();
      }

      else if (logLine[3] == "Trick Attack") {
        cooldowntime.trickattack = Date.now() + recast.trickattack;
      }

      else if (logLine[3] == "Shukuchi") {
        cooldowntime.shukuchi = Date.now() + recast.shukuchi;
      }

      else if (logLine[3] == "Kassatsu") {
        removeIcon(id.kassatsu);
        cooldowntime.kassatsu = Date.now() + recast.kassatsu;
        delete cooldowntime.ninjutsu;
        statustime.kassatsu = 10000;
        clearTimeout(timeout.ninjutsu);
        ninNinjutsu();
      }

      else if (logLine[3] == "Shadewalker") {
        cooldowntime.shadewalker = Date.now() + recast.shadewalker;
      }

      else if (logLine[3] == "Duality") {
        cooldowntime.duality = Date.now() + recast.duality;
      }

      else if (logLine[3] == "Dream Within A Dream") {
        cooldowntime.dreamwithinadream = Date.now() + recast.dreamwithinadream;
      }

      else if (logLine[3] == "Bhavacakra") {
        removeIcon(id.hellfrogmedium);
        cooldowntime.bhavacakra = Date.now() + recast.bhavacakra;
      }

      else if (logLine[3] == "Ten Chi Jin") {
        removeIcon(id.hellfrogmedium);
        cooldowntime.tenchijin = Date.now() + recast.tenchijin;
        delete cooldowntime.ninjutsu;
        toggle.tenchijin = 1;
        clearTimeout(timeout.ninjutsu);
        ninNinjutsu();
      }

      else if (["Rabbit Medium","Fuma Shuriken","Katon","Raiton","Hyoton","Huton","Doton","Suiton"].indexOf(logLine[3]) > -1) {
        clearNinjutsu();
        cooldowntime.ninjutsu = Date.now() + recast.ninjutsu;
        clearTimeout(timeout.ninjutsu);
        timeout.ninjutsu = setTimeout(ninjutsu,recast.ninjutsu);
      }

      else if (logLine[3] == "Death Blossom" && !toggle.combat) {
        // Nothing
      }

      else if (logLine[3] == "Spinning Edge" && actionLine.nin[4].length >= 2) {
        if (!toggle.combo) {
          ninCombo();
        }
        removeIcon(id.spinningedge);
      }

      else if (logLine[3] == "Gust Slash" && actionLine.nin[4].length >= 8) {
        if (player.level < 26) {
          delete toggle.combo;
          ninCombo();
        }
        else {
          removeIcon(id.gustslash);
        }
      }

      else if (logLine[3] == "Shadow Fang" && actionLine.nin[4].length >= 8) {
        statustime.slashingresistancedown = Date.now() + 21000;
        statustime.shadowfang = Date.now() + 21000;
        delete toggle.combo;
        ninCombo();
      }

      else {
        delete toggle.combo;
        ninCombo();
      }
    }
  }
}

function ninStatus(logLine) {

  if (logLine[3] == "Slashing Resistance Down") {
    if (logLine[2] == "gains") {
      statustime.slashingresistancedown = Date.now() + parseInt(logLine[5]) * 1000;
    }
    else if (logLine[2] == "loses") {
      delete statustime.slashingresistancedown;
    }
  }


  else if (logLine[1] == player.name) {

    if (logLine[3] == "Mudra") {
      if (logLine[2] == "gains") {
        statustime.mudra = Date.now() + parseInt(logLine[5]) * 1000;
      }
      else if (logLine[2] == "loses") {
        delete statustime.mudra;
        clearNinjutsu();
      }
    }
    else if (logLine[3] == "Doton") {
      if (logLine[2] == "gains") {
        statustime.doton = Date.now() + parseInt(logLine[5]) * 1000;
      }
      else if (logLine[2] == "loses") {
        delete statustime.doton;
      }
    }
    else if (logLine[3] == "Suiton") {
      if (logLine[2] == "gains") {
        statustime.suiton = Date.now() + parseInt(logLine[5]) * 1000;
      }
      else if (logLine[2] == "loses") {
        delete statustime.suiton;
      }
    }
    else if (logLine[3] == "Kassatsu") {
      if (logLine[2] == "gains") {
        statustime.kassatsu = Date.now() + parseInt(logLine[5]) * 1000;
      }
      else if (logLine[2] == "loses") {
        delete statustime.kassatsu;
      }
    }
    else if (logLine[3] == "Duality") {
      if (logLine[2] == "gains") {
        statustime.duality = Date.now() + parseInt(logLine[5]) * 1000;
      }
      else if (logLine[2] == "loses") {
        delete statustime.duality;
      }
    }
    else if (logLine[3] == "Ten Chi Jin") {
      if (logLine[2] == "gains") {
        statustime.tenchijin = Date.now() + parseInt(logLine[5]) * 1000;
      }
      else if (logLine[2] == "loses") {
        delete statustime.tenchijin;
        clearNinjutsu();
      }
    }
  }

  else if (logLine[1] != player.name && logLine[4] == player.name) {
    if (logLine[3] == "Shadow Fang") {
      if (logLine[2] == "gains") {
        statustime.shadowfang = Date.now() + parseInt(logLine[5]) * 1000;
      }
      else if (logLine[2] == "loses") {
        delete statustime.shadowfang;
      }
    }
  }
}

function ninCombo() {

  addIcon(id.spinningedge, icon.spinningedge);

  if (player.level >= 4) {
    addIcon(id.gustslash, icon.gustslash);
  }

  if (player.level >= 54 && player.jobDetail.hutonMilliseconds > 0 && player.jobDetail.hutonMilliseconds < 15000) {
    addIcon(id.armorcrush, icon.armorcrush);
  }
  else if (player.level >= 38 && statustime.slashingresistancedown - Date.now() < 13000) {
    addIcon(id.shadowfang, icon.shadowfang);
  }
  else if (player.level >= 58 && cooldowntime.duality < 2000) {
    addIcon(id.aeolianedge, icon.aeolianedge);
  }
  else if (player.level >= 38 && !statustime.shadowfang) {
    addIcon(id.shadowfang, icon.shadowfang);
  }
  else if (player.level >= 54 && player.jobDetail.hutonMilliseconds > 0 && player.jobDetail.hutonMilliseconds < 40000) {
    addIcon(id.armorcrush, icon.armorcrush);
  }
  else if (player.level >= 26) {
    addIcon(id.aeolianedge, icon.aeolianedge);
  }
}

function ninNinjutsu() {

  // 1: Fuma
  // 2: Katon (CT JT)
  // 3: Raiton (TC JC)
  // 4: Hyoton
  // 5: Huton (JCT CJT)
  // 6: Doton
  // 7: Suiton (TCJ CTJ)

  if (player.level >= 45 && !cooldowntime.trickattack) {
    toggle.ninjutsu = 7;
    addIcon(id.mudra1,icon.ten);
    addIcon(id.mudra2,icon.chi);
    addIcon(id.mudra3,icon.jin);
    addIcon(id.ninjutsu,icon.suiton);
  }
  else if (player.level >= 45 && cooldowntime.trickattack - Date.now() < 20000) {
    toggle.ninjutsu = 7;
    addIconWithTimeout("mudra1",cooldowntime.trickattack - Date.now() - 10000,id.mudra1,icon.ten);
    addIconWithTimeout("mudra2",cooldowntime.trickattack - Date.now() - 10000,id.mudra2,icon.chi);
    addIconWithTimeout("mudra3",cooldowntime.trickattack - Date.now() - 10000,id.mudra3,icon.jin);
    addIconWithTimeout("ninjutsu",cooldowntime.trickattack - Date.now() - 10000,id.ninjutsu,icon.suiton);
  }
  else if (player.level >= 54 && player.jobDetail.hutonMilliseconds == 0 && !toggle.kassatsu && !toggle.tenchijin) {
    toggle.ninjutsu = 5;
    addIcon(id.mudra1,icon.jin);
    addIcon(id.mudra2,icon.chi);
    addIcon(id.mudra3,icon.ten);
    addIcon(id.ninjutsu,icon.huton);
  }
  else if (player.level >= 45 && player.jobDetail.hutonMilliseconds < 20000 && !toggle.kassatsu && !toggle.tenchijin) {
    toggle.ninjutsu = 5;
    addIcon(id.mudra1,icon.jin);
    addIcon(id.mudra2,icon.chi);
    addIcon(id.mudra3,icon.ten);
    addIcon(id.ninjutsu,icon.huton);
  }
  else if (player.level >= 35 && toggle.aoe == 1 && !toggle.tenchijin) {
    toggle.ninjutsu = 2;
    addIcon(id.mudra1,icon.chi);
    addIcon(id.mudra2,icon.ten);
    removeIcon(id.mudra3);
    addIcon(id.ninjutsu,icon.katon);
  }
  else if (player.level >= 64 && cooldowntime.shukuchi - Date.now() > 0 && !toggle.tenchijin) {
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
    toggle.ninjutsu = 1;
    addIcon(id.mudra1,icon.ten);
    removeIcon(id.mudra2);
    removeIcon(id.mudra3);
    addIcon(id.ninjutsu,icon.fumashuriken);
  }
}

function ninMudra() {

  if (toggle.mudra.length == 1) {
    removeIcon(id.mudra1);
  }
  else if (toggle.mudra.length == 2) {
    removeIcon(id.mudra2)
  }
  else if (toggle.mudra.length == 3) {
    removeIcon(id.mudra3)
  }

  if (toggle.ninjutsu == 1) {
    if (toggle.mudra == "T") {
      //
    }
    else if (toggle.mudra == "C") {
      //
    }
    else if (toggle.mudra == "J") {
      //
    }
    else if (toggle.mudra == "CT" || toggle.mudra == "JT") {
      addIcon(id.ninjutsu,icon.katon);
    }
    else if (toggle.mudra == "TC" || toggle.mudra == "JC") {
      addIcon(id.ninjutsu,icon.raiton);
    }
    else if (toggle.mudra == "TJ" || toggle.mudra == "CJ") {
      addIcon(id.ninjutsu,icon.hyoton);
    }
    else if (toggle.mudra == "CJT" || toggle.mudra == "JCT") {
      addIcon(id.ninjutsu,icon.huton);
    }
    else if (toggle.mudra == "TJC" || toggle.mudra == "JTC") {
      addIcon(id.ninjutsu,icon.doton);
    }
    else if (toggle.mudra == "TCJ" || toggle.mudra == "CTJ") {
      addIcon(id.ninjutsu,icon.suiton);
    }
    else {
      addIcon(id.ninjutsu,icon.rabbitmedium);
    }
  }

  else if (toggle.ninjutsu == 2) {
    if (toggle.mudra == "T") {
      addIcon(id.ninjutsu,icon.fumashuriken);
    }
    else if (toggle.mudra == "C") {
      //
    }
    else if (toggle.mudra == "J") {
      //
    }
    else if (toggle.mudra == "CT" || toggle.mudra == "JT") {
      //
    }
    else if (toggle.mudra == "TC" || toggle.mudra == "JC") {
      addIcon(id.ninjutsu,icon.raiton);
    }
    else if (toggle.mudra == "TJ" || toggle.mudra == "CJ") {
      addIcon(id.ninjutsu,icon.hyoton);
    }
    else if (toggle.mudra == "CJT" || toggle.mudra == "JCT") {
      addIcon(id.ninjutsu,icon.huton);
    }
    else if (toggle.mudra == "TJC" || toggle.mudra == "JTC") {
      addIcon(id.ninjutsu,icon.doton);
    }
    else if (toggle.mudra == "TCJ" || toggle.mudra == "CTJ") {
      addIcon(id.ninjutsu,icon.suiton);
    }
    else {
      addIcon(id.ninjutsu,icon.rabbitmedium);
    }
  }

  else if (toggle.ninjutsu == 3) {
    if (toggle.mudra == "T") {
      //
    }
    else if (toggle.mudra == "C") {
      addIcon(id.ninjutsu,icon.fumashuriken);
    }
    else if (toggle.mudra == "J") {
      //
    }
    else if (toggle.mudra == "CT" || toggle.mudra == "JT") {
      addIcon(id.ninjutsu,icon.katon);
    }
    else if (toggle.mudra == "TC" || toggle.mudra == "JC") {

    }
    else if (toggle.mudra == "TJ" || toggle.mudra == "CJ") {
      addIcon(id.ninjutsu,icon.hyoton);
    }
    else if (toggle.mudra == "CJT" || toggle.mudra == "JCT") {
      addIcon(id.ninjutsu,icon.huton);
    }
    else if (toggle.mudra == "TJC" || toggle.mudra == "JTC") {
      addIcon(id.ninjutsu,icon.doton);
    }
    else if (toggle.mudra == "TCJ" || toggle.mudra == "CTJ") {
      addIcon(id.ninjutsu,icon.suiton);
    }
    else {
      addIcon(id.ninjutsu,icon.rabbitmedium);
    }
  }

  else if (toggle.ninjutsu == 5) {
    if (toggle.mudra == "T") {
      addIcon(id.ninjutsu,icon.fumashuriken);
    }
    else if (toggle.mudra == "C") {
      //
    }
    else if (toggle.mudra == "J") {
      //
    }
    else if (toggle.mudra == "CT" || toggle.mudra == "JT") {
      addIcon(id.ninjutsu,icon.katon);
    }
    else if (toggle.mudra == "TC") {
      addIcon(id.ninjutsu,icon.raiton);
    }
    else if (toggle.mudra == "JC") {
      //
    }
    else if (toggle.mudra == "TJ") {
      addIcon(id.ninjutsu,icon.hyoton);
    }
    else if (toggle.mudra == "CJ") {
      //
    }
    else if (toggle.mudra == "CJT" || toggle.mudra == "JCT") {
      //
    }
    else if (toggle.mudra == "TJC" || toggle.mudra == "JTC") {
      addIcon(id.ninjutsu,icon.doton);
    }
    else if (toggle.mudra == "TCJ" || toggle.mudra == "CTJ") {
      addIcon(id.ninjutsu,icon.suiton);
    }
    else {
      addIcon(id.ninjutsu,icon.rabbitmedium);
    }
  }

  else if (toggle.ninjutsu == 6) {
    if (toggle.mudra == "T") {
      //
    }
    else if (toggle.mudra == "J") {
      //
    }
    else if (toggle.mudra == "C") {
      addIcon(id.ninjutsu,icon.fumashuriken);
    }
    else if (toggle.mudra == "CT") {
      addIcon(id.ninjutsu,icon.katon);
    }
    else if (toggle.mudra == "JT") {
      //
    }
    else if (toggle.mudra == "TC" || toggle.mudra == "JC") {
      addIcon(id.ninjutsu,icon.raiton);
    }
    else if (toggle.mudra == "TJ") {
      addIcon(id.ninjutsu,icon.hyoton);
    }
    else if (toggle.mudra == "CJ") {
      //
    }
    else if (toggle.mudra == "CJT" || toggle.mudra == "JCT") {
      addIcon(id.ninjutsu,icon.huton);
    }
    else if (toggle.mudra == "TJC" || toggle.mudra == "JTC") {
      //
    }
    else if (toggle.mudra == "TCJ" || toggle.mudra == "CTJ") {
      addIcon(id.ninjutsu,icon.suiton);
    }
    else {
      addIcon(id.ninjutsu,icon.rabbitmedium);
    }
  }

  if (toggle.ninjutsu == 7) {
    if (toggle.mudra == "T") {
      //
    }
    else if (toggle.mudra == "C") {
      //
    }
    else if (toggle.mudra == "J") {
      clearNinjutsu();
      addIcon(id.ninjutsu,icon.fumashuriken);
    }
    else if (toggle.mudra == "TC" || toggle.mudra == "CT") {
      //
    }
    else if (toggle.mudra == "JT") {
      clearNinjutsu();
      addIcon(id.ninjutsu,icon.katon);
    }
    else if (toggle.mudra == "JC") {
      clearNinjutsu();
      addIcon(id.ninjutsu,icon.raiton);
    }
    else if (toggle.mudra == "TCJ" || toggle.mudra == "CTJ") {
      //
    }
    else if (toggle.mudra == "TJ" || toggle.mudra == "CJ") {
      clearNinjutsu();
      addIcon(id.ninjutsu,icon.hyoton);
    }
    else if (toggle.mudra == "CJT" || toggle.mudra == "JCT") {
      clearNinjutsu();
      addIcon(id.ninjutsu,icon.huton);
    }
    else if (toggle.mudra == "TJC" || toggle.mudra == "JTC") {
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
  delete toggle.mudra;
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
