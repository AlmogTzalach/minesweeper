'use strict';

const MINE_IMG = '<img src="assets/img/mineRegular.png" />';
const FLAG_IMG = '<img src="assets/img/flag.png" />';

const gBoard = [];

const elTimer = document.querySelector('.timer');

let gTimerInterval;
let gTimer = 0;
let gIsFirstClick = true;

const gLevel = {
  SIZE: 4,
  MINES: 2,
};

const gGame = {
  isOn: false,
  shownCount: 0,
  markedCount: 0,
  secsPassed: 0,
};

function init() {
  clearInterval(gTimerInterval);
  gTimer = 0;
  elTimer.innerHTML = 0;
  gGame.shownCount = 0;
  gGame.markedCount = 0;
  gGame.secsPassed = 0;
  gIsFirstClick = true;
  buildBoard(gLevel.SIZE);
  renderBoard();
  preventContextMenu();
  gGame.isOn = true;
}

function buildBoard(size = 4) {
  // Build a matrix for the model
  for (let i = 0; i < size; i++) {
    gBoard[i] = [];
    for (let j = 0; j < size; j++) {
      gBoard[i][j] = {
        minesAroundCount: 0,
        isShown: false,
        isMarked: false,
        isMine: false,
      };
    }
  }
  // Add Mines
  setMines();

  // Count the mines around each cell
  for (let i = 0; i < size; i++) {
    for (let j = 0; j < size; j++) {
      gBoard[i][j].minesAroundCount = setMinesNegsCount(i, j);
    }
  }
}

function setMines() {
  // Add mines at random locations
  let minesToSet = gLevel.MINES;

  while (minesToSet !== 0) {
    let randomRowIdx = getRandomInt(0, gBoard.length - 1);
    let randomColIdx = getRandomInt(0, gBoard.length - 1);
    if (gBoard[randomRowIdx][randomColIdx].isMine) continue;
    gBoard[randomRowIdx][randomColIdx].isMine = true;
    minesToSet--;
  }
}

function setMinesNegsCount(rowIdx, colIdx) {
  // Count how many mines are next to each cell
  let minesAroundCount = 0;
  for (var i = rowIdx - 1; i <= rowIdx + 1; i++) {
    if (i < 0 || i >= gBoard.length) continue;

    for (var j = colIdx - 1; j <= colIdx + 1; j++) {
      if (j < 0 || j >= gBoard[i].length) continue;
      if (i === rowIdx && j === colIdx) continue;

      if (gBoard[i][j].isMine === true) minesAroundCount++;
    }
  }

  return minesAroundCount;
}

function renderBoard() {
  // Render the DOM using an HTML string
  let strHTML = '';
  let currCell;

  for (let i = 0; i < gBoard.length; i++) {
    strHTML += '<tr>';
    for (let j = 0; j < gBoard[i].length; j++) {
      currCell = gBoard[i][j];

      strHTML += `<td id="${
        'cell-' + i + '-' + j
      }" class="hidden-cell no-right-click" oncontextmenu="cellFlagged(this, ${
        i + ',' + j
      })"
      onclick="cellClicked(this, ${i + ',' + j})"></td>`;
    }
    strHTML += '</tr>';
  }
  var elBoard = document.querySelector('.game-board');
  elBoard.innerHTML = strHTML;
}

function preventContextMenu() {
  // Prevent right-clicking on a cell (so it can be flagged)
  const elCells = document.querySelectorAll('.no-right-click');
  for (let i = 0; i < elCells.length; i++) {
    elCells[i].addEventListener('contextmenu', (e) => {
      e.preventDefault();
    });
  }
}

function cellFlagged(elCell, i, j) {
  // Right click on a cell
  if (gIsFirstClick) startTimer();
  gIsFirstClick = false;

  let currCell = gBoard[i][j];
  if (currCell.isShown || !gGame.isOn) return;

  if (!currCell.isMarked) {
    currCell.isMarked = true;
    gGame.markedCount++;
  } else {
    currCell.isMarked = false;
    gGame.markedCount--;
  }
  if (elCell.innerHTML === '') elCell.innerHTML = FLAG_IMG;
  else elCell.innerHTML = '';
  checkVictory();
}

function cellClicked(elCell, rowIdx, colIdx) {
  // Left click on a cell
  if (gIsFirstClick) startTimer();
  gIsFirstClick = false;

  let currCell = gBoard[rowIdx][colIdx];
  if (currCell.isShown || !gGame.isOn || currCell.isMarked) return;

  if (currCell.isMine) {
    gameOver();
    return;
  }

  gBoard[rowIdx][colIdx].isShown = true;
  gGame.shownCount++;
  elCell.classList.add('revealed-cell');
  elCell.classList.remove('hidden-cell');
  checkVictory();

  if (currCell.minesAroundCount !== 0)
    elCell.innerHTML = currCell.minesAroundCount;
  else fullyExpand(rowIdx, colIdx);
}

function checkVictory() {
  // Check conditions for victory
  if (gGame.markedCount !== gLevel.MINES) return;

  let currCell;
  let minesFlagged = 0;
  let shownCount = 0;
  for (let i = 0; i < gBoard.length; i++) {
    for (let j = 0; j < gBoard[i].length; j++) {
      currCell = gBoard[i][j];
      if (currCell.isMarked && currCell.isMine) minesFlagged++;
      if (currCell.isShown) shownCount++;
    }
  }
  if (
    minesFlagged === gLevel.MINES &&
    shownCount === gLevel.SIZE ** 2 - gLevel.MINES
  ) {
    clearInterval(gTimerInterval);
    gGame.isOn = false;
    alert('You win');
  } else {
    return;
  }
}

function gameOver() {
  // Check conditions for game loss
  clearInterval(gTimerInterval);
  gGame.isOn = false;
  let currCell;
  let elCell;
  for (let i = 0; i < gBoard.length; i++) {
    for (let j = 0; j < gBoard[i].length; j++) {
      elCell = document.querySelector(`#cell-${i}-${j}`);
      currCell = gBoard[i][j];
      if (currCell.isMine) elCell.innerHTML = MINE_IMG;
    }
  }
  alert('You lose');
}

function startTimer() {
  // Start the timer
  const elTimer = document.querySelector('.timer');

  gTimerInterval = setInterval(() => {
    gTimer += 17;
    elTimer.innerHTML = parseFloat(gTimer / 1000);
  }, 17);
}

function changeDifficulty(size, numOfMines) {
  // Change the game difficulty via buttons
  gBoard.splice(0, gBoard.length);
  gLevel.SIZE = size;
  gLevel.MINES = numOfMines;
  init();
}

function fullyExpand(rowIdx, colIdx) {
  for (var i = rowIdx - 1; i <= rowIdx + 1; i++) {
    if (i < 0 || i >= gBoard.length) continue;

    for (var j = colIdx - 1; j <= colIdx + 1; j++) {
      if (j < 0 || j >= gBoard[i].length) continue;
      if (i === rowIdx && j === colIdx) continue;

      let elCell = document.querySelector(`#cell-${i}-${j}`);
      if (gBoard[i][j].isShown) continue;
      gBoard[rowIdx][colIdx].isShown = true;
      gGame.shownCount++;
      elCell.classList.add('revealed-cell');
      elCell.classList.remove('hidden-cell');
      checkVictory();

      cellClicked(elCell, i, j);
    }
  }
}
