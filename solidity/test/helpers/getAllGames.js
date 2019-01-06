import convertToDate from "./convertToDate";

//TODO: wait for solidity struct return to be stable with truffle and web3
export default async (instance, address) => {
    let games = [];
    let game = {};

    let error = null;
    let i = 0;

    while (!error) {
        try {
            let playerOne = await instance.getPlayerOne.call(i);
            let playerTwo = await instance.getPlayerTwo.call(i);
            /* TODO: hack:
                address provided by meta mask injected instance:
                0x3172056805eE17948F9631fa4cBB43f196ab5235

                correct address in contract:
                0x3172056805ee17948f9631fa4cbb43f196ab5235
            */
            // if (playerOne === address || playerTwo === address) {
                let board = await instance.getBoard.call(i);
                let currentPlayer = await instance.getCurrentPlayer.call(i);
                let winner = await instance.getWinner.call(i);
                let running = await instance.getRunning.call(i);
                let lastTimePlayed = await instance.getLastTimePlayed.call(i);
                lastTimePlayed = convertToDate(lastTimePlayed);
                let bidPlayerOne = await instance.getBidPlayerOne.call(i);
                let bidPlayerTwo = await instance.getBidPlayerTwo.call(i);

                let creationTime = await instance.getCreationTime.call(i);
                creationTime = convertToDate(creationTime);

                game = {
                    id: i,
                    playerOne: playerOne,
                    playerTwo, playerTwo,
                    board: board.map(Number),
                    creationTime: creationTime,
                    lastTimePlayed: lastTimePlayed,
                    currentPlayer: currentPlayer.toNumber(),
                    winner: winner,
                    running: running,
                    bidPlayerOne: bidPlayerOne,
                    bidPlayerTwo: bidPlayerTwo,
                };

                games.push(game);
            // }
        } catch (e) {
            error = e;
        }
        i++;
    }

    return games;
}