'use strict';

let gExtraFeatures = false;
let isHint = false;
let gHintCellLocation;

// Enable/Disable the special features (Extra Lives, Hints, etc.)
function addExtraFeatures() {
  gExtraFeatures = !gExtraFeatures;
  toggleFeaturesPanel();
}

// Toggle the special features panel on/off
function toggleFeaturesPanel() {
  const elFeaturesPanel = document.querySelector('.features-panel');
  elFeaturesPanel.classList.toggle('hide');
}

// Reset the counters for the special features on game restart
function resetFeatures() {
  resetHints();
  resetLives();
}

// Make all light bulbs (hints) appear unlit
function resetHints() {
  const elLightBulbs = document.querySelectorAll('.hint-used');
  for (let i = 0; i < elLightBulbs.length; i++) {
    elLightBulbs[i].classList.remove('hint-used');
    elLightBulbs[i].classList.add('hint-unused');
    elLightBulbs[i].src = 'assets/img/hintUnused.png';
  }
}

// Reset the three lives counter
function resetLives() {
  gGame.lives = 3;
  const elLives = document.querySelectorAll('.heart');
  for (let i = 0; i < elLives.length; i++) {
    elLives[i].classList.remove('hide');
  }
}

// Make light bulb (hint) appear used and enable hint
function hintUsed(elLightBulb) {
  if (isHint) return;
  if (elLightBulb.classList.contains('hint-used')) return;
  gGame.isOn = false;
  isHint = true;
  elLightBulb.src = 'assets/img/hintUsed.png';
  elLightBulb.classList.remove('hint-unused');
  elLightBulb.classList.add('hint-used');
}

// Make the cell and surrounding cell shown for 1 second
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
