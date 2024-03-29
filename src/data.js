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

  {
    name: 'Bootshine',
    affinity: 'MNK',
    level: 1,
    type: 'Weaponskill',
    icon: '000208',
  },

  {
    name: 'True Strike',
    affinity: 'MNK',
    level: 4,
    type: 'Weaponskill',
    icon: '000209',
  },

  {
    name: 'Snap Punch',
    affinity: 'MNK',
    level: 6,
    type: 'Weaponskill',
    icon: '000210',
  },

  {
    name: 'Meditation',
    affinity: 'MNK',
    level: 15,
    type: 'Ability',
    recast: 1,
    icon: '002534',
  },

  {
    name: 'Steel Peak',
    affinity: 'MNK',
    level: 15,
    type: 'Ability',
    recast: 1,
    ogcd: true,
    icon: '002530',
  },

  {
    name: 'Twin Snakes',
    affinity: 'MNK',
    level: 18,
    type: 'Weaponskill',
    icon: '000213',
  },

  {
    name: 'Arm of the Destroyer',
    affinity: 'MNK',
    level: 26,
    type: 'Weaponskill',
    icon: '000215',
  },

  {
    name: 'Demolish',
    affinity: 'MNK',
    level: 30,
    type: 'Weaponskill',
    icon: '000204',
  },

  {
    name: 'Rockbreaker',
    affinity: 'MNK',
    level: 30,
    type: 'Weaponskill',
    icon: '002529',
  },

  {
    name: 'Thunderclap',
    affinity: 'MNK',
    level: 35,
    type: 'Ability',
    recast: 30,
    ogcd: true,
    icon: '002975',
  },

  {
    name: 'Howling Fist',
    affinity: 'MNK',
    level: 40,
    type: 'Ability',
    ogcd: true,
    icon: '000207',
  },

  {
    name: 'Mantra',
    affinity: 'MNK',
    level: 42,
    type: 'Ability',
    recast: 90,
    ogcd: true,
    icon: '000216',
  },

  {
    name: 'Four-point Fury',
    affinity: 'MNK',
    level: 45,
    type: 'Weaponskill',
    icon: '002544',
  },

  {
    name: 'Dragon Kick',
    affinity: 'MNK',
    level: 50,
    type: 'Weaponskill',
    icon: '002528',
  },

  {
    name: 'Perfect Balance',
    affinity: 'MNK',
    level: 50,
    type: 'Ability',
    recast: 40,
    charges: 2,
    ogcd: true,
    icon: '000217',
  },

  {
    name: 'Form Shift',
    affinity: 'MNK',
    level: 52,
    type: 'Weaponskill',
    icon: '002536',
  },

  {
    name: 'The Forbidden Chakra',
    affinity: 'MNK',
    level: 54,
    type: 'Ability',
    recast: 1,
    ogcd: true,
    icon: '002535',
  },

  {
    name: 'Masterful Blitz',
    affinity: 'MNK',
    level: 60,
    type: 'Weaponskill',
    icon: '002976',
  },

  {
    name: 'Elixir Field',
    affinity: 'MNK',
    level: 60,
    type: 'Weaponskill',
    icon: '002533',
  },

  {
    name: 'Flint Strike',
    affinity: 'MNK',
    level: 60,
    type: 'Weaponskill',
    icon: '002548',
  },

  {
    name: 'Celestial Revolution',
    affinity: 'MNK',
    level: 60,
    type: 'Weaponskill',
    icon: '002977',
  },

  {
    name: 'Tornado Kick',
    affinity: 'MNK',
    level: 60,
    type: 'Weaponskill',
    icon: '002531',
  },

  {
    name: 'Riddle of Earth',
    affinity: 'MNK',
    level: 64,
    type: 'Ability',
    recast: 30,
    ogcd: true,
    icon: '002537',
  },

  {
    name: 'Riddle of Fire',
    affinity: 'MNK',
    level: 68,
    type: 'Ability',
    recast: 60,
    ogcd: true,
    icon: '002541',
  },

  {
    name: 'Brotherhood',
    affinity: 'MNK',
    level: 70,
    type: 'Ability',
    recast: 120,
    ogcd: true,
    icon: '002542',
  },

  {
    name: 'Riddle of Wind',
    affinity: 'MNK',
    level: 72,
    type: 'Ability',
    recast: 90,
    ogcd: true,
    icon: '002978',
  },

  {
    name: 'Enlightenment',
    affinity: 'MNK',
    level: 74,
    type: 'Ability',
    recast: 1,
    ogcd: true,
    icon: '002545',
  },

  {
    name: 'Anatman', // Maybe it'll eventually be useful
    affinity: 'MNK',
    level: 78,
    type: 'Ability',
    recast: 60,
    ogcd: true,
    icon: '002546',
  },

  {
    name: 'Six-sided Star',
    affinity: 'MNK',
    level: 80,
    type: 'Weaponskill',
    recast: 4,
    icon: '002547',
  },

  {
    name: 'Shadow of the Destroyer',
    affinity: 'MNK',
    level: 82,
    type: 'Weaponskill',
    icon: '002979',
  },

  {
    name: 'Rising Phoenix',
    affinity: 'MNK',
    level: 86,
    type: 'Weaponskill',
    icon: '002980',
  },

  {
    name: 'Phantom Rush',
    affinity: 'MNK',
    level: 90,
    type: 'Weaponskill',
    icon: '002981',
  },

  // NIN

  {
    name: 'Spinning Edge',
    affinity: 'NIN',
    type: 'Weaponskill',
    level: 1,
    targetCount: 1,
    breaksCombo: true,
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
    targetCount: 1,
    breaksCombo: true,
    icon: '000602',
  },

  {
    name: 'Hide',
    affinity: 'NIN',
    recast: 20,
    level: 10,
    statusName: 'Hide',
    ogcd: true, // TODO: Check... might be practically GCD action
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
    level: 15,
    recast: 120,
    ogcd: true,
    icon: '000613',
  },

  {
    name: 'Trick Attack',
    affinity: 'NIN',
    level: 18,
    recast: 60,
    // statusName: 'Trick Attack', // "self buff"
    ogcd: true,
    icon: '000618',
  },

  {
    name: 'Aeolian Edge',
    affinity: 'NIN',
    type: 'Weaponskill',
    level: 26,
    comboAction: 'Gust Slash',
    targetCount: 1,
    breaksCombo: true,
    icon: '000605',
  },

  {
    name: 'Death Blossom',
    affinity: 'NIN',
    type: 'Weaponskill',
    level: 38,
    targetCount: 3,
    breaksCombo: true,
    icon: '000615',
  },

  {
    name: 'Assassinate',
    affinity: 'NIN',
    level: 40,
    recast: 60,
    ogcd: true,
    icon: '000612',
  },

  {
    name: 'Kassatsu',
    affinity: 'NIN',
    level: 50,
    recast: 60,
    statusName: 'Kassatsu',
    ogcd: true,
    icon: '002906',
  },

  {
    name: 'Hakke Mujinsatsu',
    affinity: 'NIN',
    type: 'Weaponskill',
    level: 52,
    comboAction: 'Death Blossom',
    huton: 10,
    targetCount: 3,
    breaksCombo: true,
    icon: '002923',
  },

  {
    name: 'Armor Crush',
    affinity: 'NIN',
    type: 'Weaponskill',
    level: 54,
    comboAction: 'Gust Slash',
    huton: 30,
    targetCount: 1,
    breaksCombo: true,
    icon: '002915',
  },

  {
    name: 'Dream Within a Dream',
    affinity: 'NIN',
    recast: 60,
    level: 56,
    ogcd: true,
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
    ogcd: true,
    icon: '002920',
  },

  {
    name: 'Bhavacakra',
    affinity: 'NIN',
    recast: 1,
    level: 68,
    ninkiCost: 50,
    ogcd: true,
    icon: '002921',
  },

  {
    name: 'Ten Chi Jin',
    affinity: 'NIN',
    recast: 120,
    level: 70,
    statusName: 'Ten Chi Jin',
    ogcd: true, // Might be practically GCD?
    icon: '002922',
  },

  {
    name: 'Meisui',
    affinity: 'NIN',
    recast: 120,
    level: 72,
    ninki: 50,
    statusName: 'Meisui',
    ogcd: true,
    icon: '002924',
  },

  {
    name: 'Bunshin',
    affinity: 'NIN',
    recast: 90,
    level: 80,
    statusName: 'Bunshin',
    ninkiCost: 50,
    ogcd: true,
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
    statusName: 'Fleeting Raiju Ready',
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
    targetCount: 3,
    icon: '002908',
  },

  {
    name: 'Raiton',
    affinity: 'NIN',
    type: 'Ninjutsu',
    recast: 1.5,
    level: 35,
    targetCount: 1,
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
    statusName: 'Doton',
    icon: '002911',
  },

  {
    name: 'Suiton',
    affinity: 'NIN',
    type: 'Ninjutsu',
    recast: 1.5,
    level: 45,
    statusName: 'Suiton',
    icon: '002913',
  },

  {
    name: 'Goka Mekkyaku',
    affinity: 'NIN',
    type: 'Ninjutsu',
    recast: 1.5,
    level: 76,
    targetCount: 3,
    icon: '002925',
  },

  {
    name: 'Hyosho Ranryu',
    affinity: 'NIN',
    type: 'Ninjutsu',
    recast: 1.5,
    level: 76,
    targetCount: 1,
    icon: '002926',
  },

  // PLD

  {
    name: 'Fast Blade',
    affinity: 'PLD',
    type: 'Weaponskill',
    level: 1,
    breaksCombo: true,
    icon: '',
  },

  {
    name: 'Riot Blade',
    affinity: 'PLD',
    type: 'Weaponskill',
    level: 4,
    breaksCombo: true,
    icon: '',
  },

  // RDM

  {
    name: 'Riposte',
    affinity: 'RDM',
    level: 1,
    type: 'Weaponskill',
    breaksCombo: true,
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
    breaksCombo: true,
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
    accelerationSpell: true,
    breaksCombo: true,
    icon: '003203',
  },

  {
    name: 'Corps-a-corps',
    affinity: 'RDM',
    level: 6,
    recast: 35,
    ogcd: true,
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
    accelerationSpell: true,
    breaksCombo: true,
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
    accelerationSpell: true,
    breaksCombo: true,
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
    breaksCombo: true,
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
    breaksCombo: true,
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
    breaksCombo: true,
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
    breaksCombo: true,
    icon: '003209',
  },

  // {
  //   name: 'Zwerchhau',
  //   affinity: 'RDM',
  //   level: 35,
  //   type: 'Weaponskill',
  //   breaksCombo: true,
  //   icon: '',
  // },

  {
    name: 'Displacement',
    affinity: 'RDM',
    level: 40,
    recast: 35,
    charges: 2,
    ogcd: true,
    icon: '003211',
  },

  {
    name: 'Engagement',
    affinity: 'RDM',
    level: 40,
    recast: 35,
    charges: 2,
    ogcd: true,
    icon: '003231',
  },

  {
    name: 'Fleche',
    affinity: 'RDM',
    level: 45,
    recast: 25,
    ogcd: true,
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
    ogcd: true,
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
    breaksCombo: true,
    icon: '',
  },

  {
    name: 'Contre Sixte',
    affinity: 'RDM',
    level: 56,
    recast: 35,
    ogcd: true,
    icon: '003217',
  },

  {
    name: 'Embolden',
    affinity: 'RDM',
    level: 58,
    recast: 120,
    status: 'Embolden',
    ogcd: true,
    icon: '003218',
  },

  {
    name: 'Manafication',
    affinity: 'RDM',
    level: 60,
    recast: 120,
    ogcd: true,
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
    breaksCombo: true,
    icon: '003220',
  },

  {
    name: 'Verraise',
    affinity: 'RDM',
    level: 64,
    type: 'Spell',
    cast: 10,
    mpCost: 2400,
    breaksCombo: true,
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
    accelerationSpell: true,
    breaksCombo: true,
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
    breaksCombo: true,
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
    breaksCombo: true,
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
    breaksCombo: true,
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
    accelerationSpell: true,
    breaksCombo: true,
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
    accelerationSpell: true,
    breaksCombo: true,
    icon: '003236',
  },

  {
    name: 'Magick Barrier',
    affinity: 'RDM',
    level: 86,
    recast: 120,
    ogcd: true,
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
    breaksCombo: true,
    icon: '003238',
  },

  {
    name: 'Enchanted Riposte',
    affinity: 'RDM',
    level: 1,
    type: 'Weaponskill',
    recast: 1.5,
    manaCost: 20,
    breaksCombo: true,
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
    breaksCombo: true,
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
    breaksCombo: true,
    icon: '003227',
  },

  {
    name: 'Enchanted Moulinet',
    affinity: 'RDM',
    level: 52,
    type: 'Weaponskill',
    recast: 1.5,
    manaCost: 20,
    breaksCombo: true,
    icon: '003228',
  },

  {
    name: 'Enchanted Reprise',
    affinity: 'RDM',
    level: 76,
    type: 'Weaponskill',
    recast: 2.5, // Not modified by spell speed
    manaCost: 5,
    breaksCombo: true,
    icon: '003232',
  },

  // RPR

  {
    name: 'Slice',
    affinity: 'RPR',
    level: 1,
    type: 'Weaponskill',
    breaksCombo: true,
    icon: '003601',
  },

  {
    name: 'Waxing Slice',
    affinity: 'RPR',
    level: 5,
    type: 'Weaponskill',
    breaksCombo: true,
    comboAction: 'Slice',
    icon: '003602',
  },

  {
    name: 'Shadow of Death',
    affinity: 'RPR',
    level: 10,
    type: 'Weaponskill',
    icon: '003606',
    // Not sure how to model this:
    // Additional Effect: Increases Soul Gauge by 10 if target is KO'd before effect expires
  },

  {
    name: 'Harpe',
    affinity: 'RPR',
    level: 15,
    type: 'Spell',
    cast: 1.3,
    icon: '003614',
  },

  {
    name: 'Hell\'s Ingress',
    affinity: 'RPR',
    level: 20,
    recast: 20,
    ogcd: true,
    icon: '',
  },

  {
    name: 'Hell\'s Egress',
    affinity: 'RPR',
    level: 20,
    recast: 20,
    ogcd: true,
    icon: '',
  },

  {
    name: 'Spinning Scythe',
    affinity: 'RPR',
    level: 25,
    type: 'Weaponskill',
    breaksCombo: true,
    icon: '003604',
  },

  {
    name: 'Infernal Slice',
    affinity: 'RPR',
    level: 30,
    type: 'Weaponskill',
    breaksCombo: true,
    comboAction: 'Waxing Slice',
    icon: '003603',
  },

  {
    name: 'Whorl of Death',
    affinity: 'RPR',
    level: 35,
    type: 'Weaponskill',
    icon: '003607',
  },

  {
    name: 'Arcane Crest',
    affinity: 'RPR',
    level: 40,
    recast: 30,
    ogcd: true,
    icon: '',
  },

  {
    name: 'Nightmare Scythe',
    affinity: 'RPR',
    level: 45,
    type: 'Weaponskill',
    breaksCombo: true,
    comboAction: 'Spinning Scythe',
    icon: '003605',
  },

  {
    name: 'Blood Stalk',
    affinity: 'RPR',
    level: 50,
    recast: 1,
    ogcd: true,
    icon: '003617',
  },

  {
    name: 'Grim Swathe',
    affinity: 'RPR',
    level: 55,
    recast: 1,
    ogcd: true,
    icon: '003620',
  },

  {
    name: 'Soul Slice',
    affinity: 'RPR',
    level: 60,
    type: 'Weaponskill',
    recast: 30,
    icon: '003608',
  },

  {
    name: 'Soul Scythe',
    affinity: 'RPR',
    level: 65,
    type: 'Weaponskill',
    recast: 30,
    icon: '003609',
  },

  {
    name: 'Gibbet',
    affinity: 'RPR',
    level: 70,
    type: 'Weaponskill',
    icon: '003610',
  },

  {
    name: 'Gallows',
    affinity: 'RPR',
    level: 70,
    type: 'Weaponskill',
    icon: '003611',
  },

  {
    name: 'Guillotine',
    affinity: 'RPR',
    level: 70,
    type: 'Weaponskill',
    icon: '003612',
  },

  {
    name: 'Unveiled Gibbet',
    affinity: 'RPR',
    level: 70,
    recast: 1,
    ogcd: true,
    icon: '003618',
  },

  {
    name: 'Unveiled Gallows',
    affinity: 'RPR',
    level: 70,
    recast: 1,
    ogcd: true,
    icon: '003619',
  },

  {
    name: 'Arcane Circle',
    affinity: 'RPR',
    level: 72,
    recast: 120,
    ogcd: true,
    icon: '003633',
  },

  {
    name: 'Regress',
    affinity: 'RPR',
    level: 74,
    recast: 10,
    ogcd: true,
    icon: '',
  },

  {
    name: 'Gluttony',
    affinity: 'RPR',
    level: 76,
    recast: 60,
    ogcd: true,
    icon: '003621',
  },

  {
    name: 'Enshroud',
    affinity: 'RPR',
    level: 80,
    recast: 15,
    ogcd: true,
    icon: '003622',
  },

  {
    name: 'Void Reaping',
    affinity: 'RPR',
    level: 80,
    type: 'Weaponskill',
    icon: '003623',
  },

  {
    name: 'Cross Reaping',
    affinity: 'RPR',
    level: 80,
    type: 'Weaponskill',
    icon: '003624',
  },

  {
    name: 'Grim Reaping',
    affinity: 'RPR',
    level: 80,
    type: 'Weaponskill',
    icon: '003625',
  },

  {
    name: 'Soulsow',
    affinity: 'RPR',
    level: 82,
    type: 'Spell',
    cast: 5,
    icon: '003615',
  },

  {
    name: 'Harvest Moon',
    affinity: 'RPR',
    level: 82,
    type: 'Spell',
    icon: '003616',
  },

  {
    name: 'Lemure\'s Slice',
    affinity: 'RPR',
    level: 86,
    recast: 1,
    icon: '003627',
  },

  {
    name: 'Lemure\'s Scythe',
    affinity: 'RPR',
    level: 86,
    recast: 1,
    icon: '003628',
  },

  {
    name: 'Plentiful Harvest',
    affinity: 'RPR',
    level: 88,
    type: 'Weaponskill',
    icon: '003613',
  },

  {
    name: 'Communio',
    affinity: 'RPR',
    level: 90,
    type: 'Spell',
    cast: 1.3,
    icon: '003626',
  },

  // SAM

  {
    name: 'Hakaze',
    affinity: 'SAM',
    level: 1,
    type: 'Weaponskill',
    breaksCombo: true,
    icon: '003151',
  },

  {
    name: 'Jinpu',
    affinity: 'SAM',
    level: 4,
    type: 'Weaponskill',
    comboAction: 'Hakaze',
    statusName: 'Fugetsu',
    breaksCombo: true,
    icon: '003152',
  },

  {
    name: 'Enpi',
    affinity: 'SAM',
    level: 15,
    type: 'Weaponskill',
    icon: '003155',
  },

  {
    name: 'Shifu',
    affinity: 'SAM',
    level: 18,
    type: 'Weaponskill',
    comboAction: 'Hakaze',
    statusName: 'Fuka',
    breaksCombo: true,
    icon: '003156',
  },

  {
    name: 'Fuga',
    affinity: 'SAM',
    level: 26,
    type: 'Weaponskill',
    targetCount: 3,
    breaksCombo: true,
    icon: '003157',
  },

  {
    name: 'Gekko',
    affinity: 'SAM',
    level: 30,
    type: 'Weaponskill',
    comboAction: 'Jinpu',
    sen: 'Getsu',
    breaksCombo: true,
    icon: '003158',
  },

  {
    name: 'Iaijutsu',
    affinity: 'SAM',
    level: 30,
    type: 'Iaijutsu',
    cast: 1.8,
    icon: '003159',
  },

  {
    name: 'Mangetsu',
    affinity: 'SAM',
    level: 35,
    type: 'Weaponskill',
    comboAction: 'Fuga',
    statusName: 'Fugetsu',
    sen: 'Getsu',
    targetCount: 3,
    breaksCombo: true,
    icon: '003163',
  },

  {
    name: 'Kasha',
    affinity: 'SAM',
    level: 40,
    type: 'Weaponskill',
    comboAction: 'Shifu',
    sen: 'Ka',
    breaksCombo: true,
    icon: '003164',
  },

  {
    name: 'Oka',
    affinity: 'SAM',
    level: 45,
    type: 'Weaponskill',
    comboAction: 'Fuga',
    statusName: 'Fuka',
    sen: 'Ka',
    targetCount: 3,
    breaksCombo: true,
    icon: '003165',
  },

  {
    name: 'Yukikaze',
    affinity: 'SAM',
    level: 50,
    type: 'Weaponskill',
    comboAction: 'Hakaze',
    sen: 'Setsu',
    breaksCombo: true,
    icon: '003166',
  },

  {
    name: 'Meikyo Shisui',
    affinity: 'SAM',
    level: 50,
    recast: 55,
    statusName: 'Meikyo Shisui',
    statusDuration: 15,
    statusStacks: 3,
    icon: '003167',
  },

  {
    name: 'Hissatsu: Kaiten',
    affinity: 'SAM',
    level: 52,
    recast: 1,
    statusName: 'Kaiten',
    kenkiCost: 20,
    icon: '003168',
  },

  {
    name: 'Hissatsu: Gyoten',
    affinity: 'SAM',
    level: 54,
    recast: 10,
    kenkiCost: 10,
    icon: '003169',
  },

  {
    name: 'Hissatsu: Yaten',
    affinity: 'SAM',
    level: 56,
    recast: 10,
    statusName: 'Enhanced Enpi',
    statusDuration: 15,
    kenkiCost: 10,
    icon: '003170',
  },

  {
    name: 'Meditate',
    affinity: 'SAM',
    level: 60,
    recast: 60,
    statusName: 'Meditate',
    statusDuration: 15,
    icon: '003172',
  },

  {
    name: 'Hissatsu: Shinten',
    affinity: 'SAM',
    level: 62,
    recast: 1,
    kenkiCost: 25,
    icon: '003173',
  },

  {
    name: 'Hissatsu: Kyuten',
    affinity: 'SAM',
    level: 64,
    recast: 1,
    kenkiCost: 25,
    targetCount: 3,
    icon: '003174',
  },

  {
    name: 'Hagakure',
    affinity: 'SAM',
    level: 68,
    recast: 5,
    icon: '003176',
  },

  {
    name: 'Ikishoten',
    affinity: 'SAM',
    level: 68,
    recast: 120,
    kenki: 50,
    icon: '003179',
  },

  {
    name: 'Hissatsu: Guren',
    affinity: 'SAM',
    level: 70,
    recast: 120,
    kenkiCost: 25,
    icon: '003177',
  },

  {
    name: 'Hissatsu: Senei',
    affinity: 'SAM',
    level: 72,
    recast: 120,
    kenkiCost: 25,
    icon: '003178',
  },

  {
    name: 'Tsubame-gaeshi',
    affinity: 'SAM',
    level: 76,
    recast: 60,
    icon: '003180',
  },

  {
    name: 'Shoha',
    affinity: 'SAM',
    level: 80,
    recast: 15,
    meditationStackCost: 3,
    icon: '003184',
  },

  {
    name: 'Shoha II',
    affinity: 'SAM',
    level: 82,
    recast: 15,
    meditationStackCost: 3,
    targetCount: 3,
    icon: '003185',
  },

  {
    name: 'Fuko',
    affinity: 'SAM',
    level: 86,
    type: 'Weaponskill',
    targetCount: 3,
    breaksCombo: true,
    icon: '003189',
  },

  {
    name: 'Ogi Namikiri',
    affinity: 'SAM',
    level: 90,
    type: 'Iaijutsu',
    cast: 1.3,
    icon: '003187',
  },

  {
    name: 'Higanbana',
    affinity: 'SAM',
    level: 30,
    type: 'Iaijutsu',
    cast: 1.8,
    statusName: 'Higanbana',
    statusTarget: 'target',
    icon: '003160',
  },

  {
    name: 'Tenka Goken',
    affinity: 'SAM',
    level: 40,
    type: 'Iaijutsu',
    cast: 1.8,
    icon: '003161',
  },

  {
    name: 'Midare Setsugekka',
    affinity: 'SAM',
    level: 50,
    type: 'Iaijutsu',
    cast: 1.8,
    icon: '003162',
  },

  // {
  //   name: 'Kaeshi: Higanbana',
  //   affinity: 'SAM',
  //   level: 76,
  //   type: 'Tsubame-gaeshi',
  //   icon: '003181',
  // },

  {
    name: 'Kaeshi: Goken',
    affinity: 'SAM',
    level: 76,
    type: 'Tsubame-gaeshi',
    icon: '003182',
  },

  {
    name: 'Kaeshi: Setsugekka',
    affinity: 'SAM',
    level: 76,
    type: 'Tsubame-gaeshi',
    icon: '003183',
  },

  {
    name: 'Kaeshi: Namikiri',
    affinity: 'SAM',
    level: 90,
    type: 'Weaponskill',
    icon: '003188',
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

  // Warrior

  {
    name: 'Heavy Swing',
    affinity: 'WAR',
    level: 1,
    type: 'Weaponskill',
    breaksCombo: true,
    icon: '000260',
  },

  {
    name: 'Maim',
    affinity: 'WAR',
    level: 4,
    type: 'Weaponskill',
    breaksCombo: true,
    comboAction: 'Heavy Swing',
    icon: '000255',
  },

  {
    name: 'Berserk',
    affinity: 'WAR',
    level: 6,
    recast: 60,
    icon: '000259',
  },

  {
    name: 'Overpower',
    affinity: 'WAR',
    level: 10,
    type: 'Weaponskill',
    breaksCombo: true,
    icon: '000254',
  },

  {
    name: 'Defiance',
    affinity: 'WAR',
    level: 10,
    icon: '002551',
  },

  {
    name: 'Tomahawk',
    affinity: 'WAR',
    level: 15,
    type: 'Weaponskill',
    icon: '000261',
  },

  {
    name: 'Storm\'s Path',
    affinity: 'WAR',
    level: 26,
    type: 'Weaponskill',
    breaksCombo: true,
    comboAction: 'Maim',
    icon: '000258',
  },

  {
    name: 'Thrill of Battle',
    affinity: 'WAR',
    level: 30,
    recast: 90,
    icon: '000263',
  },

  {
    name: 'Inner Beast',
    affinity: 'WAR',
    level: 35,
    type: 'Weaponskill',
    icon: '002553',
  },

  {
    name: 'Vengeance',
    affinity: 'WAR',
    level: 38,
    recast: 120,
    icon: '000267',
  },

  {
    name: 'Mythril Tempest',
    affinity: 'WAR',
    level: 40,
    type: 'Weaponskill',
    breaksCombo: true,
    comboAction: 'Overpower',
    icon: '002565',
  },

  {
    name: 'Holmgang',
    affinity: 'WAR',
    level: 42,
    recast: 240,
    icon: '000266',
  },

  {
    name: 'Steel Cyclone',
    affinity: 'WAR',
    level: 45,
    type: 'Weaponskill',
    icon: '002552',
  },

  {
    name: 'Storm\'s Eye',
    affinity: 'WAR',
    level: 50,
    type: 'Weaponskill',
    breaksCombo: true,
    comboAction: 'Maim',
    icon: '000264',
  },

  {
    name: 'Infuriate',
    affinity: 'WAR',
    level: 50,
    recast: 60,
    icon: '002555',
  },

  {
    name: 'Fell Cleave',
    affinity: 'WAR',
    level: 54,
    type: 'Weaponskill',
    icon: '002557',
  },

  {
    name: 'Raw Intuition',
    affinity: 'WAR',
    level: 56,
    recast: 25,
    icon: '002559',
  },

  {
    name: 'Equillibrium',
    affinity: 'WAR',
    level: 58,
    recast: 60,
    icon: '002560',
  },

  {
    name: 'Decimate',
    affinity: 'WAR',
    level: 60,
    type: 'Weaponskill',
    icon: '002558',
  },

  {
    name: 'Onslaught',
    affinity: 'WAR',
    level: 62,
    recast: 30,
    icon: '002561',
  },

  {
    name: 'Upheaval',
    affinity: 'WAR',
    level: 64,
    recast: 30,
    icon: '002562',
  },

  {
    name: 'Shake It Off',
    affinity: 'WAR',
    level: 68,
    recast: 90,
    icon: '002563',
  },

  {
    name: 'Inner Release',
    affinity: 'WAR',
    level: 70,
    recast: 60,
    icon: '002564',
  },

  {
    name: 'Chaotic Cyclone',
    affinity: 'WAR',
    level: 72,
    type: 'Weaponskill',
    icon: '002566',
  },

  {
    name: 'Nascent Flash',
    affinity: 'WAR',
    level: 76,
    recast: 25,
    icon: '002567',
  },

  {
    name: 'Inner Chaos',
    affinity: 'WAR',
    level: 80,
    type: 'Weaponskill',
    icon: '002568',
  },

  {
    name: 'Bloodwhetting',
    affinity: 'WAR',
    level: 82,
    recast: 25,
    icon: '002569',
  },

  {
    name: 'Orogeny',
    affinity: 'WAR',
    level: 86,
    recast: 30,
    icon: '002570',
  },

  {
    name: 'Primal Rend',
    affinity: 'WAR',
    level: 90,
    type: 'Weaponskill',
    icon: '002571',
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
  // { name: 'Combo', duration: 15 }, // Might be easier to put this in playerData later

  { name: 'Acceleration', duration: 20 },
  { name: 'Arcane Circle', duration: 20 },
  { name: 'Berserk', duration: 15, stacks: 3 },
  { name: 'Bloodbath', duration: 20 },
  { name: 'Bloodsown Circle', duration: 6 },
  { name: 'Brotherhood', duration: 15 },
  { name: 'Bunshin', duration: 30, stacks: 5 },
  { name: 'Circle of Sacrifice', duration: 5 },
  { name: 'Coeurl Form', duration: 30 },
  { name: 'Demolish', duration: 18 },
  { name: 'Death\'s Design', duration: 30 },
  { name: 'Disciplined Fist', duration: 15 },
  { name: 'Doton', duration: 24 },
  { name: 'Dualcast', duration: 15 },
  { name: 'Embolden', duration: 20 },
  { name: 'Enhanced Cross Reaping', duration: 30 },
  { name: 'Enhanced Gallows', duration: 60 },
  { name: 'Enhanced Gibbet', duration: 60 },
  { name: 'Enhanced Harpe', duration: 15 },
  { name: 'Enhanced Void Reaping', duration: 30 },
  { name: 'Enshrouded', duration: 30 },
  { name: 'Feint', duration: 10 },
  { name: 'Formless Fist', duration: 30 },
  { name: 'Fugetsu', duration: 40 },
  { name: 'Fuka', duration: 40 },
  { name: 'Higanbana', duration: 60 },
  { name: 'Hidden', duration: 9999 },
  { name: 'Huton', duration: 60 },
  { name: 'Immortal Sacrifice', duration: 30 },
  { name: 'Inner Release', duration: 15, stacks: 3 },
  { name: 'Kaiten', duration: 10 },
  { name: 'Kassatsu', duration: 15 },
  { name: 'Leaden Fist', duration: 30 },
  { name: 'Lucid Dreaming', duration: 21 },
  { name: 'Manafication', duration: 15 },
  { name: 'Meditative Brotherhood', duration: 15 },
  { name: 'Meikyo Shisui', duration: 15, stacks: 3 },
  { name: 'Meisui', duration: 30 },
  { name: 'Mudra', duration: 6 },
  { name: 'Nascent Chaos', duration: 30 },
  { name: 'Ogi Namikiri Ready', duration: 30 },
  { name: 'Opo-opo Form', duration: 30 },
  { name: 'Perfect Balance', duration: 30, stacks: 3 },
  { name: 'Phantom Kamaitachi Ready', duration: 9999 },
  { name: 'Primal Rend Ready', duration: 30 },
  {
    name: 'Raiju Ready', duration: 15, stacks: 1, maxStacks: 3,
  },
  { name: 'Raptor Form', duration: 30 },
  { name: 'Riddle of Fire', duration: 20 },
  { name: 'Riddle of Wind', duration: 15 },
  { name: 'Soul Reaver', duration: 30 },
  { name: 'Soulsow', duration: 9999 },
  { name: 'Surging Tempest', duration: 30 },
  { name: 'Suiton', duration: 20 },
  { name: 'Swiftcast', duration: 10 },
  { name: 'Ten Chi Jin', duration: 6 },
  { name: 'Trick Attack', duration: 15 }, // Technically not a self status effect - easier set as one
  { name: 'True North', duration: 10 },
  { name: 'Verfire Ready', duration: 30 },
  { name: 'Verstone Ready', duration: 30 },
  { name: 'Vulnerability Up', duration: 0 },
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
