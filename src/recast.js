
// Adds a recast time to tracker array
const addRecast = ({
  name,
  time = recast[name],
  id = player.ID,
} = {}) => {
  // Create if array doesn't exist yet
  if (!recastTracker[name]) {
    recastTracker[name] = [];
  }

  // Look for matching index
  const match = recastTracker[name].findIndex((entry) => entry.id === id);

  if (match > -1) {
    // Update array if match found
    recastTracker[name][match] = { id, time: time + Date.now() };
  } else {
    // Push new entry into array if no matching entry
    recastTracker[name].push({ id, time: time + Date.now() });
  }
};

const checkRecast = ({
  name,
  id = player.ID,
} = {}) => {
  // Check if array exists
  if (!recastTracker[name]) {
    return -1;
  }

  // Find matching index
  const match = recastTracker[name].findIndex((entry) => entry.id === id);

  if (match > -1) {
    // Returns matching recast time
    return Math.max(recastTracker[name][match].time - Date.now(), -1);
  }

  // Return a recast time of -1 if no match
  return -1;
};

const recast = {};

// Recast properties - list by alphabetical job then alphabetical action

recast.gcd = 2500;

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
recast.drill = 20000;
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
