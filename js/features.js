'use strict';

let gExtraLives = false;

function addLives(elToggle) {
  gExtraLives = !gExtraLives;
  const elLivesSpan = document.querySelector('.lives');
  if (gExtraLives) {
    elLivesSpan.style.display = 'block';
    elLivesSpan.innerText = 'Lives: ' + gGame.lives;
  } else {
    elLivesSpan.style.display = 'none';
  }
}
