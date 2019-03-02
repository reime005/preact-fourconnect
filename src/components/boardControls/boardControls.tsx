import { Component, h } from "preact";
import * as style from "./style.css";

import { Button } from "preact-material-components/ts/Button";
import { addressIsZero } from "src/helpers/web3/addressIsZero";

interface Props {
  board: FourConnectGame | null;
  ownPlayer?: string;
  ethToWin?: string;
  gameIdSelector: any;
  newGame: () => void;
  giveUp: () => void;
  claimTimeout: () => void;
  withdraw: () => void;
  cancelCreatedGame: () => void;
  joinGame: () => void;
  refreshState: () => void;
  refreshAllState: () => void;
}

export const BoardControls = ({
  newGame,
  board,
  ethToWin,
  ownPlayer,
  giveUp,
  claimTimeout,
  withdraw,
  cancelCreatedGame,
  joinGame,
  gameIdSelector,
  refreshState,
  refreshAllState,
}: Props) => {
  // provide basic buttons even if no games yet attended
  if (!board) {
    return (
      <div class={style.container}>
        <Button raised onClick={refreshAllState}>Refresh All</Button>
        <Button raised onClick={joinGame}>Join a Game</Button>
        <Button raised onClick={newGame}>New Game</Button>
      </div>
    );
  }

  const isRunning = board.running === true;
  const yourTurn =
    (board.playerOne === ownPlayer && board.currentPlayer === 1) ||
    (board.playerTwo === ownPlayer && board.currentPlayer === 2);

  const isGameOver = !isRunning && !addressIsZero(board.winner);
  const winnerIsYou = isGameOver && ownPlayer === board.winner;

  return (
    <div class={style.container}>

      <div>
        {gameIdSelector}
      </div>

      <Button raised onClick={refreshAllState}>Refresh All</Button>
      <Button raised onClick={refreshState}>Refresh</Button>
      <Button raised onClick={joinGame}>Join a Game</Button>
      <Button raised onClick={newGame}>New Game</Button>

      {!isRunning && !isGameOver && (
        <div>
          <p>The game is not running.</p>
        </div>
      )}

      {!isRunning && (
        <Button raised onClick={cancelCreatedGame}>Cancel Created Game</Button>
      )}

      {isRunning && !isGameOver && ethToWin && (
        <div>
          <p>The game is running.</p>
          <p>There is {ethToWin} ETH to win!</p>
        </div>
      )}

      {yourTurn && (
        <div>
          <p>It is your turn.</p>
        </div>
      )}

      {yourTurn && (
        <div>
          <Button raised onClick={giveUp}>Give Up</Button>
        </div>
      )}

      {!yourTurn && (
        <div>
          <p>It is not your turn.</p>
        </div>
      )}
      {!yourTurn && (
        <div>
          <Button raised onClick={claimTimeout}>Claim Timeout</Button>
        </div>
      )}

      {isGameOver && (
        <p>The game is over.</p>
      )}

      {isGameOver && winnerIsYou && (
        <div>
          <p>You are the winner.</p>
        </div>
      )}
      {isGameOver && winnerIsYou && (
        <div>
          <Button raised onClick={withdraw}>Withdraw the price</Button>
        </div>
      )}
    </div>
  );
};
