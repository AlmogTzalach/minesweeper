'use strict';

let gExtraFeatures = false;
let isHint = false;
let gHintCellLocation;

function addExtraFeatures() {
  gExtraFeatures = !gExtraFeatures;
  toggleFeaturesPanel();
}

function toggleFeaturesPanel() {
  const elFeaturesPanel = document.querySelector('.features-panel');
  elFeaturesPanel.classList.toggle('hide');
}

function resetFeatures() {
  resetHints();
  resetLives();
}

function resetHints() {
  const elLightBulbs = document.querySelectorAll('.hint-used');
  for (let i = 0; i < elLightBulbs.length; i++) {
    elLightBulbs[i].classList.remove('hint-used');
    elLightBulbs[i].classList.add('hint-unused');
    elLightBulbs[i].src = 'assets/img/hintUnused.png';
  }
}

function resetLives() {
  gGame.lives = 3;
  const elLives = document.querySelectorAll('.heart');
  for (let i = 0; i < elLives.length; i++) {
    elLives[i].classList.remove('hide')
  }
}

function hintUsed(elLightBulb) {
  if (elLightBulb.classList.contains('hint-used')) return;
  gGame.isOn = false;
  isHint = true;
  elLightBulb.src = 'assets/img/hintUsed.png';
  elLightBulb.classList.remove('hint-unused');
  elLightBulb.classList.add('hint-used');
}

function hintClicked(rowIdx, colIdx) {
  if (!isHint) return;

  gHintCellLocation = { i: rowIdx, j: colIdx };

  for (var i = rowIdx - 1; i <= rowIdx + 1; i++) {
    if (i < 0 || i >= gBoard.length) continue;

    for (var j = colIdx - 1; j <= colIdx + 1; j++) {
      if (j < 0 || j >= gBoard[i].length) continue;
      let currCell = gBoard[i][j];
      const elCell = document.querySelector(`#cell-${i}-${j}`);
      elCell.classList.add('revealed-cell');
      elCell.classList.remove('hidden-cell');
      if (!currCell.isMine)
        elCell.innerHTML = currCell.minesAroundCount
          ? currCell.minesAroundCount
          : '';
      else elCell.innerHTML = MINE_IMG;
    }
  }
  setTimeout(() => {
    gHintCellLocation.i = rowIdx;
    gHintCellLocation.j = colIdx;

    for (var i = rowIdx - 1; i <= rowIdx + 1; i++) {
      if (i < 0 || i >= gBoard.length) continue;

      for (var j = colIdx - 1; j <= colIdx + 1; j++) {
        if (j < 0 || j >= gBoard[i].length) continue;
        if (gBoard[i][j].isShown) continue;
        const elCell = document.querySelector(`#cell-${i}-${j}`);
        elCell.classList.remove('revealed-cell');
        elCell.classList.add('hidden-cell');
        elCell.innerHTML = '';
      }
    }
  }, 1000);

  gGame.isOn = true;
  isHint = false;
}

function safeClickUsed() {}
