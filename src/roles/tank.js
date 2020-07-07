nextActionOverlay.onJobChange.tank = () => {
  const { recast } = nextActionOverlay;
  const { duration } = nextActionOverlay;
  recast.rampart = 90000;
  duration.rampart = 20000;
  recast.lowblow = 25000;
  recast.provoke = 30000;
  recast.interject = 30000;
  recast.reprisal = 60000;
  recast.armslength = 120000;
  recast.shirk = 120000;
};
