nextActionOverlay.changedJob.meleeDPS = () => {
  const { recast } = nextActionOverlay;

  recast.secondwind = 120000;
  recast.lowblow = 25000;
  recast.bloodbath = 90000;
  recast.feint = 90000;
  recast.armslength = 120000;
  recast.truenorth = 45000;

  const { duration } = nextActionOverlay;

  duration.feint = 10000;
  duration.bloodbath = 20000;
  duration.armslength = 15000;
  duration.truenorth = 10000;

  const { icon } = nextActionOverlay;

  icon.secondwind = '000821';
  icon.armslength = '000822';
  icon.bloodbath = '000823';
  icon.lowblow = '000824';
  icon.feint = '000828';
  icon.truenorth = '000830';
};
