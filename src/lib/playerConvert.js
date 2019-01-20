import { players, colors } from "../const/boardConfig";

export const playerToCellColor = n => {
  switch (n) {
    case players.NONE:
      return colors.CELL_DEFAULT;
    case players.ONE:
      return colors.CELL_RED;
    case players.TWO:
      return colors.CELL_YELLOW;
  }
};

export const playerToCellSelectedColor = n => {
  switch (n) {
    case players.ONE:
      return colors.CELL_SET_RED;
    case players.TWO:
      return colors.CELL_SET_YELLOW;
    case players.NONE:
    default:
      return colors.CELL_SELECTED;
  }
};

export const playerToTextColor = n => {
  switch (n) {
    case players.NONE:
      return colors.BLACK;
    case players.ONE:
      return colors.WHITE;
    case players.TWO:
      return colors.BLACK;
  }
};
