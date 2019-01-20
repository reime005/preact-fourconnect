import { CELL_SUM, players } from "../const/boardConfig";

export const newBoard = (currentPlayer = players.ONE) => ({
  cells: Array.from({ length: CELL_SUM }, () => players.NONE),
  currentPlayer,
  isGameEnd: false
});
