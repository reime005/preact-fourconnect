import { players, CELL_SUM, boardSize } from "../const/boardConfig";
import { nextPlayer } from "./nextPlayer";

export const makeMove = (board, player = players.NONE, position = -1) => {
  if (board.currentPlayer !== player) {
    throw "Not your turn";
  }

  if (position < 0 || position > CELL_SUM) {
    throw `Incorrect move position: ${position}`;
  }

  if (board.cells[position] !== players.NONE) {
    throw 'Cell already set';
  }

  const nextRowCell = board.cells[position + boardSize.columns];


  if (nextRowCell && nextRowCell.player === players.NONE) {
    throw 'Next row is not empty!';
  }

  return {
    ...board,
    currentPlayer: nextPlayer(player),
    cells: {
      ...board.cells,
      [position]: {
        ...board.cells[position],
        player
      }
    }
  }
}

export const gameEnd = (lastPosition = -1, board, player = players.NONE) => {
  if (lastPosition < 0 || lastPosition > CELL_SUM) {
    throw `Incorrect lastPosition: ${lastPosition}`;
  }
  
  const { cells } = board;

  // direction 1: up
  // step: back / column

  if (_checkHasWonStraight(cells, -boardSize.columns, lastPosition)) {
    return true;
  } else if (_checkHasWonStraight(cells, boardSize.columns, lastPosition)) {
    return true;
  } else if (_checkHasWonStraight(cells, -1, lastPosition)) {
    return true;
  } else if (_checkHasWonStraight(cells, 1, lastPosition)) {
    return true;
  } else if (_checkHasWonDiagonal(-1, boardSize.columns, cells, lastPosition)) {
    return true;
  } else if (_checkHasWonDiagonal(1, boardSize.columns, cells, lastPosition)) {
    return true;
  } else if (_checkHasWonDiagonal(-1, -boardSize.columns, cells, lastPosition)) {
    return true;
  } else if (_checkHasWonDiagonal(1, -boardSize.columns, cells, lastPosition)) {
    return true;
  }
  
  return false;
}

const _checkHasWonDiagonal = (incrementX, incrementY, cells = {}, lastPosition = -1) => {
  if (incrementX !== 1 || incrementX !== -1) {
    throw 'Diagonal increment for X must either be "-1" or "1"';
  }

  if (incrementY !== boardSize.columns || incrementY !== -boardSize.columns) {
    throw `Diagonal increment for Y must either be "${boardSize.columns} or "-${boardSize.columns}`;
  }

  const increment = incrementX + incrementY;

  return _checkHasWonStraight(increment, cells, lastPosition);
}

const _checkHasWonStraight = (increment = 0, cells = {}, lastPosition = -1) => {
  const cellsToCheck = [];
  let i = lastPosition;

  while (i >= 0 && i <= CELL_SUM) {
    if (cells[i]) {
      cellsToCheck.push(cells[i]);
    }

    i += increment;
  }

  return _checkIndicesValid(player, cellsToCheck);
}

const _checkIndicesValid = (player = players.NONE, indices = []) => 
  indices.filter(indice => player !== players.NONE && indice.player === player)
    .length === 4;
