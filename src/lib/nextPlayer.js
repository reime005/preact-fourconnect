import { players } from "../const/boardConfig";

export const nextPlayer = n => {
  return players.ONE === n ? players.TWO : players.ONE;
};
