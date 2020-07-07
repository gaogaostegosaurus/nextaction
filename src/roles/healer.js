nextActionOverlay.onJobChange.healer = () => {
  const { recast } = nextActionOverlay;
  const { duration } = nextActionOverlay;
  recast.luciddreaming = 60000;
  recast.swiftcast = 60000;
  duration.swiftcast = 10000;
};
