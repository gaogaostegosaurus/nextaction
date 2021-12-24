/* globals
  actionMatch
  currentPlayerData currentRecastArray currentStatusArray
  loopPlayerData:writable loopRecastArray:writable loopStatusArray:writable
  overlayArray:writable
  ninLoopGCDAction ninLoopOGCDAction ninLoopPlayerChanged
  rdmLoopGCDAction rdmLoopOGCDAction rdmLoopPlayerChanged
*/

let loopPlayerData = {}; let loopRecastArray = []; let loopStatusArray = [];

// Loop finds the next this many actions
const maxActions = 100;

// Just to make things easier on myself... maybe
// eslint-disable-next-line no-unused-vars
// const loopActionMatch = ({
//   logType,
//   actionName,
//   targetID,
// } = {}) => {
//   actionMatch({
//     logType,
//     actionName,
//     targetID,
//     playerData: loopPlayerData,
//     recastArray: loopRecastArray,
//     statusArray: loopStatusArray,
//     loop: true,
//   });
// };

const advanceLoopTime = ({
  time = 0, // In seconds
} = {}) => {
  // Modifies all time numbers for loops

  // Reduce recast and duration timestamps
  // eslint-disable-next-line no-param-reassign
  loopRecastArray.forEach((element) => { element.recast -= time * 1000; });
  // eslint-disable-next-line no-param-reassign
  loopStatusArray.forEach((element) => { element.duration -= time * 1000; });

  const { job } = loopPlayerData;

  // Reduce job-specific times
  if (job === 'NIN') {
    // TODO: Possibly call function to re-calculate GCDs if Huton is lost
    loopPlayerData.huton = Math.max(loopPlayerData.huton - time, 0);
  // } else if (job === 'SMN') {
  //   // TODO: Might need a "changed over to Bahamut/Phoenix" after 0 trance seconds
  //   loopPlayerData.tranceSeconds = Math.max(loopPlayerData.tranceSeconds - time, 0);
  //   loopPlayerData.attunementSeconds = Math.max(loopPlayerData.attunementSeconds - time, 0);
  }
};

