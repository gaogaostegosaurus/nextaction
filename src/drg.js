
const drgNextGCD = ({
  comboStep,
  disembowelStatus,
  chaosthrustStatus,
  sharperfangandclawStatus,
  enhancedwheelingthrustStatus,
  raidenthrustreadyStatus,
} = {}) => {
  const gcd = player.gcd;

  let fullthrustComboPotency = 210;
  if (player.level >= 76) {
    fullthrustComboPotency = (290 + 350 + 530 + 360 + 460 + 40) / 5;
  } else if (player.level >= 64) {
    fullthrustComboPotency = (210 + 310 + 530 + 360 + 460) / 5;
  } else if (player.level >= 56) {
    fullthrustComboPotency = (210 + 310 + 530 + 360) / 4;
  } else if (player.level >= 26) {
    fullthrustComboPotency = (210 + 310 + 530) / 3;
  } else if (player.level >= 4) {
    fullthrustComboPotency = (210 + 310) / 2;
  }

  let chaosthrustComboPotency = 210;
  if (player.level >= 76) {
    chaosthrustComboPotency = (290 + 320 + 330 + 45 * Math.floor(chaosthrustStatus / 3000)
    + 360 + 460 + 40) / 5;
  } else if (player.level >= 64) {
    chaosthrustComboPotency = (210 + 270 + 330 + 45 * Math.floor(chaosthrustStatus / 3000)
    + 360 + 460) / 5;
  } else if (player.level >= 58) {
    chaosthrustComboPotency = (210 + 270 + 330
    + 45 * Math.floor((chaosthrustStatus - player.gcd) / 3000)
    + 360) / 4;
  } else if (player.level >= 50) {
    chaosthrustComboPotency = (210 + 270 + 330 + 45 * Math.floor(chaosthrustStatus / 3000)) / 3;
  } else if (player.level >= 18) {
    chaosthrustComboPotency = (210 + 270) / 2;
  }

  /* Add potency bonus for Disembowel */
  if ((player.level >= 64 && disembowelStatus < gcd * 5)
  || (player.level >= 56 && disembowelStatus < gcd * 4)
  || (player.level >= 26 && disembowelStatus < gcd * 3)
  || (player.level >= 18 && disembowelStatus < gcd * 2)) {
    chaosthrustComboPotency += fullthrustComboPotency * 0.1;
  }

  let coerthantormentComboPotency = 0;
  if (player.level >= 72) {
    coerthantormentComboPotency = ((170 + 200 + 230) / 3) * player.targetCount;
  } else if (player.level >= 62) {
    coerthantormentComboPotency = ((170 + 200) / 2) * player.targetCount;
  } else if (player.level >= 40) {
    coerthantormentComboPotency = 170 * player.targetCount;
  }

  if (player.level >= 72 && comboStep === 'Sonic Break') {
    return 'Coerthan Torment';
  } else if (player.level >= 62 && comboStep === 'Doom Spike') {
    return 'Sonic Break';
  } else if (coerthantormentComboPotency
    > Math.max(fullthrustComboPotency, chaosthrustComboPotency)) {
    return 'Doom Spike'; /* Breaks combo for AoE */
  } else if (sharperfangandclawStatus > 0) {
    return 'Fang And Claw';
  } else if (enhancedwheelingthrustStatus > 0) {
    return 'Wheeling Thrust';
  } else if (player.level >= 50 && comboStep === 'Disembowel') {
    return 'Chaos Thrust';
  } else if (player.level >= 26 && comboStep === 'Vorpal Thrust') {
    return 'Full Thrust';
  } else if (player.level >= 18 && comboStep === 'True Thrust'
  && chaosthrustComboPotency > fullthrustComboPotency) {
    return 'Disembowel';
  } else if (player.level >= 4 && comboStep === 'True Thrust') {
    return 'Vorpal Thrust';
  } else if (raidenthrustreadyStatus > 0) {
    return 'Raiden Thrust';
  } return 'True Thrust';
};

const drgNextOGCD = ({
  comboStep,
  jumpRecast,
  lancechargeRecast,
  spineshatterdiveRecast,
  dragonfirediveRecast,
  battlelitanyRecast,
  bloodofthedragonRecast,
  geirskogulRecast,
  dragonsightRecast,
  lifesurgeRecast,
  nastrondRecast,
  stardiverRecast,
  bloodofthedragonStatus,
  lifeofthedragonStatus,
  divereadyStatus,
  gaze,
} = {}) => {
  const damageBuffAfter = ['True Thrust', 'Raiden Thrust', 'Vorpal Thrust', 'Disembowel'];

  const dragonfiredivePotency = 380 * player.targetCount;
  const geirskogulPotency = 300 * player.targetCount;

  let jumpPotency = 310;
  if (player.level >= 74) { jumpPotency = 400; }
  if (bloodofthedragonStatus > 0) { jumpPotency *= 1.3; }
  if (player.level >= 68) { jumpPotency += 300; }
  if (jumpRecast >= 0) { jumpPotency = 0; }

  let spineshatterdivePotency = 240;
  if (bloodofthedragonStatus > 0) { spineshatterdivePotency *= 1.3; }
  if (spineshatterdiveRecast >= 0) { spineshatterdivePotency = 0; }

  if (player.level >= 54 && bloodofthedragonStatus < 0 && bloodofthedragonRecast < 0) {
    return 'Blood Of The Dragon';
  } else if (lifeofthedragonStatus < 0 && nastrondRecast < 0) {
    return 'Nastrond';
  } else if (lifeofthedragonStatus < 0 && stardiverRecast < 0) {
    return 'Stardiver';
  } else if (player.level >= 26 && comboStep === 'Vorpal Thrust' && lifesurgeRecast < 0) {
    return 'Life Surge';
  } else if (player.level >= 66 && damageBuffAfter.includes(comboStep) && dragonsightRecast < 0) {
    return 'Dragon Sight';
  } else if (player.level >= 52 && damageBuffAfter.includes(comboStep)
  && battlelitanyRecast < 0) {
    return 'Battle Litany';
  } else if (player.level >= 30 && damageBuffAfter.includes(comboStep) && lancechargeRecast < 0) {
    return 'Lance Charge';
  } else if (player.level >= 50
  && dragonfiredivePotency > Math.max(jumpPotency, spineshatterdivePotency)
  && dragonfirediveRecast < 0) {
    return 'Dragonfire Dive';
  } else if (player.level >= 60
  && geirskogulPotency > Math.max(jumpPotency, spineshatterdivePotency) && geirskogulRecast < 0) {
    return 'Geirskogul';
  } else if (player.level >= 30 && jumpRecast < 0) {
    if (player.level >= 74) {
      return 'High Jump';
    } return 'Jump';
  } else if (player.level >= 45 && spineshatterdiveRecast < 0) {
    return 'Spineshatter Dive';
  } else if (divereadyStatus > 0 && gaze < 2) {
    return 'Mirage Dive';
  } else if (player.level >= 6 && player.level < 26 && lifesurgeRecast < 0) {
    return 'Life Surge';
  } return '';
};
