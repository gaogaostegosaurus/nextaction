
const icon = {};

const getArrayRow = ({
  iconArray,
} = {}) => {
  // Associate array with row
  let rowID = 'icon-b';
  if (iconArray === iconArrayA) {
    rowID = 'icon-a';
  } else if (iconArray === iconArrayC) {
    rowID = 'icon-c';
  }
  return rowID;
};

delete previous.removeAction;

const removeOldIcons = ({
  rowID,
} = {}) => {
  // Removes already hidden divs
  // Called at beginning of other action functions

  const removeDelay = 1000; // Delay prevents function from messing things up visually... maybe
  const rowDiv = document.getElementById(rowID);

  if (!previous.removeAction || Date.now() - previous.removeAction > removeDelay) {
    previous.removeAction = Date.now();
    rowDiv.querySelectorAll('div[class~="icon-hide"]').forEach((e) => e.remove());
  }
};


const syncIcons = ({
  iconArray = iconArrayB,
} = {}) => {
  // Use this to reset entire row if array is reset somehow
  // i. e. on RNG procs that change rotation, missed/fatfingered combos, etc.

  const rowID = getArrayRow({ iconArray });
  const rowDiv = document.getElementById(rowID);

  removeOldIcons({ rowID });

  // Find current row length
  const rowLength = rowDiv.children.length;
  const iconArrayLength = iconArray.length;

  let arrayIndex = 0;

  for (let i = 0; i < rowLength; i += 1) {
    const iconDiv = rowDiv.children[i];
    if (iconArray[arrayIndex] && iconArray[arrayIndex].name === iconDiv.dataset.name
    && !iconDiv.className.includes('icon-hide')) {
      arrayIndex += 1;
    } else {
      iconDiv.className += ' icon-hide';
      iconDiv.dataset.name = 'none';
    }
  } // Should have only matching icons remaining now


  if (arrayIndex < iconArrayLength) {
    for (let i = arrayIndex; i < iconArrayLength; i += 1) {
      const iconDiv = document.createElement('div');
      const iconImg = document.createElement('img');
      const iconOverlay = document.createElement('img');
      rowDiv.append(iconDiv);
      iconDiv.append(iconImg);
      iconDiv.append(iconOverlay);
      iconDiv.className = 'icon icon-hide';
      iconImg.className = 'iconimg';
      iconOverlay.className = 'iconoverlay';
      iconDiv.dataset.name = iconArray[i].name;
      iconImg.src = `img/icon/${icon[iconArray[i].img]}.png`;
      iconOverlay.src = 'img/icon/overlay.png';
      void iconDiv.offsetWidth;
      iconDiv.className = 'icon icon-show';
      if (iconArray[i].size === 'small') {
        iconDiv.className += ' icon-small';
      }
    }
  }
};


