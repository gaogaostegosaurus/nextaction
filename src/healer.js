
const healerLucidDreaming = () => {

  const addLucidMP = 8000;
  const removeLucidMP = 9000;

  if (player.level >= 24 && player.mp < addLucidMP && checkRecast({ name: 'Lucid Dreaming' }) < 0) {
    if (!toggle.luciddreaming) { // Toggle prevents Lucid from being added every check
      addIcon({ name: 'Lucid Dreaming', iconArray: iconArrayA });
      toggle.luciddreaming = Date.now();
    }
  } else if (player.mp > removeLucidMP) {
    removeIcon({ name: 'Lucid Dreaming', iconArray: iconArrayA });
    delete toggle.luciddreaming;
  }
};
