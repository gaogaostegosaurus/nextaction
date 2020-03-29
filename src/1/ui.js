const resetNext = () => {
  /* Reset timeout and intervals */
  Object.keys(timeout).forEach((property) => { clearTimeout(timeout[property]); });
  Object.keys(interval).forEach((property) => { clearInterval(interval[property]); });
  
  document.getElementById('icon-a').innerHTML = '';
  document.getElementById('icon-b').innerHTML = '';
  document.getElementById('icon-c').innerHTML = '';
  document.getElementById('countdown-a').innerHTML = '';
  document.getElementById('countdown-b').innerHTML = '';
  document.getElementById('countdown-c').innerHTML = '';
};
