nextActionOverlay.onJobChange.tank = () => {
  const { recast } = nextActionOverlay;
  const { duration } = nextActionOverlay;
  const { icon } = nextActionOverlay;

  recast.rampart = 90000;
  recast.lowblow = 25000;
  recast.provoke = 30000;
  recast.interject = 30000;
  recast.reprisal = 60000;
  recast.armslength = 120000;
  recast.shirk = 120000;

  duration.rampart = 20000;
  duration.reprisal = 10000;

  icon.rampart = '000801';
  icon.lowblow = '000802';
  icon.provoke = '000803';
  icon.reprisal = '000806';
  icon.interject = '000808';
  icon.shirk = '000810';
};
