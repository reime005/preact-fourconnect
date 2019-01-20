import { players, CELL_SUM, boardSize } from "../const/boardConfig";
import { nextPlayer } from "./nextPlayer";

export const makeMove = (board, player = players.NONE, position = -1) => {
  if (board.isGameEnd) {
    throw "Game has ended";
  }

  if (board.currentPlayer !== player) {
    throw "Not your turn";
  }

  if (position < 0 || position >= CELL_SUM) {
    throw `Incorrect move position: ${position}`;
  }

  if (board.cells[position] && board.cells[position] !== players.NONE) {
    throw "Cell already set";
  }

  const nextRowCell = board.cells[position + boardSize.columns];

  if (nextRowCell && nextRowCell === players.NONE) {
    throw "Next row is not empty!";
  }

  let cells = [...board.cells];

  cells[position] = player;

  return {
    ...board,
    currentPlayer: nextPlayer(player),
    cells
  };
};

export const makeAIMove = (board, player = players.TWO) => {
  const { cells } = board;

  let position = -1;

  for (let i = cells.length - 1; i >= 0; i--) {
    if (cells[i] === players.NONE) {
      position = i;
      break;
    }
  }

  if (position === -1) {
    throw "No more empty cells";
  }

  board = makeMove(board, player, position);

  board = gameEnd(position, board, player);

  return board;
};

export const gameEnd = (lastPosition = -1, board) => {
  if (lastPosition < 0 || lastPosition > CELL_SUM) {
    throw `Incorrect lastPosition: ${lastPosition}`;
  }

  const lastPlayer = nextPlayer(board.currentPlayer);

  const { cells } = board;

  let isGameEnd = false;
  let currentPlayer = board.currentPlayer;

  // go to the most left position --> straight horizontal check
  const getMostLeftPosition = lastPosition => {
    while (lastPosition % boardSize.columns !== 0) {
      lastPosition--;
    }

    return lastPosition;
  };

  // go to the most bottom positon --> straight vertical check
  const getMostBottomPositon = lastPosition => {
    const cols = boardSize.columns;

    while (lastPosition + cols < CELL_SUM) {
      lastPosition += cols;
    }

    return lastPosition;
  };

  // go to the most bottom left position --> right diagonal check
  const getMostBottomLeftPositon = lastPosition => {
    const cols = boardSize.columns;

    while (
      lastPosition + cols < CELL_SUM &&
      lastPosition % boardSize.columns !== 0
    ) {
      lastPosition += cols;
      lastPosition -= 1;
    }

    return lastPosition;
  };

  // go to the most bottom right position --> left diagonal check
  const getMostBottomRightPositon = lastPosition => {
    const cols = boardSize.columns;

    while (
      lastPosition + cols < CELL_SUM &&
      (lastPosition + 1) % boardSize.columns !== 0
    ) {
      lastPosition += cols;
      lastPosition += 1;
    }

    return lastPosition;
  };

  if (_checkHasWon(cells, 1, getMostLeftPosition(lastPosition), lastPlayer)) {
    isGameEnd = true;
  } else if (
    _checkHasWon(
      cells,
      -boardSize.columns,
      getMostBottomPositon(lastPosition),
      lastPlayer
    )
  ) {
    isGameEnd = true;
  } else if (
    _checkHasWonDiagonal(
      1,
      -boardSize.columns,
      cells,
      getMostBottomLeftPositon(lastPosition),
      lastPlayer
    )
  ) {
    isGameEnd = true;
  } else if (
    _checkHasWonDiagonal(
      -1,
      -boardSize.columns,
      cells,
      getMostBottomRightPositon(lastPosition),
      lastPlayer
    )
  ) {
    isGameEnd = true;
  }

  if (isGameEnd) {
    currentPlayer = nextPlayer(lastPlayer);
  }

  return { ...board, isGameEnd, currentPlayer };
};

const _checkHasWonDiagonal = (
  incrementX,
  incrementY,
  cells = {},
  lastPosition = -1,
  player
) => {
  if (incrementX != 1 && incrementX != -1) {
    throw 'Diagonal increment for X must either be "-1" or "1"';
  }

  if (incrementY !== boardSize.columns && incrementY !== -boardSize.columns) {
    throw `Diagonal increment for Y must either be "${boardSize.columns} or "-${
      boardSize.columns
    }`;
  }

  const increment = incrementX + incrementY;

  return _checkHasWon(cells, increment, lastPosition, player);
};

const _checkHasWon = (cells = {}, increment = 0, lastPosition = -1, player) => {
  const cellsToCheck = [];
  let i = lastPosition;

  // stay inside the tresholds and max 4 in a row
  while (i >= 0 && i <= cells.length && cellsToCheck.length < 4) {
    // if we already found one player and now found someone else
    if (cells[i] !== player && cellsToCheck.length > 0) {
      cellsToCheck.pop();
    } else if (cells[i] === player) {
      cellsToCheck.push(cells[i]);
    }

    // if we are on the edge of a row
    // note that an increment if 1 means straight
    if ((i + 1) % boardSize.columns === 0 && increment === 1) {
      break;
    }

    i += increment;
  }

  if (increment === 1 && cellsToCheck.length !== 4) {
    return false;
  }

  return _checkIndicesValid(player, cellsToCheck);
};

const _checkIndicesValid = (player, indices = []) =>
  indices.reduce((sum, i) => sum + (i === player ? 1 : 0), 0) === 4;