// eslint-disable-next-line no-unused-vars
const startLoop = ({
  delay = 0, // Pass delay to cause OGCDs to be added first
  casting = '', // Pass casting to have first action still in progress
} = {}) => {
  // Main loop

  // Clear array for syncing later
  overlayArray = [];

  // Clone current object/arrays for looping
  // Some sort of deep clone is required due to being object/array of objects?
  // https://stackoverflow.com/questions/122102/what-is-the-most-efficient-way-to-deep-clone-an-object-in-javascript/122704#122704
  // For future reference: https://developer.mozilla.org/en-US/docs/Web/API/structuredClone
  loopPlayerData = JSON.parse(JSON.stringify(currentPlayerData));
  loopRecastArray = JSON.parse(JSON.stringify(currentRecastArray));
  loopStatusArray = JSON.parse(JSON.stringify(currentStatusArray));

  const { job } = loopPlayerData;

  let ogcdWindow = delay;

  if (casting) {
    // Begin loop with placing casted action
    // console.log(`Casting ${casting}`);
    const actionName = casting;
    overlayArray.push({ name: casting });
    loopActionMatch({ actionName });
    ogcdWindow = calculateDelay({
      actionName,
      playerData: loopPlayerData,
      recastArray: loopRecastArray,
      statusArray: loopStatusArray,
    });
  }

  while (overlayArray.length <= maxActions) {
    if (ogcdWindow === 0) {
      let actionName;

      // Call GCD Action functions
      if (job === 'NIN') {
        actionName = ninLoopGCDAction();
      } else if (job === 'RDM') {
        actionName = rdmLoopGCDAction();
      // } else if (job === 'SMN') {
      //   actionName = smnLoopGCDAction();
      }

      if (job === 'NIN' && Array.isArray(actionName)) {
        // eslint-disable-next-line no-loop-func
        for (let index = 0; index < actionName.length - 1; index += 1) {
          // Push Mudra - all but last entry

          overlayArray.push({ name: actionName[index] });
          actionMatch({
            actionName: actionName[index],
            playerData: loopPlayerData,
            recastArray: loopRecastArray,
            statusArray: loopStatusArray,
            loop: true,
          });
          // Advancing time for Mudras
          if (checkStatusDuration({ statusName: 'Ten Chi Jin', statusArray: loopStatusArray }) > 0) {
            advanceLoopTime({ time: 1 });
          } else {
            advanceLoopTime({ time: 0.5 });
          }
        }

        // Last entry (should be ninjutsu itself)
        overlayArray.push({ name: actionName[actionName.length - 1] });
        loopPlayerChanged({ actionName: actionName[actionName.length - 1] });

        addActionRecast({
          actionName: actionName[actionName.length - 1],
          recastArray: loopRecastArray,
        });

        actionMatch({
          actionName: actionName[actionName.length - 1],
          playerData: loopPlayerData,
          recastArray: loopRecastArray,
          statusArray: loopStatusArray,
          loop: true,
        });

        ogcdWindow = calculateDelay({
          actionName: actionName[actionName.length - 1],
          playerData: loopPlayerData,
          recastArray: loopRecastArray,
          statusArray: loopStatusArray,
        });
      } else {
        overlayArray.push({ name: actionName });
        setComboAction({
          actionName,
          playerData: loopPlayerData,
          statusArray: loopStatusArray,
        });
        loopPlayerChanged({ actionName });
        addActionRecast({ actionName, recastArray: loopRecastArray });
        actionMatch({
          actionName,
          playerData: loopPlayerData,
          recastArray: loopRecastArray,
          statusArray: loopStatusArray,
          loop: true,
        });
        ogcdWindow = calculateDelay({
          actionName,
          playerData: loopPlayerData,
          recastArray: loopRecastArray,
          statusArray: loopStatusArray,
        });
      }
      // Testing for errors here, comment out when ready?
      if (!ogcdWindow) { console.log(`startLoop: ${actionName} returned with no delay`); }
    }

    if (ogcdWindow > 0.1) {
      // Advance just a little bit
      advanceLoopTime({ time: 0.1 });
      ogcdWindow -= 0.1;

      let weaveCount = 1;
      const minimumWindow = 0.8;

      // Inner loop for OGCDs
      // Arbritrary minimum of 0.8, adjust as needed for new jobs I guess
      while (ogcdWindow >= minimumWindow) {
        // Find next OGCD
        let actionName;
        if (currentPlayerData.job === 'NIN') {
          actionName = ninLoopOGCDAction({ weaveCount });
        } else if (currentPlayerData.job === 'RDM') {
          actionName = rdmLoopOGCDAction({ weaveCount });
        }

        // Push into array
        if (actionName) {
          overlayArray.push({ name: actionName, ogcd: true });
          actionMatch({
            actionName,
            playerData: loopPlayerData,
            recastArray: loopRecastArray,
            statusArray: loopStatusArray,
            loop: true,
          });
          addActionRecast({ actionName, recastArray: loopRecastArray });
          loopPlayerChanged({ actionName });
        }

        // Increment for next weave (maximum 1 second)
        advanceLoopTime({ time: Math.min(ogcdWindow, 1) });
        ogcdWindow = Math.max(ogcdWindow - 1, 0);
        weaveCount += 1;
      }

      // Advance time and remove values if below minimum
      // Need this to catch funny increments
      if (ogcdWindow < minimumWindow) {
        advanceLoopTime({ time: ogcdWindow });
        ogcdWindow = 0;
      }
    }
  }
  syncOverlay();
};

// eslint-disable-next-line no-unused-vars
// const loopCalculateDelay = ({
//   actionName,
//   playerData = loopPlayerData,
//   recastArray = loopRecastArray,
//   statusArray = loopStatusArray,
// } = {}) => {
//   const delay = calculateDelay({
//     actionName, playerData, recastArray, statusArray,
//   });
//   return delay;
// };

// const loopSetComboAction = ({
//   actionName,
//   playerData = loopPlayerData,
//   statusArray = loopStatusArray,
// } = {}) => {
//   setComboAction({
//     actionName,
//     playerData,
//     statusArray,
//   });
// };

const loopPlayerChanged = ({
  actionName,
  playerData = loopPlayerData,
  statusArray = loopStatusArray,
} = {}) => {
  const { job } = playerData;
  if (job === 'NIN') {
    ninLoopPlayerChanged({ actionName });
    // console.log(`loopPlayerData huton|ninki: ${playerData.huton}|${playerData.ninki}`);
  }
  // else if (job === 'RDM') { rdmLoopPlayerChanged({ actionName });}
};
