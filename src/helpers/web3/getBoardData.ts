import { FourConnectListener } from './FourConnectListener';

export const getBoardData = async (fourconnectListener: FourConnectListener, gameId: number) => {
  return new Promise<{ cells: number[], running: boolean, lastTimePlayed: Date, playerOne: string, playerTwo: string, bidPlayerOne: string, currentPlayer: number, bidPlayerTwo: string, creationTime: Date }>(async (res) => {
      let cells: any[] = [];
      let running = false;
      let lastTimePlayed = new Date();
      let creationTime = new Date();
      let playerOne = '';
      let playerTwo = '';
      let currentPlayer = 0;
      let bidPlayerOne = '';
      let bidPlayerTwo = '';

      try {
        cells = await fourconnectListener.callMethod('getBoard', gameId);
        cells = cells.map(cell => Number(cell));

        const lastTimePlayedN = await fourconnectListener.callMethod('getLastTimePlayed', gameId);
        lastTimePlayed = new Date(Number(lastTimePlayedN));

        const creationTimeN = await fourconnectListener.callMethod('getCreationTime', gameId);
        creationTime = new Date(Number(creationTimeN));

        bidPlayerOne = await fourconnectListener.callMethod('getBidPlayerOne', gameId);
        bidPlayerTwo = await fourconnectListener.callMethod('getBidPlayerTwo', gameId);
        currentPlayer = await fourconnectListener.callMethod('getCurrentPlayer', gameId);
        running = await fourconnectListener.callMethod('getRunning', gameId);
        playerOne = await fourconnectListener.callMethod('getPlayerOne', gameId);
        playerTwo = await fourconnectListener.callMethod('getPlayerTwo', gameId);
      } catch (error) {
        console.warn(error);
      }

      res({ cells, running, lastTimePlayed, playerOne, playerTwo, currentPlayer, bidPlayerOne, bidPlayerTwo, creationTime });
  });
}