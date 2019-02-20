import { h, Component } from "preact";
import * as style from "./style.css";

import { addressIsZero } from "src/helpers/web3/addressIsZero";
import { Button } from "preact-material-components/ts/Button";
import "preact-material-components/Button/style.css";

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
}: Props) => {
  if (!board) {
    return (
      <div class={style.container}>
        <div>
          <Button raised onClick={joinGame}>Join a Game</Button>
          <Button raised onClick={refreshState}>Refresh</Button>
        </div>
        <div>
          <Button raised onClick={newGame}>New Game</Button>
        </div>
      </div>
    );
  }

  const isRunning = board.running === true;
  const yourTurn =
    (board.playerOne === ownPlayer && board.currentPlayer === 1) ||
    (board.playerTwo === ownPlayer && board.currentPlayer === 2);

  const isGameOver = !isRunning && !addressIsZero(board.winner);
  const winnerIsYou = isGameOver && ownPlayer === board.winner;

  // alert(ownPlayer + ' == ' + board.winner)

  return (
    <div class={style.container}>
    {/* <p>{JSON.stringify(board)}</p> */}
      <div>
        {gameIdSelector}
      </div>

      <div>
        <Button raised onClick={newGame}>New Game</Button>
      </div>

      <div>
        <Button raised onClick={joinGame}>Join a Game</Button>
        <Button raised onClick={refreshState}>Refresh</Button>
      </div>

      {!isRunning && !isGameOver && (
        <div>
          <p>The game is not running.</p>
        </div>
      )}

      {!isRunning && (
        <div>
          <Button raised onClick={cancelCreatedGame}>Cancel Created Game</Button>
        </div>
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
          <Button raised onClick={giveUp}>Give Up</Button>
        </div>
      )}

      {!yourTurn && (
        <div>
          <p>It is not your turn.</p>
          <Button raised onClick={claimTimeout}>Claim Timeout</Button>
        </div>
      )}

      {isGameOver && (
        <div>
          <p>The game is over.</p>
        </div>
      )}

      {isGameOver && winnerIsYou && (
        <div>
          <p>You are the winner.</p>
          <Button raised onClick={withdraw}>Withdraw the price</Button>
        </div>
      )}
    </div>
  );
};