const addIcon = ({
  name,
  img = name.replace(/[\s'-]/g, '').toLowerCase(),
  iconArray = iconArrayB,
  size = 'normal',
  order = 10,
} = {}) => {
  // Adds action to specified array and row

  const rowID = getArrayRow({ iconArray });
  const rowDiv = document.getElementById(rowID);
  // console.log(name + rowID);

  removeOldIcons({ rowID });

  // Create elements
  const iconDiv = document.createElement('div');
  const iconImg = document.createElement('img');
  const iconOverlay = document.createElement('img');

  // Add elements to page
  iconDiv.className = 'icon icon-hide';
  iconDiv.style.order = order;
  iconImg.className = 'iconimg';
  iconOverlay.className = 'iconoverlay';
  iconDiv.dataset.name = name;
  iconImg.src = `img/icon/${icon[img]}.png`;
  iconOverlay.src = 'img/icon/overlay.png';
  rowDiv.append(iconDiv);
  iconDiv.append(iconImg);
  iconDiv.append(iconOverlay);
  void iconDiv.offsetWidth; // Reflow to make transition work
  iconDiv.className = 'icon icon-show';
  if (size === 'small') {
    iconDiv.className += ' icon-small';
  }

  // Add to array
  iconArray.push({
    name, img, size, order,
  });
  iconArray.sort((a, b) => a.order - b.order);
};


const fadeIcon = ({
  name,
  // size = 'normal',
  iconArray = iconArrayB,
  match = 'exact',
} = {}) => {
  // Sets an action to lower opacity, for casting or whatever

  const rowID = getArrayRow({ iconArray });
  const rowDiv = document.getElementById(rowID);

  removeOldIcons({ rowID });

  let matchDiv;
  if (match === 'contains') {
    matchDiv = rowDiv.querySelector(`div[data-name~="${name}"]:not([class~="icon-hide"])`);
  } else {
    matchDiv = rowDiv.querySelector(`div[data-name="${name}"]:not([class~="icon-hide"])`);
  }

  if (matchDiv) {
    void matchDiv.offsetWidth;
    matchDiv.className += ' icon-fade';
  }
};


const unfadeIcon = ({
  name,
  iconArray = iconArrayB,
  match = 'exact',
} = {}) => {
  // Undos fadeAction effect

  const rowID = getArrayRow({ iconArray });
  const rowDiv = document.getElementById(rowID);

  removeOldIcons({ rowID });

  let matchDiv;
  if (match === 'contains') {
    matchDiv = rowDiv.querySelector(`div[data-name~="${name}"]:not([class~="icon-hide"])`);
  } else {
    matchDiv = rowDiv.querySelector(`div[data-name="${name}"]:not([class~="icon-hide"])`);
  }

  if (matchDiv) {
    void matchDiv.offsetWidth;
    matchDiv.className = matchDiv.className.replace(' icon-fade', '');
  }
};


const removeIcon = ({
  name,
  iconArray = iconArrayB,
  match = 'exact',
} = {}) => {
  // Removes specific icon from display

  const rowID = getArrayRow({ iconArray });
  const rowDiv = document.getElementById(rowID);
  removeOldIcons({ rowID });

  let matchDiv;
  if (match === 'contains') {
    matchDiv = rowDiv.querySelector(`div[data-name~="${name}"]:not([class~="icon-hide"])`);
  } else {
    matchDiv = rowDiv.querySelector(`div[data-name="${name}"]:not([class~="icon-hide"])`);
  }

  if (matchDiv) {
    matchDiv.className += ' icon-hide';
    matchDiv.dataset.name = 'none';
  }

  const matchIndex = iconArray.findIndex((entry) => entry.name === name);
  if (matchIndex > -1) {
    iconArray.splice(matchIndex, 1);
  }
};

// const removeIconContaining = ({
//   name,
//   array = iconArrayB,
// } = {}) => {
//   const row = getArrayRow({ array });
//   const rowDiv = document.getElementById(row);
//
//   removeOldIcons({ row });
//
//   const matchDiv = rowDiv.querySelector(`div[data-name~="${name}"]`);
//   if (matchDiv) {
//     matchDiv.className += ' icon-hide';
//     const matchIndex = array.findIndex((entry) => entry.name === matchDiv.dataset.name);
//     if (matchIndex > -1) {
//       array.splice(matchIndex, 1);
//     }
//     matchDiv.dataset.name = 'none';
//   }
// };

// const removeToIcon = ({
//   name,
//   iconArray = iconArrayB,
// } = {}) => {
//   // Meh
//   // Removes all actions up to the first case of selected action from display
//   const rowID = getArrayRow({ iconArray });
//   const rowDiv = document.getElementById(rowID);
//   removeOldIcons({ rowID });
// };


icon.default = '000000';

// Role Actions
icon.rampart = '000801';
icon.lowblow = '000802';
icon.provoke = '000803';
icon.reprisal = '000806';
icon.interject = '000808';
icon.shirk = '000810';
icon.secondwind = '000821';
icon.armslength = '000822';
icon.bloodbath = '000823';
icon.luciddreaming = '000865';
icon.swiftcast = '000866';

// BLM
icon.fire = '000451';
icon.fire2 = '000452';
icon.fire3 = '000453';
icon.firestarter = icon.fire3;
icon.blizzard = '000454';
icon.blizzard2 = '000455';
icon.blizzard3 = '000456';
icon.thunder = '000457';
icon.thundercloud = icon.thunder;
icon.thunder3 = '000459';
icon.transpose = '000466';
icon.thunder2 = '000468';
icon.manafont = '002651';
icon.flare = '002652';
icon.coldflare = icon.flare;
icon.freeze = '002653';
icon.freezeUmbral3 = icon.freeze;
icon.leylines = '002656';
icon.sharpcast = '002657';
icon.enochian = '002658';
icon.blizzard4 = '002659';
icon.fire4 = '002660';
icon.thunder4 = '002662';
icon.triplecast = '002663';
icon.foul = '002664';
icon.despair = '002665';
icon.xenoglossy = '002667';

// BRD
icon.ragingstrikes = '000352';
icon.barrage = '000353';
icon.heavyshot = '000358';
icon.straightshot = '000359';
icon.venomousbite = '000363';
icon.windbite = '000367';
icon.battlevoice = '002601';
icon.ballad = '002602';
icon.paeon = '002603';
icon.requiem = '002604';
icon.empyrealarrow = '002606';
icon.minuet = '002607';
icon.ironjaws = '002608';
icon.sidewinder = '002610';
icon.pitchperfect = '002611';
icon.causticbite = '002613';
icon.stormbite = '002614';
icon.refulgentarrow = '002616';

// DNC
icon.cascade = '003451';
icon.fountain = '003452';
icon.windmill = '003453';
icon.standardstep = '003454';
icon.emboite = '003455';
icon.entrechat = '003456';
icon.jete = '003457';
icon.pirouette = '003458';
icon.standardfinish = '003459';
icon.reversecascade = '003460';
icon.flourishingcascade = icon.reversecascade;
icon.bladeshower = '003461';
icon.fandance = '003462';
icon.risingwindmill = '003463';
icon.flourishingwindmill = icon.risingwindmill;
icon.fountainfall = '003464';
icon.flourishingfountain = icon.fountainfall;
// icon.fountainfallsingletarget = icon.fountainfall;
icon.bloodshower = '003465';
icon.flourishingshower = icon.bloodshower;
// icon.bloodshowersingletarget = icon.bloodshower;
icon.fandance2 = '003466';
icon.devilment = '003471';
icon.fandance3 = '003472';
icon.flourishingfandance = icon.fandance3;
icon.technicalstep = '003473';
icon.technicalfinish = '003474';
icon.flourish = '003475';
icon.saberdance = '003476';

// DRG
icon.lifesurge = '000304';
icon.doomspike = '000306';
icon.chaosthrust = '000308';
icon.lancecharge = '000309';
icon.truethrust = '000310';
icon.vorpalthrust = '000311';
icon.fullthrust = '000314';
icon.piercingtalon = '000315';
icon.disembowel = '000317';
icon.jump = '002576';
icon.elusivejump = '002577';
icon.dragonfiredive = '002578';
icon.spineshatterdive = '002580';
icon.bloodofthedragon = '002581';
icon.fangandclaw = '002582';
icon.geirskogul = '002583';
icon.wheelingthrust = '002584';
icon.battlelitany = '002585';
icon.sonicthrust = '002586';
icon.dragonsight = '002587';
icon.miragedive = '002588';
icon.nastrond = '002589';
icon.coerthantorment = '002590';
icon.highjump = '002591';
icon.raidenthrust = '002592';
icon.stardiver = '002593';

// DRK
icon.hardslash = '003051';
icon.syphonstrike = '003054';
icon.souleater = '003055';
icon.carveandspit = '003058';
icon.plunge = '003061';
icon.unleash = '003063';
icon.abyssaldrain = '003064';
icon.saltedearth = '003066';
icon.bloodweapon = '003071';
icon.shadowwall = '003075';
icon.delirium = '003078';
icon.quietus = '003079';
icon.bloodspiller = '003080';
icon.theblackestnight = '003081';
icon.floodofdarkness = '003082';
icon.edgeofdarkness = '003083';
icon.stalwartsoul = '003084';
icon.floodofshadow = '003085';
icon.edgeofshadow = '003086';
icon.livingshadow = '003088';

// GNB
icon.keenedge = '003401';
icon.nomercy = '003402';
icon.brutalshell = '003403';
icon.camouflage = '003404';
icon.demonslice = '003405';
icon.royalguard = '003406';
icon.lightningshot = '003407';
icon.dangerzone = '003408';
icon.solidbarrel = '003409';
icon.gnashingfang = '003410';
icon.savageclaw = '003411';
icon.nebula = '003412';
icon.demonslaughter = '003413';
icon.wickedtalon = '003414';
icon.aurora = '003415';
icon.superbolide = '003416';
icon.sonicbreak = '003417';
icon.roughdivide = '003418';
icon.continuation = '003419';
icon.jugularrip = '003420';
icon.abdomentear = '003421';
icon.eyegouge = '003422';
icon.bowshock = '003423';
icon.heartoflight = '003424';
icon.heartofstone = '003425';
icon.burststrike = '003426';
icon.fatedcircle = '003427';
icon.bloodfest = '003428';
icon.blastingzone = '003429';

// MCH
icon.splitshot = '003001';
icon.slugshot = '003002';
icon.hotshot = '003003';
icon.cleanshot = '003004';
icon.gaussround = '003005';
icon.spreadshot = '003014';
icon.ricochet = '003017';
icon.wildfire = '003018';
icon.reassemble = '003022';
icon.rookautoturret = '003026';
icon.heatblast = '003030';
icon.heatedsplitshot = '003031';
icon.heatedslugshot = '003032';
icon.heatedcleanshot = '003033';
icon.barrelstabilizer = '003034';
icon.flamethrower = '003038';
icon.tactician = '003040';
icon.hypercharge = '003041';
icon.autocrossbow = '003042';
icon.drill = '003043';
icon.bioblaster = '003044';
icon.airanchor = '003045';
icon.automatonqueen = '003501';

// MNK
icon.demolish = '000204';
icon.fistsoffire = '000205';
icon.bootshine = '000208';
icon.truestrike = '000209';
icon.snappunch = '000210';
icon.twinsnakes = '000213';
icon.armofthedestroyer = '000215';
icon.perfectbalance = '000217';
icon.dragonkick = '002528';
icon.rockbreaker = '002529';
icon.elixirfield = '002533';
icon.theforbiddenchakra = '002535';
icon.riddleofearth = '002537';
icon.riddleoffire = '002541';
icon.brotherhood = '002542';
icon.fourpointfury = '002544';
icon.enlightenment = '002545';
icon.anatman = '002546';
icon.sixsidedstar = '002547';

// NIN
icon.spinningedge = '000601';
icon.gustslash = '000602';
icon.aeolianedge = '000605';
icon.shadowfang = '000606';
icon.hide = '000609';
icon.assassinate = '000612';
icon.mug = '000613';
icon.deathblossom = '000615';
icon.trickattack = '000618';
icon.ten = '002901';
icon.chi = '002902';
icon.jin = '002903';
icon.ninjutsu = '002904';
icon.kassatsu = '002906';
icon.fumashuriken = '002907';
icon.katon = '002908';
icon.hyoton = '002909';
icon.huton = '002910';
icon.doton = '002911';
icon.raiton = '002912';
icon.suiton = '002913';
icon.rabbitmedium = '002913';
icon.armorcrush = '002915';
icon.dreamwithinadream = '002918';
icon.hellfrogmedium = '002920';
icon.bhavacakra = '002921';
icon.tenchijin = '002922';
icon.hakkemujinsatsu = '002923';
icon.meisui = '002924';
icon.gokamekkyaku = '002925';
icon.hyoshoranyu = '002926';
icon.bunshin = '002927';

// PLD
icon.sentinel = '000151';
icon.shieldbash = '000154';
icon.rageofhalone = '000155';
icon.riotblade = '000156';
icon.fastblade = '000158';
icon.circleofscorn = '000161';
icon.shieldlob = '000164';
icon.fightorflight = '000166';
icon.cover = '002501';
icon.hallowedground = '002502';
icon.spiritswithin = '002503';
icon.ironwill = '002505';
icon.goringblade = '002506';
icon.royalauthority = '002507';
icon.divineveil = '002508';
icon.clemency = '002509';
icon.sheltron = '002510';
icon.totaleclipse = '002511';
icon.intervention = '002512';
icon.requiescat = '002513';
icon.holyspirit = '002514';
icon.holyspirit1 = icon.holyspirit;
icon.holyspirit2 = icon.holyspirit;
icon.holyspirit3 = icon.holyspirit;
icon.holyspirit4 = icon.holyspirit;
icon.holyspirit5 = icon.holyspirit;
icon.passageofarms = '002515';
icon.prominence = '002516';
icon.holycircle = '002517';
icon.holycircle1 = icon.holycircle;
icon.holycircle2 = icon.holycircle;
icon.holycircle3 = icon.holycircle;
icon.holycircle4 = icon.holycircle;
icon.holycircle5 = icon.holycircle;
icon.confiteor = '002518';
icon.atonement = '002519';
icon.atonement1 = icon.atonement;
icon.atonement2 = icon.atonement;
icon.atonement3 = icon.atonement;
icon.intervene = '002520';
icon.intervene1 = icon.intervene;
icon.intervene2 = icon.intervene;


// RDM
icon.jolt = '003202';
icon.verthunder = '003203';
icon.corpsacorps = '003204';
icon.veraero = '003205';
icon.scatter = '003207';
icon.verfire = '003208';
icon.verstone = '003209';
icon.displacement = '003211';
icon.fleche = '003212';
icon.acceleration = '003214';
icon.contresixte = '003217';
icon.embolden = '003218';
icon.manafication = '003219';
icon.joltii = '003220';
icon.impact = '003222';
icon.verflare = '003223';
icon.verholy = '003224';
icon.enchantedriposte = '003225';
icon.enchantedzwerchhau = '003226';
icon.enchantedredoublement = '003227';
icon.enchantedmoulinet = '003228';
icon.verthunderii = '003229';
icon.veraeroii = '003230';
icon.enchantedreprise = '003232';
icon.scorch = '003234';

// SAM
icon.hakaze = '003151';
icon.jinpu = '003152';
icon.shifu = '003156';
icon.fuga = '003157';
icon.gekko = '003158';
icon.iaijutsu = '003159';
icon.higanbana = '003160';
icon.tenkagoken = '003161';
icon.midaresetsugekka = '003162';
icon.mangetsu = '003163';
icon.kasha = '003164';
icon.oka = '003165';
icon.yukikaze = '003166';
icon.meikyoshisui = '003167';
icon.kaiten = '003168';
icon.shinten = '003173';
icon.kyuten = '003174';
icon.seigan = '003175';
icon.guren = '003177';
icon.senei = '003178';
icon.ikishoten = '003179';
icon.tsubamegaeshi = '003180';
icon.kaeshihiganbana = '003181';
icon.kaeshigoken = '003182';
icon.kaeshisetsugekka = '003183';
icon.shoha = '003184';

// ACN
icon.bio = '000503';
icon.bio2 = '000504';
icon.aetherflow = '000510';

// SCH
icon.energydrain = '000514';
icon.aetherflowstack = icon.energydrain;
icon.sacredsoil = '002804';
icon.indomitability = '002806';
icon.deploymenttactics = '002808';
icon.emergencytactics = '002809';
icon.dissipation = '002810';
icon.excogitation = '002813';
icon.chainstratagem = '002815';
icon.biolysis = '002820';
icon.recitation = '002822';
icon.summonseraph = '002850';
icon.whisperingdawn = '002852';
icon.feyillumination = '002853';
icon.feyblessing = '002854';

// SMN
icon.devotion = '002688';

// WAR
icon.overpower = '000254';
icon.maim = '000255';
icon.stormspath = '000258';
icon.berserk = '000259';
icon.heavyswing = '000260';
icon.tomahawk = '000261';
icon.thrillofbattle = '000263';
icon.stormseye = '000264';
icon.holmgang = '000266';
icon.vengeance = '000267';
icon.defiance = '002551';
icon.steelcyclone = '002552';
icon.innerbeast = '002553';
icon.infuriate = '002555';
icon.fellcleave = '002557';
icon.decimate = '002558';
icon.rawintuition = '002559';
icon.equilibrium = '002560';
icon.onslaught = '002561';
icon.upheaval = '002562';
icon.shakeitoff = '002563';
icon.innerrelease = '002564';
icon.mythriltempest = '002565';
icon.chaoticcyclone = '002566';
icon.nascentflash = '002567';
icon.innerchaos = '002568';

// WHM
icon.aero = '000401';
icon.aero2 = '000402';
icon.freecure = '000406';
icon.medica2 = '000409';
icon.presenceofmind = '002626';
icon.benediction = '002627';
icon.regen = '002628';
icon.asylum = '002632';
icon.tetragrammaton = '002633';
icon.assize = '002634';
icon.thinair = '002636';
icon.divinebenison = '002638';
icon.plenaryindulgence = '002639';
icon.dia = '002641';
icon.afflatusmisery = '002644';
icon.temperance = '002645';

// Raid
icon.raidbattlelitany = icon.battlelitany;
icon.raidbattlevoice = icon.battlevoice;
icon.raidbrotherhood = icon.brotherhood;
icon.raidchainstratagem = icon.chainstratagem;
icon.raiddevilment = icon.devilment;
icon.raiddevotion = icon.devotion;
icon.raidembolden = icon.embolden;
icon.raidtechnicalstep = icon.technicalstep;
icon.raidtrickattack = icon.trickattack;


// Other
icon.gold0 = '066181';
icon.gold1 = '066182';
icon.gold2 = '066183';
icon.gold3 = '066184';
