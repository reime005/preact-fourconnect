export const boardSize = {
  columns: 7,
  rows: 6
};

export const CELL_SUM = boardSize.rows * boardSize.columns;

export const WINNER_COUNT = 4;

export const colors = {
  CELL_DEFAULT: "hsl(214.1, 51.9%, 50%)",
  CELL_SELECTED: "#ddd",
  CELL_SET_RED: "#e85d5a",
  CELL_SET_YELLOW: "#f7f297",
  CELL_RED: "#e80500",
  CELL_YELLOW: "#f7eb00",
  ROW_DEFAULT: "#185bfa",
  ROW_SELECTED: "#4b7ffa",
  BLACK: "#0f0f0f",
  WHITE: "#f0f0f0"
};

export const players = {
  NONE: 0,
  ONE: 1,
  TWO: 2
};
