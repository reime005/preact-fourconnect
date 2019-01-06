import expectRevert from './helpers/expectRevert';
import expectEvent from './helpers/expectEvent';
import getGameIdFromLogs from './helpers/getGameIdFromLogs';
import { FourConnect, payment, paymentOne, paymentTwo } from './constants';
import createGame from './helpers/createGame';
import createAndJoinGame from './helpers/createAndJoinGame';
import getOpenGameId from './helpers/getOpenGameId';
import getAllGames from './helpers/getAllGames';

contract('FourConnect', async (accounts) => {
    it('should deny joining a non existent game', async function() {
        const instance = await FourConnect.deployed();
        await expectRevert(instance.joinGame(1232));
    });
    it('allow creating a game without bid price', async function() {
        const instance = await FourConnect.deployed();
        await expectEvent(instance.newGame(), "logGameInitialized");
    });
    it('allow creating a game with correct bid price', async function() {
        const instance = await FourConnect.deployed();
        const id = await createGame(instance, paymentOne, accounts[3]);

        const bid = await instance.getBidPlayerOne.call(id, {from: accounts[3]});
        await assert.equal(bid.toString(), paymentOne);
    });
    it('should deny joining a self created game', async function() {
        const instance = await FourConnect.deployed();
        await expectRevert(
            createAndJoinGame(instance, paymentOne, paymentTwo, accounts[3], accounts[3])
        );
    });
    it('should deny joining game with equal bid prices', async function() {
        const instance = await FourConnect.deployed();
        const id = await expectRevert(
            createAndJoinGame(instance, paymentOne, paymentOne, accounts[3], accounts[4])
        );
    });
    it('player two should start', async function() {
        const instance = await FourConnect.deployed();
        const id = await createAndJoinGame(
            instance, paymentTwo, paymentOne, accounts[3], accounts[4]);

        const currentPlayer = await instance.getCurrentPlayer.call(id);
        assert.strictEqual(currentPlayer.toNumber(), 2);
    });
    it('should allow joining a normal game', async function() {
        const instance = await FourConnect.deployed();
        const id = await createGame(instance, paymentOne, accounts[0]);
        await instance.joinGame(id, {from: accounts[1], value: paymentTwo});
    });
    it('should allow joining an exclusive game', async function() {
        const instance = await FourConnect.deployed();
        await createAndJoinGame(instance, paymentOne, paymentTwo, accounts[3], accounts[4]);
    });
    it('should deny joining an exclusive game when not the 2nd player', async function() {
        const instance = await FourConnect.deployed();
        const creator = {
            from: accounts[3],
            value: paymentOne
        }
        const joiner = {
            from: accounts[4],
            value: paymentTwo
        }
        const id = await getGameIdFromLogs(instance.newRestrictedGame(accounts[2], creator));
        await expectRevert(instance.joinGame(id, joiner));
    });
    it('should deny joining a full game', async function() {
        const instance = await FourConnect.deployed();
        const id = await createAndJoinGame(instance, paymentOne, paymentTwo, accounts[3], accounts[4]);
        await expectRevert(instance.joinGame(id, {from: accounts[4], value: paymentTwo}));
    });
    it('get game id', async function() {
        const instance = await FourConnect.deployed();
        let id = await createAndJoinGame(instance, paymentOne, paymentTwo, accounts[3], accounts[4]);
        id = await createAndJoinGame(instance, paymentOne, paymentTwo, accounts[3], accounts[4]);
        id = await createAndJoinGame(instance, paymentOne, paymentTwo, accounts[3], accounts[4]);
        id = await createGame(instance, paymentOne, accounts[3]);
        id = await createGame(instance, paymentOne, accounts[4]);
        
        let currentGameId = await instance.getCurrentUID.call();
        console.log(`currentGameId: ${currentGameId}`);
        await assert.strictEqual(currentGameId - 1, id);
    });
    // it('shows all open games', async function() {
    //     const instance = await FourConnect.deployed();
    //     const firstCreatedId = await createGame(instance, paymentOne, null, accounts[4]);

    //     const openGames = await getAllGames(instance, accounts[4]);

    //     let id = await getOpenGameId(instance);
    //     while (id.toNumber() <= firstCreatedId) {
    //         console.log(id.toNumber());
    //         await instance.joinGame(id, {from: accounts[8], value: paymentTwo});
    //         id = await getOpenGameId(instance);
    //     }
    // });
}); 