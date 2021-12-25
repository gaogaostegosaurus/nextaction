/* global actionData */

// eslint-disable-next-line no-unused-vars
const baseActionData = [
  // Use base values and modify during job load

  // Properties used
  // name
  // affinity: Job or Role
  // level: Acquired at this level
  // type: Spell or Weaponskill, useful for filtering GCD calculations
  // (no need to define Ability... yet?)
  // cast: For spells (not added if instant)
  // recast: Anything not effectively GCD cooldown
  // mpCost
  // Any other resource costs also listed for calculations

  // Consider aoe: true/false?

  // NIN

  {
    name: 'Spinning Edge',
    affinity: 'NIN',
    type: 'Weaponskill',
    level: 1,
    comboBreak: true,
    icon: '000601',
  },

  // {
  //   name: 'Shade Shift',
  //   affinity: 'NIN',
  //   recast: 120,
  //   level: 2,
  //   icon: '',
  // },

  {
    name: 'Gust Slash',
    affinity: 'NIN',
    type: 'Weaponskill',
    level: 4,
    comboAction: 'Spinning Edge',
    comboBreak: true,
    icon: '000602',
  },

  {
    name: 'Hide',
    affinity: 'NIN',
    recast: 20,
    level: 10,
    icon: '000609',
  },

  {
    name: 'Throwing Dagger', // This is here to trigger loops
    affinity: 'NIN',
    type: 'Weaponskill',
    level: 15,
    icon: '', // Leaving this blank just because I can I guess
  },

  {
    name: 'Mug',
    affinity: 'NIN',
    recast: 120,
    level: 15,
    icon: '000613',
  },

  {
    name: 'Trick Attack',
    affinity: 'NIN',
    recast: 60,
    level: 18,
    status: 'Trick Attack',
    icon: '000618',
  },

  {
    name: 'Aeolian Edge',
    affinity: 'NIN',
    type: 'Weaponskill',
    level: 26,
    comboAction: 'Gust Slash',
    comboBreak: true,
    icon: '000605',
  },

  // Probably need to do something special for Mudra, all those inputs would be super annoying

  {
    name: 'Death Blossom',
    affinity: 'NIN',
    type: 'Weaponskill',
    level: 38,
    comboBreak: true,
    icon: '000615',
  },

  {
    name: 'Assassinate',
    affinity: 'NIN',
    recast: 60,
    level: 40,
    icon: '000612',
  },

  {
    name: 'Kassatsu',
    affinity: 'NIN',
    recast: 60,
    level: 50,
    status: 'Kassatsu',
    icon: '002906',
  },

  {
    name: 'Hakke Mujinsatsu',
    affinity: 'NIN',
    type: 'Weaponskill',
    level: 52,
    comboAction: 'Death Blossom',
    comboBreak: true,
    huton: 10,
    icon: '002923',
  },

  {
    name: 'Armor Crush',
    affinity: 'NIN',
    type: 'Weaponskill',
    level: 54,
    comboAction: 'Gust Slash',
    comboBreak: true,
    huton: 30,
    icon: '002915',
  },

  {
    name: 'Dream Within a Dream',
    affinity: 'NIN',
    recast: 60,
    level: 56,
    icon: '002918',
  },

  {
    name: 'Huraijin',
    affinity: 'NIN',
    type: 'Weaponskill',
    level: 60,
    huton: 60,
    icon: '002928',
  },

  {
    name: 'Hellfrog Medium',
    affinity: 'NIN',
    recast: 1,
    level: 62,
    ninkiCost: 50,
    icon: '002920',
  },

  {
    name: 'Bhavacakra',
    affinity: 'NIN',
    recast: 1,
    level: 68,
    ninkiCost: 50,
    icon: '002921',
  },

  {
    name: 'Ten Chi Jin',
    affinity: 'NIN',
    recast: 120,
    level: 70,
    status: 'Ten Chi Jin',
    icon: '002922',
  },

  {
    name: 'Meisui',
    affinity: 'NIN',
    recast: 120,
    level: 72,
    ninki: 50,
    icon: '002924',
  },

  {
    name: 'Bunshin',
    affinity: 'NIN',
    recast: 90,
    level: 80,
    status: 'Phantom Kamaitachi Ready', // Check later
    ninkiCost: 50,
    icon: '002927',
  },

  {
    name: 'Phantom Kamaitachi',
    affinity: 'NIN',
    type: 'Weaponskill',
    level: 82,
    huton: 10,
    icon: '002929',
  },

  {
    name: 'Forked Raiju',
    affinity: 'NIN',
    type: 'Weaponskill',
    level: 90,
    status: 'Fleeting Raiju Ready',
    icon: '002931',
  },

  {
    name: 'Fleeting Raiju',
    affinity: 'NIN',
    type: 'Weaponskill',
    level: 90,
    icon: '002932',
  },

  {
    name: 'Mudra',
    affinity: 'NIN',
    recast: 20,
    level: 30,
    charges: 2,
    // icon: '',
  },

  {
    name: 'Ten',
    affinity: 'NIN',
    type: 'Mudra',
    level: 30,
    icon: '002901',
  },

  {
    name: 'Fuma Shuriken',
    affinity: 'NIN',
    type: 'Ninjutsu', // Why is Ninjutsu so weird
    recast: 1.5,
    level: 30,
    icon: '002907',
  },

  {
    name: 'Rabbit Medium',
    affinity: 'NIN',
    type: 'Ninjutsu', // Why is Ninjutsu so weird
    recast: 1.5,
    level: 30,
    icon: '',
  },

  {
    name: 'Chi',
    affinity: 'NIN',
    type: 'Mudra',
    level: 35,
    icon: '002902',
  },

  {
    name: 'Katon',
    affinity: 'NIN',
    type: 'Ninjutsu',
    recast: 1.5,
    level: 35,
    icon: '002908',
  },

  {
    name: 'Raiton',
    affinity: 'NIN',
    type: 'Ninjutsu',
    recast: 1.5,
    level: 35,
    icon: '002912',
  },

  {
    name: 'Jin',
    affinity: 'NIN',
    type: 'Mudra',
    level: 45,
    icon: '002903',
  },

  {
    name: 'Hyoton',
    affinity: 'NIN',
    type: 'Ninjutsu',
    recast: 1.5,
    level: 45,
    icon: '002909',
  },

  {
    name: 'Huton',
    affinity: 'NIN',
    type: 'Ninjutsu',
    recast: 1.5,
    level: 45,
    huton: 60,
    icon: '002910',
  },

  {
    name: 'Doton',
    affinity: 'NIN',
    type: 'Ninjutsu',
    recast: 1.5,
    level: 45,
    status: 'Doton',
    icon: '002911',
  },

  {
    name: 'Suiton',
    affinity: 'NIN',
    type: 'Ninjutsu',
    recast: 1.5,
    level: 45,
    status: 'Suiton',
    icon: '002913',
  },

  {
    name: 'Goka Mekkyaku',
    affinity: 'NIN',
    type: 'Ninjutsu',
    recast: 1.5,
    level: 76,
    icon: '002925',
  },

  {
    name: 'Hyosho Ranryu',
    affinity: 'NIN',
    type: 'Ninjutsu',
    recast: 1.5,
    level: 76,
    icon: '002926',
  },

  // PLD

  {
    name: 'Fast Blade',
    affinity: 'PLD',
    type: 'Weaponskill',
    level: 1,
    icon: '',
  },

  {
    name: 'Riot Blade',
    affinity: 'PLD',
    type: 'Weaponskill',
    level: 4,
    icon: '',
  },

  // RDM

  {
    name: 'Riposte',
    affinity: 'RDM',
    level: 1,
    type: 'Weaponskill',
    icon: '003201',
  },

  {
    name: 'Jolt',
    affinity: 'RDM',
    level: 2,
    type: 'Spell',
    cast: 2,
    mpCost: 200,
    blackMana: 2,
    whiteMana: 2,
    icon: '003202',
  },

  {
    name: 'Verthunder',
    affinity: 'RDM',
    level: 4,
    type: 'Spell',
    cast: 5,
    mpCost: 300,
    blackMana: 6,
    icon: '003203',
  },

  {
    name: 'Corps-a-corps',
    affinity: 'RDM',
    level: 6,
    recast: 35,
    charges: 2,
    icon: '003204',
  },

  {
    name: 'Veraero',
    affinity: 'RDM',
    level: 10,
    type: 'Spell',
    cast: 5,
    mpCost: 300,
    whiteMana: 6,
    icon: '003205',
  },

  {
    name: 'Scatter',
    affinity: 'RDM',
    level: 15,
    type: 'Spell',
    cast: 5,
    mpCost: 400,
    blackMana: 3,
    whiteMana: 3,
    icon: '003207',
  },

  {
    name: 'Verthunder II',
    affinity: 'RDM',
    level: 18,
    type: 'Spell',
    cast: 2,
    mpCost: 400,
    blackMana: 7,
    icon: '003229',
  },

  {
    name: 'Veraero II',
    affinity: 'RDM',
    level: 22,
    type: 'Spell',
    cast: 2,
    mpCost: 400,
    whiteMana: 7,
    icon: '003230',
  },

  {
    name: 'Verfire',
    affinity: 'RDM',
    level: 26,
    type: 'Spell',
    cast: 2,
    mpCost: 200,
    blackMana: 5,
    icon: '003208',
  },

  {
    name: 'Verstone',
    affinity: 'RDM',
    level: 30,
    type: 'Spell',
    cast: 2,
    mpCost: 200,
    whiteMana: 5,
    icon: '003209',
  },

  // {
  //   name: 'Zwerchhau',
  //   affinity: 'RDM',
  //   level: 35,
  //   type: 'Weaponskill',
  //   icon: '',
  // },

  {
    name: 'Displacement',
    affinity: 'RDM',
    level: 40,
    recast: 35,
    charges: 2,
    icon: '003211',
  },

  {
    name: 'Engagement',
    affinity: 'RDM',
    level: 40,
    recast: 35,
    charges: 2,
    icon: '003231',
  },

  {
    name: 'Fleche',
    affinity: 'RDM',
    level: 45,
    recast: 25,
    icon: '003212',
  },

  // {
  //   name: 'Redoublement',
  //   affinity: 'RDM',
  //   level: 50,
  //   type: 'Weaponskill',
  //   icon: '',
  // },

  {
    name: 'Acceleration',
    affinity: 'RDM',
    level: 50,
    recast: 55,
    status: 'Acceleration',
    icon: '003214',
  },

  // {
  //   name: 'Moulinet',
  //   affinity: 'RDM',
  //   level: 52,
  //   type: 'Weaponskill',
  //   icon: '',
  // },

  {
    name: 'Vercure',
    affinity: 'RDM',
    level: 54,
    type: 'Spell',
    cast: 2,
    mpCost: 500,
    icon: '',
  },

  {
    name: 'Contre Sixte',
    affinity: 'RDM',
    level: 56,
    recast: 35,
    icon: '003217',
  },

  {
    name: 'Embolden',
    affinity: 'RDM',
    level: 58,
    recast: 120,
    status: 'Embolden',
    icon: '003218',
  },

  {
    name: 'Manafication',
    affinity: 'RDM',
    level: 60,
    recast: 120,
    icon: '003219',
  },

  {
    name: 'Jolt II',
    affinity: 'RDM',
    level: 62,
    type: 'Spell',
    cast: 2,
    mpCost: 200,
    blackMana: 3,
    whiteMana: 3,
    icon: '003220',
  },

  {
    name: 'Verraise',
    affinity: 'RDM',
    level: 64,
    type: 'Spell',
    cast: 10,
    mpCost: 2400,
    icon: '003221',
  },

  {
    name: 'Impact',
    affinity: 'RDM',
    level: 66,
    type: 'Spell',
    cast: 5,
    mpCost: 400,
    blackMana: 3,
    whiteMana: 3,
    icon: '003222',
  },

  {
    name: 'Verflare',
    affinity: 'RDM',
    level: 68,
    type: 'Spell',
    mpCost: 380,
    blackMana: 21,
    manaStackCost: 3,
    icon: '003223',
  },

  {
    name: 'Verholy',
    affinity: 'RDM',
    level: 70,
    type: 'Spell',
    mpCost: 380,
    whiteMana: 21,
    manaStackCost: 3,
    icon: '003224',
  },

  // {
  //   name: 'Reprise',
  //   affinity: 'RDM',
  //   level: 76,
  //   type: 'Weaponskill',
  //   icon: '',
  // },

  {
    name: 'Scorch',
    affinity: 'RDM',
    level: 80,
    type: 'Spell',
    mpCost: 400,
    blackMana: 7,
    whiteMana: 7,
    comboAction: 'Verflare, Verholy',
    icon: '003234',
  },

  {
    name: 'Verthunder III',
    affinity: 'RDM',
    level: 82,
    type: 'Spell',
    cast: 5,
    mpCost: 300,
    blackMana: 6,
    icon: '003235',
  },

  {
    name: 'Veraero III',
    affinity: 'RDM',
    level: 82,
    type: 'Spell',
    cast: 5,
    mpCost: 300,
    whiteMana: 6,
    icon: '003236',
  },

  {
    name: 'Magick Barrier',
    affinity: 'RDM',
    level: 86,
    recast: 120,
    icon: '003237',
  },

  {
    name: 'Resolution',
    affinity: 'RDM',
    level: 90,
    type: 'Spell',
    mpCost: 400,
    blackMana: 4,
    whiteMana: 4,
    comboAction: 'Scorch',
    icon: '003238',
  },

  {
    name: 'Enchanted Riposte',
    affinity: 'RDM',
    level: 1,
    type: 'Weaponskill',
    recast: 1.5,
    manaCost: 20,
    icon: '003225',
  },

  {
    name: 'Enchanted Zwerchhau',
    affinity: 'RDM',
    level: 35,
    type: 'Weaponskill',
    recast: 1.5,
    manaCost: 15,
    comboAction: 'Enchanted Riposte',
    icon: '003226',
  },

  {
    name: 'Enchanted Redoublement',
    affinity: 'RDM',
    level: 50,
    type: 'Weaponskill',
    recast: 2.2,
    manaCost: 15,
    comboAction: 'Enchanted Zwerchhau',
    icon: '003227',
  },

  {
    name: 'Enchanted Moulinet',
    affinity: 'RDM',
    level: 52,
    type: 'Weaponskill',
    recast: 1.5,
    manaCost: 20,
    icon: '003228',
  },

  {
    name: 'Enchanted Reprise',
    affinity: 'RDM',
    level: 76,
    type: 'Weaponskill',
    recast: 2.5, // Not modified by spell speed
    manaCost: 5,
    icon: '003232',
  },

  // RPR

  {
    name: 'Slice',
    affinity: 'RPR',
    level: 1,
    type: 'Weaponskill',
    soul: 10,
    icon: '',
  },

  {
    name: 'Waxing Slice',
    affinity: 'RPR',
    level: 5,
    type: 'Weaponskill',
    comboAction: 'Slice',
    soul: 10,
    icon: '',
  },

  {
    name: 'Shadow of Death',
    affinity: 'RPR',
    level: 10,
    type: 'Weaponskill',
    status: 'Death\'s Design',
    statusTarget: 'target',
    statusDuration: 30,
    statusMaxDuration: 60,
    icon: '',
    // Not sure how to model this:
    // Additional Effect: Increases Soul Gauge by 10 if target is KO'd before effect expires
  },

  {
    name: 'Harpe',
    affinity: 'RPR',
    level: 15,
    type: 'Spell',
    cast: 1.3,
    icon: '',
  },

  {
    name: 'Hell\'s Ingress',
    affinity: 'RPR',
    level: 20,
    icon: '',
  },

  {
    name: 'Hell\'s Egress',
    affinity: 'RPR',
    level: 20,
    icon: '',
  },

  {
    name: 'Spinning Scythe',
    affinity: 'RPR',
    level: 25,
    icon: '',
  },

  {
    name: 'Infernal Slice',
    affinity: 'RPR',
    level: 30,
    icon: '',
  },

  {
    name: 'Whorl of Death',
    affinity: 'RPR',
    level: 35,
    icon: '',
  },

  {
    name: 'Arcane Crest',
    affinity: 'RPR',
    level: 40,
    icon: '',
  },

  {
    name: 'Nightmare Scythe',
    affinity: 'RPR',
    level: 45,
    icon: '',
  },

  {
    name: 'Blood Stalk',
    affinity: 'RPR',
    level: 50,
    icon: '',
  },

  {
    name: 'Grim Swathe',
    affinity: 'RPR',
    level: 55,
    icon: '',
  },

  {
    name: 'Soul Slice',
    affinity: 'RPR',
    level: 60,
    icon: '',
  },

  {
    name: 'Soul Scythe',
    affinity: 'RPR',
    level: 65,
    icon: '',
  },

  {
    name: 'Gibbet',
    affinity: 'RPR',
    level: 70,
    icon: '',
  },

  {
    name: 'Gallows',
    affinity: 'RPR',
    level: 70,
    icon: '',
  },

  {
    name: 'Guillotine',
    affinity: 'RPR',
    level: 70,
    icon: '',
  },

  {
    name: 'Unveiled Gibbet',
    affinity: 'RPR',
    level: 70,
    icon: '',
  },

  {
    name: 'Unveiled Gallows',
    affinity: 'RPR',
    level: 70,
    icon: '',
  },

  {
    name: 'Arcane Circle',
    affinity: 'RPR',
    level: 72,
    icon: '',
  },

  {
    name: 'Regress',
    affinity: 'RPR',
    level: 74,
    icon: '',
  },

  {
    name: 'Gluttony',
    affinity: 'RPR',
    level: 76,
    icon: '',
  },

  {
    name: 'Enshroud',
    affinity: 'RPR',
    level: 80,
    icon: '',
  },

  {
    name: 'Void Reaping',
    affinity: 'RPR',
    level: 80,
    icon: '',
  },

  {
    name: 'Cross Reaping',
    affinity: 'RPR',
    level: 80,
    icon: '',
  },

  {
    name: 'Grim Reaping',
    affinity: 'RPR',
    level: 80,
    icon: '',
  },

  {
    name: 'Soulsow',
    affinity: 'RPR',
    level: 82,
    icon: '',
  },

  {
    name: 'Harvest Moon',
    affinity: 'RPR',
    level: 82,
    icon: '',
  },

  {
    name: 'Lemure\'s Slice',
    affinity: 'RPR',
    level: 86,
    icon: '',
  },

  {
    name: 'Lemure\'s Scythe',
    affinity: 'RPR',
    level: 86,
    icon: '',
  },

  {
    name: 'Plentiful Harvest',
    affinity: 'RPR',
    level: 88,
    icon: '',
  },

  {
    name: 'Communio',
    affinity: 'RPR',
    level: 90,
    icon: '',
  },

  // SMN

  {
    name: 'Ruin',
    affinity: 'SMN',
    level: 1,
    type: 'Spell',
    cast: 1.5,
    mpCost: 300,
    icon: '',
  },

  {
    name: 'Summon Carbuncle',
    affinity: 'SMN',
    level: 2,
    type: 'Spell',
    cast: 1.5,
    mpCost: 400,
    icon: '',
  },

  {
    name: 'Radiant Aegis',
    affinity: 'SMN',
    level: 2,
    recast: 60,
    icon: '',
  },

  {
    name: 'Physick',
    affinity: 'SMN',
    level: 4,
    type: 'Spell',
    cast: 1.5,
    mpCost: 300,
    icon: '',
  },

  {
    name: 'Aethercharge',
    affinity: 'SMN',
    level: 6,
    type: 'Spell',
    recast: 60,
    icon: '',
  },

  {
    name: 'Summon Ruby',
    affinity: 'SMN',
    level: 6,
    type: 'Spell',
    attunementStacks: 2,
    attunementElement: 'Fire',
    attunementSeconds: 30,
    icon: '',
  },

  {
    name: 'Ruby Ruin',
    affinity: 'SMN',
    level: 6,
    type: 'Spell',
    cast: 2.8,
    mpCost: 300,
    attunementCost: 1,
    icon: '',
  },

  {
    name: 'Fester',
    affinity: 'SMN',
    level: 10,
    recast: 1,
    aetherflowCost: 1,
    icon: '',
  },

  {
    name: 'Energy Drain',
    affinity: 'SMN',
    level: 10,
    recast: 60,
    aetherflow: 2,
    icon: '',
  },

  {
    name: 'Resurrection',
    affinity: 'SMN',
    level: 12,
    type: 'Spell',
    cast: 8,
    mpCost: 2400,
    icon: '',
  },

  {
    name: 'Summon Topaz',
    affinity: 'SMN',
    level: 15,
    type: 'Spell',
    icon: '',
  },

  {
    name: 'Topaz Ruin',
    affinity: 'SMN',
    level: 15,
    type: 'Spell',
    mpCost: 300,
    icon: '',
  },

  {
    name: 'Summon Emerald',
    affinity: 'SMN',
    level: 22,
    type: 'Spell',
    icon: '',
  },

  {
    name: 'Emerald Ruin',
    affinity: 'SMN',
    level: 22,
    type: 'Spell',
    recast: 1.5,
    mpCost: 300,
    icon: '',
  },

  {
    name: 'Outburst',
    affinity: 'SMN',
    level: 26,
    type: 'Spell',
    cast: 1.5,
    mpCost: 300,
    icon: '',
  },

  {
    name: 'Ruby Outburst',
    affinity: 'SMN',
    level: 26,
    type: 'Spell',
    cast: 2.8,
    mpCost: 300,
    icon: '',
  },

  {
    name: 'Topaz Outburst',
    affinity: 'SMN',
    level: 26,
    type: 'Spell',
    mpCost: 300,
    icon: '',
  },

  {
    name: 'Emerald Outburst',
    affinity: 'SMN',
    level: 26,
    type: 'Spell',
    recast: 1.5,
    mpCost: 300,
    icon: '',
  },

  {
    name: 'Ruin II',
    affinity: 'SMN',
    level: 30,
    type: 'Spell',
    cast: 1.5,
    mpCost: 300,
    icon: '',
  },

  {
    name: 'Summon Ifrit',
    affinity: 'SMN',
    level: 30,
    type: 'Spell',
    icon: '',
  },

  {
    name: 'Ruby Ruin II',
    affinity: 'SMN',
    level: 30,
    type: 'Spell',
    cast: 2.8,
    mpCost: 300,
    icon: '',
  },

  {
    name: 'Topaz Ruin II',
    affinity: 'SMN',
    level: 30,
    type: 'Spell',
    mpCost: 300,
    icon: '',
  },

  {
    name: 'Emerald Ruin II',
    affinity: 'SMN',
    level: 30,
    type: 'Spell',
    recast: 1.5,
    mpCost: 300,
    icon: '',
  },

  {
    name: 'Summon Titan',
    affinity: 'SMN',
    level: 35,
    type: 'Spell',
    icon: '',
  },

  {
    name: 'Painflare',
    affinity: 'SMN',
    level: 40,
    recast: 1,
    aetherflowCost: 1,
    icon: '',
  },

  {
    name: 'Summon Garuda',
    affinity: 'SMN',
    level: 45,
    type: 'Spell',
    icon: '',
  },

  {
    name: 'Energy Siphon',
    affinity: 'SMN',
    level: 52,
    recast: 60,
    mpCost: 300,
    icon: '',
  },

  {
    name: 'Ruin III',
    affinity: 'SMN',
    level: 54,
    type: 'Spell',
    cast: 1.5,
    mpCost: 300,
    icon: '',
  },

  {
    name: 'Ruby Ruin III',
    affinity: 'SMN',
    level: 54,
    type: 'Spell',
    cast: 2.8,
    mpCost: 300,
    icon: '',
  },

  {
    name: 'Topaz Ruin III',
    affinity: 'SMN',
    level: 54,
    type: 'Spell',
    mpCost: 300,
    icon: '',
  },

  {
    name: 'Emerald Ruin III',
    affinity: 'SMN',
    level: 54,
    type: 'Spell',
    recast: 1.5,
    mpCost: 300,
    icon: '',
  },

  {
    name: 'Dreadwyrm Trance',
    affinity: 'SMN',
    level: 58,
    type: 'Spell',
    recast: 60,
    mpCost: 300,
    icon: '',
  },

  {
    name: 'Astral Impulse',
    affinity: 'SMN',
    level: 58,
    type: 'Spell',
    mpCost: 300,
    icon: '',
  },

  {
    name: 'Astral Flare',
    affinity: 'SMN',
    level: 58,
    type: 'Spell',
    mpCost: 300,
    icon: '',
  },

  {
    name: 'Deathflare',
    affinity: 'SMN',
    level: 60,
    recast: 20,
    icon: '',
  },

  {
    name: 'Ruin IV',
    affinity: 'SMN',
    level: 62,
    type: 'Spell',
    mpCost: 400,
    icon: '',
  },

  {
    name: 'Searing Light',
    affinity: 'SMN',
    level: 66,
    recast: 120,
    icon: '',
  },

  {
    name: 'Summon Bahamut',
    affinity: 'SMN',
    level: 70,
    type: 'Spell',
    recast: 60,
    icon: '',
  },

  {
    name: 'Enkindle Bahamut',
    affinity: 'SMN',
    level: 70,
    recast: 20,
    icon: '',
  },

  {
    name: 'Ruby Rite',
    affinity: 'SMN',
    level: 72,
    type: 'Spell',
    cast: 2.8,
    mpCost: 300,
    icon: '',
  },

  {
    name: 'Topaz Rite',
    affinity: 'SMN',
    level: 72,
    type: 'Spell',
    mpCost: 300,
    icon: '',
  },

  {
    name: 'Emerald Rite',
    affinity: 'SMN',
    level: 72,
    type: 'Spell',
    recast: 1.5,
    mpCost: 300,
    icon: '',
  },

  {
    name: 'Tri Disaster',
    affinity: 'SMN',
    level: 74,
    type: 'Spell',
    cast: 1.5,
    mpCost: 300,
    icon: '',
  },

  {
    name: 'Ruby Disaster',
    affinity: 'SMN',
    level: 74,
    type: 'Spell',
    cast: 2.8,
    mpCost: 300,
    icon: '',
  },

  {
    name: 'Topaz Disaster',
    affinity: 'SMN',
    level: 74,
    type: 'Spell',
    mpCost: 300,
    icon: '',
  },

  {
    name: 'Emerald Disaster',
    affinity: 'SMN',
    level: 74,
    type: 'Spell',
    recast: 1.5,
    mpCost: 300,
    icon: '',
  },

  {
    name: 'Fountain of Fire',
    affinity: 'SMN',
    level: 80,
    type: 'Spell',
    mpCost: 300,
    icon: '',
  },

  {
    name: 'Brand of Purgatory',
    affinity: 'SMN',
    level: 80,
    type: 'Spell',
    mpCost: 300,
    icon: '',
  },

  {
    name: 'Summon Phoenix',
    affinity: 'SMN',
    level: 80,
    type: 'Spell',
    recast: 60,
    mpCost: 300,
    icon: '',
  },

  {
    name: 'Enkindle Phoenix',
    affinity: 'SMN',
    level: 80,
    recast: 20,
    icon: '',
  },

  // Tank Role Actions

  {
    name: 'Rampart',
    affinity: 'Tank',
    level: 8,
    recast: 90,
    icon: '',
  },

  // {
  //   name: 'Low Blow',
  //   affinity: 'Tank',
  //   level: 12,
  //   type: 'Ability',
  //   recast: 25,
  //   icon: '',
  // },

  // {
  //   name: 'Provoke',
  //   affinity: 'Tank',
  //   level: 15,
  //   type: 'Ability',
  //   recast: 30,
  //   icon: '',
  // },

  // {
  //   name: 'Interject',
  //   affinity: 'Tank',
  //   level: 18,
  //   type: 'Ability',
  //   recast: 30,
  //   icon: '',
  // },

  {
    name: 'Reprisal',
    affinity: 'Tank',
    level: 22,
    recast: 60,
    icon: '',
  },

  {
    name: 'Arm\'s Length',
    affinity: 'Tank',
    level: 32,
    recast: 120,
    icon: '',
  },

  // {
  //   name: 'Shirk',
  //   affinity: 'Tank',
  //   level: 12,
  //   type: 'Ability',
  //   recast: 120,
  //   icon: '',
  // },

  // Melee DPS Role Actions

  {
    name: 'Second Wind',
    affinity: 'Melee DPS',
    level: 8,
    recast: 120,
    icon: '',
  },

  // {
  //   name: 'Leg Sweep',
  //   affinity: 'Melee DPS',
  //   level: 10,
  //   type: 'Ability',
  //   recast: 40,
  //   icon: '',
  // },

  {
    name: 'Bloodbath',
    affinity: 'Melee DPS',
    level: 12,
    recast: 90,
    icon: '',
  },

  // {
  //   name: 'Feint',
  //   affinity: 'Melee DPS',
  //   level: 22,
  //   type: 'Ability',
  //   recast: 90,
  //   icon: '',
  // },

  // {
  //   name: 'Arm\'s Length',
  //   affinity: 'Melee DPS',
  //   level: 32,
  //   type: 'Ability',
  //   recast: 120,
  //   icon: '',
  // },

  {
    name: 'True North',
    affinity: 'Melee DPS',
    level: 50,
    recast: 45,
    charges: 2,
    icon: '',
  },

  // Magic Ranged DPS Role Actions

  // {
  //   name: 'Addle',
  //   affinity: 'Magic Ranged DPS',
  //   level: 8,
  //   type: 'Ability',
  //   recast: 90,
  //   icon: '000861',
  // },

  {
    name: 'Swiftcast',
    affinity: 'Magic Ranged DPS',
    level: 18,
    recast: 60,
    icon: '000866',
  },

  {
    name: 'Lucid Dreaming',
    affinity: 'Magic Ranged DPS',
    level: 24,
    recast: 60,
    status: 'Lucid Dreaming',
    icon: '000865',
  },

  // {
  //   name: 'Surecast',
  //   affinity: 'Magic Ranged DPS',
  //   level: 44,
  //   type: 'Ability',
  //   recast: 60,
  // },

];

