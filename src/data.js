// eslint-disable-next-line no-unused-vars
const allActionData = [
  // Use base values and modify during job load

  // NIN

  // PLD

  {
    name: 'Fast Blade',
    affinity: 'PLD',
    gcd: 2.5,
    level: 1,
    icon: '',
  },

  {
    name: 'Riot Blade',
    affinity: 'PLD',
    gcd: 2.5,
    level: 4,
    icon: '',
  },

  // RDM

  // {
  //   name: 'Riposte',
  //   affinity: 'RDM',
  //   level: 1,
  //   icon: '',
  // },

  {
    name: 'Jolt',
    affinity: 'RDM',
    level: 2,
    cast: 2,
    mpCost: 200,
    potency: 170,
    blackMana: 2,
    whiteMana: 2,
    icon: '003202',
  },

  {
    name: 'Verthunder',
    affinity: 'RDM',
    level: 4,
    cast: 5,
    mpCost: 300,
    potency: 310,
    blackMana: 6,
    icon: '003203',
  },

  {
    name: 'Corps-a-corps',
    affinity: 'RDM',
    level: 6,
    recast: 35,
    charges: 2,
    potency: 120,
    icon: '003204',
  },

  {
    name: 'Veraero',
    affinity: 'RDM',
    level: 10,
    cast: 5,
    mpCost: 300,
    potency: 310,
    whiteMana: 6,
    icon: '003205',
  },

  {
    name: 'Scatter',
    affinity: 'RDM',
    level: 15,
    cast: 5,
    mpCost: 400,
    potency: 120,
    aoe: true,
    blackMana: 3,
    whiteMana: 3,
    icon: '003207',
  },

  {
    name: 'Verthunder II',
    affinity: 'RDM',
    level: 18,
    cast: 2,
    mpCost: 400,
    potency: 100, // *** check this later?
    aoe: true,
    blackMana: 7,
    icon: '003229',
  },

  {
    name: 'Veraero II',
    affinity: 'RDM',
    level: 22,
    cast: 2,
    mpCost: 400,
    potency: 100,
    aoe: true,
    whiteMana: 7,
    icon: '003230',
  },

  {
    name: 'Verfire',
    affinity: 'RDM',
    level: 26,
    cast: 2,
    mpCost: 200,
    potency: 300,
    blackMana: 5,
    icon: '003208',
  },

  {
    name: 'Verstone',
    affinity: 'RDM',
    level: 30,
    cast: 2,
    mpCost: 200,
    potency: 300,
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
    potency: 150,
    icon: '003211',
  },

  {
    name: 'Engagement',
    affinity: 'RDM',
    level: 40,
    recast: 35,
    charges: 2,
    potency: 150,
    icon: '003231',
  },

  {
    name: 'Fleche',
    affinity: 'RDM',
    level: 45,
    recast: 25,
    potency: 420,
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
    cast: 2,
    mpCost: 500,
    icon: '',
  },

  {
    name: 'Contre Sixte',
    affinity: 'RDM',
    level: 56,
    recast: 35,
    potency: 380,
    aoe: true,
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
    cast: 2,
    mpCost: 200,
    potency: 290,
    blackMana: 3,
    whiteMana: 3,
    icon: '003220',
  },

  {
    name: 'Verraise',
    affinity: 'RDM',
    level: 64,
    cast: 10,
    mpCost: 2400,
    icon: '',
  },

  {
    name: 'Impact',
    affinity: 'RDM',
    level: 66,
    cast: 5,
    mpCost: 400,
    potency: 220,
    aoe: true,
    blackMana: 3,
    whiteMana: 3,
    icon: '003222',
  },

  {
    name: 'Verflare',
    affinity: 'RDM',
    level: 68,
    mpCost: 380,
    potency: 600,
    aoe: true,
    blackMana: 21,
    manaStackCost: 3,
    icon: '003223',
  },

  {
    name: 'Verholy',
    affinity: 'RDM',
    level: 70,
    mpCost: 380,
    potency: 600,
    aoe: true,
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
    mpCost: 400,
    potency: 680,
    aoe: true,
    blackMana: 7,
    whiteMana: 7,
    comboAction: 'Verflare, Verholy',
    icon: '003234',
  },

  {
    name: 'Verthunder III',
    affinity: 'RDM',
    level: 82,
    cast: 5,
    mpCost: 300,
    potency: 310,
    blackMana: 6,
    icon: '003235',
  },

  {
    name: 'Veraero III',
    affinity: 'RDM',
    level: 82,
    cast: 5,
    mpCost: 300,
    potency: 310,
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
    mpCost: 400,
    potency: 750,
    aoe: true,
    blackMana: 4,
    whiteMana: 4,
    comboAction: 'Scorch',
    icon: '003238',
  },

  {
    name: 'Enchanted Riposte',
    affinity: 'RDM',
    level: 1,
    gcd: 1.5,
    potency: 220,
    manaCost: 20,
    manaStack: 1,
    icon: '003225',
  },

  {
    name: 'Enchanted Zwerchhau',
    affinity: 'RDM',
    level: 35,
    gcd: 1.5,
    potency: 290,
    manaCost: 15,
    manaStack: 1,
    comboAction: 'Enchanted Riposte',
    icon: '003226',
  },

  {
    name: 'Enchanted Redoublement',
    affinity: 'RDM',
    level: 50,
    gcd: 2.2,
    potency: 470,
    manaCost: 15,
    comboAction: 'Enchanted Zwerchhau',
    icon: '003227',
  },

  {
    name: 'Enchanted Moulinet',
    affinity: 'RDM',
    level: 52,
    gcd: 1.5,
    potency: 200,
    aoe: true,
    manaCost: 20,
    manaStack: 1,
    icon: '003228',
  },

  {
    name: 'Enchanted Reprise',
    affinity: 'RDM',
    level: 76,
    gcd: 2.5,
    potency: 330,
    manaCost: 5,
    icon: '003232',
  },

  // SMN
  {
    name: 'Fester',
    affinity: 'SMN',
    level: 10,
    recast: 1,
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
  //   icon: '',
  // },

  {
    name: 'Swiftcast',
    affinity: 'Magic Ranged DPS',
    level: 18,
    recast: 60,
    icon: '',
  },

  {
    name: 'Lucid Dreaming',
    affinity: 'Magic Ranged DPS',
    level: 24,
    recast: 60,
    icon: '',
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
const statusData = [
  {
    name: 'Combo',
    duration: 15,
  },

  {
    name: 'Acceleration',
    duration: 20,
    stacks: 3,
  },

  {
    name: 'Dualcast',
    duration: 15,
  },

  {
    name: 'Manafication', // Level 74 trait
    duration: 15,
    stacks: 4, // ????
    blackMana: 50,
    whiteMana: 50,
  },

  {
    name: 'Trick Attack', // Technically not a status effect, but we'll make it one
    duration: 15,
  },

  {
    name: 'Verfire Ready',
    duration: 30,
  },

  {
    name: 'Verstone Ready',
    duration: 30,
  },
];
