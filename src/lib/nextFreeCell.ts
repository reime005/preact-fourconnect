import { boardSize, CELL_SUM, players } from "../const/boardConfig";

export const nextFreeCell = (column, board) => {
  for (
    let i = CELL_SUM - boardSize.columns + column;
    i >= 0;
    i -= boardSize.columns
  ) {
    if (board.cells[i] == players.NONE) {
      return i;
    }
  }

  throw new Error("No empty cells in this column");
};