// eslint-disable-next-line no-unused-vars
const baseStatusData = [
  { name: 'Combo', duration: 15 }, // Might be easier to put this in playerData later

  { name: 'Acceleration', duration: 20 },
  { name: 'Bunshin', duration: 30 },
  { name: 'Doton', duration: 24 },
  { name: 'Dualcast', duration: 15 },
  { name: 'Embolden', duration: 20 },
  { name: 'Fleeting Raiju Ready', duration: 15 },
  { name: 'Forked Raiju Ready', duration: 15 },
  { name: 'Kassatsu', duration: 15 },
  { name: 'Lucid Dreaming', duration: 21 },
  { name: 'Manafication', duration: 15 },
  { name: 'Mudra', duration: 6 },
  { name: 'Phantom Kamaitachi Ready', duration: 9999 },
  { name: 'Suiton', duration: 20 },
  { name: 'Swiftcast', duration: 10 },
  { name: 'Ten Chi Jin', duration: 6 },
  { name: 'Trick Attack', duration: 15 }, // Technically not a self status effect - easier set as one
  { name: 'Verfire Ready', duration: 30 },
  { name: 'Verstone Ready', duration: 30 },
];

// eslint-disable-next-line no-unused-vars
const playerStatsData = [
  { level: 1, baseStat: 56, levelMod: 56 },
  { level: 2, baseStat: 57, levelMod: 57 },
  { level: 3, baseStat: 60, levelMod: 60 },
  { level: 4, baseStat: 62, levelMod: 62 },
  { level: 5, baseStat: 65, levelMod: 65 },
  { level: 6, baseStat: 68, levelMod: 68 },
  { level: 7, baseStat: 70, levelMod: 70 },
  { level: 8, baseStat: 73, levelMod: 73 },
  { level: 9, baseStat: 76, levelMod: 76 },
  { level: 10, baseStat: 78, levelMod: 78 },
  { level: 11, baseStat: 82, levelMod: 82 },
  { level: 12, baseStat: 85, levelMod: 85 },
  { level: 13, baseStat: 89, levelMod: 89 },
  { level: 14, baseStat: 93, levelMod: 93 },
  { level: 15, baseStat: 96, levelMod: 96 },
  { level: 16, baseStat: 100, levelMod: 100 },
  { level: 17, baseStat: 104, levelMod: 104 },
  { level: 18, baseStat: 109, levelMod: 109 },
  { level: 19, baseStat: 113, levelMod: 113 },
  { level: 20, baseStat: 116, levelMod: 116 },
  { level: 21, baseStat: 122, levelMod: 122 },
  { level: 22, baseStat: 127, levelMod: 127 },
  { level: 23, baseStat: 133, levelMod: 133 },
  { level: 24, baseStat: 138, levelMod: 138 },
  { level: 25, baseStat: 144, levelMod: 144 },
  { level: 26, baseStat: 150, levelMod: 150 },
  { level: 27, baseStat: 155, levelMod: 155 },
  { level: 28, baseStat: 162, levelMod: 162 },
  { level: 29, baseStat: 168, levelMod: 168 },
  { level: 30, baseStat: 173, levelMod: 173 },
  { level: 31, baseStat: 181, levelMod: 181 },
  { level: 32, baseStat: 188, levelMod: 188 },
  { level: 33, baseStat: 194, levelMod: 194 },
  { level: 34, baseStat: 202, levelMod: 202 },
  { level: 35, baseStat: 209, levelMod: 209 },
  { level: 36, baseStat: 215, levelMod: 215 },
  { level: 37, baseStat: 223, levelMod: 223 },
  { level: 38, baseStat: 229, levelMod: 229 },
  { level: 39, baseStat: 236, levelMod: 236 },
  { level: 40, baseStat: 244, levelMod: 244 },
  { level: 41, baseStat: 253, levelMod: 253 },
  { level: 42, baseStat: 263, levelMod: 263 },
  { level: 43, baseStat: 272, levelMod: 272 },
  { level: 44, baseStat: 283, levelMod: 283 },
  { level: 45, baseStat: 292, levelMod: 292 },
  { level: 46, baseStat: 302, levelMod: 302 },
  { level: 47, baseStat: 311, levelMod: 311 },
  { level: 48, baseStat: 322, levelMod: 322 },
  { level: 49, baseStat: 331, levelMod: 331 },
  { level: 50, baseStat: 341, levelMod: 341 },
  { level: 51, baseStat: 342, levelMod: 366 },
  { level: 52, baseStat: 344, levelMod: 392 },
  { level: 53, baseStat: 345, levelMod: 418 },
  { level: 54, baseStat: 346, levelMod: 444 },
  { level: 55, baseStat: 347, levelMod: 470 },
  { level: 56, baseStat: 349, levelMod: 496 },
  { level: 57, baseStat: 350, levelMod: 522 },
  { level: 58, baseStat: 351, levelMod: 548 },
  { level: 59, baseStat: 352, levelMod: 574 },
  { level: 60, baseStat: 354, levelMod: 600 },
  { level: 61, baseStat: 355, levelMod: 630 },
  { level: 62, baseStat: 356, levelMod: 660 },
  { level: 63, baseStat: 357, levelMod: 690 },
  { level: 64, baseStat: 358, levelMod: 720 },
  { level: 65, baseStat: 359, levelMod: 750 },
  { level: 66, baseStat: 360, levelMod: 780 },
  { level: 67, baseStat: 361, levelMod: 810 },
  { level: 68, baseStat: 362, levelMod: 840 },
  { level: 69, baseStat: 363, levelMod: 870 },
  { level: 70, baseStat: 364, levelMod: 900 },
  { level: 71, baseStat: 365, levelMod: 940 },
  { level: 72, baseStat: 366, levelMod: 980 },
  { level: 73, baseStat: 367, levelMod: 1020 },
  { level: 74, baseStat: 368, levelMod: 1060 },
  { level: 75, baseStat: 370, levelMod: 1100 },
  { level: 76, baseStat: 372, levelMod: 1140 },
  { level: 77, baseStat: 374, levelMod: 1180 },
  { level: 78, baseStat: 376, levelMod: 1220 },
  { level: 79, baseStat: 378, levelMod: 1260 },
  { level: 80, baseStat: 380, levelMod: 1300 },
  { level: 81, baseStat: 382, levelMod: 1360 },
  { level: 82, baseStat: 384, levelMod: 1420 },
  { level: 83, baseStat: 386, levelMod: 1480 },
  { level: 84, baseStat: 388, levelMod: 1540 },
  { level: 85, baseStat: 390, levelMod: 1600 },
  { level: 86, baseStat: 392, levelMod: 1660 },
  { level: 87, baseStat: 394, levelMod: 1720 },
  { level: 88, baseStat: 396, levelMod: 1780 },
  { level: 89, baseStat: 398, levelMod: 1840 },
  { level: 90, baseStat: 400, levelMod: 1900 },
];

// // eslint-disable-next-line no-unused-vars
// const testActionData = [
//   {
//     name: 'GCD1',
//     type: 'Weaponskill',
//     icon: '000001',
//   },

//   {
//     name: 'OGCD2',
//     icon: '000002',
//   },

//   {
//     name: 'GCD3',
//     type: 'Spell',
//     icon: '000003',
//   },

//   {
//     name: 'OGCD4',
//     icon: '000004',
//   },
// ];

// eslint-disable-next-line no-unused-vars
const getActionDataProperty = ({ actionName, property } = {}) => {
  const actionDataIndex = actionData.findIndex((e) => e.name === actionName);
  if (actionDataIndex < 0) { return 0; }
  if (actionData[actionDataIndex][property]) {
    return actionData[actionDataIndex][property];
  }
  return 0;
};
