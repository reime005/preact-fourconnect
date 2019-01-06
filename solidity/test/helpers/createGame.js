import getGameIdFromLogs from './getGameIdFromLogs';

export default async function createGame(instance, bid, player1, player2 = null) {
    if (player2 == null) {
        let id = getGameIdFromLogs(
            instance.newGame({from: player1, value: bid})
        );
        return id;
    } else {
        let id = getGameIdFromLogs(
            instance.newRestrictedGame(player2, {from: player1, value: bid})
        );
        return id;
    }
}