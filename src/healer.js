
const healerLucidDreaming = () => {

  const addLucidMP = 8000;
  const removeLucidMP = 9000;

  if (player.level >= 24 && player.currentMP < addLucidMP && checkRecast({ name: 'Lucid Dreaming' }) < 0) {
    if (!toggle.luciddreaming) { // Toggle prevents Lucid from being added every check
      addIcon({ name: 'Lucid Dreaming', array: iconArrayA });
      toggle.luciddreaming = Date.now();
    }
  } else if (player.currentMP > removeLucidMP) {
    removeIcon({ name: 'Lucid Dreaming', array: iconArrayA });
    delete toggle.luciddreaming;
  }
};
