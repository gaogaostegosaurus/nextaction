export function addCountdownBar({
  name,
  time = recast[name],
  oncomplete = "showText",
  text = "READY",
} = {}) {

  dom["countdownimg" + countdownid[name]].src = "icon/" + icon[name] + ".png";

  // Add or remove icons
  if (text == "addIcon"
  && time <= 1000) {
    dom["countdowndiv" + countdownid[name]].className = "countdowndiv countdown-remove";
  }
  if (text == "removeCountdownBar"
  && time <= 0) {
    dom["countdowndiv" + countdownid[name]].className = "countdowndiv countdown-remove";
  }
  else {
    dom["countdowndiv" + countdownid[name]].className = "countdowndiv countdown-add";
  }

  // Style bars 20 to 39 to set apart from "personal" bars
  if (countdownid[name] >= 20) {
    dom["countdowndiv" + countdownid[name]].style.opacity = "0.5";
    // dom["countdownbar" + countdownid[name]].style.color = "green";
  }

  clearInterval(interval[name]);

  // Countdown animation function starts here
  interval[name] = setInterval(() => {

    // Show icons a little bit early
    if (time < 1000) {
      if (oncomplete == "addIcon") {
        addIcon({name: name});
      }
    }

    else if (time < 5000) {
      if (dom["countdownbar" + countdownid[name]].style.backgroundColor != "red") {
        dom["countdownbar" + countdownid[name]].style.backgroundColor = "red";
      }
    }
    else if (time < 10000) {
      if (dom["countdownbar" + countdownid[name]].style.backgroundColor != "orange") {
        dom["countdownbar" + countdownid[name]].style.backgroundColor = "orange";
      }
    }
    else if (time < 30000) {
      if (dom["countdownbar" + countdownid[name]].style.backgroundColor != "yellow") {
        dom["countdownbar" + countdownid[name]].style.backgroundColor = "yellow";
      }
    }
    else {
      if (dom["countdownbar" + countdownid[name]].style.backgroundColor != "white") {
        dom["countdownbar" + countdownid[name]].style.backgroundColor = "white";
      }
    }

    // Countdown bar animation
    if (time <= 0) {

      // Cleanup when time <= 0

      dom["countdownbar" + countdownid[name]].style.width = "0px";  // Time 0 = bar width 0
      clearInterval(interval[name]);

      if (oncomplete != "showText") {
        removeCountdownBar(name)
      }
      else {
        dom["countdowntime" + countdownid[name]].innerHTML = text;
      }
      // console.log("Interval should be closed now - writing log because of possible coding error");
    }
    else if (time < 1000) {
      // Special animation when remaining time is low
      dom["countdowntime" + countdownid[name]].innerHTML = (time / 1000).toFixed(1);
      dom["countdownbar" + countdownid[name]].style.width = Math.floor(time / 100) + "px";
    }
    else {
      dom["countdowntime" + countdownid[name]].innerHTML = Math.ceil(time / 1000);  // This appears to best mathematically mimic the displayed values for XIV...
      dom["countdownbar" + countdownid[name]].style.width = Math.min(Math.floor((time - 1000) / 1000) + 10, 70) + "px";  // Sets a max bar size
    }

    time = time - countdownIntervalTime;  // Tick down every 100 ms

  }, countdownIntervalTime);

}

export function stopCountdownBar(name) {
  clearInterval(interval[name]);
}

export function removeCountdownBar(name) {
  clearInterval(interval[name]);
  let id = countdownid[name];
  dom["countdowndiv" + id].className = "countdowndiv countdown-remove"; // Possibility of countdown getting fubared in this (left behind or something else), check later
}
