// Recast properties - list by alphabetical job then alphabetical action
function addRecast(name, time, id) {

  if (time === undefined) {
    time = recast[name];
  }
  if (id === undefined) {
    id = player.ID;
  }

  if (!cooldownTracker[name]) { // Create array if it doesn't exist yet
    cooldownTracker[name] = [id, time + Date.now()];
  }
  else if (cooldownTracker[name].indexOf(id) > -1) { // Update array if source match found
    cooldownTracker[name][cooldownTracker[name].indexOf(id) + 1] = time + Date.now();
  }
  else { // Push new entry into array if no matching entry
    cooldownTracker[name].push(id, time + Date.now());
  }
}

function checkRecast(name, id) {
  if (id === undefined) {
    id = player.ID;
  }
  if (cooldownTracker[name].indexOf(id) > -1) {
    return Math.max(cooldownTracker[name][cooldownTracker[name].indexOf(id) + 1] - Date.now(), -1);
  }
  return -1;
}

const recast = {};

// Role actions
recast.luciddreaming = 60000;
recast.peloton = 5000;
recast.rampart = 90000;
recast.swiftcast = 60000;

// BLM
recast.enochian = 30000;
recast.manafont = 180000;
recast.sharpcast = 60000;
recast.transpose = 5000;
recast.triplecast = 60000;

// BRD
recast.ballad = 80000;
recast.ragingstrikes = 80000;
recast.barrage = 80000;
recast.paeon = 80000;
recast.battlevoice = 180000;
recast.minuet = 80000;
recast.empyrealarrow = 15000;
recast.sidewinder = 60000;

// DNC
recast.technicalstep = 120000;
recast.standardstep = 30000;
recast.flourish = 60000;
recast.devilment = 120000;

// DRK
recast.abyssaldrain = 60000;
recast.bloodweapon = 60000;
recast.carveandspit = 60000;
recast.delirium = 90000;
recast.floodofdarkness = 2000;
recast.plunge = 30000;
recast.saltedearth = 90000;
recast.shadowwall = 120000;
recast.theblackestnight = 15000;

// DRG
recast.battlelitany = 180000;
recast.dragonsight = 120000;

// GNB
recast.gnashingfang = 30000;
recast.nomercy = 60000;
recast.roughdivide = 30000;
recast.sonicbreak = 60000;

// MCH
recast.barrelstabilizer = 120000;
recast.drill = 20000
// recast.bioblaster = recast.drill; // Use above due to shared cooldown
recast.flamethrower = 60000;
recast.gaussround = 30000;
recast.hypercharge = 10000;
recast.hotshot = 40000;
recast.airanchor = recast.hotshot;
recast.reassemble = 60000;
recast.ricochet = 30000;
recast.rookautoturret = 6000;
recast.automatonqueen = recast.rookautoturret;
recast.tactician = 180000;
recast.wildfire = 120000;

// MNK
recast.anatman = 60000;
recast.brotherhood = 90000;
recast.elixirfield = 30000;
recast.perfectbalance = 120000;
recast.riddleoffire = 90000;
recast.riddleofearth = 60000;

// NIN
recast.hide = 20000;
recast.mug = 110000;
recast.ninjutsu = 20000;
recast.trickattack = 60000;
recast.ninjutsu = 20000;
recast.kassatsu = 60000;
recast.dreamwithinadream = 60000;
recast.tenchijin = 100000;
recast.meisui = 60000;
recast.bunshin = 110000;

// RDM
recast.acceleration = 35000;
recast.contresixte = 45000;
recast.corpsacorps = 40000;
recast.displacement = 35000;
recast.embolden = 120000;
recast.fleche = 25000;
recast.manafication = 120000;

// SAM
recast.guren = 120000;
recast.ikishoten = 60000;
recast.meikyoshisui = 60000;
recast.senei = recast.guren;
recast.tsubamegaeshi = 60000;

// SCH
recast.aetherflow = 60000;
recast.chainstratagem = 120000;
recast.deploymenttactics = 120000;
recast.dissipation = 180000;
recast.excogitation = 45000;
recast.feyblessing = 60000;
recast.feyillumination = 120000;
recast.indomitability = 30000;
recast.recitation = 90000;
recast.sacredsoil = 30000;
recast.summonseraph = 120000;
recast.whisperingdawn = 60000;

// SMN
recast.devotion = 180000;

// WAR
recast.berserk = 90000;
recast.infuriate = 60000;
recast.rampart = 90000;
recast.rawintuition = 25000;
recast.upheaval = 30000;
recast.vengeance = 120000;
recast.innerrelease = recast.berserk;

// WHM
recast.assize = 45000;
recast.asylum = 90000;
recast.benediction = 180000;
recast.divinebenison = 30000;
recast.plenaryindulgence = 120000;
recast.presenceofmind = 150000;
recast.tetragrammaton = 60000;
recast.thinair = 120000;

// Raid
recast.raidbattlelitany = recast.battlelitany;
recast.raidbattlevoice = recast.battlevoice;
recast.raidbrotherhood = recast.brotherhood;
recast.raidchainstratagem = recast.chainstratagem;
recast.raiddevilment = recast.devilment;
recast.raiddevotion = recast.devotion;
recast.raidembolden = recast.embolden;
recast.raidtechnicalstep = recast.technicalstep;
recast.raidtrickattack = recast.trickattack;
