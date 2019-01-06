import createGame from './createGame';

export default async function createAndJoinGame(instance, bid1, bid2, player1, player2) {
    const id = await createGame(instance, bid1, player1, player2);
    
    await instance.joinGame(id, {from: player2, value: bid2});

    return id;
}