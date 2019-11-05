let priorityArray = [];
let actionArray = [];
let cooldownArray = [];
let countdownArrayA = [];
let countdownArrayB = [];

const removeAnimationTime = 1000;
let cooldownTracker = {}; // Holds timestamps for cooldowns
let effectTracker = {}; // Holds timestamps for statuses
let cooldowntime = {}; // Holds timestamps for cooldowns
let bufferTime = 0;

const timeout = {}; // For timeout variables
const interval = {};
const nextid = {}; // Store document id - location on page for icons, etc.
const countdownid = {};
const toggle = {}; // Toggley things
const count = {}; // County things?
let potency = {};
let previous = {};
let next = {};

count.targets = 1;
const countTargetsTime = 100; // Determines how many things multi-line attack hits

// Set up doms
//
// const dom = {};
// for (let x = 0; x < 30; x += 1) {
//   dom[`icondiv${x}`] = document.getElementById(`icondiv${x}`); // Container for all parts
//   dom[`iconimgdiv${x}`] = document.getElementById(`iconimgdiv${x}`); // Wraps icon and overlay (for animation)
//   dom[`iconimg${x}`] = document.getElementById(`iconimg${x}`); // src = icon
//   dom[`iconcountdown${x}`] = document.getElementById(`iconcountdown${x}`); // Countdown - separate from img
// }
// for (let x = 0; x < 40; x += 1) {
//   dom[`countdowndiv${x}`] = document.getElementById("countdowndiv" + x); // Countdown - separate from img
//   dom[`countdownimgdiv${x}`] = document.getElementById("countdownimgdiv" + x); // Countdown - separate from img
//   dom[`countdownimg${x}`] = document.getElementById("countdownimg" + x); // Countdown - separate from img
//   dom[`countdownbar${x}`] = document.getElementById("countdownbar" + x); // Countdown - separate from img
//   dom[`countdowntime${x}`] = document.getElementById("countdowntime" + x); // Countdown - separate from img
// }

let player = {};
let target = {};
let actionList = {};



const addIcon = ({
  name,
  img = name,
  effect = '',
} = {}) => {

  dom[`iconimg${nextid[name]}`].src = `icon/${icon[img]}.png`;
  dom[`icondiv${nextid[name]}`].className = `icondiv icon-add ${effect}`;
};

function addIconEffect({
  name,
  img = name,
  effect = "",
} = {}) {

  dom["icondiv" + nextid[name]].className = dom["icondiv" + nextid[name]].className + " " + effect;
}

function fadeIcon({name} = {}) {
  dom["icondiv" + nextid[name]].className = "icondiv icon-fade";
}

function removeIcon(name) {
  dom["icondiv" + nextid[name]].className = "icondiv icon-remove";
}



function clearTimers() {
  let property = "";
  for (property in timeout) {
    if (timeout.hasOwnProperty(property)) {
      clearTimeout(timeout[property]);
    }
  }
  for (property in interval) {
    if (interval.hasOwnProperty(property)) {
      clearInterval(interval[property]);
    }
  }
}

callOverlayHandler({ call: 'cactbotRequestState' });

// callOverlayHandler:
// accepts an object so you can add more parameters which will be passed to the C# code.
// i.e. a TTS call for Cactbot would look like this:
// callOverlayHandler({ call: "cactbotSay", text: "Hello World!" });.
