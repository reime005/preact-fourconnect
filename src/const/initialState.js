import { players } from "./boardConfig";

export const initialGameState = {
  board: {},
  hasAI: true,
  rowsCount: -1,
  columnSelected: -1,
  currentPlayer: players.NONE,
  playersTurn: false,
  isGameEnd: false
};
